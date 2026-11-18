// chay-thu.mjs — ca «chạy thử phiên thật» trong thước của B1 (chủ kho thêm 12/11).
//
// Câu nó trả lời: một máy chỉ có chợ plugin dựng từ CÂY này, cài đủ plugin của chợ, mở một phiên Claude Code thật —
// phiên ấy NẠP được những plugin, lệnh, skill và tác tử nào. Ba lớp, đọc theo thứ tự:
//   1. tĩnh    — `claude plugin validate` trên tệp khai chợ và thư mục nguồn của từng plugin;
//   2. cài     — thư mục cấu hình TẠM (CLAUDE_CONFIG_DIR), thêm chợ từ cây, cài từng plugin, đọc `plugin list --json`;
//   3. nạp     — `claude -p --output-format stream-json` trong một kho trống, đọc sự kiện `init`: danh sách thật mà
//                Claude Code đã nạp. Thư mục cấu hình tạm không có đăng nhập và kịch bản gỡ mọi biến khoá API khỏi
//                môi trường con, nên phiên dừng ở «Not logged in» SAU sự kiện `init` — không có lượt gọi model nào.
//                Phiên báo tốn tiền khác 0 là lỗi đo, không phải kết quả.
// Cài đặt thật của máy không bị chạm: mọi thứ ghi vào thư mục tạm, xoá khi xong.
//
// Dùng:  node chay-thu.mjs (--cay <thư mục> | --ref <mã|nhánh> [--kho <git>]) [--ra <tệp.json>]
//        node chay-thu.mjs --so <cũ.json> <mới.json> [--bang-ten <bang-ten.json>]
// Đầu ra không chứa đường dẫn hay giờ chạy: hai lần chạy trên cùng cây ra cùng tệp.
// Kiểm hai chiều: chay-thu.test.mjs cạnh tệp này.
//
// Giới hạn đã khai: lớp 3 thấy plugin, lệnh, skill, tác tử đã NẠP; nó không thấy móc (hook) có bắn đúng lúc không —
// phần đó do bộ kiểm hooks của kit giữ (hooks 71 ca) và lớp 1 kiểm tệp khai móc hợp lệ.

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BIEN_KHOA = ['ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN', 'CLAUDE_CODE_OAUTH_TOKEN', 'CLAUDE_CODE_USE_BEDROCK',
  'CLAUDE_CODE_USE_VERTEX'];

export function moiTruongTach(cauHinh) {
  const env = { ...process.env, CLAUDE_CONFIG_DIR: cauHinh };
  for (const k of BIEN_KHOA) delete env[k];
  return env;
}

function chay(lenh, args, { env, cwd } = {}) {
  const r = spawnSync(lenh, args, { env, cwd, input: '', encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.error) throw new Error(`chay-thu: không chạy được «${lenh}»: ${r.error.message}`);
  return { ma: r.status, ra: r.stdout, loi: r.stderr };
}

function docCho(cay) {
  const tep = path.join(cay, '.claude-plugin', 'marketplace.json');
  if (!fs.existsSync(tep)) throw new Error(`chay-thu: cây không có tệp khai chợ (${path.relative(cay, tep)})`);
  const d = JSON.parse(fs.readFileSync(tep, 'utf8'));
  if (!d.name || !Array.isArray(d.plugins) || d.plugins.length === 0) {
    throw new Error('chay-thu: tệp khai chợ thiếu name hoặc plugins');
  }
  return { ten: d.name, plugin: d.plugins.map(p => ({ ten: p.name, nguon: typeof p.source === 'string' ? p.source : null })) };
}

function lopTinh(cay, cho, env) {
  const ket = { cho: chay('claude', ['plugin', 'validate', '.'], { env, cwd: cay }).ma === 0, plugin: {} };
  for (const p of cho.plugin) {
    if (!p.nguon) { ket.plugin[p.ten] = 'nguon-khong-phai-thu-muc'; continue; }
    const r = chay('claude', ['plugin', 'validate', p.nguon], { env, cwd: cay });
    ket.plugin[p.ten] = r.ma === 0 ? 'hop-le' : 'khong-hop-le';
  }
  return ket;
}

function lopCai(cay, cho, env) {
  const them = chay('claude', ['plugin', 'marketplace', 'add', cay], { env });
  if (them.ma !== 0) return { them_cho: false, cai: {}, da_cai: [] };
  const cai = {};
  for (const p of cho.plugin) {
    cai[p.ten] = chay('claude', ['plugin', 'install', `${p.ten}@${cho.ten}`, '--scope', 'user'], { env }).ma === 0;
  }
  const ds = chay('claude', ['plugin', 'list', '--json'], { env });
  let da = [];
  try {
    const j = JSON.parse(ds.ra);
    da = (Array.isArray(j) ? j : j.plugins || [])
      .filter(x => String(x.id || '').endsWith(`@${cho.ten}`))
      .map(x => ({ id: x.id, phien_ban: x.version ?? null, bat: x.enabled === true }));
  } catch { da = []; }
  return { them_cho: true, cai, da_cai: da.sort((a, b) => a.id.localeCompare(b.id)) };
}

function lopNap(cho, env, khoTrong) {
  const r = chay('claude', ['-p', 'ok', '--output-format', 'stream-json', '--verbose', '--max-turns', '1'],
    { env, cwd: khoTrong });
  let init = null;
  let tien = 0;
  for (const dong of r.ra.split('\n')) {
    let e;
    try { e = JSON.parse(dong); } catch { continue; }
    if (e.type === 'system' && e.subtype === 'init') init = e;
    if (e.type === 'result') tien = Number(e.total_cost_usd || 0);
  }
  if (!init) throw new Error(`chay-thu: phiên không phát sự kiện init (mã ${r.ma}): ${r.loi.slice(0, 300)}`);
  if (tien !== 0) throw new Error(`chay-thu: phiên đã gọi model (tốn ${tien} USD) — môi trường tách không kín, dừng đo`);
  const cuaCho = new Set((init.plugins || []).filter(p => String(p.source || '').endsWith(`@${cho.ten}`)).map(p => p.name));
  const thuoc = ten => ten.includes(':') && cuaCho.has(ten.split(':')[0]);
  const xep = a => [...new Set(a)].sort();
  return {
    plugin: xep([...cuaCho]),
    phien_ban: Object.fromEntries((init.plugins || []).filter(p => cuaCho.has(p.name)).map(p => [p.name, p.version ?? null])
      .sort((a, b) => a[0].localeCompare(b[0]))),
    lenh: xep((init.slash_commands || []).filter(thuoc)),
    tac_tu: xep((init.agents || []).filter(thuoc)),
  };
}

/** Đo một cây. Trả đối tượng không chứa đường dẫn hay giờ chạy. */
export function chayThu({ cay }) {
  const goc = path.resolve(cay);
  const cho = docCho(goc);
  const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'chay-thu-'));
  try {
    const cauHinh = path.join(tam, 'cau-hinh');
    const khoTrong = path.join(tam, 'kho');
    fs.mkdirSync(cauHinh);
    fs.mkdirSync(khoTrong);
    execFileSync('git', ['init', '-q'], { cwd: khoTrong });
    const env = moiTruongTach(cauHinh);
    const tinh = lopTinh(goc, cho, env);
    const cai = lopCai(goc, cho, env);
    const nap = cai.them_cho ? lopNap(cho, env, khoTrong) : { plugin: [], phien_ban: {}, lenh: [], tac_tu: [] };
    return { cho: cho.ten, plugin_khai: cho.plugin.map(p => p.ten).sort(), tinh, cai, nap };
  } finally {
    fs.rmSync(tam, { recursive: true, force: true });
  }
}

