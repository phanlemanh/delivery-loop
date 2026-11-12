# Sổ kiểm kê tệp — tóm tắt

<!-- máy sinh bởi migration/tra-soat/kiem-ke.mjs từ kit-cu/main @ 909dffd8 (2026-11-12) — đừng sửa tay, chạy lại kịch bản -->

Mã commit: `909dffd8` (2026-11-12) · tổng **5725** tệp, mỗi tệp đúng một lớp.

## Theo lớp

| Lớp | Số tệp |
|---|---|
| `ho-so-vong` | 3037 |
| `bo-kiem` | 1146 |
| `so-lam-viec` | 835 |
| `san-pham` | 614 |
| `tai-lieu-song` | 62 |
| `chua-ro` | 20 |
| `cong-cu-kho` | 6 |
| `may-ve` | 2 |
| `phap-ly` | 2 |
| `nhat-ky` | 1 |

`san-pham` = lần tới được từ điểm vào của một plugin. `chua-ro` = nằm trong vùng của một plugin mà không lần tới được — người thiết kế B1 xếp tay. Các lớp khác do `luat-xep.json` khai.

## Theo plugin

| Plugin | Thư mục nguồn | Sản phẩm (điểm vào / lần tới / gọi chéo) | Chưa rõ: bộ kiểm gọi · chỉ trùng tên · không ai gọi |
|---|---|---|---|
| `acceptance-gate` | `./` | 285 (76 / 202 / 7) | 14: 1 · 3 · 10 |
| `feature-loop` | `feature-loop` | 29 (8 / 16 / 5) | 3: 2 · 1 · 0 |
| `diagram-design` | `diagram-design` | 214 (214 / 0 / 0) | 3: 3 · 0 · 0 |
| `dieu-phoi` | `dieu-phoi` | 75 (10 / 59 / 6) | 0: 0 · 0 · 0 |
| `road-map` | `road-map` | 7 (7 / 0 / 0) | 0: 0 · 0 · 0 |
| `tri-thuc` | `tri-thuc` | 4 (4 / 0 / 0) | 0: 0 · 0 · 0 |

### Chưa rõ, theo thư mục

| Thư mục | Số tệp | Bộ kiểm gọi | Không ai gọi |
|---|---|---|---|
| `design-floor/vendor` | 9 | 0 | 8 |
| `diagram-design` | 3 | 3 | 0 |
| `feature-loop/scripts` | 3 | 2 | 0 |
| `vendor/impeccable` | 3 | 0 | 1 |
| `lib` | 1 | 1 | 0 |
| `scripts` | 1 | 0 | 1 |

## Tham chiếu chéo giữa plugin

Gãy khi mỗi plugin vào một thư mục riêng, TRỪ kiểu `qua-resolve-plugin` (tìm plugin kia trong bản cài). `nhac` là chữ nhắc tới tệp của plugin khác — có thể chỉ là chú thích.

| Từ → tới | Kiểu | Số cạnh |
|---|---|---|
| feature-loop → acceptance-gate | `nhac` | 45 |
| feature-loop → acceptance-gate | `qua-resolve-plugin` | 26 |
| acceptance-gate → feature-loop | `nhac` | 19 |
| acceptance-gate → dieu-phoi | `nhac` | 10 |
| tri-thuc → acceptance-gate | `nhac` | 6 |
| road-map → acceptance-gate | `nhac` | 5 |
| acceptance-gate → dieu-phoi | `import-tuong-doi` | 4 |
| dieu-phoi → acceptance-gate | `nhac` | 4 |
| road-map → acceptance-gate | `qua-resolve-plugin` | 4 |
| acceptance-gate → dieu-phoi | `goc-plugin` | 3 |
| dieu-phoi → acceptance-gate | `qua-resolve-plugin` | 1 |
| feature-loop → dieu-phoi | `nhac` | 1 |
| tri-thuc → acceptance-gate | `qua-resolve-plugin` | 1 |

## Con trỏ từ sản phẩm ra ngoài sản phẩm

Sản phẩm nhắc tới một tệp không phải sản phẩm. Hôm nay plugin lõi mang cả kho nên con trỏ còn sống; sau khi lõi vào thư mục riêng chúng treo trong bản cài. Cột «mơ hồ»: đích là một tên tệp ở gốc (vd `CLAUDE.md`, `PRODUCT-MAP.md`) mà kho tiêu thụ cũng có — phần lớn chữ ấy nói về tệp của kho tiêu thụ, không phải của kit.

| Lớp của đích | Con trỏ rõ (có thư mục) | Con trỏ mơ hồ | Số tệp sản phẩm nhắc (rõ) |
|---|---|---|---|
| `so-lam-viec` | 44 | 0 | 34 |
| `tai-lieu-song` | 8 | 35 | 8 |
| `bo-kiem` | 30 | 0 | 22 |
| `may-ve` | 0 | 29 | 0 |

## Đường dẫn khai chặt mà trỏ vào không có gì (treo từ hôm nay)

| Kiểu | Số |
|---|---|
| `import-trong-ma-nhap-ngoai` | 7 |

Chi tiết từng dòng: `kiem-ke.tsv` (mọi tệp trừ hồ sơ vòng, sổ làm việc, bộ kiểm — ba lớp đó chỉ đếm), `tham-chieu-cheo.tsv`, `con-tro-ra-ngoai.tsv`, `tro-treo.tsv`.
