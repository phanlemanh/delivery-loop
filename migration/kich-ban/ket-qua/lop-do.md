---
nguon: 0fe48c145d7ff6d230a736b1852dfbe3ecc0295b
cay_moi: 53031519ff3fad4931d21104f8b474f823479086
do_luc: 2026-11-17T07:55:13Z
bo: [scripts, hooks, plugins, workflows, dieu-phoi, ban-do]
tong_do_them: 0
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
| scripts | 0 | 0 | 3664 | 3664 | 0 | 0 |
| hooks | 0 | 0 | 80 | 80 | 0 | 0 |
| plugins | 0 | 0 | 363 | 363 | 0 | 0 |
| workflows | 0 | 0 | 1036 | 1036 | 0 | 0 |
| dieu-phoi | 1 | 1 | 662 | 662 | 0 | 0 |
| ban-do | 0 | 0 | 1 | 1 | 0 | 0 |
| **tổng** | | | | | | **0** |

## Đỏ thêm theo lớp

| Lớp | Số ca | scripts | hooks | plugins | workflows | dieu-phoi | ban-do |
|---|---|---|---|---|---|---|---|
| không chạy tới (`khong-chay-toi`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| đường dẫn không còn (`duong-dan`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| cùng khối có lỗi đường dẫn (`cung-tep`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| tên đổi (`ten-doi`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| dựng bản cũ từ lịch sử (`lich-su`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| bộ chết ngầm / bộ chạy không chạy được (`bo-chay`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| khác (`khac`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Số liệu máy đọc

<!-- <<<LOP-DO-SO-LIEU -->
```json
{"bo": {"ban-do": {"dat_cu": 1, "dat_moi": 1, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}, "dieu-phoi": {"dat_cu": 662, "dat_moi": 662, "do_ca_hai": 1, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 1, "rc_moi": 1}, "hooks": {"dat_cu": 80, "dat_moi": 80, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}, "plugins": {"dat_cu": 363, "dat_moi": 363, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}, "scripts": {"dat_cu": 3664, "dat_moi": 3664, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}, "workflows": {"dat_cu": 1036, "dat_moi": 1036, "do_ca_hai": 0, "do_them": 0, "khong_chay_toi": 0, "lop": {}, "rc_cu": 0, "rc_moi": 0}}, "cay_moi": "53031519ff3fad4931d21104f8b474f823479086", "lop": {"bo-chay": 0, "cung-tep": 0, "duong-dan": 0, "khac": 0, "khong-chay-toi": 0, "lich-su": 0, "ten-doi": 0}, "nguon": "0fe48c145d7ff6d230a736b1852dfbe3ecc0295b", "tong_do_them": 0}
```
<!-- LOP-DO-SO-LIEU>>> -->
