# Đề bài phiên đo «DL4» — có ca phụ thuộc gián tiếp nào lọt qua lịch biết tệp không

Viết 28/11/2026, phiên giữ đợt (Mac Studio). Chủ kho phê 28/11 đề xuất `migration/de-xuat-sau-dl6.md` («Phê cả bốn», trong
đó: DL4 đo trước) rồi bảo «Mở cả hai» (phiên V1 và phiên đo này). Đây là phiên CHỈ ĐỌC: không viết mã, không mở vòng,
không tạo hồ sơ `_acceptance/`, không hỏi chủ kho câu nào.

## Bối cảnh

- Gói `plugins/dispatch` của kit đã có «lịch biết tệp»: `scripts/trung-tep.mjs` (hồ sơ `ky-den-gop`) chỉ giao một hàng khi
  vùng tệp nó khai (`ranh_gioi`) không trùng tệp của PR đang mở và không trùng `ranh_gioi` của hàng đang dở ở dãy khác;
  skill `cat-luot` ghi `vung`, hàng nhận làm `ranh_gioi` (hồ sơ `vung-giao-viec-tu-cat-luot`); bộ phát lịch ghi sự kiện
  `ranh-gioi-vang` khi hàng không khai vùng.
- Gói DL4 («điều phối đọc bản đồ phạm vi để xếp vòng nối tiếp hay song song») vì vậy chỉ còn phần dư: phụ thuộc GIÁN
  TIẾP — hàng A sửa một mô-đun, hàng B sửa màn import mô-đun ấy; hai vùng không trùng nên lịch cho chạy song song.
- Điều kiện mở DL4 (viết lại 28/11, `migration/hat-giong-sau-goi-dl-ba-kho.md` mục «Điều kiện DL4» — đọc bằng
  `git fetch origin chuyen-nha` rồi `git show origin/chuyen-nha:<tệp>`): **≥ 1 ca đo được ở một kho tiêu thụ** — hai hàng
  chạy song song có `ranh_gioi` KHÔNG trùng, mà vẫn phải gộp nhánh chính vào nhánh có xung đột, hoặc phải ghim lại bằng
  chứng sau chữ ký, vì tệp hàng kia đổi nằm ngoài vùng của hàng này nhưng là phụ thuộc của nó. Ca do hàng không khai
  `ranh_gioi` KHÔNG tính.

## Việc — hai phép đo, trên ba kho tiêu thụ

Kho và nhánh chính: `~/dev/onehub-inventory` (`main`) · `~/dev/crm` (kho `crm-onehub`, `onehub`) · `~/dev/onehub-quy-hang`
(`main`). Chỉ đọc qua `git fetch origin` và `git show` / `git log` / `git merge-tree` trên `origin/<nhánh>`; không đổi
nhánh, không sửa cây làm việc của kho nào.

1. **Độ phủ của `ranh_gioi`.** Trên các đợt điều phối kho đã chạy (gói đợt, `hang-viec.json`, lịch sử đợt theo khoá
   `dieu_phoi.lich_su` / `dieu_phoi.goi_dot` trong `_acceptance/config.yaml`, và tệp lộ trình nếu hàng lấy vùng từ đó):
   mỗi kho có bao nhiêu hàng, bao nhiêu hàng khai `ranh_gioi` (hoặc nhận `vung`), bao nhiêu sự kiện `ranh-gioi-vang`.
   Nêu cửa sổ thời gian đã đo.
2. **Ca phụ thuộc gián tiếp.** Tìm cặp hàng (hoặc cặp PR) chạy chồng thời gian, cả hai đều có vùng, vùng không giao nhau
   theo chính hàm của kit (`ranhGioiGiao` trong `trung-tep.mjs` — gọi hàm, không viết lại luật), mà một bên vẫn (a) có
   lần gộp nhánh chính vào nhánh bị xung đột, hoặc (b) có commit ghim lại bằng chứng sau chữ ký, và tệp gây ra việc ấy do
   bên kia đổi, nằm NGOÀI vùng của bên bị ảnh hưởng. Với mỗi ca nêu: kho, hai hàng hay hai PR, commit, tệp, vì sao tệp ấy
   là phụ thuộc (đường `import` hay lệnh eval chạy qua nó).

## Luật của phép đo

- **Đối chứng dương trước khi tin số 0:** trước khi kết luận «0 ca», chạy đúng phép dò ấy trên một ca đã biết là va chạm
  (ví dụ một cặp PR trùng tệp thật trong lịch sử, hoặc một cặp dựng trong thư mục tạm) và cho thấy phép dò bắt được nó.
  Không có đối chứng dương thì báo «chưa đo được», không báo «0».
- Phân biệt ba loại và đếm riêng: ca phụ thuộc gián tiếp (tính) · ca do hàng không khai vùng (không tính — sửa đúng
  tầng là kho khai vùng) · ca trùng tệp trực tiếp mà lịch đáng lẽ đã chặn (không tính cho DL4, nhưng báo riêng vì đó là
  lỗi của lịch hiện có).
- Mọi đường dẫn trong script suy từ đối số hoặc vị trí script; script và kết quả trung gian để ở thư mục tạm NGOÀI mọi
  kho.
- Số nào không đo được thì nói thẳng là chưa đo, kèm lý do.

## Ràng buộc

- CHỈ ĐỌC ở mọi kho. Không commit, không đẩy, không mở PR, không tạo nhánh, không sửa tệp trong kho nào, kể cả thư mục gốc
  bản sao `~/dev/delivery-loop-main` (đang ở nhánh `va-chu-ky-giu-cho-lenh-gop` — không đụng).
- Kho `onehub-quy-hang` là kho riêng tư: báo cáo chỉ nêu SỐ ĐẾM tổng hợp và mã commit của kho ấy; không chép tên tệp, tên
  hàng hay nội dung nội bộ của nó.
- Không in nội dung `.env*`, không in tệp cấu hình shell.
- Không hỏi chủ kho. Vướng thì dừng và báo trong tin cuối.
- Công cụ kit chạy dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.

## Xong là

Một báo cáo trong tin cuối của phiên, gồm: bảng độ phủ `ranh_gioi` theo kho · số ca theo ba loại · danh sách ca phụ
thuộc gián tiếp kèm con trỏ lần được (hoặc «0 ca» kèm đối chứng dương) · lệnh tái hiện từng số · điều chưa đo được. Phiên
giữ đợt đọc báo cáo, kiểm lại, rồi ghi sổ: có ≥ 1 ca thì DL4 thành vòng dựng mang ca ấy làm gốc (vào Mốc C); 0 ca thì DL4
ở lại hạt giống.
