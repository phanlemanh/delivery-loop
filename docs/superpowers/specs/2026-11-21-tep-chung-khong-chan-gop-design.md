# Tệp chung thôi chặn gộp — thiết kế vòng DL1 + P179

**Ngày:** 2026-11-21 · **Hồ sơ:** `_acceptance/tep-chung-khong-chan-gop/` · **Hạng:** T3 (chạm `plugins/acceptance-gate/lib/`)
· Chủ kho gọi tên vòng 21/11 («Mở phiên DL1»), nới luật chiều rộng (b) cho đúng «DL1 + P179».

## 1. Vấn đề, bằng số

Đích của kit là GỘP ĐƯỢC. Ba tệp mà mọi PR cùng chạm làm PR xung đột mỗi lần nhánh chính dời, và mỗi lần xung đột ở
forge là một lượt gộp nhánh chính vào nhánh, vẽ lại, đẩy, chạy lại CI — thường kéo theo ghim lại bằng chứng.

- **Hai view máy sinh** (`PRODUCT-MAP.md`, `LO-TRINH.html`): phát lại chỉ-đọc 21/11 trên `onehub-inventory` tại
  `8e0a91c9`, 168 lần gộp nhánh chính vào nhánh PR từ 10/11 — 134 lần có xung đột (như hôm ấy), 126 dính `LO-TRINH.html`.
  Bộ gộp riêng tại máy (vòng `tep-sinh-khong-chan-gop`, 2.36.0) gỡ được ở máy, nhưng forge không chạy bộ gộp của máy nên
  trên web PR vẫn báo xung đột; và PR vẫn chạm hai tệp nên lối «gộp không chạy lại CI khi không trùng tệp» của gói điều
  phối không dùng được.
- **Tệp cấu hình chung** `_acceptance/config.yaml`: sau khi thêm dòng gộp cho `LO-TRINH.html`, phần còn lại lớn nhất là
  30 trên 63 lần (17 lần là tệp duy nhất). Gốc: mỗi hồ sơ thêm khoá `executors.script.<răng>` vào cùng một khối (ở kho
  kit khối này đã ~970 dòng — hạt giống 21/08 gọi nó là «nghĩa địa răng»).
- **P179** (sổ giới hạn thiếu hàng): ca kiểm đếm mọi dòng `Đề xuất: known-limits` của mọi hồ sơ, kể cả hồ sơ đang chấm,
  và đòi sổ có đủ hàng. Hàng sổ do thợ chép tay. Ngưỡng hạt giống đủ từ 26/10; tra sổ hồ sơ trước thấy ít nhất bốn vòng
  thêm hàng giữa lượt chấm (`doi-chung-chay-duoc`, `khung-dot-dinh-vi`, `ho-so-da-ky-giu-tuoi`, `chi-tep-vat-keo-xet-lai`)
  và mốc 3.0 đốt thêm một lượt (REJECT `d4af0277`). Hôm nay sổ 1355 hàng = corpus 1355 mục: mục known-limits mới đầu tiên
  làm P179 đỏ.

## 2. Phương án

### 2.1 Hai view máy sinh rời git — bật theo lựa chọn (`ban_do.ngoai_git: true`)

Kho khai `ban_do.ngoai_git: true` trong `_acceptance/config.yaml` thì hai view **không còn được theo dõi trong git**: ai
cần thì vẽ tại chỗ (bốn lệnh cổng vẫn vẽ lại như hôm nay, chỉ thôi đưa vào commit). PR thôi chạm hai tệp, nên không
còn xung đột văn bản ở máy lẫn ở forge, và lối gộp không-trùng-tệp của điều phối mở lại.

Vì sao không «vẽ lại trên nhánh chính sau khi gộp» theo đúng chữ của nguồn: nhánh chính của Inventory có ruleset đòi PR,
không ai được vượt — máy không commit thẳng được. Ba lối còn sống, so theo bốn trục (**Hỏi-1** ở Cổng Phạm vi):

