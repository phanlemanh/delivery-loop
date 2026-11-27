# Thiết kế — V1: khoá và tên quyền của bản uỷ quyền đổi sang tiếng Anh

**Ngày:** 2026-11-28 · **Hồ sơ:** `_acceptance/doi-ten-ban-uy-quyen/` · **Hạng:** T2 · **Gốc:** ADR 0030
(`docs/adr/0030-giam-sat-doc-ban-uy-quyen-cua-kho.md`), hồ sơ đã ký `_acceptance/giam-sat-doc-ban-uy-quyen/`, quyết định
của chủ kho 28/11 («Đôi trước mốc», «Phê cả bốn» cho đề xuất lộ trình sau DL6).

## 1. Ý định và vì sao bây giờ

Chủ kho đặt luật cho cả kit từ 28/11: **máy đọc tiếng Anh, người đọc tiếng Việt** — tên khoá tiếng Anh, mọi chữ hiện cho
người là tiếng Việt có dấu. Bản uỷ quyền `governance/delegation.yaml` (DL6, gộp 27/11) đang dùng khoá và tên quyền tiếng
Việt không dấu. Chưa mốc nào phát hành bộ đọc, chưa kho nào viết tệp (phiên giữ đợt đo 28/11: ba kho tiêu thụ không có tệp,
kho Repo Standards không nhắc `tu_lam` hay `delegation.yaml`). Đổi bây giờ không cần đường đọc tên cũ; đổi sau mốc thì tên
cũ phải được đọc mãi.

**Người hưởng:** chủ kho của mọi kho tiêu thụ — viết bản uỷ quyền một lần bằng tên cùng hệ với mọi khoá máy khác, không
phải chuyển tên sau này; và kit — không mang một bảng tên cũ phải đọc mãi.

## 2. Mục tiêu · không làm · phản mục tiêu

- **Mục tiêu:** tệp viết bằng tên mới đọc được đúng như tệp tên cũ đọc hôm nay; tệp mang bất kỳ tên cũ nào bị từ chối cả
  tệp, kèm câu gọi đúng tên mới; kho không có tệp chạy từng byte như trước vòng.
- **Không làm:** tên sự kiện nhật ký đợt (kể cả `dung-quyen`), tên tệp script và tên lệnh con (`thu-tu-gop.mjs`,
  `thu-tu-gop.json`, lệnh `thu-tu-gop`, lệnh `gop`), loại yêu cầu `chuyen-hang` của luật đợt (cùng chữ, khác nghĩa), khoá
  `tu_merge` của thẻ mở đợt (đổi ở vòng sổ khoá V2a, có đường đọc tên cũ), mọi khoá trong `_acceptance/config.yaml`; không
  cắt thẻ, không viết tệp uỷ quyền vào kho nào; không sửa hồ sơ đã ký của DL6.
- **Phản mục tiêu:** một tệp tên cũ được nhận im lặng (dù chỉ một phần) · tên khoá tiếng Anh thay lời giải thích tiếng
  Việt trên thẻ · vùng cấm hay danh sách đóng bị nới qua đường đổi tên · kho không có tệp đổi dù một byte.

## 3. Bảng tên (đề nghị — tên cuối chủ kho chốt ở Cổng Phạm vi)

| Hôm nay | Tên mới | Nhóm |
|---|---|---|
| khoá `ban` | `version` | khoá |
| khoá `tu_lam` | `delegated` | khoá |
| `gop` | `merge` | nhận |
| `thu-tu-gop` | `merge-order` | nhận |
| `phien` | `session` | vẫn hỏi |
| `chuyen-hang` | `reassign-row` | vẫn hỏi |
| `mo-day` | `open-lane` | vẫn hỏi |
| `phan-quyet-chung` | `shared-ruling` | vẫn hỏi |
| `lo-trinh` | `roadmap` | vẫn hỏi |
| `muc-ngoai-hop-dong` | `out-of-contract` | sai chỗ |
| `thiet-ke` | `design` | sai chỗ |
| vùng cấm `chu-ky` | `gate-signoff` | vùng cấm |
| vùng cấm `cat-ban` | `release` | vùng cấm |
| vùng cấm `xoa-nhanh` | `delete-branch` | vùng cấm |
| vùng cấm `day-kho-khac` | `push-other-repo` | vùng cấm |
| vùng cấm `cai-dat-github` | `github-settings` | vùng cấm |
| vùng cấm `workflows` | `workflows` (giữ) | vùng cấm |
| vùng cấm `governance` | `governance` (giữ) | vùng cấm |
| vùng cấm `luat-san-pham` | `product-invariants` | vùng cấm |
| vùng cấm `pham-vi-dot` | `dispatch-scope` | vùng cấm |
| vùng cấm `luat-dot` | `dispatch-rules` | vùng cấm |
| vùng cấm `uy-quyen` | `delegation` | vùng cấm |

