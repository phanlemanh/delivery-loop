#!/usr/bin/env node
'use strict';
// so-man.cjs — Đặc tả UX đọc sổ màn (hồ sơ dac-ta-ux-doc-so-man, bản thiết kế
// docs/superpowers/specs/2026-11-22-dac-ta-ux-doc-so-man-design.md).
//
//   node so-man.cjs --root <kho> --dien [--man <mã,mã>]
//   node so-man.cjs --root <kho> --kiem --slug <hồ sơ>
//   node so-man.cjs --root <kho> --kiem --tep <bản thiết kế>
//
// Chỉ có hiệu lực ở kho có lệnh đọc màn `tools/design-assembly/screen-facts.mjs`. Kit GỌI lệnh ấy; kit không mở
// tệp sổ màn hay bảng trạng thái bắt buộc của kho. Kho không có lệnh đọc: im, thoát 0 — và không ghi ở đâu rằng
// kho «không có lệnh đọc»: tệp vắng mặt là sự thật duy nhất, đọc lại mỗi lần chạy.
//
// Mã thoát: 0 không có gì đỏ · 1 có câu đỏ · 2 không kiểm được ở đây (gọi sai, lệnh đọc lỗi, câu trả lời hỏng).
//
// Bộ đọc bảng trạng thái — ranh giới đóng: ba hàm sẵn có của lib/ (xoá trắng khối mã · cắt mục theo bảng ranh giới ·
// đọc phần đầu hợp đồng) cộng một luật dòng đóng (bản thiết kế §3.2). Không dò chữ: mỗi dòng giữa hai marker là
// tiêu đề, phân cách hay hàng dữ liệu, ngoài ra là đỏ có số dòng.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { stripNonProse } = require('../lib/context-glossary.js');
const { sectionLines } = require('../lib/md-section.cjs');
const { frontmatterField } = require('../lib/evidence-core.cjs');
const { laMatNguoiNhin } = require('../lib/lop-nhin-thay.cjs');

const LENH_DOC = 'tools/design-assembly/screen-facts.mjs';
const KHUON_TEP = path.join(__dirname, '../skills/acceptance/references/ux-spec-template.md');
const HAN_MAC_DINH_MS = 10000;
const MUC = 'Đặc tả UX';
const TRAN_CAU_DO_THE = 5;

