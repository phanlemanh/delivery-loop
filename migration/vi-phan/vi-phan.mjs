#!/usr/bin/env node
// vi-phan.mjs — thước «vi phân phán quyết» của B3 (KE-HOACH.md mục 12, hàng B3 · KHAC-BIET-DU-KIEN.md hàng G1).
//
// Chạy bộ chặn gộp của HAI (hay nhiều) bản kit trên CÙNG một cây hồ sơ thật của một kho tiêu thụ, rồi so phán quyết.
// Chỉ phần LỆCH mới quy được về việc đổi kit; số tuyệt đối là nợ có sẵn của kho ấy (BOI-CANH.md, «Phép so cũ với mới»).
//
//   node vi-phan.mjs --kho <cây hồ sơ> --base <ref> --kit <nhãn>=<gốc plugin lõi> --kit <nhãn>=<gốc plugin lõi> --ra <thư mục>
//        [--slug <tên>]…   chỉ xét các hồ sơ này (bộ tự kiểm dùng; lượt đo thật để trống = --recheck-all trọn cây)
//        [--ban-do]        chạy thêm bước hai của việc `gate`: product-map --check
//   node vi-phan.mjs --so <thư mục đã chụp>          so lại từ đầu ra đã chụp, không chạy gì
//
// «Gốc plugin lõi» = thư mục chứa scripts/pre-merge-check.sh: gốc kho ở bố cục cũ, plugins/acceptance-gate ở bố cục mới.
// Nhãn đầu tiên là bản ĐỐI CHỨNG; mỗi nhãn sau được so với nó.
//
// Phán quyết (lệch = ĐỎ, thoát 1):
//   · mã thoát của bộ chặn gộp          · túi dòng VIOLATION (đã che đường kit và đường cây)
//   · tập hồ sơ có dòng OK              — hồ sơ bên cũ xét mà bên mới không xét là «ca không chạy tới», không phải «sạch»
//   · sổ luật: «rules ran=», dấu T1-ESCAPE, dòng khai luật tắt — luật không chạy là luật không còn
//   · dòng thụt lề sau một VIOLATION (danh sách tệp) tính vào chính vi phạm ấy
//   · (--ban-do) mã thoát và đầu ra của product-map --check
// Chỉ đọc (in ra, không làm đỏ): dòng NOTE và chữ của dòng OK.
// Thoát: 0 không lệch · 1 có lệch (mỗi dòng stdout một lệch, tiền tố «LỆCH») · 2 không đọc được ở đây (một bản kit
// không chạy luật nào, mã thoát lạ, thiếu tệp) — không đọc được KHÔNG bao giờ in thành «0 lệch».

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Che những gì đổi theo chỗ đặt bản kit và cây hồ sơ — không phải phán quyết.
export function che(dong, { kit = [], kho = [] } = {}) {
  // Chỉ che đường TUYỆT ĐỐI: một đường tương đối như «.» sẽ nuốt mọi dấu chấm và làm hai dòng khác nhau thành giống nhau.
  const tuyetDoi = (ds) => [...new Set(ds)].filter(k => typeof k === 'string' && path.isAbsolute(k) && k.length > 1).sort((a, b) => b.length - a.length);
  let s = dong;
  for (const k of tuyetDoi(kit)) s = s.replace(new RegExp(esc(k), 'g'), '<KIT>');
  for (const k of tuyetDoi(kho)) s = s.replace(new RegExp(esc(k), 'g'), '<KHO>');
  return s;
}

// Một đầu ra của pre-merge-check → các lớp dòng. Lớp = chữ in hoa đầu dòng; dòng không có thì là «khac».
export function tach(chu) {
  const r = { viol: [], ok: new Map(), note: [], luat: [], khac: [] };
  let truocLaViol = false;
  for (const d of chu.split('\n')) {
    if (!d.trim()) continue;
    // Dòng thụt lề ngay sau một VIOLATION (danh sách tệp sau «Changed:») là một phần của chính vi phạm ấy.
    if (truocLaViol && /^\s/.test(d)) { r.viol[r.viol.length - 1] += ' ⏎ ' + d.trim(); continue; }
    const m = d.match(/^([A-Z][A-Z-]+)\b/);
    const lop = m ? m[1] : null;
    const slug = (d.match(/^[A-Z-]+ \[([^\]]+)\]/) || [])[1];
    truocLaViol = lop === 'VIOLATION';
    if (lop === 'VIOLATION') r.viol.push(d);
    else if (lop === 'OK' && slug) r.ok.set(slug, d);
    // Sổ luật: dòng «rules ran=», dòng khai luật tắt, và dấu T1-ESCAPE: NOT ENFORCED — luật không chạy là luật không còn.
    else if (/^pre-merge-check: /.test(d) || /^T1-ESCAPE\b/.test(d)) r.luat.push(d);
    else if (lop === 'NOTE') r.note.push(d);
    else r.khac.push(d);
  }
  r.coDongLuat = r.luat.some(d => /^pre-merge-check: rules ran=/.test(d));
  return r;
}

