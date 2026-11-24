# Đề bài — Inventory nhận kit `v3.1.1`

Viết 24/11/2026, phiên giữ đợt (Mac Studio). Chủ kho bảo 24/11: «Đúng, Inventory trước» — trả lời câu «Đưa Inventory lên
v3.1.1 trước khi mở thêm vòng kit?».

## Bối cảnh

- Kit `phanlemanh/delivery-loop` có thẻ `v3.1.1` (`1193bc22`, bản phát hành Latest 23/11). Đây là bản vá của 3.1.0: lệnh
  gộp theo lời của gói `dispatch` thôi cho báo cáo mang chữ ký giữ chỗ (`pending`, `TBD`…) qua vế chữ ký. Ghi chú phát
  hành: `gh release view v3.1.1 --repo phanlemanh/delivery-loop`, mục «Kho tiêu thụ làm gì khi nhận».
- `onehub-inventory` là kho nhận của mốc 3.1.x và đang ở `v3.1.0` — chưa có bản vá. Mốc 3.1.1 chỉ tính là «được kho
  nhận» khi một commit trên nhánh chính của Inventory kéo kit ở thẻ `v3.1.1`. Chưa kho nào nhận 3.1.1, trong khi kit đã
  gộp thêm bốn PR sau thẻ ấy; chủ kho chọn cho kho nhận trước khi mở thêm vòng kit.
- Lần nâng trước (3.0 → 3.1.0): PR #109 `nang-kit-3-1` (vòng có hồ sơ `_acceptance/nang-kit-3-1/`, đổi
  `.claude/settings.json`) gộp 22/11 23:57Z ở `eaa9d941`; PR #110 đổi `KIT_TAG` trong `.github/workflows/ci.yml` gộp
  23/11 00:53Z ở `9a7490ee`.

## Việc

1. Đổi ghim kit từ `v3.1.0` sang `v3.1.1` ở mọi chỗ trên `origin/main` (đo 24/11, `main` `d47869ac`):
   `.claude/settings.json` dòng 103 (`"ref": "v3.1.0"`) và `.github/workflows/ci.yml` dòng 172 (`KIT_TAG: v3.1.0`).
   Quét lại trước khi sửa — số dòng có thể đã trôi.
2. Chạy kiểm bản cài như ghi chú phát hành dặn (`kiem-ban-cai.mjs --ref v3.1.1` trên bản clone kit đã `git fetch --tags`),
   ra `TỔNG KẾT: ĐẠT`. Lớp chép CI giữ nguyên như `v3.1.0` (không tệp nào của khối INIT-CI-COPY-LIST đổi).
3. Hạng và đường đi (vòng `feature-loop` hay PR T1) do luật của chính kho Inventory quyết ở S0 — không theo đề bài này.

## Ràng buộc

- Làm trong cây làm việc riêng cắt từ `origin/main` mới nhất (`git fetch origin` trước; nhánh `main` cục bộ của bản kéo
  đứng ở `1ad8469f`, cũ). Không đụng các cây làm việc cũ dưới `.claude/worktrees/` của kho ấy.
- `main` chỉ đổi qua PR, gộp bằng commit gộp; chỉ gộp khi chủ kho bảo ở chính phiên này. Không bật tự gộp.
- Không cài hay đổi plugin ở mức máy, không sửa `~/.claude/settings.json` hay tệp cấu hình shell. Bước nào cần cài sáu
  gói theo thẻ trên máy thì in lệnh cho chủ kho, không tự chạy.
- Không đụng PR đang mở của kho ấy (#115 nháp design-assembly, #83, các PR dependabot).
- Công cụ của kit chạy dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- Lời duyệt cổng (nếu đi vòng) do chủ kho gõ ở chính phiên này.

## Xong là

PR gộp vào `main` của Inventory bằng commit gộp, commit ấy kéo kit ở thẻ `v3.1.1`, và CI trên chính commit gộp xanh.
Báo lại: số PR, commit gộp, kết quả CI, số lượt gọi người.
