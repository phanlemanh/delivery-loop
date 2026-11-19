# Hạt giống — chín mục mở của kho cũ, ghi lại trước khi đóng

**Ngày:** 19/11/2026 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · bước 1.9 của đợt chuyển nhà, theo bảng
`migration/bang-ket-cuc-kho-cu.md` chủ kho duyệt 19/11 («Duyệt theo đề xuất»). Không mở vòng, không tạo ô.
Khi đợt đóng, tệp dời sang `docs/plans/` cùng PR đóng đợt; lúc đó mỗi mục phải trỏ được về một hồ sơ `_acceptance/` theo
răng VC8 đang chạy trên `main` — bảng này chưa chọn hồ sơ gốc cho từng mục.

Kho cũ `phanlemanh/acceptance-gate-kit` đóng băng ở `v2.39.0` và sẽ được lưu trữ, không xoá: PR và nhánh dưới đây vẫn đọc
được sau khi lưu trữ. Đường dẫn ghi theo bố cục MỚI của kit 3.0.

## Ba PR

### PR #377 — khảo sát Mods của Claude Code (17/10)

23 tệp dưới `docs/findings/`, chỉ ở nhánh `claude/focused-easley-7d3bab` của kho cũ; kho mới không có. Năm kiến nghị, đều là
CỘNG, chưa cái nào được gọi tên: K1 lệnh chỉ đọc không qua model · K2 dòng sự thật cuối lượt · K3 bộ canh và đánh thức
phiên · K4 thẻ cổng có nút · K5 đồng hồ máy theo vòng. Kèm kết quả thăm dò trên Desktop 2.1.295.
**Ngưỡng mở:** chủ kho gọi tên một kiến nghị; khi đó mang finding từ nhánh trên sang `docs/findings/`.

### PR #396 — thẻ lượt cắt và `chay_sau` (21/10)

Một sửa lỗi nhỏ gộp với một tính năng CỘNG chưa được phê; 29 ngày chưa có lựa chọn. Ba ý:
(1) thẻ lượt cắt cho người gộp PR; (2) `chay_sau` có còn cần sau khi hàng mang `vung` từ 2.35.0
(`_acceptance/vung-giao-viec-tu-cat-luot/`); (3) nhịp tính từ dòng seal Cổng 1 đầu thay vì `approved_at` —
`plugins/acceptance-gate/scripts/cat-luot.mjs:372` vẫn đọc `approved_at`, nhưng chính PR đo sửa xong gần như không đổi số
(T2 vẫn 0 ngày, T3 từ 0 lên 0,5). Chạm `plugins/acceptance-gate/scripts/cat-luot.mjs` và
`plugins/acceptance-gate/skills/scope-slice/SKILL.md`.
**Ngưỡng mở:** chủ kho chọn một trong ba lối PR đã nêu.

### PR #418 — park «đếm lại bộ chấm giao diện» (26/10)

Chủ kho đã quyết park 26/10. Hạt giống viết sẵn trong PR: chạy `suite_keys` tại chỗ trước khi gửi lượt chấm S4 — 22 trong
87 lượt đỏ do chính vòng gây, bắt được trước. Ba tệp nội dung (`_acceptance/thuoc-giao-dien-chay-thu-truoc-cham/opportunity.md`,
`docs/findings/2026-10-26-bo-cham-giao-dien-dem-lai.md`, `docs/plans/2026-10-26-hat-giong-chay-suite-truoc-luot-cham.md`)
mang sang được nguyên văn vì hai thư mục ấy không dời.
**Ngưỡng mở:** như hạt giống gốc trong PR.

## Sáu vấn đề

### #490 — chuẩn hoá khối Ai × Lối cho kho có nhiều vai (09/11)

Kho khai danh sách vai và lối; hợp đồng T2/T3 có khối Ai × Lối máy kiểm đủ ô; mặc định tắt. Số nền: 163 hợp đồng, 98 chạm
giao diện, 42 nhắc vai. Bài tự xếp là «tín hiệu chờ».
**Ngưỡng mở:** kho tiêu thụ báo số đo thử ở cấp kho.

