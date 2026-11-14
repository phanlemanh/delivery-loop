// bo-kiem.test.mjs — kiểm hai chiều cho phần B2 của kịch bản chuyển nhà (hồ sơ _acceptance/bo-kiem-xanh-o-kho-moi/):
// bước 6 đổi bộ kiểm (AC-1), thước đảo phép đổi (AC-2), chặn tên nhánh đích (AC-6).
// Chạy: node --test migration/kich-ban/bo-kiem.test.mjs
//
// Mỗi ca dựng kho fixture riêng bằng mã (fixture.mjs) trong thư mục tạm. Chiều đỏ chạy bản sao có tiêm đúng một kim, hoặc
// một nhánh hỏng dựng trên cây đích, và ghim đúng thông điệp. Tên ca = mã trong evals.yaml.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dungKhoFixture, git, themCommit, VA_FIXTURE } from './fixture.mjs';
import { chupKho, soChup, kiemCho } from './kiem-cho.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KB = path.join(DAY, 'don-nha.mjs');
const tam = [];
after(() => { for (const d of tam) fs.rmSync(d, { recursive: true, force: true }); });
const moTam = (ten = 'bk-') => { const d = fs.mkdtempSync(path.join(os.tmpdir(), ten)); tam.push(d); return d; };
const moFix = (tuyChon) => dungKhoFixture(moTam(), tuyChon);
const chay = (script, args, env = {}) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', env: { ...process.env, ...env } });
const donNha = (f, nhanh, { script = KB, bangXep = f.bangXep } = {}) =>
  chay(script, ['--kho', f.kho, '--nguon', f.nguon, '--nhanh', nhanh, '--bang-xep', bangXep, '--repo-standards', f.rs]);
const coRef = (kho, ref) => spawnSync('git', ['-C', kho, 'rev-parse', '--verify', '-q', ref], { encoding: 'utf8' }).status === 0;

// ── AC-6 — tên nhánh đích ─────────────────────────────────────────────────────────────────────────────────────────
test('BK-AC6', () => {
  const f = moFix();
  const r = donNha(f, 'don-nha/thu');
  assert.equal(r.status, 0, r.stderr);
  assert.ok(coRef(f.kho, 'refs/heads/don-nha/thu'), 'đối chứng dương: nhánh don-nha/thu phải có');
});

for (const [ma, ten] of [['main', 'main'], ['chuyen-nha', 'chuyen-nha'], ['kit-cu-main', 'kit-cu/main'], ['nhanh-khac', 'nhanh-khac']]) {
  test(`BK-AC6-do-${ma}`, () => {
    const f = moFix();
    git(f.kho, ['branch', '-f', 'chuyen-nha', f.nguon]);
    git(f.kho, ['update-ref', 'refs/remotes/kit-cu/main', f.nguon]);
    const truoc = chupKho(f.kho);
    const r = donNha(f, ten);
    assert.equal(r.status, 2, `phải thoát 2 với --nhanh ${ten}; stderr: ${r.stderr}`);
    assert.match(r.stderr, new RegExp(`nhánh đích phải là don-nha/<tên>: ${ten.replace('/', '\\/')}`));
    assert.deepEqual(soChup(truoc, chupKho(f.kho)), [], 'ref, HEAD, thư mục làm việc phải đứng yên');
  });
}

// ── AC-1 — bước 6: bộ kiểm theo bố cục mới ────────────────────────────────────────────────────────────────────────
const TAP_BUOC6 = (t) => (t.startsWith('tests/') && !t.includes('/fixtures/')) || t.startsWith('.github/workflows/') || t === 'Makefile' || t === '_acceptance/config.yaml';
const xem = (f, ref, tep) => git(f.kho, ['show', `${ref}:${tep}`]);

