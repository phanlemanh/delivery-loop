# Vi phân phán quyết — thước của B3 và số đo 17/11/2026

Thước của hàng B3 trong `KE-HOACH.md` mục 12 và hàng G1 của `KHAC-BIET-DU-KIEN.md`: chạy bộ chặn gộp bằng nhiều bản kit trên
CÙNG một cây hồ sơ thật, so phán quyết. Chỉ phần lệch mới quy được về việc đổi kit.

| Tệp | Việc |
|---|---|
| `vi-phan.mjs` | Chạy `pre-merge-check.sh . --recheck-all --base <nhánh chính>` (thêm `product-map --check` với `--ban-do`) bằng từng bản kit, so mã thoát · túi dòng `VIOLATION` · tập hồ sơ có dòng `OK` · dòng sổ luật. Thoát 0 không lệch · 1 lệch, nêu từng dòng · 2 không đọc được |
| `tu-kiem.mjs` | Phá thử hai chiều thước trên bằng bộ chặn gộp thật và hồ sơ thật — sáu ca C0–C4b |
| `duong-chet.mjs` | Quét đường và glob trong tệp cấu hình gốc của kho kit: khớp tệp ở cây cũ mà 0 tệp ở cây mới |

Mọi lệnh chạy dưới Node 24 (`export PATH=/opt/homebrew/opt/node@24/bin:$PATH`).

## Số đo — tất cả do phiên B3 tự đo ngày 17/11/2026 trên Mac Studio, Node 24.16.0

Ba bản kit: **A** thẻ `v2.39.0` (`0c4e503b`, bản Quỹ hàng đang ghim) · **B** nhánh chính kho cũ `0fe48c14` (bố cục cũ) ·
**C** cây kịch bản dựng từ `0fe48c14` (`don-nha.mjs`, commit `e3a7c105`, mã cây `53031519` — trùng mã cây B2 đã đo và ký).
A→B là phần đổi của bốn vòng kho cũ sau 2.39; B→C là phần đổi của riêng việc dọn nhà.

| Kho · cây | Bản kit | Mã thoát | `VIOLATION` | Hồ sơ có dòng `OK` | `NOTE` | Sổ luật | Giây |
|---|---|---|---|---|---|---|---|
| Quỹ hàng · `origin/main` `f1d123ee` (177 mục dưới `_acceptance/`) | A · B · C | 0 · 0 · 0 | 0 · 0 · 0 | 172 · 172 · 172 | 69 · 69 · 69 | `rules ran=4 declared-off=0 expected=4` cả ba | 95 · 92 · 93 |
| crm · `origin/onehub` `74a29a68` (392 mục) | A · B · C | 0 · 0 · 0 | 0 · 0 · 0 | 366 · 366 · 366 | 150 · 150 · 150 | như trên, cả ba | 196 · 193 · 189 |

- **Phán quyết lệch: 0** ở cả hai kho, A→B và A→C. Sau khi che đường đặt bản kit, đầu ra của ba bản giống nhau từng dòng
  (`diff` rỗng: 247 dòng ở Quỹ hàng, 522 dòng ở crm).
- **Bước hai của việc `gate`** (`product-map.mjs --root . --check`): thoát 0 và cùng hai dòng đầu ra ở cả ba bản kit, cả hai kho.
- Lệnh: `bash <gốc lõi>/scripts/pre-merge-check.sh . --recheck-all --base origin/main` (crm: `origin/onehub`), gốc lõi của C là
  `plugins/acceptance-gate`. Có `--base` ở mọi lượt (thiếu thì hai luật tự báo vi phạm giả — `BOI-CANH.md`).
- crm hôm nay chạy cổng bằng 37 tệp chép từ kit, không bằng bản kéo kit; số của crm ở đây nghĩa là «nếu crm trỏ cổng sang
  kit 3.0 thì phán quyết không đổi», không phải «crm đã chạy 3.0».

### Hai chiều — vì 0 dòng `VIOLATION` ở cả hai bên tự nó là 0 = 0

`tu-kiem.mjs` chạy trên bốn hồ sơ đã ký đầu tiên (theo tên) của mỗi kho, A so C:

| Ca | Quỹ hàng | crm |
|---|---|---|
| C0 đối chứng dương — cây nguyên vẹn | cũ OK 4 · mới OK 4 · lệch 0 | như bên |
| C1 cùng bắt — tiêm bốn vi phạm vào bản sao cây hồ sơ (chữ ký rỗng · verdict FAIL · cưỡng chế tắt · có bypass) | cũ 4 `VIOLATION` thoát 1 · mới 4 `VIOLATION` thoát 1 · lệch 0 | như bên |
| C2 độ nhạy — tắt luật «chữ ký rỗng» trong bản sao lõi mới | thước ĐỎ, 1 lệch, nêu đúng dòng của hồ sơ bị tiêm | như bên |
| C3 độ đặc hiệu — bản sao lõi ở đường khác, đổi một dòng chú thích, thêm một tệp tài liệu | lệch 0, chỉ đọc 0 | như bên |
| C4 không đọc được — thư mục không có bộ chặn gộp | báo cáo thoát 2 («mã thoát 127»), không in dòng «phán quyết lệch» | như bên |
| C4b dừng sớm — bản chụp chỉ có `VIOLATION [config]`, không dòng sổ luật | không đọc được | như bên |

6/6 ca đạt (chạy lại sau khi sửa thước: Quỹ hàng; crm đo ở bản thước trước khi sửa, 5/5).

```bash
node migration/vi-phan/tu-kiem.mjs --kho <bản kéo kho tiêu thụ> --ref origin/main --base origin/main --cu <kit cũ> --moi <cây mới>/plugins/acceptance-gate
```

