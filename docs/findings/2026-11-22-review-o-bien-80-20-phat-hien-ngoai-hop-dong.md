# Review mã khi người đứng biên — cân 80/20 và một hạt giống đề nghị

22/11/2026. Phiên hỏi-đáp với chủ kho (MacBook Pro), đo trên nhánh chính `50840764`. Chủ kho hỏi: review mã ở kit nên thế
nào dưới mô hình người đứng biên, các đội đầu ngành đang làm gì, máy tự học ra sao, rồi bảo «tổng hợp, cân 80/20, đề xuất
đưa vào hạt giống».

Kết luận một dòng: trong mười một ý đã nêu, **một** ý chở gần hết tác động và chưa ai làm — định đoạt phát hiện ngoài hợp
đồng theo luật khai sẵn. Ba ý đã có người làm trong thí điểm «trợ lý quyết định» duyệt cùng ngày. Bảy ý còn lại chưa có số
đo nào đòi làm.

## 1. Bên ngoài đang làm gì (tóm)

- **Anthropic, đội Claude Code** (bài 15/10/2026): máy xếp tầng rủi ro theo chính thay đổi — thấp không cần người, vừa một
  người, cao hai người; đường nhạy cảm luôn cần người. Phát hiện của máy review phải qua bỏ phiếu mới được đăng, gắn nhãn
  *quan trọng / chi tiết nhỏ / có từ trước*. Sau ba vòng sửa thì đòi xem lại cách tiếp cận. Có hàng đợi gộp. Khoảng 59 %
  điều máy review báo lặp là mã có từ trước.
- **OpenAI** (bài 12/2025): mọi PR nội bộ được máy review; độ chính xác đặt trên độ phủ; 46–53 % bình luận dẫn tới sửa mã.
- **SpaceX** (nguồn cũ, gián tiếp): thủ tục do máy kiểm; tác giả chịu trách nhiệm tới khi nhánh chính xanh sau gộp.
- **Tự học của tác tử:** mô hình không nhớ giữa hai phiên, nên bài học phải nằm ở vật ngoài — tệp luật, kỹ năng, tri thức
  có nguồn, và thước. Thước là dạng bền nhất. Ghi vào trí nhớ phải qua cổng, vì máy tự chấm hay chấm cao.

Điểm chung: người không đọc mã để bắt lỗi; người xuất hiện theo rủi ro của thay đổi; vòng chỉ xong khi đã gộp.

## 2. Số đo trên chính kho này

Đo trên `review-findings.md` và `decisions.jsonl` của mọi hồ sơ trong `_acceptance/` (lệnh đo ở mục 6).

| Điều đo | Số |
|---|---|
| Hồ sơ có tệp phát hiện review | 224 |
| Trong đó có ít nhất một mục ngoài hợp đồng | 209 (93 %) |
| Số mục ngoài hợp đồng mỗi hồ sơ | trung vị 7 · p75 11 · nhiều nhất 43 |
| Quyết định của người về các mục ấy ở Cổng Bằng chứng | 1 211 quyết định, 163 hồ sơ |
| Kết cục: chỉ ghi lại (giới hạn đã biết, hoặc chấp nhận không sửa) | 1 017 (84 %) |
| Kết cục: mở việc mới (hợp đồng mới, hạt giống) | 164 (13,5 %) |
| Kết cục: sửa ngay trong vòng | 29 (2,4 %) |
| Người theo đúng đề xuất của máy, đo từng mục | 1 058 / 1 102 (96,0 %), 136 hồ sơ đánh số khớp |
| — mục mức thấp | 490 / 493 (99,4 %) |
| — mục mức vừa | 497 / 521 (95,4 %) |
| — mục mức cao | 70 / 87 (80,5 %) |

Hai điều rút ra.

