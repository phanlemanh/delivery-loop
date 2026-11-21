// Hồ sơ loi-gop-trong-cau-ky — bên đọc lời gộp và lối vào `--theo-loi` của lệnh gộp (E6, E7, E8; phần bên đọc của E5).
// Kho git THẬT dựng trong lượt (origin trần + bản kéo); chỉ `gh` là giả. Danh sách đóng, khuôn dòng sổ và khối dòng lệnh
// RÚT bằng marker từ tệp thật của cây đang kiểm (đường suy từ vị trí tệp ca) — không chép tay.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DANG_LOI_GOP, docCau, docLoiGop, gop, maThoatGop } from '../../../plugins/dispatch/scripts/gop.mjs';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const TEP_LUAT = 'plugins/acceptance-gate/skills/acceptance/references/human-facing-language.md';
const TEP_KY = 'plugins/acceptance-gate/commands/signoff.md';
const LENH = path.join(GOC, 'plugins', 'dispatch', 'scripts', 'dieu-phoi.mjs');
// Trạng thái ký người dựng bằng ghép chuỗi: tệp ca không mang chuỗi ấy viết liền (lưới RT13).
const DA_KY = ['signed', 'off'].join('-');
const MAY_THONG = 'machine-cleared';

const tam = (dau = 'dp-gtl-') => fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), dau)));
const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ghi = (kho, tep, noi) => {
  fs.mkdirSync(path.dirname(path.join(kho, tep)), { recursive: true });
  fs.writeFileSync(path.join(kho, tep), noi);
};
const chot = (kho, msg) => {
  git(kho, 'add', '-A');
  git(kho, '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', msg);
};

// ── Rút khối bằng marker ────────────────────────────────────────────────────────────────────────────────────────
function rutKhoi(tep, ten) {
  const t = fs.readFileSync(path.join(GOC, tep), 'utf8');
  const m = new RegExp(`<!-- <<<${ten} -->\\n([\\s\\S]*?)\\n<!-- ${ten}>>> -->`).exec(t);
  assert.ok(m, `${tep}: khối ${ten} rút rỗng`);
  return m[1].split('\n').filter((d) => d.trim() !== '' && !d.startsWith('```'));
}
const DIEN = { '<tên>': 'Manh Phan', '<ngày>': '2026-11-21', '<lý do>': 'chưa đạt' };
const dien = (s) => Object.entries(DIEN).reduce((a, [k, v]) => a.split(k).join(v), s);
// Mỗi dòng dạng của khối luật: «<dạng> → <lối>»; dòng định nghĩa «có-lời-gộp = …» đứng riêng.
function khoiLuat() {
  const dong = rutKhoi(TEP_LUAT, 'GATE-ONESHOT-GOP');
  const dang = dong.filter((d) => d.includes(' → ')).map((d) => {
    const i = d.lastIndexOf(' → ');
    return { dang: d.slice(0, i), loi: d.slice(i + 3).trim() };
  });
  return { dang, dinhNghia: dong.filter((d) => !d.includes(' → ')) };
}

// ── Dòng sổ điền từ khuôn của thân lệnh ký ──────────────────────────────────────────────────────────────────────
const trongChuoi = (s) => JSON.stringify(s).slice(1, -1);
// `quyet` là cách phiên ghi dòng HIỂU câu (ô `decision`) — mặc định «gộp khi CI xanh» kể cả khi câu không mang lời gộp,
// để ca thấy bên đọc đọc lại CÂU chứ không tin ô ấy.
function dongLoiGop(cau, { n = 3, luc = '2026-11-21T10:15:00Z', quyet = 'gộp khi CI xanh', khuon = rutKhoi(TEP_KY, 'LOI-GOP-GATE2-LINE') } = {}) {
  assert.equal(khuon.length, 1, 'khuôn dòng sổ phải đúng một dòng');
  const giua = khuon[0]
    .replace('<ISO>', () => luc)
    .replace('<gộp khi CI xanh | chưa gộp>', () => quyet)
    .replace('<tên>', () => 'Manh Phan')
    .replace(/<trọn câu[^>]*>/, () => trongChuoi(cau));
  const dong = `{"id":"d-${luc.replace(/[-:]/g, '')}-${n}",${giua}}`;
  const o = JSON.parse(dong);
  assert.equal(o.loi_gop?.cau, cau, 'khuôn điền xong không mang đúng câu');
  assert.ok(!/<ISO>|<tên>|<trọn câu|<gộp khi/.test(dong.replace(trongChuoi(cau), '')), 'khuôn còn chỗ trống chưa điền');
  return dong;
}
const DONG_THUONG = [
  '{"id":"d-20261120T080000Z-1","type":"approach","stage":"S1","at":"2026-11-20T08:00:00Z","decision":"Phiếu hai cột","why":"Gọn hơn","cost_if_wrong":"Sửa lại một tệp"}',
  '{"id":"d-20261121T090000Z-2","type":"revisit","stage":"gate2","at":"2026-11-21T09:00:00Z","decision":"Ngoài-1: nhận giới hạn","why":"Đảo rẻ","cost_if_wrong":"Một vòng sau","tieu_de":"Cột hẹp","tep":"apps/web/company-sheet.tsx"}',
];
const so = (...dong) => `${dong.join('\n')}\n`;
const CAU_DU = 'Ngoài-1: nhận giới hạn; gộp: khi CI xanh; ký hay trả: Ký';

