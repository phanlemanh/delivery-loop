## Trong hợp đồng

- **AC-10: thước dựng lại cây trên nguồn của báo cáo chứ không trên nguồn lúc chấm, nên báo cáo cũ vẫn qua**
  AC: AC-10
  file: migration/kich-ban/lop-do.mjs:44
  severity: medium
  source: conventions
  detail: Hợp đồng AC-10 đòi «mã cây ghi trong báo cáo bằng mã cây kịch bản dựng trên nguồn lúc chấm, nếu không thước đỏ «báo cáo lớp đỏ đo trên cây cũ»». Phần Context của hợp đồng định nghĩa «Nguồn thật» là `kit-cu/main` lúc chạy. kiemLopDo lại chỉ in một dòng thông tin khi `k.fm.nguon !== S` (dòng 43), rồi dựng lại cây bằng `donNha(nhanh, k.fm.nguon)`, tức là trên nguồn mà chính báo cáo tự khai (dòng 44). Hệ quả: khi `kit-cu/main` đi tiếp, một báo cáo đo trên cây cũ không bao giờ đỏ, vì nó luôn khớp với cây dựng từ nguồn cũ của chính nó. Thông điệp «đo trên cây cũ» chỉ còn bắt được trường hợp kịch bản không tất định. evals.yaml E10 đã viết lại luật này thành «thông tin, không đỏ», nên eval lệch hợp đồng đã ký (cạnh Hạng mục↔Thước), và không có dòng decisions.jsonl nào ghi chuyện đổi này. Hôm nay `kit-cu/main` = `0c4e503b` = nguồn của báo cáo, nên lượt chấm hiện tại không thấy lệch.

- **Chiều đỏ «báo cáo lớp đỏ đo trên cây cũ» của AC-10 không có ca nào chạy**
  AC: AC-10
  file: migration/kich-ban/don-nha.test.mjs:394
  severity: medium
  source: conventions
  detail: Hợp đồng và E10 khai chiều đỏ «`cay_moi` lệch cây dựng lại → đỏ «báo cáo lớp đỏ đo trên cây cũ»» (lop-do.mjs dòng 46). Tệp kiểm chỉ chạy `kiemSoLieu`, tức phần số học: KB-AC10-phan-lop và KB-AC10-do-so-hoc. Không ca fixture nào gọi `kiemLopDo` với một `cay_moi` sai, và E10 chỉ chạy trên nguồn thật, nơi cây đang khớp. Vậy nhánh đỏ này chưa từng chạy. Điều này trái bất biến CLAUDE.md «màu xanh phải từng chạy chiều đỏ» và «thước phải gắn vào vật được giao». kiemLopDo nhận `donNha` qua tham số, nên tiêm một hàm giả trả về một cây khác trên fixture là rẻ.

- **E9 khai cả ba ca đỏ của AC-9 giữ nguyên nhánh cũ, nhưng chỉ ca khuôn kiểm điều đó**
  AC: AC-9
  file: _acceptance/kich-ban-chuyen-nha/evals.yaml
  severity: medium
  source: conventions
  detail: E9 ghi: «Cả ba ca đỏ chạy lại sau khi nhánh đã có từ lần lành: nhánh giữ đúng mã cũ». AC-9 cũng đòi «KHÔNG tạo hay ĐỔI nhánh đích». Trong don-nha.test.mjs chỉ KB-AC9-khuon (dòng 342–353) chạy lành trước, rồi chạy đỏ và so `rev` trước/sau. KB-AC9-thu-muc (dòng 169) và KB-AC9-luat (dòng 255) chỉ kiểm `!coRef(...)` trên kho trống nhánh, tức vế «không tạo»; vế «không đổi» của hai ca (a) và (b) không được đo. Lượt chấm đọc `ok` của E9 sẽ tin cả ba ca đã được kiểm, trong khi hai ca chưa.