**Một.** Lối máy-tự-thông ở Cổng Bằng chứng hầu như không dùng được. Bộ xét «không cần người» từ chối mọi hồ sơ còn mục
ngoài hợp đồng chưa có người định tuyến (`plugins/acceptance-gate/scripts/khong-can-nguoi.mjs`), và 93 % hồ sơ có mục như
vậy. Người bị gọi tới Cổng Bằng chứng chủ yếu để định tuyến, không phải để quyết.

**Hai.** Phần lớn việc định tuyến ấy là trạm thu phí theo đúng định nghĩa của hiến pháp. Ở mục mức thấp, người trả lời
khác máy 3 lần trong 493. Ở mục mức cao thì khác: cứ năm mục người đổi một. Ranh giới giữa «máy đi tiếp» và «câu hỏi thật»
nằm ở mức nặng và ở loại đề xuất, và ranh giới ấy máy đã tự tính sẵn trên từng mục.

Giới hạn của phép đo: đây là hồ sơ của chính kho kit, nặng việc meta. Số ở kho tiêu thụ có thể khác; phép đo 14/09 trên
26 hồ sơ crm cho 153 mục ngoài hợp đồng, tức khoảng 6 mục mỗi hồ sơ, cùng cỡ. 75 hồ sơ đánh số lệch hoặc thiếu sổ không
vào phép so từng mục.

## 3. Cân 80/20

Thước là ba dòng của North Star, dòng người đứng trước dòng máy: lượt gọi và công đọc của người · giờ từ làm-xong tới
gộp-được · token máy.

| # | Ý | Tác động | Giá | Xếp |
|---|---|---|---|---|
| 1 | Định đoạt mục ngoài hợp đồng theo luật khai sẵn | Bớt khoảng 84 % mục người phải đọc ở Cổng Bằng chứng; mở lối máy-tự-thông cho phần lớn hồ sơ | Nhỏ: cưỡi trên cơ chế mặc-ký của thí điểm, máy đã có sẵn đề xuất từng mục | **Làm — hạt giống ở mục 4** |
| 2 | Tầng rủi ro theo chính thay đổi | Lớn | — | Đang làm: thí điểm, hàng `mac-ky-co-phu-quyet` và cửa proof của `chuyen-gop` |
| 3 | Hàng đợi gộp | Lớn (đoạn ký→gộp) | — | Đang làm: hàng `chuyen-gop` |
| 4 | Máy học ở biên: án lệ, thăng cấp, giáng, kiểm mẫu | Lớn | — | Đang làm: hàng `mac-ky-co-phu-quyet` |
| 5 | Độ sâu khối tìm lỗi theo tầng rủi ro | Vừa, ở dòng máy: khối này ăn 83–89 % token khâu chấm (đo 14–15/09) | Vừa: đổi thành phần đường phán quyết, phải kèm răng hai chiều | Chờ: xem ngưỡng bên dưới |
| 6 | Làn bảo mật riêng, chặn được gộp | Chưa đo được: chưa có sự cố bảo mật nào trong sổ | Vừa | Không làm |
| 7 | Răng chống viết trùng vật đã có | Chưa đo: chưa ai đếm mã trùng | Chưa rõ | Không làm |
| 8 | Phát hiện lặp chảy ngược thành luật kho | Yếu theo số: mục ngoài hợp đồng rải trên 499 tệp, 65 tệp (13 %) mới gom được một nửa | Vừa | Không làm |
| 9 | Duyệt gắn commit, đếm đúng người ở kho nhiều người | Chưa có kho tiêu thụ nhiều người | Nhỏ | Không làm |
| 10 | Tự siết mức duyệt theo dòng hiệu chuẩn | Vòng giáng của thí điểm đã phủ ý này | — | Không làm |
| 11 | Ontology hình thức | Không tìm thấy số đo nào bên ngoài | Lớn, dễ đệ quy | Không làm |

