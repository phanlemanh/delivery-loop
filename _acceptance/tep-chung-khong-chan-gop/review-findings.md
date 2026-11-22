## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Nhánh hỏi `ls-remote --symref` mới thêm ở --day-nhanh-ve không có phép đo nào giữ: gỡ nó đi, TCG-11-khoa vẫn xanh**
  Người dùng thấy gì: Nếu cách kho tự hỏi nhánh mặc định hỏng, lệnh đẩy trang bản đồ lên nhánh riêng có thể dừng ở mọi kho chạy trên máy chủ CI mà bộ kiểm tra vẫn báo xanh. Chỉ kho bật lựa chọn rời git mới bị ảnh hưởng, và lỗi hiện ra rõ ngay ở lần chạy đầu, không âm thầm làm mất dữ liệu.
  Căn cứ: Hậu quả nhẹ và hiện ra ngay khi chạy thật: lệnh dừng với thông báo rõ, không mất hay ghi sai dữ liệu, và chỉ các kho đã chủ động bật lựa chọn mới gặp; bổ sung phép đo sau cũng rẻ.
  file: `tests/scripts/tcg-ban-do.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Ca 'main-khong-head' mới thêm không phân biệt được bản sửa fallback nhánh mặc định với chính lỗi nó định sửa (cả hai mutant đều sống)**
  Người dùng thấy gì: Nếu lỗi cũ quay lại, kho có nhánh chính tên khác «main» và chạy trên CI có thể bị đẩy bản đồ đè lên chính nhánh chính, mà bộ kiểm tra không báo đỏ. Chỉ xảy ra ở kho đã bật lựa chọn rời git và đặt nhánh bản đồ trùng nhánh chính.
  Căn cứ: Lỗi chỉ quay lại nếu có người sửa sai sau này, chỉ chạm kho bật lựa chọn và đặt trùng tên, và thay đổi nằm trên nhánh nên đảo lại được bằng lệnh git thông thường; thêm phép đo sau không đắt.
  file: `tests/scripts/tcg-ban-do.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: ca mới 'main-khong-head' của TCG-11-khoa chỉ ghim mã thoát 2 và cụm chung 'ban_do.nhanh_ve', nên không phân biệt được bản đã sửa với chính lỗi nó định chặn**
  Người dùng thấy gì: Bộ kiểm tra không phân biệt được lý do lệnh đẩy bản đồ dừng lại, nên một lỗi cũ có thể quay lại mà không ai biết. Người dùng chỉ thấy hậu quả nếu lỗi đó thật sự quay lại ở kho đã bật lựa chọn.
  Căn cứ: Đây là điểm yếu của việc kiểm tra chứ không phải lỗi đang hại người dùng; hậu quả nhẹ, tự lộ khi chạy thật và sửa bổ sung sau rẻ.
  file: `tests/scripts/tcg-ban-do.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lời dặn quanh MAP-STAGE còn bảo đưa tên PRODUCT-MAP.md vào `git add`, nhưng ở chế độ ngoai_git lệnh đó thoát 1 (r1)**
  Người dùng thấy gì: Ở kho bật chế độ mới, người làm theo lời dặn cũ trong hướng dẫn ký có thể làm lệnh commit chữ ký dừng giữa chừng. Họ chỉ cần bỏ tên tệp bản đồ khỏi lệnh rồi chạy lại.
  Căn cứ: Nhẹ: lỗi hiện rõ ngay, không mất dữ liệu, người tự gỡ được bằng cách chạy lại lệnh, và sửa chữ hướng dẫn rất rẻ.
  file: `plugins/acceptance-gate/commands/signoff.md`
  severity: medium
  Đề xuất: known-limits

- **Bộ quét /start phát hai trạng thái bản đồ mới mà thân lệnh start.md không biết đọc (r1)**
  Người dùng thấy gì: Thẻ khởi đầu có thể hiển thị sai hoặc thiếu lời giải thích khi bản đồ ở trạng thái vẽ tại chỗ hoặc khoá viết sai. Người dùng không biết cần sửa gì.
  Căn cứ: Nhẹ đến vừa: chỉ ảnh hưởng chữ hiển thị trên thẻ ở kho bật chế độ mới, không mất dữ liệu, và lệnh kiểm vẫn báo đúng lỗi khoá.
  file: `plugins/acceptance-gate/scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **`--day-nhanh-ve` hỏi đầu nhánh view bằng `ls-remote --heads origin <tên>`, khớp theo đuôi nên có thể lấy nhầm nhánh (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu kho gốc có một nhánh khác trùng đuôi tên nhánh bản đồ, lần đẩy bản đồ có thể bị từ chối. Cấu hình đúng vẫn không đẩy được cho tới khi đổi tên nhánh.
  Căn cứ: Nhẹ: hiếm gặp, lần đẩy bị từ chối chứ không ghi sai, không mất dữ liệu, và người đổi tên nhánh là qua.
  file: `plugins/acceptance-gate/scripts/product-map.mjs`
  severity: low
  Đề xuất: known-limits

- **Suy thư mục script bằng `decodeURIComponent(new URL(import.meta.url).pathname)` trong khi tệp đã có HERE từ fileURLToPath (r1)**
  Người dùng thấy gì: Trên máy Windows, cảnh báo về lệnh hồ sơ có thể mất câu luật mà không ai biết. Việc sinh tệp vẫn chạy bình thường.
  Căn cứ: Nhẹ: chỉ mất một câu giải thích trong cảnh báo, chỉ trên Windows, không mất dữ liệu và sửa rất rẻ.
  file: `plugins/feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **CLI so-gioi-han không kiểm tham số `--root`: thiếu giá trị thì crash kèm stack trace (r1)**
  Người dùng thấy gì: Gõ thiếu giá trị cho tuỳ chọn gốc thì công cụ báo lỗi dài khó đọc thay vì một dòng gọn. Không có gì bị hỏng.
  Căn cứ: Rất nhẹ: chỉ xảy ra khi gõ sai lệnh, thử lại là xong, không mất dữ liệu.
  file: `tools/so-gioi-han.mjs`
  severity: low
  Đề xuất: wont-fix

- **paths của eval không phủ chính tệp thước (rang/chay.sh) và các tệp E10 chạy, nên carry-forward mang sang màu xanh cũ (r1)**
  Người dùng thấy gì: Sau một lần sửa chỉ chạm bộ chấm, một số phép kiểm có thể được báo xanh từ lần trước mà không chạy lại. Người ký có thể tin vào màu xanh cũ.
  Căn cứ: Vừa: làm giảm độ tin của màu xanh nhưng chỉ khi sửa đúng các tệp đó, đã có cách chạy lại tay, và khai thêm đường dẫn là rẻ.
  file: `_acceptance/tep-chung-khong-chan-gop/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **ls-remote dùng tên trần nên khớp đuôi ref: dò sai đỉnh nhánh view (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu kho gốc có nhánh khác trùng đuôi tên nhánh bản đồ, việc đẩy bản đồ có thể bị chặn dù cấu hình đúng. Bản đồ trên nhánh riêng không được cập nhật.
  Căn cứ: Nhẹ: hiếm gặp, bị chặn chứ không ghi sai, không mất dữ liệu, đổi tên nhánh là gỡ được.
  file: `plugins/acceptance-gate/scripts/product-map.mjs`
  severity: low
  Đề xuất: known-limits

- **--day-nhanh-ve đẩy trang lộ trình mang lỗi tệp ý định mà vẫn thoát 0, trong khi --check coi đúng lỗi đó là đỏ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Người đọc bản đồ qua nhánh riêng có thể thấy một trang lộ trình báo lỗi trong khi bước kiểm sau gộp vẫn xanh. Họ không biết trang bị hỏng cho tới khi tự mở.
  Căn cứ: Vừa: trang lỗi hiện công khai cho người đọc ngoài nhưng không mất dữ liệu, và lần đẩy sau khi sửa tệp ý định sẽ thay thế.
  file: `plugins/acceptance-gate/scripts/product-map.mjs`
  severity: low
  Đề xuất: known-limits

- **Bước bật trong GUIDE (`git rm --cached -- PRODUCT-MAP.md LO-TRINH.html`) hỏng cả lệnh ở kho không có LO-TRINH.html (r1)**
  Người dùng thấy gì: Kho không khai lộ trình làm theo hướng dẫn bật sẽ gặp lỗi và bản đồ vẫn bị git theo dõi. Kiểm tra sẽ báo đỏ cho tới khi họ tách lệnh.
  Căn cứ: Nhẹ: lỗi hiện ngay, không mất dữ liệu, người tách lệnh theo từng tệp là xong, và sửa chữ hướng dẫn rất rẻ.
  file: `GUIDE.md`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc cho mục review-findings, không rút từ khuôn OOC-ITEM-TEMPLATE của bên viết (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu khuôn mục phát hiện do máy viết đổi hình dạng, bộ sinh hàng sổ có thể đếm sai mà phép kiểm vẫn xanh. Lượt chấm có thể trượt vì sổ thiếu hàng trở lại.
  Căn cứ: Vừa: chỉ xảy ra khi khuôn đổi, hậu quả là lượt chấm lại chứ không mất dữ liệu, và đã có ngưỡng đếm lớp lỗi này.
  file: `tests/scripts/tcg-so-gioi-han.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — kiểm «có chữ 2» trong khi lời hứa là quan hệ: số hàng additionalContext nêu = số hàng sổ thật thêm (r1 · tệp đã đổi)**
  Người dùng thấy gì: Thông báo sau khi thêm hàng sổ có thể nêu sai số hàng mà phép kiểm vẫn xanh. Người đọc có thể hiểu nhầm số hàng đã thêm.
  Căn cứ: Nhẹ: chỉ là con số trong lời nhắn, sổ vẫn đúng, và sửa phép kiểm rất rẻ.
  file: `tests/scripts/tcg-so-gioi-han.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
