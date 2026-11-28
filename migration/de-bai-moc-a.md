# Đề bài vòng «Mốc A» — cắt mốc gom DL2 + DL6 + V1

Viết 28/11/2026, phiên giữ đợt (Mac Studio). Chủ kho bảo 28/11 ở phiên giữ đợt: «Mở Mốc A» — trả lời câu «Mở Mốc A
(DL2 + DL6 + V1) bây giờ?». Mốc A là việc thứ hai của đề xuất chủ kho đã phê 28/11 (`migration/de-xuat-sau-dl6.md`, đọc
bằng `git fetch origin chuyen-nha` rồi `git show origin/chuyen-nha:migration/de-xuat-sau-dl6.md`, mục «Mốc A»).

Nơi chạy: một cây làm việc riêng dưới bản sao `~/dev/delivery-loop-main`, nhánh cắt từ `origin/main` (`36d29fed` lúc soạn).

## Bối cảnh

`delivery-loop` là kit nghiệm thu (engine). Phiên mở vòng là «phiên giữ đợt» ở nhánh `chuyen-nha` của bản kéo
`~/dev/delivery-loop`: nó chỉ đọc kết quả, không duyệt cổng, không gộp thay. Thư mục gốc bản sao đứng ở nhánh cũ
`va-chu-ky-giu-cho-lenh-gop` (`50840764`): đừng đụng.

**Thẻ gần nhất:** `v3.1.1` trỏ `1193bc22` — commit cuối của nhánh mốc, KHÔNG phải commit gộp (mục `3.1.1` của
`CHANGELOG.md` gọi là «lối B»: nhánh chính tiến giữa vòng nên thẻ gắn trước khi nhánh chính gộp vào nhánh).

**Cửa sổ của mốc** — phiên giữ đợt đo 28/11 bằng `git log --first-parent v3.1.1..origin/main`; vòng phải suy lại bằng công
cụ của hồ sơ mốc, đừng tin danh sách này:

| PR | Commit gộp | Chạm gói nào (số tệp dưới `plugins/`) |
|---|---|---|
| #27 `kit-reads-screen-ledger` | `b0f88c44` | `acceptance-gate` 3 · `feature-loop` 1 — mục 3.1.1 của CHANGELOG đã ghi «#27 vào mốc sau» |
| #29 PR mốc 3.1.1 | `263edf32` | phần còn lại của nhánh mốc sau commit thẻ |
| #32 `doi-soat-ban-giao` | `48590d28` | `dispatch` 7 |
| #34 `nang-repo-setup-0-10-4` | `4dcff578` | không tệp nào dưới `plugins/` (`.github`, `Makefile`, `mk`, `tools`…) |
| #37 DL2 `bang-chung-cu-theo-dau-vao` | `2956dae2` | `feature-loop` 4 |
| #38 DL6 `giam-sat-doc-ban-uy-quyen` | `a9b7cbe6` | `dispatch` 12 |
| #39 V1 `doi-ten-ban-uy-quyen` | `36d29fed` | `dispatch` 9 |
| #30 #31 #33 #35 #36 | — | chỉ tài liệu và hạt giống |

So thẻ với `origin/main`: `acceptance-gate` đổi 3 tệp, `dispatch` 17, `feature-loop` 4; `roadmap`, `knowledge`,
`diagram-design` không đổi. Số hiện tại: năm gói ở `3.1.1`, `diagram-design` ở `3.0.0`.

**Số của mốc do vòng chốt** theo luật đánh số của kho (nếp «minor cho bề mặt mới» ở mục 3.1.1 của CHANGELOG). Cửa sổ có bề
mặt mới (bộ đọc `governance/delegation.yaml` của DL6, bằng chứng cũ theo đầu vào của DL2), nên phiên giữ đợt dự kiến là
`3.2.0`; vòng tự đối chiếu rồi theo luật. Gói nào lên số cũng theo luật và tiền lệ 3.1.0/3.1.1.

