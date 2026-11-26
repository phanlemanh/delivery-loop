# Bằng chứng cũ theo đầu vào — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `pr-san-sang` và `repin-lane --skip-unchanged` trả lời câu «tệp vật nào đổi sau `verified_commit`?» bằng MỘT vị từ JS
khớp luật của lưới trước-gộp (hồ sơ · T1 theo luật `case` bash · `paths` khi kho bật), kèm cờ `--chi-xet` cho bước resume.

**Architecture:** Hàm thuần `vatDoiSauPin` ở `plugins/feature-loop/scripts/lib/vat-doi-sau-pin.mjs` (không đĩa, không git).
Hai bên đọc JS gọi nó; `pre-merge-check.sh` không đổi một byte, phép vi phân bash↔JS (AC-8) giữ vế T1 khớp lưới.

**Tech Stack:** Node 24 ESM (`.mjs`), `node:test`, bash; bộ máy `plugins/acceptance-gate/lib/evidence-core.cjs`.

**Spec:** `docs/superpowers/specs/2026-11-26-bang-chung-cu-theo-dau-vao-design.md` · hợp đồng
`_acceptance/bang-chung-cu-theo-dau-vao/contract.md` (8 AC) · bộ đo `_acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh`.

## Global Constraints

- Tệp được đổi: đúng danh sách AC-7 (pr-san-sang.mjs, repin-lane.mjs, lib/vat-doi-sau-pin.mjs, SKILL feature-loop,
  `tests/workflows/**`, `tests/scripts/**`, `docs/**`, `CHANGELOG.md`, hồ sơ, view máy sinh). `pre-merge-check.sh`,
  `plugins/acceptance-gate/lib/**`, `hooks/**` KHÔNG chạm.
- Tên ca kiểm là hợp đồng với `rang/chay.sh`: đúng từng chữ, đúng số ca mỗi tiền tố (`BC-1` 3 · `BC-2` 4 · `BC-3` 3 ·
  `BC-5` 6 trong tệp kit · `BC-6` 2 · `BC-8` 3 · `BC-4` 2 + `BC-5-ban-goc` 1 trong `rang/ban-goc.test.mjs`). Ca phụ dùng
  tiền tố `VT-` (không khớp mẫu `^BC-n( |-)`).
- Mỗi task: commit ca kiểm (đỏ) TRƯỚC commit vật — chiều đỏ nằm trong lịch sử.
- Không ca nào dựng bản trước vòng từ `git merge-base HEAD origin/main`; bản gốc vòng là sha cố định
  `8817a5bf9e3df3ae4a3e558c37715002bc830c7c`, và chỉ `rang/ban-goc.test.mjs` dùng nó.
- Thông điệp người đọc tiếng Việt; thông điệp cũ của `pr-san-sang` giữ nguyên từng byte (AC-4):
  `pr-san-sang: vật đổi sau lượt chấm (<≤3 tệp, ", ">) — bằng chứng cũ, không mở PR`.
- Lượt đo dài: đã dùng 1/2 (đường nền); S3 chỉ chạy tệp ca liên quan, KHÔNG chạy trọn suite (lượt chấm S4 là lượt 2).
- `export PATH=/opt/homebrew/opt/node@24/bin:$PATH` trước mọi lệnh node.

## Review Focus

1. Tên tệp có dấu hay khoảng trắng — git in trong ngoặc kép khi `core.quotepath` bật: hai bên đọc gọi git với
   `-c core.quotepath=off` → thông điệp in tên thật (ca 8 của AC-3 + VT-4).
2. Glob T1 có `{a,b}` — `case` bash KHÔNG mở ngoặc nhọn, phải khớp chữ (VT-1).
3. Lớp phủ định `[!ab]` / `[^ab]` và `\*` thoát — đúng luật `case` (VT-2).
4. Kho không có `_acceptance/config.yaml` hoặc không khai T1 → không loại T1, không lọc paths, không dòng nào nhắc `paths`
   (AC-4 + VT-3).
5. `verified_commit` không có trong kho (clone nông) → `--chi-xet` thoát 2 «không so được», KHÔNG in «còn mới» (VT-5).

