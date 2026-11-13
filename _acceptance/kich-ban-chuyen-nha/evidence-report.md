---
schema_version: 2
feature_slug: kich-ban-chuyen-nha
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b28c2419087300f44df1ce2715c307c7373a3dab
human_signoff:
---

# Evidence Report: kich-ban-chuyen-nha

Round 2. Lý do REJECT: mọi eval máy của hợp đồng đều xanh, nhưng ba lệnh suite hồi quy không gắn eval nào đỏ (mjs:3/3, plugins vung:2, plugins vung:3), và phán quyết E10j chưa chốt. Không có eval nào trong `failed_evals`; ba lệnh đỏ nằm ở mục «Lệnh suite (hồi quy)» bên dưới.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E1t | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E2t | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E3t | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E4t | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E5t | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E7t | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E8t | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E10j | AC-10 | judgment | UNCERTAIN |

## Evidence

- eval: E1
  run_id: minted-kich-ban-chuyen-nha-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 37844.111667
    __EXIT=0

- eval: E2
  run_id: minted-kich-ban-chuyen-nha-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 37844.111667
    __EXIT=0

- eval: E3
  run_id: minted-kich-ban-chuyen-nha-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 37844.111667
    __EXIT=0

- eval: E4
  run_id: minted-kich-ban-chuyen-nha-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 37844.111667
    __EXIT=0

- eval: E5
  run_id: minted-kich-ban-chuyen-nha-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 37844.111667
    __EXIT=0

- eval: E7
  run_id: minted-kich-ban-chuyen-nha-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 37844.111667
    __EXIT=0

- eval: E8
  run_id: minted-kich-ban-chuyen-nha-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 37844.111667
    __EXIT=0

- eval: E9
  run_id: minted-kich-ban-chuyen-nha-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 37844.111667
    __EXIT=0

- eval: E1t
  run_id: minted-kich-ban-chuyen-nha-E1t-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node migration/kich-ban/thuoc-that.mjs
    doctor: 83/100 · plugin_source_not_root đạt
    __EXIT=0

- eval: E2t
  run_id: minted-kich-ban-chuyen-nha-E2t-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node migration/kich-ban/thuoc-that.mjs
    doctor: 83/100 · plugin_source_not_root đạt
    __EXIT=0

- eval: E3t
  run_id: minted-kich-ban-chuyen-nha-E3t-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node migration/kich-ban/thuoc-that.mjs
    doctor: 83/100 · plugin_source_not_root đạt
    __EXIT=0

- eval: E4t
  run_id: minted-kich-ban-chuyen-nha-E4t-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node migration/kich-ban/thuoc-that.mjs
    doctor: 83/100 · plugin_source_not_root đạt
    __EXIT=0

- eval: E5t
  run_id: minted-kich-ban-chuyen-nha-E5t-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node migration/kich-ban/thuoc-that.mjs
    doctor: 83/100 · plugin_source_not_root đạt
    __EXIT=0

- eval: E7t
  run_id: minted-kich-ban-chuyen-nha-E7t-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node migration/kich-ban/thuoc-that.mjs
    doctor: 83/100 · plugin_source_not_root đạt
    __EXIT=0

- eval: E8t
  run_id: minted-kich-ban-chuyen-nha-E8t-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node migration/kich-ban/thuoc-that.mjs
    doctor: 83/100 · plugin_source_not_root đạt
    __EXIT=0

- eval: E6
  run_id: minted-kich-ban-chuyen-nha-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_phien
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node migration/kich-ban/thuoc-that.mjs --phien
    AC-6 đạt: không mất không thừa sau đổi tên, mọi plugin của chợ mới qua lớp tĩnh và lớp cài
    __EXIT=0

- eval: E10
  run_id: minted-kich-ban-chuyen-nha-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_lop_do
  verified_at: 2026-11-13T13:57:19Z
  output: |
    node migration/kich-ban/thuoc-that.mjs --lop-do
    theo lớp: bo-chay 2 · cung-tep 493 · duong-dan 1031 · khac 233 · lich-su 0 · ten-doi 31
    __EXIT=0

### Judgment

