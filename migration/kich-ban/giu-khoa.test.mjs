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
import { tuiCu, soTui } from './giu-khoa.mjs';
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

// Hai cây cùng in CẢ tên phẳng lẫn tên gói của một ca (`bo-cuc.test.mjs`: «BC commands/x» và «BC plugins/…/commands/x»,
// lượt 17/11: 43 khoá K4-MP). Luật so phải xét CHỖ còn lại ở cây mới: tên phẳng đổi thành tên gói chỉ khi tên gói còn chỗ,
// không thì giữ tên nguyên chữ (gui-b2.md §3.1 của vòng bốn, chủ kho chọn ở Hỏi-1). Chiều đỏ: bỏ từng tên ở cây mới →
// thiếu đúng tên ấy.
test('BK-AC3-hai-ten', () => {
  const ca = [['PASS', 'A01 dau'], ['PASS', 'A02 in commands/x'], ['PASS', 'A02 in plugins/acceptance-gate/commands/x']];
  const r = giuKhoa(chayCay(dungCay({ ka: ca })), chayCay(dungCay({ ka: ca })));
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^giữ đủ: (\d+)\/\1 khoá, bỏ 0$/m, r.stdout);
  assert.doesNotMatch(r.stdout, /thừa:/, r.stdout);
  const phang = giuKhoa(chayCay(dungCay({ ka: ca })), chayCay(dungCay({ ka: [ca[0], ca[2]] })));
  assert.equal(phang.status, 1, phang.stdout);
  assert.match(phang.stdout, /^thiếu 1 khoá$/m, phang.stdout);
  assert.match(phang.stdout, /^ {2}thiếu: ka: A02 in commands\/x$/m, phang.stdout);
  const goi = giuKhoa(chayCay(dungCay({ ka: ca })), chayCay(dungCay({ ka: [ca[0], ca[1]] })));
  assert.equal(goi.status, 1, goi.stdout);
  assert.match(goi.stdout, /^thiếu 1 khoá$/m, goi.stdout);
  assert.match(goi.stdout, /^ {2}thiếu: ka: A02 in plugins\/acceptance-gate\/commands\/x$/m, goi.stdout);
});

