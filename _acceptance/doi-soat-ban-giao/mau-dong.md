# Mẫu chữ đối soát bàn giao — do mã sinh

Sinh bởi ca DS-03 của `tests/dieu-phoi/doi-soat-ban-giao.test.mjs` (`DS_GHI_MAU=1` để ghi lại). Mỗi mục là
toàn bộ các dòng `doi_soat.dong` mà lệnh nối lại in ra trong đúng tình huống ở tiêu đề. Đừng sửa tay.

## Khớp hết — không gì đổi sau bàn giao

```text
đối soát bàn giao bg-20261011T080000Z: 2 dãy khớp bản ghi lúc bàn giao · khoá và đơn khớp · nhánh chính không dời
```

## Lệch (a) — P1 thêm một commit rồi đẩy

```text
đối soát bàn giao bg-20261011T080000Z: 1/2 dãy khớp · 1 dòng cần đọc
dãy P1: đỉnh tiến 1 commit sau bàn giao (lúc bàn giao 82ad025, nay 6de04f7)
```

## Lệch (b) — P1 đổi sang nhánh khác cùng đỉnh, đã đẩy

```text
đối soát bàn giao bg-20261011T080000Z: 1/2 dãy khớp · 1 dòng cần đọc
dãy P1: đang ở nhánh khác (lúc bàn giao p1, nay p1-b)
```

## Lệch (c) — P1 lùi một commit

```text
đối soát bàn giao bg-20261011T080000Z: 1/2 dãy khớp · 1 dòng cần đọc
dãy P1: đỉnh lùi 1 commit so với lúc bàn giao (lúc bàn giao 82ad025, nay 65fb51e) — commit sau đỉnh mới không còn trên nhánh này
```

## Lệch (d) — P1 có tệp chưa commit

```text
đối soát bàn giao bg-20261011T080000Z: 1/2 dãy khớp · 1 dòng cần đọc
dãy P1: cây làm việc nay có thay đổi chưa commit (lúc bàn giao sạch)
```

## Lệch (e) — hồ sơ của P2 đổi status bằng một commit đã đẩy

```text
đối soát bàn giao bg-20261011T080000Z: 1/2 dãy khớp · 2 dòng cần đọc
dãy P2: đỉnh tiến 1 commit sau bàn giao (lúc bàn giao 38205ae, nay 56dd9b2)
dãy P2: hồ sơ đổi (lúc bàn giao hang-b implemented, nay hang-b verified)
```

## Lệch (f) — khoá s4 P2 đang giữ được nhả

```text
đối soát bàn giao bg-20261011T080000Z: 2/2 dãy khớp · 1 dòng cần đọc
khoá: lúc bàn giao «s4: P2», nay «không có»
```

## Lệch (g) — thêm đơn xin/P1-s4.json

```text
đối soát bàn giao bg-20261011T080000Z: 2/2 dãy khớp · 1 dòng cần đọc
đơn xin lượt: lúc bàn giao «không có», nay «P1-s4.json»
```

## Lệch (h) — nhánh chính tiến hai commit

```text
đối soát bàn giao bg-20261011T080000Z: 2/2 dãy khớp · 1 dòng cần đọc
nhánh chính (main) dời 2 commit sau bàn giao (lúc bàn giao 7f9681f, nay fd74379)
```

## Lệch (i) — worktree P2 bị gỡ

```text
đối soát bàn giao bg-20261011T080000Z: 1/2 dãy khớp · 1 dòng cần đọc
dãy P2: thư mục làm việc không còn (lúc bàn giao ở nhánh p2 @ 38205ae)
```

## Lệch (j) — thêm dãy P3 vào đợt

```text
đối soát bàn giao bg-20261011T080000Z: 2/3 dãy khớp · 1 dòng cần đọc
dãy P3: mới thêm vào đợt sau bàn giao — không có bản ghi lúc bàn giao để so
```

## Lệch (k) — P1 viết lại commit đỉnh rồi đẩy cưỡng bức

