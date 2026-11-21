---
schema_version: 2
feature_slug: loi-gop-trong-cau-ky
verdict: BLOCKED
failed_evals: []
reason: "Sáu lệnh suite hồi quy không chạy được vì môi trường: run-tests.sh từ chối chạy do Node lệch (đang chạy v26.7.0, kho khai 24 trong .nvmrc). Gồm tests/scripts --manh bash, mjs:1/3, mjs:2/3, mjs:3/3, tests/hooks, tests/workflows. Không đổi Node và không chạy lại. Cần đổi sang Node 24 rồi chạy lại. Mười eval của hợp đồng (E1 đến E10) đều chạy và xanh."
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d460ab26d030fcc62fc33d1d9d0773490cc7880a
human_signoff:
---

# Evidence Report: loi-gop-trong-cau-ky

Round 1. Các eval của hợp đồng đều xanh, nhưng sáu lệnh suite hồi quy không chạy được do thiếu môi trường (Node 24), nên báo cáo ở trạng thái BLOCKED.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-9 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-loi-gop-trong-cau-ky-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgck_the
  verified_at: 2026-11-21T03:34:13Z
  output: |
    Results: 7 passed, 0 failed (lgck-the)

- eval: E3
  run_id: minted-loi-gop-trong-cau-ky-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgck_the
  verified_at: 2026-11-21T03:34:13Z
  output: |
    Results: 7 passed, 0 failed (lgck-the)

- eval: E9
  run_id: minted-loi-gop-trong-cau-ky-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgck_the
  verified_at: 2026-11-21T03:34:13Z
  output: |
    Results: 7 passed, 0 failed (lgck-the)

- eval: E2
  run_id: minted-loi-gop-trong-cau-ky-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgck_im
  verified_at: 2026-11-21T03:34:13Z
  output: |
    Results: 3 passed, 0 failed (lgck-the)

- eval: E4
  run_id: minted-loi-gop-trong-cau-ky-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgck_luat
  verified_at: 2026-11-21T03:34:13Z
  output: |
    (đầu ra rút gọn không còn dòng Results; lệnh kết thúc thành công)

- eval: E5
  run_id: minted-loi-gop-trong-cau-ky-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgck_vong_khep
  verified_at: 2026-11-21T03:34:13Z
  output: |
    Results: 5 passed, 0 failed (lgck-the)

- eval: E6
  run_id: minted-loi-gop-trong-cau-ky-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_loi_gop
  verified_at: 2026-11-21T03:34:13Z
  output: |
    ok 1 - GL-5a mỗi dạng của khối luật GATE-ONESHOT-GOP đi qua bên đọc ra đúng lối khối ghi; hằng bên đọc đúng sáu dạng lời gộp
    ok 2 - GL-5b chuẩn hoá câu: HOA, thừa khoảng trắng, hai dấu «;» ...

- eval: E7
  run_id: minted-loi-gop-trong-cau-ky-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_loi_gop
  verified_at: 2026-11-21T03:34:13Z
  output: |
    ok 1 - GL-5a mỗi dạng của khối luật GATE-ONESHOT-GOP đi qua bên đọc ra đúng lối khối ghi; hằng bên đọc đúng sáu dạng lời gộp
    ok 2 - GL-5b chuẩn hoá câu: HOA, thừa khoảng trắng, hai dấu «;» ...

- eval: E8
  run_id: minted-loi-gop-trong-cau-ky-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_loi_gop
  verified_at: 2026-11-21T03:34:13Z
  output: |
    ok 1 - GL-5a mỗi dạng của khối luật GATE-ONESHOT-GOP đi qua bên đọc ra đúng lối khối ghi; hằng bên đọc đúng sáu dạng lời gộp
    ok 2 - GL-5b chuẩn hoá câu: HOA, thừa khoảng trắng, hai dấu «;» ...

- eval: E10
  run_id: minted-loi-gop-trong-cau-ky-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_loi_gop_mutants
  verified_at: 2026-11-21T03:34:13Z
  output: |
    ok 1 - LGM-M0 đối chứng dương: bản sao trọn gói điều phối CHƯA tiêm chạy bộ «GL-» xanh, đủ số ca
    ok 2 - LGM-dong-dau — bên đọc lấy dòng ĐẦU → đỏ đúng GL-5c, GL-6d
    ok 3 - LGM-lui-dong-cu ...

### Lệnh suite (hồi quy)

