// lop-do.test.mjs — B2 AC-5: báo cáo lớp đỏ tính từ túi khoá (ca đỏ + ca không chạy tới), bộ chết ngầm có tên, không bao
// giờ in tổng 0 khi có bộ chết, và chỉ thay báo cáo đã chốt khi báo cáo mới qua đối chiếu số học.
// Chạy: node --test migration/kich-ban/lop-do.test.mjs
//
// Thư mục đo do CHÍNH chay-bo-kiem.sh ghi trên cây fixture (fixture-bo-kiem.mjs — bộ chạy nạp tests/bo-chay.sh thật).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { moTamCho, dungCay, chayCay } from './fixture-bo-kiem.mjs';
import { kiemSoLieu } from './lop-do.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const tam = [];
after(() => { for (const d of tam) fs.rmSync(d, { recursive: true, force: true }); });
const moTam = moTamCho(tam);
const S40 = 'a'.repeat(40), C40 = 'b'.repeat(40);

// Thư mục đo T với out/A (cây cũ) và out/B (cây mới), đúng hình do-lop-do.sh dựng.
function thuMucDo(cu, moi) {
  const T = moTam('lop-do-');
  fs.mkdirSync(path.join(T, 'out'));
  fs.cpSync(chayCay(moTam, dungCay(moTam, cu)), path.join(T, 'out', 'A'), { recursive: true });
  fs.cpSync(chayCay(moTam, dungCay(moTam, moi)), path.join(T, 'out', 'B'), { recursive: true });
  return T;
}
const phanLop = (T) => spawnSync('python3', [path.join(DAY, 'phan-lop.py'), T, S40, C40], { encoding: 'utf8' });
const BA = [['PASS', 'A01 dau'], ['PASS', 'A02 hai'], ['PASS', 'A03 ba']];

test('BK-AC5', () => {
  const r = phanLop(thuMucDo({ ka: BA }, { ka: [['PASS', 'A01 dau'], ['FAIL', 'A02 hai']] }));
  assert.equal(r.status, 0, r.stderr);
  const { loi, so } = kiemSoLieu(r.stdout);
  assert.deepEqual(loi, []);
  assert.equal(so.bo.ka.khong_chay_toi, 1, 'A03 không chạy tới');
  assert.equal(so.bo.ka.do_them, 2, 'đỏ thêm = ca đỏ + ca không chạy tới');
  assert.match(r.stdout, /\| Bộ \| Mã thoát cũ \| Mã thoát mới \| Đạt cây cũ \| Đạt cây mới \| Không chạy tới \| Đỏ thêm \|/);
});

test('BK-AC5-do-chet', () => {
  const r = phanLop(thuMucDo({ ka: BA }, { ka: BA, chetSau: 1 }));
  const { loi, so } = kiemSoLieu(r.stdout);
  assert.deepEqual(loi, []);
  assert.equal(so.bo.ka.khong_chay_toi, 2, 'bộ chết sau ca đầu: hai ca không chạy tới');
  assert.ok(so.tong_do_them >= 2, `tổng không được là 0: ${so.tong_do_them}`);
});

test('BK-AC5-do-im-lang', () => {
  const r = phanLop(thuMucDo({ ka: BA }, { ka: BA, imLang: true }));
  const { loi, so } = kiemSoLieu(r.stdout);
  assert.deepEqual(loi, []);
  assert.equal(so.bo.ka.lop['bo-chay'], 1, 'bộ thoát 1 không in dòng nào phải là một mục bộ chạy');
  assert.match(r.stdout, /ka: bộ thoát 1 mà không in ca nào/);
  assert.ok(so.tong_do_them >= 1);
});

