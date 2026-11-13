#!/usr/bin/env node
// don-nha.mjs — kịch bản chuyển nhà (vòng B1 kich-ban-chuyen-nha của đợt chuyển kit sang kho delivery-loop).
//
// Lấy MỘT mã commit của nhánh chính kho cũ (mặc định kit-cu/main) và dựng nhánh cục bộ (mặc định don-nha/3.0) = mã ấy
// + đúng năm commit dọn nhà:
//   1/5 dời sản phẩm vào plugins/<tên>/     · 2/5 tệp khai chợ và plugin   · 3/5 đổi tên theo bảng tên
//   4/5 con trỏ sang kho cũ                  · 5/5 khuôn Repo Standards
// Chỉ phép biến đổi CƠ HỌC: dời, đổi tên có neo, đổi con trỏ, chạy khuôn. Sửa ngữ nghĩa sản phẩm làm ở kho cũ.
// Tất định: tác giả, người commit và ngày cố định (ngày của mã nguồn) → cùng nguồn thì cùng mã commit.
// Làm trong một cây làm việc tạm tách khỏi mọi nhánh; ref đích chỉ ghi ở cuối khi mọi bước qua. Không chạm ref nào khác.
//
// Dùng:  node don-nha.mjs [--kho <git>] [--nguon <ref>] [--nhanh <tên>] [--bang-xep <tệp>] [--repo-standards <thư mục>]
// Thoát: 0 xong (dòng cuối «don-nha: <nguồn> → <commit> cây <cây>») · 1 dừng có tên · 2 sai đối số.
// Thiết kế: THIET-KE.md cạnh tệp này. Kiểm: don-nha.test.mjs. Thước độc lập: kiem-cho.mjs.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));

export class Dung extends Error {}
const dung = (lyDo) => { throw new Dung(lyDo); };

const git = (cwd, args, env) => execFileSync('git', ['-C', cwd, ...args], {
  encoding: 'utf8', maxBuffer: 1 << 30, env: env ? { ...process.env, ...env } : process.env, stdio: ['ignore', 'pipe', 'pipe'],
});

function doiSo(argv) {
  const a = { kho: path.join(DAY, '..', '..'), bangXep: path.join(DAY, 'bang-xep.json') };
  const khoa = { '--kho': 'kho', '--nguon': 'nguon', '--nhanh': 'nhanh', '--bang-xep': 'bangXep', '--repo-standards': 'rs' };
  for (let i = 0; i < argv.length; i++) {
    const k = khoa[argv[i]];
    if (!k || argv[i + 1] === undefined) return null;
    a[k] = argv[++i];
  }
  return a;
}

export function docBangXep(tep) {
  const bx = JSON.parse(fs.readFileSync(tep, 'utf8'));
  bx._dir = path.dirname(path.resolve(tep));
  bx._bangTen = JSON.parse(fs.readFileSync(path.resolve(bx._dir, bx.bang_ten), 'utf8'));
  return bx;
}

// Mục gốc của nguồn phải nằm trong một trong ba nhóm của bảng xếp.
function kiemThuMucGoc(kho, S, bx) {
  const biet = new Set([...Object.keys(bx.thu_muc), ...Object.keys(bx.tep).map(t => t.split('/')[0]), ...bx.giu.map(t => t.split('/')[0])]);
  for (const muc of git(kho, ['ls-tree', '--name-only', S]).split('\n').filter(Boolean)) {
    if (!biet.has(muc)) dung(`thư mục gốc chưa xếp: ${muc}`);
  }
}

function nhanhDangCheckOut(kho, ref) {
  return git(kho, ['worktree', 'list', '--porcelain']).split('\n').some(d => d === `branch ${ref}`);
}

// ── Bước 1: dời sản phẩm ────────────────────────────────────────────────────────────────────────────────────────
function buoc1Doi(wt, bx) {
  const cap = [...Object.entries(bx.thu_muc), ...Object.entries(bx.tep)];
  for (const [nguon, dich] of cap) {
    if (!fs.existsSync(path.join(wt, nguon))) continue;
    fs.mkdirSync(path.dirname(path.join(wt, dich)), { recursive: true });
    git(wt, ['mv', nguon, dich]);
  }
}

// Thư mục gốc của plugin lõi trên cây mới (nơi tệp khai lõi dời tới, bỏ đuôi /.claude-plugin/plugin.json).
const gocLoi = (bx) => path.posix.dirname(path.posix.dirname(bx.tep['.claude-plugin/plugin.json']));

// Thay đúng một lần một chuỗi trong văn bản; không khớp đúng một lần → dừng.
function thayMotLan(s, cu, moi, noi) {
  const n = s.split(cu).length - 1;
  if (n !== 1) dung(`tệp khai không đúng khuôn: ${noi} có ${n} chỗ «${cu}»`);
  return s.replace(cu, moi);
}

