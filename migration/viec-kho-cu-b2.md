# Việc ở kho cũ mà vòng B2 cần — danh sách sửa NGỮ NGHĨA (sổ, không phải ô)

Ghi 14/11/2026 từ vòng B2 `bo-kiem-xanh-o-kho-moi` (hồ sơ `_acceptance/bo-kiem-xanh-o-kho-moi/`). Kịch bản chuyển nhà chỉ
làm phép biến đổi cơ học; các mục dưới đây đòi đổi ý nghĩa của sản phẩm (kể cả bộ kiểm — `.claude/rules/chuyen-nha.md` xếp
`tests/` vào sản phẩm), nên chỉ sửa được ở kho cũ `acceptance-gate-kit`. Cột «Phủ bởi» đối chiếu với
`migration/hat-giong-goi-cheo-loi-dieu-phoi.md` — phần vòng gọi chéo song song đã nhận.

**Cách đọc số:** khoá ca = dòng kết quả của bộ chạy (`.acceptance-runs/thoi-gian-ca/*.tsv`, TAP của bộ điều phối), đo
theo túi trên `kit-cu/main` `593e6837` (5 548 khoá đạt) so với cây kịch bản dựng. Phần «cơ học» (đường dẫn trong tệp kiểm,
tên đổi theo bảng tên) do kịch bản lo, không nằm ở đây.

## 1. Đã phủ bởi vòng gọi chéo (không cần báo thêm)

| Mục | Ca ở cây mới đỏ vì nó | Phủ bởi |
|---|---|---|
| Lõi gọi thẳng `../dieu-phoi/scripts/{hinh-dang,dot,cua-tin-hieu}.mjs` (`scripts/tin-hieu.mjs`, `scripts/gui-tin-hieu.mjs`) | `tin-hieu.test.mjs` (47 khoá), các tệp `cua-tin-hieu-*.test.mjs` | hạt giống §1 |
| `commands/acceptance-init.md` trỏ `${CLAUDE_PLUGIN_ROOT}/dieu-phoi/scripts/…` | `P08` (bộ plugins) | hạt giống §1 |
| `scripts/plugin-declare.mjs` đọc `../.claude-plugin/marketplace.json` | `DP1-08` và các ca chạy `plugin-declare` (bộ điều phối) | hạt giống §1 |
| Hằng tên plugin cũ `GOI_ROAD_MAP`, `p('dieu-phoi')` | các ca lộ trình và kiểm bản cài tra plugin theo tên | hạt giống §2 |

## 2. CHƯA phủ — cần gom vào vòng kho cũ

| # | Tệp (kho cũ) | Vì sao đỏ ở kho mới | Đường đúng tầng đề xuất | Hệ quả nếu chưa sửa |
|---|---|---|---|---|
| K1 | `tests/plugins/ra-co-ten.test.mjs` ca `RT13` | Ca quét MỌI hồ sơ của cây thật, chạy bộ phân loại cũ (mốc `cb38ea01`) và mới, rồi đòi mọi chỗ lệch nằm trong một danh sách ĐÓNG (`KHAC-BIET-DOC-CU` ở `_acceptance/ra-co-ten-lam-va-trao/contract.md`). Hồ sơ nào sinh sau mốc và có ô cơ hội «Không đo được» thì lệch `cho-cong-gia-tri → da-giao-khong-do` khi ký — đúng như bộ mới định nghĩa — và ca đỏ. Đỏ ở `chuyen-nha` từ khi hồ sơ B1 `kich-ban-chuyen-nha` ký 14/11; sẽ đỏ lại khi hồ sơ B2 ký; và đỏ ở mọi kho có hồ sơ của riêng nó nếu kho ấy chạy bộ kiểm của kit | Bộ so chỉ xét hồ sơ có từ trước mốc (danh sách rút từ `git ls-tree <mốc> _acceptance/`), hoặc xét lớp «bộ mới là định nghĩa» bằng quan hệ thay vì danh sách đóng — CLAUDE.md: «đừng ghim con số này thành danh sách đóng» | MỌI lượt chấm ở kho `delivery-loop` có suite `plugins` đỏ → REJECT (đúng hình MC-11 ở B1). B2 không chấm được tới khi mục này gộp, hoặc khi chủ kho cho một lối khác |

