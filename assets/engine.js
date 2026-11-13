let curKey=null, cur=null;
const $=id=>document.getElementById(id);

function render(key,seed){
  curKey=key; const T=TEMPLATES[key];
  cur=T.generate(seed); const {p,s}=cur;
  $("typeSel").value=key; $("seedIn").value=seed;
  try{history.replaceState(null,"","#"+key+"-"+seed)}catch(e){}
  $("fig").innerHTML=T.figure(p,s);
  $("statement").innerHTML=T.statement(p,s);
  const fields=T.fields.filter(f=>!(f.skip&&f.skip(p)));
  $("answers").innerHTML=fields.map(f=>`<label for="in-${f.id}">${f.label}</label><span>${f.choices
    ?`<select id="in-${f.id}"><option value="">choose</option>${f.choices.map(c=>`<option>${c}</option>`).join("")}</select>`
    :f.expr?`<input id="in-${f.id}" type="text" class="expr" spellcheck="false" autocomplete="off">`
    :`<input id="in-${f.id}" type="text" inputmode="decimal"> <span class="note">${f.unit}</span>`}</span><span class="mark" id="mk-${f.id}"></span>`).join("");
  $("ansNote").textContent=(T.symbolic?"Answers are checked for algebraic equivalence. ":"Answers within 2% are accepted. ")+T.note;
  const sol=$("solution"); sol.style.display="none"; sol.innerHTML=T.solution(p,s);
  $("solBtn").textContent="Show solution";
}

function check(){
  const T=TEMPLATES[curKey], truth=T.truth(cur.s);
  const scale=Math.max(...Object.values(truth).filter(v=>typeof v==="number").map(Math.abs));
  T.fields.filter(f=>!(f.skip&&f.skip(cur.p))).forEach(f=>{
    const el=$("mk-"+f.id), raw=$("in-"+f.id).value.replace(/,/g,"").trim();
    if(raw===""){el.textContent="";el.className="mark";return}
    if(f.choices){const ok=raw===truth[f.id];el.textContent=ok?"Correct":"Not yet";el.className="mark "+(ok?"ok":"bad");return}
    if(f.expr){const r=exprEquivalent(raw,f);el.textContent=r.ok?"Correct":r.msg?"Cannot read: "+r.msg:"Not yet";el.className="mark "+(r.ok?"ok":"bad");return}
    let v=parseFloat(raw), t=truth[f.id];
    if(!f.signed){v=Math.abs(v);t=Math.abs(t)}
    const tol=f.tolAbs!==undefined?f.tolAbs:0.02*Math.max(Math.abs(t),f.signed?0.05*scale:0);
    const ok=isFinite(v)&&Math.abs(v-t)<=tol;
    el.textContent=ok?"Correct":"Not yet"; el.className="mark "+(ok?"ok":"bad");
  });
}

const newSeed=()=>1+Math.floor(Math.random()*999999);
$("typeSel").innerHTML=Object.entries(TEMPLATES).map(([k,t])=>`<option value="${k}">${t.name}</option>`).join("");
$("typeSel").onchange=e=>render(e.target.value,newSeed());
$("newBtn").onclick=()=>render(curKey,newSeed());
$("loadBtn").onclick=()=>{const v=parseInt($("seedIn").value,10);if(v>0)render(curKey,v)};
$("checkBtn").onclick=check;
$("solBtn").onclick=e=>{const s=$("solution"),show=s.style.display!=="block";
  s.style.display=show?"block":"none";e.target.textContent=show?"Hide solution":"Show solution"};
(function(){
  const m=/^#([a-z-]+)-(\d+)$/.exec(location.hash);
  if(m&&TEMPLATES[m[1]]) render(m[1],parseInt(m[2],10));
  else render(Object.keys(TEMPLATES)[0],newSeed());
})();
