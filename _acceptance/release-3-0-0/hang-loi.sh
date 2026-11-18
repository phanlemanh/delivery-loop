#!/usr/bin/env bash
# hang-loi.sh — AC-6 của release-3-0-0: PR chạm lõi cưỡng chế của plugin lõi phải ra hạng T3 ở bố cục mới.
# Gốc: 17/11 đo trên cây kịch bản dựng, chạm plugins/acceptance-gate/lib/evidence-core.cjs ra T2 vì ba glob của
# _acceptance/config.yaml còn theo bố cục cũ (migration/vi-phan/README.md).
#
#   hang-loi.sh [<ref>]            đo trên <ref> (mặc định HEAD): hai tệp lõi phải T3, tệp đối chứng phải T2, ca đo skill
#                                  (plugins/acceptance-gate/evals/, khai T1 trong t1_skip_globs) phải T1
#   hang-loi.sh --hai-chieu <nền>  HEAD phải đạt VÀ <nền> (commit trước khi sửa glob) phải đỏ đúng thông điệp ghim; rồi
#                                  migration/vi-phan/duong-chet.mjs: HEAD 0 đường chết trên N > 0 chuỗi, nền đúng ba glob chết
# Mỗi phép đo: một cây làm việc tạm ở <ref>, một commit thử chỉ thêm một dòng vào đúng một tệp, rồi đọc `--hang-pr`
# của bộ chặn gộp CỦA CHÍNH cây ấy. Thoát 0 đạt · 1 lệch (mỗi dòng «LỆCH <tệp>: hang=<thấy>, cần <cần>») · 2 không chạy được.
set -u
GOC="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "hang-loi: không phải kho git" >&2; exit 2; }
CAN=(
  "plugins/acceptance-gate/lib/evidence-core.cjs T3"
  "plugins/acceptance-gate/hooks/hooks.json T3"
  "plugins/acceptance-gate/scripts/product-map.mjs T2"
  "plugins/acceptance-gate/evals/README.md T1"
)
do_mot() { # <ref> → in kết quả, trả 0/1/2
  local ref="$1" t rc=0 tep can thay cap
  t="$(mktemp -d "${TMPDIR:-/tmp}/hang-loi-XXXXXX")" || return 2
  git -C "$GOC" worktree add -q --detach "$t/cay" "$ref" 2>/dev/null || { echo "hang-loi: không dựng được cây ở $ref" >&2; rmdir "$t"; return 2; }
  for cap in "${CAN[@]}"; do
    tep="${cap% *}"; can="${cap#* }"
    if [ ! -f "$t/cay/$tep" ]; then echo "hang-loi: $ref không có $tep" >&2; rc=2; break; fi
    printf '\n// hang-loi: một dòng thử\n' >> "$t/cay/$tep"
    git -C "$t/cay" -c user.name=hang-loi -c user.email=hang-loi@delivery-loop.invalid commit --quiet --all --message "thử: chạm $tep" || { rc=2; break; }
    thay="$(cd "$t/cay" && bash plugins/acceptance-gate/scripts/pre-merge-check.sh . --base HEAD~1 --hang-pr 2>/dev/null | awk -F= '$1=="hang"{print $2}')"
    if [ "$thay" = "$can" ]; then echo "đạt $tep: hang=$thay"; else echo "LỆCH $tep: hang=${thay:-không đọc được}, cần $can"; [ "$rc" = 2 ] || rc=1; fi
    git -C "$t/cay" reset --quiet --hard HEAD~1
  done
  git -C "$GOC" worktree remove --force "$t/cay" >/dev/null 2>&1; rmdir "$t" 2>/dev/null
  return "$rc"
}
if [ "${1:-}" = "--hai-chieu" ]; then
  NEN="${2:?cần commit nền}"
  echo "== HEAD (phải đạt)"; do_mot HEAD; a=$?
  echo "== nền $NEN (phải đỏ ở hai tệp lõi)"; ra="$(do_mot "$NEN")"; b=$?; printf '%s\n' "$ra"
  [ "$a" = 0 ] || { echo "hang-loi: HEAD không đạt (mã $a)"; exit 1; }
  if [ "$b" = 1 ] && printf '%s\n' "$ra" | grep -q '^LỆCH plugins/acceptance-gate/lib/evidence-core.cjs: hang=T2, cần T3$' \
     && printf '%s\n' "$ra" | grep -q '^LỆCH plugins/acceptance-gate/hooks/hooks.json: hang=T2, cần T3$' \
     && printf '%s\n' "$ra" | grep -q '^đạt plugins/acceptance-gate/scripts/product-map.mjs: hang=T2$' \
     && printf '%s\n' "$ra" | grep -q '^LỆCH plugins/acceptance-gate/evals/README.md: hang=T2, cần T1$'; then
    echo "hang-loi: hai chiều đạt — HEAD xếp lõi cưỡng chế T3 và ca đo skill T1, nền $NEN xếp cả ba T2"
  else
    echo "hang-loi: chiều đỏ không ra đúng thông điệp ghim trên nền $NEN (mã $b)"; exit 1
  fi
  # Quét đường chết: rút từ sáu tệp cấu hình gốc, so cây cũ (kit-cu/main) với HEAD và với nền.
  git -C "$GOC" rev-parse -q --verify kit-cu/main >/dev/null || { echo "không đọc được ở đây: kho không có ref kit-cu/main"; exit 2; }
  dh="$(node "$GOC/migration/vi-phan/duong-chet.mjs" --kho "$GOC" --cu kit-cu/main --moi HEAD)"; x=$?; printf '%s\n' "$dh"
  dn="$(node "$GOC/migration/vi-phan/duong-chet.mjs" --kho "$GOC" --cu kit-cu/main --moi "$NEN")"; y=$?; printf '%s\n' "$dn"
  so="$(printf '%s\n' "$dh" | sed -n 's/^duong-chet: [0-9]* tệp cấu hình, \([0-9]*\) chuỗi đường, 0 đường chết$/\1/p')"
  if [ "$x" = 0 ] && [ "${so:-0}" -gt 0 ] && [ "$y" = 1 ] \
     && [ "$(printf '%s\n' "$dn" | grep -c '^ĐƯỜNG CHẾT _acceptance/config.yaml:[0-9]* · \(evals/\*\*\|hooks/\*\*\|lib/\*\*\) ·')" = 3 ]; then
    echo "hang-loi: đường chết hai chiều đạt — HEAD 0 trên $so chuỗi, nền đủ ba glob chết"; exit 0
  fi
  echo "hang-loi: quét đường chết không đạt (HEAD thoát $x, nền thoát $y)"; exit 1
fi
do_mot "${1:-HEAD}"