test('BK-AC1', () => {
  const f = moFix();
  const ra = moTam('bk-ra-');
  const r = chay(KB, ['--kho', f.kho, '--nguon', f.nguon, '--nhanh', 'don-nha/a', '--bang-xep', f.bangXep, '--repo-standards', f.rs, '--ra', ra]);
  assert.equal(r.status, 0, r.stderr);
  const tieuDe = git(f.kho, ['log', '--format=%s', `${f.nguon}..don-nha/a`]).trim().split('\n').reverse();
  assert.equal(tieuDe.length, 6, tieuDe.join('\n'));
  tieuDe.forEach((t, i) => assert.match(t, new RegExp(`^dọn nhà ${i + 1}/6: `)));
  assert.equal(tieuDe[5], 'dọn nhà 6/6: bộ kiểm theo bố cục mới');
  const cham = git(f.kho, ['diff', '--name-only', 'don-nha/a~1', 'don-nha/a']).trim().split('\n').filter(Boolean);
  assert.ok(cham.length > 0, 'commit 6 phải chạm ít nhất một tệp');
  for (const t of cham) assert.ok(TAP_BUOC6(t), `commit 6 chạm tệp ngoài tập bước 6: ${t}`);
  // Hình dạng phải ĐỔI.
  const sh = xem(f, 'don-nha/a', 'tests/scripts/run-tests.sh');
  assert.match(sh, /CHECK="\$HERE\/\.\.\/\.\.\/plugins\/acceptance-gate\/scripts\/goi\.mjs"/);
  assert.match(sh, /node "\$ROOT\/plugins\/acceptance-gate\/scripts\/cat-luot\.mjs"/);
  assert.match(sh, /show HEAD:plugins\/acceptance-gate\/scripts\/goi\.mjs/);
  const js = xem(f, 'don-nha/a', 'tests/scripts/ban-sao.test.mjs');
  assert.match(js, /path\.join\(KIT, 'plugins\/acceptance-gate\/scripts', 'goi\.mjs'\)/);
  assert.match(js, /\['plugins\/acceptance-gate\/scripts', 'plugins\/acceptance-gate\/commands'\]/);
  assert.match(js, /'\/dispatch:open'/);
  assert.match(js, /VUNG = 'plugins\/acceptance-gate\/scripts'/, 'mục bảng vá phải được áp');
  assert.match(js, /QUA_CHA = path\.join\(HERE, '\.\.', '\.\.', 'plugins\/acceptance-gate\/scripts', 'goi\.mjs'\)/, 'cặp phần tử sau ../..');
  assert.match(js, /BAN_SAO = \(c\) => path\.join\(c, 'plugins\/acceptance-gate\/scripts', 'goi\.mjs'\)/, 'cặp phần tử sau biến bản sao, không mơ hồ');
  assert.match(js, /MO_HO = \(DP\) => path\.join\(DP, 'hooks', 'hooks\.json'\)/, 'cặp phần tử mơ hồ giữ nguyên');
  assert.match(js, /AG = \['--ag-root', `\$\{KIT\}\/plugins\/acceptance-gate`\]/, 'gốc plugin lõi qua --ag-root');
  assert.match(js, /ENV = \{ CLAUDE_PLUGIN_ROOT: `\$\{KIT\}\/plugins\/acceptance-gate` \}/, 'gốc plugin lõi qua CLAUDE_PLUGIN_ROOT');
  assert.match(sh, /--ag-root "\$ROOT\/plugins\/acceptance-gate" --slug a/, 'gốc plugin lõi qua --ag-root (bash)');
  assert.match(js, /--ag-root "\$\{KIT\}\/plugins\/acceptance-gate" --slug b/, 'dạng "${X}" giữ ngoặc (template literal)');
  const py = xem(f, 'don-nha/a', 'tests/plugins/kiem.py');
  assert.match(py, /TEP = root \/ 'plugins\/acceptance-gate\/scripts' \/ 'goi\.mjs'/, 'cặp phần tử Python (dấu /)');
  assert.match(py, /SK = root\/'plugins\/acceptance-gate\/skills'\/'scope-slice'\/'SKILL\.md'/, 'cặp Python có skill đổi tên');
  assert.match(xem(f, 'don-nha/a', 'plugins/acceptance-gate/scripts/goi.mjs'), /path\.join\(__dirname, '\.\.', 'skills', 'scope-slice', 'SKILL\.md'\)/, 'mã sản phẩm trỏ skill đổi tên (bước 3)');
  assert.match(js, /THU_MUC = path\.join\(KIT, 'plugins\/acceptance-gate\/commands'\)/, 'đối số đơn sau biến gốc kho');
  assert.match(js, /SKILL_CAP = path\.join\(KIT, 'plugins\/acceptance-gate\/skills', 'scope-slice', 'SKILL\.md'\)/, 'cặp phần tử skill đổi tên');
  assert.match(xem(f, 'don-nha/a', '.github/workflows/gate.yml'), /run: node plugins\/acceptance-gate\/scripts\/goi\.mjs/);
  assert.match(xem(f, 'don-nha/a', '_acceptance/config.yaml'), /goi: node plugins\/acceptance-gate\/scripts\/goi\.mjs/);
  // Hình dạng phải GIỮ.
  assert.match(sh, /show "\$BASE_SHA:scripts\/cat-luot\.mjs"/, 'dạng <mã cũ>:<đường> giữ đường cũ');
  assert.match(sh, /bc_tg_mo scripts all/, 'tên bộ trần giữ nguyên');
  assert.match(sh, /cat "\$DP\/hooks\/hooks\.json"/, 'đường mơ hồ sau biến không phải gốc kho giữ nguyên');
  assert.equal(xem(f, 'don-nha/a', 'tests/fixtures/repo/scripts/verify.sh'), 'node scripts/goi.mjs\n', 'fixtures/ không bị chạm');
  // Sổ đổi bộ kiểm.
  const so = fs.readFileSync(path.join(ra, 'doi-bo-kiem.tsv'), 'utf8');
  for (const lop of ['duong', 'mang', 'doi-so', 'cap', 'goc-plugin', 'ten', 'va']) assert.match(so, new RegExp(`^${lop}\\t`, 'm'), `sổ thiếu lớp ${lop}:\n${so}`);
});

