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

## Vòng thật đầu tiên trên kit 3.0 (đo 19/11 17:40)

`split-log-ledger` — T2, PR #92 của Inventory, gộp tại `1ad8469f` (19/11 15:58), `KIT_TAG v3.0.0`. Việc dọn: tách sổ log của
wiki ra khỏi git, nửa đầu của nâng `repo-setup` 0.9.0. Ngưỡng ở trên không sửa.

| Dòng | Số | Ngưỡng | Kết |
|---|--:|---|---|
| Lượt gọi người ngoài thiết kế quy về kit mới | 0 | 0 | đạt |
| Lượt chấm bị hạ tầng kit đốt | 0 | 0 | đạt |
| Lượt gọi người của vòng | 3 | ≤ 3 (T2) | đạt |
| Ký → gộp | 50′ | ≤ 51′ | đạt, sát ngưỡng |
| Làm-xong → ký | 146′ | ≤ 383′ | đạt |
| Token và phút máy | S4 hai lượt: 67 106 + 54 256 token ra · 751 s + 734 s đồng hồ | chỉ đọc | — |

Cách đếm từng dòng:

- **Ký → gộp:** `nguong-thuc-te.mjs cua-so --tu 47d52b06 --den 1ad8469f` — 1 vòng, 50′, 0 lần gộp nhánh chính vào nhánh.
- **Làm-xong → ký:** cùng định nghĩa với `loop-health` (commit đầu ghi `status: implemented` → commit đầu ghi
  trạng thái đã ký): `c5ae6f4d` 12:42:25 → `3b9fa0da` 15:08:14. Đo tay vì `loop-health` đọc lịch sử của HEAD bản kéo
  (`c79189dd`, chậm nhánh chính 17 commit) chứ không của `--at`, nên không thấy vòng này.
- **Lượt gọi người:** ba lần chủ kho ký — Cổng Phạm vi 12:41, Cổng Phạm vi lần hai 14:43, Cổng Bằng chứng 15:08. Lần hai do
  chủ kho đổi câu trả lời Hỏi-2 sau lượt chấm 1 (không sửa ba hồ sơ đã ký, để khỏi phải ghim lại chúng); nguyên nhân là
  quyết định của người, không quy về kit.
- **Hạ tầng đốt:** lượt chấm 1 REJECT vì phép đo E6 của chính vòng đọc CI khi lượt CI của PR chưa xong; lượt 2 chấm lại,
  không sửa sản phẩm. Đỏ vì thước của vòng, không vì vật và không vì hạ tầng kit; không có làn ghim lại.
- **Token và phút:** `_acceptance/split-log-ledger/usage-report.md` tại `1ad8469f`.

Quan sát ghi lại, không phải việc của đợt: hồ sơ của vòng ghi hai hồ sơ đã ký của Inventory đỏ sẵn trên nhánh chính
(`tat-plugin-cho-cu` E1, `upgrade-repo-setup-0-9-0` «rules-kept»). Đó là việc của kho ấy, theo dõi ở lượt ghim lại kế.

## Hai vòng kế trên kit 3.0 (đo 21/11 09:10, chuông hằng ngày)

`nguong-thuc-te.mjs cua-so --tu 47d52b06 --den 8e0a91c9` (nhánh chính Inventory tại `8e0a91c9`, `KIT_TAG v3.0.0`): 3 vòng
đo được. Ngưỡng ở trên không sửa. Chỉ đo ký → gộp; các dòng khác của hai vòng này chưa đếm.

| Vòng | PR | Ký → gộp | Ngưỡng 51′ | Nguyên nhân khi vượt |
|---|---|--:|---|---|
| `split-log-ledger` | #92 | 50′ | đạt | — |
| `upgrade-repo-setup-0-10-1` | #93 | **89′** | **vượt** | xem dưới |
| `commit-msg-kit-subjects` | #94 | 46′ | đạt | — |

PR #93, đọc từ GitHub: ký 03:38Z · lượt CI đầu trên commit chữ ký ĐỎ sau 5′ ở job `conventional-commits` («Check every
commit the branch would add») và job gộp `check` · lượt CI chạy lại 03:48Z → xanh 04:25Z (37′) · gộp 05:07Z. Tách 89′:
khoảng 10′ vì lượt CI đỏ đầu, 37′ một lượt CI trọn, **42′ chờ người bấm gộp sau khi CI đã xanh**.

- Lượt CI đỏ: phép kiểm tiêu đề commit mà bản `repo-setup` 0.10.1 vừa đưa vào từ chối tiêu đề commit do kit ghi. Kho ấy
  sửa ở PR #94 («accept the commit subjects the acceptance kit writes»). Đây là chỗ hai công cụ gặp nhau, không phải thay
  đổi của kit 3.0; phiên giữ đợt CHƯA kiểm kit 2.x có ghi cùng dạng tiêu đề hay không.
- 42′ chờ gộp: cùng chỗ thiếu thiết kế mà vòng «lời gộp trong câu ký» đang chữa (thẻ không mang lời gộp). Chỗ thiếu này
  có từ trước 3.0, nên không quy về kit MỚI.

Kết: vế 2 không đổi sang đỏ theo luật đã khai («nguyên nhân thuộc kit mới thì vế đỏ»), nhưng dòng ký → gộp nay là 2 đạt
trên 3 vòng, không còn là «đạt» trọn. PR #95 (`upgrade-repo-setup-0-10-2`) và #97 đã gộp nhưng bộ đo không tính thành vòng
ở cửa sổ này; chưa tìm hiểu vì sao.
