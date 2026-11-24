// Đối soát bàn giao (hồ sơ doi-soat-ban-giao). Bên đọc của `ban-giao.json`: so bản đang mở với hiện trạng từng dãy lúc
// nối lại, TRƯỚC khi lệnh nối lại rời bàn giao. Hiện trạng dựng bằng CHÍNH các hàm của bên viết (`mucDay`,
// `shaNhanhChinh`, `khoaHienTai`, `donHienTai`) — bên đọc không có cách đọc git hay thư mục đợt thứ hai. Chỉ đọc, không ghi.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { khoaHienTai, donHienTai, shaNhanhChinh } from './ban-giao.mjs';
import { docCauHinh, docHangViec } from './hinh-dang.mjs';
import { chuaDay, mucDay } from './muc-day.mjs';

// Trường bên đọc so (TRUONG_DOC) và trường không so kèm lý do (BO_QUA). Hợp hai danh sách phải bằng đúng tập khoá bên viết
// ghi — ca khứ hồi DS-01 đo cả hai chiều trên tệp bên viết sinh và trên khuôn `mau/ban-giao.json`.
// <<<BAN-GIAO-TRUONG-DOC
export const TRUONG_DOC = {
  goc: ['ma', 'sha_nhanh_chinh', 'day', 'khoa', 'don'],
  day: ['id', 'slug', 'trang_thai_ho_so', 'nhanh', 'dinh', 'cay_ban'],
};
export const BO_QUA = {
  goc: {
    trang_thai: 'trạng thái của chính tệp (mo / da-tiep-tuc), không phải trạng thái đợt',
    dot: 'tên đợt không đổi giữa bàn giao và nối lại',
    luc: 'giờ dựng tệp — mốc, không phải trạng thái',
    vao_luc: 'giờ vào bàn giao — mốc, không phải trạng thái',
    ly_do: 'lý do bàn giao — chữ cho người, không có hiện trạng để so',
    boi: 'ai đặt bàn giao — không có hiện trạng để so',
  },
  day: {
    hang: 'mã hàng suy từ slug — so slug là đủ',
    da_day: 'trạng thái đẩy đo lại lúc nối lại thành cờ chua_day, không so trước với sau',
    co_wip: 'commit WIP đã nằm trong đỉnh — so đỉnh là đủ',
    ban_giao: 'trạng thái báo xong của dãy chỉ có nghĩa trong lúc bàn giao',
    cham_lai_cung_round: 'cờ cho lượt chấm của dãy, suy từ khoá s4 và hồ sơ — đã so hai thứ ấy',
    viec_cho_nguoi: 'việc chờ người đọc từ thư mục đợt mỗi lần, khung đợt đã đếm',
    phien_cu: 'mã phiên cũ chỉ dùng để loại nhịp, không phải trạng thái dãy',
  },
};
// BAN-GIAO-TRUONG-DOC>>>

const coKhoa = (o, k) => o != null && Object.prototype.hasOwnProperty.call(o, k);
const ngan = (s) => (typeof s === 'string' && /^[0-9a-f]{40}$/.test(s) ? s.slice(0, 7) : s ?? 'không có');

// Kiểm một bản bàn giao (hoặc khuôn) theo hai danh sách — mỗi lỗi một câu: «thiếu trường X» · «trường X không có bên đọc».
export function kiemKhuon(bg) {
  const loi = new Set();
  const xet = (o, cap) => {
    for (const k of TRUONG_DOC[cap]) if (!coKhoa(o, k)) loi.add(`thiếu trường ${k}`);
    for (const k of Object.keys(o ?? {})) if (!TRUONG_DOC[cap].includes(k) && !coKhoa(BO_QUA[cap], k)) loi.add(`trường ${k} không có bên đọc`);
  };
  xet(bg, 'goc');
  for (const m of Array.isArray(bg?.day) ? bg.day : []) xet(m, 'day');
  return [...loi];
}

// Trường của TRUONG_DOC vắng trong bản bàn giao (ghi bằng bản gói cũ). Trường dãy tính vắng khi vắng ở MỌI mục dãy.
function truongThieu(bg) {
  const goc = TRUONG_DOC.goc.filter((k) => !coKhoa(bg, k));
  const ds = Array.isArray(bg?.day) ? bg.day : [];
  const day = ds.length ? TRUONG_DOC.day.filter((k) => k !== 'id' && ds.every((m) => !coKhoa(m, k))) : [];
  return { goc, day };
}

const VANG = {
  sha_nhanh_chinh: 'không so được nhánh chính dời bao nhiêu commit',
  khoa: 'không so được khoá đang giữ',
  don: 'không so được đơn xin lượt',
  day: 'không so được dãy nào',
  ma: 'không biết mã bàn giao',
  slug: 'không so được hồ sơ của dãy',
  trang_thai_ho_so: 'không so được trạng thái hồ sơ của dãy',
  nhanh: 'không so được nhánh đang làm của dãy',
  dinh: 'không so được đỉnh của dãy',
  cay_ban: 'không so được cây làm việc có thay đổi chưa commit',
};