---

### Task 1: Vị từ `vatDoiSauPin` + phép vi phân bash↔JS

**Phục vụ:** E8 · `independent: false` (mọi task sau dùng vị từ)

**Files:**
- Create: `plugins/feature-loop/scripts/lib/vat-doi-sau-pin.mjs`
- Test: `tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs` (tạo; mọi ca BC-/VT- của kit sống ở đây)

**Interfaces:**
- Produces:
  - `khopGlobBash(f: string, g: string): boolean` — `case "$f" in $g)` + biến thể `glob_variants` của `**/`.
  - `staleScopeOf(configText: string|null): 'paths'|'all'` — cùng regex `^[ \t]*stale_scope:[ \t]*([^\s#]+)` repin-lane đang dùng.
  - `vatDoiSauPin({ doi: string[], configText: string|null, evalsText: string|null, prefix?: string, cay?: object|null, core }) → { giu: string[], boHoSo: string[], boT1: string[], loc: null | { apply: boolean, reason: string|null, skipped: string[] } }`
    — `loc` là `null` khi `staleScopeOf(configText) !== 'paths'` hoặc `giu` rỗng trước bước lọc; ngược lại là kết quả
    `core.staleByPaths(giu, evalsText, { prefix, cay })` rút gọn, và `giu` = `kept` khi `apply`.
  - Hằng: dòng duy nhất trong tệp chứa chuỗi `'risk_tiers.t1_skip_globs'` là dòng dựng danh sách T1
    (`const t1 = …core.resolveConfigList(configText, 'risk_tiers.t1_skip_globs')…`) — đột biến BC-3 thay đúng dòng này.
    Dòng duy nhất chứa chú thích `// SAO-CASE` là chỗ dịch `*` thành `.*` — đột biến BC-8 thay `.*` ở dòng này thành `[^/]*`.

- [ ] **Step 1: Viết ca đỏ** — trong tệp ca (đầu tệp: helper `rutHamBash(text)` rút `glob_variants() {`…`^}` và
  `match_globs() {`…`^}` từ `plugins/acceptance-gate/scripts/pre-merge-check.sh` của cây (đường suy từ vị trí tệp ca);
  thiếu một hàm → ném `Error('không rút được match_globs')` / `'không rút được glob_variants'`):
  - `BC-8 vi phân bash↔JS: 42/42 phần tử khớp` — 7 glob (`docs/**`, `gen/*`, `LO-TRINH.html`, `*.md`, `a/**/b.txt`,
    `x?.js`, `src/[ab].ts`) × 6 đường (`docs/x.md`, `gen/a/b.txt`, `LO-TRINH.html`, `src/a.ts`, `a/b.txt`,
    `a/c/d/b.txt`); một lần `bash` nguồn hai hàm rút được, in `1`/`0` cho từng phần tử; `assert.equal(soSanhDuoc, 42)` và
    danh sách lệch rỗng.
  - `BC-8-do bản sao JS không qua / → nêu phần tử lệch` — chép tệp vị từ ra thư mục tạm, thay `.*` ở dòng `// SAO-CASE`
    (assert dòng ấy có đúng một lần và bản sao khác bản gốc), import bản sao, so lại → lệch khác rỗng và chứa
    `gen/* × gen/a/b.txt`.
  - `BC-8-khong-rut bản sao đổi tên hàm bash → không rút được match_globs` — `rutHamBash` trên văn bản đã đổi
    `match_globs()` thành `match_globs_x()` → `assert.throws(…, /không rút được match_globs/)`.
  - `VT-1 ngoặc nhọn khớp chữ như case` (`khopGlobBash('a.js','{a,b}.js') === false`, `('{a,b}.js','{a,b}.js') === true`),
    `VT-2 lớp phủ định và thoát` (`[!ab].ts` khớp `c.ts` không khớp `a.ts`; `[^ab]` như `[!ab]`; `\*.md` chỉ khớp `*.md`),
    `VT-3 không cấu hình → không loại T1, loc null` (`vatDoiSauPin({doi:['LO-TRINH.html'], configText:null, …})` →
    `giu` = `['LO-TRINH.html']`, `loc` null).
