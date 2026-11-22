# Sửa TCG-1 — ghim bản trước vòng vào một commit cố định

**Ngày:** 2026-11-22 · **Hồ sơ:** `_acceptance/tcg1-ghim-moc-truoc-vong/` · **Hạng:** T2 (chỉ chạm `tests/scripts/` và
thư mục hồ sơ; không chạm engine `plugins/`, không chạm `t3_paths`).

## 1. Chuyện gì đang hỏng

Sau khi PR #17 (vòng `tep-chung-khong-chan-gop`, commit gộp `56bb22b1`, hai cha `50840764` + `ea7ca444`) gộp vào `main`,
job `tests` trên nhánh chính đỏ ở hai lượt liên tiếp (`56bb22b1`, `678572f0`). Lượt trọn trên `678572f0` (CI
44983327541): 977 ca qua, **2 tệp đỏ** — `tests/scripts/tcg-ban-do.test.mjs` và `tests/scripts/tcg-mutants.test.mjs`,
cùng một thông điệp «FAIL: TCG-1 khong co ban truoc vong». Ngoài hai tệp ấy nền xanh — con số này thay cho lượt đường
nền của vòng (sổ quyết định ghi lý do).

Gốc: hàm `banTruoc()` dựng «bản trước vòng» bằng `git merge-base HEAD origin/main`. Đó là mốc **của trạng thái
nhánh**, không phải của vật:

| HEAD đang ở | merge-base | TCG-1 | TCG-1-bat |
|---|---|---|---|
| nhánh của vòng tep-chung, trước gộp | nhánh chính trước vòng | đo đúng | đo đúng |
| nhánh chính sau gộp | = HEAD | **đỏ** «khong co ban truoc vong» | **đỏ** |
| mọi nhánh PR mở SAU gộp | nhánh chính đã chứa vòng | **xanh suông** (so mã của vòng với chính nó) | **đỏ** «phep so khong thay thay doi cua vong» |

Hàng ba đo ngày 22/11: cây `origin/main` + một commit rỗng → TCG-1 ✔, TCG-1-bat ✖. Tức mốc cũ không chỉ làm nhánh
chính đỏ mà làm đỏ cả **mọi PR kế tiếp** của kit — đường nền của mọi vòng sau đỏ sẵn. `tcg-mutants` gọi lại các ca
này trên bản sao đã tiêm (qua `TCG_GIT_GOC`), nên đỏ theo.

## 2. Hướng chọn — ghim commit cố định `50840764`

Lời hứa của AC-1 của hồ sơ `tep-chung-khong-chan-gop` là của **một vòng**: «vòng ấy không đổi byte cho kho không
bật». Mốc đúng là nhánh chính ngay trước vòng ấy — `50840764`, cha thứ nhất của commit gộp PR #17 — và mốc ấy không đổi
theo nhánh đang chạy. Tiền lệ của kho, cùng lớp: `dieu-phoi-lop-mod` (DP6-03, hằng `MOC_BAN_CU` = `08ba287d`),
`ho-so-khep-thoi-hoi` (`hskt.test.mjs` neo cha của commit đầu), `lenh-bam-duoc.test.mjs` («SHA CỐ ĐỊNH»). Luật tách
hai họ lời hứa đã ghi ở sổ `dieu-phoi-lop-mod`: lời hứa «nhánh này không đổi X» giữ merge-base sống; lời hứa của một vòng
đã gộp thì neo cố định.

Thay đổi, chỉ trong `tests/scripts/tcg-ban-do.test.mjs`:

- Hằng `MOC_TRUOC_VONG = '50840764d39b317d02eb4d881917bd128d67c86f'` kèm chú thích nguồn gốc (cha thứ nhất của
  `56bb22b1`) và đường cập nhật (mục 3b).
- `banTruoc()` bỏ dò nhánh chính và merge-base. Nó kiểm (i) commit ghim có trong kho (`git cat-file -e <sha>^{commit}`),
  (ii) là tổ tiên của HEAD (`git merge-base --is-ancestor <sha> HEAD`); thiếu một trong hai → trả lỗi gọi tên sha và
  việc cần làm. Rồi `git archive <sha> plugins/acceptance-gate` như cũ.
- Thông điệp «lech byte» của TCG-1 thêm sha ghim và câu đường cập nhật, để người đọc màu đỏ biết đó là so với mốc nào.
- `tcg-mutants.test.mjs`: ghim thông điệp của nhát `tat-di-nhanh-moi` siết thành chuỗi có sha ghim (thông điệp mới
  phải thật sự in ra, không chỉ «lech byte»).

Không lùi về merge-base khi vắng mốc, không bỏ qua: lùi là quay lại mốc đã chứng là hỏng; bỏ qua là xanh-suông
(assertion âm-tính-một-mình).

**Nói thẳng hệ quả:** đầu «trước» ghim cố định, đầu «sau» là cây đang kiểm — nên từ vòng này TCG-1 đo một **bất biến
thường trực** («kho không bật: mã đang kiểm cho cùng byte với `50840764`»), không còn là lời hứa của riêng vòng
tep-chung. Đó là cái giá bắt buộc của đích «AC-1 vẫn còn răng»: hai lối giữ ca là lời hứa của một vòng — ghim cả hai đầu
(`50840764` so `56bb22b1`) hoặc cho ca nghỉ sau gộp — đều làm nhát `tat-di-nhanh-moi` (phá `product-map.mjs` đang kiểm)
xanh, tức mất răng.

