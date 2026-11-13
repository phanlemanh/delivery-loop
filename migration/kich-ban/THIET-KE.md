# Kịch bản chuyển nhà (vòng B1 `kich-ban-chuyen-nha`) — thiết kế

Soạn 13/11/2026, Mac Studio, sau Cổng Đáng (chủ kho «làm»). Hồ sơ: `_acceptance/kich-ban-chuyen-nha/`. Nền đọc:
`migration/KE-HOACH.md` mục 3, 12, 13 · `migration/BOI-CANH.md` · `migration/TRANG-THAI.md` · `migration/NOI-REPO-STANDARDS.md`
· sổ tra soát `migration/tra-soat/ket-qua/` (chạy lại 13/11 trên `0c4e503b` = v2.39.0).

## 1. Việc của vòng, một đoạn

Một lệnh — `node migration/kich-ban/don-nha.mjs` — lấy một mã commit của nhánh chính kho cũ (mặc định `kit-cu/main`) và
dựng nhánh cục bộ `don-nha/3.0` = mã ấy + đúng năm commit dọn nhà. Chạy lại bao nhiêu lần cũng ra cùng năm commit (cùng mã)
trên cùng nguồn; kho cũ đi thêm thì chạy lại trên nguồn mới, nhánh được dựng lại từ đầu. Kịch bản chỉ làm phép biến đổi
**cơ học** — dời tệp, đổi tên theo bảng, đổi con trỏ, chạy khuôn. Mọi sửa **ngữ nghĩa** của sản phẩm vẫn làm ở kho cũ
(`.claude/rules/chuyen-nha.md`). Ba thước của KE-HOACH mục 12 đo nhánh ấy; một lượt đo nữa chạy bộ kiểm của kit trên cây cũ
và cây mới để đếm lớp ca đỏ do đổi bố cục, làm đầu vào cho B2.

## 2. Năm commit dọn nhà

Mỗi commit một bước, tiêu đề `dọn nhà <k>/5: <bước>`, tác giả và ngày cố định (§4).

| k | Bước | Làm gì | Tập tệp chạm |
|---|---|---|---|
| 1 | dời sản phẩm | `git mv` từng thư mục sản phẩm vào `plugins/<tên mới>/` theo bảng xếp (§3) | 632 tệp (610 `san-pham` + 22 `chua-ro`) |
| 2 | tệp khai | `.claude-plugin/marketplace.json`: tên chợ `delivery-loop`, `source` = `./plugins/<tên>`, ba tên plugin mới; `plugin.json` của ba plugin đổi tên | 4 tệp |
| 3 | đổi tên | đổi tên tệp lệnh và thư mục skill theo `bang-ten.json`; áp các luật đổi chữ (§5) lên tập tệp khai | sản phẩm + `README.md`, `GUIDE.md`, `QUICKSTART.md`, `.claude/settings.json` |
| 4 | con trỏ | con trỏ RÕ từ tệp sản phẩm sang tệp không phải sản phẩm → `https://github.com/phanlemanh/acceptance-gate-kit/blob/<mã nguồn>/<đường>` | tệp sản phẩm có con trỏ (sổ `con-tro-ra-ngoai.tsv`, dòng không mang `mo_ho`) |
| 5 | khuôn Repo Standards | `apply.py --preset claude-plugin --level starter --adopt` từ bản kéo tại thẻ `repo-setup-v0.5.0`; gỡ skill `review-change`; nối `make test` vào bộ chạy kiểm của kit | tệp khuôn tạo/trộn |

Commit 4 đứng SAU commit 3 vì con trỏ trỏ sang kho cũ phải giữ tên `acceptance-gate-kit` mà luật đổi chữ ở commit 3 đã đổi.

## 3. Bảng xếp nguồn → đích

Đo 13/11: mọi tệp trong 14 thư mục sản phẩm đều là `san-pham` hoặc `chua-ro` — không thư mục nào lẫn tệp khác lớp. Vì vậy
đơn vị dời là **thư mục**, không phải tệp:

