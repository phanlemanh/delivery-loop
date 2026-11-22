---
schema_version: 2
feature_slug: tep-chung-khong-chan-gop
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 50681b6e7c6eaf8946fc14e2555a649a61ba40bf
human_signoff:
---

# Evidence Report: tep-chung-khong-chan-gop

Round 1. Mười một eval của hợp đồng đều xanh. Verdict là REJECT vì một lệnh suite không gắn eval nào chạy đỏ: `tests/plugins/run-tests.sh --manh vung:3` (ca VC8 «hạt giống không ô», xem mục Lệnh suite).

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
  run_id: minted-tep-chung-khong-chan-gop-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  output: |
    chay.sh: TCG-1 xanh — 2/2 ca

- eval: E2
  run_id: minted-tep-chung-khong-chan-gop-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  output: |
    chay.sh: TCG-2 xanh — 5/5 ca

- eval: E3
  run_id: minted-tep-chung-khong-chan-gop-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  output: |
    chay.sh: TCG-3 xanh — 4/4 ca

- eval: E4
  run_id: minted-tep-chung-khong-chan-gop-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  output: |
    chay.sh: TCG-4 xanh — 3/3 ca

- eval: E5
  run_id: minted-tep-chung-khong-chan-gop-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  output: |
    chay.sh: TCG-5 xanh — 5/5 ca

- eval: E6
  run_id: minted-tep-chung-khong-chan-gop-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  output: |
    chay.sh: TCG-6 xanh — 2/2 ca

- eval: E7
  run_id: minted-tep-chung-khong-chan-gop-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  output: |
    chay.sh: TCG-7 xanh — 2/2 ca

- eval: E8
  run_id: minted-tep-chung-khong-chan-gop-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  output: |
    chay.sh: TCG-8 xanh — 4/4 ca

- eval: E9
  run_id: minted-tep-chung-khong-chan-gop-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  output: |
    chay.sh: TCG-9 xanh — 6/6 ca

- eval: E10
  run_id: minted-tep-chung-khong-chan-gop-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  output: |
    chay.sh: TCG-10 xanh — 18/18 ca

- eval: E11
  run_id: minted-tep-chung-khong-chan-gop-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  output: |
    chay.sh: TCG-11 xanh — 6/6 ca

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-21T23:22:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-21T23:22:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: bgj23wukm
  exit_code: 0
  verified_at: 2026-11-21T23:22:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-21T23:22:14Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-21T23:22:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-21T23:22:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-21T23:22:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-11-21T23:22:14Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    FAIL: [VC8] hạt giống không ô: 2026-11-21-hat-giong-dong-giu-co-trai-bo-xep-can-cu.md
      FAIL: ca vao co o — VC8 (ho so vao-co-o-ra-co-ten)
    Results: 1 failed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-21T23:22:14Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-tep-chung-khong-chan-gop-SUITE-node_plugins_acceptance_gate_scripts_pro-r1
  exit_code: 0
  verified_at: 2026-11-21T23:22:14Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-tep-chung-khong-chan-gop-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-21T23:22:14Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Lệnh fail không gắn eval: `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'` (không eval nào gắn). Đó là nguyên nhân của REJECT: ca VC8 «hạt giống không ô» đòi hạt giống `2026-11-21-hat-giong-dong-giu-co-trai-bo-xep-can-cu.md` trỏ được về một ô.

### Baseline khong do

- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-1: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-2: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-3: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-4: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-5: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-6: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-7: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-8: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-9: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-11: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-10: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval nào của hợp đồng đỏ (E1–E11 xanh); lệnh suite vung:3 đỏ ở ca VC8 «hạt giống không ô» cho hạt giống 2026-11-21-hat-giong-dong-giu-co-trai-bo-xep-can-cu.md. Returned to implementation.
