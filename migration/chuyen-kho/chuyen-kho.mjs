#!/usr/bin/env node
// chuyen-kho.mjs — kiểm một kho tiêu thụ đã chuyển từ chợ plugin cũ (acceptance-gate-kit) sang chợ mới (delivery-loop) chưa.
//
// Dùng:  node migration/chuyen-kho/chuyen-kho.mjs --kho <đường dẫn kho tiêu thụ> [--ref <commit>] [--soan] [--phien]
//   không --ref : đọc cây làm việc (tệp git theo dõi + tệp mới chưa bị .gitignore loại);
//   --ref       : đọc tệp qua git tại commit ấy, không checkout;
//   --soan      : in bản vá đề xuất cho phần chung (K1, K2, K3) ra stdout — KHÔNG ghi gì vào kho đích;
//   --phien     : đo thêm K6 — mở một phiên Claude Code thật ở gốc kho, đọc sự kiện init rồi giết tiến trình ngay.
// Mã thoát: 0 đạt · 1 có điểm chưa đạt · 2 không đọc được ở đây (lý do trên stderr).
//
// Chế độ kiểm chỉ ĐỌC. Tệp `.env*` không bao giờ được mở, kể cả để tìm chuỗi.
// Luật từng điểm: luat.mjs · bản vá: soan.mjs · kiểm hai chiều: chuyen-kho.test.mjs · giới hạn đã khai: README.md.

import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import {
  CHO_CU, TEP_CAI_DAT, THU_MUC_WORKFLOW, keoKit, kiemK1, kiemK2, kiemK3, kiemK4, kiemK5, kiemK6, laLichSu, laMaSong, moiTenCu,
} from './luat.mjs';
import { soanBanVa } from './soan.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const TEP_BANG_TEN = path.join(DAY, '..', 'chay-thu-phien', 'bang-ten.json');
const BO_ENV = ':(exclude,glob)**/.env*';
const CHO_INIT_MS = 120_000;
const BO_DEM_GIT = 256 * 1024 * 1024;
const CACH_DUNG = 'Dùng: node chuyen-kho.mjs --kho <đường dẫn kho tiêu thụ> [--ref <commit>] [--soan] [--phien]';

/** Lỗi «không đọc được ở đây» — mã thoát 2, khác hẳn «đã đọc và chưa đạt». */
export class KhongDocDuoc extends Error {}

const laEnv = tep => path.basename(tep).startsWith('.env');
const tachNul = chu => chu.split('\0').filter(Boolean);

function git(goc, args) {
  const r = spawnSync('git', ['-C', goc, ...args], { encoding: 'utf8', maxBuffer: BO_DEM_GIT });
  if (r.error) throw new KhongDocDuoc(`không chạy được git: ${r.error.message}`);
  return r;
}

function gocKho(kho) {
  if (!fs.existsSync(kho) || !fs.statSync(kho).isDirectory()) throw new KhongDocDuoc(`đường dẫn không phải thư mục: ${kho}`);
  const r = git(kho, ['rev-parse', '--show-toplevel']);
  if (r.status !== 0) throw new KhongDocDuoc(`không phải kho git: ${kho}`);
  return r.stdout.trim();
}

