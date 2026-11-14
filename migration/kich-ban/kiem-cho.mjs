#!/usr/bin/env node
// kiem-cho.mjs — thước ĐỘC LẬP cho cây kịch bản chuyển nhà dựng (hồ sơ _acceptance/kich-ban-chuyen-nha/).
//
// Đọc bảng xếp làm DỮ LIỆU nhưng tự cài mọi phép tính (đích của một tệp, phép áp luật đổi chữ, phép đổi con trỏ) —
// không nhập hàm nào của don-nha.mjs, để một lỗi trong kịch bản không tự chấm xanh chính nó (AC-4, ca KB-AC4-doc-lap).
// Sổ kiểm kê của nguồn lấy từ migration/tra-soat/kiem-ke.mjs (công cụ đã có kiểm hai chiều riêng).
//
//   AC-3  mỗi tệp sản phẩm (san-pham + chua-ro) có đúng một chỗ ở cây mới; tệp khác giữ nguyên chỗ
//   AC-5  tệp khai chợ và plugin của cây mới
//   (Task 2–3 thêm AC-4 nội dung đúng luật, AC-7 con trỏ)
//
// Dùng:  node kiem-cho.mjs --kho <git> --nguon <ref> --dich <ref> [--bang-xep <tệp>]
// Thoát: 0 đạt (in các dòng «AC-<n> đạt: …») · 1 có lỗi (mỗi lỗi một dòng stderr) · 2 sai đối số.

import fs from 'node:fs';
import os from 'node:os';
import { isDeepStrictEqual } from 'node:util';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { kiemKe } from '../tra-soat/kiem-ke.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const LUAT_XEP = path.join(DAY, '..', 'tra-soat', 'luat-xep.json');

const git = (kho, args) => execFileSync('git', ['-C', kho, ...args], { encoding: 'utf8', maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'pipe'] });
const lsTree = (kho, ref) => git(kho, ['ls-tree', '-r', '--name-only', '-z', ref]).split('\0').filter(Boolean);

function docBang(tep) {
  const bx = JSON.parse(fs.readFileSync(tep, 'utf8'));
  const dir = path.dirname(path.resolve(tep));
  return { ...bx, ten: JSON.parse(fs.readFileSync(path.resolve(dir, bx.bang_ten), 'utf8')) };
}

// Đích của một tệp nguồn theo bảng xếp (tính lại ở đây, không hỏi kịch bản).
export function dichCua(t, bx) {
  if (bx.tep[t]) return bx.tep[t];
  const dau = t.split('/')[0];
  if (bx.thu_muc[dau]) return bx.thu_muc[dau] + t.slice(dau.length);
  return t;
}

// ── AC-4: nội dung chỉ đổi bởi luật đã khai (phép áp luật CÀI LẠI ở đây) ───────────────────────────────────────
const thoat = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function luatRieng(bx) {
  const L = [];
  for (const [a, b] of Object.entries(bx.ten.lenh)) L.push([a, new RegExp('(?<![\\w-])' + thoat(a) + '(?![\\w-])', 'g'), b]);
  for (const [p, q] of Object.entries(bx.ten.plugin)) {
    L.push([p, new RegExp('(?<![\\w-])' + thoat(p) + ':(?=[a-z])', 'g'), q + ':']);
    L.push([p, new RegExp('(?<![\\w-])' + thoat(p) + '@', 'g'), q + '@']);
    L.push([p, new RegExp('--plugin ' + thoat(p) + '(?![\\w-])', 'g'), '--plugin ' + q]);
    L.push([p, new RegExp("plugin: '" + thoat(p) + "'", 'g'), "plugin: '" + q + "'"]);
    L.push([p, new RegExp("'" + thoat(p) + "': \\{", 'g'), "'" + q + "': {"]);
  }
  L.push([bx.cho_moi.ten_cu, new RegExp(bx.luat_cho.mau, 'g'), bx.luat_cho.thay]);
  return L;
}
const apLuat = (s, L) => L.reduce((x, [, re, thay]) => x.replace(re, thay), s);
const laChu = (b) => !b.subarray(0, 8192).includes(0);
const CHUOI_GIU = ['dieu-phoi.mjs', 'cat-luot.mjs', 'acceptance-gate-kit-tri-thuc'];

