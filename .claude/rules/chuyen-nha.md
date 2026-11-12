# Kho này đang giữa đợt chuyển nhà

Kho `delivery-loop` là kế nhiệm của `acceptance-gate-kit`. Tệp này chỉ có ở nhánh `chuyen-nha` và sẽ được gỡ ở ngày cắt
sang.

Trước mọi việc trong kho này, đọc theo thứ tự:

1. `migration/TRANG-THAI.md` — đang ở đâu, máy nào đang giữ, việc kế, quyết định còn chờ chủ kho.
2. `migration/BOI-CANH.md` — quyết định đã có, luật của đợt, bẫy đã dẫm.
3. `migration/KE-HOACH.md` — mục 3 (bảng tên), 12, 13 và 14 là bản đang hiệu lực; các mục khác là lịch sử suy nghĩ.

Ba điều không được quên:

- Nhánh `main` là bản sao nguyên vẹn nhánh chính kho cũ — không sửa tay.
- Sản phẩm (skills, commands, hooks, scripts, lib, các plugin) chỉ sửa ở kho cũ cho tới ngày cắt sang. Ở kho này chỉ sửa
  `migration/` và tệp này. Hồ sơ của vòng B1 ghi ở đâu là câu còn mở — `migration/BOI-CANH.md`, «câu còn mở» số 1.
- Mỗi lúc một máy giữ nhánh `chuyen-nha`; dòng «Đang giữ» ở `migration/TRANG-THAI.md` nói máy nào.
