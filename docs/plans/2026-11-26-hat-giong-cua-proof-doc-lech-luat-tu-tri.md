# Hạt giống — cửa proof đọc luật tự trị lỏng hơn bộ đọc gốc của Repo Standards

Gốc: _acceptance/chuyen-gop/ (hồ sơ dựng `plugins/dispatch/scripts/cua-proof.mjs`, ký 22/11/2026; bản chép khuôn của nó là
`tests/dieu-phoi/fixtures/autonomy-repo-standards.yaml`, chép từ `c29dea4` của `phanlemanh/repo-standards`).

Ô trích lại tệp này: `_acceptance/dieu-phoi-tho-trong-kit/` — ô gốc của gói điều phối, nơi bộ phát lịch tự gộp PR được
quyết dựng. Hồ sơ `chuyen-gop` không trích lại, vì PR chạm hồ sơ đã ký thì cổng xét lại bằng chứng của nó so với nhánh
chính hiện tại.

**Trạng thái:** hạt giống (SỔ, chưa là ô). Chủ kho bảo ghi ngày 26/11/2026, nguyên văn «Ghi hạt giống», sau phép so hai bộ
đọc dưới đây. Tệp này không mở vòng nào.

## Điều đo được

Phép so chạy ngày 26/11/2026, chỉ đọc, trong vùng tạm của phiên giữ đợt. Hai bên được hỏi cùng một câu: một PR đổi những
tệp này thì ở tầng nào, và lựa chọn máy tự ký (mặc-ký) có được tự gộp không.

- **Bên kit:** `docTuTri` + `tangCuaTep` + `cuaProof` của `plugins/dispatch/scripts/cua-proof.mjs` trên `main` `48590d28`.
- **Bên gốc:** `classify` + `proof_check` của `plugins/repo-setup/presets/_core/team/tools/autonomy.py` ở
  `phanlemanh/repo-standards` `2e625bb9`, với `own = ("check", "secret-scan")` (kho không có luồng tác tử, nên `gate` là
  tên tự do — đúng lời chú thích của `OWN_CHECKS`).
- **Ba luật:** khuôn `autonomy.yaml.tmpl` trên nhánh chính kho ấy (điền ô `owner`, `merge_method: merge`) · tệp thật
  `governance/autonomy.yaml` của `onehub-inventory` · khuôn bỏ khối `rules`. Mỗi luật chạy hai tên proof: `evidence` (hợp
  lệ) và `check` (check có sẵn của setup).
- **Đối chứng dương:** ở luật khuôn với proof hợp lệ, 8 trên 12 ca khớp, gồm mọi ca so đường dẫn (tệp test ở gốc kho,
  `.claude/` ở gốc, `tsconfig.json` và `AGENTS.md` ở thư mục con, `wiki/` nhiều tầng). Hai bộ so đường dẫn cho cùng kết quả;
  chỗ lệch nằm ở luật nâng tầng và ở cách nhận proof.

## Ba chỗ kit cho tự gộp mà bộ đọc gốc không cho

| # | Ca | Kit | Bộ đọc gốc |
|---|---|---|---|
| 1 | PR sửa tệp test có xoá dòng, hoặc tắt test bằng `.skip` / `xit` / `pytest.mark.skip` | `low`, tự gộp | `medium` — gốc nâng mọi tệp test bị xoá dòng, xoá hẳn hay bị tắt |
| 2 | Luật không khai `rules.test_deletions_raise_to` mà PR xoá tệp test | `low`, tự gộp — kit chỉ nâng khi khoá có mặt | `medium` — gốc có mặc định `TEST_RAISE_TIER` |
| 3 | `proof.check` đặt tên một check có sẵn của setup (`check`, `secret-scan`; `gate` khi kho có luồng tác tử) | nhận làm bằng chứng | coi là không có bằng chứng, PR không bao giờ tự gộp |

Thêm một chỗ hẹp cùng họ với ca 2: luật không khai `rules.agent_guard_removals_raise_to` thì kit không nâng PR chạm
`ontology/`, còn gốc dùng mặc định `GUARD_RAISE_TIER = high` cho thao tác bị nới quyền.

Hai chỗ kit chặt hơn gốc (không hại, ghi để người sửa không «sửa» nhầm): PR xoá bất kỳ tệp nào bị kit nâng theo
`test_deletions_raise_to`, kể cả tài liệu; PR chạm `ontology/` bị kit nâng theo `agent_guard_removals_raise_to` kể cả khi
không nới quyền nào.

## Không do bản repo-setup mới

Khuôn `autonomy.yaml.tmpl` từ `c29dea4` tới `repo-setup-v0.10.4` tới `2e625bb9` chỉ đổi hai lời chú thích và ô
`merge_method` thành ô điền — kit không đọc ô ấy. `classify` và `proof_check` từ `repo-setup-v0.10.4` tới `2e625bb9` chỉ
đổi tên hằng. Ba chỗ lệch có từ lúc kit viết bộ đọc riêng; bản `0.10.5` sắp ra không thêm chỗ nào.

## Phơi nhiễm hôm nay: 0

`onehub-inventory` khai `proof.check: ""`, nên mặc-ký luôn dừng trước cửa gộp. `onehub-quy-hang` và `crm-onehub` không có
`governance/autonomy.yaml`. Chỗ hở mở ra khi kho đầu tiên khai `proof.check`. Chưa kiểm: khoá nhánh chính và CODEOWNERS của
kho ấy có chặn hộ PR `medium` hay không.

## Hướng sửa đã thấy (chưa kiểm)

- **Đúng tầng — một nguồn:** kho có `tools/autonomy.py` thì cửa proof hỏi chính nó (`--files`, đọc `tier` và `proof` của
  kết quả) thay vì tự đọc luật; bộ đọc dòng của kit chỉ còn là đường lùi cho kho không có tệp ấy. Hai bên khi đó không
  lệch được nữa, kể cả khi Repo Standards thêm luật nâng tầng mới.
- **Đường lùi:** đường lùi giữ hướng an toàn — ca 1 và ca 2 nâng như gốc, ca 3 bỏ tên check có sẵn của setup.
- **Thước:** một phép so vi phân như trên, sinh ca bằng mã, chạy trên khuôn lấy theo thẻ của repo-setup; đối chứng dương
  là các ca khớp, chiều đỏ là ba ca lệch.

## Soi theo luật của kit

- **Trace:** nguyên tố 2 (bằng chứng không tự dối) — cửa proof là chỗ máy đứng thế người; nó lỏng hơn luật mà kho đã khai
  thì «tự gộp» không còn dựa vào bằng chứng của kho. Người hưởng: chủ kho của kho đầu tiên khai `proof.check`.
- **Loại:** sửa lỗi, đổi phán quyết theo hướng chặt hơn. Cân trên mọi kho: hôm nay không kho nào dựa vào hành vi cũ, vì
  không kho nào qua được cửa proof.
- **Ngưỡng mở thành ô:** trước khi một kho tiêu thụ khai `proof.check` khác rỗng trong `governance/autonomy.yaml`, hoặc
  chủ kho gọi tên.
