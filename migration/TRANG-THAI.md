# Trạng thái đợt chuyển nhà — tệp SỐNG

Tệp duy nhất phải sửa mỗi khi đổi máy hoặc xong một việc. Ai mở kho này cũng đọc tệp này trước; `BOI-CANH.md` và
`KE-HOACH.md` giải thích vì sao, tệp này nói đang ở đâu.

## Đang giữ

**Mac Studio** — từ 12/11/2026, chủ kho giao («Nhận và mở 2.39 với phiên độc lập … còn phiên này sẽ thực hiện kế hoạch
chuyển nhà»). Đã kiểm dòng nhả của MacBook Pro trước khi nhận. Lúc nhận: `main` = nhánh chính kho cũ `909dffd8`.

Máy này mặc định chạy Node 26 — mọi lệnh kiểm phải chạy dưới `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`
(24.16.0), nếu không bộ chạy thoát mã 3.

Mốc 2.39 (việc 3b) chạy ở một phiên RIÊNG trên Mac Studio, trỏ thẳng vào kho cũ `~/dev/acceptance-gate-kit`, kho nhận
`onehub-quy-hang`; phiên giữ đợt không làm mốc.

Luật giữ: mỗi lúc chỉ MỘT máy sửa nhánh `chuyen-nha`. **Máy đang giữ, trước khi rời:** đẩy hết, rồi tạo một commit có thông
điệp bắt đầu bằng «migration: <tên máy> nhả» và không sửa gì sau đó. **Máy nhận:** (1) kéo nhánh về, (2) kiểm
`git log -1 --format=%s origin/chuyen-nha` đúng là dòng nhả ấy — không phải thì dừng, hỏi chủ kho, (3) sửa dòng trên thành
tên máy mình + ngày, commit, đẩy, (4) rồi mới làm. Thấy dòng trên không phải máy mình mà chủ kho chưa bảo đổi → dừng, hỏi
chủ kho.

## Đã xong

| Việc | Bằng chứng |
|---|---|
| Kế hoạch chốt với chủ kho (phương thức, tên tạm, bốn dãy việc) | `KE-HOACH.md` mục 3, 12, 13 |
| Đo thử B0 — bỏ lịch sử, hồ sơ, sổ làm việc thì bao nhiêu ca kiểm đỏ | `KE-HOACH.md` mục 13 · `b0/ket-qua/` |
| Kho `phanlemanh/delivery-loop` tạo trên GitHub, riêng tư, chạy kiểm tự động (Actions) tắt | `gh repo view phanlemanh/delivery-loop` |
| `main` = nhánh chính kho cũ (lần cập nhật gần nhất 12/11: `909dffd8`), đủ 30 thẻ chính thức | `git rev-parse origin/main kit-cu/main` |
| Nhánh `chuyen-nha` có thư mục `migration/` và tệp chỉ đường `.claude/rules/chuyen-nha.md` | nhánh này |
| Thử kéo kho về chỗ trống và làm theo `MO-PHIEN.md` | 11/11, MacBook Pro — xem cuối tệp |
| Thử plugin `repo-setup` trên kho này (không ghi): chưa có khuôn cho kho plugin, khuôn gần nhất thêm sai loại tệp | `KE-HOACH.md` mục 14 |
| R1 — khuôn «kho plugin» cho plugin `repo-setup`, phát hành ở bản 0.5.0 | `gh release view repo-setup-v0.5.0 --repo phanlemanh/repo-standards` · ghi chú ở «Ghi chú giữ cho B1» |
| A1 `luot-kiem-nhe` — lượt kiểm của PR chạy 13 mảnh song song, nhánh chính vẫn chạy trọn; bộ chạy tự so bản Node với `.nvmrc`; có bảng thời gian từng ca. Chủ kho ký hai cổng, gộp 12/11 tại `909dffd8` | `gh pr view 499 --repo phanlemanh/acceptance-gate-kit` · hồ sơ `_acceptance/luot-kiem-nhe/` trên `main` |
| Kiểm lại bộ bàn giao trên một bản kéo sạch (12/11) — xem «Kiểm bàn giao 12/11» cuối tệp | mục đó |
| Tra soát kho cũ cho B1 (12/11, chủ kho bảo «Làm tra soát»): ba sổ máy sinh — kiểm kê tệp, chỗ hai kho tiêu thụ bám vào kit, tệp kiểm bám bố cục cũ | `tra-soat/README.md` · `node --test migration/tra-soat/*.test.mjs` 13 ca xanh |
| Thước B1 có ca chạy thử phiên thật (12/11, chủ kho bảo «Thêm ca chạy thử phiên thật vào thước B1»): kịch bản đọc những gì một phiên thật nạp từ chợ của một cây, 0 token, ~13 giây; nền `909dffd8` = 6 plugin, 33 lệnh và skill, 3 tác tử | `KE-HOACH.md` mục 12 · `node --test migration/chay-thu-phien/chay-thu.test.mjs` 8 ca xanh, 4 biến thể tiêm lỗi đều đỏ đúng ca |
| Hai thước nữa vào kế hoạch (12/11, chủ kho bảo «Ghi hai thước vào kế hoạch»): B2 giữ đủ khoá ca — nền 4 749 khoá ở bốn bộ bash + 667 ca điều phối trên `13c523e6`; ngưỡng thực tế đóng đợt ở mốc 3.0 | `KE-HOACH.md` mục 12, dưới bảng dãy B · `BOI-CANH.md` quyết định 12 |
| Bảng khác biệt dự kiến trước/sau chuyển nhà — bảng chủ kho dò lúc ký mốc 3.0 (12/11, chủ kho bảo «Lập bảng sự khác biệt dự kiến…»): 10 điều giữ nguyên, 53 điều đổi hay đo (thêm R5–R7 cùng ngày), 13 hàng còn quyết định «mở» (N2, N10, N12, B1, B5, B8, B9, B10, B13, C1, C4, R4, O4) | `KHAC-BIET-DU-KIEN.md` |
| Ranh giới và điểm nối với Repo Standards (12/11, chủ kho bảo «Kiểm xem repo standards … xác định ranh giới và điểm nối»): hai bên không gọi nhau lúc chạy, nối qua tệp; `doctor` 55/100 trên cây hôm nay; một va cứng — `/repo-setup:github` luôn đặt chỉ gộp dồn | `NOI-REPO-STANDARDS.md` · `KHAC-BIET-DU-KIEN.md` R2, R5–R7 |

