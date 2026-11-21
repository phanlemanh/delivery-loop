// lgck-the.test.mjs — hồ sơ loi-gop-trong-cau-ky: ở kho đã bật `feature_loop.gop_theo_loi_ky`, thẻ Cổng
// Bằng chứng của hồ sơ chờ chữ ký người in sẵn ô báo «gộp: khi CI xanh» ngay trước ô hỏi «ký hay trả»;
// kho không bật thì thẻ bằng từng byte bản trước vòng (AC-1…AC-4, AC-9).
// Hồ sơ thử do mã sinh: kịch bản bash của tests/plugins/fixtures/viec-cua-anh-scenarios.sh; dòng khoá
// của config.yaml hồ sơ thử do ca sửa trên chính tệp kịch bản ghi. Mỗi ca là hàm nhận đường gate-card.js
// (hoặc văn bản luật) và trả danh sách sai, nên cùng ca chạy trên cây thật (đối chứng dương) và trên bản
// sao đã tiêm MỘT nhát (chiều đỏ). Mọi đường suy từ vị trí tệp này.
// Chọn ca: LGCK_CASES=<tên,…>; ca được gọi tên mà không in PASS/FAIL → «ca không chạy», thoát 1.
// Không gọi tên: chạy mọi ca TRỪ các ca quét trọn hồ sơ thật (LG-AC2-im và hai nhát của nó).
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const AG = 'plugins/acceptance-gate';
const GC_REL = path.join(AG, 'scripts', 'gate-card.js');
const LAW_REL = path.join(AG, 'skills', 'acceptance', 'references', 'human-facing-language.md');
const SIGNOFF_REL = path.join(AG, 'commands', 'signoff.md');
const GC = path.join(KIT, GC_REL);
const LAW = path.join(KIT, LAW_REL);
const SIGNOFF = path.join(KIT, SIGNOFF_REL);
const SCEN = path.join(KIT, 'tests', 'plugins', 'fixtures', 'viec-cua-anh-scenarios.sh');
const KHOA = 'gop_theo_loi_ky';
const NHAN = 'gộp';
const O_GOP = `${NHAN}: khi CI xanh`;
const NHAN_KY = 'ký hay trả';
const O_KY = `${NHAN_KY}: ___`;
const TMP = mkdtempSync(path.join(tmpdir(), 'lgck-'));

let pass = 0; let fail = 0; const daIn = new Set();
const ok = (name, msg = '') => { pass += 1; daIn.add(name); console.log(`PASS: ${name} ${msg}`.trimEnd()); };
const bad = (name, msg) => { fail += 1; daIn.add(name); console.log(`FAIL: ${name} — ${msg}`); };
const CHON = process.env.LGCK_CASES ? process.env.LGCK_CASES.split(',').map(s => s.trim()).filter(Boolean) : null;
const CHI_KHI_GOI_TEN = new Set(['LG-AC2-im', 'LG-dot-bien-lech-khi-tat', 'LG-dot-bien-lech-qua-lib']);
const want = name => (CHON ? CHON.includes(name) : !CHI_KHI_GOI_TEN.has(name));
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');

