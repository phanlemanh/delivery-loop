---
slug: mac-ky-co-phu-quyet
at: 2026-11-22T03:10:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Không có bên ghi nào cho các dòng làm đầu vào của vòng giáng (phủ quyết món mặc-ký, kiểm mẫu, làm lại, pham_vi); --check kiểm lược đồ của dòng không ai viết ra. | AC-5 và AC-6 dựng dòng phủ quyết và kiểm mẫu sai bằng tay đúng khuôn bên đọc nên xanh; ở kho thật không có đường ghi về sổ, loại đã thăng cấp không bao giờ bị giáng. | Thiết kế nêu bên ghi cho từng trường; AC-5 và AC-6 sinh dòng bằng chính bên ghi rồi mới đọc (round-trip); gỡ bên ghi thì ca đỏ. | fixed: thêm bên ghi `--ghi phu-quyet / kiem-mau / lam-lai` (decided_by là tên người, thiếu tên thoát 2); AC-1, AC-5, AC-6 sinh mọi dòng người bằng nó; đột biến bỏ vế đòi tên người làm AC-1 đỏ; SKILL nêu lệnh ở khối mặc-ký. |
| P1 | design | Thiếu nguyên tắc 4: kho chưa có cửa proof thì mặc-ký dừng trước cửa gộp; hàng 1 chạy một mình đúng vào ca ấy. | Vòng có mọi câu chỉ-người mặc-ký đi làn V rồi đường máy thông và gộp mà không người nào thấy. | Hồ sơ có dòng mặc-ký thì không tự gộp khi chưa có proof, kèm đối chứng hồ sơ không mặc-ký vẫn đi như cũ. | deferred: răng ở cửa gộp là hàng 2 (`chuyen-gop`, cùng thí điểm, mở ngay sau vòng này); tới khi hàng 2 gộp, cờ mặc định tắt nên không kho nào chạy mặc-ký; dòng sổ ghi giá và điều kiện. |
| P1 | design, contract | Danh sách không-bao-giờ-tự của đặc tả có «tiền và thứ gửi ra ngoài» mà chuỗi điều kiện không có. | Câu chỉ-người hỏi có gửi webhook hay email cho khách, kho_dao false, ra mac-ky — trái đặc tả; AC-3 vẫn xanh. | AC-3 thêm câu chạm tiền hoặc gửi ra ngoài ra hoi với mã riêng. | fixed: khoá `can_cu.tien` / `can_cu.ra_ngoai` → `tien-ra-ngoai` (luôn hỏi người); AC-3 thêm hai câu; đột biến bỏ vế làm AC-3 đỏ; SKILL dặn bên viết ghi khoá. |
| P1 | design | Vùng do máy tự khai; d-8 ghi một-lối trong khi còn lối so vùng khai với diff thật khi đã có code. | Dòng S1 khai src/api/** ra mặc-ký, code thật chạm src/billing/** tầng high; không lưới nào đặt món về câu hỏi. | Sửa d-8, hoặc thêm phép so diff thật với vùng khai, kèm đối chứng diff trong vùng. | fixed: bộ xếp nhận gốc nhánh (`--base`; bộ xếp căn cứ và thẻ truyền gốc sẵn có) — tệp thật ngoài vùng khai ra `vung-lech`, tệp thật chạm high ra `vung-high`; AC-3 thêm ca hai chiều; d-8 thay bằng dòng mới mang supersedes. |
| P2 | contract | Hai vế ngưỡng thăng cấp (kéo trong cửa sổ, làm lại do phủ quyết) không được đo; không ca nào chứng minh làm lại do bộ kiểm không chặn. | Bỏ vế kéo hoặc gộp nguồn làm lại mà mọi ca vẫn xanh. | AC-5 thêm ba ca cùng kho thử và hai đột biến. | fixed: AC-5 thêm ca kéo chặn, làm lại do phủ quyết chặn, làm lại do bộ kiểm và nguồn khác không chặn (đối chứng dương); đột biến bỏ vế kéo (1 ca đỏ) và gộp nguồn làm lại (3 ca đỏ). Phần Coverage giữ dòng bỏ quét — d-9 trỏ đúng câu đóng-khi-ngờ của đặc tả. |
