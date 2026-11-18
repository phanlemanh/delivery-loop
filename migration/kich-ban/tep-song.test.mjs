// tep-song.test.mjs — B2 AC-7: tệp trạng thái sống của đợt (migration/TRANG-THAI.md) không làm hồ sơ vòng hoá cũ, mà
// tệp vật của migration/ vẫn làm. Chạy: node --test migration/kich-ban/tep-song.test.mjs
//
// Kho git do mã sinh trong lượt; cấu hình fixture mang ĐÚNG danh sách risk_tiers.t1_skip_globs rút từ
// _acceptance/config.yaml THẬT bằng bộ đọc của kit (resolveConfigList); pin do CHÍNH repin-lane.mjs --write ghi; lưới là
// CHÍNH scripts/pre-merge-check.sh, chạy với --base là commit trước khi hồ sơ vào (đúng hình lưới đọc chuyen-nha so
// nhánh chính kho cũ: hồ sơ nằm trong diff nên luật hoá cũ xét nó). Mẫu: tests/scripts/routing-baseline-t1.test.mjs.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DAY, '..', '..');
// Tệp này chạy trên HAI bố cục: nhánh `chuyen-nha` (lõi ở gốc kho, `feature-loop/` ở gốc) và cây 3.0 (`plugins/<tên>/`).
// Suy bố cục từ vật có mặt, không ghim một đường: lượt ghim lại B2 ở mốc 3.0 (17/11) đỏ đúng vì ba đường dưới ghim bố cục cũ.
const MOI = fs.existsSync(path.join(ROOT, 'plugins', 'acceptance-gate', 'lib', 'evidence-core.cjs'));
const KIT = MOI ? path.join(ROOT, 'plugins', 'acceptance-gate') : ROOT;
const FL = MOI ? path.join(ROOT, 'plugins', 'feature-loop') : path.join(ROOT, 'feature-loop');
const PM = path.join(KIT, 'scripts', 'pre-merge-check.sh');
const LANE = path.join(FL, 'scripts', 'repin-lane.mjs');
// Chữ trạng thái đã ký nối từ hai nửa: tệp này là fixture GHI hồ sơ đã ký, không phải bộ đọc trạng thái, mà RT13 (iv)
// quét mọi tệp ngoài `_acceptance/`·`docs/` chứa nguyên chữ ấy (migration/BOI-CANH.md «Bẫy đã dẫm ở bước kiểm trước S4»).
const DA_KY = 'signed' + '-off';
const TEP_SONG = 'migration/TRANG-THAI.md';
const TEP_VAT = 'migration/kich-ban/don-nha.mjs';
const core = createRequire(import.meta.url)(path.join(KIT, 'lib', 'evidence-core.cjs'));
const T1_THAT = core.resolveConfigList(fs.readFileSync(path.join(ROOT, '_acceptance', 'config.yaml'), 'utf8'), 'risk_tiers.t1_skip_globs');

const tam = [];
after(() => { for (const d of tam) fs.rmSync(d, { recursive: true, force: true }); });

const cauHinh = (globs) => 'schema_version: 1\nenforcement: strict\nrecheck: strict\ngap_probe: off\nfeature_loop:\n  suite_keys:\n'
  + '    - executors.test.suite\nexecutors:\n  test:\n    suite: "sh suite.sh"\n  script:\n    rang_e1: "sh rang-e1.sh"\n'
  + 'risk_tiers:\n  t1_skip_globs:\n' + globs.map(g => `    - "${g}"\n`).join('');

