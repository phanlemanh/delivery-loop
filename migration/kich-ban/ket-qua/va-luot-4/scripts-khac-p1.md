# scripts-khac · phần 1 — báo cáo vá

va.json: 28 mục, 12 tệp. Đã kiểm `so_lan` bằng cách áp lên bản sao MỚI của B5 (`p1/ap.mjs`, sai 0) rồi chạy lại 15 tệp (log ở `p1/outK/`).
Môi trường: khuon-loi KL-8 cần ref `main`/`origin/main` (B5 có `origin/main`; bản sao clone thì không — lúc kiểm đã thêm `git branch main 593e6837`).

**Cần chú ý — 4 mục «gốc plugin lõi» trên biến không có trong `bien_goc`** (về nghĩa là phép đổi đường «gốc kit → plugins/acceptance-gate»,
giống luật `--ag-root ${ROOT}` → `` `${ROOT}/plugins/acceptance-gate` `` của bước 6, nhưng thước đảo `kiem-cho.mjs` chỉ đảo khi biến nằm trong
`bien_goc` và cả chuỗi là `` `${X}/plugins/acceptance-gate` ``; bốn mục này sẽ lộ «tệp kiểm lệch luật» nếu không thêm `goc`/`may`/`kit` vào bien_goc
hoặc khai ở dao-mo-ho.tsv):
- run-id-danh-sach-cho-phep: `'--ag-root', goc,` → `` `${goc}/plugins/acceptance-gate` `` (gỡ RH3, RH6)
- vong-don-le-tra-tri-thuc: `` `AG='${may}' && ` `` → `` `AG='${may}/plugins/acceptance-gate' && ` `` (gỡ TD-4, TD-6, TD-6-mutant, TD-6-mutant-nguon)
- khuon-loi: `'--ag-root', kit]` → `` `${kit}/plugins/acceptance-gate` `` (gỡ KL-11, KL-11-do); `"$AG/` → `` `"${KIT}/plugins/acceptance-gate/` `` (gỡ KL-10)
Nếu chủ đợt không nhận lớp này: bỏ 4 mục, 9 ca đó chuyển sang `ngu-nghia`.

| tệp | đỏ trước (FAIL/crash) | đỏ sau | ca còn đỏ · lớp · lý do |
|---|---|---|---|
| dinh-tuyen-theo-ma-muc | 7 | 0 | — (bản sao lib đọc đường cũ; `git log -S` + `cayMoc` lịch sử đưa lại `lib/…`; mũi `scripts/${f}` đổi nốt) |
| tep-sinh-khong-chan-gop | 5 | 3 | TS-6 thu-muc-rong, TS-7 duong-doc-cu, TS-7-do lech · ngu-nghia · `ve(may,…)` dùng CHUNG đường mới cho KIT và bản ghim `git archive c0cf637f` (bố cục cũ); đề xuất: hằng đường riêng cho bản ghim (`scripts/product-map.mjs`) |
| bang-ngoai-n | 6 | 0 | — (ba đường đọc trong BASE_DIR lịch sử đưa lại cũ) |
| run-id-danh-sach-cho-phep | 6 | 1 | RH5 · ngu-nghia · `s4(ban,…)` dùng cùng `path.join(ban.goc,'plugins/feature-loop',…)` + `--ag-root ban.goc` cho cả GOC (archive 115100b6, bố cục cũ) và MOI; đề xuất: ban mang sẵn đường s4 + ag-root theo bố cục của nó |
| vong-don-le-tra-tri-thuc | 6 | 2 | TD-9, TD-9-mutant · ngu-nghia · THU_MUC (đường mới) dùng chung cho `git archive GOC_VONG` (lịch sử) và `banCay`; `the(mayCu())` đọc đường mới trong cây cũ; đề xuất: THU_MUC_GOC bố cục cũ + bin riêng cho mayCu |
| chep-tri-thuc-du | 5 | 5 | CT0–CT4 · ngu-nghia · `rel` (từ `${CLAUDE_PLUGIN_ROOT}/…` của acceptance-init.md, tương đối GỐC PLUGIN) dùng cho cả nguồn `path.join(ROOT, rel)` lẫn đích ở kho tiêu thụ; ở bố cục mới gốc plugin ≠ gốc kho; đề xuất: nguồn `path.join(ROOT,'plugins/acceptance-gate',rel)`, đích giữ `rel`, đưa lại đường kho tiêu thụ cũ (`scripts/cat-luot.mjs`, SKILL_CL) |
| cong-nguoi-doc-du-nguon | crash (5) | 0 | — (đích cpSync bản tiêm đổi sang bố cục mới) |
| hskt | 5 | 3 | HK-AC5-im, HK-AC5-note · ngu-nghia · `quet/dongVeto(r, banBase())` dùng đường mới trong `git archive BASE_SHA scripts lib skills`; HK-AC7-dot-bien · chua-ro (phụ thuộc ntr-trang-thai NS-AC9-cu và lan-status-not-run L05 — tệp ngoài phần 1) |
| khuon-loi | 5 | 2 | KL-8, KL-8-do · ngu-nghia · bản trước vòng (archive merge-base, bố cục cũ) chép `skills/` từ cây mới, mà gate-card cũ đọc `skills/cat-luot/SKILL.md` — skill đã đổi tên `scope-slice`; đề xuất: lấy skills từ cùng mốc hoặc chép đổi tên |
| md-section | crash (5) | 0 | — (bản sao tree/lib+scripts: đường đọc đưa lại cũ) |
| msbv-the | 5 | 0 | — |
| bo-qua-dinh-nghia-phep-do | 4 | 0 | — |
| cua-veto-sau-chu-ky | 1 + crash (5) | 1 + crash | CVS1…(5 ca) · kho-cu · `_acceptance/cua-veto-sau-chu-ky/fixture.mjs` (ngoài tests/) giữ bố cục cũ: dòng 26 `skills/acceptance/references/…`, 37 `lib/evidence-core.cjs`, 121/134 `tar … scripts lib`, 186/196 `${kitRoot}/scripts/pre-merge-check.sh`, 204 `scripts/start-scan.mjs` |
| lnt-no | 6 dòng FAIL (NO1, NO2) | 0 | — |
| o-mo-viec-mang-nguon | 4 | 4 | ON-2, ON-3, ON-3-thieu-tep, ON-6-im · ngu-nghia · `LO_BIN/CAT_BIN(may)` dùng chung đường mới cho KIT và `mayCu()` (archive GOC_VONG `scripts lib skills`, bố cục cũ); đề xuất: bin riêng cho mayCu |

Tổng: ~54 ca chuyển từ đỏ/không chạy sang xanh (đếm theo số PASS tăng trên 12 tệp được vá).
