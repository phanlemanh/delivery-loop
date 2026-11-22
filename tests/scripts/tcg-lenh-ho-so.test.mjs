// tcg-lenh-ho-so.test.mjs — hồ sơ tep-chung-khong-chan-gop (AC-7, AC-8): lệnh kiểm riêng của hồ sơ sống trong thư mục
// hồ sơ, không thêm khoá vào _acceptance/config.yaml. TCG-7-luat: khối LENH-HO-SO trùng nhau ở ba tệp luật.
// TCG-7-duong: eval khai cmd bằng đường dẫn tệp đi trọn s4-args → lớp L2 (isAuthenticVerifier, hàm evaluateEvidence gọi
// cho mọi verifier) → làn ghim lại. TCG-8-*: s4-args cảnh báo khoá config mới chỉ hồ sơ này dùng. Kho thử dựng trong
// lượt; gốc đang kiểm suy từ vị trí tệp, `TCG_GOC` ghi đè (bản sao đã tiêm của tcg-mutants).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GOC = process.env.TCG_GOC ? path.resolve(process.env.TCG_GOC) : path.resolve(HERE, '..', '..');
const AG = path.join(GOC, 'plugins', 'acceptance-gate');
const S4ARGS = path.join(GOC, 'plugins', 'feature-loop', 'scripts', 's4-args.mjs');
const LANE = path.join(GOC, 'plugins', 'feature-loop', 'scripts', 'repin-lane.mjs');
const TMP = mkdtempSync(path.join(tmpdir(), 'tcg-lenh-'));
const req = createRequire(import.meta.url);
const git = (d, ...a) => execFileSync('git', ['-C', d, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

// ── AC-7 — luật ở ba nơi ──────────────────────────────────────────────────────────────────────────────────────
const LUAT = ['plugins/feature-loop/skills/feature-loop/SKILL.md', 'plugins/acceptance-gate/skills/acceptance/SKILL.md',
  'plugins/acceptance-gate/skills/acceptance/references/eval-executors.md'];
const CAU_CU = ['cmd PHẢI là `config:` ref', '`cmd` MUST be a `config:` reference', 'Repo-specific commands MUST be `config:` references'];
const khoi = txt => { const m = txt.match(/^[ \t]*<!-- <<<LENH-HO-SO -->\n([\s\S]*?)\n[ \t]*<!-- LENH-HO-SO>>> -->/m); return m ? m[1].split('\n').map(l => l.trim()).join('\n') : null; };
test('TCG-7-luat khoi LENH-HO-SO trung nhau o ba tep, khong con cau cu', () => {
  const ban = LUAT.map(f => { const b = khoi(readFileSync(path.join(GOC, f), 'utf8')); assert.ok(b, `${f}: thieu khoi LENH-HO-SO`); return b; });
  for (let i = 1; i < ban.length; i++) assert.equal(ban[i], ban[0], `${LUAT[i]} khac ${LUAT[0]}`);
  assert.ok(ban[0].includes('_acceptance/<slug>/') && ban[0].includes('config:'), 'khoi khong noi hai noi song cua lenh');
  for (const f of LUAT) { const t = readFileSync(path.join(GOC, f), 'utf8'); for (const c of CAU_CU) assert.ok(!t.includes(c), `${f} con cau cu «${c}»`); }
});

// Kho thử: hồ sơ `demo` (và tuỳ chọn `khac`), suite một lệnh, gốc vòng = commit đầu trên main, vòng ở nhánh riêng.
function khoThu({ cfgGoc, cfgVong = null, evalsDemo, evalsKhac = null, rang = false }) {
  const d = path.join(TMP, 'r-' + Math.random().toString(36).slice(2));
  mkdirSync(path.join(d, '_acceptance', 'demo', 'rang'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'), cfgGoc);
  writeFileSync(path.join(d, 'suite.sh'), 'exit 0\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'), '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  if (evalsKhac) { mkdirSync(path.join(d, '_acceptance', 'khac'), { recursive: true }); writeFileSync(path.join(d, '_acceptance', 'khac', 'evals.yaml'), evalsKhac); }
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'goc');
  git(d, 'checkout', '-qb', 'vong');
  if (cfgVong) writeFileSync(path.join(d, '_acceptance', 'config.yaml'), cfgVong);
  if (rang) writeFileSync(path.join(d, '_acceptance', 'demo', 'rang', 'do.sh'), 'exit 0\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'), evalsDemo);
  writeFileSync(path.join(d, 'vat.js'), 'x\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'vong');
  return d;
}
const CFG = extra => `schema_version: 1\nexecutors:\n  script:\n    suite: "bash suite.sh"\n    cu: "echo cu"\n${extra}feature_loop:\n  suite_keys:\n    - executors.script.suite\n`;
const EV = cmd => `schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: ${cmd}\n    expected: xanh\n    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n`;
const s4 = d => {
  const out = path.join(d, 'args.json');
  const x = spawnSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', d, '--ag-root', AG, '--out', out, '--diff-base', 'main'], { encoding: 'utf8' });
  return { ...x, args: existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : null };
};
const canhBao = x => x.stderr.split('\n').filter(l => l.includes('cảnh báo') && l.includes('config:'));

test('TCG-7-duong eval bang duong dan tep di tron s4-args, L2, lan ghim lai', () => {
  const lenh = 'bash _acceptance/demo/rang/do.sh';
  const d = khoThu({ cfgGoc: CFG(''), evalsDemo: EV(lenh), rang: true });
  const x = s4(d); assert.equal(x.status, 0, x.stderr);
  const e1 = x.args.evals.find(e => e.id === 'E1'); assert.equal(e1.cmd, lenh); assert.ok(!('ref' in e1), 'eval duong dan khong duoc mang ref');
  const core = req(path.join(AG, 'lib', 'evidence-core.cjs'));
  const ws = path.join(d, '_acceptance', 'demo'); const cfgP = path.join(d, '_acceptance', 'config.yaml'); const cfgT = readFileSync(cfgP, 'utf8');
  assert.equal(core.isAuthenticVerifier(lenh, ws, cfgP, cfgT).ok, true, 'L2 tu choi verifier la duong dan tep co that');
  const vang = core.isAuthenticVerifier('bash _acceptance/demo/rang/khong-co.sh', ws, cfgP, cfgT);
  assert.equal(vang.ok, false); assert.match(vang.reason, /verifier script not found/);
  // Làn ghim lại: báo cáo đã ký tối thiểu, rồi chạy --write và đọc dòng repin.
  const head = git(d, 'rev-parse', 'HEAD');
  writeFileSync(path.join(ws, 'run-log.jsonl'), JSON.stringify({ ts: '2026-11-22T00:00:00Z', round: 1, evalId: 'E1', run_id: 'demo-E1-001', exit_code: 0, cmd: lenh }) + '\n');
  writeFileSync(path.join(ws, 'evidence-report.md'), `---\nschema_version: 1\nfeature_slug: demo\nverdict: PASS\nverified_commit: ${head}\nhuman_signoff: Nguoi Ky 2026-11-22\n---\n\n## Evidence\n- eval: E1\n  run_id: demo-E1-001\n  exit_code: 0\n  verifier: ${lenh}\n  verified_at: 2026-11-22\n\n## Iterations\n`);
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'evidence');
  const l = spawnSync(process.execPath, [LANE, '--root', d, '--ag-root', AG, '--slug', 'demo', '--reason', 'ca TCG-7', '--write'], { encoding: 'utf8' });
  assert.equal(l.status, 0, `lan ghim lai thoat ${l.status}: ${l.stderr.slice(-800)}`);
  const dong = readFileSync(path.join(ws, 'run-log.jsonl'), 'utf8').split('\n').filter(s => s.includes('"kind":"repin"')).map(s => JSON.parse(s)).pop();
  assert.ok(dong, 'khong co dong repin'); assert.equal(dong.evals_exit.E1, 0);
});

// ── AC-8 — cảnh báo khoá mới chỉ một hồ sơ dùng ────────────────────────────────────────────────────────────────
test('TCG-8-1 khoa moi chi ho so nay dung thi canh bao dung mot dong', () => {
  const d = khoThu({ cfgGoc: CFG(''), cfgVong: CFG('    moi: "echo moi"\n'), evalsDemo: EV('config:executors.script.moi') });
  const x = s4(d); assert.equal(x.status, 0, x.stderr); assert.ok(x.args);
  const c = canhBao(x); assert.equal(c.length, 1, `can mot dong canh bao: ${x.stderr}`);
  assert.ok(c[0].includes('E1') && c[0].includes('executors.script.moi'), c[0]);
  assert.ok(x.stderr.includes('_acceptance/<slug>/'), 'thieu cau luat lenh ho so');
});
test('TCG-8-2 khoa co tu goc vong thi im', () => {
  const d = khoThu({ cfgGoc: CFG(''), evalsDemo: EV('config:executors.script.cu') });
  const x = s4(d); assert.equal(x.status, 0, x.stderr); assert.ok(x.args); assert.equal(canhBao(x).length, 0, x.stderr);
});
test('TCG-8-3 khoa moi ma ho so khac cung dung thi im', () => {
  const d = khoThu({ cfgGoc: CFG(''), cfgVong: CFG('    chung: "echo chung"\n'), evalsDemo: EV('config:executors.script.chung'),
    evalsKhac: 'schema_version: 1\nfeature_slug: khac\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.chung\n    expected: xanh\n' });
  const x = s4(d); assert.equal(x.status, 0, x.stderr); assert.ok(x.args); assert.equal(canhBao(x).length, 0, x.stderr);
});
test('TCG-8-4 eval bang duong dan tep thi im', () => {
  const d = khoThu({ cfgGoc: CFG(''), evalsDemo: EV('bash _acceptance/demo/rang/do.sh'), rang: true });
  const x = s4(d); assert.equal(x.status, 0, x.stderr); assert.ok(x.args); assert.equal(canhBao(x).length, 0, x.stderr);
});
