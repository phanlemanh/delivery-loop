---
schema_version: 1
feature: Sửa TCG-1 — nhánh chính kit đỏ; bản trước vòng của TCG-1 và TCG-1-bat ghim vào commit cố định thay cho merge-base sống, để nhánh chính và mọi nhánh PR sau xanh mà ca vẫn còn răng
slug: tcg1-ghim-moc-truoc-vong
owner: phanlemanh@gmail.com
risk_tier: T2      # chỉ tests/scripts/ + thư mục hồ sơ; không khớp t3_paths, không khớp t1_skip_globs
surfaces: [cli]
status: approved
design_doc: docs/superpowers/specs/2026-11-22-tcg1-ghim-moc-truoc-vong-design.md
approved_by: Phan Le Manh
approved_at: 2026-11-22
---

# Acceptance Contract: tcg1-ghim-moc-truoc-vong

## Context

Chủ kho mở vòng ngày 22/11/2026 bằng câu «Mở phiên sửa TCG-1» và đã quyết «chỉ sửa đi lên, không lùi» (không hoàn PR
#17). Sau khi PR #17 gộp (commit gộp `56bb22b1`), job `tests` trên nhánh chính đỏ: `tcg-ban-do.test.mjs` và
`tcg-mutants.test.mjs`, thông điệp «FAIL: TCG-1 khong co ban truoc vong» (CI 44983327541 trên `678572f0`: 977 qua, 2 đỏ).
Hàm `banTruoc()` dựng bản trước vòng bằng `git merge-base HEAD origin/main` — trên nhánh chính gốc chung bằng HEAD;
trên mọi nhánh PR mở sau gộp, gốc chung đã chứa vòng nên TCG-1 xanh suông và TCG-1-bat đỏ (đo 22/11). Bản thiết kế,
mục 1–2.

Gốc: `_acceptance/tep-chung-khong-chan-gop/` — AC-1 của hồ sơ ấy là răng đang hỏng; vòng này giữ răng ấy.
Hạt giống của các ca cùng lớp ngoài nhát sửa: `docs/plans/2026-11-22-hat-giong-moc-so-sanh-theo-trang-thai-nhanh.md`.

Thuật ngữ:
- **mốc ghim** = commit `50840764d39b317d02eb4d881917bd128d67c86f` — cha thứ nhất của `56bb22b1`, nhánh chính ngay trước
  vòng `tep-chung-khong-chan-gop`; khai bằng một hằng trong `tests/scripts/tcg-ban-do.test.mjs`.
- **bản trước vòng** = `git archive` trọn `plugins/acceptance-gate` tại mốc ghim; **bản sau** = cây đang kiểm.
- **đầu nhánh chính** = sha của `origin/main` ở kho đang kiểm lúc chạy (vắng thì `main`).
- **hai cây thử** = hai bản clone tạm (clone riêng, không chạm ref của kho thật) dựng từ HEAD đang kiểm trong lượt chạy,
  mỗi bản có `refs/remotes/origin/main` đặt tường minh: (i) **cây PR** — HEAD cộng một commit rỗng; `origin/main` := đầu
  nhánh chính (tổ tiên của HEAD, khác HEAD); (ii) **cây gộp thử** — đầu nhánh chính rồi `git merge --no-ff` HEAD (HEAD đã
  nằm trong nhánh chính thì cây này là đầu nhánh chính); `origin/main` := HEAD của chính cây ấy (nhánh chính sau gộp).
- **bản ca trước sửa** = `tests/scripts/tcg-ban-do.test.mjs` ở commit cố định `678572f0` (nhánh chính lúc mở vòng).
- **răng** = `_acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh <nhóm>` — lệnh chấm của hồ sơ, tệp trong thư mục hồ sơ.

## Criteria

- AC-1: Given hai cây thử dựng từ HEAD đang kiểm, When chạy ca TCG-1 và TCG-1-bat của `tcg-ban-do.test.mjs` trong mỗi
  cây, Then cả hai ca xanh ở cả hai cây (bốn dòng «ok», «# fail 0»), và bản trước vòng chúng dùng là mốc ghim. Chiều đỏ
  trên cùng hai cây: bản ca trước sửa đỏ «khong co ban truoc vong» ở cây gộp thử và đỏ TCG-1-bat «phep so khong thay
  thay doi cua vong» ở cây PR. Răng in sha HEAD và `origin/main` của mỗi cây và ghim hai quan hệ trên; và đọc
  `.github/workflows/gate.yml`: mọi bước `actions/checkout` của job `manh` và job `tests` khai `fetch-depth: 0`.
- AC-2: Given hai cây thử, When chạy trọn `tcg-mutants.test.mjs` trong mỗi cây, Then thoát 0 với đúng 18 ca qua và 0 ca
  đỏ ở mỗi cây: TCG-10-M0 (đối chứng dương, mọi ca đích xanh trên bản sao chưa tiêm) · mười bốn nhát tiêm đều làm ca đích
  của nó đỏ đúng thông điệp ghim · ba nhát không phải vật giữ mọi ca đích xanh.
- AC-3: Given ba kho git để hỏi lịch sử (qua `TCG_GIT_GOC`) — (a) bản sao đủ lịch sử tại HEAD · (b) bản sao nông một
  commit, không có mốc ghim · (c) bản sao đủ lịch sử mà HEAD là commit mồ côi không có mốc ghim làm tổ tiên — When chạy
  TCG-1 và TCG-1-bat với vật là cây đang kiểm, Then (a) hai ca xanh; (b) và (c) hai ca ĐỎ (không bỏ qua), thông điệp
  chứa sha ghim, ở (b) chứa «khong co commit moc» và ở (c) chứa «khong phai to tien cua HEAD».
- AC-4: Given bản sao đã tiêm nhát `tat-di-nhanh-moi` của `tcg-mutants`, When TCG-1 đỏ, Then thông điệp đỏ chứa
  «lech byte», tên tình huống («tinh huong khop» — nhát chỉ chạm nhánh `--check`), sha ghim và câu đường cập nhật «vong doi dau ra co chu dich thi doi MOC_TRUOC_VONG ve goc
  cua vong do» — ghim bằng chính ghim thông điệp của nhát ấy trong `tcg-mutants.test.mjs`.
- AC-5: Given hạt giống `docs/plans/2026-11-22-hat-giong-moc-so-sanh-theo-trang-thai-nhanh.md`, When răng đọc nó, Then hạt
  giống có dòng `Gốc:` trỏ `_acceptance/tcg1-ghim-moc-truoc-vong`, kê ít nhất 14 ca dạng `tests/…:<dòng>`, và với MỖI ca,
  dòng được trỏ (±3 dòng) trong cây đang kiểm chứa một trong `merge-base`, `origin/main`, `origin/HEAD`, `HEAD~1`,
  `HEAD^` (đúng tập chuỗi của phép quét Trục D). Chiều đỏ trên
  cùng tệp: một bản sao hạt giống bị dời số dòng của một ca sang dòng không có các chuỗi ấy → răng đỏ gọi tên ca ấy.

## Coverage

Quét bằng `morphological-scan` (preset test-matrix), trục tự dựng từ hai họ mốc của kho.
- Trục A — HEAD đang ở: nhánh PR có commit trên nhánh chính | cây gộp thử `--no-ff` (= nhánh chính sau gộp) | commit
  gộp tổng hợp của sự kiện `pull_request` [thước CE: hai sự kiện `push`/`pull_request` của `.github/workflows/gate.yml`;
  `[SUY-TỪ-REPO: .github/workflows/gate.yml]`] → AC-1, AC-2
- Trục B — mốc ghim trong kho đang hỏi: có và là tổ tiên | vắng (clone nông) | có mà không là tổ tiên [thước CE: hai điều
  kiện `git cat-file -e` · `merge-base --is-ancestor`] → AC-3
- Trục C — vật: nguyên vẹn | phá (mười bốn nhát) | chạm thứ không phải vật (ba nhát) [thước CE: bảng `NHAT` + `IM` của
  `tcg-mutants.test.mjs`] → AC-2, AC-4
- Trục D — các ca cùng lớp trong `tests/`: cùng nhát (TCG-1, TCG-1-bat) | đỏ trên nhánh chính ngoài CI | xanh suông trên
  nhánh chính | đã neo lịch sử | đã ghim sha [thước CE: quét `grep -rnE "merge-base|origin/main|origin/HEAD|HEAD~1|HEAD\^"
  tests/` ngày 22/11] → AC-5
- Ô commit gộp tổng hợp của `pull_request` (A3): không AC riêng — gốc chung của nó với `origin/main` là đầu nhánh chính,
  cùng hình với cây PR; mốc ghim không phụ thuộc HEAD nên A3 không thêm tình huống mới.
- Later: sửa mười bốn ca cùng lớp ngoài nhát (hạt giống). Never: lùi về merge-base khi vắng mốc; bỏ qua có tên trên nhánh
  chính; lấy cha thứ nhất khi HEAD là commit gộp (sổ quyết định).

## Out of scope

- Sửa các ca cùng lớp ngoài hàm `banTruoc` (mười ba ca xanh suông hoặc bỏ qua và `luot-kiem-nhe-ca-cham.mjs`) — vào hạt giống.
- Sửa engine (`plugins/`), `.github/workflows/gate.yml` hay bất kỳ kho tiêu thụ nào — vòng này không đổi byte nào ngoài
  `tests/scripts/` và thư mục hồ sơ.
- Sửa cây hồ sơ đã ký `_acceptance/tep-chung-khong-chan-gop/` (hợp đồng, evals) cho khớp định nghĩa mốc mới.

## Notes

- Hồ sơ đã ký `tep-chung-khong-chan-gop` định nghĩa «bản trước vòng = merge-base HEAD origin/main» và E1 của nó mô tả
  mốc ấy. Từ vòng này, định nghĩa đúng là mốc ghim `50840764` ở trên; lệnh chấm của E1 (`rang/chay.sh TCG-1`) chạy cùng
  tên ca nên phán quyết không đổi. Chữ của hồ sơ đã ký giữ nguyên.
