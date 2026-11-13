#!/usr/bin/env node
// thuoc-that.mjs — thước của vòng B1 kich-ban-chuyen-nha trên NGUỒN THẬT (kit-cu/main lúc chạy).
//
//   node thuoc-that.mjs            AC-1, AC-2, AC-3, AC-4, AC-5, AC-7, AC-8
//   node thuoc-that.mjs --phien    AC-6: chạy thử phiên thật cây cũ so cây mới qua bảng tên (cần lệnh `claude`, 0 token)
//   node thuoc-that.mjs --lop-do   AC-10: đối chiếu báo cáo ket-qua/lop-do.md với cây dựng lại
//
// Bản kéo Repo Standards: $TMPDIR/delivery-loop-rs-<mã 7> — chưa có thì kéo thẻ của bảng xếp (cần mạng một lần).
// Kịch bản chạy vào hai nhánh tạm don-nha/thuoc-a, don-nha/thuoc-b; xoá cả hai khi xong.
// Thoát: 0 đạt · 1 có thước đỏ (mỗi dòng stderr một lỗi) · 2 không đọc được ở đây (thiếu công cụ).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { kiemCho, soHaiLan, chupKho, soChup } from './kiem-cho.mjs';
import { chayThu, dungCay, soSanh, moiTruongTach } from '../chay-thu-phien/chay-thu.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KHO = path.resolve(DAY, '..', '..');
const BANG_XEP = path.join(DAY, 'bang-xep.json');
const NHANH = ['don-nha/thuoc-a', 'don-nha/thuoc-b'];

const git = (args, cwd = KHO) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'pipe'] });
const loi = [];
const ra = (s) => process.stdout.write(s + '\n');
const khongDoc = (s) => { process.stderr.write(`không đọc được ở đây: ${s}\n`); process.exit(2); };
const coLenh = (l) => spawnSync('sh', ['-c', `command -v ${l}`]).status === 0;

function banKeoRs(bx) {
  const d = path.join(os.tmpdir(), `delivery-loop-rs-${bx.khuon.ma.slice(0, 7)}`);
  if (!fs.existsSync(path.join(d, '.git'))) {
    fs.rmSync(d, { recursive: true, force: true });
    const r = spawnSync('git', ['clone', '-q', '--depth', '1', '--branch', bx.khuon.the, 'https://github.com/phanlemanh/repo-standards.git', d], { encoding: 'utf8' });
    if (r.status !== 0) khongDoc(`không kéo được Repo Standards ${bx.khuon.the} (${r.stderr.trim().split('\n').pop()})`);
  }
  return d;
}

function donNha(nhanh, rs, nguon) {
  const r = spawnSync(process.execPath, [path.join(DAY, 'don-nha.mjs'), '--kho', KHO, '--nhanh', nhanh, '--repo-standards', rs, ...(nguon ? ['--nguon', nguon] : [])], { encoding: 'utf8' });
  if (r.status !== 0) { loi.push(`kịch bản thoát ${r.status}: ${r.stderr.trim()}`); return null; }
  return r.stdout.trim().split('\n').pop();
}

function moCay(ref) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'thuoc-that-'));
  git(['worktree', 'add', '-q', '--detach', path.join(d, 'cay'), ref]);
  return { cay: path.join(d, 'cay'), xoa: () => { try { git(['worktree', 'remove', '--force', path.join(d, 'cay')]); } catch { /* đã gỡ */ } fs.rmSync(d, { recursive: true, force: true }); } };
}

function ac5Validate(cay) {
  const env = moiTruongTach(fs.mkdtempSync(path.join(os.tmpdir(), 'thuoc-cfg-')));
  const cho = JSON.parse(fs.readFileSync(path.join(cay, '.claude-plugin/marketplace.json'), 'utf8'));
  const dich = ['.', ...cho.plugins.map(p => p.source)];
  let qua = 0;
  for (const d of dich) {
    const r = spawnSync('claude', ['plugin', 'validate', d], { cwd: cay, env, encoding: 'utf8', input: '' });
    if (r.status === 0) qua++; else loi.push(`claude plugin validate không qua: ${d}`);
  }
  ra(`claude plugin validate: ${qua}/${dich.length} qua`);
}

