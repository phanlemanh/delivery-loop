// lgck-the.test.mjs — hồ sơ loi-gop-trong-cau-ky: ở kho đã bật `feature_loop.gop_theo_loi_ky`, thẻ Cổng
// Bằng chứng của hồ sơ chờ chữ ký người in sẵn ô báo «gộp: khi CI xanh» ngay trước ô hỏi «ký hay trả»;
// kho không bật thì thẻ bằng từng byte bản trước vòng (AC-1…AC-4, AC-9).
// Hồ sơ thử do mã sinh: kịch bản bash của tests/plugins/fixtures/viec-cua-anh-scenarios.sh; dòng khoá
// của config.yaml hồ sơ thử do ca sửa trên chính tệp kịch bản ghi. Mỗi ca là hàm nhận đường gate-card.js
// (hoặc văn bản luật) và trả danh sách sai, nên cùng ca chạy trên cây thật (đối chứng dương) và trên bản
// sao đã tiêm MỘT nhát (chiều đỏ). Chiều im (LG-AC2-im) so hai bản `git archive` trọn plugins/acceptance-gate
// ở cặp commit ĐẦU/CUỐI của vòng (dấu slug trong thông điệp) — cố định trong lịch sử, không neo HEAD; khi
// hồ sơ của vòng chưa ký, ca còn đòi bản SAU bằng đúng cây đang kiểm. Mọi đường suy từ vị trí tệp này.
// Chọn ca: LGCK_CASES=<tên,…>; ca được gọi tên mà không in PASS/FAIL → «ca không chạy», thoát 1.
// Không gọi tên: chạy mọi ca TRỪ các ca quét trọn hồ sơ thật (LG-AC2-im và hai nhát của nó).
import { execFileSync, spawnSync, execFile } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, readdirSync, existsSync, cpSync, appendFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

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
const SLUG_VONG = 'loi-gop-trong-cau-ky';
const KHOA = 'gop_theo_loi_ky';
const NHAN = 'gộp';
const O_GOP = `${NHAN}: khi CI xanh`;
const NHAN_KY = 'ký hay trả';
const O_KY = `${NHAN_KY}: ___`;
const TMP = mkdtempSync(path.join(tmpdir(), 'lgck-'));
const runAsync = promisify(execFile);

