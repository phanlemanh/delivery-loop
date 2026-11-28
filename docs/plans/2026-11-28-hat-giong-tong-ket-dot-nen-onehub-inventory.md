# Hạt giống — tổng kết đợt `nen` của onehub-inventory (26–28/11/2026): chín lỗi kit, tám chỗ thiếu, đo theo North Star

Gốc: onehub-inventory/_acceptance/nhap-excel/ (hàng 11, PR #130) và onehub-inventory/_acceptance/khung-luoi-va-ngan-chi-tiet/
(VP10 lát 1, PR #131) — hai hàng được đo từng chặng ngày 28/11. Sổ đợt: `onehub-inventory/.acceptance-runs/dieu-phoi-nen/LUAT.md`
(phán quyết G-2811-1 … G-2811-59) và `su-kien.jsonl`; trang đo `kit-theo-north-star-2026-11-28.html`,
`do-thoi-gian-11-vp10-2026-11-28.html` cùng thư mục. Bản tổng kết gốc của giám sát:
`onehub-inventory/.acceptance-runs/dieu-phoi-nen/tong-ket-cho-kit-2026-11-28.md` — tệp này phủ tới **mục 8 (bổ sung 28/11
12:15)**; mục 9–12 (bổ sung tới 28/11 18:20) và trang đo hàng 11 ghi thành issue #43–#55, không chép lại vào đây; mục 11
(design-assembly) không thuộc kit này, không ghi.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

**Trạng thái:** hạt giống (SỔ, chưa là ô). Ghi 28/11/2026 theo lời chủ kho ở phiên đo cùng ngày: «Gửi bản tổng kết thông tin
cho kit». Tệp này **chỉ ghi nhận** — không sửa mã kit, không mở vòng nào: luật chiều rộng (b) giữ việc-kit đóng băng tới khi
chủ kho gọi tên.
**Bộ kit trong đợt:** plugin 3.1.1, lõi đợt 3.1.0 (`loi/PHIEN-BAN.json`), làn ghim chạy thẳng từ checkout đang phát triển — ba
bản cùng lúc.
**Kiểm lại trên kit:** từng lỗi C1–C9 đọc lại trên `main` `36d29fed` (28/11/2026). Số dòng dưới đây là số dòng ở commit ấy.

## 1. Số đo theo North Star

| Thước | Đo được | Ghi chú |
|---|---|---|
| Làm xong → ký | không đo được | kit chưa có thước này |
| Ký → gộp | trung vị 22 phút, chỉ trên 11/54 lần gộp | 43 lần thiếu mốc ký — xem mục 4, dòng B1 |
| Giờ máy sau lượt chấm đạt, hàng 11 và VP10 | 11 làn ghim, 3 giờ 56 phút | 2 giờ 41 phút đỏ hoặc bị ngắt; tới sáng 28/11 không làn nào còn dùng được |
| Câu hỏi tới chủ kho qua giám sát | 104 câu / 54 lần gộp | chưa tính câu ở phiên dãy; kit chưa đếm lượt gọi người |

Thời gian theo việc đang chặn hàng (phút không chồng nhau):

- **Hàng 11**, từ 27/11 01:36Z: 23 giờ 14 — làm 8h55 · chấm 2h18 · làm lại 3h25 · chờ khoá 2h48 · chờ GitHub 1h20 · phiên im
  3h48 · chờ chủ kho 12′. Trước đó (26/11): chờ hàng 3g 15h03, chờ chủ kho 2h07. CI: 0 xanh / 16 lần.
- **VP10 lát 1**, từ 27/11 04:52Z: 19 giờ 56 — làm 2h36 · chấm 49′ · ghim xanh 43′ · làm lại 7h42 · chờ mở phiên 2h43 · chờ
  GitHub 1h31 · phiên im 2h19 · chờ chủ kho 39′. CI: 1 xanh / 18 lần.

Đọc số: phần đắt nhất không phải chấm mà là **làm lại sau khi đã chấm đạt**. Lỗi thật của sản phẩm chỉ lộ SAU lượt chấm đạt —
ở lần chạy đầu trên GitHub (Linux) hoặc do một dãy khác dựng chồng lên:

- VP10 qua 8 lượt chấm trong một ngày. Phép đo viền xanh trên Mac, đỏ trên Linux; nút đầu mục 28 px thay vì 44 px trong khi
  bài đo xanh rỗng (bộ chọn không khớp phần tử nào) qua bốn lượt chấm — dãy khác tìm ra.
- Hàng 11 qua 6 lượt ĐẠT. 8/24 phép hứa ca chưa tồn tại mà lượt chấm 1 báo 24/24; hai lỗi phân quyền (cửa mới nằm ngoài ma
  trận vai × cửa); đường đọc Bảng hàng chậm 18 lần (42 ms → 777 ms) — cả ba lộ trên GitHub sau lượt chấm 4, vì PR nháp bỏ qua
  bộ nặng. Thêm ba lỗi cùng dáng «màn xem trước nhận, bước ghi bỏ»: hai do lượt chấm của hàng dựng chồng (VP11) tìm ra, một
  do vòng 7 chạy lại đủ tham số (C9). Bài so của chính hàng luôn bỏ qua đúng chỗ có lỗi.

## 2. Chín lỗi kit — trạng thái trên `main` `36d29fed`

Cả chín **còn nguyên** ở mã kit hôm nay; không lỗi nào đã sửa, không lỗi nào thiếu chỗ tái hiện trong mã.

| # | Lỗi | Đã gây ra ở Inventory | Chỗ trong mã (đã đọc lại) | Trạng thái | Đã có ở sổ |
|---|---|---|---|---|---|
| C1 | Bộ sinh tệp args của lượt chấm không đọc trường `ref` của `evals.yaml` — danh sách trường gửi cho bộ đọc không có `ref`; `ref` chỉ được đặt khi `cmd` bắt đầu bằng `config:`. Bước tổng hợp vì thế tự đặt một nguồn không có thật (`config:executors.ui-check.driver`, `.browser`), phép chạy qua `rang/chay.sh` bị gán nguồn `tests/e2e/*.spec.ts` | VP10 vòng 6–8: `recheck-evidence` báo L2 SUBSTANCE, phải chấm lại riêng một phép và chạy lại bước tổng hợp | `plugins/feature-loop/scripts/s4-args.mjs:137` (danh sách trường), `:211–215` (nhánh `config:` duy nhất) | còn | mới |
| C2 | Bước tổng hợp chép sai khối mang sang và ghi ô phán quyết «PASS (mang từ vòng N)»; thẻ chỉ đếm đúng chữ «PASS» nên in «0/21 phép kiểm máy đạt» dù phán quyết PASS | VP10 vòng 7: thẻ tự mâu thuẫn; 20 khối dựng lại bằng script từ báo cáo các vòng nguồn | `plugins/feature-loop/workflows/acceptance-verify.js:2125–2140` (khối mang sang giao cho tác tử viết); `plugins/acceptance-gate/scripts/gate-card.js:1094` (ô phán quyết lấy nguyên chữ), `:1162` (`=== 'PASS'`) | còn | mới |
| C3 | PASS khi còn mục trong hợp đồng mức vừa — chỉ mức nặng kéo REJECT; thẻ không in các mục ấy | Hàng 11 vòng 3 | `acceptance-verify.js:1888–1889` (`triageHighInContract` chỉ lọc `high`) | còn | **trùng** [KY3](2026-10-20-hat-giong-the-pass-giau-muc-trong-hop-dong.md) — thêm một ca đo, không ghi lại |
| C4 | Nhả khoá máy không ghi sự kiện vào sổ đợt — chỉ ghi mã thoát vào tệp lượt, không giờ | 337 lần cấp, 0 lần nhả trong `su-kien.jsonl`: không đo được giờ giữ khoá thật | `plugins/dispatch/scripts/ghi.mjs:101–114` (`nhaKhoa`), `do-lan.mjs:102–107` (`ghiKetQuaNha`); đối chiếu `phat-lich.mjs:179` ghi sự kiện `cap` | còn | mới |
| C5 | Móc chặn S4 chặn cả lần chạy tiếp chỉ còn bước tổng hợp (không chạy máy nặng) — móc nhận mọi lượt chạy của workflow chấm là việc nặng, không xét lần chạy tiếp | VP10 phải xếp lại lượt, giám sát đổi lượt tay | `plugins/dispatch/scripts/hook-chan-s4.mjs:47–56` (`laS4Workflow`), `:83–90` (`quyet`) — không chỗ nào đọc `resumeFromRunId` | còn | cùng móc, khác lỗi: mục 9 của [mười lỗi onehub-invest](2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md) (heredoc chặn nhầm) |
| C6 | Phép hứa tệp hay ca chưa có vẫn được chấm xanh. Bộ sinh args chỉ kiểm tệp có thật cho `inputs` của judgment; `paths` và tên ca trong `cmd` của phép test/script không được kiểm | Hàng 11 vòng 1: 24/24 xanh, 8 phép thiếu ca | `s4-args.mjs:186–198` (chỉ `resolveJudgmentInput`); `paths` đọc ở `:164` mà không kiểm tồn tại | còn | cùng lớp «hứa mà không kiểm tệp»: [thẻ tin chuỗi ảnh](2026-10-22-hat-giong-the-tin-chuoi-anh-khong-kiem-tep.md) |
| C7 | Không cảnh báo phép đo «từ điểm rẽ nhánh tới đầu nhánh»: vô nghĩa sau khi hồ sơ gộp, hỏng hẳn khi PR gộp squash. Luật có trong tài liệu, chưa có máy giữ | Ba lần trong hai ngày: hồ sơ 2e, E16 của VP10, E4 của hồ sơ PR #133 (làn ghim 45 phút đỏ, không ghi dấu nào) | `plugins/acceptance-gate/skills/acceptance/references/eval-executors.md:275` (luật chữ); `s4-args.mjs` không kiểm `cmd` | còn | cùng lớp neo trôi: [ca nguyên vẹn neo merge-base](2026-10-11-hat-giong-ca-nguyen-ven-neo-merge-base.md) — tệp ấy về ca lời thề của PR, C7 về phép đo của hồ sơ đã ký |
| C8 | PR đổi tệp mà phép của hồ sơ đã ký trỏ tới (`cmd`, `ref`, `paths`) mà cổng trước-gộp không xét lại hồ sơ ấy. Hai vị từ chỉ nhìn tệp dưới `_acceptance/<slug>/`; hồ sơ không tệp nào trong diff bị bỏ hẳn; câu NOTE «tệp eval trỏ tới thì xét lại» nói điều mã không làm | PR #137 đổi ba tệp `tests/e2e*` có trong `paths` của ba hồ sơ đã ký, thêm một dòng `decisions.jsonl` mỗi hồ sơ; cổng in NOTE rồi OK. Kho giữ bằng luật tay G-2811-58 | `plugins/acceptance-gate/scripts/pre-merge-check.sh:767–779` (`slug_in_diff`), `:785–799` (`slug_vat_in_diff`), `:1540–1546` (câu NOTE); `plugins/acceptance-gate/lib/evidence-core.cjs:572` (`phanTepHoSo` bỏ tệp ngoài hồ sơ) | còn | mới |
| C9 | Lượt chấm chạy thiếu đường dẫn quy trình soát của kho (`reviewSkillPath`) vẫn ghi PASS — tham số khai «tuỳ chọn», thiếu thì soát theo quy ước chung, không dừng, không in | Hàng 11 vòng 7: bản đầu PASS; chạy lại đủ tham số thì tác tử tìm lỗi bắt một lỗi mất dữ liệu trong hợp đồng | `acceptance-verify.js:43`, `:1167–1168` | còn | mới |

Bản 11:00 của C8 quy lỗi cho `stale_scope: paths` — sai, Inventory đã sửa (G-2811-58, G-2811-59). `stale_scope` không liên
quan; lỗi nằm ở hai vị từ phạm vi hồ sơ.

## 3. Chỗ kit còn thiếu — đối chiếu sổ

| # | Thiếu | Đã có ở sổ |
|---|---|---|
| B1 | Thước làm xong → ký; thước ký → gộp thiếu 43/54 mốc | [đo gộp mù khi có commit sau ký](2026-10-25-hat-giong-do-gop-mu-khi-co-commit-sau-ky.md) · [đo gộp cha thứ hai](2026-11-23-hat-giong-do-gop-cha-thu-hai.md) — hai lỗi đo đã ghi, chưa sửa; đợt này là số đo thứ ba. Nửa làm xong → ký: mới |
| B2 | Đếm lượt gọi người trên mỗi lần gộp | [dòng 2 máy đếm từ bản ghi phiên](2026-11-26-hat-giong-dong-2-may-dem-tu-ban-ghi-phien.md) — 104 câu / 54 gộp là số đo thứ hai cho ngưỡng của tệp ấy |
| B3 | Bộ nặng chạy trên GitHub ngay khi xong thi công; kit chỉ đưa PR khỏi nháp lúc trình Cổng Bằng chứng — ở hàng 11 lỗi thật lộ trễ ~11,5 giờ | đề xuất 5 của [northstar đợt crm](2026-10-11-hat-giong-northstar-tu-dot-crm-sau-14-10.md) đã dựng nửa «sẵn sàng lúc trình thẻ» (hồ sơ `ky-den-gop`); nửa «sớm hơn» chưa có. Liên quan: [chữ ký không kéo vòng CI](2026-11-26-hat-giong-chu-ky-khong-keo-vong-ci.md) |
| B4 | Tự kiểm bài đo trước lượt chấm: đỏ khi bộ chọn rỗng · tệp và ca đã hứa phải có · phép đo điểm ảnh chạy được trên Linux | mới — vế thứ hai là C6 |
| B5 | Ghim theo thứ tự gộp, một lần cho cả loạt, quy ca đỏ về PR gây ra; hàng dựng chồng không ghim trước hàng nó chồng lên | vế «ký trên nền sẽ gộp» của [lượt ghim còn lại](2026-10-27-hat-giong-lan-ghim-con-lai.md); phần thứ tự gộp còn mới |
| B6 | Khoá máy biết lượt đã chết (VP10 giữ khoá 97 và 92 phút khi lượt chấm đã dừng vì mạng) | mới; đo được chỉ khi có C4 |
| B7 | Giới hạn số hàng «đã chấm đạt, chưa gộp» trước khi mở hàng mới (có lúc bốn hàng chồng: VP10 → 11 → VP11 → 3h) | **trùng** [giao việc theo nhịp của khoá chấm](2026-10-27-hat-giong-nhip-giao-theo-suc-khoa.md) — thêm một ca đo |
| B8 | Xung đột chỉ ở trang kit tự sinh (`LO-TRINH.html`, `PRODUCT-MAP.md`) — lệnh gộp nên gợi ý vẽ lại thay vì dừng ở mã 4 | [bản đồ ngoài git sẵn sàng](2026-11-22-hat-giong-ngoai-git-san-sang.md) là đường đúng tầng (Inventory chưa bật `ban_do.ngoai_git`); gợi ý vẽ lại cho kho chưa bật: mới |

Thêm từ phiên giám sát, chưa có ở sổ:

- Một tệp ngoài mã (`.github/workflows/deploy.yml`) làm 10 hồ sơ cũ lại khi kho chưa bật `stale_scope: paths` — Inventory đã
  bật; đây là cấu hình của kho, không phải lỗi kit.
- `hang them` với vùng quá rộng và `hang vung` chỉ thêm, không thay — một hàng mới bị xếp sau hàng không liên quan.
- Hàng mới bị coi là trùng tệp với chính PR của nó khi nhánh PR khác nhánh worktree của dãy.
- Thước «máy rảnh» theo tải trung bình bị Spotlight và XProtect của macOS làm lệch (14 lõi rảnh 75 % mà tải 10–14). Luật
  tay của đợt: bộ xử lý rảnh ≥ 60 % và không phiên nào chạy bài.
- **Ngưỡng áp lực bộ nhớ.** Khuôn mặc định `suc_khoe.ap_luc_muc: 2` (`plugins/dispatch/scripts/mau/dieu-phoi.config.json:6`)
  và `suc-khoe.mjs:70` tự cờ mức 2 thành lý do giảm tải, đứng một mình. Trên máy 36 GB chỉ một làn chạy, còn 18 GB trống, tốc
  độ đọc lại từ vùng nhớ tạm dưới 1 MB/phút mà đợt vẫn không cấp lượt nặng mới (gặp 11/11 và 28/11; Inventory giữ mức 4,
  G-2811-53). Cùng họ với [điều tra thước sức khoẻ máy](../findings/2026-10-21-suc-khoe-may-do-sai.md) (21/10, về swap):
  một dấu hiệu nghẹt đứng một mình không nên giảm tải.
- **Hạn mức API GitHub** 5 000 lượt/giờ cạn lúc 11:00 vì vòng chờ CI của nhiều phiên; lệnh chờ gộp và thước đọc CI không đọc
  `rate_limit` trước khi lặp.

## 4. Điều Inventory tự làm sai — không phải lỗi kit

Ghi để không ai đọc thành lỗi kit:

- PR #133 gộp bằng squash trong khi kho khai `merge_method: merge`: mốc chấm thành mốc ma, `gate` nhánh chính đỏ, một PR đã ký
  phải gộp nhánh chính và ghim lại 11 hồ sơ (hai làn, ~90 phút). GitHub của kho vẫn cho squash — cài đặt của chủ kho.
- Giám sát xếp chồng việc nặng (chụp 68 ảnh lúc một dãy đang chấm) làm một lượt chấm đỏ oan; bảo một dãy nhả khoá trước bước
  còn cần khoá; khai vùng tệp quá rộng khi thêm hàng.
- Kho chưa bật tính năng kit đã có. Đã bật trong đợt: `stale_scope: paths`, `repin_retry: 1`, cờ `--tung-ho-so`. Còn tắt có
  chủ ý: `repin_parallel_suites`, `gop_khong_chay_lai_ci`, chuyến gộp. Chưa bật: `ban_do.ngoai_git`. Cấu hình sức khoẻ còn
  dùng khoá cũ (`swap_gb`, `rss_gb`) kit đã bỏ qua.

## 5. Luật giám sát đặt tay trong đợt — ứng viên để máy giữ

Mỗi dòng là một chỗ người đang làm thay máy (đếm vào lượt gọi người của đợt):

1. Bài đo trên một tập phần tử phải đỏ khi tập rỗng. (B4)
2. Phép đo điểm ảnh hay bề rộng thử trong ảnh Linux của Playwright trước khi coi là xanh. (B4)
3. Xong thi công là đưa PR ra khỏi nháp ngay; gom rồi đẩy một lần — mỗi lần đẩy huỷ lượt GitHub đang chạy. (B3)
4. Hàng dựng chồng không ghim trước hàng nó chồng lên; số tệp nâng cấp cơ sở dữ liệu đi theo thứ tự gộp. (B5)
5. Trước khi coi hợp đồng là «đã chấm»: ghi bản số đo vòng, chạy `recheck-evidence`, kiểm từng khối mang sang. (C1, C2)
6. Thước «máy rảnh»: bộ xử lý rảnh ≥ 60 % và không phiên nào chạy bài, thay tải trung bình.
7. Đổi tệp mà phép của hồ sơ đã ký trỏ tới thì xét lại hồ sơ ấy (G-2811-58). (C8)
8. Phép «hứa gì / ghi gì» chạy trên ma trận viết trước, không danh sách bỏ qua ngầm. (bài học ba lỗi «xem trước nhận, ghi bỏ»)

## Soi theo luật của kit

- **Trace:** nguyên tố 2 là chính — C1, C2, C6, C8, C9 và B4 đều là màu xanh chưa từng chạy chiều đỏ (xanh rỗng, xanh vì thiếu
  tham số, xanh vì cổng không nhìn). Nguyên tố 3 cho B2, B5, B7 và luật giám sát tay: 104 câu hỏi / 54 gộp. Người hưởng: chủ
  kho mọi kho tiêu thụ dùng Điều phối – Thợ, và người ký Cổng Bằng chứng.
- **Loại:** đa phần TRỪ (vá lỗ của bộ máy đang có: C1–C9). CỘNG: B1 nửa làm xong → ký, B4, B6 — cần chủ kho phê đích danh ở
  Cổng Phạm vi của vòng nhận nó.
- **Cân trên mọi kho:** C8 đổi hành vi cổng trước-gộp — kho nào cũng thêm hồ sơ bị xét lại khi đổi tệp test dùng chung; phải
  đi bộ đọc khoan dung + cờ vàng trước, không đổi mặc định ngay. C9 đổi «tuỳ chọn» thành «dừng» — kho không có quy trình soát
  riêng không được bị chặn; nghiệm là phân biệt «kho khai mà lượt chấm không nhận» với «kho không khai».
- **Thứ tự đề nghị khi chủ kho mở vòng:** C8 và C9 trước (cổng xanh khi vật đổi; lỗi mất dữ liệu lọt qua PASS) · C1 + C2 (một
  lượt chấm phải làm lại riêng) · C6 + B4 (một vòng) · C4 rồi B6 · B3.
- **Dự báo năm dòng** nếu làm nhóm C8, C9, C6/B4: dòng 1 ↓ (bớt làm lại sau chấm đạt — 3h25 ở hàng 11, 7h42 ở VP10) · dòng 2
  ↓ (bớt luật tay) · dòng 3 = · dòng 4 ↑ nhẹ (thêm lượt soát đủ tham số) · dòng 5 =.
- **Ngưỡng mở thành ô:** chủ kho gọi tên; hoặc một lỗi trong C1–C9 gây lượt chấm đỏ hay làm lại ở một kho tiêu thụ thứ hai.
  Đếm C8 ở một kho: số PR đã gộp mà diff chạm một tệp nằm trong `paths` của một hồ sơ đã ký và cổng in «sửa tệp chữ».
