# Thiết kế — lời gộp trong câu ký (hồ sơ `loi-gop-trong-cau-ky`)

Ngày 21/11/2026. Vòng meta duy nhất trước mốc kế (luật chiều rộng (b)); chủ kho mở 21/11 «Mở ngay, vòng riêng và phiên
riêng», quyết «làm» ở Cổng Đáng cùng ngày. Neo: hồ sơ `ky-den-gop` (23/10).

## Ý định và vì sao

Đích của kit là GỘP ĐƯỢC. Hồ sơ `ky-den-gop` cho đoạn ký → gộp một chủ máy, nhưng chỉ trong một đợt chạy (lệnh gộp đòi khoá
merge của dãy và `tu_merge` của đợt). Vòng chạy ngoài đợt thì thẻ Cổng Bằng chứng chỉ có ô «ký hay trả», lệnh ký để việc
gộp cho người, và đuôi tự do của câu ký vào sổ mà không ai làm theo. Đợt 19–21/11: 2 trên 3 vòng tốn một lượt gọi người
riêng cho câu «gộp khi xanh»; 63 hồ sơ Inventory 10–20/11 chờ trung vị 22′ sau khi ô bắt buộc đã xanh.

Sau vòng này, ở kho đã bật: người dán dòng lệnh của thẻ, gõ chữ ký — lời gộp đã nằm trong cùng câu — và máy gộp khi CI xanh.

## Mục tiêu · ngoài mục tiêu · điều không được xảy ra

- Mục tiêu: lời gộp đi cùng lời ký trong MỘT câu; máy gộp theo lời ấy bằng lệnh gộp đã có; kho không bật không đổi một byte.
- Ngoài mục tiêu: hàng gộp tự động, tự gộp của GitHub, hồ sơ máy đã thông (không có câu người gõ), luật gộp trong đợt.
- Không được xảy ra: máy tự phát ngôn «Ký»; máy gộp khi câu người gõ không mang lời gộp; một đường gộp thứ hai.

## Các lối đã cân

| Lối | Được gì | Mất gì | Kết |
|---|---|---|---|
| **A — ô gộp điền sẵn trong câu ký + dòng sổ máy đọc + lối vào «theo lời ký» của lệnh gộp sẵn có** | Lời gộp là lời của CHÍNH lần ký ấy, đi cùng dòng người dán; một chỗ gọi `gh pr merge` | Thêm một nhãn vào ngữ pháp câu gộp | **chọn** |
| B — khoá «luôn gộp sau ký», không cần lời trong câu | Ít chữ hơn trên thẻ | Lời đứng thường trực thay lời của lần ký; trái «chỉ gộp khi câu người gõ mang lời gộp» | bác |
| C — bật tự gộp của GitHub sau chữ ký | Không cần phiên chờ CI | Mất `--match-head-commit`; thiết kế 23/10 đã bác `--auto` | bác |
| D — mọi vòng mở một đợt một hàng để dùng `tu_merge` | Không thêm mã ở lệnh gộp | Đợt đòi bộ phát lịch, khoá, gói đợt; `tu_merge` là lời cho cả đợt, không đi cùng lời ký | bác |

Tiền lệ ngành của lối A: Bors (`bors r+` — lời duyệt mang lời gộp, máy gộp bản đã kiểm) và hàng gộp của GitHub.

## Thiết kế

### 1. Ổ cắm của kho

`feature_loop.gop_theo_loi_ky: true` trong `_acceptance/config.yaml`. Chỉ giá trị `true` là bật; vắng, `false` hay giá trị
khác đều là tắt. Tắt thì thẻ, dòng lệnh, `--extract` và mọi hành vi giống hệt bản trước vòng.

### 2. Thẻ Cổng Bằng chứng (`plugins/acceptance-gate/scripts/gate-card.js`)

Kho bật, và thẻ đang ở nhánh hỏi «ký hay trả» của một hồ sơ CHƯA có chữ ký người: dòng lệnh thêm ô `gộp: khi CI xanh` ngay
trước `ký hay trả: ___`. Ô là dòng BÁO như «Treo: phê hết»: vào `routing.bao`, không vào `routing.hoi`, không vào dòng «Trả
lời mẫu»; khối việc-của-anh thêm một dòng nói cách sửa ô thành «chưa». Ô «ký hay trả» vẫn trống.

