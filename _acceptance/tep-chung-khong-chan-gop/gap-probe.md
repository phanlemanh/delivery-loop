---
slug: tep-chung-khong-chan-gop
at: 2026-11-21T14:10:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | decisions | Hai dòng sổ ghi một-lối khi lối kia còn sống: lối «PR vẽ lại sau mỗi lần gộp» chỉ đắt hơn (và giữ được hai view trên web); lối sửa bảng điều phối không chết vì cỡ (khối cỡ cho phép tới 12). Cùng lớp [release-3-0-0#F1] [phan-du-bo-cuc-moi-vong-ba#F1] | Chủ kho đọc «một lối sống» và ký một đánh-đổi chưa được đưa ra | Mỗi dòng một-lối phải nêu một ràng buộc cứng kiểm được; lối chỉ đắt hơn thành câu hỏi có giá | fixed: dòng rời-git thành Hỏi-1 (chỉ người có, giá từng lối) thay d-…-2; bảng điều phối đổi thành cờ vàng trong AC-5 (căn cứ thứ tự chọn nghiệm) thay d-…-9; thiết kế bỏ chữ «một lối sống» |
| P0 | decisions | Căn cứ của luật lệnh hồ sơ trích một mảnh câu trong hạt giống (sổ, không phải cam kết); không loại được lối tiền tố hay tệp lệnh mới | Luật viết mới đổi hành vi máy mọi kho mà căn cứ chỉ là một ý trong sổ | Câu trích phải QUYẾT lựa chọn | fixed: dòng thay d-…-4 trích luật đã khai ở CLAUDE.md (sửa đúng tầng đứng trước bộ đọc mới) và nêu giá của lối kia (đổi năm bộ đọc, có lib lõi) |
| P1 | evals | E9 ghim hằng 1355+2 của sổ thật — sổ đổi theo chính lượt chấm và móc mới | Lượt chấm đầu thêm hàng vào sổ thật, lượt kế E9 đỏ dù bộ sinh đúng | Ghim quan hệ với số hàng đo ngay trước lần chạy | fixed: E9 và AC-9 đo quan hệ trên gốc tạm, không hằng nào rút từ sổ thật |
| P1 | evals | P179 sau bộ sinh xanh sẵn trên gốc tạm (corpus nhỏ), không đỏ-trước; móc chỉ thử JSON viết tay, không thử matcher | Bộ sinh đếm nhầm slug mà ca vẫn DUONG-OK; matcher sai mà ca vẫn xanh | P179 đỏ trước, xanh sau trên cùng gốc khớp; matcher rút từ settings khớp Write và Edit; file_path tuyệt đối | fixed: AC-9/E9 đo đỏ-trước-xanh-sau trên gốc tạm đưa về trạng thái khớp, thêm ca TCG-9-slug và nhát dem-nham-slug, matcher thử bằng RegExp của chính nó, đầu vào mang đường tuyệt đối và cwd |
| P1 | contract | Không AC nào buộc các bên đọc khoá cho cùng phán quyết với mọi dạng viết khoá. Cùng lớp [d-20261121T033406Z-17] | `ngoai_git: "true"  # …` — lib coi bật, khối lệnh coi tắt, lệnh cổng thoát khác 0 | Ma trận dạng khoá × bên đọc, số assert = dạng × bên | fixed: AC-5/E5 ma trận sáu dạng × ba bên đọc (18 assert); AC-4 buộc khối lệnh vẽ lại KHÔNG đọc khoá (hỏi git check-ignore) nên chỉ còn ba bên; thêm nhát quet-doc-khoa-rieng |
