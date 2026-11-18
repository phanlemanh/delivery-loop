---
schema_version: 2
feature_slug: release-3-0-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 199784df3a6913b56bc27d06004763ddbc30670d
human_signoff: Phan Le Manh 2026-11-18 — ký với 10 known-limits (Ngoài-2/3/5/6/7/8/12/13/14/15); Ngoài-1, Ngoài-9 chấp nhận không sửa; Ngoài-4, Ngoài-10, Ngoài-11 mở hợp đồng mới; đồng ý phạm vi đã cắt; phê hết quyết định ghi sau Cổng Phạm vi
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
| E4 | AC-4 | script | PASS (carry-forward, round 1) |
| E5 | AC-5 | script | PASS (carry-forward, round 1) |
| E6 | AC-6 | script | PASS (carry-forward, round 2) |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | script | PASS (carry-forward, round 1) |
| E9 | AC-9 | script | PASS (carry-forward, round 1) |
| E10 | AC-10 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E11 | AC-11 | script | PASS (carry-forward, round 2) |
| E12 | AC-12 | test | PASS (carry-forward, round 2) |

## Evidence

- eval: E1
  run_id: minted-release-3-0-0-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-18T00:15:22Z
  output: |
    Results: all plugin tests passed

- eval: E2a
  run_id: minted-release-3-0-0-E2a-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-18T00:15:22Z
  output: |
    Results: 841 passed, 0 failed

- eval: E2b
  run_id: minted-release-3-0-0-E2b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-18T00:15:22Z
  output: |
    Results: 45 passed, 0 failed

- eval: E2c
  run_id: minted-release-3-0-0-E2c-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-18T00:15:22Z
  output: |
    Results: 45 passed, 0 failed

- eval: E2d
  run_id: minted-release-3-0-0-E2d-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-18T00:15:22Z
  output: |
    Results: 45 passed, 0 failed

- eval: E2e
  run_id: minted-release-3-0-0-E2e-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-11-18T00:15:22Z
  output: |
    Results: 71 passed, 0 failed

- eval: E2f
  run_id: minted-release-3-0-0-E2f-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-18T00:15:22Z
  output: |
    (rỗng — bộ lọc chỉ in dòng lỗi và dòng tổng kết, vùng 1 không in dòng nào)

- eval: E2g
  run_id: minted-release-3-0-0-E2g-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-18T00:15:22Z
  output: |
    Results: all plugin tests passed

- eval: E2h
  run_id: minted-release-3-0-0-E2h-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-18T00:15:22Z
  output: |
    Results: all plugin tests passed

- eval: E2i
  run_id: minted-release-3-0-0-E2i-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-11-18T00:15:22Z
  output: |
    Results: all workflow tests passed

- eval: E2j
  run_id: minted-release-3-0-0-E2j-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-11-18T00:15:22Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E3
  run_id: minted-release-3-0-0-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel300_cua_so
  verified_at: 2026-11-18T00:15:22Z
  output: |
    XANH: hai tập bằng nhau

- eval: E7
  run_id: minted-release-3-0-0-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-18T00:15:22Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.39.0 (0c4e503b) cài đúng tag

### Carry-forward (delta không chạm paths của eval, round này không chạy lại)

- eval: E4
  run_id: minted-release-3-0-0-E4-r1
  exit_code: 0
  verifier: config:executors.script.rel300_cay_kich_ban
  verified_at: 2026-11-17T17:15:01Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-release-3-0-0-E5-r1
  exit_code: 0
  verifier: config:executors.script.rel300_vi_phan
  verified_at: 2026-11-17T17:15:01Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-release-3-0-0-E6-r2
  exit_code: 0
  verifier: config:executors.script.rel300_hang_loi
  verified_at: 2026-11-17T22:43:55Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-release-3-0-0-E8-r1
  exit_code: 0
  verifier: config:executors.script.rel300_guide_ci
  verified_at: 2026-11-17T17:15:01Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-release-3-0-0-E9-r1
  exit_code: 0
  verifier: config:executors.script.rel300_don_dau_vet
  verified_at: 2026-11-17T17:15:01Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-release-3-0-0-E11-r2
  exit_code: 0
  verifier: config:executors.script.rel300_duong_cu
  verified_at: 2026-11-17T22:43:55Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-release-3-0-0-E12-r2
  exit_code: 0
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-11-17T22:43:55Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

### Judgment

Hội đồng đề xuất (ba lăng kính), để trống human_override cho người chốt ở Cổng 2. Phiếu bầu:

