---
nguon: 644e9b49af3d24de3fe284304d765ea388304b89
cay_moi: 5f1b4286d8fd23a14432bda4712654ca88af672f
do_luc: 2026-11-15T00:08:25Z
bo: [scripts, hooks, plugins, workflows, dieu-phoi, ban-do]
tong_do_them: 468
---

# Lớp ca kiểm thiếu ở cây mới do đổi bố cục

Máy sinh bởi `migration/kich-ban/do-lop-do.sh` → `ghi-bao-cao.sh` → `phan-lop.py` — đừng sửa tay, chạy lại. Cây cũ =
nguồn ở trên; cây mới = đỉnh `don-nha/3.0` dựng từ nguồn ấy. Mỗi cây một bản kéo riêng, cùng tên thư mục `delivery-loop`,
chạy các bước kiểm của việc `tests` trong `gate.yml` của chính cây (`chay-bo-kiem.sh`). «Đỏ thêm» tính theo TÚI KHOÁ
(`giu-khoa.mjs`): khoá đạt ở cây cũ mà không đạt ở cây mới — ca đỏ, ca SKIP, và ca không chạy tới —, cộng một mục cho mỗi
bộ chết ngầm. Ca đỏ ở cả hai cây không tính.

**Giới hạn:** lớp của ca đỏ chia theo CHỮ của nhật ký quanh dòng đỏ, không chạy lại từng ca. «Cùng tệp» là ca không tự in
lỗi đường dẫn nhưng khối chứa nó có. Ca không chạy tới không có dòng nào để đọc nên không chia nhỏ hơn. Một lượt mỗi cây.

| Bộ | Mã thoát cũ | Mã thoát mới | Đạt cây cũ | Đạt cây mới | Không chạy tới | Đỏ thêm |
|---|---|---|---|---|---|---|
| scripts | 1 | 1 | 3413 | 2987 | 149 | 433 |
| hooks | 0 | 0 | 80 | 80 | 0 | 0 |
| plugins | 0 | 1 | 363 | 343 | 12 | 25 |
| workflows | 0 | 0 | 1036 | 1036 | 0 | 0 |
| dieu-phoi | 0 | 1 | 663 | 653 | 0 | 10 |
| ban-do | 0 | 0 | 1 | 1 | 0 | 0 |
| **tổng** | | | | | | **468** |

## Đỏ thêm theo lớp

