---
nguon: 0c4e503b1d9649faa6948dd169573717b6dddce4
cay_moi: c7aa88325b54528243e9592f250446d2da2d7263
do_luc: 2026-11-13T15:06:58Z
bo: [scripts, hooks, plugins, workflows, dieu-phoi, ban-do]
tong_do_them: 1790
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
| scripts | 1 | 1 | 2 | 1189 | 1 | 1188 | 1 |
| hooks | 0 | 1 | 0 | 71 | 0 | 71 | 0 |
| plugins | 0 | 1 | 0 | 157 | 0 | 157 | 0 |
| workflows | 0 | 1 | 0 | 0 | 0 | 1 | 0 |
| dieu-phoi | 0 | 1 | 0 | 372 | 0 | 372 | 0 |
| ban-do | 0 | 1 | 0 | 0 | 0 | 1 | 0 |
| **tổng** | | | | | | **1790** | |

## Đỏ thêm theo lớp dấu hiệu

| Lớp | Số ca | scripts | hooks | plugins | workflows | dieu-phoi | ban-do |
|---|---|---|---|---|---|---|---|
| đường dẫn không còn (`duong-dan`) | 1206 | 672 | 41 | 142 | 0 | 351 | 0 |
| cùng tệp kiểm có lỗi đường dẫn (`cung-tep`) | 451 | 434 | 17 | 0 | 0 | 0 | 0 |
| tên đổi (`ten-doi`) | 22 | 11 | 0 | 2 | 0 | 9 | 0 |
| dựng bản cũ từ lịch sử (`lich-su`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| bộ chạy không chạy được (`bo-chay`) | 2 | 0 | 0 | 0 | 1 | 0 | 1 |
| khác (`khac`) | 109 | 71 | 13 | 13 | 0 | 12 | 0 |

**Mẫu — đường dẫn không còn:**

- `scripts: FAIL: A01 (expected exit 1, got 127)`
- `scripts: FAIL: A02 (expected exit 0, got 127)`
- `hooks: FAIL: C01 (expected exit 0, got 1) ⏎ C02 set status approved WITH approved_by -> allow ⏎ node:internal/modules/cjs/loader:1503 ⏎ throw err; ⏎ ^ ⏎ Error: Cannot find module '<tmp> ⏎ at Module._resolveFilename (node:internal/modules/cjs/loader:1500:15) ⏎ at wrapResolveFilename (node:internal/modules/cjs/loader:1071:27) ⏎ at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1095:10) ⏎`
- `hooks: FAIL: C02 (expected exit 0, got 1) ⏎ at wrapResolveFilename (node:internal/modules/cjs/loader:1071:27) ⏎ at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1095:10) ⏎ at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1116:12) ⏎ at Module._load (node:internal/modules/cjs/loader:1285:25) ⏎ at wrapModuleLoad (node:internal/modules/cjs/loader:255:19) ⏎ at Module.executeUser`
- `plugins: FAIL: [BDK2] không nạp được bảng: Cannot find module '<tmp> ⏎ Require stack: ⏎ - <tmp> ⏎ bang-dieu-khien: 1 ca đỏ`
- `plugins: FAIL: NO-AC11-do — ENOENT: no such file or directory, lstat '<tmp>`
- `dieu-phoi: not ok 69 - DP1-01 cai-la-du ⏎ --- ⏎ duration_ms: 0.965167 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: "ENOENT: no such file or directory, open '<tmp> ⏎ code: 'ENOENT' ⏎ stack: |- ⏎ Object.readFileSync (node:fs:441:20) ⏎ docJ (file://<tmp> ⏎ kiemCaiDat (file://<tmp> ⏎ TestContext.<anonymous> (file://<tmp>`
- `dieu-phoi: not ok 71 - DP1-01-do dao-lenh ⏎ --- ⏎ duration_ms: 0.16775 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: "ENOENT: no such file or directory, lstat '<tmp> ⏎ code: 'ENOENT' ⏎ stack: |- ⏎ cpSyncFn (node:internal/fs/cp/cp-sync:56:13) ⏎ Object.cpSync (node:fs:3158:3) ⏎ chep (file://<tmp> ⏎ TestContext.<anonymous> (file://<tmp>`

**Mẫu — cùng tệp kiểm có lỗi đường dẫn:**

- `scripts: FAIL: A01-msg (expected approved_by violation) ⏎ A02 gate1_skipped: true + empty approved_by -> clean + NOTE`
- `scripts: FAIL: A02-note (expected gate1_skipped NOTE)`
- `hooks: FAIL: C08 (expected exit 0, got 1) ⏎ C09 contract violation under enforcement: warn -> allow with warning ⏎ node:events:487 ⏎ throw er; // Unhandled 'error' event ⏎ ^ ⏎ Error: write EPIPE ⏎ at afterWriteDispatched (node:internal/stream_base_commons:159:15) ⏎ at writeGeneric (node:internal/stream_base_commons:150:3) ⏎ at Socket._writeGeneric (node:net:1025:11) ⏎ at Socket._write (node:net:1037:8) ⏎`
- `hooks: FAIL: C09 (expected exit 0, got 1) ⏎ at runScriptInThisContext (node:internal/vm:219:10) ⏎ at node:internal/process/execution:451:12 ⏎ Emitted 'error' event on Socket instance at: ⏎ at emitErrorNT (node:internal/streams/destroy:170:8) ⏎ at emitErrorCloseNT (node:internal/streams/destroy:129:3) ⏎ at process.processTicksAndRejections (node:internal/process/task_queues:90:21) { ⏎ errno: -32, ⏎ code: `

**Mẫu — khác:**

- `scripts: FAIL: DG-CC1 static co co tren dich khong phai HTML (tsx-sach: đối chứng hỏng — không cờ mà mã 1/undefined | tsx-sach: mã 1, mong 5 | tsx-sach: stdout không phải JSON | jsx-sach: đối chứng hỏng — không cờ mà mã 1/undefined | jsx-sach: mã 1, mong 5 | jsx-sach: stdout không phải JSON | vue-sach: đối chứng hỏng — không cờ mà mã 1/undefined | vue-sach: mã 1, mong 5 | vue-sach: stdout không phải JSON |`
- `scripts: FAIL: DG-CC2 loi chan thay duoc tren tsx (tsx-anh-rong: 1/undefined, mong 2/REJECT | tsx-anh-rong: blocking undefined thiếu broken-image | tsx-anh-rong: thiếu do_duoc: false)`
- `hooks: FAIL: T02 (expected exit 0, got 1) ⏎ T03 PASS missing run_id -> block ⏎ node:events:487 ⏎ throw er; // Unhandled 'error' event ⏎ ^ ⏎ Error: write EPIPE ⏎ at afterWriteDispatched (node:internal/stream_base_commons:159:15) ⏎ at writeGeneric (node:internal/stream_base_commons:150:3) ⏎ at Socket._writeGeneric (node:net:1025:11) ⏎ at Socket._write (node:net:1037:8) ⏎ at writeOrBuffer (node:internal/str`
- `hooks: FAIL: T03 (expected exit 2, got 1) ⏎ T04 PASS with manual verifier -> block ⏎ node:events:487 ⏎ throw er; // Unhandled 'error' event ⏎ ^ ⏎ Error: write EPIPE ⏎ at afterWriteDispatched (node:internal/stream_base_commons:159:15) ⏎ at writeGeneric (node:internal/stream_base_commons:150:3) ⏎ at Socket._writeGeneric (node:net:1025:11) ⏎ at Socket._write (node:net:1037:8) ⏎ at writeOrBuffer (node:intern`
- `plugins: FAIL: P119 --check fresh/stale/thieu-file/chua-init + path suy tu vi tri script (E3) ⏎ P120 uat-session giu chot spec §2.3 dung thu tu; skill MO nhu design-pass (E12) ⏎ Traceback (most recent call last): ⏎ File "<stdin>", line 5, in <module> ⏎ AssertionError: thieu skills/uat-session/SKILL.md`
- `plugins: FAIL: P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11) ⏎ P131 khuon CI: moi loi goi pre-merge-check.sh trong doc mang --base + fetch-depth di kem ⏎ P131 OK`
- `dieu-phoi: not ok 80 - DP1-08 khong-tu-bat ⏎ --- ⏎ duration_ms: 53.230417 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: |- ⏎ Expected values to be strictly deep-equal: ⏎ + actual - expected ⏎ + [ ⏎ +   'plugin-declare thoát 1: node:internal/modules/cjs/loader:1503\n' + ⏎ +     '  throw err;\n' +`
- `dieu-phoi: not ok 81 - DP1-08-do bo-dau ⏎ --- ⏎ duration_ms: 49.872958 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: |- ⏎ đối chứng dương: bản sao nguyên vẹn ⏎ + actual - expected ⏎ + [ ⏎ +   'plugin-declare thoát 1: node:internal/modules/cjs/loader:1503\n' + ⏎ +     '  throw err;\n' +`

**Mẫu — tên đổi:**

- `scripts: FAIL: DV4a recheck MỚI trên MỌI evidence-report thật của repo -> 0 fail NGOÀI grandfather ⏎ DV4a: hồ sơ đỏ NGOÀI danh sách grandfather — đây là lỗi mới, không phải nợ cũ: anh-co-that-trong-ho-so, ap-chinh-sach-lo-trinh, bai-hoc-do-luong-vao-engine, ban-do-khuon-roi-nhom, bang-ngoai-n-co-can-cu, baseline-tran-bo-qua-don, bat-bien-san-pham, bo-doc-ho-so-khoan-dung, buoc-len-thiet-ke-khong-hoi, can-c`
- `scripts: FAIL: JR11b recheck strict trên corpus thật == baseline viết-trước (0 fail NGOÀI grandfather) ⏎ JR11b: hồ sơ đỏ NGOÀI danh sách grandfather — đây là lỗi mới, không phải nợ cũ: anh-co-that-trong-ho-so, ap-chinh-sach-lo-trinh, bai-hoc-do-luong-vao-engine, ban-do-khuon-roi-nhom, bang-ngoai-n-co-can-cu, baseline-tran-bo-qua-don, bat-bien-san-pham, bo-doc-ho-so-khoan-dung, buoc-len-thiet-ke-khong-hoi, `
- `plugins: FAIL: P200 mot lan cat so nhat quan: hai plugin cung so · dieu-phoi cung so · road-map cung so · tri-thuc cung so · GUIDE dan xuat · muc mo ta cua chinh so do (8 dot bien, mot loi thoat) ⏎ ca khai plugin — PD1 (ho so repo-khai-plugin)`
- `plugins: FAIL: P30 Claude decision commands ship and keep their invariants ⏎ P28 README and GUIDE document the verified install path ⏎ Traceback (most recent call last): ⏎ File "<stdin>", line 14, in <module> ⏎ AssertionError: acceptance-gate@acceptance-gate-kit`
- `dieu-phoi: not ok 258 - DP2-14 tu-dien ⏎ --- ⏎ duration_ms: 2.333125 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: |- ⏎ Expected values to be strictly deep-equal: ⏎ + actual - expected ⏎ + [ ⏎ +   'QUICKSTART.md thiếu /dieu-phoi:mo-dot', ⏎ +   'QUICKSTART.md thiếu /dieu-phoi:xem',`
- `dieu-phoi: not ok 259 - DP2-14-do thieu-muc ⏎ --- ⏎ duration_ms: 2.454333 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: |- ⏎ đối chứng dương: bản sao lành ⏎ + actual - expected ⏎ + [ ⏎ +   'QUICKSTART.md thiếu /dieu-phoi:mo-dot', ⏎ +   'QUICKSTART.md thiếu /dieu-phoi:xem',`

**Mẫu — bộ chạy không chạy được:**

- `workflows: bộ thoát 1 mà không in ca đỏ nào`
- `ban-do: bộ thoát 1 mà không in ca đỏ nào`

## Ca đỏ ở cả hai cây (tách khỏi «đỏ thêm»)

- scripts: `moc-chien-dich.test.mjs`

## Số liệu máy đọc

<!-- <<<LOP-DO-SO-LIEU -->
```json
{"bo": {"ban-do": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 0, "do_them": 1, "lop": {"bo-chay": 1}, "rc_cu": 0, "rc_moi": 1}, "dieu-phoi": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 372, "do_them": 372, "lop": {"duong-dan": 351, "khac": 12, "ten-doi": 9}, "rc_cu": 0, "rc_moi": 1}, "hooks": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 71, "do_them": 71, "lop": {"cung-tep": 17, "duong-dan": 41, "khac": 13}, "rc_cu": 0, "rc_moi": 1}, "plugins": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 157, "do_them": 157, "lop": {"duong-dan": 142, "khac": 13, "ten-doi": 2}, "rc_cu": 0, "rc_moi": 1}, "scripts": {"ca_hai": ["moc-chien-dich.test.mjs"], "chi_do_cu": 1, "do_ca_hai": 1, "do_cu": 2, "do_moi": 1189, "do_them": 1188, "lop": {"cung-tep": 434, "duong-dan": 672, "khac": 71, "ten-doi": 11}, "rc_cu": 1, "rc_moi": 1}, "workflows": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 0, "do_them": 1, "lop": {"bo-chay": 1}, "rc_cu": 0, "rc_moi": 1}}, "cay_moi": "c7aa88325b54528243e9592f250446d2da2d7263", "lop": {"bo-chay": 2, "cung-tep": 451, "duong-dan": 1206, "khac": 109, "lich-su": 0, "ten-doi": 22}, "nguon": "0c4e503b1d9649faa6948dd169573717b6dddce4", "tong_do_them": 1790}
```
<!-- LOP-DO-SO-LIEU>>> -->