- [ ] **Step 2: Chạy, thấy đỏ** — `node --test tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs` → FAIL (không thấy
  module `vat-doi-sau-pin.mjs`).
- [ ] **Step 3: Commit ca đỏ** — `test(bang-chung-cu-theo-dau-vao): ca BC-8 + VT-1..3 cho vị từ vật đổi sau pin (đỏ)`.
- [ ] **Step 4: Viết vị từ.** Bản port `case`: duyệt ký tự — `*`→`.*` (dòng `// SAO-CASE`), `?`→`.`, `[`…`]` thành lớp
  (`!` hay `^` đầu lớp = phủ định; `[` không đóng = chữ), `\x` = chữ `x`, còn lại thoát regex; neo `^…$`. `**/` → mọi biến
  thể giữ/bỏ từng lần xuất hiện (đúng `glob_variants`), khớp nếu bản gốc hay một biến thể khớp. Hồ sơ: đoạn
  `_acceptance` có trong `f.split('/')`. T1 lấy bằng `core.resolveConfigList` (ném/không mảng → `[]`).
- [ ] **Step 5: Chạy, thấy xanh** — cùng lệnh → `# pass 6`, `# fail 0`; rồi `bash _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh AC-8` → `AC-8: đạt — 3 ca`.
- [ ] **Step 6: Commit vật** — `feat(feature-loop): vatDoiSauPin — một vị từ vật đổi sau pin, T1 theo luật case của lưới`.

### Task 2: `pr-san-sang` đọc bằng vị từ, nạp bộ máy, cờ `--chi-xet`

**Phục vụ:** E1, E2, E4, E6 · `independent: false` (cần Task 1)

**Files:**
- Modify: `plugins/feature-loop/scripts/pr-san-sang.mjs` (khối `if (vc) {…}` dòng ~64–73, `prSanSang` chữ ký, CLI cuối tệp)
- Test: `tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs`, `_acceptance/bang-chung-cu-theo-dau-vao/rang/ban-goc.test.mjs` (tạo)

**Interfaces:**
- Consumes: `vatDoiSauPin`, `staleScopeOf` (Task 1).
- Produces:
  - `napCore({ agRoot: string|null, hereDir: string }) → { core: object|null, loi: string|null }` — `agRoot` có
    `lib/evidence-core.cjs` → `createRequire` nạp nó; vắng `agRoot` → `resolve-plugin.mjs --plugin acceptance-gate --require lib/evidence-core.cjs --require lib/eval-yaml.cjs` (cùng thư mục script); hỏng → `core: null` kèm lý do một dòng.
  - `prSanSang({ root, slug, base = null, chay, core = undefined, agRoot = null, chiXet = false, bao = (d) => process.stderr.write(d + '\n') })`
    — `core === undefined` → tự `napCore`; `core === null` sau nạp → `bao('pr-san-sang: không nạp được bộ máy acceptance-gate — giữ luật cũ (<lý do>)')` và lọc bằng luật cũ `!f.startsWith('_acceptance/')`.
  - `chiXet: true` → bỏ hai điều kiện `status`/`verdict`, KHÔNG đẩy, KHÔNG gọi gh; trả `{ moi: boolean, doi: string[], dong }`:
    còn mới → `dong = 'pr-san-sang: bằng chứng còn mới — 0 tệp vật đổi so verified_commit <sha7>'`; cũ → ném
    `Loi(2, 'pr-san-sang: bằng chứng cũ: <mọi tệp, ", ">')`; không có `verified_commit` → `Loi(4, 'pr-san-sang: evidence-report.md chưa ghim verified_commit — khuyên chấm lại')`.
  - Dòng báo khi bật paths: `pr-san-sang: bỏ qua theo paths: <n> tệp — <≤10 tệp, ", ">` · `pr-san-sang: bộ lọc paths không áp (<reason>) — giữ luật cũ`.
  - CLI: thêm `--ag-root <dir>` và cờ trần `--chi-xet`; chế độ chi-xet in `dong` ra stdout (thoát 0) hoặc thông điệp lỗi ra
    stderr với mã của `Loi`. Git diff gọi `git -c core.quotepath=off diff --name-only <vc> HEAD`; cây cho `staleByPaths` từ
    `git ls-files -z` qua `core.dungCayPaths`.

