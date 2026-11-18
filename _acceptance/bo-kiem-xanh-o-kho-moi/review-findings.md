# Review findings: bo-kiem-xanh-o-kho-moi (round 2)

## Trong hợp đồng

- **Thước AC-5 (E5 trong evals.yaml) không đòi hai ca mới chứng phần sửa cây cũ, nên ca bị gỡ hay đổi tên thì eval vẫn xanh**
  file: `_acceptance/bo-kiem-xanh-o-kho-moi/evals.yaml:108`
  severity: medium
  AC: AC-5
  source: conventions
  detail: Lượt sửa này thêm hai ca BK-AC5-do-chet-cu và BK-AC5-do-khong-do-cu vào migration/kich-ban/lop-do.test.mjs. Đây là chứng cứ duy nhất cho finding trong hợp đồng mà Cổng Bằng chứng lượt 1 trả về (decisions.jsonl d-...-32 dẫn đúng hai ca này). Nhưng phần `expected` của eval AC-5 vẫn chỉ đòi `ok` của bốn ca cũ: BK-AC5, BK-AC5-do-chet, BK-AC5-do-im-lang, BK-AC5-do-ghi-do. Phần mô tả cũng chỉ nói về cây mới. Vì thế lượt chấm 2 có thể ghi AC-5 PASS ngay cả khi hai ca mới bị gỡ, bị skip, hoặc bị đổi tên. Khi đó lời hứa «bộ chết ngầm ở cây cũ được gọi tên, tổng không là 0» không có thước nào ghim. Việc này trái luật «thước phải gắn vào vật được giao»: phần sửa có ca kiểm nhưng thước nghiệm thu không trỏ tới ca ấy. Cần thêm hai tên ca và mô tả hành vi cây cũ vào expected của eval AC-5. Tôi không sửa (đề bài không cho sửa).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bộ ở cây cũ chết giữa chừng (thoát khác 0 sau khi đã in vài ca) vẫn cho tổng 0: bản sửa AC-5 chỉ bắt bộ cây cũ chết mà không in dòng nào**
  Người dùng thấy gì: Nếu một bộ kiểm của kho cũ chết giữa chừng sau khi đã chạy được vài ca, báo cáo vẫn có thể ghi «không có ca đỏ thêm» dù một phần ca của bộ ấy chưa được so. Người đọc báo cáo có thể tin nhầm là bộ kiểm sạch.
  Căn cứ: Hậu quả nhẹ và hiếm: chỉ xảy ra khi bộ kho cũ tự chết giữa chừng, không mất dữ liệu, chạy lại bộ đo là thấy; sửa thêm là mở rộng phạm vi của thước nên để ghi giới hạn đã biết.
  file: `migration/kich-ban/phan-lop.py`
  severity: medium
  Đề xuất: known-limits

- **Chặn chạy-như-tệp-chính dùng path.resolve thay vì realpathSync: chạy qua đường symlink thì thoát 0 mà không làm gì, kéo theo đo rỗng mà vẫn «AC-4 đạt» (r1)**
  Người dùng thấy gì: Nếu kho được mở qua một đường tắt (symlink), các bước kiểm có thể chạy rỗng mà vẫn báo thoát bình thường, và có thể in «đạt» dù chưa đo gì.
  Căn cứ: Chỉ gặp khi đặt kho sau đường tắt, hiếm và người dùng tự tránh được bằng cách chạy qua đường thật; ghi lại là đủ.
  file: `migration/kich-ban/lop-do.mjs`
  severity: low
  Đề xuất: known-limits

- **Cờ `ngoai_dao` của bảng vá miễn phép đảo AC-2 mà không kiểm căn cứ quyết định, khác pattern của bo-khoa.tsv (r1)**
  Người dùng thấy gì: Một mục vá bộ kiểm có thể tự khai được miễn so sánh mà không cần ghi lời chủ kho, nên một thay đổi ngữ nghĩa ca kiểm có thể lọt qua thước mà không ai duyệt.
  Căn cứ: Tạo khe để ca kiểm bị đổi mà không lộ, nhưng chỉ do người sửa bảng vá tạo ra và mọi thay đổi vẫn nằm trong lịch sử; ghi giới hạn rồi cân nhắc siết ở vòng sau.
  file: `migration/kich-ban/kiem-cho.mjs`
  severity: medium
  Đề xuất: known-limits

