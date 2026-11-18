# Kịch bản chuyển nhà — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `node migration/kich-ban/don-nha.mjs` dựng nhánh cục bộ `don-nha/3.0` = `kit-cu/main` + năm commit dọn nhà
tất định, kèm thước đo độc lập và báo cáo lớp ca đỏ cho B2.

**Architecture:** Kịch bản làm việc trong một cây làm việc tạm (git worktree, tách khỏi mọi nhánh) ở thư mục tạm; mỗi
bước là một hàm biến đổi cây rồi commit với tác giả và ngày cố định; ref đích chỉ được ghi ở cuối khi mọi bước qua.
Thước (`kiem-cho.mjs`) là mã RIÊNG — đọc bảng xếp làm dữ liệu nhưng tự cài phép áp luật, không nhập hàm của kịch bản.
Bộ kiểm chạy trên kho fixture do mã sinh, mỗi phép đo có cặp hai chiều.

**Tech Stack:** Node 24 (ESM, `node:test`, không gói ngoài), git ≥ 2.38, python3 ≥ 3.11 (chỉ để chạy `apply.py`,
`doctor.py`), bash cho lượt đo lớp đỏ.

**Spec:** `migration/kich-ban/THIET-KE.md` · hợp đồng `_acceptance/kich-ban-chuyen-nha/contract.md` (duyệt 13/11) ·
evals `_acceptance/kich-ban-chuyen-nha/evals.yaml`.

## Global Constraints

