#!/usr/bin/env bash
# chu-ky-giu-cho.sh — thước của hồ sơ va-chu-ky-giu-cho-lenh-gop.
#   --chan giu-cho   (E2, AC-2): ca GL-6a/6b/6k trên cây, rồi ba nhát tiêm trên bản sao `git archive HEAD plugins tests`.
#   --chan duong-loi (E3, AC-3): ca GL-6i/6j/8a trên cây, rồi một nhát tiêm vào khối GOP-THEO-LOI-KY của SKILL.
# Mỗi bản sao chạy đối chứng dương (bản nguyên vẹn XANH) trước khi tin bản bị tiêm ĐỎ; mỗi nhát tiêm thay NGUYÊN VĂN và
# phải đổi tệp (không đổi được → ĐỎ hạ tầng, không phải xanh); thông điệp đỏ được ghim. Đường suy từ vị trí tệp này.
# In một dòng cuối «XANH: <chân>» (thoát 0) hoặc «ĐỎ: <chân> — <lý do>» (thoát 1); gọi sai → thoát 2.
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$HERE/../.." && pwd)
CA=tests/dieu-phoi/loi/gop-theo-loi.test.mjs
CHAN=""
[ "${1:-}" = --chan ] && CHAN="${2:-}"
case "$CHAN" in giu-cho|duong-loi) ;; *) echo "dùng: chu-ky-giu-cho.sh --chan giu-cho|duong-loi" >&2; exit 2 ;; esac

TAM=$(mktemp -d "${TMPDIR:-/tmp}/vcgc-XXXXXX")
trap 'rm -rf "$TAM"' EXIT
do_() { echo "ĐỎ: $CHAN — $*"; exit 1; }

# <gốc> <mẫu tên ca> → đầu ra TAP của các ca khớp mẫu
chay() { (cd "$1" && node --test --test-reporter=tap --test-name-pattern="$2" "$CA" 2>&1); }
co_ok() { grep -Eq "^ok [0-9]+ - $2 " <<<"$1"; }
co_hong() { grep -Eq "^not ok [0-9]+ - $2 " <<<"$1"; }
# <đầu ra> <ca…>: «# fail 0» và đủ dòng ok của từng ca
xanh_ca() {
  local out=$1; shift
  grep -q '^# fail 0$' <<<"$out" || return 1
  for c in "$@"; do co_ok "$out" "$c" || return 1; done
}
ban_sao() {
  local d="$TAM/$1"
  mkdir -p "$d"
  git -C "$ROOT" archive HEAD plugins tests | tar -x -C "$d" || do_ "không dựng được bản sao $1 (git archive)"
  echo "$d"
}
# <tệp> <chuỗi cũ> <chuỗi mới> — thay lần xuất hiện đầu, nguyên văn; chuỗi cũ vắng → ĐỎ hạ tầng
tiem() {
  node -e '
    const fs = require("fs"); const [tep, cu, moi] = process.argv.slice(1);
    const s = fs.readFileSync(tep, "utf8"); const i = s.indexOf(cu);
    if (i < 0) { console.error("nhát tiêm không khớp: " + tep); process.exit(3); }
    const t = s.slice(0, i) + moi + s.slice(i + cu.length);
    if (t === s) { console.error("nhát tiêm không đổi tệp: " + tep); process.exit(3); }
    fs.writeFileSync(tep, t);' "$1" "$2" "$3" || do_ "nhát tiêm hỏng ở $1 — thước không chạy được, không phải xanh"
}
so_mau() { grep -Eo 'GL-6k: [0-9]+ mẫu' <<<"$1" | head -1 | sed -E 's/^GL-6k: ([0-9]+) mẫu$/\1/'; }

GOP=plugins/dispatch/scripts/gop.mjs
LOI=plugins/acceptance-gate/lib/evidence-core.cjs
VONG=plugins/feature-loop/skills/feature-loop/SKILL.md

