---
schema_version: 1
feature: Ba tệp mọi PR cùng chạm thôi chặn gộp — hai view máy sinh rời git theo lựa chọn của kho (`ban_do.ngoai_git`), lệnh kiểm riêng của hồ sơ về thư mục hồ sơ thay vì tệp cấu hình chung, và sổ giới hạn được máy sinh hàng nên P179 thôi đốt lượt chấm
slug: tep-chung-khong-chan-gop
owner: phanlemanh@gmail.com
risk_tier: T3      # plugins/acceptance-gate/lib/workspace-record.cjs (bảng nhãn chung của bản đồ) khớp t3_paths
surfaces: [cli]
status: approved
design_doc: docs/superpowers/specs/2026-11-21-tep-chung-khong-chan-gop-design.md
approved_by: Phan Le Manh
approved_at: 2026-11-22
---

# Acceptance Contract: tep-chung-khong-chan-gop

## Context

Chủ kho gọi tên vòng «DL1 + P179» ngày 21/11/2026 và nới luật chiều rộng (b) cho đúng vòng này. Đích: rút đoạn bắt đầu →
GỘP ở kho tiêu thụ bằng cách bỏ hai chỗ ăn thời gian đã đo — xung đột ở ba tệp mọi PR cùng chạm, và lượt chấm bị P179
đánh trượt vì sổ thiếu hàng. Số đo và lý do chọn: bản thiết kế, mục 1–2.

Gốc: `_acceptance/tep-sinh-khong-chan-gop/` — vòng 2.36.0 gỡ xung đột của hai view tại máy bằng bộ gộp riêng; giới hạn đã
khai của nó («forge không chạy bộ gộp của máy») là điều vòng này gỡ. Hạt giống: `docs/plans/2026-10-16-hat-giong-tep-sinh-xung-dot-moi-lan-goi.md`
(bước 2) · `docs/plans/2026-08-21-hat-giong-ba-cho-tich-luy-khong-duong-ra.md` (mục 3a) ·
`docs/plans/2026-10-18-hat-giong-so-known-limits-thieu-hang-p179.md` (đề xuất 1).

Hai CỘNG chủ kho phê đích danh bằng chữ ký Cổng Phạm vi này: khoá `ban_do.ngoai_git` (bật theo lựa chọn) và móc
`PostToolUse` của chính kho kit cho bộ sinh hàng sổ.

Thuật ngữ:
- **hai view** = `PRODUCT-MAP.md` và `LO-TRINH.html` ở gốc kho, do `plugins/acceptance-gate/scripts/product-map.mjs` vẽ.
- **kho bật** = `_acceptance/config.yaml` khai `ban_do:` với dòng con `ngoai_git: true`. Khoá vắng hoặc `false` là **kho
  không bật**; giá trị khác là **khoá sai**.
- **rời git đúng** = cả hai view (view nào kho đang vẽ: trang chỉ khi kho khai `lo_trinh.tep`) KHÔNG nằm trong chỉ mục
  git VÀ được `git check-ignore` báo là bị bỏ qua.
- **khối lệnh vẽ lại** = khối dòng lệnh `PMAP=scripts/product-map.mjs …` trong `commands/approve.md`, `commands/signoff.md`,
  `commands/observed.md` và `skills/uat-session/SKILL.md` của gói acceptance-gate.
- **bản trước vòng** = `git archive` trọn `plugins/acceptance-gate` tại `git merge-base HEAD origin/main` (vắng `origin/main`
  thì `main`); **bản sau** = cây đang kiểm.
- **luật lệnh hồ sơ** = khối marker `LENH-HO-SO` (một câu: lệnh dùng chung → `config:`; lệnh riêng của hồ sơ → tệp trong
  `_acceptance/<slug>/`, không thêm khoá vào `_acceptance/config.yaml`).
- **bộ sinh hàng sổ** = `tools/so-gioi-han.mjs`; **sổ** = `docs/research/known-limits-ledger.tsv`.
- **kho thử / hồ sơ thử** = kho git thật và hồ sơ do mã của ca sinh trong lượt chạy, không viết tay.

## Criteria