function ac8(cay, bx, rs) {
  const k = bx.khuon; const truoc = loi.length;
  const rsj = JSON.parse(fs.readFileSync(path.join(cay, '.repo-setup.json'), 'utf8'));
  if (rsj.preset !== 'claude-plugin') loi.push(`.repo-setup.json preset ${rsj.preset}`);
  if (rsj.level !== 'starter') loi.push(`.repo-setup.json level ${rsj.level}`);
  if ((rsj.vars || {}).project_name !== 'delivery-loop') loi.push('.repo-setup.json thiếu project_name delivery-loop');
  for (const t of ['.editorconfig', 'Makefile', 'tools/plugin_lint.py', 'tools/bump_version.py']) if (!fs.existsSync(path.join(cay, t))) loi.push(`thiếu tệp khuôn: ${t}`);
  if (fs.existsSync(path.join(cay, '.claude/skills/review-change'))) loi.push('còn skill review-change của khuôn');
  const ns = git(['diff', '--name-status', '--no-renames', 'HEAD~1', 'HEAD'], cay).trim().split('\n').map(d => d.split('\t'));
  const duoc = { A: k.duoc_cham.them, M: k.duoc_cham.sua, D: k.duoc_cham.xoa };
  for (const [l, t] of ns) if (!(duoc[l] || []).includes(t)) loi.push(`commit 5 chạm tệp ngoài danh sách: ${l} ${t}`);
  const mk = spawnSync('make', ['--dry-run', 'test'], { cwd: cay, encoding: 'utf8' }).stdout.trim();
  if (mk !== k.make_test) loi.push(`make test không trỏ bộ chạy của kit: ${mk}`);
  const lint = spawnSync('python3', ['tools/plugin_lint.py'], { cwd: cay, encoding: 'utf8' });
  const chuLint = lint.stdout + lint.stderr;
  if (/source/i.test(chuLint) && /root/i.test(chuLint)) loi.push('plugin_lint còn báo nguồn là cả kho');
  const doc = JSON.parse(execFileSync('python3', [path.join(rs, 'plugins/repo-setup/scripts/doctor.py'), '--target', cay, '--json'], { encoding: 'utf8' }));
  const datNguon = (doc.passed || []).includes('plugin_source_not_root');
  if (!datNguon) loi.push('doctor: plugin_source_not_root chưa đạt');
  if (loi.length === truoc) {
    ra(`AC-8 đạt: .repo-setup.json preset claude-plugin · level starter · project_name delivery-loop; đủ bốn tệp khuôn; không có .claude/skills/review-change; make test trỏ bộ chạy của kit; plugin_lint không báo nguồn là cả kho`);
    ra('commit 5: ' + ns.map(([l, t]) => `${l} ${t}`).join(' · '));
    ra(`plugin_lint: ${chuLint.trim().split('\n').slice(0, 2).join(' / ')}`);
  }
  ra(`doctor: ${doc.score}/100 · plugin_source_not_root ${datNguon ? 'đạt' : 'chưa đạt'}`);
}

