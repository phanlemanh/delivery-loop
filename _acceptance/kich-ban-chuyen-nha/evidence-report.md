---
schema_version: 2
feature_slug: kich-ban-chuyen-nha
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9d98da111a10081957dfbfd902a1ed7ccb5339ae
human_signoff: Phan Le Manh 2026-11-14 — ký lượt chấm 3; Ngoài-1…13 ghi Known limits; E10j Đạt; đồng ý phần cắt/hoãn; phê hết Treo
---

# Evidence Report: kich-ban-chuyen-nha

Round 3. Mọi eval máy và mọi lệnh suite hồi quy đều xanh. Còn một mục phán quyết (E10j) chờ người chốt ở Cổng 2, nên verdict là PENDING-JUDGMENT.

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
| E10j | AC-10 | judgment | đề xuất PASS, chờ người chốt (human_override trống) |

## Evidence

- eval: E1
  run_id: minted-kich-ban-chuyen-nha-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 144672.810584

- eval: E2
  run_id: minted-kich-ban-chuyen-nha-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 144672.810584

- eval: E3
  run_id: minted-kich-ban-chuyen-nha-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 144672.810584

- eval: E4
  run_id: minted-kich-ban-chuyen-nha-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 144672.810584

- eval: E5
  run_id: minted-kich-ban-chuyen-nha-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 144672.810584

- eval: E7
  run_id: minted-kich-ban-chuyen-nha-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 144672.810584

- eval: E8
  run_id: minted-kich-ban-chuyen-nha-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 144672.810584

- eval: E9
  run_id: minted-kich-ban-chuyen-nha-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node --test migration/kich-ban/don-nha.test.mjs
    ℹ duration_ms 144672.810584

- eval: E1t
  run_id: minted-kich-ban-chuyen-nha-E1t-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node migration/kich-ban/thuoc-that.mjs
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E2t
  run_id: minted-kich-ban-chuyen-nha-E2t-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node migration/kich-ban/thuoc-that.mjs
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E3t
  run_id: minted-kich-ban-chuyen-nha-E3t-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node migration/kich-ban/thuoc-that.mjs
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E4t
  run_id: minted-kich-ban-chuyen-nha-E4t-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node migration/kich-ban/thuoc-that.mjs
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E5t
  run_id: minted-kich-ban-chuyen-nha-E5t-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node migration/kich-ban/thuoc-that.mjs
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E7t
  run_id: minted-kich-ban-chuyen-nha-E7t-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node migration/kich-ban/thuoc-that.mjs
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E8t
  run_id: minted-kich-ban-chuyen-nha-E8t-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node migration/kich-ban/thuoc-that.mjs
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E6
  run_id: minted-kich-ban-chuyen-nha-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_phien
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node migration/kich-ban/thuoc-that.mjs --phien
    AC-6 đạt: không mất không thừa sau đổi tên, mọi plugin của chợ mới qua lớp tĩnh và lớp cài

- eval: E10
  run_id: minted-kich-ban-chuyen-nha-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_lop_do
  verified_at: 2026-11-14T04:18:52Z
  output: |
    lệnh: node migration/kich-ban/thuoc-that.mjs --lop-do
    theo lớp: bo-chay 2 · cung-tep 452 · duong-dan 1205 · khac 106 · lich-su 0 · ten-doi 22

### Phán quyết (judgment)

- eval: E10j
  judged_by: hội đồng judge-subagent (fresh context), ba lăng kính, đề xuất PASS
  proposal: PASS
  panel:
    - domain-correctness: PASS — Mỗi bộ có đủ ba số (đỏ cũ, đỏ mới, đỏ thêm), tổng theo bộ và theo lớp khớp 1787. Lớp «khác» chỉ khoảng 6% (106/1787) và có dòng mẫu nhận ra nguyên nhân. Ca đỏ ở cả hai cây được tách riêng khỏi «đỏ thêm» (GL07, T04 và hai tệp kiểm). Hai chỗ yếu nhỏ không cản việc chia việc: mẫu `got 127` hơi mỏng, và workflows/ban-do có đỏ mới bằng 0 nhưng đỏ thêm bằng 1, đã được lớp «bộ chạy không chạy được» giải thích.
    - operational-feasibility: PASS — Mỗi bộ có đủ ba số (đỏ cũ, đỏ mới, đỏ thêm) và cột đỏ cả hai. Tổng khớp: 1185+71+157+1+372+1 = 1787, và các lớp cộng lại cũng bằng 1787. Lớp «khác» chỉ có 106 ca (khoảng 6%), nên không nuốt phần lớn. Bốn ca đỏ ở cả hai cây (GL07, T04, eval-thay-boi.test.mjs, repin-lane-lop-cu.test.mjs) được liệt kê riêng và đã trừ khỏi «đỏ thêm». Mỗi lớp có tối đa ba dòng mẫu; lớp đường dẫn và tên đổi nhận ra nguyên nhân ngay, còn mẫu của cung-tep và khác kém rõ hơn nhưng phần «Giới hạn» đã khai cách phân lớp nên vẫn đủ để chia việc.
    - spec-alignment: PASS — Bảng đầu cho mỗi bộ đủ ba số (đỏ cũ, đỏ mới, đỏ thêm) và các tổng khớp nhau (1185+71+157+1+372+1 = 1787). Ca đỏ thêm chia theo lớp, mỗi lớp có số theo từng bộ và tối đa ba dòng mẫu cho thấy nguyên nhân (không tìm thấy đường dẫn, ENOENT, tên cũ còn sót). Lớp «khác» chỉ chiếm 106/1787 (khoảng 6%), không nuốt phần lớn. Ca đỏ ở cả hai cây được tách riêng (4 ca ở scripts, cột «Đỏ cả hai» và mục riêng). Một lệch nhỏ: workflows và ban-do có «đỏ mới» = 0 nhưng «đỏ thêm» = 1, do lớp `bo-chay`; báo cáo đã giải thích lớp này nên không làm người chia việc hiểu sai.
  human_override: Phan Le Manh 2026-11-14 — Đạt

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-11-14T04:18:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-11-14T04:18:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-11-14T04:18:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-11-14T04:18:52Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-14T04:18:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-11-14T04:18:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-11-14T04:18:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-11-14T04:18:52Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-14T04:18:52Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-kich-ban-chuyen-nha-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-11-14T04:18:52Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-kich-ban-chuyen-nha-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-11-14T04:18:52Z

