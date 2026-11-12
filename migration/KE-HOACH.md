# Nháp đề xuất — dọn nhà kit thành `delivery-loop`

> **Trạng thái:** kế hoạch đã chốt với chủ kho ngày 11/11/2026 (phương thức kho mới mang lịch sử, bảng tên tạm, bốn dãy
> việc ở mục 12–13). Các mục 1–11 giữ nguyên lịch sử suy nghĩ — chỗ nào bị mục sau thay thế thì mục sau thắng (đặc biệt
> mục 4 bị mục 12 thay, mục 11 bị mục 13 sửa). Đang ở đâu: `TRANG-THAI.md`. Bối cảnh và luật làm việc: `BOI-CANH.md`.
>
> **Về tên máy trong tệp này:** các mục 10–13 viết lúc định giao Mac Studio. Với đợt chuyển nhà (dãy B, dãy R), đọc «Mac
> Studio» là «máy đang giữ» ghi ở `TRANG-THAI.md`. Riêng dãy A là vòng của kho CŨ: A1 chủ kho giao MacBook Pro 11/11, gộp 12/11; mốc 2.39 làm ở Mac Studio.
>
> Kho này đang RIÊNG TƯ. Tệp này có số đo về hai kho tiêu thụ — rà ẩn danh trước ngày kho chuyển công khai.

Mọi số dưới đây đo ngày 11/11/2026 trên nhánh chính kho CŨ `be736814` (bản 2.38.1), trừ chỗ ghi khác.

## 1. Chủ kho muốn gì

Kit ngày càng phình, bảo trì và cập nhật tốn giờ; lúc dựng kho ban đầu chưa chuẩn; tên plugin và lệnh lẫn tiếng Anh với
tiếng Việt. Hai việc: **dựng lại kho** và **làm kit mạch lạc, dễ bảo trì, dễ nâng cấp** — vẫn để North Star dẫn dắt, giữ
nguyên tính năng hiện có, và đồng bộ với Repo Standards.

## 2. Kit đang nặng ở đâu

| Chỗ nặng | Số đo | Ai trả giá |
|---|---|---|
| Mỗi bản cài chép cả kho | 100 MB mỗi bản (bản 2.16 là 34 MB). Kho 87 MB / 5 663 tệp: hồ sơ vòng của chính kit 58 MB / 2 988 tệp, tài liệu 12 MB / 879 tệp, bộ kiểm 8 MB / 1 141 tệp. Phần lõi + vòng tính năng + điều phối khoảng 3–4 MB | Mọi kho tiêu thụ, mỗi lần nâng bản |
| Mỗi lượt kiểm tự động | Trung vị 58 phút: bộ kiểm script 37 phút + bộ kiểm plugin 17 phút chạy nối đuôi trong một việc. Cơ chế chia mảnh đã có (lượt chấm đang dùng), lượt kiểm tự động chưa dùng | Người sửa kit |
| Số lượt phải chạy lại | Từ 01/10: 225 PR gộp · 141 commit ghim lại · 258 lần gộp nhánh chính vào nhánh làm việc. 21/60 lượt kiểm gần nhất đỏ (15 ở cổng của kit, 14 có bộ kiểm đỏ) | Người sửa kit |
| PR mở → gộp | 40 PR gộp 28/10 → 10/11: trung vị 3,6 giờ, p75 5,7 giờ | Người sửa kit |
| Bộ kiểm gấp đôi sản phẩm | 102 773 dòng kiểm so với khoảng 50 000 dòng sản phẩm. Hai tệp kiểm 11 450 và 4 506 dòng. Bốn kiểu ca kiểm; một tệp nhúng 103 khối Python mà kit không khai là cần Python | Người sửa kit |
| Bộ kiểm đọc hồ sơ sống | Khoảng 60 % tệp của bộ kiểm script (98/162) đọc hồ sơ hay tài liệu thật của kit → PR chỉ sửa hồ sơ vẫn làm đỏ bộ kiểm lõi | Người sửa kit |
| Tên lẫn lộn | Plugin 4 tên Anh / 2 tên Việt · lệnh 12 Anh / 12 Việt · skill 5 Anh / 2 Việt. Mô tả plugin lõi 84 582 ký tự (nhật ký 92 phiên bản), vòng tính năng 34 579 | Người dùng kit |
| Phát hành | Phiên bản khai ở 6 nơi, không có lệnh nâng phiên bản; 44 thẻ, 0 bản phát hành trên GitHub; nhật ký thay đổi 5 165 dòng một tệp; plugin sơ đồ chạy số riêng (2.7.1) | Người sửa kit |
| Tài liệu | 879 tệp: 659 là sổ làm việc (387 bản thảo + 272 kế hoạch, trong đó 206 hạt giống), 56 là tài liệu sống (28 ADR + 28 tham chiếu). README / QUICKSTART / GUIDE: 369 / 267 / 2 018 dòng | Người và máy đọc kit |
| Nhánh tồn | 264 nhánh trên GitHub, 108 nhánh hơn 30 ngày không động; tự xoá nhánh sau gộp đang tắt; 7 PR mở (cũ nhất 17/10) | Người sửa kit |
| Bảo mật | Kho công khai, quét bí mật và chặn đẩy bí mật của GitHub đang tắt | Chủ kho |

