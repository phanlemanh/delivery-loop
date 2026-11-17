---
nguon: 0fe48c145d7ff6d230a736b1852dfbe3ecc0295b
cay_moi: 53031519ff3fad4931d21104f8b474f823479086
phan_quyet: giu-du
tong: 5807
bo: 0
thieu: 0
---

# Giữ đủ khoá ca — cây cũ so cây mới (B2 AC-4)

Máy sinh bởi `migration/kich-ban/do-lop-do.sh` → `bao-cao-giu-khoa.mjs` — đừng sửa tay; thước `thuoc-that.mjs --giu-khoa` chạy
lại phép so trên hai túi khoá ở `giu-khoa/` và đối chiếu từng số với tệp này.

## Các bước kiểm (việc `tests` của gate.yml mỗi cây)

Hai cây chạy song song. Bước đỏ ở CẢ HAI cây được chạy lại một lần, lần lượt từng cây (`chay-lai-do.sh`, lời chủ kho «Chạy
lại bước đỏ», 17/11); túi khoá của bước ấy lấy từ lần chạy lại. Bước đỏ ở một cây không bao giờ chạy lại. «-» = không chạy lại.

| Bước | Loại | Mã thoát cây cũ | Mã thoát cây mới | Chạy lại cây cũ | Chạy lại cây mới |
|---|---|---|---|---|---|
| scripts | bash | 0 | 0 | - | - |
| hooks | bash | 0 | 0 | - | - |
| plugins | bash | 0 | 0 | - | - |
| workflows | bash | 0 | 0 | - | - |
| dieu-phoi | tap | 1 | 1 | 0 | 0 |
| ban-do | mot-khoa | 0 | 0 | - | - |

## Phán quyết: giữ đủ 5807/5807 khoá, bỏ 0

## Danh sách bỏ (bo-khoa.tsv, nguyên văn)

rỗng

## Khoá thiếu (0)

không có

## Khoá thừa ở cây mới: 0
