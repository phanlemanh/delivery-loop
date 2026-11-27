# Thiết kế — bằng chứng cũ: một vị từ JS khớp luật của lưới trước-gộp cho mọi bên đọc JS (vòng DL2, phạm vi thu hẹp)

Ngày 26/11/2026 · hồ sơ `_acceptance/bang-chung-cu-theo-dau-vao/` · hạng T2 (đề bài dự T3 — xem §6).

## 1. Đề bài và điều số đo nói

Đề bài (`origin/chuyen-nha:migration/de-bai-dl2.md`): vòng DL2 có hai nửa — (P) bằng chứng chỉ hoá cũ khi đầu vào
(`paths`) của chính eval đổi; (C) commit chữ ký không kéo thêm một vòng CI. Đích: rút đoạn ký → gộp ở kho tiêu thụ. Ngưỡng
mở (mục K3, máy đề xuất, chưa ai duyệt): sau năm vòng trên 3.1 ở Inventory còn ≥ 1/3 số vòng có commit ghim lại sau chữ ký.

**Số đo 26/11** (chỉ đọc, `side-session-notes/.../k3-do-26-11.md`; định nghĩa: chữ ký = commit cuối của PR đổi `status:`
sang `signed-off`/`machine-cleared`):

| cửa sổ | PR có chữ ký | có commit sau ký | có ghim lại sau ký | gộp nhánh chính vào nhánh (tổng / sau ký) | ký→gộp trung vị (ký là commit cuối / không) |
|---|---|---|---|---|---|
| Inventory 10–20/11 (kiểm phương pháp; gốc 60/160, 0,6 h / 1,5 h) | 65 | 49 (75 %) | 39 (60 %) | 168 / 58 | 0,67 h / 1,40 h |
| Inventory trên 3.1 (22/11 13:06Z → 26/11) | 9 (≈ 4 vòng sản phẩm) | 3 (33 %) | **1 (11 %)** | 8 / 2 | 0,43 h / 1,53 h |
| crm trên 3.1.1 | 3 | 0 | 0 | 1 / 0 | 0,76 h |

