---
schema_version: 2
feature_slug: doi-ten-ban-uy-quyen
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8c3b871f2a52ad413abc896372f1034827a0b8f7
human_signoff: Phan Le Manh 2026-11-28
---

# Evidence Report: doi-ten-ban-uy-quyen

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-doi-ten-ban-uy-quyen-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-28T00:22:06Z
  output: |
    chay.sh AC-1: đạt (4 ca TA · DL6 AC-2 AC-4)

- eval: E2
  run_id: minted-doi-ten-ban-uy-quyen-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-28T00:22:06Z
  output: |
    chay.sh AC-2: đạt (4 ca TA · DL6 )

- eval: E3
  run_id: minted-doi-ten-ban-uy-quyen-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-28T00:22:06Z
  output: |
    chay.sh AC-3: đạt (0 ca TA · DL6 AC-3 AC-2)

- eval: E4
  run_id: minted-doi-ten-ban-uy-quyen-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-28T00:22:06Z
  output: |
    chay.sh AC-4: đạt (2 ca TA · DL6 AC-5)

- eval: E5
  run_id: minted-doi-ten-ban-uy-quyen-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-28T00:22:06Z
  output: |
    chay.sh AC-5: đạt (0 ca TA · DL6 AC-1)

- eval: E6
  run_id: minted-doi-ten-ban-uy-quyen-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-28T00:22:06Z
  output: |
    chay.sh AC-6: đạt (0 ca TA · DL6 AC-6 AC-7 AC-8 AC-9 AC-10)

- eval: E7
  run_id: minted-doi-ten-ban-uy-quyen-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-28T00:22:06Z
  output: |
    chay.sh AC-7: đạt (3 ca TA · DL6 )

- eval: E8
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Ba thấu kính đều chấm đạt cả bốn điều của AC-8 (chỉ dẫn dùng tên mới, trình nghĩa tiếng Việt, ADR 0030 có mục «Sửa 28/11», không từ _Avoid_ hay chi tiết riêng của một kho).
  panel_proposal: PASS
  votes:
    - domain-correctness: PASS — Cả bốn chỉ dẫn dùng tên mới. LUAT.md dòng 118 ghi «`delegated: [merge, merge-order]`». README dòng 295 ghi «`version: 1`, `delegated: [<quyền>, …]`». Tên cũ chỉ xuất hiện ở README dòng 301 như tên bị từ chối; `gop`, `thu-tu-gop`, `dung-quyen`, `chuyen-hang` giữ nguyên vì là tên lệnh hoặc sự kiện. open.md dòng 40-41 và close.md dòng 29-31 dặn trình nghĩa tiếng Việt kèm tên tiếng Anh trong ngoặc. ADR 0030 có mục «Sửa 28/11» với bảng tên mới và dòng «Tệp mang tên cũ bị từ chối cả tệp»; Quyết định 1–5 giữ nguyên. CONTEXT.md không có mục «bản uỷ quyền» nên không từ Avoid nào bị vướng; không có chi tiết riêng của một kho trong bốn chỉ dẫn.
    - operational-feasibility: PASS — Bốn chỉ dẫn chỉ dùng tên mới; các tên giữ lại đều là tên lệnh, sự kiện hoặc khoá của thẻ mở đợt. open.md và close.md dặn trình nghĩa tiếng Việt kèm tên tiếng Anh trong ngoặc. ADR có mục «Sửa 28/11» mà không viết lại Quyết định 1–5. Không thấy từ _Avoid_ nào bị dùng, không thấy chi tiết riêng của một kho tiêu thụ.
    - spec-alignment: PASS — Cả bốn điều đạt: chỉ dẫn dùng tên mới; open.md và close.md bắt trình nghĩa tiếng Việt; ADR 0030 có mục «Sửa 28/11» và Quyết định 1–5 giữ nguyên; không từ _Avoid_ nào bị dùng như chữ cho người, không có chi tiết riêng của một kho.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-doi-ten-ban-uy-quyen-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-28T00:22:06Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-doi-ten-ban-uy-quyen-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-28T00:22:06Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-doi-ten-ban-uy-quyen-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-28T00:22:06Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-doi-ten-ban-uy-quyen-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-28T00:22:06Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-doi-ten-ban-uy-quyen-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-28T00:22:06Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doi-ten-ban-uy-quyen-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-28T00:22:06Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doi-ten-ban-uy-quyen-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-28T00:22:06Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doi-ten-ban-uy-quyen-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-28T00:22:06Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-doi-ten-ban-uy-quyen-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-28T00:22:06Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-doi-ten-ban-uy-quyen-SUITE-node_plugins_acceptance_gate_scripts_pro-r1
  exit_code: 0
  verified_at: 2026-11-28T00:22:06Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-doi-ten-ban-uy-quyen-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-28T00:22:06Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet) khong xac lap duoc: baseline cua bay eval may deu khong do (xem muc dưới), nen khong eval nao duoc xep non-discriminating.

### Baseline khong do

- bash _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh AC-1: bo qua baseline: tep _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base a9b7cbe6aca989d7c0ab54339e16cebc98a69a28 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh AC-2: bo qua baseline: tep _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base a9b7cbe6aca989d7c0ab54339e16cebc98a69a28 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh AC-3: bo qua baseline: tep _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base a9b7cbe6aca989d7c0ab54339e16cebc98a69a28 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh AC-4: bo qua baseline: tep _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base a9b7cbe6aca989d7c0ab54339e16cebc98a69a28 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh AC-5: bo qua baseline: tep _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base a9b7cbe6aca989d7c0ab54339e16cebc98a69a28 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh AC-6: bo qua baseline: tep _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base a9b7cbe6aca989d7c0ab54339e16cebc98a69a28 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh AC-7: bo qua baseline: tep _acceptance/doi-ten-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base a9b7cbe6aca989d7c0ab54339e16cebc98a69a28 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E7 passed, E8 judged PASS by all three lenses. No failed eval.

### Re-pin lần 1 — 2026-11-28, do chiến dịch ghim lại của mốc 3.2.0 (GUIDE mục 7.1) — năm hồ sơ của cửa sổ, sau commit nâng số
run_id: repin-20261128T071601Z-73825
sha: 8c3b871f2a52ad413abc896372f1034827a0b8f7 · suites: 11 lệnh exit 0 · evals: 7/7 eval máy đạt kỳ vọng · ngoài làn máy: E8 · AC không có chốt máy: AC-8
