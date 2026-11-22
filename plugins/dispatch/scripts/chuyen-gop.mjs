// Chuyến gộp (hồ sơ chuyen-gop; thí điểm «trợ lý quyết định», hàng 2 — cùng loại với merge train của GitLab).
// Mặc-ký làm các hàng về đích sát nhau hơn; nếu mỗi PR vẫn gộp riêng thì sau mỗi lần nhánh chính đổi, mọi PR còn lại
// phải gộp nhánh chính vào nhánh và chờ CI lại — dây chuyền kiểm lại dài thêm. Chuyến gộp thay việc đó:
//
//   1. gom    — PR đã đạt bằng chứng trong cùng một cửa sổ (`chuyen_gop.cua_so_phut`, tính từ PR đạt sớm nhất) thành một
//               chuyến; chuyến khởi hành khi hết cửa sổ (hay khi người gọi `--ngay`).
//   2. dựng   — từ đỉnh nhánh chính, gộp lần lượt đầu nhánh của từng PR (thứ tự đạt bằng chứng) vào một worktree tạm. PR
//               xung đột với phần chuyến đứng trước nó rớt khỏi chuyến, có tên.
//   3. kiểm   — chạy `chuyen_gop.lenh_kiem` MỘT lần trên ngọn chuyến. Xanh → gộp cả chuyến theo thứ tự.
//   4. tách đôi — ngọn đỏ thì tìm PR đầu tiên làm chuyến đỏ bằng chia đôi tiền tố (giả định nhánh chính xanh), PR ấy rớt,
//               phần còn lại kiểm lại; lặp tới khi xanh hoặc hết PR. Số lần kiểm ≈ 1 + log2(n) cho mỗi PR lỗi.
//
// Mỗi PR vào chuyến phải đủ điều kiện như lệnh `gop` (mở, không nháp, CI xanh trên đầu nhánh, hồ sơ đã thông trên đầu
// nhánh) và qua cửa proof (`cua-proof.mjs`): món mặc-ký chỉ tự gộp ở kho đã khai proof check.
// Gộp từng PR vẫn qua `gh pr merge --merge --match-head-commit <sha>` — đầu nhánh đổi sau lúc kiểm thì gh từ chối.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { docJson, ghiSuKien, phienCuaCwd, timThuMucDot } from './dot.mjs';
import { docCauHinh, docHangViec } from './hinh-dang.mjs';
import { docPha } from './pha.mjs';
import { DA_THONG, trangThaiHopDong } from './phat-lich.mjs';
import { ciXanh } from './gop.mjs';
import { xetCuaProof } from './cua-proof.mjs';

const PHUT = 60_000;
const dong = (s) => String(s ?? '').split('\n').map((x) => x.trim()).filter(Boolean);

// ── 1. Gom ─────────────────────────────────────────────────────────────────────────────────────────────
export function gom(ungVien, { now, cuaSoPhut }) {
  if (!ungVien.length) return { khoi_hanh: false, gio_khoi_hanh: null, thanh_vien: [], cho: [] };
  const ds = [...ungVien].sort((a, b) => Date.parse(a.dat_luc) - Date.parse(b.dat_luc) || a.pr - b.pr);
  const gio = Date.parse(ds[0].dat_luc) + cuaSoPhut * PHUT;
  return {
    khoi_hanh: Date.parse(now) >= gio,
    gio_khoi_hanh: new Date(gio).toISOString(),
    thanh_vien: ds.filter((x) => Date.parse(x.dat_luc) <= gio).map((x) => x.pr),
    cho: ds.filter((x) => Date.parse(x.dat_luc) > gio).map((x) => x.pr),
  };
}

// ── 4. Tách đôi ────────────────────────────────────────────────────────────────────────────────────────
// `kiem(tiềnTố)` → true khi nhánh chính + các PR ấy xanh. Bất biến: tiền tố rỗng xanh (nhánh chính), tiền tố `hi` đỏ.
export const LY_DO_DO = 'làm chuyến đỏ — lệnh kiểm trên ngọn thoát khác 0 khi có PR này';
export function tachDoi(ds, kiem) {
  const con = [...ds]; const rot = []; let n = 0;
  const k = (x) => { n++; return kiem(x); };
  while (con.length) {
    if (k(con)) return { xanh: con, rot, so_lan_kiem: n };
    let lo = 0; let hi = con.length;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (k(con.slice(0, mid))) lo = mid; else hi = mid; }
    rot.push({ pr: con[hi - 1], ly_do: LY_DO_DO });
    con.splice(hi - 1, 1);
  }
  return { xanh: [], rot, so_lan_kiem: n };
}

