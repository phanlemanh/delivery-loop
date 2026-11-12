# Khác biệt dự kiến — trước và sau khi chuyển nhà

Bảng chủ kho dò lúc ký mốc 3.0 (chủ kho đặt 12/11: «Đây cũng là bảng tôi sẽ kiểm tra»). Mỗi hàng nói một điều: hôm nay
nó thế nào (**Trước**, đo 12/11 trên `909dffd8` nếu không ghi khác), sau ngày cắt nó phải thế nào (**Sau**), và kiểm bằng gì.
Hàng nào kiểm được bằng máy thì cột cuối là lệnh hay thước; hàng nào chỉ người kiểm được thì ghi rõ.

**Trạng thái của cột «Sau»:** **chốt** — chủ kho đã quyết · **tạm** — tạm chốt 11/11, chốt hẳn ở Cổng Phạm vi B1 ·
**mở** — chưa ai quyết, hàng sẽ được điền ở cổng ghi trong ngoặc · **đo** — không phải quyết định, máy đo ra.

Nguồn: `KE-HOACH.md` mục 3 và 12 · `BOI-CANH.md` · `TRANG-THAI.md` · `tra-soat/ket-qua/` · `chay-thu-phien/`. Bảng này
là **chiếu** của các nguồn ấy — mâu thuẫn thì nguồn thắng, sửa bảng.

## 1. Phải GIỮ NGUYÊN — khác biệt kỳ vọng bằng 0

Đây là phần nói «tính năng vẫn chạy». Một khác biệt ở đây là lỗi của đợt, không phải đổi có chủ đích.

| # | Điều | Trước | Sau | Kiểm bằng |
|---|---|---|---|---|
| G1 | Phán quyết của bộ chặn gộp trên hồ sơ thật | Quỹ hàng, crm: danh sách `VIOLATION` hiện tại | 0 dòng lệch giữa kit cũ và kit mới trên cùng một cây | B3: `pre-merge-check.sh . --recheck-all --base <nhánh chính>` bằng hai bản kit, so dòng `VIOLATION` |
| G2 | Plugin, lệnh, skill, tác tử nạp trong phiên thật | 6 plugin · 33 lệnh và skill · 3 tác tử | Đúng số ấy sau khi đổi qua bảng tên — không mất, không thừa | `chay-thu-phien/chay-thu.mjs --so cu.json moi.json --bang-ten bang-ten.json` thoát 0 |
| G3 | Ca kiểm của kit | 4 749 khoá ở bốn bộ bash (`13c523e6`) + 667 ca điều phối + bước bản đồ | Túi khoá cũ nằm trọn trong kho mới; danh sách bỏ rỗng, hoặc từng dòng có lý do và hiện trên thẻ | Thước «giữ đủ khoá ca» của B2 (`KE-HOACH.md` mục 12) |
| G4 | Kết quả bộ kiểm | Kho cũ: CI xanh · kho mới (Mac Studio): 968 xanh / 1 đỏ (`MC-11`, do tên kho) | Kho mới xanh trọn; các ca ấy vẫn xanh ở kho cũ | B2 · lượt kiểm trên GitHub của kho mới |
| G5 | Lịch sử git | Nhánh chính kho cũ 5 750 commit, 30 thẻ | Đủ cả, cùng mã; commit dọn nhà đứng TRÊN nhánh chính kho cũ | `git rev-parse <thẻ>` trên hai kho cho cùng mã · `git merge-base --is-ancestor kit-cu/main main` |
| G6 | Chữ người đọc: thẻ cổng, thông báo, tên bốn cổng | Tiếng Việt | Không đổi | Thẻ cổng của vòng thật ở Quỹ hàng (ngưỡng thực tế mốc 3.0) — người đọc |
| G7 | Khuôn hồ sơ `_acceptance/` của kho tiêu thụ: khoá cấu hình, giá trị trạng thái, tên hồ sơ | Như 2.38/2.39 | Không đổi — kho tiêu thụ **không** phải sửa hồ sơ nào | G1 (cùng phán quyết trên hồ sơ không sửa) · `git diff` của PR cài 3.0 ở Quỹ hàng không chạm `_acceptance/` |
| G8 | Bảy thao tác cổng người khoá model-invocation; `acceptance-card` để mở | Đúng như ADR 0002, ca P32 giữ | Không đổi | P32 và NO-AC11 xanh ở kho mới (thuộc G3) |
| G9 | Móc chặn PASS không bằng chứng, chặn nhảy trạng thái | 71 ca hooks xanh | Không đổi | Bộ hooks ở kho mới (thuộc G3) — G2 không thấy móc có bắn hay không, giới hạn đã khai |
| G10 | Tên script nội bộ | `scripts/*.mjs`, `lib/*.cjs` như hôm nay | Không đổi tên — chỉ đổi thư mục chứa | Sổ kiểm kê: tên tệp của 614 tệp sản phẩm giữ nguyên, chỉ đổi tiền tố |

