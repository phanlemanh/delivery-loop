## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E9/AC-9 cài thử HEAD (đã gộp PR #27), không cài commit mốc 1193bc22 mà thẻ v3.1.1 sẽ gắn vào**
  Người dùng thấy gì: Lần cài thử trước khi phát hành kiểm một bản hơi khác bản mà kho nhận sẽ thật sự cài theo thẻ. Hiện hai bản trùng nhau ở phần mã cài, nên chưa ảnh hưởng ai.
  Căn cứ: Hiện hai bản giống nhau ở phần người dùng nhận nên hậu quả gần như không có, và chỉ cần ghi lại là đủ.
  file: `_acceptance/release-3-1-1/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **`--dinh-moc` tin dòng sha trong dinh-moc.txt mà chỉ kiểm nó có phải một commit**
  Người dùng thấy gì: Nếu ai đó sửa tay dòng ghi mốc thành một bản khác, các kiểm tra phát hành vẫn có thể xanh dù đo nhầm bản. Hôm nay mốc ghi đúng nên bản phát hành không bị sai.
  Căn cứ: Chỉ sai khi có người sửa nhầm tay, và người phát hành thấy được khi gắn thẻ nên rủi ro thấp, nhưng nên ghi lại để lần sau biết.
  file: `_acceptance/release-3-1-1/chay.sh`
  severity: medium
  Đề xuất: known-limits

- **gop-thu.sh hiểu đường dẫn tương đối <thư mục ra> theo hai gốc khác nhau**
  Người dùng thấy gì: Nếu chạy công cụ rà gộp thử từ thư mục lạ với đường dẫn tương đối, nó báo nhầm là có xung đột. Người chạy chỉ cần chạy lại từ đúng chỗ.
  Căn cứ: Chỉ gây báo đỏ nhầm trong tình huống hiếm, thử lại là hết, và không ảnh hưởng người dùng cuối nên sửa không đáng công.
  file: `_acceptance/release-3-1-1/gop-thu.sh`
  severity: low
  Đề xuất: wont-fix

- **Lệnh hồ sơ không dọn sạch khi bị ngắt, và do-dong-1.sh chỉ chạy được với `date` của BSD**
  Người dùng thấy gì: Khi bị ngắt giữa chừng, công cụ có thể để lại thư mục tạm. Công cụ đo thời gian chỉ đúng trên máy Mac, trên máy khác có thể in số phút sai mà không báo lỗi.
  Căn cứ: Không mất dữ liệu của người dùng, nhưng số sai âm thầm trên máy khác có thể đánh lừa người đọc, nên cần ghi rõ giới hạn.
  file: `_acceptance/release-3-1-1/chay.sh`
  severity: low
  Đề xuất: known-limits

- **gop-thu.sh báo «XANH: 1/1» khi feature_loop.suite_keys rỗng hoặc thiếu khoá: không lệnh nào chạy mà vẫn xanh**
  Người dùng thấy gì: Khi danh sách kiểm tra bị cấu hình thiếu, công cụ rà gộp thử vẫn báo xanh dù không kiểm gì, và người ký có thể tin nhầm. Hôm nay cấu hình đủ nên chưa xảy ra.
  Căn cứ: Gây an tâm giả nhưng chỉ khi cấu hình hỏng, và các kiểm tra chính của lượt chấm vẫn chạy riêng nên rủi ro vừa phải.
  file: `_acceptance/release-3-1-1/gop-thu.sh`
  severity: medium
  Đề xuất: known-limits

- **gop-thu.sh với thư mục ra tương đối: cây gộp thử được tạo dưới GOC, nhưng các lệnh sau lại tìm nó từ cwd**
  Người dùng thấy gì: Chạy công cụ rà gộp thử từ thư mục khác với đường dẫn tương đối sẽ báo đỏ nhầm là xung đột. Chạy lại đúng chỗ là hết.
  Căn cứ: Chỉ là báo nhầm hiếm gặp, tự thử lại được, không đụng đến sản phẩm giao cho người dùng.
  file: `_acceptance/release-3-1-1/gop-thu.sh`
  severity: low
  Đề xuất: wont-fix

- **`--dinh-moc` kiểm một sha ghi tay trong dinh-moc.txt, không kiểm thẻ v3.1.1, trong khi E7 lại xưng «thẻ mang đúng bản vá»**
  Người dùng thấy gì: Kết luận xanh nói về thẻ phát hành nhưng thực ra chỉ kiểm bản ghi tay, nên nếu thẻ gắn lệch thì không ai phát hiện. Người phát hành cần tự đối chiếu khi gắn thẻ.
  Căn cứ: Gắn thẻ lệch sẽ đưa kho nhận một bản không thuần bản vá, khó thu hồi sau khi đã cài, nên cần người gắn thẻ kiểm tay.
  file: `_acceptance/release-3-1-1/chay.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP «hồ sơ ĐƯỢC KÝ» mà chỉ đo một phần tử): E3/cua-so chỉ nhận `signed-off`, bỏ sót `machine-cleared` và `da-cham-boi-thuc-te`**
  Người dùng thấy gì: Ghi chú phát hành có thể thiếu một hồ sơ đã ký theo kiểu khác mà phép kiểm vẫn báo khớp. Ở bản này cả hai hồ sơ đều được nhận đúng nên chưa thiếu gì.
  Căn cứ: Chỉ làm ghi chú thay đổi thiếu một mục ở các mốc sau, người đọc vẫn tra được từ lịch sử nên hậu quả nhẹ.
  file: `_acceptance/release-2-39-0/cua-so.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 (đo vật khác cây đang kiểm): E3–E7 đo một sha tự ghi tay ở dinh-moc.txt, chỉ kiểm sha có tồn tại, không kiểm nó gắn với HEAD hay với thẻ**
  Người dùng thấy gì: Các kiểm tra mốc và các kiểm tra bản hiện tại có thể đo hai bản khác nhau mà không ai biết nếu dòng ghi mốc bị đổi. Hôm nay hai bản liền kề và khớp nhau.
  Căn cứ: Rủi ro chỉ xảy ra khi ghi sai mốc, hiện đã khớp, và người phát hành đối chiếu được trước khi gắn thẻ.
  file: `_acceptance/release-3-1-1/chay.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (lời hứa là QUAN HỆ với số mốc, phép đo chỉ thấy nhất quán nội bộ): E1 hứa «năm gói lõi mang số 3.1.1» nhưng P200 không ghim số**
  Người dùng thấy gì: Kiểm tra số phiên bản chỉ bảo đảm các gói cùng một số, chứ không bảo đảm đó đúng là 3.1.1. Người phát hành cần tự nhìn số khi cắt mốc.
  Căn cứ: Gắn nhầm số sẽ lộ ngay ở thẻ và ghi chú phát hành, người ký thấy được, nên hậu quả nhẹ và dễ sửa trước khi phát hành.
  file: `_acceptance/release-3-1-1/evals.yaml`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