// ── 2–3. Dựng chuyến trong worktree tạm, chạy lệnh kiểm ───────────────────────────────────────────────
const GIT_DANH = ['-c', 'user.name=chuyen-gop', '-c', 'user.email=chuyen-gop@localhost', '-c', 'commit.gpgsign=false'];
function trongWorktreeTam(io, dinh, viec) {
  const thu = fs.mkdtempSync(path.join(os.tmpdir(), 'chuyen-gop-'));
  try {
    io.chay('git', ['worktree', 'add', '-q', '--detach', thu, dinh]);
    return viec(thu);
  } finally {
    try { io.chay('git', ['worktree', 'remove', '--force', thu]); } catch { /* đã gỡ */ }
    fs.rmSync(thu, { recursive: true, force: true });
  }
}
// Gộp lần lượt; PR xung đột rớt (gộp dở được huỷ). Trả danh sách vào + rớt.
function dungChuyen(io, dinh, ds, sha, lenhKiem = null) {
  return trongWorktreeTam(io, dinh, (thu) => {
    const vao = []; const rot = [];
    for (const pr of ds) {
      try {
        io.chay('git', [...GIT_DANH, '-C', thu, 'merge', '--no-ff', '--no-edit', '-q', sha[pr]]);
        vao.push(pr);
      } catch {
        try { io.chay('git', ['-C', thu, 'merge', '--abort']); } catch { /* không có gộp dở */ }
        rot.push({ pr, ly_do: `xung đột khi gộp vào chuyến (sau #${vao.length ? vao[vao.length - 1] : 'đỉnh nhánh chính'}) — gộp nhánh chính vào nhánh, gỡ xung đột rồi xếp chuyến sau` });
      }
    }
    let xanh = null;
    if (lenhKiem != null) {
      try { execFileSync('bash', ['-c', lenhKiem], { cwd: thu, stdio: 'ignore', timeout: 60 * PHUT }); xanh = true; } catch { xanh = false; }
    }
    return { vao, rot, xanh };
  });
}

// ── Lõi một chuyến (không đọc thư mục đợt — lệnh `chuyen` ở dưới bọc khoá và sự kiện) ──────────────────
// prs: số PR ứng viên. Trả { duong: cho|da-gop|gop-duoc|khong-co, thanh_vien, xanh, rot, ngoai, so_lan_kiem, ... }.
export function chayChuyen({ io, cfg, prs, now = new Date().toISOString(), xet = false, ngay = false }) {
  const c = cfg.chuyen_gop;
  if (!c || c.bat !== true) throw new Error('chuyen: chuyến gộp tắt (chuyen_gop.bat trong dieu-phoi.config.json) — gộp từng PR bằng `gop <số PR>`');
  const git = (args) => io.chay('git', args);
  const nhanh = cfg.nhanh_chinh;
  git(['fetch', '-q', 'origin', nhanh]);
  const dinh = git(['rev-parse', `origin/${nhanh}`]).trim();
  const ngoai = []; const ungVien = []; const sha = {};
  for (const pr of prs) {
    const v = JSON.parse(io.chay('gh', ['pr', 'view', String(pr), '--json', 'number,state,isDraft,mergeable,headRefOid,headRefName,baseRefName,statusCheckRollup']));
    if (v.state !== 'OPEN') { ngoai.push({ pr, ly_do: `PR không mở (${v.state})` }); continue; }
    if (v.isDraft) { ngoai.push({ pr, ly_do: 'PR còn nháp' }); continue; }
    if (v.baseRefName !== nhanh) { ngoai.push({ pr, ly_do: `PR nhắm nhánh ${v.baseRefName}, không phải ${nhanh}` }); continue; }
    const ci = ciXanh(v.statusCheckRollup);
    if (!ci.xanh) { ngoai.push({ pr, ly_do: ci.ly_do }); continue; }
    git(['fetch', '-q', 'origin', v.headRefName]);
    const s = v.headRefOid; const mb = git(['merge-base', s, dinh]).trim();
    const hoSo = [...new Set(dong(git(['diff', '--name-only', '--no-renames', mb, s])).map((t) => (/^_acceptance\/([^/]+)\/contract\.md$/.exec(t) || [])[1]).filter(Boolean))];
    if (hoSo.length !== 1) { ngoai.push({ pr, ly_do: hoSo.length ? `PR chạm ${hoSo.length} hợp đồng (${hoSo.join(', ')}) — không suy được hồ sơ` : 'PR không chạm hợp đồng nào — không suy được hồ sơ' }); continue; }
    const slug = hoSo[0];
    let st = null; try { st = trangThaiHopDong(git(['show', `${s}:_acceptance/${slug}/contract.md`])); } catch { st = null; }
    if (!DA_THONG.includes(st)) { ngoai.push({ pr, ly_do: `hồ sơ ${slug} trên đầu PR ở «${st ?? 'không có'}» — chưa ký, chưa thông` }); continue; }
    const cp = xetCuaProof({ io, sha: s, dinh, mb, slug, rollup: v.statusCheckRollup });
    if (!cp.qua) { ngoai.push({ pr, ly_do: cp.ly_do }); continue; }
    sha[pr] = s;
    ungVien.push({ pr, slug, dat_luc: git(['log', '-1', '--format=%aI', s, '--', `_acceptance/${slug}/contract.md`]).trim() });
  }
  const g = gom(ungVien, { now, cuaSoPhut: c.cua_so_phut ?? 60 });
  const co = { thanh_vien: g.thanh_vien, cho: g.cho, ngoai, gio_khoi_hanh: g.gio_khoi_hanh };
  if (!g.thanh_vien.length) return { duong: 'khong-co', ...co, xanh: [], rot: [], so_lan_kiem: 0, ly_do: 'không PR nào đủ điều kiện vào chuyến' };
  if (!g.khoi_hanh && !ngay) return { duong: 'cho', ...co, xanh: [], rot: [], so_lan_kiem: 0, ly_do: `chuyến khởi hành lúc ${g.gio_khoi_hanh}` };
  const dung = dungChuyen(io, dinh, g.thanh_vien, sha);
  const memo = new Map();
  const kiem = (tienTo) => {
    const k = tienTo.join(',');
    if (!memo.has(k)) memo.set(k, dungChuyen(io, dinh, tienTo, sha, c.lenh_kiem).xanh);
    return memo.get(k);
  };
  const td = tachDoi(dung.vao, kiem);
  const rot = [...dung.rot, ...td.rot];
  if (!td.xanh.length) return { duong: 'khong-co', ...co, xanh: [], rot, so_lan_kiem: td.so_lan_kiem, ly_do: 'mọi PR của chuyến rớt' };
  if (xet) return { duong: 'gop-duoc', ...co, xanh: td.xanh, rot, so_lan_kiem: td.so_lan_kiem, ly_do: `ngọn chuyến xanh với ${td.xanh.length} PR` };
  for (const pr of td.xanh) io.chay('gh', ['pr', 'merge', String(pr), '--merge', '--match-head-commit', sha[pr]]);
  return { duong: 'da-gop', ...co, xanh: td.xanh, rot, so_lan_kiem: td.so_lan_kiem, ly_do: `đã gộp chuyến ${td.xanh.length} PR, ${rot.length} rớt` };
}

