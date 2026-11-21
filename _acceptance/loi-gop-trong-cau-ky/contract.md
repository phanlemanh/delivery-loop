---
schema_version: 1
feature: Lời gộp đi cùng lời ký trong một câu ở Cổng Bằng chứng — ô gộp điền sẵn «gộp khi CI xanh» trên thẻ của kho đã bật, lệnh ký ghi câu người gõ thành một dòng sổ máy đọc, lệnh gộp sẵn có nhận lối vào «theo lời ký» ngoài đợt; kho không bật không đổi một byte
slug: loi-gop-trong-cau-ky
owner: phanlemanh@gmail.com
risk_tier: T2      # gate-card.js, commands/signoff.md, human-facing-language.md, dispatch/scripts/gop.mjs + dieu-phoi.mjs, feature-loop SKILL, tests — không khớp t3_paths
surfaces: [cli]
status: draft
design_doc: docs/superpowers/specs/2026-11-21-loi-gop-trong-cau-ky-design.md
approved_by:
approved_at:
---

# Acceptance Contract: loi-gop-trong-cau-ky

## Context

Chủ kho quyết «làm» ở Cổng Đáng 21/11/2026 (ô `opportunity.md`). Hồ sơ `ky-den-gop` cho đoạn ký → gộp một chủ máy, nhưng
chỉ trong một đợt chạy. Vòng chạy ngoài đợt: thẻ Cổng Bằng chứng chỉ có ô «ký hay trả», lệnh ký để việc gộp cho người. Đợt
19–21/11: 2 trên 3 vòng tốn một lượt gọi người riêng cho lời gộp; lần hai xảy ra dù đã dặn bằng lời.

Gốc: `_acceptance/ky-den-gop/` — ý định «đoạn ký → gộp có thước và có chủ máy» đã ký 23/10; vòng này nối câu ký với lệnh gộp
của hồ sơ ấy cho vòng chạy ngoài đợt.

Đây là CỘNG vào engine: phê duyệt đích danh là câu hỏi của Cổng Phạm vi vòng này (dòng sổ S1 «chỉ người có», khó đảo).

Thuật ngữ:
- **kho bật** = `_acceptance/config.yaml` của kho khai `feature_loop.gop_theo_loi_ky: true`. Vắng, `false` hay giá trị khác
  là **kho không bật**.
- **ô gộp** = vế `gộp: khi CI xanh` trong dòng lệnh thẻ Cổng Bằng chứng in.
- **danh sách đóng** = khối `GATE-ONESHOT-GOP` của `plugins/acceptance-gate/skills/acceptance/references/human-facing-language.md`:
  sáu dạng lời gộp (lối `gộp` hoặc `chưa-gộp`) và năm dạng vế ký (lối `chữ-ký` hoặc `trả-lại`).
- **có lời gộp** = câu có ít nhất một vế lối `gộp`, không có vế `chưa-gộp` nào, có một vế `chữ-ký`, không có vế `trả-lại`.
- **dòng lời gộp** = một dòng của `decisions.jsonl` có `stage: gate2` và khoá `loi_gop.cau` mang nguyên văn TRỌN câu người
  gõ, ghi theo khuôn `LOI-GOP-GATE2-LINE` của `plugins/acceptance-gate/commands/signoff.md`. Kho bật: mọi câu có chữ ký ghi
  đúng một dòng như thế, cùng commit với chữ ký — kể cả câu «gộp: chưa» hay câu vắng nhãn gộp.
- **bên đọc** = hàm đọc lời gộp trong `plugins/dispatch/scripts/gop.mjs`.
- **lệnh gộp theo lời** = `dieu-phoi.mjs gop <số PR> --theo-loi --slug <slug> [--cho-ci <phút>]`.
- **hồ sơ thử** = hồ sơ do kịch bản mã sinh trong lượt chạy (`tests/plugins/fixtures/viec-cua-anh-scenarios.sh`), không viết tay.

## Criteria

