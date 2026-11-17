---
slug: release-3-0-0
at: 2026-11-17T14:47:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

# Phản biện context sạch — release-3-0-0

Một tác tử đọc đúng bốn tệp (hợp đồng, evals, sổ quyết định, bài học từ hồ sơ trước), không đọc mã, không chạy lệnh.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Dòng sổ «sửa ba glob trong PR mốc, không sửa kịch bản» ghi nguồn một-lối, nhưng lối sửa kịch bản còn sống, chỉ đắt hơn | Cổng Phạm vi đọc như không còn lối khác; kịch bản chạy lại vẫn sinh ba glob chết | Thay dòng sổ bằng nguồn đúng; Notes khai giới hạn kèm ngưỡng đếm | fixed: dòng S1 mới mang supersedes, căn cứ là mục B3 của thẻ Cổng Phạm vi chủ kho đã duyệt; Notes khai giới hạn kèm ngưỡng «≥ 1 lần kịch bản chạy lại sau ngày cắt» |
| P1 | contract | Hạng T2 và làn V không có dòng sổ người nhận; phép đo hạng lấy lúc ba glob còn chết | Vòng bỏ Gate 1.5 mà sổ không cho ai thấy | Dòng gate1 có decided_by; đo lại --hang-pr sau khi sửa glob | fixed: dòng gate1 có decided_by trích đoạn «Hình dạng vòng» của thẻ; Notes ghi đo --hang-pr ra «không rõ» ở PR số 1 và ở phần mốc sau khi sửa glob |
| P1 | evals | Vế quét đường chết của E6 âm tính một mình; glob t1_skip_globs không có commit thử | Bộ quét không rút được chuỗi nào vẫn in «0 đường chết»; glob ca đo skill sửa lệch vẫn xanh | Chiều đỏ trên nền, ghim số chuỗi > 0; thêm commit thử ca đo skill | fixed: hang-loi.sh --hai-chieu chạy quét ở HEAD (0 chết trên N > 0 chuỗi) và ở nền (đúng ba glob chết); thêm commit thử chạm evals/README.md (T1 ở HEAD, T2 ở nền) |
| P1 | contract | AC-8 không đọc tên kho ở dòng lấy kit của GUIDE; liên kết QUICKSTART và đường feature-loop của GUIDE không có AC | GUIDE còn trỏ kho cũ hay liên kết còn chết mà E8 vẫn xanh | Đọc tên kho; quét đường và liên kết của tài liệu gốc, có chiều đỏ trên nền | fixed: guide-ci.sh đọc tên kho phải là delivery-loop; thêm tai-lieu-duong.mjs (liên kết tương đối và đường <kit>/… ở README, GUIDE, QUICKSTART) — phép quét lộ thêm mười đường cũ ở đoạn cài thủ công của README, đã sửa; nền ra 12 đường chết |
| P2 | evals | E1 trùng lệnh với E2h, không ghim dòng đạt của P200 | P200 rơi khỏi vùng 3 mà E1 vẫn xanh | Ghim dòng đạt mang tên P200 | rejected: lệnh vùng 3 lọc đầu ra chỉ còn dòng FAIL và dòng Results; P200 nằm ở vùng 3 từ mốc 2.36 và là ca vĩnh viễn mọi mốc dùng — đổi bộ lọc là đổi khoá suite chung của mọi hồ sơ, ngoài phạm vi mốc |

Ghi chú của tác tử (P2, ngoài năm mục): AC-10 không hỏi phần «kho tiêu thụ làm gì khi nhận» của mục CHANGELOG — fixed: thêm vế
(iv) vào AC-10 và câu hỏi của E10.
