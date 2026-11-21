# Đề bài vòng «DL1 + P179» — soạn 21/11/2026, chưa có phiên nào chạy

Chủ kho duyệt mở vòng này ngày 21/11 («Đổi theo đề xuất», `KE-HOACH-12-MUC-REPO-STANDARDS.md` mục 8). Phiên giữ đợt chưa
mở được phiên cho nó: ứng dụng chỉ cho mở phiên ở thư mục khác khi chủ kho tự bảo mở phiên. Tệp này giữ nguyên đề bài để
phiên mở sau dùng. Nơi chạy: một cây làm việc riêng dưới bản sao `~/dev/delivery-loop-main`, nhánh cắt từ `origin/main`.

## Bối cảnh

`delivery-loop` là kit nghiệm thu (engine) mà ba kho tiêu thụ đang dùng ở thẻ `v3.0.0`. Phiên mở vòng là «phiên giữ đợt»
trên cùng máy (Mac Studio), làm ở nhánh `chuyen-nha` của bản kéo `~/dev/delivery-loop`; nó chỉ đọc kết quả, không duyệt
cổng, không gộp thay. Ngày 21/11 chủ kho đổi thứ tự kế hoạch: ưu tiên các bản sửa rút ngắn đoạn bắt đầu → gộp, nên vòng
DL1 + P179 mở NGAY thay vì chờ sau mốc 3.1; chủ kho nới luật chiều rộng (b) cho đúng hai việc có tên là «DL1 + P179» và
«bản vá chữ ký giữ chỗ». Một mốc duy nhất quanh 02/12 sẽ mang cả hai cùng tính năng «lời gộp trong câu ký» tới kho tiêu
thụ, để mỗi kho chỉ cài và ghim lại bằng chứng một lần. Không cài trước 02/12 vì cửa sổ quan sát 14 ngày của mốc 3.0 ở
Inventory chưa hết; làm ra bản sửa thì không làm nhiễu cửa sổ ấy. Chủ kho chạy kit chủ yếu bằng phiên điều phối, nên thứ
chủ kho coi trọng là số lần phải gộp lại, ghim lại và chấm lại, không phải thao tác bấm gộp. Phải dùng bản sao
`~/dev/delivery-loop-main` chứ không dùng `~/dev/delivery-loop`: mọi phiên của ứng dụng đọc cài đặt từ bản kéo chính, và
bản kéo chính kia đang ở nhánh `chuyen-nha` còn bật plugin của chợ cũ. Vòng kế sau mốc ấy dự kiến là DL2, không thuộc
vòng này.

## Việc

Chạy vòng sửa kit «DL1 + P179» ở kho `delivery-loop`, đi đúng quy trình của kho (`/feature-loop:feature-loop`). Trả lời
chủ kho bằng tiếng Việt. Đích: rút ngắn đoạn từ bắt đầu tới GỘP ở kho tiêu thụ bằng cách bỏ hai chỗ ăn thời gian đã đo.

**Bước đầu, trước mọi việc khác:** kéo `origin/main` mới nhất làm gốc nhánh; kiểm phiên nạp đúng plugin `@delivery-loop`
3.0 và KHÔNG nạp plugin `@acceptance-gate-kit` nào. Thấy khác thì dừng và báo ngay, đừng chạy vòng bằng kit cũ.

### Phần 1 — DL1: tệp sinh và tệp cấu hình chung thôi gây xung đột ở mọi PR

- **Số đo** (phiên giữ đợt phát lại chỉ-đọc 21/11 trên `onehub-inventory` tại `8e0a91c9`, 168 lần gộp nhánh chính vào
  nhánh PR từ 10/11): không bộ gộp riêng 136 lần có xung đột; như hôm ấy 134, trong đó `LO-TRINH.html` 126; sau khi kho
  ấy thêm dòng gộp cho `LO-TRINH.html` (đã gộp 21/11) dự kiến còn 63, trong đó `_acceptance/config.yaml` 30 lần (17 lần
  là tệp duy nhất). Giới hạn của nhát ở phía kho: GitHub không chạy bộ gộp của máy nên trên web PR vẫn báo xung đột; PR
  mở trước khi dòng mới vào nhánh chính vẫn vấp ở lần gộp đầu; sau mỗi lần bộ gộp giữ bản của nhánh phải vẽ lại rồi
  commit.
- **Gốc đã ghi trong kho:** `docs/plans/2026-10-16-hat-giong-tep-sinh-xung-dot-moi-lan-goi.md` (bước 1 đã làm ở vòng
  `tep-sinh-khong-chan-gop`, bản 2.36.0; bước 2 «bật theo lựa chọn `ban_do.sinh_sau_gop`» chưa làm) ·
  `docs/plans/2026-10-30-hat-giong-tep-sinh-mot-hang-mot-dong.md` · hồ sơ `_acceptance/tep-sinh-khong-chan-gop/`. Trên
  nhánh `chuyen-nha` (đọc bằng `git fetch origin chuyen-nha` rồi `git show origin/chuyen-nha:<tệp>`):
  `migration/hat-giong-sau-goi-dl-ba-kho.md` (hàng DL1 và mục «Soi theo luật của kit»),
  `migration/hat-giong-giai-doan-2.md` mục 4.1 và mục 2, `migration/KE-HOACH-12-MUC-REPO-STANDARDS.md`.
