# Nhóm repin — mục vá tệp kiểm sau phép chuyển nhà (B2, lượt 4)

Vá: `va.json` (63 mục, 15 tệp). Nguồn soạn: `va-src.mjs` (in `va.json`; `so_lan` đếm tuần tự trên B5).
Kiểm cuối: áp `va.json` lên bản clone MỚI của B5 (`kiem/`, `ap.mjs` báo «lech 0»), chạy lại 17 tệp — log ở `runs/kiem/`.

## Bảng

| tệp | đỏ trước | đỏ sau | ca còn đỏ · lớp · một câu |
|---|---|---|---|
| duong-nen | 56 (11 FAIL rồi sập ở NEN5, 45 ca không chạy) | 0 | — |
| gate-card-duong-nen | 6 | 0 | — |
| repin-lane-dung-lai-model | 38 | 0 | — |
| repin-lane-tran | 17 | 0 | — |
| repin-lane-chay-lai | 12 | 0 | — |
| repin-lane-lop-cu | 8 | 0 | — |
| repin-lane-env-ci | 7 | 0 | — |
| repin-lane-noi-ra | 7 | 0 | — |
| repin-lane-khuon-gia | 1 | 0 | — |
| repin-evals | 3 | 0 | — |
| eval-thay-boi | 24 | 0 | (T08 chỉ chạy khi gọi tên `ETB_CASES=T08` — xem ghi chú) |
| glob-thoat-ngoac | 11 (2 FAIL rồi sập, 9 ca không chạy) | 0 | — |
| bo-giai-nhay | 2 (BG10e, BG5) | 1 | BG5 · chua-ro (môi trường) · BG5 dựng bản sao bằng `git archive HEAD`; HEAD của bản clone chưa mang vá (vá không được commit) nên bản sao còn `gia-lan-fixture.mjs` cũ. Mô phỏng: bung `HEAD` + áp `va.json` + `BG_NO_RED=1 BG_ONLY=` → exit 0, tức xanh khi vá nằm trong commit bước 6. |
| ten-ca-qua-tien-to | 1 | 0 | — |
| premerge-repin | 1 | 1 | DV4a · kho-cu · chín hồ sơ thật của kit (`_acceptance/{lenh-tran-tai-lieu-dau-tay, release-2-3-0…2-8-0, trang-ho-so-mot-viec, vao-co-o-ra-co-ten}/evidence-report.md`) khai verifier `scripts/product-map.mjs` / `scripts/evidence-page.js`, recheck tra từ gốc kho → «verifier script not found». Dữ liệu ngoài `tests/`; sửa đúng tầng là dời đường verifier trong các hồ sơ ấy (hoặc owner thêm chúng vào danh sách grandfather `tests/scripts/mirror-sync-grandfather.mjs` — đổi danh sách đóng, ngu-nghia). |
| cham-lai-khong-tu-doi | 8 | 8 | CL1–CL8 · ngu-nghia · hai hàm `s4(ban,…)`/`tv(ban,…)` dùng CHUNG cho bản MỚI (cây này, bố cục `plugins/…`) và bản TRƯỚC VÒNG (`git archive` commit lịch sử → bố cục cũ); một biểu thức đường không thể đúng cho cả hai. Vá đã làm bản MỚI chạy (s4-args mới thoát 0 — CL7 giờ in «thoat moi 0 != cu 1»), còn bản TRƯỚC đỏ. Đề xuất: cho đối tượng bản mang bố cục của nó, ví dụ `MOI = { ten:'moi', goc:KIT, fl: path.join(KIT,'plugins/feature-loop'), ag: path.join(KIT,'plugins/acceptance-gate') }`, `TRUOC = { …, fl: path.join(d,'feature-loop'), ag: d }`, và `s4`/`tv` dùng `ban.fl`/`ban.ag`. |

Tổng: **220 ca đỏ trước → 10 ca đỏ sau; gỡ 210 ca.** Ca còn đỏ: 1 kho-cu (DV4a), 8 ngu-nghia (CL1–CL8), 1 chua-ro/môi trường (BG5).

## Các lối vá đã dùng (đều là đường dẫn, không đổi logic/kỳ vọng)

