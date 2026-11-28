---
schema_version: 2
feature_slug: giam-sat-doc-ban-uy-quyen
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8c3b871f2a52ad413abc896372f1034827a0b8f7
human_signoff: Phan Le Manh 2026-11-27
---

# Evidence Report: giam-sat-doc-ban-uy-quyen

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
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | judgment | UNCERTAIN |

## Evidence

- eval: E1
  run_id: minted-giam-sat-doc-ban-uy-quyen-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-27T09:35:41Z
  output: |
    chay.sh AC-1: đạt (6 ca)

- eval: E2
  run_id: minted-giam-sat-doc-ban-uy-quyen-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-27T09:35:41Z
  output: |
    chay.sh AC-2: đạt (2 ca)

- eval: E3
  run_id: minted-giam-sat-doc-ban-uy-quyen-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-27T09:35:41Z
  output: |
    chay.sh AC-3: đạt (2 ca)

- eval: E4
  run_id: minted-giam-sat-doc-ban-uy-quyen-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-27T09:35:41Z
  output: |
    chay.sh AC-4: đạt (2 ca)

- eval: E5
  run_id: minted-giam-sat-doc-ban-uy-quyen-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-27T09:35:41Z
  output: |
    chay.sh AC-5: đạt (5 ca)

- eval: E6
  run_id: minted-giam-sat-doc-ban-uy-quyen-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-27T09:35:41Z
  output: |
    chay.sh AC-6: đạt (4 ca)

- eval: E7
  run_id: minted-giam-sat-doc-ban-uy-quyen-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-27T09:35:41Z
  output: |
    chay.sh AC-7: đạt (5 ca)

- eval: E8
  run_id: minted-giam-sat-doc-ban-uy-quyen-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-27T09:35:41Z
  output: |
    chay.sh AC-8: đạt (2 ca)

- eval: E9
  run_id: minted-giam-sat-doc-ban-uy-quyen-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-27T09:35:41Z
  output: |
    chay.sh AC-9: đạt (3 ca)

- eval: E10
  run_id: minted-giam-sat-doc-ban-uy-quyen-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh
  verified_at: 2026-11-27T09:35:41Z
  output: |
    chay.sh AC-10: đạt (4 ca)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-giam-sat-doc-ban-uy-quyen-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-27T09:35:41Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-giam-sat-doc-ban-uy-quyen-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-27T09:35:41Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-giam-sat-doc-ban-uy-quyen-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-27T09:35:41Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-giam-sat-doc-ban-uy-quyen-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-27T09:35:41Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-giam-sat-doc-ban-uy-quyen-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-27T09:35:41Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-giam-sat-doc-ban-uy-quyen-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-27T09:35:41Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-giam-sat-doc-ban-uy-quyen-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-27T09:35:41Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-giam-sat-doc-ban-uy-quyen-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-27T09:35:41Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-giam-sat-doc-ban-uy-quyen-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-27T09:35:41Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-giam-sat-doc-ban-uy-quyen-SUITE-node_plugins_acceptance_gate_scripts_pro-r1
  exit_code: 0
  verified_at: 2026-11-27T09:35:41Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-giam-sat-doc-ban-uy-quyen-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-27T09:35:41Z

### Judgment (hội đồng đề xuất, chờ người quyết)

Đề xuất panel cho E11: UNCERTAIN. Ba lăng kính, hai lệch nhau về cụm «tự gộp» (LUAT.md dòng 44, README.md dòng 266, 283, 285) so với mục _Avoid_ «Lời gộp» ở CONTEXT.md dòng 281.

- domain-correctness: FAIL — Năm điều đều có mặt (open.md dòng 37–41, LUAT.md dòng 119–127, close.md dòng 28–30), nhưng các tệp dùng cụm «tự gộp» nằm trong _Avoid_ của mục «Lời gộp» ở CONTEXT.md dòng 281 (đó là `--auto` của GitHub, kit không dùng), nên không vướng lỗi từ cấm thì mới PASS.
- operational-feasibility: UNCERTAIN — Đủ năm điều (open.md:37-41, open.md:40, LUAT.md:119-124, LUAT.md:125-127, close.md:28-30). Chỗ chưa chắc là cụm «tự gộp» ở LUAT.md:44 và README.md:266 so với _Avoid_ của mục «Lời gộp» ở CONTEXT.md:281; mục ấy chỉ định nghĩa Lời gộp còn hai câu kia chỉ cờ `tu_merge` của đợt, hai cách đọc đều hợp lý.
- spec-alignment: PASS — Năm điều đều có dòng nói rõ (open.md, LUAT.md mục «Quyền của giám sát», close.md); không thấy từ _Avoid_ dùng sai, không có chi tiết riêng của một kho tiêu thụ; hai chỗ lệch nhỏ («Hàng kế:» trơ ở LUAT.md, «đợt» trơ) không đáng kể.

