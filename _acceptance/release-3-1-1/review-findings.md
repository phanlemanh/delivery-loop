## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **gop-thu.sh báo XANH 1/1 khi feature_loop.suite_keys rỗng: thiếu kiểm tra ở biên đọc cấu hình**
  Người dùng thấy gì: Phép thử gộp trước khi cắt mốc có thể báo xanh dù chưa chạy bài kiểm tra nào, nếu danh sách bài kiểm tra trong cấu hình bị trống hoặc sai khuôn. Người ký có thể tin nhầm là bản gộp đã qua kiểm tra.
  Căn cứ: Chỉ xảy ra khi cấu hình bị trống hoặc sai khuôn, không làm mất hay lộ dữ liệu của người dùng, và chạy lại sau khi sửa cấu hình là phát hiện được; lỗi này đã nằm trong sổ giới hạn của vòng.
  file: `_acceptance/release-3-1-1/gop-thu.sh`
  severity: medium
  Đề xuất: known-limits

- **do-dong-1.sh writes a believable «0 g 00» and exits 0 when a time can't be parsed**
  Người dùng thấy gì: Khi công cụ đo thời gian ký đến gộp không đọc được một mốc giờ, nó vẫn in ra «0 giờ 00» như một kết quả thật và báo thành công. Con số sai ấy có thể lọt vào ghi chú phát hành mà không ai biết.
  Căn cứ: Chỉ xảy ra trên máy thiếu công cụ ngày giờ của macOS hoặc với giờ định dạng lạ, và số liệu sai chỉ nằm trong ghi chú nội bộ của mốc, người dùng cuối không bị ảnh hưởng; đối chiếu lại với lịch sử là phát hiện và sửa được.
  file: `_acceptance/release-3-1-1/do-dong-1.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (một kết luận đứng một mình, không đối chứng dương): gop-thu.sh báo XANH khi danh sách suite rỗng, không phân biệt được «mọi lệnh xanh» với «không lệnh nào chạy»**
  Người dùng thấy gì: Phép thử gộp có thể ghi «xanh» trong khi thực ra không có bài kiểm tra nào chạy, nên người đọc thẻ bằng chứng không phân biệt được hai tình huống này.
  Căn cứ: Hậu quả chỉ là một dòng xanh đáng tin hơn thực tế ở bước kiểm phụ ngoài lượt chấm chính, không làm hỏng dữ liệu người dùng; ghi thành giới hạn đã biết là đủ vì đã có sẵn trong sổ.
  file: `_acceptance/release-3-1-1/gop-thu.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên đủ cả lớp mà không có ma trận viết trước): gop-thu.sh lấy số lệnh ĐÃ CHẠY làm mẫu số «i/i», không lấy độ dài suite_keys**
  Người dùng thấy gì: Phép thử gộp có thể chạy thiếu một số bài kiểm tra mà vẫn báo «đủ, tất cả xanh», vì nó đếm số bài đã chạy thay vì số bài phải chạy.
  Căn cứ: Chỉ xảy ra khi một bài kiểm tra tự nuốt dữ liệu đầu vào làm vòng chạy dừng sớm, hiếm gặp và không ảnh hưởng dữ liệu người dùng; bộ kiểm chính của lượt chấm vẫn chạy đủ nên sửa sau không đắt.
  file: `_acceptance/release-3-1-1/gop-thu.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
