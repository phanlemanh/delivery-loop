---
schema_version: 1
feature: Nâng repo-setup của kho kit từ 0.5.0 lên 0.10.4 bằng đường nâng cấp của chính repo-setup, và đóng năm mục doctor đang trượt (agent_permissions, plugin_ci_validates, language_policy, upgrade_wall, plugin_versions)
slug: nang-repo-setup-0-10-4
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: .repo-setup.json, Makefile, mk/, tools/, .gitattributes, .github/workflows/gate.yml, .claude/settings.json, CLAUDE.md — KHÔNG khớp t3_paths
surfaces: [ci]
status: draft
approved_by:
approved_at:
design_doc: docs/superpowers/specs/2026-11-26-nang-repo-setup-0-10-4-design.md
---

# Acceptance Contract: nang-repo-setup-0-10-4

## Context

Gốc: `origin/chuyen-nha:migration/de-bai-nang-repo-setup-kit.md` — chủ kho gọi tên 26/11/2026, nguyên văn «Mở phiên Thực
hiện hạng mục kit 4 nâng repo standards». Ranh giới hai kho: `origin/chuyen-nha:migration/NOI-REPO-STANDARDS.md`.

**Cơn đau:** kho kit dựng khung bằng repo-setup 0.5.0 (17/11) và đứng yên ở đó trong khi repo-setup ra 0.6 → 0.10.4. Bản
cũ không có đường nâng; bản mới có đường nâng ba chiều nhưng kho chưa đi qua nó. `doctor` 0.10.4 chấm đỉnh `origin/main`
`87a392cd` **82/100** với năm mục trượt; hai trong số đó là lỗ thật chứ không chỉ điểm: CI không đọc tệp khai plugin nào
(một tệp khai hỏng tới người dùng ở lần đẩy kế), và phiên tác tử đọc được `.env` nếu có.

**Vật** (thiết kế đủ ở `design_doc`):

1. Chạy `apply.py` của repo-setup 0.10.4 (`--preset claude-plugin --level starter --adopt --var plugin_versioning=independent`):
   `.repo-setup.json` lên 0.10.4, `Makefile` trộn ba chiều, thêm `mk/upgrade.mk`, `mk/derived.mk`,
   `tools/upgrade_markers.py`, `tools/ledgers.py`, một dòng `.gitattributes`; gỡ `tools/ci_inputs.py`, `tools/ci_verdict.py`
   ngay sau khi áp.
2. Job `khung` trong `.github/workflows/gate.yml` chạy `plugin_lint.py` và `upgrade_markers.py`; kiểm bắt buộc `tests` chờ
   và đỏ theo nó.
3. Hai dòng `permissions.deny` trong `.claude/settings.json`.
4. Mục `## Language` ở cuối `CLAUDE.md` (văn bản ở Notes).

Thuật ngữ:
- **bản gốc vòng** = cây `87a392cd` (đỉnh `origin/main` lúc mở vòng, cũng là gốc nhánh vòng), rút trọn bằng `git archive`.
- **bản sao đo** = cây cần đo rút bằng `git archive` vào thư mục tạm, `git init` + một commit — repo-setup đọc lịch sử git.
- **repo-setup 0.10.4** = plugin cài ở bộ đệm người dùng (`~/.claude/plugins/cache/repo-standards/repo-setup/0.10.4`), hoặc
  thư mục biến `REPO_SETUP_ROOT` chỉ. Vắng → phép đo thoát 2 «không đọc được ở đây», không bao giờ xanh.

## Criteria

