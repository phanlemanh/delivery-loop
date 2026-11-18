# Bối cảnh đợt chuyển nhà — đọc trước khi làm

Soạn 11/11/2026, để bất kỳ phiên hay máy nào mở kho này cũng nhận tiếp được mà không cần ghi nhớ riêng của máy đã soạn.
Đang ở đâu và máy nào đang giữ: `TRANG-THAI.md` (tệp sống). Kế hoạch đầy đủ: `KE-HOACH.md`. Tệp này chỉ giữ thứ hai tệp
kia không nói: ai đã quyết gì, luật làm việc của đợt, và các bẫy đã dẫm.

## Kho này là gì

- `delivery-loop` là kho kế nhiệm của `acceptance-gate-kit`. Nó mang **trọn lịch sử và 30 thẻ chính thức** của kho cũ
  (không mang các thẻ lưu trữ cục bộ `luu-tru/*`, `backup/*`).
- Nhánh **`main`** = bản sao nguyên vẹn nhánh chính kho cũ. Không ai sửa tay vào đây trước ngày cắt sang; chỉ cập nhật
  bằng cách lấy nhánh chính kho cũ (remote `kit-cu`) rồi đẩy sang.
- Nhánh **`chuyen-nha`** = `main` + thư mục `migration/` (kế hoạch, bối cảnh, công cụ chuyển nhà, đo thử) + một tệp chỉ
  đường `.claude/rules/chuyen-nha.md` để phiên mới tự biết phải đọc gì. Đây là chỗ duy nhất được sửa tay cho tới ngày cắt.
- Nhánh mặc định trên GitHub vẫn là `main`: ai chỉ `git clone` sẽ đứng ở `main` và KHÔNG thấy `migration/` — phải
  `git switch chuyen-nha` (lệnh ở `MO-PHIEN.md` đã gồm bước này).
- Kho đang **riêng tư**; chạy kiểm tự động (GitHub Actions) **đang tắt** để lần nhập lịch sử không kích một lượt khoảng
  60 phút. Bật lại khi vòng B1 cần lượt kiểm trên GitHub.

## Chủ kho đã quyết (11/11/2026)

1. Dựng lại kho + làm kit mạch lạc, giữ nguyên tính năng, North Star dẫn dắt, đồng bộ với Repo Standards.
2. Tên kho và tên chợ plugin: `delivery-loop` (tạm chốt — chốt hẳn ở Cổng Phạm vi của B1).
3. Bảng tên plugin và lệnh ở `KE-HOACH.md` mục 3 (tạm chốt — chốt hẳn cùng chỗ).
4. Phương thức: **kho mới**, kho cũ chạy bình thường tới ngày cắt rồi đóng băng ở 2.38.x; không cần giữ tên cũ làm bí danh.
5. **Kho mới mang trọn lịch sử** kho cũ — lý do ở `KE-HOACH.md` mục 13 (79 % ca đỏ thêm khi bỏ lịch sử là ca dựng lại bản
   cũ từ mã commit hay thẻ cũ).
6. **Không dùng phiên Cloud** cho đợt này (phiên Cloud không nạp plugin của kit — `KE-HOACH.md` mục 10); chạy trên máy của
   chủ kho.
7. **Máy làm đợt chuyển nhà: xem dòng «Đang giữ» ở `TRANG-THAI.md`** — đó là chỗ duy nhất ghi tên máy. (11/11 chủ kho giao
   MacBook Pro; 12/11 nói sẽ chuyển phần dọn nhà sang Mac Studio.) Đổi máy theo luật giữ ở tệp ấy.
8. Việc sửa kit CŨ (các vòng của `acceptance-gate-kit`) từ 01/11 làm ở Mac Studio. **Riêng vòng A1 `luot-kiem-nhe`: chủ kho
   gọi tên và giao MacBook Pro chạy (11/11); vòng đã ký và gộp 12/11.** Các vòng kit khác, kể cả mốc 2.39, vẫn ở Mac Studio.
9. Khuôn «kho plugin» của Repo Standards (dãy R) đã xong và phát hành ở `repo-setup` 0.5.0 (11/11).
10. **Khuôn áp TRONG kịch bản chuyển nhà (B1), sau bước đổi bố cục — không áp tay lên cây kho này trước đó** (chủ kho chọn
    11/11, «Trong kịch bản B1»). Lý do và số đo: `TRANG-THAI.md`, đoạn «Vì sao chưa áp khuôn thẳng lên cây kho này».

