## Trong hợp đồng

- **DB-10 mutates the wrong writer line, so the E10 mutation tooth is red at HEAD (9/10)**
  AC: AC-8
  file: `_acceptance/chuyen-gop/rang/dot-bien.mjs:28`
  severity: high
  source: bugs
  detail: The DB-10 search string `so_do: SO_DO, may: DAU_MAY,` appears twice in plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs. Line 361 is the giu-quyen 'keo' event line and line 372 is the main mac-ky writer. `s.replace(tu, thanh)` with a string pattern only replaces the first match, so the mutant renames `may` on the keo line only. The writer that the 'AC-5 nhan biet mon mac-ky' case exercises is left untouched. Running `node _acceptance/chuyen-gop/rang/dot-bien.mjs` on HEAD gives: `FAIL: DB-10 bên ghi hàng 1 đổi tên trường may — không làm ca «AC-5 nhan biet mon mac-ky…» đỏ (mã 0; đỏ: không ca nào)` and `DB Results: 9 passed, 1 failed`, so E10's expected '10 passed, 0 failed' does not hold. Root cause is a class problem: the HẠ TẦNG guard only checks `s.includes(tu)` and never checks uniqueness, the 'cannot tell caught-the-bug from never-ran' pattern. Fix: require exactly one occurrence (exit 3 when the count is not 1) and make the DB-10 string unique, for example by including `di_theo: theo ?`.
  rationale: AC-8 đòi mười đột biến mỗi cái làm đỏ đúng ca đã ghim; chạy ở HEAD DB-10 không làm ca nào đỏ (9/10), nên vế này thất bại.

- **Hình dạng 4 (âm-tính-một-mình / bước tiêm thất bại): đột biến DB-10 sửa nhầm dòng sự kiện kéo, không sửa dòng mặc-ký nên không bao giờ làm ca đỏ**
  AC: AC-8
  file: `_acceptance/chuyen-gop/rang/dot-bien.mjs:133`
  severity: high
  source: measurement
  detail: DB-10 thay chuỗi 'so_do: SO_DO, may: DAU_MAY,' trong tro-ly-quyet-dinh.cjs bằng s.replace(tu, thanh) (dòng 150). Phép replace với chuỗi chỉ thay lần xuất hiện đầu tiên. Chuỗi này có ở hai dòng: dòng 361 (sự kiện kéo giữ-quyền, su_kien: 'keo') và dòng 372 (dòng mặc-ký di_theo: 'khuyen' mà coMacKy đọc). Bản đột biến chỉ sửa dòng 361, mà tệp ca chuyen-gop không bao giờ đi vào lối kéo, nên vật thật không bị phá. Phép kiểm hạ tầng ở dòng 149 (s.includes(tu)) chỉ hỏi chuỗi có mặt hay không, không hỏi có duy nhất không. Chạy lại ở HEAD: 'FAIL: DB-10 … không làm ca «AC-5 nhan biet mon mac-ky…» đỏ (mã 0; đỏ: không ca nào)' và 'DB Results: 9 passed, 1 failed'. E10 đòi '10 passed, 0 failed', còn gap-probe.md P1 ghi 'fixed … đột biến DB-10 làm hai ca AC-5 đỏ'. Lời khẳng định đó sai ở cây đang kiểm, nên chiều đỏ của mối nối từ bên ghi hàng 1 sang cửa proof chưa được chứng minh.
  rationale: Cùng lỗi với mục trên: AC-8 đòi mười đột biến đều làm đỏ đúng ca ghim, DB-10 không làm ca nào đỏ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **chuyen-gop.mjs adds a second `gh pr merge` call site, which breaks gop.mjs's stated single-merge-point rule**
  Người dùng thấy gì: Hôm nay gộp theo chuyến và gộp từng PR đi hai đường riêng. Nếu sau này thêm một chốt chặn mới ở một đường thì đường kia có thể bỏ sót, nên PR có thể được gộp mà chưa qua chốt đó.
  Căn cứ: Hiện cả hai đường đều đã có chốt chặn nên người dùng chưa bị ảnh hưởng, rủi ro chỉ xuất hiện khi sửa về sau và sửa lúc đó rẻ.
  file: `plugins/dispatch/scripts/chuyen-gop.mjs`
  severity: medium
  Đề xuất: known-limits

- **The `chuyen` event says the tally reads it, but `dem.mjs` never does, and the event does not record which PRs were merged**
  Người dùng thấy gì: Các PR được gộp qua chuyến không hiện trong bảng đếm số lần gộp, và nhật ký không cho biết PR nào đã vào nhánh chính khi chuyến dừng giữa chừng. Người dùng phải tự xem trên GitHub.
  Căn cứ: Không làm mất dữ liệu hay gộp sai, chỉ thiếu số liệu thống kê, và người dùng tự tra được trên GitHub.
  file: `plugins/dispatch/scripts/chuyen-gop.mjs`
  severity: low
  Đề xuất: known-limits

- **README's exit-code list for `chuyen` is missing exit 4 for 'main branch moved'**
  Người dùng thấy gì: Tài liệu hướng dẫn mô tả sai ý nghĩa một mã kết quả, nên người đọc có thể chờ tới giờ khởi hành trong khi thực ra phải chạy lại chuyến ngay.
  Căn cứ: Chỉ là chữ trong tài liệu, không ảnh hưởng nhánh chính, và sửa một dòng là xong.
  file: `plugins/dispatch/README.md`
  severity: low
  Đề xuất: known-limits

