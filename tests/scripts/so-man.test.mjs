// tests/scripts/so-man.test.mjs — hồ sơ dac-ta-ux-doc-so-man: mỗi ô của ma trận hình dạng (bản thiết kế §4) một ca.
//
//   node tests/scripts/so-man.test.mjs                 # mọi ca; in «số ca chạy: N», đỏ khi N khác 64
//   SO_MAN_CASES=K1,H3 node tests/scripts/so-man.test.mjs
//
// MA_TRAN viết tay TRƯỚC plugins/acceptance-gate/scripts/so-man.cjs, không rút từ vật. Câu ghim chép độc lập từ
// bản thiết kế §3.4. Lệnh đọc màn THẬT không chạy: lệnh giả viết vào kho bỏ đi in một mẫu ở
// tests/scripts/fixtures/so-man/ và lọc --screens như hợp đồng của lệnh đọc; ca F1 buộc lệnh giả vào hai bản chép của
// lệnh thật. Mỗi ca âm chạy đối chứng dương trên cùng kho trước.
import { spawnSync, execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { deepStrictEqual } from 'node:assert';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '../..');
const AG = path.join(KIT, 'plugins/acceptance-gate');
const SM = path.join(AG, 'scripts/so-man.cjs');
const GC = path.join(AG, 'scripts/gate-card.js');
const KHUON = path.join(AG, 'skills/acceptance/references/ux-spec-template.md');
const SKILL = path.join(KIT, 'plugins/feature-loop/skills/feature-loop/SKILL.md');
const MAU = path.join(HERE, 'fixtures/so-man');

// ── Ma trận (bản thiết kế §4) và ô → tiêu chí. 11 + 13 + 10 + 11 + 10 + 9 = 64. ─────────────────────────────────────
const MA_TRAN = [
  'K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10', 'K11',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13',
  'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10',
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11',
  'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10',
  'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9',
];
const SO_O = 64;
export const O_TIEU_CHI = {
  'AC-1': ['D1', 'D2', 'D7', 'D8'],
  'AC-2': ['D6'],
  'AC-3': ['B6', 'D4', 'L7', 'L8'],
  'AC-4': ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10', 'K11'],
  'AC-5': ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13'],
  'AC-6': ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10'],
  'AC-7': ['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'B8', 'B9', 'B10', 'B11', 'D3', 'D5', 'D9'],
  'AC-8': ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L9', 'L10'],
  'AC-9': ['W1', 'W2', 'W3'],
  'AC-10': ['F1'],
};

// ── Câu ghim (bản thiết kế §3.4, cộng các dòng ghi chú của lệnh điền) ────────────────────────────────────────────────
const C = {
  khongCoMan: (M, N, X) => `màn «${M}» không có trong sổ màn (dòng ${N}, mã «${X}»)`,
  khongCoTrangThai: (M, T, N, X) => `màn «${M}» không có trạng thái «${T}» trong sổ màn (dòng ${N}, mã «${X}»)`,
  thieuBatBuoc: (M, T) => `màn «${M}» thiếu trạng thái «${T}» mà sổ màn bắt phải có — thêm hàng «ST-${M}-${T}»`,
  saiTienTo: (X, M, N) => `mã trạng thái «${X}» không mang mã màn «${M}» của cùng hàng — khuôn là ST-<mã màn>-<trạng thái> (dòng ${N})`,
  khaiHaiLan: (X, N, K) => `mã trạng thái «${X}» khai hai lần (dòng ${N} và dòng ${K})`,
  rong: () => 'bảng trạng thái rỗng — không có hàng dữ liệu nào giữa hai marker UX-STATE-TABLE',
  thieuCot: (Cot, N) => `bảng trạng thái thiếu cột «${Cot}» ở hàng tiêu đề (dòng ${N})`,
  dongLa: N => `dòng ${N} giữa hai marker UX-STATE-TABLE không phải một hàng của bảng`,
  soO: (N, K, H) => `dòng ${N} có ${K} ô, hàng tiêu đề có ${H} ô`,
  oTrong: (N, Cot) => `dòng ${N}: ô «${Cot}» trống hoặc còn ô khuôn chưa điền`,
  soMarker: (K, H) => `mục Đặc tả UX có ${K} marker mở và ${H} marker đóng UX-STATE-TABLE — phải đúng một cặp, mở trước đóng`,
  matNguoiKhongBang: () => 'hồ sơ có mặt người nhìn mà bản thiết kế không có bảng trạng thái — kho này có sổ màn để so',
  khongDocDuoc: L => `không đọc được sổ màn ở đây: «${L}»`,
  gioiHanMustHave: () => 'kho không có bảng trạng thái bắt buộc — vế «thiếu trạng thái sổ bắt phải có» không kiểm được ở đây',
  khoaKhongThay: (K, L) => `sổ màn viết khoá «${K}» theo cách lệnh đọc không thấy (tìm «${L}») — mã màn và trạng thái vẫn đọc được`,
  khop: (N, M) => `bảng trạng thái khớp sổ màn: ${N} hàng, ${M} màn`,
  khongCoBang: () => 'bản thiết kế không có bảng trạng thái — không có gì để so',
  tepKhongDoc: P => `không đọc được tệp «${P}»`,
  oNguoiViet: K => `còn ${K} ô người viết chưa điền (ô khuôn hoặc trống) — không đỏ`,
  dienKhongCo: M => `màn «${M}» không có trong sổ màn — không điền hàng nào cho nó`,
  dienKhongTrangThai: M => `màn «${M}» không có trạng thái nào trong sổ màn — chỉ có hàng kiểm kê`,
  dienTuChoi: M => `màn «${M}» có tên hoặc trạng thái chứa «|» hoặc xuống dòng — không điền được vào bảng`,
  dienBatBuoc: (M, ds) => `màn «${M}» bắt phải có: ${ds.join(', ')}`,
  theConLai: K => `… và còn ${K} câu đỏ nữa — chạy lệnh kiểm để xem đủ`,
  cachDung: 'cách dùng: so-man.cjs --root <kho> (--dien [--man <mã,mã>] | --kiem (--slug <hồ sơ> | --tep <bản thiết kế>))',
};
const LY = {
  thoat2: 'lệnh đọc thoát 2: design-assembly: design/screens.yaml is missing, and so is design/screens/: there is no screen to read',
  khongJson: 'câu trả lời của lệnh đọc không phải JSON',
  thieuScreens: 'câu trả lời thiếu khoá «screens»',
  statesKhongMang: 'khoá «screens[0].states» không phải mảng',
  quaHan: ms => `lệnh đọc không trả lời trong ${ms} ms`,
  unknownRong: 'lệnh đọc thoát 1 mà «unknown» rỗng',
  maLa: m => `lệnh đọc thoát mã lạ ${m}`,
};
const LAB_THE = 'Bảng trạng thái ↔ sổ màn (thông tin, không cần trả lời)';
const MO = '<!-- <<<UX-STATE-TABLE -->';
const DONG = '<!-- UX-STATE-TABLE>>> -->';
const TIEU_DE = '| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |';
const PHAN_CACH = '|---|---|---|---|';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// ── Hạ tầng ─────────────────────────────────────────────────────────────────────────────────────────────────────────
const TAM = mkdtempSync(path.join(os.tmpdir(), 'so-man-ca-'));
process.on('exit', () => rmSync(TAM, { recursive: true, force: true }));
let soKho = 0;

const LENH_GIA = (mau, ngu, log) => `// lệnh đọc màn GIẢ của tests/scripts/so-man.test.mjs
import { readFileSync, appendFileSync } from 'node:fs';
const a = process.argv.slice(2);
appendFileSync(${JSON.stringify(log)}, JSON.stringify(a) + '\\n');
if (${ngu}) await new Promise(r => setTimeout(r, ${ngu}));
const m = JSON.parse(readFileSync(${JSON.stringify(mau)}, 'utf8'));
process.stderr.write(m.stderr !== undefined ? m.stderr : 'lenh doc gia: mot dong stderr khong phai loi\\n');
if (m.json === undefined || m.loc === false || !Array.isArray(m.json.screens)) {
  process.stdout.write(m.json !== undefined ? JSON.stringify(m.json, null, 2) + '\\n' : (m.stdout || ''));
  process.exit(m.exit);
}
const i = a.indexOf('--screens');
const hoi = i >= 0 ? a[i + 1].split(',').filter(Boolean) : [];
let screens = m.json.screens; const unknown = [];
if (hoi.length) {
  screens = [];
  for (const n of [...new Set(hoi)]) {
    const f = m.json.screens.filter(s => String(s.id) === n || s.route === n);
    if (!f.length) unknown.push(n);
    screens.push(...f);
  }
  screens = [...new Set(screens)];
}
process.stdout.write(JSON.stringify({ ...m.json, screens, unknown }, null, 2) + '\\n');
process.exit(unknown.length ? 1 : 0);
`;

// Kho bỏ đi: `_acceptance/` tối thiểu, lệnh đọc giả khi `mau` có, tệp thiết kế tuỳ chọn.
function khoBoDi({ mau = 'goc.json', ngu = 0 } = {}) {
  const dir = path.join(TAM, `kho-${++soKho}`);
  mkdirSync(path.join(dir, '_acceptance'), { recursive: true });
  writeFileSync(path.join(dir, '_acceptance/config.yaml'), 'schema_version: 1\n');
  const log = path.join(dir, '.doi-so-lenh-doc.jsonl');
  if (mau) {
    mkdirSync(path.join(dir, 'tools/design-assembly'), { recursive: true });
    writeFileSync(path.join(dir, 'tools/design-assembly/screen-facts.mjs'), LENH_GIA(path.join(MAU, mau), ngu, log));
  }
  return {
    dir,
    ghi(rel, txt) { mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); writeFileSync(path.join(dir, rel), txt); return rel; },
    doiSo() { return existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l)) : []; },
  };
}
function chay(args, { env = {}, sm = SM, cwd = KIT } = {}) {
  const r = spawnSync(process.execPath, [sm, ...args], { cwd, encoding: 'utf8', env: { ...process.env, ...env } });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '', dong: (r.stdout || '').split('\n') };
}
const kiemTep = (kho, rel, o) => chay(['--root', kho.dir, '--kiem', '--tep', rel], o);
const dien = (kho, man, o) => chay(['--root', kho.dir, '--dien', ...(man ? ['--man', man] : [])], o);

