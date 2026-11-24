---
schema_version: 2
feature_slug: doi-soat-ban-giao
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2e660a5662831264f00ed67dde0b0f153f9315e6
human_signoff:
---

# Evidence Report: doi-soat-ban-giao

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3a | AC-3 | test | PASS |
| E3 | AC-3 | judgment | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-9 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-doi-soat-ban-giao-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-soat-ban-giao/rang/chay.sh
  verified_at: 2026-11-24T07:52:25Z
  output: |
    chay.sh AC-1: đạt (3 ca)

- eval: E2
  run_id: minted-doi-soat-ban-giao-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-soat-ban-giao/rang/chay.sh
  verified_at: 2026-11-24T07:52:25Z
  output: |
    chay.sh AC-2: đạt (2 ca)

- eval: E3a
  run_id: minted-doi-soat-ban-giao-E3a-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-soat-ban-giao/rang/chay.sh
  verified_at: 2026-11-24T07:52:25Z
  output: |
    chay.sh AC-3: đạt (2 ca)

- eval: E4
  run_id: minted-doi-soat-ban-giao-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-soat-ban-giao/rang/chay.sh
  verified_at: 2026-11-24T07:52:25Z
  output: |
    chay.sh AC-4: đạt (4 ca)

- eval: E5
  run_id: minted-doi-soat-ban-giao-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-soat-ban-giao/rang/chay.sh
  verified_at: 2026-11-24T07:52:25Z
  output: |
    chay.sh AC-5: đạt (2 ca)

- eval: E6
  run_id: minted-doi-soat-ban-giao-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-soat-ban-giao/rang/chay.sh
  verified_at: 2026-11-24T07:52:25Z
  output: |
    chay.sh AC-6: đạt (3 ca)

- eval: E7
  run_id: minted-doi-soat-ban-giao-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-soat-ban-giao/rang/chay.sh
  verified_at: 2026-11-24T07:52:25Z
  output: |
    chay.sh AC-7: đạt (2 ca)

- eval: E8
  run_id: minted-doi-soat-ban-giao-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-soat-ban-giao/rang/chay.sh
  verified_at: 2026-11-24T07:52:25Z
  output: |
    chay.sh AC-8: đạt (2 ca)

- eval: E9
  run_id: minted-doi-soat-ban-giao-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/doi-soat-ban-giao/rang/chay.sh
  verified_at: 2026-11-24T07:52:25Z
  output: |
    vung-vat --thu: đỏ đúng — plugins/acceptance-gate/lib/x.cjs

- eval: E10
  run_id: minted-doi-soat-ban-giao-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dieu_phoi_ci
  verified_at: 2026-11-24T07:52:25Z
  output: |
    PASS: DP1-03 buoc-ci · lenh: node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" · pass 743 fail 0 skipped 0 todo 0

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-doi-soat-ban-giao-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-24T07:52:25Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-doi-soat-ban-giao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-24T07:52:25Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-doi-soat-ban-giao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-24T07:52:25Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-doi-soat-ban-giao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-24T07:52:25Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-doi-soat-ban-giao-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-24T07:52:25Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doi-soat-ban-giao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-24T07:52:25Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doi-soat-ban-giao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-24T07:52:25Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doi-soat-ban-giao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-24T07:52:25Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-doi-soat-ban-giao-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-24T07:52:25Z

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-doi-soat-ban-giao-SUITE-node_plugins_acceptance_gate_scripts_pro-r1
  exit_code: 0
  verified_at: 2026-11-24T07:52:25Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-doi-soat-ban-giao-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-24T07:52:25Z

### Judgment (E3, hội đồng đề xuất PASS)

