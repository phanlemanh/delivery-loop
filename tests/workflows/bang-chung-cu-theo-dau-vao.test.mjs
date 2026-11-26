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
