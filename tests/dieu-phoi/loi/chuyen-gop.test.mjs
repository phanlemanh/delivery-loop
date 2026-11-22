// Hồ sơ chuyen-gop (thí điểm «trợ lý quyết định», hàng 2) — chuyến gộp + cửa proof của luật tự trị. Tên ca = mã tiêu chí.
// Kho git THẬT dựng trong lượt (origin trần + bản clone, mỗi PR một nhánh); chỉ `gh` là giả (trả JSON `gh pr view`, ghi
// lại lời gọi `gh pr merge`). Lệnh kiểm trên ngọn chuyến là lệnh thật chạy trong worktree tạm. Mọi ca âm tính có đối
// chứng dương cùng kho và ghim thông điệp. Đường dẫn suy từ vị trí tệp này.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { gom, tachDoi, chayChuyen } from '../../../plugins/dispatch/scripts/chuyen-gop.mjs';
import { docTuTri, tangCuaTep, coMacKy, cuaProof } from '../../../plugins/dispatch/scripts/cua-proof.mjs';
import { xetGop } from '../../../plugins/dispatch/scripts/gop.mjs';
import { kiemCauHinh } from '../../../plugins/dispatch/scripts/hinh-dang.mjs';
import { CFG_PHAT_LICH } from './mau-thu.mjs';

const tam = () => fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dp-chuyen-')));
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...a], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ghi = (kho, tep, noi) => { fs.mkdirSync(path.dirname(path.join(kho, tep)), { recursive: true }); fs.writeFileSync(path.join(kho, tep), noi); };
const commit = (kho, tep, noi, msg) => { ghi(kho, tep, noi); git(kho, 'add', '-A'); git(kho, 'commit', '-q', '-m', msg); };
// Hồ sơ đã thông bằng máy (không mang chuỗi trạng thái ký người — lưới RT13, tiền lệ gop.test.mjs).
const HD = (slug) => `---\nslug: ${slug}\nstatus: machine-cleared\n---\n`;
const MAC_KY = (ve = 'd-1') => JSON.stringify({ id: 'd-2', type: 'approach', stage: 'gate1', at: '2026-11-22T00:00:00Z', decision: 'Đã đi theo khuyến nghị: x', why: 'v', cost_if_wrong: 'x', so_do: 2, may: 'mac-ky', ve, di_theo: 'khuyen' }) + '\n';
const XANH = [{ __typename: 'CheckRun', name: 'gate', status: 'COMPLETED', conclusion: 'SUCCESS' }];
const XANH_PROOF = [...XANH, { __typename: 'CheckRun', name: 'evidence-recheck', status: 'COMPLETED', conclusion: 'SUCCESS' }];

// Kho: main có tệp gốc; mỗi PR một nhánh từ main, thêm tệp riêng + hồ sơ đã thông. `pr` = [{n, tep: {đường: nội dung}, dat_luc, macKy}]
function kho(prs, { tuTri = null } = {}) {
  const goc = tam();
  const origin = path.join(goc, 'origin.git');
  git(goc, 'init', '-q', '--bare', '-b', 'main', origin);
  const k = path.join(goc, 'kho');
  git(goc, 'clone', '-q', origin, k);
  git(k, 'checkout', '-q', '-b', 'main');
  commit(k, 'src/chung.ts', 'v1\n', 'goc');
  if (tuTri) commit(k, 'governance/autonomy.yaml', tuTri, 'luat tu tri');
  git(k, 'push', '-q', 'origin', 'main');
  const sha = {};
  for (const p of prs) {
    git(k, 'checkout', '-q', '-b', `pr-${p.n}`, 'main');
    for (const [t, v] of Object.entries(p.tep)) ghi(k, t, v);
    ghi(k, `_acceptance/h${p.n}/contract.md`, HD(`h${p.n}`));
    ghi(k, `_acceptance/h${p.n}/decisions.jsonl`, p.macKy ? MAC_KY() : '');
    git(k, 'add', '-A');
    git(k, '-c', `user.name=t`, 'commit', '-q', '-m', `pr ${p.n}`, `--date=${p.dat_luc ?? '2026-11-22T01:00:00Z'}`);
    git(k, 'push', '-q', 'origin', `pr-${p.n}`);
    sha[p.n] = git(k, 'rev-parse', 'HEAD');
  }
  git(k, 'checkout', '-q', 'main');
  return { k, sha };
}
function ioCua(k, sha, { rollup = () => XANH, mergeable = () => 'MERGEABLE' } = {}) {
  const goiGh = [];
  return {
    goiGh,
    chay: (cmd, args) => {
      if (cmd !== 'gh') return execFileSync(cmd, args, { cwd: k, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } });
      goiGh.push(args);
      if (args[0] === 'run' && args[1] === 'list') return '[]';
      if (args[0] === 'pr' && args[1] === 'view') {
        const n = Number(args[2]);
        return JSON.stringify({ number: n, state: 'OPEN', isDraft: false, mergeable: mergeable(n), headRefOid: sha[n], headRefName: `pr-${n}`, baseRefName: 'main', statusCheckRollup: rollup(n) });
      }
      return '';
    },
  };
}
const gopDaGoi = (io) => io.goiGh.filter((a) => a[0] === 'pr' && a[1] === 'merge').map((a) => Number(a[2]));
const CFG = (them = {}) => ({ ...CFG_PHAT_LICH, nhanh_chinh: 'main', chuyen_gop: { bat: true, cua_so_phut: 60, lenh_kiem: 'test ! -e HONG', ...them } });