// Bản thiết kế: phần mở đầu, mục Đặc tả UX với khối bảng, phần sau. `bang` là mảng dòng đã có marker hay không.
const tk = (bang, { truoc = [], sau = [], muc = '## Đặc tả UX' } = {}) =>
  ['# Thiết kế', '', 'Văn mở đầu.', '', ...truoc, muc, '', '### 3. Bảng trạng thái', '', ...bang, '', ...sau, ''].join('\n');
const khoi = hang => [MO, TIEU_DE, PHAN_CACH, ...hang, DONG];
const H = (ma, man, a = 'Khung xương và chữ thật', b = 'Chờ hoặc huỷ') => `| ${ma} | ${man} | ${a} | ${b} |`;
const hangMan = (man, ds, id = man) => ds.map(s => H(`ST-${id}-${s}`, man));
const OVERDUE = hangMan('overdue', ['loading', 'empty', 'error', 'list']);
const DON = hangMan('don', ['loading', 'empty', 'error']);
const DON_HANG = hangMan('don-hang', ['loading', 'empty', 'error', 'chi-tiet']);
// Số dòng (1-based) của lần xuất hiện thứ k của một dòng trong văn bản.
const soDong = (txt, dong, k = 1) => { let n = 0; const ls = txt.split('\n'); for (let i = 0; i < ls.length; i++) if (ls[i].replace(/\r$/, '') === dong && ++n === k) return i + 1; throw new Error(`không thấy dòng «${dong}»`); };

const coDong = (r, s) => { if (!r.dong.includes(s)) throw new Error(`thiếu nguyên dòng «${s}»\n--- stdout ---\n${r.out}--- stderr ---\n${r.err}`); };
const khongDong = (r, s) => { if (r.dong.includes(s)) throw new Error(`không được có dòng «${s}»`); };
const ma = (r, m) => { if (r.code !== m) throw new Error(`mã thoát ${r.code}, chờ ${m}\n--- stdout ---\n${r.out}--- stderr ---\n${r.err}`); };
const dung = (b, msg) => { if (!b) throw new Error(msg); };
// Đối chứng dương: bản thiết kế lành trên CÙNG kho phải xanh trước khi tin ca âm.
function duong(kho, bang = khoi(OVERDUE), n = 4, m = 1) {
  const rel = kho.ghi('docs/duong.md', tk(bang));
  const r = kiemTep(kho, rel);
  ma(r, 0); coDong(r, C.khop(n, m));
}

