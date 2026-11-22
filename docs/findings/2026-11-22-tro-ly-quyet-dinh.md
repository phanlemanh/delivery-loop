# Trợ lý quyết định — bản ghi thiết kế chủ kho duyệt (22/11/2026)

Nguồn: tài liệu «Trợ lý quyết định — thiết kế và khả thi» (Claude Docs, chủ kho viết, 22/11/2026). Tệp này chép lại phần
đặc tả mà hai hàng kit của thí điểm dựa vào, để sổ quyết định của hai hồ sơ trỏ được vào một tệp trong kho.

Chủ kho duyệt thí điểm ngày 22/11/2026. Việc xây mở ở kho kit; LUẬT đợt và bản sửa luật tự trị ký khi kho nâng bản kit.

## Căn cứ số

Đo 2.510 quyết định của 68 hàng ở kho onehub-inventory: chủ kho chọn khác khuyến nghị ở Cổng Phạm vi khoảng 6/68 lần
(≈9 %); mỗi hàng mất khoảng 2,8 giờ chờ người trong chu trình trung vị 7,4–7,8 giờ; chỉ 15/2.510 quyết định máy đánh dấu
khó đảo. Mô phỏng: mặc-ký cắt 85 % giờ chờ người, rút chu trình 27–36 %, nhưng dời nút nghẽn sang hàng đợi gộp — nên
mặc-ký ra đời thành cặp với chuyến gộp.

## Năm cơ chế

1. **Mặc-ký có phủ quyết.** Câu «chỉ-người-quyết-được» mà đảo được thì không dừng chờ nữa: hàng đi tiếp ngay theo khuyến
   nghị; câu hỏi vẫn lên thẻ cổng nhưng đổi dạng thành «đã đi theo khuyến nghị — phủ quyết trước khi gộp nếu khác ý».
2. **Án lệ.** Mỗi câu trả lời ở cổng mang một chữ phạm vi: lần này hay từ nay.
3. **Thăng cấp theo số đo.** Mỗi loại câu có sổ riêng: số lần hỏi, tỷ lệ theo khuyến nghị, số phủ quyết, số lần làm lại.
   Loại đạt ngưỡng (≥5 lần hỏi, 100% theo, 0 làm lại) → giám sát trình một quyết định «loại này từ nay máy tự quyết».
   Một lần phủ quyết hay làm lại → loại bị giáng về hỏi-người.
4. **Kiểm mẫu.** Chủ kho mở ngẫu nhiên khoảng 1/5 món đã mặc-ký để soi đủ; một lần kiểm ra sai → giáng loại ngay.
5. **Giữ-quyền (chiều kéo).** Tệp đăng ký giữ-quyền trong sổ đợt; món khớp luôn hỏi-người bất kể loại đã thăng cấp; lần
   đầu của một loại mới hay một vùng mới luôn hỏi-người. Mỗi lần kéo ghi vào sổ đếm như tín hiệu âm.

**Danh sách không-bao-giờ-tự:** cổng màn hình chủ kho phải trải nghiệm; mọi thứ tầng high của luật tự trị; ba luật sản
phẩm bất khả xâm; món máy tự khai khó đảo; tiền và thứ gửi ra ngoài.

**Ghi sổ:** sổ quyết định thêm ba chữ — đã đi theo khuyến nghị hay chờ người, phạm vi câu trả lời lần này / từ nay, và có
phải làm lại không. Một công cụ đếm đọc toàn bộ sổ, in bảng theo loại và tự trình danh sách loại đủ điều kiện thăng cấp.

## Năm lỗ đã vá (rà soát phủ)

1. Danh mục loại câu là danh mục đóng của kit; món không khớp = loại mới = hỏi-người (đóng-khi-ngờ).
2. Gác đồng nhất liên dãy dồn về trước chuyến gộp.
3. Án lệ đụng án lệ: máy không tự xử — hỏi người.
4. Phủ quyết lan: án lệ huỷ thì món chưa gộp đang dựa vào nó bị đánh dấu kiểm lại. Giáng loại cũng vậy: áp cho món chưa gộp.
5. Sổ ghi nguồn làm lại (phủ quyết / bộ kiểm / khác); chỉ làm lại do phủ quyết mới chặn thăng cấp. Chuyến gộp đỏ thì tách
   đôi chuyến để quy đúng PR lỗi, như merge train vẫn làm.

Ba mâu thuẫn: M1 — mặc-ký bằng chứng đụng luật tự trị: dùng cửa có sẵn của luật tự trị, khai lượt kiểm-lại-bằng-chứng
thành kiểm tra bắt buộc (proof). M2 — chuyến gộp không chờ ai; phủ quyết sau gộp = một hàng sửa nhỏ. M3 — LUẬT «CI trước,
ký sau»: khi mở thí điểm, chủ kho ký LUẬT mới cho hàng backend.

## Sáu nguyên tắc kit-hoá

1. Sơ đồ sổ là của kit ngay từ thí điểm, có đánh phiên bản.
2. Mọi ngưỡng là cấu hình của kho; tắt cờ là về nguyên hành vi cũ.
3. Danh mục loại câu do kit định nghĩa, đóng-khi-ngờ. Kho chỉ được thu hẹp, không được mở rộng.
4. Nối luật tự trị qua cửa proof, không đi vòng: kho chưa có thì mặc-ký dừng trước cửa gộp — không bao giờ tự gộp mà không
   có bằng chứng máy đứng thế chỗ người.
5. Người quyết là một trường, không phải giả định.
6. Số đo báo về kit: bảng đếm theo loại là đầu ra chuẩn của đợt.

## Hai hàng kit

- Hàng 1 `mac-ky-co-phu-quyet`: mặc-ký + giữ-quyền + sổ đếm và thăng cấp + kiểm mẫu + ba trường lược đồ sổ.
- Hàng 2 `chuyen-gop`: chuyến gộp (gom, kiểm một lần trên ngọn, chuyến đỏ tách đôi) + nối luật tự trị qua cửa proof.

Số đo thành công đọc sau 2 tuần: giờ chờ chủ kho mỗi hàng backend < 0,5h (nền 2,8h) · chu trình trung vị ≤ 6h (nền 7,4h) ·
phủ quyết < 15 % · làm lại do phủ quyết ≤ 1 khúc mỗi hàng bị phủ quyết · kiểm mẫu ra sai 0 lần. Dừng sớm: kiểm mẫu ra sai
2 lần hoặc phủ quyết vượt 25 %.
