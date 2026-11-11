# Trạng thái đợt chuyển nhà — tệp SỐNG

Tệp duy nhất phải sửa mỗi khi đổi máy hoặc xong một việc. Ai mở kho này cũng đọc tệp này trước; `BOI-CANH.md` và
`KE-HOACH.md` giải thích vì sao, tệp này nói đang ở đâu.

## Đang giữ

**MacBook Pro** — từ 11/11/2026, chủ kho giao («MacBook Pro làm tiếp»).

Luật giữ: mỗi lúc chỉ MỘT máy sửa nhánh `chuyen-nha`. Máy khác muốn làm tiếp thì (1) kéo nhánh về, (2) sửa dòng trên thành
tên máy mình + ngày, commit, đẩy, (3) rồi mới làm. Thấy dòng trên không phải máy mình mà chủ kho chưa bảo đổi → dừng, hỏi
chủ kho.

## Đã xong

| Việc | Bằng chứng |
|---|---|
| Kế hoạch chốt với chủ kho (phương thức, tên tạm, bốn dãy việc) | `KE-HOACH.md` mục 3, 12, 13 |
| Đo thử B0 — bỏ lịch sử, hồ sơ, sổ làm việc thì bao nhiêu ca kiểm đỏ | `KE-HOACH.md` mục 13 · `b0/ket-qua/` |
| Kho `phanlemanh/delivery-loop` tạo trên GitHub, riêng tư, chạy kiểm tự động (Actions) tắt | `gh repo view phanlemanh/delivery-loop` |
| `main` = nhánh chính kho cũ tại `9ff2e4f7`, đủ 30 thẻ chính thức | `git rev-parse origin/main kit-cu/main` |
| Nhánh `chuyen-nha` có thư mục `migration/` và tệp chỉ đường `.claude/rules/chuyen-nha.md` | nhánh này |
| Thử kéo kho về chỗ trống và làm theo `MO-PHIEN.md` | 11/11, MacBook Pro — xem cuối tệp |
| Thử plugin `repo-setup` trên kho này (không ghi): chưa có khuôn cho kho plugin, khuôn gần nhất thêm sai loại tệp | `KE-HOACH.md` mục 14 |

## Đang dở

