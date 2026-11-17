#!/usr/bin/env bash
# chay-lai-do.sh — chạy lại MỘT lần, LẦN LƯỢT từng cây, riêng các bước đỏ ở CẢ HAI cây của một lượt đo (B2 AC-4).
#   Dùng: chay-lai-do.sh <thư mục đo của do-lop-do.sh>   (có A/delivery-loop, B/delivery-loop, out/A, out/B)
# Luật do chủ kho chọn («Chạy lại bước đỏ», 17/11, sổ hồ sơ bo-kiem-xanh-o-kho-moi): lượt đo chạy hai cây song song, và một ca
# nhạy tải (GT-07, đo chênh thời gian) đỏ ở cả hai cây vì chính lượt song song. Bước đỏ ở MỘT cây không bao giờ chạy lại —
# đó là tín hiệu «dọn nhà làm hỏng», phải giữ nguyên. Kết quả chạy lại ở out/<cây>-lai/ (cùng khuôn chay-bo-kiem.sh);
# bao-cao-giu-khoa.mjs giữ cả mã lần đầu lẫn mã chạy lại, và túi khoá của bước ấy lấy từ lần chạy lại.
# Thoát 0 khi đã xét xong (kể cả khi chạy lại vẫn đỏ — thước phán); 2 khi đã từng chạy lại hoặc thiếu kết quả lần đầu.
set -euo pipefail
T="${1:?cần thư mục đo}"
DAY="$(cd "$(dirname "$0")" && pwd)"
for v in A B; do
  grep -qx XONG "$T/out/$v/ketqua.tsv" 2>/dev/null || { echo "chay-lai-do: thiếu kết quả lần đầu của cây $v" >&2; exit 2; }
done
if [ -e "$T/out/A-lai" ] || [ -e "$T/out/B-lai" ]; then echo "chay-lai-do: đã chạy lại một lần — không chạy lần hai" >&2; exit 2; fi
# Bước đỏ ở cả hai cây: tên có mã khác 0 ở ketqua.tsv của A VÀ của B.
DO="$(awk -F'\t' 'FNR==1{f++} $0!="XONG" && $2!="0" {if (f==1) a[$1]=$2; else if ($1 in a) print $1}' "$T/out/A/ketqua.tsv" "$T/out/B/ketqua.tsv" | paste -sd, -)"
if [ -z "$DO" ]; then echo "chay-lai-do: không bước nào đỏ ở cả hai cây"; exit 0; fi
for v in A B; do CHI_BUOC="$DO" bash "$DAY/chay-bo-kiem.sh" "$T/$v/delivery-loop" "$T/out/$v-lai"; done
ma() { awk -F'\t' -v t="$1" '$1==t{print $2}' "$2"; }
IFS=, read -ra DS <<< "$DO"
for t in "${DS[@]}"; do
  echo "chay-lai-do: $t — lần đầu $(ma "$t" "$T/out/A/ketqua.tsv") · $(ma "$t" "$T/out/B/ketqua.tsv"), chạy lại lần lượt $(ma "$t" "$T/out/A-lai/ketqua.tsv") · $(ma "$t" "$T/out/B-lai/ketqua.tsv")"
done
