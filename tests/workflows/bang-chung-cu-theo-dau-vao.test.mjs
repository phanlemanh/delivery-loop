// Hồ sơ bang-chung-cu-theo-dau-vao (vòng DL2) — một vị từ «vật đổi sau pin» cho mọi bên đọc JS, khớp luật lưới trước-gộp.
// Tên ca là hợp đồng với `_acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh` (BC-<n> ghim theo tên và số ca);
// ca phụ dùng tiền tố VT-. Mọi kho đo sinh trong thư mục tạm ngay trong lượt; mọi đường suy từ vị trí tệp này.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const AG = path.join(KIT, 'plugins', 'acceptance-gate');
const FL_SCRIPTS = path.join(KIT, 'plugins', 'feature-loop', 'scripts');
const VI_TU = path.join(FL_SCRIPTS, 'lib', 'vat-doi-sau-pin.mjs');
const PMC = path.join(AG, 'scripts', 'pre-merge-check.sh');
const core = createRequire(import.meta.url)(path.join(AG, 'lib', 'evidence-core.cjs'));
// Tên trạng thái đã ký lấy từ một nguồn (lib), không viết chữ trong tệp ca — tiền lệ sua-truoc-dot-thu, luật RT13.
const DA_KY = createRequire(import.meta.url)(path.join(AG, 'lib', 'workspace-record.cjs')).DA_THONG_CONG_2[0];
const tam = (p = 'bc-') => fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), p)));
const napViTu = (f = VI_TU) => import(`${pathToFileURL(f).href}?v=${Math.random()}`);

// ── vi phân bash↔JS (AC-8) ─────────────────────────────────────────────────────────────────────────────────────────
const GLOBS = ['docs/**', 'gen/*', 'LO-TRINH.html', '*.md', 'a/**/b.txt', 'x?.js', 'src/[ab].ts'];
const DUONG = ['docs/x.md', 'gen/a/b.txt', 'LO-TRINH.html', 'src/a.ts', 'a/b.txt', 'a/c/d/b.txt'];

function rutHamBash(text) {
  const rut = (ten) => {
    const m = new RegExp(`^${ten}\\(\\) \\{[\\s\\S]*?^\\}$`, 'm').exec(text);
    if (!m) throw new Error(`không rút được ${ten}`);
    return m[0];
  };
  const mg = rut('match_globs');
  return `${rut('glob_variants')}\n${mg}\n`;
}
function bashKhop(hamBash) {
  const dong = [];
  for (const g of GLOBS) for (const p of DUONG) dong.push(`if match_globs '${p}' '${g}'; then echo 1; else echo 0; fi`);
  const out = execFileSync('bash', ['-c', `${hamBash}\n${dong.join('\n')}`], { encoding: 'utf8' }).trim().split('\n');
  return out.map((x) => x === '1');
}
async function soVoiBash(viTuFile) {
  const { khopGlobBash } = await napViTu(viTuFile);
  const bash = bashKhop(rutHamBash(fs.readFileSync(PMC, 'utf8')));
  const lech = [];
  let i = 0;
  for (const g of GLOBS) for (const p of DUONG) {
    if (khopGlobBash(p, g) !== bash[i]) lech.push(`${g} × ${p}`);
    i++;
  }
  return { soSanhDuoc: i, lech, soBash: bash.length };
}

test('BC-8 vi phân bash↔JS: 42/42 phần tử khớp', async () => {
  const r = await soVoiBash(VI_TU);
  assert.equal(r.soBash, 42, 'bash phải trả 42 phán quyết');
  assert.equal(r.soSanhDuoc, 42);
  assert.deepEqual(r.lech, []);
});

