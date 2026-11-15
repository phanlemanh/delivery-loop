#!/usr/bin/env node
// bao-cao-giu-khoa.mjs — báo cáo «giữ đủ khoá ca» trên nguồn thật (B2 AC-4) và hàm kiểm của nó.
//
// ghiBaoCao: đọc thư mục đo <T>/out/{A,B} (chay-bo-kiem.sh), ghi vào <ra>/giu-khoa/ hai túi khoá ĐẠT (tui-cu.tsv đã đổi
// qua bảng tên + bảng xếp, tui-moi.tsv), mã thoát từng bước của hai cây (buoc.tsv), các bộ không đo được (khong-do.txt),
// băm tệp thô (bam-tho.txt); rồi ghi NGUYÊN TỬ <ra>/giu-khoa.md (frontmatter nguon · cay_moi · phan_quyet · tong · bo ·
// thieu, bảng bước, danh sách bỏ nguyên văn, danh sách thiếu).
// kiemGiuKhoa: thước của thuoc-that.mjs --giu-khoa — CHẠY LẠI phép so trên hai túi đã commit và đếm lại n (không đọc số từ
// báo cáo), đối chiếu báo cáo, đòi mọi bước thoát 0 ở cả hai cây, danh sách bỏ rỗng, và mã cây trong báo cáo = mã cây kịch
// bản dựng trên nguồn lúc chấm.
//
// Dòng lệnh: node bao-cao-giu-khoa.mjs --do <T> --nguon <40-hex> --cay <40-hex> --ra <thư mục ket-qua>

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { docKetQua, doiKhoa, tuiCu, soTui, docTui, ghiTui, docBo, docMaSo } from './giu-khoa.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DAY, '..', '..');
export const BO_KHOA = path.join(DAY, 'bo-khoa.tsv');
export const SO_HO_SO = path.join(ROOT, '_acceptance', 'bo-kiem-xanh-o-kho-moi', 'decisions.jsonl');

const tong = (t) => [...t.values()].reduce((a, b) => a + b, 0);
const phanQuyet = (khongDo, kq) => (khongDo.length ? 'khong-do' : kq.loi.length || kq.thieu.length ? 'thieu' : 'giu-du');
const ghiNguyenTu = (p, s) => { const t = `${p}.tam-${process.pid}`; fs.writeFileSync(t, s); fs.renameSync(t, p); };

export function ghiBaoCao({ T, nguon, cay, ra, bo = BO_KHOA, so = SO_HO_SO }) {
  const doi = doiKhoa(JSON.parse(fs.readFileSync(path.join(DAY, '..', 'chay-thu-phien', 'bang-ten.json'), 'utf8')), JSON.parse(fs.readFileSync(path.join(DAY, 'bang-xep.json'), 'utf8')));
  const A = docKetQua(path.join(T, 'out', 'A')); const B = docKetQua(path.join(T, 'out', 'B'));
  const cu = tuiCu(A.dat, B.dat, doi);
  const khongDo = [...A.khongDo.map(x => `cây cũ — ${x}`), ...B.khongDo];
  const boDs = docBo(bo);
  const kq = soTui(cu, B.dat, boDs, docMaSo(so));
  const g = path.join(ra, 'giu-khoa');
  fs.mkdirSync(g, { recursive: true });
  ghiTui(path.join(g, 'tui-cu.tsv'), cu); ghiTui(path.join(g, 'tui-moi.tsv'), B.dat);
  const buoc = [...new Set([...Object.keys(A.bo), ...Object.keys(B.bo)])].map(ten => [ten, (A.bo[ten] || B.bo[ten]).loai, A.bo[ten]?.rc ?? 'vắng', B.bo[ten]?.rc ?? 'vắng']);
  fs.writeFileSync(path.join(g, 'buoc.tsv'), buoc.map(r => r.join('\t')).join('\n') + '\n');
  fs.writeFileSync(path.join(g, 'khong-do.txt'), khongDo.map(x => x + '\n').join(''));
  const bam = (ds, goc) => ds.map(f => `${crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')}  ${path.relative(goc, f)}`);
  fs.writeFileSync(path.join(g, 'bam-tho.txt'), ['# cây cũ', ...bam(A.tep, path.join(T, 'out', 'A')), '# cây mới', ...bam(B.tep, path.join(T, 'out', 'B'))].join('\n') + '\n');
  const pq = phanQuyet(khongDo, kq);
  const chu = ['---', `nguon: ${nguon}`, `cay_moi: ${cay}`, `phan_quyet: ${pq}`, `tong: ${tong(cu)}`, `bo: ${boDs.length}`, `thieu: ${kq.thieu.length}`, '---', '',
    '# Giữ đủ khoá ca — cây cũ so cây mới (B2 AC-4)', '',
    'Máy sinh bởi `migration/kich-ban/do-lop-do.sh` → `bao-cao-giu-khoa.mjs` — đừng sửa tay; thước `thuoc-that.mjs --giu-khoa` chạy',
    'lại phép so trên hai túi khoá ở `giu-khoa/` và đối chiếu từng số với tệp này.', '',
    '## Các bước kiểm (việc `tests` của gate.yml mỗi cây)', '', '| Bước | Loại | Mã thoát cây cũ | Mã thoát cây mới |', '|---|---|---|---|',
    ...buoc.map(([t, l, a, b]) => `| ${t} | ${l} | ${a} | ${b} |`), '',
    `## Phán quyết: ${pq === 'giu-du' ? `giữ đủ ${tong(cu)}/${tong(cu)} khoá, bỏ ${boDs.length}` : pq === 'thieu' ? `thiếu ${kq.thieu.length} khoá` : 'không đo được'}`, '',
    '## Danh sách bỏ (bo-khoa.tsv, nguyên văn)', '', ...(boDs.length ? boDs.map(b => `- \`${b.khoa}\` — ${b.ma || '(không mã)'} — ${b.lyDo || ''}`) : ['rỗng']), '',
    ...(khongDo.length ? ['## Bộ không đo được', '', ...khongDo.map(x => `- ${x}`), ''] : []),
    ...(kq.loi.length ? ['## Lỗi danh sách bỏ', '', ...kq.loi.map(x => `- ${x}`), ''] : []),
    `## Khoá thiếu (${kq.thieu.length})`, '', ...(kq.thieu.length ? kq.thieu.map(k => `- \`${k.replace(/`/g, 'ʼ')}\``) : ['không có']), '',
    `## Khoá thừa ở cây mới: ${kq.thua.length}`, ''].join('\n');
  ghiNguyenTu(path.join(ra, 'giu-khoa.md'), chu);
  return { phanQuyet: pq, tong: tong(cu), thieu: kq.thieu.length };
}

