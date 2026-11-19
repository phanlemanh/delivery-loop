# Chuyển nhà giai đoạn 2 — kế hoạch đề xuất

> **Trạng thái:** ĐỀ XUẤT của phiên giữ đợt, viết 19/11/2026, **chưa ai duyệt**. Chủ kho đặt tên giai đoạn («chuyển nhà
> giai đoạn 2») và bảo rà soát, phân tích, đề xuất kế hoạch; mọi thứ còn lại trong tệp này là chữ của máy.
> Giai đoạn 1 = `KE-HOACH.md` mục 12 tới ngày cắt 18/11 (thẻ `v3.0.0`, `c16d25db`). Đang ở đâu: `TRANG-THAI.md`.
> Tệp này công khai: không chép chi tiết nội bộ của kho riêng tư vào đây.

## 0. Thẻ một phút

- **Giai đoạn 1 để lại gì:** kit 3.0 đã ở kho mới và một kho tiêu thụ đã cài. Bản cài 102 MB → 7,8 MB, lượt kiểm PR 58 → 7
  phút, 0 phán quyết đổi trên 538 hồ sơ. Nhưng **chưa có kết quả nào theo North Star**: chưa vòng sản phẩm nào gộp trên
  kit 3.0, ngưỡng thực tế 0/3 vế, hai kho còn kéo kit từ kho cũ, chín mục của kế hoạch gốc chưa đạt.
- **Giai đoạn 2 làm gì:** đóng mốc 3.0 bằng thực tế · đưa hai kho còn lại sang chợ mới rồi lưu trữ kho cũ · dọn kho mới
  bằng việc không chạm engine · cho mỗi mục treo một kết cục (làm, xếp hạt giống có ngưỡng, hoặc bỏ có lý do).
- **Giai đoạn 2 KHÔNG làm gì:** không mở vòng meta nào, không đổi hành vi kit, không cắt mốc mới. Sáu gói DL1–DL6 và dãy
  «Bộ kiểm mạch lạc» đứng ngoài, xếp hàng sau.
- **Xin chủ kho:** một lượt duyệt cho năm điều ở mục 8 (A1–A5). Máy đi phần còn lại theo khuyến nghị, chủ kho veto được.
- **Hạn dừng đề xuất:** 19/12/2026. **Trần gọi người đề xuất:** 15 lượt cho cả giai đoạn, mỗi lượt một chạm.

## 1. Rà soát — số đo 19/11

Đo lại hôm nay bằng `git` và `gh`, trừ chỗ ghi «lời phiên khác».

