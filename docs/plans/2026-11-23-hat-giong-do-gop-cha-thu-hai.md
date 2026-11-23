# Hạt giống — bộ đo ký → gộp trả rỗng khi commit ký nằm trên cha thứ hai

Gốc: _acceptance/release-3-1-1/do-dong-1.md (đo dòng 1 của mốc 3.1.1, 23/11/2026 — dòng cuối của tệp là kết quả của bộ đo kit).

- `soDoGop` trong `plugins/dispatch/scripts/do-gop.mjs` tìm commit gộp bằng `git rev-list --first-parent --reverse
  --ancestry-path <ký>..<nhánh chính>`. Với PR gộp bằng commit gộp, commit ký nằm trên cha THỨ HAI; trên git 2.50 lệnh ấy
  trả rỗng, nên bộ đo trả `{"ky_luc":null,"gop_luc":null,"ky_den_gop_phut":null,"gop_vao_nhanh":null}` cho hồ sơ
  `va-chu-ky-giu-cho-lenh-gop` (#26) dù ký 20:58 và gộp 22:12 ngày 22/11. Hệ quả: dòng `ky_den_gop` của `dieu-phoi.mjs dem`
  và sự kiện `hang-gop` có thể không mang số cho ca thường của PR; mốc 3.1.1 phải đo tay bằng `do-dong-1.sh`.
- Hướng sửa đã thấy (chưa kiểm): bỏ `--first-parent` khỏi bước ancestry-path rồi lọc theo tập cha-đầu như mã đã làm, hoặc
  duyệt lối cha-đầu và hỏi `merge-base --is-ancestor` như `do-dong-1.sh`. Cần ca đỏ trên một lịch sử có commit ký ở cha
  thứ hai.

Ưu tiên: trước khi dùng `dieu-phoi.mjs dem` làm nguồn dòng 1 của một mốc.
