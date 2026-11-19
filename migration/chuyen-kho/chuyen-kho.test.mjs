// chuyen-kho.test.mjs — kiểm hai chiều cho công cụ kiểm chuyển kho.
// Chạy: node --test migration/chuyen-kho/chuyen-kho.test.mjs   (vài giây, 0 token, không mở phiên claude nào)
//
// Dữ liệu thử là lịch sử THẬT của onehub-inventory: mọi cây do mã xuất bằng `git archive` vào thư mục tạm trong chính
// lượt chạy, lỗi tiêm vào BẢN SAO. Bản kéo Inventory mặc định là thư mục anh em của kho này; đổi bằng KHO_INVENTORY.
// Thiếu bản kéo hoặc thiếu commit mốc thì ca ĐỎ với «không đọc được ở đây: …» — không bỏ qua lặng lẽ.
// Mỗi ca âm tính có đối chứng dương đi trước và ghim đúng thông điệp, không chỉ mã thoát.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHO_CU, CHO_MOI, PLUGIN_MOI, TEP_CAI_DAT, THU_MUC_WORKFLOW, kiemK6, pluginCu, timInit } from './luat.mjs';
import { soanCaiDat } from './soan.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const GOC_KHO = path.resolve(DAY, '..', '..');
const INVENTORY = path.resolve(process.env.KHO_INVENTORY || path.join(GOC_KHO, '..', 'onehub-inventory'));
const MOC = { truoc: '47d52b06^1', cai: '47d52b06', sach: 'f6c47332' };
const CONG_CU = path.join(DAY, 'chuyen-kho.mjs');
const BANG = JSON.parse(fs.readFileSync(path.join(DAY, '..', 'chay-thu-phien', 'bang-ten.json'), 'utf8'));
const BO_DEM = 1024 * 1024 * 1024;
const K6_KHONG_DO = 'không đo (thiếu --phien)';
const tam = [];

after(() => { for (const d of tam) fs.rmSync(d, { recursive: true, force: true }); });

function thuMucTam(ten) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), `chuyen-kho-${ten}-`));
  tam.push(d);
  return d;
}

function xetInventory() {
  if (!fs.existsSync(path.join(INVENTORY, '.git'))) {
    return `không đọc được ở đây: không thấy bản kéo onehub-inventory tại ${INVENTORY} (đổi bằng biến KHO_INVENTORY)`;
  }
  const thieu = Object.values(MOC).filter(ref =>
    spawnSync('git', ['-C', INVENTORY, 'rev-parse', '--verify', '--quiet', `${ref}^{commit}`]).status !== 0);
  return thieu.length > 0 ? `không đọc được ở đây: bản kéo ${INVENTORY} thiếu commit mốc ${thieu.join(', ')}` : '';
}

let loiInventory = null;
function canInventory() {
  if (loiInventory === null) loiInventory = xetInventory();
  if (loiInventory) throw new Error(loiInventory);
}

/** Xuất cây thật của Inventory tại `ref` vào một thư mục tạm mới và biến nó thành kho git trống lịch sử. */
function banSao(ref) {
  canInventory();
  const dich = thuMucTam('ban-sao');
  const tar = execFileSync('git', ['-C', INVENTORY, 'archive', ref], { maxBuffer: BO_DEM });
  execFileSync('tar', ['-x', '--exclude', '.env*', '-C', dich], { input: tar });
  execFileSync('git', ['-C', dich, 'init', '-q']);
  return dich;
}

const tepThat = (ref, tep) => execFileSync('git', ['-C', INVENTORY, 'show', `${ref}:${tep}`], { encoding: 'utf8', maxBuffer: BO_DEM });
const doc = (dich, tep) => fs.readFileSync(path.join(dich, tep), 'utf8');

