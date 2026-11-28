# Đề bài — Inventory nhận kit Mốc A (NHÁP, chờ thẻ)

Viết 28/11/2026, phiên giữ đợt (Mac Studio). **Trạng thái: NHÁP.** Thẻ của Mốc A chưa có — vòng mốc `release-3-2-0` đang ở
Cổng Phạm vi. Mọi chỗ ghi `<thẻ>` điền sau khi thẻ gắn (dự kiến `v3.2.0`); phần «lớp chép CI» và «kho nhận làm gì» soát
lại theo ghi chú phát hành thật. Chưa phiên nào được mở từ tệp này; chủ kho gọi tên thì mới mở.

Chủ kho quyết 28/11 ở phiên giữ đợt: «Chỉ Inventory» — Mốc A chỉ giao cho `onehub-inventory`; `crm-onehub` và
`onehub-quy-hang` không nhận mốc này.

## Bối cảnh

- Kit `phanlemanh/delivery-loop`, thẻ `<thẻ>`, gom sáu hồ sơ được ký sau `v3.1.1`: đặc tả UX đọc sổ màn (#27), đối soát
  bàn giao (#32), nâng repo-setup (#34), bằng chứng cũ theo đầu vào — DL2 (#37), giám sát đọc bản uỷ quyền — DL6 (#38),
  đổi tên khoá bản uỷ quyền sang tiếng Anh — V1 (#39). Ghi chú phát hành: `gh release view <thẻ> --repo
  phanlemanh/delivery-loop` (nếu chủ kho cho tạo), hoặc mục của mốc trong `CHANGELOG.md` ở thẻ ấy.
- Inventory đang ghim `v3.1.1` (đo 28/11, `origin/main` `2df6f190`): `.claude/settings.json` dòng 103 và
  `.github/workflows/ci.yml` dòng 172 (`KIT_TAG`). Quét lại trước khi sửa — số dòng có thể đã trôi.
- Lần nâng trước (3.1.0 → 3.1.1): hồ sơ `_acceptance/nang-kit-3-1-1/` của kho.
- Đợt điều phối `nen` (`docs/plan/dot-nen`) chạy ở kho 26–28/11. Bản tổng kết đợt (PR #40 của kho kit) ghi: plugin 3.1.1,
  lõi đợt 3.1.0, làn ghim chạy từ checkout đang phát triển — ba bản cùng lúc. Vòng nâng kit phải nêu: đợt còn chạy không,
  nâng giữa đợt thì lõi đợt và các hồ sơ đang giữa vòng ra sao (luật của kit: không đổi engine dưới chân một vòng đang
  chạy).

## Việc

1. Đổi ghim kit từ `v3.1.1` sang `<thẻ>` ở mọi chỗ trên `origin/main`.
2. Chạy kiểm bản cài như ghi chú phát hành dặn (`kiem-ban-cai.mjs --ref <thẻ>` trên bản clone kit đã `git fetch --tags`),
   ra `TỔNG KẾT: ĐẠT`. Lớp chép CI: vòng mốc báo không tệp nào của khối INIT-CI-COPY-LIST đổi — soát lại theo ghi chú.
3. Trình **bảng khoá** dưới đây ở Cổng Phạm vi của chính vòng nâng kit (cổng đã có, không thêm lượt gọi). Chủ kho quyết
   từng dòng; máy ghi cả câu trả lời «không» kèm lý do vào sổ quyết định của hồ sơ.
4. Hạng và đường đi do luật của chính kho Inventory quyết ở S0 — không theo đề bài này.

## Bảng khoá — chín khoá kit đã phát hành, trạng thái ở Inventory

Đo 28/11 trên `origin/main` `2df6f190` của Inventory. Vòng nâng kit đo lại trước khi trình; số nào lệch thì theo số mới.

**Đã bật — không hỏi lại** (bốn khoá):

| Khoá | Bật từ |
|---|---|
| `feature_loop.ngoai_n_tu_dinh_tuyen` | 10/11 |
| `feature_loop.gop_theo_loi_ky` | 26/11 |
| `feature_loop.do_san_tren_nen` | 26/11 |
| `risk_tiers.stale_scope: paths` | 28/11 (PR #138 của kho) |

**Chưa bật — nêu ở Cổng Phạm vi** (năm khoá):

| Khoá | Số đo từ lịch sử của kho | Được gì · mất gì | Cách đảo |
|---|---|---|---|
| `feature_loop.repin_parallel_suites` | 110 làn ghim lại từ 14/11, trung vị 16,0 phút, tổng 35,9 giờ máy. Bản tổng kết đợt `nen` (PR #40 của kho kit, mục 4) ghi khoá này «còn tắt có chủ ý» — hỏi lại lý do còn đứng không, đừng trình như khoá bị quên | Các lệnh suite của làn chạy cùng lúc, làn ngắn lại. Kit dặn: kho có suite cùng ghi một tài nguyên (cơ sở dữ liệu kiểm) thì chưa nên bật; phải chạy làn hai cách trên cùng một cây và so mã thoát trước | Xoá dòng |
| `lo_trinh.chan` | 95 hồ sơ mới từ 09/11 (ngày kho có tệp lộ trình); 33 hồ sơ không thuộc hàng nào — phần lớn là nâng kit, nâng công cụ thiết kế, sửa hạ tầng | Mọi hồ sơ mới phải thuộc một hàng; mở vòng từ câu mô tả thì máy tự thêm hàng. Giới hạn kit đã khai: hai phiên cùng thêm hàng một lúc có thể mất một hàng — kho đang chạy đợt nhiều dãy nên giới hạn này có thật | `chan: false` hoặc xoá dòng |
| `ban_do.ngoai_git` | 49/69 PR gộp từ 14/11 chạm `PRODUCT-MAP.md` hoặc `LO-TRINH.html`; các nhánh ấy có 94 commit gộp nhánh chính vào nhánh. CHƯA đo bao nhiêu lần trong số đó là xung đột do hai tệp này | Hai tệp rời git, PR thôi xung đột ở chúng, lối gộp không-trùng-tệp của gói điều phối dùng được. Kho có bên đọc hai tệp qua git hay GitHub thì phải khai nhánh view trong cùng PR. Kho đã có hồ sơ `roadmap-merge-driver` — nêu nó đã bớt được bao nhiêu phần gỡ tay | Ba bước ngược lại trong một PR (`GUIDE.md` của kit, khối BAN-DO-NGOAI-GIT) |
| Bản uỷ quyền `governance/delegation.yaml` — MỚI ở mốc này | Kho chưa có tệp (chỉ có `governance/autonomy.yaml`). Bản tổng kết đợt `nen` ghi 104 câu hỏi tới chủ kho qua giám sát trên 54 lần gộp — số của phiên khác, chưa kiểm lại | Giám sát được tự làm đúng các quyền chủ kho ghi trong tệp, đọc ở đỉnh nhánh chính; tên lạ hay tên thuộc vùng cấm làm cả tệp bị từ chối. Khoá và tên quyền là tiếng Anh (`version`, `delegated`; `merge`, `merge-order`, `session`, `reassign-row`, `open-lane`, `shared-ruling`, `roadmap`). Viết tệp là quyết định của người; vòng nâng kit KHÔNG tự viết | Xoá tệp: kho không có tệp chạy như trước |
| `tu_merge` — ô trên thẻ mở đợt, đặt theo từng đợt | Bản tổng kết đợt `nen`: ký → gộp trung vị 22 phút, chỉ đo được trên 11/54 lần gộp — số của phiên khác, chưa kiểm lại | Giám sát được gộp theo quyền trong đợt; chỉ có nghĩa khi bản uỷ quyền nhận `merge` | Tắt ô ở đợt kế |

Ngoài chín khoá: bản tổng kết đợt `nen` ghi kho còn tắt có chủ ý `gop_khong_chay_lai_ci` và chuyến gộp, đã bật
`repin_retry: 1` (28/11), và gói đợt `docs/plan/dot-nen/dieu-phoi.config.json` còn mang hai khoá sức khoẻ cũ (`swap_gb`,
`rss_gb`) kit đã bỏ qua — nêu kèm, không tính vào bảng.

Phiên giữ đợt không khuyến nghị bật khoá nào trong năm khoá trên thay chủ kho: mỗi khoá là khẩu vị rủi ro của kho. Vòng
nâng kit nêu một khuyến nghị cho từng dòng sau khi đo lại, kèm hệ quả từng lối.

## Ràng buộc

- Làm trong cây làm việc riêng cắt từ `origin/main` mới nhất của Inventory. Không đụng các cây làm việc cũ dưới
  `.claude/worktrees/` của kho ấy, không đụng PR đang mở của kho.
- `main` chỉ đổi qua PR, gộp bằng commit gộp; chỉ gộp khi chủ kho bảo ở chính phiên ấy. Không bật tự gộp của GitHub.
- Không cài hay đổi plugin ở mức máy, không sửa `~/.claude/settings.json` hay tệp cấu hình shell. Bước nào cần cài gói theo
  thẻ trên máy thì in lệnh cho chủ kho, không tự chạy.
- Không viết `governance/delegation.yaml` khi chủ kho chưa nói ở chính phiên ấy.
- Công cụ của kit chạy dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- Chờ CI dài bằng một truy vấn GraphQL mỗi phút; không dùng `gh run watch` (bẫy hạn mức 28/11).
- Lời duyệt cổng do chủ kho gõ ở chính phiên ấy.

## Xong là

PR gộp vào `main` của Inventory bằng commit gộp, commit ấy kéo kit ở `<thẻ>`, và CI trên chính commit gộp xanh. Báo lại:
số PR, commit gộp, kết quả CI, số lượt gọi người, và **từng dòng của bảng khoá chủ kho trả lời gì** — đây là số gốc cho
vòng sổ khoá (V2a): «thấy bảng thì kho có bật không».
