---
schema_version: 1
feature: Đặc tả UX đọc sổ màn — điền sẵn kiểm kê màn và bảng trạng thái từ lệnh đọc màn của kho, và một lệnh kiểm bảng trạng thái so với sổ
slug: dac-ta-ux-doc-so-man
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/so-man.cjs mới, gate-card.js, khuôn đặc tả UX, SKILL feature-loop — không chạm hooks/, lib/, pre-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-11-22-dac-ta-ux-doc-so-man-design.md
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: dac-ta-ux-doc-so-man

## Context

Gốc: _acceptance/dac-ta-ux-vat-hoa-cau-truc/ — hồ sơ cắt phần kiểm bảng trạng thái sau năm lượt chấm hỏng và ghi điều
kiện mở lại ở `docs/plans/2026-08-24-hat-giong-khop-vong-dac-ta-ux.md` (không tự chế bộ đọc · ranh giới đóng · ma trận
hình dạng viết trước · mỗi cánh đỏ được · ghim nguyên câu). Vật máy đọc mà điều kiện ấy chờ nay có ở phía sổ: gói thiết
kế của kho tiêu thụ cài lệnh đọc màn `tools/design-assembly/screen-facts.mjs`. Chủ kho duyệt đề bài «hai kho bên cạnh gọi
và đọc» (mảng 3, tiêu chí 9 và 10) và cho phép sửa kit cho lát này ngày 22/11/2026; đã quyết: kit GỌI lệnh đọc, không tự
đọc tệp sổ · phần chỉ việc này mới biết ở lại tài liệu của kit · kho không có lệnh đọc làm như hôm nay.

Thuật ngữ:
- **lệnh đọc** = `tools/design-assembly/screen-facts.mjs` trong kho tiêu thụ; **câu trả lời** = stdout `--json` của nó.
- **lệnh đọc giả** = tệp do tệp ca dựng trong kho bỏ đi: in một mẫu câu trả lời ở `tests/scripts/fixtures/so-man/`, lọc
  theo `--screens` như hợp đồng của lệnh đọc (tên không khớp vào `unknown`, thoát 1), ghi lại đối số nhận được.
- **bản chép** / **biến thể** = loại của một tệp mẫu, khai ở `tests/scripts/fixtures/so-man/nguon.json`: bản chép là
  stdout của lệnh đọc thật (kho, phiên bản gói, lệnh, ngày); biến thể suy từ một bản chép, khai tệp gốc và khoá đổi.
- **tệp ca** = `tests/scripts/so-man.test.mjs`; tên ca = mã ô của ma trận hình dạng (mục 4 bản thiết kế) hoặc mã tiêu chí.
- **lệnh** = `plugins/acceptance-gate/scripts/so-man.cjs`; **bảng** = các dòng giữa hai marker `UX-STATE-TABLE` trong mục
  `## Đặc tả UX` của bản thiết kế.

## Criteria

- AC-1: Given kho bỏ đi có lệnh đọc giả in mẫu hai màn, When `--dien --man overdue,reference` (D1), không `--man` (D2),
  mẫu `must_have: null` (D7), mẫu một màn không trạng thái (D8), Then stdout là một khối gồm bảng kiểm kê (mỗi màn một hàng
  «<title> (<id>)», hai cột còn lại giữ ô khuôn `{{…}}`) và bảng trạng thái giữa hai marker, mỗi trạng thái một hàng
  `ST-<id>-<trạng thái>` với trạng thái sổ bắt phải có đứng trước, hai cột người viết giữ ô khuôn; hàng tiêu đề và marker
  rút từ tệp khuôn lúc chạy; ghi chú ra stderr; lệnh đọc giả nhận đúng `--json --target <kho> --screens overdue,reference`.
- AC-2: Given khối `--dien` vừa in, When dán nó vào mục `## Đặc tả UX` của một bản thiết kế và chạy `--kiem --tep` trên cùng
  kho (D6), Then thoát 0 với câu «bảng trạng thái khớp sổ màn: N hàng, M màn»; và trên bản sao tệp khuôn đổi tên cột
  «Hiển thị gì», khối điền mang tên cột mới và vẫn qua `--kiem` — bên viết và bên đọc rút cùng một khuôn.
- AC-3: Given kho không có lệnh đọc, When `--dien` (D4), `--kiem --tep` trên bản thiết kế có bảng sai (B6), và dựng thẻ Cổng
  Phạm vi cho một hồ sơ có bản thiết kế (L7), Then hai lệnh không in gì và thoát 0, còn thẻ bằng từng byte thẻ do
  `gate-card.js` ở gốc nhánh dựng trên cùng hồ sơ; và ở kho CÓ lệnh đọc, thẻ của hồ sơ `surfaces: [cli]` không có bảng (L8)
  cũng bằng từng byte thẻ ở gốc nhánh.
