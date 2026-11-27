# Hạt giống — bước kiểm khi tiếp tục vòng (`--chi-xet`) không thấy tệp vật sửa mà chưa commit

Gốc: delivery-loop/_acceptance/bang-chung-cu-theo-dau-vao/ — mục Ngoài-9 của lượt chấm 1 (`review-findings.md`), chủ kho
chọn «mở hợp đồng mới» ở Cổng Bằng chứng 27/11/2026.

Trạng thái: SỔ, không phải cam kết. Chưa thiết kế, chưa có ô.

## Chuyện đã thấy

- `pr-san-sang.mjs --chi-xet` (khối STALE-GUARD của SKILL feature-loop) hỏi «bằng chứng còn mới không?» bằng vị từ
  `vat-doi-sau-pin.mjs`, và vị từ so `verified_commit` với `HEAD` — tức chỉ thấy commit.
- Luật cũ của SKILL (`git diff --name-only <verified_commit>`, không có `HEAD`) và `stale_files()` của lưới trước-gộp đều
  so với CÂY LÀM VIỆC, nên thấy cả tệp sửa chưa commit.
- Hệ quả: tiếp tục một vòng khi có tệp vật đang sửa dở, bước kiểm vẫn báo «còn mới» và trình thẻ Cổng Bằng chứng trên bằng
  chứng không còn khớp mã. Lưới trước-gộp vẫn bắt được sau khi commit, nên không lọt hàng sai vào nhánh chính; cái mất là
  người ký có thể ký trên bằng chứng cũ.

## Vì sao không sửa trong DL2

Phạm vi đã duyệt của DL2 so theo commit cho cả `pr-san-sang` lẫn `repin-lane --skip-unchanged`; đổi `--chi-xet` sang so
cây làm việc là đổi ngữ nghĩa của một vế đã chấm. Chủ kho chọn tách thành việc riêng có tiêu chí của nó.

## Hướng nghiệm, chưa chọn

- `--chi-xet` cộng thêm tệp bẩn (`git status --porcelain`, trừ `_acceptance/` và danh sách T1) vào danh sách đổi — khớp
  `stale_files()` của lưới.
- Hoặc từ chối trả lời khi cây bẩn ngoài `_acceptance/` (mã thoát riêng, không dùng chung thoát 2 — xem thêm mục Ngoài-4
  của cùng hồ sơ: thoát 2 đang chở hai nghĩa).
- Phép thử trước khi chọn: `pr-san-sang` (không cờ) cố ý chỉ nhìn commit vì nó đẩy `HEAD`; hai chế độ có nên tách vị từ?
