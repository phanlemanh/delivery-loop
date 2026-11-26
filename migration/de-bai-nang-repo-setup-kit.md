# Đề bài — kho kit nâng repo-setup từ 0.5.0 lên 0.10.4 và đóng bốn điểm hở của `doctor`

Viết 26/11/2026, phiên giữ đợt (Mac Studio). Chủ kho bảo 26/11: «Mở phiên Thực hiện hạng mục kit 4 nâng repo standards» —
hạng mục 4 trong bản rà các hạng mục của kit dính tới repo-standards: kho kit tự dựng bằng repo-setup nhưng còn ở 0.5.0.

## Bối cảnh

- `.repo-setup.json` trên `main` (`87a392cd`) ghi `version: 0.5.0`, `preset: claude-plugin`, `level: starter`, `adopt: true`,
  quản năm tệp: `.claude/skills/review-change/SKILL.md`, `.editorconfig`, `Makefile`, `tools/bump_version.py`,
  `tools/plugin_lint.py`. Bản phát hành mới nhất là `repo-setup 0.10.4` (21/11); máy đã cài nó ở mức người dùng
  (`repo-setup@repo-standards`, chợ ghim thẻ `repo-setup-v0.10.4`). Nhánh chính kho ấy đang dựng 0.10.5 — vòng này KHÔNG
  đuổi theo: giữ 0.10.4 kể cả khi 0.10.5 ra giữa vòng, trừ khi chủ kho nói khác ở chính phiên này.
- Lần đo `doctor` gần nhất (19/11, repo-setup 0.9.0, chỉ đọc, trên `main` `36d29038`): **87/100**, bậc starter, 18 đạt ·
  8 không áp dụng. Bốn điểm hở: `agent_permissions` (trọng số 2 — `.claude/settings.json` chưa chặn đọc `.env`, sửa
  workflow, đẩy đè) · `plugin_ci_validates` (2 — CI chưa chạy `claude plugin validate .`) · `language_policy` (1 — `AGENTS.md`
  thiếu mục Language) · `upgrade_wall` (1 — `make check` chưa chạy `tools/upgrade_markers.py`). Khối Upgrade lúc ấy:
  `Makefile` đã sửa tại chỗ, `.claude/skills/review-change/SKILL.md` đã gỡ.
- Ranh giới hai kho: `migration/NOI-REPO-STANDARDS.md` (đọc bằng `git show origin/chuyen-nha:migration/NOI-REPO-STANDARDS.md`).
  Dòng `agent_permissions` ở đó ghi hướng của kit: thêm `deny Read(./.env*)`, KHÔNG nhận luật cấm sửa quy trình CI — phiên
  kit sửa workflow là việc thường.

## Việc

1. Đo nền: chạy `doctor` của repo-setup 0.10.4 trên đỉnh `origin/main` mới nhất, chỉ đọc; ghi điểm và từng mục trượt.
2. Nâng kho lên 0.10.4 bằng đường nâng cấp của chính repo-setup (đọc `gh release view repo-setup-v0.10.4 --repo
   phanlemanh/repo-standards` và các bản 0.6–0.10 cho mục «What breaks on upgrade»), giữ nguyên preset và bậc trừ khi
   chủ kho quyết khác ở Cổng Phạm vi.
3. Đóng bốn điểm hở, hoặc nêu lý do không đóng điểm nào.
4. Đo lại `doctor` sau khi nâng; ghi điểm trước → sau.

## Câu phải nêu ở Cổng Phạm vi (cùng một lượt)

- **Luật chiều rộng (b):** mốc 3.1.1 đã được Inventory nhận (PR #118, 24/11) và crm nhận (PR #623, 25/11). Từ đó chưa có
  vòng meta nào — PR #33 chỉ là hạt giống tài liệu. Vòng này là vòng meta duy nhất được phép tới mốc kế, chủ kho đã gọi tên.
  Nêu thẳng để chủ kho xác nhận.
- **Phần nào là CỘNG** (ADR 0018 — chủ kho phê từng ca): thêm bước kiểm `claude plugin validate .` vào CI, thêm luật `deny`
  vào `.claude/settings.json`, thêm tệp hay lớp mới mà bản nâng mang vào. Phần nào là TRỪ hoặc chỉ là nâng bản.
- **Tệp kit đã sửa tay mà bản nâng muốn ghi đè:** `Makefile` (đã sửa tại chỗ), `.claude/skills/review-change/SKILL.md`
  (đã gỡ — không dựng lại nếu chủ kho không bảo), `CLAUDE.md` (luật của chủ kho — bản nâng không được ghi vào). Mỗi tệp:
  giữ bản kit, nhận bản mới, hay trộn.
- **`agent_permissions`:** đề xuất cụ thể từng dòng `deny` sẽ thêm, và dòng nào không nhận, kèm lý do.
- **Hạng của vòng** (chạm workflow, `Makefile`, `.claude/settings.json`) và trần lượt gọi tương ứng.
- **Môi trường chấm Node:** nếu tác tử chấm chạy Node 26 thì nêu cách xử lý; không tự sửa tệp cấu hình shell.

## Luật phải giữ (CLAUDE.md của kit)

Ba nguyên tố và người hưởng cụ thể · CỘNG cần chủ kho phê · cân trên mọi kho (bản nâng chỉ chạm kho kit, nhưng nêu rõ nếu
có gì đi vào gói giao cho kho tiêu thụ) · đổi schema phải có đường đọc-cũ · thước gắn vào vật, phép đo hai chiều · cỡ hợp
đồng ≤ 12 tiêu chí.

## Môi trường và bẫy

- Vòng chạy ở bản sao `~/dev/delivery-loop-main` (bản kéo chính còn bật plugin chợ cũ), trong cây làm việc riêng. Nhánh
  `main` cục bộ của bản sao đứng ở `a2198fcf` (cũ): `git fetch origin` rồi đặt nhánh vòng về `origin/main` mới nhất
  (đo 26/11: `87a392cd`). Thư mục gốc bản sao đang ở nhánh `va-chu-ky-giu-cho-lenh-gop` — không đụng.
- Công cụ kit chạy dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- Lúc mở phiên, kiểm phiên nạp plugin nào (`@delivery-loop` hay chợ cũ `@acceptance-gate-kit`) và bản nào; báo ở lượt đầu.

## Ràng buộc

- Chỉ gộp vào `main` qua PR bằng commit gộp, khi chủ kho bảo ở chính phiên này; không bật tự gộp.
- **Không chạy `/repo-setup:github` hay `tools/github_setup.py --apply`. Không đổi cài đặt GitHub nào.**
- Không cắt thẻ, không phát hành, không cài lên kho tiêu thụ.
- Không đụng nhánh `chuyen-nha`, thư mục `migration/`, PR #21, thư mục gốc bản sao.
- Không sửa `~/.claude/settings.json`, cấu hình plugin của máy, hay tệp cấu hình shell khi chủ kho chưa nói ở chính phiên này.
- Lượt đo dài thứ ba phải hỏi chủ kho trước.
- Lời duyệt cổng do chủ kho gõ ở chính phiên này.

## Xong là

PR gộp vào `main` bằng commit gộp VÀ CI trên chính commit gộp xanh ở job `tests`. Báo lại: số PR, commit gộp, điểm
`doctor` trước → sau, từng điểm hở đã đóng hay để lại có lý do, số lượt gọi người.
