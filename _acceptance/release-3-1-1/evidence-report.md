---
schema_version: 2
feature_slug: release-3-1-1
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 72a2807b3a20ac1ed430db21cc74786bbcd37b7a
human_signoff:
---

# Evidence Report: release-3-1-1

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
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | judgment | PASS |
| E9 | AC-9 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-3-1-1-E1-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-23T05:34:20Z
  output: |
    Results: all plugin tests passed

- eval: E2a
  run_id: minted-release-3-1-1-E2a-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-23T05:34:20Z
  output: |
    Results: 841 passed, 0 failed

- eval: E2b
  run_id: bceocbna8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-23T05:34:20Z
  output: |
    mảnh mjs:1/3 hoàn tất, thoát sạch

- eval: E2c
  run_id: minted-release-3-1-1-E2c-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-23T05:34:20Z
  output: |
    Results: 47 passed, 0 failed

- eval: E2d
  run_id: minted-release-3-1-1-E2d-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-23T05:34:20Z
  output: |
    Results: 47 passed, 0 failed

- eval: E2e
  run_id: minted-release-3-1-1-E2e-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-11-23T05:34:20Z
  output: |
    Results: 71 passed, 0 failed

- eval: E2f
  run_id: minted-release-3-1-1-E2f-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-23T05:34:20Z
  output: |
    Results: all plugin tests passed

- eval: E2g
  run_id: r4-l8-1-20261123053420
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-23T05:34:20Z
  output: |
    Results: all plugin tests passed

- eval: E2h
  run_id: minted-release-3-1-1-E2h-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-23T05:34:20Z
  output: |
    Results: all plugin tests passed

- eval: E2i
  run_id: minted-release-3-1-1-E2i-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-11-23T05:34:20Z
  output: |
    Results: all workflow tests passed

- eval: E2j
  run_id: minted-release-3-1-1-E2j-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-11-23T05:34:20Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E3
  run_id: minted-release-3-1-1-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T05:34:20Z
  output: |
    XANH: hai tập bằng nhau

- eval: E4
  run_id: minted-release-3-1-1-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T05:34:20Z
  output: |
    XANH: diagram-design không đổi, giữ số

- eval: E5
  run_id: minted-release-3-1-1-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T05:34:20Z
  output: |
    XANH: hai gói chỉ đổi dòng version

- eval: E6
  run_id: minted-release-3-1-1-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T05:34:20Z
  output: |
    XANH: đúng 0 tệp đổi như ghi chú 3.1.1 kể

- eval: E7
  run_id: minted-release-3-1-1-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T05:34:20Z
  output: |
    XANH: thẻ mang đúng bản vá #26 — 4 tệp vật + 5 tệp khai, phần còn lại trùng byte 1a887948d7933a3a21c660cecdfc2d0c1e1ffac9

- eval: E9
  run_id: minted-release-3-1-1-E9-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-23T05:34:20Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v3.1.0 (0a93a5b9) cài đúng tag

### Judgment

