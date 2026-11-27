---
schema_version: 2
feature_slug: bang-chung-cu-theo-dau-vao
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: dceb27d711e0b266d3f1a902d822f57800f5fe60
human_signoff:
---

# Evidence Report: bang-chung-cu-theo-dau-vao

Lượt chấm 2. Cả tám eval của hợp đồng đều đạt, nhưng một lệnh suite không gắn eval nào đỏ (`vung:3`, ca P179), nên verdict tổng là REJECT. Chi tiết ở mục «Lệnh suite (hồi quy)».

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
  output: |
    AC-1: đạt — 3 ca

- eval: E2
  run_id: minted-bang-chung-cu-theo-dau-vao-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T17:14:48Z
  output: |
    AC-2: đạt — 4 ca

- eval: E3
  run_id: minted-bang-chung-cu-theo-dau-vao-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T17:14:48Z
  output: |
    AC-3: đạt — 3 ca

- eval: E4
  run_id: minted-bang-chung-cu-theo-dau-vao-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T17:14:48Z
  output: |
    AC-4: đạt — 2 ca

- eval: E5
  run_id: minted-bang-chung-cu-theo-dau-vao-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T17:14:48Z
  output: |
    AC-5: đạt — 7 ca

- eval: E6
  run_id: minted-bang-chung-cu-theo-dau-vao-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T17:14:48Z
  output: |
    AC-6: đạt — 2 ca

- eval: E7
  run_id: minted-bang-chung-cu-theo-dau-vao-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T17:14:48Z
  output: |
    AC-7: chiều đỏ đỏ đúng

- eval: E8
  run_id: minted-bang-chung-cu-theo-dau-vao-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T17:14:48Z
  output: |
    AC-8: đạt — 3 ca

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-26T17:14:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-26T17:14:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-26T17:14:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-26T17:14:48Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-26T17:14:48Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-26T17:14:48Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-26T17:14:48Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-11-26T17:14:48Z
  output: |
    FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-26T17:14:48Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-node_plugins_acceptance_gate_scripts_pro-r2
  exit_code: 0
  verified_at: 2026-11-26T17:14:48Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-26T17:14:48Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Không có eval nào được liệt kê là không-phân-biệt. Lệnh suite xanh-cả-hai-phía là regression-guard bình thường, không liệt kê.

Lệnh fail không gắn eval: `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 ...'` (ca P179 «[MBC] E6 ledger known-limits», kèm dòng MUTANT-6 về doc_manifest() thiếu số bản ở feature-loop/skills/feature-loop/SKILL.md). Không eval nào phủ lệnh này, nên `failed_evals` để trống; lệnh đỏ là lý do duy nhất của REJECT.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: bốn lệnh suite đỏ, REJECT. Năm ca hồi quy đã sửa ở commit dceb27d7.
Round 2: tám eval của hợp đồng đạt; lệnh suite vung:3 đỏ ở ca P179 (E6 ledger known-limits). REJECT, trả về triển khai.
