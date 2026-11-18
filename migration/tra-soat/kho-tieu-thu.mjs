#!/usr/bin/env node
// kho-tieu-thu.mjs — sổ «kho tiêu thụ đang dựa vào gì của kit» cho đợt chuyển nhà.
//
// Đọc MỘT mã commit của một kho tiêu thụ, tìm mọi chỗ chữ của kho ấy bám vào kit, và nói chỗ nào gãy khi kit dọn nhà
// (đổi tên chợ, đổi tên ba plugin và lệnh của chúng, chuyển mỗi plugin vào `plugins/<tên>/`). Danh sách tệp và lệnh của
// kit lấy từ sổ kiểm kê (kiem-ke.mjs) chạy trên cùng mã commit kit — không gõ tay.
//
// Vùng đọc: mọi tệp của kho trừ hồ sơ từng vòng (`_acceptance/<tên>/…`) và `docs/` — hai vùng đó là lịch sử, chỉ đếm.
// Tệp ở gốc `_acceptance/` (config.yaml, README…) là cấu hình sống nên được đọc.
//
// Dùng:  node kho-tieu-thu.mjs --kho <thư mục git của kho tiêu thụ> --ten <tên ngắn> [--ref <mã>] [--kit-ref <mã>] [--ra <thư mục>]
//   --ref mặc định nhánh mặc định của remote origin (origin/HEAD). Nhớ `git fetch` kho ấy trước — đo trên bản cũ là kết luận sai.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { kiemKe } from './kiem-ke.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const git = (kho, args) => execFileSync('git', ['-C', kho, ...args], { encoding: 'utf8', maxBuffer: 1 << 30 });

// Bảng tên đã chốt tạm (KE-HOACH.md mục 3). Plugin không có ở đây giữ tên.
export const DOI_TEN = {
  cho: ['acceptance-gate-kit', 'delivery-loop'],
  plugin: { 'dieu-phoi': 'dispatch', 'road-map': 'roadmap', 'tri-thuc': 'knowledge' },
};

