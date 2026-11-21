# Tệp chung thôi chặn gộp — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ba tệp mọi PR cùng chạm thôi chặn gộp ở kho tiêu thụ, và P179 thôi đốt lượt chấm ở kho kit (hồ sơ
`_acceptance/tep-chung-khong-chan-gop/`, 11 tiêu chí, Cổng Phạm vi duyệt 22/11: Hỏi-1 lối c).

**Architecture:** Một bộ đọc khoá `ban_do` ở `lib/workspace-record.cjs` (cùng chỗ với bảng nhãn bản đồ); `product-map.mjs`
rẽ nhánh `--check` khi bật và thêm lệnh `--day-nhanh-ve`; bốn khối lệnh vẽ lại hỏi `git check-ignore` thay vì đọc khoá;
luật lệnh hồ sơ là một khối marker chép ba nơi; `s4-args.mjs` thêm một dòng cảnh báo; bộ sinh hàng sổ `tools/so-gioi-han.mjs`
gọi từ móc `PostToolUse` của kho kit.

**Tech Stack:** Node 24 (ESM + CJS), bash, `node:test` + TAP, git (`merge-tree --write-tree`, `hash-object`, `mktree`,
`commit-tree`).

**Spec:** `docs/superpowers/specs/2026-11-21-tep-chung-khong-chan-gop-design.md` · hợp đồng
`_acceptance/tep-chung-khong-chan-gop/contract.md` · eval `_acceptance/tep-chung-khong-chan-gop/evals.yaml`.

## Global Constraints

- Kho không bật (`ban_do` vắng hoặc `ngoai_git: false`): mọi đầu ra của bản đồ, trang, `--check`, bộ quét `/start` bằng
  từng byte bản trước vòng (AC-1).
- Khoá đọc bằng `resolveConfigKey` của `lib/evidence-core.cjs` (bỏ nháy, bỏ chú thích cuối dòng); chỉ `true`/`false` hợp
  lệ; giá trị khác là khoá sai → thoát 2 gọi tên `ban_do.ngoai_git`.
- Nhãn trạng thái mới: `ve-tai-cho` = «hai view vẽ tại chỗ, ngoài git (ban_do.ngoai_git)».
- Lệnh kiểm của chính hồ sơ này: `bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh <TCG-n>`; KHÔNG thêm khoá vào
  `_acceptance/config.yaml`.
- Đường dẫn trong ca suy từ vị trí tệp ca (`TCG_GOC` ghi đè gốc kit cho bản sao của TCG-10), không hardcode.
- Mọi commit của vòng chạm `plugins/` mang dấu «(tep-chung-khong-chan-gop)» trong thông điệp.
- Chạy dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.

## Review Focus

- Khoá viết `ngoai_git: True` (hoa) — người đọc YAML coi là bật; kit coi là khoá sai (thoát 2, có tên) → thêm vào ca
  TCG-5-check cạnh `yes` (ma trận TCG-5-dang giữ đúng sáu hàng như hợp đồng).
- Kho bật nhưng không khai `lo_trinh.tep` — chỉ có `PRODUCT-MAP.md`; `--check` không được đòi `LO-TRINH.html` → ca
  TCG-2d ở Task 2.
- Lệnh đẩy chạy khi origin chưa có nhánh view (lần đầu) → commit mồ côi, đẩy được → ca TCG-11-day dựng origin trống.
- Móc nhận `file_path` tương đối hoặc có `..` → vẫn nhận đúng slug hoặc im, không ghi sổ sai chỗ → ca TCG-9-moc thêm một
  dòng đường tương đối.
- Bộ sinh hàng sổ gặp tiêu đề mục có ký tự tab → tab bị thay bằng dấu cách, không vỡ cột → ca TCG-9-them dùng một tiêu đề
  có tab.

---

### Task 1: Bộ đọc khoá `ban_do` và trạng thái `ve-tai-cho` (lib)

**Phục vụ:** E5 · **independent:** false (Task 2–4 dùng) · **Verify:** `bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-5`

**Files:** Modify `plugins/acceptance-gate/lib/workspace-record.cjs` (cạnh `mapState`, `MAP_LABELS`, `module.exports`) ·
Test `tests/scripts/tcg-ban-do.test.mjs` (tạo) · Create `_acceptance/tep-chung-khong-chan-gop/rang/chay.sh`.

