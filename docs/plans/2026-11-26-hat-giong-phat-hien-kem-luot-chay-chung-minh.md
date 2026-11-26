# Hạt giống — phát hiện của khối tìm-lỗi phải kèm lượt chạy chứng minh

Gốc: delivery-loop/_acceptance/release-3-1-1/ (mốc gần nhất: Cổng Bằng chứng trình 10 mục ngoài hợp đồng, người ký chọn
theo đề xuất của máy cả 10 — 8 ghi Known limits, 2 không sửa; lượt chấm 2 đỏ vì sổ giới hạn thiếu hàng cho các mục ấy).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

**Trạng thái:** hạt giống (SỔ, chưa là ô). Ghi 26/11/2026 sau phiên đánh giá gói pstack của Cursor (`cursor/plugins`, bản
0.15.48, commit `b7b93c3`) theo North Star của kit. Tệp này không mở vòng nào.
**Hạng dự kiến:** T3 — chạm đường phán quyết (tìm lỗi → phân loại phạm vi → phản bác → REJECT) của lượt chấm.

## Điều đo được

Đo 26/11/2026 trên `main` `4dcff578` của kho kit, chỉ đọc.

- **Lượng mục ngoài hợp đồng tới người.** Các dòng `stage: gate2` mang «Ngoài-n» trong `_acceptance/*/decisions.jsonl`, từ
  25/10 tới 26/11: **471 mục ở 54 hồ sơ** — trung vị 6 mục một hồ sơ, nhiều nhất 31.
- **Người ký chọn gì.** Ghi Known limits 358 (76 %) · mở hợp đồng mới 61 (13 %) · chấp nhận, không sửa 47 (10 %) · sửa ngay
  5 (1 %).
- **Người ký có chọn khác máy không.** So từng mục với dòng «Đề xuất:» của `review-findings.md` cùng hồ sơ: 454 mục so được,
  **433 khớp (95,4 %)**. 21 mục lệch: 10 mục máy đề xuất known-limits mà người nâng thành «mở hợp đồng mới» · 9 mục
  known-limits mà người hạ thành «không sửa» · 2 mục «mở hợp đồng mới» mà người hạ thành «không sửa».
- **Các mục ấy chưa máy nào kiểm.** Tiêu đề khối trong `review-findings.md` tự khai: «CHƯA qua bác bỏ đối kháng». Bước phản
  bác chỉ chạy trên phát hiện trong hợp đồng (`plugins/feature-loop/workflows/acceptance-verify.js`, khối `phase('Refute')`).
- **Khuôn phát hiện không đòi lượt chạy.** `FINDINGS_SCHEMA` cùng tệp: `title · file · line · severity · detail`. Không
  trường nào ghi lệnh đã chạy hay đầu ra của nó.
- **Giá máy của khối.** Khối tìm-lỗi chiếm 36,9 % (cửa sổ 3.0.0) · 46,5 % (3.1.0) · 41,1 % (3.1.1) out-token của lượt chấm
  — số ở mục «Năm dòng số» của `CHANGELOG.md`.
- **Giá phía sau.** Mỗi mục ghi Known limits thành một hàng của `docs/research/known-limits-ledger.tsv` — 1 417 hàng hôm
  nay. Ca P179 (sổ thiếu hàng) có mặt trong nguyên nhân của bốn lượt chấm đỏ ở hai cửa sổ 3.0.0 và 3.1.1, và một làn ghim
  lại đỏ 59,7 phút; hai hạt giống đã ghi riêng chỗ ấy (`2026-10-18-hat-giong-so-known-limits-thieu-hang-p179.md`,
  `2026-11-23-hat-giong-so-gioi-han-sau-luot-cham.md`). Hai tệp đó chữa bước ghi sổ; tệp này nói về lượng chảy vào sổ.

Đọc số: theo phép thử của luật lời mời cổng (01/09) — «người trả lời khác khuyến nghị thì dựa vào điều gì máy không có?» —
khối ngoài hợp đồng của thẻ Cổng Bằng chứng là trạm thu phí ở 95 % số mục. Phần còn lại có giá trị thật: 10 lần người
nâng một mục máy định ghi sổ thành việc phải làm.

## Điều pstack làm khác

Bước rà soát đối kháng của pstack (`skills/interrogate/SKILL.md`) đặt luật ở phía NGUỒN:

- Bên tìm lỗi chỉ được báo thứ nó ĐÃ CHẠY. Mỗi phát hiện kèm lệnh nguyên văn, đầu ra thật, và đầu ra mà ý định đòi.
- Bên điều phối chạy lại đúng lệnh ấy. Đầu ra cho thấy hỏng và chỗ hỏng phạm ý định thì giữ; còn lại bỏ. «Không có phát
  hiện» là một kết quả hợp lệ.
