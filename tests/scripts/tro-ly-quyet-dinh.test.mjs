// tro-ly-quyet-dinh.test.mjs — ca đo hồ sơ mac-ky-co-phu-quyet (thí điểm «trợ lý quyết định», chủ kho duyệt 22/11/2026).
// Tên ca = mã tiêu chí của hợp đồng (AC-1 … AC-10). Kho thử do code sinh trong lượt (thư mục tạm + git init); dòng máy
// do CHÍNH bộ ghi (`--write`) sinh rồi bộ đọc (can-cu-s1, thẻ) đọc — không viết tay dòng máy. Giá trị mong đợi viết sẵn
// trong ca, không rút từ đầu ra mô-đun. Mọi ca âm tính có đối chứng dương cùng kho và ghim đúng thông điệp.
// Đường dẫn suy từ vị trí tệp này.
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { tep } from '../bo-cuc.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const CAY = { thuMuc: ROOT };
const MOD = tep('scripts/tro-ly-quyet-dinh.cjs', CAY);
const CC = tep('scripts/can-cu-s1.cjs', CAY);
const GC = tep('scripts/gate-card.js', CAY);
const SKILL = tep('feature-loop/skills/feature-loop/SKILL.md', CAY);
const require = createRequire(import.meta.url);

let passed = 0, failed = 0;
const chi = process.env.TLQ_CASES ? new Set(process.env.TLQ_CASES.split(',')) : null;
const check = (n, f) => {
  if (chi && !chi.has(n.split(' ')[0])) return;
  try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); }
};
const die = m => { throw new Error(m); };
const eq = (got, want, what) => { if (JSON.stringify(got) !== JSON.stringify(want)) die(`${what}\n  got : ${JSON.stringify(got)}\n  want: ${JSON.stringify(want)}`); };
const co = (s, sub, what) => { if (!String(s).includes(sub)) die(`${what}: thiếu «${sub}»\n  trong: ${String(s).slice(0, 1500)}`); };
const khong = (s, sub, what) => { if (String(s).includes(sub)) die(`${what}: không được có «${sub}»`); };
const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ghiTep = (root, rel, t) => { mkdirSync(path.dirname(path.join(root, rel)), { recursive: true }); writeFileSync(path.join(root, rel), t); };
const node = (file, args, cwd) => spawnSync(process.execPath, [file, ...args], { cwd, encoding: 'utf8' });

