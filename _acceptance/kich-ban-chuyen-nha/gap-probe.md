---
slug: kich-ban-chuyen-nha
at: 2026-11-13T11:05:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện context sạch — kich-ban-chuyen-nha

Một tác tử tươi đọc đúng sáu tệp: design doc, contract, evals, sổ quyết định, ô cơ hội và tệp bài học từ hồ sơ trước. Nó
không đọc mã và không chạy lệnh nào. Vòng này một lượt, không phản biện lại sau khi sửa.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | decisions | Dòng sổ d-3 để máy tự xếp 22 tệp chưa rõ. Câu trích «giữ nguyên tính năng» không quyết được tệp nào vào bản cài, trong khi ô cơ hội ghi chính 22 tệp này là phần cần người xếp. Cùng hình với [tier-b-doc-khong-do-duoc#F2] và [luot-kiem-nhe#F1] | Chủ kho ký mà tin cách xếp có căn cứ. Thật ra danh sách bỏ rỗng là máy suy, và AC-3 vẫn xanh khi xếp sai chỗ | Hỏi-4 trên thẻ Cổng Phạm vi, liệt 22 tệp theo nhóm | human-gate1: dòng S1 mới thay d-3 (`supersedes`) thành Hỏi-4 có khuyến nghị và lối khác kèm giá |
| P0 | decisions | Dòng sổ d-6 ghi lối «tác giả và ngày cố định» là lối duy nhất, nhưng lối chết nó nêu lại do chính AC-1 tự đặt ra (lập luận vòng, [tier-b-doc-khong-do-duoc#F1]). Thước của kế hoạch chỉ đòi cùng cây | Lịch sử kho mới mang mãi năm commit có tác giả máy và ngày lùi, mà không ai được hỏi | Tách làm hai dòng: phần khuôn giữ một-lối, phần commit thành câu hỏi | human-gate1: d-6 được thay bằng hai dòng — year/today giữ một-lối (mã cây phụ thuộc vào chúng), tác giả và ngày commit thành Hỏi-5 |
| P1 | contract | AC-4 loại trừ tệp khuôn của commit 5 khỏi phép so từng byte, nên khuôn chạm `CLAUDE.md`, `.gitignore` hay `.github/` thì không AC nào thấy | `apply.py` thật trộn vào một tệp luật của kit, mọi eval vẫn xanh | Danh sách viết trước những tệp commit 5 được thêm, sửa, xoá; chiều đỏ là khuôn giả sửa `CLAUDE.md` | fixed: AC-8 thêm danh sách được phép (thêm 5 · sửa 2 · xoá 0) kèm chiều đỏ «khuôn chạm tệp ngoài danh sách: CLAUDE.md»; E8 thêm KB-AC8-danh-sach và KB-AC8-do-cham, E8t in danh sách. Ca xung đột của `apply.py` thật vào Notes như giới hạn đã khai |
| P1 | evals | Thước AC-4 «áp lại luật» có thể dùng chung hàm và bảng với kịch bản, tức là tự chấm mình, và fixture không có chuỗi va chạm nào | Luật `dieu-phoi` thiếu neo, đổi luôn `dieu-phoi.mjs` hoặc `acceptance-gate-kit-tri-thuc`, mà thước vẫn xanh | Ma trận viết trước gồm chuỗi phải đổi và chuỗi phải giữ, mutant gỡ neo, thước không được import kịch bản | fixed: AC-4 thêm ma trận 5 + 5 đặt trong tệp kiểm, số đếm trước/sau trên nguồn thật, mutant gỡ neo tên chợ, ca KB-AC4-doc-lap |
| P1 | evals | Không ca nào đo tất định khi chạy ở hai ngày khác nhau, và không ca nào đo việc chạy lại vào cùng nhánh sau khi nguồn đi thêm | Quên truyền `today` mà eval vẫn xanh; lần chạy lại sau khi kho cũ đổi thì hỏng | KB-AC1-ngay kèm mutant, KB-AC2-nguon-moi | fixed: AC-1 thêm hai ngày mô phỏng và chiều đỏ «khác mã cây»; AC-2 thêm ca chạy lại cùng nhánh trên nguồn mới, so danh sách worktree; E1, E2 thêm ba ca tương ứng |
