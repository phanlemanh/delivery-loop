# Hạt giống — lệnh đo vòng đếm sai cả phiên lẫn cửa sổ thời gian

Gốc: delivery-loop/_acceptance/doi-ten-ban-uy-quyen/ — dòng `kind: "gio-may"` thứ 25 trong `run-log.jsonl` của vòng V1
(28/11/2026), ghi `gio_may: 1.03`, `quy_doi: 14.04` và liệt cả hai bản ghi của phiên khác trong `nguon`.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.
**Cùng họ:** `2026-11-26-hat-giong-dong-2-may-dem-tu-ban-ghi-phien.md`. Hạt giống ấy định dựng dòng 2 trên đúng cửa sổ vòng
mà `do-vong.mjs` đang tính, nên hai lỗi dưới đây sẽ đi theo sang dòng 2 nếu không sửa trước.

**Trạng thái:** hạt giống (SỔ, chưa là ô). Ghi 28/11/2026 sau khi đóng vòng V1. Tệp này không mở vòng nào.
**Hạng dự kiến:** T2. Việc sửa chạm `plugins/acceptance-gate/scripts/do-vong.mjs` và đoạn `S4-DO-VONG` của SKILL
feature-loop; không chạm đường phán quyết, không chạm cổng.

## Điều đo được

Số dưới đây được đo lại ngày 28/11 bằng chính các hàm mà `do-vong.mjs` xuất ra (`cacPhien`, `gioHoatDong`, `quyDoi`), trên
bản ghi phiên của máy chạy vòng. Đơn vị «quy đổi» là đơn vị mà dòng `gio-may` đang dùng.

| Phần | Giờ máy | Quy đổi |
|---|---|---|
| Sổ ghi (20:38Z → 01:27Z) | 1,03 | 14,04 |
| ‣ trong đó của chính phiên vòng | 1,02 | 12,62 |
| ‣ trong đó của hai phiên khác | 0,02 | 1,42 |
| Đoạn S0–S1 bị bỏ, phiên vòng (19:31Z → 20:38Z) | 0,35 | 12,16 |
| Đoạn sau lượt chấm tới lúc gộp, phiên vòng (01:27Z → 03:30Z) | 0,23 | 3,46 |
| **Phiên vòng, từ mở vòng tới gộp** | **≈ 1,60** | **≈ 28,2** |

Ba lỗi kéo số theo hai chiều ngược nhau. Lỗi thứ nhất làm số cao hơn thực tế; lỗi thứ hai và thứ ba làm số thấp hơn thực
tế. Tính gộp lại, sổ chỉ ghi được khoảng **một nửa** chi phí máy thật của vòng.

1. **Đếm cả phiên khác (làm số cao lên).** Một phiên được tính là «chạm vòng» khi bất kỳ dòng nào trong bản ghi của nó có
   nhắc chuỗi `_acceptance/<slug>/` (`docBanGhi`, khoá `cham`). Sau đó máy cộng MỌI sự kiện của phiên ấy trong cửa sổ, kể cả
   việc không liên quan tới vòng. Ở V1 có hai phiên lọt vào. Một là phiên giữ đợt (`a6754d65…`, ở kho chính), vì nó soạn
   lời giao việc có nhắc tên hồ sơ. Hai là một phiên ở kho khác (`45a962d2…`). Phần của hai phiên này còn nhỏ (1,42 trên
   14,04, khoảng 10 %) chỉ vì cửa sổ mở muộn. Nếu cửa sổ mở đúng lúc vòng bắt đầu, phần này là 6,24.
2. **Cửa sổ mở muộn (làm số thấp đi).** `batDauVong` lấy `decided_at` của ô cơ hội. Vòng V1 không có ô cơ hội, nên máy lấy
   giờ của commit đầu tiên chạm thư mục hồ sơ: commit nháp `9a46f6d6` lúc 20:38Z, tức khi S1 đã xong. Phiên vòng bắt đầu từ
   19:31Z, nên 1 525 sự kiện của S0–S1 nằm ngoài cửa sổ. Phần bị bỏ này là 12,16 quy đổi, gần bằng toàn bộ phần sổ có ghi của
   phiên vòng. Mọi vòng không có ô cơ hội đều mắc lỗi này: hàng của lộ trình đợt, vòng sửa kit, vòng hạng T2 đi thẳng.
