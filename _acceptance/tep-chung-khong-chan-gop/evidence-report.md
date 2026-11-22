---
schema_version: 2
feature_slug: tep-chung-khong-chan-gop
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a301495ef8ddc2b5f7b5dd85a02352887c939938
human_signoff:
---

# Evidence Report: tep-chung-khong-chan-gop

Vòng 2. Mọi eval của hợp đồng đều xanh, nhưng một lệnh suite hồi quy không gắn eval nào (nhóm `vung:3` của `tests/plugins/run-tests.sh`) đỏ ở ca P177, nên kết luận chung là REJECT. Lệnh đó không thuộc eval nào nên `failed_evals` để trống.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS (carry-forward từ vòng 1) |
| E8 | AC-8 | script | PASS (carry-forward từ vòng 1) |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E11 | AC-11 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-tep-chung-khong-chan-gop-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T00:41:05Z
  output: |
    chay.sh: TCG-1 xanh — 2/2 ca

- eval: E2
  run_id: minted-tep-chung-khong-chan-gop-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T00:41:05Z
  output: |
    chay.sh: TCG-2 xanh — 5/5 ca

- eval: E3
  run_id: minted-tep-chung-khong-chan-gop-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T00:41:05Z
  output: |
    chay.sh: TCG-3 xanh — 4/4 ca

- eval: E4
  run_id: minted-tep-chung-khong-chan-gop-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T00:41:05Z
  output: |
    chay.sh: TCG-4 xanh — 3/3 ca

- eval: E5
  run_id: minted-tep-chung-khong-chan-gop-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T00:41:05Z
  output: |
    chay.sh: TCG-5 xanh — 5/5 ca

- eval: E6
  run_id: minted-tep-chung-khong-chan-gop-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T00:41:05Z
  output: |
    chay.sh: TCG-6 xanh — 2/2 ca

- eval: E7
  run_id: minted-tep-chung-khong-chan-gop-E7-r1
  exit_code: 0
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-tep-chung-khong-chan-gop-E8-r1
  exit_code: 0
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-21T23:22:14Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-tep-chung-khong-chan-gop-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T00:41:05Z
  output: |
    chay.sh: TCG-9 xanh — 6/6 ca

- eval: E11
  run_id: minted-tep-chung-khong-chan-gop-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T00:41:05Z
  output: |
    chay.sh: TCG-11 xanh — 6/6 ca

- eval: E10
  run_id: minted-tep-chung-khong-chan-gop-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tep-chung-khong-chan-gop/rang/chay.sh
  verified_at: 2026-11-22T00:41:05Z
  output: |
    chay.sh: TCG-10 xanh — 18/18 ca

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-22T00:41:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-22T00:41:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-22T00:41:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-22T00:41:05Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-22T00:41:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-22T00:41:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-22T00:41:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-11-22T00:41:05Z
  output: |
    FAIL: P177 [MBC] E4 references measure-birth.md: resolver goc-trong-cay-kiem + 4 muc + 2 mau + banh coc bang<->so
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-tep-chung-khong-chan-gop-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-22T00:41:05Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-tep-chung-khong-chan-gop-SUITE-node_plugins_acceptance_gate_scripts_pro-r2
  exit_code: 0
  verified_at: 2026-11-22T00:41:05Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-tep-chung-khong-chan-gop-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-22T00:41:05Z

Lệnh fail không gắn eval: nhóm `vung:3` của `tests/plugins/run-tests.sh` (ca P177 [MBC] E4, tham chiếu measure-birth.md). Không eval nào của hợp đồng sở hữu lệnh này; đây là căn cứ REJECT của vòng 2.

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Baseline khong do
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-1: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-2: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-3: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-4: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-5: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-6: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-9: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-11: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh TCG-10: bo qua baseline: tep _acceptance/tep-chung-khong-chan-gop/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 50840764d39b317d02eb4d881917bd128d67c86f — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: các eval E1–E11 được chạy ở vòng 1 và dẫn tới các sửa ở vòng 1 (VC8, ghim thông điệp nhát tiêm, nhánh mặc định của lệnh đẩy).
Round 2: E1–E6, E9, E10, E11 chạy lại và xanh; E7, E8 carry-forward từ vòng 1 (delta không chạm paths). Nhóm suite `vung:3` đỏ ở ca P177 nên verdict REJECT. Trả về để triển khai.
