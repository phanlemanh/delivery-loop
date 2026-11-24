# Đề bài vòng «đối soát bàn giao» (lớp 2 của hạt giống giám sát) — soạn 24/11/2026

Chủ kho bảo mở ngày 24/11, nguyên văn «Mở vòng lớp 2 đối soát bàn giao». Lời này đến ngay sau khi hạt giống
`docs/plans/2026-11-24-hat-giong-giam-sat-co-quyen-va-co-so.md` lên `main` (PR #31, commit gộp `647bd9d5`). Vòng chỉ làm
LỚP 2 của hạt giống ấy. Lớp 0, lớp 1 và lớp 3 ở ngoài vòng.

Nơi chạy: một cây làm việc riêng dưới bản sao `~/dev/delivery-loop-main`, nhánh cắt từ `origin/main` (`647bd9d5` lúc soạn).

## Bối cảnh

`delivery-loop` là kit nghiệm thu (engine). Phiên mở vòng là «phiên giữ đợt» ở nhánh `chuyen-nha` của bản kéo
`~/dev/delivery-loop`: nó chỉ đọc kết quả, không duyệt cổng, không gộp thay. Vòng chạy ở bản sao vì bản kéo chính còn bật
plugin chợ cũ. Thư mục gốc bản sao đứng ở nhánh cũ `va-chu-ky-giu-cho-lenh-gop` (`50840764`), sạch: đừng đụng.

**Nhánh `main` cục bộ của bản sao đã cũ** (`a2198fcf` lúc soạn), nên cây làm việc của phiên rất có thể cắt từ commit cũ.
Bước đầu: `git fetch origin`, rồi đặt nhánh của vòng về đúng `origin/main` mới nhất trước khi viết gì. Không đổi nhánh
`main` cục bộ, không đổi thư mục gốc bản sao.

**Cơn đau** (đọc trọn tệp hạt giống, mục «Bàn giao khi đổi tài khoản» và «Lớp 2»): khi đổi tài khoản giữa một đợt Điều
phối – Thợ, gói `dispatch` ghi `ban-giao.json` từ git, nhưng không bên nào đọc lại tệp ấy để so trước với sau. Chủ kho
phải tự đối soát từng dãy bằng mắt. Lời chủ kho 24/11: «kiểm tra bàn giao và đối soát bàn giao sau khi đổi tài khoản».

**Hiện trạng phiên giữ đợt đã đọc ở `main` `647bd9d5`** (vòng phải tự đọc lại, đừng tin danh sách này):

- `plugins/dispatch/scripts/ban-giao.mjs` ghi `sha_nhanh_chinh`; `plugins/dispatch/scripts/muc-day.mjs` ghi cho mỗi dãy
  `nhanh`, `dinh`, `da_day`, `co_wip`, `khoa`, `don`. Khuôn: `plugins/dispatch/scripts/mau/ban-giao.json` và
  `mau/ban-giao-xong.json`.
- `sha_nhanh_chinh` không có bên đọc nào. `dinh`, `co_wip` chỉ thành chữ trong lời ghi danh của chip
  (`plugins/dispatch/scripts/tiep-tuc.mjs`, quanh dòng 100). `khoa`, `don` lúc nối lại đọc từ trạng thái hiện tại.
- `ban-giao-xong` từ chối khi cây bẩn hay còn đơn, nhưng không đòi nhánh đã đẩy (`da_day`).
- `plugins/dispatch/commands/resume.md` bước 2: kết quả `khuyen_cho` (tài khoản mới cũng quá ngưỡng báo trước) vẫn đi tiếp
  và mở chip.
- `tests/dieu-phoi/doi-tai-khoan.test.mjs` không có ca nào so trước với sau.
- Hồ sơ liên quan đã có: `_acceptance/dieu-phoi-doi-tai-khoan/`, `_acceptance/dieu-phoi-tiep-tuc-mot-lenh/`. Hạt giống cùng
  cơn đau ở lớp nhìn: `docs/plans/2026-10-14-hat-giong-hien-trang-sau-doi-tai-khoan.md`.

## Việc

Chạy vòng theo quy trình của kho (`/feature-loop:feature-loop`, tên hồ sơ đề nghị `doi-soat-ban-giao`). Trả lời chủ kho
bằng tiếng Việt. Dòng `Gốc:` của ô: `delivery-loop/_acceptance/khung-dot-dinh-vi/`, như tệp hạt giống.

Đích của vòng, theo hạt giống (vòng tự thiết kế, hạt giống chưa phải thiết kế):

1. Lúc nối lại, `tiep-tuc` đọc `ban-giao.json` gần nhất và so với trạng thái hiện tại của từng dãy: nhánh · đỉnh · commit
   dở đã đẩy chưa · khoá · đơn · nhánh chính dời bao nhiêu commit. Khớp hết thì in một dòng; lệch thì chỉ in dòng lệch.
   Hạt giống còn nêu «câu hỏi chủ kho đang mở» và «PR»: vòng tự cân có vào hợp đồng này không, theo cỡ hợp đồng.
2. Bàn giao mà nhánh chưa đẩy thì phải lộ ra, không im.
3. `khuyen_cho` không dẫn tới mở chip.
4. Có ca kiểm khứ hồi viết-rồi-đọc cho `ban-giao.json`: bên viết thật sinh tệp trong chính lần chạy, bên đọc thật đọc nó.

**Bước đầu, trước mọi việc khác:** kiểm phiên nạp đúng plugin `@delivery-loop` 3.x và KHÔNG nạp plugin
`@acceptance-gate-kit` nào. Thấy khác thì dừng và báo ngay.

**Các câu phải nêu ở Cổng Phạm vi (cùng một lượt, không hỏi riêng):**

- *Luật chiều rộng (b).* Từ mốc 3.1.0 (kho `onehub-inventory` đã nhận) tới nay đã có các vòng kit: PR #26 (bản vá chữ ký),
  PR #27 (`dac-ta-ux-doc-so-man`), PR #29 (mốc 3.1.1). Mốc 3.1.1 chưa kho nào nhận. Vòng đếm lại bằng công cụ, nêu số, và
  hỏi chủ kho có nhận vòng này là ngoại lệ không. Tiền lệ: ngoại lệ luật (b) cho B1 + B2 quyết ở Cổng Phạm vi của B1.
- *Ngưỡng mở ô của hạt giống chưa đo đủ.* Ngưỡng ghi «thêm ≥ 1 lần đổi tài khoản giữa một đợt mà chủ kho phải đối soát tay
  một dãy». Chủ kho mở vòng bằng lời gọi tên trước khi ngưỡng ấy có số. Thẻ nêu thẳng điều này, kèm số lần đổi tài khoản
  đã đo được ở các đợt thật.
- *Phần nào là CỘNG.* Hạt giống ghi lớp 2 «phần lớn là sửa đúng-sai». Vòng phân loại từng tiêu chí; phần CỘNG cần chủ kho
  phê đích danh (ADR 0018).
- *Hai chỗ đổi hành vi mặc định:* bàn giao chưa đẩy nhánh (từ chối, hay cho qua kèm cờ) và `khuyen_cho` (dừng trước khi mở
  chip, hay hỏi). Mỗi chỗ nêu hệ quả từng lối trên kho đang chạy đợt và một khuyến nghị.

Mọi mục khác trên thẻ thì phân loại theo luật «lời mời cổng chỉ chứa điều-chỉ-người-biết» ở `CLAUDE.md`.

## Luật phải giữ (đọc `CLAUDE.md`)

- **Cân trên mọi kho.** Kho chưa từng bàn giao (không có `ban-giao.json`) không thấy gì mới. `ban-giao.json` cũ thiếu
  trường thì đọc được, kèm cờ vàng; không bắt kho nào sửa tệp cũ. Kho không cài gói điều phối không đổi gì. Thẻ Cổng Bằng
  chứng nêu rõ từng dòng này kèm phép đo.
- **Thước gắn vào vật.** Tệp bàn giao dùng trong ca kiểm phải do mã sinh trong chính lần chạy, không viết tay. Khuôn của
  chỗ nối viết→đọc đặt một chỗ có marker, ca khứ hồi rút từ bên viết và đọc bằng bên đọc. Đường dẫn suy từ vị trí tệp kiểm.
- **Hai chiều cho mỗi phép đo mới.** Phá vật trong một bản sao thì phép đo đỏ; chạm thứ không phải vật thì phép đo im.
  Assertion âm tính phải có đối chứng dương và ghim đúng thông điệp.
- **Rà riêng: bộ kiểm có XANH trên commit gộp thử không** — chạy ở một cây tách rời đặt HEAD = gộp `--no-ff` nhánh vòng
  vào `origin/main`.
- **Cỡ hợp đồng** ≤ 12 tiêu chí. Vượt thì tách, đừng xin giữ cỡ.
- Không dùng từ vựng của một kho tiêu thụ trong mã hay thông điệp của kit; dùng đúng từ ở `CONTEXT.md`.
- Bảng dự báo năm dòng số (↑ ↓ =) kèm điều kiện tin cậy vào hồ sơ, theo luật chiều rộng (c).

## Môi trường và bẫy đã dẫm

- Chạy công cụ của kit dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- Tác tử chấm từng chạy Node 26 trong khi kho ghim 24 → lượt chấm BLOCKED. Kiểm trước Cổng Phạm vi; còn thế thì nêu trên
  thẻ để chủ kho quyết cùng lượt. Không sửa tệp cấu hình shell khi chủ kho chưa nói ở chính phiên này; có sửa thì giữ bản
  lưu và hoàn lại khi xong. Không in nội dung tệp ấy. Không in nội dung `.env*`.
- Định vị plugin khác qua `resolve-plugin.mjs` (ADR 0003), không ghép đường dẫn tay.
- Ca `DP1-06 ban-chep` của `tests · dieu-phoi` từng chập chờn trên CI: thấy đỏ ở ô ấy thì ghi lại, đừng tính là lỗi vòng.
- Kho kit bật `gop_theo_loi_ky: true`: thẻ Cổng Bằng chứng in sẵn `gộp: khi CI xanh`; chủ kho ký và cho gộp một câu.
- Nhánh chính tiến giữa vòng thì phải ghim lại. Trước khi mở PR, xem PR đang mở có chạm cùng tệp không; trùng thì báo,
  đừng chạy đua. Lúc soạn chỉ có PR #21 (nháp, nhánh `chuyen-nha`) đang mở.
- Muốn thử bên đọc trên tệp bàn giao thật của một kho tiêu thụ thì chỉ ĐỌC ở bản kéo trên máy; không sửa, không commit,
  không chép nội dung sản phẩm của kho ấy vào kit.

## Ràng buộc

- `main` chỉ đổi qua PR, gộp bằng commit gộp; không gộp dồn, không đẩy đè, không bật tự gộp của GitHub. Không chạy
  `/repo-setup:github`, không đổi cài đặt GitHub.
- Vòng chỉ gộp vào `main`. KHÔNG cắt thẻ, không phát hành, không cài lên kho tiêu thụ nào. Phần này đi cùng mốc kế.
- Không đụng nhánh `chuyen-nha`, thư mục `migration/`, PR #21, thư mục gốc bản sao.
- Không làm lớp 0, lớp 1, lớp 3. Việc khác thấy trên đường: ghi hạt giống có dòng `Gốc:`, không làm.
- Lời duyệt cổng do chủ kho gõ ở CHÍNH phiên của vòng; không phiên nào chuyển lời duyệt.
- Lượt gọi người theo trần thiết kế của hạng (T2: 3 · T3: 4). Sắp vượt trần thì dừng và báo.
- Lượt đo dài (chạy trọn bộ kiểm): được hai lượt không hỏi; lượt thứ ba phải hỏi chủ kho.

## Xong là

PR của vòng đã gộp vào `main` bằng commit gộp; lượt CI trên chính commit gộp đã chạy XONG và xanh ở job `tests`. Báo cáo
cuối nêu: số PR, mã commit gộp, kết quả CI trên commit gộp, hạng, số lượt gọi người (trong và ngoài thiết kế), số lượt
chấm, thời gian làm-xong→ký và ký→gộp, phần cân trên mọi kho kèm phép đo, phần nào của lớp 2 đã làm và phần nào để lại,
hạt giống đã ghi.