**Tin tốt:** mã sản phẩm gọn — chỉ 2 tệp không ai gọi (`scripts/rel-cua-so.sh`, `lib/eval-yaml.js` trùng bản `.cjs`).
Không thấy chỗ nào mã sản phẩm **đọc** tài liệu hay bộ kiểm của kit lúc chạy, nên tách ra được. Nhưng có 37 tệp sản phẩm
**nhắc** tới `docs/…` và 17 tệp nhắc tới `tests/…` trong chú thích và lời dẫn (mẫu đã đọc đều là con trỏ cho người đọc,
chưa đọc hết) — sau khi tách, các con trỏ ấy thành treo ở bản cài nếu không đổi sang đường dẫn đầy đủ hoặc gỡ.
(Bản đầu của nháp này ghi «không trỏ sang» — sai, do lệnh đếm chạy dưới zsh không tách danh sách thư mục; đã đếm lại.)

**Đã kiểm, không phải vấn đề:** móc của plugin lõi khoảng 45 mili giây mỗi lần · chữ mô tả nạp vào mọi phiên của kho tiêu
thụ 9 168 ký tự (31 mục) · mỗi lượt ghim lại chỉ chạm 1–2 hồ sơ (dọn 219 hồ sơ đã ký không giảm chi phí ghim).

**Điểm của `/repo-setup:doctor`:** 44/100 (mức một người), 29/100 (mức đội). Thước đó dành cho ứng dụng Node/Python nên
không hợp kho plugin; xem mục 5.

## 3. Đã chốt tạm với chủ kho (11/11)

- **Tên kho và tên chợ plugin:** `delivery-loop` (thay `acceptance-gate-kit`). Tên còn trống dưới tài khoản chủ kho; chưa
  kiểm trùng với dự án của người khác.
- **Tên plugin:** giữ `acceptance-gate`, `feature-loop`, `diagram-design`. Đổi `dieu-phoi` → `dispatch`, `road-map` →
  `roadmap`, `tri-thuc` → `knowledge`.
- **Tên lệnh của ba plugin đổi tên:**

  | Plugin | Hiện nay → mới |
  |---|---|
  | `dispatch` | `mo-dot` → `open` · `dong-dot` → `close` · `tiep-tuc` → `resume` · `ban-giao` → `handoff` · `xem` → `status` |
  | `roadmap` | `xem` → `status` · `ghim` → `pin` · `bo-ghim` → `unpin` · `tra-lai` → `undo` · `gui` → `suggest` |
  | `knowledge` | `ghi` → `ingest` · `kiem` → `health` |

- **Hai skill tiếng Việt trong plugin lõi (tên tạm, chưa soát mô tả):** `cat-luot` → `scope-slice`, `gom-tin-hieu` →
  `signal-intake`.
- **Không đổi:** chữ người đọc (thẻ, thông báo, tên các cổng) giữ tiếng Việt · tên hồ sơ trong kho tiêu thụ · tên tệp
  script nội bộ · khoá cấu hình và giá trị trạng thái hồ sơ đang có.

## 4. Bốn chặng

Mỗi chặng là một vòng có tên do chủ kho gọi, kết thúc bằng một mốc mà một kho tiêu thụ cài, đo trước → sau.

| Chặng | Việc | Thước đo |
|---|---|---|
| **0. Chuẩn bị** — không đổi mã kit | Bật quét bí mật + chặn đẩy bí mật · bật tự xoá nhánh sau gộp, dọn nhánh tồn · gộp hoặc đóng 7 PR đang mở · đo thời gian từng ca kiểm · kiểm Claude Code có cho loại trừ thư mục khi đóng gói plugin không | Có số nền |
| **1. Nhẹ đi** — mốc 2.39, chỉ bớt | Cắt mô tả plugin còn một hai câu · chia mảnh lượt kiểm tự động chạy song song, giữ một lượt chạy trọn trên nhánh chính · bộ chạy tự xưng và tự so phiên bản Node · xoá 2 tệp thừa · thêm `.env` vào danh sách bỏ qua | Lượt kiểm 58 phút → ước 15–20 phút (chưa đo) |
| **2. Dọn nhà** — mốc 3.0, gãy MỘT lần | Chuyển sản phẩm vào `plugins/<tên>/` như Repo Standards · đổi tên kho, chợ, plugin, lệnh theo mục 3 · tên cũ làm bí danh một mốc · một lệnh nâng phiên bản + bản phát hành trên GitHub + tách nhật ký cũ · lập sổ giao diện công khai (mục 5.2) · sổ làm việc sang kho tri thức, README song ngữ · hồ sơ chuẩn «kho plugin» bên Repo Standards | Bản cài 100 MB → khoảng 3–4 MB · phán quyết trên hồ sơ thật của hai kho tiêu thụ không đổi (phép vi phân cũ so mới) |
| **3. Bộ kiểm mạch lạc** — làm dần | Ca mới chỉ viết một kiểu · tách hai tệp kiểm khổng lồ theo vùng · ca kiểm thôi đọc hồ sơ sống (fixture do mã sinh) · tầng kiểm nhanh / kiểm đầy đủ | Sau chặng này mới tách kiểm theo plugin được |

Vì sao chuyển thư mục và đổi tên đi chung một chặng: cả hai làm mọi hồ sơ đang mở phải ghim lại và mọi kho tiêu thụ phải
sửa cài đặt — làm chung thì trả giá một lần.

Giữ tính năng bằng: bộ kiểm hiện có xanh trước và sau · phép vi phân phán quyết cũ so mới trên hồ sơ thật của hai kho
tiêu thụ · mỗi lệnh cũ có bí danh trỏ sang tên mới trong một mốc.

