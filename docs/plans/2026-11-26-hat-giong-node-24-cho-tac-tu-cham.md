# Hạt giống — tác tử chấm chạy Node 24 ở mọi bản sao của kho kit, không phải xin sửa tệp shell mỗi vòng

Gốc: delivery-loop/_acceptance/nang-repo-setup-0-10-4/ — sổ quyết định của bước thiết kế (câu hỏi Node 24 ở Cổng Phạm vi
26/11/2026); hợp đồng của ô trích lại tên tệp này ở Notes. Hai lần trước cùng câu: `_acceptance/va-chu-ky-giu-cho-lenh-gop/`
(22/11) và `_acceptance/doi-soat-ban-giao/` (24/11).

Trạng thái: SỔ, không phải cam kết. Chưa thiết kế, chưa có ô.

## Chuyện đang xảy ra

- Máy chủ kho chạy Node 26.7.0; `.nvmrc` của kit ghi 24 và bộ chạy kiểm tự so phiên bản (`tests/bo-chay.sh`), nên dưới
  Node 26 các bộ kiểm dùng Node đỏ vì máy, không vì vật.
- Lối tắt hiện có là hàm `agknode24` trong `~/.zshrc`, chỉ khớp `~/dev/acceptance-gate-kit/` và `~/dev/delivery-loop/`.
  Bản sao `~/dev/delivery-loop-main` (nơi chạy vòng từ khi bản kéo chính còn bật plugin chợ cũ) không khớp.
- Ba vòng liên tiếp (22/11, 24/11, 26/11) mỗi vòng tốn một câu hỏi ở Cổng Phạm vi, một lần sửa tạm `~/.zshrc` cùng bản
  chụp shell của phiên, và một lần hoàn lại sau khi gộp. Đó là lời dặn lặp lại thay cho nghiệm — hiến pháp của kit cấm.

## Hướng nghiệm, chưa chọn

- Sửa vĩnh viễn hàm `agknode24` để khớp mọi bản sao của kho (theo tên kho trong `git remote`, không theo đường dẫn) —
  việc của chủ kho trên máy, ngoài kho.
- Hay để bộ chạy kiểm tự tìm Node đúng `.nvmrc` (ví dụ `/opt/homebrew/opt/node@<bản>/bin`) trước khi tự so — trong kho,
  nhưng là CỘNG và chạm mọi máy chạy kit.

## Ngưỡng mở ô

Đã chạm: 3 lần liên tiếp. Mở ô khi chủ kho gọi tên, hoặc ngay khi một vòng thứ tư phải hỏi lại câu này.