function chay(args) {
  const r = spawnSync(process.execPath, [CONG_CU, ...args], { encoding: 'utf8', maxBuffer: BO_DEM });
  assert.equal(r.error, undefined, `không chạy được công cụ: ${r.error?.message}`);
  const cacDong = r.stdout.trimEnd().split('\n');
  const k = Object.fromEntries(cacDong.map(d => /^(K\d): (.*)$/.exec(d)).filter(Boolean).map(m => [m[1], m[2]]));
  return { ma: r.status, ra: r.stdout, loi: r.stderr, k, ket: cacDong[cacDong.length - 1] };
}

/** Sửa một tệp của bản sao bằng hàm; khẳng định tệp ĐÃ đổi — bước tiêm hỏng thì ca đỏ ở đây chứ không xanh giả. */
function sua(dich, tep, ham) {
  const truoc = doc(dich, tep);
  const sau = ham(truoc);
  assert.notEqual(sau, truoc, `bước tiêm không đổi gì ở ${tep}`);
  fs.writeFileSync(path.join(dich, tep), sau);
  return sau;
}

function viet(dich, tep, chu) {
  fs.mkdirSync(path.dirname(path.join(dich, tep)), { recursive: true });
  fs.writeFileSync(path.join(dich, tep), chu);
}

/** Đối chứng dương: cây này phải XANH trọn năm điểm trước khi tin bất cứ màu đỏ nào tiêm vào nó. */
function phaiXanh(args, nhan) {
  const r = chay(args);
  assert.equal(r.ma, 0, `đối chứng dương (${nhan}) phải thoát 0, thấy ${r.ma}: ${r.ra}${r.loi}`);
  for (const ma of ['K1', 'K2', 'K3', 'K4', 'K5']) assert.match(r.k[ma] ?? '', /^ĐẠT — /, `đối chứng dương (${nhan}): ${ma}`);
  assert.equal(r.k.K6, K6_KHONG_DO);
  assert.equal(r.ket, 'KẾT: ĐẠT');
  return r;
}

const soLichSu = dongK5 => Number(/đã loại trừ (\d+) tệp lịch sử/.exec(dongK5)?.[1] ?? NaN);
const soDongCo = (chu, kim) => chu.split('\n').findIndex(d => d.includes(kim)) + 1;

test('(a) cây sạch f6c47332: thoát 0, năm điểm ĐẠT — đọc qua --ref và đọc bản sao cây làm việc cho cùng kết quả', () => {
  canInventory();
  const quaRef = phaiXanh(['--kho', INVENTORY, '--ref', MOC.sach], 'qua --ref');
  const quaCay = phaiXanh(['--kho', banSao(MOC.sach)], 'bản sao cây làm việc');
  assert.deepEqual(quaCay.k, quaRef.k, 'hai bộ đọc (git tại commit · cây làm việc) lệch nhau');
  assert.match(quaRef.k.K3, /ci\.yml: kéo phanlemanh\/delivery-loop, KIT_TAG v3\.0\.0, CLAUDE_PLUGIN_ROOT \S+\/plugins\/acceptance-gate$/);
  const coPhien = chay(['--kho', INVENTORY, '--ref', MOC.sach, '--phien']);
  assert.equal(coPhien.k.K6, 'không đo (phiên chỉ mở được trên cây làm việc — bỏ --ref để đo)');
  assert.equal(coPhien.ma, 0, 'K6 không đo thì không tính vào kết luận');
});