export function kiemGiuKhoa({ ra, nguon, cayDung, loi, ra_, bo = BO_KHOA, so = SO_HO_SO }) {
  const p = path.join(ra, 'giu-khoa.md');
  if (!fs.existsSync(p)) { loi.push(`chưa có báo cáo giữ khoá: ${p}`); return; }
  const fm = Object.fromEntries((fs.readFileSync(p, 'utf8').match(/^---\n([\s\S]*?)\n---/) || ['', ''])[1].split('\n').map(d => d.split(/:\s*/, 2)));
  const g = path.join(ra, 'giu-khoa');
  const cu = docTui(path.join(g, 'tui-cu.tsv')); const moi = docTui(path.join(g, 'tui-moi.tsv'));
  const khongDo = fs.readFileSync(path.join(g, 'khong-do.txt'), 'utf8').split('\n').filter(Boolean);
  const boDs = docBo(bo);
  const kq = soTui(cu, moi, boDs, docMaSo(so));
  const pq = phanQuyet(khongDo, kq); const n = tong(cu);
  const truoc = loi.length;
  if (fm.phan_quyet !== pq || Number(fm.tong) !== n || Number(fm.thieu) !== kq.thieu.length) loi.push('báo cáo giữ khoá lệch túi khoá đã commit');
  if (kq.thieu.length) loi.push(`thiếu ${kq.thieu.length} khoá — đầu: ${kq.thieu.slice(0, 5).join(' · ')}`);
  for (const x of khongDo) loi.push(`bộ không đo được: ${x}`);
  for (const x of kq.loi) loi.push(x);
  if (boDs.length) loi.push('bỏ khoá chưa duyệt');
  if (fm.nguon !== nguon) ra_(`báo cáo đo trên ${fm.nguon}, kit-cu/main nay ${nguon}`);
  if (fm.cay_moi !== cayDung) loi.push('báo cáo giữ khoá đo trên cây cũ');
  const buoc = fs.readFileSync(path.join(g, 'buoc.tsv'), 'utf8').split('\n').filter(Boolean).map(d => d.split('\t'));
  for (const [t, , a, b] of buoc) { if (a !== '0') loi.push(`bước ${t} thoát ${a} ở cây cũ`); if (b !== '0') loi.push(`bước ${t} thoát ${b} ở cây mới`); }
  if (loi.length === truoc) ra_(`AC-4 đạt: báo cáo đo trên nguồn ${nguon.slice(0, 8)}, cây mới ${cayDung.slice(0, 8)} dựng lại khớp; ${buoc.length} bước thoát 0 ở cả hai cây; giữ đủ ${n}/${n} khoá, bỏ ${boDs.length}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2); const lay = (c) => { const i = a.indexOf(c); return i < 0 ? undefined : a[i + 1]; };
  const T = lay('--do'), nguon = lay('--nguon'), cay = lay('--cay'), ra = lay('--ra');
  if (!T || !nguon || !cay || !ra) { process.stderr.write('dùng: node bao-cao-giu-khoa.mjs --do <T> --nguon <sha> --cay <sha> --ra <thư mục>\n'); process.exit(2); }
  const k = ghiBaoCao({ T, nguon, cay, ra });
  process.stdout.write(`bao-cao-giu-khoa: ${k.phanQuyet} — ${k.tong} khoá cây cũ, thiếu ${k.thieu}\n`);
}
