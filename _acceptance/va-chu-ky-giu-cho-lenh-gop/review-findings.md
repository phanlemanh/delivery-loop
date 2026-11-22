# Review findings: va-chu-ky-giu-cho-lenh-gop

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Second resolver call now shares the 'resolver exit 1 = dispatch not installed' rule, so a missing acceptance-gate gets the wrong label**
  Người dùng thấy gì: Khi thiếu gói nghiệm thu, người đọc có thể thấy dòng báo là gói điều phối chưa cài, trong khi thực ra thiếu gói kia. Lệnh gộp vẫn không chạy nên không có gì bị gộp nhầm.
  Căn cứ: Hậu quả nhẹ: chỉ nhãn lỗi sai, không gộp nhầm và không mất dữ liệu; người dùng thử lại hoặc cài đủ gói là xong.
  file: `plugins/feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **napBoDocChuKy hides the real error when the core fails to load**
  Người dùng thấy gì: Nếu bộ đọc chữ ký bị hỏng khi nạp, thông báo lỗi chỉ nói thiếu một thành phần chứ không nêu nguyên nhân thật, nên khó tìm lỗi. Việc gộp vẫn bị chặn.
  Căn cứ: Nhẹ: việc gộp vẫn bị chặn an toàn, chỉ khó chẩn đoán hơn; sửa sau rẻ và không ảnh hưởng dữ liệu.
  file: `plugins/dispatch/scripts/gop.mjs`
  severity: low
  Đề xuất: known-limits

- **Eval: the pinned message of the bang-rieng mutation does not identify the failure**
  Người dùng thấy gì: Phép thử kiểm tra việc bảng chữ ký giữ chỗ phải lấy từ một nguồn có thể báo đỏ vì lý do khác với lý do dự định. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Nhẹ: chỉ làm phép thử kém chính xác khi báo lỗi, người dùng cuối không thấy gì; sửa sau rẻ.
  file: `_acceptance/va-chu-ky-giu-cho-lenh-gop/chu-ky-giu-cho.sh`
  severity: low
  Đề xuất: known-limits

- **dispatch README still documents the `--theo-loi` command without `--loi`, which now always blocks in an installed setup**
  Người dùng thấy gì: Ai làm theo hướng dẫn trong tài liệu gói điều phối ở máy đã cài sẽ luôn bị chặn khi gộp theo lời, dù thông báo có chỉ cách sửa. Tài liệu lệch với hành vi thật.
  Căn cứ: Nhẹ: người dùng chỉ bị chặn an toàn và thông báo đã nêu cách khắc phục; không mất dữ liệu, sửa tài liệu rất rẻ.
  file: `plugins/dispatch/README.md`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình dạng 4): nhát tiêm bo-loi của chân duong-loi không ghim thông điệp đỏ**
  Người dùng thấy gì: Phép thử bắt được việc bỏ tham số trỏ tới bộ đọc chữ ký nhưng chưa chỉ rõ vì sao đỏ, nên có thể lẫn với lỗi khác của cùng ca. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Nhẹ: chỉ liên quan độ tin cậy của phép thử, không đổi hành vi cho người dùng; sửa sau rẻ.
  file: `_acceptance/va-chu-ky-giu-cho-lenh-gop/chu-ky-giu-cho.sh`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình dạng 4, mức nhẹ): chuỗi grep ở phep-cu và bang-rieng là NHÃN ca, không phải lý do đỏ**
  Người dùng thấy gì: Phép thử xác định được ca nào đỏ nhưng chưa phân biệt được lý do đỏ thật với lỗi môi trường. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Nhẹ: chỉ làm phép thử kém chính xác, người dùng không thấy; sửa sau rẻ và có thể gộp với việc rà phép thử khác.
  file: `_acceptance/va-chu-ky-giu-cho-lenh-gop/chu-ky-giu-cho.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
