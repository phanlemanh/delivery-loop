# Hạt giống — đối soát bàn giao theo hai chiều còn thiếu: câu hỏi chủ kho đang mở và PR

Gốc: delivery-loop/_acceptance/doi-soat-ban-giao/ — mục thứ hai của «Out of scope» trong `contract.md`, chủ kho duyệt cắt
ở Cổng Phạm vi và xác nhận «cắt/hoãn: đồng ý cắt» ở Cổng Bằng chứng 24/11/2026. Ô trích lại tên tệp này ở Notes.
Hạt giống mẹ: `docs/plans/2026-11-24-hat-giong-giam-sat-co-quyen-va-co-so.md` (lớp 2).

Trạng thái: SỔ, không phải cam kết. Chưa thiết kế, chưa có ô.

## Vì sao chưa làm ở vòng đối soát

- `ban-giao.json` chưa ghi hai thứ này, nên bên đọc không có gì để so: muốn so thì bên viết phải ghi trước, tức đổi khuôn
  tệp (luật kho: đổi khuôn phải có đường đọc-cũ + cờ vàng).
- Chiều PR cần gọi mạng (`gh`), trong khi lệnh nối lại hôm nay chạy không mạng.
- Câu hỏi chủ kho đang mở đã được khung đợt đếm (hồ sơ `khung-dot-dinh-vi`); đối soát lại nó ở lúc nối lại có thể là
  đếm hai lần.

## Câu cần trả lời trước khi mở ô

- Đổi tài khoản giữa đợt có lần nào để mất một câu hỏi chủ kho đang mở, hoặc một PR mà dãy tưởng còn mở mà đã gộp/đóng?

## Ngưỡng mở ô

≥ 1 lần ở đợt thật, sau khi đổi tài khoản, chủ kho phải tự tìm lại một câu hỏi đang mở hoặc trạng thái một PR mà dòng
đối soát không nói.
