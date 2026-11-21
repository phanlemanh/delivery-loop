# Review findings: loi-gop-trong-cau-ky (round 2)

## Trong hợp đồng

Không có finding.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

Không có mục mới ở round này.

- **Thẻ và lệnh gộp đọc khoá gop_theo_loi_ky khác nhau ở các cách viết YAML hợp lệ: thẻ in ô gộp mà lệnh gộp từ chối (r1)**
  Người dùng thấy gì: Nếu chủ kho viết cấu hình bật theo một cách lạ nhưng vẫn hợp lệ (thêm khoảng trắng quanh dấu hai chấm), thẻ vẫn hiện ô gộp nhưng máy từ chối gộp. Người ký phải gộp tay.
  Căn cứ: Chỉ xảy ra với cách viết cấu hình hiếm, hậu quả là phải gộp tay một lần, không mất dữ liệu, và chủ kho sửa lại cách viết là hết.
  file: `plugins/dispatch/scripts/gop.mjs`
  severity: medium
  Đề xuất: known-limits

- **dongChuKy là bộ đọc chữ ký thứ hai, không loại chữ ký giữ chỗ, lệch với chuKyThat và pre-merge-check (r1)**
  Người dùng thấy gì: Một báo cáo mới điền tạm chữ ký kiểu «pending» hoặc «TBD» vẫn bị máy coi là đã ký. Ở kho chưa nối kiểm tra trước khi gộp vào CI, máy có thể gộp một PR chưa có chữ ký thật, và gộp thì khó đảo.
  Căn cứ: Nặng vì việc gộp khó đảo và có thể đưa vào nhánh chính thứ chưa ai ký, nhưng chỉ xảy ra khi có chữ ký giữ chỗ và kho thiếu lưới CI, nên cần một việc riêng để sửa cho đúng.
  file: `plugins/dispatch/scripts/gop.mjs`
  severity: medium
  Đề xuất: new-contract

- **Thẻ và lệnh gộp đọc khoá gop_theo_loi_ky khác nhau: thẻ in ô gộp, lệnh gộp từ chối «kho chưa bật» (r1)**
  Người dùng thấy gì: Khi cấu hình kho viết hơi khác chuẩn, thẻ hứa gộp khi CI xanh nhưng lệnh gộp báo kho chưa bật. Người đã gõ lời gộp vẫn phải tự gộp, tốn thêm một lượt gọi người.
  Căn cứ: Hậu quả chỉ là thêm một lần gộp tay ở kho có cấu hình viết lạ, không mất dữ liệu và người dùng tự khắc phục được bằng cách chuẩn hoá cấu hình.
  file: `plugins/dispatch/scripts/gop.mjs`
  severity: medium
  Đề xuất: known-limits

- **dongChuKy tự viết lại vị từ chữ ký và bỏ bảng giữ-chỗ của chuKyThat: «pending»/«TBD» được tính là chữ ký người (r1)**
  Người dùng thấy gì: Chữ ký tạm như «pending» hay «TBD» được máy tính là chữ ký thật nên có thể cho phép gộp khi chưa ai ký. Kho không có kiểm tra CI bổ sung sẽ không có lưới nào chặn.
  Căn cứ: Gộp nhầm là khó đảo nhưng cần đủ nhiều điều kiện khác cùng đúng mới xảy ra, nên đáng sửa trong một việc riêng chứ không phải chặn bản này.
  file: `plugins/dispatch/scripts/gop.mjs`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 3 (assert chuỗi có mặt trong khi lời hứa là QUAN HỆ): «thẻ và bên đọc của lệnh gộp cùng một phán quyết trên mọi cách viết khoá» được đo bằng hai danh sách điểm viết tay riêng, không có phép so chung nào (r1)**
  Người dùng thấy gì: Bộ kiểm tra không phát hiện được chỗ thẻ và lệnh gộp hiểu cấu hình khác nhau, nên lỗi kiểu này có thể lọt qua mà vẫn báo xanh.
  Căn cứ: Chỉ làm mất khả năng phát hiện sớm một lỗi nhỏ đã được ghi ở các mục trên, người dùng không bị ảnh hưởng trực tiếp và có thể bổ sung kiểm tra sau.
  file: `tests/scripts/lgck-the.test.mjs`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