1. **Đưa lại đường cũ ở bản sao bố cục GỐC PLUGIN.** Nhiều ca dựng một thư mục đóng vai `--ag-root`
   (`ag`, `layer`, `d` của `mutantTree`/`dungBanSaoLib`, cache `<mkt>/acceptance-gate/9.9.9/`) hoặc kho tiêu thụ
   (`k.dir`, `dir` có bản vendored `scripts/`, `lib/`). Luật cơ học đã đổi cả phía ĐÍCH sang `plugins/acceptance-gate/…`;
   vá trả phía đích về `lib/`, `scripts/`, `commands/`, `skills/` (gốc plugin), giữ phía NGUỒN `KIT/plugins/acceptance-gate/…`.
   Cùng lớp: chuỗi đường gốc-plugin trong nội dung đọc từ khuôn/thông điệp (`lib/md-section.cjs`, `nen engine: LECH lib/…`,
   `--require scripts/…`, `${CLAUDE_PLUGIN_ROOT}/scripts/design-scan.js`, bảng `AG-ENGINE-TABLE` `file: 'lib/…'`).
2. **Đưa lại đường cũ trong `git archive` của commit LỊCH SỬ** (v2.30.0, `MOC_CU`, `cayMoc(sha)`, `MOC_TRUOC`, `BASE=3200ba3a`,
   `git log -S … -- feature-loop/scripts/carry-plan.mjs`): cây bung ra là bố cục cũ.
3. **Gốc acceptance-gate = `plugins/acceptance-gate`** ở chỗ luật bỏ sót: `--ag-root` mặc định của `chayNen`
   (`duong-nen-fixture`), `mkKho` (`gia-lan-fixture`), `chayS4` (`evals-sat-le-lib`), `chayCarry`, `--ag-root kit/root/ban.goc`,
   `kiemGN2(KIT)`, `quetNapTinh(KIT, …)`, `exportsOf(ROOT, …)`, `L.docLib(L.KIT)`. Viết `path.join(X, 'plugins/acceptance-gate')`
   — cùng dạng bước 6 đã tự dùng (`--ag-root ${ROOT}/plugins/acceptance-gate`). Phép thử ngược cho mục này cho
   `path.join(X, '')` ≡ `X` (bằng nghĩa, không bằng chữ); bốn mục `cpSync(path.join(KIT, 'plugins/acceptance-gate', d), …)`
   cũng vậy (`path.join(KIT, '', d)` ≡ `path.join(KIT, d)`).
4. **Đổi nốt đường cũ luật bỏ sót** khi gốc là CÂY HIỆN TẠI: `VUNG_NGUON` của GN13 (repin-lane-noi-ra), `git archive HEAD lib scripts
   feature-loop hooks` + `scripts/doc-rieng.mjs` của LB2 (evals-sat-le), danh sách chép `banSaoBoMay` (eval-thay-boi).

## Ghi chú

- **Tệp ngoài danh sách được giao có vá** (chúng là bộ trợ giúp của các tệp được giao): `duong-nen-fixture.mjs`,
  `gia-lan-fixture.mjs` (dùng chung với repin-lane.test, repin-roundtrip, recheck-repin, chup-ho-so-da-thong, giu-tuoi-fixture…),
  `evals-sat-le-lib.mjs`, `evals-sat-le-vi-phan.mjs`. Đã soát `va.json` của các nhóm plugins / dieu-phoi / lo-trinh: không nhóm
  nào vá bốn tệp này. Nhóm khác mà vá `gia-lan-fixture.mjs` cùng dòng `const agRoot = opts.agRoot || ROOT;` thì lệch `so_lan`.
- **eval-thay-boi T08** (không chạy trong lượt trọn): `dauRa(root, …)` dùng chung `premerge(root)`/`recheck(root)` cho bản base
  lịch sử (bố cục cũ) và cây này — cùng hình dạng ngu-nghia như cham-lai; vá chỉ trả đường `git archive` và danh sách kiểm của
  `dungBase()` về bố cục cũ.
- **kho-cu nhỏ, không làm đỏ ca nào ở đây:** `plugins/feature-loop/scripts/carry-plan.mjs` dòng 38 suy gốc acceptance-gate dự phòng
  bằng `path.resolve(HERE, '..', '..')` (= `plugins/`, không còn là gốc acceptance-gate) — chỉ dùng khi vắng `--ag-root`.
  `plugins/acceptance-gate/commands/acceptance-init.md` khối INIT-CI-COPY-LIST còn ba dòng `${CLAUDE_PLUGIN_ROOT}/dieu-phoi/scripts/…`.
