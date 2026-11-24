---
schema_version: 1
feature: Đối soát bàn giao — lúc nối lại đợt sau khi đổi tài khoản, lệnh nối lại so bản bàn giao với trạng thái hiện tại của từng dãy và chỉ nói ra chỗ lệch; nhánh chưa đẩy lộ ra; tài khoản quá ngưỡng thì không mở chip
slug: doi-soat-ban-giao
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: plugins/dispatch/scripts/{doi-soat,tiep-tuc,ban-giao,muc-day,dieu-phoi}.mjs, commands/resume.md, README của gói, ca của gói — KHÔNG khớp t3_paths
surfaces: [cli]
status: verified
approved_by: Phan Le Manh
approved_at: 2026-11-24
design_doc: docs/superpowers/specs/2026-11-24-doi-soat-ban-giao-design.md
---

# Acceptance Contract: doi-soat-ban-giao

## Context

Gốc: `delivery-loop/_acceptance/khung-dot-dinh-vi/` — hồ sơ ấy dựng khung đợt cho vai giám sát; ranh giới của nó sinh hạt
giống `docs/plans/2026-11-24-hat-giong-giam-sat-co-quyen-va-co-so.md` (bốn lớp). Vòng này là LỚP 2 của hạt giống, chủ kho
gọi tên 24/11/2026, nguyên văn «Mở vòng lớp 2 đối soát bàn giao». Lớp 0, lớp 1, lớp 3 ở ngoài vòng.

**Cơn đau:** khi một đợt Điều phối – Thợ bàn giao tài khoản, gói `dispatch` ghi `ban-giao.json` từ git, nhưng lúc nối lại
không bên nào đọc tệp ấy để so trước với sau. Chủ kho phải tự đối soát từng dãy bằng mắt (lời chủ kho 24/11: «kiểm tra bàn
giao và đối soát bàn giao sau khi đổi tài khoản»). Hai lỗ đi kèm: bàn giao mà nhánh chưa đẩy thì nằm im trong tệp; và
tài khoản mới cũng quá ngưỡng báo trước (`khuyen_cho`) thì lệnh nối lại vẫn trả kế hoạch mở chip.

**Vật** (thiết kế đủ ở `design_doc`):

1. Bên đọc mới `plugins/dispatch/scripts/doi-soat.mjs`; `tiep-tuc` gọi nó trên bản `ban-giao.json` đang mở, TRƯỚC khi rời
   bàn giao, và trả khoá `doi_soat`. Trạng thái hiện tại dựng bằng chính hàm mục dãy của bên viết.
2. `tiep-tuc` trả `ke_hoach` rỗng khi kết quả mang `khuyen_cho`; thân lệnh `commands/resume.md` dừng ở đó.
3. Chữ «CHƯA ĐẨY» ở ba chỗ: dòng in của `ban-giao-xong`, câu `tin` của sự kiện `ban-giao-dung`, và `doi_soat` lúc nối lại.
4. Tệp ca mới `tests/dieu-phoi/doi-soat-ban-giao.test.mjs`; thân lệnh, README của gói, một câu ở `CONTEXT.md`.

Thuật ngữ:
- **bản mở** = `ban-giao.json` ở gốc thư mục đợt lúc lệnh nối lại bắt đầu chạy, trước khi nó được chuyển vào
  `ban-giao/lich-su/`.
- **kho thử** = kho git do tệp ca sinh trong lượt: hai worktree liên kết thật cho dãy P1, P2, remote là một kho bare, đợt
  mở bằng CLI thật, bàn giao dựng bằng nhịp bộ phát lịch thật (đồng hồ giả).
- **bản gốc vòng** = gói `dispatch` rút trọn thư mục bằng `git archive` ở gốc chung của nhánh vòng với nhánh chính.
- **dòng** = một phần tử của mảng `doi_soat.dong`: chữ cho người, phiên nói lại nguyên văn.

## Criteria