## Lệch tìm thấy — ở chính kho kit, không ở kho tiêu thụ

Kho kit tự chạy kit trên mình, nên nó là kho tiêu thụ thứ ba. Trên cây C, `_acceptance/config.yaml` còn ba glob viết theo
bố cục cũ; bước 6 của kịch bản đổi đường từ hai đoạn trở lên nên bỏ sót glob một đoạn:

| Dòng (cây C) | Glob | Ở cây cũ | Ở cây mới | Hệ quả |
|---|---|---|---|---|
| `risk_tiers.t3_paths` 1252 | `hooks/**` | khớp 3 tệp | 0 | PR chạm móc của lõi tụt T3 → T2 |
| `risk_tiers.t3_paths` 1253 | `lib/**` | khớp 17 tệp | 0 | PR chạm `lib/evidence-core.cjs` tụt T3 → T2 |
| `risk_tiers.t1_skip_globs` 1223 | `evals/**` | khớp 17 tệp | 0 | Ca đo skill thôi được miễn T1 — chặt hơn, không lỏng hơn |

Đo bằng chính bộ phân hạng của cổng (`pre-merge-check.sh . --base HEAD~1 --hang-pr` trên một commit thử chỉ thêm một dòng chú thích):

| Tệp chạm | Bố cục cũ (`0fe48c14`) | Bố cục mới (cây C) |
|---|---|---|
| `lib/evidence-core.cjs` | `hang=T3` | **`hang=T2`** |
| `hooks/hooks.json` | `hang=T3` | **`hang=T2`** |
| `scripts/recheck-evidence.cjs` (đối chứng: dòng đã được đổi đường) | `hang=T3` | `hang=T3` |
| `scripts/product-map.mjs` (đối chứng: không thuộc T3) | `hang=T2` | `hang=T2` |

```bash
node migration/vi-phan/duong-chet.mjs --kho . --cu kit-cu/main --moi don-nha/b3
```

In ba dòng `ĐƯỜNG CHẾT`, thoát 1 (1 007 chuỗi đường ở 6 tệp cấu hình gốc); đối chứng cây cũ so với chính nó: 0 đường chết.
Bộ kiểm sáu bước và thước giữ khoá của B2 không thấy lớp này — không ca nào ghim nội dung danh sách ấy trên chính kho kit.
Tìm `t3_paths` trong `migration/`, sáu hồ sơ của đợt, hạt giống `docs/plans/*hat-giong*` và `docs/findings/`: chưa thấy mục nào
nói điều này — chưa thấy, không phải chắc chắn chưa có.

**Nghiệm đề xuất:** sửa ba dòng trong PR mốc 3.0 ở kho mới (sau commit dọn nhà), kèm một tệp đo trong hồ sơ mốc có chiều đỏ
trên commit dọn nhà — không sửa kịch bản. Lý do: sửa kịch bản làm đổi mã cây, hai báo cáo đã ký của B2 (`giu-khoa.md`,
`lop-do.md` ghim `53031519`) phải đo lại một lượt 60–80 phút và B1, B2 phải ghim lại thêm lần nữa. Lên thẻ Cổng Phạm vi.

## Lượt rà độc lập 17/11 và phần đã sửa

Một tác tử rà mã đọc bốn tệp (không được cho biết kết quả đo). Sửa ngay các mục có thể cho xanh giả: bản chụp chỉ có
`VIOLATION [config]` nay là «không đọc được» (trước đó hai bản kit cùng dừng sớm ra «0 lệch») · dòng thụt lề sau một
`VIOLATION` tính vào chính vi phạm ấy, dấu `T1-ESCAPE` và mọi dòng `pre-merge-check:` tính vào sổ luật · hàm che chỉ che
đường tuyệt đối · hai `--kit` trùng nhãn hay trùng đường bị từ chối · `tu-kiem.mjs` dọn cây tạm ở mọi lối ra và C4 gọi đúng
hàm báo cáo · `duong-chet.mjs` cắt dấu phẩy dính cuối, nhận glob bắt đầu bằng `*` hay `{`, báo tệp cấu hình mất ở cây mới.
Sau khi sửa, chạy lại trên bản chụp cũ: vẫn 0 lệch ở cả hai kho; `duong-chet.mjs` in thêm một dòng thứ tư (`evals/` trong
dòng chú thích đứng trên chính glob ấy).

## Giới hạn đã khai

- Phép so đọc đầu ra của bộ chặn gộp; nó không chạy lượt chấm S4, không chạy móc. Móc do bộ kiểm hooks giữ (71 ca, thuộc
  túi khoá B2); đường chấm chỉ được đo thật ở vòng đầu tiên của Quỹ hàng trên kit 3.0 (ngưỡng thực tế, vế 1).
- Bản chụp đầu ra thô nằm ở thư mục tạm của phiên, không vào kho: nó mang tên hồ sơ và chữ ký của hai kho tiêu thụ, mà kho
  này có thể chuyển công khai. Chạy lại bằng `vi-phan.mjs` mất dưới 15 phút cho cả hai kho.
- `duong-chet.mjs` đọc sáu tệp cấu hình ở gốc; đường ghép bằng biến lúc chạy thì lọt; chuỗi trong chú thích cũng được tính.
- `vi-phan.mjs` chạy các bản kit lần lượt trên cùng một cây; nếu bộ chặn gộp ghi vào cây thì lượt sau thấy trạng thái đã đổi — chưa kiểm (sau ba lượt, `git status` của hai cây hồ sơ sạch).
- `nguong-thuc-te.mjs`: giờ ký và giờ gộp là ngày commit (nhánh rebase sau chữ ký thì giờ ký trôi); hai commit gộp cùng một giây có thể gán nhầm mã cho nhau.
