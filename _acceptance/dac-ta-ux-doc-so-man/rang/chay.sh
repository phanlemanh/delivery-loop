#!/usr/bin/env bash
# rang/chay.sh AC-n — chạy đúng các ô của một tiêu chí trong tests/scripts/so-man.test.mjs (bảng O_TIEU_CHI ở đầu tệp
# ca là nguồn duy nhất của ánh xạ ô → tiêu chí) và đòi từng ô có dòng «PASS: <ô>» khớp NGUYÊN DÒNG: «PASS: K1» không
# được thoả bởi «PASS: K10». AC-9 chạy thêm tệp ca UX cũ; AC-10 chạy thêm một lượt không lọc và đòi «số ca chạy: 64».
set -u
AC="${1:?cách dùng: chay.sh AC-<n>}"
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
CA="$ROOT/tests/scripts/so-man.test.mjs"
O=$(node -e '
const t = require("fs").readFileSync(process.argv[1], "utf8");
const m = t.match(new RegExp("\x27" + process.argv[2] + "\x27: \\[([^\\]]*)\\]"));
if (!m) { process.stderr.write("chay.sh: không thấy " + process.argv[2] + " trong O_TIEU_CHI\n"); process.exit(2); }
process.stdout.write(m[1].replace(/[\x27\s]/g, ""));
' "$CA" "$AC") || exit 2
OUT=$(SO_MAN_CASES="$O" node "$CA"); CODE=$?
printf '%s\n' "$OUT"
[ "$CODE" -eq 0 ] || { echo "chay.sh $AC: tệp ca thoát $CODE"; exit 1; }
printf '%s\n' "$OUT" | grep -qE '^[0-9]+ passed, 0 failed$' || { echo "chay.sh $AC: thiếu dòng «0 failed»"; exit 1; }
for o in ${O//,/ }; do
  printf '%s\n' "$OUT" | grep -qx "PASS: $o" || { echo "chay.sh $AC: ô $o thiếu dòng «PASS: $o»"; exit 1; }
done
if [ "$AC" = "AC-9" ]; then
  node "$ROOT/tests/plugins/ux-spec.test.mjs" || { echo "chay.sh AC-9: tệp ca UX đỏ"; exit 1; }
fi
if [ "$AC" = "AC-10" ]; then
  ALL=$(node "$CA"); CODE=$?
  printf '%s\n' "$ALL" | grep -x 'số ca chạy: 64' || { echo "chay.sh AC-10: lượt không lọc thiếu «số ca chạy: 64»"; exit 1; }
  [ "$CODE" -eq 0 ] || { echo "chay.sh AC-10: lượt không lọc thoát $CODE"; exit 1; }
fi
echo "chay.sh $AC: đạt (${O})"
