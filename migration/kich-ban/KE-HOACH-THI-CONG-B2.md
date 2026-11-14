# Kế hoạch thi công B2 `bo-kiem-xanh-o-kho-moi`

Hợp đồng: `_acceptance/bo-kiem-xanh-o-kho-moi/contract.md` (Cổng Phạm vi duyệt 14/11, `13c9e337`). Thiết kế: `THIET-KE-B2.md`.
Mọi việc làm tuần tự trong luồng chính — cùng chạm `migration/kich-ban/`, không việc nào `independent`. Mỗi phép đo mới đi kèm
cặp hai chiều trên cùng fixture (vật lành → xanh, bản sao phá → đỏ với thông điệp ghim). Verify mỗi việc chạy dưới Node 24.

| # | Việc | Tệp | Verify | Phục vụ |
|---|---|---|---|---|
| 1 | `--nhanh` chỉ nhận `don-nha/<tên>` | `don-nha.mjs`, `bo-kiem.test.mjs` | `node --test migration/kich-ban/bo-kiem.test.mjs` (BK-AC6*) | E6 |
| 2 | Tệp sống vào `t1_skip_globs` + ca lưới thật | `_acceptance/config.yaml`, `tep-song.test.mjs` | `node --test migration/kich-ban/tep-song.test.mjs` | E7 |
| 3 | Lớp hàng sổ P177 + bộ chạy riêng các ca đỏ sẵn | `docs/research/known-limits-ledger.tsv`, `do-san.mjs` | `node migration/kich-ban/do-san.mjs` | E8s |
| 4 | Thước giữ đủ khoá ca + đọc việc `tests` từ `gate.yml` + `TMPDIR` ngắn cho lượt đo | `giu-khoa.mjs`, `bo-khoa.tsv`, `doc-gate.mjs`, `b0/chay.sh`, `giu-khoa.test.mjs` | `node --test migration/kich-ban/giu-khoa.test.mjs` | E3, E4 |
| 5 | Báo cáo lớp đỏ theo túi khoá, bộ chết có tên, ghi nguyên tử | `phan-lop.py`, `do-lop-do.sh`, `lop-do.mjs`, `lop-do.test.mjs` | `node --test migration/kich-ban/lop-do.test.mjs` | E5 |
| 6 | Bước 6 của kịch bản: luật chung + luật đổi tên + bảng vá; tiêu đề `<k>/6`; sửa ca B1 theo sáu commit | `don-nha.mjs`, `bang-xep.json`, `va-bo-kiem.json`, `fixture.mjs`, `don-nha.test.mjs`, `bo-kiem.test.mjs` | `node --test migration/kich-ban/don-nha.test.mjs migration/kich-ban/bo-kiem.test.mjs` | E1, E8 |
| 7 | Thước đảo phép đổi + `dao-mo-ho.tsv`; thước nguồn thật `--bo-kiem`, `--giu-khoa` | `kiem-cho.mjs`, `dao-mo-ho.tsv`, `thuoc-that.mjs`, `bo-kiem.test.mjs` | `node --test …bo-kiem.test.mjs` + `node migration/kich-ban/thuoc-that.mjs --bo-kiem` | E2, E2t, E1t, E8t |
| 8 | Đo thật lặp: dựng cây, chạy sáu bước hai cây, so túi khoá, thêm luật/vá; timebox năm lượt (Hỏi-2) | `bang-xep.json`, `va-bo-kiem.json`, `ket-qua/giu-khoa*` | `node migration/kich-ban/thuoc-that.mjs --giu-khoa` | E4t |

Lượt chấm (S4) chỉ chạy khi `kit-cu/main` có bản sửa của vòng gọi chéo và K1 (Hỏi-3); phiên giữ đợt báo khi `main` +
`chuyen-nha` đã cập nhật, nhánh này gộp `chuyen-nha` rồi đo lại việc 8 trên nguồn mới.
