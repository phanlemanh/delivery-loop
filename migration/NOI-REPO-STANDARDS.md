# Repo Standards ↔ delivery-loop — ranh giới và điểm nối

Đo 12/11/2026 trên Mac Studio: Repo Standards ở thẻ `repo-setup-v0.5.0` (`4dc53e0`, bản kéo sạch ở thư mục tạm); cây kho
này là `chuyen-nha` `1f350274` = kit `909dffd8` + `migration/`. Mọi lệnh chạy trên một bản sao bằng `git archive`, chế độ
thử không ghi. Chủ kho hỏi: «Kiểm xem repo standards hoạt động phải nối được với delivery-loop, xác định ranh giới và điểm
nối.»

## Kết luận

**Hai bên không gọi nhau lúc chạy.** `repo-setup` không có móc và chỉ chạy khi được gọi (README của nó tự khai «dừng ở
bước dựng kho»); kit hôm nay không nhắc Repo Standards ở chỗ nào (`git grep` trên `909dffd8`: 0 tệp). Chúng nối với nhau
qua **tệp trong kho** và qua **lời trỏ trong README**, không qua mã.

**Chia vai:** Repo Standards dựng và chấm **khung** của kho (bố cục, tệp khai plugin, công cụ phiên bản, tệp cấu hình chung,
điểm `doctor`). Kit sở hữu **vòng tính năng và cổng** (skill, lệnh, móc, bộ kiểm, CI `gate.yml`, luật trong `CLAUDE.md`,
cách phát hành và CHANGELOG, cài đặt GitHub). Ở mọi chỗ chồng nhau, kit thắng; khuôn chỉ được thêm tệp khi không đè luật
của kit.

## Ranh giới — ai sở hữu gì

| Vùng | Repo Standards làm gì | Kit làm gì | Chỗ va |
|---|---|---|---|
| Bố cục `plugins/<tên>/`, tệp khai chợ | Định chuẩn, chấm `plugin_source_not_root`; coi tệp khai là của kho (`user_owned`) | Sở hữu nội dung; B1 dời vào bố cục | Hôm nay trượt: lõi lấy cả kho làm nguồn |
| `tools/plugin_lint.py`, `tools/bump_version.py` | Sinh một lần | Dùng như **lớp nhập từ ngoài**: không sửa tay, nhận bản mới bằng cách chạy lại `apply` ở thẻ mới | Kit phải chọn `plugin_versioning` (lockstep hay independent — hàng B10) |
| `Makefile` | Sinh `setup · lint · test · check · validate · bump` | Đích `test` phải viết lại để trỏ vào bộ chạy kiểm của kit — khuôn gọi `tests/run.sh`, kit không có tệp này | Sau khi sửa, tệp lệch khỏi khuôn: lần `apply` sau báo «conflict», không đè |
| `.editorconfig`, dòng trộn vào `.gitignore`, `.gitattributes` | Sinh, trộn | Nhận | Không va |
| CI | Bỏ qua `ci.yml` vì kit đã có `gate.yml` | Sở hữu `gate.yml` | `plugin_ci_validates` trượt tới khi kit thêm bước `claude plugin validate` + `plugin_lint.py` vào `gate.yml` |
| `.claude/settings.json` | Chấm `agent_permissions`: chỉ đòi một `deny` có `.env` | Sở hữu (khai plugin, quyền chạy kiểm) | Khuôn mẫu còn `deny Edit(./.github/workflows/**)` — **không nhận**: vòng của kit sửa `gate.yml` (A1 vừa sửa) |
| `CLAUDE.md`, luật ngôn ngữ | Chấm `language_policy`: chỉ đòi một tiêu đề `## Language` | Sở hữu nội dung | Mẫu của khuôn đòi commit, CHANGELOG, tên tệp bằng tiếng Anh — trái với điều đã chốt (giữ tên script, chữ người đọc tiếng Việt). Kit tự viết mục ấy theo luật của mình; phép chấm vẫn đạt |
| Phát hành, CHANGELOG | `bump_version.py` đổi số mọi tệp khai, chèn mục dưới `## Unreleased` | Nghi thức mốc của kit: hồ sơ mốc, năm dòng số, CHANGELOG khuôn «## 2.38.1 — 10/11/2026» | Dùng công cụ cho phần đổi số; CHANGELOG giữ khuôn của kit |
| Skill `review-change` | Sinh vào `.claude/skills/` | Đã có làn xét duyệt riêng (S4 review/refute, code review) | Câu mở R4 — khuyến nghị không nhận (trùng vai) |
| **Cài đặt GitHub** | `/repo-setup:github` → `tools/github_setup.py` (mức `team`): **luôn đặt chỉ gộp dồn** (squash-only), thêm ruleset đòi code-owner review | **Cấm gộp dồn** — gộp dồn làm mất commit chữ ký Cổng Bằng chứng và làm phép đo ký→gộp ra «chưa đo» | **Va cứng.** Kho này ở mức `starter`, không chạy `/repo-setup:github` |
| Từ điển miền, wiki, `.env.example`, deploy | Tự khai «không áp» cho kho plugin | Kit có `CONTEXT.md`, ADR, plugin tri thức | Không va |

## Điểm nối

