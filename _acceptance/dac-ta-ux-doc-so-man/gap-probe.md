---
slug: dac-ta-ux-doc-so-man
at: 2026-11-22T13:58:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design | Khối UX-SO-MAN-S1 dặn sửa tới khi hết đỏ, trong khi màn mới của chính việc chắc chắn đỏ cho tới khi sổ ghi nó; không ô, không AC nào nêu lối ra. | Máy xoá hàng của màn mới hay đổi sang màn đã có để bảng xanh; Cổng Phạm vi duyệt bảng thiếu đúng màn mới. | W1 ghim câu lối ra trong khối; ô cho màn mới; giới hạn kèm ngưỡng. | fixed: câu lối ra ở §3.5 và AC-9 (W1 ghim nguyên câu), ô S10, giới hạn §7 kèm ngưỡng |
| P1 | design | Trục L thiếu thẻ ở kho có lệnh đọc mà hồ sơ không chạm màn, thẻ khi lệnh đọc thoát 2, thẻ khi quá hạn; hạn chưa có số. | Lệnh đọc treo hay thoát 2 làm gate-card không dựng được thẻ cho mọi hồ sơ draft, kể cả vòng không chạm màn. | Ô L8, L9, L10 với L6 làm đối chứng; ghim con số hạn. | fixed: ô L8, L9, L10 (AC-3, AC-8, E3, E8); hạn 10 giây ở §2, đổi được bằng SO_MAN_HAN_MS |
| P1 | evals | Biến thể mẫu là JSON viết tay đúng khuôn bên đọc; lệnh đọc giả trả câu cố định không phụ thuộc đối số; không ghim nguồn mẫu. | Lệnh thật ánh xạ đường dẫn hay unknown khác cách kit giả định; S6 xanh trong kit, đỏ ở kho thật. | Tệp nguồn khai bản chép và biến thể; ca vi phân khoá; ngưỡng đếm. | fixed: nguon.json, hình dạng nào lệnh thật sinh được thì lấy bằng lệnh thật trên kho bỏ đi; lệnh đọc giả lọc theo --screens; ca F1 (AC-10); giới hạn kèm ngưỡng |
| P1 | contract | d-5 mot-loi không loại lối cờ tắt tự chọn; d-3 trích mảnh câu «hoặc» của hạt giống, không quyết. | Cổng Phạm vi đọc d-5 như không còn lối nào khác. | Viết lại hai dòng với căn cứ đúng. | fixed: hai dòng S1 mới mang supersedes — d-3 thành mot-loi (lối tự viết bộ dò chữ đã hỏng ở lượt 3 và 5), d-5 thành muc-tieu trích luật CỘNG của CLAUDE.md |
| P2 | evals | «số ô: 60» in từ hằng không so với ca thực chạy; «PASS: K1» là tiền tố của «PASS: K10»; AC-7 ghi mười hai mà liệt mười ba. | Ca K1 bị gỡ mà E4 vẫn xanh. | Đếm ca thực chạy, khớp nguyên dòng, sửa số. | fixed: tệp ca in «số ca chạy: N» đếm thật và đỏ khi khác 64; expected khớp nguyên dòng, chay.sh kiểm grep -x; AC-7 sửa thành mười ba |
