# tcg1-ghim-moc-truoc-vong Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** TCG-1 và TCG-1-bat lấy bản trước vòng từ commit cố định `50840764` để nhánh chính và mọi nhánh PR sau xanh mà ca vẫn còn răng.

**Architecture:** Thước trước, vật sau (chiều đỏ nằm trong lịch sử): Task 1 viết răng `rang/do.sh` và commit khi nó còn ĐỎ trên mã cũ; Task 2 sửa `banTruoc()` + thông điệp + ghim của bộ tiêm; Task 3 rà trọn trên cây gộp thử rồi đặt `implemented`.

**Tech Stack:** bash + git + `node --test` (Node 24, `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`).

**Spec:** `docs/superpowers/specs/2026-11-22-tcg1-ghim-moc-truoc-vong-design.md` · hợp đồng `_acceptance/tcg1-ghim-moc-truoc-vong/contract.md` · `evals.yaml`.

## Global Constraints

- Mốc ghim: `50840764d39b317d02eb4d881917bd128d67c86f`, hằng tên `MOC_TRUOC_VONG`.
- Bản ca trước sửa cho chiều đỏ: commit cố định `678572f02f89dff349fc0d78471433cb190e8dcc`.
- Không đổi byte nào ngoài `tests/scripts/tcg-ban-do.test.mjs`, `tests/scripts/tcg-mutants.test.mjs`, `_acceptance/tcg1-ghim-moc-truoc-vong/**`.
- Răng không dùng `git worktree` (chạm ref kho thật), không đọc `origin/main` mà không đặt nó tường minh; mọi đường suy từ vị trí `do.sh`.
- Thông điệp: «khong co commit moc <sha>», «khong phai to tien cua HEAD», «lech byte: khoa <k>, tinh huong <t> (so voi moc ghim <sha> — vong doi dau ra co chu dich thi doi MOC_TRUOC_VONG ve goc cua vong do)».

## Review Focus

- Cây được clone từ một cây có thay đổi chưa commit → răng chấm mã đã commit, không phải cây làm việc: răng in HEAD sha và chạy trên commit; Task 3 chỉ chạy sau commit.
- Sau khi PR gộp, cây gộp thử = đầu nhánh chính: `git merge --no-ff` báo «Already up to date» không được làm răng chết — răng nhận ca HEAD đã là tổ tiên.
- Kho đang kiểm không có `origin/main` (bản sao không remote) → răng dùng `main`, vắng cả hai thì thoát 2 có tên.
- Bản sao nông (`--depth 1`) cần `file://` để git chịu tạo nông.
- Dòng 1 của tệp trỏ trong hạt giống tình cờ chứa chuỗi mốc → đối chứng đỏ của E5 vô hiệu: răng tự kiểm cửa sổ dòng giả không khớp trước khi dùng.

---

### Task 1: Răng `rang/do.sh` (thước, commit khi còn đỏ trên mã cũ)

**Files:** Create `_acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh` · phục vụ E1–E5 · independent: false (Task 2 cần nó).

**Interfaces — Produces:** `bash do.sh <ghim|dot|vang|thong-diep|hat-giong>`; thoát 0 = đạt, 1 = đỏ (dòng `FAIL: <lý do>`), 2 = không chạy được. In mỗi phán quyết một dòng `OK:`/`FAIL:`.

- [ ] **Step 1:** Hàm dựng `cay_pr` (clone, `checkout --detach <HEAD>`, commit rỗng, `update-ref refs/remotes/origin/main <đầu nhánh chính>`) và `cay_gop` (clone, checkout đầu nhánh chính, `merge --no-ff <HEAD>` hoặc bỏ qua khi HEAD đã là tổ tiên, `update-ref origin/main HEAD`); in `cay <tên>: HEAD=<sha> origin/main=<sha>`; ghim hai quan hệ.
- [ ] **Step 2:** Nhóm `ghim`: trong mỗi cây, TCG-1 + TCG-1-bat «ok» và tệp ca khai `MOC_TRUOC_VONG = '<sha ghim>'`; chiều đỏ: chép bản ca ở `678572f0` vào cây làm tệp tạm, chạy — gộp thử phải «not ok TCG-1» + «khong co ban truoc vong», cây PR phải «not ok TCG-1-bat» + «phep so khong thay thay doi cua vong»; đọc `gate.yml`: mọi `actions/checkout` của job `manh` và `tests` có `fetch-depth: 0`.
- [ ] **Step 3:** Nhóm `dot` (18 tên viết trước, `# pass 18`, `# fail 0`), `vang` (ba kho TCG_GIT_GOC: đủ · nông · mồ côi), `thong-diep` (đọc phần tử NHAT `tat-di-nhanh-moi` + chạy ca), `hat-giong` (Gốc, ≥14 ref, cửa sổ ±3, hợp đồng trích tên, chiều đỏ bản sao dời dòng).
- [ ] **Step 4:** Chạy trên mã cũ: `bash _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh ghim` → mong ĐỎ (cây gộp thử TCG-1 not ok); `vang` → ĐỎ; `thong-diep` → ĐỎ; `hat-giong` → XANH; `dot` → ĐỎ ở cây gộp thử.
- [ ] **Step 5:** Commit `test(tcg1-ghim-moc-truoc-vong): răng trước vật — đỏ trên mã cũ`.

### Task 2: Ghim mốc trong `tcg-ban-do.test.mjs` + siết ghim bộ tiêm

**Files:** Modify `tests/scripts/tcg-ban-do.test.mjs:67-105` · Modify `tests/scripts/tcg-mutants.test.mjs` (phần tử NHAT `tat-di-nhanh-moi`) · phục vụ E1–E4 · independent: false.

**Interfaces — Consumes:** `do.sh` của Task 1. **Produces:** hằng `MOC_TRUOC_VONG`; `banTruoc(): {loi} | {sha, pm, scan}`.

- [ ] **Step 1:** `banTruoc()` bỏ dò nhánh + merge-base; kiểm `git cat-file -e <sha>^{commit}` (vắng → `loi: 'khong co commit moc <sha> — kho clone nong? chay git fetch --unshallow'`) và `git merge-base --is-ancestor <sha> HEAD` (không → `loi: 'moc <sha> khong phai to tien cua HEAD'`); chú thích nguồn gốc + đường dời mốc.
- [ ] **Step 2:** Thông điệp «lech byte» theo Global Constraints.
- [ ] **Step 3:** Ghim nhát `tat-di-nhanh-moi` = `'lech byte: khoa vang, tinh huong khop (so voi moc ghim 50840764d39b317d02eb4d881917bd128d67c86f — vong doi dau ra co chu dich thi doi MOC_TRUOC_VONG ve goc cua vong do)'`.
- [ ] **Step 4:** Verify: `node --test tests/scripts/tcg-ban-do.test.mjs` và `node --test tests/scripts/tcg-mutants.test.mjs` thoát 0.
- [ ] **Step 5:** Commit `fix(tests): TCG-1 ghim bản trước vòng vào 50840764 thay merge-base sống`.

### Task 3: Rà trên cây gộp thử, đặt `implemented`

**Files:** Modify `_acceptance/tcg1-ghim-moc-truoc-vong/contract.md` (status) · phục vụ E1–E5 · independent: false.

- [ ] **Step 1:** `for g in ghim dot vang thong-diep hat-giong; do bash _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh $g; done` → cả năm thoát 0.
- [ ] **Step 2:** Đặt `status: implemented`, commit.
