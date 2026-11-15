# Usage: python not_yet_to_incorrect.py <repository folder> [--dry-run]
import sys, pathlib
root = pathlib.Path(sys.argv[1]); dry = "--dry-run" in sys.argv
n = 0
for p in sorted(root.glob("*/*ProblemGenerator.html")):
    t = p.read_bytes().decode("utf-8"); u = t.replace('"Not yet"', '"Incorrect"')
    if u != t:
        n += 1; print("changed", p.relative_to(root))
        if not dry: p.write_bytes(u.encode("utf-8"))
print(n, "files", "would change" if dry else "changed")