**Interfaces — Produces:**
- `banDo(cfgTxt: string) → { ngoaiGit: boolean, nhanhVe: string|null, loi: string|null }` — `loi` khác null khi
  `ngoai_git` không phải `true`/`false`; khi đó `ngoaiGit = false`.
- `mapState({ exists, tracked, ngoaiGit = false })` → `'ve-tai-cho'` khi `ngoaiGit && !exists`; còn lại như cũ.
- `MAP_LABELS['ve-tai-cho']` như Global Constraints.

- [ ] Step 1: Viết `rang/chay.sh <nhóm>`: bảng nhóm → tệp ca, số ca mong đợi, tên ca; chạy
  `node --test --test-reporter=tap --test-name-pattern="^<nhóm>( |-|$)" <tệp>`, in dòng `ok`/`not ok`/`# pass`/`# fail`,
  đòi `# pass <n>` đúng, `# fail 0`, và dòng `ok … - <tên>` của từng ca. Số `n` theo bảng: TCG-1 2 · TCG-2 5 · TCG-3 4 ·
  TCG-4 3 · TCG-5 5 · TCG-6 2 · TCG-7 2 · TCG-8 4 · TCG-9 6 · TCG-10 16 · TCG-11 6 (cập nhật bảng nếu ca đổi — bảng là ma
  trận viết trước).
- [ ] Step 2: Ca `TCG-5-dang`: sáu dạng (trần `true` · `"true"` · `true  # chú thích` · thụt dưới khối `khac:` · `yes` ·
  vắng) → mong đợi bật · bật · bật · tắt · sai · tắt cho `banDo`; chạy, thấy đỏ (`banDo` chưa có).
- [ ] Step 3: Cài `banDo` (gọi `resolveConfigKey(cfgTxt,'ban_do.ngoai_git')`, `'ban_do.nhanh_ve'`), mở rộng `mapState`,
  thêm nhãn, xuất tên. Chạy lại: xanh.
- [ ] Step 4: Commit `feat: bộ đọc khoá ban_do và trạng thái vẽ tại chỗ (tep-chung-khong-chan-gop)`.

### Task 2: `--check` khi kho bật (AC-2, AC-3, AC-5, AC-11 vế cờ vàng)

**Phục vụ:** E2, E3, E5, E11 · **independent:** false · **Verify:** `chay.sh TCG-2`, `chay.sh TCG-3`

**Files:** Modify `plugins/acceptance-gate/scripts/product-map.mjs` (khối CLI sau `const check = …`) · Test
`tests/scripts/tcg-ban-do.test.mjs`.

**Interfaces — Consumes:** `banDo`, `MAP_LABELS` (Task 1). **Produces:** `kiemNgoaiGit(root, { coTrang: boolean }) →
{ code: 0|1, ra: string[], loi: string[] }` (xuất để Task 3 và ca dùng).

- [ ] Step 1: Bộ dựng kho thử trong ca: `dungKho({ khoa, loTrinh, views: 'commit'|'ignore'|'none' })` — `git init`, chép
  `_acceptance/config.yaml` tối thiểu (khai `PRODUCT-MAP.md`, `LO-TRINH.html` trong `t1_skip_globs`, `lo_trinh.tep` khi
  cần), hai hồ sơ thử (contract `status: approved`/`draft`), vẽ bằng `product-map.mjs` của gốc đang kiểm.
- [ ] Step 2: Ca `TCG-2a` (sửa status, không vẽ lại → thoát 0, đúng một dòng chứa nhãn `ve-tai-cho`, không «lệch», không
  «đã bị xoá») · `TCG-2b` (xoá hai tệp) · `TCG-2c` (vẽ lại) · `TCG-2d` (kho không khai lộ trình) · `TCG-2-doi-chung` (kho
  không bật, thao tác a → thoát 1 «lệch»). Ca `TCG-3-1…4` theo hợp đồng AC-3 (thông điệp chứa
  `git rm --cached -- PRODUCT-MAP.md` · `git rm --cached -- LO-TRINH.html` · dòng `.gitignore` cần thêm · lỗi bộ vẽ bằng
  chuỗi lần chạy kho không bật). Ca `TCG-5-check` (khoá sai `yes` và `True` → thoát 2 chứa «ban_do.ngoai_git»). Chạy: đỏ.
