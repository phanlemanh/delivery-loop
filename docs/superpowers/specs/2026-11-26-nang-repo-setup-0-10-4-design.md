# Nâng repo-setup của kho kit từ 0.5.0 lên 0.10.4 — thiết kế

Hồ sơ: `_acceptance/nang-repo-setup-0-10-4/`. Gốc: đề bài `origin/chuyen-nha:migration/de-bai-nang-repo-setup-kit.md`
(chủ kho gọi tên 26/11/2026: «Mở phiên Thực hiện hạng mục kit 4 nâng repo standards») và ranh giới hai kho
`origin/chuyen-nha:migration/NOI-REPO-STANDARDS.md`.

## Vấn đề

Kho kit tự dựng khung bằng plugin `repo-setup` (kho `phanlemanh/repo-standards`) ở bản 0.5.0, ngày 17/11. Bản phát hành
mới nhất là 0.10.4 (21/11); máy đã cài nó ở mức người dùng. `doctor` của 0.10.4 chấm đỉnh `origin/main` (`87a392cd`,
26/11, chỉ đọc) **82/100**, bậc starter, 17 đạt · 5 trượt · 8 không áp dụng:

| Mục | Trọng số | Vì sao trượt |
|---|---|---|
| `agent_permissions` | 2 | `.claude/settings.json` không có khối `deny` nào nhắc `.env` |
| `plugin_versions` | 2 | sáu plugin không cùng số (`diagram-design` 3.0.0, năm gói kia 3.1.1) mà kho chưa khai bản độc lập |
| `plugin_ci_validates` | 2 | không workflow nào chạy `claude plugin validate`, `plugin_lint.py` hay `make validate` |
| `language_policy` | 1 | `CLAUDE.md` không có mục `## Language` |
| `upgrade_wall` | 1 | `make check` không chạy `tools/upgrade_markers.py` (`mk/upgrade.mk` chưa có) |

Khối Upgrade: `Makefile` đã sửa tại chỗ, `.claude/skills/review-change/SKILL.md` đã gỡ, 0 tệp mang dấu xung đột.
Mục thứ năm, `plugin_versions`, không có ở lần đo 19/11 (bản 0.9.0, đỉnh `36d29038`): nó xuất hiện khi mốc 3.1.1 giữ
`diagram-design` ở 3.0.0 vì thư mục không đổi (AC-4 của `_acceptance/release-3-1-1/`).

## Cách nâng — đường nâng cấp của chính repo-setup

Chạy `apply.py` của 0.10.4 trên cây vòng: `--preset claude-plugin --level starter --adopt --var plugin_versioning=independent`.
Đường ấy (dựng từ 0.7.0) dựng lại tệp mà bản cũ đã viết từ khuôn của bản ghi trong `.repo-setup.json`, so với băm, rồi
trộn ba chiều. Chạy thử trên bản sao `git archive origin/main` (26/11): thoát 0, **không tệp nào mang dấu xung đột**.

| Nhóm của `apply.py` | Tệp | Xử lý của vòng |
|---|---|---|
| tạo | `mk/upgrade.mk`, `tools/upgrade_markers.py` | nhận — tường dấu xung đột, đóng `upgrade_wall` |
| tạo | `mk/derived.mk`, `tools/ledgers.py` | nhận — `Makefile` mới đặt `\| derived` trước mọi bước kiểm trừ `upgrade` (`derived` tự chờ `upgrade`, nên dòng đầu `make -n check` vẫn là `upgrade_markers.py`); gỡ hai tệp này thì `make check` hỏng («No rule to make target derived») trừ khi sửa thêm `Makefile` lệch khuôn |
| tạo | `tools/ci_inputs.py`, `tools/ci_verdict.py` | gỡ ngay sau khi áp — chỉ `ci.yml` của khuôn gọi chúng, mà kho giữ `gate.yml`; bản ghi giữ băm nên lần nâng sau xếp «removed», không tạo lại |
| trộn | `Makefile` | trộn sạch: thêm tầng `check-quick`/`check-heavy`, dòng `\| derived`; đích `test` trỏ bộ chạy kiểm của kit giữ nguyên |
| trộn | `.gitattributes` | thêm một dòng `wiki/log.md merge=union` dưới chú thích «Added by repo-setup»; kho không có `wiki/`, dòng vô hại |
| đã gỡ | `.claude/skills/review-change/SKILL.md` | giữ đã gỡ — bản nâng không tạo lại tệp kho đã xoá |
| giữ, không ghi | `CLAUDE.md`, `.claude/settings.json`, `.nvmrc`, `LICENSE`, `README.md` | kho có trước khuôn — `apply.py` không ghi; hai tệp đầu sửa tay theo dưới |
| giữ | `.claude-plugin/marketplace.json`, `CHANGELOG.md` | tệp của kho — không đổi |
| bỏ qua | `ci.yml` của khuôn, `AGENTS.md` | kho đã có `gate.yml` và `CLAUDE.md` |

