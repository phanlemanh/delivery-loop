---
slug: va-chu-ky-giu-cho-lenh-gop
at: 2026-11-21T10:52:00Z
verdict: findings
p0: 2
p1: 2
p2: 1
---

# Phản biện context sạch — va-chu-ky-giu-cho-lenh-gop

Một tác tử đọc đúng năm tệp (hợp đồng, evals, sổ quyết định, hạt giống chữ ký giữ chỗ thay cho design doc, bài học từ hồ
sơ trước), không đọc mã, không chạy lệnh. Phản biện chạy khi hồ sơ còn mang tên `release-3-1-0` và còn phần cắt mốc;
đề bài sau đó thu về đúng bản vá (21/11) — không phản biện lại (một lượt), các mục của phần mốc ghi «moot».

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Dòng sổ «chặn khi lõi vắng» trích câu chỉ liên quan; ràng buộc «bộ đệm cùng số» không câu nào quyết; lối khoan dung kèm cờ vàng còn sống mà sổ không nêu | Kho cài lẻ một gói (dispatch 3.1.0, lõi 3.1.1) bị chặn gộp theo lời ở mọi PR — lượt gọi người dồn về đoạn ký→gộp | Mỗi lối dòng sổ loại đều có câu trích loại nó | fixed: dòng S1 mới mang supersedes; sau góp ý của phiên giữ đợt (ADR 0003, ca P33) thay lần nữa — gốc lõi truyền bằng cờ --loi, dòng lệnh giải bằng resolve-plugin.mjs (bản mới nhất có tệp, cùng luật cả kit), gói điều phối không tự dò bộ đệm nên không còn ca «lõi khác số»; vế «không rơi về phép cũ» trích câu hạt giống «không chép bảng giữ chỗ sang»; AC-6 đo gốc lõi thật (gộp), thư mục rỗng và lõi không xuất chuKyThat (chặn) |
| P0 | contract | Dòng sổ bỏ đường nền ghi một-lối mà lối chạy đường nền không chết; dòng caKit cùng hình dạng | Cổng Phạm vi đọc như không còn lựa chọn; một đỏ sẵn của nền bị tính cho vật | Thay bằng nguồn đúng, nêu lối khác và giá | fixed: bỏ đường nền thành Hỏi-3 (chỉ người có — ngân sách lượt đo dài), khuyến nghị bỏ — vẫn giữ sau khi thu phạm vi; dòng caKit thay bằng dòng mới: ca kỳ vọng GỘP không thể xanh trên bản sao không lõi, và thêm GL-6j chạy ở chính bản sao ấy đòi thông điệp chặn |
| P1 | contract | Bố cục bản chép đợt không có AC; bố cục bộ đệm dựng tay; giới hạn không kèm ngưỡng | Đường đọc PHIEN-BAN.json sai, E6 vẫn xanh, kho nhận chạy đợt thì lối gộp theo lời luôn chặn | Ca bản chép đợt do chính chepLoi sinh; ngưỡng cho giới hạn bộ đệm | fixed (sau đối chiếu ADR 0003): gói điều phối không còn tự đọc bố cục bộ đệm hay PHIEN-BAN.json — gốc lõi đến từ resolve-plugin.mjs qua --loi, nên bản chép đợt và bộ đệm dùng chung một đường; AC-6 đo cờ --loi (gốc thật · thư mục rỗng · lõi không xuất chuKyThat), bố cục nguồn và gói một mình; Notes khai giới hạn gọi tay thiếu cờ kèm ngưỡng |
| P1 | evals | Vế «gop.mjs không chứa chuỗi giữ chỗ» âm tính một mình, đo chuỗi thay quan hệ | gop.mjs có chuỗi «pending» hợp lệ ở chỗ khác → đỏ giả; bảng thứ hai viết dạng regex lọt qua | Mutant đổi bảng của lõi, ca phải theo | fixed: bỏ phép đo chuỗi; thêm GL-6k lặp mọi mẫu của CHU_KY_GIU_CHO rút từ lõi, và ba bản sao tiêm: phep-cu (đỏ), mau-moi (xanh, số mẫu tăng), bang-rieng (đỏ nêu mẫu mới) |
| P2 | evals | Câu hỏi (i) của E8 đối chiếu giới hạn trích mà nguồn (báo cáo bằng chứng loi-gop-trong-cau-ky) không trong inputs | Hội đồng FAIL vì không thấy nguồn, hoặc PASS tin suông | Thêm evidence-report vào inputs | moot: phép đo hội đồng của ghi chú phát hành bỏ cùng phần mốc khi đề bài thu về bản vá |
