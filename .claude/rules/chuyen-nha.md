# Kho này đang ở «chuyển nhà giai đoạn 2»

Kho `delivery-loop` là kế nhiệm của `acceptance-gate-kit`. Ngày cắt sang là 18/11/2026 (thẻ `v3.0.0`): từ đó nhánh `main`
của kho này là NGUỒN của kit. Tệp này chỉ có ở nhánh `chuyen-nha` và được gỡ khi đợt đóng (chặng II.4).

Trước mọi việc trên nhánh này, đọc theo thứ tự:

1. `migration/TRANG-THAI.md`, mục «Bảng việc giai đoạn 2» — việc nào xong, việc nào đang mở, điều kiện mở việc kế.
2. `migration/KE-HOACH-GIAI-DOAN-2.md` — kế hoạch chủ kho duyệt 19/11: năm chặng, thước, điểm dừng, quyền lặp A3.
3. `migration/BOI-CANH.md` — luật của đợt và các bẫy đã dẫm. `migration/KE-HOACH.md` là sử liệu của giai đoạn 1.

Vòng làm việc của phiên giữ đợt: đọc bảng việc → làm việc đầu tiên đã mở được → ghi bằng chứng (mã commit, số PR) vào bảng →
đi việc kế. Chỉ dừng gọi chủ kho ở các điểm dừng đã liệt kê trong kế hoạch.

Bốn điều không được quên:

- `main` chỉ đổi qua PR, gộp bằng commit gộp (không gộp dồn). Không đẩy thẳng, không đẩy đè.
- Trên nhánh `chuyen-nha` chỉ sửa `migration/` và tệp này. Việc chạm tệp khác của kit đi bằng PR vào `main` từ một cây làm
  việc riêng, và chỉ các việc kế hoạch đã liệt kê.
- Kho cũ đã đóng băng ở `v2.39.0`: không sửa sản phẩm ở đó. Kho cũ có commit mới thì dừng, hỏi chủ kho.
- Mỗi lúc một máy giữ nhánh `chuyen-nha`; dòng «Đang giữ» ở `migration/TRANG-THAI.md` nói máy nào. Lời duyệt cổng của một
  vòng do chủ kho gõ ở phiên của chính vòng ấy; phiên giữ đợt không chuyển lời duyệt cổng.
