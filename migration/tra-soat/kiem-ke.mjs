#!/usr/bin/env node
// kiem-ke.mjs — sổ kiểm kê tệp của kit cho đợt chuyển nhà (vòng B1 đọc sổ này).
//
// Đọc MỘT mã commit của kho kit (mặc định: nhánh chính kho cũ, remote `kit-cu`), xếp MỖI tệp vào đúng một lớp:
//   • tệp trong thư mục một plugin (đọc từ tệp khai chợ) → plugin đó; tệp ở gốc không khớp luat-xep.json → plugin lõi;
//   • tệp khớp luat-xep.json → lớp của luật (hồ sơ vòng, sổ làm việc, bộ kiểm, tài liệu sống…).
// Với tệp của plugin, lần từ các ĐIỂM VÀO mà Claude Code tự nạp (tệp khai, lệnh, skill, tác tử, móc) theo các đường dẫn
// ghi trong chữ của tệp: tệp lần tới được là sản phẩm chạy thật; tệp không lần tới được là «chưa rõ» — người thiết kế B1
// xếp tay. Cùng lượt lần, kịch bản ghi lại:
//   • tham chiếu chéo giữa hai plugin (sẽ gãy khi mỗi plugin vào một thư mục riêng, trừ khi đi qua resolve-plugin);
//   • con trỏ từ sản phẩm sang tệp KHÔNG phải sản phẩm (tài liệu, bộ kiểm…) — sẽ treo trong bản cài sau dọn nhà;
//   • đường dẫn khai chặt (${CLAUDE_PLUGIN_ROOT}/…, --require …, import tương đối) mà không trỏ tới tệp nào — treo ngay hôm nay.
//
// Dùng:  node kiem-ke.mjs [--kho <thư mục git>] [--ref <mã|nhánh>] [--ra <thư mục ghi>] [--json]
//   mặc định --kho = kho chứa kịch bản này, --ref = kit-cu/main, --ra = ./ket-qua cạnh kịch bản.
// Chỉ đọc kho; ghi duy nhất vào --ra. Chạy hai lần trên cùng mã commit ra cùng các tệp (không ghi giờ chạy).
// Kiểm hai chiều: kiem-ke.test.mjs cạnh tệp này.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));

