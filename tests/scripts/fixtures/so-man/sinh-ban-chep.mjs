#!/usr/bin/env node
// Sinh các mẫu «ban-chep» cho tests/scripts/so-man.test.mjs bằng lệnh đọc màn THẬT — hồ sơ dac-ta-ux-doc-so-man.
//
//   node tests/scripts/fixtures/so-man/sinh-ban-chep.mjs --goi <thư mục gói thiết kế> [--ghi]
//
// <thư mục gói thiết kế> là thư mục plugin chứa `templates/tools/design-assembly/` (lệnh đọc và các mô-đun nó nạp).
// Mỗi hình dạng: một kho bỏ đi trong mktemp, chép nguyên thư mục lệnh đọc vào `tools/design-assembly/`, viết sổ màn
// (+ bảng trạng thái khi hình dạng có), chạy lệnh thật, giữ `{ exit, json }`. Không có `--ghi` thì chỉ so với tệp
// đang có và thoát 1 khi lệch — dùng để biết mẫu còn khớp bản gói mới hay không. Bài kiểm KHÔNG chạy tệp này.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const a = process.argv.slice(2);
const goi = a[a.indexOf('--goi') + 1];
const GHI = a.includes('--ghi');
if (!a.includes('--goi') || !goi || !existsSync(path.join(goi, 'templates/tools/design-assembly/screen-facts.mjs'))) {
  process.stderr.write('cách dùng: sinh-ban-chep.mjs --goi <thư mục plugin có templates/tools/design-assembly/> [--ghi]\n');
  process.exit(2);
}
const phienBan = JSON.parse(readFileSync(path.join(goi, '.claude-plugin/plugin.json'), 'utf8')).version;

// Sổ màn dạng một tệp, kiểu khối như khuôn của gói. `entry`/`actions` có mặt ở mọi màn để `keys_not_found` rỗng,
// trừ hình dạng «khoa-rieng» bỏ hai khoá ấy.
const man = (id, route, title, states, coKhoa = true) => [
  `  - id: ${id}`,
  `    route: ${route}`,
  `    title: ${title}`,
  '    family: null',
  '    status: built',
  states.length ? '    states:' : '    states: []',
  ...states.map(s => `      - ${s}`),
  ...(coKhoa ? ['    entry: null', '    actions: []'] : []),
];
const so = coKhoa => ['version: 1', 'screens:',
  ...man('overdue', '/overdue', 'overdueTitle', ['loading', 'empty', 'error', 'list'], coKhoa),
  ...man('don', '/don', 'donTitle', ['loading', 'empty', 'error'], coKhoa),
  ...man('don-hang', '/don-hang', 'donHangTitle', ['loading', 'error', 'chi-tiet'], coKhoa),
  ...man('ho-so', '/ho-so', 'hoSoTitle', ['xem'], coKhoa),
  ...man('trong', '/trong', 'trongTitle', [], coKhoa),
  ...man('tổng-quan', '/tong-quan', 'tongQuanTitle', ['loading', 'empty', 'error'], coKhoa),
].join('\n') + '\n';
const BANG = JSON.stringify({ required: ['loading', 'empty', 'error'], exempt: { '/ho-so': 'trang tĩnh, không tải dữ liệu' } }, null, 2) + '\n';

const HINH = [
  { tep: 'goc.json', so: so(true), bang: BANG, hoi: [] },
  { tep: 'khong-bang.json', so: so(true), bang: null, hoi: [] },
  { tep: 'khoa-rieng.json', so: so(false), bang: BANG, hoi: [] },
  { tep: 'thoat-1.json', so: so(true), bang: BANG, hoi: ['overdue,khong-co'] },
  { tep: 'theo-duong.json', so: so(true), bang: BANG, hoi: ['/don-hang,don'] },
];

let lech = 0;
for (const h of HINH) {
  const kho = mkdtempSync(path.join(os.tmpdir(), 'so-man-ban-chep-'));
  try {
    cpSync(path.join(goi, 'templates/tools/design-assembly'), path.join(kho, 'tools/design-assembly'), { recursive: true });
    mkdirSync(path.join(kho, 'design'), { recursive: true });
    writeFileSync(path.join(kho, 'design/screens.yaml'), h.so);
    if (h.bang) writeFileSync(path.join(kho, 'design/states.json'), h.bang);
    const doiSo = ['tools/design-assembly/screen-facts.mjs', '--json', '--target', kho, ...(h.hoi.length ? ['--screens', h.hoi.join(',')] : [])];
    const r = spawnSync(process.execPath, doiSo, { cwd: kho, encoding: 'utf8' });
    if (r.status === 2 || !r.stdout.trim()) throw new Error(`${h.tep}: lệnh đọc thoát ${r.status}: ${r.stderr.trim()}`);
    const json = JSON.parse(r.stdout);
    json.ledger = 'design/screens.yaml';
    const mau = { exit: r.status, json };
    const dich = path.join(HERE, h.tep);
    const moi = JSON.stringify(mau, null, 2) + '\n';
    if (GHI) writeFileSync(dich, moi);
    else if (!existsSync(dich) || readFileSync(dich, 'utf8') !== moi) { lech++; process.stdout.write(`lệch: ${h.tep}\n`); }
    if (GHI) process.stdout.write(`ghi ${h.tep} (thoát ${r.status}, gói ${phienBan}, lệnh: node ${doiSo.join(' ').replace(kho, '<kho>')})\n`);
  } finally {
    rmSync(kho, { recursive: true, force: true });
  }
}
process.exit(lech ? 1 : 0);
