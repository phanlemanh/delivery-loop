// Gộp dưới khoá merge (hồ sơ ky-den-gop, hạng I; spec hai tầng §4.4 bốn điều kiện chuyển từ lời sang mã).
// Quyết định chủ kho 23/10/2026, nguyên văn: «Chấp nhận rủi ro mục I: PR không trùng tệp với PR vừa gộp thì gộp ngay,
// không chạy lại CI; lỗi lọt qua thì CI trên nhánh chính bắt.»
//
// Bốn lối:
// · `moi-nhat`    — nhánh đã chứa đỉnh nhánh chính và CI xanh trên đúng đầu nhánh → gộp (luật cũ, không rủi ro mới);
// · `khong-trung` — nhánh chính đã tiến, nhưng tệp PR tự thêm (so với merge-base) không giao tệp của các commit vào
//                   nhánh chính kể từ merge-base → gộp ngay, không gộp nhánh chính vào nhánh, không chờ CI mới. Chỉ khi
//                   kho bật `gop_khong_chay_lai_ci` trong cấu hình đợt. Lưới: CI chạy trên nhánh chính sau gộp;
// · `cu`          — trùng tệp, hoặc khoá tắt, hoặc xung đột → như cũ: gộp nhánh chính vào nhánh, chờ CI, xét lại;
// · `cho-ci`      — CI trên đầu nhánh chưa xanh hay chưa xong.
// merge-base là base CI ĐÃ thấy hoặc cũ hơn (CI của PR chạy trên đầu nhánh hay trên bản gộp thử lúc đẩy, đều chứa
// merge-base), nên tập «tệp vào nhánh chính từ base» chỉ có thể rộng hơn cái CI chưa thấy — phép so dư về phía an toàn.
// Lệnh gộp luôn `--merge --match-head-commit <sha>`, KHÔNG `--auto`: đầu nhánh đổi sau lúc xét thì gh từ chối.
//
// Lối vào thứ hai của CHÍNH lệnh này — `gop <số PR> --theo-loi --slug <slug>` (hồ sơ loi-gop-trong-cau-ky): vòng chạy
// ngoài đợt, không khoá merge, không `tu_merge`; quyền gộp đến từ LỜI người đã gõ trong câu ký Cổng Bằng chứng, ghi
// thành một dòng sổ cùng commit với chữ ký. Lệnh vẫn qua `xetGop` rồi mới đọc sáu vế của lời ký trên ĐẦU NHÁNH của PR
// (`xetLoiKy`), và vẫn chỉ MỘT chỗ gọi `gh pr merge` (`bamGop`). Lệnh không cờ giữ nguyên hành vi trong đợt.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docJson, ghiSuKien, phienCuaCwd, timThuMucDot } from './dot.mjs';
import { docCauHinh, docHangViec } from './hinh-dang.mjs';
import { docPha } from './pha.mjs';
import { DA_THONG, trangThaiHopDong } from './phat-lich.mjs';
import { xetCuaProof } from './cua-proof.mjs';

export const GOP_DUOC = ['moi-nhat', 'khong-trung'];
const KET_LUAN_XANH = new Set(['SUCCESS', 'NEUTRAL', 'SKIPPED']);
const CI_DO = new Set(['failure', 'timed_out', 'cancelled', 'startup_failure', 'action_required']);
const dong = (s) => String(s ?? '').split('\n').map((x) => x.trim()).filter(Boolean);

// `statusCheckRollup` của gh: CheckRun {name, status, conclusion} và StatusContext {context, state}.
export function ciXanh(rollup) {
  if (!Array.isArray(rollup) || rollup.length === 0) return { xanh: false, ly_do: 'PR chưa có check nào trên đầu nhánh' };
  const chua = [];
  for (const c of rollup) {
    const ten = c.name ?? c.context ?? '?';
    if (c.state !== undefined) {
      if (c.state !== 'SUCCESS') chua.push(`${ten}: ${c.state}`);
    } else if (c.status !== 'COMPLETED') chua.push(`${ten}: ${c.status}`);
    else if (!KET_LUAN_XANH.has(c.conclusion)) chua.push(`${ten}: ${c.conclusion}`);
  }
  return chua.length ? { xanh: false, ly_do: `check chưa xanh — ${chua.join(', ')}` } : { xanh: true };
}