// ── Thẻ Cổng Phạm vi ────────────────────────────────────────────────────────────────────────────────────────────────
const HOP_DONG = ({ surfaces = '[ui]', designDoc = 'docs/tk.md' } = {}) => `---
schema_version: 1
feature: Màn quá hạn
slug: demo
risk_tier: T2
surfaces: ${surfaces}
${designDoc ? `design_doc: ${designDoc}\n` : ''}status: draft
---

## Criteria

- AC-1: Given a, When b, Then c.

## Coverage

- trục A.

## Out of scope

- x.
`;
const EVALS = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: echo\n    expected: x\n';
function hoSo(kho, o = {}) { kho.ghi('_acceptance/demo/contract.md', HOP_DONG(o)); kho.ghi('_acceptance/demo/evals.yaml', EVALS); }
function the(kho, { gc = GC, env = {}, extra = [] } = {}) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [gc, '--root', kho.dir, '--slug', 'demo', '--gate', '1', ...extra], { encoding: 'utf8', env: { ...process.env, ...env } });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '', ms: Date.now() - t0 };
}
let GOC_NHANH = null;
// Cây ở gốc nhánh (merge-base với nhánh chính): TRỌN thư mục plugin bằng git archive. Bộ đột biến chạy tệp ca trong
// một bản sao không phải kho git, nên nó dựng thư mục ấy trước từ kho thật và trao qua SO_MAN_GOC_NHANH.
function gocNhanh() {
  if (GOC_NHANH) return GOC_NHANH;
  if (process.env.SO_MAN_GOC_NHANH) return (GOC_NHANH = process.env.SO_MAN_GOC_NHANH);
  const ref = ['main', 'origin/main'].map(b => { try { return execFileSync('git', ['-C', KIT, 'merge-base', 'HEAD', b], { encoding: 'utf8' }).trim(); } catch { return ''; } }).find(Boolean);
  if (!ref) throw new Error('không tìm được gốc nhánh (merge-base với main/origin/main)');
  const d = path.join(TAM, 'goc-nhanh');
  mkdirSync(d, { recursive: true });
  execFileSync('bash', ['-c', `git -C "${KIT}" archive ${ref} plugins/acceptance-gate | tar -x -C "${d}"`]);
  return (GOC_NHANH = d);
}
const gcGoc = () => path.join(gocNhanh(), 'plugins/acceptance-gate/scripts/gate-card.js');

// ── Bộ chạy ca ──────────────────────────────────────────────────────────────────────────────────────────────────────
const LOC = (process.env.SO_MAN_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const daChay = [];
let passed = 0, failed = 0;
function ca(id, fn) {
  if (LOC.length && !LOC.includes(id)) return;
  daChay.push(id);
  try { fn(); passed++; console.log(`PASS: ${id}`); } catch (e) { failed++; console.log(`FAIL: ${id} — ${String(e.message).split('\n').join('\n    ')}`); }
}

// ══ K — bảng nằm đâu ════════════════════════════════════════════════════════════════════════════════════════════════
ca('K1', () => { const k = khoBoDi(); const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(OVERDUE)))); ma(r, 0); coDong(r, C.khop(4, 1)); });
ca('K2', () => {
  const k = khoBoDi(); duong(k);
  const r = kiemTep(k, k.ghi('docs/tk.md', ['# Thiết kế', '', '## Luồng', '', 'Không có mục đặc tả.', ''].join('\n')));
  ma(r, 0); coDong(r, C.khongCoBang());
});
ca('K3', () => {
  const k = khoBoDi(); duong(k);
  const r = kiemTep(k, k.ghi('docs/tk.md', tk([TIEU_DE, PHAN_CACH, ...OVERDUE])));
  ma(r, 0); coDong(r, C.khongCoBang());
});
ca('K4', () => {
  const k = khoBoDi(); duong(k);
  const r = kiemTep(k, k.ghi('docs/tk.md', tk([MO, TIEU_DE, PHAN_CACH, ...OVERDUE])));
  ma(r, 1); coDong(r, C.soMarker(1, 0));
});
ca('K5', () => {
  // Hai lượt chép khuôn: hai mục «## Đặc tả UX», mỗi mục một cặp — không chọn bừa cặp nào.
  const k = khoBoDi(); duong(k);
  const txt = tk(khoi(OVERDUE), { sau: ['## Đặc tả UX', '', ...khoi(OVERDUE)] });
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 1); coDong(r, C.soMarker(2, 2));
});
ca('K6', () => {
  const k = khoBoDi(); duong(k);
  const r = kiemTep(k, k.ghi('docs/tk.md', tk([DONG, TIEU_DE, PHAN_CACH, ...OVERDUE, MO])));
  ma(r, 1); coDong(r, C.soMarker(1, 1));
});
ca('K7', () => {
  const k = khoBoDi(); duong(k);
  const txt = ['# Thiết kế', '', '```md', '## Đặc tả UX', '', ...khoi(OVERDUE), '```', ''].join('\n');
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 0); coDong(r, C.khongCoBang());
});
ca('K8', () => {
  const k = khoBoDi(); duong(k);
  const txt = tk([`Bảng nằm giữa ${MO} như câu văn.`, TIEU_DE, PHAN_CACH, ...OVERDUE, `Đóng bằng \`${DONG}\` trong dòng.`]);
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 0); coDong(r, C.khongCoBang());
});
ca('K9', () => {
  const k = khoBoDi();
  const r3 = kiemTep(k, k.ghi('docs/ba.md', tk(['   ' + MO, TIEU_DE, PHAN_CACH, ...OVERDUE, '   ' + DONG])));
  ma(r3, 0); coDong(r3, C.khop(4, 1));
  const r4 = kiemTep(k, k.ghi('docs/bon.md', tk(['    ' + MO, TIEU_DE, PHAN_CACH, ...OVERDUE, '    ' + DONG])));
  ma(r4, 0); coDong(r4, C.khongCoBang());
});
ca('K10', () => {
  const k = khoBoDi();
  const minhHoa = ['Ví dụ SAI, đừng chép:', '', '```md', MO, TIEU_DE, PHAN_CACH, H('ST-khong-co-x', 'khong-co'), DONG, '```', ''];
  const r = kiemTep(k, k.ghi('docs/tk.md', tk([...minhHoa, ...khoi(OVERDUE)])));
  ma(r, 0); coDong(r, C.khop(4, 1));
});
ca('K11', () => {
  const k = khoBoDi(); duong(k);
  const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(OVERDUE), { muc: '## Ghi chú' })));
  ma(r, 0); coDong(r, C.khongCoBang());
});

