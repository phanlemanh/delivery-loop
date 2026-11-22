#!/usr/bin/env bash
# Răng của hồ sơ tcg1-ghim-moc-truoc-vong — lệnh chấm theo luật lệnh hồ sơ (tệp trong thư mục hồ sơ, không khoá nào
# trong _acceptance/config.yaml). Dùng: bash _acceptance/tcg1-ghim-moc-truoc-vong/rang/do.sh <ghim|dot|vang|thong-diep|hat-giong>
#
# Hai cây thử dựng bằng `git init` + alternates trỏ kho đối tượng của kho đang kiểm (không `git worktree`, không chạm ref
# của kho thật), và đặt `refs/remotes/origin/main` TƯỜNG MINH — chính origin/main là mốc trạng thái nhánh mà vòng này sửa:
#   cây PR      = HEAD + một commit rỗng; origin/main := đầu nhánh chính của kho đang kiểm (origin/main, vắng thì main)
#   cây gộp thử = đầu nhánh chính rồi `merge --no-ff` HEAD (HEAD đã là tổ tiên thì giữ nguyên); origin/main := HEAD cây ấy
# Chiều đỏ dùng bản tệp ca ở commit CỐ ĐỊNH 678572f0 (trước sửa), không dùng origin/main.
# Mỗi phán quyết một dòng «OK: …» hoặc «FAIL: …». Thoát 0 = đạt · 1 = đỏ · 2 = không chạy được. Đường suy từ vị trí tệp.
set -u
NHOM="${1:-}"
DAY="$(cd "$(dirname "$0")" && pwd)"
GOC="$(cd "$DAY/../../.." && pwd)"
MOC=50840764d39b317d02eb4d881917bd128d67c86f
CA_CU=678572f02f89dff349fc0d78471433cb190e8dcc
HAT="$GOC/docs/plans/2026-11-22-hat-giong-moc-so-sanh-theo-trang-thai-nhanh.md"
HOP="$DAY/../contract.md"
SLUG=tcg1-ghim-moc-truoc-vong
DOT_TEN="TCG-10-M0 TCG-10-bo-kiem-chi-muc TCG-10-bo-kiem-ignore TCG-10-tat-di-nhanh-moi TCG-10-khoa-sai-la-tat TCG-10-them-vo-dieu-kien TCG-10-quet-tra-da-xoa TCG-10-quet-doc-khoa-rieng TCG-10-bo-so-goc TCG-10-ghi-de-hang-cu TCG-10-them-khi-du TCG-10-dem-nham-slug TCG-10-moc-moi-tep TCG-10-day-khi-khong-doi TCG-10-day-nhanh-mac-dinh TCG-10-im-chu-thich TCG-10-im-tai-lieu TCG-10-im-ho-so-rong"

DO=0
ok() { echo "OK: $*"; }
fail() { echo "FAIL: $*"; DO=1; }
het() { echo "do.sh: $*" >&2; exit 2; }
g() { git -C "$1" "${@:2}"; }
gid() { git -c user.email=rang@tcg1 -c user.name=rang -C "$1" "${@:2}"; }

TMP="$(mktemp -d "${TMPDIR:-/tmp}/tcg1-rang-XXXXXX")" || het "không tạo được thư mục tạm"
trap 'rm -rf "$TMP"' EXIT
HEAD_SHA="$(g "$GOC" rev-parse HEAD)" || het "không đọc được HEAD của $GOC"
CHUNG="$(cd "$GOC" && cd "$(g "$GOC" rev-parse --git-common-dir)" && pwd)/objects"
[ -d "$CHUNG" ] || het "không thấy kho đối tượng $CHUNG"
MAIN_SHA=""
for r in origin/main main; do MAIN_SHA="$(g "$GOC" rev-parse --verify -q "$r^{commit}")" && break; MAIN_SHA=""; done
[ -n "$MAIN_SHA" ] || het "không tìm được đầu nhánh chính (origin/main, main) ở $GOC"

