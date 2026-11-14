#!/usr/bin/env python3
"""phan-lop.py — tách và chia lớp ca kiểm đỏ do đổi bố cục (vòng B1 kich-ban-chuyen-nha, AC-10).

Dùng: phan-lop.py <thư mục đo> <mã nguồn> <mã cây mới>  > migration/kich-ban/ket-qua/lop-do.md
<thư mục đo>/out/{A,B}/<bộ>.log và ketqua.tsv do migration/b0/chay.sh ghi (A = cây cũ, B = cây mới).
Khoá ca và dòng mẫu: ca_do của migration/b0/tach.py (cùng thước với đo thử B0), thêm che đường thư mục tạm của máy.
Lớp dấu hiệu đọc trên dòng FAIL cùng phần sau nó; không ra lớp nào thì cùng phần trước nó (tới 12 dòng mỗi phía), theo thứ tự: lich-su · duong-dan · ten-doi · khac;
bộ thoát khác 0 mà không in ca đỏ nào → một mục lớp bo-chay; ca rơi vào «khac» mà tệp kiểm chứa nó có lỗi đường dẫn →
lớp cung-tep (thường là ca chạy theo ca đã đỏ — đối chứng dương, ca thông điệp).
"""
import datetime, json, os, re, sys

DAY = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(DAY, '..', 'b0'))
from tach import ca_do, SUITES  # noqa: E402

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


def doc(thu, ban, bo):
    p = os.path.join(thu, 'out', ban, bo + '.log')
    if not os.path.exists(p):
        return None, []
    nd = open(p, errors='replace').read()
    return {che(k): v for k, v in ca_do(nd).items()}, nd.splitlines()


def rc(thu, ban):
    m = {}
    p = os.path.join(thu, 'out', ban, 'ketqua.tsv')
    if os.path.exists(p):
        for d in open(p):
            c = d.rstrip('\n').split('\t')
            if len(c) >= 2 and c[0] in SUITES:
                m[c[0]] = int(c[1])
    return m


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


