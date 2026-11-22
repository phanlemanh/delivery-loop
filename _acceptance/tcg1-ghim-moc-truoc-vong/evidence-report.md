---
schema_version: 2
feature_slug: tcg1-ghim-moc-truoc-vong
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f26e8add2a25ba8a041784dad8a12e79904b3b5d
human_signoff:
---

# Evidence Report: tcg1-ghim-moc-truoc-vong

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-tcg1-ghim-moc-truoc-vong-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh
  verified_at: 2026-11-22T06:41:05Z
  output: |
    cmd: bash _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh ghim
    KET QUA: ghim dat

- eval: E2
  run_id: minted-tcg1-ghim-moc-truoc-vong-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh
  verified_at: 2026-11-22T06:41:05Z
  output: |
    cmd: bash _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh dot
    KET QUA: dot dat

- eval: E3
  run_id: minted-tcg1-ghim-moc-truoc-vong-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh
  verified_at: 2026-11-22T06:41:05Z
  output: |
    cmd: bash _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh vang
    KET QUA: vang dat

- eval: E4
  run_id: minted-tcg1-ghim-moc-truoc-vong-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh
  verified_at: 2026-11-22T06:41:05Z
  output: |
    cmd: bash _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh thong-diep
    KET QUA: thong-diep dat

- eval: E5
  run_id: minted-tcg1-ghim-moc-truoc-vong-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh
  verified_at: 2026-11-22T06:41:05Z
  output: |
    cmd: bash _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh hat-giong
    KET QUA: hat-giong dat

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-tcg1-ghim-moc-truoc-vong-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-22T06:41:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-tcg1-ghim-moc-truoc-vong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-22T06:41:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-tcg1-ghim-moc-truoc-vong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-22T06:41:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-tcg1-ghim-moc-truoc-vong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-22T06:41:05Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-tcg1-ghim-moc-truoc-vong-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-22T06:41:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tcg1-ghim-moc-truoc-vong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-22T06:41:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tcg1-ghim-moc-truoc-vong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-22T06:41:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tcg1-ghim-moc-truoc-vong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-22T06:41:05Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-tcg1-ghim-moc-truoc-vong-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-22T06:41:05Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-tcg1-ghim-moc-truoc-vong-SUITE-node_plugins_acceptance_gate_scripts_pro-r1
  exit_code: 0
  verified_at: 2026-11-22T06:41:05Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-tcg1-ghim-moc-truoc-vong-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-22T06:41:05Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval tính năng nào xanh ở cả hai phía, vì baseline không đo được cho cả năm eval (xem bên dưới); chưa có bằng chứng so với mã cũ ở mức eval.

Baseline khong do:
- bash _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh ghim: bo qua baseline: tep _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh dot: bo qua baseline: tep _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh vang: bo qua baseline: tep _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh thong-diep: bo qua baseline: tep _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh hat-giong: bo qua baseline: tep _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh co o cay dang kiem nhung chua co o merge-base 678572f02f89dff349fc0d78471433cb190e8dcc — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E5 đều đạt, không eval nào hỏng; verdict PASS.