// ── Kho thử ─────────────────────────────────────────────────────────────────────────────────────────────
const CFG_BAT = 'tro_ly_quyet_dinh:\n  mac_ky: true\n';
const S1 = (id, can_cu, at = '2026-11-01T00:00:00Z') => ({ id, type: 'approach', stage: 'S1', at, decision: 'Lựa chọn ' + id + ' cho hàng.', why: 'Vì hàng cần.', cost_if_wrong: 'Tốn một khúc sửa.', can_cu });
const CN = (id, loai, extra = {}, at) => S1(id, Object.assign({ nguon: 'chi-nguoi', kho_dao: false, khuyen: 'Khuyên giữ đường cũ.', loi_khac: 'Bỏ đường cũ — tốn một tiêu chí.', loai_cau: loai, vung: ['src/kho/**'] }, extra), at);
function hoSo(r, slug, { status = 'approved', surfaces = 'api, cli', dongs = [] } = {}) {
  ghiTep(r, `_acceptance/${slug}/contract.md`, `---\nschema_version: 1\nslug: ${slug}\nfeature: ${slug}\nrisk_tier: T2\nsurfaces: [${surfaces}]\nstatus: ${status}\n---\n\n# ${slug}\n`);
  ghiTep(r, `_acceptance/${slug}/decisions.jsonl`, dongs.map(x => JSON.stringify(x)).join('\n') + (dongs.length ? '\n' : ''));
}
// Kho có `tienLe` hồ sơ cũ đã duyệt, mỗi hồ sơ một câu chỉ-người cùng loại «chon-cach-lam» đi theo khuyến nghị.
function mkKho({ cfg = CFG_BAT, tienLe = 1, loaiTienLe = 'chon-cach-lam' } = {}) {
  const r = mkdtempSync(path.join(tmpdir(), 'tlq-'));
  git(r, 'init', '-q'); git(r, 'config', 'user.email', 't@t'); git(r, 'config', 'user.name', 't'); git(r, 'config', 'commit.gpgsign', 'false');
  ghiTep(r, '_acceptance/config.yaml', `schema_version: 1\n${cfg}`);
  for (let i = 1; i <= tienLe; i++) hoSo(r, `cu-${i}`, { status: 'machine-cleared', dongs: [CN(`d-cu-${i}`, loaiTienLe, {}, `2026-10-0${i}T00:00:00Z`)] });
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'goc');
  return r;
}
const dotTrong = () => { const d = mkdtempSync(path.join(tmpdir(), 'tlq-dot-')); return d; };
const docSo = (r, slug) => readFileSync(path.join(r, `_acceptance/${slug}/decisions.jsonl`), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const ghi = (r, slug, dot, them = []) => node(MOD, ['--root', r, '--slug', slug, '--write', '--dot', dot, ...them], r);
const xep = (r, slug, dot) => { const x = node(MOD, ['--root', r, '--slug', slug, '--json', '--dot', dot], r); if (x.status !== 0) die(`bộ xếp thoát ${x.status}: ${x.stderr}`); return JSON.parse(x.stdout); };
const ghiNg = (r, slug, ...a) => { const x = node(MOD, ['--root', r, '--slug', slug, '--ghi', ...a], r); if (x.status !== 0) die(`--ghi ${a.join(' ')} thoát ${x.status}: ${x.stderr}`); return x; };
const lopCua = (kq, id) => (kq.dong.find(d => d.id === id) || {}).lop;
const lyDoCua = (kq, id) => (kq.dong.find(d => d.id === id) || {}).ly_do;

// ── AC-1 — lược đồ sổ có phiên bản ─────────────────────────────────────────────────────────────────────
check('AC-1 hang-so khai ba truong moi va phien ban luoc do', () => {
  const t = require(MOD);
  eq(t.SO_DO, 2, 'phiên bản lược đồ');
  eq(t.DI_THEO, ['khuyen', 'cho-nguoi'], 'di_theo');
  eq(t.PHAM_VI, ['lan-nay', 'tu-nay'], 'pham_vi');
  eq(t.NGUON_LAM_LAI, ['phu-quyet', 'bo-kiem', 'khac'], 'nguon_lam_lai');
});
check('AC-1 check xanh tren so dung khuon, do co ten khi sai', () => {
  const r = mkKho();
  const tot = [CN('d-1', 'chon-cach-lam'),
    { id: 'd-2', type: 'approach', stage: 'gate1', at: '2026-11-02T00:00:00Z', decision: 'Chọn khác.', why: 'người chọn', cost_if_wrong: 'x', supersedes: 'd-1', decided_by: 'Chủ Kho', so_do: 2, pham_vi: 'tu-nay' },
    { id: 'd-3', type: 'fix', stage: 'S4-r1', at: '2026-11-03T00:00:00Z', decision: 'Sửa lại.', why: 'vì', cost_if_wrong: 'x', so_do: 2, nguon_lam_lai: 'bo-kiem' },
    { id: 'd-4', type: 'approach', stage: 'S1', at: '2026-11-01T00:00:00Z', decision: 'Dòng đời trước.', why: 'v', cost_if_wrong: 'x' }];
  hoSo(r, 'h', { dongs: tot });
  const x = node(MOD, ['--root', r, '--slug', 'h', '--check'], r);
  eq(x.status, 0, `đối chứng dương phải xanh (stderr: ${x.stderr})`);
  const sai = tot.concat([{ id: 'd-5', type: 'fix', stage: 'S4-r2', at: '2026-11-04T00:00:00Z', decision: 'Sửa.', why: 'v', cost_if_wrong: 'x', nguon_lam_lai: 'phu-quyet' },
    { id: 'd-6', type: 'approach', stage: 'gate1', at: '2026-11-04T00:00:00Z', decision: 'x', why: 'v', cost_if_wrong: 'x', so_do: 2, pham_vi: 'mai-mai' }]);
  hoSo(r, 'h', { dongs: sai });
  const y = node(MOD, ['--root', r, '--slug', 'h', '--check'], r);
  eq(y.status, 2, 'sổ sai khuôn phải thoát 2');
  co(y.stdout + y.stderr, 'd-5: mang nguon_lam_lai mà thiếu "so_do":2', 'thông điệp thiếu phiên bản');
  co(y.stdout + y.stderr, 'd-6: pham_vi «mai-mai» không thuộc lan-nay | tu-nay', 'thông điệp giá trị lạ');
});

check('AC-1 ben ghi dong nguoi doi ten nguoi va gia tri trong tap', () => {
  const r = mkKho(); hoSo(r, 'h', { dongs: [CN('d-1', 'chon-cach-lam')] });
  const a = node(MOD, ['--root', r, '--slug', 'h', '--ghi', 'phu-quyet', '--ve', 'd-1', '--lua-chon', 'Khác.'], r);
  eq(a.status, 2, 'thiếu --nguoi phải thoát 2'); co(a.stderr, '--nguoi <tên> bắt buộc — chữ quyết là của người', 'thông điệp thiếu người');
  const b = node(MOD, ['--root', r, '--slug', 'h', '--ghi', 'kiem-mau', '--ket', 'hong', '--nguoi', 'Chủ Kho'], r);
  eq(b.status, 2, 'kết quả lạ thoát 2'); co(b.stderr, '--ket «hong» không thuộc dat | sai', 'thông điệp kết quả lạ');
  ghiNg(r, 'h', 'kiem-mau', '--ket', 'dat', '--nguoi', 'Chủ Kho');
  ghiNg(r, 'h', 'lam-lai', '--nguon', 'bo-kiem', '--lua-chon', 'Sửa ca.');
  eq(node(MOD, ['--root', r, '--slug', 'h', '--check'], r).status, 0, 'dòng do bên ghi sinh qua --check');
});

// ── AC-2 — mặc-ký đi tiếp ngay, làn V không bị chặn ────────────────────────────────────────────────────
check('AC-2 cau chi-nguoi kho_dao=false o hang backend duoc mac-ky', () => {
  const r = mkKho(); const dot = dotTrong();
  hoSo(r, 'h', { status: 'draft', dongs: [CN('d-1', 'chon-cach-lam')] });
  const x = ghi(r, 'h', dot);
  eq(x.status, 0, `--write thoát (stderr: ${x.stderr})`);
  const so = docSo(r, 'h');
  eq(so.length, 2, 'một dòng máy được nối thêm');
  const m = so[1];
  eq([m.may, m.ve, m.di_theo, m.so_do, m.loai_cau, m.stage], ['mac-ky', 'd-1', 'khuyen', 2, 'chon-cach-lam', 'gate1'], 'khoá dòng máy');
  co(m.decision, 'Đã đi theo khuyến nghị: Khuyên giữ đường cũ.', 'câu quyết của dòng máy');
  eq(m.decided_by, undefined, 'dòng máy không mang decided_by');
  // Bộ xếp căn cứ đọc dòng máy: câu không còn đếm là «câu hỏi».
  const cc = node(CC, ['--root', r, '--slug', 'h'], r);
  co(cc.stdout, 'h · câu hỏi 0 · máy đã quyết 0 · đỏ 0', 'dòng tổng kết bộ xếp');
  co(cc.stdout, ' · mặc-ký 1', 'dòng tổng kết đếm mặc-ký');
  // Ghi lại lần hai không nhân đôi dòng.
  eq(ghi(r, 'h', dot).status, 0, 'ghi lần hai');
  eq(docSo(r, 'h').length, 2, 'ghi lần hai không thêm dòng');
});

// ── AC-3 — đóng-khi-ngờ ────────────────────────────────────────────────────────────────────────────────
check('AC-3 mon ngoai dieu kien ve hoi-nguoi voi ly do co ten', () => {
  const r = mkKho({ cfg: CFG_BAT + '  loai_tat: [ten-va-chu]\n  khong_bao_gio: ["src/thue/**"]\n', tienLe: 1 });
  // Tiền lệ cho «ten-va-chu» và vùng src/thue, để lý do thấy được là lý do của ca chứ không phải khởi động lạnh.
  hoSo(r, 'cu-tt', { status: 'machine-cleared', dongs: [CN('d-tt', 'ten-va-chu', { vung: ['src/thue/**', 'src/kho/**', 'governance/**', 'src/khac/**'] }, '2026-10-05T00:00:00Z')] });
  ghiTep(r, 'governance/autonomy.yaml', 'version: 1\ndefault: medium\nhigh:\n  - "governance/**"\n  - "**/migrations/**"\n');
  const dot = dotTrong();
  hoSo(r, 'h', { status: 'draft', dongs: [
    CN('d-ok', 'chon-cach-lam'),
    CN('d-kd', 'chon-cach-lam', { kho_dao: true }),
    CN('d-pl', 'chon-cach-lam', { pham_luat: 'SP-1' }),
    CN('d-tien', 'chon-cach-lam', { tien: true }),
    CN('d-rn', 'chon-cach-lam', { ra_ngoai: true }),
    CN('d-la', 'loai-bia'),
    CN('d-vang', undefined),
    CN('d-tat', 'ten-va-chu'),
    CN('d-kbg', 'chon-cach-lam', { vung: ['src/thue/**'] }),
    CN('d-high', 'chon-cach-lam', { vung: ['governance/**'] }),
    CN('d-vkr', 'chon-cach-lam', { vung: [] }),
    CN('d-ld', 'sua-o-dau'),
    CN('d-vm', 'chon-cach-lam', { vung: ['src/moi/**'] }),
  ] });
  eq(ghi(r, 'h', dot).status, 0, '--write');
  const kq = xep(r, 'h', dot);
  const want = { 'd-ok': ['mac-ky', null], 'd-kd': ['hoi', 'kho-dao'], 'd-pl': ['hoi', 'luat-san-pham'], 'd-tien': ['hoi', 'tien-ra-ngoai'], 'd-rn': ['hoi', 'tien-ra-ngoai'], 'd-la': ['hoi', 'loai-la'], 'd-vang': ['hoi', 'loai-la'],
    'd-tat': ['hoi', 'loai-tat'], 'd-kbg': ['hoi', 'khong-bao-gio'], 'd-high': ['hoi', 'vung-high'], 'd-vkr': ['hoi', 'vung-khong-ro'], 'd-ld': ['hoi', 'lan-dau-loai'], 'd-vm': ['hoi', 'lan-dau-vung'] };
  for (const [id, [lop, ly]] of Object.entries(want)) eq([lopCua(kq, id), lyDoCua(kq, id) ?? null], [lop, ly], `lớp của ${id}`);
  const t = require(MOD);
  eq(t.LY_DO['vung-high'], 'vùng tầng high của luật tự trị (governance/autonomy.yaml)', 'thông điệp vùng high');
  eq(t.LY_DO['lan-dau-loai'], 'lần đầu của loại câu này — khởi động lạnh, hỏi người', 'thông điệp khởi động lạnh');
  // Dòng máy chờ-người ghi lý do — sổ đếm đọc được vì sao câu vẫn hỏi.
  const may = docSo(r, 'h').filter(e => e.may === 'mac-ky');
  eq(may.length, 13, 'mỗi câu một dòng máy');
  eq(may.find(e => e.ve === 'd-high').di_theo, 'cho-nguoi', 'câu vùng high chờ người');
});
check('AC-3 hang man hinh va hop dong khong khai surfaces khong mac-ky', () => {
  for (const [surfaces, ly] of [['ui', 'man-hinh'], ['api, web', 'man-hinh'], ['', 'loai-hang-khong-ro']]) {
    const r = mkKho(); const dot = dotTrong();
    hoSo(r, 'h', { status: 'draft', surfaces, dongs: [CN('d-1', 'chon-cach-lam')] });
    eq(ghi(r, 'h', dot).status, 0, '--write');
    const kq = xep(r, 'h', dot);
    eq([lopCua(kq, 'd-1'), lyDoCua(kq, 'd-1')], ['hoi', ly], `surfaces «${surfaces}»`);
  }
});

check('AC-3 tep that ngoai vung khai hay cham tang high thi ve hoi-nguoi khi co goc nhanh', () => {
  const r = mkKho(); const dot = dotTrong();
  ghiTep(r, 'governance/autonomy.yaml', 'version: 1\nhigh:\n  - "**/billing/**"\n');
  hoSo(r, 'h', { status: 'draft', dongs: [CN('d-1', 'chon-cach-lam')] });
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'ho so'); const base = git(r, 'rev-parse', 'HEAD');
  eq(ghi(r, 'h', dot).status, 0, '--write');
  const xepB = () => { const x = node(MOD, ['--root', r, '--slug', 'h', '--json', '--dot', dot, '--base', base], r); if (x.status) die(x.stderr); return JSON.parse(x.stdout); };
  ghiTep(r, 'src/kho/nhap.ts', 'x\n'); git(r, 'add', '-A'); git(r, 'commit', '-qm', 'trong vung');
  eq(lopCua(xepB(), 'd-1'), 'mac-ky', 'đối chứng dương: diff nằm trong vùng khai');
  ghiTep(r, 'src/api/billing/thu.ts', 'x\n'); git(r, 'add', '-A'); git(r, 'commit', '-qm', 'ngoai vung');
  const kq = xepB();
  eq([lopCua(kq, 'd-1'), lyDoCua(kq, 'd-1')], ['hoi', 'vung-lech'], 'diff chạm tệp ngoài vùng khai');
  eq(kq.dong[0].tep, ['src/api/billing/thu.ts'], 'nêu tệp lệch');
  const cc = node(CC, ['--root', r, '--slug', 'h', '--base', base], r);
  co(cc.stdout, 'h · câu hỏi 1 ·', 'bộ xếp căn cứ (có gốc nhánh) đếm lại thành câu hỏi');
  // Vùng khai rộng phủ cả tệp tầng high → vẫn hỏi vì tệp thật chạm high.
  hoSo(r, 'k', { status: 'draft', dongs: [CN('d-2', 'chon-cach-lam', { vung: ['src/**'] })] });
  hoSo(r, 'cu-src', { status: 'machine-cleared', dongs: [CN('d-s', 'chon-cach-lam', { vung: ['src/**'] }, '2026-10-02T00:00:00Z')] });
  ghi(r, 'k', dot);
  const k = JSON.parse(node(MOD, ['--root', r, '--slug', 'k', '--json', '--dot', dot, '--base', base], r).stdout);
  eq([lopCua(k, 'd-2'), lyDoCua(k, 'd-2')], ['hoi', 'vung-high'], 'tệp thật tầng high');
});