- AC-1: Given kho thử mà bản mở vừa do bên viết thật dựng và không gì đổi sau đó, When chạy `tiep-tuc --phien B --json` (B đã đọc mức dùng 30 %), Then kết quả có `doi_soat` với `khop: true`, `lech`, `chua_day`, `co_vang` đều rỗng và `dong` có ĐÚNG MỘT dòng nêu mã bàn giao và số dãy khớp; khoá của tệp bên viết vừa sinh và khoá của khuôn `scripts/mau/ban-giao.json` (cả gốc lẫn mục dãy) đều bằng đúng hợp của hai danh sách trong khối marker `BAN-GIAO-TRUONG-DOC` của `doi-soat.mjs` — `TRUONG_DOC` (trường bên đọc so) và `BO_QUA` (trường không so, mỗi mục kèm lý do). Chiều đỏ: trên bản sao gói đổi tên trường `dinh` ở bên viết (`muc-day.mjs`), cùng kho thử, ca đỏ và nêu «thiếu trường dinh»; trên bản sao gói thêm trường `thu_moi` vào cả bên viết lẫn khuôn, ca đỏ và nêu «trường thu_moi không có bên đọc».
- AC-2: Given kho thử có bản mở, When sau khi bản mở đã dựng, phá ĐÚNG MỘT thứ thật theo ma trận viết sẵn mười hai hàng — (a) P1 thêm một commit rồi đẩy · (b) P1 đổi sang nhánh khác cùng đỉnh, đã đẩy · (c) P1 lùi một commit · (d) P1 có tệp chưa commit · (e) hồ sơ của P2 đổi `status` bằng một commit đã đẩy · (f) khoá `s4` P2 đang giữ được nhả · (g) thêm đơn `xin/P1-s4.json` · (h) nhánh chính tiến hai commit · (i) worktree P2 bị gỡ · (j) thêm dãy P3 vào đợt · (k) P1 viết lại commit đỉnh rồi đẩy cưỡng bức · (l) gỡ dãy P2 khỏi đợt — rồi chạy `tiep-tuc --phien B --json`, Then mỗi hàng ra `khop: false` và `lech` mang ĐÚNG tập `chieu` mong đợi, đúng dãy (lần lượt `dinh` · `nhanh` · `dinh` · `cay` · `dinh` cùng `ho-so` · `khoa` · `don` · `nhanh-chinh` · `worktree` · `day` · `dinh` · `day`), `chua_day` rỗng; `dong` gồm dòng đầu cộng đúng một dòng cho mỗi mục lệch, không dòng nào cho dãy khớp; hàng (a) nêu «tiến 1 commit», hàng (c) nêu «lùi», hàng (k) nêu «khác lịch sử», hàng (h) nêu «dời 2 commit», hàng (j) và (l) nêu dãy thêm và dãy mất; số hàng đúng bằng số hàng ma trận (12). Chiều đỏ: trên bản sao gói bỏ chiều `dinh` khỏi bên đọc, hàng (a), (c), (k) đỏ, nêu tên hàng.
- AC-3 (judgment): Given tệp `_acceptance/doi-soat-ban-giao/mau-dong.md` do mã sinh từ MỌI lớp dòng — dòng khớp (AC-1), mười hai hàng lệch (AC-2), dòng «CHƯA ĐẨY» (AC-4), năm dòng vàng (AC-8), dòng «không có bản trước» (AC-7 e) — và tệp đã commit bằng từng byte bản mã sinh lại, When một người chưa đọc mã đọc từng dòng, Then mỗi dòng lệch tự nó nói được dãy nào (hoặc khoá, đơn, nhánh chính), chiều nào, trước ra sao và nay ra sao; dòng «CHƯA ĐẨY» nói commit chỉ nằm ở máy này; mỗi dòng vàng có chữ giải thích bên cạnh tên trường; không dòng nào chỉ có mã trần hay tên trường máy; không đường dẫn tuyệt đối; không từ nào của riêng một kho tiêu thụ; chữ dùng đúng từ của mục «Bàn giao tài khoản» ở `CONTEXT.md`.
- AC-4: Given kho thử có remote, theo ma trận hai hàng — (a) P1 commit thêm sau lần đẩy cuối (đỉnh không nằm trong nhánh theo dõi) · (b) P1 ở một nhánh mới chưa từng đẩy (không có nhánh theo dõi) — P2 đã đẩy, When P1 chạy `ban-giao-xong`, nhịp bộ phát lịch dựng bàn giao, rồi `tiep-tuc --phien B --json`, Then ở cả hai hàng (1) `ban-giao-xong` thoát 0 và dòng in mang «CHƯA ĐẨY» kèm tên nhánh của P1; (2) câu `tin` của sự kiện `ban-giao-dung` nêu P1 chưa đẩy và không nêu P2; (3) `doi_soat.chua_day` có đúng P1 và `dong` có một dòng «CHƯA ĐẨY» của P1 dù `lech` rỗng. Đối chứng im, cùng các bước trên kho thử KHÔNG có remote: không chuỗi «CHƯA ĐẨY» hay «chưa đẩy» ở cả ba chỗ, và câu `tin` vẫn kết thúc bằng đúng đuôi cũ `tiep-tuc --phien <mã phiên này> --json).` (không câu nào thêm sau). Chiều đỏ: trên bản sao gói bỏ điều kiện «kho có remote», đối chứng im đỏ và nêu «CHƯA ĐẨY ở kho không remote»; trên bản sao gói coi «không có nhánh theo dõi» là đã đẩy, hàng (b) đỏ và nêu P1.
- AC-5: Given kho thử ở pha `cho-tiep-tuc`, P1 không còn phiên sống và có hàng để giao, When chạy `tiep-tuc --phien B --json` với B đọc 85 % (quá ngưỡng báo trước 80 %), Then kết quả có `khuyen_cho`, `ke_hoach` là mảng rỗng, chuỗi kết quả không chứa `mo-chip` hay `ghi_danh`, pha giữ `cho-tiep-tuc`, và `doi_soat` vẫn có. Đối chứng dương, cùng kho thử với B đọc 30 %: P1 ra `mo-chip` kèm `ghi_danh`. Chiều đỏ: trên bản sao gói bỏ nhánh chặn, ca đỏ và nêu «khuyen_cho mà còn mo-chip: P1».
- AC-6: Given thân lệnh `plugins/dispatch/commands/resume.md` và `README.md` của gói, When chạy hàm kiểm cấu trúc trên tệp thật, Then ở bước 2 của thân lệnh có dòng xử lý `doi_soat` đòi nói lại nguyên văn từng dòng của `doi_soat.dong`, đứng TRƯỚC bước mở chip; dòng `khuyen_cho` mang chữ DỪNG và không còn «đi tiếp bước 3»; README mục «Đổi tài khoản» nêu đối soát, «CHƯA ĐẨY» và việc dừng khi khuyên chờ. Chiều đỏ: bản sao thân lệnh trả lại câu «đi tiếp bước 3» → đỏ nêu `khuyen_cho`; bản sao gỡ dòng `doi_soat` → đỏ nêu `doi_soat`. Đối chứng dương: bản sao không sửa gì → không lỗi.
- AC-7: Given năm tình huống viết sẵn — (a) đợt chưa từng bàn giao · (b) đợt đã nối lại từ trước, còn bản trong `ban-giao/lich-su/` · (c) dạng `--nhe` trong pha bàn giao có bản mở · (d) phiên chưa đọc mức dùng (`can_doc_han_muc`) · (e) rời cưỡng bức khi chưa có bản mở — When chạy `tiep-tuc --json`, Then (a)–(d) không có khoá `doi_soat`; (e) có `doi_soat` với `khong_ban_truoc: true`, `lech` rỗng và một dòng nói bản bàn giao dựng ngay lúc nối lại; ở (a) kết quả của bản mới bằng kết quả của bản gốc vòng trên hai kho thử dựng y hệt và cùng đồng hồ (so sâu mọi trường, sau khi thay đường dẫn gốc của kho thử bằng nhãn). Chiều đỏ: trên bản sao gói đọc bản gần nhất trong lịch sử thay cho bản mở, tình huống (b) đỏ và nêu «đối soát lại bản đã nối lại».
- AC-8: Given bản mở do bên viết thật sinh rồi bị gỡ trường bằng mã theo ma trận năm hàng — bỏ `sha_nhanh_chinh` · bỏ `khoa` · bỏ `don` · bỏ `cay_ban` ở mọi dãy · bỏ `nhanh` ở mọi dãy — When chạy `tiep-tuc --phien B --json`, Then mỗi hàng thoát 0; `co_vang` nêu đúng trường bị gỡ; chiều của trường ấy không có trong `lech`; `dong` có một dòng vàng nêu tên trường kèm chữ giải thích; và một lệch thật tiêm kèm ở chiều KHÁC (P1 thêm một commit) vẫn hiện ở `lech`. Chiều đỏ: trên bản sao gói bỏ bước dò trường vắng, hàng `sha_nhanh_chinh` đỏ và nêu «không có dòng vàng».
- AC-9: Given cây của vòng, When (1) liệt kê tệp vòng đổi so với gốc chung với nhánh chính và (2) chạy bước CI thật của gói (lệnh rút từ `.github/workflows/gate.yml`, mọi tệp `tests/dieu-phoi/**/*.test.mjs`), Then (1) mọi tệp nằm trong danh sách cho phép — `plugins/dispatch/**`, `tests/dieu-phoi/**`, `_acceptance/doi-soat-ban-giao/**`, `docs/**`, `CONTEXT.md`, và các view máy sinh `PRODUCT-MAP.md`, `LO-TRINH.html`, `tests/scripts/fixtures/routing-baseline.txt`, `docs/research/known-limits-ledger.tsv`; (2) bước CI thoát 0, số ca đạt ≥ 84, 0 hỏng, 0 bỏ qua. Chiều đỏ của (1): chạy bộ kiểm với một đường ngoài danh sách (`plugins/acceptance-gate/lib/x.cjs`) đưa vào bằng cờ thử → thoát 1 nêu đường ấy.

