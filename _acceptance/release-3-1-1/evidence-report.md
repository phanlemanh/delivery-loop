---
schema_version: 2
feature_slug: release-3-1-1
verdict: REJECT
failed_evals: ["E1","E2h"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: dfb81b9f7c78e90f4ed180cf37f0886a88f59103
human_signoff:
---

# Evidence Report: release-3-1-1

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | FAIL |
| E2a | AC-2 | test | PASS |
| E2b | AC-2 | test | PASS |
| E2c | AC-2 | test | PASS |
| E2d | AC-2 | test | PASS |
| E2e | AC-2 | test | PASS |
| E2f | AC-2 | test | PASS |
| E2g | AC-2 | test | PASS |
| E2h | AC-2 | test | FAIL |
| E2i | AC-2 | test | PASS |
| E2j | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | judgment | đề xuất PASS (hội đồng 3/3), chờ người chốt ở Cổng 2 |
| E9 | AC-9 | test | PASS |

Lệnh fail không gắn riêng eval nào: không có. Lệnh duy nhất đỏ là lệnh của vùng 3 suite plugins, chung cho E1 và E2h.

## Evidence

- eval: E1
  run_id: minted-release-3-1-1-E1-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-23T00:50:46Z
  output: |
    FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed

- eval: E2a
  run_id: minted-release-3-1-1-E2a-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-23T00:50:46Z
  output: |
    Results: 841 passed, 0 failed

- eval: E2b
  run_id: minted-release-3-1-1-E2b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-23T00:50:46Z
  output: |
    Results: 47 passed, 0 failed

- eval: E2c
  run_id: minted-release-3-1-1-E2c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-23T00:50:46Z
  output: |
    Results: 47 passed, 0 failed

- eval: E2d
  run_id: bfvhr4gbr
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-23T00:50:46Z
  output: |
    Results: 47 passed, 0 failed

- eval: E2e
  run_id: minted-release-3-1-1-E2e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-11-23T00:50:46Z
  output: |
    Results: 71 passed, 0 failed

- eval: E2f
  run_id: minted-release-3-1-1-E2f-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-23T00:50:46Z
  output: |
    Results: all plugin tests passed

- eval: E2g
  run_id: r2-l8-1-20261123005046
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-23T00:50:46Z
  output: |
    Results: all plugin tests passed

- eval: E2h
  run_id: minted-release-3-1-1-E2h-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-23T00:50:46Z
  output: |
    FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 1 failed

- eval: E2i
  run_id: minted-release-3-1-1-E2i-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-11-23T00:50:46Z
  output: |
    Results: all workflow tests passed

- eval: E2j
  run_id: minted-release-3-1-1-E2j-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-11-23T00:50:46Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E3
  run_id: minted-release-3-1-1-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T00:50:46Z
  output: |
    XANH: hai tập bằng nhau

- eval: E4
  run_id: minted-release-3-1-1-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T00:50:46Z
  output: |
    XANH: diagram-design không đổi, giữ số

- eval: E5
  run_id: minted-release-3-1-1-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T00:50:46Z
  output: |
    XANH: hai gói chỉ đổi dòng version

- eval: E6
  run_id: minted-release-3-1-1-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T00:50:46Z
  output: |
    XANH: đúng 0 tệp đổi như ghi chú 3.1.1 kể

- eval: E7
  run_id: minted-release-3-1-1-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T00:50:46Z
  output: |
    XANH: thẻ mang đúng bản vá #26 — 4 tệp vật + 5 tệp khai, phần còn lại trùng byte 1a887948d7933a3a21c660cecdfc2d0c1e1ffac9

- eval: E9
  run_id: r2-l16-1-20261123005046
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-23T00:50:46Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v3.1.0 (0a93a5b9) cài đúng tag

### Hội đồng chấm E8 (đề xuất — human_override để trống)

- eval: E8
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  proposal: PASS
  human_override:  # chi nguoi ghi

- domain-correctness: PASS — Cả bốn vế khớp nguồn: «Gốc:», «Vật:», giới hạn khai trước và câu trích Ngoài-4 là chữ của hợp đồng va-chu-ky-giu-cho-lenh-gop; "6 mục" khớp 6 hàng Ngoài trong Notes và 6 dòng revisit gate2; bảng năm dòng đối chiếu được với nguồn đếm; lớp chép CI và hai đoạn «Vì sao 3.1.1» / «Ai bị ảnh hưởng» khớp acceptance-init.md và Context của hợp đồng release-3-1-1.
- operational-feasibility: PASS — Năm dòng số tính lại ra đúng: ba lượt ghim lại 59,7 + 66,9 + 63,2 = 189,8 phút; dòng 4 ra 46,4 / 41,1 / 12,6 trên 80 488 out-token; dòng 5 ra 3848 s ≈ 64 phút; dòng 1 ra 3 g 52, 1 g 14 và 2 lần gộp nhánh chính vào nhánh. Mục «không chép gì» không kể tệp nào của INIT-CI-COPY-LIST; hai đoạn «Vì sao 3.1.1» / «Ai bị ảnh hưởng» khai đổi hành vi (cờ --loi, bị chặn kèm lệnh giải) và nêu kho không cài dispatch hoặc không bật gop_theo_loi_ky thì không đổi.
- spec-alignment: PASS — «Gốc:», «Vật:» và câu Ngoài-4 trích đúng chữ hợp đồng; 6 mục chọn đúng với sáu dòng gate2 Ngoài-1 đến Ngoài-6 của sổ; giờ 3 g 52 và 1 g 14 khớp bảng commit; lượt chấm 1 khớp round-tally; ba làn ghim lại khớp repin-do và repin; 3848 s ≈ 64 phút khớp wall:; hai lần gọi người khớp sổ; hai lần gộp nhánh chính khớp do-dong-1.md; căn cứ số patch đúng với Context của hợp đồng release-3-1-1, mục còn khai thêm cờ --loi.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi).

Baseline khong do: toan bo eval round nay, vi baseline carried tu round 1; moi block ghi baseline n-a.

Eval khong-phan-biet (pass tren ca HEAD lan baseline, chung minh harness chu khong phai feature; viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y):
- E2j (node plugins/acceptance-gate/scripts/product-map.mjs --root . --check)
- E9 (node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: BLOCKED — tác tử chấm chạy Node 26; ghi sổ, sửa câu «Vì sao 3.1.1» theo hội đồng E8.
Round 2: E1, E2h failed — vùng 3 suite plugins đỏ ở ca P179 (MBC E6 ledger known-limits), đột biến MUTANT-6 ghim «site thieu so ban» ở feature-loop/skills/feature-loop/SKILL.md; ca P200 cùng vùng không được xác nhận xanh. Returned to implementation.