**Hằng sha hay neo lịch sử.** Tìm commit gộp «Merge pull request #17» trong lịch sử rồi lấy cha thứ nhất (khuôn
`can-cu-s1.ca.mjs`) cho ra đúng cùng `50840764` — không đổi phán quyết nào — mà thêm một cách gãy (gộp squash hay chữ
commit gộp khác thì tìm rỗng). Chọn hằng sha.

## 3. Hai điểm đề bài bảo cân

**(a) CI có đối tượng commit ghim không.** `.github/workflows/gate.yml` khai `fetch-depth: 0` cho job mảnh (`manh`,
chạy ở cả `pull_request` lẫn `push`) và cho lượt trọn của job `tests` khi đẩy lên nhánh chính; răng E1 đọc tệp ấy và
ghim điều này; `50840764` là tổ tiên của mọi nhánh cắt từ nhánh chính hôm nay. Không sửa CI.
Máy clone nông chạy bộ kiểm → hai ca đỏ có tên, gỡ bằng `git fetch --unshallow` — không im.

**(b) Vòng sau đổi đầu ra `product-map`/`start-scan` cho kho không bật.** Ca ghim sẽ đỏ «lech byte … so voi moc ghim
50840764». Đó là **hành vi mong muốn**: vòng ấy đang phá lời hứa của AC-1 và phải nói ra. Đường cập nhật: vòng ấy dời
`MOC_TRUOC_VONG` về gốc của chính nó (một dòng diff, hiện ở Cổng của vòng ấy). Tiền lệ: `ho-so-da-ky-giu-tuoi` dời
bản trước vòng `77b3750e` → `8fe79f1f` khi RD1 đổi bộ vẽ. Thông điệp đỏ in câu ấy.

## 4. Lớp lỗi — quét `tests/` (22/11)

Cùng nhát sửa (cùng hàm `banTruoc`): TCG-1, TCG-1-bat. Các ca khác dựng mốc so sánh từ trạng thái nhánh, kê ở hạt
giống `docs/plans/2026-11-22-hat-giong-moc-so-sanh-theo-trang-thai-nhanh.md`: một ca ĐỎ trên nhánh chính nhưng không
chạy ở CI (`tests/scripts/luot-kiem-nhe-ca-cham.mjs`) và mười ba ca XANH SUÔNG hoặc BỎ QUA trên nhánh chính (so một cây
với chính nó). Không sửa trong vòng này — luật đóng băng meta-work của `CLAUDE.md`: phát hiện mới vào sổ.

Ba ca cùng lớp đã có neo lịch sử (tìm commit gộp của PR trong lịch sử — `can-cu-s1.ca.mjs`, SDT-07, DP8-11, DP6-07)
đúng trên nhánh chính; hơn hai mươi ca đã ghim sha cố định là tiền lệ.

## 5. Rà riêng — xanh trên cây gộp thử

PR #17 lọt vì lượt chấm và CI của PR chỉ chạy trên nhánh PR. Răng vòng này (`rang/do.sh`) dựng HAI bản clone tạm
(clone riêng, không `git worktree`, để không chạm ref của kho thật) từ HEAD đang kiểm, và **đặt tường minh**
`refs/remotes/origin/main` trong mỗi clone — vì chính `origin/main` là mốc trạng thái nhánh mà vòng này sửa:
(i) **cây PR** — HEAD cộng một commit rỗng; `origin/main` := đầu nhánh chính thật lúc chạy (`origin/main` của kho, vắng
thì `main`); (ii) **cây gộp thử** — từ đầu nhánh chính thật, `git merge --no-ff` HEAD (HEAD đã nằm trong nhánh chính thì
cây (ii) là đầu nhánh chính); `origin/main` := chính HEAD của cây ấy (mô phỏng nhánh chính sau gộp). Răng in sha HEAD và
sha `origin/main` của mỗi cây và ghim hai quan hệ: ở cây gộp thử `origin/main` == HEAD; ở cây PR `origin/main` là tổ tiên
của HEAD mà khác HEAD. Chạy ca ở cả hai. Đối chứng chiều
đỏ dùng bản tệp ca TRƯỚC sửa ở commit cố định `678572f0` (không dùng `origin/main`, để răng không mắc chính lớp nó
sửa): bản ấy phải đỏ «khong co ban truoc vong» trên cây (ii) và đỏ TCG-1-bat trên cây (i).

## 6. Không đổi

- Engine (`plugins/`), CI, ba kho tiêu thụ: không đổi byte nào. Kho tiêu thụ không chạy `tests/` của kit.
- Hồ sơ đã ký `tep-chung-khong-chan-gop` giữ nguyên: định nghĩa «bản trước vòng = merge-base …» trong hợp đồng và chữ
  `expected` của E1 nay mô tả mốc cũ — là chữ của hồ sơ đã ký, không đổi phán quyết của `rang/chay.sh TCG-1` (lệnh chấm
  vẫn chạy cùng tên ca). Vòng này ghi điều ấy ở Notes của hợp đồng mình, không sửa cây hồ sơ đã ký.

## 7. Bảng dự báo năm dòng

| Dòng | Dự báo | Vì sao |
|---|---|---|
| làm-xong→gộp-được | ↓ | nhánh chính xanh lại, đường nền vòng sau không đỏ sẵn |
| lượt gọi người/vòng | = | vòng này T2: Cổng Phạm vi (có câu Node) + Cổng Bằng chứng |
| vòng bị hạ tầng đốt lượt | ↓ | hết đỏ sẵn ở TCG-1/TCG-1-bat |
| token máy/vòng | = | |
| phút máy/lượt chấm | = | |

Điều kiện tin cậy: đường verdict không đổi thành phần.
