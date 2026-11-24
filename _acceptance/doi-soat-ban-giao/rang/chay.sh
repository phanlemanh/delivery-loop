#!/usr/bin/env bash
# rang/chay.sh AC-n — chạy đúng các ca của một tiêu chí trong tests/dieu-phoi/doi-soat-ban-giao.test.mjs và ĐÒI từng tên ca
# có dòng TAP «ok <số> - <tên>» khớp nguyên dòng. Mẫu lọc không khớp ca nào, ca bị bỏ qua hay đặt «todo» đều thoát 1: không
# có màu xanh suông. Bảng CA dưới là nguồn duy nhất của ánh xạ tiêu chí → tên ca. AC-9 chạy bộ kiểm vùng vật hai chiều.
set -u
AC="${1:?cách dùng: chay.sh AC-<n>}"
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
TEP="$ROOT/tests/dieu-phoi/doi-soat-ban-giao.test.mjs"
case "$AC" in
  AC-1) CA=("DS-01 khu-hoi" "DS-01-do doi-ten-truong" "DS-01-do truong-moi") ;;
  AC-2) CA=("DS-02 ma-tran" "DS-02-do bo-chieu-dinh") ;;
  AC-3) CA=("DS-03 mau-dong" "DS-03-do tep-cu") ;;
  AC-4) CA=("DS-04 chua-day" "DS-04 khong-remote" "DS-04-do bo-dieu-kien-remote" "DS-04-do khong-upstream") ;;
  AC-5) CA=("DS-05 khuyen-cho" "DS-05-do bo-chan") ;;
  AC-6) CA=("DS-06 than-lenh" "DS-06-do tra-cau-cu" "DS-06-do go-doi-soat") ;;
  AC-7) CA=("DS-07 hien-dien" "DS-07-do doc-lich-su") ;;
  AC-8) CA=("DS-08 thieu-truong" "DS-08-do bo-do-truong") ;;
  AC-9)
    VV="$ROOT/_acceptance/doi-soat-ban-giao/rang/vung-vat.mjs"
    node "$VV" --root "$ROOT" || { echo "chay.sh AC-9: vùng vật đỏ"; exit 1; }
    OUT=$(node "$VV" --root "$ROOT" --thu plugins/acceptance-gate/lib/x.cjs 2>&1); CODE=$?
    printf '%s\n' "$OUT"
    [ "$CODE" -eq 1 ] || { echo "chay.sh AC-9: chiều đỏ phải thoát 1, thoát $CODE"; exit 1; }
    printf '%s\n' "$OUT" | grep -q 'ngoài danh sách: plugins/acceptance-gate/lib/x.cjs' || { echo "chay.sh AC-9: chiều đỏ không nêu đường thử"; exit 1; }
    echo "vung-vat --thu: đỏ đúng — plugins/acceptance-gate/lib/x.cjs"
    exit 0 ;;
  *) echo "chay.sh: không có tiêu chí $AC"; exit 2 ;;
esac
[ -f "$TEP" ] || { echo "chay.sh $AC: chưa có tệp ca $TEP"; exit 1; }
MAU=$(printf '%s\n' "${CA[@]}" | node -e 'const l=require("fs").readFileSync(0,"utf8").trim().split("\n");process.stdout.write("^("+l.map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")+")$")')
OUT=$(cd "$ROOT" && node --test --test-reporter=tap --test-name-pattern="$MAU" "$TEP" 2>&1); CODE=$?
printf '%s\n' "$OUT"
[ "$CODE" -eq 0 ] || { echo "chay.sh $AC: tệp ca thoát $CODE"; exit 1; }
for k in fail skipped todo; do
  printf '%s\n' "$OUT" | grep -qx "# $k 0" || { echo "chay.sh $AC: thiếu dòng «# $k 0»"; exit 1; }
done
for c in "${CA[@]}"; do
  printf '%s\n' "$OUT" | grep -qE "^ok [0-9]+ - ${c}\$" || { echo "chay.sh $AC: ca «$c» thiếu dòng ok"; exit 1; }
done
echo "chay.sh $AC: đạt (${#CA[@]} ca)"