test('(b) cây trước khi cài 47d52b06^1: thoát 1, K1 K2 K3 đều CHƯA (thực tế K4 K5 cũng CHƯA)', () => {
  canInventory();
  phaiXanh(['--kho', INVENTORY, '--ref', MOC.sach], 'f6c47332');
  const r = chay(['--kho', INVENTORY, '--ref', MOC.truoc]);
  const cu = pluginCu(BANG);
  assert.equal(r.ma, 1);
  assert.equal(r.k.K1, `CHƯA — ${TEP_CAI_DAT}: extraKnownMarketplaces không khai chợ «${CHO_MOI}»; `
    + PLUGIN_MOI.map(p => `enabledPlugins["${p}@${CHO_MOI}"] không có dòng, cần true`).join('; '));
  assert.equal(r.k.K2, `CHƯA — ${TEP_CAI_DAT}: chưa tắt đích danh 6/6 plugin chợ cũ: `
    + `${cu.map(p => `"${p}@${CHO_CU}" (= true)`).join(', ')} — ghi chú: extraKnownMarketplaces còn khai chợ «${CHO_CU}»`);
  assert.equal(r.k.K3, 'CHƯA — .github/workflows/ci.yml:83 còn «acceptance-gate-kit»; '
    + '.github/workflows/ci.yml: không kéo từ phanlemanh/delivery-loop; .github/workflows/ci.yml:72 KIT_TAG = v2.38.1, cần v3.x; '
    + '.github/workflows/ci.yml:85 CLAUDE_PLUGIN_ROOT = $RUNNER_TEMP/kit, cần …/plugins/acceptance-gate');
  assert.equal(r.k.K4, 'CHƯA — 1 chỗ còn khoá chợ cũ, cần người sửa: tools/kit-root.mjs:44 ("acceptance-gate@acceptance-gate-kit")');
  assert.equal(r.k.K5, 'CHƯA — 5 chỗ nhắc tên lệnh/skill cũ, cần người xem: _acceptance/config.yaml:220 dieu-phoi:mo-dot → dispatch:open; '
    + 'docs/plan/dot-nen/README.md:3 dieu-phoi:mo-dot → dispatch:open; docs/plan/lo-trinh.json:4 acceptance-gate:cat-luot → acceptance-gate:scope-slice; '
    + 'docs/tri-thuc/TRI-THUC.md:9 tri-thuc:ghi → knowledge:ingest; docs/tri-thuc/TRI-THUC.md:9 tri-thuc:kiem → knowledge:health '
    + '(đã loại trừ 2 tệp lịch sử có nhắc)');
  assert.equal(r.ket, 'KẾT: CHƯA (5 điểm)');
});

test('(c) commit cài 47d52b06 (chưa tắt chợ cũ): thoát 1, đúng MỘT điểm chưa đạt là K2', () => {
  canInventory();
  phaiXanh(['--kho', INVENTORY, '--ref', MOC.sach], 'f6c47332');
  const r = chay(['--kho', INVENTORY, '--ref', MOC.cai]);
  assert.equal(r.ma, 1);
  assert.equal(r.k.K2, `CHƯA — ${TEP_CAI_DAT}: chưa tắt đích danh 6/6 plugin chợ cũ: `
    + pluginCu(BANG).map(p => `"${p}@${CHO_CU}" (không có dòng)`).join(', '));
  for (const ma of ['K1', 'K3', 'K4', 'K5']) assert.match(r.k[ma], /^ĐẠT — /, ma);
  assert.equal(r.ket, 'KẾT: CHƯA (1 điểm)');
});

test('(d1) độ nhạy K2: gỡ một dòng tắt khỏi bản sao sạch → K2 đỏ, nêu đúng tên plugin bị gỡ', () => {
  const dich = banSao(MOC.sach);
  const xanh = phaiXanh(['--kho', dich], 'bản sao sạch');
  const khoa = `${pluginCu(BANG)[3]}@${CHO_CU}`;
  sua(dich, TEP_CAI_DAT, chu => {
    const cd = JSON.parse(chu);
    const { [khoa]: _bo, ...con } = cd.enabledPlugins;
    return `${JSON.stringify({ ...cd, enabledPlugins: con }, null, 2)}\n`;
  });
  const r = chay(['--kho', dich]);
  assert.equal(r.ma, 1);
  assert.equal(r.k.K2, `CHƯA — ${TEP_CAI_DAT}: chưa tắt đích danh 1/6 plugin chợ cũ: "${khoa}" (không có dòng)`);
  assert.deepEqual({ ...r.k, K2: xanh.k.K2 }, xanh.k, 'chỉ K2 được đổi');
  assert.equal(r.ket, 'KẾT: CHƯA (1 điểm)');
});

