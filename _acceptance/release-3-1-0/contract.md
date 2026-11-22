---
schema_version: 1
feature: Phát hành kit 3.1.0 — mốc «Trợ lý quyết định»: mang bốn hồ sơ được ký sau 3.0.0 (lời gộp trong câu ký, ba tệp chung thôi chặn gộp, mặc-ký có phủ quyết, chuyến gộp); kho chờ nhận onehub-inventory
slug: release-3-1-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 5 tệp khai + câu khớp-phiên-bản của GUIDE + CHANGELOG + hồ sơ mốc + bản đồ — KHÔNG dính t3_paths
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-11-22T10:55:00Z
---

# Acceptance Contract: release-3-1-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `onehub-inventory`. Mốc chỉ tính là «được kho nhận» khi có một commit ở nhánh
chính kho ấy kéo kit ở thẻ `v3.1.0`. Mốc 3.0.0 cũng ghi `onehub-inventory` là kho nhận (PR #2 của kho này).

**Lời giao:** phiên điều phối của thí điểm «trợ lý quyết định» (chủ kho duyệt thí điểm 22/11/2026) giao 22/11, sau khi hai
hàng thí điểm gộp: «Cắt bản phát hành mới của kit từ main (130192ae) để Inventory nâng cấp … đề nghị v3.1.0 — tính năng mới,
không phá vỡ». Chủ kho veto số hay việc cắt ở bất kỳ lúc nào trước khi gắn thẻ.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-3), không chép tay. Bốn hồ sơ **được ký** sau thẻ `v3.0.0`
(`c16d25db`): `loi-gop-trong-cau-ky` (#15) · `tep-chung-khong-chan-gop` (#17) · `mac-ky-co-phu-quyet` (#19) ·
`chuyen-gop` (#20). Bảy PR khác gộp vào nhánh chính trong cửa sổ không mang hồ sơ: #2, #3, #13, #14, #16, #18, #22.

**Vật của mốc** (trên nền `130192ae`):

1. Năm gói `acceptance-gate`, `feature-loop`, `dispatch`, `roadmap`, `knowledge` lên `3.1.0`; `diagram-design` giữ `3.0.0`
   (thư mục không đổi từ thẻ trước — tệp khai của nó nói số theo bản skill vendored). Mô tả hai gói lõi đổi mục `v3.1.0`;
   câu «Khớp phiên bản» của GUIDE đổi theo.
2. Mục `3.1.0` của `CHANGELOG.md`: đổi gì, ai bị ảnh hưởng, kho tiêu thụ làm gì khi nhận, lớp chép CI, năm dòng số, dự báo,
   điều kiện tin cậy, dòng hiệu chuẩn — một nguồn, hồ sơ không chép lại.
3. Hồ sơ này với ba tệp lệnh theo bố cục `plugins/<tên>/` (`goi-chi-doi-so.sh`, `lop-chep-doi.sh` — bản 2.39 và 2.38 đọc
  `road-map/`, `tri-thuc/`, `commands/acceptance-init.md` ở gốc kho, không còn từ 3.0.0 — và `chay.sh`); vẽ lại bản đồ
   và trang lộ trình.

Số là **3.1.0** (minor): bốn vòng thêm hành vi mới sau khoá kho tự bật, không đổi tên, không đổi khuôn hồ sơ.

Source input: `git log v3.0.0..130192ae --first-parent` · nếp phát hành `_acceptance/release-2-39-0/`,
`_acceptance/release-3-0-0/` · Notes của bốn hồ sơ.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (ca vĩnh viễn P200), Then lệnh thoát 0 — P200 đọc số từ sáu tệp khai, đòi năm gói lõi mang CÙNG một số hợp semver, `diagram-design` hợp semver, mô tả `acceptance-gate` có mục của đúng số ấy, mục ấy của `feature-loop` tự khai cặp `acceptance-gate >= <số>`, và câu «Khớp phiên bản» của GUIDE dựng từ số trong tệp khai rồi so.
- AC-2: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows) và `product-map --check`, Then mọi lệnh XANH.
- AC-3: Given tập hồ sơ ĐƯỢC KÝ sau thẻ `v3.0.0` suy từ kho (`_acceptance/release-3-1-0/chay.sh cua-so`), When so với bốn hồ sơ kể trong Context, Then hai tập BẰNG NHAU.
- AC-4: Given mốc `c16d25db` (thẻ `v3.0.0`), When so thư mục `plugins/diagram-design/` và số của nó với HEAD (`chay.sh dd-giu`), Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `3.0.0` là đúng.
- AC-5: Given mốc `c16d25db`, When liệt tệp đổi dưới `plugins/roadmap/` và `plugins/knowledge/` tới HEAD (`chay.sh goi-doi`), Then tập tệp đổi BẰNG đúng hai tệp khai VÀ mọi dòng đổi là dòng `"version"`.
- AC-6: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `3.1.0` trong CHANGELOG và mốc `c16d25db`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD (`chay.sh lop-chep`), Then tập tệp đổi BẰNG tập ghi chú kể.
- AC-7: Given mục `3.1.0` của `CHANGELOG.md` cùng nguồn nó chép, When đọc từng phần, Then (i) mỗi câu mô tả vòng (dòng «Gốc:», gạch «Vật:», giới hạn trích, cảnh báo chép nguyên ý) là chữ của hợp đồng, `opportunity.md` hay design doc của hồ sơ ấy, không nói rộng hơn, và số giới hạn khớp Notes và sổ quyết định của hồ sơ; (ii) năm dòng số khớp nguồn đếm (sổ chạy, `usage-report.md`, lịch sử commit); (iii) đoạn «Vì sao 3.1.0» và «Ai bị ảnh hưởng» không giấu đổi hành vi chạm kho đang dùng — kể cả cảnh báo mới của lượt chấm và lớp chép CI. (judgment)
- AC-8: Given số trong tệp khai `acceptance-gate` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc`, Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT … — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.

## Coverage

- Quét theo hai trục của nếp release-2-1-0 → 3.0.0, không quét lại: Trục A · vật của một lần cắt số (tệp khai | dòng
  khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước
  CE: ba mươi bảy mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check +
  ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3; gói giữ số → AC-4; gói chỉ đổi số → AC-5; lớp chép CI khớp ghi chú → AC-6; ghi
  chú nhận chép đúng chữ nguồn → AC-7 (judgment); bản cài khớp thẻ → AC-8 (khoá KC1).

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội; ngưỡng của từng vòng sống ở hồ sơ của chúng.

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1).
- Làm ba hạt giống mở ở Cổng Bằng chứng của cửa sổ (`2026-11-21-hat-giong-chu-ky-giu-cho-o-lenh-gop`,
  `2026-11-22-hat-giong-tro-ly-quyet-dinh-vung-va-an-le`, `2026-11-22-hat-giong-chuyen-gop-moc-so-sanh`) — vòng riêng.
- Sửa sử cũ: mục CHANGELOG 3.0.0 trở về trước, và câu chuyển chợ ở GUIDE nhắc thẻ `v3.0.0`, giữ nguyên.
- Cài 3.1.0 vào `onehub-inventory` và báo thẻ cho kho tiêu thụ — việc của kho nhận sau mốc.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths`.
- `.claude-plugin/marketplace.json` không mang số kit nào nên không đổi.
- Điều kiện tin cậy (i) của dòng 4–5 GIỮ ở cửa sổ này: `git diff --stat v3.0.0 HEAD -- plugins/feature-loop/workflows/
  plugins/feature-loop/agents/` rỗng.
- Chiều đỏ của bốn lệnh riêng, đo trước lượt chấm: `chay.sh cua-so` chỉ kể `chuyen-gop` thoát 1 nêu ba hồ sơ còn lại;
  `chay.sh dd-giu 90c3f9f1` thoát 1 «plugins/diagram-design có dòng đổi»; `chay.sh goi-doi` trên cây chưa nâng số thoát 1
  «tập tệp đổi khác hai tệp khai»; `chay.sh lop-chep a2198fcf` thoát 1 «ghi chú kể tệp KHÔNG đổi: lib/workspace-record.cjs
  scripts/product-map.mjs».