// ── AC-4 — giữ-quyền ───────────────────────────────────────────────────────────────────────────────────
check('AC-4 giu-quyen theo slug va theo vung luon hoi-nguoi ke ca loai da thang cap', () => {
  const r = mkKho({ cfg: CFG_BAT + '  thang_cap: [chon-cach-lam]\n', tienLe: 5 });
  const dot = dotTrong();
  hoSo(r, 'h', { status: 'draft', dongs: [CN('d-1', 'chon-cach-lam')] });
  hoSo(r, 'k', { status: 'draft', dongs: [CN('d-2', 'chon-cach-lam', { vung: ['src/kho/nhap/**'] })] });
  // Đối chứng dương: chưa giữ-quyền thì loại đã thăng cấp → máy tự quyết.
  eq(ghi(r, 'h', dot).status, 0, '--write h');
  eq(lopCua(xep(r, 'h', dot), 'd-1'), 'thang-cap', 'đối chứng: loại đã thăng cấp');
  writeFileSync(path.join(dot, 'giu-quyen.txt'), '# vùng chủ kho tự quyết\nh\nsrc/kho/nhap/**\n');
  const kh = xep(r, 'h', dot); const kk = (ghi(r, 'k', dot), xep(r, 'k', dot));
  eq([lopCua(kh, 'd-1'), lyDoCua(kh, 'd-1')], ['hoi', 'giu-quyen'], 'giữ-quyền theo slug thắng thăng cấp');
  eq([lopCua(kk, 'd-2'), lyDoCua(kk, 'd-2')], ['hoi', 'giu-quyen'], 'giữ-quyền theo vùng');
  const mk = docSo(r, 'k').find(e => e.may === 'mac-ky');
  eq([mk.di_theo, mk.ly_do, mk.giu_quyen], ['cho-nguoi', 'giu-quyen', 'src/kho/nhap/**'], 'dòng máy ghi lần kéo');
  const d = JSON.parse(node(MOD, ['--root', r, '--dem', '--json', '--dot', dot], r).stdout);
  eq(d.loai.find(x => x.loai === 'chon-cach-lam').keo, 1, 'sổ đếm thấy một lần kéo (hồ sơ draft vẫn đếm lần kéo)');
});