| Nguồn | Đích | Plugin |
|---|---|---|
| `skills/` `commands/` `hooks/` `scripts/` `lib/` `vendor/` `evals/` `design-floor/` | `plugins/acceptance-gate/<cùng tên>/` | lõi |
| `.claude-plugin/plugin.json` | `plugins/acceptance-gate/.claude-plugin/plugin.json` | lõi |
| `feature-loop/` `diagram-design/` | `plugins/feature-loop/` `plugins/diagram-design/` | giữ tên |
| `dieu-phoi/` `road-map/` `tri-thuc/` | `plugins/dispatch/` `plugins/roadmap/` `plugins/knowledge/` | đổi tên |
| `.claude-plugin/marketplace.json` | giữ ở gốc | chợ |

Mọi thứ khác giữ nguyên chỗ: `tests/` `docs/` `_acceptance/` `.out-of-scope/` `.github/` `.claude/` và tệp ở gốc. Chúng
ở gốc kho, ngoài mọi bản cài.

**22 tệp `chua-ro` đi theo thư mục của chúng** (vendor giữ trọn cây kèm NOTICE; ba script `feature-loop` mà skill gọi qua
biến đường dẫn; ba script lõi mà bộ kiểm và lượt phát hành gọi). Danh sách bỏ: rỗng.

**Thư mục gốc lạ thì dừng.** Bảng xếp liệt đủ thư mục gốc của nguồn hôm nay (sản phẩm → đích; còn lại → «giữ»). Nguồn
sau này có thêm một thư mục gốc chưa có trong bảng → kịch bản dừng, gọi tên thư mục, không dựng nhánh. Tệp MỚI bên trong
một thư mục sản phẩm đi theo thư mục, không cần sửa bảng.

## 4. Tất định

- Commit dọn nhà ghi tác giả và người commit cố định (`delivery-loop don-nha`, email `don-nha@delivery-loop.invalid`) và
  ngày = ngày commit của mã nguồn. Cùng cha + cùng cây + cùng siêu dữ liệu ⇒ cùng mã commit.
- `apply.py` tự điền `year` và `today` theo đồng hồ máy → kịch bản truyền `--var year=` và `--var today=` lấy từ ngày của
  mã nguồn.
- Kịch bản kiểm bản kéo Repo Standards đứng đúng `4dc53e0` (thẻ `repo-setup-v0.5.0`); lệch → dừng.
- Làm việc trên một cây làm việc tạm (git worktree) ở thư mục tạm; không chạm thư mục làm việc của kho, không chạm `main`,
  `chuyen-nha`, `kit-cu/*`. Chỉ ghi ref `refs/heads/don-nha/3.0` (hoặc tên `--nhanh`), và chỉ khi mọi bước qua.

## 5. Luật đổi chữ (commit 3)

Luật là mẫu CÓ NEO, không thay chữ trần — `cat-luot` vừa là tên skill, vừa là tên script `scripts/cat-luot.mjs` và tên
hồ sơ `lo-trinh-cat-luot`; `dieu-phoi` vừa là tên plugin vừa là tên script `dieu-phoi.mjs` (tên script nội bộ KHÔNG đổi —
KE-HOACH mục 3). Các neo:

- tên chợ: `acceptance-gate-kit` không theo sau bởi `-` hay chữ/số (giữ `acceptance-gate-kit-tri-thuc`, kho tri thức riêng);
- tiền tố lệnh `<plugin cũ>:<lệnh cũ>` theo khoá `lenh` của `bang-ten.json`, rồi `<plugin cũ>:` còn lại → `<plugin mới>:`;
- khoá bật plugin `<plugin cũ>@`; đối số `--plugin <plugin cũ>`; chuỗi JSON `"<plugin cũ>"` trong tệp khai;
- dòng `name: <skill cũ>` trong `SKILL.md` của skill đổi tên.

Mỗi luật đếm số chỗ khớp trên toàn tập; luật 0 chỗ → dừng (bảng tên trỏ thứ không còn). Kịch bản ghi sổ
`migration/kich-ban/ket-qua/doi-chu.tsv` (luật · tệp · số chỗ). Chữ nhắc trong văn xuôi (ví dụ «skill `cat-luot`») KHÔNG đổi
— khai giới hạn.

