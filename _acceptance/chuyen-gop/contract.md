---
schema_version: 1
feature: Chuyến gộp kiểm một lần trên ngọn, chuyến đỏ tách đôi, và cửa proof cho hồ sơ mặc-ký
slug: chuyen-gop
owner: phanlemanh@gmail.com
risk_tier: T2               # plugins/dispatch/scripts/ (chuyen-gop.mjs, cua-proof.mjs mới; gop.mjs, hinh-dang.mjs, dieu-phoi.mjs) — không chạm hooks/, lib/
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-11-22-chuyen-gop-design.md
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: chuyen-gop

## Context

Gốc: _acceptance/mac-ky-co-phu-quyet/ (hàng 1 của thí điểm «trợ lý quyết định»; dòng sổ hoãn «hồ sơ mang món mặc-ký chưa bị
chặn tự gộp khi kho chưa khai proof check — để sang hàng 2»). Đặc tả chủ kho duyệt 22/11/2026
(`docs/findings/2026-11-22-tro-ly-quyet-dinh.md`): mặc-ký một mình dời nút nghẽn sang hàng đợi gộp — đo ở crm 19–23/10, 39
PR mở→gộp trung vị 8,3 giờ và 254 lần gộp nhánh chính vào nhánh làm việc trong bốn ngày. Hàng này gom PR đã đạt bằng chứng
thành chuyến, kiểm một lần trên ngọn thay vì từng PR sau mỗi lần nhánh chính đổi, chuyến đỏ tách đôi để quy đúng PR lỗi; và
nối luật tự trị qua cửa proof: mặc-ký chỉ tự gộp ở kho đã khai proof check.

Thuật ngữ:
- **tệp ca** = `tests/dieu-phoi/chuyen-gop.test.mjs` (tên ca = mã tiêu chí).
- **kho thử** = origin trần + bản clone do tệp ca dựng, mỗi PR một nhánh; chỉ `gh` là giả.
- **món mặc-ký** = dòng sổ `"may":"mac-ky","di_theo":"khuyen"` (lược đồ sổ 2 của hàng 1) mà dòng S1 nó trỏ chưa bị dòng
  người nào quyết lại.

## Criteria

- AC-1: Given bốn ứng viên đạt bằng chứng lúc 10:00, 10:20, 10:59, 11:01 và cửa sổ 60 phút, When `gom` lúc 10:30 rồi 11:00,
  Then lúc 10:30 chưa khởi hành, giờ khởi hành 11:00, thành viên `[1, 3, 2]` theo thứ tự đạt, PR đạt 11:01 chờ chuyến sau;
  lúc 11:00 khởi hành cùng thành viên; danh sách rỗng không khởi hành.
- AC-2: Given ba PR xanh trên kho thử, When `chayChuyen` sau giờ khởi hành, Then gộp cả ba theo thứ tự đạt bằng chứng, mỗi
  lệnh gộp mang `--merge --match-head-commit <đúng đầu nhánh>`, lệnh kiểm chạy đúng một lần; `--xet` trả `gop-duoc` và không
  gộp; trước giờ khởi hành trả `cho` kèm giờ, không kiểm không gộp, `--ngay` khởi hành luôn.
- AC-3: Given sáu PR, PR #4 thêm tệp làm lệnh kiểm đỏ, When `chayChuyen`, Then #4 rớt với thông điệp «làm chuyến đỏ — lệnh kiểm
  trên ngọn thoát khác 0 khi có PR này», năm PR còn lại được gộp, số lần kiểm ≤ 6; với hai PR lỗi trong tám, hai PR đúng
  rớt, số lần kiểm ≤ 10 (tách tuyến tính tốn 14); hỏng do tổ hợp thì PR đứng sau rớt.
