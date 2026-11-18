# Mở phiên — máy nào cũng làm theo được

## Máy cần có

- `git`, và `gh` đã đăng nhập tài khoản có quyền đọc ghi kho `phanlemanh/delivery-loop` (kho riêng tư) và
  `phanlemanh/acceptance-gate-kit`.
- Node đúng **số chính ghi ở tệp `.nvmrc` của kho** (12/11: `24`). Từ vòng A1 các bộ chạy kiểm tự so và thoát mã 3 ngay khi
  máy lệch số chính — không còn «22 trở lên là được».
- `zsh`, `python3` 3.11 trở lên (công cụ khuôn của Repo Standards cần), `git` 2.38 trở lên nếu định dùng
  `git merge-tree --write-tree` (bản cũ hơn in lời hướng dẫn dùng lệnh, dễ đọc nhầm thành xung đột).
- Claude Code. Cài đặt của kho (`.claude/settings.json`) tự bật plugin `acceptance-gate`, `feature-loop`, `dieu-phoi`,
  `diagram-design` từ chợ CŨ `acceptance-gate-kit`, cùng `superpowers` — tới ngày cắt sang, kho này dùng kit bản cũ để chạy
  vòng của chính nó.
- Trước khi tin số phiên bản plugin đang chạy trên máy: in nguồn của chợ `acceptance-gate-kit` trong
  `~/.claude/plugins/known_marketplaces.json` và trong `~/.claude/settings.json`. Máy nào từng cài kit theo thẻ thì hai chỗ
  ấy trỏ một thư mục tại thẻ cũ, và lệnh cập nhật plugin sẽ HẠ bản mà vẫn báo thành công (đã dẫm 19/10).
- Cho B3 (không cần cho B1): bản kéo của kho tiêu thụ nhận đầu tiên, `phanlemanh/onehub-quy-hang`, và của
  `phanlemanh/crm-onehub`.

## Bước 1 — có kho trên máy

**Máy chưa có kho** (một lệnh, chạy một lần):

```bash
cd ~/dev && git clone https://github.com/phanlemanh/delivery-loop.git && cd delivery-loop && git remote add kit-cu https://github.com/phanlemanh/acceptance-gate-kit.git && git fetch kit-cu --tags && git switch chuyen-nha
```

**Máy đã có kho:**

```bash
cd ~/dev/delivery-loop && git switch chuyen-nha && git pull --ff-only origin chuyen-nha && git fetch kit-cu --tags
```

Kiểm ba điều, cả ba phải đúng trước khi sang Bước 2:

```bash
ls migration && git rev-parse origin/main kit-cu/main && bash tests/bo-chay.sh node
```

- dòng đầu có `BOI-CANH.md  KE-HOACH.md  MO-PHIEN.md  README.md  TRANG-THAI.md  b0`;
- hai mã commit giống nhau (khác nhau = kho cũ đã đi thêm → chạy lệnh cập nhật `main` ở `TRANG-THAI.md` SAU khi nhận giữ);
- dòng cuối kết bằng «khớp» (in «node lệch» = đổi bản Node rồi chạy lại).

Đã thử trọn bước này trên một thư mục trống ngày 12/11: kéo về có 30 thẻ và trọn lịch sử, cả ba điều đúng.

## Bước 2 — nhận giữ

Mở `migration/TRANG-THAI.md`. Nếu dòng «Đang giữ» không phải máy này: kiểm máy kia đã nhả —
`git log -1 --format=%s origin/chuyen-nha` phải bắt đầu bằng «migration: <tên máy kia> nhả»; không phải thì dừng, hỏi chủ kho.
Đã nhả thì sửa dòng «Đang giữ» thành tên máy này + ngày, thêm một dòng vào «Nhật ký giữ», commit, đẩy lên. Chỉ làm bước này
khi chủ kho đã bảo máy này làm tiếp.

## Bước 3 — mở phiên

Mở một phiên Claude Code mới, thư mục là kho `delivery-loop`, nhánh `chuyen-nha`. Phiên tự nạp `CLAUDE.md` và tệp chỉ đường
`.claude/rules/chuyen-nha.md` (đã thấy nó tự nạp ở một phiên trên MacBook Pro; chưa thử trên máy khác). Nếu phiên không tự nhắc tới đợt chuyển nhà, dán khối dưới:

---

Tôi là chủ kho. Đây là kho `delivery-loop`, kế nhiệm của `acceptance-gate-kit`, đang ở giữa đợt chuyển nhà.

Đọc theo thứ tự, trước mọi việc khác:
1. `migration/TRANG-THAI.md` — đang ở đâu, máy nào đang giữ, việc kế.
2. `migration/BOI-CANH.md` — ai đã quyết gì, luật của đợt, bẫy đã dẫm.
3. `migration/KE-HOACH.md` — mục 3 (bảng tên), 12, 13 và 14 là bản đang hiệu lực.
4. `CLAUDE.md` của kho — luật của kit vẫn áp nguyên.

Rồi trình tôi một tin: bản đồ **đã xong · đang dở · kế**, và đúng MỘT quyết định cần tôi kèm khuyến nghị. Đừng mở vòng nào
trước khi tôi gọi tên. Kho cũ `acceptance-gate-kit` vẫn là nguồn duy nhất của sản phẩm tới ngày cắt sang.

---

## Khi đẩy lên bị lỗi HTTP 400

Lần đẩy trọn lịch sử (56 MB) từng bị GitHub cắt giữa chừng. Sửa cho riêng kho này rồi đẩy lại:

```bash
git config http.postBuffer 524288000
```

Các lần đẩy thường ngày nhỏ, không cần.

## Hai máy nói chuyện bằng gì

Phiên ở máy này không nhắn được cho phiên ở máy kia. Kênh duy nhất của đợt là chính kho này: `TRANG-THAI.md` (đẩy lên rồi
máy kia kéo về) và, khi cần chủ kho thấy, một bình luận trên GitHub. Ghi nhớ của phiên không đi theo kho.