Thước độc lập với kịch bản: áp lại đúng các luật lên bản gốc của mỗi tệp phải ra đúng bản mới (AC-4) — mọi đổi khác là
sửa tay lọt vào.

## 6. Không vá ngữ nghĩa — bảy chỗ gãy chéo đi về kho cũ

Lõi gọi thẳng bốn tệp của điều phối (`scripts/gui-tin-hieu.mjs`, `scripts/tin-hieu.mjs` import tương đối; lệnh
`acceptance-init` trỏ `${CLAUDE_PLUGIN_ROOT}/dieu-phoi/scripts/…`). Sau dọn nhà chúng gãy ở bản cài. Đổi chúng đúng tầng là
đổi mã (đi qua `resolve-plugin`, hoặc dời tệp dùng chung) — sửa ngữ nghĩa, nên thuộc kho cũ, một vòng riêng trước ngày cắt.
Kịch bản KHÔNG vá; nó in danh sách chỗ gãy chéo còn lại (đọc lại sổ tham chiếu chéo trên cây mới) vào báo cáo. Hạt giống cho
vòng kho cũ ghi ở `migration/` (không tạo ô).

## 7. Khuôn Repo Standards (commit 5)

Dòng lệnh đã chốt ở `TRANG-THAI.md`, mô tả kho:
`Claude Code plugin marketplace for an acceptance-gated feature loop: contracts, self-proving evidence, few real human decisions.`
Sau `apply`: gỡ `.claude/skills/review-change/` (nhận nó là một CỘNG; kit đã có làn xét duyệt riêng) và sửa đích `test`
của `Makefile` thành `bash tests/bo-chay.sh all`-tương đương của kit (tên lệnh chốt ở S3 theo bộ chạy thật). Không chạy
`/repo-setup:github`; không đổi `CLAUDE.md`, `.claude/settings.json` (quyền) hay CI cho điểm `doctor` — `## Language`,
`deny .env`, `doctor --min-score` để ngoài B1. Phiên bản giữ như nguồn (2.39.0 · `diagram-design` 2.7.1): số 3.0 chỉ cắt
ở mốc 3.0 (B3).

## 8. Thước và số đo

| Thước | Vật đo | Lệnh |
|---|---|---|
| Hai lần, một cây | mã commit + mã cây của hai lần chạy | `thuoc-that.mjs` |
| Đúng một chỗ | sổ kiểm kê nguồn × cây mới × bảng xếp | `kiem-cho.mjs` (gọi trong `thuoc-that.mjs`) |
| Nội dung chỉ đổi bởi luật | áp lại luật lên bản gốc | `kiem-cho.mjs` |
| Chạy thử phiên thật | `chay-thu.mjs --so` cũ/mới qua bảng tên | `thuoc-that.mjs` |
| Lớp đỏ do đổi bố cục | sáu bước bộ kiểm (B0 `chay.sh`) trên cây cũ và cây mới, tách ca đỏ (`tach.py`) | `do-lop-do.sh` → `ket-qua/lop-do.md` |

Kiểm của chính kịch bản: `don-nha.test.mjs` trên kho fixture do mã sinh (chợ hai plugin, một plugin lấy gốc làm nguồn, một
lệnh đổi tên, một con trỏ ra ngoài, một tệp tài liệu sống) — mỗi phép đo có cặp hai chiều trên cùng fixture.

Lượt đo lớp đỏ chạy khoảng 60–80 phút mỗi cây (B0: 53 + 16 phút); hai cây chạy song song, mỗi cây một `TMPDIR`. Ca `MC-11`
đỏ vì tên thư mục kho (đã biết) — cả hai cây chạy trong thư mục cùng kiểu tên để lớp «tên kho» không lẫn vào lớp «bố cục».

## 9. Ngoài vòng

Bộ kiểm xanh (B2) · cắt mốc 3.0, đẩy nhánh, chuyển Quỹ hàng (B3) · sửa bảy chỗ gãy chéo (vòng kho cũ) · đổi đường dẫn
trong tài liệu sống và trong bộ kiểm · README song ngữ, tách sử liệu khỏi `CLAUDE.md`, rà 206 hạt giống, tách nhật ký cũ,
sổ giao diện công khai · cài đặt GitHub.
