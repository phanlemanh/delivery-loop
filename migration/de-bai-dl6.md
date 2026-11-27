# Đề bài vòng «DL6» — phiên giám sát đọc bản uỷ quyền của kho

Viết 27/11/2026, phiên giữ đợt (Mac Studio). Chủ kho bảo 27/11, nguyên văn: «Mở vòng thực hiện DL6». Đây là vòng dựng mà
ADR 0030 hẹn ở mục «Thời điểm»: mở khi chủ kho gọi tên, sau khi vòng DL2 đã gộp (PR #37, commit gộp `2956dae2`, 27/11).

## Bối cảnh

- Kit `delivery-loop` ở thẻ `v3.1.1` (23/11). Inventory và crm đã nhận 3.1.1; Quỹ hàng còn ở 3.0.0. Sau 3.1.1, `main` đã
  gộp 13 PR chưa phát hành, trong đó ba vòng sửa mã: đối soát bàn giao (PR #32), nâng repo-setup 0.10.4 (PR #34), DL2
  (PR #37 — vòng thứ hai giữa hai mốc, chủ kho xác nhận ngoại lệ luật (b) ở Cổng Phạm vi của chính vòng ấy).
- **Lời phê CỘNG đã có:** ADR 0030 (`docs/adr/0030-giam-sat-doc-ban-uy-quyen-cua-kho.md`, PR #36, `6d38d23f`), chủ kho phê
  26/11, nguyên văn «Phê, chọn A»: Hỏi-1 phê bản uỷ quyền, sự kiện dùng quyền và các lệnh để dùng quyền; Hỏi-2 lối A — quyền
  gộp vẫn đến từ ô `tu_merge` của mỗi đợt. ADR là lời phê, không thay Cổng Đáng hay Cổng Phạm vi của vòng; Cổng Phạm vi
  KHÔNG hỏi lại hai câu đã trả lời, chỉ hỏi phần ADR để cho «vòng dựng chốt chi tiết».
- **Lớp 2 đã gộp:** ADR 0030 đặt «đối soát bàn giao» đi trước vì loại `phien` (dọn phiên) cần phép so bàn giao. Vòng ấy đã
  gộp 24/11 (PR #32, `48590d28`; `plugins/dispatch/scripts/doi-soat.mjs`). Vòng này phải đọc lại: phép so ấy có đủ để bộ
  đọc nhận nửa «dọn phiên» chưa.
- Người hưởng theo ADR: chủ kho (thôi giao quyền bằng lời mỗi đợt, #5) và thợ của đợt (thôi dừng chờ phán một câu đã phán).
  Kho dùng đầu tiên là kho chạy đợt kế. Repo Standards dựng khuôn `governance/delegation.yaml` ở khe RS5b — kho ấy, không
  phải vòng này.

## Gốc đã ghi trong kho (đọc trước khi thiết kế)

Trên `origin/main`:
- ADR 0030 (đọc trọn, kể cả bảng loại quyền, vùng cấm, «Răng», «Cân trên mọi kho», «Đường đảo» và ngưỡng thu hồi).
- Ô gốc `_acceptance/khung-dot-dinh-vi/` (đã ký) · hạt giống `docs/plans/2026-11-24-hat-giong-giam-sat-co-quyen-va-co-so.md`
  (lớp 1) · vấn đề #4, #5 của kho kit.
- ADR 0002, 0012, 0024, 0027, 0029 (ADR 0030 viện dẫn từng cái).
- Gói `plugins/dispatch`: `gop.mjs` (`xetGop`), `lich.mjs` (`xepHang`), `dot.mjs` (`ghiSuKien`), `pha.mjs` (`tu_merge`),
  `trung-tep.mjs`, `doi-soat.mjs`, `ban-giao.mjs`, khuôn `LUAT.md`, lệnh `open`/`status`/`close`/`tiep-tuc`.

Trên nhánh `chuyen-nha` (đọc bằng `git fetch origin chuyen-nha` rồi `git show origin/chuyen-nha:<tệp>`):
`migration/hat-giong-sau-goi-dl-ba-kho.md` (hàng DL6, mục «Soi theo luật của kit»).

## Việc

Chạy vòng sửa kit «DL6» ở kho `delivery-loop` theo đúng quy trình của kho (`/feature-loop:feature-loop`). Trả lời chủ kho
bằng tiếng Việt. Đích: giám sát của gói `dispatch` đọc quyền từ một tệp của kho thay cho lời dặn, và mỗi lần dùng quyền để
lại một sự kiện có tên quyền và đường đảo — đúng năm điều ADR 0030 quyết.

**Bước đầu, trước mọi việc khác:** kéo `origin/main` mới nhất làm gốc nhánh (đo 27/11: `2956dae2`); kiểm phiên nạp đúng
plugin `@delivery-loop` và KHÔNG nạp plugin `@acceptance-gate-kit` nào. Thấy khác thì dừng và báo ngay.

## Câu phải nêu ở Cổng Phạm vi (cùng một lượt)

- **Luật chiều rộng (b):** nêu thẳng vị trí của vòng này — vòng sửa mã thứ ba giữa hai mốc 3.1.1 và mốc kế (sau PR #34 và
  PR #37), với 13 PR chưa phát hành trên `main`. ADR 0030 viết vòng này «không phải vòng kit sửa thước của kit» vì chạm bề
  mặt kho tiêu thụ dùng hằng ngày. Máy nêu cách đọc của mình kèm căn cứ; chủ kho xác nhận ở chính phiên này. Lối kia nêu
  kèm: cắt một mốc cho phần đã gộp trước khi dựng.
- **Phạm vi dựng trong vòng này:** bảng loại quyền của ADR có loại «phép so có, lệnh chưa có» (`chuyen-hang`, `mo-day`) và
  loại một nửa (`phien`: mở có, dọn CHƯA). Nêu loại nào bộ đọc nhận ở vòng này, lệnh nào dựng mới, loại nào để «chưa có phép
  so — vẫn hỏi chủ kho». Riêng nửa «dọn phiên»: có đọc được phép so của `doi-soat.mjs` không, căn cứ đo, không suy.
- **Hợp đồng vượt 12 tiêu chí thì đề xuất tách.** Khuyến nghị thứ tự: bộ đọc + vùng cấm + sự kiện `dung-quyen` + hai loại
  đã có lệnh (`gop` khi `tu_merge` bật, `thu-tu-gop`) trước; lệnh chuyển hàng, mở dãy và `phan-quyet` sau.
- **Chỗ ADR để mở cho vòng dựng:** khoá cấu hình mới (nếu có), tên lệnh, chỗ in khối uỷ quyền trên thẻ khởi tạo, dòng đếm
  trong báo cáo đợt. Cái nào máy tự quyết theo ADR + luật đã khai thì đi tiếp và ghi sổ, không thành câu hỏi.
- **Hạng của vòng** và trần lượt gọi tương ứng (dự kiến T3 vì chạm đường gộp; trần 4) · **môi trường chấm Node**.

## Luật phải giữ (CLAUDE.md của kit + ADR 0030)

- Ba nguyên tố và người hưởng cụ thể · phần CỘNG chỉ trong biên ADR 0030 đã phê; thứ gì ngoài biên ấy là CỘNG mới, phải
  chủ kho phê đích danh ở Cổng Phạm vi.
- **Kho không có `governance/delegation.yaml` thì gói chạy như hôm nay, từng byte** — chiều im phải có ca đo trên đầu ra của
  `open`, `status`, `close`.
- Bộ đọc đọc tệp ở ĐỈNH NHÁNH CHÍNH, không đọc cây làm việc; kèm mutant đổi nguồn đọc (ca «PR của giám sát tự thêm
  `lo-trinh`» phải đỏ).
- Vùng cấm cứng không cấu hình được; tệp liệt mục cấm thì từ chối CẢ tệp. Không loại nào chạm chữ ký cổng (ADR 0002 — bảy
  lệnh khoá của `acceptance-gate`, ba lệnh khoá của `roadmap`). Gộp theo quyền đi qua ĐÚNG các phép kiểm của `xetGop`, kèm
  `--match-head-commit`, không bao giờ `--auto`.
- Mỗi ca đỏ có đối chứng dương và ghim đúng thông điệp; fixture do code sinh trong chính lần chạy.
- Đổi schema phải có đường đọc-cũ và cờ vàng · cân trên MỌI kho (kho không cài `dispatch`, kho không có tệp, tệp đời cũ).
- ADR 0003 (định vị plugin khác qua `resolve-plugin.mjs`) · kho công khai: không chép chi tiết nội bộ của kho riêng tư
  `onehub-quy-hang` vào tệp hay PR nào.
- Bài học 22/11: ca kiểm mới phải chạy được TRÊN NHÁNH CHÍNH sau khi gộp (PR #17 từng để `main` đỏ).

## Môi trường và bẫy

- Vòng chạy ở bản sao `~/dev/delivery-loop-main` (bản kéo chính `~/dev/delivery-loop` ở nhánh `chuyen-nha`, còn bật plugin
  chợ cũ), trong cây làm việc riêng. `git fetch origin` rồi cắt nhánh vòng từ `origin/main`. Thư mục gốc bản sao đang ở
  nhánh `va-chu-ky-giu-cho-lenh-gop` — không đụng. Hai cây cũ `adr-dl6-uy-quyen-giam-sat` và `dl2-bang-chung-cu-theo-dau-vao-*`
  là của phiên khác — không đụng.
- Công cụ kit chạy dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`. Từ 26/11 hàm Node 24 trong tệp cấu hình
  shell đã nhận mọi cây dưới `~/dev/delivery-loop-main/` (chủ kho duyệt ở vòng DL2) — kiểm `node -v` trong cây của vòng
  trước Cổng Phạm vi; vẫn ra 26 thì nêu trên thẻ, không tự sửa tệp ấy.
- **Bẫy DL2:** `s4-args` lấy nhánh `main` CỤC BỘ làm gốc so; nhánh ấy ở bản sao tụt xa `origin/main` nên vùng vật phình.
  Khai `--diff-base <sha origin/main lúc cắt nhánh>`. Gói bằng chứng ghi `verifier:` là ĐƯỜNG DẪN tệp đã chạy, không phải
  tên loại (DL2 làm đỏ CI ở JR11b, DV4a, L05 vì chỗ này).
- Kho kit đã bật `gop_theo_loi_ky: true`: thẻ Cổng Bằng chứng in sẵn `gộp: khi CI xanh`. Nhắc chủ kho cho gộp TRONG câu ký
  — lời gộp ở lượt riêng là một lượt gọi thêm.

## Ràng buộc

- Chỉ gộp vào `main` qua PR bằng commit gộp, khi chủ kho bảo ở chính phiên này; không gộp dồn, không đẩy đè, không bật tự
  gộp. Không chạy `/repo-setup:github`, không đổi cài đặt GitHub.
- KHÔNG cắt thẻ, KHÔNG phát hành, KHÔNG cài lên kho tiêu thụ nào, KHÔNG viết `governance/delegation.yaml` vào kho tiêu thụ
  nào.
- Không đụng nhánh `chuyen-nha`, thư mục `migration/`, PR #21, thư mục gốc bản sao, cây của phiên khác.
- Không sửa `~/.claude/settings.json`, cấu hình plugin của máy, hay tệp cấu hình shell khi chủ kho chưa nói ở chính phiên này.
- Lời duyệt cổng do chủ kho gõ ở CHÍNH phiên này; không phiên nào chuyển lời duyệt.
- Lượt gọi người theo trần thiết kế của hạng (T2: 3 · T3: 4). Sắp vượt trần thì dừng và báo.
- Lượt đo dài (chạy trọn bộ kiểm): hai lượt không hỏi; lượt thứ ba phải hỏi chủ kho.
- Việc khác thấy trên đường: ghi hạt giống có dòng `Gốc:`, không làm. Không in nội dung `.env*`.

## Xong là

PR gộp vào `main` bằng commit gộp VÀ CI trên chính commit gộp xanh ở job `tests`. Báo cáo cuối: số PR, commit gộp, hạng,
số lượt gọi người (tách trong/ngoài thiết kế), số lượt chấm, bảng dự báo năm dòng so với bảng của ADR 0030, loại quyền nào
bộ đọc nhận và loại nào còn «vẫn hỏi chủ kho», kho tiêu thụ phải làm gì khi nhận mốc, phần nào bị tách hay để lại.
