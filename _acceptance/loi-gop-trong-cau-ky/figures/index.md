# Hình tại điểm quyết định — Cổng Phạm vi, hồ sơ `loi-gop-trong-cau-ky`

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 — phê CỘNG: máy gộp PR vào nhánh chính theo lời gộp trong câu ký | 6 bước nối tiếp, 4 nhánh rẽ | cần hình: `tu-cau-ky-toi-commit-gop` |
| Hỏi-2 — kho kit tự bật khoá ngay trong vòng này | 1 bước, 2 nhánh rẽ (bật · không bật) | dùng chung hình trên: nhánh rẽ đầu tiên «kho có bật không» |
| Mười lựa chọn máy đã quyết ở bước thiết kế (sổ S1) | mỗi dòng 1 bước, 0 nhánh | dưới ngưỡng: bảng trên thẻ là đủ |

## Đề bài hình `tu-cau-ky-toi-commit-gop`

- Loại hình: sơ đồ luồng (flowchart) đi từ trái sang phải hoặc trên xuống dưới, một trang, đọc trong một phút.
- Tiêu đề: «Từ câu ký tới commit gộp — máy làm gì, người làm gì».
- Nút, theo thứ tự (nhãn bằng chữ cho người, không tên tệp):
  1. «Thẻ Cổng Bằng chứng in dòng lệnh» — rẽ nhánh «Kho đã bật?»: KHÔNG → «Thẻ như hôm nay, người bấm gộp»; CÓ → dòng lệnh có sẵn
     «gộp: khi CI xanh; ký hay trả: ___».
  2. «Người dán dòng, gõ chữ ký» (nút của NGƯỜI — tô khác màu) — rẽ nhánh «Câu mang chữ ký và lời gộp?»: người sửa thành «gộp: chưa»,
     hoặc trả lại → «Không gộp — việc gộp như hôm nay».
  3. «Lệnh ký ghi chữ ký và một dòng sổ mang nguyên văn câu người gõ, trong cùng một commit, rồi đẩy lên PR».
  4. «CI chạy trên commit chữ ký» — rẽ nhánh «Mọi check xanh?»: còn chạy → «Lệnh tự chờ tới khi xanh hoặc hết giờ»; đỏ → «Máy báo
     một dòng, việc gộp về tay người».
  5. «Lệnh gộp đọc trên đầu nhánh của PR, đòi đủ sáu vế» — liệt sáu vế thành chú thích cạnh nút: kho bật · hồ sơ đã ký (không phải máy
     đã thông) · báo cáo có chữ ký · sổ có dòng lời gộp · chính câu người gõ đọc lại ra lời gộp · dòng ấy sinh cùng commit với chữ ký
     hiện hành. Thiếu một vế → «Không gộp, gọi tên vế thiếu».
  6. «Gộp bằng commit gộp, đúng commit đã kiểm» (kết thúc xanh).
- Phân vai bằng màu hoặc làn: việc của NGƯỜI (chỉ nút 2) · việc của MÁY (các nút còn lại) · lối «như hôm nay» (xám).
- Chú thích dưới hình, ba dòng: «Máy không bao giờ tự gõ chữ ký.» · «Không lời gộp trong câu người gõ thì không gộp.» · «Kho không bật:
  thẻ và hành vi giữ nguyên.»
- Tiêu chí liên quan: AC-1 (ô gộp trên thẻ), AC-5 (dòng sổ đọc lại được), AC-6 (sáu vế trước khi gộp), AC-2 (kho không bật giữ nguyên).
- Nguồn: `docs/superpowers/specs/2026-11-21-loi-gop-trong-cau-ky-design.md` mục «Thiết kế» và `contract.md` của hồ sơ.
