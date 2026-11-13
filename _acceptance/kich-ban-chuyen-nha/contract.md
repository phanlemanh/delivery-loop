---
schema_version: 1
feature: Một kịch bản lấy nhánh chính kho cũ và dựng nhánh cục bộ don-nha/3.0 bằng năm commit dọn nhà tất định — sản phẩm vào plugins/<tên>/, tên chợ, plugin, lệnh, skill theo bảng tên, con trỏ sang kho cũ bằng đường dẫn đầy đủ, khuôn Repo Standards — kèm ba thước của B1 và số đo lớp ca kiểm đỏ do đổi bố cục cho B2
slug: kich-ban-chuyen-nha
owner: phanlemanh@gmail.com
risk_tier: T3      # chủ kho đặt T3 (migration/KE-HOACH.md mục 12, bảng dãy B); vật ở migration/, ngoài t3_paths — máy tự suy ra T2
surfaces: [cli]
status: approved
approved_by: Phan Le Manh
approved_at: 2026-11-13
design_doc: migration/kich-ban/THIET-KE.md
---

# Acceptance Contract: kich-ban-chuyen-nha

## Context

Đợt chuyển nhà dời kit `acceptance-gate-kit` sang kho kế nhiệm `delivery-loop`, mang trọn lịch sử. Hôm nay plugin lõi lấy
cả kho làm nguồn — bản cài 5 729 tệp, 101 MB, sản phẩm thật 610 tệp. Vòng này dựng công cụ sinh cây mới từ nhánh chính
kho cũ, chạy lại được mỗi khi kho cũ đổi, để không ai phải sửa tay ở kho mới. Người hưởng: chủ kho (đợt chuyển nhà làm
bằng máy, kiểm được), vòng B2 (số ca đỏ theo lớp), Quỹ hàng (cây 3.0 đứng yên để cài). Trace: nguyên tố 2 — mỗi thuộc tính
của cây mới có thước máy hai chiều, không tin lời kịch bản tự khai.

Source input: `_acceptance/kich-ban-chuyen-nha/opportunity.md` (Cổng Đáng ký 13/11) · design doc ở frontmatter ·
`migration/KE-HOACH.md` mục 3, 12, 13 · sổ `migration/tra-soat/ket-qua/` · `migration/chay-thu-phien/` · `migration/b0/`.

Vật ở `migration/kich-ban/`: `don-nha.mjs` (kịch bản), `bang-xep.json` (bảng xếp + luật đổi chữ), `kiem-cho.mjs` (thước
một chỗ và nội dung), `thuoc-that.mjs` (thước trên nguồn thật), `do-lop-do.sh` (lượt đo lớp đỏ), `don-nha.test.mjs` (kiểm
trên kho fixture do mã sinh; tên ca mang mã AC `KB-AC<n>`, chiều đỏ `KB-AC<n>-do…`). «Nguồn thật» = `kit-cu/main` lúc chạy;
mọi số in kèm mã nguồn.

## Criteria

- AC-1: Given nguồn thật S và bản kéo Repo Standards tại `4dc53e0`, When chạy kịch bản hai lần vào hai nhánh khác tên,
  Then hai đỉnh nhánh cùng mã commit và cùng mã cây, và mỗi lần in một dòng `don-nha: <S> → <mã commit> cây <mã cây>`.
  Hai lần chạy mô phỏng hai ngày khác nhau (khuôn giả của fixture lấy ngày theo đồng hồ như `apply.py` thật khi không
  được truyền `year`/`today`) vẫn cùng mã cây. Chiều đỏ (fixture): bản sao kịch bản bỏ cố định ngày commit, hai lần chạy
  cách nhau ≥1 giây → thước đỏ «hai lần chạy khác mã commit»; bản sao bỏ truyền `today` cho khuôn, hai lần chạy ở hai
  ngày → đỏ «hai lần chạy khác mã cây».