11. **Thước B1 có thêm ca chạy thử phiên thật** (chủ kho 12/11, «Thêm ca chạy thử phiên thật vào thước B1») — `KE-HOACH.md`
    mục 12, đoạn dưới bảng dãy B; hiện thân `chay-thu-phien/`.
12. **Hai thước nữa** (chủ kho 12/11, «Ghi hai thước vào kế hoạch») — `KE-HOACH.md` mục 12, dưới bảng dãy B: B2 **giữ đủ
    khoá ca** (túi khoá kho cũ nằm trọn trong kho mới, trừ danh sách bỏ có lý do hiện trên thẻ), và **ngưỡng thực tế của
    mốc 3.0** (một vòng thật ở Quỹ hàng gộp được trên kit 3.0 · năm dòng số không xấu đi do kit mới · chủ kho ghi
    `da-cham-boi-thuc-te` sau cửa sổ 14 ngày, có đường lùi). Đợt chỉ ĐÓNG khi đủ ba vế; crm không là điều kiện đóng đợt.
    Con số ngưỡng là máy đề xuất, chủ kho đổi được ở Cổng Phạm vi mốc 3.0.

## Chủ kho CHƯA quyết (đừng tự quyết)

- Gọi tên mốc 2.39 của kho cũ và kho tiêu thụ nhận nó — điều kiện mở B1.
- Máy giữ đợt từ nay: chủ kho nói 12/11 sẽ chuyển phần dọn nhà sang Mac Studio, chưa bảo đổi.
- Mở dãy B (vòng B1 `kich-ban-chuyen-nha`).
- Ngoại lệ luật chiều rộng (b) cho B1 + B2, và **hạn dừng** của đợt (đề xuất 21 ngày từ khi B1 mở).
- Chốt hẳn tên `delivery-loop` và bảng tên.
- Ngày cắt sang (chữ ký mốc 3.0).
- Vòng riêng cho hai tệp máy vẽ (`PRODUCT-MAP.md`, `LO-TRINH.html`) — hai hạt giống 16/10 và 30/10 ở kho cũ.

## Luật làm việc của đợt

- **Kho cũ là nguồn duy nhất của sản phẩm tới ngày cắt.** Mọi sửa sản phẩm (kể cả vòng A1) vào kho cũ; kho mới chỉ nhận
  bản sinh ra từ kịch bản chuyển nhà và thư mục `migration/`.
- **Kịch bản chuyển nhà sinh commit dọn nhà LÊN TRÊN nhánh chính kho cũ**, chạy lại được, hai lần ra cùng một cây.
- **Không bật cả hai chợ** (`acceptance-gate-kit` và `delivery-loop`) trong cùng một kho tiêu thụ — ba plugin giữ tên sẽ
  trùng (suy đoán, chưa thử).
- **Kho nhận 3.0 đầu tiên: Quỹ hàng** (`onehub-quy-hang`), trên một cây làm việc riêng; crm sau.
- Mọi luật của kit trong `CLAUDE.md` vẫn áp: ba nguyên tố, TRỪ tự đi / CỘNG cần duyệt, chiều đỏ trong bộ kiểm, sửa kit cân
  trên mọi kho, đổi schema có đường đọc-cũ.

## Bẫy đã dẫm trong lúc đo (11/11)

- **zsh không tự tách từ:** `P="a b c"; git grep … -- $P` thành một đường dẫn, trả 0 im lặng. Dùng mảng `P=(a b c)`. Số 0
  từ một phép đếm luôn phải có đối chứng dương.
- **`git grep -- . ':!_acceptance'` trả 0 sai** — tìm ra nguyên nhân 12/11: sau `:!` git đọc ký tự `_` là một cờ, báo lỗi
  «Unimplemented pathspec magic» và không tìm gì. Viết `':(exclude)_acceptance'`.