| Lối | PR còn xung đột ở hai view? | Bên đọc ngoài kho qua git còn sống? | Thêm CI mỗi lần gộp | Kho phải sửa gì |
|---|---|---|---|---|
| a — rời git, chỉ vẽ tại chỗ | không | **không** (crm: trang Lộ trình mất nguồn, workflow bản chụp không bắn) | 0 | `.gitignore` · `git rm --cached` · khoá |
| b — máy mở PR vẽ lại sau mỗi lần gộp | PR thường: không; các PR vẽ lại xung đột nhau khi hai lần gộp sát nhau | có | một PR + một lượt CI đầy đủ (Inventory ~30 trong năm ngày) | một workflow mở PR; người hay điều phối gộp PR ấy |
| **c — rời git + nhánh view** (khuyên) | không | có, sau khi trỏ sang nhánh view | một job ngắn, không chạy bộ kiểm | như a, thêm `ban_do.nhanh_ve` và dán một khối job vào workflow; kho có bên đọc ngoài đổi trường nhánh của bên đọc |

Lối c: kho khai `ban_do.nhanh_ve: <nhánh>` thì `product-map.mjs --root . --day-nhanh-ve` (job sau gộp trên nhánh chính
gọi) vẽ hai view từ đầu nhánh chính và đẩy chúng thành một commit lên nhánh ấy — dựng bằng `git hash-object`/`mktree`/
`commit-tree`, không đổi nhánh chính hay cây làm việc, view không đổi thì không đẩy. Ruleset của Inventory chỉ khoá nhánh
mặc định, nên nhánh view đẩy được. Kho không có bên đọc ngoài thì bỏ job — thành lối a. Kho bật mà không khai nhánh view
thì `--check` in một dòng cờ vàng.

Bên đọc ngoài kho (đọc 21/11 trên nhánh chính ba kho tiêu thụ): chỉ `crm-onehub` có bên đọc bằng mã — tính năng Lộ trình
đọc `LO-TRINH.html` qua GitHub App theo trường kho · nhánh · đường tệp, và workflow bản chụp bắn khi tệp đổi trên nhánh
chính. Inventory và Quỹ hàng chỉ có tài liệu nhắc tên. Ghi chú phát hành của mốc phải cảnh báo điều này (hợp đồng, Notes).

Hành vi theo khoá:

| | khoá vắng / `false` | `true` |
|---|---|---|
| `product-map.mjs --root .` (ghi) | như hôm nay | như hôm nay (vẽ tại chỗ) |
| `product-map.mjs --check` | như hôm nay, từng byte | xanh khi: hai tệp KHÔNG được git theo dõi, được `.gitignore` bỏ qua, và bộ vẽ chạy được; đỏ khi một trong ba hỏng — thông điệp nêu đúng lệnh gỡ |
| khối lệnh vẽ lại của `approve`, `signoff`, `observed`, `uat-session` | vẽ rồi đưa hai tệp vào chỉ mục | vẽ, không đưa tệp bị bỏ qua vào chỉ mục (khối hỏi `git check-ignore`, không đọc khoá — một bên đọc khoá ít đi) |
| thẻ `/start` (bộ quét chỉ đọc) | `map.state` như hôm nay | tệp vắng → trạng thái mới `ve-tai-cho`, không phải «đã bị xoá»; dòng lộ trình in lệnh vẽ như khi trang chưa có |
| bảng điều phối (`nguon-hang.mjs`) | trang vắng → rỗng, im | trang vắng → rỗng kèm một dòng cờ vàng gọi tên lệnh vẽ |
| giá trị khác `true`/`false` | — | `--check` thoát 2 gọi tên khoá (fail-closed, không coi là tắt) |

Thay đổi ở đâu: một bộ đọc khoá và nhãn trạng thái mới sống MỘT chỗ ở `lib/workspace-record.cjs` (bảng nhãn chung của
bản đồ — vì thế vòng là T3); `product-map.mjs` (nhánh `--check` khi bật); `start-scan.mjs` (đọc trạng thái qua lib); bốn
khối lệnh vẽ lại (một dòng lệnh, bốn bản giữ trùng nhau từng ký tự); `GUIDE.md` thêm khối ba bước bật (`.gitignore` hai
dòng · `git rm --cached` hai tệp · khoá).