Ngưỡng cho ý 5, đang đếm: sau khi thí điểm đọc số hai tuần, nếu token mỗi kết quả gộp không giảm trong khi lượt gọi
người đã giảm thì mở. Lý do chờ: tầng rủi ro là đầu vào của ý này và chưa gộp; và ý 1 đã bớt việc cho khối tìm lỗi nếu
làm trước.

Ba chỗ bản trả lời trong phiên nói sai hoặc thiếu, ghi lại cho đúng:
- «Làn máy-tự-thông không đọc danh sách phát hiện» — đã sửa từ trước. Bộ xét hiện đọc `review-findings.md` và từ chối khi
  còn mục chưa định tuyến. Hạt giống 20/09 về chỗ này đã có nghiệm.
- Tầng rủi ro và hàng đợi gộp đã được chủ kho duyệt và đang dựng trong thí điểm cùng ngày.
- Cơ chế máy học ở biên đã có thiết kế trong thí điểm: án lệ, thăng cấp theo số đo, giáng, kiểm mẫu.

## 4. Hạt giống đề nghị (nháp, chưa cắt thành tệp)

Chưa cắt thành tệp ở `docs/plans/` vì răng hiện có trên nhánh chính đòi mỗi hạt giống được một hồ sơ trích lại. Hồ sơ hợp
gốc nhất là `mac-ky-co-phu-quyet`, đang chạy ở phiên khác; phiên này không chạm thư mục của phiên đó. Khi vòng ấy tới Cổng
Bằng chứng, dòng «thấy trên đường, ngoài phạm vi» trong hợp đồng của nó trích tệp là đủ (tiền lệ 21/11).

> **Hạt giống — mục ngoài hợp đồng mức thấp và vừa đi theo đề xuất của máy, người phủ quyết trước khi gộp**
>
> Gốc: delivery-loop/_acceptance/mac-ky-co-phu-quyet/ — phần bù của thí điểm «trợ lý quyết định»; số đo ở
> `docs/findings/2026-11-22-review-o-bien-80-20-phat-hien-ngoai-hop-dong.md`.
>
> Thí điểm cho máy đi tiếp theo khuyến nghị ở các câu chỉ-người-quyết mà đảo được. Danh mục loại câu của nó chưa có mục
> ngoài hợp đồng của khâu chấm. Trong khi đó 93 % hồ sơ có mục như vậy, bộ xét «không cần người» từ chối mọi hồ sơ còn
> mục chưa định tuyến, và người theo đúng đề xuất của máy ở 96 % mục (mức thấp 99,4 %, mức cao 80,5 %).
>
> Hệ quả: mặc-ký ở Cổng Bằng chứng sẽ hiếm khi áp được, vì gần như hồ sơ nào cũng còn mục chờ người định tuyến. Giờ chờ
> người mà thí điểm cắt ở Cổng Phạm vi dồn lại ở Cổng Bằng chứng.
>
> Nhát sửa: thêm vào danh mục đóng của kit một loại câu «mục ngoài hợp đồng, máy đề xuất chỉ ghi lại, mức thấp hoặc vừa».
> Loại này đi theo mọi điều kiện mặc-ký sẵn có: kho bật cờ, không khó đảo, không chạm tầng cao của luật tự trị, lần đầu
> của loại và của vùng vẫn hỏi người, kiểm mẫu, một lần phủ quyết thì giáng. Thẻ in các mục ấy ở khối «đã đi theo khuyến
> nghị — phủ quyết trước khi gộp». Mục mức cao, mục máy đề xuất mở việc mới, và mục máy không đề xuất được vẫn là câu hỏi
> cho người như hôm nay. Bộ xét «không cần người» coi mục đã mặc-ký là đã định tuyến.
>
> Chiều đỏ: bản sao gỡ điều kiện mức nặng → một mục mức cao bị mặc-ký → ca đỏ, gọi tên mục. Chiều im: kho tắt cờ thì thẻ
> và bộ xét giữ nguyên từng byte; hồ sơ không có mục ngoài hợp đồng không đổi phán quyết.
>
> Trước khi mở vòng, đo lại MỘT số trên kho nhận thí điểm: tỉ lệ người theo đề xuất ở mục mức vừa. Dưới 90 % thì loại này
> chỉ nhận mức thấp. Đây là CỘNG (thêm một loại vào danh mục), cần chủ kho duyệt đích danh. Trace: nguyên tố 3, khoảnh
> khắc quyết thật; người hưởng là người ký Cổng Bằng chứng. Giá ước: một vòng T3 nhỏ sau khi hai hàng thí điểm gộp, vì
> chạm bộ xét «không cần người».

