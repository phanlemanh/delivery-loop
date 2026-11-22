# Đề bài vòng «sửa TCG-1 — nhánh chính kit đỏ» — soạn 22/11/2026

Chủ kho bảo mở ngày 22/11, nguyên văn «Mở phiên sửa TCG-1». Nơi chạy: một cây làm việc riêng dưới bản sao
`~/dev/delivery-loop-main`, nhánh cắt từ `origin/main` (`678572f0` lúc soạn).

## Bối cảnh

`delivery-loop` là kit nghiệm thu (engine); ba kho tiêu thụ đang dùng thẻ `v3.0.0`. Phiên mở vòng là «phiên giữ đợt»
ở nhánh `chuyen-nha` của bản kéo `~/dev/delivery-loop`: nó chỉ đọc kết quả, không duyệt cổng, không gộp thay. Vòng phải
chạy ở bản sao `~/dev/delivery-loop-main` vì bản kéo chính kia còn bật plugin chợ cũ.

Vòng «DL1 + P179» gộp vào `main` ngày 22/11 (PR #17, commit gộp `56bb22b1`, hai cha `50840764` + `ea7ca444`). Từ đó
job `tests` trên nhánh chính ĐỎ (lượt `gate` trên `56bb22b1` và `678572f0` đều failure): `tests/scripts/tcg-ban-do.test.mjs`
và `tests/scripts/tcg-mutants.test.mjs` hỏng ở ca «TCG-1 kho khong bat khong doi byte so ban truoc vong», thông điệp
«khong co ban truoc vong».

Gốc (phiên giữ đợt đọc ở `origin/main`, hàm `banTruoc()` của `tcg-ban-do.test.mjs`): ca dựng «bản trước vòng» bằng
`git merge-base HEAD origin/main`. Trên nhánh PR thì gốc chung là nhánh chính trước vòng, ca xanh. Trên chính nhánh
chính, gốc chung bằng HEAD, ca tự báo hỏng. Vì vậy lượt chấm và CI của PR #17 không thấy. Đây là lớp «thước đo trạng
thái của nhánh, không đo vật» — cùng họ với bất biến «Thước phải gắn vào vật được giao» ở `CLAUDE.md`. `tcg-mutants`
gọi lại ca này trên bản sao đã tiêm qua biến `TCG_GIT_GOC`.

Hệ quả: mọi lần đẩy lên `main` đều đỏ, và đường nền của mọi vòng kit sau sẽ đỏ sẵn. Chủ kho đã quyết «chỉ sửa đi lên,
không lùi»: không hoàn PR #17.

## Việc

Chạy vòng sửa kit theo quy trình của kho (`/feature-loop:feature-loop`). Trả lời chủ kho bằng tiếng Việt. Đích: `main`
xanh trở lại mà ca AC-1 của vòng `tep-sinh-khong-chan-gop` vẫn còn răng (phá vật thì đỏ, chạm thứ không phải vật thì im).

**Bước đầu, trước mọi việc khác:** kéo `origin/main` mới nhất làm gốc nhánh; kiểm phiên nạp đúng plugin `@delivery-loop`
3.0 và KHÔNG nạp plugin `@acceptance-gate-kit` nào. Thấy khác thì dừng và báo ngay.

Hướng sửa đã nêu (vòng tự cân, chủ kho quyết ở Cổng Phạm vi nếu có đánh đổi thật):

- **Ghim mã commit gốc của vòng** (`50840764`, cha thứ nhất của commit gộp PR #17): ca đo đúng vật của vòng ấy, không
  phụ thuộc nhánh đang chạy. Phiên giữ đợt nghiêng về hướng này. Cần cân: (a) CI phải có đối tượng commit ấy (độ sâu
  lấy về của `actions/checkout`); (b) một vòng SAU đổi đầu ra của `product-map` cho kho không bật thì ca ghim sẽ đỏ đúng
  — vòng phải nói rõ đó là hành vi mong muốn hay cần đường cập nhật mốc ghim.
- **Bỏ qua có tên khi HEAD là nhánh chính** (`test.skip` mang tên AC): rẻ, nhưng ca mất răng vĩnh viễn trên `main`.
- Hướng khác vòng tự tìm, ví dụ lấy cha thứ nhất khi HEAD là commit gộp.

Quét theo LỚP, không chỉ vá ca bị nêu tên: tìm trong `tests/` mọi ca khác dựng mốc so sánh từ `merge-base` với nhánh
chính hoặc từ trạng thái nhánh, và kê chúng (sửa trong vòng nếu cùng nhát, còn lại ghi hạt giống có dòng `Gốc:`).

## Luật phải giữ (đọc `CLAUDE.md`)

- Assertion âm-tính-một-mình không sống: ca sửa phải có đối chứng dương và ghim đúng thông điệp.
- Nghi thức hai chiều cho phép đo mới: phá vật thì đỏ; chạm thứ không phải vật thì im.
- **Rà riêng: ca sau khi sửa có XANH trên chính nhánh chính sau khi gộp không** — mô phỏng bằng cách chạy bộ kiểm ở một
  cây tách rời đặt HEAD = commit gộp thử (gộp `--no-ff` nhánh vòng vào `origin/main` trong cây tạm), không chỉ trên
  nhánh PR. Đây là đúng chỗ PR #17 lọt.
- Cân trên mọi kho: vòng này chỉ chạm `tests/` của kit thì kho tiêu thụ không đổi gì; nếu chạm engine thì phải nêu.

## Môi trường và bẫy đã dẫm

- Chạy công cụ của kit dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- Các vòng trước ở bản sao này: tác tử chấm chạy Node 26 trong khi kho ghim 24, lượt chấm bị BLOCKED. Kiểm trước Cổng
  Phạm vi; nếu vẫn thế thì nêu trên thẻ để chủ kho quyết cùng lượt. Không tự sửa `~/.zshrc`, không in nội dung tệp ấy.
- Định vị plugin khác qua `resolve-plugin.mjs` (ADR 0003), không ghép đường dẫn tay.
- Thư mục gốc của bản sao đang ở nhánh `va-chu-ky-giu-cho-lenh-gop` với hồ sơ nháp CHƯA COMMIT của vòng bản vá chữ ký
  giữ chỗ (tạm gác). Không đụng thư mục gốc, nhánh ấy, hay các tệp chưa commit ở đó. Cây `dl1-tep-sinh-khong-chan-gop-*`
  là của vòng đã gộp, không dùng.
- Ca `DP1-06 ban-chep` của `tests · dieu-phoi` từng chập chờn trên CI (chưa rõ vì sao): thấy đỏ ở ô ấy thì ghi lại,
  đừng tính là lỗi của vòng.
- Kho kit bật `gop_theo_loi_ky: true`: thẻ Cổng Bằng chứng in sẵn `gộp: khi CI xanh`; chủ kho ký và cho gộp một câu.

## Ràng buộc

- `main` chỉ đổi qua PR, gộp bằng commit gộp; không gộp dồn, không đẩy đè, không bật tự gộp của GitHub. Không chạy
  `/repo-setup:github`, không đổi cài đặt GitHub.
- KHÔNG cắt thẻ, KHÔNG tạo bản phát hành, KHÔNG cài lên kho tiêu thụ nào.
- Không đụng nhánh `chuyen-nha`, thư mục `migration/`, và PR #19, #20 (của phiên khác).
- Lời duyệt cổng do chủ kho gõ ở CHÍNH phiên của vòng; không phiên nào chuyển lời duyệt.
- Lượt gọi người theo trần thiết kế của hạng (T1: thoát ở S0 · T2: 3 · T3: 4). Sắp vượt trần thì dừng và báo.
- Lượt đo dài (chạy trọn bộ kiểm): được hai lượt không hỏi; lượt thứ ba phải hỏi chủ kho.
- Việc khác thấy trên đường: ghi hạt giống có dòng `Gốc:`, không làm. Không in nội dung `.env*`.

## Xong là

PR của vòng đã gộp vào `main` bằng commit gộp, VÀ lượt CI trên chính commit gộp đã chạy XONG và xanh ở job `tests`
(đọc tới khi xong, đừng dừng ở «còn chạy»). Báo cáo cuối nêu: số PR, mã commit gộp, kết quả CI trên commit gộp, hạng,
số lượt gọi người, số lượt chấm, hướng sửa đã chọn và vì sao, danh sách ca cùng lớp đã quét, phần để lại.
