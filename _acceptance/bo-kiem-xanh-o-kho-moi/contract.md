---
schema_version: 1
feature: Kịch bản chuyển nhà thêm bước đổi đường dẫn và tên trong bộ kiểm theo bố cục mới; bộ kiểm sáu bước xanh trên cây kịch bản dựng từ kit-cu/main mà không bớt ca nào của kho cũ (thước giữ đủ khoá ca hai chiều); báo cáo lớp đỏ có chiều đỏ khi lượt chạy chết ngầm; --nhanh chỉ nhận don-nha/<tên>; tệp trạng thái sống của đợt không làm hồ sơ hoá cũ
slug: bo-kiem-xanh-o-kho-moi
owner: phanlemanh@gmail.com
risk_tier: T2      # migration/KE-HOACH.md mục 12, bảng dãy B; vật ở migration/, ngoài t3_paths
surfaces: [cli]
status: draft
approved_by:
approved_at:
design_doc: migration/kich-ban/THIET-KE-B2.md
---

# Acceptance Contract: bo-kiem-xanh-o-kho-moi

## Context

Cây do kịch bản B1 dựng (`don-nha/3.0`) không chạy được bộ kiểm của chính nó: trên `kit-cu/main` `593e6837` cây cũ có 5 548
khoá ca đạt, cây mới còn 248 (đo 14/11 theo túi khoá, design doc §2). Không có bộ kiểm xanh thì không gì chứng rằng kho mới
giữ nguyên tính năng, và mốc 3.0 (B3) không cắt được. Người hưởng: chủ kho (cắt được 3.0 trên bằng chứng), Quỹ hàng (cài một
cây đã kiểm), mọi vòng sau ngày cắt (chạy trên bộ kiểm không bị bớt ca lặng lẽ). Trace: nguyên tố 2 — màu xanh của bộ kiểm
đi kèm một thước chứng nó không đến từ việc bớt ca, và mọi thước mới có chiều đỏ.

Source input: `_acceptance/bo-kiem-xanh-o-kho-moi/opportunity.md` · design doc ở frontmatter · `migration/KE-HOACH.md` mục 12
(thước «giữ đủ khoá ca») · `_acceptance/kich-ban-chuyen-nha/contract.md` `## Notes` (Ngoài-1, Ngoài-3, Ngoài-7) ·
`migration/viec-kho-cu-b2.md`.

Vật ở `migration/kich-ban/`: `don-nha.mjs` (thêm bước 6, chặn `--nhanh`), `bang-xep.json` (khoá `bo_kiem`), `va-bo-kiem.json`
(bảng vá theo tệp), `kiem-cho.mjs` (thước đảo phép đổi), `giu-khoa.mjs` + `bo-khoa.tsv` (thước giữ đủ khoá ca),
`phan-lop.py` + `do-lop-do.sh` + `lop-do.mjs` (báo cáo lớp đỏ), `thuoc-that.mjs` (thước trên nguồn thật), các tệp ca
`*.test.mjs` (tên ca mang mã `BK-AC<n>`, chiều đỏ `BK-AC<n>-do…`, chiều im `BK-AC<n>-im…`). Cộng `_acceptance/config.yaml`
(một dòng `t1_skip_globs`, khoá executor của hồ sơ) và `docs/research/known-limits-ledger.tsv` (một ô lớp). «Nguồn thật» =
`kit-cu/main` lúc chạy; mọi số in kèm mã nguồn.

## Criteria

- AC-1: Given nguồn S và bảng xếp, When chạy kịch bản, Then nhánh đích = S + đúng sáu commit tiêu đề `dọn nhà <k>/6: …`,
  commit 6 là `dọn nhà 6/6: bộ kiểm theo bố cục mới` và chỉ chạm tệp trong tập của bước 6 (design doc §3: `tests/` trừ
  `fixtures/`, `.github/workflows/*.yml`, `Makefile`, `_acceptance/config.yaml`); hai lần chạy cùng nguồn ra cùng mã commit;
  sổ `ket-qua/doi-bo-kiem.tsv` ghi số chỗ của từng lớp luật. Chiều đỏ (fixture): một mục bảng vá có `so_lan` lệch số chỗ
  khớp thật → kịch bản dừng «vá không khớp: <tệp>: <cu>», nhánh đích không đổi; luật đường dẫn chung khớp 0 chỗ → dừng
  «luật bộ kiểm không khớp chỗ nào».
