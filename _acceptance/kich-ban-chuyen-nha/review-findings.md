## Trong hợp đồng

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): AC-7 in «0 còn treo trong plugins/» trong khi con trỏ tương đối chưa đổi vẫn còn treo; ca đỏ chỉ có một đột biến «đổi nửa chừng»**
  AC: AC-7
  file: `migration/kich-ban/kiem-cho.mjs:198`
  severity: low
  source: measurement
  detail: Phép quét lại cây mới ở dòng 198 viết `(!m[1] || giaiVe(r.tu, m[0], r.toi))`, trong đó `r.tu` là đường ĐÍCH dưới plugins/. Một con trỏ tương đối như `../../docs/reference/ghi-chu.md` còn nguyên trong plugins/acceptance-gate/skills/scope-slice/SKILL.md sẽ giải thành plugins/acceptance-gate/docs/..., khác `toi`, nên bị bỏ qua và không bị tính là treo. URL_DINH cũng im, vì trong tệp không có URL nào bị dính. Đã chạy thử: lấy một bản sao don-nha.mjs, thay kim `if (tien && path.posix.normalize(...) !== toi) return m;` bằng `if (tien) return m;` (bỏ qua mọi con trỏ tương đối), rồi chạy trên fixture. SKILL.md đầu ra còn `[ghi chú](../../docs/reference/ghi-chu.md)`, một liên kết treo, mà kiemCho vẫn in `AC-7 đạt: 2 con trỏ đã đổi, ... 0 còn treo trong plugins/`. Lỗi chỉ bị bắt gián tiếp ở AC-4 («nội dung lệch luật»), vì kiem-cho tự cài lại cùng phép đổi. Lời hứa «mọi lần xuất hiện của con trỏ rõ dưới plugins/» (chú thích dòng 192) phủ cả lớp con trỏ tương đối. Vậy mà KB-AC7-do-tuong-doi chỉ có một điểm: đột biến trả về regex cũ, tức đổi nửa chừng, bị URL_DINH bắt. Không có ma trận viết trước cho các cách hỏng của lớp này: không đổi, đổi nửa chừng, giải sai thư mục.
  rationale: AC-7 đòi quét lại plugins/ không còn con trỏ rõ nào treo, mà phép quét bỏ sót con trỏ tương đối và vẫn in 0 còn treo, nên AC-7 không đo đúng điều nó tuyên.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Chú thích đầu tệp lop-do.mjs còn tả nghĩa cũ: dựng lại cây trên nguồn của báo cáo**
  Người dùng thấy gì: Một dòng ghi chú ở đầu công cụ đo còn mô tả cách làm cũ, có thể làm người bảo trì hiểu sai phép đo. Kết quả đo và báo cáo vẫn đúng.
  Căn cứ: Không ảnh hưởng người dùng cuối hay kết quả đo, chỉ có thể gây hiểu nhầm cho người đọc mã; sửa rất rẻ khi tiện tay.
  file: `migration/kich-ban/lop-do.mjs`
  severity: low
  Đề xuất: wont-fix

- **URL_DINH viết cứng tiền tố URL kho cũ thay vì lấy từ bx.con_tro.url, nên đổi URL trong bảng xếp thì phép kiểm im lặng mà không báo đỏ**
  Người dùng thấy gì: Nếu sau này đổi địa chỉ kho cũ trong bảng xếp, phép kiểm các liên kết sang kho cũ có thể vẫn báo xanh dù liên kết đã dính sai. Hiện tại với địa chỉ đang dùng thì kết quả đúng.
  Căn cứ: Chỉ có hại khi chủ kho đổi địa chỉ kho cũ, một việc hiếm và thấy trước được; ghi giới hạn là đủ, sửa sau cũng rẻ.
  file: `migration/kich-ban/kiem-cho.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): vế «nhánh đã có» mới thêm của KB-AC9-luat chỉ xét mã thoát 1, không ghim thông điệp**
  Người dùng thấy gì: Một ca kiểm phụ về chạy lại khi nhánh đã tồn tại chỉ kiểm là có lỗi, chưa kiểm đúng lý do lỗi. Có thể bỏ sót trường hợp kịch bản dừng vì một lý do khác mà vẫn báo xanh.
  Căn cứ: Không làm mất hay hỏng dữ liệu của người dùng; chỉ làm bài kiểm yếu đi ở một nhánh phụ, và bổ sung thêm kiểm thông điệp là việc nhỏ.
  file: `migration/kich-ban/don-nha.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Khoá thuoc-that.lock không được nhả khi tiến trình bị ngắt bằng tín hiệu, lượt chấm sau treo 40 phút rồi thoát 2 (r1)**
  Người dùng thấy gì: Nếu một lượt chấm bị cắt ngang giữa chừng, các lượt chấm sau trên cùng kho sẽ đứng chờ gần một tiếng rồi báo không đọc được, và chủ kho phải tự xoá dấu khoá. Kết quả không sai, chỉ mất thời gian.
  Căn cứ: Chỉ xảy ra khi lượt chấm bị ngắt bất thường, không làm mất hay sai dữ liệu, và chủ kho tự gỡ được bằng cách xoá thư mục khoá.
  file: `migration/kich-ban/thuoc-that.mjs`
  severity: medium
  Đề xuất: known-limits