let pass = 0; let fail = 0; const daIn = new Set();
const ok = (name, msg = '') => { pass += 1; daIn.add(name); console.log(`PASS: ${name} ${msg}`.trimEnd()); };
const bad = (name, msg) => { fail += 1; daIn.add(name); console.log(`FAIL: ${name} — ${msg}`); };
const CHON = process.env.LGCK_CASES ? process.env.LGCK_CASES.split(',').map(s => s.trim()).filter(Boolean) : null;
const CHI_KHI_GOI_TEN = new Set(['LG-AC2-im', 'LG-dot-bien-lech-khi-tat', 'LG-dot-bien-lech-qua-lib']);
const want = name => (CHON ? CHON.includes(name) : !CHI_KHI_GOI_TEN.has(name));
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const git = (...a) => execFileSync('git', ['-C', KIT, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

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

// ── chiều im (LG-AC2-im) ────────────────────────────────────────────────────
// Trạng thái «đã ký» của hồ sơ vòng: dựng bằng join để tệp ca không viết liền chuỗi trạng thái ký người.
const DA_KY = new Set([['signed', 'off'].join('-'), ['machine', 'cleared'].join('-'), ['da', 'cham', 'boi', 'thuc', 'te'].join('-')]);
function capCommit() {
  const shas = git('log', '--format=%H', '-F', `--grep=(${SLUG_VONG})`, '--', AG).split('\n').filter(Boolean);
  if (!shas.length) throw new Error(`khong tim duoc commit nao cham ${AG} mang dau «(${SLUG_VONG})» (ban sao nong?)`);
  const dau = shas[shas.length - 1]; const cuoi = shas[0];
  let truoc;
  try { truoc = git('rev-parse', '--verify', '--quiet', `${dau}^`); } catch (_) { throw new Error(`khong co cha cua commit DAU ${dau} trong lich su (ban sao nong?)`); }
  return { dau, cuoi, truoc };
}
// Bản base lấy TRỌN thư mục gói bằng `git archive` — không chép danh sách tệp tay.
function moBan(sha, ten) {
  const d = path.join(TMP, ten); mkdirSync(d, { recursive: true });
  const tar = execFileSync('git', ['-C', KIT, 'archive', sha, AG], { maxBuffer: 512 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  if (!existsSync(path.join(d, GC_REL))) throw new Error(`ban ${sha.slice(0, 8)} khong co ${GC_REL}`);
  return d;
}
async function theAsync(gc, root, slug, gate = []) {
  const a = ['--root', root, '--slug', slug, ...gate];
  const chay = async extra => { try { const r = await runAsync(process.execPath, [gc, ...a, ...extra], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); return { st: 0, out: r.stdout }; } catch (e) { return { st: e.code ?? 1, out: e.stdout || '', err: String(e.stderr || e.message).slice(0, 200) }; } };
  const [h, x] = await Promise.all([chay([]), chay(['--extract'])]);
  return { h, x };
}
const dungDuoc = t => t.h.st === 0 && t.x.st === 0;
async function pool(items, n, fn) { const out = new Array(items.length); let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } })); return out; }
const LUONG = 8;
// Kịch bản × ba dạng kho không bật (khoá vắng · `false` · giá trị lạ). Giá trị lạ là `"true"`: bộ đọc khoá của
// lib bóc nháy nên đây là cách viết dễ lọt nhất.
const KICH_BAN_IM = [['gate1-draft', '1'], ['gate2-4loai', '2'], ['gate2-may-di-tiep', '2'], ['gate2-pass-thuan-may', '2'], ['gate2-luat', '2']];
const DANG_TAT = [['vắng', null], ['false', 'false'], ['lạ', '"true"']];
// Thẻ kho BẬT khác bản trước ĐÚNG ở ô gộp: thêm ô vào câu gộp + nhãn vào routing.bao (extract), thêm ô ở dòng
// lệnh + một mục việc-của-anh (HTML). Gỡ đúng các chỗ ấy khỏi bản SAU phải ra bản TRƯỚC từng byte.
function chiKhacOGop(cu, moi) {
  let jc; try { jc = JSON.parse(cu.x.out); } catch (_) { return false; }
  if (!jc.routing || typeof jc.one_shot !== 'string' || !jc.one_shot.includes(O_KY)) return false;
  jc.one_shot = jc.one_shot.replace(O_KY, `${O_GOP}; ${O_KY}`);
  jc.routing.bao = [...jc.routing.bao, NHAN];
  if (JSON.stringify(jc, null, 2) !== moi.x.out) return false;
  const muc = moi.h.out.match(/<p class="li"><b>Gộp — [^<]*<\/b>[^<]*<\/p>/g) || [];
  if (muc.length !== 1 || moi.h.out.split(`${O_GOP}; ${O_KY}`).length !== 2) return false;
  return moi.h.out.replace(muc[0], '').replace(`${O_GOP}; ${O_KY}`, O_KY) === cu.h.out;
}
// Bản sao `_acceptance/` của kho (bỏ card.html), dòng khoá bị gỡ khỏi config.yaml — hồ sơ thật ở kho KHÔNG bật.
function saoHoSoThat() {
  const root = mkdtempSync(path.join(TMP, 'that-'));
  cpSync(path.join(KIT, '_acceptance'), path.join(root, '_acceptance'), { recursive: true, filter: src => path.basename(src) !== 'card.html' });
  const reKhoa = new RegExp(`^\\s*${KHOA}\\s*:`);
  const goc = readFileSync(cfgP(root), 'utf8');
  const nen = goc.split('\n').filter(l => !reKhoa.test(l)).join('\n');
  if (nen.split('\n').some(l => reKhoa.test(l))) throw new Error('ban sao config.yaml con dong khoa sau khi go');
  writeFileSync(cfgP(root), nen);
  return root;
}
async function kiemIm(banSauMutate) {
  const s = []; const { dau, cuoi, truoc: shaTruoc } = capCommit();
  // Bản SAU phải là cây đang kiểm khi hồ sơ của vòng chưa ký — không thì ca chấm một bản không phải vật được giao.
  const hd = path.join(KIT, '_acceptance', SLUG_VONG, 'contract.md');
  const st = existsSync(hd) ? ((readFileSync(hd, 'utf8').match(/^status:[ \t]*(\S+)/m) || [])[1] || '') : '';
  let veCay = `ho so vong o «${st || 'vắng'}» — khong doi ban SAU bang cay`;
  if (!DA_KY.has(st)) {
    const r = spawnSync('git', ['-C', KIT, 'diff', '--quiet', cuoi, '--', AG], { encoding: 'utf8' });
    if (r.status !== 0) s.push(`ban SAU khac cay dang kiem: \`git diff ${cuoi.slice(0, 8)} -- ${AG}\` thoat ${r.status} — commit het thay doi cua vong (thong diep mang dau «(${SLUG_VONG})») roi chay lai`);
    veCay = `ho so vong o «${st || 'vắng'}» — ban SAU bang cay dang kiem: ${r.status === 0 ? 'co' : 'KHONG'}`;
  }
  const rand = Math.random().toString(36).slice(2);
  const truoc = moBan(shaTruoc, `truoc-${rand}`); const sau = moBan(cuoi, `sau-${rand}`);
  if (banSauMutate) banSauMutate(sau);
  const gcT = path.join(truoc, GC_REL); const gcS = path.join(sau, GC_REL);
  // (a) kịch bản hồ sơ thử × ba dạng kho không bật: bằng nhau từng byte, và CẢ HAI bản phải dựng được thẻ.
  const viec = [];
  for (const [kb, gate] of KICH_BAN_IM) for (const [tenDang, gt] of DANG_TAT) { const ws = canh(kb); datKhoa(ws, gt); viec.push({ ten: `${kb} [khoá ${tenDang}]`, ws, gate }); }
  const kqA = await pool(viec, LUONG, async v => { const [cu, moi] = await Promise.all([theAsync(gcT, v.ws, 'fx', ['--gate', v.gate]), theAsync(gcS, v.ws, 'fx', ['--gate', v.gate])]); return { ...v, cu, moi }; });
  for (const { ten, cu, moi } of kqA) {
    if (!dungDuoc(cu) || !dungDuoc(moi)) { s.push(`${ten}: khong dung duoc the (ban TRUOC ${cu.h.st}/${cu.x.st}, ban SAU ${moi.h.st}/${moi.x.st}): ${cu.h.err || cu.x.err || moi.h.err || moi.x.err}`); continue; }
    if (cu.h.out !== moi.h.out || cu.x.out !== moi.x.out) s.push(`${ten}: the kho khong bat lech giua hai ban (html ${cu.h.out === moi.h.out ? 'bang' : 'LECH'}, extract ${cu.x.out === moi.x.out ? 'bang' : 'LECH'})`);
  }
  if (kqA.length !== KICH_BAN_IM.length * DANG_TAT.length) s.push(`so the kich ban da so ${kqA.length} != ${KICH_BAN_IM.length * DANG_TAT.length}`);
  // (a2) đối chứng đặc hiệu: kho BẬT thì hai bản phải KHÁC, và phần khác đúng là ô gộp.
  {
    const ws = canh('gate2-loi-gop');
    const [cu, moi] = await Promise.all([theAsync(gcT, ws, 'fx', ['--gate', '2']), theAsync(gcS, ws, 'fx', ['--gate', '2'])]);
    if (!dungDuoc(cu) || !dungDuoc(moi)) s.push('doi chung kho BAT: khong dung duoc the');
    else if (cu.h.out === moi.h.out || cu.x.out === moi.x.out) s.push('doi chung kho BAT: hai ban BANG nhau — phep so khong nhin thay thay doi cua vong');
    else if (!chiKhacOGop(cu, moi)) s.push('doi chung kho BAT: phan khac giua hai ban khong chi la o gop');
  }
  // (b) mọi hồ sơ thật của kho, trên bản sao có khoá bị gỡ.
  const root = saoHoSoThat(); const acc = path.join(root, '_acceptance');
  const slugs = readdirSync(acc, { withFileTypes: true }).filter(d => d.isDirectory() && existsSync(path.join(acc, d.name, 'contract.md'))).map(d => d.name).sort();
  if (!slugs.length) s.push('khong co ho so that nao de so');
  const kq = await pool(slugs, LUONG, async slug => { const [cu, moi] = await Promise.all([theAsync(gcT, root, slug), theAsync(gcS, root, slug)]); return { slug, cu, moi }; });
  const khongDung = []; let daSo = 0;
  for (const { slug, cu, moi } of kq) {
    if (!dungDuoc(moi)) { s.push(`${slug}: ban SAU khong dung duoc the: ${moi.h.err || moi.x.err}`); continue; }
    if (!dungDuoc(cu)) { khongDung.push(slug); continue; }
    daSo += 1;
    if (cu.h.out !== moi.h.out || cu.x.out !== moi.x.out) s.push(`${slug}: the ho so that lech giua hai ban`);
  }
  return { s, note: `(${kqA.length} the kich ban; ${daSo}/${slugs.length} ho so that da so tung byte; ban truoc khong dung duoc: ${khongDung.length ? khongDung.join(', ') : 'khong'}; cap TRUOC ${shaTruoc} (cha cua DAU ${dau}) .. SAU ${cuoi}; ${veCay})` };
}
let _imThat = null;
const imThat = () => (_imThat || (_imThat = kiemIm(null)));