- AC-2: Given nguồn S, When kịch bản chạy xong, Then nhánh đích = S + đúng năm commit tiêu đề `dọn nhà <k>/5: …` (k = 1…5,
  cha của commit 1 là S), và `main`, `chuyen-nha`, mọi ref `kit-cu/*`, HEAD và thư mục làm việc của kho không đổi (so trước
  và sau), và danh sách cây làm việc (`git worktree list`) không đổi. Chạy lại vào CÙNG nhánh sau khi nguồn đi thêm một
  commit có một tệp mới trong một thư mục sản phẩm: thoát 0, cha của commit 1 là nguồn mới, tệp mới nằm ở
  `plugins/<tên>/…`. Chiều đỏ (fixture): bản sao kịch bản ghi nhánh đích lên `chuyen-nha` → đỏ «ref không phải đích bị
  đổi: refs/heads/chuyen-nha».
- AC-3: Given sổ kiểm kê của S (lớp `san-pham` và `chua-ro`) và bảng xếp, When đo cây mới, Then mỗi tệp có ĐÚNG một đường
  ở cây mới — đích theo bảng xếp —, đường cũ không còn, không hai tệp chung một đích; mọi tệp không thuộc hai lớp ấy giữ
  nguyên đường; danh sách bỏ (mỗi dòng một lý do) in số dòng; thước in `<n>/<n> tệp sản phẩm có đúng một chỗ`. Chiều đỏ
  (fixture): bản sao cây mới xoá một tệp sản phẩm → đỏ «tệp sản phẩm không có chỗ: <đường>»; chép thêm một bản vào đường
  cũ → đỏ «tệp sản phẩm hai chỗ: <đường>».
- AC-4: Given bản gốc của mỗi tệp ở S và các luật đổi chữ, đổi con trỏ đã khai, When so với bản ở cây mới, Then áp lại
  đúng các luật lên bản gốc ra đúng bản mới cho MỌI tệp đã dời hoặc trong tập tài liệu đã khai, và mọi tệp không phải sản
  phẩm khác (ngoài tệp khuôn của commit 5) giống bản gốc từng byte. Thước áp luật bằng mã RIÊNG của nó (không nhập hàm
  của kịch bản). And một ma trận viết trước, đặt trong tệp kiểm chứ không rút từ bảng xếp, gồm chuỗi phải đổi
  (`/dieu-phoi:mo-dot`, `dieu-phoi@acceptance-gate-kit`, `--plugin dieu-phoi`, `acceptance-gate:cat-luot`, `name: cat-luot`)
  và chuỗi phải GIỮ nguyên byte (`scripts/cat-luot.mjs`, `lo-trinh-cat-luot`, `dieu-phoi.mjs`, `acceptance-gate-kit-tri-thuc`,
  «skill `cat-luot`» trong văn xuôi); fixture chứa đủ hai nhóm; trên nguồn thật, số chỗ có `dieu-phoi.mjs`, `cat-luot.mjs`,
  `acceptance-gate-kit-tri-thuc` trước và sau bằng nhau. Chiều đỏ (fixture): sửa tay một dòng của một tệp đã dời ở cây mới
  → đỏ «nội dung lệch luật: <đường>»; bản sao bảng xếp gỡ neo đuôi của luật tên chợ → đỏ «chuỗi phải giữ bị đổi:
  acceptance-gate-kit-tri-thuc».
- AC-5: Given cây mới, When đọc `.claude-plugin/marketplace.json` và `plugin.json` của từng plugin, Then chợ tên
  `delivery-loop`, đủ sáu plugin, mỗi `source` là `./plugins/<tên>` có thật với `plugin.json` mang đúng `name` ấy, ba tên
  mới `dispatch` · `roadmap` · `knowledge` theo `bang-ten.json`, không còn `source` nào là gốc kho, và `claude plugin
  validate` qua trên chợ và trên từng plugin. Chiều đỏ (fixture): bản sao tệp khai trỏ một `source` không có → đỏ «nguồn
  plugin không có: <tên>».
