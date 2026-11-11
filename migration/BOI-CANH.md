# Bối cảnh đợt chuyển nhà — đọc trước khi làm

Soạn 11/11/2026 ở phiên MacBook Pro, để phiên Mac Studio nhận tiếp mà không cần ghi nhớ của máy kia. Kế hoạch đầy đủ:
`KE-HOACH.md`. Tệp này chỉ giữ thứ kế hoạch không nói: ai đã quyết gì, luật làm việc của đợt, và các bẫy đã dẫm.

## Kho này là gì

- `delivery-loop` là kho kế nhiệm của `acceptance-gate-kit`. Nó mang **trọn lịch sử và 30 thẻ chính thức** của kho cũ
  (không mang các thẻ lưu trữ cục bộ `luu-tru/*`, `backup/*`).
- Nhánh **`main`** = bản sao nguyên vẹn nhánh chính kho cũ. Không ai sửa tay vào đây trước ngày cắt sang; chỉ cập nhật
  bằng cách lấy nhánh chính kho cũ (remote `kit-cu`) rồi đẩy sang.
- Nhánh **`chuyen-nha`** = `main` + thư mục `migration/` (kế hoạch, bối cảnh, công cụ chuyển nhà, đo thử). Đây là chỗ duy
  nhất được sửa tay cho tới ngày cắt.
- Kho đang **riêng tư**; chạy kiểm tự động (GitHub Actions) **đang tắt** để lần nhập lịch sử không kích một lượt khoảng
  60 phút. Bật lại khi vòng B1 cần lượt kiểm trên GitHub.

## Chủ kho đã quyết (11/11/2026)

1. Dựng lại kho + làm kit mạch lạc, giữ nguyên tính năng, North Star dẫn dắt, đồng bộ với Repo Standards.
2. Tên kho và tên chợ plugin: `delivery-loop` (tạm chốt — chốt hẳn ở Cổng Phạm vi của B1).
3. Bảng tên plugin và lệnh ở `KE-HOACH.md` mục 3 (tạm chốt — chốt hẳn cùng chỗ).
4. Phương thức: **kho mới**, kho cũ chạy bình thường tới ngày cắt rồi đóng băng ở 2.38.x; không cần giữ tên cũ làm bí danh.
5. **Kho mới mang trọn lịch sử** kho cũ — lý do ở `KE-HOACH.md` mục 13 (79 % ca đỏ thêm khi bỏ lịch sử là ca dựng lại bản
   cũ từ mã commit hay thẻ cũ).
6. **Giữ Mac Studio** làm máy chạy đợt; không dùng phiên Cloud (phiên Cloud không nạp plugin của kit — `KE-HOACH.md` mục 10).
7. Nhịp: nền dựng ở MacBook Pro → đẩy lên GitHub → **Mac Studio kéo về và làm chính** từ đây.

## Chủ kho CHƯA quyết (đừng tự quyết)

- Gọi tên vòng A1 (`luot-kiem-nhe`, kho cũ) và mở dãy B.
- Ngoại lệ luật chiều rộng (b) cho B1 + B2, và **hạn dừng** của đợt (đề xuất 21 ngày từ khi B1 mở).
- Chốt hẳn tên `delivery-loop` và bảng tên.
- Ngày cắt sang (chữ ký mốc 3.0).
- Vòng riêng cho hai tệp máy vẽ (`PRODUCT-MAP.md`, `LO-TRINH.html`) — hai hạt giống 16/10 và 30/10 ở kho cũ.
- Hồ sơ chuẩn «kho plugin» bên Repo Standards (dãy R) — làm ở kho `repo-standards`, máy nào cũng được.

## Luật làm việc của đợt

- **Kho cũ là nguồn duy nhất của sản phẩm tới ngày cắt.** Mọi sửa sản phẩm (kể cả vòng A1) vào kho cũ; kho mới chỉ nhận
  bản sinh ra từ kịch bản chuyển nhà và thư mục `migration/`.
- **Kịch bản chuyển nhà sinh commit dọn nhà LÊN TRÊN nhánh chính kho cũ**, chạy lại được, hai lần ra cùng một cây.
- **Không bật cả hai chợ** (`acceptance-gate-kit` và `delivery-loop`) trong cùng một kho tiêu thụ — ba plugin giữ tên sẽ
  trùng (suy đoán, chưa thử).
- **Kho nhận 3.0 đầu tiên: Quỹ hàng** (`onehub-quy-hang`), trên một cây làm việc riêng; crm sau.
- Mọi luật của kit trong `CLAUDE.md` vẫn áp: ba nguyên tố, TRỪ tự đi / CỘNG cần duyệt, chiều đỏ trong bộ kiểm, sửa kit cân
  trên mọi kho, đổi schema có đường đọc-cũ.

## Bẫy đã dẫm trong lúc đo (11/11)

- **zsh không tự tách từ:** `P="a b c"; git grep … -- $P` thành một đường dẫn, trả 0 im lặng. Dùng mảng `P=(a b c)`. Số 0
  từ một phép đếm luôn phải có đối chứng dương.
- **`git grep -- . ':!_acceptance'` trong vòng lặp** cũng từng trả 0 sai — đếm theo thư mục bằng awk thì đúng.
- **Theo dõi tiến trình bằng `pgrep -f`** phải dò đúng chuỗi lệnh thật (đã `cd` rồi gọi `bash chay.sh …` thì chuỗi không
  chứa `b0/chay.sh`).
- **Đừng gọi điều gì là «phát hiện» trước khi tìm trong 206 hạt giống** của kho cũ (`docs/plans/*hat-giong*`): «tệp máy vẽ
  nằm trong kho» đã có vòng và hai hạt giống từ trước.
- Ba bản sao đo thử chạy song song mỗi bản một `TMPDIR` riêng — không giẫm nhau (tám tệp kiểm nhắc `/tmp/…` chỉ là giá trị
  giả, không ghi ra đĩa).

## Số đo nền (11/11, `be736814`, bản 2.38.1)

Đủ ở `KE-HOACH.md` mục 2 và 13. Năm con số hay dùng:

- Bản cài plugin lõi 100 MB (sản phẩm thật 3–4 MB).
- Lượt kiểm tự động trung vị 58 phút; bộ kiểm script 37 + bộ kiểm plugin 17 chạy nối đuôi.
- Đo thử B0: trên ~4 300 khoá ca, bỏ lịch sử +329 đỏ, bỏ thêm hồ sơ và sổ +86.
- Bỏ lịch sử: bộ kiểm plugin 16 → 3 phút (phần lớn giờ là dựng lại bản cũ).
- PR mở → gộp trung vị 3,6 giờ.

## Những gì máy kia (MacBook Pro) còn giữ mà kho này không có

- Ba bản sao và nhật ký đầy đủ của đo thử B0 (thư mục tạm của phiên; chỉ kết quả tóm và hai kịch bản ở `migration/b0/`).
- Ghi nhớ dự án của phiên MacBook Pro — nội dung cần thiết đã chép vào tệp này.