// ── Câu — mỗi câu một hàm, dùng chung cho lệnh và thẻ (bản thiết kế §3.4) ───────────────────────────────────────────
const cau = {
  khongCoMan: (M, N, X) => `màn «${M}» không có trong sổ màn (dòng ${N}, mã «${X}»)`,
  khongCoTrangThai: (M, T, N, X) => `màn «${M}» không có trạng thái «${T}» trong sổ màn (dòng ${N}, mã «${X}»)`,
  thieuBatBuoc: (M, T) => `màn «${M}» thiếu trạng thái «${T}» mà sổ màn bắt phải có — thêm hàng «ST-${M}-${T}»`,
  saiTienTo: (X, M, N) => `mã trạng thái «${X}» không mang mã màn «${M}» của cùng hàng — khuôn là ST-<mã màn>-<trạng thái> (dòng ${N})`,
  khaiHaiLan: (X, N, K) => `mã trạng thái «${X}» khai hai lần (dòng ${N} và dòng ${K})`,
  rong: () => 'bảng trạng thái rỗng — không có hàng dữ liệu nào giữa hai marker UX-STATE-TABLE',
  thieuCot: (C, N) => `bảng trạng thái thiếu cột «${C}» ở hàng tiêu đề (dòng ${N})`,
  dongLa: N => `dòng ${N} giữa hai marker UX-STATE-TABLE không phải một hàng của bảng`,
  soO: (N, K, H) => `dòng ${N} có ${K} ô, hàng tiêu đề có ${H} ô`,
  oTrong: (N, C) => `dòng ${N}: ô «${C}» trống hoặc còn ô khuôn chưa điền`,
  soMarker: (K, H) => `mục Đặc tả UX có ${K} marker mở và ${H} marker đóng UX-STATE-TABLE — phải đúng một cặp, mở trước đóng`,
  matNguoiKhongBang: () => 'hồ sơ có mặt người nhìn mà bản thiết kế không có bảng trạng thái — kho này có sổ màn để so',
  khongDocDuoc: L => `không đọc được sổ màn ở đây: «${L}»`,
  gioiHanMustHave: () => 'kho không có bảng trạng thái bắt buộc — vế «thiếu trạng thái sổ bắt phải có» không kiểm được ở đây',
  khoaKhongThay: (K, L) => `sổ màn viết khoá «${K}» theo cách lệnh đọc không thấy (tìm «${L}») — mã màn và trạng thái vẫn đọc được`,
  khop: (N, M) => `bảng trạng thái khớp sổ màn: ${N} hàng, ${M} màn`,
  // Ngoài §3.4: lời của lối vào và của lệnh điền.
  khongCoBang: () => 'bản thiết kế không có bảng trạng thái — không có gì để so',
  tepKhongDoc: P => `không đọc được tệp «${P}»`,
  oNguoiViet: K => `còn ${K} ô người viết chưa điền (ô khuôn hoặc trống) — không đỏ`,
  dienKhongCo: M => `màn «${M}» không có trong sổ màn — không điền hàng nào cho nó`,
  dienKhongTrangThai: M => `màn «${M}» không có trạng thái nào trong sổ màn — chỉ có hàng kiểm kê`,
  dienTuChoi: M => `màn «${M}» có tên hoặc trạng thái chứa «|» hoặc xuống dòng — không điền được vào bảng`,
  dienBatBuoc: (M, ds) => `màn «${M}» bắt phải có: ${ds.join(', ')}`,
  theConLai: K => `… và còn ${K} câu đỏ nữa — chạy lệnh kiểm để xem đủ`,
  cachDung: 'cách dùng: so-man.cjs --root <kho> (--dien [--man <mã,mã>] | --kiem (--slug <hồ sơ> | --tep <bản thiết kế>))',
};

const nfc = s => String(s == null ? '' : s).normalize('NFC');
const docTep = p => { try { return fs.readFileSync(p, 'utf8'); } catch (_) { return null; } };
const hanMs = () => { const v = Number(process.env.SO_MAN_HAN_MS); return Number.isInteger(v) && v > 0 ? v : HAN_MAC_DINH_MS; };
const coLenhDoc = root => fs.existsSync(path.join(root, LENH_DOC));

// ── Khuôn: marker, hàng tiêu đề bảng trạng thái, bảng kiểm kê — rút từ tệp khuôn lúc chạy ───────────────────────────
function oCua(dong) {
  const s = String(dong).trim();
  if (!s.startsWith('|')) return null;
  const than = s.slice(1, s.endsWith('|') && s.length > 1 ? -1 : undefined);
  return than.split('|').map(x => x.trim());
}
const laPhanCach = dong => String(dong).trim().startsWith('|') && /^[\s|:-]+$/.test(dong) && dong.includes('-');

function docKhuon(tep = KHUON_TEP) {
  const t = docTep(tep);
  if (t === null) throw new Error(`không đọc được khuôn đặc tả UX ${tep}`);
  const m = t.match(/<!-- <<<UX-SPEC-TEMPLATE -->\n([\s\S]*?)<!-- UX-SPEC-TEMPLATE>>> -->/);
  if (!m) throw new Error('khuôn đặc tả UX thiếu khối UX-SPEC-TEMPLATE');
  const dong = m[1].split('\n');
  const iMo = dong.findIndex(l => /<<<UX-STATE-TABLE/.test(l));
  const iDong = dong.findIndex(l => /UX-STATE-TABLE>>>/.test(l));
  if (iMo < 0 || iDong < iMo) throw new Error('khuôn đặc tả UX thiếu cặp marker UX-STATE-TABLE');
  const tdTrangThai = dong.slice(iMo + 1).find(l => oCua(l));
  const iKiemKe = dong.findIndex(l => oCua(l));
  if (!tdTrangThai || iKiemKe < 0 || iKiemKe > iMo) throw new Error('khuôn đặc tả UX thiếu bảng kiểm kê hoặc tiêu đề bảng trạng thái');
  const cot = oCua(tdTrangThai);
  return {
    mo: dong[iMo].trim(),
    dong: dong[iDong].trim(),
    tieuDe: tdTrangThai.trim(),
    cot,
    cotMa: cot[0],
    cotMan: cot[1],
    kiemKeTieuDe: dong[iKiemKe].trim(),
    kiemKeMau: oCua(dong[iKiemKe + 2]) || [],
  };
}

