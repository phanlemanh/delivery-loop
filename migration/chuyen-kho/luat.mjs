// luat.mjs — luật kiểm K1–K6 của chuyen-kho. Toàn hàm thuần: nhận dữ liệu ĐÃ đọc, trả { ma, dat, lyDo }.
// Không hàm nào ở đây chạm đĩa hay git; phần đọc nằm ở chuyen-kho.mjs.
//
// Hình dạng luật rút từ ba cây thật của onehub-inventory (47d52b06^1 · 47d52b06 · f6c47332) và một lần đọc kho crm:
//   - chợ khai ở extraKnownMarketplaces, plugin ở enabledPlugins của .claude/settings.json;
//   - workflow kéo kit ghim bằng KIT_TAG (Inventory) hoặc KIT_REF (crm); CLAUDE_PLUGIN_ROOT đặt bằng dòng echo … >> $GITHUB_ENV;
//   - tệp mang ngày trong tên (docs/superpowers/plans/2026-11-18-….md) nhắc tên cũ để KỂ LẠI cuộc chuyển — là lịch sử;
//   - tệp kiểm (tests/kit-root.test.ts) nêu khoá chợ cũ chỉ để khẳng định khoá ấy bị bỏ qua.

export const CHO_MOI = 'delivery-loop';
export const CHO_CU = 'acceptance-gate-kit';
export const KHO_MOI = 'phanlemanh/delivery-loop';
export const PLUGIN_MOI = ['acceptance-gate', 'feature-loop', 'diagram-design', 'dispatch', 'roadmap', 'knowledge'];
export const TEP_CAI_DAT = '.claude/settings.json';
export const THU_MUC_WORKFLOW = '.github/workflows';
export const GOC_PLUGIN = '/plugins/acceptance-gate';
export const TAG_DE_XUAT = 'v3.0.0';
export const KHUON_TAG_MOI = /^v3\.\d+/;