## 3. Chưa phân loại xong (đo tiếp ở bước thi công của B2)

- **GL07** (`tests/scripts/repin-lane-lop-cu.test.mjs`; kéo theo `T04 mot-nguon` và `eval-thay-boi.test.mjs` chạy lại nó) —
  đỏ trên CẢ cây cũ `593e6837` ở Mac Studio khi `TMPDIR` là đường dài; tìm ra 14/11: ca cắt đầu ra ở 240 ký tự (`cut`), đường
  tạm dài đẩy thông điệp ghim ra ngoài. `TMPDIR` ngắn → xanh. B2 sửa ở thước (lượt đo dùng `TMPDIR` ngắn), KHÔNG chặn B2.
  Việc nhỏ cho kho cũ (không gấp): ca so thông điệp không nên phụ thuộc độ dài đường tạm — che đường tạm trước khi cắt.
- Phần dư sau phép đổi cơ học (đo 14/11, nguyên mẫu một lượt: còn ~2 074 khoá ở ~130 tệp kiểm) chủ yếu là hình dạng tệp
  kiểm dựng bản sao kit theo bố cục cũ — cơ học, kịch bản lo. Mục nào trong đó hoá ra là ngữ nghĩa sẽ được thêm vào §2 và
  báo phiên giữ đợt ngay khi thấy, không đợi tới lượt chấm. → Đã phân loại xong ở §4 (15/11, sau lượt đo 5).

## 4. Phần dư sau năm lượt đổi cơ học (đo 15/11) — CHƯA phủ, cần vòng kho cũ

Năm lượt đo của timebox Hỏi-2: thiếu 2 819 → 1 356 → 1 266 → 629 → **598** / 5 552 khoá (lượt 5: cây kịch bản `a31f9da6`
dựng từ `593e6837`; bước 6 = luật chung + 316 mục vá theo tệp, thước đảo 298/298). Từng khoá thiếu kèm lớp và tệp kiểm:
`migration/kich-ban/ket-qua/phan-du-luot-5.tsv`; căn cứ phân loại (tệp · dòng · đề xuất sửa từng ca):
`migration/kich-ban/ket-qua/va-luot-4/*.md`.

| Lớp | Khoá | Ai gỡ |
|---|---|---|
| A — mã sản phẩm, đã phủ bởi §1 (gọi chéo) | 185 | vòng gọi chéo |
| B — mã / tài liệu sản phẩm còn bố cục cũ, CHƯA phủ (K2) | 52 | kho cũ |
| C — hồ sơ `_acceptance/` đã ký mang đường cũ (K3; 4 khoá là K1) | 20 | quyết định chính sách |
| D — ca kiểm phải đổi nghĩa (K4) | 340 | kho cũ — `tests/` là sản phẩm |
| K — lỗi của chính kịch bản (P196) | 1 | vòng B2, `migration/` |

Phần «không do kho cũ» còn **1 khoá** (lớp K), dưới ngưỡng 5 % của Hỏi-2 — vòng B2 không dừng; nó CHỜ kho cũ.