test('BK-AC1-tat-dinh', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0); assert.equal(donNha(f, 'don-nha/b').status, 0);
  assert.equal(git(f.kho, ['rev-parse', 'don-nha/a']).trim(), git(f.kho, ['rev-parse', 'don-nha/b']).trim());
});

test('BK-AC1-do-va', () => {
  const f = moFix({ va: [{ tep: 'tests/scripts/ban-sao.test.mjs', cu: "export const VUNG = 'scripts';", moi: "export const VUNG = 'plugins/acceptance-gate/scripts';", so_lan: 2, ly_do: 'thử' }] });
  const r = donNha(f, 'don-nha/a');
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stderr, /vá không khớp: tests\/scripts\/ban-sao\.test\.mjs: export const VUNG = 'scripts';/);
  assert.equal(coRef(f.kho, 'refs/heads/don-nha/a'), false, 'nhánh đích không được tạo');
});

test('BK-AC1-do-rong', () => {
  const f = moFix();
  const bx = JSON.parse(fs.readFileSync(f.bangXep, 'utf8'));
  bx.bo_kiem = { ...bx.bo_kiem, tap: 'khong-co/' };
  bx.bo_kiem.tep_goc = [];
  fs.writeFileSync(f.bangXep, JSON.stringify(bx, null, 2));
  const r = donNha(f, 'don-nha/a');
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stderr, /luật bộ kiểm không khớp chỗ nào/);
});

// ── AC-2 — thước đảo: tệp bộ kiểm chỉ khác bản gốc ở đường và tên ─────────────────────────────────────────────────
function nhanhHong(kho, ref, tep, ten) {
  const wt = path.join(moTam('bk-wt-'), 'w');
  git(kho, ['worktree', 'add', '-q', '--detach', wt, ref]);
  try { git(kho, ['update-ref', `refs/heads/${ten}`, themCommit(wt, tep, 'hỏng')]); } finally { git(kho, ['worktree', 'remove', '--force', wt]); }
  return ten;
}
const DONG_AC2 = /^AC-2 \(B2\) đạt: (\d+)\/(\d+) tệp bộ kiểm chỉ khác bản gốc ở đường và tên · (\d+) chỗ đảo mơ hồ đã khai$/m;
const kc = (f, dich) => kiemCho({ kho: f.kho, nguon: f.nguon, dich, bangXep: f.bangXep });

