# Điểm quyết định — release-3-2-0 (Cổng Phạm vi)

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 — tạo bản phát hành GitHub cho v3.2.0 | 1 nhánh rẽ (tạo / không), không bước nối tiếp | dưới ngưỡng N5 |
| Hỏi-2 — kho kit bật `feature_loop.ngoai_n_tu_dinh_tuyen` | 1 nhánh rẽ ba lối (cùng PR mốc / PR riêng / không bật), không bước nối tiếp | dưới ngưỡng N5 |
| Hỏi-3 — tối đa bốn lượt đo dài | 1 nhánh rẽ (cho / giữ hai), không bước nối tiếp | dưới ngưỡng N5 |
| Thẻ gắn vào đâu + thứ tự việc của mốc (máy quyết, cửa veto) | 9 bước nối tiếp, 2 nhánh rẽ (nhánh chính tiến bởi PR đổi `plugins/` → lối B · làn ghim lại hay lượt chấm đỏ → lượt dự phòng) | **cần hình** → `duong-di-moc.html` |

1 điểm vượt ngưỡng.

Giới hạn của hình (tác tử vẽ báo 28/11): hình có 13 hình khối và 16 đường nối, vượt trần 9 nút / 12 mũi tên của
`docs/reference/DIAGRAM-RULE.md` — giữ một hình vì đề bài đòi chín bước nối tiếp cộng hai nhánh rẽ đọc trong một lần nhìn.
Bản PNG chỉ chứa hình; tên hình nằm ở tiêu đề của bản HTML. PNG xuất bằng Chrome headless (máy không có Playwright).

## Đề bài hình `duong-di-moc` (flowchart, đọc trái → phải hoặc trên → dưới, một trang)

Tên hình: «Đường đi của mốc 3.2.0 — từ Cổng Phạm vi tới bản phát hành».

Nút nối tiếp (đúng thứ tự, nhãn bằng chữ dưới đây):

1. **Cổng Phạm vi** — chủ kho trả lời Hỏi-1, Hỏi-2, Hỏi-3 (lượt gọi người 1)
2. **Nâng số + CHANGELOG** — năm gói lên 3.2.0, mục 3.2.0, hạt giống `gio-may`, dòng cấu hình (Hỏi-2)
3. **Làn ghim lại** — một làn máy, năm hồ sơ của cửa sổ (lượt đo dài 1) · AC-7
4. **Lượt chấm** — mười eval máy + hội đồng đọc CHANGELOG (lượt đo dài 2) · AC-1…AC-10
5. **Rà commit gộp thử** — bộ kiểm trên bản gộp thử vào nhánh chính (lượt đo dài 3; bỏ nếu cây trùng byte cây đã chấm — Hỏi-3)
6. **Cổng Bằng chứng** — chủ kho ký và cho gộp một câu (lượt gọi người 2)
7. **PR mốc gộp** — commit gộp, khi CI của PR xanh
8. **CI trên commit gộp** — job `tests` chạy lại trọn bộ kiểm, 47–58 phút
9. **Gắn thẻ `v3.2.0`** vào commit gộp → `kiem-ban-cai --ref v3.2.0` → bản phát hành GitHub (chỉ khi Hỏi-1 = có)

Nhánh rẽ:

- Tại nút 3 và nút 4: «đỏ» → **sửa rồi chạy lại** (lượt dự phòng — lượt đo dài 4, Hỏi-3) → quay lại chính nút ấy.
- Giữa nút 2 và nút 7: «một PR đổi `plugins/` hoặc mang hồ sơ được ký gộp vào nhánh chính giữa vòng» → **lối B của 3.1.1**: thẻ
  gắn vào commit cuối nhánh mốc, hỏi lại chủ kho. «PR #40 (chỉ tài liệu) gộp giữa vòng» → gộp nhánh chính vào nhánh, đi tiếp,
  không ghim lại.

Chú thích nhỏ dưới hình: «Hai lượt gọi người trong thiết kế (trần T2 là 3). Thẻ chỉ gắn sau khi job `tests` trên commit gộp
xanh.»

AC liên quan: AC-7 (nút 3), AC-1…AC-10 (nút 4), AC-9 (kiểm bản cài trên HEAD ở nút 4; kiểm theo thẻ ở nút 9).
