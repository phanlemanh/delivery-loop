# V1 — Đổi tên bản uỷ quyền sang tiếng Anh · Kế hoạch thi công

> **Cho người thi công:** làm tuần tự từng task (`superpowers:executing-plans`); bước dùng ô `- [ ]`.

**Mục tiêu:** bộ đọc `governance/delegation.yaml` đọc khoá và tên quyền tiếng Anh, từ chối cả tệp khi gặp tên cũ (câu lỗi
gọi đúng tên mới), mang nghĩa tiếng Việt cho thẻ và báo cáo; kho không có tệp chạy từng byte như trước vòng.

**Kiến trúc:** một bộ đọc (`plugins/dispatch/scripts/uy-quyen.mjs`) giữ ba bảng — `LOAI` (tên mới, thêm `nghia`),
`VUNG_CAM` (tên mới), `TEN_CU` (tên cũ → tên mới, chỉ để gọi tên). Bên dùng (`gop.mjs`, `thu-tu-gop.mjs`, `the.mjs`,
`dem.mjs`) đổi chuỗi tên quyền và đọc `nghia` từ `LOAI`. Ca kiểm nằm trong `tests/dieu-phoi/uy-quyen.test.mjs`.

**Công nghệ:** Node 24 ESM, `node:test`, bash cho `rang/chay.sh`.

**Spec:** `docs/superpowers/specs/2026-11-28-doi-ten-ban-uy-quyen-design.md` · hợp đồng
`_acceptance/doi-ten-ban-uy-quyen/contract.md` (đã duyệt 28/11).

## Ràng buộc chung

- Bảng tên đúng design doc §3: `ban→version`, `tu_lam→delegated`, `gop→merge`, `thu-tu-gop→merge-order`, `phien→session`,
  `chuyen-hang→reassign-row`, `mo-day→open-lane`, `phan-quyet-chung→shared-ruling`, `lo-trinh→roadmap`,
  `muc-ngoai-hop-dong→out-of-contract`, `thiet-ke→design`; vùng cấm `chu-ky→gate-signoff`, `cat-ban→release`,
  `xoa-nhanh→delete-branch`, `day-kho-khac→push-other-repo`, `cai-dat-github→github-settings`, `workflows` (giữ),
  `governance` (giữ), `luat-san-pham→product-invariants`, `pham-vi-dot→dispatch-scope`, `luat-dot→dispatch-rules`,
  `uy-quyen→delegation`.
- `version` chỉ nhận bản `1`. Câu và nhóm của mỗi loại giữ nguyên chữ của bộ đọc ở `a9b7cbe6`.
- Câu tên cũ: `tên cũ «<cũ>» — bản uỷ quyền nay dùng «<mới>»; cả tệp bị từ chối`; tên cũ của vùng cấm chèn
  ` (vùng cấm cứng, không cấu hình được)` ngay trước `; cả tệp bị từ chối`.
- Thứ tự kiểm phần tử của `delegated`: tên cũ → vùng cấm → danh sách đóng.
- KHÔNG đổi: tên sự kiện (`dung-quyen`), tên tệp script, tên lệnh con (`gop`, `thu-tu-gop`), `thu-tu-gop.json`, loại yêu
  cầu `chuyen-hang` của `LUAT.md`, khoá `tu_merge`, khoá nào trong `_acceptance/config.yaml`, mục `uy-quyen` của
  `may_di_tiep` trên thẻ, định danh JS trong mã (`tuLam`, `ban`…).
- KHÔNG sửa byte nào dưới `_acceptance/giam-sat-doc-ban-uy-quyen/`. Tên ca `UQ-…` giữ nguyên; chỉ nội dung đổi.
- Mọi lệnh chạy với `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.

## Trọng tâm soát

1. Tên cũ viết dạng khối có nháy và chú thích (`  - 'gop'   # x`) vẫn bị từ chối — hàng dạng khối của TA-02 viết đúng
   kiểu ấy.
2. Tệp vừa có tên vùng cấm mới vừa có tên cũ (`[governance, gop]`) → câu lỗi là câu tên cũ (thứ tự kiểm) — hàng thêm
   trong TA-02.
3. Tên vùng cấm giữ nguyên (`workflows`, `governance`) không bị coi là tên cũ — TA-01 bang-ten so `TEN_CU` bằng đúng 20
   cặp, không có hai tên ấy; UQ-03 ma-tran vẫn đòi lỗi vùng cấm cho chúng.