- Mọi lệnh chạy dưới `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- Không ghi vào `main`, `chuyen-nha`, `kit-cu/*`, kho cũ `~/dev/acceptance-gate-kit`, hay thư mục làm việc của kho; chỉ ghi
  ref `refs/heads/<--nhanh>` (mặc định `don-nha/3.0`) và thư mục tạm.
- Tác giả và người commit của năm commit: `delivery-loop don-nha` · `don-nha@delivery-loop.invalid`; ngày = ngày commit của
  mã nguồn (Hỏi-5, chủ kho duyệt).
- Khuôn: thẻ `repo-setup-v0.5.0`, mã `4dc53e079df7d1a71c36147a994bf8d9db4f4f56`; biến `project_name=delivery-loop`,
  `owner=phanlemanh`, `description=Claude Code plugin marketplace for an acceptance-gated feature loop: contracts,
  self-proving evidence, few real human decisions.`, `year`/`today` từ ngày mã nguồn.
- Bảng tên: `migration/chay-thu-phien/bang-ten.json` (chốt ở Cổng Phạm vi, giữ ba tác tử `cham-*`).
- Không vá ngữ nghĩa sản phẩm; không đổi số phiên bản; 22 tệp `chua-ro` đi theo thư mục (Hỏi-4).
- Tên ca trong `don-nha.test.mjs`: `KB-AC<n>…` đúng như `evals.yaml` liệt.
- Đường dẫn trong mọi kịch bản và ca kiểm suy từ `import.meta.url`, không hardcode gốc kho.

## Review Focus

1. Nguồn có tệp mới trong một thư mục sản phẩm → tệp đi theo thư mục (KB-AC2-nguon-moi, Task 1).
2. Cây làm việc tạm bị bỏ lại sau một lần dừng giữa chừng → lần chạy kế vẫn chạy, `git worktree list` không phình (Task 1:
   dọn trong `finally`, ca KB-AC9 chạy ca lành SAU ca đỏ).
3. Luật đổi chữ ăn vào tên script, tên hồ sơ, tên kho tri thức (KB-AC4-ma-tran, Task 2).
4. `apply.py` thật báo xung đột ở năm tệp trùng tên của kit — đó là bình thường, không phải lỗi: chỉ xung đột NGOÀI danh
   sách `trung_duoc_phep` mới dừng (Task 4; ghi một dòng sổ S3 vì đây là cách đọc AC-9c).
5. Tên nhánh đích trùng nhánh đang được check-out ở một cây làm việc khác → từ chối (`git update-ref` không chặn điều đó)
   — Task 1, ca KB-AC2-do dùng chính `chuyen-nha`.

---

### Task 1: Khung kịch bản — bảng xếp, dời sản phẩm, tệp khai (commit 1–2)

**Phục vụ:** E1, E2, E3, E5, E9 (ca thư mục) · **independent:** false (mọi task sau sửa cùng `don-nha.mjs`)

**Files:**
- Create: `migration/kich-ban/bang-xep.json` — thư mục nguồn → đích, tệp lẻ, danh sách «giữ», `bo: []`, tác giả, khuôn, mẫu URL con trỏ, tập tài liệu đổi chữ
- Create: `migration/kich-ban/don-nha.mjs` — CLI + điều phối năm bước
- Create: `migration/kich-ban/fixture.mjs` — dựng kho fixture và kho Repo Standards giả
- Create: `migration/kich-ban/kiem-cho.mjs` — thước AC-3 (Task 2 thêm AC-4, Task 3 thêm AC-7)
- Test: `migration/kich-ban/don-nha.test.mjs`

**Interfaces:**
- Produces: CLI `node don-nha.mjs [--kho <git>] [--nguon <ref>] [--nhanh <tên>] [--bang-xep <tệp>] [--repo-standards <thư mục>]`;
  thoát 0 + dòng cuối stdout `don-nha: <S40> → <commit40> cây <tree40>`; thoát 1 + một dòng stderr `don-nha: <lý do>`;
  thoát 2 sai đối số.
- Produces: `export async function dungKhoFixture(thuMuc: string, tuyChon?: {themThuMucGoc?: string}) → {kho, nguon, rs, bangXep}`;
  `export function themCommit(kho, tep: {[đường]: nội dung}) → sha`.
- Produces: `export function kiemCho({kho, nguon, dich, bangXep, kiemKe}) → {loi: string[], dong: string[]}`; CLI
  `node kiem-cho.mjs --kho --nguon --dich [--bang-xep]` in `dong`, thoát 1 khi `loi` khác rỗng.
- Consumes: `node migration/tra-soat/kiem-ke.mjs --kho <kho> --ref <S> --ra <tạm>` → `<tạm>/kiem-ke.tsv`, `con-tro-ra-ngoai.tsv`.

- [ ] **Step 1: Viết ca đỏ trước** — `KB-AC1`, `KB-AC1-do`, `KB-AC2`, `KB-AC2-do`, `KB-AC2-nguon-moi`, `KB-AC3`,
  `KB-AC3-do-mat`, `KB-AC3-do-hai`, `KB-AC5`, `KB-AC5-do`, `KB-AC9-lanh`, `KB-AC9-thu-muc`. Khẳng định chính:
  - KB-AC1: hai lần chạy vào `a`, `b` → `rev-parse a == rev-parse b`, `a^{tree} == b^{tree}`, mỗi stdout đúng một dòng
    khớp `/^don-nha: [0-9a-f]{40} → [0-9a-f]{40} cây [0-9a-f]{40}$/m`.
  - KB-AC1-do: bản sao `don-nha.mjs` thay kim `GIT_COMMITTER_DATE: ngayNguon` (khẳng định kim khớp đúng 1 lần) → hai lần
    chạy cách 1,1 giây → hàm `soHaiLan(a, b)` trả `«hai lần chạy khác mã commit»`.
  - KB-AC2: `git log --format=%s S..đích` = 5 dòng `dọn nhà k/5: …`; `rev-parse đích~5 == S`; ảnh chụp
    `for-each-ref` (trừ đích) + `rev-parse HEAD` + `status --porcelain` + `worktree list` trước = sau.
  - KB-AC2-do: bản sao ghi lên `refs/heads/chuyen-nha` → so ảnh chụp trả `«ref không phải đích bị đổi: refs/heads/chuyen-nha»`.
  - KB-AC2-nguon-moi: chạy trên S1 → thêm commit S2 có `dieu-phoi/scripts/moi.mjs` → chạy lại cùng nhánh → thoát 0,
    `đích~5 == S2`, `plugins/dispatch/scripts/moi.mjs` có trong cây.
  - KB-AC3: `kiemCho` in `<n>/<n> tệp sản phẩm có đúng một chỗ` với n đếm độc lập trong ca (lớp `san-pham` + `chua-ro`
    của `kiem-ke.tsv` fixture). Hai ca đỏ dựng commit sửa trên cây đích (xoá một tệp / chép thêm bản về đường cũ) rồi gọi
    `kiemCho` → thông điệp ghim của contract.
  - KB-AC5: tệp khai chợ đích: `name: delivery-loop`, mọi `source` = `./plugins/<tên>` có `.claude-plugin/plugin.json`
    cùng `name`, không `source: "./"`. KB-AC5-do: bản sao tệp khai trỏ `./plugins/khong-co` → `«nguồn plugin không có: <tên>»`.
  - KB-AC9-thu-muc: fixture có thư mục gốc `la/` → thoát 1, stderr `«thư mục gốc chưa xếp: la»`, ref đích vắng.
- [ ] **Step 2: Chạy, thấy đỏ** — `node --test migration/kich-ban/don-nha.test.mjs` → FAIL (chưa có `don-nha.mjs`).
  Commit ca đỏ riêng: `kich-ban-chuyen-nha: ca kiểm Task 1 (đỏ)`.
- [ ] **Step 3: `bang-xep.json`** — thư mục: `skills commands hooks scripts lib vendor evals design-floor` →
  `plugins/acceptance-gate/<tên>`; `feature-loop` `diagram-design` → `plugins/<cùng tên>`; `dieu-phoi` `road-map` `tri-thuc`
  → `plugins/dispatch` `plugins/roadmap` `plugins/knowledge`; tệp lẻ `.claude-plugin/plugin.json` →
  `plugins/acceptance-gate/.claude-plugin/plugin.json`; «giữ»: mọi mục gốc còn lại của `0c4e503b`
  (`.claude-plugin/marketplace.json .claude .gitattributes .github .gitignore .nvmrc .out-of-scope CHANGELOG.md CLAUDE.md
  CONTEXT.md GUIDE.md LICENSE LO-TRINH.html NOTICE PRODUCT-MAP.md QUICKSTART.md README.md _acceptance docs tests`).
  Bảng xếp fixture do `dungKhoFixture` sinh cùng khuôn.
- [ ] **Step 4: `don-nha.mjs`** — `chay({kho, nguon, nhanh, bangXep, rs}) → {commit, cay}`: rev-parse nguồn → kiểm thư mục
  gốc (`git ls-tree --name-only S`) ⊆ (thư mục ∪ tệp lẻ cha ∪ giữ) → `git worktree add --detach <tạm> S` → bước 1
  (`git mv` từng thư mục, `mkdir -p plugins/…`) → bước 2 (sửa tệp khai: `name`, `source`, `name` của `plugin.json` ba
  plugin đổi tên theo `bang-ten.json`) → mỗi bước `git commit` với env tác giả/ngày cố định → Task 2–4 chèn bước 3–5 →
  `git update-ref refs/heads/<nhánh> <commit>` CHỈ ở cuối; từ chối nhánh đang check-out ở cây làm việc nào (đọc
  `git worktree list --porcelain`); `finally`: `git worktree remove --force <tạm>`. Bước 3–5 ở Task 1 là commit rỗng giữ
  chỗ (`--allow-empty`) để năm tiêu đề có ngay.
- [ ] **Step 5: `kiem-cho.mjs` phần AC-3** — tự đọc `kiem-ke.tsv` của S, tự tính đích theo bảng xếp (mã riêng), so
  `git ls-tree -r --name-only <đích>`.
- [ ] **Step 6: Chạy, thấy xanh** — `node --test migration/kich-ban/don-nha.test.mjs` → mọi ca Task 1 `ok`.
- [ ] **Step 7: Commit** — `kich-ban-chuyen-nha: khung kịch bản, dời sản phẩm, tệp khai (Task 1)`.

### Task 2: Đổi tên lệnh, skill và chữ có neo (commit 3)

**Phục vụ:** E4, E9 (ca luật) · **independent:** false

**Files:** Modify `migration/kich-ban/don-nha.mjs`, `bang-xep.json`, `kiem-cho.mjs`, `fixture.mjs`, `don-nha.test.mjs`

**Interfaces:**
- Produces: `bang-xep.json → luat: [{ten, mau, thay, tap: "san-pham"|"tai-lieu"}]` (mẫu là regex chuỗi, cờ `g`), sinh thêm
  luật từ `bang-ten.json` lúc chạy: với mỗi `lenh` `a:b → c:d`: mẫu `(?<![\w-])a:b(?![\w-])`; với mỗi `plugin` `p → q`:
  `(?<![\w-])p:(?=[a-z])` → `q:`, `(?<![\w-])p@` → `q@`, `--plugin p(?![\w-])` → `--plugin q`, `"p"` trong tệp khai;
  tên chợ `acceptance-gate-kit(?![\w-])` → `delivery-loop`; skill đổi tên: thư mục `skills/<cũ>` → `skills/<mới>`, dòng
  `^name: <cũ>$` → `name: <mới>`; tệp lệnh `commands/<cũ>.md` → `commands/<mới>.md` theo `lenh`.
- Produces: `ket-qua/doi-chu.tsv` (`luật<TAB>tệp<TAB>số chỗ`) trong thư mục `--ra`.

- [ ] **Step 1: Ca đỏ trước** — `KB-AC4`, `KB-AC4-ma-tran` (mảng viết tay trong tệp kiểm: phải đổi `/dieu-phoi:mo-dot`→
  `/dispatch:open`, `dieu-phoi@acceptance-gate-kit`→`dispatch@delivery-loop`, `--plugin dieu-phoi`→`--plugin dispatch`,
  `acceptance-gate:cat-luot`→`acceptance-gate:scope-slice`, `name: cat-luot`→`name: scope-slice`; phải giữ
  `scripts/cat-luot.mjs`, `lo-trinh-cat-luot`, `dieu-phoi.mjs`, `acceptance-gate-kit-tri-thuc`, «skill \`cat-luot\`»;
  in `10/10`), `KB-AC4-do`, `KB-AC4-do-neo` (bản sao bảng xếp đổi mẫu tên chợ thành `acceptance-gate-kit` không neo →
  `«chuỗi phải giữ bị đổi: acceptance-gate-kit-tri-thuc»`), `KB-AC4-doc-lap` (`kiem-cho.mjs` không có `import` nào
  trỏ `don-nha.mjs`), `KB-AC9-luat` (bảng tên fixture thêm `dieu-phoi:khong-co` → `«luật không khớp chỗ nào: …»`).
  Fixture chứa đủ mười chuỗi. Commit ca đỏ.
- [ ] **Step 2: Bước 3 trong `don-nha.mjs`** — đổi tên tệp/thư mục trước, rồi áp luật lên tập `san-pham` (tệp dưới
  `plugins/`) và tập `tai_lieu_doi_chu` của bảng xếp (`README.md GUIDE.md QUICKSTART.md .claude/settings.json`); luật 0 chỗ
  trên toàn tập → dừng.
- [ ] **Step 3: `kiem-cho.mjs` phần AC-4** — với mỗi tệp đích: lấy bản gốc ở S (đường nguồn suy ngược từ bảng xếp + bảng
  tên), áp luật bằng hàm riêng, so byte với bản đích; tệp không thuộc hai tập → so byte trực tiếp; loại trừ đúng danh sách
  `duoc_cham` của khuôn (Task 4). In `AC-4 đạt: <n> tệp đúng luật, <m> tệp không phải sản phẩm giữ nguyên`, số chỗ mỗi
  luật, và `chuỗi phải giữ: dieu-phoi.mjs a→a · cat-luot.mjs b→b · acceptance-gate-kit-tri-thuc c→c`.
- [ ] **Step 4: Xanh** — `node --test migration/kich-ban/don-nha.test.mjs`. Commit `… đổi tên (Task 2)`.

### Task 3: Con trỏ sang kho cũ (commit 4)

**Phục vụ:** E7 · **independent:** false

**Files:** Modify `don-nha.mjs`, `kiem-cho.mjs`, `fixture.mjs`, `don-nha.test.mjs`

**Interfaces:** Consumes `con-tro-ra-ngoai.tsv` của S (cột `tu toi lop dong mo_ho`; chỉ dòng `mo_ho` rỗng).
Mẫu URL `bang-xep.json → con_tro.url` = `https://github.com/phanlemanh/acceptance-gate-kit/blob/{ma}/{duong}`.

- [ ] **Step 1: Ca đỏ** — `KB-AC7`: con trỏ `docs/x.md` trong một skill fixture thành URL với `{ma}` = S;
  `kiemCho` quét `plugins/**` theo danh sách đường không-phải-sản-phẩm của S → 0 còn treo, in
  `AC-7 đạt: <k> con trỏ đã đổi, 0 còn treo trong plugins/`. `KB-AC7-do`: bản sao kịch bản bỏ bước 4 →
  `«con trỏ còn treo: <tệp> → <đường>»`. Commit ca đỏ.
- [ ] **Step 2: Bước 4** — ở dòng `dong` của tệp đích, thay đúng token đường (`(?<![\w./-])<đường>(?![\w/-])`) bằng URL;
  token không còn ở dòng ấy (dòng đã đổi ở bước 3) → tìm trong cả tệp; không thấy → dừng `«con trỏ không tìm thấy: …»`.
- [ ] **Step 3: Xanh. Commit** `… con trỏ (Task 3)`.

### Task 4: Khuôn Repo Standards (commit 5)

**Phục vụ:** E8, E9 (ca khuôn) · **independent:** false

**Files:** Modify `don-nha.mjs`, `bang-xep.json`, `fixture.mjs` (apply.py giả), `don-nha.test.mjs`

**Interfaces:**
- `bang-xep.json → khuon: {the, ma, vars, trung_duoc_phep: [".claude/settings.json",".nvmrc","CLAUDE.md","LICENSE","README.md"],
  duoc_cham: {them: [".editorconfig","Makefile","tools/plugin_lint.py","tools/bump_version.py",".repo-setup.json"],
  sua: [".gitignore",".gitattributes"], xoa: []}, bo_tep: [".claude/skills/review-change/SKILL.md"],
  make_test: "bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh && bash tests/workflows/run-tests.sh && node --test \"tests/dieu-phoi/**/*.test.mjs\""}`
  (`make_test` chép đúng các lệnh của việc `tests` trong `.github/workflows/gate.yml`).
- apply.py giả (fixture): cùng CLI `--target --preset --level --adopt --json --var k=v`; ghi các tệp `them`, trộn dòng vào
  `.gitignore`; ngày lấy từ `--var today`, không có thì từ biến môi trường `RS_GIA_NGAY`, không có nữa thì đồng hồ; in
  JSON cùng khoá với apply.py thật (`created merged conflict …`). Biến môi trường `RS_GIA_CHAM` (đường tệp) khiến nó sửa thêm
  tệp ấy; `RS_GIA_XUNG_DOT` khiến nó báo xung đột tệp ấy.

- [ ] **Step 1: Ca đỏ** — `KB-AC1-ngay`, `KB-AC1-do-ngay`, `KB-AC8-danh-sach`, `KB-AC8-do` (thêm một commit vào kho RS
  giả → `«khuôn không đúng thẻ repo-setup-v0.5.0»`), `KB-AC8-do-cham` (`RS_GIA_CHAM=CLAUDE.md` →
  `«khuôn chạm tệp ngoài danh sách: CLAUDE.md»`), `KB-AC9-khuon` (`RS_GIA_XUNG_DOT=GUIDE.md` → `«khuôn xung đột: GUIDE.md»`;
  sau đó chạy ca lành, ref giữ đúng mã cũ). Commit ca đỏ.
- [ ] **Step 2: Bước 5** — kiểm `git -C <rs> rev-parse HEAD == khuon.ma`; chạy `python3 <rs>/plugins/repo-setup/scripts/apply.py
  --target <tạm> --preset claude-plugin --level starter --adopt --json --var …` (year/today từ ngày nguồn); xung đột ngoài
  `trung_duoc_phep` → dừng; xoá `bo_tep` và thư mục rỗng; thay công thức đích `test:` của `Makefile` bằng `make_test`;
  `git add -A`; danh sách thêm/sửa/xoá (`git diff --cached --name-status`) phải ⊆ `duoc_cham` → không thì dừng; commit.
- [ ] **Step 3: Xanh. Commit** `… khuôn Repo Standards (Task 4)`. Ghi một dòng sổ `fix` stage S3: xung đột ở năm tệp trùng
  tên là hành vi bình thường của `apply.py --adopt`, AC-9c dừng ở xung đột ngoài danh sách ấy.

### Task 5: Thước trên nguồn thật

**Phục vụ:** E1t, E2t, E3t, E4t, E5t, E6, E7t, E8t · **independent:** false (cần Task 1–4)

**Files:** Create `migration/kich-ban/thuoc-that.mjs`

**Interfaces:** CLI `node thuoc-that.mjs [--phien] [--lop-do]`. Dòng đầu `nguồn: <S40> (kit-cu/main)`. Bản kéo Repo
Standards: `$TMPDIR/delivery-loop-rs-<ma7>` — chưa có thì `git clone --depth 1 --branch repo-setup-v0.5.0`. Chạy kịch bản
hai lần vào `don-nha/thuoc-a`, `don-nha/thuoc-b` (xoá hai ref ấy khi xong), rồi `kiemCho` trên nhánh a. In đúng các dòng
`AC-<n> đạt: …` mà evals liệt; thiếu lệnh `claude` → thoát 2 `«không đọc được ở đây: thiếu lệnh claude»`.
`--phien`: `chay-thu.mjs --ref S --ra <tạm>/cu.json`, `--cay <worktree của nhánh a> --ra <tạm>/moi.json`, `--so … --bang-ten`.
AC-8: đọc `.repo-setup.json`, `make -n test`, `python3 tools/plugin_lint.py` (không có lỗi chứa «source» + «root»),
`python3 <rs>/plugins/repo-setup/scripts/doctor.py --target <cây> --json` → in `doctor: <điểm>/100 · plugin_source_not_root đạt`.

- [ ] **Step 1: Viết `thuoc-that.mjs`** theo giao diện trên.
- [ ] **Step 2: Chạy** `node migration/kich-ban/thuoc-that.mjs` → thoát 0, đủ dòng AC-1…AC-5, AC-7, AC-8;
  `node migration/kich-ban/thuoc-that.mjs --phien` → thoát 0. Đỏ thật (tệp lệch, luật 0 chỗ trên nguồn thật) → sửa
  `bang-xep.json`/kịch bản, ghi dòng sổ `fix`, chạy lại.
- [ ] **Step 3: Phá thử một lần** — đổi tạm `bang-xep.json` bỏ thư mục `evals` khỏi bảng → `thuoc-that` thoát 1 với
  `«thư mục gốc chưa xếp: evals»`; hoàn lại. Commit `… thước nguồn thật (Task 5)`.

### Task 6: Đo lớp đỏ do đổi bố cục

**Phục vụ:** E10, E10j · **independent:** false (cần cây của Task 1–4)

**Files:** Create `migration/kich-ban/do-lop-do.sh`, `migration/kich-ban/phan-lop.py`, `migration/kich-ban/ket-qua/lop-do.md`
(máy sinh); Modify `thuoc-that.mjs` (`--lop-do`)

**Interfaces:** `do-lop-do.sh <thư mục tạm trống>`: dựng hai cây cùng kiểu tên thư mục `<tạm>/A/delivery-loop` (worktree
tách ở S) và `<tạm>/B/delivery-loop` (worktree tách ở đỉnh `don-nha/3.0`), chạy `migration/b0/chay.sh` song song, rồi
`phan-lop.py <tạm>` (dùng `ca_do` của `b0/tach.py` qua import, không chép) → `ket-qua/lop-do.md` với frontmatter
`nguon cay_moi do_luc bo: [scripts, hooks, plugins, workflows, dieu-phoi, ban-do]` và bảng mỗi bộ: đỏ cũ · đỏ mới · đỏ cả hai
· đỏ thêm; lớp dấu hiệu (regex trên dòng mẫu, theo thứ tự): `duong-dan` (`ENOENT|No such file|Cannot find module|not found`)
· `ten-doi` (chứa một tên cũ của `bang-ten.json`) · `lich-su` (`not a valid object name|not a tree object|unknown revision`)
· `bo-chay` (bước thoát khác 0 mà không in ca nào) · `khac`; mỗi lớp số + ≤ 3 dòng mẫu.
`thuoc-that.mjs --lop-do`: kiểm số học của báo cáo (đỏ thêm = đỏ mới − đỏ cả hai; tổng lớp = tổng đỏ thêm) và dựng lại
cây trên `nguon` của báo cáo → so `cay_moi`.

- [ ] **Step 1: Viết hai tệp + nhánh `--lop-do`.**
- [ ] **Step 2: Chạy nền** `bash migration/kich-ban/do-lop-do.sh "$TMPDIR/b1/lop-do"` (60–80 phút) → `ket-qua/lop-do.md`.
- [ ] **Step 3:** `node migration/kich-ban/thuoc-that.mjs --lop-do` → thoát 0. Phá thử: sửa tạm `cay_moi` trong báo cáo →
  thoát 1 `«báo cáo lớp đỏ đo trên cây cũ»`; hoàn lại. Commit `… lớp đỏ do đổi bố cục (Task 6)`.

### Task 7: Hạt giống cho chỗ gãy chéo + sổ

**Phục vụ:** Out of scope OOS-2 (vết, không AC) · **independent:** true (chỉ văn bản), nhưng làm cuối để có danh sách thật

**Files:** Create `migration/hat-giong-goi-cheo-loi-dieu-phoi.md`

- [ ] **Step 1:** Ghi danh sách chỗ lõi gọi thẳng điều phối còn lại trên cây mới (đọc lại `tham-chieu-cheo.tsv` chạy trên
  nhánh đích: kiểu `import-tuong-doi` + `goc-plugin`), nguồn kho cũ cần sửa, đường đúng tầng (`resolve-plugin` hoặc dời tệp
  dùng chung), ngưỡng mở: trước ngày cắt. Commit `… hạt giống gọi chéo (Task 7)`.

Cuối S3: hợp đồng `status: implemented`, rồi dispatch S4.