- [ ] **Step 1: Viết ca đỏ** — helper `khoDo({ t1 = null, staleScope = null, evalsPaths = ['src/a.ts'], status = 'verified', doi = {} })`
  trong tệp ca kit: origin trần + bản clone (khuôn `tests/workflows/pr-san-sang.test.mjs`); commit gốc trên `main` có
  `src/a.ts`, `src/b.ts`, `src/bảng.ts`, `docs/x.md`, `LO-TRINH.html`, `gen/a/b.txt`, `pkg/a/_acceptance/s/x.md`, `suite.sh`
  (`exit 0`), `_acceptance/config.yaml` (khoá `executors.script.e1: "sh suite.sh"`, `feature_loop.suite_keys:
  [executors.script.e1]`, `risk_tiers.t1_skip_globs` khi `t1`, `risk_tiers.stale_scope` khi `staleScope`), hồ sơ
  `_acceptance/s/{contract.md, evals.yaml}` (eval `E1` script `cmd: config:executors.script.e1`, `paths` khi `evalsPaths`
  khác null); đẩy `main`; nhánh `vong/s`, commit vật; pin = HEAD; ghi `evidence-report.md` (verdict PASS, `verified_commit`)
  + `run-log.jsonl`; commit; rồi ghi từng tệp của `doi` và commit. Trả `{ k, origin, pin }`. gh giả: hàm `chay` như
  `ghGia` của khuôn. `AG = <gốc kit>/plugins/acceptance-gate`. Ca:
  - `BC-1 chỉ T1 đổi → mở PR` (t1 `["docs/**","LO-TRINH.html"]`, doi `LO-TRINH.html` + `docs/x.md`; nhánh trên origin = HEAD;
    gh `['pr view','pr create','pr view','pr ready']`).
  - `BC-1-do tệp ngoài T1 → thoát 2` (thêm `src/a.ts`; `Loi` mã 2, thông điệp khớp `/vật đổi sau lượt chấm \(src\/a\.ts\)/`
    và không chứa `LO-TRINH.html`/`docs/x.md`; origin không có nhánh; gh 0 lời gọi).
  - `BC-1-doi-chung không khai T1 → LO-TRINH.html vẫn cũ` (t1 null, doi `LO-TRINH.html` → mã 2 nêu `LO-TRINH.html`).
  - `BC-2 ngoài paths khi bật → mở PR` (staleScope paths, doi `src/b.ts`; `bao` nhận đúng dòng
    `pr-san-sang: bỏ qua theo paths: 1 tệp — src/b.ts`).
  - `BC-2-do trong paths → thoát 2` (doi `src/a.ts` → mã 2 nêu `src/a.ts`).
  - `BC-2-khong-ap eval máy thiếu paths → giữ luật cũ` (evalsPaths null, doi `src/b.ts` → mã 2 nêu `src/b.ts`; `bao` nhận
    dòng chứa `eval-may-thieu-paths:`).
  - `BC-2-doi-chung cây bằng pin → không thoát 2` (staleScope paths, doi rỗng).
  - `BC-6 không nạp được bộ máy → giữ luật cũ` (CLI thật qua `spawnSync`, `--ag-root <thư mục tạm rỗng>`, t1 khai
    `LO-TRINH.html`, doi `LO-TRINH.html`, `gh` giả trên PATH ghi lời gọi ra tệp → thoát 2, stderr nêu `LO-TRINH.html` và
    chứa `không nạp được bộ máy acceptance-gate — giữ luật cũ`).
  - `BC-6-doi-chung --ag-root đúng → không thoát 2` (cùng kho, `--ag-root AG` → mã khác 2).
  - `VT-4 tên có dấu in tên thật` (staleScope null, doi `src/bảng.ts`, `chiXet` → mã 2, thông điệp chứa `src/bảng.ts`).
  - `VT-5 pin không có trong kho → không so được` (`verified_commit` đổi thành 40 chữ `f`, `chiXet` → mã 2, thông điệp
    khớp `/không so được verified_commit/`).
  - Tệp `rang/ban-goc.test.mjs`: chép `git show 8817a5bf…:plugins/feature-loop/scripts/pr-san-sang.mjs` ra thư mục tạm (bản
    gốc vòng; không có sha → `t.skip` KHÔNG được — ca phải đỏ với thông điệp «không có bản gốc vòng»); dựng kho bằng helper
    riêng cùng khuôn (chép tối thiểu, không import tệp ca kit). Ca `BC-4 kho không khai → thông điệp bằng bản gốc vòng`
    (không config, doi `src/b.ts`; chạy CLI hai bản, bản mới kèm `--ag-root AG`; cả hai thoát 2; stderr bằng từng byte; không
    dòng nào chứa `paths`) và `BC-4-doi-chung cây bằng pin → cả hai bản không thoát 2`.
