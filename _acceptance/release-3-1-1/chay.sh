#!/usr/bin/env bash
# chay.sh (release-3-1-1) — lệnh riêng của hồ sơ mốc, một nhóm mỗi lần (luật lệnh hồ sơ, tep-chung-khong-chan-gop):
#   bash _acceptance/release-3-1-1/chay.sh <cua-so|dd-giu|goi-doi|lop-chep|vat-va> [mốc]
#   bash _acceptance/release-3-1-1/chay.sh <nhóm> --dinh-moc   — đo ở COMMIT MỐC thay vì HEAD (lối B, xem dưới)
# Mốc mặc định = commit gắn thẻ v3.1.0 (0a93a5b9). Gốc kho suy từ vị trí tệp này.
# Dùng lại công cụ của release-2-39-0 và release-3-1-0 (không dựng đường thứ hai); chỉ `vat-va` là nhóm mới của mốc vá.
set -o pipefail
cd "$(dirname "$0")/../.." || exit 2
# Lối B (chủ kho 23/11): thẻ v3.1.1 gắn vào commit cuối của nhánh mốc TRƯỚC khi nhánh chính (đã có PR #27) gộp vào
# nhánh. `--dinh-moc` cho nhóm đo ở commit ấy: sha đọc từ dinh-moc.txt cạnh tệp này; tệp vắng (ở chính commit mốc) thì
# commit mốc là HEAD. Khác HEAD thì dựng cây tách rời ở commit mốc và chạy lại đúng nhóm ấy trong cây đó.
if [ "$2" = "--dinh-moc" ]; then
  T=_acceptance/release-3-1-1/dinh-moc.txt; H=$(git rev-parse HEAD)
  if [ -f "$T" ]; then
    D=$(git rev-parse --verify -q "$(tr -d '[:space:]' <"$T")^{commit}") || { echo "ĐỎ: $T không trỏ một commit có thật"; exit 2; }
  else D=$H; fi
  if [ "$D" = "$H" ]; then echo "đo ở commit mốc $D (= HEAD)"; set -- "$1"
  else
    W="$(mktemp -d)/cay"
    git worktree add --detach "$W" "$D" >/dev/null 2>&1 || { echo "ĐỎ: không dựng được cây tách rời ở commit mốc $D"; exit 2; }
    echo "đo ở commit mốc $D (dinh-moc.txt), không ở HEAD $H"
    (cd "$W" && bash _acceptance/release-3-1-1/chay.sh "$1"); rc=$?
    git worktree remove --force "$W" >/dev/null 2>&1
    exit $rc
  fi
fi
NHOM="$1"; MOC="${2:-0a93a5b95f3d35b29ffefc6da2b2ad0fa5e96e0d}"
# Commit gộp của bản vá (#26) — vật mà thẻ phải mang nguyên.
VA="${3:-1a887948d7933a3a21c660cecdfc2d0c1e1ffac9}"
case "$NHOM" in
  cua-so)  GIT_GLOB_PATHSPECS=1 bash _acceptance/release-2-39-0/cua-so.sh "$MOC" va-chu-ky-giu-cho-lenh-gop ;;
  dd-giu)
    T=plugins/diagram-design/.claude-plugin/plugin.json
    c=$(git show "$MOC:$T" 2>/dev/null | grep -m1 '"version"'); m=$(grep -m1 '"version"' "$T")
    echo "moc: $c | HEAD: $m"
    [ -n "$c" ] || { echo "ĐỎ: mốc $MOC không có $T"; exit 1; }
    git diff --quiet "$MOC" HEAD -- plugins/diagram-design || { echo "ĐỎ: plugins/diagram-design có dòng đổi từ $MOC"; exit 1; }
    [ "$c" = "$m" ] || { echo "ĐỎ: số diagram-design đổi"; exit 1; }
    echo "XANH: diagram-design không đổi, giữ số" ;;
  goi-doi) bash _acceptance/release-3-1-0/goi-chi-doi-so.sh "$MOC" ;;
  lop-chep) bash _acceptance/release-3-1-0/lop-chep-doi.sh "$MOC" 3.1.1 ;;
  vat-va)
    KHAI="plugins/acceptance-gate/.claude-plugin/plugin.json plugins/dispatch/.claude-plugin/plugin.json plugins/feature-loop/.claude-plugin/plugin.json plugins/knowledge/.claude-plugin/plugin.json plugins/roadmap/.claude-plugin/plugin.json"
    VA4="plugins/acceptance-gate/commands/signoff.md plugins/dispatch/scripts/dieu-phoi.mjs plugins/dispatch/scripts/gop.mjs plugins/feature-loop/skills/feature-loop/SKILL.md"
    git cat-file -e "$VA^{commit}" 2>/dev/null || { echo "ĐỎ: không có commit gộp bản vá $VA"; exit 2; }
    mong=$(printf '%s\n' $KHAI $VA4 | sort | tr '\n' ' ')
    doi=$(git diff --name-only "$MOC" HEAD -- plugins | sort | tr '\n' ' ')
    echo "tệp đổi dưới plugins/ từ $MOC: $doi"
    rc=0
    [ "$doi" = "$mong" ] || { echo "ĐỎ: tập tệp đổi khác bốn tệp của #26 cộng năm tệp khai"; rc=1; }
    ngoai=$(git diff --name-only "$VA" HEAD -- plugins $(for f in $KHAI; do printf ":(exclude)%s " "$f"; done) | tr '\n' ' ')
    [ -z "$ngoai" ] || { echo "ĐỎ: ngoài năm tệp khai, plugins/ ở HEAD lệch commit gộp bản vá: $ngoai"; rc=1; }
    [ $rc -eq 0 ] && echo "XANH: thẻ mang đúng bản vá #26 — 4 tệp vật + 5 tệp khai, phần còn lại trùng byte $VA"
    exit $rc ;;
  *) echo "usage: chay.sh <cua-so|dd-giu|goi-doi|lop-chep|vat-va> [mốc]" >&2; exit 2 ;;
esac
