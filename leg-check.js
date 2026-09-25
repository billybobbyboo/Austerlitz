/* Try proposed anchor/via changes in memory against the live movement audit (from app.js via the helpers). */
const fs=require('fs'); const M=require('../_world_mod.js');
global.W=M.W; global.height=M.height; global.hAt=M.hAt; global.smoothstep=M.smoothstep; global.covAt=M.covAt; global.SATS=M.SATS; global.MENI=M.MENI; global.VILLAGES=M.VILLAGES;
M.buildCover(); M.buildGrid();
['covWater','covRoad','covMarsh'].forEach(k=>Object.defineProperty(global,k,{get:()=>M[k]}));
eval(fs.readFileSync('data.js','utf8')); eval(fs.readFileSync('_clock.js','utf8'));
const G=GEOREF, R=p=>[Math.round(p[0]),Math.round(p[1])];
const off=(k,e,n)=>{ const ll=G.toGeo(...G.GT[k].map); return R(G.toMap(ll[0]+n/111.13, ll[1]+e/(111.32*Math.cos(49.14*Math.PI/180)))); };
const PROPOSAL=JSON.parse(process.argv[2]||'{}');
/* PROPOSAL: {id:{ph:{p:[..]|"place:dx:dy", via:[[..]]}}} */
Object.keys(PROPOSAL).forEach(id=>Object.keys(PROPOSAL[id]).forEach(ph=>{ const e=FORMATIONS[id].track[ph]=FORMATIONS[id].track[ph]||{}; const pr=PROPOSAL[id][ph];
  if(pr.p) e.p=(typeof pr.p==='string')?off(...pr.p.split(':').map((v,i)=>i?+v:v)):pr.p; if(pr.via!==undefined) e.via=pr.via; }));
Object.keys(FORMATIONS).forEach(id=>{ delete FORMATIONS[id]._anchors; });
const ids=process.argv[3]?process.argv[3].split(','):Object.keys(PROPOSAL);
ids.forEach(id=>{ const A=anchorList(id); for(let i=0;i<A.length-1;i++){ const a=A[i],b=A[i+1]; if(a.p===null||b.p===null) continue; delete b._path;
  const pp=legPath(a,b), w=legWindow(a,b), km=pp.len*KM_PER_MAP, kmh=km/((w[1]-w[0])/60), x=crossingProblem(pp,b.ice);
  console.log(id.padEnd(10)+(a.ph+'->'+b.ph).padEnd(6)+JSON.stringify(a.p).padEnd(10)+'->'+JSON.stringify(b.p).padEnd(10)+(b.via?' via '+JSON.stringify(b.via):'').padEnd(24)+km.toFixed(2)+' km '+kmh.toFixed(2)+' km/h'+(kmh>(SPEED_CEIL[FORMATIONS[id].arm]||5)?'  RATE!':'')+(x?'  '+x.why+' at '+JSON.stringify(x.at.map(Math.round)):'')); } });