- **zsh đọc `$R:h`, `$R:t`, `$R:r`… là phép cắt tên biến:** `git show $R:hooks/x` thành `kit-cuooks/x`. Viết `"${R}:hooks/x"`.
- **`git merge-tree --write-tree` trên git cũ hơn 2.38** in lời hướng dẫn dùng lệnh rồi thoát khác 0 — không phải xung đột.
- **Đếm chữ «miss» không phân hoa thường** khớp cả dòng tổng kết của bộ kiểm; đếm theo đầu dòng `^(MISS|FAIL|not ok)`.
- **Theo dõi tiến trình bằng `pgrep -f`** phải dò đúng chuỗi lệnh thật (đã `cd` rồi gọi `bash chay.sh …` thì chuỗi không
  chứa `b0/chay.sh`).
- **Đừng gọi điều gì là «phát hiện» trước khi tìm trong 206 hạt giống** của kho cũ (`docs/plans/*hat-giong*`): «tệp máy vẽ
  nằm trong kho» đã có vòng và hai hạt giống từ trước.
- Ba bản sao đo thử chạy song song mỗi bản một `TMPDIR` riêng — không giẫm nhau (tám tệp kiểm nhắc `/tmp/…` chỉ là giá trị
  giả, không ghi ra đĩa).

## Bẫy đã dẫm ở đoạn ký→gộp (16/11, PR #505 kho cũ, vòng `phan-du-bo-cuc-moi`)

Ca: chủ kho ký 01:10; gộp sớm nhất khoảng 08:30. Hơn bảy giờ máy cho một bản vá một tệp kiểm cộng hai dòng khai, trong
đó 3 giờ 25 phút (01:19 → 04:44) là một lượt ghim lại đỏ. Không tốn thêm lượt gọi người. Phiên giữ đợt đọc từ mã thước,
`commands/signoff.md`, `_acceptance/config.yaml`, `evals.yaml` của hồ sơ và giờ CI trên GitHub; chưa sửa gì.

- **Chữ ký được mời khi CI ở đỉnh PR chưa xanh.** Lượt chấm chạy bốn mảnh ở `feature_loop.suite_keys`, không có bộ
  `tests/dieu-phoi` trọn; CI thì chạy nó. PR mở 01:01, ký 01:10, mảnh `tests · dieu-phoi` ở đỉnh có chữ ký đỏ lúc 01:18
  (ca `DP3-12-do-lb`). Lệnh ký không có bước nào chờ CI. Hệ quả: bản vá rơi SAU chữ ký nên phải ghim lại. Tìm trong 207
  hạt giống và `docs/findings/` bằng bốn mẫu chữ thì chưa thấy mục nào nói đúng điều này — chưa thấy, không phải chắc chắn
  chưa có.
- **Thước của vòng so một danh sách gõ tay với một tập còn mở.** `rang/giu-khoa.mjs` đòi mọi tệp dưới `tests/` mà
  `git diff bản gốc..HEAD` chạm phải khai ở đúng một trong hai nhóm; danh sách viết tay trước khi đo, còn `HEAD` đi tiếp
  sau chữ ký. Bước 7a-bis của lệnh ký tự ghi một dòng vào `tests/scripts/fixtures/routing-baseline.txt`, nên lượt ghim đầu
  tiên sau chữ ký của hồ sơ này chắc chắn đỏ, có bản vá hay không. Cùng họ với hạt giống
  `docs/plans/2026-10-03-hat-giong-lan-ky-truoc-ban-do.md` (nghi thức ký tự làm đỏ làn của chính nó).
- **Luật tĩnh nằm bên trong phép đo dài.** Luật danh sách so trong vài giây nhưng chạy ở đầu từng cụm, nên một nguyên nhân
  làm đỏ cả chín eval và làn chạy trọn 3 giờ 25 phút mới báo. Trước khi chạy một phép đo dài: chạy luật tĩnh và bộ tự kiểm
  của thước trước, đỏ thì dừng ngay.
- **Giá ghim lại không tỉ lệ với cỡ thay đổi — KHÔNG phải phát hiện mới.** Làn chạy mọi eval máy của hồ sơ tại `HEAD`. Đã
  có vòng `lan-ghim-lai-theo-paths`, phát hiện `docs/findings/2026-10-02-dieu-tra-lan-ghim-lai-va-du-bao.md` và khoá
  `risk_tiers.stale_scope: paths` trong lõi; `_acceptance/config.yaml` của kho kit không có dòng `stale_scope` (grep, chưa
  chạy thử). Ở ca này lọc theo `paths` chỉ bớt được khoảng 1,5 trong 3,5 giờ vì hai eval dài nhất khai `tests/**`.
