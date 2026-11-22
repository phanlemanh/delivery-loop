---
schema_version: 1
feature: Mặc-ký có phủ quyết, giữ-quyền và sổ đếm thăng cấp cho câu chỉ-người ở bước thiết kế
slug: mac-ky-co-phu-quyet
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/ (tro-ly-quyet-dinh.cjs mới, can-cu-s1.cjs, gate-card.js) + SKILL feature-loop — không chạm hooks/, lib/
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-11-22-mac-ky-co-phu-quyet-design.md
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-22
---

# Acceptance Contract: mac-ky-co-phu-quyet

## Context

Gốc: docs/findings/2026-11-22-tro-ly-quyet-dinh.md (đặc tả «trợ lý quyết định» chủ kho duyệt thí điểm 22/11/2026; đo trên
2.510 quyết định của 68 hàng ở onehub-inventory: chủ kho theo khuyến nghị của máy hơn 90 % số lần, mỗi hàng mất khoảng
2,8 giờ chờ người). Hàng 1 của hai hàng kit: câu chỉ-người đảo được ở hàng backend không dừng chờ nữa mà đi theo khuyến nghị,
vẫn lên thẻ Cổng Phạm vi để phủ quyết; chủ kho giữ quyền được bằng một tệp của đợt; một sổ đếm theo loại câu trình loại đủ
điều kiện thăng cấp và giáng loại khi bị phủ quyết hay kiểm mẫu ra sai. Tắt cờ là về nguyên hành vi cũ.

Thuật ngữ:
- **câu chỉ-người** = dòng sổ `stage: S1` có `can_cu.nguon: chi-nguoi`.
- **dòng máy** = dòng sổ do `scripts/tro-ly-quyet-dinh.cjs --write` nối, mang `"may":"mac-ky"`.
- **tệp ca** = `tests/scripts/tro-ly-quyet-dinh.test.mjs` (tên ca = mã tiêu chí).
- **kho thử** = kho git tạm do tệp ca sinh trong lượt.

## Criteria

- AC-1: Given kho thử có sổ đúng lược đồ 2 và một sổ có dòng mang `nguon_lam_lai` thiếu `so_do` cùng một dòng `pham_vi`
  giá trị lạ, When chạy `--check` trên từng sổ, Then sổ đúng thoát 0; sổ sai thoát 2 với hai dòng
  `d-5: mang nguon_lam_lai mà thiếu "so_do":2` và `d-6: pham_vi «mai-mai» không thuộc lan-nay | tu-nay`; mô-đun xuất
  `SO_DO = 2` và ba tập `di_theo`, `pham_vi`, `nguon_lam_lai`; bên ghi dòng người (`--ghi phu-quyet|kiem-mau|lam-lai`) thoát 2
  khi thiếu `--nguoi` (`--nguoi <tên> bắt buộc — chữ quyết là của người`) hay giá trị ngoài tập, và dòng nó sinh qua `--check`.
- AC-2: Given kho bật `tro_ly_quyet_dinh.mac_ky`, một hồ sơ cũ đã ký có câu chỉ-người loại `chon-cach-lam`, và hồ sơ mới
  `surfaces: [api, cli]` có câu chỉ-người cùng loại, `kho_dao: false`, When chạy `--write` hai lần, Then sổ có đúng một dòng
  máy `di_theo: khuyen`, `so_do: 2`, `ve` trỏ câu, không có `decided_by`, câu quyết mở đầu «Đã đi theo khuyến nghị:»; bộ xếp
  căn cứ in `câu hỏi 0` và ` · mặc-ký 1`.
- AC-3: Given mười ba câu chỉ-người lần lượt khó đảo, phạm luật sản phẩm, chạm tiền, gửi ra ngoài, loại lạ, loại vắng, loại kho tắt, vùng
  `khong_bao_gio`, vùng tầng `high` của `governance/autonomy.yaml`, vùng rỗng, loại lần đầu, vùng lần đầu, và một câu đủ điều
  kiện, cùng sáu hợp đồng `surfaces` `ui` / `api, web` / rỗng / `frontend` / `api, desktop` / `email`, When `--write` rồi xếp, Then câu đủ điều kiện ra `mac-ky`, mỗi
  câu kia ra `hoi` với đúng mã `ly_do` của nó (`kho-dao` · `luat-san-pham` · `tien-ra-ngoai` · `loai-la` · `loai-tat` · `khong-bao-gio` ·
  `vung-high` · `vung-khong-ro` · `lan-dau-loai` · `lan-dau-vung` · `man-hinh` · `loai-hang-khong-ro` · `loai-hang-la` — hàng chỉ là mặt máy khi MỌI surfaces nằm trong danh sách cho phép
  `api, cli, sdk, docs, ci, config, db, tool`), và mỗi câu có một dòng
  máy; khi có gốc nhánh, câu mặc-ký mà diff thật chạm tệp ngoài vùng khai ra `vung-lech` (nêu tệp; đối chứng: diff trong
  vùng vẫn `mac-ky`), tệp thật chạm tầng `high` ra `vung-high`.