// ── Kho thử ─────────────────────────────────────────────────────────────────────────────────────────────────────
const PHIEU = 'apps/web/company-sheet.tsx';
const HS = '_acceptance/s';
const hopDong = (st) => `---\nslug: s\nstatus: ${st}\nrisk_tier: T2\n---\n\n# Hợp đồng\n`;
const baoCao = (chuKy) => `---\nschema_version: 2\nfeature_slug: s\nverdict: PASS\nhuman_signoff:${chuKy ? ` ${chuKy}` : ''}\n---\n\n# Evidence Report: s\n`;
const cauHinh = (khoa) => `schema_version: 1\nfeature_loop:\n  ship_default: pr\n${khoa === null ? '' : `  gop_theo_loi_ky: ${khoa}\n`}  suite_keys:\n    - executors.test.a\nexecutors:\n  test:\n    a: "true"\n`;
// Dòng sổ thêm vào CÙNG commit chữ ký, đứng SAU dòng lời gộp — nhát «không phải vật» của bộ nhát tiêm sửa đúng dòng này.
const DONG_SO_THEM = [];

// Nhánh `feat`: sửa phiếu → lượt chấm (hợp đồng `verified`, báo cáo chưa ký, kho bật) → MỘT commit chữ ký mang hợp đồng
// đã ký, `human_signoff` và dòng lời gộp. `dongRieng`: dòng lời gộp ghi ở một commit sau commit chữ ký. `sau(k)`: thêm
// commit trước khi đẩy.
function khoLoi({ khoa = 'true', trangThai = DA_KY, chuKy = 'Manh Phan 2026-11-21', cau = CAU_DU, coDong = true, dongRieng = false, sau = null } = {}) {
  const goc = tam();
  const origin = path.join(goc, 'origin.git');
  git(goc, 'init', '-q', '--bare', '-b', 'main', origin);
  const k = path.join(goc, 'kho');
  git(goc, 'clone', '-q', origin, k);
  git(k, 'checkout', '-q', '-b', 'main');
  ghi(k, PHIEU, 'v1\n');
  chot(k, 'goc');
  git(k, 'push', '-q', 'origin', 'main');
  git(k, 'checkout', '-q', '-b', 'feat');
  ghi(k, PHIEU, 'hai cot\n');
  chot(k, 'phieu hai cot');
  ghi(k, `${HS}/contract.md`, hopDong('verified'));
  ghi(k, `${HS}/evidence-report.md`, baoCao(''));
  ghi(k, `${HS}/decisions.jsonl`, so(...DONG_THUONG));
  ghi(k, '_acceptance/config.yaml', cauHinh(khoa));
  chot(k, 'luot cham');
  const dong = coDong ? [dongLoiGop(cau)] : [];
  ghi(k, `${HS}/contract.md`, hopDong(trangThai));
  ghi(k, `${HS}/evidence-report.md`, baoCao(chuKy));
  if (!dongRieng) ghi(k, `${HS}/decisions.jsonl`, so(...DONG_THUONG, ...dong, ...DONG_SO_THEM));
  chot(k, 'chu ky cong bang chung');
  if (dongRieng) {
    ghi(k, `${HS}/decisions.jsonl`, so(...DONG_THUONG, ...dong, ...DONG_SO_THEM));
    chot(k, 'ghi dong loi gop sau');
  }
  if (sau) sau(k);
  git(k, 'push', '-q', 'origin', 'feat');
  return { k, goc, sha: git(k, 'rev-parse', 'HEAD') };
}

