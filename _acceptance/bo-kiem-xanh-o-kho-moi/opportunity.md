---
schema_version: 1
slug: bo-kiem-xanh-o-kho-moi
feature: «Bộ kiểm của kit xanh trên cây do kịch bản chuyển nhà dựng, không bớt ca nào của kho cũ — kịch bản đổi đường dẫn trong tệp kiểm bằng phép biến đổi cơ học, chỗ cần sửa ngữ nghĩa đi về kho cũ»
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Phan Le Manh
decided_at: 2026-11-14T00:00:00Z   # chủ kho gọi tên 14/11 «Mở B2 và gọi chéo» (lời chuyển qua phiên giữ đợt); máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

> Mở 14/11/2026 ở kho `delivery-loop`, nhánh `claude/b2-bo-kiem-xanh-o-kho-moi-3db198` cắt từ `chuyen-nha` `49cc4876`.
> Chủ kho gọi đích danh 14/11: «Mở B2 và gọi chéo» — B2 là vòng này; «gọi chéo» là một vòng SONG SONG ở kho cũ
> (phiên khác) theo `migration/hat-giong-goi-cheo-loi-dieu-phoi.md`. Không đưa vào lộ trình (`docs/plans/lo-trinh-kit.json`
> không có hàng này; lệnh mở-từ-hàng thoát 1, như B1). Hạng T2 theo `migration/KE-HOACH.md` mục 12 (bảng dãy B), trần 3
> lượt gọi người.

## Vấn đề & ai gặp

Gốc: delivery-loop/_acceptance/kich-ban-chuyen-nha — hồ sơ B1 tự ghi việc này ở `## Out of scope` («Làm bộ kiểm xanh trên cây mới, đổi đường dẫn trong bộ kiểm và trong `_acceptance/config.yaml` của cây mới — vòng B2») và đo đầu vào ở `migration/kich-ban/ket-qua/lop-do.md`.

Cây do kịch bản B1 dựng (`don-nha/3.0`) không chạy được bộ kiểm của chính nó: tệp kiểm trỏ các thư mục sản phẩm ở chỗ cũ.
B1 đếm **1 787 ca đỏ thêm** — nhưng chỉ đếm dòng `FAIL`. Đo lại 14/11 bằng túi khoá ca (bảng thời gian từng ca của bộ
chạy) trên chính lượt đo của B1: cây cũ có **5 550 khoá đạt**, cây mới còn **248** — **thiếu 5 302 (≈ 95 %)**; phần chênh
là ca không chạy tới vì tệp kiểm chết trước dòng kết quả đầu tiên. Bộ `workflows` (1 036 ca) và bước bản đồ sản phẩm chết
hẳn, báo cáo B1 ghi mỗi bộ «1 ca». Chính đây là giới hạn Ngoài-3/Ngoài-7 của B1.

Người gặp, theo thứ tự trả giá:

- **Chủ kho** — không cắt được mốc 3.0 (B3) khi bộ kiểm ở kho mới không xanh: không có gì chứng rằng kho mới giữ nguyên
  tính năng.
- **Quỹ hàng** — kho nhận 3.0 đầu tiên; nó cài một cây chưa ai kiểm được.
- **Mọi vòng sau ngày cắt** ở kho mới — chạy trên một bộ kiểm đã bị bớt ca mà không ai thấy, nếu thước không giữ đủ khoá.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Phần lớn ca thiếu là đường dẫn thuần — đổi cơ học được | phải sửa tay hàng trăm tệp kiểm, hoặc đẩy cả bộ kiểm sang kho cũ | thêm 13 liên kết lối cũ vào một bản sao cây mới rồi chạy sáu bước: ca còn thiếu = phần KHÔNG phải đường dẫn | Đang đo 14/11 |
| 2 | Phần còn lại (tên đổi, ngữ nghĩa) liệt kê được thành danh sách việc cho kho cũ trước lượt chấm | lỗi kho cũ lộ giữa lượt chấm như MC-11 ở B1 | đọc phần dư của phép thử 1 | Chờ phép thử 1 |
| 3 | Túi khoá ca so được qua bảng tên mà không lẫn khoá chứa đường tạm, mã commit | thước đỏ giả hoặc im giả | thước hai chiều trên fixture do bộ chạy thật sinh | Vật của vòng |