- AC-1: Given kho thử không bật (hai dạng: khoá vắng · `ngoai_git: false`) với hồ sơ thử ở các trạng thái bản đồ phân ô,
  When chạy bằng bản trước vòng và bản sau: `product-map.mjs --root .` (ghi), `--check` trên ba tình huống (khớp · lệch vì
  sửa hồ sơ · bản đồ đã commit rồi bị xoá) và bộ quét `start-scan.mjs`, Then tệp vẽ ra, stdout, stderr, mã thoát và khoá
  `map` của JSON quét bằng nhau từng byte giữa hai bản. Đối chứng đặc hiệu: cùng phép so trên kho thử BẬT phải thấy khác.
- AC-2: Given kho thử bật, hai view rời git đúng, When (a) sửa trạng thái một hồ sơ mà không vẽ lại, (b) xoá hẳn hai tệp
  khỏi cây làm việc, (c) vẽ lại tại chỗ, Then `--check` thoát 0 ở cả ba và in đúng một dòng nói hai view vẽ tại chỗ, ngoài
  git — không dòng «lệch», không dòng «đã bị xoá».
- AC-3: Given kho thử bật, When lần lượt (ma trận viết trước bốn hàng): `PRODUCT-MAP.md` còn trong chỉ mục · `LO-TRINH.html`
  còn trong chỉ mục · một view không bị `.gitignore` bỏ qua · bộ vẽ lỗi (tệp lộ trình hỏng) — Then `--check` đỏ ở mỗi hàng:
  ba hàng đầu thoát 1 với thông điệp gọi tên tệp và lệnh gỡ (`git rm --cached -- <tệp>` hoặc dòng `.gitignore` cần thêm),
  hàng bốn đỏ với đúng thông điệp lỗi của bộ vẽ như kho không bật.
- AC-4: Given bốn khối lệnh vẽ lại rút nguyên văn từ bốn tệp, When so bốn bản và chạy khối (thay `AG` bằng gói của cây
  đang kiểm) trong kho thử, Then bốn bản trùng nhau từng ký tự và khối KHÔNG đọc khoá (nó hỏi git: view bị `.gitignore`
  bỏ qua thì không đưa vào chỉ mục); kho bật, rời git đúng → hai view được vẽ tại chỗ, `git diff --cached --name-only`
  không có view nào, khối thoát 0; kho không bật → hai view nằm trong chỉ mục như trước, khối thoát 0.
- AC-5: Given ma trận viết trước sáu dạng viết khoá — `ngoai_git: true` trần · `"true"` có nháy · `true  # chú thích` ·
  `ngoai_git: true` thụt dưới một khối khác `ban_do` · `yes` · khoá vắng — When đưa từng dạng qua ba bên đọc khoá (bộ đọc
  ở `lib/workspace-record.cjs`, `product-map --check`, bộ quét `/start`), Then ba bên cho cùng phán quyết bật · tắt · sai
  ở mọi dạng (số assert = sáu dạng × ba bên), khoá sai → `--check` thoát 2 gọi tên `ban_do.ngoai_git`; trên kho thử bật mà
  hai view vắng, bộ quét trả `map.state` = `ve-tai-cho` với `map.label` bằng nhãn của bảng chung cho trạng thái ấy (không
  phải nhãn «đã bị xoá»), `--check` dùng chính nhãn đó, và bộ đọc nhóm kế hoạch của gói điều phối in đúng một dòng cờ vàng
  gọi tên lệnh vẽ (kho không bật: im như cũ); trên kho thử KHÔNG bật mà bản đồ từng commit rồi bị xoá → vẫn `da-xoa`.
- AC-6: Given kho git thật dựng trong lượt, gốc chung có hai view đã vẽ, hai nhánh từ gốc ấy mỗi nhánh đổi trạng thái một
  hồ sơ KHÁC nhau rồi chạy khối lệnh vẽ lại và commit, không khai bộ gộp riêng nào, When `git merge-tree --write-tree`
  hai đầu nhánh, Then kho bật → không xung đột; kho không bật → xung đột ở `PRODUCT-MAP.md` và ở `LO-TRINH.html` (chiều
  đỏ: phép đo thấy xung đột khi nó có).