- AC-1: Given bản sao đo của HEAD, When chạy `apply.py` của repo-setup 0.10.4 với `--preset claude-plugin --level starter --adopt --dry-run --json`, Then thoát 0; nhóm `created`, `merged`, `marked`, `base_unread` đều rỗng; `removed` gồm đúng ba tệp `.claude/skills/review-change/SKILL.md`, `tools/ci_inputs.py`, `tools/ci_verdict.py`; `conflict` có `CLAUDE.md` và `.claude/settings.json`; `.repo-setup.json` của HEAD ghi `version: 0.10.4`, `preset: claude-plugin`, `level: starter`, `adopt: true`, `vars.plugin_versioning: independent`, và mang băm của cả ba tệp đã gỡ. Chiều đỏ: cùng lệnh trên bản sao đo của bản gốc vòng → `created` có `mk/upgrade.mk`, phép đo nêu «bản gốc vòng chưa nâng».
- AC-2: Given bản sao đo của HEAD, When chạy `doctor.py` của repo-setup 0.10.4 (`--json`, bậc starter), Then điểm 100, `failed` rỗng, khối `upgrade` có `marked` và `behind` rỗng, và năm mục `agent_permissions`, `plugin_versions`, `plugin_ci_validates`, `language_policy`, `upgrade_wall` đều nằm trong `passed`. Chiều đỏ: cùng lệnh trên bản sao đo của bản gốc vòng → điểm 82 và `failed` gồm đúng năm mục ấy.
- AC-3: Given cây HEAD và bản gốc vòng, When so ba tệp kit đã sửa tay, Then (1) `CLAUDE.md` chỉ khác ở các dòng THÊM vào cuối tệp, mở đầu bằng đúng một dòng `## Language`, không dòng nào của bản gốc bị xoá hay sửa; (2) `.claude/skills/review-change/SKILL.md` không có; (3) đầu ra `make -n test` trên bản sao đo của HEAD bằng đầu ra ấy trên bản sao đo của bản gốc vòng, sau khi bỏ đúng ba dòng đã khai mà bản nâng đặt trước mọi bước kiểm — `python3 tools/upgrade_markers.py`, `python3 tools/ledgers.py draw`, `:` — và ba dòng ấy đứng trước lệnh bộ chạy kiểm của kit. Chiều đỏ: bản sao `CLAUDE.md` sửa một dòng ở giữa → nêu «CLAUDE.md đổi ngoài mục Language»; bản sao `Makefile` đổi công thức `test` → nêu «đích test của kit bị đổi»; bản sao `Makefile` thêm cho `test` một tiền điều kiện lạ in ra một dòng lệnh → cũng nêu «đích test của kit bị đổi».
- AC-4: Given bản sao đo của HEAD, When (a) chạy `make upgrade` trên bản sạch và (b) chèn khối dấu xung đột (`<<<<<<<`, `=======`, `>>>>>>>`) vào `.editorconfig` — tệp `.repo-setup.json` quản mà make không đọc — rồi chạy lại `make upgrade` và chạy thẳng `python3 tools/upgrade_markers.py`, Then (a) thoát 0 và in «no conflict markers»; (b) cả hai thoát khác 0, đầu ra có dòng `.editorconfig:<số dòng>: conflict marker from a repo-setup upgrade` và KHÔNG có «missing separator»; và dòng đầu tiên `make -n check` in ra là `python3 tools/upgrade_markers.py` (tường chạy trước mọi bước lint và test). Đối chứng dương ở (a) chạy trên cùng bản sao trước khi chèn.
- AC-5: Given `.github/workflows/gate.yml` của HEAD, When đọc nó bằng bộ đọc dòng của phép đo và chạy thật các lệnh của job `khung`, Then (1) có job `khung` KHÔNG mang `if`, chạy `python3 tools/plugin_lint.py` và `python3 tools/upgrade_markers.py`, và workflow có cả lối vào `pull_request` lẫn `push`; (2) `needs` của `tests` có `khung` và `if` cấp job của `tests` có `always()` (một kiểm bắt buộc bị bỏ qua được GitHub tính là qua); (3) `tests` có một bước KHÔNG mang điều kiện, đọc `needs.khung.result`, mà chạy thân bước ấy với kết quả `success` thì thoát 0, với `failure` hay `skipped` thì thoát khác 0; (4) hai lệnh của job thoát 0 trên bản sao đo của HEAD. Chiều đỏ: bản sao gỡ `source` của một plugin trong `.claude-plugin/marketplace.json` → `plugin_lint.py` thoát khác 0 và nêu tên plugin ấy; bản sao gỡ `vars.plugin_versioning` khỏi `.repo-setup.json` → `plugin_lint.py` thoát khác 0 và nêu «no independent versioning is declared»; bản sao `gate.yml` bỏ `khung` khỏi `needs` → «tests không chờ khung»; bỏ `if` cấp job của `tests` → «tests bị bỏ qua khi khung đỏ»; thêm `if` cho `khung` → «khung mang điều kiện».
- AC-6: Given `.claude/settings.json` của HEAD và bản gốc vòng, When so hai bản dạng JSON, Then `permissions.deny` bằng đúng `["Read(./.env)", "Read(./.env.*)"]`, không mục `deny` nào chặn sửa `.github/workflows`, và mọi khoá khác (`enabledPlugins`, `extraKnownMarketplaces`, `permissions.allow`, `hooks`) bằng sâu bản gốc. Chiều đỏ: bản sao thêm `Edit(./.github/workflows/**)` → nêu «chặn sửa workflow»; bản sao gỡ hook `PostToolUse` → nêu «hooks đổi».
- AC-7: Given cây vòng, When liệt kê tệp vòng đổi so với bản gốc vòng, Then mọi tệp nằm trong danh sách cho phép — `.repo-setup.json`, `Makefile`, `mk/**`, `tools/upgrade_markers.py`, `tools/ledgers.py`, `.gitattributes`, `.github/workflows/gate.yml`, `.claude/settings.json`, `CLAUDE.md`, `_acceptance/nang-repo-setup-0-10-4/**`, `docs/**`, và các view máy sinh `PRODUCT-MAP.md`, `LO-TRINH.html`, `tests/scripts/fixtures/routing-baseline.txt`, `docs/research/known-limits-ledger.tsv` — và không tệp nào dưới `plugins/`. Chiều đỏ: chạy phép đo với một đường ngoài danh sách đưa vào bằng cờ thử (`plugins/acceptance-gate/lib/x.cjs`) → thoát 1 nêu đường ấy.
- AC-8 (judgment): Given mục `## Language` của `CLAUDE.md` và bản luật ngôn ngữ mặt người của kit, When một người đọc như chủ kho, Then mục nói rõ chữ nào viết tiếng Việt (chữ người đọc: tài liệu, hồ sơ, thẻ, thông điệp script, commit, CHANGELOG, mô tả PR), thứ nào giữ nguyên như kho đang dùng (tên tệp, tên script, khoá, định danh, tiền tố commit), và ngôn ngữ trò chuyện; không câu nào trái phần còn lại của `CLAUDE.md` hay bản luật; không câu nào chép đòi «tiếng Anh» của mẫu repo-setup.

