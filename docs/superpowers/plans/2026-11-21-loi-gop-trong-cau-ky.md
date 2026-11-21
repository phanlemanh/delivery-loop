# Lời gộp trong câu ký — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ở kho đã bật, câu ký Cổng Bằng chứng mang sẵn lời gộp và máy gộp PR theo lời ấy khi CI xanh, bằng lệnh gộp đã có.

**Architecture:** Bộ dựng thẻ in thêm một ô báo `gộp: khi CI xanh`; lệnh ký ghi trọn câu người gõ thành một dòng sổ; lệnh gộp của gói điều phối nhận lối vào `--theo-loi`, đọc trên đầu nhánh của PR và tự đọc lại câu. Ba bản của danh sách đóng (khối luật, hằng thẻ, hằng bên đọc) được ca vòng-khép giữ khớp.

**Tech Stack:** Node 24 (`export PATH=/opt/homebrew/opt/node@24/bin:$PATH` trước MỌI lệnh), CommonJS ở `plugins/acceptance-gate`, ESM ở `plugins/dispatch`, bash 3.2, `node:test`, `git`, `gh` (giả trong ca).

**Spec:** `docs/superpowers/specs/2026-11-21-loi-gop-trong-cau-ky-design.md` · hợp đồng `_acceptance/loi-gop-trong-cau-ky/contract.md` · tiêu chí đo `_acceptance/loi-gop-trong-cau-ky/evals.yaml`.

## Global Constraints

- Khoá: `feature_loop.gop_theo_loi_ky`. CHỈ hai cách viết là bật: `true` và `true` kèm chú thích đuôi (`true  # …`). Vắng, `false`, `"true"`, `True`, `yes`, mọi thứ khác là tắt. Thẻ và bên đọc phải cùng một phán quyết trên sáu cách viết ấy.
- Kho không bật: HTML và `--extract` của thẻ hai cổng bằng từng byte bản trước vòng.
- Một chỗ duy nhất gọi `gh pr merge`: trong `gop()` của `plugins/dispatch/scripts/gop.mjs`, luôn `--merge --match-head-commit <sha>`, không `--auto`.
- Không sửa tệp nào dưới `plugins/acceptance-gate/lib/`, `plugins/acceptance-gate/hooks/`, `pre-merge-check.sh`, `recheck-evidence.cjs` (giữ hạng T2).
- MỌI commit chạm `plugins/acceptance-gate/` mang dấu `(loi-gop-trong-cau-ky)` trong thông điệp. Thông điệp commit kết bằng `Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>`.
- Hồ sơ thử do mã sinh trong lượt chạy; đường dẫn trong ca suy từ vị trí tệp ca; bản base lấy bằng `git archive` trọn thư mục.
- Mỗi ca âm có đối chứng dương trên cùng hồ sơ thử và ghim đúng thông điệp. Nhát tiêm: mũi khớp đúng một lần, không thì ném «mui tiem truot».
- Tệp ca không viết liền chuỗi trạng thái ký người (lưới RT13): dựng bằng `['signed', 'off'].join('-')`.
- Chữ cho người: tiếng Việt, theo `CONTEXT.md` (tránh từ ở `_Avoid_`).

## Review Focus

1. Cách viết khoá lạ (`"true"`, `True`, `yes`) — thẻ in ô gộp mà bên đọc từ chối (hay ngược lại) thì người gõ lời gộp vô ích. Ca: LG-AC1-bat (thẻ) và GL-6 hàng «khoá kho tắt» (bên đọc) chạy cùng sáu cách viết.
2. Câu người gõ viết HOA, thừa khoảng trắng, hai dấu `;` liền, hay tổ hợp Unicode rời (NFD) — bên đọc phải chuẩn hoá NFC, bỏ vế rỗng, không phân biệt hoa thường. Ca: LG-AC5-ma-tran thêm các hàng này (Task 4).
3. Sổ kết không có dòng trống cuối, hay dùng CRLF — bên đọc vẫn đọc dòng cuối. Ca: GL-5.
4. `gh` không có trên máy hay PR không tồn tại — lệnh thoát 1 với thông điệp, không ném vết ngăn xếp. Ca: GL-6 hàng «gh lỗi».
5. Đầu nhánh đổi giữa lúc chờ CI — mỗi lượt hỏi lấy `headRefOid` mới và các vế đọc lại trên sha ấy; lệnh gộp mang đúng sha của lượt xanh. Ca: GL-8b kiểm sha trong lời gọi merge.

