# Mở phiên — máy nào cũng làm theo được

## Máy cần có

- `git`, và `gh` đã đăng nhập tài khoản có quyền đọc ghi kho `phanlemanh/delivery-loop` (kho riêng tư) và
  `phanlemanh/acceptance-gate-kit`.
- Node 22 trở lên (lượt kiểm tự động chạy 22, các máy làm việc chạy 24), `zsh`, `python3`.
- Claude Code. Cài đặt của kho (`.claude/settings.json`) tự bật plugin `acceptance-gate`, `feature-loop`, `dieu-phoi`,
  `diagram-design` từ chợ CŨ `acceptance-gate-kit`, cùng `superpowers` — tới ngày cắt sang, kho này dùng kit bản cũ để chạy
  vòng của chính nó.

## Bước 1 — có kho trên máy

**Máy chưa có kho** (một lệnh, chạy một lần):

```bash
cd ~/dev && git clone https://github.com/phanlemanh/delivery-loop.git && cd delivery-loop && git remote add kit-cu https://github.com/phanlemanh/acceptance-gate-kit.git && git fetch kit-cu --tags && git switch chuyen-nha
```

**Máy đã có kho:**

```bash
cd ~/dev/delivery-loop && git switch chuyen-nha && git pull --ff-only origin chuyen-nha && git fetch kit-cu --tags
```

Kiểm: `ls migration` in ra `BOI-CANH.md  KE-HOACH.md  MO-PHIEN.md  README.md  TRANG-THAI.md  b0`.

## Bước 2 — nhận giữ

Mở `migration/TRANG-THAI.md`. Nếu dòng «Đang giữ» không phải máy này: sửa thành tên máy này + ngày, thêm một dòng vào
«Nhật ký giữ», commit, đẩy lên. Chỉ làm bước này khi chủ kho đã bảo máy này làm tiếp.

## Bước 3 — mở phiên

Mở một phiên Claude Code mới, thư mục là kho `delivery-loop`, nhánh `chuyen-nha`. Phiên tự nạp `CLAUDE.md` và tệp chỉ đường
`.claude/rules/chuyen-nha.md`. Nếu phiên không tự nhắc tới đợt chuyển nhà, dán khối dưới:

---

Tôi là chủ kho. Đây là kho `delivery-loop`, kế nhiệm của `acceptance-gate-kit`, đang ở giữa đợt chuyển nhà.

Đọc theo thứ tự, trước mọi việc khác:
1. `migration/TRANG-THAI.md` — đang ở đâu, máy nào đang giữ, việc kế.
2. `migration/BOI-CANH.md` — ai đã quyết gì, luật của đợt, bẫy đã dẫm.
3. `migration/KE-HOACH.md` — mục 12 và 13 là bản đang hiệu lực.
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
