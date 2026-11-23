# Hạt giống — lệnh gộp theo lời coi chữ ký giữ chỗ là đã ký

Gốc: delivery-loop/_acceptance/loi-gop-trong-cau-ky/ — Ngoài-2 và Ngoài-4 của Cổng Bằng chứng (21/11/2026), chủ kho
chọn «mở hợp đồng mới».

**Đã làm 22/11:** hồ sơ `_acceptance/va-chu-ky-giu-cho-lenh-gop/` — vế chữ ký của lối theo lời hỏi `chuKyThat` của lõi;
gốc lõi truyền bằng cờ `--loi`, dòng lệnh giải bằng `resolve-plugin.mjs` (ADR 0003); không có bộ đọc thì chặn.

Vòng `loi-gop-trong-cau-ky` thêm lối vào `--theo-loi` cho lệnh gộp của gói điều phối
(`plugins/dispatch/scripts/gop.mjs`). Một trong sáu vế lệnh đòi trước khi gộp là «báo cáo bằng chứng có chữ ký». Vế ấy
đọc bằng hàm riêng `dongChuKy`: nó chỉ hỏi dòng `human_signoff` có chữ hay không. Bộ đọc chữ ký của lõi (`chuKyThat`,
và lưới trước-gộp `pre-merge-check.sh`) loại thêm các giá trị giữ chỗ như «pending», «TBD». `dongChuKy` thì không.

Hệ quả: một báo cáo điền tạm `human_signoff: pending` vẫn qua vế chữ ký của lệnh gộp. Năm vế còn lại vẫn phải đúng
(hợp đồng `signed-off`, dòng lời gộp cùng commit với chữ ký…), nên ca này cần nhiều điều kiện cùng sai. Ở kho chưa nối
lưới trước-gộp vào CI thì không lưới nào chặn, và gộp vào nhánh chính là việc khó đảo.

Nhát sửa: để `dongChuKy` dùng lại vị từ chữ ký của lõi (`chuKyThat` và bảng giữ chỗ của nó), không viết lại vị từ thứ
hai. Thêm một hàng vào ma trận GL-6 của `tests/dieu-phoi/loi/gop-theo-loi.test.mjs`: chữ ký «pending» → 0 lời gọi gộp,
mã 1, thông điệp gọi tên vế chữ ký. Chiều đỏ: bản sao trả `dongChuKy` về chỉ-hỏi-có-chữ → hàng mới đỏ. Chiều im: chữ ký
thật vẫn gộp. Gói điều phối cần một đường tới bộ đọc của lõi, không chép bảng giữ chỗ sang. Giá ước: một vòng T2 nhỏ ở
gói điều phối.