Chiều đỏ của `--check` khi bật nay đo đúng vật của chế độ này: trạng thái theo dõi của hai tệp và khả năng vẽ từ nguồn.
Chiều im: sửa hồ sơ mà không vẽ lại không làm đỏ (không còn bản commit nào để lệch).

Kho bật mất gì: không còn đọc hai view trên web GitHub; PR mở trước lần bật vẫn vấp một lần (sửa ↔ xoá) ở lần gộp đầu.
Kho không bật được gì, mất gì: không gì đổi — khoá vắng giữ mọi đầu ra từng byte (AC-1 đo điều đó).

### 2.2 Lệnh kiểm của hồ sơ về hồ sơ ấy

Kit đã có sẵn đường: eval khai `cmd` bằng **đường dẫn tệp từ gốc kho** (`_acceptance/<slug>/rang/<tệp>.sh …`). Bộ sinh
tham số chấm chuyển nguyên văn, lớp L2 nhận đường dẫn tới tệp có thật làm `verifier:`, hồ sơ `lan-v-khong-phai-cho-ky`
đã đi đường này. Thứ thiếu là LUẬT VIẾT: SKILL feature-loop (S1 bước 4), `eval-executors.md` và SKILL acceptance đều dặn
«cmd PHẢI là `config:` ref», nên máy của mọi vòng thêm khoá vào tệp chung. Vòng này:

1. Sửa luật viết ở ba nơi thành một câu (một khối marker, ba bản so được): lệnh **dùng chung của kho** (suite, build) →
   `config:`; lệnh **riêng của hồ sơ** → tệp trong `_acceptance/<slug>/`, không thêm khoá vào `_acceptance/config.yaml`.
   Đây là sửa đúng tầng — không đổi bộ đọc nào, khoá cũ vẫn chạy (đường đọc-cũ có sẵn), không kho nào phải dời khoá.
2. Một răng vàng thay lời dặn: `s4-args.mjs` in một dòng cảnh báo khi eval của hồ sơ dùng khoá `config:` mà khoá ấy
   thêm sau gốc vòng VÀ chỉ hồ sơ này dùng. Không chặn (thứ tự chọn nghiệm: bộ đọc khoan dung + cờ vàng trước khi đổi gì).
3. Chính hồ sơ này viết răng theo luật mới (lệnh ở `_acceptance/tep-chung-khong-chan-gop/rang/`), tức là đi trọn đường:
   s4-args → lượt chấm → L2 → ghim lại.

### 2.3 P179 — máy sinh hàng sổ (hạt giống 18/10, đề xuất 1)

- `tools/so-gioi-han.mjs --slug <slug> [--write]`: đếm mục `Đề xuất: known-limits` trong `review-findings.md` của hồ sơ,
  đếm hàng sổ có cột `slug` là hồ sơ ấy, thêm đúng số hàng còn thiếu ở cuối sổ (`<slug>#may-<n>`, mức nặng chép từ mục,
  lớp `chua-xep`, trạng thái `song`, ghi chú = tiêu đề mục + «[máy sinh từ review-findings.md]»), giữ mọi hàng cũ từng
  byte; chạy lại không đổi gì. Chỉ là bộ đếm khớp đúng nghĩa P179 (P179 so số lượng, không gắn hàng với mục).
- Gọi tự động: một móc `PostToolUse` của CHÍNH kho kit (`.claude/settings.json`) chạy bộ sinh khi tệp vừa ghi là
  `_acceptance/<slug>/review-findings.md` — đúng lúc phiên chính ghi kết quả lượt chấm, trước lượt kế. Móc trả
  `additionalContext` nêu số hàng đã thêm và nhắc đưa sổ vào cùng commit gói bằng chứng. Tệp khác → im.
- P179 đỏ thì thông điệp in thêm lệnh bộ sinh (lưới cho phiên không có móc).
- Sổ và P179 chỉ có ở kho kit: kho tiêu thụ không thấy gì đổi; bộ sinh và móc không đi trong gói.

## 3. Lựa chọn máy đã quyết (sổ S1) và hai câu cho người