| # | Điểm nối | Chiều | Khi nào | Trạng thái 12/11 |
|---|---|---|---|---|
| P1 | `apply.py --preset claude-plugin --level starter --adopt` gọi từ bản kéo tại thẻ `repo-setup-v0.5.0` | RS → kho | Một lần, trong kịch bản B1, sau bước đổi bố cục (chốt 11/11) | Chạy thử không ghi: tạo 5 tệp (`.claude/skills/review-change/SKILL.md`, `.editorconfig`, `Makefile`, `tools/bump_version.py`, `tools/plugin_lint.py`), trộn 2 (`.gitattributes`, `.gitignore`), bỏ qua 6, trùng 5 (`.claude/settings.json`, `.nvmrc`, `CLAUDE.md`, `LICENSE`, `README.md`) |
| P2 | `.repo-setup.json` — khuôn, mức, biến, mã băm từng tệp khuôn đã tạo | RS ghi, cả hai đọc | Lần áp thật | Chưa có. Đây là tệp **tự xưng** của lớp Repo Standards trong kho: `doctor` đọc nó để biết loại kho và mức; lần `apply` sau đọc nó để biết tệp nào do khuôn tạo |
| P3 | `doctor` chấm kho | RS đọc kho | Thước R2 của B1; về sau khi kho muốn | **55/100** trên cây hôm nay: đạt 10, trượt 10, 8 mục không áp |
| P4 | Đích `make test` → bộ chạy kiểm của kit | Kho tự nối | B1 | Phải viết lại — khuôn trỏ `tests/run.sh` |
| P5 | Bước `claude plugin validate` + `plugin_lint.py` trong `gate.yml` | Kho tự nối | B1 hoặc B2 | Chưa có. Trùng lớp 1 của `chay-thu-phien/` — một bên gọi bên kia, đừng chạy hai lần |
| P6 | Lời trỏ từ Repo Standards sang kit | RS → kit | Ngày cắt | 2 README của Repo Standards trỏ `phanlemanh/acceptance-gate-kit`, và **một ca kiểm của nó ghim tên cũ** (`tests/run.sh:552`, `grep -q 'acceptance-gate-kit' README.md`). Đổi README sang `delivery-loop` mà không đổi ca thì kho ấy đỏ — việc ở kho Repo Standards, không phải ở kho này |
| P7 | Nhận bản Repo Standards mới | RS → kho | Theo mốc, như kho tiêu thụ nhận kit | Chưa có nghi thức. `apply` chỉ thêm tệp, không cập nhật tệp đã có: bản mới của `plugin_lint.py` sẽ báo «conflict». Đường đúng tầng: so mã băm trong `.repo-setup.json` để biết tệp còn nguyên khuôn hay không, rồi mới thay |
| P8 | Cùng có mặt ở kho tiêu thụ ứng dụng | — | Khi một kho bật cả hai | Tên plugin không trùng (`repo-setup` so với 6 plugin của kit), lệnh ở hai không gian tên khác nhau. Trùng **động từ**: skill `wiki-ingest`/`wiki-health` của khuôn ứng dụng so với `knowledge:ingest`/`knowledge:health` sau khi đổi tên (`KE-HOACH.md` mục 6.3 đã ghi) |

## Mười mục `doctor` trượt hôm nay — ai giải

| Mục | Giải ở đâu |
|---|---|
| `plugin_source_not_root` | B1 — đổi bố cục |
| `plugin_description_short` (84 582 và 34 579 ký tự) | Mốc 2.39 ở kho cũ |
| `gitignore` (thiếu `.env`) | Mốc 2.39 · dòng trộn của P1 |
| `plugin_versions` (`diagram-design` 2.7.1, năm cái kia 2.38.1) | Quyết B10: lên chung 3.0 (lockstep) hay khai `plugin_versioning=independent` trong `.repo-setup.json` |
| `task_runner`, `plugin_bump_tool`, `editorconfig` | P1 |
| `plugin_ci_validates` | P5 |
| `agent_permissions` | Kit thêm `deny Read(./.env*)` vào `.claude/settings.json` của mình — không nhận `deny` sửa quy trình CI |
| `language_policy` | Kit thêm `## Language` vào `CLAUDE.md`, nội dung theo luật đã chốt của kit — sửa `CLAUDE.md` là đổi luật kho, chủ kho duyệt |

Sau B1, kỳ vọng còn trượt 0–1 mục (`plugin_versions` tuỳ quyết B10). Thước R2 của bảng khác biệt nên đọc theo điểm
`doctor` (0–100) thay cho «9/20 → 14/20 mục» ghi 11/11 trên một bản sao khác.

## Điều cần chủ kho quyết — đều ở Cổng Phạm vi B1, không thêm lượt gọi

1. **Không chạy `/repo-setup:github` ở kho này** (va cứng với luật cấm gộp dồn) — khuyến nghị: ghi thành luật của đợt, và
   nêu với Repo Standards rằng `github_setup.py` cần cho chọn kiểu gộp.
2. Có nhận skill `review-change` không (R4) — khuyến nghị: không.
3. Nội dung mục `## Language` trong `CLAUDE.md`.
4. `plugin_versioning`: lockstep 3.0 cho cả sáu, hay independent (B10).
5. Có đặt `doctor --min-score` vào CI không — khuyến nghị: chưa; đọc ở thước R2 trước, đặt làm cổng khi đã ổn định (là
   CỘNG).
