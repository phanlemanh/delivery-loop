---
schema_version: 2
feature_slug: release-3-1-1
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 188f2abafac364e545955d8db5677fde8a2ccc1a
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
  run_id: minted-release-3-1-1-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-23T02:01:46Z
  output: |
    Results: all plugin tests passed

- eval: E2a
  run_id: minted-release-3-1-1-E2a-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-23T02:01:46Z
  output: |
    Results: 841 passed, 0 failed

- eval: E2b
  run_id: minted-release-3-1-1-E2b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-23T02:01:46Z
  output: |
    Results: 47 passed, 0 failed

- eval: E2c
  run_id: minted-release-3-1-1-E2c-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-23T02:01:46Z
  output: |
    Results: 47 passed, 0 failed

- eval: E2d
  run_id: minted-release-3-1-1-E2d-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-23T02:01:46Z
  output: |
    Results: 47 passed, 0 failed

- eval: E2e
  run_id: minted-release-3-1-1-E2e-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-11-23T02:01:46Z
  output: |
    Results: 71 passed, 0 failed

- eval: E2f
  run_id: minted-release-3-1-1-E2f-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-23T02:01:46Z
  output: |
    Results: all plugin tests passed

- eval: E2g
  run_id: minted-release-3-1-1-E2g-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-23T02:01:46Z
  output: |
    Results: all plugin tests passed

- eval: E2h
  run_id: minted-release-3-1-1-E2h-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-23T02:01:46Z
  output: |
    Results: all plugin tests passed

- eval: E2i
  run_id: minted-release-3-1-1-E2i-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-11-23T02:01:46Z
  output: |
    Results: all workflow tests passed

- eval: E2j
  run_id: minted-release-3-1-1-E2j-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-11-23T02:01:46Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E3
  run_id: minted-release-3-1-1-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T02:01:46Z
  output: |
    XANH: hai tập bằng nhau

- eval: E4
  run_id: minted-release-3-1-1-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T02:01:46Z
  output: |
    XANH: diagram-design không đổi, giữ số

- eval: E5
  run_id: minted-release-3-1-1-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T02:01:46Z
  output: |
    XANH: hai gói chỉ đổi dòng version

- eval: E6
  run_id: minted-release-3-1-1-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T02:01:46Z
  output: |
    XANH: đúng 0 tệp đổi như ghi chú 3.1.1 kể

- eval: E7
  run_id: minted-release-3-1-1-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T02:01:46Z
  output: |
    XANH: thẻ mang đúng bản vá #26 — 4 tệp vật + 5 tệp khai, phần còn lại trùng byte 1a887948d7933a3a21c660cecdfc2d0c1e1ffac9

- eval: E9
  run_id: r3-l16-1-20261123020146
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-23T02:01:46Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v3.1.0 (0a93a5b9) cài đúng tag

### Judgment

Hội đồng đề xuất cho E8 (rationale từng judge nằm dưới; ô human_override để trống cho người quyết).

- eval: E8
  judged_by: judge-panel (fresh context, 3 lens)
  verdict: PASS
  rationale: Ba lens cùng đồng thuận, cả bốn vế khớp nguồn hợp đồng va-chu-ky-giu-cho-lenh-gop và các số đếm.
  human_override:  # chi nguoi ghi

