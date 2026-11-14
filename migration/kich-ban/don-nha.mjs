#!/usr/bin/env node
// don-nha.mjs — kịch bản chuyển nhà (vòng B1 kich-ban-chuyen-nha của đợt chuyển kit sang kho delivery-loop).
//
// Lấy MỘT mã commit của nhánh chính kho cũ (mặc định kit-cu/main) và dựng nhánh cục bộ (mặc định don-nha/3.0) = mã ấy
// + đúng sáu commit dọn nhà:
//   1/6 dời sản phẩm vào plugins/<tên>/     · 2/6 tệp khai chợ và plugin   · 3/6 đổi tên theo bảng tên
//   4/6 con trỏ sang kho cũ                  · 5/6 khuôn Repo Standards     · 6/6 bộ kiểm theo bố cục mới (B2)
// Chỉ phép biến đổi CƠ HỌC: dời, đổi tên có neo, đổi con trỏ, chạy khuôn. Sửa ngữ nghĩa sản phẩm làm ở kho cũ.
// Tất định: tác giả, người commit và ngày cố định (ngày của mã nguồn) → cùng nguồn thì cùng mã commit.
// Làm trong một cây làm việc tạm tách khỏi mọi nhánh; ref đích chỉ ghi ở cuối khi mọi bước qua. Không chạm ref nào khác.
//
// Dùng:  node don-nha.mjs [--kho <git>] [--nguon <ref>] [--nhanh <tên>] [--bang-xep <tệp>] [--repo-standards <thư mục>]
// Thoát: 0 xong (dòng cuối «don-nha: <nguồn> → <commit> cây <cây>») · 1 dừng có tên · 2 sai đối số.
// Thiết kế: THIET-KE.md cạnh tệp này. Kiểm: don-nha.test.mjs. Thước độc lập: kiem-cho.mjs.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { kiemKe } from '../tra-soat/kiem-ke.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const LUAT_XEP = path.join(DAY, '..', 'tra-soat', 'luat-xep.json');

export const NHANH_DICH = /^don-nha\/[A-Za-z0-9._-]+$/;
export class Dung extends Error {}
const dung = (lyDo) => { throw new Dung(lyDo); };

const git = (cwd, args, env) => execFileSync('git', ['-C', cwd, ...args], {
  encoding: 'utf8', maxBuffer: 1 << 30, env: env ? { ...process.env, ...env } : process.env, stdio: ['ignore', 'pipe', 'pipe'],
});

function doiSo(argv) {
  const a = { kho: path.join(DAY, '..', '..'), bangXep: path.join(DAY, 'bang-xep.json') };
  const khoa = { '--kho': 'kho', '--nguon': 'nguon', '--nhanh': 'nhanh', '--bang-xep': 'bangXep', '--repo-standards': 'rs', '--ra': 'ra' };
  for (let i = 0; i < argv.length; i++) {
    const k = khoa[argv[i]];
    if (!k || argv[i + 1] === undefined) return null;
    a[k] = argv[++i];
  }
  return a;
}

export function docBangXep(tep) {
  const bx = JSON.parse(fs.readFileSync(tep, 'utf8'));
  bx._dir = path.dirname(path.resolve(tep));
  bx._bangTen = JSON.parse(fs.readFileSync(path.resolve(bx._dir, bx.bang_ten), 'utf8'));
  return bx;
}

// Mục gốc của nguồn phải nằm trong một trong ba nhóm của bảng xếp.
function kiemThuMucGoc(kho, S, bx) {
  const biet = new Set([...Object.keys(bx.thu_muc), ...Object.keys(bx.tep).map(t => t.split('/')[0]), ...bx.giu.map(t => t.split('/')[0])]);
  for (const muc of git(kho, ['ls-tree', '--name-only', S]).split('\n').filter(Boolean)) {
    if (!biet.has(muc)) dung(`thư mục gốc chưa xếp: ${muc}`);
  }
}

function nhanhDangCheckOut(kho, ref) {
  return git(kho, ['worktree', 'list', '--porcelain']).split('\n').some(d => d === `branch ${ref}`);
}

// ── Bước 1: dời sản phẩm ────────────────────────────────────────────────────────────────────────────────────────
function buoc1Doi(wt, bx) {
  const cap = [...Object.entries(bx.thu_muc), ...Object.entries(bx.tep)];
  for (const [nguon, dich] of cap) {
    if (!fs.existsSync(path.join(wt, nguon))) continue;
    fs.mkdirSync(path.dirname(path.join(wt, dich)), { recursive: true });
    git(wt, ['mv', nguon, dich]);
  }
}

