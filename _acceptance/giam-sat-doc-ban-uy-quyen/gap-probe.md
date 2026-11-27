---
slug: giam-sat-doc-ban-uy-quyen
at: 2026-11-27T08:45:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---
## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | AC-7 hứa nhả khoá ở mọi lối nhưng E7 chỉ kiểm khoá đã nhả ở lối gộp thành công; không ca nào kiểm các lối hỏng xảy ra SAU lúc giám sát đã giữ khoa/merge | Mã chỉ nhả khoá sau khi gộp thành công; gop --theo-quyen cho PR chưa ký bị xetGop chặn, ma trận vẫn xanh, khoa/merge còn mang phiên giám sát, bộ phát lịch không cấp merge cho dãy nào nữa | Assert khoa/merge không còn sau mỗi lối hỏng sau bước giữ khoá; hàng gh thoát 1; mutant nhả khoá ngoài finally phải đỏ | fixed: AC-7 thêm vế nhả khoá ở mọi lối; E7 thêm ca UQ-07 nha-khoa (xetGop chặn · gh thoát 1 · sổ hỏng) và mutant UQ-07-do nha-khoa-ngoai-finally; design §7 bước 4 nêu khối finally |
| P1 | design | Sổ ghi máy quyết nhận phien nửa mở mà không ghi dung-quyen; ngưỡng thu hồi của ADR (một lần dùng quyền không có sự kiện) mâu thuẫn trực tiếp; Notes thiếu giới hạn đã hứa | Kho viết tu_lam [gop, phien]; thẻ in phien ở nhóm nhận; giám sát mở chip theo quyền không có dòng dung-quyen; theo đúng chữ ngưỡng thu hồi phải tắt bộ đọc ở mốc kế | Thay dòng sổ; nếu chuyển phien sang vẫn hỏi thì sửa ma trận UQ-02 và bảng §4; ghi giới hạn vào Notes kèm ngưỡng | fixed: dòng sổ mới d-…-15 supersedes d-…-5 — phien chưa được nhận (nhóm vẫn hỏi, câu mới); AC-2, E2, design §2/§4, Out of scope sửa theo; Notes thêm giới hạn và ngưỡng mở lại |
| P1 | contract | Nhánh lấy về hỏng mà ref cũ KHÔNG có tệp thì im không có AC lẫn ca đo; AC-5 không phủ kho có remote mà offline | Mã trả loi mọi khi fetch hỏng; kho không tệp mở đợt lúc offline có thêm khối uy_quyen báo lỗi; lời hứa từng byte vỡ ở ca cân-trên-mọi-kho mà E1 và E5 vẫn xanh | Ca UQ-01 lay-ve-hong-khong-tep; hàng UQ-05 origin chết không tệp so từng byte | fixed: AC-1 thêm nhánh im; AC-5 thêm kho có remote lấy về hỏng; E1 thêm UQ-01 lay-ve-hong-khong-tep, E5 thêm UQ-05 lay-ve-hong |
| P2 | contract | Vế gop không cờ giữ nguyên hành vi không có eval; xem ở kho có tệp không có AC; nhãn Coverage trục D lệch | Kiểm vùng cấm hay mkdir khoa/merge rò sang đường gop thường; dãy giữ khoá do lịch cấp bị chặn khoá đang do chính nó giữ; mọi kho gộp bằng gop thường kẹt mà không ca nào đỏ | Ca gop không cờ so bản archive với bản mới (mã thoát, lời gọi gh, dòng sổ); hàng xem/xem --json ở kho có tệp | fixed: vế gop không cờ dời vào AC-5 với ca UQ-05 gop-khong-co (PR chạm .github/workflows/); AC-10 thêm xem ở kho có tệp với ca UQ-10 xem-co-tep; Coverage trục D sửa |
| P2 | evals | UQ-10 dem có thể dùng sổ viết tay đúng khuôn bên đọc; UQ-06 monitor không nói lệnh lọc rút từ open.md; thu-tu-gop thiếu hàng không phải giám sát | Bên ghi đặt khoá khác bên đọc; fixture tay vẫn xanh trong khi đợt thật báo 0; open.md đổi lệnh lọc mà ca chép tay không đổi; phiên thợ gọi thu-tu-gop không ca nào đỏ | Sinh sổ bằng lệnh thật rồi dem; rút lệnh lọc qua marker có đối chứng; thêm hàng không phải giám sát vào UQ-09 | fixed: E10 dem sinh sổ bằng hai lần gop --theo-quyen và một lần thu-tu-gop thật; E6 rút lệnh lọc qua marker MONITOR-LOC của open.md (vắng → đỏ), open.md vào paths; E9 UQ-09 hoan-vi thêm hàng phiên không phải giám sát |