- AC-6: Given cây cũ S và cây mới, When chạy ca chạy thử phiên thật (`chay-thu.mjs`) trên từng cây rồi so qua
  `bang-ten.json`, Then lệnh so thoát 0: sáu plugin, mọi lệnh và skill, ba tác tử của cây cũ có mặt ở cây mới sau khi đổi
  tên, không thiếu không thừa, mọi plugin của chợ mới qua lớp tĩnh và lớp cài. (Hai chiều của lệnh so do
  `chay-thu.test.mjs` giữ — tám ca.)
- AC-7: Given sổ con trỏ của S (con trỏ RÕ từ tệp sản phẩm sang tệp không phải sản phẩm), When đo cây mới, Then mỗi con trỏ
  ấy thành `https://github.com/phanlemanh/acceptance-gate-kit/blob/<S>/<đường>` ở tệp đích của nó, và quét lại các tệp
  dưới `plugins/` không còn con trỏ rõ nào trỏ một tệp không phải sản phẩm; thước in số con trỏ đã đổi. Chiều đỏ
  (fixture): bản sao kịch bản bỏ bước con trỏ → đỏ «con trỏ còn treo: <tệp> → <đường>».
- AC-8: Given cây mới, When đọc kết quả commit 5, Then `.repo-setup.json` ghi khuôn `claude-plugin`, mức `starter`, biến
  `project_name=delivery-loop`; có `.editorconfig`, `Makefile`, `tools/plugin_lint.py`, `tools/bump_version.py`; không có
  `.claude/skills/review-change/`; danh sách tệp mà commit 5 thêm, sửa, xoá (so với commit 4) nằm trọn trong một danh
  sách viết trước ở bảng xếp (thêm: `.editorconfig` `Makefile` `tools/plugin_lint.py` `tools/bump_version.py`
  `.repo-setup.json` · sửa: `.gitignore` `.gitattributes` · không xoá tệp nào của kit), nên `CLAUDE.md`,
  `.claude/settings.json`, `.github/` không bị chạm; `make -n test` in lệnh bộ chạy kiểm của kit; `plugin_lint.py` không còn báo lỗi «nguồn
  là cả kho»; `doctor` chấm mục `plugin_source_not_root` đạt và in điểm. Chiều đỏ (fixture): bản kéo Repo Standards ở mã
  khác mã bảng xếp ghim → kịch bản dừng «khuôn không đúng thẻ <thẻ>», nhánh đích không đổi; khuôn giả sửa `CLAUDE.md` →
  dừng «khuôn chạm tệp ngoài danh sách: CLAUDE.md».
- AC-9: Given một nguồn hỏng, When chạy kịch bản, Then kịch bản thoát khác 0 với thông điệp ghim và KHÔNG tạo hay đổi nhánh
  đích, ở ba ca: (a) nguồn có một thư mục gốc chưa có trong bảng xếp → «thư mục gốc chưa xếp: <tên>»; (b) một luật đổi chữ
  khớp 0 chỗ trên toàn tập → «luật không khớp chỗ nào: <luật>»; (c) khuôn báo xung đột (conflict) → «khuôn xung đột: <tệp>».
  Đối chứng dương trên cùng fixture lành: thoát 0, nhánh có.
- AC-10: Given cây cũ S và cây mới, When chạy sáu bước bộ kiểm của lượt kiểm tự động trên mỗi cây (cùng kịch bản B0,
  mỗi cây một thư mục tạm, cùng kiểu tên thư mục kho), Then `migration/kich-ban/ket-qua/lop-do.md` ghi: mã nguồn và mã cây
  mới đã đo; theo từng bộ — số ca đỏ ở cây cũ, ở cây mới, đỏ thêm; ca đỏ thêm chia theo lớp dấu hiệu (đường dẫn không còn
  · tên đổi · dựng bản cũ từ lịch sử · bộ chạy không chạy được · khác), mỗi lớp kèm số và tối đa ba dòng mẫu; và mã cây ghi
  trong báo cáo bằng mã cây kịch bản dựng trên nguồn lúc chấm, nếu không thước đỏ «báo cáo lớp đỏ đo trên cây cũ».

## Coverage

Quét Zwicky (preset test-matrix rút gọn), đủ ở design doc §2–§8.