// ── Bộ đọc bảng trạng thái (bản thiết kế §3.2) ─────────────────────────────────────────────────────────────────────
// Marker chỉ tính khi cả dòng bằng đúng chuỗi marker, thụt tối đa ba dấu cách.
const laMarker = (l, mk) => { const m = String(l).match(/^ {0,3}(\S.*?)[ \t]*$/); return !!m && m[1] === mk; };

function docBang(designTxt, khuon) {
  const sach = stripNonProse(String(designTxt == null ? '' : designTxt).replace(/\r\n?/g, '\n'));
  const muc = sectionLines(sach, MUC);
  const mo = muc.filter(x => laMarker(x.l, khuon.mo));
  const dg = muc.filter(x => laMarker(x.l, khuon.dong));
  if (!mo.length && !dg.length) return { bang: false };
  if (mo.length !== 1 || dg.length !== 1 || mo[0].no > dg[0].no) {
    return { bang: true, do: [cau.soMarker(mo.length, dg.length)], hang: [], oKhuon: 0 };
  }
  const giua = muc.filter(x => x.no > mo[0].no && x.no < dg[0].no && x.l.trim());
  if (!giua.length) return { bang: true, do: [cau.rong()], hang: [], oKhuon: 0 };
  const [td, ...con] = giua;
  const cot = oCua(td.l);
  if (!cot) return { bang: true, do: [cau.dongLa(td.no)], hang: [], oKhuon: 0 };
  const thieu = [khuon.cotMa, khuon.cotMan].filter(c => !cot.includes(c));
  if (thieu.length) return { bang: true, do: thieu.map(c => cau.thieuCot(c, td.no)), hang: [], oKhuon: 0 };
  const iMa = cot.indexOf(khuon.cotMa), iMan = cot.indexOf(khuon.cotMan);
  const loi = [], hang = [];
  let oKhuon = 0, soDuLieu = 0;
  con.forEach((x, i) => {
    if (i === 0) { if (!laPhanCach(x.l)) loi.push(cau.dongLa(x.no)); return; }
    const o = oCua(x.l);
    if (!o) { loi.push(cau.dongLa(x.no)); return; }
    if (o.length !== cot.length) { loi.push(cau.soO(x.no, o.length, cot.length)); return; }
    soDuLieu++;
    const ma = nfc(o[iMa]), man = nfc(o[iMan]);
    let hong = false;
    for (const [v, c] of [[ma, khuon.cotMa], [man, khuon.cotMan]]) {
      if (!v || v.includes('{{')) { loi.push(cau.oTrong(x.no, c)); hong = true; }
    }
    o.forEach((v, j) => { if (j !== iMa && j !== iMan && (!v || v.includes('{{'))) oKhuon++; });
    if (!hong) hang.push({ no: x.no, ma, man });
  });
  if (!soDuLieu) loi.push(cau.rong());
  const dau = new Map();
  for (const h of hang) {
    if (dau.has(h.ma)) loi.push(cau.khaiHaiLan(h.ma, dau.get(h.ma), h.no));
    else dau.set(h.ma, h.no);
  }
  return { bang: true, do: loi, hang, oKhuon };
}

// ── Lệnh đọc màn ────────────────────────────────────────────────────────────────────────────────────────────────────
const dongDau = s => (String(s || '').split('\n').map(l => l.trim()).find(Boolean)) || '(không có lời)';