export function doiChieu({ kho, ten, ref, kit }) {
  const sha = git(kho, ['rev-parse', `${ref}^{commit}`]).trim();
  const ngay = git(kho, ['log', '-1', '--format=%cs', sha]).trim();
  const tep = git(kho, ['ls-tree', '-r', '--name-only', '-z', sha]).split('\0').filter(Boolean);
  const lichSu = (t) => /^_acceptance\/[^/]+\//.test(t) || t.startsWith('docs/');

  // Từ sổ kiểm kê: tệp sản phẩm của kit (đường dẫn tính từ gốc kho kit) và tên lệnh/skill/tác tử của từng plugin.
  const sp = kit.hang.filter(h => h.lop === 'san-pham' || h.lop === 'chua-ro');
  const tepKit = new Map(sp.map(h => [h.tep, h.plugin]));
  const thuMuc = Object.fromEntries(kit.plugin.map(p => [p.ten, p.thu_muc]));
  const lenh = new Map(); // "plugin:tên" → loại
  for (const h of sp) {
    const r = thuMuc[h.plugin] ? h.tep.slice(thuMuc[h.plugin].length + 1) : h.tep;
    let m;
    if ((m = r.match(/^commands\/([\w-]+)\.md$/))) lenh.set(`${h.plugin}:${m[1]}`, 'lenh');
    else if ((m = r.match(/^skills\/([\w-]+)\/SKILL\.md$/))) lenh.set(`${h.plugin}:${m[1]}`, 'skill');
    else if ((m = r.match(/^agents\/([\w-]+)\.md$/))) lenh.set(`${h.plugin}:${m[1]}`, 'tac-tu');
    else if ((m = r.match(/^workflows\/([\w-]+)\.js$/))) lenh.set(`${h.plugin}:${m[1]}`, 'workflow');
  }
  const tenPlugin = kit.plugin.map(p => p.ten);
  const RE_ID = new RegExp(`\\b(${tenPlugin.join('|')})@${DOI_TEN.cho[0]}\\b`, 'g');
  const RE_LENH = new RegExp(`(?<![\\w-])(${tenPlugin.join('|')}):([\\w-]+)`, 'g');
  // Một chuỗi đường dẫn bất kỳ; khúc đuôi DÀI NHẤT trùng một tệp sản phẩm kit là đích (vd «$R/feature-loop/scripts/x.mjs»
  // → feature-loop/scripts/x.mjs, không phải scripts/x.mjs).
  const RE_DUONG = /[\w.-]*(?:\/[\w.-]+)+\.\w+/g;
  const dichKit = (s) => { const p = s.replace(/[.,:;)]+$/, '').split('/'); for (let i = 0; i < p.length - 1; i++) { const x = p.slice(i).join('/'); if (tepKit.has(x)) return x; } return null; };
  const RE_TIM = /plugins\/cache|installed_plugins\.json|known_marketplaces|resolve-plugin|marketplace add|plugin install|plugin update/;

  // Bản chép: kho tiêu thụ giữ một tệp ở ĐÚNG đường dẫn của một tệp sản phẩm kit (vd «lớp chép CI» của crm). Chữ nhắc
  // đường dẫn ấy trỏ vào bản chép của chính kho, không vào kit — dọn nhà không làm nó gãy, nhưng đổi chỗ lấy bản chép.
  const coTep = new Set(tep);
  const blob = (k, r, f) => { try { return git(k, ['rev-parse', '-q', '--verify', `${r}:${f}`]).trim(); } catch { return ''; } };
  const banChep = [...tepKit.keys()].filter(f => coTep.has(f)).sort().map(f => ({ tep: f, plugin: tepKit.get(f), giong_kit: blob(kho, sha, f) === blob(kit.kho, kit.sha, f) ? 'giong' : 'khac' }));
  const laBanChep = new Set(banChep.map(b => b.tep));
  const hang = [];
  let dongLichSu = 0;
  const tamMo = fs.mkdtempSync(path.join(fs.realpathSync(process.env.TMPDIR || '/tmp'), 'kho-tieu-thu-'));
  try {
    execFileSync('sh', ['-c', 'git -C "$1" archive "$2" | tar -x -C "$3"', 'sh', kho, sha, tamMo], { maxBuffer: 1 << 30 });
    for (const t of tep) {
      let buf; try { buf = fs.readFileSync(path.join(tamMo, t)); } catch { continue; }
      if (buf.subarray(0, 8192).includes(0) || buf.length > 4 << 20) continue;
      const chu = buf.toString('utf8');
      if (!chu.includes(DOI_TEN.cho[0]) && !RE_LENH.test(chu) && !/CLAUDE_PLUGIN_ROOT|resolve-plugin|tim-kit/.test(chu) && !RE_DUONG.test(chu)) { RE_LENH.lastIndex = 0; RE_DUONG.lastIndex = 0; continue; }
      RE_LENH.lastIndex = 0; RE_DUONG.lastIndex = 0;
      const dong = chu.split('\n');
      if (lichSu(t)) { dongLichSu += dong.filter(d => d.includes(DOI_TEN.cho[0]) || RE_LENH.test(d)).length; RE_LENH.lastIndex = 0; continue; }
      dong.forEach((d, i) => {
        // Đường dẫn máy (/Users/<tên>/, /home/<tên>/) không vào sổ: thay bằng ~/.
        const an = (x) => String(x).replace(/\/(?:Users|home)\/[^/\s"']+\//g, '~/');
        const them = (loai, chuThay, tepK, gay) => hang.push({ tep: t, dong: i + 1, loai, chu: an(chuThay), tep_kit: tepK || '', gay });
        for (const m of d.matchAll(RE_ID)) them('id-plugin', m[0], '', DOI_TEN.plugin[m[1]] ? 'doi-ten-cho-va-plugin' : 'doi-ten-cho');
        const daId = d.replace(RE_ID, '');
        if (daId.includes(DOI_TEN.cho[0])) them('ten-cho-hoac-ten-kho', DOI_TEN.cho[0], '', /github\.com|git clone|marketplace add|fetch/.test(d) ? 'url-kho-hoac-cho' : 'chu-nhac-ten');
        for (const m of d.matchAll(RE_LENH)) {
          const k = `${m[1]}:${m[2]}`;
          if (!lenh.has(k)) continue; // «road-map:» trong câu thường — chỉ tính tên lệnh/skill có thật trong kit
          them('lenh-skill', k, '', DOI_TEN.plugin[m[1]] ? 'doi-ten-plugin' : 'giu-ten');
        }
        for (const m of d.matchAll(RE_DUONG)) {
          const p = dichKit(m[0]);
          if (!p) continue;
          const pl = tepKit.get(p);
          // Đường dẫn tính từ gốc kho kit. Tệp của plugin lõi: còn đúng nếu «gốc kit» của kho này là gốc plugin lõi (bản cài),
          // gãy nếu là gốc kho kit (CI kéo cả kho). Tệp của plugin con đi qua gốc lõi: gãy cả hai đường sau dọn nhà.
          if (laBanChep.has(p) && !/CLAUDE_PLUGIN_ROOT|\$R\/|\$AG\/|\$\{?KIT/.test(d)) { them('duong-dan-vao-ban-chep', m[0], p, 'khong-gay-doi-nguon-chep'); continue; }
          them('duong-dan-vao-kit', m[0], p, thuMuc[pl] ? 'goi-plugin-con-qua-goc-loi' : 'dung-neu-goc-la-ban-cai-gay-neu-goc-la-kho');
        }
        if (RE_TIM.test(d) || /tim-kit|CLAUDE_PLUGIN_ROOT=/.test(d)) them('tim-kit', d.trim().slice(0, 140), '', 'xem-tay');
      });
    }
  } finally { fs.rmSync(tamMo, { recursive: true, force: true }); }
  const uniq = [...new Map(hang.map(h => [`${h.tep}|${h.dong}|${h.loai}|${h.chu}`, h])).values()]
    .sort((a, b) => a.tep.localeCompare(b.tep, 'en') || a.dong - b.dong || a.loai.localeCompare(b.loai));
  return { ten, sha, ngay, ref, kit_sha: kit.sha, hang: uniq, dong_lich_su: dongLichSu, ban_chep: banChep };
}

function demTheo(a, k) { const m = new Map(); for (const x of a) m.set(k(x), (m.get(k(x)) || 0) + 1); return [...m.entries()].sort((x, y) => y[1] - x[1] || String(x[0]).localeCompare(String(y[0]))); }

export function ghi(kq, ra) {
  fs.mkdirSync(ra, { recursive: true });
  const dau = `# máy sinh bởi migration/tra-soat/kho-tieu-thu.mjs — ${kq.ten} @ ${kq.sha.slice(0, 8)} (${kq.ngay}), kit @ ${kq.kit_sha.slice(0, 8)} — đừng sửa tay`;
  const cot = ['tep', 'dong', 'loai', 'gay', 'chu', 'tep_kit'];
  fs.writeFileSync(path.join(ra, `kho-${kq.ten}.tsv`), [dau, cot.join('\t'), ...kq.hang.map(h => cot.map(c => String(h[c]).replace(/\t/g, ' ')).join('\t'))].join('\n') + '\n');
  const o = [`## ${kq.ten}`, '', `<!-- ${dau.slice(2)} -->`, '', `Mã commit \`${kq.sha.slice(0, 8)}\` (${kq.ngay}). ${kq.hang.length} chỗ bám ở ${new Set(kq.hang.map(h => h.tep)).size} tệp sống; thêm ${kq.dong_lich_su} dòng trong hồ sơ đã ký và \`docs/\` (lịch sử, không viết lại).`, '', '| Loại | Hệ quả khi dọn nhà | Số chỗ | Số tệp |', '|---|---|---|---|'];
  for (const [k, n] of demTheo(kq.hang, h => `${h.loai}\t${h.gay}`)) { const [l, g] = k.split('\t'); o.push(`| \`${l}\` | \`${g}\` | ${n} | ${new Set(kq.hang.filter(h => h.loai === l && h.gay === g).map(h => h.tep)).size} |`); }
  if (kq.ban_chep.length) {
    const g = kq.ban_chep.filter(b => b.giong_kit === 'giong').length;
    o.push('', `**Bản chép tệp kit trong kho:** ${kq.ban_chep.length} tệp ở đúng đường dẫn của kit (${g} giống hệt kit @ \`${kq.kit_sha.slice(0, 8)}\`, ${kq.ban_chep.length - g} khác). Sau dọn nhà, nguồn chép đổi từ \`<gốc kho kit>/<đường dẫn>\` sang \`<gốc kho kit>/plugins/<plugin>/<đường dẫn>\`.`, '');
    o.push(kq.ban_chep.map(b => `\`${b.tep}\`${b.giong_kit === 'khac' ? ' (khác)' : ''}`).join(' · '));
  }
  const dd = kq.hang.filter(h => h.loai === 'duong-dan-vao-kit');
  if (dd.length) { o.push('', 'Tệp kit được gọi thẳng theo đường dẫn (số chỗ):', ''); for (const [k, n] of demTheo(dd, h => h.tep_kit)) o.push(`- \`${k}\` — ${n}`); }
  o.push('');
  return o.join('\n');
}

const tham = (argv) => { const a = { ref: null, kitRef: 'kit-cu/main', ra: path.join(DAY, 'ket-qua') }; for (let i = 0; i < argv.length; i++) { const k = argv[i]; if (k === '--kho') a.kho = argv[++i]; else if (k === '--ten') a.ten = argv[++i]; else if (k === '--ref') a.ref = argv[++i]; else if (k === '--kit-ref') a.kitRef = argv[++i]; else if (k === '--ra') a.ra = argv[++i]; else { process.stderr.write(`kho-tieu-thu: đối số lạ «${k}»\n`); process.exit(2); } } if (!a.kho || !a.ten) { process.stderr.write('kho-tieu-thu: cần --kho và --ten\n'); process.exit(2); } return a; };

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const a = tham(process.argv.slice(2));
  const ref = a.ref || git(a.kho, ['symbolic-ref', '-q', '--short', 'refs/remotes/origin/HEAD']).trim();
  const khoKit = git(DAY, ['rev-parse', '--show-toplevel']).trim();
  const kit = kiemKe({ kho: khoKit, ref: a.kitRef, luat: path.join(DAY, 'luat-xep.json') });
  const kq = doiChieu({ kho: a.kho, ten: a.ten, ref, kit });
  const md = ghi(kq, a.ra);
  fs.writeFileSync(path.join(a.ra, `kho-${a.ten}.md`), md);
  process.stdout.write(`kho-tieu-thu: ${a.ten} @ ${kq.sha.slice(0, 8)} · ${kq.hang.length} chỗ bám · lịch sử ${kq.dong_lich_su} dòng\n`);
}
