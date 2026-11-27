# Giám sát đọc bản uỷ quyền (DL6, lát 1) — kế hoạch thi công

> Thực thi inline trong phiên vòng (feature-loop S3, tuần tự). Bước dùng hộp kiểm `- [ ]`.

**Goal:** Gói `dispatch` đọc `governance/delegation.yaml` ở đỉnh nhánh chính, cho giám sát gộp theo quyền và xếp thứ tự
gộp, mỗi lần dùng quyền ghi một dòng `dung-quyen` trước hành động.

**Architecture:** Một mô-đun đọc (`scripts/uy-quyen.mjs`) trả MỘT kết quả cho mọi bên dùng; hai lệnh của quyền (`gop
--theo-quyen` trong `gop.mjs`, `thu-tu-gop` trong `scripts/thu-tu-gop.mjs`) đọc nó ngay lúc dùng; hai bề mặt (thẻ khởi tạo,
bộ đếm) chỉ thêm khoá khi kho có tệp.

**Tech Stack:** Node 24, ESM, `node:test`; không phụ thuộc mới (đọc YAML theo dòng như `cua-proof.mjs`).

**Spec:** `docs/superpowers/specs/2026-11-27-giam-sat-doc-ban-uy-quyen-design.md` · hợp đồng
`_acceptance/giam-sat-doc-ban-uy-quyen/contract.md` · evals `…/evals.yaml` · thước `…/rang/chay.sh`.

## Global Constraints

- Kho không có tệp → `the khoi-tao --json`, `xem`, `xem --json`, `dem --json` bằng từng byte bản `2956dae2`
  (`git archive 2956dae2 plugins/dispatch`, trọn thư mục).
- Lời gọi gộp duy nhất: `gh pr merge <n> --merge --match-head-commit <sha>` qua `bamGop`; không `--auto`.
- Tên ca đúng bảng `rang/chay.sh`; mỗi ca đỏ chạy trên bản sao trọn `plugins/dispatch` đã tiêm, sau đối chứng dương trên
  cùng kho thử, kiểm bước tiêm đã đổi tệp, ghim thông điệp.
- Thông điệp người đọc bằng tiếng Việt; khoá JSON, tên lệnh, tên tệp giữ nguyên.
- Mỗi task: commit ca đỏ TRƯỚC commit vật (chiều đỏ trong lịch sử).

## Review Focus

1. Khoá `merge` do giám sát giữ phải được nhả ở mọi lối sau bước giữ khoá — Task 2 (`UQ-07 nha-khoa`).
2. Kho có remote mà lấy về hỏng, không tệp → im — Task 1 (`UQ-01 lay-ve-hong-khong-tep`) + Task 4 (`UQ-05 lay-ve-hong`).
3. `gop` không cờ không đổi, kể cả PR chạm `.github/workflows/` — Task 4 (`UQ-05 gop-khong-co`).
4. Dòng YAML có chú thích đuôi, phần tử trong nháy, dạng khối có thụt lề khác nhau — Task 1 (`UQ-04 khoan-dung`).
5. `thu-tu-gop` gọi khi không có đơn merge nào → danh sách rỗng là hoán vị của tập rỗng; tên dãy lạ → chặn — Task 3
   (`UQ-09 hoan-vi` hàng «không đơn nào»).

---

### Task 1: Bộ đọc bản uỷ quyền

**Phục vụ:** E1–E4 (AC-1…AC-4) · **independent:** false (Task 2–4 dùng nó)

**Files:** Create `plugins/dispatch/scripts/uy-quyen.mjs` · Create `tests/dieu-phoi/uy-quyen.test.mjs`

**Interfaces — Produces:**
- `export const TEP_UY_QUYEN = 'governance/delegation.yaml'`
- `export const LOAI` — bảng tên → `{ nhom: 'nhan'|'van-hoi'|'sai-cho', cau: string|null }` đúng bảng §4 design doc
  (`thu-tu-gop`, `gop` nhận; `phien`, `chuyen-hang`, `mo-day`, `phan-quyet-chung`, `lo-trinh` vẫn hỏi;
  `muc-ngoai-hop-dong`, `thiet-ke` sai chỗ).
