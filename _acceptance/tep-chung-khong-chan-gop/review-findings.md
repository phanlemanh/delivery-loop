# Review findings: tep-chung-khong-chan-gop (round 1)

## Trong hợp đồng

- **tcg-mutants kết luận «đỏ» chỉ từ mã thoát/«not ok», không ghim thông điệp mong đợi**
  file: `tests/scripts/tcg-mutants.test.mjs:32`
  severity: medium
  AC: AC-10
  source: conventions
  detail: Với `chayCa`, mọi lần chạy không xanh đều tính là đỏ: `xanh = status===0 && pass>=1 && !not ok`. Vì vậy một nhát tiêm làm ca đích chết vì lý do khác cũng qua: lỗi nạp mô-đun, thiếu tệp ở bản sao, ca khác trong tệp hỏng. Ca vẫn ghi «nhát tiêm làm ca đỏ», tức không phân biệt được «bắt đúng lỗi» với «hỏng hạ tầng». Bất biến «Assertion âm-tính-một-mình» của CLAUDE.md đòi CẢ đối chứng dương (đã có, TCG-10-M0) LẪN ghim đúng thông điệp. Mẫu cùng loại trong kho làm đủ hai vế: lgck-the.test.mjs:471-472 tách «phep do mu» khỏi «do nhung sai thong diep (can «…»)». Mảng NHAT nên mang thêm cụm thông điệp mong đợi cho từng nhát, rồi so với stdout TAP của ca đích.

- **--day-nhanh-ve: phép chặn «nhánh view trùng nhánh mặc định» lặng lẽ rơi về 'main' khi thiếu origin/HEAD, đúng trường hợp của job CI mà GUIDE hướng dẫn**
  file: `plugins/acceptance-gate/scripts/product-map.mjs:442`
  severity: medium
  AC: AC-11
  source: bugs
  detail: `macDinh = sr.status === 0 ? … : 'main'`. Khi `refs/remotes/origin/HEAD` không tồn tại thì tên nhánh mặc định bị đoán là 'main' mà không báo gì. `actions/checkout` (chính là job ở khối BAN-DO-NHANH-VE trong GUIDE) không đặt origin/HEAD, nên trên CI phép so luôn so với 'main'. Ở kho có nhánh mặc định là master/develop mà `ban_do.nhanh_ve` lại khai trùng tên ấy, phép chặn không bắt được. Khi đó mã đi tiếp: ls-remote thấy đỉnh của nhánh, tạo commit-tree chỉ gồm hai view với parent là đỉnh đó (fast-forward), rồi push đè lên chính nhánh mặc định. Kết quả là một commit xoá mọi tệp khác của kho. Phép chặn được dựng ra để ngăn đúng ca này lại mở cửa (fail-open) khi không biết nhánh mặc định. Nên thoát 2 khi không xác định được nhánh mặc định, hoặc hỏi `git ls-remote --symref origin HEAD`, thay vì đoán.