// ── Bước 2: tệp khai chợ và plugin (sửa chữ, giữ nguyên định dạng) ─────────────────────────────────────────────────
function buoc2TepKhai(wt, bx) {
  const tepCho = path.join(wt, '.claude-plugin/marketplace.json');
  let s = fs.readFileSync(tepCho, 'utf8');
  const cho = JSON.parse(s);
  s = thayMotLan(s, `"name": "${cho.name}"`, `"name": "${bx.cho_moi.ten_moi}"`, 'marketplace.json');
  for (const p of cho.plugins) {
    const nguon = path.posix.normalize(p.source).replace(/^\.\/?/, '').replace(/\/$/, '');
    const dich = nguon === '' || nguon === '.' ? gocLoi(bx) : bx.thu_muc[nguon];
    if (!dich) dung(`nguồn plugin chưa xếp: ${p.name} (${p.source})`);
    s = thayMotLan(s, `"source": "${p.source}"`, `"source": "./${dich}"`, 'marketplace.json');
    const moi = bx._bangTen.plugin[p.name];
    if (moi) {
      s = thayMotLan(s, `"name": "${p.name}"`, `"name": "${moi}"`, 'marketplace.json');
      const tepKhai = path.join(wt, dich, '.claude-plugin/plugin.json');
      fs.writeFileSync(tepKhai, thayMotLan(fs.readFileSync(tepKhai, 'utf8'), `"name": "${p.name}"`, `"name": "${moi}"`, `${dich}/.claude-plugin/plugin.json`));
    }
  }
  fs.writeFileSync(tepCho, s);
}

export function chay({ kho, nguon, nhanh, bangXep, rs }) {
  const bx = docBangXep(bangXep);
  nguon = nguon || bx.nguon_mac_dinh;
  nhanh = nhanh || bx.nhanh_mac_dinh;
  const REF_DICH = `refs/heads/${nhanh}`;
  let S;
  try { S = git(kho, ['rev-parse', '--verify', `${nguon}^{commit}`]).trim(); } catch { dung(`không đọc được nguồn: ${nguon}`); }
  if (nhanhDangCheckOut(kho, REF_DICH)) dung(`nhánh đích đang được check-out ở một cây làm việc: ${nhanh}`);
  kiemThuMucGoc(kho, S, bx);
  const ngayNguon = git(kho, ['log', '-1', '--format=%cI', S]).trim();
  const env = {
    GIT_AUTHOR_NAME: bx.tac_gia.ten, GIT_AUTHOR_EMAIL: bx.tac_gia.email,
    GIT_COMMITTER_NAME: bx.tac_gia.ten, GIT_COMMITTER_EMAIL: bx.tac_gia.email,
    GIT_AUTHOR_DATE: ngayNguon, GIT_COMMITTER_DATE: ngayNguon,
  };
  const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'don-nha-'));
  const wt = path.join(tam, 'cay');
  git(kho, ['worktree', 'add', '-q', '--detach', wt, S]);
  try {
    const commit = (tieuDe) => { git(wt, ['add', '-A']); git(wt, ['-c', 'commit.gpgsign=false', 'commit', '-q', '--allow-empty', '-m', tieuDe], env); };
    buoc1Doi(wt, bx); commit('dọn nhà 1/5: dời sản phẩm vào plugins/<tên>/');
    buoc2TepKhai(wt, bx); commit('dọn nhà 2/5: tệp khai chợ và plugin');
    commit('dọn nhà 3/5: đổi tên theo bảng tên');
    commit('dọn nhà 4/5: con trỏ sang kho cũ');
    commit('dọn nhà 5/5: khuôn Repo Standards');
    const dinh = git(wt, ['rev-parse', 'HEAD']).trim();
    const cay = git(wt, ['rev-parse', 'HEAD^{tree}']).trim();
    git(kho, ['update-ref', REF_DICH, dinh]);
    return { nguon: S, commit: dinh, cay };
  } finally {
    try { git(kho, ['worktree', 'remove', '--force', wt]); } catch { /* đã gỡ */ }
    fs.rmSync(tam, { recursive: true, force: true });
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  const a = doiSo(process.argv.slice(2));
  if (!a) { process.stderr.write('dùng: node don-nha.mjs [--kho <git>] [--nguon <ref>] [--nhanh <tên>] [--bang-xep <tệp>] [--repo-standards <thư mục>]\n'); process.exit(2); }
  try {
    const kq = chay(a);
    process.stdout.write(`don-nha: ${kq.nguon} → ${kq.commit} cây ${kq.cay}\n`);
  } catch (e) {
    if (!(e instanceof Dung)) throw e;
    process.stderr.write(`don-nha: ${e.message}\n`);
    process.exit(1);
  }
}
