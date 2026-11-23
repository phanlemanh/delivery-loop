#!/usr/bin/env bash
# do-dong-1.sh (release-3-1-1) — đo dòng 1 của luật (c) cho MỘT hồ sơ đã gộp, đọc lịch sử nhánh chính.
# Định nghĩa giữ như mốc 3.0.0/3.1.0: làm-xong = commit đầu đưa hợp đồng sang `implemented` · ký = commit đầu đưa `status:`
# sang trạng thái đã thông · gộp = commit sớm nhất trên lối cha-đầu của nhánh chính có commit ký là tổ tiên.
# Vì sao không gọi thẳng `plugins/dispatch/scripts/do-gop.mjs`: trên git 2.50 lệnh `rev-list --first-parent --ancestry-path
# <ký>..<nhánh>` của nó trả rỗng khi commit ký nằm trên cha THỨ HAI của commit gộp (ca thường của PR), nên bộ đo trả
# toàn null. Tệp này in cả dòng của bộ đo ấy để lệch hiện ra, không giấu.
#   bash _acceptance/release-3-1-1/do-dong-1.sh <slug> [nhánh=origin/main]
set -o pipefail
cd "$(dirname "$0")/../.." || exit 2
SLUG="$1"; NHANH="${2:-origin/main}"
[ -n "$SLUG" ] || { echo "usage: do-dong-1.sh <slug> [nhánh]" >&2; exit 2; }
T="_acceptance/$SLUG/contract.md"
dau() { git log --reverse --format='%H %cI' -G "^status:[[:space:]]*($1)" "$NHANH" -- "$T" | head -1; }
read -r XS XL <<<"$(dau implemented)"
read -r KS KL <<<"$(dau 'signed-off|machine-cleared|da-cham-boi-thuc-te')"
[ -n "$KS" ] || { echo "ĐỎ: không thấy commit ký của $SLUG trên $NHANH"; exit 1; }
GS=""; for c in $(git rev-list --first-parent --reverse "$NHANH"); do git merge-base --is-ancestor "$KS" "$c" && { GS=$c; break; }; done
[ -n "$GS" ] || { echo "ĐỎ: không thấy commit gộp mang chữ ký $KS"; exit 1; }
GL=$(git log -1 --format=%cI "$GS"); read -r _ P1 P2 <<<"$(git log -1 --format='%H %P' "$GS")"
phut() { echo $(( ( $(date -j -f '%Y-%m-%dT%H:%M:%S%z' "$(echo "$2" | sed 's/:\([0-9][0-9]\)$/\1/')" +%s) - $(date -j -f '%Y-%m-%dT%H:%M:%S%z' "$(echo "$1" | sed 's/:\([0-9][0-9]\)$/\1/')" +%s) ) / 60 )); }
gm() { local m=$1; printf '%d g %02d' $((m/60)) $((m%60)); }
echo "# Dòng 1 — $SLUG (đo $(date -u +%Y-%m-%dT%H:%M:%SZ) trên $NHANH = $(git rev-parse --short "$NHANH"))"
echo
echo "| mốc | commit | giờ |"
echo "|---|---|---|"
echo "| làm-xong | \`${XS:0:8}\` | $XL |"
echo "| ký | \`${KS:0:8}\` | $KL |"
echo "| gộp | \`${GS:0:8}\` | $GL |"
echo
[ -n "$XS" ] && echo "- làm-xong → ký: **$(gm "$(phut "$XL" "$KL")")**"
echo "- ký → gộp: **$(gm "$(phut "$KL" "$GL")")**"
if [ -n "$P2" ]; then
  echo "- gộp nhánh chính vào nhánh trong PR (commit gộp có một cha trên nhánh chính):"
  n=0
  for x in $(git rev-list --merges "$P1..$P2"); do
    for q in $(git rev-list --parents -n 1 "$x" | cut -d' ' -f3-); do
      if git merge-base --is-ancestor "$q" "$P1"; then n=$((n+1)); echo "  - \`$(git log -1 --format='%h %cI %s' "$x")\`"; break; fi
    done
  done
  echo "  - tổng: **$n**"
fi
echo "- commit sau chữ ký trên lối cha-đầu của nhánh PR (ký → gộp):"
git log --first-parent --reverse --format="  - \`%h %cI %s\`" "$KS..${P2:-$GS}"
echo
echo "Bộ đo của kit (\`do-gop.mjs\`, \`soDoGop\`) trên cùng nhánh:"
node -e '
const { execFileSync } = require("child_process");
(async () => {
  const { soDoGop } = await import(process.cwd() + "/plugins/dispatch/scripts/do-gop.mjs");
  const io = { chay: (c, a) => execFileSync(c, a, { encoding: "utf8", maxBuffer: 1 << 28 }) };
  console.log("`" + JSON.stringify(soDoGop(io, { nhanh_chinh: process.argv[2] }, process.argv[1], ["signed-off", "machine-cleared", "da-cham-boi-thuc-te"])) + "`");
})();' "$SLUG" "${NHANH#origin/}"
