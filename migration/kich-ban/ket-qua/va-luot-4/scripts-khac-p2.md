# scripts-khac — phần 2 (17 tệp)

`va.json`: 28 mục. Đã áp lên một bản sao MỚI của B5 bằng `kiem.mjs` (split/join, đòi đúng `so_lan`). Phép đảo `phepDao` của
`kiem-cho.mjs` trên mỗi tệp đã vá cho ra ĐÚNG bản ở cây A cho cả 15 tệp có mục vá. «Đỏ» = số ca đạt ở A mà không đạt ở cây
đang đo (đếm PASS, gồm cả ca chưa chạy tới vì tệp chết giữa chừng).

| tệp | đỏ trước | đỏ sau | ca còn đỏ · lớp · một câu |
|---|---|---|---|
| s4-args-not-run | 4 | 0 | — (`--ag-root` mặc định → `${KIT}/plugins/acceptance-gate`; bản sao ag giữ `lib`/`skills` tương đối) |
| s4-args-vung-vat | 5 | 0 | — (bản sao chép vào `d/feature-loop` thì đọc ở `d/feature-loop`) |
| vong-meta-dang-mo | 5 | 0 | — (kho mẫu giữ `.claude-plugin/plugin.json` ở gốc, đúng chỗ start-scan đọc; xem ghi chú kho-cu bên dưới) |
| cay-doi-trong-luot | 3 | 0 | — (`git log -- lib/…` và mọi đường trong cây `TRUOC` của commit lịch sử giữ đường cũ) |
| ckdl-the | 3 | 0 | — (bản sao chép vào `s/scripts`) |
| design-gate-khong-do-duoc | 3 | 0 | — (cây `GOC` từ `git archive` lịch sử, bản tiêm `d/scripts` giữ đường cũ) |
| gate-card-dec-key | 3 | 0 | — (bản sao chép vào `md/scripts`) |
| ghi-tri-thuc | 3 | 0 | — (`$AG` là gốc plugin lõi: `AG: ${KIT}/plugins/acceptance-gate`, dòng lệnh `$AG/scripts/…` giữ như tài liệu lệnh) |
| ho-so-nghi | 3 | 0 | — (`archive HEAD` đổi sang đường mới; cây `SHA_NEN` lịch sử giữ đường cũ) |
| ngay-ky | 3 | 3 | NK-2, NK-2-do, NK-2-giu · **kho-cu** · `plugins/acceptance-gate/scripts/tin-hieu.mjs:27,30` import `../dieu-phoi/scripts/…` |
| ntr-the-canh-gay | 3 | 1 | GN-TV3 · **chua-ro (helper nhóm đường nền)** · `tests/scripts/duong-nen-fixture.mjs` `chayNen` truyền `--ag-root KIT`; mục `"'--ag-root', o.agRoot \|\| KIT,"` → ``"'--ag-root', o.agRoot \|\| `${KIT}/plugins/acceptance-gate`,"`` (so_lan 1) gỡ ca này — đã thử, chưa cho vào va.json vì tệp thuộc nhóm repin/đường nền |
| vat-da-o-nhanh-goc | 3 | 0 | — (bản sao chép vào `banSao/scripts`) |
| ghi-boi-tac-tu-cham | 2 | 0 | — (`GOC_0710` là đường tuyệt đối trong fixture chưa đổi tên chợ: giữ `acceptance-gate-kit`) |
| kho-tri-thuc-va-lint | 2 | 0 | — (KT-8 bản sao bố cục mới; KT-9 như ghi-tri-thuc) |
| lmtl-the | 2 | 0 | — (như ntr: `git log` + cây `TRUOC` lịch sử giữ đường cũ) |
| s4-args-judgment-inputs | 2 | 2 | JI12 ×2 · **kho-cu** · `docs/findings/assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs:20,32` require `lib/eval-yaml.cjs`, `feature-loop/scripts/lib/hoi-ngoai-inputs.mjs` theo bố cục cũ |
| thiet-ke-nap-tri-thuc | 2 | 2 | TN-7, TN-7-mutant · **ngu-nghia** · hằng `THU_MUC` và các đường `path.join(may, 'plugins/acceptance-gate/scripts/…')`, `the(may, …)` dùng chung cho cây `git archive 378e262c` (bố cục cũ) và bản sao KIT (bố cục mới); đề xuất tách `THU_MUC_GOC = ['scripts','lib','skills','feature-loop','commands']` và các đường tương ứng cho `mayCu()` |
| **tổng** | **51** | **8** | gỡ 43 |

Ghi chú kho-cu (không làm đỏ ca nào sau vá): `plugins/acceptance-gate/scripts/start-scan.mjs:752,760` vẫn nhận «kho kit»
bằng `.claude-plugin/plugin.json` ở GỐC kho; ở kho mới tệp ấy nằm ở `plugins/acceptance-gate/.claude-plugin/plugin.json`, nên
metaOpen không bao giờ áp cho chính kho kit. Ca vong-meta-dang-mo xanh lại vì kho mẫu của nó đặt manifest đúng chỗ mã sản
phẩm đọc.

Công cụ: `kiem.mjs` (áp + đếm so_lan + phép đảo so với A), `fix.mjs`, `add.py` cùng thư mục.