4. Đợt chạy qua lần nâng gói: sổ đã có dòng `dung-quyen` mang `quyen: 'gop'` → `dem --json` đếm nó, không có nghĩa cho
   nó, không ném — kiểm trong TA-07 dem-nghia.
5. Khoá cũ đứng SAU khoá mới (`version: 1\nban: 1\ndelegated: [merge]`) vẫn từ chối cả tệp — hàng thêm trong TA-02.

---

### Task 1: Bộ đọc và hai lệnh của quyền đổi sang tên mới, tên cũ bị gọi tên

Phục vụ E1, E2, E3, E5, E6 · `independent: false` (mọi task chung tệp ca).

**Files:**
- Modify: `plugins/dispatch/scripts/uy-quyen.mjs` (bảng `LOAI`, `VUNG_CAM`, thêm `TEN_CU`; `phanTichUyQuyen`, `xepUyQuyen`)
- Modify: `plugins/dispatch/scripts/gop.mjs:335,356` · `plugins/dispatch/scripts/thu-tu-gop.mjs:34,45`
- Test: `tests/dieu-phoi/uy-quyen.test.mjs`

**Interfaces — Produces:** `export const TEN_CU` (20 cặp, khoá `ban`, `tu_lam` + 9 quyền + 9 vùng cấm); `LOAI`/`VUNG_CAM`
khoá tên mới; hàm test `layBan(sha)` (cache theo sha, `git archive <sha> plugins/dispatch`); hằng test `TEN_CU_MONG`,
`LOAI_MONG` (9 tên mới, theo thứ tự `LOAI`), `CAM_MONG` (11 tên mới); `BAN_TRUOC_VONG = 'a9b7cbe6'`.

- [ ] **Bước 1 — viết ca mới (đỏ trên mã hiện tại), cuối tệp:**
  - `TA-01 bang-ten`: `bangTen(m)` trả danh sách lệch `<BẢNG> lệch bảng: thừa <t>` / `thiếu <t>` cho `LOAI` vs `LOAI_MONG`,
    `VUNG_CAM` vs `CAM_MONG`, `TEN_CU` vs `TEN_CU_MONG` (so cả đích); assert `[]`.
  - `TA-01 vi-phan-truoc-vong`: `viPhan(gocMoi)` nạp `uy-quyen.mjs` của `layBan(BAN_TRUOC_VONG)` và của `gocMoi`; với mỗi
    loại cũ: tệp cũ `ban: 1\ntu_lam: [<cũ>]`, tệp mới `${TEN_CU.ban}: 1\n${TEN_CU.tu_lam}: [${TEN_CU[cũ]}]`; so nhóm và câu
    (cách tính nhóm như `maTranLoai`) → lệch thì `<mới> · nhóm lệch bộ đọc trước vòng` / `<mới> · câu lệch bộ đọc trước vòng`;
    với mỗi vùng cấm cũ: `[gop, <cũ>]` vs `[merge, <TEN_CU[cũ] ?? cũ>]`, so `VUNG_CAM` cũ/mới và lỗi mới chứa `(<mô tả>)` →
    `<mới> · điều chạm lệch bộ đọc trước vòng`. Assert `[]`.
  - `TA-01-do them-ten`: đối chứng dương rồi `banSao` chèn `  extra: { nhom: 'van-hoi', cau: CHUA_LENH },\n` ngay sau
    `export const LOAI = {\n` → `bangTen` chứa `LOAI lệch bảng: thừa extra`.
  - `TA-01-do lech-cau`: `banSao` đổi `session: { nhom: 'van-hoi', cau: 'mở phiên:` thành `… cau: 'Mở phiên:` → `viPhan`
    chứa `session · câu lệch bộ đọc trước vòng`.
  - `TA-02 ma-tran-ten-cu`: `maTranTenCu(gocGoi)` — ma trận viết trước: 18 tên (9 quyền cũ + 9 vùng cấm đã đổi) × hai dạng
    (`version: 1\ndelegated: [merge, <cũ>]` · `version: 1\ndelegated:\n  - merge\n  - '<cũ>'   # ghi chú`), hai khoá
    (`ban: 1\ndelegated: [merge]` · `version: 1\ntu_lam: [merge]`), hàng `version: 1\nban: 1\ndelegated: [merge]` (cặp
    ban), hàng `version: 1\ndelegated: [governance, gop]` (cặp gop) — 41 hàng. Mỗi hàng: tách cặp bằng
    `/tên cũ «([^»]+)» — bản uỷ quyền nay dùng «([^»]+)»/`; không khớp → `<cũ> · thiếu tên mới <mới>`; khớp mà lệch →
    `<cũ> · mong <mới> · nhận <tên tách được>`; `nhan` khác rỗng → `<cũ> · vẫn nhận …`; vùng cấm thiếu `vùng cấm cứng` →
    `<cũ> · thiếu «vùng cấm cứng»`. Đối chứng dương mỗi hàng: thay cũ bằng mới → lỗi không khớp regex tên cũ, ngược lại
    `<mới> · tên mới bị gọi là tên cũ`. Assert số hàng 41 và `[]`.
  - `TA-02 kho-dl6`: `khoUyQuyen({ uyQuyen: 'ban: 1\ntu_lam: [gop]\n' })` → `docUyQuyen`: `co === true`, `nhan` rỗng, `loi`
    chứa `«ban»` và `«version»`.
  - `TA-02-do bo-bang-ten-cu`: `banSao` đổi `export const TEN_CU = {` thành `export const TEN_CU = {}; const TEN_CU_BO = {`
    → chứa `gop · thiếu tên mới merge`.
  - `TA-02-do doi-cheo`: `banSao` đổi `  gop: 'merge',` → `  gop: 'merge-order',` và `  'thu-tu-gop': 'merge-order',` →
    `  'thu-tu-gop': 'merge',` → chứa `gop · mong merge · nhận merge-order`.
