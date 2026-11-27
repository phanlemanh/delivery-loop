# Đề xuất — lộ trình kit sau DL6: đổi tên bản uỷ quyền, sổ khoá và lệnh cấu hình, DL3–DL5

**Ngày:** 2026-11-28 · **Trạng thái:** CHỜ CHỦ KHO PHÊ · **Người soạn:** phiên giữ đợt (Mac Studio).
Tệp này là SỔ, không phải ô: không mở vòng nào, không tạo hồ sơ `_acceptance/` nào. Mỗi vòng dưới đây chỉ mở khi chủ kho
gọi tên, và lời duyệt cổng của từng vòng do chủ kho gõ ở chính phiên của vòng ấy.

## 1. Ba quyết định của chủ kho (28/11)

1. **Đổi tên khoá của bản uỷ quyền sang tiếng Anh TRƯỚC khi cắt mốc** gom DL2 + DL6.
2. **Khoá mặc định và lệnh cấu hình** như đã thảo luận: khoá đúng North Star thì bật sẵn, khoá có đánh đổi thì hỏi người
   kèm lợi ích và đánh đổi, có một lệnh để kiểm và đặt lại; tên khoá tiếng Anh, lời giải thích tiếng Việt.
3. **Mở DL3, DL4, DL5.**

## 2. Tóm tắt một phút

| Thứ tự | Việc | Loại · hạng dự kiến | Lượt gọi theo thiết kế |
|---|---|---|---|
| 1 | **V1** — đổi tên khoá bản uỷ quyền | sửa tên, chưa ai dùng · T2 | 2–3 |
| 2 | **Mốc A** — gom DL2 + DL6 + V1, ba kho nhận, kèm bảng khoá soạn tay | mốc | 1 |
| 3 | **V2a** — sổ khoá, khoá tiếng Anh có đường đọc tên cũ, lệnh kiểm, bật sẵn làn «máy bật» | CỘNG · T3 | 4 |
| 4 | **DL5** — sổ giới hạn có ngưỡng, có hạn, đo quay lại; gỡ gốc P179 | CỘNG · T2 | 3 |
| 5 | **V2b** — nửa «đặt lại» của lệnh cấu hình | CỘNG · T2 | 3 |
| 6 | **Mốc B** — gom V2a + DL5 + V2b | mốc | 1 |
| 7 | **DL3** — bằng chứng hồi quy đọc từ CI; ô bằng chứng đổi tên khỏi `gate` | CỘNG, đổi đường phán quyết · T3 | 4 |
| 8 | **Mốc C** — DL3 (và DL4 nếu có ca) | mốc | 1 |
| song song | **DL4, bước đo** — phiên chỉ đọc, không viết mã | đo | 0 |

- Phía kit: 8 vòng, khoảng **19–20 lượt gọi anh** nếu không vòng nào vượt trần.
- Phía kho tiêu thụ: mỗi mốc mỗi kho một vòng nâng kit (ở Inventory là T3, trần 4). Ba mốc × ba kho là tối đa 9 vòng;
  đề xuất ở mục 5 để bớt con số này.
- Ngày: theo nhịp đo được gần đây (một vòng kit nửa ngày đến một ngày), Mốc A rơi quanh 30/11, Mốc B quanh 07/12, Mốc C
  quanh 11/12. Đây là ước lượng từ nhịp, không phải lời hứa.
- **Bốn điều cần anh xác nhận** nằm ở mục 6.

## 3. Từng việc

### V1 — đổi tên khoá bản uỷ quyền (trước mốc)

