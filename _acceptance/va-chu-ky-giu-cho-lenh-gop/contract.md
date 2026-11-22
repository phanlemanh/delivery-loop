---
schema_version: 1
feature: Lệnh gộp theo lời của gói điều phối đọc chữ ký bằng vị từ của lõi — chữ ký giữ chỗ («pending», «TBD»…) không còn qua vế chữ ký; gốc lõi đến từ bộ định vị sẵn có của kit
slug: va-chu-ky-giu-cho-lenh-gop
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: plugins/dispatch/scripts/gop.mjs + dieu-phoi.mjs, khối dòng lệnh ở feature-loop SKILL và commands/signoff.md, ca kiểm của gói điều phối — KHÔNG khớp t3_paths
surfaces: [cli]
status: implemented
approved_by: Phan Le Manh
approved_at: 2026-11-22
---

# Acceptance Contract: va-chu-ky-giu-cho-lenh-gop

## Context

Gốc: `docs/plans/2026-11-21-hat-giong-chu-ky-giu-cho-o-lenh-gop.md` — Ngoài-2 và Ngoài-4 của Cổng Bằng chứng hồ sơ
`loi-gop-trong-cau-ky` (21/11/2026), chủ kho chọn «mở hợp đồng mới». Chủ kho duyệt 21/11 cho bản vá này đi trong đợt.

**Đề bài đã đổi (21/11, chủ kho ở phiên giữ đợt, nguyên văn «Đổi theo đề xuất»):** vòng thu về ĐÚNG bản vá; không cắt mốc
riêng. Một mốc duy nhất quanh 02/12 mang cả DL1, P179, bản vá này và «lời gộp trong câu ký»; tên hồ sơ `release-3-1-0` để
dành cho vòng mốc ấy. Hồ sơ này từng mang tên `release-3-1-0` khi còn nháp (chưa commit).

**Lỗ hiện tại:** một trong sáu vế lệnh gộp theo lời (`dieu-phoi.mjs gop <PR> --theo-loi`) đòi trước khi gộp là «báo cáo bằng
chứng có chữ ký». Vế ấy đọc bằng hàm riêng `dongChuKy` của `plugins/dispatch/scripts/gop.mjs`, chỉ hỏi dòng `human_signoff`
có chữ hay không. Bộ đọc chữ ký của lõi (`chuKyThat` trong `plugins/acceptance-gate/lib/evidence-core.cjs`, và lưới
trước-gộp) loại thêm các giá trị giữ chỗ trong bảng `CHU_KY_GIU_CHO`. Báo cáo điền tạm `human_signoff: pending` vẫn qua vế
chữ ký của lệnh gộp; gộp vào nhánh chính là việc khó đảo.

**Vật:**

1. `dongChuKy` hỏi `chuKyThat` của lõi; giá trị giữ chỗ → vế chữ ký không đạt, thông điệp nêu giá trị.
2. **Đường tới lõi theo ADR 0003** (định vị plugin khác bằng `resolve-plugin.mjs`): lệnh nhận cờ `--loi <gốc
   acceptance-gate>`. Khối dòng lệnh `GOP-THEO-LOI-KY` ở SKILL S5 của feature-loop và ở lệnh ký giải gốc ấy bằng
   `resolve-plugin.mjs --plugin acceptance-gate --require lib/evidence-core.cjs`, cạnh lời giải gói điều phối đã có. Thiếu
   cờ thì chỉ thử bố cục nguồn `plugins/acceptance-gate/` cạnh gói (kho tự host kit). Gói điều phối không tự dò bộ đệm
   cài, không sắp số bản, không chép bảng giữ chỗ. Gốc truyền vào vẫn được kiểm; không có bộ đọc dùng được → lối gộp theo
   lời chặn, không rơi về phép cũ.
3. Ca kiểm của gói điều phối: hàng giữ chỗ trong ma trận GL-6b, ca mới GL-6i/GL-6j/GL-6k; ca kỳ vọng GỘP chỉ đăng ký khi cây
   có lõi; GL-8a chuẩn hoá mọi chỗ trỏ bộ giải.
