# Hạt giống — chế độ «bản đồ ngoài git» sẵn sàng cho kho đầu tiên bật nó

Gốc: delivery-loop/_acceptance/tep-chung-khong-chan-gop/ — Cổng Bằng chứng ký 22/11/2026, sáu mục Ngoài-6, 7, 8, 12, 13,
14 (chủ kho chọn «ghi Known limits»; `review-findings.md` của hồ sơ ấy giữ nguyên văn từng mục). Cổng Phạm vi của hồ sơ
`va-chu-ky-giu-cho-lenh-gop` (22/11) quyết giữ cả sáu ở đây thay vì gộp vào bản vá chữ ký (sổ: `d-20261122T085313Z-28`,
`d-20261122T094501Z-29`).

Vì sao còn đáng làm: cả sáu chỉ lộ ở kho khai `ban_do.ngoai_git: true`. Trên `main` hôm nay chưa kho tiêu thụ nào bật,
nhưng mốc quanh 02/12 mang chế độ này tới ba kho — kho đầu tiên bật sẽ vấp đúng các lỗi đã biết.

Sáu mục, gom theo chỗ sửa:

1. **Chữ hướng dẫn (rẻ).**
   - Ngoài-6 — `plugins/acceptance-gate/commands/signoff.md`, đoạn ngay sau khối `MAP-STAGE`: câu «appending
     ` PRODUCT-MAP.md` to that `git add` as well is harmless» sai ở chế độ ngoài git (tệp bị bỏ qua, `git add` thoát 1).
   - Ngoài-14 — `GUIDE.md`, khối `BAN-DO-NGOAI-GIT`: `git rm --cached -- PRODUCT-MAP.md LO-TRINH.html` hỏng cả lệnh ở kho
     không có `LO-TRINH.html`; gợi ý `--ignore-unmatch`, đo bằng ca chạy chính khối trên kho thử không có trang lộ trình.
2. **Dò nhánh view theo đuôi tên** — Ngoài-8 và Ngoài-12 (cùng một lỗi), `plugins/acceptance-gate/scripts/product-map.mjs`:
   `ls-remote --heads origin <tên>` khớp theo đuôi ref; hỏi bằng `refs/heads/<tên>` đầy đủ. Hai chiều: kho thử có nhánh
   trùng đuôi → bản cũ lấy nhầm, bản sửa lấy đúng.
3. **`--day-nhanh-ve` đẩy trang mang lỗi tệp ý định mà thoát 0** — Ngoài-13, cùng tệp: `--check` coi lỗi ấy là đỏ. Đổi
   hành vi (chặn đẩy, hay đẩy kèm mã khác 0) là một lựa chọn cho Cổng Phạm vi của vòng.
4. **Thẻ khởi đầu chưa đọc hai trạng thái bản đồ mới** — Ngoài-7, `plugins/acceptance-gate/scripts/start-scan.mjs` phát
   trạng thái «vẽ tại chỗ» và «khoá viết sai» mà `commands/start.md` không có lời thuật.

Giá ước: một vòng T2 nhỏ (4–5 tiêu chí), chạm `product-map.mjs`, `start.md`, `signoff.md`, `GUIDE.md` và ca TCG của suite
scripts. Nên chạy trước khi kho đầu tiên bật chế độ; không cần chờ mốc.
