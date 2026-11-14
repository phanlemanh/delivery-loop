# Trạng thái đợt chuyển nhà — tệp SỐNG

Tệp duy nhất phải sửa mỗi khi đổi máy hoặc xong một việc. Ai mở kho này cũng đọc tệp này trước; `BOI-CANH.md` và
`KE-HOACH.md` giải thích vì sao, tệp này nói đang ở đâu.

## Đang giữ

**Mac Studio** — từ 12/11/2026, chủ kho giao («Nhận và mở 2.39 với phiên độc lập … còn phiên này sẽ thực hiện kế hoạch
chuyển nhà»). Đã kiểm dòng nhả của MacBook Pro trước khi nhận. Lúc nhận: `main` = nhánh chính kho cũ `909dffd8`.

Máy này mặc định chạy Node 26 — mọi lệnh kiểm phải chạy dưới `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`
(24.16.0), nếu không bộ chạy thoát mã 3.

Mốc 2.39 (việc 3b) chạy ở một phiên RIÊNG trên Mac Studio, trỏ thẳng vào kho cũ `~/dev/acceptance-gate-kit`, kho nhận
`onehub-quy-hang`; phiên giữ đợt không làm mốc.

Luật giữ: mỗi lúc chỉ MỘT máy sửa nhánh `chuyen-nha`. **Máy đang giữ, trước khi rời:** đẩy hết, rồi tạo một commit có thông
điệp bắt đầu bằng «migration: <tên máy> nhả» và không sửa gì sau đó. **Máy nhận:** (1) kéo nhánh về, (2) kiểm
`git log -1 --format=%s origin/chuyen-nha` đúng là dòng nhả ấy — không phải thì dừng, hỏi chủ kho, (3) sửa dòng trên thành
tên máy mình + ngày, commit, đẩy, (4) rồi mới làm. Thấy dòng trên không phải máy mình mà chủ kho chưa bảo đổi → dừng, hỏi
chủ kho.

## Đã xong