const tui = (ds) => { const m = new Map(); for (const d of ds) m.set(d, (m.get(d) || 0) + 1); return m; };
function lechTui(a, b) {
  const A = tui(a), B = tui(b), ra = [];
  for (const [d, n] of A) if ((B.get(d) || 0) < n) ra.push(['chỉ bên đối chứng', d, n - (B.get(d) || 0)]);
  for (const [d, n] of B) if ((A.get(d) || 0) < n) ra.push(['chỉ bên được so', d, n - (A.get(d) || 0)]);
  return ra;
}

// So hai bản chụp {ma, chu, bd?} đã che. Trả { phanQuyet: [...dòng lệch], chiDoc: [...] }.
export function so(dc, ms) {
  const A = tach(dc.chu), B = tach(ms.chu);
  const pq = [], doc = [];
  if (dc.ma !== ms.ma) pq.push(`mã thoát: ${dc.ma} → ${ms.ma}`);
  for (const [phia, d, n] of lechTui(A.viol, B.viol)) pq.push(`VIOLATION ${phia}${n > 1 ? ` ×${n}` : ''}: ${d}`);
  for (const s of A.ok.keys()) if (!B.ok.has(s)) pq.push(`hồ sơ có dòng OK chỉ bên đối chứng: ${s}`);
  for (const s of B.ok.keys()) if (!A.ok.has(s)) pq.push(`hồ sơ có dòng OK chỉ bên được so: ${s}`);
  for (const [phia, d] of lechTui(A.luat, B.luat)) pq.push(`sổ luật ${phia}: ${d}`);
  if (dc.bd && ms.bd) {
    if (dc.bd.ma !== ms.bd.ma) pq.push(`product-map --check mã thoát: ${dc.bd.ma} → ${ms.bd.ma}`);
    for (const [phia, d] of lechTui(dc.bd.chu.split('\n').filter(Boolean), ms.bd.chu.split('\n').filter(Boolean))) pq.push(`product-map --check ${phia}: ${d}`);
  } else if (!!dc.bd !== !!ms.bd) pq.push('product-map --check chỉ chụp ở một bên');
  for (const [phia, d] of lechTui(A.note, B.note)) doc.push(`NOTE ${phia}: ${d}`);
  for (const [s, d] of A.ok) if (B.ok.has(s) && B.ok.get(s) !== d) doc.push(`chữ dòng OK đổi [${s}]: ${d} → ${B.ok.get(s)}`);
  for (const [phia, d] of lechTui(A.khac, B.khac)) doc.push(`dòng khác ${phia}: ${d}`);
  return { phanQuyet: pq, chiDoc: doc, dem: { dc: demLop(A), ms: demLop(B) } };
}
const demLop = (t) => ({ VIOLATION: t.viol.length, OK: t.ok.size, NOTE: t.note.length, luat: t.luat.length });

// Một bản chụp đọc được khi: mã thoát 0 hoặc 1, VÀ có dòng sổ luật «rules ran=» (bộ chặn gộp đã đi tới cuối).
export function docDuoc(c) {
  if (c.ma !== 0 && c.ma !== 1) return `mã thoát ${c.ma} (chỉ 0 và 1 là phán quyết)`;
  const t = tach(c.chu);
  // Một dòng VIOLATION [config] (sai --base, sai cấu hình) KHÔNG đủ: hai bản kit cùng hỏng sẽ ra «0 lệch» mà chưa chấm hồ sơ nào.
  if (!t.coDongLuat) return 'không có dòng sổ luật «rules ran=» — bộ chặn gộp dừng trước khi chấm hồ sơ';
  return null;
}

export function chup({ kho, base, goc, slug = [], banDo = false }) {
  const kb = path.join(goc, 'scripts', 'pre-merge-check.sh');
  if (!fs.existsSync(kb)) return { ma: 127, chu: `không có ${kb}`, giay: 0 };
  const t0 = Date.now();
  const doiSo = [kb, '.', ...(slug.length ? slug.flatMap(s => ['--slug', s]) : []), '--recheck-all', '--base', base];
  const r = spawnSync('bash', doiSo, { cwd: kho, encoding: 'utf8', maxBuffer: 1 << 28 });
  const ra = { ma: r.status ?? 255, chu: [r.stdout || '', r.stderr || ''].filter(Boolean).map(x => x.replace(/\n?$/, '\n')).join(''), giay: Math.round((Date.now() - t0) / 1000), lenh: `bash <KIT>/scripts/pre-merge-check.sh ${doiSo.slice(1).join(' ')}` };
  if (banDo) {
    const b = spawnSync(process.execPath, [path.join(goc, 'scripts', 'product-map.mjs'), '--root', '.', '--check'], { cwd: kho, encoding: 'utf8', maxBuffer: 1 << 28 });
    ra.bd = { ma: b.status ?? 255, chu: (b.stdout || '') + (b.stderr || '') };
  }
  return ra;
}

function ghi(ra, nhan, c) {
  fs.mkdirSync(ra, { recursive: true });
  fs.writeFileSync(path.join(ra, `${nhan}.txt`), c.chu);
  fs.writeFileSync(path.join(ra, `${nhan}.meta`), `exit=${c.ma} giay=${c.giay}\n`);
  if (c.bd) { fs.writeFileSync(path.join(ra, `${nhan}.bd.txt`), c.bd.chu); fs.writeFileSync(path.join(ra, `${nhan}.bd.meta`), `exit=${c.bd.ma}\n`); }
}

