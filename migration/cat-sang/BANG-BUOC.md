# B3 — bảng các bước cắt sang, mốc 3.0 «Chuyển nhà»

Soạn 17/11/2026 ở phiên B3 (Mac Studio, Node 24.16.0), sau khi diễn tập trọn chuỗi trên nhánh cục bộ và bản sao — không gì
trong bảng này đã chạy thật. Cột «Diễn tập» nói phiên B3 đã tự đo gì; chỗ ghi «chưa diễn tập» là chưa đo, không phải đã ổn.

**Hình dạng:** kho mới thành nguồn bằng MỘT PR — PR số 1 của kho mới, từ nhánh ứng viên `cat-sang/3.0` vào `main`, gộp bằng
commit gộp. Nhánh ứng viên = nhánh chính kho cũ + 6 commit dọn nhà (kịch bản, tất định) + commit gộp nhánh `chuyen-nha`
(mang `migration/`, hồ sơ B1, B2, B3 và chữ ký của chúng) + các commit của mốc 3.0. `main` đi tới bằng một commit gộp, không
đẩy đè: lịch sử kho cũ, 31 thẻ và mọi commit chữ ký còn nguyên mã.

## Chặng 0 — trước chữ ký mốc (mọi thứ nằm trên nhánh, đảo bằng cách xoá nhánh)

| # | Bước | Đảo được? | Đường lùi | Ai làm | Diễn tập 17/11 |
|---|---|---|---|---|---|
| 0.1 | Dựng `don-nha/3.0` từ `kit-cu/main` bằng `don-nha.mjs`; kiểm mã cây bằng `thuoc-that.mjs` (năm lệnh) | có | xoá nhánh | máy | đã chạy: nguồn `0fe48c14` → commit `e3a7c105`, cây `53031519`; năm thước thoát 0 (≈ 2,7 phút) |
| 0.2 | Nếu kho cũ có commit mới sau `0fe48c14`: chạy lại 0.1 rồi đo lại giữ khoá (`do-lop-do.sh`, 60–80 phút) | có | — | máy, lượt đo dài phải hỏi | không cần hôm nay — nguồn chưa đổi, mã cây trùng cây B2 đã ký |
| 0.3 | Nhánh ứng viên `cat-sang/3.0` = `don-nha/3.0` + commit gộp `chuyen-nha` | có | xoá nhánh | máy | gộp sạch, 0 xung đột; `product-map --check` khớp không cần vẽ lại; ca RT13 đạt |
| 0.4 | Nội dung mốc trên nhánh ứng viên (danh sách ở hồ sơ mốc nháp): sáu plugin lên 3.0.0 · CHANGELOG · tài liệu cho kho tiêu thụ · ba glob chết của `_acceptance/config.yaml` · gỡ tệp luật của đợt · một dòng RT13 cho `migration/` · hồ sơ `release-3-0-0` | có | sửa hoặc bỏ commit | máy | nâng số bằng `tools/bump_version.py 3.0.0`: 6 tệp khai + tệp chợ đổi, `plugin_lint` OK 6 plugin; phần còn lại chưa viết |
| 0.5 | Ghim lại hồ sơ B1 và B2 trên cây ứng viên | có | — | máy, mỗi hồ sơ một lượt bộ kiểm ≈ 1 giờ → phải hỏi | đo được lý do: bộ chặn gộp của kit 3.0 trên cây 0.3 ra đúng 2 `VIOLATION`, cả hai là «bằng chứng hoá cũ» của B1 và B2 (mọi tệp đã dời); 215 hồ sơ khác OK. Làn ghim lại chưa chạy |
| 0.6 | Lượt chấm của hồ sơ mốc (S4) | có | chấm lại | máy ≈ 1 giờ | chưa chạy. Chạy sớm một phần: bộ kiểm sáu bước trên cây 0.3 (kết quả ở cuối tệp) · kiểm bản cài tám mục trên cây 0.3 + nâng số: ĐẠT 8/8, 6 gói, 638 tệp (2.39: 6 072 tệp) |

## Chặng 1 — cắt sang (sau chữ ký Cổng Bằng chứng của mốc; mỗi bước chỉ chạy khi chủ kho bảo)

