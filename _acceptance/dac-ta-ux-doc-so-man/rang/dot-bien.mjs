#!/usr/bin/env node
// rang/dot-bien.mjs — chiều đỏ của hồ sơ dac-ta-ux-doc-so-man (bản thiết kế §5, eval E10).
//
//   node _acceptance/dac-ta-ux-doc-so-man/rang/dot-bien.mjs [--quan-sat]
//
// Mỗi nhát tiêm vào một BẢN SAO trọn thư mục (plugins/acceptance-gate/{scripts,lib,skills}, plugins/feature-loop/skills,
// tệp ca và mẫu) rồi chạy tests/scripts/so-man.test.mjs trong bản sao. Trước mọi nhát: bản sao nguyên vẹn phải xanh đủ
// 64 ô. Nhát logic chạy mọi ca và đòi tập ca đỏ BẰNG ĐÚNG tập đã ghim — đỏ thêm ca khác cũng là thoát 1 có tên. Nhát
// đổi một chữ trong câu ghim chỉ chạy ca ghim câu ấy và đòi nó đỏ (câu «khớp» là đối chứng dương của gần mọi ca, nên
// đòi bằng-đúng ở đây là vô nghĩa). Mỗi chuỗi tiêm phải khớp đúng MỘT lần trong tệp. Chiều im: chạm thứ không phải vật
// (bản thiết kế, hợp đồng của vòng, lời đầu khuôn ngoài khối UX-SPEC-TEMPLATE) thì mọi ca vẫn xanh.
// --quan-sat: in tập ca đỏ của từng nhát, không so với ghim (dùng khi viết ghim lần đầu).
import { spawn, execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const QUAN_SAT = process.argv.includes('--quan-sat');
const SM = 'plugins/acceptance-gate/scripts/so-man.cjs';
const GC = 'plugins/acceptance-gate/scripts/gate-card.js';
const KHUON = 'plugins/acceptance-gate/skills/acceptance/references/ux-spec-template.md';
const SAO_CHEP = ['plugins/acceptance-gate/scripts', 'plugins/acceptance-gate/lib', 'plugins/acceptance-gate/skills',
  'plugins/feature-loop/skills', 'tests/scripts/so-man.test.mjs', 'tests/scripts/fixtures/so-man',
  'docs/superpowers/specs/2026-11-22-dac-ta-ux-doc-so-man-design.md', '_acceptance/dac-ta-ux-doc-so-man/contract.md'];
const TAM = mkdtempSync(path.join(os.tmpdir(), 'so-man-dot-bien-'));
process.on('exit', () => rmSync(TAM, { recursive: true, force: true }));
const chet = msg => { process.stdout.write(`dot-bien: ${msg}\n`); process.exit(1); };

// Cây ở gốc nhánh cho các ca so từng byte (L7, L8, W3): bản sao không phải kho git.
const ref = ['main', 'origin/main'].map(b => { try { return execFileSync('git', ['-C', ROOT, 'merge-base', 'HEAD', b], { encoding: 'utf8' }).trim(); } catch { return ''; } }).find(Boolean);
if (!ref) chet('không tìm được gốc nhánh (merge-base với main/origin/main)');
const GOC = path.join(TAM, 'goc-nhanh');
mkdirSync(GOC, { recursive: true });
execFileSync('bash', ['-c', `git -C "${ROOT}" archive ${ref} plugins/acceptance-gate | tar -x -C "${GOC}"`]);

let soSao = 0;
function banSao() {
  const d = path.join(TAM, `sao-${++soSao}`);
  for (const p of SAO_CHEP) cpSync(path.join(ROOT, p), path.join(d, p), { recursive: true });
  return d;
}
function tiem(d, tep, thay) {
  const f = path.join(d, tep);
  let s = readFileSync(f, 'utf8');
  for (const [tu, sang] of thay) {
    const n = s.split(tu).length - 1;
    if (n !== 1) return `chuỗi tiêm khớp ${n} lần trong ${tep}: «${tu.slice(0, 90)}»`;
    s = s.replace(tu, () => sang);
  }
  writeFileSync(f, s);
  return null;
}
function chayCa(d, loc) {
  return new Promise(res => {
    const env = { ...process.env, SO_MAN_GOC_NHANH: GOC, SO_MAN_CASES: loc ? loc.join(',') : '' };
    const p = spawn(process.execPath, [path.join(d, 'tests/scripts/so-man.test.mjs')], { cwd: d, env });
    let out = '';
    p.stdout.on('data', c => { out += c; });
    p.stderr.on('data', c => { out += c; });
    p.on('close', code => {
      const lay = re => new Set([...out.matchAll(re)].map(m => m[1]));
      res({ code, out, fail: lay(/^FAIL: (\S+)/gm), pass: lay(/^PASS: (\S+)/gm) });
    });
  });
}
async function hoBoi(viec, n) {
  const kq = new Array(viec.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < viec.length) { const j = i++; kq[j] = await viec[j](); } }));
  return kq;
}

