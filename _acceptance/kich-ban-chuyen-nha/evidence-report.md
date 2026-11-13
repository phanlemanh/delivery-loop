---
schema_version: 2
feature_slug: kich-ban-chuyen-nha
verdict: BLOCKED
failed_evals: []
reason: "Bộ suite hồi quy không chạy được vì máy đang dùng Node v26.7.0 trong khi kho khai Node 24 (.nvmrc): run-tests.sh của scripts (bash, mjs:1/3, mjs:2/3, mjs:3/3), hooks và workflows dừng ở bước kiểm môi trường. Đây là lỗi môi trường, không phải kết quả đạt/trượt của test. Ba lệnh plugins vung:1, vung:2, vung:3 cũng thoát khác 0 và không in dòng Results nào; chưa rõ nguyên nhân. Không đổi Node và không chạy lại theo yêu cầu. Cần chạy lại sau khi chuyển sang Node 24. Mười bảy eval máy của tính năng đều đã chạy xong và xanh."
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5e0f26e825521ce579833f467d72edb063d74cd2
human_signoff:
---

# Evidence Report: kich-ban-chuyen-nha

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
| E10j | AC-10 | judgment | chờ người (đề xuất PASS, một lens chưa chắc) |

## Evidence

Lệnh `node --test migration/kich-ban/don-nha.test.mjs` (chạy một lần) phủ E1, E2, E3, E4, E5, E7, E8, E9.

- eval: E1
  run_id: minted-kich-ban-chuyen-nha-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:33:26Z
  output: |
    ℹ duration_ms 28789.67875

- eval: E2
  run_id: minted-kich-ban-chuyen-nha-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:33:26Z
  output: |
    ℹ duration_ms 28789.67875

- eval: E3
  run_id: minted-kich-ban-chuyen-nha-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:33:26Z
  output: |
    ℹ duration_ms 28789.67875

- eval: E4
  run_id: minted-kich-ban-chuyen-nha-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:33:26Z
  output: |
    ℹ duration_ms 28789.67875

- eval: E5
  run_id: minted-kich-ban-chuyen-nha-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:33:26Z
  output: |
    ℹ duration_ms 28789.67875

- eval: E7
  run_id: minted-kich-ban-chuyen-nha-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:33:26Z
  output: |
    ℹ duration_ms 28789.67875

- eval: E8
  run_id: minted-kich-ban-chuyen-nha-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:33:26Z
  output: |
    ℹ duration_ms 28789.67875

- eval: E9
  run_id: minted-kich-ban-chuyen-nha-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha
  verified_at: 2026-11-13T13:33:26Z
  output: |
    ℹ duration_ms 28789.67875

Lệnh `node migration/kich-ban/thuoc-that.mjs` (chạy một lần) phủ E1t, E2t, E3t, E4t, E5t, E7t, E8t.

- eval: E1t
  run_id: minted-kich-ban-chuyen-nha-E1t-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-13T13:33:26Z
  output: |
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E2t
  run_id: minted-kich-ban-chuyen-nha-E2t-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-13T13:33:26Z
  output: |
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E3t
  run_id: minted-kich-ban-chuyen-nha-E3t-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-13T13:33:26Z
  output: |
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E4t
  run_id: minted-kich-ban-chuyen-nha-E4t-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-13T13:33:26Z
  output: |
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E5t
  run_id: minted-kich-ban-chuyen-nha-E5t-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-13T13:33:26Z
  output: |
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E7t
  run_id: minted-kich-ban-chuyen-nha-E7t-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-13T13:33:26Z
  output: |
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E8t
  run_id: minted-kich-ban-chuyen-nha-E8t-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_that
  verified_at: 2026-11-13T13:33:26Z
  output: |
    doctor: 83/100 · plugin_source_not_root đạt

- eval: E6
  run_id: minted-kich-ban-chuyen-nha-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_phien
  verified_at: 2026-11-13T13:33:26Z
  output: |
    AC-6 đạt: không mất không thừa sau đổi tên, mọi plugin của chợ mới qua lớp tĩnh và lớp cài

- eval: E10
  run_id: minted-kich-ban-chuyen-nha-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kich_ban_chuyen_nha_lop_do
  verified_at: 2026-11-13T13:33:26Z
  output: |
    theo lớp: bo-chay 2 · cung-tep 493 · duong-dan 1032 · khac 232 · lich-su 0 · ten-doi 31

### Judgment

