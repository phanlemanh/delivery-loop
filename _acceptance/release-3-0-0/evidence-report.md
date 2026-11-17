---
schema_version: 2
feature_slug: release-3-0-0
verdict: REJECT
failed_evals: ["E1","E2h"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 27a29525dee55ebaeb0c75a77c05f3c0bc04d8a4
human_signoff:
---

# Evidence Report: release-3-0-0

Round 2. Hai eval E1 và E2h cùng chạy một lệnh (vùng 3 của suite plugins) và cùng đỏ ở ca P179 (E6 ledger known-limits). Các eval còn lại của vòng này đạt; E4, E5, E8, E9 mang từ round 1.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | FAIL |
| E2a | AC-2 | test | PASS |
| E2b | AC-2 | test | PASS |
| E2c | AC-2 | test | PASS |
| E2d | AC-2 | test | PASS |
| E2e | AC-2 | test | PASS |
| E2f | AC-2 | test | PASS |
| E2g | AC-2 | test | PASS |
| E2h | AC-2 | test | FAIL |
| E2i | AC-2 | test | PASS |
| E2j | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS (carried từ round 1) |
| E5 | AC-5 | script | PASS (carried từ round 1) |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | script | PASS (carried từ round 1) |
| E9 | AC-9 | script | PASS (carried từ round 1) |
| E10 | AC-10 | judgment | UNCERTAIN |
| E11 | AC-11 | script | PASS |
| E12 | AC-12 | test | PASS |

## Evidence

Lệnh fail có gắn eval (E1 và E2h dùng chung một lệnh, một lần chạy, runs 1): `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`. Không có lệnh fail nào không gắn eval.

- eval: E1
  run_id: minted-release-3-0-0-E1-r2
  result: FAIL (vùng 3 thoát khác 0 — ca P179 đỏ, nên P200 cùng vùng không được xác nhận xanh)
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-17T22:43:55Z
  output: |
    FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed

- eval: E2a
  run_id: minted-release-3-0-0-E2a-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-17T22:43:55Z
  output: |
    Results: 841 passed, 0 failed

- eval: E2b
  run_id: minted-release-3-0-0-E2b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-17T22:43:55Z
  output: |
    Results: 45 passed, 0 failed

- eval: E2c
  run_id: minted-release-3-0-0-E2c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-17T22:43:55Z
  output: |
    Results: 45 passed, 0 failed

- eval: E2d
  run_id: minted-release-3-0-0-E2d-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-17T22:43:55Z
  output: |
    Results: 45 passed, 0 failed

- eval: E2e
  run_id: minted-release-3-0-0-E2e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-11-17T22:43:55Z
  output: |
    Results: 71 passed, 0 failed

- eval: E2f
  run_id: minted-release-3-0-0-E2f-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-17T22:43:55Z
  output: |
    Results: all plugin tests passed

- eval: E2g
  run_id: minted-release-3-0-0-E2g-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-17T22:43:55Z
  output: |
    Results: all plugin tests passed

- eval: E2h
  run_id: minted-release-3-0-0-E2h-r2
  result: FAIL (cùng lệnh và cùng kết quả với E1 — ca P179 đỏ)
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-17T22:43:55Z
  output: |
    FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed

- eval: E2i
  run_id: minted-release-3-0-0-E2i-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-11-17T22:43:55Z
  output: |
    Results: all workflow tests passed

- eval: E2j
  run_id: minted-release-3-0-0-E2j-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-11-17T22:43:55Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E3
  run_id: minted-release-3-0-0-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel300_cua_so
  verified_at: 2026-11-17T22:43:55Z
  output: |
    XANH: hai tập bằng nhau

- eval: E4
  run_id: minted-release-3-0-0-E4-r1
  exit_code: 0
  verifier: config:executors.script.rel300_cay_kich_ban
  verified_at: 2026-11-17T17:15:01Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-release-3-0-0-E5-r1
  exit_code: 0
  verifier: config:executors.script.rel300_vi_phan
  verified_at: 2026-11-17T17:15:01Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-release-3-0-0-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel300_hang_loi
  verified_at: 2026-11-17T22:43:55Z
  output: |
    hang-loi: đường chết hai chiều đạt — HEAD 0 trên 1034 chuỗi, nền đủ ba glob chết

- eval: E7
  run_id: minted-release-3-0-0-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-17T22:43:55Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.39.0 (0c4e503b) cài đúng tag

- eval: E8
  run_id: minted-release-3-0-0-E8-r1
  exit_code: 0
  verifier: config:executors.script.rel300_guide_ci
  verified_at: 2026-11-17T17:15:01Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-release-3-0-0-E9-r1
  exit_code: 0
  verifier: config:executors.script.rel300_don_dau_vet
  verified_at: 2026-11-17T17:15:01Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-release-3-0-0-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel300_duong_cu
  verified_at: 2026-11-17T22:43:55Z
  output: |
    duong-cu-con-sot: đạt

- eval: E12
  run_id: minted-release-3-0-0-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-11-17T22:43:55Z
  output: |
    KB: mọi ca PASS

### Judgment

- eval: E10
  judged_by: hội đồng 3 lens (đề xuất panel: domain-correctness, operational-feasibility, spec-alignment)
  proposal: UNCERTAIN
  votes:
    - domain-correctness: UNCERTAIN — Vế (1), (2), (3) đúng. Các dòng Gốc, gạch Vật và số giới hạn khớp opportunity.md và Notes của sáu hồ sơ. Bảng tên khớp bang-ten.json, và không câu nào nói ngưỡng thực tế đã đạt. Vế (4) không chốt được. Khối mẫu «Trong job CI» của GUIDE §5.3 chỉ có KIT_SHA, kho delivery-loop và `plugins/acceptance-gate`. Khối ấy không có đường feature-loop nào để so với câu «mọi đường $CLAUDE_PLUGIN_ROOT/feature-loop/… sang $RUNNER_TEMP/kit/plugins/feature-loop/…» của CHANGELOG. CHANGELOG ghi «hai đường feature-loop/…» ở GUIDE, còn Context hợp đồng chỉ đo «một lệnh <kit>/feature-loop/…».
    - operational-feasibility: UNCERTAIN — Vế (1), (2), (3) đúng. (1) Gốc, Vật và số giới hạn khớp Notes của sáu hợp đồng. (2) Mười hai lệnh, ba plugin và hai skill khớp bang-ten.json. (3) Mục ghi ngưỡng thực tế là «CHƯA ĐẠT». Vế (4) không chứng minh được: đoạn «Kho tiêu thụ làm gì khi nhận» dặn đổi `$CLAUDE_PLUGIN_ROOT/feature-loop/…` sang `$RUNNER_TEMP/kit/plugins/feature-loop/…` «khuôn GUIDE §5.3», nhưng khối mẫu §5.3 (bước «Trong job CI») không có đường feature-loop nào. Kho, thẻ và gốc plugin lõi thì khớp khối mẫu. Bullet «GUIDE §5.3» ở phần «Mốc Chuyển nhà» nói «hai đường feature-loop/…», còn hợp đồng ghi «một lệnh <kit>/feature-loop/… ở GUIDE», và lệnh duy nhất của GUIDE nằm ở dòng 1794 ngoài §5.3.
    - spec-alignment: PASS — Vế 1: dòng «Vật:» chép đúng dòng feature của sáu hợp đồng. Các Gốc và câu trích khớp opportunity.md, và số giới hạn khớp mục Notes (B1 4+13, B2 6+8, gói chéo 12, vòng hai 11, vòng ba 4, vòng bốn 4). Vế 2: tên chợ, ba plugin, mười hai lệnh, hai skill khớp bang-ten.json. Mục cũng nêu gốc plugin lõi, không bí danh và crm ở lại kit cũ. Vế 3: ngưỡng thực tế ghi «CHƯA ĐẠT», «chưa có commit cài». Vế 4: kho kéo kit, thẻ `v3.0.0` và gốc `plugins/acceptance-gate` khớp khối GUIDE §5.3. Đường `plugins/feature-loop/…` không có trong khối mẫu nên tôi không đối chiếu trực tiếp được, nhưng nó nhất quán với bố cục mới và GUIDE dòng 1794.
  required_evidence:
    - Vị trí trong GUIDE.md mà CHANGELOG mục 3.0.0 gọi là «hai đường feature-loop/…» của §5.3 (đọc GUIDE.md quanh dòng 994-1073 và các dòng 1568, 1794). Mỗi vị trí phải chỉ ra được đường feature-loop nằm trong khối mẫu §5.3 hoặc được §5.3 dặn trực tiếp. Có vị trí đó thì vế (4) so được và đổi sang PASS hoặc FAIL.
    - Đối chiếu Context hợp đồng release-3-0-0 («một lệnh <kit>/feature-loop/… ở GUIDE») với «hai đường» trong CHANGELOG. Lấy từ phép đo của `_acceptance/release-3-0-0/guide-ci.sh` hoặc `tai-lieu-duong.mjs` nêu số đường feature-loop đổi ở GUIDE. Số là hai thì câu CHANGELOG đúng, là một thì sai.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature deu red tren baseline (co phan biet) không đo được; không eval nào có baseline red hay green, tất cả là n-a. Không có eval nào bị xác định là không-phân-biệt.

### Baseline khong do

- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh bash: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 118 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node plugins/acceptance-gate/scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash _acceptance/release-2-39-0/cua-so.sh 0c4e503b bo-kiem-xanh-o-kho-moi goi-cheo-loi-dieu-phoi kich-ban-chuyen-nha phan-du-bo-cuc-moi phan-du-bo-cuc-moi-vong-ba phan-du-bo-cuc-moi-vong-bon: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-3-0-0/hang-loi.sh --hai-chieu 90c3f9f197e18004eb0a8efb7d3d960bb02f5d12: bo qua baseline: tep _acceptance/release-3-0-0/hang-loi.sh co o cay dang kiem nhung chua co o merge-base 90c3f9f197e18004eb0a8efb7d3d960bb02f5d12 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-3-0-0/duong-cu-con-sot.sh --hai-chieu 6597f700cc494b7dff8c832c6939176b0cdf46cd: bo qua baseline: tep _acceptance/release-3-0-0/duong-cu-con-sot.sh co o cay dang kiem nhung chua co o merge-base 90c3f9f197e18004eb0a8efb7d3d960bb02f5d12 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/kiem-ban-cai.ca.mjs: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

Eval không-phân-biệt (xanh cả HEAD lẫn baseline): none.

## Variance

none — mọi eval multi-run đều đồng đều (không eval nào có runs lớn hơn 1).

## Iterations

Round 1: PENDING-JUDGMENT — eval máy đạt hết, E10 chưa chốt, 12 mục ngoài hợp đồng. Chuyển sang sửa ghi chú phát hành, P196 và ca kiểm bản cài theo bố cục mới.
Round 2: E1, E2h failed — vùng 3 của suite plugins đỏ ở ca P179 (E6 ledger known-limits, đột biến 6 doc_manifest() báo thiếu số bản ở feature-loop/skills/feature-loop/SKILL.md). Returned to implementation.
