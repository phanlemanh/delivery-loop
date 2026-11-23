---
schema_version: 2
feature_slug: release-3-1-1
verdict: BLOCKED
failed_evals: ["E1","E2h","E2f","E2g"]
reason: "Sáu lệnh suite (E2a, E2b, E2c, E2d, E2e, E2i) dừng ngay ở bước kiểm môi trường vì máy chạy Node v26.7.0 còn kho khai Node 24 trong .nvmrc; suite chưa chạy nên không có kết quả đạt hay trượt. Cần đổi sang Node 24 rồi chạy lại đúng các lệnh đã ghim, không phải sửa mã."
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: fb719b2216c17f39676be67ed86edcf24c5b04be
human_signoff:
---

# Evidence Report: release-3-1-1

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | FAIL |
| E2a | AC-2 | test | BLOCKED |
| E2b | AC-2 | test | BLOCKED |
| E2c | AC-2 | test | BLOCKED |
| E2d | AC-2 | test | BLOCKED |
| E2e | AC-2 | test | BLOCKED |
| E2f | AC-2 | test | FAIL |
| E2g | AC-2 | test | FAIL |
| E2h | AC-2 | test | FAIL |
| E2i | AC-2 | test | BLOCKED |
| E2j | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | judgment | đề xuất FAIL, chờ người quyết ở Cổng 2 |
| E9 | AC-9 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-3-1-1-E1-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-23T00:40:27Z
  output: |
    Lệnh vùng 3 của suite plugins thoát khác 0 và không in dòng nào qua bộ lọc FAIL / Results.
    Chưa đọc được ca nào đỏ; chưa kết luận P200 xanh hay đỏ. Cần chạy lại không qua bộ lọc để thấy ca đỏ.

- eval: E2a
  run_id: minted-release-3-1-1-E2a-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-23T00:40:27Z
  output: |
    node lệch: đang chạy v26.7.0, kho khai 24 (.nvmrc) — đổi Node rồi chạy lại
    Suite chưa chạy: lỗi môi trường, không phải kết quả test.

- eval: E2b
  run_id: minted-release-3-1-1-E2b-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-23T00:40:27Z
  output: |
    node lệch: đang chạy v26.7.0, kho khai 24 (.nvmrc) — đổi Node rồi chạy lại
    Suite chưa chạy: lỗi môi trường, không phải kết quả test.

- eval: E2c
  run_id: minted-release-3-1-1-E2c-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-23T00:40:27Z
  output: |
    node lệch: đang chạy v26.7.0, kho khai 24 (.nvmrc) — đổi Node rồi chạy lại
    Suite chưa chạy: lỗi môi trường, không phải kết quả test.

- eval: E2d
  run_id: minted-release-3-1-1-E2d-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-23T00:40:27Z
  output: |
    node lệch: đang chạy v26.7.0, kho khai 24 (.nvmrc) — đổi Node rồi chạy lại
    Suite chưa chạy: lỗi môi trường, không phải kết quả test.

- eval: E2e
  run_id: minted-release-3-1-1-E2e-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.test.hooks
  verified_at: 2026-11-23T00:40:27Z
  output: |
    node lệch: đang chạy v26.7.0, kho khai 24 (.nvmrc) — đổi Node rồi chạy lại
    Suite chưa chạy: lỗi môi trường, không phải kết quả test.

- eval: E2f
  run_id: minted-release-3-1-1-E2f-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-23T00:40:27Z
  output: |
    Lệnh vùng 1 của suite plugins thoát khác 0 và không in dòng nào qua bộ lọc FAIL / Results.
    Chưa đọc được ca nào đỏ.

- eval: E2g
  run_id: r1-l8-1-20261123004027
  exit_code: 1
  baseline: red
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-23T00:40:27Z
  output: |
    Lệnh vùng 2 của suite plugins thoát khác 0 và không in dòng nào qua bộ lọc FAIL / Results.
    Chưa đọc được ca nào đỏ.

- eval: E2h
  run_id: minted-release-3-1-1-E2h-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-23T00:40:27Z
  output: |
    Lệnh vùng 3 của suite plugins thoát khác 0 và không in dòng nào qua bộ lọc FAIL / Results.
    Chưa đọc được ca nào đỏ.

- eval: E2i
  run_id: minted-release-3-1-1-E2i-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.test.workflows
  verified_at: 2026-11-23T00:40:27Z
  output: |
    node lệch: đang chạy v26.7.0, kho khai 24 (.nvmrc) — đổi Node rồi chạy lại
    Suite chưa chạy: lỗi môi trường, không phải kết quả test.

- eval: E2j
  run_id: minted-release-3-1-1-E2j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-11-23T00:40:27Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E3
  run_id: minted-release-3-1-1-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T00:40:27Z
  output: |
    XANH: hai tập bằng nhau

- eval: E4
  run_id: minted-release-3-1-1-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T00:40:27Z
  output: |
    XANH: diagram-design không đổi, giữ số

- eval: E5
  run_id: minted-release-3-1-1-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T00:40:27Z
  output: |
    XANH: hai gói chỉ đổi dòng version

- eval: E6
  run_id: minted-release-3-1-1-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T00:40:27Z
  output: |
    XANH: đúng 0 tệp đổi như ghi chú 3.1.1 kể