// Thư mục gốc của plugin lõi trên cây mới (nơi tệp khai lõi dời tới, bỏ đuôi /.claude-plugin/plugin.json).
const gocLoi = (bx) => path.posix.dirname(path.posix.dirname(bx.tep['.claude-plugin/plugin.json']));

// Thay đúng một lần một chuỗi trong văn bản; không khớp đúng một lần → dừng.
function thayMotLan(s, cu, moi, noi) {
  const n = s.split(cu).length - 1;
  if (n !== 1) dung(`tệp khai không đúng khuôn: ${noi} có ${n} chỗ «${cu}»`);
  return s.replace(cu, moi);
}

// ── Bước 2: tệp khai chợ và plugin (sửa chữ, giữ nguyên định dạng) ─────────────────────────────────────────────────
function buoc2TepKhai(wt, bx) {
  const dichPlugin = {};
  const tepCho = path.join(wt, '.claude-plugin/marketplace.json');
  let s = fs.readFileSync(tepCho, 'utf8');
  const cho = JSON.parse(s);
  s = thayMotLan(s, `"name": "${cho.name}"`, `"name": "${bx.cho_moi.ten_moi}"`, 'marketplace.json');
  for (const p of cho.plugins) {
    const nguon = path.posix.normalize(p.source).replace(/^\.\/?/, '').replace(/\/$/, '');
    const dich = nguon === '' || nguon === '.' ? gocLoi(bx) : bx.thu_muc[nguon];
    if (!dich) dung(`nguồn plugin chưa xếp: ${p.name} (${p.source})`);
    dichPlugin[p.name] = dich;
    s = thayMotLan(s, `"source": "${p.source}"`, `"source": "./${dich}"`, 'marketplace.json');
    const moi = bx._bangTen.plugin[p.name];
    if (moi) {
      s = thayMotLan(s, `"name": "${p.name}"`, `"name": "${moi}"`, 'marketplace.json');
      const tepKhai = path.join(wt, dich, '.claude-plugin/plugin.json');
      fs.writeFileSync(tepKhai, thayMotLan(fs.readFileSync(tepKhai, 'utf8'), `"name": "${p.name}"`, `"name": "${moi}"`, `${dich}/.claude-plugin/plugin.json`));
    }
  }
  fs.writeFileSync(tepCho, s);
  return dichPlugin;
}

// ── Bước 3: đổi tên theo bảng tên (tên tệp lệnh, thư mục skill, chữ có neo) ───────────────────────────────────────
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const laChu = (buf) => !buf.subarray(0, 8192).includes(0);

// Luật đổi chữ theo thứ tự áp. `khoa` = mục của bảng tên mà luật phục vụ (để đếm «0 chỗ»).
export function luatDoiChu(bx) {
  const L = [];
  for (const [cu, moi] of Object.entries(bx._bangTen.lenh)) L.push({ khoa: cu, re: new RegExp(`(?<![\\w-])${esc(cu)}(?![\\w-])`, 'g'), thay: moi });
  for (const [p, q] of Object.entries(bx._bangTen.plugin)) {
    L.push({ khoa: p, re: new RegExp(`(?<![\\w-])${esc(p)}:(?=[a-z])`, 'g'), thay: `${q}:` });
    L.push({ khoa: p, re: new RegExp(`(?<![\\w-])${esc(p)}@`, 'g'), thay: `${q}@` });
    L.push({ khoa: p, re: new RegExp(`--plugin ${esc(p)}(?![\\w-])`, 'g'), thay: `--plugin ${q}` });
    // Tên tự khai của chính plugin trong mã mod: khoá trạng thái (atom) và khoá kiểu (types/index.d.ts).
    L.push({ khoa: p, re: new RegExp(`plugin: '${esc(p)}'`, 'g'), thay: `plugin: '${q}'` });
    L.push({ khoa: p, re: new RegExp(`'${esc(p)}': \\{`, 'g'), thay: `'${q}': {` });
  }
  L.push({ khoa: bx.cho_moi.ten_cu, re: new RegExp(bx.luat_cho.mau, 'g'), thay: bx.luat_cho.thay });
  return L;
}

