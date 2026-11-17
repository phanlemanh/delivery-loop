# Review findings: release-3-0-0 (round 2)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Chú thích nhóm khoá rel300_* vẫn ghi «Năm khoá» trong khi vòng này thêm khoá thứ bảy**
  Người dùng thấy gì: Một dòng ghi chú trong tệp cấu hình đếm sai số khoá, nên người đọc có thể hiểu nhầm số khoá cố ý đứng ngoài lượt chấm. Kết quả chạy không bị ảnh hưởng.
  Căn cứ: Hậu quả rất nhẹ vì chỉ là chữ chú thích, không làm mất hay sai dữ liệu nào, người đọc tự đối chiếu được ngay, và sửa lúc nào cũng rẻ.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: wont-fix

- **E12 khai `paths` hẹp hơn những gì kiem-ban-cai.ca.mjs thật sự chạy, nên lượt sau có thể mang màu xanh cũ sang mà không chạy lại**
  Người dùng thấy gì: Ở các lượt chấm sau, một thay đổi làm hỏng bộ kiểm bản cài có thể không bị chạy lại, nên kết quả vẫn hiện xanh dù thực tế đã đỏ. Lượt này không bị ảnh hưởng vì kiểm bản cài đã chạy trọn và đạt.
  Căn cứ: Chỉ có thể làm lượt sau báo xanh nhầm, không làm mất dữ liệu hay hỏng bản đã phát hành; khai thành giới hạn đã biết là đủ vì lượt chấm đầy đủ trước khi cắt mốc vẫn chạy lại, và sửa sau rẻ.
  file: `_acceptance/release-3-0-0/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (chỉ thấy một vế trong khi lời hứa là quan hệ): KB-13 giờ tiêm vào tệp mà cả chế độ nghiêm lẫn --may đều báo ĐỎ, nên không còn phân biệt được hai chế độ**
  Người dùng thấy gì: Một ca kiểm không còn chứng minh được sự khác nhau giữa chế độ nghiêm và chế độ khoan dung của bước kiểm bản cài. Nếu chế độ nghiêm sau này vô tình bớt chặt, ca này sẽ không báo.
  Căn cứ: Hậu quả chỉ là một phép kiểm yếu đi, bản phát hành hiện tại vẫn đúng và người dùng không mất gì; khai giới hạn là hợp lý và dựng lại ca kiểm sau không đắt.
  file: `tests/scripts/kiem-ban-cai.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **P196 compares against an old-layout path on origin/main, so the version-per-hash check stops running after the cutover (r1 · tệp đã đổi)**
  Người dùng thấy gì: Sau khi mốc gộp vào nhánh chính, một phép kiểm báo đổi nội dung gói đồ họa mà quên nâng số phiên bản sẽ âm thầm ngừng chạy nhưng vẫn báo xanh. Người dùng có thể nhận bản đổi nội dung mà số phiên bản không đổi.
  Căn cứ: Hậu quả vừa phải và đến muộn: một lưới an toàn tự tắt mà không ai biết, nhưng không mất dữ liệu và chỉ lộ khi có lần đổi gói đồ họa sau này; sửa lúc này rẻ, để lâu mới khó thấy.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: new-contract

- **GUIDE's version line says "dieu-phoi 3.0.0", but at 3.0.0 the plugin is named dispatch with no old-name alias, and P200 enforces the old name (r1)**
  Người dùng thấy gì: Tài liệu hướng dẫn nêu tên gói điều phối theo tên cũ ở dòng khớp phiên bản. Người đối chiếu bản cài với tài liệu có thể tìm nhầm tên, nhưng số phiên bản vẫn đúng.
  Căn cứ: Chỉ là nhãn tên cũ trong một dòng tài liệu, gây nhầm lẫn nhẹ, người đọc tự đối chiếu được; chủ kho đã khai giữ nhãn này có chủ đích.
  file: `GUIDE.md`
  severity: medium
  Đề xuất: known-limits

- **AC-8's doc check misses dead paths in inline commands; README and GUIDE still point at the old `feature-loop/scripts/...` root (r1)**
  Người dùng thấy gì: Một vài lệnh trong tài liệu cài đặt vẫn chỉ vào thư mục theo cách cũ. Kho tiêu thụ làm đúng từng chữ có thể gặp lệnh báo không tìm thấy tệp.
  Căn cứ: Người dùng gặp lỗi rõ ràng, không mất dữ liệu, và tự sửa được bằng cách thêm tiền tố thư mục mới; sửa tài liệu rẻ nên nên ghi rõ giới hạn và gom vào đợt tới.
  file: `README.md`
  severity: medium
  Đề xuất: known-limits

- **diagram-design manifest still says its version follows the skill's metadata.version, but it was bumped to 3.0.0 while the skill and NOTICE remain 2.7.1 (r1)**
  Người dùng thấy gì: Mô tả hiển thị trên chợ của gói đồ họa còn nói số phiên bản đi theo kỹ năng bên trong, trái với số 3.0.0 mới. Người đọc có thể hiểu sai quy tắc đặt số.
  Căn cứ: Chỉ là một câu mô tả lệch, không ảnh hưởng chạy hay dữ liệu, sửa sau rất rẻ.
  file: `plugins/diagram-design/.claude-plugin/plugin.json`
  severity: low
  Đề xuất: known-limits

