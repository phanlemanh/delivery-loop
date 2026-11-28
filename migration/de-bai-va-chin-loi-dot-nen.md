# Đề bài vòng «vá lỗi đợt nen» — bảy chỗ sửa hẹp trong chín lỗi C1–C9 (CHỜ thẻ Mốc A)

Viết 28/11/2026, phiên giữ đợt (Mac Studio). Chủ kho bảo 28/11 ở phiên giữ đợt: «Mở sau Mốc A» — trả lời câu «Mở một vòng
vá các lỗi này sau thẻ Mốc A, trước V2a?». **Trạng thái: CHỜ.** Phiên của vòng chỉ mở sau khi thẻ của Mốc A (dự kiến
`v3.2.0`) đã gắn; gốc nhánh là `origin/main` lúc ấy.

Nguồn: đề xuất `migration/de-xuat-sua-chin-loi-dot-nen.md` (đọc bằng `git fetch origin chuyen-nha` rồi
`git show origin/chuyen-nha:<tệp>`) và hạt giống tổng kết đợt `nen` của `onehub-inventory` (PR #40 của kho kit; nếu chưa
gộp thì đọc ở nhánh `claude/tong-ket-dot-nen-inventory-c7f647`).

## Bối cảnh

- Đợt điều phối `nen` của Inventory (26–28/11) ghi chín lỗi kit C1–C9. Phiên giữ đợt đọc lại từng chỗ mã trên `main`
  `36d29fed` — cả chín khớp — rồi đo điều kiện xảy ra trên bốn kho (kit, Inventory, crm, Quỹ hàng). Kết luận: cả chín là
  lỗi mã kit; tám lỗi có điều kiện ở mọi kho.
- Mốc A chỉ nâng số và tài liệu, không sửa lỗi nào trong chín.
- Vòng này làm **bảy chỗ**: năm chỗ sửa hẹp (C1, C2, C3 phần thẻ, C4, C8 nửa hẹp) và hai cờ vàng (C6, C7). **Không làm:**
  C9 (thành khoá cấu hình, vào vòng sổ khoá V2a) · C5 (cần thiết kế — vòng này chỉ GHI hạt giống) · C8 nửa rộng (thiết kế
  «ghim lại theo mốc», giữ nguyên).

## Việc

Chạy vòng sửa kit theo quy trình của kho (`/feature-loop:feature-loop`). Trả lời chủ kho bằng tiếng Việt. Vòng tự đo lại mọi
con số dưới đây trước khi viết; số dòng là ở `36d29fed` và có thể đã trôi.

**Bước đầu, trước mọi việc khác:** kéo `origin/main` mới nhất làm gốc nhánh và xác nhận thẻ Mốc A đã có trên nó; kiểm phiên
nạp đúng plugin `@delivery-loop` và KHÔNG nạp plugin `@acceptance-gate-kit` nào. Thấy khác thì dừng và báo ngay.

