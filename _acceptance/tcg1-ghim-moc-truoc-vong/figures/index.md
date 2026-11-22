# Hình tại điểm quyết định — tcg1-ghim-moc-truoc-vong

| Điểm | Đếm | Hình |
|---|---|---|
| Mốc so sánh của TCG-1: merge-base sống hay commit ghim (sổ dòng 2, 3) | 3 nhánh rẽ (nhánh vòng trước gộp · nhánh chính sau gộp · nhánh PR sau gộp) — cần hình | `moc-so-sanh.html` |
| Vắng mốc thì đỏ, không lùi, không bỏ qua (dòng 4) | dưới ngưỡng: 1 bước | — |
| Vòng sau đổi đầu ra thì dời mốc (dòng 5) | dưới ngưỡng: 2 bước | — |
| Mười bốn ca cùng lớp vào hạt giống (dòng 6) | dưới ngưỡng: 1 bước | — |
| Không chạy đường nền, lấy nền từ CI (dòng 7) | dưới ngưỡng: 1 bước | — |
| Hỏi-1 · Node của tác tử chấm (dòng 8) | dưới ngưỡng: 3 lối nhưng mỗi lối một bước, không luồng | — |

## Đề bài hình `moc-so-sanh`

- Loại: sơ đồ nhánh git (timeline hai làn: nhánh chính · nhánh PR), kèm bảng ba hàng bên dưới.
- Nút: `50840764` (nhánh chính trước vòng) → `56bb22b1` (commit gộp PR #17) → `678572f0` (nhánh chính hôm nay); nhánh vòng
  tep-chung tách từ `50840764`; một nhánh PR sau tách từ `678572f0`.
- Nhãn: ở mỗi vị trí HEAD, mũi tên «merge-base» trỏ tới đâu (trước gộp: `50840764` — đúng · nhánh chính: chính HEAD — đỏ
  · PR sau: `678572f0` đã chứa vòng — xanh suông / TCG-1-bat đỏ) và mũi tên «mốc ghim» luôn trỏ `50840764`.
- AC liên quan: AC-1, AC-3.
