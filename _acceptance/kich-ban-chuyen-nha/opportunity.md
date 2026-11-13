---
schema_version: 1
slug: kich-ban-chuyen-nha
feature: «Một kịch bản lấy nhánh chính kho cũ và sinh các commit dọn nhà lên trên nó — bố cục plugins/<tên>/, tên mới, khuôn Repo Standards — chạy lại mỗi khi kho cũ đổi, không sửa tay ở kho mới»
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-13T10:46:49Z   # chủ kho gõ «làm» một chạm 13/11, máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

> Mở 13/11/2026 ở kho `delivery-loop`, nhánh của phiên cắt từ `chuyen-nha` `8f5cefde`. Chủ kho gọi đích danh 13/11:
> «Mở B1 kiểu này» — một vòng feature-loop ở phiên riêng, không dùng phiên điều phối, KHÔNG đưa vào lộ trình
> (`docs/plans/lo-trinh-kit.json` không có hàng này; lệnh mở-từ-hàng thoát 1, đúng như vậy). Tầng T3 do chủ kho đặt
> (`migration/KE-HOACH.md` mục 12, bảng dãy B) — vật nằm ở `migration/`, ngoài `risk_tiers.t3_paths`, nên máy tự suy
> sẽ ra T2; vòng giữ T3 theo lời chủ kho, trần 4 lượt gọi người.

## Vấn đề & ai gặp

