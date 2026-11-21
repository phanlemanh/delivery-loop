// tcg-mutants.test.mjs — hồ sơ tep-chung-khong-chan-gop (AC-10): mỗi phép đo của vòng có chiều đỏ và chiều im.
// Một bản sao trọn các thư mục vật + tệp ca dựng trong thư mục tạm; TCG-10-M0 chạy mọi ca đích trên bản sao CHƯA tiêm
// (phải xanh — đối chứng dương). Mỗi nhát thay ĐÚNG MỘT chuỗi (khớp 0 hay nhiều lần → «mui tiem truot»), chạy ca đích
// của nó với TCG_GOC = bản sao (phải ĐỎ, không thì «phep do mu»), rồi hoàn bản sao. Ba nhát không phải vật phải giữ
// mọi ca đích xanh. Đường suy từ vị trí tệp này; git hỏi ở kho thật qua TCG_GIT_GOC.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, cpSync, readFileSync, writeFileSync, readdirSync, existsSync, appendFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const BS = mkdtempSync(path.join(tmpdir(), 'tcg-mut-'));
const CHEP = ['plugins/acceptance-gate/scripts', 'plugins/acceptance-gate/lib', 'plugins/acceptance-gate/commands', 'plugins/acceptance-gate/skills',
  'plugins/feature-loop/scripts', 'plugins/feature-loop/skills', 'plugins/feature-loop/workflows', 'plugins/dispatch/scripts', 'tools',
  'tests/scripts/tcg-ban-do.test.mjs', 'tests/scripts/tcg-lenh-ho-so.test.mjs', 'tests/scripts/tcg-so-gioi-han.test.mjs',
  'tests/plugins/run-tests.sh', '.claude/settings.json', 'GUIDE.md', 'docs/research/known-limits-ledger.tsv'];
for (const c of CHEP) { mkdirSync(path.dirname(path.join(BS, c)), { recursive: true }); cpSync(path.join(KIT, c), path.join(BS, c), { recursive: true }); }
for (const d of readdirSync(path.join(KIT, '_acceptance'))) {
  const f = path.join(KIT, '_acceptance', d, 'review-findings.md');
  if (existsSync(f)) { mkdirSync(path.join(BS, '_acceptance', d), { recursive: true }); cpSync(f, path.join(BS, '_acceptance', d, 'review-findings.md')); }
}