- [ ] Step 3: Cài nhánh: khoá sai → thoát 2 trước khi vẽ; bật → vẽ trong bộ nhớ (lỗi bộ vẽ đi đường cũ), rồi
  `kiemNgoaiGit` (`git ls-files --error-unmatch`, `git check-ignore -q`), in nhãn; không khai `nhanhVe` → thêm một dòng
  cờ vàng chứa «mất nguồn». Kho không bật: đường cũ không đổi một ký tự.
- [ ] Step 4: Chạy `TCG-2`, `TCG-3`: xanh. Commit `feat: kiểm bản đồ khi hai view rời git (tep-chung-khong-chan-gop)`.

### Task 3: Lệnh đẩy nhánh view `--day-nhanh-ve` (AC-11)

**Phục vụ:** E11 · **independent:** false (cần Task 2) · **Verify:** `chay.sh TCG-11`

**Files:** Modify `plugins/acceptance-gate/scripts/product-map.mjs` (bộ đọc cờ: nhận thêm `--day-nhanh-ve`) · Test
`tests/scripts/tcg-ban-do.test.mjs`.

**Interfaces — Produces:** `dayNhanhVe(root) → { code: 0|1|2, ra: string }`.

- [ ] Step 1: Ca `TCG-11-day` (origin trần chưa có nhánh → nhánh mới, `git ls-tree -r` đúng hai tệp, mỗi tệp bằng bản vẽ
  tại chỗ ghi ra thư mục tạm khác; `git rev-parse main` và `git status --porcelain` không đổi) · `TCG-11-lai` (không đổi →
  sha giữ, stdout có «không đẩy») · `TCG-11-doi` · `TCG-11-khoa` (vắng · rỗng · `main`) · `TCG-11-vang` (Task 2 in «mất
  nguồn» khi không khai; khai thì không) · `TCG-11-guide` (khối `BAN-DO-NHANH-VE` của `GUIDE.md` chứa `--day-nhanh-ve`).
  Chạy: đỏ.
- [ ] Step 2: Cài: kiểm khoá (bật, `nhanhVe` khác null và khác nhánh mặc định — `git symbolic-ref --short
  refs/remotes/origin/HEAD` bỏ `origin/`, vắng thì `main`), vẽ trong bộ nhớ, `hash-object -w --stdin` hai tệp, `mktree`,
  so với cây của `origin/<nhánh>` (sau `git fetch origin <nhánh>` khi `ls-remote` thấy nhánh); trùng → in «không đẩy:
  view không đổi», thoát 0; khác → `commit-tree` (cha = đỉnh nhánh view nếu có), `git push origin <sha>:refs/heads/<nhánh>`.
- [ ] Step 3: Thêm khối `BAN-DO-NHANH-VE` và khối `BAN-DO-NGOAI-GIT` (ba bước: hai dòng `.gitignore`, `git rm --cached`
  hai tệp, khoá) vào `GUIDE.md` cạnh khối `GITATTR-TEP-SINH`; khối job: `on: push` nhánh mặc định, `permissions:
  contents: write`, `actions/checkout` với `fetch-depth: 0`, chạy `node <gói>/scripts/product-map.mjs --root .
  --day-nhanh-ve`. Thêm câu cảnh báo bên đọc ngoài kho (crm) vào khối.
- [ ] Step 4: Chạy `TCG-11`: xanh. Commit `feat: đẩy hai view sang nhánh view sau gộp (tep-chung-khong-chan-gop)`.

### Task 4: Bộ quét `/start` và bảng điều phối (AC-5)

**Phục vụ:** E5 · **independent:** false (cần Task 1) · **Verify:** `chay.sh TCG-5`

**Files:** Modify `plugins/acceptance-gate/scripts/start-scan.mjs` (khối `const map = …`), `plugins/dispatch/scripts/nguon-hang.mjs`
(`docNhomKeHoach`) · Test `tests/scripts/tcg-ban-do.test.mjs`.

