# Hạt giống — phiên giám sát có quyền và có sổ: quyền giao một lần, đối soát bàn giao, hàng rộng trong lộ trình

Gốc: delivery-loop/_acceptance/khung-dot-dinh-vi/ — hồ sơ đã dựng bước (a)–(b) của ADR 0027 cho vai giám sát (câu giám sát
hỏi chủ kho vào sổ, khung định vị); bước (f) «ký theo chính sách» chưa dựng cho vai này. Ô trích lại tên tệp này ở Notes.
Cơn đau đo ở đợt `nen` của `onehub-inventory` (10–11/11/2026): phanlemanh/delivery-loop#5 (lời giao nguyên văn của chủ
kho, 10 lần thợ dừng chờ phán trong 2 giờ 45 phút) và phanlemanh/delivery-loop#4 (mục 3, 6, 7). Chủ kho nêu lại 24/11/2026,
nguyên văn: «tôi thường phải giao tay cho Phiên điều phối về quyền sắp xếp phiên gộp, quyết định gộp, gỡ lỗi và điều phối
các phiên quyết định ngoài các cổng. Và sắp xếp lộ trình tái cấu trúc mã để đảm bảo hiệu quả và tránh xung đột nhất. Và
kiểm tra bàn giao và đối soát bàn giao sau khi đổi tài khoản.»

Trạng thái: SỔ, không phải cam kết. Chưa thiết kế, chưa có ô, chưa có vòng. Mã đọc ở `main` `47c62643` (gói `dispatch`
3.1.1).

## Một vấn đề, không phải ba

Quyền và trạng thái của phiên giám sát nằm trong hội thoại, không nằm trong tệp của đợt. Vì thế mỗi đợt chủ kho giao lại
bằng tay, và mỗi lần hết ngữ cảnh hay đổi tài khoản phần ấy mất. Kit đang coi giám sát là người chuyển việc (phán khi
được hỏi, mở chip, giăng lịch); chủ kho cần giám sát là chủ của đoạn giữa các cổng, gồm cả đoạn ký→gộp — đúng chỗ
`CLAUDE.md` (đích 23/10) ghi là «không có chủ máy».

## Hiện trạng đã đọc trong mã

Quyền và gộp:

- Quyền giao máy giữ được chỉ có một công tắc `tu_merge` cho cả đợt, chủ kho gõ ở thẻ khởi tạo
  (`plugins/dispatch/scripts/pha.mjs`, `commands/open.md` khối `CHU-QUYET-CUA-NGUOI`). Không khoá nào nói «giám sát quyết
  thứ tự gộp, gộp, gỡ lỗi».