**Phép đo độc lập thứ hai** (phiên tra soát dãy DL, chuyển qua phiên giữ đợt 26/11; «ký» = commit ĐẦU đưa `status:` sang
trạng thái đã thông, như `do-gop.mjs`; cửa sổ từ PR #110): 7 vòng, 2 vòng có ghim lại hay gộp nhánh chính sau chữ ký
(#114, #117) = 29 % — 3/7 nếu tính commit thẻ ở #120; ký→gộp trung vị 103,5′ (nhóm có, n = 2) so với 56′ (n = 5). Sau
PR #118 (3.1.1): 0/3, trung vị 10′. Theo phiên ấy, CI xếp tầng của Inventory đã dùng lại lượt nặng khi đầu vào không đổi;
ô `gate` vẫn chạy lại.

Đọc: **ngưỡng K3 không đạt ở cả hai phép đo** (1/9 hay 2/7 — dưới 1/3; mẫu nhỏ). Ca ghim lại duy nhất (#114):
7 tệp đổi từ pin, Inventory đã khai `paths` cho mọi eval, 1 tệp chạm `paths` của E13 → bật `stale_scope: paths` vẫn phải
ghim. Phần còn lại sau chữ ký là 2 lần gộp nhánh chính, 3 commit thẻ/số đo, 1 sửa mã.

## 2. Thứ đã có — vì sao không dựng lại nửa (P)

Nửa (P) **đã có trong kit từ 2.21–2.24** dưới dạng bật theo lựa chọn: khoá `risk_tiers.stale_scope: paths` (hồ sơ
`lan-ghim-lai-theo-paths`, `loc-paths-dong-mac-dinh`, đều đã ký). Bộ lọc một nguồn `staleByPaths` (lib/evidence-core.cjs)
được hai bên gọi: lưới trước-gộp (`pre-merge-check.sh`, sau `stale_files`) và vị từ `--skip-unchanged` của `repin-lane.mjs`.
crm bật từ 06/10; Inventory chưa bật. Finding 02/10 (gốc mà hạt giống DL2 trích) có trước hai hồ sơ ấy. ADR 0028 (31/10,
hồ sơ `chi-tep-vat-keo-xet-lai`) thu hẹp thêm: hồ sơ vào diff chỉ vì tệp chữ thì lưới trước-gộp không xét bằng chứng cũ.

## 3. Lỗ còn lại — hai bên đọc trả lời CÙNG câu hỏi bằng luật khác

Câu hỏi: «từ `verified_commit` tới HEAD, có tệp vật nào đổi làm bằng chứng cũ không?»

| bên đọc | loại `_acceptance/` | loại `t1_skip_globs` | lọc theo `paths` khi kho bật |
|---|---|---|---|
| `pre-merge-check.sh` (lưới chặn gộp) | có | có | có |
| `repin-lane.mjs --skip-unchanged` | có | có | có |
| `pr-san-sang.mjs` (bước trước thẻ Cổng Bằng chứng) | có | **không** | **không** |
| SKILL feature-loop, «Staleness guard» khi resume vào `verified` (luật bằng CHỮ, phiên tự `git diff`) | có | có | **không** |

Hệ quả, đo bằng ca thật (vấn đề #10, onehub-invest, kit 2.36): chỉ `LO-TRINH.html` (đã khai T1) đổi sau lượt chấm →
`pr-san-sang` thoát 2 «bằng chứng cũ», không mở PR → CI không chạy trong lúc người đọc thẻ → CI chạy SAU chữ ký, đúng
khoảng chờ lệnh sinh ra để cắt. Ở kho bật `paths` (crm), gộp nhánh chính vào nhánh trước khi trình thẻ cũng làm `pr-san-sang`
từ chối dù lưới trước-gộp im; bước resume theo luật chữ thì hạ hồ sơ về `implemented` và tốn một lượt chấm.

## 4. Thiết kế

1. **Một vị từ JS** ở `plugins/feature-loop/scripts/lib/vat-doi-sau-pin.mjs`:
   `vatDoiSauPin({ doi, configText, evalsText, prefix, cay, core })` → `{ giu, boHoSo, boT1, loc }`.
   - loại vật hồ sơ theo PHÂN ĐOẠN đường dẫn (`_acceptance` là một đoạn — đúng luật `laVatHoSo` của làn hiện nay);
   - loại `risk_tiers.t1_skip_globs` (đọc bằng `core.resolveConfigList`) bằng **bản JS của luật `case` bash** mà lưới
     dùng (`match_globs` + `glob_variants` của `pre-merge-check.sh`): `*` qua được `/`, `?` một ký tự, `[..]` lớp ký tự,
     `**/` có thêm biến thể bỏ đoạn. Làn ghim lại hôm nay khớp T1 bằng `globToRe` (`*` không qua `/`) — lệch với lưới ở
     `dir/*`, `*.md` (giới hạn thứ hai của ADR 0019). Vòng này đóng lệch ấy: AC-8 so hai luật trên ma trận 7 × 6 viết
     trước, hàm bash rút NGUYÊN VĂN từ `pre-merge-check.sh` của cây đang đo;
   - khi `risk_tiers.stale_scope: paths`: gọi `core.staleByPaths(giu, evalsText, { prefix, cay })`; `apply:false` → giữ danh
     sách, `loc.reason` nói vì sao.
   Hàm KHÔNG đọc đĩa, không gọi git — bên gọi đưa `doi`, cây (`core.dungCayPaths`) và văn bản cấu hình.
2. **`repin-lane.mjs --skip-unchanged`** thay khối lọc tại chỗ bằng lời gọi hàm này; vế «tệp định nghĩa phép đo» (config.yaml,
   evals.yaml của slug) giữ NGUYÊN, đứng trước, vì làn hỏi câu khác («có cần chạy lại phép đo không»).
3. **`pr-san-sang.mjs`** gọi hàm này thay bộ lọc `!f.startsWith('_acceptance/')`. Nạp bộ máy acceptance-gate như làn:
   `--ag-root` (kit tự host) hoặc `resolve-plugin.mjs`. **Không nạp được → giữ luật cũ** (chỉ loại `_acceptance/`) và in
   một dòng nói vì sao — chặt hơn chứ không lỏng hơn.
4. **Cờ `--chi-xet` của `pr-san-sang.mjs`** (CỘNG, Hỏi-2): chỉ trả lời câu hỏi ở §3 — in «bằng chứng còn mới» (thoát 0)
   hoặc «bằng chứng cũ: <tệp>» (thoát 2), không đẩy, không gọi gh, không đòi `status: verified`. Đoạn «Staleness guard» của
   SKILL thay luật chữ bằng một khối marker chạy đúng lệnh ấy; danh sách tệp nó in là `deltaFiles` cho round delta.
5. **`pre-merge-check.sh` không đổi một byte.** Nó là bên đọc chặn gộp ở mọi kho (t3_paths); vị từ bash của nó đã đúng — lỗi
   nằm ở hai bên đọc kia. «Một vị từ» nghĩa là: ba bên đọc JS gọi CÙNG hàm, và hàm ấy khớp lưới bash ở từng vế — vế T1 giữ
   bằng phép vi phân AC-8, vế `paths` vốn là cùng `staleByPaths`, vế hồ sơ đo ở AC-3 (ca 2, 3). Lối khác — `pr-san-sang`
   gọi thẳng `pre-merge-check.sh --base` rồi lọc dòng của hồ sơ — còn sống nhưng chạy toàn bộ lưới cho mọi hồ sơ (chậm, lẫn
   vi phạm không liên quan vào câu «bằng chứng cũ»), nên không chọn.

## 5. Phép đo — hai chiều trên cùng bản sao

Kho git code-sinh trong lượt (origin trần + bản clone, gh giả ghi lời gọi — khuôn `tests/workflows/pr-san-sang.test.mjs`).
Mỗi ca: đối chứng dương (cây bằng pin → xanh) rồi phá (đổi đúng một tệp) → thông điệp ghim. Ma trận AC-3 viết trước, mười ca,
hai bên đọc mỗi ca so với cột mong đợi viết trước ở hợp đồng (20 phán quyết); một bản sao của `vat-doi-sau-pin.mjs` bỏ vế T1 phải lật CẢ HAI bên đọc ở ca T1 (chứng hai bên cùng
gọi một hàm), và bốn ca được so thêm với `pre-merge-check.sh` chạy thật trên cùng kho. Ca so với bản gốc vòng (AC-4, BC-5-ban-goc)
nằm ở `rang/ban-goc.test.mjs` của hồ sơ — chỉ chạy ở lượt chấm, không vào bộ kiểm của kit, nên không đóng băng thông điệp
của `pr-san-sang` trên `main` và không đỏ ở bản clone nông. Không ca nào dựng «bản trước vòng» từ
`git merge-base HEAD origin/main` (bài học PR #17, 22/11) — mọi kho đều sinh trong thư mục tạm, chạy được trên `main` sau gộp.

## 6. Hạng, phần CỘNG, cân trên mọi kho

- **Hạng T2:** vật chạm `plugins/feature-loop/scripts/**`, SKILL feature-loop, tests — không khớp `t3_paths` (lib, hooks,
  pre-merge-check.sh, recheck-evidence.cjs). Đề bài dự T3 vì «đổi đường phán quyết»; phạm vi thu hẹp không đổi đường phán
  quyết chặn gộp nào. Trần lượt gọi: 3.
- **TRỪ / sửa lỗi:** AC-1…AC-4, AC-6, AC-7 (bên đọc lệch được kéo về luật đã có). **CỘNG:** cờ `--chi-xet` + khối marker ở
  SKILL (AC-5) — chờ chủ kho phê.
- **Cân trên mọi kho (luật 26/09):** kho không khai T1 và không bật `paths` → `pr-san-sang` hành xử y như trước (AC-4). Kho
  khai T1 (cả ba kho tiêu thụ) → thôi bị từ chối oan khi chỉ tệp sinh đổi. Kho bật `paths` (crm) → `pr-san-sang` và bước
  resume đọc như lưới trước-gộp. Không mặc định nào đổi. Ai dựa vào hành vi cũ: không bên nào đọc mã thoát 2 của
  `pr-san-sang` như phán quyết — bước ấy «không phải cổng» (SKILL, khối PR-SAN-SANG).

## 7. Bỏ ra, có tên

- **Đổi mặc định `stale_scope` sang `paths`:** không — thứ tự chọn nghiệm 26/09, và K3 cho thấy không có lực kéo trên 3.1.
- **Dòng gợi ý «bật stale_scope: paths thì không cũ»:** không — ca thật duy nhất trên 3.1 bật vẫn không tránh được.
- **Nửa (C), commit chữ ký không kéo CI:** máy khuyên tách sang hạt giống — đây là đổi ý định nên là câu hỏi cho chủ kho
  (Hỏi «nửa C»). Hạt giống `docs/plans/2026-11-26-hat-giong-chu-ky-khong-keo-vong-ci.md`.
  Kit một mình không vượt được kiểm bắt buộc tính trên đầu nhánh (GitHub đòi check xanh trên chính commit chữ ký; Inventory
  bắt `check`, `e2e`, `gate`); lối duy nhất là job CI của kho tự nhận commit chỉ-chữ-ký — tệp của kho tiêu thụ, tầng CI mà
  Repo Standards đang dựng (RS3/DL3).
- **Bật `stale_scope: paths` ở Inventory:** việc của Inventory nếu muốn, không phải của kit.
