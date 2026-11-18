# Tra soát kho cũ — ba sổ cho vòng B1

Đo 12/11/2026 trên nhánh chính kho cũ `909dffd8`, Quỹ hàng `eedec225` (11/11), crm `74a29a68` (03/11 — nhánh mặc định đã
kéo mới; MacBook Pro không chạy crm từ 31/10). Kho này riêng tư; sổ có tên tệp của hai kho tiêu thụ — rà lại trước ngày
kho chuyển công khai. Đường dẫn máy trong chữ chép từ kho tiêu thụ đã được thay bằng `~/`.

Ba sổ đều **do máy sinh**: kho cũ đổi mỗi ngày, nên sổ viết tay cũ sau một đêm. Chạy lại bất cứ lúc nào (vài giây mỗi sổ):

```bash
node migration/tra-soat/kiem-ke.mjs && node migration/tra-soat/bo-kiem.mjs
```

```bash
node migration/tra-soat/kho-tieu-thu.mjs --kho <bản kéo Quỹ hàng> --ten quy-hang && node migration/tra-soat/kho-tieu-thu.mjs --kho <bản kéo crm> --ten crm
```

Trước khi chạy: `git fetch kit-cu` ở kho này và `git fetch` ở hai kho tiêu thụ — đo trên bản cũ là kết luận sai.
Kiểm hai chiều của chính các sổ: `node --test migration/tra-soat/*.test.mjs` (13 ca, khoảng 20 giây).

## Đọc nhanh — điều B1 phải biết

**1. Sản phẩm thật là 614 trên 5 725 tệp.** Kịch bản lần từ những gì Claude Code tự nạp của mỗi plugin (tệp khai, lệnh,
skill, tác tử, móc, workflow) theo các đường dẫn ghi trong chữ. Phần còn lại: 3 037 tệp hồ sơ vòng, 1 146 tệp bộ kiểm, 835
tệp sổ làm việc, 62 tài liệu sống, và vài tệp cấu hình. Theo plugin: lõi 285, `diagram-design` 214, điều phối 75,
`feature-loop` 29, `road-map` 7, `tri-thuc` 4. Hôm nay bản cài plugin lõi chép cả 5 725 tệp.

**2. 20 tệp «chưa rõ»** nằm trong vùng của một plugin mà không điểm vào nào gọi tới: 9 tệp mã nhập từ ngoài trong
`design-floor/vendor` mà bản dựng sẵn không dùng, ba tệp bảo trì của `diagram-design` (chỉ bộ kiểm gọi), ba script của
`feature-loop`, ba tệp của `vendor/impeccable`, và hai tệp thừa mốc 2.39 định xoá. Người thiết kế B1 xếp tay 20 tệp này;
danh sách ở `ket-qua/kiem-ke.tsv`, lọc lớp `chua-ro`.

**3. Bảy chỗ GÃY CHẮC trong kit khi mỗi plugin vào một thư mục riêng:** plugin lõi gọi thẳng vào thư mục của plugin điều
phối — `scripts/gui-tin-hieu.mjs` và `scripts/tin-hieu.mjs` import tương đối bốn tệp `dieu-phoi/scripts/…`, và lệnh
`acceptance-init` gọi ba tệp `${CLAUDE_PLUGIN_ROOT}/dieu-phoi/scripts/…`. Hôm nay chúng chạy chỉ vì plugin lõi mang cả kho.
Lưu ý: điều phối là plugin bật-theo-lựa-chọn, mà lõi lại phụ thuộc thẳng vào nó.

**4. 32 chỗ gọi chéo đi qua `resolve-plugin`** (tìm plugin kia trong bản cài) — sống sót khi chuyển thư mục, NHƯNG
`resolve-plugin` tìm theo tên chợ, nên đổi tên chợ phải đổi nó cùng lượt. 90 chỗ khác chỉ là chữ nhắc tên tệp của plugin khác.

**5. 82 con trỏ từ sản phẩm sang tệp không phải sản phẩm** (57 tệp sản phẩm): 44 tới sổ làm việc, 30 tới bộ kiểm, 8 tới tài
liệu sống. Phần lớn là chú thích; sau dọn nhà chúng treo trong bản cài. Thêm 64 con trỏ mơ hồ — tên tệp ở gốc như
`CLAUDE.md`, `PRODUCT-MAP.md` mà kho tiêu thụ cũng có, nên phần lớn nói về tệp của kho tiêu thụ.

**6. Không có đường dẫn khai chặt nào treo trong mã của kit.** Bảy import treo đều ở mã nhập từ ngoài
(`design-floor/vendor/design-os`) — mã ấy chỉ nhập một phần.

