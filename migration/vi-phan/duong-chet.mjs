#!/usr/bin/env node
// duong-chet.mjs — quét «đường chết sau dọn nhà» trong các tệp cấu hình ở gốc kho kit (B3).
//
// Lý do có phép này (đo 17/11): `_acceptance/config.yaml` của cây mới còn `t3_paths: "hooks/**"`, `"lib/**"` — ở bố cục cũ
// khớp lõi cưỡng chế, ở bố cục mới không khớp tệp nào, nên một PR chạm plugins/acceptance-gate/lib/ tụt từ T3 xuống T2.
// Bộ kiểm sáu bước vẫn xanh và túi khoá vẫn đủ: không ca nào ghim nội dung danh sách ấy trên chính kho kit.
//
// Phép đo: với mỗi tệp cấu hình ở gốc của CÂY MỚI, rút mọi chuỗi trông như đường hay glob; đếm số tệp nó khớp ở cây cũ
// và ở cây mới. Chuỗi khớp ≥ 1 tệp ở cây cũ mà 0 tệp ở cây mới = đường chết do dọn nhà. Chuỗi 0 ở cả hai cây không tính
// (đường của kho tiêu thụ, ví dụ, mẫu).
//
//   node duong-chet.mjs --kho <git> --cu <ref> --moi <ref> [--tep <đường>]…     (mặc định: bốn nhóm tệp dưới)
// Thoát: 0 không đường chết · 1 có (mỗi dòng: tệp:dòng · chuỗi · số khớp cũ) · 2 không đọc được ở đây (0 chuỗi rút được).

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const git = (kho, a) => execFileSync('git', ['-C', kho, ...a], { encoding: 'utf8', maxBuffer: 1 << 30 });
export const TEP_MAC_DINH = ['_acceptance/config.yaml', '.github/workflows/', '.gitattributes', '.claude/settings.json', 'Makefile', '.repo-setup.json'];

// Chuỗi trông như đường: có ít nhất một `/`, không phải URL, không bắt đầu bằng biến.
const RE = /(?<![\w$@{}.:/-])((?:\.\/)?[A-Za-z_.][\w.*@-]*(?:\/[\w.*@{},-]+)+\/?)(?![\w/-])/g;

export function globThanhRe(g) {
  let s = g.replace(/^\.\//, '').replace(/\/$/, '');
  s = s.replace(/[.+^$()|[\]\\]/g, '\\$&').replace(/\{([^}]*)\}/g, (m, a) => `(?:${a.split(',').join('|')})`);
  s = s.replace(/\*\*\/?/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*');
  return new RegExp(`^${s}(?:/|$)`);
}

export function rut(chu) {
  const ra = [];
  chu.split('\n').forEach((d, i) => {
    if (/https?:\/\//.test(d)) d = d.replace(/https?:\/\/\S+/g, ' ');
    for (const m of d.matchAll(RE)) ra.push({ dong: i + 1, chuoi: m[1] });
  });
  return ra;
}

export function quet({ kho, cu, moi, tep = TEP_MAC_DINH }) {
  const ds = (ref) => git(kho, ['ls-tree', '-r', '--name-only', '-z', ref]).split('\0').filter(Boolean);
  const cayCu = ds(cu), cayMoi = ds(moi);
  const dem = (cay, re) => { let n = 0; for (const t of cay) if (re.test(t)) n++; return n; };
  const tepXet = cayMoi.filter(t => tep.some(g => (g.endsWith('/') ? t.startsWith(g) : t === g)));
  const chet = []; let tong = 0;
  const nho = new Map();
  for (const t of tepXet) {
    for (const { dong, chuoi } of rut(git(kho, ['show', `${moi}:${t}`]))) {
      tong++;
      if (!nho.has(chuoi)) { const re = globThanhRe(chuoi); nho.set(chuoi, [dem(cayCu, re), dem(cayMoi, re)]); }
      const [nc, nm] = nho.get(chuoi);
      if (nc > 0 && nm === 0) chet.push({ tep: t, dong, chuoi, cu: nc });
    }
  }
  return { tepXet, tong, chet };
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  const a = { tep: [] };
  const v = process.argv.slice(2);
  for (let i = 0; i < v.length; i += 2) {
    if (v[i] === '--tep') a.tep.push(v[i + 1]); else if (['--kho', '--cu', '--moi'].includes(v[i]) && v[i + 1]) a[v[i].slice(2)] = v[i + 1];
    else { process.stderr.write('dùng: node duong-chet.mjs --kho <git> --cu <ref> --moi <ref> [--tep <đường>]…\n'); process.exit(2); }
  }
  if (!a.kho || !a.cu || !a.moi) { process.stderr.write('dùng: node duong-chet.mjs --kho <git> --cu <ref> --moi <ref> [--tep <đường>]…\n'); process.exit(2); }
  const k = quet({ kho: a.kho, cu: a.cu, moi: a.moi, tep: a.tep.length ? a.tep : TEP_MAC_DINH });
  if (!k.tong) { process.stdout.write(`không đọc được ở đây: 0 chuỗi đường rút được từ ${k.tepXet.length} tệp\n`); process.exit(2); }
  for (const c of k.chet) process.stdout.write(`ĐƯỜNG CHẾT ${c.tep}:${c.dong} · ${c.chuoi} · khớp ${c.cu} tệp ở cây cũ, 0 ở cây mới\n`);
  process.stdout.write(`duong-chet: ${k.tepXet.length} tệp cấu hình, ${k.tong} chuỗi đường, ${k.chet.length} đường chết\n`);
  process.exit(k.chet.length ? 1 : 0);
}