Không in ô ở: hồ sơ máy-đi-trước hay máy đã thông (không có câu ký), hồ sơ đã có chữ ký (không còn gì để gộp theo lời mới),
thẻ không ký được, hồ sơ đã khép.

Vì sao điền sẵn không phải máy viết hộ chữ quyết: ô gộp chỉ có hiệu lực khi CHÍNH câu ấy mang chữ «Ký» do người gõ; câu
«Trả lại» mang ô gộp thì ô vô nghĩa. Cùng ranh với «Treo: phê hết» và «cắt/hoãn: đồng ý cắt» (ADR 0002: ranh ở ai phát
ngôn cuối).

### 3. Ngữ pháp câu gộp (`human-facing-language.md`)

- `GATE-ONESHOT-SLOTS` thêm `g2 gộp`.
- Khối mới `GATE-ONESHOT-GOP` — danh sách ĐÓNG các dạng người gõ, mỗi dạng một lối. Sáu dạng lời gộp và năm dạng vế ký:

```
gộp: khi CI xanh → gộp
gộp khi CI xanh → gộp
gộp: khi xanh → gộp
gộp khi xanh → gộp
gộp: chưa → chưa-gộp
chưa gộp → chưa-gộp
Ký → chữ-ký
Ký: <tên> → chữ-ký
Ký: <tên> <ngày> → chữ-ký
ký hay trả: Ký → chữ-ký
Trả lại: <lý do> → trả-lại
```

So theo từng vế của câu (tách bằng `;`), bỏ khoảng trắng đầu cuối, không phân biệt hoa thường; vế ký được mang tiền tố
`ký hay trả:` (người điền ô của dòng thẻ) và đuôi `, phút <số>`. Câu «có lời gộp» khi và chỉ khi: có ít nhất một vế lối
«gộp», KHÔNG có vế «chưa-gộp» nào (chưa-gộp thắng), có một vế «chữ-ký» và không có vế «trả-lại». Dạng ngoài danh sách
không phải lời gộp: máy không đoán, vì hiểu sai thì đắt và khó đảo.

### 4. Lệnh ký (`plugins/acceptance-gate/commands/signoff.md`)

- Dạy nhãn «gộp», trỏ khối `GATE-ONESHOT-GOP`.
- Kho bật: MỌI câu có chữ ký — mang lời gộp, «gộp: chưa», hay vắng hẳn nhãn — ghi ở bước ghi trường người (7a) đúng MỘT
  dòng sổ theo khuôn `LOI-GOP-GATE2-LINE`, mang nguyên văn TRỌN câu người gõ (mọi vế, kể cả vế ký), cùng commit với chữ
  ký. Như vậy dòng cuối của sổ luôn là lời của lần ký gần nhất, và lần ký sau «chưa gộp» thay được lần ký trước. Kho không
  bật, hay câu «Trả lại»: không ghi dòng ấy; hành vi như hôm nay.
- Bước kế (9): dòng vừa ghi mang lời gộp và vòng chạy ngoài đợt → máy đẩy commit chữ ký rồi chạy khối `GOP-THEO-LOI-KY`;
  chính lệnh trong khối chờ CI.

Khuôn dòng sổ (dòng giữa của `DEC-ID-RECIPE`):

```
"type":"revisit","stage":"gate2","at":"<ISO>","decision":"lời gộp trong câu ký: <gộp khi CI xanh | chưa gộp>","why":"Người gõ ở Cổng Bằng chứng; máy chép nguyên văn câu.","cost_if_wrong":"Chép lệch câu thì máy không gộp, hoặc gộp ngoài ý người ký; đảo bằng một commit hoàn lại trên nhánh chính.","decided_by":"<tên>","loi_gop":{"cau":"<trọn câu người gõ sau tên lệnh và tên hồ sơ, nguyên văn, một dòng>"}
```