## Đang dở

| Việc | Ở đâu | Còn thiếu |
|---|---|---|
| Mốc 2.39 (việc 3b) | kho CŨ, phiên riêng trên Mac Studio, worktree nhánh `release-2-39` của `~/dev/acceptance-gate-kit` | Mở 12/11 — chưa có PR mốc, chưa cắt thẻ, Quỹ hàng chưa cài. Ở kho này không có việc nào dở. |

## Ghi chú giữ cho B1

**Điều A1 để lại mà B1 phải biết (đo 12/11 trên `909dffd8`):** kho cũ nay có `.nvmrc` ghi `24`; bốn bộ chạy kiểm tự so và
**thoát mã 3 ngay khi bản Node của máy lệch số chính** — kiểm trước bằng `bash tests/bo-chay.sh node`. Lượt kiểm của PR là 13
việc song song (phiên A1 báo 6,5–6,9 phút, trước đó 57–67); đẩy lên nhánh chính vẫn chạy trọn một việc như cũ. Giới hạn
phiên A1 đã ghi vào hạt giống: bước cài `zsh` nay chạy ở 8 mảnh nên một lần máy kiểm mất mạng làm đỏ oan cả 8.

R1 đã phát hành: `repo-setup` **0.5.0**, thẻ `repo-setup-v0.5.0` = `4dc53e0` trên nhánh chính `repo-standards` (PR
[#6](https://github.com/phanlemanh/repo-standards/pull/6) khuôn, PR [#7](https://github.com/phanlemanh/repo-standards/pull/7)
nâng phiên bản; cả hai xanh đủ bốn việc kiểm trước khi gộp, nhánh chính sau PR #6 cũng xanh). Chưa ai xét duyệt mã từng
dòng. Chưa chạy: lượt phát hành của mức `team` trên GitHub, các skill dựng kho trong một phiên thật trên kho plugin.

**Gọi công cụ khuôn từ đâu (đo lại 12/11):** nhánh chính `repo-standards` đã đi tiếp sau thẻ 0.5.0 (gộp thêm lớp thiết
kế tại `1f405a9`, số phiên bản vẫn ghi 0.5.0). Vì thế «bản 0.5.0» và «nhánh chính» không còn là một — B1 gọi công cụ từ một
bản kéo riêng tại ĐÚNG thẻ, không từ thư mục làm việc `repo-standards` của máy nào:

```bash
git clone --depth 1 --branch repo-setup-v0.5.0 https://github.com/phanlemanh/repo-standards.git <chỗ tạm>/rs
```

Bẫy ghi 11/11 về thư mục `~/dev/repo-standards` của MacBook Pro đứng ở nhánh cũ đã hết: thư mục ấy nay ở nhánh chính.
Công cụ cần `python3` 3.11 trở lên.

(Đoạn này và đoạn kế nói về kho `repo-standards`, không phải kit.) Mã commit của nhánh đã đổi so với lần ghi trước (`0fa5473`): trước khi đẩy lên kho công khai, tên kho riêng tư dùng làm tên
mẫu trong bộ kiểm được gỡ khỏi cả tệp lẫn lịch sử nhánh, rồi nhánh gộp thêm hai commit mới của nhánh chính. Kiểm lại tại
`b2f67ea`: `bash tests/run.sh` xanh (46 nhóm, 0 lỗi).

Kiểm lại độc lập 11/11 (MacBook Pro, tại `0fa5473`): `bash tests/run.sh` xanh (45 nhóm, 0 lỗi) · bộ dò nhận kit là `claude-plugin` · điểm
`doctor` của kit 44 → 50 (thước mới bỏ các mục của ứng dụng và bắt đúng năm lỗi thật: nguồn plugin là cả kho, phiên bản
lệch nhau, mô tả plugin quá dài, thiếu lệnh nâng phiên bản, lượt kiểm chưa kiểm tệp khai plugin) · `repo-standards` tự chấm
67 · tiếp nhận kit ở chế độ thử không ghi: thêm 6 tệp (`.editorconfig`, `.nvmrc`, `Makefile`, `tools/bump_version.py`,
`tools/plugin_lint.py`, `.claude/skills/review-change/SKILL.md`), trộn dòng vào 2, bỏ qua 6, để nguyên 4 tệp trùng; từ
điển miền, wiki và tệp mẫu biến môi trường báo «không áp» kèm lý do.

Tiếp nhận GHI THẬT trên một bản sao của kit (11/11, MacBook Pro, bản sao ở thư mục tạm, kit tại `9ff2e4f7`, công cụ tại bản
0.5.0): chạy sạch · thêm 6 đường dẫn (`.claude/skills/`, `.editorconfig`, `.nvmrc`, `.repo-setup.json`, `Makefile`,
`tools/`) · trộn dòng vào 2 tệp đã có (`.gitattributes`, `.gitignore`) · không ghi đè, không xoá tệp nào · `doctor` 9/20 →
14/20 mục chấm. Bộ kiểm tệp khai plugin vừa thêm (`tools/plugin_lint.py`) báo 4 lỗi trên kit. Hai lỗi đầu là việc của kịch bản
chuyển nhà; hai lỗi mô tả dài là việc của mốc 2.39 ở kho cũ (`KE-HOACH.md` mục 12), kịch bản chỉ kiểm chúng đã hết: sáu plugin lệch phiên bản (`diagram-design` 2.7.1, năm cái còn lại 2.38.1) · plugin lõi lấy cả kho làm nguồn ·
mô tả của plugin lõi dài 84 582 ký tự và của `feature-loop` 34 579 ký tự (trần 1 024; 12/11 đo thẳng hai tệp
khai plugin trên `909dffd8`: đúng hai con số ấy).

**Vì sao chưa áp khuôn thẳng lên cây kho này (đo 11/11 trên bản sao đã tiếp nhận):** khuôn 0.5.0 giả định bố cục SAU khi
dọn nhà. Trên cây hiện tại của kit: lệnh gom `make check` gọi `tests/run.sh` — tệp mẫu bị bỏ qua ở chế độ tiếp nhận, kit
không có tệp ấy nên lệnh hỏng ngay; `make validate` duyệt `plugins/*/` trong khi năm plugin của kit đang nằm ở gốc kho nên
nó không kiểm plugin nào; lượt kiểm của khuôn bị bỏ qua vì kit đã có `gate.yml`. Phần chạy được ngay: bộ kiểm tệp khai
plugin, lệnh nâng phiên bản, `.editorconfig`, `.nvmrc` (lúc đo khuôn ghi `22`; từ 12/11 kho cũ đã có `.nvmrc`
ghi `24` nên khuôn để nguyên tệp ấy — thử không ghi 12/11 trên bản kéo sạch: khuôn báo giữ nguyên 5 tệp trùng
`.claude/settings.json`, `.nvmrc`, `CLAUDE.md`, `LICENSE`, `README.md`). Bản đồ sản phẩm của
kit không đỏ vì các tệp mới. Việc cho B1: áp khuôn SAU bước đổi bố cục, rồi nối `make test` vào bộ chạy kiểm thật của kit.
Việc cho Repo Standards (chưa mở): ở chế độ tiếp nhận, `Makefile` trỏ `make test` vào một tệp mẫu mà chính nó đã bỏ qua.

Dòng lệnh kịch bản chuyển nhà (B1) sẽ gọi:

```bash
python3 <repo-standards>/plugins/repo-setup/scripts/apply.py --target <cây kho mới> --preset claude-plugin --level starter --adopt --var project_name=delivery-loop --var description="<mô tả>" --var owner=phanlemanh
```

Giá trị cho chỗ trống: `<repo-standards>` = bản kéo tại thẻ ở đoạn «Gọi công cụ khuôn từ đâu»; `<mô tả>` = một câu mô tả kho,
B1 soạn và chủ kho thấy ở Cổng Phạm vi.

B1 cần quyết: có nhận tệp `.claude/skills/review-change/SKILL.md` không (kit đã có đường xét duyệt riêng) — và bốn điều nữa ở cuối `NOI-REPO-STANDARDS.md`.

**Bộ kiểm trên Mac Studio (12/11, nhánh `chuyen-nha` `35c1e754`, Node 24.16):** scripts **968 xanh / 1 đỏ** · plugins
xanh · hooks 71/71 · workflows xanh · điều phối 667/667 · bản đồ sản phẩm khớp · `migration/` 21/21. Ca đỏ duy nhất là
`MC-11` (`tests/scripts/moc-chien-dich.test.mjs`), và nó đỏ **chỉ vì tên kho**: ca so tên phiên với chữ cứng
`(acceptance-gate-kit)`, mà `tenKho()` ở `scripts/lo-trinh.mjs` lấy tên theo THƯ MỤC chứa bản kéo (`delivery-loop`),
không theo remote. Ở kho cũ ca xanh vì CI kéo vào thư mục tên `acceptance-gate-kit` — kho mới sẽ đỏ mãi. Đây là lớp đỏ
«đổi tên kho» mà B0 chưa đo (B0 giữ nguyên tên); B1 đo đủ lớp này, B2 xử. Bộ kiểm có 19 tệp nhắc chữ `acceptance-gate-kit`
— phần lớn là tên chợ, phải đổi cùng lượt với `resolve-plugin`.

**Rà điều kiện dọn nhà (12/11, Mac Studio) — điều đo được ngoài các bảng trên:** sổ tra soát còn tươi và tất định (chạy
lại khớp từng byte) · bản kéo Quỹ hàng trên Mac Studio ở `~/onehub-quy-hang` (không ở `~/dev`) và chậm 2 332 commit so
với nhánh chính của nó — B3 cắt worktree từ `origin/main` · kho mới đang **cho gộp dồn**, kho cũ cấm (gộp dồn mất commit
chữ ký Cổng Bằng chứng) — phải đặt giống kho cũ trước PR đầu tiên ở kho mới · plugin kit trên Mac Studio đã lên 2.38.1
(phạm vi người dùng, `delivery-loop`, bản kéo chính kho cũ); plugin ở các kho tiêu thụ để nguyên theo lời chủ kho.

## Kế — theo thứ tự phụ thuộc

| # | Việc | Ở kho nào | Mở khi |
|---|---|---|---|
| 1 | Bật quét bí mật + chặn đẩy bí mật, bật tự xoá nhánh sau gộp | kho CŨ, cài đặt GitHub | chủ kho bảo (đổi cài đặt kho) |
| 2 | ~~R1 — khuôn «kho plugin»~~ — xong 11/11, bản 0.5.0 | `repo-standards` | — |
| 3 | ~~A1 `luot-kiem-nhe`~~ — xong 12/11, gộp tại `909dffd8` | kho CŨ | — |
| 3b | **Mốc 2.39** (làn V): ba việc chỉ-bớt + cắt số + một kho tiêu thụ cài. Đo 12/11 cả ba CHƯA làm: mô tả trong tệp khai plugin lõi còn 84 582 ký tự và `feature-loop` 34 579 · hai tệp thừa `scripts/rel-cua-so.sh`, `lib/eval-yaml.js` còn (xoá phải kèm: `tests/plugins/run-tests.sh` nhắc tệp sau, `CHANGELOG.md` nhắc tệp trước như công cụ đối chiếu lúc cắt mốc) · `.env` chưa vào danh sách bỏ qua. Chưa có hồ sơ mốc | kho CŨ, làm ở Mac Studio (việc kit ở Mac Studio) | **đã gọi tên 12/11** — kho nhận `onehub-quy-hang`; đang chạy ở phiên riêng |
| 4 | B1 `kich-ban-chuyen-nha` — kịch bản sinh commit dọn nhà lên trên nhánh chính kho cũ. Đầu vào và các câu còn mở: `BOI-CANH.md`, hai mục «Đầu vào cho B1» | kho này, `migration/` | **hai điều kiện:** mốc 2.39 đã có một kho tiêu thụ cài (việc 3b) · chủ kho gọi đích danh tên vòng (`kich-ban-chuyen-nha` hoặc «B1»; câu giao máy KHÔNG phải gọi tên vòng). Ngoại lệ luật chiều rộng (b), hạn dừng và bảng tên KHÔNG phải điều kiện mở — chủ kho quyết chúng tại Cổng Phạm vi của chính B1 (`KE-HOACH.md` mục 12) |
| 5 | B2 `bo-kiem-xanh-o-kho-moi` | kho này | sau B1 (B1 đo lớp đỏ do đổi bố cục) |
| 6 | B3 cắt sang — mốc 3.0, Quỹ hàng nhận trước | kho này + kho tiêu thụ | chữ ký của chủ kho |

Việc 2 và 3 đã xong; việc đang chặn B1 là việc 3b (mốc 2.39 của kho cũ, một kho tiêu thụ đã cài) và các quyết định ở mục dưới. Chi tiết, thước đo và ước giờ máy: `KE-HOACH.md` mục 12.

## Chờ chủ kho (chưa ai được tự quyết)

1. Bảo làm việc 1 (cài đặt kho cũ) hay chưa.
2. ~~Gọi tên vòng A1 và máy chạy nó~~ — xong 11/11: MacBook Pro.
3. Ngoại lệ luật chiều rộng (b) cho B1 + B2, và hạn dừng của đợt (đề xuất 21 ngày từ khi B1 mở) — quyết tại Cổng Phạm vi của B1.
4. Chốt hẳn tên `delivery-loop` và bảng tên ở `KE-HOACH.md` mục 3 — quyết tại Cổng Phạm vi của B1.
5. Ngày cắt sang.
6. Vòng riêng cho hai tệp máy vẽ — hai hạt giống 16/10 và 30/10.
7. ~~Gọi tên mốc 2.39 và kho tiêu thụ nhận nó~~ — xong 12/11: kho nhận `onehub-quy-hang`. B1 còn chờ: Quỹ hàng cài 2.39 và chủ kho gọi đích danh tên vòng B1.
8. ~~Bảo máy nào giữ đợt từ nay~~ — xong 12/11: Mac Studio.
9. Cài đặt của kho này trên GitHub trước ngày cắt — xem «Kiểm bàn giao 12/11», mục cài đặt.

## Việc lặp lại: cập nhật `main` khi kho cũ đi thêm

`main` ở đây không nhận sửa tay. Khi nhánh chính kho cũ có commit mới, máy đang giữ chạy:

```bash
git fetch kit-cu --tags && git push origin refs/remotes/kit-cu/main:refs/heads/main && git push origin --tags && git switch chuyen-nha && git merge --no-edit kit-cu/main && git push origin chuyen-nha
```

Kiểm: `git rev-parse origin/main kit-cu/main` in hai dòng giống nhau. Lệnh này chạy lại bao nhiêu lần cũng được; kho cũ
chưa đổi thì nó không làm gì.

## Nhật ký giữ

| Ngày | Máy | Việc |
|---|---|---|
| 12/11/2026 | Mac Studio | Chủ kho hỏi «Làm thế nào để biết được chuyển nhà thành công?» rồi bảo «Ghi hai thước vào kế hoạch» → B2 giữ đủ khoá ca, ngưỡng thực tế mốc 3.0. Khi ghi, đo ra hồ sơ lượt chấm không ghi phiên bản kit — khai giới hạn. |
| 12/11/2026 | Mac Studio | Chủ kho bảo «Thêm ca chạy thử phiên thật vào thước B1» → `chay-thu-phien/`, đẩy `35c1e754`. Chạy hai bộ kiểm lớn trên `chuyen-nha`: một đỏ, `MC-11`, do tên kho (đoạn «Bộ kiểm trên Mac Studio»). Rà lại mọi điều kiện dọn nhà theo lời chủ kho. Nâng plugin kit lên 2.38.1 trên máy. |
| 12/11/2026 | Mac Studio | **Nhận giữ.** Chủ kho giao kèm lệnh mở mốc 2.39 ở phiên riêng trỏ thẳng kho cũ, kho nhận Quỹ hàng. Kiểm trước khi nhận: dòng nhả đúng · `origin/main` = `kit-cu/main` = `909dffd8` · 30 thẻ · Node 24.16.0 «khớp» (máy mặc định Node 26) · chợ `acceptance-gate-kit` ở cả hai tệp cài đặt trỏ GitHub, không ghim thẻ · bộ đệm plugin trên máy mới tới 2.37.0. |
| 12/11/2026 | MacBook Pro | **Nhả.** Chủ kho bảo «Nhả cho Mac Studio». Đã đẩy hết; `main` khớp kho cũ `909dffd8`. Máy nhận kế: Mac Studio. |
| 12/11/2026 | MacBook Pro | Tra soát kho cũ: dựng ba kịch bản sinh sổ ở `tra-soat/` cùng 13 ca kiểm hai chiều (mỗi ca đã phá thử cho đỏ); đo trên kit `909dffd8`, Quỹ hàng `eedec225`, crm `74a29a68`. Đầu vào B1 ở `BOI-CANH.md` trỏ sang sổ. |
| 12/11/2026 | MacBook Pro | A1 gộp vào nhánh chính kho cũ (`909dffd8`, PR #499); cập nhật `main` kho này theo. Chủ kho bảo kiểm lại bộ bàn giao để Mac Studio nhận phần dọn nhà: kéo sạch, làm theo `MO-PHIEN.md`, cho một phiên trắng đọc thử, sửa các chỗ đã cũ, thêm đầu vào cho B1 vào `BOI-CANH.md`. |
| 11/11/2026 | MacBook Pro | A1: chủ kho ký Cổng Bằng chứng (`cbee02f7`), PR #499 rời dạng nháp; đang ghim lại hai hồ sơ, chưa gộp. |
| 11/11/2026 | MacBook Pro | A1: vòng qua hai cổng đầu, lượt chấm 1 PASS, PR nháp #499 ở kho cũ; chờ Cổng Bằng chứng. Kho cũ gộp #498 → cập nhật `main` kho này tới `11dfcd7f`. |
| 11/11/2026 | MacBook Pro | Chủ kho hỏi vì sao chưa áp khuôn 0.5.0 lên kho này; thử trên bản sao rồi chủ kho chọn «Trong kịch bản B1» — áp sau bước đổi bố cục, không áp tay trước. |
| 11/11/2026 | MacBook Pro | Chủ kho gọi tên vòng A1 `luot-kiem-nhe` và giao MacBook Pro chạy. Cập nhật `main` kho này theo kho cũ tới `6e5f4020`. Mở phiên riêng ở kho cũ cho vòng. |
| 11/11/2026 | MacBook Pro | R1: chủ kho bảo «Phát hành 0.5.0» → PR #7 nâng phiên bản, xanh, gộp tại `4dc53e0`, cắt thẻ `repo-setup-v0.5.0`, tạo bản phát hành. Thử tiếp nhận ghi thật trên bản sao kit: chạy sạch. R1 đóng. |
| 11/11/2026 | MacBook Pro | R1: lượt kiểm tự động của PR #6 xanh đủ bốn việc; chủ kho bảo «Gộp PR» → gộp vào nhánh chính `repo-standards` tại `81f164c`. Chưa phát hành. |
| 11/11/2026 | MacBook Pro | R1: chủ kho bảo «Đẩy và mở PR» → gỡ tên kho riêng tư khỏi bộ kiểm, đuổi kịp nhánh chính, đẩy, mở PR #6 ở `repo-standards` tại `b2f67ea`. Chưa gộp. |
| 11/11/2026 | MacBook Pro | Mở R1 ở kho `repo-standards` (phiên riêng); mã xong tại `0fa5473`, đã kiểm lại độc lập, chưa đẩy. |
| 11/11/2026 | MacBook Pro | Dựng nền: kế hoạch, đo thử B0, tạo kho, đẩy lịch sử, viết bàn giao. Chủ kho ban đầu định giao Mac Studio, cuối ngày đổi: MacBook Pro làm tiếp. Thử kéo kho về chỗ trống: nhánh, thẻ, tệp bàn giao và lệnh cập nhật `main` đều chạy. |

## Kiểm bàn giao 12/11 (MacBook Pro)

Đã chạy thật, trên một thư mục trống, bản `chuyen-nha` `4c0f368c`:

| Việc | Kết quả |
|---|---|
| Lệnh kéo kho của `MO-PHIEN.md` Bước 1 | chạy; 30 thẻ, 5 768 commit, `main` của hai kho cùng `909dffd8` |
| Lệnh cập nhật `main` chạy lại khi kho cũ không đổi | không làm gì, đúng như ghi |
| Bộ tự so bản Node `bash tests/bo-chay.sh node` | «khớp» (máy Node 24.22, kho khai 24) |
| Kịch bản đo `b0/dung-ban-sao.sh`, bước chạy bộ kiểm thay bằng bản giả | dựng đủ ba bản sao trong 44 giây (A 5 750 commit · B một commit, 5 723 tệp · C 1 875 tệp) |
| Khuôn 0.5.0 kéo từ thẻ, thử không ghi lên bản kéo sạch | bộ dò nhận `claude-plugin`; cây không đổi tệp nào |
| Bốn bộ kiểm nhanh của kit trên nhánh `chuyen-nha` (có thêm `migration/`) | bản đồ sản phẩm khớp · hooks 71/71 · workflows xanh · điều phối 667/667 |
| Một phiên không biết gì đọc thử bộ bàn giao | 6 chỗ nặng, 8 vừa, 7 nhẹ — đã sửa ở commit này; phần không sửa được bằng chữ thành chín «câu còn mở» ở `BOI-CANH.md`; ba chỗ nhiễu nhẹ trong phần lịch sử của `KE-HOACH.md` để nguyên |
| Thứ chỉ có trên MacBook Pro (ba kho) | không có commit nào GitHub chưa có |

**Chưa chạy:** ~~hai bộ kiểm lớn (script, plugin — khoảng một giờ) trên nhánh `chuyen-nha`~~ (đã chạy trên Mac Studio 12/11 — đoạn «Bộ kiểm trên Mac Studio») · trọn kịch bản đo B0 từ bản trong
kho (mới thử bước dựng) · bất cứ điều gì trên chính Mac Studio (bản Node, nguồn chợ plugin, bản kéo kho tiêu thụ) · tệp chỉ
đường có tự nạp trên máy khác không · lượt chạy trọn đầu tiên trên nhánh chính kho cũ sau A1 — sau đó đã xanh (đọc lúc nhả 12/11).

**Cài đặt kho trên GitHub:** kho mới đang khác kho cũ ở ba điểm (cho gộp dồn, không khoá nhánh chính, chạy kiểm tắt) —
bảng ở `BOI-CANH.md`. Lưu ý: lệnh cập nhật `main` đẩy thẳng lên `main`, nên khoá nhánh chính trước ngày cắt sẽ làm nó hỏng —
đề xuất khoá vào ngày cắt.
