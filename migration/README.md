# migration/ — đợt chuyển `acceptance-gate-kit` sang `delivery-loop`

Thư mục này chỉ sống ở nhánh `chuyen-nha` cho tới ngày cắt sang (mốc 3.0). Đọc theo thứ tự trong bảng.

| Tệp | Là gì |
|---|---|
| `TRANG-THAI.md` | **Tệp sống** — máy nào đang giữ, đã xong, đang dở, việc kế, quyết định còn chờ chủ kho |
| `MO-PHIEN.md` | Máy cần có gì, lệnh kéo kho, cách nhận giữ, lời mở phiên |
| `BOI-CANH.md` | Quyết định đã có, luật của đợt, bẫy đã dẫm, thứ không nằm trong kho |
| `KE-HOACH.md` | Kế hoạch đầy đủ — mục 12–13 là bản đang hiệu lực |
| `b0/` | Đo thử B0: dựng ba bản sao (`dung-ban-sao.sh`), chạy bộ kiểm (`chay.sh`), tách ca đỏ (`tach.py`), kết quả tóm (`ket-qua/`) |

Ngoài thư mục này, nhánh `chuyen-nha` chỉ thêm một tệp: `.claude/rules/chuyen-nha.md` (chỉ đường cho phiên mới).

Kịch bản chuyển nhà (vòng B1) sẽ đặt ở đây.
