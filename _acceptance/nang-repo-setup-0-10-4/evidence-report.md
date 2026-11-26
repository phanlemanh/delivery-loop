---
schema_version: 2
feature_slug: nang-repo-setup-0-10-4
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7b67ec8dee171f4ad1785b6ba9c228acf078a782
human_signoff:
---

# Evidence Report: nang-repo-setup-0-10-4

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nang-repo-setup-0-10-4-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-repo-setup-0-10-4/rang/chay.sh
  verified_at: 2026-11-26T03:24:48Z
  output: |
    AC-1: đạt

- eval: E2
  run_id: minted-nang-repo-setup-0-10-4-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-repo-setup-0-10-4/rang/chay.sh
  verified_at: 2026-11-26T03:24:48Z
  output: |
    AC-2: đạt

- eval: E3
  run_id: minted-nang-repo-setup-0-10-4-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-repo-setup-0-10-4/rang/chay.sh
  verified_at: 2026-11-26T03:24:48Z
  output: |
    AC-3: đạt

- eval: E4
  run_id: minted-nang-repo-setup-0-10-4-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-repo-setup-0-10-4/rang/chay.sh
  verified_at: 2026-11-26T03:24:48Z
  output: |
    AC-4: đạt

- eval: E5
  run_id: minted-nang-repo-setup-0-10-4-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-repo-setup-0-10-4/rang/chay.sh
  verified_at: 2026-11-26T03:24:48Z
  output: |
    AC-5: đạt

- eval: E6
  run_id: minted-nang-repo-setup-0-10-4-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-repo-setup-0-10-4/rang/chay.sh
  verified_at: 2026-11-26T03:24:48Z
  output: |
    AC-6: đạt

- eval: E7
  run_id: minted-nang-repo-setup-0-10-4-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-repo-setup-0-10-4/rang/chay.sh
  verified_at: 2026-11-26T03:24:48Z
  output: |
    AC-7: đạt

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-nang-repo-setup-0-10-4-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-26T03:24:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-nang-repo-setup-0-10-4-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-26T03:24:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-nang-repo-setup-0-10-4-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-26T03:24:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-nang-repo-setup-0-10-4-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-26T03:24:48Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nang-repo-setup-0-10-4-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-26T03:24:48Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nang-repo-setup-0-10-4-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-26T03:24:48Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nang-repo-setup-0-10-4-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-26T03:24:48Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nang-repo-setup-0-10-4-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-26T03:24:48Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nang-repo-setup-0-10-4-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-26T03:24:48Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-nang-repo-setup-0-10-4-SUITE-node_plugins_acceptance_gate_scripts_pro-r1
  exit_code: 0
  verified_at: 2026-11-26T03:24:48Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-nang-repo-setup-0-10-4-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-26T03:24:48Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval feature nào xanh trên cả hai phía; cả bảy eval là eval mới nên baseline là n-a, không phải red. Lý do ở mục dưới.

Baseline khong do:
- bash _acceptance/nang-repo-setup-0-10-4/rang/chay.sh AC-1: bo qua baseline: tep _acceptance/nang-repo-setup-0-10-4/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 87a392cddb2ca7a2362f3ca30a04e5998f4108fa — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/nang-repo-setup-0-10-4/rang/chay.sh AC-2: bo qua baseline: tep _acceptance/nang-repo-setup-0-10-4/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 87a392cddb2ca7a2362f3ca30a04e5998f4108fa — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/nang-repo-setup-0-10-4/rang/chay.sh AC-3: bo qua baseline: tep _acceptance/nang-repo-setup-0-10-4/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 87a392cddb2ca7a2362f3ca30a04e5998f4108fa — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/nang-repo-setup-0-10-4/rang/chay.sh AC-4: bo qua baseline: tep _acceptance/nang-repo-setup-0-10-4/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 87a392cddb2ca7a2362f3ca30a04e5998f4108fa — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/nang-repo-setup-0-10-4/rang/chay.sh AC-5: bo qua baseline: tep _acceptance/nang-repo-setup-0-10-4/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 87a392cddb2ca7a2362f3ca30a04e5998f4108fa — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/nang-repo-setup-0-10-4/rang/chay.sh AC-6: bo qua baseline: tep _acceptance/nang-repo-setup-0-10-4/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 87a392cddb2ca7a2362f3ca30a04e5998f4108fa — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/nang-repo-setup-0-10-4/rang/chay.sh AC-7: bo qua baseline: tep _acceptance/nang-repo-setup-0-10-4/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 87a392cddb2ca7a2362f3ca30a04e5998f4108fa — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1-E7 và toàn bộ lệnh suite đạt; không có eval hỏng, không có judgment item.
