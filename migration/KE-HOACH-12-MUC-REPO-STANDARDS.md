# Kế hoạch thực hiện 12 mục Repo Standards gửi (K1–K12)

> **Trạng thái: CHỦ KHO DUYỆT 21/11/2026 («Duyệt» — nhận cả ba khuyến nghị Q1–Q3 và bốn việc máy đi theo khuyến nghị).**
> Tiến độ từng bước ghi ở `TRANG-THAI.md`. Viết 21/11/2026 14:05, phiên giữ đợt, Mac Studio, theo lời chủ kho: «Phân tích
> và đánh giá sau đó cập nhật từ đó đưa thành kế hoạch thực hiện trình tôi.» Tệp này không mở vòng nào, không tạo ô nào,
> không đổi kế hoạch giai đoạn 2 đã duyệt. Hình kèm: `figures/ke-hoach-12-muc.svg` (chiếu của bảng mục 4, không phải nguồn).

## 0. Thẻ một phút

- **12 mục quy về 5 việc thật.** Một mục đã xong (K12). Một mục tới hạn hôm nay và kho tiêu thụ đã tự xử lý đúng tầng
  (K8). Bốn mục sửa được ngay ở kho tiêu thụ, không đổi kit (K1 nửa đầu, K6, K8 phần tài liệu, K9). Ba mục cùng nằm trong
  MỘT vòng kit đã có tên là DL1 (K1 nửa sau, K2, K10). Ba mục chưa nên làm trước khi có số đo sau mốc 3.1 (K3, K4, K5).
  Hai mục chờ phía Repo Standards (K7, K11).
- **Không mục nào cần một vòng kit mới trước 02/12.** Suất vòng kit trước mốc kế đã dùng cho «lời gộp trong câu ký».
- **Chỗ lợi lớn nhất, rẻ nhất:** K1. `LO-TRINH.html` nằm trong 129 trên 138 lần xung đột; nhát đầu là một dòng ở Inventory.
  Tôi đề xuất đo trước khi sửa, vì chưa ai biết dòng ấy bớt được bao nhiêu.
- **Xin anh:** một lời duyệt, kèm ba lựa chọn chỉ anh quyết được ở mục 6.

## 1. Luật đang trói thứ tự

