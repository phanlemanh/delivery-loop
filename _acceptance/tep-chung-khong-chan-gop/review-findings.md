# Review findings: tep-chung-khong-chan-gop (round 2)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Ca 'main-khong-head' mới thêm không bao giờ đỏ khi khôi phục lối rơi lặng về 'main' mà vòng 1 vừa gỡ**
  Người dùng thấy gì: Khi kho không có thông tin nhánh mặc định, lệnh đẩy trang bản đồ vẫn chạy đúng trong trường hợp nhánh mặc định tên là main. Nhưng phép kiểm chưa chứng minh được là nó đọc đúng nhánh khi tên nhánh khác, nên về sau nếu lối này hỏng thì có thể không ai hay.
  Căn cứ: Hậu quả nhẹ: không mất dữ liệu, hiện tại chạy đúng, chỉ là lưới an toàn cho lần sửa sau còn mỏng; ghi giới hạn rồi bổ sung khi có dịp là đủ.
  file: `tests/scripts/tcg-ban-do.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lớp 'khac' của hàng sổ do máy sinh không được phép đo nào giữ; bên viết và bên đọc P177 vẫn có thể trôi lại**
  Người dùng thấy gì: Sổ giới hạn tự sinh hàng mới với một nhãn lớp cố định. Nếu nhãn này bị đổi sai về sau, một phép kiểm khác của kho sẽ báo đỏ và có thể lại làm lượt chấm bị trượt, mà phép đo của vòng này không báo trước.
  Căn cứ: Hậu quả nhẹ và tự lộ ra ngay ở lần chạy kế tiếp, không mất dữ liệu; chỉ có thể tốn một lượt chấm nếu tái phát, nên ghi giới hạn là đủ.
  file: `tools/so-gioi-han.mjs`
  severity: medium
  Đề xuất: known-limits

- **Nothing tests the ls-remote fallback for the default branch: the 'main-khong-head' case passes even when the fallback is removed**
  Người dùng thấy gì: Trên máy chạy kiểm tra tự động không có thông tin nhánh mặc định, nếu cách đọc nhánh mặc định hỏng thì lệnh đẩy trang bản đồ sẽ báo lỗi sau mỗi lần gộp và trang không được cập nhật, trong khi bộ kiểm hiện tại vẫn xanh.
  Căn cứ: Người dùng thấy ngay trang không cập nhật và tự chạy lại được, không mất dữ liệu; nhưng chỉ xảy ra khi định dạng đầu ra của git đổi, hiếm, nên ghi giới hạn và bổ sung ca khi có dịp.
  file: `tests/scripts/tcg-ban-do.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình, không ghim đúng thông điệp): ca 'main-khong-head' của TCG-11-khoa không phân biệt được ba nhánh thoát 2, và vẫn xanh khi đặt lại lối đoán 'main' cũ**
  Người dùng thấy gì: Một phép kiểm không phân biệt được các lý do khiến lệnh đẩy trang bản đồ dừng lại. Nếu lỗi quay lại, kho có thể bị đoán sai nhánh mặc định mà bộ kiểm vẫn xanh.
  Căn cứ: Không gây mất dữ liệu và lỗi sẽ lộ khi kho có nhánh mặc định khác main; sửa rẻ nhưng không chặn việc giao, nên ghi giới hạn.
  file: `tests/scripts/tcg-ban-do.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 2 (không round-trip qua bên đọc thật): cột lớp mà bộ sinh hàng sổ ghi không qua bên đọc nào, nên lùi phần sửa lượt chấm 2 ('khac' về 'chua-xep') thì toàn bộ TCG-9 vẫn xanh**
  Người dùng thấy gì: Phần sửa giúp sổ giới hạn không còn làm lượt chấm trượt chưa có phép kiểm giữ lại. Nếu ai đó đổi lại nhãn cũ, lỗi từng làm trượt vòng trước có thể quay lại mà không báo sớm.
  Căn cứ: Lỗi nếu quay lại sẽ hiện rõ và sửa được ngay, chỉ tốn thêm một lượt chấm; chi phí dựng phép đo bổ sung vượt hậu quả nên ghi giới hạn.
  file: `tests/scripts/tcg-so-gioi-han.test.mjs`
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

- **CLI so-gioi-han không kiểm tham số `--root`: thiếu giá trị thì crash kèm stack trace (r1 · tệp đã đổi)**
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

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