const git = (cwd, ...a) => spawnSync('git', a, { cwd, encoding: 'utf8' });
// Quan hệ giữa hai đỉnh, đọc trong `cwd`: tiến n · lùi n · khác lịch sử.
function quanHe(cwd, truoc, sau) {
  if (!truoc || !sau || git(cwd, 'cat-file', '-e', `${truoc}^{commit}`).status !== 0) return { loai: 'khac' };
  if (git(cwd, 'merge-base', '--is-ancestor', truoc, sau).status === 0) return { loai: 'tien', n: Number(git(cwd, 'rev-list', '--count', `${truoc}..${sau}`).stdout.trim()) };
  if (git(cwd, 'merge-base', '--is-ancestor', sau, truoc).status === 0) return { loai: 'lui', n: Number(git(cwd, 'rev-list', '--count', `${sau}..${truoc}`).stdout.trim()) };
  return { loai: 'khac' };
}

function soDinh(lech, id, truoc, sau, worktree) {
  if (truoc.dinh === sau.dinh) return;
  const q = quanHe(worktree, truoc.dinh, sau.dinh);
  const cu = `lúc bàn giao ${ngan(truoc.dinh)}, nay ${ngan(sau.dinh)}`;
  const cau = q.loai === 'tien' ? `dãy ${id}: đỉnh tiến ${q.n} commit sau bàn giao (${cu})`
    : q.loai === 'lui' ? `dãy ${id}: đỉnh lùi ${q.n} commit so với lúc bàn giao (${cu}) — commit sau đỉnh mới không còn trên nhánh này`
      : `dãy ${id}: đỉnh khác lịch sử với lúc bàn giao (${cu}) — nhánh đã bị viết lại`;
  lech.push({ day: id, chieu: 'dinh', truoc: truoc.dinh, sau: sau.dinh, cau });
}

