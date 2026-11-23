# Đề bài vòng «mốc 3.1.1 — mang bản vá chữ ký giữ chỗ» — soạn 23/11/2026

Chủ kho bảo mở ngày 23/11, nguyên văn «Mở phiên mới vòng mốc 3.1.1 mang bản vá». Lời này đến sau bản tổng kết tiến độ của
phiên giữ đợt. Bản tổng kết chỉ ra rằng thẻ `v3.1.0` (`0a93a5b9`, PR #24) được cắt TRƯỚC khi bản vá gộp, nên kho cài
3.1.0 vẫn để `human_signoff: pending` lọt qua vế chữ ký của lệnh gộp theo lời.

Nơi chạy: một cây làm việc riêng dưới bản sao `~/dev/delivery-loop-main`, nhánh cắt từ `origin/main` (`1a887948` lúc soạn).

## Bối cảnh

`delivery-loop` là kit nghiệm thu (engine). Phiên mở vòng là «phiên giữ đợt» ở nhánh `chuyen-nha` của bản kéo
`~/dev/delivery-loop`: nó chỉ đọc kết quả, không duyệt cổng, không gộp thay. Vòng chạy ở bản sao vì bản kéo chính còn bật
plugin chợ cũ. Thư mục gốc bản sao đứng ở nhánh cũ `va-chu-ky-giu-cho-lenh-gop` (`50840764`), sạch: đừng đụng.

**Cửa sổ của mốc** (`v3.1.0..origin/main`, theo cha thứ nhất): đúng một PR, #26, commit gộp `1a887948`, hồ sơ
`va-chu-ky-giu-cho-lenh-gop` (đã ký). Vòng phải suy lại cửa sổ bằng công cụ, đừng tin danh sách này. Thư mục gói có tệp
đổi: `acceptance-gate` (`commands/signoff.md`) · `dispatch` (`scripts/gop.mjs`, `scripts/dieu-phoi.mjs`) · `feature-loop`
(`skills/feature-loop/SKILL.md`). Ba gói `roadmap`, `knowledge`, `diagram-design` không đổi.

**Khuôn:** hồ sơ mốc `_acceptance/release-3-1-0/` trên `main` (`chay.sh`, `goi-chi-doi-so.sh`, `lop-chep-doi.sh`, mục
`3.1.0` của `CHANGELOG.md`). Dùng lại cách làm và công cụ ấy, đừng dựng đường thứ hai. Theo tiền lệ 3.1.0, chỉ gói có thư
mục đổi mới lên số. Vòng tự đối chiếu với luật đánh số của kho rồi theo luật ấy.

**Kho chờ nhận:** `onehub-inventory`. Ở kho ấy, PR #109 (`nang-kit-3-1`) đã gộp và PR #110 (đổi `KIT_TAG` sang `v3.1.0`)
đang mở. Vòng này KHÔNG đụng Inventory. Thẻ Cổng Bằng chứng nêu một dòng: kho nhận cần đổi `KIT_TAG` sang `v3.1.1` để có
bản vá; việc ấy làm ở phiên của kho đó.

## Việc

Chạy vòng theo quy trình của kho (`/feature-loop:feature-loop`, tên hồ sơ `release-3-1-1`). Trả lời chủ kho bằng tiếng Việt.
Đích: thẻ `v3.1.1` trỏ commit gộp của vòng, gói đã lên số mang bản vá, `CHANGELOG.md` có mục `3.1.1`, và
`kiem-ban-cai.mjs --ref v3.1.1` đạt.

**Bước đầu, trước mọi việc khác:** kiểm phiên nạp đúng plugin `@delivery-loop` 3.x và KHÔNG nạp plugin
`@acceptance-gate-kit` nào. Thấy khác thì dừng và báo ngay.

**Câu phải nêu ở Cổng Phạm vi (không hỏi riêng một lượt):** có tạo bản phát hành GitHub cho `v3.1.1` không. Hiện chỉ 3.0.0
có bản phát hành và vẫn là Latest; 3.1.0 có thẻ mà không có bản phát hành. Đây là việc công khai, nên phải là câu hỏi cho
người, kèm một khuyến nghị và hệ quả từng lối. Ví dụ: tạo cho 3.1.1, đánh Latest, ghi chú gồm cả phần của 3.1.0 · hay
không tạo. Mọi mục khác trên thẻ thì phân loại theo luật «lời mời cổng chỉ chứa điều-chỉ-người-biết» ở `CLAUDE.md`. Mốc
phát hành đi làn V theo tiền lệ 2.5.0/2.7.0, mục tiêu ≤1 lượt gọi ngoài chữ ký.

## Luật phải giữ (đọc `CLAUDE.md`)

- Năm dòng số của luật chiều rộng (c) vào hồ sơ mốc, theo khuôn của `release-3-1-0`. Đếm cả đoạn ký→gộp của #26 (phiên vòng
  ấy báo hai làn ghim lại, khoảng 2 giờ máy, vì nhánh chính tiến hai lần); số phải đo bằng công cụ, đừng chép lời báo.