- **phan-lop.py classifies rerun steps against the first-run log instead of the rerun log (r1 · tệp đã đổi)**
  Người dùng thấy gì: Với bước chạy lại, cột phân loại nguyên nhân đỏ trong báo cáo có thể lệch so với nhật ký chạy lại, dù số đếm vẫn đúng.
  Căn cứ: Chỉ làm nhãn phân loại sai ở ca hiếm, số tổng không đổi và báo cáo hiện tại không bị ảnh hưởng.
  file: `migration/kich-ban/phan-lop.py`
  severity: low
  Đề xuất: known-limits

- **Run-level 'luot-chay' entry is overwritten but bo-chay is counted once per message, so the report fails its own arithmetic check (r1 · tệp đã đổi)**
  Người dùng thấy gì: Trong ca hiếm lượt chạy chết theo hai cách cùng lúc, báo cáo lớp đỏ từ chối ghi thay vì ghi sai.
  Căn cứ: Hỏng ồn ào chứ không im lặng, không mất dữ liệu và người dùng chạy lại sau khi dọn thư mục là xong; sửa không đáng chi phí.
  file: `migration/kich-ban/phan-lop.py`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 — BK-AC5-do-ghi-do: chiều đỏ chạy trên bản sao không có đối chứng dương của chính bản sao và không ghim thông điệp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Ca kiểm bảo vệ tệp báo cáo cũ khi ghi hỏng có thể xanh ngay cả khi bản sao thử bị hỏng vì lý do khác, nên độ tin của nó thấp hơn vẻ ngoài.
  Căn cứ: Chỉ làm yếu một ca kiểm chứ không làm sai sản phẩm; người dùng không thấy hậu quả trực tiếp và có thể bổ sung đối chứng sau.
  file: `migration/kich-ban/lop-do.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — dòng «AC-4 đạt: báo cáo đo trên nguồn <8-hex>» in mã nguồn lúc chấm thay vì mã nguồn ghi trong báo cáo, và ca kiểm dùng cùng một giá trị cho cả hai (r1)**
  Người dùng thấy gì: Dòng xác nhận «đạt» có thể ghi mã nguồn hiện tại thay vì mã nguồn mà báo cáo thật sự đã đo, gây hiểu nhầm về báo cáo cũ.
  Căn cứ: Gây nhầm lẫn khi đọc nhưng phép so mã cây vẫn chặn phần lớn báo cáo cũ; sửa rẻ nhưng không gấp.
  file: `migration/kich-ban/bao-cao-giu-khoa.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — BK-AC2-doc-lap đo «độc lập» bằng sự vắng mặt của một dạng chuỗi import, trong khi lời hứa là quan hệ phụ thuộc giữa hai mô-đun (r1)**
  Người dùng thấy gì: Phép kiểm rằng thước đảo không dùng chung mã với kịch bản chỉ bắt được một cách viết nhập mã, nên sự phụ thuộc ngầm theo cách khác có thể lọt.
  Căn cứ: Chỉ là lỗ hổng trong phép kiểm phụ, người dùng không bị ảnh hưởng trực tiếp; ghi giới hạn là đủ.
  file: `migration/kich-ban/bo-kiem.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — BK-AC4-doc-gate đo đối tượng trong bộ nhớ của docGate, không round-trip khối `run: |` nhiều dòng qua đúng chỗ nối bên đọc dùng (CLI ⏎ → chay-bo-kiem.sh) (r1)**
  Người dùng thấy gì: Lệnh nhiều dòng trong việc kiểm chưa từng được chạy thử qua đường nối thật giữa bộ đọc và trình chạy, nên lỗi ở chỗ nối ấy có thể không bị phát hiện.
  Căn cứ: Chưa có bằng chứng lỗi thật, chỉ là chỗ chưa được thử; nếu hỏng thì lượt chạy đỏ rõ ràng nên người dùng thấy và chạy lại được.
  file: `migration/kich-ban/giu-khoa.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
