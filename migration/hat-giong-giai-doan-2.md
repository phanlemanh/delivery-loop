# Hạt giống — các việc giai đoạn 2 đo ra mà không làm trong đợt

**Ngày:** 19/11/2026 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · ghi theo `KE-HOACH-GIAI-DOAN-2.md` mục 5 và việc II.0 (5),
kế hoạch chủ kho duyệt 19/11. Không mở vòng, không tạo ô. Khi đợt đóng, tệp dời sang `docs/plans/` cùng PR đóng đợt.

## 1. Tách nhật ký thay đổi — CÓ ca đọc phần cũ, nên không tách bằng PR tài liệu

Luật của kế hoạch: «Không ca nào đọc phần cũ → tách bằng một PR T1; có ca đọc → hạt giống, đi làn V của mốc kế». Đo trên
`origin/main` `c1cf031a`:

- `tests/scripts/hang-pr.test.mjs` và `tests/scripts/luot-sua-giu-du.test.mjs` cắt `CHANGELOG.md` từ đầu tệp tới mục của một
  mốc gốc cũ (đọc số mốc từ commit `d5931848`, `7b1afe1e`) — tách phần cũ ra là hai ca đỏ.
- `tests/scripts/repin-lane-skip-unchanged.test.mjs` (SK6) tìm một câu trong cả tệp; `tools/bump_version.py --notes` in mục
  của một số bất kỳ.
- 28 tệp `_acceptance/*/evals.yaml` khai `CHANGELOG.md` làm đầu vào — đổi tệp là bằng chứng của các hồ sơ ấy hoá cũ.

Hướng làm khi có người gọi tên: các ca đọc mục cũ chuyển sang đọc qua một bộ đọc chung tìm được mục ở cả tệp sống lẫn tệp
lưu (đường đọc-cũ), rồi mới tách; đi cùng một mốc phát hành (làn V), một lần ghim lại. **Ngưỡng mở:** tệp vượt 8 000 dòng
(hôm nay 5 663), hoặc ≥ 1 lượt chấm đỏ vì đọc nhầm mục của nhật ký.

## 2. Ba giới hạn Design Assembly chuyển cho kit

Đọc 19/11 trong sổ giới hạn công khai của kho `phanlemanh/design-assembly`
(`plugins/design-assembly/references/limits.json`, các mục có `"repo": "delivery-loop"` và còn mở):

| Mã giới hạn bên ấy | Điều đo được (lời kho ấy) | Chạm phần nào của kit |
|---|---|---|
| `token-format-edges` | Phép so màu thô với token của kit chỉ đọc hệ thập lục phân; màu viết theo ký pháp cảm nhận lọt qua | sàn thiết kế, phép so token |
| `kit-readers-split-on-colour` | Thước độ phủ đọc màu dạng đối tượng của chuẩn token hiện hành thành token nhiều phần, còn ô `gate` đòi thập lục phân — chỉ dạng cũ chạy được ở cả hai | hai bộ đọc màu lệch nhau |
| `out-of-git-manifest-lowers-kit-tier` | Kit đọc bậc sàn thiết kế từ tệp trên đĩa; ở cây làm việc mới của kho để sổ thành phần ngoài git, tệp chưa có nên kit đọc bậc thấp hơn và báo thiếu sổ | đọc bậc sàn thiết kế |

Cả ba là đổi hành vi của engine, nên giai đoạn 2 không làm (A2: không vòng meta). Hai giới hạn đầu cùng một lớp — hai bộ đọc
màu của kit không dùng chung một nguồn; nghiệm đúng tầng là một bộ đọc màu dùng chung cho thước độ phủ và ô `gate`. Giới hạn
thứ ba thuộc họ «tệp sinh nằm ngoài git» của DL1 (`hat-giong-sau-goi-dl-ba-kho.md`). **Ngưỡng mở:** một kho tiêu thụ của kit
bị lượt chấm đỏ vì một trong ba điều này, hoặc chủ kho gọi tên cùng DL1.

## 3. Ba chỗ engine 3.0 vấp ở vòng chuyển kho đầu tiên (Quỹ hàng, 19/11)

Phiên của vòng báo; phiên giữ đợt chưa dựng lại từng ca. Cả ba là hành vi engine, nên giai đoạn 2 không sửa (A2).

