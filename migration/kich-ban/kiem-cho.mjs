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

function ac3(kk, cayMoi, bx) {
  const loi = [];
  const sp = kk.hang.filter(h => h.lop === 'san-pham' || h.lop === 'chua-ro');
  const bo = new Set((bx.bo || []).map(b => b.tep));
  const demDich = new Map();
  for (const h of sp) {
    if (bo.has(h.tep)) continue;
    const d = dichCua(h.tep, bx);
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
  const ket = [ac3(kk, cayMoi, bx), ac5(kho, dich, cayMoi, kk, bx)];
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
