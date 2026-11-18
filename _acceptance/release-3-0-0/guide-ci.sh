#!/usr/bin/env bash
# guide-ci.sh — AC-8 của release-3-0-0: kho tiêu thụ làm ĐÚNG theo GUIDE §5.3 thì hai bước của việc `gate` chạy được.
# Gốc: 17/11 GUIDE của cây kịch bản dựng dặn `CLAUDE_PLUGIN_ROOT=$RUNNER_TEMP/kit` — ở bố cục mới gốc ấy không có scripts/.
#
#   guide-ci.sh [<ref GUIDE>]       lấy đường gốc plugin từ GUIDE.md ở <ref> (mặc định HEAD), kit lấy theo thẻ từ một kho
#                                   trần cục bộ dựng từ HEAD, rồi chạy hai bước trên chính kho này làm kho tiêu thụ
#   guide-ci.sh --hai-chieu <nền>   GUIDE ở HEAD phải đạt VÀ GUIDE ở <nền> phải đỏ đúng thông điệp ghim
# Thoát 0 đạt · 1 đỏ · 2 không chạy được.
set -u
GOC="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "guide-ci: không phải kho git" >&2; exit 2; }
don() { [ -n "${1:-}" ] && [ -d "$1" ] && rm -rf "$1"; }
do_mot() { # <ref GUIDE>
  local ref="$1" t duoi goc ra
  # Dòng GUIDE dặn đặt gốc plugin: echo "CLAUDE_PLUGIN_ROOT=$RUNNER_TEMP<đuôi>" >> "$GITHUB_ENV"
  duoi="$(git -C "$GOC" show "$ref:GUIDE.md" 2>/dev/null | awk 'match($0, /echo "CLAUDE_PLUGIN_ROOT=\$RUNNER_TEMP[^"]*" >> "\$GITHUB_ENV"/) { s = substr($0, RSTART, RLENGTH); sub(/^echo "CLAUDE_PLUGIN_ROOT=\$RUNNER_TEMP/, "", s); sub(/" >> "\$GITHUB_ENV"$/, "", s); print s; exit }')"
  [ -n "$duoi" ] || { echo "guide-ci: GUIDE.md ở $ref không có dòng đặt CLAUDE_PLUGIN_ROOT theo \$RUNNER_TEMP" >&2; return 2; }
  t="$(mktemp -d "${TMPDIR:-/tmp}/guide-ci-XXXXXX")" || return 2
  { git init -q --bare "$t/kit.git" && git -C "$GOC" push -q "$t/kit.git" HEAD:refs/tags/v0.0.0-thu 2>/dev/null; } || { echo "guide-ci: không dựng được kho trần" >&2; don "$t"; return 2; }
  export RUNNER_TEMP="$t/runner"; mkdir -p "$RUNNER_TEMP"
  { git init -q "$RUNNER_TEMP/kit" && git -C "$RUNNER_TEMP/kit" fetch -q --depth 1 "file://$t/kit.git" refs/tags/v0.0.0-thu && git -C "$RUNNER_TEMP/kit" checkout -q FETCH_HEAD; } || { echo "guide-ci: không lấy được kit theo thẻ" >&2; don "$t"; return 2; }
  kho="$(git -C "$GOC" show "$ref:GUIDE.md" 2>/dev/null | awk 'match($0, /fetch -q --depth 1 https:\/\/github\.com\/phanlemanh\/[A-Za-z0-9._-]+/) { s = substr($0, RSTART, RLENGTH); sub(/.*\//, "", s); print s; exit }')"
  goc="$RUNNER_TEMP$duoi"
  echo "GUIDE ở $ref dặn gốc plugin = \$RUNNER_TEMP$duoi · kho lấy kit = ${kho:-không đọc được}"
  [ "$kho" = delivery-loop ] || { echo "ĐỎ: GUIDE ở $ref lấy kit từ kho «${kho:-không đọc được}», cần delivery-loop"; don "$t"; return 1; }
  if [ ! -f "$goc/scripts/pre-merge-check.sh" ]; then
    echo "ĐỎ: theo GUIDE ở $ref không có bộ chặn gộp tại \$RUNNER_TEMP$duoi/scripts/pre-merge-check.sh"
    don "$t"; return 1
  fi
  ra="$(cd "$GOC" && bash "$goc/scripts/pre-merge-check.sh" . --slug release-2-39-0 --base HEAD~1 --no-t1-escape 2>&1)"
  if ! printf '%s\n' "$ra" | grep -q '^pre-merge-check: rules ran='; then echo "ĐỎ: bộ chặn gộp không in dòng sổ luật"; printf '%s\n' "$ra" | tail -3; don "$t"; return 1; fi
  printf '%s\n' "$ra" | grep '^pre-merge-check: rules ran='
  if [ ! -f "$goc/scripts/product-map.mjs" ]; then echo "ĐỎ: không có product-map.mjs tại gốc GUIDE dặn"; don "$t"; return 1; fi
  # Bước hai: script phải CHẠY được từ gốc GUIDE dặn (thoát 0 khớp, 1 lệch — cả hai là chạy được; mã khác là hỏng).
  (cd "$GOC" && node "$goc/scripts/product-map.mjs" --root . --check >/dev/null 2>&1); m=$?
  if [ "$m" != 0 ] && [ "$m" != 1 ]; then echo "ĐỎ: product-map --check thoát $m từ gốc GUIDE dặn"; don "$t"; return 1; fi
  echo "đạt: hai bước của việc gate chạy được theo GUIDE ở $ref (product-map --check thoát $m)"
  # Vế tài liệu: đường kho tiêu thụ làm theo trong README, GUIDE, QUICKSTART trỏ tệp có thật.
  node "$GOC/_acceptance/release-3-0-0/tai-lieu-duong.mjs" "$ref" || { echo "ĐỎ: tài liệu ở $ref còn đường chết"; don "$t"; return 1; }
  don "$t"; return 0
}
if [ "${1:-}" = "--hai-chieu" ]; then
  NEN="${2:?cần commit nền}"
  echo "== GUIDE ở HEAD (phải đạt)"; do_mot HEAD; a=$?
  echo "== GUIDE ở nền $NEN (phải đỏ)"; ra="$(do_mot "$NEN")"; b=$?; printf '%s\n' "$ra"
  [ "$a" = 0 ] || { echo "guide-ci: GUIDE ở HEAD không đạt (mã $a)"; exit 1; }
  # Vế tài liệu trên nền chạy riêng: vế gốc plugin đã dừng trước nó.
  td="$(cd "$GOC" && node _acceptance/release-3-0-0/tai-lieu-duong.mjs "$NEN")"; c=$?; printf '%s\n' "$td"
  if [ "$b" = 1 ] && printf '%s\n' "$ra" | grep -q '^ĐỎ: theo GUIDE ở .* không có bộ chặn gộp tại \$RUNNER_TEMP/kit/scripts/pre-merge-check.sh$' \
     && [ "$c" = 1 ] && printf '%s\n' "$td" | grep -q '^CHẾT QUICKSTART.md:[0-9]* · feature-loop/README.md$' \
     && printf '%s\n' "$td" | grep -q '^CHẾT README.md:[0-9]* · <kit>/skills/acceptance$'; then
    echo "guide-ci: hai chiều đạt"; exit 0
  fi
  echo "guide-ci: chiều đỏ không ra đúng thông điệp ghim trên nền $NEN (mã $b)"; exit 1
fi
do_mot "${1:-HEAD}"
