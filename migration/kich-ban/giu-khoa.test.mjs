// giu-khoa.test.mjs — B2 AC-3 (thước giữ đủ khoá ca) và phần đọc gate.yml của AC-4.
// Chạy: node --test migration/kich-ban/giu-khoa.test.mjs
//
// Fixture do BÊN VIẾT THẬT sinh trong lượt: mỗi «cây» là một thư mục có .github/workflows/gate.yml (việc tests), một bộ
// bash giả nạp CHÍNH tests/bo-chay.sh của kho (bc_tg_mo/bc_tg_dong ghi bảng thời gian từng ca), các tệp ca chạy bằng
// `node --test --test-reporter=tap` thật, và một bước một-khoá. Lượt chạy là CHÍNH chay-bo-kiem.sh; thước là CHÍNH
// giu-khoa.mjs. Không viết tay tệp .tsv hay TAP nào. Tên ca = mã trong evals.yaml.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { docGate } from './doc-gate.mjs';
import { dungCay as _dungCay, chayCay as _chayCay } from './fixture-bo-kiem.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DAY, '..', '..');
const GK = path.join(DAY, 'giu-khoa.mjs');
const tam = [];
after(() => { for (const d of tam) fs.rmSync(d, { recursive: true, force: true }); });
const moTam = (t = 'gk-') => { const d = fs.mkdtempSync(path.join(os.tmpdir(), t)); tam.push(d); return d; };

const dungCay = (o) => _dungCay(moTam, o);
const chayCay = (c) => _chayCay(moTam, c);
const giuKhoa = (cu, moi, them = []) => spawnSync(process.execPath, [GK, cu, moi, ...them], { encoding: 'utf8' });

// ── AC-4: bộ đọc việc tests của gate.yml ─────────────────────────────────────────────────────────────────────────
test('BK-AC4-doc-gate', () => {
  const c = dungCay({ them: ['      - name: bay', '        if: github.event_name == \'push\'', '        run: |', '          echo mot', '          echo hai'].join('\n') });
  const b = docGate(fs.readFileSync(path.join(c, '.github/workflows/gate.yml'), 'utf8'));
  assert.deepEqual(b.map(x => x.ten), ['ka', 'dp', 'ban-do', 'buoc-4'], 'đủ bốn bước kiểm, bỏ bước cài và bước ngoài việc tests');
  assert.equal(b[3].lenh, 'echo mot\necho hai', 'khối run nhiều dòng giữ đủ dòng');
  assert.deepEqual(b.map(x => x.loai), ['bash', 'tap', 'mot-khoa', 'mot-khoa']);
  assert.throws(() => docGate('jobs:\n  khac:\n    steps:\n      - run: x\n'), /không đọc được việc tests: không có việc tests/);
});

// ── AC-3 ──────────────────────────────────────────────────────────────────────────────────────────────────────────
test('BK-AC3', () => {
  const r = giuKhoa(chayCay(dungCay()), chayCay(dungCay()));
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^giữ đủ: 6\/6 khoá, bỏ 0$/m, r.stdout);
});

test('BK-AC3-do-xoa', () => {
  const r = giuKhoa(chayCay(dungCay()), chayCay(dungCay({ ka: [['PASS', 'A01 dau'], ['PASS', 'A03 ba']] })));
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /^thiếu 1 khoá$/m);
  assert.match(r.stdout, /^ {2}thiếu: ka: A02 hai$/m);
});

for (const [ma, ket] of [['skip', 'SKIP'], ['fail', 'FAIL']]) {
  test(`BK-AC3-do-${ma}`, () => {
    const r = giuKhoa(chayCay(dungCay()), chayCay(dungCay({ ka: [['PASS', 'A01 dau'], [ket, 'A02 hai'], ['PASS', 'A03 ba']] })));
    assert.equal(r.status, 1, r.stdout);
    assert.match(r.stdout, /^ {2}thiếu: ka: A02 hai$/m);
  });
}

// Đầu ra --json lớn hơn bộ đệm ống (64 KiB) phải tới bên đọc trọn vẹn — lượt đo 15/11 thiếu nhiều khoá, phan-lop.py nhận
// JSON cắt ở đúng 65 536 byte vì bộ thước thoát ngay sau write. Đối chứng: đầu ra thật sự vượt 64 KiB.
test('BK-AC3-json-lon', () => {
  const N = 900, ten = i => `A${String(i).padStart(4, '0')} ${'khoa-dai-de-vuot-bo-dem-ong-'.repeat(3)}`;
  const r = giuKhoa(chayCay(dungCay({ ka: Array.from({ length: N }, (_, i) => ['PASS', ten(i)]) })), chayCay(dungCay({ ka: [['PASS', ten(0)]] })), ['--json']);
  assert.equal(r.status, 1, r.stderr);
  assert.ok(Buffer.byteLength(r.stdout) > 65536, `đối chứng: đầu ra chỉ ${Buffer.byteLength(r.stdout)} byte, không vượt bộ đệm ống`);
  assert.equal(JSON.parse(r.stdout).thieu.length, N - 1);
});

