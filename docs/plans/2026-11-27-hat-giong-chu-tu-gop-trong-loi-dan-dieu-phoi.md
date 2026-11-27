# Hạt giống — cụm «tự gộp» trong lời dặn của gói điều phối lệch từ vựng của kit

Gốc: delivery-loop/_acceptance/giam-sat-doc-ban-uy-quyen/ — eval E11 của hồ sơ ấy ra UNCERTAIN ở lượt chấm 1 (27/11/2026)
chỉ vì cụm này; chủ kho ghi Đạt ở Cổng Bằng chứng và chọn ghi hạt giống. Hợp đồng ấy trích lại tên tệp này ở Notes.

Trạng thái: SỔ, không phải cam kết.

## Hiện trạng

`CONTEXT.md` (mục «Lời gộp») liệt «tự gộp» vào _Avoid_: đó là `--auto` của GitHub, kit không dùng. Lời dặn của gói điều
phối vẫn dùng cụm ấy cho ô `tu_merge` của đợt — các dòng có từ trước vòng DL6:

- `plugins/dispatch/scripts/mau/LUAT.md` — dòng «Gộp (khi đợt cho tự gộp): …»;
- `plugins/dispatch/README.md` — «… đợt không cho tự gộp» (đoạn gộp dưới khoá merge) và «… chỉ tự gộp — bằng `gop` hay
  `chuyen` — khi …» (đoạn cửa proof);
- thông điệp lỗi của `scripts/gop.mjs` («đợt không cho tự gộp (tu_merge)») — mặt máy, ca có sẵn có thể ghim chữ này.

Lưu ý khi dò: «thứ tự gộp» chứa chuỗi «tự gộp» nhưng không phải thuật ngữ bị tránh.

## Hướng (chưa thiết kế)

Đổi chữ người đọc sang «quyền tự merge» (đúng nhãn ô trên thẻ khởi tạo) hoặc «gộp khi giữ khoá», kèm bộ dò từ vựng đọc
_Avoid_ của `CONTEXT.md` trên lời dặn của gói; hoặc chủ kho nới _Avoid_ của mục «Lời gộp» cho riêng ô `tu_merge`. Thông
điệp máy đổi thì soát ca đang ghim chữ cũ (bộ GL-, LGM-, ky-den-gop) trước.

## Ngưỡng mở ô

Một lượt chấm nữa (bất kỳ hồ sơ nào) ra UNCERTAIN hay FAIL vì cụm này, hoặc một vòng sửa lời dặn của gói điều phối mở
vì lý do khác (gom luôn vào vòng ấy).
