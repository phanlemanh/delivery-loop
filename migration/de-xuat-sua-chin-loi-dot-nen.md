# Đề xuất — chín lỗi C1–C9 của đợt `nen`: lỗi nào là của kit, sửa thế nào

**Ngày:** 2026-11-28 · **Trạng thái:** CHỜ chủ kho xem · **Người soạn:** phiên giữ đợt (Mac Studio).
Chủ kho bảo 28/11: «Kiểm và đánh giá 9 lỗi này thuộc về kit và có thể xảy ra trên mọi repo hay chỉ đúng ở repo inventory từ
đó đề xuất fix.» Nguồn của chín lỗi: PR #40 của kho kit (hạt giống tổng kết đợt `nen`, đầu nhánh `5d7d744b`).
Tệp này là SỔ, không phải ô: không mở vòng nào. Mỗi vòng chỉ mở khi chủ kho gọi tên.

## 1. Kết luận một phút

- **Cả chín là lỗi của mã kit**, không lỗi nào là lỗi riêng của Inventory. Tám lỗi có điều kiện xảy ra ở mọi kho; riêng
  C9 hôm nay chỉ gây hại ở kho có quy trình soát riêng — trong bốn kho chỉ Inventory có.
- **C8 phải tách đôi.** Nửa rộng («PR đổi tệp mà phép của hồ sơ đã ký trỏ tới thì xét lại hồ sơ ấy») KHÔNG phải lỗi: đó
  là thiết kế «ghim lại theo mốc, không theo từng lần gộp» và nếu đổi thì 76–83 % số lần gộp ở mọi kho bị kéo xét lại.
  Nửa hẹp là lỗi thật, sinh từ lần sửa #468 (ADR 0028), và rẻ để sửa.
- **C7 không sửa được bằng cách soi chữ của `cmd`**: đo bốn kho, 0 phép viết phép đo «từ điểm rẽ nhánh» ngay trong `cmd`;
  nó nằm trong tệp lệnh mà `cmd` gọi.
- Đề nghị: **một vòng vá hẹp** cho năm chỗ sửa không đổi mặc định (C1, C2, C4, C8-hẹp, C3-thẻ), hai cờ vàng (C6, C7), và
  hai việc cần thiết kế hoặc khoá mới (C9, C5) xếp vào vòng đã có trong lộ trình. Chi tiết ở mục 4.

## 2. Phép đo

Bộ đo chỉ-đọc, chạy 28/11 trên nhánh chính của bốn kho: kit `36d29fed` · Inventory `b9fcdd11` · crm `074c10a1` · Quỹ hàng
(kho riêng tư — chỉ nêu số đếm). Cửa sổ: hồ sơ có báo cáo bằng chứng và các lần gộp từ 01/11. Mã mỗi lỗi đọc lại trên
`origin/main` của kit ở đúng dòng PR #40 dẫn — cả chín khớp (sổ đợt, commit `5899e7a3`).

| Lỗi | Thước | Kit | Inventory | crm | Quỹ hàng |
|---|---|---|---|---|---|
| C1 | eval có `cmd` là lệnh chữ, không phải `config:` (nên không có `ref`) · số hồ sơ | 74 · 10 | 148 · 15 | 12 · 3 | 99 · 39 |
| C1 | trong đó `cmd` trỏ được một tệp lệnh có thật | 74 | 148 | 10 | 94 |
| C2 | ô phán quyết trong báo cáo đã commit không phải đúng chữ `PASS` | 0 | 0 | 0 | 0 |
| C4 | sổ đợt có trên máy: sự kiện cấp khoá · sự kiện nhả | không có sổ | không có sổ | 692 · 0 | không có sổ |
| C6 | mục `paths` không khớp tệp nào ở đầu nhánh · tổng mục · số hồ sơ | 407 · 1 220 · 29 | 178 · 3 049 · 53 | 21 · 1 553 · 6 | 85 · 3 473 · 32 |
| C7 | phép viết «từ điểm rẽ nhánh» ngay trong `cmd` | 0 | 0 | 0 | 0 |
| C7 | hồ sơ gần đây có tệp lệnh gọi `merge-base` hoặc `...HEAD` | 12 | 29 | 13 | 8 |
| C8-rộng | lần gộp chạm `paths` của hồ sơ đã ký mà không chạm hồ sơ · tổng lần gộp | 40 · 52 | 97 · 119 | 10 · 12 | 139 · 182 |
| C8-hẹp | lần gộp có hồ sơ đã ký chỉ đổi tệp chữ, mà cùng lần gộp đổi tệp phép của nó trỏ tới | 0 | 0 | 1 | 1 |
| C9 | kho có quy trình soát riêng (`.claude/skills/*review*`) | không | có (từ 09/11) | không | không |

