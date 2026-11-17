# Nhóm lo-trinh — mục vá B2 lượt 4

Tệp nộp:
- `va.json` (21 mục). Đã áp lại lên bản sao mới của B5 (`kiem/`): 21/21 mục khớp đúng `so_lan`.
- `va-kit.json` (7 mục, tuỳ chọn, áp SAU `va.json`). Chỉ hợp lệ khi thêm `kit` vào `bang-xep.json` → `bo_kiem.bien_goc` (xem mục B).

Số đếm lấy từ lượt chạy trên bản sao của tôi. Bản sao được nạp thêm `refs/remotes/origin/*` của B5 để `origin/main` có mặt như ở B5.

## Bảng

| tệp | đỏ trước | đỏ sau `va.json` | đỏ sau thêm `va-kit.json` | ca còn đỏ · lớp · một câu |
|---|---|---|---|---|
| hang-pr | 9 | **0** | 0 | — |
| dai-tom-tat-dem-dung | 19 | **2** | 2 | DD-6, DD-6-do · ngu-nghia · ghim sha256 của `dai-tom-tat.test.mjs`, mà bước 6 đã sửa tệp này; cần ghim lại hoặc băm bản đã đảo |
| lo-trinh | 64 | **42** | 35 | LT-72..LT-80, LT-100, LT-112/113/118, LT-140/141/147/153/157/168 · ngu-nghia · hàm nạp chung `napLT`/`veBang` dùng cho cả KIT (bố cục mới) lẫn bản `git archive` lịch sử (bố cục cũ). LT-84, LT-138, LT-150 · cần `kit` trong bien_goc (`homeTu(kit)`, `CLAUDE_PLUGIN_ROOT: kit`) |
| ra-soat-lo-trinh | 10 | **9** | 9 | RS-4..RS-8 · ngu-nghia · `banGoc` bung bằng đối số mới, còn `nap`/`rsJson`/`quet` dùng chung với KIT. RS-10, RS-10-do · tên `'road-map'` và `./road-map` đi cùng `"$AG`→`"${kit}` · cần bien `kit` cộng thêm mục đổi tên |
| ap-chinh-sach-lo-trinh | 14 | 14 | 10 | AP-1/AP-8-khong-bat/AP-9/AP-10 · ngu-nghia (archive dùng chung). AP-7, AP-7-lenh · ngu-nghia · `LENH_KHOA` vừa là tên tệp lệnh (nay `pin.md`…) vừa là cờ `--ghim` của lo-trinh.mjs. AP-7-do/do2 · chua-ro · khối P32 rút từ `tests/plugins/run-tests.sh` (nhóm khác) đọc `commands/approve.md` |
| lo-trinh-gio-may | 8 | 8 | 8 | GM-1-doc-cu, GM-1-nang-kit, GM-5, DB-7, DB-7-do · ngu-nghia (archive). GM-9, GM-9-do, GM-9-do2 · chua-ro · ca đổi `--plugin acceptance-gate` thành `--root "${kit}"`, mà ở bố cục mới gốc gói là `${kit}/plugins/acceptance-gate`; cần bien `kit` |
| moc-chien-dich | 16 | 16 | 14 | MC-2..MC-9 · ngu-nghia (`banGoc` cùng `nap` dùng chung). MC-7 hết đỏ khi có bien `kit` (`homeCua(kit)`) |
| road-map-de-dung | 10 | 10 | 8 | RD-5/9/10/11/tat · ngu-nghia (v2.32.0 archive dùng chung). RD-3 hết đỏ khi có bien `kit` (`AG: kit`) |
| xem-trang-lo-trinh | 3 | 3 | 3 | LTT-san* · ngu-nghia · `bo2210()` archive v2.21.0 và `napLT` dùng chung |
| ve-lo-trinh-doc-tin-hieu-cua-cay | 10 | 10 | 10 | VT-* · ngu-nghia · mảng `CAY` dùng chung cho `git archive` lịch sử và bản sao KIT. Mục `gui.md`→`suggest.md` đúng nhưng chưa gỡ ca nào |
| ban-do-khuon-roi-nhom | 1 (sập) | 1 | 1 | ngu-nghia · `DOC`/`LENH`/`S4` dùng chung cho `mayGoc()` (archive) và KIT; sửa riêng đối số archive chỉ dời chỗ sập |
| lo-trinh-du-lieu-ngay | 1 | 1 | 1 | ND-1-trang-giu · ngu-nghia · `bung()`, `nap()` và `banNen()` dùng chung cho archive lịch sử, merge-base và KIT |
| kho-moi-cai-goi-road-map | 1 (sập) | 29 | 29 | kho-cu · `plugins/acceptance-gate/scripts/lo-trinh-khoi-tao.mjs:27` `GOI_ROAD_MAP = 'road-map'`, còn marketplace ghi `roadmap`. Vá đã gỡ chỗ sập «marketplace.json không có gói road-map»; nay đỏ từng ca vì sản phẩm |
| kho-cam-ket-co-lo-trinh | 1 (sập) | 13 | 13 | kho-cu · `plugins/acceptance-gate/lib/chan-lo-trinh.cjs:26` `GOI_ROAD_MAP = 'road-map'`. CK-4 và CK-5-tat còn thêm ngu-nghia: mảng `MA` dùng chung cho archive và bản sao |
| moi-cong-khong-qua-nut | 1 (sập) | 1 | 1 | kho-cu · `plugins/acceptance-gate/skills/acceptance/references/human-facing-language.md:160-197`: khối khai số bản ghi đường bố cục cũ (`skills/acceptance/SKILL.md`, `dieu-phoi/commands/mo-dot.md`…), ca đọc `path.join(KIT, rel)` |

