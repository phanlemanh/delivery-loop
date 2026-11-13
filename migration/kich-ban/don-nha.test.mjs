// don-nha.test.mjs — kiểm hai chiều cho kịch bản chuyển nhà (hồ sơ _acceptance/kich-ban-chuyen-nha/).
// Chạy: node --test migration/kich-ban/don-nha.test.mjs
//
// Mỗi ca dựng kho fixture riêng bằng mã (fixture.mjs) trong thư mục tạm. Ca chiều đỏ chạy BẢN SAO của kịch bản có tiêm
// đúng một kim (kim phải khớp đúng một lần trong nguồn thật trước khi tiêm), hoặc dựng một nhánh hỏng trên cây đích rồi
// cho thước đọc — và ghim đúng thông điệp. Tên ca = mã trong evals.yaml.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dungKhoFixture, themCommit, git, TEP_KIT } from './fixture.mjs';
import { kiemCho, soHaiLan, chupKho, soChup } from './kiem-cho.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KB = path.join(DAY, 'don-nha.mjs');
const tam = [];
after(() => { for (const d of tam) fs.rmSync(d, { recursive: true, force: true }); });

const moTam = (ten = 'kb-') => { const d = fs.mkdtempSync(path.join(os.tmpdir(), ten)); tam.push(d); return d; };
const moFix = (tuyChon) => dungKhoFixture(moTam(), tuyChon);
const chay = (script, args, env = {}) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', env: { ...process.env, ...env } });
const donNha = (f, nhanh, { nguon = f.nguon, env = {}, script = KB, bangXep = f.bangXep } = {}) =>
  chay(script, ['--kho', f.kho, '--nguon', nguon, '--nhanh', nhanh, '--bang-xep', bangXep, '--repo-standards', f.rs], env);
const coRef = (kho, ref) => spawnSync('git', ['-C', kho, 'rev-parse', '--verify', '-q', ref], { encoding: 'utf8' }).status === 0;
const rev = (kho, ref) => git(kho, ['rev-parse', ref]).trim();
const ngu = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

// Bản sao của thư mục migration/ (kịch bản + sổ tra soát + bảng tên) có tiêm một kim vào một tệp.
function banSaoTiem(tep, kim, thay) {
  const goc = path.join(DAY, '..');
  const dich = path.join(moTam('kb-dot-bien-'), 'migration');
  for (const d of ['kich-ban', 'tra-soat', 'chay-thu-phien']) fs.cpSync(path.join(goc, d), path.join(dich, d), { recursive: true });
  const p = path.join(dich, 'kich-ban', tep);
  const s = fs.readFileSync(p, 'utf8');
  assert.equal(s.split(kim).length - 1, 1, `kim phải khớp đúng một lần trong ${tep}: ${kim}`);
  fs.writeFileSync(p, s.replace(kim, thay));
  return path.join(dich, 'kich-ban', 'don-nha.mjs');
}

// Dựng nhánh `ten` = `ref` + một commit sửa tệp (nội dung null = xoá).
function nhanhHong(kho, ref, tep, ten) {
  const wt = path.join(moTam('kb-wt-'), 'w');
  git(kho, ['worktree', 'add', '-q', '--detach', wt, ref]);
  try {
    const sha = themCommit(wt, tep, 'hỏng');
    git(kho, ['update-ref', `refs/heads/${ten}`, sha]);
  } finally { git(kho, ['worktree', 'remove', '--force', wt]); }
  return ten;
}

const DONG_CUOI = /^don-nha: [0-9a-f]{40} → [0-9a-f]{40} cây [0-9a-f]{40}$/gm;

