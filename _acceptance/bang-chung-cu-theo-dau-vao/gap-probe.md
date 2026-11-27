---
slug: bang-chung-cu-theo-dau-vao
at: 2026-11-26T11:58:00Z
verdict: findings
p0: 3
p1: 2
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | decisions | Bỏ nửa (C) của đề bài được ghi là máy quyết một-lối, trong khi lối giữ (C) còn sống (job CI nhận commit chỉ-chữ-ký, tầng RS3/DL3) — bỏ một nửa đề bài là đổi ý định | Người duyệt chỉ thấy «đi tiếp hẹp / dừng», ký mà không biết vừa bỏ nửa đề bài | Không còn dòng S1 descope chạm một nửa đề bài mà nguồn khác chi-nguoi | fixed: dòng mới thay d-…-6 thành câu hỏi chỉ-người (khuyên tách, giá lối giữ: T3, CỘNG chạm CI ba kho) |
| P0 | decisions + design + contract | Lời hứa «một vị từ ở mọi bên đọc» không thật: lưới bash và vị từ JS lệch ở glob dir/* (ADR 0019); lối gọi thẳng lưới còn sống | Kho khai T1 dạng dir/* — pr-san-sang và lưới cho hai câu trả lời khác nhau, lớp lỗi #10 đổi da | Ca T1 dạng dir/* ghim hành vi ở cả ba bên | fixed: vị từ JS khớp T1 bằng bản JS của luật case bash; AC-8 vi phân bash↔JS trên ma trận 7 × 6 rút hàm bash nguyên văn; ca 10 của AC-3; tiêu đề design và trường feature viết lại; dòng mới thay d-…-3 trích luật dạng nghiệm của CLAUDE.md, design §4.5 nêu giá lối gọi thẳng lưới |
| P0 | decisions | Bỏ đường nền và bỏ coverage-scan ghi một-lối khi lối kia chỉ đắt hơn [doi-soat-ban-giao#F2]; CI xanh không thay nền trên máy chấm lệch Node | Bộ kiểm đỏ sẵn vì Node 26 tính cho vật ở lượt chấm đầu | Mọi loi_chet nêu ràng buộc, không chỉ giá | fixed: đường nền chạy dưới Node 24 (dòng mới thay d-…-7, trích bước S1.0 của SKILL); bỏ coverage-scan đổi sang nguồn mục-tiêu trích luật «spec ngoài đã chốt scope» (thay d-…-9) |
| P1 | evals + contract | Ma trận AC-3 chỉ đo hai bên đồng thuận, không có cột kết luận mong đợi — lỗi chung ở cả hai bên vẫn xanh | Lỗi quotepath tên có dấu hay nhận diện pkg/a/_acceptance sai giống nhau ở hai bên, E3 vẫn xanh | Bảng mong đợi viết trước, số phán quyết = số phần tử | fixed: AC-3 có bảng mười ca × hai bên đọc (20 phán quyết) viết trước trong hợp đồng, ca ma trận so với cột mong đợi |
| P1 | evals + design | Ca dựa vào sha cố định: E7 lẫn tệp PR khác khi nhánh gộp main; BC-4 và BC-5-ban-goc vào bộ kiểm của kit (clone nông, đóng băng thông điệp); BC-5-ban-goc không ghim thông điệp | Main đỏ sau gộp, hoặc E5 xanh/đỏ vì hạ tầng | E7 theo commit riêng của nhánh; ca bản gốc ở rang/; ghim thông điệp | fixed: ac7.mjs lấy tệp từ commit riêng của nhánh (không gộp, không có trên origin/main); BC-4 và BC-5-ban-goc chuyển vào rang/ban-goc.test.mjs (chỉ chạy ở lượt chấm); BC-5-ban-goc ghim «cần verified» của bản gốc ở hợp đồng signed-off + origin không có nhánh + gh 0 lời gọi |
