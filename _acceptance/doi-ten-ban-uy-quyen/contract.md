---
schema_version: 1
feature: V1 — khoá và tên quyền của bản uỷ quyền governance/delegation.yaml đổi sang tiếng Anh trước mốc đầu tiên mang bộ đọc; tệp mang tên cũ bị từ chối cả tệp kèm câu gọi đúng tên mới; kho không có tệp chạy từng byte như trước vòng
slug: doi-ten-ban-uy-quyen
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: plugins/dispatch/** · tests/dieu-phoi/** · docs/adr/0030 — KHÔNG khớp t3_paths
surfaces: [cli]
status: draft
design_doc: docs/superpowers/specs/2026-11-28-doi-ten-ban-uy-quyen-design.md
---

# Acceptance Contract: doi-ten-ban-uy-quyen

## Context

Gốc: `_acceptance/giam-sat-doc-ban-uy-quyen/` (hồ sơ đã ký của bộ đọc, ADR 0030) · quyết định của chủ kho 28/11 «Đôi trước
mốc» và «Phê cả bốn» cho đề xuất lộ trình sau DL6 (việc đầu tiên: V1) · luật chủ kho đặt cho cả kit 28/11: máy đọc tiếng
Anh, người đọc tiếng Việt.

**Cơn đau:** bộ đọc `governance/delegation.yaml` gộp 27/11 với khoá và tên quyền tiếng Việt không dấu (`ban`, `tu_lam`,
`gop`, `thu-tu-gop`…). Một khi mốc mang bộ đọc tới kho tiêu thụ và một kho viết tệp, tên cũ phải được đọc mãi. Hôm nay chưa
kho nào có tệp (đo 28/11), nên đổi không cần đường đọc tên cũ. **Người hưởng:** chủ kho của mọi kho tiêu thụ (viết tệp một
lần bằng tên cùng hệ với mọi khoá máy khác) và kit (không mang bảng tên cũ phải đọc mãi).

Bảng tên, cách xử lý tệp tên cũ, hồ sơ DL6 và CỘNG `nghia`: design doc §3–§7. Tên cuối do chủ kho chốt ở Cổng Phạm vi.

## Criteria

- **AC-1** — Given tệp ở đỉnh nhánh chính viết khoá `version` và `delegated` (dạng dòng `[a, b]` hoặc dạng khối `- a`) với tên theo bảng tên đã chốt, When bộ đọc đọc, Then mỗi tên mới rơi đúng nhóm và đúng câu mà tên cũ tương ứng cho ở bộ đọc trước vòng — nhận (`merge`, `merge-order`) · vẫn hỏi kèm câu (`session`, `reassign-row`, `open-lane`, `shared-ruling`, `roadmap`) · sai chỗ kèm chỗ đúng (`out-of-contract`, `design`); thiếu `version` hay có khoá lạ thì đọc được kèm cờ vàng nêu tên trường; `version` khác 1, `delegated` vắng hay không phải danh sách, dòng ngoài khuôn thì lỗi đọc và không quyền nào; danh sách loại, danh sách vùng cấm của bộ đọc bằng đúng cột «tên mới» của bảng đã chốt (ma trận viết trước trong ca); và phép vi phân với bộ đọc ở đỉnh trước vòng (`a9b7cbe6`, trọn thư mục qua `git archive`) — tệp tên cũ cho bộ đọc cũ, tệp tên mới sinh từ nó bằng bảng tên cũ cho bộ đọc mới — cho cùng nhóm và cùng câu ở mọi loại, cùng điều chạm ở mọi mục vùng cấm. Bản sao đổi một chữ trong câu của `session` thì ca ĐỎ với thông điệp ghim «session · câu lệch bộ đọc trước vòng».
- **AC-2** — Given tệp mang một tên cũ — khoá `ban` hay `tu_lam`, một trong chín tên quyền cũ, hay một trong chín tên vùng cấm đã đổi — dù mọi phần khác hợp lệ, When bộ đọc đọc, Then cả tệp bị từ chối, không quyền nào được nhận kể cả tên mới cùng tệp, và lỗi nêu ĐÚNG CẶP tên cũ → tên mới — hai tên tách ra từ câu lỗi bằng nhau tuyệt đối với cặp của bảng (tên cũ của vùng cấm kèm «vùng cấm cứng»); ma trận viết trước phủ mười tám tên ở cả dạng dòng lẫn dạng khối cộng hai khoá; đối chứng dương: thay tên cũ bằng tên mới thì không còn lỗi tên cũ; tệp đúng khuôn DL6 (`ban: 1` / `tu_lam: [gop]`) ở nhánh chính của kho thử cho `co: true`, không quyền nào, lỗi nêu `ban` và `version`. Bản sao bộ đọc bỏ bảng tên cũ thì ca ĐỎ với thông điệp ghim «gop · thiếu tên mới merge»; bản sao đổi chéo đích của `gop` và `thu-tu-gop` thì ca ĐỎ với «gop · mong merge · nhận merge-order».
- **AC-3** — Given tệp tên mới liệt một tên vùng cấm (tên mới hay tên giữ) hoặc một tên ngoài danh sách cạnh `merge`, When bộ đọc đọc, Then cả tệp bị từ chối, lỗi nêu đúng tên — vùng cấm và danh sách đóng không nới qua đường đổi tên; ma trận phủ mọi tên vùng cấm; bản sao bỏ qua mục cấm hay xoá một loại khỏi danh sách thì ca đỏ của DL6 vẫn ĐỎ.
- **AC-4** — Given kho KHÔNG có `governance/delegation.yaml` (có remote, không remote, có remote mà lấy về hỏng), When `the khoi-tao --json`, `xem`, `xem --json`, `dem --json` và lệnh `gop` không cờ `--theo-quyen` chạy bằng bản gói ở đỉnh trước vòng (`a9b7cbe6`) và bằng bản mới, Then đầu ra bằng nhau từng byte; cùng phép so với bản trước khi có bộ đọc (`2956dae2`) vẫn bằng nhau; ca đỏ thêm khoá vào thẻ khi không có tệp vẫn ĐỎ.
- **AC-5** — Given kho có tệp tên mới ở nhánh chính, When một lệnh của quyền đọc bản uỷ quyền, Then tệp vẫn đọc ở đỉnh `origin/<nhánh chính>`: tệp ở cây làm việc hay nhánh PR không đổi kết quả, xoá tệp ở nhánh chính thì không còn quyền, lấy về hỏng mà ref cũ có tệp thì không quyền nào; bản sao đổi nguồn đọc sang cây làm việc thì ca «PR tự thêm loại» ĐỎ.
- **AC-6** — Given đợt chạy ở kho có tệp tên mới, When giám sát chạy `gop <số PR> --slug <slug> --theo-quyen --phien <mã>` hay `thu-tu-gop <dãy,…> --phien <mã>`, Then mọi phép kiểm của DL6 giữ nguyên (giám sát, ô tự merge, khoá `merge`, `xetGop`, vùng cấm trên tệp PR, hoán vị), câu chặn khi thiếu quyền nêu tên mới («không nhận quyền merge», «không nhận quyền merge-order»), dòng `dung-quyen` ghi TRƯỚC hành động mang `quyen` là tên mới, và `dem --json` đếm theo tên mới (`merge`, `merge-order`).
- **AC-7** — Given kho có tệp tên mới, When `the khoi-tao --json` chạy, và When `dem --json` chạy trên sổ có dòng `dung-quyen` do chính lệnh của quyền ghi, Then khối `uy_quyen` mang `nghia` với tập khoá bằng đúng tập tên tệp liệt — mọi tên trong `nhan` và `van_hoi` (nhóm vẫn hỏi và nhóm sai chỗ) — và `dung_quyen` mang `nghia` cho mỗi tên trong `theo_quyen`; mỗi nghĩa có chữ tiếng Việt có dấu và không chứa tên tiếng Anh của chính nó; ma trận viết trước phủ cả chín loại; mảng `hoi` của thẻ không đổi. Bản sao xoá nghĩa của riêng `session` thì ca ĐỎ nêu «thẻ thiếu nghĩa tiếng Việt: session».
- **AC-8** — Given phiên giám sát mới đọc chỉ dẫn của gói (lệnh mở đợt, lệnh đóng đợt, khuôn luật đợt, README) và ADR 0030, When kho có bản uỷ quyền, Then chỉ dẫn dùng đúng khoá và tên quyền mới, trình mỗi quyền bằng nghĩa tiếng Việt với tên tiếng Anh trong ngoặc, giữ nguyên tên lệnh (`gop`, `thu-tu-gop`) và tên sự kiện `dung-quyen`, và ADR 0030 có mục «Sửa 28/11» mang bảng tên mà không viết lại các Quyết định đã ghi. (judgment)

## Coverage

Quét preset test-matrix (bước CT-S) trên không gian tên × bên đọc. Chân ngành: [NGÀNH: đổi tên khoá cấu hình trước khi
phát hành — không cần lớp tương thích ngược khi chưa có người dùng] · [NGÀNH: phân quyền mặc định từ chối — tên lạ không
được cấp].

- Trục A — tên trong tệp: khoá mới · khoá cũ · quyền mới mỗi nhóm · quyền cũ · vùng cấm tên mới · vùng cấm tên cũ · vùng
  cấm giữ tên · tên lạ (AC-1, AC-2, AC-3). [thước CE: bảng tên design doc §3 — ma trận viết trước]
- Trục B — nguồn tệp: vắng (có remote · không remote · lấy về hỏng) · nhánh chính · cây làm việc/nhánh PR · bị xoá (AC-4,
  AC-5). [thước CE: ADR 0030 Quyết định 1]
- Trục C — bên dùng: lệnh `gop --theo-quyen` · lệnh `thu-tu-gop` · sự kiện `dung-quyen` · `dem --json` · thẻ khởi tạo ·
  chỉ dẫn và ADR (AC-6, AC-7, AC-8).
- Later: sổ khoá một-nguồn và đổi tên `tu_merge` có đường đọc tên cũ (V2a). Never: đường đọc tên cũ cho bản uỷ quyền.

## Out of scope

- Khoá `tu_merge` của thẻ mở đợt và mọi khoá trong `_acceptance/config.yaml` — V2a (sổ khoá, có đường đọc tên cũ).
- Tên sự kiện nhật ký đợt (kể cả `dung-quyen`), tên tệp script, tên lệnh con, tên tệp `thu-tu-gop.json`, loại yêu cầu `chuyen-hang` của luật đợt.
- Sửa hồ sơ đã ký `giam-sat-doc-ban-uy-quyen` hay ghim lại nó trong vòng này — chiến dịch Mốc A (design doc §6).
- Cắt thẻ, phát hành, cài lên kho tiêu thụ, viết `governance/delegation.yaml` vào kho nào; khuôn RS5b của Repo Standards (báo bằng một câu ở báo cáo cuối).

## Notes

Ca đo: nội dung ca `UQ-…` của `tests/dieu-phoi/uy-quyen.test.mjs` đổi sang tên mới, tên ca giữ nguyên; ca mới `TA-0n …`
(= AC-n của hồ sơ này) cuối cùng tệp; hàm so chiều im của `UQ-05` nhận gốc so làm tham số để ca `TA-04` so với `a9b7cbe6`.
`rang/chay.sh AC-n` của hồ sơ này chạy ca `TA-…` và gọi lại `rang/chay.sh` của DL6.
