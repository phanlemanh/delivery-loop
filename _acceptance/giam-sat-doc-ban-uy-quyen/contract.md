---
schema_version: 1
feature: Phiên giám sát của gói dispatch đọc bản uỷ quyền governance/delegation.yaml của kho ở đỉnh nhánh chính — danh sách loại đóng, vùng cấm cứng, sự kiện dung-quyen ghi trước hành động; giám sát gộp theo quyền khi ô tu_merge bật và xếp lại thứ tự gộp; khối uỷ quyền trên thẻ khởi tạo và dòng đếm trong báo cáo đợt (ADR 0030, lát 1)
slug: giam-sat-doc-ban-uy-quyen
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: plugins/dispatch/** · tests/dieu-phoi/** — KHÔNG khớp t3_paths (Hỏi-3)
surfaces: [cli]
status: verified
design_doc: docs/superpowers/specs/2026-11-27-giam-sat-doc-ban-uy-quyen-design.md
approved_by: Phan Le Manh
approved_at: 2026-11-27
---

# Acceptance Contract: giam-sat-doc-ban-uy-quyen

## Context

Gốc: `docs/adr/0030-giam-sat-doc-ban-uy-quyen-cua-kho.md` (lời phê CỘNG, chủ kho 26/11: «Phê, chọn A») · ô
`_acceptance/khung-dot-dinh-vi/` · hạt giống `docs/plans/2026-11-24-hat-giong-giam-sat-co-quyen-va-co-so.md` (lớp 1) ·
phanlemanh/delivery-loop#5, #4 · chủ kho mở vòng 27/11: «Mở vòng thực hiện DL6».

**Cơn đau:** quyền của phiên giám sát nằm trong hội thoại — mỗi đợt chủ kho giao lại bằng lời, hết ngữ cảnh hay đổi tài
khoản thì mất; lệnh `gop` chỉ nhận một dãy đang giữ khoá `merge`, nên giám sát gộp PR việc chung ngoài lệnh; thứ tự cấp
khoá `merge` không có lệnh xếp lại. **Người hưởng:** chủ kho của kho chạy đợt (thôi giao quyền bằng lời mỗi đợt) và thợ
của đợt (thôi dừng chờ phán một câu đã phán). Kho không có tệp chạy như hôm nay, từng byte.

Lát 1 dựng năm điều của ADR cho hai loại quyền có phép so và đủ lệnh (`thu-tu-gop`, `gop`); `phien` chưa được nhận (mở
phiên máy đã tự làm theo thẻ khởi tạo, dọn phiên chưa có phép so); lệnh chuyển hàng, mở dãy, `phan-quyet` và hai bên đọc còn lại để lát 2 (Out of scope). Thiết kế: design doc §2–§8.

## Criteria

- **AC-1** — Given kho có remote mà nhánh chính mang `governance/delegation.yaml` cấp `gop`, When một lệnh của quyền đọc bản uỷ quyền, Then bộ đọc lấy nhánh chính về rồi đọc tệp ở đỉnh `origin/<nhánh chính>` và trả sha đỉnh ấy; tệp ở cây làm việc hay ở nhánh PR — kể cả PR của giám sát tự thêm `lo-trinh` hay `thu-tu-gop` vào tệp — không đổi kết quả; xoá tệp trên nhánh chính thì lần đọc kế không còn quyền nào; lấy về hỏng mà ref cũ có tệp thì không quyền nào và báo lỗi, còn ref cũ không có tệp thì im như kho không tệp (không lỗi, không cờ). Bản sao bộ đọc bị đổi nguồn sang cây làm việc thì ca «PR tự thêm loại» ĐỎ với thông điệp ghim.
- **AC-2** — Given tệp liệt từng tên của danh sách loại kit định nghĩa, When bộ đọc xếp, Then mỗi tên rơi đúng một nhóm và in đúng câu của nhóm: nhận (`thu-tu-gop`, `gop`) · «mở phiên: máy đã tự làm theo thẻ khởi tạo, không cần quyền — dọn phiên: chưa có phép so — vẫn hỏi chủ kho» (`phien`) · «chưa có lệnh ở bản này — vẫn hỏi chủ kho» (`chuyen-hang`, `mo-day`, `phan-quyet-chung`) · «chưa có phép so — vẫn hỏi chủ kho» (`lo-trinh`) · «không thuộc giám sát đợt — <chỗ đúng>» (`muc-ngoai-hop-dong`, `thiet-ke`); một tên lạ là lỗi đọc: cả tệp bị từ chối, nêu tên. Ma trận toàn phần: số dòng kiểm bằng số tên của danh sách cộng một tên lạ.
- **AC-3** — Given tệp liệt một tên vùng cấm cứng (chữ ký cổng, cắt bản, xoá nhánh, đẩy kho khác, cài đặt GitHub, workflows, governance, luật sản phẩm, phạm vi đợt, luật đợt, bản uỷ quyền) cạnh `gop`, When bộ đọc đọc, Then cả tệp bị từ chối, lỗi in đúng tên mục cấm và không loại nào được nhận — kể cả `gop`; ma trận phủ mọi tên vùng cấm.
- **AC-4** — Given tệp đời cũ hoặc lệch khuôn, When bộ đọc đọc, Then thiếu `ban` hay có khoá lạ thì đọc được kèm cờ vàng nêu trường; `ban` khác 1, `tu_lam` vắng hay không phải danh sách, hoặc một dòng ngoài khuôn thì lỗi đọc nêu lý do (dòng ngoài khuôn nêu số dòng) và không quyền nào; danh sách dạng dòng `[a, b]` và dạng khối `- a` cho cùng kết quả.
- **AC-5** — Given kho KHÔNG có `governance/delegation.yaml` (có remote, không remote, và có remote mà lấy về hỏng), When `the khoi-tao --json`, `xem`, `xem --json` và `dem --json` chạy bằng bản gói ở nhánh chính hiện nay và bằng bản mới trên cùng thư mục đợt, Then bốn đầu ra bằng nhau từng byte, và lệnh `gop` không cờ `--theo-quyen` cho cùng mã thoát, cùng chuỗi lời gọi `gh` và cùng dòng sổ ở hai bản; ca đỏ: bản sao thêm một khoá vào thẻ khi không có tệp thì phép so ĐỎ nêu đầu ra lệch.
- **AC-6** — Given một lệnh của quyền đã qua mọi phép kiểm, When nó sắp hành động, Then sổ sự kiện của đợt có đúng một dòng `dung-quyen` mang `quyen`, `viec`, `duong_dao`, `sha_uy_quyen` và `can_phan:false`, ghi TRƯỚC hành động (dòng có mặt lúc `gh pr merge` giả được gọi / trước khi tệp thứ tự được ghi); lệnh lọc Monitor của giám sát không lọt dòng ấy; sổ không ghi được thì lệnh thoát khác 0, không gọi gộp, không ghi tệp thứ tự. Bản sao bỏ lời ghi sự kiện thì ca «lệnh của quyền chạy mà không có dòng dung-quyen» ĐỎ.
- **AC-7** — Given đợt đang chạy, When giám sát chạy `gop <số PR> --slug <slug> --theo-quyen --phien <mã>`, Then lệnh chỉ gộp khi đủ cả: phiên là giám sát ghi ở vai, ô `tu_merge` của đợt là `true`, bản uỷ quyền nhận `gop`, khoá `merge` trống (giám sát giữ khoá trong lúc gộp và nhả ở mọi lối), và `xetGop` không đổi cho lối gộp được; lời gọi là `gh pr merge <n> --merge --match-head-commit <sha>`, không bao giờ `--auto`; thiếu bất kỳ điều nào thì chặn với thông điệp ghim của điều ấy, không gọi gộp, không ghi `dung-quyen`, và khoá `merge` không còn do giám sát giữ sau lệnh — kể cả khi chặn xảy ra sau lúc giám sát đã giữ khoá, hay khi lời gọi gộp thất bại.
- **AC-8** — Given PR đã ký, CI xanh, và đủ điều kiện của AC-7, When tệp PR đổi so với merge-base chạm `.github/workflows/`, `governance/` hay `PRODUCT-INVARIANTS.md`, Then gộp theo quyền chặn, nêu đúng tệp và «bấm gộp là của người»; đối chứng: cùng PR không chạm vùng ấy thì gộp.
- **AC-9** — Given đợt có đơn `merge` của nhiều dãy, When giám sát chạy `thu-tu-gop <dãy,…> --phien <mã>` và bản uỷ quyền nhận `thu-tu-gop`, Then danh sách phải là hoán vị đúng tập dãy đang có đơn `merge` (thiếu, thừa hay trùng → chặn, nêu dãy); hợp lệ thì ghi `dung-quyen` rồi tệp thứ tự, và nhịp kế của bộ phát lịch cấp khoá `merge` theo thứ tự mới; không có quyền thì chặn; phiên không phải giám sát thì chặn; đợt không có tệp thứ tự thì thứ tự cấp khoá như cũ.
- **AC-10** — Given kho có `governance/delegation.yaml`, When `the khoi-tao --json` và `dem --json` chạy, Then thẻ mang khối `uy_quyen` (nguồn nhánh chính kèm sha, loại nhận, loại vẫn hỏi kèm câu, cờ vàng, lỗi) và `uy-quyen` trong danh sách máy đi tiếp, KHÔNG có mục nào mới trong danh sách hỏi; tệp lỗi thì khối báo lỗi và không loại nào được nhận; sổ có dòng `dung-quyen` (do chính các lệnh của quyền ghi) thì báo cáo đếm số lần dùng theo từng quyền; `xem` và `xem --json` ở kho có tệp vẫn bằng từng byte bản nhánh chính.
- **AC-11** — Given giám sát mới nhận vai đọc chỉ dẫn của gói (lệnh mở đợt, lệnh đóng đợt, khuôn luật đợt, README), When đợt có bản uỷ quyền, Then chỉ dẫn nói đủ: trình khối uỷ quyền trên thẻ khởi tạo như mục máy đi tiếp có cửa phản đối, không thành câu hỏi; quyền gộp chỉ dùng khi ô tự merge bật; gộp và xếp thứ tự chỉ qua `gop --theo-quyen` và `thu-tu-gop`; vùng cấm; loại chưa dựng vẫn hỏi chủ kho; báo cáo đợt ghi dòng đếm. (judgment)

## Coverage

Quét preset test-matrix (bước CT-S). Chân ngành: [NGÀNH: GitHub CODEOWNERS — luật đọc ở nhánh đích của PR, PR không tự
nới luật cho chính nó] · [NGÀNH: phân quyền mặc định từ chối kiểu RBAC — tên quyền lạ không được cấp].

- Trục A — nguồn tệp: vắng · hợp lệ ở nhánh chính · chỉ có ở cây làm việc/nhánh PR · bị xoá ở nhánh chính · lấy về hỏng · kho không remote (AC-1, AC-5). [thước CE: ADR 0030 Quyết định 1 + Đường đảo]
- Trục B — nội dung `tu_lam`: nhận · chưa có lệnh · chưa có phép so · sai chỗ · lạ · vùng cấm · thiếu `ban` · `ban` lạ · khoá lạ · cú pháp hỏng · dạng dòng/khối (AC-2, AC-3, AC-4). [thước CE: bảng loại và vùng cấm của ADR 0030]
- Trục C — điều kiện của lệnh quyền: đủ · thiếu giám sát · thiếu `tu_merge` · thiếu quyền · khoá bận · `xetGop` chặn · PR chạm vùng cấm · sổ hỏng · hoán vị sai (AC-6, AC-7, AC-8, AC-9). [thước CE: §7 design doc — mỗi điều một thông điệp]
- Trục D — bên đọc: thẻ khởi tạo · báo cáo đợt · chỉ dẫn (AC-10, AC-11); `xem` không đổi ở kho không tệp (AC-5) và ở kho có tệp (AC-10); `gop` không cờ không đổi (AC-5).
- Later: lệnh chuyển hàng, mở dãy, `phan-quyet`; khối «CHƯA duyệt» của Cổng Bằng chứng; `tiep-tuc` in phán quyết; vị từ «dọn phiên» (hạt giống lát 2). Never: đọc bản uỷ quyền từ cây làm việc (ADR); `--auto` (ADR 0029).

## Out of scope

- Lệnh chuyển hàng, mở dãy, `phan-quyet` và hai bên đọc «khối CHƯA duyệt của Cổng Bằng chứng», «`tiep-tuc` in Phán quyết của giám sát» — lát 2 (hạt giống `docs/plans/2026-11-27-hat-giong-uy-quyen-lat-2.md`).
- Nửa «dọn phiên» của loại `phien`: phép so của vòng đối soát bàn giao không đủ (đo 27/11, design doc §4) — vẫn hỏi chủ kho.
- Loại `phien` (mở phiên đã là việc máy làm theo thẻ khởi tạo, không hỏi chủ kho; dọn phiên chưa có phép so).
- Chuyến gộp (`chuyen`) cho giám sát; nới bất kỳ phép kiểm nào của `xetGop`; khuôn tệp `governance/delegation.yaml` (Repo Standards RS5b) và viết tệp ấy vào kho tiêu thụ nào.

## Notes

Ca đo: `tests/dieu-phoi/uy-quyen.test.mjs` (UQ-…), `rang/chay.sh AC-n` đòi đúng tên ca. Hạt giống lát 2:
`docs/plans/2026-11-27-hat-giong-uy-quyen-lat-2.md`.

Giới hạn khai: việc mở chip của giám sát không để lại dòng `dung-quyen` (công cụ của app, CLI không thấy) — nên `phien`
chưa được nhận ở lát này. Ngưỡng mở lại: ≥ 1 đợt ở kho có tệp mà chủ kho phải trả lời một câu về mở phiên.