## 2. Đổi có chủ đích — nhà và tên

| # | Điều | Trước | Sau | Trạng thái | Kiểm bằng |
|---|---|---|---|---|---|
| N1 | Kho nguồn | `phanlemanh/acceptance-gate-kit`, công khai | `phanlemanh/delivery-loop` | tạm | `gh repo view` |
| N2 | Hiển thị kho mới | riêng tư (từ 11/11) | **mở** — công khai như kho cũ, hay giữ riêng tư (ngày cắt) | mở | `gh repo view --json visibility` |
| N3 | Tên chợ plugin | `acceptance-gate-kit` | `delivery-loop` | tạm | `.claude-plugin/marketplace.json` → `name` |
| N4 | Lệnh thêm chợ | `claude plugin marketplace add phanlemanh/acceptance-gate-kit` | `… add phanlemanh/delivery-loop` | tạm | GUIDE §5.1 ở kho mới |
| N5 | Khoá bật plugin trong `.claude/settings.json` của mọi kho | `<plugin>@acceptance-gate-kit` | `<plugin>@delivery-loop` | tạm | kho này hôm nay vẫn bật 4 plugin từ chợ cũ + `superpowers` |
| N6 | Tên plugin giữ | `acceptance-gate` · `feature-loop` · `diagram-design` | Không đổi | tạm | G2 |
| N7 | Tên plugin đổi | `dieu-phoi` · `road-map` · `tri-thuc` | `dispatch` · `roadmap` · `knowledge` | tạm | `bang-ten.json` → G2 |
| N8 | Lệnh của ba plugin đổi tên | 12 lệnh tên Việt (`mo-dot`, `xem`, `ghim`, `ghi`…) | Tên Anh theo `KE-HOACH.md` mục 3 (`open`, `status`, `pin`, `ingest`…) | tạm | `bang-ten.json` → G2 |
| N9 | Hai skill trong plugin lõi | `cat-luot` · `gom-tin-hieu` | `scope-slice` · `signal-intake` | tạm (tên chưa soát mô tả) | G2 |
| N10 | Ba tác tử của `feature-loop` | `cham-doc` · `cham-lenh` · `cham-ui` | **mở** (Cổng Phạm vi B1) | mở | G2 |
| N11 | Tên cũ làm bí danh | — | **Không có bí danh**: ai ở chợ cũ gõ tên cũ, ai sang chợ mới gõ tên mới | chốt (11/11) | G2: tên cũ hiện ở «thừa» là lỗi |
| N12 | Số PR, vấn đề | PR đến #499; 25 vấn đề và 5 PR đang mở ở kho cũ | Số PR đếm lại từ đầu; 25 vấn đề dời hoặc đóng | chốt (đánh số) · mở (dời gì) | `gh issue list` hai kho |

## 3. Đổi có chủ đích — bố cục và bản cài

