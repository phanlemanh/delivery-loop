// fixture-bo-kiem.mjs — dựng «cây» giả cho ca kiểm thước giữ khoá (giu-khoa.test.mjs) và báo cáo lớp đỏ (lop-do.test.mjs).
//
// Mỗi cây có .github/workflows/gate.yml (việc tests, bước cài bị bỏ qua, một việc khác không thuộc tests), một bộ bash giả
// nạp CHÍNH tests/bo-chay.sh của kho (bên viết thật của bảng thời gian từng ca), tệp ca chạy bằng `node --test` thật, và
// bước bản đồ một-khoá. Lượt chạy là CHÍNH chay-bo-kiem.sh. Không tệp kết quả nào viết tay.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DAY, '..', '..');
const CHAY = path.join(DAY, 'chay-bo-kiem.sh');

export function moTamCho(tam) { return (t = 'gk-') => { const d = fs.mkdtempSync(path.join(os.tmpdir(), t)); tam.push(d); return d; }; }
const ghi = (goc, p, s) => { fs.mkdirSync(path.dirname(path.join(goc, p)), { recursive: true }); fs.writeFileSync(path.join(goc, p), s); };

export const GATE = (them = '') => [
  'name: gate', 'on: [push]', 'jobs:', '  tests:', '    name: tests', '    runs-on: ubuntu-latest', '    steps:',
  '      - uses: actions/checkout@v7', '        if: github.event_name == \'push\'',
  '      - name: cài zsh', '        if: github.event_name == \'push\'', '        run: sudo apt-get install -y zsh',
  '      - name: ka suite', '        if: github.event_name == \'push\'', '        run: bash tests/ka/run-tests.sh',
  '      - name: dp suite', '        if: github.event_name == \'push\'', '        run: node --test --test-reporter=tap "tests/dp/**/*.test.mjs"',
  '      - name: ban do', '        if: github.event_name == \'push\'', '        run: node tests/product-map.mjs --root . --check',
  them, '  khac:', '    runs-on: ubuntu-latest', '    steps:', '      - run: bash tests/khong-phai.sh', ''].join('\n');

// Bộ bash giả: `ca` = mảng [kết, tên] — kết null là một dòng thô (lỗi in trước dòng kết quả, tiêu đề khối);
// `chetSau` = chỉ số phần tử mà bộ thoát 1 ngay trước; `imLang` = thoát 1 không in dòng kết quả nào.
const shq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;
const boBash = (ca, chetSau, imLang) => ['#!/usr/bin/env bash', 'HERE="$(cd "$(dirname "$0")" && pwd)"',
  '. "$HERE/../bo-chay.sh"', 'bc_tg_mo ka all "$HERE/../.."', ...(imLang ? ['bc_tg_dong', 'exit 1'] : []),
  ...ca.flatMap(([k, t], i) => [...(chetSau !== null && i === chetSau ? ['exit 1'] : []),
    k === null ? `printf '%s\\n' ${shq(t)}` : `printf '%s\\n' ${shq(`  ${k}: ${t}`)}`]),
  'bc_tg_dong', `exit ${ca.some(([k]) => k === 'FAIL') ? 1 : 0}`, ''].join('\n');
const tepNode = (ten, skip = []) => ["import { test } from 'node:test';",
  ...ten.map(t => skip.includes(t) ? `test(${JSON.stringify(t)}, { skip: true }, () => {});`
    : `test(${JSON.stringify(t)}, async (c) => { await c.test('con', () => {}); });`), ''].join('\n');

export function dungCay(moTam, { ka = [['PASS', 'A01 dau'], ['PASS', 'A02 hai'], ['PASS', 'A03 ba']], dp = ['DP-1 mot', 'DP-2 hai'], skip = [], banDo = 0, chetSau = null, imLang = false, them = '' } = {}) {
  const c = path.join(moTam('gk-cay-'), 'delivery-loop');
  ghi(c, '.github/workflows/gate.yml', GATE(them));
  ghi(c, 'tests/bo-chay.sh', fs.readFileSync(path.join(ROOT, 'tests', 'bo-chay.sh'), 'utf8'));
  ghi(c, 'tests/ka/run-tests.sh', boBash(ka, chetSau, imLang));
  ghi(c, 'tests/dp/a.test.mjs', tepNode(dp, skip));
  ghi(c, 'tests/product-map.mjs', `process.exit(${banDo});\n`);
  ghi(c, 'tests/khong-phai.sh', 'exit 9\n');
  return c;
}

export function chayCay(moTam, cay) {
  const out = moTam('gk-out-');
  const r = spawnSync('bash', [CHAY, cay, out], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`chay-bo-kiem.sh hỏng: ${r.stderr}`);
  return out;
}
