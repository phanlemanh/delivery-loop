# Hạt giống — commit chữ ký không kéo thêm một vòng CI

Gốc: delivery-loop/_acceptance/bang-chung-cu-theo-dau-vao/ — nửa (C) của vòng DL2, tách ra ở bước thiết kế 26/11/2026
(design doc §7); hợp đồng của ô trích lại tên tệp này ở Notes.

Trạng thái: SỔ, không phải cam kết. Chưa thiết kế, chưa có ô.

## Chuyện đang xảy ra

- Bước PR-SAN-SANG cho CI chạy trong lúc người đọc thẻ Cổng Bằng chứng. Chữ ký sau đó là một commit mới trên đầu nhánh, chỉ
  đổi tệp của hồ sơ — nhưng kiểm bắt buộc của GitHub tính trên chính commit ấy, nên CI chạy lại trọn rồi mới gộp được.
- Số đo 26/11 (Inventory trên kit 3.1, 9 PR có chữ ký): ký → gộp trung vị 0,43 giờ khi chữ ký là commit cuối. PR #15 của kit
  (K12): 7′21″. Phần lớn khoảng ấy là một vòng CI chạy trên commit chỉ-chữ-ký.
- Inventory bắt `check`, `e2e`, `gate` (bộ luật nhánh); kit bắt `gate`, `tests` (bảo vệ nhánh, không strict).

## Vì sao không làm trong DL2

Kit một mình không vượt được kiểm bắt buộc trên đầu nhánh: lệnh gộp `gop.mjs` có thể chấp CI xanh trên commit cha, nhưng
GitHub vẫn từ chối gộp khi check bắt buộc chưa chạy trên commit chữ ký. Lối thật là job CI của kho tự nhận ra commit
chỉ-chữ-ký (diff so commit cha chỉ chạm tệp hồ sơ của một hồ sơ, và CI trên commit cha đã xanh) rồi bỏ qua bước nặng — một
check bị bỏ qua được GitHub tính là qua. Job CI là tệp của kho tiêu thụ, cùng tầng CI mà Repo Standards đang dựng (RS3, gói
DL3). Đổi cài đặt GitHub nằm ngoài phạm vi của vòng kit.

## Hướng nghiệm, chưa chọn

- Kit cấp một lệnh chỉ đọc «commit này chỉ-chữ-ký so với cha?» (cùng vị từ tệp hồ sơ của `vat-doi-sau-pin.mjs`), kho gọi nó
  trong job CI để bỏ bước nặng. CỘNG, chạm CI của mọi kho dùng.
- Hay gộp chữ ký vào commit bằng chứng trước khi đẩy (không có commit chữ ký riêng) — đổi nghi thức ký, chạm ADR 0002.

## Ngưỡng mở ô

Mở khi Repo Standards có tầng CI dùng thật ở một kho (RS3), hoặc khi đo được ký → gộp trung vị trên 30 phút ở năm vòng liên
tiếp của một kho mà chữ ký là commit cuối.