- **Vì sao bây giờ:** bộ đọc `governance/delegation.yaml` gộp ngày 27/11 (PR #38), chưa mốc nào mang đi, chưa kho nào viết
  tệp. Phiên giữ đợt đã kiểm: kho Repo Standards chưa có tệp nào nhắc `tu_lam` hay `delegation.yaml`. Đổi lúc này không
  cần đường đọc tên cũ; đổi sau mốc thì phải đọc tên cũ mãi.
- **Đổi gì** (tên cuối chốt ở Cổng Phạm vi của vòng; dưới đây là đề nghị):

  | Hôm nay (`plugins/dispatch/scripts/uy-quyen.mjs`) | Đề nghị |
  |---|---|
  | `ban` | `version` |
  | `tu_lam` | `delegated` |
  | quyền `gop` · `thu-tu-gop` | `merge` · `merge-order` |
  | quyền `phien` · `chuyen-hang` · `mo-day` | `session` · `reassign-row` · `open-lane` |
  | quyền `phan-quyet-chung` · `lo-trinh` | `shared-ruling` · `roadmap` |
  | tên bị từ chối `muc-ngoai-hop-dong` · `thiet-ke` | `out-of-contract` · `design` |

- **Không đổi:** tên sự kiện trong nhật ký đợt, tên tệp script, tên hồ sơ. Chữ hiện cho người trên thẻ vẫn là tiếng Việt.
- **Ràng buộc cả hai chiều:** tệp viết bằng tên mới thì đọc được; tệp viết bằng tên cũ thì bị từ chối cả tệp, kèm câu
  gọi đúng tên mới. Kho không có tệp vẫn chạy từng byte như cũ.
- **Kèm theo:** sửa ADR 0030 và chỉ dẫn của gói điều phối; báo Repo Standards để khuôn RS5b dùng tên mới.
- Khoá `tu_merge` trên thẻ mở đợt đã phát hành từ trước nên KHÔNG thuộc V1; nó đổi tên ở V2a, có đường đọc tên cũ.

### Mốc A — gom DL2 + DL6 + V1

- Cửa sổ: mọi PR sau `v3.1.1` trên `main`. Số của mốc do vòng mốc chốt.
- **Bảng khoá soạn tay:** đề bài vòng nâng kit của mỗi kho mang một bảng chín khoá — khoá nào kho chưa bật, số đo từ
  lịch sử của chính kho, khuyến nghị, cách đảo. Kho quyết ở Cổng Phạm vi của vòng nâng kit (cổng đã có, không thêm lượt
  gọi). Đây là phép thử rẻ cho câu hỏi «thấy bảng thì kho có bật không», làm gốc đo cho V2.
- **Bật ngay, không sửa engine** (anh quyết từng cái ở vòng tương ứng): kho kit bật máy tự định tuyến mục ngoài hợp đồng;
  Inventory bật `stale_scope: paths`; crm xét «ký là gộp».

### V2 — sổ khoá, lệnh cấu hình, khoá tiếng Anh (hai lát)

**Luật chung:** máy đọc tiếng Anh, người đọc tiếng Việt. Số đo 28/11: 21/62 khoá cấp 1–2 trong cấu hình của bốn kho là
tiếng Việt không dấu, lẫn với khoá tiếng Anh ngay trong một khối.

**V2a — sổ khoá và lệnh kiểm.**
- Một sổ khoá một-nguồn trong kit. Mỗi khoá: tên tiếng Anh, tên cũ, giải thích tiếng Việt, làn, điều kiện máy kiểm được,
  thước nó dịch chuyển, lợi ích, đánh đổi, cách đảo. `GUIDE`, khuôn `acceptance-init`, thẻ và lệnh cùng rút từ sổ này.
- Tên cũ vẫn đọc được, kèm cờ vàng; kho không phải chuyển hàng loạt. Tên cũ và tên mới cùng có mặt mà khác giá trị thì
  đỏ, gọi tên cả hai. Bộ đọc bash và bộ đọc JS rút cùng một bảng tên cũ, có phép so hai bên.
- **Ba làn:**

  | Làn | Khoá (tên hôm nay) | Ai quyết |
  |---|---|---|
  | Máy bật sẵn, có đường đảo | `ngoai_n_tu_dinh_tuyen`; `repin_parallel_suites` và `lo_trinh.chan` khi máy kiểm đạt điều kiện | Máy ghi khoá vào cấu hình kho ở `acceptance-init` và ở PR nâng kit; người gạch được từng dòng |
  | Chính sách rủi ro của kho | `stale_scope: paths` · `do_san_tren_nen` | Người chốt một lần cho cả kho |
  | Người quyết | `ban_do.ngoai_git` · bản uỷ quyền và `tu_merge` · `gop_theo_loi_ky` | Người, một lần mỗi kho, thẻ ghi lợi ích bằng số của kho và đánh đổi |

- «Bật sẵn» nghĩa là **máy ghi khoá vào cấu hình của kho**, không lật nghĩa của khoá vắng trong engine: khoá vắng vẫn là
  hành vi cũ, mỗi khoá hiện trong diff và đảo bằng xoá một dòng.
- Lệnh kiểm chỉ đọc: in từng khoá, trạng thái, lợi ích, đánh đổi, cách đảo. Số lợi ích chỉ lấy từ thước đã có; chưa có
  thước thì in «chưa đo được».
- Câu trả lời «không» của kho được ghi lại kèm lý do, để mốc sau máy không hỏi lại.
- Hồ sơ mốc thêm một dòng đếm: «khoá đã phát hành: k/N kho bật». Khoá 0 kho bật sau hai mốc thì hỏi lại người hưởng.

**V2b — nửa «đặt lại».** `config-patch.mjs` hôm nay chỉ thêm khoá mới và từ chối sửa khoá đang sống. Lát này thêm chế độ
sửa và gỡ, giữ bản sao lưu và phép tự kiểm sau khi ghi. Khoá thuộc làn «người quyết» chỉ đổi khi người gõ lệnh, và vào
nhánh chính qua PR.

### DL5 — sổ giới hạn có ngưỡng, có hạn, đo quay lại

- **Chỗ đau:** sổ giới hạn là sổ không trần (ba vòng gần nhất ghi thêm 15, 14, 6 hàng), và ca P179 vẫn đốt lượt sau bản
  vá hẹp: một lượt REJECT ở DL2, một lần CI đỏ sau chữ ký ở DL6.
- **Nội dung:** ngưỡng theo lớp, hạn cho từng hàng, đếm lần một giới hạn quay lại; lệnh ký tự ghi hàng sổ để vòng không
  còn quên.
- **Đã có sẵn, không dựng lại:** phần «mặc định định tuyến mục ngoài hợp đồng» chính là khoá `ngoai_n_tu_dinh_tuyen`; V2a
  lo việc bật nó.
- Đi sau V2a để khoá mới của DL5 vào sổ khoá bằng tên tiếng Anh ngay từ đầu.

### DL3 — bằng chứng hồi quy đọc từ CI

- **Chỗ đau:** mỗi lượt chấm máy chạy lại trọn bộ kiểm dù CI đã chạy; ô `gate` đỏ cả khi chỉ đang chờ ký (Inventory: 46
  job đỏ trong 6 ngày, 5 là REJECT thật). Hai vòng kit gần nhất vượt trần lượt gọi đều vì xin thêm lượt đo dài.
- **Nội dung:** lượt chấm đọc kết quả hồi quy từ GitHub; ô bằng chứng mang tên khác `gate`.
- **Điều kiện:** tầng CI của Repo Standards (RS3) đã dùng thật ở Inventory (tra soát 26/11).
- **Rủi ro phải nêu ở Cổng Phạm vi của vòng:** đây là đổi đường phán quyết, nên cần ràng buộc cả hai chiều; đổi tên ô
  kiểm kéo theo luật bảo vệ nhánh ở từng kho, tức một bước do anh làm ở phía GitHub. Vì thế DL3 đi mốc riêng (Mốc C), để
  đo được nó làm đổi số nào.

### DL4 — điều phối đọc phụ thuộc gián tiếp

- **Chỗ vướng:** điều kiện mở viết lại hôm nay (commit `18a71093`) là «≥ 1 ca hai hàng có vùng không trùng mà vẫn va chạm
  vì phụ thuộc gián tiếp», và hôm nay đếm 0 ca. Luật của kit: ô chỉ mở khi có neo ngoài.
- **Đề nghị:** «mở DL4» bằng một **bước đo** — phiên chỉ đọc, 0 lượt gọi: đo tỉ lệ hàng khai `ranh_gioi` ở ba kho và dò
  lịch sử gộp tìm ca phụ thuộc gián tiếp. Có ≥ 1 ca thì DL4 thành vòng dựng, mang ca ấy làm gốc, vào Mốc C. 0 ca thì DL4
  ở lại hạt giống và phiên giữ đợt báo anh số đo.
- Nếu anh muốn dựng ngay dù chưa có ca: đó là mở tay một ô mà luật neo chặn; làm được, và được ghi đúng như vậy.

## 4. Thứ tự và vì sao

1. **V1 trước Mốc A** — quyết định 1.
2. **V2a trước DL5 và DL3** — hai gói ấy thêm khoá mới; sổ khoá có trước thì khoá mới sinh ra đã đúng tên, không phải
   chuyển lần hai.
3. **Mỗi lúc một vòng viết mã.** V2a, DL5, V2b cùng chạm gói `acceptance-gate`; chạy song song là tự gây xung đột. Chỉ
   bước đo DL4 (chỉ đọc) chạy song song được.
4. **DL3 sau Mốc B, mốc riêng** — đổi đường phán quyết cần tách nguyên nhân khi đo.

## 5. Luật của kit mà đề xuất này chạm

- **Luật chiều rộng (b)** cho tối đa một vòng giữa hai mốc được kho nhận. Đề xuất cần ngoại lệ ở hai chỗ: V1 là vòng sửa
  mã thứ tư sau `v3.1.1`; giữa Mốc A và Mốc B có ba vòng (V2a, DL5, V2b). Lối kia là cắt mốc sau từng vòng, nhưng mỗi mốc
  kéo theo một vòng nâng kit ở từng kho.
- **CỘNG cần anh phê đích danh** (ADR 0018): V2a, V2b, DL3, DL5, và DL4 nếu dựng. Phê ở Cổng Phạm vi của từng vòng.
- **Cân trên mọi kho:** không vòng nào lật mặc định của engine; mọi đổi tên có đường đọc tên cũ, trừ V1 (chưa ai dùng).
- **Số vòng nâng kit ở kho:** kho không buộc nhận mọi mốc. Đề nghị Inventory nhận cả ba (kho đo); crm và Quỹ hàng nhận
  Mốc A hoặc đợi Mốc B, anh quyết lúc cắt mốc.
- **Đợt chuyển nhà** (hạn 19/12, II.1 vế 3 không sớm hơn 02/12, rồi II.4) chạy độc lập với lộ trình này. Khi đợt đóng,
  tệp này dời sang `docs/plans/` cùng các hạt giống khác; các việc chưa xong thành hàng ở lộ trình của kit.

## 6. Điều cần anh xác nhận

| # | Câu hỏi | Khuyến nghị |
|---|---|---|
| 1 | Ngoại lệ luật (b) cho đúng các vòng có tên ở bảng mục 2? | Đồng ý. Lời xác nhận vẫn gõ ở Cổng Phạm vi của từng vòng, theo tiền lệ DL2 |
| 2 | DL4 mở bằng bước đo trước, hay dựng ngay? | Đo trước: 0 lượt gọi, và giữ đúng luật neo anh đặt 18/09 |
| 3 | DL5 có cần một ADR riêng trước khi mở vòng không? | Không. Nó không chạm khoá cổng người như DL6; phê CỘNG ở Cổng Phạm vi là đủ |
| 4 | Ba mốc (A, B, C) hay hai mốc (A, rồi B gom cả DL3)? | Ba mốc: DL3 đổi đường phán quyết, cần mốc riêng để tách nguyên nhân |

Sau khi anh phê, việc đầu tiên là anh bảo mở phiên cho **V1**; phiên giữ đợt soạn đề bài `migration/de-bai-v1-doi-ten-ban-uy-quyen.md`.

## 7. Không làm

- Không lật mặc định của engine cho khoá nào.
- Không đổi tên sự kiện, tên tệp script, tên hồ sơ, thuật ngữ mặt người (Cổng Đáng, Cổng Phạm vi…).
- Không dựng phép đo mới cho từng khoá; không viết thêm trang hướng dẫn thay cho sổ khoá.
- Không cắt thẻ, không cài lên kho nào ngoài các vòng mốc và vòng nâng kit có tên.
- Không viết `governance/delegation.yaml` vào kho nào thay chủ kho.