# Kho git rỗng mượn đối tượng của kho đang kiểm (alternates): ref đặt bằng tay, không fetch.
kho_muon() { mkdir -p "$1" && git init -q "$1" && echo "$CHUNG" > "$1/.git/objects/info/alternates"; }
dung_cay_pr() {
  local d="$TMP/cay-pr"; kho_muon "$d" || return 1
  g "$d" checkout -q --detach "$HEAD_SHA" && gid "$d" commit -q --allow-empty -m "pr gia (rang tcg1)" \
    && g "$d" update-ref refs/remotes/origin/main "$MAIN_SHA" || return 1
  echo "$d"
}
dung_cay_gop() {
  local d="$TMP/cay-gop"; kho_muon "$d" || return 1
  g "$d" checkout -q --detach "$MAIN_SHA" || return 1
  if ! g "$d" merge-base --is-ancestor "$HEAD_SHA" HEAD; then gid "$d" merge -q --no-ff --no-edit "$HEAD_SHA" >/dev/null || return 1; fi
  g "$d" update-ref refs/remotes/origin/main "$(g "$d" rev-parse HEAD)" || return 1
  echo "$d"
}
# In sha và ghim quan hệ ref của từng cây.
quan_he() {
  local ten="$1" d="$2" h o; h="$(g "$d" rev-parse HEAD)"; o="$(g "$d" rev-parse refs/remotes/origin/main)"
  echo "cay $ten: HEAD=$h origin/main=$o"
  if [ "$ten" = gop ]; then [ "$h" = "$o" ] && ok "cay gop: origin/main == HEAD" || fail "quan he ref sai: cay gop origin/main != HEAD"
  else { [ "$h" != "$o" ] && g "$d" merge-base --is-ancestor "$o" "$h"; } && ok "cay pr: origin/main la to tien, khac HEAD" || fail "quan he ref sai: cay pr"; fi
}
# Chạy ca node:test theo mẫu tên trong một cây; in TAP vào biến RA.
chay_ca() { RA="$(cd "$1" && env -u NODE_TEST_CONTEXT -u TCG_GOC -u TCG_GIT_GOC "${@:4}" node --test --test-reporter=tap --test-name-pattern="$3" "$2" 2>&1)"; MA=$?; }
co_ok() { printf '%s\n' "$RA" | grep -qE "^ok [0-9]+ - $1( |$)"; }
co_not_ok() { printf '%s\n' "$RA" | grep -qE "^not ok [0-9]+ - $1( |$)"; }

nhom_ghim() {
  local ten d
  for ten in pr gop; do
    d="$(dung_cay_$ten)" || { fail "khong dung duoc cay $ten"; continue; }
    quan_he "$ten" "$d"
    grep -qF "MOC_TRUOC_VONG = '$MOC'" "$d/tests/scripts/tcg-ban-do.test.mjs" && ok "cay $ten: tep ca khai MOC_TRUOC_VONG = $MOC" \
      || fail "cay $ten: tep ca khong khai MOC_TRUOC_VONG = $MOC"
    chay_ca "$d" tests/scripts/tcg-ban-do.test.mjs '^TCG-1(?![0-9])'
    for ca in TCG-1 TCG-1-bat; do co_ok "$ca" && ok "cay $ten: $ca xanh" || { fail "cay $ten: $ca khong xanh"; printf '%s\n' "$RA" | grep -E '^not ok|FAIL|error:' | head -5; }; done
    printf '%s\n' "$RA" | grep -qE '^# fail 0$' || fail "cay $ten: co ca do (# fail khac 0)"
    # Chiều đỏ: bản ca ở commit cố định trước sửa, đặt cạnh tệp ca thật (cùng gốc suy từ vị trí).
    g "$GOC" show "$CA_CU:tests/scripts/tcg-ban-do.test.mjs" > "$d/tests/scripts/tcg-ban-do-cu.test.mjs" || { fail "khong lay duoc ban ca $CA_CU"; continue; }
    chay_ca "$d" tests/scripts/tcg-ban-do-cu.test.mjs '^TCG-1(?![0-9])'
    if [ "$ten" = gop ]; then
      { co_not_ok TCG-1 && printf '%s\n' "$RA" | grep -q 'khong co ban truoc vong'; } && ok "doi chung do: ban ca cu do «khong co ban truoc vong» o cay gop" \
        || fail "doi chung do mat: ban ca cu khong do «khong co ban truoc vong» o cay gop"
    else
      { co_not_ok TCG-1-bat && printf '%s\n' "$RA" | grep -q 'phep so khong thay thay doi cua vong'; } && ok "doi chung do: ban ca cu do TCG-1-bat o cay pr" \
        || fail "doi chung do mat: ban ca cu khong do TCG-1-bat o cay pr"
    fi
  done
  # CI có đối tượng commit ghim: mọi actions/checkout của job manh và tests khai fetch-depth: 0.
  local kq; kq="$(node -e '
    const t = require("fs").readFileSync(process.argv[1], "utf8").split("\n"); let job = null; const out = [];
    t.forEach((l, i) => { const m = l.match(/^  ([\w-]+):\s*$/); if (m) job = m[1];
      if ((job === "manh" || job === "tests") && /uses:\s*actions\/checkout/.test(l)) {
        const sau = t.slice(i + 1, i + 5).join("\n"); out.push(job + (/fetch-depth:\s*0\b/.test(sau) ? ":ok" : ":nong")); } });
    console.log(out.join(" "));' "$GOC/.github/workflows/gate.yml")"
  case " $kq " in *" manh:ok "*) ;; *) fail "checkout nong: manh (thay: $kq)";; esac
  case " $kq " in *" tests:ok "*) ;; *) fail "checkout nong: tests (thay: $kq)";; esac
  case "$kq" in *nong*) fail "checkout nong: $kq";; "") fail "khong doc duoc buoc checkout nao trong gate.yml";; *) ok "gate.yml: moi checkout cua manh, tests co fetch-depth: 0 ($kq)";; esac
}

