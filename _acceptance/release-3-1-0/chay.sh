#!/usr/bin/env bash
# chay.sh (release-3-1-0) — lệnh riêng của hồ sơ mốc, một nhóm mỗi lần (luật lệnh hồ sơ, tep-chung-khong-chan-gop):
#   bash _acceptance/release-3-1-0/chay.sh <cua-so|dd-giu|goi-doi|lop-chep> [mốc]
# Mốc mặc định = commit gắn thẻ v3.0.0 (c16d25db). Gốc kho suy từ vị trí tệp này.
set -o pipefail
cd "$(dirname "$0")/../.." || exit 2
NHOM="$1"; MOC="${2:-c16d25dbe224ec0b122b6d578118731750b6a4e3}"
case "$NHOM" in
  cua-so)  GIT_GLOB_PATHSPECS=1 bash _acceptance/release-2-39-0/cua-so.sh "$MOC" chuyen-gop loi-gop-trong-cau-ky mac-ky-co-phu-quyet tep-chung-khong-chan-gop ;;
  dd-giu)
    T=plugins/diagram-design/.claude-plugin/plugin.json
    c=$(git show "$MOC:$T" 2>/dev/null | grep -m1 '"version"'); m=$(grep -m1 '"version"' "$T")
    echo "moc: $c | HEAD: $m"
    [ -n "$c" ] || { echo "ĐỎ: mốc $MOC không có $T"; exit 1; }
    git diff --quiet "$MOC" HEAD -- plugins/diagram-design || { echo "ĐỎ: plugins/diagram-design có dòng đổi từ $MOC"; exit 1; }
    [ "$c" = "$m" ] || { echo "ĐỎ: số diagram-design đổi"; exit 1; }
    echo "XANH: diagram-design không đổi, giữ số" ;;
  goi-doi) bash _acceptance/release-3-1-0/goi-chi-doi-so.sh "$MOC" ;;
  lop-chep) bash _acceptance/release-3-1-0/lop-chep-doi.sh "$MOC" "${3:-3.1.0}" ;;
  *) echo "usage: chay.sh <cua-so|dd-giu|goi-doi|lop-chep> [mốc]" >&2; exit 2 ;;
esac
