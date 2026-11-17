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

### 4.6 CT-10-do và KM-1 — chỉ sửa đúng tầng được ở kho cũ (17/11, không phải lượt đo)

Phiên giữ đợt giao (sau lời chủ kho «Mở vòng bốn»): sửa hai ca trong kịch bản B2 nếu làm được, nếu không thì báo kèm căn cứ.
Kết luận: **không sửa ở kịch bản**. Lý do: cả hai tệp nằm trong `tu-dung-duong.txt` (vòng ba khai tự đúng đường, mục 2 của
`gui-b2.md`). Với tệp loại này, bước 6 chỉ áp luật tên, và từ chối mọi mục vá (`vá trên tệp tự đúng đường`, ca
BK-AC1-tu-dung-va). Lỗi nằm ở một chữ viết cứng trong chính tệp kiểm. Vá chữ đó ở kho mới sẽ làm xanh kho mới, trong khi tệp ở
kho cũ vẫn buộc vào bố cục cũ — tức đúng loại xanh mà cổng ấy được dựng để chặn.

| Ca | Tệp kiểm | Nguyên nhân (đọc + chạy riêng trên cây dựng sẵn) | Sửa ở kho cũ (một dòng) |
|---|---|---|---|
| KM-1 | `tests/scripts/kho-moi-cai-goi-road-map.test.mjs:24` | Sản phẩm in `DONG_CHUA_CAI` với tên gói theo vai (`HG.tenTheoVai('lo-trinh')` → `roadmap` ở kho mới); tệp kiểm viết cứng `'kho chưa cài road-map ở …'`. Luật tên của kịch bản chỉ đổi dạng có cấu trúc (`road-map:`, `road-map@`, `--plugin road-map`, …), cố ý không đổi chữ trần trong câu. | `` const CHUA_CAI = `kho chưa cài ${createRequire(import.meta.url)(tep('lib/ho-goi.cjs', { thuMuc: KIT })).tenTheoVai('lo-trinh')} ở phạm vi kho — không tạo lộ trình`; `` |
| CT-10-do | `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs:567` | Chiều đỏ tiêm `'../../scripts/tin-hieu-khoa.cjs'`, đường tương đối theo bố cục cũ. Ở kho mới, `plugins/dispatch/scripts/../../scripts/` không có tệp, nên bản sao hỏng ngay khi `nap(...)` — ngoài khối `try` của `ca10` — và lỗi không mang thông điệp đã ghim. | Chuỗi tiêm: `` `import _khoaKit from '${path.relative(path.dirname(raTep(KIT, CUA)), raTep(KIT, 'scripts/tin-hieu-khoa.cjs'))}';\nexport const CAU_DA_GHI` `` |

Đã thử (bản chép `_thu-*.test.mjs` cạnh tệp gốc trong cây đo `ld3b-0618`, đã xoá sau khi chạy; node 24):
- cây mới `32a5506f`: KM 38/38 (KM-1, KM-1-do, -do2, -do3 xanh), CT 43/43 (CT-10, CT-10-do xanh);
- cây cũ `3341b8dc`: KM 38/38, CT 43/43.

Bản gốc trên cây mới: KM 37/38 (KM-1 đỏ), CT 42/43 (CT-10-do đỏ). Không có lối nào ở kho mới mà không đi ngược lời khai của vòng
ba: gỡ hai tệp khỏi danh sách tự đúng đường để vá thì phải áp lại luật đường lên cả tệp, mà hai tệp đã tự dịch qua `tests/bo-cuc.mjs`.

### 4.7 43 khoá K4-MP là lỗi của thước, không phải ca thiếu (17/11, đọc trên túi lượt 4.5, không đo lại)

Vòng bốn báo (phiên «Vòng bốn kho cũ», sau khi nhận hai dòng sửa ở §4.6). Tôi đã kiểm lại trên chính túi đã commit ở `0ab6f720`,
và lời báo đúng:
- Cả 43 khoá đều có dạng **túi cũ 2 · túi mới 1**. Ví dụ `scripts: BC plugins/acceptance-gate/skills/acceptance/SKILL.md · cây phẳng`.
- Ở nhật ký thô, cả hai cây in **cùng hai tên**: `BC skills/acceptance/SKILL.md · cây phẳng` và
  `BC plugins/acceptance-gate/skills/acceptance/SKILL.md · cây phẳng` (`out/A/scripts.log`, `out/B/scripts.log`).
