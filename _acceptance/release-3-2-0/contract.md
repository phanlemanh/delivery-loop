---
schema_version: 1
feature: Phát hành kit 3.2.0 — Mốc A, mang sáu hồ sơ được ký sau thẻ v3.1.1 (đặc tả UX đọc sổ màn, đối soát bàn giao, nâng repo-setup, bằng chứng cũ theo đầu vào, giám sát đọc bản uỷ quyền, đổi tên bản uỷ quyền) tới kho tiêu thụ; chiến dịch ghim lại của mốc; kho chờ nhận onehub-inventory
slug: release-3-2-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 5 tệp khai + câu khớp-phiên-bản của GUIDE + CHANGELOG + một dòng cấu hình kho kit + hồ sơ mốc + bản đồ — KHÔNG dính t3_paths
surfaces: [cli]
status: draft
---

# Acceptance Contract: release-3-2-0

## Context

**Lời giao:** chủ kho 28/11/2026 ở phiên giữ đợt, nguyên văn «Mở Mốc A» — trả lời câu «Mở Mốc A (DL2 + DL6 + V1) bây giờ?».
Mốc A là việc thứ hai của đề xuất đã phê 28/11 (V1 → Mốc A → V2a → …). Đề bài đầy đủ: `migration/de-bai-moc-a.md` trên nhánh
`chuyen-nha` (không chép vào hồ sơ này).

**Kho chờ nhận:** `onehub-inventory` (đang ghim `v3.1.1`). Vòng này KHÔNG đụng kho tiêu thụ nào; đề bài nâng kit của từng
kho do phiên giữ đợt viết sau khi thẻ có.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-3), không chép tay. **Sáu hồ sơ được ký** sau thẻ `v3.1.1` (`1193bc22`):

| Hồ sơ | PR · commit gộp | Gói có tệp đổi |
|---|---|---|
| `dac-ta-ux-doc-so-man` | #27 · `b0f88c44` | `acceptance-gate`, `feature-loop` |
| `doi-soat-ban-giao` | #32 · `48590d28` | `dispatch` |
| `nang-repo-setup-0-10-4` | #34 · `4dcff578` | không tệp nào dưới `plugins/` |
| `bang-chung-cu-theo-dau-vao` (DL2) | #37 · `2956dae2` | `feature-loop` |
| `giam-sat-doc-ban-uy-quyen` (DL6) | #38 · `a9b7cbe6` | `dispatch` |
| `doi-ten-ban-uy-quyen` (V1) | #39 · `36d29fed` | `dispatch` |

Sáu PR khác gộp vào nhánh chính trong cửa sổ không mang hồ sơ được ký mới: #29 (phần còn lại của nhánh mốc 3.1.1 sau commit
thẻ), #30, #31, #33, #35, #36 (tài liệu, ADR 0030 và hạt giống). So thẻ `v3.1.1` với gốc vòng `36d29fed`: `acceptance-gate`
đổi 3 tệp, `dispatch` 17, `feature-loop` 4; `roadmap`, `knowledge`, `diagram-design` không đổi.

**Vật của mốc** (trên nền `36d29fed`):

1. Năm gói `acceptance-gate`, `feature-loop`, `dispatch`, `roadmap`, `knowledge` lên `3.2.0`; `diagram-design` giữ `3.0.0`.
   Luật đánh số của kho là ca vĩnh viễn P200: năm gói lõi mang CÙNG một số, `diagram-design` theo bản skill vendored — nên
   `roadmap` và `knowledge` lên số dù thư mục không đổi (tiền lệ 3.1.0, 3.1.1). Mô tả hai gói lõi đổi mục `v3.2.0`; câu «Khớp
   phiên bản» của GUIDE đổi theo.
2. Mục `3.2.0` của `CHANGELOG.md`: đổi gì, ai bị ảnh hưởng, kho tiêu thụ làm gì khi nhận, lớp chép CI, năm dòng số, dự báo,
   điều kiện tin cậy, dòng hiệu chuẩn — một nguồn, hồ sơ không chép lại. Tên khoá của bản uỷ quyền trong mọi chữ của mốc là
   bộ tên tiếng Anh sau V1; tên cũ chỉ được nhắc ở câu «tệp còn tên cũ bị từ chối cả tệp».
