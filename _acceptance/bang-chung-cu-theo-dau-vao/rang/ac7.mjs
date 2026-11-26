#!/usr/bin/env node
// AC-7 của hồ sơ bang-chung-cu-theo-dau-vao: mọi tệp vòng đổi so bản gốc vòng nằm trong danh sách cho phép, không tệp nào
// khớp risk_tiers.t3_paths (đọc từ _acceptance/config.yaml của cây đang đo). `--them <đường>` thêm một đường thử (chiều đỏ).
// Thoát 0 đạt · 1 có tệp ngoài danh sách hay khớp t3 · 2 không đo được (bản gốc vòng vắng, cấu hình không đọc được).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const GOC = '8817a5bf9e3df3ae4a3e558c37715002bc830c7c';
const SLUG = 'bang-chung-cu-theo-dau-vao';
const CHO_PHEP = [
  'plugins/feature-loop/scripts/pr-san-sang.mjs',
  'plugins/feature-loop/scripts/repin-lane.mjs',
  'plugins/feature-loop/scripts/lib/vat-doi-sau-pin.mjs',
  'plugins/feature-loop/skills/feature-loop/SKILL.md',
  'tests/workflows/**',
  'tests/scripts/**',
  'docs/**',
  'CHANGELOG.md',
  `_acceptance/${SLUG}/**`,
  'PRODUCT-MAP.md',
  'LO-TRINH.html',
  'tests/scripts/fixtures/routing-baseline.txt',
  'docs/research/known-limits-ledger.tsv',
];

const doiSo = (argv) => {
  const co = { them: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--root') co.root = argv[++i];
    else if (argv[i] === '--them') co.them.push(argv[++i]);
  }
  return co;
};
const globRe = (g) => {
  let re = '';
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === '*') {
      if (g[i + 1] === '*') { re += '.*'; i++; if (g[i + 1] === '/') i++; } else re += '[^/]*';
    } else if ('.+^$()[]{}|\\?'.includes(c)) re += `\\${c}`;
    else re += c;
  }
  return new RegExp(`^${re}$`);
};
const khop = (f, globs) => globs.some((g) => globRe(g).test(f));

function t3Paths(configText) {
  const dong = configText.split('\n');
  const i = dong.findIndex((d) => /^\s*t3_paths:\s*(#.*)?$/.test(d));
  if (i < 0) return null;
  const out = [];
  for (let j = i + 1; j < dong.length; j++) {
    const d = dong[j];
    if (!d.trim() || /^\s*#/.test(d)) continue;
    const m = /^\s*-\s*["']?([^"'#]+?)["']?\s*(#.*)?$/.exec(d);
    if (!m) break;
    out.push(m[1].trim());
  }
  return out;
}

const co = doiSo(process.argv.slice(2));
const root = path.resolve(co.root ?? '.');
const git = (...a) => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
try {
  git('cat-file', '-e', `${GOC}^{commit}`);
} catch {
  console.log(`AC-7: không đo được — bản gốc vòng ${GOC.slice(0, 8)} không có trong kho này`);
  process.exit(2);
}
let cfg;
try {
  cfg = fs.readFileSync(path.join(root, '_acceptance', 'config.yaml'), 'utf8');
} catch {
  console.log('AC-7: không đo được — không đọc được _acceptance/config.yaml');
  process.exit(2);
}
const t3 = t3Paths(cfg);
if (!t3 || !t3.length) {
  console.log('AC-7: không đo được — không đọc được risk_tiers.t3_paths');
  process.exit(2);
}
// Tệp của commit RIÊNG nhánh vòng: không gộp, không có trên origin/main — nhánh gộp main vào không kéo tệp của PR khác.
// Vắng origin/main → so bản gốc vòng. Trên main sau khi gộp, danh sách rỗng (phép đo này chỉ có nghĩa trước gộp).
let rieng;
try {
  git('rev-parse', '--verify', '-q', 'origin/main^{commit}');
  rieng = git('log', '--no-merges', '--format=', '--name-only', 'origin/main..HEAD').split('\n').filter(Boolean);
} catch {
  rieng = git('diff', '--name-only', '--no-renames', GOC, 'HEAD').split('\n').filter(Boolean);
}
const doi = [...new Set([...rieng, ...co.them])];
const ngoai = doi.filter((f) => !khop(f, CHO_PHEP));
const vaoT3 = doi.filter((f) => khop(f, t3));
if (ngoai.length || vaoT3.length) {
  if (ngoai.length) console.log(`AC-7: ${ngoai.length} tệp ngoài danh sách cho phép: ${ngoai.join(', ')}`);
  if (vaoT3.length) console.log(`AC-7: ${vaoT3.length} tệp khớp t3_paths: ${vaoT3.join(', ')}`);
  process.exit(1);
}
console.log(`AC-7: ${doi.length} tệp đổi bởi commit riêng của nhánh, tất cả trong danh sách cho phép, 0 tệp khớp t3_paths`);
