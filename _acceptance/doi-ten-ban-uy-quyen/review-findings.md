# Review findings: doi-ten-ban-uy-quyen

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Phần expected của evals E2/E1/E3 mô tả đầu ra mà ca test không in ra**
  Người dùng thấy gì: Phần mô tả kết quả mong đợi trong bộ đánh giá ghi số dòng và nội dung khác với những gì bài kiểm tra thật sự in ra. Chức năng đổi tên vẫn chạy đúng, nhưng người chấm đọc mô tả này có thể thấy lệch dù sản phẩm không sai.
  Căn cứ: Chỉ làm tài liệu mô tả sai lệch chứ không làm sai hành vi cho người dùng; có thể chỉnh lại câu chữ về sau mà không mất dữ liệu hay phải làm lại sản phẩm.
  file: `_acceptance/doi-ten-ban-uy-quyen/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Cùng một bộ tên cũ được gọi bằng hai ngày khác nhau: «đời 26/11» và «đời 27/11»**
  Người dùng thấy gì: Tài liệu quyết định gọi cùng một bộ tên cũ bằng hai mốc ngày khác nhau, có thể làm người đọc phân vân chốc lát. Không ảnh hưởng cách sản phẩm hoạt động.
  Căn cứ: Chỉ gây nhầm lẫn nhẹ khi đọc tài liệu, không mất dữ liệu và không ảnh hưởng người dùng; sửa lúc nào cũng rẻ nên không cần mở việc riêng.
  file: `docs/adr/0030-giam-sat-doc-ban-uy-quyen-cua-kho.md`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
