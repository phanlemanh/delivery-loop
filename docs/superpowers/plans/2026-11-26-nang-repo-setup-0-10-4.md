# Nâng repo-setup 0.5.0 → 0.10.4 — kế hoạch thi công

> Thực thi tuần tự trong phiên chính (T2, không Gate 1.5). Bước dùng ô `- [ ]`.

**Mục tiêu:** khung kho kit lên repo-setup 0.10.4 bằng đường nâng của chính nó, đóng năm mục doctor trượt, doctor 100/100.

**Cách làm:** chạy `apply.py` 0.10.4 trên cây vòng, gỡ hai tệp CI khuôn kho không dùng, rồi bốn chỗ sửa tay (job `khung`
trong `gate.yml`, hai dòng cấm đọc `.env`, mục `## Language` cuối `CLAUDE.md`). Mỗi bước đo bằng bộ đo đã viết trước ở
`_acceptance/nang-repo-setup-0-10-4/rang/` — bộ đo đã đỏ đúng trên cây chưa nâng (AC-1…AC-6), nên chiều đỏ có trong lịch sử.

**Công cụ:** Python 3 thư viện chuẩn (repo-setup), YAML của GitHub Actions, JSON.

**Spec:** `docs/superpowers/specs/2026-11-26-nang-repo-setup-0-10-4-design.md` · hợp đồng
`_acceptance/nang-repo-setup-0-10-4/contract.md` (đã duyệt 26/11).

## Ràng buộc chung

- repo-setup đúng **0.10.4** (`~/.claude/plugins/cache/repo-standards/repo-setup/0.10.4`), không 0.10.5.
- Cờ áp: `--preset claude-plugin --level starter --adopt --var plugin_versioning=independent`.
- KHÔNG chạy `/repo-setup:github`, `tools/github_setup.py --apply`; không đổi cài đặt GitHub.
- KHÔNG đụng `plugins/**`, nhánh `chuyen-nha`, `migration/`.
- Node của bộ chạy kiểm: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- Mọi tệp đổi phải nằm trong danh sách AC-7.

## Chỗ dễ vỡ cần soi

1. `apply.py` chạy trên cây có thay đổi chưa commit → bản ghi băm lệch. Áp trên cây sạch, commit ngay.
2. Job `khung` thêm vào `gate.yml` làm lệch bộ đọc của ca LKN-AC1 (`tests/scripts/luot-kiem-nhe.test.mjs`) — chạy lại
   ca ấy ở Task 2.
3. Bước gom của `tests` đọc `needs.khung.result` phải đứng TRƯỚC bước gom `manh` và không mang `if` — kẻo `khung` đỏ mà
   `tests` vẫn xanh.
4. Mục `## Language` chép sai một byte so với Notes → AC-3 đỏ; chép bằng máy từ hợp đồng, không gõ tay.
5. `make test` sau nâng chạy thêm ba bước nhanh (`upgrade_markers.py`, `ledgers.py draw`, `:`) — đã khai ở Notes.

---

### Task 1: Áp bản nâng 0.10.4 và gỡ hai tệp CI khuôn

**Tệp:** `.repo-setup.json`, `Makefile`, `.gitattributes`, tạo `mk/upgrade.mk`, `mk/derived.mk`,
`tools/upgrade_markers.py`, `tools/ledgers.py`; gỡ `tools/ci_inputs.py`, `tools/ci_verdict.py`.
**Phục vụ:** E1, E4 (một phần E2, E3, E7). **independent: false** — mọi task đo chung một cây cho AC-2/AC-7.

- [ ] Cây sạch (`git status --porcelain` rỗng); chạy `python3 <repo-setup 0.10.4>/scripts/apply.py --target . --preset claude-plugin --level starter --adopt --var plugin_versioning=independent`. Kỳ vọng thoát 0, không dấu xung đột.
- [ ] `git rm tools/ci_inputs.py tools/ci_verdict.py`.
- [ ] Đo: `bash _acceptance/nang-repo-setup-0-10-4/rang/chay.sh AC-1` và `… AC-4` → thoát 0.
- [ ] Commit `chore(repo-setup): nâng khung lên 0.10.4, gỡ hai tệp CI khuôn kho không dùng`.

### Task 2: Job `khung` chặn kiểm bắt buộc `tests`

**Tệp:** `.github/workflows/gate.yml`. **Phục vụ:** E5. **independent: false.**

- [ ] Thêm job `khung` (không `if`, `runs-on: ubuntu-latest`, checkout + `python3 tools/plugin_lint.py` +
  `python3 tools/upgrade_markers.py`), chạy ở cả `pull_request` lẫn `push` (lối vào của workflow đã có cả hai).
- [ ] `tests.needs: [manh, khung]`; giữ `if: always()` cấp job; thêm bước ĐẦU TIÊN, không `if`, đặt
  `KET_QUA_KHUNG: ${{ needs.khung.result }}` và thoát ≠ 0 khi khác `success`.
- [ ] Đo: `… chay.sh AC-5` → 0; `node tests/scripts/luot-kiem-nhe.test.mjs` → xanh.
- [ ] Commit `ci(gate): job khung kiểm tệp khai plugin và dấu xung đột, tests đỏ theo nó`.

### Task 3: Cấm tác tử đọc `.env`

**Tệp:** `.claude/settings.json`. **Phục vụ:** E6. **independent: false.**

- [ ] Thêm `permissions.deny: ["Read(./.env)", "Read(./.env.*)"]`, mọi khoá khác giữ nguyên.
- [ ] Đo: `… chay.sh AC-6` → 0. Commit `chore(settings): cấm phiên tác tử đọc .env`.

### Task 4: Mục `## Language` cuối `CLAUDE.md`

**Tệp:** `CLAUDE.md`. **Phục vụ:** E3. **independent: false.**

- [ ] Nối vào cuối `CLAUDE.md` một dòng trống + khối văn bản rút bằng máy từ Notes của hợp đồng (hàm `van_ban_duyet` của
  `rang/do.py`), không gõ tay.
- [ ] Đo: `… chay.sh AC-3` → 0. Commit `docs(claude-md): mục Language theo văn bản chủ kho duyệt`.

### Task 5: Đo trọn và dọn hồ sơ

**Tệp:** chỉ hồ sơ `_acceptance/nang-repo-setup-0-10-4/**`, tệp sinh lại (`PRODUCT-MAP.md`, `LO-TRINH.html`) nếu đổi.
**Phục vụ:** E2, E7 và đối chứng cả bảy.

- [ ] `for a in AC-1 AC-2 AC-3 AC-4 AC-5 AC-6 AC-7; do bash _acceptance/nang-repo-setup-0-10-4/rang/chay.sh $a || echo "ĐỎ $a"; done` → không dòng ĐỎ; doctor 100, 0 trượt.
- [ ] `make -n check | head -1` = `python3 tools/upgrade_markers.py`; `make upgrade` thoát 0.
- [ ] Hợp đồng `status: implemented`; commit; vào S4.