- AC-1: Given kho bật và một hồ sơ thử chờ ký (báo cáo PASS, chưa có chữ ký người, không phải hồ sơ máy-đi-trước), When dựng
  thẻ Cổng Bằng chứng và `--extract`, Then dòng lệnh (`one_shot` và dòng lệnh trên HTML) chứa `gộp: khi CI xanh` đứng ngay
  trước `ký hay trả: ___`; `routing.bao` chứa «gộp», `routing.hoi` không chứa «gộp» và vẫn chứa «ký hay trả»; dòng «Trả lời
  mẫu» không có ô gộp; khối việc-của-anh có một dòng nói cách sửa ô thành «chưa»; ô «ký hay trả» vẫn là `___`.
- AC-2: Given kho không bật (ba dạng: khoá vắng · `false` · giá trị lạ), When dựng thẻ hai cổng và `--extract` trên các hồ
  sơ thử và trên mọi hồ sơ thật của kho này với khoá bị gỡ khỏi bản sao cấu hình, Then đầu ra bằng từng byte đầu ra của bản
  mã trước vòng. Bản TRƯỚC là cha của commit ĐẦU TIÊN của vòng chạm `plugins/acceptance-gate/` (bất kỳ tệp nào), bản SAU là
  commit CUỐI CÙNG như thế, cả hai lấy bằng `git archive` trọn thư mục; khi hồ sơ của vòng chưa ký, bản SAU phải bằng đúng
  cây đang kiểm, lệch thì đỏ. Đối chứng đặc hiệu: cùng phép so trên hồ sơ thử của kho bật phải thấy khác đúng ở ô gộp.
- AC-3: Given kho bật, When dựng thẻ cho bốn hồ sơ thử — đã có chữ ký người · máy-đi-trước · không ký được (REJECT) · đã
  khép (nghỉ) — Then không thẻ nào có ô gộp, `routing.bao` không chứa «gộp», và phần còn lại của mỗi thẻ bằng từng byte thẻ
  của cùng hồ sơ ở kho không bật (ma trận viết trước bốn hàng, số assert = số hàng).
- AC-4: Given tệp luật mặt người và thân lệnh ký, When rút các khối marker, Then `GATE-ONESHOT-SLOTS` có dòng `g2 gộp`;
  danh sách đóng có đúng mười một dòng dạng — sáu dạng lời gộp và năm dạng vế ký — mỗi dạng đúng một dòng và đúng lối (ma
  trận viết trước mười một hàng); thân lệnh ký trỏ tên khối danh sách đóng và mang khuôn `LOI-GOP-GATE2-LINE`; bộ kiểm
  vòng-khép thẻ ↔ danh sách nhãn (P192, rút nguyên văn từ `tests/plugins/run-tests.sh`) xanh trên bộ thẻ có thêm thẻ của
  kho bật, và đỏ «nhan khong khop SLOTS: gộp» khi dòng `g2 gộp` bị gỡ khỏi bản sao luật.
- AC-5: Given TRỌN dòng lệnh thẻ kho bật vừa dựng (không viết tay), bỏ tên lệnh và tên hồ sơ, thay `___` lần lượt bằng từng
  dạng vế ký RÚT từ danh sách đóng, điền vào khuôn dòng sổ rút từ thân lệnh ký, When bên đọc đọc sổ, Then mỗi dạng lối
  `chữ-ký` ra «có lời gộp» và dạng `trả-lại` ra «không»; mỗi dòng dạng lời gộp của danh sách đóng, ghép một vế ký, đi qua
  bên đọc ra ĐÚNG lối khối luật ghi (số assert = số dòng rút được, sáu); câu có cả «gộp: khi CI xanh» lẫn «chưa gộp» ra
  «không» (chưa-gộp thắng); và ma trận sổ viết trước — câu vắng vế gộp · câu có vế gộp mà không có vế ký · dòng sau «chưa»
  thay dòng gộp trước · dòng sau gộp thay dòng «chưa» trước · dòng cuối không đạt thì KHÔNG lùi về dòng gộp cũ hơn · dòng
  JSON hỏng xen giữa · sổ rỗng · dạng ngoài danh sách («gộp nhé») — mỗi hàng ra đúng kết cục, hàng từ chối mang thông điệp
  nói vì sao.