| Luật | Hệ quả cho kế hoạch này |
|---|---|
| Chiều rộng (b): giữa hai mốc một kho tiêu thụ nhận, tối đa một vòng kit, do chủ kho gọi tên | Suất trước mốc 3.1 đã dùng (PR #15). Vòng kit kế chỉ mở sau khi Inventory cài 3.1 |
| Không phát hành, không cài lên kho nào trước 02/12 (cửa sổ quan sát mốc 3.0) | Mốc 3.1 sớm nhất 02/12 |
| A2 của giai đoạn 2: suất kế dành cho DL1 + P179 | Đợt 2 dưới đây giữ đúng lời ấy |
| Sửa đúng tầng trước; đổi mặc định là mọi kho trả giá (luật 26/09) | Việc kho tự lo được thì kho làm; kit chỉ làm phần còn lại |
| CỘNG cần chủ kho phê đích danh ở Cổng Phạm vi của vòng (ADR 0018) | Mọi mục ghi «CỘNG» dưới đây chưa được phê |
| Phiên giữ đợt chỉ sửa `migration/`; kho khác do phiên của kho ấy làm | Việc ở Inventory mở bằng vòng của Inventory, lời duyệt gõ ở đó |

## 2. Đánh giá từng mục

Số đo gốc là của Repo Standards (`docs/reports/2026-11-20-decision-to-merge-trace.md`, Inventory, 63 hồ sơ, 10–20/11).
Cột «Đo lại 21/11» là phần phiên giữ đợt tự đọc hôm nay trên GitHub.

| Mục | Số đo gốc | Đo lại 21/11 | Tầng sửa đúng | Loại | Kết luận |
|---|---|---|---|---|---|
| **K1** tệp `LO-TRINH.html` xung đột | 129/138 lần xung đột; 58/66 từ 14/11 | Inventory vẫn chưa có dòng gộp cho tệp này, kể cả trên PR #98 | Nửa đầu: một dòng ở Inventory. Nửa sau: kit thôi để PR ghi tệp sinh (DL1) | nửa đầu: việc của kho · nửa sau: TRỪ | **Nặng nhất.** Đo trước (0.3), sửa ở kho (0.4), gỡ gốc ở Đợt 2 |
| **K2** `_acceptance/config.yaml` dùng chung | 30/138; 18/66 | — | Kit: lệnh của từng hồ sơ về hồ sơ ấy. Đã nằm trong DL1 | TRỪ | Đi cùng DL1, Đợt 2 |
| **K3** bằng chứng cũ sau khi gộp nhánh chính | 60/160 lần gộp ngược xảy ra sau chữ ký; ký→gộp 0,6 giờ khi chữ ký là commit cuối, 1,5 giờ khi không | PR #15: ký→gộp 7′21″, 0 commit sau chữ ký (một mẫu) | Kit: DL2 + vấn đề #10 (đổi đường phán quyết, T3) | đổi phán quyết | **Chưa làm.** «Lời gộp» thu hẹp cửa sổ sau chữ ký; đo phần còn lại sau mốc 3.1 rồi mới quyết DL2 |
| **K4** ô `gate` đỏ khi chỉ đang chờ | 46 job đỏ trong 6 ngày, 5 là REJECT thật | Lần thứ ba trong đợt (PR #15). Chưa đếm được lần nào ai hành động sai vì màu | Kit: trạng thái thứ ba hoặc ô riêng, cùng tầng DL3 | CỘNG | Giữ hạt giống. Dòng log đã gọi tên lý do; chỉ màu thiếu |
| **K5** không tách được giờ chờ người | 113/363 giờ nằm giữa «đạt» và «ký» | Suy được từ lịch sử: PR #15 chờ người 26′47″ | Không thêm trường. Đếm từ hai commit đã có | đo | Đếm tay ở hồ sơ mốc 3.1; chỉ viết mã nếu đếm tay không tách được |
| **K6** thước của hồ sơ bị CodeQL báo | 4 cảnh báo, mỗi vòng mới thêm một | Vẫn 4, chưa có cái thứ năm | Kho: quyết phạm vi quét, hoặc vòng gọi lệnh bằng mảng đối số. Kit: thư viện chung | kho: cấu hình · kit: CỘNG | Kho làm trước (0.5). Thư viện của kit chờ ngưỡng luật (a), đang 1/2 |
| **K7** hai job cùng tên `gate` | dự báo | Inventory không có `pr-pipeline.yml`, chưa trùng | Kit: đổi tên ô, trong DL3 | CỘNG, đổi mặc định | Giữ hạt giống. Ngưỡng: kho đầu tiên có cả hai |
| **K8** cách gộp là commit gộp | có hạn | **Hạn tới hôm nay:** repo-setup 0.10.3 ra 02:54Z. PR #98 của Inventory đã khai `merge_method: merge` | Kho: khai khi nâng. Kit: một đoạn tài liệu | tài liệu T1 | Kho đã làm. Kit còn nợ đoạn tài liệu (0.2) |
| **K9** bản nâng công cụ đi trọn hạng nặng | PR 95: 11,5 giờ mở→gộp | Bốn vòng nâng trong ba ngày: T3 · T2 · T3 · T3. **Ngưỡng hạt giống đã đủ** | Kho: nâng theo mốc thay vì từng bản vá; khai lại glob hạng. Kit: làn nhẹ cho thay đổi tái tạo được | kho: nhịp · kit: CỘNG | Kho quyết trước (0.6). Làn nhẹ của kit chỉ mở nếu hai nhát của kho không đủ |
| **K10** sổ ngoài git làm kit đọc bậc thấp | giới hạn của Design Assembly | — | Kit, cùng họ DL1 | sửa hành vi | Đi cùng DL1, Đợt 2 |
| **K11** hai câu hỏi cho gói RS4, RS5b | — | — | Trả lời, không làm | quyết định | Trả lời ở 0.7, khuyến nghị ở mục 5 |
| **K12** số cho vòng «lời gộp» | ký→gộp trung vị 1,15 giờ | PR #15 gộp, 7′21″ | — | — | **Xong** |

Ba điều rút ra từ cả bảng:

1. **Bảy trong mười hai mục là cùng một cơn đau:** thời gian và công sau chữ ký (K1, K2, K3, K8, K12) và trước chữ ký
   mà không ai thấy (K4, K5). Đúng đích «gộp được, không phải ký được». «Lời gộp» vừa cắt phần chờ bấm gộp; phần còn lại
   lớn nhất là xung đột ở tệp sinh.
2. **Hai mục đã tự lành ở đúng tầng mà kit không phải làm gì** (K8 ở Inventory, K12). Kit đi sau một nhịp là được.
3. **Ba mục có nhát của kit là CỘNG** (K4, K6, K9). Cả ba có nhát rẻ hơn ở kho tiêu thụ chưa thử.

## 3. Bốn đợt

### Đợt 0 — từ nay tới 02/12, không đổi engine kit

| Bước | Việc | Ai làm | Thước | Lượt gọi |
|---|---|---|---|---|
| 0.1 | K8: theo dõi PR #98 của Inventory gộp với `merge_method: merge`; sau gộp đọc lại cài đặt gộp của kho ấy | phiên giữ đợt, chỉ đọc | kho còn cho commit gộp; bộ đo ký→gộp không có vòng nào rơi vào «chưa đo» | 0 |
| 0.2 | K8: PR tài liệu hạng T1 vào `main` kit — một đoạn ở GUIDE và QUICKSTART: kho dùng repo-setup từ 0.10.3 khai `merge_method: merge` | phiên giữ đợt, từ cây làm việc riêng | CI xanh; gộp bằng commit gộp theo A3 | nằm trong lời duyệt kế hoạch này |
| 0.3 | K1: đo phát lại, chỉ đọc. Trên một bản sao Inventory, phát lại 66 lần gộp nhánh chính vào nhánh PR từ 14/11, hai lượt: như hôm nay, và có dòng gộp cho `LO-TRINH.html` kèm driver đã cấu hình | phiên giữ đợt | số lần xung đột trước và sau; đối chứng: `PRODUCT-MAP.md` (đã có dòng) phải ra 0 ở cả hai lượt | 0 |
| 0.4 | K1: Inventory thêm một dòng vào `.gitattributes`, nếu 0.3 cho thấy bớt được | vòng của Inventory | số lần xung đột ở tệp ấy trong 7 ngày sau | theo vòng của kho ấy |
| 0.5 | K6: Inventory quyết thư mục thước của hồ sơ có thuộc phạm vi quét CodeQL không | vòng của Inventory, cùng PR với 0.4 | 4 cảnh báo đóng; vòng mới không thêm cảnh báo | — |
| 0.6 | K9: Inventory quyết nhịp nâng repo-setup và hạng của tệp do công cụ ghi | chủ kho, ở kho ấy | số vòng nâng công cụ mỗi tuần; giờ mở→gộp của một vòng nâng | — |
| 0.7 | K11: gửi hai câu trả lời ở mục 5 cho phiên Repo Standards | phiên giữ đợt | — | nằm trong lời duyệt |

### Đợt 1 — mốc 3.1.0, sớm nhất 02/12, Inventory nhận

- **Nội dung:** «lời gộp trong câu ký» (đã ở `main`) · bản vá chữ ký giữ chỗ của lệnh gộp (hạt giống 21/11, phải có trước
  khi tính năng tới kho tiêu thụ) · đoạn tài liệu của 0.2.
- **Bản vá đi trong chính vòng mốc**, không thành vòng riêng. Tiền lệ: mốc 3.0 gộp ba bản vá một dòng trong vòng mốc.
- **Đo ngay sau khi Inventory cài, trên năm vòng đầu:** ký→gộp so với nền 34′ · số vòng còn commit sau chữ ký (K3) · số
  lần ô `gate` đỏ vì chờ và số lần ai hành động sai vì nó (K4) · giờ chờ người tách khỏi giờ chuẩn bị (K5, đếm tay).
- **Lượt gọi:** tối đa 1 (làn V ở Cổng Phạm vi, như các mốc trước).

### Đợt 2 — vòng kit duy nhất giữa mốc 3.1 và 3.2: DL1 + P179

- **Gỡ gốc của K1, K2, K10** trong một vòng: PR thôi ghi tệp tổng hợp · lệnh kiểm của từng hồ sơ về hồ sơ ấy · đọc bậc
  sàn thiết kế khi sổ nằm ngoài git. Kèm bản vá hẹp P179 (ngưỡng đã đủ từ 26/10, đã đốt một lượt chấm ở mốc 3.0).
- **Điều kiện mở:** Inventory đã cài 3.1 · có số của 0.3 · chủ kho gọi tên.
- **Phải có:** đường đọc-cũ cho kho chưa nâng · cân trên cả ba kho tiêu thụ · hạng dự kiến T2–T3.
- **Lượt gọi:** theo thiết kế của vòng (3, hoặc 4 nếu T3).

### Chờ ngưỡng — chưa xếp lịch

| Mục | Mở khi | Loại |
|---|---|---|
| K3 → DL2 | sau năm vòng trên 3.1 ở Inventory, còn từ một phần ba số vòng có commit ghim lại sau chữ ký (ngưỡng máy đề xuất) | đổi phán quyết, T3, cần ràng buộc cả hai chiều |
| K4, K7 → DL3 | Repo Standards dựng xong tầng CI của nó, hoặc kho đầu tiên có hai job cùng tên `gate`, hoặc đếm được một lần hành động sai vì ô đỏ-chờ | CỘNG |
| K5 → mã đo | đếm tay ở mốc 3.1 không tách được | đo |
| K6 → thư viện thước | ngưỡng luật (a) đủ 2 (đang 1), hoặc cảnh báo cùng luật ở kho thứ hai | CỘNG |
| K9 → làn nhẹ | sau 0.6 mà một vòng nâng công cụ vẫn đi trọn hạng nặng | CỘNG |
| K11 → DL4, DL6 | Repo Standards có bản đồ phạm vi dùng thật; mỗi gói một ADR | CỘNG |

## 4. Bảng chiếu (nguồn của hình) — bản sau khi đổi thứ tự 21/11

| Cột | Mục | Tóm tắt |
|---|---|---|
| Đợt 0 · xong 21/11 | K8 | Inventory khai commit gộp; tài liệu kit đã gộp |
| Đợt 0 · xong | K1 nửa đầu | một dòng gộp ở Inventory, đã gộp |
| Đợt 0 · xong | K6 | bốn cảnh báo tự đóng |
| Đợt 0 · xong | K9 | quyết định nhịp nâng đã ghi |
| Đợt 0 · xong | K11 | Repo Standards đã dùng hai câu trả lời |
| Đợt 0 · xong | K12 | PR #15, ký → gộp 7′21″ |
| Đang làm · từ 21/11 | DL1 | K1 nửa sau, K2, K10: tệp sinh và tệp chung thôi chặn gộp |
| Đang làm | P179 | sổ giới hạn thôi đốt lượt chấm |
| Đang làm | bản vá | chữ ký giữ chỗ của lệnh gộp |
| Mốc chung · từ 02/12 | — | một mốc mang DL1, P179, bản vá, «lời gộp»; mỗi kho cài một lần |
| Mốc chung | đo | K3 còn lại · K4 đếm · K5 tách, trên năm vòng đầu |
| Sau mốc | K3 → DL2 | bằng chứng hoá cũ sau khi gộp nhánh chính — vòng kế |
| Chờ ngưỡng | K4, K7 → DL3 | chờ tầng CI của Repo Standards |
| Chờ ngưỡng | K5 → mã đo | nếu đếm tay không tách được |
| Chờ ngưỡng | K6, K9 phần kit | thư viện thước · làn nhẹ |
| Chờ ngưỡng | K11 → DL4, DL6 | mỗi gói một ADR |

## 5. Hai câu trả lời đề xuất cho K11

- **Kit có đọc `architecture/modules.yaml` của kho dùng không?** Chưa. Gói điều phối đã xếp vòng bằng `ranh_gioi` và
  `vung` của chính kit; thêm nguồn thứ hai là hai bên viết và đọc trôi khỏi nhau. Xét lại khi DL4 mở, và khi đó kit ĐỌC
  tệp của kho chứ không giữ bản sao. Hệ quả cho Repo Standards: không dựng RS4 vì kit.
- **Bản uỷ quyền của «giám sát chủ động» nằm ở đâu?** Ở `governance/` của kho dùng. Nó là quy định của kho, không phải
  engine; kit chỉ đọc. Việc này chạm khoá cổng người (ADR 0002) nên cần một ADR riêng trước khi thành vòng.

## 6. Anh quyết gì

**Ba điều chỉ anh biết** — mỗi điều kèm khuyến nghị:

| # | Câu | Khuyến nghị | Máy không biết |
|---|---|---|---|
| Q1 | K9: Inventory nâng repo-setup theo từng bản vá như ba ngày qua, hay gom theo mốc? | Gom theo mốc, trừ bản vá chữa lỗi kho đang vấp | anh cần bản mới của công cụ nhanh tới mức nào |
| Q2 | K6: thước của hồ sơ có ra khỏi phạm vi quét CodeQL ở Inventory không? | Có — thước chỉ chạy lúc chấm, không giao cho người dùng | khẩu vị của anh với việc bớt một vùng khỏi lưới quét |
| Q3 | Việc ở Inventory (0.4–0.6) mở ngay, hay chờ sau 02/12 để không chen vào cửa sổ quan sát mốc 3.0? | Mở ngay: cả ba không đổi kit, nên không làm nhiễu vế nào | lịch vòng sản phẩm của Inventory tuần tới |

**Máy đi theo khuyến nghị, anh veto được:** bản vá chữ ký giữ chỗ đi trong vòng mốc 3.1 · PR tài liệu 0.2 gộp theo A3 ·
gửi hai câu trả lời K11 · thứ tự Đợt 1 rồi Đợt 2 · mọi ngưỡng ghi «máy đề xuất».

Trả lời một chữ «Duyệt» là nhận cả ba khuyến nghị; khác đi thì ghi «Q1 = …».

## 7. Ngân sách và giới hạn

- **Lượt gọi người:** kế hoạch này 1 (lời duyệt) · mốc 3.1 tối đa 1 · vòng DL1 theo thiết kế · việc ở Inventory tính vào
  vòng của kho ấy. Giai đoạn 2 vẫn 11/15; lời duyệt này tôi không tính vào đợt chuyển nhà vì nó là việc sau đợt.
- **Chưa đo, nói thẳng:** số của Repo Standards chưa được đo lại, trừ cột «Đo lại 21/11» · lượt phát lại 0.3 chưa chạy ·
  Quỹ hàng chưa kiểm cho K8 · K3 và K5 mới có một mẫu · các ngưỡng mở là đề xuất của máy.
- **Không làm trong kế hoạch này:** mở vòng kit trước 02/12 · đổi mặc định của kho nào · sửa Inventory từ phiên giữ đợt.

## 8. Đổi thứ tự — chủ kho quyết 21/11 («Đổi theo đề xuất»)

Lời chủ kho trước đó: việc gộp theo lời không quan trọng vì chủ kho chạy kit bằng phiên điều phối, vốn đã gộp được;
điều chủ kho quan tâm là các bản sửa rút ngắn đoạn bắt đầu → gộp, mà chúng lại nằm sau mốc 3.1. Mục 3 ở trên («Bốn
đợt») vì thế hết hiệu lực từ Đợt 1 trở đi; thứ tự mới:

1. **Vòng DL1 + P179 mở ngay**, không chờ 02/12 — làm ra bản sửa không làm nhiễu cửa sổ quan sát mốc 3.0, cài mới làm
   nhiễu. Đề bài: `de-bai-dl1-p179.md`.
2. **Vòng đang chạy thu về đúng bản vá chữ ký giữ chỗ**, không cắt thẻ riêng (phiên `moc-3-1`).
3. **Một mốc duy nhất quanh 02/12** mang DL1, P179, bản vá và «lời gộp»: mỗi kho cài một lần, ghim lại một lần.
4. **DL2 là vòng kế sau mốc ấy** (K3). Trước đây DL2 «chờ ngưỡng»; nay có chỗ trong hàng, vẫn cần chủ kho gọi tên.

Luật chiều rộng (b) — «giữa hai mốc một kho nhận, tối đa một vòng sửa kit» — chủ kho nới cho đúng hai việc có tên:
«DL1 + P179» và «bản vá chữ ký giữ chỗ». Không việc nào khác được đi theo lối nới này.

Chỗ phiên giữ đợt đánh giá sai, ghi lại: xếp «lời gộp» lên trước vì coi lời gộp tách khỏi lời ký là chỗ đau chính;
với cách chủ kho làm việc thì không phải. Số lượt gọi người ước cho ba vòng: 6–8.