## 5. Việc rà thêm

### 5.1 Hai tệp máy vẽ nằm trong kho — đã có vòng và hạt giống, ở đây chỉ thêm số

Đây **không phải phát hiện mới**. Vòng `tep-sinh-khong-chan-gop` (2.36.0) đã làm lần gộp tại máy không còn dừng ở
`PRODUCT-MAP.md` và `LO-TRINH.html`; phần còn lại đã nằm ở hai hạt giống
`2026-10-16-hat-giong-tep-sinh-xung-dot-moi-lan-goi.md` và `2026-10-30-hat-giong-tep-sinh-mot-hang-mot-dong.md`.

Số thêm vào: từ 01/10 có 530/2 200 commit không-gộp chạm hai tệp này (24 %), 92 commit mang tên «vẽ lại bản đồ». **Sau**
2.36.0 (từ 01/11): 41/159 commit vẫn chạm (26 %), 12 commit «vẽ lại bản đồ»; số lần gộp nhánh chính vào nhánh làm việc
giảm từ 258 trên 225 PR xuống 11 trên 16 PR. Tức bản vá đã giảm lần gộp lại, còn chi phí vẽ lại thì chưa đổi.

Đây là đổi hành vi của một chốt kiểm đang có, không phải dọn dẹp — cần chủ kho gọi tên, đi vòng riêng theo hai hạt giống
trên, không ghép vào bốn chặng.

### 5.2 Sổ «kho tiêu thụ được dựa vào những gì»

Khoá cấu hình kho tiêu thụ khai, giá trị trạng thái hồ sơ, và khoảng 180 cờ lệnh đang lẫn Anh với Việt. **Không đổi tên
cái cũ** — chúng nằm trong hồ sơ đã ký ở các kho tiêu thụ. Sổ ghi rõ cái gì là cam kết với kho tiêu thụ (đổi phải có đường
đọc-cũ) và cái gì là nội bộ (đổi tự do); cái mới đặt tiếng Anh, có bộ kiểm giữ. Là CỘNG nhỏ → chủ kho duyệt.

### 5.3 Tệp luật của kit

`CLAUDE.md` 24 822 ký tự, nạp vào mọi phiên và mọi tác tử con; phần lớn là sử liệu. Đề xuất tách luật (ở lại) khỏi sử
liệu (sang ADR). Là chữ của chủ kho — cắt dòng nào do chủ kho duyệt. Nếu phải cắt bớt đợt này, bỏ việc này trước.

### 5.4 Lớp lỗi lệch phiên bản Node

Đã đốt lượt ít nhất ba lần (25/09 đường nền ở crm lấy Node 22 thay 24 · bộ đo răng đỏ trên 24.21, xanh trên 24.15 · 14/10
tiến trình tách phiên lấy Node 18). Lượt kiểm tự động chạy Node 22, máy làm việc chạy 24. Chưa bộ chạy nào tự kiểm phiên
bản. Tệp ghim phiên bản chỉ là lời dặn; nghiệm đúng tầng là bộ chạy tự xưng và tự so — đã xếp vào chặng 1.

### 5.5 Tách kiểm theo plugin — lợi ít, để sau

54/58 phút là bộ kiểm của plugin lõi. Trong 77 PR gộp từ 20/10: 30 chỉ chạm hồ sơ/tài liệu/bộ kiểm, 38 chạm lõi hoặc vòng
tính năng, 9 chỉ chạm điều phối hoặc sàn thiết kế. Tách theo plugin chỉ giúp nhóm 9 PR (12 %). Chỉ làm dạng hẹp sau chặng
3.

## 6. Đồng bộ với Repo Standards

1. Cùng bố cục kho: mỗi plugin một thư mục, bộ kiểm và công cụ nằm ngoài.
2. Kit chấm được bằng `/repo-setup:doctor`: thêm bên Repo Standards một hồ sơ chuẩn cho loại «kho plugin» (chính Repo
   Standards cũng dùng được).
3. Cùng động từ ở chỗ trùng việc (`ingest`, `health`), README song ngữ.
4. Chia vai: Repo Standards dựng kho, kit lo vòng tính năng và cổng. **Không** bê từ điển miền hay wiki của Repo Standards
   vào kit — kit đã có `CONTEXT.md` và ADR.

## 7. Soi theo luật của kit

- **Thước của North Star mà đợt này chạm:** giờ máy trên mỗi kết quả gộp (lượt kiểm 58 phút) · đoạn ký→gộp (số lượt chạy
  lại) · chi phí nâng bản của kho tiêu thụ (bản cài 100 MB). Đổi tên không làm thước nào nhúc nhích — nó là quyết định
  khẩu vị của chủ kho và là khó-đảo với kho tiêu thụ, nên gom vào đúng một lần gãy.
- **Luật chiều rộng (b):** giữa hai mốc một kho tiêu thụ nhận, tối đa một vòng meta, chỉ khi chủ kho gọi tên → bốn chặng
  là bốn mốc nối tiếp, không chạy song song.
- **Sửa kit cân trên mọi kho:** chặng 2 là chỗ duy nhất mọi kho tiêu thụ trả giá (bật lại plugin, sửa cài đặt, sửa quy
  trình tự động có nhắc tên chợ). Plugin điều phối phải gỡ và cài lại ở từng cây làm việc — chỉ đổi khi không có đợt nào
  đang chạy.
