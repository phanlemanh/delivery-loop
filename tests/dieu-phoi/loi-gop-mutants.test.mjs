// Hồ sơ loi-gop-trong-cau-ky (E10) — chiều đỏ của bộ «GL-» NẰM TRONG bộ kiểm. Mỗi nhát tiêm chạy trên một bản sao trong
// thư mục tạm (trọn `plugins/dispatch`, các tệp luật và khối dòng lệnh bộ «GL-» rút, và chính tệp ca): (a) bản sao CHƯA
// tiêm xanh trên tệp ca (LGM-M0); (b) mũi tiêm khớp ĐÚNG MỘT lần, không thì «mui tiem truot»; (c) tệp ca đỏ và ĐÚNG các
// ca được nêu tên đỏ — không chỉ «mã thoát khác 0». Ba nhát không phải vật phải để bộ «GL-» xanh nguyên.
// Các lượt chạy con khởi động ngay khi nạp tệp và chạy song song có trần; mỗi ca chỉ chờ kết quả của lượt mình.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const TEP_CA = 'tests/dieu-phoi/loi/gop-theo-loi.test.mjs';
const GOP = 'plugins/dispatch/scripts/gop.mjs';
const CHEP = [
  'plugins/dispatch',
  'plugins/feature-loop/scripts',
  'plugins/feature-loop/workflows',
  'plugins/feature-loop/skills/feature-loop/SKILL.md',
  'plugins/acceptance-gate/commands/signoff.md',
  // Vế chữ ký đọc bằng `chuKyThat` của lõi (hồ sơ va-chu-ky-giu-cho-lenh-gop): bản sao mang lõi ở bố cục nguồn.
  'plugins/acceptance-gate/lib',
  'plugins/acceptance-gate/skills/acceptance/references/human-facing-language.md',
  TEP_CA,
];
function banSao() {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'lgm-')));
  for (const p of CHEP) fs.cpSync(path.join(GOC, p), path.join(d, p), { recursive: true });
  return d;
}
// Thay nguyên văn đúng MỘT chỗ; mũi khớp 0 hay nhiều lần là nhát đã lỗi thời.
function tiem(d, tep, goc, moi) {
  const p = path.join(d, tep);
  const t = fs.readFileSync(p, 'utf8');
  const lan = t.split(goc).length - 1;
  if (lan !== 1) throw new Error(`mui tiem truot: «${goc}» khớp ${lan} lần trong ${tep}`);
  const sau = t.replace(goc, () => moi);
  if (sau === t) throw new Error(`mui tiem truot: tiêm không đổi ${tep}`);
  fs.writeFileSync(p, sau);
}
// Bỏ NODE_TEST_CONTEXT của trình chạy cha: còn biến ấy thì tiến trình con chỉ báo về cha, không in ✔/✖ — mọi lượt trông
// «xanh» mà không ca nào chạy. Bỏ luôn biến nhịp chờ để lượt con chạy đúng mặc định của nó.
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT' && k !== 'DIEU_PHOI_NHIP_CHO_MS'));
const chayCa = (d) =>
  new Promise((xong) => {
    execFile(process.execPath, ['--test', '--test-reporter=spec', TEP_CA], { cwd: d, encoding: 'utf8', timeout: 900_000, maxBuffer: 64 * 1024 * 1024, env: ENV }, (loi, stdout, stderr) => {
      xong({ status: loi ? (typeof loi.code === 'number' ? loi.code : 1) : 0, stdout: String(stdout), stderr: String(stderr) });
    });
  });
const doCa = (out) => [...out.matchAll(/^✖ (GL-\d+[a-z]?) /gm)].map((m) => m[1]).filter((x, i, a) => a.indexOf(x) === i).sort();
const soXanh = (out) => Number(/^ℹ pass (\d+)$/m.exec(out)?.[1] ?? -1);
const soDo = (out) => Number(/^ℹ fail (\d+)$/m.exec(out)?.[1] ?? -1);