- domain-correctness: PASS — cả bốn vế đúng khi đối chiếu nguồn: dòng «Gốc:» và gạch «Vật:» của sáu mục con khớp opportunity.md và hợp đồng; các số giới hạn khớp Notes; «Ai bị ảnh hưởng» khớp bang-ten.json và Context; ngưỡng thực tế ghi «CHƯA ĐẠT»; đoạn «Kho tiêu thụ làm gì khi nhận» khớp khối mẫu GUIDE §5.3.
- operational-feasibility: PASS — sáu mục con khớp nguồn, các số giới hạn khớp mục Notes, không câu nào nói ngưỡng thực tế đã đạt (ghi «CHƯA ĐẠT», «chưa có commit cài», dòng hiệu chuẩn N=0), đoạn kho tiêu thụ khớp GUIDE §5.3.
- spec-alignment: FAIL — vế 1 sai ở mục con gộp ba vòng (vòng hai đến bốn): câu «mỗi vòng sau nhận phần «Out of scope» của vòng trước» không phải chữ của opportunity.md nào, mà là câu khái quát do người soạn viết. Vế 2, 3 và 4 đúng, các số giới hạn khai khớp Notes của từng hợp đồng.

Bằng chứng còn thiếu theo lăng kính spec-alignment: sửa dòng «Gốc:» của mục con «Bộ kiểm thôi bám bố cục phẳng, vòng hai đến bốn» (CHANGELOG.md dòng 96-97) thành chữ chép từ Gốc của từng opportunity.md (vòng hai: `kit/_acceptance/goi-cheo-loi-dieu-phoi/ — vòng liền trước, cùng lớp «chỉ gãy khi đổi nhà»`, dòng 20; vòng ba: `kit/_acceptance/phan-du-bo-cuc-moi/ — vòng hai` kèm K4-LT, K4-TB, K4-MP, K4-RG, dòng 20-22; vòng bốn: `kit/_acceptance/phan-du-bo-cuc-moi-vong-ba/ — vòng ba` kèm K4-DN và lượt đo B2 sau #506, dòng 20-21), rồi đọc lại AC-10 phần (i) đối chiếu ba tệp opportunity.md.

- eval: E10
  judged_by: judge panel (3 lăng kính, fresh context)
  verdict: PASS
  rationale: Hai trên ba lăng kính đề xuất PASS; lăng kính spec-alignment bất đồng ở một câu «Gốc:» khái quát trong CHANGELOG, được ghi đầy đủ ở trên để người chốt.
  required_evidence:
    - Đối chiếu dòng «Gốc:» mục con vòng hai đến bốn (CHANGELOG.md dòng 96-97) với ba tệp opportunity.md như lăng kính spec-alignment nêu.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

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
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: các eval máy đạt hết, E10 chưa chốt, 12 mục ngoài hợp đồng — PENDING-JUDGMENT, trả về triển khai.
Round 2: vùng 3 đỏ vì P179 (sổ known-limits thiếu hàng) — REJECT, trả về triển khai; đã thêm mười hàng sổ known-limits và hai câu feature-loop của CHANGELOG.
Round 3: mọi eval máy xanh ở a4151d5b (E4, E5, E6, E8, E9, E11, E12 mang từ round trước); E10 có đề xuất PASS từ hội đồng kèm một ý bất đồng ở spec-alignment, chờ người chốt.

### Re-pin lần 1 — 2026-11-18, do PR #1: sửa ca kiểm theo bố cục mới sau pin (run-tests.sh P196, kiem-ban-cai.ca.mjs, design-floor, design-eval)
run_id: repin-20261118T020047Z-29249
sha: 9d98da111a10081957dfbfd902a1ed7ccb5339ae · suites: 11 lệnh exit 0 · evals: 20/20 eval máy đạt kỳ vọng · ngoài làn máy: E10 (E10 không khai paths) · AC không có chốt máy: AC-10

### Re-pin lần 2 — 2026-11-18, do PR #2: sửa sáu ca kiểm lấy bản base theo bố cục của chính base (DP4-08, DP3-03, DP3-11-do, P150)
run_id: repin-20261118T145551Z-16571
sha: 199784df3a6913b56bc27d06004763ddbc30670d · suites: 11 lệnh exit 0 · evals: 20/20 eval máy đạt kỳ vọng · ngoài làn máy: E10 (E10 không khai paths) · AC không có chốt máy: AC-10