// ── AC-5 — sổ đếm và danh sách thăng cấp ───────────────────────────────────────────────────────────────
function khoDem(cfgThem = '') {
  const r = mkKho({ cfg: CFG_BAT + cfgThem, tienLe: 0 });
  // sua-o-dau: 5 lần, theo cả 5 → đạt ngưỡng mặc định. chon-cach-lam: 5 lần, một lần chủ kho chọn khác. ten-va-chu: 3 lần.
  // Dòng làm lại và dòng chọn khác đi qua CHÍNH bên ghi (--ghi), không viết tay.
  for (let i = 1; i <= 5; i++) { hoSo(r, `a-${i}`, { status: 'machine-cleared', dongs: [CN(`d-a${i}`, 'sua-o-dau', {}, `2026-10-1${i}T00:00:00Z`)] }); ghiNg(r, `a-${i}`, 'lam-lai', '--nguon', 'bo-kiem', '--ve', `d-a${i}`, '--lua-chon', 'Sửa ca kiểm mong manh.', '--stage', 'S4-r1'); }
  for (let i = 1; i <= 5; i++) { hoSo(r, `b-${i}`, { status: 'machine-cleared', dongs: [CN(`d-b${i}`, 'chon-cach-lam', {}, `2026-10-2${i}T00:00:00Z`)] }); if (i === 3) ghiNg(r, 'b-3', 'phu-quyet', '--ve', 'd-b3', '--nguoi', 'Chủ Kho', '--lua-chon', 'Bỏ đường cũ.', '--pham-vi', 'tu-nay'); }
  for (let i = 1; i <= 3; i++) hoSo(r, `c-${i}`, { status: 'machine-cleared', dongs: [CN(`d-c${i}`, 'ten-va-chu', {}, `2026-10-0${i}T00:00:00Z`)] });
  hoSo(r, 'nhap', { status: 'draft', dongs: [CN('d-n', 'ten-va-chu')] }); // chưa trả lời — không vào mẫu số
  return r;
}
check('AC-5 so dem in bang theo loai va trinh loai dat nguong mac dinh', () => {
  const r = khoDem(); const dot = dotTrong();
  const x = node(MOD, ['--root', r, '--dem', '--dot', dot], r);
  eq(x.status, 0, `--dem thoát (stderr: ${x.stderr})`);
  co(x.stdout, 'sua-o-dau · hỏi 5 · theo 5 · 100% · phủ quyết 0 · làm lại phủ-quyết 0 / bộ-kiểm 5 / khác 0 · kéo 0 · kiểm mẫu sai 0 · đạt ngưỡng', 'hàng sua-o-dau');
  co(x.stdout, 'chon-cach-lam · hỏi 5 · theo 4 · 80% · phủ quyết 0', 'hàng chon-cach-lam');
  co(x.stdout, 'ten-va-chu · hỏi 3 · theo 3 · 100%', 'hàng ten-va-chu (hồ sơ draft không vào mẫu số)');
  co(x.stdout, 'Đề nghị thăng cấp: sua-o-dau', 'danh sách thăng cấp');
  khong(x.stdout.split('Đề nghị thăng cấp:')[1].split('\n')[0], 'chon-cach-lam', 'loại có lần chọn khác không được trình');
  const j = JSON.parse(node(MOD, ['--root', r, '--dem', '--json', '--dot', dot], r).stdout);
  eq(j.de_nghi_thang_cap, ['sua-o-dau'], 'JSON đề nghị');
  eq(j.loai.find(x => x.loai === 'chon-cach-lam').tu_nay, 1, 'đếm câu trả lời «từ nay»');
});
check('AC-5 nguong la cau hinh cua kho', () => {
  const r = khoDem('  nguong_hoi: 3\n  nguong_theo: 80\n'); const dot = dotTrong();
  const j = JSON.parse(node(MOD, ['--root', r, '--dem', '--json', '--dot', dot], r).stdout);
  eq(j.de_nghi_thang_cap, ['sua-o-dau', 'chon-cach-lam', 'ten-va-chu'], 'ngưỡng 3 lần / 80 % (theo thứ tự danh mục)');
  const r2 = khoDem('  nguong_hoi: 0\n'); const x = node(MOD, ['--root', r2, '--dem', '--dot', dot], r2);
  eq(x.status, 2, 'ngưỡng sai giá trị phải thoát 2');
  co(x.stderr, 'tro_ly_quyet_dinh.nguong_hoi: «0» không hợp lệ — dùng số nguyên dương', 'thông điệp khoá sai');
});