export function xetGop({ io, cfg, pr, slug }) {
  const git = (args) => io.chay('git', args);
  const v = JSON.parse(io.chay('gh', ['pr', 'view', String(pr), '--json', 'number,state,isDraft,mergeable,headRefOid,headRefName,baseRefName,statusCheckRollup']));
  if (v.state !== 'OPEN') return { duong: 'chan', ly_do: `PR #${pr} không mở (${v.state})` };
  if (v.isDraft) return { duong: 'chan', ly_do: `PR #${pr} còn nháp` };
  const sha = v.headRefOid;
  if (v.mergeable === 'CONFLICTING') return { duong: 'cu', sha, ly_do: 'PR xung đột với nhánh chính — gộp nhánh chính vào nhánh, gỡ xung đột' };
  const ci = ciXanh(v.statusCheckRollup);
  if (!ci.xanh) return { duong: 'cho-ci', sha, ly_do: ci.ly_do };
  git(['fetch', '-q', 'origin', v.baseRefName, v.headRefName]);
  let st = null;
  try {
    st = trangThaiHopDong(git(['show', `${sha}:_acceptance/${slug}/contract.md`]));
  } catch {
    st = null;
  }
  if (!DA_THONG.includes(st)) return { duong: 'chan', sha, ly_do: `hồ sơ ${slug} trên đầu PR ở «${st ?? 'không có'}» — chưa ký, chưa thông` };
  const dinh = git(['rev-parse', `origin/${v.baseRefName}`]).trim();
  const mb = git(['merge-base', sha, dinh]).trim();
  // Cửa proof (hồ sơ chuyen-gop): hồ sơ mang món mặc-ký chỉ tự gộp ở kho đã khai proof check — luật đọc ở nhánh chính.
  const cp = xetCuaProof({ io, sha, dinh, mb, slug, rollup: v.statusCheckRollup });
  if (!cp.qua) return { duong: 'chan', sha, ly_do: cp.ly_do };
  if (mb === dinh) return { duong: 'moi-nhat', sha, ly_do: 'nhánh đã chứa đỉnh nhánh chính; CI xanh trên đúng đầu nhánh' };
  const tien = Number(git(['rev-list', '--count', `${mb}..${dinh}`]).trim());
  if (cfg.gop_khong_chay_lai_ci !== true) return { duong: 'cu', sha, ly_do: `nhánh chính đã tiến ${tien} commit từ base của CI; khoá gop_khong_chay_lai_ci tắt — gộp nhánh chính vào nhánh, chờ CI` };
  const tepPr = dong(git(['diff', '--name-only', '--no-renames', mb, sha]));
  const tepChinh = new Set(dong(git(['diff', '--name-only', '--no-renames', mb, dinh])));
  const trung = tepPr.filter((t) => tepChinh.has(t));
  if (trung.length) return { duong: 'cu', sha, trung, ly_do: `trùng ${trung.length} tệp với ${tien} commit vào nhánh chính từ base của CI (${trung.slice(0, 5).join(', ')}) — gộp nhánh chính vào nhánh, chờ CI` };
  // Lưới của lối nhanh là CI nhánh chính — đọc nó, không dặn bằng lời (gap-probe P1): đỉnh đã đỏ thì không gộp nhanh
  // chồng lên, lỗi sẽ khó quy về một PR. Không đọc được → lối cũ.
  let ciChinh;
  try {
    ciChinh = JSON.parse(io.chay('gh', ['run', 'list', '--branch', v.baseRefName, '--commit', dinh, '--json', 'name,status,conclusion', '--limit', '50']));
  } catch {
    return { duong: 'cu', sha, ly_do: `không đọc được CI nhánh chính ở đỉnh ${dinh.slice(0, 7)} — gộp nhánh chính vào nhánh, chờ CI` };
  }
  const doChinh = ciChinh.filter((r) => r.status === 'completed' && CI_DO.has(r.conclusion)).map((r) => r.name);
  if (doChinh.length) return { duong: 'cu', sha, ly_do: `CI nhánh chính đỏ ở đỉnh ${dinh.slice(0, 7)} (${doChinh.join(', ')}) — không gộp nhanh chồng lên nhánh đỏ; gộp nhánh chính vào nhánh, chờ CI` };
  return { duong: 'khong-trung', sha, tep_pr: tepPr.length, tep_chinh: tepChinh.size, ly_do: `không tệp nào trùng (${tepPr.length} tệp của PR · ${tepChinh.size} tệp vào nhánh chính qua ${tien} commit) — gộp ngay, không chạy lại CI; lưới: CI trên nhánh chính sau gộp` };
}

