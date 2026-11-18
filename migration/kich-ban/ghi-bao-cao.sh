#!/usr/bin/env bash
# ghi-bao-cao.sh — viết báo cáo lớp đỏ NGUYÊN TỬ (B2 AC-5, Ngoài-7 của B1).
#   Dùng: ghi-bao-cao.sh <thư mục đo> <mã nguồn> <mã cây mới> <tệp đích>
# phan-lop.py viết vào tệp tạm cạnh đích → lop-do.mjs --kiem đối chiếu số học → chỉ khi qua mới thay tệp đích. Bất kỳ bước
# nào hỏng: thoát khác 0, tệp đích còn nguyên byte, tệp tạm bị xoá.
set -euo pipefail
T="$1"; S="$2"; C="$3"; DICH="$4"
DAY="$(cd "$(dirname "$0")" && pwd)"
TAM="$(mktemp "$(dirname "$DICH")/.lop-do.XXXXXX")"
trap 'rm -f "$TAM"' EXIT
python3 "$DAY/phan-lop.py" "$T" "$S" "$C" > "$TAM"
node "$DAY/lop-do.mjs" --kiem "$TAM"
mv -f "$TAM" "$DICH"
trap - EXIT
