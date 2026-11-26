## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Chú thích và chữ help của Makefile nói CI chạy `make check-quick`/`check-heavy`, nhưng CI của kho không gọi `make`**
  Người dùng thấy gì: Người chạy lệnh trợ giúp của Makefile sẽ đọc thấy câu nói CI giữ các bước kiểm này, trong khi CI thật không chạy chúng. Họ có thể tin nhầm là có lưới an toàn ở CI.
  Căn cứ: Chỉ là chữ giải thích sai, không mất dữ liệu và không làm hỏng gì; người đọc nhầm thì chỉ mất thời gian, và sửa lại chữ sau rất rẻ.
  file: `Makefile`
  severity: low
  Đề xuất: known-limits

- **mk/upgrade.mk tạo một đích `format` ma: kho không có đích format nên `make format` chỉ chạy tường rồi thoát 0**
  Người dùng thấy gì: Ai gõ lệnh định dạng mã sẽ thấy báo thành công nhưng không có gì được định dạng. Kho này vốn không dùng định dạng qua lệnh đó nên hại thực tế rất nhỏ.
  Căn cứ: Hậu quả nhẹ, không mất dữ liệu, người dùng tự nhận ra khi mã không đổi; chữ của khuôn nên ghi vào giới hạn đã biết thay vì sửa tệp có băm ghim.
  file: `mk/upgrade.mk`
  severity: low
  Đề xuất: known-limits

- **upgrade_markers.py báo xanh khi .repo-setup.json hỏng hoặc vắng: tường dấu xung đột tắt mà không ai biết**
  Người dùng thấy gì: Khi tệp ghi trạng thái nâng cấp bị hỏng do gộp nhánh, kiểm tra dấu xung đột trên máy vẫn báo sạch dù dấu xung đột còn trong mã. Người dùng có thể đẩy lên mã còn xung đột mà không được cảnh báo ở máy.
  Căn cứ: Nặng vừa phải vì tường im lặng xanh sai, nhưng CI vẫn đỏ nhờ bước kiểm khác và người dùng tự sửa được; sửa đúng chỗ phải ở kho khuôn nên nên ghi giới hạn và báo lên nguồn.
  file: `tools/upgrade_markers.py`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (assert «chuỗi có mặt» khi lời hứa là QUAN HỆ): AC-5 chỉ grep tên lệnh trong job khung rồi chạy tools/*.py riêng, không chạy thân bước của job**
  Người dùng thấy gì: Ai đó có thể sửa quy trình CI để bước kiểm khung không bao giờ làm hỏng lượt chạy mà phép đo vẫn báo đạt. Khi đó lưới chặn ở CI tồn tại trên giấy nhưng không chặn được gì.
  Căn cứ: Chỉ xảy ra khi có người cố ý hoặc vô ý sửa quy trình CI theo cách đó, và lỗi lộ ra ở lượt CI kế; ghi giới hạn rẻ hơn dựng thêm phép đo.
  file: `_acceptance/nang-repo-setup-0-10-4/rang/do.py`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