- [ ] Step 1: Ca `TCG-5-dang` mở rộng sang hai bên còn lại (`--check` thoát 0/2 và bộ quét `map.state`) cho cả bảy dạng ·
  `TCG-5-bat` · `TCG-5-dieu-phoi` (trang vắng, `LO-TRINH.html` bị `.gitignore` bỏ qua → stderr đúng một dòng chứa
  «product-map.mjs»; không bị bỏ qua → stderr rỗng) · `TCG-5-cu`. Chạy: đỏ.
- [ ] Step 2: start-scan truyền `ngoaiGit: banDo(cfgRead.t).ngoaiGit` vào `mapState`. `docNhomKeHoach(gocKho)`: khi đọc
  trang lỗi và `git -C gocKho check-ignore -q LO-TRINH.html` thoát 0 → một dòng stderr gọi tên lệnh vẽ, trả Map rỗng
  (không đọc khoá — gói điều phối không mang bộ đọc thứ tư).
- [ ] Step 3: Chạy `TCG-5`: xanh. Commit `feat: thẻ khởi động và bảng điều phối biết hai view vẽ tại chỗ (tep-chung-khong-chan-gop)`.

### Task 5: Bốn khối lệnh vẽ lại thôi đưa view bị bỏ qua vào commit (AC-4, AC-6)

**Phục vụ:** E4, E6 · **independent:** false · **Verify:** `chay.sh TCG-4`, `chay.sh TCG-6`

**Files:** Modify `plugins/acceptance-gate/commands/approve.md` (khối `MAP-STAGE`), `commands/signoff.md`,
`commands/observed.md`, `skills/uat-session/SKILL.md`; mọi ca đang ghim nguyên văn dòng cũ (`git grep -n 'git add --
PRODUCT-MAP.md' tests`) · Test `tests/scripts/tcg-ban-do.test.mjs`.

- [ ] Step 1: Ca `TCG-4-mot-ban` · `TCG-4-bat` · `TCG-4-tat` · `TCG-6-bat` · `TCG-6-tat` (kho thử có tệp lộ trình; thiếu →
  «tien de»). Chạy: đỏ.
- [ ] Step 2: Đuôi mới của dòng lệnh (thay `&& git add -- PRODUCT-MAP.md && if [ -f LO-TRINH.html ]; then git add --
  LO-TRINH.html; fi`):
  `&& { r=0; for f in PRODUCT-MAP.md LO-TRINH.html; do if [ -f "$f" ] && ! git check-ignore -q -- "$f"; then git add -- "$f" || r=1; fi; done; [ "$r" = 0 ]; }`
  — chép y hệt vào bốn tệp; sửa các ca đang ghim dòng cũ theo vật (ghi dòng sổ `fix`).
- [ ] Step 3: Chạy `TCG-4`, `TCG-6` và các ca đã sửa: xanh. Commit `feat: lệnh cổng không đưa view bị bỏ qua vào commit (tep-chung-khong-chan-gop)`.

### Task 6: Kho không bật không đổi byte (AC-1)

**Phục vụ:** E1 · **independent:** false (sau Task 1–5) · **Verify:** `chay.sh TCG-1`

**Files:** Test `tests/scripts/tcg-ban-do.test.mjs`.

- [ ] Step 1: Ca `TCG-1`: bản trước = `git archive $(git merge-base HEAD origin/main) plugins/acceptance-gate` (vắng
  `origin/main` thì `main`; trùng HEAD → «FAIL: TCG-1 khong co ban truoc vong»); trên kho thử khoá vắng và `false`: ghi,
  `--check` ba tình huống (khớp · lệch · đã xoá), start-scan khoá `map` — so stdout, stderr, mã thoát, tệp vẽ ra từng
  byte. Ca `TCG-1-bat`: kho bật phải khác. Chạy trên cây đã sửa: xanh (bản sau đúng là cây). Commit.

### Task 7: Luật lệnh hồ sơ ở ba nơi + đường đi trọn (AC-7)

**Phục vụ:** E7 · **independent:** true · **Verify:** `chay.sh TCG-7`

**Files:** Modify `plugins/feature-loop/skills/feature-loop/SKILL.md` (S1 bước 4, câu «cmd PHẢI là `config:` ref»),
`plugins/acceptance-gate/skills/acceptance/SKILL.md` (≈ dòng 151, 431), `…/references/eval-executors.md` (≈ dòng 59,
252), `GUIDE.md` (≈ 979, 1571); ca đang ghim câu cũ · Test `tests/scripts/tcg-lenh-ho-so.test.mjs` (tạo).