- AC-7: Given luật lệnh hồ sơ, When rút khối `LENH-HO-SO` từ `plugins/feature-loop/skills/feature-loop/SKILL.md`,
  `plugins/acceptance-gate/skills/acceptance/SKILL.md` và `plugins/acceptance-gate/skills/acceptance/references/eval-executors.md`,
  Then ba bản trùng nhau từng ký tự, và không tệp nào trong ba còn câu bắt mọi `cmd` phải là `config:`; và hồ sơ thử có
  eval khai `cmd` bằng đường dẫn tệp trong thư mục hồ sơ đi trọn đường: `s4-args.mjs` sinh tệp args mang đúng lệnh ấy
  (không `ref`) · lớp L2 (`evaluateEvidence`) nhận báo cáo có `verifier:` là đường dẫn ấy không vi phạm · lệnh ghim lại
  (`repin-lane.mjs --write`) chạy lệnh ấy và ghi `evals_exit` cho eval đó.
- AC-8: Given hồ sơ thử với gốc vòng là một commit cũ, When `s4-args.mjs` chạy, Then ma trận viết trước bốn hàng — khoá
  `config:` thêm sau gốc vòng và chỉ hồ sơ này dùng → đúng một dòng cảnh báo trên stderr gọi tên eval và khoá, kèm câu
  luật lệnh hồ sơ · khoá có từ trước gốc vòng → không cảnh báo · khoá mới nhưng hồ sơ khác cũng dùng → không cảnh báo ·
  eval bằng đường dẫn tệp → không cảnh báo — và cả bốn hàng vẫn sinh tệp args, thoát 0.
- AC-9: Given gốc tạm có bản sao `_acceptance/` và sổ ở trạng thái KHỚP (số hàng = số mục), rồi thêm một hồ sơ thử có k
  mục `Đề xuất: known-limits` và h < k hàng sẵn có, When chạy khối P179 rút nguyên văn từ `tests/plugins/run-tests.sh`
  TRƯỚC rồi SAU bộ sinh hàng sổ `--write`, Then trước: P179 đỏ «quan he >= vo» và thông điệp chứa lệnh của bộ sinh; sau:
  sổ dài thêm đúng k − h hàng so với số hàng đo ngay trước lần chạy, mọi hàng cũ giữ từng byte, mỗi hàng mới qua luật
  hàng của P179, và P179 xanh trên CÙNG gốc tạm; chạy lần hai không đổi byte nào; hồ sơ không có mục → sổ không đổi. Và
  móc rút từ `.claude/settings.json` của cây đang kiểm (sự kiện `PostToolUse`, `matcher` khớp cả `Write` lẫn `Edit`),
  nhận JSON đầu vào mang `tool_input.file_path` tuyệt đối: tệp là `_acceptance/<slug>/review-findings.md` → gọi bộ sinh
  cho đúng slug ấy và trả `additionalContext` nêu số hàng thêm; tệp khác → không đổi sổ, không in gì.
- AC-11: Given kho thử bật có `ban_do.nhanh_ve: ban-do` và một origin trần, When chạy lệnh đẩy nhánh view
  (`product-map.mjs --root . --day-nhanh-ve`) trên đầu nhánh chính, Then origin có nhánh `ban-do` mà đỉnh là một commit
  chỉ chứa hai view, mỗi tệp bằng từng byte bản vẽ tại chỗ từ nguồn của commit ấy, và nhánh chính cùng cây làm việc
  không đổi byte nào; chạy lại khi nguồn không đổi → không đẩy commit mới (in một dòng nói vì sao); đổi nguồn rồi chạy →
  đỉnh mới mang view mới; khoá `nhanh_ve` vắng, rỗng hay trùng tên nhánh mặc định → thoát 2 gọi tên khoá, không đẩy gì.
  Và kho bật mà không khai `nhanh_ve` → `--check` vẫn thoát 0 nhưng in thêm đúng một dòng cờ vàng nói bên đọc trang qua
  git (forge, bản chụp) sẽ mất nguồn; khối job sau gộp ở `GUIDE.md` (khối `BAN-DO-NHANH-VE`) gọi đúng lệnh đẩy này.