| Việc | Bằng chứng |
|---|---|
| Kế hoạch chốt với chủ kho (phương thức, tên tạm, bốn dãy việc) | `KE-HOACH.md` mục 3, 12, 13 |
| Đo thử B0 — bỏ lịch sử, hồ sơ, sổ làm việc thì bao nhiêu ca kiểm đỏ | `KE-HOACH.md` mục 13 · `b0/ket-qua/` |
| Kho `phanlemanh/delivery-loop` tạo trên GitHub, riêng tư, chạy kiểm tự động (Actions) tắt | `gh repo view phanlemanh/delivery-loop` |
| `main` = nhánh chính kho cũ (lần cập nhật gần nhất 14/11: `593e6837`, PR #502 — MC-11 đọc tên kho bằng `tenKho()`), đủ 31 thẻ chính thức | `git rev-parse origin/main kit-cu/main` |
| Nhánh `chuyen-nha` có thư mục `migration/` và tệp chỉ đường `.claude/rules/chuyen-nha.md` | nhánh này |
| Thử kéo kho về chỗ trống và làm theo `MO-PHIEN.md` | 11/11, MacBook Pro — xem cuối tệp |
| Thử plugin `repo-setup` trên kho này (không ghi): chưa có khuôn cho kho plugin, khuôn gần nhất thêm sai loại tệp | `KE-HOACH.md` mục 14 |
| R1 — khuôn «kho plugin» cho plugin `repo-setup`, phát hành ở bản 0.5.0 | `gh release view repo-setup-v0.5.0 --repo phanlemanh/repo-standards` · ghi chú ở «Ghi chú giữ cho B1» |
| A1 `luot-kiem-nhe` — lượt kiểm của PR chạy 13 mảnh song song, nhánh chính vẫn chạy trọn; bộ chạy tự so bản Node với `.nvmrc`; có bảng thời gian từng ca. Chủ kho ký hai cổng, gộp 12/11 tại `909dffd8` | `gh pr view 499 --repo phanlemanh/acceptance-gate-kit` · hồ sơ `_acceptance/luot-kiem-nhe/` trên `main` |
| Kiểm lại bộ bàn giao trên một bản kéo sạch (12/11) — xem «Kiểm bàn giao 12/11» cuối tệp | mục đó |
| Tra soát kho cũ cho B1 (12/11, chủ kho bảo «Làm tra soát»): ba sổ máy sinh — kiểm kê tệp, chỗ hai kho tiêu thụ bám vào kit, tệp kiểm bám bố cục cũ | `tra-soat/README.md` · `node --test migration/tra-soat/*.test.mjs` 13 ca xanh |
| Thước B1 có ca chạy thử phiên thật (12/11, chủ kho bảo «Thêm ca chạy thử phiên thật vào thước B1»): kịch bản đọc những gì một phiên thật nạp từ chợ của một cây, 0 token, ~13 giây; nền `909dffd8` = 6 plugin, 33 lệnh và skill, 3 tác tử | `KE-HOACH.md` mục 12 · `node --test migration/chay-thu-phien/chay-thu.test.mjs` 8 ca xanh, 4 biến thể tiêm lỗi đều đỏ đúng ca |
| Hai thước nữa vào kế hoạch (12/11, chủ kho bảo «Ghi hai thước vào kế hoạch»): B2 giữ đủ khoá ca — nền 4 749 khoá ở bốn bộ bash + 667 ca điều phối trên `13c523e6`; ngưỡng thực tế đóng đợt ở mốc 3.0 | `KE-HOACH.md` mục 12, dưới bảng dãy B · `BOI-CANH.md` quyết định 12 |
| Bảng khác biệt dự kiến trước/sau chuyển nhà — bảng chủ kho dò lúc ký mốc 3.0 (12/11, chủ kho bảo «Lập bảng sự khác biệt dự kiến…»): 10 điều giữ nguyên, 53 điều đổi hay đo (thêm R5–R7 cùng ngày), 13 hàng còn quyết định «mở» (N2, N10, N12, B1, B5, B8, B9, B10, B13, C1, C4, R4, O4) | `KHAC-BIET-DU-KIEN.md` |
| Ranh giới và điểm nối với Repo Standards (12/11, chủ kho bảo «Kiểm xem repo standards … xác định ranh giới và điểm nối»): hai bên không gọi nhau lúc chạy, nối qua tệp; `doctor` 55/100 trên cây hôm nay; một va cứng — `/repo-setup:github` luôn đặt chỉ gộp dồn | `NOI-REPO-STANDARDS.md` · `KHAC-BIET-DU-KIEN.md` R2, R5–R7 |
| Mốc 2.39 cắt ở kho cũ (13/11): PR #500 ký Cổng Bằng chứng, gộp tại `0c4e503b`, thẻ `v2.39.0`, `gate` trên nhánh chính xanh. Đủ ba việc chỉ-bớt — mô tả plugin lõi 84 582 → 424 ký tự, `feature-loop` 34 579 → 299 · `scripts/rel-cua-so.sh` và `lib/eval-yaml.js` đã xoá · `.env` vào `.gitignore`. `main` kho này cập nhật theo, 31 thẻ | `gh pr view 500 --repo phanlemanh/acceptance-gate-kit` · `git rev-parse origin/main kit-cu/main` |
| **Quỹ hàng cài 2.39** (13/11, chủ kho bảo «Mở PR Quỹ hàng» rồi «Gộp PR»): PR [#246](https://github.com/phanlemanh/onehub-quy-hang/pull/246) gộp tại `f1d123ee` (commit gộp, không gộp dồn); CI nhánh chính Quỹ hàng xanh đủ 7 việc, kể cả `gate` và `deploy`. PR đổi `KIT_TAG` ở **hai** luồng — `ci.yml` và `ghim-lai-ban-that.yml` (luồng sau nằm trong `t3_paths`) — cùng `AGENTS.md`; ghim lại hồ sơ `ghim-lai-ban-that-qua-ci` trên kit 2.39 (làn máy xanh 1,3 phút, chữ ký 08/11 giữ); ca phá thử E2 của hồ sơ ấy thôi ghi cứng thẻ. **Điều kiện thứ nhất của B1 đạt.** Nhánh `chore/nang-kit-v2-39-0` còn trên GitHub (kho không tự xoá nhánh sau gộp) | `git show origin/main:.github/workflows/ci.yml` ở Quỹ hàng: `KIT_TAG: v2.39.0` |
| **B1 `kich-ban-chuyen-nha`** (T3, chủ kho gọi tên 13/11) — kịch bản một lệnh dựng cây kho mới từ nhánh chính kho cũ, kèm báo cáo lớp đỏ cho B2 (1 787 ca đỏ thêm, chia sáu lớp). Ba lượt chấm: lượt 1 BLOCKED (tác tử chấm chạy Node 26), lượt 2 REJECT (con trỏ tương đối AC-7; ca MC-11 sửa ở kho cũ PR #502, gộp `593e6837`), lượt 3 trên `684a5e30` 17/17 eval máy + 11 lệnh suite xanh. **Chủ kho ký Cổng Bằng chứng 14/11** (`2ca6d76c`): E10j Đạt, 13 finding ngoài hợp đồng ghi Known limits. Gộp vào `chuyen-nha` 14/11 bằng commit gộp `a7a1fc3b` (không gộp dồn), chủ kho bảo «Gộp vào chuyen-nha». Lượt gọi người: 5, vượt trần T3 = 4 — lượt ngoài thiết kế là câu Node 24 ngày 13/11. **Giới hạn đã biết:** lưới trước-gộp báo hồ sơ hoá cũ chỉ vì `migration/TRANG-THAI.md` đổi sau `verified_commit` — tệp sống này đổi mỗi bước nên ghim lại vô ích; đường đúng tầng (tệp sống ra khỏi vùng vật) chờ câu mở số 1 của `BOI-CANH.md` (hồ sơ B1 sống ở đâu). Ứng viên sửa đầu cho B2: `--nhanh` nhận mọi tên nhánh | `_acceptance/kich-ban-chuyen-nha/` · `git log --first-parent -1 a7a1fc3b` · `node --test migration/kich-ban/don-nha.test.mjs` |

## Đang dở

| Việc | Ở đâu | Còn thiếu |
|---|---|---|
| **B2 `bo-kiem-xanh-o-kho-moi`** (T2, trần 3 lượt gọi người) | phiên riêng trên Mac Studio, worktree nhánh `b2-bo-kiem-xanh-o-kho-moi` cắt từ `chuyen-nha` `49cc4876` | Chủ kho gọi tên 14/11: «Mở B2 và gọi chéo». Đầu vào: `kich-ban/ket-qua/lop-do.md` (1 787 ca đỏ thêm, 93 % lớp đường dẫn). Mang lên Cổng Phạm vi: kịch bản đổi luôn đường dẫn trong tệp kiểm (chưa đo — bước thiết kế đo trước), sửa Ngoài-1/3/7 của B1, chốt chỗ để tệp trạng thái sống. **14/11, phiên B2 đo (phiên giữ đợt chưa kiểm chéo):** so theo túi khoá ca trên nhật ký lượt đo B1, cây cũ 5 550 khoá đạt, cây mới còn 248 — thiếu 5 302 (≈ 95 %), không phải 1 787: báo cáo lớp đỏ của B1 chỉ đếm dòng FAIL nên ca không chạy tới không được tính (`workflows` 1 036 ca và bước bản đồ chết trước ca đầu). Đây là Ngoài-3/7 của B1 thành thật; vượt xa dòng «hơn một phần ba thì dừng, trình chủ kho» — đã trình chủ kho 14/11, số chia cơ học/ngữ nghĩa lên thẻ Cổng Phạm vi. **14/11: dừng ở Cổng Phạm vi** (lượt 1/3), hồ sơ ở `621e1324` trên nhánh `claude/b2-bo-kiem-xanh-o-kho-moi-3db198`: hợp đồng 8 tiêu chí, phản biện 5/5 đã xử, chưa viết mã vật. Số đo: nền cây cũ `593e6837` 5 548 khoá đạt; phương án liên kết lối cũ loại (bộ kiểm ghi xuyên liên kết); một lượt luật đổi đường dẫn chung đưa cây mới 248 → 3 475, phần thiếu rải ~130 tệp kiểm. Năm câu trên thẻ: Hỏi-1 hồ sơ vòng ở kho này · Hỏi-2 đổi cơ học trong kịch bản + bảng vá theo tệp, trần năm lượt đo · Hỏi-3 chấm sau khi vòng gọi chéo gộp · Hỏi-4 `migration/TRANG-THAI.md` vào `t1_skip_globs` · Hỏi-5 đổi lớp một hàng sổ B1 (ca `P177`). Việc kho cũ B2 liệt kê: `migration/viec-kho-cu-b2.md` trên nhánh ấy. **Cổng Phạm vi duyệt 14/11** (`13c9e337`, Phan Le Manh, nhận cả năm khuyến nghị). Kế: kế hoạch và thi công; lượt chấm chờ vòng gọi chéo gộp ở kho cũ. **14/11 tối: thi công việc 1–8** (`e2f25256` → `85911c00`). Lượt chạy mới (`TMPDIR` ngắn) cho nền cây cũ `593e6837` xanh trọn sáu bước, **5 552 khoá đạt** — `GL07` và ba ca kéo theo hết đỏ, vế «xanh ở kho cũ» đạt trên máy này. Lượt đo 1 cây mới: thiếu **2 819** khoá trên 129 tệp kiểm (cụm lớn nhất: bộ `workflows` chết từ đầu, 519 khoá). Lượt đo 2 thiếu **1 356**, lượt đo 3 thiếu **1 266** (`a70abebb`) — phần dư nay là hình dạng riêng từng tệp kiểm, không còn luật chung bị sót. **Lượt 4** (`80fe31c2`, 23:23): bảng vá theo tệp 305 mục + sáu phép ngược mới của thước đảo; thước nguồn thật 298/298 tệp kiểm, ca kịch bản 79/79; **Lượt đo 4 (15/11 00:57): thiếu 629. Lượt đo 5 (15/11 01:57, `76d4cc3e`): thiếu 598** — hết năm lượt đổi cơ học đã duyệt ở Hỏi-2 (cây kịch bản `a31f9da6` dựng từ `593e6837`; bước 6 = luật chung + 316 mục vá theo tệp; thước đảo 298/298). Phân lớp 598 khoá (`migration/viec-kho-cu-b2.md` §4, bảng từng khoá `migration/kich-ban/ket-qua/phan-du-luot-5.tsv` — phiên giữ đợt đếm lại bảng, khớp): **A 185** đã nằm trong vòng gọi chéo (dự báo, chỉ thành số sau khi #503 gộp và đo lại) · **K2 52** mã và tài liệu sản phẩm còn bố cục cũ (`carry-plan.mjs`, các khối site trong `human-facing-language.md` và design-pass, `.claude/settings.json`) · **K3 20** hồ sơ `_acceptance/` đã ký mang đường cũ — chủ kho chọn một trong ba: bộ đọc dịch đường cho hồ sơ trước mốc · kịch bản viết lại hồ sơ rồi ghim lại · bỏ khoá có lý do ở Cổng Bằng chứng · **K4 340** ở chừng 35 tệp kiểm phải đổi nghĩa (một hằng đường dùng chung cho cây hiện tại và bản `git archive` của commit lịch sử) · **K 1** lỗi của chính kịch bản (P196, B2 tự gỡ). **K2–K4 = 412 khoá chưa có vòng nào phủ — cần một vòng kho cũ thứ hai, chủ kho chưa gọi tên.** B2 đọc ngưỡng dừng Hỏi-2 chỉ trên lớp «không do kho cũ» (còn 1 khoá) nên không dừng mà CHỜ `main` + `chuyen-nha` có các bản sửa rồi mới chấm; cách đọc này chủ kho chưa duyệt. Gọi người 1/3. |
| **Gọi chéo lõi → điều phối** (kho cũ) | phiên riêng trên Mac Studio, worktree ở `~/dev/acceptance-gate-kit`, nhánh `goi-cheo-loi-dieu-phoi` | Chủ kho gọi tên 14/11, cùng lời. Sửa bốn tệp lõi trỏ thẳng thư mục điều phối và ba hằng tên plugin viết cứng (`hat-giong-goi-cheo-loi-dieu-phoi.md`). Dừng ở PR xanh; gộp khi chủ kho bảo. Khi gộp: chạy lệnh cập nhật `main` ở cuối tệp này, B2 đo lại trên nguồn mới. **14/11: dừng ở Cổng Đáng** (lượt 1/4 — máy xếp hạng T3 vì chạm `lib/chan-lo-trinh.cjs`), ô cơ hội ở `a5b0bbd4`. Quét lớp ra 11 chỗ gãy, năm nhóm — thêm so với hạt giống: `start-scan.mjs` nhận kho kit bằng manifest ở gốc, ba script feature-loop (`giu-tuoi`, `thuoc-vat`, `carry-plan`) coi lõi là thư mục cha. Câu chờ chủ kho: đường cho nhóm lõi gọi điều phối — (C) lõi giữ bản chép bốn tệp kèm ca so từng byte [máy khuyến nghị] · (A) tìm qua `resolve-plugin` · (D) dời về lõi, sửa ~37 tệp điều phối. **Cổng Đáng qua 14/11** (`b50c7576`): chủ kho gõ trong phiên vòng «làm · đường C · neo như ô · ngưỡng như ô». S1 xong (`6de7cbbe`: hợp đồng 10 AC, 16 eval; tên plugin đọc từ bảng `lib/ho-goi.cjs`, bản chép ở `scripts/hop-thu/`). **14/11: dừng ở Cổng Phạm vi** (lượt 2/4), thiết kế ở `3622b328`: hợp đồng 11 tiêu chí, 17 eval, đường nền xanh 5/5, phản biện 2 P0 + 3 P1 đã sửa. Hỏi-1 chờ chủ kho: gộp mục `RT13` vào vòng này (AC-11 — phép so đọc-cũ chỉ xét hồ sơ có từ mốc `cb38ea01`; máy khuyến nghị) hay tách vòng riêng. `RT13` đỏ sẵn trên `chuyen-nha` vì hồ sơ B1 đã ký đổi lớp mà danh sách đóng không khai — B2 đo, vòng gọi chéo kiểm chéo trên `5192aff2`; chặn mọi lượt chấm ở kho này tới khi sửa ở kho cũ. **Cổng Phạm vi duyệt 14/11** (`9824bf5d`, Phan Le Manh, Hỏi-1 = gộp `RT13`). **Gate 1.5 duyệt 14/11** (lượt 3/4): chủ kho gõ «duyệt kế hoạch» trong phiên vòng, kế hoạch 11 task ở `cd701aae`. **Thi công T1–T11 xong** (`4d683e32` → `4c0a1568`): thước đỏ trước, bảng tên `lib/ho-goi.cjs`, hộp thư trong lõi, `start-scan`/`kiem-ban-cai`/feature-loop tự host tìm lõi qua tệp khai chợ, `RT13` chỉ so hồ sơ có ở mốc. Trong S3 mở rộng trong lớp một lần: hai đường cứng tới thư mục skill bị kịch bản đổi tên (`gom-tin-hieu`, `cat-luot`) đổi sang tìm theo khối đánh dấu (`scripts/tim-skill.cjs`). **S3 xong 14/11 21:16** (`dbf5c060`, hợp đồng `implemented`): bộ kiểm đầy đủ lần đầu đỏ 4 chỗ, cả 4 do chính vòng dời tệp dùng chung sang `scripts/hop-thu/` và thêm hai tệp vào danh sách chép CI (GUIDE §5.3 36 → 38 tệp, ca `NEN7`, `ngoai-n-tu-dinh-tuyen`, `P161`) — sửa ở `d287e067`, chạy lại xanh năm bộ. Đo chéo E16 (chạy tay trên bản kéo tạm, không ghi vào kho này): lệnh đếm của hạt giống trả 5 trên `593e6837`, **0** trên nhánh vòng. Bẫy đã tránh: ref `main` cục bộ của bản kéo kho cũ đứng ở `c8fa5a65`, cũ hơn `origin/main` 148 commit — lượt chấm dùng `--diff-base origin/main`. **S4 lượt 1 REJECT** (`b6845dbe`): 16 eval máy xanh, 7 phát hiện trong hợp đồng ở hai ca răng VP-HT (AC-1) và BC-8 (AC-8) — chiều đỏ không đo điều nó nói; sửa ở `485980d4`. **S4 lượt 2 REJECT** (`c7a76b85`, 23:42): mọi eval xanh, đỏ duy nhất ở lệnh `tests/plugins` `vung:3`, ca P179 đòi sổ giới hạn chung đủ dòng cho các mục đề xuất ghi giới hạn; đã thêm năm dòng sổ, không đổi mã. **S4 lượt 3 PASS 15/11 00:43** (`c78f16fa`, hợp đồng `verified`, chấm trên `c7a76b85`; dùng lại cả 16 eval, chạy lại 11 bộ kiểm và khối tìm lỗi). Bốn mục ngoài hợp đồng chờ lên thẻ Cổng Bằng chứng: tên và nguồn chợ còn hai bản trong lõi · GN-1 tự chép quy tắc thay vì gọi bộ đọc thật · VP-HT và BC-7 đo bản đã commit · BC-8 với cờ `--ref` đo bản đang đứng ở nửa bố cục cũ. Phép kiểm trước khi gộp (`--base origin/main`) chỉ còn một vi phạm: hồ sơ chưa có chữ ký; không hồ sơ nào khác hoá cũ. **PR [#503](https://github.com/phanlemanh/acceptance-gate-kit/pull/503) mở 15/11 00:48** (đỉnh `c1a6add1`, 52 tệp; CI 01:00: mọi check xanh trừ `gate`, đỏ đúng vì thiếu chữ ký), mở tay vì `pr-san-sang.mjs` từ chối. **ĐANG CHỜ CHỦ KHO ký Cổng Bằng chứng** trong phiên vòng (`/acceptance-gate:signoff goi-cheo-loi-dieu-phoi …`) — lượt 4/4, hết trần T3. Thẻ: 13 mục ngoài hợp đồng (10 lỗi riêng, máy khuyên ghi hạn chế đã biết, Ngoài-12 chấp nhận không sửa) + ba quyết định sau Cổng Phạm vi (Treo-1…3). Chưa đo: cài trọn bản lõi ở bố cục mới — B2 đo lại sau gộp sẽ phủ. Kế: ký → commit chữ ký lên #503 → CI xanh → chủ kho bảo gộp (commit gộp) → lệnh chuẩn cập nhật `main`/`chuyen-nha` → B2 đo lại. |

## Ghi chú giữ cho B1

**Điều A1 để lại mà B1 phải biết (đo 12/11 trên `909dffd8`):** kho cũ nay có `.nvmrc` ghi `24`; bốn bộ chạy kiểm tự so và
**thoát mã 3 ngay khi bản Node của máy lệch số chính** — kiểm trước bằng `bash tests/bo-chay.sh node`. Lượt kiểm của PR là 13
việc song song (phiên A1 báo 6,5–6,9 phút, trước đó 57–67); đẩy lên nhánh chính vẫn chạy trọn một việc như cũ. Giới hạn
phiên A1 đã ghi vào hạt giống: bước cài `zsh` nay chạy ở 8 mảnh nên một lần máy kiểm mất mạng làm đỏ oan cả 8.

R1 đã phát hành: `repo-setup` **0.5.0**, thẻ `repo-setup-v0.5.0` = `4dc53e0` trên nhánh chính `repo-standards` (PR
[#6](https://github.com/phanlemanh/repo-standards/pull/6) khuôn, PR [#7](https://github.com/phanlemanh/repo-standards/pull/7)
nâng phiên bản; cả hai xanh đủ bốn việc kiểm trước khi gộp, nhánh chính sau PR #6 cũng xanh). Chưa ai xét duyệt mã từng
dòng. Chưa chạy: lượt phát hành của mức `team` trên GitHub, các skill dựng kho trong một phiên thật trên kho plugin.

**Gọi công cụ khuôn từ đâu (đo lại 12/11):** nhánh chính `repo-standards` đã đi tiếp sau thẻ 0.5.0 (gộp thêm lớp thiết
kế tại `1f405a9`, số phiên bản vẫn ghi 0.5.0). Vì thế «bản 0.5.0» và «nhánh chính» không còn là một — B1 gọi công cụ từ một
bản kéo riêng tại ĐÚNG thẻ, không từ thư mục làm việc `repo-standards` của máy nào:

```bash
git clone --depth 1 --branch repo-setup-v0.5.0 https://github.com/phanlemanh/repo-standards.git <chỗ tạm>/rs
```

Bẫy ghi 11/11 về thư mục `~/dev/repo-standards` của MacBook Pro đứng ở nhánh cũ đã hết: thư mục ấy nay ở nhánh chính.
Công cụ cần `python3` 3.11 trở lên.

(Đoạn này và đoạn kế nói về kho `repo-standards`, không phải kit.) Mã commit của nhánh đã đổi so với lần ghi trước (`0fa5473`): trước khi đẩy lên kho công khai, tên kho riêng tư dùng làm tên
mẫu trong bộ kiểm được gỡ khỏi cả tệp lẫn lịch sử nhánh, rồi nhánh gộp thêm hai commit mới của nhánh chính. Kiểm lại tại
`b2f67ea`: `bash tests/run.sh` xanh (46 nhóm, 0 lỗi).

Kiểm lại độc lập 11/11 (MacBook Pro, tại `0fa5473`): `bash tests/run.sh` xanh (45 nhóm, 0 lỗi) · bộ dò nhận kit là `claude-plugin` · điểm
`doctor` của kit 44 → 50 (thước mới bỏ các mục của ứng dụng và bắt đúng năm lỗi thật: nguồn plugin là cả kho, phiên bản
lệch nhau, mô tả plugin quá dài, thiếu lệnh nâng phiên bản, lượt kiểm chưa kiểm tệp khai plugin) · `repo-standards` tự chấm
67 · tiếp nhận kit ở chế độ thử không ghi: thêm 6 tệp (`.editorconfig`, `.nvmrc`, `Makefile`, `tools/bump_version.py`,
`tools/plugin_lint.py`, `.claude/skills/review-change/SKILL.md`), trộn dòng vào 2, bỏ qua 6, để nguyên 4 tệp trùng; từ
điển miền, wiki và tệp mẫu biến môi trường báo «không áp» kèm lý do.

Tiếp nhận GHI THẬT trên một bản sao của kit (11/11, MacBook Pro, bản sao ở thư mục tạm, kit tại `9ff2e4f7`, công cụ tại bản
0.5.0): chạy sạch · thêm 6 đường dẫn (`.claude/skills/`, `.editorconfig`, `.nvmrc`, `.repo-setup.json`, `Makefile`,
`tools/`) · trộn dòng vào 2 tệp đã có (`.gitattributes`, `.gitignore`) · không ghi đè, không xoá tệp nào · `doctor` 9/20 →
14/20 mục chấm. Bộ kiểm tệp khai plugin vừa thêm (`tools/plugin_lint.py`) báo 4 lỗi trên kit. Hai lỗi đầu là việc của kịch bản
chuyển nhà; hai lỗi mô tả dài là việc của mốc 2.39 ở kho cũ (`KE-HOACH.md` mục 12), kịch bản chỉ kiểm chúng đã hết: sáu plugin lệch phiên bản (`diagram-design` 2.7.1, năm cái còn lại 2.38.1) · plugin lõi lấy cả kho làm nguồn ·
mô tả của plugin lõi dài 84 582 ký tự và của `feature-loop` 34 579 ký tự (trần 1 024; 12/11 đo thẳng hai tệp
khai plugin trên `909dffd8`: đúng hai con số ấy).

**Vì sao chưa áp khuôn thẳng lên cây kho này (đo 11/11 trên bản sao đã tiếp nhận):** khuôn 0.5.0 giả định bố cục SAU khi
dọn nhà. Trên cây hiện tại của kit: lệnh gom `make check` gọi `tests/run.sh` — tệp mẫu bị bỏ qua ở chế độ tiếp nhận, kit
không có tệp ấy nên lệnh hỏng ngay; `make validate` duyệt `plugins/*/` trong khi năm plugin của kit đang nằm ở gốc kho nên
nó không kiểm plugin nào; lượt kiểm của khuôn bị bỏ qua vì kit đã có `gate.yml`. Phần chạy được ngay: bộ kiểm tệp khai
plugin, lệnh nâng phiên bản, `.editorconfig`, `.nvmrc` (lúc đo khuôn ghi `22`; từ 12/11 kho cũ đã có `.nvmrc`
ghi `24` nên khuôn để nguyên tệp ấy — thử không ghi 12/11 trên bản kéo sạch: khuôn báo giữ nguyên 5 tệp trùng
`.claude/settings.json`, `.nvmrc`, `CLAUDE.md`, `LICENSE`, `README.md`). Bản đồ sản phẩm của
kit không đỏ vì các tệp mới. Việc cho B1: áp khuôn SAU bước đổi bố cục, rồi nối `make test` vào bộ chạy kiểm thật của kit.
Việc cho Repo Standards (chưa mở): ở chế độ tiếp nhận, `Makefile` trỏ `make test` vào một tệp mẫu mà chính nó đã bỏ qua.

Dòng lệnh kịch bản chuyển nhà (B1) sẽ gọi:

```bash
python3 <repo-standards>/plugins/repo-setup/scripts/apply.py --target <cây kho mới> --preset claude-plugin --level starter --adopt --var project_name=delivery-loop --var description="<mô tả>" --var owner=phanlemanh
```

Giá trị cho chỗ trống: `<repo-standards>` = bản kéo tại thẻ ở đoạn «Gọi công cụ khuôn từ đâu»; `<mô tả>` = một câu mô tả kho,
B1 soạn và chủ kho thấy ở Cổng Phạm vi.

B1 cần quyết: có nhận tệp `.claude/skills/review-change/SKILL.md` không (kit đã có đường xét duyệt riêng) — và bốn điều nữa ở cuối `NOI-REPO-STANDARDS.md`.

**Bộ kiểm trên Mac Studio (12/11, nhánh `chuyen-nha` `35c1e754`, Node 24.16):** scripts **968 xanh / 1 đỏ** · plugins
xanh · hooks 71/71 · workflows xanh · điều phối 667/667 · bản đồ sản phẩm khớp · `migration/` 21/21. Ca đỏ duy nhất là
`MC-11` (`tests/scripts/moc-chien-dich.test.mjs`), và nó đỏ **chỉ vì tên kho**: ca so tên phiên với chữ cứng
`(acceptance-gate-kit)`, mà `tenKho()` ở `scripts/lo-trinh.mjs` lấy tên theo THƯ MỤC chứa bản kéo (`delivery-loop`),
không theo remote. Ở kho cũ ca xanh vì CI kéo vào thư mục tên `acceptance-gate-kit` — kho mới sẽ đỏ mãi. Đây là lớp đỏ
«đổi tên kho» mà B0 chưa đo (B0 giữ nguyên tên); B1 đo đủ lớp này, B2 xử. Bộ kiểm có 19 tệp nhắc chữ `acceptance-gate-kit`
— phần lớn là tên chợ, phải đổi cùng lượt với `resolve-plugin`.

**Rà điều kiện dọn nhà (12/11, Mac Studio) — điều đo được ngoài các bảng trên:** sổ tra soát còn tươi và tất định (chạy
lại khớp từng byte) · bản kéo Quỹ hàng trên Mac Studio ở `~/onehub-quy-hang` (không ở `~/dev`) và chậm 2 332 commit so
với nhánh chính của nó — B3 cắt worktree từ `origin/main` · kho mới đang **cho gộp dồn**, kho cũ cấm (gộp dồn mất commit
chữ ký Cổng Bằng chứng) — phải đặt giống kho cũ trước PR đầu tiên ở kho mới · plugin kit trên Mac Studio đã lên 2.38.1
(phạm vi người dùng, `delivery-loop`, bản kéo chính kho cũ); plugin ở các kho tiêu thụ để nguyên theo lời chủ kho.

## Sẵn sàng cho B1 (đo 13/11 trên kit `0c4e503b` = 2.39.0, Mac Studio, Node 24.16)

| Thứ | Kết quả |
|---|---|
| Thước B1 «chạy thử phiên thật», 2.38.1 (`909dffd8`) so 2.39.0 | đạt — 6 plugin, 33 lệnh và skill, 3 tác tử, không mất không thừa; phiên bản nạp: năm plugin 2.39.0, `diagram-design` 2.7.1 |
| Thử trước PR nâng Quỹ hàng: bản sao Quỹ hàng `eedec225` + một commit đổi `KIT_TAG`, chạy đúng hai bước `gate` của `ci.yml` | `pre-merge-check` sạch (4 luật chạy) và `product-map --check` thoát 0 — ở kit `v2.37.0` (đối chứng) và ở `v2.39.0` như nhau. Không thấy hồ sơ nào phải ghim lại để nâng |
| Ba sổ tra soát chạy lại trên `0c4e503b` (đã ghi đè `tra-soat/ket-qua/`) | 13/13 ca xanh. Đổi: 5 737 tệp · `san-pham` 614 → 610 · `chua-ro` 20 → 22 — mô tả plugin ngắn lại nên vài tệp mất dấu «được nhắc từ tệp khai», trong đó `feature-loop/scripts/giu-tuoi.mjs` rơi xuống `chua-ro`. Hai sổ kho tiêu thụ: không đổi chỗ bám nào |
| `doctor` của Repo Standards 0.5.0 | 55 → **64**/100; hết trượt `plugin_description_short` và `gitignore`. Còn 8 mục trượt, đều đã có chủ ở `NOI-REPO-STANDARDS.md` |
| Đỏ đã biết mà B1/B2 phải xử | `MC-11` đỏ vì tên thư mục kho (đoạn «Bộ kiểm trên Mac Studio») · 22 tệp `chua-ro` cần xếp · kho mới đang cho gộp dồn |

**Chưa đo lại trên 2.39:** hai bộ kiểm lớn (script, plugin) trên `chuyen-nha` — CI nhánh chính kho cũ đã xanh trên `0c4e503b`,
và lần chạy trên Mac Studio 12/11 ở `35c1e754`.

## Kế — theo thứ tự phụ thuộc

| # | Việc | Ở kho nào | Mở khi |
|---|---|---|---|
| 1 | Bật quét bí mật + chặn đẩy bí mật, bật tự xoá nhánh sau gộp | kho CŨ, cài đặt GitHub | chủ kho bảo (đổi cài đặt kho) |
| 2 | ~~R1 — khuôn «kho plugin»~~ — xong 11/11, bản 0.5.0 | `repo-standards` | — |
| 3 | ~~A1 `luot-kiem-nhe`~~ — xong 12/11, gộp tại `909dffd8` | kho CŨ | — |
| 3b | ~~**Mốc 2.39** (làn V): ba việc chỉ-bớt + cắt số + một kho tiêu thụ cài~~ — xong 13/11: thẻ `v2.39.0` (`0c4e503b`), Quỹ hàng gộp PR #246 tại `f1d123ee` | — | — |
| 4 | B1 `kich-ban-chuyen-nha` — kịch bản sinh commit dọn nhà lên trên nhánh chính kho cũ. Đầu vào và các câu còn mở: `BOI-CANH.md`, hai mục «Đầu vào cho B1» | kho này, `migration/` | **hai điều kiện:** mốc 2.39 đã có một kho tiêu thụ cài (việc 3b) · chủ kho gọi đích danh tên vòng (`kich-ban-chuyen-nha` hoặc «B1»; câu giao máy KHÔNG phải gọi tên vòng). Ngoại lệ luật chiều rộng (b), hạn dừng và bảng tên KHÔNG phải điều kiện mở — chủ kho quyết chúng tại Cổng Phạm vi của chính B1 (`KE-HOACH.md` mục 12) |
| 5 | B2 `bo-kiem-xanh-o-kho-moi` | kho này | sau B1 (B1 đo lớp đỏ do đổi bố cục) |
| 5b | Repo Standards: `tools/github_setup.py` cho chọn kiểu gộp (hôm nay luôn đặt chỉ gộp dồn — va cứng với luật cấm gộp dồn của kit), và đổi lời trỏ sang `delivery-loop` cùng ca `tests/run.sh:552` | kho `repo-standards` | **sau B1** (chủ kho chọn 12/11, «Để sau B1»); tới lúc đó kho này ở mức `starter` và không chạy `/repo-setup:github` — `NOI-REPO-STANDARDS.md` |
| 6 | B3 cắt sang — mốc 3.0, Quỹ hàng nhận trước | kho này + kho tiêu thụ | chữ ký của chủ kho |

Việc 2, 3 và 3b đã xong; B1 còn chờ đúng một điều: chủ kho gọi đích danh B1 (hoặc `kich-ban-chuyen-nha`). Các quyết định ở mục dưới không chặn việc mở B1 — chúng được hỏi ở Cổng Phạm vi của B1. Chi tiết, thước đo và ước giờ máy: `KE-HOACH.md` mục 12.

## Chờ chủ kho (chưa ai được tự quyết)

1. Bảo làm việc 1 (cài đặt kho cũ) hay chưa.
2. ~~Gọi tên vòng A1 và máy chạy nó~~ — xong 11/11: MacBook Pro.
3. Ngoại lệ luật chiều rộng (b) cho B1 + B2, và hạn dừng của đợt (đề xuất 21 ngày từ khi B1 mở) — quyết tại Cổng Phạm vi của B1.
4. Chốt hẳn tên `delivery-loop` và bảng tên ở `KE-HOACH.md` mục 3 — quyết tại Cổng Phạm vi của B1.
5. Ngày cắt sang.
6. Vòng riêng cho hai tệp máy vẽ — hai hạt giống 16/10 và 30/10.
7. ~~Gọi tên mốc 2.39 và kho tiêu thụ nhận nó~~ — xong 12/11: kho nhận `onehub-quy-hang`; thẻ cắt 13/11; Quỹ hàng cài 13/11 (PR #246). B1 còn chờ: chủ kho gọi đích danh tên vòng B1.
10. Khối bọc Node 24 trong `~/.zshrc` (thêm 12/11 cho tác tử chấm của mốc 2.39) — giữ cho B1 hay gỡ. Phiên mốc ghi nó là việc còn treo; B1 cũng chạy bộ kiểm cần Node 24 nên khuyến nghị giữ tới hết B2.
8. ~~Bảo máy nào giữ đợt từ nay~~ — xong 12/11: Mac Studio.
9. Cài đặt của kho này trên GitHub trước ngày cắt — xem «Kiểm bàn giao 12/11», mục cài đặt.
11. **Ký Cổng Bằng chứng vòng gọi chéo** (PR #503 kho cũ, trong phiên vòng) rồi bảo gộp — 15/11.
12. **Vòng kho cũ thứ hai cho phần dư B2** (K2–K4, 412 khoá; neo `migration/viec-kho-cu-b2.md` §4): mở hay không, và chọn một trong ba lối cho K3 (hồ sơ đã ký mang đường cũ) — 15/11.

## Việc lặp lại: cập nhật `main` khi kho cũ đi thêm

`main` ở đây không nhận sửa tay. Khi nhánh chính kho cũ có commit mới, máy đang giữ chạy:

```bash
git fetch kit-cu --tags && git push origin refs/remotes/kit-cu/main:refs/heads/main && git push origin --tags && git switch chuyen-nha && git merge --no-edit kit-cu/main && git push origin chuyen-nha
```

Kiểm: `git rev-parse origin/main kit-cu/main` in hai dòng giống nhau. Lệnh này chạy lại bao nhiêu lần cũng được; kho cũ
chưa đổi thì nó không làm gì.

## Nhật ký giữ

| Ngày | Máy | Việc |
|---|---|---|
| 13/11/2026 | Mac Studio | Chủ kho hỏi chạy B1 theo hướng nào → khuyến nghị một vòng feature-loop ở phiên riêng (B1 một vòng, B2 nối đuôi — điều phối không có gì để chạy song song mà thêm hai thẻ khởi tạo/đóng đợt). Chủ kho: «Mở B1 kiểu này» → mở phiên B1. |
| 13/11/2026 | Mac Studio | Chủ kho bảo «Mở PR Quỹ hàng» → PR #246 (hai luồng ghim thẻ, ghim lại một hồ sơ T3, sửa một ca phá thử ghi cứng thẻ); cài `gitleaks` lên máy cho móc trước-commit của Quỹ hàng. Chủ kho bảo «Gộp PR» → gộp `f1d123ee`, CI nhánh chính Quỹ hàng xanh. Điều kiện thứ nhất của B1 đạt. |
| 13/11/2026 | Mac Studio | Mốc 2.39 cắt ở kho cũ (`0c4e503b`, thẻ `v2.39.0`); cập nhật `main` kho này theo. Chủ kho hỏi điều gì đang cản chuyển nhà → đo lại thước B1, thử trước PR nâng Quỹ hàng trên bản sao, chạy lại ba sổ tra soát, chấm lại `doctor` — đoạn «Sẵn sàng cho B1». |
| 12/11/2026 | Mac Studio | Chủ kho hỏi «Làm thế nào để biết được chuyển nhà thành công?» rồi bảo «Ghi hai thước vào kế hoạch» → B2 giữ đủ khoá ca, ngưỡng thực tế mốc 3.0. Khi ghi, đo ra hồ sơ lượt chấm không ghi phiên bản kit — khai giới hạn. |
| 12/11/2026 | Mac Studio | Chủ kho bảo «Thêm ca chạy thử phiên thật vào thước B1» → `chay-thu-phien/`, đẩy `35c1e754`. Chạy hai bộ kiểm lớn trên `chuyen-nha`: một đỏ, `MC-11`, do tên kho (đoạn «Bộ kiểm trên Mac Studio»). Rà lại mọi điều kiện dọn nhà theo lời chủ kho. Nâng plugin kit lên 2.38.1 trên máy. |
| 12/11/2026 | Mac Studio | **Nhận giữ.** Chủ kho giao kèm lệnh mở mốc 2.39 ở phiên riêng trỏ thẳng kho cũ, kho nhận Quỹ hàng. Kiểm trước khi nhận: dòng nhả đúng · `origin/main` = `kit-cu/main` = `909dffd8` · 30 thẻ · Node 24.16.0 «khớp» (máy mặc định Node 26) · chợ `acceptance-gate-kit` ở cả hai tệp cài đặt trỏ GitHub, không ghim thẻ · bộ đệm plugin trên máy mới tới 2.37.0. |
| 12/11/2026 | MacBook Pro | **Nhả.** Chủ kho bảo «Nhả cho Mac Studio». Đã đẩy hết; `main` khớp kho cũ `909dffd8`. Máy nhận kế: Mac Studio. |
| 12/11/2026 | MacBook Pro | Tra soát kho cũ: dựng ba kịch bản sinh sổ ở `tra-soat/` cùng 13 ca kiểm hai chiều (mỗi ca đã phá thử cho đỏ); đo trên kit `909dffd8`, Quỹ hàng `eedec225`, crm `74a29a68`. Đầu vào B1 ở `BOI-CANH.md` trỏ sang sổ. |
| 12/11/2026 | MacBook Pro | A1 gộp vào nhánh chính kho cũ (`909dffd8`, PR #499); cập nhật `main` kho này theo. Chủ kho bảo kiểm lại bộ bàn giao để Mac Studio nhận phần dọn nhà: kéo sạch, làm theo `MO-PHIEN.md`, cho một phiên trắng đọc thử, sửa các chỗ đã cũ, thêm đầu vào cho B1 vào `BOI-CANH.md`. |
| 11/11/2026 | MacBook Pro | A1: chủ kho ký Cổng Bằng chứng (`cbee02f7`), PR #499 rời dạng nháp; đang ghim lại hai hồ sơ, chưa gộp. |
| 11/11/2026 | MacBook Pro | A1: vòng qua hai cổng đầu, lượt chấm 1 PASS, PR nháp #499 ở kho cũ; chờ Cổng Bằng chứng. Kho cũ gộp #498 → cập nhật `main` kho này tới `11dfcd7f`. |
| 11/11/2026 | MacBook Pro | Chủ kho hỏi vì sao chưa áp khuôn 0.5.0 lên kho này; thử trên bản sao rồi chủ kho chọn «Trong kịch bản B1» — áp sau bước đổi bố cục, không áp tay trước. |
| 11/11/2026 | MacBook Pro | Chủ kho gọi tên vòng A1 `luot-kiem-nhe` và giao MacBook Pro chạy. Cập nhật `main` kho này theo kho cũ tới `6e5f4020`. Mở phiên riêng ở kho cũ cho vòng. |
| 11/11/2026 | MacBook Pro | R1: chủ kho bảo «Phát hành 0.5.0» → PR #7 nâng phiên bản, xanh, gộp tại `4dc53e0`, cắt thẻ `repo-setup-v0.5.0`, tạo bản phát hành. Thử tiếp nhận ghi thật trên bản sao kit: chạy sạch. R1 đóng. |
| 11/11/2026 | MacBook Pro | R1: lượt kiểm tự động của PR #6 xanh đủ bốn việc; chủ kho bảo «Gộp PR» → gộp vào nhánh chính `repo-standards` tại `81f164c`. Chưa phát hành. |
| 11/11/2026 | MacBook Pro | R1: chủ kho bảo «Đẩy và mở PR» → gỡ tên kho riêng tư khỏi bộ kiểm, đuổi kịp nhánh chính, đẩy, mở PR #6 ở `repo-standards` tại `b2f67ea`. Chưa gộp. |
| 11/11/2026 | MacBook Pro | Mở R1 ở kho `repo-standards` (phiên riêng); mã xong tại `0fa5473`, đã kiểm lại độc lập, chưa đẩy. |
| 11/11/2026 | MacBook Pro | Dựng nền: kế hoạch, đo thử B0, tạo kho, đẩy lịch sử, viết bàn giao. Chủ kho ban đầu định giao Mac Studio, cuối ngày đổi: MacBook Pro làm tiếp. Thử kéo kho về chỗ trống: nhánh, thẻ, tệp bàn giao và lệnh cập nhật `main` đều chạy. |

## Kiểm bàn giao 12/11 (MacBook Pro)

Đã chạy thật, trên một thư mục trống, bản `chuyen-nha` `4c0f368c`:

| Việc | Kết quả |
|---|---|
| Lệnh kéo kho của `MO-PHIEN.md` Bước 1 | chạy; 30 thẻ, 5 768 commit, `main` của hai kho cùng `909dffd8` |
| Lệnh cập nhật `main` chạy lại khi kho cũ không đổi | không làm gì, đúng như ghi |
| Bộ tự so bản Node `bash tests/bo-chay.sh node` | «khớp» (máy Node 24.22, kho khai 24) |
| Kịch bản đo `b0/dung-ban-sao.sh`, bước chạy bộ kiểm thay bằng bản giả | dựng đủ ba bản sao trong 44 giây (A 5 750 commit · B một commit, 5 723 tệp · C 1 875 tệp) |
| Khuôn 0.5.0 kéo từ thẻ, thử không ghi lên bản kéo sạch | bộ dò nhận `claude-plugin`; cây không đổi tệp nào |
| Bốn bộ kiểm nhanh của kit trên nhánh `chuyen-nha` (có thêm `migration/`) | bản đồ sản phẩm khớp · hooks 71/71 · workflows xanh · điều phối 667/667 |
| Một phiên không biết gì đọc thử bộ bàn giao | 6 chỗ nặng, 8 vừa, 7 nhẹ — đã sửa ở commit này; phần không sửa được bằng chữ thành chín «câu còn mở» ở `BOI-CANH.md`; ba chỗ nhiễu nhẹ trong phần lịch sử của `KE-HOACH.md` để nguyên |
| Thứ chỉ có trên MacBook Pro (ba kho) | không có commit nào GitHub chưa có |

**Chưa chạy:** ~~hai bộ kiểm lớn (script, plugin — khoảng một giờ) trên nhánh `chuyen-nha`~~ (đã chạy trên Mac Studio 12/11 — đoạn «Bộ kiểm trên Mac Studio») · trọn kịch bản đo B0 từ bản trong
kho (mới thử bước dựng) · bất cứ điều gì trên chính Mac Studio (bản Node, nguồn chợ plugin, bản kéo kho tiêu thụ) · tệp chỉ
đường có tự nạp trên máy khác không · lượt chạy trọn đầu tiên trên nhánh chính kho cũ sau A1 — sau đó đã xanh (đọc lúc nhả 12/11).

**Cài đặt kho trên GitHub:** kho mới đang khác kho cũ ở ba điểm (cho gộp dồn, không khoá nhánh chính, chạy kiểm tắt) —
bảng ở `BOI-CANH.md`. Lưu ý: lệnh cập nhật `main` đẩy thẳng lên `main`, nên khoá nhánh chính trước ngày cắt sẽ làm nó hỏng —
đề xuất khoá vào ngày cắt.
