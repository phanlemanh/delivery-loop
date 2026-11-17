#!/usr/bin/env bash
# vi-phan-hai-kho.sh — AC-5 của release-3-0-0: phán quyết của bộ chặn gộp trên hồ sơ thật của hai kho tiêu thụ không đổi
# giữa kit ở thẻ v2.39.0 và lõi của cây đang đứng (HEAD). Thước và bộ phá thử hai chiều: migration/vi-phan/.
#
# Kho tiêu thụ đọc từ bản kéo trên máy: KHO_QUY_HANG (mặc định ~/onehub-quy-hang), KHO_CRM (mặc định ~/dev/crm). Bộ tự
# cắt cây làm việc tạm ở nhánh mặc định của origin (không commit, không đẩy) và gỡ khi xong. Tên hồ sơ của kho tiêu thụ
# không in ra (VI_PHAN_AN_TEN=1) — kho này có thể công khai.
# Thoát 0 đạt (0 lệch ở cả hai kho + bộ phá thử đạt) · 1 có lệch hoặc ca phá thử trượt · 2 không đọc được ở đây.
set -u
GOC="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "không đọc được ở đây: không phải kho git"; exit 2; }
THE_CU="v2.39.0"
T="$(mktemp -d "${TMPDIR:-/tmp}/vi-phan-XXXXXX")" || exit 2
CAY=()
don() { local c k; for c in "${CAY[@]:-}"; do [ -n "$c" ] || continue; k="${c%%|*}"; git -C "$k" worktree remove --force "${c#*|}" >/dev/null 2>&1; done; [ -d "$T" ] && rm -rf "$T"; }
trap don EXIT
git -C "$GOC" rev-parse -q --verify "refs/tags/$THE_CU" >/dev/null || { echo "không đọc được ở đây: kho không có thẻ $THE_CU"; exit 2; }
git -C "$GOC" worktree add -q --detach "$T/kit-cu" "$THE_CU" || { echo "không đọc được ở đây: không dựng được cây kit $THE_CU"; exit 2; }
CAY+=("$GOC|$T/kit-cu")
MOI="$GOC/plugins/acceptance-gate"
export VI_PHAN_AN_TEN=1
rc=0
for cap in "quy-hang|${KHO_QUY_HANG:-$HOME/onehub-quy-hang}" "crm|${KHO_CRM:-$HOME/dev/crm}"; do
  ten="${cap%%|*}"; kho="${cap#*|}"
  if ! git -C "$kho" rev-parse --git-dir >/dev/null 2>&1; then echo "không đọc được ở đây: không có bản kéo $ten tại $kho"; exit 2; fi
  nhanh="$(git -C "$kho" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null)" || { echo "không đọc được ở đây: $ten không có origin/HEAD"; exit 2; }
  git -C "$kho" worktree add -q --detach "$T/$ten" "$nhanh" || { echo "không đọc được ở đây: không dựng được cây $ten ở $nhanh"; exit 2; }
  CAY+=("$kho|$T/$ten")
  echo "== $ten @ $(git -C "$T/$ten" rev-parse --short HEAD) ($nhanh)"
  node "$GOC/migration/vi-phan/vi-phan.mjs" --kho "$T/$ten" --base "$nhanh" --kit "cu-$THE_CU=$T/kit-cu" --kit "moi-HEAD=$MOI" --ra "$T/ra-$ten" --ban-do | grep -v '^  đọc ' ; m=${PIPESTATUS[0]}
  echo "vi-phan $ten: thoát $m"
  [ "$m" = 0 ] || { [ "$m" = 2 ] && exit 2; rc=1; }
  node "$GOC/migration/vi-phan/tu-kiem.mjs" --kho "$kho" --ref "$nhanh" --base "$nhanh" --cu "$T/kit-cu" --moi "$MOI" --tam "$T"; m=$?
  [ "$m" = 0 ] || { [ "$m" = 2 ] && exit 2; rc=1; }
done
[ "$rc" = 0 ] && echo "vi-phan-hai-kho: đạt — 0 phán quyết lệch ở hai kho, bộ phá thử hai chiều đạt"
exit "$rc"
