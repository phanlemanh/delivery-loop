---
schema_version: 1
feature: Phát hành kit 3.0.0 — mốc «Chuyển nhà»: kho delivery-loop thành nguồn, sáu plugin ở plugins/<tên>/ với tên mới, kho cũ đóng băng ở 2.39.0; kho chờ nhận onehub-quy-hang
slug: release-3-0-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật của riêng mốc không chạm đường T3 (đo 17/11: --hang-pr với nền là commit gộp ra T2); PR số 1 thì bộ phân hạng trả «không rõ» — xem Notes
surfaces: [cli]
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: release-3-0-0 — BẢN NHÁP

> Nháp soạn ở phiên B3 ngày 17/11/2026, đặt dưới `migration/cat-sang/ho-so-moc-nhap/` vì ngoại lệ «ghi hồ sơ vòng trên
> nhánh của vòng» chưa được duyệt cho B3. Được duyệt thì tệp này dời thành `_acceptance/release-3-0-0/contract.md` trên
> nhánh ứng viên `cat-sang/3.0` (bố cục mới), kèm năm tệp sổ có tiền lệ ở B1 và B2. Mọi số trong mục Context do phiên B3
> tự đo 17/11 trừ chỗ ghi «đọc lại».

## Context

**Kho chờ nhận — đo được trước khi cắt:** `onehub-quy-hang` (Quỹ hàng). Mốc chỉ tính là «được kho nhận» khi có một commit ở
nhánh chính Quỹ hàng kéo kit từ kho `delivery-loop` ở `KIT_TAG: v3.0.0`. crm ở lại kit cũ, không là điều kiện của mốc.

**Quyết của chủ kho (đọc lại từ `migration/KE-HOACH.md` mục 3, 12 và `BOI-CANH.md`):** kho mới + kịch bản chuyển nhà, mang
trọn lịch sử; bảng tên đã chốt; gộp luôn bằng commit gộp; kho cũ đóng băng sau ngày cắt; 17/11 «Mở B3».