// So bản bàn giao `bg` với hiện trạng. `hangViec`, `cfg` truyền vào để ca đo dùng chung bản đã đọc; vắng thì tự đọc.
export function doiSoatBanGiao(thuMuc, bg, { hangViec = null, cfg = null } = {}) {
  const hv = hangViec ?? docHangViec(thuMuc);
  let c = cfg;
  if (!c) {
    try {
      c = docCauHinh(thuMuc);
    } catch {
      c = {};
    }
  }
  const thieu = truongThieu(bg);
  const vangGoc = new Set(thieu.goc);
  const vangDay = new Set(thieu.day);
  const lech = [];
  const truocDs = Array.isArray(bg?.day) ? bg.day : [];
  const idTruoc = new Set(truocDs.map((m) => m.id));
  const idSau = new Set(hv.day.map((d) => d.id));
  let dayKhop = 0;
  if (!vangGoc.has('day')) {
    for (const m of truocDs) if (!idSau.has(m.id)) lech.push({ day: m.id, chieu: 'day', truoc: 'có', sau: 'không còn', cau: `dãy ${m.id}: có lúc bàn giao, nay không còn trong đợt` });
  }
  for (const d of hv.day) {
    const id = d.id;
    if (!vangGoc.has('day') && !idTruoc.has(id)) {
      lech.push({ day: id, chieu: 'day', truoc: 'không có', sau: 'có', cau: `dãy ${id}: mới thêm vào đợt sau bàn giao — không có bản ghi lúc bàn giao để so` });
      continue;
    }
    const truoc = truocDs.find((m) => m.id === id);
    if (!truoc) continue;
    const truocLech = lech.length;
    if (!fs.existsSync(d.worktree)) {
      if (truoc.nhanh != null || truoc.dinh != null) lech.push({ day: id, chieu: 'worktree', truoc: truoc.nhanh ?? null, sau: null, cau: `dãy ${id}: thư mục làm việc không còn (lúc bàn giao ở nhánh ${truoc.nhanh ?? '?'} @ ${ngan(truoc.dinh)})` });
      if (lech.length === truocLech) dayKhop += 1;
      continue;
    }
    const sau = mucDay(thuMuc, d, { hangViec: hv });
    if (!vangDay.has('nhanh') && truoc.nhanh !== sau.nhanh) lech.push({ day: id, chieu: 'nhanh', truoc: truoc.nhanh, sau: sau.nhanh, cau: `dãy ${id}: đang ở nhánh khác (lúc bàn giao ${truoc.nhanh ?? 'không có'}, nay ${sau.nhanh ?? 'không có'})` });
    if (!vangDay.has('dinh')) {
      soDinh(lech, id, truoc, sau, d.worktree);
    }
    if (!vangDay.has('cay_ban') && Boolean(truoc.cay_ban) !== Boolean(sau.cay_ban)) {
      lech.push({ day: id, chieu: 'cay', truoc: truoc.cay_ban, sau: sau.cay_ban, cau: sau.cay_ban ? `dãy ${id}: cây làm việc nay có thay đổi chưa commit (lúc bàn giao sạch)` : `dãy ${id}: cây làm việc nay sạch (lúc bàn giao có thay đổi chưa commit)` });
    }
    const hsTruoc = `${vangDay.has('slug') ? sau.slug : truoc.slug ?? 'không có'} ${vangDay.has('trang_thai_ho_so') ? sau.trang_thai_ho_so : truoc.trang_thai_ho_so ?? 'chưa có'}`;
    const hsSau = `${sau.slug ?? 'không có'} ${sau.trang_thai_ho_so ?? 'chưa có'}`;
    if (hsTruoc !== hsSau) lech.push({ day: id, chieu: 'ho-so', truoc: hsTruoc, sau: hsSau, cau: `dãy ${id}: hồ sơ đổi (lúc bàn giao ${hsTruoc}, nay ${hsSau})` });
    if (lech.length === truocLech) dayKhop += 1;
  }
  const chuoiKhoa = (ds) => (ds ?? []).map((x) => `${x.tai_nguyen}: ${x.phien}`).sort().join(', ') || 'không có';
  if (!vangGoc.has('khoa')) {
    const a = chuoiKhoa(bg.khoa);
    const b = chuoiKhoa(khoaHienTai(thuMuc));
    if (a !== b) lech.push({ day: null, chieu: 'khoa', truoc: a, sau: b, cau: `khoá: lúc bàn giao «${a}», nay «${b}»` });
  }
  if (!vangGoc.has('don')) {
    const a = [...(bg.don ?? [])].sort().join(', ') || 'không có';
    const b = donHienTai(thuMuc).join(', ') || 'không có';
    if (a !== b) lech.push({ day: null, chieu: 'don', truoc: a, sau: b, cau: `đơn xin lượt: lúc bàn giao «${a}», nay «${b}»` });
  }
  if (!vangGoc.has('sha_nhanh_chinh')) {
    const a = bg.sha_nhanh_chinh ?? null;
    const b = shaNhanhChinh(c);
    if (a !== b) {
      const q = c.goc_kho ? quanHe(c.goc_kho, a, b) : { loai: 'khac' };
      const ten = c.nhanh_chinh ?? 'nhánh chính';
      const cu = `lúc bàn giao ${ngan(a)}, nay ${ngan(b)}`;
      const cau = q.loai === 'tien' ? `nhánh chính (${ten}) dời ${q.n} commit sau bàn giao (${cu})` : `nhánh chính (${ten}) đổi khác lịch sử với lúc bàn giao (${cu})`;
      lech.push({ day: null, chieu: 'nhanh-chinh', truoc: a, sau: b, cau });
    }
  }
  const chuaDayDs = hv.day.filter((d) => chuaDay(d.worktree)).map((d) => d.id);
  const coVang = [...thieu.goc, ...thieu.day];
  const nDay = new Set([...idTruoc, ...idSau]).size;
  const ma = bg?.ma ?? '(không rõ mã)';
  const dongCo = hv.day.filter((d) => chuaDayDs.includes(d.id)).map((d) => {
    const m = mucDay(thuMuc, d, { hangViec: hv });
    return `dãy ${d.id}: CHƯA ĐẨY nhánh ${m.nhanh ?? '?'} — commit chỉ có ở máy này (đỉnh ${ngan(m.dinh)})`;
  });
  const dongVang = coVang.map((k) => `bản bàn giao thiếu trường «${k}» (ghi bằng bản gói cũ) — ${VANG[k] ?? 'không so được trường này'}`);
  const than = [...lech.map((x) => x.cau), ...dongCo, ...dongVang];
  const khop = lech.length === 0;
  const dong = khop && !than.length
    ? [`đối soát bàn giao ${ma}: ${nDay} dãy khớp bản ghi lúc bàn giao · khoá và đơn khớp · nhánh chính không dời`]
    : [`đối soát bàn giao ${ma}: ${dayKhop}/${nDay} dãy khớp · ${than.length} dòng cần đọc`, ...than];
  return { ma, khop, so_day: nDay, day_khop: dayKhop, lech: lech.map(({ cau: _c, ...x }) => x), chua_day: chuaDayDs, co_vang: coVang, dong };
}

// Rời bàn giao cưỡng bức khi chưa có bản mở nào: bản bàn giao dựng ngay lúc nối lại, không có gì để so.
export function khongBanTruoc(ma) {
  return {
    ma,
    khop: true,
    khong_ban_truoc: true,
    lech: [],
    chua_day: [],
    co_vang: [],
    dong: [`đối soát bàn giao ${ma ?? '(không rõ mã)'}: không có bản bàn giao mở trước lúc nối lại — bản bàn giao dựng ngay lúc nối lại, không có gì để so`],
  };
}