// ══ H — các hàng giữa hai marker ════════════════════════════════════════════════════════════════════════════════════
ca('H1', () => {
  // Ô «Màn» có khoảng trắng thừa hai đầu vẫn là mã màn ấy.
  const k = khoBoDi();
  const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi([...OVERDUE.slice(0, 3), H('ST-overdue-list', '  overdue  ')]))));
  ma(r, 0); coDong(r, C.khop(4, 1));
});
ca('H2', () => { const k = khoBoDi(); duong(k); const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi([])))); ma(r, 1); coDong(r, C.rong()); });
ca('H3', () => { const k = khoBoDi(); duong(k); const r = kiemTep(k, k.ghi('docs/tk.md', tk([MO, DONG]))); ma(r, 1); coDong(r, C.rong()); });
ca('H4', () => {
  const k = khoBoDi(); duong(k);
  const tieuDe = '| Trạng thái | Màn hình | Hiển thị gì | Người làm gì tiếp |';
  const txt = tk([MO, tieuDe, PHAN_CACH, ...OVERDUE, DONG]);
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 1); coDong(r, C.thieuCot('Màn', soDong(txt, tieuDe)));
});
ca('H5', () => {
  const k = khoBoDi(); duong(k);
  const thua = '| ST-overdue-list | overdue | Danh sách | Mở | thừa |';
  const txt = tk(khoi([...OVERDUE.slice(0, 3), thua]));
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 1); coDong(r, C.soO(soDong(txt, thua), 5, 4));
});
ca('H6', () => {
  const k = khoBoDi(); duong(k);
  const khuonMa = '| ST-{{man}}-{{loading}} | overdue | Khung | Chờ |';
  const txt = tk(khoi([...OVERDUE, khuonMa]));
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 1); coDong(r, C.oTrong(soDong(txt, khuonMa), 'Trạng thái'));
  // Ô người viết còn ô khuôn: chỉ một dòng đếm, không đỏ.
  const r2 = kiemTep(k, k.ghi('docs/tk2.md', tk(khoi([...OVERDUE.slice(0, 3), H('ST-overdue-list', 'overdue', '{{hiển thị gì}}')]))));
  ma(r2, 0); coDong(r2, C.oNguoiViet(1)); coDong(r2, C.khop(4, 1));
});
ca('H7', () => {
  const k = khoBoDi(); duong(k);
  const cau = 'Ghi chú: trạng thái list chỉ hiện khi có dữ liệu.';
  const txt = tk(khoi([...OVERDUE.slice(0, 2), cau, ...OVERDUE.slice(2)]));
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 1); coDong(r, C.dongLa(soDong(txt, cau)));
});
ca('H8', () => {
  const k = khoBoDi(); duong(k);
  const sai = H('overdue-list', 'overdue');
  const txt = tk(khoi([...OVERDUE.slice(0, 3), sai]));
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 1); coDong(r, C.saiTienTo('overdue-list', 'overdue', soDong(txt, sai)));
});
ca('H9', () => {
  const k = khoBoDi(); duong(k);
  const boc = '| `ST-overdue-list` | overdue | Danh sách | Mở |';
  const txt = tk(khoi([...OVERDUE.slice(0, 3), boc]));
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 1); coDong(r, C.oTrong(soDong(txt, boc), 'Trạng thái'));
});
ca('H10', () => {
  const k = khoBoDi(); duong(k);
  const txt = tk(khoi([...OVERDUE, OVERDUE[1]]));
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 1); coDong(r, C.khaiHaiLan('ST-overdue-empty', soDong(txt, OVERDUE[1], 1), soDong(txt, OVERDUE[1], 2)));
});
ca('H11', () => {
  const k = khoBoDi();
  const tieuDe = '| Màn | Ghi chú | Trạng thái | Người làm gì tiếp | Hiển thị gì |';
  const hang = ['loading', 'empty', 'error', 'list'].map(s => `| overdue | — | ST-overdue-${s} | Chờ | Khung |`);
  const r = kiemTep(k, k.ghi('docs/tk.md', tk([MO, tieuDe, '|---|---|---|---|---|', ...hang, DONG])));
  ma(r, 0); coDong(r, C.khop(4, 1));
});
ca('H12', () => {
  const k = khoBoDi();
  const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(OVERDUE)).split('\n').join('\r\n')));
  ma(r, 0); coDong(r, C.khop(4, 1));
});
ca('H13', () => {
  const k = khoBoDi();
  const nfd = s => s.normalize('NFD');
  const id = 'tổng-quan';
  const lanh = ['loading', 'empty', 'error'].map(s => nfd(H(`ST-${id}-${s}`, id)));
  const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(lanh))));
  ma(r, 0); coDong(r, C.khop(3, 1));
  const la = nfd(H(`ST-${id}-xoá`, id));
  const txt = tk(khoi([...lanh, la]));
  const r2 = kiemTep(k, k.ghi('docs/tk2.md', txt));
  ma(r2, 1); coDong(r2, C.khongCoTrangThai(id, 'xoá', soDong(txt, la), `ST-${id}-xoá`));
});

// ══ S — so với sổ ═══════════════════════════════════════════════════════════════════════════════════════════════════
ca('S1', () => { const k = khoBoDi(); const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi([...OVERDUE, ...DON])))); ma(r, 0); coDong(r, C.khop(7, 2)); });
ca('S2', () => {
  const k = khoBoDi(); duong(k);
  const la = H('ST-khong-co-loading', 'khong-co');
  const txt = tk(khoi([...OVERDUE, la]));
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 1); coDong(r, C.khongCoMan('khong-co', soDong(txt, la), 'ST-khong-co-loading'));
});
ca('S3', () => {
  const k = khoBoDi(); duong(k);
  const la = H('ST-overdue-xoa', 'overdue');
  const txt = tk(khoi([...OVERDUE, la]));
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 1); coDong(r, C.khongCoTrangThai('overdue', 'xoa', soDong(txt, la), 'ST-overdue-xoa'));
});
ca('S4', () => {
  const k = khoBoDi(); duong(k);
  const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(OVERDUE.filter(l => !l.includes('-empty '))))));
  ma(r, 1); coDong(r, C.thieuBatBuoc('overdue', 'empty'));
});
ca('S5', () => {
  const k = khoBoDi(); duong(k);
  const lech = H('ST-overdue-loading', 'don');
  // Không có hàng overdue nào: mã của màn khác trên hàng «don» phải là sai tiền tố, không phải khai hai lần.
  const txt = tk(khoi([...DON.slice(1), lech]));
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 1); coDong(r, C.saiTienTo('ST-overdue-loading', 'don', soDong(txt, lech)));
});
ca('S6', () => {
  const k = khoBoDi();
  const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(hangMan('/don-hang', ['loading', 'empty', 'error', 'chi-tiet'], 'don-hang')))));
  ma(r, 0); coDong(r, C.khop(4, 1));
  const goi = k.doiSo().at(-1);
  dung(goi.includes('--screens') && goi[goi.indexOf('--screens') + 1] === '/don-hang', `lệnh đọc phải được hỏi đúng đường dẫn, nhận ${JSON.stringify(goi)}`);
});
ca('S7', () => { const k = khoBoDi(); const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(hangMan('ho-so', ['xem']))))); ma(r, 0); coDong(r, C.khop(1, 1)); });
ca('S8', () => {
  const k = khoBoDi();
  const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi([...DON, ...DON_HANG]))));
  ma(r, 0); coDong(r, C.khop(7, 2));
  const goi = k.doiSo().at(-1);
  dung(goi[goi.indexOf('--screens') + 1] === 'don,don-hang', `lệnh đọc phải được gọi MỘT lần với hai màn, nhận ${JSON.stringify(k.doiSo())}`);
  dung(k.doiSo().length === 1, `lệnh đọc phải được gọi đúng một lần, nhận ${k.doiSo().length}`);
});
ca('S9', () => {
  const k = khoBoDi();
  const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(DON_HANG))));
  ma(r, 0); coDong(r, C.khop(4, 1)); khongDong(r, C.khongCoTrangThai('don-hang', 'empty', 0, ''));
  dung(!r.out.includes('«empty»'), 'trạng thái bắt buộc mà states không liệt vẫn phải hợp lệ');
});
ca('S10', () => {
  // Màn mới của chính việc, sổ chưa có: câu S2 lên thẻ; mục hỏi người và dòng lệnh duyệt bằng thẻ ở kho không có lệnh đọc.
  const moi = hangMan('man-moi', ['loading', 'empty', 'error']);
  const txt = tk(khoi([...OVERDUE, ...moi]));
  const k = khoBoDi(); hoSo(k); k.ghi('docs/tk.md', txt);
  const r = chay(['--root', k.dir, '--kiem', '--slug', 'demo']);
  ma(r, 1); coDong(r, C.khongCoMan('man-moi', soDong(txt, moi[0]), 'ST-man-moi-loading'));
  const t = the(k); ma(t, 0);
  dung(t.out.includes(esc(LAB_THE)) && t.out.includes(esc(C.khongCoMan('man-moi', soDong(txt, moi[0]), 'ST-man-moi-loading'))), 'thẻ phải mang câu «không có trong sổ màn» của màn mới');
  const k0 = khoBoDi({ mau: null }); hoSo(k0); k0.ghi('docs/tk.md', txt);
  const ex = the(k, { extra: ['--extract'] }), ex0 = the(k0, { extra: ['--extract'] });
  ma(ex, 0); ma(ex0, 0);
  const a = JSON.parse(ex.out), b = JSON.parse(ex0.out);
  deepStrictEqual(a, b);
});

