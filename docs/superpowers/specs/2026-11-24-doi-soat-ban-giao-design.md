# Đối soát bàn giao — thiết kế (24/11/2026)

Hồ sơ: `_acceptance/doi-soat-ban-giao/` · hạng T2 · mặt: dòng lệnh của gói `dispatch`.
Gốc: `delivery-loop/_acceptance/khung-dot-dinh-vi/` — qua hạt giống
`docs/plans/2026-11-24-hat-giong-giam-sat-co-quyen-va-co-so.md`, lớp 2. Vòng CHỈ làm lớp 2.

## 1. Cơn đau

Chủ kho nêu 24/11: phải tự «kiểm tra bàn giao và đối soát bàn giao sau khi đổi tài khoản». Khi một đợt Điều phối – Thợ
bàn giao tài khoản, gói `dispatch` dựng `ban-giao.json` từ git và thư mục đợt. Lúc nối lại, không bên nào đọc tệp ấy để so
trước với sau. Chủ kho mở từng dãy, so bằng mắt.

Người hưởng: chủ kho của kho chạy đợt, và phiên giám sát vừa nhận vai. Nguyên tố 2 (bằng chứng không tự dối): «đã bàn
giao» thôi là một lời nói, thành một phép so máy làm.

## 2. Hiện trạng đọc ở `main` `647bd9d5`

- Bên viết: `buocBanGiao` (`plugins/dispatch/scripts/ban-giao.mjs`) ghi `ban-giao.json` với `sha_nhanh_chinh`, `khoa`,
  `don` và mảng `day`; mỗi mục dãy do `mucDay` (`muc-day.mjs`) dựng: `nhanh`, `dinh`, `da_day`, `co_wip`, `cay_ban`,
  `slug`, `trang_thai_ho_so`… Khuôn: `scripts/mau/ban-giao.json`; ca DP4-06 `khuon` so khoá tệp thật với khuôn.
- Bên đọc: `tiep-tuc.mjs` chỉ lấy `ban_giao`, `co_wip`, `phien_cu` và `dau` (lời ghi danh của chip, loại nhịp phiên cũ).
  `sha_nhanh_chinh`, `khoa`, `don`, `dinh`, `da_day`, `cay_ban` không có bên đọc nào so với hiện tại.
- Vòng đời tệp: `roiBanGiao` chuyển `ban-giao.json` sang `ban-giao/lich-su/<mã>.json` ngay khi nối lại được, rồi xoá
  `ban-giao/xong/` và `ban-giao/dau/`. Sau bước ấy thợ chạy tiếp, nên chỉ có MỘT lúc so có nghĩa: ngay trước khi rời.
- `banGiaoXong`: từ chối khi cây bẩn hay còn đơn; cố ý không đòi đẩy (hồ sơ `dieu-phoi-doi-tai-khoan`, sổ dòng
  `d-20261011T023712Z-11`: «cùng máy chỉ đòi commit WIP, không đòi đẩy» vì pre-push của một kho tiêu thụ chạy build; AC-5
  của hồ sơ ấy ghi «không lời gọi nào đẩy nhánh»). Trường `da_day: false` nằm im trong tệp.
- `roiBanGiao` trả `khuyen_cho` khi tài khoản đang dùng đã quá ngưỡng báo trước và giữ đợt ở pha `cho-tiep-tuc`. Nhưng
  `tiepTuc` vẫn trả `ke_hoach` có hàng `mo-chip` kèm lời ghi danh, và `commands/resume.md` bước 2 ghi «đi tiếp bước 3» —
  bước 4 mở chip trên một tài khoản sắp hết hạn mức.
- `docJson` ném lỗi khi tệp không phải JSON: `ban-giao.json` hỏng hôm nay đã làm `tiep-tuc` thoát 1 ở `roiBanGiao`.
- Số đo ở đợt thật (đọc trên máy này, chỉ đếm): đợt `vo-khu-muc-tieu` của một kho tiêu thụ (25–27/10) vào bàn giao 3 lần
  do chạm hạn mức; sổ sự kiện không có dòng `tiep-tuc-ban-giao` nào (0 lần rời qua lệnh nối lại); bản bàn giao cuối còn
  mở lúc đợt đóng: 5 dãy, 2 chưa đẩy, 3 dở, 3 cây bẩn.

## 3. Phương án