## Coverage

- Nguồn trục là đầu ra máy, không phải liệt kê tay: nhóm của `apply.py --dry-run --json` và danh sách mục của `doctor.py`
  (`checklists/top-tier.toml` của 0.10.4). Chân sản phẩm `[SUY-TỪ-REPO: .repo-setup.json]` · chân ngành
  `[NGÀNH: Renovate/Dependabot — nâng phụ thuộc rồi chạy lại bộ kiểm]`.
- Trục A · tệp do khuôn quản × kết cục của bản nâng (tạo | trộn | gỡ | giữ | không ghi | bỏ qua) `[thước CE: mọi tệp mà
  apply.py chạy thử 26/11 liệt kê ở một nhóm]` → AC-1 (cả sáu nhóm), AC-3 (ba tệp sửa tay), AC-7 (không gì ngoài danh sách).
- Trục B · mục doctor (năm mục trượt × đóng | để lại; mười bảy mục đạt × còn đạt) `[thước CE: failed + passed của doctor
  0.10.4]` → AC-2. Mục `plugin_versions` ngoài đề bài: hợp đồng soạn theo lối khuyến nghị «khai độc lập» (câu hỏi ở Cổng
  Phạm vi) — job `khung` (AC-5) không xanh được khi `plugin_lint.py` còn báo lệch số mà khoá vắng.
- Trục C · nơi răng chạy (máy chủ kho | lượt chấm | CI trên PR | CI trên nhánh chính) `[thước CE: ba lối vào của gate.yml —
  pull_request, push, việc gom tests]` → AC-4 (máy), AC-5 (CI, cả PR lẫn đẩy), AC-1/AC-2 (lượt chấm, khai giới hạn).
- Trục D · quyền tác tử (đọc bí mật | sửa workflow | sửa quản trị) `[thước CE: khối deny của khuôn _core/starter]` → AC-6.
- Cross-cutting: chữ luật mới của chủ kho (AC-8); mỗi phép đo mới có chiều đỏ ghim thông điệp và đối chứng dương cùng bản sao.
- Later: đặt `doctor --min-score` vào CI (khuyến nghị cũ của bản ranh giới: chưa) — Out of scope. Never: `/repo-setup:github`.

## Out of scope

- `/repo-setup:github`, `tools/github_setup.py --apply`, mọi cài đặt GitHub (va cứng với luật cấm gộp dồn của kit).
- Đuổi theo 0.10.5 hay nhánh chính của repo-standards — vòng giữ 0.10.4.
- Dựng lại skill `review-change` (đã gỡ, trùng vai làn xét duyệt S4).
- Đổi bậc lên `team`, đổi preset; `doctor --min-score` trong CI.
- Thêm `claude plugin validate .` vào CI (CLI tải qua mạng mỗi lượt; vế tệp khai đã do `plugin_lint.py` đo).
- Sửa kho repo-standards (lời trỏ tên cũ trong README và ca kiểm của nó — điểm nối P6 của bản ranh giới).
- Đổi số bản, `CHANGELOG.md`, thẻ, bản phát hành, cài lên kho tiêu thụ.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của vòng khớp `t3_paths`. Trần lượt gọi người: 3 (Đáng · Phạm vi · Bằng chứng); vòng này mở
  bằng lời gọi tên nên không có Cổng Đáng — dự kiến 2 (Phạm vi · Bằng chứng).
