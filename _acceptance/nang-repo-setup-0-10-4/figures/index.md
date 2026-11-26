# Hình tại Cổng Phạm vi — nang-repo-setup-0-10-4

Kê từ sổ quyết định cuối S1 (bốn câu chỉ-người-biết sau khi gộp và chuyển hai câu thành dòng báo) và chỗ thiết kế đổi CI. Ngưỡng N5: ba bước nối tiếp hoặc hai nhánh rẽ.

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi — phê ba phần thêm (phần 1: việc CI `khung` chặn `tests`) | 4 bước nối tiếp: PR/đẩy → job `khung` (lint + dấu xung đột) → bước gom của `tests` đọc kết quả → kiểm bắt buộc đỏ/xanh; 2 nhánh sự kiện (PR · đẩy nhánh chính) | `khung-chan-tests` |
| Hỏi — mục «Ngôn ngữ» trong tệp luật kho | dưới ngưỡng: 1 nhánh | — |
| Hỏi — Node 24 cho tác tử chấm | dưới ngưỡng: 1 nhánh | — |
| Hỏi — mỗi gói giữ số riêng | dưới ngưỡng: 1 nhánh | — |

Luật chiều rộng (b) và việc bỏ đường nền: máy đã quyết (dòng báo, cửa veto), không phải điểm quyết định của người.

## Đề bài hình `khung-chan-tests`

- Loại: luồng (flowchart), trái → phải, hai làn sự kiện.
- Nút: «PR mở / cập nhật» và «đẩy lên main» → «job khung: plugin_lint.py + upgrade_markers.py» (song song với «mảnh kiểm» trên PR, «lượt trọn» trên đẩy) → «tests: bước gom khung — đọc needs.khung.result» → «kiểm bắt buộc tests: xanh / đỏ».
- Nhãn chữ: «khung đỏ → tests đỏ → không gộp được»; «không cần Node, vài giây».
- AC liên quan: AC-5 (và AC-4 cho tường dấu xung đột).