3. **Đo trước khi vòng xong (làm số thấp đi).** Đoạn `S4-DO-VONG` chạy lệnh đo khi lượt chấm trả về. Phần sau đó bị bỏ:
   Cổng Bằng chứng, chữ ký, lệnh gộp và chờ CI. North Star (23/10) tính giờ máy sau chữ ký vào chính vòng, và đích của vòng
   là GỘP ĐƯỢC. Ở V1, đoạn bị bỏ này là 0,23 giờ máy và 3,46 quy đổi.

**Sửa lại một ghi nhận sai.** Ghi chú tiến độ của V1 trong thư mục ghi chú chung của đợt viết rằng giờ máy và token của vòng
«bị thổi phồng». Kết luận đó chỉ đúng với lỗi thứ nhất. Tính cả ba lỗi, sổ ghi THẤP hơn thực tế.

## Hướng đã thấy (chưa kiểm)

- **Phiên chạm vòng phải là phiên LÀM vòng, không phải phiên có nhắc tên vòng.** Ứng viên: tính phiên có cây làm việc
  (`cwd`) của bản ghi nằm trong worktree của vòng. Một ứng viên khác: tính phiên có ghi vào `_acceptance/<slug>/`, chứ không
  chỉ đọc hay nhắc tới. Phiên chỉ nhắc tên vòng thì được liệt riêng, không cộng vào số.
- **Cửa sổ mở từ sự kiện đầu của phiên làm vòng.** Khi không có `decided_at`, dùng sự kiện đầu tiên của phiên làm vòng, thay
  cho commit đầu của hồ sơ. Hoặc ghi một mốc «mở vòng» vào `run-log.jsonl` ngay ở S0. Đoạn `S4-DO-VONG` đã có một dòng chạy
  ở S0 nên có sẵn chỗ để ghi mốc này.
- **Đo thêm một lần sau khi gộp.** Có hai cách: chạy lại lệnh đo ở S5, sau khi lệnh gộp thoát 0 (dòng mới thay dòng cũ); hoặc
  thêm khoá `sau_cham` để tách đoạn sau lượt chấm. Cách thứ hai giữ được hai nửa *làm-xong→ký* và *ký→gộp* của dòng 1.
- **Chiều đỏ cho phép đo.** Dùng bản ghi phiên do mã sinh trong lượt kiểm, gồm một phiên làm vòng và một phiên chỉ nhắc tên
  vòng. Phiên nhắc tên phải không vào số; gỡ bộ lọc thì số phải tăng đúng phần của phiên ấy. Chiều im: thêm sự kiện của
  phiên khác ngoài cửa sổ thì số không đổi.

## Soi theo luật của kit

- **Trace:** nguyên tố 2. Một thước đo tự dối ngay trên dòng 4 và dòng 5 của luật (c), mà North Star đặt làm mẫu số «chi phí
  máy trên mỗi kết quả gộp». Người hưởng: chủ kho, khi đọc bảng năm dòng ở mỗi mốc phát hành.
- **Loại:** sửa một phép đo đang có (một tầng), không dựng thước mới, nên luật (a) không cấm. Nếu vòng sửa thêm khoá mới (ví
  dụ `sau_cham`) thì đó là CỘNG và cần chủ kho duyệt đích danh.
- **Cân trên mọi kho:** kho không chạy lệnh đo vòng thì không đổi gì. Kho có chạy thì số các dòng `gio-may` cũ không so sánh
  được với số mới. Vì vậy hồ sơ mốc đầu tiên dùng bản sửa phải ghi rõ chỗ ngắt chuỗi số, không trộn số cũ với số mới.
- **Dự báo năm dòng:** dòng 4 (token/vòng) và dòng 5 (phút máy) TĂNG ở mốc đầu tiên. Lý do không phải máy tốn hơn, mà là lần
  đầu đo đủ. Ba dòng còn lại không đổi.
- **Điều kiện tin cậy:** chưa sửa thì dòng 4 và dòng 5 của mọi mốc có vòng không ô cơ hội đều thấp hơn thực tế khoảng một
  nửa, và lệch lên thêm khi có phiên giám sát chạy song song.
- **Ngưỡng mở thành ô:** khi mốc phát hành kế tiếp cắt số dòng 4 và dòng 5 từ các dòng `gio-may`; khi hạt giống «dòng 2 máy
  đếm từ bản ghi phiên» được mở thành ô (nó dựng trên cùng cửa sổ này); hoặc khi chủ kho gọi tên.
