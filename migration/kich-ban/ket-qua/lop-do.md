---
nguon: 3341b8dce56e85405c73ee59faf743675da257e7
cay_moi: 7b66ff849fccfc93135a7fc597f9a12683268ed7
do_luc: 2026-11-17T00:23:15Z
bo: [scripts, hooks, plugins, workflows, dieu-phoi, ban-do]
tong_do_them: 57
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
| scripts | 0 | 1 | 3659 | 3645 | 47 | 57 |
| hooks | 0 | 0 | 80 | 80 | 0 | 0 |
| plugins | 0 | 0 | 363 | 363 | 0 | 0 |
| workflows | 0 | 0 | 1036 | 1036 | 0 | 0 |
| dieu-phoi | 0 | 0 | 663 | 663 | 0 | 0 |
| ban-do | 0 | 0 | 1 | 1 | 0 | 0 |
| **tổng** | | | | | | **57** |

## Đỏ thêm theo lớp

| Lớp | Số ca | scripts | hooks | plugins | workflows | dieu-phoi | ban-do |
|---|---|---|---|---|---|---|---|
| không chạy tới (`khong-chay-toi`) | 47 | 47 | 0 | 0 | 0 | 0 | 0 |
| đường dẫn không còn (`duong-dan`) | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| cùng khối có lỗi đường dẫn (`cung-tep`) | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| tên đổi (`ten-doi`) | 3 | 3 | 0 | 0 | 0 | 0 | 0 |
| dựng bản cũ từ lịch sử (`lich-su`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| bộ chết ngầm / bộ chạy không chạy được (`bo-chay`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| khác (`khac`) | 5 | 5 | 0 | 0 | 0 | 0 | 0 |

**Mẫu — tên đổi:**

- `scripts: FAIL: DV5 plugins/acceptance-gate/scripts/pre-merge-check.sh: diff so với base 909dffd CHỈ THÊM (0 dòng luật cũ bị xoá/sửa) ⏎ additive-only: existing rule line removed/modified trong scripts/pre-merge-check.sh: ⏎ # cổng không cờ (ca AC-8 của tests/scripts/hang-pr.test.mjs canh). ⏎ elif grep -qs '"road-map@' "$ROOT/.claude/settings.json" && grep -qs '^  chan:' "$ACC/config.yaml"; then ⏎ + actual - `
- `scripts: FAIL: KM-1 — khong-settings: thiếu dòng «kho chưa cài road-map ở phạm vi kho — không tạo lộ trình» ; khong-khoa: thiếu dòng «kho chưa cài road-map ở phạm vi kho — không tạo lộ trình» ; khoa-false: thiếu dòng «kho chưa cài road-map ở phạm vi kho — không tạo lộ trình» ; chi-local: thiếu dòng «kho chưa cài road-map ở phạm vi kho — không tạo lộ trình»`

**Mẫu — khác:**

- `scripts: FAIL: additive-only.test.mjs (expected exit 0, got 1) ⏎ Results: 4 passed, 1 failed`
- `scripts: FAIL: khoi-khuon-tren-the-cong.test.mjs (expected exit 0, got 1)`

**Mẫu — không chạy tới:**

- `scripts: scripts: BC plugins/acceptance-gate/skills/acceptance/SKILL.md · cây phẳng`
- `scripts: scripts: BC plugins/acceptance-gate/skills/acceptance/SKILL.md · kho mới`

**Mẫu — đường dẫn không còn:**

- `scripts: FAIL: CT-10-do — Error [ERR_MODULE_NOT_FOUND]: Cannot find module '<tmp> imported from <tmp> |     at finalizeResolution (node:internal/modules/esm/resolve:271:11) |     at moduleResolve (node:internal/modules/esm/resolve:865:10) ⏎ Results: 42 passed, 1 failed`

**Mẫu — cùng khối có lỗi đường dẫn:**

- `scripts: FAIL: cua-tin-hieu-giua-chien-dich.test.mjs (expected exit 0, got 1) ⏎ Results: 42 passed, 1 failed`

## Số liệu máy đọc

<!-- <<<LOP-DO-SO-LIEU -->
```json
{"bo": {"ban-do": {"dat_cu": 1, "dat_moi": 1, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}, "dieu-phoi": {"dat_cu": 663, "dat_moi": 663, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}, "hooks": {"dat_cu": 80, "dat_moi": 80, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}, "plugins": {"dat_cu": 363, "dat_moi": 363, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}, "scripts": {"dat_cu": 3659, "dat_moi": 3645, "do_ca_hai": 0, "do_them": 57, "khong_chay_toi": 47, "lop": {"cung-tep": 1, "duong-dan": 1, "khac": 5, "khong-chay-toi": 47, "ten-doi": 3}, "rc_cu": 0, "rc_moi": 1}, "workflows": {"dat_cu": 1036, "dat_moi": 1036, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}}, "cay_moi": "7b66ff849fccfc93135a7fc597f9a12683268ed7", "lop": {"bo-chay": 0, "cung-tep": 1, "duong-dan": 1, "khac": 5, "khong-chay-toi": 47, "lich-su": 0, "ten-doi": 3}, "nguon": "3341b8dce56e85405c73ee59faf743675da257e7", "tong_do_them": 57}
```
<!-- LOP-DO-SO-LIEU>>> -->
