# Hạt giống — bản uỷ quyền của kho, lát 2: chuyển hàng, mở dãy, phán quyết chung, vị từ «dọn phiên»

Gốc: delivery-loop/_acceptance/giam-sat-doc-ban-uy-quyen/ — hồ sơ lát 1 của ADR 0030 (bộ đọc, vùng cấm, sự kiện
`dung-quyen`, `gop --theo-quyen`, `thu-tu-gop`, khối thẻ khởi tạo, dòng đếm báo cáo đợt). Hợp đồng ấy trích lại tên tệp
này ở Out of scope và Notes. Lời phê CỘNG của cả gói: `docs/adr/0030-giam-sat-doc-ban-uy-quyen-cua-kho.md` (26/11).

Trạng thái: SỔ, không phải cam kết. Chưa thiết kế, chưa có ô.

## Phần ADR 0030 chưa dựng sau lát 1

- **Lệnh chuyển hàng, lệnh mở dãy** (loại `chuyen-hang`, `mo-day`): phép so có sẵn (`trung-tep.mjs` — mỗi hàng đúng một
  dãy, không hai hàng trùng vùng chạy cùng lúc), lệnh chưa có. Bộ đọc lát 1 in «chưa có lệnh ở bản này — vẫn hỏi chủ kho».
- **`phan-quyet "<câu>"`** (loại `phan-quyet-chung`): ghi cùng lúc vào mục «Phán quyết của giám sát» của `LUAT.md` đợt và
  nhật ký, mỗi phán quyết một dòng kèm đường đảo; phán quyết chạm luật sản phẩm (ADR 0024) vẫn hỏi.
- **Hai bên đọc còn lại của `dung-quyen`:** khối «CHƯA duyệt» của Cổng Bằng chứng in các lần dùng quyền chạm hàng ấy (bên
  đọc ở gói acceptance-gate, đọc sổ sự kiện của đợt); `tiep-tuc` in lại mục «Phán quyết của giám sát» cho giám sát kế
  nhiệm. Ở lát 1 cả hai rỗng theo cấu tạo: gộp và thứ tự gộp xảy ra sau chữ ký của hàng, và chưa có phán quyết nào.

## Vị từ «dọn phiên» (nửa thứ hai của loại `phien`)

Đo 27/11 (design doc lát 1 §4): `chuaDay(worktree)` báo `true` cho dãy đã gộp vào nhánh chính mà nhánh không có upstream
(dương tính giả trên đúng ca dọn sau gộp) và `false` cho dãy đã đẩy mà còn việc dở trong stash (âm tính giả).
`doiSoatBanGiao` đòi bản `ban-giao.json`, dọn sau gộp không có. Vị từ cần dựng — «không commit nào mất» cho MỘT worktree:
đỉnh nằm trong `origin/<nhánh chính>` hoặc trong nhánh theo dõi còn trên remote · cây sạch · không mục stash nào trỏ commit
của nhánh ấy. Kèm ma trận ba ca đo ở trên làm ca đỏ.

## Ngưỡng mở ô

- Lệnh chuyển hàng/mở dãy/phán quyết: đợt đầu tiên chạy bản lát 1 ở một kho có `governance/delegation.yaml` mà chủ kho
  vẫn phải trả lời ≥ 1 câu thuộc ba loại ấy (đếm `hoi-chu-kho` và `can-nguoi` của đợt).
- Vị từ dọn phiên: ≥ 1 đợt mà chủ kho phải tự dọn worktree hay xác nhận dọn bằng tay sau đóng đợt.