- **Đường đọc-cũ:** tên cũ làm bí danh một mốc; hồ sơ đã ký nhắc tên cũ là lịch sử, không viết lại.
- **TRỪ tự đi, CỘNG cần duyệt:** chặng 1 là TRỪ. Sổ giao diện công khai, lệnh nâng phiên bản, hồ sơ chuẩn «kho plugin» là
  CỘNG.
- **Không làm:** áp bộ định dạng mã hàng loạt · thống nhất kiểu tệp script cho mã cũ · đổi tên khoá cấu hình và trạng thái
  cũ — đụng hàng trăm tệp mà không thước nào nhúc nhích.

## 8. Chưa biết, phải đo trước

- Claude Code có cho loại trừ thư mục khi đóng gói plugin không. Nếu có, giảm dung lượng bản cài làm được ngay ở chặng 1.
- Thời gian từng ca kiểm. Nếu 37 phút dồn vào vài ca chậm thì sửa ca đó có thể lợi hơn chia mảnh.
- Mảnh dài nhất mất bao lâu trên máy của lượt kiểm tự động (con số 15–20 phút là ước lượng).
- Nguồn chợ plugin có theo được chuyển hướng của GitHub sau khi đổi tên kho không.
- Kho tiêu thụ có chịu cùng chi phí vẽ lại hai tệp máy vẽ không.
- Phần phân loại «bộ kiểm chạm plugin nào» dò theo đường dẫn — số xấp xỉ.
- Số đo ở kho tiêu thụ lấy trên bản đang có ở MacBook Pro, có thể cũ hơn nhánh chính của họ.

## 9. Chờ chủ kho

1. Gọi tên vòng cho chặng 1 (hoặc bác).
2. Chốt hẳn tên `delivery-loop` và bảng tên ở mục 3 — quyết ở Cổng Phạm vi của chặng 2.
3. Vòng riêng cho hai tệp máy vẽ (mục 5.1) — có hay không.

## 10. Chạy đợt này trên Cloud thay cho Mac Studio? (tra 11/11, CHƯA thử thật)

Nguồn: tài liệu chính thức của Claude Code về phiên Cloud, tra qua một tác tử nghiên cứu; chưa có phiên thử nào. Tài khoản
đã có một môi trường Cloud («Default»).

| Thứ một vòng kit cần | Trên Cloud | Ghi chú |
|---|---|---|
| Máy Linux, Node 22, Python, git, Chrome không giao diện | Có | Ubuntu 24.04, 4 nhân, 16 GB. Lượt kiểm tự động của kit vốn chạy Linux + Node 22 |
| zsh | Không có sẵn | Cài bằng kịch bản dựng môi trường (chạy quyền root) |
| Bộ kiểm 37 phút | Được, có điều kiện | Lệnh chạy nổi tối đa 10 phút, chạy nền thêm 30 phút; nới bằng biến môi trường hoặc chạy theo mảnh |
| Đẩy nhánh, mở PR | Được | Gộp PR: tài liệu không nói; lệnh `gh pr` bị chặn, gọi API thường thì được |
| **Plugin của kit** (vòng tính năng, lệnh cổng, móc, tác tử chấm) | **Không tự nạp** | Phiên Cloud không cài plugin khai trong cài đặt của kho. Chỉ nạp skill, lệnh, tác tử, móc nằm sẵn trong `.claude/` của kho. Cài plugin bằng kịch bản dựng môi trường: tài liệu không xác nhận |
| **Công cụ chấm nhiều tác tử** (bước chấm S4) | **Chưa rõ** | Trang tài liệu không liệt kê Cloud trong danh sách nơi dùng được |
| Lệnh cổng do người gõ (duyệt, ký) | Không | Là lệnh của plugin → không có khi plugin không nạp. Ký tại máy sau khi kéo nhánh về thì vẫn được |
| Hai kho tiêu thụ riêng tư (phép vi phân cũ so mới) | Chỉ khi gắn vào phiên | Phiên nhiều kho có trong tài liệu, mức chắc chắn trung bình |
| Ghi nhớ dự án, tệp luật riêng của người dùng | Không | Chỉ thấy thứ nằm trong kho |
| Plugin điều phối | Không | Dựa vào công cụ của ứng dụng trên máy; đợt này chạy từng vòng một nên không cần |
| Máy tạm bị thu hồi khi nghỉ lâu | Rủi ro | Tệp chưa commit có thể mất → commit và đẩy thường xuyên |

Kết luận tạm: **phần sửa mã và chạy bộ kiểm chạy được trên Cloud; phần nghi thức của kit (soạn hợp đồng, chấm S4, ký cổng)
thì chưa** — mà kho kit tự chạy cổng của chính nó, PR chạm sản phẩm không có hồ sơ ký sẽ bị cổng chặn. Phần nặng giờ máy
nhất của một vòng lại chính là bước chấm. Hai điểm treo quyết định tất cả: plugin cài được bằng kịch bản dựng môi trường
không, và công cụ chấm nhiều tác tử có trên Cloud không — một phiên thử ngắn, chỉ đọc, trả lời được cả hai.

**Chủ kho quyết 11/11: «Giữ Mac Studio».** Đợt này chạy ở Mac Studio; không mở phiên thử Cloud. Hai điểm treo về Cloud ở
trên để nguyên là chưa biết — chỉ tra lại khi chủ kho gọi.

## 11. Dựng kho MỚI rồi chuyển kit sang, thay cho sửa tại chỗ? (chủ kho hỏi 11/11 — CHỜ quyết)