// ── nhát tiêm ───────────────────────────────────────────────────────────────
// Bản sao trọn bốn thư mục của gói; mũi tiêm khớp ĐÚNG một lần, không thì ném.
function banSao() {
  const d = mkdtempSync(path.join(TMP, 'may-'));
  for (const x of ['scripts', 'lib', 'skills', 'commands']) cpSync(path.join(KIT, AG, x), path.join(d, AG, x), { recursive: true });
  return d;
}
function tiemChu(src, kim, thay, noi) {
  const n = src.split(kim).length - 1;
  if (n !== 1) throw new Error(`mui tiem truot: kim khop ${n} lan trong ${noi} (can dung 1): ${kim}`);
  return src.replace(kim, () => thay);
}
const tiem = (tep, kim, thay) => writeFileSync(tep, tiemChu(readFileSync(tep, 'utf8'), kim, thay, path.basename(tep)));
// Đối chứng dương: ca đích phải XANH trên cây thật trước khi tin bản đã tiêm là ĐỎ. Nhớ kết quả theo ca.
const _that = new Map();
const tren = ten => { if (!_that.has(ten)) _that.set(ten, CA[ten](GC)); return _that.get(ten); };
function doiChungDuong(cacCa) {
  for (const ca of cacCa) { const s = tren(ca); if (s.length) throw new Error(`doi chung duong: ${ca} DO tren cay that — ${s.join(' ; ')}`); }
}
// [tên, kim, thay, ca phải đỏ, cụm ghim]
const DOT_BIEN_THE = [
  ['in-khi-tat', 'const GOP_THEO_LOI = KHO_BAT_GOP && approvable', 'const GOP_THEO_LOI = approvable', ['LG-AC1-bat'], 'tien de'],
  ['ve-o-hoi', 'routingBao.push(NHAN_GOP); }', 'routingHoi.push(NHAN_GOP); }', ['LG-AC1-bat'], 'routing.hoi'],
  ['da-ky', ' && !evidenceCore.chuKyThat(report).signed;', ';', ['LG-AC3-khong-moi'], 'hang 1'],
  ['dien-chu-ky', "oneParts.push('ký hay trả: ___');", "oneParts.push('ký hay trả: Ký');", ['LG-AC1-bat'], 'ky hay tra khong con ___'],
];
const DOT_BIEN_LUAT = [
  ['luat-sai-loi', 'gộp: chưa → chưa-gộp', 'gộp: chưa → gộp', 'dang «gộp: chưa»'],
  ['luat-go-marker', '<!-- <<<GATE-ONESHOT-GOP -->', '<!-- GO-MARKER -->', 'GATE-ONESHOT-GOP rut rong'],
];
// Nhát trên bản SAU của phép so kho-không-bật: [tên, tệp trong gói, kim, thay, cụm ghim].
const DOT_BIEN_IM = [
  ['lech-khi-tat', path.join('scripts', 'gate-card.js'), '<button class="b yes">Ký duyệt</button>', '<button class="b yes">Ký</button>', 'gate2-4loai'],
  ['lech-qua-lib', path.join('lib', 'out-of-contract.cjs'), "'known-limits': 'ghi Known limits',", "'known-limits': 'ghi vào Known limits',", 'gate2-4loai'],
];

