# migration/ — đợt chuyển `acceptance-gate-kit` sang `delivery-loop`

Thư mục này chỉ sống ở nhánh `chuyen-nha` cho tới ngày cắt sang (mốc 3.0). Thứ tự đọc: theo `.claude/rules/chuyen-nha.md` (trạng thái → bối cảnh → kế hoạch); `MO-PHIEN.md` đọc khi dựng máy.

| Tệp | Là gì |
|---|---|
| `KHAC-BIET-DU-KIEN.md` | **Bảng chủ kho dò lúc ký mốc 3.0**: mỗi điều trước và sau ngày cắt, trạng thái quyết, kiểm bằng gì |
| `NOI-REPO-STANDARDS.md` | Ranh giới và điểm nối giữa Repo Standards (`repo-setup`) và kho này — ai sở hữu gì, tám điểm nối, mười mục `doctor` trượt và ai giải |
| `TRANG-THAI.md` | **Tệp sống** — máy nào đang giữ, đã xong, đang dở, việc kế, quyết định còn chờ chủ kho |
| `MO-PHIEN.md` | Máy cần có gì, lệnh kéo kho, cách nhận giữ, lời mở phiên |
| `BOI-CANH.md` | Quyết định đã có, luật của đợt, bẫy đã dẫm, thứ không nằm trong kho |
| `KE-HOACH.md` | Kế hoạch đầy đủ — mục 3, 12, 13, 14 là bản đang hiệu lực |
| `tra-soat/` | Ba sổ máy sinh cho B1: kiểm kê tệp của kit, chỗ hai kho tiêu thụ bám vào kit, tệp kiểm bám bố cục cũ — đọc `tra-soat/README.md` |
| `chay-thu-phien/` | Ca chạy thử phiên thật của thước B1: phiên Claude Code mở trên chợ của một cây nạp được gì, so cũ với mới qua `bang-ten.json` — đọc đầu tệp `chay-thu.mjs` |
| `b0/` | Đo thử B0: dựng ba bản sao (`dung-ban-sao.sh`), chạy bộ kiểm (`chay.sh`), tách ca đỏ (`tach.py`), kết quả tóm (`ket-qua/`) |

Ngoài thư mục này, nhánh `chuyen-nha` chỉ thêm một tệp: `.claude/rules/chuyen-nha.md` (chỉ đường cho phiên mới).

Kịch bản chuyển nhà (vòng B1) sẽ đặt ở đây.