// ── AC-1 ──────────────────────────────────────────────────────────────────────────────────────────────────────────
test('KB-AC1', () => {
  const f = moFix();
  const a = donNha(f, 'don-nha/a'); const b = donNha(f, 'don-nha/b');
  assert.equal(a.status, 0, a.stderr); assert.equal(b.status, 0, b.stderr);
  assert.equal((a.stdout.match(DONG_CUOI) || []).length, 1, a.stdout);
  assert.equal((b.stdout.match(DONG_CUOI) || []).length, 1, b.stdout);
  assert.equal(rev(f.kho, 'don-nha/a'), rev(f.kho, 'don-nha/b'));
  assert.equal(rev(f.kho, 'don-nha/a^{tree}'), rev(f.kho, 'don-nha/b^{tree}'));
  assert.equal(soHaiLan(f.kho, 'don-nha/a', 'don-nha/b'), null);
});

test('KB-AC1-do', () => {
  const f = moFix();
  const script = banSaoTiem('don-nha.mjs', 'GIT_COMMITTER_DATE: ngayNguon', 'GIT_COMMITTER_DATE: new Date().toISOString()');
  assert.equal(donNha(f, 'don-nha/a', { script }).status, 0);
  ngu(1100);
  assert.equal(donNha(f, 'don-nha/b', { script }).status, 0);
  assert.equal(soHaiLan(f.kho, 'don-nha/a', 'don-nha/b'), 'hai lần chạy khác mã commit');
});

// ── AC-2 ──────────────────────────────────────────────────────────────────────────────────────────────────────────
test('KB-AC2', () => {
  const f = moFix();
  const truoc = chupKho(f.kho);
  const r = donNha(f, 'don-nha/3.0');
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(soChup(truoc, chupKho(f.kho), 'don-nha/3.0'), []);
  const tieuDe = git(f.kho, ['log', '--reverse', '--format=%s', `${f.nguon}..don-nha/3.0`]).trim().split('\n');
  assert.equal(tieuDe.length, 5, tieuDe.join('\n'));
  tieuDe.forEach((t, i) => assert.match(t, new RegExp(`^dọn nhà ${i + 1}/5: `)));
  assert.equal(rev(f.kho, 'don-nha/3.0~5'), f.nguon);
});

test('KB-AC2-do', () => {
  const f = moFix();
  const script = banSaoTiem('don-nha.mjs', 'const REF_DICH = `refs/heads/${nhanh}`;', "const REF_DICH = 'refs/heads/chuyen-nha';");
  const truoc = chupKho(f.kho);
  donNha(f, 'don-nha/3.0', { script });
  assert.ok(soChup(truoc, chupKho(f.kho), 'don-nha/3.0').includes('ref không phải đích bị đổi: refs/heads/chuyen-nha'));
});

test('KB-AC2-nguon-moi', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/3.0').status, 0);
  const s2 = themCommit(f.kho, { 'dieu-phoi/scripts/moi.mjs': '// moi.mjs\n' }, 'nguồn đi thêm');
  const wtTruoc = git(f.kho, ['worktree', 'list', '--porcelain']);
  const r = donNha(f, 'don-nha/3.0', { nguon: s2 });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(rev(f.kho, 'don-nha/3.0~5'), s2);
  assert.ok(git(f.kho, ['ls-tree', '-r', '--name-only', 'don-nha/3.0']).split('\n').includes('plugins/dispatch/scripts/moi.mjs'));
  assert.equal(git(f.kho, ['worktree', 'list', '--porcelain']), wtTruoc);
});

// ── AC-3 ──────────────────────────────────────────────────────────────────────────────────────────────────────────
const SAN_PHAM_FIXTURE = Object.keys(TEP_KIT).filter(t => /^(skills|scripts|commands|dieu-phoi|\.claude-plugin)\//.test(t));

test('KB-AC3', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const n = SAN_PHAM_FIXTURE.length;
  const kq = kiemCho({ kho: f.kho, nguon: f.nguon, dich: 'don-nha/a', bangXep: f.bangXep });
  assert.deepEqual(kq.loi, []);
  assert.ok(kq.dong.includes(`AC-3 đạt: ${n}/${n} tệp sản phẩm có đúng một chỗ · bỏ: 0`), kq.dong.join('\n'));
});

