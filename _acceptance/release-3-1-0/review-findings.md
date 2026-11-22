# Review findings: release-3-1-0 (round 1)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 2 — tập mong đợi của AC-3 là bản chép tay, không rút từ Context của hợp đồng**
  Người dùng thấy gì: Phép kiểm xem bản phát hành có mang đúng bốn hồ sơ đã ký hay không đang so với một danh sách chép tay. Nếu sau này ai đó sửa phần mô tả mà quên sửa danh sách, phép kiểm vẫn báo xanh dù hai bên đã lệch. Hôm nay hai bên khớp nên người dùng chưa gặp hậu quả nào.
  Căn cứ: Hậu quả nhẹ và chưa xảy ra: hôm nay hai danh sách khớp, rủi ro chỉ có khi có người sửa mô tả sau này, và ghi lại thành giới hạn đã biết là đủ.
  file: `_acceptance/release-3-1-0/chay.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (hẹp) — bộ lọc dòng đổi bỏ sót dòng trống và dòng có nội dung mở đầu bằng - hoặc +**
  Người dùng thấy gì: Phép kiểm khẳng định hai gói chỉ đổi số phiên bản có thể bỏ sót một thay đổi vặt như thêm hoặc xoá một dòng trống trong tệp khai. Một thay đổi như vậy vô hại với người dùng và không có dấu hiệu nó đã xảy ra ở bản phát hành này.
  Căn cứ: Hậu quả rất nhẹ: chỉ một dòng trống hay dòng lạ có thể lọt qua trong hai tệp khai, không mất dữ liệu, dễ thấy khi xem thay đổi và dễ sửa sau.
  file: `_acceptance/release-3-1-0/goi-chi-doi-so.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