function sai(j) {
  if (!j || typeof j !== 'object' || Array.isArray(j)) return 'câu trả lời của lệnh đọc không phải một đối tượng JSON';
  if (!('screens' in j)) return 'câu trả lời thiếu khoá «screens»';
  if (!Array.isArray(j.screens)) return 'khoá «screens» không phải mảng';
  for (let i = 0; i < j.screens.length; i++) {
    const s = j.screens[i];
    if (!s || typeof s !== 'object') return `khoá «screens[${i}]» không phải một đối tượng`;
    if (typeof s.id !== 'string') return `khoá «screens[${i}].id» không phải chuỗi`;
    if (!Array.isArray(s.states) || s.states.some(x => typeof x !== 'string')) return `khoá «screens[${i}].states» không phải mảng`;
    if (s.must_have !== null && (!Array.isArray(s.must_have) || s.must_have.some(x => typeof x !== 'string'))) return `khoá «screens[${i}].must_have» không phải mảng hay null`;
  }
  if (!Array.isArray(j.unknown)) return 'câu trả lời thiếu khoá «unknown»';
  if (j.keys_not_found !== undefined && !Array.isArray(j.keys_not_found)) return 'khoá «keys_not_found» không phải mảng';
  return null;
}

// → { co: false } (không có lệnh đọc) · { co: true, loi } · { co: true, ketQua }
function docLenhDoc(root, man) {
  if (!coLenhDoc(root)) return { co: false };
  const han = hanMs();
  const doiSo = [path.join(root, LENH_DOC), '--json', '--target', root, ...(man.length ? ['--screens', man.join(',')] : [])];
  const r = spawnSync(process.execPath, doiSo, { cwd: root, encoding: 'utf8', timeout: han, maxBuffer: 64 * 1024 * 1024 });
  if (r.error && r.error.code === 'ETIMEDOUT') return { co: true, loi: `lệnh đọc không trả lời trong ${han} ms` };
  if (r.error) return { co: true, loi: `không chạy được lệnh đọc: ${r.error.message}` };
  if (r.status === null) return { co: true, loi: `lệnh đọc bị dừng bởi ${r.signal}` };
  if (r.status === 2) return { co: true, loi: `lệnh đọc thoát 2: ${dongDau(r.stderr)}` };
  if (r.status !== 0 && r.status !== 1) return { co: true, loi: `lệnh đọc thoát mã lạ ${r.status}` };
  let j;
  try { j = JSON.parse(r.stdout); } catch (_) { return { co: true, loi: 'câu trả lời của lệnh đọc không phải JSON' }; }
  const s = sai(j);
  if (s) return { co: true, loi: s };
  if (r.status === 1 && !j.unknown.length) return { co: true, loi: 'lệnh đọc thoát 1 mà «unknown» rỗng' };
  return { co: true, ketQua: { ...j, keys_not_found: j.keys_not_found || [] } };
}

// ── So với sổ (bản thiết kế §3.3) ───────────────────────────────────────────────────────────────────────────────────
function soVoiSo(hang, kq) {
  const loi = [], ghi = [];
  // Màn không tìm thấy trong `screens` là màn sổ không có — dù lệnh đọc liệt nó ở `unknown` (thoát 1) hay không.
  const tim = man => kq.screens.find(s => nfc(s.id) === man || (s.route != null && nfc(s.route) === man));
  const coMat = new Map();
  for (const h of hang) {
    const s = tim(h.man);
    if (!s) { loi.push(cau.khongCoMan(h.man, h.no, h.ma)); continue; }
    const id = nfc(s.id);
    if (!coMat.has(id)) coMat.set(id, { s, co: new Set() });
    const tienTo = `ST-${id}-`;
    if (!h.ma.startsWith(tienTo) || h.ma.length === tienTo.length) { loi.push(cau.saiTienTo(h.ma, id, h.no)); continue; }
    const t = h.ma.slice(tienTo.length);
    const hopLe = new Set([...s.states, ...(s.must_have || [])].map(nfc));
    if (!hopLe.has(t)) { loi.push(cau.khongCoTrangThai(id, t, h.no, h.ma)); continue; }
    coMat.get(id).co.add(t);
  }
  let coNull = false;
  for (const [id, { s, co }] of coMat) {
    if (s.must_have === null) { coNull = true; continue; }
    for (const t of s.must_have.map(nfc)) if (!co.has(t)) loi.push(cau.thieuBatBuoc(id, t));
  }
  if (coNull) ghi.push(cau.gioiHanMustHave());
  for (const k of kq.keys_not_found) ghi.push(cau.khoaKhongThay(k && k.key, k && k.looked_for));
  return { do: loi, ghi, soMan: coMat.size };
}