- Bên cũ, luật `tuiCu` dịch cả hai tên sang cùng một khoá, nên khoá ấy được đếm 2 lần. Bên mới, hai tên giữ nguyên là hai khoá,
  mỗi khoá 1 lần. Kết quả: thước đòi khoá đã dịch phải có hai lần ở túi mới (thiếu 43), còn tên thô thì thành khoá thừa.

Vòng bốn đo cả túi bằng một luật đổi đi, xét xem chỗ thiếu nằm ở đâu: luật hiện tại thiếu 57 / thừa 43, luật đổi thiếu 14 / thừa 0.
Luật đổi nằm ở `rang/tui-cu-suc-chua.mjs` trong hồ sơ vòng bốn; lời hỏi chủ kho là Hỏi-1 ở Cổng Phạm vi của vòng ấy. **B2 không sửa
thước ở đây**: đổi luật đếm của phép giữ khoá là đổi thước của chính vòng này, nên phải chờ chủ kho quyết. Nếu chủ kho duyệt Hỏi-1,
phần dư của B2 còn 14 khoá: K4-TB 6, K4-DN 4 và bốn khoá CT-10-do/KM-1 đã có chủ ở `gui-b2.md` §3.4 của vòng bốn.

### 4.8 Nhận luật so khoá của vòng bốn (#507, 17/11) — đã áp, chưa đo

Vòng bốn đã gộp: PR #507, commit gộp `0fe48c14` trên nhánh chính kho cũ. Thư của vòng gửi B2 là
`_acceptance/phan-du-bo-cuc-moi-vong-bon/gui-b2.md`.

Ở Cổng Phạm vi vòng bốn, chủ kho chọn lối A của Hỏi-1: dòng sổ `d-20261117T031721Z-11` ghi «duyệt» trần, nhận khuyến nghị của
cả năm câu. Ở Cổng Bằng chứng, chủ kho phê Treo-1 (dòng `d-20261117T055055Z-21`), tức là luật hành xử khác bản thiết kế khi cây
mới hết chỗ. Vì vậy B2 đổi thước ở đây theo lời chủ kho, không tự quyết:

- `migration/kich-ban/giu-khoa.mjs`: `tuiCu` giờ xét chỗ còn lại ở cây mới, chép đúng `rang/tui-cu-suc-chua.mjs` của vòng bốn.
  Chữ ký hàm giữ nguyên, nên `bao-cao-giu-khoa.mjs` dùng luật mới mà không phải sửa.
- `giu-khoa.test.mjs` thêm hai ca:
  - `BK-AC3-hai-ten` chạy đầu cuối bằng bộ chạy thật. Hai cây cùng in tên phẳng và tên gói của một ca thì thước báo «giữ đủ».
    Chiều đỏ: bỏ từng tên ở cây mới thì thước báo thiếu đúng tên ấy, ghim nguyên văn.
  - `BK-AC3-hinh` có bảy hình: bốn hình `TK-MP-hinh` của vòng bốn, ca «hai tên», và hai ca hết chỗ theo Treo-1.
  - Viết ca trước: luật cũ cho `BK-AC3-hai-ten` đỏ với `thiếu: ka: A02 in plugins/acceptance-gate/commands/x`.
- Hai túi đã commit ở `ket-qua/giu-khoa/` không đổi. Chế độ `--tui` so túi đã dịch, nên phán quyết của báo cáo 4.5 vẫn khớp khi
  so lại. Lượt đo kế sẽ ghi túi mới bằng luật mới.

Tính lại bằng luật mới trên chính hai thư mục kết quả thô của lượt 4.5 (`/private/tmp/claude-501/ld3b-0618/out/{A,B}`). Bước này
chỉ đọc lại, không chạy bộ kiểm nào: **thiếu 14 / 5 802, thừa 0**. Theo cụm:

| Cụm | Khoá |
|---|---|
| K4-TB | 6 |
| K4-DN | 4 |
| K4-LT | 2 |
| B2 (CT-10-do, KM-1) | 2 |

Cả 14 khoá đúng là 14 khoá vòng bốn đã sửa ở kho cũ; con số khớp vòng bốn tự đo. Muốn biết chúng đã về hay chưa phải có một lượt
đo trên nguồn chứa `0fe48c14`, và lượt ấy cần lời mới của chủ kho. Ngưỡng mở lại vòng bốn đặt: lượt đo kế còn thiếu ≥ 1 trong 14
khoá.