/** Bộ đọc cây làm việc: tệp git theo dõi và tệp mới chưa bị .gitignore loại. */
function cayLamViec(goc) {
  return {
    goc,
    nhan: 'cây làm việc',
    doc(tep) {
      if (laEnv(tep)) return null;
      try { return fs.readFileSync(path.join(goc, tep), 'utf8'); } catch (e) {
        if (e.code === 'ENOENT' || e.code === 'EISDIR') return null;
        throw new KhongDocDuoc(`không đọc được ${tep}: ${e.message}`);
      }
    },
    lietKe: thuMuc => tachNul(git(goc, ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', thuMuc]).stdout),
    timTep(chuoi) {
      const r = git(goc, ['grep', '--untracked', '-l', '-z', '-I', '-F', ...chuoi.flatMap(c => ['-e', c]), '--', '.', BO_ENV]);
      if (r.status > 1) throw new KhongDocDuoc(`git grep hỏng: ${r.stderr.trim()}`);
      return tachNul(r.stdout);
    },
  };
}

/** Bộ đọc một commit: mọi thứ qua git, không checkout. */
function cayTaiRef(goc, ref) {
  const ma = git(goc, ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`]);
  if (ma.status !== 0) throw new KhongDocDuoc(`không thấy commit «${ref}» trong ${goc}`);
  const sha = ma.stdout.trim();
  return {
    goc,
    nhan: `commit ${sha.slice(0, 8)} («${ref}»)`,
    doc(tep) {
      if (laEnv(tep)) return null;
      const r = git(goc, ['show', `${sha}:${tep}`]);
      return r.status === 0 ? r.stdout : null;
    },
    lietKe: thuMuc => tachNul(git(goc, ['ls-tree', '-r', '-z', '--name-only', sha, '--', thuMuc]).stdout),
    timTep(chuoi) {
      const r = git(goc, ['grep', '-l', '-z', '-I', '-F', ...chuoi.flatMap(c => ['-e', c]), sha, '--', '.', BO_ENV]);
      if (r.status > 1) throw new KhongDocDuoc(`git grep hỏng: ${r.stderr.trim()}`);
      return tachNul(r.stdout).map(t => t.slice(sha.length + 1));
    },
  };
}

export function moCay({ kho, ref }) {
  const goc = gocKho(path.resolve(kho));
  return ref ? cayTaiRef(goc, ref) : cayLamViec(goc);
}

function docBangTen() {
  try { return JSON.parse(fs.readFileSync(TEP_BANG_TEN, 'utf8')); } catch (e) {
    throw new KhongDocDuoc(`không đọc được bảng tên ${TEP_BANG_TEN}: ${e.message}`);
  }
}

function docCaiDat(cay) {
  const chu = cay.doc(TEP_CAI_DAT);
  if (chu === null) throw new KhongDocDuoc(`thiếu ${TEP_CAI_DAT} trong ${cay.goc} (${cay.nhan})`);
  try { return { chu, caiDat: JSON.parse(chu) }; } catch (e) {
    throw new KhongDocDuoc(`${TEP_CAI_DAT} không phải JSON hợp lệ: ${e.message}`);
  }
}

const docNhieu = (cay, cacTep) => cacTep.map(tep => ({ tep, noiDung: cay.doc(tep) })).filter(t => t.noiDung !== null);

function docWorkflow(cay) {
  return docNhieu(cay, cay.lietKe(THU_MUC_WORKFLOW).filter(t => /\.ya?ml$/.test(t)).sort());
}

/** Chạy K1–K5 trên một cây đã mở. Trả mảng kết quả theo thứ tự K1 → K5. */
export function kiemCay(cay, bang) {
  const { caiDat } = docCaiDat(cay);
  const coKhoaCu = cay.timTep([`@${CHO_CU}`]).filter(laMaSong).sort();
  const moi = moiTenCu(bang);
  const coTenCu = moi.length > 0 ? cay.timTep(moi).sort() : [];
  const tenCuSong = coTenCu.filter(t => !laLichSu(t));
  return [
    kiemK1(caiDat),
    kiemK2(caiDat, bang),
    kiemK3(docWorkflow(cay), bang),
    kiemK4(docNhieu(cay, coKhoaCu)),
    kiemK5(docNhieu(cay, tenCuSong), bang, coTenCu.length - tenCuSong.length),
  ];
}

function gietNhom(con) {
  try { process.kill(-con.pid, 'SIGKILL'); } catch {
    // Tiến trình đã tự thoát trước khi kịp giết — không còn gì để dừng.
  }
}

/** Mở một phiên Claude Code không đầu ở `goc`, trả sự kiện init rồi giết cả nhóm tiến trình ngay. */
export function moPhien(goc) {
  return new Promise((xong, hong) => {
    const con = spawn('claude', ['-p', 'ok', '--output-format', 'stream-json', '--verbose', '--max-turns', '1'],
      { cwd: goc, stdio: ['ignore', 'pipe', 'ignore'], detached: true });
    const tu = ly => { clearTimeout(hen); gietNhom(con); hong(new KhongDocDuoc(`K6: không lấy được sự kiện init — ${ly}`)); };
    const hen = setTimeout(() => tu(`quá ${CHO_INIT_MS / 1000} giây`), CHO_INIT_MS);
    const dong = readline.createInterface({ input: con.stdout });
    dong.on('line', d => {
      let e;
      try { e = JSON.parse(d); } catch { return; }
      if (e?.type !== 'system' || e.subtype !== 'init') return;
      clearTimeout(hen);
      dong.close();
      gietNhom(con);
      xong(e);
    });
    con.on('error', e => tu(`không chạy được «claude»: ${e.message}`));
    con.on('exit', ma => tu(`phiên thoát (mã ${ma}) trước khi phát init`));
  });
}

async function doK6({ phien, ref }, cay) {
  if (!phien) return { ma: 'K6', boQua: 'không đo (thiếu --phien)' };
  if (ref) return { ma: 'K6', boQua: 'không đo (phiên chỉ mở được trên cây làm việc — bỏ --ref để đo)' };
  return kiemK6(await moPhien(cay.goc), os.hostname());
}

const inDong = k => (k.boQua ? `${k.ma}: ${k.boQua}` : `${k.ma}: ${k.dat ? 'ĐẠT' : 'CHƯA'} — ${k.lyDo}`);

function inSoan(cay, bang, ketQua) {
  const { chu } = docCaiDat(cay);
  const khoi = soanBanVa({ tepCaiDat: TEP_CAI_DAT, chuCaiDat: chu, workflow: docWorkflow(cay).filter(w => keoKit(w.noiDung)) }, bang);
  const ra = [`# chuyen-kho --soan: bản vá ĐỀ XUẤT cho ${cay.goc} (${cay.nhan}). Chưa ghi gì vào kho; áp bằng: git apply <tệp này>`];
  for (const k of khoi) ra.push(k.diff ? `# ${k.nhan}\n${k.diff.trimEnd()}` : `# ${k.nhan}: không cần vá`);
  for (const k of ketQua.filter(x => ['K4', 'K5'].includes(x.ma) && !x.dat)) ra.push(`# ${k.ma} — không vá tự động: ${k.lyDo}`);
  process.stdout.write(`${ra.join('\n')}\n`);
}

export function docThamSo(argv) {
  const ts = { kho: null, ref: null, soan: false, phien: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--soan' || a === '--phien') { ts[a.slice(2)] = true; continue; }
    if ((a === '--kho' || a === '--ref') && argv[i + 1] && !argv[i + 1].startsWith('--')) { ts[a.slice(2)] = argv[i += 1]; continue; }
    throw new KhongDocDuoc(`tham số không hiểu hoặc thiếu giá trị: ${a}. ${CACH_DUNG}`);
  }
  if (!ts.kho) throw new KhongDocDuoc(`thiếu --kho. ${CACH_DUNG}`);
  return ts;
}

async function main(argv) {
  const ts = docThamSo(argv);
  const bang = docBangTen();
  const cay = moCay(ts);
  const ketQua = kiemCay(cay, bang);
  if (ts.soan) { inSoan(cay, bang, ketQua); return 0; }
  process.stdout.write(`chuyen-kho: ${cay.goc} · ${cay.nhan}\n${ketQua.map(inDong).join('\n')}\n`);
  const k6 = await doK6(ts, cay);
  const chua = [...ketQua, k6].filter(k => !k.boQua && !k.dat).length;
  process.stdout.write(`${inDong(k6)}\nKẾT: ${chua === 0 ? 'ĐẠT' : `CHƯA (${chua} điểm)`}\n`);
  return chua === 0 ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then(ma => { process.exitCode = ma; }, e => {
    const ly = e instanceof KhongDocDuoc ? e.message : `lỗi ngoài dự kiến của công cụ — ${e?.stack ?? e}`;
    process.stderr.write(`chuyen-kho: không đọc được ở đây: ${ly}\n`);
    process.exitCode = 2;
  });
}
