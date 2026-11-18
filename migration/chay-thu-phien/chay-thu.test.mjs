// chay-thu.test.mjs — kiểm hai chiều cho ca «chạy thử phiên thật» của thước B1.
// Chạy: node --test migration/chay-thu-phien/chay-thu.test.mjs   (khoảng một phút, 0 token)
//
// Cây gốc do mã dựng trong lượt chạy từ nhánh chính kho cũ (đổi bằng CHAY_THU_REF). Lệnh bị xoá, plugin bị làm hỏng và
// tệp không-phải-sản-phẩm bị sửa đều chọn bằng mã từ chính cây ấy, không gõ tay — kit đổi thì ca vẫn bám đúng thứ đang có.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chayThu, dungCay, soSanh, moiTruongTach } from './chay-thu.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const REF = process.env.CHAY_THU_REF || 'kit-cu/main';
const KHO = process.env.CHAY_THU_KHO || DAY; // để chạy bản sao có tiêm lỗi ở ngoài kho
const BANG = JSON.parse(fs.readFileSync(path.join(DAY, 'bang-ten.json'), 'utf8'));

let goc;
let doGoc;
const tam = [];

function banSao(sua) {
  const dich = fs.mkdtempSync(path.join(path.dirname(goc), 'chay-thu-ban-sao-'));
  tam.push(dich);
  fs.cpSync(goc, dich, { recursive: true });
  sua(dich);
  return dich;
}

before(() => {
  goc = dungCay({ kho: KHO, ref: REF });
  tam.push(goc);
  doGoc = chayThu({ cay: goc });
});

after(() => { for (const d of tam) fs.rmSync(d, { recursive: true, force: true }); });

test('đối chứng dương: cây nguyên vẹn qua đủ ba lớp và so với chính nó là đạt', () => {
  assert.ok(doGoc.plugin_khai.length > 0, 'tệp khai chợ không có plugin nào');
  assert.deepEqual(doGoc.nap.plugin, doGoc.plugin_khai, 'phiên không nạp đủ plugin khai trong chợ');
  for (const [p, v] of Object.entries(doGoc.tinh.plugin)) assert.equal(v, 'hop-le', `lớp tĩnh: ${p}`);
  for (const [p, v] of Object.entries(doGoc.cai.cai)) assert.equal(v, true, `lớp cài: ${p}`);
  for (const p of doGoc.plugin_khai) {
    assert.ok(doGoc.nap.lenh.some(l => l.startsWith(`${p}:`)), `plugin ${p} không nạp lệnh hay skill nào`);
  }
  const k = soSanh(doGoc, doGoc);
  assert.equal(k.dat, true);
});

test('hai lần đo trên cùng cây ra cùng kết quả', () => {
  assert.deepEqual(chayThu({ cay: goc }), doGoc);
});

test('bảng tên chỉ nhắc lệnh và plugin đang có ở cây gốc', () => {
  for (const cu of Object.keys(BANG.lenh)) assert.ok(doGoc.nap.lenh.includes(cu), `bảng tên nhắc lệnh không có: ${cu}`);
  for (const cu of Object.keys(BANG.plugin)) assert.ok(doGoc.plugin_khai.includes(cu), `bảng tên nhắc plugin không có: ${cu}`);
});

test('độ nhạy: xoá một tệp lệnh thì đúng lệnh ấy hiện ở «mat»', () => {
  const thuMuc = path.join(goc, 'road-map', 'commands');
  const tep = fs.readdirSync(thuMuc).filter(f => f.endsWith('.md')).sort()[0];
  assert.ok(tep, 'cây gốc không có lệnh road-map nào để xoá');
  const ten = `road-map:${tep.replace(/\.md$/, '')}`;
  assert.ok(doGoc.nap.lenh.includes(ten), `đối chứng: cây gốc phải nạp ${ten}`);
  const moi = chayThu({ cay: banSao(d => fs.rmSync(path.join(d, 'road-map', 'commands', tep))) });
  const k = soSanh(doGoc, moi);
  assert.equal(k.dat, false);
  assert.deepEqual(k.lenh.mat, [ten]);
  assert.deepEqual(k.lenh.thua, []);
  assert.deepEqual(k.plugin.mat, []);
});

