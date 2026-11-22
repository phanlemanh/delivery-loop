# Đặc tả UX đọc sổ màn — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (Native — vòng T2, phiên chính tự làm tuần tự; các task phụ thuộc giao diện của nhau). Steps use checkbox (`- [ ]`).

**Goal:** Ở kho có `tools/design-assembly/screen-facts.mjs`, kit điền sẵn hai bảng của mục «Đặc tả UX» và kiểm bảng trạng thái so với sổ màn bằng cách GỌI lệnh đọc ấy; kho không có lệnh đọc không đổi một byte.

**Architecture:** Một tệp mới `plugins/acceptance-gate/scripts/so-man.cjs` (CLI `--dien` / `--kiem` + hàm `theCong1` cho thẻ), đọc bản thiết kế bằng ba hàm sẵn có của `lib/` cộng một luật dòng đóng; gọi lệnh đọc bằng `spawnSync` có hạn. `gate-card.js` gọi `theCong1` như đã gọi `ban-do-khuon.cjs#theCong1` và in một khối thông tin. Không chạm `lib/**`, hook, pre-merge.

**Tech Stack:** Node ≥ 20, CommonJS ở `scripts/`, tệp ca `.test.mjs` tự chạy (không framework), bash cho `rang/chay.sh`.

**Spec:** `docs/superpowers/specs/2026-11-22-dac-ta-ux-doc-so-man-design.md` · hợp đồng `_acceptance/dac-ta-ux-doc-so-man/contract.md` · evals `…/evals.yaml`.

## Global Constraints

- Lệnh đọc: `node tools/design-assembly/screen-facts.mjs --json --target <gốc kho> [--screens a,b]`; hạn 10 000 ms, `SO_MAN_HAN_MS` đổi được.
- Mã thoát của `so-man.cjs`: 0 không đỏ (gồm không có lệnh đọc) · 1 có câu đỏ · 2 không kiểm được ở đây.
- Câu ghim: đúng 16 câu ở §3.4 bản thiết kế, mỗi câu một hàm, dùng chung cho lệnh và thẻ.
- Hàng tiêu đề và marker `UX-STATE-TABLE` rút từ `ux-spec-template.md` lúc chạy; khối `UX-SPEC-TEMPLATE` giữ nguyên từng byte.
- Kit không mở `design/screens*`, `design/states.json`; không ghi ở đâu rằng kho «không có lệnh đọc».
- Không tên sản phẩm/kho của chủ kho trong tệp plugin ngoài đường dẫn lệnh đọc đã duyệt.

## Review Focus

1. Bản thiết kế có `## Đặc tả UX` hai lần (chép khuôn hai lượt) → `sectionLines` gộp cả hai; marker đếm được hai cặp → đỏ K5, không chọn bừa. Ca: K5 dùng đúng hình dạng này.
2. Lệnh đọc in cảnh báo ra stderr nhưng thoát 0 → kit chỉ đọc stdout. Ca: lệnh giả B1 ghi một dòng stderr.
3. Ô «Màn» có khoảng trắng thừa hai đầu → trim trước khi so. Ca: H1 có ô «` overdue `».
4. `--man` lặp tên hay có dấu phẩy thừa → khử trùng, bỏ phần rỗng. Ca: D1 gọi `--man a,,b,a`.
5. Thẻ dựng khi `design_doc` trỏ ra ngoài kho (`../x.md`) → thoát 2 có tên, không đọc ngoài gốc. Ca: L4 có vế `../`.

---

### Task 1: Mẫu câu trả lời của lệnh đọc

**Files:** Create `tests/scripts/fixtures/so-man/{goc,khong-bang,mien,khoa-rieng,thoat-1}.json` (bản chép), `…/{thoat-2,khong-json,thieu-screens,states-khong-mang,co-dau,ma-gach-dung,thoat1-unknown-rong,thoat0-co-unknown,ma-la}.json` (biến thể), `…/nguon.json`, `…/sinh-ban-chep.mjs`.

**Interfaces — Produces:** mỗi tệp mẫu là `{ exit: 0|1|2|<lạ>, stdout: <chuỗi> }`; lệnh giả đọc tệp ấy. `nguon.json`: `{ "<tệp>": { loai: "ban-chep", goi, phien_ban, lenh, ngay } | { loai: "bien-the", goc: "<tệp>", khoa: ["screens.0.states", …] } }`.

- [ ] `sinh-ban-chep.mjs --da <thư mục gói thiết kế>` chép `templates/tools/design-assembly/` vào kho `mktemp -d`, viết `design/screens.yaml` (+ `design/states.json` khi cần), chạy lệnh thật, ghi `{exit, stdout}` — năm hình dạng: gốc (màn `overdue`, `don`, `don-hang`, `ho-so`, màn có `route`, trạng thái bắt buộc `loading`,`empty`,`error`), không bảng trạng thái, màn miễn, khoá viết riêng (`keys_not_found`), thoát 1.
- [ ] Biến thể suy từ bản chép bằng phép sửa có khai; F1 kiểm khác biệt đúng các khoá khai.

