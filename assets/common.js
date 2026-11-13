// ----- seeded random numbers
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);
  t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const pick=(r,arr)=>arr[Math.floor(r()*arr.length)];
const range=(a,b,s)=>{const o=[];for(let v=a;v<=b+1e-9;v+=s)o.push(+v.toFixed(4));return o};

function fmt(v,d=0){if(Math.abs(v)<0.5*10**-d)v=0;return Number(v).toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d})}
// ===== shared helpers for the problem types below
const SF_MAT=[["AISI 1006 CD",280,330,41,48],["AISI 1015 HR",190,340,27.5,50],["AISI 1018 CD",370,440,54,64],["AISI 1020 CD",390,470,57,68],
  ["AISI 1030 HR",260,470,37.5,68],["AISI 1035 CD",460,550,67,80],["AISI 1040 HR",290,520,42,76],["AISI 1050 CD",580,690,84,100]];
const gF=v=>v.toFixed(1);
const gL=(x1,y1,x2,y2,attr)=>`<line x1="${gF(x1)}" y1="${gF(y1)}" x2="${gF(x2)}" y2="${gF(y2)}" ${attr}/>`;
const gT=(x,y,t,attr="")=>`<text x="${gF(x)}" y="${gF(y)}" ${attr}>${t}</text>`;
const gI=v=>`<tspan font-style="italic">${v}</tspan>`;
const gSub=(a,b)=>`${gI(a)}<tspan baseline-shift="sub" font-size="13">${b}</tspan>`;
const G_AR=`stroke="#aa1e28" stroke-width="3" marker-end="url(#g-ar)"`, G_DIM=`stroke="#222" stroke-width="0.9" marker-start="url(#g-dm)" marker-end="url(#g-dm)"`;
const G_EXT=`stroke="#999" stroke-width="0.8"`, G_CL=`stroke="#888" stroke-width="0.9" stroke-dasharray="10 3 2 3"`, G_PART=`fill="#eec878" stroke="#7d5014" stroke-width="1.8"`;
function gSvg(vb,body,maxh=380){return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" font-family="Georgia,serif" font-size="18" style="max-height:${maxh}px">
  <defs><marker id="g-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto"><path d="M0,0 L10,5 L0,10 L3,5 z" fill="#aa1e28"/></marker>
  <marker id="g-ax" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 L3,5 z" fill="#222"/></marker>
  <marker id="g-dm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L10,5 L0,9 z" fill="#222"/></marker>
  <pattern id="g-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#c9d5e2"/><line x1="0" y1="0" x2="0" y2="7" stroke="#28405a" stroke-width="1"/></pattern></defs>${body}</svg>`}
function gMatTable(rows,us,cols){return `<table><tr><th>Material</th>${cols.map(c=>`<th>${c} (${us?"kpsi":"MPa"})</th>`).join("")}</tr>${rows.map(r=>`<tr><td>${r[0]}</td>${r.slice(1).map(v=>`<td>${fmt(v,1)}</td>`).join("")}</tr>`).join("")}</table>`}
const gSF=us=>SF_MAT.map(m=>[m[0],us?m[3]:m[1],us?m[4]:m[2]]);
