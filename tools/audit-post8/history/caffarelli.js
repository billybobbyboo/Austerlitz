/* Caffarelli's division against Bagration's corps and the highway (world.js ROADS[0], as corrected in 8K), every 15 minutes from 11:15; the
   objective and grade the dossier shows (stateAt carries both forward). */
const fs=require('fs'), path=require('path');
const {load,ISO}=require('./load.js'); load({state:true});
const acorn=require(path.join(ISO,'node_modules','acorn')); const wsrc=fs.readFileSync(path.join(ISO,'world.js'),'utf8'); const AST=acorn.parse(wsrc,{ecmaVersion:2020});
let ROADSM=null; for(const n of AST.body){ if(n.type==='VariableDeclaration') for(const d of n.declarations){ if(d.id.name==='ROADS') ROADSM=(0,eval)('('+wsrc.slice(d.init.start,d.init.end)+')'); } }
const hw=ROADSM[0].pts||ROADSM[0].p||ROADSM[0];
function distPoly(p,line){ let best=1e9; for(let j=0;j<line.length-1;j++){ const a=line[j],b=line[j+1]; const vx=b[0]-a[0],vy=b[1]-a[1]; const L=vx*vx+vy*vy; let t=L?((p[0]-a[0])*vx+(p[1]-a[1])*vy)/L:0; t=Math.max(0,Math.min(1,t)); const d=Math.hypot(p[0]-a[0]-t*vx,p[1]-a[1]-t*vy); if(d<best) best=d; } return best; }
console.log('highway (ROADS[0]) name: '+(ROADSM[0].n||ROADSM[0].name||'?')+', points '+JSON.stringify(hw).slice(0,200));
for(let t=675;t<=1020;t+=15){ clock=t; const ph=phaseAt(t); const c=posNow('caffarelli'), b=posNow('bag'), s=posNow('suchet'); const sc=stateAt('caffarelli',ph);
  let nearest=null,nd=1e9; Object.keys(units).forEach(k=>{ const g=FORMATIONS[k]; if(g.nation==='fr'||g.arm==='hq') return; const q=posNow(k); if(!q) return; const d=Math.hypot(q[0]-c[0],q[1]-c[1]); if(d<nd){nd=d;nearest=k;} });
  console.log(`${fmtClock(t)} caffarelli [${c.map(x=>x.toFixed(0))}] ${sc.st} cf ${sc.cf} obj "${sc.obj}"; to bag ${(Math.hypot(c[0]-b[0],c[1]-b[1])*KM_PER_MAP).toFixed(2)} km; to the highway ${(distPoly(c,hw)*KM_PER_MAP).toFixed(2)} km; suchet to bag ${(Math.hypot(s[0]-b[0],s[1]-b[1])*KM_PER_MAP).toFixed(2)} km; caffarelli's nearest enemy ${nearest} ${(nd*KM_PER_MAP).toFixed(2)} km`); }