nhom_dot() {
  local ten d n ca
  for ten in pr gop; do
    d="$(dung_cay_$ten)" || { fail "khong dung duoc cay $ten"; continue; }
    quan_he "$ten" "$d"
    chay_ca "$d" tests/scripts/tcg-mutants.test.mjs '.*'
    [ "$MA" = 0 ] && ok "cay $ten: tcg-mutants thoat 0" || fail "cay $ten: tcg-mutants thoat $MA"
    n="$(printf '%s\n' "$RA" | sed -n 's/^# pass \([0-9]*\)$/\1/p')"
    [ "$n" = 18 ] && ok "cay $ten: # pass 18" || fail "so ca lech: cay $ten # pass ${n:-?} (can 18)"
    printf '%s\n' "$RA" | grep -qE '^# fail 0$' || fail "cay $ten: co ca do"
    for ca in $DOT_TEN; do co_ok "$ca" || fail "thieu ca $ca (cay $ten)"; done
    printf '%s\n' "$RA" | grep -E '^not ok' | head -5
  done
}

nhom_vang() {
  local d
  d="$TMP/du"; kho_muon "$d" && g "$d" update-ref --no-deref HEAD "$HEAD_SHA" || het "khong dung duoc kho du"
  chay_ca "$GOC" tests/scripts/tcg-ban-do.test.mjs '^TCG-1(?![0-9])' TCG_GIT_GOC="$d"
  { co_ok TCG-1 && co_ok TCG-1-bat; } && ok "(a) du lich su: hai ca xanh (doi chung duong)" || fail "(a) du lich su: hai ca khong xanh"
  # Clone nông qua file:// (đường thường thì git bỏ qua --depth): HEAD của bản clone là đầu nhánh của cây đang kiểm.
  d="$TMP/nong"; git clone -q --depth 1 "file://$GOC" "$d" 2>/dev/null || het "khong clone nong duoc"
  g "$d" cat-file -e "$MOC^{commit}" 2>/dev/null && het "kho nong van co commit $MOC — thu nghiem vo hieu"
  chay_ca "$GOC" tests/scripts/tcg-ban-do.test.mjs '^TCG-1(?![0-9])' TCG_GIT_GOC="$d"
  { co_not_ok TCG-1 && co_not_ok TCG-1-bat && printf '%s\n' "$RA" | grep -q "khong co commit moc $MOC"; } \
    && ok "(b) clone nong: hai ca do «khong co commit moc $MOC»" || { fail "(b) clone nong: khong do dung thong diep"; printf '%s\n' "$RA" | grep -E '^not ok|error:' | head -4; }
  d="$TMP/mo-coi"; kho_muon "$d" || het "khong dung duoc kho mo coi"
  g "$d" update-ref --no-deref HEAD "$(gid "$d" commit-tree "$HEAD_SHA^{tree}" -m 'mo coi (rang tcg1)')" || het "khong tao duoc commit mo coi"
  chay_ca "$GOC" tests/scripts/tcg-ban-do.test.mjs '^TCG-1(?![0-9])' TCG_GIT_GOC="$d"
  { co_not_ok TCG-1 && co_not_ok TCG-1-bat && printf '%s\n' "$RA" | grep -q "moc $MOC khong phai to tien cua HEAD"; } \
    && ok "(c) HEAD mo coi: hai ca do «khong phai to tien cua HEAD»" || { fail "(c) HEAD mo coi: khong do dung thong diep"; printf '%s\n' "$RA" | grep -E '^not ok|error:' | head -4; }
  printf '%s\n' "$RA" | grep -qE '^# (skip|todo) [1-9]' && fail "co ca skip/todo"
}