Ba mục khác của thư:
- **§3.2:** `origin/main` của hai bản sao đo trỏ `909dffd8`. Không bắt buộc đổi; B2 giữ nguyên `do-lop-do.sh`.
- **§3.3:** 45 dòng sổ ở 32 hồ sơ đã khép trỏ đường phẳng. Việc này chờ chủ kho chọn lối, ngoài phần của B2.
- **§1, §2:** không thêm mục vá vào `va-bo-kiem.json` và không thêm tệp tự đúng đường.

### 4.9 Lượt đo trên nguồn `0fe48c14` (chủ kho cho «Cho B2 đo», 17/11) — một lượt, luật so mới

Lượt chạy `do-lop-do.sh` trên nguồn `0fe48c14`, tức nhánh chính kho cũ sau khi gộp #507. Cây mới dựng lại là `e3a7c105` (cây
`53031519`). Thước giữ khoá đã mang luật so xét chỗ của §4.8. Lượt thoát 0.

**Giữ khoá: thiếu 0 / 5 806, thừa 0, bỏ 0.** Cả 14 khoá §4.8 đã về: K4-TB 6, K4-DN 4, K4-LT 2, CT-10-do và KM-1. Vì thế ngưỡng
mở lại vòng bốn không chạm.

Tổng khoá lên từ 5 802 lên 5 806. Phần chênh là ca mới của #507, chủ yếu họ `BC …`. Ngoài ra hai ca có số đếm hồ sơ ngay trong tên
(`P66`, `RT13`) đổi số.

`ket-qua/lop-do.md` ghi tổng đỏ thêm 0. Năm trong sáu bước có số ca đạt bằng nhau ở hai cây:

| Bước | Số ca đạt |
|---|---|
| scripts | 3 664 |
| hooks | 80 |
| plugins | 363 |
| workflows | 1 036 |
| ban-do | 1 |

Bước còn lại là `dieu-phoi`: đạt 662 ở cả hai cây, đỏ đúng một ca ở cả hai cây.

**Chỗ đỏ còn lại — không do dời bố cục:** `dieu-phoi: GT-07 tin-tu-den`. Đây là ca đo thời gian ở
`tests/dieu-phoi/tin.test.mjs:932`: chênh trung vị giữa bản mới và bản cũ phải ≤ 20 ms.

- Trong lượt đo, hai cây chạy bộ kiểm song song. Mỗi lần gọi mất khoảng 430–680 ms, chênh lên 58–87 ms, nên ca đỏ ở cả hai cây và
  `dieu-phoi` thoát 1 ở cả hai cây.
- Chạy riêng ca ấy, lần lượt từng cây, trên chính hai bản kéo của lượt, nó xanh ở cả hai: mỗi lần gọi khoảng 80–93 ms, chênh
  8–11 ms.
- Lượt §4.5 trên `3341b8dc` cũng chạy song song, nhưng ca này xanh và `dieu-phoi` thoát 0: đạt 663 ở cả hai cây. Ca này nhạy tải.
  Nó không theo cây.

Hệ quả cho thước: `thuoc-that.mjs --giu-khoa` vẫn thoát 1, vì vế «mọi bước thoát 0 ở cả hai cây» không đạt. Hai dòng nó báo là
`bước dieu-phoi thoát 1 ở cây cũ` và `bước dieu-phoi thoát 1 ở cây mới`. Mọi vế khác của AC-4 đạt.

B2 không sửa thước, và không sửa ca, vì ca là sản phẩm và chỉ sửa ở kho cũ. Hai lối còn mở:

- **Lối (a):** một lượt đo dài nữa. Đây là lượt thứ hai, cần lời mới của chủ kho. Nó chỉ thông khi ca không gặp tải.
- **Lối (b):** sửa ở tầng đúng, kho cũ. Hoặc nới ca GT-07 cho chịu được tải, hoặc để `chay-bo-kiem.sh` chạy hai cây lần lượt. Lối
  thứ hai là sửa kịch bản `migration/`, nằm trong phần B2 được chạm, nhưng nó đổi thước nên phải có lời chủ kho.

Khuyến nghị lối (b), sửa ca ở kho cũ. Lý do: ca đo thời gian sẽ đỏ trên mọi máy CI bận, không riêng đợt chuyển nhà.