**Chỗ máy chọn khác đề bài:** đề bài liệt khoá, quyền và hai tên sai chỗ, KHÔNG liệt vùng cấm. Vùng cấm cũng là tên người
viết vào danh sách `delegated` (để bị từ chối với câu đúng), nên để tiếng Việt thì tệp mang hai hệ tên. Máy đề nghị đổi chín
tên vùng cấm, giữ `workflows` và `governance` (đã là tiếng Anh). Đổi tên không nới vùng cấm: tên cũ của vùng cấm vẫn làm cả
tệp bị từ chối (§4), chỉ câu lỗi đổi. Lối khác: giữ tên vùng cấm tiếng Việt — rẻ hơn tám dòng, đổi lại tệp lẫn hai hệ tên và
V2a phải mở lại bảng này.

`dispatch-scope` / `dispatch-rules`: «đợt» trong định danh tiếng Anh của kit gắn với gói `dispatch`; `CONTEXT.md` cấm
«batch», «sprint» cho đợt.

`version` vẫn nhận đúng bản `1`: tên cũ bị từ chối bất kể số bản, và chưa tệp nào ngoài đời, nên không cần nâng số bản để
phân biệt hai hệ tên.

## 4. Tệp viết bằng tên cũ

Bộ đọc giữ MỘT bảng `TEN_CU` (tên cũ → tên mới) cạnh `LOAI` và `VUNG_CAM` trong `plugins/dispatch/scripts/uy-quyen.mjs`.
Bảng chỉ dùng để gọi tên, không bao giờ để nhận:

- khoá cột 0 là `ban` hay `tu_lam` → lỗi đọc ngay ở dòng ấy: `tên cũ «tu_lam» — bản uỷ quyền nay dùng «delegated»; cả tệp
  bị từ chối`;
- một phần tử của `delegated` là tên quyền cũ → cùng câu với tên quyền mới; là tên cũ của vùng cấm → câu thêm «(vùng cấm
  cứng, không cấu hình được)» để người không tưởng đổi tên là được nhận.

Không có đường đọc tên cũ: tệp mang một tên cũ thì không quyền nào được nhận, kể cả các tên mới cùng tệp (cùng luật «tên lạ
làm cả tệp bị từ chối» của ADR 0030). Lý do có câu gọi tên mới thay vì «loại lạ»: ADR 0030 đã công khai tên cũ, người đọc ADR
có thể đã gõ theo.

Thứ tự kiểm trong danh sách: tên cũ → vùng cấm (tên mới) → danh sách đóng (tên lạ). Phần tử đầu gặp lỗi quyết câu lỗi.

## 5. Bên đọc khác

- **Sự kiện `dung-quyen`:** trường `quyen` mang tên mới (`merge`, `merge-order`). Không bên đọc nào so chuỗi tên cũ:
  `dem.mjs` gom theo giá trị `quyen` bất kỳ, `lich.mjs` / `phat-lich.mjs` chỉ đọc tiến độ `gop` của hàng (chữ khác nghĩa,
  không thuộc bản uỷ quyền), lệnh `dieu-phoi.mjs gop` và `thu-tu-gop` là tên lệnh.
- **Thẻ khởi tạo và báo cáo đợt nói tiếng Việt** (luật «người đọc tiếng Việt»): mỗi loại trong `LOAI` mang thêm `nghia` —
  một cụm tiếng Việt cho người (vd `merge` → «gộp PR theo quyền», `merge-order` → «xếp lại thứ tự gộp»). Khối `uy_quyen`
  của `the khoi-tao --json` thêm `nghia: {<tên>: <nghĩa>}` cho mọi tên trong `nhan` và `van_hoi`; `dem --json` thêm
  `dung_quyen.nghia` cho mọi tên trong `theo_quyen` mà kit biết. Chỉ dẫn (`commands/open.md`, `commands/close.md`) bảo
  phiên trình nghĩa tiếng Việt, tên tiếng Anh đặt trong ngoặc. Kho không có tệp / sổ không có `dung-quyen` → không khoá
  mới nào (chiều im giữ nguyên). Đây là CỘNG nhỏ — cần chủ kho phê ở Cổng Phạm vi. Lối khác: chỉ dặn bằng lời trong
  `open.md` (hiến pháp cấm dặn-bằng-lời làm nghiệm), hoặc giữ tên trơn trên thẻ (trái luật chủ kho đặt).

## 6. Hồ sơ đã ký của DL6

