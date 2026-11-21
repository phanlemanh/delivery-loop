---
schema_version: 1
slug: loi-gop-trong-cau-ky
feature: Lời gộp đi cùng lời ký trong một câu ở Cổng Bằng chứng — ô gộp điền sẵn «gộp khi CI xanh», máy gộp theo lời người đã gõ bằng lệnh gộp sẵn có khi CI xanh; kho không bật thì thẻ và hành vi giữ nguyên
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:                     # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:                   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Chủ kho mở vòng 21/11 ở phiên giữ đợt chuyển nhà, nguyên văn: «Mở ngay, vòng riêng và phiên riêng» — sau hai câu «Sửa
ngay vì nó đang đi ngược với north star của kit?» và «Đó là lỗi kit hay lỗi repo tiêu thụ?». Lời ấy mở vòng và dùng suất
vòng meta duy nhất trước mốc kế (luật chiều rộng (b) của `CLAUDE.md`); nó không thay Cổng Đáng này.

Gốc: delivery-loop/_acceptance/ky-den-gop — hồ sơ ấy ký ý định «đoạn ký → gộp có thước và có chủ máy» (23/10). Chủ máy
mới chỉ có TRONG một đợt chạy: lệnh gộp của gói điều phối đòi khoá merge của dãy và `tu_merge` của đợt. Vòng chạy ngoài
đợt thì lệnh ký vẫn ghi «người approve / bấm merge PR», thẻ Cổng Bằng chứng chỉ có ô «ký hay trả», và đuôi tự do của câu
ký được chép nguyên văn vào sổ quyết định mà không ai hành động theo.

Người gặp: chủ kho, ở mọi vòng chạy ngoài đợt của mọi kho tiêu thụ. Đo ở đợt chuyển nhà 19–21/11 (sổ
`migration/TRANG-THAI.md`, nhánh `chuyen-nha`), 2 trên 3 vòng:

- Vòng của kho tiêu thụ thứ hai (19/11): CI xanh trên commit chữ ký sau 10′, PR chờ lời gộp thêm 45′; ký → gộp 54′ so
  với ngưỡng 11′ của kho ấy; lời gộp là lượt gọi người thứ tư (đích 3).
- PR #621 của `crm-onehub` (20–21/11): chủ kho dán nguyên dòng mẫu của thẻ, điền «ký», lời gộp rơi mất; vòng lên 4 lượt
  gọi so với trần T2 là 3. Lần này đề bài đã dặn «lời gộp cùng lời ký» sau lần đầu — dặn bằng lời không chặn được lần hai.
- Vòng còn lại (Inventory, 19/11): ký → gộp 50′, sát ngưỡng 51′ của kho ấy một phút.

Đích của kit từ 23/10 là GỘP ĐƯỢC. Lượt gọi người và giờ máy sau chữ ký tính vào chính vòng đó; một câu hỏi riêng «cho gộp
khi CI xanh?» mà ba lần được trả lời cùng một chữ là trạm thu phí, không phải điểm quyết định.