- **The same rule file is read from two places: the default-sign writer reads the PR branch, the merge gate reads main**
  Người dùng thấy gì: Một PR tự thu hẹp luật tự trị có thể khiến vài câu hỏi dành riêng cho chủ kho bị bỏ qua ở bước chốt phạm vi. Cửa gộp vẫn chặn tự gộp, nhưng câu hỏi đã không được hỏi.
  Căn cứ: Việc tự gộp vẫn bị chặn nên không có gì lọt vào nhánh chính, chỉ mất một lượt hỏi chủ kho, và chủ kho vẫn thấy được ở bước sau.
  file: `plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs`
  severity: low
  Đề xuất: known-limits

- **cua-proof.mjs hard-codes the `ontology/` path from one template's vocabulary**
  Người dùng thấy gì: Kho nào tình cờ có thư mục tên đó sẽ không được tự gộp cho PR chạm vào nó, dù luật của kho không đòi vậy. Người dùng phải gộp tay những PR này.
  Căn cứ: Sai theo hướng thận trọng, chỉ làm chậm chứ không gộp nhầm, và người dùng gộp tay được.
  file: `plugins/dispatch/scripts/cua-proof.mjs`
  severity: low
  Đề xuất: known-limits

- **An invalid or unreachable --base silently turns off the vung-lech (and second vung-high) check; the item still gets mac-ky**
  Người dùng thấy gì: Nếu mốc so sánh bị gõ sai hoặc không có trong bản clone nông, việc kiểm hồ sơ có đi ngoài vùng khai báo bị tắt âm thầm và mục vẫn được mặc-ký mà không có cảnh báo nào.
  Căn cứ: Có thể để một mục lẽ ra phải hỏi người lại được mặc-ký trong im lặng, người dùng khó tự phát hiện, nhưng cửa gộp phía sau vẫn chặn tự gộp.
  file: `plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs`
  severity: medium
  Đề xuất: new-contract

- **The `chuyen` event drops which PRs were actually merged, and the counting command never reads it**
  Người dùng thấy gì: Khi chuyến dừng giữa chừng, nhật ký không cho biết chính xác PR nào đã vào nhánh chính, và các PR gộp qua chuyến không được đếm.
  Căn cứ: Chỉ thiếu dấu vết thống kê, không mất hay gộp sai gì, và người dùng tra được trên GitHub.
  file: `plugins/dispatch/scripts/chuyen-gop.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (mối nối bên ghi với bên đọc được giữ bằng khuôn viết tay trong ca): kể cả khi DB-10 tiêm đúng chỗ, ca đỏ là do lệnh dò chuỗi của hàm trợ giúp, không phải do bên đọc coMacKy**
  Người dùng thấy gì: Phép thử nối bên ghi với bên đọc có thể đỏ vì một bước kiểm phụ chứ không vì bên đọc thật sự bỏ sót, nên bằng chứng ở chỗ này yếu hơn vẻ ngoài.
  Căn cứ: Chỉ làm bằng chứng thử nghiệm yếu đi chứ không đổi hành vi người dùng gặp, và sửa sau không đắt.
  file: `tests/dieu-phoi/chuyen-gop.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (khớp chuỗi trong khi lời hứa là một quan hệ): bộ so tên ca của bộ đột biến dùng startsWith, mà tên ca của DB-9 là tiền tố của tên một ca khác**
  Người dùng thấy gì: Bộ thử có thể báo đã làm đỏ đúng ca trong khi thực ra chỉ làm đỏ một ca có tên giống, nên một lỗi có thể bị đếm nhầm là đã bắt.
  Căn cứ: Chỉ là độ chính xác của phép thử, không ảnh hưởng người dùng trực tiếp, và hiện chưa có bằng chứng nó đã che lỗi nào.
  file: `_acceptance/chuyen-gop/rang/dot-bien.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3/5 (khẳng định đọc được khuôn thật bằng ngưỡng 'nhiều hơn', chỉ thử mẫu 5/16 mẫu high): ca không bắt được bộ đọc làm rơi mục**
  Người dùng thấy gì: Phép thử chỉ kiểm vài loại tệp nhạy cảm trong số mười sáu loại. Nếu bộ đọc luật làm rơi một loại khác thì PR chạm loại tệp đó có thể bị tự gộp mà không ai biết.
  Căn cứ: Có thể để lọt tự gộp ở tệp nhạy cảm nếu bộ đọc hỏng về sau, nhưng hiện chưa hỏng và thêm ca thử rẻ.
  file: `tests/dieu-phoi/chuyen-gop.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): ca chặn khi PR tự sửa luật tự trị chỉ kiểm duong === 'chan', không ghim thông điệp**
  Người dùng thấy gì: Phép thử không phân biệt được PR bị chặn vì đọc luật ở nhánh chính hay vì một lý do khác, nên bằng chứng cho chốt chặn này yếu hơn vẻ ngoài.
  Căn cứ: Hành vi chặn vẫn đúng và có đối chứng ở kho khác, chỉ là phép thử kém chặt, và sửa sau rất rẻ.
  file: `tests/dieu-phoi/chuyen-gop.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
