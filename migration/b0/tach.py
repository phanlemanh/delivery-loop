#!/usr/bin/env python3
"""Tách tên ca đỏ từ nhật ký bộ kiểm của ba bản sao, so A (đối chứng) với B và C.
Dùng: tach.py <thư mục out> [A B C]"""
import re, sys, os, collections as c, json

SUITES = ['scripts', 'hooks', 'plugins', 'workflows', 'dieu-phoi', 'ban-do']

def ca_do(log):
    """Trả về tập (khoá ca, dòng mẫu). Khoá = mã ca nếu có, không thì dòng đã chuẩn hoá."""
    do = {}
    for ln in log.splitlines():
        s = ln.strip()
        m = None
        if s.startswith('FAIL'):
            m = re.match(r'FAIL:?\s*\[?([A-Za-zĐđ0-9][\w.\-]*)\]?', s)
        elif s.startswith('not ok '):
            m = re.match(r'not ok \d+ - (.*)', s)
        elif re.match(r'^✗|^×', s):
            m = re.match(r'^[✗×]\s*(.*)', s)
        if not m:
            continue
        key = m.group(1)
        key = re.sub(r'/private/tmp/\S+', '<tmp>', key)
        key = re.sub(r'\b[0-9a-f]{7,40}\b', '<sha>', key)[:120]
        do.setdefault(key, re.sub(r'/private/tmp/claude-\d+/\S+?/b0/', '<b0>/', s)[:300])
    return do

def main():
    OUT = sys.argv[1]
    BAN = sys.argv[2:] or ['A', 'B', 'C']
    ket = {}
    for b in BAN:
        ket[b] = {}
        for s in SUITES:
            p = os.path.join(OUT, b, s + '.log')
            ket[b][s] = ca_do(open(p, errors='replace').read()) if os.path.exists(p) else None

    def n(x): return '—' if x is None else str(len(x))
    print('Số khoá ca đỏ (mỗi khoá có thể gom nhiều dòng FAIL cùng mã):')
    print('%-10s' % 'bộ', *('%6s' % b for b in BAN), ' B−A  C−A')
    for s in SUITES:
        a = ket.get('A', {}).get(s); bb = ket.get('B', {}).get(s); cc = ket.get('C', {}).get(s)
        def tru(x, y):
            if x is None or y is None: return '  —'
            return '%4d' % len(set(x) - set(y))
        print('%-10s' % s, *('%6s' % n(ket[b][s]) for b in BAN), tru(bb, a), tru(cc, a))

    json.dump({b: {s: (sorted(v) if v is not None else None) for s, v in ket[b].items()} for b in BAN},
              open(os.path.join(OUT, 'ca-do.json'), 'w'), ensure_ascii=False, indent=1)

    # Dòng mẫu của ca đỏ CHỈ ở bản bị bỏ bớt, để đọc nguyên nhân.
    if 'A' in ket:
        for b in [x for x in BAN if x != 'A']:
            for s in SUITES:
                x = ket[b][s]; a = ket['A'][s]
                if x is None or a is None: continue
                moi = [k for k in x if k not in a]
                if not moi: continue
                print(f'\n== {b} {s}: {len(moi)} ca đỏ thêm so với A — 8 mẫu')
                for k in moi[:8]:
                    print('   ', x[k][:220])


if __name__ == '__main__':
    main()