- [ ] **Bước 2 — đổi nội dung ca UQ sang tên mới (giữ tên ca):** mặc định `khoUyQuyen` → `version: 1\ndelegated: [merge]\n`;
  `khoGop` → `[merge, merge-order]`; mọi tệp thử, `MA_TRAN_LOAI` (tên mới, câu y nguyên, tên lạ `quyen-la`), `MA_TRAN_CAM`
  (= `CAM_MONG`), thông điệp mong (`quyen !== 'merge'`, `/bản uỷ quyền không nhận quyền merge/`,
  `/không nhận quyền merge-order/`, `tệp có mục cấm governance mà vẫn nhận merge`, `ban 2`→`version: 2` với lỗi `bản 2`,
  lỗi thiếu `delegated`); tiêm UQ-02-do: `  'open-lane': { nhom: 'van-hoi', cau: CHUA_LENH` → `  'open-lane-bo': …`, mong
  `open-lane · mong vẫn hỏi · nhận lỗi đọc · câu «loại lạ: open-lane»`; tiêm UQ-06-do `quyen: 'merge'`; UQ-10 dem so
  `tong` và `theo_quyen` (`{ merge: 2, 'merge-order': 1 }`) riêng, không `deepEqual` cả khối. `layBanCu()` →
  `layBan(BAN_CU)`; `soBonLenh(gocMoi, k, d, sha = BAN_CU)`; `chieuIm(gocMoi, sha = BAN_CU)`.
- [ ] **Bước 3 — chạy, thấy đỏ:** `node --test tests/dieu-phoi/uy-quyen.test.mjs` → TA-01/TA-02 và các UQ đổi nội dung
  FAIL (bộ đọc chưa biết tên mới).
- [ ] **Bước 4 — sửa mã:** `uy-quyen.mjs`: ba bảng theo Ràng buộc chung; parser nhận khoá `version`/`delegated`, khoá cột 0
  là `ban`/`tu_lam` → `return loi(<câu tên cũ>)`; các câu lỗi đổi tên khoá (`version phải là một số`, `delegated phải là
  một danh sách`, `thiếu delegated — không biết quyền nào được giao`, `tệp đời cũ thiếu trường version — đọc như bản 1`);
  `xepUyQuyen` kiểm tên cũ (qua `TEN_CU`, bỏ hai khoá) trước vùng cấm. `gop.mjs`: `includes('merge')`, câu
  `bản uỷ quyền không nhận quyền merge — … 'delegated không có merge' …`, `quyen: 'merge'`. `thu-tu-gop.mjs`: tương tự
  với `merge-order`. Sửa chú thích đầu tệp cho khớp.