| Lớp | Số ca | scripts | hooks | plugins | workflows | dieu-phoi | ban-do |
|---|---|---|---|---|---|---|---|
| không chạy tới (`khong-chay-toi`) | 161 | 149 | 0 | 12 | 0 | 0 | 0 |
| đường dẫn không còn (`duong-dan`) | 90 | 86 | 0 | 2 | 0 | 2 | 0 |
| cùng khối có lỗi đường dẫn (`cung-tep`) | 98 | 98 | 0 | 0 | 0 | 0 | 0 |
| tên đổi (`ten-doi`) | 20 | 18 | 0 | 0 | 0 | 2 | 0 |
| dựng bản cũ từ lịch sử (`lich-su`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| bộ chết ngầm / bộ chạy không chạy được (`bo-chay`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| khác (`khac`) | 99 | 82 | 0 | 11 | 0 | 6 | 0 |

**Mẫu — khác:**

- `scripts: FAIL: L42m (dấu hiệu bản sao đã chạy sai: mutant=ERR lành=[]) ⏎ L43 [mobile] -> không W8 (+W1 quét)`
- `scripts: FAIL: DV5 plugins/acceptance-gate/scripts/pre-merge-check.sh: diff so với base 909dffd CHỈ THÊM (0 dòng luật cũ bị xoá/sửa) ⏎ Command failed: git -C <tmp> show 909dffd8b7df648ffc41625e9582fe9042ae6f89:plugins/acceptance-gate/scripts/pre-merge-check.sh ⏎ fatal: path 'plugins/acceptance-gate/scripts/pre-merge-check.sh' exists on disk, but not in '909dffd8b7df648ffc41625e9582fe9042ae6f89' ⏎ fatal: pa`
- `plugins: FAIL: P91 con tro RUT TU file tro vao vat that tren cay nguon, kem dem sanity 8 (E6) ⏎ P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11) ⏎ Traceback (most recent call last): ⏎ File "<stdin>", line 80, in <module> ⏎ AssertionError: thu muc nguon khong gop file nao (doi ten? xoa?): ['plugins/acceptance-gate/skills', 'plugins/acceptance-gate/commands', 'p`
- `plugins: FAIL: P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11) ⏎ P94 quyen tra lai tai cong + tien to so tren the (E13)`
- `dieu-phoi: not ok 13 - TC1-06 doc-cu-tung-byte ⏎ --- ⏎ duration_ms: 11400.200084 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: |- ⏎ Expected values to be strictly deep-equal: ⏎ + actual - expected ⏎ + [ ⏎ +   'danh-thuc b', ⏎ +   'danh-thuc d',`
- `dieu-phoi: not ok 18 - TC1-09 than-ca-doi ⏎ --- ⏎ duration_ms: 880.349042 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: |- ⏎ Expected values to be strictly deep-equal: ⏎ + actual - expected ⏎ [ ⏎ +   '(đầu bang.test.mjs)', ⏎ +   '(đầu bien.test.mjs)',`

**Mẫu — tên đổi:**

- `scripts: FAIL: AP-1-khong-bat — Error: Command failed: git -C <tmp> archive --format=tar d01df558cfb6d75246d860824864343caf57583d plugins/acceptance-gate/scripts lib skills commands road-map | fatal: pathspec 'plugins/acceptance-gate/scripts' did not match any files |  |     at genericNodeError (node:internal/errors:985:15) ⏎ fatal: pathspec 'plugins/acceptance-gate/scripts' did not match any files`
- `scripts: FAIL: AP-1-do2 — Error: Command failed: git -C <tmp> archive --format=tar d01df558cfb6d75246d860824864343caf57583d plugins/acceptance-gate/scripts lib skills commands road-map | fatal: pathspec 'plugins/acceptance-gate/scripts' did not match any files |  |     at genericNodeError (node:internal/errors:985:15)`
- `dieu-phoi: not ok 341 - DP6-03 moc-co-dinh ⏎ --- ⏎ duration_ms: 191.831583 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: |- ⏎ Command failed: git archive 8d797a9176e3cc62d7b365822737e4d4c83d804f dieu-phoi ⏎ fatal: pathspec 'dieu-phoi' did not match any files ⏎ code: 'ERR_TEST_FAILURE' ⏎ stack: |- ⏎ genericNodeError (node:internal/errors:985:15)`
- `dieu-phoi: not ok 361 - DP2-01 ba-lenh ⏎ #   lệnh: close.md, handoff.md, open.md, resume.md, status.md ⏎ #   5 lời gọi thiếu đối số, lỗi: 0 ⏎ #   (ma:slug) theo kit: A:hang-a-tu-lo-trinh · B:dong-goi-dieu-phoi-tho-vao · C:hang-c ⏎ #   số hàng ma trận: 7 · chờ Cổng Đáng: hang-c, hang-d, hang-f ⏎ #   8 hình frontmatter, lệch: 0 ⏎ #   giá trị so: tam-dung · s4 · P2 · P1 · Ký giúp lượt này? · hang-a-tu-lo-trinh `

**Mẫu — đường dẫn không còn:**

- `scripts: FAIL: AP-7 — Error: ENOENT: no such file or directory, open '<tmp> |     at readFileSync (node:fs:441:20) |     at file://<tmp> |     at chayCa (file://<tmp>`
- `scripts: FAIL: AP-7-lenh — Error: ENOENT: no such file or directory, open '<tmp> |     at readFileSync (node:fs:441:20) |     at file://<tmp> |     at chayCa (file://<tmp>`
- `plugins: FAIL: P188 round-trip dieu khoan moi-cong: MOI site nguon khop tung ky tu (E5) ⏎ P188 round-trip dieu khoan moi-cong: MOI site nguon khop tung ky tu (E5) ⏎ Traceback (most recent call last): ⏎ File "<stdin>", line 41, in <module> ⏎ File "/opt/homebrew/Cellar/python@3.14/3.14.6/Frameworks/Python.framework/Versions/3.14/lib/python3.14/pathlib/__init__.py", line 787, in read_text ⏎ with self.open(mod`
- `plugins: FAIL: P193 dieu khoan mot-luot-go: 6 site nguon khop tung ky tu + quan he per-site (E3/E4 mot-luot-go) ⏎ P193 dieu khoan mot-luot-go: 6 site nguon khop tung ky tu + quan he per-site (E3/E4 mot-luot-go) ⏎ Traceback (most recent call last): ⏎ File "<stdin>", line 33, in <module> ⏎ File "/opt/homebrew/Cellar/python@3.14/3.14.6/Frameworks/Python.framework/Versions/3.14/lib/python3.14/pathlib/__init__.`
- `dieu-phoi: not ok 15 - TC1-08 loi-dan ⏎ --- ⏎ duration_ms: 0.266792 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: "ENOENT: no such file or directory, open '<tmp> ⏎ code: 'ENOENT' ⏎ stack: |- ⏎ Object.readFileSync (node:fs:441:20) ⏎ file://<tmp> ⏎ Array.map (<anonymous>) ⏎ vanBanHienTai (file://<tmp>`
- `dieu-phoi: not ok 17 - TC1-08-do bo-mot-buoc ⏎ --- ⏎ duration_ms: 0.237417 ⏎ type: 'test' ⏎ location: '<tmp> ⏎ failureType: 'testCodeFailure' ⏎ error: "ENOENT: no such file or directory, open '<tmp> ⏎ code: 'ENOENT' ⏎ stack: |- ⏎ Object.readFileSync (node:fs:441:20) ⏎ file://<tmp> ⏎ Array.map (<anonymous>) ⏎ vanBanHienTai (file://<tmp>`

**Mẫu — cùng khối có lỗi đường dẫn:**

- `scripts: FAIL: AP-7-do2 — không bắt (cần «xem.md»): ["P32 đỏ: AssertionError: plugins/roadmap/commands/status.md must stay model-invocable (chỉ đọc)"]`
- `scripts: FAIL: ap-chinh-sach-lo-trinh.test.mjs (expected exit 0, got 1) ⏎ Results: 50 passed, 9 failed (ap-chinh-sach-lo-trinh)`

**Mẫu — không chạy tới:**

- `scripts: scripts: [RN-1]`
- `scripts: scripts: [RN-1-do]`
- `plugins: plugins: P08 every ${CLAUDE_PLUGIN_ROOT} path in plugins/acceptance-gate/commands/skills exists in ITS plugin root`
- `plugins: plugins: P38a gate-card require plugins/acceptance-gate/lib/gap-probe.cjs`

## Số liệu máy đọc

<!-- <<<LOP-DO-SO-LIEU -->
```json
{"bo": {"ban-do": {"dat_cu": 1, "dat_moi": 1, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}, "dieu-phoi": {"dat_cu": 663, "dat_moi": 653, "do_ca_hai": 0, "do_them": 10, "khong_chay_toi": 0, "lop": {"duong-dan": 2, "khac": 6, "ten-doi": 2}, "rc_cu": 0, "rc_moi": 1}, "hooks": {"dat_cu": 80, "dat_moi": 80, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}, "plugins": {"dat_cu": 363, "dat_moi": 343, "do_ca_hai": 0, "do_them": 25, "khong_chay_toi": 12, "lop": {"duong-dan": 2, "khac": 11, "khong-chay-toi": 12}, "rc_cu": 0, "rc_moi": 1}, "scripts": {"dat_cu": 3413, "dat_moi": 2987, "do_ca_hai": 3, "do_them": 433, "khong_chay_toi": 149, "lop": {"cung-tep": 98, "duong-dan": 86, "khac": 82, "khong-chay-toi": 149, "ten-doi": 18}, "rc_cu": 1, "rc_moi": 1}, "workflows": {"dat_cu": 1036, "dat_moi": 1036, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}}, "cay_moi": "5f1b4286d8fd23a14432bda4712654ca88af672f", "lop": {"bo-chay": 0, "cung-tep": 98, "duong-dan": 90, "khac": 99, "khong-chay-toi": 161, "lich-su": 0, "ten-doi": 20}, "nguon": "644e9b49af3d24de3fe284304d765ea388304b89", "tong_do_them": 468}
```
<!-- LOP-DO-SO-LIEU>>> -->
