# Hạt giống — khuôn dòng «giữ cỡ» trái luật của bộ xếp căn cứ

**Ngày:** 2026-11-21 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** sửa lỗi (hai luật một nguồn trái nhau).
Gốc: delivery-loop/_acceptance/tep-chung-khong-chan-gop/ — dòng sổ `d-20261121T143949Z-21` bị đánh đỏ, thay bằng
`d-20261121T144004Z-22` (căn cứ «một lối»).

## Điều thấy

Khối `DEC-GIU-CO` của `plugins/feature-loop/skills/feature-loop/SKILL.md` (S1 bước 5) dạy ghi dòng giữ cỡ với căn cứ
`"nguon":"muc-tieu"` và `"tep":"_acceptance/<slug>/contract.md"` — tức trỏ hợp đồng của chính vòng. Bộ xếp căn cứ
`plugins/acceptance-gate/scripts/can-cu-s1.cjs` đánh đỏ đúng dạng ấy: «căn cứ trỏ vào vật của chính vòng» (luật nguồn
mục-tiêu đòi tệp có từ trước vòng). Máy làm đúng khuôn SKILL thì sổ có một dòng đỏ, và dòng đỏ làm Cổng Phạm vi thôi
điền sẵn «duyệt».

## Hướng

Một trong hai bên phải nhường, rút từ một nguồn: hoặc bộ xếp miễn cho dòng mở đầu chuỗi giữ cỡ (dòng ấy là lời khai
về chính hợp đồng, không phải căn cứ chọn phương án), hoặc khuôn `DEC-GIU-CO` đổi sang căn cứ «một lối» kèm câu lối khác
chết vì sao. Ca đo: rút khuôn từ SKILL, điền, cho qua bộ xếp — phải không đỏ.

## Ngưỡng mở thành ô

Lần thứ hai một vòng ghi dòng giữ cỡ theo khuôn và bị đánh đỏ, hoặc chủ kho gọi tên.
