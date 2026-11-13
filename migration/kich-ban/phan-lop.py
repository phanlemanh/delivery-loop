#!/usr/bin/env python3
"""phan-lop.py — tách và chia lớp ca kiểm đỏ do đổi bố cục (vòng B1 kich-ban-chuyen-nha, AC-10).

Dùng: phan-lop.py <thư mục đo> <mã nguồn> <mã cây mới>  > migration/kich-ban/ket-qua/lop-do.md
<thư mục đo>/out/{A,B}/<bộ>.log và ketqua.tsv do migration/b0/chay.sh ghi (A = cây cũ, B = cây mới).
Khoá ca và dòng mẫu: ca_do của migration/b0/tach.py (cùng thước với đo thử B0), thêm che đường thư mục tạm của máy.
Lớp dấu hiệu đọc trên dòng FAIL và sáu dòng sau nó trong nhật ký, theo thứ tự: lich-su · duong-dan · ten-doi · khac;
bộ thoát khác 0 mà không in ca đỏ nào → một mục lớp bo-chay.
"""
import datetime, json, os, re, sys

DAY = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(DAY, '..', 'b0'))
from tach import ca_do, SUITES  # noqa: E402

TEN_CU = ['acceptance-gate-kit', 'dieu-phoi', 'road-map', 'tri-thuc', 'cat-luot', 'gom-tin-hieu']
LOP = [
    ('lich-su', re.compile(r'not a valid object name|not a tree object|unknown revision|bad revision|ambiguous argument')),
    ('duong-dan', re.compile(r'ENOENT|No such file|Cannot find module|MODULE_NOT_FOUND|not found|không tìm thấy|không có tệp|khong co tep|can\'t open file|cannot open')),
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
    """Dòng FAIL + sáu dòng sau nó trong nhật ký (chữ để chia lớp)."""
    goc = mau.strip()[:80]
    ke = re.compile(r'^\s*(FAIL|PASS|ok |not ok |[✗×✓])')
    for i, d in enumerate(dong):
        if goc and goc in d:
            j = i + 1
            while j < len(dong) and j < i + 7 and not ke.match(dong[j]):
                j += 1
            return '\n'.join(dong[i:j])
    return mau


def lop_cua(chu):
    for ten, re_ in LOP:
        if re_.search(chu):
            return ten
    return 'khac'


def main():
    thu, nguon, cay_moi = sys.argv[1:4]
    rcA, rcB = rc(thu, 'A'), rc(thu, 'B')
    so = {'nguon': nguon, 'cay_moi': cay_moi, 'bo': {}, 'lop': {k: 0 for k in ['duong-dan', 'ten-doi', 'lich-su', 'bo-chay', 'khac']}, 'mau': {}}
    for bo in SUITES:
        a, _ = doc(thu, 'A', bo)
        b, dongB = doc(thu, 'B', bo)
        a = a or {}
        b = b or {}
        ca_hai = sorted(set(a) & set(b))
        them = sorted(set(b) - set(a))
        lop = {}
        for k in them:
            chu = che(boi_canh(dongB, b[k]))
            l = lop_cua(chu)
            lop[l] = lop.get(l, 0) + 1
            so['mau'].setdefault(l, [])
            if len(so['mau'][l]) < 3:
                so['mau'][l].append(f'{bo}: ' + ' ⏎ '.join(x.strip() for x in chu.split('\n')[:3])[:260])
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
    p('| Bộ | Mã thoát cũ | Mã thoát mới | Đỏ cây cũ | Đỏ cây mới | Đỏ cả hai | Đỏ thêm | Chỉ đỏ ở cây cũ |')
    p('|---|---|---|---|---|---|---|---|')
    for bo, v in so['bo'].items():
        p(f"| {bo} | {v['rc_cu']} | {v['rc_moi']} | {v['do_cu']} | {v['do_moi']} | {v['do_ca_hai']} | {v['do_them']} | {v['chi_do_cu']} |")
    p(f'| **tổng** | | | | | | **{tong}** | |')
    p('')
    p('## Đỏ thêm theo lớp dấu hiệu')
    p('')
    ten_lop = {'duong-dan': 'đường dẫn không còn', 'ten-doi': 'tên đổi', 'lich-su': 'dựng bản cũ từ lịch sử', 'bo-chay': 'bộ chạy không chạy được', 'khac': 'khác'}
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