const IO_THAT = (cwd) => ({ chay: (cmd, args) => execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120_000 }) });

// Lệnh `chuyen <số PR,số PR,…> [--xet] [--ngay]`: như `gop`, thợ giữ khoá merge và đợt cho tự gộp; `--xet` chỉ in quyết
// định. Mỗi lần chạy ghi một sự kiện `chuyen` (lệnh đếm đọc).
export function chuyen(cwd, danhSach, { xet = false, ngay = false, io = IO_THAT(cwd), now } = {}) {
  const prs = String(danhSach ?? '').split(',').map((x) => x.trim()).filter(Boolean);
  if (!prs.length || !prs.every((x) => /^\d+$/.test(x))) throw new Error('chuyen: dùng `chuyen <số PR>,<số PR>,… [--xet] [--ngay]`');
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) throw new Error('chuyen: không có đợt nào đang chạy');
  const cfg = docCauHinh(thuMuc);
  const day = phienCuaCwd(docHangViec(thuMuc), cwd);
  const chu = docJson(path.join(thuMuc, 'khoa', 'merge', 'chu.json'), null);
  if (!xet) {
    if (!day) throw new Error('chuyen: cwd không thuộc dãy nào của đợt — chạy từ worktree của dãy, hoặc dùng --xet');
    if (chu?.phien !== day) throw new Error(`chuyen: khoá merge không do ${day} giữ (${chu?.phien ?? 'trống'}) — xin lượt merge trước`);
    if (docPha(thuMuc).tu_merge !== true) throw new Error('chuyen: đợt không cho tự gộp (tu_merge) — bấm gộp là của người; dùng --xet để xem quyết định');
  }
  const kq = chayChuyen({ io, cfg, prs: prs.map(Number), xet, ngay, ...(now ? { now } : {}) });
  const nhaMerge = kq.duong === 'da-gop' && chu?.phien === day;
  if (nhaMerge) fs.rmSync(path.join(thuMuc, 'khoa', 'merge'), { recursive: true, force: true });
  ghiSuKien(thuMuc, { loai: 'chuyen', phien: day, duong: kq.duong, thanh_vien: kq.thanh_vien, xanh: kq.xanh, rot: kq.rot, ngoai: kq.ngoai, so_lan_kiem: kq.so_lan_kiem, ly_do: kq.ly_do });
  return { ...kq, nha_merge: nhaMerge };
}

export const maThoatChuyen = (kq) => (kq.duong === 'da-gop' || kq.duong === 'gop-duoc' ? 0 : kq.duong === 'cho' ? 4 : 1);
