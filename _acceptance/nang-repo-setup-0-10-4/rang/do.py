#!/usr/bin/env python3
"""Bộ đo của hồ sơ nang-repo-setup-0-10-4 — gọi qua rang/chay.sh AC-n.

Mỗi tiêu chí: đối chứng dương trên vật thật trước, rồi chiều đỏ trên bản sao do mã sinh từ CHÍNH vật thật (đã kiểm bước
tiêm đổi tệp), ghim thông điệp. Bản sao đo = `git archive <cây>` vào thư mục tạm + `git init` + một commit (repo-setup đọc
lịch sử git). Thoát 0 = đạt · 1 = đỏ · 2 = không đọc được ở đây (thiếu repo-setup 0.10.4, git, make, bản gốc vòng).
Chỉ thư viện chuẩn.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

BASE = "87a392cddb2ca7a2362f3ca30a04e5998f4108fa"  # bản gốc vòng: đỉnh origin/main lúc mở vòng
SLUG = "nang-repo-setup-0-10-4"
RS_VERSION = "0.10.4"
NAM_MUC = {"agent_permissions", "plugin_versions", "plugin_ci_validates", "language_policy", "upgrade_wall"}
BA_TEP_GO = {".claude/skills/review-change/SKILL.md", "tools/ci_inputs.py", "tools/ci_verdict.py"}
CHO_PHEP = [
    ".repo-setup.json", "Makefile", "mk/**", "tools/upgrade_markers.py", "tools/ledgers.py", ".gitattributes",
    ".github/workflows/gate.yml", ".claude/settings.json", "CLAUDE.md", f"_acceptance/{SLUG}/**", "docs/**",
    "PRODUCT-MAP.md", "LO-TRINH.html", "tests/scripts/fixtures/routing-baseline.txt", "docs/research/known-limits-ledger.tsv",
    # Thêm ở S3 (sổ quyết định, dòng fix về LKN-AC3): kim đột biến của ca ghim nguyên văn dòng needs của job tests.
    "tests/scripts/luot-kiem-nhe.test.mjs",
]
DENY_MONG = ["Read(./.env)", "Read(./.env.*)"]


class Mu(Exception):
    """Không đọc được ở đây — thoát 2, không bao giờ xanh."""


class Do(Exception):
    """Đỏ — thoát 1, thông điệp ghim."""


def chay(cmd, cwd, env=None, input_text=None):
    r = subprocess.run(cmd, cwd=cwd, env=env, input=input_text, capture_output=True, text=True)
    return r.returncode, r.stdout, r.stderr


def git(root: Path, *args: str) -> str:
    code, out, err = chay(["git", *args], root)
    if code != 0:
        raise Mu(f"git {' '.join(args)} thoát {code}: {err.strip()}")
    return out


def repo_setup() -> Path:
    goc = Path(os.environ.get("REPO_SETUP_ROOT") or Path.home() / ".claude/plugins/cache/repo-standards/repo-setup" / RS_VERSION)
    pj = goc / ".claude-plugin/plugin.json"
    if not (goc / "scripts/apply.py").is_file() or not (goc / "scripts/doctor.py").is_file() or not pj.is_file():
        raise Mu(f"không đọc được ở đây: không thấy repo-setup {RS_VERSION} ở {goc}")
    ban = json.loads(pj.read_text())["version"]
    if ban != RS_VERSION:
        raise Mu(f"không đọc được ở đây: repo-setup ở {goc} là {ban}, phép đo cần {RS_VERSION}")
    return goc


def ban_sao(root: Path, cay: str, tmp: Path, ten: str) -> Path:
    d = tmp / ten
    d.mkdir()
    a = subprocess.run(["git", "-C", str(root), "archive", cay], capture_output=True)
    if a.returncode != 0:
        raise Mu(f"git archive {cay} thoát {a.returncode}: {a.stderr.decode().strip()}")
    t = subprocess.run(["tar", "-x", "-C", str(d)], input=a.stdout, capture_output=True)
    if t.returncode != 0:
        raise Mu(f"tar thoát {t.returncode}")
    env = {**os.environ, "GIT_AUTHOR_NAME": "do", "GIT_AUTHOR_EMAIL": "do@x.invalid", "GIT_COMMITTER_NAME": "do",
           "GIT_COMMITTER_EMAIL": "do@x.invalid", "GIT_AUTHOR_DATE": "2026-11-26T00:00:00Z",
           "GIT_COMMITTER_DATE": "2026-11-26T00:00:00Z"}
    for c in (["git", "init", "-q", "-b", "main"], ["git", "add", "-A"], ["git", "-c", "core.autocrlf=false", "commit", "-qm", ten]):
        code, _, err = chay(c, d, env)
        if code != 0:
            raise Mu(f"dựng bản sao {ten}: {' '.join(c)} thoát {code}: {err.strip()}")
    return d


def doc_tai(root: Path, cay: str, duong: str) -> str:
    return git(root, "show", f"{cay}:{duong}")


# ── AC-1 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
def apply_thu(rs: Path, d: Path) -> dict:
    code, out, err = chay([sys.executable, str(rs / "scripts/apply.py"), "--target", str(d), "--preset", "claude-plugin",
                           "--level", "starter", "--adopt", "--dry-run", "--json"], d)
    if code != 0:
        raise Do(f"apply.py --dry-run thoát {code}: {err.strip()[:400]}")
    return json.loads(out)


def ac1(root: Path, tmp: Path) -> None:
    rs = repo_setup()
    head = ban_sao(root, "HEAD", tmp, "head")
    r = apply_thu(rs, head)
    rong = {k: r.get(k, []) for k in ("created", "merged", "marked", "base_unread")}
    print("AC-1 HEAD: " + " ".join(f"{k}={v}" for k, v in rong.items()))
    if any(rong.values()):
        raise Do(f"bản nâng chưa trọn: {rong}")
    removed = set(r.get("removed", []))
    print(f"AC-1 removed={sorted(removed)} conflict={sorted(r.get('conflict', []))}")
    if removed != BA_TEP_GO:
        raise Do(f"removed khác ba tệp đã gỡ: {sorted(removed)}")
    for t in ("CLAUDE.md", ".claude/settings.json"):
        if t not in r.get("conflict", []):
            raise Do(f"{t} không ở nhóm conflict — bản nâng có thể ghi vào nó")
    m = json.loads((head / ".repo-setup.json").read_text())
    the = (m.get("version"), m.get("preset"), m.get("level"), m.get("adopt"), m.get("vars", {}).get("plugin_versioning"))
    print(f"AC-1 manifest: {the[0]} {the[1]} {the[2]} {'adopt' if the[3] else 'khong-adopt'} {the[4]}")
    if the != (RS_VERSION, "claude-plugin", "starter", True, "independent"):
        raise Do(f".repo-setup.json lệch: {the}")
    thieu = sorted(BA_TEP_GO - set(m.get("files", {})))
    if thieu:
        raise Do(f"bản ghi thiếu băm của tệp đã gỡ (lần nâng sau sẽ tạo lại): {thieu}")
    print("AC-1 băm ba tệp gỡ: có")
    goc = ban_sao(root, BASE, tmp, "goc")
    rg = apply_thu(rs, goc)
    if "mk/upgrade.mk" not in rg.get("created", []):
        raise Do(f"chiều đỏ không đỏ: bản gốc vòng ra created={rg.get('created')}")
    print("AC-1 chiều đỏ: bản gốc vòng chưa nâng (created có mk/upgrade.mk)")


# ── AC-2 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
def doctor(rs: Path, d: Path) -> dict:
    code, out, err = chay([sys.executable, str(rs / "scripts/doctor.py"), "--target", str(d), "--json"], d)
    if code != 0:
        raise Do(f"doctor.py thoát {code}: {err.strip()[:400]}")
    return json.loads(out)


def ma(ds) -> set:
    return {x if isinstance(x, str) else x.get("id") for x in ds}


def ac2(root: Path, tmp: Path) -> None:
    rs = repo_setup()
    r = doctor(rs, ban_sao(root, "HEAD", tmp, "head"))
    failed = sorted(ma(r.get("failed", [])))
    up = r.get("upgrade", {})
    print(f"AC-2 HEAD: điểm {r.get('score')}, failed={failed}")
    print(f"AC-2 upgrade: marked={up.get('marked')} behind={up.get('behind')}")
    if r.get("score") != 100 or failed:
        raise Do(f"doctor chưa đạt: điểm {r.get('score')}, trượt {failed}")
    if up.get("marked") or up.get("behind"):
        raise Do(f"khối upgrade còn tệp: marked={up.get('marked')} behind={up.get('behind')}")
    thieu = sorted(NAM_MUC - ma(r.get("passed", [])))
    if thieu:
        raise Do(f"mục không nằm trong passed: {thieu}")
    print(f"AC-2 năm mục trong passed: {', '.join(sorted(NAM_MUC))}")
    g = doctor(rs, ban_sao(root, BASE, tmp, "goc"))
    gf = ma(g.get("failed", []))
    if g.get("score") != 82 or gf != NAM_MUC:
        raise Do(f"chiều đỏ lệch: bản gốc vòng điểm {g.get('score')}, failed={sorted(gf)}")
    print(f"AC-2 chiều đỏ: bản gốc vòng điểm 82, failed = {', '.join(sorted(gf))}")


# ── AC-3 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
def van_ban_duyet(hop_dong: str) -> list[str]:
    """Khối văn bản mục Language ở Notes của hợp đồng — bên viết là hợp đồng chủ kho duyệt, không chép tay vào đây."""
    dong = hop_dong.splitlines()
    i = next((k for k, x in enumerate(dong) if "Văn bản đề xuất cho mục `## Language`" in x), None)
    if i is None:
        raise Do("hợp đồng không có khối văn bản đề xuất cho mục Language")
    mo = next((k for k in range(i + 1, len(dong)) if dong[k].strip() == "```"), None)
    dong_lai = next((k for k in range(mo + 1, len(dong)) if dong[k].strip() == "```"), None) if mo is not None else None
    if dong_lai is None:
        raise Do("khối văn bản mục Language trong hợp đồng không đóng")
    lui = len(dong[mo]) - len(dong[mo].lstrip())
    return [x[lui:] if x.strip() else "" for x in dong[mo + 1:dong_lai]]


def kiem_claude(goc: str, moi: str, duyet: list[str]) -> str | None:
    g, m = goc.splitlines(), moi.splitlines()
    if m[: len(g)] != g:
        return "CLAUDE.md đổi ngoài mục Language"
    them = m[len(g):]
    while them and not them[0].strip():
        them = them[1:]
    if not them:
        return "CLAUDE.md không thêm mục Language"
    if them != duyet:
        return "mục Language khác văn bản đã duyệt"
    return None


DONG_KHAI = ["python3 tools/upgrade_markers.py", "python3 tools/ledgers.py draw", ":"]


def cong_thuc_test(mk: str) -> list[str]:
    dong = mk.splitlines()
    i = next((k for k, x in enumerate(dong) if x.startswith("test:")), None)
    if i is None:
        raise Do("Makefile không có đích test")
    out = [dong[i]]
    for x in dong[i + 1:]:
        if not x.startswith("\t"):
            break
        out.append(x)
    return out


def make_n_test(d: Path) -> list[str]:
    code, out, err = chay(["make", "-n", "test"], d)
    if code != 0:
        raise Do(f"make -n test thoát {code}: {err.strip()[:300]}")
    return [x for x in out.splitlines() if x.strip()]


def kiem_test(goc: list[str], moi: list[str]) -> str | None:
    if moi[: len(DONG_KHAI)] != DONG_KHAI or moi[len(DONG_KHAI):] != goc:
        return "đích test của kit bị đổi"
    return None


def ac3(root: Path, tmp: Path) -> None:
    if not shutil.which("make"):
        raise Mu("không đọc được ở đây: thiếu make")
    goc_c, moi_c = doc_tai(root, BASE, "CLAUDE.md"), doc_tai(root, "HEAD", "CLAUDE.md")
    duyet = van_ban_duyet(doc_tai(root, "HEAD", f"_acceptance/{SLUG}/contract.md"))
    if not duyet or duyet[0] != "## Language":
        raise Do(f"khối văn bản đã duyệt không mở bằng ## Language: {duyet[:1]}")
    loi = kiem_claude(goc_c, moi_c, duyet)
    if loi:
        raise Do(loi)
    print(f"AC-3 CLAUDE.md: chỉ thêm {len(moi_c.splitlines()) - len(goc_c.splitlines())} dòng cuối, bằng từng byte văn bản đã duyệt ở Notes")
    if git(root, "ls-tree", "--name-only", "HEAD", ".claude/skills/review-change/SKILL.md").strip():
        raise Do(".claude/skills/review-change/SKILL.md có mặt ở HEAD")
    print("AC-3 review-change: vắng")
    dg, dh = ban_sao(root, BASE, tmp, "goc"), ban_sao(root, "HEAD", tmp, "head")
    tg, th = make_n_test(dg), make_n_test(dh)
    loi = kiem_test(tg, th)
    if loi:
        raise Do(f"{loi}: gốc {tg} · HEAD {th}")
    print("AC-3 make -n test: bằng bản gốc trừ ba dòng đã khai, đứng trước bộ chạy kiểm")
    # chiều đỏ — bản sao sinh từ chính tệp HEAD, kiểm bước tiêm đã đổi tệp
    dong = moi_c.splitlines()
    giua = len(goc_c.splitlines()) // 2
    tiem = "\n".join(dong[:giua] + [dong[giua] + " (sửa)"] + dong[giua + 1:]) + "\n"
    if tiem == moi_c or kiem_claude(goc_c, tiem, duyet) != "CLAUDE.md đổi ngoài mục Language":
        raise Do("chiều đỏ CLAUDE.md không đỏ đúng thông điệp")
    print("AC-3 chiều đỏ: CLAUDE.md đổi ngoài mục Language")
    tiem2 = moi_c.rstrip("\n") + " (sửa)\n"  # đổi dòng cuối — dòng ấy thuộc phần thêm
    if tiem2 == moi_c or kiem_claude(goc_c, tiem2, duyet) != "mục Language khác văn bản đã duyệt":
        raise Do("chiều đỏ mục Language không đỏ đúng thông điệp")
    print("AC-3 chiều đỏ: mục Language khác văn bản đã duyệt")
    mk = dh / "Makefile"
    cu = mk.read_text()
    for ten, moi in (
        ("đổi công thức", cu.replace(cong_thuc_test(cu)[1], "\tbash tests/khac.sh", 1)),
        ("tiền điều kiện lạ", cu.replace("\ntest:", "\nla-thu:\n\techo la-thu\ntest: la-thu", 1).replace("test: la-thu ##", "test: la-thu ##", 1)),
    ):
        if moi == cu:
            raise Do(f"bước tiêm «{ten}» không đổi Makefile")
        mk.write_text(moi)
        if kiem_test(tg, make_n_test(dh)) != "đích test của kit bị đổi":
            raise Do(f"chiều đỏ «{ten}» không đỏ")
        print(f"AC-3 chiều đỏ ({ten}): đích test của kit bị đổi")
    mk.write_text(cu)


# ── AC-4 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
def ac4(root: Path, tmp: Path) -> None:
    if not shutil.which("make"):
        raise Mu("không đọc được ở đây: thiếu make")
    d = ban_sao(root, "HEAD", tmp, "head")
    code, out, err = chay(["make", "upgrade"], d)
    if code != 0 or "no conflict markers" not in out:
        raise Do(f"bản sạch: make upgrade thoát {code}: {(out + err).strip()[:300]}")
    print("AC-4 sạch: make upgrade thoát 0 — no conflict markers")
    code, out, err = chay(["make", "-n", "check"], d)
    dau = next((x for x in out.splitlines() if x.strip()), "")
    if dau != "python3 tools/upgrade_markers.py":
        raise Do(f"bước đầu make -n check là «{dau}»")
    print(f"AC-4 dòng đầu make -n check: {dau}")
    ec = d / ".editorconfig"
    cu = ec.read_text()
    ec.write_text(cu + "<<<<<<< this repository\nX\n=======\nY\n>>>>>>> repo-setup 0.10.4\n")
    if ec.read_text() == cu:
        raise Do("bước tiêm không đổi .editorconfig")
    k1, o1, e1 = chay(["make", "upgrade"], d)
    k2, o2, e2 = chay([sys.executable, "tools/upgrade_markers.py"], d)
    ghim = re.compile(r"^\.editorconfig:\d+: conflict marker from a repo-setup upgrade$", re.M)
    for ten, k, o in (("make upgrade", k1, o1 + e1), ("upgrade_markers.py", k2, o2 + e2)):
        if k == 0 or not ghim.search(o) or "missing separator" in o:
            raise Do(f"tiêm .editorconfig: {ten} thoát {k}: {o.strip()[:300]}")
    print(f"AC-4 tiêm .editorconfig: make upgrade thoát {k1}, upgrade_markers.py thoát {k2}, nêu "
          f"{ghim.search(o2 + e2).group(0)}, không missing separator")


# ── AC-5 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
def khoi_viec(yml: str) -> dict[str, list[str]]:
    viec, cur = {}, None
    trong_jobs = False
    for x in yml.splitlines():
        if x.startswith("jobs:"):
            trong_jobs = True
            continue
        if not trong_jobs:
            continue
        m = re.match(r"^  ([A-Za-z0-9_-]+):\s*$", x)
        if m:
            cur = m.group(1)
            viec[cur] = []
            continue
        if cur:
            viec[cur].append(x)
    return viec


def buoc(dong: list[str]) -> list[list[str]]:
    ds, b = [], None
    for x in dong:
        if re.match(r"^      - ", x):
            b = [x]
            ds.append(b)
        elif b is not None and (x.startswith("        ") or not x.strip()):
            b.append(x)
    return ds


def than_run(b: list[str]) -> str | None:
    for i, x in enumerate(b):
        m = re.match(r"^(?:      - |        )run:\s*(.*)$", x)
        if m:
            if m.group(1).strip() not in ("|", "|-"):
                return m.group(1).strip()
            than = []
            for y in b[i + 1:]:
                if y.startswith("          "):
                    than.append(y[10:])
                elif not y.strip():
                    than.append("")
                else:
                    break
            return "\n".join(than).rstrip() + "\n"
    return None


def co_if(b: list[str]) -> bool:
    return any(re.match(r"^(?:      - |        )if:", x) for x in b)


def kiem_gate(yml: str) -> tuple[str, str]:
    v = khoi_viec(yml)
    dau = yml.split("\njobs:")[0]
    if not re.search(r"^  pull_request:", dau, re.M) or not re.search(r"^  push:", dau, re.M):
        raise Do("gate.yml thiếu lối vào pull_request hay push")
    if "khung" not in v:
        raise Do("gate.yml không có job khung")
    if any(re.match(r"^    if:", x) for x in v["khung"]):
        raise Do("khung mang điều kiện")
    runs = [than_run(b) or "" for b in buoc(v["khung"])]
    for lenh in ("python3 tools/plugin_lint.py", "python3 tools/upgrade_markers.py"):
        if not any(lenh in r for r in runs):
            raise Do(f"job khung không chạy {lenh}")
    if "tests" not in v:
        raise Do("gate.yml không có job tests")
    needs = next((x for x in v["tests"] if re.match(r"^    needs:", x)), "")
    if not re.search(r"\bkhung\b", needs):
        raise Do("tests không chờ khung")
    if_viec = next((x for x in v["tests"] if re.match(r"^    if:", x)), "")
    if "always()" not in if_viec:
        raise Do("tests bị bỏ qua khi khung đỏ")
    for b in buoc(v["tests"]):
        chu = "\n".join(b)
        m = re.search(r"^          ([A-Z_]+): \$\{\{ needs\.khung\.result \}\}", chu, re.M)
        if m and not co_if(b):
            return m.group(1), than_run(b) or ""
    raise Do("tests không có bước không điều kiện đọc needs.khung.result")


def ac5(root: Path, tmp: Path) -> None:
    yml = doc_tai(root, "HEAD", ".github/workflows/gate.yml")
    bien, than = kiem_gate(yml)
    print("AC-5 khung: không if, plugin_lint + upgrade_markers, lối vào pull_request + push")
    print("AC-5 tests: needs có khung, if cấp job có always()")
    ket = {}
    for gt in ("success", "failure", "skipped"):
        code, _, _ = chay(["bash", "-c", than], str(tmp), {**os.environ, bien: gt})
        ket[gt] = code
    if ket["success"] != 0 or ket["failure"] == 0 or ket["skipped"] == 0:
        raise Do(f"bước gom khung đọc sai kết quả: {ket}")
    print(f"AC-5 bước gom khung: success→{ket['success']} failure→{ket['failure']} skipped→{ket['skipped']}")
    d = ban_sao(root, "HEAD", tmp, "head")
    m1 = chay([sys.executable, "tools/plugin_lint.py"], d)
    m2 = chay([sys.executable, "tools/upgrade_markers.py"], d)
    print(f"AC-5 lệnh khung trên HEAD: {m1[0]} {m2[0]}")
    if m1[0] != 0 or m2[0] != 0:
        raise Do(f"lệnh của job khung đỏ trên HEAD: {(m1[1] + m1[2] + m2[1] + m2[2]).strip()[:400]}")
    # chiều đỏ 1 — gỡ source của plugin đầu tiên trong tệp khai chợ của bản sao
    mp = d / ".claude-plugin/marketplace.json"
    cu = mp.read_text()
    j = json.loads(cu)
    ten = j["plugins"][0]["name"]
    del j["plugins"][0]["source"]
    mp.write_text(json.dumps(j, ensure_ascii=False, indent=2) + "\n")
    if mp.read_text() == cu:
        raise Do("bước tiêm không đổi marketplace.json")
    code, out, err = chay([sys.executable, "tools/plugin_lint.py"], d)
    if code == 0 or ten not in out + err:
        raise Do(f"plugin_lint không đỏ đúng khi gỡ source của {ten}: thoát {code}")
    print(f"AC-5 chiều đỏ: plugin_lint đỏ đúng: {ten}")
    # chiều đỏ 2 — gỡ vars.plugin_versioning khỏi bản ghi (tệp khai chợ trả lại bản lành trước)
    mp.write_text(cu)
    rs = d / ".repo-setup.json"
    cu_rs = rs.read_text()
    j = json.loads(cu_rs)
    j.get("vars", {}).pop("plugin_versioning", None)
    rs.write_text(json.dumps(j, ensure_ascii=False, indent=2) + "\n")
    if json.loads(rs.read_text()) == json.loads(cu_rs):
        raise Do("bước tiêm không đổi .repo-setup.json")
    code, out, err = chay([sys.executable, "tools/plugin_lint.py"], d)
    if code == 0 or "no independent versioning is declared" not in out + err:
        raise Do(f"plugin_lint không đỏ đúng khi gỡ plugin_versioning: thoát {code}")
    print("AC-5 chiều đỏ: plugin_lint đỏ đúng: no independent versioning is declared")
    rs.write_text(cu_rs)
    # chiều đỏ 3–5 — ba bản sao gate.yml
    dong = yml.splitlines(keepends=True)
    v = khoi_viec(yml)
    def thay(cu_d: str, moi_d: str) -> str:
        out = yml.replace(cu_d, moi_d, 1)
        if out == yml:
            raise Do(f"bước tiêm không đổi gate.yml: «{cu_d.strip()}»")
        return out
    needs = next(x for x in v["tests"] if re.match(r"^    needs:", x))
    if_t = next(x for x in v["tests"] if re.match(r"^    if:", x))
    # Tiêm điều kiện vào ĐÚNG khối job khung: dòng «runs-on» trùng chữ ở mọi job, nên thay theo chuỗi sẽ rơi vào
    # job đứng trước (manh) và chiều đỏ không bao giờ đỏ.
    dau_khung = yml.index("\n  khung:\n") + len("\n  khung:\n")
    tiem_khung = yml[:dau_khung] + "    if: github.event_name == 'pull_request'\n" + yml[dau_khung:]
    ca = [
        ("tests không chờ khung", thay(needs + "\n", re.sub(r",?\s*khung\b", "", needs).replace("[, ", "[") + "\n")),
        ("tests bị bỏ qua khi khung đỏ", thay(if_t + "\n", "")),
        ("khung mang điều kiện", tiem_khung),
    ]
    for mong, tiem in ca:
        try:
            kiem_gate(tiem)
            raise Do(f"chiều đỏ «{mong}» không đỏ")
        except Do as e:
            if str(e) != mong:
                raise Do(f"chiều đỏ «{mong}» đỏ sai thông điệp: {e}")
        print(f"AC-5 chiều đỏ: {mong}")


# ── AC-6 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
def kiem_settings(goc: dict, moi: dict) -> str | None:
    deny = moi.get("permissions", {}).get("deny")
    if any("workflows" in x for x in deny or []):
        return "chặn sửa workflow"
    if deny != DENY_MONG:
        return f"deny = {deny}, cần {DENY_MONG}"
    if moi.get("hooks") != goc.get("hooks"):
        return "hooks đổi"
    for k in set(goc) | set(moi):
        if k in ("permissions", "hooks"):
            continue
        if goc.get(k) != moi.get(k):
            return f"khoá {k} đổi"
    if goc.get("permissions", {}).get("allow") != moi.get("permissions", {}).get("allow"):
        return "permissions.allow đổi"
    if set(moi.get("permissions", {})) - {"allow", "deny"} != set(goc.get("permissions", {})) - {"allow", "deny"}:
        return "permissions có khoá lạ"
    return None


def ac6(root: Path, tmp: Path) -> None:
    goc = json.loads(doc_tai(root, BASE, ".claude/settings.json"))
    moi = json.loads(doc_tai(root, "HEAD", ".claude/settings.json"))
    loi = kiem_settings(goc, moi)
    if loi:
        raise Do(loi)
    print(f"AC-6 deny = {', '.join(DENY_MONG)}")
    print("AC-6 khoá khác bằng bản gốc")
    t1 = json.loads(json.dumps(moi))
    t1["permissions"]["deny"].append("Edit(./.github/workflows/**)")
    assert t1 != moi
    if kiem_settings(goc, t1) != "chặn sửa workflow":
        raise Do("chiều đỏ deny workflow không đỏ đúng")
    print("AC-6 chiều đỏ: chặn sửa workflow")
    t2 = json.loads(json.dumps(moi))
    t2["hooks"].pop("PostToolUse")
    assert t2 != moi
    if kiem_settings(goc, t2) != "hooks đổi":
        raise Do("chiều đỏ hooks không đỏ đúng")
    print("AC-6 chiều đỏ: hooks đổi")


# ── AC-7 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
def khop(duong: str, mau: str) -> bool:
    if mau.endswith("/**"):
        return duong.startswith(mau[:-2])
    return duong == mau


def ngoai_ds(ds: list[str]) -> list[str]:
    return [p for p in ds if p.startswith("plugins/") or not any(khop(p, m) for m in CHO_PHEP)]


def ac7(root: Path, tmp: Path, thu: list[str]) -> None:
    ds = [x for x in git(root, "diff", "--name-only", BASE, "HEAD").splitlines() if x]
    if thu:
        sai = ngoai_ds(ds + thu)
        if sai:
            raise Do("ngoài danh sách: " + ", ".join(sai))
        print("AC-7 --thu: không đường nào ngoài danh sách")
        return
    sai = ngoai_ds(ds)
    if sai:
        raise Do("ngoài danh sách: " + ", ".join(sai))
    print(f"AC-7 vùng vật: {len(ds)} tệp, đều trong danh sách, 0 tệp dưới plugins/")
    x = "plugins/acceptance-gate/lib/x.cjs"
    sai = ngoai_ds(ds + [x])
    if sai != [x]:
        raise Do(f"chiều đỏ --thu không đỏ đúng: {sai}")
    print(f"AC-7 --thu: đỏ đúng — {x}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", required=True)
    ap.add_argument("ac")
    ap.add_argument("--thu", action="append", default=[])
    a = ap.parse_args()
    root = Path(a.root)
    bang = {"AC-1": ac1, "AC-2": ac2, "AC-3": ac3, "AC-4": ac4, "AC-5": ac5, "AC-6": ac6}
    if a.ac not in bang and a.ac != "AC-7":
        print(f"do.py: không có tiêu chí {a.ac}")
        return 2
    try:
        git(root, "cat-file", "-e", f"{BASE}^{{commit}}")
        with tempfile.TemporaryDirectory(prefix=f"{SLUG}-") as t:
            if a.ac == "AC-7":
                ac7(root, Path(t), a.thu)
            else:
                bang[a.ac](root, Path(t))
    except Mu as e:
        print(f"{a.ac}: {e}")
        return 2
    except Do as e:
        print(f"{a.ac} ĐỎ: {e}")
        return 1
    print(f"{a.ac}: đạt")
    return 0


if __name__ == "__main__":
    sys.exit(main())