// ── chạy ────────────────────────────────────────────────────────────────────
for (const ten of ['LG-AC1-bat', 'LG-AC3-khong-moi', 'LG-AC4-luat', 'LG-AC4-p192']) {
  if (!want(ten)) continue;
  try { const s = tren(ten); if (s.length) bad(ten, s.join(' ; ')); else ok(ten); } catch (e) { bad(ten, loi(e)); }
}
for (const [ten, kim, thay, cacCa, cum] of DOT_BIEN_THE) {
  const name = `LG-dot-bien-${ten}`; if (!want(name)) continue;
  try {
    doiChungDuong(cacCa);
    const d = banSao(); tiem(path.join(d, GC_REL), kim, thay);
    const sai = [];
    for (const ca of cacCa) {
      const s = CA[ca](path.join(d, GC_REL));
      if (!s.length) sai.push(`${ca} van XANH tren ban sao da tiem — phep do mu`);
      else if (!s.some(x => x.includes(cum))) sai.push(`${ca} do nhung sai thong diep (can «${cum}»): ${s.join(' ; ')}`);
    }
    if (sai.length) bad(name, sai.join(' ; ')); else ok(name, `— ${cacCa.join(', ')} xanh tren cay that, do dung «${cum}» tren ban sao da tiem`);
  } catch (e) { bad(name, loi(e)); }
}
if (want('LG-im-chu-thich')) {
  // Chiều im: chạm thứ KHÔNG phải vật (một dòng chú thích trong gate-card.js) → hai ca thẻ vẫn xanh.
  const name = 'LG-im-chu-thich'; const cacCa = ['LG-AC1-bat', 'LG-AC3-khong-moi'];
  try {
    doiChungDuong(cacCa);
    const d = banSao(); const tep = path.join(d, GC_REL);
    tiem(tep, 'const NHAN_GOP = ', '// chú thích thêm ở bản sao — không phải vật\nconst NHAN_GOP = ');
    if (readFileSync(tep, 'utf8') === readFileSync(GC, 'utf8')) throw new Error('mui tiem truot: ban sao khong doi');
    const sai = [];
    for (const ca of cacCa) { const s = CA[ca](tep); if (s.length) sai.push(`${ca} DO tren ban sao chi them chu thich: ${s.join(' ; ')}`); }
    if (sai.length) bad(name, sai.join(' ; ')); else ok(name, `— ${cacCa.join(', ')} van xanh tren ban sao them mot dong chu thich`);
  } catch (e) { bad(name, loi(e)); }
}
for (const [ten, kim, thay, cum] of DOT_BIEN_LUAT) {
  const name = `LG-dot-bien-${ten}`; if (!want(name)) continue;
  try {
    doiChungDuong(['LG-AC4-luat']);
    const s = kiemLuat(tiemChu(readFileSync(LAW, 'utf8'), kim, thay, 'ban luat'), readFileSync(SIGNOFF, 'utf8'));
    if (!s.length) bad(name, 'LG-AC4-luat van XANH tren ban sao luat da tiem — phep do mu');
    else if (!s.some(x => x.includes(cum))) bad(name, `LG-AC4-luat do nhung sai thong diep (can «${cum}»): ${s.join(' ; ')}`);
    else ok(name, `— LG-AC4-luat xanh tren cay that, do dung «${cum}» tren ban sao luat da tiem`);
  } catch (e) { bad(name, loi(e)); }
}
if (want('LG-dot-bien-slots-go')) {
  // Bản sao luật gỡ dòng «g2 gộp»: thẻ kho bật in nhãn mà ngữ pháp không khai → P192 đỏ gọi tên.
  const name = 'LG-dot-bien-slots-go'; const cum = `nhan khong khop SLOTS: ${NHAN}`;
  try {
    doiChungDuong(['LG-AC4-p192']);
    const p = path.join(mkdtempSync(path.join(TMP, 'luat-')), 'human-facing-language.md');
    writeFileSync(p, tiemChu(readFileSync(LAW, 'utf8'), `g2 ${NHAN}\n`, '', 'ban luat'));
    const s = kiemP192(GC, p);
    if (!s.length) bad(name, 'LG-AC4-p192 van XANH tren ban sao luat da tiem — phep do mu');
    else if (!s.some(x => x.includes(cum))) bad(name, `LG-AC4-p192 do nhung sai thong diep (can «${cum}»): ${s.join(' ; ')}`);
    else ok(name, `— LG-AC4-p192 xanh tren cay that, do dung «${cum}» tren ban sao luat da tiem`);
  } catch (e) { bad(name, loi(e)); }
}
if (want('LG-AC2-im')) {
  try { const { s, note } = await imThat(); if (s.length) bad('LG-AC2-im', `${s.join(' ; ')} ${note}`); else ok('LG-AC2-im', note); } catch (e) { bad('LG-AC2-im', loi(e)); }
}
for (const [ten, tepGoi, kim, thay, cum] of DOT_BIEN_IM) {
  const name = `LG-dot-bien-${ten}`; if (!want(name)) continue;
  try {
    const that = await imThat();
    if (that.s.length) throw new Error(`doi chung duong: LG-AC2-im DO tren hai ban chua tiem — ${that.s.slice(0, 3).join(' ; ')}`);
    const { s } = await kiemIm(sau => tiem(path.join(sau, AG, tepGoi), kim, thay));
    if (!s.length) bad(name, `LG-AC2-im van XANH khi ban SAU bi sua ${tepGoi} — phep do mu`);
    else if (!s.some(x => x.includes(cum))) bad(name, `LG-AC2-im do nhung khong goi ten «${cum}»: ${s.slice(0, 3).join(' ; ')}`);
    else ok(name, `— LG-AC2-im xanh tren hai ban chua tiem, do dung «${cum}» khi ban SAU bi sua ${tepGoi} (${s.length} the lech)`);
  } catch (e) { bad(name, loi(e)); }
}

const khongChay = (CHON || []).filter(n => !daIn.has(n));
for (const n of khongChay) { fail += 1; console.log(`FAIL: ${n} — ca không chạy: ${n}`); }
console.log(`\nResults: ${pass} passed, ${fail} failed (lgck-the)`);
process.exit(fail ? 1 : 0);
