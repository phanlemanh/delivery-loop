# Kế hoạch — va-chu-ky-giu-cho-lenh-gop (T2)

Hợp đồng: `_acceptance/va-chu-ky-giu-cho-lenh-gop/contract.md` (duyệt 22/11). Gốc nhánh `a2198fcf`.

| Task | Files | Verify | Phục vụ | independent |
|---|---|---|---|---|
| T1 — test trước (đỏ trên vật cũ) | `tests/dieu-phoi/loi/gop-theo-loi.test.mjs` (GL-6b hàng giữ chỗ, GL-6k, GL-6i, GL-6j, GL-8a chuẩn hoá mọi chỗ trỏ bộ giải, GL-8b/8c/8d cài lõi vào bộ đệm giả; ca đi qua vế chữ ký → `caKit`), `_acceptance/va-chu-ky-giu-cho-lenh-gop/chu-ky-giu-cho.sh` | `node --test tests/dieu-phoi/loi/gop-theo-loi.test.mjs` → đúng 6 ca đỏ (6b, 6k, 6i, 6j, 8a, 8d) | E2, E3 | false |
| T2 — vật | `plugins/dispatch/scripts/gop.mjs` (nạp `chuKyThat` từ `--loi`/bố cục nguồn, chặn sớm khi không có bộ đọc; vế chữ ký hỏi lõi), `plugins/dispatch/scripts/dieu-phoi.mjs` (cờ `--loi`), khối `GOP-THEO-LOI-KY` ở `plugins/feature-loop/skills/feature-loop/SKILL.md` và `plugins/acceptance-gate/commands/signoff.md` | ca trên xanh; `bash …/chu-ky-giu-cho.sh --chan giu-cho` và `--chan duong-loi` in XANH; `node --test tests/dieu-phoi/**/*.test.mjs` | E2, E3, E4 | false |
| T3 — hồ sơ | hạt giống `docs/plans/2026-11-21-hat-giong-chu-ky-giu-cho-o-lenh-gop.md` thêm dòng «đã làm»; bản đồ | `product-map.mjs --check` | E1k | false |

Thứ tự: T1 commit trước T2 (TDD trong lịch sử). Rà riêng trước khi mở PR: chạy bộ kiểm trên cây tách rời đặt HEAD = gộp
`--no-ff` nhánh vòng vào `origin/main`.