check('AC-5 keo va lam lai do phu quyet chan thang cap, lam lai do bo kiem thi khong', () => {
  const dot = dotTrong();
  const mk = (them) => { const r = mkKho({ tienLe: 0 }); for (let i = 1; i <= 5; i++) hoSo(r, `a-${i}`, { status: 'machine-cleared', dongs: [CN(`d-a${i}`, 'sua-o-dau', {}, `2026-10-1${i}T00:00:00Z`)] }); them(r); return JSON.parse(node(MOD, ['--root', r, '--dem', '--json', '--dot', dot], r).stdout); };
  eq(mk(r => ghiNg(r, 'a-2', 'lam-lai', '--nguon', 'bo-kiem', '--ve', 'd-a2', '--lua-chon', 'Sửa ca mong manh.')).de_nghi_thang_cap, ['sua-o-dau'], 'đối chứng dương: làm lại do bộ kiểm không chặn');
  eq(mk(r => ghiNg(r, 'a-2', 'lam-lai', '--nguon', 'khac', '--ve', 'd-a2', '--lua-chon', 'Sửa vì lý do khác.')).de_nghi_thang_cap, ['sua-o-dau'], 'làm lại nguồn khác không chặn');
  eq(mk(r => ghiNg(r, 'a-2', 'lam-lai', '--nguon', 'phu-quyet', '--ve', 'd-a2', '--lua-chon', 'Dựng lại theo lối người chọn.')).de_nghi_thang_cap, [], 'làm lại do phủ quyết chặn');
  const keo = mk(r => { const d2 = dotTrong(); writeFileSync(path.join(d2, 'giu-quyen.txt'), 'g\n'); hoSo(r, 'g', { status: 'machine-cleared', dongs: [CN('d-g', 'sua-o-dau', {}, '2026-10-19T00:00:00Z')] }); writeFileSync(path.join(r, '_acceptance/config.yaml'), 'schema_version: 1\n' + CFG_BAT); node(MOD, ['--root', r, '--slug', 'g', '--write', '--dot', d2], r); });
  eq(keo.loai.find(x => x.loai === 'sua-o-dau').keo, 1, 'một lần kéo được đếm');
  eq(keo.de_nghi_thang_cap, [], 'một lần kéo trong cửa sổ chặn thăng cấp');
});

