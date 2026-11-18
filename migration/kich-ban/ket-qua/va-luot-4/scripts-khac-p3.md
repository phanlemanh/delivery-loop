# scripts-khac — phần 3 (14 tệp)

Vá: `va.json` (16 mục, so_lan kiểm bằng `ap.mjs` trên bản sao MỚI của B5 — lệch 0; phép đảo mỗi `moi` khớp nguyên văn cây A).
Môi trường chạy: bản sao cần nhánh `main` (additive-only resolve nhánh chính) — `git fetch <B5> refs/remotes/origin/main:refs/heads/main`.

| tệp | đỏ trước | đỏ sau | ca còn đỏ · lớp · lý do |
|---|---|---|---|
| msbv-cau-noi | 1 | 0 | — (đường bên trong bản sao tạm giữ bố cục cũ `d/scripts`) |
| gate-card-goal | 1 | 0 | — (như trên, `md/scripts/gate-card.js`) |
| gate-card-expected-exit | 1 | 0 | — (`t/lib`, `t/scripts`) |
| design-gate-che-do-chat | 1 | 0 | — (`goc/scripts/design-gate.mjs`) |
| w6-w8-pham-vi | 1 (PV6 sập) | 0 | — (`m/lib/context-glossary.js`) |
| phan-loai | 1 | 0 | — (`m/feature-loop/...` bản sao) |
| finding-line-bo-doc | 1 | 0 | — (grep `${d}/scripts lib hooks` luật bỏ sót → đường mới) |
| lan-status-not-run | 1 | 1 | L05 · **kho-cu** · bản base giờ đọc được (đã đưa lại đường cũ cho cây `git archive`), nhưng recheck trên corpus `_acceptance/` đỏ 11 hồ sơ đã ký vì evals/báo cáo của chúng trỏ verifier đường cũ (vd `release-2-3-0`: `scripts/product-map.mjs` «verifier script not found») — dữ liệu ngoài `tests/` |
| core-untouched | 1 | 1 | JR11b · **kho-cu** · cùng nguyên nhân: recheck strict trên corpus thật đỏ 9 hồ sơ (lenh-tran-tai-lieu-dau-tay, release-2-3-0…2-8-0, trang-ho-so-mot-viec, vao-co-o-ra-co-ten) vì verifier `scripts/product-map.mjs` trong `_acceptance/<slug>/` không còn ở gốc kho; sửa ở hồ sơ/`plugins/acceptance-gate/scripts/recheck-evidence.cjs` (bộ giải verifier) |
| additive-only | 3 | 2 | DV5 ×2 · **ngu-nghia** · `FILES` dùng chung cho `git show <base 909dffd>:<f>` (lịch sử, bố cục cũ) và `cat ROOT/<f>` (bố cục mới); đề xuất: cặp `[cũ, mới]` mỗi tệp. DV5u đã gỡ (base-only → đường cũ) |
| ntr-trang-thai | 1 | 1 | NS-AC9-cu · **ngu-nghia** · `quet(r, kit = KIT)` ghép `plugins/acceptance-gate/scripts/start-scan.mjs` cho cả KIT lẫn hai cây `git archive` lịch sử; đề xuất tách đường start-scan theo bố cục cây. Đã đưa lại đường cũ cho `git log -- lib/workspace-record.cjs` và product-map của hai cây lịch sử |
| chi-tep-vat-keo-xet-lai | 1 | 1 | TV1-do ban-goc · **ngu-nghia** · `THU_MUC_MAY` dùng cho cả `git archive GOC_SHA` và `banSaoMay` (KIT), `luoi(k, may)` ghép một đường pre-merge-check.sh cho cả KIT và bản gốc; đề xuất hằng bố cục cũ cho bản gốc |
| luot-sua-giu-du | 8 | 8 | AC-1/2/4/11/6/7/8/9 · **ngu-nghia** · `'--ag-root', may` phải là `<may>/plugins/acceptance-gate` cho KIT và bản sao nhưng là `may` cho bản base `MOC_TRUOC` (bố cục cũ, `DIRS` cũng dùng chung cho archive và banSao); tên biến `may` không thuộc `bien_goc` nên dạng `${may}/plugins/acceptance-gate` cũng không qua thước đảo. Đề xuất: truyền ag-root riêng theo cây, DIRS cũ cho archive |
| luot-kiem-nhe | 1 | 1 | LKN-AC7-hooks · **chua-ro** (dây chuyền) · ca chạy bộ thật `tests/hooks/run-tests.sh`, bộ hooks ở B5 đang đỏ (nhóm hooks); tự hết khi bộ hooks xanh |

Tổng: 23 ca đỏ trước → 15 sau; **gỡ 8 ca**. Còn đỏ: kho-cu 2 · ngu-nghia 12 · chua-ro 1.
