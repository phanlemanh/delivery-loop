# Nhóm dieu-phoi — mục vá bộ `tests/dieu-phoi/**/*.test.mjs` (B2 lượt 4)

Vá: `va.json` cùng thư mục (36 mục). Đo trên một bản sao MỚI của B5 (`git checkout -- tests`, áp va.json bằng
node, `so_lan` khớp cả 36), có `refs/remotes/origin/*` lấy từ B5 để merge-base với `origin/main` (= 909dffd8, bố cục cũ)
giống lượt đo B5. Lệnh: `node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs"`.

B5 trước vá: 66 đỏ / 667. Sau vá: 10 đỏ (56 ca được gỡ). Mười ca còn đỏ đều là lớp `ngu-nghia`, không có `kho-cu`
nào gây đỏ trong bộ này.

## Bảng

| tệp | đỏ trước | đỏ sau | ca còn đỏ · lớp · một câu |
|---|---|---|---|
| loi/suc-khoe-nhip.test.mjs (+ loi/suc-khoe-chung.mjs) | 19 | 0 | — (`GOI` của suc-khoe-chung trỏ `dieu-phoi` ở gốc, luật bỏ sót vì đường ghép bằng `path.resolve(DAY,'..','..','..','dieu-phoi')`) |
| loi/suc-khoe.test.mjs | 4 | 0 | — (cùng mục vá suc-khoe-chung) |
| sua-loi-dau-chu-dong-vao.test.mjs | 2 | 0 | — (`GOI` ghép bằng `path.resolve`, luật bỏ sót) |
| vung-giao-viec.test.mjs | 2 | 0 | — (đường bên trong bản `git archive GOC_SO dieu-phoi` phải giữ cũ) |
| dong-goi.test.mjs | 6 | 0 | — (tên mục chợ `dispatch` + nguồn `./plugins/dispatch`; DP1-07-do giữ `dieu-phoi` cho cây tạm cho khớp `path.relative('dieu-phoi', …)`; DP1-08-do tên mục; DP1-03-do bản sao CI chép gói vào `plugins/dispatch`) |
| lop-mod.test.mjs | 3 | 1 | **DP6-03 moc-co-dinh · ngu-nghia** · `goiTaiRef(ref)` lấy `git archive <ref> dieu-phoi` cho CẢ mốc lịch sử (bố cục cũ) lẫn HEAD (bố cục mới); đề xuất: `goiTaiRef(ref, thuMuc = 'dieu-phoi')` và gọi `goiTaiRef(sauGop, 'plugins/dispatch')` (đã thử: 32/32 xanh) |
| mo-dot.test.mjs | 5 | 3 | **DP2-01 ba-lenh, DP2-01-do khoa-xem, DP2-01-do thu-tu · ngu-nghia** · `BA_LENH` là danh sách đóng so với `readdir().sort()`; đổi tên năm tệp lệnh làm đổi THỨ TỰ, nên chỉ thay tên là không đủ; đề xuất `const BA_LENH = ['close.md', 'handoff.md', 'open.md', 'resume.md', 'status.md'];` (đã thử: 54/54 xanh, kèm các mục vá tên khác đã có trong va.json) |
| tiep-tuc.test.mjs | 5 | 0 | — (`LUAT_MAU` dùng cho `git log -S`/`git show <sha cũ>:` nên phải giữ đường cũ; `tiep-tuc.md`→`resume.md`; `caySaoLb` chép `lib/skills/commands` của plugin acceptance-gate) |
| doi-tai-khoan.test.mjs | 4 | 0 | — (`ban-giao.md`→`handoff.md`, `tiep-tuc.md`→`resume.md`) |
| sua-truoc-dot-thu.test.mjs | 6 | 0 | — (thân lệnh ở mốc lịch sử giữ `dieu-phoi/commands/mo-dot.md`/`tiep-tuc.md`; thân lệnh hiện tại `open.md`/`resume.md`) |
| on-dinh-r2.test.mjs | 1 | 0 | — (README ở `MOC_DP10` lịch sử giữ `dieu-phoi/README.md`) |
| trong-dot.test.mjs | 4 | 1 | **DP7-06-do merge-base-song · ngu-nghia** · `git diff --quiet <mốc> HEAD -- <một đường>` cần một đường cho cả hai đầu, mà mốc (909dffd8) ở bố cục cũ còn HEAD ở bố cục mới; nội dung hook hai đầu GIỐNG nhau (đã kiểm `git diff --quiet 909dffd8:dieu-phoi/scripts/hook-chan-s4.mjs HEAD:plugins/dispatch/scripts/hook-chan-s4.mjs` → giống), nên điều kiện tiền đề vẫn đúng; đề xuất so hai blob theo đường riêng từng đầu |
| lenh-dot-ghi-dung-hang.test.mjs | 1 | 1 | **TC2-09-do ban-moc · ngu-nghia** · `kiemLoiDan` đọc cùng khoá `LOI_DAN` (đường bố cục mới) cho cả cây hiện tại lẫn `git show SHA_MOC:<đường>`; ở SHA_MOC tệp nằm ở `dieu-phoi/README.md`, `dieu-phoi/commands/tiep-tuc.md`; đề xuất cho bộ đọc ở ca ban-moc dịch đường mới→cũ (và kỳ vọng giữ nhãn đường mới) |
| danh-thuc-ma-phien.test.mjs | 4 | 4 | **TC1-06 doc-cu-tung-byte · ngu-nghia** · so từng byte đầu ra với gói ở sha ghim; lệch đúng ba hàng b/d/g, chỉ ở chữ lệnh trong câu báo (`/dispatch:resume` mới vs `/dieu-phoi:tiep-tuc` cũ) — hệ quả ĐỊNH TRƯỚC của đổi tên lệnh; đề xuất `chuanHoa` đổi tên lệnh cũ→mới ở bên cũ trước khi so. **TC1-08 loi-dan, TC1-08-do bo-mot-buoc · ngu-nghia** · một danh sách `LENH` (tên cũ) dùng cho cả cây hiện tại lẫn `git show SHA_MOC:dieu-phoi/commands/<t>`; đổi tên thì ca ban-cu hỏng; đề xuất `vanBanHienTai` đọc qua bảng `{tiep-tuc.md: resume.md, ban-giao.md: handoff.md, mo-dot.md: open.md}`, giữ khoá cũ. **TC1-09 than-ca-doi · ngu-nghia** · danh sách đóng `ca_doi_than` ở `_acceptance/danh-thuc-doc-nhip-dung-ma/decisions.jsonl` so với thân ca hiện tại; bước 6 (và mục vá này) đổi thân của nhiều ca nên danh sách lệch; đề xuất ghi lại danh sách sau phép chuyển hoặc neo phép so vào commit trước bước 6 |

