# Đặc tả UX đọc sổ màn — bản thiết kế

Hồ sơ: `_acceptance/dac-ta-ux-doc-so-man/` · hạng T2 · ngày 22/11/2026.

Gốc: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/` — hồ sơ ấy cắt phần kiểm bảng trạng thái sau năm lượt chấm hỏng và ghi
điều kiện mở lại ở `docs/plans/2026-08-24-hat-giong-khop-vong-dac-ta-ux.md`. Vật máy đọc được mà điều kiện ấy chờ nay
đã có ở phía sổ: gói thiết kế của kho tiêu thụ có một lệnh đọc màn. Chủ kho duyệt việc này ngày 22/11/2026 (đề bài «hai
kho bên cạnh gọi và đọc», mảng 3, tiêu chí 9 và 10) và cho phép sửa kit cho đúng lát này.

## 1. Việc

Hôm nay, với một việc chạm mặt người nhìn, máy khai lại màn và trạng thái bằng tay trong mục «Đặc tả UX» của bản thiết
kế, và không máy nào đọc hai bảng ấy. Ở kho đã có sổ màn, cùng một điều được viết hai lần và hai bản trôi khỏi nhau mà
không ai thấy.

Vòng này giao hai thứ, chỉ có hiệu lực ở kho **có lệnh đọc màn**:

1. **Điền.** Một lệnh in sẵn các hàng của «Kiểm kê màn» và «Bảng trạng thái» từ câu trả lời của lệnh đọc: tên màn, mã
   màn, mã trạng thái theo khuôn của kit `ST-<màn>-<trạng-thái>`. Cột chỉ việc này mới biết (một việc của màn, vào từ
   đâu, ra tới đâu, hiển thị gì, người làm gì tiếp) giữ ô khuôn cho người viết.
2. **Kiểm.** Một lệnh so bảng trạng thái của một hồ sơ với sổ: bảng nêu màn hay trạng thái sổ không có, hoặc thiếu
   trạng thái sổ bắt màn ấy phải có, thì đỏ; câu đỏ nêu đích danh màn và trạng thái.

Kho không có lệnh đọc: hai lệnh im và thoát 0, thẻ Cổng Phạm vi không đổi một byte, người khai tay như hôm nay.

Nửa còn lại của hạt giống 24/08 — «trạng thái khai trước ↔ bài kiểm đo nó» — KHÔNG thuộc vòng này và vẫn là hạt giống.

## 2. Lệnh đọc màn (phía bên kia, kit chỉ gọi)

Tệp `tools/design-assembly/screen-facts.mjs` trong kho tiêu thụ. Kit gọi:

```
node tools/design-assembly/screen-facts.mjs --json --target <gốc kho> [--screens <mã|đường dẫn>,…]
```

Thoát 0 khi mọi màn được hỏi đều có; thoát 1 khi có màn sổ không có (câu trả lời vẫn in, `unknown` nêu tên); thoát 2
khi gọi sai hay kho không đọc được (stdout trống). Kit đọc năm khoá: `screens[].id`, `screens[].route`,
`screens[].title`, `screens[].states`, `screens[].must_have` (mảng, hoặc `null` khi kho không có bảng trạng thái bắt
buộc), cùng `unknown` và `keys_not_found`. Kit không mở `design/screens*` hay `design/states.json`.

Hạn chờ lệnh đọc: **10 giây** (biến môi trường `SO_MAN_HAN_MS` đổi được, để tệp ca thử ca quá hạn trong một giây).
Quá hạn là «không đọc được», thoát 2.

Bài kiểm của kit không chạy lệnh thật: một **lệnh đọc giả** do tệp ca dựng trong kho bỏ đi in một mẫu câu trả lời
(`tests/scripts/fixtures/so-man/*.json`) và ghi lại đối số nó nhận. Lệnh đọc giả lọc theo `--screens` như hợp đồng của
lệnh đọc nói (khớp mã hoặc đường dẫn; tên không khớp vào `unknown`, thoát 1), để kết cục của kit phụ thuộc đúng tên kit
gửi đi chứ không vào một câu trả lời cố định.

**Nguồn của mẫu.** `tests/scripts/fixtures/so-man/nguon.json` khai cho từng tệp mẫu một trong hai loại:

- `ban-chep` — chép nguyên stdout của lệnh đọc THẬT: kho đã chạy (kho gói thiết kế, hoặc một kho bỏ đi dựng trong thư
  mục tạm cho đúng hình dạng — sổ dạng thư mục, không có bảng trạng thái, màn được miễn, khoá viết theo kiểu riêng),
  phiên bản gói, lệnh, ngày. Các hình dạng `must_have: null`, miễn trừ, `keys_not_found`, thoát 1 đều lấy bằng cách này,
  không viết tay.
- `bien-the` — suy từ một bản chép, khai tệp gốc và danh sách khoá đổi. Chỉ dùng cho hình dạng lệnh đọc thật không sinh
  ra được (thoát 2 giả, JSON hỏng, thiếu khoá, tên có dấu, mã chứa `|`).

Ca F1 của tệp ca kiểm rằng mỗi biến thể chỉ khác bản chép gốc ở đúng các khoá đã khai.

## 3. Vật

| Tệp | Việc |
|---|---|
| `plugins/acceptance-gate/scripts/so-man.cjs` (mới) | Lệnh `--dien` và `--kiem`; hàm `theCong1` cho thẻ |
| `plugins/acceptance-gate/scripts/gate-card.js` | Khối «Bảng trạng thái ↔ sổ màn» trên thẻ Cổng Phạm vi |
| `plugins/acceptance-gate/skills/acceptance/references/ux-spec-template.md` | Phần lời đầu khuôn (khối `UX-SPEC-TEMPLATE` giữ nguyên từng byte) |
| `plugins/feature-loop/skills/feature-loop/SKILL.md` | Bước thiết kế số 4: khối lệnh `UX-SO-MAN-S1` |
| `tests/scripts/so-man.test.mjs`, `tests/scripts/fixtures/so-man/` (mới) | Mỗi ô ma trận một ca |
| `_acceptance/dac-ta-ux-doc-so-man/rang/` (mới) | Bộ đột biến và lệnh chạy eval của hồ sơ |
| `GUIDE.md`, hạt giống 24/08 | Một đoạn mô tả; ghi phần đã giao và phần còn lại |

Không chạm `plugins/acceptance-gate/lib/**`, hook hay `pre-merge-check.sh`.

### 3.1 Lệnh

```
node <acceptance-gate>/scripts/so-man.cjs --root <kho> --dien [--man <mã,mã>]
node <acceptance-gate>/scripts/so-man.cjs --root <kho> --kiem --slug <hồ sơ>
node <acceptance-gate>/scripts/so-man.cjs --root <kho> --kiem --tep <bản thiết kế>
```

Mã thoát của cả hai: **0** không có gì đỏ (gồm ca kho không có lệnh đọc) · **1** có câu đỏ · **2** không kiểm được ở
đây (gọi sai, lệnh đọc thoát 2, câu trả lời không đọc được). Thoát 2 là giới hạn có tên, không phải đỏ.

`--dien` in ra stdout một khối dán được vào bản thiết kế:

```
| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| overdueTitle (overdue) | {{một câu, một việc}} | {{từ đâu / tới đâu}} |

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-overdue-loading | overdue | {{hiển thị gì}} | {{người làm gì tiếp}} |
<!-- UX-STATE-TABLE>>> -->
```

Hàng tiêu đề và hai dòng marker rút từ tệp khuôn lúc chạy, không chép vào mã. Trạng thái sổ bắt phải có đứng trước;
dòng ghi chú (màn nào bắt buộc trạng thái nào, màn nào sổ không có) ra stderr để khối dán được không lẫn chữ lạ.

### 3.2 Bộ đọc bảng trạng thái — ranh giới đóng

Không viết bộ đọc mới cho phần kit đã có. Ba hàm sẵn có làm ba việc:

- `lib/context-glossary.js#stripNonProse` — xoá trắng khối mã (```` ``` ````, `~~~`) và đoạn mã trong dòng, giữ nguyên số
  dòng. Một bảng minh hoạ trong khối mã vì thế không còn là bảng.
- `lib/md-section.cjs#sectionLines` — các dòng của mục `## Đặc tả UX`, kèm số dòng, cắt theo bảng luật ranh giới khai
  một chỗ trong chính tệp ấy.
- `lib/evidence-core.cjs#frontmatterField` — đọc `design_doc` và `surfaces` ở phần đầu hợp đồng;
  `lib/lop-nhin-thay.cjs#laMatNguoiNhin` trả lời «hồ sơ có mặt người nhìn không».

Trên các dòng ấy, luật đọc là một danh sách đóng — không dò chữ:

1. Marker chỉ tính khi **nguyên dòng** bằng đúng chuỗi marker rút từ tệp khuôn, thụt đầu dòng tối đa ba dấu cách.
2. Trong mục phải có **đúng một** marker mở và **đúng một** marker đóng, mở trước đóng. Không cặp nào → «không có bảng».
   Thừa, thiếu vế, sai thứ tự → đỏ có tên.
3. Mỗi dòng không trắng giữa hai marker phải thuộc đúng một loại: hàng tiêu đề (dòng đầu, mang cột «Trạng thái» và
   «Màn», tìm theo TÊN cột) · hàng phân cách (dòng hai) · hàng dữ liệu (đủ số ô của tiêu đề). Dòng không thuộc loại nào
   → đỏ nêu số dòng. Không có dòng nào bị bỏ qua lặng lẽ.
4. Bảng không có hàng dữ liệu → đỏ («rỗng»). Ô «Trạng thái» hay «Màn» còn ô khuôn `{{…}}` hoặc trống → đỏ.

### 3.3 So với sổ

Màn của một hàng là ô «Màn»: mã màn của sổ (hoặc đường dẫn của màn — lệnh đọc nhận cả hai). Mã màn và mã trạng thái
đều có thể mang gạch nối, nên `ST-a-b-c` không tự tách được; chỉ ô «Màn» nói được màn nào. Trạng thái của hàng là phần
còn lại của mã sau tiền tố `ST-<mã màn>-`. Chữ được chuẩn hoá NFC trước khi so.

Kit gọi lệnh đọc **một lần** với các giá trị khác nhau của ô «Màn», rồi:

| Tình huống | Kết cục |
|---|---|
| Màn nằm trong `unknown` | đỏ |
| Mã trạng thái không mở đầu `ST-<mã màn>-` | đỏ |
| Trạng thái không nằm trong `states` lẫn `must_have` của màn | đỏ |
| Một mã trạng thái khai hai lần | đỏ |
| Màn có mặt trong bảng mà thiếu một trạng thái của `must_have` | đỏ |
| `must_have` là `null` | không kiểm được vế thiếu — một dòng giới hạn, không đỏ |
| `keys_not_found` có phần tử | một dòng nêu khoá — kết cục không đổi |
| Ô người viết còn ô khuôn | một dòng đếm — không đỏ |

### 3.4 Câu (ghim nguyên câu)

Mỗi câu một hàm trong `so-man.cjs`, dùng chung cho lệnh và thẻ. `«…»` là chỗ điền.

- `màn «M» không có trong sổ màn (dòng N, mã «ST-…»)`
- `màn «M» không có trạng thái «T» trong sổ màn (dòng N, mã «ST-…»)`
- `màn «M» thiếu trạng thái «T» mà sổ màn bắt phải có — thêm hàng «ST-M-T»`
- `mã trạng thái «X» không mang mã màn «M» của cùng hàng — khuôn là ST-<mã màn>-<trạng thái> (dòng N)`
- `mã trạng thái «X» khai hai lần (dòng N và dòng K)`
- `bảng trạng thái rỗng — không có hàng dữ liệu nào giữa hai marker UX-STATE-TABLE`
- `bảng trạng thái thiếu cột «C» ở hàng tiêu đề (dòng N)`
- `dòng N giữa hai marker UX-STATE-TABLE không phải một hàng của bảng`
- `dòng N có K ô, hàng tiêu đề có H ô`
- `dòng N: ô «C» trống hoặc còn ô khuôn chưa điền`
- `mục Đặc tả UX có K marker mở và H marker đóng UX-STATE-TABLE — phải đúng một cặp, mở trước đóng`
- `hồ sơ có mặt người nhìn mà bản thiết kế không có bảng trạng thái — kho này có sổ màn để so`
- `không đọc được sổ màn ở đây: «…»` (thoát 2)
- `kho không có bảng trạng thái bắt buộc — vế «thiếu trạng thái sổ bắt phải có» không kiểm được ở đây` (giới hạn)
- `sổ màn viết khoá «K» theo cách lệnh đọc không thấy (tìm «L») — mã màn và trạng thái vẫn đọc được` (giới hạn)
- `bảng trạng thái khớp sổ màn: N hàng, M màn` (xanh)

### 3.5 Nối vào vòng

- **Bước thiết kế số 4 của feature-loop.** Sau câu «điền mục Đặc tả UX», thêm: kho có lệnh đọc màn thì chạy `--dien` cho
  các màn việc này chạm, dán khối vào bản thiết kế, viết các cột còn lại, rồi chạy `--kiem` và sửa tới khi hết đỏ. Hai
  lệnh nằm trong khối marker `UX-SO-MAN-S1`. Kho không có lệnh đọc → hai lệnh không in gì, điền tay như cũ.
  Khối mang đúng một câu lối ra cho màn mới: «Màn mới của chính việc này chưa có trong sổ: giữ các hàng của nó, không
  xoá và không đổi sang màn khác — câu đỏ lên thẻ cho người duyệt thấy.» Không câu nào khác của lệnh kiểm được phép
  để lại.
- **Thẻ Cổng Phạm vi.** Khối «Bảng trạng thái ↔ sổ màn (thông tin, không cần trả lời)» in đúng các câu của `--kiem`
  (tối đa năm câu đỏ, còn lại đếm). Khối không đổi làn của vòng và không vào bản trích `--extract`. Kho không có lệnh
  đọc, hoặc hồ sơ không có mặt người nhìn và không có bảng → không có khối.
- **Không** vào `pre-merge-check.sh`, không thành eval mặc định của lượt chấm.

Kit không ghi ở đâu rằng một kho «không có lệnh đọc»: việc tệp vắng mặt là sự thật duy nhất, đọc lại mỗi lần chạy.

## 4. Ma trận hình dạng — viết TRƯỚC mã

Mỗi ô một ca cùng tên trong `tests/scripts/so-man.test.mjs`. Hằng ma trận trong tệp ca được viết trước `so-man.cjs` và
không tính từ mã của vật. Chạy không lọc, tệp ca in `số ca chạy: N` đếm từ các ca thực chạy và đỏ khi N khác số ô của
hằng (64); mỗi ca in đúng một dòng `PASS: <ô>` hay `FAIL: <ô> — <lý do>`. Ô gốc lành: K1 × H1 × S1 × B1.

**K — bảng nằm đâu trong bản thiết kế**

| Ô | Hình dạng | Kết cục |
|---|---|---|
| K1 | một cặp marker nguyên dòng trong mục `## Đặc tả UX` | đọc được |
| K2 | không có mục `## Đặc tả UX` | không có bảng |
| K3 | có mục, không có marker | không có bảng |
| K4 | marker mở, không marker đóng | đỏ |
| K5 | hai cặp marker | đỏ |
| K6 | marker đóng đứng trước marker mở | đỏ |
| K7 | cả khối nằm trong khối mã | không có bảng |
| K8 | marker nằm giữa câu văn hoặc trong đoạn mã trong dòng | không có bảng |
| K9 | marker thụt bốn dấu cách (thụt ba thì tính) | không có bảng / đọc được |
| K10 | khối thật kèm một khối minh hoạ SAI trong khối mã | đọc khối thật, xanh |
| K11 | cặp marker nằm ở mục khác, ngoài `## Đặc tả UX` | không có bảng |

**H — các hàng giữa hai marker**

| Ô | Hình dạng | Kết cục |
|---|---|---|
| H1 | tiêu đề, phân cách, hàng dữ liệu đủ ô | đọc được |
| H2 | chỉ tiêu đề và phân cách | đỏ «rỗng» |
| H3 | giữa hai marker không có dòng nào | đỏ «rỗng» |
| H4 | hàng tiêu đề thiếu cột «Màn» | đỏ nêu cột |
| H5 | một hàng thừa hoặc thiếu ô | đỏ nêu dòng |
| H6 | ô «Trạng thái» còn `{{…}}`; ô «Hiển thị gì» còn `{{…}}` | đỏ; chỉ một dòng đếm |
| H7 | một câu văn lọt giữa các hàng | đỏ nêu dòng |
| H8 | mã không mở đầu `ST-` | đỏ |
| H9 | mã bọc trong dấu mã | đỏ «ô trống» |
| H10 | một mã khai hai lần | đỏ |
| H11 | thêm cột thứ năm và đổi thứ tự cột | đọc theo tên cột, xanh |
| H12 | xuống dòng kiểu CRLF | như H1 |
| H13 | mã màn có dấu, bảng viết dạng tách dấu (NFD), sổ dạng gộp (NFC) | khớp; câu đỏ nêu đúng tên có dấu |

**S — so với sổ**

| Ô | Hình dạng | Kết cục |
|---|---|---|
| S1 | mọi hàng khớp, đủ trạng thái bắt buộc | xanh |
| S2 | một màn sổ không có | đỏ nêu màn |
| S3 | một trạng thái sổ không có | đỏ nêu màn và trạng thái |
| S4 | thiếu một trạng thái sổ bắt phải có | đỏ nêu màn và trạng thái |
| S5 | mã trạng thái mang mã của màn khác | đỏ |
| S6 | ô «Màn» là đường dẫn của màn | nhận, mã vẫn theo mã màn |
| S7 | màn được miễn (`must_have: []`) | không đòi trạng thái nào |
| S8 | hai màn mã lồng tiền tố (`don`, `don-hang`) | mỗi hàng về đúng màn |
| S9 | trạng thái bắt buộc mà `states` của màn không liệt | hàng khai nó hợp lệ |
| S10 | màn mới của chính việc, sổ chưa có | câu S2 lên thẻ; mục hỏi người và dòng lệnh duyệt bằng thẻ khi không có khối |

**B — câu trả lời của lệnh đọc**

| Ô | Hình dạng | Kết cục |
|---|---|---|
| B1 | thoát 0, đủ khoá | so được |
| B2 | `must_have: null` | không đỏ vế thiếu, một dòng giới hạn |
| B3 | `keys_not_found` có phần tử | một dòng nêu khoá, kết cục không đổi |
| B4 | thoát 1, `unknown` có tên | đỏ nêu màn (thoát 1) |
| B5 | thoát 2 | «không đọc được», thoát 2 |
| B6 | kho không có lệnh đọc | im, thoát 0 |
| B7 | stdout không phải JSON | thoát 2 |
| B8 | JSON thiếu `screens`, hoặc `states` không phải mảng | thoát 2 nêu khoá |
| B9 | lệnh đọc không trả lời trong hạn | thoát 2 |
| B10 | thoát 1 mà `unknown` rỗng; thoát mã lạ | thoát 2 |
| B11 | thoát 0 mà `unknown` có tên | vẫn đỏ nêu màn |

**L — lối vào**

| Ô | Hình dạng | Kết cục |
|---|---|---|
| L1 | `--kiem --tep` | như ma trận trên |
| L2 | `--kiem --slug`, hợp đồng có `design_doc` | đọc đúng tệp ấy |
| L3 | `--slug`, không có bảng: hồ sơ có mặt người nhìn / không có | đỏ / im |
| L4 | `design_doc` trỏ tệp không có | thoát 2 nêu đường |
| L5 | gọi sai: thiếu `--root`, cờ lạ, cả `--dien` lẫn `--kiem` | thoát 2 kèm dòng cách dùng |
| L6 | thẻ Cổng Phạm vi, kho có lệnh đọc | khối mang đúng câu của `--kiem` |
| L7 | thẻ Cổng Phạm vi, kho không có lệnh đọc | thẻ như cây ở gốc nhánh, từng byte |
| L8 | thẻ, kho có lệnh đọc, hồ sơ `surfaces: [cli]` không có bảng | thẻ như cây ở gốc nhánh, từng byte |
| L9 | thẻ, lệnh đọc thoát 2 | thẻ dựng được, `gate-card.js` thoát 0, khối mang câu «không đọc được sổ màn ở đây: …» |
| L10 | thẻ, lệnh đọc quá hạn | như L9, xong trong hạn đã ghim cộng một giây |

**D — điền**

| Ô | Hình dạng | Kết cục |
|---|---|---|
| D1 | `--man` hai màn | hai hàng kiểm kê, mỗi trạng thái một hàng mã |
| D2 | không `--man` | mọi màn của sổ |
| D3 | một màn sổ không có | hàng cho màn có, một dòng nêu màn lạ, thoát 1 |
| D4 | kho không có lệnh đọc | im, thoát 0 |
| D5 | lệnh đọc thoát 2 | stdout trống, thoát 2 |
| D6 | khối `--dien` in ra đưa thẳng cho `--kiem` | xanh (một vòng viết → đọc) |
| D7 | `must_have: null` | hàng từ `states`, một dòng giới hạn |
| D8 | màn không có trạng thái nào | hàng kiểm kê, không hàng trạng thái, một dòng nêu |
| D9 | mã màn hay trạng thái chứa `|` hoặc xuống dòng | từ chối màn ấy có tên, thoát 2 |

Số ô: 11 + 13 + 10 + 11 + 10 + 9 = 64. Ngoài ma trận: ca F1 (nguồn mẫu) và ba ca W1–W3 (nối vào SKILL và khuôn).

## 5. Chiều đỏ

- Tệp ca viết trước vật: ở commit ca, tệp ca đỏ vì `so-man.cjs` chưa có.
- Mỗi ca âm tính chạy sau đối chứng dương trên cùng kho bỏ đi và ghim nguyên câu.
- `_acceptance/dac-ta-ux-doc-so-man/rang/dot-bien.mjs`: mỗi nhát tiêm vào bản sao trọn `scripts/` + `lib/` làm đỏ đúng
  ca đã ghim, sau khi bản nguyên vẹn xanh. Các nhát: bỏ bước xoá khối mã · nhận marker không nguyên dòng · bỏ luật
  «rỗng» · bỏ vế thiếu · bỏ vế trạng thái lạ · bỏ so `unknown` · coi thoát 2 như không có lệnh đọc · bỏ chuẩn hoá NFC ·
  tách mã theo gạch nối thay vì theo ô «Màn» · đổi một chữ trong từng câu ghim.
- Chiều im: chạm một thứ không phải vật (một tệp trong `docs/`, hồ sơ của chính vòng) thì mọi ca vẫn xanh.

## 6. Kho tiêu thụ khi lên bản

- Kho không có lệnh đọc: không đổi gì — lệnh im, thẻ như cũ từng byte.
- Kho có lệnh đọc: thẻ Cổng Phạm vi của hồ sơ `draft` có thêm một khối thông tin. Hồ sơ đang dở mà bảng trạng thái viết
  tay theo tên riêng (ô «Màn» không phải mã màn của sổ) sẽ thấy câu đỏ trong khối ấy. Khối không chặn cổng, không chặn
  merge; sửa bằng cách chạy `--dien` rồi chép lại các cột người viết.
- Hồ sơ đã ký không bị đọc lại.

## 7. Giới hạn đã khai

- Lệnh kiểm so bảng với sổ **lúc chạy**. Một màn mới của chính việc này chưa vào sổ thì đỏ ở Cổng Phạm vi cho tới khi
  gói thiết kế ghi màn ấy vào sổ — đó là trạng thái thật, không phải lỗi của lệnh; khối `UX-SO-MAN-S1` dặn giữ hàng.
  Ngưỡng mở lại: ≥1 vòng chạm màn ở kho có lệnh đọc mà Cổng Phạm vi mang câu «không có trong sổ màn» cho một màn mới.
- Biến thể mẫu là chữ viết tay theo khuôn bên đọc của kit. Ngưỡng mở lại: ≥1 lần lệnh chạy trên kho thật cho kết cục
  khác kết cục của ca cùng hình dạng.
- `title` là thứ sổ ghi; ở kho ghi khoá chữ thay cho tên thì hàng kiểm kê hiện khoá ấy.
- Ô có dấu `|` thoát bằng `\|` không được đọc: hàng ấy đỏ vì sai số ô.
- Lệnh đọc so tên từng ký tự; kit gửi tên dạng NFC. Sổ ghi tên dạng tách dấu sẽ trả `unknown`.
- Bài kiểm của kit dùng lệnh đọc giả; lượt thử với gói thiết kế thật trên một kho thật không thuộc vòng này.