/** Dựng cây từ một mã commit vào thư mục tạm; người gọi xoá. */
export function dungCay({ kho, ref }) {
  // `git archive` chạy trong thư mục con chỉ xuất cây con — luôn xuất từ gốc kho.
  const goc = execFileSync('git', ['-C', kho, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  const dich = fs.mkdtempSync(path.join(os.tmpdir(), 'chay-thu-cay-'));
  const tar = execFileSync('git', ['-C', goc, 'archive', ref], { maxBuffer: 512 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', dich], { input: tar });
  return dich;
}

function doiTen(ten, bang) {
  if (bang.lenh && bang.lenh[ten]) return bang.lenh[ten];
  const [p, ...con] = ten.split(':');
  const pMoi = (bang.plugin && bang.plugin[p]) || p;
  return con.length ? `${pMoi}:${con.join(':')}` : pMoi;
}

/**
 * So kết quả đo của cây cũ với cây mới qua bảng tên (mục 3 của KE-HOACH). Thước của B1: `mat` và `thua` rỗng ở cả bốn
 * nhóm, và mọi plugin khai trong chợ mới đều qua lớp tĩnh và lớp cài.
 */
export function soSanh(cu, moi, bang = {}) {
  const ket = {};
  for (const nhom of ['plugin', 'lenh', 'tac_tu']) {
    const ky = new Set(cu.nap[nhom].map(t => doiTen(t, bang)));
    const that = new Set(moi.nap[nhom]);
    ket[nhom] = { mat: [...ky].filter(t => !that.has(t)).sort(), thua: [...that].filter(t => !ky.has(t)).sort() };
  }
  const hong = [];
  for (const [p, v] of Object.entries(moi.tinh.plugin)) if (v !== 'hop-le') hong.push(`tĩnh: ${p} ${v}`);
  if (!moi.tinh.cho) hong.push('tĩnh: tệp khai chợ không hợp lệ');
  if (!moi.cai.them_cho) hong.push('cài: không thêm được chợ');
  for (const [p, v] of Object.entries(moi.cai.cai)) if (!v) hong.push(`cài: ${p} không cài được`);
  ket.hong = hong;
  ket.dat = hong.length === 0 && ['plugin', 'lenh', 'tac_tu'].every(n => ket[n].mat.length === 0 && ket[n].thua.length === 0);
  return ket;
}

function main(argv) {
  const lay = k => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
  if (argv.includes('--so')) {
    const i = argv.indexOf('--so');
    const doc = f => JSON.parse(fs.readFileSync(f, 'utf8'));
    const bang = lay('--bang-ten') ? doc(lay('--bang-ten')) : {};
    const k = soSanh(doc(argv[i + 1]), doc(argv[i + 2]), bang);
    process.stdout.write(JSON.stringify(k, null, 2) + '\n');
    process.exit(k.dat ? 0 : 1);
  }
  let cay = lay('--cay');
  let tamCay = null;
  if (!cay) {
    const ref = lay('--ref');
    if (!ref) { process.stderr.write('chay-thu: cần --cay <thư mục> hoặc --ref <mã>\n'); process.exit(2); }
    const kho = lay('--kho') || path.dirname(fileURLToPath(import.meta.url));
    tamCay = dungCay({ kho, ref });
    cay = tamCay;
  }
  try {
    const kq = chayThu({ cay });
    const chu = JSON.stringify(kq, null, 2) + '\n';
    if (lay('--ra')) fs.writeFileSync(lay('--ra'), chu); else process.stdout.write(chu);
  } finally {
    if (tamCay) fs.rmSync(tamCay, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