- **Luật danh sách cũng bắt được lỗi thật** — đừng gỡ nó: vòng lúc đầu xếp nhầm `tests/dieu-phoi/tiep-tuc.test.mjs` vào
  nhóm «tự đúng đường»; để nguyên thì danh sách vá thừa gửi B2 (83 → 84 mục) sẽ bảo B2 bỏ hai mục vá nó vẫn cần.

Dính tới đợt ở ba chỗ. Vòng thứ ba ở kho cũ (K4-LT, K4-TB) dùng lại chính thước này: hai sửa rẻ — chạy luật tĩnh trước
phép đo dài, và không để tệp do nghi thức ký ghi rơi vào tập «vòng sửa» — nên đi trong vòng đó. Kho mới cũng tự host kit
nên bước 7a-bis chạy ở chữ ký của B2: thước của B2 có luật nào quét `tests/` theo `diff …HEAD` thì phải kiểm trước khi
ký. Còn «không mời ký khi CI chưa xanh» là sửa lệnh ký của kit, mọi kho tiêu thụ chịu: chỉ ghi ở đây, chờ chủ kho gọi tên.

## Bẫy đã dẫm ở bước kiểm trước S4 (17/11, B2): chữ trạng thái đã-ký trong `migration/`

Ca RT13 của kit (`tests/plugins/ra-co-ten.test.mjs`, phần iv «quét không gian mở») chạy `git grep -l` chữ trạng thái đã-ký
của hợp đồng — từ tiếng Anh `signed` nối liền `-off` — trên TRỌN cây, rồi đòi mọi tệp chứa nó hoặc có ca, hoặc được khai
gạch. Danh sách ngoài phép quét là `_acceptance/`, `docs/` và năm tệp gốc; `migration/` không có trong đó. Hệ quả: một tệp
bất kỳ dưới `migration/` viết nguyên văn chữ ấy làm `plugins_vung_3` và `do-san` (E8s của B2) đỏ trên `chuyen-nha` và mọi
nhánh cắt từ nó. Hai cây đo của B2 không có `migration/` nên không dính.

- **Đã dẫm:** 17/11 13:37 phiên giữ đợt viết chữ ấy vào `TRANG-THAI.md` khi ghi chữ ký vòng bốn; B2 có thêm ba tệp. B2 gặp
  ở bước kiểm trước S4 lúc 16:29 — chưa tốn lượt chấm nào. Tìm `RT13` trong hạt giống và `docs/findings/`: ba hạt giống nói
  về phần đọc-cũ của RT13, chưa thấy mục nào nói về phần quét này với thư mục `migration/` — chưa thấy, không phải chắc chắn
  chưa có.
- **Nghiệm đang dùng (vật của kho tự lo trước, chưa sửa kit):** tệp trong `migration/` không viết nguyên văn chữ ấy — viết
  «đã ký»; mã cần chuỗi thì nối hai nửa. Đây là dặn bằng lời nên kèm ngưỡng đang đếm: **≥ 1 lần nữa** RT13 đỏ vì một tệp
  `migration/` trước ngày cắt sang → sửa đúng tầng ở kho cũ (thêm `migration/` vào danh sách ngoài phép quét, một dòng).
- **Kiểm nhanh trước khi đẩy `chuyen-nha`:** `git grep -l` chữ ấy `-- migration` phải rỗng (vài phần trăm giây); chạy riêng
  ca: `RT_CASES=RT13 node tests/plugins/ra-co-ten.test.mjs`.
- **Ngày cắt sang:** nếu `migration/` còn nằm trong nhánh chính kho mới thì ngưỡng trên coi như chạm — sửa một dòng ấy đi
  cùng việc cắt sang.

## Đầu vào cho B1 — sổ tra soát kho cũ (máy sinh, 12/11)

Ba sổ ở `tra-soat/`: kiểm kê từng tệp của kit (sản phẩm thật, chưa rõ, gọi chéo giữa plugin, con trỏ sẽ treo), chỗ hai kho
tiêu thụ đang bám vào kit, và tệp kiểm bám bố cục cũ. Đọc `tra-soat/README.md` — mục «Đọc nhanh» có chín điều B1 phải biết;
chạy lại kịch bản trước khi dùng số, vì kho cũ đổi mỗi ngày. Ba điều nặng nhất:

- Plugin lõi gọi thẳng vào thư mục plugin điều phối ở 7 chỗ — gãy chắc khi mỗi plugin vào thư mục riêng.
- Quỹ hàng chạy kit trong lượt kiểm tự động bằng cách kéo cả kho kit rồi coi gốc kho là gốc plugin lõi — gãy sau dọn nhà.
- crm giữ 37 tệp chép từ kit ở đúng đường dẫn của kit; nguồn chép đổi chỗ sau dọn nhà.

**Phép so cũ với mới cho B3** (đã dùng 12/09 khi nâng kit cho kho tiêu thụ): chạy bộ chặn gộp trên CÙNG một cây bằng cả hai
bản kit, `pre-merge-check.sh . --recheck-all --base <nhánh chính của kho>`, rồi so danh sách dòng bắt đầu bằng `VIOLATION`.
Chỉ phần lệch mới truy được về việc đổi kit; số tuyệt đối là nợ có sẵn của kho. Thiếu `--base` thì hai luật tự báo vi phạm giả.

## Đầu vào cho B1 — câu còn mở (soạn 12/11, chưa ai quyết)

Một phiên không biết gì đọc bộ bàn giao và không tìm ra các điều dưới. Không điều nào cần gọi chủ kho riêng: chúng là
việc của bước thiết kế B1, chủ kho thấy ở Cổng Đáng và Cổng Phạm vi của chính vòng đó.

1. **Hồ sơ của vòng B1 ghi ở đâu.** B1 là một vòng của kit nên có hồ sơ `_acceptance/<tên>/`, bản thiết kế, và hai tệp máy
   vẽ phải vẽ lại. Tệp chỉ đường lại nói ở kho này chỉ sửa `migration/`. Hai dữ kiện để cân: hồ sơ ghi trên `chuyen-nha` thì
   mỗi lần lấy nhánh chính kho cũ về sẽ đụng hai tệp máy vẽ; hồ sơ ghi ở kho cũ thì nằm ở kho công khai và xa vật nó chấm.
2. **Neo của vòng.** Luật «ô chỉ mở khi có neo ngoài» đòi dòng `Gốc:` trỏ một hồ sơ `_acceptance/`. Chưa có hạt giống hay hồ
   sơ nào ở kho cũ nhắc đợt này (đã tìm trong `docs/plans`).
3. **Nhánh đích của commit dọn nhà.** `main` không sửa tay, `chuyen-nha` là `main` cộng công cụ. Kịch bản sinh commit lên
   nhánh nào ở kho này chưa có tên.
4. **Bảng thư mục nguồn → đích.** Mới có nguyên tắc `plugins/<tên>/`; sổ kiểm kê (`tra-soat/`) đã cho biết tệp nào
   thuộc plugin nào và 20 tệp chưa rõ cần xếp tay. Nhánh chính kho cũ hôm nay có: năm plugin con mỗi
   cái một thư mục ở gốc (`feature-loop/` 32 tệp, `diagram-design/` 217, `dieu-phoi/` 75, `road-map/` 7, `tri-thuc/` 4);
   plugin lõi là chính gốc kho, gồm `skills/` 48, `commands/` 8, `hooks/` 3, `scripts/` 49, `lib/` 17, `vendor/` 19,
   `evals/` 17; và các thư mục chưa ai xếp chỗ: `design-floor/` 136, `tests/` 1 146, `docs/` 885, `_acceptance/` 3 037,
   `.out-of-scope/` 7.
5. **«Tệp sản phẩm» gồm những gì** — đề xuất: đúng lớp `san-pham` của sổ kiểm kê (614 tệp ngày 12/11) cộng các tệp `chua-ro`
   người xếp vào plugin; thước «mỗi tệp sản phẩm có đúng một chỗ» chấm trên tập đó.