Tổng số ca gỡ được: **49** với `va.json` (hang-pr 9 · dai-tom-tat 17 · lo-trinh 22 · ra-soat 1). Thêm **15** ca nếu áp cả `va-kit.json` (ap 4 · lo-trinh 7 · moc 2 · road-map 2). Ngoài ra ba tệp kho-moi, kho-cam-ket và ban-do hết sập ở mức tệp; hai tệp đầu nay đỏ từng ca vì kho-cu.

## A. Phép thử đảo (kiem-cho `phepDao` + `daoTep`, chạy bằng `dao.mjs`)

Trong `va.json`, các tệp sau đảo về đúng từng byte bản ở A: hang-pr, ra-soat, dai-tom-tat, lo-trinh (gồm cả mục `` `${KIT}/plugins/acceptance-gate` ``, được luật «gốc plugin lõi» đảo về `KIT`).

Năm mục đúng luật của brief (chỉ đổi tên theo bảng tên), nhưng `phepDao` hiện chưa đảo được:
- `x.name === 'roadmap'` ở kho-moi và kho-cam-ket. Luật đảo tên plugin chỉ phủ các dạng `roadmap:`, `roadmap@`, `--plugin`, `plugin: '…'` và `'…': {`.
- `path.join(kit, 'plugins/roadmap', 'commands', 'status.md')` ở gio-may và ap-chinh-sach (2 chỗ), cùng `'suggest.md'` ở ve-lo-trinh. Luật cặp phần tử chỉ nhận `'<D>/commands', '<tên>.md'`, không nhận ba phần tử `'<D>', 'commands', '<tên>.md'`.

Muốn giữ các mục này thì cần thêm hai dạng ấy vào `phepDao`. Nếu không, bỏ năm mục khỏi `va.json`: mất 0 ca xanh, nhưng kho-moi và kho-cam-ket quay lại sập.

## B. `va-kit.json`

Bảy mục thay `kit` bằng `` `${kit}/plugins/acceptance-gate` `` ở chỗ kit đứng thay gốc plugin: `CLAUDE_PLUGIN_ROOT: kit`, `AG: kit`, `.join(kit)`, `"${kit}`, và `cpSync(path.join(kit, d), …)` vào cache giả `9.9.9`. Chúng chỉ qua phép đảo khi `kit` có trong `bo_kiem.bien_goc`. Thêm `kit` sẽ chạm cả luật xuôi của bước 6, nên cần đo lại túi khoá trước khi bật.

## C. Lớp ngu-nghia chung: hàm dùng chung cho hai bố cục

Hai bên dùng chung một hằng hay một hàm (`napLT`, `nap`, `banGoc`, `MA`, `CAY`, `DOC`):
- KIT, ở bố cục mới;
- một bản `git archive <sha lịch sử>`, ở bố cục cũ.

Không có chuỗi nào đúng cho cả hai, nên không vá được bằng phép thay đường. Đề xuất: bung archive về bố cục mới, bằng `--prefix=plugins/acceptance-gate/` cho phần lõi cộng chỗ đặt riêng cho feature-loop và road-map. Hoặc thêm một hàm `duong(kit, rel)` biết bố cục của `kit`. Cả hai đều là đổi mã kiểm, đi sang `viec-kho-cu-b2.md`.
