---
schema_version: 1
feature: Phát hành kit 3.0.0 — mốc «Chuyển nhà»: kho delivery-loop thành nguồn, sáu plugin ở plugins/<tên>/ với tên mới, kho cũ đóng băng ở 2.39.0; kho chờ nhận onehub-quy-hang
slug: release-3-0-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật của riêng mốc không chạm đường T3 (đo 17/11: --hang-pr với nền là commit gộp ra T2); PR số 1 thì bộ phân hạng trả «không rõ» — xem Notes
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-11-17T14:49:02Z
---

# Acceptance Contract: release-3-0-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `onehub-quy-hang` (Quỹ hàng). Mốc chỉ tính là «được kho nhận» khi có một commit ở
nhánh chính Quỹ hàng kéo kit từ kho `delivery-loop` ở `KIT_TAG: v3.0.0`. crm ở lại kit cũ, không là điều kiện của mốc.

**Quyết của chủ kho:** kho mới + kịch bản chuyển nhà, mang trọn lịch sử; bảng tên đã chốt; gộp luôn bằng commit gộp; kho cũ
đóng băng sau ngày cắt (`migration/KE-HOACH.md` mục 3, 12 · `migration/BOI-CANH.md`). 17/11 «Mở B3»; 17/11 trả lời thẻ
`migration/cat-sang/THE-CONG-PHAM-VI.md`: «Duyệt theo khuyến nghị» — công khai kho ở ngày cắt · Quỹ hàng đổi cả phía phiên ·
cắt khi lượt chấm đạt và ký · mười hai mục B1–B12 theo khuyến nghị.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-3), không chép tay. Sáu hồ sơ được ký sau thẻ `v2.39.0`:
`goi-cheo-loi-dieu-phoi` (#503) · `phan-du-bo-cuc-moi` (#505) · `phan-du-bo-cuc-moi-vong-ba` (#506) ·
`phan-du-bo-cuc-moi-vong-bon` (#507) ở kho cũ; `kich-ban-chuyen-nha` (B1) · `bo-kiem-xanh-o-kho-moi` (B2) ở kho mới. Hai PR
khác gộp vào nhánh chính kho cũ trong cửa sổ không mang hồ sơ: #502 (sửa ca MC-11), #504 (một tệp phát hiện). Cả sáu là vòng
meta — ngoại lệ luật chiều rộng (b) chủ kho đã duyệt cho B1 + B2 và gọi tên từng vòng kho cũ.

**Nền của mốc:** commit `90c3f9f1` = nhánh chính kho cũ `0fe48c14` + 6 commit dọn nhà do kịch bản sinh (`e3a7c105`, mã cây
`53031519`) + phần riêng của nhánh `chuyen-nha` (`migration/`, hồ sơ B1, B2). Sáu commit dọn nhà là vật của B1 và B2, không
chấm lại ở đây; mốc chỉ đòi chúng đúng là thứ kịch bản sinh (AC-4).

**Vật của mốc** (trên nền ấy):

1. Sáu plugin cùng lên `3.0.0` — `diagram-design` rời số riêng 2.7.1 vì chợ, thư mục và tệp khai của nó đổi; mô tả hai
   plugin và câu «Khớp phiên bản» của GUIDE đổi theo.
2. Mục `3.0.0` của `CHANGELOG.md`: đổi gì, ai bị ảnh hưởng, kho tiêu thụ làm gì khi chuyển, năm dòng số, dự báo, điều kiện
   tin cậy — một nguồn, hồ sơ không chép lại.
3. Tài liệu cho kho tiêu thụ còn chỉ đường theo bố cục cũ: GUIDE §5.3 dặn `CLAUDE_PLUGIN_ROOT=$RUNNER_TEMP/kit` (ở bố cục
   mới gốc ấy không có `scripts/`), một lệnh `<kit>/feature-loop/…` ở GUIDE, một liên kết ở QUICKSTART, và mười đường
   `<kit>/…` của đoạn cài thủ công trong README (đo 17/11 bằng `tai-lieu-duong.mjs` của hồ sơ: 12 đường chết trên nền).
4. Ba glob chết của `_acceptance/config.yaml` (`risk_tiers.t3_paths`: thư mục móc và thư viện của lõi; `t1_skip_globs`: ca đo
   skill) — đổi sang `plugins/acceptance-gate/…`. Đo 17/11: PR chỉ chạm `lib/evidence-core.cjs` là T3 ở bố cục cũ, T2 trên nền.
5. Gỡ `.claude/rules/chuyen-nha.md`. `migration/` ở lại nhánh chính làm sử liệu và công cụ; ca RT13 thêm `migration/` vào
   danh sách ngoài phép quét.
6. Đoạn «MỘT cây nguồn» của `CLAUDE.md` đổi tiền tố đường, không đổi luật.
7. Ghim lại hồ sơ B1 và B2 trên cây mới; hồ sơ này; các tệp sổ; vẽ lại bản đồ và trang lộ trình.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (ca vĩnh viễn P200), Then lệnh thoát 0 — sáu tệp khai mang cùng số `3.0.0` hợp semver đọc từ tệp khai, mô tả `acceptance-gate` có mục của đúng số ấy, mô tả `feature-loop` tự khai cặp `acceptance-gate >= 3.0.0`, và câu «Khớp phiên bản» của GUIDE dựng từ số trong tệp khai rồi so.
- AC-2: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows) và `product-map --check`, Then mọi lệnh XANH.
- AC-3: Given tập hồ sơ ĐƯỢC KÝ sau thẻ `v2.39.0` suy từ kho (`_acceptance/release-2-39-0/cua-so.sh 0c4e503b …`), When so với sáu hồ sơ kể trong Context, Then hai tập BẰNG NHAU.
- AC-4: Given nguồn `kit-cu/main` và kịch bản chuyển nhà, When chạy `_acceptance/release-3-0-0/cay-kich-ban.sh`, Then lệnh thoát 0 — năm lệnh `thuoc-that.mjs` thoát 0, và commit dọn nhà kịch bản sinh lại (mã commit và mã cây thước in) là tổ tiên của HEAD: sáu commit dọn nhà dưới nhánh mốc đúng là thứ kịch bản sinh, không sửa tay lọt vào.
- AC-5: Given bộ chặn gộp của kit ở thẻ `v2.39.0` và lõi của cây đã sửa, When chạy `_acceptance/release-3-0-0/vi-phan-hai-kho.sh` (thước `migration/vi-phan/vi-phan.mjs` trên cây hồ sơ ở nhánh mặc định của Quỹ hàng và của crm, có `--base`, kèm `product-map --check`), Then thoát 0 — 0 phán quyết lệch ở cả hai kho; và bộ phá thử `tu-kiem.mjs` đạt ở cả hai kho: tiêm bốn vi phạm thì hai bản kit cùng bắt, tắt một luật ở bản sao lõi mới thì thước đỏ đúng dòng, đổi chú thích thì thước im.
- AC-6: Given cây đã sửa và nền `90c3f9f1`, When chạy `_acceptance/release-3-0-0/hang-loi.sh --hai-chieu 90c3f9f1`, Then thoát 0 — commit thử chỉ chạm `plugins/acceptance-gate/lib/evidence-core.cjs`, rồi `plugins/acceptance-gate/hooks/hooks.json`, ra `hang=T3` ở HEAD và `hang=T2` ở nền (dòng «LỆCH … hang=T2, cần T3»); chạm `plugins/acceptance-gate/evals/README.md` ra `hang=T1` ở HEAD và `hang=T2` ở nền; chạm `plugins/acceptance-gate/scripts/product-map.mjs` ra `hang=T2` ở cả hai; và `migration/vi-phan/duong-chet.mjs` so với `kit-cu/main` ra 0 đường chết trên hơn 0 chuỗi đã quét ở HEAD, đúng ba glob chết ở nền.
- AC-7: Given số trong tệp khai của plugin lõi ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc`, Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.
- AC-8: Given GUIDE §5.3 của cây đã sửa và của nền `90c3f9f1`, When chạy `_acceptance/release-3-0-0/guide-ci.sh --hai-chieu 90c3f9f1` (kit lấy theo thẻ từ một kho trần cục bộ, gốc plugin đặt đúng như dòng GUIDE dặn, kho này làm kho tiêu thụ), Then thoát 0 — theo GUIDE của HEAD kit lấy từ kho `delivery-loop`, bộ chặn gộp in dòng sổ luật `rules ran=` và `product-map --check` chạy được; theo GUIDE của nền thì đỏ với dòng «không có bộ chặn gộp tại $RUNNER_TEMP/kit/scripts/pre-merge-check.sh»; và `tai-lieu-duong.mjs` (liên kết tương đối và đường `<kit>/…` trong README, GUIDE, QUICKSTART, tên kho ở dòng lấy kit) ra 0 đường chết ở HEAD, còn ở nền nêu được liên kết QUICKSTART và đường `<kit>/skills/acceptance` của README.
- AC-9: Given cây đã sửa, When chạy `_acceptance/release-3-0-0/don-dau-vet.sh`, Then thoát 0 — không còn `.claude/rules/chuyen-nha.md`; RT13 đạt trên cây nguyên vẹn; một tệp thử mang chữ trạng thái đã ký đặt dưới `migration/` không làm RT13 đỏ; cùng tệp ấy dời vào `plugins/acceptance-gate/scripts/` làm RT13 đỏ và nêu đúng tên tệp.
- AC-10: Given mục `3.0.0` của `CHANGELOG.md` cùng nguồn nó chép, When đọc từng phần, Then (i) mỗi câu mô tả vòng (dòng «Gốc:», gạch «Vật:», giới hạn trích) là chữ của hợp đồng hay ô cơ hội của hồ sơ ấy, không nói rộng hơn; (ii) đoạn «Ai bị ảnh hưởng» kể đủ: tên chợ mới, ba plugin và mười hai lệnh đổi tên, hai skill đổi tên, gốc plugin lõi `plugins/acceptance-gate` trong lượt kiểm tự động, không có bí danh tên cũ, crm ở lại kit cũ; (iii) không câu nào nói ngưỡng thực tế của mốc đã đạt; (iv) đoạn «Kho tiêu thụ làm gì khi nhận» dặn đúng kho kéo kit, thẻ, gốc plugin lõi và đường feature-loop như GUIDE §5.3 của cùng cây. (judgment)

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-39-0, không quét lại: Trục A · vật của một lần cắt số (tệp khai | dòng khớp phiên bản | mô tả người-dùng-nhận-gì | cửa sổ hồ sơ | bản cài khớp thẻ) `[thước CE: ba mươi bảy mốc trước đã dùng thật]` → AC-1 · AC-2 · AC-3 · AC-7 · AC-10. Trục B · việc riêng của mốc chuyển nhà (cây trên nhánh chính đúng là cây kịch bản sinh | phán quyết trên kho tiêu thụ không đổi | phán quyết trên chính kho kit không đổi | kho tiêu thụ làm theo tài liệu thì chạy được | dọn dấu vết đợt) `[thước CE: bảng G1–G10 và K1–K5 của migration/KHAC-BIET-DU-KIEN.md]` → AC-4 · AC-5 · AC-6 · AC-8 · AC-9 — ô mới của mốc này, mỗi ô một tệp lệnh của hồ sơ có chiều đỏ trên nền `90c3f9f1` hoặc trên bản sao tiêm lỗi. Hai ô của nếp mốc trước để ngoài có lý do: «gói đổi / gói không đổi» và «lớp chép CI khớp ghi chú» — mọi tệp của mọi gói đã dời chỗ ở mốc này nên phép so theo đường dẫn không còn nghĩa (Out of scope).

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội. Ngưỡng thực tế của mốc (ba vế, `migration/KE-HOACH.md` mục 12) là điều kiện ĐÓNG ĐỢT, đo sau ngày cắt bằng `migration/cat-sang/nguong-thuc-te.mjs`; hồ sơ này không chấm nó và không được ghi nó là đã đạt.

## Out of scope

- Thêm trường «phiên bản plugin của phiên làm vòng» vào hồ sơ lượt chấm — là một CỘNG chạm đường chấm; mốc phát hành không dựng răng mới. Vế 1 của ngưỡng thực tế đọc thay bằng khoá bật plugin của Quỹ hàng tại commit gộp.
- 45 dòng sổ ở 32 hồ sơ đã khép trỏ đường phẳng — để nguyên: hồ sơ đã khép, 0 hồ sơ đang mở dính (`_acceptance/phan-du-bo-cuc-moi-vong-bon/gui-b2.md` §3.3).
- Chữ nhắc trần tên plugin cũ và đường bố cục cũ trong văn xuôi tài liệu, ngoài các chỗ kho tiêu thụ làm theo đã sửa ở vật 3 — giới hạn đã khai của B1; nhãn `dieu-phoi` trong câu «Khớp phiên bản» do ca P200 dựng cũng giữ.
- Hai ô «gói chỉ đổi số» và «lớp chép CI khớp ghi chú» của nếp mốc trước: ở mốc này mọi tệp trong danh sách chép đổi đường, kho đang ở đường chép (crm) ở lại kit cũ.
- README song ngữ, tách sử liệu khỏi tệp luật, rà hạt giống, hai tệp máy vẽ, dãy C «Bộ kiểm mạch lạc».
- Chuyển crm; nửa (b) của Repo Standards; cài đặt GitHub của hai kho; chuyển kho sang công khai; lời chỉ đường ở README kho cũ — việc ở Chặng 1–3 của `migration/cat-sang/BANG-BUOC.md`, chủ kho bảo từng bước.
- Cài 3.0.0 vào Quỹ hàng — việc của kho nhận sau thẻ, cổng người.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2 như mốc 2.39. Đo 17/11 bằng `pre-merge-check.sh --hang-pr`: riêng phần mốc khi mới có commit nâng số ra `hang=T2`; PR số 1 (nền = nhánh chính kho cũ) ra `hang=khong-ro`, `ly_do=doi-danh-sach-hang`, `cham_vat=true` — PR đổi chính danh sách hạng nên bộ phân hạng từ chối xếp và lượt kiểm chạy đủ; sau khi mốc sửa ba glob, phần mốc cũng ra «không rõ». Máy không tự chứng được hạng, nên hạng T2 và lối làn V của Cổng Phạm vi là điều chủ kho nhận ở thẻ cổng 17/11 (dòng sổ `gate1` có `decided_by` về hạng và làn).
- Bộ chặn gộp của kit 3.0 chạy kiểu PR trên nền (nền `origin/main`) ra đúng 2 `VIOLATION`, cả hai là bằng chứng hoá cũ của B1 và B2 (mọi tệp đã dời) — hai hồ sơ ấy ghim lại trong vòng này; không luật nào đòi thêm hồ sơ cho 6 commit dọn nhà.
- Điều kiện tin cậy (i) của dòng 4–5 KHÔNG giữ ở cửa sổ này: đường chấm đổi chỗ (`workflows/`, `agents/` của feature-loop dời vào `plugins/feature-loop/`). Hai dòng máy đo chỉ đọc, không so.
- Giới hạn khai trước: AC-5 đọc đầu ra bộ chặn gộp, không chạy lượt chấm S4 và không chạy móc trên kho tiêu thụ; đo trên bản kéo của máy này ở nhánh mặc định lúc chạy.
- Giới hạn khai trước: AC-4, AC-5, AC-6 đọc thứ lượt kiểm tự động không có (remote `kit-cu`, bản kéo hai kho tiêu thụ, lệnh `claude`) — chỉ chạy được ở máy này; thiếu thì lệnh thoát 2 «không đọc được ở đây».
- Giới hạn khai trước: AC-8 đo trên kho trần cục bộ và chính kho này làm kho tiêu thụ; lượt kiểm tự động thật của Quỹ hàng chỉ chạy sau thẻ.
- Giới hạn khai trước: ba glob được sửa ở PR mốc, không ở kịch bản — kịch bản chuyển nhà chạy lại từ một nguồn mới vẫn sinh ba glob chết (mục B3 của thẻ Cổng Phạm vi). Ngưỡng đang đếm: ≥ 1 lần kịch bản chạy lại để dựng cây đi vào nhánh chính sau ngày cắt → sửa luật bước 6 của kịch bản.
  Cùng giới hạn, cùng ngưỡng, cho ba đường lượt ghim lại B1, B2 bắt được ngày 17/11 (gốc mặc định của `kiem-ban-cai.mjs`, hai dòng đọc số trong ca lượt mốc, chuỗi ghim P132): sửa ở PR mốc, kịch bản chạy lại vẫn sinh chúng — luật đổi đường của kịch bản không phủ đường ghép từ gốc kho khi gốc kho cũ CHÍNH là lõi.
- Lượt này phiên chấm chạy plugin `feature-loop` 2.38.1 từ chợ cũ, điều phối bằng tệp workflow của chính cây (`plugins/feature-loop/workflows/`).