- AC-4: Given mười một hình dạng chỗ đặt bảng (ô K1–K11 của ma trận), When `--kiem --tep`, Then mỗi ô cho đúng kết cục đã
  viết trước: khối trong khối mã, marker giữa câu, marker thụt bốn dấu cách, cặp marker ở mục khác là «không có bảng»;
  thiếu marker đóng, hai cặp, đóng trước mở là đỏ với câu «mục Đặc tả UX có K marker mở và H marker đóng UX-STATE-TABLE —
  phải đúng một cặp, mở trước đóng»; khối thật kèm khối minh hoạ sai trong khối mã thì đọc khối thật và xanh.
- AC-5: Given mười ba hình dạng hàng (ô H1–H13), When `--kiem --tep`, Then mỗi ô cho đúng kết cục đã viết trước và mỗi câu
  đỏ ghim nguyên câu: bảng không hàng dữ liệu đỏ «rỗng»; thiếu cột, sai số ô, câu văn lọt giữa hàng, ô khuôn ở cột
  «Trạng thái», mã không `ST-`, mã khai hai lần đều đỏ nêu số dòng; ô khuôn ở cột người viết chỉ thành một dòng đếm; cột
  thêm và đổi thứ tự đọc theo tên cột; CRLF như LF; tên có dấu khớp giữa dạng tách dấu và dạng gộp.
- AC-6: Given mười hình dạng so với sổ (ô S1–S10), When `--kiem`, Then thoát 1 và câu nêu đích danh màn và trạng thái khi
  bảng nêu màn sổ không có («màn «M» không có trong sổ màn (dòng N, mã «X»)»), trạng thái sổ không có («màn «M» không có
  trạng thái «T» trong sổ màn (dòng N, mã «X»)»), hay thiếu trạng thái sổ bắt phải có («màn «M» thiếu trạng thái «T» mà sổ
  màn bắt phải có — thêm hàng «ST-M-T»»), hoặc mã mang mã màn khác; xanh khi khớp, khi ô «Màn» là đường dẫn, khi màn được
  miễn, khi hai mã màn lồng tiền tố, và khi trạng thái bắt buộc không có trong `states`; màn mới của chính việc (S10) cho
  câu «không có trong sổ màn» lên thẻ mà các mục hỏi người và dòng lệnh duyệt của thẻ bằng thẻ khi không có khối.
- AC-7: Given lệnh đọc giả trả mười ba hình dạng câu trả lời (ô B1–B5, B7–B11, D3, D5, D9), When `--kiem` hoặc `--dien`,
  Then `must_have: null` không đỏ vế thiếu và in đúng một dòng giới hạn; `keys_not_found` in một dòng nêu khoá mà kết cục
  không đổi; thoát 1 kèm `unknown` (và thoát 0 kèm `unknown`) đỏ nêu màn; lệnh đọc thoát 2, stdout không phải JSON, thiếu
  khoá, quá hạn (10 giây, `SO_MAN_HAN_MS` đổi được), mã thoát lạ đều thoát 2 với câu «không đọc được sổ màn ở đây: …» và không bao giờ thoát 0; `--dien` với
  một màn lạ in hàng cho màn có và thoát 1; mã chứa `|` hay xuống dòng bị từ chối có tên.
- AC-8: Given các lối vào (ô L1–L6, L9, L10), When gọi `--kiem --tep`, `--kiem --slug` với `design_doc` trong hợp đồng, `--slug` không
  có bảng trên hồ sơ có và không có mặt người nhìn, `design_doc` trỏ tệp vắng, gọi sai, dựng thẻ Cổng Phạm vi khi kho có
  lệnh đọc, khi lệnh đọc thoát 2 và khi nó quá hạn, Then đọc đúng tệp hợp đồng trỏ; không có bảng thì đỏ «hồ sơ có mặt người nhìn mà bản thiết kế không có bảng
  trạng thái — kho này có sổ màn để so» khi có mặt người nhìn và im khi không; tệp vắng và gọi sai thoát 2 có tên; thẻ có
  khối «Bảng trạng thái ↔ sổ màn» mang đúng các câu `--kiem` in, khối không thêm mục hỏi người, không đổi dòng lệnh duyệt và không vào bản trích `--extract`; lệnh đọc thoát 2 hay quá hạn thì thẻ vẫn dựng, `gate-card.js` thoát 0
  trong hạn cộng một giây, khối mang câu «không đọc được sổ màn ở đây: …».
- AC-9: Given SKILL feature-loop và tệp khuôn đặc tả UX, When đọc bước thiết kế số 4, Then nó mang khối marker
  `UX-SO-MAN-S1` với đúng hai lệnh `--dien` và `--kiem` và nguyên câu lối ra «Màn mới của chính việc này chưa có trong sổ:
  giữ các hàng của nó, không xoá và không đổi sang màn khác — câu đỏ lên thẻ cho người duyệt thấy.», hai lệnh ấy chạy được
  trên kho bỏ đi có lệnh đọc giả; phần lời đầu
  tệp khuôn nói kho có lệnh đọc thì điền bằng lệnh và kiểm bằng lệnh; khối `UX-SPEC-TEMPLATE` giữ nguyên từng byte so với
  gốc nhánh; ba ca UX1, UX3, UX4 của `tests/plugins/ux-spec.test.mjs` vẫn xanh.