- AC-2: Given bản gốc ở S của mỗi tệp trong tập bước 6 và tệp ấy ở cây mới, When thay ngược CHỈ đường mới về đường cũ theo
  bảng xếp đảo và tên mới về tên cũ theo bảng tên đảo — KHÔNG đảo mục bảng vá; bằng mã riêng của thước, không nhập hàm của
  kịch bản —, Then kết quả bằng bản gốc từng byte cho MỌI tệp của tập trừ đúng các chỗ khai ở `dao-mo-ho.tsv` (đếm và in),
  và mọi tệp không phải sản phẩm ngoài tập (ngoài tệp khuôn commit 5) giống bản gốc từng byte; thước in `<n>/<n> tệp bộ kiểm
  chỉ khác bản gốc ở đường và tên · <m> chỗ đảo mơ hồ đã khai`. Chiều đỏ (fixture): sửa tay một dòng của một tệp kiểm → đỏ
  «tệp kiểm lệch luật: <đường>»; dạng `<mã cũ>:<đường cũ>` bị đổi → đỏ cùng thông điệp (dạng lịch sử phải giữ); một mục bảng
  vá đổi một số hay xoá một assert (`assert.equal(n, 3)` → `assert.ok(true)`) → đỏ cùng thông điệp gọi tên tệp của mục ấy;
  một chỗ `dao-mo-ho.tsv` khai mà cây mới không còn → đỏ «chỗ đảo mơ hồ không còn: <tệp>».
- AC-3: Given hai thư mục đo (cây cũ, cây mới) mỗi thư mục có bảng thời gian từng ca do `tests/bo-chay.sh` ghi, TAP bộ điều
  phối và `ketqua.tsv`, When chạy `giu-khoa.mjs`, Then thoát 0 và in «giữ đủ: <n>/<n> khoá, bỏ <k>» khi túi khoá ĐẠT của
  cây cũ (sau khi đổi qua `bang-ten.json`) nằm trọn trong túi khoá ĐẠT của cây mới trừ các khoá ở `bo-khoa.tsv`; ngược lại
  thoát 1 và in «thiếu <m> khoá» kèm từng khoá. Mỗi dòng `bo-khoa.tsv` phải mang mã một dòng sổ ghi lời chủ kho; dòng thiếu
  mã → đỏ «bỏ khoá không có quyết: <khoá>». Fixture do bên viết thật sinh trong lượt: bộ chạy giả gọi `bc_tg_mo`/`bc_tg_dong`
  của `tests/bo-chay.sh` cho phía bash, `node --test --test-reporter=tap` thật trên hai tệp ca sinh trong lượt (có test con,
  có skip) cho phía điều phối. Chiều đỏ: xoá một ca ở bộ chạy giả của cây mới → đỏ nêu ĐÚNG khoá ấy; ca ấy đổi thành SKIP hay
  FAIL → đỏ nêu khoá ấy; xoá một test tầng ngoài ở tệp TAP → đỏ nêu đúng tên; một khoá lặp hai lần ở cây cũ chỉ còn một ở
  cây mới → đỏ; bộ thiếu tệp thời gian hay `ketqua.tsv` thiếu `XONG` → đỏ «bộ không đo được: <bộ>». Chiều im: thêm một ca ở
  cây mới → thoát 0 và in khoá thừa; đổi tên plugin theo bảng tên trong khoá → thoát 0; khoá cũ chứa một đường cũ
  (`scripts/x.sh`), khoá mới chứa đường theo bảng xếp → thoát 0; khoá chỉ khác ở đường thư mục tạm hay mã commit → thoát 0.