| # | Bước | Đảo được? | Đường lùi | Ai làm | Diễn tập 17/11 |
|---|---|---|---|---|---|
| 1.1 | Kho mới: chỉ cho commit gộp (tắt gộp dồn; tắt rebase như đề xuất) — TRƯỚC PR đầu tiên | có | đặt lại ba cờ `allow_*` | chủ kho bảo, máy chạy `gh api` hoặc kịch bản Repo Standards với `--merge-method merge` | đọc 17/11: kho mới đang cho cả ba kiểu; kho cũ tắt gộp dồn, còn cho rebase |
| 1.2 | Rà phần sẽ lộ, rồi chuyển kho mới sang công khai (nếu chủ kho chọn) | **KHÔNG** — bản đã lộ không thu hồi được | chuyển riêng tư lại chỉ chặn người đọc mới | chủ kho bảo | quét bí mật 178 commit riêng của `chuyen-nha`: 3 mục, cả ba là dòng băm nội dung tệp trong `s4-args-r*.json`, không phải khoá. Còn 3 tệp `migration/` mang đường dẫn máy `/Users/…`, và sổ `tra-soat/ket-qua/kho-quy-hang.*` mang tên tệp của kho riêng tư Quỹ hàng — nằm trong LỊCH SỬ nhánh, gỡ tệp không gỡ được lịch sử |
| 1.3 | Bật chạy kiểm tự động (Actions) ở kho mới | có | tắt lại | chủ kho bảo | chưa đo hạn phút của kho riêng tư; kho công khai thì không tính phút — nên đứng sau 1.2 |
| 1.4 | Đẩy `cat-sang/3.0` lên GitHub, mở PR số 1 vào `main`; chờ CI xanh | có | đóng PR, xoá nhánh | máy, sau lời chủ kho | chưa diễn tập trên GitHub (Actions tắt). Cùng lệnh của việc `gate` chạy tại chỗ trên cây 0.3: 2 `VIOLATION` nói ở 0.5, `rules ran=4` |
| 1.5 | Gộp PR số 1 bằng commit gộp — `main` kho mới thành cây 3.0, kho mới thành nguồn | có, tới khi một kho cài 3.0 | trước 2.x: đặt `main` về `0fe48c14` (đẩy đè, cần gỡ khoá nhánh) — kho cũ chưa đổi gì nên không mất gì. Sau 2.x: chỉ sửa tiến | chủ kho bảo | — |
| 1.6 | Thẻ `v3.0.0` (có chú thích) trên commit gộp; `kiem-ban-cai.mjs --ref v3.0.0` | có, tới khi một kho ghim thẻ | xoá thẻ; thẻ đã có kho ghim thì không dời | chủ kho bảo | thẻ diễn tập trong một kho trần cục bộ (không ở kho này — lệnh cập nhật `main` của phiên giữ đợt đẩy mọi thẻ) |
| 1.7 | Khoá nhánh chính kho mới như kho cũ (qua PR, đòi `gate` và `tests`) | có | gỡ khoá | chủ kho bảo | — ; từ đây lệnh cập nhật `main` từ kho cũ hết dùng |
| 1.8 | Kho cũ đóng băng: PR tài liệu thêm lời chỉ đường sang `delivery-loop` vào README; KHÔNG lưu trữ kho (crm còn cài từ nó, đường lùi của Quỹ hàng dựa vào thẻ `v2.39.0`) | có | đảo PR | chủ kho bảo; việc ở kho cũ | chưa soạn |
| 1.9 | 5 PR đang mở và 26 vấn đề ở kho cũ: dời sang kho mới hay đóng | có | mở lại | chủ kho quyết từng nhóm | đọc 17/11: PR #377, #389, #396, #417, #418 |
| 1.10 | Bật quét bí mật + chặn đẩy bí mật, tự xoá nhánh sau gộp ở hai kho (việc số 1 còn treo của `TRANG-THAI.md`) | có | tắt lại | chủ kho bảo | đọc 17/11: kho cũ tắt cả; kho mới riêng tư không đọc được mục này |

## Chặng 2 — Quỹ hàng cài 3.0 (một PR ở kho ấy, trên cây làm việc riêng cắt từ `origin/main`)

