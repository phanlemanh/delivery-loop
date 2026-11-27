// Bản uỷ quyền của kho (ADR 0030, hồ sơ giam-sat-doc-ban-uy-quyen) — MỘT bộ đọc cho mọi bên dùng: lệnh của quyền (`gop
// --theo-quyen`, `thu-tu-gop`), thẻ khởi tạo. Tệp `governance/delegation.yaml` do chủ kho viết ở kho tiêu thụ; kit chỉ đọc,
// và đọc ở ĐỈNH NHÁNH CHÍNH ngay lúc dùng (`git show origin/<nhánh chính>:…`), không bao giờ ở cây làm việc hay nhánh PR —
// nên PR của chính giám sát không nới được quyền trước khi chủ kho gộp nó. Kho không có tệp → `{ co: false }`, mọi bên dùng
// chạy như trước vòng, từng byte.
//
// Danh sách loại ĐÓNG, kit định nghĩa: một loại chỉ được nhận khi kit có phép so trước/sau VÀ lệnh dùng nó (ADR 0030, Quyết
// định 2). Tên ngoài danh sách là lỗi đọc. Vùng cấm cứng không cấu hình được: tệp liệt một mục cấm thì cả tệp bị từ chối.
import { execFileSync } from 'node:child_process';
import { ghiSuKien } from './dot.mjs';

export const TEP_UY_QUYEN = 'governance/delegation.yaml';

const CHUA_LENH = 'chưa có lệnh ở bản này — vẫn hỏi chủ kho';
const CHUA_PHEP_SO = 'chưa có phép so — vẫn hỏi chủ kho';
// <<<UY-QUYEN-LOAI
export const LOAI = {
  'thu-tu-gop': { nhom: 'nhan', cau: null },
  gop: { nhom: 'nhan', cau: null },
  phien: { nhom: 'van-hoi', cau: 'mở phiên: máy đã tự làm theo thẻ khởi tạo, không cần quyền — dọn phiên: chưa có phép so — vẫn hỏi chủ kho' },
  'chuyen-hang': { nhom: 'van-hoi', cau: CHUA_LENH },
  'mo-day': { nhom: 'van-hoi', cau: CHUA_LENH },
  'phan-quyet-chung': { nhom: 'van-hoi', cau: CHUA_LENH },
  'lo-trinh': { nhom: 'van-hoi', cau: CHUA_PHEP_SO },
  'muc-ngoai-hop-dong': { nhom: 'sai-cho', cau: 'không thuộc giám sát đợt — sống ở chính sách Cổng Đáng' },
  'thiet-ke': { nhom: 'sai-cho', cau: 'không thuộc giám sát đợt — sống ở sổ thiết kế của design-assembly' },
};
// UY-QUYEN-LOAI>>>

// Vùng cấm cứng (ADR 0030, Quyết định 3) — tên → điều nó chạm.
export const VUNG_CAM = {
  'chu-ky': 'chữ ký ở mọi cổng',
  'cat-ban': 'cắt bản',
  'xoa-nhanh': 'xoá nhánh còn commit chưa gộp',
  'day-kho-khac': 'đẩy lên kho khác',
  'cai-dat-github': 'đổi cài đặt GitHub',
  workflows: '.github/workflows/',
  governance: 'governance/',
  'luat-san-pham': 'luật sản phẩm của kho',
  'pham-vi-dot': 'phạm vi của chính đợt',
  'luat-dot': 'luật của chính đợt',
  'uy-quyen': 'bản uỷ quyền của chính đợt',
};

// Tệp mà gộp theo quyền không được chạm (răng thứ hai của vùng cấm, trên chính PR).
export const VUNG_CAM_TEP = ['.github/workflows/', 'governance/', 'PRODUCT-INVARIANTS.md'];
export const tepChamVungCam = (tep) => tep.filter((t) => VUNG_CAM_TEP.some((v) => (v.endsWith('/') ? t.startsWith(v) : t === v)));