// ── hồ sơ thử ───────────────────────────────────────────────────────────────
function canh(ten) {
  const ws = mkdtempSync(path.join(TMP, 'ws-'));
  execFileSync('bash', ['-c', '. "$1"; vca_scenario "$2" "$3"', 'x', SCEN, ten, ws]);
  return ws;
}
const fx = ws => path.join(ws, '_acceptance', 'fx');
const cfgP = ws => path.join(ws, '_acceptance', 'config.yaml');
const sua = (ws, f, fn) => { const p = path.join(fx(ws), f); const cu = readFileSync(p, 'utf8'); const moi = fn(cu); if (moi === cu) throw new Error(`ho so thu: sua ${f} khong doi gi`); writeFileSync(p, moi); };
const ghiSo = (ws, ...dong) => appendFileSync(path.join(fx(ws), 'decisions.jsonl'), dong.map(d => JSON.stringify(d) + '\n').join(''));
// Khối khoá đúng như kịch bản gate2-loi-gop ghi (hai dòng cuối tệp). Nền config của kho thử KHÔNG khoá
// rút từ chính kịch bản ấy (một nguồn) — dùng cho kịch bản không tự ghi config.yaml.
const RE_KHOI_KHOA = new RegExp(`^feature_loop:\\n  ${KHOA}:.*\\n`, 'm');
let _nen = null;
function nenCfg() {
  if (_nen != null) return _nen;
  const goc = readFileSync(cfgP(canh('gate2-loi-gop')), 'utf8');
  const nen = goc.replace(RE_KHOI_KHOA, '');
  if (nen === goc || nen.includes(KHOA)) throw new Error('ho so thu: kich ban gate2-loi-gop khong ghi khoi khoa dung khuon');
  return (_nen = nen);
}
// giaTri === null → khoá VẮNG (config vẫn có mặt); chuỗi → ghi nguyên văn sau dấu hai chấm.
function datKhoa(ws, giaTri) {
  const goc = existsSync(cfgP(ws)) ? readFileSync(cfgP(ws), 'utf8') : nenCfg();
  const nen = goc.replace(RE_KHOI_KHOA, '');
  if (nen.includes(KHOA)) throw new Error('ho so thu: config con dong khoa sau khi go');
  writeFileSync(cfgP(ws), nen + (giaTri == null ? '' : `feature_loop:\n  ${KHOA}: ${giaTri}\n`));
}
const CHU_KY = 'human_signoff: Manh Phan 2026-11-20';
const kyBaoCao = ws => sua(ws, 'evidence-report.md', t => (/^human_signoff:.*$/m.test(t) ? t.replace(/^human_signoff:.*$/m, CHU_KY) : t.replace(/^(verdict:.*)$/m, `$1\n${CHU_KY}`)));
const doiVerdict = (ws, v) => sua(ws, 'evidence-report.md', t => t.replace(/^verdict:.*$/m, `verdict: ${v}`));
const DONG_NGHI = { id: 'd-20261120T100000Z-1', type: 'nghi', stage: 'nghi', by: 'M', at: '2026-11-20T10:00:00Z', decision: 'tien de ngoai da chet' };

