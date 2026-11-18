#!/usr/bin/env node
// bo-kiem.mjs — sổ «ca kiểm bám bố cục cũ» cho đợt chuyển nhà.
//
// Khi sản phẩm chuyển từ gốc kho vào `plugins/<tên>/`, mọi tệp kiểm gọi sản phẩm bằng đường dẫn tính từ gốc kho phải đổi
// đường dẫn. Lớp khó hơn: tệp kiểm dựng «bản gốc» từ một mã commit hay thẻ CŨ (`git archive <mã> scripts lib`,
// `git show <mã>:scripts/…`) — commit cũ mang bố cục cũ, nên đổi chuỗi đường dẫn thôi không đủ.
//
// Đọc mọi tệp lớp `bo-kiem` của sổ kiểm kê (cùng mã commit kit), tìm trong chữ:
//   • đường dẫn tới một tệp hay thư mục sản phẩm, viết thẳng (`scripts/lo-trinh.mjs`) hoặc ghép (`path.join(ROOT, 'scripts', …)`);
//   • dấu hiệu dựng bản cũ từ lịch sử git (git archive / git show <mã>: / git worktree add / thẻ v2.x).
// Dùng:  node bo-kiem.mjs [--ref <mã kit>] [--ra <thư mục>]

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { kiemKe } from './kiem-ke.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));

export function soBoKiem(kit) {
  const sp = kit.hang.filter(h => h.lop === 'san-pham' || h.lop === 'chua-ro');
  const tepSP = new Map(sp.map(h => [h.tep, h.plugin]));
  const thuMucSP = new Map(); // thư mục cấp một và hai của sản phẩm → plugin
  for (const h of sp) { const p = h.tep.split('/'); for (let i = 1; i < Math.min(p.length, 3); i++) { const d = p.slice(0, i).join('/'); if (!thuMucSP.has(d)) thuMucSP.set(d, h.plugin); } }
  const kiem = kit.hang.filter(h => h.lop === 'bo-kiem').map(h => h.tep);

  const RE_THANG = /(?<![\w./-])((?:[\w@.-]+\/)+[\w@.-]+)/g;
  const RE_JOIN = /(?:path\.)?(?:join|resolve)\(\s*[A-Za-z_$][\w$]*\s*,((?:\s*['"][^'"]+['"]\s*,?)+)\)/g;
  const RE_LICH_SU = /git(?:['"]?\s*,\s*\[?\s*['"]|\s+)(?:archive|show|worktree|cat-file|ls-tree|rev-parse|checkout)\b|['"]archive['"]|['"]show['"]\s*,|\bv2\.\d+\.\d+\b|HEAD~|merge-base/;

  const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'bo-kiem-'));
  try {
    execFileSync('sh', ['-c', 'git -C "$1" archive "$2" tests | tar -x -C "$3"', 'sh', kit.kho, kit.sha, tam], { maxBuffer: 1 << 30 });
    const hang = [];
    for (const t of kiem) {
      let chu; try { chu = fs.readFileSync(path.join(tam, t), 'utf8'); } catch { continue; }
      if (chu.includes('\0')) continue;
      const toi = new Map(); // đường dẫn sản phẩm → plugin
      const ghi = (p) => { p = p.replace(/[.,:;)]+$/, '').replace(/\/+$/, ''); if (tepSP.has(p)) toi.set(p, tepSP.get(p)); else if (thuMucSP.has(p)) toi.set(p + '/', thuMucSP.get(p)); };
      for (const m of chu.matchAll(RE_THANG)) ghi(m[1]);
      // Đường dẫn sau một biến gốc của vỏ («$ROOT/scripts/x», «${KIT}/lib/y»).
      for (const m of chu.matchAll(/\$\{?[A-Za-z_]\w*\}?\/((?:[\w@.-]+\/)+[\w@.-]+)/g)) ghi(m[1]);
      // Đường dẫn tương đối từ chính tệp kiểm (import '../../lib/x.mjs', "$HERE/../../scripts/x").
      for (const m of chu.matchAll(/(?:^|[^\w.])((?:\.\.?\/)+[\w@.\/-]+)/g)) { const n = path.posix.normalize(path.posix.dirname(t) + '/' + m[1]); if (!n.startsWith('..')) ghi(n); }
      for (const m of chu.matchAll(RE_JOIN)) {
        const manh = [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map(x => x[1]).filter(x => x !== '..' && x !== '.');
        for (let i = manh.length; i >= 1; i--) { const p = manh.slice(0, i).join('/'); if (tepSP.has(p) || thuMucSP.has(p)) { ghi(p); break; } }
      }
      if (!toi.size) continue;
      const lichSu = RE_LICH_SU.test(chu);
      const plugin = [...new Set(toi.values())].sort();
      hang.push({ tep: t, bo: t.split('/')[1], so_duong_dan: toi.size, plugin: plugin.join(','), lich_su: lichSu ? 'co' : '', mau: [...toi.keys()].sort().slice(0, 4).join(' ') });
    }
    return { sha: kit.sha, ngay: kit.ngay, ref: kit.ref, tong_tep_kiem: kiem.length, hang: hang.sort((a, b) => a.tep.localeCompare(b.tep, 'en')) };
  } finally { fs.rmSync(tam, { recursive: true, force: true }); }
}