- AC-4: Given hai PR sửa cùng một dòng của một tệp và một PR thứ ba, When `chayChuyen`, Then PR đứng sau rớt với thông điệp
  «xung đột khi gộp vào chuyến (sau #1) — …», hai PR kia được gộp.
- AC-5: Given hồ sơ mang món mặc-ký, When xét cửa bằng chứng máy (thuần và qua `xetGop` / `chayChuyen` trên kho thử), Then chỉ qua
  khi `governance/autonomy.yaml` ở nhánh chính khai `proof.check`, check ấy xanh trên đầu nhánh và PR ở tầng `low`; mỗi vế
  thiếu chặn với thông điệp riêng mở đầu «mặc-ký dừng trước cửa gộp:»; luật tự trị PR tự sửa trên nhánh của nó không mở
  được cửa; món đã bị người quyết lại không tính; đối chứng: PR không mặc-ký gộp như cũ (`moi-nhat`). Dòng mặc-ký và
  dòng phủ quyết của ca do bên ghi của hàng 1 (`tro-ly-quyet-dinh.cjs --write`, `--ghi phu-quyet`) sinh trong lượt; luật tự
  trị của ca là bản chép khuôn Repo Standards (`tests/dieu-phoi/fixtures/autonomy-repo-standards.yaml`): tệp tầng `high`
  chặn kể cả khi `default: low`, và khối `rules` nâng tầng — PR xoá tệp lên `medium`, PR chạm `ontology/` lên `high`.
- AC-8: Given chuyến đã kiểm xanh, When (a) nhánh chính tiến giữa lúc kiểm và lúc gộp, (b) lệnh gộp PR thứ hai bị từ
  chối, (c) lệnh kiểm đỏ ngay trên nhánh chính, Then (a) trả `nhanh-chinh-doi`, «nhánh chính đổi giữa lúc kiểm và lúc gộp (…
  → …) — không gộp PR nào; chạy lại chuyến», không lời gọi gộp nào (đối chứng: không chen ngang thì gộp đủ); (b) trả
  `gop-do-dang`, đã gộp đúng PR đầu, không lời gọi gộp PR thứ ba; (c) trả `chan`, «nhánh chính đỏ với lệnh kiểm của chuyến —
  chuyến dừng, không PR nào bị quy lỗi», không PR nào rớt; và mười đột biến của `rang/dot-bien.mjs` mỗi cái làm đỏ đúng ca
  đã ghim, bản nguyên vẹn xanh.
- AC-6: Given cấu hình đợt, When kiểm khuôn, Then vắng `chuyen_gop` hợp lệ như cũ; `bat` không phải boolean, `cua_so_phut`
  không dương, `lenh_kiem` vắng khi `bat: true`, khoá lạ — mỗi lỗi một thông điệp có tên; `chayChuyen` khi tắt ném «chuyến
  gộp tắt (chuyen_gop.bat trong dieu-phoi.config.json) — gộp từng PR bằng `gop <số PR>`».
- AC-7: Given ba PR, một PR CI còn chạy, When `chayChuyen`, Then PR ấy đứng ngoài chuyến với thông điệp «check chưa xanh — gate:
  IN_PROGRESS», hai PR kia được gộp.

## Coverage

Bỏ quét không gian: quyết định `bỏ coverage-scan` trong `decisions.jsonl`. Trục: pha của chuyến (gom · dựng · kiểm · tách
đôi · gộp) × kết cục của mỗi PR (vào · rớt vì đỏ · rớt vì xung đột · ngoài vì chưa đủ điều kiện · ngoài vì cửa proof). Mỗi
hàng có AC: gom (AC-1) · kiểm xanh và gộp (AC-2) · rớt vì đỏ, gồm nhánh chính đỏ (AC-3, AC-8) · rớt vì xung đột (AC-4) ·
ngoài vì cửa proof (AC-5) · ngoài vì chưa đủ điều kiện (AC-7) · pha gộp khi đỉnh đổi hay một lần gộp hỏng (AC-8) · cấu hình
(AC-6). Ô còn trống có chủ đích: PR rớt ở pha gộp vì lý do của GitHub ngoài hai lý do trên — lệnh dừng như (b).

## Out of scope

- Gác đồng nhất liên dãy trước chuyến (hai món mặc-ký ở hai dãy mâu thuẫn) — việc của giám sát, ghi ở sổ.
- Khối «Trong đợt» của SKILL feature-loop trỏ lệnh `chuyen` — LUẬT đợt của thí điểm chỉ dẫn thợ.
- Sửa `governance/autonomy.yaml` hay bật `chuyen_gop` ở kho tiêu thụ nào, sửa gì trong onehub-inventory.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Giới hạn đã khai: chuyến gộp từng PR bằng `gh pr merge` tuần tự. Kho bật luật nhánh «phải cập nhật với nhánh chính trước
  khi gộp» thì GitHub từ chối PR thứ hai ngay sau khi PR đầu gộp — chuyến dừng ở `gop-do-dang` sau đúng một PR (an toàn,
  không gộp tổ hợp chưa kiểm, nhưng mất lợi ích của chuyến). Kho như thế dùng `gop` từng PR, hoặc tắt luật ấy khi bật
  `chuyen_gop`. Ngưỡng mở lại: ≥1 kho tiêu thụ bật `chuyen_gop` mà bật luật ấy.
- Hồ sơ xếp chồng lên nhánh của hàng 1; PR của hàng này nhắm nhánh hàng 1 tới khi hàng 1 gộp.