- **Con trỏ tương đối `../docs/...` bị đổi thành link hỏng `../https://...`, và thước độc lập vẫn chấm xanh**
  AC: AC-7
  file: migration/kich-ban/don-nha.mjs:198
  severity: high
  source: bugs
  detail: Regex con trỏ ở bước 4 là `(?<![\w.-])(?<!\w\/)(?:\.\/)?<toi>(?![\w/-])`. Nó chặn trường hợp ký tự đứng trước là `\w/`, nhưng KHÔNG chặn `../`: ký tự liền trước `docs` là `/`, còn hai ký tự liền trước là `./`, mà `.` không thuộc \w. Vì vậy với một liên kết tương đối mà kiemKe đã chuẩn hoá thành `docs/...`, kịch bản chỉ thay phần đuôi và giữ lại tiền tố `../`. Đã xác nhận trên nhánh dựng thật: `git grep` trên don-nha/3.0 ra plugins/acceptance-gate/evals/README.md:13 có `](../https://github.com/phanlemanh/acceptance-gate-kit/blob/0c4e503b.../docs/findings/2026-08-30-ra-soat-tinh-nang-moi-anthropic.md)`. Nguồn ở kit-cu/main:evals/README.md:13 là `](../docs/findings/...)`. Link này giải thành plugins/acceptance-gate/https:/github.com/..., tức là hỏng. Thước kiem-cho.mjs nói là 'cài lại độc lập' nhưng dùng đúng regex ấy (reConTro, kiem-cho.mjs:160). Nên AC-4 tính ra cùng chữ (ky === sb) và AC-7 quét lại cũng không thấy treo. Lỗi đi qua cả hai thước mà không ai báo. Cách sửa: khớp và thay luôn cả tiền tố `(?:\.\.\/)+` (hoặc dựa vào vị trí/chữ gốc mà kiemKe ghi), rồi thêm ca đỏ có `../docs/x.md` trong fixture.

- **Hình dạng 5 (tuyên quét LỚP, chỉ có điểm-case): E9 hứa cả ba ca đỏ chạy lại khi nhánh đã có thì giữ mã cũ, nhưng chỉ KB-AC9-khuon đo điều đó**
  AC: AC-9
  file: migration/kich-ban/don-nha.test.mjs:169
  severity: medium
  source: measurement
  detail: evals.yaml E9 (dòng 181-182) viết: «Cả ba ca đỏ chạy lại sau khi nhánh đã có từ lần lành: nhánh giữ đúng mã cũ». Trong tệp kiểm chỉ KB-AC9-khuon (dòng 348-351) chạy một lượt lành trước, rồi chạy lại ca đỏ và so `rev(...) === truoc`. KB-AC9-thu-muc (dòng 169-175) và KB-AC9-luat (dòng 255-264) chỉ chạy trên fixture mới tinh rồi assert `!coRef(...)`, tức nhánh chưa từng có. Hai ca này không bao giờ đi qua đường «nhánh đích đã có, lượt đỏ không được đè». Nếu kịch bản ghi ref trước bước kiểm thư mục gốc hoặc kiểm luật, nó vẫn qua hai ca này. Lời hứa bao cả lớp ba ca đỏ, còn phép đo chỉ có một điểm. Không có ma trận ba ca × «nhánh đã có» viết trước.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Khoá thuoc-that.lock không được nhả khi tiến trình bị ngắt bằng tín hiệu, lượt chấm sau treo 40 phút rồi thoát 2**
  Người dùng thấy gì: Nếu một lượt chấm bị cắt ngang giữa chừng, các lượt chấm sau trên cùng kho sẽ đứng chờ gần một tiếng rồi báo không đọc được, và chủ kho phải tự xoá dấu khoá. Kết quả không sai, chỉ mất thời gian.
  Căn cứ: Chỉ xảy ra khi lượt chấm bị ngắt bất thường, không làm mất hay sai dữ liệu, và chủ kho tự gỡ được bằng cách xoá thư mục khoá.
  file: `migration/kich-ban/thuoc-that.mjs`
  severity: medium
  Đề xuất: known-limits

- **do-lop-do.sh ghi cứng mã Repo Standards thay vì đọc từ bảng xếp, và cắt cụt báo cáo đang commit nếu phan-lop.py lỗi**
  Người dùng thấy gì: Khi lượt đo lớp đỏ hỏng giữa chừng, báo cáo đã commit có thể bị ghi đè dở dang. Đổi thẻ khuôn thì phải sửa hai chỗ.
  Căn cứ: Báo cáo lấy lại được từ lịch sử kho và chạy lại được, lỗi hiện ra rõ ràng, nên chi phí sửa không đáng so với hậu quả.
  file: `migration/kich-ban/do-lop-do.sh`
  severity: low
  Đề xuất: wont-fix

