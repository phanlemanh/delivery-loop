## Trong hợp đồng

Không có phát hiện nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Dòng máy mặc-ký ghi `stage: gate1` nên bộ tra sổ hồ sơ trước đọc chúng thành «lời người»**
  Người dùng thấy gì: Những câu máy tự quyết thay người có thể bị các vòng sau đọc nhầm thành ý kiến người đã nói, nên máy có thể viện dẫn chính quyết định của nó như tiền lệ mà không ai nhìn.
  Căn cứ: Hậu quả khá nặng vì quyết định của máy bị coi là của người ở các vòng sau, nhưng chỉ xảy ra ở kho bật cờ mặc-ký (mặc định tắt) và sửa không đắt nên nên mở một việc riêng.
  file: `plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs`
  severity: high
  Đề xuất: new-contract

- **Từ vựng surfaces chép lại thay vì gọi bộ đọc một nguồn `lib/lop-nhin-thay.cjs`**
  Người dùng thấy gì: Hai bộ đọc cùng một trường có thể phán khác nhau về một số loại hàng, nên có hợp đồng bị cảnh báo lạ ở nơi này mà vẫn được coi là hàng máy ở nơi kia.
  Căn cứ: Hậu quả nhẹ, không mất dữ liệu và không ai bị ảnh hưởng ngay; sửa sau không đắt nên ghi lại là hạn chế đã biết.
  file: `plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs`
  severity: medium
  Đề xuất: known-limits

- **Món đã gộp bị phân loại lại theo thời gian: lời chú thích nói «giáng áp cho món chưa gộp» nhưng mã không lọc trạng thái**
  Người dùng thấy gì: Số liệu và thẻ của hồ sơ cũ đã gộp có thể đổi khi hồ sơ khác bị phủ quyết, dù bản thân hồ sơ cũ không đổi gì.
  Căn cứ: Chỉ làm số liệu lịch sử lệch chứ không ảnh hưởng sản phẩm đang chạy, người dùng tự đọc lại được; nên ghi hạn chế và sửa khi có kho bật cờ.
  file: `plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs`
  severity: medium
  Đề xuất: known-limits

