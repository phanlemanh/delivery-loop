---
nguon: 0c4e503b1d9649faa6948dd169573717b6dddce4
cay_moi: 2097a267f88ee45207720b0cfaf915a2bde1d8f9
do_luc: 2026-11-13T13:31:09Z
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
thường là ca chạy theo ca đã đỏ. Một lượt đo mỗi cây trên một máy.

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
| đường dẫn không còn (`duong-dan`) | 1032 | 642 | 33 | 46 | 0 | 311 | 0 |
| cùng tệp kiểm có lỗi đường dẫn (`cung-tep`) | 493 | 469 | 24 | 0 | 0 | 0 | 0 |
| tên đổi (`ten-doi`) | 31 | 5 | 0 | 2 | 0 | 24 | 0 |
| dựng bản cũ từ lịch sử (`lich-su`) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| bộ chạy không chạy được (`bo-chay`) | 2 | 0 | 0 | 0 | 1 | 0 | 1 |
| khác (`khac`) | 232 | 72 | 14 | 109 | 0 | 37 | 0 |

**Mẫu — đường dẫn không còn:**

- `scripts: FAIL: A01 (expected exit 1, got 127) ⏎ A01 implemented + empty approved_by + no gate1_skipped -> fail`
- `scripts: FAIL: A02 (expected exit 0, got 127) ⏎ A02 gate1_skipped: true + empty approved_by -> clean + NOTE`
- `scripts: FAIL: AC-1 — hàng chi-t1: mã 127; hang=undefined (mong T1); cham_vat=undefined (mong false); ly_do=undefined (mong phan-loai) · stderr: bash: <tmp> No such file or directory`

**Mẫu — cùng tệp kiểm có lỗi đường dẫn:**

- `scripts: FAIL: A01-msg (expected approved_by violation) ⏎ A02 gate1_skipped: true + empty approved_by -> clean + NOTE`
- `scripts: FAIL: A02-note (expected gate1_skipped NOTE)`
- `scripts: FAIL: AC-11 — s4-args gắn khung khi ảnh ghi đường tuyệt đối có thật; vắng thì nói ra — s4-args exit 1:   requireStack: [] | } | Node.js v24.16.0`

**Mẫu — khác:**

- `scripts: FAIL: DG-CC1 static co co tren dich khong phai HTML (tsx-sach: đối chứng hỏng — không cờ mà mã 1/undefined | tsx-sach: mã 1, mong 5 | tsx-sach: stdout không phải JSON | jsx-sach: đối chứng hỏng — không cờ mà mã 1/undefined | jsx-sach: mã 1, mong 5 | jsx-sach: `
- `scripts: FAIL: DG-CC2 loi chan thay duoc tren tsx (tsx-anh-rong: 1/undefined, mong 2/REJECT | tsx-anh-rong: blocking undefined thiếu broken-image | tsx-anh-rong: thiếu do_duoc: false)`
- `scripts: FAIL: DG-CC3 HTML doi theo co (html-sach (có cờ): 1/undefined, mong 0/PASS | html-sach (không cờ): 1/undefined, mong 0/PASS | html-hoa (có cờ): 1/undefined, mong 0/PASS | html-hoa (không cờ): 1/undefined, mong 0/PASS | html-anh-rong (có cờ): 1/undefined, mong `

**Mẫu — tên đổi:**

- `scripts: FAIL: DV4a recheck MỚI trên MỌI evidence-report thật của repo -> 0 fail NGOÀI grandfather ⏎ DV4a: hồ sơ đỏ NGOÀI danh sách grandfather — đây là lỗi mới, không phải nợ cũ: anh-co-that-trong-ho-so, ap-chinh-sach-lo-trinh, bai-hoc-do-luong-vao-engine, ban-do-khuo`
- `scripts: FAIL: JR11b recheck strict trên corpus thật == baseline viết-trước (0 fail NGOÀI grandfather) ⏎ JR11b: hồ sơ đỏ NGOÀI danh sách grandfather — đây là lỗi mới, không phải nợ cũ: anh-co-that-trong-ho-so, ap-chinh-sach-lo-trinh, bai-hoc-do-luong-vao-engine, ban-do`
- `scripts: FAIL: cat-luot-vung.test.mjs (expected exit 0, got 1) ⏎  ⏎ CV Results: 0 passed, 12 failed`

**Mẫu — bộ chạy không chạy được:**

- `workflows: bộ thoát 1 mà không in ca đỏ nào`
- `ban-do: bộ thoát 1 mà không in ca đỏ nào`

## Ca đỏ ở cả hai cây (tách khỏi «đỏ thêm»)

- scripts: `moc-chien-dich.test.mjs`

## Số liệu máy đọc

<!-- <<<LOP-DO-SO-LIEU -->
```json
{"bo": {"ban-do": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 0, "do_them": 1, "lop": {"bo-chay": 1}, "rc_cu": 0, "rc_moi": 1}, "dieu-phoi": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 372, "do_them": 372, "lop": {"duong-dan": 311, "khac": 37, "ten-doi": 24}, "rc_cu": 0, "rc_moi": 1}, "hooks": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 71, "do_them": 71, "lop": {"cung-tep": 24, "duong-dan": 33, "khac": 14}, "rc_cu": 0, "rc_moi": 1}, "plugins": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 157, "do_them": 157, "lop": {"duong-dan": 46, "khac": 109, "ten-doi": 2}, "rc_cu": 0, "rc_moi": 1}, "scripts": {"ca_hai": ["moc-chien-dich.test.mjs"], "chi_do_cu": 1, "do_ca_hai": 1, "do_cu": 2, "do_moi": 1189, "do_them": 1188, "lop": {"cung-tep": 469, "duong-dan": 642, "khac": 72, "ten-doi": 5}, "rc_cu": 1, "rc_moi": 1}, "workflows": {"ca_hai": [], "chi_do_cu": 0, "do_ca_hai": 0, "do_cu": 0, "do_moi": 0, "do_them": 1, "lop": {"bo-chay": 1}, "rc_cu": 0, "rc_moi": 1}}, "cay_moi": "2097a267f88ee45207720b0cfaf915a2bde1d8f9", "lop": {"bo-chay": 2, "cung-tep": 493, "duong-dan": 1032, "khac": 232, "lich-su": 0, "ten-doi": 31}, "nguon": "0c4e503b1d9649faa6948dd169573717b6dddce4", "tong_do_them": 1790}
```
<!-- LOP-DO-SO-LIEU>>> -->
