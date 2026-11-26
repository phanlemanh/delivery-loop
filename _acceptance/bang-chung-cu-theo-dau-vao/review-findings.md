# Review findings: bang-chung-cu-theo-dau-vao

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **pr-san-sang nạp bộ máy acceptance-gate mà không kiểm export: bộ máy cũ trả TypeError thô thay vì quay về luật cũ**
  Người dùng thấy gì: Ở kho dùng bản bộ máy kiểm cũ, lệnh mở PR có thể dừng với một thông báo lỗi khó hiểu thay vì lùi về luật cũ. Người dùng không bị mở PR sai, chỉ phải nâng bản bộ máy rồi chạy lại.
  Căn cứ: Hậu quả nhẹ vì lệnh dừng chứ không cho qua nhầm, không mất dữ liệu, người dùng tự gỡ được bằng cách nâng bản và thử lại.
  file: `plugins/feature-loop/scripts/pr-san-sang.mjs`
  severity: medium
  Đề xuất: known-limits

- **--chi-xet dùng chung thoát 2 cho «bằng chứng cũ» và «không so được verified_commit», mà SKILL đọc thoát 2 là bằng chứng cũ có danh sách tệp**
  Người dùng thấy gì: Khi commit đã ghim không còn trong kho (do gộp squash hoặc clone nông), bước kiểm khi tiếp tục vòng có thể hiểu nhầm là bằng chứng cũ và hạ hồ sơ sai lý do. Người dùng sẽ thấy vòng bị hạ không có danh sách tệp đổi thật.
  Căn cứ: Ca hiếm, hậu quả là hạ trạng thái chứ không lọt bằng chứng cũ, người dùng gỡ được bằng chấm lại; sửa cần đổi cả mã thoát lẫn khối SKILL nên đáng làm riêng.
  file: `plugins/feature-loop/scripts/pr-san-sang.mjs`
  severity: medium
  Đề xuất: known-limits

- **Vị từ đọc danh sách T1 bằng bộ đọc khác lưới (resolveConfigList so với configList): danh sách dạng inline cho kết luận ngược nhau**
  Người dùng thấy gì: Nếu kho khai danh sách tệp sinh tự động theo kiểu viết một dòng, lệnh mở PR coi bằng chứng còn mới trong khi lưới chặn gộp vẫn báo cũ. Người dùng sẽ mở PR rồi bị chặn lúc gộp, mất một vòng CI.
  Căn cứ: Chỉ xảy ra với cách viết cấu hình riêng, lưới cuối vẫn chặn nên không lọt hàng sai, người dùng gỡ bằng cách viết lại cấu hình dạng nhiều dòng.
  file: `plugins/feature-loop/scripts/lib/vat-doi-sau-pin.mjs`
  severity: medium
  Đề xuất: known-limits

- **Đối chứng dương BC-6-doi-chung và BC-4-doi-chung chỉ khẳng định «mã thoát khác 2»; thực chạy ra 3 (hạ tầng), nên mọi crash cũng qua**
  Người dùng thấy gì: Bộ kiểm có hai ca đối chứng khá lỏng nên nếu lệnh sập vì lý do khác thì ca vẫn xanh. Người dùng cuối không thấy gì, chỉ là độ tin của bộ kiểm thấp hơn mức nên có.
  Căn cứ: Không ảnh hưởng người dùng cuối, chỉ giảm độ tin của phép đo; sửa rẻ và có thể làm ở vòng sau.
  file: `tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **AC-7 đo theo origin/main..HEAD: kết quả phụ thuộc trạng thái ref remote của máy đo, không theo bản gốc vòng đã khai**
  Người dùng thấy gì: Nếu máy chạy kiểm chưa cập nhật nhánh chính từ xa, phép kiểm phạm vi có thể báo đỏ nhầm do dính commit của người khác. Người dùng chỉ cần cập nhật rồi chạy lại.
  Căn cứ: Chỉ gây báo đỏ nhầm, không lọt lỗi thật, người dùng tự gỡ được bằng cập nhật nhánh rồi chạy lại.
  file: `_acceptance/bang-chung-cu-theo-dau-vao/rang/ac7.mjs`
  severity: low
  Đề xuất: known-limits

- **Khối PR-SAN-SANG ở Gate 2 của SKILL không được cập nhật --ag-root cho kit tự host, trong khi khối Staleness guard thì có**
  Người dùng thấy gì: Khi chính kit tự chạy vòng của mình, bước mở PR có thể dùng bộ máy kiểm từ bản cài sẵn thay vì bản đang sửa, nên hai chỗ trong cùng quy trình có thể cho kết luận khác nhau.
  Căn cứ: Chỉ ảnh hưởng người bảo trì kit khi tự chạy vòng, hậu quả nhẹ và sửa một dòng chữ ở vòng sau.
  file: `plugins/feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Staleness guard (--chi-xet) không thấy code sửa nhưng chưa commit; luật cũ của SKILL và stale_files() của lưới đều thấy**
  Người dùng thấy gì: Khi tiếp tục vòng mà có tệp vật đã sửa nhưng chưa commit, bước kiểm vẫn báo bằng chứng còn mới và trình cổng trên bằng chứng cũ. Người ký có thể ký trên bằng chứng không còn đúng với mã thật.
  Căn cứ: Hậu quả vừa đến nặng vì người ký có thể tin nhầm bằng chứng, nhưng lưới chặn gộp phía sau vẫn bắt được; sửa rẻ và nên làm sớm.
  file: `plugins/feature-loop/scripts/pr-san-sang.mjs`
  severity: medium
  Đề xuất: new-contract

