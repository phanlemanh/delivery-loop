## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **process.exit() inside the try block skips the finally, so the temp copies are never deleted on the exit-1 and exit-3 paths**
  Người dùng thấy gì: Khi bộ kiểm tra nội bộ gặp lỗi và dừng sớm, nó để lại vài bản chép tạm trên ổ đĩa của người bảo trì. Kết quả kiểm tra vẫn đúng, người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Hậu quả rất nhẹ: chỉ tốn chút dung lượng tạm ở máy người bảo trì, không mất dữ liệu, kết quả kiểm vẫn đúng và người dùng tự xoá được; sửa không đáng công mở việc riêng.
  file: `_acceptance/chuyen-gop/rang/dot-bien.mjs`
  severity: low
  Đề xuất: wont-fix

- **chuyen-gop.mjs adds a second `gh pr merge` call site, which breaks gop.mjs's stated single-merge-point rule (r1)**
  Người dùng thấy gì: Hôm nay gộp theo chuyến và gộp từng PR đi hai đường riêng. Nếu sau này thêm một chốt chặn mới ở một đường thì đường kia có thể bỏ sót, nên PR có thể được gộp mà chưa qua chốt đó.
  Căn cứ: Hiện cả hai đường đều đã có chốt chặn nên người dùng chưa bị ảnh hưởng, rủi ro chỉ xuất hiện khi sửa về sau và sửa lúc đó rẻ.
  file: `plugins/dispatch/scripts/chuyen-gop.mjs`
  severity: medium
  Đề xuất: known-limits

- **The `chuyen` event says the tally reads it, but `dem.mjs` never does, and the event does not record which PRs were merged (r1)**
  Người dùng thấy gì: Các PR được gộp qua chuyến không hiện trong bảng đếm số lần gộp, và nhật ký không cho biết PR nào đã vào nhánh chính khi chuyến dừng giữa chừng. Người dùng phải tự xem trên GitHub.
  Căn cứ: Không làm mất dữ liệu hay gộp sai, chỉ thiếu số liệu thống kê, và người dùng tự tra được trên GitHub.
  file: `plugins/dispatch/scripts/chuyen-gop.mjs`
  severity: low
  Đề xuất: known-limits

- **README's exit-code list for `chuyen` is missing exit 4 for 'main branch moved' (r1)**
  Người dùng thấy gì: Tài liệu hướng dẫn mô tả sai ý nghĩa một mã kết quả, nên người đọc có thể chờ tới giờ khởi hành trong khi thực ra phải chạy lại chuyến ngay.
  Căn cứ: Chỉ là chữ trong tài liệu, không ảnh hưởng nhánh chính, và sửa một dòng là xong.
  file: `plugins/dispatch/README.md`
  severity: low
  Đề xuất: known-limits

- **The same rule file is read from two places: the default-sign writer reads the PR branch, the merge gate reads main (r1)**
  Người dùng thấy gì: Một PR tự thu hẹp luật tự trị có thể khiến vài câu hỏi dành riêng cho chủ kho bị bỏ qua ở bước chốt phạm vi. Cửa gộp vẫn chặn tự gộp, nhưng câu hỏi đã không được hỏi.
  Căn cứ: Việc tự gộp vẫn bị chặn nên không có gì lọt vào nhánh chính, chỉ mất một lượt hỏi chủ kho, và chủ kho vẫn thấy được ở bước sau.
  file: `plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs`
  severity: low
  Đề xuất: known-limits

- **cua-proof.mjs hard-codes the `ontology/` path from one template's vocabulary (r1)**
  Người dùng thấy gì: Kho nào tình cờ có thư mục tên đó sẽ không được tự gộp cho PR chạm vào nó, dù luật của kho không đòi vậy. Người dùng phải gộp tay những PR này.
  Căn cứ: Sai theo hướng thận trọng, chỉ làm chậm chứ không gộp nhầm, và người dùng gộp tay được.
  file: `plugins/dispatch/scripts/cua-proof.mjs`
  severity: low
  Đề xuất: known-limits

