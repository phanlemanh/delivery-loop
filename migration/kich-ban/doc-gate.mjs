#!/usr/bin/env node
// doc-gate.mjs — đọc các BƯỚC KIỂM của việc `tests` trong .github/workflows/gate.yml (B2 AC-4).
//
// Bước kiểm = bước của việc `tests` có `run:`, chạy khi đẩy lên nhánh chính (không có `if:` hoặc `if:` nhắc 'push'),
// và không phải bước cài đặt (lệnh mở đầu `sudo`, `apt-get`, `npm ci`, `brew`). Định nghĩa bộ kiểm này là của đo thử B0
// (migration/b0/chay.sh: «các bước của lượt kiểm tự động (gate.yml, việc «tests»)»), đọc từ chính cây được đo để cây mới
// được đo bằng lệnh của chính nó.
//
// Mỗi bước: { ten, lenh, loai } — ten suy từ lệnh (bash tests/<x>/run-tests.sh → <x>; node --test … tests/<x>/ → <x>;
// product-map.mjs → ban-do; khác → buoc-<thứ tự>); loai: bash (bộ ghi bảng thời gian từng ca) · tap (node --test) ·
// mot-khoa (cả bước là một khoá, đạt khi thoát 0).
//
// Dùng: node doc-gate.mjs <tệp gate.yml>   → mỗi bước một dòng «ten<TAB>loai<TAB>lệnh (\n thành ⏎)»
// Thoát: 0 · 1 «không đọc được việc tests: <lý do>».

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CAI_DAT = /^\s*(sudo\b|apt-get\b|npm ci\b|brew\b)/;

export function docGate(chu) {
  const dong = chu.split('\n');
  const thut = (d) => d.length - d.trimStart().length;
  const iJobs = dong.findIndex(d => /^jobs:\s*$/.test(d));
  if (iJobs < 0) throw new Error('không đọc được việc tests: không có khối jobs');
  const iTests = dong.findIndex((d, i) => i > iJobs && /^ {2}tests:\s*$/.test(d));
  if (iTests < 0) throw new Error('không đọc được việc tests: không có việc tests');
  let het = dong.findIndex((d, i) => i > iTests && /^ {2}\S/.test(d));
  if (het < 0) het = dong.length;
  const iSteps = dong.findIndex((d, i) => i > iTests && i < het && /^ {4}steps:\s*$/.test(d));
  if (iSteps < 0) throw new Error('không đọc được việc tests: việc tests không có steps');
  const buoc = [];
  let cur = null;
  for (let i = iSteps + 1; i < het; i++) {
    const d = dong[i];
    if (/^\s*#/.test(d) || !d.trim()) continue;
    const m = d.match(/^( {6})- (.*)$/);
    const noiDung = m ? m[2] : (thut(d) >= 8 ? d.slice(8) : null);
    if (m) { cur = {}; buoc.push(cur); }
    if (!cur || noiDung === null) continue;
    const kv = noiDung.match(/^([A-Za-z_-]+):\s?(.*)$/);
    if (!kv) continue;
    const [, khoa, gt] = kv;
    if (khoa === 'run' && gt.trim() === '|') {
      const khoi = [];
      while (i + 1 < het && (thut(dong[i + 1]) >= 10 || !dong[i + 1].trim())) { i++; khoi.push(dong[i].slice(10)); }
      while (khoi.length && !khoi[khoi.length - 1].trim()) khoi.pop();
      cur.run = khoi.join('\n');
    } else if (!(khoa in cur)) cur[khoa] = gt.trim();
  }
  const kiem = buoc.filter(b => b.run !== undefined && (!b.if || /push/.test(b.if)) && !CAI_DAT.test(b.run));
  if (!kiem.length) throw new Error('không đọc được việc tests: không có bước kiểm nào');
  const ten = new Set();
  return kiem.map((b, k) => {
    const lenh = b.run;
    let t; let loai = 'mot-khoa';
    let m;
    if ((m = lenh.match(/^bash tests\/([\w-]+)\/run-tests\.sh\s*$/))) { t = m[1]; loai = 'bash'; }
    else if (/^node --test\b/.test(lenh) && /--test-reporter=tap/.test(lenh) && (m = lenh.match(/tests\/([\w-]+)\//))) { t = m[1]; loai = 'tap'; }
    else if (/product-map\.mjs/.test(lenh)) t = 'ban-do';
    else t = `buoc-${k + 1}`;
    if (ten.has(t)) throw new Error(`không đọc được việc tests: hai bước cùng tên ${t}`);
    ten.add(t);
    return { ten: t, lenh, loai };
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    for (const b of docGate(fs.readFileSync(process.argv[2], 'utf8'))) process.stdout.write(`${b.ten}\t${b.loai}\t${b.lenh.replace(/\n/g, '⏎')}\n`);
  } catch (e) { process.stderr.write(`doc-gate: ${e.message}\n`); process.exit(1); }
}