- **chupKho ném lỗi khi HEAD tách rời, thuoc-that đổ vỡ thay vì báo lỗi có tên**
  Người dùng thấy gì: Nếu kho chấm đang ở trạng thái không thuộc nhánh nào, các thước trên nguồn thật sẽ sập kèm thông báo lỗi dài khó đọc thay vì một dòng giải thích.
  Căn cứ: Chỉ làm lượt chấm dừng sớm với lỗi ồn ào, không sai kết quả hay mất dữ liệu, và người dùng chuyển sang một nhánh rồi chạy lại là xong.
  file: `migration/kich-ban/kiem-cho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Khoá thuoc-that.lock kẹt lại khi tiến trình bị tín hiệu giết; catch nuốt mọi lỗi mkdir; 40 phút sau báo nhầm thành 'không đọc được ở đây'**
  Người dùng thấy gì: Lượt chấm bị ngắt có thể để lại khoá, và các lượt sau chờ rất lâu rồi báo nhầm là không đọc được. Lỗi quyền hoặc đường dẫn sai cũng bị coi như đang có người giữ khoá.
  Căn cứ: Chỉ gây chờ lâu và báo sai nguyên nhân trong tình huống hiếm, không mất dữ liệu, và gỡ khoá tay là chạy lại được.
  file: `migration/kich-ban/thuoc-that.mjs`
  severity: medium
  Đề xuất: known-limits

- **phan-lop tính 'bo-chay' vào «đỏ thêm» mà không so với cây cũ; thiếu nhật ký cây cũ thì coi như 0 ca đỏ**
  Người dùng thấy gì: Trong vài tình huống hiếm, báo cáo lớp đỏ có thể quy nhầm ca đã đỏ sẵn từ trước cho việc đổi bố cục, làm số đo vòng sau hơi cao.
  Căn cứ: Báo cáo hiện tại không bị ảnh hưởng, lỗi chỉ lệch số đo chứ không làm hỏng sản phẩm, và đo lại được.
  file: `migration/kich-ban/phan-lop.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): AC-8 thật kết luận «plugin_lint không báo nguồn là cả kho» chỉ vì đầu ra vắng chữ, không xét mã thoát, không có đối chứng dương**
  Người dùng thấy gì: Nếu công cụ kiểm tra plugin tự sập, bước kiểm này vẫn có thể báo đạt, nên chủ kho có thể tin nhầm là nguồn plugin đã đúng.
  Căn cứ: Chỉ sai khi công cụ kiểm tra hỏng, các thước khác như chợ và nạp phiên vẫn bắt được nguồn sai, và chạy lại là thấy ngay.
  file: `migration/kich-ban/thuoc-that.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (bên đọc chép tay khuôn của bên viết): bộ lọc AC-2 thật ghim cứng bố cục thư mục tạm của don-nha.mjs**
  Người dùng thấy gì: Nếu sau này kịch bản đổi tên thư mục tạm, bước kiểm không để sót cây làm việc có thể im lặng và vẫn báo đạt dù có sót.
  Căn cứ: Chưa gây sai hôm nay, chỉ là rủi ro khi sửa kịch bản sau này và lúc đó mới phát hiện được khi rà lại.
  file: `migration/kich-ban/thuoc-that.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (đo có-mặt khi lời hứa là QUAN HỆ): E7t hứa k + g bằng số dòng con trỏ rõ của sổ nguồn «mà thước tự đếm», nhưng thước không đếm số đó cũng không so**
  Người dùng thấy gì: Bước đo con trỏ không tự đối chiếu tổng số con trỏ đã đổi với số dòng trong sổ, nên một con trỏ trùng lặp có thể bị đếm thiếu mà không ai thấy.
  Căn cứ: Chưa có dấu hiệu sai trên nguồn thật hiện tại, hậu quả chỉ là số in ra có thể thiếu, và đối chiếu tay được.
  file: `migration/kich-ban/kiem-cho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (đo có-mặt khi lời hứa là QUAN HỆ): KB-AC4 chấp nhận mọi số tệp đúng luật, kể cả 0**
  Người dùng thấy gì: Ca kiểm này sẽ vẫn xanh nếu bước so nội dung vô tình bỏ qua tệp, nên có thể che một lỗi về sau.
  Căn cứ: Chỉ là lưới kiểm lỏng trên fixture, thước chạy trên nguồn thật vẫn có số đo riêng, nên rủi ro thấp và sửa sau cũng rẻ.
  file: `migration/kich-ban/don-nha.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
