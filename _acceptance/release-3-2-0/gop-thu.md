# Gộp thử — 2026-11-28 (không chạy lượt rà; đo vì sao)

Chủ kho duyệt ở Cổng Phạm vi (Hỏi-3): bỏ lượt rà bộ kiểm trên commit gộp thử khi cây gộp thử trùng byte cây đã chấm.

Đo 28/11 sau lượt chấm 1, trên đầu nhánh `e6d41f67`:

- nhánh chính `origin/main` = `0e514457` và là TỔ TIÊN của đầu nhánh vòng (nhánh chính đã được gộp vào nhánh ở `626a0d65`,
  sau PR #41) — gộp `--no-ff` nhánh vòng vào nhánh chính cho một cây trùng byte cây đầu nhánh vòng, không thêm tệp nào.
- cây đã chấm là `e9043268`. Từ đó tới đầu nhánh chỉ đổi chín tệp, đều do bước ghi bằng chứng sau lượt chấm:
  `CHANGELOG.md` (một con số, theo phiếu chưa chắc của hội đồng E8), `docs/research/known-limits-ledger.tsv` (ba hàng sổ
  giới hạn), và bảy tệp của `_acceptance/release-3-2-0/` (hợp đồng sang `verified`, sổ quyết định, báo cáo bằng chứng, tệp
  phát hiện, sổ chạy, tệp args, báo cáo token). Không tệp nào dưới `plugins/`, `tests/` hay `tools/`.
- chạy lại trên đầu nhánh ba phép đo đọc đúng các tệp vừa đổi: vùng 3 của suite plugins (có ca P179 đọc sổ giới hạn) thoát
  0; `product-map.mjs --check` thoát 0; `pre-merge-check.sh . --base origin/main` còn đúng một dòng — «verdict PASS but
  human_signoff is empty (Gate 2 pending)».

Phần chưa đo ở máy này: trọn mười một lệnh suite trên cây đầu nhánh (cây đã chấm thì có — lượt chấm 1, cả mười một thoát
0). CI của PR mốc chạy trọn bộ kiểm trên chính bản gộp của PR, và job `tests` trên commit gộp chạy lại lần nữa trước khi
gắn thẻ. Nếu nhánh chính tiến thêm trước khi gộp thì mục này phải đo lại.
