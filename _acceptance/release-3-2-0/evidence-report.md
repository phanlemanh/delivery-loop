---
schema_version: 2
feature_slug: release-3-2-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e90432689cfb3290010962c7451e5b90fdcd4071
human_signoff: Phan Le Manh 2026-11-28
---

# Evidence Report: release-3-2-0

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
| E10 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-release-3-2-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-28T08:36:18Z
  output: |
    Results: all plugin tests passed

- eval: E2a
  run_id: minted-release-3-2-0-E2a-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-28T08:36:18Z
  output: |
    Results: 841 passed, 0 failed

- eval: E2b
  run_id: minted-release-3-2-0-E2b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-28T08:36:18Z
  output: |
    mảnh mjs:1/3 chạy xong, không dòng lỗi

- eval: E2c
  run_id: minted-release-3-2-0-E2c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-28T08:36:18Z
  output: |
    mảnh mjs:2/3 chạy xong, không dòng lỗi

- eval: E2d
  run_id: minted-release-3-2-0-E2d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-28T08:36:18Z
  output: |
    Results: 47 passed, 0 failed

- eval: E2e
  run_id: minted-release-3-2-0-E2e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-11-28T08:36:18Z
  output: |
    Results: 71 passed, 0 failed

- eval: E2f
  run_id: minted-release-3-2-0-E2f-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-28T08:36:18Z
  output: |
    Results: all plugin tests passed

- eval: E2g
  run_id: minted-release-3-2-0-E2g-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-28T08:36:18Z
  output: |
    Results: all plugin tests passed

- eval: E2h
  run_id: minted-release-3-2-0-E2h-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-28T08:36:18Z
  output: |
    Results: all plugin tests passed

- eval: E2i
  run_id: minted-release-3-2-0-E2i-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-11-28T08:36:18Z
  output: |
    Results: all workflow tests passed

- eval: E2j
  run_id: minted-release-3-2-0-E2j-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-11-28T08:36:18Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E3
  run_id: minted-release-3-2-0-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-2-0/chay.sh
  verified_at: 2026-11-28T08:36:18Z
  output: |
    XANH: hai tập bằng nhau

- eval: E4
  run_id: minted-release-3-2-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-2-0/chay.sh
  verified_at: 2026-11-28T08:36:18Z
  output: |
    XANH: diagram-design không đổi, giữ số

- eval: E5
  run_id: minted-release-3-2-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-2-0/chay.sh
  verified_at: 2026-11-28T08:36:18Z
  output: |
    XANH: hai gói chỉ đổi dòng version

- eval: E6
  run_id: minted-release-3-2-0-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-2-0/chay.sh
  verified_at: 2026-11-28T08:36:18Z
  output: |
    XANH: đúng 0 tệp đổi như ghi chú 3.2.0 kể

- eval: E7
  run_id: minted-release-3-2-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-2-0/chay.sh
  verified_at: 2026-11-28T08:36:18Z
  output: |
    XANH: 3/3 hồ sơ của chiến dịch ghim lại còn mới ở HEAD