---

### Task 1: Khối luật, thân lệnh ký, mục S5 (giao diện chữ dùng chung)

**Files:**
- Modify: `plugins/acceptance-gate/skills/acceptance/references/human-facing-language.md` (sau khối `GATE-ONESHOT-LAN-V`)
- Modify: `plugins/acceptance-gate/commands/signoff.md` (danh sách nhãn câu gộp · bước 7a · bước 9)
- Modify: `plugins/feature-loop/skills/feature-loop/SKILL.md` (mục GATE 2 một câu · mục S5 hai khối)

**Interfaces — Produces (các task sau RÚT các khối này bằng marker, không chép tay):**

Khối `GATE-ONESHOT-GOP` (human-facing-language.md), đúng mười hai dòng:

```
gộp: khi CI xanh → gộp
gộp khi CI xanh → gộp
gộp: khi xanh → gộp
gộp khi xanh → gộp
gộp: chưa → chưa-gộp
chưa gộp → chưa-gộp
Ký → chữ-ký
Ký: <tên> → chữ-ký
Ký: <tên> <ngày> → chữ-ký
ký hay trả: Ký → chữ-ký
Trả lại: <lý do> → trả-lại
có-lời-gộp = có ít nhất một vế lối gộp · không có vế lối chưa-gộp · có một vế lối chữ-ký · không có vế lối trả-lại
```

Khối `LOI-GOP-GATE2-LINE` (signoff.md), một dòng:

```
"type":"revisit","stage":"gate2","at":"<ISO>","decision":"lời gộp trong câu ký: <gộp khi CI xanh | chưa gộp>","why":"Người gõ ở Cổng Bằng chứng; máy chép nguyên văn câu.","cost_if_wrong":"Chép lệch câu thì máy không gộp, hoặc gộp ngoài ý người ký; đảo bằng một commit hoàn lại trên nhánh chính.","decided_by":"<tên>","loi_gop":{"cau":"<trọn câu người gõ sau tên lệnh và tên hồ sơ, nguyên văn, một dòng>"}
```

Khối `GOP-THEO-LOI-KY` — signoff.md dùng `"<feature-loop>/scripts/resolve-plugin.mjs"`, SKILL dùng `"$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs"`, phần còn lại giống từng ký tự:

```
DP=$(node "<feature-loop>/scripts/resolve-plugin.mjs" --plugin dispatch --require scripts/dieu-phoi.mjs) && node "$DP/scripts/dieu-phoi.mjs" gop <số PR> --theo-loi --slug <slug> --cho-ci 30
```

Khối `GOP-THEO-LOI-THOAT` — hai nơi giống từng ký tự:

```
0 → đã gộp: báo một dòng (số PR, commit gộp); vòng đóng
4 → chưa gộp được lúc này (hết giờ chờ CI, hoặc nhánh chính đã tiến): gộp nhánh chính vào nhánh theo lệ của kho nếu lệnh bảo thế, rồi chạy lại MỘT lần; vẫn 4 → báo một dòng và dừng, việc gộp về tay người
1 → không gộp (thiếu một vế, CI đỏ, PR không mở): in nguyên dòng lý do; việc gộp về tay người như trước vòng
```