const go = (s) => String(s ?? '').trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1').trim();
const boChuThich = (d) => (/^\s*#/.test(d) ? '' : d.replace(/\s+#.*$/, ''));

// Khuôn đọc (gói không nạp bộ đọc YAML — cùng lệ với gop.mjs, cua-proof.mjs): khoá cột 0 `ban: <số>` và `tu_lam:` với
// danh sách dạng dòng `[a, b]` hoặc dạng khối `- a`; khoá cột 0 khác → cờ vàng; dòng ngoài khuôn → lỗi đọc nêu số dòng.
export function phanTichUyQuyen(text) {
  const vang = [];
  let ban;
  let tuLam;
  let trongKhoi = false;
  const loi = (cau) => ({ ban, tu_lam: tuLam, vang, loi: cau });
  const dong = String(text ?? '').split(/\r?\n/);
  for (let i = 0; i < dong.length; i++) {
    const d = boChuThich(dong[i]);
    if (!d.trim()) continue;
    if (trongKhoi) {
      const m = /^\s+-\s+(.+?)\s*$/.exec(d);
      if (m) {
        tuLam.push(go(m[1]));
        continue;
      }
      trongKhoi = false;
    }
    const k = /^([A-Za-z_][\w-]*):(?:[ \t]+(.*?))?\s*$/.exec(d);
    if (!k) return loi(`dòng ${i + 1} ngoài khuôn: «${dong[i].trim()}»`);
    const [, khoa, gt = ''] = k;
    if (khoa === 'ban') {
      if (!/^\d+$/.test(gt)) return loi(`ban phải là một số, nhận «${gt}»`);
      ban = Number(gt);
    } else if (khoa === 'tu_lam') {
      if (gt === '') {
        tuLam = [];
        trongKhoi = true;
      } else {
        const f = /^\[(.*)\]$/.exec(gt);
        if (!f) return loi(`tu_lam phải là một danh sách, nhận «${gt}»`);
        tuLam = f[1].split(',').map(go).filter(Boolean);
      }
    } else vang.push(`khoá lạ «${khoa}» — bộ đọc bỏ qua`);
  }
  if (tuLam === undefined) return loi('thiếu tu_lam — không biết quyền nào được giao');
  if (ban === undefined) vang.push('tệp đời cũ thiếu trường ban — đọc như bản 1');
  else if (ban !== 1) return loi(`bản ${ban} mới hơn bộ đọc (bộ đọc hiểu bản 1)`);
  return { ban: ban ?? 1, tu_lam: tuLam, vang, loi: null };
}

// Xếp một kết quả phân tích theo danh sách đóng. Có lỗi → không loại nào được nhận.
export function xepUyQuyen(pt) {
  const rong = { nhan: [], van_hoi: [], vang: pt.vang ?? [] };
  if (pt.loi) return { ...rong, loi: pt.loi };
  const tuLam = pt.tu_lam;
  const cam = tuLam.find((t) => Object.hasOwn(VUNG_CAM, t));
  if (cam) return { ...rong, loi: `«${cam}» thuộc vùng cấm cứng (${VUNG_CAM[cam]}) — không cấu hình được; cả tệp bị từ chối` };
  const nhan = [];
  const vanHoi = [];
  for (const t of tuLam) {
    if (!Object.hasOwn(LOAI, t)) return { ...rong, loi: `loại lạ: ${t}` };
    if (LOAI[t].nhom === 'nhan') nhan.push(t);
    else vanHoi.push({ loai: t, nhom: LOAI[t].nhom, cau: LOAI[t].cau });
  }
  return { nhan, van_hoi: vanHoi, vang: rong.vang, loi: null };
}

const IO_THAT = { chay: (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120_000 }) };
const dongDau = (e) => String(e?.stderr ?? '').split('\n').map((x) => x.trim()).find(Boolean) ?? String(e?.message ?? e).split('\n')[0];

// Đọc bản uỷ quyền ở đỉnh nhánh chính của kho `gocKho`. Lấy về hỏng mà ref cũ CÓ tệp → không quyền nào (quyền đã thu ở
// nhánh chính không được sống tiếp nhờ ref cũ); ref cũ không có tệp, hay không có ref nào → im như kho không tệp.
export function docUyQuyen({ gocKho, nhanhChinh = 'main', io = IO_THAT }) {
  const nhanh = nhanhChinh || 'main';
  const vang = { co: false, sha: null, nhanh, nhan: [], van_hoi: [], vang: [], loi: null };
  const git = (args) => io.chay('git', ['-C', gocKho, ...args]);
  let layVeLoi = null;
  try {
    git(['fetch', '-q', 'origin', nhanh]);
  } catch (e) {
    layVeLoi = dongDau(e);
  }
  let sha;
  try {
    sha = git(['rev-parse', '--verify', '-q', `refs/remotes/origin/${nhanh}`]).trim();
  } catch {
    return vang;
  }
  if (!sha) return vang;
  let text;
  try {
    text = git(['show', `${sha}:${TEP_UY_QUYEN}`]);
  } catch {
    return vang;
  }
  if (layVeLoi) return { ...vang, co: true, sha, loi: `không lấy được nhánh chính origin/${nhanh} (${layVeLoi}) — chưa biết bản uỷ quyền hiện hành, không quyền nào được nhận` };
  return { co: true, sha, nhanh, ...xepUyQuyen(phanTichUyQuyen(text)) };
}

// Mỗi lần dùng quyền là một sự kiện ghi TRƯỚC hành động (ADR 0030, Quyết định 4). `can_phan: false` để Monitor của giám
// sát không tự thức vì việc của chính nó. Ghi hỏng thì ném — bên gọi không được hành động.
export function ghiDungQuyen(thuMuc, { quyen, viec, duong_dao, sha_uy_quyen }) {
  try {
    ghiSuKien(thuMuc, { loai: 'dung-quyen', quyen, viec, duong_dao, sha_uy_quyen, can_phan: false });
  } catch (e) {
    throw new Error(`không ghi được sự kiện dung-quyen — không làm (${dongDau(e)})`);
  }
}