4. Hạt giống chữ ký giữ chỗ ghi dòng «đã làm» trỏ hồ sơ này; hồ sơ; sổ; vẽ lại bản đồ và trang lộ trình.

Thuật ngữ:
- **hàng giữ chỗ** = hàng mới của ma trận GL-6b: kho thử đủ năm vế kia, báo cáo bằng chứng mang `human_signoff: pending`.
- **phép cũ** = thân `dongChuKy` ở `50840764`: trả dòng chữ ký khi giá trị có chữ, không hỏi bảng giữ chỗ.

## Criteria

- AC-1: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows, kiểm bản cài lượt mốc) và `product-map --check`, Then mọi lệnh XANH — kể cả ca P33 (gói điều phối không mang bộ định vị thứ hai) ở suite plugins.
- AC-2: Given hàng giữ chỗ trên đầu nhánh một PR của kho thử, When chạy `dieu-phoi.mjs gop <PR> --theo-loi --slug <s>`, Then 0 lời gọi `gh pr merge`, mã thoát 1, thông điệp gọi tên vế chữ ký và giá trị giữ chỗ — với MỌI mẫu của bảng giữ chỗ của lõi (rút từ `CHU_KY_GIU_CHO` của `evidence-core.cjs`, không chép tay); cùng kho thử với chữ ký thật thì đúng một lời gọi gộp (GL-6a); bản sao cây trả `dongChuKy` về phép cũ thì hàng giữ chỗ ĐỎ và nêu tên hàng; bản sao cây thêm một mẫu mới vào bảng của lõi thì ca vẫn xanh, còn bản sao mà `gop.mjs` mang bảng riêng chép từ bảng cũ thì ca ĐỎ nêu mẫu mới.
- AC-3: Given kho thử đủ sáu vế và bản sao gói điều phối, When chạy lối gộp theo lời với `--loi` trỏ gốc lõi thật · `--loi` trỏ thư mục không có `lib/evidence-core.cjs` · `--loi` trỏ lõi không xuất `chuKyThat` · không cờ, gói đặt cạnh lõi ở bố cục nguồn · không cờ, gói điều phối một mình, Then gốc lõi thật và bố cục nguồn gộp đúng một lần; ba ca còn lại CHẶN, 0 lời gọi merge, mã 1, thông điệp «không tìm thấy bộ đọc chữ ký của lõi» kèm đường đã thử và lệnh giải bằng `resolve-plugin.mjs`; và khối `GOP-THEO-LOI-KY` ở SKILL S5 và lệnh ký giống nhau sau khi chuẩn hoá MỌI chỗ trỏ bộ giải, mang `--loi "$AG"` với `AG` giải bằng `resolve-plugin.mjs --plugin acceptance-gate --require lib/evidence-core.cjs`.
- AC-4: Given cây đã sửa, When chạy toàn bộ ca của gói điều phối (`tests/dieu-phoi/**/*.test.mjs`), Then thoát 0 — kể cả ca DP1-03 chạy bước CI của gói trên bản sao CHỈ có gói điều phối (số ca đạt ≥ 84, 0 hỏng, 0 bỏ qua; ở bản sao ấy GL-6j chạy, ca kỳ vọng gộp in dòng «không đăng ký»).

## Coverage

- Trục duy nhất · bản vá (vị từ chữ ký đọc bảng của lõi | đường tới lõi theo bộ định vị của kit | gói điều phối đứng riêng | không vỡ gì khác) `[thước CE: hạt giống chữ ký giữ chỗ + ADR 0003/ca P33 + ca DP1-03 của hồ sơ dieu-phoi-dong-goi-loi]` → AC-2 · AC-3 · AC-4 · AC-1.

## Out of scope

