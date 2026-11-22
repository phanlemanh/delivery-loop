---
schema_version: 2
feature_slug: tep-chung-khong-chan-gop
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a9e900e55096e4a3f4f06d070c87a4cb68d38199
human_signoff: Phan Le Manh 2026-11-22 — ký lượt chấm round 2; Ngoài-1 đến Ngoài-9 và Ngoài-11 đến Ngoài-16 ghi Known limits, Ngoài-10 chấp nhận không sửa; cắt/hoãn đồng ý cắt; Treo phê hết; gộp khi CI xanh
---

# Evidence Report: tep-chung-khong-chan-gop

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
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E11 | AC-11 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-tep-chung-khong-chan-gop-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T01:52:40Z
  output: |
    chay.sh: TCG-1 xanh — 2/2 ca

- eval: E2
  run_id: minted-tep-chung-khong-chan-gop-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T01:52:40Z
  output: |
    chay.sh: TCG-2 xanh — 5/5 ca

- eval: E3
  run_id: minted-tep-chung-khong-chan-gop-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T01:52:40Z
  output: |
    chay.sh: TCG-3 xanh — 4/4 ca

- eval: E4
  run_id: minted-tep-chung-khong-chan-gop-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T01:52:40Z
  output: |
    chay.sh: TCG-4 xanh — 3/3 ca

- eval: E5
  run_id: minted-tep-chung-khong-chan-gop-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T01:52:40Z
  output: |
    chay.sh: TCG-5 xanh — 5/5 ca

- eval: E6
  run_id: minted-tep-chung-khong-chan-gop-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T01:52:40Z
  output: |
    chay.sh: TCG-6 xanh — 2/2 ca

- eval: E7
  run_id: minted-tep-chung-khong-chan-gop-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-tep-chung-khong-chan-gop-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-tep-chung-khong-chan-gop-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T01:52:40Z
  output: |
    chay.sh: TCG-9 xanh — 6/6 ca

- eval: E11
  run_id: minted-tep-chung-khong-chan-gop-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T01:52:40Z
  output: |
    chay.sh: TCG-11 xanh — 6/6 ca

- eval: E10
  run_id: minted-tep-chung-khong-chan-gop-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T01:52:40Z
  output: |
    chay.sh: TCG-10 xanh — 18/18 ca

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-22T01:52:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-22T01:52:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-22T01:52:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-22T01:52:40Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-22T01:52:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-22T01:52:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-22T01:52:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-11-22T01:52:40Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-22T01:52:40Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-tep-chung-khong-chan-gop-SUITE-node_plugins_acceptance_gate_scripts_pro-r2
  exit_code: 0
  verified_at: 2026-11-22T01:52:40Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-tep-chung-khong-chan-gop-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-22T01:52:40Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 2 — baseline khong do lai round nay

none — khong eval nao khong-phan-biet duoc liet ke.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E7, E8 xanh (carry sang round 2); S4 vong 1 sua VC8, ghim thong diep nhat tiem, nhanh mac dinh cua lenh day.
Round 2: E1-E6, E9-E11 chay lai tren c5a80162 va xanh; E7, E8 carry-forward tu round 1 vi delta khong cham paths cua chung; cac lenh suite xanh.

### Re-pin lần 1 — 2026-11-22, do ghim «bản trước vòng» của TCG-1 vào 50840764 thay merge-base — ca đỏ trên main từ PR #17
run_id: repin-20261122T061105Z-58608
sha: a9e900e55096e4a3f4f06d070c87a4cb68d38199 · suites: 11 lệnh exit 0 · evals: 11/11 eval máy đạt kỳ vọng