- [ ] **Step 1:** Thêm khối `GATE-ONESHOT-GOP` kèm đoạn dẫn (luật so vế: tách `;`, NFC, bỏ khoảng trắng đầu cuối, không phân biệt hoa thường; vế ký được mang tiền tố `ký hay trả:` và đuôi `, phút <số>`; dạng ngoài danh sách không phải lời gộp). KHÔNG thêm dòng `g2 gộp` vào `GATE-ONESHOT-SLOTS` ở task này (Task 2 thêm cùng thẻ thử, nếu không P192 đỏ).
- [ ] **Step 2:** signoff.md — một gạch đầu dòng dạy nhãn «gộp» (trỏ `GATE-ONESHOT-GOP`; kho bật: mọi câu có chữ ký ghi đúng một dòng theo `LOI-GOP-GATE2-LINE` ở bước 7a, cùng commit với chữ ký, kể cả «gộp: chưa» và vắng nhãn; kho không bật hay «Trả lại»: không ghi); khối `LOI-GOP-GATE2-LINE`; bước 7a một câu về dòng ấy và thêm `_acceptance/<slug>/decisions.jsonl` vào `git add` của bước 7c khi dòng được ghi; bước 9: câu dẫn + hai khối `GOP-THEO-LOI-KY`, `GOP-THEO-LOI-THOAT` (ngoài đợt; chạy nền; trong đợt luật đợt thắng; gói điều phối chưa cài → một dòng báo, việc gộp về tay người).
- [ ] **Step 3:** SKILL feature-loop — mục GATE 2: một câu «kho bật khoá thì dòng lệnh thẻ đã mang ô gộp; chép đúng như thẻ in»; mục S5, sau khối `S5-SHIP-DEFAULT` (không sửa bên trong khối ấy): hồ sơ `signed-off` có dòng lời gộp, vòng ngoài đợt → đẩy commit chữ ký rồi chạy khối `GOP-THEO-LOI-KY` ở chế độ nền, xử theo `GOP-THEO-LOI-THOAT`; kho tự host kit: `DP=plugins/dispatch`.
- [ ] **Step 4:** Chạy `bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:"` và `node tests/scripts/moi-cong-khong-qua-nut.test.mjs` — không ca nào mới đỏ (các ca đếm bản chép điều khoản phải nguyên).
- [ ] **Step 5:** Commit `feat: khối luật lời gộp, khuôn dòng sổ và khối gộp theo lời ký (loi-gop-trong-cau-ky)`.

### Task 2: Ô gộp trên thẻ + bộ ca thẻ (`independent: true`) — phục vụ E1, E2, E3, E4, E9

**Files:**
- Modify: `plugins/acceptance-gate/scripts/gate-card.js` (vùng dựng `oneParts` quanh hằng `NHAN_LAN_V`, và khối «VIỆC CỦA ANH»)
- Modify: `plugins/acceptance-gate/skills/acceptance/references/human-facing-language.md` (CHỈ thêm dòng `g2 gộp` vào `GATE-ONESHOT-SLOTS`, ngay trước `g2 ký hay trả`)
- Modify: `tests/plugins/fixtures/viec-cua-anh-scenarios.sh` (kịch bản mới `gate2-loi-gop` = `gate2-4loai` + khoá bật trong `config.yaml` của hồ sơ thử)
- Modify: `tests/plugins/run-tests.sh` (khối P192: dựng thêm `card-g2g.html` từ `gate2-loi-gop`, thêm vào MỌI lời gọi `check-rt.js`)
- Modify: `tests/scripts/nlvh-the.test.mjs` (danh sách thẻ của `kiemP192`: thêm `['gate2-loi-gop', '2', 'card-g2g.html']`)
- Create: `tests/scripts/lgck-the.test.mjs`

