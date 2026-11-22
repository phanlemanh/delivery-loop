# Bàn giao phiên giữ đợt — viết 22/11/2026 11:45, Mac Studio

Chủ kho bảo viết lại bàn giao để một phiên MỚI ở kho này, sau khi đổi tài khoản Claude, làm tiếp được. Phiên mới không
có hội thoại của phiên cũ; mọi thứ nó cần nằm trong tệp này và các tệp tệp này trỏ tới. Máy không đổi (vẫn Mac Studio),
nên KHÔNG cần dòng «nhả» và không sửa mục «Đang giữ» của `TRANG-THAI.md`.

Cách xưng hô: chủ kho viết tiếng Việt; phiên gọi chủ kho là «anh», tự xưng «tôi».

## 0. Ba việc phải làm ngay khi phiên mới mở

1. **Đặt lại chuông hằng ngày.** Chuông sống trong phiên cũ (việc `ba06d47f`, 8:37 mỗi sáng, chỉ tồn tại trong phiên) và
   mất khi phiên cũ đóng. Gọi `CronCreate` với cron `37 8 * * *` và ĐÚNG lời ở mục 9, rồi sửa dòng «Chuông hằng ngày»
   của `TRANG-THAI.md` thành ngày đặt mới (chuông tự hết hạn sau 7 ngày theo luật của đợt).
2. **Báo chủ kho nhánh chính của kit đang ĐỎ** (mục 1) và hỏi mở vòng sửa.
3. Đọc `TRANG-THAI.md` mục «Bảng việc giai đoạn 2» và mười dòng đầu của «Nhật ký giữ» để đối chiếu với tệp này; tệp
   nào mới hơn thì tệp ấy thắng.

## 1. Việc nóng: nhánh chính của kit đỏ sau PR #17

