---
slug: bang-chung-cu-theo-dau-vao
at: 2026-11-26T12:37:15.468Z
sha: 8817a5bf9e3df3ae4a3e558c37715002bc830c7c
nen: do
cong_cu: xanh
suite: do
luoi: xanh
engine: xanh
---

## Dòng đỏ

- nen suite: DO SAN executors.test.scripts_mjs_1 ma 1
- nen suite: DO SAN executors.test.plugins_vung_1 ma 1
- nen suite: DO SAN executors.script.product_map ma 1

## Dòng vàng

- nen suite: TEP CUA VONG _acceptance/bang-chung-cu-theo-dau-vao/figures/mot-vi-tu.html (khong tinh)
- nen suite: TEP CUA VONG _acceptance/bang-chung-cu-theo-dau-vao/figures/mot-vi-tu.png (khong tinh)
- nen suite: TEP CUA VONG _acceptance/bang-chung-cu-theo-dau-vao/gap-probe.md (khong tinh)

## Gỡ trong vòng (máy, 26/11 ~12:45Z)

Ba dòng đỏ ở trên cùng một nguyên nhân của CHÍNH vòng: hồ sơ nháp mới làm `PRODUCT-MAP.md` và `LO-TRINH.html` lệch
(`product_map` đỏ trực tiếp; ca `KT-8` của `scripts_mjs_1` và `P122`, `P126` của `plugins_vung_1` đọc `--check` của bản đồ).
Vẽ lại bản đồ (`product-map.mjs --root .`) rồi chạy lại đúng ba ca: `--check` thoát 0, `kho-tri-thuc-va-lint.test.mjs`
«mọi ca xanh», `ONLY_BLOCK=P122` và `ONLY_BLOCK=P126` đều PASS. Không lượt đo dài nào thêm. Nền hạ tầng vì vậy xanh trên Node 24.
