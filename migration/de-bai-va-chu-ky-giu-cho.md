# Đề bài vòng «bản vá chữ ký giữ chỗ của lệnh gộp theo lời» — soạn 22/11/2026

Chủ kho bảo mở ngày 22/11, nguyên văn «Mở vòng ấy» (trả lời câu «Mở lại vòng bản vá chữ ký giữ chỗ bây giờ không?»).
Quyết định nền: «Mở lại sau DL1» (22/11). DL1 đã gộp (PR #17), và nhánh chính đã xanh lại ở `a2198fcf` (PR #22).

Nơi chạy: một cây làm việc riêng dưới bản sao `~/dev/delivery-loop-main`, nhánh cắt từ `main` = `origin/main`
(`a2198fcf` lúc soạn).

## Bối cảnh

`delivery-loop` là kit nghiệm thu (engine). Phiên mở vòng là «phiên giữ đợt» ở nhánh `chuyen-nha` của bản kéo
`~/dev/delivery-loop`: nó chỉ đọc kết quả, không duyệt cổng, không gộp thay. Vòng chạy ở bản sao `~/dev/delivery-loop-main`
vì bản kéo chính kia còn bật plugin chợ cũ.

Lỗ cần vá (hạt giống `docs/plans/2026-11-21-hat-giong-chu-ky-giu-cho-o-lenh-gop.md` trên `main`, Ngoài-2 và Ngoài-4 của
Cổng Bằng chứng hồ sơ `loi-gop-trong-cau-ky`): vế chữ ký của `dieu-phoi.mjs gop <PR> --theo-loi` đọc bằng `dongChuKy`
riêng trong `plugins/dispatch/scripts/gop.mjs`, chỉ hỏi `human_signoff` có chữ hay không. Lõi (`chuKyThat` trong
`plugins/acceptance-gate/lib/evidence-core.cjs`) loại thêm các giá trị giữ chỗ (`CHU_KY_GIU_CHO`). Báo cáo điền tạm
`human_signoff: pending` vẫn qua vế chữ ký của lệnh gộp — mà gộp vào nhánh chính là việc khó đảo.

## Hồ sơ nháp đã có — dùng lại, đừng soạn lại từ đầu

Hồ sơ `va-chu-ky-giu-cho-lenh-gop` (T2, `status: draft`, CHƯA duyệt, CHƯA commit) có hai bản giống nhau:

- Bản sống: thư mục gốc bản sao `~/dev/delivery-loop-main`, nhánh `va-chu-ky-giu-cho-lenh-gop`, tệp chưa commit:
  `_acceptance/va-chu-ky-giu-cho-lenh-gop/` (contract, evals, decisions, gap-probe, card, figures),
  `docs/plans/2026-11-21-hat-giong-p33-mu-do-bo-dem-duong-tuong-doi.md`, và ba dòng thêm vào `_acceptance/config.yaml`
  (khoá `vcgc_giu_cho`, `vcgc_duong_loi`).
- Bản chép chữ: nhánh `chuyen-nha` của bản kéo chính, `migration/luu-nhap/va-chu-ky-giu-cho-lenh-gop/` (có
  `config.yaml.patch`).

**CHÉP** các tệp ấy sang cây làm việc của vòng (`cp`, không `git stash`, không chuyển nhánh ở thư mục gốc). KHÔNG sửa,
xoá hay commit gì ở thư mục gốc bản sao. Thiết kế đã sửa theo ADR 0003: lệnh gộp nhận gốc lõi qua cờ `--loi`, khối dòng
lệnh `GOP-THEO-LOI-KY` giải gốc ấy bằng `resolve-plugin.mjs --plugin acceptance-gate --require lib/evidence-core.cjs`.
Tệp `chu-ky-giu-cho.sh` mà hai khoá cấu hình trỏ tới CHƯA có — vòng phải viết.

Nháp soạn trên `50840764`. Từ đó tới `a2198fcf`: `gop.mjs` và `evidence-core.cjs` không đổi; `SKILL.md` của feature-loop
đổi 5 dòng, `plugins/dispatch/scripts/nguon-hang.mjs` thêm 6 dòng. Vòng đọc lại hai chỗ đổi ấy trước khi trình Cổng Phạm vi.

## Việc

Chạy vòng theo quy trình của kho (`/feature-loop:feature-loop va-chu-ky-giu-cho-lenh-gop`, tiếp từ hồ sơ nháp). Trả lời
chủ kho bằng tiếng Việt. Đích: báo cáo có `human_signoff` giữ chỗ KHÔNG qua vế chữ ký của lệnh gộp theo lời; không có bộ
đọc lõi dùng được thì lối gộp theo lời chặn, không rơi về phép cũ.

**Bước đầu, trước mọi việc khác:** kiểm phiên nạp đúng plugin `@delivery-loop` 3.0 và KHÔNG nạp plugin
`@acceptance-gate-kit` nào. Thấy khác thì dừng và báo ngay.

**Câu phải nêu ở Cổng Phạm vi (không hỏi riêng một lượt):** có gộp sáu mục Ngoài-6, 7, 8, 12, 13, 14 của
`_acceptance/tep-chung-khong-chan-gop/review-findings.md` (trên `main`) vào vòng này không — kho đầu tiên bật
`ban_do.ngoai_git` sẽ vấp chúng. Vòng phân loại từng mục theo nguồn căn cứ trước khi mời (luật «lời mời cổng chỉ chứa
điều-chỉ-người-biết» ở `CLAUDE.md`), kèm một khuyến nghị và hệ quả cho cỡ hợp đồng và trần lượt gọi. Thêm mục nào vào thì
phải là cùng nhát hoặc rẻ; còn lại giữ là hạt giống.

## Luật phải giữ (đọc `CLAUDE.md`)

- Assertion âm-tính-một-mình không sống: mọi ca đỏ phải có đối chứng dương và ghim đúng thông điệp.
- Nghi thức hai chiều cho phép đo mới: phá vật thì đỏ; chạm thứ không phải vật thì im.
- TDD trong lịch sử: commit test đứng trước commit vật.
- **Rà riêng: bộ kiểm có XANH trên commit gộp thử không** — chạy ở một cây tách rời đặt HEAD = gộp `--no-ff` nhánh vòng vào
  `origin/main`, không chỉ trên nhánh PR (chỗ PR #17 từng lọt).
- Cân trên mọi kho: vật chạm gói điều phối và khối dòng lệnh ở SKILL/lệnh ký — nêu rõ kho tiêu thụ được gì, mất gì, và
  kho không cài gói điều phối có đổi hành vi không.

## Môi trường và bẫy đã dẫm

- Chạy công cụ của kit dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- Tác tử chấm từng chạy Node 26 trong khi kho ghim 24 → lượt chấm BLOCKED. Kiểm trước Cổng Phạm vi; vẫn thế thì nêu trên
  thẻ để chủ kho quyết cùng lượt. Không sửa tệp cấu hình shell khi chủ kho chưa nói ở chính phiên này; có sửa thì giữ bản
  lưu và hoàn lại khi xong. Không in nội dung tệp ấy.
- Định vị plugin khác qua `resolve-plugin.mjs` (ADR 0003), không ghép đường dẫn tay.
- Ca `DP1-06 ban-chep` của `tests · dieu-phoi` từng chập chờn trên CI: thấy đỏ ở ô ấy thì ghi lại, đừng tính là lỗi vòng.
- Kho kit bật `gop_theo_loi_ky: true`: thẻ Cổng Bằng chứng in sẵn `gộp: khi CI xanh`; chủ kho ký và cho gộp một câu.
- Có phiên khác mở PR vào `main` cùng lúc (PR #22 trùng việc vòng TCG-1). Trước khi mở PR, xem PR đang mở có chạm cùng tệp
  không; trùng thì báo, đừng chạy đua.

## Ràng buộc

- `main` chỉ đổi qua PR, gộp bằng commit gộp; không gộp dồn, không đẩy đè, không bật tự gộp của GitHub. Không chạy
  `/repo-setup:github`, không đổi cài đặt GitHub.
- KHÔNG cắt thẻ, KHÔNG tạo bản phát hành, KHÔNG cài lên kho tiêu thụ nào. Bản vá đi trong một mốc chung quanh 02/12 (tên hồ
  sơ `release-3-1-0` để dành cho vòng mốc ấy).
- Không đụng nhánh `chuyen-nha`, thư mục `migration/`, PR #19, #20, #21, và thư mục gốc bản sao.
- Lời duyệt cổng do chủ kho gõ ở CHÍNH phiên của vòng; không phiên nào chuyển lời duyệt.
- Lượt gọi người theo trần thiết kế (T2: 3). Sắp vượt trần thì dừng và báo.
- Lượt đo dài (chạy trọn bộ kiểm): được hai lượt không hỏi; lượt thứ ba phải hỏi chủ kho.
- Việc khác thấy trên đường: ghi hạt giống có dòng `Gốc:`, không làm. Không in nội dung `.env*`.

## Xong là

PR của vòng đã gộp vào `main` bằng commit gộp, VÀ lượt CI trên chính commit gộp đã chạy XONG và xanh ở job `tests`
(đọc tới khi xong, đừng dừng ở «còn chạy»). Báo cáo cuối nêu: số PR, mã commit gộp, kết quả CI trên commit gộp, hạng, số
lượt gọi người, số lượt chấm, các mục Ngoài đã gộp hay để lại, phần để lại. Khi xong, nói rõ thư mục gốc bản sao vẫn còn
bản nháp chưa commit — phiên giữ đợt sẽ hỏi chủ kho có dọn không.