- [ ] **Bước 5 — chạy, thấy xanh:** cùng lệnh → mọi ca pass, `# fail 0`.
- [ ] **Bước 6 — commit:** `feat(dispatch): bản uỷ quyền đọc tên tiếng Anh, tên cũ bị từ chối kèm tên mới`.

### Task 2: Chiều im so với đỉnh trước vòng

Phục vụ E4 · `independent: false`.

**Files:** Test: `tests/dieu-phoi/uy-quyen.test.mjs`. **Consumes:** `layBan`, `soBonLenh(…, sha)`, `chieuIm(…, sha)`,
`gopKhongCo` từ Task 1.

- [ ] **Bước 1 — viết ca:** `TA-04 truoc-vong`: `chieuIm(GOI, BAN_TRUOC_VONG)`, kho không remote và kho lấy về hỏng qua
  `soBonLenh(…, BAN_TRUOC_VONG)`, và `gopKhongCo(layBan(BAN_TRUOC_VONG)) === gopKhongCo(GOI)` — mọi danh sách lệch rỗng.
  `TA-04-do them-khoa`: đối chứng dương, rồi tiêm như UQ-05-do (`uy_quyen: null` vào thẻ) → `chieuIm(sao, BAN_TRUOC_VONG)`
  chứa `the khoi-tao --json lệch`.
- [ ] **Bước 2 — chạy:** `node --test --test-name-pattern='^TA-04' tests/dieu-phoi/uy-quyen.test.mjs` → pass (ca chiều im
  xanh ngay vì Task 1 không đổi đường không-tệp; ca đỏ tự chứng chiều đỏ). Phá thử: tạm sửa `the.mjs` thêm một khoá rỗng →
  `TA-04 truoc-vong` đỏ, hoàn lại.
- [ ] **Bước 3 — commit:** `test(dispatch): chiều im của bản uỷ quyền so với đỉnh trước vòng`.

### Task 3: Nghĩa tiếng Việt trên thẻ khởi tạo và báo cáo đợt

Phục vụ E7 · `independent: false`.

**Files:** Modify `plugins/dispatch/scripts/uy-quyen.mjs` (thêm `nghia` vào từng mục `LOAI`), `the.mjs:100-102`,
`dem.mjs:43-49`; Test `tests/dieu-phoi/uy-quyen.test.mjs`.

**Interfaces — Produces:** `LOAI[t].nghia: string`; thẻ `uy_quyen.nghia: { [tên]: nghĩa }` cho mọi tên trong `nhan` và
`van_hoi`; `dem --json` `dung_quyen.nghia: { [tên]: nghĩa }` cho tên trong `theo_quyen` có trong `LOAI`.

- [ ] **Bước 1 — viết ca (đỏ):**
  - `TA-07 the-nghia`: kho có `version: 1\ndelegated: [<9 tên LOAI_MONG>]`; `kiemNghia(gocGoi)` trả lệch:
    `thẻ thiếu nghĩa tiếng Việt: <t>`, `thẻ thừa nghĩa: <t>`, `<t> · nghĩa không có chữ tiếng Việt có dấu` (regex chữ có
    dấu + `đ`), `<t> · nghĩa chứa tên tiếng Anh`; và `hoi` bằng `hoi` của kho không tệp. Assert `[]`.
  - `TA-07 dem-nghia`: hai lần `gopQuyen` + một `thuTuGop` như UQ-10 dem, rồi nối tay một dòng `dung-quyen` có
    `quyen: 'gop'`; `dem --json`: `tong 4`, `theo_quyen { merge: 2, 'merge-order': 1, gop: 1 }`, `nghia` có đúng khoá
    `merge`, `merge-order` (không có `gop`), mỗi nghĩa có chữ có dấu.
  - `TA-07-do bo-nghia`: `banSao` bỏ `, nghia: '<nghĩa của session>'` → `kiemNghia` chứa
    `thẻ thiếu nghĩa tiếng Việt: session`.
- [ ] **Bước 2 — chạy, thấy đỏ:** `--test-name-pattern='^TA-07'` → FAIL.
- [ ] **Bước 3 — sửa mã.** Nghĩa (theo `CONTEXT.md`): `merge` «gộp PR theo quyền» · `merge-order` «xếp lại thứ tự gộp» ·
  `session` «mở và dọn phiên» · `reassign-row` «chuyển hàng sang dãy khác» · `open-lane` «mở thêm dãy» · `shared-ruling`
  «phán quyết dùng chung cho các dãy» · `roadmap` «sửa lộ trình» · `out-of-contract` «quyết mục ngoài hợp đồng» · `design`
  «quyết thiết kế». `the.mjs` thêm `nghia` vào `uy_quyen`; `dem.mjs` nhập `LOAI`, thêm `nghia` vào `dung_quyen`. Sổ không
  có `dung-quyen` → vẫn `{}`.