## Ghi chú cho người duyệt

- Lượt đo trọn bộ sau vá: 656 xanh, 11 đỏ / 667. Ca thứ mười một là **GT-07 tin-tu-den** (`tin.test.mjs`). Ca này đo theo
  giờ đồng hồ: chênh trung vị 21,1 ms, ngưỡng 20 ms. va.json không chạm `tin.test.mjs`. Chạy riêng tệp này trên cùng bản
  sao thì 40/40 xanh, nên đây là ca chập chờn theo tải máy, không phải ca do vá.

- Mục vá #13–#23 ở `mo-dot.test.mjs` (tên năm tệp lệnh trong `kiemLenh` và hai ca -do) là đúng tên nhưng chưa làm
  DP2-01 xanh khi đứng một mình; chúng cần cho đề xuất `BA_LENH` ở trên.
- Mục vá DP2-11 khong-dot (mo-dot.test.mjs): `QUET(gocKit)` trả `scripts/start-scan.mjs` dưới gốc plugin acceptance-gate.
  Gốc ấy là `KIT` ở cây archive cũ và `path.join(KIT, 'plugins/acceptance-gate')` ở cây mới, theo đúng tiền lệ bước 6 đã
  dùng ở doi-tai-khoan.test.mjs (`'--ag-root', KIT` → `${KIT}/plugins/acceptance-gate`). Ca này nằm ở biên luật «chỉ đường
  dẫn»: tôi coi «gốc acceptance-gate» là một đường dẫn.
- Hai ca đọc merge-base SỐNG (DP2-11 khong-dot qua `kitTaiMergeBase`, DP7-06 qua `baseMergeBaseSong`) xanh hôm nay chỉ vì
  `origin/main` của B5 vẫn ở bố cục cũ. Sau ngày cắt sang, khi `main` mang bố cục mới, đường cũ trong `git archive` sẽ không
  khớp nữa. Đây là rủi ro về sau, không phải ca đỏ hôm nay.
- Bản sao clone từ B5 không có `origin/main`. Lượt đo phải lấy `refs/remotes/origin/*` của B5 vào bản sao, không thì
  DP2-11, DP3-03 và DP7-06 đỏ vì «không tìm được merge-base» (đây là lỗi môi trường, không phải lỗi vá).
- Tương tự lỗi `kho-cu` mà đề bài nêu, nhưng không làm ca nào trong bộ này đỏ: (1) `plugins/acceptance-gate/scripts/plugin-declare.mjs:15`
  `DEFAULT_MARKETPLACE = path.resolve(HERE, '..', '.claude-plugin', 'marketplace.json')`. DP1-08 truyền `--marketplace`
  tường minh nên vẫn xanh. (2) `plugins/acceptance-gate/scripts/kiem-ban-cai.mjs:326` `const dp = p('dieu-phoi');`. Không
  ca nào trong bộ điều phối chạm tới. (3) Ở `tests/plugins/lenh-bam-duoc.test.mjs:44`, `defaultPluginNameOf` còn liệt
  `['.', 'feature-loop', 'diagram-design', 'dieu-phoi']`. Tệp này thuộc bộ plugins, không thuộc phần của tôi; LB2 mà
  DP2-14-do-lb và DP3-12-do-lb gọi vẫn xanh.
- Mục vá ở DP1-07 khong-rieng-kho (`quetRieng(KIT, ['dieu-phoi', …])` → `'plugins/dispatch'`) sửa một ca XANH RỖNG: ca
  không đỏ, nhưng ở B5 nó không quét tệp nào của gói. Sau vá nó quét gói thật và vẫn xanh.
