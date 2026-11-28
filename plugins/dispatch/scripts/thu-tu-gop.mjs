// Xếp lại thứ tự cấp khoá `merge` (ADR 0030, quyền `merge-order` của bản uỷ quyền; hồ sơ giam-sat-doc-ban-uy-quyen). Lệnh của quyền:
// `thu-tu-gop <dãy,dãy,…> --phien <mã giám sát>`. Phép so trước/sau là «tập PR được gộp không đổi»: danh sách phải là HOÁN
// VỊ đúng tập dãy đang có đơn `merge` — thiếu, thừa hay trùng thì chặn. Hợp lệ → ghi `dung-quyen` TRƯỚC, rồi ghi tệp thứ tự
// mà bộ phát lịch đọc mỗi nhịp (`xepHang`). Mỗi PR vẫn qua `xetGop` lúc gộp — thứ tự không mở phép kiểm nào.
import fs from 'node:fs';
import path from 'node:path';
import { docJson, ghiJsonNguyenTu, gocKhoChinh, timThuMucDot } from './dot.mjs';
import { docCauHinh } from './hinh-dang.mjs';
import { docUyQuyen, ghiDungQuyen } from './uy-quyen.mjs';
import { laGiamSat } from './vai.mjs';

export const TEP_THU_TU_GOP = 'thu-tu-gop.json';

// Dãy đang có đơn `merge` trong `xin/` (một tệp mỗi đơn, khoá `phien` = mã dãy).
function dayCoDonMerge(thuMuc) {
  const d = path.join(thuMuc, 'xin');
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((t) => t.endsWith('.json')).flatMap((t) => {
    const don = docJson(path.join(d, t), null);
    return don?.loai === 'merge' && typeof don.phien === 'string' ? [don.phien] : [];
  });
}

const chan = (ly_do) => ({ duoc: false, ly_do });

export function thuTuGop(cwd, danhSach, { phien = null, io } = {}) {
  if (typeof danhSach !== 'string' || !phien) throw new Error('thu-tu-gop: dùng `thu-tu-gop <dãy,dãy,…> --phien <mã giám sát>`');
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) throw new Error('thu-tu-gop: không có đợt nào đang chạy');
  if (laGiamSat(thuMuc, phien) !== true) return chan(`phiên ${phien} không phải giám sát của đợt`);
  const cfg = docCauHinh(thuMuc);
  const nhanh = cfg.nhanh_chinh ?? 'main';
  const uq = docUyQuyen({ gocKho: cfg.goc_kho ?? gocKhoChinh(cwd), nhanhChinh: nhanh, ...(io ? { io } : {}) });
  if (!uq.nhan.includes('merge-order')) return chan(`bản uỷ quyền không nhận quyền merge-order — ${uq.loi ?? (uq.co ? 'delegated không có merge-order' : `kho không có governance/delegation.yaml ở origin/${nhanh}`)}`);
  const moi = danhSach.split(',').map((x) => x.trim()).filter(Boolean);
  const dang = dayCoDonMerge(thuMuc);
  const trung = moi.filter((x, i) => moi.indexOf(x) !== i);
  if (trung.length) return chan(`trùng dãy ${[...new Set(trung)].join(', ')}`);
  const thieu = dang.filter((x) => !moi.includes(x));
  if (thieu.length) return chan(`thiếu dãy ${thieu.join(', ')} — danh sách phải gồm đúng các dãy đang chờ gộp (${dang.join(', ') || 'không dãy nào'})`);
  const thua = moi.filter((x) => !dang.includes(x));
  if (thua.length) return chan(`thừa dãy ${thua.join(', ')} — dãy ấy không có đơn merge nào đang chờ`);
  const p = path.join(thuMuc, TEP_THU_TU_GOP);
  const cu = docJson(p, null)?.thu_tu ?? null;
  ghiDungQuyen(thuMuc, { quyen: 'merge-order', viec: `xếp lại thứ tự gộp: ${moi.join(' → ') || '(rỗng)'}`, duong_dao: `xoá ${p} (thứ tự trước: ${cu ? cu.join(' → ') : 'theo máy'})`, sha_uy_quyen: uq.sha });
  ghiJsonNguyenTu(p, { thu_tu: moi, luc: new Date().toISOString(), boi: phien });
  return { duoc: true, thu_tu: moi, cu, ly_do: `thứ tự gộp: ${moi.join(' → ') || '(rỗng)'}` };
}