- AC-4: Given nguồn thật S và cây kịch bản dựng từ S, When chạy sáu bước của việc `tests` (lệnh đọc từ
  `.github/workflows/gate.yml` của chính mỗi cây, mỗi cây một `TMPDIR` ngắn) trên một bản kéo riêng của mỗi cây, Then thư mục
  `migration/kich-ban/ket-qua/giu-khoa/` giữ hai túi khoá đã đọc (mỗi cây một tệp, kèm băm của các tệp thô) và báo cáo
  `giu-khoa.md` ghi mã nguồn, mã cây mới, danh sách bước đã chạy, sáu mã thoát mỗi cây đều 0, và phán quyết «giữ đủ <n>/<n>
  khoá, bỏ 0» với n BẰNG số khoá đạt của cây cũ đo trên cùng nguồn; thước trên nguồn thật chạy lại `giu-khoa.mjs` trên hai túi
  đã commit và đỏ khi phán quyết hay n khác báo cáo, «báo cáo giữ khoá đo trên cây cũ» khi mã cây trong báo cáo khác mã cây
  kịch bản dựng trên nguồn lúc chấm, và «bỏ khoá chưa duyệt» khi `bo-khoa.tsv` có dòng. Chiều đỏ (fixture): sửa một dòng
  của báo cáo → đỏ; `gate.yml` fixture có khối `run:` nhiều dòng và một bước thứ bảy → bộ đọc in đủ bảy bước hoặc dừng
  «không đọc được việc tests: <lý do>».
- AC-5: Given hai thư mục đo, When `phan-lop.py` viết báo cáo lớp đỏ, Then «đỏ thêm» tính từ túi khoá (ca đỏ cộng ca không chạy
  tới), có cột «không chạy tới» theo bộ, và mỗi bộ chết ngầm (mã thoát ≠ 0 mà 0 dòng kết quả · thiếu tệp thời gian · thiếu
  dòng của bộ hay thiếu `XONG` ở `ketqua.tsv`) là một mục lớp `bo-chay` có tên; báo cáo có mục ấy không bao giờ in tổng 0. And
  `do-lop-do.sh` chỉ thay `ket-qua/lop-do.md` khi báo cáo mới qua đối chiếu số học. Chiều đỏ (fixture): bộ chạy giả chết sau
  ca đầu → báo cáo đếm đúng số khoá không chạy tới, không đếm 0; bộ thoát 1 không in dòng nào → mục `bo-chay` gọi tên bộ;
  phép viết báo cáo ném lỗi giữa chừng → tệp báo cáo cũ còn nguyên byte.
- AC-6: Given một kho có `main` và `chuyen-nha`, When chạy kịch bản với `--nhanh` là `main`, `chuyen-nha`, `kit-cu/main` hay
  một tên không bắt đầu `don-nha/`, Then thoát 2 với «nhánh đích phải là don-nha/<tên>: <tên đã gõ>» và mọi ref, HEAD,
  thư mục làm việc không đổi. Đối chứng dương: `--nhanh don-nha/thu` trên cùng kho → thoát 0, nhánh có.
- AC-7: Given `_acceptance/config.yaml` thật của nhánh và `scripts/pre-merge-check.sh` thật, When dựng một kho fixture mang
  đúng `risk_tiers.t1_skip_globs` đọc từ tệp thật, một hồ sơ đã ký có `verified_commit`, rồi thêm một commit, Then commit chỉ
  sửa `migration/TRANG-THAI.md` → lưới không in «evidence is stale»; commit sửa `migration/kich-ban/don-nha.mjs` → lưới in
  «evidence is stale» gọi tên hồ sơ (đối chứng dương cùng kho). Chiều đỏ: bản sao cấu hình gỡ dòng `migration/TRANG-THAI.md`
  → commit chỉ sửa tệp sống lại làm lưới in «evidence is stale».
- AC-8: Given nhánh của vòng, When chạy bộ kiểm của kịch bản B1 (`don-nha.test.mjs`) và thước trên nguồn thật của B1
  (`thuoc-that.mjs`, chế độ mặc định), Then cả hai thoát 0 với số commit sáu, và suite của kho trên nhánh
  (`feature_loop.suite_keys`) có 0 ca đỏ — gồm `P177` (lớp sổ), `KT-8`/`P122`/`P126` (bản đồ) và `RT13` (sau khi vòng kho cũ
  gộp K1). Lượt chấm chỉ chạy khi `kit-cu/main` đã có bản sửa của vòng gọi chéo và K1 (Hỏi-3).

## Coverage

Quét Zwicky (preset test-matrix rút gọn), đủ ở design doc §2–§7.

- **Trục 1 — lớp ca đỏ ở cây mới** [thước CE: lớp của `migration/kich-ban/ket-qua/lop-do.md` + phép đo túi khoá §2 —
  SUY-TỪ-REPO]: đường dẫn (AC-1, AC-2) · tên đổi (AC-1) · dựng bản cũ từ lịch sử — giữ (AC-2 chiều đỏ) · không chạy tới
  (AC-3, AC-5) · bộ chạy chết (AC-5) · ngữ nghĩa sản phẩm — kho cũ (AC-8, `viec-kho-cu-b2.md`).
