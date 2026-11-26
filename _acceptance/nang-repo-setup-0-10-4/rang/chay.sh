#!/usr/bin/env bash
# rang/chay.sh AC-n — lệnh riêng của hồ sơ nang-repo-setup-0-10-4 (khối LENH-HO-SO). Mọi phép đo nằm ở do.py cạnh tệp này;
# gốc kho suy từ vị trí tệp, không hardcode. Thoát 0 = đạt · 1 = đỏ · 2 = không đọc được ở đây (thiếu repo-setup, git…).
set -u
AC="${1:?cách dùng: chay.sh AC-<n> [--thu <đường>]}"
shift
DAY="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DAY/../../.." && pwd)"
exec python3 "$DAY/do.py" --root "$ROOT" "$AC" "$@"
