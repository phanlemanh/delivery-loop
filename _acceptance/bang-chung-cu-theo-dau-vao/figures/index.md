# Hình tại Cổng Phạm vi — bang-chung-cu-theo-dau-vao

Kê từ sổ quyết định cuối S1 (ba câu chỉ-người-biết) và chỗ thiết kế đổi bên đọc. Ngưỡng N5: ba bước nối tiếp hoặc hai
nhánh rẽ.

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi — phê cờ `--chi-xet` + khối STALE-GUARD (bước resume chạy cùng vị từ) | 4 bước nối tiếp: tệp đổi từ `verified_commit` → bỏ tệp hồ sơ → bỏ tệp T1 → (kho bật) bỏ tệp ngoài `paths`; 3 bên đọc JS nhập về một hàm, lưới trước-gộp đứng riêng | `mot-vi-tu` |
| Hỏi — đi tiếp phạm vi hẹp + ngoại lệ (b) | dưới ngưỡng: 1 nhánh (có / không) — số K3 đọc ở bảng design doc §1 | — |
| Hỏi — Node 24 cho tác tử chấm | dưới ngưỡng: 1 nhánh | — |

Giữ `stale_scope` bật theo lựa chọn, bỏ dòng gợi ý, tách nửa chữ ký → CI, bỏ đường nền: máy đã quyết (dòng báo, cửa veto),
không phải điểm quyết định của người.

## Đề bài hình `mot-vi-tu`

- Loại: luồng (flowchart), trái → phải.
- Nút trái (bốn bên đọc): «pr-san-sang (trước thẻ Cổng Bằng chứng)», «bước resume của feature-loop (`--chi-xet`)», «làn ghim
  lại `--skip-unchanged`» — ba mũi tên vào MỘT khối «vatDoiSauPin»; «lưới trước-gộp `pre-merge-check.sh`» đi đường riêng
  (bash, không đổi) tới cùng câu trả lời.
- Khối giữa «vatDoiSauPin», ba bước nối tiếp: «bỏ tệp hồ sơ (`_acceptance` là một đoạn)» → «bỏ tệp `t1_skip_globs`» → «kho
  khai `stale_scope: paths`? → bỏ tệp ngoài `paths` của mọi eval (staleByPaths); không áp → giữ, nói vì sao».
- Nút phải: «còn tệp → bằng chứng cũ (thoát 2)» / «rỗng → còn mới (thoát 0)».
- Nhãn chữ: «hôm nay pr-san-sang chỉ có bước 1 — vấn đề #10»; «không nạp được bộ máy → chỉ bước 1 (chặt hơn)».
- AC liên quan: AC-1, AC-2, AC-3, AC-5, AC-6.
