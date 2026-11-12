// kiem-ke.test.mjs — kiểm hai chiều cho sổ kiểm kê.
// Chạy: node --test migration/tra-soat/kiem-ke.test.mjs   (mặc định đo kit-cu/main; đổi bằng KIEM_KE_REF)
//
// Dữ liệu kiểm do mã sinh trong chính lượt chạy: lấy cây thật của mã commit đang đo, dựng một kho tạm một commit, rồi mỗi
// ca tiêm MỘT thay đổi lên một nhánh riêng. Ca đỏ phải đổi ĐÚNG chỗ mong đợi và để nguyên mọi chỗ khác; ca im phải để nguyên
// mọi thứ. Đối chứng dương chạy trên cây nguyên vẹn trước.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { kiemKe } from './kiem-ke.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KHO = execFileSync('git', ['-C', DAY, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const REF = process.env.KIEM_KE_REF || 'kit-cu/main';
const LUAT = path.join(DAY, 'luat-xep.json');
const g = (kho, ...a) => execFileSync('git', ['-C', kho, ...a], { encoding: 'utf8', maxBuffer: 1 << 30 });

let tam, goc;
const chay = (ref, luat = LUAT) => kiemKe({ kho: tam, ref, luat });
const theoTep = (kq) => new Map(kq.hang.map(h => [h.tep, h]));
const dem = (kq, lop) => kq.hang.filter(h => h.lop === lop).length;

function nhanh(ten, sua) {
  g(tam, 'switch', '-q', '-c', ten, 'goc');
  sua(tam);
  g(tam, 'add', '-A');
  g(tam, '-c', 'user.name=kiem-ke', '-c', 'user.email=kiem-ke@thu.local', 'commit', '-qm', ten);
  g(tam, 'switch', '-q', 'goc');
  return ten;
}

before(() => {
  tam = fs.mkdtempSync(path.join(os.tmpdir(), 'kiem-ke-test-'));
  const sha = g(KHO, 'rev-parse', `${REF}^{commit}`).trim();
  execFileSync('sh', ['-c', 'git -C "$1" archive "$2" | tar -x -C "$3"', 'sh', KHO, sha, tam]);
  g(tam, 'init', '-q', '-b', 'goc');
  g(tam, 'add', '-A');
  g(tam, '-c', 'user.name=kiem-ke', '-c', 'user.email=kiem-ke@thu.local', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'goc');
  goc = chay('goc');
});
after(() => { if (tam) fs.rmSync(tam, { recursive: true, force: true }); });

// ── Đối chứng dương ─────────────────────────────────────────────────────────────────────────────────────────────
test('KK-00 cây nguyên vẹn: mỗi tệp đúng một hàng, đủ sáu plugin có điểm vào, mã của kit không có đường dẫn treo', () => {
  const soTep = g(tam, 'ls-files').split('\n').filter(Boolean).length;
  assert.equal(goc.so_tep, soTep);
  assert.equal(goc.hang.length, soTep);
  assert.equal(new Set(goc.hang.map(h => h.tep)).size, soTep, 'có tệp xuất hiện hai lần');
  assert.ok(goc.hang.every(h => h.lop), 'có tệp không có lớp');
  for (const p of goc.plugin) assert.ok(goc.hang.some(h => h.plugin === p.ten && h.cach_vao.startsWith('diem-vao')), `plugin ${p.ten} không có điểm vào`);
  assert.deepEqual(goc.treo.filter(t => t.kieu !== 'import-trong-ma-nhap-ngoai'), [], 'mã của kit có đường dẫn khai chặt trỏ vào không có gì');
  assert.ok(dem(goc, 'san-pham') > 100 && dem(goc, 'bo-kiem') > 100, 'đếm lớp không giống một cây kit thật');
});

test('KK-01 chạy hai lần trên cùng mã commit ra cùng kết quả', () => {
  assert.equal(JSON.stringify(chay('goc')), JSON.stringify(goc));
});

// ── Chiều đỏ: tiêm đúng một thay đổi, phải đổi đúng một chỗ ─────────────────────────────────────────────────────
test('KK-02 thêm một tệp ở vùng sản phẩm mà không ai gọi → đúng một tệp «chưa rõ / không ai gọi» mới', () => {
  const kq = chay(nhanh('m-tep-la', d => fs.writeFileSync(path.join(d, 'scripts/la-moi-kiem-ke.mjs'), 'export const x = 1;\n')));
  const h = theoTep(kq).get('scripts/la-moi-kiem-ke.mjs');
  assert.deepEqual([h.lop, h.cach_vao], ['chua-ro', 'khong-ai-goi']);
  assert.equal(dem(kq, 'chua-ro'), dem(goc, 'chua-ro') + 1);
  assert.equal(dem(kq, 'san-pham'), dem(goc, 'san-pham'));
});