6. **«Chạy hai lần ra cùng một cây» so bằng gì** — đề xuất: hai lần chạy cho cùng mã cây `git rev-parse HEAD^{tree}`.
7. **Bảng tên còn ba chỗ chưa phủ** (bảng tên máy đọc đã có ở `chay-thu-phien/bang-ten.json`, chép mục 3 — sửa ở đó khi chốt): ba tác tử của `feature-loop` mang tên Việt (`cham-doc`, `cham-lenh`, `cham-ui`) · số
   phiên bản của `diagram-design` (2.7.1, năm plugin kia 2.38.1 — lên chung 3.0 hay giữ số riêng) · hai tên skill
   `scope-slice`, `signal-intake` còn là tên tạm.
8. **Việc tài liệu chưa gán vòng nào:** README song ngữ, tách phần sử liệu khỏi tệp luật, rà 206 hạt giống, tách nhật ký
   thay đổi cũ, sổ giao diện công khai (`KE-HOACH.md` mục 5.2 và mục 11) — vào B1, vào vòng sau, hay ngoài đợt.
9. **Ai bật chạy kiểm trên GitHub cho kho này, lúc nào** — xem mục cài đặt ngay dưới.

## Cài đặt kho trên GitHub — kho mới đang khác kho cũ (đo 12/11)

| | Kho cũ | Kho mới |
|---|---|---|
| Hiển thị | công khai | riêng tư |
| Chạy kiểm tự động | bật | **tắt** |
| Khoá nhánh chính | phải qua PR (0 lượt duyệt bắt buộc), đòi hai việc kiểm `gate` và `tests`, không đòi nhánh đã đuổi kịp | **không khoá** |
| Cho gộp dồn (squash) | **không** — gộp dồn làm mất commit chữ ký của Cổng Bằng chứng | **đang cho** |
| Tự xoá nhánh sau gộp | tắt | tắt |
| Quét bí mật, chặn đẩy bí mật | tắt | không đọc được |

Chưa ai đổi gì; đặt kho mới giống kho cũ là việc trước ngày cắt, chủ kho bảo khi nào. **Chưa đo:** hạn phút chạy kiểm của kho
riêng tư (mã truy cập hiện có không đọc được gói tài khoản). Một lượt kiểm PR sau A1 là 13 việc song song cộng bốn việc
khác (17 việc kiểm), và mỗi lần đẩy lên nhánh chính vẫn chạy trọn khoảng một giờ — đo hạn phút TRƯỚC khi bật chạy kiểm ở kho này.

## Số đo nền (11/11, `be736814`, bản 2.38.1)

Đủ ở `KE-HOACH.md` mục 2 và 13. Năm con số hay dùng:

- Bản cài plugin lõi 100 MB (sản phẩm thật 3–4 MB).
- Lượt kiểm tự động trung vị 58 phút; bộ kiểm script 37 + bộ kiểm plugin 17 chạy nối đuôi.
- Đo thử B0: trên ~4 300 khoá ca, bỏ lịch sử +329 đỏ, bỏ thêm hồ sơ và sổ +86.
- Bỏ lịch sử: bộ kiểm plugin 16 → 3 phút (phần lớn giờ là dựng lại bản cũ).
- PR mở → gộp trung vị 3,6 giờ.

Sau A1 (12/11, lời phiên A1, chưa đo lại độc lập): lượt kiểm của PR còn 6,5–6,9 phút; lượt chạy trọn trên nhánh chính
không đổi.

## Những gì KHÔNG nằm trong kho này

- Ba bản sao và nhật ký đầy đủ của đo thử B0 nằm ở thư mục tạm của phiên đã đo, sẽ mất. Trong kho chỉ có kết quả tóm và
  ba kịch bản ở `migration/b0/` — đủ để dựng lại phép đo (`dung-ban-sao.sh`).
- Ghi nhớ dự án của các phiên Claude gắn theo đường dẫn thư mục trên từng máy, không theo kho. Thứ cần thiết đã chép vào
  tệp này và `TRANG-THAI.md`; đừng trông vào ghi nhớ để biết trạng thái đợt.
- Số đo về hai kho tiêu thụ ở `KE-HOACH.md` lấy trên bản đang có ở MacBook Pro ngày 11/11, có thể cũ hơn nhánh chính của
  họ; đoạn «Đầu vào cho B1» ở trên đo 12/11 sau khi kéo mới.
- Mười ba cây làm việc và chín nhánh chỉ có ở MacBook Pro của kho cũ: đã rà 12/11, không nhánh nào có commit mà GitHub
  chưa có. Không có gì của đợt này phải chép tay sang máy khác.