nhom_thong_diep() {
  local dong; dong="$(grep -F "['tat-di-nhanh-moi'," "$GOC/tests/scripts/tcg-mutants.test.mjs")"
  [ -n "$dong" ] || { fail "khong thay phan tu NHAT tat-di-nhanh-moi"; return; }
  for m in "lech byte" "tinh huong khop" "$MOC" "doi MOC_TRUOC_VONG ve goc cua vong do"; do
    case "$dong" in *"$m"*) ok "ghim nhat tat-di-nhanh-moi chua «$m»";; *) fail "ghim nhat tat-di-nhanh-moi thieu «$m»";; esac
  done
  chay_ca "$GOC" tests/scripts/tcg-mutants.test.mjs '^TCG-10-(M0|tat-di-nhanh-moi)( |$)'
  co_ok TCG-10-M0 && ok "TCG-10-M0 xanh (doi chung)" || fail "TCG-10-M0 khong xanh"
  co_ok TCG-10-tat-di-nhanh-moi && ok "TCG-10-tat-di-nhanh-moi xanh: thong diep do that chua chuoi ghim" || fail "TCG-10-tat-di-nhanh-moi khong xanh"
}

# Kiểm một tệp hạt giống; in mỗi lỗi một dòng «tham chieu khong tro moc: <ref>» / khác; trả 0 khi sạch.
kiem_hat() {
  local f="$1" loi=0 refs n ref tep so dau
  grep -qE "^Gốc:[[:space:]]*[^[:space:]]+/_acceptance/$SLUG" "$f" || { echo "thieu dong Goc tro _acceptance/$SLUG"; loi=1; }
  refs="$(grep -oE 'tests/[A-Za-z0-9_./-]+:[0-9]+' "$f" | sort -u)"; n="$(printf '%s\n' "$refs" | grep -c .)"
  [ "$n" -ge 14 ] || { echo "chi ke $n tham chieu (can >= 14)"; loi=1; }
  for ref in $refs; do
    tep="${ref%:*}"; so="${ref##*:}"; dau=$((so > 3 ? so - 3 : 1))
    [ -f "$GOC/$tep" ] || { echo "tham chieu tro tep khong co: $ref"; loi=1; continue; }
    sed -n "${dau},$((so + 3))p" "$GOC/$tep" | grep -qE 'merge-base|origin/main|origin/HEAD|HEAD~1|HEAD\^' || { echo "tham chieu khong tro moc: $ref"; loi=1; }
  done
  return $loi
}
nhom_hat_giong() {
  [ -f "$HAT" ] || { fail "thieu hat giong $HAT"; return; }
  local ra; ra="$(kiem_hat "$HAT")" && ok "hat giong: Goc dung, moi tham chieu tro dong co moc" || { fail "hat giong:"; printf '%s\n' "$ra"; }
  grep -qF "$(basename "$HAT")" "$HOP" && ok "hop dong trich ten tep hat giong" || fail "hop dong khong trich ten tep hat giong"
  # Chiều đỏ: dời số dòng tham chiếu đầu sang một dòng mà cửa sổ ±3 không có chuỗi mốc.
  local dau tep L sao
  dau="$(grep -oE 'tests/[A-Za-z0-9_./-]+:[0-9]+' "$HAT" | sort -u | head -1)"; tep="${dau%:*}"; L=4
  while sed -n "$((L - 3)),$((L + 3))p" "$GOC/$tep" | grep -qE 'merge-base|origin/main|origin/HEAD|HEAD~1|HEAD\^'; do L=$((L + 7)); done
  sao="$TMP/hat-sao.md"; sed "s#${dau}#${tep}:${L}#" "$HAT" > "$sao"
  ra="$(kiem_hat "$sao")"
  printf '%s\n' "$ra" | grep -qF "tham chieu khong tro moc: ${tep}:${L}" && ok "doi chung do: ban sao doi dong ${dau} -> ${tep}:${L} bi bat" \
    || fail "doi chung do mat: ban sao doi dong ${dau} khong bi bat"
}

case "$NHOM" in
  ghim) nhom_ghim ;;
  dot) nhom_dot ;;
  vang) nhom_vang ;;
  thong-diep) nhom_thong_diep ;;
  hat-giong) nhom_hat_giong ;;
  *) het "nhóm lạ «$NHOM» — ghim · dot · vang · thong-diep · hat-giong" ;;
esac
[ "$DO" = 0 ] && echo "KET QUA: $NHOM dat" || echo "KET QUA: $NHOM do"
exit "$DO"
