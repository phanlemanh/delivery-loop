> [English](../README.md) · **Tiếng Việt** — bản dịch của [README.md](../README.md).

# Delivery Loop

> Tên cũ: **Acceptance-Gate Kit** (kho `acceptance-gate-kit`, đóng băng ở `v2.39.0`). Từ 3.0.0 kit sống ở kho này; chuyển một kho khỏi chợ cũ: xem [GUIDE §5.4](../GUIDE.md#54-chuyển-từ-chợ-cũ-acceptance-gate-kit).

Cổng nghiệm thu dựa trên bằng chứng cho tính năng do AI viết. Thay hàng giờ thử
tay bằng bằng chứng máy, và đặt người ở biên của vòng — ở vài khoảnh khắc chỉ
người quyết được — thay vì ở giữa vòng.

## Bốn cổng người

Bảng bốn cổng và ngân sách lượt gọi người sống ở một chỗ, viết sẵn bằng tiếng
Việt: [GUIDE §0 «Bốn cổng người»](../GUIDE.md#bốn-cổng-người--nguồn-chuẩn-của-mô-hình-cổng).
README tiếng Anh mang một **bản chép** của bảng ấy; ca kiểm **P86** trong CI đỏ
khi một bản chép lệch, và gọi tên bản lệch. Bản dịch này trỏ về nguồn thay vì
chép thêm một bản. Đổi mô hình ở nguồn rồi đồng bộ — đừng sửa lẻ một bản chép.

**Không phải vòng nào cũng dừng đủ bốn lần.** Vòng T2 đủ điều kiện đi tiếp thì
máy tự chốt phạm vi và tự thông bằng chứng, báo một dòng, và **để cửa veto mở**
— bạn phủ quyết lúc nào cũng được. Đó là làn V.

## Cách hoạt động

```
đầu vào (prompt/ticket/PRD)
  → Phase 1 NORMALIZE  → contract.md          ┐
  → Phase 2 EVAL-GEN   → evals.yaml           ├─ Cổng Phạm vi: người duyệt, hoặc
  → cài đặt (agent code như bình thường)      │  máy chốt, cửa veto mở
  → Phase 3 VERIFY     → evidence-report.md   ├─ Cổng Bằng chứng: người ký, hoặc
       subagent context sạch chạy mọi eval    ┘  làn V (T2 xanh-sạch)
```

Trong feature-loop đầy đủ, S1 còn kết thúc bằng một lượt **gap-probe context
sạch** (T2/T3): một subagent mới, chưa nhúng tay vào artifact nào, truy bản nháp
design/contract/evals xem còn *thiếu* gì — tối đa 5 finding, mỗi finding phải
kèm một kịch bản hỏng cụ thể và một cách xử lý (sửa trên giấy / để sau / bác /
đẩy lên người) — trước khi thẻ Cổng Phạm vi (Gate 1, «Cổng 1») hiện ra. Thẻ in khối
finding, hoặc một cờ vàng khi lượt gap-probe chưa chạy (không chặn, khoan dung
với hồ sơ cũ).

Cưỡng chế là tất định, không phải lời hứa:
- **Hook** (`acceptance-evidence-gate.js`): chặn mọi verdict PASS được ghi mà
  thiếu bằng chứng máy (run_id — đối chiếu với `run-log.jsonl` do máy ghi khi
  tệp ấy có, exit_code 0, verifier thật, verified_at, `verified_commit` là SHA
  thật khi có khai) hoặc còn judgment UNCERTAIN chưa xử — và chặn các bước đổi
  `status` của contract nhảy qua Cổng 1 (approved/signed-off, hoặc draft →
  implemented/verified, với `approved_by` rỗng và không có `gate1_skipped: true`).
- **CI** (`pre-merge-check.sh`, trong kit ở `plugins/acceptance-gate/scripts/`):
  chặn merge tính năng T2/T3 đã implemented mà thiếu evidence report PASS có chữ
  ký, thiếu lượt duyệt Cổng 1 đã ghi, mang bằng chứng HẾT HẠN (tệp ngoài cổng
  đổi sau `verified_commit` của báo cáo), hoặc — qua lượt re-check bằng chứng
  đã commit — mang run_id chưa từng được máy ghi vào `run-log.jsonl`. Chữ ký
  Cổng Bằng chứng (Gate 2, «Cổng 2») là một QUYẾT ĐỊNH người phát ngôn và máy ghi lại
  (trách nhiệm đọc ở forge — ai approve / merge PR); lưới in một dòng gọi tên
  chữ ký lần đầu xuất hiện trong diff của PR.

> **Thành viên mới: đọc [QUICKSTART.md](../QUICKSTART.md) (tiếng Việt, 5 phút) — cài 2 lệnh là dùng được.**
> **Bản đầy đủ — kiến trúc, cài đặt, vận hành, tra cứu enforcement: [GUIDE.md](../GUIDE.md).**

## Cài đặt

Lệnh cài và lệnh cập nhật nằm ở **một chỗ duy nhất** —
[GUIDE §5.1](../GUIDE.md#51-mỗi-máy-dev-một-lần) — gồm máy đầu tiên của một
repo, các máy sau, và trọn bộ plugin (`acceptance-gate`, `feature-loop`,
`diagram-design`, `superpowers` — đều bắt buộc). `/acceptance-gate:acceptance-init` ghi
`.claude/settings.json`, nên đội viên mở repo là có đúng bộ ấy. README này cố ý
không mang lệnh nào của riêng nó: bản sao thứ hai là bản sao sẽ trôi.

Mở một **phiên mới** sau khi cài hoặc nâng bản để runtime nhận skill và hook
mới. CI vẫn là lớp có thẩm quyền khi hook lúc-ghi không được tin hoặc bị tắt.

Giữ bản mới — hai dev chạy hai phiên bản kit trên cùng một repo là hai bộ luật
cổng khác nhau. Lệnh cập nhật nằm ở
[GUIDE §5.1](../GUIDE.md#51-mỗi-máy-dev-một-lần), cạnh phần còn lại của thủ tục;
tệp này không chép lại.

> **Ghi chú về cưỡng chế.** Hành vi của hook lúc-ghi phụ thuộc runtime agent
> đang chạy và việc hook có được tin hay không, nên đừng coi nó là lớp chắn duy
> nhất. Lưới sau cùng có thẩm quyền vẫn là bộ CI vendored:
> `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`, và năm tệp
> `lib/*.cjs` (`evidence-core`, `gap-probe`, `workspace-record`,
> `ac-line`, `md-section`) — trong kit chúng nằm dưới
> `plugins/acceptance-gate/`.

Phát triển tại máy: thay `phanlemanh/delivery-loop` bằng đường dẫn tuyệt đối
tới bản checkout này. Tệp nguồn được dùng trực tiếp — không có bản đóng gói nào
phải dựng lại.

> **feature-loop** chạy kỷ luật cổng từ đầu đến cuối: brainstorm →
> contract+evals (Cổng 1) → plan → execute → verify → evidence + signoff
> (Cổng 2).

Cài plugin là đăng ký skill, các slash command và hook PreToolUse; CI vẫn là
lớp cưỡng chế không phụ thuộc runtime.

Chế độ pilot (vừa dùng vừa sửa kit) — symlink ĐỦ CẢ BA phần vào repo tiêu thụ;
riêng skill là chưa đủ (command và hook nằm ngoài `skills/`):

```bash
cd <consumer-repo>
# <kit> = một bản checkout của kit; từ 3.0 plugin lõi nằm ở <kit>/plugins/acceptance-gate
ln -s <kit>/plugins/acceptance-gate/skills/acceptance .claude/skills/acceptance
mkdir -p .claude/commands
ln -s <kit>/plugins/acceptance-gate/commands/acceptance-init.md   .claude/commands/acceptance-init.md
ln -s <kit>/plugins/acceptance-gate/commands/acceptance-status.md .claude/commands/acceptance-status.md
ln -s <kit>/plugins/acceptance-gate/commands/acceptance-card.md   .claude/commands/acceptance-card.md
ln -s <kit>/plugins/acceptance-gate/commands/approve.md           .claude/commands/approve.md
ln -s <kit>/plugins/acceptance-gate/commands/signoff.md           .claude/commands/signoff.md
ln -s <kit>/plugins/acceptance-gate/commands/observed.md          .claude/commands/observed.md
ln -s <kit>/plugins/acceptance-gate/commands/acceptance-report.md .claude/commands/acceptance-report.md
ln -s <kit>/plugins/acceptance-gate/commands/start.md             .claude/commands/start.md
# hook: đăng ký trong .claude/settings.local.json (riêng của máy, không commit)
#   PreToolUse Write|Edit -> node "<kit>/plugins/acceptance-gate/hooks/acceptance-evidence-gate.js"
```

Sau đó khởi động lại phiên Claude Code — skill/command/hook được nhận lúc mở
phiên. Đừng commit các symlink và settings.local.json (đường dẫn tuyệt đối của
máy).

## Thiết lập cho mỗi repo (một lần)

Chạy `/acceptance-gate:acceptance-init`; lệnh ghi tệp `_acceptance/config.yaml`.

[GUIDE §5.3](../GUIDE.md#53-wire-ci-bắt-buộc-để-gate-có-răng-ở-pr) là nguồn cho
việc nối CI; đường mặc định của nó chạy cổng từ một bản checkout kit ghim trong
job CI (`CLAUDE_PLUGIN_ROOT` = `<kit>/plugins/acceptance-gate`) và không chép
tệp nào. Đường chép cũ dưới đây vẫn chạy.

Chép `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`, và năm tệp
`lib/*.cjs` (`evidence-core`, `gap-probe`, `workspace-record`, `ac-line`,
`md-section`) từ plugin lõi của kit (`plugins/acceptance-gate/`) vào repo (giữ
bố cục `scripts/` + `lib/` để lượt re-check `require ../lib` được; đuôi `.cjs`
giữ chúng là CommonJS kể cả khi repo khai `"type": "module"`), rồi chạy cổng
trong CI:

```yaml
# ví dụ: các bước của một job GitHub Actions — cùng dạng hai bước với GUIDE §5.3
- uses: actions/checkout@v4
  with: { fetch-depth: 0 }   # trọn lịch sử: phép kiểm verified_commit + chữ ký cần nó
- run: bash scripts/pre-merge-check.sh . --base "origin/$GITHUB_BASE_REF"
```

Luôn truyền `--base` (base của PR): nó bật lưới chống né T1 (T1-escape) và cho
luật gap-probe phạm vi diff — thiếu nó cả hai luật chạy `declared-off` (chỉ
NOTE, không chặn merge). `fetch-depth: 0` thuộc cùng dạng ấy: với bản checkout
nông mặc định, ref base không resolve được và cổng thoát 2. Job chạy trên
`push` (không phải PR) cần thêm `--no-t1-escape` — xem GUIDE §5.3 cho biến thể
đó và sổ luật-đã-chạy.

`pre-merge-check.sh` tìm `recheck-evidence.cjs` ngay cạnh nó; nếu tệp ấy (hoặc
`node`) vắng thì lưới trước-merge vẫn chạy, chỉ thiếu lượt re-check bằng chứng
đã commit. `/acceptance-gate:acceptance-init` sinh sẵn `recheck: strict` — mức
đúng cho một repo mới. Khi khoá vắng, mã rơi về `warn` (chỉ NOTE); lối rơi ấy
có để repo ĐƯA kit vào dùng với các báo cáo đời cũ không bị chặn — đừng bắt đầu
một repo mới ở mức đó, và chuyển sang `strict` khi các báo cáo đã commit đạt
khuôn bằng chứng hiện hành.

## Dùng hằng ngày

- `/acceptance-gate:start` → mở phiên (vào phiên bằng một lệnh, không cần câu mở đầu tự do):
  máy quét xưởng, trình thẻ ba nhóm — chờ ký · đang dở · việc mới — bạn chọn
  một chữ cái là vào đúng nghi thức; lệnh chỉ định hướng + bàn giao, không tự
  làm nội dung (người gõ; khoá model-invocation trên cả hai harness).
- Tính năng mới → gọi skill `acceptance` → contract + evals → duyệt
  (Cổng 1) → cài đặt → verify → ký (Cổng 2).
- `PRODUCT-MAP.md` (gốc repo) → một trang trả lời «mọi việc đang nằm ở đâu?»:
  sơ đồ các chặng kèm số đếm thật, rồi từng việc dưới chặng nó đang nằm. Máy
  sinh từ hồ sơ của xưởng — `/acceptance-gate:approve`,
  `/acceptance-gate:signoff` và phiên nghiệm thu vẽ lại nó và đưa nó vào commit
  chữ ký. Đừng sửa tay; sửa hồ sơ. `acceptance-init` đặt nó vào
  `risk_tiers.t1_skip_globs` (một view máy sinh lại không nên cần người ký) và
  CI chạy `product-map.mjs --root . --check` để bắt bản đồ trôi hoặc bị xoá —
  xem [ADR 0007](adr/0007-product-map-t1-exemption.md). Repo khởi tạo trước
  1.31.0 vẫn chạy: thân các lệnh cổng đọc cấu hình, bỏ bước vẽ lại, và in cách
  bật.
- Phiên nghiệm thu / **Cổng Giá trị** (`plugins/acceptance-gate/skills/uat-session`) → cổng người
  SAU khi ship, cho việc sinh từ một cơ hội đã quyết `build` hoặc `iterate`.
  Cổng 2 hỏi «đã làm đúng thứ đã hứa chưa?»; cổng này hỏi
  «thứ đó có ăn thua không?». Ngưỡng chép nguyên văn từ lúc mở vòng và KHÔNG
  được đổi khi số đã lên bàn; chấm kín, thu trước mọi thảo luận nhóm; người —
  không bao giờ là agent — ghi `verdict: release | iterate | kill`. `kill` là
  một THÀNH CÔNG của quy trình. Kết quả nằm ở `_acceptance/<slug>/uat-session.md`.
- `/acceptance-gate:acceptance-status` → bảng trạng thái cổng của mọi tính năng.
- `/acceptance-gate:acceptance-card <slug>` → dựng THẺ QUYẾT ĐỊNH bằng lời thường cho cổng:
  Cổng 1 dạng «sẽ làm / sẽ KHÔNG làm» + cờ coverage, hoặc Cổng 2 dạng «phần bạn
  quyết / phần máy đã lo» + mức đảo được. Chỉ là lớp trình bày — contract,
  evidence, verdict và hook vẫn là nguồn sự thật; thẻ không quyết gì.
- Ở Cổng 2, `/acceptance-gate:acceptance-card` còn sinh một **trang bằng chứng** đầy đủ
  (`evidence-page.html`) và tự mở nó — ảnh chụp thật (eval ui-check nhiều
  khung hình chạy thành slideshow CSS), output thật, lập luận của judge, trạng
  thái override, finding của review, checklist Cổng 2. Thẻ chỉ mang liên kết;
  bạn NHÌN THẤY artifact trên trang. Tự chứa, mở được bằng `file://`, không phụ
  thuộc gì.
- `/acceptance-gate:approve <slug>` → ghi quyết định Cổng 1: thẻ → một câu hỏi → máy
  ghi `approved_by`/`approved_at` khi bạn nói YES tường minh. `/acceptance-gate:signoff <slug>` →
  đi qua Cổng 2: tiền điều kiện → `human_override`/`human_signoff` → ghi và
  commit một lượt → lưới trước-merge kiểm lại. Các động từ quyết định không bao
  giờ tự quyết.
- `/acceptance-gate:acceptance-report` → cổng có khoẻ không? Cơ cấu verdict, số vòng verify,
  vệ sinh cổng (bỏ cổng / bypass / bằng chứng hết hạn). Chỉ đọc.
- Risk tier: T1 không qua kit; T3 đòi người trực tiếp phán mọi mục judgment.
  Tier và glob khai theo từng repo trong `_acceptance/config.yaml`.
- Bề mặt kiểm hiện tại (8 suite, đều chạy trên fixture): ca hook
  (`tests/hooks/run-tests.sh`) + ca script
  (`tests/scripts/run-tests.sh`: lưới trước-merge + xuất xứ + re-check bằng
  chứng, lint độ phủ eval, gate-card, evidence-page) + kiểm đóng gói
  (`tests/plugins/run-tests.sh`: khớp phiên bản, đồ thị import của engine
  vendored, giải đường `${CLAUDE_PLUGIN_ROOT}`) + suite thước đo bố cục
  (`tests/skills/run-tests.sh`: hình học analyze() + fixture kiểm trên trình
  duyệt) + các suite design-eval và workflow + suite sàn thiết kế
  (`tests/design-floor/run-tests.sh`) + suite lõi điều phối
  (`node --test "tests/dieu-phoi/**/*.test.mjs"`). CI chạy tất cả trừ `skills`.

## Bố cục

| Đường | Là gì |
|---|---|
| `.claude-plugin/marketplace.json` | Tệp khai chợ Claude Code — chợ `delivery-loop`, sáu plugin |
| `plugins/<tên>/` | Mỗi plugin một thư mục: `acceptance-gate` (lõi), `feature-loop`, `diagram-design`, `dispatch`, `roadmap`, `knowledge`. Mọi đường dưới đây nằm trong `plugins/acceptance-gate/`, trừ đường bắt đầu từ gốc repo |
| `skills/acceptance/` | Skill 3 phase + các khuôn |
| `skills/ux-ui-craft/` | Skill design-engineer: quy trình UI 7 bước, cổng cứng (contrast, ngân sách chữ/căn hàng, khớp cấu trúc–khoảng trống, các trạng thái), Layout Contract + thước đo bố cục (`measure_layout.js`), các chế độ System+Prototype+Audit, 10 tài liệu tham chiếu về nghề |
| `skills/morphological-scan/` | Skill coverage CT-S: quét không gian AC kiểu hộp Zwicky (trục MECE + bằng chứng CE + Pareto Core/Later/Never), cấp dữ liệu cho mục Coverage của contract trên thẻ Cổng 1 |
| `hooks/` | Hook bằng chứng PreToolUse (lúc ghi) |
| `lib/evidence-core.cjs` | Phép kiểm bằng chứng L1/L2/L3 dùng chung (hook + re-check của CI) |
| `commands/` | `/acceptance-gate:acceptance-init`, `/acceptance-gate:acceptance-status`, `/acceptance-gate:acceptance-card`, `/acceptance-gate:approve`, `/acceptance-gate:signoff`, `/acceptance-gate:acceptance-report` |
| `scripts/pre-merge-check.sh` | Cổng CI (chép vào repo tiêu thụ) |
| `scripts/recheck-evidence.cjs` | CI kiểm lại bằng chứng của một báo cáo đã commit |
| `scripts/gate-card.js` | Dựng thẻ quyết định cho người ở Cổng 1 / Cổng 2 |
| `scripts/config-patch.mjs` | Đường ghép DUY NHẤT cho mọi lần ghi config.yaml bằng chương trình (dry-run, .bak, dừng khi khoá đã có) |
| `scripts/evidence-page.js` | Dựng trang bằng chứng đầy đủ của Cổng 2 (ảnh chụp/output/slideshow) |
| `tests/` (gốc repo) | Ca kiểm trên fixture: `for t in hooks scripts plugins design-eval workflows skills; do bash tests/$t/run-tests.sh; done` |

## Kit chạy cổng của chính nó (self-hosting)

`_acceptance/config.yaml` ở repo này cấu hình kit làm **consumer của chính nó**.
Ba điểm khác một repo tiêu thụ bình thường, mỗi điểm là một bài học dogfood:

- **Executor trỏ vào mã trong repo (`tests/`, `plugins/acceptance-gate/scripts/`), không qua `${CLAUDE_PLUGIN_ROOT}`.**
  Kit LÀ nguồn của plugin, nên cổng phải chấm bằng mã đang sửa chứ không bằng
  bản trong plugin cache — cache thường tụt version (đo được: cache 1.18.0 khi
  repo đã 1.21.0). feature-loop S4 resolve bằng
  `node plugins/feature-loop/scripts/resolve-plugin.mjs --plugin acceptance-gate --root .`
- **`*.md` KHÔNG nằm trong `t1_skip_globs`.** Mặc định sinh sẵn coi mọi markdown
  là tài liệu; ở đây mọi `SKILL.md` và mọi file trong `plugins/<tên>/commands/` LÀ hành vi thật. Chỉ docs được
  liệt đích danh mới bỏ qua cổng — nếu không, sửa hành vi của cổng lại lọt cổng.
- **`t3_paths` là lõi cưỡng chế** (dưới `plugins/acceptance-gate/`: `hooks/`, `lib/`,
  `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`): bug ở đây thành false-green im lặng trên MỌI repo dùng kit.

CI ở [`.github/workflows/gate.yml`](../.github/workflows/gate.yml): 7 test suite (scripts ·
hooks · plugins · workflows · dieu-phoi, và hai việc riêng design-floor · design-eval) +
`product-map.mjs --check` + `pre-merge-check.sh` + **răng T1-escape (ĐANG BẬT)** — mọi PR chạm `t3_paths`
bắt buộc kèm thay đổi dưới `_acceptance/`. Hai điều chỉnh riêng cho repo kit:

- Răng T1-escape chỉ cưỡng chế trên `pull_request`. Ở `push`, job truyền
  `--no-t1-escape` và in marker `T1-ESCAPE: NOT ENFORCED` — KHÔNG phải vì push
  thiếu base (push CÓ base, để luật gap-probe chạy được), mà vì tiền đề "phải
  kèm hồ sơ nghiệm thu" sai với commit đóng gói bản phát hành / đồng bộ bản sao.
  Xem [ADR 0005](adr/0005-t1-escape-opt-out-flag.md).
- Từ acceptance-gate 1.22.0, base ĐÃ KHAI mà không resolve được là
  `VIOLATION [scope]` + exit 2 ở MỌI repo (fail-closed, không còn *skip +
  clean*). Nhánh *skip* chỉ còn cho trường hợp không truyền base hoặc không có
  merge-base (clone nông/grafted) — và ở repo kit, CI nâng cả skip đó thành
  **lỗi** vì một backstop bị bỏ qua âm thầm CHÍNH LÀ lỗ nó sinh ra để bịt.
  Test P35 giữ cả ba tính chất (bật · guard PR · fail-loud) khỏi bị gỡ về sau.

Giới hạn cần biết: backstop **không có ánh xạ path→slug** (comment trong
`pre-merge-check.sh` nói rõ) — "có kèm artifact" nghĩa là *bất kỳ* thay đổi nào
dưới `_acceptance/`. Nó chặn việc quên cổng hoàn toàn, không chặn được một
contract cẩu thả; chất lượng contract là việc của Gate 1 và các check per-slug.

## Số đo giai đoạn pilot

Kit **không** đo phút người. Con số ấy do người tự khai ở cổng để qua cổng, nên
nó vừa tốn một lượt gọi người vừa sinh dữ liệu bịa; mẫu số để chia nó được cố ý
để trống, nên ngưỡng «giảm ≥50% thời gian người» chưa bao giờ tính
được. Thứ các cổng thật sự ghi — cơ cấu verdict, số vòng verify, và vệ sinh
cổng (cổng bị bỏ, bypass chưa được xác nhận, bằng chứng hết hạn) — là thứ
`/acceptance-gate:acceptance-report` in ra.
Ngưỡng thành công của pilot: không lỗi logic nghiệp vụ nào lọt qua cổng, và việc
nghiệm thu *làm được* chứ không phải *nhanh hơn* — trước khi có kit nó phần lớn
không xảy ra.

## Giới hạn đã biết

Các chỗ cắt phạm vi có chủ đích — mỗi chỗ được lưới trước-merge + các cổng
người phía sau đỡ, và được xem lại ở mỗi bản phát hành:

- **`gap_probe` mặc định là `advisory`**: nguyên bản (khoá vắng), một PR mà slug
  thiếu `gap-probe.md` vẫn merge với một dòng NOTE, không bị chặn. Lưới ở ranh
  giới merge nay ĐÃ CÓ (`pre-merge-check.sh`), nhưng repo phải tự chọn
  `required` thì nó mới có răng. Cấu hình của chính kit đặt `required`.
- **Lưới chống né T1 (T1-escape) không có ánh xạ path→slug**: `pre-merge-check.sh`
  tính *bất kỳ* thay đổi nào dưới một đường khớp `_acceptance/*` hoặc
  `*/_acceptance/*` là «PR này có mang artifact của cổng». Glob không neo vào
  gốc repo, nên một fixture nằm dưới `<bất kỳ đâu>/_acceptance/` cũng thoả nó
  với mã thường. PR chạm `t3_paths` cần nhiều hơn: ít nhất một hồ sơ trong PR
  mà cổng thật sự chấm cho mã ấy — `risk_tier` nằm trong
  `signoff.required_for`, có `status`, có thay đổi ngoài `opportunity.md` /
  `decisions.jsonl`, và có chữ ký người nếu dưới T3. Máy không đọc được chữ ký
  (thiếu node, hoặc thiếu `lib/evidence-core.cjs`) thì không tính hồ sơ dưới
  T3, và nói rõ thiếu thứ nào. Mã thường cố ý giữ luật lỏng hơn: hồ sơ tự khai
  T1 và hạt giống không frontmatter đang được dùng thật ở đó. PR cài kit được
  miễn, vì base của nó chưa có cổng. Các suite của chính kit giữ fixture
  gap-probe do chúng sinh ở `mktemp`, ngoài repo, để tránh ca fixture; neo glob
  là một sửa đang xếp hàng (nó đổi hành vi dùng chung nên cần contract riêng).
- **Bộ đọc finding của gap-probe tách theo `|`**: ô finding có dấu gạch đứng
  thật thì mất hàng ấy trên thẻ — được đếm và gắn cờ «không đọc được», không
  bao giờ im lặng.
- **Ghép cặp judgment ở L3 theo SỐ ĐẾM**, không theo vị trí: bất kỳ
  `human_override:` nào có giá trị cũng cân một UNCERTAIN bất kỳ. Agent cố ý
  thì lách được; agent trung thực không thể vô tình dẫm.
- **Từ đồng nghĩa của verdict**: PASS/PASSED/ACCEPTED/APPROVED/GO/SUCCESS bị
  bắt; né bằng ký tự unicode trông giống nằm ngoài phạm vi của một cổng phòng
  thủ nhiều lớp.
- **Tìm cấu hình ưu tiên `_acceptance/config.yaml` gần nhất** khi đi ngược lên
  từ báo cáo — một cấu hình lồng bị cài cắm có thể hạ mức cưỡng chế; nó sẽ lộ
  trong mọi diff/review.
- **Hook chỉ thấy lần sửa của agent** (PreToolUse). Người sửa
  evidence-report.md trong trình soạn thảo là đi vòng qua nó;
  `scripts/pre-merge-check.sh` trong CI là lưới cho đúng đường ấy — nó chạy lại
  chính thước bằng chứng L1/L2/L3 của cổng trên báo cáo ĐÃ COMMIT qua
  `scripts/recheck-evidence.cjs` (cùng `lib/evidence-core.cjs` mà hook dùng),
  nên một báo cáo bị sửa tay thành PASS với mã thoát khác 0, verifier thủ công,
  hay UNCERTAIN chưa xử sẽ bị bắt lúc merge, bất kể hook lúc-ghi có chạy hay
  không. Lượt re-check mặc định `recheck: warn` (chỉ khuyên — để việc đưa nó
  vào dùng không bao giờ chặn merge vì các báo cáo viết theo khuôn bằng chứng
  đời cũ); đặt `recheck: strict` trong `_acceptance/config.yaml` để chặn cứng,
  hoặc `off` để bỏ. Xuất xứ: một bước chụp tất định đóng dấu
  `enforcement_mode` + `bypass_used`; lưới trước-merge CHẶN `bypass_used: true`
  chưa được xác nhận (người có thể gỡ bằng `bypass_ack`) và
  `enforcement_mode: off`, và CẢNH BÁO ở `warn`. Phần còn sót: một báo cáo đi
  bypass nhưng viết với bằng chứng thật trọn vẹn thì qua lượt re-check (nó
  đúng là thật) trong khi dấu `bypass_used` của nó phụ thuộc môi trường verify
  — để hook là bên có thẩm quyền ghi dấu bypass là việc còn lại.
- **Đầu ra của hook ở `enforcement: warn` / `off` chưa có ca assert** (mã thoát
  thì có — T12/T24); báo cáo `warn` nay bị cảnh báo ở lưới trước-merge, báo cáo
  `off` bị chặn.
- **Đường ray xuyên tầng (đợt 1) chỉ khuyên và dựa vào dấu**: quên gắn dấu
  `(cross-layer)` cho một criterion là tắt W4 + luật ghép cặp (c) — lưới còn
  lại là phép đối chiếu của gap-probe trong feature-loop và người ở Cổng 1 (chạy
  acceptance-gate đứng riêng thì không có gap-probe: chỉ lint + người).
  `network_observed:` chưa được hook cưỡng chế cho tới evidence schema v3; một
  `clean` bịa bị thu hẹp — không bị chặn — bởi luật từ vựng
  clean-phải-có-traffic (`no-app-traffic`) và dòng NOTE về tệp dump ở lưới
  trước-merge.
- **Kit kiểm bằng chứng của các eval đã khai, không kiểm môi trường mà một
  binding `config:` trỏ tới**: eval `layer: backend-effect` gắn vào một mock
  vẫn qua về mặt cơ học (tách engine/binding) — lưới là lượt người rà binding ở
  Cổng 1 và cờ xanh-cả-hai-phía của Analyst A/B.
- **Mobile là surface hạng nhất (1.20) có răng ở CI — nhưng chỉ có bằng chứng
  tầng UI**: luồng mobile chạy qua bộ chạy E2E native của repo
  (`executors.test.e2e_mobile`); simulator không có đường đọc mạng, nên mã
  thoát của bộ chạy ấy không bao giờ chứng được sự thật ở tầng mạng.
  `pre-merge-check.sh` nay CHẶN merge — khi tính năng đã vào cổng (status
  implemented/verified/signed-off) — nếu một criterion `(cross-layer)` không có
  eval `layer: backend-effect` ghép cặp. Đích backend (local|staging|mock) là
  một dòng contract người soi bằng mắt — lint W5 chỉ kiểm có mặt; kit không bao
  giờ dùng máy xác minh «thật».
- **Nhiễu nền trong phạm vi làm eval trượt, theo thiết kế**: một poller/cron
  bắn 5xx vào phạm vi app trong cửa sổ lái của một ui-check làm eval ấy FAIL kể
  cả khi nó không liên quan tính năng — một lỗi trong phạm vi lúc đang lái
  không bao giờ là `clean`. Đó là FAIL của máy (REJECT), nên `human_override`
  không gỡ được; chạy lại vòng hoặc descope/viết lại eval, có ghi lý do.

Design spec: `docs/superpowers/specs/2026-06-10-acceptance-gate-kit-design.md`

## Giấy phép

MIT — xem [LICENSE](../LICENSE). Hai cây vendored giữ giấy phép riêng
(`plugins/acceptance-gate/vendor/impeccable/` Apache-2.0,
`plugins/diagram-design/skills/diagram-design/` MIT);
[NOTICE](../NOTICE) nêu tên cả hai. Xem [ADR 0013](adr/0013-mo-that-mit-va-ban-chep-mo-hinh-cong.md)
về lý do repo mở và cái giá của việc đó.