// Kiểm một bản thiết kế. → { code, do: [câu đỏ], ghi: [dòng thông tin] }. Bên gọi đã biết kho có lệnh đọc.
function kiemBang(root, designTxt, { matNguoi = false, imKhiKhongBang = false } = {}) {
  const b = docBang(designTxt, docKhuon());
  if (!b.bang) {
    if (matNguoi) return { code: 1, do: [cau.matNguoiKhongBang()], ghi: [] };
    return { code: 0, do: [], ghi: imKhiKhongBang ? [] : [cau.khongCoBang()] };
  }
  if (b.do.length) return { code: 1, do: b.do, ghi: [] };
  const r = docLenhDoc(root, [...new Set(b.hang.map(h => h.man))]);
  if (!r.co) return { code: 0, do: [], ghi: [] };
  if (r.loi) return { code: 2, do: [cau.khongDocDuoc(r.loi)], ghi: [] };
  const s = soVoiSo(b.hang, r.ketQua);
  const ghi = [...s.ghi, ...(b.oKhuon ? [cau.oNguoiViet(b.oKhuon)] : []), ...(s.do.length ? [] : [cau.khop(b.hang.length, s.soMan)])];
  return { code: s.do.length ? 1 : 0, do: s.do, ghi };
}

// Đường bản thiết kế của hồ sơ: phải nằm trong gốc kho. → { txt } · { loi } · {} (hợp đồng không khai).
function banThietKe(root, designDoc) {
  if (!designDoc) return {};
  const goc = path.resolve(root);
  const p = path.resolve(goc, designDoc);
  if (!p.startsWith(goc + path.sep)) return { loi: cau.tepKhongDoc(designDoc) };
  const txt = docTep(p);
  return txt === null ? { loi: cau.tepKhongDoc(designDoc) } : { txt };
}

function kiemHoSo(root, contractTxt) {
  const tk = banThietKe(root, frontmatterField(contractTxt, 'design_doc'));
  if (tk.loi) return { code: 2, do: [tk.loi], ghi: [] };
  return kiemBang(root, tk.txt || '', { matNguoi: laMatNguoiNhin(frontmatterField(contractTxt, 'surfaces')), imKhiKhongBang: true });
}

// Khối thông tin trên thẻ Cổng Phạm vi. null = không có khối (kho không lệnh đọc · hồ sơ không còn nháp · không gì
// để nói). Không ném: lỗi hiện thành một dòng trong khối.
function theCong1({ root, contractTxt }) {
  try {
    if (!coLenhDoc(root)) return null;
    if (frontmatterField(contractTxt, 'status') !== 'draft') return null;
    const r = kiemHoSo(root, contractTxt);
    if (!r.do.length && !r.ghi.length) return null;
    const conLai = r.do.length - TRAN_CAU_DO_THE;
    return { dong: [...r.do.slice(0, TRAN_CAU_DO_THE), ...(conLai > 0 ? [cau.theConLai(conLai)] : []), ...r.ghi] };
  } catch (e) {
    return { dong: [`không dựng được khối sổ màn: ${e.message}`] };
  }
}

// ── Lệnh điền ───────────────────────────────────────────────────────────────────────────────────────────────────────
const conHong = s => /[|\n\r]/.test(String(s == null ? '' : s));
const khuonO = ten => `{{${ten.charAt(0).toLowerCase()}${ten.slice(1)}}}`;