test('BK-AC5-do-ghi-do', () => {
  const T = thuMucDo({ ka: BA }, { ka: BA });
  const dich = path.join(moTam('lop-do-dich-'), 'lop-do.md');
  fs.writeFileSync(dich, 'báo cáo đã chốt\n');
  const bam = () => crypto.createHash('sha256').update(fs.readFileSync(dich)).digest('hex');
  const truoc = bam();
  const lanh = spawnSync('bash', [path.join(DAY, 'ghi-bao-cao.sh'), T, S40, C40, dich], { encoding: 'utf8' });
  assert.equal(lanh.status, 0, `đối chứng dương: ghi được báo cáo — ${lanh.stderr}`);
  assert.notEqual(bam(), truoc, 'đối chứng dương: báo cáo phải được thay');
  fs.writeFileSync(dich, 'báo cáo đã chốt\n');
  // Bản sao migration/ có tiêm lỗi ngay trước bước thay tệp (kim khớp đúng một lần trong nguồn thật).
  const sao = path.join(moTam('lop-do-sao-'), 'migration');
  for (const d of ['kich-ban', 'chay-thu-phien']) fs.cpSync(path.join(DAY, '..', d), path.join(sao, d), { recursive: true });
  const p = path.join(sao, 'kich-ban', 'ghi-bao-cao.sh'); const s = fs.readFileSync(p, 'utf8');
  const KIM = 'mv -f "$TAM" "$DICH"';
  assert.equal(s.split(KIM).length - 1, 1, 'kim phải khớp đúng một lần');
  fs.writeFileSync(p, s.replace(KIM, `false\n${KIM}`));
  const hong = spawnSync('bash', [p, T, S40, C40, dich], { encoding: 'utf8' });
  assert.notEqual(hong.status, 0, 'lượt viết hỏng phải thoát khác 0');
  assert.equal(bam(), truoc, 'báo cáo đã chốt phải còn nguyên byte');
});

// ── Bộ chết ngầm ở CÂY CŨ (Cổng Bằng chứng lượt 1 trả về, finding trong hợp đồng AC-5) ───────────────────────────────
// AC-5 không giới hạn ở cây mới: cây cũ chết thì không có đường nền để so, báo cáo phải gọi tên, không được in tổng 0.
test('BK-AC5-do-chet-cu', () => {
  const r = phanLop(thuMucDo({ ka: BA, imLang: true }, { ka: BA }));
  assert.equal(r.status, 0, r.stderr);
  const { loi, so } = kiemSoLieu(r.stdout);
  assert.deepEqual(loi, [], loi.join('\n'));
  assert.equal(so.bo.ka.lop['bo-chay'], 1, 'cây cũ thoát 1 không in dòng nào phải là một mục bộ chạy');
  assert.match(r.stdout, /ka: cây cũ — bộ thoát 1 mà không in ca nào \(không có đường nền để so\)/);
  assert.ok(so.tong_do_them >= 1, `tổng không được là 0: ${so.tong_do_them}`);
});

test('BK-AC5-do-khong-do-cu', () => {
  const T = thuMucDo({ ka: BA }, { ka: BA });
  const lanh = kiemSoLieu(phanLop(T).stdout);
  assert.equal(lanh.so.tong_do_them, 0, 'đối chứng dương: hai cây lành → tổng 0');
  // Đúng hình tái hiện của lượt chấm: ketqua.tsv cây cũ còn dòng ka thoát 1, không XONG, không bảng thời gian.
  const A = path.join(T, 'out', 'A');
  fs.writeFileSync(path.join(A, 'ketqua.tsv'), 'ka\t1\t1\tbash\n');
  fs.rmSync(path.join(A, 'thoi-gian-ca'), { recursive: true, force: true });
  const r = phanLop(T);
  assert.equal(r.status, 0, r.stderr);
  const { loi, so } = kiemSoLieu(r.stdout);
  assert.deepEqual(loi, [], loi.join('\n'));
  assert.equal(so.bo.ka.lop['bo-chay'], 1, 'bộ cây cũ thiếu bảng thời gian là một mục bộ chạy');
  assert.match(r.stdout, /ka: cây cũ — bộ không đo được \(thiếu bảng thời gian hay nhật ký\)/);
  assert.equal(so.bo['luot-chay-cu']?.lop['bo-chay'], 1, 'lượt cây cũ thiếu XONG là một mục bộ chạy');
  assert.match(r.stdout, /luot-chay-cu: lượt chạy không có dòng XONG/);
  assert.ok(so.tong_do_them >= 2, `tổng không được là 0: ${so.tong_do_them}`);
});
