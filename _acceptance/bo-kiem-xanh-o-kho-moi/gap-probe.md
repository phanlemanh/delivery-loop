---
slug: bo-kiem-xanh-o-kho-moi
at: 2026-11-14T14:30:00Z
verdict: findings
p0: 3
p1: 2
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ chọn phép ĐẢO trích một câu không quyết lựa chọn; phép đảo lật cả mục bảng vá nên mục vá đổi nghĩa ca tự qua; ngoại lệ đảo mơ hồ không có khuôn | Mục vá đổi `assert.equal(n, 3)` thành `assert.ok(true)` — khoá ca giữ nguyên, kiem-cho đảo ra bản gốc, E2 xanh trong khi ca đã yếu đi | Dòng sổ thay d-6; ca đỏ ngoài neo; ca mục vá đổi nghĩa; tệp ngoại lệ có tên, đếm, in lên thẻ | fixed: dòng sổ thay d-6 (nguồn một-lối — áp xuôi phải áp bảng vá nên không bắt được lớp này); phép đảo KHÔNG đảo bảng vá; AC-2 + E2 thêm BK-AC2-do-va-nghia và BK-AC2-do-mo-ho; dao-mo-ho.tsv đếm và in. Chỗ «đổi đường cũ thành đường mới ở chỗ không neo» khai Known limit (không đổi nghĩa ca) |
| P0 | design | Ba dòng máy quyết căn cứ yếu: d-4 (độ mịn TAP và bản đồ), d-7 (đọc gate.yml, loại hai việc design), d-8 (lối kho cũ cho P177 chưa chết) | Cổng Phạm vi đọc như kế hoạch đã chốt; test con điều phối chết mà khoá tầng ngoài ok; hàng sổ xếp sai lớp vĩnh viễn | Dòng sổ thay từng dòng | fixed: d-4 thay bằng câu kế hoạch nêu đủ ba nguồn (số nền 667 = ca tầng ngoài) + Known limit test con; d-7 thay bằng câu trích b0/chay.sh định nghĩa bộ kiểm là việc «tests» của gate.yml + Known limit hai việc design; d-8 thành Hỏi-5 có khuyến nghị và lối khác |
| P0 | contract | bo-khoa.tsv và viec-kho-cu-b2.md §2 hút được mọi ca thiếu hay đỏ mà không có quyết của người | Máy thêm dòng bỏ «chập chờn», E4t in «bỏ 8» thành PASS; E8s nhận mọi ca đỏ có mục trỏ | Chính sách bỏ có căn cứ; E4t chỉ đạt khi rỗng; mỗi dòng bỏ mang mã dòng sổ | fixed: dòng sổ chính sách bỏ (trích KE-HOACH «bỏ một ca là bớt bằng chứng … danh sách rỗng là kết quả mong đợi»); AC-3 đỏ «bỏ khoá không có quyết»; AC-4/E4t chỉ đạt khi bỏ 0; AC-8/E8s đòi 0 ca đỏ (lượt chấm chờ kho cũ theo Hỏi-3) |
| P1 | evals | E4t đo chữ báo cáo máy tự viết; n ≥ 5 500 là hằng số; bộ đọc gate.yml không có ca | Bộ đọc bỏ sót bước bản đồ ở cả hai cây → vẫn «giữ đủ»; báo cáo sửa tay vẫn qua | Commit túi khoá + băm; chạy lại phép so; n = số khoá cây cũ; ca đọc gate.yml | fixed: AC-4 + E4t commit hai túi khoá vào ket-qua/giu-khoa/, thước chạy lại giu-khoa và đếm lại n; E4 thêm BK-AC4-do-sua-bao-cao và BK-AC4-doc-gate (khối run nhiều dòng, bảy bước) |
| P1 | evals | Fixture chỉ round-trip phía bash; thiếu chiều im cho khoá mang đường đổi theo bảng xếp | Ca in đường tệp đổi theo bước 6 → AC-4 báo thiếu hàng loạt; bộ đọc TAP lệch đầu ra thật | Ca TAP thật; ca im đường | fixed: AC-3 + E3 thêm BK-AC3-tap (node --test thật, test con, skip), BK-AC3-do-tap, BK-AC3-im-duong; giu-khoa đổi khoá cũ qua bảng xếp |