| Lỗi | Chỗ trong mã | Sửa | Ràng buộc hai chiều |
|---|---|---|---|
| **C1** — eval có `cmd` là lệnh chữ không có `ref`; bước tổng hợp tự bịa nguồn cho dòng `verifier:` | `plugins/feature-loop/scripts/s4-args.mjs:137`, `:211–215` | Máy tự đặt `ref` = tệp lệnh mà `cmd` gọi; trường `ref:` tự khai trong `evals.yaml` nếu có thì giữ. Lệnh chữ không trỏ tệp nào: một dòng cảnh báo gọi tên và tệp args ghi rõ «không có nguồn» để bước tổng hợp không bịa | Eval lệnh chữ ra đúng đường dẫn tệp mà bên đọc bằng chứng nhận · eval `config:` giữ nguyên từng byte |
| **C2** — khối mang sang do tác tử viết, ô phán quyết thành «PASS (mang từ vòng N)», thẻ đếm 0 đạt | `plugins/feature-loop/workflows/acceptance-verify.js:2125–2140`; `plugins/acceptance-gate/scripts/gate-card.js:1094`, `:1162` | Khối mang sang do MÃ dựng từ dữ liệu đã có; khuôn ô đặt một chỗ có marker; bên đọc của thẻ nhận ô bắt đầu bằng `PASS` có dấu mang sang, kèm cờ vàng | Ô «PASS (mang từ vòng N)» được đếm · ô không phải PASS vẫn không được đếm · ca kiểm khứ hồi viết–đọc |
| **C3** — phán quyết PASS khi còn mục trong hợp đồng mức vừa, thẻ không in | `acceptance-verify.js:1888–1889`, `:2014` | Thẻ Cổng Bằng chứng in các mục ấy — đúng nội dung hạt giống KY3 (`docs/plans/2026-10-20-hat-giong-the-pass-giau-muc-trong-hop-dong.md`). KHÔNG đổi luật phán quyết | Có mục mức vừa thì thẻ in · không có thì thẻ như cũ từng byte |
| **C4** — nhả khoá không ghi sự kiện vào sổ đợt | `plugins/dispatch/scripts/ghi.mjs:101–114`, `do-lan.mjs:102–107`; đối chiếu `phat-lich.mjs:179` | `nhaKhoa` ghi sự kiện nhả (tài nguyên, phiên, mã thoát, giờ) | Có nhả thì có dòng · khoá không tồn tại thì không ghi · bên đọc sổ đợt hiện có không vỡ vì loại sự kiện mới |
| **C8 nửa hẹp** — hồ sơ đã ký chỉ đổi tệp chữ được miễn xét bằng chứng cũ, dù cùng PR đổi tệp mà phép của nó trỏ tới; câu NOTE hứa điều mã không làm | `plugins/acceptance-gate/scripts/pre-merge-check.sh:785–799`, `:1540–1546`; `plugins/acceptance-gate/lib/evidence-core.cjs:572` | Ở nhánh «chỉ đổi tệp chữ»: diff của PR chạm một mục `paths` của hồ sơ ấy thì coi là đổi vật và xét lại như trước #468. Hồ sơ không nằm trong diff vẫn KHÔNG bị đụng | PR đổi tệp phép trỏ tới + một dòng `decisions.jsonl` thì bị xét · PR chỉ đổi `decisions.jsonl` thì vẫn im, đúng dòng NOTE cũ |
| **C6** (cờ vàng) — `paths` trỏ tệp chưa có vẫn xanh | `s4-args.mjs:164`, `:186–198` | Soát từng mục `paths` của chính hồ sơ đang chấm trên danh sách tệp git, dùng lại hàm của hồ sơ `loc-paths-dong-mac-dinh`; mục không khớp tệp nào lên một dòng trên thẻ. Bỏ qua `evidence/**` của chính hồ sơ. Không chặn | Mục vắng thì có dòng · mục khớp thì im |
| **C7** (cờ vàng) — phép đo «từ điểm rẽ nhánh» xanh rỗng sau khi gộp | luật chữ ở `plugins/acceptance-gate/skills/acceptance/references/eval-executors.md:275` | `s4-args.mjs` soát tệp lệnh mà `cmd` gọi (dùng chung phép dò tệp lệnh của C1): thấy tự tính `merge-base` thì cờ vàng. Việc kit đưa mốc so cho lệnh qua biến môi trường là bề mặt mới — nêu ở Cổng Phạm vi | Tệp lệnh tự tính điểm rẽ thì có cờ · tệp lệnh dùng mốc được đưa thì im |

**Số đo 28/11 để vòng đối chiếu** (nhánh chính bốn kho, cửa sổ từ 01/11; Quỹ hàng chỉ nêu số đếm):

