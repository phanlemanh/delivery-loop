# Đề bài vòng «V1» — khoá của bản uỷ quyền đổi sang tiếng Anh, trước khi cắt mốc

Viết 28/11/2026, phiên giữ đợt (Mac Studio). Chủ kho quyết 28/11 ở phiên giữ đợt: «Đôi trước mốc», rồi «Phê cả bốn» cho
đề xuất `migration/de-xuat-sau-dl6.md` (đọc bằng `git fetch origin chuyen-nha` rồi
`git show origin/chuyen-nha:migration/de-xuat-sau-dl6.md`). V1 là việc đầu tiên của đề xuất ấy.

## Bối cảnh

- Kit `delivery-loop` ở thẻ `v3.1.1`. Sau thẻ ấy `main` đã gộp thêm DL2 (PR #37) và DL6 (PR #38, commit gộp `a9b7cbe6`,
  27/11) cùng các PR nhỏ khác; chưa mốc nào mang chúng đi.
- DL6 đưa vào bộ đọc `governance/delegation.yaml` (ADR 0030, hồ sơ đã ký `_acceptance/giam-sat-doc-ban-uy-quyen/`). Khoá
  và tên quyền của tệp đang là tiếng Việt không dấu: `ban`, `tu_lam`; quyền `gop`, `thu-tu-gop`, `phien`, `chuyen-hang`,
  `mo-day`, `phan-quyet-chung`, `lo-trinh`; tên bị từ chối `muc-ngoai-hop-dong`, `thiet-ke`
  (`plugins/dispatch/scripts/uy-quyen.mjs`).
- **Vì sao bây giờ:** chưa kho nào viết tệp này và chưa mốc nào phát hành bộ đọc. Phiên giữ đợt đo 28/11: kho Repo
  Standards chưa có tệp nào nhắc `tu_lam` hay `delegation.yaml`; ba kho tiêu thụ không có `governance/delegation.yaml`.
  Đổi lúc này không cần đường đọc tên cũ. Sau mốc thì tên cũ phải được đọc mãi.
- Luật chủ kho đặt cho cả kit từ 28/11: **máy đọc tiếng Anh, người đọc tiếng Việt** — tên khoá tiếng Anh; mọi chữ hiện cho
  người (thẻ, cảnh báo, báo cáo đợt) là tiếng Việt có dấu.

## Việc

Chạy vòng sửa kit «V1» ở kho `delivery-loop` theo đúng quy trình của kho (`/feature-loop:feature-loop`). Trả lời chủ kho
bằng tiếng Việt. Đích: bản uỷ quyền dùng tên tiếng Anh trước khi mốc đầu tiên mang nó tới kho tiêu thụ.

**Bước đầu, trước mọi việc khác:** kéo `origin/main` mới nhất làm gốc nhánh (đo 28/11: `a9b7cbe6`); kiểm phiên nạp đúng
plugin `@delivery-loop` và KHÔNG nạp plugin `@acceptance-gate-kit` nào. Thấy khác thì dừng và báo ngay.

**Tên đề nghị** (máy được đề xuất tên tốt hơn; tên cuối do chủ kho chốt ở Cổng Phạm vi):

| Hôm nay | Đề nghị |
|---|---|
| `ban` | `version` |
| `tu_lam` | `delegated` |
| quyền `gop` · `thu-tu-gop` | `merge` · `merge-order` |
| quyền `phien` · `chuyen-hang` · `mo-day` | `session` · `reassign-row` · `open-lane` |
| quyền `phan-quyet-chung` · `lo-trinh` | `shared-ruling` · `roadmap` |
| tên bị từ chối `muc-ngoai-hop-dong` · `thiet-ke` | `out-of-contract` · `design` |

**Phạm vi đo 28/11** (`git grep` trên `a9b7cbe6`): trong mã và ca kiểm, tên cũ nằm ở 10 tệp của `plugins/dispatch`
(`uy-quyen.mjs`, `gop.mjs`, `thu-tu-gop.mjs`, `lich.mjs`, `phat-lich.mjs`, `the.mjs`, `dieu-phoi.mjs`, `mau/LUAT.md`,
`commands/open.md`, `README.md`) và `tests/dieu-phoi/uy-quyen.test.mjs`; ngoài ra ở ADR 0030, hồ sơ đã ký của DL6, và
các bản thiết kế. Vòng tự đo lại trước khi viết.

**Không đổi ở vòng này:** tên sự kiện trong nhật ký đợt (kể cả `dung-quyen`), tên tệp script và tên lệnh con
(`thu-tu-gop.mjs` vẫn là tên tệp), tên hồ sơ, khoá `tu_merge` của thẻ mở đợt (đã phát hành từ trước — đổi ở vòng sổ khoá,
có đường đọc tên cũ), mọi khoá khác trong `_acceptance/config.yaml`.

## Câu phải nêu ở Cổng Phạm vi (cùng một lượt)