- **do-lop-do.sh ghi cứng mã Repo Standards thay vì đọc từ bảng xếp, và cắt cụt báo cáo đang commit nếu phan-lop.py lỗi (r1)**
  Người dùng thấy gì: Khi lượt đo lớp đỏ hỏng giữa chừng, báo cáo đã commit có thể bị ghi đè dở dang. Đổi thẻ khuôn thì phải sửa hai chỗ.
  Căn cứ: Báo cáo lấy lại được từ lịch sử kho và chạy lại được, lỗi hiện ra rõ ràng, nên chi phí sửa không đáng so với hậu quả.
  file: `migration/kich-ban/do-lop-do.sh`
  severity: low
  Đề xuất: wont-fix

- **chupKho ném lỗi khi HEAD tách rời, thuoc-that đổ vỡ thay vì báo lỗi có tên (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu kho chấm đang ở trạng thái không thuộc nhánh nào, các thước trên nguồn thật sẽ sập kèm thông báo lỗi dài khó đọc thay vì một dòng giải thích.
  Căn cứ: Chỉ làm lượt chấm dừng sớm với lỗi ồn ào, không sai kết quả hay mất dữ liệu, và người dùng chuyển sang một nhánh rồi chạy lại là xong.
  file: `migration/kich-ban/kiem-cho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Khoá thuoc-that.lock kẹt lại khi tiến trình bị tín hiệu giết; catch nuốt mọi lỗi mkdir; 40 phút sau báo nhầm thành 'không đọc được ở đây' (r1)**
  Người dùng thấy gì: Lượt chấm bị ngắt có thể để lại khoá, và các lượt sau chờ rất lâu rồi báo nhầm là không đọc được. Lỗi quyền hoặc đường dẫn sai cũng bị coi như đang có người giữ khoá.
  Căn cứ: Chỉ gây chờ lâu và báo sai nguyên nhân trong tình huống hiếm, không mất dữ liệu, và gỡ khoá tay là chạy lại được.
  file: `migration/kich-ban/thuoc-that.mjs`
  severity: medium
  Đề xuất: known-limits

- **phan-lop tính 'bo-chay' vào «đỏ thêm» mà không so với cây cũ; thiếu nhật ký cây cũ thì coi như 0 ca đỏ (r1)**
  Người dùng thấy gì: Trong vài tình huống hiếm, báo cáo lớp đỏ có thể quy nhầm ca đã đỏ sẵn từ trước cho việc đổi bố cục, làm số đo vòng sau hơi cao.
  Căn cứ: Báo cáo hiện tại không bị ảnh hưởng, lỗi chỉ lệch số đo chứ không làm hỏng sản phẩm, và đo lại được.
  file: `migration/kich-ban/phan-lop.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): AC-8 thật kết luận «plugin_lint không báo nguồn là cả kho» chỉ vì đầu ra vắng chữ, không xét mã thoát, không có đối chứng dương (r1)**
  Người dùng thấy gì: Nếu công cụ kiểm tra plugin tự sập, bước kiểm này vẫn có thể báo đạt, nên chủ kho có thể tin nhầm là nguồn plugin đã đúng.
  Căn cứ: Chỉ sai khi công cụ kiểm tra hỏng, các thước khác như chợ và nạp phiên vẫn bắt được nguồn sai, và chạy lại là thấy ngay.
  file: `migration/kich-ban/thuoc-that.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (bên đọc chép tay khuôn của bên viết): bộ lọc AC-2 thật ghim cứng bố cục thư mục tạm của don-nha.mjs (r1)**
  Người dùng thấy gì: Nếu sau này kịch bản đổi tên thư mục tạm, bước kiểm không để sót cây làm việc có thể im lặng và vẫn báo đạt dù có sót.
  Căn cứ: Chưa gây sai hôm nay, chỉ là rủi ro khi sửa kịch bản sau này và lúc đó mới phát hiện được khi rà lại.
  file: `migration/kich-ban/thuoc-that.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (đo có-mặt khi lời hứa là QUAN HỆ): E7t hứa k + g bằng số dòng con trỏ rõ của sổ nguồn «mà thước tự đếm», nhưng thước không đếm số đó cũng không so (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bước đo con trỏ không tự đối chiếu tổng số con trỏ đã đổi với số dòng trong sổ, nên một con trỏ trùng lặp có thể bị đếm thiếu mà không ai thấy.
  Căn cứ: Chưa có dấu hiệu sai trên nguồn thật hiện tại, hậu quả chỉ là số in ra có thể thiếu, và đối chiếu tay được.
  file: `migration/kich-ban/kiem-cho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (đo có-mặt khi lời hứa là QUAN HỆ): KB-AC4 chấp nhận mọi số tệp đúng luật, kể cả 0 (r1 · tệp đã đổi)**
  Người dùng thấy gì: Ca kiểm này sẽ vẫn xanh nếu bước so nội dung vô tình bỏ qua tệp, nên có thể che một lỗi về sau.
  Căn cứ: Chỉ là lưới kiểm lỏng trên fixture, thước chạy trên nguồn thật vẫn có số đo riêng, nên rủi ro thấp và sửa sau cũng rẻ.
  file: `migration/kich-ban/don-nha.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
