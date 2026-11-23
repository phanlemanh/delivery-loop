#!/usr/bin/env bash
# gop-thu.sh (release-3-1-1) — rà biên merge theo đề bài: bộ kiểm có XANH trên commit gộp thử không.
# Dựng một cây tách rời ngoài kho, HEAD = gộp `--no-ff` <nhánh vòng> vào <nhánh chính>, rồi chạy ĐÚNG các lệnh của
# `feature_loop.suite_keys` (cùng bộ đọc `resolveConfigList`/`resolveConfigKey` của lõi như lượt chấm và làn ghim lại).
# Nhật ký trọn từng lệnh ở <thư mục ra>/NN.log; bảng tóm tắt in ra stdout (chép vào gop-thu.md).
#   bash _acceptance/release-3-1-1/gop-thu.sh <thư mục ra> [nhánh vòng=HEAD] [nhánh chính=origin/main]
#   exit 0 mọi lệnh xanh · 1 có lệnh đỏ · 2 không dựng được cây gộp thử
set -o pipefail
GOC="$(cd "$(dirname "$0")/../.." && pwd)" || exit 2
RA="$1"; VONG="$(git -C "$GOC" rev-parse "${2:-HEAD}")"; CHINH="$(git -C "$GOC" rev-parse "${3:-origin/main}")"
[ -n "$RA" ] || { echo "usage: gop-thu.sh <thư mục ra> [nhánh vòng] [nhánh chính]" >&2; exit 2; }
mkdir -p "$RA" || exit 2
CAY="$RA/cay"
git -C "$GOC" worktree add --detach "$CAY" "$CHINH" >/dev/null 2>&1 || { echo "ĐỎ: không dựng được cây tách rời ở $CAY"; exit 2; }
trap 'git -C "$GOC" worktree remove --force "$CAY" >/dev/null 2>&1' EXIT
git -C "$CAY" -c user.name=gop-thu -c user.email=gop-thu@local merge --no-ff --no-edit "$VONG" >"$RA/merge.log" 2>&1 \
  || { echo "ĐỎ: gộp thử $VONG vào $CHINH xung đột — xem $RA/merge.log"; exit 2; }
GOP="$(git -C "$CAY" rev-parse HEAD)"
echo "# Gộp thử — $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo
echo "- nhánh chính: \`$CHINH\` · nhánh vòng: \`$VONG\` · commit gộp thử (\`--no-ff\`): \`$GOP\` (cha: $(git -C "$CAY" log -1 --format=%P))"
echo "- cây gộp thử khác cây nhánh vòng: $(git -C "$CAY" diff --quiet "$VONG" HEAD && echo 'không (trùng byte)' || echo "CÓ — $(git -C "$CAY" diff --name-only "$VONG" HEAD | wc -l | tr -d ' ') tệp")"
echo "- node: $(node -v)"
echo
echo "| # | lệnh | mã | giây |"
echo "|--:|---|--:|--:|"
CMDS=$(cd "$CAY" && node -e '
const { resolveConfigKey, resolveConfigList } = require(process.cwd() + "/plugins/acceptance-gate/lib/evidence-core.cjs");
const t = require("fs").readFileSync("_acceptance/config.yaml", "utf8");
for (const k of resolveConfigList(t, "feature_loop.suite_keys")) { const c = resolveConfigKey(t, k); if (!c) { console.error("khoá không giải được: " + k); process.exit(2); } console.log(c); }') \
  || { echo "ĐỎ: không đọc được feature_loop.suite_keys trên cây gộp thử"; exit 2; }
i=0; rc=0
while IFS= read -r c; do
  i=$((i+1)); n=$(printf '%02d' $i); t0=$(date +%s)
  (cd "$CAY" && bash -c "$c") >"$RA/$n.log" 2>&1; m=$?
  s=$(( $(date +%s) - t0 ))
  [ $m -eq 0 ] || rc=1
  echo "| $i | \`$(printf '%s' "$c" | cut -c1-90 | tr '|' '/')\` | $m | $s |"
done <<<"$CMDS"
echo
[ $rc -eq 0 ] && echo "**XANH: $i/$i lệnh suite thoát 0 trên commit gộp thử.**" || echo "**ĐỎ: có lệnh suite thoát khác 0 — nhật ký ở $RA/NN.log.**"
exit $rc