- AC-6: Given kho git thật dựng trong lượt (origin trần + bản kéo; nhánh PR mang hồ sơ đã ký, báo cáo có chữ ký, dòng lời
  gộp ghi cùng commit với chữ ký, cấu hình kho bật) và `gh` giả, When chạy lệnh gộp theo lời, Then `gh` nhận đúng MỘT lời
  gọi `pr merge <n> --merge --match-head-commit <sha đầu nhánh>`, không `--auto`, lệnh thoát 0; và lần lượt bỏ từng vế trên
  đầu nhánh — khoá kho tắt · hợp đồng ở `machine-cleared` · `human_signoff` rỗng · không có dòng lời gộp · câu ghi không
  mang lời gộp · dòng lời gộp không sinh cùng commit với chữ ký hiện hành — thì 0 lời gọi merge, lệnh thoát 1 và thông điệp
  gọi tên đúng vế thiếu (ma trận viết trước sáu hàng); hồ sơ ký HAI lần, lần hai câu «gộp: chưa; Ký» ghi dòng mới → 0 lời
  gọi merge; hồ sơ được chấm lại rồi ký lại mà lần ký mới không ghi dòng nào → 0 lời gọi merge; `--xet` → in quyết định, 0
  lời gọi merge; các vế đọc từ đầu nhánh của PR chứ không từ cây làm việc (cây làm việc sửa khác đầu nhánh không đổi kết
  cục).
- AC-7: Given bộ ca đã ký của hồ sơ `ky-den-gop` (`tests/dieu-phoi/loi/gop.test.mjs`, I-1…I-7), When chạy trên cây đã sửa,
  Then mọi ca xanh như trước; và lệnh `gop <số PR>` KHÔNG cờ `--theo-loi` ở nơi không có đợt vẫn từ chối «không có đợt nào
  đang chạy» trước mọi lời gọi `gh`, kể cả khi đầu nhánh có đủ dòng lời gộp.
- AC-8: Given khối `GOP-THEO-LOI-KY` và `GOP-THEO-LOI-THOAT` ở thân lệnh ký và ở mục S5 của SKILL feature-loop, When rút hai
  bản, Then dòng lệnh hai nơi trùng nhau sau khi chuẩn hoá chỗ trỏ gói feature-loop và mang cờ `--cho-ci`; bảng mã thoát hai
  nơi trùng từng ký tự, có đủ ba mã 0 · 4 · 1 và dòng mã 4 nói kết cục sau lần chạy lại; và dòng lệnh rút từ khối, thay
  `<số PR>` và `<slug>`, CHẠY được thật trong kho thử của AC-6 (gói điều phối giải về cây đang kiểm, `gh` giả trên PATH)
  với `gh` giả đi từ «check đang chạy» sang «xanh»: 0 lời gọi merge khi còn đang chạy, đúng một lời gọi sau khi xanh, thoát
  0; check đỏ hẳn → thoát 1 với «CI đỏ» ngay lượt hỏi đầu, không hỏi lại; hết giờ chờ mà check còn chạy → thoát 4.
- AC-9: Given bản sao trọn `plugins/acceptance-gate/{scripts,lib,skills,commands}` và `plugins/dispatch/scripts` trong thư
  mục tạm, When lần lượt tiêm từng nhát — thẻ in ô gộp khi kho không bật · thẻ xếp «gộp» vào `routing.hoi` · thẻ in ô gộp
  cho hồ sơ đã ký · thẻ điền sẵn chữ ký vào ô «ký hay trả» · một tệp `lib/` đổi thẻ của kho không bật · bên đọc lấy dòng ĐẦU
  thay dòng cuối · bên đọc lùi về dòng cũ khi dòng cuối không đạt · bên đọc bỏ phép đọc lại câu · bên đọc chỉ nhận vế ký
  trần «Ký» · bên đọc thiếu một dạng của danh sách đóng · bên đọc bỏ luật chưa-gộp thắng · lệnh bỏ phép buộc cùng commit với
  chữ ký · lệnh bỏ kiểm khoá kho · lệnh nhận `machine-cleared` · lệnh bỏ kiểm `human_signoff` · lệnh đọc cây làm việc thay
  đầu nhánh · lệnh gộp thêm `--auto` · lệnh gộp khi check còn chạy · lệnh không cờ bỏ đòi đợt — Then mỗi nhát làm đúng ca
  của nó đỏ với thông điệp ghim, sau khi ca ấy đã xanh trên bản sao chưa tiêm (đối chứng dương); và ba nhát không phải vật
  — thêm một dòng sổ thường không mang `loi_gop` · thêm một chú thích vào mã · sửa chữ trong một tệp tài liệu — không làm
  ca nào đỏ.