- AC-10: Given bản sao trọn `plugins/acceptance-gate/{scripts,lib,commands,skills}`, `plugins/feature-loop/scripts` và
  `tools/` trong thư mục tạm, When lần lượt tiêm từng nhát — `--check` bật bỏ kiểm chỉ mục · bỏ kiểm `.gitignore` · kho
  không bật mà đi nhánh mới · khoá sai coi như tắt · khối lệnh vẽ lại đưa view vào chỉ mục vô điều kiện · bộ quét trả
  `da-xoa` khi bật · bộ quét đọc khoá bằng mẫu riêng thay vì bộ đọc của lib · s4-args bỏ so gốc vòng (cảnh báo khoá cũ) ·
  bộ sinh ghi đè hàng cũ · bộ sinh thêm hàng khi đã đủ · bộ sinh đếm nhầm slug · móc chạy cho mọi tệp · lệnh đẩy đẩy
  cả khi view không đổi · lệnh đẩy ghi vào nhánh mặc định — Then mỗi nhát làm đúng ca của nó đỏ với thông điệp ghim, sau khi ca ấy đã xanh trên bản sao chưa
  tiêm; và ba nhát không phải vật — chú thích vào `product-map.mjs` · sửa chữ một tệp `.md` của gói · thêm một hồ sơ thử
  không mục known-limits — không làm ca nào đỏ.

## Coverage

- Trục A — khoá kho: vắng | `false` | `true` | giá trị sai [thước CE: tiền lệ ổ cắm bật-theo-lựa-chọn của kit —
  `feature_loop.gop_theo_loi_ky`, `feature_loop.ngoai_n_tu_dinh_tuyen`] → AC-1, AC-2, AC-3
- Trục B — trạng thái hai view trong git khi bật: rời git đúng | còn trong chỉ mục (từng tệp) | không bị bỏ qua | vắng
  trên đĩa | vẽ tại chỗ [thước CE: ba tín hiệu của `mapTracked` — config · chỉ mục · lịch sử xoá] → AC-2, AC-3, AC-5
- Trục C — bên dùng view: `--check` ở CI | bốn lệnh cổng | thẻ `/start` | gộp nhánh (máy và forge) | bảng điều phối |
  bên đọc NGOÀI kit qua git/forge [thước CE: `git grep` hai tên tệp và khối `lo-trinh-du-lieu` trong `plugins/` của kit
  VÀ trên nhánh chính ba kho tiêu thụ, đọc 21/11: chỉ `crm-onehub` có bên đọc bằng mã — tính năng Lộ trình đọc tệp qua
  GitHub App và workflow bản chụp bắn khi tệp đổi trên `onehub`; Inventory và Quỹ hàng chỉ có tài liệu nhắc tên] →
  AC-2, AC-4, AC-5, AC-6, AC-11
- Trục D — nơi lệnh kiểm của eval sống: khoá `config:` cũ | khoá `config:` mới chỉ một hồ sơ | khoá mới dùng chung |
  đường dẫn tệp trong hồ sơ [thước CE: 2565 dòng `cmd` của kho kit, 16 dòng không `config:`] → AC-7, AC-8
- Trục E — sổ giới hạn so với hồ sơ: thiếu hàng | đủ | dư | hồ sơ không mục | ghi tệp khác review-findings [thước CE: năm
  lượt đỏ P179 kê ở hạt giống 18/10 + REJECT `d4af0277` của mốc 3.0] → AC-9
- Cross-cutting: kho không bật không đổi byte (AC-1) · phép đo hai chiều (AC-10).
- Later: hai view mỗi hàng một dòng cho kho không bật (hạt giống 30/10); bảng điều phối tự vẽ trang. Never: máy commit
  thẳng lên nhánh chính; máy mở PR vẽ lại sau mỗi lần gộp.

## Out of scope

