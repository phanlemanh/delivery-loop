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
| `main` = nhánh chính kho cũ (lần cập nhật gần nhất 11/11: `11dfcd7f`), đủ 30 thẻ chính thức | `git rev-parse origin/main kit-cu/main` |
| Nhánh `chuyen-nha` có thư mục `migration/` và tệp chỉ đường `.claude/rules/chuyen-nha.md` | nhánh này |
| Thử kéo kho về chỗ trống và làm theo `MO-PHIEN.md` | 11/11, MacBook Pro — xem cuối tệp |
| Thử plugin `repo-setup` trên kho này (không ghi): chưa có khuôn cho kho plugin, khuôn gần nhất thêm sai loại tệp | `KE-HOACH.md` mục 14 |
| R1 — khuôn «kho plugin» cho plugin `repo-setup`, phát hành ở bản 0.5.0 | `gh release view repo-setup-v0.5.0 --repo phanlemanh/repo-standards` · ghi chú ở «Đang dở» |

## Đang dở

| Việc | Ở đâu | Còn thiếu |
|---|---|---|
| A1 `luot-kiem-nhe` (T2) — lượt kiểm tự động chạy mảnh song song, bộ chạy tự so phiên bản Node, số đo từng ca | kho CŨ `acceptance-gate-kit`, phiên riêng trên MacBook Pro, cây làm việc riêng cắt từ nhánh chính `6e5f4020` | Chủ kho gọi tên vòng và máy 11/11 («MacBook Pro»). Đọc tối 11/11: **chủ kho đã ký Cổng Bằng chứng** (hợp đồng `signed-off`, commit chữ ký `cbee02f7` đã đẩy); PR #499 ở kho cũ đã rời dạng nháp, CHƯA gộp. Phiên của vòng đang chạy làn ghim lại cho hai hồ sơ hoá cũ sau chữ ký (nó ước 1–1,5 giờ); việc `gate` đỏ tới khi bản ghim lên. **Còn lại: bản ghim, lượt kiểm tự động xanh, gộp.** Ngân sách ≤3 lượt gọi. Trạng thái sống của vòng nằm ở hồ sơ `_acceptance/luot-kiem-nhe/` của kho cũ, không ở tệp này. |
| — | — | R1 đã xong 11/11, xem «Đã xong» và các ghi chú dưới đây (giữ lại vì B1 cần). |