Giới hạn của phép đo, nói thẳng:

- **C2 đo ra 0 không có nghĩa là không xảy ra.** Ca ở Inventory (VP10 lượt 7) được dựng lại bằng script trước khi commit,
  nên báo cáo đã commit sạch. Mẫu dò có đối chứng dương (một dòng «PASS (mang từ vòng 3)» dựng tay thì bắt được).
- **C6 là chặn trên.** «Không khớp ở đầu nhánh» gồm cả tệp đổi tên hay xoá sau khi hồ sơ ký (ở kit phần lớn do đợt chuyển
  nhà đổi bố cục thư mục). Nó chứng điều kiện — không gì kiểm `paths` — không đếm số lần chấm xanh trên tệp vắng.
- **C8-rộng đếm cả mục `paths` rộng** (`src/**`…); chỉ loại `**`. Con số nói «luật ấy sẽ đắt cỡ nào», không nói có bao
  nhiêu hồ sơ thật sự mất tiền đề.
- **C9 không đếm được số lượt chấm thiếu làn soát**: nhật ký lượt chấm không ghi làn nào đã chạy. Chính chỗ trống ấy là
  một nửa của lỗi.
- **C3 và C5 xét bằng đọc mã**, không đo tần suất. C3 đã có ca gốc ở chính kho kit (hạt giống KY3, 20/10).
- Sổ đợt `nen` của Inventory (`.acceptance-runs/`, git bỏ qua) vẫn không có trên máy này sau khi đồng bộ; số 337 lần cấp /
  0 lần nhả của Inventory chưa kiểm được. Số của crm cho cùng kết luận.

## 3. Từng lỗi: của ai, kho nào dính

