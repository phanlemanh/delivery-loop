# Review findings: release-3-1-1

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **do-dong-1.sh tính phút bằng `date -j -f` của BSD, nên chỉ chạy được trên macOS**
  Người dùng thấy gì: Phép đo thời gian từ làm xong đến gộp chỉ chạy được trên máy Mac. Chạy trên máy khác sẽ ra số sai hoặc trống, nên người ghi số liệu cho mốc phát hành phải dùng đúng máy Mac.
  Căn cứ: Hậu quả nhẹ vì chủ kho dùng Mac và chỉ ảnh hưởng một dòng số liệu nội bộ, không ảnh hưởng người dùng cuối. Ai chạy lại trên máy khác sẽ thấy ngay số trống hoặc sai. Sửa sau cũng rẻ.
  file: `_acceptance/release-3-1-1/do-dong-1.sh`
  severity: low
  Đề xuất: known-limits

- **gop-thu.sh reports green when the suite list is empty**
  Người dùng thấy gì: Khi cấu hình danh sách kiểm tra bị hỏng, bước rà gộp thử vẫn báo xanh dù chưa chạy kiểm tra nào. Người ký có thể tin rằng bộ kiểm đã xanh trên bản gộp trong khi nó chưa được chạy.
  Căn cứ: Mức nặng vừa, vì báo xanh giả đúng lúc cấu hình hỏng có thể khiến người ký yên tâm sai. Tuy vậy các lệnh kiểm của lượt chấm chính vẫn chạy riêng nên lỗi gộp vẫn bị bắt ở chỗ khác. Sửa sau rẻ.
  file: `_acceptance/release-3-1-1/gop-thu.sh`
  severity: medium
  Đề xuất: known-limits

- **gop-thu.sh resolves a relative output path in two different places**
  Người dùng thấy gì: Nếu chạy bước rà gộp thử từ thư mục không phải gốc kho với đường dẫn kết quả tương đối, nó báo lỗi xung đột gộp sai lý do. Người chạy sẽ bị đánh lạc hướng nhưng chạy lại đúng cách là hết.
  Căn cứ: Hậu quả nhẹ, không mất dữ liệu và người chạy tự gỡ được bằng cách chạy lại từ gốc kho hoặc dùng đường dẫn đầy đủ. Sửa sau rẻ.
  file: `_acceptance/release-3-1-1/gop-thu.sh`
  severity: low
  Đề xuất: known-limits

- **Shape 5 (claims the whole suite, no full matrix written in advance): gop-thu.sh divides by the number of commands that happened to run, not by the length of suite_keys**
  Người dùng thấy gì: Bước rà gộp thử có thể báo đã chạy đủ bộ kiểm trong khi thực tế một lệnh đọc hết đầu vào làm các lệnh sau bị bỏ qua. Người ký có thể thấy kết quả xanh trên số lệnh ít hơn thực có.
  Căn cứ: Mức nặng thấp đến vừa, vì cần một lệnh kiểm đặc biệt mới gây ra và lượt chấm chính vẫn chạy đủ bộ lệnh riêng. Người dùng cuối không bị ảnh hưởng, sửa sau rẻ.
  file: `_acceptance/release-3-1-1/gop-thu.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
