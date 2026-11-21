// tcg-so-gioi-han.test.mjs — hồ sơ tep-chung-khong-chan-gop (AC-9): bộ sinh hàng sổ giới hạn (tools/so-gioi-han.mjs) và
// móc PostToolUse của kho kit làm P179 thôi đốt lượt chấm. Gốc tạm mang bản sao mọi `_acceptance/*/review-findings.md` và
// sổ thật, đưa về trạng thái KHỚP (số hàng = số mục, đo trong lượt — không hằng nào rút từ sổ thật). Khối P179 rút
// NGUYÊN VĂN từ heredoc P179PY của tests/plugins/run-tests.sh. Gốc đang kiểm suy từ vị trí tệp, `TCG_GOC` ghi đè.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, appendFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GOC = process.env.TCG_GOC ? path.resolve(process.env.TCG_GOC) : path.resolve(HERE, '..', '..');
const TOOL = path.join(GOC, 'tools', 'so-gioi-han.mjs');
const SO = 'docs/research/known-limits-ledger.tsv';
const MUC = /Đề xuất:\s*known-limits/g;
const TMP = mkdtempSync(path.join(tmpdir(), 'tcg-so-'));
let n = 0;

const p179 = () => {
  const t = readFileSync(path.join(GOC, 'tests', 'plugins', 'run-tests.sh'), 'utf8');
  const m = t.match(/<<'P179PY'\n([\s\S]*?)\nP179PY\n/); assert.ok(m, 'khong rut duoc khoi P179 tu run-tests.sh'); return m[1];
};
const chayP179 = root => spawnSync('python3', ['-', root], { input: p179(), encoding: 'utf8' });
const dongSo = root => readFileSync(path.join(root, SO), 'utf8').replace(/\n$/, '').split('\n').length - 1;
const muc = (tieuDe, de = 'known-limits') => `- **${tieuDe}**\n  Người dùng thấy gì: x\n  Căn cứ: y\n  file: \`a.js\`\n  severity: medium\n  Đề xuất: ${de}\n`;
const hoSo = (root, slug, items) => { mkdirSync(path.join(root, '_acceptance', slug), { recursive: true }); writeFileSync(path.join(root, '_acceptance', slug, 'review-findings.md'), `# Review findings\n\n## Ngoài hợp đồng\n\n${items.join('\n')}`); };
const hang = (slug, id) => `${slug}#${id}\t${slug}\tlow\tchua-xep\tsong\t\t\tsẵn có\n`;
// Gốc tạm khớp: bản sao review-findings + sổ; bên nào thiếu được bù bằng mục/hàng đếm (hồ sơ `dem-khop`).
function gocKhop() {
  const r = path.join(TMP, `goc-${++n}`); mkdirSync(path.join(r, 'docs', 'research'), { recursive: true });
  copyFileSync(path.join(GOC, SO), path.join(r, SO));
  let k = 0;
  for (const d of readdirSync(path.join(GOC, '_acceptance'))) {
    const f = path.join(GOC, '_acceptance', d, 'review-findings.md'); if (!existsSync(f)) continue;
    mkdirSync(path.join(r, '_acceptance', d), { recursive: true }); copyFileSync(f, path.join(r, '_acceptance', d, 'review-findings.md'));
    k += (readFileSync(f, 'utf8').match(MUC) || []).length;
  }
  const h = dongSo(r);
  if (h < k) for (let i = 0; i < k - h; i++) appendFileSync(path.join(r, SO), hang('dem-khop', `bu-${i}`));
  if (k < h) hoSo(r, 'dem-khop', Array.from({ length: h - k }, (_, i) => muc(`mục bù ${i}`)));
  assert.equal(chayP179(r).status, 0, 'tien de: goc tam khop ma P179 do');
  return r;
}
const sinh = (root, slug) => spawnSync(process.execPath, [TOOL, '--root', root, '--slug', slug, '--write'], { encoding: 'utf8' });

