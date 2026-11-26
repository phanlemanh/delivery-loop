---
slug: nang-repo-setup-0-10-4
at: 2026-11-26T02:35:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

# Phản biện context sạch — nang-repo-setup-0-10-4

Đầu vào: design doc, contract, evals, decisions.jsonl, claims (bài học từ vòng trước). Một lượt, không re-probe.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Dòng sổ khai plugin_versioning=independent do máy quyết với câu trích chỉ nói số của một gói ở mốc 3.1.1, không quyết luật đánh số lâu dài; lối đánh chung số còn sống; mục plugin_versions ngoài bốn điểm hở đề bài; chưa có eval đo plugin_lint.py đọc khoá ấy. Cùng lớp [va-chu-ky-giu-cho-lenh-gop#F1]. | Chủ kho ký Cổng Phạm vi mà không thấy câu hỏi về luật đánh số; kho tắt phép kiểm lệch số bằng một khoá thường trực; gói lệch ngoài ý muốn ở mốc sau thì doctor và job khung đều im. | Đổi thành câu hỏi chỉ-người-biết kèm giá từng lối; thêm đột biến gỡ khoá vào E5, ghim thông điệp lệch số. | fixed: dòng sổ mới (supersedes dòng 3) thành câu hỏi chỉ-người-biết với khuyến nghị và lối khác có giá; AC-5/E5 thêm chiều đỏ gỡ vars.plugin_versioning → plugin_lint.py nêu «no independent versioning is declared». |
| P1 | evals | Vế tiêm của AC-4 chèn dấu xung đột vào chính Makefile — make đổ «missing separator» trước khi upgrade_markers.py chạy, nên ghim «nêu Makefile» không phân biệt tường bắt lỗi với make đọc tệp hỏng. | Gỡ hay hỏng upgrade_markers.py mà E4 vẫn xanh. | Tiêm vào tệp được quản mà make không đọc; ghim thông điệp của upgrade_markers.py; khẳng định không có «missing separator»; chạy cả upgrade_markers.py trực tiếp. | fixed: AC-4 tiêm vào .editorconfig, ghim dòng «.editorconfig:N: conflict marker from a repo-setup upgrade», cấm «missing separator», đo cả make upgrade lẫn upgrade_markers.py (thông điệp đo thật trên bản sao chạy thử). |
| P1 | contract | AC-5 không đòi tests vẫn chạy khi khung đỏ (always() cấp job) và không đòi khung chạy ở cả pull_request lẫn push. | Không có always(): khung đỏ thì tests bị bỏ qua, kiểm bắt buộc vẫn qua; khung chỉ chạy PR thì nhánh chính đỏ. | Khẳng định always() cấp job, khung không if, có cả hai lối vào; hai đột biến ghim thông điệp. | fixed: AC-5 vế (1)(2) thêm ba khẳng định; E5 thêm ba bản sao gate.yml đột biến với thông điệp ghim «tests không chờ khung», «tests bị bỏ qua khi khung đỏ», «khung mang điều kiện». |
| P1 | contract | AC-3(3) đo chuỗi công thức của đích test, trong khi lời hứa là hành vi make test không đổi; bản trộn thêm tiền điều kiện order-only derived. | Gắn derived vào test làm make test chạy ledgers.py trước bộ chạy kiểm; AC-3 vẫn xanh. | So đầu ra make -n test giữa HEAD và bản gốc vòng, chỉ cho phép đúng các dòng đã khai; đột biến thêm tiền điều kiện lạ. | fixed: AC-3(3) so make -n test, cho phép đúng ba dòng đã khai đứng trước (đo thật trên bản chạy thử: upgrade_markers.py, ledgers.py draw, «:»); hai đột biến (đổi công thức, tiền điều kiện lạ). Đổi hành vi make test khai thẳng ở Notes. |
| P2 | design | Thiết kế nói derived đứng trước mọi bước kiểm, AC-4 đòi dòng đầu make -n check là upgrade_markers.py — chưa ghim từ lần chạy thử. | Dòng đầu thật là ledgers.py thì E4 đỏ ở lượt chấm dù vật đúng khuôn. | Ghim dòng đầu thật từ bản chạy thử, sửa câu thiết kế. | fixed: chạy thử cho dòng đầu make -n check là python3 tools/upgrade_markers.py (derived tự chờ upgrade); câu thiết kế sửa thành «trước mọi bước kiểm trừ upgrade». |
