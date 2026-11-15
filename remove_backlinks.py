# Usage: python remove_backlinks.py <repository folder> [--dry-run]
import re, sys, pathlib
root = pathlib.Path(sys.argv[1]); dry = "--dry-run" in sys.argv
rules = [(re.compile(r' <a href="index\.html">All chapters</a>'), ''),
         (re.compile(r'<a href="index\.html"[^>]*>([^<]*)</a>'), r'\1')]
n = 0
for p in sorted(root.glob("*/*ProblemGenerator.html")):
    t = p.read_bytes().decode("utf-8"); u = t
    for rx, rep in rules: u = rx.sub(rep, u)
    if u != t:
        n += 1; print("changed", p.relative_to(root))
        if not dry: p.write_bytes(u.encode("utf-8"))
print(n, "files", "would change" if dry else "changed")