- **Trục 2 — thuộc tính phải giữ** [thước CE: ba thước B2 ở `migration/KE-HOACH.md` mục 12]: xanh ở kho mới (AC-4) · cùng ca
  xanh ở kho cũ (AC-4, cây cũ) · giữ đủ khoá ca (AC-3, AC-4) · chỉ đổi bằng luật (AC-2) · tất định (AC-1).
- **Trục 3 — giới hạn của B1 B2 dùng làm thước** [thước CE: `_acceptance/kich-ban-chuyen-nha/contract.md` `## Notes`]:
  Ngoài-1 (AC-6) · Ngoài-3, Ngoài-7 (AC-5) · hồ sơ hoá cũ vì tệp sống (AC-7, `TRANG-THAI.md` «Giới hạn đã biết» của B1).
- **Trục 4 — chiều im của thước giữ khoá** [thước CE: KE-HOACH mục 12 «thêm ca, sửa tài liệu và hồ sơ → im»]: thêm ca ·
  đổi tên theo bảng tên · đường tạm và mã commit trong khoá (AC-3).
- `[GIẢ ĐỊNH]` Dòng kết quả mà bộ chạy tự ghi là đơn vị ca ổn định giữa hai cây (cùng bộ chạy, cùng tên ca) — kiểm bằng
  AC-3 chiều im và đối chứng dương cây cũ so chính nó ở AC-4.

## Out of scope

- Sửa ngữ nghĩa sản phẩm hay bộ kiểm ở kho cũ `~/dev/acceptance-gate-kit` — vòng gọi chéo (hạt giống) và mục K1 của
  `migration/viec-kho-cu-b2.md`, phiên giữ đợt gom.
- Một nguồn bố cục duy nhất cho bộ kiểm (helper thay cho đường cứng) — dãy C sau ngày cắt.
- Hai việc `design-floor`, `design-eval` của lượt kiểm tự động — ngoài «sáu bước của việc `tests`» của thước B2.
- Cắt mốc 3.0, đẩy `don-nha/3.0`, chuyển Quỹ hàng (B3); mọi cài đặt GitHub; `/repo-setup:github`.
- Đổi chữ văn xuôi nhắc tên cũ trong tài liệu sống; sửa hồ sơ `_acceptance/` của kho cũ.

## Notes

- **Giới hạn khai trước:** khoá ca là dòng kết quả mà bộ chạy in; hai ca khác nhau in cùng một dòng thì thước đếm theo túi
  (số lần), không phân biệt được chúng là ca nào.
- **Giới hạn khai trước:** khoá của bộ điều phối là tên ca tầng ngoài của TAP (độ mịn kế hoạch chốt — 667 ca); một test con
  chết mà ca tầng ngoài vẫn `ok` thì thước không thấy. Bước bản đồ là một khoá.
- **Giới hạn khai trước:** phép đảo của AC-2 không thấy một sửa tay chỉ đổi đường cũ thành đường mới ở chỗ không có neo —
  sửa ấy không đổi nghĩa ca; mọi đổi khác (số, assert, lệnh) đều lộ.
- **Giới hạn khai trước:** hai việc `design-floor`, `design-eval` của lượt kiểm tự động ngoài thước — tệp của chúng vẫn qua
  bước 6 nhưng không ai đo chúng xanh ở kho mới trong vòng này.
- **Giới hạn khai trước:** AC-4 đo trên Mac Studio, một lượt mỗi cây; ca chập chờn có thể vào phần thiếu — báo cáo ghi ca
  đỏ ở cả hai cây để tách.
- **Giới hạn khai trước:** bảng vá theo tệp là phép thay chuỗi gắn với nội dung kho cũ hôm nay; kho cũ sửa đúng dòng ấy thì
  kịch bản dừng to («vá không khớp») và phải vá lại — có tiếng, không im.
- **Ngưỡng «phình»:** kế hoạch ghi «hơn một phần ba ca đỏ thì dừng, trình chủ kho»; chủ kho được trình 1 787 / ~5 416 ≈ 33 %
  và bảo mở (14/11). Đo theo khoá: thiếu 5 302 / 5 550 ≈ 95 %, phần chênh là ca không chạy tới — lên thẻ Cổng Phạm vi.
