#!/usr/bin/env node
// Răng chiều đỏ của hồ sơ chuyen-gop: chép TRỌN hai thư mục `plugins/` và `tests/` của cây đang kiểm (gốc suy từ vị trí
// tệp này) vào thư mục tạm, chạy tệp ca trên bản nguyên vẹn (phải xanh — đối chứng dương), rồi mỗi đột biến thay đúng một
// chuỗi trong bản chép và chạy lại: tệp ca phải đỏ ĐÚNG ca đã ghim. Chuỗi đột biến không còn trong vật → thoát 3 nêu tên
// (vật đã đổi, răng phải sửa cùng) — không bao giờ thành xanh im lặng.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..', '..');
const CA = 'tests/dieu-phoi/loi/chuyen-gop.test.mjs';
const DS = 'plugins/dispatch/scripts/';
const DOT_BIEN = [
  ['DB-1 bỏ cửa proof ở lệnh gộp', `${DS}gop.mjs`, "  if (!cp.qua) return { duong: 'chan', sha, ly_do: cp.ly_do };", '', 'AC-5 lenh gop tung PR'],
  ['DB-2 tách tuyến tính', `${DS}chuyen-gop.mjs`, 'while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (k(con.slice(0, mid))) lo = mid; else hi = mid; }', 'while (hi - lo > 1) { if (k(con.slice(0, lo + 1))) lo++; else hi = lo + 1; }', 'AC-3 tach doi thuan'],
  ['DB-3 bỏ cửa sổ', `${DS}chuyen-gop.mjs`, 'if (!g.khoi_hanh && !ngay)', 'if (false)', 'AC-2 chua het cua so'],
  ['DB-4 bỏ vế tầng', `${DS}cua-proof.mjs`, "if (tang !== 'low')", 'if (false)', 'AC-5 luat tu tri dung khuon'],
  ['DB-5 đọc luật ở nhánh PR', `${DS}cua-proof.mjs`, 'show(`${dinh}:governance/autonomy.yaml`)', 'show(`${sha}:governance/autonomy.yaml`)', 'AC-5 lenh gop tung PR'],
  ['DB-6 kiểm từng PR thay vì ngọn', `${DS}chuyen-gop.mjs`, 'if (k(con)) return { xanh: con, rot, so_lan_kiem: n };', 'if (con.every((p) => k([p]))) return { xanh: con, rot, so_lan_kiem: n };', 'AC-2 chuyen xanh'],
  ['DB-7 bỏ so đỉnh trước gộp', `${DS}chuyen-gop.mjs`, 'if (dinhMoi !== dinh) return', 'if (false) return', 'AC-8 nhanh chinh doi'],
  ['DB-8 gộp tiếp sau lần gộp hỏng', `${DS}chuyen-gop.mjs`, "      return { duong: 'gop-do-dang',", "      if (false) return { duong: 'gop-do-dang',", 'AC-8 mot lan gop hong'],
  ['DB-9 bỏ kiểm nhánh chính', `${DS}chuyen-gop.mjs`, 'if (!k([])) return { xanh: [], rot, so_lan_kiem: n, chinh_do: true };', '', 'AC-8 nhanh chinh do'],
  ['DB-10 bên ghi hàng 1 đổi tên trường may', 'plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs', 'so_do: SO_DO, may: DAU_MAY,', 'so_do: SO_DO, mayx: DAU_MAY,', 'AC-5 nhan biet mon mac-ky'],
];

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chuyen-gop-dot-bien-'));
const chep = () => { const d = fs.mkdtempSync(path.join(tmp, 'ban-')); for (const t of ['plugins', 'tests']) fs.cpSync(path.join(ROOT, t), path.join(d, t), { recursive: true }); return d; };
const chay = (d) => {
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', CA], { cwd: d, encoding: 'utf8', maxBuffer: 64 << 20 });
  return { ma: r.status, khong: (r.stdout.match(/^not ok \d+ - .*$/gm) || []).map((l) => l.replace(/^not ok \d+ - /, '')) };
};
let hong = 0;
try {
  const lanh = chay(chep());
  if (lanh.ma !== 0 || lanh.khong.length) { console.log(`FAIL: DB-0 bản nguyên vẹn không xanh (mã ${lanh.ma}; đỏ: ${lanh.khong.join(' | ')})`); process.exit(1); }
  console.log('PASS: DB-0 bản nguyên vẹn xanh');
  for (const [ten, tep, tu, thanh, ca] of DOT_BIEN) {
    const d = chep(); const p = path.join(d, tep); const s = fs.readFileSync(p, 'utf8');
    if (!s.includes(tu)) { console.log(`HẠ TẦNG: ${ten} — chuỗi đột biến không còn trong ${tep}`); process.exit(3); }
    fs.writeFileSync(p, s.replace(tu, thanh));
    const r = chay(d);
    if (r.ma !== 0 && r.khong.some((x) => x.startsWith(ca))) console.log(`PASS: ${ten} → đỏ «${ca}…» (${r.khong.length} ca đỏ)`);
    else { hong++; console.log(`FAIL: ${ten} — không làm ca «${ca}…» đỏ (mã ${r.ma}; đỏ: ${r.khong.join(' | ') || 'không ca nào'})`); }
  }
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
console.log(`DB Results: ${DOT_BIEN.length - hong} passed, ${hong} failed`);
process.exit(hong ? 1 : 0);
