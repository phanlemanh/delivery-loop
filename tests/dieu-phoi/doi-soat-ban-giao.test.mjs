// Ca đo của hồ sơ doi-soat-ban-giao. Tên ca bắt đầu «DS-0n» = AC-n; bảng tiêu chí → tên ca nằm ở
// _acceptance/doi-soat-ban-giao/rang/chay.sh. Kho thử do mã sinh trong lượt: kho git thật, hai worktree LIÊN KẾT thật cho
// P1, P2, remote là kho bare, đợt mở bằng CLI thật, bàn giao dựng bằng nhịp bộ phát lịch thật (đồng hồ giả). Ngày commit
// ghim nên sha tất định — tệp mẫu chữ so được từng byte. Đường suy từ vị trí tệp. Mỗi ca «-do» chạy CHÍNH hàm đo trên bản
// sao trọn gói bị tiêm, sau khi bản lành xanh trên cùng loại kho thử, kiểm bước tiêm đã đổi tệp, và ghim thông điệp.
// Khung kho thử chép từ doi-tai-khoan.test.mjs (không import tệp đã ký: import chạy lại mọi ca của nó).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathspec } from '../bo-cuc.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(DAY, '..', '..');
const GOI = path.join(KIT, 'plugins/dispatch');
const TEP_MAU = path.join(KIT, '_acceptance', 'doi-soat-ban-giao', 'mau-dong.md');