- **Đối chứng dương BC-6-doi-chung và BC-4-doi-chung chỉ khẳng định «không thoát 2»: lệnh sập cũng vẫn xanh**
  Người dùng thấy gì: Hai ca đối chứng của bộ kiểm chỉ loại trừ một mã thoát nên không chứng minh lệnh chạy tới cuối. Người dùng cuối không bị ảnh hưởng, chỉ là bộ kiểm kém chặt.
  Căn cứ: Không đụng người dùng cuối, chỉ giảm độ tin của phép đo; gộp sửa cùng lớp với các ca đối chứng lỏng khác.
  file: `tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): đối chứng dương của BC-6 và BC-4 chỉ assert «không thoát 2», mà mã thoát thật là 3, cũng là mã của một lần sập**
  Người dùng thấy gì: Đối chứng của bộ kiểm không phân biệt được lệnh chạy hết với lệnh sập sớm. Người dùng cuối không thấy ảnh hưởng, chỉ rủi ro bộ kiểm xanh giả.
  Căn cứ: Rủi ro nằm ở độ tin bộ kiểm chứ không ở sản phẩm, sửa rẻ, người dùng không bị mất gì.
  file: `tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: bộ ghi gh giả trên PATH (ghTrenPath) chưa có đối chứng dương, nên mọi assert «gh 0 lời gọi» qua CLI đều là âm-tính-một-mình**
  Người dùng thấy gì: Bộ kiểm chưa tự chứng minh công cụ ghi lời gọi có hoạt động, nhưng hiện nó vẫn chạy đúng. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Hiện không có lỗi thật, chỉ là khoảng hở về độ tin của phép đo, sửa sau rất rẻ.
  file: `tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4: BC-3-luoi coi việc thiếu dòng VIOLATION là phán quyết MỚI, không ghim rằng lưới đã chạy tới bước xét bằng chứng cũ**
  Người dùng thấy gì: Phép so với lưới chặn gộp có thể coi nhầm lưới dừng sớm là bằng chứng còn mới. Hiện chưa xảy ra và người dùng cuối không bị ảnh hưởng.
  Căn cứ: Không có hậu quả thật hôm nay, chỉ là phép đo có thể xanh giả sau này; sửa rẻ.
  file: `tests/workflows/bang-chung-cu-theo-dau-vao.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: tuyên vi phân bash↔JS giữ khớp cho cả lớp glob, nhưng các dạng `{a,b}`, `[!..]`, `[^..]`, `\x` chỉ có điểm-case với kỳ vọng viết tay**
  Người dùng thấy gì: Một vài kiểu viết mẫu tệp hiếm (ngoặc nhọn, phủ định, ký tự thoát) chưa được so trực tiếp giữa hai bên, nên có thể lệch mà không ai phát hiện. Ca thật rất ít gặp.
  Căn cứ: Dạng hiếm, lưới chặn gộp vẫn là chốt cuối nên không lọt hàng sai; mở rộng ma trận là việc rẻ nhưng không gấp.
  file: `plugins/feature-loop/scripts/lib/vat-doi-sau-pin.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3/4: chiều đỏ của AC-7 không tách được vế t3_paths với vế danh sách cho phép**
  Người dùng thấy gì: Phép kiểm phạm vi chưa chứng minh riêng vế chặn tệp nhạy cảm, vì vế danh sách cho phép đã đủ làm đỏ. Hiện kết quả vẫn đúng, người dùng không bị ảnh hưởng.
  Căn cứ: Không có kết quả sai hôm nay, chỉ là một vế của phép đo chưa được thử riêng; sửa rẻ khi cần.
  file: `_acceptance/bang-chung-cu-theo-dau-vao/rang/chay.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
