# Kịch bản đóng đợt — chặng II.4, làm một lần từ 02/12/2026

Soạn 28/11/2026, phiên giữ đợt (Mac Studio). Chủ kho bảo 28/11: «Giữ 02/12, soạn sẵn» — trả lời câu «Đóng PR #21 lúc
nào?». Tệp này là bản SOẠN SẴN: chưa việc nào dưới đây được làm. Mọi số là số đo 28/11; ngày làm thật phải đo lại.

Đích của chặng (`KE-HOACH-GIAI-DOAN-2.md` mục 3): D1 ba vế ngưỡng thực tế của mốc 3.0 · D3 kho cũ lưu trữ · D4 mỗi mục
treo có một kết cục · D5 sổ của đợt nằm trên nhánh chính, nhánh `chuyen-nha` và tệp luật của đợt đã gỡ. D2 đạt từ 21/11.

## 1. Chủ kho làm gì — ba chạm

**Chạm 1 — gỡ ba bản cài mức người dùng của chợ cũ** (lúc nào trước bước lưu trữ kho cũ cũng được; đo 28/11: cả ba còn):

```bash
claude plugin uninstall acceptance-gate@acceptance-gate-kit --scope user --keep-data
```

```bash
claude plugin uninstall feature-loop@acceptance-gate-kit --scope user --keep-data
```

```bash
claude plugin uninstall diagram-design@acceptance-gate-kit --scope user --keep-data
```

Chợ cũ vẫn giữ trên máy cho ba dự án ngoài kế hoạch («Giữ chợ cũ», 21/11); các bản cài mức dự án không đụng.

**Chạm 2 — ghi quan sát thực tế lên hồ sơ mốc 3.0** (vế 3 của D1; không sớm hơn 02/12). Gõ ở phiên giữ đợt, SAU khi máy
đã gộp nhánh chính vào nhánh `chuyen-nha` (bước M1 — trước đó nhánh này chưa có hồ sơ `release-3-0-0`):

```text
/acceptance-gate:observed release-3-0-0 c16d25dbe224ec0b122b6d578118731750b6a4e3 <ngày quan sát> <tên> — <một câu của anh>
```

Mã trên là commit của thẻ `v3.0.0` — đề nghị của máy cho ô «bản dựng đang phục vụ», vì kho tiêu thụ kéo kit theo thẻ; anh
đổi được. Câu quan sát là lời của chủ kho; máy không điền hộ. Số để anh nhìn khi viết:

| Kho | Chạy đúng `v3.0.0` | Điều đã đo |
|---|---|---|
| Inventory | 18/11 20:59 → 22/11 (rồi lên 3.1.0, 24/11 lên 3.1.1) | vòng thật đầu tiên trên 3.0 đạt cả vế 1 và vế 2: ký → gộp 50′ (ngưỡng 51′), làm-xong → ký 146′ (ngưỡng 383′), 3 lượt gọi, 0 lượt chấm bị hạ tầng kit đốt (`nen-inventory-ve-2.md`) |
| Quỹ hàng | từ 19/11 (PR #247 của kho ấy gộp 17:04Z) → nay | kho duy nhất còn chạy đúng 3.0.0; tới 02/12 là 13 ngày. Số của kho riêng tư không chép vào đây |
| crm | 21/11 → nay ghim `v3.1.1` | vòng chuyển kho: K1–K6 đạt, ký → gộp 41′ |

Hai điều anh cần biết trước khi viết: (1) luật «không cài mốc mới lên kho tiêu thụ trước 02/12» đã được anh mở hai lần cho
Inventory (3.1.0, 3.1.1), nên cửa sổ 14 ngày nguyên vẹn chỉ còn ở Quỹ hàng; (2) câu «sau một bản vá 3.0.x đồng hồ 14 ngày
có tính lại không» vẫn chưa định — quan sát của anh là chỗ định nó.

**Chạm 3 — trả lời MỘT câu hỏi gộp** (mục 3).

## 2. Máy làm gì, theo thứ tự

| Bước | Việc | Ghi chú |
|---|---|---|
| M0 | Đo lại điều kiện: `origin/main`, PR đang mở, vòng kit nào đang giữa chừng, kho cũ có commit mới không (đẩy lần cuối 19/11 00:27Z; có commit mới thì DỪNG, hỏi chủ kho), ba bản cài đã gỡ chưa | Không gộp PR đóng đợt khi một vòng kit đang ở giữa «đã chấm» và «đã gộp»: nhánh chính tiến thì vòng ấy phải gộp lại |
| M1 | Gộp `origin/main` vào `chuyen-nha`; chỗ xung đột duy nhất là `.claude/rules/chuyen-nha.md` — giải bằng cách GỠ tệp | Điểm rẽ chung là `050be746` (17/11), trước khi kit đổi bố cục sang `plugins/`. Nhánh chỉ đổi `migration/` và tệp luật, nên phần còn lại gộp sạch |
| M2 | Chủ kho gõ lệnh ở chạm 2; máy ghi dòng sổ và đặt trạng thái hồ sơ trong cùng commit | Thao tác cổng người, máy không tự gọi (ADR 0002) |
| M3 | Dời hạt giống sang `docs/plans/` theo bảng ở mục 4; mỗi tệp thêm dòng `Gốc:` và ô `o-chi-mo-khi-co-neo-ngoai` trích lại tên tệp | Chạy ca VC8 cả hai chiều: nguyên vẹn xanh, gỡ một dòng trích thì đỏ đúng tên tệp |
| M4 | Dòng hiệu chuẩn và năm dòng số của đợt: chạy `plugins/acceptance-gate/scripts/hieu-chuan-moc.mjs --root .` sau M2 và ghi kết quả vào dòng cuối của sổ đợt | Sau chạm 2, N tăng thêm một |
| M5 | Dòng cuối của `TRANG-THAI.md`: ngày đóng, thước D1–D5, số lượt gọi người của đợt (hôm nay 13/15, dự kiến dùng nốt 2), và mỗi mục treo đi đâu (mục 5) | Sau dòng này sổ đợt thành sử liệu, không ghi thêm |
| M6 | Đẩy nhánh, bỏ trạng thái nháp của PR #21, chờ CI bằng một truy vấn GraphQL mỗi phút | Không dùng `gh run watch` (bẫy hạn mức 28/11) |
| M7 | Chủ kho bảo gộp → gộp bằng commit gộp; chờ `tests` trên commit gộp xanh (47–58 phút) | Kho bật tự xoá nhánh sau gộp: `chuyen-nha` tự mất — đó chính là D5. Bản kéo `~/dev/delivery-loop` chuyển sang `main` |
| M8 | Chủ kho bảo lưu trữ → `gh repo archive phanlemanh/acceptance-gate-kit` | Đủ bốn điều kiện: D2 (21/11) · 7 ngày sau kho cuối (28/11) · bước 1.9 xong (19/11) · ba bản cài đã gỡ (chạm 1). Đảo bằng bỏ lưu trữ; thẻ cũ vẫn kéo được |

## 3. Câu hỏi gộp — nguyên văn sẽ hỏi

> Đóng đợt chuyển nhà: gộp PR #21 và lưu trữ kho cũ `acceptance-gate-kit`?

Kèm bốn mục máy đề xuất, anh gạch được từng dòng:

1. **Sáu dòng `false` cho plugin chợ cũ** trong `.claude/settings.json` trên `main` của kit — đề xuất thêm, để phiên mở ở
   kho kit không nạp nhầm chợ cũ. Đi một PR riêng hạng T1 sau khi đóng đợt.
2. **Hạt giống của kho crm** (mục 5 của `hat-giong-giai-doan-2.md`: suite api xanh ở mọi thứ tự tệp) — trao cho kho ấy
   bằng một vấn đề trên GitHub của crm; không vào kit.
3. **Khối bọc Node 24 trong tệp cấu hình shell** — đề xuất GIỮ tới khi cả ba kho hết ghim Node 24. Máy không sửa tệp ấy.
4. **Lộ trình còn dở** (vòng vá lỗi đợt `nen`, V2a, DL5, V2b, Mốc B, DL3, Mốc C) — hai tệp đề xuất và các đề bài chưa
   dùng dời sang `docs/plans/`, mỗi việc thành một hàng ở lộ trình của kit; từ đó không còn «phiên giữ đợt».

## 4. Hạt giống dời đi đâu

| Tệp trong `migration/` | Đích ở `docs/plans/` | `Gốc:` đề nghị |
|---|---|---|
| `hat-giong-giai-doan-2.md` mục 1–4 | `2026-12-02-hat-giong-giai-doan-2-chuyen-nha.md` | `delivery-loop/_acceptance/release-3-0-0/` |
| `hat-giong-giai-doan-2.md` mục 5 | KHÔNG vào kit — trao cho crm | — |
| `hat-giong-goi-cheo-loi-dieu-phoi.md` | `2026-12-02-hat-giong-goi-cheo-loi-dieu-phoi.md` | `delivery-loop/_acceptance/release-3-0-0/` |
| `hat-giong-sau-goi-dl-ba-kho.md` | `2026-12-02-hat-giong-sau-goi-dl-ba-kho.md` | hồ sơ DL2 `bang-chung-cu-theo-dau-vao` (gói đầu tiên đã dựng) |
| `hat-giong-tu-kho-cu.md` | `2026-12-02-hat-giong-chin-muc-mo-cua-kho-cu.md` | `delivery-loop/_acceptance/release-3-0-0/` |
| `de-xuat-sau-dl6.md` · `de-xuat-sua-chin-loi-dot-nen.md` | `docs/plans/`, giữ tên, thêm ngày | hồ sơ `giam-sat-doc-ban-uy-quyen` · hồ sơ Inventory `khung-luoi-va-ngan-chi-tiet` |

Phần còn lại của `migration/` (126 tệp, 2,3 MB: sổ, kế hoạch, đề bài đã dùng, công cụ, kịch bản, tra soát) vào nhánh
chính nguyên chỗ, làm sử liệu. Tên đích và dòng `Gốc:` là đề nghị; ngày làm thật soát lại theo luật neo đang hiệu lực.

## 5. Mục treo — mỗi mục một kết cục (D4)

Rà lại trọn sổ ngày 02/12; danh sách dưới là những mục phiên giữ đợt biết ngày 28/11.

| Mục | Kết cục đề nghị |
|---|---|
| Thước 7 ngày của K1 | **ĐÃ ĐO 28/11:** 7 ngày sau PR #100 của Inventory có 23 lần gộp ngược; với cấu hình kho đang dùng 4 lần còn xung đột, 0 lần ở `LO-TRINH.html` (không có dòng ấy thì 15 lần, 12 ở `LO-TRINH.html`). 7 ngày trước đó: 72/78 lần xung đột, 44 ở `LO-TRINH.html`. Giới hạn: phát lại giả định mọi cây làm việc đã bật bộ gộp; không đo lần gộp thật |
| K3 · K4 · K5 (đo trên năm vòng đầu sau mốc) | hạt giống có ngưỡng: đo sau khi Inventory nhận Mốc A |
| Đo lại điều kiện DL4 | hạt giống đã có ngưỡng: sau khi Inventory chạy xong một đợt kể từ `2df6f190` |
| C5 và C9 của đợt `nen` | C5 thành hạt giống trong vòng vá · C9 vào V2a |
| Câu báo Repo Standards về tên khoá bản uỷ quyền | chưa gửi — chủ kho quyết gửi hay bỏ |
| Chuông hằng ngày của phiên giữ đợt | hết cùng đợt; không đặt lại sau khi đóng |
| II.0 (3) phép thử phiên thật trên MacBook Pro | giữ nguyên kết cục 21/11: mở lại khi máy ấy làm vòng |
| PR #40 (tổng kết đợt `nen`) | đang xung đột với nhánh chính; phiên của PR ấy gỡ rồi chủ kho gộp — ngoài đợt này |

## 6. Đường đảo

- PR #21 chỉ thêm tệp tài liệu và gỡ một tệp luật: đảo bằng một PR hoàn lại. Nhánh `chuyen-nha` khôi phục được từ commit
  cha thứ hai của commit gộp.
- Lưu trữ kho cũ: bỏ lưu trữ. Lệnh ghi quan sát: rút lại là rút một chữ ký — việc của chủ kho.