Số đo thêm: nhánh chính 5 699 commit từ 10/06 · gói lịch sử 63 MB · 495 PR, 32 vấn đề đang mở · 0 sao, 0 nhánh rẽ, 0
người theo dõi. Bộ kiểm 286 tệp, trong đó (dò theo mẫu chữ, xấp xỉ): 40 tệp mang mã commit cứng kèm lệnh lấy bản cũ, 13
tệp hỏi lịch sử git của chính kho kit, 52 tệp nhắc số PR, và khoảng 60 % tệp của bộ kiểm script đọc hồ sơ hay tài liệu
thật của kit. Sản phẩm: 23 tệp nhắc số PR, 40 tệp nhắc ADR.

| | Sửa tại chỗ + đổi tên kho | Kho mới + chuyển sang |
|---|---|---|
| Kho tiêu thụ đang ở bản 2.x | Sống nhờ chuyển hướng của GitHub (chưa kiểm nguồn chợ có theo được không) | Kho cũ để nguyên, không phụ thuộc gì — lối lùi chắc nhất |
| Đường đảo | Lần gãy ở mốc 3.0 không làm nửa chừng được | Kho mới là bản dựng bên cạnh; chưa cắt sang thì không ai bị ảnh hưởng, bỏ cũng không mất gì |
| Trọng lượng | Lịch sử 63 MB + hồ sơ 58 MB vẫn theo mỗi lần sao kho | Kho mới chỉ còn sản phẩm + tài liệu sống |
| Phơi ra công khai | 2 988 tệp hồ sơ + 879 tệp tài liệu nội bộ vẫn công khai, mỗi commit phải rà ẩn danh | Kho mới chỉ công khai sản phẩm; kho cũ có thể chuyển riêng tư sau khi các kho tiêu thụ dời xong |
| Lịch sử, số PR, vấn đề | Giữ nguyên | Số PR đánh lại từ đầu; 32 vấn đề mở phải dời hoặc đóng; lịch sử chỉ mang sang được phần sản phẩm (mã commit đổi) |
| Bộ kiểm | Chạy như cũ | Các ca bám mã commit, lịch sử và hồ sơ sống sẽ đỏ → phải xử trước khi cắt sang |
| Hai kho cùng sống | Không có | Có, trong lúc chuyển — rủi ro «sửa hai lần» mà kit từng trả giá (ADR 0008, 0009) |

**Khuyến nghị: kho mới, với ba điều kiện.**
1. **Chuyển nhà là một KỊCH BẢN chạy lại được**, không phải việc làm tay một lần: lấy nhánh chính kho cũ → sinh cây kho
   mới (bố cục `plugins/<tên>/`, tên mới, tài liệu sống). Kho cũ vẫn là nguồn duy nhất cho tới ngày cắt; mỗi lần kho cũ
   đổi thì chạy lại kịch bản — không có giai đoạn nào hai kho cùng nhận sửa tay.
2. **Ngày cắt sang là MỘT sự kiện** (mốc 3.0): chỉ cắt khi bộ kiểm xanh ở kho mới và phép vi phân phán quyết trên hồ sơ
   thật của hai kho tiêu thụ không đổi. Sau ngày cắt, kho cũ đóng băng ở 2.38.x, chỉ đọc.
3. **Luật dừng:** quá hạn do chủ kho đặt mà chưa cắt được thì bỏ kho mới, quay về sửa tại chỗ — kho tiêu thụ không mất gì.

**Tài liệu — không chép hết sang.**
- *Sang kho mới:* README song ngữ, GUIDE, QUICKSTART, `CONTEXT.md`, tệp luật của kit (bản đã tách sử liệu), 28 ADR, 28
  tài liệu tham chiếu, các bản neo mà tệp luật trỏ tới, nhật ký thay đổi từ 3.0.
- *Ở lại kho cũ làm lưu trữ:* 275 hồ sơ vòng, sổ làm việc (kế hoạch, bản thảo, khảo sát, bàn giao), nhật ký 2.x. Kho mới
  trỏ sang bằng đường dẫn đầy đủ. Việc 4 của mục 5 («sổ làm việc sang kho tri thức») được giải luôn ở đây.
- *Phải rà một lượt:* 206 hạt giống — cái nào còn sống thì mang sang, gốc trỏ về kho cũ.
- Kho mới bắt đầu với thư mục hồ sơ trống: vòng đầu tiên của kit ở kho mới chính là ca «kho trống» mà khuôn giao cho kho
  tiêu thụ phải chạy được.

**Thay đổi so với bốn chặng ở mục 4:** chặng 1 giữ nguyên, làm ở kho cũ (thứ nó sửa đi theo sang kho mới). Chặng 2 đổi
thành «viết kịch bản chuyển nhà + cắt sang». Phần bộ kiểm bám hồ sơ sống và mã commit (vốn ở chặng 3) phải kéo lên trước
ngày cắt — cách rẻ: kịch bản chép một bản chụp đóng băng các hồ sơ bộ kiểm cần vào thư mục dữ liệu kiểm; tách hẳn làm sau.

**Chưa biết:** bao nhiêu ca kiểm thật sự đỏ ở kho mới (số trên là dò mẫu chữ) · các ca bám mã commit có đổi được sang bản
đồ mã commit mới không · `/repo-setup:new` chưa có khuôn cho kho plugin, nên hồ sơ chuẩn «kho plugin» bên Repo Standards
phải có trước — kho mới sẽ là kho đầu tiên dựng bằng khuôn đó.