- eval: E10j
  judged_by: hội đồng judge (fresh context), ba lens
  proposal: PASS
  votes:
    - domain-correctness: PASS — Báo cáo có đủ ba số mỗi bộ (đỏ cũ, đỏ mới, đỏ thêm), tách riêng ca đỏ ở cả hai cây (scripts: 1189 − 1 = 1188; liệt kê moc-chien-dich.test.mjs), tổng các lớp khớp số đỏ thêm. Lớp «khác» chỉ 232/1790 (khoảng 13%). Điểm yếu nhỏ: ở bộ plugins «khác» là 109/157 ca và ba dòng mẫu của lớp này đều lấy từ scripts; AC-10 chỉ đòi «khác» không nuốt phần lớn tổng số ca nên chưa đủ để chấm trượt.
    - operational-feasibility: UNCERTAIN — Ba số mỗi bộ, tách ca đỏ ở cả hai cây và lớp có mẫu đều có. Lớp «khác» chỉ 13% tổng, nhưng ở bộ plugins là 109/157 (69%) và ba mẫu «khác» đều lấy từ scripts, bị cắt cụt, chỉ thấy «mã 1/undefined». Hợp đồng không nói «không nuốt phần lớn» tính theo tổng hay theo từng bộ nên lens này không tự quyết.
    - spec-alignment: PASS — Mỗi bộ có đủ ba số kèm cột «đỏ cả hai»; tổng theo lớp khớp bảng bộ (scripts 642+469+72+5=1188); «khác» 232/1790; ca đỏ ở cả hai cây tách khỏi «đỏ thêm»; mỗi lớp có tối đa ba dòng mẫu. Hai điểm yếu nhỏ không đổi kết luận: plugins có 109/157 ca ở «khác» và mẫu «khác» đều của scripts; với workflows và ban-do «đỏ mới» là 0 nhưng «đỏ thêm» là 1 vì bộ không chạy được được đếm một ca ở lớp «bộ chạy không chạy được».
  required_evidence:
    - Chủ kho hoặc hợp đồng (_acceptance/kich-ban-chuyen-nha/contract.md, AC-10) xác định «khác không nuốt phần lớn» tính trên tổng 1790 hay trên từng bộ (plugins 109/157 = 69%).
    - Dòng mẫu của lớp «khác» lấy từ bộ plugins trong migration/kich-ban/ket-qua/lop-do.md (hiện cả ba mẫu đều của scripts và bị cắt ở khoảng 250 ký tự).
    - Phân rã lớp «khác» của plugins thành các dấu hiệu nhỏ hơn từ nhật ký đo mà phan-lop.py đọc (migration/kich-ban/do-lop-do.sh).
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

Năm lệnh không chạy được vì Node lệch (đang v26.7.0, kho khai 24): không có suite nào được thực thi, nên không có kết quả đạt/trượt. Mã thoát ghi dưới đây là mã bộ chấm báo về cho lệnh.

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 1
  verified_at: 2026-11-13T13:33:26Z
  note: BLOCKED, Node lệch, suite chưa chạy

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 1
  verified_at: 2026-11-13T13:33:26Z
  note: BLOCKED, Node lệch, suite chưa chạy

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 1
  verified_at: 2026-11-13T13:33:26Z
  note: BLOCKED, Node lệch, suite chưa chạy

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 1
  verified_at: 2026-11-13T13:33:26Z
  note: BLOCKED, Node lệch, suite chưa chạy

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 1
  verified_at: 2026-11-13T13:33:26Z
  note: BLOCKED, Node lệch, suite chưa chạy

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 1
  verified_at: 2026-11-13T13:33:26Z
  note: BLOCKED, Node lệch, suite chưa chạy

Ba lệnh plugins dưới đây thoát khác 0, không gắn eval nào, đầu ra qua bộ lọc không có dòng nào (không có dòng Results). Chưa rõ nguyên nhân; cần chạy lại sau khi đổi sang Node 24 rồi mới kết luận.

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-11-13T13:33:26Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 1
  verified_at: 2026-11-13T13:33:26Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kich-ban-chuyen-nha-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-11-13T13:33:26Z

Hai lệnh suite đạt:

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-kich-ban-chuyen-nha-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-11-13T13:33:26Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-kich-ban-chuyen-nha-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-13T13:33:26Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — danh sách eval không-phân-biệt rỗng. Lưu ý: baseline là n-a cho mọi eval của tính năng (xem dưới), nên báo cáo này chưa chứng minh được chiều đỏ của chúng trên code cũ.

Baseline khong do:
- node --test migration/kich-ban/don-nha.test.mjs: bo qua baseline: tep migration/kich-ban/don-nha.test.mjs co o cay dang kiem nhung chua co o merge-base 8f5cefdef1f4924979104203f558bff797696824 — eval moi, chay tren code cu khong phan biet gi
- node migration/kich-ban/thuoc-that.mjs: bo qua baseline: tep migration/kich-ban/thuoc-that.mjs co o cay dang kiem nhung chua co o merge-base 8f5cefdef1f4924979104203f558bff797696824 — eval moi, chay tren code cu khong phan biet gi
- node migration/kich-ban/thuoc-that.mjs --phien: bo qua baseline: tep migration/kich-ban/thuoc-that.mjs co o cay dang kiem nhung chua co o merge-base 8f5cefdef1f4924979104203f558bff797696824 — eval moi, chay tren code cu khong phan biet gi
- node migration/kich-ban/thuoc-that.mjs --lop-do: bo qua baseline: tep migration/kich-ban/thuoc-that.mjs co o cay dang kiem nhung chua co o merge-base 8f5cefdef1f4924979104203f558bff797696824 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: BLOCKED — Node lệch (máy v26.7.0, kho khai 24) làm sáu lệnh suite dừng ở bước kiểm môi trường, ba lệnh plugins thoát khác 0 không rõ nguyên nhân; mười bảy eval máy của tính năng xanh, E10j chờ người. Cần chạy lại suite trên Node 24.
