---
schema_version: 2
feature_slug: bang-chung-cu-theo-dau-vao
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e41ce3ab1d20bc4e2ce9ba279880445ff6f58807
human_signoff: Phan Le Manh 2026-11-27
---

# Evidence Report: bang-chung-cu-theo-dau-vao

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bang-chung-cu-theo-dau-vao-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T17:14:48Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-bang-chung-cu-theo-dau-vao-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T17:14:48Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-bang-chung-cu-theo-dau-vao-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T17:14:48Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-bang-chung-cu-theo-dau-vao-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T17:14:48Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-bang-chung-cu-theo-dau-vao-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T17:14:48Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-bang-chung-cu-theo-dau-vao-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T17:14:48Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-bang-chung-cu-theo-dau-vao-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-27T02:34:37Z
  output: |
    AC-7: chiều đỏ đỏ đúng

- eval: E8
  run_id: minted-bang-chung-cu-theo-dau-vao-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T17:14:48Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-11-27T02:34:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-11-27T02:34:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-11-27T02:34:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-11-27T02:34:37Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-27T02:34:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-11-27T02:34:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-11-27T02:34:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-11-27T02:34:37Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-27T02:34:37Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-node_plugins_acceptance_gate_scripts_pro-r3
  exit_code: 0
  verified_at: 2026-11-27T02:34:37Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-11-27T02:34:37Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline khong do: evals.yaml khong doi tu lan baseline cuoi (round 1); moi eval ghi baseline n-a.

Eval khong-phan-biet: none.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: bốn lệnh suite đỏ. Returned to implementation.
Round 2: P179 sinh 13 hàng sổ giới hạn. Returned to implementation.
Round 3: mọi eval và mọi lệnh suite xanh — PASS.
