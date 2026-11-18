# Thứ sẽ lộ khi kho `delivery-loop` chuyển công khai — danh sách cho bước 1.2

Soạn 17/11/2026 ở phiên B3, đọc trên nhánh ứng viên (mốc `release-3-0-0`). Bước 1.2 của `migration/cat-sang/BANG-BUOC.md`
mời chủ kho bật công khai trên danh sách này; chủ kho đã chọn «công khai» ở câu A1 của thẻ Cổng Phạm vi, sau khi đọc danh
sách. Hai mục 2 và 4 do phiên giữ đợt nêu thêm sau lượt đọc đầu (tin 17/11) — đây là danh sách đủ để chủ kho quyết lại.

**Mọi mục dưới nằm trong LỊCH SỬ nhánh `chuyen-nha` đã đẩy lên GitHub** (kho đang riêng tư). Gỡ tệp ở nhánh chính không gỡ
được bản trong lịch sử; viết lại lịch sử thì đổi mã mọi commit chữ ký của B1, B2 — không nên. Nên lối thật chỉ có hai:
công khai với các mục này, hoặc giữ riêng tư (giá đã ghi ở câu A1 của thẻ).

| # | Thứ lộ | Ở đâu | Mức | Cách xử máy khuyên |
|---|---|---|---|---|
| 1 | Tên tệp và 50 chỗ bám vào kit của kho RIÊNG TƯ `onehub-quy-hang` (đường `.github/…`, `packages/ui-lint/…`, khoá trong `_acceptance/config.yaml`) | `migration/tra-soat/ket-qua/kho-quy-hang.md`, `kho-quy-hang.tsv` (52 dòng); tóm ở `migration/tra-soat/README.md` mục 7; vài dòng trong `migration/cat-sang/BANG-BUOC.md` và `migration/vi-phan/README.md` | vừa — cấu trúc thư mục và tên công cụ, không có mã nguồn hay dữ liệu | chấp nhận. Kho cũ đang công khai đã nhắc Quỹ hàng ở 46 tệp (đếm 17/11) |
| 2 | 657 dòng chỗ bám của crm | `migration/tra-soat/ket-qua/kho-crm.md`, `kho-crm.tsv` | thấp — bản kéo đo là `phanlemanh/crm-onehub`, kho ấy đang CÔNG KHAI (đọc `gh repo view` 17/11); kho `crm-onehub-nguon` riêng tư thì không có trong sổ | chấp nhận |
| 3 | Đường dẫn máy của chủ kho (`/Users/<tên máy>/…`) | 94 tệp trên nhánh ứng viên | thấp — kho cũ đang công khai đã có 88 tệp như thế; thêm 6 | chấp nhận |
| 4 | Một câu nói tệp cấu hình shell của máy chủ kho có khoá dạng chữ thường | Chỉ trong LỊCH SỬ: phiên giữ đợt viết câu ấy vào `migration/TRANG-THAI.md` lúc 21:23 17/11 (commit `050be746`, lặp ở `e5f32f2c`) và gỡ khỏi đầu `chuyen-nha` ở `084ac3b1`. Trước đó không dòng nào dưới `migration/` nói điều ấy. Hai dòng sổ B1 (`_acceptance/kich-ban-chuyen-nha/decisions.jsonl` dòng 30–31) chỉ nhắc khối bọc Node 24 trong tệp ấy, không nhắc khoá | thấp–vừa — giá trị khoá chưa bao giờ nằm trong kho (phiên giữ đợt quét theo mẫu chuỗi dạng khoá: 0 tệp); câu chỉ còn trong hai commit cũ | **Đã có lời chủ kho:** «Để nguyên lịch sử» (gõ ở phiên giữ đợt 21:55 17/11, trả lời câu «Để câu cũ nằm trong lịch sử hai commit, hay viết lại lịch sử trước ngày cắt?» — phiên giữ đợt chuyển nguyên văn). Không ai viết lại lịch sử `chuyen-nha`. Xoay khoá nếu khoá ấy quan trọng là việc của chủ kho, ngoài kho |
| 5 | Ba mục `gitleaks` báo | `_acceptance/kich-ban-chuyen-nha/s4-args-r2.json`, `s4-args-r3.json`, `_acceptance/bo-kiem-xanh-o-kho-moi/s4-args-r2.json` | không — cả ba là dòng băm nội dung tệp (`"tests/…mjs": "<băm>"`), không phải khoá; cùng loại tệp ở kho cũ công khai quét sạch | chấp nhận |

**Chưa rà:** nội dung từng hồ sơ dưới `_acceptance/` (đều là hồ sơ của kit, phần lớn đã công khai ở kho cũ — phần mới là
hồ sơ B1, B2 và hồ sơ này); bản ghi phiên Claude và thư mục ghi chú chung không nằm trong kho.

**Lệnh rà lại trước bước 1.2** (cây đang đứng; lịch sử thì thay `HEAD` bằng `--all` cho `gitleaks`):

```bash
gitleaks detect --source . --log-opts="kit-cu/main..HEAD" --no-banner --redact
```

```bash
git grep -l -i 'onehub-quy-hang\|quy-hang' HEAD -- migration _acceptance/kich-ban-chuyen-nha _acceptance/bo-kiem-xanh-o-kho-moi _acceptance/release-3-0-0
```
