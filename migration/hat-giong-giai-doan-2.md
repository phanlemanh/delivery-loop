# Hạt giống — các việc giai đoạn 2 đo ra mà không làm trong đợt

**Ngày:** 19/11/2026 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · ghi theo `KE-HOACH-GIAI-DOAN-2.md` mục 5 và việc II.0 (5),
kế hoạch chủ kho duyệt 19/11. Không mở vòng, không tạo ô. Khi đợt đóng, tệp dời sang `docs/plans/` cùng PR đóng đợt.

## 1. Tách nhật ký thay đổi — CÓ ca đọc phần cũ, nên không tách bằng PR tài liệu

Luật của kế hoạch: «Không ca nào đọc phần cũ → tách bằng một PR T1; có ca đọc → hạt giống, đi làn V của mốc kế». Đo trên
`origin/main` `c1cf031a`:

- `tests/scripts/hang-pr.test.mjs` và `tests/scripts/luot-sua-giu-du.test.mjs` cắt `CHANGELOG.md` từ đầu tệp tới mục của một
  mốc gốc cũ (đọc số mốc từ commit `d5931848`, `7b1afe1e`) — tách phần cũ ra là hai ca đỏ.
- `tests/scripts/repin-lane-skip-unchanged.test.mjs` (SK6) tìm một câu trong cả tệp; `tools/bump_version.py --notes` in mục
  của một số bất kỳ.
- 28 tệp `_acceptance/*/evals.yaml` khai `CHANGELOG.md` làm đầu vào — đổi tệp là bằng chứng của các hồ sơ ấy hoá cũ.

Hướng làm khi có người gọi tên: các ca đọc mục cũ chuyển sang đọc qua một bộ đọc chung tìm được mục ở cả tệp sống lẫn tệp
lưu (đường đọc-cũ), rồi mới tách; đi cùng một mốc phát hành (làn V), một lần ghim lại. **Ngưỡng mở:** tệp vượt 8 000 dòng
(hôm nay 5 663), hoặc ≥ 1 lượt chấm đỏ vì đọc nhầm mục của nhật ký.

## 2. Ba giới hạn Design Assembly chuyển cho kit

Đọc 19/11 trong sổ giới hạn công khai của kho `phanlemanh/design-assembly`
(`plugins/design-assembly/references/limits.json`, các mục có `"repo": "delivery-loop"` và còn mở):

| Mã giới hạn bên ấy | Điều đo được (lời kho ấy) | Chạm phần nào của kit |
|---|---|---|
| `token-format-edges` | Phép so màu thô với token của kit chỉ đọc hệ thập lục phân; màu viết theo ký pháp cảm nhận lọt qua | sàn thiết kế, phép so token |
| `kit-readers-split-on-colour` | Thước độ phủ đọc màu dạng đối tượng của chuẩn token hiện hành thành token nhiều phần, còn ô `gate` đòi thập lục phân — chỉ dạng cũ chạy được ở cả hai | hai bộ đọc màu lệch nhau |
| `out-of-git-manifest-lowers-kit-tier` | Kit đọc bậc sàn thiết kế từ tệp trên đĩa; ở cây làm việc mới của kho để sổ thành phần ngoài git, tệp chưa có nên kit đọc bậc thấp hơn và báo thiếu sổ | đọc bậc sàn thiết kế |

Cả ba là đổi hành vi của engine, nên giai đoạn 2 không làm (A2: không vòng meta). Hai giới hạn đầu cùng một lớp — hai bộ đọc
màu của kit không dùng chung một nguồn; nghiệm đúng tầng là một bộ đọc màu dùng chung cho thước độ phủ và ô `gate`. Giới hạn
thứ ba thuộc họ «tệp sinh nằm ngoài git» của DL1 (`hat-giong-sau-goi-dl-ba-kho.md`). **Ngưỡng mở:** một kho tiêu thụ của kit
bị lượt chấm đỏ vì một trong ba điều này, hoặc chủ kho gọi tên cùng DL1.

## 3. Ba chỗ engine 3.0 vấp ở vòng chuyển kho đầu tiên (Quỹ hàng, 19/11)

Phiên của vòng báo; phiên giữ đợt chưa dựng lại từng ca. Cả ba là hành vi engine, nên giai đoạn 2 không sửa (A2).

| Chỗ | Điều thấy | Vòng đã đi vòng qua bằng |
|---|---|---|
| bộ sinh tham số chấm `s4-args` | lấy nhánh `main` CỤC BỘ làm gốc so; bản kéo chậm `origin` thì chặn oan | truyền `--diff-base` tường minh |
| `pr-san-sang` | từ chối mở PR vì `LO-TRINH.html` tự vẽ lại sau lượt chấm | mở PR tay |
| quét bí mật của kho | nhận nhầm mã băm trong tệp tham số chấm là khoá bí mật | để tệp tham số ngoài kho |

Chỗ thứ nhất cùng họ với giới hạn đã ghi của `loop-health` (đọc lịch sử của HEAD bản kéo, không của `--at`): bộ đo của kit
tin bản kéo cục bộ là nhánh chính. **Ngưỡng mở:** cùng chỗ vấp lại ở một kho thứ hai (crm là lần đo kế), hoặc ≥ 1 lượt chấm đỏ
vì nó.
