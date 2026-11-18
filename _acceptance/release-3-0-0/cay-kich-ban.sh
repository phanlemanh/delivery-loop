#!/usr/bin/env bash
# cay-kich-ban.sh — AC-4 của release-3-0-0: sáu commit dọn nhà nằm dưới nhánh mốc ĐÚNG là thứ kịch bản sinh từ nhánh chính
# kho cũ — không sửa tay lọt vào — và năm thước của B1, B2 còn xanh trên nguồn ấy.
# Chạy năm lệnh `migration/kich-ban/thuoc-that.mjs` (cần remote `kit-cu` và lệnh `claude`; ~3 phút), rút mã commit và mã cây
# mà thước in, rồi đòi commit ấy là tổ tiên của HEAD và mang đúng mã cây ấy.
# Thoát 0 đạt · 1 đỏ · 2 không đọc được ở đây (thiếu remote kit-cu, thiếu công cụ).
set -u
GOC="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "không đọc được ở đây: không phải kho git"; exit 2; }
cd "$GOC" || exit 2
git rev-parse -q --verify kit-cu/main >/dev/null || { echo "không đọc được ở đây: kho không có ref kit-cu/main"; exit 2; }
ra=""
for co in "" --phien --bo-kiem --giu-khoa --lop-do; do
  # shellcheck disable=SC2086
  r="$(node migration/kich-ban/thuoc-that.mjs $co 2>&1)"; m=$?
  printf '%s\n' "$r" | grep -E '^(AC-[0-9]+|AC-[0-9]+ \(B2\)) đạt|không đọc được|^nguồn:' | cut -c1-200
  if [ "$m" = 2 ]; then echo "không đọc được ở đây: thuoc-that ${co:-(không cờ)} thoát 2"; exit 2; fi
  if [ "$m" != 0 ]; then echo "ĐỎ: thuoc-that ${co:-(không cờ)} thoát $m"; printf '%s\n' "$r" | tail -5; exit 1; fi
  ra="$ra
$r"
done
dong="$(printf '%s\n' "$ra" | grep -m1 '^AC-1 đạt: hai lần chạy cùng commit ')"
sha="$(printf '%s\n' "$dong" | awk '{print $8}')"; cay="$(printf '%s\n' "$dong" | awk '{print $11}')"
case "$sha" in [0-9a-f][0-9a-f][0-9a-f][0-9a-f]*) ;; *) echo "ĐỎ: không rút được mã commit dọn nhà từ thước"; exit 1 ;; esac
if ! git merge-base --is-ancestor "$sha" HEAD 2>/dev/null; then echo "ĐỎ: commit dọn nhà kịch bản sinh ($sha) không phải tổ tiên của HEAD — nhánh mốc không đứng trên cây kịch bản"; exit 1; fi
co="$(git rev-parse "$sha^{tree}")"
[ "$co" = "$cay" ] || { echo "ĐỎ: mã cây lệch — thước in $cay, commit $sha mang $co"; exit 1; }
echo "cay-kich-ban: đạt — commit dọn nhà $sha (cây $cay) là tổ tiên của HEAD, năm thước thoát 0"
