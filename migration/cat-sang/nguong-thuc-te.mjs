#!/usr/bin/env node
// nguong-thuc-te.mjs — cách đo «ngưỡng thực tế của mốc 3.0» (KE-HOACH.md mục 12), dựng sẵn ở B3 để ngày đóng đợt chỉ việc chạy.
//
// Không dựng phép đo mới: ký→gộp lấy từ CHÍNH bộ đo của kit (`<kit>/plugins/dispatch/scripts/do-gop.mjs`, hồ sơ ky-den-gop);
// làm-xong→ký, lượt chấm bị hạ tầng đốt, token, phút đọc bằng `<kit>/plugins/acceptance-gate/scripts/loop-health.mjs` (in lệnh).
//
//   Cửa sổ:  node nguong-thuc-te.mjs cua-so --kho <bản kéo kho tiêu thụ> --kit <cây kit 3.0> --tu <commit> --den <commit> [--nhanh main]
//            Mỗi hồ sơ có commit GỘP nằm trong (tu, den] trên lối cha-đầu của nhánh chính: giờ ký, giờ gộp, ký→gộp (phút),
//            số lần gộp nhánh chính vào nhánh. Cuối: số vòng, trung vị và p75 ký→gộp. 0 vòng → nói thẳng «cửa sổ rỗng».
//   Vế 1:    node nguong-thuc-te.mjs ve-1 --kho <bản kéo> --kit <cây kit 3.0> --gop <commit gộp của vòng thật> --cai <commit cài 3.0> [--nhanh main]
//            Tại commit gộp: ci.yml kéo kit từ kho delivery-loop ở KIT_TAG v3.0.x · mọi khoá bật plugin của kit trỏ chợ
//            delivery-loop (thay cho trường «phiên bản plugin của phiên làm vòng» — chợ mới chỉ phát hành ≥ 3.0) · có hồ sơ
//            ký SAU commit cài và gộp ở đúng commit ấy.
// Thoát: 0 đạt / in xong · 1 vế 1 trượt (mỗi dòng một lý do) · 2 không đọc được ở đây.
// Giới hạn đã khai (lượt rà 17/11): giờ ký và giờ gộp là NGÀY COMMIT — nhánh bị rebase sau chữ ký thì giờ ký trôi theo; bộ
// đo của kit đọc trên đỉnh origin/<nhánh>, nên --den phải nằm trên nhánh ấy; hai commit gộp cùng một giây thì mã commit gộp
// có thể gán nhầm cho nhau (giờ vẫn đúng); trung vị của tập chẵn lấy phần tử trên.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const v = process.argv.slice(2);
const lenh = v[0];
const a = { nhanh: 'main' };
for (let i = 1; i < v.length; i += 2) a[v[i].replace(/^--/, '')] = v[i + 1];
const khongDoc = (s) => { process.stderr.write(`không đọc được ở đây: ${s}\n`); process.exit(2); };
if (!['cua-so', 've-1'].includes(lenh) || !a.kho || !a.kit) khongDoc('dùng: nguong-thuc-te.mjs cua-so|ve-1 --kho <bản kéo> --kit <cây kit> …');

const git = (args) => execFileSync('git', ['-C', a.kho, ...args], { encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] });
const thu = (args) => { try { return git(args); } catch { return null; } };
const io = { chay: (_l, args) => git(args) };
const tepGop = path.join(a.kit, 'plugins', 'dispatch', 'scripts', 'do-gop.mjs');
const tepLich = path.join(a.kit, 'plugins', 'dispatch', 'scripts', 'phat-lich.mjs');
if (!fs.existsSync(tepGop) || !fs.existsSync(tepLich)) khongDoc(`không thấy bộ đo ký→gộp của kit ở ${tepGop}`);
const { soDoGop } = await import(pathToFileURL(tepGop).href);
const { DA_THONG } = await import(pathToFileURL(tepLich).href);
const NHANH = `origin/${a.nhanh}`;
const cfg = { nhanh_chinh: a.nhanh };
if (thu(['rev-parse', '--verify', '-q', NHANH]) === null) khongDoc(`bản kéo không có ${NHANH} — bộ đo ký→gộp của kit đọc lịch sử nhánh ấy`);
const trungVi = (ds, p = 0.5) => { const s = [...ds].sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : null; };