function chinh(bx, S) {
  if (!coLenh('python3')) khongDoc('thiếu lệnh python3');
  if (!coLenh('claude')) khongDoc('thiếu lệnh claude');
  const rs = banKeoRs(bx);
  const truoc = chupKho(KHO);
  const a = donNha(NHANH[0], rs); const b = donNha(NHANH[1], rs);
  if (!a || !b) return;
  const khac = soHaiLan(KHO, NHANH[0], NHANH[1]);
  if (khac) loi.push(khac);
  else ra(`AC-1 đạt: hai lần chạy cùng commit ${git(['rev-parse', NHANH[0]]).trim()} cùng cây ${git(['rev-parse', `${NHANH[0]}^{tree}`]).trim()}`);
  const doiRef = soChup(truoc, chupKho(KHO), NHANH[0]).filter(l => l !== `ref không phải đích bị đổi: refs/heads/${NHANH[1]}`);
  const tieuDe = git(['log', '--reverse', '--format=%s', `${S}..${NHANH[0]}`]).trim().split('\n');
  const dungTieuDe = tieuDe.length === 5 && tieuDe.every((t, i) => t.startsWith(`dọn nhà ${i + 1}/5: `)) && git(['rev-parse', `${NHANH[0]}~5`]).trim() === S;
  if (!dungTieuDe) loi.push(`nhánh đích không phải nguồn + 5 commit dọn nhà: ${tieuDe.join(' | ')}`);
  loi.push(...doiRef);
  if (dungTieuDe && !doiRef.length) ra(`AC-2 đạt: 5 commit trên ${S}, ref khác không đổi`);
  const kq = kiemCho({ kho: KHO, nguon: S, dich: NHANH[0], bangXep: BANG_XEP });
  for (const d of kq.dong) ra(d);
  loi.push(...kq.loi);
  const { cay, xoa } = moCay(NHANH[0]);
  try { ac5Validate(cay); ac8(cay, bx, rs); } finally { xoa(); }
}

function phien(bx, S) {
  if (!coLenh('claude')) khongDoc('thiếu lệnh claude');
  const rs = banKeoRs(bx);
  if (!donNha(NHANH[0], rs)) return;
  const bang = JSON.parse(fs.readFileSync(path.resolve(DAY, bx.bang_ten), 'utf8'));
  const cayCu = dungCay({ kho: KHO, ref: S }); const cayMoi = dungCay({ kho: KHO, ref: NHANH[0] });
  try {
    const cu = chayThu({ cay: cayCu }); const moi = chayThu({ cay: cayMoi });
    const k = soSanh(cu, moi, bang);
    ra(`cây cũ: ${cu.nap.plugin.length} plugin · ${cu.nap.lenh.length} lệnh và skill · ${cu.nap.tac_tu.length} tác tử`);
    ra(`cây mới: ${moi.nap.plugin.length} plugin · ${moi.nap.lenh.length} lệnh và skill · ${moi.nap.tac_tu.length} tác tử`);
    for (const n of ['plugin', 'lenh', 'tac_tu']) ra(`${n}: mất ${k[n].mat.length} · thừa ${k[n].thua.length}${k[n].mat.length || k[n].thua.length ? ' — ' + [...k[n].mat.map(x => '-' + x), ...k[n].thua.map(x => '+' + x)].join(' ') : ''}`);
    for (const h of k.hong) loi.push(h);
    if (k.dat) ra('AC-6 đạt: không mất không thừa sau đổi tên, mọi plugin của chợ mới qua lớp tĩnh và lớp cài');
    else loi.push('AC-6: chạy thử phiên thật lệch');
  } finally { fs.rmSync(cayCu, { recursive: true, force: true }); fs.rmSync(cayMoi, { recursive: true, force: true }); }
}

const bx = JSON.parse(fs.readFileSync(BANG_XEP, 'utf8'));
const S = git(['rev-parse', `${bx.nguon_mac_dinh}^{commit}`]).trim();
ra(`nguồn: ${S} (${bx.nguon_mac_dinh})`);
try {
  if (process.argv.includes('--lop-do')) (await import('./lop-do.mjs')).kiemLopDo({ kho: KHO, S, ra, loi, donNha: (n, nguon) => donNha(n, banKeoRs(bx), nguon), nhanh: NHANH[0] });
  else if (process.argv.includes('--phien')) phien(bx, S);
  else chinh(bx, S);
} finally {
  for (const n of NHANH) spawnSync('git', ['-C', KHO, 'branch', '-D', '-q', n]);
}
for (const l of loi) process.stderr.write(`thuoc-that: ${l}\n`);
process.exit(loi.length ? 1 : 0);