R1 đã phát hành: `repo-setup` **0.5.0**, thẻ `repo-setup-v0.5.0` = `4dc53e0` trên nhánh chính `repo-standards` (PR
[#6](https://github.com/phanlemanh/repo-standards/pull/6) khuôn, PR [#7](https://github.com/phanlemanh/repo-standards/pull/7)
nâng phiên bản; cả hai xanh đủ bốn việc kiểm trước khi gộp, nhánh chính sau PR #6 cũng xanh). Chưa ai xét duyệt mã từng
dòng. Chưa chạy: lượt phát hành của mức `team` trên GitHub, các skill dựng kho trong một phiên thật trên kho plugin.

**Bẫy trên MacBook Pro:** chợ `repo-standards` của máy này trỏ thẳng vào thư mục `~/dev/repo-standards`, mà thư mục ấy đang
đứng ở nhánh `feat/design-layer` (sau nhánh chính 13 commit, chưa có khuôn mới, còn ghi 0.4.0). Vì thế các lệnh
`/repo-setup:*` trên máy này CHƯA có khuôn «kho plugin» cho tới khi thư mục ấy về nhánh chính hoặc nhánh kia gộp nhánh
chính vào. B1 đừng gọi công cụ từ thư mục ấy — dùng một bản kéo về riêng tại thẻ `repo-setup-v0.5.0`.

Mã commit của nhánh đã đổi so với lần ghi trước (`0fa5473`): trước khi đẩy lên kho công khai, tên kho riêng tư dùng làm tên
mẫu trong bộ kiểm được gỡ khỏi cả tệp lẫn lịch sử nhánh, rồi nhánh gộp thêm hai commit mới của nhánh chính. Kiểm lại tại
`b2f67ea`: `bash tests/run.sh` xanh (46 nhóm, 0 lỗi).

Kiểm lại độc lập 11/11 (MacBook Pro, tại `0fa5473`): `bash tests/run.sh` xanh (45 nhóm, 0 lỗi) · bộ dò nhận kit là `claude-plugin` · điểm
`doctor` của kit 44 → 50 (thước mới bỏ các mục của ứng dụng và bắt đúng năm lỗi thật: nguồn plugin là cả kho, phiên bản
lệch nhau, mô tả plugin quá dài, thiếu lệnh nâng phiên bản, lượt kiểm chưa kiểm tệp khai plugin) · `repo-standards` tự chấm
67 · tiếp nhận kit ở chế độ thử không ghi: thêm 6 tệp (`.editorconfig`, `.nvmrc`, `Makefile`, `tools/bump_version.py`,
`tools/plugin_lint.py`, `.claude/skills/review-change/SKILL.md`), trộn dòng vào 2, bỏ qua 6, để nguyên 4 tệp trùng; từ
điển miền, wiki và tệp mẫu biến môi trường báo «không áp» kèm lý do.

Tiếp nhận GHI THẬT trên một bản sao của kit (11/11, MacBook Pro, bản sao ở thư mục tạm, kit tại `9ff2e4f7`, công cụ tại bản
0.5.0): chạy sạch · thêm 6 đường dẫn (`.claude/skills/`, `.editorconfig`, `.nvmrc`, `.repo-setup.json`, `Makefile`,
`tools/`) · trộn dòng vào 2 tệp đã có (`.gitattributes`, `.gitignore`) · không ghi đè, không xoá tệp nào · `doctor` 9/20 →
14/20 mục chấm. Bộ kiểm tệp khai plugin vừa thêm (`tools/plugin_lint.py`) báo 4 lỗi trên kit — đây là việc của kịch bản
chuyển nhà: sáu plugin lệch phiên bản (`diagram-design` 2.7.1, năm cái còn lại 2.38.1) · plugin lõi lấy cả kho làm nguồn ·
mô tả của plugin lõi dài 84 582 ký tự và của `feature-loop` 34 579 ký tự (trần 1 024; hai con số này do bộ kiểm in, chưa
ai đối chiếu tay).

**Vì sao chưa áp khuôn thẳng lên cây kho này (đo 11/11 trên bản sao đã tiếp nhận):** khuôn 0.5.0 giả định bố cục SAU khi
dọn nhà. Trên cây hiện tại của kit: lệnh gom `make check` gọi `tests/run.sh` — tệp mẫu bị bỏ qua ở chế độ tiếp nhận, kit
không có tệp ấy nên lệnh hỏng ngay; `make validate` duyệt `plugins/*/` trong khi năm plugin của kit đang nằm ở gốc kho nên
nó không kiểm plugin nào; lượt kiểm của khuôn bị bỏ qua vì kit đã có `gate.yml`. Phần chạy được ngay: bộ kiểm tệp khai
plugin, lệnh nâng phiên bản, `.editorconfig`, `.nvmrc` (khuôn ghi `22`, khớp lượt kiểm tự động của kit). Bản đồ sản phẩm của
kit không đỏ vì các tệp mới. Việc cho B1: áp khuôn SAU bước đổi bố cục, rồi nối `make test` vào bộ chạy kiểm thật của kit.
Việc cho Repo Standards (chưa mở): ở chế độ tiếp nhận, `Makefile` trỏ `make test` vào một tệp mẫu mà chính nó đã bỏ qua.

Dòng lệnh kịch bản chuyển nhà (B1) sẽ gọi:

```bash
python3 <repo-standards>/plugins/repo-setup/scripts/apply.py --target <cây kho mới> --preset claude-plugin --level starter --adopt --var project_name=delivery-loop --var description="<mô tả>" --var owner=phanlemanh
```

B1 cần quyết: có nhận tệp `.claude/skills/review-change/SKILL.md` không (kit đã có đường xét duyệt riêng).

## Kế — theo thứ tự phụ thuộc

| # | Việc | Ở kho nào | Mở khi |
|---|---|---|---|
| 1 | Bật quét bí mật + chặn đẩy bí mật, bật tự xoá nhánh sau gộp | kho CŨ, cài đặt GitHub | chủ kho bảo (đổi cài đặt kho) |
| 2 | ~~R1 — khuôn «kho plugin»~~ — xong 11/11, bản 0.5.0 | `repo-standards` | — |
| 3 | A1 `luot-kiem-nhe` — chia mảnh lượt kiểm tự động, bộ chạy tự kiểm phiên bản Node → mốc 2.39 | kho CŨ | ĐANG CHẠY trên MacBook Pro từ 11/11 (chủ kho gọi tên) — xem «Đang dở». Các vòng kit khác vẫn ở Mac Studio: hai máy cùng sửa kho cũ, A1 chỉ chạm lượt kiểm tự động và hai bộ chạy kiểm |
| 4 | B1 `kich-ban-chuyen-nha` — kịch bản sinh commit dọn nhà lên trên nhánh chính kho cũ | kho này, `migration/` | mốc 2.39 (khuôn đã phát hành ở `repo-setup` 0.5.0 từ 11/11) · chủ kho gọi tên · chủ kho cho ngoại lệ luật chiều rộng (b) + đặt hạn dừng · chốt hẳn bảng tên |
| 5 | B2 `bo-kiem-xanh-o-kho-moi` | kho này | sau B1 (B1 đo lớp đỏ do đổi bố cục) |
| 6 | B3 cắt sang — mốc 3.0, Quỹ hàng nhận trước | kho này + kho tiêu thụ | chữ ký của chủ kho |

Việc 2 đã xong; việc đang chặn B1 là việc 3 (mốc 2.39 của kho cũ) và các quyết định ở mục dưới. Chi tiết, thước đo và ước giờ máy: `KE-HOACH.md` mục 12.

## Chờ chủ kho (chưa ai được tự quyết)

1. Bảo làm việc 1 (cài đặt kho cũ) hay chưa.
2. ~~Gọi tên vòng A1 và máy chạy nó~~ — xong 11/11: MacBook Pro.
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
| 11/11/2026 | MacBook Pro | A1: chủ kho ký Cổng Bằng chứng (`cbee02f7`), PR #499 rời dạng nháp; đang ghim lại hai hồ sơ, chưa gộp. |
| 11/11/2026 | MacBook Pro | A1: vòng qua hai cổng đầu, lượt chấm 1 PASS, PR nháp #499 ở kho cũ; chờ Cổng Bằng chứng. Kho cũ gộp #498 → cập nhật `main` kho này tới `11dfcd7f`. |
| 11/11/2026 | MacBook Pro | Chủ kho hỏi vì sao chưa áp khuôn 0.5.0 lên kho này; thử trên bản sao rồi chủ kho chọn «Trong kịch bản B1» — áp sau bước đổi bố cục, không áp tay trước. |
| 11/11/2026 | MacBook Pro | Chủ kho gọi tên vòng A1 `luot-kiem-nhe` và giao MacBook Pro chạy. Cập nhật `main` kho này theo kho cũ tới `6e5f4020`. Mở phiên riêng ở kho cũ cho vòng. |
| 11/11/2026 | MacBook Pro | R1: chủ kho bảo «Phát hành 0.5.0» → PR #7 nâng phiên bản, xanh, gộp tại `4dc53e0`, cắt thẻ `repo-setup-v0.5.0`, tạo bản phát hành. Thử tiếp nhận ghi thật trên bản sao kit: chạy sạch. R1 đóng. |
| 11/11/2026 | MacBook Pro | R1: lượt kiểm tự động của PR #6 xanh đủ bốn việc; chủ kho bảo «Gộp PR» → gộp vào nhánh chính `repo-standards` tại `81f164c`. Chưa phát hành. |
| 11/11/2026 | MacBook Pro | R1: chủ kho bảo «Đẩy và mở PR» → gỡ tên kho riêng tư khỏi bộ kiểm, đuổi kịp nhánh chính, đẩy, mở PR #6 ở `repo-standards` tại `b2f67ea`. Chưa gộp. |
| 11/11/2026 | MacBook Pro | Mở R1 ở kho `repo-standards` (phiên riêng); mã xong tại `0fa5473`, đã kiểm lại độc lập, chưa đẩy. |
| 11/11/2026 | MacBook Pro | Dựng nền: kế hoạch, đo thử B0, tạo kho, đẩy lịch sử, viết bàn giao. Chủ kho ban đầu định giao Mac Studio, cuối ngày đổi: MacBook Pro làm tiếp. Thử kéo kho về chỗ trống: nhánh, thẻ, tệp bàn giao và lệnh cập nhật `main` đều chạy. |
