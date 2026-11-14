#!/usr/bin/env node
// giu-khoa.mjs — thước «giữ đủ khoá ca» của B2 (AC-3, AC-4; migration/KE-HOACH.md mục 12).
//
// Đọc hai thư mục kết quả do chay-bo-kiem.sh ghi (cây cũ, cây mới) thành hai TÚI khoá ĐẠT:
//   bộ loại bash  — mỗi hàng của thoi-gian-ca/<bộ>-*.tsv (dòng «PASS:»/«FAIL:» mà bộ chạy tự ghi); hàng PASS là đạt.
//   bộ loại tap   — mỗi dòng `ok N - <tên>` / `not ok N - <tên>` ở TẦNG NGOÀI của <bộ>.log; `# SKIP` không tính đạt.
//   bộ mot-khoa   — một khoá «<bộ>», đạt khi mã thoát 0.
// Khoá = «<bộ>: <dòng bỏ tiền tố, cắt ở « — » hoặc « (», che đường thư mục tạm và mã 7–40 hex>». Khoá cây cũ đổi qua
// bảng tên (chay-thu-phien/bang-ten.json) và bảng xếp (đường cũ → đường mới) trước khi so.
// Luật: túi đạt cây cũ ⊆ túi đạt cây mới, trừ khoá ở danh sách bỏ (--bo, mỗi dòng «khoá<TAB>mã dòng sổ<TAB>lý do»; mã
// phải là một dòng của sổ --so). Bộ không đo được (thiếu dòng ở ketqua.tsv, thiếu XONG, bộ bash thiếu tệp thời gian)
// không bao giờ tính là đủ.
//
// Dùng: node giu-khoa.mjs <kết quả cây cũ> <kết quả cây mới> [--bo <tệp>] [--so <decisions.jsonl>] [--json] [--ghi <thư mục>]
//       node giu-khoa.mjs --tui <túi cũ.tsv> <túi mới.tsv> [--bo …] [--so …]   (so lại hai túi đã ghi)
// Thoát: 0 «giữ đủ: <n>/<n> khoá, bỏ <k>» · 1 thiếu / bộ không đo được / bỏ không có quyết · 2 sai đối số.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');