**A — so ngay trong `tiep-tuc`, bản mở trước khi rời (chọn).** Một bên đọc mới (`scripts/doi-soat.mjs`) nhận bản
`ban-giao.json` đang mở và dựng trạng thái hiện tại bằng CHÍNH `mucDay` của bên viết. `tiepTuc` gọi nó trước `roiBanGiao`,
gắn kết quả vào khoá `doi_soat` khi lệnh vừa rời bàn giao hoặc bị khuyên chờ. Không tệp mới, không lệnh con mới, không
đổi khuôn `ban-giao.json`.

**B — lệnh con riêng `doi-soat`.** Chủ kho hay phiên phải nhớ gọi thêm một lệnh; lệnh gọi sau khi rời thì bản mở đã
chuyển vào lịch sử và thợ đã chạy tiếp — mọi dãy lệch. Loại: thêm một việc phải nhớ, đúng thứ vòng này gỡ.

**C — ghi bảng trước/sau vào bản lịch sử rồi khung đợt đọc.** Có sổ lâu dài, nhưng thêm một trường ghi mà chưa có bên
đọc (đúng lớp lỗi đang sửa) và chạm khung đợt (mặt người nhìn). Loại ở vòng này; ghi ở mục Ngoài phạm vi.

## 4. Thiết kế

### 4.1 Bên đọc `doi-soat.mjs`

`doiSoatBanGiao(thuMuc, bg)` trả `{ ma, khop, so_day, day_khop, lech, chua_day, co_vang, dong }`.

Danh sách trường bên đọc cần nằm MỘT chỗ có marker trong tệp này:

```js
// <<<BAN-GIAO-TRUONG-DOC
export const TRUONG_DOC = { goc: ['ma', 'sha_nhanh_chinh', 'day', 'khoa', 'don'], day: ['id', 'slug', 'trang_thai_ho_so', 'nhanh', 'dinh', 'cay_ban'] };
export const BO_QUA = { goc: { trang_thai: '…lý do…', dot: '…', luc: '…', vao_luc: '…', ly_do: '…', boi: '…' }, day: { hang: '…', da_day: '…', co_wip: '…', ban_giao: '…', cham_lai_cung_round: '…', viec_cho_nguoi: '…', phien_cu: '…' } };
// BAN-GIAO-TRUONG-DOC>>>
```

`TRUONG_DOC` hợp `BO_QUA` phải bằng đúng tập khoá của tệp bên viết sinh và của khuôn — hai chiều: trường bên đọc cần mà
bên viết không ghi là đỏ; trường bên viết ghi mà không ở danh sách nào cũng đỏ («không có bên đọc»). `da_day` nằm ở
`BO_QUA`: trạng thái đẩy đo lại lúc nối lại thành cờ `chua_day`, không so trước với sau.

Bên đọc dùng chính hằng ấy để phát hiện trường vắng; ca khứ hồi dùng nó để buộc bên viết.

Chiều so, mỗi chiều một hàng `lech` `{day, chieu, truoc, sau}` khi trước ≠ sau:

| `chieu` | Trước (tệp) | Sau (hiện tại) |
|---|---|---|
| `nhanh` | `day[].nhanh` | nhánh đang checkout ở worktree dãy |
| `dinh` | `day[].dinh` | `HEAD` của worktree; câu nêu quan hệ: tiến n commit · lùi n commit · khác lịch sử |
| `cay` | `day[].cay_ban` | `git status --porcelain` có dòng không |
| `ho-so` | `day[].slug` + `trang_thai_ho_so` | hàng kế của dãy + `status` hồ sơ trong worktree |
| `worktree` | có nhánh lúc bàn giao (câu nêu nhánh và đỉnh lúc bàn giao) | worktree không còn |
| `day` | dãy có trong tệp | dãy không còn trong đợt, hoặc dãy mới không có trong tệp |
| `khoa` | `khoa[]` | chủ từng khoá `s4`, `duong-nen`, `merge` |
| `don` | `don[]` | tệp trong `xin/` |
| `nhanh-chinh` | `sha_nhanh_chinh` | nhánh chính đọc bằng CÙNG hàm bên viết; câu nêu số commit dời |

`chua_day`: dãy mà kho có remote và đỉnh hiện tại không nằm trong nhánh theo dõi (chưa có nhánh theo dõi cũng tính). Đây là cờ, không phải lệch: nó hiện kể
cả khi trước và sau giống nhau. Kho không có remote nào thì không cờ (không có chỗ để đẩy).

`co_vang`: trường của `TRUONG_DOC` vắng trong tệp (tệp ghi bằng bản gói cũ). Chiều tương ứng bỏ qua, các chiều khác vẫn
so; mỗi trường vắng một dòng vàng. Không ném lỗi.

