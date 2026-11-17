#!/usr/bin/env python3
"""phan-lop.py — chia lớp ca kiểm thiếu ở cây mới do đổi bố cục (B1 AC-10; tính lại theo TÚI KHOÁ ở B2 AC-5).

Dùng: phan-lop.py <thư mục đo> <mã nguồn> <mã cây mới>  > migration/kich-ban/ket-qua/lop-do.md
<thư mục đo>/out/{A,B}/ do migration/kich-ban/chay-bo-kiem.sh ghi (A = cây cũ, B = cây mới).
«Đỏ thêm» = khoá ĐẠT ở cây cũ mà không đạt ở cây mới (giu-khoa.mjs --json — cùng thước giữ đủ khoá ca), cộng một mục
`bo-chay` cho mỗi bộ chết ngầm (bộ không đo được, hay thoát khác 0 mà không in ca nào) và cho lượt chạy thiếu dòng XONG.
Ca thiếu có dòng đỏ ở cây mới → lớp theo dấu hiệu, đọc dòng đỏ cùng phần sau nó rồi phần trước nó (tới 12 dòng mỗi phía):
lich-su · duong-dan · ten-doi · khac; «khac» mà khối/tệp kiểm chứa nó có lỗi đường dẫn → cung-tep. Ca thiếu không có dòng
nào ở cây mới → khong-chay-toi (ca không chạy tới — B1 không thấy lớp này, Ngoài-3/7). Bước một-khoá thiếu → bo-chay.
"""
import datetime, json, os, re, subprocess, sys

DAY = os.path.dirname(os.path.abspath(__file__))

TEN_CU = ['acceptance-gate-kit', 'dieu-phoi', 'road-map', 'tri-thuc', 'cat-luot', 'gom-tin-hieu']
LOP = [
    ('lich-su', re.compile(r'not a valid object name|not a tree object|unknown revision|bad revision|ambiguous argument')),
    ('duong-dan', re.compile(r'FileNotFoundError|\b(got|exit|mã|ma|code)[ :=]*127\b|\b127 !==|!== 127\b|\[127\]|command not found|ENOENT|No such file|Cannot find module|MODULE_NOT_FOUND|not found|không tìm thấy|không có tệp|khong co tep|can\'t open file|cannot open')),
    ('ten-doi', re.compile('|'.join(re.escape(t) for t in TEN_CU))),
]
CHE = [(re.compile(r'/(?:private/)?var/folders/\S+'), '<tmp>'), (re.compile(r'/(?:private/)?tmp/\S+'), '<tmp>')]


def che(s):
    for re_, t in CHE:
        s = re_.sub(t, s)
    return s


def boi_canh(dong, mau):
    """(dòng FAIL, chữ SAU nó, chữ TRƯỚC nó) — mỗi cửa sổ tối đa 12 dòng, dừng ở dòng kết quả ca khác hay tiêu đề khối.
    Bộ chạy node in lỗi SAU dòng kết quả; bộ chạy bash in đầu ra của ca TRƯỚC dòng FAIL."""
    ke = re.compile(r'^\s*(FAIL|PASS|ok |not ok |[✗×✓])|^\s*(===|---) .+ (===|---)\s*$')
    goc = mau.strip()[:80]
    for i, d in enumerate(dong):
        if goc and goc in d:
            j = i + 1
            while j < len(dong) and j < i + 13 and not ke.match(dong[j]):
                j += 1
            h = i
            while h > 0 and h > i - 12 and not ke.match(dong[h - 1]):
                h -= 1
            return d, '\n'.join(dong[i + 1:j]), '\n'.join(dong[h:i])
    return mau, '', ''


def lop_ca(dong, mau):
    """Lớp của một ca đỏ + chữ mẫu: đọc dòng FAIL với phần SAU nó trước; không ra lớp nào thì đọc với phần TRƯỚC."""
    fail, sau, truoc = boi_canh(dong, mau)
    for phan in (sau, truoc):
        chu = che(fail + '\n' + phan)
        l = lop_cua(chu)
        if l != 'khac':
            return l, chu
    return 'khac', che(fail + '\n' + (sau or truoc))


def lop_cua(chu):
    for ten, re_ in LOP:
        if re_.search(chu):
            return ten
    return 'khac'


def doan_tep(dong, mau):
    """Đoạn nhật ký của tệp kiểm chứa ca (giữa hai dòng tiêu đề «=== <tệp> ===»)."""
    goc = mau.strip()[:80]
    i = next((k for k, d in enumerate(dong) if goc and goc in d), None)
    if i is None:
        return ''
    h = i
    while h > 0 and not re.match(r'^\s*(===|---) .+ (===|---)\s*$', dong[h]):
        h -= 1
    j = i + 1
    while j < len(dong) and not re.match(r'^\s*(===|---) .+ (===|---)\s*$', dong[j]):
        j += 1
    return '\n'.join(dong[h:j]) if h > 0 or re.match(r'^\s*(===|---) .+ (===|---)\s*$', dong[0] if dong else '') else ''