## Coverage

- Sản phẩm: gói `dispatch` của kit — chân sản phẩm `[SUY-TỪ-REPO: plugins/dispatch/scripts/ban-giao.mjs]`, `[SUY-TỪ-REPO: plugins/dispatch/scripts/mau/ban-giao.json]` · chân ngành `[NGÀNH: Terraform plan]` (so trạng thái ghi với hiện trạng, chỉ in tài nguyên lệch, một dòng khi khớp) và `[NGÀNH: git status --branch]` (đỉnh so với nhánh theo dõi: trước/sau bao nhiêu commit).
- Trục A · chiều so (nhánh | đỉnh | cây | hồ sơ và hàng kế | worktree | dãy thêm hay mất | khoá | đơn | nhánh chính) `[thước CE: khoá của khuôn mau/ban-giao.json — mọi trường trạng thái của tệp đều có một chiều, trừ các trường của danh sách `BO_QUA` có lý do; đo bằng AC-1. «Đã đẩy» không phải chiều so mà là cờ đo lại lúc nối lại — AC-4]` → AC-1 · AC-2 · AC-4.
- Trục B · lúc gọi (rời bàn giao | khuyên chờ | chưa đọc mức dùng | `--nhe` | chưa từng bàn giao | đã nối lại từ trước | cưỡng bức không bản mở) `[thước CE: các nhánh trả về của roiBanGiao và ma trận 8 hàng của AC-7 hồ sơ dieu-phoi-doi-tai-khoan]` → AC-1 · AC-5 · AC-7.
- Trục C · hình dạng tệp (đủ trường | thiếu trường | hỏng JSON) `[thước CE: TRUONG_DOC × khuôn]` → AC-1 · AC-8; «hỏng JSON» ở Out of scope.
- Trục D · kho (không cài gói | cài, chưa bàn giao | có remote | không remote) `[thước CE: luật «cân trên mọi kho» của CLAUDE.md, khối 26/09]` → AC-9 · AC-7 · AC-4.
- Cross-cutting áp mọi ô: chữ cho người đọc được — mọi lớp dòng (AC-3) · thân lệnh người khớp máy (AC-6) · mỗi phép đo mới có chiều đỏ ghim thông điệp và đối chứng dương cùng kho thử.
- Later: chiều «câu hỏi chủ kho đang mở», chiều «PR» `[NGÀNH: git status --branch không phủ]` — xem Out of scope. Never: tự sửa chỗ lệch (máy chỉ báo; sửa là việc của dãy hoặc của người).

