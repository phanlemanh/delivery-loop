#!/usr/bin/env bash
# Bộ đo của hồ sơ bang-chung-cu-theo-dau-vao. `chay.sh AC-n`.
# AC-1…AC-6: chạy đúng các ca BC-<n> của tệp ca rồi ghim số ca viết trước, «# fail 0» và dòng ok của từng ca theo TÊN —
# phán quyết không lấy từ mã thoát của node. AC-7: rang/ac7.mjs, chạy xuôi (phải 0) rồi chiều đỏ (phải 1, nêu đường thử).
# Mọi đường suy từ vị trí tệp này; không dựng gì từ merge-base với origin/main.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../../.." && pwd)"
CA_KIT="$ROOT/tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs"
CA_GOC="$HERE/ban-goc.test.mjs"   # ca dựa vào bản gốc vòng 8817a5bf — chỉ chạy ở lượt chấm, không vào bộ kiểm của kit
CA="$CA_KIT"
AC="${1:-}"

ghim() { # <mẫu tên> <số ca> <tên ca>...   (tệp ca: biến CA)
  local mau="$1" n="$2"; shift 2
  local out rc
  out="$(cd "$ROOT" && node --test --test-reporter=tap --test-name-pattern="$mau" "$CA" 2>&1)"; rc=$?
  printf '%s\n' "$out" | grep -E '^(not )?ok [0-9]+ - |^# (pass|fail) '
  [ "$rc" -eq 0 ] || { echo "$AC: node --test thoát $rc"; exit 1; }
  printf '%s\n' "$out" | grep -qxF "# pass $n" || { echo "$AC: số ca đạt khác $n (ma trận viết trước)"; exit 1; }
  printf '%s\n' "$out" | grep -qxF "# fail 0" || { echo "$AC: có ca đỏ"; exit 1; }
  local c
  for c in "$@"; do
    printf '%s\n' "$out" | grep -qE "^ok [0-9]+ - $(printf '%s' "$c" | sed 's/[][\.*^$/()+?{}|]/\\&/g')\$" || { echo "$AC: thiếu dòng ok của ca «$c»"; exit 1; }
  done
  echo "$AC: đạt — $n ca"
}

case "$AC" in
  AC-1) ghim '^BC-1( |-)' 3 \
          'BC-1 chỉ T1 đổi → mở PR' \
          'BC-1-do tệp ngoài T1 → thoát 2' \
          'BC-1-doi-chung không khai T1 → LO-TRINH.html vẫn cũ' ;;
  AC-2) ghim '^BC-2( |-)' 4 \
          'BC-2 ngoài paths khi bật → mở PR' \
          'BC-2-do trong paths → thoát 2' \
          'BC-2-khong-ap eval máy thiếu paths → giữ luật cũ' \
          'BC-2-doi-chung cây bằng pin → không thoát 2' ;;
  AC-3) ghim '^BC-3( |-)' 3 \
          'BC-3 ma trận mười ca' \
          'BC-3-dot-bien bỏ vế T1 → lật cả hai bên đọc' \
          'BC-3-luoi bốn ca khớp pre-merge-check.sh' ;;
  AC-4) CA="$CA_GOC"; ghim '^BC-4( |-)' 2 \
          'BC-4 kho không khai → thông điệp bằng bản gốc vòng' \
          'BC-4-doi-chung cây bằng pin → cả hai bản không thoát 2' ;;
  AC-5) ( ghim '^BC-5( |-)' 6 \
          'BC-5 bằng pin → bằng chứng còn mới' \
          'BC-5-do đổi src/a.ts → bằng chứng cũ' \
          'BC-5-t1 chỉ T1 → thoát 0' \
          'BC-5-khong-day không đẩy, gh 0 lời gọi' \
          'BC-5-signed-off chạy khi hợp đồng signed-off' \
          'BC-5-thieu-khoi SKILL bỏ khối → không thấy khối STALE-GUARD' ) || exit 1
        CA="$CA_GOC"; ghim '^BC-5-ban-goc' 1 'BC-5-ban-goc lệnh trên bản gốc vòng → không thoát 0'
        echo "AC-5: đạt — 7 ca" ;;
  AC-6) ghim '^BC-6( |-)' 2 \
          'BC-6 không nạp được bộ máy → giữ luật cũ' \
          'BC-6-doi-chung --ag-root đúng → không thoát 2' ;;
  AC-8) ghim '^BC-8( |-)' 3 \
          'BC-8 vi phân bash↔JS: 42/42 phần tử khớp' \
          'BC-8-do bản sao JS không qua / → nêu phần tử lệch' \
          'BC-8-khong-rut bản sao đổi tên hàm bash → không rút được match_globs' ;;
  AC-7)
    node "$HERE/ac7.mjs" --root "$ROOT" || { echo "AC-7: chiều xuôi không đạt"; exit 1; }
    out="$(node "$HERE/ac7.mjs" --root "$ROOT" --them plugins/acceptance-gate/scripts/pre-merge-check.sh 2>&1)"; rc=$?
    printf '%s\n' "$out"
    [ "$rc" -eq 1 ] && printf '%s\n' "$out" | grep -qF 'plugins/acceptance-gate/scripts/pre-merge-check.sh' \
      || { echo "AC-7: chiều đỏ không đỏ (thoát $rc)"; exit 1; }
    echo "AC-7: chiều đỏ đỏ đúng" ;;
  *) echo "dùng: chay.sh AC-1…AC-8" >&2; exit 64 ;;
esac
