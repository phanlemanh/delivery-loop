#!/usr/bin/env bash
# Đo thử B0: chạy đúng các bước của lượt kiểm tự động (gate.yml, việc «tests») trên một bản sao.
# Dùng: chay.sh <thư mục bản sao> <thư mục ghi kết quả>
set -u
V="$1"; OUT="$2"; mkdir -p "$OUT"
export TMPDIR="$OUT/tmp"; mkdir -p "$TMPDIR"
cd "$V" || exit 2
step() {
  local ten="$1"; shift
  local t0; t0=$(date +%s)
  "$@" > "$OUT/$ten.log" 2>&1
  local rc=$?
  printf '%s\t%s\t%s\n' "$ten" "$rc" "$(( $(date +%s) - t0 ))" >> "$OUT/ketqua.tsv"
}
: > "$OUT/ketqua.tsv"
step scripts   bash tests/scripts/run-tests.sh
step hooks     bash tests/hooks/run-tests.sh
step plugins   bash tests/plugins/run-tests.sh
step workflows bash tests/workflows/run-tests.sh
step dieu-phoi node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs"
step ban-do    node scripts/product-map.mjs --root . --check
echo XONG >> "$OUT/ketqua.tsv"