## Out of scope

- Lớp 0, lớp 1 và lớp 3 của hạt giống giám sát (lời giao quyền, bản uỷ quyền, sổ phán quyết, lệnh gộp cho giám sát, hàng rộng trong lộ trình).
- Chiều «câu hỏi chủ kho đang mở» và chiều «PR» mà hạt giống nêu ở lớp 2: `ban-giao.json` chưa ghi hai thứ này, PR cần gọi mạng trong một lệnh nối lại vốn chạy không mạng, và câu hỏi chủ kho đã được khung đợt đếm (hồ sơ `khung-dot-dinh-vi`). Ghi hạt giống, không làm.
- Từ chối `ban-giao-xong` khi nhánh chưa đẩy (lối không được khuyến nghị ở Cổng Phạm vi) — nếu chủ kho chọn lối ấy thì AC-4 viết lại trước khi làm.
- Ghi bảng trước/sau vào bản lịch sử bàn giao, hay đưa nó lên khung đợt.
- Sửa `chan-doan` để nó cũng thôi xếp `mo-chip` trong lúc khuyên chờ; đổi `keHoachDay`.
- `ban-giao.json` hỏng JSON (hôm nay `tiep-tuc` đã thoát 1 ở bước rời bàn giao).
- Fetch nhánh chính trong lệnh nối lại; tự đẩy nhánh thay dãy; tự sửa bất kỳ chỗ lệch nào.
- Đổi số bản, `CHANGELOG.md`, thẻ, bản phát hành, cài lên kho tiêu thụ — đi cùng mốc kế.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của vòng khớp `t3_paths`.
- **CỘNG hay sửa đúng-sai (ADR 0018)** — phân loại từng tiêu chí: AC-1, AC-2, AC-3, AC-7, AC-8 (khối đối soát lúc nối lại: một bên đọc mới và khoá `doi_soat`) và AC-4 (chữ «CHƯA ĐẨY» ở ba chỗ) là CỘNG, cần chủ kho phê đích danh ở Cổng Phạm vi. AC-5 là sửa đúng-sai theo hướng TRỪ (bỏ một hành động sai). AC-6 đi theo AC-1 và AC-5. AC-9 là thước, không phải vật.
- **Luật chiều rộng (b)** — đếm bằng `git log --merges --first-parent v3.1.0..origin/main` (24/11): năm PR gộp sau thẻ `v3.1.0`, là mốc gần nhất một kho tiêu thụ đã nhận (kho ấy ghim `v3.1.0` ở nhánh chính, đọc qua GitHub API 24/11). Ba PR mang hồ sơ vòng: #26 `va-chu-ky-giu-cho-lenh-gop`, #27 `dac-ta-ux-doc-so-man`, #29 `release-3-1-1`; hai PR chỉ tài liệu: #30, #31. Mốc 3.1.1 chưa kho nào nhận. Vòng này là vòng thứ tư trong cửa sổ.
- **Ngưỡng mở ô của hạt giống chưa có số.** Ngưỡng ghi «thêm ≥ 1 lần đổi tài khoản giữa một đợt mà chủ kho phải đối soát tay một dãy». Đo được 24/11 trên máy này: đợt `vo-khu-muc-tieu` của một kho tiêu thụ (25–27/10) vào bàn giao 3 lần, 0 lần rời qua lệnh nối lại (sổ sự kiện không có `tiep-tuc-ban-giao`), bản bàn giao cuối còn mở lúc đóng đợt với 5 dãy (2 chưa đẩy, 3 dở, 3 cây bẩn). Hai lần đổi tài khoản khác bàn giao bằng tệp viết tay ngoài gói (14/10, 22/11). Không lần nào có số «chủ kho phải đối soát tay một dãy» được ghi; chủ kho mở vòng bằng lời gọi tên.
- **Hai chỗ đổi hành vi mặc định**, mỗi chỗ là một câu ở Cổng Phạm vi: bàn giao chưa đẩy (hợp đồng soạn theo lối «cho qua kèm cờ») và `khuyen_cho` (hợp đồng soạn theo lối «dừng, không mở chip»).
- **Cân trên mọi kho** (phép đo ở cột phải):

  | Kho | Thấy gì | Đo bằng |
  |---|---|---|
  | không cài gói `dispatch` | không đổi gì | AC-9 vế (1) |
  | cài gói, chưa từng bàn giao | lệnh nối lại như cũ từng trường | AC-7 (a), vi phân với bản gốc vòng |
  | có `ban-giao.json` ghi bằng bản cũ thiếu trường | đọc được, mỗi trường vắng một dòng vàng, không phải sửa tệp | AC-8 |
  | bàn giao, không có remote | có đối soát, không chữ «CHƯA ĐẨY» | AC-4 đối chứng im |
  | bàn giao, có remote, nhánh chưa đẩy | thêm chữ «CHƯA ĐẨY» ở ba chỗ, `ban-giao-xong` vẫn thoát 0 | AC-4 |
  | nối lại trên tài khoản quá ngưỡng báo trước | không còn hàng `mo-chip`, thân lệnh dừng | AC-5, AC-6 |

