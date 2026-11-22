---
schema_version: 2
feature_slug: release-3-1-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8b760277bfd05023edd7d4713733d6b39e5259e7
human_signoff: Manh Phan 2026-11-22 — ký mốc phát hành 3.1.0; Ngoài-1, Ngoài-2 ghi Known limits; cắt/hoãn đồng ý cắt; Treo phê hết; gộp khi CI xanh
---

# Evidence Report: release-3-1-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2a | AC-2 | test | PASS |
| E2b | AC-2 | test | PASS |
| E2c | AC-2 | test | PASS |
| E2d | AC-2 | test | PASS |
| E2e | AC-2 | test | PASS |
| E2f | AC-2 | test | PASS |
| E2g | AC-2 | test | PASS |
| E2h | AC-2 | test | PASS |
| E2i | AC-2 | test | PASS |
| E2j | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | judgment | PASS |
| E8 | AC-8 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-3-1-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-22T10:46:47Z
  output: |
    Results: all plugin tests passed

- eval: E2a
  run_id: minted-release-3-1-0-E2a-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-22T10:46:47Z
  output: |
    Results: 841 passed, 0 failed

- eval: E2b
  run_id: minted-release-3-1-0-E2b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-22T10:46:47Z
  output: |
    Results: 47 passed, 0 failed

- eval: E2c
  run_id: minted-release-3-1-0-E2c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-22T10:46:47Z
  output: |
    Results: 47 passed, 0 failed

- eval: E2d
  run_id: minted-release-3-1-0-E2d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-22T10:46:47Z
  output: |
    Results: 47 passed, 0 failed

- eval: E2e
  run_id: minted-release-3-1-0-E2e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-11-22T10:46:47Z
  output: |
    Results: 71 passed, 0 failed

- eval: E2f
  run_id: minted-release-3-1-0-E2f-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-22T10:46:47Z
  output: |
    Results: all plugin tests passed

- eval: E2g
  run_id: minted-release-3-1-0-E2g-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-22T10:46:47Z
  output: |
    Results: all plugin tests passed

- eval: E2h
  run_id: minted-release-3-1-0-E2h-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-22T10:46:47Z
  output: |
    Results: all plugin tests passed

- eval: E2i
  run_id: minted-release-3-1-0-E2i-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-11-22T10:46:47Z
  output: |
    Results: all workflow tests passed

- eval: E2j
  run_id: minted-release-3-1-0-E2j-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-11-22T10:46:47Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E3
  run_id: minted-release-3-1-0-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-0/chay.sh
  verified_at: 2026-11-22T10:46:47Z
  output: |
    XANH: hai tập bằng nhau

- eval: E4
  run_id: minted-release-3-1-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-0/chay.sh
  verified_at: 2026-11-22T10:46:47Z
  output: |
    XANH: diagram-design không đổi, giữ số

- eval: E5
  run_id: minted-release-3-1-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-0/chay.sh
  verified_at: 2026-11-22T10:46:47Z
  output: |
    XANH: hai gói chỉ đổi dòng version

- eval: E6
  run_id: minted-release-3-1-0-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-0/chay.sh
  verified_at: 2026-11-22T10:46:47Z
  output: |
    XANH: đúng 5 tệp đổi như ghi chú 3.1.0 kể

- eval: E8
  run_id: r1-l15-1-20261122104647
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-22T10:46:47Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v3.0.0 (c16d25db) cài đúng tag

### Judge (E7 — đề xuất panel, human_override để trống)

Đề xuất panel: PASS. Bộ đề xuất, chưa phải quyết định của người.

