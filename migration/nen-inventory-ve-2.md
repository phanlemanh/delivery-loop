# Số nền của Inventory cho vế 2 — ghi TRƯỚC vòng thật đầu tiên trên kit 3.0

**Đo:** 19/11/2026, Mac Studio, phiên giữ đợt. **Việc:** II.0 (2) của `KE-HOACH-GIAI-DOAN-2.md`.
Ngưỡng dưới đây chốt hôm nay; không sửa sau khi thấy số của vòng thật.

## Cửa sổ

Nhánh chính `onehub-inventory`, lối cha-đầu, từ `1491ce89` (11/11 16:30) tới `bd32d73e` (18/11 17:52) — commit ngay trước
commit cài `47d52b06`. Mọi vòng trong cửa sổ chạy trên kit 2.38.1 của chợ cũ. **9 vòng gộp.**

## Lệnh (bộ đo của chính kit 3.0, cây `origin/main` `c1cf031a`)

```bash
node migration/cat-sang/nguong-thuc-te.mjs cua-so --kho <bản kéo Inventory> --kit <cây kit 3.0> --tu 1491ce89 --den bd32d73e
node plugins/acceptance-gate/scripts/loop-health.mjs --root <bản kéo Inventory> --at bd32d73e --since 1491ce89
```

## Số nền

| Vòng | Ký → gộp (phút) | Làm-xong → ký (phút) | Gộp nhánh chính vào nhánh |
|---|--:|--:|--:|
| `bang-hang-ban-doc` | 105 | 333 | 2 |
| `bang-quyen-theo-vai` | 16 | 81 | 1 |
| `bang-hang-dung-tay-nhu-sheet` | 21 | 195 | 1 |
| `luu-goc-nhin-cot-hai` | 22 | 132 | 3 |
| `kiem-vai-theo-man` | 26 | 424 | 0 |
| `refresh-design-assembly-tool` | 67 | 51 | 0 |
| `kiem-vong-doi-thao-tac` | 55 | 255 | 2 |
| `don-no-bo-kiem` | 79 | 1 301 | 5 |
| `moi-truong-thu-va-ban-that` | 34 | 495 | 2 |
| **Trung vị · p75** | **34 · 67** | **255 · 424** | — |

Trung vị của tập lẻ là phần tử giữa. Cột làm-xong → ký lấy từ dòng «làm-xong → quyết-được» của `loop-health`.

## Ngưỡng vế 2 (chốt 19/11)

| Dòng | Ngưỡng | Làm đỏ vế? |
|---|---|---|
| Lượt gọi người ngoài thiết kế quy về kit mới | 0 | có |
| Lượt chấm bị hạ tầng kit đốt | 0 | có |
| Lượt gọi người mỗi vòng | ≤ trần thiết kế (T2: 3, T3: 4) | có |
| Ký → gộp | ≤ 51 phút (1,5 × 34; sàn một lượt CI trọn ≈ 40 phút không đổi con số) | vượt thì ghi nguyên nhân; nguyên nhân thuộc kit mới thì đỏ |
| Làm-xong → ký | ≤ 383 phút (1,5 × 255) | như trên |
| Token và phút máy | chỉ đọc | không |

## Giới hạn đã khai

- Giờ ký và giờ gộp là ngày commit; nhánh bị rebase sau chữ ký thì giờ ký trôi theo (giới hạn của `nguong-thuc-te.mjs`).
- Lượt gọi người không có số nền máy đo: `loop-health` báo «không hồ sơ nào khai `human_calls:`». Vì vậy dòng này so với
  trần thiết kế, không so với nền.
- `loop-health` in «vòng bị hạ-tầng đốt: 78» cho TOÀN BỘ hồ sơ của kho, không tách theo cửa sổ. Với vòng thật trên 3.0, dòng
  này đếm tay trên chính hồ sơ của vòng.
- Chín vòng là một mẫu nhỏ, và một vòng (1 301 phút) kéo dài qua đêm. Ngưỡng dùng trung vị nên không bị nó kéo.