// ══ B — câu trả lời của lệnh đọc ════════════════════════════════════════════════════════════════════════════════════
ca('B1', () => {
  // Lệnh giả luôn ghi một dòng stderr và thoát 0 — kit chỉ đọc stdout.
  const k = khoBoDi(); const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(OVERDUE)))); ma(r, 0); coDong(r, C.khop(4, 1));
  dung(r.err === '', `--kiem xanh không in gì ra stderr, nhận «${r.err}»`);
});
ca('B2', () => {
  const thieu = tk(khoi(OVERDUE.slice(0, 1)));
  const kDuong = khoBoDi(); const r0 = kiemTep(kDuong, kDuong.ghi('docs/tk.md', thieu));
  ma(r0, 1); coDong(r0, C.thieuBatBuoc('overdue', 'empty'));
  const k = khoBoDi({ mau: 'khong-bang.json' }); const r = kiemTep(k, k.ghi('docs/tk.md', thieu));
  ma(r, 0); coDong(r, C.gioiHanMustHave()); khongDong(r, C.thieuBatBuoc('overdue', 'empty')); coDong(r, C.khop(1, 1));
});
ca('B3', () => {
  const k = khoBoDi({ mau: 'khoa-rieng.json' });
  const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(OVERDUE))));
  ma(r, 0); coDong(r, C.khoaKhongThay('entry', 'entry')); coDong(r, C.khoaKhongThay('actions', 'actions')); coDong(r, C.khop(4, 1));
});
ca('B4', () => {
  const k = khoBoDi(); duong(k);
  const la = H('ST-khong-co-x', 'khong-co');
  const txt = tk(khoi([...OVERDUE, la]));
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 1); coDong(r, C.khongCoMan('khong-co', soDong(txt, la), 'ST-khong-co-x'));
});
ca('B5', () => {
  const k = khoBoDi({ mau: 'thoat-2.json' });
  const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(OVERDUE))));
  ma(r, 2); coDong(r, C.khongDocDuoc(LY.thoat2)); khongDong(r, C.khop(4, 1));
});
ca('B6', () => {
  const k = khoBoDi({ mau: null });
  const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(OVERDUE.slice(0, 1).concat(H('ST-khong-co-x', 'khong-co'))))));
  ma(r, 0); dung(r.out === '' && r.err === '', `kho không có lệnh đọc: im hoàn toàn, nhận stdout «${r.out}» stderr «${r.err}»`);
});
ca('B7', () => { const k = khoBoDi({ mau: 'khong-json.json' }); const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(OVERDUE)))); ma(r, 2); coDong(r, C.khongDocDuoc(LY.khongJson)); });
ca('B8', () => {
  const k = khoBoDi({ mau: 'thieu-screens.json' }); const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(OVERDUE)))); ma(r, 2); coDong(r, C.khongDocDuoc(LY.thieuScreens));
  const k2 = khoBoDi({ mau: 'states-khong-mang.json' }); const r2 = kiemTep(k2, k2.ghi('docs/tk.md', tk(khoi(OVERDUE)))); ma(r2, 2); coDong(r2, C.khongDocDuoc(LY.statesKhongMang));
});
ca('B9', () => {
  const k = khoBoDi({ ngu: 5000 });
  const t0 = Date.now();
  const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(OVERDUE))), { env: { SO_MAN_HAN_MS: '1000' } });
  ma(r, 2); coDong(r, C.khongDocDuoc(LY.quaHan(1000)));
  dung(Date.now() - t0 < 4000, `quá hạn phải dừng gần 1 s, mất ${Date.now() - t0} ms`);
});
ca('B10', () => {
  const k = khoBoDi({ mau: 'thoat1-unknown-rong.json' }); const r = kiemTep(k, k.ghi('docs/tk.md', tk(khoi(OVERDUE)))); ma(r, 2); coDong(r, C.khongDocDuoc(LY.unknownRong));
  const k2 = khoBoDi({ mau: 'ma-la.json' }); const r2 = kiemTep(k2, k2.ghi('docs/tk.md', tk(khoi(OVERDUE)))); ma(r2, 2); coDong(r2, C.khongDocDuoc(LY.maLa(3)));
});
ca('B11', () => {
  const k = khoBoDi({ mau: 'thoat0-co-unknown.json' });
  const la = H('ST-khong-co-x', 'khong-co');
  const txt = tk(khoi([...OVERDUE, la]));
  const r = kiemTep(k, k.ghi('docs/tk.md', txt));
  ma(r, 1); coDong(r, C.khongCoMan('khong-co', soDong(txt, la), 'ST-khong-co-x'));
});