export function chuanHoa(dong) {
  let s = dong.replace(/^\s*(PASS|FAIL)\s*:\s*/, '');
  s = s.split(/ — | \(/)[0];
  s = s.replace(/(?:\/private)?\/(?:var\/folders|tmp)\/\S+/g, '<tmp>');
  s = s.replace(/\b[0-9a-f]{7,40}\b/g, '<sha>');
  return s.trim();
}

// Phép đổi khoá cây cũ sang tên và đường của cây mới (bảng tên + bảng xếp). Mã riêng của thước.
export function doiKhoa(bangTen, bangXep) {
  const L = [];
  for (const [c, m] of Object.entries(bangTen.lenh || {})) L.push([new RegExp(`(?<![\\w-])${esc(c)}(?![\\w-])`, 'g'), m]);
  for (const [c, m] of Object.entries(bangTen.plugin || {})) {
    L.push([new RegExp(`(?<![\\w-])${esc(c)}:(?=[a-z])`, 'g'), `${m}:`]);
    L.push([new RegExp(`(?<![\\w-])${esc(c)}@`, 'g'), `${m}@`]);
  }
  L.push([/acceptance-gate-kit(?![\w-])/g, 'delivery-loop']);
  const goc = Object.keys(bangXep.thu_muc || {}).sort((a, b) => b.length - a.length);
  if (goc.length) L.push([new RegExp(`(?<![\\w./-])(${goc.map(esc).join('|')})/`, 'g'), (_, g) => `${bangXep.thu_muc[g]}/`]);
  return (k) => L.reduce((s, [re, m]) => s.replace(re, m), k);
}

const tuiThem = (t, k) => t.set(k, (t.get(k) || 0) + 1);

// Đọc một thư mục kết quả → { dat: Map<khoá, số lần>, khongDo: [lý do], tep: [đường tệp thô] }.
export function docKetQua(thu) {
  const dat = new Map(); const khongDo = []; const tep = []; const bo = {};
  const kq = path.join(thu, 'ketqua.tsv');
  if (!fs.existsSync(kq)) return { dat, khongDo: ['lượt chạy không có ketqua.tsv'], tep, bo };
  tep.push(kq);
  const dong = fs.readFileSync(kq, 'utf8').split('\n').filter(Boolean);
  if (!dong.includes('XONG')) khongDo.push('lượt chạy không có dòng XONG');
  for (const d of dong) {
    if (d === 'XONG') continue;
    const [ten, rc, , loai = 'mot-khoa'] = d.split('\t');
    const b = bo[ten] = { rc: Number(rc), loai, so_dong: 0, dat: 0, truot: [] };
    if (loai === 'bash') {
      const dir = path.join(thu, 'thoi-gian-ca');
      const ds = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.startsWith(`${ten}-`) && f.endsWith('.tsv')).sort() : [];
      if (!ds.length) { khongDo.push(ten); continue; }
      for (const f of ds) {
        tep.push(path.join(dir, f));
        for (const h of fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(Boolean)) {
          const ca = h.slice(h.indexOf('\t') + 1); const k = `${ten}: ${chuanHoa(ca)}`; b.so_dong++;
          if (/^\s*PASS\s*:/.test(ca)) { tuiThem(dat, k); b.dat++; } else b.truot.push([k, ca.trim()]);
        }
      }
    } else if (loai === 'tap') {
      const log = path.join(thu, `${ten}.log`);
      if (!fs.existsSync(log)) { khongDo.push(ten); continue; }
      tep.push(log);
      for (const h of fs.readFileSync(log, 'utf8').split('\n')) {
        const m = h.match(/^(not ok|ok) \d+ - (.*?)(\s+#\s*(SKIP|TODO)\b.*)?$/);
        if (!m) continue;
        const k = `${ten}: ${chuanHoa(m[2])}`; b.so_dong++;
        if (m[1] === 'ok' && !m[3]) { tuiThem(dat, k); b.dat++; } else b.truot.push([k, h.trim()]);
      }
    } else if (rc === '0') { tuiThem(dat, `${ten}`); b.dat++; b.so_dong++; }
  }
  return { dat, khongDo, tep, bo };
}

const docTui = (p) => new Map(fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map(d => { const [n, ...k] = d.split('\t'); return [k.join('\t'), Number(n)]; }));
const ghiTui = (p, t) => fs.writeFileSync(p, [...t].sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0).map(([k, n]) => `${n}\t${k}`).join('\n') + '\n');

// So hai túi. `bo` = [{khoa, ma, lyDo}]; `maSo` = Set mã dòng sổ có thật.
export function soTui(cu, moi, bo = [], maSo = new Set()) {
  const loi = [];
  for (const b of bo) if (!b.ma || !maSo.has(b.ma)) loi.push(`bỏ khoá không có quyết: ${b.khoa}`);
  const boSet = new Map(); for (const b of bo) tuiThem(boSet, b.khoa);
  const thieu = []; const thua = [];
  for (const [k, n] of cu) { const con = (moi.get(k) || 0) + (boSet.get(k) || 0); for (let i = con; i < n; i++) thieu.push(k); }
  for (const [k, n] of moi) for (let i = cu.get(k) || 0; i < n; i++) thua.push(k);
  const tong = [...cu.values()].reduce((a, b) => a + b, 0);
  return { tong, thieu, thua, loi, bo: bo.length };
}

function docBo(p) {
  if (!p || !fs.existsSync(p)) return [];
  return fs.readFileSync(p, 'utf8').split('\n').filter(d => d && !d.startsWith('#')).map(d => { const [khoa, ma, lyDo] = d.split('\t'); return { khoa, ma: (ma || '').trim(), lyDo }; });
}
function docMaSo(p) {
  if (!p || !fs.existsSync(p)) return new Set();
  const s = new Set();
  for (const d of fs.readFileSync(p, 'utf8').split('\n')) { try { const o = JSON.parse(d); if (o.id) s.add(o.id); } catch { /* dòng hỏng không tính */ } }
  return s;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const lay = (c) => { const i = a.indexOf(c); if (i < 0) return undefined; const v = a[i + 1]; a.splice(i, 2); return v; };
  const co = (c) => { const i = a.indexOf(c); if (i < 0) return false; a.splice(i, 1); return true; };
  const boP = lay('--bo'); const soP = lay('--so'); const ghiP = lay('--ghi'); const json = co('--json'); const tuiMode = co('--tui');
  if (a.length !== 2) { process.stderr.write('dùng: node giu-khoa.mjs <kết quả cây cũ> <kết quả cây mới> [--bo <tệp>] [--so <sổ>] [--json] [--ghi <thư mục>] | --tui <túi cũ> <túi mới>\n'); process.exit(2); }
  const doi = doiKhoa(JSON.parse(fs.readFileSync(path.join(DAY, '..', 'chay-thu-phien', 'bang-ten.json'), 'utf8')), JSON.parse(fs.readFileSync(path.join(DAY, 'bang-xep.json'), 'utf8')));
  let cu; let moi; const khongDo = []; let boCu = {}; let boMoi = {}; const khongDoMoi = [];
  if (tuiMode) { cu = docTui(a[0]); moi = docTui(a[1]); }
  else {
    const A = docKetQua(a[0]); const B = docKetQua(a[1]);
    for (const x of A.khongDo) khongDo.push(`cây cũ — ${x}`);
    for (const x of B.khongDo) { khongDo.push(x); khongDoMoi.push(x); }
    boCu = A.bo; boMoi = B.bo;
    cu = new Map(); for (const [k, n] of A.dat) cu.set(doi(k), (cu.get(doi(k)) || 0) + n);
    moi = B.dat;
    if (ghiP) {
      fs.mkdirSync(ghiP, { recursive: true });
      ghiTui(path.join(ghiP, 'tui-cu.tsv'), cu); ghiTui(path.join(ghiP, 'tui-moi.tsv'), moi);
      const bam = (ds, goc) => ds.map(f => `${crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')}  ${path.relative(goc, f)}`);
      fs.writeFileSync(path.join(ghiP, 'bam-tho.txt'), ['# cây cũ', ...bam(A.tep, a[0]), '# cây mới', ...bam(B.tep, a[1])].join('\n') + '\n');
    }
  }
  const kq = soTui(cu, moi, docBo(boP), docMaSo(soP));
  const ra = [];
  for (const x of khongDo) ra.push(`bộ không đo được: ${x}`);
  for (const x of kq.loi) ra.push(x);
  if (kq.thieu.length) { ra.push(`thiếu ${kq.thieu.length} khoá`); for (const k of kq.thieu) ra.push(`  thiếu: ${k}`); }
  if (!khongDo.length && !kq.loi.length && !kq.thieu.length) ra.unshift(`giữ đủ: ${kq.tong}/${kq.tong} khoá, bỏ ${kq.bo}`);
  for (const k of kq.thua) ra.push(`  thừa: ${k}`);
  if (json) process.stdout.write(JSON.stringify({ ...kq, khongDo, khongDoMoi, boCu, boMoi }) + '\n');
  else process.stdout.write(ra.join('\n') + '\n');
  process.exit(khongDo.length || kq.loi.length || kq.thieu.length ? 1 : 0);
}