| Lỗi | Tầng | Kho nào dính | Căn cứ |
|---|---|---|---|
| C1 — lượt chấm không có `ref` cho lệnh chữ, bước tổng hợp tự bịa nguồn | kit | mọi kho | Bốn kho đều có eval lệnh chữ. Đề bài các vòng kit (`de-bai-dl6.md`, `de-bai-moc-a.md`, `de-bai-v1-doi-ten-ban-uy-quyen.md`) đã phải dặn tay «trường `verifier:` phải là đường dẫn tệp» — cùng lỗi |
| C2 — khối mang sang do tác tử viết, thẻ đếm đúng chữ `PASS` | kit | mọi kho, ở lượt chấm từ 2 trở đi có mang sang | Khe «máy ngôn ngữ viết → máy đọc» không có khuôn một-nguồn; mới thấy một ca |
| C3 — PASS khi còn mục trong hợp đồng mức vừa, thẻ không in | kit | mọi kho | Phán quyết chỉ REJECT theo mức nặng (`acceptance-verify.js:2014`); ca gốc ở kho kit |
| C4 — nhả khoá không ghi sự kiện | kit | mọi kho chạy đợt điều phối | crm: 692 lần cấp, 0 lần nhả |
| C5 — móc chặn lượt chấm chặn cả lần chạy tiếp | kit | mọi kho chạy đợt có khoá chấm | Chỉ dẫn của kit (`SKILL.md:551`) bảo chạy tiếp bằng `resumeFromRunId`; móc không đọc trường ấy |
| C6 — `paths` và ca kiểm hứa mà chưa có vẫn xanh | kit; nửa «ca kiểm» có phần của kho | mọi kho | Không gì kiểm `paths`. Nửa «lệnh lọc theo tên ca mà không ca nào khớp vẫn thoát 0» là hành vi của bộ chạy kiểm của từng kho |
| C7 — phép đo «từ điểm rẽ nhánh» xanh rỗng sau khi gộp | luật ở kit, vật ở kho | mọi kho | 8–29 hồ sơ gần đây mỗi kho có tệp lệnh tự tính `merge-base`; kit không đưa mốc so cho lệnh. Hôm nay vòng mốc của kit không ghim lại được `nang-repo-setup-0-10-4` vì đúng lớp này |
| C8-rộng — hồ sơ ngoài diff không bị xét lại | không phải lỗi | — | Thiết kế có chủ đích: `CLAUDE.md` «re-pin theo RELEASE», khoá STALE-DIFF-SCOPE-GUARD |
| C8-hẹp — hồ sơ chỉ đổi tệp chữ được miễn xét, dù cùng PR đổi tệp phép của nó trỏ tới | kit | mọi kho | Sinh từ #468: bộ phân tệp bỏ mọi tệp ngoài thư mục hồ sơ; câu NOTE hứa điều mã không làm. Đã lọt 1 lần ở crm, 1 lần ở Quỹ hàng; PR #137 của Inventory sẽ là lần thứ ba |
| C9 — thiếu đường dẫn quy trình soát vẫn PASS | kit | hôm nay chỉ Inventory | Bước thêm tham số là việc phiên chính làm tay (`SKILL.md:464`). Kho không có quy trình soát riêng thì không có gì để thiếu |

## 4. Đề xuất sửa

Thứ tự chọn nghiệm theo luật 26/09: sửa đúng tầng → bộ đọc khoan dung và cờ vàng → bật thêm theo lựa chọn → đổi mặc
định. Không đề xuất nào dưới đây đổi mặc định.

**Nhóm 1 — sửa hẹp, TRỪ, kho không có sự cố không đổi gì thấy được:**

| Lỗi | Sửa | Ràng buộc hai chiều |
|---|---|---|
| C1 | `s4-args.mjs` tự đặt `ref` cho lệnh chữ = tệp lệnh mà `cmd` gọi (đo: 326/333 lệnh chữ ở bốn kho trỏ được một tệp có thật); trường `ref:` tự khai trong `evals.yaml` nếu có thì được giữ. Lệnh chữ không trỏ tệp nào: một dòng cảnh báo gọi tên, tệp args ghi rõ «không có nguồn» để bước tổng hợp không bịa | Eval lệnh chữ ra đúng đường dẫn tệp · eval `config:` giữ nguyên từng byte |
| C2 | Khối mang sang do MÃ dựng từ dữ liệu đã có (`carriedForReport`), tác tử không viết ô phán quyết; bên đọc của thẻ nhận ô bắt đầu bằng `PASS` có dấu mang sang, kèm cờ vàng. Khuôn ô đặt một chỗ có marker, ca kiểm khứ hồi viết–đọc | Ô «PASS (mang từ vòng N)» được đếm · ô không phải PASS vẫn không được đếm |
| C4 | `nhaKhoa` ghi sự kiện `nha` (tài nguyên, phiên, mã thoát, giờ) vào sổ đợt | Có nhả thì có dòng · khoá không tồn tại thì không ghi |
| C8-hẹp | Ở nhánh «chỉ đổi tệp chữ» của cổng trước-gộp: nếu diff của PR chạm một mục `paths` của hồ sơ ấy thì coi là đổi vật và xét lại như trước #468. Hồ sơ không nằm trong diff vẫn không bị đụng | PR đổi tệp phép trỏ tới + một dòng `decisions.jsonl` thì bị xét · PR chỉ đổi `decisions.jsonl` thì vẫn im |
| C3 | Thẻ Cổng Bằng chứng in các mục trong hợp đồng mức vừa khi phán quyết PASS — đúng nội dung hạt giống KY3. KHÔNG đổi luật phán quyết | Có mục mức vừa thì thẻ in · không có thì thẻ như cũ |