| Chỗ | Điều thấy | Vòng đã đi vòng qua bằng |
|---|---|---|
| bộ sinh tham số chấm `s4-args` | lấy nhánh `main` CỤC BỘ làm gốc so; bản kéo chậm `origin` thì chặn oan | truyền `--diff-base` tường minh |
| `pr-san-sang` | từ chối mở PR vì `LO-TRINH.html` tự vẽ lại sau lượt chấm | mở PR tay |
| quét bí mật của kho | nhận nhầm mã băm trong tệp tham số chấm là khoá bí mật | để tệp tham số ngoài kho |

Chỗ thứ nhất cùng họ với giới hạn đã ghi của `loop-health` (đọc lịch sử của HEAD bản kéo, không của `--at`): bộ đo của kit
tin bản kéo cục bộ là nhánh chính. **Ngưỡng mở:** cùng chỗ vấp lại ở một kho thứ hai (crm là lần đo kế), hoặc ≥ 1 lượt chấm đỏ
vì nó.

## 4. Sáu mục từ bản đối chiếu với Repo Standards chưa có chỗ trong kế hoạch (21/11)

Chủ kho bảo ghi 21/11: «Ghi năm mục chưa có chỗ thành hạt giống», rồi «Thêm phần CodeQL của K6 thành mục 4.6». Nguồn số đo: `phanlemanh/repo-standards`, nhánh chính,
`docs/reports/2026-11-20-decision-to-merge-trace.md` — đo chỉ-đọc trên `onehub-inventory` tại `f2a49b49`, 63 hồ sơ đã ký và
đã gộp trong 10–20/11, 524 lượt CI. Phiên giữ đợt KHÔNG đo lại các số ấy, trừ chỗ ghi «đọc lại». Mã K là mã của bản đối
chiếu. Các mục còn lại của bản ấy đã có chỗ (DL1, DL2, DL3, DL4, DL6, mục 2 của tệp này).

### 4.1 Lệnh cài không khai và không kiểm dòng gộp cho tệp sinh (K1, nửa đầu)

- **Điều đo được:** `LO-TRINH.html` nằm trong 129 trên 138 lần xung đột khi gộp nhánh chính vào nhánh PR (11 ngày), 58 trên
  66 từ 14/11. Đọc lại tại `8e0a91c9`: `.gitattributes` của Inventory chỉ có `PRODUCT-MAP.md merge=generated-file`, không
  có dòng cho `LO-TRINH.html`; `PRODUCT-MAP.md` không còn trong danh sách xung đột.
- **Kit hôm nay:** chỉ dạy bằng chữ, bật theo lựa chọn (`GUIDE.md`, khối `GITATTR-TEP-SINH`, tên driver `tep-sinh`). Không
  lệnh nào của kit ghi hay kiểm `.gitattributes`. Inventory dùng tên driver khác (`generated-file`).
- **Sửa đúng tầng, làm được ngay, không đổi kit:** kho ấy thêm một dòng `LO-TRINH.html merge=generated-file`. Việc của kho
  ấy; sau mỗi lần gộp phải vẽ lại rồi commit, quên thì `--check` đỏ. Hạt giống #459 (`hat-giong-tu-kho-cu.md`) ghi công cụ
  đồng bộ của app từng từ chối driver này một lần.
- **Phần của kit, nếu mở:** lệnh khởi tạo hay hướng dẫn nâng bản báo khi kho khai nửa chừng (một trong hai tệp sinh). Là
  CỘNG nhỏ; cùng họ DL1 — DL1 gỡ gốc bằng cách PR thôi ghi tệp sinh.
- **Đo lại 21/11 14:05:** trên đầu PR #98 của Inventory (`6484a2d5`, đang mở) `.gitattributes` vẫn chưa có dòng cho
  `LO-TRINH.html`. Chưa ai đo dòng ấy bớt được bao nhiêu trong 66 lần gộp từ 14/11; hướng dẫn của kit tự khai driver chỉ
  chạy ở máy đã cấu hình, GitHub không chạy. Kế hoạch: `KE-HOACH-12-MUC-REPO-STANDARDS.md` bước 0.3–0.4.
- **Ngưỡng mở:** một kho thứ hai khai nửa chừng, hoặc chủ kho gọi tên cùng DL1.

### 4.2 Ô `gate` đỏ cả khi chỉ đang chờ (K4)

