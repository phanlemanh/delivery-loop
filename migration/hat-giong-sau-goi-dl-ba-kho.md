# Hạt giống — sáu gói DL1–DL6 của thiết kế ba kho, soi theo luật của kit

**Ngày:** 2026-11-18 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** lẫn — DL1 là TRỪ, phần P179 của DL5 là sửa
lỗi, phần còn lại là CỘNG (chủ kho phê từng ca).
Chủ kho bảo ghi: «Ghi hạt giống» (18/11, phiên giữ đợt). Tệp này KHÔNG mở vòng nào và không tạo ô nào.

**Nguồn:** `docs/three-repo-overview-design.md` ở kho Repo Standards, mục 2 (số đo), 7 (gói việc), 8 (thứ tự), 10 (điều
còn mở) — phiên giữ đợt đọc bản trên nhánh chính kho ấy ngày 18/11. Bản gom do phiên Design Assembly gửi sang cùng ngày;
đó là tin của một phiên bạn, không phải lời chủ kho duyệt việc nào.
**Neo:** chưa có hồ sơ `_acceptance/` nào của kit cho cả sáu gói — hạt giống mồ côi, hợp lệ. Neo riêng của từng gói ghi ở
bảng dưới, chỗ nào kit đã có.
**Chỗ ở:** tệp nằm ở `migration/` trên nhánh `chuyen-nha` vì phiên giữ đợt chỉ sửa thư mục này. Khi đợt đóng, nó dời sang
`docs/plans/` bằng một PR — hoặc tách thành sáu dòng thêm vào các hạt giống đã có.

## Số đo làm nền (của tài liệu nguồn, đo 15–16/11 trên `onehub-inventory`, phiên giữ đợt KHÔNG đo lại)

- 30 PR, 99 lần gộp nhánh chính ngược vào nhánh, 93 lần có xung đột khi phát lại bằng `git merge-tree`.
- Tệp xung đột thuộc kit: `LO-TRINH.html` 71 lần · `PRODUCT-MAP.md` 45 lần · `_acceptance/config.yaml` 17 lần.
- Hai kho kia gỡ xong phần mình: còn 73/93. Cả ba cùng gỡ: còn 16/93.
- Mở PR đến gộp: trung vị 9,6 giờ (15 PR). 64 % phút máy chạy lúc ô `gate` còn đỏ.

**Giới hạn của số đo — phải đo lại trước khi tin mức lợi:** phép phát lại không dùng bộ gộp riêng mà kit đã cài cho hai
tệp sinh từ 2.36.0 (vòng `tep-sinh-khong-chan-gop`); tài liệu nguồn tự khai điều này cho `PRODUCT-MAP.md`. Inventory đang
ở kit 2.38.1, tức đã có bộ gộp ấy tại máy. Số 71 và 45 vì thế là trần, không phải số thật.

## Từng gói

| Gói | Nội dung (theo nguồn) | Kit đã có gì | Loại · hạng dự kiến | Chờ gì |
|---|---|---|---|---|
| DL1 | PR không ghi tệp tổng hợp; bản đồ sản phẩm và lộ trình vẽ lại trên nhánh chính; lệnh kiểm về hồ sơ từng vòng | Vòng `tep-sinh-khong-chan-gop` (2.36.0) · `docs/plans/2026-10-16-hat-giong-tep-sinh-xung-dot-moi-lan-goi.md` · `docs/plans/2026-10-30-hat-giong-tep-sinh-mot-hang-mot-dong.md` · `KE-HOACH.md` 5.1 | TRỪ, nhưng đổi hành vi một chốt kiểm đang có (`product-map --check`) · T2–T3 | chủ kho gọi tên; đo lại có bộ gộp |
| DL2 | Bằng chứng chỉ hoá cũ khi đầu vào của hàng đổi; commit chữ ký không kéo một vòng CI | `docs/findings/2026-10-02-dieu-tra-lan-ghim-lai-va-du-bao.md` (gốc: `stale_files` so mọi tệp, không so theo `paths` của eval) · ADR 0010 | đổi đường phán quyết · T3 | răng cả hai chiều (đỏ và im) theo điều kiện tin cậy của luật (c) |
| DL3 | Máy thôi chạy trọn bộ mỗi lượt chấm; bằng chứng hồi quy đọc từ GitHub; ô bằng chứng mang tên khác `gate` | chưa thấy hạt giống (dò từ khoá) | CỘNG · T3 | Repo Standards dựng tầng CI (RS3) |
| DL4 | Điều phối đọc bản đồ phạm vi để xếp vòng nối tiếp hay song song | chưa thấy hạt giống (dò từ khoá) | CỘNG · T2 | Repo Standards dựng bản đồ phạm vi (RS4) |
| DL5 | Sổ giới hạn có ngưỡng theo lớp, có hạn, đo sự quay lại; mặc định định tuyến cho mục ngoài hợp đồng | `docs/plans/2026-10-18-hat-giong-so-known-limits-thieu-hang-p179.md` (ngưỡng đã ĐỦ từ 26/10) | phần P179: sửa lỗi · T2. Phần còn lại: CỘNG | chủ kho gọi tên |
| DL6 | Phiên giám sát đọc bản uỷ quyền thay lời dặn; mỗi quyết định ghi sự kiện kèm tên quyền | ADR 0027 · `docs/findings/2026-10-08-baseline-cho-hop-xin-quyen.md` (liên quan, không trùng) | CỘNG, chạm khoá cổng người (ADR 0002) | một ADR riêng trước khi mở vòng |