**Interfaces:**
- Consumes: khối `GATE-ONESHOT-GOP`, `LOI-GOP-GATE2-LINE` (Task 1). `evidenceCore.resolveConfigKey(text, key)` và `evidenceCore.chuKyThat(reportText).signed` (đã có, chỉ gọi).
- Produces: trong `gate-card.js` hai hằng `const NHAN_GOP = 'gộp';` và `const GIA_TRI_GOP = 'khi CI xanh';`; vị từ `GOP_THEO_LOI` = khoá đọc ra đúng chuỗi `true` ∧ `approvable` ∧ `!MAY_DI_TIEP` ∧ `!DA_KHEP` ∧ báo cáo chưa có chữ ký thật. Khi đúng: `oneParts.push(`${NHAN_GOP}: ${GIA_TRI_GOP}`)` NGAY TRƯỚC `ký hay trả: ___`, `routingBao.push(NHAN_GOP)`, và một mục việc-của-anh đứng trước mục «Ký hay trả»: `<b>Gộp — máy đã điền «khi CI xanh»</b> — làm gì: ký xong máy gộp PR khi mọi check xanh; ở đâu: trả lời trong phiên đang trình thẻ; trả lời dạng: sửa ô «gộp» trong dòng lệnh thành «chưa» nếu anh muốn ký mà chưa gộp.` Dòng «Trả lời mẫu» không đổi. JSON `--extract` không thêm khoá mới.
- Tệp ca: biến `LGCK_CASES` chọn ca; ca gọi tên mà không in PASS/FAIL → `FAIL: <tên> — ca không chạy: <tên>`, thoát 1; dòng kết `Results: N passed, M failed (lgck-the)`. Cấu trúc chép nếp của `tests/scripts/nlvh-the.test.mjs` (mỗi ca là hàm nhận đường `gate-card.js`, trả danh sách sai; `banSao()` + `tiem()` cho nhát; `kiemIm` cho phép so hai bản).

Ca phải có (tên đúng từng chữ — khoá chấm ở `_acceptance/config.yaml` gọi theo tên):
- `LG-AC1-bat`, `LG-AC3-khong-moi`, `LG-AC2-im`, `LG-AC4-luat`, `LG-AC4-p192` — nội dung theo trường `expected` của E1–E4 trong `evals.yaml` (đọc tệp ấy; mỗi câu của `expected` là một assert). LG-AC1-bat chạy thêm sáu cách viết khoá của Global Constraints (bật ⇔ hai cách đầu); thông điệp tiền đề chứa chuỗi «tien de».
- Nhát thẻ: `LG-dot-bien-in-khi-tat` · `LG-dot-bien-ve-o-hoi` · `LG-dot-bien-da-ky` · `LG-dot-bien-dien-chu-ky` · `LG-im-chu-thich` (E9); `LG-dot-bien-lech-khi-tat` · `LG-dot-bien-lech-qua-lib` (E2); `LG-dot-bien-luat-sai-loi` · `LG-dot-bien-luat-go-marker` · `LG-dot-bien-slots-go` (E4). Cụm ghim theo `expected`.
- `LG-AC2-im`: cặp commit = `git log --format=%H -F --grep='(loi-gop-trong-cau-ky)' -- plugins/acceptance-gate` (cuối danh sách là ĐẦU, đầu danh sách là CUỐI); TRƯỚC = `<đầu>^`, SAU = `<cuối>`; `git archive <sha> plugins/acceptance-gate` (trọn thư mục). Hồ sơ thật: chép `_acceptance/` của kho sang thư mục tạm (bỏ `card.html`), gỡ dòng khoá khỏi bản sao `config.yaml`, dựng thẻ mọi hồ sơ có `contract.md` bằng hai bản, so từng byte (HTML + extract), chạy song song 8 luồng. Vế «bản SAU bằng cây đang kiểm»: khi `status` của `_acceptance/loi-gop-trong-cau-ky/contract.md` trong cây KHÔNG thuộc `signed-off | machine-cleared | da-cham-boi-thuc-te` (dựng chuỗi bằng join) thì `git diff --quiet <SAU> -- plugins/acceptance-gate` phải thoát 0, không thì đỏ «ban SAU khac cay dang kiem».

