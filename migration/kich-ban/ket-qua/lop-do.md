---
nguon: 593e68376006cf8b036f167b805048a5f1692c3c
cay_moi: 6f36f7915ace71f6148f1f15dd713e47f9d3caba
do_luc: 2026-11-14T04:17:58Z
bo: [scripts, hooks, plugins, workflows, dieu-phoi, ban-do]
tong_do_them: 1787
---

# Lớp ca kiểm đỏ do đổi bố cục — đầu vào cho B2

Máy sinh bởi `migration/kich-ban/do-lop-do.sh` → `phan-lop.py` — đừng sửa tay, chạy lại. Cây cũ = nguồn ở trên;
cây mới = đỉnh `don-nha/3.0` dựng từ nguồn ấy. Mỗi cây một bản kéo riêng, cùng tên thư mục `delivery-loop`, chạy đúng
sáu bước của việc `tests` (`migration/b0/chay.sh`). Khoá ca như đo thử B0. «Đỏ thêm» = đỏ ở cây mới mà không đỏ ở cây cũ;
ca đỏ ở cả hai cây là nợ có sẵn hoặc chập chờn, không tính cho đổi bố cục.

**Giới hạn:** lớp chia theo CHỮ của nhật ký (dòng FAIL và vài dòng quanh nó), không chạy lại từng ca. «Tên đổi» có thể
đếm nhầm ca in danh sách tên hồ sơ có chứa tên cũ; «cùng tệp» là ca không tự in lỗi đường dẫn nhưng tệp kiểm chứa nó có —
thường là ca chạy theo ca đã đỏ. Ca không tự in lỗi sau dòng FAIL thì đọc phần trước nó, nên có thể mượn lớp của ca liền
trước trong nhật ký kiểu node. Một lượt đo mỗi cây trên một máy.

| Bộ | Mã thoát cũ | Mã thoát mới | Đỏ cây cũ | Đỏ cây mới | Đỏ cả hai | Đỏ thêm | Chỉ đỏ ở cây cũ |
|---|---|---|---|---|---|---|---|
| scripts | 1 | 1 | 4 | 1189 | 4 | 1185 | 0 |
| hooks | 0 | 1 | 0 | 71 | 0 | 71 | 0 |
| plugins | 0 | 1 | 0 | 157 | 0 | 157 | 0 |
| workflows | 0 | 1 | 0 | 0 | 0 | 1 | 0 |
| dieu-phoi | 0 | 1 | 0 | 372 | 0 | 372 | 0 |
| ban-do | 0 | 1 | 0 | 0 | 0 | 1 | 0 |
| **tổng** | | | | | | **1787** | |

## Đỏ thêm theo lớp dấu hiệu

