---
schema_version: 2
feature_slug: dac-ta-ux-doc-so-man
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 94b4b431ab0215ccd39a696b28e80aeaa690e07b
human_signoff:
---

# Evidence Report: dac-ta-ux-doc-so-man

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
| E10 | AC-10 | script | PASS |
| E11 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-dac-ta-ux-doc-so-man-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh
  verified_at: 2026-11-23T00:14:34Z
  output: |
    chay.sh AC-1: đạt (D1,D2,D7,D8)

- eval: E2
  run_id: minted-dac-ta-ux-doc-so-man-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh
  verified_at: 2026-11-23T00:14:34Z
  output: |
    chay.sh AC-2: đạt (D6)

- eval: E3
  run_id: minted-dac-ta-ux-doc-so-man-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh
  verified_at: 2026-11-23T00:14:34Z
  output: |
    chay.sh AC-3: đạt (B6,D4,L7,L8)

- eval: E4
  run_id: minted-dac-ta-ux-doc-so-man-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh
  verified_at: 2026-11-23T00:14:34Z
  output: |
    chay.sh AC-4: đạt (K1,K2,K3,K4,K5,K6,K7,K8,K9,K10,K11)

- eval: E5
  run_id: minted-dac-ta-ux-doc-so-man-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh
  verified_at: 2026-11-23T00:14:34Z
  output: |
    chay.sh AC-5: đạt (H1,H2,H3,H4,H5,H6,H7,H8,H9,H10,H11,H12,H13)

- eval: E6
  run_id: minted-dac-ta-ux-doc-so-man-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh
  verified_at: 2026-11-23T00:14:34Z
  output: |
    chay.sh AC-6: đạt (S1,S2,S3,S4,S5,S6,S7,S8,S9,S10)

- eval: E7
  run_id: minted-dac-ta-ux-doc-so-man-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh
  verified_at: 2026-11-23T00:14:34Z
  output: |
    chay.sh AC-7: đạt (B1,B2,B3,B4,B5,B7,B8,B9,B10,B11,D3,D5,D9)

- eval: E8
  run_id: minted-dac-ta-ux-doc-so-man-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh
  verified_at: 2026-11-23T00:14:34Z
  output: |
    chay.sh AC-8: đạt (L1,L2,L3,L4,L5,L6,L9,L10)

- eval: E9
  run_id: minted-dac-ta-ux-doc-so-man-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh
  verified_at: 2026-11-23T00:14:34Z
  output: |
    chay.sh AC-9: đạt (W1,W2,W3)

- eval: E10
  run_id: minted-dac-ta-ux-doc-so-man-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dac-ta-ux-doc-so-man/rang/dot-bien.mjs
  verified_at: 2026-11-23T00:14:34Z
  output: |
    dot-bien: 38/38 nhát đỏ đúng ca, bản nguyên vẹn xanh, chiều im xanh

- eval: E11
  run_id: minted-dac-ta-ux-doc-so-man-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh
  verified_at: 2026-11-23T00:14:34Z
  output: |
    chay.sh AC-10: đạt (F1)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-dac-ta-ux-doc-so-man-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-23T00:14:34Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: bxs8k8zxl
  exit_code: 0
  verified_at: 2026-11-23T00:14:34Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-dac-ta-ux-doc-so-man-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-23T00:14:34Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-dac-ta-ux-doc-so-man-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-23T00:14:34Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-dac-ta-ux-doc-so-man-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-23T00:14:34Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dac-ta-ux-doc-so-man-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-23T00:14:34Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dac-ta-ux-doc-so-man-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-23T00:14:34Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dac-ta-ux-doc-so-man-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-23T00:14:34Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-dac-ta-ux-doc-so-man-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-23T00:14:34Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-dac-ta-ux-doc-so-man-SUITE-node_plugins_acceptance_gate_scripts_pro-r1
  exit_code: 0
  verified_at: 2026-11-23T00:14:34Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-dac-ta-ux-doc-so-man-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-23T00:14:34Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào xanh ở cả hai phía; baseline của các eval feature không đo được (xem dưới), nên không có căn cứ kết luận «không phân biệt».

Baseline khong do

- bash _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh AC-1: bo qua baseline: tep _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 0a93a5b95f3d35b29ffefc6da2b2ad0fa5e96e0d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh AC-2: bo qua baseline: tep _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 0a93a5b95f3d35b29ffefc6da2b2ad0fa5e96e0d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh AC-3: bo qua baseline: tep _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 0a93a5b95f3d35b29ffefc6da2b2ad0fa5e96e0d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh AC-4: bo qua baseline: tep _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 0a93a5b95f3d35b29ffefc6da2b2ad0fa5e96e0d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh AC-5: bo qua baseline: tep _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 0a93a5b95f3d35b29ffefc6da2b2ad0fa5e96e0d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh AC-6: bo qua baseline: tep _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 0a93a5b95f3d35b29ffefc6da2b2ad0fa5e96e0d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh AC-7: bo qua baseline: tep _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 0a93a5b95f3d35b29ffefc6da2b2ad0fa5e96e0d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh AC-8: bo qua baseline: tep _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 0a93a5b95f3d35b29ffefc6da2b2ad0fa5e96e0d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh AC-9: bo qua baseline: tep _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 0a93a5b95f3d35b29ffefc6da2b2ad0fa5e96e0d — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dac-ta-ux-doc-so-man/rang/dot-bien.mjs: bo qua baseline: tep _acceptance/dac-ta-ux-doc-so-man/rang/dot-bien.mjs co o cay dang kiem nhung chua co o merge-base 0a93a5b95f3d35b29ffefc6da2b2ad0fa5e96e0d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh AC-10: bo qua baseline: tep _acceptance/dac-ta-ux-doc-so-man/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 0a93a5b95f3d35b29ffefc6da2b2ad0fa5e96e0d — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval và lệnh suite đều xanh; không có eval hỏng, không có mục chờ người chốt.