Cách dò: `git grep` theo từ khoá trên `docs/plans`, `docs/findings`, `docs/adr`, `.out-of-scope` của nhánh chính kho mới
tại `c16d25db` (217 hạt giống, 106 finding). Chưa vét cạn — «chưa thấy» nghĩa là không khớp từ khoá.

**Thêm một lượt bị P179 đánh trượt:** lượt chấm vòng 2 của hồ sơ mốc `release-3-0-0` ra REJECT ngày 18/11 (`d4af0277`)
chỉ vì sổ giới hạn thiếu hàng; sửa bằng mười hàng ở `a4151d5b`, tốn thêm một lượt chấm khoảng một giờ máy và một lượt gọi
người. Số hàng sổ và số mục là lời phiên B3, phiên giữ đợt chưa đếm lại.

## Soi theo luật của kit

1. **«Chuyển nhà xong» chưa đạt hôm nay.** Tài liệu nguồn ghi chủ kho chốt 16/11: kit nâng cấp sau khi chuyển nhà xong.
   Thẻ `v3.0.0` (18/11) là ngày cắt; đợt chỉ đóng khi đủ ba vế ngưỡng thực tế (`KE-HOACH.md` mục 12), và hôm nay chưa kho
   nào cài 3.0. Mốc nào tính là «xong» để mở gói DL: chủ kho quyết.
2. **Luật chiều rộng (b).** Giữa hai mốc được một kho tiêu thụ nhận, tối đa một vòng, do chủ kho gọi tên; mốc chỉ cắt khi
   có kho chờ nhận. Hệ quả: các gói DL đi nối tiếp, mỗi gói gắn một mốc mà Inventory cài — cùng khuôn với Dãy C.
3. **Cân trên mọi kho (luật 26/09).** Số đo đến từ một kho. Quỹ hàng và crm còn cài từ kho cũ 2.39 và có cùng các tệp
   này. Mỗi gói phải trả lời «kho không có sự cố này được gì, mất gì» và có đường đọc-cũ hoặc bật theo lựa chọn; đổi mặc
   định là mọi kho trả giá.
4. **Không đổi engine dưới chân vòng đang chạy, và không làm nhiễu cửa sổ quan sát.** Dựng một gói DL trong cửa sổ 14
   ngày của mốc 3.0 thì được; cho Inventory cài mốc mang gói ấy trước khi vế 1 của mốc 3.0 đạt thì vế 2 (năm dòng số
   «không xấu đi do kit mới») không còn tách được nguyên nhân.
5. **CỘNG cần chủ kho phê đích danh** (ADR 0018), ở Cổng Phạm vi của chính vòng đó: DL3, DL4, DL6 và phần ngoài P179 của
   DL5.

## Thứ tự đề xuất (máy đề xuất, chưa ai duyệt)

| Bước | Việc | Điều kiện mở |
|---|---|---|
| 0 | Inventory cài 3.0 (vòng `nang-kit-3-0`, T3, đã mở 18/11 theo lời chủ kho trong phiên B3) | — |
| 1 | DL1 + bản vá hẹp P179, mốc 3.1 | một vòng thật ở Inventory gộp được trên 3.0 (vế 1); đo lại số xung đột có bộ gộp |
| 2 | DL2, mốc kế | Inventory đã cài mốc 3.1 |
| 3 | DL3, DL4 | Repo Standards có RS3, RS4 dùng thật |
| 4 | DL6, phần còn lại của DL5 | mỗi cái một ADR |

DL2 không cần chờ bản đồ phạm vi của Repo Standards: finding 02/10 cho thấy đầu vào của từng eval đã khai ở `paths`.

## Chưa làm, nói thẳng

- Chưa đo lại số xung đột với bộ gộp của kho thật.
- Chưa dò ba giới hạn mà phiên Design Assembly ghi chuyển cho kit (kit đọc bậc từ tệp trên đĩa khi sổ nằm ngoài git; hai
  điều về cách đọc màu). Chi tiết ở sổ giới hạn của kho design-assembly — kho ấy riêng tư nên không chép vào đây.
- Chưa trả lời các điều còn mở ở mục 10 của tài liệu nguồn (khoá lối gộp nhanh của gói điều phối ở Inventory có bật
  không; kho nào giữ phép so của từng bất biến trong bản uỷ quyền).

## Ngưỡng mở thành ô

Chủ kho gọi tên từng gói, sau khi điều kiện mở ở bảng thứ tự đạt. Gói nào mở thì ô của nó mang dòng `Gốc:` trỏ hồ sơ
`_acceptance/` có số đo — với DL1 và phần P179 của DL5, hai hạt giống đã có sẵn neo.
