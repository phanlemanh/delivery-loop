#!/usr/bin/env bash
# duong-cu-con-sot.sh — AC-11 của release-3-0-0: phép so «đổi nội dung gói đồ họa thì phải nâng số» của ca P196 đọc gói ở
# nhánh chính theo bố cục mới, vẫn đọc được bố cục cũ, và không im khi nhánh chính đã chuyển nhà.
#   duong-cu-con-sot.sh [--hai-chieu <nền>] [<ref>]   (mặc định HEAD)
# Đoạn kiểm P196 RÚT từ tests/plugins/run-tests.sh của <ref> (bên viết thật, không chép tay). Mỗi ca dựng một kho thử:
# cây làm việc là gói diagram-design của <ref>, `origin/main` là một commit dựng trong lượt ở bố cục mới hoặc cũ.
#   (a) nhánh chính bố cục mới, gói y hệt                  → thoát 0, in «origin/main:plugins/diagram-design: hash giu»
#   (b) nhánh chính bố cục mới, hash khác, số giữ          → thoát 1, in «tree-hash doi so voi origin/main ma version»
#   (c) nhánh chính bố cục CŨ, hash khác, số giữ           → thoát 1, cùng thông điệp (đường đọc-cũ)
#   (d) nhánh chính bố cục mới, hash khác, số đã nâng      → thoát 0 (độ đặc hiệu: nâng số thì không chặn)
# --hai-chieu <nền>: cùng ca (b) chạy đoạn kiểm của <nền> phải XANH và in «chua co goi» — tức nền im trước đúng lỗi này.
# Thoát 0 đạt · 1 đỏ · 2 không chạy được.
set -u
GOC="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "duong-cu-con-sot: không phải kho git" >&2; exit 2; }
NEN=""
if [ "${1:-}" = "--hai-chieu" ]; then NEN="${2:-}"; [ -n "$NEN" ] || { echo "duong-cu-con-sot: --hai-chieu cần <nền>" >&2; exit 2; }; shift 2; fi
REF="${1:-HEAD}"
T="$(mktemp -d "${TMPDIR:-/tmp}/duong-cu-XXXXXX")" || exit 2
trap 'rm -rf "$T"' EXIT
G() { git -c core.hooksPath=/dev/null -c commit.gpgsign=false -c user.name=thu -c user.email=thu@thu "$@"; }

rut() { # <ref> <tệp ra> — rút đoạn kiểm P196 từ suite plugins của <ref>
  git -C "$GOC" show "$1:tests/plugins/run-tests.sh" 2>/dev/null \
    | awk '/<<.P196SH.$/{f=1;next} /^P196SH$/{f=0} f' > "$2"
  [ -s "$2" ] && grep -q 'so_ver_hash' "$2"
}
rut "$REF" "$T/p196-ref.sh" || { echo "duong-cu-con-sot: không rút được đoạn kiểm P196 ở $REF" >&2; exit 2; }
if [ -n "$NEN" ]; then rut "$NEN" "$T/p196-nen.sh" || { echo "duong-cu-con-sot: không rút được đoạn kiểm P196 ở $NEN" >&2; exit 2; }; fi

# Cây làm việc chung: gói diagram-design + tệp khai chợ của <ref>.
mkdir -p "$T/goc" && git -C "$GOC" archive "$REF" plugins/diagram-design .claude-plugin/marketplace.json | tar -x -C "$T/goc" \
  || { echo "duong-cu-con-sot: không lấy được gói ở $REF" >&2; exit 2; }
SO="$(node -e 'console.log(require(process.argv[1]).version)' "$T/goc/plugins/diagram-design/.claude-plugin/plugin.json")" || exit 2

dung() { # <tên ca> <tiền tố trên nhánh chính> <đổi hash: 0|1> <số trên nhánh chính> — in đường kho thử
  local W="$T/ca-$1" B="$T/nen-$1"
  cp -R "$T/goc" "$W" && G init -q "$W" || return 1
  mkdir -p "$B/$(dirname "$2")" && cp -R "$T/goc/plugins/diagram-design" "$B/$2" || return 1
  [ "$3" = 1 ] && sed -i.bak 's/^\(Tree-hash.*: \)[0-9a-f]\{64\}$/\10000000000000000000000000000000000000000000000000000000000000000/' "$B/$2/NOTICE" && rm -f "$B/$2/NOTICE.bak"
  node -e 'const f=process.argv[1],fs=require("fs"),j=JSON.parse(fs.readFileSync(f,"utf8"));j.version=process.argv[2];fs.writeFileSync(f,JSON.stringify(j,null,2)+"\n")' "$B/$2/.claude-plugin/plugin.json" "$4" || return 1
  G init -q "$B" && G -C "$B" add -A && G -C "$B" commit -qm nen || return 1
  G -C "$W" fetch -q "$B" HEAD && G -C "$W" update-ref refs/remotes/origin/main FETCH_HEAD || return 1
  printf '%s\n' "$W"
}

rc=0
ca() { # <nhãn> <đoạn kiểm> <tên ca> <tiền tố> <đổi hash> <số> <mã mong> <chữ mong>
  local W out m
  W="$(dung "$3" "$4" "$5" "$6")" || { echo "duong-cu-con-sot: không dựng được kho thử ca $3" >&2; exit 2; }
  out="$(bash "$2" "$W" 2>&1)"; m=$?
  if [ "$m" = "$7" ] && printf '%s\n' "$out" | grep -qF "$8"; then echo "đạt ($1): mã $m, có «$8»"
  else echo "ĐỎ ($1): mã $m (mong $7), thiếu «$8»"; printf '%s\n' "$out" | grep 'P196\|DO:' | head -4 | cut -c1-240; rc=1; fi
}
ca a "$T/p196-ref.sh" a plugins/diagram-design 0 "$SO" 0 "so voi origin/main:plugins/diagram-design: hash giu"
ca b "$T/p196-ref.sh" b plugins/diagram-design 1 "$SO" 1 "tree-hash doi so voi origin/main ma version plugin van"
ca c "$T/p196-ref.sh" c diagram-design 1 "$SO" 1 "tree-hash doi so voi origin/main ma version plugin van"
ca d "$T/p196-ref.sh" d plugins/diagram-design 1 "0.0.1" 0 "hash doi · version 0.0.1 -> $SO"
[ -n "$NEN" ] && ca "nền-b" "$T/p196-nen.sh" nb plugins/diagram-design 1 "$SO" 0 "origin/main chua co goi"
[ "$rc" = 0 ] && echo "duong-cu-con-sot: đạt"
exit "$rc"