| # | Điều | Trước | Sau | Trạng thái | Kiểm bằng |
|---|---|---|---|---|---|
| B1 | Chỗ của plugin lõi | Chính gốc kho (`skills/`, `commands/`, `hooks/`, `scripts/`, `lib/`, `vendor/`, `evals/` ở gốc) | `plugins/acceptance-gate/` | chốt (nguyên tắc) · mở (bảng nguồn→đích, B1) | Sổ kiểm kê chạy trên cây mới |
| B2 | Năm plugin con | Mỗi cái một thư mục ở gốc | `plugins/<tên mới>/` | chốt (nguyên tắc) | như B1 |
| B3 | Bản cài plugin lõi | **5 729 tệp, 101 MB** (bản cài 2.38.1 trên Mac Studio) | Chỉ sản phẩm: khoảng 285 tệp lõi, cỡ vài MB | đo | `find <bản cài> -type f \| wc -l` |
| B4 | Tệp sản phẩm theo plugin | lõi 285 · `diagram-design` 214 · điều phối 75 · `feature-loop` 29 · `road-map` 7 · `tri-thuc` 4 | Mỗi tệp có đúng một chỗ ở kho mới, hoặc nằm trong danh sách bỏ có lý do | đo | Thước B1 |
| B5 | 20 tệp «chưa rõ» | Trong vùng plugin mà không điểm vào nào gọi | Mỗi tệp xếp tay vào một plugin, vào công cụ kho, hay bỏ có lý do | mở (B1) | `tra-soat/ket-qua/kiem-ke.tsv`, lớp `chua-ro` |
| B6 | Lõi gọi thẳng thư mục điều phối | 7 chỗ, chỉ chạy vì lõi mang cả kho | 0 chỗ — đi qua `resolve-plugin`, hoặc dời tệp | đo | Chạy lại sổ kiểm kê trên cây mới: kiểu `import-tuong-doi` + `goc-plugin` giữa hai plugin = 0 |
| B7 | `resolve-plugin` tìm theo tên chợ | 32 chỗ, tìm `acceptance-gate-kit` | Tìm `delivery-loop`, đổi cùng lượt với N3 | đo | G2 + bộ kiểm (G3) |
| B8 | Con trỏ từ sản phẩm sang tệp không phải sản phẩm | 82 rõ + 64 mơ hồ | Con trỏ rõ: sửa thành đường dẫn đầy đủ sang kho, hoặc gỡ; không con trỏ nào treo trong bản cài | mở (B1) | Sổ `con-tro-ra-ngoai.tsv` chạy trên cây mới |
| B9 | `design-floor/`, `tests/`, `docs/`, `_acceptance/`, `.out-of-scope/` | Ở gốc, nằm trong bản cài lõi | Ở gốc kho, **ngoài** mọi bản cài | mở (bảng nguồn→đích, B1) | B3 |
| B10 | Phiên bản | Năm plugin 2.38.1 (2.39.0 sắp phát hành) · `diagram-design` 2.7.1 | Năm plugin 3.0.0 · `diagram-design` **mở** (lên chung 3.0 hay giữ số riêng) | tạm · mở | Tệp khai plugin |
| B11 | Mô tả trong tệp khai plugin | lõi 84 582 ký tự · `feature-loop` 34 579 (trần 1 024) | ≤ 1 024 mỗi plugin — việc của mốc 2.39 ở kho cũ, kịch bản chỉ kiểm | đo | `tools/plugin_lint.py` |
| B12 | Tệp thừa `scripts/rel-cua-so.sh`, `lib/eval-yaml.js`; `.env` không bị bỏ qua | Còn | Hết — việc của 2.39, mang sang theo lịch sử | đo | `git ls-files` · `git check-ignore .env` |
| B13 | Hai tệp máy vẽ `PRODUCT-MAP.md`, `LO-TRINH.html` | Trong kho, vẽ lại mỗi lần ký cổng | **mở** — vòng riêng (hai hạt giống 16/10, 30/10) hay giữ nguyên | mở | — |

## 4. Kho tiêu thụ phải đổi gì