- **Điều đo được:** cả lịch sử 280 trên 506 lượt `gate` đỏ. Trong 15–20/11 có 46 job `gate` đỏ, đọc log từng job (một job
  có thể nêu nhiều lý do): bằng chứng cũ 15 · PR chưa có hồ sơ hay bản ghi 13 · chờ chữ ký Cổng Bằng chứng 9 · chờ lượt
  chấm 8 · cổng chưa mở 5 · lượt chấm REJECT 5. Trong đợt này, PR #621 của `crm-onehub` đỏ `gate` hai lần mà không lần nào
  là hỏng: một lần chờ chữ ký, một lần bằng chứng neo commit cũ.
- **Kit hôm nay:** ô `gate` chỉ có hai màu. Màu đỏ vì thế không phân biệt «chưa tới lượt» với «sai».
- **Trace:** nguyên tố 2 (màu phải mang nghĩa) và khối ĐỊNH VỊ («giới hạn là nhãn trạng thái, không phải lỗi»).
- **Cân trên mọi kho:** khoá nhánh chính của các kho đòi `gate` xanh mới gộp. «Chờ» vẫn phải chặn gộp, nên lời giải không
  thể là đổi «chờ» thành xanh; nó cần một trạng thái thứ ba hoặc một ô riêng. Chạm cách kho khai check bắt buộc — đổi mặc
  định là mọi kho trả giá. Cùng tầng với DL3 (ô bằng chứng mang tên khác `gate`).
- **Đo lại 21/11:** lần thứ ba trong đợt — PR #15 của kho kit, job `gate` đỏ với đúng một vi phạm «verdict PASS but
  human_signoff is empty (Gate 2 pending)». Dòng log đã gọi tên lý do; chỉ màu ô không phân biệt. Chưa đếm được lần nào
  máy hay người hành động sai vì màu ấy.
- **Ngưỡng mở:** chủ kho gọi tên cùng DL3, hoặc ≥ 1 lần máy hay người hành động sai vì đọc ô đỏ-chờ thành hỏng (sửa mã,
  chạy lại lượt chấm, bỏ PR).

### 4.3 Không có mốc «thẻ Cổng Bằng chứng đã trình» (K5)

- **Điều đo được:** đoạn «lượt chấm đạt → ký Cổng Bằng chứng» chiếm 113 trên 363 giờ (31 %) ở 34 hồ sơ có đủ mốc; trung
  vị 13 quyết định ghi ở cổng ấy mỗi hồ sơ.
- **Kit hôm nay:** `loop-health` đo từ commit đầu ghi `status: implemented` tới commit đầu ghi chữ ký. Không tách được thời
  gian chờ người khỏi thời gian máy chuẩn bị hồ sơ.
- **Trace:** thước của kit, luật chiều rộng (c) dòng 1 và dòng 2 (lượt gọi người đứng trước dòng máy).
- **Đo trước khi cộng:** mốc này có thể đã suy được từ lịch sử — commit ghi phán quyết PASS của lượt chấm cuối là lúc thẻ
  trình được. Nếu suy được thì chỉ cần bộ đo đọc thêm một mốc đã có, không thêm trường nào vào hồ sơ («kit render, không
  soạn»).
- **Đo lại 21/11:** suy được từ lịch sử, một mẫu — PR #15 của kho kit: commit phán quyết PASS `c8164925` 11:55:57 →
  commit chữ ký `b41b6a31` 12:22:44 = 26′47″ chờ người, không cần trường mới nào trong hồ sơ.
- **Ngưỡng mở:** hồ sơ mốc kế không tách được chờ-người khỏi chuẩn-bị bằng hai mốc đã có (commit phán quyết PASS → commit
  chữ ký), hoặc chủ kho gọi tên.

### 4.4 Kho dùng kit phải khai cách gộp là commit gộp (K8) — có hạn

- **Điều sắp xảy ra:** PR 58 của `repo-standards` (đang mở lúc ghi) lưu `merge_method` vào `governance/autonomy.yaml`, và
  lượt nâng `repo-setup` kế tiếp sẽ thêm `merge_method: squash` cho kho chưa khai.
- **Vì sao chạm kit:** kit cần commit gộp. Bộ đo ký→gộp (`plugins/dispatch/scripts/do-gop.mjs`) không tách được giờ ký của
  vòng gộp dồn (rơi vào `chua_do`); luật của đợt này và lệnh gộp của plugin điều phối đều gộp bằng `--merge`.
- **Kit hôm nay:** chỉ ghi ở bước 1.1 của `migration/cat-sang/BANG-BUOC.md` (đặt tay). `GUIDE.md` và `QUICKSTART.md`
  không nói.
