---
schema_version: 2
feature_slug: release-3-0-0
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a8ce534492f9eb0a3a9f5a6505ccd8c5ab0588ce
human_signoff:
---

# Evidence Report: release-3-0-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2a | AC-2 | test | PASS |
| E2b | AC-2 | test | PASS |
| E2c | AC-2 | test | PASS |
| E2d | AC-2 | test | PASS |
| E2e | AC-2 | test | PASS |
| E2f | AC-2 | test | PASS |
| E2g | AC-2 | test | PASS |
| E2h | AC-2 | test | PASS |
| E2i | AC-2 | test | PASS |
| E2j | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | judgment | UNCERTAIN |

## Evidence

- eval: E1
  run_id: minted-release-3-0-0-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-17T17:15:01Z
  output: |
    Results: all plugin tests passed

- eval: E2a
  run_id: minted-release-3-0-0-E2a-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-17T17:15:01Z
  output: |
    Results: 841 passed, 0 failed

- eval: E2b
  run_id: minted-release-3-0-0-E2b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-17T17:15:01Z
  output: |
    Results: 45 passed, 0 failed

- eval: E2c
  run_id: minted-release-3-0-0-E2c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-17T17:15:01Z
  output: |
    Results: 45 passed, 0 failed

- eval: E2d
  run_id: minted-release-3-0-0-E2d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-17T17:15:01Z
  output: |
    mảnh mjs:3/3 hoàn tất, không có dòng FAIL

- eval: E2e
  run_id: minted-release-3-0-0-E2e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-11-17T17:15:01Z
  output: |
    Results: 71 passed, 0 failed

- eval: E2f
  run_id: minted-release-3-0-0-E2f-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-17T17:15:01Z
  output: |
    Results: all plugin tests passed

- eval: E2g
  run_id: r1-l8-1-20261117171501
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-17T17:15:01Z
  output: |
    Results: all plugin tests passed

- eval: E2h
  run_id: minted-release-3-0-0-E2h-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-17T17:15:01Z
  output: |
    Results: all plugin tests passed

- eval: E2i
  run_id: minted-release-3-0-0-E2i-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-11-17T17:15:01Z
  output: |
    Results: all workflow tests passed

- eval: E2j
  run_id: minted-release-3-0-0-E2j-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-11-17T17:15:01Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E3
  run_id: minted-release-3-0-0-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel300_cua_so
  verified_at: 2026-11-17T17:15:01Z
  output: |
    XANH: hai tập bằng nhau

- eval: E4
  run_id: minted-release-3-0-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel300_cay_kich_ban
  verified_at: 2026-11-17T17:15:01Z
  output: |
    cay-kich-ban: đạt — commit dọn nhà e3a7c105c5e99f5e4208e00700a7c2319f5123f1 (cây 53031519ff3fad4931d21104f8b474f823479086) là tổ tiên của HEAD, năm thước thoát 0

- eval: E5
  run_id: minted-release-3-0-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel300_vi_phan
  verified_at: 2026-11-17T17:15:01Z
  output: |
    vi-phan-hai-kho: đạt — 0 phán quyết lệch ở hai kho, bộ phá thử hai chiều đạt

- eval: E6
  run_id: minted-release-3-0-0-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel300_hang_loi
  verified_at: 2026-11-17T17:15:01Z
  output: |
    hang-loi: đường chết hai chiều đạt — HEAD 0 trên 1033 chuỗi, nền đủ ba glob chết

- eval: E7
  run_id: minted-release-3-0-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-17T17:15:01Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.39.0 (0c4e503b) cài đúng tag

- eval: E8
  run_id: minted-release-3-0-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel300_guide_ci
  verified_at: 2026-11-17T17:15:01Z
  output: |
    guide-ci: hai chiều đạt

- eval: E9
  run_id: minted-release-3-0-0-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel300_don_dau_vet
  verified_at: 2026-11-17T17:15:01Z
  output: |
    don-dau-vet: đạt

### Judgment

Panel đề xuất cho E10 (T3: mọi mục judgment đều chờ người). Phiếu của từng judge:

- domain-correctness: UNCERTAIN — Vế 2 và 3 đúng: tên chợ, ba plugin, mười hai lệnh, hai skill khớp bang-ten.json, ngưỡng thực tế ghi rõ «CHƯA ĐẠT». Số giới hạn và các câu trích ở sáu hồ sơ khớp Notes (4+13, 6+8, 12, 11, 4, 4). Vế 1 và 4 chưa kết luận được: hai gạch «Vật:» bị cắt khỏi dòng feature, một số liệu không có trong input, khối §5.3 không có dòng feature-loop hay KIT_TAG.
- operational-feasibility: UNCERTAIN — Vế 1, 2, 3 đúng. Vế 4 không phân xử được: CHANGELOG dặn «KIT_TAG sang v3.0.0» và đường $RUNNER_TEMP/kit/plugins/feature-loop/…, còn khối mẫu GUIDE §5.3 ghim bằng KIT_SHA và không chứa đường feature-loop nào.
- spec-alignment: PASS — Các dòng «Gốc:» và gạch «Vật:» của sáu hồ sơ khớp chữ của opportunity/contract, số giới hạn khớp Notes, bảng tên khớp bang-ten.json, mục ngưỡng khai «chưa đo được lúc cắt mốc». Vế 4 chỉ là ghi nhận nhẹ: khối mẫu dùng KIT_SHA, GUIDE cho phép lấy kit bằng thẻ.

- eval: E10
  judged_by: judge-subagent (fresh context)
  verdict: UNCERTAIN
  rationale: Hai trong ba judge không kết luận được vế 1 và vế 4 của AC-10 (CHANGELOG cắt cuối dòng feature, số 5 807 không có trong input, KIT_TAG và đường feature-loop không có trong khối §5.3); judge còn lại cho PASS kèm ghi nhận nhẹ ở vế 4.
  required_evidence:
    - Vế 1, gạch «Vật:» của B1 và B2 — chủ kho hoặc luật AC-10 xác nhận cắt cuối câu có được coi là «chép dòng feature» không, hoặc CHANGELOG chép đủ nguyên dòng (nguồn contract.md dòng 3 của kich-ban-chuyen-nha và bo-kiem-xanh-o-kho-moi).
    - Vế 1, số 5 807 / 5 807 của B2 — đoạn contract.md hoặc opportunity.md của B2 chứa số này, hoặc đưa decisions.jsonl dòng 27–32 vào input.
    - Vế 1, câu «(B2 sửa phần lớn; phần còn lại là Ngoài-1 của B2.)» ở bullet B1 — xác nhận có tính là nói rộng hơn chữ hồ sơ hay không.
    - Vế 4, GUIDE.md §5.3 (dòng 1011-1032) — xác nhận CHANGELOG được phép chép KIT_TAG v3.0.0 và đường feature-loop từ các dòng khác của GUIDE (1568, 1794), hoặc chỉ ra dòng §5.3 mang chúng.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

Baseline khong do:
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh bash: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 118 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node plugins/acceptance-gate/scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash _acceptance/release-2-39-0/cua-so.sh 0c4e503b bo-kiem-xanh-o-kho-moi goi-cheo-loi-dieu-phoi kich-ban-chuyen-nha phan-du-bo-cuc-moi phan-du-bo-cuc-moi-vong-ba phan-du-bo-cuc-moi-vong-bon: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-3-0-0/cay-kich-ban.sh: bo qua baseline: tep _acceptance/release-3-0-0/cay-kich-ban.sh co o cay dang kiem nhung chua co o merge-base 90c3f9f197e18004eb0a8efb7d3d960bb02f5d12 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-0-0/vi-phan-hai-kho.sh: bo qua baseline: tep _acceptance/release-3-0-0/vi-phan-hai-kho.sh co o cay dang kiem nhung chua co o merge-base 90c3f9f197e18004eb0a8efb7d3d960bb02f5d12 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-0-0/hang-loi.sh --hai-chieu 90c3f9f197e18004eb0a8efb7d3d960bb02f5d12: bo qua baseline: tep _acceptance/release-3-0-0/hang-loi.sh co o cay dang kiem nhung chua co o merge-base 90c3f9f197e18004eb0a8efb7d3d960bb02f5d12 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-3-0-0/guide-ci.sh --hai-chieu 90c3f9f197e18004eb0a8efb7d3d960bb02f5d12: bo qua baseline: tep _acceptance/release-3-0-0/guide-ci.sh co o cay dang kiem nhung chua co o merge-base 90c3f9f197e18004eb0a8efb7d3d960bb02f5d12 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-0-0/don-dau-vet.sh: bo qua baseline: tep _acceptance/release-3-0-0/don-dau-vet.sh co o cay dang kiem nhung chua co o merge-base 90c3f9f197e18004eb0a8efb7d3d960bb02f5d12 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất

## Iterations

Round 1: không eval máy nào đỏ; E10 (judgment, T3) còn UNCERTAIN chờ người điền human_override ở Cổng 2 — verdict PENDING-JUDGMENT.
