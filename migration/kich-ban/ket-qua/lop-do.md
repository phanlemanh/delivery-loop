---
nguon: d8c42965f49e16c2f4d619ff3ba4d27b5eedf433
cay_moi: 52ab96ad02a252eda9597483f2e5dbb8d2a1a7e1
do_luc: 2026-11-16T03:07:13Z
bo: [scripts, hooks, plugins, workflows, dieu-phoi, ban-do]
tong_do_them: 486
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
| scripts | 1 | 1 | 3648 | 3163 | 332 | 485 |
| hooks | 0 | 0 | 80 | 80 | 0 | 0 |
| plugins | 0 | 1 | 363 | 362 | 0 | 1 |
| workflows | 0 | 0 | 1036 | 1036 | 0 | 0 |
| dieu-phoi | 0 | 0 | 663 | 663 | 0 | 0 |
| ban-do | 0 | 0 | 1 | 1 | 0 | 0 |
| **tổng** | | | | | | **486** |

## Đỏ thêm theo lớp

| Lớp | Số ca | scripts | hooks | plugins | workflows | dieu-phoi | ban-do |
|---|---|---|---|---|---|---|---|
| không chạy tới (`khong-chay-toi`) | 332 | 332 | 0 | 0 | 0 | 0 | 0 |
| đường dẫn không còn (`duong-dan`) | 34 | 34 | 0 | 0 | 0 | 0 | 0 |
| cùng khối có lỗi đường dẫn (`cung-tep`) | 46 | 46 | 0 | 0 | 0 | 0 | 0 |
| tên đổi (`ten-doi`) | 14 | 14 | 0 | 0 | 0 | 0 | 0 |
| dựng bản cũ từ lịch sử (`lich-su`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| bộ chết ngầm / bộ chạy không chạy được (`bo-chay`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| khác (`khac`) | 60 | 59 | 0 | 1 | 0 | 0 | 0 |

**Mẫu — tên đổi:**

- `scripts: FAIL: DV5 plugins/acceptance-gate/scripts/pre-merge-check.sh: diff so với base 909dffd CHỈ THÊM (0 dòng luật cũ bị xoá/sửa) ⏎ additive-only: existing rule line removed/modified trong scripts/pre-merge-check.sh: ⏎ # cổng không cờ (ca AC-8 của tests/scripts/hang-pr.test.mjs canh). ⏎ elif grep -qs '"road-map@' "$ROOT/.claude/settings.json" && grep -qs '^  chan:' "$ACC/config.yaml"; then ⏎ + actual - `
- `scripts: FAIL: AP-1-khong-bat — Error: Command failed: git -C <tmp> archive --format=tar d01df558cfb6d75246d860824864343caf57583d plugins/acceptance-gate/scripts lib skills commands road-map | fatal: pathspec 'plugins/acceptance-gate/scripts' did not match any files |  |     at genericNodeError (node:internal/errors:985:15) ⏎ fatal: pathspec 'plugins/acceptance-gate/scripts' did not match any files`

**Mẫu — khác:**

- `scripts: FAIL: additive-only.test.mjs (expected exit 0, got 1) ⏎ Results: 4 passed, 1 failed`
- `scripts: FAIL: ban-do-khuon-roi-nhom.test.mjs (expected exit 0, got 1) ⏎ stderr: Buffer(74) [Uint8Array] [ ⏎ 102,  97, 116,  97, 108,  58,  32, 112,  97, 116, 104, 115, ⏎ 112, 101,  99,  32,  39, 112, 108, 117, 103, 105, 110, 115, ⏎ 47,  97,  99,  99, 101, 112, 116,  97, 110,  99, 101,  45, ⏎ 103,  97, 116, 101,  47, 115,  99, 114, 105, 112, 116, 115, ⏎ 39,  32, 100, 105, 100,  32, 110, 111, 116,  32, 109,`
- `plugins: FAIL: P161 strip-md giu duong dan + ma tran toan phan ⏎ P165 F-K ve am: cam superpowers:brainstorming truoc Cong Dang trong doan loi (a), mutant per-file (E1) ⏎ P165 OK (2 thân xanh + 2 mutant per-file đỏ đúng tên)`

**Mẫu — đường dẫn không còn:**

- `scripts: FAIL: AP-7 — Error: ENOENT: no such file or directory, open '<tmp> |     at readFileSync (node:fs:441:20) |     at file://<tmp> |     at chayCa (file://<tmp>`
- `scripts: FAIL: AP-7-lenh — Error: ENOENT: no such file or directory, open '<tmp> |     at readFileSync (node:fs:441:20) |     at file://<tmp> |     at chayCa (file://<tmp>`

**Mẫu — cùng khối có lỗi đường dẫn:**

- `scripts: FAIL: AP-7-do2 — không bắt (cần «xem.md»): ["P32 đỏ: AssertionError: plugins/roadmap/commands/status.md must stay model-invocable (chỉ đọc)"]`
- `scripts: FAIL: ap-chinh-sach-lo-trinh.test.mjs (expected exit 0, got 1) ⏎ Results: 50 passed, 9 failed (ap-chinh-sach-lo-trinh)`

**Mẫu — không chạy tới:**

- `scripts: scripts: [RN-1]`
- `scripts: scripts: [RN-1-do]`

## Số liệu máy đọc

<!-- <<<LOP-DO-SO-LIEU -->
```json
{"bo": {"ban-do": {"dat_cu": 1, "dat_moi": 1, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}, "dieu-phoi": {"dat_cu": 663, "dat_moi": 663, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}, "hooks": {"dat_cu": 80, "dat_moi": 80, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}, "plugins": {"dat_cu": 363, "dat_moi": 362, "do_ca_hai": 0, "do_them": 1, "khong_chay_toi": 0, "lop": {"khac": 1}, "rc_cu": 0, "rc_moi": 1}, "scripts": {"dat_cu": 3648, "dat_moi": 3163, "do_ca_hai": 1, "do_them": 485, "khong_chay_toi": 332, "lop": {"cung-tep": 46, "duong-dan": 34, "khac": 59, "khong-chay-toi": 332, "ten-doi": 14}, "rc_cu": 1, "rc_moi": 1}, "workflows": {"dat_cu": 1036, "dat_moi": 1036, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}}, "cay_moi": "52ab96ad02a252eda9597483f2e5dbb8d2a1a7e1", "lop": {"bo-chay": 0, "cung-tep": 46, "duong-dan": 34, "khac": 60, "khong-chay-toi": 332, "lich-su": 0, "ten-doi": 14}, "nguon": "d8c42965f49e16c2f4d619ff3ba4d27b5eedf433", "tong_do_them": 486}
```
<!-- LOP-DO-SO-LIEU>>> -->
