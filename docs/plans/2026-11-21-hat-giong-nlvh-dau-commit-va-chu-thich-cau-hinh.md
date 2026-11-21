# Hạt giống — ca NL-AC3-im đỏ sẵn trên nền, và chú thích cũ ở đầu cấu hình kho

Gốc: delivery-loop/_acceptance/loi-gop-trong-cau-ky/ — hai thứ thấy trên đường của vòng (21/11/2026), ngoài phạm vi
vòng, ghi theo đề bài «việc khác thấy trên đường ghi hạt giống, không làm».

1. **`NL-AC3-im` của `tests/scripts/nlvh-the.test.mjs` đỏ trên nền.** Ca tìm cặp commit chạm
   `plugins/acceptance-gate/scripts/gate-card.js` bằng dấu «(nhan-lan-v-theo-huong)» trong thông điệp. Ở bản sao
   `delivery-loop-main` không commit nào mang dấu ấy, nên ca in «khong tim duoc commit nao … (ban sao nong?)» rồi
   đỏ. Ca không nằm trong suite của kho nên lượt chấm không thấy. Đây là lớp «thước gắn vào lịch sử commit»: lịch sử
   đổi (chuyển kho, gộp dồn) thì phép đo chết mà vật không đổi. Nhát sửa: ca nhận cặp sha ghim sẵn trong hồ sơ của nó,
   hoặc khai không-chạy có tên khi lịch sử không còn dấu. Chiều đỏ: gỡ sha ghim → ca đỏ có tên. Chiều im: lịch sử có
   dấu thì ca chạy như cũ.
2. **Chú thích dòng 9 của `_acceptance/config.yaml`** còn dặn giải gói lõi bằng
   `resolve-plugin.mjs --plugin acceptance-gate --root .`, trong khi kho tự host gọi thẳng `plugins/acceptance-gate`.
   Sửa chữ một dòng; không đổi hành vi.