test('KB-AC3-do-mat', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const hong = nhanhHong(f.kho, 'don-nha/a', { 'plugins/dispatch/scripts/dieu-phoi.mjs': null }, 'hong-mat');
  const kq = kiemCho({ kho: f.kho, nguon: f.nguon, dich: hong, bangXep: f.bangXep });
  assert.ok(kq.loi.includes('tệp sản phẩm không có chỗ: dieu-phoi/scripts/dieu-phoi.mjs'), kq.loi.join('\n'));
});

test('KB-AC3-do-hai', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const hong = nhanhHong(f.kho, 'don-nha/a', { 'scripts/cat-luot.mjs': TEP_KIT['scripts/cat-luot.mjs'] }, 'hong-hai');
  const kq = kiemCho({ kho: f.kho, nguon: f.nguon, dich: hong, bangXep: f.bangXep });
  assert.ok(kq.loi.includes('tệp sản phẩm hai chỗ: scripts/cat-luot.mjs'), kq.loi.join('\n'));
});

// ── AC-5 ──────────────────────────────────────────────────────────────────────────────────────────────────────────
test('KB-AC5', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const cho = JSON.parse(git(f.kho, ['show', 'don-nha/a:.claude-plugin/marketplace.json']));
  assert.equal(cho.name, 'delivery-loop');
  assert.deepEqual(cho.plugins.map(p => [p.name, p.source]), [['acceptance-gate', './plugins/acceptance-gate'], ['dispatch', './plugins/dispatch']]);
  for (const p of cho.plugins) assert.equal(JSON.parse(git(f.kho, ['show', `don-nha/a:${p.source.slice(2)}/.claude-plugin/plugin.json`])).name, p.name);
  const kq = kiemCho({ kho: f.kho, nguon: f.nguon, dich: 'don-nha/a', bangXep: f.bangXep });
  assert.ok(kq.dong.includes('AC-5 đạt: chợ delivery-loop, 2 plugin (acceptance-gate, dispatch)'), kq.dong.join('\n'));
});

test('KB-AC5-do', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const cho = JSON.parse(git(f.kho, ['show', 'don-nha/a:.claude-plugin/marketplace.json']));
  cho.plugins[1].source = './plugins/khong-co';
  const hong = nhanhHong(f.kho, 'don-nha/a', { '.claude-plugin/marketplace.json': JSON.stringify(cho, null, 2) + '\n' }, 'hong-cho');
  const kq = kiemCho({ kho: f.kho, nguon: f.nguon, dich: hong, bangXep: f.bangXep });
  assert.ok(kq.loi.includes('nguồn plugin không có: dispatch'), kq.loi.join('\n'));
});

// ── AC-9 ──────────────────────────────────────────────────────────────────────────────────────────────────────────
test('KB-AC9-lanh', () => {
  const f = moFix();
  const r = donNha(f, 'don-nha/3.0');
  assert.equal(r.status, 0, r.stderr);
  assert.ok(coRef(f.kho, 'refs/heads/don-nha/3.0'));
});

test('KB-AC9-thu-muc', () => {
  const f = moFix({ themThuMucGoc: 'la' });
  const r = donNha(f, 'don-nha/3.0');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /thư mục gốc chưa xếp: la/);
  assert.ok(!coRef(f.kho, 'refs/heads/don-nha/3.0'));
});

// ── AC-4 ──────────────────────────────────────────────────────────────────────────────────────────────────────────
// Ma trận VIẾT TRƯỚC, không rút từ bảng xếp: năm chuỗi phải đổi, năm chuỗi phải giữ nguyên byte.
const PHAI_DOI = [
  ['/dieu-phoi:mo-dot', '/dispatch:open'],
  ['dieu-phoi@acceptance-gate-kit', 'dispatch@delivery-loop'],
  ['--plugin dieu-phoi', '--plugin dispatch'],
  ['acceptance-gate:cat-luot', 'acceptance-gate:scope-slice'],
  ['name: cat-luot', 'name: scope-slice'],
];
const PHAI_GIU = ['scripts/cat-luot.mjs', 'lo-trinh-cat-luot', 'dieu-phoi.mjs', 'acceptance-gate-kit-tri-thuc', 'skill `cat-luot`'];

