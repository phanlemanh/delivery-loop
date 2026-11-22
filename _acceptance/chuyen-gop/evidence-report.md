---
schema_version: 2
feature_slug: chuyen-gop
verdict: REJECT
failed_evals: ["E10"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f9c39f2ee046a5b07198b688f276e6751070ce77
human_signoff:
---

# Evidence Report: chuyen-gop

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-5 | test | PASS |
| E9 | AC-8 | test | PASS |
| E10 | AC-8 | script | FAIL |

## Evidence

- eval: E1
  run_id: minted-chuyen-gop-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  output: |
    ok 1 - AC-1 gom cac PR dat bang chung trong cung cua so, khoi hanh khi het cua so
    ok 2 - AC-2 chuyen xanh kiem mot lan tren ngon roi gop ca chuyen theo thu tu dat bang chung
    ok 3 - AC-2 chua het cua so thi cho, khong kiem khong gop

- eval: E2
  run_id: minted-chuyen-gop-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  output: |
    ok 2 - AC-2 chuyen xanh kiem mot lan tren ngon roi gop ca chuyen theo thu tu dat bang chung
    ok 3 - AC-2 chua het cua so thi cho, khong kiem khong gop

- eval: E3
  run_id: minted-chuyen-gop-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  output: |
    stdout của lệnh chung (một lệnh cho E1-E7, E9) có "ok <n> - AC-3 " cho các ca AC-3 và không có "not ok".

- eval: E4
  run_id: minted-chuyen-gop-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  output: |
    stdout của lệnh chung có "ok <n> - AC-4 " cho các ca AC-4 và không có "not ok".

- eval: E5
  run_id: minted-chuyen-gop-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  output: |
    stdout của lệnh chung có "ok <n> - AC-5 " cho các ca AC-5 và không có "not ok".

- eval: E6
  run_id: minted-chuyen-gop-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  output: |
    stdout của lệnh chung có "ok <n> - AC-6 " cho các ca AC-6 và không có "not ok".

- eval: E7
  run_id: minted-chuyen-gop-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  output: |
    stdout của lệnh chung có "ok <n> - AC-7 " cho các ca AC-7 và không có "not ok".

- eval: E8
  run_id: minted-chuyen-gop-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-11-22T08:28:16Z
  output: |
    ok 1 - KDG-M0 đối chứng dương: bản sao chưa tiêm xanh trên cả bốn tệp ca
    ok 2 - KDG-M C chonHangKe bỏ hàm trùng → đỏ đúng C-11, C-12, C-13, C-2, C-3, C-7, C-8, C-9

- eval: E9
  run_id: minted-chuyen-gop-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  output: |
    stdout của lệnh chung có "ok <n> - AC-8 " cho các ca AC-8 và không có "not ok".

- eval: E10
  run_id: minted-chuyen-gop-E10-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.chuyen_gop_dot_bien
  verified_at: 2026-11-22T08:28:16Z
  output: |
    PASS: DB-0 bản nguyên vẹn xanh
    PASS: DB-9 bỏ kiểm nhánh chính → đỏ «AC-8 nhanh chinh do…» (2 ca đỏ)
    FAIL: DB-10 bên ghi hàng 1 đổi tên trường may — không làm ca «AC-5 nhan biet mon mac-ky…» đỏ (đỏ: không ca nào)
    DB Results: 9 passed, 1 failed

Lệnh fail không gắn eval: `node _acceptance/chuyen-gop/rang/dot-bien.mjs` là lệnh của E10 (đã tính ở trên), không có lệnh fail nào khác ngoài eval.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-chuyen-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-22T08:28:16Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-chuyen-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-22T08:28:16Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-chuyen-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-22T08:28:16Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-chuyen-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-22T08:28:16Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-chuyen-gop-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-22T08:28:16Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chuyen-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-22T08:28:16Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chuyen-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-22T08:28:16Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chuyen-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-22T08:28:16Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-chuyen-gop-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-22T08:28:16Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-chuyen-gop-SUITE-node_plugins_acceptance_gate_scripts_pro-r1
  exit_code: 0
  verified_at: 2026-11-22T08:28:16Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-chuyen-gop-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-22T08:28:16Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline):

- E8: lệnh `bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/loi/trung-tep.test.mjs" "tests/dieu-phoi/loi/gop.test.mjs" "tests/dieu-phoi/loi/do-gop.test.mjs" "tests/workflows/pr-san-sang.test.mjs" "tests/dieu-phoi/ky-den-gop-mutants.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - (C|I|DG|H|KDG)-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -'` xanh ở cả hai phía. Đây là regression-guard có chủ ý: AC-5 đòi lệnh gộp từng PR với hồ sơ không mặc-ký giữ nguyên phán quyết cũ.

Baseline không đo:

- bash -c 'set -o pipefail; node --test --test-reporter=tap tests/dieu-phoi/chuyen-gop.test.mjs 2>&1 | grep -E "^ *(not )?ok [0-9]+ - AC-|^# (pass|fail) " | paste -sd"|" -': bỏ qua baseline: tệp tests/dieu-phoi/chuyen-gop.test.mjs có ở cây đang kiểm nhưng chưa có ở merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval mới, chạy trên code cũ không phân biệt gì
- node _acceptance/chuyen-gop/rang/dot-bien.mjs: bỏ qua baseline: tệp _acceptance/chuyen-gop/rang/dot-bien.mjs có ở cây đang kiểm nhưng chưa có ở merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval mới, chạy trên code cũ không phân biệt gì

Judge panels: không có eval judgment nào trong hợp đồng này, nên không có panel và không có mục human_override nào để điền.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E10 failed — DB-10 tiêm chuỗi `so_do: SO_DO, may: DAU_MAY,` xuất hiện hai lần trong tro-ly-quyet-dinh.cjs; replace chỉ đổi lần đầu (dòng sự kiện kéo), không đổi dòng mặc-ký mà ca AC-5 chạy, nên 9/10 đột biến làm đỏ. Returned to implementation.
