# ADR 0030 — Phiên giám sát đọc bản uỷ quyền của kho; mỗi lần dùng quyền là một sự kiện mang tên quyền

*2026-11-26 · gói DL6 · CỘNG, chủ kho (Phan Le Manh) phê đích danh (ADR 0018), nguyên văn: «Phê, chọn A» — Hỏi-1: phê;
Hỏi-2: lối A, quyền gộp vẫn đến từ ô `tu_merge` của mỗi đợt.*
Gốc: `_acceptance/khung-dot-dinh-vi/` · hạt giống `docs/plans/2026-11-24-hat-giong-giam-sat-co-quyen-va-co-so.md` (lớp 1)
· phanlemanh/delivery-loop#5, #4.

**Vì sao.** Quyền của phiên giám sát nằm trong hội thoại, không nằm trong tệp, nên mỗi đợt chủ kho giao lại bằng tay và
mỗi lần hết ngữ cảnh hay đổi tài khoản thì phần ấy mất. Đợt `nen` của inventory (10–11/11, #5): chủ kho giao quyền hai lần
bằng lời; trong 2 giờ 45 phút đầu thợ dừng chờ phán 10 lần, 6 lần cùng một câu hỏi từ ba dãy; giám sát gộp thẳng PR việc
chung ngoài luật đợt (#4 mục 6) vì lệnh `gop` chỉ nhận dãy đang giữ khoá `merge`. Chủ kho nêu lại 24/11, nguyên văn: «tôi
thường phải giao tay cho Phiên điều phối về quyền sắp xếp phiên gộp, quyết định gộp, gỡ lỗi và điều phối các phiên quyết
định ngoài các cổng». Hiện trạng mã (hạt giống đọc ở `47c62643`; `tu_merge` tự kiểm lại ở `8817a5bf`): quyền máy giữ được
chỉ có công tắc `tu_merge` của cả đợt (`scripts/pha.mjs`); không lệnh nào cho xếp lại thứ tự cấp khoá (`scripts/lich.mjs`);
phán quyết của giám sát chỉ ở `tra-loi/<mã>.json` và trong hội thoại. Mục 5 tài liệu ba kho của Repo Standards ghi sáu việc
chủ kho đã chốt 16/11 và ba điều kèm: câu hỏi gom lên thẻ ở cổng đã có · mỗi quyết định máy tự làm để lại một sự kiện kèm tên
quyền và cách đảo · giám sát không đổi được phạm vi, luật hay bản uỷ quyền của chính nó. Khe RS5b ở kho ấy đang hoãn chờ ADR
này.

**Quyết định.**

1. **Một tệp ở kho dùng, đọc từ nhánh chính.** Bản uỷ quyền là `governance/delegation.yaml` của kho tiêu thụ; chủ kho viết,
   kit chỉ đọc (trả lời của kit cho Repo Standards ngày 21/11). Gói `dispatch` đọc tệp tại ĐỈNH NHÁNH CHÍNH ngay lúc dùng
   quyền (`git show origin/<nhánh chính>:governance/delegation.yaml`), không bao giờ đọc từ cây làm việc, nên PR của chính giám
   sát không nới được quyền trước khi chủ kho gộp nó. Kho không có tệp thì gói chạy như hôm nay, từng byte. Khuôn tệp do RS5b
   dựng; tên loại và bộ đọc do kit định nghĩa:

   ```yaml
   ban: 1
   tu_lam: [thu-tu-gop, gop, phien, chuyen-hang, mo-day, phan-quyet-chung]
   ```

2. **Danh sách loại ĐÓNG, kit định nghĩa; một loại chỉ được nhận khi kit có phép so trước/sau.** Đây là luật «mỗi biên phải
   quy được về một bất biến máy so; chưa quy được thì vẫn là lời dặn» (tài liệu ba kho, mục 4, nguyên tắc 5), biến thành điều kiện của bộ đọc:

   | Loại | Giám sát tự làm | Điều máy so trước/sau | Phép so hôm nay |
   |---|---|---|---|
   | `thu-tu-gop` | xếp lại thứ tự cấp khoá `merge` | tập PR được gộp không đổi; mỗi PR vẫn qua `xetGop` | có (`xepHang` + `xetGop`) |
   | `gop` | gộp PR đã qua cổng khi mọi ô xanh | mọi ô xanh trên đúng commit được gộp | có (`xetGop`, `--match-head-commit`); chỉ khi ô `tu_merge` của đợt bật (Hỏi-2, lối A) |
   | `phien` | mở phiên cho hàng sẵn sàng; dọn phiên đã gộp hoặc đã bàn giao | không commit nào mất | mở: có · dọn: CHƯA — cần phép so bàn giao (lớp 2 hạt giống) |
   | `chuyen-hang`, `mo-day` | chuyển hàng sang dãy khác, mở dãy | mỗi hàng đúng một dãy; không hai hàng trùng vùng chạy cùng lúc | phép so có (`trung-tep.mjs`), lệnh chưa có |
   | `phan-quyet-chung` | ghi một phán quyết thành luật đợt | mỗi phán quyết có một dòng sổ kèm đường đảo | có; phán quyết chạm luật sản phẩm (ADR 0024) KHÔNG so được → vẫn hỏi |
   | `lo-trinh` | đổi thứ tự, tách hàng | bảng phủ của lộ trình không đổi | CHƯA — `plugins/roadmap` không có phép so bảng phủ → bộ đọc chưa nhận |

   Loại có phép so «CHƯA» bị bộ đọc từ chối, in đúng «chưa có phép so — vẫn hỏi chủ kho». Loại có phép so một nửa thì chỉ
   nhận nửa ấy: `phien` cho mở phiên, còn dọn phiên vẫn hỏi chủ kho tới khi có phép so bàn giao. Tên loại lạ là lỗi đọc, không
   bị bỏ qua. «Mục ngoài hợp đồng» và «Thiết kế» của mục 5 không thuộc giám sát đợt: chúng sống ở chính sách Cổng Đáng và ở sổ thiết
   kế của design-assembly; bộ đọc từ chối và chỉ chỗ đúng.

3. **Vùng cấm cứng, không cấu hình được:**
   - chữ ký ở mọi cổng — bảy lệnh khoá của `acceptance-gate` và ba lệnh khoá của `roadmap` (ADR 0002);
   - việc khó đảo ngoài gộp: cắt bản, xoá nhánh còn commit chưa gộp, đẩy lên kho khác, đổi cài đặt GitHub;
   - `.github/workflows/` và `governance/`;
   - luật sản phẩm của kho (ADR 0024);
   - phạm vi, luật và bản uỷ quyền của chính đợt.

   Nếu tệp liệt một mục cấm vào `tu_lam`, bộ đọc từ chối CẢ tệp và in đúng mục ấy: không bỏ mục rồi chạy phần còn lại.

4. **Mỗi lần dùng quyền là một sự kiện ghi TRƯỚC hành động.** Lệnh của quyền gọi `ghiSuKien` một dòng
   `{loai: 'dung-quyen', quyen, viec, duong_dao, sha_uy_quyen}` vào `su-kien.jsonl` của đợt, với `can_phan: false` để Monitor
   của giám sát không tự đánh thức vì việc của chính nó. Ghi hỏng thì không làm. Ba bên đọc:
   - báo cáo đợt (`/dispatch:close`) đếm số lần dùng theo từng quyền;
   - khối «CHƯA duyệt» của Cổng Bằng chứng in các lần dùng quyền chạm hàng ấy — đây là lưới cho phân loại sai;
   - `tiep-tuc` in lại mục «Phán quyết của giám sát» của `LUAT.md` đợt cho giám sát kế nhiệm.

5. **Thẻ khởi tạo in bản uỷ quyền như mục máy đi tiếp có cửa phản đối**, không thành câu hỏi. Lời mời cổng chỉ chứa điều chỉ
   người biết (01/09); chủ kho đã viết điều ấy một lần vào tệp.

**Lệnh để dùng quyền** (mức thiết kế, vòng dựng chốt chi tiết):
- khi ô `tu_merge` của đợt bật, giám sát thành người gọi hợp lệ của `gop`, đi qua ĐÚNG các phép kiểm của `xetGop` (chữ ký thật, CI xanh, cửa chứng minh),
  không nới phép nào và không bao giờ `--auto`;
- một lệnh xếp lại thứ tự gộp, một lệnh chuyển hàng, một lệnh mở dãy;
- `phan-quyet "<câu>"` ghi cùng lúc vào sổ luật đợt và nhật ký.

**Gây bất ngờ — và vì sao không trái ADR cũ.**
- *ADR 0027 chân 4* nói máy chỉ soạn dòng luật trao quyền sau 10 câu mù liên tiếp khớp, và khó-đảo không bao giờ trao. Ở đây
  NGƯỜI trao, không phải máy đề xuất: lời giao có nguyên văn (#5, nhắc lại 24/11). Ngưỡng của chân 4 gác lời máy đề xuất,
  không gác chữ của chủ kho. Phần khó-đảo duy nhất là gộp, nên nó thành Hỏi-2; chủ kho chọn lối A — quyền gộp vẫn do người gõ ở mỗi đợt.
- *ADR 0002* giữ nguyên: không loại nào chạm chữ ký, và giám sát không gọi lệnh khoá nào.
- *ADR 0029* giữ nguyên: gộp theo quyền dùng cùng các phép kiểm và cùng `--match-head-commit`.

**Khó đảo.** Tên tệp và tên loại là quy ước giữa nhiều kho: khi kho tiêu thụ đã viết `governance/delegation.yaml` và Repo
Standards đã dựng khuôn, đổi tên nghĩa là chuyển đổi ở mọi kho. Vì vậy chỉ đổi qua đường đọc-cũ có cờ vàng.

**Răng, không dặn bằng lời.** Mỗi ca đỏ có đối chứng dương (tệp hợp lệ thì XANH trước) và ghim đúng thông điệp mong đợi:
- loại lạ;
- mục cấm trong `tu_lam`;
- loại chưa có phép so;
- lệnh của quyền chạy mà không có dòng `dung-quyen`.

Thêm một mutant: đổi nguồn đọc từ nhánh chính sang cây làm việc. Khi đó ca «PR của giám sát tự thêm `lo-trinh` vào tệp» phải
đỏ. Chiều im: kho không có tệp thì đầu ra của `open`, `status`, `close` không đổi.

**Cân trên mọi kho.**
- Kho không có tệp: không đổi gì.
- Kho không cài `dispatch`: không đổi gì.
- Tệp đời cũ thiếu trường: đọc được, kèm cờ vàng.
- Khuôn neo vào tên loại kit định nghĩa, không vào từ vựng của một kho.
- Bề mặt mới duy nhất ở kho có tệp là một khối trên thẻ khởi tạo và một dòng đếm trong báo cáo đợt.

**Không thuộc ADR này.**
- *Lớp 2 của hạt giống — đối soát bàn giao.* `ban-giao.json` có bên viết mà chưa có bên đọc. Đây là sửa đúng-sai, đi riêng,
  không cần phê. Nên đi TRƯỚC, vì việc «dọn phiên» trong loại `phien` cần chính phép so ấy.
- *Lớp 3 — hàng rộng, khung đường găng.* CỘNG riêng.
- *Gom cổng, khối định vị.* Thuộc ADR 0027 (a)–(c).

**Đánh đổi.**
- *Bớt:* lời giao tay mỗi đợt, những lần thợ dừng chờ phán một câu đã phán, và đoạn ký→gộp trong đợt không có chủ máy.
- *Đổi lấy:* tin một tệp do người viết ở `governance/`. Mô hình tin giống chữ ký: tệp chỉ vào nhánh chính qua một PR đã gộp,
  nên xuất xứ đọc ở forge — người gộp PR ấy (ADR 0012).
- *Rủi ro:* giám sát sai trong phạm vi quyền thì lỗi đi xa hơn trước khi người thấy. Lưới đỡ là sổ sự kiện, khối «CHƯA duyệt»
  và đường đảo của từng loại.
- *Giá máy:* bộ đọc chạy một lần `git show` mỗi lần dùng quyền.

**Dự báo năm dòng (luật c).**

| Dòng | Dự báo |
|---|---|
| làm-xong→gộp-được | ↓ — đoạn ký→gộp trong đợt, nơi giám sát giữ thứ tự và gộp |
| lượt gọi người | trong thiết kế: = · ngoài thiết kế: ↓ |
| vòng bị hạ tầng đốt lượt chấm | = |
| token máy/vòng | = |
| phút máy/lượt chấm | = |

Điều kiện tin cậy: đường verdict không đổi thành phần, vì ADR này không chạm S4.

**Chưa đo, nói thẳng.**
- Số của #5 là 2 giờ 45 phút đầu đợt `nen`, khi chưa hàng nào gộp. Chưa có số nào cho thấy cách làm của #5 rút ngắn ký→gộp
  hay giảm lượt gọi ngoài cổng.
- Ngưỡng mở của lớp 1 trong hạt giống («đợt kế mà chủ kho phải gõ lại lời giao, hoặc giám sát phải gộp ngoài lệnh `gop`») chưa
  được đếm. Câu «thường phải giao tay» ngày 24/11 là lời chủ kho, chưa kèm số đợt.

**Thời điểm.** Mở như một vòng của gói `dispatch` khi chủ kho gọi tên, sau khi vòng DL2 đang chạy đã gộp. Vòng này chạm bề
mặt một kho tiêu thụ dùng hằng ngày, cùng hạng với ADR 0027 (a)–(b), nên không phải vòng kit sửa thước của kit. ADR này là
lời phê CỘNG, không thay Cổng Đáng của vòng; ô mở có dòng `Gốc:` như trên. Kho dùng đầu tiên là kho chạy đợt kế. Repo
Standards dựng khuôn tệp (RS5b) sau khi ADR được phê.

**Đường đảo.**
- Xoá tệp ở kho: hành vi cũ trở lại từ lần đọc kế, vì bộ đọc đọc nhánh chính.
- Hoàn lại PR của vòng.
- **Ngưỡng thu hồi:** một lần dùng quyền không có sự kiện, hoặc một lần chạm vùng cấm → tắt bộ đọc ở mốc kế.

## Câu hỏi cho chủ kho (chỉ người biết) — đã trả lời 26/11: «Phê, chọn A»

**Hỏi-1 — Phê CỘNG cho bản uỷ quyền, sự kiện dùng quyền và các lệnh để dùng quyền?** Khuyến nghị: **phê**.
- Căn cứ: 10 lần thợ dừng chờ phán trong 2 giờ 45 phút; lời giao phải lặp lại mỗi đợt; tính năng tắt mặc định và có đường đảo
  bằng cách xoá một tệp.
- Lối «không phê»: giữ lớp 0 của hạt giống — kho ghi lời giao vào `LUAT-rieng.md` của gói đợt. Cách này không sửa kit, nhưng
  giám sát vẫn không có lệnh gộp đúng luật.

**Hỏi-2 — Quyền `gop` lấy từ đâu?** Điều máy không có ở câu này là khẩu vị rủi ro của chủ kho với một quyền khó đảo sống qua
nhiều đợt.
- **(A, khuyến nghị)** Ô `tu_merge` trên thẻ khởi tạo của MỖI đợt vẫn là nguồn duy nhất của quyền gộp. Bản uỷ quyền chỉ làm
  giám sát thành người gọi hợp lệ của `gop` khi ô ấy bật.
  - Thêm 0 chạm: ô đã có trên thẻ.
  - Giữ luật «khó-đảo luôn hỏi người» ở nhịp một lần mỗi đợt.
- **(B)** Loại `gop` trong tệp mang quyền gộp cho mọi đợt; ô `tu_merge` đọc mặc định từ tệp.
  - Bớt một chữ mỗi đợt.
  - Đổi lại, một quyền khó đảo sống qua nhiều đợt mà không ai gõ lại.

## Sửa 28/11 — khoá và tên quyền sang tiếng Anh (hồ sơ `doi-ten-ban-uy-quyen`)

Luật chủ kho đặt cho cả kit 28/11: **máy đọc tiếng Anh, người đọc tiếng Việt**. Trước mốc đầu tiên mang bộ đọc tới kho tiêu
thụ (đo 28/11: chưa kho nào có tệp), khoá và tên trong bản uỷ quyền đổi như bảng dưới; chủ kho duyệt bảng ở Cổng Phạm vi của
hồ sơ trên. Thân ADR ở trên giữ tên đời 26/11 như đã quyết — mục này không viết lại Quyết định 1–5, chỉ đổi tên.

| Tên đời 26/11 | Tên hiện hành | Nhóm |
|---|---|---|
| khoá `ban` · `tu_lam` | `version` · `delegated` | khoá |
| `gop` · `thu-tu-gop` | `merge` · `merge-order` | nhận |
| `phien` · `chuyen-hang` · `mo-day` · `phan-quyet-chung` · `lo-trinh` | `session` · `reassign-row` · `open-lane` · `shared-ruling` · `roadmap` | vẫn hỏi |
| `muc-ngoai-hop-dong` · `thiet-ke` | `out-of-contract` · `design` | sai chỗ |
| `chu-ky` · `cat-ban` · `xoa-nhanh` · `day-kho-khac` · `cai-dat-github` | `gate-signoff` · `release` · `delete-branch` · `push-other-repo` · `github-settings` | vùng cấm |
| `workflows` · `governance` | giữ nguyên | vùng cấm |
| `luat-san-pham` · `pham-vi-dot` · `luat-dot` · `uy-quyen` | `product-invariants` · `dispatch-scope` · `dispatch-rules` · `delegation` | vùng cấm |

- **Tệp mang tên cũ bị từ chối cả tệp** — không quyền nào được nhận, kể cả tên mới cùng tệp. Câu lỗi gọi đúng tên mới
  (`tên cũ «tu_lam» — bản uỷ quyền nay dùng «delegated»; cả tệp bị từ chối`); tên cũ của vùng cấm kèm «vùng cấm cứng,
  không cấu hình được». Không có đường đọc tên cũ: bảng tên cũ trong bộ đọc chỉ để gọi tên. `version` vẫn chỉ nhận bản 1.
- **Nghĩa tiếng Việt cho người:** mỗi quyền mang `nghia`; thẻ khởi tạo (`uy_quyen.nghia`) và báo cáo đợt
  (`dung_quyen.nghia`) trình quyền bằng nghĩa ấy, tên tiếng Anh trong ngoặc.
- Không đổi: tên lệnh `gop`, `thu-tu-gop`, tệp `thu-tu-gop.json`, sự kiện `dung-quyen`, khoá `tu_merge` của thẻ mở đợt (vòng
  sổ khoá sau, có đường đọc tên cũ). Hồ sơ đã ký `giam-sat-doc-ban-uy-quyen` giữ nguyên tới chiến dịch ghim lại của mốc kế.
