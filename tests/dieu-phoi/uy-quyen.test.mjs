// Ca đo của hồ sơ giam-sat-doc-ban-uy-quyen (ADR 0030, lát 1). Tên ca «UQ-0n» = AC-n; bảng tiêu chí → tên ca nằm ở
// _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh. Kho thử do mã sinh trong lượt: origin trần + bản clone, ngày commit
// và danh tính ghim. Đường suy từ vị trí tệp. Mỗi ca «-do» chạy CHÍNH hàm đo trên bản sao trọn `plugins/dispatch` bị tiêm,
// sau khi bản lành xanh trên cùng loại kho thử, kiểm bước tiêm đã đổi tệp, và ghim thông điệp của đúng lỗi được tiêm.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(DAY, '..', '..');
const GOI = path.join(KIT, 'plugins/dispatch');
const BAN_CU = '2956dae2'; // đỉnh nhánh chính lúc cắt nhánh vòng — bản gói «hôm nay» của phép so chiều im

const canDon = [];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo = 'uq-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
const NGAY = '2026-11-27T08:00:00Z';
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT' && k !== 'DIEU_PHOI_NOW_MS'));
const ENV_GIT = { ...ENV, GIT_AUTHOR_DATE: NGAY, GIT_COMMITTER_DATE: NGAY };
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...a], { cwd, env: ENV_GIT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ghi = (goc, tep, noi) => {
  fs.mkdirSync(path.dirname(path.join(goc, tep)), { recursive: true });
  fs.writeFileSync(path.join(goc, tep), noi);
};
const commit = (k, tep, noi, msg) => {
  ghi(k, tep, noi);
  git(k, 'add', '-A');
  git(k, 'commit', '-q', '-m', msg);
};
const nap = (gocGoi, tep) => import(`${pathToFileURL(path.join(gocGoi, 'scripts', tep)).href}?v=${Math.random()}`);
const TEP = 'governance/delegation.yaml';

// Bản sao TRỌN thư mục gói với các chỗ tiêm [tệp, cũ, mới]; ném khi chuỗi cần thay không có, và kiểm tệp đã đổi.
function banSao(...tiem) {
  const sao = path.join(tam('uq-goi-'), 'dispatch');
  fs.cpSync(GOI, sao, { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(sao, tep);
    const goc = fs.readFileSync(p, 'utf8');
    if (!goc.includes(cu)) throw new Error(`bước tiêm không áp được vào ${tep}: ${cu.slice(0, 70)}`);
    const sau = goc.replace(cu, moi);
    if (sau === goc) throw new Error(`bước tiêm không đổi ${tep}`);
    fs.writeFileSync(p, sau);
  }
  return sao;
}

// Kho thử: origin trần + bản clone ở nhánh main. `uyQuyen` = nội dung tệp trên nhánh chính (null = không có tệp).
function khoUyQuyen({ uyQuyen = 'ban: 1\ntu_lam: [gop]\n' } = {}) {
  const goc = tam('uq-kho-');
  const origin = path.join(goc, 'origin.git');
  git(goc, 'init', '-q', '--bare', '-b', 'main', origin);
  const k = path.join(goc, 'kho');
  git(goc, 'clone', '-q', origin, k);
  git(k, 'checkout', '-q', '-b', 'main');
  commit(k, 'README.md', 'kho thử\n', 'goc');
  if (uyQuyen !== null) commit(k, TEP, uyQuyen, 'ban uy quyen');
  git(k, 'push', '-q', 'origin', 'main');
  return { k, origin, goc };
}

// ---------- UQ-01 · AC-1 — nguồn đọc ----------
// Kiểm ca «PR của giám sát tự thêm loại»: trả danh sách lỗi (rỗng = đạt). Chạy được trên bản gói bất kỳ.
async function kiemPrTuThem(gocGoi) {
  const { docUyQuyen } = await nap(gocGoi, 'uy-quyen.mjs');
  const { k } = khoUyQuyen();
  git(k, 'checkout', '-q', '-b', 'pr');
  commit(k, TEP, 'ban: 1\ntu_lam: [gop, lo-trinh, thu-tu-gop]\n', 'giam sat tu them quyen');
  git(k, 'push', '-q', 'origin', 'pr');
  ghi(k, TEP, 'ban: 1\ntu_lam: [gop, lo-trinh, thu-tu-gop]\n# cây làm việc còn sửa\n');
  const kq = docUyQuyen({ gocKho: k, nhanhChinh: 'main' });
  const thay = new Set([...kq.nhan, ...kq.van_hoi.map((x) => x.loai)]);
  const loi = ['lo-trinh', 'thu-tu-gop'].filter((t) => thay.has(t)).map((t) => `bộ đọc thấy loại do PR thêm: ${t}`);
  if (JSON.stringify(kq.nhan) !== JSON.stringify(['gop'])) loi.push(`nhận ${JSON.stringify(kq.nhan)} thay vì ["gop"] của nhánh chính`);
  return loi;
}

test('UQ-01 nhanh-chinh', async () => {
  const { docUyQuyen } = await nap(GOI, 'uy-quyen.mjs');
  const { k } = khoUyQuyen();
  const kq = docUyQuyen({ gocKho: k, nhanhChinh: 'main' });
  assert.equal(kq.co, true);
  assert.deepEqual(kq.nhan, ['gop']);
  assert.equal(kq.loi, null);
  assert.equal(kq.sha, git(k, 'rev-parse', 'origin/main'));
  assert.equal(kq.nhanh, 'main');
});

test('UQ-01 pr-tu-them', async () => {
  assert.deepEqual(await kiemPrTuThem(GOI), []);
});

test('UQ-01 xoa-tep', async () => {
  const { docUyQuyen } = await nap(GOI, 'uy-quyen.mjs');
  const { k } = khoUyQuyen();
  assert.deepEqual(docUyQuyen({ gocKho: k }).nhan, ['gop'], 'đối chứng dương: trước khi xoá còn quyền');
  git(k, 'rm', '-q', TEP);
  git(k, 'commit', '-q', '-m', 'chu kho xoa ban uy quyen');
  git(k, 'push', '-q', 'origin', 'main');
  git(k, 'reset', '-q', '--hard', 'HEAD~1'); // cây làm việc còn tệp cũ — bộ đọc không được nhìn nó
  const kq = docUyQuyen({ gocKho: k });
  assert.deepEqual([kq.co, kq.nhan, kq.loi], [false, [], null]);
});

test('UQ-01 lay-ve-hong', async () => {
  const { docUyQuyen } = await nap(GOI, 'uy-quyen.mjs');
  const { k, goc } = khoUyQuyen();
  git(k, 'fetch', '-q', 'origin');
  git(k, 'remote', 'set-url', 'origin', path.join(goc, 'khong-co.git'));
  const kq = docUyQuyen({ gocKho: k });
  assert.equal(kq.co, true);
  assert.deepEqual(kq.nhan, []);
  assert.match(kq.loi ?? '', /không lấy được nhánh chính/);
});

test('UQ-01 lay-ve-hong-khong-tep', async () => {
  const { docUyQuyen } = await nap(GOI, 'uy-quyen.mjs');
  const { k, goc } = khoUyQuyen({ uyQuyen: null });
  git(k, 'remote', 'set-url', 'origin', path.join(goc, 'khong-co.git'));
  const kq = docUyQuyen({ gocKho: k });
  assert.deepEqual([kq.co, kq.loi, kq.vang, kq.nhan], [false, null, [], []]);
});

test('UQ-01-do doc-cay-lam-viec', async () => {
  assert.deepEqual(await kiemPrTuThem(GOI), [], 'đối chứng dương: bản lành xanh');
  const sao = banSao(
    ['scripts/uy-quyen.mjs', "import { execFileSync } from 'node:child_process';", "import { execFileSync } from 'node:child_process';\nimport fsTiem from 'node:fs';\nimport pathTiem from 'node:path';"],
    ['scripts/uy-quyen.mjs', 'text = git([\'show\', `${sha}:${TEP_UY_QUYEN}`]);', 'text = fsTiem.readFileSync(pathTiem.join(gocKho, TEP_UY_QUYEN), \'utf8\');'],
  );
  const loi = await kiemPrTuThem(sao);
  assert.ok(loi.includes('bộ đọc thấy loại do PR thêm: thu-tu-gop'), `UQ-01-do: ${loi.join(' | ')}`);
  console.log(`  UQ-01-do: ${loi[0]}`);
});

// ---------- UQ-02 · AC-2 — danh sách đóng ----------
// Ma trận VIẾT TRƯỚC: mỗi tên của danh sách loại kit định nghĩa + một tên lạ. Số dòng phải bằng số tên + 1.
const MA_TRAN_LOAI = [
  ['thu-tu-gop', 'nhan', null],
  ['gop', 'nhan', null],
  ['phien', 'van-hoi', 'mở phiên: máy đã tự làm theo thẻ khởi tạo, không cần quyền — dọn phiên: chưa có phép so — vẫn hỏi chủ kho'],
  ['chuyen-hang', 'van-hoi', 'chưa có lệnh ở bản này — vẫn hỏi chủ kho'],
  ['mo-day', 'van-hoi', 'chưa có lệnh ở bản này — vẫn hỏi chủ kho'],
  ['phan-quyet-chung', 'van-hoi', 'chưa có lệnh ở bản này — vẫn hỏi chủ kho'],
  ['lo-trinh', 'van-hoi', 'chưa có phép so — vẫn hỏi chủ kho'],
  ['muc-ngoai-hop-dong', 'sai-cho', 'không thuộc giám sát đợt — sống ở chính sách Cổng Đáng'],
  ['thiet-ke', 'sai-cho', 'không thuộc giám sát đợt — sống ở sổ thiết kế của design-assembly'],
  ['quyen-la', 'loi-doc', 'loại lạ: quyen-la'],
];
const TEN_NHOM = { nhan: 'nhận', 'van-hoi': 'vẫn hỏi', 'sai-cho': 'sai chỗ', 'loi-doc': 'lỗi đọc' };

async function maTranLoai(gocGoi) {
  const m = await nap(gocGoi, 'uy-quyen.mjs');
  const dong = [];
  const sai = [];
  for (const [ten, nhom, cau] of MA_TRAN_LOAI) {
    const kq = m.xepUyQuyen(m.phanTichUyQuyen(`ban: 1\ntu_lam: [${ten}]\n`));
    const vh = kq.van_hoi.find((x) => x.loai === ten);
    const thuc = kq.loi ? 'loi-doc' : kq.nhan.includes(ten) ? 'nhan' : vh ? vh.nhom : 'khong-co';
    const cauThuc = kq.loi ?? vh?.cau ?? null;
    const dung = thuc === nhom && cauThuc === cau && (nhom !== 'loi-doc' || kq.nhan.length === 0);
    dong.push(`${ten} · ${TEN_NHOM[nhom]} · ${dung ? 'đúng' : 'sai'}`);
    if (!dung) sai.push(`${ten} · mong ${TEN_NHOM[nhom]} · nhận ${TEN_NHOM[thuc] ?? thuc}${cauThuc !== cau ? ` · câu «${cauThuc}»` : ''}`);
  }
  return { dong, sai, soTen: Object.keys(m.LOAI).length };
}

test('UQ-02 ma-tran', async () => {
  const { dong, sai, soTen } = await maTranLoai(GOI);
  for (const d of dong) console.log(`  ${d}`);
  assert.equal(soTen + 1, MA_TRAN_LOAI.length, 'ma trận phải phủ trọn danh sách loại của kit cộng một tên lạ');
  assert.equal(dong.length, MA_TRAN_LOAI.length);
  assert.deepEqual(sai, []);
});

test('UQ-02-do bo-ten', async () => {
  assert.deepEqual((await maTranLoai(GOI)).sai, [], 'đối chứng dương');
  const sao = banSao(['scripts/uy-quyen.mjs', "  'mo-day': { nhom: 'van-hoi', cau: CHUA_LENH },\n", '']);
  const { sai } = await maTranLoai(sao);
  assert.ok(sai.includes('mo-day · mong vẫn hỏi · nhận lỗi đọc · câu «loại lạ: mo-day»'), `UQ-02-do: ${sai.join(' | ')}`);
  console.log(`  UQ-02-do: ${sai[0]}`);
});

// ---------- UQ-03 · AC-3 — vùng cấm ----------
const MA_TRAN_CAM = ['chu-ky', 'cat-ban', 'xoa-nhanh', 'day-kho-khac', 'cai-dat-github', 'workflows', 'governance', 'luat-san-pham', 'pham-vi-dot', 'luat-dot', 'uy-quyen'];

async function maTranCam(gocGoi) {
  const m = await nap(gocGoi, 'uy-quyen.mjs');
  const sai = [];
  const doiChung = m.xepUyQuyen(m.phanTichUyQuyen('ban: 1\ntu_lam: [gop]\n'));
  if (JSON.stringify(doiChung.nhan) !== '["gop"]') sai.push('đối chứng dương: tệp chỉ có gop không nhận gop');
  for (const cam of MA_TRAN_CAM) {
    const kq = m.xepUyQuyen(m.phanTichUyQuyen(`ban: 1\ntu_lam: [gop, ${cam}]\n`));
    if (kq.nhan.length) sai.push(`tệp có mục cấm ${cam} mà vẫn nhận ${kq.nhan.join(', ')}`);
    else if (!(kq.loi ?? '').includes(`«${cam}»`) || !(kq.loi ?? '').includes('vùng cấm cứng')) sai.push(`${cam}: lỗi không nêu mục cấm — «${kq.loi}»`);
  }
  return { sai, soCam: Object.keys(m.VUNG_CAM).length };
}

test('UQ-03 ma-tran', async () => {
  const { sai, soCam } = await maTranCam(GOI);
  assert.equal(soCam, MA_TRAN_CAM.length, 'ma trận phải phủ trọn danh sách vùng cấm');
  assert.deepEqual(sai, []);
  console.log(`  UQ-03: ${MA_TRAN_CAM.length} mục cấm · mỗi mục từ chối cả tệp`);
});

test('UQ-03-do bo-qua-muc-cam', async () => {
  assert.deepEqual((await maTranCam(GOI)).sai, [], 'đối chứng dương');
  const sao = banSao(
    ['scripts/uy-quyen.mjs', 'const cam = tuLam.find(', 'const cam = undefined && tuLam.find('],
    ['scripts/uy-quyen.mjs', 'for (const t of tuLam) {', 'for (const t of tuLam.filter((x) => !Object.hasOwn(VUNG_CAM, x))) {'],
  );
  const { sai } = await maTranCam(sao);
  assert.ok(sai.includes('tệp có mục cấm governance mà vẫn nhận gop'), `UQ-03-do: ${sai.join(' | ')}`);
  console.log(`  UQ-03-do: ${sai.find((s) => s.includes('governance'))}`);
});

// ---------- UQ-04 · AC-4 — tệp đời cũ, lệch khuôn ----------
async function maTranKhuon(gocGoi) {
  const m = await nap(gocGoi, 'uy-quyen.mjs');
  const doc = (t) => m.xepUyQuyen(m.phanTichUyQuyen(t));
  const sai = [];
  const a = doc('tu_lam: [gop]\n');
  if (JSON.stringify(a.nhan) !== '["gop"]' || !a.vang.some((v) => v.includes('ban'))) sai.push('thiếu ban: phải nhận gop kèm cờ vàng nêu ban');
  const b = doc('ban: 1\nchu: chu-kho\ntu_lam: [gop]\n');
  if (JSON.stringify(b.nhan) !== '["gop"]' || !b.vang.some((v) => v.includes('«chu»'))) sai.push('khoá lạ: phải nhận gop kèm cờ vàng nêu «chu»');
  const c = doc('ban: 2\ntu_lam: [gop]\n');
  if (c.nhan.length) sai.push('ban 2 mà vẫn nhận gop');
  else if (!(c.loi ?? '').includes('bản 2')) sai.push(`ban 2: lỗi không nêu bản — «${c.loi}»`);
  const d = doc('ban: 1\n');
  if (d.nhan.length || !(d.loi ?? '').includes('tu_lam')) sai.push('tu_lam vắng: phải là lỗi đọc nêu tu_lam');
  const e = doc('ban: 1\ntu_lam: gop\n');
  if (e.nhan.length || !(e.loi ?? '').includes('danh sách')) sai.push('tu_lam là chuỗi: phải là lỗi đọc «danh sách»');
  const f = doc('ban: 1\ntu_lam: [gop]\n  lung tung\n');
  if (f.nhan.length || !(f.loi ?? '').includes('dòng 3')) sai.push(`dòng ngoài khuôn: phải nêu dòng 3 — «${f.loi}»`);
  const dongTho = doc('# bản uỷ quyền\nban: 1   # bản\ntu_lam: [gop, "thu-tu-gop"]   # hai quyền\n');
  const khoi = doc('ban: 1\ntu_lam:\n  - thu-tu-gop   # xếp\n  - \'gop\'\n');
  if (JSON.stringify([...dongTho.nhan].sort()) !== '["gop","thu-tu-gop"]' || JSON.stringify([...khoi.nhan].sort()) !== JSON.stringify([...dongTho.nhan].sort())) sai.push(`dạng dòng và dạng khối khác kết quả: ${JSON.stringify(dongTho.nhan)} / ${JSON.stringify(khoi.nhan)}`);
  return sai;
}

test('UQ-04 khoan-dung', async () => {
  assert.deepEqual(await maTranKhuon(GOI), []);
});

test('UQ-04-do ban-la-van-nhan', async () => {
  assert.deepEqual(await maTranKhuon(GOI), [], 'đối chứng dương');
  const sao = banSao(['scripts/uy-quyen.mjs', 'else if (ban !== 1) return', 'else if (false) return']);
  const sai = await maTranKhuon(sao);
  assert.ok(sai.includes('ban 2 mà vẫn nhận gop'), `UQ-04-do: ${sai.join(' | ')}`);
  console.log('  UQ-04-do: ban 2 mà vẫn nhận gop');
});