// ── Nhát logic: tập ca đỏ phải BẰNG ĐÚNG `ghim` ────────────────────────────────────────────────────────────────────
const NHAT = [
  { ten: 'bo-xoa-khoi-ma', tep: SM, thay: [['const sach = stripNonProse(String(', 'const sach = ((x) => x)(String(']], ghim: ['K7', 'K10', 'H9'] },
  { ten: 'nhan-marker-khong-nguyen-dong', tep: SM, thay: [["const laMarker = (l, mk) => { const m = String(l).match(/^ {0,3}(\\S.*?)[ \\t]*$/); return !!m && m[1] === mk; };", 'const laMarker = (l, mk) => String(l).includes(mk);']], ghim: ['K8', 'K9'] },
  { ten: 'bo-dem-cap-marker', tep: SM, thay: [['if (mo.length !== 1 || dg.length !== 1 || mo[0].no > dg[0].no) {', 'if (false) {']], ghim: ['K4', 'K5', 'K6'] },
  { ten: 'bo-luat-rong', tep: SM, thay: [["if (!giua.length) return { bang: true, do: [cau.rong()], hang: [], oKhuon: 0 };", "if (!giua.length) return { bang: true, do: [], hang: [], oKhuon: 0 };"], ['  if (!soDuLieu) loi.push(cau.rong());\n', '']], ghim: ['H2', 'H3'] },
  { ten: 'bo-dong-la', tep: SM, thay: [['    if (!o) { loi.push(cau.dongLa(x.no)); return; }', '    if (!o) return;']], ghim: ['H7'] },
  { ten: 'bo-nfc', tep: SM, thay: [[".normalize('NFC');", ';']], ghim: ['H13'] },
  { ten: 'bo-ve-thieu', tep: SM, thay: [['    for (const t of s.must_have.map(nfc)) if (!co.has(t)) loi.push(cau.thieuBatBuoc(id, t));\n', '']], ghim: ['S4', 'B2', 'L6'] },
  { ten: 'bo-ve-trang-thai-la', tep: SM, thay: [['    if (!hopLe.has(t)) { loi.push(cau.khongCoTrangThai(id, t, h.no, h.ma)); continue; }\n', '']], ghim: ['H13', 'S3', 'L2', 'L6'] },
  { ten: 'bo-so-unknown', tep: SM, thay: [['    if (!s) { loi.push(cau.khongCoMan(h.man, h.no, h.ma)); continue; }', '    if (!s) continue;']], ghim: ['S2', 'S10', 'B4', 'B11'] },
  { ten: 'thoat-2-nhu-khong-lenh-doc', tep: SM, thay: [['  if (r.loi) return { code: 2, do: [cau.khongDocDuoc(r.loi)], ghi: [] };', '  if (r.loi) return { code: 0, do: [], ghi: [] };']], ghim: ['B5', 'B7', 'B8', 'B9', 'B10', 'L9', 'L10'] },
  { ten: 'vang-lenh-doc-la-thoat-2', tep: SM, thay: [['  if (!coLenhDoc(root)) return 0;', '  if (!coLenhDoc(root)) return 2;']], ghim: ['B6', 'D4'] },
  { ten: 'tach-ma-theo-gach-noi', tep: SM, thay: [['    const t = h.ma.slice(tienTo.length);', "    const t = h.ma.split('-').slice(2).join('-');"]], ghim: ['S6', 'S7', 'S8', 'S9', 'H13', 'D6'] },
  { ten: 'the-in-khi-khong-lenh-doc', tep: SM, thay: [['    if (!coLenhDoc(root)) return null;', "    if (!coLenhDoc(root)) return { dong: ['x'] };"]], ghim: ['L7'] },
  { ten: 'the-bo-khoi', tep: GC, thay: [['  if (soManG1) P.push(', '  if (false) P.push(']], ghim: ['S10', 'L6', 'L9', 'L10'] },
  { ten: 'bo-doc-design-doc', tep: SM, thay: [["const tk = banThietKe(root, frontmatterField(contractTxt, 'design_doc'));", "const tk = banThietKe(root, 'docs/tk.md');"]], ghim: ['L2', 'L3', 'L4', 'L8'] },
  { ten: 'doi-thu-tu-bat-buoc', tep: SM, thay: [['[...mh, ...s.states.map(nfc).filter(t => !mh.includes(t))]', '[...s.states.map(nfc), ...mh.filter(t => !s.states.map(nfc).includes(t))]']], ghim: ['D1'] },
  { ten: 'chep-cung-cot-man', tep: SM, thay: [['    cotMan: cot[1],', "    cotMan: 'Màn',"]], ghim: ['D6'] },
];
NHAT.push(
  { ten: 'bo-dong-gioi-han-must-have', tep: SM, thay: [['  if (coNull) ghi.push(cau.gioiHanMustHave());\n  for (const k of kq.keys_not_found)', '  for (const k of kq.keys_not_found)']], ghim: ['B2'] },
  { ten: 'skill-go-khoi', tep: 'plugins/feature-loop/skills/feature-loop/SKILL.md', thay: [['     <!-- <<<UX-SO-MAN-S1 -->\n', '']], ghim: ['W1'] },
  { ten: 'khuon-doi-mot-ky-tu-trong-khoi', tep: KHUON, thay: [['- Suôn sẻ: {{điểm vào}}', '- Suôn sẻ:  {{điểm vào}}']], ghim: ['W3'] },
  { ten: 'bien-the-them-khoa-khong-khai', tep: 'tests/scripts/fixtures/so-man/thieu-screens.json', thay: [['  "exit": 0,\n', '  "exit": 0,\n  "them": 1,\n']], ghim: ['F1'] },
  // Gỡ một ca khỏi bảng chạy: không ô nào đỏ, nhưng dòng đếm thành 63 và tệp ca thoát 1.
  { ten: 'go-mot-ca-khoi-bang-chay', tep: 'tests/scripts/so-man.test.mjs', thay: [["ca('K11', () => {", "((_o, _f) => {})('K11', () => {"]], ghim: [], dem: 63 },
);
// ── Nhát câu: đổi một chữ trong từng câu §3.4; ca ghim câu ấy phải đỏ ─────────────────────────────────────────────
const CAU_CA = {
  khongCoMan: 'S2', khongCoTrangThai: 'S3', thieuBatBuoc: 'S4', saiTienTo: 'H8', khaiHaiLan: 'H10', rong: 'H2',
  thieuCot: 'H4', dongLa: 'H7', soO: 'H5', oTrong: 'H9', soMarker: 'K4', matNguoiKhongBang: 'L3', khongDocDuoc: 'B5',
  gioiHanMustHave: 'B2', khoaKhongThay: 'B3', khop: 'K1',
};
const smGoc = readFileSync(path.join(ROOT, SM), 'utf8');
const NHAT_CAU = Object.entries(CAU_CA).map(([k, ca]) => {
  const dong = smGoc.split('\n').find(l => l.startsWith(`  ${k}: `));
  if (!dong) chet(`không thấy câu «${k}» trong ${SM}`);
  const i = dong.search(/=> [`']/) + 4;
  return { ten: `cau-${k}`, tep: SM, thay: [[dong, dong.slice(0, i) + 'X' + dong.slice(i)]], ghim: [ca], chiCa: true };
});
// ── Chiều im ───────────────────────────────────────────────────────────────────────────────────────────────────────
const IM = [
  ['docs/superpowers/specs/2026-11-22-dac-ta-ux-doc-so-man-design.md', [['## 1. Việc', '## 1. Việc (chạm chiều im)']]],
  ['_acceptance/dac-ta-ux-doc-so-man/contract.md', [['status: ', 'status:  ']]],
  [KHUON, [['Trần kích thước: section điền xong', 'Trần kích thước (chiều im): section điền xong']]],
];

const lanh = await chayCa(banSao(), null);
if (lanh.code !== 0 || !/^số ca chạy: 64$/m.test(lanh.out)) chet(`bản nguyên vẹn không xanh đủ 64 ô (thoát ${lanh.code}):\n${lanh.out.split('\n').filter(l => l.startsWith('FAIL') || l.startsWith('số ca')).join('\n')}`);

const kq = await hoBoi([...NHAT, ...NHAT_CAU].map(n => async () => {
  const d = banSao();
  const loi = tiem(d, n.tep, n.thay);
  if (loi) return { n, loi };
  const r = await chayCa(d, n.chiCa ? n.ghim : null);
  return { n, r };
}), Math.max(2, Math.min(8, os.cpus().length - 1)));

let hong = 0;
for (const { n, loi, r } of kq) {
  if (loi) { hong++; process.stdout.write(`nhát ${n.ten} → HỎNG: ${loi}\n`); continue; }
  const do_ = [...r.fail].filter(x => !x.startsWith('số')).sort();
  if (QUAN_SAT) { process.stdout.write(`nhát ${n.ten} → đỏ ${do_.join(',') || '(không ca nào)'}\n`); continue; }
  const ghim = [...n.ghim].sort();
  const dat = n.dem !== undefined ? (r.code !== 0 && !do_.length && new RegExp(`^số ca chạy: ${n.dem}$`, 'm').test(r.out))
    : n.chiCa ? ghim.every(c => r.fail.has(c)) : do_.join(',') === ghim.join(',');
  if (dat) process.stdout.write(`nhát ${n.ten} → đỏ ${n.dem !== undefined ? `dòng đếm (số ca chạy: ${n.dem}, thoát ${r.code})` : n.chiCa ? ghim.join(',') : do_.join(',')}\n`);
  else { hong++; process.stdout.write(`nhát ${n.ten} → SAI: ghim ${ghim.join(',')}, đỏ ${do_.join(',') || '(không ca nào)'}\n`); }
}
const dIm = banSao();
for (const [tep, thay] of IM) { const loi = tiem(dIm, tep, thay); if (loi) chet(`chiều im: ${loi}`); }
const im = await chayCa(dIm, null);
const imXanh = im.code === 0 && /^số ca chạy: 64$/m.test(im.out);
if (!imXanh) { hong++; process.stdout.write(`chiều im → ĐỎ: ${[...im.fail].join(',')}\n`); }
if (QUAN_SAT) process.exit(0);
const tong = NHAT.length + NHAT_CAU.length;
if (hong) chet(`${tong - hong + (imXanh ? 0 : 1)}/${tong} nhát đỏ đúng ca — ${hong} chỗ hỏng ở trên`);
process.stdout.write(`dot-bien: ${tong}/${tong} nhát đỏ đúng ca, bản nguyên vẹn xanh, chiều im xanh\n`);
