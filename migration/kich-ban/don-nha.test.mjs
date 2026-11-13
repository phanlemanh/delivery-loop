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
