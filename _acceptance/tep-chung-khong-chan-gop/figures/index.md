# Hình tại điểm quyết định — Cổng Phạm vi, hồ sơ `tep-chung-khong-chan-gop`

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 — hai view rời git ở kho bật, hay máy mở PR vẽ lại sau mỗi lần gộp | 5 bước nối tiếp, 2 nhánh rẽ (kho bật? · forge thấy xung đột?) | cần hình: `hai-view-pr-den-gop` |
| Hỏi-3 — kho kit có tự bật khoá trong vòng này | 1 bước, 2 nhánh rẽ (bật · chưa bật) | dùng chung hình trên: nhánh rẽ «kho bật?» |
| Hỏi-2 — Node 24 cho tác tử chấm | 1 bước, 0 nhánh trong luồng (ba lối là ba câu trả lời) | dưới ngưỡng: 1 bước, 0 nhánh |
| Mười lựa chọn máy đã quyết ở bước thiết kế (sổ S1) | mỗi dòng 1 bước, 0 nhánh | dưới ngưỡng: bảng trên thẻ là đủ |

## Đề bài hình `hai-view-pr-den-gop`

- Loại hình: sơ đồ luồng hai làn song song (trên: «hôm nay / kho không bật», dưới: «kho bật `ban_do.ngoai_git`»), đọc
  trong một phút.
- Tiêu đề: «Một PR đổi một hồ sơ — từ lúc ký tới lúc gộp được».
- Làn trên, theo thứ tự: «Lệnh cổng vẽ lại bản đồ và trang lộ trình» → «Commit đưa hai view vào PR» → «Nhánh chính dời
  (PR khác gộp trước)» → rẽ «Forge thấy xung đột ở hai view?»: CÓ → «Gộp nhánh chính vào nhánh, vẽ lại, đẩy, chạy lại CI,
  có khi ghim lại» (tô màu cảnh báo) → quay lại «Nhánh chính dời»; KHÔNG → «Gộp được».
- Làn dưới: «Lệnh cổng vẽ lại tại chỗ (tệp bị .gitignore bỏ qua)» → «Commit KHÔNG mang hai view» → «Nhánh chính dời» →
  «Không tệp nào trùng → gộp được, không chạy lại CI» (tô màu tốt). Một nhánh phụ: «Ai cần xem → vẽ tại chỗ từ nguồn».
- Chú thích chân: «Số đo Inventory 10–21/11: 126 trên 134 lần gộp ngược xung đột dính LO-TRINH.html». AC liên quan:
  AC-2, AC-4, AC-6.