- **Luật chiều rộng (b)** — mốc 3.1.1 được Inventory nhận (commit «pin the delivery-loop kit to v3.1.1», 24/11 14:17Z) và
  crm nhận (PR #623, 25/11). Sau 14:17Z ngày 24/11 chỉ một PR gộp vào `main` của kit: #33 (hạt giống tài liệu). PR #32
  (`doi-soat-ban-giao`) gộp lúc 09:32Z cùng ngày, TRƯỚC khi Inventory nhận. Vòng này là vòng meta duy nhất tới mốc kế.
- **CỘNG hay TRỪ (ADR 0018):** CỘNG — job `khung` + bước gom trong `tests` (AC-5), hai dòng `deny` (AC-6), bốn tệp mới bản
  nâng mang vào và một dòng `.gitattributes` (AC-1), mục `## Language` (AC-8, đồng thời là đổi luật kho). TRỪ — gỡ
  `tools/ci_inputs.py`, `tools/ci_verdict.py`. Nâng bản — `.repo-setup.json`, trộn `Makefile`. Khai `plugin_versioning`
  là một câu hỏi riêng (đổi luật đánh số của kho).
- **Đổi hành vi `make` khai trước:** sau bản nâng, `make test` (và mọi bước của `make check`) chạy trước
  `python3 tools/upgrade_markers.py` và `python3 tools/ledgers.py draw` (in «nothing to draw»), dưới một giây; lệnh bộ
  chạy kiểm của kit giữ nguyên (AC-3). CI của kit không gọi `make`, nên không lượt CI nào đổi vì điều này.
- **Văn bản đề xuất cho mục `## Language`** (thêm vào cuối `CLAUDE.md`):

  ```
  ## Language

  - Chữ người đọc — tài liệu, hồ sơ `_acceptance/`, thẻ cổng, thông điệp của script, commit, `CHANGELOG.md`, mô tả PR —
    viết tiếng Việt, theo bản luật ngôn ngữ mặt người
    (`plugins/acceptance-gate/skills/acceptance/references/human-facing-language.md`) và đúng term của
    [CONTEXT.md](CONTEXT.md).
  - Tên tệp, tên script, khoá cấu hình, định danh trong mã và tiền tố commit (`feat:`, `fix:`…) giữ đúng như kho đang
    dùng — không dịch, không đổi theo mẫu của repo-setup.
  - Trò chuyện với chủ kho: tiếng Việt.
  ```

- **Cân trên mọi kho:** không tệp nào dưới `plugins/` đổi (AC-7), nên gói giao cho kho tiêu thụ giữ nguyên từng byte.
- **Dự báo năm dòng số (luật chiều rộng c):** làm-xong→ký = · ký→gộp = · lượt gọi người = · vòng bị hạ tầng đốt lượt
  chấm = · token máy = · phút máy mỗi lượt chấm = (job `khung` chạy song song, vài giây). Điều kiện tin cậy: đường verdict
  không đổi thành phần — vòng không chạm `plugins/`.
- **Giới hạn khai trước:** AC-1 và AC-2 cần repo-setup 0.10.4 trên máy, nên chỉ chạy ở lượt chấm, không ở CI (răng thường
  trực trong CI là job `khung`). `tools/ledgers.py` vào kho mà không có sổ nào để vẽ; ngưỡng gỡ: lần nâng repo-setup sau mà
  `Makefile` của khuôn thôi đặt `| derived`.
- Phiên nạp gói `feature-loop@delivery-loop` 3.0.0 (bộ đệm cài, phạm vi dự án `~/dev/delivery-loop-main`); kho tự host kit
  nên lệnh của vòng chạy từ cây (`plugins/…` ở 3.1.1). Các gói `@acceptance-gate-kit` bị tắt ở `.claude/settings.local.json`.
- Lệnh riêng của hồ sơ gọi `_acceptance/nang-repo-setup-0-10-4/rang/chay.sh` (khối `LENH-HO-SO`); vòng không thêm khoá vào
  `_acceptance/config.yaml`.
- PR đang mở lúc soạn (26/11): chỉ #21 (nháp, nhánh `chuyen-nha`) — không chạm tệp nào của vòng.