// Gộp chữ của mọi tệp dưới plugins/ + tài liệu đã khai (cây mới) / mọi tệp sản phẩm + tài liệu (nguồn).
function chuCua(kho, ref, loc) {
  return git(kho, ['ls-tree', '-r', '--name-only', ref]).split('\n').filter(Boolean).filter(loc)
    .map(t => git(kho, ['show', `${ref}:${t}`])).join('\n');
}
const TAI_LIEU = new Set(['README.md', 'GUIDE.md', 'QUICKSTART.md', '.claude/settings.json']);
const dem = (s, x) => s.split(x).length - 1;
function kiemMaTran(f, dich) {
  const loi = [];
  const cu = chuCua(f.kho, f.nguon, t => /^(skills|scripts|commands|dieu-phoi)\//.test(t) || TAI_LIEU.has(t));
  const moi = chuCua(f.kho, dich, t => t.startsWith('plugins/') || TAI_LIEU.has(t));
  for (const [a, b] of PHAI_DOI) {
    if (!dem(cu, a)) loi.push(`fixture thiếu chuỗi phải đổi: ${a}`);
    if (dem(moi, a)) loi.push(`chuỗi phải đổi còn nguyên: ${a}`);
    if (dem(moi, b) < dem(cu, a)) loi.push(`chuỗi phải đổi chưa tới đích: ${a} → ${b}`);
  }
  for (const x of PHAI_GIU) {
    if (!dem(cu, x)) loi.push(`fixture thiếu chuỗi phải giữ: ${x}`);
    if (dem(moi, x) !== dem(cu, x)) loi.push(`chuỗi phải giữ bị đổi: ${x}`);
  }
  return { loi, dat: PHAI_DOI.length + PHAI_GIU.length - new Set(loi.map(l => l.split(': ').slice(1).join(': '))).size };
}

test('KB-AC4', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const kq = kiemCho({ kho: f.kho, nguon: f.nguon, dich: 'don-nha/a', bangXep: f.bangXep });
  assert.deepEqual(kq.loi, []);
  assert.ok(kq.dong.some(d => /^AC-4 đạt: \d+ tệp đúng luật, \d+ tệp không phải sản phẩm giữ nguyên$/.test(d)), kq.dong.join('\n'));
});

test('KB-AC4-ma-tran', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const { loi, dat } = kiemMaTran(f, 'don-nha/a');
  assert.deepEqual(loi, []);
  assert.equal(`${dat}/10`, '10/10');
});

test('KB-AC4-do', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const p = 'plugins/acceptance-gate/scripts/cat-luot.mjs';
  const hong = nhanhHong(f.kho, 'don-nha/a', { [p]: git(f.kho, ['show', `don-nha/a:${p}`]) + '// sửa tay\n' }, 'hong-luat');
  const kq = kiemCho({ kho: f.kho, nguon: f.nguon, dich: hong, bangXep: f.bangXep });
  assert.ok(kq.loi.includes(`nội dung lệch luật: ${p}`), kq.loi.join('\n'));
});

test('KB-AC4-do-neo', () => {
  const f = moFix();
  const bx = JSON.parse(fs.readFileSync(f.bangXep, 'utf8'));
  assert.equal(bx.luat_cho.mau, 'acceptance-gate-kit(?![\\w-])');
  bx.luat_cho.mau = 'acceptance-gate-kit';
  const bangXep = path.join(path.dirname(f.bangXep), 'bang-xep-mat-neo.json');
  fs.writeFileSync(bangXep, JSON.stringify(bx));
  assert.equal(donNha(f, 'don-nha/a', { bangXep }).status, 0);
  assert.ok(kiemMaTran(f, 'don-nha/a').loi.includes('chuỗi phải giữ bị đổi: acceptance-gate-kit-tri-thuc'));
});

