---
schema_version: 2
feature_slug: mac-ky-co-phu-quyet
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2c23d6362db9b1dadcd3a4ea02ee27b2b84c4664
human_signoff:
---

# Evidence Report: mac-ky-co-phu-quyet

Verdict REJECT dù `failed_evals` rỗng: cả mười eval của hợp đồng (E1–E10) đều xanh, nhưng một lệnh suite hồi quy không gắn eval nào (`bash tests/scripts/run-tests.sh --manh mjs:1/3`) kết thúc đỏ ở ca `tcg-ban-do.test.mjs`. Xem khối suite bên dưới.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-mac-ky-co-phu-quyet-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac1
  verified_at: 2026-11-22T05:17:42Z
  output: |
    TLQ Results: 3 passed, 0 failed

- eval: E2
  run_id: minted-mac-ky-co-phu-quyet-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac2
  verified_at: 2026-11-22T05:17:42Z
  output: |
    TLQ Results: 1 passed, 0 failed

- eval: E3
  run_id: minted-mac-ky-co-phu-quyet-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac3
  verified_at: 2026-11-22T05:17:42Z
  output: |
    TLQ Results: 3 passed, 0 failed

- eval: E4
  run_id: minted-mac-ky-co-phu-quyet-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac4
  verified_at: 2026-11-22T05:17:42Z
  output: |
    TLQ Results: 1 passed, 0 failed

- eval: E5
  run_id: minted-mac-ky-co-phu-quyet-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac5
  verified_at: 2026-11-22T05:17:42Z
  output: |
    TLQ Results: 4 passed, 0 failed

- eval: E6
  run_id: minted-mac-ky-co-phu-quyet-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac6
  verified_at: 2026-11-22T05:17:42Z
  output: |
    TLQ Results: 3 passed, 0 failed

- eval: E7
  run_id: minted-mac-ky-co-phu-quyet-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac7
  verified_at: 2026-11-22T05:17:42Z
  output: |
    TLQ Results: 1 passed, 0 failed

- eval: E8
  run_id: minted-mac-ky-co-phu-quyet-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac8
  verified_at: 2026-11-22T05:17:42Z
  output: |
    TLQ Results: 1 passed, 0 failed

- eval: E9
  run_id: minted-mac-ky-co-phu-quyet-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac9
  verified_at: 2026-11-22T05:17:42Z
  output: |
    TLQ Results: 2 passed, 0 failed

- eval: E10
  run_id: minted-mac-ky-co-phu-quyet-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac10
  verified_at: 2026-11-22T05:17:42Z
  output: |
    TLQ Results: 1 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-22T05:17:42Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 1
  verified_at: 2026-11-22T05:17:42Z
  note: lệnh suite này ĐỎ và không gắn eval nào. Các ca xem-trang-lo-trinh đều PASS; ca đỏ duy nhất là tcg-ban-do.test.mjs (chạy 10 giây, trả mã thoát 1 thay vì 0). Kết quả cuối của lô là 46 passed, 1 failed.

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-22T05:17:42Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-22T05:17:42Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-22T05:17:42Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-22T05:17:42Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-22T05:17:42Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-22T05:17:42Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-22T05:17:42Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-mac-ky-co-phu-quyet-SUITE-node_plugins_acceptance_gate_scripts_pro-r1
  exit_code: 0
  verified_at: 2026-11-22T05:17:42Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-mac-ky-co-phu-quyet-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-22T05:17:42Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Lưu ý đọc đúng dòng trên: không có eval nào bị liệt vào nhóm không-phân-biệt, nhưng baseline của cả mười eval KHÔNG được đo (xem dưới), nên «red trên baseline» chưa được chứng minh bằng phép đo ở vòng này. Chiều đỏ của các ca nằm ở lịch sử (commit 1dc5abe9, khi vật chưa có), không ở lượt baseline này.

Baseline khong do

- env TLQ_CASES=AC-1 node tests/scripts/tro-ly-quyet-dinh.test.mjs: bo qua baseline: tep tests/scripts/tro-ly-quyet-dinh.test.mjs co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi
- env TLQ_CASES=AC-2 node tests/scripts/tro-ly-quyet-dinh.test.mjs: bo qua baseline: tep tests/scripts/tro-ly-quyet-dinh.test.mjs co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi
- env TLQ_CASES=AC-3 node tests/scripts/tro-ly-quyet-dinh.test.mjs: bo qua baseline: tep tests/scripts/tro-ly-quyet-dinh.test.mjs co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi
- env TLQ_CASES=AC-4 node tests/scripts/tro-ly-quyet-dinh.test.mjs: bo qua baseline: tep tests/scripts/tro-ly-quyet-dinh.test.mjs co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi
- env TLQ_CASES=AC-5 node tests/scripts/tro-ly-quyet-dinh.test.mjs: bo qua baseline: tep tests/scripts/tro-ly-quyet-dinh.test.mjs co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi
- env TLQ_CASES=AC-6 node tests/scripts/tro-ly-quyet-dinh.test.mjs: bo qua baseline: tep tests/scripts/tro-ly-quyet-dinh.test.mjs co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi
- env TLQ_CASES=AC-7 node tests/scripts/tro-ly-quyet-dinh.test.mjs: bo qua baseline: tep tests/scripts/tro-ly-quyet-dinh.test.mjs co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi
- env TLQ_CASES=AC-8 node tests/scripts/tro-ly-quyet-dinh.test.mjs: bo qua baseline: tep tests/scripts/tro-ly-quyet-dinh.test.mjs co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi
- env TLQ_CASES=AC-9 node tests/scripts/tro-ly-quyet-dinh.test.mjs: bo qua baseline: tep tests/scripts/tro-ly-quyet-dinh.test.mjs co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi
- env TLQ_CASES=AC-10 node tests/scripts/tro-ly-quyet-dinh.test.mjs: bo qua baseline: tep tests/scripts/tro-ly-quyet-dinh.test.mjs co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mười eval E1–E10 xanh, nhưng lệnh suite `bash tests/scripts/run-tests.sh --manh mjs:1/3` đỏ ở ca tcg-ban-do.test.mjs (lệnh không gắn eval nào, nên failed_evals rỗng). Trả về triển khai: xác định ca đó đỏ do vật của vòng này hay có sẵn trên nhánh chính trước khi ký.
