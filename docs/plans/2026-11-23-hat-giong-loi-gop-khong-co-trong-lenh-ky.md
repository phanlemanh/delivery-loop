# Hạt giống — lệnh ký không dạy ghi khoá `loi_gop`, lệnh gộp theo lời chặn

Gốc: _acceptance/release-3-1-1/decisions.jsonl (dòng `d-20261123T064028Z-31` thiếu `loi_gop`, dòng `d-20261123T065001Z-32` ghi bù — 23/11/2026).

- `docLoiGop` trong `plugins/dispatch/scripts/gop.mjs` chỉ nhận dòng sổ `stage: gate2` mang khoá `loi_gop: {"cau": "<câu người gõ>"}`.
  Thân lệnh `/acceptance-gate:signoff` không nhắc khoá này: khối `NGOAI-N-GATE2-LINE` chỉ dạy dòng `Ngoài-<n>`, và câu gộp
  «gộp: khi CI xanh» không có khuôn dòng sổ nào. Phiên ký mốc 3.1.1 ghi dòng «lời gộp» theo trí nhớ hồ sơ #26 nhưng thiếu
  khoá, nên `dieu-phoi.mjs gop 29 --theo-loi` thoát 1 với «không có dòng lời gộp trong sổ» sau khi CI xanh.
- Hướng sửa đã thấy (chưa kiểm): đặt khuôn dòng `loi_gop` thành một khối marker trong thân lệnh ký, và cho ca round-trip
  rút khuôn từ khối ấy rồi đọc bằng `docLoiGop` (cùng mẫu `OOC-ITEM-TEMPLATE` + P55).

Ưu tiên: trước mốc kế có kho bật `feature_loop.gop_theo_loi_ky`.