| # | Tệp (kho cũ) | Vì sao đỏ ở kho mới | Đường đúng tầng đề xuất |
|---|---|---|---|
| K2a | `feature-loop/scripts/carry-plan.mjs:38` | vắng `--ag-root` thì đoán gốc lõi là `HERE/../..` — kho mới ra `plugins/` (carry-plan.test 24 khoá, P164) | tìm gốc lõi qua `resolve-plugin.mjs` như các script khác, không đoán theo độ sâu thư mục |
| K2b | `skills/acceptance/references/human-facing-language.md` (khối `GATE-INVITE-SITES`, `GATE-ONESHOT-SITES`, `COMMAND-NAMES`) · `skills/design-pass/SKILL.md:188-190` (`REACTION-DEFAULT-SITES`) | danh sách site ghi đường tính từ gốc kho phẳng; ở kho mới site nằm ở nhiều plugin (P188, P193, LB1, DP11, moi-cong-khong-qua-nut 17 khoá) | ghi site dạng `<plugin>:<đường trong plugin>` và để bộ đọc giải gốc từng plugin |
| K2c | `.claude/settings.json:28` | `permissions.allow` còn `node scripts/product-map.mjs` (LM1) | rút lệnh từ `feature_loop.suite_keys` thay vì chép tay |
| K2d | `docs/findings/assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs:20,32` | `require` theo đường gốc kho phẳng (JI12) | require qua gốc lõi truyền vào |
| K3 | hồ sơ đã ký: `release-2-3-0`…`2-8-0`, `lenh-tran-tai-lieu-dau-tay`, `trang-ho-so-mot-viec`, `vao-co-o-ra-co-ten` (verifier `scripts/product-map.mjs`, `scripts/evidence-page.js`) · `cua-veto-sau-chu-ky/fixture.mjs` · `lan-may-song-qua-bo-phan-loai/contract.md` (phạm vi bằng thư mục cũ) · `stop-patching-law/make-record.mjs:81` · `ra-co-ten-lam-va-trao/evals.yaml` | ca quét corpus hồ sơ thật hoặc chạy lại verifier đã khai; hồ sơ đã ký là lịch sử, sửa nó đổi băm chữ ký | CHỌN MỘT (chủ kho): (a) bộ đọc hồ sơ dịch đường cũ → mới cho hồ sơ sinh trước ngày cắt sang (răng: danh sách rút từ `git ls-tree <mốc> _acceptance/`), (b) kịch bản viết lại hồ sơ và ghim lại một lượt, (c) bỏ các khoá này có lý do ở Cổng Bằng chứng |
| K4 | ~35 tệp kiểm (lớn nhất: `lo-trinh` 44, `doc-jsx-va-ban-do-hong` 43, `lo-trinh-du-lieu-ngay` 26, `khoi-khuon-tren-the-cong` 21, `moc-chien-dich` 15, `kiem-ban-cai-loi-sua` 14, `dieu-phoi/*` 10, `can-cu-s1.ca` 9 …) | một hằng / hàm đường dùng chung cho cây hiện tại VÀ bản `git archive` / `git show` của commit lịch sử (bố cục cũ); hoặc chép vào thư mục tạm thiếu thư mục cha; hoặc danh sách đóng sắp theo tên đã đổi | mỗi bản (lịch sử / hiện tại) mang đường của chính nó — hàm `duongTai(sha, rel)` đọc bố cục của commit ấy; danh sách đóng rút từ vật thay vì chép |

### 4.1 Đo lại trên nguồn có #503 (15/11)