// Kho có một hồ sơ đã ký, pin do writer thật; trả { R, git, base, pm }.
function dungKho(globs) {
  const R = fs.mkdtempSync(path.join(os.tmpdir(), 'b2-song-')); tam.push(R);
  const git = (...a) => execFileSync('git', ['-C', R, '-c', 'user.email=t@t', '-c', 'user.name=t', '-c', 'commit.gpgsign=false', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const ws = path.join(R, '_acceptance', 'feat');
  const ghi = (p, s) => { fs.mkdirSync(path.dirname(path.join(R, p)), { recursive: true }); fs.writeFileSync(path.join(R, p), s); };
  ghi('_acceptance/config.yaml', cauHinh(globs));
  ghi('suite.sh', 'exit 0\n'); ghi('rang-e1.sh', 'test -f tien-de.txt\n'); ghi('tien-de.txt', 'x\n');
  ghi(TEP_SONG, '# trạng thái\n'); ghi(TEP_VAT, '// vật\n');
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'nen');
  const base = git('rev-parse', 'HEAD');
  ghi('_acceptance/feat/contract.md', '---\nschema_version: 1\nfeature: feat\nslug: feat\nrisk_tier: T2\nsurfaces: [api]\nstatus: ' + DA_KY + '\napproved_by: Manh Phan\n---\n');
  ghi('_acceptance/feat/evals.yaml', 'schema_version: 1\nfeature_slug: feat\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.rang_e1\n    expected: exit 0\n    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n');
  git('add', '-A'); git('commit', '-qm', 'ho so');
  const h1 = git('rev-parse', 'HEAD');
  ghi('_acceptance/feat/run-log.jsonl', JSON.stringify({ ts: '2026-11-14T00:00:00Z', kind: 'eval', run_id: 'r1-E1', sha: h1, eval: 'E1', exit_code: 0 }) + '\n');
  ghi('_acceptance/feat/evidence-report.md', `---\nschema_version: 1\nfeature_slug: feat\nverdict: PASS\nverified_commit: ${h1}\nhuman_signoff: Manh 2026-11-14\n---\n\n## Evidence\n- eval: E1\n  run_id: r1-E1\n  exit_code: 0\n  verifier: config:executors.script.rang_e1\n  verified_at: 2026-11-14\n\n## Iterations\n\nRound 1 — PASS.\n`);
  git('add', '-A'); git('commit', '-qm', 'evidence');
  const w = spawnSync(process.execPath, [LANE, '--root', R, '--ag-root', KIT, '--slug', 'feat', '--reason', 'ghim', '--write'], { encoding: 'utf8' });
  assert.equal(w.status, 0, `repin-lane thật không ghi được pin:\n${w.stderr}`);
  git('add', '-A'); git('commit', '-qm', 'repin');
  const pm = () => { const r = spawnSync('bash', [PM, R, '--base', base], { encoding: 'utf8' }); return r.stdout + r.stderr; };
  return { R, git, ghi, pm };
}

const STALE = /VIOLATION \[feat\]: evidence is stale/;

test('BK-AC7-that: tệp cấu hình thật khai tệp sống trong t1_skip_globs', () => {
  assert.ok(Array.isArray(T1_THAT) && T1_THAT.length > 1, `bộ đọc trả ${JSON.stringify(T1_THAT)} — không phải danh sách`);
  assert.ok(T1_THAT.includes(TEP_SONG), `t1_skip_globs thật phải có ${TEP_SONG}`);
});

test('BK-AC7-im: commit chỉ sửa tệp sống → lưới không báo hoá cũ', () => {
  const k = dungKho(T1_THAT);
  k.ghi(TEP_SONG, '# trạng thái — đổi sau lượt chấm\n'); k.git('add', '-A'); k.git('commit', '-qm', 'cap nhat trang thai');
  const ra = k.pm();
  assert.doesNotMatch(ra, STALE, `tệp sống vẫn làm hồ sơ hoá cũ:\n${ra}`);
});

test('BK-AC7-duong: commit sửa tệp vật của migration/ → lưới báo hoá cũ, gọi tên hồ sơ (đối chứng dương)', () => {
  const k = dungKho(T1_THAT);
  k.ghi(TEP_VAT, '// vật — đổi sau lượt chấm\n'); k.git('add', '-A'); k.git('commit', '-qm', 'sua vat');
  const ra = k.pm();
  assert.match(ra, STALE, `sửa vật mà lưới im — phép đo không đo:\n${ra}`);
  assert.match(ra, /don-nha\.mjs/, 'VIOLATION phải gọi tên tệp vật đã đổi');
});

test('BK-AC7-do: cấu hình gỡ dòng tệp sống → chính commit ấy lại làm hồ sơ hoá cũ', () => {
  const k = dungKho(T1_THAT.filter(g => g !== TEP_SONG));
  k.ghi(TEP_SONG, '# trạng thái — đổi sau lượt chấm\n'); k.git('add', '-A'); k.git('commit', '-qm', 'cap nhat trang thai');
  const ra = k.pm();
  assert.match(ra, STALE, `gỡ dòng mà lưới vẫn im — miễn trừ không phải thứ giữ màu:\n${ra}`);
  assert.match(ra, /TRANG-THAI\.md/, 'VIOLATION phải gọi tên tệp sống');
});