- eval: E10j
  judged_by: judge-subagent (fresh context), hội đồng ba lens
  verdict: UNCERTAIN
  rationale: Ba lens đều UNCERTAIN. Báo cáo lớp đỏ đủ ba số mỗi bộ, các lớp cộng đúng 1790, ca đỏ ở cả hai cây được tách riêng, lớp «khác» là 233/1790 (13%) trên tổng nhưng 109/157 (69%) ở bộ plugins, và cả ba dòng mẫu «khác» đều của scripts nên người làm B2 không nhận ra nguyên nhân cho plugins/hooks. Tiêu chí «không nuốt phần lớn» chưa nói tính theo tổng hay theo từng bộ.
  required_evidence:
    - Chốt cách đọc «không nuốt phần lớn» (theo tổng hay theo từng bộ) ở AC-10 trong _acceptance/kich-ban-chuyen-nha/contract.md. Theo tổng (13%) thì đạt; theo từng bộ thì plugins 109/157 không đạt.
    - Dòng mẫu lớp «khác» lấy từ chính bộ plugins (109 ca) và hooks (15 ca), đủ dài để thấy nguyên nhân, đưa vào migration/kich-ban/ket-qua/lop-do.md từ nhật ký lượt đo của migration/kich-ban/do-lop-do.sh. Ba dòng mẫu hiện có (DG-CC1/2/3) đều thuộc scripts và bị cắt ngay sau mã thoát.
  human_override:  # chi nguoi ghi

Phiếu từng lens:

- domain-correctness: UNCERTAIN — tiêu chí có hai cách đọc, đủ ba số và tổng khớp nhưng thiếu mẫu cho plugins/hooks.
- operational-feasibility: UNCERTAIN — cần chủ vòng chốt cách tính, hoặc dòng mẫu «khác» của plugins và hooks.
- spec-alignment: UNCERTAIN — hợp đồng AC-10 không nêu ngưỡng; cần phán định tổng-hay-từng-bộ hoặc dòng mẫu riêng cho plugins.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-13T13:57:19Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-13T13:57:19Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-13T13:57:19Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 1
  verified_at: 2026-11-13T13:57:19Z
  output: |
    Results: 42 passed, 1 failed
    Đuôi nhật ký chỉ còn các ca PASS (vong-meta-dang-mo, xuat-du-qua-pipe); dòng FAIL của ca đỏ không nằm trong đuôi đã giữ.

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-13T13:57:19Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-13T13:57:19Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 1
  verified_at: 2026-11-13T13:57:19Z
  output: |
    FAIL: P161 strip-md giu duong dan + ma tran toan phan
    Results: 1 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-11-13T13:57:19Z
  output: |
    FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=
    Results: 1 failed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-13T13:57:19Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-kich-ban-chuyen-nha-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-13T13:57:19Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-kich-ban-chuyen-nha-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-13T13:57:19Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều không có baseline để so (baseline n-a), nên không eval nào được chứng minh là không-phân-biệt; không có eval xanh-cả-hai-phía.

Lệnh fail không gắn eval: `bash tests/scripts/run-tests.sh --manh mjs:3/3`, `bash -c '… tests/plugins/run-tests.sh --manh vung:2 …'` (ca P161), `bash -c '… tests/plugins/run-tests.sh --manh vung:3 …'` (ca P179). Cần người xác định ba ca đỏ này là hồi quy của vòng hay đỏ sẵn ở nguồn.

Baseline khong do:
- node --test migration/kich-ban/don-nha.test.mjs: bo qua baseline: tep migration/kich-ban/don-nha.test.mjs co o cay dang kiem nhung chua co o merge-base 8f5cefdef1f4924979104203f558bff797696824 — eval moi, chay tren code cu khong phan biet gi
- node migration/kich-ban/thuoc-that.mjs: bo qua baseline: tep migration/kich-ban/thuoc-that.mjs co o cay dang kiem nhung chua co o merge-base 8f5cefdef1f4924979104203f558bff797696824 — eval moi, chay tren code cu khong phan biet gi
- node migration/kich-ban/thuoc-that.mjs --phien: bo qua baseline: tep migration/kich-ban/thuoc-that.mjs co o cay dang kiem nhung chua co o merge-base 8f5cefdef1f4924979104203f558bff797696824 — eval moi, chay tren code cu khong phan biet gi
- node migration/kich-ban/thuoc-that.mjs --lop-do: bo qua baseline: tep migration/kich-ban/thuoc-that.mjs co o cay dang kiem nhung chua co o merge-base 8f5cefdef1f4924979104203f558bff797696824 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: BLOCKED — tác tử chấm chạy Node 26 thay vì Node 24; sửa 5 finding trong hợp đồng, thước thật chạy lần lượt dưới khoá.
Round 2: mọi eval máy xanh; ba lệnh suite hồi quy đỏ (mjs:3/3, vung:2 ca P161, vung:3 ca P179) và E10j chưa chốt. Một finding trong hợp đồng (AC-7, phép quét con trỏ tương đối). Verdict REJECT, trả về triển khai.