test('(d2) độ nhạy K3: đổi KIT_TAG về v2.39.0 trên bản sao sạch → K3 đỏ, nêu tệp:dòng và giá trị thấy được', () => {
  const dich = banSao(MOC.sach);
  const xanh = phaiXanh(['--kho', dich], 'bản sao sạch');
  const tep = fs.readdirSync(path.join(dich, THU_MUC_WORKFLOW)).map(t => `${THU_MUC_WORKFLOW}/${t}`).find(t => doc(dich, t).includes('KIT_TAG:'));
  assert.ok(tep, 'cây sạch không có workflow nào mang KIT_TAG — không còn gì để tiêm');
  const sau = sua(dich, tep, chu => chu.replace(/KIT_TAG: \S+/, 'KIT_TAG: v2.39.0'));
  const r = chay(['--kho', dich]);
  assert.equal(r.ma, 1);
  assert.equal(r.k.K3, `CHƯA — ${tep}:${soDongCo(sau, 'KIT_TAG: v2.39.0')} KIT_TAG = v2.39.0, cần v3.x`);
  assert.deepEqual({ ...r.k, K3: xanh.k.K3 }, xanh.k, 'chỉ K3 được đổi');
  assert.equal(r.ket, 'KẾT: CHƯA (1 điểm)');
});

test('(d3) độ nhạy K5: thêm một dòng nhắc dieu-phoi:mo-dot vào tệp sống → K5 đỏ, nêu tệp:dòng', () => {
  const dich = banSao(MOC.sach);
  const xanh = phaiXanh(['--kho', dich], 'bản sao sạch');
  const sau = sua(dich, 'README.md', chu => `${chu.trimEnd()}\n\nMở đợt bằng lệnh /dieu-phoi:mo-dot nen.\n`);
  const r = chay(['--kho', dich]);
  assert.equal(r.ma, 1);
  assert.equal(r.k.K5, `CHƯA — 1 chỗ nhắc tên lệnh/skill cũ, cần người xem: README.md:${soDongCo(sau, 'dieu-phoi:mo-dot')} `
    + `dieu-phoi:mo-dot → dispatch:open (đã loại trừ ${soLichSu(xanh.k.K5)} tệp lịch sử có nhắc)`);
  assert.deepEqual({ ...r.k, K5: xanh.k.K5 }, xanh.k, 'chỉ K5 được đổi');
  assert.equal(r.ket, 'KẾT: CHƯA (1 điểm)');
});

test('(e) độ đặc hiệu: sửa tài liệu, thêm hồ sơ _acceptance nhắc tên cũ, sửa wiki/log.md và nhật ký thay đổi → vẫn thoát 0', () => {
  const dich = banSao(MOC.sach);
  const xanh = phaiXanh(['--kho', dich], 'bản sao sạch');
  const cau = `Vòng cũ mở bằng /dieu-phoi:mo-dot, ghi bằng /tri-thuc:ghi; khoá cũ là "acceptance-gate@${CHO_CU}".\n`;
  sua(dich, 'README.md', chu => `${chu.trimEnd()}\n\nMột dòng tài liệu không dính gì tới kit.\n`);
  viet(dich, '_acceptance/ca-thu-chuyen-kho/ghi-chu.md', cau);
  viet(dich, '_acceptance/ca-thu-chuyen-kho/rang.mjs', `export const GHI = ${JSON.stringify(cau)};\n`);
  sua(dich, 'wiki/log.md', chu => `${chu}${cau}`);
  sua(dich, 'CHANGELOG.md', chu => `${chu}${cau}`);
  const r = phaiXanh(['--kho', dich], 'sau khi chạm thứ không phải vật');
  assert.deepEqual({ ...r.k, K5: xanh.k.K5 }, xanh.k, 'K1–K4 không đổi một chữ');
  assert.ok(soLichSu(r.k.K5) > soLichSu(xanh.k.K5), `phép quét phải THẤY các tệp vừa thêm rồi mới loại trừ chúng: ${r.k.K5}`);

  // Chiều ngược của chính ca này: cùng câu ấy đặt ở tệp SỐNG thì phải đỏ — loại trừ không phải vì quét mù.
  viet(dich, 'docs/ghi-chu-song.md', cau);
  viet(dich, 'tools/doc-khoa-cu.mjs', `export const GHI = ${JSON.stringify(cau)};\n`);
  const song = chay(['--kho', dich]);
  assert.equal(song.ma, 1);
  assert.equal(song.k.K4, `CHƯA — 1 chỗ còn khoá chợ cũ, cần người sửa: tools/doc-khoa-cu.mjs:1 ("acceptance-gate@${CHO_CU}")`);
  assert.match(song.k.K5, /^CHƯA — 4 chỗ .*docs\/ghi-chu-song\.md:1 dieu-phoi:mo-dot → dispatch:open; docs\/ghi-chu-song\.md:1 tri-thuc:ghi → knowledge:ingest; tools\/doc-khoa-cu\.mjs:1 /);
  assert.equal(song.ket, 'KẾT: CHƯA (2 điểm)');
});