- **Lược đồ sổ 2 chỉ có răng bằng lời: `--check` không được gọi ở đâu, bên đọc bỏ qua `so_do`**
  Người dùng thấy gì: Một dòng sổ gõ tay sai khuôn vẫn có thể ảnh hưởng việc thăng hay giáng loại câu mà không ai bị báo lỗi.
  Căn cứ: Hậu quả nhẹ vì dòng sai chỉ do người gõ tay và lệnh kiểm tự chạy được; cần khai rõ là giới hạn thay vì tự nhận có răng.
  file: `plugins/feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **chongVung bỏ sót chồng lấn với glob mở đầu bằng `**/`, nên kiểm vùng high, khong_bao_gio và giữ-quyền theo glob để lọt mặc-ký**
  Người dùng thấy gì: Một câu chạm vùng nhạy cảm như di chuyển dữ liệu hay xác thực vẫn có thể được máy tự đi tiếp thay vì hỏi người, và chủ kho khai giữ quyền cho vùng như thanh toán có thể bị bỏ qua mà không báo.
  Căn cứ: Hậu quả nặng vì máy tự quyết ở đúng vùng đáng ra phải hỏi người, nhưng vẫn có thẻ phủ quyết trước khi gộp và chỉ ở kho bật cờ; nên mở việc riêng sớm.
  file: `plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs`
  severity: high
  Đề xuất: new-contract

- **git diff hỏng (gốc nhánh sai hay chưa fetch) thì kiểm vung-lech và kiểm tệp tầng high bị bỏ mà không báo**
  Người dùng thấy gì: Khi gốc nhánh sai hoặc chưa tải về, việc so với tệp thật bị bỏ qua lặng lẽ nên câu có thể được tự đi tiếp mà không ai biết lưới kiểm không chạy.
  Căn cứ: Chỉ xảy ra khi cấu hình nhánh hỏng và người dùng sửa được bằng cách tải lại; hậu quả vừa phải, nên ghi lại là hạn chế đã biết.
  file: `plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs`
  severity: medium
  Đề xuất: known-limits

- **Món mặc-ký bị kiểm mẫu ra SAI vẫn được đếm là một lần hỏi và một lần «theo khuyến nghị» trong sổ đếm**
  Người dùng thấy gì: Phần trăm theo khuyến nghị mà chủ kho đọc để quyết thăng cấp có thể bị đếm cao hơn thực tế một chút.
  Căn cứ: Hậu quả nhẹ vì cửa sổ thăng cấp phần lớn không bị ảnh hưởng và chủ kho vẫn tự xem lại được; sửa sau không đắt.
  file: `plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs`
  severity: low
  Đề xuất: known-limits

- **Lệnh đếm can-cu-s1 nuốt lỗi của trợ lý quyết định, dòng tổng kết không báo gì**
  Người dùng thấy gì: Nếu trợ lý quyết định gặp lỗi, người chạy lệnh thấy kết quả bình thường và không biết mặc-ký đã tắt vì lỗi, nên mọi câu quay về hỏi người mà không có lý do.
  Căn cứ: Hậu quả nhẹ vì chiều lỗi là an toàn, chỉ khiến hỏi nhiều hơn; người dùng tự phát hiện được khi chạy lại.
  file: `plugins/acceptance-gate/scripts/can-cu-s1.cjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: tuyên quét LỚP ở danh sách cho phép surfaces backend mà chỉ có điểm-case**
  Người dùng thấy gì: Một phần danh sách loại hàng được máy tự đi tiếp không có phép kiểm giữ, nên ai đó gỡ bớt loại hàng thì bộ kiểm vẫn xanh.
  Căn cứ: Không ảnh hưởng người dùng hiện tại, chỉ làm lưới bảo vệ lỏng hơn khi sửa mã sau này; sửa rẻ nhưng không gấp.
  file: `tests/scripts/tro-ly-quyet-dinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3/5: round-trip khuôn DEC-TRO-LY-SLOT chỉ đưa lựa chọn ĐẦU của mỗi ô liệt kê qua bộ đọc, không so tập khuôn với tập của mô-đun**
  Người dùng thấy gì: Hướng dẫn trong khuôn có thể dạy máy ghi một giá trị mà bộ kiểm sẽ từ chối, mà bộ kiểm tự động vẫn báo xanh.
  Căn cứ: Hậu quả vừa, chỉ lộ khi khuôn bị sửa sai sau này và lỗi hiện ra khi chạy thật nên người dùng thử lại được; sửa rẻ.
  file: `tests/scripts/tro-ly-quyet-dinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: «SKILL liệt mọi mã của danh mục» kiểm bằng includes trên cả tệp, một chiều**
  Người dùng thấy gì: Nếu hướng dẫn thêm một loại câu mà mô-đun không biết, câu đó bị xếp vào loại lạ và luôn hỏi người mà bộ kiểm không báo.
  Căn cứ: Hậu quả nhẹ vì chỉ khiến hỏi người nhiều hơn chứ không tự quyết sai, và sửa không đắt.
  file: `tests/scripts/tro-ly-quyet-dinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3: ca AC-9 tên «bo xep the nhu cu» mà không dựng thẻ HTML, không so với bản trước vòng**
  Người dùng thấy gì: Khi tắt cờ, thẻ hiển thị có thể khác bản cũ ở vài chi tiết nhỏ mà không có phép kiểm tự động phát hiện.
  Căn cứ: Hậu quả rất nhẹ vì chỉ ảnh hưởng chi tiết hiển thị ở kho tắt cờ và người đọc thấy ngay; chi phí dựng phép so từng byte vượt lợi ích.
  file: `tests/scripts/tro-ly-quyet-dinh.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