test('BC-8-do bản sao JS không qua / → nêu phần tử lệch', async () => {
  const goc = fs.readFileSync(VI_TU, 'utf8');
  const dong = goc.split('\n');
  const idx = dong.map((d, i) => (d.includes('// SAO-CASE') ? i : -1)).filter((i) => i >= 0);
  assert.equal(idx.length, 1, 'phải có đúng một dòng // SAO-CASE');
  assert.ok(dong[idx[0]].includes("'.*'"), 'dòng // SAO-CASE phải dịch * thành .*');
  dong[idx[0]] = dong[idx[0]].replace("'.*'", "'[^/]*'");
  const banSao = dong.join('\n');
  assert.notEqual(banSao, goc);
  const f = path.join(tam(), 'vat-doi-sau-pin.mjs');
  fs.writeFileSync(f, banSao);
  const r = await soVoiBash(f);
  assert.ok(r.lech.length > 0, 'bản đột biến phải lệch bash');
  assert.ok(r.lech.includes('gen/* × gen/a/b.txt'), `thiếu gen/* × gen/a/b.txt trong ${r.lech.join('; ')}`);
});

test('BC-8-khong-rut bản sao đổi tên hàm bash → không rút được match_globs', () => {
  const t = fs.readFileSync(PMC, 'utf8');
  assert.doesNotThrow(() => rutHamBash(t));
  const doi = t.replace(/^match_globs\(\) \{/m, 'match_globs_x() {');
  assert.notEqual(doi, t);
  assert.throws(() => rutHamBash(doi), /không rút được match_globs/);
});

test('VT-1 ngoặc nhọn khớp chữ như case', async () => {
  const { khopGlobBash } = await napViTu();
  assert.equal(khopGlobBash('a.js', '{a,b}.js'), false);
  assert.equal(khopGlobBash('{a,b}.js', '{a,b}.js'), true);
});

test('VT-2 lớp phủ định và thoát', async () => {
  const { khopGlobBash } = await napViTu();
  assert.equal(khopGlobBash('c.ts', '[!ab].ts'), true);
  assert.equal(khopGlobBash('a.ts', '[!ab].ts'), false);
  assert.equal(khopGlobBash('c.ts', '[^ab].ts'), true);
  assert.equal(khopGlobBash('a.ts', '[^ab].ts'), false);
  assert.equal(khopGlobBash('*.md', '\\*.md'), true);
  assert.equal(khopGlobBash('x.md', '\\*.md'), false);
});

test('VT-3 không cấu hình → không loại T1, loc null', async () => {
  const { vatDoiSauPin } = await napViTu();
  const r = vatDoiSauPin({ doi: ['LO-TRINH.html', '_acceptance/s/a.md'], configText: null, evalsText: null, core });
  assert.deepEqual(r.giu, ['LO-TRINH.html']);
  assert.deepEqual(r.boHoSo, ['_acceptance/s/a.md']);
  assert.deepEqual(r.boT1, []);
  assert.equal(r.loc, null);
});

// ── kho đo dùng chung (AC-1…AC-6, ma trận AC-3) ────────────────────────────────────────────────────────────────────
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ghi = (k, f, t) => {
  fs.mkdirSync(path.dirname(path.join(k, f)), { recursive: true });
  fs.writeFileSync(path.join(k, f), t);
};
const PR_SAN_SANG = path.join(FL_SCRIPTS, 'pr-san-sang.mjs');
const REPIN = path.join(FL_SCRIPTS, 'repin-lane.mjs');

function cauHinh({ t1, staleScope }) {
  let t = 'schema_version: 1\nenforcement: strict\nrecheck: strict\ngap_probe: off\nfeature_loop:\n  suite_keys:\n    - executors.script.e1\nexecutors:\n  script:\n    e1: "sh suite.sh"\n';
  if (t1 || staleScope) t += 'risk_tiers:\n';
  if (t1) t += `  t1_skip_globs:\n${t1.map((g) => `    - "${g}"\n`).join('')}`;
  if (staleScope) t += `  stale_scope: ${staleScope}\n`;
  return t;
}
function evalsCua(evalsPaths) {
  const p = evalsPaths ? `    paths: [${evalsPaths.map((x) => `"${x}"`).join(', ')}]\n` : '';
  return `schema_version: 1\nfeature_slug: s\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.e1\n${p}    expected: exit 0\n    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n`;
}
function khoDo({ t1 = null, staleScope = null, evalsPaths = ['src/a.ts'], status = 'verified', doi = {}, coCauHinh = true } = {}) {
  const goc = tam('bcd-');
  const origin = path.join(goc, 'o.git');
  git(goc, 'init', '-q', '--bare', '-b', 'main', origin);
  const k = path.join(goc, 'k');
  git(goc, 'clone', '-q', origin, k);
  git(k, 'checkout', '-q', '-b', 'main');
  for (const f of ['src/a.ts', 'src/b.ts', 'src/bảng.ts', 'docs/x.md', 'LO-TRINH.html', 'gen/a/b.txt', 'pkg/a/_acceptance/s/x.md']) ghi(k, f, '1\n');
  ghi(k, 'suite.sh', 'exit 0\n');
  if (coCauHinh) ghi(k, '_acceptance/config.yaml', cauHinh({ t1, staleScope }));
  ghi(k, '_acceptance/s/contract.md', `---\nschema_version: 1\nfeature: Phiếu công ty hai cột\nslug: s\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\napproved_by: t\n---\n`);
  ghi(k, '_acceptance/s/evals.yaml', evalsCua(evalsPaths));
  git(k, 'add', '-A');
  git(k, 'commit', '-q', '-m', 'goc');
  git(k, 'push', '-q', 'origin', 'main');
  git(k, 'checkout', '-q', '-b', 'vong/s');
  ghi(k, 'src/a.ts', '2\n');
  git(k, 'add', '-A');
  git(k, 'commit', '-q', '-m', 'vat');
  const pin = git(k, 'rev-parse', 'HEAD');
  ghi(k, '_acceptance/s/run-log.jsonl', `${JSON.stringify({ ts: '2026-11-26T00:00:00Z', kind: 'eval', run_id: 'r1-E1', sha: pin, eval: 'E1', exit_code: 0 })}\n`);
  ghi(k, '_acceptance/s/evidence-report.md', `---\nschema_version: 1\nfeature_slug: s\nverdict: PASS\nverified_commit: ${pin}\n${status === DA_KY ? 'human_signoff: t 2026-11-26\n' : ''}---\n\n## Evidence\n- eval: E1\n  run_id: r1-E1\n  exit_code: 0\n  verifier: config:executors.script.e1\n  verified_at: 2026-11-26\n`);
  git(k, 'add', '-A');
  git(k, 'commit', '-q', '-m', 'goi bang chung');
  const tep = Object.entries(doi);
  if (tep.length) {
    for (const [f, t] of tep) ghi(k, f, t);
    git(k, 'add', '-A');
    git(k, 'commit', '-q', '-m', 'doi sau pin');
  }
  return { k, origin, pin };
}
function ghGia(k) {
  const goi = [];
  let pr = null;
  const chay = (cmd, args) => {
    if (cmd !== 'gh') return execFileSync(cmd, args, { cwd: k, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    goi.push(args.slice(0, 2).join(' '));
    if (args[1] === 'view') {
      if (!pr) throw new Error('no pull requests found');
      return JSON.stringify(pr);
    }
    if (args[1] === 'create') pr = { number: 12, isDraft: true, state: 'OPEN', url: 'u' };
    if (args[1] === 'ready') pr = { ...pr, isDraft: false };
    return '';
  };
  return { chay, goi };
}
// gh giả trên PATH cho các ca chạy dòng lệnh thật: ghi mỗi lời gọi vào một tệp, `pr view` báo chưa có PR.
function ghTrenPath() {
  const d = tam('bcgh-');
  const log = path.join(d, 'goi.txt');
  fs.writeFileSync(log, '');
  fs.writeFileSync(path.join(d, 'gh'), `#!/bin/sh\necho "$1 $2" >> "${log}"\n[ "$2" = view ] && { echo 'no pull requests found' >&2; exit 1; }\nexit 0\n`, { mode: 0o755 });
  return { env: { ...process.env, PATH: `${d}:${process.env.PATH}` }, goi: () => fs.readFileSync(log, 'utf8').split('\n').filter(Boolean) };
}
const nhanhTrenOrigin = (origin) => spawnSync('git', ['rev-parse', '--verify', '-q', 'refs/heads/vong/s'], { cwd: origin, encoding: 'utf8' }).stdout.trim();
const napPss = () => import(`${pathToFileURL(PR_SAN_SANG).href}?v=${Math.random()}`);
const loiMa = (ma, re, khong = []) => (e) => e && e.ma === ma && re.test(e.message) && khong.every((x) => !e.message.includes(x));

test('BC-1 chỉ T1 đổi → mở PR', async () => {
  const { prSanSang } = await napPss();
  const { k, origin } = khoDo({ t1: ['docs/**', 'LO-TRINH.html'], doi: { 'LO-TRINH.html': '2\n', 'docs/x.md': '2\n' } });
  const g = ghGia(k);
  prSanSang({ root: k, slug: 's', base: 'main', chay: g.chay, agRoot: AG, bao: () => {} });
  assert.equal(nhanhTrenOrigin(origin), git(k, 'rev-parse', 'HEAD'));
  assert.deepEqual(g.goi, ['pr view', 'pr create', 'pr view', 'pr ready']);
});

test('BC-1-do tệp ngoài T1 → thoát 2', async () => {
  const { prSanSang } = await napPss();
  const { k, origin } = khoDo({ t1: ['docs/**', 'LO-TRINH.html'], doi: { 'LO-TRINH.html': '2\n', 'docs/x.md': '2\n', 'src/a.ts': '3\n' } });
  const g = ghGia(k);
  assert.throws(() => prSanSang({ root: k, slug: 's', base: 'main', chay: g.chay, agRoot: AG, bao: () => {} }),
    loiMa(2, /vật đổi sau lượt chấm \(src\/a\.ts\)/, ['LO-TRINH.html', 'docs/x.md']));
  assert.equal(nhanhTrenOrigin(origin), '');
  assert.deepEqual(g.goi, []);
});

test('BC-1-doi-chung không khai T1 → LO-TRINH.html vẫn cũ', async () => {
  const { prSanSang } = await napPss();
  const { k } = khoDo({ doi: { 'LO-TRINH.html': '2\n' } });
  assert.throws(() => prSanSang({ root: k, slug: 's', base: 'main', chay: ghGia(k).chay, agRoot: AG, bao: () => {} }), loiMa(2, /LO-TRINH\.html/));
});

test('BC-2 ngoài paths khi bật → mở PR', async () => {
  const { prSanSang } = await napPss();
  const { k, origin } = khoDo({ staleScope: 'paths', doi: { 'src/b.ts': '2\n' } });
  const dong = [];
  prSanSang({ root: k, slug: 's', base: 'main', chay: ghGia(k).chay, agRoot: AG, bao: (d) => dong.push(d) });
  assert.ok(dong.includes('pr-san-sang: bỏ qua theo paths: 1 tệp — src/b.ts'), dong.join('\n'));
  assert.equal(nhanhTrenOrigin(origin), git(k, 'rev-parse', 'HEAD'));
});

test('BC-2-do trong paths → thoát 2', async () => {
  const { prSanSang } = await napPss();
  const { k } = khoDo({ staleScope: 'paths', doi: { 'src/a.ts': '3\n' } });
  assert.throws(() => prSanSang({ root: k, slug: 's', base: 'main', chay: ghGia(k).chay, agRoot: AG, bao: () => {} }), loiMa(2, /vật đổi sau lượt chấm \(src\/a\.ts\)/));
});

test('BC-2-khong-ap eval máy thiếu paths → giữ luật cũ', async () => {
  const { prSanSang } = await napPss();
  const { k } = khoDo({ staleScope: 'paths', evalsPaths: null, doi: { 'src/b.ts': '2\n' } });
  const dong = [];
  assert.throws(() => prSanSang({ root: k, slug: 's', base: 'main', chay: ghGia(k).chay, agRoot: AG, bao: (d) => dong.push(d) }), loiMa(2, /src\/b\.ts/));
  assert.ok(dong.some((d) => d.includes('eval-may-thieu-paths:')), dong.join('\n'));
});

test('BC-2-doi-chung cây bằng pin → không thoát 2', async () => {
  const { prSanSang } = await napPss();
  const { k } = khoDo({ staleScope: 'paths' });
  assert.doesNotThrow(() => prSanSang({ root: k, slug: 's', base: 'main', chay: ghGia(k).chay, agRoot: AG, bao: () => {} }));
});

test('BC-6 không nạp được bộ máy → giữ luật cũ', () => {
  const { k, origin } = khoDo({ t1: ['LO-TRINH.html'], doi: { 'LO-TRINH.html': '2\n' } });
  const gh = ghTrenPath();
  const r = spawnSync(process.execPath, [PR_SAN_SANG, '--root', k, '--slug', 's', '--base', 'main', '--ag-root', tam('bc-rong-')], { encoding: 'utf8', env: gh.env });
  assert.equal(r.status, 2, r.stderr);
  assert.match(r.stderr, /LO-TRINH\.html/);
  assert.match(r.stderr, /không nạp được bộ máy acceptance-gate — giữ luật cũ/);
  assert.equal(nhanhTrenOrigin(origin), '');
  assert.deepEqual(gh.goi(), []);
});

test('BC-6-doi-chung --ag-root đúng → không thoát 2', () => {
  const { k } = khoDo({ t1: ['LO-TRINH.html'], doi: { 'LO-TRINH.html': '2\n' } });
  const r = spawnSync(process.execPath, [PR_SAN_SANG, '--root', k, '--slug', 's', '--base', 'main', '--ag-root', AG], { encoding: 'utf8', env: ghTrenPath().env });
  assert.notEqual(r.status, 2, r.stderr);
  assert.doesNotMatch(r.stderr, /không nạp được bộ máy/);
});

test('VT-4 tên có dấu in tên thật', async () => {
  const { prSanSang } = await napPss();
  const { k } = khoDo({ doi: { 'src/bảng.ts': '2\n' } });
  assert.throws(() => prSanSang({ root: k, slug: 's', chay: ghGia(k).chay, agRoot: AG, chiXet: true, bao: () => {} }), loiMa(2, /src\/bảng\.ts/));
});

test('VT-5 pin không có trong kho → không so được', async () => {
  const { prSanSang } = await napPss();
  const { k } = khoDo();
  const f = path.join(k, '_acceptance/s/evidence-report.md');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/^verified_commit: \S+/m, `verified_commit: ${'f'.repeat(40)}`));
  assert.throws(() => prSanSang({ root: k, slug: 's', chay: ghGia(k).chay, agRoot: AG, chiXet: true, bao: () => {} }), loiMa(2, /không so được verified_commit/));
});

// ── ma trận mười ca (AC-3) — viết trước, nguyên văn bảng của hợp đồng ───────────────────────────────────────────────
// [#, kho đo, cột pr-san-sang (MỚI/CŨ), cột làn --skip-unchanged (BỎ QUA/CHẠY)]
const T1_TL = ['docs/**', 'LO-TRINH.html'];
const MA_TRAN = [
  [1, { t1: T1_TL, doi: { 'LO-TRINH.html': '2\n', 'docs/x.md': '2\n' } }, 'MỚI', 'BỎ QUA'],
  [2, { doi: { '_acceptance/s/ghi-chu.md': 'x\n' } }, 'MỚI', 'BỎ QUA'],
  [3, { doi: { 'pkg/a/_acceptance/s/x.md': '2\n' } }, 'MỚI', 'BỎ QUA'],
  [4, { staleScope: 'paths', doi: { 'src/b.ts': '2\n' } }, 'MỚI', 'BỎ QUA'],
  [5, { staleScope: 'paths', doi: { 'src/a.ts': '3\n' } }, 'CŨ', 'CHẠY'],
  [6, { doi: { 'src/b.ts': '2\n' } }, 'CŨ', 'CHẠY'],
  [7, { staleScope: 'paths', evalsPaths: null, doi: { 'src/b.ts': '2\n' } }, 'CŨ', 'CHẠY'],
  [8, { staleScope: 'paths', doi: { 'src/bảng.ts': '2\n' } }, 'MỚI', 'BỎ QUA'],
  [9, { doi: { '_acceptance/config.yaml': `${cauHinh({})}# doi sau pin\n` } }, 'MỚI', 'CHẠY'],
  [10, { t1: ['gen/*'], doi: { 'gen/a/b.txt': '2\n' } }, 'MỚI', 'BỎ QUA'],
];
const dungKhoCa = (o) => khoDo({ status: DA_KY, ...o });
function xetPss(k, scripts = FL_SCRIPTS) {
  const r = spawnSync(process.execPath, [path.join(scripts, 'pr-san-sang.mjs'), '--root', k, '--slug', 's', '--chi-xet', '--ag-root', AG], { encoding: 'utf8', env: ghTrenPath().env });
  return { ket: r.status === 0 ? 'MỚI' : r.status === 2 ? 'CŨ' : `thoát ${r.status}`, r };
}
function xetLan(k, scripts = FL_SCRIPTS) {
  const r = spawnSync(process.execPath, [path.join(scripts, 'repin-lane.mjs'), '--root', k, '--slug', 's', '--ag-root', AG, '--allow-dirty', '--skip-unchanged'], { encoding: 'utf8' });
  let bo = false;
  try {
    bo = JSON.parse(r.stdout).skipped === true;
  } catch {
    bo = false;
  }
  return { ket: bo ? 'BỎ QUA' : r.status === 0 ? 'CHẠY' : `thoát ${r.status}`, r };
}

test('BC-3 ma trận mười ca', () => {
  const lech = [];
  let soPhanQuyet = 0;
  for (const [n, o, mongPss, mongLan] of MA_TRAN) {
    const { k } = dungKhoCa(o);
    const p = xetPss(k);
    const l = xetLan(k);
    soPhanQuyet += 2;
    if (p.ket !== mongPss) lech.push(`#${n} pr-san-sang: ${p.ket} ≠ ${mongPss} — ${p.r.stderr.trim()}`);
    if (l.ket !== mongLan) lech.push(`#${n} làn: ${l.ket} ≠ ${mongLan} — ${l.r.stderr.trim().split('\n').slice(-3).join(' | ')}`);
  }
  assert.equal(soPhanQuyet, 20);
  assert.deepEqual(lech, []);
});

test('BC-3-dot-bien bỏ vế T1 → lật cả hai bên đọc', () => {
  const ca1 = MA_TRAN[0][1];
  const banSao = path.join(tam('bcdb-'), 'scripts');
  fs.cpSync(FL_SCRIPTS, banSao, { recursive: true });
  const f = path.join(banSao, 'lib', 'vat-doi-sau-pin.mjs');
  const dong = fs.readFileSync(f, 'utf8').split('\n');
  const idx = dong.map((d, i) => (d.includes("'risk_tiers.t1_skip_globs'") ? i : -1)).filter((i) => i >= 0);
  assert.equal(idx.length, 1, "phải có đúng một dòng dựng danh sách T1 ('risk_tiers.t1_skip_globs')");
  dong[idx[0]] = '    const t1 = [];';
  fs.writeFileSync(f, dong.join('\n'));
  const goc = dungKhoCa(ca1);
  assert.deepEqual([xetPss(goc.k).ket, xetLan(goc.k).ket], ['MỚI', 'BỎ QUA'], 'đối chứng: bản gốc trên ca 1');
  const db = dungKhoCa(ca1);
  assert.deepEqual([xetPss(db.k, banSao).ket, xetLan(db.k, banSao).ket], ['CŨ', 'CHẠY'], 'bản đột biến phải lật CẢ HAI bên đọc');
});

test('BC-3-luoi bốn ca khớp pre-merge-check.sh', () => {
  const lech = [];
  let soSanh = 0;
  for (const [n, o, mongPss] of MA_TRAN.filter(([n]) => [1, 4, 5, 10].includes(n))) {
    const { k } = dungKhoCa(o);
    const r = spawnSync('bash', [PMC, '--base', 'main'], { cwd: k, encoding: 'utf8' });
    const cu = /VIOLATION \[s\]: evidence is stale/.test(r.stdout + r.stderr);
    soSanh++;
    if (cu !== (mongPss === 'CŨ')) lech.push(`#${n}: lưới ${cu ? 'CŨ' : 'MỚI'} ≠ ${mongPss}\n${(r.stdout + r.stderr).split('\n').filter((d) => /VIOLATION|NOTE/.test(d)).join('\n')}`);
  }
  assert.equal(soSanh, 4);
  assert.deepEqual(lech, []);
});

// ── bước «Staleness guard» của SKILL chạy đúng lệnh trong khối STALE-GUARD (AC-5) ───────────────────────────────────
const SKILL = path.join(KIT, 'plugins', 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
function rutLenhStaleGuard(skillText, { scriptPath = PR_SAN_SANG, slug = 's', agRoot = AG } = {}) {
  const khoi = /<!-- <<<STALE-GUARD -->\n([\s\S]*?)<!-- STALE-GUARD>>> -->/.exec(skillText)?.[1];
  if (!khoi) throw new Error('không thấy khối STALE-GUARD');
  const lenh = khoi.split('\n').find((d) => d.startsWith('node '));
  if (!lenh) throw new Error('khối STALE-GUARD thiếu dòng lệnh node');
  const goc = '"$WORKFLOWS_DIR/../scripts/pr-san-sang.mjs"';
  if (!lenh.includes(goc)) throw new Error(`dòng lệnh STALE-GUARD không trỏ ${goc}`);
  return `${lenh.replace(goc, JSON.stringify(scriptPath)).replace('<slug>', slug)} --ag-root ${JSON.stringify(agRoot)}`;
}
function chayStaleGuard(k, o = {}) {
  const gh = ghTrenPath();
  const r = spawnSync('bash', ['-c', rutLenhStaleGuard(fs.readFileSync(SKILL, 'utf8'), o)], { cwd: k, encoding: 'utf8', env: gh.env });
  return { ...r, ra: r.stdout + r.stderr, goi: gh.goi() };
}

test('BC-5 bằng pin → bằng chứng còn mới', () => {
  const { k } = khoDo();
  const r = chayStaleGuard(k);
  assert.equal(r.status, 0, r.ra);
  assert.match(r.stdout, /bằng chứng còn mới/);
});

test('BC-5-do đổi src/a.ts → bằng chứng cũ', () => {
  const { k } = khoDo({ doi: { 'src/a.ts': '3\n' } });
  const r = chayStaleGuard(k);
  assert.equal(r.status, 2, r.ra);
  assert.match(r.ra, /bằng chứng cũ:.*src\/a\.ts/);
});

test('BC-5-t1 chỉ T1 → thoát 0', () => {
  const { k } = khoDo({ t1: ['docs/**'], doi: { 'docs/x.md': '2\n' } });
  const r = chayStaleGuard(k);
  assert.equal(r.status, 0, r.ra);
});

test('BC-5-khong-day không đẩy, gh 0 lời gọi', () => {
  for (const o of [{}, { doi: { 'src/a.ts': '3\n' } }, { t1: ['docs/**'], doi: { 'docs/x.md': '2\n' } }]) {
    const { k, origin } = khoDo(o);
    const r = chayStaleGuard(k);
    assert.equal(nhanhTrenOrigin(origin), '', `${JSON.stringify(o)}: không được đẩy`);
    assert.deepEqual(r.goi, [], `${JSON.stringify(o)}: gh không được gọi`);
  }
});

test(`BC-5-${DA_KY} chạy khi hợp đồng ${DA_KY}`, () => {
  const { k } = khoDo({ status: DA_KY });
  const r = chayStaleGuard(k);
  assert.equal(r.status, 0, r.ra);
  assert.match(r.stdout, /bằng chứng còn mới/);
});

test('BC-5-thieu-khoi SKILL bỏ khối → không thấy khối STALE-GUARD', () => {
  const t = fs.readFileSync(SKILL, 'utf8');
  assert.doesNotThrow(() => rutLenhStaleGuard(t), 'đối chứng: SKILL của cây phải có khối');
  const cat = t.replace(/<!-- <<<STALE-GUARD -->[\s\S]*?<!-- STALE-GUARD>>> -->/, '');
  assert.notEqual(cat, t);
  assert.throws(() => rutLenhStaleGuard(cat), /không thấy khối STALE-GUARD/);
});
