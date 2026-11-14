# Hình tại điểm quyết định — kich-ban-chuyen-nha (Cổng Phạm vi)

| Điểm | Đếm | Hình |
|---|---|---|
| Năm commit dọn nhà và chỗ ba thước đo (design §2, §8) | 5 bước nối tiếp + 3 nhánh đo | `duong-don-nha` |
| Hỏi-1 ngoại lệ luật chiều rộng (b) + hạn dừng | 2 nhánh, mỗi nhánh 1 bước — dưới ngưỡng (một dòng chữ đủ) | — |
| Hỏi-2 chốt bảng tên | 2 nhánh, 1 bước — dưới ngưỡng | — |
| Hỏi-3 tài liệu trong B1 | 2 nhánh, 1 bước — dưới ngưỡng | — |

## Đề bài hình `duong-don-nha`

- Loại: flowchart ngang (pipeline) kèm nhánh đo.
- Nút: `kit-cu/main` (mã nguồn S) → `1/5 dời sản phẩm vào plugins/<tên>/` → `2/5 tệp khai chợ + plugin` → `3/5 đổi tên theo bảng tên` → `4/5 con trỏ → URL kho cũ` → `5/5 khuôn Repo Standards 0.5.0` → nhánh cục bộ `don-nha/3.0`.
- Nhánh đo từ `don-nha/3.0`: «chạy hai lần → cùng mã cây» (AC-1) · «mỗi tệp sản phẩm đúng một chỗ» (AC-3, AC-4) · «chạy thử phiên thật: 6 plugin · lệnh và skill · 3 tác tử» (AC-6) · «bộ kiểm cây cũ so cây mới → lớp đỏ cho B2» (AC-10).
- Một nút phụ «dừng, nhánh không đổi» nối từ ba chỗ: thư mục gốc lạ · luật 0 khớp · khuôn xung đột (AC-9).
- Chữ trên hình: tiếng Việt, đúng các nhãn trên.