**Khuôn:** hồ sơ mốc `_acceptance/release-3-1-1/` trên `main` (`chay.sh`, `do-dong-1.sh`, `gop-thu.sh`, `dinh-moc.txt`) và
mục `3.1.1` của `CHANGELOG.md`. Dùng lại cách làm và công cụ ấy, đừng dựng đường thứ hai. Mốc phát hành không dựng răng
dùng-một-lần (`GUIDE.md` mục 7.1).

**Kho chờ nhận** (đo 28/11 trên nhánh chính từng kho): `onehub-inventory` ghim `v3.1.1` · `crm-onehub` ghim `v3.1.1` ·
`onehub-quy-hang` ghim `v3.0.0`. Inventory là kho nhận chắc chắn của Mốc A; hai kho còn lại chủ kho quyết ở phiên giữ
đợt. Vòng này KHÔNG đụng kho tiêu thụ nào. Đề bài nâng kit của từng kho (kèm bảng khoá soạn tay) do phiên giữ đợt viết
sau khi thẻ có — vòng này không soạn bảng ấy.

## Việc

Chạy vòng theo quy trình của kho (`/feature-loop:feature-loop`, tên hồ sơ theo số mốc, ví dụ `release-3-2-0`). Trả lời chủ
kho bằng tiếng Việt. Đích: một thẻ mới mang mọi thứ trong cửa sổ, gói lên số theo luật, `CHANGELOG.md` có mục của mốc, và
`kiem-ban-cai.mjs --ref <thẻ>` đạt.

**Bước đầu, trước mọi việc khác:** kéo `origin/main` mới nhất làm gốc nhánh; kiểm phiên nạp đúng plugin `@delivery-loop`
và KHÔNG nạp plugin `@acceptance-gate-kit` nào. Thấy khác thì dừng và báo ngay.

**Chiến dịch ghim lại của mốc** (`GUIDE.md` mục 7.1, một chiến dịch cho mỗi bản phát hành):

- Hồ sơ đã ký `giam-sat-doc-ban-uy-quyen` (DL6) hoá cũ sau V1 và CHƯA ghim lại. Chủ kho đã duyệt ở Cổng Phạm vi của V1 là
  ghim lại nó trong chiến dịch Mốc A. Phiên V1 báo: các ca `UQ-…` của DL6 nay đọc tên mới, và `rang/chay.sh` của V1 gọi lại
  cả mười tiêu chí của DL6, đều đạt trên cây mới — vòng đo lại, đừng chép lời báo.
- Vòng tự đo mọi hồ sơ đã ký khác hoá cũ trong cửa sổ và xử lý theo đúng nghi thức của kit: ghim lại theo diff, một làn
  máy nhiều chữ ký, làn ghim lại chạy lại eval của CHÍNH hồ sơ. Không sửa tay hồ sơ đã ký ngoài đường ghim lại của kit.
  Hồ sơ nào không ghim lại thì nêu tên và lý do trên thẻ.

**Ghi một hạt giống, không làm:** dòng `gio-may` của `do-vong` tính lẫn bản ghi của các phiên khác chạy cùng giờ, nên giờ
máy và token của vòng V1 bị cao hơn thực (phiên V1 báo 28/11, chưa viết thành tệp). Viết thành hạt giống ở `docs/plans/`
có dòng `Gốc:` trỏ `_acceptance/doi-ten-ban-uy-quyen/`, đi cùng PR mốc. Hệ quả cho chính vòng này: dòng token và phút máy
của hồ sơ mốc có thể mang cùng lỗi — nêu giới hạn ấy cạnh con số, đừng sửa thước trong vòng mốc.

## Câu phải nêu ở Cổng Phạm vi (cùng một lượt)

- **Bản phát hành GitHub cho thẻ mới** — việc công khai, nên là câu hỏi cho người. Hiện `3.1.1` là Latest, `3.0.0` có bản
  phát hành, `3.1.0` chỉ có thẻ. Nêu một khuyến nghị và hệ quả từng lối.
