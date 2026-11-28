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
import { CFG_PHAT_LICH, hangViecHai } from './loi/mau-thu.mjs';

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
function khoUyQuyen({ uyQuyen = 'version: 1\ndelegated: [merge]\n' } = {}) {
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
  commit(k, TEP, 'version: 1\ndelegated: [merge, roadmap, merge-order]\n', 'giam sat tu them quyen');
  git(k, 'push', '-q', 'origin', 'pr');
  ghi(k, TEP, 'version: 1\ndelegated: [merge, roadmap, merge-order]\n# cây làm việc còn sửa\n');
  const kq = docUyQuyen({ gocKho: k, nhanhChinh: 'main' });
  const thay = new Set([...kq.nhan, ...kq.van_hoi.map((x) => x.loai)]);
  const loi = ['roadmap', 'merge-order'].filter((t) => thay.has(t)).map((t) => `bộ đọc thấy loại do PR thêm: ${t}`);
  if (JSON.stringify(kq.nhan) !== JSON.stringify(['merge'])) loi.push(`nhận ${JSON.stringify(kq.nhan)} thay vì ["merge"] của nhánh chính`);
  return loi;
}

test('UQ-01 nhanh-chinh', async () => {
  const { docUyQuyen } = await nap(GOI, 'uy-quyen.mjs');
  const { k } = khoUyQuyen();
  const kq = docUyQuyen({ gocKho: k, nhanhChinh: 'main' });
  assert.equal(kq.co, true);
  assert.deepEqual(kq.nhan, ['merge']);
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
  assert.deepEqual(docUyQuyen({ gocKho: k }).nhan, ['merge'], 'đối chứng dương: trước khi xoá còn quyền');
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
  assert.ok(loi.includes('bộ đọc thấy loại do PR thêm: merge-order'), `UQ-01-do: ${loi.join(' | ')}`);
  console.log(`  UQ-01-do: ${loi[0]}`);
});

// ---------- UQ-02 · AC-2 — danh sách đóng ----------
// Ma trận VIẾT TRƯỚC: mỗi tên của danh sách loại kit định nghĩa + một tên lạ. Số dòng phải bằng số tên + 1.
const MA_TRAN_LOAI = [
  ['merge-order', 'nhan', null],
  ['merge', 'nhan', null],
  ['session', 'van-hoi', 'mở phiên: máy đã tự làm theo thẻ khởi tạo, không cần quyền — dọn phiên: chưa có phép so — vẫn hỏi chủ kho'],
  ['reassign-row', 'van-hoi', 'chưa có lệnh ở bản này — vẫn hỏi chủ kho'],
  ['open-lane', 'van-hoi', 'chưa có lệnh ở bản này — vẫn hỏi chủ kho'],
  ['shared-ruling', 'van-hoi', 'chưa có lệnh ở bản này — vẫn hỏi chủ kho'],
  ['roadmap', 'van-hoi', 'chưa có phép so — vẫn hỏi chủ kho'],
  ['out-of-contract', 'sai-cho', 'không thuộc giám sát đợt — sống ở chính sách Cổng Đáng'],
  ['design', 'sai-cho', 'không thuộc giám sát đợt — sống ở sổ thiết kế của design-assembly'],
  ['quyen-la', 'loi-doc', 'loại lạ: quyen-la'],
];
const TEN_NHOM = { nhan: 'nhận', 'van-hoi': 'vẫn hỏi', 'sai-cho': 'sai chỗ', 'loi-doc': 'lỗi đọc' };

async function maTranLoai(gocGoi) {
  const m = await nap(gocGoi, 'uy-quyen.mjs');
  const dong = [];
  const sai = [];
  for (const [ten, nhom, cau] of MA_TRAN_LOAI) {
    const kq = m.xepUyQuyen(m.phanTichUyQuyen(`version: 1\ndelegated: [${ten}]\n`));
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
  const sao = banSao(['scripts/uy-quyen.mjs', "  'open-lane': { nhom: 'van-hoi', cau: CHUA_LENH", "  'open-lane-bo': { nhom: 'van-hoi', cau: CHUA_LENH"]);
  const { sai } = await maTranLoai(sao);
  assert.ok(sai.includes('open-lane · mong vẫn hỏi · nhận lỗi đọc · câu «loại lạ: open-lane»'), `UQ-02-do: ${sai.join(' | ')}`);
  console.log(`  UQ-02-do: ${sai[0]}`);
});

// ---------- UQ-03 · AC-3 — vùng cấm ----------
const MA_TRAN_CAM = ['gate-signoff', 'release', 'delete-branch', 'push-other-repo', 'github-settings', 'workflows', 'governance', 'product-invariants', 'dispatch-scope', 'dispatch-rules', 'delegation'];

async function maTranCam(gocGoi) {
  const m = await nap(gocGoi, 'uy-quyen.mjs');
  const sai = [];
  const doiChung = m.xepUyQuyen(m.phanTichUyQuyen('version: 1\ndelegated: [merge]\n'));
  if (JSON.stringify(doiChung.nhan) !== '["merge"]') sai.push('đối chứng dương: tệp chỉ có merge không nhận merge');
  for (const cam of MA_TRAN_CAM) {
    const kq = m.xepUyQuyen(m.phanTichUyQuyen(`version: 1\ndelegated: [merge, ${cam}]\n`));
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
  assert.ok(sai.includes('tệp có mục cấm governance mà vẫn nhận merge'), `UQ-03-do: ${sai.join(' | ')}`);
  console.log(`  UQ-03-do: ${sai.find((s) => s.includes('governance'))}`);
});

// ---------- UQ-04 · AC-4 — tệp đời cũ, lệch khuôn ----------
async function maTranKhuon(gocGoi) {
  const m = await nap(gocGoi, 'uy-quyen.mjs');
  const doc = (t) => m.xepUyQuyen(m.phanTichUyQuyen(t));
  const sai = [];
  const a = doc('delegated: [merge]\n');
  if (JSON.stringify(a.nhan) !== '["merge"]' || !a.vang.some((v) => v.includes('version'))) sai.push('thiếu version: phải nhận merge kèm cờ vàng nêu version');
  const b = doc('version: 1\nchu: chu-kho\ndelegated: [merge]\n');
  if (JSON.stringify(b.nhan) !== '["merge"]' || !b.vang.some((v) => v.includes('«chu»'))) sai.push('khoá lạ: phải nhận merge kèm cờ vàng nêu «chu»');
  const c = doc('version: 2\ndelegated: [merge]\n');
  if (c.nhan.length) sai.push('version 2 mà vẫn nhận merge');
  else if (!(c.loi ?? '').includes('bản 2')) sai.push(`version 2: lỗi không nêu bản — «${c.loi}»`);
  const d = doc('version: 1\n');
  if (d.nhan.length || !(d.loi ?? '').includes('delegated')) sai.push('delegated vắng: phải là lỗi đọc nêu delegated');
  const e = doc('version: 1\ndelegated: merge\n');
  if (e.nhan.length || !(e.loi ?? '').includes('danh sách')) sai.push('delegated là chuỗi: phải là lỗi đọc «danh sách»');
  const f = doc('version: 1\ndelegated: [merge]\n  lung tung\n');
  if (f.nhan.length || !(f.loi ?? '').includes('dòng 3')) sai.push(`dòng ngoài khuôn: phải nêu dòng 3 — «${f.loi}»`);
  const dongTho = doc('# bản uỷ quyền\nversion: 1   # bản\ndelegated: [merge, "merge-order"]   # hai quyền\n');
  const khoi = doc('version: 1\ndelegated:\n  - merge-order   # xếp\n  - \'merge\'\n');
  if (JSON.stringify([...dongTho.nhan].sort()) !== '["merge","merge-order"]' || JSON.stringify([...khoi.nhan].sort()) !== JSON.stringify([...dongTho.nhan].sort())) sai.push(`dạng dòng và dạng khối khác kết quả: ${JSON.stringify(dongTho.nhan)} / ${JSON.stringify(khoi.nhan)}`);
  return sai;
}

