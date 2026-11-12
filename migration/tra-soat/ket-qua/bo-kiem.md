# Ca kiểm bám bố cục cũ — tóm tắt

<!-- máy sinh bởi migration/tra-soat/bo-kiem.mjs từ kit-cu/main @ 909dffd8 (2026-11-12) — đừng sửa tay -->

Trong 1146 tệp của bộ kiểm, **273** tệp gọi sản phẩm bằng đường dẫn tính từ gốc kho; **118** trong số đó còn dựng bản cũ từ lịch sử git (lớp khó: commit cũ mang bố cục cũ).

| Bộ | Tệp gọi sản phẩm theo đường dẫn | Trong đó dựng bản cũ từ lịch sử |
|---|---|---|
| `tests/scripts` | 156 | 81 |
| `tests/dieu-phoi` | 47 | 17 |
| `tests/workflows` | 25 | 7 |
| `tests/plugins` | 18 | 5 |
| `tests/design-floor` | 12 | 4 |
| `tests/design-eval` | 11 | 3 |
| `tests/hooks` | 2 | 0 |
| `tests/fixtures` | 1 | 1 |
| `tests/skills` | 1 | 0 |

| Plugin được gọi | Số tệp kiểm |
|---|---|
| `acceptance-gate` | 220 |
| `feature-loop` | 135 |
| `dieu-phoi` | 52 |
| `road-map` | 9 |
| `tri-thuc` | 3 |
| `diagram-design` | 2 |

Giới hạn: đếm theo chữ, không chạy ca nào. Một tệp kiểm nhắc đường dẫn trong chú thích cũng bị đếm; một tệp ghép đường dẫn bằng biến (không phải chuỗi) thì lọt. Số đỏ thật chỉ biết khi chạy bộ kiểm trên cây đã dọn nhà — việc của B1.
