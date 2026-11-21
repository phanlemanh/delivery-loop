---
schema_version: 2
feature_slug: loi-gop-trong-cau-ky
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a2dcc7b383c5ccf06a65ee665a4497bd2e385b0a
human_signoff:
---

# Evidence Report: loi-gop-trong-cau-ky

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-9 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-loi-gop-trong-cau-ky-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgck_the
  verified_at: 2026-11-21T03:34:13Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-loi-gop-trong-cau-ky-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgck_im
  verified_at: 2026-11-21T03:34:13Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-loi-gop-trong-cau-ky-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgck_the
  verified_at: 2026-11-21T03:34:13Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-loi-gop-trong-cau-ky-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgck_luat
  verified_at: 2026-11-21T03:34:13Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-loi-gop-trong-cau-ky-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgck_vong_khep
  verified_at: 2026-11-21T03:34:13Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-loi-gop-trong-cau-ky-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_loi_gop
  verified_at: 2026-11-21T03:34:13Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-loi-gop-trong-cau-ky-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_loi_gop
  verified_at: 2026-11-21T03:34:13Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-loi-gop-trong-cau-ky-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_loi_gop
  verified_at: 2026-11-21T03:34:13Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-loi-gop-trong-cau-ky-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgck_the
  verified_at: 2026-11-21T03:34:13Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-loi-gop-trong-cau-ky-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_loi_gop_mutants
  verified_at: 2026-11-21T03:34:13Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-21T03:46:42Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: bnms065it
  exit_code: 0
  verified_at: 2026-11-21T03:46:42Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-21T03:46:42Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-21T03:46:42Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-21T03:46:42Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-21T03:46:42Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-21T03:46:42Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-11-21T03:46:42Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-21T03:46:42Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-loi-gop-trong-cau-ky-SUITE-node_plugins_acceptance_gate_scripts_pro-r2
  exit_code: 0
  verified_at: 2026-11-21T03:46:42Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-loi-gop-trong-cau-ky-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-21T03:46:42Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

none — khong co eval nao duoc xac dinh la khong-phan-biet; cac lenh suite xanh-ca-hai-phia la regression-guard binh thuong.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: lượt chấm S4 bị chặn do Node lệch ở tác tử chấm (hạ tầng, không phải lỗi vật). Chạy lại.
Round 2: toàn bộ lệnh suite xanh; mười eval carry-forward từ round 1 vì delta không chạm paths của chúng. Verdict PASS.