test('KB-AC4-doc-lap', () => {
  const s = fs.readFileSync(path.join(DAY, 'kiem-cho.mjs'), 'utf8');
  const nhap = [...s.matchAll(/^\s*import\b[^;]*?from\s+['"]([^'"]+)['"]/gm)].map(m => m[1]);
  assert.ok(nhap.length > 0);
  assert.ok(!nhap.some(x => /don-nha(\.mjs)?$/.test(x)), nhap.join(', '));
  assert.ok(!/import\(\s*['"][^'"]*don-nha/.test(s));
});

test('KB-AC9-luat', () => {
  const f = moFix();
  const bangTen = { ...JSON.parse(fs.readFileSync(f.bangTenTep, 'utf8')) };
  bangTen.lenh = { ...bangTen.lenh, 'dieu-phoi:khong-co': 'dispatch:none' };
  fs.writeFileSync(f.bangTenTep, JSON.stringify(bangTen));
  const r = donNha(f, 'don-nha/3.0');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /luật không khớp chỗ nào: dieu-phoi:khong-co/);
  assert.ok(!coRef(f.kho, 'refs/heads/don-nha/3.0'));
});

// ── AC-7 ──────────────────────────────────────────────────────────────────────────────────────────────────────────
test('KB-AC7', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const skill = git(f.kho, ['show', 'don-nha/a:plugins/acceptance-gate/skills/scope-slice/SKILL.md']);
  assert.ok(skill.includes(`https://github.com/phanlemanh/acceptance-gate-kit/blob/${f.nguon}/docs/reference/ghi-chu.md`), skill);
  assert.ok(!skill.includes('ở docs/reference/ghi-chu.md'), skill);
  assert.ok(git(f.kho, ['show', 'don-nha/a:plugins/acceptance-gate/commands/acceptance-init.md']).includes('`node tests/a.test.mjs`'));
  assert.ok(git(f.kho, ['show', 'don-nha/a:plugins/dispatch/commands/open.md']).includes('Ca kiểm ở tests/a.test.mjs.'));
  const goi = git(f.kho, ['show', 'don-nha/a:plugins/acceptance-gate/scripts/goi.mjs']);
  assert.ok(goi.includes(`// bối cảnh: https://github.com/phanlemanh/acceptance-gate-kit/blob/${f.nguon}/docs/reference/ghi-chu.md`), goi);
  assert.ok(goi.includes("export const GHI_CHU = 'docs/reference/ghi-chu.md';"), goi);
  const kq = kiemCho({ kho: f.kho, nguon: f.nguon, dich: 'don-nha/a', bangXep: f.bangXep });
  assert.deepEqual(kq.loi, []);
  assert.ok(kq.dong.includes('AC-7 đạt: 2 con trỏ đã đổi, 2 giữ có lý do (lenh 1 · tu-host 1 · du-lieu 0 · duong-kho-tieu-thu 0), 0 còn treo trong plugins/'), kq.dong.join('\n'));
});

test('KB-AC7-do', () => {
  const f = moFix();
  const script = banSaoTiem('don-nha.mjs', 'buoc4ConTro(wt, bx, S, dichPlugin);', '/* bước 4 bị gỡ */');
  assert.equal(donNha(f, 'don-nha/a', { script }).status, 0);
  const kq = kiemCho({ kho: f.kho, nguon: f.nguon, dich: 'don-nha/a', bangXep: f.bangXep });
  assert.ok(kq.loi.includes('con trỏ còn treo: plugins/acceptance-gate/skills/scope-slice/SKILL.md → docs/reference/ghi-chu.md'), kq.loi.join('\n'));
});

// ── AC-1 qua hai ngày, AC-8, AC-9c — khuôn Repo Standards ─────────────────────────────────────────────────────────
test('KB-AC1-ngay', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a', { env: { RS_GIA_NGAY: '2026-01-01' } }).status, 0);
  assert.equal(donNha(f, 'don-nha/b', { env: { RS_GIA_NGAY: '2026-06-30' } }).status, 0);
  assert.equal(soHaiLan(f.kho, 'don-nha/a', 'don-nha/b'), null);
});

