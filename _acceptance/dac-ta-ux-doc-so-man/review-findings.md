# Review findings: dac-ta-ux-doc-so-man (round 1)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Khối UX-SO-MAN-S1 bảo chạy `--kiem --slug` TRƯỚC khi sinh 3 artifact, lúc contract.md chưa có, nên dòng kiểm ở S1 không bao giờ kiểm được**
  Người dùng thấy gì: Ở vòng thiết kế có màn hình, bước tự kiểm bảng trạng thái luôn báo là không kiểm được, nên lỗi lẽ ra máy tự sửa lại hiện lên thẻ duyệt cho người thấy. Người duyệt vẫn thấy được lỗi thật và vòng không bị dừng.
  Căn cứ: Hậu quả nhẹ: không mất dữ liệu, chỉ là máy bỏ lỡ một lần tự sửa và thẻ duyệt có thêm một dòng thừa mà người đọc bỏ qua được; sửa sau cũng rẻ vì chỉ đổi thứ tự bước.
  file: `plugins/feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Bộ đọc bảng trạng thái xoá trắng inline code: ô mã trạng thái viết `ST-…` trong backtick bị báo «trống»**
  Người dùng thấy gì: Nếu người viết bọc mã trạng thái trong dấu backtick thì hệ thống báo sai là ô trống dù đã điền. Người viết bỏ dấu backtick đi là hết báo.
  Căn cứ: Chỉ gây một câu báo đỏ sai trên thẻ duyệt, không mất dữ liệu, người dùng tự gỡ được bằng cách sửa lại ô rồi chạy lại; sửa sau không đắt.
  file: `plugins/acceptance-gate/scripts/so-man.cjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình / không ghim thông điệp): W1 tuyên «chạy được trên kho bỏ đi» mà chỉ đòi mã thoát 0, cũng là mã của nhánh im**
  Người dùng thấy gì: Bài kiểm tự động cho lệnh trong hướng dẫn có thể vẫn báo xanh khi lệnh trỏ sai chỗ. Người dùng cuối không bị ảnh hưởng ngay, nhưng một lỗi chép lệnh sau này có thể lọt mà không ai biết.
  Căn cứ: Không ảnh hưởng người dùng hôm nay vì sản phẩm chạy đúng; rủi ro chỉ là bỏ sót lỗi trong tương lai, và thêm kiểm chứng sau này rẻ.
  file: `tests/scripts/so-man.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính không sống): S9 có `khongDong` với số dòng 0 và mã rỗng, không bao giờ đỏ được**
  Người dùng thấy gì: Một dòng kiểm trong bài thử không có tác dụng, nhưng phần kiểm thật của ca vẫn bắt lỗi như bình thường. Người dùng không thấy khác biệt nào.
  Căn cứ: Không có hậu quả nào cho người dùng, và dòng thừa vô hại; chi phí dọn vượt xa lợi ích nên chấp nhận và ghi vết.
  file: `tests/scripts/so-man.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 5 (quét LỚP mà phép đếm không phải ma trận toàn phần): dòng «số ca chạy: 64» đếm cả id trùng, không so đúng tập ô**
  Người dùng thấy gì: Nếu có người gỡ một ca và thêm trùng ca khác thì dòng báo đủ 64 ca vẫn xanh dù thiếu một ô kiểm. Điều này chỉ xảy ra khi sửa bài thử sai cách, không ảnh hưởng người dùng sản phẩm.
  Căn cứ: Rủi ro thấp và chỉ xuất hiện khi có thao tác sửa bài thử nhầm hai lần theo kiểu đặc biệt; không mất dữ liệu và phát hiện lại được khi chạy ca theo từng ô.
  file: `tests/scripts/so-man.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