**7. Quỹ hàng (50 chỗ bám, 13 tệp).** Hai quy trình tự động kéo kho kit theo thẻ rồi coi **gốc kho kit là gốc plugin lõi**
(`ci.yml`, `ghim-lai-ban-that.yml`): sau dọn nhà, 11 chỗ gọi tệp của lõi và 4 chỗ gọi `feature-loop/scripts/…` qua gốc ấy
gãy. `packages/ui-lint/tim-kit.mjs` tìm kit trong sổ cài đặt theo khoá `<plugin>@<chợ>` — đổi tên chợ là nó không thấy kit.
Thêm: 7 khoá bật plugin, 1 chỗ gõ lệnh của plugin đổi tên.

**8. crm (655 chỗ bám, 77 tệp).** crm giữ **37 tệp chép từ kit** ở đúng đường dẫn của kit («lớp chép CI», 35 giống hệt bản
hôm nay): 237 chỗ gọi các bản chép ấy không gãy, nhưng nguồn chép đổi chỗ. 216 chỗ gọi lõi qua một biến gốc — đúng nếu
biến trỏ bản cài, gãy nếu trỏ bản kéo cả kho. 16 chỗ gọi tệp của `feature-loop` hay điều phối qua gốc lõi (gãy). 19 chỗ gõ
lệnh của `road-map`, `dieu-phoi`, `tri-thuc` (đổi tên). Quy trình `tin-hieu-gom.yml` kéo kho kit rồi cài plugin bằng tên
chợ cũ.

**9. Bộ kiểm: 273 trên 1 146 tệp gọi sản phẩm bằng đường dẫn tính từ gốc kho.** 118 trong số đó còn dựng bản cũ từ lịch sử
git — commit cũ mang bố cục cũ, nên đổi chuỗi đường dẫn thôi không đủ. Đây mới là đếm theo chữ; số ca đỏ thật chỉ biết khi
chạy bộ kiểm trên cây đã dọn nhà.

## Sổ nào ở đâu

| Tệp trong `ket-qua/` | Nội dung |
|---|---|
| `tom-tat.md` | Tóm tắt kiểm kê: theo lớp, theo plugin, chưa rõ, gọi chéo, con trỏ, treo |
| `kiem-ke.tsv` | Mỗi tệp một dòng (trừ hồ sơ vòng, sổ làm việc, bộ kiểm — chỉ đếm): lớp, plugin, đường vào |
| `tham-chieu-cheo.tsv` | Mỗi chỗ một plugin gọi tệp của plugin khác, kèm kiểu và số dòng |
| `con-tro-ra-ngoai.tsv` | Mỗi chỗ sản phẩm nhắc một tệp không phải sản phẩm |
| `tro-treo.tsv` | Đường dẫn khai chặt không trỏ vào tệp nào |
| `kho-quy-hang.md/.tsv`, `kho-crm.md/.tsv` | Chỗ bám của từng kho tiêu thụ, kèm hệ quả khi dọn nhà |
| `bo-kiem.md/.tsv` | Tệp kiểm gọi sản phẩm theo đường dẫn, có dựng bản cũ từ lịch sử hay không |

Luật xếp vùng không-phải-sản-phẩm: `luat-xep.json` — thêm một dòng ở đó là khai một vùng; bộ kiểm giữ cả hai chiều.

## Giới hạn

- **Lần theo chữ, không chạy mã.** Đường dẫn ghép bằng biến lúc chạy (không phải chuỗi) thì lọt; chữ nhắc trong chú thích
  thì được tính. Vì vậy lớp `chua-ro` cần người xếp, và `san-pham` có thể hơi rộng hơn thật.
- **Đổi tên lệnh và skill bên TRONG kit chưa đo** — sổ kho tiêu thụ đo phía kho tiêu thụ; chỗ kit tự gọi lệnh của chính nó
  bằng tên cũ là việc của kịch bản đổi tên.
- **Sổ kiểm kê và sổ kho tiêu thụ có bộ kiểm hai chiều** (`kiem-ke.test.mjs` 8 ca, `kho-tieu-thu.test.mjs` 5 ca; mỗi ca đã
  được phá thử một lần cho thấy nó đỏ). Sổ bộ kiểm (`bo-kiem.mjs`) chưa có — đối chứng tay 12/11 bằng một lần dò chữ: 11 tệp dò thấy mà sổ không có, cả 11 là thư viện riêng
  của bộ kiểm hoặc đường dẫn mẫu, không phải sản phẩm.
- **crm đo trên `74a29a68` (03/11)**, bản mới nhất của nhánh mặc định lúc đo.
