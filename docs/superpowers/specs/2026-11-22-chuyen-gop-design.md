# chuyen-gop — thiết kế

Hàng 2 của thí điểm «trợ lý quyết định» (đặc tả chủ kho duyệt 22/11/2026, chép ở
`docs/findings/2026-11-22-tro-ly-quyet-dinh.md`). Hàng 1 (`mac-ky-co-phu-quyet`) dựng mặc-ký; mô phỏng của đặc tả cho thấy
mặc-ký một mình dời nút nghẽn sang hàng đợi gộp — hàng này là nửa còn lại.

## Vật

Hai mô-đun mới trong gói điều phối (`plugins/dispatch/scripts/`):

- `chuyen-gop.mjs` — `gom` (cửa sổ tính từ PR đạt bằng chứng sớm nhất, `chuyen_gop.cua_so_phut`) · dựng chuyến từ đỉnh
  nhánh chính trong một worktree tạm, gộp lần lượt đầu nhánh từng PR theo thứ tự đạt bằng chứng (PR xung đột với phần đứng
  trước rớt, có tên) · chạy `chuyen_gop.lenh_kiem` MỘT lần trên ngọn · ngọn đỏ thì `tachDoi`: chia đôi tiền tố tìm PR đầu
  tiên làm chuyến đỏ (bất biến: tiền tố rỗng = nhánh chính xanh), PR ấy rớt, phần còn lại kiểm lại · xanh thì gộp từng PR
  bằng `gh pr merge --merge --match-head-commit <sha>`. Lõi `chayChuyen` không đọc thư mục đợt; lệnh `chuyen` bọc khoá
  merge, `tu_merge`, sự kiện `chuyen` như lệnh `gop`.
- `cua-proof.mjs` — đọc `governance/autonomy.yaml` (khuôn Repo Standards: `default`, `proof.check`, `low`, `high`) ở
  NHÁNH CHÍNH, tính tầng của PR = tầng cao nhất trên mọi tệp nó đổi, nhận biết hồ sơ mang món mặc-ký trên đầu nhánh (dòng
  máy `"may":"mac-ky"` đi theo khuyến nghị, chưa dòng người nào quyết lại; hồ sơ chưa có chữ ký người ở Cổng Bằng chứng).
  Mặc-ký qua cửa khi và chỉ khi: luật tồn tại ∧ khai `proof.check` ∧ check ấy xanh trên đúng đầu nhánh ∧ tầng `low`.

`gop.mjs` (`xetGop`) và `chayChuyen` cùng hỏi cửa proof; hồ sơ không mang mặc-ký không đọc luật tự trị, phán quyết y như
trước vòng. `hinh-dang.mjs` nhận khoá `chuyen_gop: {bat, cua_so_phut, lenh_kiem}`; vắng = tắt.

## Lựa chọn

- Lệnh kiểm trên ngọn chạy CỤC BỘ trong worktree tạm (`lenh_kiem`), không đẩy nhánh chuyến lên để chờ CI — câu hỏi cho
  chủ kho ở sổ S1, khuyến nghị kèm giá.
- Tách đôi theo tiền tố: tìm PR ĐẦU TIÊN làm chuyến đỏ; hỏng do tổ hợp (mỗi PR một mình xanh) thì PR đứng sau rớt.
- Ngọn đỏ lần đầu → kiểm nhánh chính một lần: đỏ thì chuyến dừng (`chan`), không PR nào bị quy lỗi oan.
- Gộp chuyến xanh = gộp từng PR theo đúng thứ tự đã kiểm. Trước lần gộp đầu, lệnh lấy lại đỉnh nhánh chính: khác đỉnh lúc
  dựng (người gộp tay, kho khác gộp) → `nhanh-chinh-doi`, không gộp gì, chạy lại chuyến. Một lần gộp hỏng (đầu nhánh đổi,
  GitHub từ chối) → `gop-do-dang`, dừng ngay: gộp tiếp là một tổ hợp chưa ai kiểm. Không so lại cây SAU gộp — lúc ấy đã cam
  kết; lưới cuối là CI trên nhánh chính.
- Tầng của PR theo khuôn Repo Standards, kể cả khối `rules` (đọc nghiêng về an toàn: PR xoá tệp lấy tầng
  `test_deletions_raise_to`; PR chạm `ontology/` lấy tầng `agent_guard_removals_raise_to`). Ca đọc bản chép khuôn thật
  (`tests/dieu-phoi/fixtures/autonomy-repo-standards.yaml`).

## Không làm ở vòng này

- Gác đồng nhất liên dãy trước chuyến (lỗ 2 của đặc tả: hai món mặc-ký ở hai dãy mâu thuẫn nhau) — việc của giám sát.
- Khối «Trong đợt» của SKILL feature-loop chưa trỏ lệnh `chuyen`; LUẬT đợt của thí điểm chỉ dẫn thợ.
- Sửa `governance/autonomy.yaml` ở kho tiêu thụ nào — luật tự trị là của người.