### 5. Bên đọc và lối vào của lệnh gộp (`plugins/dispatch/scripts/gop.mjs`)

Một lối vào mới của CHÍNH lệnh gộp đã có: `dieu-phoi.mjs gop <số PR> --theo-loi --slug <slug>`. Không đòi đợt, khoá merge
hay `tu_merge`; quyền đến từ lời người đã ghi. Lệnh vẫn gọi `xetGop` (bốn điều kiện) và vẫn là chỗ DUY NHẤT gọi
`gh pr merge <n> --merge --match-head-commit <sha>`.

Trước khi gộp, lệnh đọc TRÊN ĐẦU NHÁNH của PR (`git show <sha>:…`, không đọc cây làm việc) và đòi đủ sáu vế:

1. `_acceptance/config.yaml` khai `feature_loop.gop_theo_loi_ky: true`;
2. hợp đồng của hồ sơ ở `signed-off` — `machine-cleared` bị từ chối: không có câu người gõ;
3. `human_signoff` của báo cáo bằng chứng có chữ;
4. sổ quyết định có dòng `stage: gate2` mang khoá `loi_gop`; lấy dòng CUỐI và chỉ dòng ấy (sổ chỉ thêm: dòng sau thay
   dòng trước; dòng cuối không đạt thì KHÔNG lùi về dòng cũ hơn);
5. CHÍNH câu ghi trong `loi_gop.cau` của dòng ấy đọc lại bằng danh sách đóng ở mục 3 ra «có lời gộp». Bên đọc không tin
   cách hiểu của phiên đã ghi dòng: nó đọc lại câu người gõ;
6. dòng ấy SINH CÙNG COMMIT với chữ ký hiện hành: commit đưa mã dòng vào sổ và commit đưa giá trị `human_signoff` hiện
   hành vào báo cáo (cả hai tìm bằng `git log -S` trên đầu nhánh) phải là một. Hồ sơ được chấm lại rồi ký lại mà lần ký
   mới không ghi dòng nào thì dòng lời gộp của lần ký cũ không còn hiệu lực.

Thiếu vế nào thì lệnh trả `chan` gọi tên vế ấy và không gọi gộp. Lệnh `gop` không cờ giữ nguyên hành vi trong đợt.
Ngoài đợt không có cấu hình đợt nên lối nhanh «không trùng tệp» không áp: nhánh chính đã tiến thì lệnh đi lối cũ.

Chờ CI là việc của LỆNH, không phải lời dặn: cờ `--cho-ci <phút>` cho lệnh tự hỏi lại trạng thái check theo nhịp tới khi
mọi check xanh (gộp), một check đỏ hẳn (thoát 1 «CI đỏ», không hỏi lại), hay hết giờ (thoát 4). Phiên chạy lệnh ở chế độ
nền.

Danh sách đóng có ba bản — khối luật, hằng của thẻ, hằng của bên đọc — vì gói điều phối tự đứng được, không nạp tệp của gói
nghiệm thu. Hai phép đo giữ ba bản khớp: (i) vòng khép trên câu THẬT — lấy trọn dòng lệnh thẻ kho bật in ra, thay `___`
bằng từng dạng vế ký rút từ khối luật, điền khuôn dòng sổ rút từ lệnh ký, đưa bên đọc; (ii) ma trận rút từ khối luật — mỗi
dòng của khối đi qua bên đọc và phải ra đúng lối khối ghi.

### 6. Vòng tính năng (`plugins/feature-loop/skills/feature-loop/SKILL.md`)

Mục S5 thêm khối `GOP-THEO-LOI-KY` (dòng lệnh) và `GOP-THEO-LOI-THOAT` (bảng mã thoát), chép từ lệnh ký:

```
0 → đã gộp: báo một dòng (số PR, commit gộp); vòng đóng
4 → chưa gộp được lúc này (hết giờ chờ CI, hoặc nhánh chính đã tiến): gộp nhánh chính vào nhánh theo lệ của kho nếu lệnh bảo thế, rồi chạy lại MỘT lần; vẫn 4 → báo một dòng và dừng, việc gộp về tay người
1 → không gộp (thiếu một vế, CI đỏ, PR không mở): in nguyên dòng lý do; việc gộp về tay người như trước vòng
```