- [ ] Step 1: Ca `TCG-7-luat` (ba khối `LENH-HO-SO` trùng từng ký tự; không còn câu bắt mọi `cmd` là `config:`) ·
  `TCG-7-duong` (hồ sơ thử với `cmd: bash _acceptance/<slug>/rang/do.sh` → `s4-args.mjs` thoát 0, eval mang đúng lệnh,
  không `ref`; `evaluateEvidence` nhận `verifier:` là đường dẫn ấy; đối chứng `verifier:` trỏ tệp vắng → vi phạm «neither
  config:<key> nor a script path»; `repin-lane.mjs --write` ghi `evals_exit.E1 = 0`). Chạy: đỏ.
- [ ] Step 2: Khối, nguyên văn ở ba nơi:
  `<!-- <<<LENH-HO-SO -->` / «Lệnh dùng chung của kho (suite, build, dev server) → `cmd: config:<khoá>`; lệnh riêng của
  một hồ sơ → `cmd:` là đường dẫn từ gốc kho tới tệp trong `_acceptance/<slug>/` (ví dụ `bash _acceptance/<slug>/rang/chay.sh
  E1`) — KHÔNG thêm khoá vào `_acceptance/config.yaml`.» / `<!-- LENH-HO-SO>>> -->`; viết lại các câu cũ quanh khối cho
  khớp; sửa ca ghim câu cũ (dòng sổ `fix`).
- [ ] Step 3: Chạy `TCG-7` + bộ ca đã sửa: xanh. Commit `docs: luật lệnh hồ sơ — lệnh riêng của hồ sơ về thư mục hồ sơ (tep-chung-khong-chan-gop)`.

### Task 8: Cảnh báo vàng ở `s4-args` (AC-8)

**Phục vụ:** E8 · **independent:** true · **Verify:** `chay.sh TCG-8`

**Files:** Modify `plugins/feature-loop/scripts/s4-args.mjs` (sau khi có `diffBase`) · Test `tests/scripts/tcg-lenh-ho-so.test.mjs`.

**Interfaces — Produces:** `khoaRiengMoi({ root, slug, evals, configText, diffBase, git }) → string[]` (mỗi phần tử một
dòng cảnh báo).

- [ ] Step 1: Ca `TCG-8-1…4` theo AC-8 (kho thử: gốc vòng là commit cũ; hồ sơ khác dùng chung khoá ở hàng 3). Chạy: đỏ.
- [ ] Step 2: Cài: với mỗi eval có `ref`, khoá vắng trong `git show <diffBase>:_acceptance/config.yaml` (tệp vắng ở gốc →
  bỏ cảnh báo) VÀ không hồ sơ nào khác có chuỗi `config:<khoá>` theo sau bởi ký tự không thuộc khoá → một dòng
  `s4-args: cảnh báo: eval <E> dùng config:<khoá> — khoá thêm trong vòng này và chỉ hồ sơ này dùng.` kèm câu của khối
  `LENH-HO-SO` rút từ `../skills/feature-loop/SKILL.md` (vắng khối → chỉ dòng đầu). Ghi stderr, không đổi mã thoát.
- [ ] Step 3: Chạy `TCG-8`: xanh. Commit `feat: s4-args nhắc khi vòng thêm lệnh riêng vào tệp cấu hình chung (tep-chung-khong-chan-gop)`.

### Task 9: Bộ sinh hàng sổ + móc + gợi lệnh của P179 (AC-9)

**Phục vụ:** E9 · **independent:** true · **Verify:** `chay.sh TCG-9`

**Files:** Create `tools/so-gioi-han.mjs` · Modify `.claude/settings.json` (khoá `hooks`), `tests/plugins/run-tests.sh`
(khối P179: dòng `assert not errs`) · Test `tests/scripts/tcg-so-gioi-han.test.mjs` (tạo).

**Interfaces — Produces:** CLI `node tools/so-gioi-han.mjs --slug <s> [--root <r>] [--write]` (in «thêm k hàng» hoặc
«đủ hàng»); `--moc` đọc JSON `PostToolUse` từ stdin. Hàng mới: `<s>#may-<n>\t<s>\t<severity>\tchua-xep\tsong\t\t\t<tiêu đề> [máy sinh từ review-findings.md]`
(`n` nối tiếp số `may-` lớn nhất của hồ sơ; tab trong tiêu đề thay bằng dấu cách).

