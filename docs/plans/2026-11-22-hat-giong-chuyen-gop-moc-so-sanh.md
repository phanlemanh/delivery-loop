# Hạt giống — chuyến gộp: mốc so sánh hỏng tắt lặng phép kiểm vùng

Gốc: _acceptance/chuyen-gop/ (Cổng Bằng chứng 22/11/2026, chủ kho chọn «mở hợp đồng mới» cho Ngoài-7 trong `review-findings.md`).

- **Ngoài-7 — An invalid or unreachable --base silently turns off the vung-lech (and second vung-high) check; the item still gets mac-ky (r1)** (`plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs`). Nếu mốc so sánh bị gõ sai hoặc không có trong bản clone nông, việc kiểm hồ sơ có đi ngoài vùng khai báo bị tắt âm thầm và mục vẫn được mặc-ký mà không có cảnh báo nào.

Ưu tiên: trước khi bất kỳ kho tiêu thụ nào bật `tro_ly_quyet_dinh.mac_ky` cùng `chuyen_gop`.