- **An invalid or unreachable --base silently turns off the vung-lech (and second vung-high) check; the item still gets mac-ky (r1)**
  Người dùng thấy gì: Nếu mốc so sánh bị gõ sai hoặc không có trong bản clone nông, việc kiểm hồ sơ có đi ngoài vùng khai báo bị tắt âm thầm và mục vẫn được mặc-ký mà không có cảnh báo nào.
  Căn cứ: Có thể để một mục lẽ ra phải hỏi người lại được mặc-ký trong im lặng, người dùng khó tự phát hiện, nhưng cửa gộp phía sau vẫn chặn tự gộp.
  file: `plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs`
  severity: medium
  Đề xuất: new-contract

- **The `chuyen` event drops which PRs were actually merged, and the counting command never reads it (r1)**
  Người dùng thấy gì: Khi chuyến dừng giữa chừng, nhật ký không cho biết chính xác PR nào đã vào nhánh chính, và các PR gộp qua chuyến không được đếm.
  Căn cứ: Chỉ thiếu dấu vết thống kê, không mất hay gộp sai gì, và người dùng tra được trên GitHub.
  file: `plugins/dispatch/scripts/chuyen-gop.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (mối nối bên ghi với bên đọc được giữ bằng khuôn viết tay trong ca): kể cả khi DB-10 tiêm đúng chỗ, ca đỏ là do lệnh dò chuỗi của hàm trợ giúp, không phải do bên đọc coMacKy (r1)**
  Người dùng thấy gì: Phép thử nối bên ghi với bên đọc có thể đỏ vì một bước kiểm phụ chứ không vì bên đọc thật sự bỏ sót, nên bằng chứng ở chỗ này yếu hơn vẻ ngoài.
  Căn cứ: Chỉ làm bằng chứng thử nghiệm yếu đi chứ không đổi hành vi người dùng gặp, và sửa sau không đắt.
  file: `tests/dieu-phoi/chuyen-gop.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (khớp chuỗi trong khi lời hứa là một quan hệ): bộ so tên ca của bộ đột biến dùng startsWith, mà tên ca của DB-9 là tiền tố của tên một ca khác (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bộ thử có thể báo đã làm đỏ đúng ca trong khi thực ra chỉ làm đỏ một ca có tên giống, nên một lỗi có thể bị đếm nhầm là đã bắt.
  Căn cứ: Chỉ là độ chính xác của phép thử, không ảnh hưởng người dùng trực tiếp, và hiện chưa có bằng chứng nó đã che lỗi nào.
  file: `_acceptance/chuyen-gop/rang/dot-bien.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3/5 (khẳng định đọc được khuôn thật bằng ngưỡng 'nhiều hơn', chỉ thử mẫu 5/16 mẫu high): ca không bắt được bộ đọc làm rơi mục (r1)**
  Người dùng thấy gì: Phép thử chỉ kiểm vài loại tệp nhạy cảm trong số mười sáu loại. Nếu bộ đọc luật làm rơi một loại khác thì PR chạm loại tệp đó có thể bị tự gộp mà không ai biết.
  Căn cứ: Có thể để lọt tự gộp ở tệp nhạy cảm nếu bộ đọc hỏng về sau, nhưng hiện chưa hỏng và thêm ca thử rẻ.
  file: `tests/dieu-phoi/chuyen-gop.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): ca chặn khi PR tự sửa luật tự trị chỉ kiểm duong === 'chan', không ghim thông điệp (r1)**
  Người dùng thấy gì: Phép thử không phân biệt được PR bị chặn vì đọc luật ở nhánh chính hay vì một lý do khác, nên bằng chứng cho chốt chặn này yếu hơn vẻ ngoài.
  Căn cứ: Hành vi chặn vẫn đúng và có đối chứng ở kho khác, chỉ là phép thử kém chặt, và sửa sau rất rẻ.
  file: `tests/dieu-phoi/chuyen-gop.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
