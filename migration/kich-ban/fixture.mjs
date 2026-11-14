// fixture.mjs — dựng kho kit giả và kho Repo Standards giả cho don-nha.test.mjs (vòng B1 kich-ban-chuyen-nha).
//
// Kho kit giả có hình dạng của kho cũ thu nhỏ: chợ hai plugin (lõi lấy gốc kho làm nguồn + `dieu-phoi`), một skill
// đổi tên, một lệnh đổi tên, đủ mười chuỗi của ma trận AC-4 (năm chuỗi phải đổi, năm chuỗi phải giữ), một con trỏ từ
// sản phẩm sang `docs/`, tài liệu sống, bộ kiểm, cấu hình kho. Kho Repo Standards giả có `apply.py` cùng giao diện với
// bản thật (cờ, khoá JSON, cách lấy ngày) — mã HEAD của nó được ghim vào bảng xếp fixture.
//
// Mọi thứ do mã sinh trong lượt; không đọc kho thật nào.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const NGAY_NGUON = '2026-11-01T09:00:00+07:00';

export function git(kho, args, env = {}) {
  return execFileSync('git', ['-C', kho, ...args], {
    encoding: 'utf8',
    env: { ...process.env, GIT_CONFIG_NOSYSTEM: '1', ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function ghiTep(goc, tep) {
  for (const [p, nd] of Object.entries(tep)) {
    const d = path.join(goc, p);
    if (nd === null) { fs.rmSync(d, { force: true }); continue; }
    fs.mkdirSync(path.dirname(d), { recursive: true });
    fs.writeFileSync(d, nd);
  }
}

// Thêm một commit với các tệp cho trước (nội dung null = xoá). Trả mã commit.
export function themCommit(kho, tep, thongDiep = 'thêm') {
  ghiTep(kho, tep);
  git(kho, ['add', '-A']);
  git(kho, ['-c', 'user.name=fixture', '-c', 'user.email=fixture@thu.invalid', '-c', 'commit.gpgsign=false',
    'commit', '-q', '-m', thongDiep], { GIT_AUTHOR_DATE: NGAY_NGUON, GIT_COMMITTER_DATE: NGAY_NGUON });
  return git(kho, ['rev-parse', 'HEAD']).trim();
}

const json = (o) => JSON.stringify(o, null, 2) + '\n';

export const TEP_KIT = {
  '.claude-plugin/marketplace.json': json({
    name: 'acceptance-gate-kit',
    owner: { name: 'Thu' },
    plugins: [
      { name: 'acceptance-gate', source: './', description: 'Lõi.' },
      { name: 'dieu-phoi', source: './dieu-phoi', description: 'Điều phối.' },
    ],
  }),
  '.claude-plugin/plugin.json': json({ name: 'acceptance-gate', version: '2.39.0', description: 'Lõi.' }),
  'skills/cat-luot/SKILL.md': [
    '---', 'name: cat-luot', 'description: Cắt lượt.', '---', '',
    'Gọi `acceptance-gate:cat-luot` khi cắt lượt.',
    'Dùng skill `cat-luot` để cắt; script ở scripts/cat-luot.mjs, hồ sơ lo-trinh-cat-luot.',
    'Bối cảnh ghi ở docs/reference/ghi-chu.md, xem [ghi chú](../../docs/reference/ghi-chu.md).',
    'Tri thức ở kho acceptance-gate-kit-tri-thuc.',
    '',
  ].join('\n'),
  'scripts/cat-luot.mjs': '// cat-luot.mjs — răng phủ\nexport const x = 1;\n',
  'scripts/goi.mjs': [
    '// node feature-loop/scripts/resolve-plugin.mjs --plugin dieu-phoi --require scripts/dieu-phoi.mjs',
    '// cache: ~/.claude/plugins/cache/acceptance-gate-kit/',
    '// chạy /dieu-phoi:mo-dot rồi dieu-phoi.mjs',
    '// bối cảnh: docs/reference/ghi-chu.md',
    "export const GHI_CHU = 'docs/reference/ghi-chu.md';",
    'export const y = 2;', '',
  ].join('\n'),
  'commands/acceptance-init.md': 'Khởi tạo.\n\nBật `dieu-phoi@acceptance-gate-kit` khi kho muốn chạy đợt.\nKiểm: `node tests/a.test.mjs`.\nCòn gọi scripts/goi.mjs.\n',
  'dieu-phoi/.claude-plugin/plugin.json': json({ name: 'dieu-phoi', version: '2.39.0', description: 'Điều phối.' }),
  'dieu-phoi/commands/mo-dot.md': 'Mở đợt — gọi scripts/dieu-phoi.mjs.\nCa kiểm ở tests/a.test.mjs.\n',
  'dieu-phoi/scripts/dieu-phoi.mjs': '// dieu-phoi.mjs\nexport const z = 3;\n',
  'dieu-phoi/hooks/mod/khung.ts': "const khung = atom({ plugin: 'dieu-phoi', key: 'khung' } as const, null)\nconst thuMuc = ['.claude', 'dieu-phoi', 'may']\n",
  'dieu-phoi/types/index.d.ts': "interface S {\n    'dieu-phoi': { khung: K }\n}\n",
  'docs/reference/ghi-chu.md': 'Ghi chú cho người sửa kit.\n',
  'tests/a.test.mjs': '// kiểm scripts/cat-luot.mjs\n',
  // B2 — hình dạng tệp kiểm bước 6 phải đổi hoặc phải giữ (hồ sơ bo-kiem-xanh-o-kho-moi, AC-1/AC-2).
  'dieu-phoi/hooks/hooks.json': '{}\n',
  'hooks/hooks.json': '{}\n',
  'tests/scripts/run-tests.sh': [
    '#!/usr/bin/env bash',
    'HERE="$(cd "$(dirname "$0")" && pwd)"', 'ROOT="$(cd "$HERE/../.." && pwd)"',
    'bc_tg_mo scripts all "$HERE/../.."',
    'CHECK="$HERE/../../scripts/goi.mjs"',
    'node "$ROOT/scripts/cat-luot.mjs"',
    'git -C "$ROOT" show HEAD:scripts/goi.mjs >/dev/null',
    'git -C "$ROOT" show "$BASE_SHA:scripts/cat-luot.mjs" >/dev/null',
    'DP="$ROOT/dieu-phoi"; cat "$DP/hooks/hooks.json"',
    'echo "  PASS: S01 chay scripts/goi.mjs"', '',
  ].join('\n'),
  'tests/scripts/ban-sao.test.mjs': [
    "import path from 'node:path';",
    "const KIT = path.resolve('.');",
    "export const MOT = path.join(KIT, 'scripts', 'goi.mjs');",
    "export const CHEP = (c) => { for (const d of ['scripts', 'commands']) cp(path.join(KIT, d), path.join(c, d)); };",
    "export const LENH = '/dieu-phoi:mo-dot';",
    "export const VUNG = 'scripts';",
    "export const SO = () => assert.equal(n, 3);", '',
  ].join('\n'),
  'tests/fixtures/repo/scripts/verify.sh': 'node scripts/goi.mjs\n',
  '.github/workflows/gate.yml': 'jobs:\n  tests:\n    steps:\n      - name: ban do\n        run: node scripts/goi.mjs --root . --check\n',
  '_acceptance/config.yaml': 'executors:\n  script:\n    goi: node scripts/goi.mjs\n',
  'README.md': 'Cài: `claude plugin marketplace add phanlemanh/acceptance-gate-kit`.\nMở đợt: `/dieu-phoi:mo-dot`.\n',
  'CLAUDE.md': '# Luật\n\nGiữ nguyên.\n',
  '.claude/settings.json': json({ enabledPlugins: { 'acceptance-gate@acceptance-gate-kit': true, 'dieu-phoi@acceptance-gate-kit': true } }),
  '.gitignore': 'node_modules/\n',
};

// Bảng vá fixture: một mục thay đường mà luật chung không phủ (tên gốc trần trong một hằng).
export const VA_FIXTURE = [{ tep: 'tests/scripts/ban-sao.test.mjs', cu: "export const VUNG = 'scripts';",
  moi: "export const VUNG = 'plugins/acceptance-gate/scripts';", so_lan: 1, ly_do: 'hằng tên gốc trần — luật chung không đổi chữ đơn lẻ' }];

export const BANG_TEN = {
  plugin: { 'dieu-phoi': 'dispatch' },
  lenh: { 'dieu-phoi:mo-dot': 'dispatch:open', 'acceptance-gate:cat-luot': 'acceptance-gate:scope-slice' },
};

const APPLY_GIA = String.raw`#!/usr/bin/env python3
# apply.py GIẢ — cùng cờ và khoá JSON với repo-setup/scripts/apply.py; ngày lấy như bản thật (dòng 230–231):
# --var today/year nếu có, không thì đồng hồ — ở đây «đồng hồ» đọc RS_GIA_NGAY để ca kiểm giả lập hai ngày.
import argparse, datetime, json, os, sys
ap = argparse.ArgumentParser()
ap.add_argument('--target'); ap.add_argument('--preset'); ap.add_argument('--level')
ap.add_argument('--adopt', action='store_true'); ap.add_argument('--json', action='store_true')
ap.add_argument('--var', action='append', default=[])
a = ap.parse_args()
v = dict(x.split('=', 1) for x in a.var)
dong_ho = os.environ.get('RS_GIA_NGAY') or datetime.date.today().isoformat()
v.setdefault('today', dong_ho); v.setdefault('year', dong_ho[:4])
T = a.target
def ghi(p, s):
    os.makedirs(os.path.dirname(os.path.join(T, p)) or T, exist_ok=True)
    open(os.path.join(T, p), 'w').write(s)
tao = {'.editorconfig': 'root = true\n', 'Makefile': 'help:\n\t@echo help\n\ntest: ## Run the tests\n\tbash tests/run.sh\n',
       'tools/plugin_lint.py': 'print("lint")\n', 'tools/bump_version.py': 'print("bump")\n',
       '.claude/skills/review-change/SKILL.md': '---\nname: review-change\n---\n'}
created, conflict = [], []
for p, s in tao.items():
    if os.path.exists(os.path.join(T, p)): conflict.append(p)
    else: ghi(p, s); created.append(p)
for p in ('CLAUDE.md', 'README.md', '.claude/settings.json'):
    if os.path.exists(os.path.join(T, p)): conflict.append(p)
merged = []
gi = os.path.join(T, '.gitignore')
cu = open(gi).read() if os.path.exists(gi) else ''
if '.env' not in cu: open(gi, 'w').write(cu + '.env\n'); merged.append('.gitignore')
if os.environ.get('RS_GIA_CHAM'):
    p = os.path.join(T, os.environ['RS_GIA_CHAM']); open(p, 'a').write('dòng khuôn chèn vào\n')
if os.environ.get('RS_GIA_XUNG_DOT'): conflict.append(os.environ['RS_GIA_XUNG_DOT'])
ghi('.repo-setup.json', json.dumps({'preset': a.preset, 'level': a.level, 'vars': v}, sort_keys=True, indent=2) + '\n')
print(json.dumps({'created': created, 'merged': merged, 'conflict': conflict, 'kept': [], 'skipped': []}))
`;

// Dựng kho kit giả + kho Repo Standards giả + bảng xếp fixture trong `thuMuc` (thư mục trống).
// tuyChon.themThuMucGoc: thêm một thư mục gốc lạ (ca AC-9a). tuyChon.bangTen: đè bảng tên.
export function dungKhoFixture(thuMuc, tuyChon = {}) {
  const kho = path.join(thuMuc, 'kho');
  fs.mkdirSync(kho, { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', kho]);
  const tep = { ...TEP_KIT };
  if (tuyChon.themThuMucGoc) tep[`${tuyChon.themThuMucGoc}/x.md`] = 'lạ\n';
  const nguon = themCommit(kho, tep, 'kit giả');
  git(kho, ['branch', 'chuyen-nha']);

  const rs = path.join(thuMuc, 'rs');
  fs.mkdirSync(rs, { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', rs]);
  const maRs = themCommit(rs, { 'plugins/repo-setup/scripts/apply.py': APPLY_GIA }, 'khuôn giả');

  const bangTenTep = path.join(thuMuc, 'bang-ten.json');
  fs.writeFileSync(bangTenTep, json(tuyChon.bangTen || BANG_TEN));
  const bangXep = path.join(thuMuc, 'bang-xep.json');
  const goc = JSON.parse(fs.readFileSync(new URL('./bang-xep.json', import.meta.url), 'utf8'));
  const bx = {
    ...goc,
    bang_ten: bangTenTep,
    thu_muc: { skills: 'plugins/acceptance-gate/skills', commands: 'plugins/acceptance-gate/commands',
      scripts: 'plugins/acceptance-gate/scripts', hooks: 'plugins/acceptance-gate/hooks', 'dieu-phoi': 'plugins/dispatch' },
    tep: { '.claude-plugin/plugin.json': 'plugins/acceptance-gate/.claude-plugin/plugin.json' },
    giu: ['.claude-plugin/marketplace.json', '.claude', '.gitignore', 'CLAUDE.md', 'README.md', 'docs', 'tests', '.github', '_acceptance'],
    bo_kiem: { ...goc.bo_kiem, va: path.join(thuMuc, 'va-bo-kiem.json') },
    khuon: { ...goc.khuon, ma: maRs, trung_duoc_phep: ['CLAUDE.md', 'README.md', '.claude/settings.json'] },
  };
  fs.writeFileSync(path.join(thuMuc, 'va-bo-kiem.json'), json(tuyChon.va || VA_FIXTURE));
  fs.writeFileSync(bangXep, json(bx));
  return { kho, nguon, rs, bangXep, bangTenTep };
}
