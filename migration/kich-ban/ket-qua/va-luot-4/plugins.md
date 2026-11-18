# Nhóm plugins — mục vá B2 lượt 4 (bộ plugins · hooks · workflows)

**Vá:** `va.json` (cùng thư mục), 76 mục, 14 tệp. Kiểm `so_lan` trên một bản sao MỚI của B5: `ap 76 muc, lech 0`; chạy lại trọn ba bộ trên bản sao ấy (plugins chạy ba vùng `--manh vung:1..3`).

**Số khoá (so khoá PASS ở `out/A2` với lượt sau vá):** trước khi vá thiếu 154 khoá (hooks 8 · plugins 105 · workflows 41). Sau khi vá thiếu 71 (plugins 47 · workflows 24 · hooks 0). **83 khoá được gỡ, 0 khoá mới thừa.**

Ghi chú môi trường đo: bản sao phải có `origin/main`. P150 và P196 cần nó. Tôi đã fetch `refs/remotes/origin/*` từ B5 vào bản sao. Cây B5 vốn có sẵn ref này.

## Bảng theo tệp

Số ca là số khoá. Mỗi ca của các tệp `.test.mjs` tính hai khoá: khoá của ca và khoá bọc «ca … (hồ sơ …)» trong run-tests.sh.

| tệp | đỏ trước | đỏ sau | ca còn đỏ · lớp · một câu |
|---|---|---|---|
| tests/workflows/carry-plan.test.mjs | 24 | 24 | DV7-1…DV11 · **kho-cu** · `plugins/feature-loop/scripts/carry-plan.mjs:38`: khi vắng `--ag-root`, script suy gốc từ `HERE/../..` rồi tìm `lib/evidence-core.cjs`, ra `plugins/lib/…`. Test không truyền `--ag-root`, nên cả tệp chết ngay ở DV7. |
| tests/workflows/doc-ghi-troi.test.mjs | 15 | 0 | — (bản sao đột biến DG6 trong thư mục tạm chỉ có `lib/`) |
| tests/workflows/gen-red-probe.mjs (ca MM12 của measure-law-mutants) | 1 | 0 | — (đưa lại đường cũ trong văn bản sinh, để khớp fixture đã commit ở `_acceptance/matrix-measure-law/evidence/`) |
| tests/workflows/ui-check-tuan-tu.test.mjs | 1 | 0 | — (`--ag-root` trỏ `plugins/acceptance-gate`) |
| tests/hooks/ruling-truoc-khi-xoa.test.mjs (RT-AC6-*, RT-node) | 8 | 0 | — (`CLAUDE_PLUGIN_ROOT` = gốc plugin, cả cây thật lẫn bản sao đột biến) |
| tests/plugins/run-tests.sh (ca viết thẳng trong tệp) | 37 | 9 | P08 · P161 · P164 · P169 · P188 · P193 · P196 · P91 · P93, xem bảng dưới |
| tests/plugins/plugin-declare.test.mjs | 26 | 24 | PD1 · 1c · 2 · 2b · 2c · 3 · 4 · 4b · 5 · 6 · 8 · 9b · **kho-cu** · `plugins/acceptance-gate/scripts/plugin-declare.mjs:15` có `DEFAULT_MARKETPLACE = HERE/../.claude-plugin/marketplace.json`, ra `plugins/acceptance-gate/.claude-plugin/`. PD9 đã gỡ. |
| tests/plugins/lan-v.test.mjs | 2 | 0 | — (kho thử tiêu thụ giữ bố cục `scripts/`) |
| tests/plugins/ntr-observed.test.mjs | 2 | 0 | — |
| tests/plugins/vao-co-o.test.mjs | 4 | 0 | — (bản sao plugin có bố cục gốc plugin) |
| tests/plugins/design-pass-nac.test.mjs | 6 | 2 | DP11 · **kho-cu** · `plugins/acceptance-gate/skills/design-pass/SKILL.md:188-190`: bảng khai `REACTION-DEFAULT-SITES` còn ghi `skills/design-pass/SKILL.md` và `feature-loop/skills/feature-loop/SKILL.md`. |
| tests/plugins/lenh-bam-duoc.test.mjs | 4 | 2 | LB1 · **kho-cu** · bảng `COMMAND-NAMES` trong `plugins/acceptance-gate/skills/acceptance/references/human-facing-language.md`: cột một còn tên cũ (cat-luot, mo-dot, dong-dot, xem, tiep-tuc, ban-giao), trong khi cột lệnh đã sang tên mới. |
| tests/plugins/ra-co-ten.test.mjs | 12 | 4 | RT13 · RT18 · **kho-cu** (hồ sơ `_acceptance/ra-co-ten-lam-va-trao/`, nằm ngoài tests). Với RT13: `evals.yaml` `paths:` và khối `BO-DOC-KHAI-GACH` còn ghi đường cũ, nên mọi tệp chứa chữ trạng thái đã ký bị gọi là tệp lạ. Với RT18: khối `LUAT-NGUONG-KHAI-GACH` của contract còn ghi `scripts/start-scan.mjs`… |
| tests/plugins/lan-may-classifier.test.mjs | 6 | 6 | LM1 · **kho-cu** · `.claude/settings.json:28` còn `Bash(node scripts/product-map.mjs --root . --check)`, trong khi config đã sang `plugins/…`. LM5 và LM8b · **kho-cu** · `_acceptance/lan-may-song-qua-bo-phan-loai/contract.md` AC-5/AC-8 khai phạm vi bằng thư mục cũ (`skills/`, `feature-loop/`, `lib/`…); `phamViTuHopDong()` đọc phạm vi từ đó. |
| tests/plugins/lop-nhin-thay.test.mjs | 6 | 0 | — (LNT10 cần sửa `tests/scripts/anh-co-that-kho.mjs`, xem lưu ý) |