- AC-10: Given bản sao trọn `scripts/` và `lib/` của gói acceptance-gate, When `rang/dot-bien.mjs` tiêm từng nhát đã khai ở
  mục 5 bản thiết kế, Then mỗi nhát làm đỏ đúng ca đã ghim sau khi bản nguyên vẹn xanh trên cùng fixture; và chạm một tệp
  không phải vật (một tệp trong `docs/`, hồ sơ của chính vòng) thì mọi ca vẫn xanh; và khi ca F1 chạy trên `nguon.json`
  cùng các tệp mẫu, mỗi tệp mẫu có đúng một dòng nguồn; mỗi bản chép khai kho,
  phiên bản gói, lệnh và ngày; mỗi biến thể chỉ khác bản chép gốc của nó ở đúng các khoá đã khai — một biến thể đổi thêm
  một khoá không khai làm F1 đỏ nêu tệp và khoá; và chạy không lọc, tệp ca in «số ca chạy: 64» đếm từ các ca thực chạy.

## Coverage

Quét bằng ma trận hình dạng ở mục 4 bản thiết kế (preset test-matrix của morphological-scan, viết trước mã). Trục:
chỗ đặt bảng K (11 ô) × hàng H (13) × so với sổ S (10) × câu trả lời của lệnh đọc B (11) × lối vào L (10) × điền D (9) — 64 ô,
mỗi ô một ca; ô gốc lành K1×H1×S1×B1, các trục còn lại quét từng ô trên ô gốc (tích Descartes đủ là vô nghĩa — trục độc
lập). Thước CE: trục K, H theo năm hình dạng hỏng đã đo ở năm lượt chấm của hồ sơ gốc (bảng «bằng chứng bốn vòng» của hạt
giống 24/08) cộng danh sách ô mà người giao việc nêu đích danh; trục B theo hợp đồng của lệnh đọc (mục «screen-facts» trong
tài liệu kiểm của gói thiết kế: ba mã thoát, `must_have: null`, `keys_not_found`) [CE: ngành — tài liệu hợp đồng của gói
thiết kế, chỉ đọc]. Ánh xạ: K → AC-4 · H → AC-5 · S → AC-6 · B → AC-3, AC-7 · L → AC-3, AC-8 · D → AC-1, AC-2, AC-3,
AC-7 · nguồn mẫu và số ca chạy → AC-10. Ô Later: đối chiếu trạng thái khai với bài kiểm đo nó (nửa còn lại của hạt giống).

## Out of scope

- Đối chiếu «trạng thái khai trước ↔ bài kiểm đo nó» — nửa còn lại của hạt giống 24/08, vẫn là hạt giống.
- Đọc tệp sổ (`design/screens*`, `design/states.json`) trong kit, hay chép bộ đọc của gói thiết kế sang kit.
- Nối lệnh kiểm vào `pre-merge-check.sh`, hook, hay thành eval mặc định của lượt chấm; khối thẻ chặn cổng.
- Sửa gì trong kho gói thiết kế, hay chạy lệnh đọc thật trong bài kiểm; lượt thử trên một kho tiêu thụ thật.
- Đổi cột của khuôn đặc tả UX, hay thêm cạnh điều hướng / «người làm gì tiếp» vào sổ.
- Ghi vào cấu hình hay hồ sơ rằng một kho «không có lệnh đọc».

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Giới hạn đã khai (chép từ mục 7 bản thiết kế): lệnh kiểm so với sổ lúc chạy, màn mới chưa vào sổ thì đỏ cho tới khi sổ
  ghi nó (ngưỡng mở lại: ≥1 vòng chạm màn ở kho có lệnh đọc mà Cổng Phạm vi mang câu «không có trong sổ màn» cho một màn
  mới); biến thể mẫu là chữ viết tay theo khuôn bên đọc (ngưỡng: ≥1 lần lệnh chạy trên kho thật cho kết cục khác ca cùng
  hình dạng); `title` là thứ sổ ghi (có kho ghi khoá chữ); ô có `\|` không đọc được; lệnh đọc so tên từng ký tự, sổ ghi tên
  dạng tách dấu sẽ trả `unknown`; bài kiểm dùng lệnh đọc giả.
- Bộ đọc bảng: `lib/context-glossary.js#stripNonProse` (xoá trắng khối mã, giữ số dòng) → `lib/md-section.cjs#sectionLines`
  (mục `## Đặc tả UX`, luật ranh giới khai một chỗ) → luật dòng đóng của `so-man.cjs` (marker nguyên dòng rút từ khuôn,
  đúng một cặp, mỗi dòng giữa hai marker thuộc đúng một loại). Phần đầu hợp đồng: `lib/evidence-core.cjs#frontmatterField`;
  mặt người nhìn: `lib/lop-nhin-thay.cjs#laMatNguoiNhin`.