- **Trục 1 — lớp tệp** [thước CE: lớp của `migration/tra-soat/ket-qua/kiem-ke.tsv` — SUY-TỪ-REPO]: sản phẩm lõi · sản
  phẩm plugin con · `chua-ro` · tài liệu sống đã khai · cấu hình kho · không phải sản phẩm (bộ kiểm, hồ sơ, sổ) — AC-3,
  AC-4, AC-7.
- **Trục 2 — phép biến đổi** [thước CE: năm bước của B1 ở KE-HOACH mục 12, bảng dãy B — SUY-TỪ-REPO]: dời (AC-3) · đổi
  tên chợ, plugin, lệnh, skill (AC-4, AC-5, AC-6) · con trỏ (AC-7) · khuôn (AC-8) · giữ nguyên (AC-3, AC-4).
- **Trục 3 — thuộc tính phải giữ** [thước CE: ba thước B1 ở KE-HOACH mục 12 + luật «kho này chỉ sửa migration/»; NGÀNH:
  `git filter-repo` — viết lại đường dẫn có lịch sử, chuẩn đối chiếu cho «dời mà giữ lịch sử»]: tất định (AC-1) · đứng
  trên nguồn, không chạm ref khác (AC-2) · đủ một chỗ (AC-3) · nạp được trong phiên (AC-6) · dừng khi nguồn lạ (AC-9).
- **Trục 4 — tình huống chạy**: lần đầu · chạy lại cùng nguồn (AC-1) · nguồn mới có tệp mới trong thư mục sản phẩm (đi theo
  thư mục — AC-3) · nguồn hỏng (AC-9).
- **Số đo cho vòng sau**: lớp đỏ do đổi bố cục (AC-10).
- `[GIẢ ĐỊNH]` Bố cục `plugins/<tên>/` + tệp khai chợ ở gốc là bố cục chợ plugin Claude Code mà khuôn `claude-plugin` của
  Repo Standards định chuẩn và `claude plugin validate` nhận — kiểm bằng AC-5, AC-6.

## Out of scope

- Làm bộ kiểm xanh trên cây mới, đổi đường dẫn trong bộ kiểm và trong `_acceptance/config.yaml` của cây mới — vòng B2.
- Sửa bảy chỗ lõi gọi thẳng thư mục điều phối — sửa ngữ nghĩa, làm ở kho cũ một vòng riêng trước ngày cắt; vòng này chỉ
  in danh sách còn lại.
- Đổi số phiên bản (3.0, số của `diagram-design`) — mốc 3.0 (B3).
- Đẩy `don-nha/3.0` lên GitHub, cắt mốc, chuyển Quỹ hàng — B3. Mọi cài đặt GitHub, `/repo-setup:github`.
- Đổi chữ trong văn xuôi nhắc tên cũ, đổi đường dẫn trong tài liệu sống, sửa `CLAUDE.md`, `CONTEXT.md`, ADR, nhật ký thay
  đổi; README song ngữ, tách sử liệu, rà hạt giống, sổ giao diện công khai.
- Sửa kho cũ `~/dev/acceptance-gate-kit` hay hai kho tiêu thụ.

## Notes

- **Giới hạn khai trước:** luật đổi chữ chỉ đổi chỗ có neo (tiền tố lệnh, khoá plugin, tên chợ, `name:` của skill); chữ
  nhắc trần trong văn xuôi giữ tên cũ.
- **Giới hạn khai trước:** bảy chỗ gãy chéo lõi → điều phối còn gãy ở bản cài của cây mới cho tới khi vòng kho cũ sửa; AC-6
  không thấy chúng (nó đo nạp, không chạy lệnh).
- **Giới hạn khai trước:** ca xung đột của khuôn (AC-9c) chạy trên khuôn giả; với `apply.py` thật, lưới là danh sách
  tệp được phép chạm của AC-8.
- **Giới hạn khai trước:** AC-10 đo trên máy này, một lượt mỗi cây; ca chập chờn có thể lẫn vào «đỏ thêm» — báo cáo ghi
  ca nào đỏ ở cả hai cây để tách.