- Assertion âm-tính-một-mình không sống; nghi thức hai chiều cho phép đo mới.
- **Rà riêng: bộ kiểm có XANH trên commit gộp thử không** — chạy ở một cây tách rời đặt HEAD = gộp `--no-ff` nhánh vòng vào
  `origin/main`.
- Cân trên mọi kho: mốc chỉ đổi số và tài liệu; nêu rõ kho không cài gói điều phối có đổi hành vi không.

## Môi trường và bẫy đã dẫm

- Chạy công cụ của kit dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- Tác tử chấm từng chạy Node 26 trong khi kho ghim 24 → lượt chấm BLOCKED. Vòng trước đã hoàn lại hàm bọc Node 24 trong tệp
  cấu hình shell. Kiểm trước Cổng Phạm vi; vẫn thế thì nêu trên thẻ để chủ kho quyết cùng lượt. Không sửa tệp cấu hình
  shell khi chủ kho chưa nói ở chính phiên này; có sửa thì giữ bản lưu và hoàn lại khi xong. Không in nội dung tệp ấy.
- Định vị plugin khác qua `resolve-plugin.mjs` (ADR 0003), không ghép đường dẫn tay.
- Ca `DP1-06 ban-chep` của `tests · dieu-phoi` từng chập chờn trên CI: thấy đỏ ở ô ấy thì ghi lại, đừng tính là lỗi vòng.
- Kho kit bật `gop_theo_loi_ky: true`: thẻ Cổng Bằng chứng in sẵn `gộp: khi CI xanh`; chủ kho ký và cho gộp một câu.
- Nhánh chính tiến giữa vòng thì phải ghim lại (vòng trước mất hai làn vì thế). Trước khi mở PR, xem PR đang mở có chạm
  cùng tệp không; trùng thì báo, đừng chạy đua.

## Ràng buộc

- `main` chỉ đổi qua PR, gộp bằng commit gộp; không gộp dồn, không đẩy đè, không bật tự gộp của GitHub. Không chạy
  `/repo-setup:github`, không đổi cài đặt GitHub.
- Thẻ `v3.1.1` chỉ gắn SAU khi PR gộp, vào đúng commit gộp, như tiền lệ 3.1.0. Bản phát hành GitHub chỉ tạo khi chủ kho
  trả lời «có» ở Cổng Phạm vi.
- KHÔNG cài lên kho tiêu thụ nào. Không đụng nhánh `chuyen-nha`, thư mục `migration/`, PR #21, thư mục gốc bản sao.
- Lời duyệt cổng do chủ kho gõ ở CHÍNH phiên của vòng; không phiên nào chuyển lời duyệt.
- Lượt gọi người theo trần thiết kế (T2: 3). Sắp vượt trần thì dừng và báo.
- Lượt đo dài (chạy trọn bộ kiểm): được hai lượt không hỏi; lượt thứ ba phải hỏi chủ kho.
- Việc khác thấy trên đường: ghi hạt giống có dòng `Gốc:`, không làm. Không in nội dung `.env*`.

## Xong là

PR của vòng đã gộp vào `main` bằng commit gộp; lượt CI trên chính commit gộp đã chạy XONG và xanh ở job `tests`; thẻ
`v3.1.1` trỏ commit gộp; `kiem-ban-cai.mjs --ref v3.1.1` đạt; bản phát hành GitHub theo lời chủ kho. Báo cáo cuối nêu: số
PR, mã commit gộp, kết quả CI, thẻ và commit nó trỏ, gói nào lên số, năm dòng số, số lượt gọi người, số lượt chấm, việc kho
nhận phải làm, phần để lại.