- C1: eval lệnh chữ — kit 74, Inventory 148, crm 12, Quỹ hàng 99; trong đó trỏ được một tệp lệnh có thật 74 · 148 · 10 · 94.
- C4: crm có 692 sự kiện cấp và 0 sự kiện nhả trong năm sổ đợt trên máy.
- C6: mục `paths` không khớp tệp nào ở đầu nhánh — 407 · 178 · 21 · 85 (chặn trên: gồm tệp đổi tên về sau).
- C7: 0 phép viết phép đo ấy ngay trong `cmd` ở cả bốn kho; hồ sơ gần đây có tệp lệnh gọi `merge-base` — 12 · 29 · 13 · 8.
  Soi chữ `cmd` sẽ bắt 0 ca, nên phải soi tệp lệnh.
- C8 nửa hẹp: lần gộp đã lọt — kit 0, Inventory 0, crm 1 (commit gộp `74a29a68`), Quỹ hàng 1. PR #137 của Inventory là ca
  đang mở.
- C8 nửa rộng: 76–83 % số lần gộp ở mọi kho chạm `paths` của một hồ sơ đã ký mà không chạm hồ sơ — lý do KHÔNG nới sang
  nửa này.

**Ghi một hạt giống, không làm — C5:** móc chặn lượt chấm (`plugins/dispatch/scripts/hook-chan-s4.mjs:47–56`, `:83–90`)
không đọc `resumeFromRunId`, trong khi chỉ dẫn của kit (`SKILL.md:551`) bảo chạy tiếp cùng lượt chấm. Hạt giống ở
`docs/plans/` có dòng `Gốc:`; hướng: lượt mang mã lần chạy, còn hạn thì cho đi; đi cùng «khoá biết lượt đã chết», sau khi
C4 cho số đo.

## Câu phải nêu ở Cổng Phạm vi (cùng một lượt)

- **Một vòng hay tách:** bảy chỗ sửa, mỗi chỗ hai chiều, vượt 12 tiêu chí thì đề xuất tách (ví dụ: lượt chấm và thẻ —
  C1, C2, C3, C6, C7 · cổng trước-gộp và sổ đợt — C8 nửa hẹp, C4). Nêu giá từng lối bằng lượt gọi và lượt đo dài.
- **Ngoại lệ luật chiều rộng (b):** đây là vòng sửa mã ngoài lộ trình đã phê 28/11, nằm giữa Mốc A và Mốc B. Chủ kho đã
  bảo «Mở sau Mốc A» ở phiên giữ đợt; lời xác nhận phải gõ ở chính phiên của vòng.
- **CỘNG cần phê đích danh (ADR 0018):** biến môi trường đưa mốc so cho lệnh (C7) · dòng mới trên thẻ (C3, C6, C7) · loại
  sự kiện mới trong sổ đợt (C4). Nêu từng cái, người hưởng, và lối không làm.
