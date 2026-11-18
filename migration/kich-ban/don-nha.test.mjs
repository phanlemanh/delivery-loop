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
  assert.equal(tieuDe.length, 6, tieuDe.join('\n'));
  tieuDe.forEach((t, i) => assert.match(t, new RegExp(`^dọn nhà ${i + 1}/6: `)));
  assert.equal(rev(f.kho, 'don-nha/3.0~6'), f.nguon);
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
  assert.equal(rev(f.kho, 'don-nha/3.0~6'), s2);
  assert.ok(git(f.kho, ['ls-tree', '-r', '--name-only', 'don-nha/3.0']).split('\n').includes('plugins/dispatch/scripts/moi.mjs'));
  assert.equal(git(f.kho, ['worktree', 'list', '--porcelain']), wtTruoc);
});

// ── AC-3 ──────────────────────────────────────────────────────────────────────────────────────────────────────────
const SAN_PHAM_FIXTURE = Object.keys(TEP_KIT).filter(t => /^(skills|scripts|commands|hooks|dieu-phoi|\.claude-plugin)\//.test(t));

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
  // Nhánh đã có từ một lần lành trên nguồn cũ: lượt đỏ không được đè nó.
  const g = moFix();
  assert.equal(donNha(g, 'don-nha/3.0').status, 0);
  const truoc = rev(g.kho, 'don-nha/3.0');
  const s2 = themCommit(g.kho, { 'la/x.md': 'lạ\n' }, 'thư mục lạ');
  const r2 = donNha(g, 'don-nha/3.0', { nguon: s2 });
  assert.equal(r2.status, 1);
  assert.match(r2.stderr, /thư mục gốc chưa xếp: la/);
  assert.equal(rev(g.kho, 'don-nha/3.0'), truoc);
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
  // Nhánh đã có từ một lần lành: lượt đỏ không được đè nó.
  fs.writeFileSync(f.bangTenTep, JSON.stringify(JSON.parse(fs.readFileSync(f.bangTenTep, 'utf8')), null, 2).replace(/,\s*"dieu-phoi:khong-co": "dispatch:none"/, ''));
  assert.equal(donNha(f, 'don-nha/3.0').status, 0);
  const truoc = rev(f.kho, 'don-nha/3.0');
  fs.writeFileSync(f.bangTenTep, JSON.stringify(bangTen));
  assert.equal(donNha(f, 'don-nha/3.0').status, 1);
  assert.equal(rev(f.kho, 'don-nha/3.0'), truoc);
});