Máy quyết (căn cứ ghi ở `decisions.jsonl`): bật theo lựa chọn (thứ tự chọn nghiệm của CLAUDE.md) · lệnh hồ sơ bằng đường
dẫn tệp (sửa đúng tầng — không đổi bộ đọc nào) · bảng điều phối chỉ thêm cờ vàng · P179 bằng bộ sinh + móc (hạt giống
18/10) · K10 để ngoài · không tách P179 thành vòng riêng (10 tiêu chí, trong khoảng mục tiêu).

Câu chỉ người có:
- **Hỏi-1 — lối a, b hay c** (bảng ở mục 2.1). Khuyên c.
- **Hỏi-2 — Node của tác tử chấm.** Lệnh không đặt PATH ở máy này ra `v26.7.0`; kho ghim 24 và bộ chạy ca tự so `.nvmrc`
  nên lượt chấm sẽ BLOCKED như hai vòng trước. Khuyên: cho thêm đường bản sao `~/dev/delivery-loop-main/` vào hàm bọc
  Node 24 trong hồ sơ shell của chủ kho, gỡ sau khi PR gộp (tiền lệ vòng `loi-gop-trong-cau-ky`). Lối khác: chủ kho tự
  đổi Node mặc định của máy (giá: mọi kho khác trên máy đổi theo), hoặc không đổi gì (giá: lượt chấm đầu BLOCKED, một lượt
  gọi người ngoài thiết kế).
- **Hỏi-3 — kho kit có tự bật `ban_do.ngoai_git` trong vòng này không.** Khuyên: chưa — để vòng mốc quanh 02/12 quyết
  cùng ba kho, kho kit giữ hai view trên web. Lối khác: bật ngay trong PR này (giá: PR thêm bước rời git hai tệp; kho kit
  công khai mất hai trang trên web; được đo thật một tuần trước mốc).

## 4. Để ngoài vòng, có lý do

- **K10 — đọc bậc sàn thiết kế khi sổ thành phần nằm ngoài git.** Ở Inventory cả sổ thành phần lẫn tệp token đều ngoài
  git và kho không niêm phong bậc M3, nên ở cây làm việc mới bậc rơi M2 → M1: chỉ mất dòng cảnh báo độ phủ token, không
  chặn, không đốt lượt. Nó làm thước lỏng, không làm vòng chậm — không thuộc đích «bắt đầu → gộp» của vòng. Giữ ở hạt
  giống giai đoạn 2 mục 2 (nhánh `chuyen-nha`), sẽ dời sang `docs/plans/` cùng PR đóng đợt.
- **Mỗi hàng một dòng trong view** (hạt giống 30/10): kho KHÔNG bật khoá vẫn xung đột ở forge. Giữ hạt giống; mở khi một
  kho không muốn rời git mà vẫn đếm được xung đột.
- **Bảng điều phối tự vẽ trang** (`nguon-hang.mjs`): kho bật mà bản kéo của điều phối chưa vẽ trang thì bảng thiếu nhóm
  kế hoạch. Vòng chỉ thêm cờ vàng gọi tên lệnh vẽ (AC-5); tự vẽ thì gói điều phối phải định vị gói acceptance-gate qua bộ
  giải cho một bảng hiển thị.
- Dời khối `executors.script` hiện có (kho kit, kho tiêu thụ) ra hồ sơ; bật khoá ở kho tiêu thụ; DL2.

## 5. Giới hạn khai trước

- Bật khoá không gỡ được xung đột ở PR đã mở trước lần bật (một lần sửa ↔ xoá).
- Răng vàng của 2.2 chỉ cảnh báo; vòng vẫn có thể thêm khoá vào tệp chung.
- Bộ sinh hàng sổ khớp SỐ LƯỢNG, không gắn từng hàng với từng mục (đúng nghĩa P179 hôm nay); lớp `chua-xep` phải được
  người xếp lại nếu cần.
- Móc chỉ chạy khi phiên ghi tệp bằng công cụ Write/Edit; ghi bằng lệnh shell thì lưới là thông điệp của P179.