## 5. Điều kiện thi hành

Luật chiều rộng áp lên chính tệp này: đây là việc meta, mặc định đóng băng. Hạt giống trên là SỔ, chưa là cam kết. Nó chỉ
thành vòng khi chủ kho gọi tên, sau khi hai hàng thí điểm đã gộp và kho nhận đã cài. Bảy ý «không làm» không vào sổ nào
ngoài bảng ở mục 3.

## 6. Lệnh đo

Chạy ở gốc kho. In số cặp mục–quyết định, số cặp người theo đúng máy, và bảng theo mức nặng.

```
node -e '
const fs=require("fs"),path=require("path");const acc="_acceptance";
const cat=s=>{s=s.toLowerCase();return /known.?limit|giới hạn đã biết|chấp nhận|không sửa|wont/.test(s)?"ghi":/hợp đồng mới|hạt giống|new-contract/.test(s)?"moi":/sửa ngay|nâng phạm vi/.test(s)?"sua":"?"};
let recs=0,pairs=0,same=0;const bySev={};
for(const d of fs.readdirSync(acc)){const pf=path.join(acc,d,"review-findings.md"),pd=path.join(acc,d,"decisions.jsonl");
 if(!fs.existsSync(pf)||!fs.existsSync(pd))continue;const t=fs.readFileSync(pf,"utf8");const i=t.indexOf("## Ngoài hợp đồng");if(i<0)continue;
 const items=t.slice(i).split(/^- \*\*/m).slice(1).map(b=>({dx:(b.match(/Đề xuất:\s*(\S+)/)||[])[1],sev:(b.match(/severity:\s*(\w+)/)||[])[1]}));
 const dec={};for(const l of fs.readFileSync(pd,"utf8").split("\n")){if(!l.trim())continue;let j;try{j=JSON.parse(l)}catch{continue}
  if(j.stage!=="gate2")continue;const m=(j.decision||"").match(/^((?:Ngoài-\d+(?:\s*(?:,|và)\s*)?)+)\s*:?\s*(.*)/);if(!m)continue;
  for(const x of m[1].matchAll(/Ngoài-(\d+)/g))dec[+x[1]]=cat(m[2]);}
 const ns=Object.keys(dec).map(Number);if(!ns.length||Math.max(...ns)!==items.length)continue;recs++;
 for(const n of ns){const it=items[n-1];if(!it||!it.dx)continue;const a=cat(it.dx),b=dec[n];if(a==="?"||b==="?")continue;
  pairs++;if(a===b)same++;const k=(it.sev||"?")+":"+(a===b?"theo":"khac");bySev[k]=(bySev[k]||0)+1;}}
console.log({recs,pairs,same});console.log(bySev);'
```

## Nguồn ngoài

- Anthropic — How the Claude Code team does code review: https://claude.dev/blog/solving-code-review-at-anthropic/
- OpenAI — A Practical Approach to Verifying Code at Scale: https://alignment.openai.com/scaling-code-verification/
- Stack Overflow Blog — Testing software so it's reliable enough for space:
  https://stackoverflow.blog/2021/05/11/testing-software-so-its-reliable-enough-for-space/
- Thí điểm trong kho: `docs/findings/2026-11-22-tro-ly-quyet-dinh.md` (ở hai nhánh thí điểm, chưa vào nhánh chính).
