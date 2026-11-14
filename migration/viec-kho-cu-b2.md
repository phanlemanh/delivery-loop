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
  báo phiên giữ đợt ngay khi thấy, không đợi tới lượt chấm.