// ── AC-6 — giáng loại ──────────────────────────────────────────────────────────────────────────────────
check('AC-6 phu quyet trong cua so giang loai da thang cap va ho so chua gop ve cau hoi', () => {
  const r = mkKho({ cfg: CFG_BAT + '  thang_cap: [chon-cach-lam]\n', tienLe: 5 }); const dot = dotTrong();
  hoSo(r, 'h', { status: 'approved', dongs: [CN('d-1', 'chon-cach-lam', {}, '2026-11-10T00:00:00Z')] });
  eq(ghi(r, 'h', dot).status, 0, '--write');
  eq(lopCua(xep(r, 'h', dot), 'd-1'), 'thang-cap', 'đối chứng dương: trước phủ quyết là thăng cấp');
  // Chủ kho phủ quyết một món mặc-ký ở hồ sơ khác (đã ký) — dòng người thay dòng S1.
  hoSo(r, 'v', { status: 'machine-cleared', dongs: [CN('d-v', 'chon-cach-lam', {}, '2026-11-05T00:00:00Z')] });
  eq(ghi(r, 'v', dot).status, 0, '--write v');
  ghiNg(r, 'v', 'phu-quyet', '--ve', 'd-v', '--nguoi', 'Chủ Kho', '--lua-chon', 'Bỏ đường cũ.');
  const pq = docSo(r, 'v').pop();
  eq([pq.supersedes, pq.decided_by, pq.so_do, pq.pham_vi, pq.stage], ['d-v', 'Chủ Kho', 2, 'lan-nay', 'gate1'], 'dòng phủ quyết do bên ghi sinh');
  const kq = xep(r, 'h', dot);
  eq([lopCua(kq, 'd-1'), lyDoCua(kq, 'd-1')], ['hoi', 'loai-bi-giang'], 'hồ sơ chưa gộp về câu hỏi');
  const cc = node(CC, ['--root', r, '--slug', 'h'], r);
  co(cc.stdout, 'h · câu hỏi 1 ·', 'bộ xếp căn cứ đếm lại thành câu hỏi');
  const d = node(MOD, ['--root', r, '--dem', '--dot', dot], r);
  co(d.stdout, 'Bị giáng: chon-cach-lam — hồ sơ chưa ký phải kiểm lại: h', 'danh sách giáng');
});
check('AC-6 phu quyet mot mon mac-ky chan mac-ky cua loai chua thang cap toi lan tra loi moi', () => {
  const r = mkKho({ tienLe: 1 }); const dot = dotTrong();
  hoSo(r, 'v', { status: 'machine-cleared', dongs: [CN('d-v', 'chon-cach-lam', {}, '2026-11-05T00:00:00Z')] });
  ghi(r, 'v', dot);
  hoSo(r, 'h', { status: 'draft', dongs: [CN('d-1', 'chon-cach-lam', {}, '2026-11-10T00:00:00Z')] });
  ghi(r, 'h', dot);
  eq(lopCua(xep(r, 'h', dot), 'd-1'), 'mac-ky', 'đối chứng dương: chưa phủ quyết thì mặc-ký');
  ghiNg(r, 'v', 'phu-quyet', '--ve', 'd-v', '--nguoi', 'Chủ Kho', '--lua-chon', 'Bỏ đường cũ.');
  eq([lopCua(xep(r, 'h', dot), 'd-1'), lyDoCua(xep(r, 'h', dot), 'd-1')], ['hoi', 'loai-bi-giang'], 'sau phủ quyết: hỏi người');
  // Một lần trả lời mới (ghi SAU giờ phủ quyết — bên ghi đóng giờ thật) mở lại đường mặc-ký.
  hoSo(r, 'moi', { status: 'machine-cleared', dongs: [CN('d-m', 'chon-cach-lam', {}, '2099-01-01T00:00:00Z')] });
  eq(lopCua(xep(r, 'h', dot), 'd-1'), 'mac-ky', 'có lần trả lời mới thì mặc-ký lại');
});
check('AC-6 kiem mau ra sai cung giang loai', () => {
  const r = mkKho({ cfg: CFG_BAT + '  thang_cap: [chon-cach-lam]\n', tienLe: 5 }); const dot = dotTrong();
  hoSo(r, 'h', { status: 'approved', dongs: [CN('d-1', 'chon-cach-lam', {}, '2026-11-10T00:00:00Z')] });
  ghi(r, 'h', dot);
  eq(lopCua(xep(r, 'h', dot), 'd-1'), 'thang-cap', 'đối chứng dương');
  // Đối chứng: kiểm mẫu ĐẠT không giáng.
  ghiNg(r, 'cu-4', 'kiem-mau', '--ket', 'dat', '--ve', 'd-cu-4', '--nguoi', 'Chủ Kho');
  eq(lopCua(xep(r, 'h', dot), 'd-1'), 'thang-cap', 'kiểm mẫu đạt giữ cấp');
  ghiNg(r, 'cu-5', 'kiem-mau', '--ket', 'sai', '--ve', 'd-cu-5', '--nguoi', 'Chủ Kho', '--lua-chon', 'Bàn giao thiếu ca.');
  eq([lopCua(xep(r, 'h', dot), 'd-1'), lyDoCua(xep(r, 'h', dot), 'd-1')], ['hoi', 'loai-bi-giang'], 'kiểm mẫu sai giáng');
});