const KEO_KIT = /phanlemanh\/(?:acceptance-gate-kit|delivery-loop)|\bKIT_(?:TAG|REF)\b/;
const DONG_GHIM = /^\s*(?:-\s*)?(KIT_(?:TAG|REF))\s*[:=]\s*["']?([^"'\s#]+)/;
const GOC_DAT_BANG = /CLAUDE_PLUGIN_ROOT=["']?([^"'\s]+)/;
const GOC_DAT_YAML = /^\s*CLAUDE_PLUGIN_ROOT:\s*(.+?)\s*$/;
const TEN_CO_NGAY = /^\d{4}-\d{2}-\d{2}-/;
const NHAT_KY_THAY_DOI = /^(?:changelog|history)(?:\.|$)/i;
const TAI_LIEU = /\.(?:md|mdx|markdown|txt|rst|adoc|html?)$/i;
const TEP_KIEM = /\.(?:test|spec)\.[a-z]+$/i;
const THU_MUC_KIEM = ['tests', 'test', '__tests__'];
const KHOA_CHO_CU = new RegExp(`[A-Za-z][\\w-]*@${CHO_CU}(?![\\w-])`, 'g');

const hien = v => (v === undefined ? 'không có dòng' : `= ${JSON.stringify(v)}`);
const thoat = s => s.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
const dong = (ma, dat, lyDo) => ({ ma, dat, lyDo });

/** Tên CŨ của sáu plugin, cùng thứ tự với PLUGIN_MOI — suy từ bảng tên, không gõ lại. */
export function pluginCu(bang) {
  const nguoc = Object.fromEntries(Object.entries(bang.plugin ?? {}).map(([cu, moi]) => [moi, cu]));
  return PLUGIN_MOI.map(moi => nguoc[moi] ?? moi);
}

export function kiemK1(caiDat) {
  const hong = [];
  const cho = caiDat.extraKnownMarketplaces?.[CHO_MOI];
  const noi = String(cho?.source?.repo ?? cho?.source?.url ?? '');
  if (!cho) hong.push(`extraKnownMarketplaces không khai chợ «${CHO_MOI}»`);
  else if (!noi.includes(KHO_MOI)) hong.push(`chợ «${CHO_MOI}» trỏ «${noi || '(trống)'}», cần ${KHO_MOI}`);
  const bat = caiDat.enabledPlugins ?? {};
  for (const khoa of PLUGIN_MOI.map(p => `${p}@${CHO_MOI}`)) {
    if (bat[khoa] !== true) hong.push(`enabledPlugins["${khoa}"] ${hien(bat[khoa])}, cần true`);
  }
  if (hong.length > 0) return dong('K1', false, `${TEP_CAI_DAT}: ${hong.join('; ')}`);
  const ghim = cho.source?.ref ? `ref ${cho.source.ref}` : 'không ghim ref';
  return dong('K1', true, `${TEP_CAI_DAT}: khai chợ «${CHO_MOI}» (${noi}, ${ghim}); bật đủ ${PLUGIN_MOI.length} plugin @${CHO_MOI}`);
}

export function kiemK2(caiDat, bang) {
  const bat = caiDat.enabledPlugins ?? {};
  const duoi = `@${CHO_CU}`;
  const sau = pluginCu(bang).map(p => `${p}${duoi}`);
  const khoa = [...new Set([...sau, ...Object.keys(bat).filter(k => k.endsWith(duoi))])];
  const hong = khoa.filter(k => bat[k] !== false).map(k => `"${k}" (${hien(bat[k])})`);
  const conCho = caiDat.extraKnownMarketplaces?.[CHO_CU] ? ` — ghi chú: extraKnownMarketplaces còn khai chợ «${CHO_CU}»` : '';
  if (hong.length > 0) {
    return dong('K2', false, `${TEP_CAI_DAT}: chưa tắt đích danh ${hong.length}/${khoa.length} plugin chợ cũ: ${hong.join(', ')}${conCho}`);
  }
  return dong('K2', true, `${TEP_CAI_DAT}: ${khoa.length} plugin …${duoi} đều tắt đích danh (false)${conCho}`);
}

function timGhim(cacDong) {
  return cacDong.map((d, i) => ({ so: i + 1, m: DONG_GHIM.exec(d) })).filter(x => x.m)
    .map(x => ({ so: x.so, ten: x.m[1], giaTri: x.m[2] }));
}

function timGocPlugin(cacDong) {
  return cacDong.map((d, i) => ({ so: i + 1, m: GOC_DAT_BANG.exec(d) ?? GOC_DAT_YAML.exec(d) })).filter(x => x.m)
    .map(x => ({ so: x.so, giaTri: x.m[1].replace(/^["']|["']$/g, '') }));
}

/** Mọi chỗ chưa đạt của MỘT workflow kéo kit, và phần mô tả khi nó đạt. */
function xetWorkflow({ tep, noiDung }) {
  const cacDong = noiDung.split('\n');
  const ghim = timGhim(cacDong);
  const goc = timGocPlugin(cacDong);
  const loi = cacDong.flatMap((d, i) => (d.includes(CHO_CU) ? [`${tep}:${i + 1} còn «${CHO_CU}»`] : []));
  if (!noiDung.includes(KHO_MOI)) loi.push(`${tep}: không kéo từ ${KHO_MOI}`);
  if (ghim.length === 0) loi.push(`${tep}: không thấy dòng ghim KIT_TAG`);
  for (const g of ghim) if (!KHUON_TAG_MOI.test(g.giaTri)) loi.push(`${tep}:${g.so} ${g.ten} = ${g.giaTri}, cần v3.x`);
  for (const g of goc) {
    if (!g.giaTri.endsWith(GOC_PLUGIN)) loi.push(`${tep}:${g.so} CLAUDE_PLUGIN_ROOT = ${g.giaTri}, cần …${GOC_PLUGIN}`);
  }
  const taGoc = goc.length > 0 ? `CLAUDE_PLUGIN_ROOT ${goc.map(g => g.giaTri).join(', ')}` : 'không đặt CLAUDE_PLUGIN_ROOT';
  return { loi, ta: `${tep}: kéo ${KHO_MOI}, ${ghim.map(g => `${g.ten} ${g.giaTri}`).join(', ')}, ${taGoc}` };
}

export const keoKit = noiDung => KEO_KIT.test(noiDung);

/** workflow: [{ tep, noiDung }] — mọi tệp dưới .github/workflows. */
export function kiemK3(workflow) {
  const keo = workflow.filter(w => keoKit(w.noiDung));
  if (keo.length === 0) {
    return dong('K3', true, `không có workflow kéo kit (đã đọc ${workflow.length} tệp dưới ${THU_MUC_WORKFLOW}) — ghi chú: không có gì để kiểm`);
  }
  const xet = keo.map(xetWorkflow);
  const loi = xet.flatMap(x => x.loi);
  return loi.length > 0 ? dong('K3', false, loi.join('; ')) : dong('K3', true, xet.map(x => x.ta).join('; '));
}

/** Tệp lịch sử: không tính là «tệp sống» cho K4 và K5. `_acceptance/config.yaml` là cấu hình đang chạy nên vẫn sống. */
export function laLichSu(tep) {
  const khuc = tep.split('/');
  const ten = khuc[khuc.length - 1];
  if (khuc.includes('.git') || khuc.includes('node_modules')) return true;
  if (tep.startsWith('_acceptance/') && tep !== '_acceptance/config.yaml') return true;
  if (tep === 'wiki/log.md' || NHAT_KY_THAY_DOI.test(ten)) return true;
  return khuc.some(k => TEN_CO_NGAY.test(k));
}

/** Tệp mã/công cụ sống cho K4: không phải lịch sử, không phải tài liệu, không phải tệp kiểm, không phải settings.json. */
export function laMaSong(tep) {
  const khuc = tep.split('/');
  if (laLichSu(tep) || tep === TEP_CAI_DAT || TAI_LIEU.test(tep)) return false;
  return !TEP_KIEM.test(tep) && !khuc.some(k => THU_MUC_KIEM.includes(k));
}

function quetDong(tepNoiDung, khuon) {
  return tepNoiDung.flatMap(({ tep, noiDung }) => noiDung.split('\n').flatMap((d, i) =>
    [...d.matchAll(khuon)].map(m => ({ tep, so: i + 1, chu: m[0] }))));
}

/** ungVien: [{ tep, noiDung }] — tệp có chuỗi «@acceptance-gate-kit»; tệp không phải mã sống bị lọc ở đây. */
export function kiemK4(ungVien) {
  const cho = quetDong(ungVien.filter(u => laMaSong(u.tep)), KHOA_CHO_CU);
  if (cho.length === 0) {
    return dong('K4', true, `không tệp mã/công cụ sống nào còn khoá «…@${CHO_CU}» (dòng tắt ở ${TEP_CAI_DAT} không tính; bỏ qua tài liệu, tệp kiểm, hồ sơ lịch sử)`);
  }
  return dong('K4', false, `${cho.length} chỗ còn khoá chợ cũ, cần người sửa: ${cho.map(c => `${c.tep}:${c.so} ("${c.chu}")`).join('; ')}`);
}

function tachTenCu(bang) {
  const plugin = Object.keys(bang.plugin ?? {});
  return { plugin, rieng: Object.keys(bang.lenh ?? {}).filter(l => !plugin.includes(l.split(':')[0])) };
}

/** Chuỗi cố định để lọc thô tệp ứng viên cho K5 (git grep -F), suy từ bảng tên. */
export function moiTenCu(bang) {
  const { plugin, rieng } = tachTenCu(bang);
  return [...plugin.map(p => `${p}:`), ...rieng];
}

/** Khuôn tên lệnh/skill cũ: `plugin-cũ:lệnh` cho plugin đã đổi tên, và đúng các lệnh đổi tên trong plugin giữ tên. */
export function khuonTenCu(bang) {
  const { plugin, rieng } = tachTenCu(bang);
  const nhanh = [...(plugin.length > 0 ? [`(?:${plugin.map(thoat).join('|')}):[a-z][a-z0-9-]*`] : []), ...rieng.map(thoat)];
  return new RegExp(`(?<![\\w-])(?:${nhanh.join('|')})(?![\\w-])`, 'g');
}

export function tenMoi(ten, bang) {
  if (bang.lenh?.[ten]) return bang.lenh[ten];
  const [p, ...con] = ten.split(':');
  return [bang.plugin?.[p] ?? p, ...con].join(':');
}

/** ungVien: [{ tep, noiDung }] tệp SỐNG có nhắc; soLichSu: số tệp lịch sử có nhắc mà không đọc. */
export function kiemK5(ungVien, bang, soLichSu = 0) {
  const boQua = `đã loại trừ ${soLichSu} tệp lịch sử có nhắc`;
  if (moiTenCu(bang).length === 0) return dong('K5', true, 'bảng tên không có tên cũ nào để tìm');
  const cho = quetDong(ungVien.filter(u => !laLichSu(u.tep)), khuonTenCu(bang));
  if (cho.length === 0) return dong('K5', true, `không tệp sống nào nhắc tên lệnh/skill cũ (${boQua})`);
  const liet = cho.map(c => `${c.tep}:${c.so} ${c.chu} → ${tenMoi(c.chu, bang)}`).join('; ');
  return dong('K5', false, `${cho.length} chỗ nhắc tên lệnh/skill cũ, cần người xem: ${liet} (${boQua})`);
}

/** Tìm sự kiện `init` trong dòng chảy stream-json của một phiên Claude Code; không thấy thì trả null. */
export function timInit(chu) {
  for (const d of String(chu).split('\n')) {
    let e;
    try { e = JSON.parse(d); } catch { continue; }
    if (e && e.type === 'system' && e.subtype === 'init') return e;
  }
  return null;
}

/** Phân tích sự kiện `init`: plugin kit nào được nạp, từ chợ nào. `may` là tên máy — kết quả phụ thuộc cài đặt của máy. */
export function kiemK6(init, may) {
  const nguon = (init.plugins ?? []).map(p => String(p.source ?? ''));
  const moi = nguon.filter(s => s.endsWith(`@${CHO_MOI}`)).map(s => s.slice(0, -CHO_MOI.length - 1));
  const cu = nguon.filter(s => s.endsWith(`@${CHO_CU}`));
  const thieu = PLUGIN_MOI.filter(p => !moi.includes(p));
  const coMat = PLUGIN_MOI.length - thieu.length;
  const taMoi = `nạp ${coMat}/${PLUGIN_MOI.length} plugin @${CHO_MOI}${thieu.length > 0 ? ` (thiếu: ${thieu.join(', ')})` : ''}`;
  const taCu = `${cu.length} plugin @${CHO_CU}${cu.length > 0 ? ` (${cu.join(', ')})` : ''}`;
  return dong('K6', thieu.length === 0 && cu.length === 0, `máy ${may}: ${taMoi}; ${taCu}`);
}
