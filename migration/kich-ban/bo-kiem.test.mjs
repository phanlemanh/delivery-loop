// bo-kiem.test.mjs — kiểm hai chiều cho phần B2 của kịch bản chuyển nhà (hồ sơ _acceptance/bo-kiem-xanh-o-kho-moi/):
// bước 6 đổi bộ kiểm (AC-1), thước đảo phép đổi (AC-2), chặn tên nhánh đích (AC-6).
// Chạy: node --test migration/kich-ban/bo-kiem.test.mjs
//
// Mỗi ca dựng kho fixture riêng bằng mã (fixture.mjs) trong thư mục tạm. Chiều đỏ chạy bản sao có tiêm đúng một kim, hoặc
// một nhánh hỏng dựng trên cây đích, và ghim đúng thông điệp. Tên ca = mã trong evals.yaml.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dungKhoFixture, git } from './fixture.mjs';
import { chupKho, soChup } from './kiem-cho.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KB = path.join(DAY, 'don-nha.mjs');
const tam = [];
after(() => { for (const d of tam) fs.rmSync(d, { recursive: true, force: true }); });
const moTam = (ten = 'bk-') => { const d = fs.mkdtempSync(path.join(os.tmpdir(), ten)); tam.push(d); return d; };
const moFix = (tuyChon) => dungKhoFixture(moTam(), tuyChon);
const chay = (script, args, env = {}) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', env: { ...process.env, ...env } });
const donNha = (f, nhanh, { script = KB, bangXep = f.bangXep } = {}) =>
  chay(script, ['--kho', f.kho, '--nguon', f.nguon, '--nhanh', nhanh, '--bang-xep', bangXep, '--repo-standards', f.rs]);
const coRef = (kho, ref) => spawnSync('git', ['-C', kho, 'rev-parse', '--verify', '-q', ref], { encoding: 'utf8' }).status === 0;

// ── AC-6 — tên nhánh đích ─────────────────────────────────────────────────────────────────────────────────────────
test('BK-AC6', () => {
  const f = moFix();
  const r = donNha(f, 'don-nha/thu');
  assert.equal(r.status, 0, r.stderr);
  assert.ok(coRef(f.kho, 'refs/heads/don-nha/thu'), 'đối chứng dương: nhánh don-nha/thu phải có');
});

for (const [ma, ten] of [['main', 'main'], ['chuyen-nha', 'chuyen-nha'], ['kit-cu-main', 'kit-cu/main'], ['nhanh-khac', 'nhanh-khac']]) {
  test(`BK-AC6-do-${ma}`, () => {
    const f = moFix();
    git(f.kho, ['branch', '-f', 'chuyen-nha', f.nguon]);
    git(f.kho, ['update-ref', 'refs/remotes/kit-cu/main', f.nguon]);
    const truoc = chupKho(f.kho);
    const r = donNha(f, ten);
    assert.equal(r.status, 2, `phải thoát 2 với --nhanh ${ten}; stderr: ${r.stderr}`);
    assert.match(r.stderr, new RegExp(`nhánh đích phải là don-nha/<tên>: ${ten.replace('/', '\\/')}`));
    assert.deepEqual(soChup(truoc, chupKho(f.kho)), [], 'ref, HEAD, thư mục làm việc phải đứng yên');
  });
}