- **Việc, theo tầng:** (1) mỗi kho dùng kit khai `merge_method: merge` khi nâng `repo-setup` — việc của kho ấy; (2) một
  dòng trong hướng dẫn của kit — tài liệu, hạng T1.
- **HẠN ĐÃ TỚI 21/11, và đã được xử lý đúng tầng ở Inventory:** PR 58 gộp 01:20Z, `repo-setup` 0.10.3 phát hành 02:54Z.
  Ghi chú phát hành của bản ấy tự khai: bản nâng thêm `merge_method: squash`, kho gộp bằng commit gộp phải đặt `merge`
  trong cùng PR, không thì lượt `github_setup.py --apply` kế đặt kho về chỉ gộp dồn. PR #98 của Inventory (mở 03:53Z,
  hồ sơ `upgrade-repo-setup-0-10-3` đã ký) khai `merge_method: merge` ở dòng 36 của `governance/autonomy.yaml` — đọc
  lại trên đầu PR `6484a2d5`; chưa gộp lúc đo. Kho khác: `crm-onehub` không dùng `repo-setup`; kho kit ở `repo-setup`
  0.5.0 bậc starter, không có `governance/`; Quỹ hàng chưa đo. Còn lại của kit: một đoạn tài liệu (T1).
- **Ngưỡng mở, theo ngày:** TRƯỚC khi kho dùng kit đầu tiên nâng lên bản `repo-setup` có `merge_method`. Quá hạn mà chưa
  ghi thì dấu hiệu là dòng `chua_do` của bộ đo ký→gộp tăng ở kho ấy.

### 4.5 Bản nâng công cụ máy móc đi trọn hạng T3 (K9)

- **Điều đo được:** PR 95 của Inventory — bốn tệp do `apply.py` của `repo-setup` ghi, hai tệp dưới `tools/**` — bị xếp T3,
  đi trọn hồ sơ và hai cổng: mở 09:16Z, gộp 20:47Z ngày 20/11.
- **Kit hôm nay:** hạng do `risk_tiers` trong `_acceptance/config.yaml` của từng kho khai; kit không có làn riêng cho thay
  đổi do một công cụ tất định sinh ra. `BANG-BUOC.md` để chủ kho quyết từng PR.
- **Sửa đúng tầng trước:** kho ấy khai lại glob hạng cho các tệp mà công cụ ghi, nếu chủ kho thấy chúng không phải hành vi.
- **Cùng họ:** hạt giống #470 (`hat-giong-tu-kho-cu.md`) — PR chỉ sửa tệp kiểm bị chặn, dạng «trạm thu phí». Nếu mở ở kit
  thì là CỘNG: một lối nhẹ cho thay đổi có lệnh tái tạo được (chạy lại công cụ ra đúng diff).
