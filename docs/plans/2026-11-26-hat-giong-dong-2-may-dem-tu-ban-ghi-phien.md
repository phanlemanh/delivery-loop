# Hạt giống — dòng 2 (lượt gọi người) do máy đếm từ bản ghi phiên

Gốc: delivery-loop/_acceptance/release-3-1-1/ (hồ sơ mốc gần nhất; mục «Năm dòng số» của mốc ghi: «0 ngoài thiết kế» nghĩa
là «0 ghi được»: không đọc được phiên chat).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.
**Cùng họ:** mục K5 của kế hoạch 12 mục (`migration/KE-HOACH-12-MUC-REPO-STANDARDS.md` trên nhánh `chuyen-nha`) — «không
tách được giờ chờ người», đang đếm tay ở hồ sơ mốc, có lối «chỉ viết mã nếu đếm tay không tách được». Không thuộc gói DL
nào: sáu gói DL sửa vòng, tệp này sửa thước đọc vòng.

**Trạng thái:** hạt giống (SỔ, chưa là ô). Ghi 26/11/2026 sau phiên đánh giá gói pstack của Cursor (`cursor/plugins`, bản
0.15.48, commit `b7b93c3`) theo North Star của kit. Tệp này không mở vòng nào.
**Hạng dự kiến:** T2 — thêm một phép đếm vào bộ đo vòng; không chạm đường phán quyết, không chạm cổng.

## Điều đo được

Đọc 26/11/2026 trên `main` `4dcff578` của kho kit.

- **Thước số một của kit đang mù một nửa.** North Star đặt dòng người trước dòng máy, mục tiêu thật là 0 lượt gọi ngoài
  thiết kế. Bốn mốc liên tiếp — 2.39.0, 3.0.0, 3.1.0, 3.1.1 — đều ghi vào `CHANGELOG.md` cùng một câu: «0 ngoài thiết kế»
  nghĩa là «0 ghi được», vì không đọc được phiên chat. Số 0 ấy không có chiều đỏ.
- **Dòng 2 vẫn đếm tay.** Luật chiều rộng (c): ba dòng đầu đếm tay, hai dòng sau máy đo; nửa ký → gộp của dòng 1 đã chuyển
  sang máy đo (hồ sơ `ky-den-gop`). Dòng 2 chưa.
- **Kit đã từng đếm được, một lần, bằng tay.** `docs/findings/assets/2026-09-22-tong-ket/luot_goi.py` (22/09) đọc bản ghi
  phiên và ra số thật: lượt máy hỏi ngoài thiết kế dồn về bước thiết kế — 8, 7 và 6 chạm ở ba vòng, 28/28 câu trả lời theo
  khuyến nghị (hạt giống `2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md`). Tệp ấy mang bảng cửa sổ vòng gõ tay và bộ
  khớp chữ theo từng câu người đã gõ — chạy lại cho mốc sau là viết lại.
- **Phần khó đã có trong kit.** `plugins/acceptance-gate/scripts/do-vong.mjs` (hồ sơ `lo-trinh-gio-may`) đã tìm được các
  phiên chạm một vòng và cửa sổ thời gian của vòng từ chính bản ghi phiên, để đo giờ máy và token. Nó chưa đếm sự kiện
  người.

## Điều pstack làm khác

pstack không đo lượt gọi người. Thứ đáng mượn là thói quen coi **bản ghi phiên là nguồn sự thật, lời tự khai thì không**:

- Sổ quyết định của một lượt chạy dài phải được đối soát với bản ghi phiên trước khi trả lại cho người — dòng nào không ứng
  với một việc thật thì ghi dòng thay thế, khoảng trống thì bổ sung (`skills/show-me-your-work/SKILL.md`, mục đối soát).
- Chấm một thay đổi của tệp hướng dẫn bằng cách đọc tác tử ĐÃ mở tệp nào trong bản ghi phiên, không hỏi nó đã theo luật
  nào (`playbooks/eval.md`, bước 6).

Áp vào kit: dòng 2 đang là lời tự khai của sổ quyết định; bản ghi phiên là thứ kiểm được nó.

## Hướng đã thấy (chưa kiểm)

- **Đếm bằng sự kiện có cấu trúc, không khớp chữ.** Trong cửa sổ vòng mà `do-vong.mjs` đã dựng, đếm ba loại sự kiện máy đọc
  được: lần máy gọi công cụ hỏi người · lệnh cổng do người gõ (bảy thao tác cổng đã khoá) · tin người gõ sau một lượt máy
  kết thúc. Trong thiết kế = sự kiện khớp một dòng cổng của sổ quyết định; ngoài thiết kế = phần còn lại.
- **Số đi vào đúng chỗ đã có:** dòng `kind: "gio-may"` của `run-log.jsonl` thêm khoá đếm; bảng năm dòng của mốc đọc từ đó.
- **Chiều đỏ của phép đếm:** bản ghi phiên do mã sinh trong lượt kiểm, có đúng k lần hỏi ngoài cổng → phép đếm ra k; gỡ
  một lần → k − 1. Chiều im: thêm lượt máy không hỏi ai → số không đổi.
- **Giới hạn phải khai cùng số:** máy hỏi bằng câu chữ thường ở cuối lượt (không qua công cụ hỏi) chỉ thấy được gián tiếp
  qua tin người trả lời; phiên chạy trên máy khác không có bản ghi ở máy đo — khi đó in «không đọc được ở đây», không in 0.

## Soi theo luật của kit

- **Trace:** nguyên tố 3 — khoảnh khắc quyết thật chỉ giữ được khi lượt gọi ngoài thiết kế bị nhìn thấy; và nguyên tố 2 —
  một số 0 không thể đỏ là bằng chứng tự dối ở chính thước đo của kit. Người hưởng: chủ kho đọc bảng năm dòng ở mỗi mốc.
- **Loại:** CỘNG một phép đo một tầng (không phải đo-thước-của-thước — luật (a) không cấm). Chủ kho duyệt đích danh.
- **Cân trên mọi kho:** kho không chạy lệnh đo vòng không đổi gì. Kho chạy thì thêm một khoá trong dòng đã có; bộ đọc cũ bỏ
  qua khoá lạ.
- **Dự báo năm dòng:** dòng 2 không đổi thật, chỉ đổi từ «0 ghi được» sang số đọc được — có thể TĂNG ở mốc đầu vì lần đầu
  nhìn thấy. Bốn dòng còn lại =.
- **Ngưỡng mở thành ô:** mốc kế tiếp cắt số mà bảng năm dòng vẫn phải ghi câu «0 ghi được» — tức lần thứ năm liên tiếp;
  hoặc chủ kho gọi tên.
