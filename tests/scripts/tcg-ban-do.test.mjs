// tcg-ban-do.test.mjs — hồ sơ tep-chung-khong-chan-gop (AC-1…AC-6, AC-11): hai view máy sinh (PRODUCT-MAP.md,
// LO-TRINH.html) rời git ở kho khai `ban_do.ngoai_git: true`; nhánh view do `--day-nhanh-ve` đẩy; kho không bật
// không đổi byte. Kho thử là kho git thật dựng trong lượt (git init thư mục tạm); view do CHÍNH product-map.mjs của
// gốc đang kiểm vẽ. Gốc đang kiểm suy từ vị trí tệp này, `TCG_GOC` ghi đè (bản sao đã tiêm của tcg-mutants).
// Chọn ca: node --test --test-name-pattern='^TCG-<n>' (bộ chạy _acceptance/tep-chung-khong-chan-gop/rang/chay.sh).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GOC = process.env.TCG_GOC ? path.resolve(process.env.TCG_GOC) : path.resolve(HERE, '..', '..');
const AG = path.join(GOC, 'plugins', 'acceptance-gate');
const PM = path.join(AG, 'scripts', 'product-map.mjs');
const SCAN = path.join(AG, 'scripts', 'start-scan.mjs');
const WR_PATH = path.join(AG, 'lib', 'workspace-record.cjs');
const NGUON_HANG = path.join(GOC, 'plugins', 'dispatch', 'scripts', 'nguon-hang.mjs');
const TMP = mkdtempSync(path.join(tmpdir(), 'tcg-ban-do-'));
const req = createRequire(import.meta.url);