test('KB-AC1-do-ngay', () => {
  const f = moFix();
  const script = banSaoTiem('don-nha.mjs', "'--var', `today=${ngayNguon.slice(0, 10)}`, ", '');
  assert.equal(donNha(f, 'don-nha/a', { script, env: { RS_GIA_NGAY: '2026-01-01' } }).status, 0);
  assert.equal(donNha(f, 'don-nha/b', { script, env: { RS_GIA_NGAY: '2026-06-30' } }).status, 0);
  assert.equal(soHaiLan(f.kho, 'don-nha/a', 'don-nha/b'), 'hai lần chạy khác mã cây');
});

test('KB-AC8-danh-sach', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const bx = JSON.parse(fs.readFileSync(f.bangXep, 'utf8'));
  const dong = git(f.kho, ['diff', '--name-status', 'don-nha/a~1', 'don-nha/a']).trim().split('\n').map(d => d.split('\t'));
  assert.ok(dong.length > 0);
  for (const [loai, tep] of dong) {
    const duoc = loai === 'A' ? bx.khuon.duoc_cham.them : loai === 'M' ? bx.khuon.duoc_cham.sua : bx.khuon.duoc_cham.xoa;
    assert.ok(duoc.includes(tep), `${loai} ${tep}`);
  }
  const cay = git(f.kho, ['ls-tree', '-r', '--name-only', 'don-nha/a']).split('\n');
  assert.ok(!cay.some(t => t.startsWith('.claude/skills/review-change/')));
  const mk = git(f.kho, ['show', 'don-nha/a:Makefile']);
  assert.ok(mk.includes(`test: ## Run the tests\n\t${bx.khuon.make_test}\n`), mk);
  const rsj = JSON.parse(git(f.kho, ['show', 'don-nha/a:.repo-setup.json']));
  assert.equal(rsj.vars.today, '2026-11-01');
});

test('KB-AC8-do', () => {
  const f = moFix();
  themCommit(f.rs, { 'plugins/repo-setup/README.md': 'đi tiếp\n' }, 'sau thẻ');
  const r = donNha(f, 'don-nha/3.0');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /khuôn không đúng thẻ repo-setup-v0\.5\.0/);
  assert.ok(!coRef(f.kho, 'refs/heads/don-nha/3.0'));
});

test('KB-AC8-do-cham', () => {
  const f = moFix();
  const r = donNha(f, 'don-nha/3.0', { env: { RS_GIA_CHAM: 'CLAUDE.md' } });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /khuôn chạm tệp ngoài danh sách: CLAUDE\.md/);
  assert.ok(!coRef(f.kho, 'refs/heads/don-nha/3.0'));
});

test('KB-AC9-khuon', () => {
  const f = moFix();
  const r = donNha(f, 'don-nha/3.0', { env: { RS_GIA_XUNG_DOT: 'GUIDE.md' } });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /khuôn xung đột: GUIDE\.md/);
  assert.ok(!coRef(f.kho, 'refs/heads/don-nha/3.0'));
  assert.equal(donNha(f, 'don-nha/3.0').status, 0);
  const truoc = rev(f.kho, 'don-nha/3.0');
  assert.equal(donNha(f, 'don-nha/3.0', { env: { RS_GIA_XUNG_DOT: 'GUIDE.md' } }).status, 1);
  assert.equal(rev(f.kho, 'don-nha/3.0'), truoc);
  assert.deepEqual(git(f.kho, ['worktree', 'list', '--porcelain']).match(/^worktree /gm).length, 1);
});