// Bốn hình luật cũ đã xử lý cho cùng kết quả dưới luật xét chỗ (bộ thử TK-MP-hinh của vòng bốn, chép thành kỳ vọng).
test('BK-AC3-hinh', () => {
  const doi = k => k.replace(/^BC old\//, 'BC new/');
  const M = o => new Map(Object.entries(o));
  const X = 'BC old/a'; const Y = 'BC new/a';
  const thieu = (a, b) => soTui(tuiCu(a, b, doi), b).thieu;
  assert.deepEqual(thieu(M({ 'BC z': 1 }), M({ 'BC z': 1 })), [], 'không đổi');
  assert.deepEqual(thieu(M({ [X]: 1 }), M({ [Y]: 1 })), [], 'đổi thường');
  assert.deepEqual(thieu(M({ [X]: 1 }), M({ [X]: 1 })), [], 'tên nguyên chữ');
  assert.deepEqual(thieu(M({ [X]: 1 }), M({})), [Y], 'mất thật báo bằng tên mới');
  assert.deepEqual(thieu(M({ [X]: 1, [Y]: 1 }), M({ [X]: 1, [Y]: 1 })), [], 'hai tên');
  // Cây mới CÓ tên mới mà chỗ đã bị giữ (bởi bản lặp thứ nhất, hay bởi khoá cây cũ đã mang sẵn tên mới) → báo tên nguyên
  // chữ: luật vòng bốn, chủ kho phê ở Treo-1 (Cổng Bằng chứng phan-du-bo-cuc-moi-vong-bon).
  assert.deepEqual(thieu(M({ [X]: 2 }), M({ [Y]: 1 })), [X], 'tên mới hết chỗ do bản lặp → báo tên nguyên chữ');
  assert.deepEqual(thieu(M({ [X]: 1, [Y]: 1 }), M({ [Y]: 1 })), [X], 'tên mới bị khoá khác giữ → báo tên nguyên chữ');
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

// ── AC-4 — chạy lại bước đỏ ở CẢ HAI cây (lời chủ kho «Chạy lại bước đỏ», 17/11, sổ hồ sơ) ─────────────────────────
// Bước `lc` là bước TAP thật (cùng hình bước dieu-phoi): `nhay` đỏ lần đầu, xanh từ lần thứ hai (dấu ở trong cây);
// `luon` luôn đỏ; `xanh` luôn xanh. Lượt chạy là CHÍNH chay-bo-kiem.sh, chạy lại là CHÍNH chay-lai-do.sh.
const CHAY_BK = path.join(DAY, 'chay-bo-kiem.sh');
const LAI = path.join(DAY, 'chay-lai-do.sh');
const GATE_LC = ['      - name: lc suite', '        if: github.event_name == \'push\'', '        run: node --test --test-reporter=tap "tests/lc/**/*.test.mjs"'].join('\n');
const LC = {
  nhay: "import { test } from 'node:test'; import fs from 'node:fs';\nconst p = new URL('./.da-chay', import.meta.url);\ntest('LC-1 nhay', () => { if (!fs.existsSync(p)) { fs.writeFileSync(p, ''); throw new Error('lần đầu'); } });\n",
  luon: "import { test } from 'node:test';\ntest('LC-1 nhay', () => { throw new Error('luôn đỏ'); });\n",
  xanh: "import { test } from 'node:test';\ntest('LC-1 nhay', () => {});\n",
};
function dotLai(kieuA, kieuB) {
  const T = moTam('gk-lai-');
  for (const [v, k] of [['A', kieuA], ['B', kieuB]]) {
    const c = path.join(T, v, 'delivery-loop');
    fs.cpSync(dungCay({ them: GATE_LC }), c, { recursive: true });
    fs.mkdirSync(path.join(c, 'tests', 'lc'), { recursive: true });
    fs.writeFileSync(path.join(c, 'tests', 'lc', 'a.test.mjs'), LC[k]);
    const r = spawnSync('bash', [CHAY_BK, c, path.join(T, 'out', v)], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
  }
  return T;
}
const chayLai = (T) => spawnSync('bash', [LAI, T], { encoding: 'utf8' });
const baoCaoLai = (T) => { const ra = moTam('gk-ra-'); ghiBaoCao({ T, nguon: S40, cay: C40, ra, bo: path.join(moTam('gk-bo-'), 'trong.tsv'), so: null }); return ra; };
const dongBuoc = (ra, ten) => fs.readFileSync(path.join(ra, 'giu-khoa', 'buoc.tsv'), 'utf8').split('\n').find(d => d.startsWith(`${ten}\t`));

test('BK-AC4-chay-lai', () => {
  const T = dotLai('nhay', 'nhay');
  const truoc = kiem(baoCaoLai(T)).loi;
  assert.ok(truoc.includes('bước lc thoát 1 ở cây cũ') && truoc.includes('bước lc thoát 1 ở cây mới'), 'đối chứng: lần đầu đỏ ở cả hai cây — ' + truoc.join(' · '));
  const r = chayLai(T);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^chay-lai-do: lc — lần đầu 1 · 1, chạy lại lần lượt 0 · 0$/m, r.stdout);
  for (const v of ['A', 'B']) {
    const d = fs.readFileSync(path.join(T, 'out', `${v}-lai`, 'ketqua.tsv'), 'utf8').split('\n').filter(Boolean).map(x => x.split('\t')[0]);
    assert.deepEqual(d, ['lc', 'XONG'], `cây ${v}: chỉ chạy lại bước đỏ ở cả hai cây`);
  }
  const ra = baoCaoLai(T);
  assert.equal(dongBuoc(ra, 'lc'), 'lc\ttap\t1\t1\t0\t0', 'buoc.tsv giữ mã lần đầu và mã chạy lại');
  assert.equal(dongBuoc(ra, 'ka'), 'ka\tbash\t0\t0\t-\t-');
  const k = kiem(ra);
  assert.deepEqual(k.loi, [], k.loi.join('\n'));
  assert.ok(k.dong.some(d => /^AC-4 đạt: báo cáo đo trên nguồn aaaaaaaa, cây mới bbbbbbbb dựng lại khớp; 4 bước thoát 0 ở cả hai cây, trong đó 1 bước đỏ ở cả hai cây đã chạy lại một lần, lần lượt từng cây \(lc\); giữ đủ 7\/7 khoá, bỏ 0$/.test(d)), k.dong.join('\n'));
  assert.match(fs.readFileSync(path.join(ra, 'giu-khoa.md'), 'utf8'), /^\| lc \| tap \| 1 \| 1 \| 0 \| 0 \|$/m);
  const r2 = chayLai(T);
  assert.equal(r2.status, 2, r2.stdout);
  assert.match(r2.stderr, /^chay-lai-do: đã chạy lại một lần — không chạy lần hai$/m);
});

test('BK-AC4-chay-lai-mot-cay', () => {
  const T = dotLai('nhay', 'xanh');
  const r = chayLai(T);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /^chay-lai-do: không bước nào đỏ ở cả hai cây$/m);
  assert.ok(!fs.existsSync(path.join(T, 'out', 'A-lai')) && !fs.existsSync(path.join(T, 'out', 'B-lai')), 'bước đỏ ở một cây không bao giờ được chạy lại');
  const k = kiem(baoCaoLai(T));
  assert.ok(k.loi.includes('bước lc thoát 1 ở cây cũ'), k.loi.join('\n'));
});

test('BK-AC4-chay-lai-van-do', () => {
  const T = dotLai('luon', 'luon');
  const r = chayLai(T);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /^chay-lai-do: lc — lần đầu 1 · 1, chạy lại lần lượt 1 · 1$/m);
  const k = kiem(baoCaoLai(T));
  assert.ok(k.loi.includes('bước lc chạy lại vẫn thoát 1 ở cây cũ') && k.loi.includes('bước lc chạy lại vẫn thoát 1 ở cây mới'), k.loi.join('\n'));
});

test('BK-AC4-chay-lai-gia', () => {
  const T = dotLai('xanh', 'xanh');
  assert.deepEqual(kiem(baoCaoLai(T)).loi, [], 'đối chứng dương: hai cây xanh, không chạy lại');
  for (const v of ['A', 'B']) {
    const r = spawnSync('bash', [CHAY_BK, path.join(T, v, 'delivery-loop'), path.join(T, 'out', `${v}-lai`)], { encoding: 'utf8', env: { ...process.env, CHI_BUOC: 'lc' } });
    assert.equal(r.status, 0, r.stderr);
  }
  const ra = baoCaoLai(T);
  const k = kiem(ra);
  assert.ok(k.loi.includes('bước lc được chạy lại mà không đỏ ở cả hai cây'), k.loi.join('\n'));
  assert.match(fs.readFileSync(path.join(ra, 'giu-khoa.md'), 'utf8'), /^phan_quyet: khong-do$/m);
});
