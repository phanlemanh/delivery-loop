# Bộ kiểm xanh ở kho mới (vòng B2 `bo-kiem-xanh-o-kho-moi`) — thiết kế

Soạn 14/11/2026, Mac Studio. Hồ sơ: `_acceptance/bo-kiem-xanh-o-kho-moi/`. Nền đọc: thiết kế B1 (`THIET-KE.md` cạnh tệp này),
`migration/KE-HOACH.md` mục 12 (thước «giữ đủ khoá ca»), `_acceptance/kich-ban-chuyen-nha/contract.md` `## Notes`,
`migration/hat-giong-goi-cheo-loi-dieu-phoi.md`, `migration/viec-kho-cu-b2.md`.

## 1. Việc của vòng, một đoạn

Kịch bản B1 dựng cây mới mà bộ kiểm của chính cây ấy không chạy: tệp kiểm trỏ thư mục sản phẩm ở chỗ cũ. Vòng này thêm
MỘT bước cơ học vào kịch bản — đổi đường dẫn và tên trong tệp kiểm (và các tệp chạy bộ kiểm) theo bảng xếp và bảng tên —, dựng
thước «giữ đủ khoá ca» để màu xanh không thể đến từ việc bớt ca, và đóng ba giới hạn B1 đã khai mà B2 dùng làm thước
(Ngoài-1, Ngoài-3, Ngoài-7) cùng một giới hạn của đợt (hồ sơ hoá cũ vì tệp trạng thái sống). Sửa ngữ nghĩa sản phẩm vẫn ở
kho cũ: phần vòng gọi chéo đã nhận, cộng mục K1 ở `migration/viec-kho-cu-b2.md`.

## 2. Số đo làm nền (14/11, Mac Studio, Node 24.16)

Khoá ca = dòng kết quả mà bộ chạy tự ghi (`.acceptance-runs/thoi-gian-ca/<bộ>-tron.tsv`, cột «giây<TAB>dòng PASS:/FAIL:»)
cho bốn bộ bash, dòng `ok`/`not ok` tầng ngoài của TAP cho bộ điều phối, một khoá cho bước bản đồ. So theo TÚI các khoá ĐẠT.

| Cây | Khoá đạt | Ghi chú |
|---|---|---|
| cũ `kit-cu/main` `593e6837` | **5 548** | 4 ca `scripts` đỏ trên máy này — một nguyên nhân, `GL07` (§7) |
| mới `don-nha/3.0` (B1, chưa đổi gì) | 248 | thiếu 5 302 ≈ 95 % — không phải 1 787 như báo cáo B1: báo cáo chỉ đếm dòng `FAIL`, ca không chạy tới vô hình; bộ `workflows` (1 036 ca) và bước bản đồ chết trước ca đầu |
| mới + 13 liên kết lối cũ ở gốc | — | phép thử HỎNG: bộ kiểm `cp -R` chép liên kết rồi sửa đột biến trên bản chép, ghi xuyên vào cây thật (76 tệp sản phẩm bị đổi). Lối «giữ liên kết lối cũ» loại |
| mới + nguyên mẫu đổi cơ học, lượt 1 | **3 475** | luật chung: chuỗi đường có thật ở cây cũ, dạng phần tử `path.join`, luật đổi tên của bước 3 |
| mới + nguyên mẫu lượt 2 | 2 746 | siết dạng `$BIẾN/` về một danh sách tên biến gốc → gãy tệp dùng tên khác (`WF`): −729 khoá |

Đọc: hướng cơ học đi được (248 → 3 475 bằng một lượt luật chung), nhưng phần dư (~2 074 khoá) rải trên ~130 tệp kiểm, mỗi
tệp một kiểu dựng bản sao kit trong thư mục tạm hay một tên biến gốc riêng; một luật siết sai mất hàng trăm khoá. Nên bước
mới gồm luật chung + một bảng vá theo tệp có ghim, và mỗi lần sửa luật phải đo lại túi khoá.

## 3. Bước 6 của kịch bản: bộ kiểm theo bố cục mới

Commit thứ sáu `dọn nhà 6/6: bộ kiểm theo bố cục mới` (năm commit cũ đổi tiêu đề thành `<k>/6`). Tập tệp: mọi tệp văn bản
dưới `tests/` TRỪ thư mục `fixtures/` (dữ liệu của kho tiêu thụ giả, không phải bố cục kit), cộng các tệp chạy bộ kiểm ở gốc:
`.github/workflows/*.yml`, `Makefile`, `_acceptance/config.yaml` (khoá `executors.*`). Ba lớp luật, áp theo thứ tự:

1. **Luật đường dẫn chung** (khai ở `bang-xep.json`, khoá mới `bo_kiem`): một chuỗi `<gốc cũ>/<đoạn>…` đổi theo bảng xếp khi
   (a) `<gốc cũ>/<đoạn>` có thật ở cây NGUỒN, (b) đứng sau một trong các neo khai sẵn — đầu chuỗi trong ngoặc, `../`, biến
   gốc kho, `HEAD:` —, và (c) không trùng một thư mục cạnh tệp kiểm. Dạng `<mã khác HEAD>:<đường>` (dựng bản cũ từ lịch sử)
   GIỮ — lịch sử mang bố cục cũ. Dạng phần tử `path.join(<biến gốc>, '<gốc cũ>', …)` và mảng toàn tên gốc dùng để dựng bản sao
   kit đổi cả mảng (nguồn và đích cùng bố cục mới).