Cây cũ `644e9b49` (= `kit-cu/main` sau khi gộp #503, 5 556 khoá) so cây kịch bản `8d797a91`: thiếu **468** khoá. Từng khoá:
`migration/kich-ban/ket-qua/phan-du-luot-6.tsv` (lớp giữ theo lượt 5 cho cùng khoá). Bảng vá ghim lại một mục cho khớp
nguồn mới (khối RT13 của `ra-co-ten.test.mjs`, #503 thêm dòng `OLD_SCAN`); 74 mục khác trỏ tệp #503 sửa vẫn khớp.

| Lớp | Lượt 5 | Về nhờ #503 / B2 | Còn |
|---|---|---|---|
| A — gọi chéo | 185 | 98 (`tin-hieu` 38, «(đầu)» 24, `cua-tin-hieu-giua-chien-dich` 14, `kho-moi-cai-goi-road-map` 12, `kho-cam-ket-co-lo-trinh` 7, …) | **87** |
| B / K2 | 52 | 25 (K2a `carry-plan` 24 — đã về, không cần sửa; «(đầu)» 1) | 27 (`moi-cong-khong-qua-nut` 17, «(đầu)» 7, JI12 3) |
| C / K3 | 16 | 0 | 16 |
| C / K1 | 4 | 1 (một khoá RT13 đổi chữ đếm, vẫn đỏ) | 4 |
| D / K4 | 340 | 6 (`lo-trinh` 3, `ve-lo-trinh-doc-tin-hieu-cua-cay` 3) | 334 |
| K | 1 | 1 (P196) | 0 |

Ngoài túi cả hai cây: `LT-94`, `LT-94-do` (`tests/scripts/lo-trinh.test.mjs`) đỏ THEO LỊCH ngày 15/11 ở cả cây cũ lẫn cây
mới — dữ liệu thử mốc `2026-11-15`, ca cấm trang chứa ngày chạy; túi nền 14/11 có hai khoá này xanh. Không thuộc lớp nào.

87 khoá A còn đỏ (`cua-tin-hieu-goc-moi-worktree` 22, `kho-moi-cai-goi-road-map` 20, `kho-cam-ket-co-lo-trinh` 16,
`tin-hieu` 9, `cua-tin-hieu-giua-chien-dich` 8, `consumer-esm` 7, `ngay-ky` 2, khác 3) đang phân loại ở lượt 6 (cơ học
→ vòng B2 vá; mã sản phẩm → thêm vào bảng K2 dưới).

### 4.2 Lượt đo cuối — sửa xanh giả (chủ kho cho thêm một lượt, 15/11)

Cây kịch bản `ff5e5b5d` so cây cũ `644e9b49`: thiếu **415 / 5 556**. Từng khoá: `migration/kich-ban/ket-qua/phan-du-cuoi.tsv`.
Đổi so với §4.1: 22 mục vá cơ học gỡ 40 khoá A (căn cứ: `migration/kich-ban/ket-qua/va-luot-6/lop-a-con-lai.md`); thước giữ
khoá thôi đổi đường trong tên ca mang đường tính từ gốc gói (13 khoá vừa «thiếu» vừa «thừa» mà ca vẫn PASS — P08, P39 ×2 và
10 khoá D); mười mục vá gỡ xanh giả loại (i) làm **NT13** đỏ thật (ca giả định gốc kho = gốc gói — K4).

| Lớp | Khoá | Ai gỡ |
|---|---|---|
| A-kho-cu — mã sản phẩm #503 chưa phủ | 4 | kho cũ: `lib/chan-lo-trinh.cjs:50-54` `khoaBat()` tìm marketplace.json cạnh gốc plugin → null (CK-4-lib); `scripts/lo-trinh-khoi-tao.mjs:44-47` nhánh dự phòng của #503 viết cứng `roadmap@delivery-loop` (KM-1-do3); `_acceptance/cua-tin-hieu-gom-nhom/rang/cham-bo-vang.mjs:42` nối `scripts/tin-hieu.mjs` từ gốc kho (TH-10-ong, TH-10-do) |
| A-ngu-nghia — ca phải đổi nghĩa (K4) | 32 | kho cũ: mảng thư mục dùng chung cho archive lịch sử và bản sao bố cục mới (GW-4, CT-4, CT-8, CK-4, CK-5, KM-7, KM-8, NK-2 — 18); bản sao thiếu `plugins/acceptance-gate/.claude-plugin` (12 ca `kho-moi`); `tin-hieu.mjs` lịch sử import `../dieu-phoi/` (CN-2 ×2) |
| A-co-hoc-chua-gop | 2 | B2: KM-1, CT-10-do — vá có (`va-ngoai-thuoc`), cần luật đảo mới cho tên plugin trong câu và đường tương đối giữa hai plugin |
| A-cap-tep | 6 | đi theo ca bên trong tệp |
| B / K2 | 27 | kho cũ (K2b, K2c, K2d — bảng dưới) |
| C / K3 | 16 | chủ kho chọn lối K3 |
| C / K1 | 4 | RT13 — đọc khối khai đường cũ trong hợp đồng đã ký `ra-co-ten-lam-va-trao` (lớp K3) |
| D / K4 | 324 | kho cũ (gồm NT13) |

Ngoài túi cả hai cây: `LT-94`, `LT-94-do` đỏ theo lịch — và vì thế bước scripts của CÂY CŨ thoát 1 hôm nay (thước
`--giu-khoa` nêu). Vòng B2 đã hết lượt đo được cho; lượt đo dài kế tiếp phải hỏi chủ kho.

Lớp K (P196) — ĐÃ GỠ ở B2 (commit `3d011878`): bước 3 của kịch bản từng đổi tên chợ ngay trong
`diagram-design/skills/diagram-design/LOCAL-PATCHES.md`, làm tree-hash lệch NOTICE; khoá `khong_doi_chu` của bảng xếp nay
giữ nguyên chữ cả cây `diagram-design/skills/`, thước AC-4 so nó từng byte.

### 4.3 Đo lại sau #505 (chủ kho cho «Cho B2 đo lại», 16/11)

Nguồn `d8c42965` (kit-cu/main, có vòng sửa thứ hai `phan-du-bo-cuc-moi`). Kịch bản ở commit `86669ccd`: bước 6 bỏ qua 42
tệp tự đúng đường của khối GUI-B2-TU-DUNG (trừ `tests/scripts/tin-hieu.test.mjs` — vòng hai tự đo bỏ bước 6 làm cả tệp
sập), `.claude/settings.json` vào tập bước 6, bảng vá 348 → 267 (bỏ 74 mục trên tệp tự đúng đường + 7 mục không còn
khớp, ghim lại hai mục `run-tests.sh` 4 → 3 lần — khớp đủ 84 mục vòng hai báo thừa, trừ 1 mục của `tin-hieu`).

Cây kịch bản `9eed5714` (cây `52ab96ad`) so cây cũ `d8c42965`: thiếu **486 / 5 791** — số ĐO. Từng khoá, kèm cụm:
`migration/kich-ban/ket-qua/phan-du-luot-7.tsv`. Thước bộ kiểm trên nguồn thật: AC-2 304/304, AC-4 đạt, đổi sót 0 ngoài
5 chỗ đã khai. 415 khoá của lượt §4.2 (cụm theo `khoa-dich.tsv` của vòng hai): **160 về** (đo — mỗi khoá có mặt và đạt
trong túi cây mới), **255 còn thiếu**; thêm **231 khoá mới thiếu**, đều là ca vòng hai thêm.

| Cụm | Còn thiếu | Về | Đo / ước | Ai gỡ |
|---|---|---|---|---|
| K2 | 0 | 27/27 | đo | — |
| K3 | 0 | 20/20 | đo | — |
| SP | 0 | 4/4 | đo | — |
| K4-SC | 0 | 71/71 | đo | — |
| K4-PL | 1 | 12/13 | đo | B2 hoặc kho cũ: **P161** — chốt «assert chỉ được thêm» thấy hai assert của `tests/plugins/run-tests.sh` mà hai mục vá B2 đổi `root` → `root / "plugins/acceptance-gate"` (`check_claude`, con trỏ khuôn); bộ dịch ngược của vòng hai không đảo được biểu thức Python. Lối: khai hai dòng ở `tests/plugins/asserts-da-go.txt` bằng mục vá, hoặc vá dạng khác — chưa thử |
| K4-LT | 155 | 20/174 | đo | vòng ba kho cũ (chưa mở); gồm 1 khoá cấp tệp `lo-trinh.test.mjs` mới thiếu vì cây cũ nay xanh trọn tệp (LT-94 đã dời ngày) |
| K4-TB | 92 | 6/98 | đo | vòng ba kho cũ (chưa mở) |
| K4-DN | 6 | 0/6 | đo | chưa có chủ (đổi nghĩa) |
| B2 | 2 | 0/2 | đo | B2: KM-1, CT-10-do — luật đảo mới (§4.2) |
| **K4-MP** (mới) | 225 | — | đo | kho cũ: `tests/scripts/bo-cuc.test.mjs` (218 khoá) và `tests/scripts/bang-ten-lo-trinh.test.mjs` (7 khoá SP) dựng kho bố cục mới TỪ CÂY ĐANG CHẠY bằng `dungKhoMoi` của `_acceptance/goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs`; ở cây mới cây đang chạy đã là bố cục mới → «HẠ TẦNG: dựng fixture hỏng — mục chợ acceptance-gate có source lạ: ./plugins/acceptance-gate», mã 3, không ca nào in. Cả hai tệp tự đúng đường; bước 6 không chạm |
| **K4-RG** (mới) | 5 | — | đo | kho cũ: `tests/scripts/recheck-goc-goi-loi.test.mjs` khai tự đúng đường mà vẫn đường phẳng (`path.join(ROOT, 'scripts', …)`, `cpSync` `scripts`/`lib`). Thử trả nó về bước 6 (dựng riêng, chạy riêng tệp — không phải lượt đo): RG-1 xanh nhưng nhiều khả năng xanh giả (bước 6 đổi cả hằng `VERIFIER`, đường tính từ gốc gói), RG-2 so `git archive` merge-base lịch sử, RG-3 chép bản tiêm theo đường phẳng → giữ trong danh sách như vòng hai khai |
| **Cộng** | **486** | 160/415 | | |

Ước (chưa đo): gỡ K4-MP + K4-RG + P161 ở kho cũ thì phần dư về 255 − 1 = 254 (K4-LT 155 + K4-TB 92 + K4-DN 6 + B2 2 − cấp
tệp đi theo). Số này giả định các ca khác trong cùng tệp không đổi màu.

Ngoài túi cả hai cây — lỗi thật ở nhánh chính kho cũ: `tests/scripts/bang-ten-lo-trinh.test.mjs` đỏ 4 ca SP ở CHÍNH cây
cũ (`SP chan-lo-trinh · mới · có`, `SP lo-trinh-khoi-tao · cũ · thiếu`, `· mới · có`, `· mới · thiếu` — «bản gốc in null»):
tệp lấy bản gốc bằng `merge-base HEAD origin/main` mà cột kỳ vọng viết sẵn theo mốc `644e9b49`; sau gộp, merge-base trên
nhánh chính là chính đỉnh nhánh. Vì thế bước scripts của cây cũ thoát 1. LT-94 không còn đỏ (vòng hai dời ngày).

Bẫy chữ ký (BOI-CANH «Bẫy đã dẫm ở đoạn ký→gộp»): thước B2 không có phép so `git diff …HEAD` trên `tests/` với danh sách
viết tay — các phép `--name-only` của B2 so hai commit kịch bản dựng (dọn nhà 5 → 6), và bước 6 loại `/fixtures/`, nơi
`routing-baseline.txt` nằm. Lượt đo này là lượt chủ kho cho; lượt đo dài kế tiếp phải hỏi lại.

### 4.4 Nhận phần gửi B2 của vòng ba (#506, 17/11) — chưa đo

Nguồn `3341b8dc` (kit-cu/main). Theo `_acceptance/phan-du-bo-cuc-moi-vong-ba/gui-b2.md`:
- Mục 1: bỏ đúng 38 mục vá vòng ba báo thừa (đối chiếu từng mục `tep` + `cu`: 38/38, không dư, không thiếu).
- Mục 2: `tu-dung-duong.txt` = hợp khối vòng hai (42, đã trừ `tin-hieu`) và khối vòng ba (27) = 65 tệp; `tin-hieu.test.mjs` và
  `lo-trinh.test.mjs` nay vào danh sách (vòng ba sửa chúng tự đúng đường thật).
- Mục 3: giữ bốn mục vá P32 của `tests/plugins/run-tests.sh`; `tests/scripts/tat-rd1.mjs` vẫn đi bước 6 cùng mục vá của nó;
  cây mới là sáu commit CON của đỉnh nguồn (AC-1), không squash; `luatDuongDoiTen` không đổi từ `86669ccd`.
- P161 (Hỏi-1 của vòng ba, chủ kho duyệt): một mục vá thêm hai dòng khai vào `tests/plugins/asserts-da-go.txt`, mang trường
  `ngoai_dao` ghi căn cứ. Thước AC-2 gỡ đúng mục ấy (phải khớp đúng `so_lan`) rồi mới đảo; tệp ngoài tập bước 6 mà chỉ mục
  `ngoai_dao` chạm thì so từng byte sau khi gỡ. Hai ca mới đỏ ở thước cũ.
- `doi-sot.tsv`: gỡ ba chỗ khai K4 `git archive` (ba tệp nay tự đúng đường); còn hai chỗ.

Bảng vá 267 → 230 (−38 + 1). Kiểm nhanh, không phải lượt đo: thước bộ kiểm trên `3341b8dc` — AC-1, AC-4 đạt, AC-2 307/307,
đổi sót 0 ngoài 2 chỗ khai; bộ ca kịch bản 90/90. Số khoá còn thiếu CHƯA đo — lượt đo dài cần lời chủ kho.

### 4.5 Lượt đo trên nguồn `3341b8dc` (chủ kho cho «Cho B2 đo», 17/11) — một lượt

Cây kịch bản `32a5506f` (cây `7b66ff84`, sáu commit CON của nguồn) so cây cũ `3341b8dc`: **thiếu 57 / 5 802 khoá — số ĐO**
(`ket-qua/giu-khoa.md`); bảng theo cụm ở `ket-qua/phan-du-luot-8.tsv`. Lần khởi động đầu tiên dừng ở bước dựng (bản kéo Repo
Standards ở thư mục tạm hệ thống đã bị dọn) trước khi chạy ca nào — không tính là lượt; lượt này dùng bản kéo `4dc53e07` ở
`/private/tmp/claude-501/`. Năm bước khác xanh cả hai cây; bước `scripts` cây mới 968 qua · 6 đỏ, cây cũ xanh.

Đối chiếu 477 khoá của vòng ba (đếm theo lần xuất hiện, số ĐO trên hai túi khoá):

| Cụm | Vòng ba nhận | Đã về | Còn thiếu | Không còn ở cây cũ |
|---|---|---|---|---|
| K4-LT | 155 | 153 | 2 | 0 |
| K4-TB | 92 | 86 | 6 | 0 |
| K4-MP | 225 | 149 | 43 | 33 |
| K4-RG | 5 | 4 | 0 | 1 |
| **Cộng** | **477** | **392** | **51** | **34** |

«Không còn ở cây cũ» = ca vòng ba đổi tên hoặc gỡ ở chính kho cũ (BC/BC-LENH của `bo-cuc.test.mjs`, RG-1 của
`recheck-goc-goi-loi.test.mjs`) — không vào mẫu số nào. Ngoài 477: K4-PL (P161) 1/1 đã về; K4-DN 4 và B2 2 còn thiếu (ngoài
vòng ba). 0 khoá thiếu nằm ngoài bảng vòng ba.

Nguyên nhân từng nhóm còn thiếu (đọc từ nhật ký cây mới; nguyên nhân là ĐỌC, chưa thử sửa):
- **K4-MP 43 — chỉ là TÊN ca, không mất ca.** `bo-cuc.test.mjs`: 174 lần BC ở cả hai cây, 0 đỏ. Ở cây cũ 43 tên
  `BC plugins/<x> · <nhãn>` xuất hiện hai lần; ở cây mới một lần giữ `plugins/<x>`, lần kia in dạng phẳng `BC <x> · <nhãn>`
  — nhãn ca in đường đã qua bộ dịch theo bố cục của cây đang chạy. Sửa đúng tầng ở kho cũ: nhãn ca in đường đầu vào, không
  in đường đã dịch (hoặc khử trùng hai lần lặp). Không sửa ở bảng luật tên: đổi tên một nửa số lần là che, không phải dịch.
- **K4-TB 6 — đổi nghĩa.** KK-6/KK-6-do (`khoi-khuon-tren-the-cong`) và KL-8/KL-8-do (`khuon-loi`) so thẻ với «bản trước
  vòng» rút từ lịch sử git; trên cây mới thẻ khác vì bố cục khác.
- **K4-LT 2 + B2 2.** `cua-tin-hieu-giua-chien-dich.test.mjs` CT-10-do: bản sao cục bộ `plugins/dispatch/` nhập
  `plugins/scripts/tin-hieu-khoa.cjs` — bản sao chép thiếu tệp ở bố cục mới. `kho-moi-cai-goi-road-map.test.mjs` KM-1: thiếu
  dòng «kho chưa cài road-map ở phạm vi kho — không tạo lộ trình». Mỗi tệp một khoá cấp tệp (K4-LT) và một khoá ca (B2).
- **K4-DN 4 — đổi nghĩa, ngoài vòng.** DV5/`additive-only.test.mjs` so `pre-merge-check.sh` với base lịch sử (dòng chú thích
  nhắc `tests/scripts/hang-pr.test.mjs` đổi theo luật đường); KK-6 so-that/`can-cu-s1.ca.mjs` đọc sổ thật qua lịch sử.