function the(ws, gc, gate = '2') {
  const a = ['--root', ws, '--slug', 'fx', '--gate', gate];
  const h = spawnSync(process.execPath, [gc, ...a], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const x = spawnSync(process.execPath, [gc, ...a, '--extract'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  let j = null; try { j = JSON.parse(x.stdout); } catch (_) { /* lỗi in ở songSot */ }
  return { html: h.stdout || '', raw: x.stdout || '', j, st: h.status, stx: x.status, err: `${h.stderr}${x.stderr}`.slice(0, 300) };
}
const dongMau = html => { const m = html.match(/Trả lời mẫu[^«]*«([^»]*)»/); return m ? m[1] : null; };
const dongLenh = html => { const m = html.match(/Dòng lệnh[^<]*<b>([^<]*)<\/b>/); return m ? m[1] : null; };
const songSot = (t, s, o = '') => { if (t.st !== 0 || t.stx !== 0 || !t.j || !t.j.routing) { s.push(`${o}the khong dung duoc (html ${t.st}, extract ${t.stx}): ${t.err}`); return false; } return true; };

// ── ca ──────────────────────────────────────────────────────────────────────
// Sáu cách viết khoá của Global Constraints + khoá vắng: bật ⇔ hai cách đầu. Bên đọc của lệnh gộp chạy
// cùng danh sách (ca GL-6 hàng «khoá kho tắt») — thẻ in ô gộp mà bên đọc từ chối thì người gõ lời gộp vô ích.
const CACH_VIET = [
  ['true', true], ['true  # bật lời gộp trong câu ký', true],
  ['false', false], ['"true"', false], ['True', false], ['yes', false], [null, false],
];
const CA = {};
CA['LG-AC1-bat'] = gc => {
  const s = []; const ws = canh('gate2-loi-gop');
  const t = the(ws, gc);
  if (!songSot(t, s)) return s;
  const { hoi, bao } = t.j.routing; const one = String(t.j.one_shot || ''); const lenh = dongLenh(t.html);
  if (!one.includes(O_KY)) s.push(`ky hay tra khong con ___: one_shot=${one}`);
  if (!one.includes(`${O_GOP}; ${O_KY}`)) s.push(`one_shot thieu «${O_GOP}; ${O_KY}» lien nhau: ${one}`);
  if (lenh == null) s.push('HTML khong co dong lenh');
  else if (!lenh.includes(`${O_GOP}; ${O_KY}`)) s.push(`dong lenh HTML thieu «${O_GOP}; ${O_KY}» lien nhau: ${lenh}`);
  if (!bao.includes(NHAN)) s.push(`routing.bao thieu «${NHAN}»: ${JSON.stringify(bao)}`);
  if (hoi.includes(NHAN)) s.push(`routing.hoi chua «${NHAN}»: ${JSON.stringify(hoi)}`);
  if (!hoi.includes(NHAN_KY)) s.push(`routing.hoi thieu «${NHAN_KY}»: ${JSON.stringify(hoi)}`);
  const mau = dongMau(t.html);
  if (mau == null) s.push('HTML khong co dong «Trả lời mẫu»');
  else if (mau.includes(NHAN)) s.push(`dong «Trả lời mẫu» chua «${NHAN}»: «${mau}»`);
  if (!t.html.includes(`sửa ô «${NHAN}» trong dòng lệnh thành «chưa»`)) s.push(`VIEC CUA ANH thieu cau sua o «${NHAN}» thanh «chưa»`);
  // Đối chứng tiền đề: CÙNG hồ sơ thử, kho không bật → không có «gộp» ở cả HTML lẫn extract.
  datKhoa(ws, null);
  const t0 = the(ws, gc);
  if (songSot(t0, s, 'tien de: ')) {
    if (t0.html.includes(NHAN) || t0.raw.includes(NHAN)) s.push(`tien de: kho khong bat ma the con «${NHAN}» (html ${t0.html.includes(NHAN)}, extract ${t0.raw.includes(NHAN)})`);
    if (!t0.j.routing.hoi.includes(NHAN_KY)) s.push(`tien de: kho khong bat ma routing.hoi thieu «${NHAN_KY}»`);
  }
  let n = 0;
  for (const [gt, mongBat] of CACH_VIET) {
    datKhoa(ws, gt); const tk = the(ws, gc); n += 1;
    const ten = gt == null ? 'vắng' : gt;
    if (!songSot(tk, s, `cach viet khoa «${ten}»: `)) continue;
    const bat = tk.html.includes(O_GOP) && tk.raw.includes(O_GOP) && tk.j.routing.bao.includes(NHAN);
    const tat = !tk.html.includes(NHAN) && !tk.raw.includes(NHAN);
    if (mongBat && !bat) s.push(`cach viet khoa «${ten}»: can BAT ma the khong in «${O_GOP}»`);
    if (!mongBat && !tat) s.push(`tien de: cach viet khoa «${ten}» can TAT ma the con «${NHAN}»`);
  }
  if (n !== CACH_VIET.length) s.push(`so cach viet chay ${n} != ${CACH_VIET.length}`);
  return s;
};
// Ma trận viết trước bốn hàng — [tên, kịch bản, dựng thêm, tiền đề của hàng]; số assert = số hàng. Kho bật ở cả bốn.
const MA_TRAN_AC3 = [
  ['hang 1', 'gate2-4loai', kyBaoCao, t => (t.j.approvable === true && t.j.routing.hoi.includes(NHAN_KY) ? null : 'the da ky khong con la the ky duoc co o «ký hay trả»')],
  ['hang 2', 'gate2-may-di-tiep', null, t => (String(t.j.one_shot || '').includes('đi tiếp hay kéo lại: đi tiếp') ? null : 'kich ban khong phai may-di-truoc')],
  ['hang 3', 'gate2-4loai', ws => doiVerdict(ws, 'REJECT'), t => (t.j.approvable === false ? null : 'verdict REJECT ma the van ky duoc')],
  // Hồ sơ nghỉ chỉ KHÉP khi báo cáo đã có chữ ký (bộ quét gắn cờ «nghi-chua-ky» cho dòng nghỉ thiếu chữ ký) —
  // dựng như ma trận NL-AC4-khep của nlvh-the.test.mjs.
  ['hang 4', 'gate2-may-di-tiep', ws => { kyBaoCao(ws); ghiSo(ws, DONG_NGHI); }, t => (t.html.includes('Hồ sơ đã khép') ? null : 'the khong khep')],
];
CA['LG-AC3-khong-moi'] = gc => {
  const s = []; let n = 0;
  for (const [ten, kichBan, dung, tienDe] of MA_TRAN_AC3) {
    const ws = canh(kichBan);
    if (ten === 'hang 1') {
      // Hàng 1 phân biệt được: trước khi điền chữ ký, chính hồ sơ thử này ở kho bật CÓ ô gộp.
      datKhoa(ws, 'true'); const tr = the(ws, gc);
      if (!tr.raw.includes(O_GOP)) { s.push(`${ten}: tien de — truoc khi ky the khong in «${O_GOP}»`); n += 1; continue; }
    }
    if (dung) dung(ws);
    datKhoa(ws, 'true'); const t = the(ws, gc);
    datKhoa(ws, null); const t0 = the(ws, gc);
    n += 1;
    if (!songSot(t, s, `${ten}: `) || !songSot(t0, s, `${ten} (kho khong bat): `)) continue;
    const td = tienDe(t0); if (td) { s.push(`${ten}: tien de — ${td}`); continue; }
    if (t.html.includes(`${NHAN}: `)) s.push(`${ten}: HTML con «${NHAN}: »`);
    if (t.raw.includes(`${NHAN}: `)) s.push(`${ten}: extract con «${NHAN}: »`);
    if (t.j.routing.bao.includes(NHAN)) s.push(`${ten}: routing.bao con «${NHAN}»`);
    if (t.html !== t0.html) s.push(`${ten}: HTML khac ban kho khong bat`);
    if (t.raw !== t0.raw) s.push(`${ten}: extract khac ban kho khong bat`);
  }
  if (n !== MA_TRAN_AC3.length) s.push(`so hang chay ${n} != ${MA_TRAN_AC3.length}`);
  return s;
};

// Mười một dạng viết trước của danh sách đóng: sáu dạng lời gộp, năm dạng vế ký.
const DANG = [
  ['gộp: khi CI xanh', 'gộp'], ['gộp khi CI xanh', 'gộp'], ['gộp: khi xanh', 'gộp'], ['gộp khi xanh', 'gộp'],
  ['gộp: chưa', 'chưa-gộp'], ['chưa gộp', 'chưa-gộp'],
  ['Ký', 'chữ-ký'], ['Ký: <tên>', 'chữ-ký'], ['Ký: <tên> <ngày>', 'chữ-ký'], ['ký hay trả: Ký', 'chữ-ký'],
  ['Trả lại: <lý do>', 'trả-lại'],
];
const khoi = (txt, ten) => { const m = txt.match(new RegExp(`<!-- <<<${ten} -->\\n([\\s\\S]*?)\\n<!-- ${ten}>>> -->`)); return m ? m[1] : null; };
function kiemLuat(law, signoff) {
  const s = [];
  const slots = khoi(law, 'GATE-ONESHOT-SLOTS');
  if (slots == null) s.push('khoi GATE-ONESHOT-SLOTS rut rong');
  else if (!slots.split('\n').map(l => l.trim()).includes(`g2 ${NHAN}`)) s.push(`SLOTS thieu «g2 ${NHAN}»`);
  const gop = khoi(law, 'GATE-ONESHOT-GOP');
  if (gop == null) s.push('khoi GATE-ONESHOT-GOP rut rong');
  else {
    const hang = gop.split('\n').map(l => l.trim().match(/^(.+?) → (gộp|chưa-gộp|chữ-ký|trả-lại)$/)).filter(Boolean).map(m => [m[1], m[2]]);
    if (hang.length !== DANG.length) s.push(`GATE-ONESHOT-GOP co ${hang.length} dong dang-go (can dung ${DANG.length} — danh sach dong)`);
    let n = 0;
    for (const [dang, loiRa] of DANG) {
      n += 1;
      const khop = hang.filter(([d]) => d === dang);
      if (khop.length !== 1) s.push(`dang «${dang}»: ${khop.length} dong (can dung 1)`);
      else if (khop[0][1] !== loiRa) s.push(`dang «${dang}» → ${khop[0][1]} (can ${loiRa})`);
    }
    if (n !== DANG.length) s.push(`so assert ${n} != ${DANG.length}`);
    if (!/^có-lời-gộp = /m.test(gop)) s.push('GATE-ONESHOT-GOP thieu dong dinh nghia «có-lời-gộp = »');
  }
  if (!signoff.includes('GATE-ONESHOT-GOP')) s.push('signoff khong tro khoi «GATE-ONESHOT-GOP»');
  const khuon = khoi(signoff, 'LOI-GOP-GATE2-LINE');
  if (khuon == null) s.push('signoff: khoi LOI-GOP-GATE2-LINE rut rong');
  else if (!khuon.includes('"loi_gop":')) s.push('signoff: khuon LOI-GOP-GATE2-LINE thieu khoa «loi_gop»');
  return s;
}
CA['LG-AC4-luat'] = () => kiemLuat(readFileSync(LAW, 'utf8'), readFileSync(SIGNOFF, 'utf8'));
// Vòng khép thẻ↔SLOTS: chạy NGUYÊN VĂN bộ kiểm của P192 (rút từ heredoc P192JS trong
// tests/plugins/run-tests.sh — một nguồn) trên năm thẻ cây này dựng: bốn thẻ cũ + thẻ gate2-4loai của kho bật.
const THE_P192 = [['gate1-draft', '1', 'card-g1.html'], ['gate2-4loai', '2', 'card-g2.html'], ['gate2-may-di-tiep', '2', 'card-g2v.html'], ['gate2-luat', '2', 'card-g2l.html'], ['gate2-loi-gop', '2', 'card-g2g.html']];
function kiemP192(gc, lawPath) {
  const sh = readFileSync(path.join(KIT, 'tests', 'plugins', 'run-tests.sh'), 'utf8');
  const m = sh.match(/<<'P192JS'\n([\s\S]*?)\nP192JS\n/);
  if (!m) return ['khong rut duoc bo kiem P192 tu tests/plugins/run-tests.sh'];
  const d = mkdtempSync(path.join(TMP, 'p192-'));
  const chk = path.join(d, 'check-rt.js'); writeFileSync(chk, m[1]);
  const cacThe = THE_P192.map(([sc, g, f]) => {
    const h = spawnSync(process.execPath, [gc, '--root', canh(sc), '--slug', 'fx', '--gate', g], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const p = path.join(d, f); writeFileSync(p, h.stdout || ''); return p;
  });
  const r = spawnSync(process.execPath, [chk, lawPath, 'E9', ...cacThe], { encoding: 'utf8' });
  if (r.status !== 0 || !/ONESHOT-RT-NGUOC/.test(r.stdout)) return [`P192 do: ${(r.stderr || r.stdout).trim().split('\n')[0]}`];
  return [];
}
CA['LG-AC4-p192'] = gc => kiemP192(gc, LAW);

// ── chạy ────────────────────────────────────────────────────────────────────
for (const ten of ['LG-AC1-bat', 'LG-AC3-khong-moi', 'LG-AC4-luat', 'LG-AC4-p192']) {
  if (!want(ten)) continue;
  try { const s = CA[ten](GC); if (s.length) bad(ten, s.join(' ; ')); else ok(ten); } catch (e) { bad(ten, loi(e)); }
}

const khongChay = (CHON || []).filter(n => !daIn.has(n));
for (const n of khongChay) { fail += 1; console.log(`FAIL: ${n} — ca không chạy: ${n}`); }
console.log(`\nResults: ${pass} passed, ${fail} failed (lgck-the)`);
process.exit(fail ? 1 : 0);
