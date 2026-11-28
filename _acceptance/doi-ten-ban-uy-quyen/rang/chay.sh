#!/usr/bin/env bash
# rang/chay.sh AC-n — chạy đúng các ca TA-… của một tiêu chí trong tests/dieu-phoi/uy-quyen.test.mjs và ĐÒI từng tên ca có
# dòng TAP «ok <số> - <tên>» khớp nguyên dòng; rồi gọi lại rang của hồ sơ đã ký giam-sat-doc-ban-uy-quyen (DL6) cho các tiêu
# chí của nó mà tiêu chí này dựa vào — ca UQ-… nay mang tên mới, nên mười tiêu chí DL6 phải đứng lại trên cây này. Mẫu lọc
# không khớp ca nào, ca bị bỏ qua hay đặt «todo», hay một lần gọi DL6 thoát khác 0 đều thoát 1: không có màu xanh suông.
# Bảng dưới là nguồn duy nhất của ánh xạ tiêu chí → tên ca và tiêu chí DL6.
set -u
AC="${1:?cách dùng: chay.sh AC-<n>}"
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
TEP="$ROOT/tests/dieu-phoi/uy-quyen.test.mjs"
DL6="$ROOT/_acceptance/giam-sat-doc-ban-uy-quyen/rang/chay.sh"
CA=()
case "$AC" in
  AC-1) CA=("TA-01 bang-ten" "TA-01 vi-phan-truoc-vong" "TA-01-do them-ten" "TA-01-do lech-cau"); DL6_AC=(AC-2 AC-4) ;;
  AC-2) CA=("TA-02 ma-tran-ten-cu" "TA-02 kho-dl6" "TA-02-do bo-bang-ten-cu" "TA-02-do doi-cheo"); DL6_AC=() ;;
  AC-3) DL6_AC=(AC-3 AC-2) ;;
  AC-4) CA=("TA-04 truoc-vong" "TA-04-do them-khoa"); DL6_AC=(AC-5) ;;
  AC-5) DL6_AC=(AC-1) ;;
  AC-6) DL6_AC=(AC-6 AC-7 AC-8 AC-9 AC-10) ;;
  AC-7) CA=("TA-07 the-nghia" "TA-07 dem-nghia" "TA-07-do bo-nghia"); DL6_AC=() ;;
  *) echo "chay.sh: không có tiêu chí $AC"; exit 2 ;;
esac
[ -f "$TEP" ] || { echo "chay.sh $AC: chưa có tệp ca $TEP"; exit 1; }
if [ "${#CA[@]}" -gt 0 ]; then
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
fi
for d in "${DL6_AC[@]+"${DL6_AC[@]}"}"; do
  [ -f "$DL6" ] || { echo "chay.sh $AC: thiếu rang của DL6 $DL6"; exit 1; }
  bash "$DL6" "$d" || { echo "chay.sh $AC: rang DL6 $d không đạt"; exit 1; }
done
echo "chay.sh $AC: đạt (${#CA[@]} ca TA · DL6 ${DL6_AC[*]+"${DL6_AC[*]}"})"