- `export const VUNG_CAM` — tên → mô tả (11 tên ở §5).
- `export function phanTichUyQuyen(text): { ban, tu_lam, vang: string[], loi: string|null }` — chỉ khuôn §3.
- `export function xepUyQuyen(phanTich): { nhan: string[], van_hoi: {loai, cau}[], vang: string[], loi: string|null }`.
- `export function docUyQuyen({ gocKho, nhanhChinh = 'main', io = IO_THAT }): { co, sha, nhanh, nhan, van_hoi, vang, loi }`
  — `io.chay('git', args)` như `gop.mjs`; fetch → rev-parse → show; §3 cho hai nhánh lấy về hỏng.

- [ ] **Step 1:** Viết ca UQ-01 (5 ca), UQ-02 (ma trận + `-do bo-ten`), UQ-03 (ma trận + `-do bo-qua-muc-cam`), UQ-04
  (`khoan-dung` + `-do ban-la-van-nhan`). Kho thử: origin trần + clone, nhánh chính mang tệp; «PR tự thêm» = nhánh `pr` +
  cây làm việc sửa tệp thêm `lo-trinh`, `thu-tu-gop`; «lấy về hỏng» = `git remote set-url origin <đường chết>`. Mutant
  `doc-cay-lam-viec`: bản sao thay `git show <sha>:` bằng đọc tệp ở `gocKho` → ca đỏ nêu «bộ đọc thấy loại do PR thêm:
  thu-tu-gop».
- [ ] **Step 2:** `bash _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh AC-1` → đỏ (chưa có mô-đun). Commit ca.
- [ ] **Step 3:** Viết `uy-quyen.mjs` theo Interfaces.
- [ ] **Step 4:** `chay.sh AC-1` … `AC-4` → «đạt». Commit vật.

### Task 2: Sự kiện dung-quyen + gộp theo quyền

**Phục vụ:** E6, E7, E8 (AC-6, AC-7, AC-8) · **independent:** false

**Files:** Modify `plugins/dispatch/scripts/uy-quyen.mjs` (thêm `ghiDungQuyen`) · Modify `plugins/dispatch/scripts/gop.mjs`
· Modify `plugins/dispatch/scripts/dieu-phoi.mjs` (cờ `--theo-quyen`, `--phien`; dòng dùng lệnh) · Test cùng tệp.

**Interfaces:**
- Produces `export function ghiDungQuyen(thuMuc, { quyen, viec, duong_dao, sha_uy_quyen })` — gọi `ghiSuKien` với
  `loai: 'dung-quyen', can_phan: false`; ném lại lỗi với thông điệp «không ghi được sự kiện dung-quyen — không làm».
- Produces `export const VUNG_CAM_TEP = ['.github/workflows/', 'governance/', 'PRODUCT-INVARIANTS.md']` và
  `tepChamVungCam(tep: string[]): string[]`.
- `gop(cwd, pr, { …, theoQuyen = false, phien = null })` — lối mới theo §7 (bảy bước, khối `finally` nhả khoá chỉ khi
  `chu.json` còn mang phiên giám sát); trả `{ duong, sha, ly_do, da_gop, nha_merge }`, mã thoát qua `maThoatGop`.
- Thông điệp ghim (mỗi bước một): «--theo-quyen đòi --slug <slug> và --phien <mã giám sát>» · «phiên <x> không phải
  giám sát của đợt» · «đợt không cho tự gộp (tu_merge) — quyền gop chỉ dùng khi chủ kho bật ô ấy» · «bản uỷ quyền không
  nhận quyền gop» (kèm `loi` của bộ đọc khi có) · «khoá merge đang do <x> giữ» · «PR chạm vùng cấm: <tệp> — bấm gộp là
  của người».

- [ ] **Step 1:** Ca UQ-06 (`ghi-truoc`: io giả chụp số dòng dung-quyen lúc nhận `pr merge`; `so-hong`: sổ là thư mục;
  `-do bo-ghi`), UQ-06 `monitor` để Task 5 (marker) — ca viết ở đây, đỏ tới Task 5. UQ-07 (`gop`, `ma-tran-thieu` năm hàng,
  `nha-khoa` ba lối, `-do bo-tu-merge`, `-do nha-khoa-ngoai-finally`), UQ-08 (ba PR + đối chứng, `-do bo-vung-cam`).
  Kho thử theo mẫu `tests/dieu-phoi/loi/gop.test.mjs` (`kho`, `ioCua`, `dotTrong`) + `vai.json` + tệp uỷ quyền trên `main`.
