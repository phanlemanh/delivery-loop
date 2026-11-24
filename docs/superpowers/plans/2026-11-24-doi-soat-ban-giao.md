# Đối soát bàn giao — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (vòng chạy tuần tự trong phiên chính).

**Goal:** Lúc nối lại sau khi đổi tài khoản, lệnh `tiep-tuc` so bản `ban-giao.json` đang mở với hiện trạng từng dãy, gọi tên
dãy chưa đẩy nhánh, và không trả kế hoạch mở chip khi bị khuyên chờ.

**Architecture:** Một bên đọc mới `plugins/dispatch/scripts/doi-soat.mjs` dựng hiện trạng bằng chính `mucDay` của bên viết và
so theo bảng chiều; `tiepTuc` gọi nó trước `roiBanGiao`. Hàm chỉ đọc `chuaDay` (muc-day.mjs) dùng ở ba chỗ. Không đổi khuôn
`ban-giao.json`.

**Tech Stack:** Node 24 ESM, `node:test`, git thật trong kho thử.

**Spec:** `docs/superpowers/specs/2026-11-24-doi-soat-ban-giao-design.md` · hợp đồng `_acceptance/doi-soat-ban-giao/contract.md`.

## Global Constraints

- Chạy dưới Node 24 (`/opt/homebrew/opt/node@24/bin`).
- Không sửa tệp ca đã ký của gói (`tests/dieu-phoi/*.test.mjs` hiện có); ca mới ở một tệp mới, tên ca `DS-0n …` đúng như bảng
  `CA` của `_acceptance/doi-soat-ban-giao/rang/chay.sh`.
- Không đổi khoá của `ban-giao.json`, `ban-giao/xong/<dãy>.json`, hay `keHoachDay`.
- Chữ cho người không mang đường dẫn tuyệt đối; sha in 7 ký tự; không từ của một kho tiêu thụ.
- Kho thử do mã sinh trong lượt; ngày commit ghim (`GIT_AUTHOR_DATE`/`GIT_COMMITTER_DATE`) để sha tất định; đường suy từ
  vị trí tệp ca.
- Mỗi ca `-do` chạy trên bản sao trọn gói (`fs.cpSync`), kiểm bước tiêm đã đổi tệp, ghim thông điệp.

## Review Focus

- Nhánh chưa từng đẩy (không có `@{u}`) phải tính là CHƯA ĐẨY — ca DS-04 hàng (b).
- Đỉnh lùi sau nhánh theo dõi KHÔNG phải chưa đẩy — ma trận DS-02 hàng (c) đòi `chua_day` rỗng.
- Kho không có remote: không chữ mới ở cả ba chỗ — DS-04 khong-remote.
- Bản bàn giao thiếu trường: không ném, không báo lệch giả — DS-08.
- Đợt chưa từng bàn giao: kết quả y bản gốc vòng — DS-07 (a).

---

### Task 1: Tệp ca (đỏ trước)

**Files:** Create `tests/dieu-phoi/doi-soat-ban-giao.test.mjs`. Phục vụ E1–E8 (trừ E3 hội đồng). independent: false.

- [ ] Khung kho thử chép từ `doi-tai-khoan.test.mjs` (không import tệp đã ký): `khoLienKet`, `khoCoRemote`, `hoSoThu`,
  `giuS4`, `motNhip`, `docB`, `chayCli`, `chayHook`; thêm `dotDoiSoat({ remote, p2: 'xong'|'s4', truocBanGiao })`.
- [ ] Ca theo bảng `CA` của `rang/chay.sh`; ma trận DS-02 12 hàng, DS-04 2 hàng, DS-07 5 tình huống, DS-08 5 hàng; mỗi ma
  trận assert `so_hang_dung === so_hang`.
- [ ] DS-03 sinh `mau-dong.md` từ năm lớp (`DS_GHI_MAU=1` thì ghi tệp), so từng byte.
- [ ] Chạy `bash _acceptance/doi-soat-ban-giao/rang/chay.sh AC-1` → đỏ (thiếu `doi-soat.mjs`). Commit `test(...)`.

### Task 2: Bên đọc + nối vào `tiep-tuc`

**Files:** Create `plugins/dispatch/scripts/doi-soat.mjs`; Modify `muc-day.mjs` (thêm `chuaDay`), `ban-giao.mjs` (export
`shaNhanhChinh`, `docBanGiaoMo`), `tiep-tuc.mjs`. Phục vụ E1, E2, E5, E7, E8.

**Interfaces — Produces:**
- `TRUONG_DOC`, `BO_QUA` (khối marker `BAN-GIAO-TRUONG-DOC`); `kiemKhuon(obj) → string[]` (thông điệp «thiếu trường X» ·
  «trường X không có bên đọc»).
- `doiSoatBanGiao(thuMuc, bg, { hangViec, cfg }) → { ma, khop, so_day, day_khop, lech: [{day, chieu, truoc, sau}], chua_day:
  string[], co_vang: string[], dong: string[] }`.
- `khongBanTruoc(ma) → { ma, khop: true, khong_ban_truoc: true, lech: [], chua_day: [], co_vang: [], dong: [<1 dòng>] }`.
- `chuaDay(worktree) → boolean` — có remote ∧ có đỉnh ∧ (không `@{u}` ∨ đỉnh không là tổ tiên của `@{u}`).
- `tiepTuc` trả thêm `doi_soat` theo bảng 4.2 của thiết kế; `khuyen_cho` ⇒ `ke_hoach: []`.

- [ ] Viết vật; chạy `chay.sh AC-1`, `AC-2`, `AC-5`, `AC-7`, `AC-8` → xanh.

### Task 3: CHƯA ĐẨY ở `ban-giao-xong` và câu `tin`

**Files:** Modify `ban-giao.mjs` (`banGiaoXong` trả thêm `chua_day`, không ghi vào tệp xong; `buocBanGiao` nối câu vào `tin`),
`dieu-phoi.mjs` (dòng in của `ban-giao-xong`). Phục vụ E4.

- [ ] Chạy `chay.sh AC-4` → xanh.

### Task 4: Thân lệnh, README, CONTEXT, mẫu chữ

**Files:** Modify `plugins/dispatch/commands/resume.md` (bước 2: dòng `doi_soat`; `khuyen_cho` DỪNG), `plugins/dispatch/README.md`
mục «Đổi tài khoản», `CONTEXT.md` mục «Bàn giao tài khoản»; sinh `_acceptance/doi-soat-ban-giao/mau-dong.md`
(`DS_GHI_MAU=1`). Phục vụ E3, E3a, E6.

- [ ] Chạy `chay.sh AC-3`, `AC-6` → xanh.

### Task 5: Không vỡ gì

- [ ] `node tests/dieu-phoi/chay-buoc-ci.mjs` (E10) và `chay.sh AC-9` (E9) xanh. Commit vật.