- **Dự báo năm dòng số (luật chiều rộng c):** làm-xong→ký = · ký→gộp = · lượt gọi người trong thiết kế = · ngoài thiết kế ↓ ở đợt có đổi tài khoản · vòng bị hạ tầng đốt lượt chấm = · token máy mỗi vòng = · phút máy mỗi lượt chấm ↑ nhẹ (một tệp ca thêm vào bước CI của gói). Điều kiện tin cậy: đường verdict không đổi thành phần — vòng không chạm `plugins/feature-loop/workflows/` hay lõi.
- **Giới hạn khai trước:** nhánh chính đọc từ ref cục bộ, không fetch; bảng trước/sau chỉ sống trong kết quả của lần nối lại ấy; `chan-doan` gọi riêng trong lúc khuyên chờ vẫn xếp `mo-chip` (chẩn đoán không mở chip; chỉ kế hoạch của lệnh nối lại dẫn tới mở chip ở bước 4 của thân lệnh). Ngưỡng đang đếm: ≥ 1 lần ở đợt thật chủ kho phải hỏi lại phiên giám sát về một dãy SAU khi đã đọc dòng đối soát; và ≥ 1 chip mở trong lúc tài khoản đang bị khuyên chờ, qua bất kỳ lối nào.
- Không chạy bước đường nền ở đầu vòng: nền đối chiếu bằng lượt CI trên chính gốc nhánh vòng `647bd9d5` (lượt 45321327201, thành công). Lượt đo dài để dành cho lượt chấm và lượt gộp thử.
- Phiên nạp gói `feature-loop@delivery-loop` 3.0.0 (bộ đệm cài); kho tự host kit nên lệnh của vòng chạy từ cây (`plugins/…` ở 3.1.1). Không gói `@acceptance-gate-kit` nào được nạp.
- Lệnh riêng của hồ sơ gọi `_acceptance/doi-soat-ban-giao/rang/chay.sh` (khối `LENH-HO-SO`); vòng không thêm khoá vào `_acceptance/config.yaml`.
- PR đang mở lúc soạn (24/11): chỉ #21 (nháp, nhánh `chuyen-nha`) — không chạm tệp nào của vòng.