test('BK-AC2', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const kq = kc(f, 'don-nha/a');
  assert.deepEqual(kq.loi, []);
  const m = kq.dong.join('\n').match(DONG_AC2);
  assert.ok(m, kq.dong.join('\n'));
  const soTepKiem = git(f.kho, ['ls-tree', '-r', '--name-only', f.nguon]).split('\n').filter(t => (t.startsWith('tests/') && !t.includes('/fixtures/') && /\.(sh|mjs|js|cjs|py|ts|yml|yaml)$/.test(t)) || t.startsWith('.github/workflows/') || t === '_acceptance/config.yaml').length;
  assert.equal(Number(m[1]), soTepKiem); assert.equal(Number(m[2]), soTepKiem); assert.equal(m[3], '0');
});

test('BK-AC2-do-tay', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const p = 'tests/scripts/ban-sao.test.mjs';
  const hong = nhanhHong(f.kho, 'don-nha/a', { [p]: git(f.kho, ['show', `don-nha/a:${p}`]).replace('assert.equal(n, 3)', 'assert.equal(n, 4)') }, 'hong-tay');
  assert.ok(kc(f, hong).loi.includes(`tệp kiểm lệch luật: ${p}`));
});

test('BK-AC2-do-lich-su', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const p = 'tests/scripts/run-tests.sh';
  const goc = git(f.kho, ['show', `don-nha/a:${p}`]);
  const kim = '"$BASE_SHA:scripts/cat-luot.mjs"';
  assert.equal(goc.split(kim).length - 1, 1, 'kim dạng lịch sử phải khớp đúng một lần');
  const hong = nhanhHong(f.kho, 'don-nha/a', { [p]: goc.replace(kim, '"$BASE_SHA:plugins/acceptance-gate/scripts/cat-luot.mjs"') }, 'hong-ls');
  assert.ok(kc(f, hong).loi.includes(`tệp kiểm lệch luật: ${p}`));
});

test('BK-AC2-do-va-nghia', () => {
  const lanh = moFix();
  assert.equal(donNha(lanh, 'don-nha/a').status, 0);
  assert.deepEqual(kc(lanh, 'don-nha/a').loi, [], 'đối chứng dương: bảng vá chỉ có mục đổi đường → xanh');
  const f = moFix({ va: [...VA_FIXTURE, { tep: 'tests/scripts/ban-sao.test.mjs', cu: 'assert.equal(n, 3)', moi: 'assert.ok(true)', so_lan: 1, ly_do: 'làm yếu ca' }] });
  assert.equal(donNha(f, 'don-nha/a').status, 0, 'kịch bản áp được mục vá — chỉ thước mới bắt');
  assert.ok(kc(f, 'don-nha/a').loi.includes('tệp kiểm lệch luật: tests/scripts/ban-sao.test.mjs'));
});

test('BK-AC2-do-mo-ho', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const bx = JSON.parse(fs.readFileSync(f.bangXep, 'utf8'));
  const tsv = path.join(moTam('bk-mh-'), 'dao-mo-ho.tsv');
  fs.writeFileSync(tsv, 'tests/scripts/ban-sao.test.mjs\tchuỗi-không-có\tthử\n');
  bx.bo_kiem = { ...bx.bo_kiem, dao_mo_ho: tsv };
  fs.writeFileSync(f.bangXep, JSON.stringify(bx, null, 2));
  assert.ok(kc(f, 'don-nha/a').loi.includes('chỗ đảo mơ hồ không còn: tests/scripts/ban-sao.test.mjs'));
});

test('BK-AC2-doc-lap', () => {
  const nhap = (chu) => [...chu.matchAll(/^import .* from ['"]([^'"]+)['"]/gm)].map(m => m[1]);
  const that = fs.readFileSync(path.join(DAY, 'kiem-cho.mjs'), 'utf8');
  assert.ok(!nhap(that).some(m => /don-nha(\.mjs)?$/.test(m)), `kiem-cho.mjs nhập kịch bản: ${nhap(that).join(', ')}`);
  const sao = "import { buoc6BoKiem } from './don-nha.mjs';\n" + that;
  assert.ok(nhap(sao).some(m => /don-nha(\.mjs)?$/.test(m)), 'đối chứng: bản sao có import phải bị bộ dò thấy');
});