// ── Lời gộp trong câu ký (hồ sơ loi-gop-trong-cau-ky) ───────────────────────────────────────────────────────────
// Danh sách ĐÓNG các dạng lời gộp người gõ, chữ thường. Bản gốc là khối luật «danh sách đóng lời gộp» trong bản luật
// ngôn ngữ mặt người của gói nghiệm thu; gói điều phối tự đứng được nên giữ bản chép này, ca GL-5a so nó với khối luật.
export const DANG_LOI_GOP = {
  gop: ['gộp: khi ci xanh', 'gộp khi ci xanh', 'gộp: khi xanh', 'gộp khi xanh'],
  chua: ['gộp: chưa', 'chưa gộp'],
};
const TIEN_TO_O_KY = /^ký hay trả\s*:\s*/;
const VE_KY = /^ký(\s*:.*)?(\s*,\s*phút\s*\d+)?$/;
const chuanVe = (s) => s.trim().replace(/\s+/g, ' ').toLowerCase();
function loiCuaVe(ve) {
  if (DANG_LOI_GOP.gop.includes(ve)) return 'gop';
  if (DANG_LOI_GOP.chua.includes(ve)) return 'chua-gop';
  const than = ve.replace(TIEN_TO_O_KY, '');
  if (than.startsWith('trả lại')) return 'tra-lai';
  if (VE_KY.test(than)) return 'chu-ky';
  return null;
}

// Đọc MỘT câu người gõ: chuẩn hoá NFC, tách vế bằng `;`, bỏ vế rỗng, không phân biệt hoa thường. Dạng ngoài danh sách
// không thuộc lối nào — máy không đoán. Có lời gộp ⇔ có vế gộp · không vế chưa-gộp · có vế ký · không vế trả lại.
export function docCau(cau) {
  const loi = String(cau ?? '').normalize('NFC').split(';').map(chuanVe).filter(Boolean).map(loiCuaVe);
  if (loi.includes('tra-lai')) return { co_loi_gop: false, ly_do: 'câu ghi là trả lại' };
  if (!loi.includes('chu-ky')) return { co_loi_gop: false, ly_do: 'câu ghi không mang chữ ký' };
  if (!loi.includes('gop') || loi.includes('chua-gop')) return { co_loi_gop: false, ly_do: 'câu ghi không mang lời gộp' };
  return { co_loi_gop: true, ly_do: null };
}

// Đọc sổ quyết định: dòng CUỐI có `stage: gate2` mang khoá `loi_gop`, và chỉ dòng ấy — sổ chỉ thêm nên dòng sau thay
// dòng trước; dòng cuối không đạt thì KHÔNG lùi về dòng cũ hơn. Dòng JSON hỏng bỏ qua. `co` là kết cục sau khi đọc lại
// CHÍNH câu ghi trong dòng (không tin ô `decision` của phiên đã ghi dòng).
export function docLoiGop(soText) {
  let cuoi = null;
  for (const d of String(soText ?? '').split(/\r?\n/)) {
    if (!d.trim()) continue;
    let o;
    try {
      o = JSON.parse(d);
    } catch {
      continue;
    }
    if (o !== null && typeof o === 'object' && o.stage === 'gate2' && Object.hasOwn(o, 'loi_gop')) cuoi = o;
  }
  if (!cuoi) return { co: false, ly_do: 'không có dòng lời gộp trong sổ', id: null, cau: null };
  const id = typeof cuoi.id === 'string' ? cuoi.id : null;
  const cau = cuoi.loi_gop?.cau;
  if (typeof cau !== 'string') return { co: false, ly_do: 'dòng lời gộp cuối không mang câu', id, cau: null };
  const kq = docCau(cau);
  return { co: kq.co_loi_gop, ly_do: kq.ly_do ?? 'câu ghi mang lời gộp', id, cau };
}