function dien(root, man) {
  const r = docLenhDoc(root, man);
  if (!r.co) return { code: 0, khoi: '', ghi: [] };
  if (r.loi) return { code: 2, khoi: '', ghi: [cau.khongDocDuoc(r.loi)] };
  const khuon = docKhuon();
  const ghi = [];
  let tuChoi = false, coNull = false;
  const kiemKe = [], trangThai = [];
  for (const s of r.ketQua.screens) {
    const id = nfc(s.id);
    const mh = s.must_have === null ? null : s.must_have.map(nfc);
    const ds = mh === null ? s.states.map(nfc) : [...mh, ...s.states.map(nfc).filter(t => !mh.includes(t))];
    if ([s.id, s.route, s.title, ...ds].some(conHong)) { ghi.push(cau.dienTuChoi(id)); tuChoi = true; continue; }
    kiemKe.push(`| ${s.title != null ? `${nfc(s.title)} (${id})` : id} | ${khuon.kiemKeMau.slice(1).join(' | ')} |`);
    if (mh === null) coNull = true;
    else if (mh.length) ghi.push(cau.dienBatBuoc(id, mh));
    if (!ds.length) ghi.push(cau.dienKhongTrangThai(id));
    for (const t of ds) {
      trangThai.push(`| ${khuon.cot.map(c => (c === khuon.cotMa ? `ST-${id}-${t}` : c === khuon.cotMan ? id : khuonO(c))).join(' | ')} |`);
    }
  }
  for (const m of r.ketQua.unknown) ghi.push(cau.dienKhongCo(nfc(m)));
  if (coNull) ghi.push(cau.gioiHanMustHave());
  const phanCach = n => `|${'---|'.repeat(n)}`;
  const khoi = [khuon.kiemKeTieuDe, phanCach(oCua(khuon.kiemKeTieuDe).length), ...kiemKe, '',
    khuon.mo, khuon.tieuDe, phanCach(khuon.cot.length), ...trangThai, khuon.dong, ''].join('\n');
  return { code: tuChoi ? 2 : r.ketQua.unknown.length ? 1 : 0, khoi, ghi };
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
function docLoiGoi(a) {
  const o = {};
  for (let i = 0; i < a.length; i++) {
    const f = a[i];
    if (f === '--dien' || f === '--kiem') { if (o[f]) return null; o[f] = true; continue; }
    if (['--root', '--man', '--slug', '--tep'].includes(f)) {
      const v = a[i + 1];
      if (v === undefined || v.startsWith('--') || o[f] !== undefined) return null;
      o[f] = v; i++; continue;
    }
    return null;
  }
  if (!o['--root'] || !!o['--dien'] === !!o['--kiem']) return null;
  if (o['--dien'] && (o['--slug'] !== undefined || o['--tep'] !== undefined)) return null;
  if (o['--kiem'] && (o['--man'] !== undefined || (o['--slug'] === undefined) === (o['--tep'] === undefined))) return null;
  return o;
}

function chay(argv) {
  const o = docLoiGoi(argv);
  if (!o) { process.stderr.write(cau.cachDung + '\n'); return 2; }
  const root = path.resolve(o['--root']);
  if (!coLenhDoc(root)) return 0;
  if (o['--dien']) {
    const man = [...new Set(String(o['--man'] || '').split(',').map(s => nfc(s.trim())).filter(Boolean))];
    const d = dien(root, man);
    if (d.khoi) process.stdout.write(d.khoi);
    if (d.ghi.length) process.stderr.write(d.ghi.join('\n') + '\n');
    return d.code;
  }
  let r;
  if (o['--slug'] !== undefined) {
    const rel = path.join('_acceptance', o['--slug'], 'contract.md');
    const hd = docTep(path.join(root, rel));
    r = hd === null ? { code: 2, do: [cau.tepKhongDoc(rel)], ghi: [] } : kiemHoSo(root, hd);
  } else {
    const txt = docTep(path.resolve(root, o['--tep']));
    r = txt === null ? { code: 2, do: [cau.tepKhongDoc(o['--tep'])], ghi: [] } : kiemBang(root, txt);
  }
  const ra = [...r.do, ...r.ghi];
  if (ra.length) process.stdout.write(ra.join('\n') + '\n');
  return r.code;
}

module.exports = { cau, docKhuon, docBang, docLenhDoc, soVoiSo, kiemBang, kiemHoSo, dien, theCong1, LENH_DOC };

if (require.main === module) {
  try { process.exitCode = chay(process.argv.slice(2)); } catch (e) {
    process.stderr.write(`so-man: ${e.message}\n`);
    process.exitCode = 2;
  }
}
