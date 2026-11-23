// Hồ sơ loi-gop-trong-cau-ky — bên đọc lời gộp và lối vào `--theo-loi` của lệnh gộp (E6, E7, E8; phần bên đọc của E5).
// Kho git THẬT dựng trong lượt (origin trần + bản kéo); chỉ `gh` là giả. Danh sách đóng, khuôn dòng sổ và khối dòng lệnh
// RÚT bằng marker từ tệp thật của cây đang kiểm (đường suy từ vị trí tệp ca) — không chép tay.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ciDo, DANG_LOI_GOP, docCau, docLoiGop, gop, maThoatGop } from '../../../plugins/dispatch/scripts/gop.mjs';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const TEP_LUAT = 'plugins/acceptance-gate/skills/acceptance/references/human-facing-language.md';
const TEP_KY = 'plugins/acceptance-gate/commands/signoff.md';
const TEP_VONG = 'plugins/feature-loop/skills/feature-loop/SKILL.md';
const LENH = path.join(GOC, 'plugins', 'dispatch', 'scripts', 'dieu-phoi.mjs');
// Trạng thái ký người dựng bằng ghép chuỗi: tệp ca không mang chuỗi ấy viết liền (lưới RT13).
const DA_KY = ['signed', 'off'].join('-');
const MAY_THONG = 'machine-cleared';

