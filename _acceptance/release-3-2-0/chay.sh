#!/usr/bin/env bash
# chay.sh (release-3-2-0) — lệnh riêng của hồ sơ mốc, một nhóm mỗi lần (luật lệnh hồ sơ, tep-chung-khong-chan-gop):
#   bash _acceptance/release-3-2-0/chay.sh <cua-so|dd-giu|goi-doi|lop-chep|ghim-lai|khoa-bat> [mốc]
# Mốc mặc định = commit gắn thẻ v3.1.1 (1193bc22). Gốc kho suy từ vị trí tệp này.
# Dùng lại công cụ của release-2-39-0 (cua-so.sh) và release-3-1-0 (goi-chi-doi-so.sh, lop-chep-doi.sh) — không dựng đường
# thứ hai. Nhóm `ghim-lai` gọi vị từ «bằng chứng còn mới» sẵn có của kit (pr-san-sang.mjs --chi-xet) cho từng hồ sơ của
# chiến dịch ghim lại; không tự so tệp. Thẻ v3.2.0 gắn vào commit gộp PR mốc (tiền lệ 3.1.0) nên mọi nhóm đo ở HEAD —
# không có cờ --dinh-moc của lối B (release-3-1-1).
set -o pipefail
cd "$(dirname "$0")/../.." || exit 2
NHOM="$1"; MOC="${2:-1193bc2203a47f7a5664999bd9b1259595baa1e3}"
# Sáu hồ sơ được ký trong cửa sổ v3.1.1..HEAD (Context của hợp đồng).
CUA_SO="bang-chung-cu-theo-dau-vao dac-ta-ux-doc-so-man doi-soat-ban-giao doi-ten-ban-uy-quyen giam-sat-doc-ban-uy-quyen nang-repo-setup-0-10-4"
# Năm hồ sơ của chiến dịch ghim lại. nang-repo-setup-0-10-4 KHÔNG ở đây: tiêu chí AC-7 của nó đo phạm vi diff của PR #34 so
# với một gốc ghi cứng, nhánh chính tiến thì đỏ theo định nghĩa — Notes của hợp đồng mốc nêu tên và lý do.
GHIM="${GHIM_LAI:-bang-chung-cu-theo-dau-vao dac-ta-ux-doc-so-man doi-soat-ban-giao doi-ten-ban-uy-quyen giam-sat-doc-ban-uy-quyen}"
case "$NHOM" in
  cua-so)  GIT_GLOB_PATHSPECS=1 bash _acceptance/release-2-39-0/cua-so.sh "$MOC" $CUA_SO ;;
  dd-giu)
    T=plugins/diagram-design/.claude-plugin/plugin.json
    c=$(git show "$MOC:$T" 2>/dev/null | grep -m1 '"version"'); m=$(grep -m1 '"version"' "$T")
    echo "moc: $c | HEAD: $m"
    [ -n "$c" ] || { echo "ĐỎ: mốc $MOC không có $T"; exit 1; }
    git diff --quiet "$MOC" HEAD -- plugins/diagram-design || { echo "ĐỎ: plugins/diagram-design có dòng đổi từ $MOC"; exit 1; }
    [ "$c" = "$m" ] || { echo "ĐỎ: số diagram-design đổi"; exit 1; }
    echo "XANH: diagram-design không đổi, giữ số" ;;
  goi-doi) bash _acceptance/release-3-1-0/goi-chi-doi-so.sh "$MOC" ;;
  lop-chep) bash _acceptance/release-3-1-0/lop-chep-doi.sh "$MOC" 3.2.0 ;;
  ghim-lai)
    rc=0; n=0
    for s in $GHIM; do
      n=$((n+1))
      out=$(node plugins/feature-loop/scripts/pr-san-sang.mjs --root . --slug "$s" --chi-xet --ag-root plugins/acceptance-gate 2>&1); m=$?
      if [ $m -eq 0 ]; then echo "còn mới: $s"
      else rc=1; echo "ĐỎ: bằng chứng của $s không còn mới ở HEAD (mã $m): $(printf '%s' "$out" | tail -1 | cut -c1-200)"; fi
    done
    [ $n -gt 0 ] || { echo "ĐỎ: danh sách chiến dịch rỗng"; exit 2; }
    [ $rc -eq 0 ] && echo "XANH: $n/$n hồ sơ của chiến dịch ghim lại còn mới ở HEAD"
    exit $rc ;;
  khoa-bat)
    # Đọc khoá bằng CHÍNH hàm của bên ghi (docKhoa của dinh-tuyen-may.cjs) — không chép luật đọc vào đây.
    node -e '
      const { docKhoa, KHOA } = require(process.cwd() + "/plugins/acceptance-gate/scripts/dinh-tuyen-may.cjs");
      let k; try { k = docKhoa(require("fs").readFileSync("_acceptance/config.yaml", "utf8")); }
      catch (e) { console.log("ĐỎ: " + e.message); process.exit(1); }
      if (!k.bat) { console.log("ĐỎ: khoá " + KHOA + " đang tắt"); process.exit(1); }
      console.log("XANH: khoá " + KHOA + " bật");' ;;
  *) echo "usage: chay.sh <cua-so|dd-giu|goi-doi|lop-chep|ghim-lai|khoa-bat> [mốc]" >&2; exit 2 ;;
esac
