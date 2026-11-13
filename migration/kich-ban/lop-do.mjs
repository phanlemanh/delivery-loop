// lop-do.mjs — đối chiếu báo cáo lớp đỏ (ket-qua/lop-do.md) cho thuoc-that.mjs --lop-do (AC-10).
//
// kiemSoLieu(chữ báo cáo) — thuần: số học của báo cáo (đỏ thêm = đỏ mới − đỏ cả hai + mục bộ chạy; tổng các lớp = tổng
// đỏ thêm; bảng chữ khớp khối số liệu máy đọc). kiemLopDo — thêm phép dựng lại cây trên nguồn của báo cáo.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
export const TEP_BAO_CAO = path.join(DAY, 'ket-qua', 'lop-do.md');

export function kiemSoLieu(chu) {
  const loi = [];
  const fm = Object.fromEntries((chu.match(/^---\n([\s\S]*?)\n---/) || ['', ''])[1].split('\n').map(d => d.split(/:\s*/, 2)));
  const khoi = chu.match(/<!-- <<<LOP-DO-SO-LIEU -->\n```json\n([\s\S]*?)\n```\n<!-- LOP-DO-SO-LIEU>>> -->/);
  if (!khoi) return { loi: ['báo cáo thiếu khối số liệu máy đọc'], so: null, fm };
  const so = JSON.parse(khoi[1]);
  if (!/^[0-9a-f]{40}$/.test(fm.nguon || '') || !/^[0-9a-f]{40}$/.test(fm.cay_moi || '')) loi.push('frontmatter thiếu nguon hoặc cay_moi 40-hex');
  if (fm.nguon !== so.nguon || fm.cay_moi !== so.cay_moi) loi.push('frontmatter lệch khối số liệu');
  let tong = 0; const theoLop = {};
  for (const [bo, v] of Object.entries(so.bo)) {
    const ky = v.do_moi - v.do_ca_hai + (v.lop['bo-chay'] || 0);
    if (v.do_them !== ky) loi.push(`số học sai ở bộ ${bo}: đỏ thêm ${v.do_them} ≠ ${v.do_moi} − ${v.do_ca_hai}`);
    const tongLop = Object.values(v.lop).reduce((a, b) => a + b, 0);
    if (tongLop !== v.do_them) loi.push(`số học sai ở bộ ${bo}: tổng các lớp ${tongLop} ≠ đỏ thêm ${v.do_them}`);
    for (const [l, n] of Object.entries(v.lop)) theoLop[l] = (theoLop[l] || 0) + n;
    tong += v.do_them;
    const hang = chu.match(new RegExp(`^\\| ${bo} \\| [^|]* \\| [^|]* \\| (\\d+) \\| (\\d+) \\| (\\d+) \\| (\\d+) \\|`, 'm'));
    if (!hang || [v.do_cu, v.do_moi, v.do_ca_hai, v.do_them].join() !== hang.slice(1, 5).join()) loi.push(`bảng chữ lệch khối số liệu ở bộ ${bo}`);
  }
  if (tong !== so.tong_do_them || String(tong) !== fm.tong_do_them) loi.push(`tổng đỏ thêm lệch: ${tong} · khối ${so.tong_do_them} · frontmatter ${fm.tong_do_them}`);
  for (const [l, n] of Object.entries(so.lop)) if ((theoLop[l] || 0) !== n) loi.push(`số lớp ${l} lệch: ${n} ≠ ${theoLop[l] || 0}`);
  return { loi, so, fm };
}

export function kiemLopDo({ kho, S, ra, loi, donNha, nhanh, tep = TEP_BAO_CAO }) {
  if (!fs.existsSync(tep)) { loi.push(`chưa có báo cáo lớp đỏ: ${path.relative(kho, tep)}`); return; }
  const k = kiemSoLieu(fs.readFileSync(tep, 'utf8'));
  loi.push(...k.loi);
  if (!k.so) return;
  // Hợp đồng AC-10: mã cây của báo cáo phải bằng mã cây kịch bản dựng trên nguồn LÚC CHẤM.
  if (k.fm.nguon !== S) ra(`báo cáo đo trên ${k.fm.nguon}, kit-cu/main nay ${S}`);
  if (!donNha(nhanh, S)) return;
  const cay = execFileSync('git', ['-C', kho, 'rev-parse', `${nhanh}^{tree}`], { encoding: 'utf8' }).trim();
  if (cay !== k.fm.cay_moi) { loi.push('báo cáo lớp đỏ đo trên cây cũ'); return; }
  if (!k.loi.length) {
    ra(`AC-10 đạt: báo cáo đo trên nguồn ${k.fm.nguon.slice(0, 8)}, cây mới ${cay.slice(0, 8)} dựng lại khớp; tổng đỏ thêm ${k.so.tong_do_them}`);
    ra('theo lớp: ' + Object.entries(k.so.lop).map(([l, n]) => `${l} ${n}`).join(' · '));
  }
}