- AC-4: Given loại `chon-cach-lam` đã thăng cấp và tệp `giu-quyen.txt` của đợt có slug một hồ sơ và glob vùng của hồ sơ khác,
  When xếp hai hồ sơ (đối chứng: trước khi có tệp, hồ sơ đầu ra `thang-cap`), Then cả hai ra `hoi` mã `ly_do` `giu-quyen`; dòng
  máy ghi `giu_quyen` khớp; sổ đếm ghi một lần kéo cho loại; kéo SAU khi món đã có dòng máy → `--write` nối đúng một
  dòng sự kiện `su_kien: keo` (dòng cũ giữ nguyên, ghi lại không lặp) và sổ đếm thấy hai lần kéo.
- AC-5: Given năm hồ sơ `sua-o-dau` theo khuyến nghị cả năm, năm hồ sơ `chon-cach-lam` có một lần chủ kho chọn khác, ba hồ sơ
  `ten-va-chu` và một hồ sơ nháp, When `--dem`, Then mỗi loại một hàng «hỏi · theo · % · phủ quyết · làm lại tách nguồn ·
  kéo · kiểm mẫu sai · trạng thái», hồ sơ nháp không vào mẫu số, «Đề nghị thăng cấp: sua-o-dau»; với `nguong_hoi: 3`,
  `nguong_theo: 80` cả ba loại được trình; `nguong_hoi: 0` thoát 2 với thông điệp gọi tên khoá; một lần kéo trong cửa sổ
  hay một lần làm lại do phủ quyết chặn thăng cấp, làm lại do bộ kiểm hay nguồn khác thì không (đối chứng dương). Mọi dòng
  làm lại và chọn khác của ca do bên ghi `--ghi` sinh. Món mặc-ký người im lặng KHÔNG là một lần hỏi: năm món mặc-ký im
  lặng cho «hỏi 1» (chỉ lần người thật trả lời) và cột «im» 5, không trình thăng cấp; kiểm mẫu `dat` của người trên bốn món
  đưa «hỏi» lên 5 và loại được trình.
- AC-6: Given loại đã thăng cấp và hồ sơ chưa ký đang mang dòng máy của loại (đối chứng: ra `thang-cap`), When một món mặc-ký
  của loại bị phủ quyết ở hồ sơ khác, hoặc một lần kiểm mẫu ghi `sai` (cả hai ghi bằng `--ghi`; đối chứng: kiểm mẫu `dat` giữ cấp), Then hồ sơ chưa ký ra `hoi` mã `ly_do` `loai-bi-giang`, bộ
  xếp căn cứ đếm lại `câu hỏi 1`, và `--dem` in `Bị giáng: chon-cach-lam — hồ sơ chưa ký phải kiểm lại: h`; với loại CHƯA thăng cấp, phủ quyết một món
  mặc-ký làm câu kế của loại ra `loai-bi-giang` tới khi có một lần trả lời ghi sau phủ quyết.
- AC-7: Given 200 slug, When chọn kiểm mẫu với `kiem_mau_moi: 5`, Then số được chọn trong khoảng 25–60, cùng slug luôn cùng
  kết quả, `kiem_mau_moi: 1` chọn mọi slug; hồ sơ có mặc-ký được chọn mang `kiem_mau: true`, hồ sơ không được chọn mang
  `false`.
- AC-8: Given hồ sơ có một câu đủ điều kiện mặc-ký và một câu loại lần đầu, When dựng thẻ Cổng Phạm vi và `--extract`, Then
  thẻ có khối «Đã đi theo khuyến nghị — phủ quyết trước khi gộp nếu khác ý» với dòng `data-mac-ky` của câu đầu, chữ «đã theo:»
  và «giữ lại tôi quyết»; câu lần đầu vẫn là `Hỏi-1`; `--extract` mang `can_cu.mac_ky` đúng câu đầu và `cau_hoi` đúng câu sau.
- AC-9: Given kho không có khối `tro_ly_quyet_dinh` hoặc `mac_ky: false`, và một bản sao bộ xếp căn cứ không có mô-đun cạnh
  nó, When `--write`, xếp, dựng `--extract`, Then sổ không đổi byte nào và lệnh nói «mặc-ký tắt»; dòng tổng kết bộ xếp đúng
  như trước vòng (`h · câu hỏi 1 · máy đã quyết 0 · đỏ 0 · đời trước 0 · bị thay 0 · gốc chua-kiem`); `--extract` không có
  khoá `mac_ky`; bản sao thiếu mô-đun đếm `câu hỏi 1` trong khi bản sao đủ tệp đếm `câu hỏi 0`.