- **C8 nửa hẹp sửa một quyết định có ADR (0028, #468):** ghi một mục «Sửa» vào ADR, không viết lại lịch sử quyết định.
- **Cân trên mọi kho (luật 26/09):** với từng chỗ sửa, kho KHÔNG có sự cố được gì, mất gì; hành vi cũ có ai đang dựa
  không. Riêng C8 nửa hẹp: đo trên lịch sử ba kho xem bao nhiêu PR đã gộp sẽ bị kéo xét lại.
- **Hạng của vòng** (dự kiến T3 vì chạm cổng trước-gộp; trần 4 lượt gọi) và số lượt đo dài cần xin — xin một lần ở đây.

## Luật phải giữ (CLAUDE.md của kit)

- Không chỗ sửa nào đổi mặc định của kit. Thứ tự chọn nghiệm: sửa đúng tầng → bộ đọc khoan dung và cờ vàng → bật thêm theo
  lựa chọn.
- Assertion âm-tính-một-mình không sống: mỗi ca đỏ có đối chứng dương và ghim đúng thông điệp. Nghi thức hai chiều cho mọi
  phép đo mới (độ nhạy và độ đặc hiệu).
- Khe «máy ngôn ngữ viết → máy đọc» (C2): khuôn đặt MỘT chỗ có marker, ca kiểm khứ hồi rút từ bên viết đọc bằng bên đọc.
  Fixture do mã sinh trong chính lần chạy; đường dẫn suy từ vị trí script.
- Đổi dạng artifact phải có đường đọc cũ: báo cáo cũ mang ô «PASS (mang từ vòng N)» và sổ đợt cũ không có sự kiện nhả vẫn
  đọc được.
- Chữ hiện cho người theo bản luật ngôn ngữ mặt người (N1–N6) và `CONTEXT.md`.
- Kho công khai: không chép chi tiết nội bộ của kho riêng tư `onehub-quy-hang` vào tệp hay PR nào.
- Bài học DL2, DL6: ghi hàng sổ giới hạn cho mọi mục «ghi giới hạn» TRƯỚC khi trình thẻ Cổng Bằng chứng.
- Rà ca kiểm mới có chạy được TRÊN NHÁNH CHÍNH sau khi gộp không.

## Môi trường và bẫy

- Vòng chạy ở bản sao `~/dev/delivery-loop-main`, trong cây làm việc riêng cắt từ `origin/main`. Thư mục gốc bản sao đang
  ở nhánh `va-chu-ky-giu-cho-lenh-gop` — không đụng.
- Công cụ kit chạy dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- `s4-args` lấy nhánh `main` cục bộ (cũ) làm gốc so: truyền `--diff-base <mã origin/main>`.
- Trường `verifier:` của gói bằng chứng phải là đường dẫn tệp — chính là C1; tới khi vòng sửa xong thì vẫn phải dặn tay.
- Chờ CI dài bằng MỘT truy vấn GraphQL mỗi phút; không dùng `gh run watch` (bẫy hạn mức 28/11). Job `tests` trên commit gộp
  chạy lại trọn bộ kiểm, 47–58 phút.
- Kho kit bật `gop_theo_loi_ky: true` và, từ Mốc A, `feature_loop.ngoai_n_tu_dinh_tuyen: true`: mục ngoài hợp đồng máy tự
  định tuyến hiện trên thẻ thành dòng báo có lệnh đảo.
- Sổ đợt `nen` của Inventory (`.acceptance-runs/`, git bỏ qua) KHÔNG có trên máy này; ca thật để dựng fixture lấy từ mô
  tả trong hạt giống của PR #40, không đọc được sổ gốc.

## Ràng buộc

- Chỉ gộp vào `main` qua PR bằng commit gộp, khi chủ kho bảo ở chính phiên của vòng; không gộp dồn, không đẩy đè, không bật
  tự gộp. Không chạy `/repo-setup:github`, không đổi cài đặt GitHub.
- KHÔNG cắt thẻ, KHÔNG phát hành, KHÔNG cài lên kho tiêu thụ nào. Không sửa kho tiêu thụ nào.
- Không làm C9, C5 (ngoài hạt giống), C8 nửa rộng, hay các mục B1–B8 của PR #40. Việc khác thấy trên đường: ghi hạt giống có
  dòng `Gốc:`, không làm.
- Không đụng nhánh `chuyen-nha`, thư mục `migration/`, PR #21, PR #40, thư mục gốc bản sao, các cây làm việc cũ.
- Không sửa `~/.claude/settings.json`, cấu hình plugin của máy, hay tệp cấu hình shell khi chủ kho chưa nói ở chính phiên
  của vòng. Không in nội dung `.env*`.
- Lời duyệt cổng do chủ kho gõ ở CHÍNH phiên của vòng; không phiên nào chuyển lời duyệt.
- Lượt gọi người theo trần thiết kế của hạng. Sắp vượt trần thì dừng và báo.

## Xong là

PR gộp vào `main` bằng commit gộp VÀ CI trên chính commit gộp xanh ở job `tests`. Báo cáo cuối: số PR, commit gộp, hạng,
số lượt gọi người, số lượt chấm, từng chỗ trong bảy chỗ đã sửa hay để lại và vì sao, kết quả cân trên ba kho của C8 nửa
hẹp, tên hạt giống C5, và điều kho tiêu thụ sẽ thấy khác khi nhận mốc sau.