**Cửa sổ này có gì** — suy từ kho bằng `_acceptance/release-2-39-0/cua-so.sh 0c4e503b …` chạy trên cây ứng viên: sáu hồ
sơ được ký sau thẻ `v2.39.0` — `goi-cheo-loi-dieu-phoi` (#503) · `phan-du-bo-cuc-moi` (#505) · `phan-du-bo-cuc-moi-vong-ba`
(#506) · `phan-du-bo-cuc-moi-vong-bon` (#507) ở kho cũ; `kich-ban-chuyen-nha` (B1) · `bo-kiem-xanh-o-kho-moi` (B2) ở kho
mới. Hai PR khác gộp vào nhánh chính kho cũ trong cửa sổ không mang hồ sơ: #502 (sửa ca MC-11), #504 (một tệp phát hiện).
Cả sáu là vòng meta — ngoại lệ luật chiều rộng (b) chủ kho đã duyệt cho B1 + B2 và gọi tên từng vòng kho cũ.

**Vật của mốc** (nền = commit gộp `chuyen-nha` lên `don-nha/3.0`; 6 commit dọn nhà là vật của B1 và B2, không chấm lại ở đây):

1. Sáu plugin cùng lên `3.0.0` (`acceptance-gate`, `feature-loop`, `diagram-design`, `dispatch`, `roadmap`, `knowledge`) —
   `diagram-design` rời số riêng 2.7.1 vì chợ, thư mục và tệp khai của nó đổi; câu «Khớp phiên bản» của GUIDE đổi theo.
2. Mục `3.0.0` của `CHANGELOG.md`: đổi gì, ai bị ảnh hưởng, kho tiêu thụ làm gì khi chuyển (chợ mới, bảng tên, gốc lõi
   `plugins/acceptance-gate` trong lượt kiểm tự động), năm dòng số, dự báo, điều kiện tin cậy.
3. Tài liệu cho kho tiêu thụ còn chỉ đường theo bố cục cũ: GUIDE §5.3 dặn `CLAUDE_PLUGIN_ROOT=$RUNNER_TEMP/kit` (ở bố cục
   mới gốc ấy không có `scripts/`), GUIDE dòng 1567 và QUICKSTART dòng 267 trỏ `feature-loop/…` ở gốc.
4. Ba glob chết của `_acceptance/config.yaml` (`risk_tiers.t3_paths`: `hooks/**`, `lib/**`; `t1_skip_globs`: `evals/**`) —
   đổi sang `plugins/acceptance-gate/…`. Đo 17/11: PR chỉ chạm `lib/evidence-core.cjs` là T3 ở bố cục cũ, T2 ở cây kịch
   bản dựng (`migration/vi-phan/README.md`).
5. Gỡ `.claude/rules/chuyen-nha.md`. `migration/` ở lại nhánh chính làm sử liệu và công cụ; ca RT13 thêm `migration/` vào
   danh sách ngoài phép quét (một dòng — ngưỡng ở `BOI-CANH.md` coi như chạm khi `migration/` vào nhánh chính).
6. Đoạn «MỘT cây nguồn» của `CLAUDE.md` liệt đường theo bố cục cũ — đổi tiền tố đường, không đổi luật.
7. Ghim lại hồ sơ B1 và B2 trên cây ứng viên; hồ sơ này; năm tệp sổ; vẽ lại bản đồ và trang lộ trình.

## Criteria

- AC-1: Given cây ứng viên, When chạy vùng 3 của suite plugins (ca vĩnh viễn P200), Then lệnh thoát 0 — sáu tệp khai mang cùng số `3.0.0` hợp semver, đọc từ tệp khai.
- AC-2: Given cây ứng viên, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — câu «Khớp phiên bản» của GUIDE dựng từ số trong tệp khai rồi so.
- AC-3: Given cây ứng viên, When chạy mọi lệnh suite của lượt chấm và `product-map --check`, Then mọi lệnh XANH.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ sau thẻ `v2.39.0` suy từ kho (`cua-so.sh 0c4e503b …`), When so với sáu hồ sơ kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given cây ứng viên và nguồn `kit-cu/main`, When chạy `thuoc-that.mjs` (không cờ, `--phien`, `--bo-kiem`, `--giu-khoa`, `--lop-do`), Then cả năm thoát 0 và mã cây của `don-nha/3.0` dựng lại trùng mã cây nằm dưới commit gộp của nhánh ứng viên — 6 commit dọn nhà trên nhánh chính đúng là thứ kịch bản sinh, không có sửa tay lọt vào.
- AC-6: Given bộ chặn gộp của kit ở thẻ `v2.39.0` và ở cây ứng viên, When chạy `migration/vi-phan/vi-phan.mjs` trên cây hồ sơ của Quỹ hàng và của crm với `--base` là nhánh chính của từng kho, Then thoát 0 — 0 phán quyết lệch; và `tu-kiem.mjs` 5/5 ca đạt trên cùng hai kho (tắt một luật ở bản sao lõi → đỏ đúng dòng; đổi chú thích → im).
- AC-7: Given cây ứng viên, When chạy tệp đo hạng của hồ sơ (`hang-loi.sh`: commit thử chỉ thêm một dòng chú thích vào `plugins/acceptance-gate/lib/evidence-core.cjs`, rồi vào `plugins/acceptance-gate/hooks/hooks.json`, đọc `--hang-pr`), Then cả hai ra `hang=T3`; cùng lệnh trên commit gộp nền (trước khi sửa ba glob) ra `hang=T2` và thoát 1; chạm `plugins/acceptance-gate/scripts/product-map.mjs` ra `hang=T2` ở cả hai. Và `migration/vi-phan/duong-chet.mjs --cu kit-cu/main --moi HEAD` thoát 0.
- AC-8: Given số trong tệp khai ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc`, Then «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.
- AC-9: Given một kho giả lập làm đúng theo GUIDE §5.3 của cây ứng viên (lấy kit theo thẻ từ một kho trần cục bộ, đặt `CLAUDE_PLUGIN_ROOT` như GUIDE dặn), When chạy hai bước của việc `gate`, Then bộ chặn gộp in dòng sổ luật `rules ran=` và thoát theo phán quyết, `product-map --check` chạy được; cùng kho giả lập làm theo GUIDE ở commit gộp nền thì bước một không tìm thấy bộ chặn gộp (thoát khác 0, không dòng sổ luật).
- AC-10: Given mục `3.0.0` của `CHANGELOG.md` cùng nguồn nó chép, When đọc từng phần, Then (i) mỗi câu mô tả vòng là chữ của hợp đồng hay ô cơ hội của hồ sơ ấy, số giới hạn đã khai khớp Notes; (ii) «Ai bị ảnh hưởng» kể đủ: tên chợ, ba plugin và 12 lệnh đổi tên, hai skill đổi tên, gốc lõi trong lượt kiểm tự động, không có bí danh tên cũ, crm ở lại kit cũ; (iii) không câu nào nói ngưỡng thực tế đã đạt. (judgment)
- AC-11: Given cây ứng viên, When tìm `.claude/rules/chuyen-nha.md` và chạy ca RT13, Then tệp không còn và RT13 đạt; một tệp thử dưới `migration/` mang nguyên văn chữ trạng thái đã ký không làm RT13 đỏ, còn cùng tệp ấy đặt ở `scripts/` của một plugin thì RT13 đỏ.

## Coverage

- Trục A · vật của một lần cắt số (tệp khai | dòng khớp phiên bản | mô tả người-dùng-nhận-gì | cửa sổ hồ sơ | bản cài khớp thẻ) → AC-1 · AC-2 · AC-3 · AC-4 · AC-8 · AC-10 — nếp `release-2-39-0`. Trục B · việc riêng của mốc chuyển nhà (cây trên nhánh chính đúng là cây kịch bản sinh | phán quyết trên kho tiêu thụ không đổi | phán quyết trên chính kho kit không đổi | kho tiêu thụ làm theo tài liệu thì chạy được | dọn dấu vết đợt) → AC-5 · AC-6 · AC-7 · AC-9 · AC-11.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội. Ngưỡng thực tế của mốc (ba vế, `KE-HOACH.md` mục 12) là điều kiện ĐÓNG ĐỢT, đo sau ngày cắt bằng `migration/cat-sang/nguong-thuc-te.mjs`; hồ sơ này không chấm nó và không được ghi nó là đã đạt.

## Out of scope

- Thêm trường «phiên bản plugin của phiên làm vòng» vào hồ sơ lượt chấm — là một CỘNG chạm đường chấm; mốc phát hành không dựng răng mới. Vế 1 của ngưỡng thực tế đọc thay bằng khoá bật plugin của Quỹ hàng tại commit gộp (chợ mới chỉ phát hành ≥ 3.0).
- 45 dòng sổ ở 32 hồ sơ đã khép trỏ đường phẳng — để nguyên: hồ sơ đã khép, 0 hồ sơ đang mở dính (đọc lại từ `gui-b2.md` §3.3).
- Chữ nhắc trần tên plugin cũ trong văn xuôi tài liệu (`dieu-phoi` 8 dòng, `road-map` 4, `tri-thuc` 6 ở GUIDE và QUICKSTART của cây kịch bản) ngoài các chỗ kho tiêu thụ làm theo — giới hạn đã khai của B1.
- README song ngữ, tách sử liệu khỏi tệp luật, rà hạt giống, hai tệp máy vẽ, dãy C «Bộ kiểm mạch lạc».
- Chuyển crm; nửa (b) của Repo Standards; cài đặt GitHub của hai kho; chuyển kho sang công khai — việc ở Chặng 1–3 của `BANG-BUOC.md`, chủ kho bảo từng bước.
- Cài 3.0.0 vào Quỹ hàng — việc của kho nhận sau thẻ, cổng người.

## Notes

- Hạng T2 như mốc 2.39. Đo 17/11 bằng `pre-merge-check.sh --hang-pr` trên cây diễn tập: riêng phần mốc (nền = commit gộp, mới có commit nâng số) ra `hang=T2`; PR số 1 (nền = nhánh chính kho cũ) ra `hang=khong-ro`, `ly_do=doi-danh-sach-hang`, `cham_vat=true` — PR đổi chính danh sách hạng nên bộ phân hạng từ chối xếp và lượt kiểm chạy đủ. Khi mốc sửa ba glob thì phần mốc cũng ra «không rõ». Vì máy không tự chứng được hạng, hạng T2 và lối đi của Cổng Phạm vi là điều chủ kho nhận ở thẻ cổng, không phải máy tự suy.
- Bộ chặn gộp của kit 3.0 chạy kiểu PR trên cây diễn tập (nền `origin/main`) ra đúng 2 `VIOLATION`, cả hai là bằng chứng hoá cũ của B1 và B2; không luật nào đòi thêm hồ sơ cho 6 commit dọn nhà — PR mang sẵn hồ sơ B1 (T3, đã ký) và B2.
- Điều kiện tin cậy (i) của dòng 4–5 KHÔNG giữ ở cửa sổ này: đường chấm đổi chỗ (`feature-loop/workflows/`, `feature-loop/agents/` dời vào `plugins/feature-loop/`). Hai dòng máy đo chỉ đọc, không so.
- Giới hạn khai trước: AC-6 đọc đầu ra bộ chặn gộp, không chạy lượt chấm S4 và không chạy móc trên kho tiêu thụ.
- Giới hạn khai trước: AC-9 đo trên kho giả lập và kho trần cục bộ; lượt kiểm tự động thật của Quỹ hàng chỉ chạy sau thẻ.