- **Nội dung theo nguồn:** PR thôi phải ghi tệp tổng hợp (`PRODUCT-MAP.md`, `LO-TRINH.html`) — vẽ lại trên nhánh chính
  sau khi gộp; và lệnh kiểm của từng hồ sơ thôi dồn vào tệp chung `_acceptance/config.yaml` mà về hồ sơ của vòng ấy (mục
  K2). Việc đọc bậc sàn thiết kế khi sổ thành phần nằm ngoài git (giới hạn `out-of-git-manifest-lowers-kit-tier`) cùng
  họ: xét đưa vào, hoặc nêu lý do để ngoài.

### Phần 2 — P179: sổ giới hạn thiếu hàng thôi đốt lượt chấm

Gốc: `docs/plans/2026-10-18-hat-giong-so-known-limits-thieu-hang-p179.md` (ngưỡng đủ từ 26/10; đã đốt thêm một lượt chấm
ở mốc 3.0). Chỉ bản vá hẹp theo hạt giống, không mở rộng sổ.

## Luật phải giữ khi thiết kế (đọc `CLAUDE.md`)

- **Cân trên MỌI kho:** ba kho tiêu thụ (`onehub-inventory`, `onehub-quy-hang`, `crm-onehub`) đang ở bản 3.0.0 và có
  cùng các tệp này. Thứ tự chọn nghiệm: sửa đúng tầng → bộ đọc khoan dung kèm cờ vàng → bật theo lựa chọn → đổi mặc
  định. Đổi mặc định là mọi kho trả giá; nếu đề xuất đổi mặc định thì đó là câu hỏi cho chủ kho ở Cổng Phạm vi.
- Đổi hình dạng tệp hay khoá cấu hình phải có đường đọc-cũ và cờ vàng, không bắt kho nâng hàng loạt.
- `product-map --check` đang là một chốt kiểm có thật; đổi nghĩa của nó phải có ràng buộc cả hai chiều (phá vật thì đỏ;
  chạm thứ không phải vật thì im).
- Kho công khai: không chép chi tiết nội bộ của kho riêng tư `onehub-quy-hang` vào tệp hay PR nào.
- Hợp đồng vượt cỡ thì đề xuất tách ở Cổng Phạm vi (khuyến nghị thứ tự: phần tệp sinh trước, P179 thành vòng nhỏ
  riêng), chủ kho quyết.

## Môi trường và bẫy đã dẫm

- Chạy công cụ của kit dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- Hai vòng trước ở bản sao này, tác tử chấm chạy Node 26 trong khi kho ghim 24 và lượt chấm bị BLOCKED. Kiểm trước Cổng
  Phạm vi; nếu vẫn thế thì nêu trên thẻ Cổng Phạm vi để chủ kho quyết cùng một lượt. Không tự sửa `~/.zshrc`, không in
  nội dung tệp ấy.
- Phiên `moc-3-1` đang làm bản vá chữ ký giữ chỗ ở thư mục gốc của bản sao, nhánh riêng; nó chạm
  `plugins/dispatch/scripts/gop.mjs`, lệnh ký và hai khối dòng lệnh trong SKILL của feature-loop. Không đụng thư mục và
  nhánh của nó. Trước khi viết mã (S3), gộp `origin/main` vào nhánh mình nếu bản vá ấy đã gộp.
- Kho kit đã bật `gop_theo_loi_ky: true`: thẻ Cổng Bằng chứng in sẵn `gộp: khi CI xanh`; chủ kho ký và cho gộp trong
  một câu.

## Ràng buộc

- `main` chỉ đổi qua PR, gộp bằng commit gộp; không gộp dồn, không đẩy đè, không bật tự gộp của GitHub. Không chạy
  `/repo-setup:github`, không đổi cài đặt GitHub.
- KHÔNG cắt thẻ, KHÔNG tạo bản phát hành, KHÔNG cài lên kho tiêu thụ nào: bản sửa đi trong một mốc chung quanh 02/12, do
  một vòng mốc riêng cắt.
- Không đụng nhánh `chuyen-nha` và thư mục `migration/`.
- Lời duyệt cổng do chủ kho gõ ở CHÍNH phiên của vòng; không phiên nào chuyển lời duyệt.
- Lượt gọi người theo trần thiết kế của hạng (T2: 3 · T3: 4). Sắp vượt trần thì dừng và báo, không đi tiếp.
- Lượt đo dài (chạy trọn bộ kiểm): được hai lượt không hỏi; lượt thứ ba phải hỏi chủ kho.
- Việc khác thấy trên đường: ghi hạt giống có dòng `Gốc:`, không làm. Không in nội dung `.env*`.

## Xong là

PR của vòng đã gộp vào `main` bằng commit gộp. Báo cáo cuối nêu: số PR, mã commit gộp, hạng, số lượt gọi người, số lượt
chấm, bảng dự báo năm dòng, kho tiêu thụ phải làm gì khi nhận mốc, và phần nào bị tách hay để lại.
