// Cửa proof của luật tự trị (hồ sơ chuyen-gop; thí điểm «trợ lý quyết định», nguyên tắc kit-hoá 4): hồ sơ mang món
// mặc-ký — lựa chọn máy đi theo khuyến nghị mà chưa người nào ký — chỉ được tự gộp ở kho đã khai `proof.check` trong
// `governance/autonomy.yaml`, check ấy xanh trên đúng đầu nhánh, và PR ở tầng `low` của luật. Kho chưa khai thì mặc-ký
// DỪNG trước cửa gộp: không bao giờ tự gộp mà không có bằng chứng máy đứng thế chỗ người.
//
// Hồ sơ không mang món mặc-ký đi như trước vòng — cửa này không đọc gì, không đổi phán quyết nào.
// Luật tự trị đọc ở NHÁNH CHÍNH (bên gọi truyền văn bản): PR không mở được cửa cho chính nó bằng cách sửa luật.
// Khuôn tệp: khối «version / default / proof.check / low / high» của Repo Standards (tệp tự xưng «Autonomy policy»).
import { khop } from './glob.mjs';
import { DA_THONG } from './phat-lich.mjs';

const TANG = ['low', 'medium', 'high'];
const go = (s) => String(s ?? '').replace(/\s+#.*$/, '').trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');

// Đọc theo dòng (gói không nạp bộ đọc YAML): khoá cột 0 `default`, khối `proof:` với `check:` thụt một bậc, danh sách
// khối `low:` / `high:` mục `- "<glob>"`. Văn bản null → { co: false }.
export function docTuTri(text) {
  if (text == null) return { co: false, proof: '', default: 'medium', low: [], high: [], rules: {} };
  const out = { co: true, proof: '', default: 'medium', low: [], high: [], rules: {} };
  let khoi = null;
  for (const d of String(text).split(/\r?\n/)) {
    if (!d.trim() || /^\s*#/.test(d)) continue;
    const goc = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(d);
    if (goc) {
      khoi = goc[1];
      if (khoi === 'default' && TANG.includes(go(goc[2]))) out.default = go(goc[2]);
      continue;
    }
    if (khoi === 'proof') { const m = /^\s+check:\s*(.*)$/.exec(d); if (m) out.proof = go(m[1]); continue; }
    if (khoi === 'rules') { const m = /^\s{2}([a-z_]+_raise_to):\s*(.*)$/.exec(d); if (m && TANG.includes(go(m[2]))) out.rules[m[1]] = go(m[2]); continue; }
    if (khoi === 'low' || khoi === 'high') { const m = /^\s+-\s+(.*)$/.exec(d); if (m && go(m[1])) out[khoi].push(go(m[1])); }
  }
  return out;
}

// Tầng của MỘT PR = tầng cao nhất của mọi tệp nó đổi: tệp khớp `high` → high; khớp `low` → low; còn lại → `default`.
// Khối `rules` của khuôn nâng tầng theo điều máy ở đây không đọc được nghĩa — nghiêng về phía an toàn: PR XOÁ tệp nào thì
// lấy tầng của `test_deletions_raise_to`; PR chạm `ontology/` thì lấy tầng của `agent_guard_removals_raise_to`.
export function tangCuaTep(tuTri, tep, { xoa = [] } = {}) {
  let max = 0;
  const r = tuTri.rules ?? {};
  if (xoa.length && r.test_deletions_raise_to) max = Math.max(max, TANG.indexOf(r.test_deletions_raise_to));
  if (r.agent_guard_removals_raise_to && tep.some((t) => t.startsWith('ontology/'))) max = Math.max(max, TANG.indexOf(r.agent_guard_removals_raise_to));
  for (const t of tep) {
    const tang = tuTri.high.some((g) => khop(g, t)) ? 'high' : tuTri.low.some((g) => khop(g, t)) ? 'low' : tuTri.default;
    max = Math.max(max, TANG.indexOf(tang));
  }
  return TANG[max];
}

// Hồ sơ mang món mặc-ký: sổ có dòng máy `"may":"mac-ky"` đi theo khuyến nghị mà dòng S1 nó trỏ chưa bị một dòng người
// (`decided_by`) quyết lại; và hồ sơ chưa có chữ ký người ở Cổng Bằng chứng (DA_THONG[0] — người đã ký thì người đã thấy
// thẻ, mặc-ký không còn là quyết định chưa ai nhìn). Dòng JSON hỏng bỏ qua.
export function coMacKy({ status, so }) {
  if (status === DA_THONG[0]) return false;
  const dong = [];
  for (const d of String(so ?? '').split(/\r?\n/)) {
    if (!d.trim()) continue;
    try { const o = JSON.parse(d); if (o && typeof o === 'object') dong.push(o); } catch { /* bỏ qua */ }
  }
  const nguoiThay = new Set(dong.filter((o) => typeof o.supersedes === 'string' && typeof o.decided_by === 'string' && o.decided_by.trim()).map((o) => o.supersedes));
  return dong.some((o) => o.may === 'mac-ky' && o.di_theo === 'khuyen' && typeof o.ve === 'string' && !nguoiThay.has(o.ve));
}

const xanh = (c) => (c.state !== undefined ? c.state === 'SUCCESS' : c.status === 'COMPLETED' && c.conclusion === 'SUCCESS');
const DUNG = 'mặc-ký dừng trước cửa gộp: ';

export function cuaProof({ tuTri, rollup, tep, macKy, xoa = [] }) {
  if (!macKy) return { qua: true, ly_do: null };
  if (!tuTri.co) return { qua: false, ly_do: `${DUNG}kho chưa có governance/autonomy.yaml — không có bằng chứng máy đứng thế chỗ người` };
  if (!tuTri.proof) return { qua: false, ly_do: `${DUNG}luật tự trị chưa khai proof.check` };
  if (!(Array.isArray(rollup) && rollup.some((c) => (c.name ?? c.context) === tuTri.proof && xanh(c)))) return { qua: false, ly_do: `${DUNG}check proof «${tuTri.proof}» chưa xanh trên đầu nhánh` };
  const tang = tangCuaTep(tuTri, tep, { xoa });
  if (tang !== 'low') return { qua: false, ly_do: `${DUNG}PR ở tầng ${tang} của luật tự trị — chỉ tầng low tự gộp` };
  return { qua: true, ly_do: `mặc-ký qua cửa proof: «${tuTri.proof}» xanh, PR ở tầng low` };
}

// Đọc mọi thứ cửa cần từ git (đầu nhánh `sha`, nhánh chính `dinh`, merge-base `mb`) rồi hỏi cửa. `io.chay` như gop.mjs.
export function xetCuaProof({ io, sha, dinh, mb, slug, rollup }) {
  const show = (ref) => { try { return io.chay('git', ['show', ref]); } catch { return null; } };
  const ct = show(`${sha}:_acceptance/${slug}/contract.md`) ?? '';
  const status = (/^status:\s*(\S+)/m.exec(ct) || [])[1] ?? null;
  const macKy = coMacKy({ status, so: show(`${sha}:_acceptance/${slug}/decisions.jsonl`) });
  if (!macKy) return { qua: true, ly_do: null, mac_ky: false };
  const trangThai = String(io.chay('git', ['diff', '--name-status', '--no-renames', mb, sha])).split('\n').map((x) => x.trim()).filter(Boolean).map((x) => x.split('\t'));
  const tep = trangThai.map((x) => x[x.length - 1]); const xoa = trangThai.filter((x) => x[0] === 'D').map((x) => x[1]);
  return { ...cuaProof({ tuTri: docTuTri(show(`${dinh}:governance/autonomy.yaml`)), rollup, tep, xoa, macKy }), mac_ky: true };
}