Vòng chạy trong đợt: luật của đợt thắng như cũ. Gói điều phối chưa cài: một dòng báo, việc gộp về tay người.

### 7. Kho kit tự bật (câu hỏi cho chủ kho ở Cổng Phạm vi)

Khuyến nghị: bật khoá trong `_acceptance/config.yaml` của chính kho kit ở vòng này, để PR của vòng gộp bằng đường mới —
lần dùng thật đầu tiên. Lối khác: không bật; PR của vòng gộp theo lời chủ kho bằng tay phiên.

### 8. Sổ, ADR, từ điển

- ADR 0029 một đoạn văn: máy gộp vào nhánh chính theo lời đã ghi — khó đảo, gây bất ngờ, có đánh đổi.
- `CONTEXT.md`: mục «Lời gộp».

## Phép đo

- `tests/scripts/lgck-the.test.mjs` — thẻ: bật · tắt giống từng byte · không mời gộp sai chỗ · luật · vòng-khép P192 ·
  nhát tiêm. Hồ sơ thử do kịch bản mã sinh. Phép so «tắt giống từng byte» lấy bản TRƯỚC ở cha của commit đầu tiên của vòng
  chạm `plugins/acceptance-gate/` (mọi tệp, không riêng bộ dựng thẻ) và bản SAU ở commit cuối cùng như thế — cố định trong
  lịch sử để lượt ghim lại về sau không đỏ oan; khi hồ sơ của vòng chưa ký, ca còn đòi bản SAU bằng đúng cây đang kiểm.
- `tests/dieu-phoi/loi/gop-theo-loi.test.mjs` — bên đọc và lối vào: kho git thật dựng trong lượt, chỉ `gh` là giả.
- `tests/dieu-phoi/loi-gop-mutants.test.mjs` — nhát tiêm trên bản sao trọn thư mục; đối chứng dương trước mỗi nhát.
- Ca cũ của `ky-den-gop` chạy lại nguyên: đường trong đợt không đổi.

Mỗi phép đo mới có cặp hai chiều trên cùng hồ sơ thử: vật lành thì xanh, phá vật thì đỏ với thông điệp ghim; chạm thứ không
phải vật (dòng sổ thường, chú thích, tài liệu) thì im.

## Cân trên mọi kho

| Kho | Không bật | Bật |
|---|---|---|
| Inventory (nhánh chính `main`) | không đổi | ô gộp trên thẻ; máy gộp khi mọi check của PR xanh |
| Kho tiêu thụ riêng tư | không đổi | như trên |
| crm (nhánh chính `onehub`) | không đổi | lệnh gộp lấy nhánh chính từ chính PR; check không bắt buộc mà đỏ thì máy không gộp, báo một dòng — người gộp như hôm nay |

Hồ sơ cũ không có dòng lời gộp đọc như cũ: không dòng thì không gộp.

## Giới hạn khai trước

- Lệnh gộp đòi MỌI check của PR xanh, kể cả check không bắt buộc. Kho có check hay đỏ ngoài diện bắt buộc sẽ không được
  máy gộp; đây là chiều an toàn.
- Phiên kết thúc trước khi CI xanh thì không ai gộp cho tới khi vòng được mở lại (`/feature-loop:feature-loop <slug>` vào
  S5 và chạy khối gộp). Dòng lời gộp vẫn nằm trong sổ.
- Lời gộp do lệnh ký ghi hộ, cùng mô hình tin với chữ ký: xuất xứ thật là tác giả commit.
- Vòng trong đợt: lời gộp được ghi nhưng luật đợt quyết việc gộp.

## Để lại cho người dựng

Chỗ chính xác đọc «đã có chữ ký người» trong bộ dựng thẻ (dùng vị từ sẵn có của bộ đọc hồ sơ, không viết bản thứ hai);
tên ca; cách dựng `gh` giả cho ca chạy dòng lệnh rút từ khối.
