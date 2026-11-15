# Nhóm a6: mục vá B2 cho bảy tệp bộ scripts (cây mới `8d797a91`)

## Tệp nộp
- `va.json`: 22 mục trên 6 tệp. Đã kiểm hai việc trên một bản sao MỚI của cây B (`kiem/`). Một: áp đủ 22/22 mục, không mục nào lệch `so_lan`. Hai: phép đảo `phepDao` + `daoTep` của `kiem-cho.mjs` (chạy bằng `dao.mjs`) trả về đúng từng byte bản ở cây A cho cả 7 tệp.
- `va-ngoai-thuoc.json`: 2 mục, áp SAU `va.json`, gỡ thêm 2 ca. Cả hai qua phép thử của bản giao: đổi ngược đường/tên mới về cũ thì ra đúng chuỗi ở A. Nhưng `phepDao` hiện chưa có luật đảo cho dạng của chúng, nên `kiem-cho` sẽ báo «tệp kiểm lệch luật». Gộp vào `va.json` chỉ khi đã thêm luật (xem mục B).

Số đếm lấy từ lượt chạy từng tệp riêng (`out1/`). Đếm theo khoá PASS của cây A, khoá mức tệp tính là một ca. Ca LT-94 không có trong bảy tệp này. Không ca nào đỏ vì hết giờ.

## Bảng

| tệp | đỏ trước | đỏ sau `va.json` | đỏ sau thêm `va-ngoai-thuoc` | ca còn đỏ · lớp · một câu |
|---|---|---|---|---|
| cua-tin-hieu-goc-moi-worktree | 22 | **5** | 5 | GW-4, GW-4-con, GW-4-do, GW-4-do2 (+ mức tệp) · ngu-nghia · mảng `CAY` dùng chung cho `git archive GOC_SHA` (bố cục cũ) và `banSao` (bố cục mới); `khoiLenh(goc)` đọc `plugins/roadmap/commands/suggest.md` trên cả hai |
| kho-moi-cai-goi-road-map | 20 | **17** | 16 | KM-1-do, KM-1-do2, KM-2-do, KM-3-do, KM-5-do, KM-5-do2, KM-5-dut-1..4, KM-6-do, KM-7-do · ngu-nghia · xem C1. KM-7-co-viec, KM-8-khoi-khac · ngu-nghia · `banGoc()` archive dùng chung `MA`. KM-1-do3 · kho-cu · xem D2. KM-1 · gỡ bằng `va-ngoai-thuoc` (tên trong câu sản phẩm) |
| kho-cam-ket-co-lo-trinh | 16 | **8** | 8 | CK-4, CK-4-do, CK-4-do2, CK-4-settings-hong, CK-4-settings-hong-do, CK-5-tat · ngu-nghia · `MA` dùng chung cho `bayGoc()` (archive) và `banSao`. CK-4-lib · kho-cu · xem D1 |
| tin-hieu | 9 | **5** | 5 | TH-10-ong, TH-10-do · kho-cu · xem D3. CN-2, CN-2-do · ngu-nghia · xem C2 |
| cua-tin-hieu-giua-chien-dich | 8 | **7** | 6 | CT-4, CT-4-do, CT-4-do2, CT-8-khong, CT-8-do2 · ngu-nghia · `CAY` dùng chung cho `gocMay()` (archive) và `banSao`. CT-10-do · gỡ bằng `va-ngoai-thuoc` (đường tương đối giữa hai plugin) |
| consumer-esm | 7 (+ mức tệp) | **0** | 0 | — (thoát 0, 16/16) |
| ngay-ky | 2 | **2** | 2 | NK-2-do (+ mức tệp) · ngu-nghia · `cay({sha})` archive mảng `D` (đường mới), rồi `bonMat` đọc đường mới trên cây bố cục cũ |

**Tổng số ca gỡ được:** 40 ca với `va.json` (GW 17 · CK 8 · CE 7 · TH 4 · KM 3 · CT 1); thêm 2 ca với `va-ngoai-thuoc.json` (KM-1, CT-10-do). Tệp consumer-esm xanh trọn.

## A. Nội dung các mục vá (đều đúng dạng (a) hoặc (b) của bản giao)
- **Kho tiêu thụ giả lập giữ bố cục kho tiêu thụ.** Các đường bên trong SIM, `d`, `g` của các bản chép theo INIT-CI-COPY-LIST được đưa lại về `scripts/` và `lib/` (consumer-esm, kho-cam-ket `chayLuoi`/`boQua`, kho-moi km6/KM-6-lech). Cùng nhóm này là các chuỗi so trong dòng `${CLAUDE_PLUGIN_ROOT}/…` của acceptance-init.md (CK-9, KM-6-do).
- **Nguồn chép và `$AG` là gốc plugin lõi, không phải gốc kho.** Các chỗ sau đổi thành `` `${X}/plugins/acceptance-gate` ``:
  - `path.join(kit|KIT, m.nguon)`;
  - `AG: kit` trong env (TH-9, CN-8);
  - `AG='${kit|KIT}'` (CK-7/8/9, KM-7-mo-o);
  - `replaceAll('$AG', goc)` (GW, CT-7-lenh).
- **Đổi tên lệnh.** `gui.md` → `suggest.md` (bảng tên `road-map:gui` → `roadmap:suggest`), ở GW và CT-7-lenh.
- **Nhát tiêm TH-9-do.** Đưa lại `$AG/scripts/tin-hieu.mjs`: SKILL.md của sản phẩm vẫn viết đường tương đối gốc plugin.