Gốc: acceptance-gate-kit/_acceptance/release-2-39-0 — hồ sơ mốc 2.39 tự ghi nó chặn đợt chuyển nhà và «vòng B1 của đợt chỉ mở khi mốc 2.39 đã được một kho tiêu thụ cài» (`contract.md` dòng 19–20); điều kiện ấy đạt 13/11 (Quỹ hàng PR #246 gộp `f1d123ee`).

Kit đang nặng ở chỗ không phải tính năng: plugin lõi lấy **cả kho** làm nguồn, nên mỗi bản cài chép 5 729 tệp, 101 MB
(bản cài 2.38.1 trên Mac Studio), trong đó sản phẩm thật là 610 tệp (sổ `migration/tra-soat/ket-qua/kiem-ke.tsv` chạy
lại 13/11 trên `0c4e503b` = v2.39.0). `doctor` của Repo Standards chấm kho 64/100, trượt `plugin_source_not_root`. Chủ
kho đã chốt 11/11: dựng lại ở kho mới `delivery-loop`, mang trọn lịch sử, giữ nguyên tính năng.

Người gặp, theo thứ tự trả giá:

- **Chủ kho** — người duy nhất sửa kit; hôm nay mọi đổi bố cục phải làm tay trên một kho đang chạy, và kho cũ đổi mỗi
  ngày nên một lần dọn tay cũ sau một đêm.
- **Mọi phiên Claude Code ở kho tiêu thụ** (Quỹ hàng, crm) — cài 101 MB để dùng 3–4 MB; tên chợ và tên lệnh Việt khó
  gõ, khó tra.
- **Quỹ hàng** — kho nhận 3.0 đầu tiên; nó chỉ cài được khi có một cây mới đứng yên, kiểm được, dựng lại được.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Dọn nhà làm được hoàn toàn bằng máy từ `kit-cu/main` (dời thư mục + đổi chữ theo bảng tên + chạy khuôn), không cần sửa tay | mỗi lần kho cũ đổi phải sửa tay lại → «chạy lại được» chết, đợt kéo dài vô hạn | sổ kiểm kê đã xếp 610 tệp sản phẩm theo plugin; 22 tệp `chua-ro` là phần duy nhất cần người xếp — xếp một lần vào bảng của kịch bản | Thử 12–13/11 bằng ba sổ tra soát — **ĐỨNG có điều kiện**: 7 chỗ lõi gọi thẳng thư mục điều phối phải đổi bằng mã, không bằng dời |
| 2 | Hai lần chạy trên cùng `kit-cu/main` cho cùng một cây | thước «chạy hai lần ra cùng một cây» không đặt được; B3 không biết cây nào là cây đã kiểm | so `git rev-parse HEAD^{tree}` của hai lần chạy | Chưa thử — vật của vòng |
| 3 | Một phiên thật mở trên chợ của cây mới nạp đủ 6 plugin, 33 lệnh và skill, 3 tác tử sau khi đổi qua bảng tên | đổi bố cục làm mất lệnh hay tác tử mà không bộ kiểm nào thấy | `migration/chay-thu-phien/chay-thu.mjs` (0 token, ~13 giây) | Nền đo 13/11 trên 2.39.0 — đạt so với 2.38.1; trên cây mới chưa có |
| 4 | Khuôn `repo-setup` 0.5.0 áp được SAU bước đổi bố cục mà không đè luật của kit | thêm tệp sai loại, hoặc `make test` trỏ tệp không có | `apply.py --adopt` chế độ thử trên cây đã dọn | Thử 11–12/11 trên cây CHƯA dọn: chạy sạch, `make validate` không kiểm plugin nào vì bố cục cũ — đúng chỗ B1 sửa |

## Ngưỡng chết / ngưỡng UAT

Không đo được — vòng không có người dùng cuối: vật là công cụ dọn nhà ở thư mục `migration/`, không vào bản cài nào. Ngưỡng
thật của đợt nằm ở mốc 3.0 (một vòng thật ở Quỹ hàng gộp được trên kit 3.0 — `migration/KE-HOACH.md` mục 12, «Ngưỡng thực
tế»); vòng này chỉ chịu ba thước máy của B1 ở mục dưới.

## Kết quả prototype

Không dựng prototype. Ba sổ tra soát, đo thử B0 và ca chạy thử phiên thật (dựng 11–12/11, nằm ở `migration/`) là phần khám
phá đã có; vật của vòng dựng trên chúng.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Khuôn kho plugin `claude-plugin`, mức `starter` | `phanlemanh/repo-standards` thẻ `repo-setup-v0.5.0` (`4dc53e0`) | triết-lý/logic | có — chỉ các tệp không đè luật kit; ranh giới ở `migration/NOI-REPO-STANDARDS.md` | — |
| Bảng tên plugin và lệnh | `migration/KE-HOACH.md` mục 3 → `migration/chay-thu-phien/bang-ten.json` (TẠM) | triết-lý/logic | có — chốt hẳn ở Cổng Phạm vi | — |

## Cổng 0

Đích của vòng là **gộp được**: vòng chỉ tính khi kịch bản và hồ sơ đã vào `chuyen-nha` — nhánh duy nhất nhận sửa tay của
kho này — bằng một commit gộp (không gộp dồn: kho mới đang cho gộp dồn, kit cấm, vì gộp dồn mất commit chữ ký). Máy chỉ
đẩy nhánh của phiên; bấm gộp là của người.

Ba điều máy đề xuất cho cách chạy, chủ kho quyết cùng chữ ký ở đây (chi tiết và lối khác lên thẻ Cổng Phạm vi):

1. **Hồ sơ `_acceptance/kich-ban-chuyen-nha/` đặt ở kho này, trên nhánh của phiên** — cạnh vật nó chấm. Đây là NGOẠI LỆ
   với luật «ở kho này chỉ sửa `migration/`» (`.claude/rules/chuyen-nha.md`). Giá: hồ sơ mới làm `product-map --check`
   đòi vẽ lại hai tệp máy vẽ `PRODUCT-MAP.md`, `LO-TRINH.html` trên nhánh này, và mỗi lần lấy `kit-cu/main` về
   `chuyen-nha` phải vẽ lại chúng một lần nữa (xung đột chỉ ở hai tệp ấy). Lối khác: hồ sơ ở kho cũ — kho công khai, xa
   vật, và lượt kiểm 58 phút của kho cũ chạy cho một vật không phải sản phẩm.
2. **Neo `Gốc:` trỏ `_acceptance/release-2-39-0/`** (dòng ở mục «Vấn đề» trên) — không có hạt giống hay hồ sơ nào khác ở
   kho cũ nhắc đợt này.
3. **Commit dọn nhà sinh lên nhánh riêng `don-nha/3.0` cắt từ `kit-cu/main`**, dựng lại từ đầu mỗi lần kho cũ đổi; chỉ
   nằm trên máy cho tới khi chủ kho bảo đẩy (B3). `main` và `chuyen-nha` không bị kịch bản chạm.

Một dòng hạ tầng: plugin kit trên máy là 2.38.1 (phạm vi người dùng) trong khi kho cũ đã 2.39.0; vòng chạy mọi lệnh của kit
từ chính cây 2.39.0 này (kho tự host), không tự nâng plugin trên máy.

- **decision = build** Căn cứ: chủ kho gõ «làm» 13/11 — nhận cả ba đề xuất cách chạy (hồ sơ ở kho này, Gốc trỏ release-2-39-0, nhánh `don-nha/3.0` cục bộ).
- **disposition = …** Căn cứ: không dựng prototype — bỏ trống.
- **Ngưỡng UAT chốt cùng lúc ký:** «Không đo được» ở mục Ngưỡng.

## Thước đo thành công → ứng viên criterion

Ba thước của B1 ở `migration/KE-HOACH.md` mục 12, cộng một số đo cho B2:

- Hai lần chạy kịch bản trên cùng `kit-cu/main` cho cùng mã cây.
- Mỗi tệp sản phẩm (lớp `san-pham` 610 tệp + 22 `chua-ro` đã xếp) có đúng một chỗ ở cây mới, hoặc nằm trong danh sách bỏ có
  lý do.
- Chạy thử phiên thật: cây cũ so cây mới qua bảng tên — không mất, không thừa.
- Số ca kiểm đỏ do đổi bố cục, theo lớp, trên cây mới — đầu vào cho B2 (B1 không làm bộ kiểm xanh).

## Out of scope từ khám phá

- Làm bộ kiểm xanh trên cây mới — vòng B2 `bo-kiem-xanh-o-kho-moi`; B1 chỉ đo.
- Sửa sản phẩm ở kho cũ — sản phẩm chỉ sửa ở `~/dev/acceptance-gate-kit` tới ngày cắt; kịch bản sinh cây mới, không chạm
  kho cũ.
- Chạy `/repo-setup:github` hay đổi bất kỳ cài đặt GitHub nào — `/repo-setup:github` luôn đặt chỉ gộp dồn, trái luật kit.
- Đẩy `don-nha/3.0` lên GitHub, cắt mốc 3.0, chuyển Quỹ hàng — vòng B3.
- Hai kho tiêu thụ (Quỹ hàng, crm) — không đổi gì ở đó trong vòng này.
