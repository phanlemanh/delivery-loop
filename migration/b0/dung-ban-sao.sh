#!/usr/bin/env bash
# Đo thử B0 — dựng ba bản sao của kit rồi chạy bộ kiểm trên cả ba.
#   A  nguyên vẹn, đủ lịch sử (đối chứng)
#   B  cùng nội dung, chỉ một commit
#   C  như B, bỏ thêm hồ sơ vòng và năm thư mục sổ làm việc
# Dùng:  dung-ban-sao.sh <thư mục tạm TRỐNG> [mã commit hoặc nhánh, mặc định main]
# Sau khi cả ba chạy xong:  python3 tach.py <thư mục tạm>/out
# Ba bản chạy song song, mỗi bản một TMPDIR riêng. Trên máy 14 nhân mất khoảng một giờ.
set -euo pipefail
S="${1:?cần một thư mục tạm trống}"; REF="${2:-main}"
DAY="$(cd "$(dirname "$0")" && pwd)"
KIT="https://github.com/phanlemanh/acceptance-gate-kit.git"
[ -z "$(ls -A "$S" 2>/dev/null)" ] || { echo "thư mục $S không trống" >&2; exit 2; }
mkdir -p "$S/out"; cd "$S"

git clone --quiet "$KIT" A
git -C A checkout --quiet "$REF"
SHA="$(git -C A rev-parse HEAD)"
echo "A @ ${SHA:0:8} · $(git -C A rev-list --count HEAD) commit"

for v in B C; do mkdir "$v"; git -C A archive HEAD | tar -x -C "$v"; done

( cd C
  find _acceptance -mindepth 1 -maxdepth 1 -type d -exec rm -rf {} +
  rm -rf docs/plans docs/superpowers docs/findings docs/handoff docs/research )

for v in B C; do
  ( cd "$S/$v"
    git init -q -b main
    git config user.email b0@thu.local; git config user.name b0; git config commit.gpgsign false
    git add -A; git commit -qm "nhập từ acceptance-gate-kit@${SHA:0:8} (đo thử B0, bản $v)"
    git clone -q --bare . "$S/$v-origin.git"
    git remote add origin "$S/$v-origin.git"; git fetch -q origin
    git branch -q --set-upstream-to=origin/main main
    echo "$v: $(git ls-files | wc -l | tr -d ' ') tệp" )
done

for v in A B C; do
  nohup bash "$DAY/chay.sh" "$S/$v" "$S/out/$v" > "$S/out/$v.nohup" 2>&1 &
  echo "$v đang chạy, pid $!"
done
echo "Theo dõi: tail -f $S/out/*/ketqua.tsv   (mỗi bản xong thì dòng cuối là XONG)"
