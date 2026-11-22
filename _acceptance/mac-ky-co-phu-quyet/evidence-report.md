---
schema_version: 2
feature_slug: mac-ky-co-phu-quyet
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 0e19606c23c4466c9298dbc5ba89a38592d930eb
human_signoff:
---

# Evidence Report: mac-ky-co-phu-quyet

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

Carry-forward tu round 1 — delta round 2 khong cham paths cua cac eval E1-E10, nen khong chay lai; moi khoi duoi day giu nguyen run_id va verified_at cua luot goc.

- eval: E1
  run_id: minted-mac-ky-co-phu-quyet-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac1
  verified_at: 2026-11-22T05:17:42Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-mac-ky-co-phu-quyet-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac2
  verified_at: 2026-11-22T05:17:42Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-mac-ky-co-phu-quyet-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac3
  verified_at: 2026-11-22T05:17:42Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-mac-ky-co-phu-quyet-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac4
  verified_at: 2026-11-22T05:17:42Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-mac-ky-co-phu-quyet-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac5
  verified_at: 2026-11-22T05:17:42Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-mac-ky-co-phu-quyet-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac6
  verified_at: 2026-11-22T05:17:42Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-mac-ky-co-phu-quyet-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac7
  verified_at: 2026-11-22T05:17:42Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-mac-ky-co-phu-quyet-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac8
  verified_at: 2026-11-22T05:17:42Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-mac-ky-co-phu-quyet-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac9
  verified_at: 2026-11-22T05:17:42Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-mac-ky-co-phu-quyet-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tro_ly_quyet_dinh_ac10
  verified_at: 2026-11-22T05:17:42Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-22T07:32:58Z
  output: |
    Results: 841 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-22T07:32:58Z
  output: |
    Results: 47 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-22T07:32:58Z
  output: |
    Results: 47 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-22T07:32:58Z
  output: |
    Results: 47 passed, 0 failed

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-22T07:32:58Z
  output: |
    Results: 71 passed, 0 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-22T07:32:58Z
  output: |
    Results: all plugin tests passed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-22T07:32:58Z
  output: |
    Results: all plugin tests passed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-11-22T07:32:58Z
  output: |
    Results: all plugin tests passed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-mac-ky-co-phu-quyet-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-22T07:32:58Z
  output: |
    Results: all workflow tests passed

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-mac-ky-co-phu-quyet-SUITE-node_plugins_acceptance_gate_scripts_pro-r2
  exit_code: 0
  verified_at: 2026-11-22T07:32:58Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-mac-ky-co-phu-quyet-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-22T07:32:58Z
  output: |
    BỎ QUA: KB — không phải lượt cắt mốc (số 3.0.0 = gốc vòng)

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi, round 1). Moi eval ghi baseline: n-a. Lenh suite xanh-ca-hai-phia la regression-guard binh thuong, khong liet ke.

Eval khong-phan-biet: none

## Variance

none — khong eval nao co runs lon hon 1; moi eval la deterministic.

## Iterations

Round 1: E1-E10 chay, PASS (run_id hau to r1).
Round 2: delta khong cham paths cua E1-E10 nen carry-forward tu round 1; chay lai 11 lenh suite hoi quy, tat ca PASS. Verdict PASS.
