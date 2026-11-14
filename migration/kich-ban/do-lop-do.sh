#!/usr/bin/env bash
# do-lop-do.sh — đo lớp ca kiểm đỏ do đổi bố cục (vòng B1 kich-ban-chuyen-nha, AC-10; đầu vào cho B2).
#   Dùng: do-lop-do.sh <thư mục tạm TRỐNG> [<bản kéo Repo Standards tại thẻ>]
# Dựng lại don-nha/3.0 từ kit-cu/main, kéo hai bản riêng cùng tên thư mục `delivery-loop` (A = nguồn, B = đỉnh don-nha/3.0),
# chạy đúng sáu bước của việc `tests` (migration/b0/chay.sh) song song, mỗi bản một TMPDIR, rồi ghi
# migration/kich-ban/ket-qua/lop-do.md. Bản kéo riêng (không phải worktree) để ca kiểm nào ghi ref cũng không chạm kho này.
# Khoảng 60–80 phút. Chạy dưới Node của .nvmrc (bộ chạy thoát 3 khi lệch).
set -euo pipefail
T="${1:?cần một thư mục tạm trống}"
DAY="$(cd "$(dirname "$0")" && pwd)"; KHO="$(cd "$DAY/../.." && pwd)"
RS="${2:-${TMPDIR:-/tmp}/delivery-loop-rs-4dc53e0}"
[ -z "$(ls -A "$T" 2>/dev/null)" ] || { echo "do-lop-do: thư mục $T không trống" >&2; exit 2; }
mkdir -p "$T/out"
S="$(git -C "$KHO" rev-parse kit-cu/main)"
node "$DAY/don-nha.mjs" --kho "$KHO" --nguon "$S" --nhanh don-nha/3.0 --repo-standards "$RS" | tail -1
B="$(git -C "$KHO" rev-parse don-nha/3.0)"
for v in A B; do mkdir -p "$T/$v"; git clone -q --no-checkout "$KHO" "$T/$v/delivery-loop"; done
git -C "$T/A/delivery-loop" checkout -q "$S"
git -C "$T/B/delivery-loop" checkout -q "$B"
echo "A @ ${S:0:8} · B @ ${B:0:8} — chạy bộ kiểm song song"
for v in A B; do bash "$KHO/migration/b0/chay.sh" "$T/$v/delivery-loop" "$T/out/$v" > "$T/out/$v.nohup" 2>&1 & done
wait
python3 "$DAY/phan-lop.py" "$T" "$S" "$(git -C "$KHO" rev-parse "$B^{tree}")" > "$DAY/ket-qua/lop-do.md"
echo "do-lop-do: xong → $DAY/ket-qua/lop-do.md"