3. **Chiến dịch ghim lại của mốc** (GUIDE mục 7.1): một làn máy ghim lại năm hồ sơ của cửa sổ tại commit đã nâng số —
   `bang-chung-cu-theo-dau-vao`, `dac-ta-ux-doc-so-man`, `doi-soat-ban-giao`, `doi-ten-ban-uy-quyen`,
   `giam-sat-doc-ban-uy-quyen` (AC-7). Hồ sơ không ghim lại: nêu tên và lý do ở Notes.
4. Kho kit bật `feature_loop.ngoai_n_tu_dinh_tuyen: true` trong `_acceptance/config.yaml` của chính nó (AC-10) — cấu hình
   của kho kit, KHÔNG đi theo thẻ tới kho tiêu thụ. Mục này theo câu trả lời Hỏi-2 ở Cổng Phạm vi; chủ kho chọn lối khác
   thì gỡ khỏi hợp đồng trước khi duyệt.
5. Hồ sơ này với `chay.sh` gọi lại `cua-so.sh` (release-2-39-0), `goi-chi-doi-so.sh` và `lop-chep-doi.sh` (release-3-1-0)
   với mốc `v3.1.1`, thêm nhóm `ghim-lai` (gọi vị từ «bằng chứng còn mới» sẵn có của kit) và `khoa-bat`; dòng 1 của luật (c)
   đo bằng `do-dong-1.sh` của hồ sơ release-3-1-1 cho từng hồ sơ (kết quả `do-dong-1.md`); rà bộ kiểm trên commit gộp thử
   bằng `gop-thu.sh` của hồ sơ release-3-1-1; một hạt giống về dòng `gio-may`; vẽ lại bản đồ và trang lộ trình.