```text
đối soát bàn giao bg-20261011T080000Z: 1/2 dãy khớp · 1 dòng cần đọc
dãy P1: đỉnh khác lịch sử với lúc bàn giao (lúc bàn giao 82ad025, nay b8a2262) — nhánh đã bị viết lại
```

## Lệch (l) — gỡ dãy P2 khỏi đợt

```text
đối soát bàn giao bg-20261011T080000Z: 1/2 dãy khớp · 1 dòng cần đọc
dãy P2: có lúc bàn giao, nay không còn trong đợt
```

## Chưa đẩy (a) — P1 commit thêm sau lần đẩy cuối

```text
đối soát bàn giao bg-20261011T080000Z: 2/2 dãy khớp · 1 dòng cần đọc
dãy P1: CHƯA ĐẨY nhánh p1 — commit chỉ có ở máy này (đỉnh 216e8da)
```

## Chưa đẩy (b) — P1 ở nhánh mới chưa từng đẩy

```text
đối soát bàn giao bg-20261011T080000Z: 2/2 dãy khớp · 1 dòng cần đọc
dãy P1: CHƯA ĐẨY nhánh p1-moi — commit chỉ có ở máy này (đỉnh 82ad025)
```

## Bản bàn giao cũ thiếu trường sha_nhanh_chinh (kèm P1 thêm một commit)

```text
đối soát bàn giao bg-20261011T080000Z: 1/2 dãy khớp · 2 dòng cần đọc
dãy P1: đỉnh tiến 1 commit sau bàn giao (lúc bàn giao 82ad025, nay d73c5ea)
bản bàn giao thiếu trường «sha_nhanh_chinh» (ghi bằng bản gói cũ) — không so được nhánh chính dời bao nhiêu commit
```

## Bản bàn giao cũ thiếu trường khoa (kèm P1 thêm một commit)

```text
đối soát bàn giao bg-20261011T080000Z: 1/2 dãy khớp · 2 dòng cần đọc
dãy P1: đỉnh tiến 1 commit sau bàn giao (lúc bàn giao 82ad025, nay d73c5ea)
bản bàn giao thiếu trường «khoa» (ghi bằng bản gói cũ) — không so được khoá đang giữ
```

## Bản bàn giao cũ thiếu trường don (kèm P1 thêm một commit)

```text
đối soát bàn giao bg-20261011T080000Z: 1/2 dãy khớp · 2 dòng cần đọc
dãy P1: đỉnh tiến 1 commit sau bàn giao (lúc bàn giao 82ad025, nay d73c5ea)
bản bàn giao thiếu trường «don» (ghi bằng bản gói cũ) — không so được đơn xin lượt
```

## Bản bàn giao cũ thiếu trường cay_ban (kèm P1 thêm một commit)

```text
đối soát bàn giao bg-20261011T080000Z: 1/2 dãy khớp · 2 dòng cần đọc
dãy P1: đỉnh tiến 1 commit sau bàn giao (lúc bàn giao 82ad025, nay d73c5ea)
bản bàn giao thiếu trường «cay_ban» (ghi bằng bản gói cũ) — không so được cây làm việc có thay đổi chưa commit
```

## Bản bàn giao cũ thiếu trường nhanh (kèm P1 thêm một commit)

```text
đối soát bàn giao bg-20261011T080000Z: 1/2 dãy khớp · 2 dòng cần đọc
dãy P1: đỉnh tiến 1 commit sau bàn giao (lúc bàn giao 82ad025, nay d73c5ea)
bản bàn giao thiếu trường «nhanh» (ghi bằng bản gói cũ) — không so được nhánh đang làm của dãy
```

## Không có bản bàn giao mở trước lúc nối lại

```text
đối soát bàn giao bg-20261011T080000Z: không có bản bàn giao mở trước lúc nối lại — bản bàn giao dựng ngay lúc nối lại, không có gì để so
```