export function docChup(ra) {
  const che_ = fs.existsSync(path.join(ra, 'che.json')) ? JSON.parse(fs.readFileSync(path.join(ra, 'che.json'), 'utf8')) : { thu_tu: null, kit: {}, kho: [] };
  const nhan = che_.thu_tu || fs.readdirSync(ra).filter(f => f.endsWith('.meta') && !f.endsWith('.bd.meta')).map(f => f.slice(0, -5)).sort();
  return nhan.map(n => {
    const ma = Number((fs.readFileSync(path.join(ra, `${n}.meta`), 'utf8').match(/exit=(\d+)/) || [])[1] ?? 255);
    const o = { kit: Object.values(che_.kit || {}), kho: che_.kho || [] };
    const c = { nhan: n, ma, chu: che(fs.readFileSync(path.join(ra, `${n}.txt`), 'utf8'), o) };
    if (fs.existsSync(path.join(ra, `${n}.bd.meta`))) c.bd = { ma: Number((fs.readFileSync(path.join(ra, `${n}.bd.meta`), 'utf8').match(/exit=(\d+)/) || [])[1] ?? 255), chu: che(fs.readFileSync(path.join(ra, `${n}.bd.txt`), 'utf8'), o) };
    return c;
  });
}

// So mọi bản chụp với bản đầu. Trả mã thoát; in báo cáo ra `in_`.
export function baoCao(ds, in_ = (s) => process.stdout.write(s + '\n')) {
  if (ds.length < 2) { in_('không đọc được ở đây: cần ít nhất hai bản kit'); return 2; }
  for (const c of ds) { const l = docDuoc(c); if (l) { in_(`không đọc được ở đây: bản «${c.nhan}» — ${l}`); return 2; } }
  let lech = 0;
  const dc = ds[0];
  for (const ms of ds.slice(1)) {
    const k = so(dc, ms);
    in_(`${dc.nhan} → ${ms.nhan}: phán quyết lệch ${k.phanQuyet.length} · đối chứng VIOLATION ${k.dem.dc.VIOLATION}, OK ${k.dem.dc.OK}, NOTE ${k.dem.dc.NOTE}, sổ luật ${k.dem.dc.luat} · được so VIOLATION ${k.dem.ms.VIOLATION}, OK ${k.dem.ms.OK}, NOTE ${k.dem.ms.NOTE}, sổ luật ${k.dem.ms.luat} · chỉ đọc ${k.chiDoc.length}`);
    for (const d of k.phanQuyet) in_(`LỆCH [${dc.nhan} → ${ms.nhan}] ${d}`);
    for (const d of k.chiDoc) in_(`  đọc [${dc.nhan} → ${ms.nhan}] ${d}`);
    lech += k.phanQuyet.length;
  }
  return lech ? 1 : 0;
}

function doiSo(argv) {
  const a = { kit: [], slug: [], banDo: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--ban-do') a.banDo = true;
    else if (['--kho', '--base', '--ra', '--so'].includes(k) && argv[i + 1] !== undefined) a[k.slice(2)] = argv[++i];
    else if (k === '--kit' && /^[\w.-]+=./.test(argv[i + 1] || '')) { const [n, ...p] = argv[++i].split('='); a.kit.push([n, path.resolve(p.join('='))]); }
    else if (k === '--slug' && argv[i + 1] !== undefined) a.slug.push(argv[++i]);
    else return null;
  }
  return a;
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  const a = doiSo(process.argv.slice(2));
  if (!a || (!a.so && (!a.kho || !a.base || !a.ra || a.kit.length < 2))) {
    process.stderr.write('dùng: node vi-phan.mjs --kho <cây> --base <ref> --kit <nhãn>=<gốc lõi> --kit <nhãn>=<gốc lõi> --ra <thư mục> [--slug <tên>]… [--ban-do]\n      node vi-phan.mjs --so <thư mục đã chụp>\n');
    process.exit(2);
  }
  if (!a.so) {
    if (new Set(a.kit.map(k => k[0])).size !== a.kit.length || new Set(a.kit.map(k => k[1])).size !== a.kit.length) { process.stdout.write('không đọc được ở đây: hai --kit trùng nhãn hoặc trùng đường — so một bản với chính nó luôn ra 0 lệch\n'); process.exit(2); }
    const kho = fs.realpathSync(a.kho);
    fs.mkdirSync(a.ra, { recursive: true });
    fs.writeFileSync(path.join(a.ra, 'che.json'), JSON.stringify({ thu_tu: a.kit.map(k => k[0]), kit: Object.fromEntries(a.kit), kho: [kho, path.resolve(a.kho)], base: a.base, slug: a.slug }, null, 2) + '\n');
    for (const [n, goc] of a.kit) ghi(a.ra, n, chup({ kho, base: a.base, goc, slug: a.slug, banDo: a.banDo }));
  }
  process.exit(baoCao(docChup(a.so || a.ra)));
}