// ── AC-7 ──────────────────────────────────────────────────────────────────────────────────────────────────────────
test('KB-AC7', () => {
  const f = moFix();
  assert.equal(donNha(f, 'don-nha/a').status, 0);
  const skill = git(f.kho, ['show', 'don-nha/a:plugins/acceptance-gate/skills/scope-slice/SKILL.md']);
  assert.ok(skill.includes(`https://github.com/phanlemanh/acceptance-gate-kit/blob/${f.nguon}/docs/reference/ghi-chu.md`), skill);
  assert.ok(!skill.includes('ở docs/reference/ghi-chu.md'), skill);
  assert.ok(skill.includes(`[ghi chú](https://github.com/phanlemanh/acceptance-gate-kit/blob/${f.nguon}/docs/reference/ghi-chu.md)`), skill);
  assert.ok(!/[\w./-]https:\/\//.test(skill), skill);
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
  const dong = git(f.kho, ['diff', '--name-status', 'don-nha/a~2', 'don-nha/a~1']).trim().split('\n').map(d => d.split('\t'));
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
import { moTamCho, dungCay as dungCayBK, chayCay as chayCayBK } from './fixture-bo-kiem.mjs';
const moTamBK = moTamCho(tam);

// Thư mục đo của B1 dựng lại trên bên viết thật (B2: báo cáo đọc túi khoá — hồ sơ bo-kiem-xanh-o-kho-moi AC-5). Cây mới:
// một ca biến mất (X0 — không chạy tới), bốn ca đỏ có dấu hiệu đường dẫn · lịch sử · tên cũ · lạ, một ca đỏ ở cả hai cây
// (X1), một khối có lỗi đường dẫn mà ca của nó không tự in lỗi (Y1 — cùng tệp), bước bản đồ chết.
function nhatKyGia() {
  const T = moTam('kb-lop-do-');
  fs.mkdirSync(path.join(T, 'out'));
  const cu = { ka: [['PASS', 'X0'], ['FAIL', 'X1 — chập chờn'], ['PASS', 'X2'], ['PASS', 'X3'], ['PASS', 'X4'], ['PASS', 'X4b'], ['PASS', 'X5'], ['PASS', 'Y0'], ['PASS', 'Y1']] };
  // Dòng lỗi đứng SAU dòng đỏ, như fixture gốc của B1 (bộ phân lớp đọc phần sau trước — giới hạn B1 đã khai).
  const moi = { banDo: 1, ka: [['FAIL', 'X1 — chập chờn'],
    ['FAIL', 'X2 — đọc tệp'], [null, "  Error: Cannot find module '/kho/scripts/a.mjs'"],
    ['FAIL', 'X3 — bản cũ'], [null, '  fatal: not a valid object name v2.24.0'],
    ['FAIL', 'X4 — chợ'], [null, '  không thấy plugin acceptance-gate-kit'], ['PASS', 'X4b'],
    ['FAIL', 'X5 — lạ'], [null, '  sai số 3'],
    [null, '--- khối Y ---'], [null, '  bash: /x/y.sh: No such file or directory'], ['PASS', 'Y0'], ['FAIL', 'Y1 — theo sau']] };
  fs.cpSync(chayCayBK(moTamBK, dungCayBK(moTamBK, cu)), path.join(T, 'out', 'A'), { recursive: true });
  fs.cpSync(chayCayBK(moTamBK, dungCayBK(moTamBK, moi)), path.join(T, 'out', 'B'), { recursive: true });
  return T;
}
const S40 = 'a'.repeat(40), C40 = 'b'.repeat(40);
const chayPhanLop = (T) => spawnSync('python3', [path.join(DAY, 'phan-lop.py'), T, S40, C40], { encoding: 'utf8' });

test('KB-AC10-phan-lop', () => {
  const r = chayPhanLop(nhatKyGia());
  assert.equal(r.status, 0, r.stderr);
  const { loi, so } = kiemSoLieu(r.stdout);
  assert.deepEqual(loi, []);
  assert.deepEqual(so.bo.ka.lop, { 'khong-chay-toi': 1, 'duong-dan': 1, 'lich-su': 1, 'ten-doi': 1, khac: 1, 'cung-tep': 1 });
  assert.equal(so.bo.ka.do_ca_hai, 1);
  assert.equal(so.bo['ban-do'].lop['bo-chay'], 1);
  assert.equal(so.tong_do_them, 7);
  assert.match(r.stdout, /\| ka \| 1 \| 1 \| 8 \| 2 \| 1 \| 6 \|/);
});

test('KB-AC10-do-so-hoc', () => {
  const chu = chayPhanLop(nhatKyGia()).stdout;
  const hong = chu.replace('| ka | 1 | 1 | 8 | 2 | 1 | 6 |', '| ka | 1 | 1 | 8 | 2 | 1 | 5 |');
  assert.notEqual(hong, chu);
  assert.ok(kiemSoLieu(hong).loi.includes('bảng chữ lệch khối số liệu ở bộ ka'));
  const hong2 = chu.replace('"tong_do_them": 7', '"tong_do_them": 8');
  assert.notEqual(hong2, chu);
  assert.ok(kiemSoLieu(hong2).loi.some(l => l.startsWith('tổng đỏ thêm lệch')));
});

test('KB-AC7-do-tuong-doi', () => {
  const f = moFix();
  const script = banSaoTiem('don-nha.mjs', "if (tien && path.posix.normalize(path.posix.join(path.posix.dirname(tu), m)) !== toi) return m;", '');
  const s2 = fs.readFileSync(script, 'utf8').replace("`(?<![\\\\w.\\\\/-])((?:\\\\.{1,2}\\\\/)*)${esc(toi)}(?![\\\\w-]|\\\\/[\\\\w-])`", "`(?<![\\\\w.-])(?<!\\\\w\\\\/)()(?:\\\\.\\\\/)?${esc(toi)}(?![\\\\w/-])`");
  assert.notEqual(s2, fs.readFileSync(script, 'utf8'), 'kim regex cũ phải khớp');
  fs.writeFileSync(script, s2);
  assert.equal(donNha(f, 'don-nha/a', { script }).status, 0);
  const kq = kiemCho({ kho: f.kho, nguon: f.nguon, dich: 'don-nha/a', bangXep: f.bangXep });
  assert.ok(kq.loi.includes('con trỏ hỏng: plugins/acceptance-gate/skills/scope-slice/SKILL.md'), kq.loi.join('\n'));
});

import { kiemLopDo } from './lop-do.mjs';
test('KB-AC10-do-cay', () => {
  const f = moFix();
  const dung = (n, nguon) => donNha(f, n, { nguon }).status === 0;
  assert.ok(dung('don-nha/thu', f.nguon));
  const cay = rev(f.kho, 'don-nha/thu^{tree}');
  const T = nhatKyGia();
  const baoCao = (nguon, cayMoi) => {
    const r = spawnSync('python3', [path.join(DAY, 'phan-lop.py'), T, nguon, cayMoi], { encoding: 'utf8' });
    const p = path.join(T, `lop-do-${nguon.slice(0, 6)}-${cayMoi.slice(0, 6)}.md`); fs.writeFileSync(p, r.stdout); return p;
  };
  const chay1 = (tep) => { const loi = [], dong = []; kiemLopDo({ kho: f.kho, S: f.nguon, ra: (x) => dong.push(x), loi, donNha: dung, nhanh: 'don-nha/thu', tep }); return { loi, dong }; };
  const lanh = chay1(baoCao(f.nguon, cay));
  assert.deepEqual(lanh.loi, []);
  assert.ok(lanh.dong.some(d => d.startsWith('AC-10 đạt')), lanh.dong.join('\n'));
  assert.ok(chay1(baoCao(f.nguon, 'c'.repeat(40))).loi.includes('báo cáo lớp đỏ đo trên cây cũ'));
  const s2 = themCommit(f.kho, { 'scripts/moi.mjs': '// mới\n' }, 'nguồn đi thêm');
  const cu = chay1(baoCao(f.nguon, cay));
  const r = { loi: [], dong: [] }; kiemLopDo({ kho: f.kho, S: s2, ra: (x) => r.dong.push(x), loi: r.loi, donNha: dung, nhanh: 'don-nha/thu', tep: baoCao(f.nguon, cay) });
  assert.ok(r.loi.includes('báo cáo lớp đỏ đo trên cây cũ'), r.loi.join('\n'));
  assert.ok(r.dong.some(d => d.startsWith('báo cáo đo trên ')), r.dong.join('\n'));
  assert.deepEqual(cu.loi, []);
});

test('KB-AC7-do-bo-tuong-doi', () => {
  const f = moFix();
  const script = banSaoTiem('don-nha.mjs', "if (tien && path.posix.normalize(path.posix.join(path.posix.dirname(tu), m)) !== toi) return m;", 'if (tien) return m;');
  assert.equal(donNha(f, 'don-nha/a', { script }).status, 0);
  const skill = git(f.kho, ['show', 'don-nha/a:plugins/acceptance-gate/skills/scope-slice/SKILL.md']);
  assert.ok(skill.includes('](../../docs/reference/ghi-chu.md)'), skill);
  const kq = kiemCho({ kho: f.kho, nguon: f.nguon, dich: 'don-nha/a', bangXep: f.bangXep });
  assert.ok(kq.loi.includes('con trỏ còn treo: plugins/acceptance-gate/skills/scope-slice/SKILL.md → docs/reference/ghi-chu.md'), kq.loi.join('\n'));
});

// ── AC-7 ma trận con trỏ tương đối (viết TRƯỚC khi chạy — luật dừng-vá sau lượt chấm 2, «hình dạng 5») ──────────────
// Hàng = dạng con trỏ trong một tệp sản phẩm; cột = cách phép đổi hỏng (không đổi · đổi nửa chừng · giải sai thư mục ·
// đổi quá tay · bỏ lượt ngoài sổ · đổi cả tên trần ngoài sổ). Mỗi ô một kho fixture riêng; ô mong đợi một trong ba kết
// cục: xanh (thước im — đột biến không chạm dạng này), dừng (kịch bản tự dừng, ghim thông điệp), đỏ (thước ghim thông điệp).
const SK = 'plugins/acceptance-gate/skills/ma-tran/SKILL.md', CM = 'plugins/acceptance-gate/commands/ma-tran.md', MJ = 'plugins/acceptance-gate/scripts/ma-tran.mjs';
const skill = (than) => ({ 'skills/ma-tran/SKILL.md': `---\nname: ma-tran\ndescription: Ma trận.\n---\n\n${than}\n` });
const DANG = {
  tran: skill('Xem docs/reference/m1.md.'),
  'lien-ket-sau-2': skill('Xem [m2](../../docs/reference/m2.md).'),
  'chu-sau-2': skill('Xem ../../docs/reference/m2.md ở trên.'),
  'lien-ket-sau-1': { 'commands/ma-tran.md': 'Lệnh.\n\nXem [m3](../docs/reference/m3.md).\n' },
  'chu-thich-ma': { 'scripts/ma-tran.mjs': '// xem ../docs/reference/m4.md\nexport const m = 1;\n' },
  'cham-gach': skill('Xem [m5](./../../docs/reference/m5.md).'),
  'ten-tran-goc': skill('Xem [hướng dẫn](../../README.md#muc) và README.md.'),
  'du-lieu-ma': { 'scripts/ma-tran.mjs': "export const P = '../docs/reference/m4.md';\n" },
  'thu-muc': skill('Xem [thư mục](../../docs/reference/).'),
  bay: skill('Xem docs/reference/m1.md; bẫy [x](../docs/reference/m1.md).'),
};
const TAI_LIEU_MT = Object.fromEntries([1, 2, 3, 4, 5].map(i => [`docs/reference/m${i}.md`, `m${i}\n`]));
const K_GIAI = 'if (tien && path.posix.normalize(path.posix.join(path.posix.dirname(tu), m)) !== toi) return m;';
const DOT_BIEN = {
  'bo-tuong-doi': [[K_GIAI, 'if (tien) return m;']],
  'nua-chung': [["`(?<![\\\\w.\\\\/-])((?:\\\\.{1,2}\\\\/)*)${esc(toi)}(?![\\\\w-]|\\\\/[\\\\w-])`", "`(?<![\\\\w.-])(?<!\\\\w\\\\/)()(?:\\\\.\\\\/)?${esc(toi)}(?![\\\\w/-])`"]],
  'sai-thu-muc': [['path.posix.dirname(tu), m)) !== toi', 'path.posix.dirname(d), m)) !== toi']],
  'qua-tay': [[K_GIAI, '']],
  'bo-ngoai-so': [['const ngoaiSo = conTroNgoaiSo(wt, S, kk, theoTep);', 'const ngoaiSo = new Map();']],
  'tran-ngoai-so': [['if (chiTuongDoi && !tien) return m; // tên trần của con trỏ ngoài sổ vẫn mơ hồ', '']],
};
const dung = (d, toi) => ({ dung: `con trỏ không tìm thấy: ${d} → ${toi}` });
const XANH = { xanh: true }; const hong = (d) => ({ do: [`con trỏ hỏng: ${d}`] });
const treo = (d, toi) => ({ do: [`con trỏ còn treo: ${d} → ${toi}`, `nội dung lệch luật: ${d}`] });
const lech = (d) => ({ do: [`nội dung lệch luật: ${d}`] });
const KHONG_DOI = {
  tran: XANH, 'lien-ket-sau-2': dung(SK, 'docs/reference/m2.md'), 'chu-sau-2': dung(SK, 'docs/reference/m2.md'),
  'lien-ket-sau-1': dung(CM, 'docs/reference/m3.md'), 'chu-thich-ma': dung(MJ, 'docs/reference/m4.md'),
  'cham-gach': dung(SK, 'docs/reference/m5.md'), 'ten-tran-goc': dung(SK, 'README.md'), 'du-lieu-ma': dung(MJ, 'docs/reference/m4.md'),
  'thu-muc': dung(SK, 'docs/reference'), bay: XANH,
};
const MA_TRAN = {
  'bo-tuong-doi': KHONG_DOI,
  'sai-thu-muc': KHONG_DOI,
  'nua-chung': {
    // chu-thich-ma: dự đoán viết trước là «hỏng»; chạy ra «dừng» — dòng ngoài sổ chỉ đổi lần có tiền tố, mà regex hỏng
    // cắt mất tiền tố, nên không lần nào được đổi (sổ quyết định S4-r3 ghi ô sửa này).
    tran: XANH, 'lien-ket-sau-2': hong(SK), 'chu-sau-2': hong(SK), 'lien-ket-sau-1': hong(CM), 'chu-thich-ma': dung(MJ, 'docs/reference/m4.md'),
    'cham-gach': hong(SK), 'ten-tran-goc': dung(SK, 'README.md'), 'du-lieu-ma': dung(MJ, 'docs/reference/m4.md'),
    'thu-muc': dung(SK, 'docs/reference'), bay: hong(SK),
  },
  'qua-tay': { ...Object.fromEntries(Object.keys(DANG).map(k => [k, XANH])), bay: lech(SK) },
  'bo-ngoai-so': { ...Object.fromEntries(Object.keys(DANG).map(k => [k, XANH])),
    'chu-thich-ma': treo(MJ, 'docs/reference/m4.md'), 'ten-tran-goc': treo(SK, 'README.md'), 'thu-muc': treo(SK, 'docs/reference') },
  'tran-ngoai-so': { ...Object.fromEntries(Object.keys(DANG).map(k => [k, XANH])), 'ten-tran-goc': lech(SK) },
};

// Bản sao migration/ có tiêm nhiều kim (mỗi kim khớp đúng một lần) → thư mục kich-ban của bản sao.
function banSaoKim(dsKim) {
  const goc = path.join(DAY, '..');
  const dich = path.join(moTam('kb-ma-tran-'), 'migration');
  for (const d of ['kich-ban', 'tra-soat', 'chay-thu-phien']) fs.cpSync(path.join(goc, d), path.join(dich, d), { recursive: true });
  for (const [tep, kim, thay] of dsKim) {
    const p = path.join(dich, 'kich-ban', tep); const s = fs.readFileSync(p, 'utf8');
    assert.equal(s.split(kim).length - 1, 1, `kim phải khớp đúng một lần trong ${tep}: ${kim}`);
    fs.writeFileSync(p, s.replace(kim, thay));
  }
  return path.join(dich, 'kich-ban');
}
function oMaTran(dang, { script = KB, thuoc = kiemCho } = {}) {
  const f = moFix();
  // Kho nền có sẵn một liên kết tương đối trong skill cat-luot — gỡ nó để mỗi ô chỉ đo đúng dạng của hàng.
  const nen = TEP_KIT['skills/cat-luot/SKILL.md'].replace(', xem [ghi chú](../../docs/reference/ghi-chu.md)', '');
  assert.notEqual(nen, TEP_KIT['skills/cat-luot/SKILL.md'], 'kim gỡ liên kết nền phải khớp');
  const nguon = themCommit(f.kho, { 'skills/cat-luot/SKILL.md': nen, ...TAI_LIEU_MT, ...DANG[dang] }, 'ma trận');
  const r = donNha(f, 'don-nha/a', { nguon, script });
  if (r.status !== 0) return { status: r.status, stderr: r.stderr };
  return { status: 0, loi: thuoc({ kho: f.kho, nguon, dich: 'don-nha/a', bangXep: f.bangXep }).loi };
}
function soO(ten, ket, mong) {
  if (mong.xanh) { assert.equal(ket.status, 0, `${ten}: ${ket.stderr}`); assert.deepEqual(ket.loi, [], ten); return; }
  if (mong.dung) { assert.equal(ket.status, 1, `${ten}: kịch bản phải dừng`); assert.ok(ket.stderr.includes(mong.dung), `${ten}: ${ket.stderr}`); return; }
  assert.equal(ket.status, 0, `${ten}: ${ket.stderr}`);
  for (const x of mong.do) assert.ok(ket.loi.includes(x), `${ten}: thiếu «${x}» trong ${JSON.stringify(ket.loi)}`);
}

test('KB-AC7-ma-tran-doi-chung', () => {
  for (const dang of Object.keys(DANG)) soO(`đối chứng/${dang}`, oMaTran(dang), XANH);
});
for (const [db, kim] of Object.entries(DOT_BIEN)) {
  test(`KB-AC7-ma-tran-${db}`, () => {
    const script = path.join(banSaoKim(kim.map(([a, b]) => ['don-nha.mjs', a, b])), 'don-nha.mjs');
    for (const dang of Object.keys(DANG)) soO(`${db}/${dang}`, oMaTran(dang, { script }), MA_TRAN[db][dang]);
  });
}
// Thước tự đứng được: cả kịch bản lẫn phép tìm ngoài sổ của thước cùng bỏ dạng «thư mục» → phép đối chiếu nội dung (AC-4)
// mù vì hai bên cùng sai; chỉ lượt quét vi phân (khác cơ chế) còn đỏ.
test('KB-AC7-ma-tran-quet-vi-phan', async () => {
  const kb = banSaoKim([['don-nha.mjs', 'const ngoaiSo = conTroNgoaiSo(wt, S, kk, theoTep);', 'const ngoaiSo = new Map();'],
    ['kiem-cho.mjs', '  const ngoai = timNgoaiSo(kho, nguon, kk);', '  const ngoai = new Map();']]);
  const { kiemCho: thuocHong } = await import(path.join(kb, 'kiem-cho.mjs'));
  const ket = oMaTran('thu-muc', { script: path.join(kb, 'don-nha.mjs'), thuoc: thuocHong });
  assert.equal(ket.status, 0, ket.stderr);
  assert.deepEqual(ket.loi, [`con trỏ còn treo: ${SK} → docs/reference`]);
});
