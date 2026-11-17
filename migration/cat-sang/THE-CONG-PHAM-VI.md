# Mốc 3.0 «Chuyển nhà» — thẻ Cổng Phạm vi (B3)

Soạn 17/11/2026, phiên B3. Chưa có gì khó đảo được chạy: mọi thứ đã làm nằm trên nhánh cục bộ, bản sao rời và nhánh của
phiên. Số ở đây do phiên B3 tự đo hôm nay, trừ chỗ ghi «đọc lại».

## Một phút

| Thước của kế hoạch | Kết quả đo 17/11 |
|---|---|
| Vi phân phán quyết = 0 | **0 lệch** trên Quỹ hàng (172 hồ sơ có dòng OK) và crm (366), kit 2.39 so với cây 3.0, cả hai bước của việc `gate`. Thước đã phá thử hai chiều, 5/5 ca ở mỗi kho |
| Cây 3.0 dựng lại được | Mã cây `53031519` — trùng cây B2 đã đo và ký (giữ đủ 5 807/5 807 khoá, đọc lại); năm thước B1 + B2 chạy lại đều thoát 0 |
| Một kho cài được 3.0 | Diễn tập trên bản sao Quỹ hàng: 4 tệp, 13 dòng phía CI; bước bản đồ xanh, bước chặn gộp đỏ đúng 1 chỗ dự kiến (một hồ sơ phải ghim lại, như lần nâng 2.39); năm eval của hồ sơ ấy đạt với kit 3.0 |
| Bản cài | ĐẠT 8/8 trên cây 3.0.0 diễn tập; 6 gói, 638 tệp (2.39: 6 072 tệp) |

**Ba điều đo ra mà kế hoạch chưa có:**

1. **Lệch ở chính kho kit.** Sau dọn nhà, PR chạm lõi cưỡng chế (`lib/`, `hooks/` của plugin lõi) tụt từ T3 xuống T2: ba
   glob trong `_acceptance/config.yaml` còn theo bố cục cũ. Bộ kiểm sáu bước không thấy. Sửa ba dòng trong PR mốc, có tệp
   đo hai chiều.
2. **Kho mới riêng tư thì Quỹ hàng không cài được như hôm nay.** Lượt kiểm tự động của Quỹ hàng kéo kit không mã truy cập.
3. **GUIDE §5.3 của cây 3.0 dặn kho tiêu thụ đặt gốc plugin sai chỗ** (gốc kho, nơi không còn `scripts/`). Sửa trong PR mốc.

Chi tiết: `migration/vi-phan/README.md` · bước và đường lùi: `migration/cat-sang/BANG-BUOC.md` · hồ sơ mốc nháp:
`migration/cat-sang/ho-so-moc-nhap/contract.md` (11 tiêu chí).

## Hình dạng vòng — và vì sao

Hồ sơ `release-3-0-0`, hạng **T2**, Cổng Phạm vi đi **làn V** như mốc 2.39 — SAU khi chủ kho trả lời ba câu dưới. Ba câu ấy
là thứ duy nhất ở cổng này máy không có căn cứ để tự quyết; mọi mục còn lại máy đi theo khuyến nghị, ghi sổ, chủ kho veto
được. Không cần vòng feature-loop T3 đầy đủ: vật của riêng mốc không chạm đường T3 (đo: `hang=T2`), còn 6 commit dọn nhà đã
có hồ sơ B1 (T3) và B2 ký.

Lượt gọi người: lượt này (1) + chữ ký Cổng Bằng chứng (2) = **2**, hơn ngân sách kế hoạch (1) một lượt. Lý do: ba câu dưới
đổi thứ phải dựng TRƯỚC chữ ký; hỏi ở chữ ký thì trả lời khác khuyến nghị là làm lại một lượt chấm.

## Ba câu chỉ chủ kho trả lời

**A1 — Chuyển kho `delivery-loop` sang công khai ở ngày cắt? (KHÔNG đảo được)**
Khuyến nghị: **công khai**, sau khi anh đọc danh sách lộ dưới.
- Công khai: Quỹ hàng cài bằng đúng cách hôm nay · chạy kiểm tự động không tính phút · làm được nửa (b) của Repo Standards.
- Riêng tư: Quỹ hàng cần thêm một bí mật đọc kho và sửa hai luồng cùng một ca thử để dùng nó; hạn phút chạy kiểm chưa đo;
  nửa (b) của Repo Standards để lại.
- Thứ sẽ lộ, nằm trong lịch sử nhánh `chuyen-nha` nên gỡ tệp không gỡ được: hai sổ `migration/tra-soat/ket-qua/kho-quy-hang.*`
  (tên tệp và 50 dòng chỗ bám của Quỹ hàng — kho riêng tư) · ba tệp mang đường dẫn máy `/Users/…`. Quét bí mật 178 commit: 3
  mục, cả ba là dòng băm tệp, không phải khoá. Kho cũ đang công khai đã nhắc Quỹ hàng ở 46 tệp.

**A2 — Ở Quỹ hàng, đổi luôn phía phiên trong cùng PR cài?**
Tức là khoá bật plugin của kho ấy trỏ chợ `delivery-loop` (sáu khoá, ba plugin đổi tên) và máy này cài sáu plugin từ chợ
mới. Khuyến nghị: **có**. Chỉ đổi phía CI thì phiên làm vòng vẫn chạy plugin 2.39, và vế 1 của ngưỡng thực tế chỉ đo được
một nửa. Giá: PR ở Quỹ hàng thành hạng T3 (tệp cài đặt nằm trong đường T3 của kho ấy). Điều này đổi quyết định «plugin ở kho
tiêu thụ để nguyên» nên cần lời anh.

