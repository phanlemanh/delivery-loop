#!/usr/bin/env bash
# don-dau-vet.sh — AC-9 của release-3-0-0: tệp luật của đợt đã gỡ, và ca RT13 thôi quét thư mục migration/ mà vẫn quét sản phẩm.
#   don-dau-vet.sh [<ref>]   (mặc định HEAD)
# Ba phép đo trên một cây làm việc tạm ở <ref>:
#   (a) không còn .claude/rules/chuyen-nha.md · RT13 đạt trên cây nguyên vẹn (đối chứng dương)
#   (b) thêm một tệp thử mang chữ trạng thái đã ký dưới migration/ → RT13 VẪN đạt (độ đặc hiệu)
#   (c) dời đúng tệp ấy vào plugins/acceptance-gate/scripts/ → RT13 ĐỎ, nêu tên tệp (độ nhạy)
# Thoát 0 đạt · 1 đỏ · 2 không chạy được.
set -u
GOC="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "don-dau-vet: không phải kho git" >&2; exit 2; }
REF="${1:-HEAD}"
T="$(mktemp -d "${TMPDIR:-/tmp}/don-dau-vet-XXXXXX")" || exit 2
don() { git -C "$GOC" worktree remove --force "$T/cay" >/dev/null 2>&1; [ -d "$T" ] && rm -rf "$T"; }
trap don EXIT
git -C "$GOC" worktree add -q --detach "$T/cay" "$REF" 2>/dev/null || { echo "don-dau-vet: không dựng được cây ở $REF" >&2; exit 2; }
cd "$T/cay" || exit 2
rc=0
rt13() { RT_CASES=RT13 node tests/plugins/ra-co-ten.test.mjs 2>&1; }
if [ -e .claude/rules/chuyen-nha.md ]; then echo "ĐỎ (a): còn .claude/rules/chuyen-nha.md"; rc=1; else echo "đạt (a1): không còn tệp luật của đợt"; fi
r="$(rt13)"; m=$?
if [ "$m" = 0 ] && printf '%s\n' "$r" | grep -q '^PASS: \[RT13\]'; then echo "đạt (a2): RT13 đạt trên cây nguyên vẹn"; else echo "ĐỎ (a): RT13 không đạt trên cây nguyên vẹn (mã $m)"; printf '%s\n' "$r" | tail -3 | cut -c1-300; rc=1; fi
# Chữ trạng thái ghép từ hai nửa để chính tệp này không mang nó nguyên văn.
CHU="signed""-off"
mkdir -p migration && printf 'tệp thử của don-dau-vet: status: %s\n' "$CHU" > migration/thu-rt13.txt && git add migration/thu-rt13.txt
r="$(rt13)"; m=$?
if [ "$m" = 0 ] && printf '%s\n' "$r" | grep -q '^PASS: \[RT13\]'; then echo "đạt (b): tệp mang chữ ấy dưới migration/ không làm RT13 đỏ"; else echo "ĐỎ (b): RT13 đỏ vì một tệp dưới migration/ (mã $m)"; printf '%s\n' "$r" | grep -m3 'thu-rt13\|FAIL' | cut -c1-300; rc=1; fi
git mv migration/thu-rt13.txt plugins/acceptance-gate/scripts/thu-rt13.txt
r="$(rt13)"; m=$?
if [ "$m" != 0 ] && printf '%s\n' "$r" | grep -q 'plugins/acceptance-gate/scripts/thu-rt13.txt'; then echo "đạt (c): cùng tệp ấy trong scripts của plugin lõi làm RT13 đỏ, nêu đúng tên tệp"; else echo "ĐỎ (c): RT13 không bắt tệp mang chữ ấy trong sản phẩm (mã $m)"; rc=1; fi
[ "$rc" = 0 ] && echo "don-dau-vet: đạt"
exit "$rc"