// ── AC-1 — gom các PR trong cùng cửa sổ ───────────────────────────────────────────────────────────────
test('AC-1 gom cac PR dat bang chung trong cung cua so, khoi hanh khi het cua so', () => {
  const uv = [{ pr: 3, dat_luc: '2026-11-22T10:20:00Z' }, { pr: 1, dat_luc: '2026-11-22T10:00:00Z' }, { pr: 2, dat_luc: '2026-11-22T10:59:00Z' }, { pr: 4, dat_luc: '2026-11-22T11:01:00Z' }];
  const chua = gom(uv, { now: '2026-11-22T10:30:00Z', cuaSoPhut: 60 });
  assert.deepEqual([chua.khoi_hanh, chua.gio_khoi_hanh, chua.thanh_vien, chua.cho], [false, '2026-11-22T11:00:00.000Z', [1, 3, 2], [4]]);
  const roi = gom(uv, { now: '2026-11-22T11:00:00Z', cuaSoPhut: 60 });
  assert.deepEqual([roi.khoi_hanh, roi.thanh_vien], [true, [1, 3, 2]]);
  assert.deepEqual(gom([], { now: '2026-11-22T11:00:00Z', cuaSoPhut: 60 }), { khoi_hanh: false, gio_khoi_hanh: null, thanh_vien: [], cho: [] });
});

// ── AC-2 — kiểm MỘT lần trên ngọn chuyến, gộp theo thứ tự ─────────────────────────────────────────────
test('AC-2 chuyen xanh kiem mot lan tren ngon roi gop ca chuyen theo thu tu dat bang chung', () => {
  const a = kho([{ n: 1, tep: { 'src/a.ts': 'a\n' }, dat_luc: '2026-11-22T10:00:00Z' }, { n: 2, tep: { 'src/b.ts': 'b\n' }, dat_luc: '2026-11-22T10:10:00Z' }, { n: 3, tep: { 'src/c.ts': 'c\n' }, dat_luc: '2026-11-22T10:05:00Z' }]);
  const io = ioCua(a.k, a.sha);
  const kq = chayChuyen({ io, cfg: CFG(), prs: [1, 2, 3], now: '2026-11-22T12:00:00Z' });
  assert.equal(kq.duong, 'da-gop', kq.ly_do);
  assert.deepEqual(kq.xanh, [1, 3, 2], 'thứ tự = thứ tự đạt bằng chứng');
  assert.equal(kq.so_lan_kiem, 1, 'chuyến xanh kiểm đúng một lần');
  assert.deepEqual(gopDaGoi(io), [1, 3, 2]);
  for (const g of io.goiGh.filter((x) => x[1] === 'merge')) assert.deepEqual(g.slice(3), ['--merge', '--match-head-commit', a.sha[g[2]]], 'gộp ghim đúng đầu nhánh');
  // --xet: chỉ in quyết định, không gộp.
  const io2 = ioCua(a.k, a.sha);
  const x = chayChuyen({ io: io2, cfg: CFG(), prs: [1, 2, 3], now: '2026-11-22T12:00:00Z', xet: true });
  assert.deepEqual([x.duong, gopDaGoi(io2)], ['gop-duoc', []]);
});
test('AC-2 chua het cua so thi cho, khong kiem khong gop', () => {
  const a = kho([{ n: 1, tep: { 'src/a.ts': 'a\n' }, dat_luc: '2026-11-22T10:00:00Z' }]);
  const io = ioCua(a.k, a.sha);
  const kq = chayChuyen({ io, cfg: CFG(), prs: [1], now: '2026-11-22T10:30:00Z' });
  assert.deepEqual([kq.duong, kq.gio_khoi_hanh, kq.so_lan_kiem, gopDaGoi(io)], ['cho', '2026-11-22T11:00:00.000Z', 0, []]);
  const ep = chayChuyen({ io, cfg: CFG(), prs: [1], now: '2026-11-22T10:30:00Z', ngay: true });
  assert.equal(ep.duong, 'da-gop', 'cờ khởi hành ngay bỏ qua cửa sổ');
});