if [ "$CHAN" = giu-cho ]; then
  MAU='^GL-6(a|b|k) '
  out=$(chay "$ROOT" "$MAU")
  xanh_ca "$out" GL-6a GL-6b GL-6k || { echo "$out" | tail -n 40; do_ "ca GL-6a/6b/6k trên cây không xanh"; }
  n=$(so_mau "$out")
  [ -n "$n" ] && [ "$n" -ge 1 ] || do_ "GL-6k không in số mẫu của bảng giữ chỗ"
  echo "cây: GL-6a, GL-6b, GL-6k xanh · bảng giữ chỗ của lõi $n mẫu"

  d0=$(ban_sao nguyen-ven)
  xanh_ca "$(chay "$d0" "$MAU")" GL-6a GL-6b GL-6k || do_ "đối chứng dương: bản sao nguyên vẹn không xanh"
  echo "bản sao nguyên vẹn: xanh"

  # phep-cu — vế chữ ký coi giá trị giữ chỗ như chữ ký (giá trị có chữ là ký, không hỏi bảng của lõi)
  d1=$(ban_sao phep-cu)
  tiem "$d1/$GOP" 'if (!ck.signed) return' 'if (!ck.signed && !ck.placeholder) return'
  o1=$(chay "$d1" '^GL-6b ')
  co_hong "$o1" GL-6b && grep -q 'chữ ký giữ chỗ pending' <<<"$o1" || { echo "$o1" | tail -n 30; do_ "phep-cu: GL-6b không đỏ nêu «chữ ký giữ chỗ pending»"; }
  echo "phep-cu: GL-6b ĐỎ, nêu «chữ ký giữ chỗ pending»"

  # mau-moi — thêm một mẫu vào bảng của lõi: lệnh gộp phải theo (GL-6k xanh, số mẫu tăng một)
  d2=$(ban_sao mau-moi)
  tiem "$d2/$LOI" $'const CHU_KY_GIU_CHO = [\n' $'const CHU_KY_GIU_CHO = [\n  { mau: \'chua-ky-thu\', tienTo: true },\n'
  o2=$(chay "$d2" '^GL-6k ')
  n2=$(so_mau "$o2")
  xanh_ca "$o2" GL-6k && [ "$n2" = "$((n + 1))" ] || { echo "$o2" | tail -n 30; do_ "mau-moi: GL-6k không xanh với $((n + 1)) mẫu (in: ${n2:-không})"; }
  echo "mau-moi: GL-6k xanh, $n2 mẫu"

  # bang-rieng — cùng mẫu mới ở lõi, nhưng lệnh gộp đọc một bảng riêng chép từ bảng cũ: GL-6k phải đỏ nêu mẫu mới
  d3=$(ban_sao bang-rieng)
  cp "$d3/$LOI" "$d3/plugins/dispatch/scripts/bang-rieng.cjs"
  tiem "$d3/$LOI" $'const CHU_KY_GIU_CHO = [\n' $'const CHU_KY_GIU_CHO = [\n  { mau: \'chua-ky-thu\', tienTo: true },\n'
  tiem "$d3/$GOP" 'const tep = path.join(goc, TEP_BO_DOC);' "const tep = decodeURIComponent(new URL('./bang-rieng.cjs', import.meta.url).pathname);"
  o3=$(chay "$d3" '^GL-6k ')
  co_hong "$o3" GL-6k && grep -q 'chua-ky-thu' <<<"$o3" || { echo "$o3" | tail -n 30; do_ "bang-rieng: GL-6k không đỏ nêu «chua-ky-thu»"; }
  echo "bang-rieng: GL-6k ĐỎ, nêu «chua-ky-thu»"
  echo "XANH: giu-cho"
  exit 0
fi

# duong-loi
MAU='^GL-(6i|6j|8a) '
out=$(chay "$ROOT" "$MAU")
xanh_ca "$out" GL-6i GL-6j GL-8a || { echo "$out" | tail -n 40; do_ "ca GL-6i/6j/8a trên cây không xanh"; }
echo "cây: GL-6i, GL-6j, GL-8a xanh"
d0=$(ban_sao nguyen-ven)
xanh_ca "$(chay "$d0" '^GL-8a ')" GL-8a || do_ "đối chứng dương: GL-8a trên bản sao nguyên vẹn không xanh"
# bo-loi — khối S5 thôi truyền gốc lõi: GL-8a phải đỏ
d1=$(ban_sao bo-loi)
tiem "$d1/$VONG" ' --cho-ci 30 --loi "$AG"' ' --cho-ci 30'
o1=$(chay "$d1" '^GL-8a ')
co_hong "$o1" GL-8a || { echo "$o1" | tail -n 30; do_ "bo-loi: GL-8a không đỏ khi khối S5 thôi truyền --loi"; }
echo "bo-loi: GL-8a ĐỎ"
echo "XANH: duong-loi"
exit 0