test('độ nhạy: hỏng tệp khai một plugin thì lớp tĩnh đỏ đúng tên và plugin ấy hiện ở «mat»', () => {
  const p = 'feature-loop';
  const moi = chayThu({ cay: banSao(d => fs.writeFileSync(path.join(d, p, '.claude-plugin', 'plugin.json'), '{')) });
  const k = soSanh(doGoc, moi);
  assert.equal(k.dat, false);
  assert.ok(k.hong.includes(`tĩnh: ${p} khong-hop-le`), `hong = ${JSON.stringify(k.hong)}`);
  assert.deepEqual(k.plugin.mat, [p]);
});

test('độ đặc hiệu: sửa tài liệu, hồ sơ vòng và thêm sổ làm việc thì phép đo im', () => {
  const hoSo = fs.readdirSync(path.join(goc, '_acceptance')).sort().find(d => fs.existsSync(path.join(goc, '_acceptance', d, 'contract.md')));
  assert.ok(hoSo, 'cây gốc không có hồ sơ vòng nào để sửa');
  const moi = chayThu({ cay: banSao(d => {
    fs.appendFileSync(path.join(d, 'docs', 'MAP.md'), '\nsửa thử\n');
    fs.appendFileSync(path.join(d, '_acceptance', hoSo, 'contract.md'), '\nsửa thử\n');
    fs.writeFileSync(path.join(d, 'docs', 'plans', 'chay-thu-hat-giong-gia.md'), '# giả\n');
  }) });
  assert.deepEqual(moi, doGoc);
  assert.equal(soSanh(doGoc, moi).dat, true);
});

test('bảng tên: đổi đúng thì đạt, thiếu tên mới thì «mat», còn tên cũ thì «thua»', () => {
  const mau = lenh => ({ nap: { plugin: [...new Set(lenh.map(l => l.split(':')[0]))].sort(), lenh, tac_tu: [] },
    tinh: { cho: true, plugin: {} }, cai: { them_cho: true, cai: {} } });
  const cu = mau(['dieu-phoi:mo-dot', 'dieu-phoi:khac', 'road-map:xem']);
  assert.equal(soSanh(cu, mau(['dispatch:open', 'dispatch:khac', 'roadmap:status']), BANG).dat, true);
  const thieu = soSanh(cu, mau(['dispatch:khac', 'roadmap:status']), BANG);
  assert.deepEqual(thieu.lenh.mat, ['dispatch:open']);
  const conCu = soSanh(cu, mau(['dispatch:open', 'dispatch:khac', 'roadmap:status', 'road-map:xem']), BANG);
  assert.deepEqual(conCu.lenh.thua, ['road-map:xem']);
  assert.deepEqual(conCu.plugin.thua, ['road-map']);
});

test('môi trường của phiên thử không mang khoá API hay mã đăng nhập', () => {
  const cu = { ...process.env };
  process.env.ANTHROPIC_API_KEY = 'gia';
  process.env.CLAUDE_CODE_OAUTH_TOKEN = 'gia';
  try {
    const env = moiTruongTach('/khong-co');
    assert.equal(env.ANTHROPIC_API_KEY, undefined);
    assert.equal(env.CLAUDE_CODE_OAUTH_TOKEN, undefined);
    assert.equal(env.CLAUDE_CONFIG_DIR, '/khong-co');
  } finally {
    for (const k of ['ANTHROPIC_API_KEY', 'CLAUDE_CODE_OAUTH_TOKEN']) { if (k in cu) process.env[k] = cu[k]; else delete process.env[k]; }
  }
});
