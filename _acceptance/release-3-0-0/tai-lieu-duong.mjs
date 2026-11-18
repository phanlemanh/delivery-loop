#!/usr/bin/env node
// tai-lieu-duong.mjs — vế tài liệu của AC-8 (release-3-0-0): những đường kho tiêu thụ LÀM THEO trong ba tệp tài liệu gốc
// phải trỏ tệp có thật ở cùng ref.
//   node tai-lieu-duong.mjs [<ref>]      (mặc định HEAD)
// Ba lớp đường, rút bằng mã từ chính tệp ở <ref>, giải trên cây của <ref>:
//   · liên kết markdown tương đối `](đường)` trong README.md, GUIDE.md, QUICKSTART.md (bỏ http, mailto, #neo)
//   · `<kit>/<đường>` trong README.md và GUIDE.md — đường tính từ gốc bản kit (đoạn còn `<…>` hay `*` thì bỏ)
//   · tên kho trong dòng lấy kit của GUIDE §5.3 (`fetch … https://github.com/phanlemanh/<kho>`) phải là delivery-loop
// In mỗi chỗ chết một dòng «CHẾT <tệp>:<dòng> · <đường>», rồi một dòng tổng «tai-lieu-duong: <ref> · <n> đường · <k> chết».
// Thoát 0 không chỗ chết · 1 có · 2 không đọc được (0 đường rút được — không bao giờ in «0 chết» trong ca ấy).
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ref = process.argv[2] || 'HEAD';
const git = (a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] });
let cay;
try { cay = new Set(git(['ls-tree', '-r', '--name-only', ref]).split('\n').filter(Boolean)); } catch { console.log(`không đọc được ở đây: ref ${ref}`); process.exit(2); }
const thuMuc = new Set([...cay].flatMap((t) => { const r = []; for (let q = path.posix.dirname(t); q !== '.'; q = path.posix.dirname(q)) r.push(q); return r; }));
const co = (p) => cay.has(p) || thuMuc.has(p.replace(/\/$/, ''));
const chet = []; let n = 0;
for (const tep of ['README.md', 'GUIDE.md', 'QUICKSTART.md']) {
  let chu;
  try { chu = git(['show', `${ref}:${tep}`]); } catch { console.log(`không đọc được ở đây: ${ref} không có ${tep}`); process.exit(2); }
  chu.split('\n').forEach((d, i) => {
    for (const m of d.matchAll(/\]\(([^)\s]+)\)/g)) {
      const dich = m[1].split('#')[0];
      if (!dich || /^[a-z]+:/i.test(dich)) continue;
      n++; const p = path.posix.normalize(path.posix.join(path.posix.dirname(tep), dich));
      if (!co(p)) chet.push(`${tep}:${i + 1} · ${m[1]}`);
    }
    if (tep !== 'QUICKSTART.md') for (const m of d.matchAll(/<kit>\/([^\s"'`)]+)/g)) {
      const p = m[1].replace(/[.,;:]+$/, '');
      if (/[<*]/.test(p)) continue;
      n++; if (!co(p)) chet.push(`${tep}:${i + 1} · <kit>/${p}`);
    }
    if (tep === 'GUIDE.md') for (const m of d.matchAll(/fetch -q --depth 1 https:\/\/github\.com\/phanlemanh\/([\w.-]+)/g)) {
      n++; if (m[1] !== 'delivery-loop') chet.push(`${tep}:${i + 1} · kho lấy kit «${m[1]}», cần delivery-loop`);
    }
  });
}
if (!n) { console.log(`không đọc được ở đây: 0 đường rút được ở ${ref}`); process.exit(2); }
for (const c of chet) console.log(`CHẾT ${c}`);
console.log(`tai-lieu-duong: ${ref} · ${n} đường · ${chet.length} chết`);
process.exit(chet.length ? 1 : 0);
