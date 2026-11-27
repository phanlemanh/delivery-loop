# Review findings: giam-sat-doc-ban-uy-quyen

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Ghi chu.json của khoá merge nằm ngoài khối finally, trái với lời khai «mọi lối sau lúc giữ khoá đều nhả»**
  Người dùng thấy gì: Hiếm khi ổ đĩa đầy hoặc không ghi được, lệnh gộp theo quyền có thể để lại một khoá gộp trống. Trong khoảng một phút các dãy khác chưa được cấp lượt gộp, rồi hệ thống tự thu hồi.
  Căn cứ: Nhẹ vì chỉ xảy ra khi đĩa hỏng, không mất dữ liệu, và tự hết sau chừng một phút nên người dùng không phải làm gì.
  file: `plugins/dispatch/scripts/gop.mjs`
  severity: low
  Đề xuất: known-limits

- **dong2 chép lại đúng hàm dong đã có trong cùng tệp**
  Người dùng thấy gì: Có một đoạn mã nhỏ bị chép hai lần trong cùng tệp. Người dùng không thấy khác biệt nào.
  Căn cứ: Không ảnh hưởng người dùng, chỉ làm mã dài hơn một chút nên không đáng mở việc riêng.
  file: `plugins/dispatch/scripts/gop.mjs`
  severity: low
  Đề xuất: wont-fix

- **Tệp thứ tự gộp sống mãi và bộ phát lịch áp nó mà không đọc lại bản uỷ quyền: thu quyền thì thứ tự cũ vẫn chạy, và thứ tự đè lên cả đơn mới không có lúc giám sát xếp**
  Người dùng thấy gì: Sau khi giám sát đã xếp lại thứ tự gộp, thứ tự đó vẫn áp cho cả đợt, kể cả khi chủ kho đã thu quyền và cả với đơn gộp xin sau. Một dãy xin muộn có thể bị xếp sau dãy cũ ngoài ý chủ kho cho tới khi ai đó xoá tay tệp thứ tự.
  Căn cứ: Mức vừa vì chủ kho thu quyền mà thứ tự cũ vẫn chạy là bất ngờ, nhưng chỉ đổi thứ tự gộp chứ không mất dữ liệu và người dùng gỡ được bằng cách xoá tệp thứ tự.
  file: `plugins/dispatch/scripts/phat-lich.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lối gộp theo quyền luôn báo «đã nhả khoá merge» (nha_merge: true) ở mọi lối, kể cả khi bộ phát lịch đã thu hồi khoá và finally không nhả gì**
  Người dùng thấy gì: Khi lệnh gộp chạy quá lâu và khoá bị thu hồi, báo cáo vẫn ghi là đã nhả khoá dù thực tế không phải. Người đọc sổ có thể hiểu sai một sự kiện hiếm.
  Căn cứ: Nhẹ vì chỉ sai một dòng ghi chú trong tình huống hiếm, việc gộp và khoá của dãy khác không bị ảnh hưởng.
  file: `plugins/dispatch/scripts/gop.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỗ khác với vật được giao): ca đo gọi thẳng hàm module, không chạy lệnh CLI mà chỉ dẫn bảo giám sát dùng**
  Người dùng thấy gì: Các phép kiểm chưa chạy qua đúng câu lệnh mà giám sát gõ thật, nên nếu phần nối cờ lệnh bị hỏng thì bộ kiểm vẫn báo xanh. Người dùng có thể gặp lệnh không chạy đúng mà không được cảnh báo trước.
  Căn cứ: Mức vừa vì lỗi nối lệnh có thể lọt qua kiểm tra, nhưng sẽ lộ ngay ở lần dùng đầu và thêm ca kiểm sau này rẻ.
  file: `tests/dieu-phoi/uy-quyen.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): kiemNhaKhoa nuốt mọi lỗi ném ra mà không ghim thông điệp, cũng không kiểm khoá đã thật sự được giữ**
  Người dùng thấy gì: Hai phép kiểm về việc nhả khoá khi gộp hỏng có thể báo xanh dù chưa chạm đúng lỗi cần bắt. Nếu sau này nhả khoá hỏng ở hai lối ấy thì có thể không ai biết.
  Căn cứ: Nhẹ tới vừa vì chỉ là độ tin cậy của phép kiểm, người dùng chưa bị ảnh hưởng và việc siết lại phép kiểm không đắt.
  file: `tests/dieu-phoi/uy-quyen.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): đợt và khoá merge dựng tay, trong khi evals khai là do CLI thật và bộ phát lịch sinh**
  Người dùng thấy gì: Mô tả các phép kiểm nói dùng lệnh thật nhưng thực tế dựng dữ liệu bằng tay, nên nếu sau này định dạng đổi thì bộ kiểm có thể không phát hiện. Hiện tại kết quả vẫn đúng.
  Căn cứ: Nhẹ vì hôm nay kết quả không sai, chỉ là lời khai lệch, người dùng không bị ảnh hưởng và sửa lời khai là việc rẻ.
  file: `tests/dieu-phoi/uy-quyen.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