### Task 2: Tệp ca viết trước — đỏ

**Files:** Create `tests/scripts/so-man.test.mjs`.

**Interfaces — Consumes:** Task 1. **Produces:** `SO_MAN_CASES=K1,H3 node tests/scripts/so-man.test.mjs` chạy ca lọc; chạy không lọc in `số ca chạy: N`, thoát 1 khi N ≠ 64. Mỗi ca một dòng `PASS: <ô>` / `FAIL: <ô> — <lý do>`. Bảng `O_TIEU_CHI` ở đầu tệp: ô → AC.

- [ ] Hằng `MA_TRAN` 64 ô (K1–K11, H1–H13, S1–S10, B1–B11, L1–L10, D1–D9) viết tay, không rút từ vật; ca ngoài ma trận F1, W1–W3 không tính vào 64.
- [ ] Hạ tầng ca: `khoBoDi()` (mktemp, `git init`, chép khuôn), `lenhGia(tep, {ngu})` viết `tools/design-assembly/screen-facts.mjs` giả lọc `--screens` theo hợp đồng lệnh đọc và ghi đối số; `chay(args, env)` → `{code, out, err}`.
- [ ] Mỗi ca âm: đối chứng dương cùng kho xanh trước, rồi ghim nguyên câu §3.4.
- [ ] Chạy: thoát 1 vì `so-man.cjs` chưa có. Commit tệp ca + mẫu TRƯỚC vật.

### Task 3: `so-man.cjs`

**Files:** Create `plugins/acceptance-gate/scripts/so-man.cjs`.

**Interfaces — Produces:**
- `cau` — đối tượng 16 hàm câu (`khongCoMan(M,N,X)`, `khongCoTrangThai(M,T,N,X)`, `thieuBatBuoc(M,T)`, `saiTienTo(X,M,N)`, `khaiHaiLan(X,N,K)`, `rong()`, `thieuCot(C,N)`, `dongLa(N)`, `soO(N,K,H)`, `oTrong(N,C)`, `soMarker(K,H)`, `matNguoiKhongBang()`, `khongDocDuoc(ly)`, `gioiHanMustHave()`, `khoaKhongThay(K,L)`, `khop(N,M)`).
- `docLenhDoc(root, man[]) → { co: false } | { co: true, loi: string } | { co: true, ketQua }`.
- `docBang(designTxt, khuon) → { bang: false } | { bang: true, do: string[], hang: [{no, ma, man}], oKhuon: number }`.
- `kiem({ root, designTxt }) → { code, do: string[], ghi: string[] }`.
- `dien({ root, man }) → { code, khoi: string, ghi: string[] }`.
- `theCong1({ root, slug, contractTxt, designTxt }) → null | { dong: string[] }` (tối đa 5 câu đỏ + một dòng đếm; không ném).
- [ ] Viết theo §3.1–3.5; chạy tệp ca tới «0 failed», «số ca chạy: 64».

### Task 4: Khối thẻ Cổng Phạm vi

**Files:** Modify `plugins/acceptance-gate/scripts/gate-card.js` (cạnh khối `khuonG1`).

- [ ] `soManG1 = require('./so-man.cjs').theCong1(...)` trong `try`; lỗi → `null` cộng một dòng stderr; in `<div class="lab">Bảng trạng thái ↔ sổ màn (thông tin, không cần trả lời)</div>` sau khối «Khuôn». Không vào `--extract`, `routing`, `oneShotG1`.
- [ ] Ca L6–L10 xanh; L7/L8 so từng byte với thẻ do `gate-card.js` ở gốc nhánh dựng.

### Task 5: Nối vào bước thiết kế và khuôn

**Files:** Modify `plugins/feature-loop/skills/feature-loop/SKILL.md` (bước 4 S1), `plugins/acceptance-gate/skills/acceptance/references/ux-spec-template.md` (lời đầu), `GUIDE.md`, `docs/plans/2026-08-24-hat-giong-khop-vong-dac-ta-ux.md`.

- [ ] Khối `<!-- <<<UX-SO-MAN-S1 -->` … `<!-- UX-SO-MAN-S1>>> -->` hai lệnh + nguyên câu lối ra; W1–W3 xanh; `tests/plugins/ux-spec.test.mjs` vẫn 0 lỗi.

### Task 6: Răng hồ sơ và lưới kho

**Files:** Create `_acceptance/dac-ta-ux-doc-so-man/rang/chay.sh`, `…/rang/dot-bien.mjs`.

- [ ] `chay.sh AC-n` chạy các ô của tiêu chí, kiểm `grep -x "PASS: <ô>"` từng ô và «0 failed».
- [ ] `dot-bien.mjs` mười nhát §5 trên bản sao `git archive HEAD plugins/acceptance-gate/scripts plugins/acceptance-gate/lib plugins/acceptance-gate/skills`, bản nguyên vẹn xanh trước, chiều im (chạm `docs/` và hồ sơ) xanh.
- [ ] `make check` xanh; vẽ lại bản đồ và trang lộ trình cùng commit hồ sơ.