- **Kho kit bật `feature_loop.ngoai_n_tu_dinh_tuyen: true`** trong `_acceptance/config.yaml` của chính kho kit. Đề xuất đã
  phê xếp nó vào nhóm «bật ngay, không sửa engine», chủ kho quyết ở vòng tương ứng — tức vòng này. Nêu: lợi ích bằng số
  đo từ lịch sử của kho kit (số mục ngoài hợp đồng mà chủ kho phải định tuyến tay ở các vòng gần đây), đánh đổi, cách đảo
  (xoá một dòng), và nó đi cùng PR mốc hay một PR riêng sau thẻ. Khoá này là cấu hình của kho kit, không đi theo thẻ tới
  kho tiêu thụ.
- **Thẻ gắn vào đâu:** commit gộp của PR mốc (tiền lệ 3.1.0) hay commit cuối nhánh mốc (lối B của 3.1.1) — vòng theo luật
  của kho và nêu lối đã chọn kèm lý do; không cần hỏi riêng nếu luật đã định.
- **Hạng của vòng** và trần lượt gọi tương ứng (dự kiến T2, trần 3). Mốc phát hành đi làn V theo tiền lệ 2.5.0/2.7.0, mục
  tiêu ≤ 1 lượt gọi ngoài chữ ký.

Mọi mục khác trên thẻ thì phân loại theo luật «lời mời cổng chỉ chứa điều-chỉ-người-biết» ở `CLAUDE.md`.

## Luật phải giữ (đọc `CLAUDE.md`)

- **Năm dòng số của luật chiều rộng (c)** vào hồ sơ mốc, theo khuôn `release-3-1-1`, cho từng vòng trong cửa sổ. Dòng 1
  tách làm-xong→ký và ký→gộp; nửa ký→gộp đo bằng `dieu-phoi.mjs dem` (`ky_den_gop`), không chép lời báo. Phiên giữ đợt đã
  đối chiếu riêng cho V1: ký `192b9ce3` 10:03, gộp `36d29fed` 10:12 (+07) — dùng để soát, không thay phép đo.
- Dòng hiệu chuẩn `ĐẠT đã ký → prod đỏ: k / N` (ADR 0020) theo khuôn mốc trước; N không tăng thì ghi đúng như vậy.
- Assertion âm-tính-một-mình không sống; nghi thức hai chiều cho phép đo mới.
- **Rà riêng: bộ kiểm có XANH trên commit gộp thử không** — theo `gop-thu.sh` của khuôn (cây tách rời, HEAD = gộp
  `--no-ff` nhánh vòng vào `origin/main`).
- **Cân trên mọi kho (luật 26/09):** mục của mốc trong CHANGELOG và ghi chú phát hành có phần «Kho tiêu thụ làm gì khi
  nhận», nêu rõ: kho KHÔNG có `governance/delegation.yaml` đổi hành vi gì (DL6 đo ba ca chiều im: có remote, không
  remote, mất mạng); kho không cài gói `dispatch` đổi gì; DL2 đổi gì ở kho chưa bật khoá nào; tệp nào của khối
  INIT-CI-COPY-LIST đổi (kho nhận phải chép lại lớp CI hay không).
- **Tên khoá của bản uỷ quyền trong mọi chữ của mốc là bộ tên tiếng Anh sau V1** (`version`, `delegated`, quyền
  `merge` · `merge-order` · `session` · `reassign-row` · `open-lane` · `shared-ruling` · `roadmap`…). Không tài liệu nào
  của mốc dạy người đọc gõ tên cũ; tên cũ chỉ được nhắc ở câu «tệp còn tên cũ bị từ chối cả tệp».
- Kho công khai: không chép chi tiết nội bộ của kho riêng tư `onehub-quy-hang` vào tệp hay PR nào.
- Bài học DL2 và DL6: sổ giới hạn thiếu hàng (ca P179) làm đỏ lượt chấm và CI sau chữ ký — ghi hàng sổ cho mọi mục «ghi
  giới hạn» TRƯỚC khi trình thẻ Cổng Bằng chứng.

## Môi trường và bẫy đã dẫm