Vật đã có, vòng này nối lại chứ không dựng mới: bốn điều kiện gộp đã thành mã ở `plugins/dispatch/scripts/gop.mjs` (hồ sơ
đã thông trên đầu nhánh · CI xanh trên đúng đầu nhánh · điều kiện merge-base · `gh pr merge --merge --match-head-commit`,
không `--auto`); thước `ky_den_gop` ở `plugins/dispatch/scripts/do-gop.mjs`; bước PR sẵn sàng lúc trình thẻ.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Câu «ký rồi có gộp khi CI xanh không» gần như chỉ có một lối ra sống, nên ô điền sẵn là đủ, không cần câu hỏi mới | Ô điền sẵn thành lần gộp ngoài ý người ký | Đếm lời gộp của ba vòng 19–21/11 | Đã thử: 3/3 là «gộp khi xanh» (mẫu ba phần tử, cùng một người) |
| 2 | Lời người đã gõ, ghi trong sổ quyết định trên đầu nhánh, đủ làm quyền cho máy gộp ngoài đợt — thay cho khoá merge và `tu_merge` | Máy gộp vào nhánh chính mà không lần được về lời ai | Đối kháng ở bước thiết kế + một ADR | Chưa thử |
| 3 | Lệnh gộp sẵn có dùng được cho vòng ngoài đợt mà không viết đường gộp thứ hai | Hai đường gộp trôi khỏi nhau | Đọc mã: phần xét (`xetGop`) thuần, chỉ vỏ lệnh đòi đợt | Đã đọc: phần xét dùng lại được; vỏ lệnh cần một lối vào theo lời |
| 4 | Kho không bật thì thẻ, dòng lệnh và hành vi không đổi một byte | Mọi kho trả giá cho sự cố của hai kho | Vi phân thẻ trên hồ sơ thật của kho này | Chưa thử |
| 5 | Dòng điền sẵn không phải máy viết hộ chữ quyết (ADR 0002): chữ «Ký» vẫn do người gõ, ô gộp là khuyến nghị người sửa được | Máy vòng qua khoá cổng người | Đối kháng ở bước thiết kế, soi cùng ranh với dòng «Treo: phê hết» | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] ở kho đã bật, lời gộp có còn tách khỏi lời ký không, và đoạn ký → gộp có về dưới ngưỡng nền của chính kho ấy không?
- Kết quả nào là SỐNG: [đề xuất] trong N vòng ký đầu tiên ở các kho đã bật (N ≥ 3, tính trong 21 ngày từ lần cài đầu), 0 vòng tốn một lượt gọi người riêng cho việc gộp, và ký → gộp trung vị không vượt ngưỡng nền của kho (Inventory 51′ · crm 68′); đếm từ lịch sử nhánh chính và sổ quyết định của vòng. N = 0 thì thước vô hiệu, không đọc thành «đạt».
- Kết quả nào là CHẾT: [đề xuất] một lần máy gộp mà câu người gõ không mang lời gộp — tắt khoá ngay, bất kể các số khác; hoặc ≥ 2 trên N vòng vẫn phải xin lời gộp riêng dù câu ký đã mang ô gộp.
- Timebox: [đề xuất] cửa sổ 21 ngày từ lần cài đầu ở một kho bật khoá; ngày cài là quyết định riêng của chủ kho, không sớm hơn 02/12/2026.

## Kết quả prototype

Không dựng prototype — vật là chữ trên thẻ và một lối vào của lệnh gộp, đo được thẳng trên vật ở lượt chấm.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Sổ đợt chuyển nhà (số đo 19–21/11, lời chủ kho) | `migration/TRANG-THAI.md` trên nhánh `chuyen-nha` của kho này | triết-lý/logic | có — chỉ số đo và lời trích | — |
| Thiết kế ký → gộp | `docs/superpowers/specs/2026-10-23-ky-den-gop-design.md` | triết-lý/logic | có — bốn điều kiện gộp, «không làm hàng gộp tự động» | — |

## Cổng 0

- **decision = …** Căn cứ: …
- **disposition = …** Căn cứ: không có prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** …

## Thước đo thành công → ứng viên criterion

- Thẻ Cổng Bằng chứng của kho đã bật in ô gộp điền sẵn trong dòng lệnh; ô «ký hay trả» vẫn trống.
- Câu ký mang lời gộp → một dòng sổ máy đọc được; câu ký vắng lời gộp → hành vi như hôm nay.
- Máy gộp bằng lệnh gộp sẵn có, chỉ khi dòng sổ ấy nằm trên đầu nhánh và bốn điều kiện đạt; không lời thì lệnh từ chối trước mọi lời gọi gộp.
- Kho không bật: thẻ và dòng lệnh giống hệt bản trước vòng, đo bằng vi phân trên hồ sơ thật.
- Số ký → gộp và số lượt gọi của vòng đọc được bằng thước đã có (`ky_den_gop`), không dựng thước mới.

## Out of scope từ khám phá

- Hàng gộp tự động và tự gộp của GitHub (`--auto`) — thiết kế 23/10 đã bác; lệnh gộp giữ `--match-head-commit`.
- Bật mặc định cho mọi kho — luật 26/09: bật thêm theo lựa chọn trước, đổi mặc định sau.
- Hồ sơ máy đã thông không có chữ ký người (làn V) — không có câu người gõ thì không có lời gộp; việc ấy ghi hạt giống nếu số đo đòi.
- Máy tự phát ngôn «Ký», hay gộp khi câu ký không mang lời gộp.
- Cắt thẻ, phát hành, cài lên kho tiêu thụ — quyết định riêng của chủ kho.
- Bốn việc thấy trên đường của đợt chuyển nhà (DL1 · P179 · lượt chấm đọc nhãn «đỏ sẵn trên nền» · `main` thiếu dòng tắt plugin chợ cũ).