- Đổi số bản, mục phát hành trong `CHANGELOG.md`, ghi chú phát hành, năm dòng số, thẻ và bản phát hành GitHub — thuộc vòng mốc quanh 02/12 (hồ sơ `release-3-1-0` sẽ mở khi đó). Theo nếp của kho, vòng chưa phát hành không ghi `CHANGELOG.md` (PR #15 cũng không); vòng mốc gom.
- Gói DL1, bản vá P179 và mọi hạt giống khác — phiên khác mở trong cây làm việc riêng.
- Cài lên bất kỳ kho tiêu thụ nào; nhánh `chuyen-nha` và thư mục `migration/`.
- Lõi và lưới trước-gộp không đổi; ba Known limits của PR #15 không sửa.
- Bịt chỗ mù của ca P33 (chỉ bắt chuỗi `plugins/cache`) — ghi hạt giống `docs/plans/2026-11-21-hat-giong-p33-mu-do-bo-dem-duong-tuong-doi.md`, không làm.
- Sáu mục Ngoài-6, 7, 8, 12, 13, 14 của hồ sơ `tep-chung-khong-chan-gop` (chế độ `ban_do.ngoai_git`) — giữ cả sáu là hạt giống `docs/plans/2026-11-22-hat-giong-ngoai-git-san-sang.md` (Cổng Phạm vi 22/11 chọn lối A).

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR khớp `t3_paths`; đo bằng `pre-merge-check.sh --hang-pr` trước lượt chấm.
- Đã đối chiếu ADR 0003 và ca P33 (sau góp ý của phiên giữ đợt 21/11): thiết kế nháp từng cho gói điều phối tự dò bộ đệm
  cài và tự chọn bản mới nhất — một bộ định vị thứ hai; nay đổi sang cờ `--loi` do dòng lệnh giải bằng `resolve-plugin.mjs`.
- Giới hạn khai trước: ai gọi `dieu-phoi.mjs gop … --theo-loi` bằng tay ở bố cục cài (ngoài kho tự host kit) mà không có
  `--loi` thì bị chặn kèm lệnh giải. Ngưỡng đang đếm: ≥ 1 lần người phải bấm gộp tay vì dòng chặn ấy khi vòng đã chạy đúng
  dòng lệnh của SKILL.
- Lệnh riêng của hồ sơ gọi thẳng `_acceptance/va-chu-ky-giu-cho-lenh-gop/chu-ky-giu-cho.sh` (khối `LENH-HO-SO` của SKILL, có
  từ DL1); vòng không thêm khoá vào `_acceptance/config.yaml`.
- **Cân trên mọi kho.** Kho tiêu thụ được: lệnh gộp theo lời thôi gộp một báo cáo mang chữ ký giữ chỗ (`pending`, `TBD`…)
  vào nhánh chính — bảng giữ chỗ một nguồn với lõi và lưới trước-gộp. Mất: ai gọi lệnh ấy bằng tay ở bố cục cài mà không
  có `--loi` thì bị chặn kèm lệnh giải (giới hạn ở trên). Kho không cài gói điều phối, hoặc không bật
  `feature_loop.gop_theo_loi_ky`: không chạy lệnh gộp theo lời nên không đổi hành vi; khối `GOP-THEO-LOI-KY` chỉ đổi đuôi
  lệnh. Kho cài gói điều phối mà không có lõi bên cạnh (bản sao của ca DP1-03): lối theo lời chặn, các lối khác như cũ.
- PR đang mở chạm cùng tệp (đo 22/11 trước Cổng Phạm vi): #20 sửa `gop.mjs` (hàm `xetGop`) và `dieu-phoi.mjs`, #19 sửa
  `SKILL.md` của feature-loop (hai khúc ở S1, S3) — khác khúc với vật của vòng; ai gộp sau thì gộp nhánh chính vào nhánh
  của mình, không chạy đua.
- Kho này đã bật `feature_loop.gop_theo_loi_ky: true` nên thẻ Cổng Bằng chứng của vòng in sẵn `gộp: khi CI xanh`; lệnh gộp
  chạy CHÍNH bản đã vá (kho tự host kit, `DP=plugins/dispatch`).