| Việc | Ở đâu | Còn thiếu |
|---|---|---|
| R1 — khuôn «kho plugin» cho plugin `repo-setup` | kho `repo-standards`, PR [#6](https://github.com/phanlemanh/repo-standards/pull/6), nhánh `claude/plugin-marketplace-preset-7a7427` @ `b2f67ea` (đã gộp nhánh chính mới nhất vào nhánh) | Đã đẩy và mở PR 11/11 theo lời chủ kho. **Chưa gộp, chưa nâng phiên bản, chưa phát hành.** Lượt kiểm tự động của PR xanh đủ bốn việc tại `b2f67ea` (bộ kiểm nhanh trên Linux và macOS, bộ kiểm đầy đủ, kiểm tệp khai plugin); GitHub báo gộp sạch. Chưa có ai xét duyệt mã từng dòng. Chủ kho quyết gộp + phát hành. |

Mã commit của nhánh đã đổi so với lần ghi trước (`0fa5473`): trước khi đẩy lên kho công khai, tên kho riêng tư dùng làm tên
mẫu trong bộ kiểm được gỡ khỏi cả tệp lẫn lịch sử nhánh, rồi nhánh gộp thêm hai commit mới của nhánh chính. Kiểm lại tại
`b2f67ea`: `bash tests/run.sh` xanh (46 nhóm, 0 lỗi).

Kiểm lại độc lập 11/11 (MacBook Pro, tại `0fa5473`): `bash tests/run.sh` xanh (45 nhóm, 0 lỗi) · bộ dò nhận kit là `claude-plugin` · điểm
`doctor` của kit 44 → 50 (thước mới bỏ các mục của ứng dụng và bắt đúng năm lỗi thật: nguồn plugin là cả kho, phiên bản
lệch nhau, mô tả plugin quá dài, thiếu lệnh nâng phiên bản, lượt kiểm chưa kiểm tệp khai plugin) · `repo-standards` tự chấm
67 · tiếp nhận kit ở chế độ thử không ghi: thêm 6 tệp (`.editorconfig`, `.nvmrc`, `Makefile`, `tools/bump_version.py`,
`tools/plugin_lint.py`, `.claude/skills/review-change/SKILL.md`), trộn dòng vào 2, bỏ qua 6, để nguyên 4 tệp trùng; từ
điển miền, wiki và tệp mẫu biến môi trường báo «không áp» kèm lý do.

Dòng lệnh kịch bản chuyển nhà (B1) sẽ gọi, khi nhánh trên đã gộp:

```bash
python3 <repo-standards>/plugins/repo-setup/scripts/apply.py --target <cây kho mới> --preset claude-plugin --level starter --adopt --var project_name=delivery-loop --var description="<mô tả>" --var owner=phanlemanh
```

B1 cần quyết: có nhận tệp `.claude/skills/review-change/SKILL.md` không (kit đã có đường xét duyệt riêng).

## Kế — theo thứ tự phụ thuộc

| # | Việc | Ở kho nào | Mở khi |
|---|---|---|---|
| 1 | Bật quét bí mật + chặn đẩy bí mật, bật tự xoá nhánh sau gộp | kho CŨ, cài đặt GitHub | chủ kho bảo (đổi cài đặt kho) |
| 2 | R1 — gộp PR #6 khuôn «kho plugin» rồi phát hành bản `repo-setup` kế (xem «Đang dở») | `repo-standards` | chủ kho bảo gộp + phát hành (lượt kiểm tự động đã xanh 11/11) |
| 3 | A1 `luot-kiem-nhe` — chia mảnh lượt kiểm tự động, bộ chạy tự kiểm phiên bản Node → mốc 2.39 | kho CŨ | chủ kho gọi tên vòng VÀ nói máy nào chạy (việc sửa kit cũ từ 01/11 ở Mac Studio; lời 11/11 chỉ giao đợt chuyển nhà) |
| 4 | B1 `kich-ban-chuyen-nha` — kịch bản sinh commit dọn nhà lên trên nhánh chính kho cũ | kho này, `migration/` | xong việc 2 và mốc 2.39 · chủ kho gọi tên · chủ kho cho ngoại lệ luật chiều rộng (b) + đặt hạn dừng · chốt hẳn bảng tên |
| 5 | B2 `bo-kiem-xanh-o-kho-moi` | kho này | sau B1 (B1 đo lớp đỏ do đổi bố cục) |
| 6 | B3 cắt sang — mốc 3.0, Quỹ hàng nhận trước | kho này + kho tiêu thụ | chữ ký của chủ kho |

Việc 2 và 3 độc lập, chạy song song được. Chi tiết, thước đo và ước giờ máy: `KE-HOACH.md` mục 12.

## Chờ chủ kho (chưa ai được tự quyết)

1. Bảo làm việc nào trước trong các việc 1–3.
2. Gọi tên vòng A1 và máy chạy nó.
3. Ngoại lệ luật chiều rộng (b) cho B1 + B2, và hạn dừng của đợt (đề xuất 21 ngày từ khi B1 mở).
4. Chốt hẳn tên `delivery-loop` và bảng tên ở `KE-HOACH.md` mục 3.
5. Ngày cắt sang.
6. Vòng riêng cho hai tệp máy vẽ — hai hạt giống 16/10 và 30/10.

## Việc lặp lại: cập nhật `main` khi kho cũ đi thêm

`main` ở đây không nhận sửa tay. Khi nhánh chính kho cũ có commit mới, máy đang giữ chạy:

```bash
git fetch kit-cu --tags && git push origin refs/remotes/kit-cu/main:refs/heads/main && git push origin --tags && git switch chuyen-nha && git merge --no-edit kit-cu/main && git push origin chuyen-nha
```

Kiểm: `git rev-parse origin/main kit-cu/main` in hai dòng giống nhau. Lệnh này chạy lại bao nhiêu lần cũng được; kho cũ
chưa đổi thì nó không làm gì.

## Nhật ký giữ

| Ngày | Máy | Việc |
|---|---|---|
| 11/11/2026 | MacBook Pro | R1: chủ kho bảo «Đẩy và mở PR» → gỡ tên kho riêng tư khỏi bộ kiểm, đuổi kịp nhánh chính, đẩy, mở PR #6 ở `repo-standards` tại `b2f67ea`. Chưa gộp. |
| 11/11/2026 | MacBook Pro | Mở R1 ở kho `repo-standards` (phiên riêng); mã xong tại `0fa5473`, đã kiểm lại độc lập, chưa đẩy. |
| 11/11/2026 | MacBook Pro | Dựng nền: kế hoạch, đo thử B0, tạo kho, đẩy lịch sử, viết bàn giao. Chủ kho ban đầu định giao Mac Studio, cuối ngày đổi: MacBook Pro làm tiếp. Thử kéo kho về chỗ trống: nhánh, thẻ, tệp bàn giao và lệnh cập nhật `main` đều chạy. |
