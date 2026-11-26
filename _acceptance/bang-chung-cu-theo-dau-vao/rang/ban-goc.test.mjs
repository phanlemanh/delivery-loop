// Ca so với BẢN GỐC VÒNG (8817a5bf) của hồ sơ bang-chung-cu-theo-dau-vao — chỉ chạy ở lượt chấm qua rang/chay.sh, không
// vào bộ kiểm của kit (không đóng băng thông điệp của pr-san-sang trên main, không đỏ ở bản clone nông của CI).
// Kho đo sinh trong thư mục tạm; mọi đường suy từ vị trí tệp này. Thiếu bản gốc vòng → ca ĐỎ có tên, không bỏ qua.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GOC = '8817a5bf9e3df3ae4a3e558c37715002bc830c7c';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..', '..');
const AG = path.join(KIT, 'plugins', 'acceptance-gate');
const PSS_MOI = path.join(KIT, 'plugins', 'feature-loop', 'scripts', 'pr-san-sang.mjs');
const SKILL = path.join(KIT, 'plugins', 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const tam = (p) => fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), p)));
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ghi = (k, f, t) => {
  fs.mkdirSync(path.dirname(path.join(k, f)), { recursive: true });
  fs.writeFileSync(path.join(k, f), t);
};

function banGoc() {
  const r = spawnSync('git', ['-C', KIT, 'show', `${GOC}:plugins/feature-loop/scripts/pr-san-sang.mjs`], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`không có bản gốc vòng ${GOC.slice(0, 8)} trong kho này — ca không đo được`);
  const f = path.join(tam('bcg-'), 'pr-san-sang.mjs');
  fs.writeFileSync(f, r.stdout);
  return f;
}

// Kho tối thiểu: không config (không T1, không stale_scope), một hồ sơ s với verified_commit = commit vật.
function kho({ status = 'verified', doi = {} } = {}) {
  const goc = tam('bcgk-');
  const origin = path.join(goc, 'o.git');
  git(goc, 'init', '-q', '--bare', '-b', 'main', origin);
  const k = path.join(goc, 'k');
  git(goc, 'clone', '-q', origin, k);
  git(k, 'checkout', '-q', '-b', 'main');
  ghi(k, 'src/a.ts', '1\n');
  ghi(k, 'src/b.ts', '1\n');
  git(k, 'add', '-A');
  git(k, 'commit', '-q', '-m', 'goc');
  git(k, 'push', '-q', 'origin', 'main');
  git(k, 'checkout', '-q', '-b', 'vong/s');
  ghi(k, 'src/a.ts', '2\n');
  git(k, 'add', '-A');
  git(k, 'commit', '-q', '-m', 'vat');
  const pin = git(k, 'rev-parse', 'HEAD');
  ghi(k, '_acceptance/s/contract.md', `---\nfeature: Phiếu công ty hai cột\nslug: s\nstatus: ${status}\n---\n`);
  ghi(k, '_acceptance/s/evidence-report.md', `---\nverdict: PASS\nverified_commit: ${pin}\n---\n`);
  git(k, 'add', '-A');
  git(k, 'commit', '-q', '-m', 'goi bang chung');
  if (Object.keys(doi).length) {
    for (const [f, t] of Object.entries(doi)) ghi(k, f, t);
    git(k, 'add', '-A');
    git(k, 'commit', '-q', '-m', 'doi sau pin');
  }
  return { k, origin };
}
function ghTrenPath() {
  const d = tam('bcggh-');
  const log = path.join(d, 'goi.txt');
  fs.writeFileSync(log, '');
  fs.writeFileSync(path.join(d, 'gh'), `#!/bin/sh\necho "$1 $2" >> "${log}"\n[ "$2" = view ] && { echo 'no pull requests found' >&2; exit 1; }\nexit 0\n`, { mode: 0o755 });
  return { env: { ...process.env, PATH: `${d}:${process.env.PATH}` }, goi: () => fs.readFileSync(log, 'utf8').split('\n').filter(Boolean) };
}
const nhanhTrenOrigin = (origin) => spawnSync('git', ['rev-parse', '--verify', '-q', 'refs/heads/vong/s'], { cwd: origin, encoding: 'utf8' }).stdout.trim();
const chay = (lenh, k, them, env) => spawnSync(process.execPath, [lenh, '--root', k, '--slug', 's', '--base', 'main', ...them], { encoding: 'utf8', env });

test('BC-4 kho không khai → thông điệp bằng bản gốc vòng', () => {
  const goc = banGoc();
  const a = kho({ doi: { 'src/b.ts': '2\n' } });
  const b = kho({ doi: { 'src/b.ts': '2\n' } });
  const rGoc = chay(goc, a.k, [], ghTrenPath().env);
  const rMoi = chay(PSS_MOI, b.k, ['--ag-root', AG], ghTrenPath().env);
  assert.equal(rGoc.status, 2, rGoc.stderr);
  assert.equal(rMoi.status, 2, rMoi.stderr);
  assert.equal(rMoi.stderr, rGoc.stderr, 'thông điệp phải bằng từng byte bản gốc vòng');
  assert.match(rMoi.stderr, /vật đổi sau lượt chấm \(src\/b\.ts\)/);
  assert.doesNotMatch(rMoi.stderr + rMoi.stdout, /paths/);
});

test('BC-4-doi-chung cây bằng pin → cả hai bản không thoát 2', () => {
  const goc = banGoc();
  const a = kho();
  const b = kho();
  const rGoc = chay(goc, a.k, [], ghTrenPath().env);
  const rMoi = chay(PSS_MOI, b.k, ['--ag-root', AG], ghTrenPath().env);
  assert.notEqual(rGoc.status, 2, rGoc.stderr);
  assert.notEqual(rMoi.status, 2, rMoi.stderr);
});

// AC-5 chiều đỏ: lệnh rút từ khối STALE-GUARD của SKILL ở cây đang đo, chạy trên pr-san-sang của BẢN GỐC VÒNG (chưa có
// --chi-xet) → hồ sơ signed-off bằng pin KHÔNG được thoát 0; bản gốc dừng ở luật «cần verified», không đẩy, không gọi gh.
test('BC-5-ban-goc lệnh trên bản gốc vòng → không thoát 0', () => {
  const goc = banGoc();
  const khoi = /<!-- <<<STALE-GUARD -->\n([\s\S]*?)<!-- STALE-GUARD>>> -->/.exec(fs.readFileSync(SKILL, 'utf8'))?.[1];
  assert.ok(khoi, 'không thấy khối STALE-GUARD');
  const lenh = khoi.split('\n').find((d) => d.startsWith('node '));
  assert.ok(lenh && lenh.includes('"$WORKFLOWS_DIR/../scripts/pr-san-sang.mjs"'), 'khối STALE-GUARD thiếu dòng lệnh');
  const { k, origin } = kho({ status: 'signed-off' });
  const gh = ghTrenPath();
  const r = spawnSync('bash', ['-c', `${lenh.replace('"$WORKFLOWS_DIR/../scripts/pr-san-sang.mjs"', JSON.stringify(goc)).replace('<slug>', 's')} --ag-root ${JSON.stringify(AG)}`], { cwd: k, encoding: 'utf8', env: gh.env });
  assert.notEqual(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stderr, /cần verified/);
  assert.equal(nhanhTrenOrigin(origin), '');
  assert.deepEqual(gh.goi(), []);
});
