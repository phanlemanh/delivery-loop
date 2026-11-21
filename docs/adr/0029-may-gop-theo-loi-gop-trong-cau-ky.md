# ADR 0029 — Máy gộp PR theo lời gộp trong câu ký

*2026-11-21 · hồ sơ `loi-gop-trong-cau-ky` · chủ kho duyệt ở Cổng Phạm vi, Hỏi-1 «phê CỘNG» và Hỏi-2 «kho kit tự bật».*

Từ 23/10 đích của kit là GỘP ĐƯỢC, nhưng chủ máy của đoạn ký → gộp (hồ sơ `ky-den-gop`) chỉ có trong một đợt điều phối;
vòng chạy ngoài đợt thì lệnh ký để việc gộp cho người. Đợt 19–21/11 đo được 2 trên 3 vòng tốn một lượt gọi người riêng
cho câu «gộp khi xanh», lần hai xảy ra dù đã dặn bằng lời; 63 hồ sơ của một kho tiêu thụ chờ trung vị 22′ sau khi ô bắt
buộc đã xanh. Từ bản này, ở kho khai `feature_loop.gop_theo_loi_ky: true`, thẻ Cổng Bằng chứng in sẵn ô `gộp: khi CI
xanh` trước ô «ký hay trả», lệnh ký ghi nguyên văn trọn câu người gõ thành một dòng sổ cùng commit với chữ ký, và lệnh
gộp sẵn có của gói điều phối nhận lối vào `--theo-loi`: nó đọc TRÊN ĐẦU NHÁNH của PR, đòi kho bật, hồ sơ đã ký, báo cáo
có chữ ký, tự đọc lại câu người gõ bằng danh sách đóng `GATE-ONESHOT-GOP`, đòi dòng ấy sinh cùng commit với chữ ký hiện
hành, tự chờ CI, rồi gộp bằng `gh pr merge --merge --match-head-commit` — không bao giờ `--auto`. **Khó đảo:** một commit
gộp vào nhánh chính chỉ đảo được bằng một commit hoàn lại. **Gây bất ngờ:** câu «bấm merge là của người» của kit nay có
một ngoại lệ, và ngoại lệ ấy do máy thi hành. **Đánh đổi:** bớt một lượt gọi người và đoạn chờ sau khi CI xanh, đổi lấy
việc tin một dòng sổ do lệnh ký ghi hộ — cùng mô hình tin với chữ ký (xuất xứ thật là tác giả commit, ADR 0012). Ranh
của ADR 0002 giữ nguyên: máy không bao giờ tự phát ngôn «Ký»; ô gộp điền sẵn chỉ có hiệu lực khi CHÍNH câu ấy mang chữ ký
do người gõ, cùng ranh với «Treo: phê hết». Đã bác: khoá «luôn gộp sau ký» (lời thường trực thay lời của lần ký), tự gộp
của GitHub, hàng gộp tự động, mở một đợt một hàng cho mỗi vòng. Không áp cho hồ sơ máy đã thông (không có câu người gõ)
và không đổi luật gộp trong đợt. Bật theo lựa chọn của từng kho; kho không bật giữ nguyên thẻ và hành vi từng byte.
Ngưỡng thu hồi (ô cơ hội của hồ sơ): một lần máy gộp mà câu người gõ không mang lời gộp → tắt khoá.