// Gói điều phối tự đứng được: bước CI của gói chạy thư mục ca này trên một bản sao CHỈ có gói điều phối (ca DP1-03 của
// hồ sơ dieu-phoi-dong-goi-loi). Ở đó không có thân lệnh ký, khối luật hay mục S5 để rút: năm ca cần chúng không đăng ký
// (in một dòng báo, không «skip»), và kho thử dùng dòng sổ tối thiểu bên đọc cần. Ở cây kit — thấy một trong hai gói kia —
// thì LUÔN rút từ tệp thật: tệp hay marker vắng là đỏ, và ca LGM-M0 của bộ nhát tiêm đòi đủ số ca.
const CO_KIT = ['acceptance-gate', 'feature-loop'].some((g) => fs.existsSync(path.join(GOC, 'plugins', g)));
const caKit = CO_KIT ? test : (ten) => console.log(`${ten.split(' ')[0]}: không đăng ký — bản sao này chỉ có gói điều phối`);
const KHUON_TOI_THIEU = '"type":"revisit","stage":"gate2","at":"<ISO>","decision":"lời gộp trong câu ký: <gộp khi CI xanh | chưa gộp>","decided_by":"<tên>","loi_gop":{"cau":"<trọn câu người gõ>"}';

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
function dongLoiGop(cau, { n = 3, luc = '2026-11-21T10:15:00Z', quyet = 'gộp khi CI xanh', khuon = CO_KIT ? rutKhoi(TEP_KY, 'LOI-GOP-GATE2-LINE') : [KHUON_TOI_THIEU] } = {}) {
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
const DANG_CHAY = [{ __typename: 'CheckRun', name: 'gate', status: 'COMPLETED', conclusion: 'SUCCESS' }, { __typename: 'CheckRun', name: 'build', status: 'IN_PROGRESS' }];
const DO_HAN = [{ __typename: 'CheckRun', name: 'gate', status: 'COMPLETED', conclusion: 'FAILURE' }, { __typename: 'CheckRun', name: 'build', status: 'IN_PROGRESS' }];
// `gh` giả trong tiến trình: trả JSON của `gh pr view`, ghi lại mọi lời gọi. `o` là hàm → nhận số thứ tự lượt hỏi (từ 1).
function ioCua(k, sha, o = {}) {
  const goiGh = [];
  const xem = () => goiGh.filter((x) => x[0] === 'pr' && x[1] === 'view');
  return {
    goiGh,
    xem,
    merge: () => goiGh.filter((x) => x[0] === 'pr' && x[1] === 'merge'),
    chay: (cmd, args) => {
      if (cmd !== 'gh') return execFileSync(cmd, args, { cwd: k, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      goiGh.push(args);
      if (args[0] === 'pr' && args[1] === 'view') return xemPr(sha, typeof o === 'function' ? o(xem().length) : o);
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

caKit('GL-5a mỗi dạng của khối luật GATE-ONESHOT-GOP đi qua bên đọc ra đúng lối khối ghi; hằng bên đọc đúng sáu dạng lời gộp', () => {
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
// Vế chữ ký đọc bằng vị từ của LÕI (`chuKyThat`, hồ sơ va-chu-ky-giu-cho-lenh-gop): mọi ca đi qua lối theo lời cần lõi
// nên chỉ đăng ký ở cây kit (caKit). Bản sao chỉ có gói điều phối chạy GL-6j — ở đó đường đúng của vật là CHẶN.

caKit('GL-6a đủ sáu vế trên đầu nhánh → đúng MỘT lời gọi `gh pr merge 7 --merge --match-head-commit <sha>`, không --auto, mã thoát 0, không cần đợt', () => {
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

caKit('GL-6b ma trận sáu vế (vế chữ ký hai hàng: rỗng, giữ chỗ) — bỏ từng vế trên đầu nhánh: 0 lời gọi merge, mã thoát 1, thông điệp gọi tên đúng vế', () => {
  const HANG = [
    ['khoá kho tắt', { khoa: 'false' }, /^kho chưa bật feature_loop\.gop_theo_loi_ky trên đầu nhánh$/],
    ['hợp đồng máy đã thông', { trangThai: MAY_THONG }, /^hồ sơ s trên đầu PR ở «machine-cleared» — lời gộp chỉ có ở hồ sơ đã ký$/],
    ['chữ ký rỗng', { chuKy: '' }, /^báo cáo bằng chứng trên đầu PR không có chữ ký người$/],
    ['chữ ký giữ chỗ pending', { chuKy: 'pending' }, /^báo cáo bằng chứng trên đầu PR không có chữ ký người — «pending» là chữ ký giữ chỗ$/],
    ['không dòng lời gộp', { coDong: false }, /^không có dòng lời gộp trong sổ$/],
    ['câu ghi không mang lời gộp', { cau: 'Ngoài-1: nhận giới hạn; ký hay trả: Ký' }, /^câu ghi không mang lời gộp$/],
    ['dòng lời gộp ghi ở commit khác commit chữ ký', { dongRieng: true }, /^dòng lời gộp không sinh cùng commit với chữ ký hiện hành$/],
  ];
  assert.equal(HANG.length, 7);
  for (const [ten, o, re] of HANG) khongGop(theoLoi(khoLoi(o)), re, ten);
});

caKit('GL-6c sáu cách viết khoá kho: chỉ `true` và `true` kèm chú thích đuôi là bật; vắng và mọi cách viết khác là tắt', () => {
  const a = khoLoi({ khoa: null });
  // Hàng đầu là kho dựng sẵn (khoá vắng); mỗi hàng sau là một commit đổi đúng dòng khoá trên đầu nhánh.
  const VIET = [
    [null, false],
    ['true', true],
    ['true  # bật 21/11', true],
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

caKit('GL-6d ký HAI lần, lần hai «gộp: chưa; Ký» ghi dòng mới cùng commit chữ ký mới → 0 lời gọi merge, «không mang lời gộp»', () => {
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

caKit('GL-6e chấm lại rồi ký lại mà lần ký mới không ghi dòng nào → 0 lời gọi merge, «không sinh cùng commit với chữ ký»', () => {
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

caKit('GL-6f --xet: in quyết định, 0 lời gọi merge — cả khi đủ vế lẫn khi thiếu vế', () => {
  const a = khoLoi();
  const du = theoLoi(a, { xet: true });
  assert.deepEqual([du.kq.duong, du.kq.da_gop, maThoatGop(du.kq)], ['moi-nhat', false, 0], du.kq.ly_do);
  assert.equal(du.io.merge().length, 0);
  assert.match(du.kq.ly_do, /lời gộp/);
  const thieu = theoLoi(khoLoi({ coDong: false }), { xet: true });
  assert.deepEqual([thieu.kq.duong, thieu.kq.da_gop, maThoatGop(thieu.kq)], ['chan', false, 1]);
  assert.equal(thieu.io.merge().length, 0);
});

caKit('GL-6g các vế đọc trên ĐẦU NHÁNH của PR, không đọc cây làm việc: cây làm việc xoá dòng lời gộp, tắt khoá, gỡ chữ ký (chưa commit) → vẫn gộp', () => {
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

caKit('GL-6h dòng lệnh thật: `gh` lỗi hay vắng → thoát 1, MỘT dòng `dieu-phoi: …`, không vết ngăn xếp; đối chứng: `gh` lành → thoát 0, một lời gọi merge', () => {
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

const require = createRequire(import.meta.url);
const TEP_LOI = path.join('lib', 'evidence-core.cjs');
const LENH_GIAI = 'resolve-plugin.mjs --plugin acceptance-gate --require lib/evidence-core.cjs';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Bản sao gói điều phối của cây đang kiểm ở `<tạm>/plugins/dispatch`; `coLoi` đặt thêm lõi (`lib/` của acceptance-gate)
// cạnh nó ở bố cục nguồn. Trả gốc gói của bản sao.
function banSaoGoi({ coLoi }) {
  const t = tam('dp-goi-');
  fs.cpSync(path.join(GOC, 'plugins', 'dispatch'), path.join(t, 'plugins', 'dispatch'), { recursive: true });
  if (coLoi) fs.cpSync(path.join(GOC, 'plugins', 'acceptance-gate', 'lib'), path.join(t, 'plugins', 'acceptance-gate', 'lib'), { recursive: true });
  return path.join(t, 'plugins', 'dispatch');
}
const napGop = (goi) => import(pathToFileURL(path.join(goi, 'scripts', 'gop.mjs')).href);
const khongBoDoc = (r, tep, nhan) => {
  khongGop(r, /^không tìm thấy bộ đọc chữ ký của lõi/, nhan);
  assert.ok(r.kq.ly_do.includes(tep), `${nhan}: không nêu đường đã thử ${tep} — ${r.kq.ly_do}`);
  assert.ok(r.kq.ly_do.includes(LENH_GIAI), `${nhan}: không nêu lệnh giải — ${r.kq.ly_do}`);
  assert.equal(r.io.goiGh.length, 0, `${nhan}: đã hỏi gh trước khi chặn`);
};

caKit('GL-6k mọi mẫu của bảng giữ chỗ của lõi (rút từ CHU_KY_GIU_CHO) chặn ở vế chữ ký: 0 lời gọi merge, mã 1, thông điệp nêu giá trị giữ chỗ', () => {
  const { CHU_KY_GIU_CHO } = require(path.join(GOC, 'plugins', 'acceptance-gate', TEP_LOI));
  assert.ok(Array.isArray(CHU_KY_GIU_CHO) && CHU_KY_GIU_CHO.length > 0, 'bảng giữ chỗ của lõi rỗng hoặc không xuất');
  console.log(`GL-6k: ${CHU_KY_GIU_CHO.length} mẫu`);
  for (const { mau, tienTo } of CHU_KY_GIU_CHO) {
    const v = tienTo ? `${mau}x` : mau;
    khongGop(theoLoi(khoLoi({ chuKy: v })), new RegExp(`^báo cáo bằng chứng trên đầu PR không có chữ ký người — «${esc(v)}» là chữ ký giữ chỗ$`), `mẫu ${mau}`);
  }
});

caKit('GL-6i đường tới lõi: --loi trỏ lõi thật, và bố cục nguồn cạnh lõi không cờ → gộp đúng một lần; --loi trỏ thư mục rỗng hay lõi không xuất chuKyThat → chặn trước mọi lời gọi gh, nêu đường đã thử và lệnh giải', async () => {
  const a = khoLoi();
  const motMinh = banSaoGoi({ coLoi: false });
  const canhLoi = banSaoGoi({ coLoi: true });
  const loiThat = path.join(GOC, 'plugins', 'acceptance-gate');
  const rong = tam('dp-loi-rong-');
  const gia = tam('dp-loi-gia-');
  ghi(gia, TEP_LOI, 'module.exports = { khac: 1 };\n');
  const chay = async (goi, them) => {
    const { gop: g } = await napGop(goi);
    const io = ioCua(a.k, a.sha);
    return { kq: g(a.k, '7', { io, theoLoi: true, slug: 's', ...them }), io };
  };
  for (const [ten, goi, them] of [['--loi trỏ lõi thật', motMinh, { loi: loiThat }], ['bố cục nguồn cạnh lõi, không cờ', canhLoi, {}]]) {
    const { kq, io } = await chay(goi, them);
    assert.equal(kq.da_gop, true, `${ten}: ${kq.ly_do}`);
    assert.deepEqual(io.merge(), [['pr', 'merge', '7', '--merge', '--match-head-commit', a.sha]], ten);
  }
  for (const [ten, loi] of [['--loi trỏ thư mục rỗng', rong], ['--loi trỏ lõi không xuất chuKyThat', gia]]) {
    khongBoDoc(await chay(motMinh, { loi }), path.join(loi, TEP_LOI), ten);
  }
  // Dòng lệnh thật nhận cờ: `--loi <rỗng>` → thoát 1, 0 lời gọi gh; `--loi` không giá trị → lỗi dùng lệnh một dòng.
  const gh = ghGia();
  gh.dat('view-cuoi.json', xemPr(a.sha));
  const env = { ...ENV, PATH: `${gh.bin}:${process.env.PATH}`, GH_GIA_DIR: gh.d };
  const r = spawnSync(process.execPath, [LENH, 'gop', '7', '--theo-loi', '--slug', 's', '--loi', rong], { cwd: a.k, encoding: 'utf8', env });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, new RegExp(`^gop #7: chan — không tìm thấy bộ đọc chữ ký của lõi.*${esc(path.join(rong, TEP_LOI))}`));
  assert.equal(gh.goi().length, 0, gh.goi().join('\n'));
  const thieu = spawnSync(process.execPath, [LENH, 'gop', '7', '--theo-loi', '--slug', 's', '--loi'], { cwd: a.k, encoding: 'utf8', env });
  assert.equal(thieu.status, 1);
  assert.match(thieu.stderr, /^dieu-phoi: gop: --loi <gốc acceptance-gate> thiếu giá trị\n$/);
});

test('GL-6j gói điều phối một mình, không cờ --loi → lối theo lời chặn trước mọi lời gọi gh (cả --xet), nêu đường bố cục nguồn đã thử và lệnh giải bằng resolve-plugin.mjs', async () => {
  const a = khoLoi();
  const goi = banSaoGoi({ coLoi: false });
  const { gop: g, maThoatGop: m } = await napGop(goi);
  const tep = path.join(path.dirname(goi), 'acceptance-gate', TEP_LOI);
  for (const them of [{}, { xet: true }]) {
    const io = ioCua(a.k, a.sha);
    const kq = g(a.k, '7', { io, theoLoi: true, slug: 's', ...them });
    assert.deepEqual([kq.duong, kq.da_gop, m(kq)], ['chan', false, 1], kq.ly_do);
    khongBoDoc({ kq, io }, tep, `gói một mình ${JSON.stringify(them)}`);
  }
});

// ── GL-7: lệnh không cờ giữ nguyên ──────────────────────────────────────────────────────────────────────────────

caKit('GL-7 lệnh gop KHÔNG cờ --theo-loi ở nơi không có đợt → «không có đợt nào đang chạy» trước mọi lời gọi gh, dù đầu nhánh đủ dòng lời gộp', () => {
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

// ── GL-8: khối dòng lệnh ở thân lệnh ký và mục S5; lệnh tự chờ CI ───────────────────────────────────────────────

caKit('GL-8a khối GOP-THEO-LOI-KY hai nơi trùng nhau sau khi chuẩn hoá MỌI chỗ trỏ bộ giải, mang cờ --cho-ci và --loi "$AG" giải bằng resolve-plugin.mjs; khối GOP-THEO-LOI-THOAT hai nơi trùng từng ký tự, đủ ba mã', () => {
  const [ky, vong] = [TEP_KY, TEP_VONG].map((tep) => rutKhoi(tep, 'GOP-THEO-LOI-KY'));
  assert.deepEqual([ky.length, vong.length], [1, 1], 'khối dòng lệnh phải đúng một dòng ở mỗi nơi');
  const DAU = '«bộ giải»';
  // Chuẩn hoá MỌI chỗ trỏ bộ giải (dòng lệnh giải cả gói điều phối lẫn gốc lõi), không chỉ chỗ đầu.
  const chuan = (s) => s.split('"<feature-loop>/scripts/resolve-plugin.mjs"').join(DAU).split('"$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs"').join(DAU);
  for (const d of [ky[0], vong[0]]) assert.equal(chuan(d).split(DAU).length - 1, 2, `phải đúng hai chỗ trỏ bộ giải: ${d}`);
  assert.notEqual(ky[0], vong[0], 'tiền đề: hai bản khác nhau ở chỗ trỏ gói');
  assert.equal(chuan(ky[0]), chuan(vong[0]));
  assert.ok(chuan(vong[0]).includes(`AG=$(node ${DAU} --plugin acceptance-gate --require lib/evidence-core.cjs)`), 'thiếu lời giải gốc lõi bằng bộ giải');
  assert.match(vong[0], /dieu-phoi\.mjs" gop <số PR> --theo-loi --slug <slug> --cho-ci \d+ --loi "\$AG"$/);
  const [thoatKy, thoatVong] = [TEP_KY, TEP_VONG].map((tep) => rutKhoi(tep, 'GOP-THEO-LOI-THOAT'));
  assert.deepEqual(thoatKy, thoatVong);
  assert.deepEqual(thoatVong.map((d) => d.slice(0, 3)), ['0 →', '4 →', '1 →']);
  assert.match(thoatVong[1], /vẫn 4/);
});

// Chạy ĐÚNG dòng lệnh rút từ khối của SKILL bằng shell, trong kho thử: gói điều phối và lõi giải về bản «đã cài» chép từ cây
// đang kiểm (HOME giả), `gh` giả đứng đầu PATH, nhịp hỏi lại rút còn 50 ms.
let nhaGia = null;
function chayKhoi(a, gh, doi = (s) => s) {
  if (!nhaGia) {
    nhaGia = tam('dp-nha-');
    fs.cpSync(path.join(GOC, 'plugins', 'dispatch'), path.join(nhaGia, '.claude', 'plugins', 'cache', 'delivery-loop', 'dispatch', '9.9.9'), { recursive: true });
    // Lõi «đã cài» cạnh nó trong bộ đệm: dòng lệnh giải gốc lõi bằng bộ giải rồi truyền --loi (bố cục nguồn không có ở đây).
    fs.cpSync(path.join(GOC, 'plugins', 'acceptance-gate', 'lib'), path.join(nhaGia, '.claude', 'plugins', 'cache', 'delivery-loop', 'acceptance-gate', '9.9.9', 'lib'), { recursive: true });
  }
  const [khuon] = rutKhoi(TEP_VONG, 'GOP-THEO-LOI-KY');
  const lenh = doi(khuon.replace('<số PR>', '7').replace('<slug>', 's'));
  assert.doesNotMatch(lenh, /<số PR>|<slug>/);
  const env = { ...ENV, HOME: nhaGia, WORKFLOWS_DIR: path.join(GOC, 'plugins', 'feature-loop', 'workflows'), PATH: `${gh.bin}:${path.dirname(process.execPath)}:${process.env.PATH}`, GH_GIA_DIR: gh.d, DIEU_PHOI_NHIP_CHO_MS: '50' };
  return spawnSync('bash', ['-c', lenh], { cwd: a.k, encoding: 'utf8', timeout: 90_000, env });
}

caKit('GL-8b dòng lệnh rút từ khối S5 chạy thật: check đang chạy hai lượt rồi xanh → 0 lời gọi merge trước lượt xanh, đúng một lời gọi sau đó trên sha của lượt xanh, thoát 0; đối chứng: đầu nhánh không có dòng lời gộp → thoát 1', () => {
  const a = khoLoi({ sau: (k) => { ghi(k, 'apps/web/khac.ts', 'x\n'); chot(k, 'sua vat sau ky'); } });
  const shaCu = git(a.k, 'rev-parse', 'HEAD~1');
  const gh = ghGia();
  // Đầu nhánh đổi giữa lúc chờ: lượt 1 còn ở commit chữ ký, lượt 2 và 3 ở commit mới.
  gh.dat('view-1.json', xemPr(shaCu, { rollup: DANG_CHAY }));
  gh.dat('view-2.json', xemPr(a.sha, { rollup: DANG_CHAY }));
  gh.dat('view-cuoi.json', xemPr(a.sha));
  const r = chayKhoi(a, gh);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^gop #7: moi-nhat · đã gộp — /);
  const goi = gh.goi();
  assert.deepEqual(goi.map((x) => x.split(' ').slice(0, 2).join(' ')), ['pr view', 'pr view', 'pr view', 'pr merge'], goi.join('\n'));
  assert.equal(goi[3], `pr merge 7 --merge --match-head-commit ${a.sha}`);
  assert.ok(!goi.join(' ').includes('--auto'));
  // Đối chứng: cùng dòng lệnh, check xanh, nhưng đầu nhánh không có dòng lời gộp.
  const b = khoLoi({ coDong: false });
  const ghB = ghGia();
  ghB.dat('view-cuoi.json', xemPr(b.sha));
  const rb = chayKhoi(b, ghB);
  assert.equal(rb.status, 1, rb.stdout + rb.stderr);
  assert.match(rb.stdout, /^gop #7: chan — không có dòng lời gộp trong sổ$/m);
  assert.equal(ghB.merge().length, 0);
});

caKit('GL-8c check đỏ hẳn → thoát 1 với «CI đỏ», đúng MỘT lượt hỏi trạng thái (không hỏi lại), 0 lời gọi merge', () => {
  const a = khoLoi();
  const gh = ghGia();
  gh.dat('view-cuoi.json', xemPr(a.sha, { rollup: DO_HAN }));
  const r = chayKhoi(a, gh);
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /^gop #7: chan — CI đỏ trên đầu nhánh — gate$/m);
  assert.equal(gh.xem().length, 1, gh.goi().join('\n'));
  assert.equal(gh.merge().length, 0);
});

caKit('GL-8d check còn chạy tới hết giờ chờ → thoát 4, 0 lời gọi merge', () => {
  const a = khoLoi();
  const gh = ghGia();
  gh.dat('view-cuoi.json', xemPr(a.sha, { rollup: DANG_CHAY }));
  // Giờ chờ của khối là 30 phút; ca rút nó còn 0,005 phút (0,3 giây) — phần còn lại của dòng lệnh giữ nguyên.
  const r = chayKhoi(a, gh, (s) => {
    assert.match(s, / --cho-ci 30 /);
    return s.replace(/ --cho-ci 30 /, ' --cho-ci 0.005 ');
  });
  assert.equal(r.status, 4, r.stdout + r.stderr);
  assert.match(r.stdout, /^gop #7: cho-ci — hết 0\.005 phút chờ CI — check chưa xanh — build: IN_PROGRESS$/m);
  assert.ok(gh.xem().length >= 1);
  assert.equal(gh.merge().length, 0);
});

caKit('GL-8e vòng chờ trong tiến trình: nhịp ngủ, không cờ thì không chờ, đỏ hẳn thì không hỏi lại, hết giờ thì thôi; bảng check đỏ hẳn', () => {
  assert.deepEqual(
    ciDo([
      { name: 'a', status: 'COMPLETED', conclusion: 'SUCCESS' },
      { name: 'b', status: 'COMPLETED', conclusion: 'FAILURE' },
      { name: 'c', status: 'IN_PROGRESS' },
      { name: 'd', status: 'COMPLETED', conclusion: 'CANCELLED' },
      { name: 'e', status: 'COMPLETED', conclusion: 'SKIPPED' },
      { name: 'f', status: 'COMPLETED', conclusion: 'NEUTRAL' },
      { name: 'g', status: 'QUEUED' },
      { context: 'h', state: 'PENDING' },
      { context: 'i', state: 'FAILURE' },
      { context: 'k', state: 'ERROR' },
      { context: 'l', state: 'SUCCESS' },
    ]),
    ['b', 'd', 'i', 'k'],
  );
  assert.deepEqual([ciDo([]), ciDo(undefined)], [[], []]);
  const a = khoLoi();
  const nhipCu = process.env.DIEU_PHOI_NHIP_CHO_MS;
  delete process.env.DIEU_PHOI_NHIP_CHO_MS;
  try {
    const chay = (rollupLuot, them) => {
      const io = ioCua(a.k, a.sha, (n) => ({ rollup: rollupLuot(n) }));
      const ngu = [];
      const kq = gop(a.k, '7', { io, theoLoi: true, slug: 's', ngu: (ms) => ngu.push(ms), ...them });
      return { kq, io, ngu };
    };
    // Hai lượt đang chạy rồi xanh: ngủ đúng hai nhịp mặc định, gộp một lần.
    const xanhSau = chay((n) => (n <= 2 ? DANG_CHAY : XANH), { choCi: 30 });
    assert.equal(xanhSau.kq.da_gop, true, xanhSau.kq.ly_do);
    assert.deepEqual(xanhSau.ngu, [30_000, 30_000]);
    assert.deepEqual([xanhSau.io.xem().length, xanhSau.io.merge().length], [3, 1]);
    process.env.DIEU_PHOI_NHIP_CHO_MS = '7';
    assert.deepEqual(chay((n) => (n <= 1 ? DANG_CHAY : XANH), { choCi: 30 }).ngu, [7]);
    delete process.env.DIEU_PHOI_NHIP_CHO_MS;
    // Không cờ --cho-ci: check còn chạy → lối chờ CI ngay, không ngủ, không gộp.
    const khongCho = chay(() => DANG_CHAY, {});
    assert.deepEqual([khongCho.kq.duong, maThoatGop(khongCho.kq), khongCho.ngu.length, khongCho.io.xem().length, khongCho.io.merge().length], ['cho-ci', 4, 0, 1, 0]);
    // Đỏ hẳn: chặn ngay kể cả khi không cờ; không hỏi lại khi có cờ.
    for (const them of [{}, { choCi: 30 }]) {
      const doH = chay(() => DO_HAN, them);
      assert.deepEqual([doH.kq.duong, maThoatGop(doH.kq), doH.ngu.length, doH.io.xem().length, doH.io.merge().length], ['chan', 1, 0, 1, 0]);
      assert.equal(doH.kq.ly_do, 'CI đỏ trên đầu nhánh — gate');
    }
    // Hết giờ: giờ chờ gần bằng không, check còn chạy mãi.
    const hetGio = chay(() => DANG_CHAY, { choCi: 1e-9 });
    assert.deepEqual([hetGio.kq.duong, maThoatGop(hetGio.kq), hetGio.io.merge().length], ['cho-ci', 4, 0]);
    assert.match(hetGio.kq.ly_do, /^hết 1e-9 phút chờ CI — check chưa xanh — build: IN_PROGRESS$/);
    for (const choCi of [-1, Number.NaN, '30']) assert.throws(() => gop(a.k, '7', { io: ioCua(a.k, a.sha), theoLoi: true, slug: 's', choCi }), /--cho-ci <phút> phải là số không âm/);
  } finally {
    if (nhipCu === undefined) delete process.env.DIEU_PHOI_NHIP_CHO_MS;
    else process.env.DIEU_PHOI_NHIP_CHO_MS = nhipCu;
  }
});