function buoc3DoiTen(wt, bx, dichPlugin) {
  const dem = new Map(); // khoá bảng tên → số chỗ
  const cong = (k, n = 1) => dem.set(k, (dem.get(k) || 0) + n);
  for (const p of Object.keys(bx._bangTen.plugin)) if (dichPlugin[p]) cong(p);   // thư mục + tệp khai đã đổi ở bước 1–2
  cong(bx.cho_moi.ten_cu);                                                        // tên chợ đã đổi ở bước 2
  for (const [cu, moi] of Object.entries(bx._bangTen.lenh)) {
    const [pc, lc] = cu.split(':'); const lm = moi.split(':')[1];
    const D = dichPlugin[pc];
    if (!D) dung(`luật trỏ plugin không có: ${cu}`);
    const cmd = `${D}/commands/${lc}.md`; const sk = `${D}/skills/${lc}`;
    if (fs.existsSync(path.join(wt, cmd))) { git(wt, ['mv', cmd, `${D}/commands/${lm}.md`]); cong(cu); }
    else if (fs.existsSync(path.join(wt, sk))) {
      git(wt, ['mv', sk, `${D}/skills/${lm}`]); cong(cu);
      const tep = path.join(wt, D, 'skills', lm, 'SKILL.md');
      const nd = fs.readFileSync(tep, 'utf8'); const re = new RegExp(`^name: ${esc(lc)}$`, 'm');
      if (re.test(nd)) { fs.writeFileSync(tep, nd.replace(re, `name: ${lm}`)); cong(cu); }
    }
  }
  const L = luatDoiChu(bx);
  const tap = [...git(wt, ['ls-files', '-z', 'plugins']).split('\0').filter(Boolean), ...bx.tai_lieu_doi_chu.filter(t => fs.existsSync(path.join(wt, t)))];
  const so = [];
  for (const t of tap) {
    const buf = fs.readFileSync(path.join(wt, t)); if (!laChu(buf)) continue;
    let nd = buf.toString('utf8'); const goc = nd;
    for (const l of L) {
      const n = (nd.match(l.re) || []).length;
      if (n) { nd = nd.replace(l.re, l.thay); cong(l.khoa, n); so.push([l.khoa, t, n]); }
    }
    if (nd !== goc) fs.writeFileSync(path.join(wt, t), nd);
  }
  for (const k of [...Object.keys(bx._bangTen.lenh), ...Object.keys(bx._bangTen.plugin), bx.cho_moi.ten_cu]) {
    if (!dem.get(k)) dung(`luật không khớp chỗ nào: ${k}`);
  }
  return so;
}

// ── Bước 4: con trỏ sang kho cũ ─────────────────────────────────────────────────────────────────────────────────
// Đích của một tệp NGUỒN sau bước 1 và bước 3 (đổi tên tệp lệnh, thư mục skill).
function dichSau(t, bx, dichPlugin) {
  const dau = t.split('/')[0];
  let d = bx.tep[t] || (bx.thu_muc[dau] ? bx.thu_muc[dau] + t.slice(dau.length) : t);
  for (const [cu, moi] of Object.entries(bx._bangTen.lenh)) {
    const [pc, lc] = cu.split(':'); const lm = moi.split(':')[1]; const D = dichPlugin[pc]; if (!D) continue;
    if (d === `${D}/commands/${lc}.md`) d = `${D}/commands/${lm}.md`;
    else if (d.startsWith(`${D}/skills/${lc}/`)) d = `${D}/skills/${lm}/` + d.slice(`${D}/skills/${lc}/`.length);
  }
  return d;
}

