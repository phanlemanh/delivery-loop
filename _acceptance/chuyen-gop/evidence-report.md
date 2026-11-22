---
schema_version: 2
feature_slug: chuyen-gop
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 86310383f6530cc899166f54f53143e6166d0c54
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
| E10 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-chuyen-gop-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-chuyen-gop-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-chuyen-gop-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-chuyen-gop-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-chuyen-gop-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-chuyen-gop-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-chuyen-gop-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-chuyen-gop-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-11-22T08:28:16Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-chuyen-gop-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.chuyen_gop
  verified_at: 2026-11-22T08:28:16Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-chuyen-gop-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.chuyen_gop_dot_bien
  verified_at: 2026-11-22T09:29:27Z
  output: |
    DB Results: 10 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-chuyen-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-22T09:29:27Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-chuyen-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-22T09:29:27Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-chuyen-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-22T09:29:27Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-chuyen-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-22T09:29:27Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-chuyen-gop-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-22T09:29:27Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chuyen-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-22T09:29:27Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chuyen-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-22T09:29:27Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chuyen-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-11-22T09:29:27Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-chuyen-gop-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-22T09:29:27Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-chuyen-gop-SUITE-node_plugins_acceptance_gate_scripts_pro-r2
  exit_code: 0
  verified_at: 2026-11-22T09:29:27Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-chuyen-gop-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-22T09:29:27Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

Baseline khong do: E10 là eval mới của round 2, baseline n-a; E1-E9 mang từ round 1, baseline n-a.

Eval không-phân-biệt (green trên cả HEAD lẫn baseline, ghi từ round 1): E8 (AC-5, lệnh gộp từng PR với hồ sơ không mặc-ký giữ nguyên phán quyết). Đây là regression-guard có chủ ý: nó khẳng định hành vi cũ KHÔNG đổi, nên green-cả-hai-phía là đúng thiết kế.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1-E9 đều PASS; hồ sơ ghi lượt chấm đầu.
Round 2: thêm E10 (AC-8, bộ đột biến mười ca, bản nguyên vẹn xanh, mỗi đột biến làm đỏ đúng ca) — PASS; E1-E9 carry-forward từ round 1 vì delta không chạm paths của chúng; các lệnh suite chạy lại, xanh.