**Nhóm 2 — cờ vàng, không chặn:**

- **C6:** `s4-args.mjs` soát từng mục `paths` của chính hồ sơ đang chấm trên danh sách tệp git (dùng lại hàm của hồ sơ
  `loc-paths-dong-mac-dinh`); mục không khớp tệp nào lên một dòng trên thẻ. Bỏ qua `evidence/**` của chính hồ sơ. Nửa «ca
  kiểm chưa có»: kit đã có nhãn «không đỏ trên nền» — kiểm nhãn ấy có lên thẻ ở ca hàng 11 không trước khi thêm gì; và
  thêm một câu vào chỉ dẫn viết eval: lệnh lọc theo tên ca phải đỏ khi không ca nào khớp.
- **C7:** kit đưa mốc so cho lệnh qua một biến môi trường ở cả lượt chấm lẫn làn ghim lại (hôm nay không có), và
  `s4-args.mjs` soát tệp lệnh mà `cmd` gọi: thấy tự tính `merge-base` thì cờ vàng. Dùng chung phép dò tệp lệnh của C1.
  Ngưỡng nâng cờ thành chặn: sau một mốc, còn ≥ 1 làn ghim lại đỏ vì lớp này.

**Nhóm 3 — cần khoá mới hoặc thiết kế, CỘNG, chủ kho phê đích danh:**

- **C9:** đường dẫn quy trình soát thành một khoá cấu hình của kho; `s4-args.mjs` đọc khoá và đặt tham số, nhật ký lượt
  chấm ghi làn soát nào đã chạy. Kho không khai thì không đổi gì; kho khai mà tệp vắng thì dừng có tên. Khoá mới nên sinh
  ra trong vòng sổ khoá (V2a) để mang tên tiếng Anh ngay từ đầu.
- **C5:** lần chạy tiếp cần được nhận là cùng lượt với lần gốc. Móc không biết lần chạy tiếp còn bước nặng nào, nên đây là
  việc thiết kế (lượt mang mã lần chạy, còn hạn thì cho đi), không phải một dòng vá. Đi cùng B6 «khoá biết lượt đã chết»,
  sau khi có C4.

**Không làm:** C8-rộng. Nếu muốn nhìn thấy nó: một dòng NOTE liệt hồ sơ đã ký có `paths` bị PR chạm — chỉ để đọc, và đếm
được ngưỡng của hạt giống.

## 5. Xếp vào đâu

- Nhóm 1 và Nhóm 2 chạm ba gói (`feature-loop`, `acceptance-gate`, `dispatch`) và có một chỗ ở cổng trước-gộp, nên là một
  vòng hạng T3 (trần 4 lượt gọi). Đây là vòng sửa kit ngoài lộ trình đã phê 28/11: cần chủ kho gọi tên và cho ngoại lệ
  luật chiều rộng (b), như các vòng khác giữa Mốc A và Mốc B.
- Vị trí đề nghị: **sau thẻ Mốc A, trước V2a**, đi cùng Mốc B. Lý do: C8-hẹp và C1 đang xảy ra ở mọi kho mỗi tuần, còn
  V2a, DL5, V2b không sửa chỗ nào trong chín lỗi.
- C9 vào V2a. C5 thành hạt giống riêng, mở khi có số đo từ C4.
- Dự báo năm dòng nếu làm Nhóm 1 và 2: dòng 1 ↓ (bớt làm lại sau chấm đạt) · dòng 2 ↓ (bớt luật giám sát đặt tay) · dòng
  3 ↓ (bớt lượt chấm lại vì nguồn bịa) · dòng 4 và 5 = (thêm vài phép soát tệp, không thêm tác tử).
- Người hưởng: người ký Cổng Bằng chứng ở mọi kho (C1, C2, C3, C6, C8-hẹp trace về nguyên tố 2 — màu xanh chưa từng chạy
  chiều đỏ) và giám sát đợt (C4, C5).