`dong` — chữ cho người, phiên nói lại nguyên văn:

- khớp hết, không cờ, không vàng → ĐÚNG MỘT dòng:
  `đối soát bàn giao <mã>: <n> dãy khớp bản ghi lúc bàn giao · khoá và đơn khớp · nhánh chính không dời`
- ngược lại → dòng đầu `đối soát bàn giao <mã>: <k>/<n> dãy khớp · <m> dòng cần đọc`, rồi CHỈ các dòng lệch, cờ và vàng.
  Dãy khớp không có dòng nào.

Dòng không mang đường dẫn tuyệt đối; sha in bảy ký tự. Không từ nào của một kho tiêu thụ.

### 4.2 `tiepTuc`

Thứ tự mới (dạng đầy đủ, không `--nhe`): nhận vai → nếu đợt đang ở một pha bàn giao thì đọc bản mở và đối soát → gọi
`roiBanGiao` như cũ → kết quả.

| Tình huống | `doi_soat` |
|---|---|
| đợt không ở pha bàn giao (kể cả đợt đã nối lại từ trước, còn bản trong `lich-su/`) | không có khoá |
| `--nhe` | không có khoá |
| `can_doc_han_muc` (phiên chưa đọc mức dùng) | không có khoá — phiên đọc rồi gọi lại |
| rời được bàn giao, có bản mở | có, so với bản mở |
| `khuyen_cho`, có bản mở | có, so với bản mở |
| rời cưỡng bức khi chưa có bản mở nào | có, `khong_ban_truoc: true`, một dòng nói bản bàn giao dựng ngay lúc nối lại |

**Khuyên chờ không mở chip:** kết quả mang `khuyen_cho` thì `ke_hoach` là mảng rỗng. Chỗ chặn đặt ở kết quả của
`tiepTuc`, không ở `keHoachDay`: chip chỉ được mở ở bước 4 của thân lệnh, theo `ke_hoach` của lệnh nối lại; chẩn đoán
không mở chip (`VIEC_HANH_DONG['mo-chip']`: «chẩn đoán không mời mở lại»). Đổi hàm dùng chung thì đổi cả đầu ra chẩn
đoán của mọi kho mà không chặn thêm lần mở chip nào.

### 4.3 Bàn giao chưa đẩy lộ ra (theo lối khuyến nghị «cho qua kèm cờ»)

`chuaDay(worktree)` trong `muc-day.mjs`: kho có remote ∧ có đỉnh ∧ đỉnh không nằm trong nhánh theo dõi (đỉnh lùi sau
nhánh theo dõi KHÔNG tính là chưa đẩy). Hàm chỉ đọc, không đổi trường nào của `mucDay`. Một hàm cho ba chỗ:

1. `ban-giao-xong` vẫn thoát 0; dòng in thêm ` · CHƯA ĐẨY nhánh <nhánh> — commit chỉ có ở máy này`.
2. Câu `tin` của sự kiện `ban-giao-dung` (câu chủ kho đọc TRƯỚC khi đổi tài khoản) thêm ` Dãy chưa đẩy nhánh: P1, P2.`
3. `doi_soat.chua_day` lúc nối lại.

Kho không có remote: cả ba chỗ im, từng byte như trước vòng.

### 4.4 Thân lệnh và tài liệu

`commands/resume.md` bước 2: thêm dòng `doi_soat` (nói nguyên văn từng dòng của `doi_soat.dong`, trước mọi việc mở chip);
dòng `khuyen_cho` đổi «đi tiếp bước 3» thành DỪNG. `README.md` của gói, mục «Đổi tài khoản», nêu ba điều mới.
`CONTEXT.md` mục «Bàn giao tài khoản» thêm một câu về đối soát.

## 5. Đo

Một tệp ca mới `tests/dieu-phoi/doi-soat-ban-giao.test.mjs` (tên ca bắt đầu `DS-`), không sửa tệp ca đã ký. Kho thử do
mã sinh trong lượt: kho git thật, hai worktree liên kết thật, remote là kho bare, đợt mở bằng CLI thật, bàn giao dựng
bằng nhịp bộ phát lịch thật. Ngày commit và danh tính ghim cứng để sha tất định. Đường dẫn suy từ vị trí tệp ca.