// Hàng chờ có trần: mỗi lượt con dựng hơn hai chục kho git, chạy hết cùng lúc thì nghẽn máy.
const TRAN = Math.max(2, Math.min(6, Math.floor(os.availableParallelism() / 2)));
let dangChay = 0;
const cho = [];
function xepHang(viec) {
  return new Promise((xong) => {
    const chay = async () => {
      dangChay += 1;
      let kq;
      try {
        kq = await viec();
      } catch (e) {
        kq = { loi: e };
      }
      dangChay -= 1;
      cho.shift()?.();
      xong(kq);
    };
    if (dangChay < TRAN) chay();
    else cho.push(chay);
  });
}
const luot = (sua) =>
  xepHang(async () => {
    const d = banSao();
    sua?.(d);
    return chayCa(d);
  });

// [tên nhát, tệp, chuỗi gốc, chuỗi tiêm, các ca «GL-» phải đỏ]
const NHAT = [
  ['dong-dau — bên đọc lấy dòng ĐẦU', GOP, "Object.hasOwn(o, 'loi_gop')) cuoi = o;", "Object.hasOwn(o, 'loi_gop')) cuoi ??= o;", ['GL-5c', 'GL-6d']],
  ['lui-dong-cu — dòng cuối không đạt thì lùi về dòng cũ', GOP, "Object.hasOwn(o, 'loi_gop')) cuoi = o;", "Object.hasOwn(o, 'loi_gop') && docCau(o.loi_gop?.cau).co_loi_gop) cuoi = o;", ['GL-5c', 'GL-6b', 'GL-6d']],
  ['bo-doc-lai-cau — bên đọc tin dòng sổ, không đọc lại câu', GOP, 'const kq = docCau(cau);', 'const kq = { co_loi_gop: true, ly_do: null };', ['GL-5c', 'GL-6b', 'GL-6d']],
  ['chi-ky-tran — chỉ nhận vế ký trần «Ký»', GOP, 'const VE_KY = /^ký(\\s*:.*)?(\\s*,\\s*phút\\s*\\d+)?$/;', 'const VE_KY = /^ký$/;', ['GL-5a', 'GL-5b']],
  ['thieu-mot-dang — gỡ «gộp khi xanh» khỏi hằng bên đọc', GOP, "'gộp: khi xanh', 'gộp khi xanh'],", "'gộp: khi xanh'],", ['GL-5a', 'GL-5b', 'GL-6d']],
  ['bo-chua-gop-thang — có vế gộp là đủ dù có vế chưa gộp', GOP, "if (!loi.includes('gop') || loi.includes('chua-gop')) return", "if (!loi.includes('gop')) return", ['GL-5a']],
  ['bo-buoc-chu-ky — bỏ phép buộc cùng commit với chữ ký', GOP, 'if (!cDong || cDong !== cKy) return', 'if (false) return', ['GL-6b', 'GL-6e']],
  ['bo-khoa-kho — bỏ kiểm khoá kho', GOP, "if (!khoaGopTheoLoi(doc('_acceptance/config.yaml'))) return", 'if (false) return', ['GL-6b', 'GL-6c']],
  ['nhan-may-thong — nhận hồ sơ máy đã thông', GOP, 'if (st !== DA_KY_NGUOI) return', 'if (!DA_THONG.includes(st)) return', ['GL-6b']],
  ['bo-chu-ky — bỏ kiểm chữ ký người', GOP, 'if (!chuKy) return', 'if (false) return', ['GL-6b']],
  ['giu-cho-la-ky — vế chữ ký coi giá trị giữ chỗ là chữ ký', GOP, 'if (!ck.signed) return', 'if (!ck.signed && !ck.placeholder) return', ['GL-6b', 'GL-6k']],
  ['doc-cay-lam-viec — đọc cây làm việc thay đầu nhánh', GOP, "return io.chay('git', ['show', `${sha}:${tep}`]);", "return io.chay('cat', [tep]);", ['GL-6g']],
  ['them-auto — lệnh gộp thêm --auto', GOP, "'--match-head-commit', kq.sha]);", "'--match-head-commit', kq.sha, '--auto']);", ['GL-6a', 'GL-6g', 'GL-6h', 'GL-6i', 'GL-8b']],
  ['gop-khi-dang-chay — gộp khi check còn chạy', GOP, 'if (!ci.xanh) return', 'if (false) return', ['GL-8b', 'GL-8c', 'GL-8d', 'GL-8e']],
  ['khong-co-bo-doi-dot — lệnh không cờ thôi đòi đợt', GOP, "  if (!thuMuc) throw new Error('gop: không có đợt nào đang chạy');\n", '', ['GL-7']],
];
// Chạm thứ KHÔNG phải vật: bộ «GL-» phải im (xanh nguyên, đủ số ca).
const IM = [
  ['im-dong-so-thuong — thêm một dòng sổ `fix` không mang loi_gop vào hồ sơ thử', TEP_CA, 'const DONG_SO_THEM = [];', 'const DONG_SO_THEM = [\'{"id":"d-20261121T101600Z-9","type":"fix","stage":"S4","at":"2026-11-21T10:16:00Z","decision":"Sửa chữ một thông điệp","why":"Lệch chữ","cost_if_wrong":"Không đáng kể"}\'];'],
  ['im-chu-thich — thêm một chú thích vào gop.mjs', GOP, 'export const GOP_DUOC = ', '// Một dòng chú thích thêm, không đổi hành vi.\nexport const GOP_DUOC = '],
  ['im-tai-lieu — sửa chữ một tệp .md của gói', 'plugins/dispatch/README.md', 'Gộp dưới khoá merge', 'Gộp khi giữ khoá merge'],
];