- [ ] **Step 2: Chạy, thấy đỏ** — `node --test --test-name-pattern='^(BC-1|BC-2|BC-6|VT-4|VT-5)' tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs`
  → BC-1, BC-2, BC-6, VT-4 đỏ (luật cũ); `node --test _acceptance/bang-chung-cu-theo-dau-vao/rang/ban-goc.test.mjs` → BC-4 đỏ
  hay xanh đều ghi lại (bản mới chưa khác bản gốc ở ca này — BC-4 là ca giữ nguyên, nó xanh từ đầu là đúng).
- [ ] **Step 3: Commit ca đỏ** — `test(bang-chung-cu-theo-dau-vao): ca BC-1/2/4/6 + VT-4/5 cho pr-san-sang (đỏ)`.
- [ ] **Step 4: Sửa `pr-san-sang.mjs`** theo Interfaces; cập nhật khối chú thích đầu tệp (điều kiện «vật đổi» nay theo vị
  từ chung; `--chi-xet`; mã 4).
- [ ] **Step 5: Chạy, thấy xanh** — lệnh Step 2 → 0 đỏ; `node --test tests/workflows/pr-san-sang.test.mjs` → vẫn xanh;
  `bash …/rang/chay.sh AC-1`, `AC-2`, `AC-4`, `AC-6` → mỗi lệnh «đạt».
- [ ] **Step 6: Commit vật** — `fix(feature-loop): pr-san-sang loại T1 và lọc paths bằng vị từ chung; cờ --chi-xet (#10)`.

### Task 3: `repin-lane --skip-unchanged` gọi cùng vị từ + ma trận mười ca

**Phục vụ:** E3 · `independent: false` (cần Task 1, 2)

**Files:**
- Modify: `plugins/feature-loop/scripts/repin-lane.mjs:451-512` (khối `SKIP-UNCHANGED-PREDICATE`), dòng 181 (staleScope),
  dòng 35 (import `globToRe` — bỏ nếu không còn chỗ dùng)
- Test: `tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs`

**Interfaces:**
- Consumes: `vatDoiSauPin`, `staleScopeOf` (Task 1); `khoDo`, CLI `--chi-xet` (Task 2).
- Produces: hành vi `--skip-unchanged` — vế «tệp định nghĩa» xét TRƯỚC, nguyên như cũ; phần còn lại của `doiSlug` qua
  `vatDoiSauPin({ doi, configText, evalsText: s.evalsText, prefix: tienToGit, cay: cayHead(), core })`. Giữ nguyên chữ hai dòng
  stderr hiện có (`--skip-unchanged theo paths: bỏ qua N tệp ngoài phạm vi đo của <slug>` · `--skip-unchanged không lọc theo
  paths (<reason>) — xét theo luật cũ`), dựng từ `loc`. Git diff gọi với `-c core.quotepath=off`. Sửa khối chú thích
  `SKIP-UNCHANGED-PREDICATE`: vị từ sống ở `lib/vat-doi-sau-pin.mjs`, giới hạn lệch glob của ADR 0019 đã đóng.