// ── AC-3 — chuyến đỏ tách đôi, PR lỗi rớt, phần còn lại đi tiếp ───────────────────────────────────────
test('AC-3 chuyen do tach doi quy dung PR loi, PR loi rot, phan con lai van gop', () => {
  const prs = [1, 2, 3, 4, 5, 6].map((n, i) => ({ n, tep: { [`src/p${n}.ts`]: `${n}\n`, ...(n === 4 ? { HONG: 'x\n' } : {}) }, dat_luc: `2026-11-22T10:0${i}:00Z` }));
  const a = kho(prs);
  const io = ioCua(a.k, a.sha);
  const kq = chayChuyen({ io, cfg: CFG(), prs: [1, 2, 3, 4, 5, 6], now: '2026-11-22T12:00:00Z' });
  assert.equal(kq.duong, 'da-gop', kq.ly_do);
  assert.deepEqual(kq.rot.map((r) => [r.pr, r.ly_do]), [[4, 'làm chuyến đỏ — lệnh kiểm trên ngọn thoát khác 0 khi có PR này']]);
  assert.deepEqual(kq.xanh, [1, 2, 3, 5, 6]);
  assert.deepEqual(gopDaGoi(io), [1, 2, 3, 5, 6], 'PR lỗi không bị gộp');
  assert.ok(kq.so_lan_kiem <= 1 + Math.ceil(Math.log2(6)) + 1, `tách đôi phải dưới tuyến tính: ${kq.so_lan_kiem} lần`);
});
test('AC-3 tach doi thuan: hai PR loi, so lan kiem logarit', () => {
  const hong = new Set([3, 7]);
  const kiem = (ds) => !ds.some((p) => hong.has(p));
  const kq = tachDoi([1, 2, 3, 4, 5, 6, 7, 8], kiem);
  assert.deepEqual([kq.xanh, kq.rot.map((r) => r.pr)], [[1, 2, 4, 5, 6, 8], [3, 7]]);
  assert.ok(kq.so_lan_kiem <= 2 * (1 + Math.ceil(Math.log2(8))) + 1, `${kq.so_lan_kiem} lần`);
  // Hỏng do TỔ HỢP (mỗi PR một mình xanh, cùng nhau đỏ): PR đứng sau trong chuyến rớt.
  const toHop = tachDoi([1, 2, 3], (ds) => !(ds.includes(1) && ds.includes(3)));
  assert.deepEqual([toHop.xanh, toHop.rot.map((r) => r.pr)], [[1, 2], [3]]);
  assert.deepEqual(tachDoi([], kiem), { xanh: [], rot: [], so_lan_kiem: 0 });
});

// ── AC-4 — xung đột trong chuyến ──────────────────────────────────────────────────────────────────────
test('AC-4 PR xung dot voi PR dung truoc trong chuyen rot voi ly do, chuyen van di', () => {
  const a = kho([{ n: 1, tep: { 'src/chung.ts': 'mot\n' }, dat_luc: '2026-11-22T10:00:00Z' }, { n: 2, tep: { 'src/chung.ts': 'hai\n' }, dat_luc: '2026-11-22T10:01:00Z' }, { n: 3, tep: { 'src/c.ts': 'c\n' }, dat_luc: '2026-11-22T10:02:00Z' }]);
  const io = ioCua(a.k, a.sha);
  const kq = chayChuyen({ io, cfg: CFG(), prs: [1, 2, 3], now: '2026-11-22T12:00:00Z' });
  assert.deepEqual(kq.rot.map((r) => [r.pr, r.ly_do]), [[2, 'xung đột khi gộp vào chuyến (sau #1) — gộp nhánh chính vào nhánh, gỡ xung đột rồi xếp chuyến sau']]);
  assert.deepEqual(gopDaGoi(io), [1, 3]);
});