// Tên ca mang đường tính từ gốc gói (`… in commands/skills`) không đổi ở cây mới: khoá cũ đổi qua luật đường thành
// `plugins/…/commands/skills` mà ca nguyên tên vẫn PASS → giữ. Chiều đỏ: ca ấy vắng ở cây mới → vẫn thiếu đúng khoá.
test('BK-AC3-ten-nguyen', () => {
  const ca = [['PASS', 'A01 dau'], ['PASS', 'A02 in commands/skills'], ['PASS', 'A03 ba']];
  const r = giuKhoa(chayCay(dungCay({ ka: ca })), chayCay(dungCay({ ka: ca })));
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^giữ đủ: 6\/6 khoá, bỏ 0$/m, r.stdout);
  const d = giuKhoa(chayCay(dungCay({ ka: ca })), chayCay(dungCay({ ka: [ca[0], ca[2]] })));
  assert.equal(d.status, 1, d.stdout);
  assert.match(d.stdout, /^ {2}thiếu: ka: A02 in plugins\/acceptance-gate\/commands\/skills$/m, d.stdout);
});

test('BK-AC3-do-lap', () => {
  const r = giuKhoa(chayCay(dungCay({ ka: [['PASS', 'A01 dau'], ['PASS', 'A01 dau']] })), chayCay(dungCay({ ka: [['PASS', 'A01 dau']] })));
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /^ {2}thiếu: ka: A01 dau$/m);
});

test('BK-AC3-do-khong-do', () => {
  const cu = chayCay(dungCay());
  const m1 = chayCay(dungCay()); fs.rmSync(path.join(m1, 'thoi-gian-ca'), { recursive: true });
  const r1 = giuKhoa(cu, m1);
  assert.equal(r1.status, 1); assert.match(r1.stdout, /bộ không đo được: ka/);
  const m2 = chayCay(dungCay()); const k = path.join(m2, 'ketqua.tsv');
  fs.writeFileSync(k, fs.readFileSync(k, 'utf8').replace('XONG\n', ''));
  const r2 = giuKhoa(cu, m2);
  assert.equal(r2.status, 1); assert.match(r2.stdout, /bộ không đo được: lượt chạy không có dòng XONG/);
  const m3 = chayCay(dungCay({ chetSau: 1 }));
  const r3 = giuKhoa(cu, m3);
  assert.equal(r3.status, 1, 'bộ chết sau ca đầu phải đỏ'); assert.match(r3.stdout, /^thiếu 2 khoá$/m);
});

test('BK-AC3-tap', () => {
  const cu = chayCay(dungCay({ dp: ['DP-1 mot', 'DP-2 hai', 'DP-3 ba'] }));
  const moi = chayCay(dungCay({ dp: ['DP-1 mot', 'DP-2 hai', 'DP-3 ba'], skip: ['DP-3 ba'] }));
  const r = giuKhoa(cu, moi);
  assert.equal(r.status, 1, 'ca skip ở cây mới phải tính thiếu');
  assert.match(r.stdout, /^ {2}thiếu: dp: DP-3 ba$/m);
  assert.doesNotMatch(r.stdout, /thiếu: dp: con/, 'test con không phải khoá — chỉ tầng ngoài');
});

test('BK-AC3-do-tap', () => {
  const r = giuKhoa(chayCay(dungCay()), chayCay(dungCay({ dp: ['DP-1 mot'] })));
  assert.equal(r.status, 1); assert.match(r.stdout, /^ {2}thiếu: dp: DP-2 hai$/m);
});

test('BK-AC3-do-bo-khong-quyet', () => {
  const cu = chayCay(dungCay()); const moi = chayCay(dungCay({ ka: [['PASS', 'A01 dau'], ['PASS', 'A03 ba']] }));
  const d = moTam('gk-bo-');
  const so = path.join(d, 'decisions.jsonl');
  fs.writeFileSync(so, JSON.stringify({ id: 'd-20261114T000000Z-1', type: 'descope', stage: 'gate2', decision: 'bỏ A02' }) + '\n');
  const coQuyet = path.join(d, 'co.tsv'); fs.writeFileSync(coQuyet, 'ka: A02 hai\td-20261114T000000Z-1\tchủ kho bỏ\n');
  const r1 = giuKhoa(cu, moi, ['--bo', coQuyet, '--so', so]);
  assert.equal(r1.status, 0, `đối chứng dương: dòng bỏ có quyết — ${r1.stdout}`); assert.match(r1.stdout, /^giữ đủ: 6\/6 khoá, bỏ 1$/m);
  const khong = path.join(d, 'khong.tsv'); fs.writeFileSync(khong, 'ka: A02 hai\t\tmáy tự bỏ\n');
  const r2 = giuKhoa(cu, moi, ['--bo', khong, '--so', so]);
  assert.equal(r2.status, 1); assert.match(r2.stdout, /bỏ khoá không có quyết: ka: A02 hai/);
});

