#!/usr/bin/env node
// do-san.mjs — B2 AC-8 (E8s): chạy riêng các ca từng đỏ sẵn trên nhánh chuyen-nha và nói từng ca xanh hay đỏ.
//   P122, P126, P177  — bộ plugins (bash tests/plugins/run-tests.sh)
//   RT13              — tests/plugins/ra-co-ten.test.mjs (RT_CASES=RT13)
//   KT-8              — tests/scripts/kho-tri-thuc-va-lint.test.mjs
// Một ca chỉ «xanh» khi bộ của nó in đúng dòng «PASS: <mã>» và không in dòng «FAIL: <mã>»; không thấy dòng nào của ca
// thì là đỏ «không thấy ca» — vắng không bao giờ được đọc thành xanh.
// Thoát: 0 mọi ca xanh · 1 có ca đỏ (mỗi ca một dòng) · 2 không chạy được ở đây.

import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const NGUON = [
  { ten: 'bộ plugins', lenh: ['bash', ['tests/plugins/run-tests.sh']], env: {}, ca: ['P122', 'P126', 'P177'] },
  { ten: 'ra-co-ten', lenh: [process.execPath, ['tests/plugins/ra-co-ten.test.mjs']], env: { RT_CASES: 'RT13' }, ca: ['RT13'] },
  { ten: 'kho-tri-thuc', lenh: [process.execPath, ['tests/scripts/kho-tri-thuc-va-lint.test.mjs']], env: {}, ca: ['KT-8'] },
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');

// Phán một ca trên chữ của bộ chạy nó. Thuần — ca kiểm gọi thẳng.
export function phanCa(chu, ma) {
  const pass = new RegExp(`^\\s*PASS:\\s*\\[?${esc(ma)}\\]?(?![\\w-])`, 'm').test(chu);
  const fail = new RegExp(`^\\s*FAIL:\\s*\\[?${esc(ma)}\\]?(?![\\w-])`, 'm').test(chu);
  if (fail) return 'đỏ';
  if (pass) return 'xanh';
  return 'không thấy ca';
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let do_ = 0;
  for (const n of NGUON) {
    const r = spawnSync(n.lenh[0], n.lenh[1], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28, env: { ...process.env, ...n.env } });
    if (r.error) { process.stderr.write(`không chạy được ở đây: ${n.ten} (${r.error.message})\n`); process.exit(2); }
    const chu = (r.stdout || '') + (r.stderr || '');
    for (const ma of n.ca) {
      const kq = phanCa(chu, ma);
      process.stdout.write(`${ma}: ${kq}\n`);
      if (kq !== 'xanh') do_++;
    }
  }
  process.exit(do_ ? 1 : 0);
}
