---
slug: doi-soat-ban-giao
at: 2026-11-24T08:10:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện context sạch — doi-soat-ban-giao

Tác tử tươi, chỉ đọc năm tệp: bản thiết kế, hợp đồng, evals, sổ quyết định, bài học từ vòng trước (claim-scan, advisory).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Dòng sổ «chặn mở chip ở kết quả lệnh nối lại, không sửa hàm dùng chung» trích ca DP4-08, nhưng câu ấy nói về lúc phiên CHƯA đọc mức dùng, không quyết chỗ chặn khi khuyên chờ; lối sửa hàm dùng chung còn sống. Cùng lớp [va-chu-ky-giu-cho-lenh-gop#F1] | Chủ kho đọc như không có lựa chọn; phiên tự gọi chẩn đoán trong lúc khuyên chờ thấy mo-chip rồi mở chip | Thay dòng sổ bằng câu trích thật sự quyết, hoặc hạ thành câu hỏi; ngưỡng phải đếm cả lối chẩn đoán | fixed: dòng sổ mới (supersedes d-…-5) trích `VIEC_HANH_DONG['mo-chip']` «chẩn đoán không mời mở lại» — chip chỉ mở ở bước 4 theo kế hoạch của lệnh nối lại; bản thiết kế 4.2 nêu giá của lối kia; giới hạn ở Notes nay đếm mọi chip mở trong lúc khuyên chờ qua bất kỳ lối nào |
| P0 | contract | Ba dòng sổ ghi một-lối khi lối kia chỉ đắt hơn: bỏ đường nền, so với bản mở, không thêm trường. Cùng lớp [va-chu-ky-giu-cho-lenh-gop#F2] [tep-chung-khong-chan-gop#F1] [release-3-0-0#F1] | Cổng Phạm vi đọc như không còn lối khác; nền đỏ sẵn bị tính cho vật | Mỗi dòng một-lối nêu ràng buộc làm lối kia không thể đi, không thì đổi nguồn | fixed: bỏ đường nền thành câu hỏi Hỏi-6 kèm giá hai lối (supersedes d-…-3); «so với bản mở» và «không thêm trường» thành nguồn mục-tiêu trích hạt giống (supersedes d-…-4, d-…-6) |
| P1 | contract | Khứ hồi chỉ đo một chiều (trường bên đọc có trong tệp), không đo chiều ngược (mỗi khoá bên viết có bên đọc hoặc nằm trong danh sách bỏ qua có tên); trục A kể «đã đẩy» là chiều mà không có chiều so nào; hàng `da_day` của AC-8 luôn đúng | Trường bên viết thêm sau này vẫn không có bên đọc mà mọi ca xanh | Khoá khuôn và tệp = TRUONG_DOC hợp BO_QUA, có chiều đỏ thêm trường | fixed: AC-1 đòi bằng nhau hai chiều với danh sách `BO_QUA` có lý do trong cùng khối marker, thêm chiều đỏ «trường thu_moi không có bên đọc»; trục A bỏ «đã đẩy» (là cờ, đo ở AC-4); AC-8 thay hàng `da_day` bằng hàng `nhanh` (giá trị hiện tại khác rỗng nên quan sát có thể sai) |
| P1 | evals | Tệp mẫu chữ chỉ sinh từ mười hàng lệch: không có dòng khớp, dòng CHƯA ĐẨY, dòng vàng, dòng không có bản trước — hội đồng không thấy chúng; câu hỏi nói tới dòng khớp không có trong tệp | Dòng vàng chỉ có tên trường máy lọt qua hội đồng | Sinh tệp từ mọi lớp dòng, liệt kê lớp trong câu hỏi | fixed: AC-3 và E3 nêu năm lớp dòng; thêm E3a (ca DS-03 sinh lại tệp từ năm lớp, so từng byte, chiều đỏ sửa một byte); AC-8 đòi dòng vàng kèm chữ giải thích |
| P1 | contract | Ba nhánh hành vi bản thiết kế hứa mà không ca nào đo: nhánh chưa từng đẩy (không có nhánh theo dõi), đỉnh khác lịch sử, dãy bị gỡ khỏi đợt | Cờ CHƯA ĐẨY im đúng ở ca phổ biến nhất ở đợt thật; câu sai cho nhánh viết lại lịch sử | Thêm hàng vào ma trận, có chiều đỏ | fixed: AC-4 thành ma trận hai hàng (a) đỉnh sau lần đẩy cuối · (b) nhánh chưa từng đẩy, chiều đỏ «coi không-nhánh-theo-dõi là đã đẩy»; AC-2 thêm (k) đẩy cưỡng bức «khác lịch sử» và (l) gỡ dãy, ma trận 12 hàng, chiều đỏ gồm (a), (c), (k) |