## 12. Kế hoạch thực hiện (chủ kho CHỐT 11/11: kho mới + kịch bản chuyển nhà)

Mục này thay bảng bốn chặng ở mục 4. Vì kho cũ sống nguyên, **không cần giữ tên cũ làm bí danh** nữa: ai còn ở chợ cũ thì
vẫn gõ tên cũ, sang chợ mới thì dùng tên mới.

Ước theo luật giờ máy của kit (T2 4–7 giờ · T3 7–10 giờ · gộp +1–1,5 · cắt bản 1,5–2 · ×1,3 khi chạm kho khác). **Ngày
chưa tính** — chưa biết hàng chờ của Mac Studio. **Token chưa ước** — chưa có vòng cùng loại để lấy số; ghi thật từng vòng.

### Việc của người (không phải vòng, khoảng 15 phút)

- Bật quét bí mật + chặn đẩy bí mật, bật tự xoá nhánh sau gộp ở kho cũ.
- Tạo kho trống `delivery-loop`, để **riêng tư** cho tới ngày cắt; khoá nhánh chính như kho cũ.
- Đặt hạn dừng cho đợt chuyển nhà (đề xuất: 21 ngày kể từ lúc vòng B1 mở, theo tiền lệ vòng Khuôn lõi).

### Dãy A — kho cũ, Mac Studio: mốc 2.39 «Nhẹ đi»

| Vòng | Kết quả | Thước | Ước |
|---|---|---|---|
| A1 `luot-kiem-nhe` (T2) — **XONG 12/11**, PR #499, chạy ở MacBook Pro | Lượt kiểm tự động chạy mảnh song song, giữ một lượt chạy trọn trên nhánh chính; bộ chạy tự xưng và tự so phiên bản Node; có số đo từng ca kiểm | Lượt kiểm 58 phút → số đo thật; ca đỏ khi lệch Node, im khi khớp | 4–7 giờ máy |
| Mốc 2.39 (làn V) | Mang thêm phần chỉ-bớt: mô tả plugin còn một hai câu, xoá 2 tệp thừa, thêm `.env` vào danh sách bỏ qua | Một kho tiêu thụ cài 2.39 | 1,5–2 giờ + kho nhận 1–2 giờ |

`2.39: ~8–12 giờ máy · token chưa ước · bắt đầu khi Mac Studio rảnh khoá chấm`

### Dãy R — kho Repo Standards, chạy song song (MacBook Pro làm được)

| Việc | Kết quả | Ước |
|---|---|---|
| R1 hồ sơ chuẩn «kho plugin» | `/repo-setup:doctor` chấm đúng loại kho plugin; có khuôn dựng kho plugin mới (bố cục `plugins/<tên>/`, lệnh nâng phiên bản, lượt kiểm, README song ngữ). Repo Standards tự chấm bằng chính hồ sơ này | 3–5 giờ máy (ngoài bộ số hiệu chuẩn của kit) |

Không phải vòng của kit nên không tính vào luật chiều rộng (b). Phải xong trước B1.

### Dãy B — kho mới, Mac Studio: mốc 3.0 «Chuyển nhà»

| Vòng | Kết quả | Thước | Ước |
|---|---|---|---|
| B0 đo thử (không phải vòng) | Biết bao nhiêu ca kiểm đỏ khi thiếu hồ sơ, sổ làm việc và lịch sử của kho cũ | Số ca đỏ theo ba lớp, có bản đối chứng nguyên vẹn | 2–3 giờ máy, máy nào cũng chạy được |
| B1 `kich-ban-chuyen-nha` (T3) | Một kịch bản lấy nhánh chính kho cũ → sinh cây kho mới: bố cục mới, tên mới theo mục 3, tài liệu sống, con trỏ sang kho cũ bằng đường dẫn đầy đủ | Chạy hai lần ra cùng một cây; mọi tệp sản phẩm của kho cũ có đúng một chỗ ở kho mới hoặc nằm trong danh sách bỏ có lý do | 7–10 giờ máy |
| B2 `bo-kiem-xanh-o-kho-moi` (T2, có thể tách hai) | Bộ kiểm xanh trên cây do kịch bản sinh: bản chụp đóng băng các hồ sơ bộ kiểm cần, xử các ca bám mã commit và lịch sử | Bộ kiểm xanh ở kho mới; cùng ca ấy vẫn xanh ở kho cũ | 4–14 giờ máy (rộng vì chưa có số B0) |
| B3 cắt sang (mốc 3.0) | Phép vi phân phán quyết cũ so mới trên hồ sơ thật của hai kho tiêu thụ không đổi; một kho tiêu thụ chuyển sang chợ mới trên cây làm việc riêng rồi gộp; kho cũ đóng băng 2.38.x | 0 phán quyết đổi; một kho đã cài 3.0 | 4–6 giờ máy |

`3.0: ~15–30 giờ máy · token chưa ước · bắt đầu sau 2.39 và R1`

Kịch bản chuyển nhà đặt ở kho mới, trong thư mục công cụ (không phải sản phẩm), để sửa nó không phải đi qua lượt kiểm 58
phút của kho cũ và không bị chép sang kho tiêu thụ.

Kho nhận đầu tiên: **Quỹ hàng** (168 hồ sơ, không có đợt điều phối đang chạy, đã bật đủ sáu plugin); crm sau.

### Dãy C — sau ngày cắt, kho mới: «Bộ kiểm mạch lạc»