`.repo-setup.json` sau khi áp: `version: 0.10.4`, thêm `file_versions` và `vars.plugin_versioning: independent`.

## Đóng năm mục trượt

1. **`upgrade_wall`** — tự đóng khi nhận `mk/upgrade.mk`. Răng thật nằm ở bước CI dưới, vì CI của kit không chạy
   `make check`.
2. **`plugin_versions`** — (câu hỏi ở Cổng Phạm vi, vì đây là luật đánh số của kho) khai `plugin_versioning=independent` trong `vars` của `.repo-setup.json`, đúng nếp kit đã ký ở
   mốc 3.1.1 (gói không đổi thư mục thì giữ số). `plugin_lint.py` cũng đọc khoá ấy.
3. **`plugin_ci_validates`** — thêm job `khung` vào `.github/workflows/gate.yml`: `python3 tools/plugin_lint.py` (tệp khai
   chợ và tệp khai plugin, chỉ thư viện chuẩn) và `python3 tools/upgrade_markers.py`. Job không cần Node. Kiểm bắt buộc
   `tests` chờ `khung` và đỏ khi `khung` không xanh — một bước không điều kiện sự kiện, nên cả PR lẫn đẩy lên nhánh chính
   đều bị chặn. Không chọn `claude plugin validate .`: CLI tải qua `npx` mỗi lượt (mạng, vài phút) và CI của kit không có
   CLI này (ghi ở `tests/dieu-phoi/kiem-validate.mjs`). Bộ đọc `gate.yml` của ca LKN-AC1 đòi ma trận mảnh khớp đúng lượt
   trọn, nên bước mới đứng ở job riêng, không chen vào ma trận.
4. **`agent_permissions`** — thêm `permissions.deny` vào `.claude/settings.json`: `Read(./.env)`, `Read(./.env.*)`.
   Không nhận phần còn lại của khuôn: `Edit(./.github/workflows/**)` (vòng của kit sửa `gate.yml` là việc thường — chính
   vòng này cũng sửa), `Edit(./governance/**)` (kho không có `governance/`), `Read(./secrets/**)` và `Read(./**/*.pem)`
   (kho không có tệp ấy — thêm là CỘNG không người hưởng). Các dòng `.env.local`, `.env.production`… của khuôn đã nằm
   trong `Read(./.env.*)`.
5. **`language_policy`** — thêm mục `## Language` vào cuối `CLAUDE.md`, nội dung theo luật kit đã chốt (chữ người đọc
   tiếng Việt, định danh giữ nguyên), không theo mẫu của khuôn (mẫu đòi commit, CHANGELOG, tên tệp bằng tiếng Anh — trái
   nếp kit). Sửa `CLAUDE.md` là đổi luật kho: chủ kho duyệt ở Cổng Phạm vi.

Dự kiến sau vòng: `doctor` **100/100**, 0 trượt.

## Tệp kit đã sửa tay mà bản nâng chạm

- `Makefile` — trộn (lối duy nhất giữ được cả đích `test` của kit lẫn tầng mới; giữ bản kit thì bản ghi mang băm bản trộn
  trong khi tệp là bản cũ, lần nâng sau trộn lại đúng chỗ ấy).
- `.claude/skills/review-change/SKILL.md` — giữ đã gỡ (bản nâng tự xếp «removed»).
- `CLAUDE.md` — bản nâng không ghi (nhóm «conflict»); vòng chỉ thêm mục `## Language` nếu chủ kho duyệt.

## Cân trên mọi kho

Không tệp nào dưới `plugins/` đổi: gói giao cho kho tiêu thụ giữ nguyên từng byte. Vòng chỉ chạm khung của chính kho
kit — `Makefile`, `mk/`, `tools/`, `.repo-setup.json`, `.gitattributes`, `gate.yml`, `.claude/settings.json`,
`CLAUDE.md`. Kho tiêu thụ nhận repo-setup theo đường riêng của nó (Inventory đã ở 0.10.x), không qua kit.

## Giới hạn khai trước

- Phép đo `doctor` và `apply.py` cần plugin repo-setup 0.10.4 trên máy (bộ đệm người dùng); CI không có plugin ấy, nên
  hai phép đo chỉ chạy ở lượt chấm trên máy. Răng thường trực trong CI là job `khung`.
- `upgrade_markers.py` chỉ soi tệp `.repo-setup.json` liệt kê; dấu xung đột ở tệp khác không phải việc của nó.
- `tools/ledgers.py` (794 dòng) vào kho mà kho không có sổ nào để vẽ (`make derived` in «nothing to draw»). Ngưỡng gỡ:
  một lần nâng repo-setup sau mà `Makefile` của khuôn thôi đặt `| derived`.