- eval: E11
  judged_by: judge-subagent (fresh context)
  verdict: UNCERTAIN
  rationale: Năm điều đều có mặt trong open.md, LUAT.md và close.md; chưa chắc ở chỗ cụm «tự gộp» (LUAT.md dòng 44, README.md dòng 266, 283, 285) có vi phạm _Avoid_ của mục «Lời gộp» ở CONTEXT.md dòng 281 hay không, vì hai lăng kính đọc phạm vi cấm khác nhau.
  required_evidence:
    - Sửa LUAT.md dòng 44 («Gộp (khi đợt cho tự gộp)») thành chữ đúng term, ví dụ «khi chủ kho bật quyền tự merge ở thẻ khởi tạo»; Grep «tự gộp» trên plugins/dispatch/scripts/mau/LUAT.md phải ra 0.
    - Sửa plugins/dispatch/README.md dòng 266, 283 và 285 sang chữ «gộp» hay «quyền tự merge»; Grep «tự gộp» trên README.md phải ra 0.
    - Hoặc chủ kho ghi tại CONTEXT.md quanh dòng 275-282 rằng _Avoid_ «tự gộp» chỉ áp cho thuật ngữ Lời gộp (và sửa dòng _Avoid_ theo nếu cho phép dùng ở khoá `tu_merge`).
  human_override: Phan Le Manh 2026-11-27 — Đạt

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline): none đo được. Không eval nào có baseline red hay green, vì cả mười eval máy đều là eval mới và baseline đã bỏ qua (xem mục dưới). Mười eval ấy chưa được chứng minh là phân biệt trên code cũ bằng phép đo A/B.

### Baseline khong do

- bash _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh AC-1: bo qua baseline: tep _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 2956dae21eb298e921edd73efe4d46658cbf26bc — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh AC-2: bo qua baseline: tep _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 2956dae21eb298e921edd73efe4d46658cbf26bc — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh AC-3: bo qua baseline: tep _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 2956dae21eb298e921edd73efe4d46658cbf26bc — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh AC-4: bo qua baseline: tep _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 2956dae21eb298e921edd73efe4d46658cbf26bc — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh AC-5: bo qua baseline: tep _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 2956dae21eb298e921edd73efe4d46658cbf26bc — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh AC-6: bo qua baseline: tep _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 2956dae21eb298e921edd73efe4d46658cbf26bc — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh AC-7: bo qua baseline: tep _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 2956dae21eb298e921edd73efe4d46658cbf26bc — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh AC-8: bo qua baseline: tep _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 2956dae21eb298e921edd73efe4d46658cbf26bc — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh AC-9: bo qua baseline: tep _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 2956dae21eb298e921edd73efe4d46658cbf26bc — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh AC-10: bo qua baseline: tep _acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 2956dae21eb298e921edd73efe4d46658cbf26bc — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E10 xanh; E11 (judgment) UNCERTAIN — cụm «tự gộp» ở LUAT.md và README.md có thể vướng _Avoid_ của CONTEXT.md dòng 281. Chờ người quyết ở Cổng Bằng chứng.

### Re-pin lần 1 — 2026-11-28, do chiến dịch ghim lại của mốc 3.2.0 (GUIDE mục 7.1) — năm hồ sơ của cửa sổ, sau commit nâng số
run_id: repin-20261128T071601Z-73825
sha: 8c3b871f2a52ad413abc896372f1034827a0b8f7 · suites: 11 lệnh exit 0 · evals: 10/10 eval máy đạt kỳ vọng · ngoài làn máy: E11 · diff chạm vật đo ngoài làn máy: E11 — chưa chứng lại, đi vòng S4 delta · AC không có chốt máy: AC-11