// ── AC-5 — cửa proof của luật tự trị ──────────────────────────────────────────────────────────────────
const TU_TRI = (proof, def = 'low') => `version: 1\ndefault: ${def}\nproof:\n  check: "${proof}"\nlow:\n  - "docs/**"\nhigh:\n  - "governance/**"\n  - "**/migrations/**"\n`;
test('AC-5 doc luat tu tri va tinh tang cua PR theo tep', () => {
  const t = docTuTri(TU_TRI('evidence-recheck', 'medium'));
  assert.deepEqual([t.co, t.proof, t.default, t.low, t.high], [true, 'evidence-recheck', 'medium', ['docs/**'], ['governance/**', '**/migrations/**']]);
  assert.equal(tangCuaTep(t, ['docs/a.md']), 'low');
  assert.equal(tangCuaTep(t, ['docs/a.md', 'src/a.ts']), 'medium');
  assert.equal(tangCuaTep(t, ['src/db/migrations/1.sql', 'docs/a.md']), 'high');
  assert.equal(docTuTri(null).co, false);
  assert.equal(docTuTri(TU_TRI('')).proof, '');
});
test('AC-5 mac-ky chi tu gop khi luat tu tri khai proof, check proof xanh va PR o tang low', () => {
  const tuTri = docTuTri(TU_TRI('evidence-recheck'));
  const tep = ['src/a.ts'];
  assert.deepEqual(cuaProof({ tuTri, rollup: XANH_PROOF, tep, macKy: true }), { qua: true, ly_do: 'mặc-ký qua cửa proof: «evidence-recheck» xanh, PR ở tầng low' });
  assert.deepEqual(cuaProof({ tuTri: docTuTri(null), rollup: XANH_PROOF, tep, macKy: true }).ly_do, 'mặc-ký dừng trước cửa gộp: kho chưa có governance/autonomy.yaml — không có bằng chứng máy đứng thế chỗ người');
  assert.deepEqual(cuaProof({ tuTri: docTuTri(TU_TRI('')), rollup: XANH_PROOF, tep, macKy: true }).ly_do, 'mặc-ký dừng trước cửa gộp: luật tự trị chưa khai proof.check');
  assert.deepEqual(cuaProof({ tuTri, rollup: XANH, tep, macKy: true }).ly_do, 'mặc-ký dừng trước cửa gộp: check proof «evidence-recheck» chưa xanh trên đầu nhánh');
  assert.deepEqual(cuaProof({ tuTri: docTuTri(TU_TRI('evidence-recheck', 'medium')), rollup: XANH_PROOF, tep, macKy: true }).ly_do, 'mặc-ký dừng trước cửa gộp: PR ở tầng medium của luật tự trị — chỉ tầng low tự gộp');
  // Đối chứng: hồ sơ không mang mặc-ký đi như trước vòng, không đọc luật tự trị.
  assert.deepEqual(cuaProof({ tuTri: docTuTri(null), rollup: XANH, tep, macKy: false }), { qua: true, ly_do: null });
});
test('AC-5 nhan biet mon mac-ky tu so tren dau nhanh, mon da bi nguoi phu quyet khong tinh', () => {
  assert.equal(coMacKy({ status: 'machine-cleared', so: MAC_KY() }), true);
  assert.equal(coMacKy({ status: 'machine-cleared', so: '' }), false);
  const daLat = MAC_KY() + JSON.stringify({ id: 'd-3', stage: 'gate1', supersedes: 'd-1', decided_by: 'Chủ Kho' }) + '\n';
  assert.equal(coMacKy({ status: 'machine-cleared', so: daLat }), false, 'người đã quyết lại món ấy');
  assert.equal(coMacKy({ status: 'machine-cleared', so: '{hỏng\n' + MAC_KY() }), true, 'dòng hỏng bỏ qua');
});
test('AC-5 lenh gop tung PR va chuyen gop cung chan mac-ky o kho chua khai proof', () => {
  const a = kho([{ n: 1, tep: { 'src/a.ts': 'a\n' }, macKy: true, dat_luc: '2026-11-22T10:00:00Z' }, { n: 2, tep: { 'src/b.ts': 'b\n' }, dat_luc: '2026-11-22T10:01:00Z' }]);
  const io = ioCua(a.k, a.sha);
  const g = xetGop({ io, cfg: { ...CFG_PHAT_LICH, nhanh_chinh: 'main' }, pr: 1, slug: 'h1' });
  assert.deepEqual([g.duong, g.ly_do], ['chan', 'mặc-ký dừng trước cửa gộp: kho chưa có governance/autonomy.yaml — không có bằng chứng máy đứng thế chỗ người']);
  assert.equal(xetGop({ io, cfg: { ...CFG_PHAT_LICH, nhanh_chinh: 'main' }, pr: 2, slug: 'h2' }).duong, 'moi-nhat', 'đối chứng: PR không mặc-ký gộp như cũ');
  const kq = chayChuyen({ io, cfg: CFG(), prs: [1, 2], now: '2026-11-22T12:00:00Z' });
  assert.deepEqual(kq.ngoai.map((r) => [r.pr, r.ly_do.slice(0, 33)]), [[1, "mặc-ký dừng trước cửa gộp: kho ch"]], "PR mặc-ký đứng ngoài chuyến, có tên");
  assert.deepEqual(gopDaGoi(io), [2]);
  // Kho khai proof, check xanh, tầng low → mặc-ký vào chuyến.
  const b = kho([{ n: 1, tep: { 'src/a.ts': 'a\n' }, macKy: true }], { tuTri: TU_TRI('evidence-recheck') });
  const ioB = ioCua(b.k, b.sha, { rollup: () => XANH_PROOF });
  assert.equal(xetGop({ io: ioB, cfg: { ...CFG_PHAT_LICH, nhanh_chinh: 'main' }, pr: 1, slug: 'h1' }).duong, 'moi-nhat');
  // PR tự sửa luật tự trị trên nhánh của nó không mở được cửa: luật đọc ở nhánh chính.
  // Luật PR tự viết mở hết cửa (default low, proof «gate» đã xanh, không có dòng high) — vẫn phải chặn.
  const c = kho([{ n: 1, tep: { 'src/a.ts': 'a\n', 'governance/autonomy.yaml': 'version: 1\ndefault: low\nproof:\n  check: "gate"\n' }, macKy: true }]);
  const g3 = xetGop({ io: ioCua(c.k, c.sha), cfg: { ...CFG_PHAT_LICH, nhanh_chinh: 'main' }, pr: 1, slug: 'h1' });
  assert.equal(g3.duong, 'chan', 'luật tự trị của nhánh PR không được tính');
});