- domain-correctness: PASS — Cả bốn vế khớp nguồn. (0) Dòng «Gốc:», gạch «Vật:» và Ngoài-4 trích đúng chữ hợp đồng va-chu-ky-giu-cho-lenh-gop. Giới hạn khai trước khớp Notes, và «6 mục» khớp sáu dòng `gate2` Ngoài-1 đến Ngoài-6. (1) Mọi ô trong bảng năm dòng khớp nguồn đếm, kể cả các phép tính: dòng 1 làm-xong→ký 17:05:56→20:58:33 là 3 g 52, ký→gộp 20:58:33→22:12:44 là 1 g 14, hai lần gộp nhánh chính, một lượt chấm PASS; ba làn ghim lại 59,7 + 66,9 + 63,2 = 189,8 phút; out-token tổng 80 488, chia 46,4 / 41,1 / 12,6 %; phút máy của lượt chấm `wall:` 3848 s ≈ 64 phút; gọi người 2 lần (Phạm vi, Bằng chứng). (2) «Không chép gì» khớp khối INIT-CI-COPY-LIST, vì khối không liệt kê tệp nào mà bản vá đổi (gop.mjs, dieu-phoi.mjs, signoff.md, SKILL.md, plugin.json). (3) «Vì sao 3.1.1» và «Ai bị ảnh hưởng» khai thẳng đổi hành vi lệnh gộp theo lời và việc thiếu `--loi` bị chặn kèm lệnh giải; kho không cài gói điều phối hoặc không bật khoá thì không đổi hành vi, và căn cứ chọn patch khớp Context của hợp đồng release-3-1-1.
- operational-feasibility: PASS — Cả bốn vế khớp nguồn trong danh sách input. (0) Dòng «Gốc:», gạch «Vật:», trích Ngoài-4 và giới hạn khai trước là chữ của hợp đồng va-chu-ky-giu-cho-lenh-gop; «1 + 6» khớp Notes và 6 dòng `gate2` Ngoài-1…6 ngày 22/11. (1) Bảng số khớp nguồn: 3g52 và 1g14 khớp do-dong-1.md, 2 lần gộp nhánh chính; 80 488 out-token với 46,4/41,1/12,6 % tính ra từ bảng vai trò; 64 phút từ `wall: 3848s`; ba làn ghim lại 59,7 + 66,9 + 63,2 = 189,8 phút; gọi người 2/0 khớp sổ quyết định. (2) Mục nói «không chép gì» và không kể tệp nào; bốn tệp #26 đổi (signoff.md, gop.mjs, dieu-phoi.mjs, SKILL.md) không nằm trong khối INIT-CI-COPY-LIST. (3) «Vì sao 3.1.1» và «Ai bị ảnh hưởng» nói thẳng đổi hành vi của lệnh gộp theo lời và việc gọi tay thiếu `--loi` bị chặn kèm lệnh giải; kho không cài dispatch hoặc không bật `feature_loop.gop_theo_loi_ky` thì không đổi hành vi; căn cứ patch đúng với Context của hợp đồng release-3-1-1.
- spec-alignment: PASS — Cả bốn vế khớp nguồn. Về vế (0), dòng Gốc, gạch Vật, câu trích Ngoài-4, giới hạn khai trước (1) và 6 mục Known limits đều trùng chữ của hợp đồng, và sổ quyết định có đúng 6 dòng gate2 «ghi Known limits». Về vế (1), tính lại: out-token 37 321 + 33 062 + 10 105 = 80 488 (46,4 / 41,1 / 12,6 %), wall 3848 s ≈ 64 phút, ba làn ghim lại 59,7 + 66,9 + 63,2 = 189,8 phút, 3 g 52 / 1 g 14 và 2 lần gộp nhánh chính khớp do-dong-1.md, round-tally là 1 lượt PASS với 0 bị chặn, và gọi người là 2 (gate1 + gate2). Về vế (2), mục nói «không chép gì» và không kể tệp nào của khối INIT-CI-COPY-LIST. Về vế (3), «Vì sao 3.1.1» và «Ai bị ảnh hưởng» khai thẳng hành vi đổi (gọi tay thiếu `--loi` thì bị chặn kèm lệnh giải) và nói kho không cài dispatch hoặc không bật `gop_theo_loi_ky` thì không đổi hành vi. Căn cứ chọn patch khớp Context của hợp đồng.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline khong do: mọi eval máy ghi `baseline: n-a` vì evals.yaml không đổi từ lần đo baseline cuối (round 1).

Eval không-phân-biệt (pass trên cả HEAD lẫn baseline; chứng minh harness chứ không chứng minh feature — viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E2j — `node plugins/acceptance-gate/scripts/product-map.mjs --root . --check`
- E9 — `node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc`

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: BLOCKED — tác tử chấm chạy Node 26 (hạ tầng), ghi sổ; chưa có phán quyết về vật.
Round 2: REJECT ở ca P179 — ghi bằng chứng, thêm bốn hàng sổ giới hạn, hạt giống bước sổ sau lượt chấm.
Round 3: mọi eval máy và E8 đạt trên commit 188f2aba; ca P179 xanh. Verdict PASS.