- **Khứ hồi:** tệp do bên viết thật sinh → bên đọc thật đọc → khớp, một dòng, không dòng vàng; mọi trường của
  `TRUONG_DOC` có trong tệp thật và trong khuôn `mau/ban-giao.json`. Đỏ: bản sao đổi tên một trường ở bên viết.
- **Ma trận lệch viết trước (12 hàng):** mỗi hàng phá MỘT thứ thật trong kho thử sau khi bàn giao đã dựng; số hàng đúng = số hàng
  ma trận; mỗi hàng ra đúng tập `chieu` mong đợi. Đối chứng dương là ca khứ hồi trên cùng kho thử.
- **Mẫu chữ:** các dòng `dong` của MỌI lớp — khớp, mười hai hàng lệch, CHƯA ĐẨY, năm dòng vàng, không có bản trước — ghi ra `_acceptance/doi-soat-ban-giao/mau-dong.md` bằng mã; một ca so
  tệp đã commit với bản sinh lại. Hội đồng chấm chữ đọc đúng tệp ấy — không đọc văn viết tay.
- **Mỗi phép đo mới có chiều đỏ ghim thông điệp** trên bản sao gói bị tiêm, sau khi bản lành xanh trên cùng kho thử.
- **Chiều im:** kho chưa từng bàn giao — kết quả `tiep-tuc --json` của bản mới bằng bản ở gốc vòng (gói rút trọn bằng
  `git archive`), và không có khoá `doi_soat`.
- **Vùng vật:** tệp vòng đổi nằm trong danh sách cho phép (gói `dispatch`, ca của gói, hồ sơ, tài liệu).
- **Không vỡ ca đã ký:** bước CI thật của gói (`tests/dieu-phoi/**/*.test.mjs`, rút từ `gate.yml`) xanh.

## 6. Cân trên mọi kho

| Kho | Thấy gì |
|---|---|
| không cài gói `dispatch` | không đổi gì — vòng không chạm tệp nào ngoài gói và ca của gói |
| cài gói, chưa từng bàn giao | `tiep-tuc` như cũ từng trường (ca vi phân với gốc vòng) |
| có `ban-giao.json` ghi bằng bản cũ thiếu trường | đọc được; mỗi trường vắng một dòng vàng; không phải sửa tệp |
| bàn giao, không có remote | có đối soát; không chữ «CHƯA ĐẨY» ở đâu |
| bàn giao, có remote, nhánh chưa đẩy | thêm chữ «CHƯA ĐẨY» ở ba chỗ; `ban-giao-xong` vẫn thoát 0 |
| nối lại trên tài khoản quá ngưỡng báo trước | khác trước: không còn hàng `mo-chip`; lệnh người dừng sau một dòng báo |

## 7. Giới hạn khai trước

- Nhánh chính đọc từ ref cục bộ (`origin/<nhánh chính>` rồi nhánh cục bộ), không fetch: commit chưa kéo về thì không đếm.
- `ban-giao.json` hỏng JSON làm `tiep-tuc` thoát 1 ở `roiBanGiao` — hành vi có từ trước, vòng không sửa.
- `chan-doan` gọi riêng trong lúc khuyên chờ vẫn xếp dãy không phiên sống là `mo-chip` (mục `du`, không mời mở lại).
- Bảng trước/sau chỉ sống trong kết quả của lần `tiep-tuc` ấy; phiên chết trước khi nói lại thì mất.
- «Câu hỏi chủ kho đang mở» và «PR» của hạt giống không vào vòng (mục Ngoài phạm vi của hợp đồng).

## 8. Dự báo năm dòng số (luật chiều rộng c)

| Dòng | Dự báo | Vì sao |
|---|---|---|
| làm-xong→gộp-được (làm-xong→ký / ký→gộp) | = / = | vòng không chạm đường ký hay đường gộp |
| lượt gọi người mỗi vòng (trong / ngoài thiết kế) | = / ↓ ở đợt có đổi tài khoản | bớt lượt chủ kho hỏi «dãy này còn nguyên không» sau khi nối lại |
| vòng bị hạ tầng kit đốt lượt chấm | = | không chạm đường chấm |
| token máy mỗi vòng | = | `tiep-tuc` thêm vài lệnh git đọc, không gọi model |
| phút máy mỗi lượt chấm | ↑ nhẹ | thêm một tệp ca vào bước CI của gói (ước < 1 phút) |

Điều kiện tin cậy: đường verdict (finder → refute trong hợp đồng → REJECT) không đổi thành phần — vòng không chạm
`plugins/feature-loop/workflows/` hay lõi.