| # | Bước | Đảo được? | Đường lùi | Ai làm | Diễn tập 17/11 (bản sao rời của Quỹ hàng `f1d123ee`, thẻ diễn tập) |
|---|---|---|---|---|---|
| 2.0 | Điều kiện: kho mới công khai, HOẶC Quỹ hàng có một bí mật đọc được kho mới | — | — | chủ kho | CI Quỹ hàng kéo kit bằng `git fetch https://github.com/…` không mã truy cập; kho mới riêng tư thì bước ấy hỏng. Một ca thử của hồ sơ `ghim-lai-ban-that-qua-ci` cũng kéo kit kiểu ấy |
| 2.1 | Phía CI — 4 tệp, 13 dòng: `ci.yml` và `ghim-lai-ban-that.yml` (kho kit, `KIT_TAG: v3.0.0`, gốc lõi = `plugins/acceptance-gate`, đường `plugins/feature-loop/scripts/repin-lane.mjs`), `AGENTS.md`, ca thử `thu/kiem-nut.mjs` | có | đảo PR; kho cũ còn nguyên thẻ `v2.39.0` | máy soạn, chủ kho bảo mở PR | bước 1 của `gate`: 171 hồ sơ OK, đúng 1 `VIOLATION` — hồ sơ `ghim-lai-ban-that-qua-ci` hoá cũ (như PR nâng 2.39, #246); kit 2.39 trên cùng PR cho đúng dòng ấy. Bước 2 (`product-map --check`): thoát 0 |
| 2.2 | Ghim lại `ghim-lai-ban-that-qua-ci` bằng kit 3.0 | có | — | máy | năm eval máy của hồ sơ (`kiem-nut.mjs --tinh --pha --chan --trong --quet`) đều «KẾT: ĐẠT» với lõi 3.0; `--trong` chạy chính làn ghim lại của kit 3.0. Bảy lệnh bộ kiểm chung của kho ấy chưa chạy (cần cài gói) |
| 2.3 | Phía phiên — `.claude/settings.json` (chợ + 6 khoá bật plugin, 3 khoá đổi tên plugin), `tim-kit.mjs`, một lệnh trong `config.yaml` | có | đảo PR, bật lại chợ cũ | máy soạn; **chủ kho bảo** (quyết định «plugin ở kho tiêu thụ để nguyên» còn hiệu lực) | thêm nhóm này, PR thành hạng T3 (tệp cài đặt nằm trong đường T3 của kho ấy); phán quyết bộ chặn gộp không đổi (vẫn đúng 1 `VIOLATION` ở 2.1) |
| 2.4 | Trên máy làm vòng: thêm chợ `delivery-loop`, cài sáu plugin, không bật song song hai chợ trong một kho | có | cài lại chợ cũ | **chủ kho bảo** | lớp nạp đã đo ở thước B1 (`thuoc-that.mjs --phien`): 6 plugin, không mất không thừa; chưa cài lên máy thật |
| 2.5 | Gộp PR ở Quỹ hàng bằng commit gộp | có | đảo commit cài + bật lại chợ cũ — kho tiêu thụ không mất hồ sơ nào | chủ kho bảo | — |

## Chặng 3 — Repo Standards, nửa (b)

| # | Bước | Đảo được? | Ai làm | Ghi chú |
|---|---|---|---|---|
| 3.1 | Đổi lời trỏ ở hai README sang `delivery-loop` cùng ca ghim tên cũ (`tests/run.sh`) | có | chủ kho bảo; phiên riêng ở kho ấy | kho ấy công khai: chỉ làm khi kho mới đã công khai, và không đưa chi tiết kho riêng tư vào commit hay PR |

## Chặng 4 — ngưỡng thực tế (điều kiện ĐÓNG ĐỢT, đến sau ngày cắt — hôm nay CHƯA ĐẠT vế nào)

| Vế | Đo bằng | Hôm nay |
|---|---|---|
| 1 — một vòng thật ở Quỹ hàng gộp được trên kit 3.0 | `node migration/cat-sang/nguong-thuc-te.mjs ve-1 --kho <Quỹ hàng> --kit <kit 3.0> --gop <commit gộp> --cai <commit cài>` | chưa đo được — chưa có commit cài. Lệnh đã chạy thử hai chiều đỏ: trên nhánh chính hôm nay trượt 5 lý do; trên bản sao diễn tập (đã cài, chưa có vòng) trượt đúng 1 lý do «không hồ sơ nào ký sau commit cài» |
| 2 — năm dòng số không xấu đi do kit mới | `… nguong-thuc-te.mjs cua-so --tu <mốc> --den <mốc>` cho ký→gộp (bộ đo `do-gop.mjs` của kit) · `loop-health.mjs --root … --at … --since …` cho làm-xong→ký và lượt chấm bị đốt · lượt gọi người đếm tay | chưa đo được. Số nền đo 17/11: cửa sổ 2.39 ở Quỹ hàng RỖNG (0 vòng gộp từ commit cài `f1d123ee`); cửa sổ 2.37→2.39 (`07c30222..f1d123ee`) có 15 vòng, ký→gộp trung vị 9 phút, p75 13 phút |
| 3 — chủ kho ghi `da-cham-boi-thuc-te` | thao tác `observed` của chủ kho sau cửa sổ quan sát | chưa tới — cửa sổ chỉ bắt đầu ở commit cài |

## Lượt đo dài 17/11 — bộ kiểm sáu bước trên cây 0.3 (commit gộp diễn tập `823adf4f`)

Chạy bằng `migration/kich-ban/chay-bo-kiem.sh` trên một bản kéo riêng tên `delivery-loop`. Kết quả ghi ở dưới khi lượt xong.

(đang chạy lúc soạn bảng)
