# Hạt giống — chỗ plugin lõi bám vào plugin điều phối và tên plugin cũ (sửa ở kho cũ trước ngày cắt)

Ghi 13/11/2026 từ vòng B1 `kich-ban-chuyen-nha` (hồ sơ `_acceptance/kich-ban-chuyen-nha/`, dòng sổ S3 thay
`d-20261113T114101Z-21`). Đây là SỔ, không phải ô: mở vòng khi chủ kho gọi tên, ở kho cũ `acceptance-gate-kit`, trước ngày cắt.

**Gốc:** cây do kịch bản dựng từ `kit-cu/main` `0c4e503b` (nhánh `don-nha/3.0`). Kịch bản chỉ làm phép biến đổi cơ học; các
chỗ dưới đây là sửa NGỮ NGHĨA sản phẩm nên thuộc kho cũ (`.claude/rules/chuyen-nha.md`).

## 1. Lõi gọi thẳng thư mục điều phối — treo ở cây mới

Sổ kiểm kê chạy trên `don-nha/3.0` (`kiemKe`, `migration/tra-soat/kiem-ke.mjs`) báo các đường sau treo; trên nguồn chúng chạy
chỉ vì plugin lõi mang cả kho.

| Tệp (cây mới) | Dòng | Trỏ tới |
|---|---|---|
| `plugins/acceptance-gate/commands/acceptance-init.md` | 193–195 | `${CLAUDE_PLUGIN_ROOT}/dieu-phoi/scripts/{hinh-dang,cau-hinh,dot}.mjs` |
| `plugins/acceptance-gate/scripts/tin-hieu.mjs` | 27, 30 | `../dieu-phoi/scripts/{hinh-dang,dot}.mjs` |
| `plugins/acceptance-gate/scripts/gui-tin-hieu.mjs` | 12–13 | `../dieu-phoi/scripts/{cua-tin-hieu,hinh-dang}.mjs` (sổ nguồn, `tham-chieu-cheo.tsv`) |

Đường đúng tầng (chọn ở vòng ấy): tìm plugin điều phối qua `resolve-plugin` như 32 chỗ gọi chéo khác đã làm, hoặc dời bốn
tệp dùng chung (`hinh-dang`, `cau-hinh`, `dot`, `cua-tin-hieu`) về plugin lõi. Lưu ý: điều phối là plugin bật-theo-lựa-chọn mà
lõi lại phụ thuộc thẳng vào nó.

## 2. Hằng mã tra plugin theo tên cũ

Luật đổi chữ có neo của kịch bản không đổi tên plugin viết trần trong ngoặc, vì chữ ấy lẫn văn xuôi («gói `road-map`») với hằng mã.
Ba hằng mã tra plugin theo tên — sau đổi tên chúng tra một plugin không còn:

| Tệp (nguồn) | Chỗ | Hệ quả ở cây mới |
|---|---|---|
| `lib/chan-lo-trinh.cjs` | `const GOI_ROAD_MAP = 'road-map'` | chặn lộ trình không nhận ra gói `roadmap` đã bật |
| `scripts/lo-trinh-khoi-tao.mjs` | `export const GOI_ROAD_MAP = 'road-map'` | khởi tạo lộ trình không nhận ra gói `roadmap` |
| `scripts/kiem-ban-cai.mjs` | `p('dieu-phoi')`, mục `dieu-phoi` | kiểm bản cài không thấy bản cài `dispatch` |

Thư mục trạng thái máy `~/.claude/dieu-phoi/may` (`dieu-phoi/scripts/may.mjs`) không phải tên plugin — giữ.

Đường đúng tầng: đọc tên plugin từ một nguồn (tệp khai chợ, hoặc một hằng dùng chung sinh từ bảng tên) thay vì chữ cứng.

## 3. Ngưỡng

Mở trước ngày cắt — B3 chưa cắt được khi mục 1 còn treo (bản cài 3.0 hỏng gửi tín hiệu và `acceptance-init`). Đếm lại bằng:
`node -e "import('./migration/tra-soat/kiem-ke.mjs').then(({kiemKe})=>console.log(kiemKe({kho:'.',ref:'don-nha/3.0',luat:'migration/tra-soat/luat-xep.json'}).treo.filter(t=>t.tu.startsWith('plugins/')&&!/vendor/.test(t.tu)).length))"`
— 0 là xong.
