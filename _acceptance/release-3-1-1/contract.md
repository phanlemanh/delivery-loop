---
schema_version: 1
feature: Phát hành kit 3.1.1 — bản vá mang «chữ ký giữ chỗ không còn qua vế chữ ký của lệnh gộp theo lời» (PR #26, hồ sơ va-chu-ky-giu-cho-lenh-gop) tới kho tiêu thụ; kho chờ nhận onehub-inventory
slug: release-3-1-1
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 5 tệp khai + câu khớp-phiên-bản của GUIDE + CHANGELOG + hồ sơ mốc + bản đồ — KHÔNG dính t3_paths
surfaces: [cli]
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-11-23
---

# Acceptance Contract: release-3-1-1

## Context

**Lời giao:** chủ kho 23/11/2026, nguyên văn «Mở phiên mới vòng mốc 3.1.1 mang bản vá». Thẻ `v3.1.0` (`0a93a5b9`, PR #24)
được cắt TRƯỚC khi bản vá chữ ký giữ chỗ gộp (PR #26, `1a887948`), nên kho cài 3.1.0 vẫn để báo cáo mang
`human_signoff: pending` lọt vế chữ ký của lệnh gộp theo lời. Đề bài đầy đủ: `migration/de-bai-moc-3-1-1.md` trên nhánh
`chuyen-nha` (không chép vào hồ sơ này).

**Kho chờ nhận:** `onehub-inventory`. Ở kho ấy PR #109 (`nang-kit-3-1`) đã gộp, PR #110 (đổi `KIT_TAG` sang `v3.1.0`) đang
mở. Vòng này KHÔNG đụng Inventory; kho nhận cần đổi `KIT_TAG` sang `v3.1.1` để có bản vá — việc ở phiên của kho đó.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-3), không chép tay. Một hồ sơ **được ký** sau thẻ `v3.1.0`:
`va-chu-ky-giu-cho-lenh-gop` (#26). Không PR nào khác gộp vào nhánh chính trong cửa sổ tới commit mốc (lúc cắt nhánh, `git
log --first-parent v3.1.0..origin/main` chỉ có commit gộp `1a887948`; PR #27 gộp sau đó — xem Notes «Lối B»). Thư mục gói có tệp đổi: `acceptance-gate` (`commands/signoff.md`) ·
`dispatch` (`scripts/gop.mjs`, `scripts/dieu-phoi.mjs`) · `feature-loop` (`skills/feature-loop/SKILL.md`).

**Vật của mốc** (trên nền `1a887948`):

1. Năm gói `acceptance-gate`, `feature-loop`, `dispatch`, `roadmap`, `knowledge` lên `3.1.1`; `diagram-design` giữ `3.0.0`.
   Luật đánh số của kho là ca vĩnh viễn P200: năm gói lõi mang CÙNG một số, `diagram-design` theo bản skill vendored — nên
   `roadmap` và `knowledge` lên số dù thư mục không đổi (như tiền lệ 3.1.0 và 2.38.1). Mô tả hai gói lõi đổi mục `v3.1.1`;
   câu «Khớp phiên bản» của GUIDE đổi theo.
2. Mục `3.1.1` của `CHANGELOG.md`: đổi gì, ai bị ảnh hưởng, kho tiêu thụ làm gì khi nhận, lớp chép CI, năm dòng số, dự báo,
   điều kiện tin cậy, dòng hiệu chuẩn — một nguồn, hồ sơ không chép lại.
3. Hồ sơ này với `chay.sh` gọi lại hai tệp lệnh của hồ sơ `release-3-1-0` (`goi-chi-doi-so.sh`, `lop-chep-doi.sh`) với mốc
   `v3.1.0` và thêm nhóm `vat-va`; `do-dong-1.sh` đo dòng 1 của luật (c) cho #26 (kết quả `do-dong-1.md`);
   `gop-thu.sh` rà bộ kiểm trên commit gộp thử; hạt giống bộ đo ký → gộp; vẽ lại bản đồ và trang lộ trình.

Số là **3.1.1** (patch): vòng duy nhất trong cửa sổ siết một vế kiểm sẵn có, không thêm khoá cấu hình, lệnh hay bề mặt mới
— theo nếp «minor cho bề mặt mới» (tiền lệ 2.38.1).

Source input: `git log v3.1.0..origin/main --first-parent` · nếp phát hành `_acceptance/release-3-1-0/` · Notes của hồ sơ
`va-chu-ky-giu-cho-lenh-gop`.

## Criteria

**Commit mốc** = commit gắn thẻ `v3.1.1`: commit cuối của nhánh mốc TRƯỚC khi nhánh chính gộp vào nhánh (lối B, Notes). Lệnh
`chay.sh <nhóm> --dinh-moc` đo ở commit ấy — sha ghi ở `dinh-moc.txt` của hồ sơ; ở chính commit mốc tệp vắng nên là HEAD.

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (ca vĩnh viễn P200), Then lệnh thoát 0 — P200 đòi năm gói lõi mang CÙNG một số hợp semver, `diagram-design` hợp semver, mô tả `acceptance-gate` có mục của đúng số ấy, mục ấy của `feature-loop` tự khai cặp `acceptance-gate >= <số>`, và câu «Khớp phiên bản» của GUIDE dựng từ số trong tệp khai.
- AC-2: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows) và `product-map --check`, Then mọi lệnh XANH.
- AC-3: Given tập hồ sơ ĐƯỢC KÝ sau thẻ `v3.1.0` tới commit mốc, suy từ kho (`_acceptance/release-3-1-1/chay.sh cua-so --dinh-moc`), When so với hồ sơ kể trong Context, Then hai tập BẰNG NHAU.
- AC-4: Given mốc `0a93a5b9` (thẻ `v3.1.0`), When so thư mục `plugins/diagram-design/` và số của nó với commit mốc (`chay.sh dd-giu --dinh-moc`), Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `3.0.0` là đúng.
- AC-5: Given mốc `0a93a5b9`, When liệt tệp đổi dưới `plugins/roadmap/` và `plugins/knowledge/` tới commit mốc (`chay.sh goi-doi --dinh-moc`), Then tập tệp đổi BẰNG đúng hai tệp khai VÀ mọi dòng đổi là dòng `"version"`.
- AC-6: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `3.1.1` trong CHANGELOG và mốc `0a93a5b9`, When so tệp nào của lớp chép đổi byte tới commit mốc (`chay.sh lop-chep --dinh-moc`), Then tập tệp đổi BẰNG tập ghi chú kể — ở mốc này cả hai rỗng và gạch nói đúng chữ «không chép gì».
- AC-7: Given mốc `0a93a5b9` và commit gộp #26 `1a887948`, When liệt tệp đổi dưới `plugins/` từ mốc tới commit mốc và so phần ngoài năm tệp khai với `1a887948` (`chay.sh vat-va --dinh-moc`), Then tập tệp đổi BẰNG bốn tệp của #26 cộng năm tệp khai, VÀ ngoài năm tệp khai cây `plugins/` ở commit mốc trùng byte với `1a887948` — thẻ mang đúng bản vá, không thêm gì khác.
- AC-8: Given mục `3.1.1` của `CHANGELOG.md` cùng nguồn nó chép, When đọc từng phần, Then (i) mục con của hồ sơ (dòng «Gốc:», gạch «Vật:», giới hạn trích, giới hạn khai trước) là chữ của hợp đồng hồ sơ ấy, không nói rộng hơn, và số giới hạn khớp Notes và sổ quyết định; (ii) năm dòng số khớp nguồn đếm (sổ chạy, `usage-report.md`, sổ quyết định, lịch sử commit đã dẫn); (iii) đoạn «Vì sao 3.1.1» và «Ai bị ảnh hưởng» không giấu đổi hành vi chạm kho đang dùng, nêu rõ kho không cài gói điều phối có đổi hành vi không. (judgment)
- AC-9: Given số trong tệp khai `acceptance-gate` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc`, Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT … — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.

## Coverage

- Quét theo hai trục của nếp release-2-1-0 → 3.1.0, không quét lại: Trục A · vật của một lần cắt số (tệp khai | dòng
  khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước
  CE: ba mươi tám mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check +
  ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3; gói giữ số → AC-4; gói chỉ đổi số → AC-5; lớp chép CI khớp ghi chú → AC-6; thẻ
  mang đúng bản vá → AC-7 (ô mới của mốc vá: phạm vi diff so với commit gộp của bản vá); ghi chú nhận chép đúng chữ nguồn →
  AC-8 (judgment); bản cài khớp thẻ → AC-9 (khoá KC1). Biên merge (bộ kiểm xanh trên commit gộp thử) rà riêng bằng
  `gop-thu.sh` ngoài lượt chấm — xem Notes.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội; ngưỡng của vòng sống ở hồ sơ của nó.

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1); bản vá đã ký và gộp ở #26.
- Cài 3.1.1 vào `onehub-inventory`, đổi `KIT_TAG` ở PR #110 của kho ấy, hay báo thẻ cho kho tiêu thụ — việc của kho nhận.
- Sửa sử cũ: mục CHANGELOG 3.1.0 trở về trước giữ nguyên.
- Sửa bộ đo ký → gộp `plugins/dispatch/scripts/do-gop.mjs` (trả rỗng với commit ký nằm trên cha thứ hai — thấy khi đo dòng 1
  của mốc này) — hạt giống `docs/plans/2026-11-23-hat-giong-do-gop-cha-thu-hai.md`, vòng riêng; dòng 1 của mốc đo bằng
  `do-dong-1.sh` của hồ sơ này.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths`.
- `.claude-plugin/marketplace.json` không mang số kit nào nên không đổi.
- Điều kiện tin cậy (i) của dòng 4–5 GIỮ ở cửa sổ này: `git diff --stat v3.1.0 HEAD -- plugins/feature-loop/workflows/
  plugins/feature-loop/agents/` rỗng.
- **Cân trên mọi kho.** Mốc chỉ đổi số và tài liệu; hành vi mới duy nhất là của #26: lệnh gộp theo lời
  (`dieu-phoi.mjs gop … --theo-loi`) thôi gộp báo cáo mang chữ ký giữ chỗ. Kho không cài gói điều phối, hoặc không bật
  `feature_loop.gop_theo_loi_ky`, không chạy lệnh ấy nên không đổi hành vi; ở các kho đó chỉ dòng lệnh mẫu trong khối
  `GOP-THEO-LOI-KY` (SKILL S5, lệnh ký) có thêm đuôi `--loi`.
- **Rà biên merge** (đề bài, ngoài lượt chấm): `gop-thu.sh` dựng một cây tách rời, HEAD = gộp `--no-ff` nhánh vòng vào
  `origin/main`, chạy đúng các lệnh suite của lượt chấm; kết quả ghi `gop-thu.md` và lên thẻ Cổng Bằng chứng.
- Chiều đỏ của các lệnh riêng, đo 23/11 trước Cổng Phạm vi (cây chưa nâng số): `cua-so.sh 0a93a5b9
  va-chu-ky-giu-cho-lenh-gop chuyen-gop` thoát 1 «mốc kể hồ sơ KHÔNG được ký trong cửa sổ: chuyen-gop»; `chay.sh dd-giu
  90c3f9f1` thoát 1 «plugins/diagram-design có dòng đổi»; `chay.sh goi-doi` thoát 1 «tập tệp đổi khác hai tệp khai»;
  `chay.sh vat-va` thoát 1 «tập tệp đổi khác bốn tệp của #26 cộng năm tệp khai»; `chay.sh vat-va 0a93a5b9 0a93a5b9` (giả
  commit bản vá là thẻ cũ) thoát 1 thêm «ngoài năm tệp khai, plugins/ ở HEAD lệch commit gộp bản vá: …» nêu bốn tệp.
  `chay.sh lop-chep a2198fcf` (sau khi có mục 3.1.1) thoát 1 «tệp đổi mà ghi chú KHÔNG kể: scripts/can-cu-s1.cjs
  scripts/hop-thu/hinh-dang.mjs scripts/tro-ly-quyet-dinh.cjs».
- **Lối B — thẻ không vào commit gộp PR mốc** (chủ kho 23/11 ở phiên vòng, nguyên văn «B, cho mở PR tạm vào nhánh đặt ở
  1a887948 để lấy CI trên b427f2af»). PR #27 (`dac-ta-ux-doc-so-man`, `b0f88c44`) gộp vào nhánh chính 23/11 09:41 sau khi
  nhánh vòng cắt từ `1a887948`, đổi `plugins/` và có một hồ sơ đã ký. Gộp nhánh chính vào nhánh rồi gắn thẻ vào commit gộp
  PR thì thẻ mang cả #27 — không còn là bản vá (E3, E7 đỏ trên commit gộp thử). Nên: thẻ `v3.1.1` gắn vào commit mốc; E3–E7
  đo ở commit mốc bằng `--dinh-moc`; E1, E2*, E9 vẫn đo HEAD (bộ kiểm phải xanh trên chính cây sẽ gộp). Câu CHANGELOG về
  chỗ gắn thẻ sửa theo, trong chính commit mốc. Commit mốc phải có một lượt CI chạy xong và xanh ở job `tests` trước khi
  nhánh chính gộp vào nhánh — lấy bằng PR tạm vào nhánh `tam/ci-release-3-1-1-nen-1a887948` đặt ở `1a887948`, vì CI của kho
  chỉ chạy trên PR và bản gộp của PR ấy có cây trùng cây commit mốc. #27 vào mốc sau. Đề bài ghi «thẻ vào đúng commit gộp»;
  lối này lệch chữ ấy có chủ đích, chủ kho đã chọn.
  CI trên commit mốc: `b427f2af` lượt 45116883796 và `1193bc22` (commit mốc, có câu CHANGELOG đã sửa) lượt 45117767660 —
  job `tests` xanh 13/13 mảnh ở cả hai; job `gate` đỏ đúng một vi phạm «human_signoff is empty» (Cổng Bằng chứng chưa ký).
  Sau đó nhánh chính `b0f88c44` gộp vào nhánh; `dinh-moc.txt` = `1193bc22`; hợp đồng hạ về `implemented` cho lượt chấm 4
  (chủ kho «cho chạy lượt chấm 4» — vượt trần ba lượt, cũng là lượt đo dài thứ ba).
- **Lượt chấm 2 đỏ ở P179** (23/11, sau Cổng Phạm vi): lượt 1 ghi bốn mục «Đề xuất: known-limits» vào
  `review-findings.md` mà sổ `docs/research/known-limits-ledger.tsv` chưa thêm hàng (1398 < 1402). Sửa bằng
  `node tools/so-gioi-han.mjs --slug release-3-1-1 --write`. Bước này không có trong SKILL hay GUIDE, và #26 vấp
  đúng chỗ ấy ở làn ghim lại — hạt giống `docs/plans/2026-11-23-hat-giong-so-gioi-han-sau-luot-cham.md`, không làm
  trong vòng này.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-23:
  - Ngoài-1: Lần cài thử E9 kiểm đỉnh nhánh đã gộp #27, không kiểm commit mốc mà thẻ gắn vào; hai bản trùng nhau ở phần mã cài nên chưa ảnh hưởng ai.
  - Ngoài-2: Cờ `--dinh-moc` chỉ kiểm dòng mốc là một commit có thật; sửa tay dòng ấy thành bản khác thì E3–E7 vẫn có thể xanh dù đo nhầm bản.
  - Ngoài-4: Lệnh hồ sơ bị ngắt giữa chừng có thể để lại cây tạm; `do-dong-1.sh` chỉ đúng với `date` của macOS, trên máy khác in số phút sai mà không báo lỗi.
  - Ngoài-5: Công cụ rà gộp thử báo «XANH: 1/1» khi danh sách lệnh kiểm trong cấu hình rỗng hoặc thiếu khoá — không lệnh nào chạy mà vẫn xanh.
  - Ngoài-7: Phán quyết E7 nói về thẻ nhưng chỉ kiểm commit ghi tay ở `dinh-moc.txt`; thẻ gắn lệch thì phép đo không thấy.
  - Ngoài-8: Phép đối chiếu cửa sổ của E3 chỉ nhận hồ sơ `signed-off`, bỏ sót hồ sơ `machine-cleared` và `da-cham-boi-thuc-te`; ở mốc này không thiếu hồ sơ nào.
  - Ngoài-9: E3–E7 đo một commit ghi tay, không kiểm nó gắn với HEAD hay với thẻ; hôm nay commit ấy là cha đầu của đỉnh nhánh.
  - Ngoài-10: Ca P200 chỉ bảo đảm năm gói cùng một số, không bảo đảm số ấy là 3.1.1; người cắt mốc tự nhìn số khi gắn thẻ.