- eval: E3
  judged_by: judge panel (fresh context), đề xuất PASS
  rationale: hai trên ba góc nhìn PASS; một bất đồng được ghi đầy đủ bên dưới, chưa ai quyết.
  votes:
    - domain-correctness: PASS — Mỗi dòng lệch trong mau-dong.md đều tự nói được dãy, khoá, đơn hoặc nhánh chính nào, chiều lệch, và giá trị lúc bàn giao so với nay. Ví dụ: «dãy P1: đỉnh tiến 1 commit sau bàn giao (lúc bàn giao 82ad025, nay 6de04f7)». Hai dòng «CHƯA ĐẨY» ghi «commit chỉ có ở máy này». Năm dòng vàng đều có chữ giải thích cạnh tên trường. Tệp không có đường dẫn tuyệt đối và không có từ nằm trong _Avoid_ của CONTEXT.md.
    - operational-feasibility: FAIL — Hai dòng lệch dùng chữ «đợt» trơ, trong khi mục «Đợt (điều phối)» của CONTEXT.md liệt nó vào _Avoid_ và bảo viết «đợt chạy». Dòng về khoá còn để mã trần «s4: P2» mà không có chữ giải thích.
    - spec-alignment: PASS — Mỗi dòng lệch trong mau-dong.md đều nêu đối tượng, chiều lệch và giá trị lúc bàn giao so với nay. Hai dòng «CHƯA ĐẨY» đều ghi «commit chỉ có ở máy này». Năm dòng vàng đều có chữ giải thích cạnh tên trường. Tệp không có đường dẫn tuyệt đối và không có từ nào trong _Avoid_ của CONTEXT.md.
  required_evidence:
    - Tệp mẫu `_acceptance/doi-soat-ban-giao/mau-dong.md` đã sửa, hai dòng «dãy P3: mới thêm vào đợt sau bàn giao — không có bản ghi lúc bàn giao để so» và «dãy P2: có lúc bàn giao, nay không còn trong đợt» dùng «đợt chạy» thay cho «đợt» trơ (CONTEXT.md dòng 546-547). Có bản sửa như vậy thì phán quyết đổi.
    - Dòng «khoá: lúc bàn giao «s4: P2», nay «không có»» trong cùng tệp, viết lại có chữ nói đây là khoá lượt chấm s4 và dãy P2 đang giữ nó. Có bản sửa như vậy thì phán quyết đổi.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Baseline khong do:
- bash _acceptance/doi-soat-ban-giao/rang/chay.sh AC-1: bo qua baseline: tep _acceptance/doi-soat-ban-giao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 647bd9d5ffcbac1fbccb05ebd3d0bd33e5f09e92 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/doi-soat-ban-giao/rang/chay.sh AC-2: bo qua baseline: tep _acceptance/doi-soat-ban-giao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 647bd9d5ffcbac1fbccb05ebd3d0bd33e5f09e92 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/doi-soat-ban-giao/rang/chay.sh AC-3: bo qua baseline: tep _acceptance/doi-soat-ban-giao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 647bd9d5ffcbac1fbccb05ebd3d0bd33e5f09e92 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/doi-soat-ban-giao/rang/chay.sh AC-4: bo qua baseline: tep _acceptance/doi-soat-ban-giao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 647bd9d5ffcbac1fbccb05ebd3d0bd33e5f09e92 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/doi-soat-ban-giao/rang/chay.sh AC-5: bo qua baseline: tep _acceptance/doi-soat-ban-giao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 647bd9d5ffcbac1fbccb05ebd3d0bd33e5f09e92 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/doi-soat-ban-giao/rang/chay.sh AC-6: bo qua baseline: tep _acceptance/doi-soat-ban-giao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 647bd9d5ffcbac1fbccb05ebd3d0bd33e5f09e92 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/doi-soat-ban-giao/rang/chay.sh AC-7: bo qua baseline: tep _acceptance/doi-soat-ban-giao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 647bd9d5ffcbac1fbccb05ebd3d0bd33e5f09e92 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/doi-soat-ban-giao/rang/chay.sh AC-8: bo qua baseline: tep _acceptance/doi-soat-ban-giao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 647bd9d5ffcbac1fbccb05ebd3d0bd33e5f09e92 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/doi-soat-ban-giao/rang/chay.sh AC-9: bo qua baseline: tep _acceptance/doi-soat-ban-giao/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 647bd9d5ffcbac1fbccb05ebd3d0bd33e5f09e92 — eval moi, chay tren code cu khong phan biet gi
- node tests/dieu-phoi/chay-buoc-ci.mjs: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy đạt; E3 đề xuất PASS kèm một ý bất đồng ở góc operational-feasibility (ghi ở mục Judgment). Verdict PASS.