- Công cụ kit chạy dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- `s4-args` lấy nhánh `main` cục bộ (cũ) làm gốc so: truyền `--diff-base <mã origin/main>`.
- Trường `verifier:` của gói bằng chứng phải là đường dẫn tệp.
- Định vị plugin khác qua `resolve-plugin.mjs` (ADR 0003), không ghép đường dẫn tay.
- Kho kit bật `gop_theo_loi_ky: true`: thẻ Cổng Bằng chứng in sẵn `gộp: khi CI xanh`; chủ kho ký và cho gộp một câu.
- **CI trên commit gộp:** ma trận `tests · …` bị bỏ qua khi đẩy vào `main`, nhưng job gộp `tests` chạy lại TRỌN bộ kiểm
  nối tiếp, 47–58 phút ở ba lượt gần nhất. «Xong» chỉ tính khi job ấy xanh.
- **Bẫy hạn mức 28/11:** `gh run watch` với khoảng nghỉ ngắn trong ~50 phút đã dùng hết hạn mức REST của cả tài khoản
  (5000/5000), chặn luôn phiên khác. Chờ CI dài bằng MỘT truy vấn GraphQL mỗi phút
  (`gh api graphql` với `statusCheckRollup` trên mã commit); không dùng `gh run watch`.
- PR #40 (`claude/tong-ket-dot-nen-inventory-c7f647`, chỉ tài liệu: một hạt giống ở `docs/plans/` và
  `_acceptance/o-chi-mo-khi-co-neo-ngoai/opportunity.md`) đang mở, CI xanh. Không đụng nó. Nó gộp giữa vòng thì nhánh
  chính tiến: xử lý theo luật ghim lại của kho và tiền lệ lối B của 3.1.1, nêu trên thẻ.
- Ca `DP1-06 ban-chep` của `tests · dieu-phoi` từng chập chờn trên CI: thấy đỏ ở ô ấy thì ghi lại, đừng tính là lỗi vòng.

## Ràng buộc

- `main` chỉ đổi qua PR, gộp bằng commit gộp, khi chủ kho bảo ở chính phiên này; không gộp dồn, không đẩy đè, không bật
  tự gộp của GitHub. Không chạy `/repo-setup:github`, không đổi cài đặt GitHub.
- Thẻ chỉ gắn theo luật của kho (xem câu «thẻ gắn vào đâu»). Bản phát hành GitHub chỉ tạo khi chủ kho trả lời «có» ở Cổng
  Phạm vi.
- KHÔNG cài lên kho tiêu thụ nào. KHÔNG viết `governance/delegation.yaml` vào kho nào. Không sửa engine trong vòng mốc:
  thấy lỗi engine thì dừng và báo, không vá kèm.
- Không đụng nhánh `chuyen-nha`, thư mục `migration/`, PR #21, PR #40, thư mục gốc bản sao, các cây làm việc cũ dưới
  `.claude/worktrees/`.
- Không sửa `~/.claude/settings.json`, cấu hình plugin của máy, hay tệp cấu hình shell khi chủ kho chưa nói ở chính phiên
  này. Không in nội dung `.env*`, không in nội dung tệp cấu hình shell.
- Lời duyệt cổng do chủ kho gõ ở CHÍNH phiên này; không phiên nào chuyển lời duyệt.
- Lượt gọi người theo trần thiết kế của hạng. Sắp vượt trần thì dừng và báo.
- Lượt đo dài (chạy trọn bộ kiểm): hai lượt không hỏi; lượt thứ ba phải hỏi chủ kho.
- Việc khác thấy trên đường: ghi hạt giống có dòng `Gốc:`, không làm.

## Xong là

PR mốc gộp vào `main` bằng commit gộp; CI trên chính commit gộp chạy XONG và xanh ở job `tests`; thẻ mới trỏ đúng commit
theo luật; `kiem-ban-cai.mjs --ref <thẻ>` đạt; bản phát hành GitHub theo lời chủ kho. Báo cáo cuối nêu: số PR, commit gộp,
kết quả CI, thẻ và commit nó trỏ, gói nào lên số, năm dòng số và dòng hiệu chuẩn, hồ sơ nào đã ghim lại, số lượt gọi
người, số lượt chấm, khoá `ngoai_n_tu_dinh_tuyen` đã bật hay chưa, việc kho nhận phải làm khi nhận (kèm tệp lớp CI nào
đổi), và phần để lại.