- **Tên cuối cho từng khoá và từng quyền** — bảng trên là đề nghị; máy nêu chỗ nào nó chọn khác và vì sao.
- **Ngoại lệ luật chiều rộng (b):** V1 là vòng sửa mã thứ tư sau mốc `v3.1.1` (sau PR #34, DL2, DL6). Chủ kho đã phê
  ngoại lệ trong đề xuất 28/11; lời xác nhận phải gõ ở chính phiên này (tiền lệ DL2).
- **Tệp viết bằng tên cũ thì sao:** đề nghị từ chối cả tệp kèm một câu gọi đúng tên mới (ADR 0030 đã công khai tên cũ,
  người đọc ADR có thể đã gõ theo). Không dựng đường đọc tên cũ. Máy nêu nếu thấy lý do làm khác.
- **Giá trị của trường `quyen` trong sự kiện `dung-quyen`:** dùng tên quyền mới. Nêu có bên đọc nào (báo cáo đợt, bộ đếm)
  đang so chuỗi tên cũ không.
- **Hồ sơ đã ký `giam-sat-doc-ban-uy-quyen`:** eval của nó chạy trên tên cũ. Nêu cách xử lý — ghim lại theo vòng này, hay
  eval rút tên từ một bảng — và giá của từng lối; không sửa tay hồ sơ đã ký ngoài đường ghim lại của kit.
- **Sửa ADR 0030:** ghi bảng tên mới vào ADR (một mục «Sửa 28/11»), không viết lại lịch sử quyết định.
- **Hạng của vòng** và trần lượt gọi tương ứng (dự kiến T2, trần 3) · hợp đồng vượt 12 tiêu chí thì đề xuất tách.

## Luật phải giữ (CLAUDE.md của kit)

- **Ràng buộc cả hai chiều, có đối chứng dương và ghim đúng thông điệp:** tệp tên mới đọc được và cho đúng quyền; tệp tên
  cũ bị từ chối với đúng câu mong đợi; kho KHÔNG có tệp chạy từng byte như trước vòng (chiều im — DL6 đã đo ba ca: có
  remote, không remote, mất mạng; giữ cả ba).
- Vùng cấm và danh sách đóng của ADR 0030 không nới: tên lạ hay tên thuộc vùng cấm vẫn làm cả tệp bị từ chối.
- Bản uỷ quyền vẫn đọc ở đỉnh nhánh chính của kho; mutant đổi nguồn đọc của DL6 phải còn đỏ.
- Chữ hiện cho người theo bản luật ngôn ngữ mặt người (N1–N6) và `CONTEXT.md`; không để tên khoá tiếng Anh thay lời giải
  thích tiếng Việt trên thẻ.
- Kho công khai: không chép chi tiết nội bộ của kho riêng tư `onehub-quy-hang` vào tệp hay PR nào.
- Bài học 22/11: rà ca kiểm mới có chạy được TRÊN NHÁNH CHÍNH sau khi gộp không.
- Bài học DL2 và DL6: sổ giới hạn thiếu hàng (ca P179) làm đỏ lượt chấm và CI sau chữ ký — ghi hàng sổ cho mọi mục «ghi
  giới hạn» TRƯỚC khi trình thẻ Cổng Bằng chứng.

## Môi trường và bẫy

- Vòng chạy ở bản sao `~/dev/delivery-loop-main`, trong cây làm việc riêng cắt từ `origin/main`. Thư mục gốc bản sao đang
  ở nhánh `va-chu-ky-giu-cho-lenh-gop` — không đụng.
- Công cụ kit chạy dưới Node 24: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- `s4-args` lấy nhánh `main` cục bộ (cũ) làm gốc so: truyền `--diff-base <mã origin/main>`.
- Trường `verifier:` của gói bằng chứng phải là đường dẫn tệp.
- Kho kit đã bật `gop_theo_loi_ky: true`: thẻ Cổng Bằng chứng in sẵn `gộp: khi CI xanh`.

## Ràng buộc

- Chỉ gộp vào `main` qua PR bằng commit gộp, khi chủ kho bảo ở chính phiên này; không gộp dồn, không đẩy đè, không bật tự
  gộp. Không chạy `/repo-setup:github`, không đổi cài đặt GitHub.
- KHÔNG cắt thẻ, KHÔNG phát hành, KHÔNG cài lên kho tiêu thụ nào. KHÔNG viết `governance/delegation.yaml` vào kho nào.
- Không đổi tên khoá nào ngoài bản uỷ quyền; việc khác thấy trên đường thì ghi hạt giống có dòng `Gốc:`, không làm.
- Không đụng nhánh `chuyen-nha`, thư mục `migration/`, PR #21, thư mục gốc bản sao.
- Không sửa `~/.claude/settings.json`, cấu hình plugin của máy, hay tệp cấu hình shell khi chủ kho chưa nói ở chính phiên này.
- Lời duyệt cổng do chủ kho gõ ở CHÍNH phiên này; không phiên nào chuyển lời duyệt.
- Lượt gọi người theo trần thiết kế của hạng (T2: 3 · T3: 4). Sắp vượt trần thì dừng và báo.
- Lượt đo dài (chạy trọn bộ kiểm): hai lượt không hỏi; lượt thứ ba phải hỏi chủ kho. Không in nội dung `.env*`.

## Xong là

PR gộp vào `main` bằng commit gộp VÀ CI trên chính commit gộp xanh ở job `tests`. Báo cáo cuối: số PR, commit gộp, hạng,
số lượt gọi người, số lượt chấm, bảng tên cuối, cách đã xử lý hồ sơ đã ký của DL6, câu cần báo Repo Standards để khuôn
RS5b dùng tên mới, và phần nào để lại.