- [ ] **Step 1: Viết ca đỏ** — bảng mười ca của AC-3 viết NGUYÊN trong tệp ca (đường đổi · khoá · cột `pr-san-sang`
  MỚI/CŨ · cột làn BỎ QUA/CHẠY). Mỗi ca: `khoDo` (status `signed-off`), chạy CLI `pr-san-sang --chi-xet --ag-root AG` (MỚI ⟺
  thoát 0) và `repin-lane --root k --slug s --ag-root AG --allow-dirty --skip-unchanged` (BỎ QUA ⟺ stdout JSON có
  `skipped: true`). Ca:
  - `BC-3 ma trận mười ca` — 20 phán quyết so cột mong đợi; `assert.equal(soPhanQuyet, 20)`; lệch in theo `#ca bên-đọc`.
  - `BC-3-dot-bien bỏ vế T1 → lật cả hai bên đọc` — chép trọn `plugins/feature-loop/scripts/` ra thư mục tạm, thay dòng chứa
    `'risk_tiers.t1_skip_globs'` của bản sao `lib/vat-doi-sau-pin.mjs` bằng `const t1 = [];` (assert thay đúng một dòng), chạy
    hai bên đọc của BẢN SAO trên ca 1 → `pr-san-sang` thoát 2 và làn không `skipped`; đối chứng: bản gốc trên cùng kho → MỚI/BỎ QUA.
  - `BC-3-luoi bốn ca khớp pre-merge-check.sh` — ca 1, 4, 5, 10: `bash <gốc kit>/plugins/acceptance-gate/scripts/pre-merge-check.sh --base main`
    (cwd = kho) → có dòng `VIOLATION [s]: evidence is stale` ⟺ cột `pr-san-sang` là CŨ; assert so được 4/4.
- [ ] **Step 2: Chạy, thấy đỏ** — `node --test --test-name-pattern='^BC-3' tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs`
  → BC-3 đỏ ở ca 10 cột làn (`globToRe` không cho `gen/*` qua `/`) và BC-3-dot-bien đỏ ở bên làn.
- [ ] **Step 3: Commit ca đỏ** — `test(bang-chung-cu-theo-dau-vao): ma trận mười ca BC-3 cho hai bên đọc (đỏ)`.
- [ ] **Step 4: Sửa `repin-lane.mjs`** theo Interfaces.
- [ ] **Step 5: Chạy, thấy xanh** — lệnh Step 2 → `# pass 3`; `node tests/scripts/repin-lane-skip-unchanged.test.mjs`,
  `node tests/scripts/bo-qua-dinh-nghia-phep-do.test.mjs`, `node tests/scripts/routing-baseline-t1.test.mjs` → 0 FAIL;
  `bash …/rang/chay.sh AC-3` → «AC-3: đạt — 3 ca».
- [ ] **Step 6: Commit vật** — `fix(feature-loop): làn ghim lại --skip-unchanged dùng vị từ chung — đóng lệch glob ADR 0019`.

### Task 4: Khối `STALE-GUARD` của SKILL, sổ thay đổi, ADR 0019

**Phục vụ:** E5, E7 · `independent: false` (cần Task 2)

**Files:**
- Modify: `plugins/feature-loop/skills/feature-loop/SKILL.md:71` (đoạn «Staleness guard»)
- Modify: `CHANGELOG.md` (mục chưa phát hành), `docs/adr/0019-*.md` (một đoạn «Đóng 26/11/2026»)
- Test: `tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs`, `_acceptance/bang-chung-cu-theo-dau-vao/rang/ban-goc.test.mjs`

**Interfaces:**
- Consumes: CLI `pr-san-sang --chi-xet` (Task 2).
- Produces: khối marker trong đoạn «Staleness guard»:
  ````
  <!-- <<<STALE-GUARD -->
  ```
  node "$WORKFLOWS_DIR/../scripts/pr-san-sang.mjs" --root . --slug <slug> --chi-xet
  ```
  <!-- STALE-GUARD>>> -->
  ````
  Chữ quanh khối: kit tự host thêm `--ag-root plugins/acceptance-gate`; thoát 0 → trình Gate 2; thoát 2 → báo người, hạ
  `implemented`, vào S4 round delta, danh sách sau «bằng chứng cũ:» là `deltaFiles`; thoát 4 → cảnh báo «evidence chưa pin
  commit, khuyên re-verify», không tự hạ; thoát khác → nói lỗi hạ tầng, xét tay bằng luật cũ. Câu luật chữ cũ («nếu có file
  đổi NGOÀI `_acceptance/` và không khớp …») bị gỡ — lệnh là nguồn duy nhất.