Chưa cắt lượt. Gồm: ca mới chỉ viết một kiểu · tách hai tệp kiểm khổng lồ · dữ liệu kiểm do mã sinh thay bản chụp · rồi mới
tách kiểm theo plugin. Mỗi vòng gắn một mốc kho tiêu thụ cài, mở khi chủ kho gọi tên.

### Ba điều chủ kho quyết ở cổng đã có (không thêm lượt gọi)

1. **Ngoại lệ luật chiều rộng (b)** cho dãy B: B1 và B2 là hai (có thể ba) vòng meta giữa mốc 2.39 và mốc 3.0, trong khi
   luật cho một. Quyết ở Cổng Phạm vi của B1, kèm hạn dừng.
2. **Chốt hẳn bảng tên** (mục 3) — ở Cổng Phạm vi của B1, vì kịch bản mang bảng tên đó.
3. **Ngày cắt sang** — chữ ký mốc 3.0.

### Ngân sách gọi người

A1: tối đa 3 · mốc 2.39: 1 · B1 (T3): tối đa 4 · B2: tối đa 3 mỗi vòng · mốc 3.0: 1. Tổng 12–15 lượt, mỗi lượt một chạm.

### Rủi ro và lưới

- B2 phình: nếu B0 cho thấy hơn một phần ba số ca đỏ → dừng, trình chủ kho trước khi mở B1.
- Hai kho cùng nhận sửa tay: cấm; kho mới chỉ nhận sửa ở thư mục công cụ cho tới ngày cắt.
- Quá hạn dừng mà chưa cắt: bỏ kho mới, quay về sửa tại chỗ — kho tiêu thụ không mất gì.

## 13. Kết quả đo thử B0 (11/11, chạy trên MacBook Pro)

Ba bản sao của `be736814`, chạy đúng sáu bước của việc «tests» trong lượt kiểm tự động, song song, mỗi bản một thư mục tạm
riêng: **A** nguyên vẹn (đủ lịch sử, đối chứng) · **B** cùng nội dung, chỉ một commit · **C** như B, bỏ thêm 275 hồ sơ vòng
và năm thư mục sổ làm việc (`docs/plans`, `superpowers`, `findings`, `handoff`, `research`). Máy: Node 24, tải nền 6–11.
Kịch bản đo: `migration/b0/`. Nhật ký đầy đủ nằm ở thư mục tạm của phiên đã đo, không vào kho.

| | A (đối chứng) | B (bỏ lịch sử) | C (bỏ thêm hồ sơ và sổ) |
|---|---|---|---|
| Khoá ca đỏ, trên khoảng 4 300 khoá ca | 2 | +329 | +329 +86 |
| Tỉ lệ đỏ thêm | — | 8 % | 10 % |
| Bước kiểm bản đồ sản phẩm | xanh | xanh | đỏ (hai tệp máy vẽ lệch khi bỏ hồ sơ) |
| Phút: bộ kiểm script / bộ kiểm plugin | 53 / 16 | 43 / 3 | 32 / 3 |

- **Dưới ngưỡng dừng** một phần ba ở mục 12 — B1 mở được.
- **Hai ca đỏ ở A không do Node:** `MC-11` và tệp chứa nó đọc lộ trình thật của kit, đỏ từ khi mốc 05/11 qua — giới hạn đã
  khai ở nhật ký thay đổi (Ngoài-9). Lần đo này không thấy ca nào đỏ vì Node 24 so với 22.
- **Nguyên nhân chính là LỊCH SỬ, không phải hồ sơ:** 329 / 415 ca đỏ thêm (79 %) là ca dựng «bản gốc» từ một mã commit
  hay thẻ cũ để so trước/sau (`git archive <mã> …`, `git show <mã>:…`, thẻ `v2.24.0`) — đúng nếp «bản base lấy trọn thư mục»
  của kit. Đọc mẫu ở cả bốn bộ: lỗi đều là «not a valid object name» hay «not a tree object». Thiếu hồ sơ và sổ làm việc chỉ
  thêm 86 ca (đọc corpus báo cáo thật, hồ sơ thật, bản đồ).
- **Chỗ tốn giờ của lượt kiểm:** bỏ lịch sử thì bộ kiểm plugin từ 16 xuống 3 phút, bộ script giảm khoảng một phần năm — tức
  phần lớn thời gian bộ kiểm plugin nằm ở các ca dựng lại bản cũ từ lịch sử. Đầu vào trực tiếp cho vòng A1.
- Nhiễu đã biết: hai tệp `s4-args.json` có ở A mà không ở B (bị loại khi xuất bản sao) — không thấy ca nào đỏ vì chúng; 62
  khoá đỏ ở B mà không thấy ở C (có thể ca không chạy tới ở C, hoặc khoá lệch do cách chuẩn hoá) — không đổi kết luận.

**Đổi một điểm của mục 11 và 12 — kho mới MANG lịch sử kho cũ (chủ kho CHỐT 11/11 «Mang lịch sử sang»):** khởi kho `delivery-loop` bằng trọn lịch sử và thẻ của kho
cũ, rồi kịch bản chuyển nhà sinh các commit dọn nhà **lên trên** nhánh chính kho cũ. Khi đó mọi mã commit và thẻ cũ còn
nguyên, 329 ca trên hết lý do đỏ, và B2 chỉ còn phần hồ sơ (86 ca) cộng phần đổi bố cục. Không làm bản cài nặng thêm: bản
cài plugin không mang thư mục lịch sử (đã kiểm ở bản 2.38.1); chỉ bản sao chợ trên mỗi máy mang khoảng 20 MB lịch sử.
Đổi lại: kho mới không «sạch» về lịch sử, và lịch sử chứa các hồ sơ cũ — nhưng hồ sơ đó vốn đã công khai ở kho cũ.

