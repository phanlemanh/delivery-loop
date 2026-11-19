// soan.mjs — chế độ --soan của chuyen-kho: bản vá ĐỀ XUẤT cho phần chung (K1, K2, K3), in ra stdout dạng diff hợp nhất.
// Không ghi gì vào kho đích. Tệp tạm của `git diff --no-index` nằm ở thư mục tạm của hệ điều hành và bị xoá ngay.
// Kiểm round-trip: chuyen-kho.test.mjs áp bản vá này bằng `git apply` rồi chạy lại bộ đọc.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { CHO_CU, CHO_MOI, GOC_PLUGIN, KHO_MOI, KHUON_TAG_MOI, PLUGIN_MOI, TAG_DE_XUAT, pluginCu } from './luat.mjs';

const DONG_GHIM = /^(\s*(?:-\s*)?KIT_(?:TAG|REF)\s*[:=]\s*["']?)([^"'\s#]+)/;
const GOC_DAT_BANG = /(CLAUDE_PLUGIN_ROOT=["']?)([^"'\s]+)/;

function batMoi(bat, bang) {
  const duoi = `@${CHO_CU}`;
  const khoaMoi = PLUGIN_MOI.map(p => `${p}@${CHO_MOI}`);
  const khoaCu = pluginCu(bang).map(p => `${p}${duoi}`);
  const doi = Object.fromEntries(khoaCu.map((k, i) => [k, khoaMoi[i]]));
  const giu = Object.entries(bat).filter(([k]) => !k.endsWith(duoi) || doi[k]).map(([k, v]) => [doi[k] ?? k, v]);
  const la = Object.keys(bat).filter(k => k.endsWith(duoi) && !doi[k]);
  return {
    ...Object.fromEntries(giu),
    ...Object.fromEntries(khoaMoi.map(k => [k, true])),
    ...Object.fromEntries([...khoaCu, ...la].map(k => [k, false])),
  };
}

function choMoi(cho) {
  const khaiMoi = cho[CHO_MOI] ?? { source: { source: 'github', repo: KHO_MOI, ref: TAG_DE_XUAT } };
  const giu = Object.entries(cho).filter(([k]) => k !== CHO_MOI || !(CHO_CU in cho)).map(([k, v]) => (k === CHO_CU ? [CHO_MOI, khaiMoi] : [k, v]));
  return { ...Object.fromEntries(giu), [CHO_MOI]: khaiMoi };
}

/** settings.json đề xuất: bật sáu plugin chợ mới ở đúng chỗ tên cũ, tắt đích danh sáu plugin chợ cũ, thay chợ. Không sửa đầu vào. */
export function soanCaiDat(caiDat, bang) {
  return {
    ...caiDat,
    enabledPlugins: batMoi(caiDat.enabledPlugins ?? {}, bang),
    extraKnownMarketplaces: choMoi(caiDat.extraKnownMarketplaces ?? {}),
  };
}

function soanDong(d) {
  const doiCho = d.replaceAll(CHO_CU, CHO_MOI);
  const doiTag = doiCho.replace(DONG_GHIM, (ca, dau, giaTri) => (KHUON_TAG_MOI.test(giaTri) ? ca : `${dau}${TAG_DE_XUAT}`));
  return doiTag.replace(GOC_DAT_BANG, (ca, dau, giaTri) => (giaTri.endsWith(GOC_PLUGIN) ? ca : `${dau}${giaTri}${GOC_PLUGIN}`));
}

/** Workflow đề xuất: đổi kho kéo, nâng dòng ghim lên TAG_DE_XUAT, trỏ CLAUDE_PLUGIN_ROOT vào plugins/acceptance-gate. */
export function soanWorkflow(noiDung) {
  return noiDung.split('\n').map(soanDong).join('\n');
}

/** Diff hợp nhất giữa hai nội dung của MỘT tệp, tiêu đề mang đường dẫn trong kho đích. Giống nhau thì trả chuỗi rỗng. */
export function banVa(tep, cu, moi) {
  if (cu === moi) return '';
  const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'chuyen-kho-soan-'));
  try {
    fs.writeFileSync(path.join(tam, 'cu'), cu);
    fs.writeFileSync(path.join(tam, 'moi'), moi);
    const r = spawnSync('git', ['diff', '--no-index', '--no-color', '--no-ext-diff', '--', 'cu', 'moi'], { cwd: tam, encoding: 'utf8' });
    if (r.error || r.status !== 1) throw new Error(`soan: git diff --no-index trả mã ${r.status}: ${r.error?.message ?? r.stderr}`);
    const cacDong = r.stdout.split('\n');
    const dau = cacDong.findIndex(d => d.startsWith('@@'));
    if (dau < 0) throw new Error(`soan: không thấy khối @@ trong diff của ${tep}`);
    return [`diff --git a/${tep} b/${tep}`, `--- a/${tep}`, `+++ b/${tep}`, ...cacDong.slice(dau)].join('\n');
  } finally {
    fs.rmSync(tam, { recursive: true, force: true });
  }
}

const laJsonChuan = chu => { try { return `${JSON.stringify(JSON.parse(chu), null, 2)}\n` === chu; } catch { return false; } };

/**
 * Ghép bản vá cho phần chung. dauVao: { tepCaiDat, chuCaiDat, workflow: [{ tep, noiDung }] đã lọc còn tệp kéo kit }.
 * Trả mảng khối { nhan, diff } — diff rỗng nghĩa là tệp ấy không cần vá.
 */
export function soanBanVa({ tepCaiDat, chuCaiDat, workflow }, bang) {
  const moi = `${JSON.stringify(soanCaiDat(JSON.parse(chuCaiDat), bang), null, 2)}\n`;
  const luuY = laJsonChuan(chuCaiDat) ? '' : ' — lưu ý: tệp gốc không ở dạng JSON thụt 2 dấu cách, bản vá kèm cả đổi định dạng';
  const khoiCaiDat = { nhan: `K1+K2: ${tepCaiDat}${luuY}`, diff: banVa(tepCaiDat, chuCaiDat, moi) };
  const khoiWorkflow = workflow.map(w => ({ nhan: `K3: ${w.tep}`, diff: banVa(w.tep, w.noiDung, soanWorkflow(w.noiDung)) }));
  return [khoiCaiDat, ...khoiWorkflow];
}