- [ ] **Step 1: Viết ca đỏ** — helper `rutLenhStaleGuard(skillText, { scriptPath, slug, agRoot })`: tìm khối marker (vắng →
  ném `Error('không thấy khối STALE-GUARD')`), lấy dòng bắt đầu `node `, thay `"$WORKFLOWS_DIR/../scripts/pr-san-sang.mjs"`
  bằng `scriptPath`, `<slug>` bằng `slug`, nối `--ag-root agRoot`; chạy bằng `bash -c` với cwd = kho và `gh` giả trên PATH.
  Ca (đọc SKILL của cây):
  - `BC-5 bằng pin → bằng chứng còn mới` (thoát 0, stdout chứa `bằng chứng còn mới`).
  - `BC-5-do đổi src/a.ts → bằng chứng cũ` (thoát 2, đầu ra chứa `bằng chứng cũ:` và `src/a.ts`).
  - `BC-5-t1 chỉ T1 → thoát 0` (t1 `["docs/**"]`, doi `docs/x.md`).
  - `BC-5-khong-day không đẩy, gh 0 lời gọi` (ba ca trên: origin không có `refs/heads/vong/s`, tệp lời gọi gh rỗng).
  - `BC-5-signed-off chạy khi hợp đồng signed-off` (status `signed-off`, bằng pin → thoát 0).
  - `BC-5-thieu-khoi SKILL bỏ khối → không thấy khối STALE-GUARD` (văn bản SKILL đã cắt khối → `assert.throws(…, /không thấy khối STALE-GUARD/)`).
  - `rang/ban-goc.test.mjs`: `BC-5-ban-goc lệnh trên bản gốc vòng → không thoát 0` — lệnh rút từ SKILL của cây, `scriptPath`
    = bản gốc vòng, kho status `signed-off` bằng pin → thoát khác 0, stderr chứa `cần verified`, origin không có nhánh, gh 0 lời gọi.
- [ ] **Step 2: Chạy, thấy đỏ** — `node --test --test-name-pattern='^BC-5' tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs`
  → đỏ «không thấy khối STALE-GUARD» ở mọi ca dựa SKILL.
- [ ] **Step 3: Commit ca đỏ** — `test(bang-chung-cu-theo-dau-vao): ca BC-5 rút lệnh STALE-GUARD từ SKILL (đỏ)`.
- [ ] **Step 4: Sửa SKILL, CHANGELOG, ADR 0019; vẽ lại view** — `node plugins/acceptance-gate/scripts/product-map.mjs --root .`;
  chạy `node tests/scripts/routing-baseline.mjs --write` CHỈ khi `node tests/scripts/routing-baseline-t1.test.mjs` báo baseline lệch.
- [ ] **Step 5: Chạy, thấy xanh** — `node --test tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs` → 0 đỏ;
  `bash …/rang/chay.sh AC-5` → «AC-5: đạt — 7 ca»; `bash …/rang/chay.sh AC-7` → chiều xuôi đạt, chiều đỏ đỏ đúng.
- [ ] **Step 6: Commit vật** — `feat(feature-loop): Staleness guard chạy pr-san-sang --chi-xet thay luật chữ`.

### Task 5: Sàn thiết kế cuối S3, sang `implemented`

**Phục vụ:** E1–E8 · `independent: false`

- [ ] **Step 1:** khối `DESIGN-FLOOR-S3` của SKILL (kit tự host: `--root .` sau `--plugin acceptance-gate`) → kho này M0 thì
  không in gì.
- [ ] **Step 2:** `bash _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh AC-n` cho n = 1…8 → tám dòng «đạt».
- [ ] **Step 3:** hợp đồng `status: implemented`, commit `docs(bang-chung-cu-theo-dau-vao): S3 xong — implemented`; vào S4
  trong cùng lượt.