def doc_dong(thu, ban, bo):
    p = os.path.join(thu, 'out', ban, bo + '.log')
    return open(p, errors='replace').read().splitlines() if os.path.exists(p) else []


LOP_TEN = ['khong-chay-toi', 'duong-dan', 'cung-tep', 'ten-doi', 'lich-su', 'bo-chay', 'khac']


def main():
    thu, nguon, cay_moi = sys.argv[1:4]
    r = subprocess.run(['node', os.path.join(DAY, 'giu-khoa.mjs'), os.path.join(thu, 'out', 'A'), os.path.join(thu, 'out', 'B'), '--json'],
                       capture_output=True, text=True)
    if r.returncode not in (0, 1) or not r.stdout.strip():
        sys.stderr.write('phan-lop: giu-khoa.mjs không chạy được: ' + r.stderr[-400:] + '\n')
        sys.exit(2)
    g = json.loads(r.stdout)
    bo_cu, bo_moi = g['boCu'], g['boMoi']
    ten_bo = list(bo_cu) + [b for b in bo_moi if b not in bo_cu]
    so = {'nguon': nguon, 'cay_moi': cay_moi, 'bo': {}, 'lop': {k: 0 for k in LOP_TEN}}
    mau = {}

    def them_mau(l, bo, chu):
        ds = mau.setdefault(l, [])
        if sum(1 for m in ds if m.startswith(bo + ':')) < 2:
            ds.append(f'{bo}: ' + ' ⏎ '.join(x.strip() for x in che(chu).split('\n') if x.strip())[:400])

    for bo in ten_bo:
        a, b = bo_cu.get(bo, {}), bo_moi.get(bo, {})
        dong_b = doc_dong(thu, 'B', bo)
        truot_b = {}
        for k, raw in b.get('truot', []):
            truot_b.setdefault(k, raw)
        truot_a = {k for k, _ in a.get('truot', [])}
        thieu = [k for k in g['thieu'] if (k.split(': ', 1)[0] if ': ' in k else k) == bo]
        lop = {}
        khong_toi = 0
        for k in thieu:
            if k in truot_b:
                l, chu = lop_ca(dong_b, truot_b[k])
                if l == 'khac' and dict(LOP)['duong-dan'].search(doan_tep(dong_b, truot_b[k])):
                    l = 'cung-tep'
            elif b.get('loai') == 'mot-khoa' or a.get('loai') == 'mot-khoa':
                l, chu = 'bo-chay', f'bộ thoát {b.get("rc")}'
            else:
                l, chu, khong_toi = 'khong-chay-toi', k, khong_toi + 1
            lop[l] = lop.get(l, 0) + 1
            them_mau(l, bo, chu)
        chet = None
        if bo in g.get('khongDoMoi', []):
            chet = 'bộ không đo được (thiếu bảng thời gian hay nhật ký)'
        elif b and b.get('rc', 0) != 0 and b.get('so_dong', 0) == 0 and b.get('loai') != 'mot-khoa':
            chet = f'bộ thoát {b.get("rc")} mà không in ca nào'
        elif not b:
            chet = 'bộ không có ở lượt chạy cây mới'
        if chet:
            lop['bo-chay'] = lop.get('bo-chay', 0) + 1
            mau.setdefault('bo-chay', []).append(f'{bo}: {chet}')
        for l, n in lop.items():
            so['lop'][l] += n
        so['bo'][bo] = {'rc_cu': a.get('rc'), 'rc_moi': b.get('rc'), 'dat_cu': a.get('dat', 0), 'dat_moi': b.get('dat', 0),
                        'khong_chay_toi': khong_toi, 'do_ca_hai': len(truot_a & set(truot_b)),
                        'do_them': len(thieu) + (1 if chet else 0), 'lop': lop}
    for x in g.get('khongDoMoi', []):
        if x not in so['bo'] and x not in ten_bo:
            so['bo']['luot-chay'] = {'rc_cu': None, 'rc_moi': None, 'dat_cu': 0, 'dat_moi': 0, 'khong_chay_toi': 0, 'do_ca_hai': 0,
                                     'do_them': 1, 'lop': {'bo-chay': 1}}
            so['lop']['bo-chay'] += 1
            mau.setdefault('bo-chay', []).append(f'luot-chay: {x}')
    tong = sum(v['do_them'] for v in so['bo'].values())
    so['tong_do_them'] = tong
    ngay = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

    p = print
    p('---')
    p(f'nguon: {nguon}')
    p(f'cay_moi: {cay_moi}')
    p(f'do_luc: {ngay}')
    p('bo: [' + ', '.join(so['bo']) + ']')
    p(f'tong_do_them: {tong}')
    p('---')
    p('')
    p('# Lớp ca kiểm thiếu ở cây mới do đổi bố cục')
    p('')
    p('Máy sinh bởi `migration/kich-ban/do-lop-do.sh` → `ghi-bao-cao.sh` → `phan-lop.py` — đừng sửa tay, chạy lại. Cây cũ =')
    p('nguồn ở trên; cây mới = đỉnh `don-nha/3.0` dựng từ nguồn ấy. Mỗi cây một bản kéo riêng, cùng tên thư mục `delivery-loop`,')
    p('chạy các bước kiểm của việc `tests` trong `gate.yml` của chính cây (`chay-bo-kiem.sh`). «Đỏ thêm» tính theo TÚI KHOÁ')
    p('(`giu-khoa.mjs`): khoá đạt ở cây cũ mà không đạt ở cây mới — ca đỏ, ca SKIP, và ca không chạy tới —, cộng một mục cho mỗi')
    p('bộ chết ngầm. Ca đỏ ở cả hai cây không tính.')
    p('')
    p('**Giới hạn:** lớp của ca đỏ chia theo CHỮ của nhật ký quanh dòng đỏ, không chạy lại từng ca. «Cùng tệp» là ca không tự in')
    p('lỗi đường dẫn nhưng khối chứa nó có. Ca không chạy tới không có dòng nào để đọc nên không chia nhỏ hơn. Một lượt mỗi cây.')
    p('')
    p('| Bộ | Mã thoát cũ | Mã thoát mới | Đạt cây cũ | Đạt cây mới | Không chạy tới | Đỏ thêm |')
    p('|---|---|---|---|---|---|---|')
    for bo, v in so['bo'].items():
        p(f"| {bo} | {v['rc_cu']} | {v['rc_moi']} | {v['dat_cu']} | {v['dat_moi']} | {v['khong_chay_toi']} | {v['do_them']} |")
    p(f'| **tổng** | | | | | | **{tong}** |')
    p('')
    lai = [bo for bo in so['bo'] if 'rc_dau' in bo_cu.get(bo, {}) or 'rc_dau' in bo_moi.get(bo, {})]
    if lai:
        p('**Chạy lại** (`chay-lai-do.sh`, lời chủ kho «Chạy lại bước đỏ», 17/11): bước đỏ ở CẢ HAI cây khi hai cây chạy song song')
        p('được chạy lại một lần, lần lượt từng cây; số của bước ấy ở bảng trên lấy từ lần chạy lại.')
        for bo in lai:
            a, b = bo_cu.get(bo, {}), bo_moi.get(bo, {})
            p(f"- `{bo}` — lần đầu {a.get('rc_dau', a.get('rc'))} · {b.get('rc_dau', b.get('rc'))}, chạy lại lần lượt {a.get('rc')} · {b.get('rc')}")
        p('')
    p('## Đỏ thêm theo lớp')
    p('')
    ten_lop = {'khong-chay-toi': 'không chạy tới', 'duong-dan': 'đường dẫn không còn', 'cung-tep': 'cùng khối có lỗi đường dẫn',
               'ten-doi': 'tên đổi', 'lich-su': 'dựng bản cũ từ lịch sử', 'bo-chay': 'bộ chết ngầm / bộ chạy không chạy được', 'khac': 'khác'}
    cot = list(so['bo'])
    p('| Lớp | Số ca | ' + ' | '.join(cot) + ' |')
    p('|---|---|' + '---|' * len(cot))
    for l, n in so['lop'].items():
        p(f'| {ten_lop[l]} (`{l}`) | {n} | ' + ' | '.join(str(so["bo"][b]["lop"].get(l, 0)) for b in cot) + ' |')
    p('')
    for l, ds in mau.items():
        p(f'**Mẫu — {ten_lop[l]}:**')
        p('')
        for m in ds[:6]:
            p(f'- `{m.replace("`", "ʼ")}`')
        p('')
    p('## Số liệu máy đọc')
    p('')
    p('<!-- <<<LOP-DO-SO-LIEU -->')
    p('```json')
    p(json.dumps(so, ensure_ascii=False, sort_keys=True))
    p('```')
    p('<!-- LOP-DO-SO-LIEU>>> -->')


if __name__ == '__main__':
    main()
