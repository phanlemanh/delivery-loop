#!/usr/bin/env bash
# rang/chay.sh AC-n — chạy đúng các ca của một tiêu chí trong tests/dieu-phoi/uy-quyen.test.mjs và ĐÒI từng tên ca có dòng
# TAP «ok <số> - <tên>» khớp nguyên dòng. Mẫu lọc không khớp ca nào, ca bị bỏ qua hay đặt «todo» đều thoát 1: không có màu
# xanh suông. Bảng CA dưới là nguồn duy nhất của ánh xạ tiêu chí → tên ca.
set -u
AC="${1:?cách dùng: chay.sh AC-<n>}"
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
TEP="$ROOT/tests/dieu-phoi/uy-quyen.test.mjs"
case "$AC" in
  AC-1) CA=("UQ-01 nhanh-chinh" "UQ-01 pr-tu-them" "UQ-01 xoa-tep" "UQ-01 lay-ve-hong" "UQ-01 lay-ve-hong-khong-tep" "UQ-01-do doc-cay-lam-viec") ;;
  AC-2) CA=("UQ-02 ma-tran" "UQ-02-do bo-ten") ;;
  AC-3) CA=("UQ-03 ma-tran" "UQ-03-do bo-qua-muc-cam") ;;
  AC-4) CA=("UQ-04 khoan-dung" "UQ-04-do ban-la-van-nhan") ;;
  AC-5) CA=("UQ-05 chieu-im" "UQ-05 khong-remote" "UQ-05 lay-ve-hong" "UQ-05 gop-khong-co" "UQ-05-do them-khoa") ;;
  AC-6) CA=("UQ-06 ghi-truoc" "UQ-06 monitor" "UQ-06 so-hong" "UQ-06-do bo-ghi") ;;
  AC-7) CA=("UQ-07 gop" "UQ-07 ma-tran-thieu" "UQ-07 nha-khoa" "UQ-07-do bo-tu-merge" "UQ-07-do nha-khoa-ngoai-finally") ;;
  AC-8) CA=("UQ-08 vung-cam-pr" "UQ-08-do bo-vung-cam") ;;
  AC-9) CA=("UQ-09 hoan-vi" "UQ-09 cap-theo-thu-tu" "UQ-09-do bo-kiem-hoan-vi") ;;
  AC-10) CA=("UQ-10 the" "UQ-10 dem" "UQ-10 xem-co-tep" "UQ-10-do hoi-them") ;;
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