- [ ] **Bước 4 — chạy cả tệp:** xanh, gồm UQ-05 chiều im và TA-04.
- [ ] **Bước 5 — commit:** `feat(dispatch): thẻ và báo cáo đợt trình nghĩa tiếng Việt của từng quyền`.

### Task 4: Kịch bản rang của hồ sơ

Phục vụ E1–E7 · `independent: false`.

**Files:** Create `_acceptance/doi-ten-ban-uy-quyen/rang/chay.sh` (thực thi được).

- [ ] **Bước 1 — viết** theo khuôn `_acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh` (đòi `# fail 0`, `# skipped 0`,
  `# todo 0`, dòng `ok N - <tên>` cho từng ca), thêm danh sách tiêu chí DL6 phải gọi lại bằng
  `bash "$ROOT/_acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh" AC-<m>`; bất kỳ lần nào thoát khác 0 → thoát 1 nêu tên.
  Ánh xạ: AC-1 → TA-01 ×4 + DL6 AC-2, AC-4 · AC-2 → TA-02 ×4 · AC-3 → DL6 AC-3, AC-2 · AC-4 → TA-04 ×2 + DL6 AC-5 ·
  AC-5 → DL6 AC-1 · AC-6 → DL6 AC-6…AC-10 · AC-7 → TA-07 ×3. Tiêu chí không có ca TA chỉ gọi DL6.
- [ ] **Bước 2 — chạy** `bash _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh AC-n` với n = 1…7 → mỗi lần dòng
  `chay.sh AC-n: đạt`. Phá thử: gọi với một tên ca gõ sai (tạm sửa một tên trong mảng) → thoát 1 «thiếu dòng ok», hoàn lại.
- [ ] **Bước 3 — commit:** `test(doi-ten-ban-uy-quyen): kịch bản rang chạy ca TA và gọi lại rang của DL6`.

### Task 5: Chỉ dẫn của gói và ADR 0030

Phục vụ E8 · `independent: false`.

**Files:** Modify `plugins/dispatch/commands/open.md:37-41`, `commands/close.md:28-29`, `scripts/mau/LUAT.md:115-130`,
`README.md:294-308`, `docs/adr/0030-giam-sat-doc-ban-uy-quyen-cua-kho.md` (thêm mục cuối «Sửa 28/11»).

- [ ] **Bước 1 — sửa chỉ dẫn:** khoá `version`/`delegated`, tên quyền mới; bảo phiên trình mỗi quyền bằng `nghia` tiếng
  Việt, tên tiếng Anh trong ngoặc; giữ nguyên tên lệnh `gop`, `thu-tu-gop`, sự kiện `dung-quyen`, loại yêu cầu
  `chuyen-hang` (`LUAT.md:37`), marker `MONITOR-LOC` của `open.md` (UQ-06 monitor rút nó).
- [ ] **Bước 2 — ADR:** mục «Sửa 28/11» mang bảng tên §3, câu tệp tên cũ (§4), câu `nghia` (§5); không sửa Quyết định 1–5.
- [ ] **Bước 3 — kiểm:** `node --test tests/dieu-phoi/uy-quyen.test.mjs` xanh (UQ-06 monitor đọc `open.md`);
  `grep -nE "tu_lam|\bban: 1|thu-tu-gop\]|\[gop" plugins/dispatch/{commands,README.md,scripts/mau/LUAT.md}` chỉ còn chỗ
  nói tên lệnh hay tên cũ có chủ đích.
- [ ] **Bước 4 — commit:** `docs(dispatch): chỉ dẫn và ADR 0030 dùng tên bản uỷ quyền mới`.

### Cuối S3

- [ ] Chạy cả `node --test tests/dieu-phoi/*.test.mjs` và hai suite vùng của kho đã dùng ở đường nền
  (`run-tests.sh --manh mjs:1/3`, plugins vùng 1) — xanh. Đặt hợp đồng `status: implemented`, vào S4 với
  `--diff-base a9b7cbe6aca989d7c0ab54339e16cebc98a69a28`.