- eval: E8
  judged_by: hội đồng ba lăng kính (domain-correctness, operational-feasibility, spec-alignment) — đề xuất của máy
  verdict: PASS
  rationale: Hai lăng kính domain-correctness và operational-feasibility đối chiếu năm vế của mục CHANGELOG với nguồn trong danh sách input và thấy khớp hết; lăng kính spec-alignment không thấy chỗ sai rõ ràng nhưng nêu bốn điểm chưa đủ tệp để phân xử (xem dưới).
  votes:
    - domain-correctness: PASS — Đối chiếu từng vế với nguồn trong danh sách Input, cả năm vế khớp. Dòng «Gốc:», gạch «Vật:» và các giới hạn trích của sáu mục con là chữ của hợp đồng từng hồ sơ. Số giới hạn chọn ở Cổng Bằng chứng khớp Notes và sổ `gate2` (5/4, 5/3, 4/4, 15/14, 7/6, 2/1). Năm dòng số tính lại đều ra đúng số trong bảng: out-token và tỉ lệ vai trò (kể cả gộp 597 063), phút máy, trung vị 1 g 49 và 0 g 15, 12 lượt gọi người, 1/8 lượt bị hạ tầng đốt, làn ghim lại 70,8 phút / 57 lệnh. Mục «không chép gì» của lớp chép CI không kể tệp nào của khối INIT-CI-COPY-LIST. Bốn ca của (3), căn cứ minor và bộ tên tiếng Anh sau V1 đều đúng với hợp đồng. Tên cũ chỉ còn ở câu nói tệp tên cũ bị từ chối; `gop` và `thu-tu-gop` xuất hiện làm tên lệnh, được giữ theo AC-8 của hợp đồng V1.
    - operational-feasibility: PASS — Đối chiếu năm vế đều khớp nguồn trong danh sách input. Dòng Gốc, gạch Vật và giới hạn trích của sáu mục con là chữ của từng hợp đồng. Số giới hạn chọn ở Cổng Bằng chứng khớp Notes và các dòng gate2 (5/4, 5/3, 4/4, 15/14, 7/6, 2/1). Các số trong bảng năm dòng tính lại đều đúng (tổng 597 063 out-token và tỉ lệ 46,9/38,8/14,2 %; phút 63/62/68/181/58/63 và tổng 495; trung vị 1 g 49 và 0 g 15). Mục lớp chép CI nói «không chép gì», đoạn lý do chọn minor khớp Context, tên khoá và tên quyền là bộ tên tiếng Anh sau V1.
    - spec-alignment: UNCERTAIN — Đối chiếu được phần lớn mà không thấy chỗ sai rõ ràng: Gốc, Vật và các câu giới hạn trích khớp chữ hợp đồng; số mục chọn ở Cổng Bằng chứng khớp Notes và dòng gate2; bảng năm dòng và các số gộp (597 063 token, 495 phút, trung vị 1 g 49 và 0 g 15) tính lại đều khớp; bốn ca và căn cứ chọn minor đủ và đúng; tên quyền tiếng Anh đúng, tên cũ không xuất hiện. Còn bốn điểm mà các tệp được liệt kê không đủ để phân xử nên không thể PASS: (1) số «1 giới hạn khai trước» của nang-repo-setup-0-10-4 trong khi Notes hợp đồng có hai câu khai trước; (2) «2 lượt ngoài thiết kế» của DL2 không có dòng sổ nào; (3) bảng dự báo của giam-sat-doc-ban-uy-quyen không có trong Notes hợp đồng; (4) chữ «mọi trạng thái hồ sơ» của `--chi-xet` rộng hơn AC-5 chỉ nêu `verified` và `signed-off`.
  required_evidence:
    - Chốt cách đếm «giới hạn khai trước» của nang-repo-setup-0-10-4 ở mục giới hạn trong design_doc `docs/superpowers/specs/2026-11-26-nang-repo-setup-0-10-4-design.md`, hoặc sửa CHANGELOG thành «2». Nếu bản thiết kế khai 1 thì khớp, nếu khai 2 thì vế (0) sai.
    - Nguồn cho «cộng 2 lượt ngoài thiết kế mà phiên vòng DL2 báo (lời cho chạy lượt hai và lượt ba)»: ghi chú bàn giao hoặc dòng sổ của phiên vòng DL2 nêu rõ hai lượt ấy. Hiện `decisions.jsonl` và Notes hợp đồng không có dòng nào.
    - Bảng dự báo năm dòng của giam-sat-doc-ban-uy-quyen: cần tệp có bảng ấy (design_doc `docs/superpowers/specs/2026-11-27-giam-sat-doc-ban-uy-quyen-design.md`) để so «dòng 1 ↓ … dòng 5 ↑ nhẹ».
    - Bộ tên vùng cấm tiếng Anh (`gate-signoff`, `release`, `delete-branch`, `push-other-repo`, `github-settings`, `dispatch-scope`, `dispatch-rules`, `delegation`, `product-invariants`): cần bảng «tên mới» ở design doc `docs/superpowers/specs/2026-11-28-doi-ten-ban-uy-quyen-design.md` §3, hoặc mục «Sửa 28/11» của `docs/adr/0030-giam-sat-doc-ban-uy-quyen-cua-kho.md`.
    - Căn cứ cho chữ «chạy được ở mọi trạng thái hồ sơ» của `pr-san-sang.mjs --chi-xet` ở mục DL2: design doc `docs/superpowers/specs/2026-11-26-bang-chung-cu-theo-dau-vao-design.md` hoặc ca kiểm của `tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs`.
  human_override:  # chi nguoi ghi

- eval: E9
  run_id: r1-l16-1-20261128083618
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-28T08:36:18Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v3.1.1 (1193bc22) cài đúng tag

- eval: E10
  run_id: minted-release-3-2-0-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/release-3-2-0/chay.sh
  verified_at: 2026-11-28T08:36:18Z
  output: |
    XANH: khoá feature_loop.ngoai_n_tu_dinh_tuyen bật

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh ở cả HEAD lẫn baseline, chứng minh harness chứ không phải feature): E1, E2h — cùng lệnh vùng 3 của suite plugins. Cần viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý (P200 so quan hệ «cùng số» đọc từ tệp khai, không ghim giá trị 3.2.0).

Baseline khong do
- bash tests/scripts/run-tests.sh --manh bash: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 123 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node plugins/acceptance-gate/scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-3-2-0/chay.sh cua-so: bo qua baseline: tep _acceptance/release-3-2-0/chay.sh co o cay dang kiem nhung chua co o merge-base 0e514457a9addaedca3c208c5921aac19e93b84b — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-2-0/chay.sh dd-giu: bo qua baseline: tep _acceptance/release-3-2-0/chay.sh co o cay dang kiem nhung chua co o merge-base 0e514457a9addaedca3c208c5921aac19e93b84b — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-2-0/chay.sh goi-doi: bo qua baseline: tep _acceptance/release-3-2-0/chay.sh co o cay dang kiem nhung chua co o merge-base 0e514457a9addaedca3c208c5921aac19e93b84b — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-2-0/chay.sh lop-chep: bo qua baseline: tep _acceptance/release-3-2-0/chay.sh co o cay dang kiem nhung chua co o merge-base 0e514457a9addaedca3c208c5921aac19e93b84b — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-3-2-0/chay.sh ghim-lai: bo qua baseline: tep _acceptance/release-3-2-0/chay.sh co o cay dang kiem nhung chua co o merge-base 0e514457a9addaedca3c208c5921aac19e93b84b — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-3-2-0/chay.sh khoa-bat: bo qua baseline: tep _acceptance/release-3-2-0/chay.sh co o cay dang kiem nhung chua co o merge-base 0e514457a9addaedca3c208c5921aac19e93b84b — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy xanh; E8 do hội đồng đề xuất PASS (một lăng kính chưa đủ tệp để phân xử, ghi ở khối E8); ba finding ngoài hợp đồng đã chuyển sang review-findings.md.