- **NGƯỠNG ĐÃ ĐỦ, đo lại 21/11:** Inventory có bốn vòng nâng `repo-setup` trong ba ngày, hạng đọc từ hợp đồng:
  0.9.0 T3 · 0.10.1 T2 · 0.10.2 T3 · 0.10.3 T3 (PR #98 đang mở). Bốn bản phát hành của công cụ trong 19–21/11 kéo bốn
  vòng trọn hồ sơ. Nhát đúng tầng rẻ nhất chưa thử: kho ấy nâng theo MỐC thay vì theo từng bản vá (cùng nguyên tắc với
  «ghim lại theo release» của kit).
- **Ngưỡng mở:** lần thứ hai một bản nâng công cụ máy móc đi trọn T3 ở bất kỳ kho nào, hoặc chủ kho gọi tên cùng #470.

### 4.6 Thước của hồ sơ bị CodeQL báo, mỗi hồ sơ tự viết một bản (K6) — chủ kho bảo thêm 21/11

- **Điều đo được, đọc lại 21/11 bằng `gh api`:** Inventory có 4 cảnh báo đang mở trên nhánh chính, cùng luật
  `js/shell-command-injection-from-environment`, ở `_acceptance/<slug>/rang/lib.mjs` của bốn hồ sơ: số 9
  (`upgrade-repo-setup-0-9-0`), 12 (`upgrade-repo-setup-0-10-1`), 15 (`commit-msg-kit-subjects`), 16
  (`upgrade-repo-setup-0-10-2`). Nhánh chính kho ấy có 7 hồ sơ mang `rang/lib.mjs`; bốn hồ sơ bị báo là bốn hồ sơ mới nhất
  (19–20/11) — nhịp hiện tại là mỗi vòng mới thêm một cảnh báo.
- **Kit hôm nay:** thước của hồ sơ (`rang/`) do máy của từng vòng viết tay; plugin không giao thư viện nào cho việc «chạy
  một lệnh rồi so kết quả». Ô `khuon-rang-dung-chung` (chủ kho cho dừng 30/08) nhắm việc thước tự dối, không nhắm cảnh báo
  này, và luật chiều rộng (a) đang giữ trần «bộ đo được máy kiểm một tầng».
- **Cùng lớp, đo trong đợt này:** vòng chuyển crm và vòng sửa PR #621 có bốn lỗi ở thước và bộ chạy viết tay của chính
  vòng — thước neo sai mốc (t1) · phép đo CI thiếu `filter=all` nên chốt không bao giờ bắn (t3, một lượt chấm REJECT) · bộ
  chạy giết lệnh làm rỗng `package.json` · bộ chạy song song đè bản lưu (một lượt đo dài ~1,5 giờ thành rác). Ca t3 là
  một phép đo tự dối trên vòng ở kho tiêu thụ: đếm 1 cho ngưỡng (a) «≥ 2 lượt chấm sai do phép-đo-tự-dối giữa hai release».
- **Sửa đúng tầng trước, không đổi kit:** (1) vòng viết thước gọi lệnh bằng mảng đối số thay vì ghép chuỗi lệnh từ biến
  môi trường; (2) hoặc kho ấy quyết thư mục `_acceptance/**/rang/**` có thuộc phạm vi quét CodeQL hay không — thước chỉ
  chạy lúc chấm, không giao cho người dùng. Cả hai là việc của kho.
- **Phần của kit, nếu mở:** một thư viện nhỏ giao kèm plugin cho thước của hồ sơ (chạy lệnh an toàn, lưu và hoàn nguyên
  tệp theo từng lệnh, dừng khi cây bẩn) để vòng nhập vào thay vì viết lại. Là CỘNG, và chạm đúng trần của luật (a) — mở
  thì phải mở lại ô `khuon-rang-dung-chung` hoặc đặt một ô mới có neo.
- **Đo lại 21/11 14:05:** vẫn bốn cảnh báo mở (9, 12, 15, 16), chưa có cái thứ năm; ngưỡng (a) đang ở 1 trên 2.
- **Ngưỡng mở:** ngưỡng (a) đủ (thêm một lượt chấm sai do phép-đo-tự-dối trước mốc kế), hoặc cảnh báo cùng luật xuất hiện
  ở kho tiêu thụ thứ hai, hoặc chủ kho gọi tên.

## 5. Của kho crm, không phải của kit: suite api xanh ở mọi thứ tự tệp (21/11)

Chủ kho đồng ý giữ làm hạt giống 21/11 («Đồng ý cả ba đề xuất còn treo»). Hạt giống này thuộc kho `crm-onehub`. Ở chặng
II.4 nó KHÔNG chuyển vào `docs/plans/` của kit (kit là engine, không chứa việc sản phẩm của kho tiêu thụ); nó được trao
cho kho crm, cách trao do chủ kho quyết lúc đóng đợt.

**Đo được ở PR #621 của crm (gộp 20/11 tại `5e2c0b39d`).** Chín ca api đỏ trên nền có ba gốc: bom giờ trong mã test ·
bốn chỗ rò trạng thái giữa các tệp test, chỉ lộ ra theo thứ tự tệp của CI Linux (máy Mac chạy thứ tự khác nên xanh) ·
một hồi quy 27 ca do chính lần sửa đầu. PR #621 sửa đủ để suite xanh ở thứ tự tệp của CI (2171 đạt · 18 bỏ qua · 0 đỏ
trên commit gộp). Nó không chứng minh suite xanh ở MỌI thứ tự tệp: còn chỗ rò nào chưa lộ thì chưa ai đo.

**Nhát sửa đúng tầng (việc của kho crm).** Một phép đo chạy suite api ở vài thứ tự tệp khác nhau (xáo có hạt giống ghi
lại được), cộng cách ly trạng thái giữa các tệp. Chiều đỏ: gỡ một nhát cách ly của PR #621 → phép đo đỏ ở ít nhất một
thứ tự. Chiều im: đổi một tệp tài liệu → phép đo không đổi.

**Ngưỡng mở.** Suite api của crm đỏ thêm một lần trên CI mà xanh trên máy làm việc, hoặc chủ kho đưa nó vào lộ trình
của kho ấy.
