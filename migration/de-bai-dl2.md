# Đề bài vòng «DL2» — bằng chứng chỉ hoá cũ khi đầu vào của chính nó đổi

Viết 26/11/2026, phiên giữ đợt (Mac Studio). Chủ kho bảo 26/11: «Mở phiên dãy tra và tôi muốn mở dãy DL», rồi chọn trên
thẻ hỏi của phiên giữ đợt: «Mở DL2, ngoại lệ (b)» — mở vòng DL2 ngay, câu ngoại lệ luật chiều rộng (b) hỏi ở Cổng Phạm vi
của chính vòng. Cùng lúc chủ kho mở một phiên tra soát chỉ đọc cho cả dãy DL2–DL6; số đo của phiên ấy về DL2 sẽ được
phiên giữ đợt chuyển sang khi có.

## Bối cảnh

- Kit `delivery-loop` ở thẻ `v3.1.1` (23/11). Inventory nhận 3.1.1 (PR #118, 24/11), crm nhận (PR #623, 25/11), Quỹ hàng
  còn ở 3.0.0. Sau 3.1.1 đã gộp vòng nâng repo-setup 0.10.4 (PR #34, 26/11) — đề bài vòng ấy ghi nó là vòng meta duy nhất
  được phép tới mốc kế. DL2 vì vậy là vòng thứ hai giữa hai mốc: cần chủ kho xác nhận ngoại lệ ở Cổng Phạm vi.
- DL2 là gói thứ hai của sáu gói DL1–DL6 (thiết kế ba kho của Repo Standards). DL1 + P179 đã gộp (PR #17, 22/11) và đi
  trong mốc 3.1.0.
- **Nội dung theo nguồn:** bằng chứng chỉ hoá cũ khi đầu vào của hàng (eval) đổi, không phải khi bất kỳ tệp vật nào đổi; và
  commit chữ ký không kéo thêm một vòng CI. Loại: đổi đường phán quyết, hạng dự kiến T3.
- **Số đo gốc (mục K3, của Repo Standards, Inventory, 63 hồ sơ, 10–20/11):** 60/160 lần gộp nhánh chính vào nhánh xảy ra
  SAU chữ ký; ký → gộp trung vị 0,6 giờ khi chữ ký là commit cuối, 1,5 giờ khi không. Ngưỡng máy đề xuất cho K3 (chưa ai
  duyệt): sau năm vòng trên 3.1 ở Inventory còn ≥ 1/3 số vòng có commit ghim lại sau chữ ký. **Ngưỡng này chưa đo** — đo
  nó là bước đầu của S1 (hoặc nhận số từ phiên tra soát).

## Gốc đã ghi trong kho (đọc trước khi thiết kế)

Trên `origin/main`:
- `docs/findings/2026-10-02-dieu-tra-lan-ghim-lai-va-du-bao.md` — gốc: `stale_files` so mọi tệp, không so theo `paths`
  của từng eval.
- `docs/adr/0010-thu-pham-vi-luat-recheck-theo-diff-pr.md`.
- Vấn đề #10 của kho kit: `pr-san-sang` coi tệp trong `t1_skip_globs` đổi sau `verified_commit` là bằng chứng cũ, lệch
  với lưới trước-merge (`pre-merge-check.sh`) và `repin-lane.mjs`.
- `_acceptance/tep-chung-khong-chan-gop/` và `docs/superpowers/specs/2026-11-21-tep-chung-khong-chan-gop-design.md` (vòng
  DL1, có nhắc DL2) · `docs/plans/lo-trinh-kit.json`.
- Dò thêm bằng `git grep -n -i "stale\|bằng chứng cũ\|ghim lại" origin/main -- docs/plans docs/findings` — các hạt giống
  11/2026 về `pr-san-sang`, gộp cha thứ hai, khuôn chấm sau ký có thể chạm cùng chỗ; cái nào liên quan thì nêu, không tự
  gộp vào phạm vi.

Trên nhánh `chuyen-nha` (đọc bằng `git fetch origin chuyen-nha` rồi `git show origin/chuyen-nha:<tệp>`):
`migration/hat-giong-sau-goi-dl-ba-kho.md` (hàng DL2, mục «Soi theo luật của kit») ·
`migration/KE-HOACH-12-MUC-REPO-STANDARDS.md` (K3 ở mục 2, mục 3 «Chờ ngưỡng», mục 8).

## Việc

Chạy vòng sửa kit «DL2» ở kho `delivery-loop` theo đúng quy trình của kho (`/feature-loop:feature-loop`). Trả lời chủ kho
bằng tiếng Việt. Đích: bớt số lần phải ghim lại và chấm lại sau chữ ký, tức rút đoạn ký → gộp ở kho tiêu thụ.

**Bước đầu, trước mọi việc khác:** kéo `origin/main` mới nhất làm gốc nhánh (đo 26/11: `8817a5bf`); kiểm phiên nạp đúng
plugin `@delivery-loop` và KHÔNG nạp plugin `@acceptance-gate-kit` nào. Thấy khác thì dừng và báo ngay.

## Câu phải nêu ở Cổng Phạm vi (cùng một lượt)

- **Ngoại lệ luật chiều rộng (b):** nêu thẳng rằng đây là vòng meta thứ hai sau mốc 3.1.1 (sau PR #34). Chủ kho đã chọn mở
  với ngoại lệ, nhưng lời xác nhận phải gõ ở chính phiên này. Tiền lệ: ngoại lệ cho B1 + B2 quyết ở Cổng Phạm vi của B1.
- **Ngưỡng K3 đo được bao nhiêu** trên các vòng của Inventory sau khi cài 3.1 (và crm nếu đủ mẫu): số vòng, số vòng có
  commit sau chữ ký, ký → gộp tách hai nhóm. Ngưỡng chưa đủ thì nói thẳng, để chủ kho quyết đi tiếp hay dừng.
- **Đổi mặc định hay bật theo lựa chọn:** ba kho tiêu thụ đều dùng đường phán quyết này. Thứ tự chọn nghiệm của luật
  26/09: sửa đúng tầng → bộ đọc khoan dung kèm cờ vàng → bật theo lựa chọn → đổi mặc định.
- **Ràng buộc cả hai chiều** (điều kiện tin cậy của luật (c)): đổi vật đúng `paths` của eval thì bằng chứng ĐỎ; đổi thứ
  không phải đầu vào của eval nào thì IM. Kèm đối chứng dương và ghim đúng thông điệp.
- **Phần nào là CỘNG** (ADR 0018) và phần nào là TRỪ hoặc sửa lỗi (vấn đề #10 là sửa lệch giữa ba bên đọc).
- **Hạng của vòng** và trần lượt gọi tương ứng · **môi trường chấm Node** (tác tử chấm từng chạy Node 26; nêu cách xử lý,
  không tự sửa tệp cấu hình shell).
- Hợp đồng vượt 12 tiêu chí thì đề xuất tách (khuyến nghị: phần chỉ hoá cũ theo `paths` trước, phần commit chữ ký không kéo
  CI sau).

## Luật phải giữ (CLAUDE.md của kit)

Ba nguyên tố và người hưởng cụ thể · CỘNG cần chủ kho phê · cân trên MỌI kho, kể cả bên đọc ngoài kit · đổi schema phải
có đường đọc-cũ và cờ vàng · thước gắn vào vật, phép đo hai chiều · ADR 0003 (định vị plugin khác qua
`resolve-plugin.mjs`) · kho công khai: không chép chi tiết nội bộ của kho riêng tư `onehub-quy-hang` vào tệp hay PR nào.
Bài học 22/11: rà cả việc ca kiểm mới có chạy được TRÊN NHÁNH CHÍNH sau khi gộp không (PR #17 từng để `main` đỏ vì ca dựng
«bản trước vòng» từ `git merge-base HEAD origin/main`).

## Môi trường và bẫy

- Vòng chạy ở bản sao `~/dev/delivery-loop-main` (bản kéo chính `~/dev/delivery-loop` còn bật plugin chợ cũ), trong cây
  làm việc riêng. `git fetch origin` rồi cắt nhánh vòng từ `origin/main`. Thư mục gốc bản sao đang ở nhánh
  `va-chu-ky-giu-cho-lenh-gop` — không đụng.
- Công cụ kit chạy dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- Kho kit đã bật `gop_theo_loi_ky: true`: thẻ Cổng Bằng chứng in sẵn `gộp: khi CI xanh`.

## Ràng buộc

- Chỉ gộp vào `main` qua PR bằng commit gộp, khi chủ kho bảo ở chính phiên này; không gộp dồn, không đẩy đè, không bật tự
  gộp. Không chạy `/repo-setup:github`, không đổi cài đặt GitHub.
- KHÔNG cắt thẻ, KHÔNG phát hành, KHÔNG cài lên kho tiêu thụ nào.
- Không đụng nhánh `chuyen-nha`, thư mục `migration/`, PR #21, thư mục gốc bản sao.
- Không sửa `~/.claude/settings.json`, cấu hình plugin của máy, hay tệp cấu hình shell khi chủ kho chưa nói ở chính phiên này.
- Lời duyệt cổng do chủ kho gõ ở CHÍNH phiên này; không phiên nào chuyển lời duyệt.
- Lượt gọi người theo trần thiết kế của hạng (T2: 3 · T3: 4). Sắp vượt trần thì dừng và báo.
- Lượt đo dài (chạy trọn bộ kiểm): hai lượt không hỏi; lượt thứ ba phải hỏi chủ kho.
- Việc khác thấy trên đường: ghi hạt giống có dòng `Gốc:`, không làm. Không in nội dung `.env*`.

## Xong là

PR gộp vào `main` bằng commit gộp VÀ CI trên chính commit gộp xanh ở job `tests`. Báo cáo cuối: số PR, commit gộp, hạng,
số lượt gọi người, số lượt chấm, số đo K3 trước vòng, bảng dự báo năm dòng, kho tiêu thụ phải làm gì khi nhận mốc, phần
nào bị tách hay để lại.