// ── AC-7 — kiểm mẫu tất định ~1/N ──────────────────────────────────────────────────────────────────────
check('AC-7 kiem mau chon tat dinh khoang mot phan nam ho so co mac-ky', () => {
  const t = require(MOD);
  const chon = Array.from({ length: 200 }, (_, i) => `hang-${i}`).filter(s => t.chonKiemMau(s, 5));
  if (chon.length < 25 || chon.length > 60) die(`200 slug chọn ${chon.length} — ngoài khoảng 25–60 của 1/5`);
  eq(t.chonKiemMau('hang-7', 5), t.chonKiemMau('hang-7', 5), 'tất định');
  eq(Array.from({ length: 50 }, (_, i) => t.chonKiemMau(`x-${i}`, 1)).every(Boolean), true, 'kiem_mau_moi 1 = soi mọi hồ sơ');
  // Hồ sơ được chọn có cờ trên kết quả xếp.
  const r = mkKho(); const dot = dotTrong();
  const slug = chon[0];
  hoSo(r, slug, { status: 'draft', dongs: [CN('d-1', 'chon-cach-lam')] });
  ghi(r, slug, dot);
  eq(xep(r, slug, dot).kiem_mau, true, 'cờ kiểm mẫu trên hồ sơ được chọn');
  const bo = Array.from({ length: 200 }, (_, i) => `hang-${i}`).find(s => !t.chonKiemMau(s, 5));
  hoSo(r, bo, { status: 'draft', dongs: [CN('d-1', 'chon-cach-lam')] });
  ghi(r, bo, dot);
  eq(xep(r, bo, dot).kiem_mau, false, 'hồ sơ không được chọn không có cờ');
});

// ── AC-8 — thẻ Cổng Phạm vi ────────────────────────────────────────────────────────────────────────────
check('AC-8 the cong pham vi co khoi da di theo khuyen nghi va extract mang mac_ky', () => {
  const r = mkKho(); const dot = dotTrong();
  hoSo(r, 'h', { status: 'draft', dongs: [CN('d-1', 'chon-cach-lam'), CN('d-2', 'sua-o-dau')] });
  ghi(r, 'h', dot);
  const x = node(GC, ['--gate', '1', '--root', r, '--slug', 'h'], r);
  eq(x.status, 0, `thẻ dựng được (stderr: ${x.stderr.slice(0, 400)})`);
  const html = x.stdout;
  co(html, 'Đã đi theo khuyến nghị — phủ quyết trước khi gộp nếu khác ý', 'tiêu đề khối');
  co(html, 'data-mac-ky="d-1"', 'dòng mặc-ký');
  co(html, 'đã theo: Khuyên giữ đường cũ.', 'khuyến nghị đã theo');
  co(html, 'giữ lại tôi quyết', 'đường giữ-quyền');
  co(html, 'data-cau-hoi="Hỏi-1"', 'câu lần đầu vẫn là câu hỏi');
  khong(html, 'data-mac-ky="d-2"', 'câu lần đầu không ở khối mặc-ký');
  const e = node(GC, ['--gate', '1', '--root', r, '--slug', 'h', '--extract'], r);
  const j = JSON.parse(e.stdout);
  eq(j.can_cu.mac_ky.map(d => d.id), ['d-1'], 'extract mang mac_ky');
  eq(j.can_cu.cau_hoi.map(d => d.id), ['d-2'], 'extract cau_hoi chỉ còn câu lần đầu');
});