- Nó gọi tên thứ bị loại từ đầu: văn phong, đặt tên, cấu trúc, và «rủi ro phải chờ một thay đổi tương lai mới thành chuyện».
- Bước gộp của nó (`playbooks/autopilot-full.md`, bước 4) cùng một luật: chỉ chặn một PR vì một lượt chạy đỏ ở đầu nhánh
  hoặc một dòng tài liệu mà PR làm sai; thứ nền đã có sẵn không chặn.

Giới hạn của chính pstack, ghi để không chép nhầm: ở đó luật này là chữ dặn trong tệp hướng dẫn — không khuôn, không ca
kiểm nào giữ nó. Kit mượn thì phải là khuôn máy đọc được.

## Hướng đã thấy (chưa kiểm)

- **Đúng tầng — khuôn phát hiện thêm lượt chạy.** Ba trường mới: lệnh · đầu ra · đầu ra mong đợi. Máy chạy lại lệnh bằng vai
  chạy lệnh (model nhỏ) thay cho một tác tử phản bác đọc mã. Đối chứng dương bắt buộc: cùng lệnh trên bản trước vòng phải
  cho kết quả khác — không thì đó là «đỏ sẵn trên nền» hoặc lệnh hỏng, không phải lỗi của vật.
- **Phát hiện về thước** («eval này xanh cả khi vật hỏng»): lượt chạy chứng minh là một bản tiêm — phá vật trong bản sao,
  eval vẫn xanh. Đó chính là nghi thức hai chiều của kho, lần này do bên tìm lỗi nộp kèm.
- **Phát hiện không kèm lượt chạy** không thành mục Ngoài-n. Thẻ in một dòng đếm; ai cần thì mở tệp. Phát hiện đúng mà không
  chạy được ở đây (cần dữ liệu thật, chỉ lộ ở prod) đi lối có tên — nhãn trạng thái «không đọc được ở đây» — không bị bỏ lặng.
- **Lối rẻ hơn, không chạm đường tìm lỗi:** mục máy đề xuất known-limits mặc định đi theo đề xuất, thẻ gom thành một dòng có
  cửa veto; thẻ chỉ trình riêng mục đề xuất «mở hợp đồng mới» và mục mức nặng. Lối này giảm chữ người đọc, không giảm token
  và không giảm lượng chảy vào sổ giới hạn; và phải giữ đường cho 10 ca người nâng mục lên.

## Soi theo luật của kit

- **Trace:** nguyên tố 2 — một phát hiện cũng là một lời khẳng định, hôm nay nó tới người ký mà chưa máy nào kiểm; và nguyên
  tố 3 — cổng mà 95 % câu trả lời là «theo đề xuất» là trạm thu phí. Người hưởng: người ký ở Cổng Bằng chứng của mọi kho, và
  dòng token của mọi vòng.
- **Loại:** ĐỔI thành phần đường phán quyết. Điều kiện tin cậy (i) của luật chiều rộng (c) đòi răng CẢ HAI chiều (đỏ và im)
  trước khi cắt; chủ kho duyệt đích danh ở Cổng Phạm vi của vòng.
- **Cân trên mọi kho:** kho nào cũng nhận ít mục hơn ở thẻ. Cái có thể mất: phát hiện đúng mà bên tìm lỗi không dựng nổi lượt
  chạy. Hành vi cũ có người dựa: 61 mục «mở hợp đồng mới» trong tháng — luật mới không được làm chúng biến mất.
- **Dự báo năm dòng:** dòng 1 ↓ nhẹ (bớt lượt chấm đỏ vì sổ giới hạn) · dòng 2 = số lượt, ↓ chữ mỗi lượt · dòng 3 ↓ ·
  dòng 4 chưa biết dấu (bên tìm lỗi tốn thêm vì phải chạy, bước phản bác rẻ đi) · dòng 5 chưa biết dấu.
- **Phải đo trước khi thành ô:** (a) lấy mẫu 50 trong 471 mục — bao nhiêu mục dựng lại được bằng một lệnh; (b) trong 61 mục
  «mở hợp đồng mới», bao nhiêu mục còn sống dưới luật mới. Hai số này quyết lối nào trong hai lối trên đáng làm.
- **Ngưỡng mở thành ô:** một kho tiêu thụ có một vòng mà thẻ Cổng Bằng chứng trình từ 15 mục Ngoài-n trở lên, hoặc chủ kho
  gọi tên. Đếm: `grep -c '"stage":"gate2".*"decision":"Ngoài-' _acceptance/<slug>/decisions.jsonl`.
