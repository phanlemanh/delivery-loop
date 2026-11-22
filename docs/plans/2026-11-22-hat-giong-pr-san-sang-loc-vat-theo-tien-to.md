# Hạt giống — bước mở PR trước thẻ và bộ canh hoá cũ dùng hai định nghĩa «vật» khác nhau

**Ngày:** 2026-11-22 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** sửa lỗi (bên viết và bên đọc trôi khỏi nhau).
Gốc: delivery-loop/_acceptance/tep-chung-khong-chan-gop/ — lượt chấm round 2 (`c5a80162`), `pr-san-sang` thoát 2 trên
commit `4f630ebc`; PR #17 phải mở tay.

## Điều thấy

`plugins/feature-loop/scripts/pr-san-sang.mjs` coi mọi tệp đổi sau `verified_commit` mà nằm ngoài `_acceptance/` là
«vật đổi sau lượt chấm» và từ chối mở PR. Bộ canh hoá cũ của lưới trước-gộp (`stale_files`) và phép soi cây đổi
(`plugins/feature-loop/scripts/lib/cay-doi.mjs`) lại đọc lớp qua `lib/phan-loai.mjs` kèm `risk_tiers.t1_skip_globs`, nên
`docs/**` không phải vật. Ở kho kit, bộ sinh hàng sổ (`tools/so-gioi-han.mjs`, AC-9 của hồ sơ trên) ghi
`docs/research/known-limits-ledger.tsv` SAU lượt chấm theo đúng thiết kế, nên mọi vòng có mục known-limits mới đều bị
`pr-san-sang` chặn, dù lưới trước-gộp vẫn xanh. Hệ quả: PR không mở được lúc trình thẻ, CI chỉ bắt đầu sau chữ ký, và
đoạn ký → gộp dài thêm đúng thời gian chạy CI.

## Hướng

Rút một nguồn: `pr-san-sang` đọc lớp bằng `phanLoai` với `t1_skip_globs` của kho, cùng vị từ với `stale_files`. Ca đo:
đổi một tệp `docs/` sau `verified_commit` → lệnh không chặn; đổi một tệp vật → vẫn chặn (chiều đỏ).

## Ngưỡng mở thành ô

Lần thứ hai một vòng phải mở PR tay vì lệch này, hoặc chủ kho gọi tên.