| Lớp | Số ca | scripts | hooks | plugins | workflows | dieu-phoi | ban-do |
|---|---|---|---|---|---|---|---|
| đường dẫn không còn (`duong-dan`) | 1205 | 671 | 41 | 142 | 0 | 351 | 0 |
| cùng tệp kiểm có lỗi đường dẫn (`cung-tep`) | 452 | 432 | 20 | 0 | 0 | 0 | 0 |
| tên đổi (`ten-doi`) | 22 | 11 | 0 | 2 | 0 | 9 | 0 |
| dựng bản cũ từ lịch sử (`lich-su`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| bộ chạy không chạy được (`bo-chay`) | 2 | 0 | 0 | 0 | 1 | 0 | 1 |
| khác (`khac`) | 106 | 71 | 10 | 13 | 0 | 12 | 0 |

**Mẫu — đường dẫn không còn:**

- `scripts: FAIL: A01 (expected exit 1, got 127)`
- `scripts: FAIL: A02 (expected exit 0, got 127)`
- `hooks: FAIL: C01 (expected exit 0, got 1) ⏎ C02 set status approved WITH approved_by -> allow ⏎ node:internal/modules/cjs/loader:1503 ⏎ throw err; ⏎ ^ ⏎ Error: Cannot find module '<tmp> ⏎ at Module._resolveFilename (node:internal/modules/cjs/loader:1500:15) ⏎ at wrapResolveFilename (node:internal/modules/cjs/loader:1071:27) ⏎ at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1095:10) ⏎`
- `hooks: FAIL: C03 (expected exit 2, got 1) ⏎ C04 approved w/ empty approved_by but gate1_skipped: true -> allow (audited escape hatch) ⏎ node:internal/modules/cjs/loader:1503 ⏎ throw err; ⏎ ^ ⏎ Error: Cannot find module '<tmp> ⏎ at Module._resolveFilename (node:internal/modules/cjs/loader:1500:15) ⏎ at wrapResolveFilename (node:internal/modules/cjs/loader:1071:27) ⏎ at defaultResolveImplForCJSLoading (nod`
- `plugins: FAIL: [BDK2] không nạp được bảng: Cannot find module '<tmp> ⏎ Require stack: ⏎ - <tmp> ⏎ bang-dieu-khien: 1 ca đỏ`
- `plugins: FAIL: NO-AC11-do — ENOENT: no such file or directory, lstat '<tmp>`
- `dieu-phoi: not ok 69 - DP1-01 cai-la-du ⏎ --- ⏎ duration_ms: 0.973792 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: "ENOENT: no such file or directory, open '<tmp> ⏎ code: 'ENOENT' ⏎ stack: |- ⏎ Object.readFileSync (node:fs:441:20) ⏎ docJ (file://<tmp> ⏎ kiemCaiDat (file://<tmp> ⏎ TestContext.<anonymous> (file://<tmp>`
- `dieu-phoi: not ok 71 - DP1-01-do dao-lenh ⏎ --- ⏎ duration_ms: 0.15425 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: "ENOENT: no such file or directory, lstat '<tmp> ⏎ code: 'ENOENT' ⏎ stack: |- ⏎ cpSyncFn (node:internal/fs/cp/cp-sync:56:13) ⏎ Object.cpSync (node:fs:3158:3) ⏎ chep (file://<tmp> ⏎ TestContext.<anonymous> (file://<tmp>`

**Mẫu — cùng tệp kiểm có lỗi đường dẫn:**

- `scripts: FAIL: A01-msg (expected approved_by violation) ⏎ A02 gate1_skipped: true + empty approved_by -> clean + NOTE`
- `scripts: FAIL: A02-note (expected gate1_skipped NOTE)`
- `hooks: FAIL: C02 (expected exit 0, got 1) ⏎ C03 set status approved with EMPTY approved_by -> block ⏎ node:events:487 ⏎ throw er; // Unhandled 'error' event ⏎ ^ ⏎ Error: write EPIPE ⏎ at afterWriteDispatched (node:internal/stream_base_commons:159:15) ⏎ at writeGeneric (node:internal/stream_base_commons:150:3) ⏎ at Socket._writeGeneric (node:net:1025:11) ⏎ at Socket._write (node:net:1037:8) ⏎ at writeOrBu`
- `hooks: FAIL: C04 (expected exit 0, got 1) ⏎ C05 Edit draft -> implemented with empty approved_by -> block (Gate-1 jump) ⏎ node:events:487 ⏎ throw er; // Unhandled 'error' event ⏎ ^ ⏎ Error: write EPIPE ⏎ at afterWriteDispatched (node:internal/stream_base_commons:159:15) ⏎ at writeGeneric (node:internal/stream_base_commons:150:3) ⏎ at Socket._writeGeneric (node:net:1025:11) ⏎ at Socket._write (node:net:10`

**Mẫu — khác:**

- `scripts: FAIL: DG-CC1 static co co tren dich khong phai HTML (tsx-sach: đối chứng hỏng — không cờ mà mã 1/undefined | tsx-sach: mã 1, mong 5 | tsx-sach: stdout không phải JSON | jsx-sach: đối chứng hỏng — không cờ mà mã 1/undefined | jsx-sach: mã 1, mong 5 | jsx-sach: stdout không phải JSON | vue-sach: đối chứng hỏng — không cờ mà mã 1/undefined | vue-sach: mã 1, mong 5 | vue-sach: stdout không phải JSON |`
- `scripts: FAIL: DG-CC2 loi chan thay duoc tren tsx (tsx-anh-rong: 1/undefined, mong 2/REJECT | tsx-anh-rong: blocking undefined thiếu broken-image | tsx-anh-rong: thiếu do_duoc: false)`
- `hooks: FAIL: T03 (expected exit 2, got 1) ⏎ T04 PASS with manual verifier -> block ⏎ node:events:487 ⏎ throw er; // Unhandled 'error' event ⏎ ^ ⏎ Error: write EPIPE ⏎ at afterWriteDispatched (node:internal/stream_base_commons:159:15) ⏎ at writeGeneric (node:internal/stream_base_commons:150:3) ⏎ at Socket._writeGeneric (node:net:1025:11) ⏎ at Socket._write (node:net:1037:8) ⏎ at writeOrBuffer (node:intern`
- `hooks: FAIL: T06 (expected exit 2, got 1) ⏎ T07 PASS with unresolved UNCERTAIN judgment -> block ⏎ node:events:487 ⏎ throw er; // Unhandled 'error' event ⏎ ^ ⏎ Error: write EPIPE ⏎ at afterWriteDispatched (node:internal/stream_base_commons:159:15) ⏎ at writeGeneric (node:internal/stream_base_commons:150:3) ⏎ at Socket._writeGeneric (node:net:1025:11) ⏎ at Socket._write (node:net:1037:8) ⏎ at writeOrBuffe`
- `plugins: FAIL: P119 --check fresh/stale/thieu-file/chua-init + path suy tu vi tri script (E3) ⏎ P120 uat-session giu chot spec §2.3 dung thu tu; skill MO nhu design-pass (E12) ⏎ Traceback (most recent call last): ⏎ File "<stdin>", line 5, in <module> ⏎ AssertionError: thieu skills/uat-session/SKILL.md`
- `plugins: FAIL: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11) ⏎ P131 khuon CI: moi loi goi pre-merge-check.sh trong doc mang --base + fetch-depth di kem ⏎ P131 OK`
- `dieu-phoi: not ok 80 - DP1-08 khong-tu-bat ⏎ --- ⏎ duration_ms: 53.82225 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: |- ⏎ Expected values to be strictly deep-equal: ⏎ + actual - expected ⏎ + [ ⏎ +   'plugin-declare thoát 1: node:internal/modules/cjs/loader:1503\n' + ⏎ +     '  throw err;\n' +`
- `dieu-phoi: not ok 81 - DP1-08-do bo-dau ⏎ --- ⏎ duration_ms: 51.13325 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: |- ⏎ đối chứng dương: bản sao nguyên vẹn ⏎ + actual - expected ⏎ + [ ⏎ +   'plugin-declare thoát 1: node:internal/modules/cjs/loader:1503\n' + ⏎ +     '  throw err;\n' +`

**Mẫu — tên đổi:**

- `scripts: FAIL: DV4a recheck MỚI trên MỌI evidence-report thật của repo -> 0 fail NGOÀI grandfather ⏎ DV4a: hồ sơ đỏ NGOÀI danh sách grandfather — đây là lỗi mới, không phải nợ cũ: anh-co-that-trong-ho-so, ap-chinh-sach-lo-trinh, bai-hoc-do-luong-vao-engine, ban-do-khuon-roi-nhom, bang-ngoai-n-co-can-cu, baseline-tran-bo-qua-don, bat-bien-san-pham, bo-doc-ho-so-khoan-dung, buoc-len-thiet-ke-khong-hoi, can-c`
- `scripts: FAIL: JR11b recheck strict trên corpus thật == baseline viết-trước (0 fail NGOÀI grandfather) ⏎ JR11b: hồ sơ đỏ NGOÀI danh sách grandfather — đây là lỗi mới, không phải nợ cũ: anh-co-that-trong-ho-so, ap-chinh-sach-lo-trinh, bai-hoc-do-luong-vao-engine, ban-do-khuon-roi-nhom, bang-ngoai-n-co-can-cu, baseline-tran-bo-qua-don, bat-bien-san-pham, bo-doc-ho-so-khoan-dung, buoc-len-thiet-ke-khong-hoi, `
- `plugins: FAIL: P200 mot lan cat so nhat quan: hai plugin cung so · dieu-phoi cung so · road-map cung so · tri-thuc cung so · GUIDE dan xuat · muc mo ta cua chinh so do (8 dot bien, mot loi thoat) ⏎ ca khai plugin — PD1 (ho so repo-khai-plugin)`
- `plugins: FAIL: P30 Claude decision commands ship and keep their invariants ⏎ P28 README and GUIDE document the verified install path ⏎ Traceback (most recent call last): ⏎ File "<stdin>", line 14, in <module> ⏎ AssertionError: acceptance-gate@acceptance-gate-kit`
- `dieu-phoi: not ok 258 - DP2-14 tu-dien ⏎ --- ⏎ duration_ms: 2.220583 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: |- ⏎ Expected values to be strictly deep-equal: ⏎ + actual - expected ⏎ + [ ⏎ +   'QUICKSTART.md thiếu /dieu-phoi:mo-dot', ⏎ +   'QUICKSTART.md thiếu /dieu-phoi:xem',`
- `dieu-phoi: not ok 259 - DP2-14-do thieu-muc ⏎ --- ⏎ duration_ms: 1.933916 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: |- ⏎ đối chứng dương: bản sao lành ⏎ + actual - expected ⏎ + [ ⏎ +   'QUICKSTART.md thiếu /dieu-phoi:mo-dot', ⏎ +   'QUICKSTART.md thiếu /dieu-phoi:xem',`

**Mẫu — bộ chạy không chạy được:**

- `workflows: bộ thoát 1 mà không in ca đỏ nào`
- `ban-do: bộ thoát 1 mà không in ca đỏ nào`

## Ca đỏ ở cả hai cây (tách khỏi «đỏ thêm»)

- scripts: `GL07` · `T04` · `eval-thay-boi.test.mjs` · `repin-lane-lop-cu.test.mjs`

## Số liệu máy đọc

<!-- <<<LOP-DO-SO-LIEU -->
```json
{"bo": {"ban-do": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 0, "do_them": 1, "lop": {"bo-chay": 1}, "rc_cu": 0, "rc_moi": 1}, "dieu-phoi": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 372, "do_them": 372, "lop": {"duong-dan": 351, "khac": 12, "ten-doi": 9}, "rc_cu": 0, "rc_moi": 1}, "hooks": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 71, "do_them": 71, "lop": {"cung-tep": 20, "duong-dan": 41, "khac": 10}, "rc_cu": 0, "rc_moi": 1}, "plugins": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 157, "do_them": 157, "lop": {"duong-dan": 142, "khac": 13, "ten-doi": 2}, "rc_cu": 0, "rc_moi": 1}, "scripts": {"ca_hai": ["GL07", "T04", "eval-thay-boi.test.mjs", "repin-lane-lop-cu.test.mjs"], "chi_do_cu": 0, "do_ca_hai": 4, "do_cu": 4, "do_moi": 1189, "do_them": 1185, "lop": {"cung-tep": 432, "duong-dan": 671, "khac": 71, "ten-doi": 11}, "rc_cu": 1, "rc_moi": 1}, "workflows": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 0, "do_them": 1, "lop": {"bo-chay": 1}, "rc_cu": 0, "rc_moi": 1}}, "cay_moi": "6f36f7915ace71f6148f1f15dd713e47f9d3caba", "lop": {"bo-chay": 2, "cung-tep": 452, "duong-dan": 1205, "khac": 106, "lich-su": 0, "ten-doi": 22}, "nguon": "593e68376006cf8b036f167b805048a5f1692c3c", "tong_do_them": 1787}
```
<!-- LOP-DO-SO-LIEU>>> -->