- eval: E8
  judged_by: hội đồng 3 thấu kính (domain-correctness, operational-feasibility, spec-alignment) — đề xuất PASS
  proposal: PASS
  votes:
    - domain-correctness: PASS — Cả bốn vế khớp nguồn. (0) Dòng Gốc, gạch Vật và câu Ngoài-4 trích đúng chữ hợp đồng va-chu-ky-giu-cho-lenh-gop. Giới hạn khai trước là 1 và có 6 mục Ngoài, khớp Notes và sáu dòng gate2 của sổ quyết định. (1) Các số khớp nguồn: round-tally 1 PASS. Ba làn ghim lại 59,7 + 66,9 + 63,2 = 189,8 phút. Tỉ lệ out-token 46,4 / 41,1 / 12,6 trên 80 488, và wall 3848s ≈ 64 phút. Làm-xong→ký 3 g 52, ký→gộp 1 g 14, hai lần gộp nhánh chính vào nhánh, gọi người 2 lần ở Phạm vi và Bằng chứng. (2) Gạch lớp chép CI nói «không chép gì» và không kể tệp nào, khớp khối INIT-CI-COPY-LIST: năm tệp #26 đổi đều nằm ngoài khối. (3) «Vì sao 3.1.1» và «Ai bị ảnh hưởng» khai thẳng đổi hành vi chạm kho (lệnh gộp theo lời, thiếu `--loi` thì bị chặn kèm lệnh giải), nêu kho không cài gói điều phối hoặc không bật khoá thì không đổi hành vi. Căn cứ chọn số patch khớp Context hợp đồng.
    - operational-feasibility: PASS — Cả bốn vế đều khớp nguồn. (0) Dòng «Gốc:», gạch «Vật:», trích Ngoài-4 và giới hạn khai trước là chữ của hợp đồng va-chu-ky-giu-cho-lenh-gop; số 1 giới hạn khai trước và 6 mục chọn khớp 6 mục ở Notes và 6 dòng gate2 (d-31 đến d-36). (1) Mọi ô bảng khớp: làm-xong→ký 3 g 52 và ký→gộp 1 g 14 và 2 lần gộp nhánh chính khớp do-dong-1.md; 1 lượt chấm PASS khớp round-tally; ba làn ghim lại 59,7 + 66,9 + 63,2 = 189,8 phút khớp tong_ket.phut; 80 488 out-token với tỉ lệ 46,4 / 41,1 / 12,6 khớp bảng vai trò; 64 phút khớp `wall: 3848s`; 2 lượt gọi người (Phạm vi, Bằng chứng) khớp seal gate1 và các dòng gate2. (2) Mục «Lớp chép CI» ghi «không chép gì» và không kể tệp nào của khối INIT-CI-COPY-LIST. Đoạn tôi đọc được của khối không có tệp dispatch hay signoff.md, nên không mâu thuẫn. (3) «Vì sao 3.1.1» và «Ai bị ảnh hưởng» nói thẳng hai đổi hành vi: lệnh gộp theo lời thôi gộp chữ ký giữ chỗ, và gọi tay ở bố cục cài mà thiếu `--loi` thì bị chặn kèm lệnh giải. Chúng cũng nêu kho không cài gói dispatch hoặc không bật `feature_loop.gop_theo_loi_ky` thì không đổi hành vi. Căn cứ chọn số patch trùng Context hợp đồng (siết một vế sẵn có, không thêm khoá, lệnh hay bề mặt mới).
    - spec-alignment: PASS — Bốn vế đều khớp nguồn. (0) Dòng «Gốc:», gạch «Vật:», giới hạn khai trước và trích Ngoài-4 trùng chữ hợp đồng va-chu-ky-giu-cho-lenh-gop, và 6 mục Ngoài-1..6 khớp Notes cùng 6 dòng gate2. (1) Mọi ô của bảng đều tính lại ra đúng số. (2) Mục «không chép gì» đúng, vì bốn tệp vật của #26 không nằm trong khối INIT-CI-COPY-LIST. (3) «Vì sao 3.1.1» và «Ai bị ảnh hưởng» khai thẳng đổi hành vi và nói rõ kho không cài gói điều phối hay không bật khoá thì không đổi; căn cứ chọn patch khớp Context của hợp đồng release-3-1-1.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline):
- E1, E2h (lệnh `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`): baseline green — chứng minh harness hơn là feature; chiều đỏ của AC-1 sống trong các đột biến của ca P200, nên xem đây là regression-guard có chủ ý hoặc viết lại để assert hành vi mới.

Baseline khong do:
- bash tests/scripts/run-tests.sh --manh bash: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 120 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node plugins/acceptance-gate/scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-3-1-1/chay.sh cua-so --dinh-moc: bo qua baseline: tep _acceptance/release-3-1-1/chay.sh co o cay dang kiem nhung chua co o merge-base b0f88c44548706d36de3c8222c747eed5edbeb7d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-1-1/chay.sh dd-giu --dinh-moc: bo qua baseline: tep _acceptance/release-3-1-1/chay.sh co o cay dang kiem nhung chua co o merge-base b0f88c44548706d36de3c8222c747eed5edbeb7d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-1-1/chay.sh goi-doi --dinh-moc: bo qua baseline: tep _acceptance/release-3-1-1/chay.sh co o cay dang kiem nhung chua co o merge-base b0f88c44548706d36de3c8222c747eed5edbeb7d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-1-1/chay.sh lop-chep --dinh-moc: bo qua baseline: tep _acceptance/release-3-1-1/chay.sh co o cay dang kiem nhung chua co o merge-base b0f88c44548706d36de3c8222c747eed5edbeb7d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-1-1/chay.sh vat-va --dinh-moc: bo qua baseline: tep _acceptance/release-3-1-1/chay.sh co o cay dang kiem nhung chua co o merge-base b0f88c44548706d36de3c8222c747eed5edbeb7d — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform

## Iterations

Round 4: mọi eval máy xanh (E1, E2a–E2j, E3–E7, E9), E8 hội đồng đề xuất PASS, chưa có human_override. Các round trước nằm ở lịch sử commit (lượt chấm 3 PASS ở b427f2af).