const TEP_CA = { 'TCG-1': 'tcg-ban-do', 'TCG-3': 'tcg-ban-do', 'TCG-4': 'tcg-ban-do', 'TCG-5': 'tcg-ban-do', 'TCG-8': 'tcg-lenh-ho-so', 'TCG-9': 'tcg-so-gioi-han', 'TCG-11': 'tcg-ban-do' };
const tepCua = ca => TEP_CA[ca.match(/^TCG-\d+/)[0]];
// Tiến trình con không được thừa hưởng NODE_TEST_CONTEXT của bộ chạy cha (khi có, `node --test` con không in TAP).
const ENV_CON = (() => { const e = { ...process.env, TCG_GOC: BS, TCG_GIT_GOC: KIT }; delete e.NODE_TEST_CONTEXT; return e; })();
// Chạy MỘT ca đích trên bản sao; xanh khi thoát 0, có «# pass» ≥ 1 và không «not ok».
function chayCa(ca) {
  const x = spawnSync(process.execPath, ['--test', '--test-reporter=tap', `--test-name-pattern=^${ca}( |$)`, path.join(BS, 'tests', 'scripts', `${tepCua(ca)}.test.mjs`)],
    { encoding: 'utf8', env: ENV_CON, maxBuffer: 64 * 1024 * 1024 });
  const pass = Number((x.stdout.match(/^# pass (\d+)/m) || [])[1] || 0);
  return { xanh: x.status === 0 && pass >= 1 && !/^not ok /m.test(x.stdout), ra: x.stdout.slice(-1500) };
}
function tiem(tep, tu, den, f) {
  const p = path.join(BS, tep); const goc = readFileSync(p, 'utf8');
  const k = goc.split(tu).length - 1; assert.equal(k, 1, `mui tiem truot: «${tu.slice(0, 60)}» khop ${k} lan trong ${tep}`);
  writeFileSync(p, goc.replace(tu, den));
  try { return f(); } finally { writeFileSync(p, goc); }
}

const PM = 'plugins/acceptance-gate/scripts/product-map.mjs';
const WR = 'plugins/acceptance-gate/lib/workspace-record.cjs';
const SCAN = 'plugins/acceptance-gate/scripts/start-scan.mjs';
const NHAT = [
  ['bo-kiem-chi-muc', PM, 'if (theoDoi.status === 0) { loi.push(', 'if (false) { loi.push(', 'TCG-3-1'],
  ['bo-kiem-ignore', PM, "if (gitRc(root, ['check-ignore', '-q', '--', v]).status !== 0) loi.push(", 'if (false) loi.push(', 'TCG-3-3'],
  ['tat-di-nhanh-moi', PM, 'if (check && bd.ngoaiGit) {', 'if (check && (bd.ngoaiGit || true)) {', 'TCG-1'],
  ['khoa-sai-la-tat', WR, 'loi: `ban_do.ngoai_git phải là true hoặc false', 'loi: null, x: `ban_do.ngoai_git phải là true hoặc false', 'TCG-5-dang'],
  ['them-vo-dieu-kien', 'plugins/acceptance-gate/commands/approve.md', 'if [ -f "$f" ] && ! git check-ignore -q -- "$f"; then', 'if [ -f "$f" ]; then', 'TCG-4-bat'],
  ['quet-tra-da-xoa', SCAN, 'ngoaiGit: bd.ngoaiGit, khoaSai', 'ngoaiGit: false, khoaSai', 'TCG-5-bat'],
  ['quet-doc-khoa-rieng', SCAN, 'const bd = banDo(cfgRead.t);', "const bd = { ngoaiGit: /ngoai_git: true\\s*$/m.test(cfgRead.t || ''), loi: null };", 'TCG-5-dang'],
  ['bo-so-goc', 'plugins/feature-loop/scripts/s4-args.mjs', 'if (resolveConfigKey(cfgGoc, khoa) || khacDung(khoa)) continue;', 'if (khacDung(khoa)) continue;', 'TCG-8-2'],
  ['ghi-de-hang-cu', 'tools/so-gioi-han.mjs', "writeFileSync(soP, (so.endsWith('\\n') ? so : so + '\\n') + moi.join('\\n') + '\\n');", "writeFileSync(soP, so.split('\\n').slice(0, 1).join('\\n') + '\\n' + moi.join('\\n') + '\\n');", 'TCG-9-them'],
  ['them-khi-du', 'tools/so-gioi-han.mjs', 'if (thieu <= 0) return', 'if (thieu < 0) return', 'TCG-9-lai'],
  ['dem-nham-slug', 'tools/so-gioi-han.mjs', 'const cua = hangs.filter(c => c[1] === slug);', 'const cua = hangs.filter(c => c[1].startsWith(slug));', 'TCG-9-slug'],
  ['moc-moi-tep', 'tools/so-gioi-han.mjs', 'review-findings\\.md$/); if (!m) return;', '[\\w.-]+$/); if (!m) return;', 'TCG-9-moc'],
  ['day-khi-khong-doi', PM, '=== cay) return { code: 0', '=== cay && false) return { code: 0', 'TCG-11-lai'],
  ['day-nhanh-mac-dinh', PM, 'if (bd.nhanhVe === macDinh) return { code: 2', 'if (false) return { code: 2', 'TCG-11-khoa'],
];
const DICH = [...new Set(NHAT.map(n => n[4]))];

test('TCG-10-M0 ban sao chua tiem: moi ca dich xanh', () => {
  for (const ca of DICH) { const r = chayCa(ca); assert.ok(r.xanh, `doi chung duong do: ${ca}\n${r.ra}`); }
});
for (const [ten, tep, tu, den, ca] of NHAT) {
  test(`TCG-10-${ten} nhat tiem lam ${ca} do`, () => {
    const r = tiem(tep, tu, den, () => chayCa(ca));
    assert.ok(!r.xanh, `phep do mu: ${ca} van xanh khi tiem ${ten}`);
  });
}
const IM = [
  ['im-chu-thich', () => { const p = path.join(BS, PM); const g = readFileSync(p, 'utf8'); writeFileSync(p, g.replace('\n', '\n// chu thich im (tcg-mutants)\n')); return () => writeFileSync(p, g); }],
  ['im-tai-lieu', () => { const p = path.join(BS, 'GUIDE.md'); const g = readFileSync(p, 'utf8'); appendFileSync(p, '\nDòng tài liệu thêm, không phải vật.\n'); return () => writeFileSync(p, g); }],
  ['im-ho-so-rong', () => { const d = path.join(BS, '_acceptance', 'tcg-im-rong'); mkdirSync(d, { recursive: true }); writeFileSync(path.join(d, 'review-findings.md'), '# Review findings\n\n## Ngoài hợp đồng\n\nKhông có mục nào.\n'); return () => rmSync(d, { recursive: true, force: true }); }],
];
for (const [ten, lam] of IM) {
  test(`TCG-10-${ten} nhat khong phai vat giu moi ca dich xanh`, () => {
    const hoan = lam();
    try { for (const ca of DICH) { const r = chayCa(ca); assert.ok(r.xanh, `chieu im hong: ${ca} do khi ${ten}\n${r.ra}`); } } finally { hoan(); }
  });
}