- [ ] **Step 2:** `chay.sh AC-7` → đỏ. Commit ca.
- [ ] **Step 3:** Vật theo Interfaces.
- [ ] **Step 4:** `chay.sh AC-6` (trừ `monitor`), `AC-7`, `AC-8` đạt; `node --test tests/dieu-phoi/loi/gop.test.mjs
  tests/dieu-phoi/loi/gop-theo-loi.test.mjs` xanh. Commit vật.

### Task 3: Xếp lại thứ tự gộp

**Phục vụ:** E9 (AC-9) · **independent:** false

**Files:** Create `plugins/dispatch/scripts/thu-tu-gop.mjs` · Modify `lich.mjs` (`xepHang(donXin, hangViec, thuTu = null)`,
`capLuot({ …, thuTu })`) · Modify `phat-lich.mjs` (đọc `thu-tu-gop.json` mỗi nhịp, truyền `thuTu`) · Modify `dieu-phoi.mjs`.

**Interfaces:** `export function thuTuGop(cwd, danhSach: string, { phien, io }): { thu_tu, cu }` — kiểm giám sát, quyền,
hoán vị đúng tập dãy có đơn `merge` (thông điệp: «thiếu dãy <x>» · «thừa dãy <x>» · «trùng dãy <x>»), `ghiDungQuyen` rồi
ghi `thu-tu-gop.json` `{ thu_tu, luc, boi }`. Khoá xếp: đơn `merge` có trong `thu_tu` lấy vị trí làm khoá đầu; đơn ngoài
danh sách và đơn loại khác giữ khoá cũ, đứng sau.

- [ ] **Step 1:** Ca UQ-09 (`hoan-vi` sáu hàng gồm «không phải giám sát»; `cap-theo-thu-tu` bằng một nhịp bộ phát lịch thật
  như `motNhip` của `khung-dinh-vi.test.mjs`; `-do bo-kiem-hoan-vi`). Commit ca (đỏ).
- [ ] **Step 2:** Vật. `chay.sh AC-9` đạt; `node --test tests/dieu-phoi/` các tệp chạm `xepHang` xanh. Commit vật.

### Task 4: Hai bề mặt + chiều im

**Phục vụ:** E5, E10 (AC-5, AC-10) · **independent:** false

**Files:** Modify `the.mjs` (`theKhoiTao`) · Modify `dem.mjs` (`demDot`) · Test cùng tệp.

**Interfaces:** `theKhoiTao` thêm `uy_quyen: { nguon: 'origin/<nhánh>@<sha7>', nhan, van_hoi, vang, loi }` và nối
`'uy-quyen'` vào `may_di_tiep` CHỈ khi `docUyQuyen().co`; `demDot` thêm `dung_quyen: { tong, theo_quyen }` CHỈ khi sổ có
dòng `dung-quyen`.

- [ ] **Step 1:** Ca UQ-05 (`chieu-im`, `khong-remote`, `lay-ve-hong`, `gop-khong-co`, `-do them-khoa`) với bản cũ
  `git archive 2956dae2 plugins/dispatch`; UQ-10 (`the`, `dem` sổ sinh bằng lệnh thật, `xem-co-tep`, `-do hoi-them`).
  Commit ca (đỏ).
- [ ] **Step 2:** Vật. `chay.sh AC-5`, `AC-10` đạt. Commit vật.

### Task 5: Chỉ dẫn của gói + marker Monitor

**Phục vụ:** E11 (AC-11), E6 `UQ-06 monitor` · **independent:** false

**Files:** Modify `plugins/dispatch/commands/open.md` (bước 3 khối uỷ quyền; marker `MONITOR-LOC` quanh lệnh lọc bước 6) ·
`commands/close.md` (bước 5 dòng đếm) · `scripts/mau/LUAT.md` (mục «Quyền của giám sát») · `README.md` (lệnh mới, vùng cấm).
Không đổi lệnh lọc — chỉ bọc marker (bảng chép GATE-END-TURN không đổi số bản).

- [ ] **Step 1:** `chay.sh AC-6` → `UQ-06 monitor` đỏ «không tìm thấy lệnh lọc Monitor». Viết chỉ dẫn + marker.
- [ ] **Step 2:** `chay.sh AC-1`…`AC-10` đạt; bộ kiểm có sẵn chạm chỉ dẫn của gói (`node --test "tests/dieu-phoi/**/*.test.mjs"`
  và `bash tests/scripts/run-tests.sh --manh mjs:2/3` phần ca bản chép lời dặn) xanh. Commit. Hợp đồng → `implemented`.