// ══ L — lối vào ═════════════════════════════════════════════════════════════════════════════════════════════════════
ca('L1', () => {
  const k = khoBoDi(); const rel = k.ghi('docs/tk.md', tk(khoi(OVERDUE)));
  const r = kiemTep(k, rel); ma(r, 0); coDong(r, C.khop(4, 1));
  const r2 = kiemTep(k, path.join(k.dir, rel)); ma(r2, 0); coDong(r2, C.khop(4, 1));
});
ca('L2', () => {
  const k = khoBoDi(); hoSo(k, { designDoc: 'docs/that.md' });
  const la = H('ST-overdue-xoa', 'overdue');
  const txt = tk(khoi([...OVERDUE, la]));
  k.ghi('docs/that.md', txt); k.ghi('docs/tk.md', tk(khoi(OVERDUE)));
  const r = chay(['--root', k.dir, '--kiem', '--slug', 'demo']);
  ma(r, 1); coDong(r, C.khongCoTrangThai('overdue', 'xoa', soDong(txt, la), 'ST-overdue-xoa'));
});
ca('L3', () => {
  const k = khoBoDi(); hoSo(k); k.ghi('docs/tk.md', '# Thiết kế\n\nKhông có mục đặc tả.\n');
  const r = chay(['--root', k.dir, '--kiem', '--slug', 'demo']); ma(r, 1); coDong(r, C.matNguoiKhongBang());
  const k2 = khoBoDi(); hoSo(k2, { surfaces: '[cli]' }); k2.ghi('docs/tk.md', '# Thiết kế\n\nKhông có mục đặc tả.\n');
  const r2 = chay(['--root', k2.dir, '--kiem', '--slug', 'demo']); ma(r2, 0); dung(r2.out === '', `hồ sơ không mặt người nhìn, không bảng: im, nhận «${r2.out}»`);
  const k3 = khoBoDi(); hoSo(k3, { designDoc: null });
  const r3 = chay(['--root', k3.dir, '--kiem', '--slug', 'demo']); ma(r3, 1); coDong(r3, C.matNguoiKhongBang());
});
ca('L4', () => {
  const k = khoBoDi(); hoSo(k, { designDoc: 'docs/khong-co.md' });
  const r = chay(['--root', k.dir, '--kiem', '--slug', 'demo']); ma(r, 2); coDong(r, C.tepKhongDoc('docs/khong-co.md'));
  const k2 = khoBoDi(); hoSo(k2, { designDoc: '../ngoai.md' }); writeFileSync(path.join(TAM, 'ngoai.md'), tk(khoi(OVERDUE)));
  const r2 = chay(['--root', k2.dir, '--kiem', '--slug', 'demo']); ma(r2, 2); coDong(r2, C.tepKhongDoc('../ngoai.md'));
});
ca('L5', () => {
  const k = khoBoDi();
  for (const args of [['--kiem', '--tep', 'x.md'], ['--root', k.dir, '--kiem', '--tep', 'x.md', '--xyz'], ['--root', k.dir, '--dien', '--kiem', '--slug', 'demo'], ['--root', k.dir, '--kiem']]) {
    const r = chay(args); ma(r, 2);
    dung(r.err.split('\n').includes(C.cachDung), `gọi sai ${JSON.stringify(args)} phải in dòng cách dùng ra stderr, nhận «${r.err}»`);
  }
});
ca('L6', () => {
  // Bảy câu đỏ: thẻ in năm, đếm phần còn lại; bản trích không mang khối; câu gộp như kho không có lệnh đọc.
  const la = ['a', 'b', 'c', 'd', 'e'].map(s => H(`ST-overdue-la-${s}`, 'overdue'));
  const txt = tk(khoi([...OVERDUE.slice(0, 1), ...la]));
  const k = khoBoDi(); hoSo(k); k.ghi('docs/tk.md', txt);
  const kiem = chay(['--root', k.dir, '--kiem', '--slug', 'demo']); ma(kiem, 1);
  const t = the(k); ma(t, 0);
  dung(t.out.includes(esc(LAB_THE)), 'thẻ thiếu khối Bảng trạng thái ↔ sổ màn');
  const cauDo = [...la.map(l => C.khongCoTrangThai('overdue', `la-${l.split('-la-')[1].split(' ')[0]}`, soDong(txt, l), `ST-overdue-la-${l.split('-la-')[1].split(' ')[0]}`)), C.thieuBatBuoc('overdue', 'empty'), C.thieuBatBuoc('overdue', 'error')];
  for (const c of cauDo) coDong(kiem, c);
  for (const c of cauDo.slice(0, 5)) dung(t.out.includes(esc(c)), `thẻ thiếu câu «${c}»`);
  for (const c of cauDo.slice(5)) dung(!t.out.includes(esc(c)), `thẻ in quá năm câu đỏ: «${c}»`);
  dung(t.out.includes(esc(C.theConLai(2))), 'thẻ thiếu dòng đếm câu đỏ còn lại');
  const ex = the(k, { extra: ['--extract'] }); ma(ex, 0);
  dung(!ex.out.includes('sổ màn') && !ex.out.includes('la-a'), 'bản trích --extract không được mang khối sổ màn');
  const k0 = khoBoDi({ mau: null }); hoSo(k0); k0.ghi('docs/tk.md', txt);
  const a = JSON.parse(ex.out), b = JSON.parse(the(k0, { extra: ['--extract'] }).out);
  dung(a.one_shot === b.one_shot && JSON.stringify(a.routing) === JSON.stringify(b.routing), 'khối không được đổi câu gộp hay mục hỏi người');
});
ca('L7', () => {
  const k = khoBoDi({ mau: null }); hoSo(k); k.ghi('docs/tk.md', tk(khoi(OVERDUE.slice(0, 1))));
  const t = the(k), g = the(k, { gc: gcGoc() }); ma(t, 0); ma(g, 0);
  dung(t.out === g.out, 'kho không có lệnh đọc: thẻ phải giống thẻ của cây ở gốc nhánh từng byte');
});
ca('L8', () => {
  const k = khoBoDi(); hoSo(k, { surfaces: '[cli]', designDoc: null });
  const t = the(k), g = the(k, { gc: gcGoc() }); ma(t, 0); ma(g, 0);
  dung(t.out === g.out, 'hồ sơ [cli] không bảng ở kho có lệnh đọc: thẻ phải giống thẻ của cây ở gốc nhánh từng byte');
});
ca('L9', () => {
  const k = khoBoDi({ mau: 'thoat-2.json' }); hoSo(k); k.ghi('docs/tk.md', tk(khoi(OVERDUE)));
  const t = the(k); ma(t, 0);
  dung(t.out.includes(esc(LAB_THE)) && t.out.includes(esc(C.khongDocDuoc(LY.thoat2))), 'thẻ phải mang câu «không đọc được sổ màn ở đây»');
});
ca('L10', () => {
  const k = khoBoDi({ ngu: 5000 }); hoSo(k); k.ghi('docs/tk.md', tk(khoi(OVERDUE)));
  const t = the(k, { env: { SO_MAN_HAN_MS: '1000' } }); ma(t, 0);
  dung(t.ms < 2000, `thẻ phải xong trong hạn cộng một giây (2000 ms), mất ${t.ms} ms`);
  dung(t.out.includes(esc(C.khongDocDuoc(LY.quaHan(1000)))), 'thẻ phải mang câu quá hạn');
});