const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const gitThu = (d, ...a) => spawnSync('git', ['-C', d, ...a], { encoding: 'utf8' });
const chay = (file, args, cwd) => spawnSync(process.execPath, [file, ...args], { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const pm = (r, ...a) => chay(PM, ['--root', r, ...a], r);
const VIEWS = ['PRODUCT-MAP.md', 'LO-TRINH.html'];
const KHOA_BAT = 'ban_do:\n  ngoai_git: true\n';

// ── kho thử ────────────────────────────────────────────────────────────────────────────────────────────────────
let khoN = 0;
// views: 'commit' (vẽ rồi commit hai view) · 'ignore' (.gitignore bỏ qua hai view, vẽ tại chỗ) · 'none' (bỏ qua, không vẽ).
function kho({ khoa = '', loTrinh = true, views = 'commit', pmFile = PM, ten = null } = {}) {
  const r = path.join(TMP, ten || `kho-${++khoN}`);
  mkdirSync(path.join(r, 'docs'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', r]);
  git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'),
    'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\n'
    + (loTrinh ? 'lo_trinh:\n  tep: docs/lo-trinh.json\n' : '') + khoa);
  if (loTrinh) writeFileSync(path.join(r, 'docs', 'lo-trinh.json'), JSON.stringify({ schema: 1, ten: 'Thử', hang: [
    { ma: 'A', slug: 'a', cau_giao: 'Việc A', vi_sao: 'Gốc: x/_acceptance/a — lý do một câu.' },
    { ma: 'B', slug: 'b', cau_giao: 'Việc B', vi_sao: 'Gốc: x/_acceptance/b — lý do một câu.' }] }, null, 2) + '\n');
  for (const s of ['a', 'b']) {
    mkdirSync(path.join(r, '_acceptance', s), { recursive: true });
    writeFileSync(path.join(r, '_acceptance', s, 'contract.md'), `---\nschema_version: 1\nfeature: Việc ${s}\nslug: ${s}\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: draft\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- Không làm x.\n- Không làm y.\n`);
  }
  if (views !== 'commit') writeFileSync(path.join(r, '.gitignore'), VIEWS.join('\n') + '\n');
  if (views !== 'none') { const v = chay(pmFile, ['--root', r], r); if (v.status !== 0) throw new Error(`vẽ kho thử thoát ${v.status}: ${v.stderr}`); }
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'kho');
  return r;
}
const doiStatus = (r, slug, st) => {
  const p = path.join(r, '_acceptance', slug, 'contract.md');
  writeFileSync(p, readFileSync(p, 'utf8').replace(/^status: \w[\w-]*$/m, `status: ${st}`));
};
const doiKhoa = (r, khoa) => {
  const p = path.join(r, '_acceptance', 'config.yaml');
  writeFileSync(p, readFileSync(p, 'utf8').replace(/ban_do:[\s\S]*$/, '') + khoa);
};
const nhanVeTaiCho = () => req(WR_PATH).MAP_LABELS['ve-tai-cho'];
const quet = r => { const x = chay(SCAN, ['--root', r], r); assert.equal(x.status, 0, `start-scan thoát ${x.status}: ${x.stderr}`); return JSON.parse(x.stdout.trim().split('\n').pop()); };

// ── AC-1 — kho không bật không đổi byte so với bản trước vòng ──────────────────────────────────────────────────
function banTruoc() {
  let ref = null;
  for (const b of ['origin/main', 'main']) { const x = gitThu(GOC, 'rev-parse', '--verify', '-q', b); if (x.status === 0) { ref = b; break; } }
  if (!ref) return { loi: 'khong tim duoc nhanh chinh (origin/main, main)' };
  const mb = git(GOC, 'merge-base', 'HEAD', ref);
  if (mb === git(GOC, 'rev-parse', 'HEAD')) return { loi: 'khong co ban truoc vong' };
  const d = path.join(TMP, 'truoc'); mkdirSync(d, { recursive: true });
  execFileSync('bash', ['-c', `git -C "$1" archive "$2" plugins/acceptance-gate | tar -x -C "$3"`, 'x', GOC, mb, d]);
  return { sha: mb, pm: path.join(d, 'plugins', 'acceptance-gate', 'scripts', 'product-map.mjs'), scan: path.join(d, 'plugins', 'acceptance-gate', 'scripts', 'start-scan.mjs') };
}
// Một lượt đo: chạy trọn kịch bản (ghi · --check khớp · lệch · đã xoá · bộ quét) bằng MỘT bản, trên một kho dựng mới.
function luot(pmFile, scanFile, khoa, ten) {
  const r = kho({ khoa, pmFile, ten });
  const chuan = s => String(s).split(r).join('<KHO>').split(path.dirname(path.dirname(pmFile))).join('<AG>');
  const ra = {};
  const ghi = chay(pmFile, ['--root', r], r);
  ra.ghi = [ghi.status, chuan(ghi.stdout), chuan(ghi.stderr), ...VIEWS.map(v => readFileSync(path.join(r, v), 'utf8'))];
  const khop = chay(pmFile, ['--root', r, '--check'], r); ra.khop = [khop.status, chuan(khop.stdout), chuan(khop.stderr)];
  doiStatus(r, 'a', 'approved');
  const lech = chay(pmFile, ['--root', r, '--check'], r); ra.lech = [lech.status, chuan(lech.stdout), chuan(lech.stderr)];
  git(r, 'checkout', '-q', '--', '.'); git(r, 'rm', '-q', 'PRODUCT-MAP.md'); git(r, 'commit', '-qm', 'xoa');
  const xoa = chay(pmFile, ['--root', r, '--check'], r); ra.xoa = [xoa.status, chuan(xoa.stdout), chuan(xoa.stderr)];
  const q = chay(scanFile, ['--root', r], r); ra.quet = JSON.stringify(JSON.parse(q.stdout.trim().split('\n').pop()).map);
  return ra;
}
test('TCG-1 kho khong bat khong doi byte so ban truoc vong', () => {
  const t = banTruoc(); assert.ok(!t.loi, `FAIL: TCG-1 ${t.loi}`);
  for (const [nhan, khoa] of [['vang', ''], ['false', 'ban_do:\n  ngoai_git: false\n']]) {
    const a = luot(t.pm, t.scan, khoa, `t1-${nhan}-truoc/kho`); const b = luot(PM, SCAN, khoa, `t1-${nhan}-sau/kho`);
    for (const k of Object.keys(a)) assert.deepEqual(b[k], a[k], `lech byte: khoa ${nhan}, tinh huong ${k}`);
  }
});
test('TCG-1-bat kho bat phai khac giua hai ban', () => {
  const t = banTruoc(); assert.ok(!t.loi, `FAIL: TCG-1 ${t.loi}`);
  const r1 = kho({ khoa: KHOA_BAT, views: 'ignore', pmFile: t.pm }); const r2 = kho({ khoa: KHOA_BAT, views: 'ignore' });
  const a = chay(t.pm, ['--root', r1, '--check'], r1); const b = pm(r2, '--check');
  assert.notEqual(a.stdout + a.stderr + a.status, b.stdout + b.stderr + b.status, 'phep so khong thay thay doi cua vong');
});

// ── AC-2 — kho bật, rời git đúng: --check im ──────────────────────────────────────────────────────────────────
const imDung = (x, tag) => {
  assert.equal(x.status, 0, `${tag}: --check thoat ${x.status}: ${x.stderr}`);
  const nhan = nhanVeTaiCho(); assert.ok(nhan, 'bang nhan chung thieu ve-tai-cho');
  assert.equal(x.stdout.split('\n').filter(l => l.includes(nhan)).length, 1, `${tag}: can dung mot dong mang nhan «${nhan}»; stdout: ${x.stdout}`);
  assert.ok(!/lệch/.test(x.stdout + x.stderr), `${tag}: khong duoc bao lech`);
  assert.ok(!/đã bị xoá/.test(x.stdout + x.stderr), `${tag}: khong duoc bao da bi xoa`);
};
test('TCG-2a bat: sua status khong ve lai van xanh', () => { const r = kho({ khoa: KHOA_BAT, views: 'ignore' }); doiStatus(r, 'a', 'approved'); imDung(pm(r, '--check'), 'TCG-2a'); });
test('TCG-2b bat: xoa hai tep van xanh', () => { const r = kho({ khoa: KHOA_BAT, views: 'ignore' }); for (const v of VIEWS) rmSync(path.join(r, v)); imDung(pm(r, '--check'), 'TCG-2b'); });
test('TCG-2c bat: ve lai tai cho van xanh', () => { const r = kho({ khoa: KHOA_BAT, views: 'ignore' }); doiStatus(r, 'a', 'approved'); assert.equal(pm(r).status, 0); imDung(pm(r, '--check'), 'TCG-2c'); });
test('TCG-2d bat: kho khong khai lo trinh khong doi LO-TRINH.html', () => { const r = kho({ khoa: KHOA_BAT, views: 'ignore', loTrinh: false }); imDung(pm(r, '--check'), 'TCG-2d'); });
test('TCG-2-doi-chung khong bat: sua status la lech', () => {
  const r = kho(); doiStatus(r, 'a', 'approved'); const x = pm(r, '--check');
  assert.equal(x.status, 1); assert.match(x.stderr, /lệch/);
});

// ── AC-3 — kho bật, sai thì đỏ đúng chỗ ───────────────────────────────────────────────────────────────────────
test('TCG-3-1 PRODUCT-MAP.md con trong chi muc', () => {
  const r = kho({ khoa: KHOA_BAT, views: 'ignore' }); git(r, 'add', '-f', 'PRODUCT-MAP.md'); git(r, 'commit', '-qm', 'lot');
  const x = pm(r, '--check'); assert.equal(x.status, 1, x.stdout + x.stderr); assert.ok(x.stderr.includes('git rm --cached -- PRODUCT-MAP.md'), x.stderr);
});
test('TCG-3-2 LO-TRINH.html con trong chi muc', () => {
  const r = kho({ khoa: KHOA_BAT, views: 'ignore' }); git(r, 'add', '-f', 'LO-TRINH.html'); git(r, 'commit', '-qm', 'lot');
  const x = pm(r, '--check'); assert.equal(x.status, 1, x.stdout + x.stderr); assert.ok(x.stderr.includes('git rm --cached -- LO-TRINH.html'), x.stderr);
});
test('TCG-3-3 view khong bi gitignore bo qua', () => {
  const r = kho({ khoa: KHOA_BAT, views: 'ignore' }); writeFileSync(path.join(r, '.gitignore'), 'PRODUCT-MAP.md\n');
  const x = pm(r, '--check'); assert.equal(x.status, 1, x.stdout + x.stderr);
  assert.ok(/\.gitignore/.test(x.stderr) && x.stderr.includes('LO-TRINH.html'), x.stderr);
});
test('TCG-3-4 tep lo trinh hong do dung thong diep bo ve', () => {
  const hong = r => writeFileSync(path.join(r, 'docs', 'lo-trinh.json'), '{ hong');
  const rTat = kho(); hong(rTat); assert.equal(pm(rTat).status, 0);
  const trang = readFileSync(path.join(rTat, 'LO-TRINH.html'), 'utf8');
  const m = trang.match(/<p class="loi">([\s\S]*?)<\/p>/); assert.ok(m, 'tien de: trang cua kho khong bat khong in loi tep y dinh');
  const loiTrang = m[1].replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  const rBat = kho({ khoa: KHOA_BAT, views: 'ignore' }); hong(rBat);
  const x = pm(rBat, '--check'); assert.equal(x.status, 1, x.stdout + x.stderr); assert.ok(x.stderr.includes(loiTrang), `stderr khong mang thong diep bo ve «${loiTrang}»: ${x.stderr}`);
});

// ── AC-4 — bốn khối lệnh vẽ lại ───────────────────────────────────────────────────────────────────────────────
const KHOI_TEP = ['commands/approve.md', 'commands/signoff.md', 'commands/observed.md', 'skills/uat-session/SKILL.md'];
function khoiLenh() {
  return KHOI_TEP.map(f => {
    const dong = readFileSync(path.join(AG, f), 'utf8').split('\n').filter(l => l.includes('PMAP=scripts/product-map.mjs') && l.startsWith('AG='));
    assert.equal(dong.length, 1, `${f}: can dung mot dong khoi lenh ve lai, thay ${dong.length}`);
    return dong[0];
  });
}
const chayKhoi = (r, dong) => spawnSync('bash', ['-c', dong], { cwd: r, encoding: 'utf8', env: { ...process.env, AG } });
test('TCG-4-mot-ban bon ban trung tung ky tu, khong doc khoa', () => {
  const k = khoiLenh(); for (let i = 1; i < k.length; i++) assert.equal(k[i], k[0], `${KHOI_TEP[i]} khac ${KHOI_TEP[0]}`);
  assert.ok(!k[0].includes('ngoai_git'), 'khoi lenh khong duoc doc khoa');
});
test('TCG-4-bat kho bat: ve tai cho, khong dua view vao chi muc', () => {
  const r = kho({ khoa: KHOA_BAT, views: 'none' }); doiStatus(r, 'a', 'approved');
  const x = chayKhoi(r, khoiLenh()[0]); assert.equal(x.status, 0, x.stderr);
  for (const v of VIEWS) assert.ok(existsSync(path.join(r, v)), `${v} chua ve`);
  const chiMuc = git(r, 'diff', '--cached', '--name-only'); for (const v of VIEWS) assert.ok(!chiMuc.split('\n').includes(v), `${v} vao chi muc`);
});
test('TCG-4-tat kho khong bat: dua hai view vao chi muc nhu truoc', () => {
  const r = kho(); doiStatus(r, 'a', 'approved');
  const x = chayKhoi(r, khoiLenh()[0]); assert.equal(x.status, 0, x.stderr);
  const chiMuc = git(r, 'diff', '--cached', '--name-only').split('\n'); for (const v of VIEWS) assert.ok(chiMuc.includes(v), `${v} khong vao chi muc`);
});

// ── AC-5 — ba bên đọc khoá cùng phán quyết; trạng thái ve-tai-cho; bảng điều phối ─────────────────────────────
const DANG = [
  ['tran', 'ban_do:\n  ngoai_git: true\n', 'bat'],
  ['nhay', 'ban_do:\n  ngoai_git: "true"\n', 'bat'],
  ['chu-thich', 'ban_do:\n  ngoai_git: true  # roi git\n', 'bat'],
  ['khoi-khac', 'khac:\n  ngoai_git: true\n', 'tat'],
  ['yes', 'ban_do:\n  ngoai_git: yes\n', 'sai'],
  ['vang', '', 'tat'],
];
test('TCG-5-dang sau dang khoa qua ba ben doc', () => {
  const WR = req(WR_PATH); assert.equal(typeof WR.banDo, 'function', 'lib thieu banDo');
  let n = 0;
  for (const [ten, khoa, mong] of DANG) {
    const cfg = 'schema_version: 1\n' + khoa;
    const b = WR.banDo(cfg); const lib = b.loi ? 'sai' : (b.ngoaiGit ? 'bat' : 'tat');
    assert.equal(lib, mong, `lib, dang ${ten}`); n++;
    const r = kho({ khoa, views: mong === 'bat' ? 'ignore' : 'commit' });
    const x = pm(r, '--check'); const chk = x.status === 2 ? 'sai' : (x.stdout.includes(nhanVeTaiCho()) ? 'bat' : 'tat');
    assert.equal(chk, mong, `--check, dang ${ten}: ${x.status} ${x.stdout} ${x.stderr}`); n++;
    if (mong === 'bat') for (const v of VIEWS) rmSync(path.join(r, v), { force: true });
    const st = quet(r).map.state; const scan = st === 've-tai-cho' ? 'bat' : (st === 'khoa-sai' ? 'sai' : 'tat');
    assert.equal(scan, mong, `start-scan, dang ${ten}: state ${st}`); n++;
  }
  assert.equal(n, 18);
});
test('TCG-5-check khoa sai thoat 2 goi ten khoa', () => {
  for (const v of ['yes', 'True']) {
    const r = kho({ khoa: `ban_do:\n  ngoai_git: ${v}\n` }); const x = pm(r, '--check');
    assert.equal(x.status, 2, `${v}: ${x.stderr}`); assert.ok(x.stderr.includes('ban_do.ngoai_git'), x.stderr);
  }
});
test('TCG-5-bat bo quet tra ve-tai-cho voi nhan chung', () => {
  const r = kho({ khoa: KHOA_BAT, views: 'none' }); const m = quet(r).map;
  const WR = req(WR_PATH);
  assert.equal(m.state, 've-tai-cho'); assert.equal(m.label, WR.MAP_LABELS['ve-tai-cho']); assert.notEqual(m.label, WR.MAP_LABELS['da-xoa']);
  assert.ok(pm(r, '--check').stdout.includes(WR.MAP_LABELS['ve-tai-cho']));
});
test('TCG-5-dieu-phoi bang dieu phoi bao vang khi trang ve tai cho chua ve', () => {
  const doc = r => spawnSync(process.execPath, ['--input-type=module', '-e', `const m=await import(${JSON.stringify('file://' + NGUON_HANG)});m.docNhomKeHoach(${JSON.stringify(r)});`], { encoding: 'utf8' });
  const rBat = kho({ khoa: KHOA_BAT, views: 'none' }); const a = doc(rBat);
  assert.equal(a.status, 0, a.stderr); assert.equal(a.stderr.trim().split('\n').filter(Boolean).length, 1, `can dung mot dong: ${a.stderr}`); assert.ok(a.stderr.includes('product-map.mjs'));
  const rTat = kho({ views: 'commit' }); rmSync(path.join(rTat, 'LO-TRINH.html')); const b = doc(rTat);
  assert.equal(b.stderr, '', `kho khong bat phai im: ${b.stderr}`);
});
test('TCG-5-cu kho khong bat, ban do commit roi xoa van la da-xoa', () => {
  const r = kho(); git(r, 'rm', '-q', 'PRODUCT-MAP.md'); git(r, 'commit', '-qm', 'xoa');
  assert.equal(quet(r).map.state, 'da-xoa');
});

// ── AC-6 — hai nhánh đổi hai hồ sơ khác nhau, gộp không driver ─────────────────────────────────────────────────
function gopThu(khoa, views) {
  const r = kho({ khoa, views }); assert.ok(existsSync(path.join(r, 'docs', 'lo-trinh.json')), 'tien de: kho thu khong co tep lo trinh');
  assert.equal(gitThu(r, 'config', '--get-regexp', '^merge\\.').stdout, '', 'tien de: kho thu co merge driver');
  const dong = khoiLenh()[0];
  for (const [nh, s] of [['n1', 'a'], ['n2', 'b']]) {
    git(r, 'checkout', '-q', '-b', nh, 'main'); doiStatus(r, s, 'approved');
    const x = chayKhoi(r, dong); assert.equal(x.status, 0, x.stderr);
    git(r, 'add', '-A'); git(r, 'commit', '-qm', `doi ${s}`);
  }
  return gitThu(r, 'merge-tree', '--write-tree', '--name-only', 'n1', 'n2');
}
test('TCG-6-bat kho bat gop khong xung dot', () => { const x = gopThu(KHOA_BAT, 'ignore'); assert.equal(x.status, 0, `xung dot: ${x.stdout}`); });
test('TCG-6-tat kho khong bat xung dot o hai view', () => {
  const x = gopThu('', 'commit'); assert.equal(x.status, 1, `phep do khong thay xung dot: ${x.stdout}`);
  for (const v of VIEWS) assert.ok(x.stdout.split('\n').includes(v), `thieu ${v} trong xung dot: ${x.stdout}`);
});

// ── AC-11 — nhánh view ────────────────────────────────────────────────────────────────────────────────────────
function khoOrigin(khoaNhanh = 'ban_do:\n  ngoai_git: true\n  nhanh_ve: ban-do\n') {
  const r = kho({ khoa: khoaNhanh, views: 'ignore' });
  const o = path.join(TMP, `origin-${++khoN}.git`); execFileSync('git', ['init', '-q', '--bare', '-b', 'main', o]);
  git(r, 'remote', 'add', 'origin', o); git(r, 'push', '-q', 'origin', 'main'); git(r, 'remote', 'set-head', 'origin', 'main');
  return { r, o };
}
const day = r => pm(r, '--day-nhanh-ve');
const dinh = (o, n) => { const x = gitThu(o, 'rev-parse', '--verify', '-q', `refs/heads/${n}`); return x.status === 0 ? x.stdout.trim() : null; };
test('TCG-11-day lan dau day nhanh view chi hai view, nhanh chinh khong doi', () => {
  const { r, o } = khoOrigin(); const main0 = git(r, 'rev-parse', 'main'); const st0 = git(r, 'status', '--porcelain');
  const x = day(r); assert.equal(x.status, 0, x.stderr);
  assert.ok(dinh(o, 'ban-do'), 'origin khong co nhanh ban-do');
  assert.deepEqual(git(o, 'ls-tree', '-r', '--name-only', 'ban-do').split('\n').sort(), [...VIEWS].sort());
  const d = path.join(TMP, `ve-rieng-${++khoN}`); cpSync(r, d, { recursive: true }); for (const v of VIEWS) rmSync(path.join(d, v), { force: true });
  assert.equal(pm(d).status, 0);
  for (const v of VIEWS) assert.equal(execFileSync('git', ['-C', o, 'show', `ban-do:${v}`], { encoding: 'utf8' }), readFileSync(path.join(d, v), 'utf8'), `${v} lech ban ve tai cho`);
  assert.equal(git(r, 'rev-parse', 'main'), main0); assert.equal(git(r, 'status', '--porcelain'), st0);
});
test('TCG-11-lai khong doi thi khong day', () => {
  const { r, o } = khoOrigin(); assert.equal(day(r).status, 0); const s1 = dinh(o, 'ban-do');
  const x = day(r); assert.equal(x.status, 0, x.stderr); assert.equal(dinh(o, 'ban-do'), s1); assert.match(x.stdout, /không đẩy/);
});
test('TCG-11-doi doi nguon thi dinh moi', () => {
  const { r, o } = khoOrigin(); assert.equal(day(r).status, 0); const s1 = dinh(o, 'ban-do'); const cu = git(o, 'show', 'ban-do:PRODUCT-MAP.md');
  doiStatus(r, 'a', 'approved'); git(r, 'commit', '-qam', 'doi');
  assert.equal(day(r).status, 0); assert.notEqual(dinh(o, 'ban-do'), s1); assert.notEqual(git(o, 'show', 'ban-do:PRODUCT-MAP.md'), cu);
});
test('TCG-11-khoa nhanh_ve vang, rong, trung nhanh mac dinh thi thoat 2', () => {
  for (const [ten, khoa] of [['vang', KHOA_BAT], ['rong', 'ban_do:\n  ngoai_git: true\n  nhanh_ve: ""\n'], ['main', 'ban_do:\n  ngoai_git: true\n  nhanh_ve: main\n']]) {
    const { r, o } = khoOrigin(khoa); const truoc = git(o, 'for-each-ref', '--format=%(refname)');
    const x = day(r); assert.equal(x.status, 2, `${ten}: ${x.stdout} ${x.stderr}`); assert.ok(x.stderr.includes('ban_do.nhanh_ve'), `${ten}: ${x.stderr}`);
    assert.equal(git(o, 'for-each-ref', '--format=%(refname)'), truoc, `${ten}: origin co ref moi`);
  }
});
test('TCG-11-vang bat ma khong khai nhanh view thi --check bao vang', () => {
  const a = pm(kho({ khoa: KHOA_BAT, views: 'ignore' }), '--check'); assert.equal(a.status, 0, a.stderr);
  assert.equal(a.stdout.split('\n').filter(l => l.includes('mất nguồn')).length, 1, a.stdout);
  const b = pm(kho({ khoa: 'ban_do:\n  ngoai_git: true\n  nhanh_ve: ban-do\n', views: 'ignore' }), '--check'); assert.equal(b.status, 0, b.stderr);
  assert.ok(!b.stdout.includes('mất nguồn'), b.stdout);
});
test('TCG-11-guide khoi BAN-DO-NHANH-VE goi dung lenh day', () => {
  const g = readFileSync(path.join(GOC, 'GUIDE.md'), 'utf8'); const m = g.match(/<!-- <<<BAN-DO-NHANH-VE -->([\s\S]*?)<!-- BAN-DO-NHANH-VE>>> -->/);
  assert.ok(m, 'GUIDE.md thieu khoi BAN-DO-NHANH-VE'); assert.ok(m[1].includes('--day-nhanh-ve'), 'khoi khong goi --day-nhanh-ve');
});
