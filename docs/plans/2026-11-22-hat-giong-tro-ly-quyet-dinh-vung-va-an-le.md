# Hạt giống — trợ lý quyết định: so vùng và án lệ máy

Gốc: _acceptance/mac-ky-co-phu-quyet/ (Cổng Bằng chứng 22/11/2026, chủ kho chọn «mở hợp đồng mới» cho Ngoài-2 và Ngoài-6 trong `review-findings.md`).

- **Ngoài-2 — Dòng máy mặc-ký ghi `stage: gate1` nên bộ tra sổ hồ sơ trước đọc chúng thành «lời người» (r1)** (`plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs`). Những câu máy tự quyết thay người có thể bị các vòng sau đọc nhầm thành ý kiến người đã nói, nên máy có thể viện dẫn chính quyết định của nó như tiền lệ mà không ai nhìn.
- **Ngoài-6 — chongVung bỏ sót chồng lấn với glob mở đầu bằng `**/`, nên kiểm vùng high, khong_bao_gio và giữ-quyền theo glob để lọt mặc-ký (r1)** (`plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs`). Một câu chạm vùng nhạy cảm như di chuyển dữ liệu hay xác thực vẫn có thể được máy tự đi tiếp thay vì hỏi người, và chủ kho khai giữ quyền cho vùng như thanh toán có thể bị bỏ qua mà không báo.

Ưu tiên: Ngoài-6 trước khi bất kỳ kho tiêu thụ nào bật `tro_ly_quyet_dinh.mac_ky`.