| # | Kho · chỗ | Trước | Sau | Kiểm bằng |
|---|---|---|---|---|
| K1 | Quỹ hàng · `ci.yml`, `ghim-lai-ban-that.yml` | Kéo `acceptance-gate-kit` ở `KIT_TAG: v2.37.0`, coi gốc kho kit là gốc plugin lõi | Kéo `delivery-loop` ở thẻ 3.0.x; gốc lõi = `plugins/acceptance-gate`; 4 chỗ gọi `feature-loop/scripts/…` đổi đường | Ngưỡng thực tế mốc 3.0, vế 1 (đọc `KIT_TAG` tại commit gộp) |
| K2 | Quỹ hàng · `packages/ui-lint/tim-kit.mjs` | Tìm kit theo khoá `<plugin>@acceptance-gate-kit` | Tìm được kit dưới chợ mới | Chạy công cụ ấy ở Quỹ hàng sau khi cài 3.0 |
| K3 | Quỹ hàng · cài đặt kho | 7 khoá bật plugin chợ cũ, 1 chỗ gõ lệnh plugin đổi tên | Khoá chợ mới, lệnh tên mới; **không bật cả hai chợ** cùng lúc | `.claude/settings.json` của Quỹ hàng · G2 chạy trên kho ấy |
| K4 | Quỹ hàng · hồ sơ | 175 thư mục dưới `_acceptance/` (`origin/main` `eedec225`) | Không sửa hồ sơ nào (G7) | `git diff` PR cài |
| K5 | crm | 655 chỗ bám, 37 tệp chép từ kit, 16 chỗ gãy chắc, 19 lệnh tên cũ, `tin-hieu-gom.yml` cài bằng tên chợ cũ | **Không đổi trong đợt** — crm ở lại kit cũ cho tới vòng chuyển của riêng nó | Không phải điều kiện đóng đợt (`KE-HOACH.md` mục 12) |

## 5. Bộ kiểm, CI và cài đặt kho

| # | Điều | Trước | Sau | Trạng thái | Kiểm bằng |
|---|---|---|---|---|---|
| C1 | Chạy kiểm tự động ở kho mới | Tắt | Bật (khi B1 cần lượt kiểm trên GitHub; đo hạn phút trước) | mở (ai bật, lúc nào — câu mở số 9) | `gh api repos/phanlemanh/delivery-loop/actions/permissions` |
| C2 | Khoá nhánh chính | Kho cũ: qua PR, đòi `gate` + `tests`, 0 lượt duyệt · kho mới: không khoá | Kho mới giống kho cũ — khoá **vào ngày cắt** (khoá sớm làm hỏng lệnh cập nhật `main`) | tạm | `gh api …/branches/main/protection` |
| C3 | Gộp dồn | Kho cũ cấm · kho mới **đang cho** | Kho mới cấm (gộp dồn mất commit chữ ký Cổng Bằng chứng) — trước PR đầu tiên ở kho mới | chốt (theo kho cũ) | `gh api repos/… -q .allow_squash_merge` = `false` |
| C4 | Quét bí mật, chặn đẩy bí mật, tự xoá nhánh | Kho cũ: tắt cả | **mở** — việc #1 ở `TRANG-THAI.md`, chủ kho bảo | mở | `gh api repos/… -q .security_and_analysis` |
| C5 | Thời gian lượt kiểm | PR 6,5–6,9 phút (13 mảnh, sau A1) · nhánh chính ~60 phút chạy trọn | Không chậm hơn | đo | Thời gian các lượt kiểm trên GitHub |
| C6 | Các lớp đỏ đã biết ở kho mới | Thiếu hồ sơ và sổ: 86 ca (B0) · tên kho: `MC-11` · đổi bố cục: **chưa đo** · ca dựng bản cũ theo đường dẫn cũ: 118 tệp | Mọi lớp xử ở B2; không ca nào xanh nhờ bị bớt (G3) | đo | B1 đo đủ lớp, B2 xử |
| C7 | Node | `.nvmrc` 24; bộ chạy thoát mã 3 khi lệch | Không đổi | chốt | `bash tests/bo-chay.sh node` |

## 6. Chuẩn kho (Repo Standards, `repo-setup` 0.5.0)