- [ ] Step 1: Ca `TCG-9-them` · `TCG-9-slug` · `TCG-9-lai` · `TCG-9-rong` · `TCG-9-moc` (matcher rút từ
  `.claude/settings.json` khớp `Write` và `Edit`; đầu vào đường tuyệt đối và một đường tương đối) · `TCG-9-p179` (khối
  P179 rút nguyên văn từ heredoc `P179PY`, chạy `python3 - <gốc tạm>`). Chạy: đỏ.
- [ ] Step 2: Cài bộ sinh; móc chỉ ghi khi `file_path` (tuyệt đối, hoặc ghép với `cwd`) khớp
  `_acceptance/<slug>/review-findings.md` dưới gốc kho; ra JSON `{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"…"}}`
  chỉ khi có hàng mới. Khai móc: `{"matcher":"Write|Edit","hooks":[{"type":"command","command":"node \"$CLAUDE_PROJECT_DIR/tools/so-gioi-han.mjs\" --moc"}]}`.
  P179: lời assert thêm « — chạy: node tools/so-gioi-han.mjs --slug <slug> --write cho hồ sơ vừa thêm mục».
- [ ] Step 3: Chạy `TCG-9` và P179 của bộ kiểm thật: xanh. Commit `fix: máy sinh hàng sổ giới hạn khi lượt chấm ghi mục known-limits (tep-chung-khong-chan-gop)`.

### Task 10: Nhát tiêm hai chiều (AC-10)

**Phục vụ:** E10 · **independent:** false (sau Task 1–9) · **Verify:** `chay.sh TCG-10`

**Files:** Test `tests/scripts/tcg-mutants.test.mjs` (tạo).

- [ ] Step 1: Bản sao trọn `plugins/acceptance-gate/{scripts,lib,commands,skills}`, `plugins/feature-loop/{scripts,skills}`,
  `plugins/dispatch/scripts`, `tools/`, `tests/scripts/tcg-*.test.mjs`, `tests/plugins/run-tests.sh`, `.claude/settings.json`,
  `GUIDE.md` vào thư mục tạm; `TCG-10-M0` chạy các ca đích với `TCG_GOC=<bản sao>`: xanh. Mười hai nhát (tên và ca đích
  theo E10), mỗi nhát thay đúng một chuỗi (đếm khớp = 1, khác → «mui tiem truot»), ca đích phải đỏ; ba nhát im
  (`im-chu-thich`, `im-tai-lieu`, `im-ho-so-rong`) giữ mọi ca đích xanh.
- [ ] Step 2: Chạy `TCG-10`: xanh. Commit `test: nhát tiêm hai chiều cho vòng tep-chung-khong-chan-gop`.

### Task 11: Tài liệu và từ vựng

**Phục vụ:** (đi cùng PR, không phải tiêu chí) · **independent:** true · **Verify:** `bash tests/scripts/run-tests.sh --manh bash`

**Files:** `CONTEXT.md` (mục «Product map»: một câu về `ve-tai-cho` và nhánh view), `CHANGELOG.md` (mục chưa phát hành:
khoá `ban_do.ngoai_git` / `ban_do.nhanh_ve` + cảnh báo bên đọc ngoài kho, chép ý từ Notes của hợp đồng).

- [ ] Step 1: Viết; chạy bộ kiểm từ vựng; commit `docs: từ vựng và nhật ký cho vòng tep-chung-khong-chan-gop`.

## Thứ tự và lượt đo

Task 1 → 2 → 3 → 4 → 5 → 6, rồi 7, 8, 9 (độc lập, chạy nối tiếp trong phiên chính), 10, 11. Trước Task 1: gộp
`origin/main` vào nhánh nếu bản vá chữ ký giữ chỗ đã gộp. S3 KHÔNG chạy trọn bộ kiểm: chỉ các ca `TCG-*` và mảnh bộ kiểm
chứa ca đã sửa. Lượt chấm S4 vòng 1 là lượt đo dài thứ 2/2 được phép không hỏi (lượt 1 là đường nền); vòng 2 trở đi
phải hỏi chủ kho trước.
