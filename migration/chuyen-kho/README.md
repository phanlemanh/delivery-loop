# chuyen-kho — kiểm một kho tiêu thụ đã chuyển sang chợ `delivery-loop` chưa

Cài chợ mới không tự chuyển một kho đang dùng `acceptance-gate-kit`. Lệnh này đọc kho ấy và nói còn thiếu gì.

```
node migration/chuyen-kho/chuyen-kho.mjs --kho <đường dẫn kho tiêu thụ> [--ref <commit>] [--soan] [--phien]
node --test migration/chuyen-kho/chuyen-kho.test.mjs      # bộ kiểm; cần bản kéo ../onehub-inventory hoặc KHO_INVENTORY
```

- Không `--ref`: đọc cây làm việc. Có `--ref`: đọc qua git tại commit ấy, không checkout.
- Mỗi điểm một dòng `ĐẠT` / `CHƯA` kèm lý do; dòng cuối `KẾT: ĐẠT` hoặc `KẾT: CHƯA (n điểm)`.
- Mã thoát: `0` đạt · `1` có điểm chưa đạt · `2` không đọc được ở đây (lý do trên stderr, không có dòng `KẾT`).
- `--soan`: in bản vá đề xuất cho K1, K2, K3 ra stdout (áp bằng `git apply`); không ghi gì vào kho đích. K4, K5 chỉ nêu chỗ.

## Sáu điểm

| Điểm | Đạt khi |
|---|---|
| K1 | `.claude/settings.json` khai chợ `delivery-loop` và bật đủ sáu plugin `<tên>@delivery-loop` |
| K2 | cùng tệp ấy tắt đích danh (`false`) sáu plugin `<tên cũ>@acceptance-gate-kit` |
| K3 | workflow kéo kit thì kéo `phanlemanh/delivery-loop`, `KIT_TAG` (hoặc `KIT_REF`) là `v3.x`, `CLAUDE_PLUGIN_ROOT` trỏ `…/plugins/acceptance-gate`; không có workflow kéo kit thì đạt kèm ghi chú |
| K4 | không tệp mã/công cụ sống nào còn khoá `…@acceptance-gate-kit` |
| K5 | không tệp sống nào nhắc tên lệnh/skill cũ theo `../chay-thu-phien/bang-ten.json` — điểm «cần người xem», liệt kê `tệp:dòng` |
| K6 | chỉ khi có `--phien`: phiên Claude Code thật nạp đủ sáu plugin `@delivery-loop` và 0 plugin `@acceptance-gate-kit`; dòng báo ghi tên máy |

«Tệp sống» của K4 và K5 không gồm: `.git/`, `node_modules/`, `_acceptance/**` (trừ `_acceptance/config.yaml`), nhật ký thay đổi,
`wiki/log.md`, và tệp hay thư mục mang ngày ở đầu tên (`2026-11-18-….md` — sổ kể lại, không phải chỉ dẫn). K4 còn bỏ tài liệu
(`.md`, `.html`, `.txt`), tệp kiểm (`tests/`, `*.test.*`) và chính `.claude/settings.json`. Tệp `.env*` không bao giờ được mở.

## Giới hạn đã khai

1. **Không cài chợ lên máy.** Công cụ đọc tệp của kho; `claude plugin marketplace add` và `install` vẫn là việc của người trên từng máy.
2. **Không đụng cài đặt mức người dùng.** `~/.claude/settings.json` và `installed_plugins.json` không được đọc hay ghi; K6 chỉ thấy
   hệ quả của chúng qua sự kiện `init`, và chỉ trên máy đang chạy.
3. **Không tạo hồ sơ nghiệm thu mà ô `gate` đòi.** Bản vá của `--soan` chạm `.github/workflows/**`; kho nào gác tệp ấy thì vòng
   và chữ ký vẫn do kho ấy tự mở.
4. **Không ghim lại hồ sơ.** Hồ sơ `_acceptance/` đã ký giữ nguyên mã kit cũ; ghim lại là chiến dịch riêng theo mốc phát hành.

Ngoài bốn điều trên: `--soan` ghim cứng `v3.0.0`; K3 không hiểu workflow ghim kit bằng cách khác `KIT_TAG`/`KIT_REF`;
`--phien` không đo được cùng `--ref` và có thể kịp gửi một lượt gọi model trước khi bị giết.