Sáu lệnh đầu không chạy được vì môi trường (Node lệch so với .nvmrc), nên không có kết quả test nào; không phải kết quả đạt hay trượt của suite.

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 1
  verified_at: 2026-11-21T03:34:13Z
  note: không chạy được — node lệch, đang chạy v26.7.0, kho khai 24 (.nvmrc); không đổi Node, không chạy lại

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 1
  verified_at: 2026-11-21T03:34:13Z
  note: không chạy được — node lệch, đang chạy v26.7.0, kho khai 24 (.nvmrc); không đổi Node, không chạy lại

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 1
  verified_at: 2026-11-21T03:34:13Z
  note: không chạy được — node lệch, đang chạy v26.7.0, kho khai 24 (.nvmrc); không đổi Node, không chạy lại

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 1
  verified_at: 2026-11-21T03:34:13Z
  note: không chạy được — node lệch, đang chạy v26.7.0, kho khai 24 (.nvmrc); không đổi Node, không chạy lại

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 1
  verified_at: 2026-11-21T03:34:13Z
  note: không chạy được — node lệch, đang chạy v26.7.0, kho khai 24 (.nvmrc); không đổi Node, không chạy lại

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 1
  verified_at: 2026-11-21T03:34:13Z
  note: không chạy được — node lệch, đang chạy v26.7.0, kho khai 24 (.nvmrc); không đổi Node, không chạy lại

Ba lệnh vung:1, vung:2, vung:3 chạy được (không phải lỗi môi trường) nhưng thoát khác 0 và không gắn eval nào. Đầu ra đã lọc chỉ giữ dòng FAIL và dòng Results; vung:1 và vung:2 không để lại dòng nào, vung:3 không có dòng nào khớp bộ lọc. Chưa có căn cứ để quy cho vật hay cho môi trường, cần người đọc đầu ra thô và chạy lại dưới Node 24.

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-11-21T03:34:13Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 1
  verified_at: 2026-11-21T03:34:13Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loi-gop-trong-cau-ky-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-11-21T03:34:13Z

Hai lệnh sau chạy xanh:

- cmd: node plugins/acceptance-gate/scripts/product-map.mjs --root . --check
  run_id: minted-loi-gop-trong-cau-ky-SUITE-node_plugins_acceptance_gate_scripts_pro-r1
  exit_code: 0
  verified_at: 2026-11-21T03:34:13Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-loi-gop-trong-cau-ky-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-21T03:34:13Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval của hợp đồng đều mới và không có baseline để so; không eval nào được xác nhận là xanh ở cả hai phía.

Baseline không đo:

- bash -c 'LGCK_CASES=LG-AC1-bat,LG-AC3-khong-moi,LG-dot-bien-in-khi-tat,LG-dot-bien-ve-o-hoi,LG-dot-bien-da-ky,LG-dot-bien-dien-chu-ky,LG-im-chu-thich node tests/scripts/lgck-the.test.mjs': bo qua baseline: tep tests/scripts/lgck-the.test.mjs co o cay dang kiem nhung chua co o merge-base 8baa836aa086393f431df074c5e8c48174635a76 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'LGCK_CASES=LG-AC2-im,LG-dot-bien-lech-khi-tat,LG-dot-bien-lech-qua-lib node tests/scripts/lgck-the.test.mjs': bo qua baseline: tep tests/scripts/lgck-the.test.mjs co o cay dang kiem nhung chua co o merge-base 8baa836aa086393f431df074c5e8c48174635a76 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'LGCK_CASES=LG-AC4-luat,LG-AC4-p192,LG-dot-bien-luat-sai-loi,LG-dot-bien-luat-go-marker,LG-dot-bien-slots-go node tests/scripts/lgck-the.test.mjs': bo qua baseline: tep tests/scripts/lgck-the.test.mjs co o cay dang kiem nhung chua co o merge-base 8baa836aa086393f431df074c5e8c48174635a76 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'LGCK_CASES=LG-AC5-vong-khep,LG-AC5-dang,LG-AC5-ma-tran,LG-dot-bien-o-the-lech,LG-dot-bien-khuon-lech node tests/scripts/lgck-the.test.mjs': bo qua baseline: tep tests/scripts/lgck-the.test.mjs co o cay dang kiem nhung chua co o merge-base 8baa836aa086393f431df074c5e8c48174635a76 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/loi/gop-theo-loi.test.mjs" "tests/dieu-phoi/loi/gop.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - (GL|I)-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': bo qua baseline: tep tests/dieu-phoi/loi/gop-theo-loi.test.mjs co o cay dang kiem nhung chua co o merge-base 8baa836aa086393f431df074c5e8c48174635a76 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/loi-gop-mutants.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - LGM-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': bo qua baseline: tep tests/dieu-phoi/loi-gop-mutants.test.mjs co o cay dang kiem nhung chua co o merge-base 8baa836aa086393f431df074c5e8c48174635a76 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy một lần (xác định), không có eval nhiều lượt.

## Iterations

Round 1: mười eval E1 đến E10 xanh; sáu lệnh suite hồi quy không chạy được do Node lệch (v26.7.0, kho khai 24), ba lệnh vung:1 đến vung:3 thoát khác 0 mà đầu ra đã lọc không cho lý do. Chưa quy được nguyên nhân, cần chạy lại dưới Node 24. Không có hội đồng judge nào được giao cho round này.
