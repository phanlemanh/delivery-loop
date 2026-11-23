# Review findings: release-3-1-1 (round 1)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **gop-thu.sh: các lệnh suite đọc chung stdin với vòng lặp, và tổng «i/i» chỉ tự so với chính nó**
  Người dùng thấy gì: Phép thử gộp có thể lặng lẽ bỏ sót vài bước kiểm mà vẫn báo XANH, nên người ký có thể tin là bộ kiểm đã chạy đủ trong khi thực tế chưa.
  Căn cứ: Hậu quả vừa: màu xanh giả có thể lên thẻ ký, nhưng chưa thấy xảy ra thật, bộ kiểm chính của lượt chấm vẫn chạy riêng, và sửa sau rẻ.
  file: `_acceptance/release-3-1-1/gop-thu.sh`
  severity: medium
  Đề xuất: known-limits

- **gop-thu.sh: thư mục ra dạng tương đối được hiểu theo hai gốc khác nhau**
  Người dùng thấy gì: Nếu chạy phép thử gộp từ thư mục lạ với đường dẫn ngắn, nó sẽ báo lỗi xung đột sai lý do. Người dùng chỉ cần chạy lại cho đúng chỗ.
  Căn cứ: Hậu quả nhẹ: lỗi hiện rõ ràng chứ không im, không mất dữ liệu, người chạy tự thử lại được, và đây là công cụ dùng một lần cho mốc này.
  file: `_acceptance/release-3-1-1/gop-thu.sh`
  severity: low
  Đề xuất: wont-fix

- **gop-thu.sh báo XANH 1/1 khi feature_loop.suite_keys rỗng hoặc vắng (không chạy lệnh suite nào)**
  Người dùng thấy gì: Nếu cấu hình danh sách bộ kiểm bị trống hoặc mất, phép thử gộp vẫn báo XANH dù không chạy bộ kiểm nào, tạo cảm giác an toàn giả cho người ký.
  Căn cứ: Hậu quả vừa nhưng hiếm: chỉ xảy ra khi cấu hình hỏng, hiện cấu hình có 11 khoá nên chưa dính, người ký có thể tự nhìn bảng kết quả để thấy, sửa sau rẻ.
  file: `_acceptance/release-3-1-1/gop-thu.sh`
  severity: medium
  Đề xuất: known-limits

- **gop-thu.sh hiểu sai đường dẫn tương đối khi chạy ngoài gốc kho, và không kiểm rev-parse nên báo nhầm lý do lỗi**
  Người dùng thấy gì: Khi gõ sai tên nhánh hoặc chạy sai chỗ, phép thử gộp báo là xung đột thay vì nói đúng nguyên nhân, làm người đọc mất thời gian tìm sai hướng.
  Căn cứ: Hậu quả nhẹ: script vẫn dừng với lỗi rõ ràng, không có màu xanh giả hay mất dữ liệu, người dùng gõ lại là xong.
  file: `_acceptance/release-3-1-1/gop-thu.sh`
  severity: low
  Đề xuất: wont-fix

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