2. **Luật đổi tên của bước 3** (`luatDoiChu`) áp nguyên lên cùng tập tệp.
3. **Bảng vá theo tệp** `migration/kich-ban/va-bo-kiem.json`: mỗi mục `{tep, cu, moi, so_lan, ly_do}`; áp sau hai lớp trên;
   `so_lan` khớp không đúng → kịch bản DỪNG «vá không khớp: <tệp>: <cu>» và không ghi nhánh. Bảng chỉ chứa phép thay chuỗi
   cơ học cho hình dạng luật chung không phủ — không chứa sửa ý nghĩa ca kiểm. Mục cần đổi ý nghĩa đi sang
   `viec-kho-cu-b2.md`.

Luật chung đếm chỗ khớp; tổng 0 trên nguồn thật → dừng (bảng xếp trỏ thứ không còn). Sổ `ket-qua/doi-bo-kiem.tsv`
(lớp · tệp · số chỗ) ghi mỗi lần chạy thật.

**Thước độc lập (đảo phép đổi):** trên mỗi tệp của tập, thay ngược CHỈ đường mới về đường cũ theo bảng xếp đảo và tên mới về
tên cũ theo bảng tên đảo — KHÔNG đảo mục bảng vá —; kết quả phải bằng bản gốc ở nguồn TỪNG BYTE. Vì không đảo bảng vá, một
mục vá chỉ qua được thước khi nó chỉ đổi đường và tên; mục đổi một số, xoá một assert, đổi một lệnh đều lộ thành «tệp kiểm
lệch luật: <đường>» — đó là răng giữ lời «bảng vá chỉ chứa phép thay cơ học». (Áp xuôi luật bằng mã riêng không làm được
việc này: nó phải áp cả bảng vá nên nhận mọi mục.) Chỗ đảo mơ hồ — đường mới vốn có sẵn ở bản gốc — khai đích danh ở
`migration/kich-ban/dao-mo-ho.tsv` (`tệp<TAB>chuỗi<TAB>lý do`), thước đếm và in, chỗ khai mà không còn thì đỏ. Mã riêng ở
`kiem-cho.mjs`, không nhập hàm của kịch bản. (Thước B1 AC-4 «mọi tệp không phải sản phẩm giống bản gốc» thu tập loại trừ đúng
bằng tập của bước 6.)

## 4. Thước giữ đủ khoá ca

`migration/kich-ban/giu-khoa.mjs <thư mục đo cây cũ> <thư mục đo cây mới>`:

- Đọc túi khoá như §2 cho mỗi cây; khoá = dòng kết quả bỏ tiền tố, cắt ở « — » hoặc « (», che đường thư mục tạm và mã commit.
  Khoá cây cũ đổi qua `bang-ten.json` (tên plugin, tên lệnh) trước khi so.
- Khoá cũ đổi thêm qua bảng xếp (đường cũ → đường mới trong chính khoá), vì bước 6 đổi cả chuỗi đường mà ca in ra.
- Luật: túi khoá ĐẠT của cây cũ ⊆ túi khoá ĐẠT của cây mới, trừ các khoá ghi trong `migration/kich-ban/bo-khoa.tsv`
  (`khoá<TAB>mã dòng sổ<TAB>lý do`, kỳ vọng: rỗng). Mỗi dòng phải mang mã một dòng sổ ghi lời chủ kho — máy không tự bỏ ca;
  dòng thiếu mã → đỏ. Thước nguồn thật chỉ ĐẠT khi danh sách rỗng; có dòng thì nó lên khối «CHƯA duyệt» của Cổng Bằng chứng.
  Ca SKIP, ca đỏ, ca không chạy tới ở cây mới đều tính THIẾU. Khoá thừa in ra, không đỏ.
- Túi khoá của hai cây (kèm băm tệp thô) commit vào `ket-qua/giu-khoa/`; thước nguồn thật chạy lại phép so trên chúng và đếm
  lại n, không đọc số từ báo cáo.
- Bộ không đọc được (thiếu tệp thời gian, thiếu dòng `XONG` ở `ketqua.tsv`) → không bao giờ tính là đủ: đỏ «bộ không đo được:
  <bộ>».
- Thoát 0 «giữ đủ: <n>/<n> khoá, bỏ <k>» · 1 «thiếu <m> khoá» kèm từng khoá · 2 không đọc được.

Fixture của ca kiểm do CHÍNH bên viết thật sinh: phía bash, một bộ chạy giả dùng `tests/bo-chay.sh` (`bc_tg_mo`/`bc_tg_dong`)
in vài dòng PASS/FAIL; phía điều phối, `node --test --test-reporter=tap` thật trên tệp ca sinh trong lượt (có test con, có
skip). Không viết tay tệp `.tsv` hay TAP.

## 5. Báo cáo lớp đỏ có chiều đỏ (Ngoài-3, Ngoài-7 của B1)

`phan-lop.py` thêm cột «không chạy tới» (khoá đạt ở cây cũ, vắng ở cây mới) và tính `do_them` từ túi khoá thay vì chỉ dòng
`FAIL`. Bộ chết ngầm — mã thoát ≠ 0 mà 0 dòng kết quả, tệp thời gian thiếu, `ketqua.tsv` thiếu dòng của bộ hay thiếu `XONG` —
là một mục đỏ có tên, và tổng không bao giờ in 0 khi có mục ấy. `do-lop-do.sh` ghi báo cáo vào tệp tạm, đối chiếu số học
(`lop-do.mjs`), rồi mới thay tệp cũ — lỗi giữa chừng để nguyên báo cáo đã chốt. Lệnh sáu bước đọc từ `.github/workflows/`
của CHÍNH cây được đo (việc `tests`) thay vì chép cứng ở `b0/chay.sh`; không đọc được → dừng.

## 6. Ba sửa nhỏ

- **Ngoài-1 (`--nhanh`):** chỉ nhận `don-nha/<tên>` (`^don-nha/[A-Za-z0-9._-]+$`). Tên khác → thoát 2 «nhánh đích phải là
  don-nha/<tên>: <tên>», không ref nào đổi. Chặn trước B3, vì B3 chạy kịch bản trên máy có `main`, `chuyen-nha`.
- **Tệp trạng thái sống:** thêm đích danh `migration/TRANG-THAI.md` vào `risk_tiers.t1_skip_globs` của `_acceptance/config.yaml`
  trên nhánh này. Không mã nào đọc tệp ấy (đã `git grep`); đo 14/11: trong năm tệp đổi sau lượt chấm B1 thì bốn đã miễn, tệp
  sống là tệp duy nhất làm hồ sơ B1 hoá cũ. Răng: ca chạy CHÍNH `scripts/pre-merge-check.sh` trên một kho fixture mang
  CHÍNH danh sách `t1_skip_globs` đọc từ tệp cấu hình thật — sửa tệp sống sau `verified_commit` → im; sửa một tệp của
  `migration/kich-ban/` → «evidence is stale» gọi tên hồ sơ.
- **Đỏ sẵn của nhánh:** `P177` đỏ vì hàng sổ `kich-ban-chuyen-nha#ngoai-r3-13` mang lớp `am-tinh-mot-minh` không có trong bảng
  lớp — đổi thành `khong-the-do` (lớp của bảng mà mô tả hàng khớp: «không có chiều đỏ chứng minh»). `KT-8`, `P122`, `P126`
  đỏ vì bản đồ chưa vẽ hồ sơ mới — vẽ lại cùng hồ sơ. `RT13` → kho cũ (K1).

## 7. Phụ thuộc và rủi ro

- **Vòng gọi chéo + K1.** Bộ kiểm cây mới chỉ xanh trọn khi `kit-cu/main` đã có: bảy chỗ lõi → điều phối, ba hằng tên cũ,
  `plugin-declare` (hạt giống), và K1 (`RT13`). Thi công B2 không chờ; lượt chấm chờ (Hỏi-3).
- **`GL07` đỏ cả ở cây cũ trên Mac Studio** (CI xanh) — đã tìm ra 14/11: ca cắt đầu ra ở 240 ký tự (`cut` trong
  `tests/scripts/repin-lane-lop-cu.test.mjs`), và `b0/chay.sh` đặt `TMPDIR` là một đường dài lồng trong thư mục kết quả, đẩy
  thông điệp ghim ra ngoài đoạn được so. Cùng tệp, `TMPDIR` dài → 1 đỏ; `TMPDIR` ngắn (`/tmp/g7.XXXX`) → 0 đỏ. Một nguyên
  nhân kéo bốn ca (`T04`, `eval-thay-boi.test.mjs` chạy lại nó). Sửa ở THƯỚC: lượt đo dùng một `TMPDIR` ngắn mỗi cây
  (`mktemp -d /tmp/b2-<cây>.XXXX`). Độ mong manh của ca ghi ở `viec-kho-cu-b2.md` §3 như việc nhỏ, không chặn.
- **Đuôi dày.** Ước bảng vá 100–400 mục. Timebox: sau năm lượt đo túi khoá mà phần thiếu vẫn > 5 % (≈ 280 khoá) không do kho
  cũ → dừng, trình lại hướng (lối B của Hỏi-2). Mỗi lượt đo ~1 giờ máy cho cây mới (cây cũ đo một lần mỗi nguồn).
- **Kho cũ đi tiếp.** Mục bảng vá lệch → kịch bản dừng to, gọi tên tệp; không có đường lệch im.

## 8. Ngoài vòng

Sửa sản phẩm ở kho cũ · cắt mốc 3.0, đẩy `don-nha/3.0` (B3) · cài đặt GitHub · đổi văn xuôi trong tài liệu sống · một nguồn
bố cục cho bộ kiểm (dãy C sau ngày cắt, nếu Hỏi-2 chọn lối A) · tách bộ kiểm theo plugin.
