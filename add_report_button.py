# Usage: python add_report_button.py <repository folder> [--dry-run]
# Adds the "Report an error" button to the Machine Design chapters, then run set_error_form.py to set the form.
import re, sys, pathlib
root = pathlib.Path(sys.argv[1]); dry = "--dry-run" in sys.argv
CSS = '  .reportrow{margin-top:12px;padding-top:12px;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:10px;align-items:center;font-family:system-ui,sans-serif;font-size:.92rem;color:var(--muted)}\n'
ROW = '''    <div class="reportrow" id="reportRow" style="display:none"><span>Found a mistake in a problem or its solution?</span> <button class="ghost" id="reportBtn">Report an error</button></div>
'''
JS = '''
// ===== error report form (Google Form with prefilled fields)
// Chapter, problem type, seed, and page link are read from the page and prefilled in the Google Form. Leave FORM.url empty to hide the button.
const FORM={chapter:typeof document!=="undefined"?document.title.replace(/ Problem Generator$/,""):"",url:"",entry:{chapter:"",type:"",seed:"",link:""}};
function reportUrl(){
  const q=new URLSearchParams({usp:"pp_url"});
  const nm=(typeof TEMPLATES!=="undefined"&&typeof curKey!=="undefined"&&TEMPLATES[curKey])?TEMPLATES[curKey].name:FORM.chapter;
  q.set(FORM.entry.chapter,FORM.chapter);q.set(FORM.entry.type,nm+((typeof hunting==="function"&&hunting())?" (find the error)":""));
  q.set(FORM.entry.seed,String(document.getElementById("seedIn").value||""));q.set(FORM.entry.link,location.href);
  return FORM.url+"?"+q.toString();
}
if(typeof document!=="undefined"&&document.getElementById("reportBtn")){
  if(FORM.url)document.getElementById("reportRow").style.display="";
  document.getElementById("reportBtn").onclick=()=>window.open(reportUrl(),"_blank","noopener");
}
'''
n = 0
for p in sorted((root / "machine-design").glob("*ProblemGenerator.html")):
    t = p.read_bytes().decode("utf-8")
    if 'id="reportBtn"' in t: print("already has button", p.name); continue
    a = re.search(r'(<span class="note" id="(?:ansNote|dzNote)"></span>\n    </div>\n)', t)
    i = t.rfind("</script>")
    if not a or i < 0 or "</style>" not in t: print("layout not recognised (skipped)", p.name); continue
    s = t[:a.end()] + ROW + t[a.end():]
    s = s.replace("</style>", CSS + "</style>", 1)
    i = s.rfind("</script>")
    s = s[:i].rstrip("\n") + "\n" + JS + s[i:]
    n += 1; print("changed", p.name)
    if not dry: p.write_bytes(s.encode("utf-8"))
print(n, "files", "would change" if dry else "changed")