## B. Hai mục ngoài thước (`va-ngoai-thuoc.json`)
1. kho-moi: `CHUA_CAI = 'kho chưa cài road-map …'` → `roadmap`. Sản phẩm in tên gói qua `GOI_ROAD_MAP`, nay ra `roadmap` (`lo-trinh-khoi-tao.mjs:32`). `phepDao` chỉ đảo tên plugin ở các dạng `x:`, `x@`, `--plugin x`, `plugin: 'x'`, `'x': {` và `'x'` đứng trần. Nó không đảo tên nằm giữa một câu.
2. cua-tin-hieu-giua-chien-dich CT-10-do: nhát tiêm `'../../plugins/acceptance-gate/scripts/tin-hieu-khoa.cjs'` → `'../../acceptance-gate/scripts/tin-hieu-khoa.cjs'`. Đây là đường tương đối từ `plugins/dispatch/scripts/` tới đúng chỗ cũ là `../../scripts/` từ `dieu-phoi/scripts/`. Luật bước 6 chèn `plugins/` vào sau `../..`, nên đường trỏ sai sang `plugins/plugins/…`. `phepDao` không đảo được đường tương đối giữa hai plugin.

## C. Lớp ngu-nghia
- **C1 (kho-moi, 12 ca).** Ở bố cục cũ, `.claude-plugin/` vừa chứa marketplace.json vừa chứa plugin.json của lõi. Bố cục mới tách plugin.json sang `plugins/acceptance-gate/.claude-plugin/`. `banSao` chép theo `MA` nên thiếu thư mục này. Khi đó `khoaBat` của `lo-trinh-khoi-tao.mjs` không gặp marketplace cạnh gốc gói, và cũng không gặp plugin.json để dùng nhánh dự phòng của #503. Nó thoát 2, nên mọi ca đỏ chạy trên bản sao đều hỏng. **Đề xuất:** thêm `'plugins/acceptance-gate/.claude-plugin'` vào `MA`. Đã thử: 12 ca này xanh, chỉ còn KM-1-do3, KM-7-co-viec và KM-8-khoi-khac đỏ.
- **C2 (tin-hieu CN-2, CN-2-do).** Bản base là `294b29db:scripts/tin-hieu.mjs`, ghi vào `plugins/acceptance-gate/scripts/`. Nó import `../dieu-phoi/scripts/hinh-dang.mjs`, mà `banSao` bố cục mới không có ở đó. **Đề xuất:** ở CN-2, chép thêm `plugins/dispatch` vào `base/plugins/acceptance-gate/dieu-phoi`, hoặc đổi dòng import của `goc` sang `./hop-thu/hinh-dang.mjs` trước khi ghi.
- **C3 (archive dùng chung).** Một mảng thư mục dùng cho cả hai phía: bản `git archive <sha lịch sử>` (bố cục cũ) và bản sao KIT (bố cục mới). Các chỗ: `CAY` ở GW và CT, `MA` ở CK và KM-7-co-viec/KM-8-khoi-khac, `D` ở NK-2-do. Không chuỗi nào đúng cho cả hai, nên không vá được bằng phép thay đường. **Đề xuất (như nhóm lo-trinh):** bung archive về bố cục mới, bằng `--prefix` theo từng thư mục hoặc `git archive <sha>:<thư mục cũ> --prefix=<thư mục mới>/`. Cách khác: tách mảng `*_GOC` bố cục cũ cho mọi lời gọi trên cây gốc.

## D. Lớp kho-cu: mã ngoài `tests/` ở cây mới hỏng, và vì sao #503 chưa phủ
- **D1. CK-4-lib.** Ở `plugins/acceptance-gate/lib/chan-lo-trinh.cjs:50-54`, `khoaBat()` đọc mặc định `path.join(GOI, '.claude-plugin', 'marketplace.json')`. `GOI` là `plugins/acceptance-gate` (dòng 25), mà tệp này không còn ở bố cục mới. Kết quả là `null`, khác `roadmap@delivery-loop` của RM4.
  - Vì sao #503 chưa phủ: #503 thêm nhánh dự phòng theo bảng tên (`ho-goi`) cho `lo-trinh-khoi-tao.mjs:47`. Bản đôi của nó trong `chan-lo-trinh.cjs` thì không được thêm. Ghi chú «cùng luật khoaBat của RM4» ở dòng 49 nay sai.
- **D2. KM-1-do3.** Ở `plugins/acceptance-gate/scripts/lo-trinh-khoi-tao.mjs:44-47`, `MARKETPLACE_GOI` chỉ tìm marketplace cạnh gốc gói. Ở bố cục mới nhánh này luôn trả `roadmap@${HG.CHO}` viết cứng, nên đổi tên chợ trong `.claude-plugin/marketplace.json` của kho không còn tác dụng. Ca kiểm «khoá bật rút từ marketplace.json» vì thế không thể xanh.
  - Vì sao #503 chưa phủ: nhánh dự phòng của #503 chính là chỗ bỏ qua tệp khai chợ của kho. Nếu chủ kho chấp nhận bảng tên làm nguồn thì ca này chuyển sang ngu-nghia.
- **D3. TH-10-ong, TH-10-do.** Ở `_acceptance/cua-tin-hieu-gom-nhom/rang/cham-bo-vang.mjs:42`, mã gọi `path.join(kit, 'scripts', 'tin-hieu.mjs')`, với `kit` mặc định là gốc kho (dòng 17). Ca kiểm truyền `kit` (gốc kho).
  - Vì sao #503 chưa phủ: #503 chỉ sửa đường gọi chéo lõi → điều phối trong mã sản phẩm. Vật đo của hồ sơ dưới `_acceptance/` không thuộc cả bước 6 lẫn #503. Không vá được ở tệp kiểm: dạng `{ …, kit }` → `kit: \`${kit}/plugins/acceptance-gate\`` không qua phép đảo.
