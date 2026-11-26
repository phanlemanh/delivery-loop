# Hình tại Cổng Phạm vi — nang-repo-setup-0-10-4

Kê từ sổ quyết định cuối S1 (bảy câu chỉ-người-biết) và chỗ thiết kế đổi CI. Ngưỡng N5: ba bước nối tiếp hoặc hai nhánh rẽ.

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi — job `khung` chặn `tests` (CỘNG) | 4 bước nối tiếp: PR/đẩy → job `khung` (lint + dấu xung đột) → bước gom của `tests` đọc kết quả → kiểm bắt buộc đỏ/xanh; 2 nhánh sự kiện (PR · đẩy nhánh chính) | `khung-chan-tests` |
| Hỏi — hai dòng `deny` | dưới ngưỡng: 1 bước, 1 nhánh (nhận / không nhận từng dòng) | — |
| Hỏi — bốn tệp mới, gỡ hai tệp `ci_*` | dưới ngưỡng: 1 nhánh | — |
| Hỏi — mục `## Language` | dưới ngưỡng: 1 nhánh | — |
| Hỏi — luật chiều rộng (b) | dưới ngưỡng: 1 nhánh | — |
| Hỏi — bỏ đường nền | dưới ngưỡng: 1 nhánh | — |
| Hỏi — Node 24 cho tác tử chấm | dưới ngưỡng: 1 nhánh | — |

## Đề bài hình `khung-chan-tests`

- Loại: luồng (flowchart), trái → phải, hai làn sự kiện.
- Nút: «PR mở / cập nhật» và «đẩy lên main» → «job khung: plugin_lint.py + upgrade_markers.py» (song song với «mảnh kiểm» trên PR, «lượt trọn» trên đẩy) → «tests: bước gom khung — đọc needs.khung.result» → «kiểm bắt buộc tests: xanh / đỏ».
- Nhãn chữ: «khung đỏ → tests đỏ → không gộp được»; «không cần Node, vài giây».
- AC liên quan: AC-5 (và AC-4 cho tường dấu xung đột).
