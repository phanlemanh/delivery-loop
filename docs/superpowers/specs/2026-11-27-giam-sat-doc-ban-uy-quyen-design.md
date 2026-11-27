# Thiết kế — phiên giám sát đọc bản uỷ quyền của kho (vòng DL6, lát 1)

*27/11/2026 · hồ sơ `_acceptance/giam-sat-doc-ban-uy-quyen/` · gói `plugins/dispatch` · lời phê CỘNG: ADR 0030 («Phê,
chọn A», 26/11).*

Gốc: `docs/adr/0030-giam-sat-doc-ban-uy-quyen-cua-kho.md` · ô `_acceptance/khung-dot-dinh-vi/` · hạt giống
`docs/plans/2026-11-24-hat-giong-giam-sat-co-quyen-va-co-so.md` (lớp 1) · phanlemanh/delivery-loop#5, #4 · chủ kho mở vòng
27/11: «Mở vòng thực hiện DL6».

## 1. Vấn đề, một đoạn

Quyền của phiên giám sát nằm trong hội thoại. Mỗi đợt chủ kho giao lại bằng lời; hết ngữ cảnh hay đổi tài khoản thì mất.
Mã hôm nay chỉ giữ một công tắc `tu_merge` cho cả đợt (`scripts/pha.mjs`), và lệnh `gop` chỉ nhận một DÃY đang giữ khoá
`merge` (`scripts/gop.mjs`) — nên ở đợt `nen` giám sát gộp thẳng PR việc chung, ngoài lệnh (#4 mục 6). Thứ tự cấp khoá
`merge` do máy xếp, không lệnh nào xếp lại (`scripts/lich.mjs`, `xepHang`). ADR 0030 quyết năm điều; vòng này dựng
chúng cho hai loại quyền đã có phép so VÀ đủ lệnh trong một hợp đồng ≤ 12 tiêu chí.

## 2. Phạm vi của lát này

| Phần của ADR 0030 | Lát 1 (vòng này) | Để lại |
|---|---|---|
| (1) Tệp ở kho, đọc từ nhánh chính | dựng | — |
| (2) Danh sách loại đóng | dựng — bộ đọc xếp MỌI tên của danh sách | — |
| (3) Vùng cấm cứng | dựng — ở bộ đọc VÀ lúc gộp theo quyền | — |
| (4) Sự kiện `dung-quyen` ghi trước | dựng cho hai lệnh của lát | — |
| (4) bên đọc «báo cáo đợt đếm» | dựng | — |
| (4) bên đọc «khối CHƯA duyệt của Cổng Bằng chứng» | — | lát 2: mọi lần dùng quyền của lát 1 xảy ra SAU chữ ký của hàng (gộp, thứ tự gộp), nên khối ấy rỗng theo cấu tạo cho tới khi có lệnh chạm hàng trước chữ ký (chuyển hàng, mở dãy, phán quyết) |
| (4) bên đọc «`tiep-tuc` in Phán quyết của giám sát» | — | lát 2, cùng lệnh `phan-quyet` (không có phán quyết thì không có gì để in) |
| (5) Khối uỷ quyền trên thẻ khởi tạo | dựng | — |
| Lệnh: giám sát gọi `gop` khi `tu_merge` bật | dựng (`gop … --theo-quyen`) | — |
| Lệnh: xếp lại thứ tự gộp | dựng (`thu-tu-gop`) | — |
| Lệnh: chuyển hàng, mở dãy, `phan-quyet` | — | lát 2 (hạt giống `docs/plans/2026-11-27-hat-giong-uy-quyen-lat-2.md`) |

Loại quyền bộ đọc nhận ở lát này: **`thu-tu-gop`, `gop`**. Còn lại in «vẫn hỏi chủ kho» kèm lý do (§4); `phien` chưa được
nhận (§4 — nhận một quyền không có sự kiện là chạm ngưỡng thu hồi của ADR).

## 3. Bộ đọc — `scripts/uy-quyen.mjs`

**Nguồn.** `docUyQuyen({ gocKho, nhanhChinh, io })`:
1. `git fetch -q origin <nhánh chính>` (lỗi thì ghi nhận, không ném);
2. `git rev-parse origin/<nhánh chính>` → `sha` (không có ref → tệp vắng, im);
3. `git show <sha>:governance/delegation.yaml` — không có tệp → `{ co: false }`, im.
Không bao giờ đọc cây làm việc hay nhánh PR. Lấy về hỏng mà ref cũ CÓ tệp → `{ co: true, loi: 'không lấy được nhánh
chính …' , nhan: [] }` (đóng an toàn: quyền đã thu ở nhánh chính không được sống tiếp nhờ ref cũ); lấy về hỏng mà ref cũ
không có tệp → im (kho không tệp, máy offline vẫn chạy như hôm nay).

**Khuôn đọc** (gói không nạp bộ đọc YAML — cùng lệ với `gop.mjs`, `cua-proof.mjs`): bỏ dòng trống, dòng chú thích và
chú thích đuôi; khoá cột 0 `ban: <số>` và `tu_lam:` với danh sách dạng dòng `[a, b]` hoặc dạng khối `- a`; phần tử là
tên trần hoặc trong nháy. Mọi dòng khác ở cột 0 dạng `khoá: …` là khoá lạ → cờ vàng, bỏ qua. Dòng không khớp khuôn nào
→ lỗi đọc nêu số dòng. `ban` vắng → cờ vàng «tệp đời cũ thiếu trường ban»; `ban` khác 1 → lỗi đọc («bản <n> mới hơn bộ
đọc»); `tu_lam` vắng hay không phải danh sách → lỗi đọc.

**Một kết quả:** `{ co, sha, nhanh, nhan: [...], van_hoi: [{loai, cau}], vang: [...], loi: null | 'câu' }`. Có `loi` thì
`nhan` rỗng — mọi lệnh của quyền chặn, thẻ in lỗi.

## 4. Danh sách đóng (hằng `LOAI` trong `uy-quyen.mjs`)

| Tên | Nhóm ở lát 1 | Câu in |
|---|---|---|
| `thu-tu-gop` | nhận | — |
| `gop` | nhận (chỉ dùng được khi ô `tu_merge` của đợt bật — Hỏi-2 lối A của ADR) | — |
| `phien` | vẫn hỏi | «mở phiên: máy đã tự làm theo thẻ khởi tạo, không cần quyền — dọn phiên: chưa có phép so — vẫn hỏi chủ kho» |
| `chuyen-hang`, `mo-day`, `phan-quyet-chung` | vẫn hỏi | «chưa có lệnh ở bản này — vẫn hỏi chủ kho» |
| `lo-trinh` | vẫn hỏi | «chưa có phép so — vẫn hỏi chủ kho» |
| `muc-ngoai-hop-dong` | sai chỗ | «không thuộc giám sát đợt — sống ở chính sách Cổng Đáng» |
| `thiet-ke` | sai chỗ | «không thuộc giám sát đợt — sống ở sổ thiết kế của design-assembly» |
| tên không có trong bảng và không thuộc vùng cấm | lỗi đọc | «loại lạ: <tên>» — cả tệp bị từ chối |

**Nửa «dọn phiên» — đo, không suy (27/11).** Phép so của vòng đối soát bàn giao (PR #32) là `doiSoatBanGiao(thuMuc, bg)`:
nó so bản ghi lúc bàn giao với hiện trạng, chỉ được gọi khi rời bàn giao (`tiep-tuc.mjs`), và đòi một bản `ban-giao.json`
— dọn phiên sau gộp không có bản ấy. Khối gạch dùng lại được là `chuaDay(worktree)` (`muc-day.mjs`). Đo trên kho thử
(origin trần + ba worktree liên kết): dãy đã gộp vào `main` bằng commit gộp mà nhánh không có upstream → `chuaDay = true`
(dương tính giả trên đúng ca «dọn phiên đã gộp»); dãy đã đẩy nhưng còn việc dở trong stash → `chuaDay = false` (âm tính
giả — dọn là mất việc dở); dãy có upstream bị xoá, commit chưa vào `main` → `true` (đúng). Phép so sai cả hai chiều →
nửa dọn vẫn hỏi chủ kho; ghi vào hạt giống lát 2 kèm vị từ cần dựng (đỉnh nằm trong `origin/<nhánh chính>` hoặc trong
nhánh theo dõi, cây sạch, không stash của nhánh).

**Nửa «mở phiên» không được nhận ở lát này.** Mở chip cho dãy `mo-chip` đã là việc máy làm theo `chan-doan`
(`commands/open.md` bước 6, `commands/resume.md` bước 4) không hỏi chủ kho, và mở chip là công cụ của app — CLI không
thấy, nên không có chỗ ghi `dung-quyen` trước hành động. Nhận nó mà không có sự kiện là chạm đúng ngưỡng thu hồi của ADR
(«một lần dùng quyền không có sự kiện → tắt bộ đọc ở mốc kế»); thêm lệnh ghi sự kiện trước khi mở chip thì có giá mà
không bớt lượt gọi nào. Tên `phien` vẫn là tên hợp lệ (không phải loại lạ), xếp «vẫn hỏi» với câu ở bảng trên.

## 5. Vùng cấm cứng (hằng `VUNG_CAM`)

Tên vùng cấm trong `tu_lam`: `chu-ky`, `cat-ban`, `xoa-nhanh`, `day-kho-khac`, `cai-dat-github`, `workflows`, `governance`,
`luat-san-pham`, `pham-vi-dot`, `luat-dot`, `uy-quyen`. Gặp một tên → từ chối CẢ tệp: `loi = '«<tên>» thuộc vùng cấm cứng
(<mô tả>) — không cấu hình được; cả tệp bị từ chối'`, `nhan = []`.

Lúc gộp theo quyền, vùng cấm có răng thứ hai trên chính PR: tệp PR đổi (so với merge-base, `--no-renames`) mà chạm
`.github/workflows/`, `governance/` hay `PRODUCT-INVARIANTS.md` → chặn, nêu tệp, «bấm gộp là của người». Đây là chốt cho
ca «PR của giám sát tự sửa bản uỷ quyền»: PR ấy không gộp được bằng quyền, chỉ người gộp.

## 6. Sự kiện `dung-quyen`

`ghiDungQuyen(thuMuc, { quyen, viec, duong_dao, sha_uy_quyen })` → `ghiSuKien(thuMuc, { loai: 'dung-quyen', quyen, viec,
duong_dao, sha_uy_quyen, can_phan: false })`. Gọi SAU mọi phép kiểm, TRƯỚC hành động; ném thì lệnh dừng, không hành
động, thoát 1 «không ghi được sự kiện dung-quyen — không làm». `sha_uy_quyen` = sha đỉnh nhánh chính lúc đọc (lần được
ở forge: PR đã đưa tệp vào nhánh chính và người gộp nó — ADR 0012).

| Lệnh | `viec` | `duong_dao` |
|---|---|---|
| `gop --theo-quyen` | `gộp PR #<n> (hồ sơ <slug>) ở <sha7>` | `hoàn lại commit gộp của PR #<n>: git revert -m 1 <commit gộp>` |
| `thu-tu-gop` | `xếp lại thứ tự gộp: <a> → <b> → …` | `xoá <thư mục đợt>/thu-tu-gop.json (thứ tự trước: <cũ>)` |

## 7. Lệnh của quyền

**`gop <PR> --slug <slug> --theo-quyen --phien <mã giám sát>`** — trong `gop.mjs`, đi qua `bamGop` (chỗ DUY NHẤT gọi
`gh pr merge`). Thứ tự kiểm, dừng ở điều đầu tiên hỏng, mỗi điều một thông điệp ghim:
1. có đợt; `--slug` có; `--phien` là giám sát ghi ở `vai.json` (`laGiamSat` = true);
2. `docPha(thuMuc).tu_merge === true` — «đợt không cho tự gộp (tu_merge) — quyền gop chỉ dùng khi chủ kho bật ô ấy»;
3. bản uỷ quyền đọc được và `nhan` có `gop`;
4. khoá `merge`: tạo `khoa/merge` bằng `mkdir` (nguyên tử, cùng cách bộ phát lịch cấp) với `chu.json` mang
   `phien` = giám sát, `loai: merge`; đã có người giữ → «khoá merge đang do <x> giữ». Từ đây mọi lối — chặn ở bước 5–6,
   sổ hỏng, `gh` thất bại hay ném — đi qua MỘT khối `finally` nhả khoá của chính giám sát (chỉ khi `chu.json` còn mang
   phiên giám sát);
5. `xetGop` KHÔNG ĐỔI (chữ ký thật, CI xanh, cửa proof, lối nhanh theo cấu hình đợt);
6. vùng cấm trên tệp PR (§5);
7. `ghiDungQuyen` → `bamGop` → nhả khoá (mọi lối, kể cả ném) → `ghiSuKien` `gop` như lệnh trong đợt.
Lời gọi luôn `gh pr merge <n> --merge --match-head-commit <sha>`; không có `--auto` ở đâu. Không có `--theo-quyen` thì
lệnh y như hôm nay. Chuyến gộp (`chuyen`) không mở cho giám sát ở lát này.

**`thu-tu-gop <dãy,dãy,…> --phien <mã giám sát>`** — `scripts/thu-tu-gop.mjs`. Kiểm giám sát, quyền `thu-tu-gop`, rồi
danh sách phải là HOÁN VỊ đúng tập dãy đang có đơn `merge` trong `xin/` (thiếu, thừa, trùng → chặn nêu dãy — phép so
«tập PR được gộp không đổi»). `ghiDungQuyen` → ghi `thu-tu-gop.json` `{ thu_tu, luc, boi }`. `xepHang(donXin, hangViec,
thuTu = null)` thêm khoá đầu cho đơn `merge`: vị trí trong `thu_tu` (đơn ngoài danh sách đứng sau); `thuTu` vắng → khoá
y như cũ. Bộ phát lịch đọc tệp mỗi nhịp và truyền vào `capLuot`. Mỗi PR vẫn qua `xetGop` lúc gộp — thứ tự không mở phép
nào.

## 8. Hai bề mặt mới (chỉ ở kho có tệp)

- **Thẻ khởi tạo** (`theKhoiTao`): kho có tệp → thêm khoá `uy_quyen` (`nguon: "origin/<nhánh>@<sha7>"`, `nhan`,
  `van_hoi`, `vang`, `loi`) và nối `'uy-quyen'` vào `may_di_tiep`; KHÔNG thêm gì vào `hoi`. Kho không tệp → JSON từng byte
  như cũ. `commands/open.md` bước 3 trình khối như mục máy đi tiếp có cửa phản đối, kèm một dòng: «quyền gộp chỉ dùng khi
  anh bật quyền tự merge ở thẻ này».
- **Báo cáo đợt** (`demDot`): sổ có dòng `dung-quyen` → khoá `dung_quyen: { tong, theo_quyen: {…} }`; không có → không
  khoá. `commands/close.md` bước 5 ghi dòng đếm vào báo cáo.
- `xem`, `xem --json`, dải và khung: không đổi, kể cả ở kho có tệp (ADR: bề mặt mới duy nhất là hai chỗ trên).
- Lệnh lọc Monitor trong `commands/open.md` bọc trong cặp marker `MONITOR-LOC` để ca đo rút nguyên văn (marker vắng →
  ca đỏ «không tìm thấy lệnh lọc Monitor»).

## 9. Đo — mỗi phép đo một cặp hai chiều trên cùng kho thử

Tệp ca mới `tests/dieu-phoi/uy-quyen.test.mjs` (tên ca `UQ-0n` = AC-n), `rang/chay.sh AC-n` đòi đúng tên ca. Kho thử do
mã sinh: origin trần + bản clone + đợt mở bằng CLI thật; `gh` giả (`tests/dieu-phoi/gh-gia.mjs`) ghi lời gọi. Ca đỏ chạy
CHÍNH hàm trên bản sao trọn gói (`cp -R plugins/dispatch`) bị tiêm, sau khi bản lành xanh trên cùng kho thử; kiểm bước
tiêm đã đổi tệp; ghim thông điệp. Mutant bắt buộc của ADR: đổi nguồn đọc sang cây làm việc → ca «PR của giám sát tự thêm
`lo-trinh`/`thu-tu-gop`» đỏ; bỏ `ghiDungQuyen` → ca «lệnh của quyền chạy mà không có dòng dung-quyen» đỏ. Chiều im: bản
nhánh chính dựng bằng `git archive <origin/main> plugins/dispatch` (trọn thư mục), so từng byte bốn đầu ra.

## 10. Cân trên mọi kho

Kho không có tệp, kho không cài `dispatch`, kho không remote, kho có remote mà lấy về hỏng: không đổi gì (AC-5); `gop`
không cờ: không đổi gì (AC-5). Tệp đời cũ thiếu `ban`: đọc được, cờ
vàng. Khuôn neo vào tên loại kit định nghĩa. Bề mặt mới duy nhất ở kho có tệp: khối trên thẻ khởi tạo, dòng đếm trong
báo cáo đợt, và hai lệnh chỉ chạy khi giám sát gọi.

## 11. Dự báo năm dòng (luật c) — so bảng của ADR 0030

| Dòng | ADR 0030 | Lát 1 |
|---|---|---|
| làm-xong→gộp-được | ↓ | ↓ ở đợt có tệp và `tu_merge` bật (giám sát gộp PR việc chung, xếp thứ tự); = ở kho không tệp |
| lượt gọi người | trong: = · ngoài: ↓ | trong: = · ngoài: ↓ chỉ phần gộp/thứ tự gộp; câu chuyển hàng, mở dãy, phán quyết vẫn hỏi tới lát 2 |
| vòng bị hạ tầng đốt lượt chấm | = | = |
| token máy/vòng | = | = |
| phút máy/lượt chấm | = | = (+1 tệp ca ~ dưới 1 phút) |

Điều kiện tin cậy: đường verdict không đổi thành phần — vòng không chạm S4.

## 12. Đường đảo

Xoá `governance/delegation.yaml` ở nhánh chính của kho → lần đọc kế không còn quyền. Hoàn lại PR của vòng. Ngưỡng thu
hồi (ADR): một lần dùng quyền không có sự kiện, hoặc một lần chạm vùng cấm → tắt bộ đọc ở mốc kế.

## 13. Đặc tả UX

Bỏ — vòng chỉ chạm lệnh dòng lệnh, JSON của thẻ và chỉ dẫn của gói; không có màn nào (sổ quyết định).
