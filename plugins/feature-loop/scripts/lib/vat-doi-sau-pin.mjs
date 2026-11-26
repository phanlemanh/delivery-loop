// vat-doi-sau-pin.mjs — MỘT vị từ «tệp vật nào đổi sau verified_commit?» cho mọi bên đọc JS (hồ sơ
// bang-chung-cu-theo-dau-vao, vấn đề #10). Bên gọi: pr-san-sang.mjs (cả cờ --chi-xet của bước resume) và
// repin-lane.mjs --skip-unchanged. Luật là luật `stale_files()` của lưới trước-gộp (pre-merge-check.sh), từng vế:
//   1. vật hồ sơ — đoạn `_acceptance` có trong đường dẫn (lưới: `_acceptance/*|*/_acceptance/*`);
//   2. tệp `risk_tiers.t1_skip_globs` — khớp bằng BẢN JS của luật `case` bash mà lưới dùng (`match_globs` +
//      `glob_variants`): `*` qua được `/`, `?` một ký tự bất kỳ, `[..]` lớp ký tự, `\x` chữ x, `{a,b}` là chữ;
//      `**/` thêm biến thể bỏ đoạn. Phép vi phân bash↔JS (ca BC-8) giữ hai bên khớp;
//   3. khi kho khai `risk_tiers.stale_scope: paths` — `core.staleByPaths`, CÙNG hàm lưới gọi.
// Hàm thuần: không đọc đĩa, không gọi git — bên gọi đưa danh sách đổi (tên thật, `core.quotepath=off`), cây
// (`core.dungCayPaths`) và văn bản cấu hình. `pre-merge-check.sh` không gọi tệp này; nó giữ bản bash của luật.

// Cờ git cho danh sách đổi bằng tên thật (không bọc nháy, không thoát octal) — một nguồn cho mọi bên gọi.
export const GIT_TEN_THAT = Object.freeze(['-c', 'core.quotepath=off']);

const laHoSo = (f) => String(f).split('/').includes('_acceptance');

function lopKyTu(g, i) {
  // g[i] === '['. Trả [regex, chỉ số sau ']'] hoặc null nếu lớp không đóng (khi đó `[` là chữ, như bash).
  let j = i + 1;
  let phu = false;
  if (g[j] === '!' || g[j] === '^') { phu = true; j++; }
  const dau = j;
  if (g[j] === ']') j++;
  while (j < g.length && g[j] !== ']') j++;
  if (j >= g.length) return null;
  const than = g.slice(dau, j).replace(/[\\\]^]/g, (c) => `\\${c}`);
  return [`[${phu ? '^' : ''}${than}]`, j + 1];
}

function caseRe(g) {
  let re = '';
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === '*') re += '.*'; // SAO-CASE — `*` của case bash qua được `/`
    else if (c === '?') re += '.';
    else if (c === '\\' && i + 1 < g.length) re += g[++i].replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
    else if (c === '[') {
      const l = lopKyTu(g, i);
      if (l) { re += l[0]; i = l[1] - 1; } else re += '\\[';
    } else re += c.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  }
  return new RegExp(`^${re}$`, 's');
}

// Đúng `glob_variants` của lưới: mỗi lần xuất hiện `**/` sinh hai nhánh — bỏ nó, hoặc giữ.
function bienThe(g) {
  const k = g.indexOf('**/');
  if (k < 0) return [g];
  const truoc = g.slice(0, k);
  return bienThe(g.slice(k + 3)).flatMap((sau) => [truoc + sau, `${truoc}**/${sau}`]);
}

export function khopGlobBash(f, g) {
  if (!g) return false;
  if (caseRe(g).test(f)) return true;
  return g.includes('**/') && bienThe(g).some((v) => caseRe(v).test(f));
}

export function staleScopeOf(configText) {
  const m = String(configText || '').match(/^[ \t]*stale_scope:[ \t]*([^\s#]+)/m);
  return String((m || [])[1] || 'all').replace(/^['"]|['"]$/g, '') === 'paths' ? 'paths' : 'all';
}

function t1Cua(configText, core) {
  try {
    const t1 = configText == null ? [] : core.resolveConfigList(configText, 'risk_tiers.t1_skip_globs');
    return Array.isArray(t1) ? t1.filter((g) => typeof g === 'string' && g) : [];
  } catch {
    return []; // không đọc được → không loại T1: lệch về phía «cũ», không về phía bỏ qua
  }
}

export function vatDoiSauPin({ doi, configText = null, evalsText = null, prefix = '', cay = null, core }) {
  const boHoSo = [];
  const boT1 = [];
  let giu = [];
  const t1 = t1Cua(configText, core);
  for (const f of doi || []) {
    if (laHoSo(f)) boHoSo.push(f);
    else if (t1.some((g) => khopGlobBash(f, g))) boT1.push(f);
    else giu.push(f);
  }
  let loc = null;
  if (staleScopeOf(configText) === 'paths' && giu.length) {
    let r;
    try {
      r = core.staleByPaths(giu, evalsText, { prefix, cay });
    } catch (e) {
      r = { apply: false, reason: `lib-loi:${String((e && e.message) || e).split('\n')[0]}`, kept: giu, skipped: [] };
    }
    loc = { apply: !!r.apply, reason: r.apply ? null : r.reason, skipped: r.apply ? r.skipped : [] };
    if (r.apply) giu = r.kept;
  }
  return { giu, boHoSo, boT1, loc };
}