- **VI_PHAN_AN_TEN only hides names in tu-kiem; vi-phan.mjs still prints the consumer repo's record names on failure paths (r1)**
  Người dùng thấy gì: Khi phép so hai kho phát hiện lệch, tên hồ sơ của kho riêng tư có thể hiện ra trong nhật ký chạy, dù tài liệu hứa che. Nếu kho công khai và nhật ký được chia sẻ thì tên nội bộ lộ ra.
  Căn cứ: Chỉ lộ tên hồ sơ (không phải nội dung) và chỉ khi có lệch; nhật ký chạy cục bộ, người dùng kiểm soát việc chia sẻ.
  file: `_acceptance/release-3-0-0/vi-phan-hai-kho.sh`
  severity: low
  Đề xuất: known-limits

- **config.yaml comment says "Năm khoá rel300_*" but six keys are declared (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một dòng chú thích trong cấu hình ghi năm khoá trong khi có sáu. Không ảnh hưởng gì tới người dùng.
  Căn cứ: Sai số chữ trong chú thích, không đổi hành vi, không đáng mở việc riêng.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: wont-fix

- **KB-5 «hook-goi» still mutates the old root path hooks/hooks.json, so the full kiem-ban-cai run crashes with ENOENT (r1 · tệp đã đổi)**
  Người dùng thấy gì: Lượt kiểm đầy đủ bản cài sau phát hành có thể sập giữa chừng và không in kết luận. Người dùng sẽ không có phép kiểm này để tin bản cài ở các đợt sau.
  Căn cứ: Phép kiểm sập thì lộ ngay, không mất dữ liệu hay âm thầm xanh, nhưng làm mất một lưới kiểm sau phát hành đến khi sửa; sửa rất rẻ.
  file: `tests/scripts/kiem-ban-cai.ca.mjs`
  severity: medium
  Đề xuất: new-contract

- **P196 «version follows hash» check reads origin/main at the old layout; after cut-over it silently turns itself off (r1 · tệp đã đổi)**
  Người dùng thấy gì: Sau khi mốc gộp, phép kiểm bắt việc đổi nội dung gói đồ họa mà không nâng số phiên bản sẽ âm thầm tự tắt mà vẫn báo xanh. Một bản đổi nội dung có thể lọt ra với số cũ.
  Căn cứ: Lưới an toàn tự tắt không báo là hại vừa, hiện muộn và không mất dữ liệu; sửa bây giờ rẻ hơn nhiều so với tìm ra sau này.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: new-contract

- **vi-phan-hai-kho.sh promises to hide consumer record names, but vi-phan.mjs ignores VI_PHAN_AN_TEN and prints them in LỆCH lines (r1)**
  Người dùng thấy gì: Khi phép so hai kho gặp lệch, tên hồ sơ của hai kho riêng tư hiện trong nhật ký dù tài liệu hứa che. Nhật ký bị chia sẻ thì tên nội bộ lộ.
  Căn cứ: Chỉ lộ tên hồ sơ, chỉ trên đường lỗi, và nhật ký ở máy chủ kho; ghi giới hạn là đủ.
  file: `_acceptance/release-3-0-0/vi-phan-hai-kho.sh`
  severity: low
  Đề xuất: known-limits

- **diagram-design plugin.json moves to 3.0.0 but the description still says the version follows the skill's metadata.version (r1)**
  Người dùng thấy gì: Mô tả của gói đồ họa trên chợ nói sai quy tắc đặt số. Người bảo trì làm theo có thể hạ số phiên bản về 2.7.1 nhầm.
  Căn cứ: Hậu quả chỉ xảy ra nếu có người làm theo câu mô tả sai, và hạ số dễ phát hiện và đảo; sửa rất rẻ.
  file: `plugins/diagram-design/.claude-plugin/plugin.json`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (chuỗi có mặt thay vì QUAN HỆ): vi-phan-hai-kho.sh coi '0 lệch' là đạt mà không kiểm số hồ sơ OK > 0 mà E5 hứa (r1)**
  Người dùng thấy gì: Phép so hai kho có thể báo đạt dù cả hai bên không chấm được hồ sơ nào. Người ký có thể tin là đã so mà thực ra chưa so gì.
  Căn cứ: Chỉ xảy ra khi cả hai kho chấm 0 hồ sơ, điều khó xảy ra với kho thật và người ký thấy số trong đầu ra; nên ghi giới hạn.
  file: `_acceptance/release-3-0-0/vi-phan-hai-kho.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (chuỗi có mặt thay vì QUAN HỆ) và nhánh đọc-cũ không có ca: E7/KB-9 không phân biệt được 'đọc được số khác nhau' với 'không đọc được số' (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu nhánh đọc số phiên bản theo bố cục cũ hỏng, lượt kiểm vẫn xanh vì nó rơi về chạy trọn. Người dùng không bị hại, chỉ là kiểm chặt hơn cần thiết.
  Căn cứ: Lỗi nghiêng về phía chặt hơn, không bỏ sót vi phạm và không mất dữ liệu; chấp nhận ghi giới hạn.
  file: `tests/scripts/kiem-ban-cai.ca.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