## Coverage

- Trục A — trạng thái hồ sơ lúc dựng thẻ: chờ ký | chờ ký có mục người chấm | máy-đi-trước / máy đã thông | đã ký | không ký
  được | đã khép [thước CE: ba vế `approvable` · `MAY_DI_TIEP` · `DA_KHEP` của `gate-card.js`; kịch bản của
  `viec-cua-anh-scenarios.sh`] → AC-1, AC-3
- Trục B — khoá của kho: vắng | `false` | `true` | giá trị lạ [thước CE: tiền lệ ổ cắm bật-theo-lựa-chọn của kit —
  `feature_loop.ngoai_n_tu_dinh_tuyen`, `feature_loop.do_san_tren_nen`] → AC-1, AC-2
- Trục C — câu người gõ: giữ ô điền sẵn | sửa thành «chưa» | vắng | dạng ngắn «gộp khi xanh» | cả gộp lẫn chưa-gộp | có lời
  gộp mà không ký (trả lại) | vế ký điền vào ô «ký hay trả:» | dạng ngoài danh sách [thước CE: ba câu thật của đợt
  19–21/11 trong `migration/TRANG-THAI.md` nhánh `chuyen-nha`; khối `GATE-ONESHOT-LAN-V` làm khuôn ma trận] → AC-4, AC-5
- Trục D — điều kiện lúc gộp: đủ | khoá tắt trên đầu nhánh | hồ sơ chưa ký hay máy thông | không lời gộp | lời gộp của lần
  ký cũ | CI đang chạy | CI đỏ | nhánh chính đã tiến | PR nháp · xung đột · đã đóng | đầu nhánh đổi sau lúc xét [thước CE:
  bốn điều kiện của thiết kế `ky-den-gop` mục I; ca I-1…I-7] → AC-6, AC-7, AC-8 (ba giá trị cuối đã do ca cũ của
  `ky-den-gop` phủ, chạy lại ở AC-7)
- Chân ngành: [NGÀNH: Bors `r+`] — lời duyệt mang lời gộp, máy gộp bản đã kiểm; [NGÀNH: hàng gộp của GitHub] — gộp theo
  commit đã kiểm (`--match-head-commit`).
- Cross-cutting mọi ô: kho không bật không đổi byte (AC-2) · đường trong đợt không đổi (AC-7) · phép đo hai chiều (AC-9).
- Later: đuôi tự do ngoài danh sách đóng («ký, gộp khi xanh» viết liền bằng dấu phẩy) — máy không đoán, người gõ lại theo
  nhãn. Never: tự gộp của GitHub (`--auto`); gộp cho hồ sơ máy đã thông.

## Đường đo

- Thước 1 (sống): trong N vòng ký đầu ở các kho bật (N ≥ 3, 21 ngày từ lần cài đầu), 0 vòng tốn lượt gọi người riêng cho
  việc gộp · số từ: sổ quyết định của từng vòng trên nhánh chính — kho bật thì mỗi lần ký để lại một dòng lời gộp mang
  nguyên văn câu, nên vòng nào «ký mà chưa gộp» đọc được thẳng từ sổ; lượt gọi riêng đếm tay từ bản ghi phiên của vòng như
  ba dòng số đầu của luật (c) · N = 0 thì thước vô hiệu · bảo đảm bởi: AC-1, AC-5.
- Thước 2 (sống): «ô bắt buộc xanh → gộp» trung vị không quá một nửa nền của kho (Inventory: nền 22′, ngưỡng 11′) · số từ:
  `gh` trên các PR của cửa sổ theo cách đo của báo cáo `repo-standards` 20/11 (giờ check bắt buộc cuối cùng xong → giờ gộp);
  không dựng thước mới trong kit · bảo đảm bởi: AC-6, AC-8 (lệnh tự chờ CI rồi gộp).
