# Hạt giống — ca P33 chỉ bắt chuỗi `plugins/cache`, không thấy kiểu dò bộ đệm bằng đường tương đối

Gốc: delivery-loop/_acceptance/va-chu-ky-giu-cho-lenh-gop/ — Notes «Đã đối chiếu ADR 0003 và ca P33» (21/11/2026): thiết kế
nháp của vòng cho gói điều phối tự tìm lõi ở `<chỗ của chính nó>/../../../acceptance-gate/<số>/` và tự chọn bản mới nhất.

ADR 0003 đặt `plugins/feature-loop/scripts/resolve-plugin.mjs` làm đường duy nhất tới một plugin khác (sắp theo semver, bản
được chọn phải có thật các tệp `--require`, không thấy thì báo kèm lệnh cài). Răng của luật là ca P33 trong
`tests/plugins/run-tests.sh`: nó quét bảy vùng nguồn và đỏ khi một tệp mang chuỗi `plugins/cache`, cộng chiều đỏ «chép
`resolve-plugin.mjs` vào gói điều phối».

Chỗ mù: bộ định vị thứ hai không cần viết chuỗi ấy. Ghép đường từ vị trí của chính tệp (`path.resolve(DAY, '..', '..',
'..', '<plugin>', <số>)`) rồi tự sắp số bản đi đúng bố cục `<chợ>/<plugin>/<số>/` của bộ đệm mà P33 vẫn xanh. Thiết kế
nháp của vòng trên đã viết đúng hình dạng đó; nó bị bắt bằng mắt người rà (phiên giữ đợt), không bằng ca kiểm. Vòng đã sửa
thiết kế (cờ `--loi` giải bằng `resolve-plugin.mjs`), nên trên `main` hôm nay không có tệp nào mang hình dạng này — lỗ là
ở thước, không ở vật.

Nhát sửa gợi ý: P33 đo thêm hình dạng, không chỉ chuỗi — tệp nguồn ngoài `resolve-plugin.mjs` ghép đường đi lên quá gốc gói
của chính nó (`..` vượt thư mục plugin) tới tên một plugin anh em, hay sắp danh sách thư mục theo số bản. Hai chiều: bản
sao gói điều phối mang thân tìm-lõi của bản nháp (lấy từ hồ sơ trên) → đỏ nêu tệp; cây nguyên vẹn → xanh; đường tương đối
hợp lệ trong cùng gói (`../scripts/…`) → im. Giá ước: một vòng T2 nhỏ ở suite plugins.
