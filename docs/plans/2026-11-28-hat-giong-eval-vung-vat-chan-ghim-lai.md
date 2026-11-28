# Hạt giống — tiêu chí «vùng vật» của một hồ sơ chặn chiến dịch ghim lại, và dấu lượt đỏ chặn luôn PR chạy làn

Gốc: delivery-loop/_acceptance/release-3-2-0/ — chiến dịch ghim lại của mốc 3.2.0 (28/11/2026), làn
`repin-20261128T071601Z-73825`: ba trên năm hồ sơ ghim được; Notes của hợp đồng mốc trích lại tệp này.
**Cùng họ:** `2026-11-23-hat-giong-so-gioi-han-sau-luot-cham.md` (một bước của nghi thức chỉ lộ ra sau chữ ký).

**Trạng thái:** hạt giống (SỔ, chưa là ô). Ghi 28/11/2026 trong vòng mốc 3.2.0. Tệp này không mở vòng nào.
**Hạng dự kiến:** T2 nếu chỉ sửa khuôn eval và chỉ dẫn; T3 nếu chạm lưới trước-gộp.

## Điều đo được

Ba hồ sơ của cửa sổ 3.2.0 mang một tiêu chí đo «tệp vòng đổi nằm trong danh sách cho phép»:

| Hồ sơ | Tiêu chí | So với | Ở nhánh chính | Trên nhánh của vòng khác |
|---|---|---|---|---|
| `bang-chung-cu-theo-dau-vao` | AC-7 (E7) | `origin/main..HEAD` | xanh | đỏ — «16 tệp ngoài danh sách cho phép» |
| `doi-soat-ban-giao` | AC-9 (E9) | gốc chung của HEAD với nhánh chính | xanh | đỏ — «19 tệp đổi so với 36d29fed, 16 ngoài danh sách» |
| `nang-repo-setup-0-10-4` | AC-7 | gốc ghi cứng `87a392cd` | đỏ | đỏ |

Số đo: 28/11 trên `36d29fed` (nhánh chính) và trên `8c3b871f` (nhánh mốc, sau commit nâng số).

1. **Phép đo của một thời điểm nằm trong bộ eval của hồ sơ.** «Vòng này chỉ đổi tệp trong danh sách» đúng lúc vòng chạy, và
   chỉ đo được trên nhánh của chính vòng ấy. Làn ghim lại chạy MỌI eval máy của hồ sơ ở HEAD của nhánh đang đứng, nên hồ sơ
   mang tiêu chí ấy không bao giờ ghim được trong chiến dịch của một mốc — làn của mốc luôn chạy trên nhánh mốc, sau commit
   nâng số. Hai hồ sơ đầu chỉ ghim được bằng một làn chạy ngay trên nhánh chính; hồ sơ thứ ba không ghim được ở đâu.
2. **Dấu lượt đỏ kéo hồ sơ vào diff của PR.** Với cờ `--tung-ho-so --write`, làn ghi một dòng `repin-do` vào sổ chạy của
   hồ sơ đỏ. Lưới trước-gộp chấm mọi hồ sơ có tệp trong diff của PR, nên hai hồ sơ ấy — vốn cũ và nằm yên — thành hai
   VIOLATION «evidence is stale» chặn gộp PR mốc. Vòng mốc gỡ bằng cách trả hai sổ chạy về đúng bản ở nhánh chính; dấu vết
   còn ở commit `2eb9c77f`. Một làn chạy cho N hồ sơ mà một hồ sơ đỏ thì PR chạy làn bị chặn cho tới khi gỡ tay dấu đỏ.

## Hướng đã thấy (chưa kiểm)

- **Tiêu chí «vùng vật» khai là phép đo của vòng, không phải phép đo của vật.** Ứng viên: khuôn eval có một khoá nói «chỉ
  đo trên nhánh của vòng», làn ghim lại bỏ qua và nói ra như ô `status: not-run` (đường `evals_not_run` đã có). Một ứng
  viên khác: lệnh nhận gốc so và đầu so là commit ghi trong hồ sơ, nên đo lại được ở mọi nhánh.
- **Dấu `repin-do` không nằm trong cây của hồ sơ đã ký**, hoặc lưới trước-gộp không tính một hồ sơ là «trong diff» khi thay
  đổi duy nhất của nó là dòng `repin-do`. Cả hai đều chạm chỗ nhạy cảm (sổ chạy là bằng chứng; lưới là T3).
- **Chiều đỏ và chiều im cho phép đo sửa:** hồ sơ có tiêu chí vùng vật ghim được trên nhánh khác mà phá vật thật thì làn
  vẫn đỏ; hồ sơ đỏ trong làn nhiều hồ sơ không chặn PR khi các hồ sơ khác xanh.

## Soi theo luật của kit

- **Trace:** nguyên tố 2 (bằng chứng không tự dối — một pin không dời được thì hồ sơ nằm cũ mãi dù vật vẫn đúng) và North
  Star dòng ký→gộp (dấu đỏ thêm một bước gỡ tay sau làn). Người hưởng: người cắt mốc kit và kho tiêu thụ chạy chiến dịch
  ghim lại theo mốc.
- **Loại:** sửa đúng-sai ở khuôn eval và ở làn; nếu thêm khoá mới thì là CỘNG, cần chủ kho duyệt đích danh.
- **Cân trên mọi kho:** kho không viết tiêu chí vùng vật thì không đổi gì. Kho đã có hồ sơ mang tiêu chí ấy cần đường
  đọc-cũ: hồ sơ cũ không khai khoá mới vẫn chạy như hôm nay.
- **Ngưỡng mở ô:** ≥ 1 chiến dịch ghim lại nữa (ở kho kit hay kho tiêu thụ) có hồ sơ không ghim được vì tiêu chí vùng vật,
  hoặc ≥ 1 PR nữa bị lưới chặn vì dấu `repin-do` của một hồ sơ không thuộc việc của PR.
