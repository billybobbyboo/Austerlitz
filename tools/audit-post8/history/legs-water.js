/* Legs and anchors against the drawn water (world.js GOLDBACH_M, BROOKS_M, LITAVA_M) in map units, and every anchor's side of the Goldbach
   against what its act says. The movement audit (app.js auditMovement) tests open water (the meres) and the marshy bottom away from a village
   or road; it does not test a crossing of the Goldbach, a brook or the Litava, nor an act's "west/east of the Goldbach". */
const fs=require('fs'), path=require('path');
const {load,ISO}=require('./load.js'); const M=load();
const wsrc=fs.readFileSync(path.join(ISO,'world.js'),'utf8');
const acorn=require(path.join(ISO,'node_modules','acorn'));
const AST=acorn.parse(wsrc,{ecmaVersion:2020});
function grab(name){ for(const n of AST.body){ if(n.type==='VariableDeclaration') for(const d of n.declarations){ if(d.id.name===name) return (0,eval)('('+wsrc.slice(d.init.start,d.init.end)+')'); } } throw new Error('no '+name); }
const GB=grab('GOLDBACH_M'), BR=grab('BROOKS_M'), LI=grab('LITAVA_M'), ROADS_M=null;
const KM=KM_PER_MAP;
function segX(p1,p2,p3,p4){ const d=(p2[0]-p1[0])*(p4[1]-p3[1])-(p2[1]-p1[1])*(p4[0]-p3[0]); if(Math.abs(d)<1e-12) return null;
  const ua=((p3[0]-p1[0])*(p4[1]-p3[1])-(p3[1]-p1[1])*(p4[0]-p3[0]))/d, ub=((p3[0]-p1[0])*(p2[1]-p1[1])-(p3[1]-p1[1])*(p2[0]-p1[0]))/d;
  return (ua>=0&&ua<=1&&ub>=0&&ub<=1)?[p1[0]+ua*(p2[0]-p1[0]),p1[1]+ua*(p2[1]-p1[1])]:null; }
function crossings(poly,line){ const out=[]; for(let i=0;i<poly.length-1;i++) for(let j=0;j<line.length-1;j++){ const x=segX(poly[i],poly[i+1],line[j],line[j+1]); if(x) out.push(x); } return out; }
function distPoly(p,line){ let best=1e9; for(let j=0;j<line.length-1;j++){ const a=line[j],b=line[j+1]; const vx=b[0]-a[0],vy=b[1]-a[1]; const L=vx*vx+vy*vy; let t=L?((p[0]-a[0])*vx+(p[1]-a[1])*vy)/L:0; t=Math.max(0,Math.min(1,t)); const d=Math.hypot(p[0]-a[0]-t*vx,p[1]-a[1]-t*vy); if(d<best) best=d; } return best; }
/* side of the Goldbach at a point's northing: the stream's x at that y (the polyline runs north to south over y 109..415) */
function gbX(y){ for(let j=0;j<GB.length-1;j++){ const a=GB[j],b=GB[j+1]; if((a[1]<=y&&y<=b[1])||(b[1]<=y&&y<=a[1])){ if(a[1]===b[1]) return Math.min(a[0],b[0]); return a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]); } } return null; }
function nearVillage(p){ let best=null; VILLAGES.forEach(v=>{ const d=Math.hypot(p[0]-v[1],p[1]-v[2]); if(!best||d<best.d) best={n:v[0],d}; }); return best; }
const rows=[], sides=[];
Object.keys(FORMATIONS).forEach(id=>{ const f=FORMATIONS[id]; if(!f.track) return; const A=anchorList(id);
  A.forEach((b,i)=>{ if(b.p===null) return; const e=f.track[b.ph]; const x=gbX(b.p[1]);
    const act=(e.act||'')+' '+(e.obj||'');
    const side=x==null?'(beyond the stream\'s span)':(b.p[0]>x?'east':'west')+' '+(Math.abs(b.p[0]-x)*KM*1000).toFixed(0)+' m';
    let claim=null; const m=act.match(/(west|east) of the Goldbach|across the (stream|Goldbach)|crosses the (brook|Goldbach|stream)|(west|east)(ern)? bank|to the stream/i); if(m) claim=m[0];
    sides.push(`${id}@${b.ph} [${b.p}] ${side}${claim?'  act: "'+claim+'"':''}`);
    if(i===0||A[i-1].p===null) return; const a=A[i-1]; const pp=legPath(a,b); const pts=[]; for(let k=0;k<=60;k++) pts.push(pointOnPath(pp,k/60));
    const cg=crossings(pts,GB), cl=crossings(pts,LI); const cb=[].concat(...BR.map(br=>crossings(pts,br)));
    if(cg.length||cl.length||cb.length){ const w=b.w||legWindow(a,b);
      const desc=c=>c.map(q=>{ const v=nearVillage(q); const wa=wetAt(q[0],q[1]); return `[${q[0].toFixed(1)},${q[1].toFixed(1)}] ${v?(v.d*KM*1000).toFixed(0)+' m from '+v.n:''} road ${wa.road.toFixed(2)} marsh ${wa.marsh.toFixed(2)}`; }).join('; ');
      rows.push(`${id} ${a.ph}->${b.ph} (${fmtClock(w[0])}-${fmtClock(w[1])}${b.ice?', ice':''})`+(cg.length?`\n    Goldbach x${cg.length}: ${desc(cg)}`:'')+(cb.length?`\n    brook x${cb.length}: ${desc(cb)}`:'')+(cl.length?`\n    Litava x${cl.length}: ${desc(cl)}`:'')+`\n    act at arrival: ${(e.act||'(none)').slice(0,140)}`); } });
});
console.log('== legs crossing the Goldbach, a brook or the Litava (map units; road/marsh = the cover rasters at the crossing) ==');
rows.forEach(r=>console.log(r));
console.log('\n== every anchor: its side of the Goldbach at its northing, and an act naming a side or a crossing ==');
sides.forEach(s=>console.log(s));