Số là **3.2.0** (minor): cửa sổ có bề mặt mới — bộ đọc `governance/delegation.yaml` và lối gộp theo quyền của gói `dispatch`
(DL6, V1), cờ `--chi-xet` của `pr-san-sang` và vị từ bằng chứng cũ dùng chung (DL2), lệnh đọc sổ màn `so-man.cjs` (#27), đối
soát bàn giao lúc nối lại đợt (#32) — theo nếp «minor cho bề mặt mới» (tiền lệ 3.1.0).

Source input: `git log v3.1.1..origin/main --first-parent` · nếp phát hành `_acceptance/release-3-1-1/` và
`_acceptance/release-3-1-0/` · Notes của sáu hồ sơ trong cửa sổ.

## Criteria

Mọi lệnh `chay.sh <nhóm>` đo ở HEAD: thẻ `v3.2.0` gắn vào commit gộp PR mốc (tiền lệ 3.1.0 — xem Notes «Thẻ gắn vào đâu»).

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (ca vĩnh viễn P200), Then lệnh thoát 0 — P200 đòi năm gói lõi mang CÙNG một số hợp semver, `diagram-design` hợp semver, mô tả `acceptance-gate` có mục của đúng số ấy, mục ấy của `feature-loop` tự khai cặp `acceptance-gate >= <số>`, và câu «Khớp phiên bản» của GUIDE dựng từ số trong tệp khai.
- AC-2: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows) và `product-map --check`, Then mọi lệnh XANH.
- AC-3: Given tập hồ sơ ĐƯỢC KÝ sau thẻ `v3.1.1` tới HEAD, suy từ kho (`_acceptance/release-3-2-0/chay.sh cua-so`), When so với sáu hồ sơ kể trong Context, Then hai tập BẰNG NHAU.
- AC-4: Given mốc `1193bc22` (thẻ `v3.1.1`), When so thư mục `plugins/diagram-design/` và số của nó với HEAD (`chay.sh dd-giu`), Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `3.0.0` là đúng.
- AC-5: Given mốc `1193bc22`, When liệt tệp đổi dưới `plugins/roadmap/` và `plugins/knowledge/` tới HEAD (`chay.sh goi-doi`), Then tập tệp đổi BẰNG đúng hai tệp khai VÀ mọi dòng đổi là dòng `"version"`.
- AC-6: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `3.2.0` trong CHANGELOG và mốc `1193bc22`, When so tệp nào của lớp chép đổi byte tới HEAD (`chay.sh lop-chep`), Then tập tệp đổi BẰNG tập ghi chú kể — ở mốc này cả hai rỗng và gạch nói đúng chữ «không chép gì».
- AC-7: Given năm hồ sơ của chiến dịch ghim lại kể trong Context, When hỏi vị từ «bằng chứng còn mới» của kit cho từng hồ sơ ở HEAD (`chay.sh ghim-lai`), Then cả năm trả «còn mới» và lệnh thoát 0 với «XANH: 5/5 hồ sơ của chiến dịch ghim lại còn mới ở HEAD».
- AC-8: Given mục `3.2.0` của `CHANGELOG.md` cùng nguồn nó chép, When đọc từng phần, Then (i) mỗi mục con của sáu hồ sơ (dòng «Gốc:», gạch «Vật:», giới hạn trích) là chữ của hợp đồng hồ sơ ấy, không nói rộng hơn, và số giới hạn khớp Notes và sổ quyết định của hồ sơ; (ii) năm dòng số khớp nguồn đếm (sổ chạy, `usage-report.md`, sổ quyết định, `do-dong-1.md`); (iii) đoạn «Vì sao 3.2.0», «Ai bị ảnh hưởng» và «Kho tiêu thụ làm gì khi nhận» nói thẳng đổi hành vi chạm kho đang dùng và nêu đủ bốn ca: kho KHÔNG có `governance/delegation.yaml`, kho không cài gói `dispatch`, kho chưa bật khoá nào của DL2, và lớp chép CI; (iv) mọi tên khoá và tên quyền của bản uỷ quyền trong mục là bộ tên tiếng Anh sau V1 — tên cũ chỉ xuất hiện ở câu nói tệp còn tên cũ bị từ chối cả tệp. (judgment)
- AC-9: Given số trong tệp khai `acceptance-gate` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc`, Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT … — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.
- AC-10: Given `_acceptance/config.yaml` của kho kit, When bên ghi của máy tự định tuyến đọc khoá `feature_loop.ngoai_n_tu_dinh_tuyen` (`chay.sh khoa-bat`), Then khoá đọc ra là bật: lệnh thoát 0 với «XANH: khoá feature_loop.ngoai_n_tu_dinh_tuyen bật».

## Coverage

- Quét theo hai trục của nếp release-2-1-0 → 3.1.1, không quét lại: Trục A · vật của một lần cắt số (tệp khai | dòng
  khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước
  CE: ba mươi chín mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge | chiến dịch ghim lại)
  `[thước CE: xanh_sach_check + ADR 0012 + GUIDE mục 7.1]`. Ô Core → AC-1 · AC-2 · AC-3; gói giữ số → AC-4; gói chỉ đổi số →
  AC-5; lớp chép CI khớp ghi chú → AC-6; chiến dịch ghim lại → AC-7 (ô của mốc này: hồ sơ cửa sổ còn mới ở commit sẽ gắn
  thẻ); ghi chú nhận chép đúng chữ nguồn và cân trên mọi kho → AC-8 (judgment); bản cài khớp thẻ → AC-9 (khoá KC1); cấu hình
  kho kit → AC-10. Biên merge (bộ kiểm xanh trên commit gộp thử) rà riêng bằng `gop-thu.sh` ngoài lượt chấm — xem Notes.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội; ngưỡng của từng vòng sống ở hồ sơ của nó.

## Out of scope

- Đổi dòng mã cổng hay mã gói — mốc phát hành KHÔNG dựng răng mới và không sửa engine (GUIDE mục 7.1, đề bài); thấy lỗi
  engine thì dừng và báo.
- Cài 3.2.0 lên kho tiêu thụ nào, viết `governance/delegation.yaml` vào kho nào, soạn đề bài nâng kit hay bảng khoá của
  từng kho — việc của phiên giữ đợt và phiên của kho nhận, sau khi thẻ có.
- Sửa sử cũ: mục CHANGELOG 3.1.1 trở về trước giữ nguyên.
- Sửa lệnh đo vòng `do-vong.mjs` (dòng `gio-may` đếm sai phiên và cửa sổ) — hạt giống
  `docs/plans/2026-11-28-hat-giong-do-vong-dem-sai-phien-va-cua-so.md`, vòng riêng; số token và phút máy của mốc này nêu
  kèm giới hạn ấy.
- Ghim lại hồ sơ hoá cũ từ TRƯỚC cửa sổ (năm hồ sơ của cửa sổ 3.1.0–3.1.1, ba hồ sơ mốc, 236 hồ sơ ghim trước thẻ
  `v3.0.0`) và hồ sơ `nang-repo-setup-0-10-4` — xem Notes «Hồ sơ không ghim lại».

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths`. Trần 3 lượt gọi người; dự kiến 2 (Cổng Phạm vi, Cổng Bằng chứng).
- `.claude-plugin/marketplace.json` không mang số kit nào nên không đổi.
- **Thẻ gắn vào đâu.** Thẻ `v3.2.0` gắn vào commit gộp PR mốc, sau khi job `tests` trên chính commit gộp ấy xanh — nếp của
  mọi mốc tới 3.1.0. Lối B của 3.1.1 (thẻ vào commit cuối nhánh mốc) chỉ dùng khi một PR đổi `plugins/` hoặc mang hồ sơ
  được ký gộp vào nhánh chính giữa vòng; PR #40 đang mở chỉ có tài liệu nên gộp giữa vòng cũng không đổi cửa sổ — khi đó
  gộp nhánh chính vào nhánh, không ghim lại (tệp `docs/**` và `_acceptance/**` không làm bằng chứng cũ đi).
- **Hồ sơ không ghim lại** (đo 28/11 bằng `pr-san-sang.mjs --chi-xet` trên `36d29fed`: 250 hồ sơ đã ký, 1 còn mới, 249 cũ):
  - `nang-repo-setup-0-10-4` (trong cửa sổ): tiêu chí AC-7 của nó đo «tệp vòng đổi so với bản gốc vòng» với gốc ghi cứng
    `87a392cd`; nhánh chính tiến thì lệnh đỏ theo định nghĩa (đo 28/11: thoát 1 «ngoài danh sách: …»), nên làn ghim lại
    không ghim được. Sáu eval còn lại của nó xanh ở HEAD. Lối «cho hồ sơ nghỉ» (GUIDE) là của người; mốc không dùng vì hồ sơ
    không chặn gì — lưới trước-gộp chỉ xét hồ sơ trong diff của PR.
  - Năm hồ sơ của cửa sổ 3.1.0–3.1.1 (`loi-gop-trong-cau-ky`, `tep-chung-khong-chan-gop`, `mac-ky-co-phu-quyet`,
    `chuyen-gop`, `va-chu-ky-giu-cho-lenh-gop`) và ba hồ sơ mốc (`release-3-0-0`, `release-3-1-0`, `release-3-1-1`): hoá cũ
    từ trước cửa sổ này (chính commit nâng số của 3.1.0 và 3.1.1); hai mốc trước không ghim lại. Hồ sơ mốc đo một thời điểm
    — eval cửa sổ của nó đổi kết quả khi nhánh chính tiến.
  - 236 hồ sơ ghim trước thẻ `v3.0.0`: hoá cũ từ lần đổi bố cục `plugins/<tên>/` của 3.0.0 — nợ đã biết.
- **Lượt đo dài** (chạy trọn bộ kiểm; đề bài cho hai lượt không hỏi): làn ghim lại · lượt chấm · rà commit gộp thử. Đường
  nền đầu vòng không chạy (tiền lệ release-3-1-1): nền đối chiếu bằng CI push trên chính gốc vòng `36d29fed` (job `tests`
  SUCCESS). Lượt thứ ba trở đi theo câu trả lời Hỏi-3 ở Cổng Phạm vi.
- **Giới hạn của dòng 4–5** (token, phút máy): bảng năm dòng lấy out-token và phút S4 từ `usage-report.md` của từng hồ sơ
  (đo từ bản ghi của chính lượt chấm). Dòng `gio-may` của `do-vong` KHÔNG dùng làm số: nó cộng cả phiên chỉ nhắc tên vòng,
  mở cửa sổ ở commit đầu của hồ sơ (bỏ S0–S1) và đo trước khi gộp — hạt giống ở Out of scope. Sáu hồ sơ của cửa sổ đều không
  có ô cơ hội nên đều mắc lỗi mở cửa sổ muộn.
- **Rà biên merge** (đề bài, ngoài lượt chấm): `_acceptance/release-3-1-1/gop-thu.sh` dựng một cây tách rời, HEAD = gộp
  `--no-ff` nhánh vòng vào `origin/main`, chạy đúng các lệnh suite của lượt chấm; kết quả ghi `gop-thu.md` và lên thẻ Cổng
  Bằng chứng.
- **Cân trên mọi kho** — chi tiết ở mục 3.2.0 của CHANGELOG (AC-8 soi): kho KHÔNG có `governance/delegation.yaml` chạy như
  3.1.1 (DL6 đo ba ca chiều im: có remote, không remote, mất mạng); kho không cài gói `dispatch` không nhận đổi hành vi nào
  của #32, DL6, V1; DL2 không thêm khoá — kho chưa khai `risk_tiers.stale_scope: paths` giữ luật hoá cũ như cũ, chỉ đổi ở
  `pr-san-sang` (nay loại tệp T1) và làn ghim lại (khớp T1 theo đúng luật của lưới); lớp chép CI không tệp nào đổi.
- Điều kiện tin cậy (i) của dòng 4–5: `git diff --stat v3.1.1 HEAD -- plugins/feature-loop/workflows/
  plugins/feature-loop/agents/` phải rỗng — đo ở S3, ghi vào mục CHANGELOG.
- Chiều đỏ của các lệnh riêng, đo 28/11 trước Cổng Phạm vi trên `36d29fed` (cây chưa nâng số, chưa ghim lại, chưa bật khoá):
  `chay.sh cua-so 0a93a5b9` (mốc lùi về thẻ `v3.1.0`) thoát 1 «hồ sơ ĐƯỢC KÝ trong cửa sổ mà mốc KHÔNG kể:
  va-chu-ky-giu-cho-lenh-gop»; `chay.sh dd-giu 0c4e503b` (thẻ `v2.39.0`) thoát 1 «mốc … không có
  plugins/diagram-design/.claude-plugin/plugin.json»; `chay.sh goi-doi` thoát 1 «tập tệp đổi khác hai tệp khai»;
  `chay.sh lop-chep` thoát 2 «mục «## 3.2.0» của CHANGELOG không có gạch «- **Lớp chép CI:…»»; `chay.sh ghim-lai` thoát 1
  với bốn dòng «ĐỎ: bằng chứng của <hồ sơ> không còn mới ở HEAD (mã 2)» cho `bang-chung-cu-theo-dau-vao`,
  `dac-ta-ux-doc-so-man`, `doi-soat-ban-giao`, `giam-sat-doc-ban-uy-quyen` và một dòng «còn mới: doi-ten-ban-uy-quyen» (đối
  chứng dương: `GHIM_LAI=doi-ten-ban-uy-quyen chay.sh ghim-lai` thoát 0 «XANH: 1/1 …»); `chay.sh khoa-bat` thoát 1 «ĐỎ: khoá
  feature_loop.ngoai_n_tu_dinh_tuyen đang tắt».