- [ ] **Step 1:** Viết `lgck-the.test.mjs` với năm ca chính + kịch bản `gate2-loi-gop`. Chạy `LGCK_CASES=LG-AC1-bat,LG-AC3-khong-moi node tests/scripts/lgck-the.test.mjs` → ĐỎ («routing.bao thieu «gộp»»). Commit ca đỏ: `test: ca thẻ cho ô gộp, đỏ trước khi có vật (loi-gop-trong-cau-ky)`.
- [ ] **Step 2:** Sửa `gate-card.js` theo Interfaces. `DA_KHEP` hiện tính SAU chỗ dựng `oneParts` — dời phép tính `daKhepTu(scanHit)` lên trước, không đổi nghĩa. Thêm `g2 gộp` vào SLOTS, sửa P192 và danh sách thẻ của nlvh.
- [ ] **Step 3:** Chạy `LGCK_CASES=LG-AC1-bat,LG-AC3-khong-moi,LG-AC4-luat,LG-AC4-p192 node tests/scripts/lgck-the.test.mjs` → xanh. Commit vật: `feat: ô gộp điền sẵn trên thẻ Cổng Bằng chứng của kho bật (loi-gop-trong-cau-ky)`.
- [ ] **Step 4:** Thêm các ca nhát tiêm và `LG-AC2-im`. Chạy từng nhóm của bốn khoá `lgck_the`, `lgck_im`, `lgck_luat` trong `_acceptance/config.yaml` (trừ các ca `LG-AC5-*`, `LG-dot-bien-o-the-lech`, `LG-dot-bien-khuon-lech` — Task 4) → xanh.
- [ ] **Step 5:** Hồi quy: `NLVH_CASES=NL-AC5-luat,NL-AC5-p192 node tests/scripts/nlvh-the.test.mjs`; `node tests/scripts/hskt.test.mjs`; `node tests/scripts/gate-card-lmcms.test.mjs`; `node tests/scripts/moi-cong-khong-qua-nut.test.mjs`; `bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:"` → không đỏ mới. Commit: `test: nhát tiêm và phép so kho không bật cho ô gộp (loi-gop-trong-cau-ky)`.

### Task 3: Bên đọc và lối vào `--theo-loi` của lệnh gộp (`independent: true`) — phục vụ E6, E7, E8, E10

**Files:**
- Modify: `plugins/dispatch/scripts/gop.mjs`
- Modify: `plugins/dispatch/scripts/dieu-phoi.mjs` (nhánh lệnh `gop`: cờ `--theo-loi`, `--cho-ci <phút>`; dòng hướng dẫn dùng)
- Create: `tests/dieu-phoi/loi/gop-theo-loi.test.mjs` (`node:test`, tên ca mở đầu `GL-`)
- Create: `tests/dieu-phoi/loi-gop-mutants.test.mjs` (tên ca mở đầu `LGM-`; nếp của `tests/dieu-phoi/ky-den-gop-mutants.test.mjs`)

