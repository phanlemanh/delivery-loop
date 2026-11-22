---
slug: chuyen-gop
at: 2026-11-22T03:30:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design | Không AC nào phủ pha GỘP khi lần gộp không sạch hay khi nhánh chính đổi giữa lúc kiểm và lúc gộp; lựa chọn «không so lại cây sau gộp» không có dòng sổ; Coverage nói mỗi ô có AC trên lưới 5×5 chỉ 7 AC. | Người gộp tay một PR trong lúc chuyến đang kiểm, nhánh chính kho tiêu thụ nhận một cây chưa ai kiểm; hoặc gộp PR thứ hai bị từ chối mà chuyến vẫn gộp PR thứ ba lên một tổ hợp chưa từng kiểm. | AC mới cho hai ca ghim thông điệp, kèm đối chứng; dòng sổ cho lựa chọn; sửa d-7. | fixed: trước khi gộp lệnh lấy lại đỉnh nhánh chính, đổi thì `nhanh-chinh-doi`, không gộp gì; một lần gộp hỏng thì `gop-do-dang`, dừng ngay; AC-8 ba ca kèm đối chứng; dòng sổ mới cho «không so lại cây sau gộp»; Coverage và d-7 thay bằng lưới thật. |
| P1 | evals | Ca AC-5 dựng tay dòng mặc-ký và phủ quyết đúng khuôn bên đọc; không ca nào đòi chúng do bên ghi thật của hàng 1 sinh. | Bên ghi hàng 1 viết khác tên trường, cửa proof không nhận ra mặc-ký và rơi về phán quyết cũ — mặc-ký tự gộp ở kho chưa khai proof. | Round-trip từ bên ghi hàng 1 qua cửa proof; đột biến đổi tên trường ở bên ghi phải làm ca đỏ. | fixed: mọi dòng mặc-ký và phủ quyết của ca sinh bằng `tro-ly-quyet-dinh.cjs --write` và `--ghi phu-quyet` trong lượt; đột biến DB-10 (đổi `may` ở bên ghi) làm hai ca AC-5 đỏ. |
| P2 | evals | Không eval nào đọc tệp luật tự trị đúng khuôn Repo Standards. | Khuôn thật khai high hay lồng khoá khác bản dựng tay; tệp high rơi về default low; mặc-ký đổi tệp high tự gộp. | Ca đọc bản chép khuôn có ghi nguồn; tệp high bị chặn khi default low; đối chứng tệp low qua. | fixed: fixture `tests/dieu-phoi/fixtures/autonomy-repo-standards.yaml` chép từ khuôn (commit c29dea4) — ca phát hiện khuôn không xếp migrations vào high và có khối `rules`; bộ đọc nay nâng tầng theo `rules` (PR xoá tệp lên medium, chạm ontology lên high). |
| P2 | contract | d-6 ghi mục-tiêu mà câu trích không quyết hai lựa chọn con (giả định nhánh chính xanh, hỏng tổ hợp thì PR sau rớt); d-5 ghi kho_dao false trong khi cây chưa khớp CI có thể vào nhánh chính kho tiêu thụ. | Nhánh chính đỏ sẵn hay lệnh kiểm chập chờn, chuyến quy lỗi oan lần lượt mọi PR. | Dòng sổ thay d-6 hoặc AC «nhánh chính đỏ thì dừng»; sửa d-5. | fixed: ngọn đỏ lần đầu thì kiểm nhánh chính một lần — đỏ thì dừng, không PR nào rớt (AC-8 ca c, đột biến DB-9); d-6 và d-5 thay bằng dòng mới mang supersedes, d-5 nay kho_dao true. |
| P2 | evals | Sáu đột biến chỉ nằm ở chú thích; AC-3 «logarit» không có ngưỡng số. | Bản tách tuyến tính hay bản đọc luật ở nhánh PR vẫn xanh mà không eval nào bắt. | Eval chạy đột biến trên bản chép trọn thư mục; ngưỡng số cho AC-3. | fixed: `rang/dot-bien.mjs` (E10) — bản nguyên vẹn xanh rồi mười đột biến, mỗi cái ghim tên ca phải đỏ, chép trọn `plugins/` và `tests/`; AC-3 ghim ≤ 6 và ≤ 10 lần kiểm. |