Eval E1–E10 của DL6 chạy `rang/chay.sh AC-n`, kịch bản đòi đúng TÊN CA (`UQ-0n …`), không đọc tên quyền. Cách xử lý đề
nghị: giữ nguyên mọi tên ca `UQ-…`, đổi NỘI DUNG ca sang tên mới (tệp thử, ma trận, chuỗi tiêm của ca đỏ, thông điệp ghim);
không sửa byte nào trong `_acceptance/giam-sat-doc-ban-uy-quyen/`. Bằng chứng V1 chạy lại `rang/chay.sh AC-1…AC-10` của DL6
trên cây mới — chứng mười tiêu chí của DL6 còn đứng với tên mới, gồm cả chiều đỏ.

- **Giá:** hồ sơ DL6 hoá cũ (bằng chứng ghim một commit trước vòng, vật đổi sau đó) — trạng thái chấp nhận được giữa hai mốc (luật re-pin
  theo release). Chiến dịch Mốc A ghim lại nó; eval E11 (đọc chỉ dẫn) là eval ngoài làn máy mà vật của nó đổi, nên chiến
  dịch phải đi một lượt S4 delta cho DL6 thay vì ghim lại máy. Chữ `expected` của E1–E10 còn nhắc tên cũ — sử liệu, không
  phải phép đo.
- **Lối khác — ghim lại DL6 trong vòng này:** lượt S4 delta cho DL6 là lượt đo dài thứ ba của vòng (phải hỏi chủ kho), và
  hồ sơ đã ký bị chạm giữa một vòng khác. Đắt hơn, không thêm gì người dùng thấy trước Mốc A.
- **Lối khác — eval rút tên từ một bảng:** không cần — eval DL6 đã không phụ thuộc tên quyền.

Chiều im «như trước vòng»: ca `UQ-05` của DL6 so với `2956dae2` (đỉnh trước DL6, chưa có bộ đọc). V1 thêm ca `TA-04` so
với đỉnh trước vòng `a9b7cbe6`, dùng lại chính hàm so bốn lệnh và lệnh `gop` không cờ của `UQ-05` với gốc so là tham số
(bản gốc so là trọn thư mục `plugins/dispatch` qua `git archive`, theo luật bản base của kho). Cả hai chạy trong bằng chứng
V1.

Hành vi tên mới = hành vi tên cũ: ca `TA-01` chạy vi phân giữa bộ đọc ở `a9b7cbe6` (tệp tên cũ) và bộ đọc mới (tệp tên mới
sinh từ tệp cũ bằng `TEN_CU`), so nhóm và câu từng loại, điều chạm từng mục vùng cấm — không dựa vào ma trận viết tay mà
vòng này tự sửa.

## 7. Sửa ADR 0030

Thêm một mục «Sửa 28/11» ở cuối ADR: bảng tên §3, câu về tệp tên cũ (§4), câu về `nghia`; không viết lại các Quyết định
1–5 hay lịch sử. Thân ADR giữ tên cũ như đã quyết ngày 26/11.

## 8. Vật chạm

`plugins/dispatch/scripts/uy-quyen.mjs` (bảng tên, `TEN_CU`, `nghia`, bộ phân tích), `gop.mjs` và `thu-tu-gop.mjs` (tên
quyền trong phép kiểm, câu chặn, `dung-quyen`), `the.mjs` (`nghia`), `dem.mjs` (`nghia`), `commands/open.md`,
`commands/close.md`, `scripts/mau/LUAT.md`, `README.md` của gói; `tests/dieu-phoi/uy-quyen.test.mjs` (nội dung ca DL6 +
ca mới `TA-…`); ADR 0030. Không chạm `lich.mjs`, `phat-lich.mjs`, `dieu-phoi.mjs` (chỉ mang tên lệnh / tiến độ).

## 9. Approaches

- **A — đổi tên tại chỗ + bảng tên cũ chỉ để gọi tên (chọn).** Một bộ đọc, một bảng; tên cũ không bao giờ được nhận.
- **B — đọc cả hai hệ tên, cờ vàng cho tên cũ.** Đường đọc tên cũ sống mãi — đúng thứ vòng này tồn tại để tránh khi chưa
  ai dùng; đề bài loại.
- **C — chỉ đổi, tên cũ rơi về «loại lạ» / «khoá lạ».** Rẻ hơn một bảng, nhưng tệp `ban: 1 / tu_lam: [...]` sẽ chỉ báo
  «thiếu delegated» và một cờ vàng «khoá lạ tu_lam» — người gõ theo ADR không biết tên đúng. Loại.

## 10. Để lại cho người dựng

Câu chữ cụ thể của `nghia` từng loại (theo `CONTEXT.md`), vị trí ca `TA-…` trong tệp ca, cách tách hàm cho bảng `TEN_CU`.
