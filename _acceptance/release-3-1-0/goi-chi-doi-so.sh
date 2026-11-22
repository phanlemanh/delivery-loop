#!/usr/bin/env bash
# goi-chi-doi-so.sh (release-3-1-0) — bản của release-2-39-0 theo bố cục plugins/<tên>/ (3.0.0): `plugins/roadmap/` và
# `plugins/knowledge/` chỉ đổi SỐ từ mốc trước tới HEAD — tập tệp đổi BẰNG đúng hai tệp khai, VÀ mọi dòng đổi là dòng
# "version". Bản 2.39 đọc `road-map/`, `tri-thuc/` — hai thư mục không còn từ 3.0.0, nên trên cây mới nó so tập rỗng.
#   bash goi-chi-doi-so.sh <mốc-trước>    # exit 0 khớp · 1 lệch · 2 usage
MOC="$1"; [ -n "$MOC" ] || { echo "usage: goi-chi-doi-so.sh <mốc-trước>" >&2; exit 2; }
G="plugins/roadmap plugins/knowledge"
for d in $G; do [ -f "$d/.claude-plugin/plugin.json" ] || { echo "ĐỎ: không có $d/.claude-plugin/plugin.json — bố cục đổi?"; exit 2; }; done
d=$(git diff --name-only "$MOC" HEAD -- $G | sort | tr '\n' ' ')
x=$(git diff -U0 "$MOC" HEAD -- $G | grep -E '^[-+][^-+]' | grep -v '"version":')
echo "goi chi doi so: $d"
rc=0
[ "$d" = "plugins/knowledge/.claude-plugin/plugin.json plugins/roadmap/.claude-plugin/plugin.json " ] || { echo "ĐỎ: tập tệp đổi khác hai tệp khai"; rc=1; }
[ -z "$x" ] || { echo "ĐỎ: dòng đổi ngoài \"version\":"; printf '%s\n' "$x" | sed 's/^/    /'; rc=1; }
[ $rc -eq 0 ] && echo "XANH: hai gói chỉ đổi dòng version"
exit $rc