**Chưa đo, B1 phải đo:** chuyển sản phẩm vào `plugins/<tên>/` sẽ làm đỏ bao nhiêu ca — các ca dựng bản cũ theo đường dẫn
cũ (`scripts lib skills`) rồi so với cây hiện tại theo đường dẫn mới. Lần đo này giữ nguyên bố cục nên chưa thấy lớp này.

### Mục 11 và 12 sau khi chốt mang lịch sử

- *Mục 11, hàng «Lịch sử, số PR, vấn đề»:* lịch sử, mã commit và thẻ giữ nguyên ở kho mới; chỉ số PR đánh lại từ đầu và 32
  vấn đề mở phải dời hoặc đóng. Hàng «Trọng lượng» chỉ còn đúng cho cây (bản cài), không còn đúng cho lịch sử.
- *Mục 12, B1:* kịch bản chuyển nhà lấy nhánh chính kho cũ, sinh commit dọn nhà lên trên, rồi đẩy sang kho mới; chạy lại
  mỗi khi kho cũ đổi bằng cách dựng lại commit dọn nhà trên nhánh chính mới nhất (không sửa tay ở kho mới). Thước «chạy hai
  lần ra cùng một cây» giữ nguyên.
- *Mục 12, B2:* phạm vi thu về 86 ca do thiếu hồ sơ và sổ, cộng lớp đỏ do đổi bố cục mà B1 đo — ước giờ máy sẽ thu hẹp sau
  B1, không còn 4–14 giờ.
- *Việc của người:* tạo kho `delivery-loop` rồi đẩy trọn lịch sử và thẻ kho cũ sang (lệnh soạn sẵn ở B1), thay cho kho trống.

## 14. Dùng plugin `repo-setup` của Repo Standards để dựng kho này? (chủ kho hỏi 11/11 — đã thử không ghi)

Chủ kho gọi `/repo-setup:new` với ý «dựng bằng plugin mới chuẩn từ đầu». Đã chạy bước dò và một lượt thử không ghi trên
bản kéo về ở thư mục tạm (plugin `repo-setup` tại `repo-standards@94efb84`):

- **Lệnh `new` không áp cho kho này:** nó dành cho thư mục trống; kho đã có mã nên plugin tự chuyển sang lệnh `adopt`
  (tiếp nhận kho đã có).
- **Plugin chưa có khuôn cho kho plugin.** Bộ dò không nhận ra loại kho (`suggested_preset: null`); năm khuôn hiện có đều
  là ứng dụng (TypeScript trên Node, API TypeScript, React, Python, FastAPI); hai kiểu kiến trúc là khối liền chia mô-đun
  và API. Không chạy riêng được phần lõi chung (`_core`).
- **Thử khuôn gần nhất (`ts-node`, chế độ tiếp nhận, mức một người):** plugin sẽ thêm 32 tệp, trộn dòng vào 2 tệp, bỏ qua
  5, để nguyên 4 tệp trùng (`CLAUDE.md`, `README.md`, `LICENSE`, `.claude/settings.json`).
  - *Hợp với kit:* `.editorconfig`, `.nvmrc`, `Makefile` (phải viết lại đích cho bộ kiểm của kit), dòng thêm vào
    `.gitignore` và `.gitattributes`.
  - *Không hợp:* `package.json`, `tsconfig*.json`, `eslint.config.js`, `.prettierrc.json` ở gốc kho (biến kit thành một
    gói TypeScript, trong khi mã kit không phụ thuộc gói ngoài); thư mục `ontology/` và `wiki/` cùng năm skill wiki trong
    `.claude/skills/` và bốn công cụ Python (trùng vai với `CONTEXT.md`, ADR và plugin tri thức của kit); `.env.example`.
- **Kết luận:** ý của chủ kho đúng, và nó chính là dãy R đã có trong mục 12 — phải làm khuôn «kho plugin» bên Repo
  Standards TRƯỚC, rồi mới áp vào kho này. Áp khuôn hiện có sẽ thêm khoảng hai phần ba số tệp sai loại.
- **Cách áp khi đã có khuôn:** `apply.py` là đường duy nhất plugin tạo tệp, chạy lại được và không ghi đè — nên nó thành
  MỘT BƯỚC của kịch bản chuyển nhà (B1), không làm tay trên nhánh `chuyen-nha`.

**Phạm vi R1 rút từ lượt thử** (đề xuất, chủ kho duyệt khi mở R1): một khuôn mới cho loại kho «chợ plugin Claude Code» gồm
bố cục `plugins/<tên>/` + tệp khai chợ, lệnh nâng phiên bản một chạm, lượt kiểm tự động có bước kiểm tệp khai plugin, tệp
ghim Node, `Makefile` với các đích chung, README song ngữ; lớp từ điển miền và wiki ở trạng thái «không áp» cho loại kho
này; và một hồ sơ chấm riêng cho `/repo-setup:doctor` (phiên bản các plugin khớp nhau, mô tả plugin ngắn, nguồn plugin
không phải cả kho, dung lượng bản cài). Chính kho Repo Standards là kho đầu tiên chấm bằng hồ sơ đó; `delivery-loop` là kho
thứ hai.
