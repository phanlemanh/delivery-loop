---
schema_version: 2
feature_slug: bang-chung-cu-theo-dau-vao
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 17fddf0a4d837fd6b83621c2629f36097cfd5963
human_signoff:
---

# Evidence Report: bang-chung-cu-theo-dau-vao

Vòng 1. Cả tám eval của hợp đồng đều xanh, nhưng bốn lệnh suite hồi quy không gắn eval nào đỏ nên verdict tổng là REJECT. Bốn lệnh đó: `bash tests/scripts/run-tests.sh --manh mjs:1/3`, `bash tests/scripts/run-tests.sh --manh mjs:2/3`, lệnh vùng 3 của `tests/plugins/run-tests.sh` và `bash tests/workflows/run-tests.sh`. Chi tiết ở mục Evidence (Lệnh suite) và Iterations.

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
  run_id: minted-bang-chung-cu-theo-dau-vao-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T16:00:38Z
  output: |
    AC-1: đạt — 3 ca

- eval: E2
  run_id: minted-bang-chung-cu-theo-dau-vao-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T16:00:38Z
  output: |
    AC-2: đạt — 4 ca

- eval: E3
  run_id: minted-bang-chung-cu-theo-dau-vao-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T16:00:38Z
  output: |
    AC-3: đạt — 3 ca

- eval: E4
  run_id: minted-bang-chung-cu-theo-dau-vao-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T16:00:38Z
  output: |
    AC-4: đạt — 2 ca

- eval: E5
  run_id: minted-bang-chung-cu-theo-dau-vao-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T16:00:38Z
  output: |
    AC-5: đạt — 7 ca

- eval: E6
  run_id: minted-bang-chung-cu-theo-dau-vao-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T16:00:38Z
  output: |
    AC-6: đạt — 2 ca

- eval: E7
  run_id: minted-bang-chung-cu-theo-dau-vao-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T16:00:38Z
  output: |
    AC-7: chiều đỏ đỏ đúng

- eval: E8
  run_id: minted-bang-chung-cu-theo-dau-vao-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh
  verified_at: 2026-11-26T16:00:38Z
  output: |
    AC-8: đạt — 3 ca

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-26T16:00:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 1
  verified_at: 2026-11-26T16:00:38Z
  note: 47 đạt, 1 đỏ — ca đỏ «T04 mot-nguon — chân bảng bộ máy: ca thường trực lớp-cũ của làn xanh với mọi export mới», kèm «GL03 ma trận xoá-export × hai hồ sơ». Lệnh này không gắn eval nào.

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 1
  verified_at: 2026-11-26T16:00:38Z
  note: 45 đạt, 2 đỏ — ca đỏ «GL03 ma trận xoá-export × hai hồ sơ (G so byte · N có tên) + quan hệ tên dùng ⊆ bảng», lý do «quan he: quotepath khong co hang trong AG-ENGINE-TABLE». Lệnh này không gắn eval nào.

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-26T16:00:38Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-26T16:00:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-26T16:00:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-26T16:00:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-11-26T16:00:38Z
  note: 1 đỏ — «[RT13] file lạ chứa "signed-off": tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs — thêm ca, hoặc khai gạch có lý do trong khối BO-DOC-KHAI-GACH» (hồ sơ ra-co-ten-lam-va-trao). Lệnh này không gắn eval nào.

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 1
  verified_at: 2026-11-26T16:00:38Z
  note: bộ workflow báo «workflow tests FAILED»; phần đuôi đã lưu chỉ cho thấy vung-vat-mutants 15 đạt, ca đỏ cụ thể nằm ngoài đoạn đuôi. Lệnh này không gắn eval nào.

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-node_plugins_acceptance_gate_scripts_pro-r1
  exit_code: 0
  verified_at: 2026-11-26T16:00:38Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-bang-chung-cu-theo-dau-vao-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-26T16:00:38Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều không có bản baseline để so (xem «Baseline khong do» bên dưới), không eval nào được xác nhận là không-phân-biệt.

Baseline khong do:
- bash _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh AC-1: bo qua baseline: tep _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 8817a5bf9e3df3ae4a3e558c37715002bc830c7c — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh AC-2: bo qua baseline: tep _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 8817a5bf9e3df3ae4a3e558c37715002bc830c7c — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh AC-3: bo qua baseline: tep _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 8817a5bf9e3df3ae4a3e558c37715002bc830c7c — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh AC-4: bo qua baseline: tep _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 8817a5bf9e3df3ae4a3e558c37715002bc830c7c — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh AC-5: bo qua baseline: tep _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 8817a5bf9e3df3ae4a3e558c37715002bc830c7c — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh AC-6: bo qua baseline: tep _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 8817a5bf9e3df3ae4a3e558c37715002bc830c7c — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh AC-7: bo qua baseline: tep _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 8817a5bf9e3df3ae4a3e558c37715002bc830c7c — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh AC-8: bo qua baseline: tep _acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 8817a5bf9e3df3ae4a3e558c37715002bc830c7c — eval moi, chay tren code cu khong phan biet gi

Lệnh fail không gắn eval (nêu rõ vì là nguyên nhân của verdict REJECT): `bash tests/scripts/run-tests.sh --manh mjs:1/3`, `bash tests/scripts/run-tests.sh --manh mjs:2/3`, lệnh vùng 3 của `tests/plugins/run-tests.sh` (RT13), `bash tests/workflows/run-tests.sh`.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval nào của hợp đồng đỏ (E1–E8 đều đạt), nhưng bốn lệnh suite hồi quy không gắn eval đỏ — mjs:1/3 (T04/GL03), mjs:2/3 (GL03, thiếu hàng quotepath trong AG-ENGINE-TABLE), vùng 3 (RT13: tệp ca mới chứa «signed-off» chưa khai trong BO-DOC-KHAI-GACH), bộ workflow. Returned to implementation.