def main():
    thu, nguon, cay_moi = sys.argv[1:4]
    rcA, rcB = rc(thu, 'A'), rc(thu, 'B')
    so = {'nguon': nguon, 'cay_moi': cay_moi, 'bo': {}, 'lop': {k: 0 for k in ['duong-dan', 'cung-tep', 'ten-doi', 'lich-su', 'bo-chay', 'khac']}, 'mau': {}}
    for bo in SUITES:
        a, _ = doc(thu, 'A', bo)
        b, dongB = doc(thu, 'B', bo)
        a = a or {}
        b = b or {}
        ca_hai = sorted(set(a) & set(b))
        them = sorted(set(b) - set(a))
        lop = {}
        for k in them:
            l, chu = lop_ca(dongB, b[k])
            if l == 'khac' and dict(LOP)['duong-dan'].search(doan_tep(dongB, b[k])):
                l = 'cung-tep'  # ca không tự in lỗi đường dẫn, nhưng tệp kiểm chứa nó có — thường là ca chạy theo ca đã đỏ
            lop[l] = lop.get(l, 0) + 1
            so['mau'].setdefault(l, [])
            if sum(1 for m in so['mau'][l] if m.startswith(bo + ':')) < 2:  # tối đa hai dòng mẫu mỗi lớp trong MỖI bộ
                so['mau'][l].append(f'{bo}: ' + ' ⏎ '.join(x.strip() for x in chu.split('\n') if x.strip())[:400])
        if rcB.get(bo, 0) != 0 and not b:
            lop['bo-chay'] = lop.get('bo-chay', 0) + 1
            so['mau'].setdefault('bo-chay', []).append(f'{bo}: bộ thoát {rcB.get(bo)} mà không in ca đỏ nào')
        for l, n in lop.items():
            so['lop'][l] += n
        so['bo'][bo] = {'rc_cu': rcA.get(bo), 'rc_moi': rcB.get(bo), 'do_cu': len(a), 'do_moi': len(b), 'do_ca_hai': len(ca_hai),
                        'do_them': len(them) + lop.get('bo-chay', 0), 'chi_do_cu': len(set(a) - set(b)), 'lop': lop,
                        'ca_hai': ca_hai[:20]}
    tong = sum(v['do_them'] for v in so['bo'].values())
    so['tong_do_them'] = tong
    ngay = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

    p = print
    p('---')
    p(f'nguon: {nguon}')
    p(f'cay_moi: {cay_moi}')
    p(f'do_luc: {ngay}')
    p('bo: [' + ', '.join(SUITES) + ']')
    p(f'tong_do_them: {tong}')
    p('---')
    p('')
    p('# Lớp ca kiểm đỏ do đổi bố cục — đầu vào cho B2')
    p('')
    p('Máy sinh bởi `migration/kich-ban/do-lop-do.sh` → `phan-lop.py` — đừng sửa tay, chạy lại. Cây cũ = nguồn ở trên;')
    p('cây mới = đỉnh `don-nha/3.0` dựng từ nguồn ấy. Mỗi cây một bản kéo riêng, cùng tên thư mục `delivery-loop`, chạy đúng')
    p('sáu bước của việc `tests` (`migration/b0/chay.sh`). Khoá ca như đo thử B0. «Đỏ thêm» = đỏ ở cây mới mà không đỏ ở cây cũ;')
    p('ca đỏ ở cả hai cây là nợ có sẵn hoặc chập chờn, không tính cho đổi bố cục.')
    p('')
    p('**Giới hạn:** lớp chia theo CHỮ của nhật ký (dòng FAIL và vài dòng quanh nó), không chạy lại từng ca. «Tên đổi» có thể')
    p('đếm nhầm ca in danh sách tên hồ sơ có chứa tên cũ; «cùng tệp» là ca không tự in lỗi đường dẫn nhưng tệp kiểm chứa nó có —')
    p('thường là ca chạy theo ca đã đỏ. Ca không tự in lỗi sau dòng FAIL thì đọc phần trước nó, nên có thể mượn lớp của ca liền')
    p('trước trong nhật ký kiểu node. Một lượt đo mỗi cây trên một máy.')
    p('')
    p('| Bộ | Mã thoát cũ | Mã thoát mới | Đỏ cây cũ | Đỏ cây mới | Đỏ cả hai | Đỏ thêm | Chỉ đỏ ở cây cũ |')
    p('|---|---|---|---|---|---|---|---|')
    for bo, v in so['bo'].items():
        p(f"| {bo} | {v['rc_cu']} | {v['rc_moi']} | {v['do_cu']} | {v['do_moi']} | {v['do_ca_hai']} | {v['do_them']} | {v['chi_do_cu']} |")
    p(f'| **tổng** | | | | | | **{tong}** | |')
    p('')
    p('## Đỏ thêm theo lớp dấu hiệu')
    p('')
    ten_lop = {'duong-dan': 'đường dẫn không còn', 'cung-tep': 'cùng tệp kiểm có lỗi đường dẫn', 'ten-doi': 'tên đổi', 'lich-su': 'dựng bản cũ từ lịch sử', 'bo-chay': 'bộ chạy không chạy được', 'khac': 'khác'}
    p('| Lớp | Số ca | ' + ' | '.join(SUITES) + ' |')
    p('|---|---|' + '---|' * len(SUITES))
    for l, n in so['lop'].items():
        p(f'| {ten_lop[l]} (`{l}`) | {n} | ' + ' | '.join(str(so["bo"][b]["lop"].get(l, 0)) for b in SUITES) + ' |')
    p('')
    for l, ds in so['mau'].items():
        p(f'**Mẫu — {ten_lop[l]}:**')
        p('')
        for m in ds:
            p(f'- `{m.replace("`", "ʼ")}`')
        p('')
    p('## Ca đỏ ở cả hai cây (tách khỏi «đỏ thêm»)')
    p('')
    for bo, v in so['bo'].items():
        if v['ca_hai']:
            p(f"- {bo}: " + ' · '.join(f'`{k.replace("`", "ʼ")}`' for k in v['ca_hai']))
    p('')
    p('## Số liệu máy đọc')
    p('')
    p('<!-- <<<LOP-DO-SO-LIEU -->')
    p('```json')
    p(json.dumps({k: v for k, v in so.items() if k != 'mau'}, ensure_ascii=False, sort_keys=True))
    p('```')
    p('<!-- LOP-DO-SO-LIEU>>> -->')


if __name__ == '__main__':
    main()
