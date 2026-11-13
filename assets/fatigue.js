// ===== shared fatigue relations (Marin factors, S-N line, criteria)
const FA_SURF={"Ground":[1.34,1.58,-0.085],"Machined or cold-drawn":[2.70,4.51,-0.265],"Hot-rolled":[14.4,57.7,-0.718],"As-forged":[39.9,272,-0.995]};
const FA_REL={"50":1,"90":0.897,"95":0.868,"99":0.814,"99.9":0.753};
const FA_KC={"Bending":1,"Axial":0.85,"Torsion":0.59};
function faSe0(Sut,us){return us?(Sut<=200?0.5*Sut:100):(Sut<=1400?0.5*Sut:700)}
function faKa(surf,Sut,us){const c=FA_SURF[surf];return (us?c[0]:c[1])*Sut**c[2]}
function faKb(d,us){return us?(d<=2?(d/0.3)**-0.107:0.91*d**-0.157):(d<=51?(d/7.62)**-0.107:1.51*d**-0.157)}
function faF(Sut,us){const s=Math.min(200,us?Sut:Sut/6.894757);return s<70?0.9:Math.round((1.06-2.8e-3*s+6.9e-6*s*s)*100)/100}
function faAB(Sut,Se,f){return {a:(f*Sut)**2/Se,b:-Math.log10(f*Sut/Se)/3}}
function faGood(sa,sm,Se,Sut){return 1/(sa/Se+sm/Sut)}
function faGerb(sa,sm,Se,Sut){if(sm<=0)return Se/sa;return 0.5*(Sut/sm)**2*(sa/Se)*(-1+Math.sqrt(1+(2*sm*Se/(Sut*sa))**2))}
function faAsme(sa,sm,Se,Sy){return 1/Math.sqrt((sa/Se)**2+(sm/Sy)**2)}
const faU=us=>us?"kpsi":"MPa";
function faSNplot(Sut,Se,f,mark){                                  // log-log S-N sketch, optional marked point [N,S]
  const X=N=>40+(Math.log10(N)-0)*68, Y=S=>250-200*(Math.log10(S)-Math.log10(0.6*Se))/(Math.log10(1.1*Sut)-Math.log10(0.6*Se));
  let g=gL(40,250,40,30,`stroke="#222" stroke-width="1.3" marker-end="url(#g-ax)"`)+gL(40,250,500,250,`stroke="#222" stroke-width="1.3" marker-end="url(#g-ax)"`);
  for(let e=0;e<=7;e++){g+=gL(X(10**e),250,X(10**e),255,`stroke="#222"`)+gT(X(10**e),272,`10<tspan baseline-shift="super" font-size="11">${e}</tspan>`,`text-anchor="middle" font-size="14"`)}
  g+=`<polyline points="${gF(X(1))},${gF(Y(Sut))} ${gF(X(1e3))},${gF(Y(f*Sut))} ${gF(X(1e6))},${gF(Y(Se))} ${gF(X(1e7))},${gF(Y(Se))}" fill="none" stroke="#7d5014" stroke-width="2.4"/>`;
  g+=gL(40,Y(f*Sut),X(1e3),Y(f*Sut),`stroke="#999" stroke-dasharray="4 3"`)+gL(40,Y(Se),X(1e6),Y(Se),`stroke="#999" stroke-dasharray="4 3"`);
  g+=gT(34,Y(Sut)+5,gSub("S","ut"),`text-anchor="end" font-size="15"`)+gT(34,Y(f*Sut)+5,`${gI("f")}${gSub("S","ut")}`,`text-anchor="end" font-size="15"`)+gT(34,Y(Se)+5,gSub("S","e"),`text-anchor="end" font-size="15"`);
  if(mark) g+=`<circle cx="${gF(X(mark[0]))}" cy="${gF(Y(mark[1]))}" r="5" fill="#aa1e28"/>`;
  g+=gT(500,292,`Cycles ${gI("N")}`,`text-anchor="end" font-size="15"`)+gT(48,26,`Fatigue strength ${gI("S")}<tspan baseline-shift="sub" font-size="12">f</tspan> (log scale)`,`font-size="15"`);
  return gSvg("-30 0 560 305",g,300);
}