process.env.DIEU_PHOI_MAY_DIR = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ds-may-')));
const canDon = [process.env.DIEU_PHOI_MAY_DIR];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo = 'ds-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ghiJ = (p, du) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(du, null, 2)}\n`);
};
const NGAY = '2026-10-11T08:00:00Z';
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT'));
const ENV_GIT = { ...ENV, GIT_AUTHOR_DATE: NGAY, GIT_COMMITTER_DATE: NGAY };
const nap = (gocGoi, tep) => import(`${path.join(gocGoi, 'scripts', tep)}?v=${Math.random()}`);
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...a], { cwd, env: ENV_GIT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
function chayCli(cwd, doiSo, { gocGoi = GOI, env = {} } = {}) {
  const r = spawnSync(process.execPath, [path.join(gocGoi, 'scripts', 'dieu-phoi.mjs'), ...doiSo], { cwd, env: { ...ENV, ...env }, encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}
const PHUT = 60_000;
const T = Date.parse(NGAY);
const ISO = (ms) => new Date(ms).toISOString();
const envGio = (ms) => ({ DIEU_PHOI_NOW_MS: String(ms) });

// Kho thử + hai worktree liên kết thật + gói đợt + đợt «thu» mở bằng CLI thật, pha dang-chay.
function khoLienKet({ gocGoi = GOI, remote = false } = {}) {
  const kho = tam('ds-kho-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const cha = tam('ds-wt-');
  const w1 = path.join(cha, 'p1');
  const w2 = path.join(cha, 'p2');
  git(kho, 'worktree', 'add', '-q', '-b', 'p1', w1);
  git(kho, 'worktree', 'add', '-q', '-b', 'p2', w2);
  const dir = path.join(kho, 'goi', 'dot-thu');
  ghiJ(path.join(dir, 'dieu-phoi.config.json'), docJ(path.join(GOI, 'scripts', 'mau', 'dieu-phoi.config.json')));
  ghiJ(path.join(dir, 'hang-viec.json'), {
    dot: '',
    day: [{ id: 'P1', worktree: fs.realpathSync(w1) }, { id: 'P2', worktree: fs.realpathSync(w2) }],
    hang: [{ ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 }, { ma: 'B', slug: 'hang-b', day: 'P2', uu_tien: 1 }],
    ngoai_hang_merge: [],
  });
  fs.writeFileSync(path.join(dir, 'LUAT-rieng.md'), '# Luật riêng\n');
  fs.mkdirSync(path.join(kho, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\ndieu_phoi:\n  goi_dot: goi/dot-{ten}\n');
  // Đợt mở từ gói chỉ giao hàng đã quyết build: hai hàng có ô build.
  for (const s of ['hang-a', 'hang-b']) {
    fs.mkdirSync(path.join(kho, '_acceptance', s), { recursive: true });
    fs.writeFileSync(path.join(kho, '_acceptance', s, 'opportunity.md'), '---\nstage: decided\ndecision: build\n---\n');
  }
  const mo = chayCli(kho, ['mo', 'thu', '--phien', 's-gs'], { gocGoi });
  assert.equal(mo.ma, 0, mo.err);
  assert.equal(chayCli(kho, ['pha', 'dang-chay', '--boi', 't', '--ly-do', 'thu'], { gocGoi }).ma, 0);
  const dot = fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  const k = { kho, cha, dot, w1: fs.realpathSync(w1), w2: fs.realpathSync(w2), remote };
  if (remote) {
    const bare = path.join(tam('ds-remote-'), 'r.git');
    execFileSync('git', ['init', '-q', '--bare', bare], { env: ENV });
    execFileSync('git', ['remote', 'add', 'origin', bare], { cwd: kho, env: ENV });
    k.bare = bare;
  }
  return k;
}
const day = (w, nh) => git(w, 'push', '-q', '-u', 'origin', nh);
function hoSoThu(w, slug, status) {
  const d = path.join(w, '_acceptance', slug);
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'contract.md'), `---\nstatus: ${status}\n---\n`);
  git(w, 'add', '-A');
  git(w, 'commit', '-q', '-m', `ho so ${slug} ${status}`);
}
function giuS4(dot, id, w, nhipMs) {
  ghiJ(path.join(dot, 'khoa', 's4', 'chu.json'), { phien: id, slug: 'hang-b', loai: 's4', worktree: w, cap_luc: ISO(T - 30 * PHUT), han_thue_den: ISO(T + 90 * PHUT) });
  const p = path.join(dot, 'khoa', 's4', 'nhip');
  fs.writeFileSync(p, ISO(nhipMs));
  fs.utimesSync(p, new Date(nhipMs), new Date(nhipMs));
}
function chayHook(suKien, dauVao, { cwd, nowMs, gocGoi = GOI }) {
  const hj = docJ(path.join(gocGoi, 'hooks', 'hooks.json'));
  const lenh = hj.hooks[suKien][0].hooks[0].command.split('${CLAUDE_PLUGIN_ROOT}').join(gocGoi);
  return spawnSync('sh', ['-c', lenh], { cwd, env: { ...ENV, ...envGio(nowMs) }, input: JSON.stringify({ cwd, hook_event_name: suKien, ...dauVao }), encoding: 'utf8' });
}
const ioGia = (nowMs) => ({
  nowMs: () => nowMs,
  chay: (cmd, args = []) => {
    if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 0.00M  free = 1.00M';
    if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
    if (cmd === 'sysctl') return '{ 1.00 1.00 1.00 }';
    if (cmd === 'ps') return '102400 node\n';
    if (cmd === 'gh') return '[]';
    if (cmd === 'git' && args[0] === 'show') throw new Error('khong co');
    return '';
  },
});
async function motNhip(dot, nowMs, gocGoi = GOI) {
  const { taoVong } = await nap(gocGoi, 'phat-lich.mjs');
  await taoVong(dot, ioGia(nowMs), () => nowMs)();
}
function docB(kho, p5, gio, gocGoi = GOI) {
  const du = { windows: [{ label: '5-hour limit', percentUsed: p5, resetsAt: ISO(T + 180 * PHUT) }, { label: 'Weekly · all models', percentUsed: 10, resetsAt: ISO(T + 3000 * PHUT) }] };
  const r = chayCli(kho, ['han-muc', '--nguon', 'get-usage', '--phien', 'B', '--doc', JSON.stringify(du)], { gocGoi, env: envGio(gio) });
  assert.equal(r.ma, 0, r.err);
}
const suKien = (dot) => (fs.existsSync(path.join(dot, 'su-kien.jsonl')) ? fs.readFileSync(path.join(dot, 'su-kien.jsonl'), 'utf8').split('\n').filter(Boolean).map((d) => JSON.parse(d)) : []);
const tinBanGiaoDung = (dot) => suKien(dot).filter((e) => e.loai === 'ban-giao-dung').at(-1)?.tin ?? '';

// Đợt đã bàn giao: P1 có một commit hồ sơ, báo xong; P2 báo xong (`p2: 'xong'` → pha cho-tiep-tuc) hoặc giữ khoá s4 sống
// (`p2: 's4'` → pha giữ dang-ban-giao, bản mở vẫn dựng). `truoc(k)` chạy ngay trước khi vào bàn giao. B đọc mức dùng 30 %.
async function dotDoiSoat({ gocGoi = GOI, remote = true, p2 = 'xong', truoc = null, banMo = true } = {}) {
  process.env.DIEU_PHOI_MAY_DIR = tam('ds-may-');
  const k = khoLienKet({ gocGoi, remote });
  hoSoThu(k.w1, 'hang-a', 'approved');
  git(k.w1, 'commit', '-q', '--allow-empty', '-m', 'buoc');
  hoSoThu(k.w2, 'hang-b', 'implemented');
  if (remote) {
    day(k.w1, 'p1');
    day(k.w2, 'p2');
  }
  chayHook('PostToolUse', { session_id: 's-cu' }, { cwd: k.w1, nowMs: T + 30_000, gocGoi });
  if (truoc) truoc(k);
  assert.equal(chayCli(k.kho, ['ban-giao', '--ly-do', 'thu'], { gocGoi, env: envGio(T) }).ma, 0);
  k.r1 = chayCli(k.w1, ['ban-giao-xong'], { gocGoi, env: envGio(T + PHUT) });
  assert.equal(k.r1.ma, 0, k.r1.err);
  if (!banMo) {
    docB(k.kho, 30, T + 6 * PHUT, gocGoi);
    return k;
  }
  if (p2 === 'xong') assert.equal(chayCli(k.w2, ['ban-giao-xong'], { gocGoi, env: envGio(T + PHUT) }).ma, 0);
  else giuS4(k.dot, 'P2', k.w2, T + 4 * PHUT);
  await motNhip(k.dot, T + 5 * PHUT, gocGoi);
  assert.ok(fs.existsSync(path.join(k.dot, 'ban-giao.json')), 'fixture: bản mở đã dựng');
  docB(k.kho, 30, T + 6 * PHUT, gocGoi);
  return k;
}
function tiepTucB(k, { gocGoi = GOI, gio = T + 7 * PHUT, them = [] } = {}) {
  const r = chayCli(k.kho, ['tiep-tuc', '--phien', 'B', '--json', ...them], { gocGoi, env: envGio(gio) });
  chayCli(k.kho, ['dung'], { gocGoi });
  let kq = null;
  try {
    kq = JSON.parse(r.out);
  } catch {
    kq = null;
  }
  return { ...r, kq };
}
const saoGoi = (tep, tu, sang) => {
  const sao = path.join(tam('ds-goi-'), 'dispatch');
  fs.cpSync(GOI, sao, { recursive: true });
  const p = path.join(sao, tep);
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.split(tu).join(sang);
  assert.notEqual(tiem, goc, `bước tiêm không áp được: ${tep}`);
  fs.writeFileSync(p, tiem);
  return sao;
};
const memo = new Map();
const nho = async (khoa, f) => {
  if (!memo.has(khoa)) memo.set(khoa, await f());
  return memo.get(khoa);
};

// ---------- DS-01: khứ hồi viết-rồi-đọc (AC-1, E1) ----------
async function doKhuHoi(gocGoi = GOI) {
  const k = await dotDoiSoat({ gocGoi });
  const bg = docJ(path.join(k.dot, 'ban-giao.json'));
  const { kiemKhuon } = await nap(gocGoi, 'doi-soat.mjs');
  const loi = [...kiemKhuon(bg), ...kiemKhuon(docJ(path.join(gocGoi, 'scripts', 'mau', 'ban-giao.json'))).map((l) => `khuôn: ${l}`)];
  const { ma, kq, err } = tiepTucB(k, { gocGoi });
  const ds = kq?.doi_soat;
  if (ma !== 0 || !ds) loi.push(`tiep-tuc không trả doi_soat (mã ${ma}) ${err.trim().slice(0, 160)}`);
  else {
    if (ds.khop !== true || ds.lech.length || ds.chua_day.length || ds.co_vang.length) loi.push(`không khớp: ${JSON.stringify({ lech: ds.lech, chua_day: ds.chua_day, co_vang: ds.co_vang })}`);
    if (ds.dong.length !== 1 || !ds.dong[0].includes(bg.ma) || !ds.dong[0].includes('2 dãy khớp')) loi.push(`dòng khớp sai: ${JSON.stringify(ds.dong)}`);
  }
  return { loi, dong: ds?.dong ?? [] };
}
test('DS-01 khu-hoi', async () => {
  const { loi, dong } = await nho(`khu-hoi:${GOI}`, () => doKhuHoi());
  console.log(`  ${dong.join('\n  ')}`);
  assert.deepEqual(loi, []);
});
test('DS-01-do doi-ten-truong', async () => {
  const sao = saoGoi('scripts/muc-day.mjs', '    dinh,\n', '    dinh_x: dinh,\n');
  const { loi } = await doKhuHoi(sao);
  console.log(`  bản tiêm: ${loi.join(' | ')}`);
  assert.ok(loi.some((l) => l === 'thiếu trường dinh'), loi.join(' | '));
});
test('DS-01-do truong-moi', async () => {
  const sao = saoGoi('scripts/muc-day.mjs', '    dinh,\n', '    dinh,\n    thu_moi: null,\n');
  const pk = path.join(sao, 'scripts', 'mau', 'ban-giao.json');
  const khuon = docJ(pk);
  khuon.day[0].thu_moi = null;
  ghiJ(pk, khuon);
  const { loi } = await doKhuHoi(sao);
  console.log(`  bản tiêm: ${loi.join(' | ')}`);
  assert.ok(loi.some((l) => l === 'trường thu_moi không có bên đọc'), loi.join(' | '));
});

// ---------- DS-02: ma trận lệch viết trước (AC-2, E2) ----------
const MA_TRAN = [
  ['a', 'P1 thêm một commit rồi đẩy', (k) => { git(k.w1, 'commit', '-q', '--allow-empty', '-m', 'tien'); day(k.w1, 'p1'); }, ['P1 dinh'], 'tiến 1 commit'],
  ['b', 'P1 đổi sang nhánh khác cùng đỉnh, đã đẩy', (k) => { git(k.w1, 'checkout', '-q', '-b', 'p1-b'); day(k.w1, 'p1-b'); }, ['P1 nhanh'], 'p1-b'],
  ['c', 'P1 lùi một commit', (k) => git(k.w1, 'reset', '-q', '--hard', 'HEAD~1'), ['P1 dinh'], 'lùi'],
  ['d', 'P1 có tệp chưa commit', (k) => fs.writeFileSync(path.join(k.w1, 'nhap.txt'), 'x\n'), ['P1 cay'], 'chưa commit'],
  ['e', 'hồ sơ của P2 đổi status bằng một commit đã đẩy', (k) => { hoSoThu(k.w2, 'hang-b', 'verified'); day(k.w2, 'p2'); }, ['P2 dinh', 'P2 ho-so'], 'verified'],
  ['f', 'khoá s4 P2 đang giữ được nhả', (k) => fs.rmSync(path.join(k.dot, 'khoa', 's4'), { recursive: true, force: true }), ['- khoa'], 'khoá'],
  ['g', 'thêm đơn xin/P1-s4.json', (k) => ghiJ(path.join(k.dot, 'xin', 'P1-s4.json'), { loai: 's4', phien: 'P1', luc: ISO(T + 6 * PHUT) }), ['- don'], 'P1-s4.json'],
  ['h', 'nhánh chính tiến hai commit', (k) => { git(k.kho, 'commit', '-q', '--allow-empty', '-m', 'm1'); git(k.kho, 'commit', '-q', '--allow-empty', '-m', 'm2'); }, ['- nhanh-chinh'], 'dời 2 commit'],
  ['i', 'worktree P2 bị gỡ', (k) => git(k.kho, 'worktree', 'remove', '--force', k.w2), ['P2 worktree'], 'không còn'],
  ['j', 'thêm dãy P3 vào đợt', (k) => {
    const w3 = path.join(k.cha, 'p3');
    git(k.kho, 'worktree', 'add', '-q', '-b', 'p3', w3);
    day(w3, 'p3');
    const p = path.join(k.dot, 'hang-viec.json');
    const hv = docJ(p);
    ghiJ(p, { ...hv, day: [...hv.day, { id: 'P3', worktree: fs.realpathSync(w3) }] });
  }, ['P3 day'], 'thêm'],
  ['k', 'P1 viết lại commit đỉnh rồi đẩy cưỡng bức', (k) => { git(k.w1, 'commit', '-q', '--amend', '--allow-empty', '-m', 'sua'); git(k.w1, 'push', '-q', '-f', 'origin', 'p1'); }, ['P1 dinh'], 'khác lịch sử'],
  ['l', 'gỡ dãy P2 khỏi đợt', (k) => {
    const p = path.join(k.dot, 'hang-viec.json');
    const hv = docJ(p);
    ghiJ(p, { ...hv, day: hv.day.filter((d) => d.id !== 'P2'), hang: hv.hang.filter((h) => h.day !== 'P2') });
  }, ['P2 day'], 'không còn'],
];
async function chayHangLech([nhan, , pha, mongDoi, chu], gocGoi = GOI) {
  const k = await dotDoiSoat({ gocGoi, p2: 's4' });
  pha(k);
  const { ma, kq, err } = tiepTucB(k, { gocGoi });
  const ds = kq?.doi_soat;
  if (ma !== 0 || !ds) return { nhan, ok: false, chi: `mã ${ma} · ${err.trim().slice(0, 160)}`, dong: [] };
  const co = ds.lech.map((x) => `${x.day ?? '-'} ${x.chieu}`).sort();
  const ok = ds.khop === false && JSON.stringify(co) === JSON.stringify([...mongDoi].sort()) && ds.chua_day.length === 0
    && ds.dong.length === 1 + ds.lech.length && ds.dong.slice(1).some((d) => d.includes(chu));
  return { nhan, ok, chi: `lệch ${JSON.stringify(co)} · chưa đẩy ${JSON.stringify(ds.chua_day)} · ${ds.dong.length} dòng`, dong: ds.dong };
}
async function doMaTran(gocGoi = GOI, chi = null) {
  const kq = [];
  for (const h of MA_TRAN) if (!chi || chi.includes(h[0])) kq.push(await chayHangLech(h, gocGoi));
  return kq;
}
test('DS-02 ma-tran', async () => {
  const kq = await nho(`ma-tran:${GOI}`, () => doMaTran());
  console.log(kq.map((x) => `  (${x.nhan}) · ${x.ok ? 'đúng' : 'SAI'} · ${x.chi}`).join('\n'));
  const soHang = MA_TRAN.length;
  assert.equal(soHang, 12, 'ma trận viết sẵn có mười hai hàng');
  assert.equal(kq.filter((x) => x.ok).length, soHang, `hàng sai: ${kq.filter((x) => !x.ok).map((x) => x.nhan).join(', ')}`);
});
test('DS-02-do bo-chieu-dinh', async () => {
  const sao = saoGoi('scripts/doi-soat.mjs', "      soDinh(lech, id, truoc, sau, d.worktree);\n", '');
  const kq = await doMaTran(sao, ['a', 'c', 'k']);
  const sai = kq.filter((x) => !x.ok).map((x) => x.nhan);
  console.log(`  bản tiêm: hàng sai ${sai.join(', ')}`);
  assert.deepEqual(sai, ['a', 'c', 'k']);
});

// ---------- DS-04: dãy chưa đẩy nhánh lộ ra (AC-4, E4) ----------
const HANG_CHUA_DAY = [
  ['a', 'P1 commit thêm sau lần đẩy cuối', (k) => git(k.w1, 'commit', '-q', '--allow-empty', '-m', 'chua-day'), 'p1'],
  ['b', 'P1 ở nhánh mới chưa từng đẩy', (k) => git(k.w1, 'checkout', '-q', '-b', 'p1-moi'), 'p1-moi'],
];
async function doChuaDay(gocGoi = GOI) {
  const loi = [];
  const dong = {};
  for (const [nhan, , truoc, nhanh] of HANG_CHUA_DAY) {
    const k = await dotDoiSoat({ gocGoi, truoc });
    if (!k.r1.out.includes(`CHƯA ĐẨY nhánh ${nhanh}`)) loi.push(`(${nhan}) ban-giao-xong không nêu CHƯA ĐẨY ${nhanh} cho P1: ${k.r1.out.trim()}`);
    const tin = tinBanGiaoDung(k.dot);
    if (!/CHƯA ĐẨY[^.]*P1/.test(tin) || /CHƯA ĐẨY[^.]*P2/.test(tin)) loi.push(`(${nhan}) câu báo trước khi đổi tài khoản không nêu đúng P1: ${tin}`);
    const { kq } = tiepTucB(k, { gocGoi });
    const ds = kq?.doi_soat;
    if (!ds || JSON.stringify(ds.chua_day) !== '["P1"]' || ds.lech.length) loi.push(`(${nhan}) doi_soat P1 chưa đẩy sai: ${JSON.stringify(ds && { chua_day: ds.chua_day, lech: ds.lech })}`);
    else if (!ds.dong.some((d) => d.includes('CHƯA ĐẨY') && d.includes('P1'))) loi.push(`(${nhan}) không có dòng CHƯA ĐẨY của P1`);
    dong[nhan] = ds?.dong ?? [];
  }
  return { loi, dong };
}
async function doKhongRemote(gocGoi = GOI) {
  const k = await dotDoiSoat({ gocGoi, remote: false, truoc: (x) => git(x.w1, 'commit', '-q', '--allow-empty', '-m', 'cuc-bo') });
  const tin = tinBanGiaoDung(k.dot);
  const { kq } = tiepTucB(k, { gocGoi });
  const loi = [];
  const coChu = (s) => /chưa đẩy/i.test(s);
  if (coChu(k.r1.out) || coChu(tin) || coChu(JSON.stringify(kq?.doi_soat ?? {}))) loi.push('CHƯA ĐẨY ở kho không remote');
  if (!tin.endsWith('--json).')) loi.push(`câu báo không giữ đuôi cũ: …${tin.slice(-60)}`);
  return loi;
}
test('DS-04 chua-day', async () => {
  const { loi, dong } = await nho(`chua-day:${GOI}`, () => doChuaDay());
  console.log(`  ${dong.a.join('\n  ')}`);
  assert.deepEqual(loi, []);
});
test('DS-04 khong-remote', async () => {
  assert.deepEqual(await doKhongRemote(), []);
});
test('DS-04-do bo-dieu-kien-remote', async () => {
  const sao = saoGoi('scripts/muc-day.mjs', "  if (!git(worktree, 'remote')) return false;\n", '');
  const loi = await doKhongRemote(sao);
  console.log(`  bản tiêm: ${loi.join(' | ')}`);
  assert.ok(loi.includes('CHƯA ĐẨY ở kho không remote'), loi.join(' | '));
});
test('DS-04-do khong-upstream', async () => {
  const sao = saoGoi('scripts/muc-day.mjs', '  if (!u) return true;\n', '  if (!u) return false;\n');
  const { loi } = await doChuaDay(sao);
  console.log(`  bản tiêm: ${loi.join(' | ')}`);
  assert.ok(loi.some((l) => l.startsWith('(b)') && l.includes('P1')), loi.join(' | '));
  assert.ok(!loi.some((l) => l.startsWith('(a)')), `hàng (a) không được đỏ: ${loi.join(' | ')}`);
});

// ---------- DS-05: khuyên chờ không mở chip (AC-5, E5) ----------
async function doKhuyenCho(gocGoi = GOI) {
  const loi = [];
  const k = await dotDoiSoat({ gocGoi });
  docB(k.kho, 85, T + 6.5 * PHUT, gocGoi);
  const { kq } = tiepTucB(k, { gocGoi });
  const chuoi = JSON.stringify(kq ?? {});
  const pha = docJ(path.join(k.dot, 'dieu-khien.json')).pha;
  if (!kq?.khuyen_cho) loi.push('không có khuyen_cho');
  else if (!Array.isArray(kq.ke_hoach) || kq.ke_hoach.length || chuoi.includes('mo-chip') || chuoi.includes('ghi_danh')) {
    loi.push(`khuyen_cho mà còn mo-chip: ${(kq.ke_hoach ?? []).filter((x) => x.hanh_dong === 'mo-chip').map((x) => x.day).join(', ')}`);
  }
  if (pha !== 'cho-tiep-tuc') loi.push(`pha ${pha}`);
  if (!kq?.doi_soat) loi.push('khuyen_cho mà không có doi_soat');
  return loi;
}
test('DS-05 khuyen-cho', async () => {
  const k = await dotDoiSoat();
  const { kq } = tiepTucB(k);
  const p1 = kq?.ke_hoach?.find((x) => x.day === 'P1');
  console.log(`  đối chứng dương (B 30 %): P1 ${p1?.hanh_dong}`);
  assert.equal(p1?.hanh_dong, 'mo-chip');
  assert.ok(p1.ghi_danh, 'mo-chip phải kèm ghi_danh');
  assert.deepEqual(await doKhuyenCho(), []);
});
test('DS-05-do bo-chan', async () => {
  const sao = saoGoi('scripts/tiep-tuc.mjs', "  if (roi.khuyen_cho) keHoach = [];\n", '');
  const loi = await doKhuyenCho(sao);
  console.log(`  bản tiêm: ${loi.join(' | ')}`);
  assert.ok(loi.includes('khuyen_cho mà còn mo-chip: P1, P2') || loi.some((l) => l.startsWith('khuyen_cho mà còn mo-chip: P1')), loi.join(' | '));
});

// ---------- DS-06: thân lệnh và README (AC-6, E6) ----------
export function kiemResumeDoiSoat(gocGoi = GOI) {
  const loi = [];
  const t = fs.readFileSync(path.join(gocGoi, 'commands', 'resume.md'), 'utf8');
  const body = t.slice(Math.max(0, t.indexOf('\nCác bước')));
  const iB2 = body.indexOf('2. **Phiên đã thôi vai.**');
  const iB4 = body.indexOf('4. **Mỗi dãy theo `ke_hoach`**');
  const dongDs = body.split('\n').find((d) => d.trimStart().startsWith('- `doi_soat`:')) ?? '';
  const iDs = body.indexOf('- `doi_soat`:');
  if (!dongDs || iDs < iB2 || iDs > iB4 || !body.slice(iDs, iB4).includes('nguyên văn')) loi.push('resume.md: bước 2 thiếu dòng doi_soat (nói lại nguyên văn từng dòng, trước bước mở chip)');
  const iKc = body.indexOf('- `khuyen_cho`:');
  const khoiKc = iKc < 0 ? '' : body.slice(iKc, body.indexOf('\n   - ', iKc + 5) > 0 ? body.indexOf('\n   - ', iKc + 5) : iB4);
  if (!khoiKc.includes('DỪNG') || khoiKc.includes('đi tiếp bước 3')) loi.push('resume.md: dòng khuyen_cho phải DỪNG, không «đi tiếp bước 3»');
  const r = fs.readFileSync(path.join(gocGoi, 'README.md'), 'utf8');
  const muc = /## Đổi tài khoản[\s\S]*?(?=\n## |$)/.exec(r)?.[0] ?? '';
  for (const [chu, ten] of [['đối soát', 'đối soát'], ['CHƯA ĐẨY', 'CHƯA ĐẨY'], ['khuyên chờ', 'dừng khi khuyên chờ']]) if (!muc.includes(chu)) loi.push(`README: mục «Đổi tài khoản» thiếu ${ten}`);
  return loi;
}
const saoGoiSua = (tep, sua) => {
  const sao = path.join(tam('ds-goi-'), 'dispatch');
  fs.cpSync(GOI, sao, { recursive: true });
  const p = path.join(sao, tep);
  const goc = fs.readFileSync(p, 'utf8');
  const moi = sua(goc);
  assert.notEqual(moi, goc, `bước tiêm không áp được: ${tep}`);
  fs.writeFileSync(p, moi);
  return sao;
};
test('DS-06 than-lenh', () => {
  assert.deepEqual(kiemResumeDoiSoat(saoGoiSua('README.md', (t) => `${t}\n`)), [], 'đối chứng dương: bản sao không sửa thân lệnh');
  assert.deepEqual(kiemResumeDoiSoat(), []);
});
test('DS-06-do tra-cau-cu', () => {
  const sao = saoGoiSua('commands/resume.md', (t) => t.replace(/(- `khuyen_cho`:[^\n]*(?:\n {5}[^\n]*)*)/, (m) => `${m.replace(/DỪNG[^\n]*/g, '')}\n     Không chuyển gì thêm; đi tiếp bước 3.`));
  const loi = kiemResumeDoiSoat(sao);
  console.log(`  bản tiêm: ${loi.join(' | ')}`);
  assert.ok(loi.some((l) => l.includes('khuyen_cho')), loi.join(' | '));
});
test('DS-06-do go-doi-soat', () => {
  const sao = saoGoiSua('commands/resume.md', (t) => t.replace(/ {3}- `doi_soat`:[^\n]*(?:\n {5}[^\n]*)*\n/, ''));
  const loi = kiemResumeDoiSoat(sao);
  console.log(`  bản tiêm: ${loi.join(' | ')}`);
  assert.ok(loi.some((l) => l.includes('doi_soat')), loi.join(' | '));
});

// ---------- DS-07: lúc nào có đối soát (AC-7, E7) ----------
let banGoc = null;
function goiGocVong() {
  if (banGoc) return banGoc;
  let base = null;
  for (const n of ['origin/main', 'main']) {
    const r = spawnSync('git', ['merge-base', 'HEAD', n], { cwd: KIT, env: ENV, encoding: 'utf8' });
    if (r.status === 0) { base = r.stdout.trim(); break; }
  }
  assert.ok(base, 'không tìm được gốc vòng');
  const tm = pathspec('dieu-phoi', { kho: KIT, ref: base });
  const d = tam('ds-base-');
  execFileSync('tar', ['-x', '-C', d], { input: execFileSync('git', ['archive', base, tm], { cwd: KIT, env: ENV, maxBuffer: 1 << 28 }) });
  banGoc = path.join(d, tm);
  return banGoc;
}
const nhan = (s, k) => s.split(k.kho).join('<kho>').split(k.cha).join('<wt>');
async function doHienDien(gocGoi = GOI) {
  const loi = [];
  const dong = {};
  // (a) đợt chưa từng bàn giao — vi phân với bản gốc vòng trên hai kho thử dựng y hệt.
  const ra = [];
  for (const g of [gocGoi, goiGocVong()]) {
    process.env.DIEU_PHOI_MAY_DIR = tam('ds-may-');
    const k = khoLienKet({ gocGoi });
    docB(k.kho, 30, T + 6 * PHUT, gocGoi);
    const kq = (await nap(g, 'tiep-tuc.mjs')).tiepTuc(k.kho, { phien: 'B', nowMs: T + 7 * PHUT, chay: null });
    ra.push(nhan(JSON.stringify(kq), k));
  }
  if (JSON.parse(ra[0]).doi_soat !== undefined) loi.push('(a) đợt chưa từng bàn giao mà có doi_soat');
  if (ra[0] !== ra[1]) loi.push(`(a) kết quả khác bản gốc vòng: ${ra[0].slice(0, 200)} ≠ ${ra[1].slice(0, 200)}`);
  // (b) đã nối lại từ trước.
  const kb = await dotDoiSoat({ gocGoi });
  tiepTucB(kb, { gocGoi });
  const b = tiepTucB(kb, { gocGoi, gio: T + 9 * PHUT }).kq;
  if (b?.doi_soat !== undefined) loi.push('(b) đối soát lại bản đã nối lại');
  // (c) dạng --nhe trong pha bàn giao có bản mở.
  const kc = await dotDoiSoat({ gocGoi });
  const c = chayCli(kc.kho, ['tiep-tuc', '--phien', 's-gs', '--nhe', '--json'], { gocGoi, env: envGio(T + 7 * PHUT) });
  chayCli(kc.kho, ['dung'], { gocGoi });
  if (c.ma !== 0 || JSON.parse(c.out).doi_soat !== undefined) loi.push(`(c) --nhe mà có doi_soat (mã ${c.ma})`);
  // (d) phiên chưa đọc mức dùng.
  const kd = await dotDoiSoat({ gocGoi });
  const d = chayCli(kd.kho, ['tiep-tuc', '--phien', 'C', '--json'], { gocGoi, env: envGio(T + 7 * PHUT) });
  chayCli(kd.kho, ['dung'], { gocGoi });
  const dj = JSON.parse(d.out || '{}');
  if (dj.can_doc_han_muc !== true || dj.doi_soat !== undefined) loi.push('(d) chưa đọc mức dùng mà có doi_soat');
  // (e) rời cưỡng bức khi chưa có bản mở.
  const ke = await dotDoiSoat({ gocGoi, banMo: false });
  if (fs.existsSync(path.join(ke.dot, 'ban-giao.json'))) loi.push('(e) fixture: đã có bản mở');
  const e = tiepTucB(ke, { gocGoi }).kq?.doi_soat;
  if (!e || e.khong_ban_truoc !== true || e.lech.length || e.dong.length !== 1) loi.push(`(e) không đúng: ${JSON.stringify(e)}`);
  dong.e = e?.dong ?? [];
  return { loi, dong };
}
test('DS-07 hien-dien', async () => {
  const { loi, dong } = await nho(`hien-dien:${GOI}`, () => doHienDien());
  console.log(`  (e) ${dong.e.join(' | ')}`);
  assert.deepEqual(loi, []);
});
test('DS-07-do doc-lich-su', async () => {
  const sao = saoGoiSua('scripts/tiep-tuc.mjs', (t) => t
    .replace('const bgMo = PHA_SAO.includes(phaDau) ? docBanGiaoMo(thuMuc) : null;', 'const bgMo = banGiaoGanNhat(thuMuc);')
    .replace('doiSoat && PHA_SAO.includes(phaDau) && !roi.can_doc_han_muc', 'doiSoat && (bgMo || PHA_SAO.includes(phaDau)) && !roi.can_doc_han_muc'));
  const { loi } = await doHienDien(sao);
  console.log(`  bản tiêm: ${loi.join(' | ')}`);
  assert.ok(loi.includes('(b) đối soát lại bản đã nối lại'), loi.join(' | '));
});

// ---------- DS-08: bản bàn giao cũ thiếu trường (AC-8, E8) ----------
const HANG_THIEU = [
  ['sha_nhanh_chinh', 'goc', 'nhanh-chinh'],
  ['khoa', 'goc', 'khoa'],
  ['don', 'goc', 'don'],
  ['cay_ban', 'day', 'cay'],
  ['nhanh', 'day', 'nhanh'],
];
async function doThieuTruong(gocGoi = GOI, chi = null) {
  const kq = [];
  for (const [truong, cho, chieu] of HANG_THIEU) {
    if (chi && !chi.includes(truong)) continue;
    const k = await dotDoiSoat({ gocGoi });
    const p = path.join(k.dot, 'ban-giao.json');
    const bg = docJ(p);
    if (cho === 'goc') delete bg[truong];
    else for (const m of bg.day) delete m[truong];
    ghiJ(p, bg);
    git(k.w1, 'commit', '-q', '--allow-empty', '-m', 'lech-that');
    day(k.w1, 'p1');
    const { ma, kq: r } = tiepTucB(k, { gocGoi });
    const ds = r?.doi_soat;
    const loi = [];
    if (ma !== 0 || !ds) loi.push(`mã ${ma}, không có doi_soat`);
    else {
      if (!ds.co_vang.includes(truong)) loi.push(`co_vang không nêu ${truong}`);
      if (ds.lech.some((x) => x.chieu === chieu)) loi.push(`báo lệch giả ở chiều ${chieu}`);
      if (!ds.lech.some((x) => x.day === 'P1' && x.chieu === 'dinh')) loi.push('mất lệch thật ở chiều dinh');
      if (!ds.dong.some((d) => d.includes(`«${truong}»`) && d.includes('không so được'))) loi.push('không có dòng vàng');
    }
    kq.push({ truong, loi, dong: ds?.dong ?? [] });
  }
  return kq;
}
test('DS-08 thieu-truong', async () => {
  const kq = await nho(`thieu:${GOI}`, () => doThieuTruong());
  console.log(kq.map((x) => `  ${x.truong} · ${x.loi.length ? x.loi.join('; ') : 'đúng'}`).join('\n'));
  assert.equal(kq.length, HANG_THIEU.length);
  assert.equal(kq.filter((x) => !x.loi.length).length, 5);
});
test('DS-08-do bo-do-truong', async () => {
  const sao = saoGoi('scripts/doi-soat.mjs', '  const thieu = truongThieu(bg);\n', '  const thieu = { goc: [], day: [] };\n');
  const [x] = await doThieuTruong(sao, ['sha_nhanh_chinh']);
  console.log(`  bản tiêm: ${x.loi.join(' | ')}`);
  assert.ok(x.loi.includes('không có dòng vàng'), x.loi.join(' | '));
});

// ---------- DS-03: mẫu chữ cho người, sinh từ mọi lớp dòng (AC-3, E3a) ----------
async function sinhMau() {
  const khop = await nho(`khu-hoi:${GOI}`, () => doKhuHoi());
  const lech = await nho(`ma-tran:${GOI}`, () => doMaTran());
  const cd = await nho(`chua-day:${GOI}`, () => doChuaDay());
  const vang = await nho(`thieu:${GOI}`, () => doThieuTruong());
  const hd = await nho(`hien-dien:${GOI}`, () => doHienDien());
  const khoi = (tieuDe, dong) => `## ${tieuDe}\n\n\`\`\`text\n${dong.join('\n')}\n\`\`\`\n`;
  const phan = [
    '# Mẫu chữ đối soát bàn giao — do mã sinh\n\nSinh bởi ca DS-03 của `tests/dieu-phoi/doi-soat-ban-giao.test.mjs` (`DS_GHI_MAU=1` để ghi lại). Mỗi mục là\ntoàn bộ các dòng `doi_soat.dong` mà lệnh nối lại in ra trong đúng tình huống ở tiêu đề. Đừng sửa tay.\n',
    khoi('Khớp hết — không gì đổi sau bàn giao', khop.dong),
    ...MA_TRAN.map(([n, mo], i) => khoi(`Lệch (${n}) — ${mo}`, lech[i].dong)),
    ...HANG_CHUA_DAY.map(([n, mo]) => khoi(`Chưa đẩy (${n}) — ${mo}`, cd.dong[n])),
    ...vang.map((x) => khoi(`Bản bàn giao cũ thiếu trường ${x.truong} (kèm P1 thêm một commit)`, x.dong)),
    khoi('Không có bản bàn giao mở trước lúc nối lại', hd.dong.e),
  ];
  return phan.join('\n');
}
export function soMau(sinh, tep) {
  if (!fs.existsSync(tep)) return ['mau-dong.md chưa có — chạy DS_GHI_MAU=1'];
  return fs.readFileSync(tep, 'utf8') === sinh ? [] : ['mau-dong.md lệch bản sinh lại'];
}
test('DS-03 mau-dong', async () => {
  const sinh = await nho('mau', sinhMau);
  if (process.env.DS_GHI_MAU === '1') fs.writeFileSync(TEP_MAU, sinh);
  for (const lop of ['## Khớp hết', '## Lệch (l)', '## Chưa đẩy (b)', 'thiếu trường nhanh', '## Không có bản bàn giao']) assert.ok(sinh.includes(lop), `thiếu lớp ${lop}`);
  assert.ok(!/```text\n\n```/.test(sinh) && !/```text\n```/.test(sinh), 'có mục rỗng');
  assert.deepEqual(soMau(sinh, TEP_MAU), []);
});
test('DS-03-do tep-cu', async () => {
  const sinh = await nho('mau', sinhMau);
  const d = tam('ds-mau-');
  const p = path.join(d, 'mau-dong.md');
  fs.writeFileSync(p, sinh);
  assert.deepEqual(soMau(sinh, p), [], 'đối chứng dương');
  fs.writeFileSync(p, sinh.replace('đối soát', 'đối xoát'));
  assert.notEqual(fs.readFileSync(p, 'utf8'), sinh, 'bước tiêm không áp được');
  assert.deepEqual(soMau(sinh, p), ['mau-dong.md lệch bản sinh lại']);
});