test('KK-03 một import tương đối trỏ vào tệp không có → đúng một dòng treo mới, ghi đúng tệp và chữ', () => {
  const t = goc.hang.find(h => h.plugin === 'feature-loop' && h.lop === 'san-pham' && /scripts\/[^/]+\.mjs$/.test(h.tep)).tep;
  const kq = chay(nhanh('m-treo', d => fs.appendFileSync(path.join(d, t), "\nimport khongCo from './khong-co-kiem-ke.mjs';\n")));
  const moi = kq.treo.filter(x => !goc.treo.some(y => y.tu === x.tu && y.chu === x.chu));
  assert.deepEqual(moi.map(x => [x.tu, x.chu, x.kieu]), [[t, './khong-co-kiem-ke.mjs', 'import-tuong-doi']]);
});

test('KK-04 plugin con import thẳng một tệp của plugin lõi → đúng một cạnh chéo kiểu import-tuong-doi mới', () => {
  const t = goc.hang.find(h => h.plugin === 'feature-loop' && h.lop === 'san-pham' && /^feature-loop\/scripts\/[^/]+\.mjs$/.test(h.tep)).tep;
  const dich = goc.hang.find(h => h.plugin === 'acceptance-gate' && h.lop === 'san-pham' && /^scripts\/[^/]+\.mjs$/.test(h.tep)).tep;
  const kq = chay(nhanh('m-cheo', d => fs.appendFileSync(path.join(d, t), `\nimport cheo from '../../${dich}';\n`)));
  const moi = kq.canh.filter(x => !goc.canh.some(y => y.tu === x.tu && y.toi === x.toi && y.kieu === x.kieu));
  assert.deepEqual(moi.map(x => [x.tu, x.toi, x.kieu]), [[t, dich, 'import-tuong-doi']]);
});

test('KK-05 sản phẩm nhắc một tệp tài liệu có thư mục → đúng một con trỏ ra ngoài mới, không mơ hồ', () => {
  const t = goc.hang.find(h => h.plugin === 'acceptance-gate' && h.lop === 'san-pham' && /^scripts\/[^/]+\.mjs$/.test(h.tep)).tep;
  const adr = goc.hang.find(h => h.tep.startsWith('docs/adr/')).tep;
  const kq = chay(nhanh('m-con-tro', d => fs.appendFileSync(path.join(d, t), `\n// xem ${adr} (kiem-ke)\n`)));
  const moi = kq.con_tro.filter(x => !goc.con_tro.some(y => y.tu === x.tu && y.toi === x.toi));
  assert.deepEqual(moi.map(x => [x.tu, x.toi, x.lop, x.mo_ho]), [[t, adr, 'tai-lieu-song', '']]);
});

test('KK-06 bỏ một luật khỏi luat-xep.json → vùng ấy rời lớp cũ (kịch bản thật sự đọc tệp luật)', () => {
  assert.ok(dem(goc, 'bo-kiem') > 0, 'đối chứng: cây nguyên vẹn phải có lớp bo-kiem trước khi bỏ luật');
  const L = JSON.parse(fs.readFileSync(LUAT, 'utf8'));
  L.luat = L.luat.filter(r => r.tien_to !== 'tests/');
  const banSao = path.join(tam, '..', path.basename(tam) + '-luat.json');
  fs.writeFileSync(banSao, JSON.stringify(L));
  try {
    const kq = chay('goc', banSao);
    assert.equal(dem(kq, 'bo-kiem'), 0);
    assert.equal(dem(kq, 'san-pham') + dem(kq, 'chua-ro'), dem(goc, 'san-pham') + dem(goc, 'chua-ro') + dem(goc, 'bo-kiem'));
  } finally { fs.rmSync(banSao, { force: true }); }
});

// ── Chiều im: chạm thứ không phải sản phẩm, sổ phần sản phẩm không được đổi ──────────────────────────────────────
test('KK-07 sửa hồ sơ, sổ làm việc, nhật ký (kể cả nhắc tên một tệp sản phẩm) → phần sản phẩm của sổ đứng yên', () => {
  const hs = goc.hang.find(h => h.lop === 'ho-so-vong').tep;
  const so = goc.hang.find(h => h.lop === 'so-lam-viec' && h.tep.endsWith('.md')).tep;
  const chuaRo = goc.hang.find(h => h.lop === 'chua-ro').tep;
  const kq = chay(nhanh('m-im', d => {
    for (const t of [hs, so, 'CHANGELOG.md']) fs.appendFileSync(path.join(d, t), `\nkiem-ke: nhắc ${chuaRo} và scripts/khong-co.mjs\n`);
  }));
  const sp = (k) => JSON.stringify(k.hang.filter(h => ['san-pham', 'chua-ro'].includes(h.lop)));
  assert.equal(sp(kq), sp(goc));
  assert.deepEqual([kq.canh, kq.con_tro, kq.treo], [goc.canh, goc.con_tro, goc.treo]);
});