test('BK-AC3-im-them', () => {
  const r = giuKhoa(chayCay(dungCay()), chayCay(dungCay({ ka: [['PASS', 'A01 dau'], ['PASS', 'A02 hai'], ['PASS', 'A03 ba'], ['PASS', 'A04 moi']] })));
  assert.equal(r.status, 0, r.stdout); assert.match(r.stdout, /^ {2}thừa: ka: A04 moi$/m);
});

test('BK-AC3-im-ten', () => {
  const r = giuKhoa(chayCay(dungCay({ ka: [['PASS', 'N1 /dieu-phoi:mo-dot chay dieu-phoi@acceptance-gate-kit']] })),
    chayCay(dungCay({ ka: [['PASS', 'N1 /dispatch:open chay dispatch@delivery-loop']] })));
  assert.equal(r.status, 0, r.stdout);
});

test('BK-AC3-im-duong', () => {
  const r = giuKhoa(chayCay(dungCay({ ka: [['PASS', 'D1 goi scripts/x.sh va feature-loop/scripts/y.mjs']] })),
    chayCay(dungCay({ ka: [['PASS', 'D1 goi plugins/acceptance-gate/scripts/x.sh va plugins/feature-loop/scripts/y.mjs']] })));
  assert.equal(r.status, 0, r.stdout);
});

test('BK-AC3-im-tmp', () => {
  const r = giuKhoa(chayCay(dungCay({ ka: [['PASS', 'T1 /private/tmp/abc/x ' + 'a'.repeat(40)]] })),
    chayCay(dungCay({ ka: [['PASS', 'T1 /var/folders/zz/T/q/y ' + 'b'.repeat(40)]] })));
  assert.equal(r.status, 0, r.stdout);
});

// ── AC-4 — báo cáo giữ khoá và hàm kiểm của thước nguồn thật ─────────────────────────────────────────────────────
import { ghiBaoCao, kiemGiuKhoa } from './bao-cao-giu-khoa.mjs';
const S40 = 'a'.repeat(40), C40 = 'b'.repeat(40);
function baoCaoFixture(cu = {}, moi = {}) {
  const T = moTam('gk-bc-');
  fs.mkdirSync(path.join(T, 'out'));
  fs.cpSync(chayCay(dungCay(cu)), path.join(T, 'out', 'A'), { recursive: true });
  fs.cpSync(chayCay(dungCay(moi)), path.join(T, 'out', 'B'), { recursive: true });
  const ra = moTam('gk-ra-');
  ghiBaoCao({ T, nguon: S40, cay: C40, ra, bo: path.join(moTam('gk-bo-'), 'trong.tsv'), so: null });
  return ra;
}
const kiem = (ra, cay = C40) => { const loi = [], dong = []; kiemGiuKhoa({ ra, nguon: S40, cayDung: cay, loi, ra_: (x) => dong.push(x) }); return { loi, dong }; };

test('BK-AC4-cay-cu', () => {
  const ra = baoCaoFixture();
  const lanh = kiem(ra);
  assert.deepEqual(lanh.loi, [], 'đối chứng dương: báo cáo đúng cây');
  assert.ok(lanh.dong.some(d => /^AC-4 đạt: báo cáo đo trên nguồn aaaaaaaa, cây mới bbbbbbbb dựng lại khớp; 3 bước thoát 0 ở cả hai cây; giữ đủ 6\/6 khoá, bỏ 0$/.test(d)), lanh.dong.join('\n'));
  const cu = kiem(ra, 'c'.repeat(40));
  assert.ok(cu.loi.includes('báo cáo giữ khoá đo trên cây cũ'), cu.loi.join('\n'));
});

test('BK-AC4-do-sua-bao-cao', () => {
  const ra = baoCaoFixture();
  const p = path.join(ra, 'giu-khoa.md');
  fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace('tong: 6', 'tong: 7'));
  assert.ok(kiem(ra).loi.includes('báo cáo giữ khoá lệch túi khoá đã commit'));
  const ra2 = baoCaoFixture({}, { ka: [['PASS', 'A01 dau'], ['PASS', 'A03 ba']] });
  const p2 = path.join(ra2, 'giu-khoa.md');
  fs.writeFileSync(p2, fs.readFileSync(p2, 'utf8').replace('phan_quyet: thieu', 'phan_quyet: giu-du'));
  const r2 = kiem(ra2);
  assert.ok(r2.loi.includes('báo cáo giữ khoá lệch túi khoá đã commit'), r2.loi.join('\n'));
  assert.ok(r2.loi.some(l => l.startsWith('thiếu 1 khoá')), 'phán quyết chạy lại phải nêu thiếu');
});
