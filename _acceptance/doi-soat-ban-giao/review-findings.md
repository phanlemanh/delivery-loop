# Review findings: doi-soat-ban-giao

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **In khuyen_cho with no open bàn giao, doi_soat tells the owner the bàn giao was just built when it was not**
  Người dùng thấy gì: Khi đổi sang tài khoản cũng gần hết hạn mức lúc đợt còn đang chờ các dãy báo xong, chủ kho được báo rằng bản bàn giao đã được dựng ngay lúc nối lại, trong khi thực tế chưa có bản nào. Chủ kho có thể tin sai trạng thái và bỏ qua việc bàn giao vẫn chưa xong.
  Căn cứ: Nhẹ về dữ liệu (không mất gì, nối lại lần sau sẽ ra đúng) nhưng là một dòng trạng thái sai nói thẳng với chủ kho ở đúng chỗ họ ra quyết định, và sửa rẻ.
  file: `plugins/dispatch/scripts/tiep-tuc.mjs`
  severity: medium
  Đề xuất: new-contract

- **The read-only doi_soat check runs before roiBanGiao and is not isolated, so a malformed field crashes the resume**
  Người dùng thấy gì: Nếu tệp bàn giao có một trường sai kiểu dữ liệu (ví dụ do ghi tay), lệnh nối lại sẽ báo lỗi và đợt không rời được pha bàn giao dù phần đối soát chỉ là báo cáo. Chủ kho phải tự sửa tệp rồi chạy lại.
  Căn cứ: Chỉ xảy ra khi tệp bị sửa tay sai dạng, không mất dữ liệu và chủ kho tự gỡ được bằng cách sửa tệp rồi chạy lại.
  file: `plugins/dispatch/scripts/doi-soat.mjs`
  severity: low
  Đề xuất: known-limits

- **Khuyên chờ ở pha dang-ban-giao chưa có bản mở: doi_soat khẳng định sai rằng bản bàn giao đã được dựng lúc nối lại**
  Người dùng thấy gì: Khi đợt còn chờ các dãy báo xong mà tài khoản mới cũng gần hết hạn mức, chủ kho được đọc nguyên văn một dòng nói bản bàn giao đã dựng lúc nối lại, dù không bản nào được dựng và đợt vẫn đang ở pha bàn giao. Thông tin này sai nhưng không làm mất việc nào.
  Căn cứ: Không mất dữ liệu và nối lại lần sau sẽ ra đúng, nhưng chủ kho bị báo sai trạng thái đúng lúc cần biết bàn giao đã xong chưa, và sửa rẻ.
  file: `plugins/dispatch/scripts/tiep-tuc.mjs`
  severity: medium
  Đề xuất: new-contract

- **Lỗi đọc cấu hình bị nuốt trong đối soát, hiện ra thành «nhánh chính đổi khác lịch sử»**
  Người dùng thấy gì: Khi cấu hình của đợt bị hỏng, chủ kho thấy một dòng báo nhánh chính đổi khác lịch sử trong khi nguyên nhân thật là cấu hình không đọc được. Dòng báo sai có thể làm chủ kho đi tìm lỗi ở nhầm chỗ.
  Căn cứ: Chỉ xảy ra khi cấu hình đợt đã hỏng, một tình huống hiếm và vốn đã có dấu hiệu lỗi khác; không mất dữ liệu, chủ kho tự gỡ được.
  file: `plugins/dispatch/scripts/doi-soat.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): ở DS-08 vế «không báo lệch giả» của ba hàng khoa · don · cay_ban không bao giờ đỏ được**
  Người dùng thấy gì: Ba trong năm ca kiểm tra việc không báo lệch giả khi tệp bàn giao thiếu trường vẫn xanh dù bước chống báo giả bị gỡ, nên nếu sau này có người làm hỏng chỗ đó thì kiểm tra sẽ không phát hiện. Hành vi hiện tại của sản phẩm vẫn đúng.
  Căn cứ: Không ảnh hưởng người dùng hôm nay, chỉ làm lưới an toàn mỏng hơn ở ba trường; mở vòng đo-thước-của-thước đi ngược luật chiều rộng nên ghi giới hạn và đếm ngưỡng.
  file: `tests/dieu-phoi/doi-soat-ban-giao.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