| Thứ | Hôm nay |
|---|---|
| Kho mới | công khai · nhánh chính `c1cf031a` · thẻ `v3.0.0` · 0 PR mở, 0 vấn đề · 5 nhánh · 0 bản phát hành trên GitHub · tự xoá nhánh sau gộp TẮT · tiêu đề README còn là tên kit cũ · `.repo-setup.json` ghi 0.5.0 (Repo Standards nay 0.9.0) |
| Kho cũ | công khai, chưa lưu trữ · README đã chỉ đường (`9aafbf4d`) · 5 PR mở (#377, #389, #396, #417, #418) · 26 vấn đề mở · 271 nhánh · tự xoá nhánh TẮT |
| Inventory (kho nhận đầu tiên) | commit cài `47d52b06` (18/11 20:59), cửa sổ quan sát tới 02/12 · nhánh chính `c79189dd` · phiên thật nạp đúng sáu plugin 3.0.0, 0 plugin chợ cũ (đo 06:05 19/11, Mac Studio) · hồ sơ đang mở trên nhánh chính: 0 · **vòng sản phẩm mở sau commit cài: 0** |
| Quỹ hàng | kéo kit từ kho cũ ở `v2.39.0` · đã diễn tập chuyển 17/11 (lời B3: 4 tệp 13 dòng phía CI, một hồ sơ phải ghim lại; 0 lệch phán quyết trên 172 hồ sơ) |
| crm | kéo kit từ kho cũ · 0 lệch phán quyết trên 366 hồ sơ (lời B3) · **hôm nay chưa đọc được nó ghim bản nào** |
| Repo Standards | plugin `repo-setup` 0.9.0 · 4 tệp còn nhắc tên kit cũ (hai README, README của plugin, `tests/run.sh`) |
| Ngưỡng thực tế | vế 1: 0 vòng · vế 2: chưa có số nền trên Inventory · vế 3: chờ sau 02/12 |

Chi phí giai đoạn 1 ở ba khoản đếm được (các vòng A1, mốc 2.39, B1, B2 chưa cộng):

| Khoản | Gọi người | Ghi chú |
|---|---|---|
| Mốc 3.0 (B3) | 5 tới chữ ký + 4 ở Chặng 1 | sáu lượt dài 70–98 phút, phần lớn là ghim lại (lời B3) |
| Vòng cài ở Inventory | 12 (trần T3 là 4) | năm lượt chấm, bốn lượt đỏ không vì vật; ký → gộp 3 giờ 33 phút |
| Vòng tắt plugin chợ cũ | trong trần 4 | ký → gộp 37 phút |

Kế hoạch gốc cho cả đợt 12–15 lượt; riêng ba khoản trên đã khoảng 25.

## 2. Phân tích

1. **Giá trị đã tới tay kho tiêu thụ, kết quả thì chưa.** Hai PR đã gộp qua ô `gate` của kit 3.0 ở Inventory đều là việc
   dọn (tắt plugin cũ, nâng `repo-setup`); theo cách đọc của phiên giữ đợt không cái nào tính cho vế 1. Đợt chỉ đóng được
   khi một vòng sản phẩm thật đi hết các cổng trên 3.0 — việc đó do chủ kho mở, kit không tự tạo ra được.
2. **Chi phí giai đoạn 1 dồn ở đoạn cắt sang và cài, không ở đoạn dựng.** Ba lớp lặp lại:
   (a) đường theo bố cục cũ viết cứng — ba chỗ ở làn ghim lại, hai bộ kiểm thiết kế, sáu ca dựng bản base, ba glob hạng
   T3; mỗi lần lộ một chỗ là một lượt dài;
   (b) thước soi tệp cài đặt mà không soi cái một phiên thật nạp — nên hai engine cùng bật lọt qua vòng cài;
   (c) phép đo chép tay danh sách và đường nền đỏ sẵn tại máy — bốn lượt chấm đỏ không vì vật.
   Cả ba đều tránh được ở kho kế bằng cách **đo trước Cổng Phạm vi**: diễn tập ô `gate` trên bản sửa, phép thử phiên thật
   trước và sau, chạy bộ kiểm của kho trên cây chưa sửa.
3. **Hai chợ cùng sống là rủi ro đã đo, không phải giả định.** 21:30 18/11 một phiên ở Inventory nạp cả hai bản của ba
   plugin. Chừng nào còn kho kéo kit từ kho cũ và máy còn bật plugin cũ ở mức người dùng, lớp này còn. Kế hoạch gốc để crm
   ngoài điều kiện đóng đợt; giai đoạn 2 nên đưa nó vào, vì «chuyển nhà xong» mà còn hai nguồn thì chi phí hai nguồn ở lại.
4. **Chín mục chưa đạt không cùng một loại.** Sau ngày cắt, bản cài chỉ còn thư mục plugin, nên kho tiêu thụ không còn trả
   giá cho hồ sơ vòng và sổ làm việc nằm trong kho kit; người hưởng của việc dời chúng chỉ còn là người sửa kit. Lượt kiểm
   PR đã còn 7 phút, nên lý do gốc của dãy «Bộ kiểm mạch lạc» yếu đi; chỗ còn đau đo được là làn ghim lại 70–98 phút chạy
   nối đuôi — một đích khác với dãy ấy đã viết. Xếp lại từng mục theo người hưởng ở mục 5.
5. **Luật chiều rộng (b) chặn sẵn phần lớn việc dọn chạm engine.** Mốc 3.0 đã được một kho nhận; trước mốc kế chỉ được một
   vòng meta, do chủ kho gọi tên. Hạt giống `hat-giong-sau-goi-dl-ba-kho.md` đã đề xuất suất ấy cho DL1 + bản vá P179, là
   việc có số đo ở kho tiêu thụ. Vì vậy giai đoạn 2 chỉ dùng hai loại việc không tốn suất: PR hạng T1 (tài liệu) và cài
   đặt kho.
6. **Lượt gọi người vượt vì câu hỏi lặp, không vì cổng.** Phần vượt nằm ở các lần xin chạy lượt dài, xin gộp, và lời duyệt
   gõ nhầm phiên. Nghiệm đúng tầng là xin quyền lặp MỘT lần ở đầu giai đoạn (mục 8, A3) và nhắc nơi gõ ngay trong lời mời.

## 3. Định nghĩa «xong» của giai đoạn 2

| # | Điều kiện | Hôm nay → đích |
|---|---|---|
| D1 | Ba vế ngưỡng thực tế của mốc 3.0 đạt ở Inventory | 0/3 → 3/3 |
| D2 | Không kho tiêu thụ nào còn kéo kit từ kho cũ | 2 kho → 0 |
| D3 | Kho cũ lưu trữ (đảo được bằng bỏ lưu trữ; thẻ cũ vẫn kéo được) | chưa → rồi |
| D4 | Mỗi mục treo có một kết cục: làm xong, hạt giống có ngưỡng, hoặc bỏ có lý do | 9 mục treo → 0 |
| D5 | Sổ của đợt nằm trên nhánh chính; nhánh `chuyen-nha` và tệp luật của đợt đã gỡ | chưa → rồi |

D1 là điều kiện tối thiểu: quá hạn dừng mà D2–D5 chưa đủ thì phần thiếu thành hạt giống, đợt vẫn đóng được nếu D1 đạt.

## 4. Năm chặng

Thứ tự phụ thuộc: II.0 trước mọi thứ · II.1 và II.3 chạy song song · II.2 mở sau vế 1 của II.1 · II.4 sau cùng.

| Chặng | Việc | Thước | Ai làm · mở khi |
|---|---|---|---|
| **II.0 Dựng nền** — không đổi kit, khoảng 1–2 giờ máy | (1) Viết lại `.claude/rules/chuyen-nha.md` cho giai đoạn 2: tệp đang dặn hai điều đã sai từ 18/11 («`main` là bản sao kho cũ», «sản phẩm chỉ sửa ở kho cũ»). (2) Đo số nền năm dòng của Inventory trên cửa sổ bảy ngày trước commit cài (11–18/11) và ghi ngưỡng vế 2 **trước** khi vòng thật đầu tiên ký. (3) Phép thử phiên thật ở mọi máy làm vòng tại Inventory (Mac Studio đã đo; MacBook Pro chưa). (4) Đọc 5 PR và 26 vấn đề kho cũ, soạn bảng kết cục từng cái. (5) Đọc crm ghim bản nào và có đợt điều phối nào đang chạy; đọc ba giới hạn phiên Design Assembly chuyển sang. (6) Dựng công cụ kiểm chuyển kho ở `migration/chuyen-kho/` (xem dưới bảng) | Có số nền ghi trước, có bảng 1.9, mọi máy làm vòng nạp đúng sáu plugin 3.0, công cụ kiểm đỏ và xanh đúng trên lịch sử Inventory | phiên giữ đợt · ngay sau khi kế hoạch được duyệt |
| **II.1 Đóng mốc 3.0** | Vế 1: chủ kho mở vòng sản phẩm kế ở Inventory như thường; lúc vòng mở, phiên giữ đợt chạy phép thử phiên thật trên cây làm việc của vòng (0 token); lúc gộp, kiểm `ci.yml` kéo `delivery-loop` ở `v3.0.x` và lệnh đếm của plugin điều phối thấy commit gộp mang chữ ký. Vế 2: đặt năm dòng số của vòng ấy cạnh số nền II.0. Vế 3: chủ kho ghi quan sát lên hồ sơ `release-3-0-0` sau 02/12 | 3/3 vế · 0 lượt gọi người ngoài thiết kế quy về kit · 0 lượt chấm bị hạ tầng kit đốt | chủ kho mở vòng; máy đo · vế 3 không sớm hơn 02/12 |
| **II.2 Hai kho còn lại sang 3.0** | Quỹ hàng trước, crm sau; mỗi kho MỘT vòng, MỘT PR gồm: phía CI · phía phiên · sáu dòng tắt đích danh plugin chợ cũ · quét tên lệnh cũ trong tệp sống · ghim lại hồ sơ cần. Trước Cổng Phạm vi máy đã đo: công cụ kiểm chuyển kho (chế độ kiểm, rồi chế độ soạn để có bản vá phần chung), ô `gate` trên bản sửa, bộ kiểm của kho trên cây chưa sửa. Sau gộp chạy lại chế độ kiểm trên nhánh chính. Cài chợ mới lên máy trước khi gộp. Mốc cài là `v3.0.0` — không ghép chuyển chợ với đổi hành vi | Mỗi vòng ≤ 4 lượt gọi (đích 3) · 0 lượt chấm đỏ không vì vật · phiên thật nạp đúng sáu plugin 3.0, 0 plugin chợ cũ · 0 phán quyết đổi | phiên riêng tại từng kho · sau vế 1 · kho ấy không có vòng hay đợt điều phối đang chạy |
| **II.3 Dọn kho mới** — không chạm engine | (a) README: sửa tiêu đề, thêm bản tiếng Việt. (b) GUIDE và QUICKSTART: thêm bước «tắt đích danh plugin chợ cũ» vào hướng dẫn nâng lên 3.0. (c) Bản phát hành GitHub cho `v3.0.0`, từ nay mỗi thẻ một bản; không làm bù 32 thẻ cũ. (d) Bật tự xoá nhánh sau gộp ở kho mới; xoá ba nhánh `claude/b*` sau khi kiểm đã gộp. (e) Bước 1.9: chuyển 26 vấn đề sang kho mới, 5 PR theo bảng II.0. (f) Repo Standards nửa (b): một PR ở kho ấy cho 4 tệp còn nhắc tên cũ. (g) Chạy `/repo-setup:doctor` chỉ đọc; nâng `.repo-setup.json` chỉ khi điểm cho thấy có lợi | Mỗi PR: CI xanh, các ca đọc README (P28, P101, P132) đạt · kho cũ: 0 PR mở, 0 vấn đề mở | phiên giữ đợt (a–e, g), phiên riêng ở Repo Standards (f) · song song II.1 |
| **II.4 Đóng đợt** | PR đóng: đưa sổ `migration/` của nhánh `chuyen-nha` vào nhánh chính, gỡ tệp luật của đợt, hồ sơ mốc ghi năm dòng số và dòng hiệu chuẩn, hạt giống về `docs/plans/`. Lưu trữ kho cũ. Quyết khối bọc Node 24 ở máy. Xoá nhánh `chuyen-nha` | D1–D5 | chủ kho bảo · lưu trữ kho cũ khi: D2 đạt, 7 ngày sau kho cuối chuyển, bước 1.9 xong, máy đã gỡ chợ cũ ở mức người dùng |

Ngưỡng vế 2, giữ công thức của `KE-HOACH.md` mục 12 và đổi mẫu sang Inventory: lượt gọi người mỗi vòng ≤ trần thiết kế ·
làm-xong → ký và ký → gộp không vượt 1,5 lần trung vị nền; sàn của ký → gộp là một lượt CI trọn của kho ấy (đang khoảng 40
phút) · token và phút máy chỉ đọc, không làm đỏ. Vượt thì ghi nguyên nhân; nguyên nhân thuộc kit mới thì vế đỏ.

**Công cụ kiểm chuyển kho (chủ kho thêm 19/11, «Thêm vào kế hoạch»).** Lý do: cài chợ `delivery-loop` không tự chuyển một
kho đang dùng kit cũ — nó chỉ thêm sáu plugin mới cạnh plugin cũ, và kit 3.0 chưa có công cụ hay mục hướng dẫn chuyển nào
(đọc nhánh chính `c1cf031a`). Ở Inventory phần sửa chỉ 6 tệp; chỗ tốn là đo sai và đo thiếu, nên công cụ **kiểm là chính,
sửa là phụ**. Nó ở `migration/`, không thành lệnh của plugin: chỉ hai kho còn cần, và thêm vào engine thì mọi kho về sau
mang theo một lệnh dùng một lần.

- **Một lệnh, chạy từ bản kéo của kit, trỏ vào đường dẫn kho tiêu thụ.** Dùng lại `chay-thu-phien/` và `bang-ten.json`.
- **Chế độ kiểm (mặc định, chỉ đọc)** báo đạt hay chưa cho từng điểm: tệp cài đặt của kho (chợ mới, sáu dòng bật, sáu dòng
  tắt đích danh plugin chợ cũ) · lượt kiểm tự động (kho nguồn, thẻ, gốc plugin lõi) · tệp trợ giúp tìm kit đọc khoá mới ·
  tệp sống còn nhắc 14 tên cũ · phép thử phiên thật: phiên mở ở kho nạp đúng sáu plugin 3.0, 0 plugin chợ cũ (0 token).
- **Chế độ soạn** in bản vá đề xuất cho phần chung, không tự ghi vào kho. Tệp trợ giúp và workflow riêng của từng kho thì
  chỉ nêu chỗ, người hoặc vòng sửa.
- **Hai chiều, phá thử trước khi tin**, bằng lịch sử thật của Inventory: đỏ ở cây trước commit cài `47d52b06`, ở chính
  `47d52b06` chỉ còn đỏ đúng điểm «thiếu sáu dòng tắt», xanh ở `f6c47332`; sửa tài liệu hay hồ sơ vòng của kho thì im.
  Điểm phép thử phiên thật phụ thuộc cài đặt của máy đang chạy, nên báo cáo ghi rõ nó đo trên máy nào.
- **Giới hạn đã khai:** không cài chợ lên máy, không đụng cài đặt mức người dùng, không tạo hồ sơ nghiệm thu mà ô `gate`
  đòi, không ghim lại hồ sơ — bốn việc ấy vẫn là của vòng và của chủ kho.
- **Ngưỡng đưa vào plugin:** có kho thứ ba cần chuyển từ chợ cũ. Tới đó nó vẫn là công cụ của đợt.

## 5. Kết cục cho từng mục treo

| Mục chưa đạt | Người hưởng hôm nay | Kết cục đề xuất |
|---|---|---|
| Đóng đợt (ngưỡng thực tế 0/3) | kho tiêu thụ, chủ kho | **Làm** — II.1 |
| Hai kho còn ở chợ cũ | kho tiêu thụ | **Làm** — II.2 |
| Repo Standards nửa (b) | người đọc kho ấy | **Làm** — II.3 (f) |
| README song ngữ, tiêu đề sai | người mới tới kho công khai | **Làm** — II.3 (a) |
| 0 bản phát hành trên GitHub | kho tiêu thụ khi nâng bản | **Làm** — II.3 (c), chỉ từ 3.0.0 |
| Nhánh tồn, tự xoá nhánh tắt | người sửa kit | **Làm** ở kho mới — II.3 (d). Kho cũ: lưu trữ thay cho dọn 271 nhánh |
| 5 PR và 26 vấn đề ở kho cũ | người sửa kit | **Làm** — II.3 (e) |
| Nhật ký thay đổi 5 663 dòng một tệp | máy và người đọc kit | **Đo trước:** đếm ca kiểm đọc phần cũ của tệp. Không ca nào đọc → tách bằng một PR T1 ở II.3; có ca đọc → hạt giống, đi làn V của mốc kế |
| Sổ làm việc ra khỏi kho (tài liệu 898 tệp, hồ sơ vòng 3 195 tệp) | chỉ người sửa kit — bản cài đã 7,8 MB | **Bỏ khỏi đợt.** Khoảng 60 % tệp bộ kiểm script đọc hồ sơ sống, dời là đỏ bộ kiểm. Ngưỡng mở lại: kho vượt 200 MB, hoặc bước lấy mã của lượt kiểm vượt 60 giây |
| Sổ giao diện công khai | kho tiêu thụ, khi kit đổi khoá hay cờ | **Hạt giống** (là CỘNG). Ngưỡng: ≥ 1 lần một mốc đổi khoá hay cờ làm kho tiêu thụ phải sửa tay ngoài hướng dẫn nâng bản |
| Tách `CLAUDE.md` (31 523 ký tự, tăng 27 % trong đợt) | mọi phiên của kho kit | **Hạt giống** — chữ của chủ kho, tệp mang khối marker mà răng rút ra. Ngưỡng: tệp vượt 40 000 ký tự |
| Dãy «Bộ kiểm mạch lạc» (hai tệp 11 595 và 4 532 dòng) | người sửa kit | **Ngoài giai đoạn 2**, hạt giống. Đo lại đích trước khi mở: làn ghim lại nối đuôi 70–98 phút. Ngưỡng: ≥ 2 lượt chấm bị hạ tầng bộ kiểm đốt trong một mốc — trùng ngưỡng (a) của luật chiều rộng |
| Vượt ngân sách gọi người | chủ kho | **Làm** — quyền lặp xin một lần (A3), đo trước cổng (II.2) |

## 6. Thước của giai đoạn 2

| Thước | Nền | Đích |
|---|---|---|
| Vế ngưỡng thực tế đạt | 0/3 | 3/3 |
| Kho kéo kit từ kho cũ | 2 | 0 |
| Lượt gọi người của một vòng chuyển kho | 12 (Inventory) | ≤ 4 mỗi kho |
| Lượt chấm đỏ không vì vật, mỗi vòng chuyển kho | 4 | 0 |
| Ký → gộp của vòng chuyển kho | 3 giờ 33 phút | ≤ 1,5 lần trung vị nền của kho ấy |
| Phiên thật nạp plugin chợ cũ | 3 (trước vòng tắt) | 0 ở mọi kho, mọi máy làm vòng |
| Điểm chưa đạt của công cụ kiểm chuyển kho, sau gộp | — | 0 ở mỗi kho |
| Mục treo chưa có kết cục | 9 | 0 |
| Lượt gọi người cả giai đoạn | — | ≤ 15 |

## 7. Ngân sách gọi người

Duyệt kế hoạch này 1 · II.0: 0 · II.1: 1 (ghi quan sát; vòng sản phẩm tính vào chính vòng ấy) · II.2: tối đa 4 mỗi kho ·
II.3: 1 (bảng 1.9) nếu A3 được duyệt, không thì mỗi PR một lượt (khoảng 5) · II.4: 2 (PR đóng, lưu trữ kho cũ).
Tổng 13 với A3, khoảng 17 không có A3. Lời duyệt cổng của một vòng gõ thẳng ở phiên của vòng ấy; phiên giữ đợt chỉ đưa
câu cần gõ và đường tới phiên.

## 8. Chủ kho quyết gì

**Năm điều chỉ chủ kho biết** — mỗi điều kèm khuyến nghị; trả lời khác đi dựa vào thứ máy không có:

| # | Câu | Khuyến nghị | Máy không biết |
|---|---|---|---|
| A1 | «Xong» có gồm Quỹ hàng và crm sang 3.0 rồi lưu trữ kho cũ không (D2, D3)? | Có | lịch dùng hai kho ấy bốn tuần tới; khẩu vị giữ hai nguồn |
| A2 | Giai đoạn 2 không mở vòng meta nào; suất trước mốc kế để cho DL1 + P179? | Đúng vậy | chủ kho coi việc dọn bộ kiểm hay việc ở kho tiêu thụ nặng hơn |
| A3 | Cho quyền lặp: PR hạng T1 liệt kê ở II.0 và II.3, CI xanh thì phiên giữ đợt gộp bằng commit gộp rồi báo; mỗi vòng chuyển kho được hai lượt đo dài không hỏi lại? Không áp cho PR chạm `plugins/`, `tests/`, workflow hay cài đặt GitHub | Cho | khẩu vị rủi ro với gộp không hỏi |
| A4 | Hạn dừng 19/12/2026, trần 15 lượt gọi người? | Nhận | lịch của chủ kho |
| A5 | Ba việc hướng ra ngoài: bản phát hành GitHub cho `v3.0.0`, chuyển 26 vấn đề sang kho mới, lưu trữ kho cũ ở cuối đợt? | Làm cả ba | người ngoài nào đang theo dõi hai kho |

**Máy đi theo khuyến nghị, chủ kho veto được:** B1 Quỹ hàng trước crm · B2 mốc cài là `v3.0.0` · B3 không dọn nhánh kho cũ ·
B4 bỏ «sổ làm việc ra khỏi kho» · B5 ba hạt giống ở mục 5 · B6 cửa sổ nền 11–18/11 và ngưỡng vế 2 ở mục 4 · B7 viết lại tệp
luật của nhánh · B8 không làm bù bản phát hành cho thẻ cũ · B9 `.repo-setup.json` chỉ nâng khi điểm cho thấy có lợi · B10 công cụ kiểm chuyển kho ở `migration/chuyen-kho/` (chủ kho đã
bảo thêm 19/11; dựng ở II.0 sau khi kế hoạch được duyệt).

## 9. Rủi ro và lưới

- **Không có vòng sản phẩm nào ở Inventory trước 02/12.** Vế 1 trượt, II.2 bị chặn theo. Lưới: tới 02/12 chưa có vòng thì
  trình chủ kho hai lối — chờ tiếp, hoặc cho Quỹ hàng chuyển trước và làm kho chứng minh.
- **Vòng thật đỏ vì kit mới.** Đường lùi đã có: Inventory bật lại chợ cũ và đảo commit cài; II.2 dừng tới khi rõ nguyên nhân.
- **Vòng chuyển kho chạm lượt gọi thứ tư.** Dừng ở đó, trình chủ kho, không đi lượt thứ năm bằng lời giao.
- **Kho cũ có commit mới.** Dừng, hỏi chủ kho (luật đã có ở `TRANG-THAI.md`).
- **Máy làm vòng chưa cài chợ mới.** Phiên ở kho đã chuyển sẽ không có kit; II.0 (3) kiểm trước.
- **Lưu trữ kho cũ sớm.** Chỉ làm khi đủ bốn điều kiện ở II.4; bỏ lưu trữ là đường đảo.

## 10. Chưa biết, phải đo ở II.0

crm ghim bản nào và nhánh mặc định của nó · số nền năm dòng của Inventory · MacBook Pro đã cài chợ mới chưa · bao nhiêu ca
kiểm đọc phần cũ của nhật ký thay đổi · năm PR kho cũ còn đúng với bố cục mới không · ba giới hạn phiên Design Assembly
chuyển sang · điểm `/repo-setup:doctor` của kho mới.

## 11. Ngoài giai đoạn 2 — xếp hàng sau

- Sáu gói DL1–DL6: `hat-giong-sau-goi-dl-ba-kho.md`. Bước 1 của hạt giống ấy (DL1 + P179, mốc 3.1) mở khi vế 1 đạt và chủ
  kho gọi tên.
- Dãy «Bộ kiểm mạch lạc», sổ giao diện công khai, tách `CLAUDE.md`: hạt giống với ngưỡng ở mục 5.
