# scripts-khac — báo cáo vá (B2 lượt 4)

**Tệp nộp**
- `va.json`: 98 mục trên 42 tệp. Thứ tự: phần của tôi, rồi p1, p2, p3. Không có hai phần nào chạm cùng một tệp.
- `va-can-bien-goc.json`: 4 mục KHÔNG nằm trong va.json, gỡ thêm 15 ca. Về nghĩa, mỗi mục đổi gốc kit thành gốc plugin lõi (`<biến>/plugins/acceptance-gate`). Thước đảo `kiem-cho.mjs` vẫn đỏ với chúng, vì `kit`, `goc`, `may` không có trong `bang-xep.json` → `bo_kiem.bien_goc`. Chủ đợt cần chọn một trong hai:
  - thêm ba tên biến đó vào `bien_goc`, rồi gộp va-can-bien-goc.json vào va.json;
  - hoặc coi 15 ca này là `ngu-nghia`.

**Đã kiểm**
- Phép đảo `phepDao` của `kiem-cho.mjs` trên mỗi tệp đã vá cho ra đúng bản ở cây A, cho cả 42 tệp (`p2/kiem.mjs va.json`).
- Áp lên một bản sao MỚI của B5 (`p1/ap.mjs`): sai `so_lan` 0.
- Chạy lại cả 58 tệp trên bản sao đó (`out-v/`, tóm tắt ở `out-v.txt`). Bản sao cần có `origin/main` và `main`, lấy về từ B5 như sau: `git fetch <B5> refs/remotes/origin/main:refs/remotes/origin/main refs/remotes/origin/main:refs/heads/main`.

**Tổng:** số dòng PASS tăng 617 → 772, tức +155. Số dòng FAIL giảm 189 → 97. Còn mười tệp chết giữa chừng trước khi in hết ca; con số được giữ chính xác là phép so túi khoá `giu-khoa`.

**Một mẹo dạng chuỗi.** Chỗ cần gốc plugin bên trong một chuỗi dài, tôi viết `` ${`${KIT}/plugins/acceptance-gate`} `` (template lồng), ví dụ `AG='…'` ở ngoai-n và `"$AG/` ở khuon-loi. Phép đảo nhận dạng `` `${KIT}/plugins/acceptance-gate` `` → `KIT`, nên mục vẫn qua thước. Về nghĩa vẫn là phép đổi gốc kit → gốc plugin.

## Phần của tôi (tệp lớn)

| tệp | đỏ trước | đỏ sau | ca còn đỏ · lớp · một câu |
|---|---|---|---|
| doc-jsx-va-ban-do-hong | chết (43 khoá) | chết | toàn bộ · ngu-nghia · `goc()` gọi `git archive c8fa5a65 ...THU_MUC_KIT`, mà `THU_MUC_KIT`/`LENH`/`DOC`/`S4` dùng chung cho cây gốc (bố cục cũ) và KIT; đề xuất thêm `THU_MUC_GOC = ['scripts','lib','feature-loop','skills']` và `LENH_GOC`/`DOC_GOC`/`S4_GOC` bố cục cũ cho mọi lời gọi trên `goc()` |
| ngoai-n-tu-dinh-tuyen | 6 FAIL + chết (37 khoá) | 9 | NT1/2/3(×2)/4/5/6/11-do, NT14 dem-ghim · ngu-nghia · `banSao()` dựng bản sao bố cục cũ (`mkdirSync(T/scripts)` không recursive) nhưng vòng symlink dùng một biến `d` cho cả nguồn (mới) lẫn đích (cũ); đề xuất `mkdirSync(T/plugins/acceptance-gate/scripts,{recursive:true})` và mọi đường T theo bố cục mới. Đã gỡ: `banSaoLib` (đổi sang bố cục mới), `khoGit` (đích recheck trong kho tiêu thụ đưa về `scripts/`), NT9 (`AG` = gốc plugin) |
| khoi-khuon-tren-the-cong | chết (21) | chết | toàn bộ · ngu-nghia · `nap(banGocVong(), …)` chạy `LENH` đường mới trên cây `git archive <merge-base> scripts lib` (bố cục cũ); đề xuất `LENH_GOC = 'scripts/design-floor-khuon.mjs'` cho bản gốc vòng |
| ho-so-da-ky-giu-tuoi (+ giu-tuoi-fixture.mjs) | 13 | 12 (5 nếu nhận va-can-bien-goc) | GT1/3/6/10/rf1–3 · cần bien_goc `kit` · `giuTuoi` truyền `--ag-root kit` (gốc kit, không phải gốc plugin). GT4, GT5, GT7, GT9, GT-rf4 · ngu-nghia · `congCu(kit)` và đường `giu-tuoi.mjs` dùng chung cho KIT và `banTai(sha)` (archive bố cục cũ); `banSaoTiem` dùng `cp -RL` vào `d/plugins/...` thiếu thư mục cha. Đã gỡ GT2 (fixture: đường trong `banTai` đưa về cũ, `--ag-root` mặc định = gốc plugin) |
| kiem-ban-cai-loi-sua | 11 | 11 | KL-1…KL-4 · ngu-nghia · «kho kit thu nhỏ» giả định gói acceptance-gate có nguồn `.`; chợ mới khai `./plugins/acceptance-gate`, nên `MAU` và bộ đệm `git archive <thẻ>` (trọn kho) phải tính theo cây con của gói — phải đổi cách dựng fixture, không chỉ đổi đường |
| consumer-esm | 8 + chết | 1 + chết | CE1 và CE3 (sập ở `copyFileSync`) · **kho-cu** · `plugins/acceptance-gate/commands/acceptance-init.md:193-195` khai `${CLAUDE_PLUGIN_ROOT}/dieu-phoi/scripts/{hinh-dang,cau-hinh,dot}.mjs` — dieu-phoi giờ là plugin `dispatch`, không còn nằm dưới gốc acceptance-gate. Đã gỡ CE2/CE2m/CE2p/CE2p-dot-bien/CE2w/CE2g*: danh sách chép tính theo gốc plugin |
| t3-can-ho-so-arm | 11 | 0 | — (thông điệp sản phẩm in `lib/evidence-core.cjs` tương đối gốc plugin) |
| yaml-chuan | 2 | 1 | YC-3-vang · ngu-nghia · `cayBan(null)` chép bằng `cp` dùng một biến `x` cho nguồn (mới) và đích (cũ, mà các dòng 149/152 cùng đọc); đề xuất tách đích |
| pre-merge-doc-lib-theo-kit | chết (11) | 3 | LK1-do ban-goc, LK2, LK4 · ngu-nghia · `THU_MUC_MAY` dùng chung cho `git archive GOC_SHA` và `banSaoMay`; `luoi(R, may)` ghép một đường pre-merge cho cả KIT và bản gốc |
| luat-san-pham.ca | 2 | 0 | — |
| co-hop-dong | 0 | 0 | xanh trọn 23/23; 11 khoá cum.py gán cho tệp này là của luot-sua-giu-du (trùng tên AC-n) |
| can-cu-s1.ca | 8 | 8 | CC-02, CC-05, CC-05-do, KK-1-do, KK-4-do, KK-6, KK-8, KK-8-do · chua-ro · hết timebox, chưa phân tích |
| ca bash trong tests/scripts/run-tests.sh: «?» 12 khoá (DV5…), «pre-merge cross-layer pairing teeth (wave 2)» 10, glob-hai-sao 6, staleness theo diff PR 4, recheck theo diff PR 4, eval-coverage-lint L42m 1 | — | — | chua-ro · hết timebox, chưa làm |