function demTheo(a, k) { const m = new Map(); for (const x of a) m.set(k(x), (m.get(k(x)) || 0) + 1); return [...m.entries()].sort((x, y) => y[1] - x[1] || String(x[0]).localeCompare(String(y[0]))); }

export function ghi(kq, ra) {
  fs.mkdirSync(ra, { recursive: true });
  const dau = `# máy sinh bởi migration/tra-soat/bo-kiem.mjs từ ${kq.ref} @ ${kq.sha.slice(0, 8)} (${kq.ngay}) — đừng sửa tay`;
  const cot = ['tep', 'bo', 'so_duong_dan', 'plugin', 'lich_su', 'mau'];
  fs.writeFileSync(path.join(ra, 'bo-kiem.tsv'), [dau, cot.join('\t'), ...kq.hang.map(h => cot.map(c => h[c]).join('\t'))].join('\n') + '\n');
  const ls = kq.hang.filter(h => h.lich_su);
  const o = ['# Ca kiểm bám bố cục cũ — tóm tắt', '', `<!-- ${dau.slice(2)} -->`, '',
    `Trong ${kq.tong_tep_kiem} tệp của bộ kiểm, **${kq.hang.length}** tệp gọi sản phẩm bằng đường dẫn tính từ gốc kho; **${ls.length}** trong số đó còn dựng bản cũ từ lịch sử git (lớp khó: commit cũ mang bố cục cũ).`, '',
    '| Bộ | Tệp gọi sản phẩm theo đường dẫn | Trong đó dựng bản cũ từ lịch sử |', '|---|---|---|'];
  for (const [b, n] of demTheo(kq.hang, h => h.bo)) o.push(`| \`tests/${b}\` | ${n} | ${kq.hang.filter(h => h.bo === b && h.lich_su).length} |`);
  o.push('', '| Plugin được gọi | Số tệp kiểm |', '|---|---|');
  for (const [p, n] of demTheo(kq.hang.flatMap(h => h.plugin.split(',')), x => x)) o.push(`| \`${p}\` | ${n} |`);
  o.push('', 'Giới hạn: đếm theo chữ, không chạy ca nào. Một tệp kiểm nhắc đường dẫn trong chú thích cũng bị đếm; một tệp ghép đường dẫn bằng biến (không phải chuỗi) thì lọt. Số đỏ thật chỉ biết khi chạy bộ kiểm trên cây đã dọn nhà — việc của B1.', '');
  fs.writeFileSync(path.join(ra, 'bo-kiem.md'), o.join('\n'));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const a = { ref: 'kit-cu/main', ra: path.join(DAY, 'ket-qua') };
  const v = process.argv.slice(2); for (let i = 0; i < v.length; i++) { if (v[i] === '--ref') a.ref = v[++i]; else if (v[i] === '--ra') a.ra = v[++i]; else { process.stderr.write(`bo-kiem: đối số lạ «${v[i]}»\n`); process.exit(2); } }
  const kho = execFileSync('git', ['-C', DAY, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  const kq = soBoKiem(kiemKe({ kho, ref: a.ref, luat: path.join(DAY, 'luat-xep.json') }));
  ghi(kq, a.ra);
  process.stdout.write(`bo-kiem: ${kq.sha.slice(0, 8)} · ${kq.hang.length}/${kq.tong_tep_kiem} tệp kiểm gọi sản phẩm theo đường dẫn · ${kq.hang.filter(h => h.lich_su).length} dựng bản cũ từ lịch sử\n`);
}
