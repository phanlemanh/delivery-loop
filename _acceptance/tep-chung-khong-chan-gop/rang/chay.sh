#!/usr/bin/env bash
# Răng của hồ sơ tep-chung-khong-chan-gop — lệnh chấm theo luật lệnh hồ sơ (tệp trong thư mục hồ sơ, không khoá nào
# trong _acceptance/config.yaml). Dùng: bash _acceptance/tep-chung-khong-chan-gop/rang/chay.sh <TCG-n>
# Chạy đúng các ca node:test mang tiền tố của nhóm, in dòng TAP, rồi phán: «# pass n» đúng số của bảng (ma trận viết
# trước), «# fail 0», và mỗi ca trong bảng có dòng «ok … - <tên>». Phán quyết không lấy từ mã thoát. Đường suy từ vị
# trí tệp này.
set -u
NHOM="${1:-}"
DAY="$(cd "$(dirname "$0")" && pwd)"
GOC="$(cd "$DAY/../../.." && pwd)"
T="$GOC/tests/scripts"
case "$NHOM" in
  TCG-1)  TEP=tcg-ban-do;      CA="TCG-1 TCG-1-bat" ;;
  TCG-2)  TEP=tcg-ban-do;      CA="TCG-2a TCG-2b TCG-2c TCG-2d TCG-2-doi-chung" ;;
  TCG-3)  TEP=tcg-ban-do;      CA="TCG-3-1 TCG-3-2 TCG-3-3 TCG-3-4" ;;
  TCG-4)  TEP=tcg-ban-do;      CA="TCG-4-mot-ban TCG-4-bat TCG-4-tat" ;;
  TCG-5)  TEP=tcg-ban-do;      CA="TCG-5-dang TCG-5-check TCG-5-bat TCG-5-dieu-phoi TCG-5-cu" ;;
  TCG-6)  TEP=tcg-ban-do;      CA="TCG-6-bat TCG-6-tat" ;;
  TCG-7)  TEP=tcg-lenh-ho-so;  CA="TCG-7-luat TCG-7-duong" ;;
  TCG-8)  TEP=tcg-lenh-ho-so;  CA="TCG-8-1 TCG-8-2 TCG-8-3 TCG-8-4" ;;
  TCG-9)  TEP=tcg-so-gioi-han; CA="TCG-9-them TCG-9-slug TCG-9-lai TCG-9-rong TCG-9-moc TCG-9-p179" ;;
  TCG-10) TEP=tcg-mutants;     CA="TCG-10-M0 TCG-10-bo-kiem-chi-muc TCG-10-bo-kiem-ignore TCG-10-tat-di-nhanh-moi TCG-10-khoa-sai-la-tat TCG-10-them-vo-dieu-kien TCG-10-quet-tra-da-xoa TCG-10-quet-doc-khoa-rieng TCG-10-bo-so-goc TCG-10-ghi-de-hang-cu TCG-10-them-khi-du TCG-10-dem-nham-slug TCG-10-moc-moi-tep TCG-10-day-khi-khong-doi TCG-10-day-nhanh-mac-dinh TCG-10-im-chu-thich TCG-10-im-tai-lieu TCG-10-im-ho-so-rong" ;;
  TCG-11) TEP=tcg-ban-do;      CA="TCG-11-day TCG-11-lai TCG-11-doi TCG-11-khoa TCG-11-vang TCG-11-guide" ;;
  *) echo "chay.sh: nhóm lạ «$NHOM» — TCG-1 … TCG-11" >&2; exit 2 ;;
esac
F="$T/$TEP.test.mjs"
[ -f "$F" ] || { echo "chay.sh: thiếu tệp ca $F" >&2; exit 2; }
N=0; for _ in $CA; do N=$((N + 1)); done
out="$(node --test --test-reporter=tap --test-name-pattern="^${NHOM}(?![0-9])" "$F" 2>&1)"
printf '%s\n' "$out" | grep -E '^(not )?ok [0-9]+ - |^# (pass|fail) |^ +(error|expected|actual|FAIL):' | head -n 200
sai=0
printf '%s\n' "$out" | grep -qxF "# pass $N" || { echo "chay.sh: $NHOM cần «# pass $N»" >&2; sai=1; }
printf '%s\n' "$out" | grep -qxF "# fail 0" || { echo "chay.sh: $NHOM có ca hỏng" >&2; sai=1; }
for c in $CA; do
  printf '%s\n' "$out" | grep -qE "^ok [0-9]+ - ${c}( |\$)" || { echo "chay.sh: ca không xanh hoặc không chạy: $c" >&2; sai=1; }
done
[ "$sai" = 0 ] && echo "chay.sh: $NHOM xanh — $N/$N ca" || exit 1