### 4.10 Chạy lại bước đỏ ở cả hai cây (chủ kho «Chạy lại bước đỏ», 17/11) — không phải lượt đo dài

Ở phiên giữ đợt, chủ kho chọn «Chạy lại bước đỏ» cho câu «Chọn lối nào để thông AC-4 của B2?». Hai lối kia không được chọn: đo dài
lại cả lượt, và sửa GT-07 ở kho cũ. Thước đổi sau khi đã thấy số, nên việc đổi có dòng sổ riêng dẫn lời chủ kho.

Luật đặt ở một chỗ, `migration/kich-ban/chay-lai-do.sh`, và `do-lop-do.sh` gọi nó sau lượt song song:
- Bước có mã khác 0 ở **cả hai** cây được chạy lại **một** lần, **lần lượt** từng cây. `chay-bo-kiem.sh` nhận biến mới
  `CHI_BUOC` để chạy riêng các bước ấy.
- Kết quả chạy lại nằm ở `out/<cây>-lai/`. Thư mục ấy đã có thì kịch bản thoát 2 và không chạy lần hai.
- Bước đỏ ở một cây không bao giờ được chạy lại, vì đó là tín hiệu «dọn nhà làm hỏng».

Bên đọc:
- `docKetQua` lấy mã và túi khoá của bước được chạy lại từ lần chạy lại, và giữ mã lần đầu.
- `buoc.tsv` thêm hai cột chạy lại; «-» là không chạy lại. Tệp bốn cột của lượt cũ đọc như không chạy lại.
- `kiemGiuKhoa` đòi hai điều. Thứ nhất, lần đầu phải đỏ ở cả hai cây, nếu không thì báo `bước … được chạy lại mà không đỏ ở cả hai
  cây`; khi đó báo cáo ra `khong-do`. Thứ hai, lần chạy lại phải thoát 0 ở cả hai cây, nếu không thì báo `bước … chạy lại vẫn
  thoát … ở cây …`.
- `lop-do.md` in thêm một dòng «Chạy lại» với mã lần đầu và mã chạy lại.

Bốn ca mới ở `giu-khoa.test.mjs`, viết trước và đỏ cả bốn trước khi có mã:
- `BK-AC4-chay-lai`: đỏ ở hai cây → xanh, kèm đối chứng đỏ lúc trước khi chạy lại; lần chạy lại thứ hai bị từ chối.
- `BK-AC4-chay-lai-mot-cay`: đỏ ở một cây → không chạy lại, thước đỏ.
- `BK-AC4-chay-lai-van-do`: chạy lại vẫn đỏ → thước đỏ.
- `BK-AC4-chay-lai-gia`: chạy lại một bước không đỏ → `khong-do`.

Hai mutant trên bản chép, mỗi mutant làm đúng một ca đỏ:
- Chạy lại bước đỏ ở một cây bất kỳ → `chay-lai-mot-cay` đỏ.
- Bỏ kiểm mã chạy lại → `chay-lai-van-do` đỏ.

Bộ kiểm nhanh của kịch bản: 96/96.

Chạy trên chính hai bản kéo của lượt §4.9 (`/private/tmp/claude-501/ld4-1347`), không dựng lại và không lượt đo dài: chỉ
`dieu-phoi`, cây cũ rồi cây mới, khoảng 9 phút. Mã thoát chạy lại là 0 · 0, đạt 663 · 663, và GT-07 xanh ở cả hai. Hai báo cáo
dựng lại từ cùng thư mục đo.

| Bước | Lần đầu (song song) cũ · mới | Chạy lại (lần lượt) cũ · mới |
|---|---|---|
| scripts | 0 · 0 | — |
| hooks | 0 · 0 | — |
| plugins | 0 · 0 | — |
| workflows | 0 · 0 | — |
| dieu-phoi | 1 · 1 | 0 · 0 |
| ban-do | 0 · 0 | — |

Kết quả:
- **Giữ khoá: thiếu 0 / 5 807, thừa 0, bỏ 0.** GT-07 vào túi hai cây.
- `thuoc-that.mjs --giu-khoa` **thoát 0**: «AC-4 đạt … 6 bước thoát 0 ở cả hai cây, trong đó 1 bước đỏ ở cả hai cây đã chạy lại
  một lần, lần lượt từng cây (dieu-phoi); giữ đủ 5807/5807 khoá, bỏ 0».