// ══ D — điền ════════════════════════════════════════════════════════════════════════════════════════════════════════
const KIEM_KE = '| Màn | MỘT việc của màn | Vào từ / ra tới |';
const hk = (title, id) => `| ${title} (${id}) | {{một câu, một việc}} | {{từ đâu / tới đâu}} |`;
const hs = (id, s) => `| ST-${id}-${s} | ${id} | {{hiển thị gì}} | {{người làm gì tiếp}} |`;
ca('D1', () => {
  const k = khoBoDi();
  const r = dien(k, 'overdue,,don-hang,overdue'); ma(r, 0);
  const cho = [KIEM_KE, '|---|---|---|', hk('overdueTitle', 'overdue'), hk('donHangTitle', 'don-hang'), '',
    MO, TIEU_DE, PHAN_CACH, ...['loading', 'empty', 'error', 'list'].map(s => hs('overdue', s)),
    ...['loading', 'empty', 'error', 'chi-tiet'].map(s => hs('don-hang', s)), DONG, ''].join('\n');
  dung(r.out === cho, `khối điền khác chờ đợi:\n--- nhận ---\n${r.out}\n--- chờ ---\n${cho}`);
  dung(r.err.split('\n').includes(C.dienBatBuoc('don-hang', ['loading', 'empty', 'error'])), `stderr thiếu dòng trạng thái bắt buộc, nhận «${r.err}»`);
  const goi = k.doiSo().at(-1); dung(goi[goi.indexOf('--screens') + 1] === 'overdue,don-hang', `--man phải khử trùng và bỏ phần rỗng, nhận ${JSON.stringify(goi)}`);
});
ca('D2', () => {
  const k = khoBoDi();
  const r = dien(k, null); ma(r, 0);
  for (const [t, id] of [['overdueTitle', 'overdue'], ['donTitle', 'don'], ['donHangTitle', 'don-hang'], ['hoSoTitle', 'ho-so'], ['trongTitle', 'trong'], ['tongQuanTitle', 'tổng-quan']]) coDong(r, hk(t, id));
  dung(!k.doiSo().at(-1).includes('--screens'), 'không --man thì không hỏi --screens');
});
ca('D3', () => {
  const k = khoBoDi();
  const r = dien(k, 'overdue,khong-co'); ma(r, 1);
  coDong(r, hk('overdueTitle', 'overdue')); dung(!r.out.includes('khong-co'), 'màn lạ không được có hàng');
  dung(r.err.split('\n').includes(C.dienKhongCo('khong-co')), `stderr thiếu dòng màn lạ, nhận «${r.err}»`);
});
ca('D4', () => { const k = khoBoDi({ mau: null }); const r = dien(k, 'overdue'); ma(r, 0); dung(r.out === '' && r.err === '', 'kho không có lệnh đọc: --dien im'); });
ca('D5', () => {
  const k = khoBoDi({ mau: 'thoat-2.json' }); const r = dien(k, 'overdue'); ma(r, 2);
  dung(r.out === '', 'lệnh đọc thoát 2: stdout trống'); dung(r.err.split('\n').includes(C.khongDocDuoc(LY.thoat2)), `stderr thiếu câu không đọc được, nhận «${r.err}»`);
});
ca('D6', () => {
  const vong = (kho, sm) => {
    const d = chay(['--root', kho.dir, '--dien', '--man', 'overdue,don-hang,ho-so'], { sm }); ma(d, 0);
    const r = kiemTep(kho, kho.ghi(`docs/vong-${path.basename(path.dirname(path.dirname(sm)))}.md`, tk(d.out.trimEnd().split('\n'))), { sm });
    ma(r, 0); coDong(r, C.khop(9, 3)); coDong(r, C.oNguoiViet(18));
    return d;
  };
  const k = khoBoDi();
  vong(k, SM);
  // Bản sao khuôn đổi tên cột «Màn» của bảng trạng thái: bên điền và bên kiểm cùng đọc khuôn ấy.
  const sao = path.join(TAM, 'khuon-doi-ten');
  cpSync(path.join(AG, 'lib'), path.join(sao, 'lib'), { recursive: true });
  mkdirSync(path.join(sao, 'scripts'), { recursive: true }); cpSync(SM, path.join(sao, 'scripts/so-man.cjs'));
  mkdirSync(path.join(sao, 'skills/acceptance/references'), { recursive: true });
  const kt = readFileSync(KHUON, 'utf8');
  dung(kt.split(TIEU_DE).length === 2, 'khuôn phải có đúng một hàng tiêu đề bảng trạng thái');
  writeFileSync(path.join(sao, 'skills/acceptance/references/ux-spec-template.md'), kt.replace(TIEU_DE, '| Trạng thái | Mã màn | Hiển thị gì | Người làm gì tiếp |'));
  const d2 = vong(k, path.join(sao, 'scripts/so-man.cjs'));
  dung(d2.out.includes('| Trạng thái | Mã màn | Hiển thị gì | Người làm gì tiếp |'), 'lệnh điền phải rút hàng tiêu đề từ khuôn');
});
ca('D7', () => {
  const k = khoBoDi({ mau: 'khong-bang.json' });
  const r = dien(k, 'overdue'); ma(r, 0);
  const sau = r.dong.filter(l => l.startsWith('| ST-'));
  deepStrictEqual(sau, ['loading', 'empty', 'error', 'list'].map(s => hs('overdue', s)));
  dung(r.err.split('\n').includes(C.gioiHanMustHave()), `stderr thiếu dòng giới hạn, nhận «${r.err}»`);
});
ca('D8', () => {
  const k = khoBoDi({ mau: 'khong-bang.json' });
  const r = dien(k, 'trong'); ma(r, 0);
  coDong(r, hk('trongTitle', 'trong')); dung(!r.dong.some(l => l.startsWith('| ST-')), 'màn không trạng thái không có hàng trạng thái');
  dung(r.err.split('\n').includes(C.dienKhongTrangThai('trong')), `stderr thiếu dòng màn không trạng thái, nhận «${r.err}»`);
});
ca('D9', () => {
  const k = khoBoDi({ mau: 'ma-gach-dung.json' });
  const r = dien(k, null); ma(r, 2);
  dung(!r.out.includes('over|due') && !r.dong.some(l => l.includes('| don |') || l.includes('(don) |')), 'màn có «|» hay xuống dòng không được điền');
  coDong(r, hk('donHangTitle', 'don-hang'));
  for (const m of ['over|due', 'don']) dung(r.err.split('\n').includes(C.dienTuChoi(m)), `stderr thiếu câu từ chối màn «${m}», nhận «${r.err}»`);
});