| # | Điều | Trước | Sau | Kiểm bằng |
|---|---|---|---|---|
| R1 | Tệp của khuôn | Chưa có `Makefile`, `tools/`, `.editorconfig`, `.repo-setup.json` | Có, áp **trong** kịch bản B1 sau bước đổi bố cục (chốt 11/11); `make test` nối vào bộ chạy kiểm thật | `ls` · `make test` chạy đúng bộ kiểm |
| R2 | Điểm `doctor` | 9/20 mục (thử trên bản sao 11/11) | ≥ 14/20 (bản sao sau khi tiếp nhận) — cao hơn khi bố cục đúng | `/repo-setup:doctor` |
| R3 | Lỗi của bộ kiểm tệp khai plugin | 4: sáu plugin lệch phiên bản · lõi lấy cả kho làm nguồn · hai mô tả quá dài | 0 (mô tả: 2.39 · nguồn: bố cục mới · phiên bản: theo quyết B10) | `tools/plugin_lint.py` |
| R4 | `.claude/skills/review-change/SKILL.md` của khuôn | — | **mở** — nhận hay không (kit đã có đường xét duyệt riêng) | Cổng Phạm vi B1 |

## 7. Số của North Star — không được xấu đi

| # | Số | Trước | Sau | Kiểm bằng |
|---|---|---|---|---|
| S1 | Lượt gọi người ngoài thiết kế, quy về kit mới | — | 0 | Ngưỡng thực tế mốc 3.0, vế 2 |
| S2 | Lượt chấm bị hạ tầng kit đốt | đếm ở cửa sổ 2.39 | 0 do kit mới | như trên |
| S3 | Lượt gọi người mỗi vòng | trần T2 3 · T3 4 | Không vượt trần | như trên |
| S4 | Làm-xong→ký, ký→gộp | trung vị cửa sổ 2.39 (vòng của Quỹ hàng) | Không vượt quá 1,5 lần; vượt thì có nguyên nhân không thuộc kit mới | như trên — ngưỡng máy đề xuất, chủ kho đổi được ở Cổng Phạm vi mốc 3.0 |
| S5 | Token, phút máy mỗi vòng | đo ở cửa sổ 2.39 | Chỉ đọc, không làm đỏ (đường chấm đổi chỗ nên điều kiện tin cậy không giữ) | Hồ sơ mốc 3.0 |

## 8. Kho cũ sau ngày cắt

| # | Điều | Trước | Sau | Trạng thái |
|---|---|---|---|---|
| O1 | Phiên bản | Đi tiếp từng mốc | **Đóng băng** ở mốc cuối (2.39.x nếu 2.39 kịp phát hành trước ngày cắt) | chốt (đóng băng) |
| O2 | Cài từ chợ cũ | Được | Vẫn được, theo thẻ — crm và đường lùi của Quỹ hàng dựa vào điều này | chốt |
| O3 | Sửa sản phẩm | Chỉ ở kho cũ | Chỉ ở kho mới; kho cũ không nhận vòng mới | chốt |
| O4 | Chữ chỉ đường sang kho mới | — | **mở** — README kho cũ trỏ sang `delivery-loop` hay không (phụ thuộc N2) | mở |

## 9. Cách đọc bảng lúc ký mốc 3.0

- Mục 1 phải bằng 0 toàn bộ. Một hàng G lệch là đợt chưa xong, bất kể mục 2–6 đã đạt.
- Mục 2–6: mỗi hàng «Sau» phải khớp, và không còn hàng nào **mở** — hàng mở lúc ký nghĩa là có quyết định chưa ai đưa ra.
- Mục 7 chỉ đọc được SAU cửa sổ quan sát 14 ngày; đợt ĐÓNG khi chủ kho ghi `da-cham-boi-thuc-te` (ngưỡng thực tế, vế 3).
- Khác biệt thấy được mà không có hàng nào ở đây là khác biệt không ai dự kiến — ghi thêm một hàng kèm lý do trước khi ký.
