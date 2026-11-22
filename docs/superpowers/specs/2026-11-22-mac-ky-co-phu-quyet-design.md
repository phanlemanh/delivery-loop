# mac-ky-co-phu-quyet — thiết kế

Hàng 1 của thí điểm «trợ lý quyết định» (đặc tả chủ kho duyệt 22/11/2026, chép ở
`docs/findings/2026-11-22-tro-ly-quyet-dinh.md`). Hàng 2 (`chuyen-gop`) là vòng riêng.

## Vật

Một mô-đun mới `plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs`, ba chế độ:

- `--slug <hồ sơ> --write` — xếp mọi câu `chi-nguoi` còn hiệu lực của sổ S1 rồi nối MỘT dòng máy cho mỗi câu chưa có
  (`"may":"mac-ky","ve":"<mã dòng S1>","di_theo":"khuyen"|"cho-nguoi","so_do":2`, kèm `ly_do` khi chờ người). Kho tắt cờ:
  không ghi byte nào.
- `--slug <hồ sơ> --check` — bộ kiểm lược đồ sổ 2: dòng mang `di_theo` · `pham_vi` · `nguon_lam_lai` · `kiem_mau` phải mang
  `"so_do":2` và giá trị trong tập; sai thì thoát 2 nêu mã dòng.
- `--dem` — sổ đếm toàn kho theo loại câu và danh sách đề nghị thăng cấp / bị giáng.
- `--ghi phu-quyet|kiem-mau|lam-lai` — bên ghi dòng NGƯỜI: máy dịch ý muốn của người (phủ quyết món nào, kiểm mẫu đạt hay
  sai, làm lại vì đâu) thành đúng dòng sổ lược đồ 2, `decided_by` là tên người. Đây là bên viết của mọi đầu vào vòng giáng —
  sổ đếm không đọc dòng nào mà không có bên ghi trong kit.

Bên đọc là bộ xếp căn cứ đã có (`scripts/can-cu-s1.cjs`): câu có dòng máy «khuyen» và VẪN đủ điều kiện lúc đọc ra lớp
`mac-ky`, không đếm vào «câu hỏi N» — nên luật làn V của Cổng Phạm vi (dừng khi N > 0) không phải đổi một chữ. Thẻ Cổng Phạm
vi (`scripts/gate-card.js`) in khối «Đã đi theo khuyến nghị — phủ quyết trước khi gộp nếu khác ý», cờ kiểm mẫu, và
`--extract` mang `can_cu.mac_ky`. Mọi khoá mới chỉ xuất hiện khi kho bật cờ.

## Điều kiện mặc-ký (đóng-khi-ngờ, xét theo thứ tự)

khó đảo → luật sản phẩm → chạm tiền hay gửi ra ngoài (`can_cu.tien` / `can_cu.ra_ngoai`) → hợp đồng không khai `surfaces` → hàng màn hình (`ui`, `web`, `web-ui`, `mobile`) → surfaces ngoài danh sách CHO PHÉP backend
(`api`, `cli`, `sdk`, `docs`, `ci`, `config`, `db`, `tool`; giá trị lạ như `frontend`, `desktop`, `email` = hỏi người) → loại câu lạ
hay vắng → loại kho tắt (`loai_tat`) → giữ-quyền → vùng không rõ → vùng tầng `high` của `governance/autonomy.yaml` → vùng
`khong_bao_gio` của kho → (khi có gốc nhánh) tệp thật ngoài vùng khai (`vung-lech`) hay tệp thật chạm `high` → lần đầu của loại → lần đầu của vùng → loại vừa bị giáng. Qua hết: `thang-cap` nếu loại nằm trong
`thang_cap` và còn sạch, không thì `mac-ky`.

- **Vùng** = `can_cu.vung` của dòng S1 ∪ `ranh_gioi` của hàng trong `hang-viec.json` của đợt (bỏ `_acceptance/`). Hai glob
  «chồng» khi tiền tố chữ của bên này là tiền tố của bên kia; glob không có tiền tố chữ (`**/migrations/**`) thử khớp trên
  đầu dò của bên kia. Phép so dư về phía hỏi người. Ở bước thiết kế chưa có tệp, nên vùng là KHAI; từ lúc có code, bộ xếp
  nhận gốc nhánh (`--base`, thẻ truyền gốc nhánh sẵn có) và so tệp thật của diff (trừ `_acceptance/`, `docs/`) với vùng khai —
  lệch thì món về câu hỏi. Lưới cuối ở cửa gộp là tầng của luật tự trị trên tệp thật (hàng 2).