- K10 — đọc bậc sàn thiết kế khi sổ thành phần nằm ngoài git (lý do: thiết kế mục 4; giữ ở hạt giống giai đoạn 2 mục 2).
- Bật `ban_do.ngoai_git` ở bất kỳ kho nào, kể cả kho kit (Hỏi-3); cài lên kho tiêu thụ; cắt thẻ hay bản phát hành.
- Dời khối `executors.script` đang có của kho nào ra thư mục hồ sơ.
- Bảng điều phối (`plugins/dispatch/scripts/nguon-hang.mjs`) tự vẽ trang tại chỗ — vòng chỉ thêm cờ vàng (AC-5).
- Lối «máy mở PR vẽ lại sau mỗi lần gộp» (Hỏi-1 lối b) — chủ kho chọn nó thì hợp đồng soạn lại trước khi duyệt; chọn lối a
  thì AC-11 bị gỡ.
- Sửa bên đọc của crm (trường nhánh nguồn, trigger workflow bản chụp) — việc của kho crm khi nó bật khoá.
- Hai view mỗi hàng một dòng (hạt giống 30/10); DL2.

## Notes

- Ca đo: `tests/scripts/tcg-ban-do.test.mjs` (AC-1…AC-6, AC-11), `tests/scripts/tcg-lenh-ho-so.test.mjs` (AC-7, AC-8),
  `tests/scripts/tcg-so-gioi-han.test.mjs` (AC-9), `tests/scripts/tcg-mutants.test.mjs` (AC-10). Lệnh chấm theo luật mới:
  `_acceptance/tep-chung-khong-chan-gop/rang/chay.sh <nhóm>` — không thêm khoá nào vào `_acceptance/config.yaml`.
- Bảng dự báo năm dòng số của luật (c), cho kho bật:

  | Dòng | Dự báo | Vì sao |
  |---|---|---|
  | 1 làm-xong → gộp (tách làm-xong → ký / ký → gộp) | ↓ / ↓ | hết lượt gộp nhánh chính → vẽ lại → đẩy → chạy lại CI vì hai view; lối gộp không-trùng-tệp mở lại; lệnh hồ sơ mới thôi chạm tệp cấu hình chung |
  | 2 lượt gọi người mỗi vòng (trong / ngoài thiết kế) | = / ↓ | P179 thôi đẻ lượt chấm lại mà người phải đọc (mốc 3.0: một lượt gọi) |
  | 3 vòng bị hạ tầng kit đốt lượt chấm | ↓ | P179 thiếu hàng là hạ tầng kit (kho kit) |
  | 4 token máy mỗi vòng | ↓ | bớt lượt chấm lại của P179 và lượt chạy lại CI sau gộp ngược |
  | 5 phút máy mỗi lượt chấm | = | không chạm đường chấm |

  Điều kiện tin cậy: đường phán quyết (tìm lỗi → phản bác trong hợp đồng → REJECT) không đổi thành phần — vòng này không
  chạm nó; P179 vẫn là cùng một ca với cùng quan hệ ≥, chỉ thêm dòng gợi lệnh.
- Cảnh báo cho ghi chú phát hành của mốc mang vòng này (chép nguyên ý): kho có bên đọc trang lộ trình qua git hay forge
  (21/11: `crm-onehub` — tính năng Lộ trình, workflow bản chụp) mà bật `ban_do.ngoai_git` thì PHẢI khai `ban_do.nhanh_ve`,
  dán job sau gộp, và trỏ bên đọc sang nhánh view trong CÙNG PR bật; không thì trang Lộ trình mất nguồn. `--check` in cờ
  vàng khi kho bật mà không khai nhánh view (AC-11).
- Dự đoán đoạn gộp ngược ở forge cho Inventory khi bật (ước, không đo lại): không bộ gộp riêng thì forge thấy 134 trên
  168 lần có xung đột; hai view rời git thì phần còn lại ngang số «có bộ gộp riêng» tại máy, khoảng 63, phần lớn ở
  `_acceptance/config.yaml` — phần ấy chỉ giảm dần khi vòng mới viết lệnh theo luật lệnh hồ sơ.
- Việc ngoài phạm vi thấy trên đường: ghi hạt giống có dòng `Gốc:`, không làm trong vòng.
