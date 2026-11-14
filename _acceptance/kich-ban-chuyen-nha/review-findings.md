# Review findings: kich-ban-chuyen-nha (round 3)

## Trong hợp đồng

Không có finding trong hợp đồng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **--nhanh accepts any branch name, so a run can overwrite main or chuyen-nha with update-ref and no guard**
  Người dùng thấy gì: Nếu người chạy tự gõ tên nhánh trùng nhánh chính hoặc nhánh chuyển nhà, kịch bản sẽ ghi đè nhánh đó mà không cảnh báo.
  Căn cứ: Chỉ xảy ra khi người chạy chủ động gõ sai tên nhánh, và nhánh bị ghi đè còn khôi phục được từ lịch sử nên hậu quả vừa phải.
  file: `migration/kich-ban/don-nha.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lock and temp worktrees are left behind when a measurement run is killed by a signal; the next runs wait 40 minutes and then report 'can't read here'**
  Người dùng thấy gì: Nếu một lượt đo bị ngắt giữa chừng, các lượt đo sau sẽ đứng chờ 40 phút rồi báo không đọc được, cho tới khi ai đó xoá tay thư mục khoá.
  Căn cứ: Không mất dữ liệu và người dùng tự gỡ được bằng một lệnh xoá khoá, nhưng gây mất thời gian và dễ bị hiểu nhầm là lỗi phòng đo.
  file: `migration/kich-ban/thuoc-that.mjs`
  severity: medium
  Đề xuất: known-limits

- **Red-class report does not check that both test runs finished, so a missing log reads as '0 extra red' and still passes AC-10**
  Người dùng thấy gì: Nếu một lượt chạy kiểm chết giữa chừng, báo cáo số ca đỏ thêm có thể ghi 0 và trông như sạch trong khi thực ra chưa đo được.
  Căn cứ: Số liệu sai có thể khiến chủ kho tin nhầm, nhưng chỉ khi lượt đo hỏng và chạy lại là ra số đúng.
  file: `migration/kich-ban/phan-lop.py`
  severity: medium
  Đề xuất: known-limits

- **THIET-KE promises a doi-chu.tsv log that nothing produces**
  Người dùng thấy gì: Tài liệu thiết kế hứa có một sổ ghi đổi chữ nhưng chạy bình thường không sinh ra sổ đó, người đọc tài liệu sẽ đi tìm một tệp không có.
  Căn cứ: Chỉ gây nhầm lẫn khi đọc tài liệu, không ảnh hưởng kết quả và sửa lại câu chữ rất rẻ.
  file: `migration/kich-ban/THIET-KE.md`
  severity: low
  Đề xuất: known-limits

- **thuoc-that crashes with exit 1 (red) instead of exit 2 when the kit-cu remote is missing**
  Người dùng thấy gì: Trên máy chưa có kho cũ được khai báo, lượt đo báo lỗi đỏ thay vì báo không đọc được ở đây, dễ khiến người ta tưởng sản phẩm hỏng.
  Căn cứ: Chỉ xảy ra trên máy thiếu môi trường, không mất dữ liệu, chạy lại sau khi cài đủ là hết.
  file: `migration/kich-ban/thuoc-that.mjs`
  severity: low
  Đề xuất: known-limits

- **do-lop-do.sh hardcodes the Repo Standards cache path with the short hash instead of reading khuon.ma from bang-xep.json**
  Người dùng thấy gì: Nếu sau này đổi thẻ khuôn thì lượt đo lớp đỏ vẫn trỏ khuôn cũ và chỉ dừng sau khi đã bắt đầu chạy.
  Căn cứ: Chỉ phát sinh khi đổi thẻ khuôn, kịch bản dừng có thông báo rõ nên không im lặng sai, sửa sau rẻ.
  file: `migration/kich-ban/do-lop-do.sh`
  severity: low
  Đề xuất: known-limits

- **do-lop-do.sh ignores the exit status of the background test runs, and phan-lop.py counts missing logs or ketqua.tsv as 0 red**
  Người dùng thấy gì: Nếu một lượt chạy kiểm hỏng ngầm, báo cáo lớp đỏ vẫn in ra với số 0 hoặc số thổi phồng, và báo cáo cũ đã chốt có thể bị ghi đè thành rỗng.
  Căn cứ: Dễ khiến chủ kho đọc nhầm số, nhưng chỉ khi lượt đo hỏng và chạy lại là khôi phục được báo cáo từ lịch sử.
  file: `migration/kich-ban/do-lop-do.sh`
  severity: medium
  Đề xuất: known-limits

- **thuoc-that.mjs releases its lock only in process.on('exit'); a SIGTERM or SIGINT leaves it behind and the next run waits 40 minutes, then exits 2**
  Người dùng thấy gì: Sau khi một lượt đo bị ngắt, các lượt đo kế tiếp đứng chờ 40 phút rồi báo không đọc được, nguyên nhân thật bị che.
  Căn cứ: Không mất dữ liệu, tự gỡ được bằng một lệnh xoá khoá, chỉ tốn thời gian và gây hiểu nhầm.
  file: `migration/kich-ban/thuoc-that.mjs`
  severity: medium
  Đề xuất: known-limits

- **AC-8 ignores the exit code of plugin_lint.py, so a lint crash passes as «plugin_lint không báo nguồn là cả kho»**
  Người dùng thấy gì: Nếu công cụ kiểm tra plugin tự sập, thước vẫn in rằng nó không báo lỗi, trong khi thực ra chưa kiểm được.
  Căn cứ: Chỉ xảy ra khi công cụ lint hỏng, rất hiếm với bản khuôn đã ghim, và lỗi sẽ lộ ở các thước khác.
  file: `migration/kich-ban/thuoc-that.mjs`
  severity: low
  Đề xuất: known-limits

- **quetViPhan only checks the first occurrence of each relative string on a line, and reads its context at L.indexOf(s) rather than at the match position**
  Người dùng thấy gì: Lượt quét phụ tìm con trỏ còn treo có thể bỏ sót con trỏ thứ hai khi hai con trỏ giống nhau nằm trên cùng một dòng.
  Căn cứ: Chỉ bỏ sót trong ca hiếm cùng dòng, đây là lưới phụ chứ không phải thước chính, nên hậu quả nhẹ.
  file: `migration/kich-ban/kiem-cho.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — KB-AC4 chỉ kiểm dòng «AC-4 đạt» có mặt với \d+ trong khi lời hứa là quan hệ «mọi tệp đã dời + tài liệu đã khai đều đúng luật»**
  Người dùng thấy gì: Ca kiểm của bước đối chiếu nội dung chỉ xác nhận có dòng đạt kèm một số bất kỳ, nên nếu thước bỏ sót tệp thì ca vẫn xanh.
  Căn cứ: Chỉ là độ lỏng của phép kiểm, không phải lỗi đã xảy ra, và thước chính vẫn chạy trên nguồn thật.
  file: `migration/kich-ban/don-nha.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — E7t hứa hai quan hệ (k+g = số con trỏ của sổ nguồn + ngoài sổ; danh sách B2 khớp hạt giống) mà thước chỉ in số và danh sách, không tính quan hệ nào**
  Người dùng thấy gì: Việc so danh sách con trỏ với hạt giống chỉ đọc bằng mắt được, không có mã tự kiểm.
  Căn cứ: Chủ kho vẫn tự đối chiếu được từ số và danh sách đã in, chỉ tốn công đọc.
  file: `_acceptance/kich-ban-chuyen-nha/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — KB-AC4-doc-lap là khẳng định âm-tính-một-mình: không có chiều đỏ chứng minh bộ dò bắt được một import don-nha cài vào**
  Người dùng thấy gì: Ca kiểm xác nhận thước không dùng chung mã với kịch bản có thể xanh dù bộ dò không bắt được một số kiểu nhập mã.
  Căn cứ: Rủi ro chỉ là bỏ sót một kiểu nhập mã hiếm, không ảnh hưởng người dùng và sửa rẻ khi cần.
  file: `migration/kich-ban/don-nha.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
