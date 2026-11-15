# Usage: python set_error_form.py <repository folder> "<pre-filled form link>" [--dry-run]
# The pre-filled link comes from the Google Form menu: Get pre-filled link, with any option chosen
# in the Course dropdown and the sample answers CHAPTER, TYPE, SEED, LINK typed into the four text questions.
import re, sys, pathlib, urllib.parse
root = pathlib.Path(sys.argv[1]); link = sys.argv[2]; dry = "--dry-run" in sys.argv
u = urllib.parse.urlparse(link)
base = u.scheme + "://" + u.netloc + u.path
if not base.endswith("/viewform"): sys.exit("link must be a .../viewform pre-filled link")
pq = urllib.parse.parse_qs(u.query)
q = {v[0]: k for k, v in pq.items()}
course_ent = [k for k, v in pq.items() if v[0] in ("Statics", "Thermodynamics", "Mechanics of Materials", "Machine Design", "System Dynamics")]
if len(course_ent) != 1: sys.exit("choose one option in the Course dropdown before copying the link")
try: ent = {k: q[k.upper()] for k in ("chapter", "type", "seed", "link")}
except KeyError as e: sys.exit("sample answer %s not found in the link" % e)
entry = "entry:{" + ",".join('%s:"%s"' % (k, ent[k]) for k in ("chapter", "type", "seed", "link")) + ',course:"%s"}' % course_ent[0]
courses = {"statics": "Statics", "thermodynamics": "Thermodynamics", "system-dynamics": "System Dynamics",
           "mechanics-of-materials": "Mechanics of Materials", "machine-design": "Machine Design"}
rx_ret = re.compile(r'return FORM\.url\+"\?"')
rx_form = re.compile(r'url:"[^"]*",entry:\{[^}]*\}')
rx_ch = re.compile(r'chapter:(typeof document!=="undefined"\?document\.title\.replace\(/ Problem Generator\$/,""\):"")')
n = 0
for d, course in courses.items():
    for p in sorted((root / d).glob("*ProblemGenerator.html")):
        t = p.read_bytes().decode("utf-8")
        if "const FORM" not in t: print("no report button (skipped)", p.relative_to(root)); continue
        s = rx_form.sub(lambda m: 'url:"%s",%s' % (base, entry), t, count=1)
        s = s.replace('const FORM={', 'const FORM={course:"%s",' % course, 1) if 'course:"%s",' % course not in s else s
        if "FORM.entry.course" not in s: s = rx_ret.sub('q.set(FORM.entry.course,FORM.course);return FORM.url+"?"', s)
        if course and course != "Mechanics of Materials": s = rx_ch.sub(lambda m: 'chapter:%s' % ('"%s: "+(%s)' % (course, m.group(1))), s, count=1) if ('"%s: "' % course) not in s else s
        if s != t:
            n += 1; print("changed", p.relative_to(root))
            if not dry: p.write_bytes(s.encode("utf-8"))
print(n, "files", "would change" if dry else "changed")