function giaiNen(kho, ref) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'kiem-cho-'));
  execFileSync('sh', ['-c', 'git -C "$1" archive "$2" | tar -x -C "$3"', 'sh', kho, ref, d], { maxBuffer: 1 << 30 });
  return d;
}

// Thư mục đích của từng plugin cũ, đọc từ tệp khai của NGUỒN.
function dichPluginCua(choNguon, bx) {
  const m = {};
  for (const p of choNguon.plugins) {
    const src = path.posix.normalize(p.source).replace(/^\.\/?/, '').replace(/\/$/, '');
    m[p.name] = src === '' || src === '.' ? path.posix.dirname(path.posix.dirname(bx.tep['.claude-plugin/plugin.json'])) : bx.thu_muc[src];
  }
  return m;
}

// Đích sau bước 1 + đổi tên tệp lệnh / thư mục skill của bước 3.
function dichDayDu(t, bx, dp) {
  let d = dichCua(t, bx);
  for (const [a, b] of Object.entries(bx.ten.lenh)) {
    const [pa, la] = a.split(':'); const lb = b.split(':')[1]; const D = dp[pa]; if (!D) continue;
    if (d === `${D}/commands/${la}.md`) d = `${D}/commands/${lb}.md`;
    else if (d.startsWith(`${D}/skills/${la}/`)) d = `${D}/skills/${lb}/` + d.slice(`${D}/skills/${la}/`.length);
  }
  return d;
}

function ac4(kho, nguon, dich, kk, bx, ngoai) {
  const loi = [];
  const L = luatRieng(bx);
  const A = giaiNen(kho, nguon), B = giaiNen(kho, dich);
  try {
    const docA = (t) => fs.readFileSync(path.join(A, t)); const docB = (t) => fs.readFileSync(path.join(B, t));
    const choNguon = JSON.parse(docA('.claude-plugin/marketplace.json').toString('utf8'));
    const dp = dichPluginCua(choNguon, bx);
    const sp = new Set(kk.hang.filter(h => h.lop === 'san-pham' || h.lop === 'chua-ro').map(h => h.tep));
    const taiLieu = new Set(bx.tai_lieu_doi_chu);
    const khuonSua = new Set(bx.khuon?.duoc_cham?.sua || []);
    const skillDoi = new Map(Object.entries(bx.ten.lenh).map(([a, b]) => [a.split(':'), b.split(':')[1]]).filter(([[pa, la]]) => dp[pa]).map(([[pa, la], lb]) => [`${dp[pa]}/skills/${lb}/SKILL.md`, [la, lb]]));
    const cayMoi = new Set(lsTree(kho, dich)); const daCo = new Set();
    const maNguon = git(kho, ['rev-parse', nguon]).trim();
    let n = 0, m = 0; const demGiu = Object.fromEntries(CHUOI_GIU.map(x => [x, [0, 0]]));
    // Số chỗ khớp của từng mục bảng tên: chữ khớp + đổi tên thư mục plugin, tệp lệnh, thư mục skill.
    const demLuat = new Map([...Object.keys(bx.ten.lenh), ...Object.keys(bx.ten.plugin), bx.cho_moi.ten_cu].map(k => [k, 0]));
    for (const p of Object.keys(bx.ten.plugin)) if (dp[p]) demLuat.set(p, demLuat.get(p) + 1);
    demLuat.set(bx.cho_moi.ten_cu, demLuat.get(bx.cho_moi.ten_cu) + 1);
    for (const t of lsTree(kho, nguon)) {
      const d = sp.has(t) ? dichDayDu(t, bx, dp) : t; daCo.add(d);
      if (d !== dichCua(t, bx)) for (const [a, b] of Object.entries(bx.ten.lenh)) {
        const [pa, la] = a.split(':'); const D = dp[pa];
        if (D && (dichCua(t, bx) === `${D}/commands/${la}.md` || dichCua(t, bx) === `${D}/skills/${la}/SKILL.md`)) demLuat.set(a, demLuat.get(a) + 1);
      }
      if (!cayMoi.has(d)) continue; // AC-3 đã báo
      const a = docA(t), b = docB(d);
      const doiChu = (sp.has(t) && d.startsWith('plugins/')) || taiLieu.has(t);
      if (!doiChu) {
        if (t === '.claude-plugin/marketplace.json' || khuonSua.has(t)) continue; // AC-5 và AC-8 đo
        if (!a.equals(b)) loi.push(`tệp không phải sản phẩm bị sửa: ${t}`); else m++;
        continue;
      }
      if (!laChu(a)) { if (!a.equals(b)) loi.push(`nội dung lệch luật: ${d}`); else n++; continue; }
      const sa = a.toString('utf8'), sb = b.toString('utf8');
      for (const x of CHUOI_GIU) { demGiu[x][0] += sa.split(x).length - 1; demGiu[x][1] += sb.split(x).length - 1; }
      for (const [k, re] of L) demLuat.set(k, demLuat.get(k) + (sa.match(re) || []).length);
      let [ky] = doiConTro(t, d, apLuat(sa, L), kk, bx, maNguon, ngoai);
      if (skillDoi.has(d)) { const [la, lb] = skillDoi.get(d); ky = ky.replace(new RegExp(`^name: ${thoat(la)}$`, 'm'), `name: ${lb}`); }
      if (/(^|\/)\.claude-plugin\/plugin\.json$/.test(d)) {
        const o = JSON.parse(ky);
        const cu = Object.keys(dp).find(k => `${dp[k]}/.claude-plugin/plugin.json` === d);
        if (cu && bx.ten.plugin[cu]) o.name = bx.ten.plugin[cu];
        if (!isDeepStrictEqual(o, JSON.parse(sb))) loi.push(`nội dung lệch luật: ${d}`); else n++;
        continue;
      }
      if (ky !== sb) loi.push(`nội dung lệch luật: ${d}`); else n++;
    }
    const them = new Set(bx.khuon?.duoc_cham?.them || []);
    for (const d of cayMoi) if (!daCo.has(d) && !them.has(d)) loi.push(`tệp lạ ở cây mới: ${d}`);
    for (const [x, [u, v]] of Object.entries(demGiu)) if (u !== v) loi.push(`chuỗi phải giữ đổi số: ${x} ${u}→${v}`);
    for (const [k, v] of demLuat) if (!v) loi.push(`luật không khớp chỗ nào: ${k}`);
    const dong = loi.length ? [] : [
      `AC-4 đạt: ${n} tệp đúng luật, ${m} tệp không phải sản phẩm giữ nguyên`,
      'chuỗi phải giữ: ' + CHUOI_GIU.map(x => `${x} ${demGiu[x][0]}→${demGiu[x][1]}`).join(' · '),
      `luật đổi chữ: ${demLuat.size}/${demLuat.size} mục bảng tên có chỗ khớp — ` + [...demLuat].map(([k, v]) => `${k} ${v}`).join(' · '),
    ];
    return { loi, dong };
  } finally { fs.rmSync(A, { recursive: true, force: true }); fs.rmSync(B, { recursive: true, force: true }); }
}