// ── AC-9 — tắt cờ = hành vi cũ ─────────────────────────────────────────────────────────────────────────
check('AC-9 tat co thi khong ghi byte nao va bo xep the nhu cu', () => {
  for (const cfg of ['', 'tro_ly_quyet_dinh:\n  mac_ky: false\n']) {
    const r = mkKho({ cfg }); const dot = dotTrong();
    hoSo(r, 'h', { status: 'draft', dongs: [CN('d-1', 'chon-cach-lam')] });
    const truoc = readFileSync(path.join(r, '_acceptance/h/decisions.jsonl'), 'utf8');
    const x = ghi(r, 'h', dot);
    eq(x.status, 0, '--write khi tắt thoát 0');
    co(x.stdout, 'mặc-ký tắt', 'nói ra là tắt');
    eq(readFileSync(path.join(r, '_acceptance/h/decisions.jsonl'), 'utf8'), truoc, 'sổ không đổi byte nào');
    const cc = node(CC, ['--root', r, '--slug', 'h'], r);
    eq(cc.stdout.split('\n')[0], 'h · câu hỏi 1 · máy đã quyết 0 · đỏ 0 · đời trước 0 · bị thay 0 · gốc chua-kiem', 'dòng tổng kết y như trước vòng');
    const e = JSON.parse(node(GC, ['--gate', '1', '--root', r, '--slug', 'h', '--extract'], r).stdout);
    eq(Object.prototype.hasOwnProperty.call(e.can_cu, 'mac_ky'), false, 'extract không thêm khoá khi tắt');
  }
});
check('AC-9 vang mo-dun thi cau van la cau hoi', () => {
  // Bản sao bộ xếp đứng một mình (không có tro-ly-quyet-dinh.cjs cạnh nó) — như kho tiêu thụ chép thiếu.
  const r = mkKho(); const dot = dotTrong();
  hoSo(r, 'h', { status: 'draft', dongs: [CN('d-1', 'chon-cach-lam')] });
  ghi(r, 'h', dot);
  const sao = mkdtempSync(path.join(tmpdir(), 'tlq-sao-'));
  cpSync(path.dirname(CC), path.join(sao, 'scripts'), { recursive: true });
  cpSync(path.join(path.dirname(CC), '..', 'lib'), path.join(sao, 'lib'), { recursive: true });
  const ccDu = node(path.join(sao, 'scripts', 'can-cu-s1.cjs'), ['--root', r, '--slug', 'h'], r);
  co(ccDu.stdout, 'h · câu hỏi 0 ·', 'đối chứng dương: bản sao đủ tệp đọc được mặc-ký');
  rmSync(path.join(sao, 'scripts', 'tro-ly-quyet-dinh.cjs'));
  const ccThieu = node(path.join(sao, 'scripts', 'can-cu-s1.cjs'), ['--root', r, '--slug', 'h'], r);
  co(ccThieu.stdout, 'h · câu hỏi 1 ·', 'vắng mô-đun: câu vẫn là câu hỏi (đóng an toàn)');
});

// ── AC-10 — khuôn bên viết một nguồn, round-trip ───────────────────────────────────────────────────────
check('AC-10 khuon trong SKILL ghi bang writer doc bang reader', () => {
  const s = readFileSync(SKILL, 'utf8');
  const khoi = (ten) => { const m = s.match(new RegExp(`<!-- <<<${ten} -->\\n([\\s\\S]*?)\\n<!-- ${ten}>>> -->`)); if (!m) die(`SKILL thiếu khối ${ten}`); return m[1]; };
  const slot = khoi('DEC-TRO-LY-SLOT');
  const t = require(MOD);
  // Mỗi dòng của khối là một mảnh JSON nối sau `"cost_if_wrong":…` — điền ô rồi parse, khoá phải đúng tập của mô-đun.
  const dien = l => l.replace(/<loại câu[^>]*>/, 'chon-cach-lam').replace(/<glob[^>]*>/, 'src/kho/**').replace(/<mã dòng[^>]*>/, 'd-1').replace(/<([a-z-]+)\|[^>]*>/g, '$1').replace(/<[^>]+>/g, 'x');
  const manh = slot.split('\n').filter(l => l.startsWith(',')).map(l => JSON.parse('{' + dien(l).slice(1) + '}'));
  if (manh.length < 4) die(`khối DEC-TRO-LY-SLOT cần ≥4 mảnh, có ${manh.length}`);
  const r = mkKho(); const dot = dotTrong();
  const base = CN('d-1', undefined);
  const s1 = Object.assign({}, base, { can_cu: Object.assign({}, base.can_cu, manh[0].can_cu || {}) });
  delete s1.can_cu.loai_cau; Object.assign(s1.can_cu, manh.find(m => m.can_cu).can_cu);
  const dongNguoi = manh.filter(m => !m.can_cu).map((m, i) => Object.assign({ id: `d-n${i}`, type: m.nguon_lam_lai ? 'fix' : 'approach', stage: m.nguon_lam_lai ? 'S4-r1' : 'gate1', at: '2026-11-02T00:00:00Z', decision: 'x', why: 'v', cost_if_wrong: 'x' }, m));
  hoSo(r, 'h', { status: 'draft', dongs: [s1, ...dongNguoi.filter(d => !d.supersedes)] });
  const k = node(MOD, ['--root', r, '--slug', 'h', '--check'], r);
  eq(k.status, 0, `khuôn SKILL qua --check (stdout: ${k.stdout} stderr: ${k.stderr})`);
  eq(ghi(r, 'h', dot).status, 0, '--write trên dòng điền từ khuôn');
  eq(lopCua(xep(r, 'h', dot), 'd-1'), 'mac-ky', 'reader đọc dòng điền từ khuôn thành mặc-ký');
  const lenh = khoi('MAC-KY-GHI');
  co(lenh, 'tro-ly-quyet-dinh.cjs" --root . --slug <slug> --write', 'khối lệnh ghi trước thẻ Cổng Phạm vi');
  eq(Object.keys(t.LOAI_CAU).every(k2 => s.includes('`' + k2 + '`')), true, 'SKILL liệt mọi mã của danh mục loại câu');
});

console.log(`\nTLQ Results: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