## Ngưỡng chết / ngưỡng UAT

Không đo được — vòng không có người dùng cuối: vật nằm ở `migration/`, không vào bản cài nào. Ngưỡng thật của đợt nằm ở mốc
3.0 (`migration/KE-HOACH.md` mục 12, «Ngưỡng thực tế»).

**Ngưỡng «phình»:** kế hoạch ghi «hơn một phần ba số ca đỏ thì dừng, trình chủ kho». Chủ kho đã được trình con số 1 787 /
~5 416 ≈ 33 % và bảo mở (14/11). Con số đúng đo theo khoá là ≈ 95 %; nó lên thẻ Cổng Phạm vi kèm kết quả phép thử 1 — không
thành lượt gọi riêng.

## Kết quả prototype

Không dựng prototype. Phép thử 1 (bản sao có liên kết lối cũ) là phép đo, không phải vật.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Kịch bản chuyển nhà và các thước B1 | `migration/kich-ban/` (B1 đã ký `2ca6d76c`) | logic | có — sửa trong vòng này | — |
| Bảng tên | `migration/chay-thu-phien/bang-ten.json` (chốt ở Cổng Phạm vi B1) | logic | có | — |

## Cổng 0

Đích của vòng là **gộp được**: vòng chỉ tính khi vật và hồ sơ đã vào `chuyen-nha` bằng commit gộp. Máy chỉ đẩy nhánh của
phiên; gộp là việc của phiên giữ đợt.

Máy ghi hộ Cổng Đáng từ lời gọi tên — không mời người riêng: câu «có làm không» chỉ còn một lối sống sau khi chủ kho đã gọi
tên vòng (trạm thu phí, không phải điểm quyết định). Cửa veto mở ở Cổng Phạm vi; ngoại lệ ghi hồ sơ ở kho này (tiền lệ B1)
hỏi ở đó.

- **decision = build** Căn cứ: chủ kho gọi tên 14/11 «Mở B2 và gọi chéo».
- **disposition = …** Căn cứ: không dựng prototype — bỏ trống.
- **Ngưỡng UAT chốt cùng lúc ký:** «Không đo được» ở mục Ngưỡng.

## Thước đo thành công → ứng viên criterion

Ba thước của B2 ở `migration/KE-HOACH.md` mục 12, cộng ba sửa từ giới hạn đã khai của B1:

- Sáu bước bộ kiểm xanh trên cây kịch bản dựng từ `kit-cu/main`.
- Cùng các ca ấy xanh ở kho cũ.
- Giữ đủ khoá ca: túi khoá cũ (qua bảng tên) nằm trọn trong túi khoá mới, trừ danh sách bỏ có lý do; thước hai chiều.
- Báo cáo lớp đỏ có chiều đỏ khi lượt chạy chết ngầm (Ngoài-3, Ngoài-7 của B1).
- `--nhanh` không ghi đè được `main`, `chuyen-nha` (Ngoài-1 của B1).
- Tệp trạng thái sống của đợt đổi không làm hồ sơ vòng hoá cũ.

## Out of scope từ khám phá

- Sửa ngữ nghĩa sản phẩm — ở kho cũ; vòng gọi chéo song song lo phần trong hạt giống, phần còn lại máy liệt vào một tệp
  trong `migration/` và báo phiên giữ đợt.
- Cắt mốc 3.0, đẩy `don-nha/3.0`, chuyển Quỹ hàng — B3.
- Mọi cài đặt GitHub, `/repo-setup:github`.
- Đổi chữ văn xuôi trong tài liệu sống, hồ sơ cũ `_acceptance/` của kho cũ.
