#!/usr/bin/env node
// so-gioi-han.mjs — bộ sinh hàng sổ giới hạn của KHO KIT (hồ sơ tep-chung-khong-chan-gop, AC-9; hạt giống
// docs/plans/2026-10-18-hat-giong-so-known-limits-thieu-hang-p179.md, đề xuất 1).
//
// P179 (tests/plugins/run-tests.sh) đòi docs/research/known-limits-ledger.tsv có số hàng ≥ số dòng
// «Đề xuất: known-limits» trên mọi _acceptance/*/review-findings.md. Hàng sổ từng do thợ chép tay nên lượt chấm kế
// của vòng nào có mục known-limits mới đều đỏ. Bộ sinh khớp đúng nghĩa P179 hôm nay — SỐ LƯỢNG theo hồ sơ: hồ sơ có k
// mục và h hàng (cột slug) thì thêm k − h hàng ở cuối sổ cho các mục sau cùng, giữ mọi hàng cũ từng byte. Hàng mới
// mang lớp `chua-xep` để người xếp lại khi cần.
//
//   node tools/so-gioi-han.mjs --slug <slug> [--root <gốc kho>] [--write]   (vắng --write: chỉ in)
//   node tools/so-gioi-han.mjs --moc     (móc PostToolUse: đọc JSON sự kiện từ stdin; chỉ chạy khi tệp vừa ghi là
//                                         _acceptance/<slug>/review-findings.md; luôn thoát 0)
// Sổ và P179 chỉ có ở kho kit — tệp này không đi trong gói.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const SO = path.join('docs', 'research', 'known-limits-ledger.tsv');
const MUC = /Đề xuất:\s*known-limits/;

// Mục known-limits của một review-findings.md: mỗi dòng «Đề xuất: known-limits» gắn với tiêu đề `- **…**` gần nhất
// phía trên và dòng `severity:` trong cùng mục.
export function mucCua(txt) {
  const ra = []; let tieuDe = ''; let sev = 'medium';
  for (const l of String(txt).split('\n')) {
    const t = l.match(/^- \*\*(.+?)\*\*/); if (t) { tieuDe = t[1]; sev = 'medium'; continue; }
    const s = l.match(/^\s*severity:\s*(\S+)/); if (s) { sev = s[1]; continue; }
    if (MUC.test(l)) ra.push({ tieuDe: tieuDe.replace(/\t/g, ' ').trim() || '(không tiêu đề)', sev });
  }
  return ra;
}

export function dongBo(root, slug, { ghi = false } = {}) {
  const soP = path.join(root, SO);
  const rf = path.join(root, '_acceptance', slug, 'review-findings.md');
  if (!existsSync(soP)) return { them: 0, ly: 'kho không có sổ giới hạn' };
  if (!existsSync(rf)) return { them: 0, ly: 'hồ sơ không có review-findings.md' };
  const mucs = mucCua(readFileSync(rf, 'utf8'));
  const so = readFileSync(soP, 'utf8');
  const hangs = so.replace(/\n$/, '').split('\n').slice(1).map(l => l.split('\t'));
  const cua = hangs.filter(c => c[1] === slug);
  const thieu = mucs.length - cua.length;
  if (thieu <= 0) return { them: 0, ly: `đủ hàng (${cua.length} hàng · ${mucs.length} mục)` };
  let maxN = 0;
  for (const c of cua) { const m = c[0].match(new RegExp(`^${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}#may-(\\d+)$`)); if (m) maxN = Math.max(maxN, Number(m[1])); }
  const moi = mucs.slice(-thieu).map((m, i) => [`${slug}#may-${maxN + i + 1}`, slug, m.sev, 'chua-xep', 'song', '', '', `${m.tieuDe} [máy sinh từ review-findings.md]`].join('\t'));
  if (ghi) writeFileSync(soP, (so.endsWith('\n') ? so : so + '\n') + moi.join('\n') + '\n');
  return { them: thieu, moi };
}

function chinh() {
  const a = process.argv.slice(2);
  if (a.includes('--moc')) {
    let input = ''; try { input = readFileSync(0, 'utf8'); } catch { return; }
    let ev; try { ev = JSON.parse(input); } catch { return; }
    const raw = ev && ev.tool_input && ev.tool_input.file_path; if (!raw) return;
    const tep = path.resolve(ev.cwd || process.cwd(), raw);
    const m = tep.match(/^(.*)[\\/]_acceptance[\\/]([\w.-]+)[\\/]review-findings\.md$/); if (!m) return;
    try {
      const r = dongBo(m[1], m[2], { ghi: true });
      if (r.them > 0) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse',
        additionalContext: `so-gioi-han: đã thêm ${r.them} hàng sổ giới hạn cho hồ sơ ${m[2]} (P179) — đưa ${SO} vào cùng commit gói bằng chứng.` } }) + '\n');
    } catch (e) {
      process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: `so-gioi-han: không sinh được hàng sổ (${e.message}) — chạy tay: node tools/so-gioi-han.mjs --slug ${m[2]} --write` } }) + '\n');
    }
    return;
  }
  const i = a.indexOf('--slug'); const slug = i >= 0 ? a[i + 1] : null;
  if (!slug || slug.startsWith('--')) { console.error('so-gioi-han: cần --slug <slug> (hoặc --moc)'); process.exit(2); }
  const j = a.indexOf('--root'); const root = path.resolve(j >= 0 ? a[j + 1] : '.');
  const r = dongBo(root, slug, { ghi: a.includes('--write') });
  console.log(r.them > 0 ? `so-gioi-han: ${a.includes('--write') ? 'đã thêm' : 'sẽ thêm'} ${r.them} hàng cho ${slug}` : `so-gioi-han: ${slug} — ${r.ly}`);
}
chinh();
