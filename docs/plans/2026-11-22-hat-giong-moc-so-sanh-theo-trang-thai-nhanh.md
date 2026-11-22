# Hạt giống — mười bốn ca so «bản trước vòng» với mốc suy từ trạng thái nhánh

**Ngày:** 2026-11-22 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** sửa thước (lớp «mốc so sánh theo trạng thái
nhánh, không theo vật»).
Gốc: delivery-loop/_acceptance/tcg1-ghim-moc-truoc-vong/ — vòng sửa TCG-1 quét lớp ngày 22/11 sau khi nhánh chính đỏ
vì TCG-1; hai ca cùng nhát (TCG-1, TCG-1-bat) đã ghim commit cố định trong vòng ấy, mười bốn ca dưới đây ở ngoài nhát.

## Điều thấy

Các ca dưới dựng bản so sánh bằng `git merge-base HEAD origin/main` (hoặc đọc `origin/main:<tệp>`). Trên nhánh của vòng
đẻ ra ca, mốc ấy là nhánh chính trước vòng — ca đo đúng. Sau khi vòng gộp, trên nhánh chính gốc chung bằng HEAD: ca so
một cây với chính nó. Trên mọi nhánh PR mở sau gộp, mốc đã chứa vòng — ca đo «nhánh này không đổi X» thay cho lời hứa
của vòng, nên đỏ oan khi một PR sau đổi X hợp lệ. Cùng lớp với bất biến «Thước phải gắn vào vật được giao» ở `CLAUDE.md`.

Đỏ trên nhánh chính (không chạy ở CI, chỉ là lệnh chấm của hồ sơ):

- `tests/scripts/luot-kiem-nhe-ca-cham.mjs:46` — so bộ chạy plugin cũ/mới; trên nhánh chính chết «trùng bản hiện tại».

Xanh suông hoặc bỏ qua trên nhánh chính (so một cây với chính nó):

- `tests/plugins/run-tests.sh:6158` — P150, đường đọc-cũ của gate-card bằng byte so với base.
- `tests/plugins/run-tests.sh:7412` — P161-E10 quan hệ (2) «số lần gọi lột không giảm so với base».
- `tests/plugins/run-tests.sh:10588` — P196, tree-hash đổi thì phải tăng version (vế so với `origin/main`).
- `tests/scripts/khoi-khuon-tren-the-cong.test.mjs:114` — KK-1, KK-6 (`banGocVong`).
- `tests/scripts/khuon-loi.test.mjs:535` — KL-8 (`banGocVong`).
- `tests/scripts/recheck-goc-goi-loi.test.mjs:109` — RG-2, RG-2b.
- `tests/scripts/additive-only.test.mjs:280` — DV5, tệp luật chỉ thêm dòng.
- `tests/scripts/lo-trinh-du-lieu-ngay.test.mjs:102` — ND-1-trang-giu, ND-7 (tự khai «nền so trùng HEAD»).
- `tests/scripts/kiem-ban-cai.ca.mjs:35` — `nhanDienLuotMoc`, in «BỎ QUA: KB» (lệnh chấm, không ở CI).
- `tests/dieu-phoi/mo-dot.test.mjs:1164` — DP2-11 khong-dot.
- `tests/dieu-phoi/doi-tai-khoan.test.mjs:820` — DP4-08 khong-ban-giao.
- `tests/dieu-phoi/tiep-tuc.test.mjs:266` — DP3-03 hàng (g) `banCu`.
- `tests/design-floor/moc-s0-s1.mjs:317` — THE-M0 (job design-floor của CI).

## Hướng

Theo từng ca, xếp lời hứa vào một trong hai họ (luật đã ghi ở sổ `dieu-phoi-lop-mod`): lời hứa của MỘT vòng đã gộp →
ghim commit cố định (`MOC_…`, như `lenh-bam-duoc.test.mjs`, DP6-03, TCG-1) hoặc neo lịch sử (commit gộp của PR, như
`can-cu-s1.ca.mjs`); lời hứa «nhánh này không đổi X» → giữ merge-base sống nhưng khai rõ trên nhánh chính nó không đo.
Ca đo: chạy ca trên cây gộp thử `--no-ff` vào `origin/main` (khuôn `rang/do.sh` của hồ sơ trên) — phải đo được, không
xanh suông. Mở thành ô chỉ khi có neo ngoài; một mẻ ca nên đi chung một vòng vì cùng một nhát hình.
