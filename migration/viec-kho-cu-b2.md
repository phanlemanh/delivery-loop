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

Lớp K (P196, vòng B2 tự gỡ): bước 3 của kịch bản đổi tên chợ ngay trong
`diagram-design/skills/diagram-design/LOCAL-PATCHES.md`, làm tree-hash lệch NOTICE. Gỡ bằng luật bước 3 bỏ qua cây skill có
NOTICE ghim băm, hoặc đổi chữ kèm cập nhật NOTICE.
