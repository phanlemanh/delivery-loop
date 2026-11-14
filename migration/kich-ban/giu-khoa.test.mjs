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

const DAY = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DAY, '..', '..');
const CHAY = path.join(DAY, 'chay-bo-kiem.sh');
const GK = path.join(DAY, 'giu-khoa.mjs');
const tam = [];
after(() => { for (const d of tam) fs.rmSync(d, { recursive: true, force: true }); });
const moTam = (t = 'gk-') => { const d = fs.mkdtempSync(path.join(os.tmpdir(), t)); tam.push(d); return d; };
const ghi = (goc, p, s) => { fs.mkdirSync(path.dirname(path.join(goc, p)), { recursive: true }); fs.writeFileSync(path.join(goc, p), s); };

const GATE = (them = '') => [
  'name: gate', 'on: [push]', 'jobs:', '  tests:', '    name: tests', '    runs-on: ubuntu-latest', '    steps:',
  '      - uses: actions/checkout@v7', '        if: github.event_name == \'push\'',
  '      - name: cài zsh', '        if: github.event_name == \'push\'', '        run: sudo apt-get install -y zsh',
  '      - name: ka suite', '        if: github.event_name == \'push\'', '        run: bash tests/ka/run-tests.sh',
  '      - name: dp suite', '        if: github.event_name == \'push\'', '        run: node --test --test-reporter=tap "tests/dp/**/*.test.mjs"',
  '      - name: ban do', '        if: github.event_name == \'push\'', '        run: node tests/product-map.mjs --root . --check',
  them, '  khac:', '    runs-on: ubuntu-latest', '    steps:', '      - run: bash tests/khong-phai.sh', ''].join('\n');

// Bộ bash giả: nạp bo-chay.sh thật (chép vào cây), in mỗi ca một dòng PASS/FAIL. `ca` = mảng [kết, tên].
const boBash = (ca, chetSau = null) => ['#!/usr/bin/env bash', 'HERE="$(cd "$(dirname "$0")" && pwd)"',
  '. "$HERE/../bo-chay.sh"', 'bc_tg_mo ka all "$HERE/../.."',
  ...ca.flatMap(([k, t], i) => [...(chetSau !== null && i === chetSau ? ['exit 1'] : []), `echo "  ${k}: ${t}"`]),
  'bc_tg_dong', 'exit 0', ''].join('\n');
// Tệp ca node: `ten` các ca tầng ngoài; một ca có test con; `skip` các tên đánh skip.
const tepNode = (ten, skip = []) => ["import { test } from 'node:test';",
  ...ten.map(t => skip.includes(t) ? `test(${JSON.stringify(t)}, { skip: true }, () => {});`
    : `test(${JSON.stringify(t)}, async (c) => { await c.test('con', () => {}); });`), ''].join('\n');

function dungCay({ ka = [['PASS', 'A01 dau'], ['PASS', 'A02 hai'], ['PASS', 'A03 ba']], dp = ['DP-1 mot', 'DP-2 hai'], skip = [], banDo = 0, chetSau = null, them = '' } = {}) {
  const c = path.join(moTam('gk-cay-'), 'delivery-loop');
  ghi(c, '.github/workflows/gate.yml', GATE(them));
  ghi(c, 'tests/bo-chay.sh', fs.readFileSync(path.join(ROOT, 'tests', 'bo-chay.sh'), 'utf8'));
  ghi(c, 'tests/ka/run-tests.sh', boBash(ka, chetSau));
  ghi(c, 'tests/dp/a.test.mjs', tepNode(dp, skip));
  ghi(c, 'tests/product-map.mjs', `process.exit(${banDo});\n`);
  ghi(c, 'tests/khong-phai.sh', 'exit 9\n');
  return c;
}
const chayCay = (cay) => {
  const out = moTam('gk-out-');
  const r = spawnSync('bash', [CHAY, cay, out], { encoding: 'utf8' });
  assert.equal(r.status, 0, `chay-bo-kiem.sh hỏng: ${r.stderr}`);
  return out;
};
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