## Phần 1, 2, 3
Chi tiết từng tệp ở `p1/bao-cao.md`, `p2/bao-cao.md`, `p3/bao-cao.md`. Tóm tắt ca còn đỏ:
- **kho-cu:**
  - cua-veto-sau-chu-ky ×5: `_acceptance/cua-veto-sau-chu-ky/fixture.mjs`, các dòng 26, 37, 121, 134, 186, 196, 204, giữ bố cục cũ.
  - ngay-ky NK-2, NK-2-do, NK-2-giu: `plugins/acceptance-gate/scripts/tin-hieu.mjs:27,30` import `../dieu-phoi/…`.
  - s4-args-judgment-inputs JI12 ×2: `docs/findings/assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs:20,32`.
  - core-untouched JR11b và lan-status-not-run L05: verifier trong các hồ sơ `_acceptance/<slug>/` đã ký (release-2-3-0…) trỏ `scripts/product-map.mjs`.
  - Ghi chú: `plugins/acceptance-gate/scripts/start-scan.mjs:752,760` vẫn tìm `.claude-plugin/plugin.json` ở gốc kho. Không làm ca nào đỏ.
- **ngu-nghia:**
  - tep-sinh-khong-chan-gop: TS-6, TS-7, TS-7-do.
  - run-id-danh-sach-cho-phep: RH5.
  - vong-don-le-tra-tri-thuc: TD-9, TD-9-mutant.
  - chep-tri-thuc-du: CT0–CT4.
  - hskt: HK-AC5-im, HK-AC5-note.
  - khuon-loi: KL-8, KL-8-do.
  - o-mo-viec-mang-nguon: ON-2, ON-3, ON-3-thieu-tep, ON-6-im.
  - thiet-ke-nap-tri-thuc: TN-7, TN-7-mutant.
  - additive-only: DV5 ×2.
  - ntr-trang-thai: NS-AC9-cu.
  - chi-tep-vat-keo-xet-lai: TV1-do ban-goc.
  - luot-sua-giu-du: AC-1/2/4/6/7/8/9/11, tức 8 ca.
- **cần bien_goc (va-can-bien-goc.json):**
  - run-id: RH3, RH6.
  - vong-don-le: TD-4, TD-6, TD-6-mutant, TD-6-mutant-nguon.
  - khuon-loi: KL-11, KL-11-do.
- **chua-ro:**
  - hskt HK-AC7-dot-bien: phụ thuộc NS-AC9-cu và L05.
  - luot-kiem-nhe LKN-AC7-hooks: chờ bộ hooks xanh.
  - ntr-the-canh-gay GN-TV3: sửa được bằng một mục trên `tests/scripts/duong-nen-fixture.mjs`, thuộc nhóm repin/đường nền nên không đưa vào: `'--ag-root', o.agRoot || KIT,` → ``'--ag-root', o.agRoot || `${KIT}/plugins/acceptance-gate`,`` (so_lan 1).
