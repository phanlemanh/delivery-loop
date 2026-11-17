#!/usr/bin/env node
// tu-kiem.mjs — phá thử HAI CHIỀU thước vi phân phán quyết (vi-phan.mjs) trên bộ chặn gộp THẬT và hồ sơ THẬT.
//
// Vì sao không dùng fixture viết tay: cây hồ sơ của hai kho tiêu thụ hôm nay có 0 dòng VIOLATION dưới cả hai bản kit, nên
// «0 lệch» tự nó là 0 = 0. Bộ này chứng minh thước nhìn thấy được lệch, và kit mới bắt đúng những gì kit cũ bắt:
//   C0 đối chứng dương   cây nguyên vẹn, vài hồ sơ đã ký: hai bản kit đều chạy luật, đều OK, 0 lệch
//   C1 cùng bắt          tiêm bốn vi phạm vào bản sao cây hồ sơ: CẢ HAI bản kit ra đúng các dòng VIOLATION ấy, 0 lệch
//   C2 độ nhạy           tắt một luật trong bản sao lõi mới: thước ĐỎ, nêu đúng dòng VIOLATION bên mới thiếu
//   C3 độ đặc hiệu       bản sao lõi mới ở đường khác, chỉ đổi chú thích + thêm một tệp tài liệu: thước IM
//   C4 không đọc được    trỏ một thư mục không có bộ chặn gộp: báo cáo thoát 2, không in «phán quyết lệch»
//   C4b dừng sớm         bản chụp chỉ có VIOLATION [config], không dòng sổ luật: không đọc được
//
//   node tu-kiem.mjs --kho <bản kéo git của kho tiêu thụ> --ref <mã> --base <ref> --cu <gốc lõi cũ> --moi <gốc lõi mới> [--tam <thư mục>]
// Bộ tự tạo cây làm việc tạm (git worktree --detach) của kho ấy và gỡ khi xong; không commit, không đẩy gì.
// Thoát: 0 cả sáu ca đạt · 1 có ca trượt · 2 không đọc được ở đây (thiếu đối số, không tìm đủ bốn hồ sơ đã ký).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chup, che, so, tach, docDuoc, baoCao } from './vi-phan.mjs';

const a = {};
const v = process.argv.slice(2);
for (let i = 0; i < v.length; i += 2) a[v[i].replace(/^--/, '')] = v[i + 1];
const thieu = ['kho', 'ref', 'base', 'cu', 'moi'].filter(k => !a[k]);
if (thieu.length) { process.stderr.write(`không đọc được ở đây: thiếu --${thieu.join(', --')}\n`); process.exit(2); }

const git = (cwd, args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] });
const TAM = fs.mkdtempSync(path.join(a.tam || os.tmpdir(), 'vi-phan-tu-kiem-'));
const CAY = path.join(TAM, 'cay');
const CU = path.resolve(a.cu), MOI = path.resolve(a.moi);
let truot = 0;
const ca = (ten, dat, chiTiet) => { process.stdout.write(`${dat ? 'PASS' : 'FAIL'}: ${ten} — ${chiTiet}\n`); if (!dat) truot++; };
const doc = (s) => fs.readFileSync(s, 'utf8');
const ghi = (s, c) => fs.writeFileSync(s, c);