test('KB-AC4-ten-tu-khai', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const khung = git(f.kho, ['show', 'don-nha/a:plugins/dispatch/hooks/mod/khung.ts']);
  assert.ok(khung.includes("atom({ plugin: 'dispatch', key: 'khung' }"), khung);
  assert.ok(khung.includes("['.claude', 'dieu-phoi', 'may']"), khung);
  assert.ok(git(f.kho, ['show', 'don-nha/a:plugins/dispatch/types/index.d.ts']).includes("'dispatch': { khung: K }"));
  assert.deepEqual(kiemCho({ kho: f.kho, nguon: f.nguon, dich: 'don-nha/a', bangXep: f.bangXep }).loi, []);
});

// ── AC-10 — phép chia lớp (phan-lop.py) và phép đối chiếu báo cáo (lop-do.mjs) trên nhật ký giả ──────────────────
import { kiemSoLieu } from './lop-do.mjs';

function nhatKyGia() {
  const T = moTam('kb-lop-do-');
  const ghi = (ban, bo, chu) => { fs.mkdirSync(path.join(T, 'out', ban), { recursive: true }); fs.writeFileSync(path.join(T, 'out', ban, bo + '.log'), chu); };
  const rc = (ban, m) => fs.writeFileSync(path.join(T, 'out', ban, 'ketqua.tsv'), Object.entries(m).map(([b, r]) => `${b}\t${r}\t1`).join('\n') + '\nXONG\n');
  ghi('A', 'scripts', 'PASS: X0\nFAIL: X1 — chập chờn\n');
  ghi('B', 'scripts', 'FAIL: X1 — chập chờn\nFAIL: X2 — đọc tệp\n  Error: Cannot find module \'/kho/scripts/a.mjs\'\nFAIL: X3 — bản cũ\n  fatal: not a valid object name v2.24.0\nFAIL: X4 — chợ\n  không thấy plugin acceptance-gate-kit\nFAIL: X5 — lạ\n  sai số 3\n--- khối Y ---\n  bash: /x/y.sh: No such file or directory\nPASS: Y0\nFAIL: Y1 — theo sau\n');
  ghi('A', 'ban-do', 'PRODUCT-MAP.md khớp hồ sơ xưởng.\n');
  ghi('B', 'ban-do', 'node: không chạy được\n');
  rc('A', { scripts: 1, 'ban-do': 0 }); rc('B', { scripts: 1, 'ban-do': 1 });
  return T;
}
const S40 = 'a'.repeat(40), C40 = 'b'.repeat(40);
const chayPhanLop = (T) => spawnSync('python3', [path.join(DAY, 'phan-lop.py'), T, S40, C40], { encoding: 'utf8' });

test('KB-AC10-phan-lop', () => {
  const r = chayPhanLop(nhatKyGia());
  assert.equal(r.status, 0, r.stderr);
  const { loi, so } = kiemSoLieu(r.stdout);
  assert.deepEqual(loi, []);
  assert.deepEqual(so.bo.scripts.lop, { 'duong-dan': 1, 'lich-su': 1, 'ten-doi': 1, khac: 1, 'cung-tep': 1 });
  assert.equal(so.bo.scripts.do_ca_hai, 1);
  assert.equal(so.bo['ban-do'].lop['bo-chay'], 1);
  assert.equal(so.tong_do_them, 6);
  assert.match(r.stdout, /\| scripts \| 1 \| 1 \| 1 \| 6 \| 1 \| 5 \| 0 \|/);
});

test('KB-AC10-do-so-hoc', () => {
  const chu = chayPhanLop(nhatKyGia()).stdout;
  const hong = chu.replace('| scripts | 1 | 1 | 1 | 6 | 1 | 5 | 0 |', '| scripts | 1 | 1 | 1 | 6 | 1 | 4 | 0 |');
  assert.notEqual(hong, chu);
  assert.ok(kiemSoLieu(hong).loi.includes('bảng chữ lệch khối số liệu ở bộ scripts'));
  const hong2 = chu.replace('"tong_do_them": 6', '"tong_do_them": 7');
  assert.notEqual(hong2, chu);
  assert.ok(kiemSoLieu(hong2).loi.some(l => l.startsWith('tổng đỏ thêm lệch')));
});