// ── AC-7: con trỏ sang kho cũ (phép đổi và phép xếp loại giữ CÀI LẠI ở đây) ───────────────────────────────────
function loaiGiuRieng(tep, truoc, giu, toi) {
  if (giu.duoi_du_lieu.some(x => tep.endsWith(x))) return 'du-lieu';
  const dong = giu.lenh_dung_truoc.map(thoat).join('|');
  if (new RegExp('(?:^|[\\s`(|&;])(?:' + dong + ')\\s+(?:\\S+\\s+){0,3}$').test(truoc)) return 'lenh';
  if (tep.endsWith('.md') && giu.md_tu_host_tien_to.some(x => toi.startsWith(x))) return 'tu-host';
  const laMa = giu.duoi_ma_chi_doi_chu_thich.some(x => tep.endsWith(x));
  if (laMa && !(/^\s*(#|\*|\/\*)/.test(truoc) || truoc.includes('//'))) return 'du-lieu';
  return null;
}
const reConTro = (toi) => new RegExp('(?<![\\w./-])((?:\\.\\.?/)*)' + thoat(toi) + '(?![\\w-]|/[\\w-])', 'g');
// Chuỗi khớp có tiền tố tương đối thì chỉ tính khi nó giải (từ thư mục tệp nguồn t) về đúng toi.
const giaiVe = (t, m, toi) => path.posix.normalize(path.posix.join(path.posix.dirname(t), m)) === toi;
// Phép kiểm KHÁC cơ chế với phép đổi: một URL kho cũ dính ngay sau ký tự đường dẫn là con trỏ bị đổi nửa chừng.
const URL_DINH = /[\w.\/-]https:\/\/github\.com\/phanlemanh\/acceptance-gate-kit\//;

// Con trỏ tương đối ngoài sổ (cài lại, không lấy từ kịch bản): chuỗi có tiền tố ../ hay ./ trong tệp sản phẩm, giải từ
// thư mục tệp NGUỒN ra một tệp không phải sản phẩm của nguồn mà sổ không có dòng rõ (t, tệp ấy) → Map t → [tệp].
function timNgoaiSo(kho, nguon, kk) {
  const dsNguon = lsTree(kho, nguon);
  const sp = new Set(kk.hang.filter(h => h.lop === 'san-pham' || h.lop === 'chua-ro').map(h => h.tep));
  // Đích: tệp của nguồn, hoặc thư mục của nguồn không chứa tệp sản phẩm nào.
  const coSp = cayCo([...sp]); const coNguon = cayCo(dsNguon); const tepNguon = new Set(dsNguon);
  const laDich = (p) => tepNguon.has(p) || (coNguon(p) && !coSp(p));
  const ro = new Set(kk.con_tro.filter(r => !r.mo_ho).map(r => r.tu + '\0' + r.toi));
  const ra = new Map();
  for (const t of sp) {
    const chu = git(kho, ['show', `${nguon}:${t}`]);
    if (chu.includes('\0')) continue;
    for (const m of chu.matchAll(/(?<![\w./@-])(?:\.\.?\/)+[\w@.\-/]*[\w@-]/g)) {
      const toi = path.posix.normalize(path.posix.join(path.posix.dirname(t), m[0]));
      if (toi.startsWith('../') || sp.has(toi) || !laDich(toi) || ro.has(t + '\0' + toi)) continue;
      const ds = ra.get(t) || []; if (!ds.includes(toi)) ra.set(t, [...ds, toi]);
    }
  }
  return ra;
}

// Đổi con trỏ của một tệp (đường NGUỒN t, đường ĐÍCH d) → [chữ mới, {toi: 'doi' | loại giữ}].
function doiConTro(t, d, chu, kk, bx, ma, ngoai) {
  const giu = bx.con_tro.giu; const ket = {};
  const hang = [...kk.con_tro.filter(r => !r.mo_ho && r.tu === t).map(r => ({ toi: r.toi, chiTien: false })),
    ...(ngoai.get(t) || []).map(toi => ({ toi, chiTien: true }))];
  for (const r of hang) {
    if (giu.duong_kho_tieu_thu.includes(r.toi)) { ket[r.toi] = 'duong-kho-tieu-thu'; continue; }
    let doi = 0, loai = null;
    chu = chu.split('\n').map(L => L.replace(reConTro(r.toi), (m, tien, i) => {
      if (r.chiTien && !tien) return m;
      if (tien && !giaiVe(t, m, r.toi)) return m;
      const k = loaiGiuRieng(d, L.slice(0, i), giu, r.toi); if (k) { loai = loai || k; return m; }
      doi++; return bx.con_tro.url.replace('{ma}', ma).replace('{duong}', r.toi);
    })).join('\n');
    ket[r.toi] = doi ? 'doi' : (loai || 'khong-thay');
  }
  return [chu, ket];
}

function ac7(kho, nguon, dich, kk, bx, dp, ngoai) {
  const loi = []; const ma = git(kho, ['rev-parse', nguon]).trim();
  const dem = { doi: 0, lenh: 0, 'tu-host': 0, 'du-lieu': 0, 'duong-kho-tieu-thu': 0 };
  const tu = [...new Set([...kk.con_tro.filter(r => !r.mo_ho).map(r => r.tu), ...ngoai.keys()])];
  for (const t of tu) {
    const chu = apLuat(git(kho, ['show', `${nguon}:${t}`]), luatRieng(bx));
    const [, ket] = doiConTro(t, dichDayDu(t, bx, dp), chu, kk, bx, ma, ngoai);
    for (const [toi, k] of Object.entries(ket)) { if (k === 'khong-thay') loi.push(`con trỏ không tìm thấy trên nguồn: ${t} → ${toi}`); else dem[k]++; }
  }
  // Quét lại cây mới: mọi lần xuất hiện của con trỏ rõ dưới plugins/ phải thuộc một loại giữ.
  const kkMoi = kiemKe({ kho, ref: dich, luat: LUAT_XEP });
  const giu = bx.con_tro.giu;
  for (const r of kkMoi.con_tro) {
    if (r.mo_ho || !r.tu.startsWith('plugins/') || giu.duong_kho_tieu_thu.includes(r.toi)) continue;
    const chu = git(kho, ['show', `${dich}:${r.tu}`]);
    const treo = chu.split('\n').some(L => [...L.matchAll(reConTro(r.toi))].some(m => (!m[1] || giaiVe(r.tu, m[0], r.toi)) && !loaiGiuRieng(r.tu, L.slice(0, m.index), giu, r.toi)));
    if (treo) loi.push(`con trỏ còn treo: ${r.tu} → ${r.toi}`);
  }
  for (const t of lsTree(kho, dich).filter(x => x.startsWith('plugins/'))) {
    const b = git(kho, ['show', `${dich}:${t}`]);
    if (URL_DINH.test(b)) loi.push(`con trỏ hỏng: ${t}`);
  }
  // Quét theo sổ NGUỒN: con trỏ tương đối còn nguyên ở cây mới không giải về toi từ thư mục MỚI (nên lượt quét trên
  // bằng sổ của cây mới không thấy nó) — giải từ thư mục của tệp NGUỒN thì thấy.
  for (const r of kk.con_tro) {
    if (r.mo_ho || giu.duong_kho_tieu_thu.includes(r.toi)) continue;
    const d = dichDayDu(r.tu, bx, dp); if (!d.startsWith('plugins/')) continue;
    let chu; try { chu = git(kho, ['show', `${dich}:${d}`]); } catch { continue; }
    const treo = chu.split('\n').some(L => [...L.matchAll(reConTro(r.toi))].some(m => (!m[1] || giaiVe(r.tu, m[0], r.toi)) && !loaiGiuRieng(d, L.slice(0, m.index), giu, r.toi)));
    if (treo) loi.push(`con trỏ còn treo: ${d} → ${r.toi}`);
  }
  const vp = quetViPhan(kho, nguon, dich, kk, bx, dp, loi);
  loi.splice(0, loi.length, ...new Set(loi));
  const g = dem.lenh + dem['tu-host'] + dem['du-lieu'] + dem['duong-kho-tieu-thu'];
  const dong = loi.length ? [] : [`AC-7 đạt: ${dem.doi} con trỏ đã đổi, ${g} giữ có lý do (lenh ${dem.lenh} · tu-host ${dem['tu-host']} · du-lieu ${dem['du-lieu']} · duong-kho-tieu-thu ${dem['duong-kho-tieu-thu']}), 0 còn treo trong plugins/`,
    `AC-7 quét vi phân: ${vp.n} đường tương đối còn ở plugins/ và giải được ở nguồn; gãy vì dời — trỏ tệp sản phẩm ${vp.goiCheo.length} (vòng B2), giữ có lý do ${vp.giu}, treo 0`,
    ...vp.goiCheo.map(x => `  trỏ tệp sản phẩm (B2): ${x}`)];
  return { loi, dong };
}

// Quét VI PHÂN — khác cơ chế với sổ kiểm kê và với phép đổi: lấy mọi đường tương đối trong tệp sản phẩm ở cây mới
// (chuỗi có tiền tố ../ ./, hoặc đích liên kết markdown), giải từ thư mục tệp ĐÍCH trên cây mới; không giải được mà cùng
// chuỗi ấy giải được từ thư mục tệp NGUỒN trên nguồn thì việc dời đã làm gãy nó. Đích không phải sản phẩm, không thuộc
// loại giữ → «con trỏ còn treo»; đích là tệp sản phẩm (gọi chéo plugin, hay tệp khai chợ ở gốc) → việc của vòng B2 (đếm,
// in, không đỏ ở đây — AC-7 chỉ hứa về con trỏ sang tệp KHÔNG phải sản phẩm).
const RE_VP = [/\]\(([^)\s#?]+)(?:[#?][^)\s]*)?\)/g, /(?<![\w./@-])((?:\.\.?\/)+[\w@.\-/]*[\w@-])/g];
function cayCo(ds) {
  const tep = new Set(ds); const dir = new Set();
  for (const x of ds) for (let p = path.posix.dirname(x); p !== '.'; p = path.posix.dirname(p)) dir.add(p);
  return (p) => tep.has(p) || dir.has(p);
}
function quetViPhan(kho, nguon, dich, kk, bx, dp, loi) {
  const coA = cayCo(lsTree(kho, nguon)), dsB = lsTree(kho, dich), coB = cayCo(dsB), tepB = new Set(dsB);
  const spDs = kk.hang.filter(h => h.lop === 'san-pham' || h.lop === 'chua-ro').map(h => h.tep);
  const laSp = cayCo(spDs); const giu = bx.con_tro.giu;
  const ra = { n: 0, goiCheo: [], giu: 0 };
  for (const t of spDs) {
    const d = dichDayDu(t, bx, dp);
    if (!d.startsWith('plugins/') || !tepB.has(d)) continue;
    const chu = git(kho, ['show', `${dich}:${d}`]);
    if (chu.includes('\0')) continue;
    chu.split('\n').forEach((L, i) => {
      const thay = new Set();
      for (const re of RE_VP) for (const m of L.matchAll(re)) {
        const s = m[1];
        if (/^(https?:|mailto:|#|\/|~|\$|\{)/.test(s) || thay.has(s)) continue;
        thay.add(s);
        const pA = path.posix.normalize(path.posix.join(path.posix.dirname(t), s));
        if (pA.startsWith('../') || !coA(pA)) continue;
        ra.n++;
        if (coB(path.posix.normalize(path.posix.join(path.posix.dirname(d), s)))) continue;
        if (laSp(pA)) { ra.goiCheo.push(`${d}:${i + 1} → ${pA}`); continue; }
        if (giu.duong_kho_tieu_thu.includes(pA) || loaiGiuRieng(d, L.slice(0, L.indexOf(s)), giu, pA)) { ra.giu++; continue; }
        loi.push(`con trỏ còn treo: ${d} → ${pA}`);
      }
    });
  }
  return ra;
}

function ac3(kk, cayMoi, bx, dp) {
  const loi = [];
  const sp = kk.hang.filter(h => h.lop === 'san-pham' || h.lop === 'chua-ro');
  const bo = new Set((bx.bo || []).map(b => b.tep));
  const demDich = new Map();
  for (const h of sp) {
    if (bo.has(h.tep)) continue;
    const d = dichDayDu(h.tep, bx, dp);
    demDich.set(d, (demDich.get(d) || 0) + 1);
    if (!cayMoi.has(d)) loi.push(`tệp sản phẩm không có chỗ: ${h.tep}`);
    else if (d !== h.tep && cayMoi.has(h.tep)) loi.push(`tệp sản phẩm hai chỗ: ${h.tep}`);
  }
  for (const [d, n] of demDich) if (n > 1) loi.push(`hai tệp chung một đích: ${d}`);
  for (const h of kk.hang) if (h.lop !== 'san-pham' && h.lop !== 'chua-ro' && !cayMoi.has(h.tep)) loi.push(`tệp không phải sản phẩm mất chỗ: ${h.tep}`);
  const n = sp.length - bo.size;
  const dem = (l) => sp.filter(h => h.lop === l).length;
  const dong = loi.length ? [] : [
    `AC-3 đạt: ${n}/${n} tệp sản phẩm có đúng một chỗ · bỏ: ${bo.size}`,
    `san-pham ${dem('san-pham')} · chua-ro ${dem('chua-ro')}`,
  ];
  return { loi, dong };
}

function ac5(kho, dich, cayMoi, kk, bx) {
  const loi = [];
  const cho = JSON.parse(git(kho, ['show', `${dich}:.claude-plugin/marketplace.json`]));
  if (cho.name !== bx.cho_moi.ten_moi) loi.push(`chợ chưa đổi tên: ${cho.name}`);
  const tenCu = kk.plugin.map(p => p.ten);
  const tenMongDoi = tenCu.map(t => bx.ten.plugin[t] || t);
  for (const p of cho.plugins) {
    const src = path.posix.normalize(p.source).replace(/^\.\//, '').replace(/\/$/, '');
    if (src === '' || src === '.') { loi.push(`nguồn plugin là gốc kho: ${p.name}`); continue; }
    const khai = `${src}/.claude-plugin/plugin.json`;
    if (!cayMoi.has(khai)) { loi.push(`nguồn plugin không có: ${p.name}`); continue; }
    const ten = JSON.parse(git(kho, ['show', `${dich}:${khai}`])).name;
    if (ten !== p.name) loi.push(`tên plugin lệch tệp khai: ${p.name} ≠ ${ten}`);
  }
  const ten = cho.plugins.map(p => p.name);
  if (JSON.stringify([...ten].sort()) !== JSON.stringify([...tenMongDoi].sort())) loi.push(`bộ plugin lệch bảng tên: ${ten.join(', ')} ≠ ${tenMongDoi.join(', ')}`);
  const dong = loi.length ? [] : [`AC-5 đạt: chợ ${cho.name}, ${ten.length} plugin (${ten.join(', ')})`];
  return { loi, dong };
}

export function kiemCho({ kho, nguon, dich, bangXep = path.join(DAY, 'bang-xep.json'), luat = LUAT_XEP }) {
  const bx = docBang(bangXep);
  const kk = kiemKe({ kho, ref: nguon, luat });
  const cayMoi = new Set(lsTree(kho, dich));
  const dp = dichPluginCua(JSON.parse(git(kho, ['show', `${nguon}:.claude-plugin/marketplace.json`])), bx);
  const ngoai = timNgoaiSo(kho, nguon, kk);
  const ket = [ac3(kk, cayMoi, bx, dp), ac4(kho, nguon, dich, kk, bx, ngoai), ac5(kho, dich, cayMoi, kk, bx), ac7(kho, nguon, dich, kk, bx, dp, ngoai)];
  return { loi: ket.flatMap(k => k.loi), dong: ket.flatMap(k => k.dong), kk };
}

// AC-1: so hai lần chạy. null = giống nhau.
export function soHaiLan(kho, a, b) {
  const r = (x) => git(kho, ['rev-parse', x]).trim();
  if (r(`${a}^{tree}`) !== r(`${b}^{tree}`)) return 'hai lần chạy khác mã cây';
  if (r(a) !== r(b)) return 'hai lần chạy khác mã commit';
  return null;
}

// AC-2: ảnh chụp ref, HEAD, thư mục làm việc và danh sách cây làm việc của kho.
export function chupKho(kho) {
  const refs = new Map(git(kho, ['for-each-ref', '--format=%(refname) %(objectname)']).split('\n').filter(Boolean).map(d => d.split(' ')));
  return {
    refs, head: git(kho, ['rev-parse', 'HEAD']).trim(), sym: git(kho, ['symbolic-ref', '-q', 'HEAD']).trim(),
    status: git(kho, ['status', '--porcelain']), worktree: git(kho, ['worktree', 'list', '--porcelain']),
  };
}

export function soChup(truoc, sau, nhanhDich) {
  const loi = [];
  const dich = `refs/heads/${nhanhDich}`;
  for (const ref of new Set([...truoc.refs.keys(), ...sau.refs.keys()])) {
    if (ref !== dich && truoc.refs.get(ref) !== sau.refs.get(ref)) loi.push(`ref không phải đích bị đổi: ${ref}`);
  }
  if (truoc.head !== sau.head || truoc.sym !== sau.sym) loi.push('HEAD bị đổi');
  if (truoc.status !== sau.status) loi.push('thư mục làm việc bị đổi');
  if (truoc.worktree !== sau.worktree) loi.push('danh sách cây làm việc bị đổi');
  return loi;
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  const a = {}; const k = { '--kho': 'kho', '--nguon': 'nguon', '--dich': 'dich', '--bang-xep': 'bangXep' };
  const av = process.argv.slice(2);
  for (let i = 0; i < av.length; i++) { if (!k[av[i]]) { process.stderr.write(`kiem-cho: cờ lạ ${av[i]}\n`); process.exit(2); } a[k[av[i]]] = av[++i]; }
  if (!a.kho || !a.nguon || !a.dich) { process.stderr.write('dùng: node kiem-cho.mjs --kho <git> --nguon <ref> --dich <ref> [--bang-xep <tệp>]\n'); process.exit(2); }
  const kq = kiemCho(a);
  for (const d of kq.dong) process.stdout.write(d + '\n');
  for (const l of kq.loi) process.stderr.write('kiem-cho: ' + l + '\n');
  process.exit(kq.loi.length ? 1 : 0);
}
