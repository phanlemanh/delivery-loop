## Trong hợp đồng

- **Báo cáo lớp đỏ in tổng 0 khi bộ kiểm ở CÂY CŨ chết ngầm, và vẫn qua phép kiểm nguyên tử**
  AC: AC-5
  file: `migration/kich-ban/phan-lop.py:128`
  severity: medium
  source: conventions
  detail: phan-lop.py chỉ biến một bộ thành mục `bo-chay` khi bộ ấy chết ở cây MỚI. Nó đọc `khongDoMoi` và trường `b` (dòng 129-134, 143), còn `g['khongDo']` của cây cũ (các dòng «cây cũ — …» do giu-khoa.mjs trả) bị bỏ qua. Tái hiện: out/A/ketqua.tsv = `ka\t1\t1\tbash`, không có XONG và không có thoi-gian-ca/ka-*.tsv; out/B chạy được một ca PASS. Kết quả: phan-lop.py thoát 0 với `tong_do_them: 0`, bảng ghi `| ka | 1 | 0 | 0 | 1 | 0 | 0 |`, `lop-do.mjs --kiem` thoát 0. Vì thế ghi-bao-cao.sh sẽ thay lop-do.md bằng bản báo «0 đỏ thêm» trong khi chẳng có đường nền nào để so. Hợp đồng AC-5 nói «mỗi bộ chết ngầm (… thiếu tệp thời gian · thiếu dòng XONG ở ketqua.tsv) là một mục lớp bo-chay có tên; báo cáo có mục ấy không bao giờ in tổng 0», và không giới hạn ở cây mới. Đây chính là lớp lỗi Ngoài-7 mà vòng này đi đóng. lop-do.test.mjs không có ca nào cho cây cũ chết (chỉ có BK-AC5, -do-chet, -do-im-lang, -do-ghi-do, đều phá ở cây mới). Báo cáo giữ khoá chạy sau đó (bao-cao-giu-khoa.mjs) có bắt được A.khongDo, nhưng lop-do.md thì tự nó nói dối.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Chặn chạy-như-tệp-chính dùng path.resolve thay vì realpathSync: chạy qua đường symlink thì thoát 0 mà không làm gì, kéo theo đo rỗng mà vẫn «AC-4 đạt»**
  Người dùng thấy gì: Nếu kho được mở qua một đường tắt (symlink), các bước kiểm có thể chạy rỗng mà vẫn báo thoát bình thường, và có thể in «đạt» dù chưa đo gì.
  Căn cứ: Chỉ gặp khi đặt kho sau đường tắt, hiếm và người dùng tự tránh được bằng cách chạy qua đường thật; ghi lại là đủ.
  file: `migration/kich-ban/lop-do.mjs`
  severity: low
  Đề xuất: known-limits

- **Cờ `ngoai_dao` của bảng vá miễn phép đảo AC-2 mà không kiểm căn cứ quyết định, khác pattern của bo-khoa.tsv**
  Người dùng thấy gì: Một mục vá bộ kiểm có thể tự khai được miễn so sánh mà không cần ghi lời chủ kho, nên một thay đổi ngữ nghĩa ca kiểm có thể lọt qua thước mà không ai duyệt.
  Căn cứ: Tạo khe để ca kiểm bị đổi mà không lộ, nhưng chỉ do người sửa bảng vá tạo ra và mọi thay đổi vẫn nằm trong lịch sử; ghi giới hạn rồi cân nhắc siết ở vòng sau.
  file: `migration/kich-ban/kiem-cho.mjs`
  severity: medium
  Đề xuất: known-limits

- **phan-lop.py classifies rerun steps against the first-run log instead of the rerun log**
  Người dùng thấy gì: Với bước chạy lại, cột phân loại nguyên nhân đỏ trong báo cáo có thể lệch so với nhật ký chạy lại, dù số đếm vẫn đúng.
  Căn cứ: Chỉ làm nhãn phân loại sai ở ca hiếm, số tổng không đổi và báo cáo hiện tại không bị ảnh hưởng.
  file: `migration/kich-ban/phan-lop.py`
  severity: low
  Đề xuất: known-limits

- **Run-level 'luot-chay' entry is overwritten but bo-chay is counted once per message, so the report fails its own arithmetic check**
  Người dùng thấy gì: Trong ca hiếm lượt chạy chết theo hai cách cùng lúc, báo cáo lớp đỏ từ chối ghi thay vì ghi sai.
  Căn cứ: Hỏng ồn ào chứ không im lặng, không mất dữ liệu và người dùng chạy lại sau khi dọn thư mục là xong; sửa không đáng chi phí.
  file: `migration/kich-ban/phan-lop.py`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 — BK-AC5-do-ghi-do: chiều đỏ chạy trên bản sao không có đối chứng dương của chính bản sao và không ghim thông điệp**
  Người dùng thấy gì: Ca kiểm bảo vệ tệp báo cáo cũ khi ghi hỏng có thể xanh ngay cả khi bản sao thử bị hỏng vì lý do khác, nên độ tin của nó thấp hơn vẻ ngoài.
  Căn cứ: Chỉ làm yếu một ca kiểm chứ không làm sai sản phẩm; người dùng không thấy hậu quả trực tiếp và có thể bổ sung đối chứng sau.
  file: `migration/kich-ban/lop-do.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — dòng «AC-4 đạt: báo cáo đo trên nguồn <8-hex>» in mã nguồn lúc chấm thay vì mã nguồn ghi trong báo cáo, và ca kiểm dùng cùng một giá trị cho cả hai**
  Người dùng thấy gì: Dòng xác nhận «đạt» có thể ghi mã nguồn hiện tại thay vì mã nguồn mà báo cáo thật sự đã đo, gây hiểu nhầm về báo cáo cũ.
  Căn cứ: Gây nhầm lẫn khi đọc nhưng phép so mã cây vẫn chặn phần lớn báo cáo cũ; sửa rẻ nhưng không gấp.
  file: `migration/kich-ban/bao-cao-giu-khoa.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — BK-AC2-doc-lap đo «độc lập» bằng sự vắng mặt của một dạng chuỗi import, trong khi lời hứa là quan hệ phụ thuộc giữa hai mô-đun**
  Người dùng thấy gì: Phép kiểm rằng thước đảo không dùng chung mã với kịch bản chỉ bắt được một cách viết nhập mã, nên sự phụ thuộc ngầm theo cách khác có thể lọt.
  Căn cứ: Chỉ là lỗ hổng trong phép kiểm phụ, người dùng không bị ảnh hưởng trực tiếp; ghi giới hạn là đủ.
  file: `migration/kich-ban/bo-kiem.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — BK-AC4-doc-gate đo đối tượng trong bộ nhớ của docGate, không round-trip khối `run: |` nhiều dòng qua đúng chỗ nối bên đọc dùng (CLI ⏎ → chay-bo-kiem.sh)**
  Người dùng thấy gì: Lệnh nhiều dòng trong việc kiểm chưa từng được chạy thử qua đường nối thật giữa bộ đọc và trình chạy, nên lỗi ở chỗ nối ấy có thể không bị phát hiện.
  Căn cứ: Chưa có bằng chứng lỗi thật, chỉ là chỗ chưa được thử; nếu hỏng thì lượt chạy đỏ rõ ràng nên người dùng thấy và chạy lại được.
  file: `migration/kich-ban/giu-khoa.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