- Thước chết 1: một lần máy gộp mà câu người gõ không mang lời gộp · số từ: so commit gộp với sổ của hồ sơ trên nhánh chính
  — dòng lời gộp cuối cùng trước commit gộp đọc lại bằng danh sách đóng không ra «có lời gộp» · bảo đảm bởi: AC-5, AC-6, AC-9.
- Thước chết 2: từ 2 trên N vòng vẫn phải xin lời gộp riêng dù câu ký đã mang ô gộp · số từ: vòng có dòng lời gộp đọc ra
  «có lời gộp» mà commit gộp không do lệnh gộp theo lời tạo trong cùng phiên — đếm tay từ sổ và bản ghi phiên của vòng,
  cùng cửa sổ với thước 1 · bảo đảm bởi: AC-8.

## Out of scope

- Hàng gộp tự động và tự gộp của GitHub (`--auto`).
- Bật mặc định cho mọi kho; cài lên kho tiêu thụ; cắt thẻ hay bản phát hành.
- Hồ sơ máy đã thông không có chữ ký người (làn V) — không có câu người gõ.
- Luật gộp trong đợt (`tu_merge`, khoá merge): giữ nguyên; trong đợt lời gộp được ghi nhưng luật đợt quyết.
- Lối nhanh «không trùng tệp» cho vòng ngoài đợt (khoá ấy sống ở cấu hình đợt).
- Đoán lời gộp từ đuôi tự do ngoài danh sách đóng.
- Bốn việc thấy trên đường của đợt chuyển nhà (DL1 · P179 · lượt chấm đọc nhãn «đỏ sẵn trên nền» · `main` thiếu dòng tắt
  plugin chợ cũ).

## Notes

- Ca đo: `tests/scripts/lgck-the.test.mjs` (thẻ, luật, vòng-khép), `tests/dieu-phoi/loi/gop-theo-loi.test.mjs` (bên đọc,
  lối vào, chờ CI), `tests/dieu-phoi/loi-gop-mutants.test.mjs` (nhát tiêm). Khoá chấm ở `_acceptance/config.yaml`.
- Sửa ca đã ký theo vật (ghi dòng sổ `fix` ở S3): `tests/plugins/run-tests.sh` khối P192 và danh sách thẻ của
  `tests/scripts/nlvh-the.test.mjs` nhận thêm một thẻ của kho bật, vì dòng `g2 gộp` đòi có hồ sơ thử dựng ra nó.
- Mọi commit của vòng chạm `plugins/acceptance-gate/` mang dấu «(loi-gop-trong-cau-ky)» trong thông điệp — phép so của AC-2
  tìm cặp commit bằng dấu ấy.
- ADR 0029 (máy gộp theo lời gộp trong câu ký) và mục «Lời gộp» của `CONTEXT.md` đi cùng PR; không phải tiêu chí.
- Bảng dự báo năm dòng số của luật (c):

  | Dòng | Dự báo | Vì sao |
  |---|---|---|
  | 1 làm-xong → gộp (tách làm-xong → ký / ký → gộp) | = / ↓ | đoạn «ô bắt buộc xanh → gộp» hết chờ người; làm-xong → ký không đổi |
  | 2 lượt gọi người mỗi vòng (trong / ngoài thiết kế) | ↓ | hết lượt gọi riêng cho lời gộp (đo: 2 trên 3 vòng 19–21/11); chạm mỗi lượt không đổi |
  | 3 vòng bị hạ tầng kit đốt lượt chấm | = | không chạm đường chấm |
  | 4 token máy mỗi vòng | = | lượt chấm không đổi; thêm vài lệnh sau chữ ký |
  | 5 phút máy mỗi lượt chấm | = | không chạm lượt chấm |

  Điều kiện tin cậy: đường phán quyết (tìm lỗi → phản bác trong hợp đồng → REJECT) không đổi thành phần; vòng này không
  chạm nó.
- Giới hạn khai trước (thiết kế mục «Giới hạn khai trước»): lệnh gộp đòi mọi check của PR xanh kể cả check không bắt buộc;
  phiên kết thúc trước khi CI xanh thì việc gộp chờ vòng được mở lại; lời gộp do lệnh ký ghi hộ, cùng mô hình tin với chữ ký.