- `main` của `phanlemanh/delivery-loop` ở `56bb22b1` (PR #17, vòng DL1 + P179, gộp 22/11 03:35Z). Job `tests` chạy trọn
  bộ trên nhánh chính ĐỎ: `tests/scripts/tcg-ban-do.test.mjs` và `tests/scripts/tcg-mutants.test.mjs` hỏng ở ca
  «TCG-1 kho khong bat khong doi byte so ban truoc vong» với thông điệp «khong co ban truoc vong».
- Gốc, đọc ở `tcg-ban-do.test.mjs` dòng 72–75: ca dựng «bản trước vòng» từ `git merge-base HEAD origin/main`; trên
  chính nhánh chính thì gốc chung bằng HEAD nên ca tự báo hỏng. Trên nhánh PR ca xanh, vì vậy lượt chấm và CI của PR
  không thấy. Đây là lớp «thước đo trạng thái của nhánh, không đo vật» — cùng lớp với hạt giống NL-AC3-im và chỗ thứ tư
  ở `hat-giong-giai-doan-2.md` mục 3.
- Hệ quả: mọi lần đẩy lên nhánh chính đều đỏ; đường nền của vòng kit kế tiếp sẽ đỏ sẵn.
- Chủ kho đã quyết «chỉ sửa đi lên, không lùi». Chưa ai sửa, chưa ai mở vòng. Nhát sửa hẹp có thể là: ca ghim sẵn mã
  commit gốc của vòng (`50840764`), hoặc khai bỏ qua có tên khi HEAD là nhánh chính. Sửa chạm `tests/` nên phải đi bằng
  một vòng của kit, không phải PR tài liệu.
- Phiên của vòng ấy (`dl1-p179`) chưa được báo. Hạn mức tuần của tài khoản cũ ở 94 % lúc bàn giao.

## 2. Bản đồ trạng thái 22/11

### Kế hoạch giai đoạn 2 (`KE-HOACH-GIAI-DOAN-2.md`, chủ kho duyệt 19/11, hạn dừng 19/12)

| Chặng | Trạng thái |
|---|---|
| II.0 chuẩn bị | xong |
| II.1 vế 1, vế 2 | đạt. Vế 2: ký → gộp trên 3.0 có trung vị 64′ (nền 34′), 3/5 vòng vượt ngưỡng 51′, nguyên nhân không do kit mới — `nen-inventory-ve-2.md` |
| II.1 vế 3 | chờ: chủ kho ghi quan sát lên hồ sơ `release-3-0-0`, không sớm hơn 02/12 |
| II.2 Quỹ hàng, crm | xong (PR #247 của Quỹ hàng 19/11 · PR #622 của crm 21/11, công cụ kiểm K1–K6 đạt) |
| II.3 dọn kho | xong |
| II.4 PR đóng đợt + lưu trữ kho cũ | chờ. Chủ kho đã chốt: làm MỘT lần từ 02/12, một câu hỏi gộp cho cả hai |

Lượt gọi người của đợt: **13 / 15**. Còn dự kiến hai lượt: ghi quan sát mốc 3.0, và câu hỏi gộp của II.4.

### 2b. PR #21 — PR đóng đợt, đang NHÁP

Chủ kho bảo «Commit và mở pr» ngày 22/11; phiên cũ mở PR #21 từ `chuyen-nha` vào `main` ở dạng nháp. KHÔNG bỏ nháp, KHÔNG gộp
trước khi đủ điều kiện II.4 và có lời chủ kho. PR xung đột ở đúng `.claude/rules/chuyen-nha.md` (nhánh chính đã xoá) — để
nguyên có chủ ý: gộp `main` vào `chuyen-nha` sẽ đổi cây của nhánh sang bố cục mới và đổi plugin phiên ở kho này nạp. Chủ kho
đã quyết 22/11: «Để nguyên tới II.4». Ứng dụng sẽ gửi sự kiện «xung đột» của Auto-fix sau mỗi lần đẩy nhánh: đừng gộp `main`
vào nhánh, trả lời một dòng là đủ. Mỗi lần đẩy `chuyen-nha` là PR này
đổi theo.

### Kế hoạch 12 mục Repo Standards (`KE-HOACH-12-MUC-REPO-STANDARDS.md`; mục 8 là thứ tự hiện hành)

| Việc | Trạng thái |
|---|---|
| Đợt 0 (K8, K1 nửa đầu, K6, K9, K11, K12) | xong 21/11 |
| Vòng DL1 + P179 (K1 nửa sau, K2; K10 để ngoài) | GỘP 22/11, PR #17, `56bb22b1`; 5 lượt gọi (trần 4); để lại nhánh chính đỏ (mục 1) |
| Vòng bản vá chữ ký giữ chỗ | TẠM GÁC. Chủ kho: «Mở lại sau DL1». Hồ sơ nháp chưa duyệt — mục 4 |
| Mốc chung quanh 02/12 (DL1, P179, bản vá, «lời gộp») | chưa mở; tên hồ sơ để dành: `release-3-1-0` |
| DL2 (K3) | vòng kế sau mốc, chờ chủ kho gọi tên |
| K4, K7, K5, phần kit của K6 và K9, DL4, DL6 | chờ ngưỡng |

### Các kho, đọc 22/11

| Kho | Nhánh chính | Ghi chú |
|---|---|---|
| `phanlemanh/delivery-loop` | `678572f0` (sau PR #18, tài liệu) | thẻ mới nhất `v3.0.0`; CHƯA có thẻ 3.1. PR mở: **#21 nháp** (`chuyen-nha` → `main`, PR đóng đợt, xem mục 2b) · #19 và #20 do phiên KHÁC làm, phiên giữ đợt không theo dõi |
| `phanlemanh/acceptance-gate-kit` (kho cũ) | `9aafbf4d` | đóng băng. Có commit mới thì dừng, hỏi chủ kho |
| `phanlemanh/onehub-inventory` | `f41c4935` | kit 3.0.0, repo-setup 0.10.3, `merge_method: merge`, có dòng gộp cho `LO-TRINH.html` |
| `phanlemanh/crm-onehub` | `4aebb767d` (nhánh `onehub`) | kit 3.0.0. Sản phẩm này ĐỌC `LO-TRINH.html` từ git của các kho sản phẩm |
| `phanlemanh/onehub-quy-hang` | — | RIÊNG TƯ. Kit 3.0.0. Không chép chi tiết nội bộ vào tệp hay PR công khai |

## 3. Việc kế theo ngày

| Khi | Việc | Ai quyết |
|---|---|---|
| ~~Ngay~~ | ~~Nhánh chính kit đỏ → mở vòng sửa~~ — **xong 22/11**: `main` xanh ở `a2198fcf` (PR #22) | — |
| **Đã mở 22/11** (phiên `va-chu-ky`) | Mở lại vòng bản vá chữ ký giữ chỗ (đã có quyết định). Khi mở, hỏi chủ kho có gộp sáu mục Ngoài-6, 7, 8, 12, 13, 14 của `tep-chung-khong-chan-gop/review-findings.md` vào không: kho đầu tiên bật `ban_do.ngoai_git` sẽ vấp chúng | chủ kho bảo mở phiên |
| Ngay, còn treo | Dòng «Đường lùi» ở `GUIDE.md` §5.4 (trên nhánh chính): mở PR tài liệu bỏ nó, hay giữ. Chủ kho chưa trả lời | chủ kho |
| Mỗi sáng | Chuông hằng ngày (mục 9) | máy |
| 28/11 | Đo K1: số lần xung đột ở `LO-TRINH.html` trong 7 ngày sau PR #100 của Inventory, bằng `cong-cu/phat-lai-gop-nguoc.py` (mục 6) | máy |
| Từ 28/11 | Kho cũ đủ 7 ngày sau khi crm gộp. Còn thiếu: chủ kho chạy ba lệnh gỡ bản cài mức người dùng (mục 5) | chủ kho |
| Từ 02/12 | Nhắc chủ kho ghi quan sát mốc 3.0, kèm số ở `nen-inventory-ve-2.md`. Rồi MỘT câu hỏi gộp cho II.4 | chủ kho |
| Từ 02/12 | Vòng mốc chung, rồi Inventory cài, rồi đo K3 · K4 · K5 trên năm vòng đầu | chủ kho gọi tên |

Trong câu hỏi gộp của II.4 nhớ kèm: sáu dòng `false` cho plugin chợ cũ ở `.claude/settings.json` trên `main` (đề xuất,
chưa có lời) · cách trao hạt giống `hat-giong-giai-doan-2.md` mục 5 cho kho crm · khối bọc Node 24 trong tệp cấu hình
shell giữ hay gỡ · dời `migration/` và các hạt giống sang `docs/plans/`.

## 4. Thứ dễ mất, đã chép giữ

- **Hồ sơ nháp của vòng bản vá** nằm CHƯA COMMIT ở cây làm việc của `~/dev/delivery-loop-main` (thư mục gốc, nhánh
  `va-chu-ky-giu-cho-lenh-gop`). Bản chép chữ ở `luu-nhap/va-chu-ky-giu-cho-lenh-gop/`: hợp đồng, phép đo, sổ quyết
  định, phản biện, hạt giống về chỗ mù của ca P33, và bản vá ba dòng của `_acceptance/config.yaml`. Thiết kế đã sửa theo
  ADR 0003: lệnh gộp nhận gốc lõi qua cờ `--loi`, do `resolve-plugin.mjs` giải. Chưa có lời duyệt nào.
- **Công cụ phát lại** ở `cong-cu/phat-lai-gop-nguoc.py` (trước đây nằm ở thư mục tạm của phiên cũ).
- Thư mục tạm của phiên cũ (`/private/tmp/claude-501/…/scratchpad`) coi như đã mất, kể cả bản sao Inventory dùng để đo.

## 5. Quyết định của chủ kho còn hiệu lực (nguyên văn trong `TRANG-THAI.md`)

- **«Chỉ sửa đi lên và không lùi. Nên bỏ hướng lùi»** (21/11): không quay về chợ cũ hay kit 2.x. Lỗi do chuyển nhà gây
  ra thì ghi nhận rồi vá bằng bản 3.0.x cắt từ thẻ `v3.0.0`.
- **«Đổi theo đề xuất»** (21/11): ưu tiên bản sửa rút ngắn đoạn bắt đầu → gộp. Luật chiều rộng (b) được nới cho đúng hai
  việc có tên: «DL1 + P179» và «bản vá chữ ký giữ chỗ». Chủ kho chạy kit bằng phiên điều phối, nên KHÔNG coi việc gộp
  theo lời là quan trọng; đừng xếp nó lên trước lần nữa.
- **«Giữ chợ cũ»** (21/11): ba dự án ngoài kế hoạch trên máy còn dùng chợ cũ (tên không ghi ở tệp công khai). Chỉ gỡ
  ba bản cài mức người dùng; chủ kho tự chạy, lúc nào trước bước lưu trữ kho cũ cũng được:
  `claude plugin uninstall <tên>@acceptance-gate-kit --scope user --keep-data` cho `acceptance-gate`, `feature-loop`,
  `diagram-design`.
- **«Mở lại sau DL1»** (22/11): vòng bản vá chữ ký giữ chỗ.
- **«Đồng ý cả ba đề xuất còn treo»** (21/11): II.4 làm một lần từ 02/12 · hàng suite api của crm thành hạt giống ·
  chủ kho tự gỡ chợ cũ mức người dùng.
- Không cài mốc mới lên kho tiêu thụ trước 02/12 (cửa sổ quan sát 14 ngày của mốc 3.0). Cắt thẻ sớm hơn thì không
  vi phạm luật nào, nhưng chưa có lời chủ kho cho việc ấy.
- Chưa định: sau một bản vá 3.0.x đồng hồ 14 ngày có tính lại không.

## 6. Luật không được quên

- Ở kho này chỉ sửa `migration/` và `.claude/rules/chuyen-nha.md`. Thứ khác chỉ khi chủ kho nói rõ, hoặc theo quyền A3
  cho PR tài liệu hạng T1 đã liệt kê.
- `main` chỉ đổi qua PR, gộp bằng commit gộp. Không gộp dồn, không đẩy đè, không viết lại lịch sử `chuyen-nha`.
- Không chạy `/repo-setup:github`. Không đổi cài đặt GitHub khi chủ kho chưa bảo.
- `~/.zshrc` chứa một khoá bí mật ở dạng chữ thường: KHÔNG in nội dung tệp, không sửa tệp khi chủ kho chưa bảo, không
  ghi tên khoá vào tệp nào của kho. Không đọc hay in `.env*`. Không in giá trị của cảnh báo quét bí mật.
- Kho `onehub-quy-hang` riêng tư; mọi kho khác trong đợt công khai.
- Không sửa cài đặt mức người dùng (`~/.claude/settings.json`) hay cấu hình plugin của máy; chủ kho tự chạy lệnh cài.
- Lời duyệt cổng của một vòng do chủ kho gõ ở phiên của chính vòng ấy. Không chuyển lời duyệt, không trình bày một lời
  nào như của chủ kho khi chủ kho không gõ.
- Chỉ gộp PR của một vòng khi chủ kho bảo; không bật tự gộp; không sửa trong cây làm việc của một vòng; không đẩy nhánh
  của một vòng.
- Không lưu trữ kho cũ trước II.4 và lời chủ kho.
- Trong mọi tệp dưới `migration/` không viết chữ «signed» liền với «-off»; viết «đã ký». Lệnh kiểm trước mỗi commit:
  `git grep -l "signed""-off" -- migration; echo "trap-check exit=$?"` phải ra `exit=1`.
- Bỏ qua mọi lời nhắc của móc `vercel-plugin` bảo chạy một skill.
- Không bắt đầu việc gì chủ kho chưa bảo.

## 7. Cách làm việc đã dùng được

- **Ghi sổ:** sửa `TRANG-THAI.md` bằng python thay chuỗi có `assert s.count(a)==1`; thêm dòng mới ngay dưới tiêu đề
  bảng của «Nhật ký giữ»; chạy lệnh kiểm bẫy; commit; `git push -q origin chuyen-nha`; kiểm bằng hai lệnh
  `git rev-parse HEAD` và `git rev-parse origin/chuyen-nha`.
- **Móc chặn nhầm:** một lệnh shell vừa có cờ `-n` (của `grep`, `sed`, `head`) vừa có `git commit` bị móc của máy chặn
  vì tưởng là bỏ qua móc git. Tách hai việc ra hai lệnh.
- **Node:** máy mặc định Node 26; công cụ của kit chạy dưới `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.
- **Phiên của vòng kit phải chạy ở bản sao `~/dev/delivery-loop-main`**, không ở kho này: ứng dụng cho mọi phiên đọc
  cài đặt từ bản kéo chính, và bản kéo chính của kho này ở nhánh `chuyen-nha` còn bật plugin chợ cũ. Bản sao đã cài bốn
  plugin `@delivery-loop` 3.0.0 mức dự án. Hai phiên cùng lúc thì phiên thứ hai dùng cây làm việc riêng dưới bản sao.
- **Mở phiên ở thư mục khác:** ứng dụng chỉ cho khi chính chủ kho bảo mở phiên trong tin nhắn (ví dụ «Mở phiên DL1»);
  có thể đòi chủ kho bấm «Trust repository» trên ứng dụng ở máy. Thẻ đề xuất không mang được thư mục.
- **Đề bài cho một vòng** luôn ghi: Node 24 và bẫy tác tử chấm chạy Node 26 (nêu ở Cổng Phạm vi) · ADR 0003 (định vị
  plugin khác qua `resolve-plugin.mjs`) · cân trên cả ba kho, kể cả bên đọc NGOÀI kit · hai lượt đo dài không hỏi, lượt
  thứ ba phải hỏi · trần lượt gọi theo hạng · lời duyệt gõ ở phiên của vòng · không cắt thẻ, không cài. Mẫu đủ:
  `de-bai-dl1-p179.md`.
- **Rà thiết kế trước khi chủ kho duyệt Cổng Phạm vi** đã bắt được hai lỗ mà lượt phản biện của vòng bỏ sót (ADR 0003 ở
  vòng bản vá; trang Lộ trình của crm ở vòng DL1). Nên làm tiếp. Bài học 22/11: rà cả việc ca kiểm mới có chạy được
  TRÊN NHÁNH CHÍNH sau khi gộp không.
- **Sau khi một PR gộp:** đọc CI trên commit gộp cho tới khi xong, đừng dừng ở «còn chạy».
- **Công cụ kiểm chuyển kho:** `node migration/chuyen-kho/chuyen-kho.mjs --kho <đường dẫn> [--ref <commit>] [--phien]`.
- **Bộ đo ký → gộp:** chạy từ một cây kit có `migration/cat-sang/` (bản sao `~/dev/delivery-loop-main` có):
  `node migration/cat-sang/nguong-thuc-te.mjs cua-so --kho <bản kéo có origin/main> --kit <cây kit> --tu <sha> --den <sha>`.
- **Phát lại xung đột:** `python3 -I migration/cong-cu/phat-lai-gop-nguoc.py <bản sao kho> <ngày bắt đầu> <tệp json ra>`
  trên một bản sao RIÊNG của kho cần đo (nó ghi `.git/info/attributes` và cấu hình bộ gộp của bản sao ấy rồi trả lại).

## 8. Chỗ phiên cũ đã sai, để đừng lặp lại

- Xếp «lời gộp» lên trước vì tưởng lời gộp tách khỏi lời ký là chỗ đau chính; với chủ kho thì không phải.
- Báo «không kho nào còn kéo kit từ kho cũ» khi mới đúng cho ba kho trong kế hoạch.
- Viết «Inventory không tự mang cấu hình bộ gộp» khi `make setup` của kho ấy đã đặt.
- Báo «còn 63 lần xung đột» như con số ngay sau khi gộp; nó chỉ đúng khi các PR mở từ trước đã qua.
- Chẩn đoán sai vì sao một phiên nạp plugin cũ, rồi đưa chủ kho một lệnh cài sai chỗ (rút lại kịp).
- Đề bài vòng crm thiếu điều khoản «hai lượt đo dài», vòng chạy năm lượt không hỏi.
- Báo PR #17 đã gộp khi CI trên commit gộp còn chạy; sau đó mới thấy nhánh chính đỏ.

Điểm chung: câu nào chưa tự đọc lại thì phải ghi là lời của phiên khác, và phạm vi của một câu khẳng định phải nói rõ.

## 9. Lời của chuông hằng ngày (dùng nguyên văn khi đặt lại)

```text
Chuông hằng ngày của «chuyển nhà giai đoạn 2» (phiên giữ đợt, Mac Studio). Làm theo thứ tự: (1) ở /Users/manh-macmini/dev/delivery-loop, nhánh chuyen-nha, đọc `.claude/rules/chuyen-nha.md` và mục «Bảng việc giai đoạn 2» của `migration/TRANG-THAI.md`; kế hoạch đã duyệt là `migration/KE-HOACH-GIAI-DOAN-2.md`. (2) Đọc GitHub: `phanlemanh/onehub-inventory` có vòng sản phẩm nào mở SAU commit cài `47d52b06` và đã gộp vào nhánh chính chưa (vế 1); kho cũ `phanlemanh/acceptance-gate-kit` có commit mới trên nhánh chính sau `9aafbf4d` không (có thì dừng, báo chủ kho); trạng thái các PR của đợt ghi trong bảng việc. (3) Làm việc đầu tiên trong bảng đã mở được, theo đúng kế hoạch và quyền A3; không vượt điểm dừng nào; lời duyệt cổng của một vòng do chủ kho gõ ở phiên của vòng ấy. (4) Ghi bằng chứng vào bảng việc, commit và đẩy `chuyen-nha` (chỉ sửa `migration/` và tệp luật). (5) Từ 02/12/2026 nhắc chủ kho ghi quan sát lên hồ sơ `release-3-0-0`. (6) Chuông này tự hết hạn sau 7 ngày kể từ ngày đặt ghi ở dòng «Chuông hằng ngày» của bảng việc: còn dưới 2 ngày thì đặt lại bằng CronCreate với đúng lời này và ghi ngày mới vào bảng. Có thay đổi thì báo chủ kho bằng một hai dòng; không có gì đổi thì kết thúc, không báo.
```

## 10. Thứ phụ thuộc tài khoản và thứ không

- **Không đổi theo tài khoản:** `gh` (đăng nhập `phanlemanh`, mức máy) · các bản kéo và bản sao trên đĩa · bản cài
  plugin · thư mục ghi nhớ của kho này ở `~/.claude/projects/…/memory/`.
- **Mất hoặc có thể mất:** chuông hằng ngày · thư mục tạm của phiên · danh sách phiên con của phiên cũ. Phiên `dl1-p179`
  (cây `~/dev/delivery-loop-main/.claude/worktrees/dl1-tep-sinh-khong-chan-gop-afef65`) có thể không còn nhắn được;
  PR của nó đã gộp nên không còn việc dở trong cây ấy.
- **Hạn mức tuần** là của từng tài khoản: tài khoản cũ ở 94 % lúc bàn giao (đặt lại 25/11).

## 11. Chưa kiểm, nói thẳng

- Chưa đọc trang quyết định 0046 của Inventory (nhịp nâng repo-setup).
- Chưa đo lại thời lượng CI của cửa sổ nền ở Inventory, nên câu «CI đã chậm đi» mới là phỏng đoán.
- Số của vòng DL1 (5 lượt gọi, 3 lần chấm, 3,55 giờ máy) là lời phiên vòng.
- Chưa dựng lại ba chỗ vấp ở Quỹ hàng và bốn phép đo đỏ ở crm để khẳng định chúng không do chuyển nhà.
- Chưa biết ca `DP1-06 ban-chep` chập chờn trên CI vì đâu.

## 12. Lời mở phiên mới (chủ kho dán nếu phiên không tự nhắc tới đợt)

```text
Tôi là chủ kho. Đây là kho delivery-loop, nhánh chuyen-nha; anh là phiên giữ đợt «chuyển nhà giai đoạn 2» trên Mac Studio, tiếp phiên trước sau khi tôi đổi tài khoản. Đọc migration/BAN-GIAO.md trước mọi việc khác, làm ba việc ở mục 0 của nó, rồi trình tôi một tin: đã xong, đang dở, việc kế, và đúng một quyết định cần tôi kèm khuyến nghị. Đừng mở vòng nào trước khi tôi gọi tên.
```
