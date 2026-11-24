#!/usr/bin/env node
// rang/vung-vat.mjs — AC-9 vế (1) của hồ sơ doi-soat-ban-giao. Liệt kê tệp vòng đổi so với gốc chung của HEAD với nhánh
// chính (origin/main, rồi main) — gồm cả tệp đang sửa chưa commit — và đòi mọi tệp nằm trong danh sách cho phép.
// `--thu <đường>` thêm một đường vào danh sách đổi (chiều đỏ của chính bộ kiểm: đường ngoài danh sách phải làm nó thoát 1).
// Gốc kho mặc định suy từ vị trí tệp này (_acceptance/<slug>/rang/ → ../../..).
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const CHO_PHEP = [
  /^plugins\/dispatch\//,
  /^tests\/dieu-phoi\//,
  /^_acceptance\/doi-soat-ban-giao\//,
  /^docs\//,
  /^CONTEXT\.md$/,
  /^PRODUCT-MAP\.md$/,
  /^LO-TRINH\.html$/,
  /^tests\/scripts\/fixtures\/routing-baseline\.txt$/,
];

const git = (goc, ...a) => {
  const r = spawnSync('git', a, { cwd: goc, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : null;
};

export function tepDoi(goc) {
  let base = null;
  for (const n of ['origin/main', 'main']) {
    base = git(goc, 'merge-base', 'HEAD', n);
    if (base) break;
  }
  if (!base) throw new Error('vung-vat: không tìm được gốc chung với nhánh chính');
  const ds = new Set();
  for (const out of [git(goc, 'diff', '--name-only', base, 'HEAD'), git(goc, 'diff', '--name-only', 'HEAD'), git(goc, 'ls-files', '--others', '--exclude-standard')]) {
    for (const f of (out ?? '').split('\n').filter(Boolean)) ds.add(f);
  }
  return { base, tep: [...ds].sort() };
}

export const ngoaiDanhSach = (tep) => tep.filter((f) => !CHO_PHEP.some((re) => re.test(f)));

function main() {
  const a = process.argv.slice(2);
  const i = a.indexOf('--root');
  const goc = i >= 0 ? path.resolve(a[i + 1]) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
  const j = a.indexOf('--thu');
  const { base, tep } = tepDoi(goc);
  const tat = j >= 0 ? [...tep, a[j + 1]] : tep;
  const ngoai = ngoaiDanhSach(tat);
  if (ngoai.length) {
    for (const f of ngoai) console.log(`ngoài danh sách: ${f}`);
    console.log(`vung-vat: ${tat.length} tệp đổi so với ${base.slice(0, 8)}, ${ngoai.length} ngoài danh sách`);
    process.exit(1);
  }
  console.log(`vung-vat: ${tat.length} tệp đổi, 0 ngoài danh sách`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