// Khoá kho `feature_loop.gop_theo_loi_ky`: đọc theo dòng (gói không nạp bộ đọc YAML). CHỈ `true` trần, hoặc `true` kèm
// chú thích đuôi, là bật; vắng, `false`, `"true"`, `True`, `yes`… là tắt — cùng phán quyết với bộ dựng thẻ. Khoá phải là
// con TRỰC TIẾP của `feature_loop`.
function khoaGopTheoLoi(text) {
  const dong = String(text ?? '').split(/\r?\n/);
  const i = dong.findIndex((d) => /^feature_loop:\s*(#.*)?$/.test(d));
  if (i < 0) return false;
  let thut = null;
  for (let j = i + 1; j < dong.length; j++) {
    const d = dong[j];
    if (!d.trim() || /^\s*#/.test(d)) continue;
    if (/^\S/.test(d)) break;
    const lui = d.length - d.trimStart().length;
    thut ??= lui;
    if (lui !== thut) continue;
    const m = /^\s+gop_theo_loi_ky:(.*)$/.exec(d);
    if (m) return /^\s+true(\s+#.*)?\s*$/.test(m[1]);
  }
  return false;
}

// Bộ đọc chữ ký của LÕI (hồ sơ va-chu-ky-giu-cho-lenh-gop): vế chữ ký của lối theo lời hỏi `chuKyThat` của
// acceptance-gate — một bảng giữ chỗ với lõi và lưới trước-gộp, không chép bảng sang gói này. Gốc lõi đến từ cờ `--loi`,
// dòng lệnh ở SKILL S5 và lệnh ký giải bằng `resolve-plugin.mjs` (ADR 0003); thiếu cờ thì CHỈ thử bố cục nguồn
// `plugins/acceptance-gate/` cạnh gói (kho tự host kit). Gói không tự dò bộ đệm cài, không sắp số bản. Gốc truyền vào vẫn
// được kiểm (có tệp, xuất `chuKyThat`); không có bộ đọc dùng được → lối theo lời CHẶN, không rơi về phép hỏi-có-chữ cũ.
const TEP_BO_DOC = path.join('lib', 'evidence-core.cjs');
const GOC_NGUON = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'acceptance-gate');
const LENH_GIAI = 'AG=$(node <feature-loop>/scripts/resolve-plugin.mjs --plugin acceptance-gate --require lib/evidence-core.cjs) rồi thêm --loi "$AG"';
export function napBoDocChuKy({ cwd = process.cwd(), loi = null } = {}) {
  const goc = loi === null ? GOC_NGUON : path.resolve(cwd, loi);
  const tep = path.join(goc, TEP_BO_DOC);
  let vi = null;
  let coTep = false;
  try {
    coTep = fs.statSync(tep).isFile();
    if (coTep) vi = createRequire(import.meta.url)(tep).chuKyThat;
  } catch {
    // tệp vắng hay nạp lỗi: chặn ở dưới, không nuốt thành «có chữ là ký»
  }
  if (typeof vi === 'function') return { chuKyThat: vi };
  const viTri = loi === null ? 'bố cục nguồn cạnh gói' : 'cờ --loi';
  const ly = coTep ? `${tep} (${viTri}) không xuất chuKyThat` : `${tep} (${viTri})`;
  return { loi: `không tìm thấy bộ đọc chữ ký của lõi — đã thử: ${ly} · giải gốc lõi: ${LENH_GIAI}` };
}

// Vế chữ ký trên báo cáo bằng chứng: `chuKyThat` của lõi quyết ký hay chưa (kể cả giá trị giữ chỗ); ký rồi thì trả
// NGUYÊN dòng `human_signoff` — nó là mũi tìm của `git log -S` ở vế «cùng commit». `giuCho` mang giá trị giữ chỗ để
// thông điệp chặn gọi tên nó.
function dongChuKy(text, chuKyThat) {
  const ck = chuKyThat(text ?? null);
  if (!ck.signed) return { dong: null, giuCho: ck.placeholder ? ck.value : null };
  const dong = String(text ?? '').split(/\r?\n/);
  const dau = dong.findIndex((d) => d.trim() !== '');
  if (dau < 0 || !/^---\s*$/.test(dong[dau])) return { dong: null, giuCho: null };
  for (let j = dau + 1; j < dong.length && !/^---\s*$/.test(dong[j]); j++) {
    const m = /^human_signoff[ \t]*[:=](.*)$/i.exec(dong[j]);
    if (!m) continue;
    const v = m[1].replace(/^\s*#.*$/, '').replace(/\s+#.*$/, '').trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1').trim();
    return { dong: v ? dong[j].trimEnd() : null, giuCho: null };
  }
  return { dong: null, giuCho: null };
}

// Sáu vế của lời ký, đọc TRÊN ĐẦU NHÁNH của PR (`git show <sha>:…`), không đọc cây làm việc. Thiếu vế nào thì trả tên
// vế ấy. Phần tử đầu của DA_THONG là trạng thái hồ sơ do NGƯỜI ký; hồ sơ máy đã thông không có câu người gõ nên không
// có lời gộp (ca GL-6b giữ cả hai chiều).
const DA_KY_NGUOI = DA_THONG[0];
export function xetLoiKy({ io, sha, slug, chuKyThat }) {
  const doc = (tep) => {
    try {
      return io.chay('git', ['show', `${sha}:${tep}`]);
    } catch {
      return null;
    }
  };
  const khong = (ly_do) => ({ duoc: false, ly_do });
  const hs = `_acceptance/${slug}`;
  if (!khoaGopTheoLoi(doc('_acceptance/config.yaml'))) return khong('kho chưa bật feature_loop.gop_theo_loi_ky trên đầu nhánh');
  const st = trangThaiHopDong(doc(`${hs}/contract.md`) ?? '');
  if (st !== DA_KY_NGUOI) return khong(`hồ sơ ${slug} trên đầu PR ở «${st ?? 'không có'}» — lời gộp chỉ có ở hồ sơ đã ký`);
  const ck = dongChuKy(doc(`${hs}/evidence-report.md`), chuKyThat);
  if (ck.giuCho) return khong(`báo cáo bằng chứng trên đầu PR không có chữ ký người — «${ck.giuCho}» là chữ ký giữ chỗ`);
  const chuKy = ck.dong;
  if (!chuKy) return khong('báo cáo bằng chứng trên đầu PR không có chữ ký người');
  const loi = docLoiGop(doc(`${hs}/decisions.jsonl`));
  if (!loi.co) return khong(loi.ly_do);
  // Dòng lời gộp phải SINH CÙNG COMMIT với chữ ký hiện hành: hồ sơ chấm lại rồi ký lại mà lần ký mới không ghi dòng
  // nào thì dòng của lần ký cũ hết hiệu lực. `git log -S` trả commit gần nhất đổi số lần chuỗi có mặt trong tệp.
  // Không lần được lịch sử (git lỗi) thì coi như không cùng commit — chiều an toàn.
  const sinh = (mui, tep) => {
    try {
      return io.chay('git', ['log', '-1', '--format=%H', `-S${mui}`, sha, '--', tep]).trim();
    } catch {
      return '';
    }
  };
  const cDong = loi.id ? sinh(`"${loi.id}"`, `${hs}/decisions.jsonl`) : '';
  const cKy = sinh(chuKy, `${hs}/evidence-report.md`);
  if (!cDong || cDong !== cKy) return khong('dòng lời gộp không sinh cùng commit với chữ ký hiện hành');
  return { duoc: true, ly_do: `lời gộp trong câu ký (dòng ${loi.id}, cùng commit chữ ký ${cKy.slice(0, 7)})` };
}

// Check ĐỎ HẲN trên đầu nhánh: `CheckRun` đã xong mà kết luận không thuộc xanh, `StatusContext` ở FAILURE/ERROR. Check
// còn chạy hay còn xếp hàng không tính — chờ thêm thì có thể xanh; đỏ hẳn thì chờ vô ích.
export function ciDo(rollup) {
  if (!Array.isArray(rollup)) return [];
  const doHan = [];
  for (const c of rollup) {
    const ten = c.name ?? c.context ?? '?';
    if (c.state !== undefined) {
      if (c.state === 'FAILURE' || c.state === 'ERROR') doHan.push(ten);
    } else if (c.status === 'COMPLETED' && !KET_LUAN_XANH.has(c.conclusion)) doHan.push(ten);
  }
  return doHan;
}

// Nhịp hỏi lại trạng thái check khi lệnh tự chờ CI: 30 giây, đổi bằng biến môi trường (ca rút ngắn).
const NHIP_CHO_MS = 30_000;
const nhipCho = () => {
  const n = Number(process.env.DIEU_PHOI_NHIP_CHO_MS);
  return Number.isFinite(n) && n > 0 ? n : NHIP_CHO_MS;
};
const nguDongBo = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

// Lối theo lời ký: bốn điều kiện của `xetGop` (không cấu hình đợt nên không có lối nhanh «không trùng tệp»), rồi sáu vế
// của lời ký trên đúng sha vừa xét. `gh`/`git` lỗi → ném một dòng.
// Chờ CI là việc của LỆNH (`choCi` phút, cờ `--cho-ci`): check còn chạy và còn giờ → ngủ một nhịp rồi hỏi lại — mỗi lượt
// lấy đầu nhánh MỚI, nên các vế và lệnh gộp theo đúng sha của lượt xanh; một check đỏ hẳn → chặn ngay, không hỏi lại;
// hết giờ → lối chờ CI (mã thoát 4). `xetGop` không trả bảng check, nên lệnh nghe lại chính câu trả lời `gh pr view`.
const dongDauLoi = (e) => String(e?.stderr ?? '').split('\n').map((x) => x.trim()).find(Boolean) ?? String(e?.message ?? e).split('\n')[0];
function xetTheoLoi({ io, pr, slug, choCi, ngu, chuKyThat }) {
  const han = Date.now() + choCi * 60_000;
  let xem = '';
  const ioNghe = {
    chay: (cmd, args) => {
      const ra = io.chay(cmd, args);
      if (cmd === 'gh' && args[0] === 'pr' && args[1] === 'view') xem = ra;
      return ra;
    },
  };
  for (;;) {
    let kq;
    let doHan = [];
    try {
      kq = xetGop({ io: ioNghe, cfg: {}, pr, slug });
      if (kq.duong === 'cho-ci') doHan = ciDo(JSON.parse(xem).statusCheckRollup);
    } catch (e) {
      throw new Error(`gop: không xét được PR #${pr} — ${dongDauLoi(e)}`);
    }
    if (kq.duong === 'cho-ci') {
      if (doHan.length) return { duong: 'chan', sha: kq.sha, ly_do: `CI đỏ trên đầu nhánh — ${doHan.join(', ')}` };
      if (!(choCi > 0)) return kq;
      if (Date.now() >= han) return { ...kq, ly_do: `hết ${choCi} phút chờ CI — ${kq.ly_do}` };
      ngu(nhipCho());
      continue;
    }
    if (!GOP_DUOC.includes(kq.duong)) return kq;
    const loi = xetLoiKy({ io, sha: kq.sha, slug, chuKyThat });
    return loi.duoc ? { ...kq, ly_do: `${kq.ly_do} · ${loi.ly_do}` } : { duong: 'chan', sha: kq.sha, ly_do: loi.ly_do };
  }
}

// Chỗ DUY NHẤT gọi `gh pr merge` — cả lệnh trong đợt lẫn lối theo lời ký đi qua đây.
function bamGop(io, pr, kq, xet) {
  const gopNgay = !xet && GOP_DUOC.includes(kq.duong);
  if (gopNgay) io.chay('gh', ['pr', 'merge', String(pr), '--merge', '--match-head-commit', kq.sha]);
  return gopNgay;
}

const IO_THAT = (cwd) => ({ chay: (cmd, args) => execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120_000 }) });

// Lệnh `gop <số PR>`: thợ giữ khoá merge, đợt cho tự gộp. `--xet` chỉ in quyết định (giám sát, người) — không gộp,
// không đòi khoá. Mỗi lần chạy ghi một sự kiện `gop` (lệnh đếm đọc).
// `theoLoi` (cờ `--theo-loi`): lối ngoài đợt theo lời gộp trong câu ký — không đòi đợt, khoá merge hay `tu_merge`, bắt
// buộc `slug`, không ghi sự kiện đợt. `choCi` (cờ `--cho-ci <phút>`): lệnh tự chờ CI; `ngu(ms)` thay được trong ca.
// `loi` (cờ `--loi <gốc acceptance-gate>`): gốc lõi cho vế chữ ký — nạp TRƯỚC mọi lời gọi `gh`, vắng bộ đọc thì chặn ngay.
export function gop(cwd, pr, { slug = null, xet = false, io = IO_THAT(cwd), theoLoi = false, choCi = 0, ngu = nguDongBo, loi = null } = {}) {
  if (!/^\d+$/.test(String(pr ?? ''))) throw new Error('gop: dùng `gop <số PR> [--slug <slug>] [--xet]`');
  if (theoLoi) {
    if (!slug) throw new Error('gop: --theo-loi đòi --slug <slug>');
    if (typeof choCi !== 'number' || !Number.isFinite(choCi) || choCi < 0) throw new Error('gop: --cho-ci <phút> phải là số không âm');
    if (loi !== null && (typeof loi !== 'string' || loi.trim() === '')) throw new Error('gop: --loi <gốc acceptance-gate> thiếu giá trị');
    const bd = napBoDocChuKy({ cwd, loi });
    if (bd.loi) return { duong: 'chan', sha: null, ly_do: bd.loi, da_gop: false, nha_merge: false };
    const kq = xetTheoLoi({ io, pr, slug, choCi, ngu, chuKyThat: bd.chuKyThat });
    return { ...kq, da_gop: bamGop(io, pr, kq, xet), nha_merge: false };
  }
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) throw new Error('gop: không có đợt nào đang chạy');
  const cfg = docCauHinh(thuMuc);
  const day = phienCuaCwd(docHangViec(thuMuc), cwd);
  const chu = docJson(path.join(thuMuc, 'khoa', 'merge', 'chu.json'), null);
  if (!xet) {
    if (!day) throw new Error('gop: cwd không thuộc dãy nào của đợt — chạy từ worktree của dãy, hoặc dùng --xet');
    if (chu?.phien !== day) throw new Error(`gop: khoá merge không do ${day} giữ (${chu?.phien ?? 'trống'}) — xin lượt merge trước`);
    if (docPha(thuMuc).tu_merge !== true) throw new Error('gop: đợt không cho tự gộp (tu_merge) — bấm gộp là của người; dùng --xet để xem quyết định');
  }
  const s = slug ?? (chu?.phien === day ? chu?.slug : null);
  if (!s) throw new Error('gop: không suy được slug hồ sơ — ghi --slug <slug>');
  const kq = xetGop({ io, cfg, pr, slug: s });
  const gopNgay = bamGop(io, pr, kq, xet);
  // Gộp xong thì khoá merge hết việc (#477 lỗi 3c): nhả ngay, không để treo tới hết hạn thuê. Chỉ nhả khoá của CHÍNH
  // dãy — lối không gộp đã đòi chu.phien === day ở trên.
  const nhaMerge = gopNgay && chu?.phien === day;
  if (nhaMerge) fs.rmSync(path.join(thuMuc, 'khoa', 'merge'), { recursive: true, force: true });
  ghiSuKien(thuMuc, { loai: 'gop', pr: Number(pr), hang: s, phien: day, duong: kq.duong, sha: kq.sha ?? null, da_gop: gopNgay, nha_merge: nhaMerge, ly_do: kq.ly_do, ...(kq.trung ? { trung: kq.trung.slice(0, 20) } : {}) });
  return { ...kq, da_gop: gopNgay, nha_merge: nhaMerge };
}

export const maThoatGop = (kq) => (GOP_DUOC.includes(kq.duong) ? 0 : kq.duong === 'chan' ? 1 : 4);