test('UQ-04 khoan-dung', async () => {
  assert.deepEqual(await maTranKhuon(GOI), []);
});

test('UQ-04-do ban-la-van-nhan', async () => {
  assert.deepEqual(await maTranKhuon(GOI), [], 'đối chứng dương');
  const sao = banSao(['scripts/uy-quyen.mjs', 'else if (ban !== 1) return', 'else if (false) return']);
  const sai = await maTranKhuon(sao);
  assert.ok(sai.includes('version 2 mà vẫn nhận merge'), `UQ-04-do: ${sai.join(' | ')}`);
  console.log('  UQ-04-do: version 2 mà vẫn nhận merge');
});


// ---------- Kho + đợt cho các lệnh của quyền (UQ-06 … UQ-09) ----------
const GS = 'local_giam_sat';
// Kho: nhánh chính mang bản uỷ quyền; nhánh `feat` đổi `prTep` + hồ sơ `s` ở trạng thái `trangThai`, đã đẩy.
function khoGop({ uyQuyen = 'version: 1\ndelegated: [merge, merge-order]\n', prTep = 'apps/web/a.ts', trangThai = 'machine-cleared' } = {}) {
  const kq = khoUyQuyen({ uyQuyen });
  const { k } = kq;
  git(k, 'checkout', '-q', '-b', 'feat');
  commit(k, prTep, 'đổi\n', `pr: ${prTep}`);
  commit(k, '_acceptance/s/contract.md', `---\nslug: s\nstatus: ${trangThai}\n---\n`, 'ho so s');
  git(k, 'push', '-q', 'origin', 'feat');
  return { ...kq, sha: git(k, 'rev-parse', 'HEAD') };
}
// Đợt dựng tay trong kho thử (khuôn dotTrong của loi/gop.test.mjs) + vai giám sát + đơn xin `xin`.
function dotGiamSat(k, { tuMerge = true, chuKhoa = null, xin = [] } = {}) {
  const d = path.join(k, '.acceptance-runs', 'dot-uq');
  for (const t of ['khoa', 'xin', 'yeu-cau', 'tra-loi', 'cho-nguoi', 'tiep']) fs.mkdirSync(path.join(d, t), { recursive: true });
  fs.symlinkSync(d, path.join(k, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  const w1 = tam('uq-w1-');
  const w2 = tam('uq-w2-');
  fs.writeFileSync(path.join(d, 'dieu-phoi.config.json'), JSON.stringify({ ...CFG_PHAT_LICH, nhanh_chinh: 'main', goc_kho: k }));
  fs.writeFileSync(path.join(d, 'hang-viec.json'), JSON.stringify(hangViecHai({ dot: 'uq', w1, w2 })));
  fs.writeFileSync(path.join(d, 'dieu-khien.json'), JSON.stringify({ pha: 'dang-chay', tu_merge: tuMerge, lich_su: [] }));
  fs.writeFileSync(path.join(d, 'vai.json'), JSON.stringify({ giam_sat: { phien: GS }, lich_su: [], day: [] }));
  if (chuKhoa) {
    fs.mkdirSync(path.join(d, 'khoa', 'merge'));
    fs.writeFileSync(path.join(d, 'khoa', 'merge', 'chu.json'), JSON.stringify({ phien: chuKhoa, slug: 'a', loai: 'merge', worktree: w1, han_thue_den: '2099-01-01T00:00:00Z' }));
  }
  const wCua = { P1: w1, P2: w2 };
  for (const [phien, luc] of xin) fs.writeFileSync(path.join(d, 'xin', `${phien}-merge.json`), JSON.stringify({ phien, slug: phien === 'P1' ? 'a' : 'b', loai: 'merge', luc, worktree: wCua[phien] }));
  return fs.realpathSync(d);
}
const XANH = [{ __typename: 'CheckRun', name: 'gate', status: 'COMPLETED', conclusion: 'SUCCESS' }];
const docSo = (d) => (fs.existsSync(path.join(d, 'su-kien.jsonl')) && fs.statSync(path.join(d, 'su-kien.jsonl')).isFile() ? fs.readFileSync(path.join(d, 'su-kien.jsonl'), 'utf8').split('\n').filter(Boolean).map((x) => JSON.parse(x)) : []);
const dungQuyen = (d) => docSo(d).filter((x) => x.loai === 'dung-quyen');
// gh giả: trả `gh pr view` của PR 7 trên nhánh feat; lúc nhận `pr merge` chụp số dòng dung-quyen trong sổ của đợt `dot`.
function ioCua(k, sha, { dot = null, loiMerge = false } = {}) {
  const goiGh = [];
  const io = {
    goiGh,
    dungQuyenLucGop: null,
    chay: (cmd, args) => {
      if (cmd !== 'gh') return execFileSync(cmd, args, { cwd: k, env: ENV_GIT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      goiGh.push(args);
      if (args[0] === 'pr' && args[1] === 'view') return JSON.stringify({ number: 7, state: 'OPEN', isDraft: false, mergeable: 'MERGEABLE', headRefOid: sha, headRefName: 'feat', baseRefName: 'main', statusCheckRollup: XANH });
      if (args[0] === 'pr' && args[1] === 'merge') {
        io.dungQuyenLucGop = dot ? dungQuyen(dot).length : null;
        if (loiMerge) throw Object.assign(new Error('gh giả: gộp hỏng'), { stderr: 'gh giả: gộp hỏng' });
      }
      return args[0] === 'run' ? '[]' : '';
    },
  };
  return io;
}
const goiGop = (io) => io.goiGh.filter((a) => a[0] === 'pr' && a[1] === 'merge');
const coKhoaMerge = (d) => fs.existsSync(path.join(d, 'khoa', 'merge'));
async function gopQuyen(gocGoi, k, io, { phien = GS } = {}) {
  const { gop, maThoatGop } = await nap(gocGoi, 'gop.mjs');
  const kq = gop(k, '7', { theoQuyen: true, slug: 's', phien, io });
  return { kq, ma: maThoatGop(kq) };
}

// ---------- UQ-06 · AC-6 — sự kiện dung-quyen ----------
async function kiemGhiTruoc(gocGoi) {
  const loi = [];
  const a = khoGop();
  const d = dotGiamSat(a.k);
  const io = ioCua(a.k, a.sha, { dot: d });
  const { kq } = await gopQuyen(gocGoi, a.k, io);
  if (!kq.da_gop) loi.push(`gộp theo quyền không gộp: ${kq.ly_do}`);
  if (io.dungQuyenLucGop !== 1) loi.push('lệnh của quyền chạy mà không có dòng dung-quyen');
  const dq = dungQuyen(d)[0];
  if (dq) {
    if (dq.quyen !== 'merge' || !String(dq.viec).includes('#7') || !String(dq.duong_dao).includes('git revert -m 1') || dq.can_phan !== false) loi.push(`dòng dung-quyen thiếu trường: ${JSON.stringify(dq)}`);
    if (dq.sha_uy_quyen !== git(a.k, 'rev-parse', 'origin/main')) loi.push('sha_uy_quyen không phải đỉnh nhánh chính');
  }
  const b = khoUyQuyen({ uyQuyen: 'version: 1\ndelegated: [merge-order]\n' });
  const db = dotGiamSat(b.k, { xin: [['P1', '2026-10-05T11:00:00Z'], ['P2', '2026-10-05T11:30:00Z']] });
  const { thuTuGop } = await nap(gocGoi, 'thu-tu-gop.mjs');
  const t = thuTuGop(b.k, 'P2,P1', { phien: GS });
  const dqb = dungQuyen(db);
  if (!t.duoc || dqb.length !== 1 || dqb[0].quyen !== 'merge-order' || !fs.existsSync(path.join(db, 'thu-tu-gop.json'))) loi.push(`thu-tu-gop: ${t.ly_do} · dòng dung-quyen ${dqb.length}`);
  return loi;
}

test('UQ-06 ghi-truoc', async () => {
  assert.deepEqual(await kiemGhiTruoc(GOI), []);
});

test('UQ-06 so-hong', async () => {
  const a = khoGop();
  const d = dotGiamSat(a.k);
  fs.mkdirSync(path.join(d, 'su-kien.jsonl'));
  const io = ioCua(a.k, a.sha, { dot: d });
  await assert.rejects(gopQuyen(GOI, a.k, io), /không ghi được sự kiện dung-quyen — không làm/);
  assert.deepEqual(goiGop(io), [], 'không được gọi gộp khi sổ hỏng');
  assert.equal(coKhoaMerge(d), false, 'khoá merge phải được nhả');
  const b = khoUyQuyen({ uyQuyen: 'version: 1\ndelegated: [merge-order]\n' });
  const db = dotGiamSat(b.k, { xin: [['P1', '2026-10-05T11:00:00Z'], ['P2', '2026-10-05T11:30:00Z']] });
  fs.mkdirSync(path.join(db, 'su-kien.jsonl'));
  const { thuTuGop } = await nap(GOI, 'thu-tu-gop.mjs');
  assert.throws(() => thuTuGop(b.k, 'P2,P1', { phien: GS }), /không ghi được sự kiện dung-quyen — không làm/);
  assert.equal(fs.existsSync(path.join(db, 'thu-tu-gop.json')), false, 'tệp thứ tự không được ghi khi sổ hỏng');
});

// Lệnh lọc Monitor của giám sát, rút NGUYÊN VĂN từ cặp marker MONITOR-LOC của commands/open.md.
function locMonitor(gocGoi) {
  const m = /<!-- <<<MONITOR-LOC -->([\s\S]*?)<!-- MONITOR-LOC>>> -->/.exec(fs.readFileSync(path.join(gocGoi, 'commands', 'open.md'), 'utf8'));
  const g = m && /grep --line-buffered '([^']+)'/.exec(m[1]);
  if (!g) throw new Error('không tìm thấy lệnh lọc Monitor');
  return g[1];
}
test('UQ-06 monitor', async () => {
  const mau = locMonitor(GOI);
  const a = khoGop();
  const d = dotGiamSat(a.k);
  await gopQuyen(GOI, a.k, ioCua(a.k, a.sha, { dot: d }));
  assert.equal(dungQuyen(d).length, 1, 'sổ do lệnh thật ghi có một dòng dung-quyen');
  const lot = (p) => spawnSync('grep', ['--line-buffered', mau, p], { encoding: 'utf8' }).stdout.split('\n').filter(Boolean);
  assert.deepEqual(lot(path.join(d, 'su-kien.jsonl')).filter((x) => x.includes('dung-quyen')), [], 'dòng dung-quyen không được lọt Monitor');
  fs.appendFileSync(path.join(d, 'su-kien.jsonl'), `${JSON.stringify({ luc: NGAY, loai: 'yeu-cau', can_phan: true })}\n`);
  assert.equal(lot(path.join(d, 'su-kien.jsonl')).length, 1, 'đối chứng: một dòng can_phan true lọt đúng một');
});

test('UQ-06-do bo-ghi', async () => {
  assert.deepEqual(await kiemGhiTruoc(GOI), [], 'đối chứng dương');
  const sao = banSao(['scripts/gop.mjs', "ghiDungQuyen(thuMuc, { quyen: 'merge'", "({ quyen: 'merge'"]);
  const loi = await kiemGhiTruoc(sao);
  assert.ok(loi.includes('lệnh của quyền chạy mà không có dòng dung-quyen'), `UQ-06-do: ${loi.join(' | ')}`);
  console.log('  UQ-06-do: lệnh của quyền chạy mà không có dòng dung-quyen');
});

// ---------- UQ-07 · AC-7 — gộp theo quyền ----------
test('UQ-07 gop', async () => {
  const a = khoGop();
  const d = dotGiamSat(a.k);
  const io = ioCua(a.k, a.sha, { dot: d });
  const { kq, ma } = await gopQuyen(GOI, a.k, io);
  assert.equal(ma, 0, kq.ly_do);
  assert.equal(kq.da_gop, true);
  assert.deepEqual(goiGop(io), [['pr', 'merge', '7', '--merge', '--match-head-commit', a.sha]]);
  assert.equal(io.goiGh.some((x) => x.includes('--auto')), false, 'không lời gọi nào mang --auto');
  assert.equal(coKhoaMerge(d), false, 'khoá merge đã nhả sau lệnh');
});

// Ma trận viết trước: năm hàng thiếu một điều kiện. Trả danh sách lỗi theo hàng.
async function maTranThieu(gocGoi) {
  const hang = [
    ['không phải giám sát', {}, {}, { phien: 'local_khac' }, /phiên local_khac không phải giám sát của đợt/],
    ['tu_merge không true', {}, { tuMerge: false }, {}, /đợt không cho tự gộp \(tu_merge\)/],
    ['tệp không có merge', { uyQuyen: 'version: 1\ndelegated: [merge-order]\n' }, {}, {}, /bản uỷ quyền không nhận quyền merge —/],
    ['khoá merge bận', {}, { chuKhoa: 'P1' }, {}, /khoá merge đang do P1 giữ/],
    ['xetGop chặn', { trangThai: 'verified' }, {}, {}, /chưa ký, chưa thông/],
  ];
  const loi = [];
  for (const [ten, oKho, oDot, oGoi, re] of hang) {
    const a = khoGop(oKho);
    const d = dotGiamSat(a.k, oDot);
    const io = ioCua(a.k, a.sha, { dot: d });
    const { kq, ma } = await gopQuyen(gocGoi, a.k, io, oGoi);
    const sai = [];
    if (ma !== 1) sai.push(`mã ${ma}`);
    if (!re.test(kq.ly_do ?? '')) sai.push(`thông điệp «${kq.ly_do}»`);
    if (goiGop(io).length) sai.push('đã gọi gộp');
    if (dungQuyen(d).length) sai.push('có dòng dung-quyen');
    if (oDot.chuKhoa && JSON.parse(fs.readFileSync(path.join(d, 'khoa', 'merge', 'chu.json'), 'utf8')).phien !== 'P1') sai.push('khoá của dãy khác bị đụng');
    if (!oDot.chuKhoa && coKhoaMerge(d)) sai.push('khoá merge còn sau lệnh');
    if (sai.length) loi.push(`hàng «${ten}»: ${sai.join(', ')}`);
  }
  return { loi, so: hang.length };
}

test('UQ-07 ma-tran-thieu', async () => {
  const { loi, so } = await maTranThieu(GOI);
  assert.equal(so, 5);
  assert.deepEqual(loi, []);
});

// Ba lối hỏng SAU lúc giám sát đã giữ khoá — mỗi lối phải nhả khoá.
async function kiemNhaKhoa(gocGoi) {
  const loi = [];
  const lo = async (ten, oKho, oIo, truocKhi) => {
    const a = khoGop(oKho);
    const d = dotGiamSat(a.k);
    if (truocKhi) truocKhi(d);
    const io = ioCua(a.k, a.sha, { dot: d, ...oIo });
    let ma = null;
    try {
      ma = (await gopQuyen(gocGoi, a.k, io)).ma;
    } catch {
      ma = 'ném';
    }
    if (ma === 0) loi.push(`${ten}: lệnh thoát 0`);
    if (coKhoaMerge(d)) loi.push(`khoá merge còn do giám sát giữ sau lệnh bị chặn (${ten})`);
  };
  await lo('xetGop chặn', { trangThai: 'verified' }, {}, null);
  await lo('gh thoát 1 ở pr merge', {}, { loiMerge: true }, null);
  await lo('sổ không ghi được', {}, {}, (d) => fs.mkdirSync(path.join(d, 'su-kien.jsonl')));
  return loi;
}

test('UQ-07 nha-khoa', async () => {
  assert.deepEqual(await kiemNhaKhoa(GOI), []);
});

test('UQ-07-do bo-tu-merge', async () => {
  assert.deepEqual((await maTranThieu(GOI)).loi, [], 'đối chứng dương');
  const sao = banSao(['scripts/gop.mjs', 'if (docPha(thuMuc).tu_merge !== true) return chanQuyen(', 'if (false) return chanQuyen(']);
  const { loi } = await maTranThieu(sao);
  assert.ok(loi.some((l) => l.startsWith('hàng «tu_merge không true»')), `UQ-07-do: ${loi.join(' | ')}`);
  console.log(`  UQ-07-do: ${loi.find((l) => l.startsWith('hàng «tu_merge'))}`);
});

test('UQ-07-do nha-khoa-ngoai-finally', async () => {
  assert.deepEqual(await kiemNhaKhoa(GOI), [], 'đối chứng dương');
  const sao = banSao(['scripts/gop.mjs', 'if (chuGiu()) fs.rmSync(dKhoa', 'if (daGop && chuGiu()) fs.rmSync(dKhoa']);
  const loi = await kiemNhaKhoa(sao);
  assert.ok(loi.includes('khoá merge còn do giám sát giữ sau lệnh bị chặn (xetGop chặn)'), `UQ-07-do: ${loi.join(' | ')}`);
  console.log(`  UQ-07-do: ${loi[0]}`);
});

// ---------- UQ-08 · AC-8 — vùng cấm trên tệp PR ----------
async function kiemVungCamPr(gocGoi) {
  const loi = [];
  for (const tep of ['.github/workflows/x.yml', 'governance/delegation.yaml', 'PRODUCT-INVARIANTS.md']) {
    const a = khoGop({ prTep: tep });
    const d = dotGiamSat(a.k);
    const io = ioCua(a.k, a.sha, { dot: d });
    const { kq, ma } = await gopQuyen(gocGoi, a.k, io);
    if (goiGop(io).length || kq.da_gop) loi.push(`PR chạm ${tep} mà vẫn gộp`);
    else if (ma !== 1 || !kq.ly_do.includes(`PR chạm vùng cấm: ${tep}`) || !kq.ly_do.includes('bấm gộp là của người')) loi.push(`${tep}: thông điệp «${kq.ly_do}»`);
  }
  const b = khoGop({ prTep: 'apps/web/khac.ts' });
  const db = dotGiamSat(b.k);
  const io = ioCua(b.k, b.sha, { dot: db });
  if (!(await gopQuyen(gocGoi, b.k, io)).kq.da_gop) loi.push('đối chứng: PR không chạm vùng cấm không gộp');
  return loi;
}

test('UQ-08 vung-cam-pr', async () => {
  assert.deepEqual(await kiemVungCamPr(GOI), []);
});

test('UQ-08-do bo-vung-cam', async () => {
  assert.deepEqual(await kiemVungCamPr(GOI), [], 'đối chứng dương');
  const sao = banSao(['scripts/gop.mjs', 'const cham = tepChamVungCam(', 'const cham = [] || tepChamVungCam(']);
  const loi = await kiemVungCamPr(sao);
  assert.ok(loi.includes('PR chạm governance/delegation.yaml mà vẫn gộp'), `UQ-08-do: ${loi.join(' | ')}`);
  console.log('  UQ-08-do: PR chạm governance/delegation.yaml mà vẫn gộp');
});

// ---------- UQ-09 · AC-9 — xếp lại thứ tự gộp ----------
const HAI_DON = [['P1', '2026-10-05T11:00:00Z'], ['P2', '2026-10-05T11:30:00Z']];
async function maTranHoanVi(gocGoi) {
  const hang = [
    ['danh sách thiếu P1', 'P2', {}, {}, /thiếu dãy P1/],
    ['danh sách thừa P3', 'P1,P2,P3', {}, {}, /thừa dãy P3/],
    ['danh sách trùng P1', 'P1,P1,P2', {}, {}, /trùng dãy P1/],
    ['không có quyền merge-order', 'P2,P1', { uyQuyen: 'version: 1\ndelegated: [merge]\n' }, {}, /không nhận quyền merge-order/],
    ['phiên không phải giám sát', 'P2,P1', {}, { phien: 'local_khac' }, /phiên local_khac không phải giám sát của đợt/],
  ];
  const { thuTuGop } = await nap(gocGoi, 'thu-tu-gop.mjs');
  const loi = [];
  for (const [ten, ds, oKho, oGoi, re] of hang) {
    const a = khoUyQuyen({ uyQuyen: 'version: 1\ndelegated: [merge-order]\n', ...oKho });
    const d = dotGiamSat(a.k, { xin: HAI_DON });
    const kq = thuTuGop(a.k, ds, { phien: GS, ...oGoi });
    if (kq.duoc || fs.existsSync(path.join(d, 'thu-tu-gop.json'))) loi.push(`${ten} mà vẫn ghi`);
    else if (!re.test(kq.ly_do)) loi.push(`${ten}: thông điệp «${kq.ly_do}»`);
    if (dungQuyen(d).length) loi.push(`${ten}: có dòng dung-quyen`);
  }
  const r = khoUyQuyen({ uyQuyen: 'version: 1\ndelegated: [merge-order]\n' });
  dotGiamSat(r.k);
  if (!thuTuGop(r.k, '', { phien: GS }).duoc) loi.push('không đơn nào: danh sách rỗng (hoán vị của tập rỗng) phải ghi được');
  return { loi, so: hang.length + 1 };
}

test('UQ-09 hoan-vi', async () => {
  const { loi, so } = await maTranHoanVi(GOI);
  assert.equal(so, 6);
  assert.deepEqual(loi, []);
});

const IO_MAY = (nowMs) => ({
  nowMs: () => nowMs,
  chay: (cmd, args) => {
    if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 1024.00M  free = 1.00M';
    if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
    if (cmd === 'sysctl') return '{ 1.00 1.00 1.00 }';
    if (cmd === 'ps') return '102400 node\n';
    if (cmd === 'gh') return '[]';
    if (cmd === 'git' && args[0] === 'show') throw new Error('khong co');
    return '';
  },
});
test('UQ-09 cap-theo-thu-tu', async () => {
  const { motNhip } = await nap(GOI, 'phat-lich.mjs');
  const { thuTuGop } = await nap(GOI, 'thu-tu-gop.mjs');
  const chuMerge = (d) => JSON.parse(fs.readFileSync(path.join(d, 'khoa', 'merge', 'chu.json'), 'utf8')).phien;
  const doiChung = khoUyQuyen({ uyQuyen: 'version: 1\ndelegated: [merge-order]\n' });
  const d0 = dotGiamSat(doiChung.k, { xin: HAI_DON });
  await motNhip(d0, IO_MAY(Date.parse('2026-10-05T12:00:00Z')));
  assert.equal(chuMerge(d0), 'P1', 'đối chứng: không có tệp thứ tự → cấp như cũ (P1)');
  const a = khoUyQuyen({ uyQuyen: 'version: 1\ndelegated: [merge-order]\n' });
  const d = dotGiamSat(a.k, { xin: HAI_DON });
  assert.equal(thuTuGop(a.k, 'P2,P1', { phien: GS }).duoc, true);
  await motNhip(d, IO_MAY(Date.parse('2026-10-05T12:00:00Z')));
  assert.equal(chuMerge(d), 'P2', 'nhịp kế cấp khoá merge theo thứ tự giám sát xếp');
});

test('UQ-09-do bo-kiem-hoan-vi', async () => {
  assert.deepEqual((await maTranHoanVi(GOI)).loi, [], 'đối chứng dương');
  const sao = banSao(['scripts/thu-tu-gop.mjs', 'if (thieu.length) return chan(', 'if (false) return chan(']);
  const { loi } = await maTranHoanVi(sao);
  assert.ok(loi.includes('danh sách thiếu P1 mà vẫn ghi'), `UQ-09-do: ${loi.join(' | ')}`);
  console.log('  UQ-09-do: danh sách thiếu P1 mà vẫn ghi');
});

// ---------- UQ-05 · AC-5 — chiều im ----------
// Bản gói ở một commit, lấy TRỌN thư mục qua `git archive` (luật bản base của kho); cache theo sha.
const banTheoSha = new Map();
function layBan(sha) {
  if (banTheoSha.has(sha)) return banTheoSha.get(sha);
  const d = tam('uq-cu-');
  const tar = execFileSync('git', ['-C', KIT, 'archive', sha, 'plugins/dispatch'], { env: ENV, maxBuffer: 64 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  banTheoSha.set(sha, path.join(d, 'plugins', 'dispatch'));
  return banTheoSha.get(sha);
}
const NOW_CLI = Date.parse('2026-10-05T12:00:00Z');
const cli = (gocGoi, cwd, doiSo) => {
  const r = spawnSync(process.execPath, [path.join(gocGoi, 'scripts', 'dieu-phoi.mjs'), ...doiSo], { cwd, env: { ...ENV, TZ: 'Asia/Ho_Chi_Minh', DIEU_PHOI_NOW_MS: String(NOW_CLI) }, encoding: 'utf8' });
  return `${r.status}\n${r.stdout}\n${r.stderr}`;
};
const BON_LENH = [['the', 'khoi-tao', '--json'], ['xem'], ['xem', '--json'], ['dem', '--json']];
// So bốn đầu ra của hai bản gói trên CÙNG thư mục đợt. Trả danh sách lệch («<lệnh> lệch»).
async function soBonLenh(gocMoi, k, d, sha = BAN_CU) {
  const { motNhip } = await nap(GOI, 'phat-lich.mjs');
  await motNhip(d, IO_MAY(NOW_CLI));
  const cu = layBan(sha);
  return BON_LENH.filter((l) => cli(cu, k, l) !== cli(gocMoi, k, l)).map((l) => `${l.join(' ')} lệch`);
}
const khoKhongRemote = () => {
  const k = tam('uq-kr-');
  git(k, 'init', '-q', '-b', 'main');
  commit(k, 'README.md', 'x\n', 'goc');
  return k;
};
async function chieuIm(gocMoi, sha = BAN_CU) {
  const loi = [];
  const a = khoUyQuyen({ uyQuyen: null });
  loi.push(...(await soBonLenh(gocMoi, a.k, dotGiamSat(a.k, { xin: HAI_DON }), sha)));
  return loi;
}

test('UQ-05 chieu-im', async () => {
  assert.deepEqual(await chieuIm(GOI), []);
});

test('UQ-05 khong-remote', async () => {
  const k = khoKhongRemote();
  assert.deepEqual(await soBonLenh(GOI, k, dotGiamSat(k, { xin: HAI_DON })), []);
});

test('UQ-05 lay-ve-hong', async () => {
  const a = khoUyQuyen({ uyQuyen: null });
  git(a.k, 'remote', 'set-url', 'origin', path.join(a.goc, 'khong-co.git'));
  assert.deepEqual(await soBonLenh(GOI, a.k, dotGiamSat(a.k, { xin: HAI_DON })), []);
});

// Lệnh gop KHÔNG cờ của dãy giữ khoá: hai bản gói, hai kho giống hệt (sha tất định), cùng PR chạm .github/workflows/.
async function gopKhongCo(gocGoi) {
  const a = khoGop({ prTep: '.github/workflows/x.yml' });
  const d = dotGiamSat(a.k, { chuKhoa: 'P1' });
  const hv = JSON.parse(fs.readFileSync(path.join(d, 'hang-viec.json'), 'utf8'));
  hv.day[0].worktree = a.k;
  hv.hang[0].slug = 's';
  fs.writeFileSync(path.join(d, 'hang-viec.json'), JSON.stringify(hv));
  const io = ioCua(a.k, a.sha, { dot: d });
  const { gop, maThoatGop } = await nap(gocGoi, 'gop.mjs');
  let kq;
  try {
    kq = gop(a.k, '7', { slug: 's', io });
  } catch (e) {
    kq = { nem: e.message };
  }
  const so = docSo(d).map(({ luc: _l, ...x }) => x);
  return JSON.stringify({ ma: kq.nem ? 'ném' : maThoatGop(kq), kq: { duong: kq.duong, ly_do: kq.ly_do, da_gop: kq.da_gop, nha_merge: kq.nha_merge, nem: kq.nem }, gh: io.goiGh, so });
}
test('UQ-05 gop-khong-co', async () => {
  const cu = await gopKhongCo(layBan(BAN_CU));
  const moi = await gopKhongCo(GOI);
  assert.equal(JSON.parse(moi).kq.da_gop, true, 'đối chứng: dãy giữ khoá gộp được PR chạm workflows như hôm nay');
  assert.equal(moi, cu);
});

test('UQ-05-do them-khoa', async () => {
  assert.deepEqual(await chieuIm(GOI), [], 'đối chứng dương');
  const sao = banSao(['scripts/the.mjs', '    canh_bao: canhBao,\n  };', '    canh_bao: canhBao,\n    uy_quyen: null,\n  };']);
  const loi = await chieuIm(sao);
  assert.ok(loi.includes('the khoi-tao --json lệch'), `UQ-05-do: ${loi.join(' | ')}`);
  console.log('  UQ-05-do: the khoi-tao --json lệch');
});

// ---------- UQ-10 · AC-10 — hai bề mặt ----------
const theCua = (gocGoi, k) => JSON.parse(cli(gocGoi, k, ['the', 'khoi-tao', '--json']).split('\n')[1]);
async function kiemThe(gocGoi) {
  const loi = [];
  const a = khoUyQuyen({ uyQuyen: 'version: 1\nchu: chu-kho\ndelegated: [merge, merge-order, roadmap]\n' });
  dotGiamSat(a.k);
  const t = theCua(gocGoi, a.k);
  const khong = khoUyQuyen({ uyQuyen: null });
  dotGiamSat(khong.k);
  const t0 = theCua(gocGoi, khong.k);
  const uq = t.uy_quyen;
  if (!uq) loi.push('thẻ thiếu khối uy_quyen ở kho có tệp');
  else {
    if (uq.nguon !== `origin/main@${git(a.k, 'rev-parse', 'origin/main').slice(0, 7)}`) loi.push(`nguồn «${uq.nguon}»`);
    if (JSON.stringify(uq.nhan) !== '["merge","merge-order"]') loi.push(`nhận ${JSON.stringify(uq.nhan)}`);
    if (!uq.van_hoi.some((x) => x.loai === 'roadmap' && x.cau === 'chưa có phép so — vẫn hỏi chủ kho')) loi.push('vẫn hỏi thiếu roadmap kèm câu');
    if (!uq.vang.some((v) => v.includes('«chu»'))) loi.push('cờ vàng thiếu khoá lạ');
  }
  if (!t.may_di_tiep.includes('uy-quyen')) loi.push('may_di_tiep thiếu uy-quyen');
  if (JSON.stringify(t.hoi) !== JSON.stringify(t0.hoi)) loi.push('khối uỷ quyền thành câu hỏi');
  const c = khoUyQuyen({ uyQuyen: 'version: 1\ndelegated: [merge, governance]\n' });
  dotGiamSat(c.k);
  const tc = theCua(gocGoi, c.k).uy_quyen;
  if (!tc || tc.nhan.length || !(tc.loi ?? '').includes('«governance»')) loi.push(`tệp có mục cấm: khối ${JSON.stringify(tc)}`);
  return loi;
}
test('UQ-10 the', async () => {
  assert.deepEqual(await kiemThe(GOI), []);
});

test('UQ-10 dem', async () => {
  const a = khoGop();
  const d = dotGiamSat(a.k, { xin: HAI_DON });
  for (let i = 0; i < 2; i++) assert.equal((await gopQuyen(GOI, a.k, ioCua(a.k, a.sha, { dot: d }))).kq.da_gop, true);
  const { thuTuGop } = await nap(GOI, 'thu-tu-gop.mjs');
  assert.equal(thuTuGop(a.k, 'P2,P1', { phien: GS }).duoc, true);
  const dem = JSON.parse(cli(GOI, a.k, ['dem', '--json']).split('\n')[1]);
  assert.equal(dem.dung_quyen.tong, 3);
  assert.deepEqual(dem.dung_quyen.theo_quyen, { merge: 2, 'merge-order': 1 });
});

test('UQ-10 xem-co-tep', async () => {
  const a = khoUyQuyen({ uyQuyen: 'version: 1\ndelegated: [merge, merge-order]\n' });
  const d = dotGiamSat(a.k, { xin: HAI_DON });
  const lech = (await soBonLenh(GOI, a.k, d)).filter((l) => l.startsWith('xem'));
  assert.deepEqual(lech, []);
});

test('UQ-10-do hoi-them', async () => {
  assert.deepEqual(await kiemThe(GOI), [], 'đối chứng dương');
  const sao = banSao(['scripts/the.mjs', "may_di_tiep: [...may, 'uy-quyen']", "may_di_tiep: [...may, 'uy-quyen'], hoi: [...ketQua.hoi, 'uy-quyen']"]);
  const loi = await kiemThe(sao);
  assert.ok(loi.includes('khối uỷ quyền thành câu hỏi'), `UQ-10-do: ${loi.join(' | ')}`);
  console.log('  UQ-10-do: khối uỷ quyền thành câu hỏi');
});

// ================= V1 · hồ sơ doi-ten-ban-uy-quyen — ca TA-0n = AC-n của hồ sơ ấy =================
const BAN_TRUOC_VONG = 'a9b7cbe6'; // đỉnh nhánh chính lúc cắt nhánh vòng V1 — bộ đọc tên cũ
// Ma trận VIẾT TRƯỚC, chép tay từ bảng tên design doc §3 (đã chốt ở Cổng Phạm vi 28/11).
const TEN_CU_MONG = {
  ban: 'version',
  tu_lam: 'delegated',
  gop: 'merge',
  'thu-tu-gop': 'merge-order',
  phien: 'session',
  'chuyen-hang': 'reassign-row',
  'mo-day': 'open-lane',
  'phan-quyet-chung': 'shared-ruling',
  'lo-trinh': 'roadmap',
  'muc-ngoai-hop-dong': 'out-of-contract',
  'thiet-ke': 'design',
  'chu-ky': 'gate-signoff',
  'cat-ban': 'release',
  'xoa-nhanh': 'delete-branch',
  'day-kho-khac': 'push-other-repo',
  'cai-dat-github': 'github-settings',
  'luat-san-pham': 'product-invariants',
  'pham-vi-dot': 'dispatch-scope',
  'luat-dot': 'dispatch-rules',
  'uy-quyen': 'delegation',
};
const LOAI_MONG = ['merge-order', 'merge', 'session', 'reassign-row', 'open-lane', 'shared-ruling', 'roadmap', 'out-of-contract', 'design'];
const CAM_MONG = ['gate-signoff', 'release', 'delete-branch', 'push-other-repo', 'github-settings', 'workflows', 'governance', 'product-invariants', 'dispatch-scope', 'dispatch-rules', 'delegation'];
const KHOA_CU = ['ban', 'tu_lam'];

// ---------- TA-01 · AC-1 — tên mới đọc như tên cũ ----------
const lechTap = (ten, thuc, mong) => [
  ...thuc.filter((t) => !mong.includes(t)).map((t) => `${ten} lệch bảng: thừa ${t}`),
  ...mong.filter((t) => !thuc.includes(t)).map((t) => `${ten} lệch bảng: thiếu ${t}`),
];
async function bangTen(gocGoi) {
  const m = await nap(gocGoi, 'uy-quyen.mjs');
  const sai = [...lechTap('LOAI', Object.keys(m.LOAI), LOAI_MONG), ...lechTap('VUNG_CAM', Object.keys(m.VUNG_CAM), CAM_MONG)];
  const tc = m.TEN_CU ?? {};
  sai.push(...lechTap('TEN_CU', Object.keys(tc), Object.keys(TEN_CU_MONG)));
  for (const [cu, moi] of Object.entries(TEN_CU_MONG)) if (Object.hasOwn(tc, cu) && tc[cu] !== moi) sai.push(`TEN_CU lệch bảng: ${cu} → ${tc[cu]} thay vì ${moi}`);
  return sai;
}
const nhomCua = (kq, ten) => {
  const vh = kq.van_hoi.find((x) => x.loai === ten);
  return { nhom: kq.loi ? 'loi-doc' : kq.nhan.includes(ten) ? 'nhan' : vh ? vh.nhom : 'khong-co', cau: kq.loi ?? vh?.cau ?? null };
};
async function viPhan(gocMoi) {
  const cu = await nap(layBan(BAN_TRUOC_VONG), 'uy-quyen.mjs');
  const moi = await nap(gocMoi, 'uy-quyen.mjs');
  const tc = moi.TEN_CU ?? {};
  const docCu = (t) => cu.xepUyQuyen(cu.phanTichUyQuyen(t));
  const docMoi = (t) => moi.xepUyQuyen(moi.phanTichUyQuyen(t));
  const sai = [];
  for (const ten of Object.keys(cu.LOAI)) {
    const tm = tc[ten];
    if (!tm) {
      sai.push(`${ten} · không có tên mới trong TEN_CU`);
      continue;
    }
    const a = nhomCua(docCu(`ban: 1\ntu_lam: [${ten}]\n`), ten);
    for (const tep of [`${tc.ban}: 1\n${tc.tu_lam}: [${tm}]\n`, `${tc.ban}: 1\n${tc.tu_lam}:\n  - ${tm}\n`]) {
      const b = nhomCua(docMoi(tep), tm);
      if (a.nhom !== b.nhom) sai.push(`${tm} · nhóm lệch bộ đọc trước vòng`);
      else if (a.cau !== b.cau) sai.push(`${tm} · câu lệch bộ đọc trước vòng`);
    }
  }
  for (const [ten, moTa] of Object.entries(cu.VUNG_CAM)) {
    const tm = tc[ten] ?? ten;
    const kqMoi = docMoi(`${tc.ban}: 1\n${tc.tu_lam}: [${tc.gop}, ${tm}]\n`);
    if (moi.VUNG_CAM[tm] !== moTa || kqMoi.nhan.length || !(kqMoi.loi ?? '').includes(`(${moTa})`)) sai.push(`${tm} · điều chạm lệch bộ đọc trước vòng`);
  }
  return [...new Set(sai)];
}

test('TA-01 bang-ten', async () => {
  assert.deepEqual(await bangTen(GOI), []);
  console.log(`  TA-01: ${LOAI_MONG.length} loại · ${CAM_MONG.length} vùng cấm · ${Object.keys(TEN_CU_MONG).length} cặp tên cũ`);
});

test('TA-01 vi-phan-truoc-vong', async () => {
  assert.deepEqual(await viPhan(GOI), []);
});

test('TA-01-do them-ten', async () => {
  assert.deepEqual(await bangTen(GOI), [], 'đối chứng dương');
  const sao = banSao(['scripts/uy-quyen.mjs', 'export const LOAI = {\n', "export const LOAI = {\n  extra: { nhom: 'van-hoi', cau: CHUA_LENH },\n"]);
  const sai = await bangTen(sao);
  assert.ok(sai.includes('LOAI lệch bảng: thừa extra'), `TA-01-do: ${sai.join(' | ')}`);
  console.log('  TA-01-do: LOAI lệch bảng: thừa extra');
});

test('TA-01-do lech-cau', async () => {
  assert.deepEqual(await viPhan(GOI), [], 'đối chứng dương');
  const sao = banSao(['scripts/uy-quyen.mjs', "session: { nhom: 'van-hoi', cau: 'mở phiên:", "session: { nhom: 'van-hoi', cau: 'Mở phiên:"]);
  const sai = await viPhan(sao);
  assert.ok(sai.includes('session · câu lệch bộ đọc trước vòng'), `TA-01-do: ${sai.join(' | ')}`);
  console.log('  TA-01-do: session · câu lệch bộ đọc trước vòng');
});

// ---------- TA-02 · AC-2 — tên cũ từ chối cả tệp, gọi đúng tên mới ----------
const RE_TEN_CU = /tên cũ «([^»]+)» — bản uỷ quyền nay dùng «([^»]+)»/;
function hangTenCu() {
  const hang = [];
  for (const [cu, moi] of Object.entries(TEN_CU_MONG)) {
    if (KHOA_CU.includes(cu)) continue;
    const cam = CAM_MONG.includes(moi);
    hang.push({ cu, moi, cam, tep: (t) => `version: 1\ndelegated: [merge, ${t}]\n` });
    hang.push({ cu, moi, cam, tep: (t) => `version: 1\ndelegated:\n  - merge\n  - '${t}'   # ghi chú\n` });
  }
  hang.push({ cu: 'ban', moi: 'version', cam: false, tep: (t) => `${t}: 1\ndelegated: [merge]\n` });
  hang.push({ cu: 'tu_lam', moi: 'delegated', cam: false, tep: (t) => `version: 1\n${t}: [merge]\n` });
  hang.push({ cu: 'ban', moi: 'version', cam: false, tep: (t) => (t === 'ban' ? 'version: 1\nban: 1\ndelegated: [merge]\n' : 'version: 1\ndelegated: [merge]\n') });
  hang.push({ cu: 'gop', moi: 'merge', cam: false, tep: (t) => `version: 1\ndelegated: [governance, ${t}]\n`});
  return hang;
}
async function maTranTenCu(gocGoi) {
  const m = await nap(gocGoi, 'uy-quyen.mjs');
  const doc = (t) => m.xepUyQuyen(m.phanTichUyQuyen(t));
  const hang = hangTenCu();
  const sai = [];
  for (const h of hang) {
    const kq = doc(h.tep(h.cu));
    const k = RE_TEN_CU.exec(kq.loi ?? '');
    if (kq.nhan.length) sai.push(`${h.cu} · vẫn nhận ${kq.nhan.join(', ')}`);
    if (!k) sai.push(`${h.cu} · thiếu tên mới ${h.moi}`);
    else if (k[1] !== h.cu || k[2] !== h.moi) sai.push(`${h.cu} · mong ${h.moi} · nhận ${k[2]}`);
    else if (h.cam && !kq.loi.includes('vùng cấm cứng')) sai.push(`${h.cu} · thiếu «vùng cấm cứng»`);
    // Đối chứng dương: cùng tệp, tên cũ thay bằng tên mới → không còn câu tên cũ.
    const kqMoi = doc(h.tep(h.moi));
    if (RE_TEN_CU.test(kqMoi.loi ?? '')) sai.push(`${h.moi} · tên mới bị gọi là tên cũ`);
  }
  return { sai: [...new Set(sai)], so: hang.length };
}

test('TA-02 ma-tran-ten-cu', async () => {
  const { sai, so } = await maTranTenCu(GOI);
  assert.equal(so, 18 * 2 + 4, 'ma trận phủ mười tám tên ở hai dạng cộng hai khoá và hai hàng thứ tự');
  assert.deepEqual(sai, []);
  console.log(`  TA-02: ${so} hàng · mỗi hàng từ chối cả tệp và gọi đúng cặp`);
});

test('TA-02 kho-dl6', async () => {
  const { docUyQuyen } = await nap(GOI, 'uy-quyen.mjs');
  const { k } = khoUyQuyen({ uyQuyen: 'ban: 1\ntu_lam: [gop]\n' });
  const kq = docUyQuyen({ gocKho: k, nhanhChinh: 'main' });
  assert.equal(kq.co, true);
  assert.deepEqual(kq.nhan, []);
  assert.ok((kq.loi ?? '').includes('«ban»') && kq.loi.includes('«version»'), `lỗi «${kq.loi}»`);
});

test('TA-02-do bo-bang-ten-cu', async () => {
  assert.deepEqual((await maTranTenCu(GOI)).sai, [], 'đối chứng dương');
  const sao = banSao(['scripts/uy-quyen.mjs', 'export const TEN_CU = {', 'export const TEN_CU = {}; const TEN_CU_BO = {']);
  const { sai } = await maTranTenCu(sao);
  assert.ok(sai.includes('gop · thiếu tên mới merge'), `TA-02-do: ${sai.join(' | ')}`);
  console.log('  TA-02-do: gop · thiếu tên mới merge');
});

test('TA-02-do doi-cheo', async () => {
  assert.deepEqual((await maTranTenCu(GOI)).sai, [], 'đối chứng dương');
  const sao = banSao(['scripts/uy-quyen.mjs', "  gop: 'merge',", "  gop: 'merge-order',"], ['scripts/uy-quyen.mjs', "  'thu-tu-gop': 'merge-order',", "  'thu-tu-gop': 'merge',"]);
  const { sai } = await maTranTenCu(sao);
  assert.ok(sai.includes('gop · mong merge · nhận merge-order'), `TA-02-do: ${sai.join(' | ')}`);
  console.log('  TA-02-do: gop · mong merge · nhận merge-order');
});

// ---------- TA-04 · AC-4 — chiều im so với đỉnh trước vòng ----------
// Cùng hàm so của UQ-05, gốc so là bộ đọc tên cũ ở a9b7cbe6: kho không có tệp chạy từng byte như trước vòng.
async function chieuImTruocVong(gocMoi) {
  const loi = [...(await chieuIm(gocMoi, BAN_TRUOC_VONG))];
  const k = khoKhongRemote();
  loi.push(...(await soBonLenh(gocMoi, k, dotGiamSat(k, { xin: HAI_DON }), BAN_TRUOC_VONG)).map((x) => `không remote: ${x}`));
  const h = khoUyQuyen({ uyQuyen: null });
  git(h.k, 'remote', 'set-url', 'origin', path.join(h.goc, 'khong-co.git'));
  loi.push(...(await soBonLenh(gocMoi, h.k, dotGiamSat(h.k, { xin: HAI_DON }), BAN_TRUOC_VONG)).map((x) => `lấy về hỏng: ${x}`));
  return loi;
}

test('TA-04 truoc-vong', async () => {
  assert.deepEqual(await chieuImTruocVong(GOI), []);
  const cu = await gopKhongCo(layBan(BAN_TRUOC_VONG));
  const moi = await gopKhongCo(GOI);
  assert.equal(JSON.parse(moi).kq.da_gop, true, 'đối chứng: dãy giữ khoá gộp được PR chạm workflows như trước vòng');
  assert.equal(moi, cu);
});

test('TA-04-do them-khoa', async () => {
  assert.deepEqual(await chieuIm(GOI, BAN_TRUOC_VONG), [], 'đối chứng dương');
  const sao = banSao(['scripts/the.mjs', '    canh_bao: canhBao,\n  };', '    canh_bao: canhBao,\n    uy_quyen: null,\n  };']);
  const loi = await chieuIm(sao, BAN_TRUOC_VONG);
  assert.ok(loi.includes('the khoi-tao --json lệch'), `TA-04-do: ${loi.join(' | ')}`);
  console.log('  TA-04-do: the khoi-tao --json lệch');
});

// ---------- TA-07 · AC-7 — nghĩa tiếng Việt trên thẻ và báo cáo đợt ----------
const CO_DAU = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
const lechNghia = (nghia, mong) => {
  const sai = [];
  const co = Object.keys(nghia ?? {});
  for (const t of mong) if (!co.includes(t)) sai.push(`thẻ thiếu nghĩa tiếng Việt: ${t}`);
  for (const t of co) if (!mong.includes(t)) sai.push(`thẻ thừa nghĩa: ${t}`);
  for (const t of co) {
    if (!CO_DAU.test(nghia[t] ?? '')) sai.push(`${t} · nghĩa không có chữ tiếng Việt có dấu`);
    if (String(nghia[t]).toLowerCase().includes(t)) sai.push(`${t} · nghĩa chứa tên tiếng Anh`);
  }
  return sai;
};
async function kiemNghia(gocGoi) {
  const a = khoUyQuyen({ uyQuyen: `version: 1\ndelegated: [${LOAI_MONG.join(', ')}]\n` });
  dotGiamSat(a.k);
  const t = theCua(gocGoi, a.k);
  const khong = khoUyQuyen({ uyQuyen: null });
  dotGiamSat(khong.k);
  const sai = t.uy_quyen ? lechNghia(t.uy_quyen.nghia, LOAI_MONG) : ['thẻ thiếu khối uy_quyen'];
  if (JSON.stringify(t.hoi) !== JSON.stringify(theCua(gocGoi, khong.k).hoi)) sai.push('nghĩa làm đổi mảng hoi');
  return sai;
}

test('TA-07 the-nghia', async () => {
  assert.deepEqual(await kiemNghia(GOI), []);
  console.log(`  TA-07: ${LOAI_MONG.length} loại · mỗi loại có nghĩa tiếng Việt trên thẻ`);
});

test('TA-07 dem-nghia', async () => {
  const a = khoGop();
  const d = dotGiamSat(a.k, { xin: HAI_DON });
  for (let i = 0; i < 2; i++) assert.equal((await gopQuyen(GOI, a.k, ioCua(a.k, a.sha, { dot: d }))).kq.da_gop, true);
  const { thuTuGop } = await nap(GOI, 'thu-tu-gop.mjs');
  assert.equal(thuTuGop(a.k, 'P2,P1', { phien: GS }).duoc, true);
  // Đợt chạy qua lần nâng gói: một dòng dung-quyen đời cũ mang tên `gop` — đếm được, không có nghĩa, không ném.
  fs.appendFileSync(path.join(d, 'su-kien.jsonl'), `${JSON.stringify({ luc: NGAY, loai: 'dung-quyen', quyen: 'gop', can_phan: false })}\n`);
  const dem = JSON.parse(cli(GOI, a.k, ['dem', '--json']).split('\n')[1]);
  assert.equal(dem.dung_quyen.tong, 4);
  assert.deepEqual(dem.dung_quyen.theo_quyen, { merge: 2, 'merge-order': 1, gop: 1 });
  assert.deepEqual(lechNghia(dem.dung_quyen.nghia, ['merge', 'merge-order']), []);
});

test('TA-07-do bo-nghia', async () => {
  assert.deepEqual(await kiemNghia(GOI), [], 'đối chứng dương');
  const sao = banSao(['scripts/uy-quyen.mjs', ", nghia: 'mở và dọn phiên' }", ' }']);
  const sai = await kiemNghia(sao);
  assert.ok(sai.includes('thẻ thiếu nghĩa tiếng Việt: session'), `TA-07-do: ${sai.join(' | ')}`);
  console.log('  TA-07-do: thẻ thiếu nghĩa tiếng Việt: session');
});
