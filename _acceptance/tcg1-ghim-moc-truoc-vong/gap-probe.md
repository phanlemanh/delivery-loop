---
slug: tcg1-ghim-moc-truoc-vong
at: 2026-11-22T06:15:00Z
verdict: findings
p0: 2
p1: 1
p2: 2
---

# Gap-probe — tcg1-ghim-moc-truoc-vong

Phản biện context sạch (tác tử tươi, đọc đúng design · contract · evals · decisions + bài học claim-scan). Một lượt; sửa
xong không chấm lại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Sổ d-5 ghi máy quyết nguồn mục-tiêu cho một hệ quả chưa nói thẳng: ghim đầu trước mà đầu sau là cây đang kiểm thì TCG-1 thành bất biến thường trực, không còn là lời hứa của một vòng; câu trích d-5 chỉ kể một sự kiện; lối ghim cả hai đầu và lối cho ca nghỉ sau gộp không có trong sổ (cùng lớp [phan-du-bo-cuc-moi-vong-ba#F2]) | Gate 1 duyệt ý «lời hứa của một vòng» trong khi thứ dựng là bất biến thường trực đánh lên mọi vòng sau đổi đầu ra kho không bật | Dòng sổ mới nêu thẳng bất biến thường trực, kê lối B/C và vì sao chết; design §2/§3b nói thẳng | fixed: d-20261122T054749Z-10 thay d-5 — nguồn một-lối: B và C làm nhát tat-di-nhanh-moi xanh, trái đích «AC-1 vẫn còn răng»; design §2 thêm đoạn «Nói thẳng hệ quả» |
| P0 | design | Câu trích d-2 không quyết giữa hằng sha và neo lịch sử (tìm commit gộp PR #17 rồi lấy cha thứ nhất); d-3 không phủ neo lịch sử (cùng lớp [phan-du-bo-cuc-moi-vong-ba#F1]) | Cổng Phạm vi đọc như hết lối trong khi lối neo lịch sử còn sống | Dòng sổ thay d-2 nêu lối neo lịch sử và vì sao loại | fixed: d-20261122T054749Z-9 thay d-2 — neo lịch sử ra đúng cùng 50840764 (không đổi phán quyết) mà thêm cách gãy khi squash; design §2 thêm đoạn «Hằng sha hay neo lịch sử» |
| P1 | contract | Chiều đỏ của AC-1/E1 dựa trên origin/main trong hai cây thử mà không ghim nó trỏ đâu; răng tự mắc lớp mốc trạng thái nhánh | E1 đỏ «doi chung do mat» vì fixture, hoặc chiều đỏ không ai duyệt | Khai origin/main của từng cây, in sha, ghim hai quan hệ | fixed: hợp đồng định nghĩa «đầu nhánh chính» và hai cây là clone riêng với refs/remotes/origin/main đặt tường minh; E1 in sha và ghim «gộp thử: origin/main == HEAD · PR: origin/main là tổ tiên, khác HEAD» |
| P2 | design | Sổ d-4 nói «mọi job» fetch-depth: 0 mà không eval nào đo; ô pull_request bị loại khỏi AC | Một job chạy tests/ trên pull_request checkout nông thì PR đỏ «khong co commit moc» | Phép đo đọc gate.yml, mọi checkout của job chạy tests/ có fetch-depth: 0 | fixed: d-20261122T054749Z-11 thay d-4 (job manh chạy cả pull_request lẫn push); E1 đọc gate.yml và ghim fetch-depth: 0 cho mọi actions/checkout của job manh và job tests |
| P2 | evals | E4 không kiểm tên tình huống; E2 viết tắt «…» thay vì kê 18 tên; E5 thiếu HEAD~1, HEAD^ so với phép quét Trục D | Tiêm bỏ tên tình huống thì E4 xanh; đổi một nhát giữ số ca thì E2 xanh; ca dùng HEAD~1 thì E5 đỏ oan | Kê đủ tên; thêm assert tình huống; đồng bộ tập chuỗi | fixed: E2 kê đủ 18 tên viết trước; E4 ghim «tinh huong khop»; E5 và AC-5 nhận đúng tập chuỗi của Trục D |