// ── AC-6 — cấu hình đợt ───────────────────────────────────────────────────────────────────────────────
test('AC-6 khoa chuyen_gop trong cau hinh dot, vang la tat, sai khuon do co ten', () => {
  const goc = { ...CFG_PHAT_LICH };
  assert.doesNotThrow(() => kiemCauHinh(goc), 'vắng khoá = như cũ');
  assert.doesNotThrow(() => kiemCauHinh({ ...goc, chuyen_gop: { bat: true, cua_so_phut: 60, lenh_kiem: 'npm test' } }));
  assert.throws(() => kiemCauHinh({ ...goc, chuyen_gop: { bat: 'co' } }), /dieu-phoi\.config\.json: chuyen_gop\.bat phải là true\/false/);
  assert.throws(() => kiemCauHinh({ ...goc, chuyen_gop: { bat: true, cua_so_phut: 0, lenh_kiem: 'x' } }), /chuyen_gop\.cua_so_phut phải là số phút dương/);
  assert.throws(() => kiemCauHinh({ ...goc, chuyen_gop: { bat: true, cua_so_phut: 60 } }), /chuyen_gop\.lenh_kiem phải là chuỗi không rỗng khi bat: true/);
  assert.throws(() => kiemCauHinh({ ...goc, chuyen_gop: { bat: true, cua_so_phut: 60, lenh_kiem: 'x', la: 1 } }), /khoá lạ chuyen_gop\.la/);
  const a = kho([{ n: 1, tep: { 'src/a.ts': 'a\n' } }]);
  assert.throws(() => chayChuyen({ io: ioCua(a.k, a.sha), cfg: { ...CFG_PHAT_LICH, nhanh_chinh: 'main' }, prs: [1], now: '2026-11-22T12:00:00Z' }), /chuyến gộp tắt \(chuyen_gop\.bat trong dieu-phoi\.config\.json\) — gộp từng PR bằng `gop <số PR>`/);
});

// ── AC-7 — PR chưa đủ điều kiện không vào chuyến ──────────────────────────────────────────────────────
test('AC-7 PR chua xanh CI, con nhap hay ho so chua thong khong vao chuyen va duoc neu ten', () => {
  const a = kho([{ n: 1, tep: { 'src/a.ts': 'a\n' } }, { n: 2, tep: { 'src/b.ts': 'b\n' } }, { n: 3, tep: { 'src/c.ts': 'c\n' } }]);
  const io = ioCua(a.k, a.sha, { rollup: (n) => (n === 2 ? [{ name: 'gate', status: 'IN_PROGRESS' }] : XANH) });
  const kq = chayChuyen({ io, cfg: CFG(), prs: [1, 2, 3], now: '2026-11-22T12:00:00Z' });
  assert.deepEqual(kq.ngoai.map((r) => [r.pr, r.ly_do]), [[2, 'check chưa xanh — gate: IN_PROGRESS']]);
  assert.deepEqual(gopDaGoi(io), [1, 3]);
});