const XANH = [{ __typename: 'CheckRun', name: 'gate', status: 'COMPLETED', conclusion: 'SUCCESS' }, { __typename: 'StatusContext', context: 'ci/x', state: 'SUCCESS' }];
const xemPr = (sha, { rollup = XANH, them = {} } = {}) => JSON.stringify({ number: 7, state: 'OPEN', isDraft: false, mergeable: 'MERGEABLE', headRefOid: sha, headRefName: 'feat', baseRefName: 'main', statusCheckRollup: rollup, ...them });
// `gh` giả trong tiến trình: trả JSON của `gh pr view`, ghi lại mọi lời gọi.
function ioCua(k, sha, o = {}) {
  const goiGh = [];
  return {
    goiGh,
    merge: () => goiGh.filter((x) => x[0] === 'pr' && x[1] === 'merge'),
    chay: (cmd, args) => {
      if (cmd !== 'gh') return execFileSync(cmd, args, { cwd: k, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      goiGh.push(args);
      if (args[0] === 'pr' && args[1] === 'view') return xemPr(sha, o);
      return '';
    },
  };
}
const theoLoi = (a, them = {}) => {
  const io = ioCua(a.k, a.sha);
  const kq = gop(a.k, '7', { io, theoLoi: true, slug: 's', ...them });
  return { kq, io };
};
const khongGop = ({ kq, io }, re, nhan) => {
  assert.equal(kq.da_gop, false, nhan);
  assert.equal(io.merge().length, 0, `${nhan}: có lời gọi merge`);
  assert.equal(kq.duong, 'chan', `${nhan}: ${kq.ly_do}`);
  assert.equal(maThoatGop(kq), 1, nhan);
  assert.match(kq.ly_do, re, nhan);
};

// `gh` giả trên PATH (cho ca chạy dòng lệnh thật): ghi mỗi lời gọi một dòng vào `so.txt`; `pr view` lượt thứ n trả tệp
// `view-<n>.json`, không có thì `view-cuoi.json`; có tệp `loi` thì thoát 1 như gh không tìm thấy PR.
function ghGia() {
  const d = tam('dp-gh-');
  const bin = path.join(d, 'bin');
  fs.mkdirSync(bin);
  fs.writeFileSync(
    path.join(bin, 'gh'),
    [
      '#!/bin/bash',
      'printf \'%s\\n\' "$*" >> "$GH_GIA_DIR/so.txt"',
      'if [ -f "$GH_GIA_DIR/loi" ]; then echo "no pull requests found for branch" >&2; echo "(gh gia)" >&2; exit 1; fi',
      'if [ "$1" = pr ] && [ "$2" = view ]; then',
      '  n=$(grep -c "^pr view " "$GH_GIA_DIR/so.txt")',
      '  f="$GH_GIA_DIR/view-$n.json"',
      '  [ -f "$f" ] || f="$GH_GIA_DIR/view-cuoi.json"',
      '  cat "$f"',
      'fi',
      'exit 0',
      '',
    ].join('\n'),
    { mode: 0o755 },
  );
  const goi = () => (fs.existsSync(path.join(d, 'so.txt')) ? fs.readFileSync(path.join(d, 'so.txt'), 'utf8').split('\n').filter(Boolean) : []);
  return { d, bin, goi, merge: () => goi().filter((x) => x.startsWith('pr merge ')), xem: () => goi().filter((x) => x.startsWith('pr view ')), dat: (ten, noi) => fs.writeFileSync(path.join(d, ten), noi) };
}
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT'));

// ── GL-5: bên đọc ───────────────────────────────────────────────────────────────────────────────────────────────

test('GL-5a mỗi dạng của khối luật GATE-ONESHOT-GOP đi qua bên đọc ra đúng lối khối ghi; hằng bên đọc đúng sáu dạng lời gộp', () => {
  const { dang, dinhNghia } = khoiLuat();
  assert.equal(dang.length, 11, `khối luật phải có mười một dạng, rút được ${dang.length}`);
  assert.deepEqual(dang.map((d) => d.loi), ['gộp', 'gộp', 'gộp', 'gộp', 'chưa-gộp', 'chưa-gộp', 'chữ-ký', 'chữ-ký', 'chữ-ký', 'chữ-ký', 'trả-lại']);
  const GOP = 'gộp: khi CI xanh';
  for (const { dang: d0, loi } of dang) {
    const d = dien(d0);
    if (loi === 'gộp') {
      assert.deepEqual(docCau(`${d}; Ký`), { co_loi_gop: true, ly_do: null }, `dạng «${d0}» phải là lời gộp`);
      assert.match(docCau(d).ly_do, /không mang chữ ký/, `dạng «${d0}» một mình không phải vế ký`);
    } else if (loi === 'chưa-gộp') {
      assert.deepEqual(docCau(`${d}; Ký`), { co_loi_gop: false, ly_do: 'câu ghi không mang lời gộp' }, `dạng «${d0}»`);
      assert.deepEqual(docCau(`${GOP}; ${d}; Ký`), { co_loi_gop: false, ly_do: 'câu ghi không mang lời gộp' }, `dạng «${d0}»: chưa-gộp phải thắng`);
    } else if (loi === 'chữ-ký') {
      assert.deepEqual(docCau(`${GOP}; ${d}`), { co_loi_gop: true, ly_do: null }, `dạng «${d0}» phải là vế ký`);
      assert.deepEqual(docCau(d), { co_loi_gop: false, ly_do: 'câu ghi không mang lời gộp' }, `dạng «${d0}» một mình không phải lời gộp`);
    } else {
      assert.deepEqual(docCau(`${GOP}; ${d}`), { co_loi_gop: false, ly_do: 'câu ghi là trả lại' }, `dạng «${d0}»`);
      assert.deepEqual(docCau(`${GOP}; Ký; ${d}`), { co_loi_gop: false, ly_do: 'câu ghi là trả lại' }, `dạng «${d0}»: trả lại thắng chữ ký`);
    }
  }
  // Hằng của bên đọc là bản chép thứ ba của danh sách đóng: so nó với khối luật, hai chiều.
  const thuong = (loi) => dang.filter((x) => x.loi === loi).map((x) => x.dang.toLowerCase());
  assert.deepEqual(DANG_LOI_GOP, { gop: thuong('gộp'), chua: thuong('chưa-gộp') });
  // Dòng định nghĩa «có-lời-gộp»: bốn vế, mỗi vế một câu thử.
  assert.equal(dinhNghia.length, 1);
  assert.match(dinhNghia[0], /^có-lời-gộp = có ít nhất một vế lối gộp · không có vế lối chưa-gộp · có một vế lối chữ-ký · không có vế lối trả-lại$/);
  assert.equal(docCau(`${GOP}; gộp khi xanh; Ký`).co_loi_gop, true, 'hai vế gộp vẫn là có lời gộp');
  assert.equal(docCau('Ký').ly_do, 'câu ghi không mang lời gộp');
  assert.equal(docCau(GOP).ly_do, 'câu ghi không mang chữ ký');
});

test('GL-5b chuẩn hoá câu: HOA, thừa khoảng trắng, hai dấu «;» liền, Unicode rời (NFD), tiền tố ô thẻ và đuôi phút; dạng ngoài danh sách không phải lời gộp', () => {
  const CO = [
    'GỘP: KHI CI XANH; KÝ',
    '   gộp:   khi  CI xanh  ;;  Ký  ;',
    'gộp: khi CI xanh; Ký'.normalize('NFD'),
    'Gộp khi xanh; ký hay trả: Ký: Manh Phan 2026-11-21, phút 4',
    'gộp: khi xanh; Ký, phút 12',
    'Treo: phê hết; gộp: khi CI xanh; KÝ HAY TRẢ:  ký',
  ];
  assert.notEqual(CO[2], 'gộp: khi CI xanh; Ký', 'tiền đề: câu NFD phải khác câu NFC từng byte');
  for (const c of CO) assert.deepEqual(docCau(c), { co_loi_gop: true, ly_do: null }, JSON.stringify(c));
  const KHONG = [
    ['gộp nhé; Ký', /không mang lời gộp/],
    ['gộp: khi CI xanh rồi; Ký', /không mang lời gộp/],
    ['Ký, gộp khi xanh', /không mang chữ ký/],
    ['gộp: khi CI xanh; ký hay trả: ___', /không mang chữ ký/],
    ['gộp: khi CI xanh; Ký nhé', /không mang chữ ký/],
    ['gộp: khi CI xanh; ký hay trả: Trả lại: chưa đạt', /là trả lại/],
    ['GỘP: CHƯA; KÝ', /không mang lời gộp/],
    ['', /không mang chữ ký/],
  ];
  for (const [c, re] of KHONG) {
    const kq = docCau(c);
    assert.equal(kq.co_loi_gop, false, JSON.stringify(c));
    assert.match(kq.ly_do, re, JSON.stringify(c));
  }
});

test('GL-5c ma trận sổ: dòng CUỐI mang lời gộp quyết, không lùi về dòng cũ; dòng hỏng bỏ qua; CRLF và sổ không dòng trống cuối vẫn đọc', () => {
  const gopD = (n) => dongLoiGop('gộp: khi CI xanh; Ký', { n });
  const chuaD = (n) => dongLoiGop('gộp: chưa; Ký', { n });
  const hongCau = '{"id":"d-20261121T110000Z-9","type":"revisit","stage":"gate2","at":"2026-11-21T11:00:00Z","decision":"lời gộp trong câu ký: gộp khi CI xanh","loi_gop":{"cau_x":"gộp: khi CI xanh; Ký"}}';
  const HANG = [
    ['vắng vế gộp', so(...DONG_THUONG, dongLoiGop('Ngoài-1: nhận giới hạn; Ký')), false, /không mang lời gộp/],
    ['có vế gộp, không có vế ký', so(...DONG_THUONG, dongLoiGop('gộp: khi CI xanh')), false, /không mang chữ ký/],
    ['dòng «chưa» sau thay dòng gộp trước', so(gopD(3), chuaD(4)), false, /không mang lời gộp/],
    ['dòng gộp sau thay dòng «chưa» trước', so(chuaD(3), gopD(4)), true, null],
    ['dòng cuối hỏng khoá cau — không lùi về dòng gộp cũ hơn', so(gopD(3), hongCau), false, /dòng lời gộp cuối không mang câu/],
    ['dòng JSON hỏng xen giữa và đứng cuối', so(DONG_THUONG[0], '{"id":"d-x","stage":"gate2","loi_gop":{"cau":', gopD(3), '{hỏng'), true, null],
    ['sổ rỗng', '', false, /không có dòng lời gộp/],
    ['dạng ngoài danh sách «gộp nhé»', so(dongLoiGop('gộp nhé; Ký')), false, /không mang lời gộp/],
    ['sổ chỉ có dòng thường', so(...DONG_THUONG), false, /không có dòng lời gộp/],
    ['dòng thường đứng SAU dòng lời gộp', so(gopD(3), ...DONG_THUONG), true, null],
    ['CRLF', `${[DONG_THUONG[0], gopD(3)].join('\r\n')}\r\n`, true, null],
    ['không dòng trống cuối', [DONG_THUONG[0], gopD(3)].join('\n'), true, null],
    ['dòng mang loi_gop ở bước khác gate2 không tính', so(gopD(3).replace('"stage":"gate2"', '"stage":"S5"')), false, /không có dòng lời gộp/],
  ];
  for (const [ten, text, co, re] of HANG) {
    const kq = docLoiGop(text);
    assert.equal(kq.co, co, `${ten}: ${kq.ly_do}`);
    assert.equal(typeof kq.ly_do, 'string', ten);
    if (re) assert.match(kq.ly_do, re, ten);
  }
  const du = docLoiGop(so(chuaD(3), gopD(4)));
  assert.deepEqual([du.id, du.cau], ['d-20261121T101500Z-4', 'gộp: khi CI xanh; Ký']);
  assert.deepEqual([docLoiGop('').id, docLoiGop('').cau], [null, null]);
});

// ── GL-6: lối vào theo lời ký trên kho thật ─────────────────────────────────────────────────────────────────────

test('GL-6a đủ sáu vế trên đầu nhánh → đúng MỘT lời gọi `gh pr merge 7 --merge --match-head-commit <sha>`, không --auto, mã thoát 0, không cần đợt', () => {
  const a = khoLoi();
  const { kq, io } = theoLoi(a);
  assert.equal(kq.da_gop, true, kq.ly_do);
  assert.deepEqual(io.merge(), [['pr', 'merge', '7', '--merge', '--match-head-commit', a.sha]]);
  assert.ok(!io.goiGh.flat().includes('--auto'), 'lời gọi gh mang --auto');
  assert.equal(maThoatGop(kq), 0);
  assert.equal(kq.sha, a.sha);
  assert.equal(fs.existsSync(path.join(a.k, '.acceptance-runs')), false, 'lối theo lời không được ghi gì của đợt');
  assert.throws(() => gop(a.k, '7', { io: ioCua(a.k, a.sha), theoLoi: true }), /--theo-loi đòi --slug/);
});

test('GL-6b ma trận sáu vế — bỏ từng vế trên đầu nhánh: 0 lời gọi merge, mã thoát 1, thông điệp gọi tên đúng vế', () => {
  const HANG = [
    ['khoá kho tắt', { khoa: 'false' }, /^kho chưa bật feature_loop\.gop_theo_loi_ky trên đầu nhánh$/],
    ['hợp đồng máy đã thông', { trangThai: MAY_THONG }, /^hồ sơ s trên đầu PR ở «machine-cleared» — lời gộp chỉ có ở hồ sơ đã ký$/],
    ['chữ ký rỗng', { chuKy: '' }, /^báo cáo bằng chứng trên đầu PR không có chữ ký người$/],
    ['không dòng lời gộp', { coDong: false }, /^không có dòng lời gộp trong sổ$/],
    ['câu ghi không mang lời gộp', { cau: 'Ngoài-1: nhận giới hạn; ký hay trả: Ký' }, /^câu ghi không mang lời gộp$/],
    ['dòng lời gộp ghi ở commit khác commit chữ ký', { dongRieng: true }, /^dòng lời gộp không sinh cùng commit với chữ ký hiện hành$/],
  ];
  assert.equal(HANG.length, 6);
  for (const [ten, o, re] of HANG) khongGop(theoLoi(khoLoi(o)), re, ten);
});

test('GL-6c sáu cách viết khoá kho: chỉ `true` và `true` kèm chú thích đuôi là bật; vắng và mọi cách viết khác là tắt', () => {
  const a = khoLoi({ khoa: null });
  const VIET = [
    ['true', true],
    ['true  # bật 21/11', true],
    [null, false],
    ['false', false],
    ['"true"', false],
    ['True', false],
    ['yes', false],
    ['true#dính', false],
  ];
  for (const [khoa, bat] of VIET) {
    if (khoa !== null) {
      ghi(a.k, '_acceptance/config.yaml', cauHinh(khoa));
      chot(a.k, `khoa: ${khoa}`);
      git(a.k, 'push', '-q', 'origin', 'feat');
    }
    const sha = git(a.k, 'rev-parse', 'HEAD');
    const io = ioCua(a.k, sha);
    const kq = gop(a.k, '7', { io, theoLoi: true, slug: 's', xet: true });
    assert.equal(maThoatGop(kq) === 0, bat, `khoá viết «${khoa}»: ${kq.ly_do}`);
    if (!bat) assert.match(kq.ly_do, /kho chưa bật feature_loop\.gop_theo_loi_ky/, `khoá viết «${khoa}»`);
    assert.equal(io.merge().length, 0);
  }
  // Khoá cùng tên lồng dưới một khoá khác của feature_loop không phải khoá kho.
  ghi(a.k, '_acceptance/config.yaml', 'feature_loop:\n  khac:\n    gop_theo_loi_ky: true\n');
  chot(a.k, 'khoa long sai cho');
  git(a.k, 'push', '-q', 'origin', 'feat');
  const sha = git(a.k, 'rev-parse', 'HEAD');
  assert.match(gop(a.k, '7', { io: ioCua(a.k, sha), theoLoi: true, slug: 's', xet: true }).ly_do, /kho chưa bật/);
});

test('GL-6d ký HAI lần, lần hai «gộp: chưa; Ký» ghi dòng mới cùng commit chữ ký mới → 0 lời gọi merge, «không mang lời gộp»', () => {
  const kyLai = (cau) => (k) => {
    ghi(k, `${HS}/evidence-report.md`, baoCao('Manh Phan 2026-11-22'));
    ghi(k, `${HS}/decisions.jsonl`, so(...DONG_THUONG, dongLoiGop(CAU_DU), dongLoiGop(cau, { n: 4, luc: '2026-11-22T08:00:00Z', quyet: 'chưa gộp' })));
    chot(k, 'ky lan hai');
  };
  khongGop(theoLoi(khoLoi({ sau: kyLai('gộp: chưa; Ký') })), /^câu ghi không mang lời gộp$/, 'ký lần hai chưa gộp');
  // Đối chứng dương trên cùng kịch bản: lần hai vẫn mang lời gộp → gộp theo dòng mới.
  const { kq, io } = theoLoi(khoLoi({ sau: kyLai('gộp khi xanh; Ký') }));
  assert.equal(kq.da_gop, true, kq.ly_do);
  assert.equal(io.merge().length, 1);
});

test('GL-6e chấm lại rồi ký lại mà lần ký mới không ghi dòng nào → 0 lời gọi merge, «không sinh cùng commit với chữ ký»', () => {
  const chamLai = (chuKyMoi) => (k) => {
    ghi(k, `${HS}/contract.md`, hopDong('verified'));
    ghi(k, `${HS}/evidence-report.md`, baoCao(''));
    chot(k, 'cham lai: go chu ky');
    ghi(k, `${HS}/contract.md`, hopDong(DA_KY));
    ghi(k, `${HS}/evidence-report.md`, baoCao(chuKyMoi));
    chot(k, 'ky lai, khong ghi dong');
  };
  const RE = /^dòng lời gộp không sinh cùng commit với chữ ký hiện hành$/;
  khongGop(theoLoi(khoLoi({ sau: chamLai('Manh Phan 2026-11-22') })), RE, 'ký lại, giá trị chữ ký mới');
  khongGop(theoLoi(khoLoi({ sau: chamLai('Manh Phan 2026-11-21') })), RE, 'ký lại, giá trị chữ ký y như cũ');
  // Đối chứng dương: commit sau chữ ký KHÔNG chạm chữ ký hay sổ (sửa vật) → dòng lời gộp còn hiệu lực.
  const { kq, io } = theoLoi(khoLoi({ sau: (k) => { ghi(k, 'apps/web/khac.ts', 'x\n'); chot(k, 'sua vat sau ky'); } }));
  assert.equal(kq.da_gop, true, kq.ly_do);
  assert.equal(io.merge().length, 1);
});

test('GL-6f --xet: in quyết định, 0 lời gọi merge — cả khi đủ vế lẫn khi thiếu vế', () => {
  const a = khoLoi();
  const du = theoLoi(a, { xet: true });
  assert.deepEqual([du.kq.duong, du.kq.da_gop, maThoatGop(du.kq)], ['moi-nhat', false, 0], du.kq.ly_do);
  assert.equal(du.io.merge().length, 0);
  assert.match(du.kq.ly_do, /lời gộp/);
  const thieu = theoLoi(khoLoi({ coDong: false }), { xet: true });
  assert.deepEqual([thieu.kq.duong, thieu.kq.da_gop, maThoatGop(thieu.kq)], ['chan', false, 1]);
  assert.equal(thieu.io.merge().length, 0);
});

test('GL-6g các vế đọc trên ĐẦU NHÁNH của PR, không đọc cây làm việc: cây làm việc xoá dòng lời gộp, tắt khoá, gỡ chữ ký (chưa commit) → vẫn gộp', () => {
  const a = khoLoi();
  ghi(a.k, `${HS}/decisions.jsonl`, so(...DONG_THUONG));
  ghi(a.k, '_acceptance/config.yaml', cauHinh('false'));
  ghi(a.k, `${HS}/evidence-report.md`, baoCao(''));
  assert.notEqual(git(a.k, 'status', '--porcelain'), '', 'tiền đề: cây làm việc phải lệch đầu nhánh');
  const { kq, io } = theoLoi(a);
  assert.equal(kq.da_gop, true, kq.ly_do);
  assert.deepEqual(io.merge(), [['pr', 'merge', '7', '--merge', '--match-head-commit', a.sha]]);
  // Chiều ngược: đầu nhánh KHÔNG có dòng lời gộp mà cây làm việc có (chưa commit) → không gộp.
  const b = khoLoi({ coDong: false });
  ghi(b.k, `${HS}/decisions.jsonl`, so(...DONG_THUONG, dongLoiGop(CAU_DU)));
  khongGop(theoLoi(b), /^không có dòng lời gộp trong sổ$/, 'dòng chỉ có ở cây làm việc');
});

test('GL-6h dòng lệnh thật: `gh` lỗi hay vắng → thoát 1, MỘT dòng `dieu-phoi: …`, không vết ngăn xếp; đối chứng: `gh` lành → thoát 0, một lời gọi merge', () => {
  const a = khoLoi();
  const chay = (gh, duongPath) => spawnSync(process.execPath, [LENH, 'gop', '7', '--theo-loi', '--slug', 's'], { cwd: a.k, encoding: 'utf8', timeout: 60_000, env: { ...ENV, PATH: duongPath, GH_GIA_DIR: gh.d } });
  const lanh = ghGia();
  lanh.dat('view-cuoi.json', xemPr(a.sha));
  const rLanh = chay(lanh, `${lanh.bin}:${process.env.PATH}`);
  assert.equal(rLanh.status, 0, rLanh.stdout + rLanh.stderr);
  assert.match(rLanh.stdout, /^gop #7: moi-nhat · đã gộp — /);
  assert.deepEqual(lanh.merge(), [`pr merge 7 --merge --match-head-commit ${a.sha}`]);
  const motDong = (r, re) => {
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.equal(r.stdout, '');
    assert.match(r.stderr, re);
    assert.equal(r.stderr.trim().split('\n').length, 1, `không phải một dòng:\n${r.stderr}`);
    assert.doesNotMatch(r.stderr, /^\s+at /m);
  };
  const hong = ghGia();
  hong.dat('loi', '');
  motDong(chay(hong, `${hong.bin}:${process.env.PATH}`), /^dieu-phoi: gop: không xét được PR #7 — no pull requests found for branch\n$/);
  assert.equal(hong.merge().length, 0);
  // `gh` không có trên máy: PATH chỉ còn một thư mục trống.
  motDong(chay(ghGia(), tam('dp-path-')), /^dieu-phoi: gop: không xét được PR #7 — .*gh.*ENOENT/);
  // Cờ --theo-loi thiếu --slug: lỗi dùng lệnh, một dòng.
  const thieu = spawnSync(process.execPath, [LENH, 'gop', '7', '--theo-loi'], { cwd: a.k, encoding: 'utf8', env: { ...ENV, PATH: `${lanh.bin}:${process.env.PATH}`, GH_GIA_DIR: lanh.d } });
  assert.equal(thieu.status, 1);
  assert.match(thieu.stderr, /^dieu-phoi: gop: --theo-loi đòi --slug <slug>/);
});

// ── GL-7: lệnh không cờ giữ nguyên ──────────────────────────────────────────────────────────────────────────────

test('GL-7 lệnh gop KHÔNG cờ --theo-loi ở nơi không có đợt → «không có đợt nào đang chạy» trước mọi lời gọi gh, dù đầu nhánh đủ dòng lời gộp', () => {
  const a = khoLoi();
  const io = ioCua(a.k, a.sha);
  assert.throws(() => gop(a.k, '7', { io, slug: 's' }), /^Error: gop: không có đợt nào đang chạy$/);
  assert.throws(() => gop(a.k, '7', { io, slug: 's', xet: true }), /^Error: gop: không có đợt nào đang chạy$/);
  assert.equal(io.goiGh.length, 0, 'gh giả đã nhận lời gọi');
  const r = spawnSync(process.execPath, [LENH, 'gop', '7', '--slug', 's'], { cwd: a.k, encoding: 'utf8', env: { ...ENV, PATH: tam('dp-path-') } });
  assert.equal(r.status, 1);
  assert.equal(r.stderr, 'dieu-phoi: gop: không có đợt nào đang chạy\n');
  // Đối chứng dương: cùng kho, có cờ → gộp.
  const co = theoLoi(a);
  assert.equal(co.kq.da_gop, true, co.kq.ly_do);
});