## Known limits

## Ngoài hợp đồng

Có 13 finding ngoài hợp đồng, chưa qua bác bỏ đối kháng, người quyết ở Cổng 2: xem review-findings.md, mục «Ngoài hợp đồng — người quyết ở Gate 2».

## Analyst

none — mọi eval feature đều có baseline n-a (eval mới, không đo được trên code cũ), nên chưa có eval nào được xác nhận là không-phân-biệt.

Baseline khong do:
- node --test migration/kich-ban/don-nha.test.mjs: bo qua baseline: tep migration/kich-ban/don-nha.test.mjs co o cay dang kiem nhung chua co o merge-base f84dcf1b2c8ee5730b7251e215cb8ede0fb3ffc7 — eval moi, chay tren code cu khong phan biet gi
- node migration/kich-ban/thuoc-that.mjs: bo qua baseline: tep migration/kich-ban/thuoc-that.mjs co o cay dang kiem nhung chua co o merge-base f84dcf1b2c8ee5730b7251e215cb8ede0fb3ffc7 — eval moi, chay tren code cu khong phan biet gi
- node migration/kich-ban/thuoc-that.mjs --phien: bo qua baseline: tep migration/kich-ban/thuoc-that.mjs co o cay dang kiem nhung chua co o merge-base f84dcf1b2c8ee5730b7251e215cb8ede0fb3ffc7 — eval moi, chay tren code cu khong phan biet gi
- node migration/kich-ban/thuoc-that.mjs --lop-do: bo qua baseline: tep migration/kich-ban/thuoc-that.mjs co o cay dang kiem nhung chua co o merge-base f84dcf1b2c8ee5730b7251e215cb8ede0fb3ffc7 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: BLOCKED — tác tử chấm chạy Node 26 thay vì Node 24; sửa 5 finding trong hợp đồng, thước thật chạy lần lượt dưới khoá.
Round 2: mọi eval máy xanh; ba lệnh suite hồi quy đỏ (mjs:3/3, vung:2 ca P161, vung:3 ca P179) và E10j chưa chốt. Một finding trong hợp đồng (AC-7, phép quét con trỏ tương đối). Verdict REJECT, trả về triển khai.
Round 3: mọi eval máy và mười một lệnh suite hồi quy xanh trên 684a5e30; E10j đề xuất PASS (ba lăng kính), chờ người chốt human_override ở Cổng 2. Verdict PENDING-JUDGMENT.

### Re-pin lần 1 — 2026-11-17, do mốc 3.0: hồ sơ B1, B2 lên nhánh ứng viên bố cục mới (mọi tệp đã dời)
run_id: repin-20261117T160702Z-10236
sha: 1da75b07805857da131b2144b2cf46b2169e8f57 · suites: 11 lệnh exit 0 · evals: 17/17 eval máy đạt kỳ vọng · ngoài làn máy: E10j · diff chạm vật đo ngoài làn máy: E10j — chưa chứng lại, đi vòng S4 delta

### Re-pin lần 2 — 2026-11-18, do PR #1: sửa ca kiểm theo bố cục mới sau pin (run-tests.sh P196, kiem-ban-cai.ca.mjs, design-floor, design-eval)
run_id: repin-20261118T020047Z-29249
sha: 9d98da111a10081957dfbfd902a1ed7ccb5339ae · suites: 11 lệnh exit 0 · evals: 17/17 eval máy đạt kỳ vọng · ngoài làn máy: E10j