- AC-10: Given SKILL feature-loop, When rút các mảnh của khối `DEC-TRO-LY-SLOT`, điền ô, ghi vào sổ kho thử rồi `--check`,
  `--write`, xếp, Then `--check` thoát 0, câu điền từ khuôn ra `mac-ky`, khối `MAC-KY-GHI` mang lệnh ghi, và SKILL liệt đủ mọi
  mã của danh mục loại câu.

## Coverage

Bỏ quét không gian: quyết định `bỏ coverage-scan` trong `decisions.jsonl`. Không gian đã quét ở đặc tả theo bốn trục (pha
đời quyết định × chủ thể × loại hàng × tình huống thời gian) — `docs/findings/2026-11-22-tro-ly-quyet-dinh.md` mục «Năm lỗ
đã vá». Ô của vòng này: ghi sổ (AC-1, AC-10) · đi tiếp (AC-2) · đóng-khi-ngờ theo từng điều kiện (AC-3) · chiều kéo (AC-4) ·
đếm và thăng cấp (AC-5) · giáng (AC-6) · kiểm mẫu (AC-7) · mặt người (AC-8) · tắt cờ (AC-9).

## Out of scope

- Chuyến gộp và nối luật tự trị qua cửa proof — hàng 2 (`chuyen-gop`).
- Nút bấm trên bảng đợt (pane mod) — thẻ in đường phủ quyết và giữ-quyền bằng chữ.
- Máy tự trích án lệ «từ nay» thành luật — vòng này chỉ ghi `pham_vi` và đếm.
- Bật cờ ở kho tiêu thụ nào, sửa gì trong kho onehub-inventory — kho nâng bản kit rồi chủ kho ký LUẬT đợt.
- Mặc-ký ở Cổng Bằng chứng — đường máy thông `machine-cleared` đã có, vòng này không đổi. Hồ sơ mang món mặc-ký không được
  tự gộp khi kho chưa khai proof check: răng ấy ở hàng 2 (`chuyen-gop`); tới khi hàng 2 gộp, kho không bật cờ (mặc định tắt).

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Known limits — chọn ở Cổng Bằng chứng 2026-11-22:
  - Ngoài-1: Một phép kiểm giữ cho kho không bật chế độ ngoài-git luôn thấy đúng như cũ đang so với một mốc cố định. Về sau nếu có vòng khác đổi chính đáng những gì các kho đó thấy, phép kiểm sẽ báo đỏ và đổ lỗi nhầm sang vòng cũ. Người dùng cuối không bị ảnh hưởng, chỉ làm người bảo trì mất thời gian lần nguồn.
  - Ngoài-3: Hai bộ đọc cùng một trường có thể phán khác nhau về một số loại hàng, nên có hợp đồng bị cảnh báo lạ ở nơi này mà vẫn được coi là hàng máy ở nơi kia.
  - Ngoài-4: Số liệu và thẻ của hồ sơ cũ đã gộp có thể đổi khi hồ sơ khác bị phủ quyết, dù bản thân hồ sơ cũ không đổi gì.
  - Ngoài-5: Một dòng sổ gõ tay sai khuôn vẫn có thể ảnh hưởng việc thăng hay giáng loại câu mà không ai bị báo lỗi.
  - Ngoài-7: Khi gốc nhánh sai hoặc chưa tải về, việc so với tệp thật bị bỏ qua lặng lẽ nên câu có thể được tự đi tiếp mà không ai biết lưới kiểm không chạy.
  - Ngoài-8: Phần trăm theo khuyến nghị mà chủ kho đọc để quyết thăng cấp có thể bị đếm cao hơn thực tế một chút.
  - Ngoài-9: Nếu trợ lý quyết định gặp lỗi, người chạy lệnh thấy kết quả bình thường và không biết mặc-ký đã tắt vì lỗi, nên mọi câu quay về hỏi người mà không có lý do.
  - Ngoài-10: Một phần danh sách loại hàng được máy tự đi tiếp không có phép kiểm giữ, nên ai đó gỡ bớt loại hàng thì bộ kiểm vẫn xanh.
  - Ngoài-11: Hướng dẫn trong khuôn có thể dạy máy ghi một giá trị mà bộ kiểm sẽ từ chối, mà bộ kiểm tự động vẫn báo xanh.
  - Ngoài-12: Nếu hướng dẫn thêm một loại câu mà mô-đun không biết, câu đó bị xếp vào loại lạ và luôn hỏi người mà bộ kiểm không báo.
- Ca `KK-8 ho-so-cu` của `tests/scripts/can-cu-s1.ca.mjs` đỏ hai lần khi chạy lẻ trong lúc máy chạy bộ kiểm khác (cả trên
  `main` `50840764`), xanh trong lượt đầy đủ trên cây cuối — chập chờn, không do vật của vòng.
