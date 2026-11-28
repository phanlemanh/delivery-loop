# Review findings: release-3-2-0 (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **AC-7 và thước E7 bị thu từ năm về ba hồ sơ SAU Cổng Phạm vi mà không duyệt lại — trái luật «descope một AC = sửa contract + re-approve»**
  Người dùng thấy gì: Cam kết ban đầu là cả năm hồ sơ của đợt ghim lại đều còn mới, nhưng sau khi ký chỉ còn ba hồ sơ được tính mà người ký chưa duyệt lại bản đã thu hẹp. Bảng bằng chứng báo đạt trọn trên phạm vi hẹp, nên người đọc có thể không thấy hai hồ sơ đã bị bỏ.
  Căn cứ: Việc thu hẹp đã được khai công khai trong hợp đồng và sổ quyết định, và chủ kho vẫn phê hoặc bác được ở cổng bằng chứng. Hậu quả chỉ là báo cáo đẹp hơn thực tế, không mất dữ liệu, và ghi lại thành giới hạn đã biết thì rẻ.
  file: `_acceptance/release-3-2-0/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Nhóm `ghim-lai` (E7/AC-7) báo «XANH: 3/3 còn mới» trong khi một trong ba hồ sơ mang `evals_not_machine_touched` chưa chứng lại — không chỗ nào của hồ sơ mốc khai**
  Người dùng thấy gì: Báo cáo ghi ba hồ sơ đều «còn mới», nhưng một tiêu chí đánh giá bằng đọc của một hồ sơ đã đổi chữ mà chưa ai chấm lại. Người ký có thể hiểu nhầm rằng mọi bằng chứng đều đã được chứng lại.
  Căn cứ: Giới hạn này đã nằm ở hồ sơ con và hướng dẫn nói rõ hồ sơ như vậy đi vòng chấm bù sau. Người dùng cuối không bị ảnh hưởng, chỉ cần thêm một dòng khai giới hạn vào ghi chú mốc, sửa sau cũng không đắt.
  file: `_acceptance/release-3-2-0/chay.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (chiều ngược): E1 hứa GIÁ TRỊ «3.2.0» nhưng lệnh chỉ đo QUAN HỆ «cùng số», bằng chứng chỉ là mã thoát**
  Người dùng thấy gì: Kiểm tra số phiên bản chỉ xác nhận năm gói mang cùng một số, chứ không xác nhận đúng là 3.2.0. Nếu có ai gõ nhầm sang số khác mà đồng loạt thì kiểm tra vẫn xanh.
  Căn cứ: Lớp lỗi này kit đã ghi là giới hạn lặp qua nhiều mốc, và số phiên bản còn được các bước khác như bản cài khớp thẻ soi lại. Người dùng không mất gì, nếu có sai thì phát hành lại là gỡ được.
  file: `_acceptance/release-3-2-0/evals.yaml`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