- `thuoc-that.mjs --lop-do` thoát 0, tổng đỏ thêm 0.

Dữ kiện cho hạt giống `docs/plans/2026-10-20-hat-giong-gt07-chap-chon.md`, ở đó nguyên nhân còn ghi «chưa đo»: chạy song song thì
chênh 58–87 ms, chạy riêng thì chênh 8–11 ms. Theo đề nghị của phiên giữ đợt, B2 không ghi vào hạt giống bây giờ; việc ấy để sau
ngày cắt sang.

### 4.11 RT13 đỏ trên nhánh vì `migration/` — chặn S4 ở AC-8 (E8s), chỉ sửa đúng tầng ở kho cũ (17/11)

Nhánh đã gộp `chuyen-nha` ở `aac562da`, gồm cả `0fe48c14`. Commit gộp là `16dafd99`; xung đột duy nhất là `LO-TRINH.html`, máy
sinh, đã dựng lại và `--check` sạch. Trước khi khép S3, B2 chạy trọn `feature_loop.suite_keys` trên nhánh, lần lượt từng khoá:

- Mười khoá thoát 0: `scripts_bash`, `scripts_mjs_1`, `scripts_mjs_2`, `scripts_mjs_3`, `hooks`, `plugins_vung_1`,
  `plugins_vung_2`, `workflows`, `product_map`, `kiem_ban_cai_moc`.
- `plugins_vung_3` thoát 1 vì đúng một ca, **RT13**. `do-san.mjs` (E8s) cũng đỏ RT13.

Thước nguồn thật `--bo-kiem` đạt.

Nguyên nhân: phần (iv) của RT13 quét mọi tệp chứa chuỗi `signed-off`. Danh sách bỏ qua `NGOAI` ở
`tests/plugins/ra-co-ten.test.mjs:1063` chỉ có `_acceptance/`, `docs/` và năm tệp văn ở gốc, không có `migration/`. Chỗ khai gạch
(`BO-DOC-KHAI-GACH`) nằm trong hồ sơ đã ký `ra-co-ten-lam-va-trao`. Có ba tệp bị bắt:

| Tệp | Của ai | Vì sao chứa `signed-off` |
|---|---|---|
| `migration/TRANG-THAI.md` | phiên giữ đợt | văn trạng thái; ở `chuyen-nha` từ 11/11 |
| `migration/kich-ban/ket-qua/va-luot-4/plugins.md` | B2 | nhật ký lượt 4 trích nguyên văn |
| `migration/kich-ban/tep-song.test.mjs` | B2 | fixture «hồ sơ đã ký» của AC-7 |

Không tệp nào là bộ đọc rẽ nhánh trên trạng thái, nên RT13 đỏ ở **chính `chuyen-nha`**, không riêng B2. Cây kho cũ và cây kịch
bản dựng không có `migration/`, nên RT13 xanh ở cả hai cây đo (§4.10).

Nghiệm đúng tầng là một dòng ở kho cũ: thêm `/^migration\//` vào `NGOAI`. Thử trên bản kéo riêng của HEAD nhánh này, không chạm
cây làm việc:
- trước khi sửa: `FAIL: [RT13] file lạ chứa "signed-off": migration/TRANG-THAI.md …`;
- sau khi sửa: `PASS: [RT13] đọc-cũ: broken rỗng, khác biệt đúng khối; …`.

Cân trên mọi kho: kho cũ không có `migration/`, nên dòng này không đổi hành vi ở đó. RT13 chỉ quét cây của chính kit, không quét
kho tiêu thụ. Mất duy nhất: một bộ đọc trạng thái thật đặt dưới `migration/` sẽ không bị quét. Thư mục ấy là sổ của đợt chuyển
nhà, không phải sản phẩm.

Hai lối không khuyến nghị:
- Đổi chữ ba tệp cho khỏi chứa chuỗi. Đó là né răng: fixture và nhật ký cần đúng chữ ấy, và `TRANG-THAI.md` không phải của B2.
- Thu AC-8 thành giới hạn có tên. Lối này phải duyệt lại Cổng Phạm vi, và RT13 vẫn đỏ cho mọi vòng sau trên kho này tới ngày cắt
  sang.

B2 giữ hợp đồng ở `approved`, không chấm S4 cho tới khi có lời: lượt chấm bây giờ chắc chắn REJECT ở E8s.
