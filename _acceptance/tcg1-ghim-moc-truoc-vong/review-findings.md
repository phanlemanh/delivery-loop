# Review findings: tcg1-ghim-moc-truoc-vong

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Răng chấp nhận ca bị bỏ qua là xanh: co_ok khớp cả dòng «ok N - TCG-1 # SKIP», và phép kiểm skip/todo không bao giờ khớp**
  Người dùng thấy gì: Nếu sau này ai đó đổi hai ca kiểm tra này thành «bỏ qua», phép chấm vẫn báo xanh dù thực tế chúng không chạy. Hôm nay chưa ca nào bị bỏ qua nên kết quả hiện tại vẫn đúng.
  Căn cứ: Hậu quả chỉ xảy ra nếu có người cố ý tắt ca, hôm nay chưa có, và nếu xảy ra thì dễ thấy khi đọc lịch sử; ghi lại giới hạn là đủ.
  file: `_acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh`
  severity: medium
  Đề xuất: known-limits

- **Hợp đồng tự mâu thuẫn về phạm vi: OOS nói không đổi byte nào ngoài tests/scripts/ và thư mục hồ sơ, trong khi AC-5 giao một tệp ở docs/plans/**
  Người dùng thấy gì: Câu khai phạm vi nói vòng này chỉ đụng vài thư mục, nhưng thực tế còn có thêm vài tài liệu. Người ký có thể hiểu nhầm phạm vi thay đổi, dù các tệp thêm đều là tài liệu, không đổi hành vi.
  Căn cứ: Chỉ là câu chữ gây hiểu nhầm nhẹ, không ảnh hưởng hành vi của sản phẩm và sửa sau rất rẻ.
  file: `_acceptance/tcg1-ghim-moc-truoc-vong/contract.md`
  severity: low
  Đề xuất: known-limits

- **Văn eval E5 lệch khỏi răng: eval nói chiều đỏ dời tham chiếu sang «dòng 1», còn do.sh dời sang dòng 4 (+7 mỗi bước)**
  Người dùng thấy gì: Mô tả trong tệp kiểm thử nói một con số hơi khác với cách phép kiểm thực sự chạy. Kết quả kiểm vẫn đúng, chỉ là phần mô tả lệch.
  Căn cứ: Chỉ lệch chữ mô tả, không đổi kết quả chấm hay trải nghiệm của ai, nên không đáng mở thêm việc.
  file: `_acceptance/tcg1-ghim-moc-truoc-vong/evals.yaml`
  severity: low
  Đề xuất: wont-fix

- **Cây PR của răng hỏng khi đầu nhánh chính đã đi trước HEAD: E1/E2 đỏ «quan he ref sai» dù vật không đổi**
  Người dùng thấy gì: Chấm lại hồ sơ này sau khi nhánh chính đã có thêm thay đổi khác có thể báo đỏ giả dù sản phẩm không đổi. Hôm nay chấm xanh, nhưng người chấm lại sau này có thể gặp báo đỏ khó hiểu.
  Căn cứ: Báo đỏ giả chỉ làm mất thời gian điều tra khi chấm lại, không gây mất dữ liệu hay lỗi cho người dùng; chấm lại đúng thời điểm vẫn xanh.
  file: `_acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh`
  severity: medium
  Đề xuất: known-limits

- **co_ok nhận cả dòng TAP «ok … # SKIP», còn phép kiểm skip/todo của nhóm vang chỉ soi lượt chạy cuối (c)**
  Người dùng thấy gì: Phép chấm không phân biệt được ca chạy và qua với ca bị bỏ qua ở một số lượt. Hôm nay chưa ca nào bị bỏ qua nên kết quả chưa sai.
  Căn cứ: Rủi ro chỉ xuất hiện khi có người tắt ca, hôm nay chưa có và dễ thấy trong lịch sử; ghi giới hạn là đủ.
  file: `_acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh`
  severity: low
  Đề xuất: known-limits

- **Shape 3 + shape 5 (assert that a string is present, where AC-5 promises a relation; claims a class sweep but has no pre-written matrix): the AC-5 tooth only checks that ≥14 references sit next to a 'merge-base/origin/main' string, not that they are the 14 same-class cases**
  Người dùng thấy gì: Phép kiểm danh sách các ca cùng lớp chỉ xác nhận có đủ số tham chiếu nằm gần các chuỗi mốc, chưa chứng minh từng tham chiếu đúng ca. Danh sách có thể sai mà vẫn qua.
  Căn cứ: Danh sách này chỉ là sổ ghi việc cho sau, không ảnh hưởng người dùng, và sai chỉ làm người sửa sau mất công tra lại.
  file: `_acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh`
  severity: medium
  Đề xuất: known-limits

- **Shape 1 (measures the declaration instead of the output): 'the baseline both cases use is the pinned commit' is checked by grepping the constant declaration, not the value the test actually used**
  Người dùng thấy gì: Phép kiểm xác nhận mốc cố định bằng cách đọc dòng khai báo chứ không đo giá trị thực dùng khi chạy. Nếu sau này mã đổi sang dùng mốc khác mà dòng khai báo còn nguyên, phép kiểm vẫn báo xanh.
  Căn cứ: Chỉ xảy ra khi mã bị sửa sai sau này, hôm nay mã dùng đúng mốc; lỗi dễ thấy khi đọc mã và sửa rẻ.
  file: `_acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh`
  severity: low
  Đề xuất: known-limits

- **Shape 5 (claim covers several points but only one is checked): E3's 'no case is skip/todo' is only checked on run (c); run (a) and every co_ok call count 'ok … # SKIP' as green**
  Người dùng thấy gì: Lời hứa «không ca nào bị bỏ qua» chỉ được kiểm ở một lượt chạy. Một ca bị tắt ở lượt khác vẫn được tính là xanh.
  Căn cứ: Rủi ro chỉ có khi ai đó cố ý tắt ca, hôm nay chưa xảy ra; đã ghi là giới hạn chung với các finding cùng lớp.
  file: `_acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