test('(f) round-trip --soan → git apply → kiểm lại trên cây 47d52b06^1: K1 K2 K3 thành ĐẠT, K4 K5 còn nguyên', () => {
  const dich = banSao(MOC.truoc);
  const workflow = `${THU_MUC_WORKFLOW}/ci.yml`;
  const truoc = chay(['--kho', dich]);
  assert.equal(truoc.ma, 1);
  for (const ma of ['K1', 'K2', 'K3', 'K4', 'K5']) assert.match(truoc.k[ma], /^CHƯA — /, `trước khi vá: ${ma}`);
  const anhTruoc = [TEP_CAI_DAT, workflow].map(t => doc(dich, t));

  const soan = chay(['--kho', dich, '--soan']);
  assert.equal(soan.ma, 0, soan.loi);
  assert.deepEqual([TEP_CAI_DAT, workflow].map(t => doc(dich, t)), anhTruoc, '--soan không được ghi gì vào kho đích');
  assert.match(soan.ra, /^# K4 — không vá tự động: 1 chỗ còn khoá chợ cũ.*tools\/kit-root\.mjs:44/m);
  assert.match(soan.ra, /^# K5 — không vá tự động: 5 chỗ nhắc tên lệnh\/skill cũ/m);

  const tepVa = path.join(thuMucTam('ban-va'), 'de-xuat.patch');
  fs.writeFileSync(tepVa, soan.ra);
  execFileSync('git', ['-C', dich, 'apply', tepVa]);
  const sau = chay(['--kho', dich]);
  for (const ma of ['K1', 'K2', 'K3']) assert.match(sau.k[ma], /^ĐẠT — /, `sau khi vá: ${ma} — ${sau.k[ma]}`);
  assert.deepEqual([sau.k.K4, sau.k.K5], [truoc.k.K4, truoc.k.K5], 'K4 và K5 là việc của người, bản vá không chạm');
  assert.equal(sau.ket, 'KẾT: CHƯA (2 điểm)');
  // Bản vá của máy trùng từng chữ với bản người đã chuyển tay ở Inventory.
  assert.equal(doc(dich, TEP_CAI_DAT), tepThat(MOC.sach, TEP_CAI_DAT));
  assert.equal(doc(dich, workflow), tepThat(MOC.sach, workflow));
  assert.match(chay(['--kho', dich, '--soan']).ra, /^# K1\+K2: \.claude\/settings\.json: không cần vá\n# K3: \.github\/workflows\/ci\.yml: không cần vá$/m);
});

test('soanCaiDat không sửa đầu vào và lặp lại được (vá cây đã vá ra chính nó)', () => {
  canInventory();
  const dongBang = v => (v && typeof v === 'object' ? Object.freeze(Object.fromEntries(Object.entries(v).map(([k, c]) => [k, dongBang(c)]))) : v);
  const goc = dongBang(JSON.parse(tepThat(MOC.truoc, TEP_CAI_DAT)).enabledPlugins);
  const dich = JSON.parse(tepThat(MOC.sach, TEP_CAI_DAT));
  const mot = soanCaiDat({ enabledPlugins: goc, extraKnownMarketplaces: Object.freeze({}) }, BANG);
  assert.deepEqual(Object.entries(mot.enabledPlugins), Object.entries(dich.enabledPlugins), 'đủ khoá, đúng thứ tự người đã viết');
  assert.equal(JSON.stringify(soanCaiDat(dich, BANG)), JSON.stringify(dich));
});

test('(g) K6 — phân tích sự kiện init bằng hàm thuần, sự kiện dựng trong ca, không mở phiên claude', () => {
  const init = nguon => ({ type: 'system', subtype: 'init', plugins: nguon.map(s => ({ name: s.split('@')[0], source: s, version: '3.0.0' })) });
  const du = PLUGIN_MOI.map(p => `${p}@${CHO_MOI}`);
  const dat = kiemK6(init([...du, 'superpowers@claude-plugins-official']), 'may-thu');
  assert.deepEqual(dat, { ma: 'K6', dat: true, lyDo: `máy may-thu: nạp 6/6 plugin @${CHO_MOI}; 0 plugin @${CHO_CU}` });

  const conCu = kiemK6(init([...du, `dieu-phoi@${CHO_CU}`]), 'may-thu');
  assert.equal(conCu.dat, false);
  assert.equal(conCu.lyDo, `máy may-thu: nạp 6/6 plugin @${CHO_MOI}; 1 plugin @${CHO_CU} (dieu-phoi@${CHO_CU})`);

  const thieu = kiemK6(init(du.filter(s => !s.startsWith('roadmap@'))), 'may-thu');
  assert.equal(thieu.dat, false);
  assert.equal(thieu.lyDo, `máy may-thu: nạp 5/6 plugin @${CHO_MOI} (thiếu: roadmap); 0 plugin @${CHO_CU}`);

  const suKien = init(du);
  const dongChay = ['rác không phải json', JSON.stringify({ type: 'system', subtype: 'hook_started' }), JSON.stringify(suKien),
    JSON.stringify({ type: 'result', total_cost_usd: 0 })].join('\n');
  assert.deepEqual(timInit(dongChay), suKien);
  assert.equal(timInit(dongChay.replace('"init"', '"khac"')), null);
});

test('mã thoát 2 — không đọc được ở đây: lý do cụ thể trên stderr, stdout không có dòng KẾT', () => {
  canInventory();
  phaiXanh(['--kho', INVENTORY, '--ref', MOC.sach], 'f6c47332');
  const khongGit = thuMucTam('khong-git');
  const khoTrong = thuMucTam('kho-trong');
  execFileSync('git', ['-C', khoTrong, 'init', '-q']);
  const goc = fs.realpathSync(khoTrong);
  const ca = [
    [['--kho', path.join(khongGit, 'khong-co')], `đường dẫn không phải thư mục: ${path.join(khongGit, 'khong-co')}`],
    [['--kho', khongGit], `không phải kho git: ${khongGit}`],
    [['--kho', khoTrong], `thiếu ${TEP_CAI_DAT} trong ${goc} (cây làm việc)`],
    [['--kho', INVENTORY, '--ref', 'khong-co-commit-nay'], `không thấy commit «khong-co-commit-nay» trong ${fs.realpathSync(INVENTORY)}`],
  ];
  for (const [args, lyDo] of ca) {
    const r = chay(args);
    assert.equal(r.ma, 2, `${args.join(' ')} → ${r.ra}${r.loi}`);
    assert.equal(r.loi, `chuyen-kho: không đọc được ở đây: ${lyDo}\n`);
    assert.doesNotMatch(r.ra, /KẾT:/);
  }
});