const viecM0 = luot(null);
const viecNhat = NHAT.map(([, tep, goc, moi]) => luot((d) => tiem(d, tep, goc, moi)));
const viecIm = IM.map(([, tep, goc, moi]) => luot((d) => tiem(d, tep, goc, moi)));
const SO_CA_GL = 20;

// Đối chứng dương dùng chung: mọi nhát chỉ đáng tin khi bản sao chưa tiêm đã xanh trên đúng tệp ca ấy.
async function lanh() {
  const r = await viecM0;
  if (r.loi) throw r.loi;
  assert.equal(r.status, 0, `đối chứng dương đỏ — bản sao CHƯA tiêm không xanh:\n${r.stdout.slice(-3000)}${r.stderr.slice(-1000)}`);
  assert.equal(soDo(r.stdout), 0, r.stdout.slice(-2000));
  assert.equal(soXanh(r.stdout), SO_CA_GL, `bản sao chưa tiêm phải chạy đủ ${SO_CA_GL} ca «GL-»`);
  return r;
}

test('LGM-M0 đối chứng dương: bản sao trọn gói điều phối CHƯA tiêm chạy bộ «GL-» xanh, đủ số ca', async () => {
  const r = await lanh();
  assert.deepEqual(doCa(r.stdout), []);
});

NHAT.forEach(([ten, , , , doMong], i) => {
  test(`LGM-${ten} → đỏ đúng ${doMong.join(', ')}`, async () => {
    await lanh();
    const r = await viecNhat[i];
    if (r.loi) throw r.loi;
    assert.notEqual(r.status, 0, `phep do mu: ${ten} — tệp ca vẫn xanh trên bản đã tiêm`);
    assert.deepEqual(doCa(r.stdout), [...doMong].sort(), r.stdout.slice(-3000));
  });
});

IM.forEach(([ten], i) => {
  test(`LGM-${ten} → bộ «GL-» vẫn xanh`, async () => {
    await lanh();
    const r = await viecIm[i];
    if (r.loi) throw r.loi;
    assert.equal(r.status, 0, `${ten}: bộ «GL-» đỏ vì thứ không phải vật:\n${r.stdout.slice(-3000)}`);
    assert.deepEqual([soXanh(r.stdout), soDo(r.stdout), doCa(r.stdout)], [SO_CA_GL, 0, []]);
  });
});

test('LGM-mui-truot mũi tiêm khớp 0 hay nhiều lần thì ném «mui tiem truot», không lặng lẽ chạy trên bản lành', () => {
  const d = banSao();
  assert.throws(() => tiem(d, GOP, 'chuỗi này không có trong tệp', 'x'), /mui tiem truot: .* khớp 0 lần/);
  assert.throws(() => tiem(d, GOP, 'return', 'x'), /mui tiem truot: .* khớp \d+ lần/);
  tiem(d, GOP, 'export const GOP_DUOC = ', 'export const GOP_DUOC =  ');
  assert.ok(fs.readFileSync(path.join(d, GOP), 'utf8').includes('export const GOP_DUOC =  ['));
});