// ══ Ngoài ma trận: F1 (nguồn mẫu), W1–W3 (nối vào SKILL và khuôn) ══════════════════════════════════════════════════
// Các đường lá khác nhau giữa hai giá trị JSON — khoá vắng một bên, khác kiểu, hay khác giá trị.
function khac(a, b, p = []) {
  const la = v => v === null || typeof v !== 'object';
  if (la(a) || la(b) || Array.isArray(a) !== Array.isArray(b)) return JSON.stringify(a) === JSON.stringify(b) ? [] : [p.join('.')];
  const out = [];
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (!(key in a) || !(key in b)) out.push([...p, key].join('.'));
    else out.push(...khac(a[key], b[key], [...p, key]));
  }
  return out;
}
ca('F1', () => {
  const nguon = JSON.parse(readFileSync(path.join(MAU, 'nguon.json'), 'utf8'));
  const tep = readdirSync(MAU).filter(f => f.endsWith('.json') && f !== 'nguon.json');
  for (const f of tep) dung(nguon[f], `mẫu ${f} chưa khai nguồn trong nguon.json`);
  for (const [f, n] of Object.entries(nguon)) {
    if (f.startsWith('_')) continue;
    dung(existsSync(path.join(MAU, f)), `nguon.json khai ${f} mà tệp không có`);
    if (n.loai === 'ban-chep') { dung(n.goi && n.phien_ban && n.lenh && n.ngay, `${f}: bản chép thiếu gói/phiên bản/lệnh/ngày`); continue; }
    dung(n.loai === 'bien-the', `${f}: loại nguồn lạ «${n.loai}»`);
    const goc = JSON.parse(readFileSync(path.join(MAU, n.goc), 'utf8'));
    dung(nguon[n.goc] && nguon[n.goc].loai === 'ban-chep', `${f}: biến thể phải suy từ một bản chép`);
    const d = khac(JSON.parse(readFileSync(path.join(MAU, f), 'utf8')), goc).sort();
    deepStrictEqual(d, [...n.khoa].sort(), `${f}: khác bản gốc ở ${JSON.stringify(d)}, khai ${JSON.stringify(n.khoa)}`);
  }
  // Lệnh giả lọc --screens đúng như lệnh thật: so với hai bản chép chạy có --screens.
  for (const [hoi, banChep] of [['overdue,khong-co', 'thoat-1.json'], ['/don-hang,don', 'theo-duong.json']]) {
    const k = khoBoDi();
    const r = spawnSync(process.execPath, [path.join(k.dir, 'tools/design-assembly/screen-facts.mjs'), '--json', '--target', k.dir, '--screens', hoi], { encoding: 'utf8' });
    const that = JSON.parse(readFileSync(path.join(MAU, banChep), 'utf8'));
    deepStrictEqual({ exit: r.status, json: JSON.parse(r.stdout) }, that, `lệnh giả lọc «${hoi}» khác bản chép ${banChep}`);
  }
});

const khoiSkill = t => (t.match(/<!-- <<<UX-SO-MAN-S1 -->\n([\s\S]*?)<!-- UX-SO-MAN-S1>>> -->/) || [])[1] || null;
const CAU_LOI_RA = 'Màn mới của chính việc này chưa có trong sổ: giữ các hàng của nó, không xoá và không đổi sang màn khác — câu đỏ lên thẻ cho người duyệt thấy.';
ca('W1', () => {
  const b = khoiSkill(readFileSync(SKILL, 'utf8'));
  dung(b, 'SKILL thiếu khối UX-SO-MAN-S1');
  const lenh = b.split('\n').filter(l => l.includes('scripts/so-man.cjs'));
  dung(lenh.length === 2, `khối phải có đúng hai lệnh so-man.cjs, có ${lenh.length}`);
  dung(lenh[0].includes('--dien') && lenh[1].includes('--kiem --slug'), 'lệnh một là --dien, lệnh hai là --kiem --slug');
  dung(b.includes(CAU_LOI_RA), 'khối thiếu nguyên câu lối ra cho màn mới');
  // Chạy được trên kho bỏ đi: phần đối số sau so-man.cjs, thay chỗ điền.
  const k = khoBoDi(); hoSo(k); k.ghi('docs/tk.md', tk(khoi(OVERDUE)));
  for (const l of lenh) {
    const duoi = l.slice(l.lastIndexOf('so-man.cjs') + 'so-man.cjs'.length).replace(/^"/, '').replace(/`.*$/, '').trim();
    const args = duoi.replace(/'?<slug>'?/g, 'demo').replace(/'?<mã,mã>'?/g, 'overdue').split(/\s+/).filter(Boolean);
    const r = chay(args, { cwd: k.dir });
    ma(r, 0);
  }
});
ca('W2', () => {
  const t = readFileSync(KHUON, 'utf8');
  const loi = t.slice(0, t.indexOf('<!-- <<<UX-SPEC-TEMPLATE -->'));
  dung(loi.includes('scripts/so-man.cjs') && loi.includes('--dien') && loi.includes('--kiem'), 'lời đầu khuôn phải nói hai lệnh so-man.cjs');
  dung(!loi.includes('KHÔNG có lưới máy nào cho đặc tả UX'), 'lời đầu khuôn còn câu «không có lưới máy nào» đã lỗi thời');
});
ca('W3', () => {
  const rut = t => (t.match(/<!-- <<<UX-SPEC-TEMPLATE -->[\s\S]*?<!-- UX-SPEC-TEMPLATE>>> -->/) || [null])[0];
  const goc = readFileSync(path.join(gocNhanh(), 'plugins/acceptance-gate/skills/acceptance/references/ux-spec-template.md'), 'utf8');
  dung(rut(goc) && rut(readFileSync(KHUON, 'utf8')) === rut(goc), 'khối UX-SPEC-TEMPLATE phải giống bản ở gốc nhánh từng byte');
});

// ── Tổng ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
const chayTrongMaTran = daChay.filter(id => MA_TRAN.includes(id)).length;
if (!LOC.length) {
  console.log(`số ca chạy: ${chayTrongMaTran}`);
  if (chayTrongMaTran !== SO_O || MA_TRAN.length !== SO_O) { failed++; console.log(`FAIL: số ca chạy ${chayTrongMaTran} khác số ô ${SO_O}`); }
}
console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