- eval: E7
  run_id: minted-release-3-1-1-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-1-1/chay.sh
  verified_at: 2026-11-23T00:40:27Z
  output: |
    XANH: thẻ mang đúng bản vá #26 — 4 tệp vật + 5 tệp khai, phần còn lại trùng byte 1a887948d7933a3a21c660cecdfc2d0c1e1ffac9

- eval: E9
  run_id: r1-l16-1-20261123004027
  exit_code: 0
  baseline: green
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-23T00:40:27Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v3.1.0 (0a93a5b9) cài đúng tag

### Judgment

Panel đề xuất cho E8 (ba góc nhìn đều cho FAIL cùng một lý do; người quyết ở Cổng 2, ô human_override để trống).

- eval: E8
  judged_by: judge panel (fresh context)
  proposal: FAIL
  votes:
    - domain-correctness: FAIL — Vế (3) sai: đoạn «Vì sao 3.1.1» viết «bản này không có cờ, khoá cấu hình hay lệnh mới», nhưng chính mục đó nói lệnh gộp «nhận cờ `--loi`», tức có cờ mới. Context của hợp đồng release-3-1-1 chỉ nói «không thêm khoá cấu hình, lệnh hay bề mặt mới», không có chữ «cờ». Vế (0), (1), (2) khớp nguồn; các số 3 g 52, 1 g 14, 2 lần gộp, 80 488 out-token, 46,4 / 41,1 / 12,6 %, 64 phút, 59,7 + 66,9 + 63,2 = 189,8 phút và 2 lượt gọi người đều khớp.
    - operational-feasibility: FAIL — Vế (3) sai. Đoạn «Vì sao 3.1.1» viết «bản này không có cờ, khoá cấu hình hay lệnh mới», trong khi Context chỉ nói «không thêm khoá cấu hình, lệnh hay bề mặt mới» và chính mục 3.1.1 cùng hợp đồng va-chu-ky đều khai cờ mới `--loi`. Vế (0), (1), (2) khớp nguồn.
    - spec-alignment: FAIL — Vế (3) sai: CHANGELOG nói rộng hơn Context của hợp đồng và tự mâu thuẫn với dòng «lệnh nhận cờ `--loi`». Vế (0), (1), (2) đúng: chữ trích khớp, số khớp nguồn đếm, mục lớp chép CI nói «không chép gì».
  required_evidence:
    - Sửa đoạn «Vì sao 3.1.1» ở dòng 25-26 của CHANGELOG.md cho khớp Context của `_acceptance/release-3-1-1/contract.md`: «không thêm khoá cấu hình, lệnh hay bề mặt mới», và nói rõ `--loi` là cờ mới của lệnh gộp theo lời, hoặc bỏ chữ «cờ» khỏi câu phủ định. Đọc lại đoạn đó phải không còn mâu thuẫn với dòng «lệnh nhận cờ `--loi`» ở mục con va-chu-ky-giu-cho-lenh-gop.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả HEAD lẫn baseline, chứng minh harness chứ không phải tính năng; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- node plugins/acceptance-gate/scripts/product-map.mjs --root . --check (E2j)
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc (E9)

Ba lệnh pipeline lọc của suite plugins (vùng 1, 2, 3) không gắn eval nào ngoài E1, E2f, E2g, E2h đã kê ở bảng; cả ba thoát khác 0 mà đầu ra qua bộ lọc rỗng nên chưa biết ca nào đỏ.

Baseline không đo:

- bash _acceptance/release-3-1-1/chay.sh cua-so: bo qua baseline: tep _acceptance/release-3-1-1/chay.sh co o cay dang kiem nhung chua co o merge-base 1a887948d7933a3a21c660cecdfc2d0c1e1ffac9 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-1-1/chay.sh dd-giu: bo qua baseline: tep _acceptance/release-3-1-1/chay.sh co o cay dang kiem nhung chua co o merge-base 1a887948d7933a3a21c660cecdfc2d0c1e1ffac9 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-1-1/chay.sh goi-doi: bo qua baseline: tep _acceptance/release-3-1-1/chay.sh co o cay dang kiem nhung chua co o merge-base 1a887948d7933a3a21c660cecdfc2d0c1e1ffac9 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-1-1/chay.sh lop-chep: bo qua baseline: tep _acceptance/release-3-1-1/chay.sh co o cay dang kiem nhung chua co o merge-base 1a887948d7933a3a21c660cecdfc2d0c1e1ffac9 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-1-1/chay.sh vat-va: bo qua baseline: tep _acceptance/release-3-1-1/chay.sh co o cay dang kiem nhung chua co o merge-base 1a887948d7933a3a21c660cecdfc2d0c1e1ffac9 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lần chạy đều đồng đều (không eval nào có runs lớn hơn 1)

## Iterations

Round 1: E1, E2f, E2g, E2h thoát khác 0 (đầu ra qua bộ lọc rỗng, chưa rõ ca đỏ); E2a, E2b, E2c, E2d, E2e, E2i không chạy được vì Node v26.7.0 lệch .nvmrc (Node 24); E8 đề xuất FAIL do câu «không có cờ» trong CHANGELOG. Verdict BLOCKED: cần đổi sang Node 24 rồi chạy lại.