- Lệnh `gop` và `chuyen` đòi người gọi là một dãy đã ghi danh, đang giữ khoá `merge`, trong đợt có `tu_merge`
  (`scripts/gop.mjs`, `scripts/chuyen-gop.mjs`). Giám sát chỉ có `gop --xet` (in phán đoán). Ở đợt `nen` giám sát gộp thẳng
  PR việc chung, ngoài luật đợt (#4 mục 6).
- Thứ tự cấp khoá `merge` do máy xếp: đơn `ghim-lai` có `--mo-merge` → mốc của hàng → giờ xin (`scripts/lich.mjs`,
  `xepHang`). Không lệnh nào cho xếp lại. Mục «Thứ tự gộp khi tranh chấp» của khuôn `scripts/mau/LUAT.md` để trống.
- Đỏ không có chủ: luật ghi «báo giám sát», không nêu ai sửa. Sự kiện `chuyen` không mang `can_phan`
  (`scripts/chuyen-gop.mjs`, `ghiSuKien` cuối hàm lệnh), nên chuyến gộp đỏ không đánh thức Monitor của giám sát.
- Phán quyết của giám sát chỉ nằm ở `tra-loi/<mã>.json` của từng yêu cầu và trong hội thoại. Không có sổ phán quyết,
  không có lối «thành luật chung» (#5).

Lịch và lộ trình:

- `dung_tren` của lộ trình không được chép sang `sau` của đợt (`scripts/nguon-hang.mjs`, `scripts/goi-dot.mjs` chỉ mang
  `ma`, `slug`, `tep`, `vung`) — vẫn như #4 mục 3.
- Lịch biết tệp chỉ chặn hai hàng trùng vùng chạy CÙNG LÚC; hàng nào đi trước là do `uu_tien` người khai
  (`scripts/trung-tep.mjs`, `scripts/lich.mjs`). Không có lệnh chuyển hàng sang dãy khác hay mở dãy (#4 mục 7), không có
  khung đường găng.
- Kit không phân biệt hàng tái cấu trúc. Hàng có `vung` rộng tự thành hàng chặn mọi hàng nó chồng; không gì xếp hàng
  rộng vào điểm lặng. Tìm «tái cấu trúc» / «refactor» trong cây chỉ ra thông điệp commit và ghi chú ngoài phạm vi.

Bàn giao khi đổi tài khoản:

- `ban-giao.json` ghi từ git: `sha_nhanh_chinh`, và mỗi dãy `nhanh`, `dinh`, `da_day`, `co_wip`, `khoa`, `don`
  (`scripts/ban-giao.mjs`, `scripts/muc-day.mjs`). Tệp được VIẾT mà không được ĐỌC LẠI để so: `sha_nhanh_chinh` không có
  bên đọc nào; `dinh`, `co_wip` chỉ thành chữ trong lời ghi danh của chip (`scripts/tiep-tuc.mjs`); `khoa` và `don` lúc nối
  lại đọc từ trạng thái hiện tại. `tests/dieu-phoi/doi-tai-khoan.test.mjs` không có ca nào so trước với sau.
- `ban-giao-xong` từ chối khi cây bẩn hay còn đơn, nhưng không đòi đẩy nhánh; chip sau khi đổi tài khoản dựng cây làm
  việc mới.
- `commands/resume.md` bước 2: kết quả `khuyen_cho` (tài khoản mới cũng quá ngưỡng báo trước) vẫn «đi tiếp bước 3», rồi
  bước 4 mở chip.
- Nhóm thanh bên, lịch 30 phút, Monitor, tin liên phiên mất theo tài khoản; dựng lại là chỉ dẫn trong lệnh, không có máy
  kiểm. Hạt giống `docs/plans/2026-10-14-hat-giong-hien-trang-sau-doi-tai-khoan.md` đã ghi cùng cơn đau ở lớp nhìn.
- Ca thật thứ hai, ngoài gói điều phối: phiên giữ đợt chuyển nhà đổi tài khoản 22/11/2026 — chuông hằng ngày mất cùng
  phiên, bàn giao viết tay 208 dòng (`migration/BAN-GIAO.md` trên nhánh `chuyen-nha`).

## Hướng (chưa thiết kế) — bốn lớp, từ rẻ tới đắt

**Lớp 0 — ở kho chạy đợt, không sửa kit.** Gói đợt của kho đã có `LUAT-rieng.md` (`scripts/goi-dot.mjs`), mọi đợt mở từ
gói đều chép nó. Kho ghi vào đó một lần: lời giao quyền nguyên văn kèm vùng cấm · thứ tự gộp khi tranh chấp · mục «Phán
quyết của giám sát». Lời giao nằm trong git nên sống qua đổi tài khoản. Giới hạn: giám sát vẫn không có lệnh gộp đúng
luật. Tiền lệ cùng khuôn đã chạy: quyền lặp A3 của đợt chuyển nhà (giao một lần trong kế hoạch, có vùng cấm) — các PR tài
liệu hạng T1 gộp mà không gọi chủ kho.

**Lớp 1 — «giám sát có quyền và có sổ».**

- Bản uỷ quyền đợt: một khối trong cấu hình gói đợt liệt kê LOẠI việc giám sát tự quyết (thứ tự gộp · gộp · chuyển hàng ·
  mở dãy · phán quyết chung · gỡ lỗi). Thẻ khởi tạo in nó như mục máy đi tiếp có cửa phản đối, không thành câu hỏi. Đây là
  chân (f) của ADR 0027 áp cho vai giám sát: chữ ở dạng luật ký một lần thay cho giao từng đợt.
- Vùng cấm cứng, không cấu hình được: chữ ký ở cổng · việc khó đảo ngoài gộp (cắt bản, xoá, đẩy lên kho khác) ·
  `.github/workflows/`, `governance/` · luật sản phẩm của kho.
- Sổ phán quyết: mỗi phán quyết một dòng trong luật đợt kèm đường đảo và một dòng Nhật ký; câu hỏi lặp lần hai thành luật
  chung; `tiep-tuc` in lại sổ cho giám sát vừa nhận vai. Mọi lần dùng quyền hiện ở báo cáo đợt (lưới cho phân loại sai).
- Lệnh để dùng quyền: giám sát gộp qua ĐÚNG các phép kiểm của `xetGop` (chữ ký thật, CI xanh, cửa chứng minh) — không nới
  phép nào; lệnh xếp thứ tự gộp, chuyển hàng, mở dãy; `mo` suy `sau` từ `dung_tren`.
- Đỏ có chủ: chuyến gộp đỏ hay nhánh chính đỏ sau gộp mang `can_phan`; dãy vừa gộp nhận việc sửa; quá ngân sách thử thì
  thành nhãn trạng thái lên chủ kho ở cổng đã có (ca dừng K8: hệ thống chết thử lại một lần).

**Lớp 2 — «đối soát bàn giao».**

- `tiep-tuc` đọc `ban-giao.json` gần nhất và in bảng trước/sau cho từng dãy: nhánh · đỉnh · commit dở đã đẩy chưa · khoá ·
  đơn · câu hỏi chủ kho đang mở · PR · nhánh chính dời bao nhiêu commit. Khớp hết → một dòng; chủ kho chỉ đọc dòng lệch.
- `ban-giao-xong` chưa đẩy nhánh → cờ đỏ. `khuyen_cho` → không mở chip.
- Ca kiểm khứ hồi viết-rồi-đọc cho `ban-giao.json` — đúng lớp «bên VIẾT và bên ĐỌC trôi khỏi nhau» của `CLAUDE.md`, ở đây
  là có bên viết mà chưa có bên đọc.

**Lớp 3 — «hàng rộng» trong lộ trình, chạy chế độ bóng trước.** Kit không cần từ «tái cấu trúc» (từ vựng của một kho);
nó tính được hàng RỘNG từ `vung`: hàng chồng vùng lên nhiều hàng khác. Lúc cắt lượt máy in cho mỗi hàng rộng: chặn bao
nhiêu hàng · làm bao nhiêu hồ sơ đã ký phải ghim lại · điểm lặng gợi ý (trước khi các dãy bị chồng bắt đầu, hoặc sau khi
chúng gộp). Lúc đầu chỉ in gợi ý, giám sát quyết; có số mới cho máy tự xếp. Kèm khung đường găng (#5).

## Cân trên mọi kho

- Lớp 1 đổi bề mặt của mọi kho dùng gói điều phối → tắt mặc định; kho không khai bản uỷ quyền chạy như hôm nay.
- Lớp 2 đổi đầu ra của `tiep-tuc`: kho chưa có `ban-giao.json` (chưa từng bàn giao) không thấy gì mới. `ban-giao.json` cũ
  thiếu trường → đọc được, cờ vàng.
- Lớp 3 chỉ thêm dòng in ở lượt cắt; lộ trình không có `vung` thì im.
- Kho không cài gói điều phối: không đổi gì ở cả bốn lớp.

## Trace và người hưởng

Nguyên tố 3 (khoảnh khắc quyết thật): chủ kho chỉ ra ở cổng; quyền giữa các cổng là luật ký một lần, máy giữ đường đảo.
Nguyên tố 2 cho lớp 2 (bàn giao tự chứng minh bằng phép so, không bằng lời «đã bàn giao»). Người hưởng: chủ kho của kho
chạy đợt — bớt lượt gọi ngoài cổng và bớt giờ ký→gộp; phiên giám sát kế nhiệm — thừa hưởng quyền và phán quyết.

Lớp 1 và lớp 3 là CỘNG: cần chủ kho phê đích danh ở Cổng Phạm vi của chính vòng (ADR 0018). Lớp 2 phần lớn là sửa
đúng-sai. Ba lớp không vào một hợp đồng được (vượt cỡ 12 tiêu chí).

## Chưa đo

- Số của đợt `nen` là 2 giờ 45 phút đầu, chưa hàng nào gộp. Chưa có số nào cho thấy cách làm của #5 rút ngắn ký→gộp hay
  giảm lượt gọi ngoài cổng.
- Quy tắc xếp hàng rộng chưa có lần đo nào.
- Chưa kiểm: bộ dò PR của lịch biết tệp (`scripts/trung-tep.mjs`, `git diff --name-only`) thấy gì với PR chỉ dời tệp.

## Ngưỡng mở ô

- Lớp 2: thêm ≥ 1 lần đổi tài khoản giữa một đợt mà chủ kho phải đối soát tay một dãy (cùng họ ngưỡng với hạt giống
  14/10).
- Lớp 1: đợt kế của một kho tiêu thụ mà chủ kho phải gõ lại lời giao quyền, hoặc giám sát phải gộp ngoài lệnh `gop`.
- Lớp 3: một đợt có hàng rộng làm ≥ 2 hồ sơ đã ký phải ghim lại.

Thứ tự đề nghị khi mở: lớp 0 ngay ở kho chạy đợt kế → lớp 2 → lớp 1 → lớp 3.