let khongDocDuoc = null;
try {
  git(a.kho, ['worktree', 'add', '-q', '--detach', CAY, a.ref]);
  // Bốn hồ sơ đã ký, verdict PASS, có verified_commit — theo thứ tự tên, tất định.
  const ds = fs.readdirSync(path.join(CAY, '_acceptance')).sort().filter(s => {
    const f = path.join(CAY, '_acceptance', s, 'evidence-report.md');
    if (!fs.existsSync(f)) return false;
    const d = doc(f).split('\n---')[0];
    return /^verdict: PASS$/m.test(d) && /^human_signoff: \S/m.test(d) && /^enforcement_mode: strict$/m.test(d) && /^bypass_used: false$/m.test(d);
  }).slice(0, 4);
  if (ds.length < 4) { khongDocDuoc = `chỉ tìm được ${ds.length}/4 hồ sơ đã ký trong ${a.ref}`; throw new Error(khongDocDuoc); }
  const o = (goc) => ({ kit: [goc], kho: [CAY, fs.realpathSync(CAY)] });
  const chay = (goc) => { const c = chup({ kho: CAY, base: a.base, goc, slug: ds }); return { ...c, chu: che(c.chu, o(goc)) }; };

  // C0 — đối chứng dương.
  const c0 = [chay(CU), chay(MOI)];
  const k0 = so(c0[0], c0[1]);
  ca('C0 đối chứng dương', !docDuoc(c0[0]) && !docDuoc(c0[1]) && k0.phanQuyet.length === 0 && k0.dem.dc.OK === 4 && k0.dem.ms.OK === 4 && k0.dem.dc.VIOLATION === 0,
    `cũ OK ${k0.dem.dc.OK} VIOLATION ${k0.dem.dc.VIOLATION} · mới OK ${k0.dem.ms.OK} VIOLATION ${k0.dem.ms.VIOLATION} · lệch ${k0.phanQuyet.length} · hồ sơ: ${ds.join(', ')}`);

  // C1 — tiêm bốn vi phạm vào cây hồ sơ; cả hai bản kit phải cùng bắt.
  const bc = (s) => path.join(CAY, '_acceptance', s, 'evidence-report.md');
  const thay = (s, re, moi) => { const d = doc(bc(s)); if (!re.test(d)) throw new Error(`tiêm không khớp ở ${s}: ${re}`); ghi(bc(s), d.replace(re, moi)); };
  thay(ds[0], /^human_signoff: .*$/m, 'human_signoff:');
  thay(ds[1], /^verdict: PASS$/m, 'verdict: FAIL');
  thay(ds[2], /^enforcement_mode: strict$/m, 'enforcement_mode: off');
  thay(ds[3], /^bypass_used: false$/m, 'bypass_used: true');
  const c1 = [chay(CU), chay(MOI)];
  const k1 = so(c1[0], c1[1]);
  const coViol = (c, s) => tach(c.chu).viol.some(d => d.startsWith(`VIOLATION [${s}]`));
  const duBon = ds.every(s => coViol(c1[0], s) && coViol(c1[1], s));
  ca('C1 cùng bắt', duBon && k1.phanQuyet.length === 0 && c1[0].ma === 1 && c1[1].ma === 1,
    `cũ VIOLATION ${k1.dem.dc.VIOLATION} thoát ${c1[0].ma} · mới VIOLATION ${k1.dem.ms.VIOLATION} thoát ${c1[1].ma} · cả bốn hồ sơ bị tiêm đều có dòng ở hai bên: ${duBon} · lệch ${k1.phanQuyet.length}`);

  // C2 — độ nhạy: tắt luật «chữ ký rỗng» trong một bản sao lõi mới.
  const saoLoi = (ten) => { const d = path.join(TAM, ten, 'loi'); fs.cpSync(MOI, d, { recursive: true }); return d; };
  const L2 = saoLoi('nhay');
  const kb2 = path.join(L2, 'scripts', 'pre-merge-check.sh');
  const CHU = 'echo "VIOLATION [$slug]: verdict PASS but human_signoff is empty';
  const n2 = doc(kb2).split(CHU).length - 1;
  if (n2 !== 1) { ca('C2 độ nhạy', false, `chỗ tiêm khớp ${n2} lần trong bộ chặn gộp, cần đúng 1 — bộ tự kiểm lệch vật`); }
  else {
    ghi(kb2, doc(kb2).replace(CHU, 'echo "NOTE [$slug]: (tiêm tu-kiem) human_signoff is empty'));
    const c2 = (() => { const c = chup({ kho: CAY, base: a.base, goc: L2, slug: ds }); return { ...c, chu: che(c.chu, o(L2)) }; })();
    const k2 = so(c1[1], c2);
    const dung = k2.phanQuyet.filter(d => d.startsWith('VIOLATION chỉ bên đối chứng') && d.includes(`[${ds[0]}]`) && d.includes('human_signoff is empty'));
    ca('C2 độ nhạy', k2.phanQuyet.length >= 1 && dung.length === 1, `tắt một luật ở bản sao → lệch ${k2.phanQuyet.length}, trong đó dòng đúng hồ sơ ${ds[0]}: ${dung.length}`);
  }

  // C3 — độ đặc hiệu: bản sao ở đường khác, chỉ đổi chú thích và thêm tài liệu.
  const L3 = saoLoi('dac-hieu');
  const kb3 = path.join(L3, 'scripts', 'pre-merge-check.sh');
  ghi(kb3, doc(kb3).replace('\nset -u\n', '\n# tu-kiem: một dòng chú thích không đổi hành vi\nset -u\n'));
  ghi(path.join(L3, 'GHI-CHU-TU-KIEM.md'), '# tệp tài liệu thêm vào bản sao — không phải vật\n');
  const c3 = (() => { const c = chup({ kho: CAY, base: a.base, goc: L3, slug: ds }); return { ...c, chu: che(c.chu, o(L3)) }; })();
  const k3 = so(c1[1], c3);
  ca('C3 độ đặc hiệu', k3.phanQuyet.length === 0 && k3.chiDoc.length === 0 && k3.dem.ms.VIOLATION === k1.dem.ms.VIOLATION && doc(kb3) !== doc(path.join(MOI, 'scripts', 'pre-merge-check.sh')),
    `đổi chú thích + thêm tài liệu, đường kit khác → lệch ${k3.phanQuyet.length}, chỉ đọc ${k3.chiDoc.length}, VIOLATION ${k3.dem.ms.VIOLATION}`);

  // C4 — không đọc được: thư mục không có bộ chặn gộp.
  const c4 = chup({ kho: CAY, base: a.base, goc: path.join(TAM, 'khong-co'), slug: ds });
  const in4 = [];
  const ma4 = baoCao([{ nhan: 'doi-chung', ...c1[1] }, { nhan: 'khong-co', ...c4 }], (d) => in4.push(d));
  ca('C4 không đọc được', docDuoc(c4) !== null && ma4 === 2 && !in4.some(d => /phán quyết lệch/.test(d)), `thư mục không có bộ chặn gộp → ${docDuoc(c4)} · báo cáo thoát ${ma4}, không in dòng «phán quyết lệch»`);
  // Bản chụp chỉ có VIOLATION [config] (bộ chặn gộp dừng sớm) cũng phải là «không đọc được», không phải phán quyết.
  ca('C4b dừng sớm', docDuoc({ ma: 1, chu: 'VIOLATION [config]: base "x" không resolve được\n' }) !== null, 'một dòng VIOLATION [config] không kèm sổ luật → không đọc được');
} catch (e) {
  if (!khongDocDuoc) throw e;
} finally {
  try { git(a.kho, ['worktree', 'remove', '--force', CAY]); } catch { /* đã gỡ */ }
  fs.rmSync(TAM, { recursive: true, force: true });
}
if (khongDocDuoc) { process.stderr.write(`không đọc được ở đây: ${khongDocDuoc}\n`); process.exit(2); }
process.stdout.write(`tu-kiem: ${6 - truot}/6 ca đạt\n`);
process.exit(truot ? 1 : 0);