- **Hình dạng 4 — assertion âm tính một mình: 14 nhát tiêm chỉ kết luận «không xanh», không ghim thông điệp**
  file: `tests/scripts/tcg-mutants.test.mjs:72`
  severity: medium
  AC: AC-10
  source: measurement
  detail: Mỗi ca `TCG-10-<nhát>` chỉ có `assert.ok(!r.xanh, ...)`. Trong `chayCa` (dòng 36), `xanh` bằng `x.status === 0 && pass >= 1 && !/^not ok /m`. Vậy ca đích ĐỎ vì bất cứ lý do nào cũng làm nhát tiêm «qua»: tiến trình con của product-map/start-scan/s4-args sập, `quet()` hỏng ở `start-scan thoát`, hay mẫu tên khớp 0 ca (pass = 0). TCG-10-M0 lo được vế (a) đối chứng dương, nhưng chỉ trên bản chưa tiêm. Vế (b) — ghim đúng thông điệp mong đợi trên bản đã tiêm — không có: `r.ra` chỉ được in ra khi ca vẫn xanh, không bao giờ được so. Hợp đồng AC-10 viết rõ «mỗi nhát làm đúng ca của nó đỏ VỚI THÔNG ĐIỆP GHIM». E1 hứa `tat-di-nhanh-moi` đỏ «lech byte» kèm tên tình huống, nhưng không ca nào kiểm chuỗi đó. Phép đo hiện tại không phân biệt được «bắt đúng lỗi» với «mũi tiêm làm vỡ hạ tầng».

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Lời dặn quanh MAP-STAGE còn bảo đưa tên PRODUCT-MAP.md vào `git add`, nhưng ở chế độ ngoai_git lệnh đó thoát 1**
  Người dùng thấy gì: Ở kho bật chế độ mới, người làm theo lời dặn cũ trong hướng dẫn ký có thể làm lệnh commit chữ ký dừng giữa chừng. Họ chỉ cần bỏ tên tệp bản đồ khỏi lệnh rồi chạy lại.
  Căn cứ: Nhẹ: lỗi hiện rõ ngay, không mất dữ liệu, người tự gỡ được bằng cách chạy lại lệnh, và sửa chữ hướng dẫn rất rẻ.
  file: `plugins/acceptance-gate/commands/signoff.md`
  severity: medium
  Đề xuất: known-limits

- **Bộ quét /start phát hai trạng thái bản đồ mới mà thân lệnh start.md không biết đọc**
  Người dùng thấy gì: Thẻ khởi đầu có thể hiển thị sai hoặc thiếu lời giải thích khi bản đồ ở trạng thái vẽ tại chỗ hoặc khoá viết sai. Người dùng không biết cần sửa gì.
  Căn cứ: Nhẹ đến vừa: chỉ ảnh hưởng chữ hiển thị trên thẻ ở kho bật chế độ mới, không mất dữ liệu, và lệnh kiểm vẫn báo đúng lỗi khoá.
  file: `plugins/acceptance-gate/scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **`--day-nhanh-ve` hỏi đầu nhánh view bằng `ls-remote --heads origin <tên>`, khớp theo đuôi nên có thể lấy nhầm nhánh**
  Người dùng thấy gì: Nếu kho gốc có một nhánh khác trùng đuôi tên nhánh bản đồ, lần đẩy bản đồ có thể bị từ chối. Cấu hình đúng vẫn không đẩy được cho tới khi đổi tên nhánh.
  Căn cứ: Nhẹ: hiếm gặp, lần đẩy bị từ chối chứ không ghi sai, không mất dữ liệu, và người đổi tên nhánh là qua.
  file: `plugins/acceptance-gate/scripts/product-map.mjs`
  severity: low
  Đề xuất: known-limits

- **Suy thư mục script bằng `decodeURIComponent(new URL(import.meta.url).pathname)` trong khi tệp đã có HERE từ fileURLToPath**
  Người dùng thấy gì: Trên máy Windows, cảnh báo về lệnh hồ sơ có thể mất câu luật mà không ai biết. Việc sinh tệp vẫn chạy bình thường.
  Căn cứ: Nhẹ: chỉ mất một câu giải thích trong cảnh báo, chỉ trên Windows, không mất dữ liệu và sửa rất rẻ.
  file: `plugins/feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **CLI so-gioi-han không kiểm tham số `--root`: thiếu giá trị thì crash kèm stack trace**
  Người dùng thấy gì: Gõ thiếu giá trị cho tuỳ chọn gốc thì công cụ báo lỗi dài khó đọc thay vì một dòng gọn. Không có gì bị hỏng.
  Căn cứ: Rất nhẹ: chỉ xảy ra khi gõ sai lệnh, thử lại là xong, không mất dữ liệu.
  file: `tools/so-gioi-han.mjs`
  severity: low
  Đề xuất: wont-fix