test('TCG-9-p179 so thieu hang thi P179 do va chi lenh bo sinh', () => {
  const r = gocKhop(); hoSo(r, 'tcg-thu', [muc('một'), muc('hai')]);
  const x = chayP179(r); assert.notEqual(x.status, 0, 'P179 phai do');
  assert.ok((x.stdout + x.stderr).includes('quan he >= vo'), x.stderr); assert.ok((x.stdout + x.stderr).includes('tools/so-gioi-han.mjs'), x.stderr);
});
test('TCG-9-them bo sinh them dung k-h hang, giu hang cu, P179 xanh tren cung goc', () => {
  const r = gocKhop(); hoSo(r, 'tcg-thu', [muc('một'), muc('hai\tcó tab'), muc('ba'), muc('bốn', 'new-contract')]);
  appendFileSync(path.join(r, SO), hang('tcg-thu', 'san-1'));
  assert.notEqual(chayP179(r).status, 0, 'tien de: P179 phai do truoc bo sinh');
  const truoc = readFileSync(path.join(r, SO), 'utf8'); const h0 = dongSo(r);
  const x = sinh(r, 'tcg-thu'); assert.equal(x.status, 0, x.stderr);
  const sau = readFileSync(path.join(r, SO), 'utf8');
  assert.ok(sau.startsWith(truoc), 'hang cu bi doi'); assert.equal(dongSo(r), h0 + 2);
  const moi = sau.slice(truoc.length).replace(/\n$/, '').split('\n');
  for (const l of moi) { const c = l.split('\t'); assert.equal(c.length, 8, `hang sai so cot: ${l}`); assert.equal(c[1], 'tcg-thu'); assert.equal(c[4], 'song'); }
  const p = chayP179(r); assert.equal(p.status, 0, p.stdout + p.stderr); assert.match(p.stdout, /P179 DUONG-OK/);
});
test('TCG-9-slug khong dem hang cua ho so ten gan', () => {
  const r = gocKhop(); hoSo(r, 'a', [muc('một')]); hoSo(r, 'a-b', [muc('x'), muc('y')]);
  appendFileSync(path.join(r, SO), hang('a-b', '1') + hang('a-b', '2'));
  const h0 = dongSo(r); assert.equal(sinh(r, 'a').status, 0); assert.equal(dongSo(r), h0 + 1);
});
test('TCG-9-lai chay lan hai khong doi byte', () => {
  const r = gocKhop(); hoSo(r, 'tcg-thu', [muc('một'), muc('hai')]); assert.equal(sinh(r, 'tcg-thu').status, 0);
  const a = readFileSync(path.join(r, SO), 'utf8'); assert.equal(sinh(r, 'tcg-thu').status, 0); assert.equal(readFileSync(path.join(r, SO), 'utf8'), a);
});
test('TCG-9-rong ho so khong muc thi so khong doi', () => {
  const r = gocKhop(); hoSo(r, 'tcg-thu', [muc('một', 'wont-fix')]); const a = readFileSync(path.join(r, SO), 'utf8');
  assert.equal(sinh(r, 'tcg-thu').status, 0); assert.equal(readFileSync(path.join(r, SO), 'utf8'), a);
});
test('TCG-9-moc moc rut tu settings bat dung tep review-findings', () => {
  const s = JSON.parse(readFileSync(path.join(GOC, '.claude', 'settings.json'), 'utf8'));
  const moc = ((s.hooks || {}).PostToolUse || []).find(h => (h.hooks || []).some(x => /so-gioi-han\.mjs/.test(x.command || '')));
  assert.ok(moc, '.claude/settings.json thieu moc PostToolUse goi so-gioi-han.mjs');
  const re = new RegExp(`^(?:${moc.matcher})$`); assert.ok(re.test('Write') && re.test('Edit'), `matcher «${moc.matcher}» khong khop Write va Edit`);
  const lenh = moc.hooks.find(x => /so-gioi-han\.mjs/.test(x.command)).command;
  const goi = (input, cwd) => spawnSync('bash', ['-c', lenh], { input: JSON.stringify(input), encoding: 'utf8', cwd, env: { ...process.env, CLAUDE_PROJECT_DIR: GOC } });
  const r = gocKhop(); hoSo(r, 'tcg-thu', [muc('một'), muc('hai')]); const h0 = dongSo(r);
  const tep = path.join(r, '_acceptance', 'tcg-thu', 'review-findings.md');
  const a = goi({ hook_event_name: 'PostToolUse', tool_name: 'Write', cwd: r, tool_input: { file_path: tep } }, r);
  assert.equal(a.status, 0, a.stderr); assert.equal(dongSo(r), h0 + 2);
  const j = JSON.parse(a.stdout); assert.match(j.hookSpecificOutput.additionalContext, /2/); assert.equal(j.hookSpecificOutput.hookEventName, 'PostToolUse');
  const r2 = gocKhop(); hoSo(r2, 'tcg-thu', [muc('một')]); const h2 = dongSo(r2);
  const b = goi({ tool_name: 'Edit', cwd: r2, tool_input: { file_path: '_acceptance/tcg-thu/review-findings.md' } }, r2);
  assert.equal(b.status, 0, b.stderr); assert.equal(dongSo(r2), h2 + 1, 'duong tuong doi theo cwd khong duoc nhan');
  // Tệp khác trên một gốc CÒN THIẾU hàng: móc phải im — gốc đã đủ hàng thì móc chạy nhầm cũng không đổi gì.
  const r3 = gocKhop(); hoSo(r3, 'tcg-thu', [muc('một'), muc('hai')]); const c0 = readFileSync(path.join(r3, SO), 'utf8');
  const c = goi({ tool_name: 'Write', cwd: r3, tool_input: { file_path: path.join(r3, '_acceptance', 'tcg-thu', 'contract.md') } }, r3);
  assert.equal(c.status, 0); assert.equal(c.stdout, ''); assert.equal(readFileSync(path.join(r3, SO), 'utf8'), c0);
});