### #470 — PR chỉ sửa tệp kiểm bị t1-escape chặn (31/10)

Danh sách glob tệp kiểm riêng (không dùng lại `t1_skip_globs`); lối nhẹ chỉ mở khi số khẳng định không giảm và có lệnh
đỏ → xanh. Là CỘNG. Số nền: crm ba lần vượt cổng, lần nào chủ kho cũng trả lời giống nhau — dạng «trạm thu phí».
Khác `.out-of-scope/t1-escape-slug-only-thu-hep-mien-tru.md` (siết răng) và
`docs/plans/2026-10-11-hat-giong-ba-ngu-nghia-glob-t1-skip.md` (ngữ nghĩa glob).
**Ngưỡng mở:** lần vượt cổng thứ tư cùng dạng, ở bất kỳ kho nào.

### #461 — design-floor: miễn trừ và tệp token (31/10)

Mục 3 đã thành hàng KM3 `luoi-tier-nhan-eval-nen-thiet-ke` trong `docs/plans/lo-trinh-kit.json`. Còn: `design_floor.tokens`
nhận danh sách (chuỗi đơn vẫn đọc như cũ — `design-floor-s4.mjs:177` hôm nay đọc một đường dẫn) · đường miễn trừ ngoài tệp
cho kho cấm chú thích · hai mẫu bắt nhầm (bộ chọn thuộc tính CSS, số vấn đề trong chuỗi) — chưa kiểm lại trên mã mới.
**Ngưỡng mở:** một kho tiêu thụ có hơn một tệp token, hoặc gặp lại một mẫu bắt nhầm.

### #459 — bộ gộp tệp sinh bị công cụ đồng bộ của app từ chối (31/10)

Thêm một dòng vào phần «Giới hạn» của khối `GITATTR-TEP-SINH` trong `GUIDE.md` cho ca app desktop. Câu cần quyết: có ghi
nhận union + móc vẽ lại + `--check` làm lối thay thế, kèm điều kiện nhánh chính bật `strict` hoặc hàng gộp. Căn cứ mỏng:
một lần từ chối, một lần nhận. Cùng họ với DL1 (`hat-giong-sau-goi-dl-ba-kho.md`).
**Ngưỡng mở:** phép thử thẳng `merge=tep-sinh` với công cụ đồng bộ của app, hoặc chủ kho gọi tên cùng DL1.

### #454 — khoá S4 toàn máy không xếp hàng giữa các kho (30/10)

`plugins/dispatch/scripts/may.mjs` giữ khoá bằng `mkdir` nguyên tử, không có hàng chờ. Hàng chờ cấp máy theo thời điểm
xin; lệnh xem trạng thái in vị trí trong hàng; lệnh chờ khoá tự nhận diện bằng tệp PID. Khác
`docs/plans/2026-10-23-hat-giong-viec-nang-qua-khoa-may-kit.md` và `docs/plans/2026-10-27-hat-giong-nhip-giao-theo-suc-khoa.md`.
Bài báo một lần (một đợt chờ khoảng 3 giờ).
**Ngưỡng mở:** lần thứ hai một đợt chờ quá một giờ vì kho khác giành lại khoá.

### #415 — con trỏ `superseded_by` không lần theo chuỗi (26/10)

`plugins/acceptance-gate/lib/evidence-core.cjs:676–707` (`chungThayBoi`) xét một bước rồi trả `ac-thay-khong-con-eval`.
Lần theo chuỗi có trần độ sâu và chặn vòng lặp, lý do in đường đi; thước của vòng quét cả chiều ngược. Đổi bên đọc của luật
thay thế là đổi đường phán quyết (xem `docs/plans/2026-10-27-hat-giong-thay-the-khai-mot-phia.md`). Bài báo một lần: một PR
ở crm phải ghim thêm ba hồ sơ.
**Ngưỡng mở:** lần thứ hai một kho phải ghim thêm hồ sơ vì chuỗi thay thế.