// Loại giữ của một lần xuất hiện con trỏ (null = đổi thành URL). `truoc` = phần dòng đứng trước con trỏ.
function loaiGiu(tep, truoc, giu, toi) {
  if (giu.duoi_du_lieu.some(x => tep.endsWith(x))) return 'du-lieu';
  const lenh = new RegExp(`(?:^|[\\s\`(|&;])(?:${giu.lenh_dung_truoc.map(esc).join('|')})\\s+(?:\\S+\\s+){0,3}$`);
  if (lenh.test(truoc)) return 'lenh';
  if (tep.endsWith('.md') && giu.md_tu_host_tien_to.some(x => toi.startsWith(x))) return 'tu-host';
  if (giu.duoi_ma_chi_doi_chu_thich.some(x => tep.endsWith(x)) && !/(^\s*(#|\*|\/\*)|\/\/)/.test(truoc)) return 'du-lieu';
  return null;
}

// Tệp sản phẩm → các tệp KHÔNG phải sản phẩm của S mà nó trỏ bằng chuỗi tương đối (../ hay ./) và sổ chưa có.
const RE_TUONG_DOI = /(?<![\w./@-])((?:\.{1,2}\/)+[\w@.\-/]*[\w@-])/g;
function conTroNgoaiSo(wt, S, kk, theoTep) {
  const tepS = git(wt, ['ls-tree', '-r', '--name-only', '-z', S]).split('\0').filter(Boolean);
  const sp = new Set(kk.hang.filter(h => h.lop === 'san-pham' || h.lop === 'chua-ro').map(h => h.tep));
  // Đích hợp lệ: tệp của S, hoặc thư mục của S không chứa tệp sản phẩm nào.
  const thuMuc = (ds) => new Set(ds.flatMap(x => { const r = []; for (let q = path.posix.dirname(x); q !== '.'; q = path.posix.dirname(q)) r.push(q); return r; }));
  const dirSp = thuMuc([...sp]);
  const laDich = new Set([...tepS, ...[...thuMuc(tepS)].filter(q => !dirSp.has(q))]);
  const ra = new Map();
  for (const tu of [...sp].sort()) {
    const chu = git(wt, ['show', `${S}:${tu}`]);
    if (chu.includes('\0')) continue;
    const co = new Set(theoTep.get(tu) || []);
    for (const [, s] of chu.matchAll(RE_TUONG_DOI)) {
      const toi = path.posix.normalize(path.posix.join(path.posix.dirname(tu), s));
      if (toi.startsWith('..') || !laDich.has(toi) || sp.has(toi) || co.has(toi)) continue;
      co.add(toi); ra.set(tu, [...(ra.get(tu) || []), toi]);
    }
  }
  return ra;
}

function buoc4ConTro(wt, bx, S, dichPlugin) {
  const giu = bx.con_tro.giu;
  const kk = kiemKe({ kho: wt, ref: S, luat: LUAT_XEP });
  const ket = { doi: 0, giu: { lenh: 0, 'tu-host': 0, 'du-lieu': 0, 'duong-kho-tieu-thu': 0 } };
  const theoTep = new Map();
  for (const r of kk.con_tro) if (!r.mo_ho) theoTep.set(r.tu, [...(theoTep.get(r.tu) || []), r.toi]);
  // Con trỏ tương đối ngoài sổ: sổ kiểm kê bỏ qua tên tệp trần (`../GUIDE.md` thành `GUIDE.md`, «mơ hồ») và đường tương
  // đối trong chú thích mã. Chuỗi có tiền tố ../ hay ./ giải (từ thư mục tệp NGUỒN) ra một tệp không phải sản phẩm của S
  // là con trỏ rõ — thêm vào, và chỉ đổi các lần xuất hiện CÓ tiền tố của nó.
  const ngoaiSo = conTroNgoaiSo(wt, S, kk, theoTep);
  for (const [tu, ds] of ngoaiSo) theoTep.set(tu, [...(theoTep.get(tu) || []), ...ds]);
  for (const [tu, dsToi] of theoTep) {
    const d = dichSau(tu, bx, dichPlugin);
    const p = path.join(wt, d);
    let nd = fs.readFileSync(p, 'utf8');
    for (const toi of dsToi) {
      if (giu.duong_kho_tieu_thu.includes(toi)) { ket.giu['duong-kho-tieu-thu']++; continue; }
      const chiTuongDoi = ngoaiSo.get(tu)?.includes(toi) ?? false;
      // Cả chuỗi, kể cả tiền tố tương đối ../ hay ./ — chỉ khi chuỗi ấy giải (từ thư mục của tệp NGUỒN) về đúng tệp đích.
      const re = new RegExp(`(?<![\\w.\\/-])((?:\\.{1,2}\\/)*)${esc(toi)}(?![\\w-]|\\/[\\w-])`, 'g');
      let doi = 0, loai = null;
      nd = nd.split('\n').map(L => L.replace(re, (m, tien, viTri) => {
        if (chiTuongDoi && !tien) return m; // tên trần của con trỏ ngoài sổ vẫn mơ hồ
        if (tien && path.posix.normalize(path.posix.join(path.posix.dirname(tu), m)) !== toi) return m;
        const k = loaiGiu(d, L.slice(0, viTri), giu, toi);
        if (k) { loai = loai || k; return m; }
        doi++; return bx.con_tro.url.replace('{ma}', S).replace('{duong}', toi);
      })).join('\n');
      if (!doi && !loai) dung(`con trỏ không tìm thấy: ${d} → ${toi}`);
      if (doi) ket.doi++; else ket.giu[loai]++;
    }
    fs.writeFileSync(p, nd);
  }
  return ket;
}

// ── Bước 5: khuôn Repo Standards ────────────────────────────────────────────────────────────────────────────────
function buoc5Khuon(wt, bx, rs, ngayNguon) {
  const k = bx.khuon;
  if (!rs) dung('thiếu bản kéo Repo Standards (--repo-standards)');
  let ma;
  try { ma = git(rs, ['rev-parse', 'HEAD']).trim(); } catch { dung(`không đọc được bản kéo Repo Standards: ${rs}`); }
  if (ma !== k.ma) dung(`khuôn không đúng thẻ ${k.the}: bản kéo đứng ở ${ma.slice(0, 8)}, cần ${k.ma.slice(0, 8)}`);
  const vars = Object.entries(k.vars).flatMap(([a, b]) => ['--var', `${a}=${b}`]);
  let ra;
  try {
    ra = execFileSync('python3', [path.join(rs, k.apply), '--target', wt, '--preset', 'claude-plugin', '--level', 'starter', '--adopt', '--json',
      '--var', `year=${ngayNguon.slice(0, 4)}`, '--var', `today=${ngayNguon.slice(0, 10)}`, ...vars], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) { dung(`khuôn chạy lỗi: ${String(e.stderr || e.message).trim().split('\n').pop()}`); }
  const kq = JSON.parse(ra);
  for (const t of kq.conflict || []) if (!k.trung_duoc_phep.includes(t)) dung(`khuôn xung đột: ${t}`);
  for (const t of k.bo_tep) fs.rmSync(path.join(wt, t), { force: true });
  const mk = path.join(wt, 'Makefile');
  if (!fs.existsSync(mk)) dung('khuôn không tạo Makefile');
  const dong = fs.readFileSync(mk, 'utf8').split('\n');
  const i = dong.findIndex(d => /^test:/.test(d));
  if (i < 0) dung('Makefile của khuôn không có đích test');
  let j = i + 1; while (j < dong.length && dong[j].startsWith('\t')) j++;
  dong.splice(i + 1, j - i - 1, `\t${k.make_test}`);
  fs.writeFileSync(mk, dong.join('\n'));
  git(wt, ['add', '-A']);
  const duoc = { A: k.duoc_cham.them, M: k.duoc_cham.sua, D: k.duoc_cham.xoa };
  for (const d of git(wt, ['diff', '--cached', '--name-status', '--no-renames']).split('\n').filter(Boolean)) {
    const [loai, tep] = d.split('\t');
    if (!(duoc[loai] || []).includes(tep)) dung(`khuôn chạm tệp ngoài danh sách: ${tep}`);
  }
}

// ── Bước 6: bộ kiểm theo bố cục mới (B2 bo-kiem-xanh-o-kho-moi, THIET-KE-B2.md §3) ───────────────────────────────
// Đổi đường dẫn tới thư mục sản phẩm và tên theo bảng tên trong tệp mã kiểm (tests/ trừ fixtures/) và các tệp chạy bộ
// kiểm ở gốc; rồi áp bảng vá theo tệp (mỗi mục ghim số lần khớp). Chỉ phép thay cơ học — sửa ý nghĩa ca đi về kho cũ.
export function buoc6BoKiem(wt, bx, kho, S, dichPlugin) {
  const k = bx.bo_kiem;
  if (!k) return [];
  const cu = new Set(git(kho, ['ls-tree', '-r', '--name-only', S]).split('\n').filter(Boolean));
  const thuMucCu = new Set();
  for (const t of cu) { const p = t.split('/'); for (let i = 1; i < p.length; i++) thuMucCu.add(p.slice(0, i).join('/')); }
  const coCu = (q) => cu.has(q) || thuMucCu.has(q);
  const dauCu = [...new Set([...thuMucCu].map(d => d.split('/')[0]))];
  // Mơ hồ = cùng đường ấy cũng có dưới một thư mục gốc khác (vd hooks/hooks.json ở gốc và dieu-phoi/hooks/hooks.json).
  const moHo = (q) => dauCu.some(d => d !== q.split('/')[0] && coCu(`${d}/${q}`));
  // Tiền tố dài nhất, từ HAI đoạn trở lên, có ở nguồn — một chữ gốc trần (tên bộ «hooks») không bao giờ là đường.
  const tienTo = (p) => { const s = p.replace(/\/+$/, '').split('/'); for (let i = s.length; i >= 2; i--) { const q = s.slice(0, i).join('/'); if (coCu(q)) return q; } return null; };
  const dichQ = (q) => bx.tep[q] || (cu.has(q) ? dichSau(q, bx, dichPlugin) : dichSau(`${q}/`, bx, dichPlugin).slice(0, -1));
  const goc = Object.keys(bx.thu_muc);
  const G = goc.map(esc).join('|');
  const T = Object.keys(bx.tep).map(esc).join('|');
  const bien = new Set(k.bien_goc);
  const BIEN = k.bien_goc.map(esc).join('|');
  const RE_DUONG = new RegExp(`(^|[\\s"'\`(=\\[,{]|\\$\\{?\\w+\\}?/|\\$\\([^)]*\\)/|(?:\\.\\./)+|HEAD:)((?:${G})/[A-Za-z0-9_.\\-/]*|(?:${T})(?![\\w.-]))`, 'gm');
  const RE_MANG = new RegExp(`\\[\\s*(?:(['"])[\\w.\\-/]+\\1\\s*,\\s*)*(['"])(?:${G})\\2(?:\\s*,\\s*(['"])[\\w.\\-/]+\\3)*\\s*\\]`, 'g');
  const RE_DOI_SO = new RegExp(`(\\b(?:${BIEN})\\s*,\\s*)(['"])(${G})\\2(\\s*[,)])`, 'g');
  // Cặp phần tử `'<gốc>', '<tên>'` ở mọi chỗ (sau '..', sau biến bản sao kit…): đổi khi <gốc>/<tên> có ở nguồn và không mơ hồ.
  const RE_CAP = new RegExp(`(['"])(${G})\\1(\\s*,\\s*)(['"])([\\w.\\-]+)\\4`, 'g');
  // Gốc plugin lõi: ở bố cục cũ gốc kho cũng là gốc plugin lõi (kit tự host); bố cục mới thì là plugins/acceptance-gate.
  const GOC_LOI = path.posix.dirname(path.posix.dirname(bx.tep['.claude-plugin/plugin.json']));
  const RE_GOC_JS = new RegExp(`(['"]--ag-root['"]\\s*,\\s*|CLAUDE_PLUGIN_ROOT:\\s*)(${BIEN})\\b(?!\\s*[.\\[(])`, 'g');
  const RE_GOC_SH = new RegExp(`(--ag-root[ =]|CLAUDE_PLUGIN_ROOT=)"\\$(\\{?)(${BIEN})(\\}?)"`, 'g');
  // Luật đổi chữ của bước 3, riêng luật tên chợ thêm neo phía trước: trong bộ kiểm, «…-acceptance-gate-kit/» là tên thư mục
  // (bản ghi phiên của kho cũ), không phải tên chợ.
  const L = luatDoiChu(bx).map(l => (l.khoa === bx.cho_moi.ten_cu ? { ...l, re: new RegExp(`(?<![\\w-])(?:${l.re.source})`, 'g') } : l));
  const thuocTap = (t) => (t.startsWith(k.tap) && !t.includes(k.tru) && k.duoi.some(d => t.endsWith(d)))
    || k.tep_goc.some(g => (g.endsWith('/') ? t.startsWith(g) : t === g));
  const so = [];
  const dem = { duong: 0, mang: 0, 'doi-so': 0, cap: 0, 'goc-plugin': 0, ten: 0, va: 0 };
  const tep = git(wt, ['ls-files', '-z']).split('\0').filter(t => t && thuocTap(t));
  const noiDung = new Map();
  for (const t of tep) {
    const buf = fs.readFileSync(path.join(wt, t)); if (!laChu(buf)) continue;
    let nd = buf.toString('utf8'); const goc0 = nd; const thu = path.dirname(path.join(wt, t));
    const n = { duong: 0, mang: 0, 'doi-so': 0, cap: 0, 'goc-plugin': 0, ten: 0 };
    nd = nd.replace(RE_DUONG, (m, truoc, p) => {
      const q = bx.tep[p] ? p : tienTo(p);
      if (!q) return m;
      const bienM = truoc.match(/^\$\{?(\w+)\}?\/$/);
      if ((bienM && !bien.has(bienM[1]) || /^\$\(/.test(truoc)) && moHo(q)) return m;     // biến không phải gốc kho + đường mơ hồ
      if (!/\.\.\/|^\$|^HEAD:/.test(truoc) && fs.existsSync(path.join(thu, q.split('/')[0]))) return m; // trùng thư mục cạnh tệp kiểm
      n.duong++; return truoc + dichQ(q) + p.slice(q.length);
    });
    nd = nd.replace(RE_MANG, (m) => {
      const ten = [...m.matchAll(/(['"])([\w.\-/]+)\1/g)].map(x => x[2]);
      if (!ten.every(x => goc.includes(x) || ['tests', '.claude-plugin', '_acceptance', 'docs'].includes(x) || x.startsWith('_acceptance/'))) return m;
      n.mang++; return m.replace(/(['"])([\w.\-]+)\1/g, (z, q, x) => (goc.includes(x) ? q + bx.thu_muc[x] + q : z));
    });
    // Cặp phần tử trước (đổi được cả tên skill / lệnh đi kèm), rồi mới tới đối số đơn sau biến gốc kho.
    nd = nd.replace(RE_CAP, (m, q1, g, sep, q2, ten, off, chuoi) => {
      const p = `${g}/${ten}`;
      if (!coCu(p)) return m;
      const truoc = chuoi.slice(Math.max(0, off - 40), off);
      const chac = /'\.\.'\s*,\s*$/.test(truoc) || new RegExp(`\\b(?:${BIEN})\\s*,\\s*$`).test(truoc);
      if (!chac && moHo(p)) return m;
      const d = dichQ(p); const i = d.lastIndexOf('/');
      n.cap++; return `${q1}${d.slice(0, i)}${q1}${sep}${q2}${d.slice(i + 1)}${q2}`;
    });
    nd = nd.replace(RE_DOI_SO, (m, a, q, g, z) => { n['doi-so']++; return `${a}${q}${bx.thu_muc[g]}${q}${z}`; });
    nd = nd.replace(RE_GOC_JS, (m, a, v) => { n['goc-plugin']++; return a + '`${' + v + '}/' + GOC_LOI + '`'; });
    // Giữ nguyên dạng ngoặc: "${X}" có thể nằm trong template literal của JS — bỏ ngoặc là biến thành chữ trần.
    nd = nd.replace(RE_GOC_SH, (m, a, mo, v, dong) => { n['goc-plugin']++; return a + '"$' + mo + v + dong + '/' + GOC_LOI + '"'; });
    for (const l of L) { const c = (nd.match(l.re) || []).length; if (c) { nd = nd.replace(l.re, l.thay); n.ten += c; } }
    for (const [lop, c] of Object.entries(n)) if (c) { dem[lop] += c; so.push([lop, t, c]); }
    if (nd !== goc0) noiDung.set(t, nd);
  }
  if (!dem.duong && !dem.mang && !dem['doi-so'] && !dem.cap) dung('luật bộ kiểm không khớp chỗ nào');
  const va = k.va ? JSON.parse(fs.readFileSync(path.resolve(bx._dir, k.va), 'utf8')) : [];
  for (const v of va) {
    const p = path.join(wt, v.tep);
    const nd = noiDung.get(v.tep) ?? (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
    const c = nd.split(v.cu).length - 1;
    if (c !== v.so_lan) dung(`vá không khớp: ${v.tep}: ${v.cu}`);
    noiDung.set(v.tep, nd.split(v.cu).join(v.moi));
    dem.va += c; so.push(['va', v.tep, c]);
  }
  for (const [t, nd] of noiDung) fs.writeFileSync(path.join(wt, t), nd);
  return so;
}

export function chay({ kho, nguon, nhanh, bangXep, rs, ra }) {
  const bx = docBangXep(bangXep);
  nguon = nguon || bx.nguon_mac_dinh;
  nhanh = nhanh || bx.nhanh_mac_dinh;
  const REF_DICH = `refs/heads/${nhanh}`;
  let S;
  try { S = git(kho, ['rev-parse', '--verify', `${nguon}^{commit}`]).trim(); } catch { dung(`không đọc được nguồn: ${nguon}`); }
  if (nhanhDangCheckOut(kho, REF_DICH)) dung(`nhánh đích đang được check-out ở một cây làm việc: ${nhanh}`);
  kiemThuMucGoc(kho, S, bx);
  const ngayNguon = git(kho, ['log', '-1', '--format=%cI', S]).trim();
  const env = {
    GIT_AUTHOR_NAME: bx.tac_gia.ten, GIT_AUTHOR_EMAIL: bx.tac_gia.email,
    GIT_COMMITTER_NAME: bx.tac_gia.ten, GIT_COMMITTER_EMAIL: bx.tac_gia.email,
    GIT_AUTHOR_DATE: ngayNguon, GIT_COMMITTER_DATE: ngayNguon,
  };
  const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'don-nha-'));
  const wt = path.join(tam, 'cay');
  git(kho, ['worktree', 'add', '-q', '--detach', wt, S]);
  try {
    const commit = (tieuDe) => { git(wt, ['add', '-A']); git(wt, ['-c', 'commit.gpgsign=false', 'commit', '-q', '--allow-empty', '-m', tieuDe], env); };
    buoc1Doi(wt, bx); commit('dọn nhà 1/6: dời sản phẩm vào plugins/<tên>/');
    const dichPlugin = buoc2TepKhai(wt, bx); commit('dọn nhà 2/6: tệp khai chợ và plugin');
    const soDoiChu = buoc3DoiTen(wt, bx, dichPlugin); commit('dọn nhà 3/6: đổi tên theo bảng tên');
    buoc4ConTro(wt, bx, S, dichPlugin); commit('dọn nhà 4/6: con trỏ sang kho cũ');
    buoc5Khuon(wt, bx, rs, ngayNguon); commit('dọn nhà 5/6: khuôn Repo Standards');
    const soBoKiem = buoc6BoKiem(wt, bx, kho, S, dichPlugin); commit('dọn nhà 6/6: bộ kiểm theo bố cục mới');
    const dinh = git(wt, ['rev-parse', 'HEAD']).trim();
    const cay = git(wt, ['rev-parse', 'HEAD^{tree}']).trim();
    git(kho, ['update-ref', REF_DICH, dinh]);
    if (ra) {
      fs.mkdirSync(ra, { recursive: true });
      fs.writeFileSync(path.join(ra, 'doi-bo-kiem.tsv'), ['# máy sinh bởi migration/kich-ban/don-nha.mjs (bước 6) từ ' + S, 'lop\ttep\tso', ...soBoKiem.map(r => r.join('\t'))].join('\n') + '\n');
      fs.writeFileSync(path.join(ra, 'doi-chu.tsv'), ['# máy sinh bởi migration/kich-ban/don-nha.mjs từ ' + S, 'luat\ttep\tso', ...soDoiChu.map(r => r.join('\t'))].join('\n') + '\n');
    }
    return { nguon: S, commit: dinh, cay };
  } finally {
    try { git(kho, ['worktree', 'remove', '--force', wt]); } catch { /* đã gỡ */ }
    fs.rmSync(tam, { recursive: true, force: true });
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  const a = doiSo(process.argv.slice(2));
  if (!a) { process.stderr.write('dùng: node don-nha.mjs [--kho <git>] [--nguon <ref>] [--nhanh <tên>] [--bang-xep <tệp>] [--repo-standards <thư mục>]\n'); process.exit(2); }
  // B2 AC-6 (Ngoài-1 của B1): nhánh đích chỉ được là don-nha/<tên> — gõ nhầm main hay chuyen-nha không ghi đè được.
  if (a.nhanh !== undefined && !NHANH_DICH.test(a.nhanh)) { process.stderr.write(`don-nha: nhánh đích phải là don-nha/<tên>: ${a.nhanh}\n`); process.exit(2); }
  try {
    const kq = chay(a);
    process.stdout.write(`don-nha: ${kq.nguon} → ${kq.commit} cây ${kq.cay}\n`);
  } catch (e) {
    if (!(e instanceof Dung)) throw e;
    process.stderr.write(`don-nha: ${e.message}\n`);
    process.exit(1);
  }
}