**Interfaces:**
- Consumes: khối `GATE-ONESHOT-GOP`, `LOI-GOP-GATE2-LINE`, `GOP-THEO-LOI-KY`, `GOP-THEO-LOI-THOAT` (Task 1) — ca RÚT bằng marker từ tệp thật, suy đường từ vị trí tệp ca. `xetGop`, `ciXanh`, `maThoatGop`, `GOP_DUOC` (đã có, không đổi hành vi).
- Produces (export của `gop.mjs`):
  - `DANG_LOI_GOP: { gop: string[], chua: string[] }` — chữ thường, đúng sáu dạng của khối luật.
  - `docCau(cau: string): { co_loi_gop: boolean, ly_do: string | null }` — chuẩn hoá NFC, tách `;`, bỏ vế rỗng, không phân biệt hoa thường. Vế ký: bỏ tiền tố `ký hay trả:` nếu có, rồi khớp `^ký(\s*:.*)?(\s*,\s*phút\s*\d+)?$`; vế trả lại: sau khi bỏ tiền tố, mở đầu `trả lại`. `ly_do` khi không: `câu ghi là trả lại` · `câu ghi không mang chữ ký` · `câu ghi không mang lời gộp` (cả ca có vế chưa-gộp).
  - `docLoiGop(soText: string): { co: boolean, ly_do: string, id: string | null, cau: string | null }` — dòng CUỐI có `stage === 'gate2'` và khoá `loi_gop`; dòng JSON hỏng bỏ qua; không có → `không có dòng lời gộp trong sổ`; dòng cuối thiếu `loi_gop.cau` dạng chuỗi → `dòng lời gộp cuối không mang câu` (KHÔNG lùi).
  - `xetLoiKy({ io, sha, slug }): { duoc: boolean, ly_do: string }` — mọi thứ đọc bằng `io.chay('git', ['show', `${sha}:<đường>`])`. Thứ tự và thông điệp: (1) `kho chưa bật feature_loop.gop_theo_loi_ky trên đầu nhánh`; (2) `hồ sơ <slug> trên đầu PR ở «<trạng thái>» — lời gộp chỉ có ở hồ sơ đã ký`; (3) `báo cáo bằng chứng trên đầu PR không có chữ ký người`; (4)(5) `ly_do` của `docLoiGop` / `docCau`; (6) `dòng lời gộp không sinh cùng commit với chữ ký hiện hành`. Vế 6: `git log -1 --format=%H -S<mã dòng> <sha> -- _acceptance/<slug>/decisions.jsonl` so với `git log -1 --format=%H -S"human_signoff: <giá trị>" <sha> -- _acceptance/<slug>/evidence-report.md`.
  - `gop(cwd, pr, { slug, xet, io, theoLoi = false, choCi = 0, ngu })` — `theoLoi` đúng: không đòi đợt, khoá merge, `tu_merge`; bắt buộc `slug`; không ghi sự kiện đợt. Vòng chờ: mỗi lượt `xetGop({ io, cfg: {}, pr, slug })`; `cho-ci` mà có check đỏ hẳn → `{ duong: 'chan', ly_do: 'CI đỏ trên đầu nhánh — <tên check>' }` ngay; `cho-ci` còn chạy và còn giờ → `ngu(nhịp)` rồi hỏi lại; hết `choCi` phút → `{ duong: 'cho-ci', ly_do: 'hết <n> phút chờ CI — …' }`. Lối gộp được → `xetLoiKy` trên `kq.sha`; không được → `chan`; được và không `xet` → đúng một lời gọi `gh pr merge <pr> --merge --match-head-commit <sha>`. `theoLoi` sai: hành vi cũ từng dòng. Nhịp mặc định 30 000 ms, đổi bằng biến môi trường `DIEU_PHOI_NHIP_CHO_MS`.
  - `ciDo(rollup): string[]` — tên check đỏ hẳn (`CheckRun` xong mà kết luận không thuộc xanh; `StatusContext` ở `FAILURE`/`ERROR`).
  - CLI: `dieu-phoi.mjs gop <số PR> --theo-loi --slug <slug> [--cho-ci <phút>] [--xet]`; mã thoát qua `maThoatGop` (0 · 4 · 1); lỗi ném → thoát 1 một dòng `dieu-phoi: …`.

Ca phải có (đọc trường `expected` của E6, E7, E8, E10 — mỗi câu là một assert; tên ca theo đó): `GL-5…` (bên đọc: mỗi dòng của khối luật qua `docCau`; ma trận sổ; NFD, HOA, CRLF, không dòng trống cuối), `GL-6…` (kho git thật + `gh` giả; ma trận sáu vế; ký hai lần; chấm lại rồi ký lại; `--xet`; cây làm việc lệch đầu nhánh; `gh` lỗi), `GL-7`, `GL-8a`…`GL-8d`, và `LGM-M0` + mười bốn nhát + ba nhát không phải vật. Kho thử: dựng như hàm `kho()` của `tests/dieu-phoi/loi/gop.test.mjs`, thêm `_acceptance/s/evidence-report.md` (có dòng `human_signoff: <tên> <ngày>`), `_acceptance/s/decisions.jsonl` (dòng điền từ khuôn rút ở signoff.md), `_acceptance/config.yaml`; chữ ký và dòng lời gộp trong CÙNG một commit. GL-8b…d chạy dòng lệnh rút từ SKILL bằng `bash -c` với `HOME` giả chứa `.claude/plugins/cache/delivery-loop/dispatch/9.9.9/` (chép `plugins/dispatch` của cây đang kiểm), `WORKFLOWS_DIR` trỏ `plugins/feature-loop/workflows` của cây, `gh` giả (tệp thực thi đứng đầu `PATH`, ghi mỗi lời gọi vào một tệp sổ, trả trạng thái theo số lượt), `DIEU_PHOI_NHIP_CHO_MS=50`.