### Các ca còn đỏ trong run-tests.sh

| ca | lớp | một câu |
|---|---|---|
| P08 | kho-cu | `plugins/acceptance-gate/commands/acceptance-init.md` trỏ `${CLAUDE_PLUGIN_ROOT}/dieu-phoi/scripts/{hinh-dang,cau-hinh,dot}.mjs`. Phần vá đường gốc plugin và đếm skills đã áp, nên ca nay chỉ còn đỏ vì đúng ba con trỏ này. |
| P164 | kho-cu | Cùng gốc với carry-plan: `carry-plan.mjs:38` khi vắng `--ag-root`. |
| P169 | kho-cu | `_acceptance/stop-patching-law/make-record.mjs:81` đọc `feature-loop/skills/feature-loop/SKILL.md`, đường cũ. |
| P188 | kho-cu | Manifest `GATE-INVITE-SITES` trong `human-facing-language.md` còn ghi đường cũ (`skills/acceptance/SKILL.md`…). |
| P193 | kho-cu | Manifest `GATE-ONESHOT-SITES` (cùng tệp) còn ghi đường cũ (`commands/approve.md`…). |
| P196 | kho-cu | `plugins/diagram-design/skills/diagram-design/LOCAL-PATCHES.md` bị đổi trong đợt chuyển nhà, nên tree-hash ≠ NOTICE và «hash đổi mà version giữ 2.7.1». Phần vá (PD → `plugins/diagram-design`, source marketplace `./plugins/diagram-design`) đã áp. |
| P91 | ngu-nghia | Con trỏ trong tài liệu tính từ gốc plugin (`skills/acceptance/references/…`), nhưng bản sao dựng MỘT vòng chép chung cho SITES (gốc kho) và đích con trỏ (gốc plugin) bằng cùng `rel`. Vá đường không tách được. Đề xuất: tách hai vòng chép (đích chép vào `tmp/plugins/acceptance-gate/<h>`) và kiểm `base/"plugins/acceptance-gate"/h`. |
| P93 | ngu-nghia | `SKIP_TOP` có «plugins» (mục AC-10 khai; ở cây cũ là thư mục không tồn tại), nay nuốt toàn bộ sản phẩm. Bộ đếm theo `parts[0]` cũng không khớp `EXPECT_DIRS` nhiều cấp. Đề xuất: bỏ «plugins» khỏi `SKIP_TOP` và đếm theo tiền tố đường. |
| P161 | ngu-nghia | Bánh cóc assert so NGUYÊN VĂN với run-tests.sh tại BASE (bố cục cũ). Mọi assert đổi đường (bước 6 đổi, ví dụ `root / "scripts/gate-card.js"`) bị coi là đã gỡ. Đề xuất: chuẩn hoá đường theo bảng dời trước khi so, hoặc khai các assert ấy vào `tests/plugins/asserts-da-go.txt`. Các vá khác của P161 (iso_new/iso_old/copy_lib_now) đã áp. |

## Lưu ý cho người gộp

- **Mục chạm tệp ngoài ba bộ của nhóm:** `tests/scripts/anh-co-that-kho.mjs` (1 mục, `so_lan` 2). Mục này đưa lại `path.join(banCu, 'scripts', 'gate-card.js')`: `banCu` là bản `git archive` của commit lịch sử, bố cục cũ. LNT10 cần nó. Nếu nhóm scripts cũng vá tệp này thì bỏ một bản.
- Một số mục không phải đổi chuỗi đường một-một mà bọc thêm một đoạn đường, ví dụ `pluginRoot = ROOT` → `path.join(ROOT, 'plugins/acceptance-gate')` và `root / ct` → `root / "plugins/acceptance-gate" / ct`. Phép thử (đổi mới→cũ) cho `path.join(ROOT)`, tức đúng nghĩa đường cũ. Phép quét tự động 76 mục chỉ thấy 6 chỗ khác theo kiểu này, không chỗ nào khác về logic.
- Có hai loại vá. Loại (a) đưa lại đường cũ: bản `git archive`/`git show` của commit lịch sử (P150, P161, RT13, LNT8, anh-co-that-kho), bản sao dựng theo bố cục gốc plugin (P61/P68, P185–P187, P201, P198, P100, P95, DP10/13, LNT1, vao-co-o, plugin-declare PD9), kho thử tiêu thụ (LV5, RT2/RT15), văn sinh khớp fixture đã commit (MM12). Loại (b) đổi nốt chỗ luật bỏ sót.
- Hai mục đổi tên theo bảng tên: `LOCKED_ROAD_MAP = ["pin","unpin","undo"]` (P32), và `"dieu-phoi" in p.parts` → `"dispatch"` (P33).
