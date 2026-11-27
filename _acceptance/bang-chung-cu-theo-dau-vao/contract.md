---
schema_version: 1
feature: Bằng chứng cũ — pr-san-sang và làn ghim lại đọc bằng MỘT vị từ JS khớp luật của lưới trước-gộp (loại tệp hồ sơ, tệp T1 theo đúng luật glob của lưới, và — khi kho bật — tệp ngoài paths của eval); lưới bash giữ nguyên, phép vi phân bash↔JS giữ hai bên khớp; bước resume của feature-loop chạy cùng vị từ thay luật bằng chữ
slug: bang-chung-cu-theo-dau-vao
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: plugins/feature-loop/scripts/** · SKILL feature-loop · tests — KHÔNG khớp t3_paths
surfaces: [cli]
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-11-26
design_doc: docs/superpowers/specs/2026-11-26-bang-chung-cu-theo-dau-vao-design.md
---

# Acceptance Contract: bang-chung-cu-theo-dau-vao

## Context

Gốc: `origin/chuyen-nha:migration/de-bai-dl2.md` — chủ kho mở vòng DL2 ngày 26/11/2026 («Mở DL2, ngoại lệ (b)») · vấn đề
#10 của kho kit (onehub-invest, kit 2.36) · số đo K3 26/11 ở design doc §1.

**Cơn đau:** bốn bên đọc trả lời cùng câu «tệp vật nào đổi sau `verified_commit`?». Lưới trước-gộp và làn ghim lại loại
tệp hồ sơ, tệp `t1_skip_globs`, và — khi kho khai `risk_tiers.stale_scope: paths` — tệp ngoài `paths` của mọi eval.
`pr-san-sang.mjs` chỉ loại `_acceptance/`; bước resume của SKILL feature-loop là luật bằng chữ không có vế `paths`. Nên chỉ
một tệp sinh T1 đổi (`LO-TRINH.html`) là `pr-san-sang` từ chối mở PR → CI chạy SAU chữ ký thay vì trong lúc người đọc thẻ.

**Vật** (thiết kế ở `design_doc`): một hàm `vatDoiSauPin` ở `plugins/feature-loop/scripts/lib/vat-doi-sau-pin.mjs`; làn
ghim lại và `pr-san-sang` gọi nó; `pr-san-sang --chi-xet` + khối marker ở SKILL cho bước resume. `pre-merge-check.sh`
không đổi.

Thuật ngữ:
- **kho đo** = kho git do mã sinh trong lượt (origin trần + bản clone), hồ sơ `s` ở `verified`, verdict PASS, pin
  `verified_commit` = commit vật; gh giả ghi lại mọi lời gọi. Khuôn của `tests/workflows/pr-san-sang.test.mjs`.
- **bản gốc vòng** = cây `8817a5bf` (đỉnh `origin/main` lúc mở vòng), rút bằng `git archive` vào thư mục tạm.

## Criteria

- AC-1: Given kho đo khai `risk_tiers.t1_skip_globs: ["docs/**", "LO-TRINH.html"]` và sau pin chỉ đổi `LO-TRINH.html` cùng `docs/x.md`, When chạy `pr-san-sang`, Then không thoát 2, nhánh lên origin đúng HEAD và gh nhận `pr view` → `pr create` → `pr view` → `pr ready`. Chiều đỏ: cùng kho đổi thêm `src/a.ts` → thoát 2 với thông điệp «vật đổi sau lượt chấm (src/a.ts)» không nhắc tệp T1 nào, origin không có nhánh, gh không nhận lời gọi nào. Đối chứng: kho KHÔNG khai T1 mà chỉ đổi `LO-TRINH.html` → vẫn thoát 2 nêu `LO-TRINH.html`.
- AC-2: Given kho đo khai `risk_tiers.stale_scope: paths` và mọi eval máy khai `paths: [src/a.ts]`, When sau pin chỉ đổi `src/b.ts`, Then `pr-san-sang` không thoát 2 và in một dòng «bỏ qua theo paths: 1 tệp — src/b.ts». Chiều đỏ trên cùng kho: đổi `src/a.ts` → thoát 2 nêu `src/a.ts`; một eval máy bỏ `paths` → bộ lọc không áp, đổi `src/b.ts` → thoát 2 nêu `src/b.ts` và in lý do chứa `eval-may-thieu-paths:`. Đối chứng dương: cây bằng pin → không thoát 2.
- AC-3: Given ma trận mười ca viết trước dưới đây, mỗi ca một kho đo, When chạy `pr-san-sang --chi-xet` và `repin-lane --skip-unchanged` trên cùng kho, Then cả hai mươi phán quyết bằng cột mong đợi (số phán quyết so được = 20), và ở bốn ca 1, 4, 5, 10 `pre-merge-check.sh --base` chạy thật trên cùng kho in `VIOLATION [s]: evidence is stale` khi và chỉ khi cột `pr-san-sang` là CŨ. Một bản sao của `vat-doi-sau-pin.mjs` bỏ vế T1 → ca 1 lật ở CẢ HAI bên đọc (chứng hai bên cùng gọi một hàm).

  | # | đổi sau pin | khoá kho | pr-san-sang | làn --skip-unchanged |
  |---|---|---|---|---|
  | 1 | `LO-TRINH.html`, `docs/x.md` (khai T1) | — | MỚI | BỎ QUA |
  | 2 | `_acceptance/s/ghi-chu.md` | — | MỚI | BỎ QUA |
  | 3 | `pkg/a/_acceptance/s/x.md` | — | MỚI | BỎ QUA |
  | 4 | `src/b.ts` (ngoài `paths: [src/a.ts]`) | `stale_scope: paths` | MỚI | BỎ QUA |
  | 5 | `src/a.ts` | `stale_scope: paths` | CŨ | CHẠY |
  | 6 | `src/b.ts` | không khai | CŨ | CHẠY |
  | 7 | `src/b.ts`, một eval máy thiếu `paths` | `stale_scope: paths` | CŨ | CHẠY |
  | 8 | `src/bảng.ts` (tên có dấu, ngoài `paths`) | `stale_scope: paths` | MỚI | BỎ QUA |
  | 9 | `_acceptance/config.yaml` | — | MỚI | CHẠY (tệp định nghĩa phép đo — khác đã khai) |
  | 10 | `gen/a/b.txt` (T1 khai `gen/*`) | — | MỚI | BỎ QUA |
- AC-4: Given kho đo không khai T1 và không khai `stale_scope`, When sau pin đổi `src/b.ts`, Then `pr-san-sang` thoát 2 với thông điệp bằng từng byte thông điệp của `pr-san-sang` ở bản gốc vòng trên cùng kho, và không in dòng nào nhắc `paths`. Đối chứng dương: cây bằng pin → cả hai bản không thoát 2.
- AC-5: Given SKILL feature-loop ở HEAD, When rút lệnh trong khối marker của đoạn «Staleness guard» rồi chạy nó trên kho đo, Then (1) cây bằng pin → thoát 0 và in «bằng chứng còn mới»; (2) đổi `src/a.ts` → thoát 2 và in «bằng chứng cũ:» kèm `src/a.ts`; (3) chỉ đổi tệp T1 → thoát 0; (4) ở cả ba ca origin không có nhánh `vong/s` và gh không nhận lời gọi nào; (5) lệnh chạy được khi hợp đồng ở `verified` lẫn `signed-off`. Chiều đỏ: SKILL bỏ khối marker → phép đo nêu «không thấy khối STALE-GUARD»; lệnh rút ra chạy trên bản `pr-san-sang` của bản gốc vòng → không thoát 0 ở ca (1).
- AC-6: Given `pr-san-sang` chạy ở kho đo mà không nạp được bộ máy acceptance-gate (`--ag-root` trỏ thư mục không có `lib/evidence-core.cjs`), When sau pin chỉ đổi `LO-TRINH.html` đã khai T1, Then thoát 2 nêu `LO-TRINH.html` (luật cũ, chặt hơn) và in một dòng «không nạp được bộ máy acceptance-gate — giữ luật cũ». Đối chứng dương: cùng kho, `--ag-root` đúng → không thoát 2.
- AC-7: Given cây vòng, When liệt kê tệp mà các commit riêng của nhánh vòng đổi (commit không gộp, không có trên `origin/main`; vắng `origin/main` thì so với bản gốc vòng), Then mọi tệp nằm trong danh sách cho phép — `plugins/feature-loop/scripts/pr-san-sang.mjs`, `plugins/feature-loop/scripts/repin-lane.mjs`, `plugins/feature-loop/scripts/lib/vat-doi-sau-pin.mjs`, `plugins/feature-loop/skills/feature-loop/SKILL.md`, `tests/workflows/**`, `tests/scripts/**`, `docs/**`, `CHANGELOG.md`, `_acceptance/bang-chung-cu-theo-dau-vao/**`, và các view máy sinh `PRODUCT-MAP.md`, `LO-TRINH.html`, `tests/scripts/fixtures/routing-baseline.txt`, `docs/research/known-limits-ledger.tsv` — và không tệp nào khớp `risk_tiers.t3_paths`. Chiều đỏ: phép đo nhận thêm một đường thử `plugins/acceptance-gate/scripts/pre-merge-check.sh` → thoát 1 nêu đường ấy.

- AC-8: Given hàm `glob_variants` + `match_globs` rút nguyên văn từ `pre-merge-check.sh` của cây đang đo và hàm khớp T1 của `vat-doi-sau-pin.mjs`, When chạy cả hai trên ma trận glob × đường viết trước (bảy glob: `docs/**`, `gen/*`, `LO-TRINH.html`, `*.md`, `a/**/b.txt`, `x?.js`, `src/[ab].ts` × sáu đường: `docs/x.md`, `gen/a/b.txt`, `LO-TRINH.html`, `src/a.ts`, `a/b.txt`, `a/c/d/b.txt` — 42 phần tử), Then 42/42 phần tử hai bên cùng kết luận khớp/không khớp. Chiều đỏ: bản sao hàm JS dịch `*` thành «không qua `/`» (luật `globToRe` cũ) → phép đo nêu đúng các phần tử lệch, trong đó có `gen/*` × `gen/a/b.txt`. Đối chứng: rút hàm bash không được (đổi tên hàm trong bản sao) → phép đo nêu «không rút được match_globs», không xanh.

## Coverage

- Quét theo khuôn trục (bước CT-S, làm tay trên bảng ở design doc §3 — bài toán là ma trận bên-đọc × lớp-tệp, không mở rộng).
- Trục A · bên đọc (lưới trước-gộp · làn ghim lại · `pr-san-sang` · bước resume) `[thước CE: bốn nơi đọc `verified_commit`
  rồi `git diff` — dò bằng grep `verified_commit` ∩ `diff` trong plugins/*/scripts, lib, hooks]` → AC-3 (ba bên chạy thật),
  AC-5 (bước resume), AC-7 (lưới trước-gộp không đổi).
- Trục B · lớp tệp đổi sau pin (hồ sơ · hồ sơ lồng · T1 · T1 dạng `dir/*` · trong paths · ngoài paths · tệp định nghĩa phép đo · tên có dấu)
  `[thước CE: các nhánh của `laVatHoSo`, `t1Res`, `staleByPaths`, `tepDinhNghia` trong repin-lane]` → AC-1, AC-2, AC-3.
- Trục F · luật glob T1 (bash `case` của lưới · JS của vị từ) × dạng glob (`**`, `dir/*`, tên trần, `*.ext`, `a/**/b`, `?`, `[..]`)
  `[thước CE: nhánh của `match_globs`/`glob_variants` trong pre-merge-check.sh]` → AC-8.
- Trục C · khoá kho (`stale_scope` vắng | all | paths) × bộ lọc (áp | không áp + lý do) → AC-2, AC-3, AC-4.
- Trục D · bộ máy acceptance-gate (nạp được | không) → AC-6.
- Trục E · trạng thái hợp đồng khi hỏi (`verified` | `signed-off`) → AC-5.

## Out of scope

- Đổi mặc định `risk_tiers.stale_scope` sang `paths` (thứ tự chọn nghiệm 26/09; K3 trên 3.1 không cho thấy lực kéo).
- Sửa `pre-merge-check.sh`, `lib/**`, `hooks/**` — lưới chặn gộp đã đúng.
- Nửa «commit chữ ký không kéo thêm một vòng CI» — hạt giống `docs/plans/2026-11-26-hat-giong-chu-ky-khong-keo-vong-ci.md`.
- Dòng gợi ý «bật stale_scope: paths thì không cũ» ở kho chưa bật.
- Bật `stale_scope: paths` hay khoá gộp ở Inventory — việc của kho ấy.

## Notes

- Số đo K3 (26/11, chỉ đọc): Inventory trên 3.1 — 1/9 PR có ghim lại sau chữ ký (trước 3.1: 39/65); ngưỡng máy đề xuất
  ≥ 1/3 không đạt; mẫu ≈ 4 vòng sản phẩm. Bảng đủ ở design doc §1.
- Phụ thuộc Hỏi «phạm vi»: chủ kho chọn lối «chỉ #10» (không cờ `--chi-xet`) → AC-5 rời hợp đồng, AC-3 chạy `pr-san-sang`
  thường với gh giả (cột MỚI = không thoát 2), trường `feature` bỏ vế bước resume — sửa và duyệt lại trong cùng lượt.
- Đóng giới hạn thứ hai của ADR 0019 («lệch glob bash/JS ở dạng `dir/*`») cho cả làn ghim lại: vị từ JS khớp luật bash của
  lưới, AC-8 giữ hai bên khớp.
- Hạt giống tách ra ở vòng này (nếu chủ kho chọn tách nửa C): `docs/plans/2026-11-26-hat-giong-chu-ky-khong-keo-vong-ci.md`.
- Known limits của vòng (vấp ở bước chuẩn bị lượt chấm 1, không thuộc vật): `s4-args` lấy nhánh chính CỤC BỘ đã cũ làm gốc
  so, vùng vật phình 23 → 217 tệp; vòng lách bằng `--diff-base` bản gốc vòng. Hạt giống:
  `docs/plans/2026-11-27-hat-giong-s4-args-goc-so-nhanh-cuc-bo.md`.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-27:
  - Ngoài-1: một dòng sổ quyết định (d-22) mang giờ ghi tay muộn hơn commit chứa nó vài chục giây; phán quyết không đổi.
  - Ngoài-2: lưới AC-11 xếp `pr-san-sang.mjs` là «không đọc» danh sách tệp của bài kiểm, nên tệp này thoát lớp kiểm LB1.
  - Ngoài-3: kho dùng bộ máy acceptance-gate cũ thì lệnh mở PR dừng bằng lỗi khó hiểu thay vì lùi về luật cũ.
  - Ngoài-4: commit đã ghim không còn trong kho (gộp squash, clone nông) thì `--chi-xet` thoát 2 như bằng chứng cũ.
  - Ngoài-5: danh sách T1 viết một dòng thì vị từ và lưới trước-gộp kết luận ngược nhau; lưới vẫn chặn lúc gộp.
  - Ngoài-6: đối chứng dương BC-6/BC-4 chỉ khẳng định «mã thoát khác 2», nên lệnh sập vì lý do khác cũng xanh.
  - Ngoài-7: AC-7 đo theo `origin/main..HEAD`; máy đo chưa cập nhật nhánh chính từ xa có thể báo đỏ nhầm.
  - Ngoài-8: khối PR-SAN-SANG của SKILL chưa có `--ag-root` cho kit tự host, khác khối STALE-GUARD.
  - Ngoài-10: đối chứng dương BC-6/BC-4 chỉ loại trừ thoát 2, không chứng minh lệnh chạy tới cuối.
  - Ngoài-11: cùng lớp Ngoài-6 — đối chứng không phân biệt được lệnh chạy hết với lệnh sập sớm (mã 3).
  - Ngoài-12: bộ ghi gh giả trên PATH chưa có đối chứng dương, nên các assert «gh 0 lời gọi» qua dòng lệnh là âm-tính-một-mình.
  - Ngoài-13: BC-3-luoi không ghim rằng lưới đã chạy tới bước xét bằng chứng cũ trước khi coi thiếu VIOLATION là «mới».
  - Ngoài-14: các dạng glob `{a,b}`, `[!..]`, `[^..]`, `\x` chỉ có điểm-case viết tay, chưa so trực tiếp bash↔JS.
  - Ngoài-15: chiều đỏ của AC-7 chưa tách vế `t3_paths` khỏi vế danh sách cho phép.
- Mục tách thành việc riêng ở Cổng Bằng chứng 2026-11-27 (Ngoài-9 — `--chi-xet` không thấy tệp vật sửa mà chưa commit):
  hạt giống `docs/plans/2026-11-27-hat-giong-chi-xet-thay-sua-chua-commit.md`.