function doiSo(argv) {
  const a = { kho: null, ref: 'kit-cu/main', ra: path.join(DAY, 'ket-qua'), json: false, luat: path.join(DAY, 'luat-xep.json') };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--kho') a.kho = argv[++i];
    else if (k === '--ref') a.ref = argv[++i];
    else if (k === '--ra') a.ra = argv[++i];
    else if (k === '--luat') a.luat = argv[++i];
    else if (k === '--json') a.json = true;
    else { process.stderr.write(`kiem-ke: đối số lạ «${k}» — dùng: [--kho <thư mục>] [--ref <mã>] [--ra <thư mục>] [--json]\n`); process.exit(2); }
  }
  if (!a.kho) a.kho = execFileSync('git', ['-C', DAY, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  return a;
}

const git = (kho, args, opt = {}) => execFileSync('git', ['-C', kho, ...args], { encoding: 'utf8', maxBuffer: 1 << 30, ...opt });

const DUOI_CHU = new Set(['mjs', 'cjs', 'js', 'ts', 'tsx', 'jsx', 'sh', 'py', 'json', 'jsonl', 'md', 'yaml', 'yml', 'html', 'css', 'svg', 'txt', 'toml', 'd.ts']);
const laChu = (p, buf) => {
  const duoi = p.includes('.') ? p.split('.').pop() : '';
  if (DUOI_CHU.has(duoi)) return true;
  if (!buf) return false;
  return !buf.subarray(0, 8192).includes(0);
};

export function kiemKe({ kho, ref, luat }) {
  const sha = git(kho, ['rev-parse', `${ref}^{commit}`]).trim();
  const ngay = git(kho, ['log', '-1', '--format=%cs', sha]).trim();
  const tep = git(kho, ['ls-tree', '-r', '--name-only', '-z', sha]).split('\0').filter(Boolean).sort();
  const coTep = new Set(tep);
  const coThuMuc = new Set();
  for (const t of tep) { const p = t.split('/'); for (let i = 1; i < p.length; i++) coThuMuc.add(p.slice(0, i).join('/')); }

  // Nội dung: một lần git archive vào thư mục tạm.
  const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'kiem-ke-'));
  try {
    execFileSync('sh', ['-c', 'git -C "$1" archive "$2" | tar -x -C "$3"', 'sh', kho, sha, tam], { maxBuffer: 1 << 30 });
    const doc = (p) => { try { return fs.readFileSync(path.join(tam, p)); } catch { return null; } };

    // ── Plugin: đọc tệp khai chợ của chính mã commit này ─────────────────────────────────────────────────────────
    const cho = JSON.parse(doc('.claude-plugin/marketplace.json').toString('utf8'));
    const plugin = cho.plugins.map(p => ({ ten: p.name, thu_muc: path.posix.normalize(p.source).replace(/^\.\/?$/, '').replace(/^\.\//, '').replace(/\/$/, '') }));
    const loi = plugin.find(p => p.thu_muc === '');
    const con = plugin.filter(p => p.thu_muc !== '').sort((x, y) => y.thu_muc.length - x.thu_muc.length);

    const L = JSON.parse(fs.readFileSync(luat, 'utf8'));
    const tienToKhoTieuThu = L.duong_dan_cua_kho_tieu_thu.tien_to;

    // ── Bước 1: chủ của từng tệp ─────────────────────────────────────────────────────────────────────────────────
    const chu = new Map(); // tệp → { lop, plugin, ly_do }
    for (const t of tep) {
      const pc = con.find(p => t === p.thu_muc || t.startsWith(p.thu_muc + '/'));
      if (pc) { chu.set(t, { lop: 'san-pham', plugin: pc.ten }); continue; }
      const l = L.luat.find(r => t === r.tien_to || t.startsWith(r.tien_to));
      if (l) { chu.set(t, { lop: l.lop, plugin: '', ly_do: l.ly_do }); continue; }
      chu.set(t, { lop: 'san-pham', plugin: loi ? loi.ten : '(không có plugin gốc)' });
    }
    const thuMucCua = (ten) => (plugin.find(p => p.ten === ten) || { thu_muc: '' }).thu_muc;
    const tuongDoi = (t, ten) => { const d = thuMucCua(ten); return d ? t.slice(d.length + 1) : t; };

    // ── Bước 2: điểm vào ─────────────────────────────────────────────────────────────────────────────────────────
    const vao = new Map(); // tệp → loại điểm vào
    for (const t of tep) {
      const c = chu.get(t); if (c.lop !== 'san-pham') continue;
      const r = tuongDoi(t, c.plugin);
      if (r === '.claude-plugin/plugin.json' || r === '.claude-plugin/marketplace.json') vao.set(t, 'tep-khai');
      else if (/^(commands|skills|agents|workflows)\//.test(r)) vao.set(t, r.split('/')[0]);
      else if (r === 'hooks/hooks.json') vao.set(t, 'moc');
      else if (r === 'README.md') vao.set(t, 'tai-lieu-plugin');
      else if (/^evals\//.test(r)) vao.set(t, 'ca-do-skill');
    }
    for (const p of plugin) {
      const d = p.thu_muc ? p.thu_muc + '/' : '';
      const moc = doc(d + 'hooks/hooks.json');
      if (moc) for (const m of (JSON.parse(moc.toString('utf8')).modules || [])) { const t = path.posix.normalize(d + 'hooks/' + m); if (coTep.has(t)) vao.set(t, 'moc'); }
      const khai = doc(d + '.claude-plugin/plugin.json');
      if (khai) { const k = JSON.parse(khai.toString('utf8')); if (k.types) { const t = path.posix.normalize(d + k.types); if (coTep.has(t)) vao.set(t, 'tep-khai'); } }
    }

    // ── Bước 3: lần theo đường dẫn ghi trong chữ ─────────────────────────────────────────────────────────────────
    const RE_GOC = /\$\{CLAUDE_PLUGIN_ROOT\}\/([\w@.\-/]+)/g;
    const RE_REQ = /--require\s+([\w@.\-/]+)/g;
    const RE_JOIN = /path\.(?:join|resolve)\(\s*(?:HERE|__dirname|DAY|DIR|dirname)\s*,([^)]*)\)/g; // path.join(HERE, '..', 'vendor', …)
    const RE_PLUGIN = /--plugin\s+([\w-]+)/g;
    const MA = new Set(['mjs', 'cjs', 'js', 'ts', 'tsx', 'jsx']);
    const RE_IMP = /(?:\bfrom\s+|\bimport\s*\(\s*|\brequire\s*\(\s*|\bimport\s+)['"](\.{1,2}\/[^'"\s]+)['"]/g;
    const RE_LONG = /(?:\.{1,2}\/)*[\w@][\w@.\-]*(?:\/[\w@.\-]+)+|[\w@][\w@.\-]*\.(?:mjs|cjs|js|ts|sh|py|json|md|yaml|yml|html|css|svg)\b/g;
    const sach = (s) => s.replace(/[.,:;)]+$/, '').replace(/\/+$/, '');
    const tonTai = (p) => (coTep.has(p) ? 'tep' : coThuMuc.has(p) ? 'thu-muc' : null);
    const chuanHoa = (p) => { const n = path.posix.normalize(p); return n.startsWith('../') || n === '..' ? null : n.replace(/^\.\//, ''); };

    const canh = [];   // { tu, toi, kieu, dong }
    const treo = [];   // { tu, chu, kieu, dong }
    const conTro = []; // { tu, toi, lop, dong }
    const daLan = new Set(), hang = [...vao.keys()].sort(), ly = new Map(); // tệp → cách vào
    for (const t of hang) ly.set(t, 'diem-vao:' + vao.get(t));

    const themDich = (tu, toi, kieu, dong) => {
      const ct = chu.get(toi); const cs = chu.get(tu);
      if (ct.lop !== 'san-pham') { conTro.push({ tu, toi, lop: ct.lop, dong, mo_ho: toi.includes('/') ? '' : 'cung-ten-tep-o-kho-tieu-thu' }); return; }
      if (ct.plugin !== cs.plugin) canh.push({ tu, toi, kieu, dong });
      if (!ly.has(toi)) { ly.set(toi, ct.plugin === cs.plugin ? 'lan-tu:' + tu : 'goi-cheo-tu:' + tu); hang.push(toi); }
    };
    const moRong = (tu, p, kieu, dong) => {
      const k = tonTai(p); if (!k) return false;
      if (k === 'tep') { themDich(tu, p, kieu, dong); return true; }
      // Thư mục: chỉ kéo cả thư mục khi nó sâu từ hai cấp trong plugin chủ (vd vendor/impeccable), để một chữ «scripts/»
      // không kéo cả thư mục scripts vào.
      const cc = chu.get(tep.find(x => x.startsWith(p + '/')));
      const sau = (cc && cc.lop === 'san-pham' ? tuongDoi(p + '/x', cc.plugin) : p + '/x').split('/').length - 1;
      // Chữ nhắc lỏng (kiểu «nhac») tới một thư mục KHÔNG kéo thư mục vào: một tài liệu nhắc «vendor/x» không làm mã nguồn nhập
      // từ ngoài thành sản phẩm chạy thật.
      if (sau >= 2 && kieu !== 'nhac') for (const x of tep) if (x.startsWith(p + '/')) themDich(tu, x, kieu, dong);
      return true;
    };

    while (hang.length) {
      const t = hang.shift();
      if (daLan.has(t)) continue; daLan.add(t);
      const buf = doc(t); if (!buf || !laChu(t, buf) || t.endsWith('.patch')) continue;
      const laMa = MA.has(t.split('.').pop());
      const c = chu.get(t); const goc = thuMucCua(c.plugin); const thuMuc = path.posix.dirname(t);
      const dong = buf.toString('utf8').split('\n');
      dong.forEach((d, i) => {
        const so = i + 1; const daXu = new Set();
        for (const m of d.matchAll(RE_GOC)) {
          const s = sach(m[1]); daXu.add(s); if (!s) continue;
          const p = chuanHoa(goc ? goc + '/' + s : s);
          if (!p || !moRong(t, p, 'goc-plugin', so)) treo.push({ tu: t, chu: '${CLAUDE_PLUGIN_ROOT}/' + s, kieu: 'goc-plugin', dong: so });
        }
        const viTriPlugin = [...d.matchAll(RE_PLUGIN)].map(m => [m.index, m[1]]);
        for (const m of d.matchAll(RE_REQ)) {
          const s = sach(m[1]); daXu.add(s);
          const pl = viTriPlugin.filter(([i]) => i < m.index).map(([, n]) => n).pop(); // --plugin gần nhất đứng TRƯỚC --require này
          // Không có --plugin trên dòng (chữ giải thích): thử plugin của chính tệp, rồi lần lượt các plugin khác.
          const thuGoc = pl ? [thuMucCua(pl)] : [goc, ...plugin.map(x => x.thu_muc).filter(x => x !== goc)];
          const p = thuGoc.map(g => chuanHoa(g ? g + '/' + s : s)).find(x => x && tonTai(x));
          if (!p || !moRong(t, p, 'qua-resolve-plugin', so)) treo.push({ tu: t, chu: '--require ' + s, kieu: 'qua-resolve-plugin', dong: so });
        }
        for (const m of laMa ? d.matchAll(RE_IMP) : []) {
          const s = m[1]; daXu.add(s);
          const p = chuanHoa(thuMuc + '/' + s);
          // Nếp TypeScript: import './x.js' trỏ tới x.ts trên đĩa.
          const goc2 = p && p.replace(/\.js$/, '.ts').replace(/\.mjs$/, '.mts');
          const tim = p && ['', '.mjs', '.cjs', '.js', '.ts', '.d.ts', '/index.mjs', '/index.js', '/index.ts', '/index.d.ts'].map(x => p + x).concat(goc2).find(x => coTep.has(x));
          if (tim) themDich(t, tim, 'import-tuong-doi', so);
          else treo.push({ tu: t, chu: s, kieu: /(^|\/)vendor\//.test(t) ? 'import-trong-ma-nhap-ngoai' : 'import-tuong-doi', dong: so });
        }
        for (const m of laMa ? d.matchAll(RE_JOIN) : []) {
          const manh = [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map(x => x[1]);
          if (!manh.length) continue;
          const p = chuanHoa(thuMuc + '/' + manh.join('/'));
          if (p && tonTai(p)) { daXu.add(manh.join('/')); moRong(t, p, 'path-join', so); }
        }
        // Bản dựng sẵn (thư mục dist/) chép tên tệp nguồn vào chú thích — không lần theo chữ lỏng của nó.
        for (const m of /(^|\/)dist\//.test(t) ? [] : d.matchAll(RE_LONG)) {
          const s = sach(m[0]); if (!s || daXu.has(s)) continue;
          if (tienToKhoTieuThu.some(x => s.startsWith(x))) continue;
          const kieu = /resolve-plugin/.test(d) ? 'qua-resolve-plugin' : 'nhac';
          const thu = s.startsWith('.') ? [thuMuc + '/' + s] : [thuMuc + '/' + s, goc ? goc + '/' + s : s, s];
          for (const x of thu) { const p = chuanHoa(x); if (p && tonTai(p)) { moRong(t, p, kieu, so); break; } }
        }
      });
    }

    // ── Bước 4: tệp sản phẩm không lần tới được — ai còn nhắc nó? ───────────────────────────────────────────────
    const chuKiem = tep.filter(t => ['bo-kiem', 'cong-cu-kho'].includes(chu.get(t).lop)).map(t => { const b = doc(t); return b && laChu(t, b) ? b.toString('utf8') : ''; }).join('\n');
    const hangKe = tep.map(t => {
      const c = chu.get(t);
      if (c.lop !== 'san-pham') return { tep: t, lop: c.lop, plugin: '', cach_vao: '', ghi_chu: c.ly_do };
      if (ly.has(t)) return { tep: t, lop: 'san-pham', plugin: c.plugin, cach_vao: ly.get(t), ghi_chu: '' };
      const r = tuongDoi(t, c.plugin);
      const ai = chuKiem.includes(t) || (r !== t && chuKiem.includes(r)) ? 'bo-kiem-hoac-luot-kiem-goi' : chuKiem.includes(path.posix.basename(t)) ? 'chi-trung-ten-tep-trong-bo-kiem' : 'khong-ai-goi';
      return { tep: t, lop: 'chua-ro', plugin: c.plugin, cach_vao: ai, ghi_chu: '' };
    });

    const uniq = (a, k) => [...new Map(a.map(x => [k(x), x])).values()];
    const sx = (a, ...k) => a.sort((x, y) => { for (const f of k) { const c = String(x[f]).localeCompare(String(y[f]), 'en'); if (c) return c; } return 0; });
    return {
      kho, sha, ngay, ref, so_tep: tep.length, plugin,
      hang: hangKe,
      canh: sx(uniq(canh, x => x.tu + '|' + x.toi + '|' + x.kieu), 'tu', 'toi', 'kieu'),
      con_tro: sx(uniq(conTro, x => x.tu + '|' + x.toi), 'tu', 'toi'),
      treo: sx(uniq(treo, x => x.tu + '|' + x.chu), 'tu', 'chu'),
    };
  } finally { fs.rmSync(tam, { recursive: true, force: true }); }
}

// ── Ghi sổ ─────────────────────────────────────────────────────────────────────────────────────────────────────────
const LICH_SU = new Set(['ho-so-vong', 'so-lam-viec', 'bo-kiem']);
export function ghi(kq, ra) {
  fs.mkdirSync(ra, { recursive: true });
  const dau = `# máy sinh bởi migration/tra-soat/kiem-ke.mjs từ ${kq.ref} @ ${kq.sha.slice(0, 8)} (${kq.ngay}) — đừng sửa tay, chạy lại kịch bản`;
  const tsv = (ten, cot, dong) => fs.writeFileSync(path.join(ra, ten), [dau, cot.join('\t'), ...dong.map(d => cot.map(c => d[c] ?? '').join('\t'))].join('\n') + '\n');
  tsv('kiem-ke.tsv', ['tep', 'lop', 'plugin', 'cach_vao', 'ghi_chu'], kq.hang.filter(h => !LICH_SU.has(h.lop)));
  tsv('tham-chieu-cheo.tsv', ['tu', 'toi', 'kieu', 'dong'], kq.canh);
  tsv('con-tro-ra-ngoai.tsv', ['tu', 'toi', 'lop', 'dong', 'mo_ho'], kq.con_tro);
  tsv('tro-treo.tsv', ['tu', 'chu', 'kieu', 'dong'], kq.treo);
  fs.writeFileSync(path.join(ra, 'tom-tat.md'), tomTat(kq, dau));
}

function demTheo(a, k) { const m = new Map(); for (const x of a) m.set(k(x), (m.get(k(x)) || 0) + 1); return [...m.entries()].sort((x, y) => y[1] - x[1] || String(x[0]).localeCompare(String(y[0]))); }

export function tomTat(kq, dau) {
  const o = [];
  const sp = kq.hang.filter(h => h.lop === 'san-pham'), cr = kq.hang.filter(h => h.lop === 'chua-ro');
  o.push('# Sổ kiểm kê tệp — tóm tắt', '', `<!-- ${dau.slice(2)} -->`, '');
  o.push(`Mã commit: \`${kq.sha.slice(0, 8)}\` (${kq.ngay}) · tổng **${kq.so_tep}** tệp, mỗi tệp đúng một lớp.`, '');
  o.push('## Theo lớp', '', '| Lớp | Số tệp |', '|---|---|');
  for (const [l, n] of demTheo(kq.hang, h => h.lop)) o.push(`| \`${l}\` | ${n} |`);
  o.push('', '`san-pham` = lần tới được từ điểm vào của một plugin. `chua-ro` = nằm trong vùng của một plugin mà không lần tới được — người thiết kế B1 xếp tay. Các lớp khác do `luat-xep.json` khai.', '');
  o.push('## Theo plugin', '', '| Plugin | Thư mục nguồn | Sản phẩm (điểm vào / lần tới / gọi chéo) | Chưa rõ: bộ kiểm gọi · chỉ trùng tên · không ai gọi |', '|---|---|---|---|');
  for (const p of kq.plugin) {
    const a = sp.filter(h => h.plugin === p.ten), b = cr.filter(h => h.plugin === p.ten);
    const d = (pre) => a.filter(h => h.cach_vao.startsWith(pre)).length;
    const e = (k) => b.filter(h => h.cach_vao === k).length;
    o.push(`| \`${p.ten}\` | \`${p.thu_muc || './'}\` | ${a.length} (${d('diem-vao')} / ${d('lan-tu')} / ${d('goi-cheo')}) | ${b.length}: ${e('bo-kiem-hoac-luot-kiem-goi')} · ${e('chi-trung-ten-tep-trong-bo-kiem')} · ${e('khong-ai-goi')} |`);
  }
  o.push('', '### Chưa rõ, theo thư mục', '', '| Thư mục | Số tệp | Bộ kiểm gọi | Không ai gọi |', '|---|---|---|---|');
  for (const [d, n] of demTheo(cr, h => h.tep.split('/').slice(0, h.tep.split('/').length > 2 ? 2 : 1).join('/'))) {
    const x = cr.filter(h => h.tep.startsWith(d));
    o.push(`| \`${d}\` | ${n} | ${x.filter(h => h.cach_vao === 'bo-kiem-hoac-luot-kiem-goi').length} | ${x.filter(h => h.cach_vao === 'khong-ai-goi').length} |`);
  }
  const pl = (t) => (kq.hang.find(h => h.tep === t) || {}).plugin || '?';
  o.push('', '## Tham chiếu chéo giữa plugin', '', 'Gãy khi mỗi plugin vào một thư mục riêng, TRỪ kiểu `qua-resolve-plugin` (tìm plugin kia trong bản cài). `nhac` là chữ nhắc tới tệp của plugin khác — có thể chỉ là chú thích.', '', '| Từ → tới | Kiểu | Số cạnh |', '|---|---|---|');
  for (const [k, n] of demTheo(kq.canh, c => `${pl(c.tu)} → ${pl(c.toi)}\t${c.kieu}`)) { const [a, b] = k.split('\t'); o.push(`| ${a} | \`${b}\` | ${n} |`); }
  o.push('', '## Con trỏ từ sản phẩm ra ngoài sản phẩm', '', 'Sản phẩm nhắc tới một tệp không phải sản phẩm. Hôm nay plugin lõi mang cả kho nên con trỏ còn sống; sau khi lõi vào thư mục riêng chúng treo trong bản cài. Cột «mơ hồ»: đích là một tên tệp ở gốc (vd `CLAUDE.md`, `PRODUCT-MAP.md`) mà kho tiêu thụ cũng có — phần lớn chữ ấy nói về tệp của kho tiêu thụ, không phải của kit.', '', '| Lớp của đích | Con trỏ rõ (có thư mục) | Con trỏ mơ hồ | Số tệp sản phẩm nhắc (rõ) |', '|---|---|---|---|');
  for (const [l] of demTheo(kq.con_tro, c => c.lop)) { const x = kq.con_tro.filter(c => c.lop === l); const ro = x.filter(c => !c.mo_ho); o.push(`| \`${l}\` | ${ro.length} | ${x.length - ro.length} | ${new Set(ro.map(c => c.tu)).size} |`); }
  o.push('', '## Đường dẫn khai chặt mà trỏ vào không có gì (treo từ hôm nay)', '');
  if (!kq.treo.length) o.push('Không có.');
  else { o.push('| Kiểu | Số |', '|---|---|'); for (const [k, n] of demTheo(kq.treo, t => t.kieu)) o.push(`| \`${k}\` | ${n} |`); }
  o.push('', 'Chi tiết từng dòng: `kiem-ke.tsv` (mọi tệp trừ hồ sơ vòng, sổ làm việc, bộ kiểm — ba lớp đó chỉ đếm), `tham-chieu-cheo.tsv`, `con-tro-ra-ngoai.tsv`, `tro-treo.tsv`.', '');
  return o.join('\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const a = doiSo(process.argv.slice(2));
  const kq = kiemKe(a);
  if (a.json) process.stdout.write(JSON.stringify(kq) + '\n');
  else {
    ghi(kq, a.ra);
    const dem = demTheo(kq.hang, h => h.lop).map(([l, n]) => `${l} ${n}`).join(' · ');
    process.stdout.write(`kiem-ke: ${kq.sha.slice(0, 8)} · ${kq.so_tep} tệp · ${dem} · chéo ${kq.canh.length} · ra ngoài ${kq.con_tro.length} · treo ${kq.treo.length}\n`);
  }
}