- [ ] **Step 1:** Viết `gop-theo-loi.test.mjs` (GL-5, GL-6, GL-7). Chạy `node --test tests/dieu-phoi/loi/gop-theo-loi.test.mjs` → ĐỎ (export chưa có). Commit ca đỏ: `test: ca lời gộp cho lệnh gộp, đỏ trước khi có vật`.
- [ ] **Step 2:** Viết `docCau`, `docLoiGop`, `xetLoiKy`, lối `theoLoi` của `gop`, cờ CLI. Chạy lại → xanh. Chạy `node --test tests/dieu-phoi/loi/gop.test.mjs tests/dieu-phoi/ky-den-gop-mutants.test.mjs` → xanh nguyên. Commit: `feat: lệnh gộp nhận lối vào theo lời ký, đọc lại câu trên đầu nhánh`.
- [ ] **Step 3:** Thêm vòng chờ `--cho-ci`, `ciDo`, ca GL-8a…d. Chạy → xanh. Commit: `feat: lệnh gộp theo lời tự chờ CI`.
- [ ] **Step 4:** Viết `loi-gop-mutants.test.mjs`. Chạy hai khoá `dieu_phoi_loi_gop`, `dieu_phoi_loi_gop_mutants` của `_acceptance/config.yaml` (chép nguyên lệnh) → mọi dòng ghim có mặt, không `not ok`. Chạy `node --test tests/dieu-phoi/` → không đỏ mới. Commit: `test: nhát tiêm cho lệnh gộp theo lời`.

### Task 4: Vòng khép thẻ → dòng sổ → bên đọc (sau khi gộp Task 2 và 3) — phục vụ E5

**Files:**
- Modify: `tests/scripts/lgck-the.test.mjs`

**Interfaces — Consumes:** `docLoiGop`, `docCau` (Task 3, nạp bằng `import()` từ `plugins/dispatch/scripts/gop.mjs` theo đường suy từ tệp ca); thẻ `gate2-loi-gop` (Task 2); hai khối luật (Task 1).

- [ ] **Step 1:** Thêm `LG-AC5-vong-khep`, `LG-AC5-dang`, `LG-AC5-ma-tran`, `LG-dot-bien-o-the-lech`, `LG-dot-bien-khuon-lech` theo `expected` của E5; ma trận thêm các hàng của Review Focus mục 2. Câu thử lấy TRỌN `one_shot` của thẻ, bỏ `/acceptance-gate:signoff <slug> `, thay `___` bằng từng dạng vế ký rút từ khối (điền `<tên>` = `Manh Phan`, `<ngày>` = `2026-11-21`, `<lý do>` = `chưa đạt`).
- [ ] **Step 2:** Chạy nguyên lệnh của khoá `lgck_vong_khep` → xanh. Commit: `test: vòng khép thẻ, dòng sổ và bên đọc lời gộp (loi-gop-trong-cau-ky)`.

### Task 5: Kho kit tự bật, ADR, từ điển, tài liệu gói

**Files:**
- Modify: `_acceptance/config.yaml` (`feature_loop.gop_theo_loi_ky: true` kèm chú thích)
- Create: `docs/adr/0029-may-gop-theo-loi-gop-trong-cau-ky.md` (một đoạn văn: khó đảo · gây bất ngờ · đánh đổi)
- Modify: `CONTEXT.md` (mục «Lời gộp», nhóm «Gates & verbs»)
- Modify: `plugins/dispatch/README.md` (một dòng về `gop --theo-loi`), `GUIDE.md` (khoá mới, cạnh các khoá `feature_loop.*` khác)

- [ ] **Step 1:** Viết năm tệp. Chạy `node plugins/acceptance-gate/scripts/product-map.mjs --root . --check`, `bash tests/hooks/run-tests.sh`, và các ca quét thuật ngữ nếu có (`grep -rn "CONTEXT.md" tests/scripts/*.mjs | head`) → không đỏ mới.
- [ ] **Step 2:** Dựng thử thẻ Cổng Bằng chứng trên một hồ sơ thử của kho kit để thấy ô gộp. Commit: `feat: kho kit tự bật lời gộp trong câu ký; ADR 0029 và mục từ điển`.
