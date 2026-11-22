import subprocess, sys, json, collections
repo, since = sys.argv[1], sys.argv[2]
def git(*a, check=True):
    r = subprocess.run(["git", "-C", repo, *a], capture_output=True, text=True)
    if check and r.returncode != 0:
        raise SystemExit(f"git {a} -> {r.returncode}: {r.stderr[:300]}")
    return r
fp = set(git("rev-list", "--first-parent", "origin/main").stdout.split())
cands = []
for line in git("log", "origin/main", "--merges", f"--since={since}", "--format=%H %P %cI").stdout.splitlines():
    h, *rest = line.split()
    ps, when = rest[:-1], rest[-1]
    if len(ps) != 2 or h in fp:
        continue
    if ps[1] in fp:
        cands.append((h, ps[0], ps[1], when))
    elif ps[0] in fp:
        cands.append((h, ps[1], ps[0], when))
def run(label, attrs, driver):
    open(f"{repo}/.git/info/attributes", "w").write(attrs)
    git("config", "--unset-all", "merge.generated-file.driver", check=False)
    if driver:
        git("config", "merge.generated-file.driver", "true")
    conf = 0; files = collections.Counter(); only = collections.Counter(); per = {}
    for h, ours, theirs, when in cands:
        r = git("merge-tree", "--write-tree", "--name-only", "--no-messages", ours, theirs, check=False)
        if r.returncode not in (0, 1):
            raise SystemExit(f"merge-tree {h}: {r.returncode} {r.stderr[:200]}")
        names = sorted(set(r.stdout.splitlines()[1:])) if r.returncode == 1 else []
        per[h] = names
        if names:
            conf += 1
            for n in names: files[n] += 1
            if len(names) == 1: only[names[0]] += 1
    return {"label": label, "merges": len(cands), "conflicted": conf, "top": files.most_common(8), "only": only.most_common(5), "per": per}
out = [
 run("R1 không driver (trần)", "", False),
 run("R2 như hôm nay: driver + dòng PRODUCT-MAP", "PRODUCT-MAP.md merge=generated-file\n", True),
 run("R3 thêm dòng LO-TRINH", "PRODUCT-MAP.md merge=generated-file\nLO-TRINH.html merge=generated-file\n", True),
]
open(f"{repo}/.git/info/attributes", "w").write("")
git("config", "--unset-all", "merge.generated-file.driver", check=False)
for o in out:
    print(f"== {o['label']}: {o['conflicted']}/{o['merges']} lần gộp ngược có xung đột")
    print("   tệp:", ", ".join(f"{n} {c}" for n, c in o["top"]))
    print("   chỉ một tệp:", ", ".join(f"{n} {c}" for n, c in o["only"]))
r2, r3 = out[1]["per"], out[2]["per"]
print("== R2→R3: lần gộp thành sạch:", sum(1 for h in r2 if r2[h] and not r3[h]), "· còn xung đột:", sum(1 for h in r3 if r3[h]))
json.dump({o["label"]: {k: v for k, v in o.items() if k != "per"} for o in out}, open(sys.argv[3], "w"), ensure_ascii=False, indent=1)
