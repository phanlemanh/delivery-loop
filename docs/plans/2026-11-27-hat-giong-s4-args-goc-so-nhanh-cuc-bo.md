# Hạt giống — `s4-args` lấy nhánh chính CỤC BỘ đã cũ làm gốc so

Gốc: delivery-loop/_acceptance/bang-chung-cu-theo-dau-vao/ — vấp ở bước chuẩn bị lượt chấm 1 của vòng DL2, 26/11/2026;
sổ quyết định của hồ sơ có dòng ghi cách lách.

Trạng thái: SỔ, không phải cam kết. Chưa thiết kế, chưa có ô.

## Chuyện đã xảy ra

- Cây vòng là worktree mới cắt từ `origin/main`. Nhánh `main` cục bộ của bản sao thì đứng yên ở `a2198fcf`, tụt 120 commit.
- `s4-args.mjs` tìm gốc so bằng merge-base với nhánh chính và chọn nhánh cục bộ, nên vùng vật của lượt chấm phình từ 23 lên
  217 tệp. Hội đồng tìm lỗi sẽ soi cả trăm tệp không thuộc vòng, tốn token và đẻ lỗi ngoài vật.
- Cách lách trong vòng: khai `--diff-base 8817a5bf…` (bản gốc vòng) bằng tay. Máy không tự nhận ra gốc so đã cũ; người chạy
  phải tự để ý con số 217.

## Vì sao không làm trong DL2

Phạm vi DL2 đã duyệt chỉ gồm vị từ «bằng chứng cũ theo đầu vào» và bước kiểm khi tiếp tục vòng. Sửa cách `s4-args` chọn gốc
so là đổi hành vi của mọi lượt chấm ở mọi kho, nên phải cân trên mọi kho trước (luật «sửa vì sự cố của một kho»).

## Hướng nghiệm, chưa chọn

- Ưu tiên ref theo dõi từ xa (`origin/<nhánh chính>`) khi nó có và mới hơn nhánh cục bộ; chỉ dùng nhánh cục bộ khi không
  có remote.
- Hoặc giữ cách chọn cũ nhưng in một dòng cờ khi nhánh cục bộ tụt sau ref từ xa, kèm số commit tụt và lệnh khai `--diff-base`.
- Phép thử trước khi chọn: kho nào đang dựa vào việc so với nhánh cục bộ (ví dụ kho không có remote, hay remote đặt tên khác)?
