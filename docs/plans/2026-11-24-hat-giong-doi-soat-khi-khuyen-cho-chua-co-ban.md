# Hạt giống — đối soát nói sai khi khuyên chờ mà chưa có bản bàn giao

Gốc: delivery-loop/_acceptance/doi-soat-ban-giao/ — lượt chấm 1 (wf_e17c9e05-943), mục Ngoài-1 và Ngoài-3 của
`review-findings.md`; chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng 24/11/2026. Ô trích lại tên tệp này ở Notes.

Trạng thái: SỔ, không phải cam kết. Chưa thiết kế, chưa có ô. Mã đọc ở nhánh `claude/doi-soat-ban-giao-383864`
(`6bb60b70`).

## Chuyện gì xảy ra

Lệnh nối lại tính khối `doi_soat` TRƯỚC khi gọi `roiBanGiao` (`plugins/dispatch/scripts/tiep-tuc.mjs`). Đợt ở pha
`dang-ban-giao` mà `ban-giao.json` chưa dựng (các dãy chưa báo xong, chưa hết cửa sổ chờ mặc định 20 phút) thì khối lấy
từ `khongBanTruoc(...)`, và dòng của nó nói «bản bàn giao dựng ngay lúc nối lại, không có gì để so».

Nếu tài khoản mới cũng quá ngưỡng báo trước, `roiBanGiao` trả `khuyen_cho` sớm, KHÔNG gọi `buocBanGiao(cuongBuc)`,
nên không bản nào được dựng và đợt vẫn ở `dang-ban-giao`. Khoá `doi_soat` vẫn gắn (điều kiện chỉ loại
`can_doc_han_muc`), và thân lệnh `resume.md` bảo phiên nói lại nguyên văn dòng ấy cho chủ kho trước khi DỪNG. Chủ kho bị
báo sai rằng bàn giao đã dựng, đúng lúc họ cần biết bàn giao đã xong chưa.

Không ca nào của hồ sơ bắt được: DS-05 đo khuyên chờ ở `cho-tiep-tuc`, DS-07 (e) đo rời cưỡng bức không khuyên chờ.

## Hướng sửa đã thấy (chưa chọn)

- Không gắn `khongBanTruoc` khi `roi.khuyen_cho` có mặt và chưa có bản mở; hoặc
- cho ca ấy một câu riêng: «chưa có bản bàn giao — đợt vẫn đang chờ các dãy báo xong; tài khoản này đang bị khuyên chờ».

Ca đỏ cần thêm: khuyên chờ ở `dang-ban-giao` không có `ban-giao.json` → dòng `doi_soat` không được nói bản đã dựng.

## Ngưỡng mở ô

≥ 1 lần ở đợt thật chủ kho đọc dòng «bản bàn giao dựng ngay lúc nối lại» trong khi đợt còn ở `dang-ban-giao`.
