# Hạt giống — sổ giới hạn phải thêm hàng sau mỗi lượt chấm có mục «known-limits», mà không bước nào nói ra

Gốc: _acceptance/release-3-1-1/evidence-report.md (lượt chấm 2 của mốc 3.1.1, 23/11/2026 — E1, E2h đỏ ở ca P179).

- Ca P179 (`tests/plugins/run-tests.sh`) đếm mọi dòng «Đề xuất: known-limits» trong `_acceptance/*/review-findings.md`
  và đòi `docs/research/known-limits-ledger.tsv` có ít nhất từng ấy hàng. Mỗi lượt chấm có finding ngoài hợp đồng đề
  xuất known-limits đều làm số mục tăng, nên lượt chấm KẾ (hay làn ghim lại kế) đỏ ở vùng 3 cho tới khi ai đó chạy
  `node tools/so-gioi-han.mjs --slug <slug> --write`.
- Lệnh ấy chỉ được nhắc trong thông điệp đỏ của chính P179; SKILL feature-loop, GUIDE và CLAUDE.md không có. Hai vòng
  liền nhau vấp: `va-chu-ky-giu-cho-lenh-gop` (#26 — làn ghim lại đỏ 59,7 phút, sửa bằng commit «sổ giới hạn thêm 6
  hàng … (P179)») và `release-3-1-1` (lượt chấm 2 đỏ, khoảng 65 phút máy).
- Hướng đã thấy (chưa kiểm): đặt bước `so-gioi-han --write` vào chuỗi ghi sau lượt chấm của kit tự host (cạnh
  `thuoc-vat`, `do-vong`), hoặc cho bộ ghi `review-findings.md` tự thêm hàng. Cần ca đỏ: một lượt chấm sinh mục
  known-limits mà sổ không đổi.

Ưu tiên: trước vòng kế của kit có lượt chấm sinh finding ngoài hợp đồng.
