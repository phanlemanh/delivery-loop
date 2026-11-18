#!/usr/bin/env bash
# chay-bo-kiem.sh — chạy các bước kiểm của việc `tests` (đọc từ .github/workflows/gate.yml của CHÍNH cây) trên một cây
# (B2 AC-4; thay migration/b0/chay.sh cho lượt đo của B2 — bản B0 giữ nguyên làm sử liệu).
#   Dùng: chay-bo-kiem.sh <thư mục cây> <thư mục kết quả>
# Kết quả: <bộ>.log, thoi-gian-ca/<bộ>-tron.tsv (bộ bash ghi qua THOI_GIAN_CA_DIR), ketqua.tsv «ten<TAB>mã<TAB>giây<TAB>loại»
# rồi dòng XONG. TMPDIR là một thư mục NGẮN riêng cho lượt (mktemp -d /tmp/b2-…): ca GL07 cắt đầu ra ở 240 ký tự, đường tạm
# dài đẩy thông điệp ghim ra ngoài (đo 14/11, sổ B2). Không đọc được việc tests → thoát 2, không chạy gì.
# CHI_BUOC=<tên,tên> chỉ chạy các bước có tên ấy (chay-lai-do.sh dùng để chạy lại bước đỏ ở cả hai cây).
set -u
V="${1:?cần thư mục cây}"; OUT="${2:?cần thư mục kết quả}"
DAY="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$OUT/thoi-gian-ca"
OUT="$(cd "$OUT" && pwd)"
BUOC="$(node "$DAY/doc-gate.mjs" "$V/.github/workflows/gate.yml")" || { echo "chay-bo-kiem: không đọc được việc tests của $V" >&2; exit 2; }
T="$(mktemp -d /tmp/b2-XXXXXX)"
export TMPDIR="$T" THOI_GIAN_CA_DIR="$OUT/thoi-gian-ca"
# Gọi từ bên trong `node --test` (ca kiểm, lượt chấm) thì biến này làm `node --test` con báo về tiến trình cha thay vì in
# TAP — bước điều phối ra 0 ca mà không đỏ. Lượt đo phải chạy như lượt kiểm tự động: không có cha.
unset NODE_TEST_CONTEXT
: > "$OUT/ketqua.tsv"
cd "$V" || exit 2
while IFS=$'\t' read -r ten loai lenh; do
  [ -n "$ten" ] || continue
  if [ -n "${CHI_BUOC:-}" ]; then case ",$CHI_BUOC," in *",$ten,"*) ;; *) continue ;; esac; fi
  lenh="${lenh//⏎/$'\n'}"
  t0=$(date +%s)
  bash -c "$lenh" < /dev/null > "$OUT/$ten.log" 2>&1   # stdin là danh sách bước — bước không được nuốt nó
  rc=$?
  printf '%s\t%s\t%s\t%s\n' "$ten" "$rc" "$(( $(date +%s) - t0 ))" "$loai" >> "$OUT/ketqua.tsv"
done <<< "$BUOC"
echo XONG >> "$OUT/ketqua.tsv"
rm -rf "$T"