- **paths của eval không phủ chính tệp thước (rang/chay.sh) và các tệp E10 chạy, nên carry-forward mang sang màu xanh cũ**
  Người dùng thấy gì: Sau một lần sửa chỉ chạm bộ chấm, một số phép kiểm có thể được báo xanh từ lần trước mà không chạy lại. Người ký có thể tin vào màu xanh cũ.
  Căn cứ: Vừa: làm giảm độ tin của màu xanh nhưng chỉ khi sửa đúng các tệp đó, đã có cách chạy lại tay, và khai thêm đường dẫn là rẻ.
  file: `_acceptance/tep-chung-khong-chan-gop/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **ls-remote dùng tên trần nên khớp đuôi ref: dò sai đỉnh nhánh view**
  Người dùng thấy gì: Nếu kho gốc có nhánh khác trùng đuôi tên nhánh bản đồ, việc đẩy bản đồ có thể bị chặn dù cấu hình đúng. Bản đồ trên nhánh riêng không được cập nhật.
  Căn cứ: Nhẹ: hiếm gặp, bị chặn chứ không ghi sai, không mất dữ liệu, đổi tên nhánh là gỡ được.
  file: `plugins/acceptance-gate/scripts/product-map.mjs`
  severity: low
  Đề xuất: known-limits

- **--day-nhanh-ve đẩy trang lộ trình mang lỗi tệp ý định mà vẫn thoát 0, trong khi --check coi đúng lỗi đó là đỏ**
  Người dùng thấy gì: Người đọc bản đồ qua nhánh riêng có thể thấy một trang lộ trình báo lỗi trong khi bước kiểm sau gộp vẫn xanh. Họ không biết trang bị hỏng cho tới khi tự mở.
  Căn cứ: Vừa: trang lỗi hiện công khai cho người đọc ngoài nhưng không mất dữ liệu, và lần đẩy sau khi sửa tệp ý định sẽ thay thế.
  file: `plugins/acceptance-gate/scripts/product-map.mjs`
  severity: low
  Đề xuất: known-limits

- **Bước bật trong GUIDE (`git rm --cached -- PRODUCT-MAP.md LO-TRINH.html`) hỏng cả lệnh ở kho không có LO-TRINH.html**
  Người dùng thấy gì: Kho không khai lộ trình làm theo hướng dẫn bật sẽ gặp lỗi và bản đồ vẫn bị git theo dõi. Kiểm tra sẽ báo đỏ cho tới khi họ tách lệnh.
  Căn cứ: Nhẹ: lỗi hiện ngay, không mất dữ liệu, người tách lệnh theo từng tệp là xong, và sửa chữ hướng dẫn rất rẻ.
  file: `GUIDE.md`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc cho mục review-findings, không rút từ khuôn OOC-ITEM-TEMPLATE của bên viết**
  Người dùng thấy gì: Nếu khuôn mục phát hiện do máy viết đổi hình dạng, bộ sinh hàng sổ có thể đếm sai mà phép kiểm vẫn xanh. Lượt chấm có thể trượt vì sổ thiếu hàng trở lại.
  Căn cứ: Vừa: chỉ xảy ra khi khuôn đổi, hậu quả là lượt chấm lại chứ không mất dữ liệu, và đã có ngưỡng đếm lớp lỗi này.
  file: `tests/scripts/tcg-so-gioi-han.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — kiểm «có chữ 2» trong khi lời hứa là quan hệ: số hàng additionalContext nêu = số hàng sổ thật thêm**
  Người dùng thấy gì: Thông báo sau khi thêm hàng sổ có thể nêu sai số hàng mà phép kiểm vẫn xanh. Người đọc có thể hiểu nhầm số hàng đã thêm.
  Căn cứ: Nhẹ: chỉ là con số trong lời nhắn, sổ vẫn đúng, và sửa phép kiểm rất rẻ.
  file: `tests/scripts/tcg-so-gioi-han.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
