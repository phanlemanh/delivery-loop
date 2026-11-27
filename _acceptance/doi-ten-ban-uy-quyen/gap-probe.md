---
slug: doi-ten-ban-uy-quyen
at: 2026-11-27T19:46:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

# Phản biện context sạch — doi-ten-ban-uy-quyen

Một tác tử tươi đọc đúng bốn tệp (design, contract, evals, sổ) cùng tệp bài học xuyên hồ sơ (input thứ 5, advisory); không
đọc mã kho. Sửa artifact một lượt, không chạy lại phản biện.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Hai dòng sổ máy quyết (version giữ bản 1; gốc so chiều im qua biến môi trường) ghi một-lối mà lối kia chỉ đắt hơn, không chết — cùng lớp [doi-soat-ban-giao#F2] | Cổng Phạm vi trình hai mục như trạm thu phí; version 1 thành hợp đồng lâu dài ở Mốc A mà chủ kho không thấy lối khác | Dòng một-lối phải nêu ràng buộc làm lối kia chết, không thì đổi nguồn hay thành câu hỏi | fixed: version thành câu hỏi chỉ-người Hỏi-6 (dòng mới thay d-…-9); gốc so đổi sang ca TA-04 dùng lại hàm so của UQ-05 với gốc so là tham số, căn cứ mục-tiêu trích luật bản base trọn thư mục của CLAUDE.md (dòng mới thay d-…-12) |
| P1 | evals | E2 đo từng chuỗi có mặt trong câu lỗi trong khi lời hứa là cặp tên cũ → tên mới; merge nằm trong merge-order, gop nằm trong thu-tu-gop | TEN_CU ghi nhầm gop → merge-order mà ma trận vẫn xanh; người gõ theo ADR bị chỉ sang sai quyền | Tách hai tên trong ngoặc «» của câu lỗi, so bằng tuyệt đối với cặp của dòng; ca đỏ đổi chéo | fixed: AC-2 và E2 so cặp tuyệt đối; thêm ca TA-02-do doi-cheo ghim «gop · mong merge · nhận merge-order» |
| P1 | evals | E7 chỉ phủ 3 trong 9 loại; ca đỏ bỏ nghia cả thẻ chứ không từng loại; luật chữ nhận cả nghĩa chứa tên tiếng Anh | Một loại vẫn hỏi thiếu nghia, thẻ in tên tiếng Anh trơn mà E7 xanh | Ma trận chín loại, tập khoá nghia bằng đúng tập tên tệp liệt, nghĩa không chứa tên tiếng Anh; ca đỏ xoá nghĩa riêng session | fixed: AC-7 và E7 phủ chín loại, ghi rõ van_hoi gồm nhóm vẫn hỏi và sai chỗ; ca đỏ đổi sang xoá nghĩa của session, ghim «thẻ thiếu nghĩa tiếng Việt: session» |
| P1 | evals | AC-1 hứa quan hệ với bộ đọc trước vòng mà E1 chỉ đo bằng ma trận viết tay vòng này tự sửa | Người dựng sửa câu vẫn-hỏi của session cùng commit với ma trận; E1 xanh, hành vi lệch DL6 đã ký | Ca vi phân bộ đọc a9b7cbe6 (git archive) trên tệp cũ ↔ bộ đọc mới trên tệp sinh bằng TEN_CU; ca đỏ đổi một chữ câu session | fixed: thêm TA-01 vi-phan-truoc-vong và TA-01-do lech-cau vào AC-1 và E1 |
| P2 | evals | Ma trận tên cũ không ghi dạng danh sách — chỉ đi một nhánh phân tích | Tra TEN_CU chỉ cài ở nhánh dạng dòng; dạng khối rơi về «loại lạ: gop» | Ma trận 18 tên × 2 dạng + 2 khoá; ca đỏ gỡ tra ở nhánh khối | fixed: ma trận ×2 dạng (38 dòng); ca đỏ riêng nhánh khối không dựng — rejected phần ấy vì phép tra đặt ở bước xếp chung cho cả hai dạng, không có nhánh khối riêng để gỡ |
