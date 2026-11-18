// kho-tieu-thu.test.mjs — kiểm hai chiều cho sổ «kho tiêu thụ đang dựa vào gì».
// Chạy: node --test migration/tra-soat/kho-tieu-thu.test.mjs
//
// Kho tiêu thụ giả do mã dựng trong lượt chạy; tên tệp và lệnh của kit lấy từ sổ kiểm kê thật (không gõ tay), nên khi kit
// đổi, ca vẫn bám đúng thứ đang có. Mỗi dòng của kho giả nhắm đúng một loại; dòng ở hồ sơ đã ký và docs/ phải im.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { kiemKe } from './kiem-ke.mjs';
import { doiChieu } from './kho-tieu-thu.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KHO_KIT = execFileSync('git', ['-C', DAY, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const kit = kiemKe({ kho: KHO_KIT, ref: process.env.KIEM_KE_REF || 'kit-cu/main', luat: path.join(DAY, 'luat-xep.json') });
const sp = kit.hang.filter(h => h.lop === 'san-pham');
const SCRIPT_LOI = sp.find(h => h.plugin === 'acceptance-gate' && /^scripts\/[\w-]+\.mjs$/.test(h.tep)).tep;
const SCRIPT_LOI_2 = sp.find(h => h.plugin === 'acceptance-gate' && /^scripts\/[\w-]+\.mjs$/.test(h.tep) && h.tep !== SCRIPT_LOI).tep;
const SCRIPT_FL = sp.find(h => h.plugin === 'feature-loop' && /^feature-loop\/scripts\/[\w-]+\.mjs$/.test(h.tep)).tep;
const LENH_RM = sp.find(h => h.plugin === 'road-map' && /^road-map\/commands\/[\w-]+\.md$/.test(h.tep)).tep.match(/commands\/([\w-]+)\.md$/)[1];

let tam, kq;
const viet = (f, s) => { fs.mkdirSync(path.dirname(path.join(tam, f)), { recursive: true }); fs.writeFileSync(path.join(tam, f), s); };
const loai = (tep) => kq.hang.filter(h => h.tep === tep).map(h => [h.dong, h.loai, h.gay, h.tep_kit || h.chu]);

before(() => {
  tam = fs.mkdtempSync(path.join(os.tmpdir(), 'kho-tieu-thu-test-'));
  viet('.claude/settings.json', '{\n"dieu-phoi@acceptance-gate-kit": true,\n"acceptance-gate@acceptance-gate-kit": true\n}\n');
  viet('.github/workflows/ci.yml', [
    'git clone https://github.com/phanlemanh/acceptance-gate-kit "$T"',
    `node "$CLAUDE_PLUGIN_ROOT/${SCRIPT_FL}" --root .`,
    `node "$K/${SCRIPT_LOI}" --root .`,
  ].join('\n') + '\n');
  viet(SCRIPT_LOI_2, '// bản chép của kho\n');
  viet('Makefile', `kiem:\n\tnode ${SCRIPT_LOI_2}\n`);
  viet('README.md', [`Gõ /road-map:${LENH_RM} để xem.`, 'Gõ /feature-loop:feature-loop để mở vòng.', 'Xem road-map:ke-hoach-quy — giống lệnh mà kit không có lệnh ấy.'].join('\n') + '\n');
  viet('_acceptance/vong-a/contract.md', 'dieu-phoi@acceptance-gate-kit\n/road-map:xem\n');
  viet('docs/ghi-chep.md', 'acceptance-gate-kit\n');
  const g = (...a) => execFileSync('git', ['-C', tam, ...a]);
  g('init', '-q', '-b', 'main'); g('add', '-A'); g('-c', 'user.name=t', '-c', 'user.email=t@thu.local', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'gia');
  kq = doiChieu({ kho: tam, ten: 'gia', ref: 'main', kit });
});
after(() => { if (tam) fs.rmSync(tam, { recursive: true, force: true }); });

test('KT-01 khoá bật plugin: plugin đổi tên và plugin giữ tên tách đúng', () => {
  assert.deepEqual(loai('.claude/settings.json'), [
    [2, 'id-plugin', 'doi-ten-cho-va-plugin', 'dieu-phoi@acceptance-gate-kit'],
    [3, 'id-plugin', 'doi-ten-cho', 'acceptance-gate@acceptance-gate-kit'],
  ]);
});

test('KT-02 quy trình tự động: url kho, gọi plugin con qua gốc lõi, gọi lõi qua biến gốc', () => {
  const h = loai('.github/workflows/ci.yml');
  assert.deepEqual(h.filter(x => x[1] !== 'tim-kit'), [
    [1, 'ten-cho-hoac-ten-kho', 'url-kho-hoac-cho', 'acceptance-gate-kit'],
    [2, 'duong-dan-vao-kit', 'goi-plugin-con-qua-goc-loi', SCRIPT_FL],
    [3, 'duong-dan-vao-kit', 'dung-neu-goc-la-ban-cai-gay-neu-goc-la-kho', SCRIPT_LOI],
  ]);
});

test('KT-03 kho giữ bản chép một tệp kit: chữ gọi nó là gọi bản chép, và sổ liệt kê bản chép', () => {
  assert.deepEqual(loai('Makefile'), [[2, 'duong-dan-vao-ban-chep', 'khong-gay-doi-nguon-chep', SCRIPT_LOI_2]]);
  assert.deepEqual(kq.ban_chep.map(b => [b.tep, b.giong_kit]), [[SCRIPT_LOI_2, 'khac']]);
});

test('KT-04 lệnh: chỉ tên lệnh có thật trong kit; «road-map:<chữ lạ>» im', () => {
  assert.deepEqual(loai('README.md'), [
    [1, 'lenh-skill', 'doi-ten-plugin', `road-map:${LENH_RM}`],
    [2, 'lenh-skill', 'giu-ten', 'feature-loop:feature-loop'],
  ]);
});

test('KT-05 hồ sơ đã ký và docs/ chỉ đếm, không vào sổ', () => {
  assert.deepEqual(kq.hang.filter(h => h.tep.startsWith('_acceptance/') || h.tep.startsWith('docs/')), []);
  assert.equal(kq.dong_lich_su, 3);
});
