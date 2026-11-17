---
schema_version: 2
feature_slug: bo-kiem-xanh-o-kho-moi
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 393093256c7da59416455160433e1fc5941ff9c6
human_signoff: Phan Le Manh 2026-11-17
---

# Evidence Report: bo-kiem-xanh-o-kho-moi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E1t | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E2t | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4t | AC-4 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E8t | AC-8 | script | PASS |
| E8s | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bo-kiem-xanh-o-kho-moi-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_kiem_xanh
  verified_at: 2026-11-17T11:06:49Z
  output: |
    ℹ duration_ms 231263.814

- eval: E2
  run_id: minted-bo-kiem-xanh-o-kho-moi-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_kiem_xanh
  verified_at: 2026-11-17T11:06:49Z
  output: |
    ℹ duration_ms 231263.814

- eval: E3
  run_id: minted-bo-kiem-xanh-o-kho-moi-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_kiem_xanh
  verified_at: 2026-11-17T11:06:49Z
  output: |
    ℹ duration_ms 231263.814

- eval: E4
  run_id: minted-bo-kiem-xanh-o-kho-moi-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_kiem_xanh
  verified_at: 2026-11-17T11:06:49Z
  output: |
    ℹ duration_ms 231263.814

- eval: E5
  run_id: minted-bo-kiem-xanh-o-kho-moi-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_kiem_xanh
  verified_at: 2026-11-17T11:06:49Z
  output: |
    ℹ duration_ms 231263.814

- eval: E6
  run_id: minted-bo-kiem-xanh-o-kho-moi-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_kiem_xanh
  verified_at: 2026-11-17T11:06:49Z
  output: |
    ℹ duration_ms 231263.814

- eval: E7
  run_id: minted-bo-kiem-xanh-o-kho-moi-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_kiem_xanh
  verified_at: 2026-11-17T11:06:49Z
  output: |
    ℹ duration_ms 231263.814

- eval: E1t
  run_id: minted-bo-kiem-xanh-o-kho-moi-E1t-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_kiem_xanh_that
  verified_at: 2026-11-17T11:06:49Z
  output: |
    đổi sót (B2): 0 mảng trộn tên gốc cũ với đường mới ngoài 2 chỗ đã khai

- eval: E2t
  run_id: minted-bo-kiem-xanh-o-kho-moi-E2t-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_kiem_xanh_that
  verified_at: 2026-11-17T11:06:49Z
  output: |
    đổi sót (B2): 0 mảng trộn tên gốc cũ với đường mới ngoài 2 chỗ đã khai

- eval: E4t
  run_id: minted-bo-kiem-xanh-o-kho-moi-E4t-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_kiem_xanh_giu_khoa
  verified_at: 2026-11-17T11:06:49Z
  output: |
    AC-4 chạy lại: bước dieu-phoi đỏ ở cả hai cây khi chạy song song (lần đầu 1 · 1), chạy lại một lần lần lượt từng cây: 0 · 0

- eval: E8
  run_id: minted-bo-kiem-xanh-o-kho-moi-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-17T11:06:49Z
  output: |
    ℹ duration_ms 228844.201041

- eval: E8t
  run_id: minted-bo-kiem-xanh-o-kho-moi-E8t-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-17T11:06:49Z
  output: |
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E8s
  run_id: minted-bo-kiem-xanh-o-kho-moi-E8s-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_kiem_xanh_do_san
  verified_at: 2026-11-17T11:06:49Z
  output: |
    KT-8: xanh

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-bo-kiem-xanh-o-kho-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-17T11:06:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-bo-kiem-xanh-o-kho-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-17T11:06:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-bo-kiem-xanh-o-kho-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-17T11:06:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-bo-kiem-xanh-o-kho-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-17T11:06:49Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-bo-kiem-xanh-o-kho-moi-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-17T11:06:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bo-kiem-xanh-o-kho-moi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-17T11:06:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bo-kiem-xanh-o-kho-moi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-17T11:06:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-bo-kiem-xanh-o-kho-moi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-11-17T11:06:49Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-bo-kiem-xanh-o-kho-moi-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-17T11:06:49Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-bo-kiem-xanh-o-kho-moi-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-17T11:06:49Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-bo-kiem-xanh-o-kho-moi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-17T11:06:49Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

### Baseline khong do

- node --test migration/kich-ban/don-nha.test.mjs migration/kich-ban/bo-kiem.test.mjs migration/kich-ban/giu-khoa.test.mjs migration/kich-ban/lop-do.test.mjs migration/kich-ban/tep-song.test.mjs: bo qua baseline: tep migration/kich-ban/bo-kiem.test.mjs co o cay dang kiem nhung chua co o merge-base 6a1b0526dda8464b666c18e29251206188ef4007 — eval moi, chay tren code cu khong phan biet gi
- node --test migration/kich-ban/don-nha.test.mjs: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- node migration/kich-ban/do-san.mjs: bo qua baseline: tep migration/kich-ban/do-san.mjs co o cay dang kiem nhung chua co o merge-base 6a1b0526dda8464b666c18e29251206188ef4007 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất

## Iterations

Round 1: Máy chạy xong và gói bằng chứng đạt, nhưng Cổng Bằng chứng trả về vì báo cáo lớp đỏ của AC-5 chưa gọi tên bộ chết ngầm ở cây cũ. Quay lại sửa.
Round 2: Đã thêm hai ca BK-AC5-do-chet-cu và BK-AC5-do-khong-do-cu; toàn bộ eval và lệnh suite đạt trên commit 393093256c7da59416455160433e1fc5941ff9c6.