**A3 — Ngày cắt sang.**
Khuyến nghị: **cắt ngay khi lượt chấm mốc đạt và anh ký**, sớm nhất 18–19/11. Trước chữ ký còn khoảng 4–5 giờ máy: viết nội
dung mốc, ghim lại B1 và B2 trên cây mới (mỗi hồ sơ một lượt bộ kiểm ≈ 1 giờ), một lượt chấm ≈ 1 giờ. Ba lượt dài ấy cần
lời anh cho chạy. Hạn dừng của đợt 04/12 áp cho ngày cắt; cửa sổ quan sát 14 ngày tính từ commit cài ở Quỹ hàng.

## Máy đi theo khuyến nghị — anh veto dòng nào thì nói dòng ấy

| # | Điều | Máy làm | Căn cứ |
|---|---|---|---|
| B1 | Ngoại lệ ghi hồ sơ vòng `_acceptance/release-3-0-0/` + năm tệp sổ trên nhánh của vòng | nhận | tiền lệ B1, B2 đã duyệt hai lần |
| B2 | `diagram-design` lên chung 3.0.0 | sáu plugin cùng số | chợ, thư mục, tệp khai của nó đổi; bộ kiểm tệp khai hết báo lệch số |
| B3 | Ba glob chết | sửa trong PR mốc, không sửa kịch bản | sửa kịch bản làm đổi mã cây: hai báo cáo đã ký của B2 phải đo lại 60–80 phút |
| B4 | `migration/` | ở lại nhánh chính; thêm nó vào danh sách ngoài phép quét của ca RT13; gỡ tệp luật của đợt | hồ sơ B1, B2 chấm chính các tệp ấy; ngưỡng ở `BOI-CANH.md` chạm |
| B5 | Đoạn «MỘT cây nguồn» của `CLAUDE.md` | đổi tiền tố đường, không đổi luật | đường cũ không còn |
| B6 | Trường «phiên bản plugin của phiên làm vòng» (một CỘNG) | **không thêm** | mốc phát hành không dựng răng; đọc thay bằng khoá bật plugin của Quỹ hàng tại commit gộp |
| B7 | 45 dòng sổ ở 32 hồ sơ đã khép trỏ đường phẳng | để nguyên, ghi giới hạn | 0 hồ sơ đang mở dính (đọc lại) |
| B8 | Ngoài-11 của vòng hai kho cũ | giữ là hạt giống, không tạo ô | hạt giống mồ côi là hợp lệ; chưa có neo ngoài |
| B9 | Ngưỡng số của ngưỡng thực tế | nền = cửa sổ 2.37→2.39 ở Quỹ hàng (15 vòng; ký→gộp trung vị 9 phút) vì cửa sổ 2.39 rỗng · ký→gộp đỏ khi vượt số lớn hơn giữa 1,5 lần nền và 30 phút · cửa sổ quan sát 14 ngày · các ngưỡng khác như kế hoạch | 1,5 lần của 9 phút là 14 phút — một vòng chậm 5 phút đã đỏ |
| B10 | Cài đặt GitHub | làm ở Chặng 1 khi anh bảo: kho mới chỉ commit gộp TRƯỚC PR số 1 · khoá nhánh chính SAU khi PR số 1 gộp · bật quét bí mật và chặn đẩy bí mật ở cả hai kho · kho cũ không lưu trữ | `BANG-BUOC.md` 1.1, 1.7, 1.8, 1.10 |
| B11 | Nửa (b) của Repo Standards | sau khi kho mới công khai, anh bảo mới mở | README công khai trỏ một kho riêng tư là đường chết |
| B12 | 5 PR mở và 26 vấn đề ở kho cũ | để nguyên, không chặn mốc | không điều nào là điều kiện cắt |

## Câu trả lời mẫu — một dòng

> **Duyệt theo khuyến nghị, cho chạy ba lượt dài.**

Hoặc đổi một câu: «Duyệt, trừ A1: giữ riêng tư» · «Duyệt, A2 chỉ phía CI» · «Duyệt, veto B2». Sau lời anh: máy dựng nhánh
ứng viên, viết nội dung mốc, ghim lại B1 và B2, chấm, rồi dừng ở Cổng Bằng chứng — chữ ký ở đó là ngày cắt, và mỗi bước của
Chặng 1 chỉ chạy khi anh bảo.

## Chưa đo, nói thẳng

- Lượt kiểm tự động trên GitHub của kho mới (đang tắt) và của Quỹ hàng với kit 3.0 thật — mới chạy cùng lệnh tại chỗ.
- Làn ghim lại của B1, B2 trên cây mới; bảy lệnh bộ kiểm chung của Quỹ hàng trong làn ghim lại ở kho ấy.
- Ngưỡng thực tế: cả ba vế chưa đạt và chưa đo được trước ngày cắt; cách đo đã dựng và chạy thử chiều đỏ.
- Bộ kiểm sáu bước trên cây cắt sang (cây kịch bản + phần riêng của `chuyen-nha`): kết quả ở cuối `BANG-BUOC.md`.