// Hồ sơ có commit gộp nằm trong (tu, den] trên lối cha-đầu.
function vongTrong(tu, den) {
  // Giờ commit (ISO, UTC) → mã, cho các commit trên lối cha-đầu trong cửa sổ — bộ đo của kit trả giờ, không trả mã.
  const theoGio = new Map(git(['log', '--first-parent', '--format=%H %cI', `${tu}..${den}`]).split('\n').filter(Boolean).map(d => { const [h, t] = d.split(' '); return [new Date(t).toISOString(), h]; }));
  const slug = git(['ls-tree', '--name-only', `${den}:_acceptance/`]).split('\n').filter(Boolean).map(s => s.replace(/^_acceptance\//, ''));
  const ra = [];
  for (const s of slug) {
    if (thu(['cat-file', '-e', `${den}:_acceptance/${s}/contract.md`]) === null) continue;
    const d = soDoGop(io, cfg, s, DA_THONG);
    if (!d.gop_luc || !theoGio.has(d.gop_luc)) continue;
    ra.push({ slug: s, sha_gop: theoGio.get(d.gop_luc), ...d });
  }
  return ra.sort((x, y) => x.gop_luc.localeCompare(y.gop_luc));
}

if (lenh === 'cua-so') {
  if (!a.tu || !a.den) khongDoc('cua-so cần --tu và --den');
  if (thu(['merge-base', '--is-ancestor', a.den, NHANH]) === null) khongDoc(`--den ${a.den} không nằm trên ${NHANH}`);
  const ds = vongTrong(a.tu, a.den);
  process.stdout.write(`cửa sổ ${git(['rev-parse', '--short', a.tu]).trim()}..${git(['rev-parse', '--short', a.den]).trim()} trên ${NHANH}: ${ds.length} vòng gộp\n`);
  if (!ds.length) { process.stdout.write('cửa sổ rỗng — không có trung vị để so; đừng đọc thành «0 phút»\n'); process.exit(0); }
  for (const d of ds) process.stdout.write(`${d.gop_luc.slice(0, 16)}\tký→gộp ${d.ky_den_gop_phut ?? 'chưa đo (ký nằm trên lối cha-đầu)'}′\tgộp nhánh chính vào nhánh ${d.gop_vao_nhanh ?? '-'}\t${a.an ? '(ẩn tên)' : d.slug}\n`);
  const p = ds.map(d => d.ky_den_gop_phut).filter(x => x !== null);
  process.stdout.write(`ký→gộp: đo được ${p.length}/${ds.length} vòng · trung vị ${trungVi(p)}′ · p75 ${trungVi(p, 0.75)}′ · ngưỡng «không vượt trung vị quá 50 %» = ${p.length ? Math.round(trungVi(p) * 1.5) : '—'}′\n`);
  process.stdout.write(`làm-xong→ký, lượt chấm bị hạ tầng đốt, token, phút: node ${path.join(a.kit, 'plugins/acceptance-gate/scripts/loop-health.mjs')} --root ${a.kho} --at ${a.den} --since ${a.tu}\n`);
  process.exit(0);
}

// ── vế 1 ─────────────────────────────────────────────────────────────────────────────────────────────────────────
if (!a.gop || !a.cai) khongDoc('ve-1 cần --gop và --cai');
const loi = [];
const ci = thu(['show', `${a.gop}:.github/workflows/ci.yml`]);
if (ci === null) khongDoc(`không đọc được ci.yml tại ${a.gop}`);
// Dòng KIT_TAG đầu tiên không nằm trong chú thích; bỏ nháy quanh giá trị.
const the = ((ci.split('\n').find(d => /^\s*KIT_TAG:/.test(d)) || '').match(/KIT_TAG:\s*["']?([^\s"'#]+)/) || [])[1];
if (!/github\.com\/phanlemanh\/delivery-loop(?![\w-])/.test(ci)) loi.push('ci.yml không kéo kit từ kho delivery-loop');
if (!/^v3\.0\.\d+$/.test(the || '')) loi.push(`KIT_TAG là «${the}», cần v3.0.x`);
const st = thu(['show', `${a.gop}:.claude/settings.json`]);
if (st === null) loi.push('không đọc được .claude/settings.json');
else {
  const bat = Object.entries(JSON.parse(st).enabledPlugins || {}).filter(([, v]) => v === true).map(([k]) => k);
  const cu = bat.filter(k => k.endsWith('@acceptance-gate-kit'));
  const moi = bat.filter(k => k.endsWith('@delivery-loop'));
  if (cu.length) loi.push(`còn ${cu.length} khoá bật plugin trỏ chợ cũ: ${cu.join(', ')}`);
  if (!moi.length) loi.push('không khoá bật plugin nào trỏ chợ delivery-loop — phiên làm vòng không chắc chạy plugin 3.0');
}
if (thu(['merge-base', '--is-ancestor', a.cai, a.gop]) === null) loi.push('commit gộp không đứng sau commit cài 3.0');
const vong = vongTrong(a.cai, a.gop).filter(d => d.sha_gop === git(['rev-parse', a.gop]).trim() && d.ky_luc);
const sauCai = vong.filter(d => Date.parse(d.ky_luc) > Date.parse(git(['log', '-1', '--format=%cI', a.cai]).trim()));
if (!sauCai.length) loi.push('không hồ sơ nào ký sau commit cài và gộp ở đúng commit này (vòng phải mở SAU commit cài; gộp dồn thì không tách được giờ ký)');
for (const l of loi) process.stdout.write(`TRƯỢT vế 1: ${l}\n`);
if (!loi.length) process.stdout.write(`vế 1 đạt: ${sauCai.map(d => d.slug).join(', ')} gộp tại ${git(['rev-parse', '--short', a.gop]).trim()} trên kit ${the}, ký→gộp ${sauCai[0].ky_den_gop_phut}′\n`);
process.exit(loi.length ? 1 : 0);