- domain-correctness: UNCERTAIN — Vế (1) và (2) đúng: mọi ô trong bảng năm dòng và dòng gộp khớp nguồn đếm, khối INIT-CI-COPY-LIST có đúng 39 mục và năm tệp được kể đều nằm trong khối. Vế (0) và (3) đúng gần hết, nhưng mục `mac-ky-co-phu-quyet` nói hạt giống «làm trước khi kho tiêu thụ nào bật mặc-ký». Ý «làm trước» không có trong hợp đồng, sổ quyết định hay design doc của hồ sơ ấy, vì sổ chỉ ghi «tới khi vòng riêng gộp, kho bật cờ vẫn mang lỗi này». Không có căn cứ để phân biệt đây là câu chép từ tệp hạt giống hay là câu thêm.
- operational-feasibility: PASS — Cả bốn vế đều khớp nguồn trong danh sách input. (0) Dòng «Gốc:», gạch «Vật:», các giới hạn trích, cảnh báo của hồ sơ tep-chung và số giới hạn khớp Notes hợp đồng và các dòng gate2: 3+5, 16/15, 13/10 và 1+12/10. (1) Out-token, tỉ lệ vật/tìm-lỗi/tổng hợp và phút máy mỗi lượt của cả bốn hồ sơ khớp bảng «vai tro» của usage-report; tổng gộp là 596 358 token và 456 phút. Lượt chấm và phán quyết khớp `round-tally` và `cay-doi`; dòng cổng khớp sổ quyết định. Trung vị 3 g 46 và 0 g 12 nhất quán với bốn ô. (2) Năm tệp của lớp chép CI đều nằm trong khối INIT-CI-COPY-LIST, và khối có đúng 39 mục (dòng 168–206). (3) Đoạn «Vì sao 3.1.0» và «Ai bị ảnh hưởng» nói thẳng hai thay đổi chạm mọi kho (cảnh báo mới của lượt chấm và lớp chép CI), và căn cứ chọn số khớp Context của hợp đồng release-3-1-0.
- spec-alignment: PASS — Cả bốn vế khớp nguồn. (0) Câu mô tả vòng, gạch «Vật:», các trích «» và số giới hạn khớp hợp đồng, opportunity.md và các dòng gate2 của sổ quyết định (3+5, 16 với 15 ở Notes vì Ngoài-10 là «chấp nhận», 13 với 10, 1+12 với 10). (1) Mọi ô của bảng năm dòng tính lại đúng từ usage-report và run-log. (2) Cả năm tệp lớp chép CI nằm trong khối INIT-CI-COPY-LIST và khối có đúng 39 mục. (3) «Vì sao 3.1.0» và «Ai bị ảnh hưởng» nói thẳng hai đổi chạm mọi kho, và căn cứ chọn số 3.1.0 khớp Context của release-3-1-0. Còn ba điểm lệch nhỏ chưa đủ để chấm hỏng, nêu ở mục chú thích.

- eval: E7
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  rationale: Đề xuất của panel là PASS (hai phiếu PASS, một phiếu UNCERTAIN ở lens domain-correctness về câu «làm trước» của mục mac-ky-co-phu-quyet).
  required_evidence:
    - Tệp docs/plans/2026-11-22-hat-giong-tro-ly-quyet-dinh-vung-va-an-le.md (hoặc dòng Notes/sổ quyết định) có câu nói rõ hạt giống phải làm TRƯỚC khi kho tiêu thụ nào bật mặc-ký. Nếu có, mục con mac-ky của CHANGELOG '## 3.1.0' là chữ của hồ sơ. Nếu không có, câu đó là chữ thêm vào.
    - Xác nhận từ nguồn đọc được rằng lời «chạm mọi kho» cho việc thêm scripts/tro-ly-quyet-dinh.cjs vào lớp chép CI là đúng, dù khối INIT-CI-COPY-LIST gắn tệp này với [only-if-declared: tri_thuc]. Nguồn cần là một dòng trong CHANGELOG hay hợp đồng release-3-1-0 nói rõ điều kiện tri_thuc, hoặc nói rõ lớp chép CI áp cho mọi kho.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

Hai mục ngoài hợp đồng (mức medium và low, đề xuất known-limits) nằm ở review-findings.md, người quyết ở Cổng 2.

## Analyst

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline):
- E1 và E2h (`bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`): baseline green. Cần xác nhận đây là regression-guard có chủ ý hoặc viết lại để khẳng định hành vi mới.
- E2a (`bash tests/scripts/run-tests.sh --manh bash`): baseline green, regression-guard.

Baseline khong do
- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: baseline vuot tran 30 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node plugins/acceptance-gate/scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-3-1-0/chay.sh cua-so: bo qua baseline: tep _acceptance/release-3-1-0/chay.sh co o cay dang kiem nhung chua co o merge-base 130192aed5e532c4799b901224cf512f70df072a — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-1-0/chay.sh dd-giu: bo qua baseline: tep _acceptance/release-3-1-0/chay.sh co o cay dang kiem nhung chua co o merge-base 130192aed5e532c4799b901224cf512f70df072a — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-1-0/chay.sh goi-doi: bo qua baseline: tep _acceptance/release-3-1-0/chay.sh co o cay dang kiem nhung chua co o merge-base 130192aed5e532c4799b901224cf512f70df072a — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-1-0/chay.sh lop-chep: bo qua baseline: tep _acceptance/release-3-1-0/chay.sh co o cay dang kiem nhung chua co o merge-base 130192aed5e532c4799b901224cf512f70df072a — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy xanh; E7 do panel đề xuất PASS, chờ người điền human_override ở Cổng 2.