- **Giữ-quyền** = `giu-quyen.txt` trong thư mục đợt (`.acceptance-runs/dieu-phoi-hien-tai/`, giải từ `--git-common-dir`
  như `trong-dot.mjs`), mỗi dòng một slug hay một glob vùng, `#` là chú thích.
- **Cửa sổ thăng cấp** = các lần trả lời (hồ sơ không ở `draft`) SAU sự kiện giáng gần nhất của loại — phủ quyết một món
  mặc-ký, kiểm mẫu ra sai, làm lại do phủ quyết. Đạt ngưỡng = số lần trong cửa sổ ≥ `nguong_hoi` ∧ % theo ≥ `nguong_theo`
  ∧ làm lại do phủ quyết ≤ `nguong_lam_lai` ∧ 0 lần kéo trong cửa sổ. Loại trong `thang_cap` mà cửa sổ không còn đạt = bị
  giáng: món chưa gộp đang mang dòng máy của loại ấy về lại câu hỏi ở lần dựng thẻ kế (bộ đọc xét lại lúc đọc), và `--dem`
  liệt các hồ sơ chưa ký phải kiểm lại. Sau một sự kiện giáng, loại hỏi người tới khi có ít nhất một lần trả lời mới.
- **Lần hỏi** (mẫu số của thăng cấp) = lần NGƯỜI THẬT trả lời: câu hỏi thường đã qua cổng, món mặc-ký bị người quyết lại,
  hay món mặc-ký người đã soi kiểm mẫu. Món mặc-ký người im lặng không tính — in ở cột «mặc-ký im lặng» riêng; nếu tính,
  năm lần im lặng tự trình thăng cấp một loại người chưa từng trả lời.
- **Kéo sau mặc-ký** (lối thẻ cổng gợi ý): `--write` gặp món đã có dòng máy mà nay khớp `giu-quyen.txt` thì nối một dòng
  sự kiện `su_kien: keo` riêng, mỗi dòng giữ-quyền một lần — mọi lần kéo đều vào sổ đếm.
- **Kiểm mẫu** = băm sha256 của slug, 8 chữ hex đầu, chia dư cho `kiem_mau_moi` bằng 0 — tất định, không ai chọn tay được.

## Cấu hình của kho (`_acceptance/config.yaml`)

```
tro_ly_quyet_dinh:
  mac_ky: false        # bật mặc-ký; vắng hay false = hành vi cũ từng byte
  nguong_hoi: 5
  nguong_theo: 100     # phần trăm
  nguong_lam_lai: 0
  kiem_mau_moi: 5      # 1 = soi mọi hồ sơ
  loai_tat: []         # thu hẹp danh mục (chỉ thu hẹp)
  khong_bao_gio: []    # glob bổ sung danh sách không-bao-giờ-tự
  thang_cap: []        # loại chủ kho đã ký thăng cấp
  nguoi_quyet: ""      # người quyết mặc định — ghi vào dòng máy
```

Khoá sai giá trị (số không dương, mã loại ngoài danh mục, `mac_ky` không phải true/false) → thoát 2 nêu tên khoá. Thẻ đọc
qua bộ xếp: cấu hình hỏng thì mọi câu vẫn là câu hỏi và thẻ có một cờ vàng.

## Không làm ở vòng này

- Nút bấm trên bảng đợt (pane) — thẻ in đường giữ-quyền và phủ quyết bằng chữ; bảng đợt là việc sau.
- «Từ nay» thành luật máy trích tự động — vòng này chỉ ghi trường `pham_vi` và đếm án lệ.
- Chuyến gộp và nối luật tự trị qua cửa proof — hàng 2.
- Bật cờ ở kho nào — kho nâng bản kit rồi tự bật; kit tự host để tắt.
