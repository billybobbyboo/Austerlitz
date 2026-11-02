/* Post-Stage-8 final audit, area "geography": the drawn streams against today's (OpenStreetMap, through the Nominatim responses fetch-places.js
   saved: the Říčka, relation 7052180, which Nominatim also returns for "Zlatý potok"; the Litava 7033415; the Rakovec 10623074; the Roketnice
   13723335; the Tvaroženský potok, way 81922374; the Pracký potok 18933499). Today's channels are regulated, so a gap here measures the drawn
   line against today's, not against 1805's. Per drawn stream: the distance from each of its points (every 0.5 map units) to today's line, by
   reach; per today's stream inside the frame: the distance to the nearest drawn stream, so that a stream drawn nowhere shows. Also the Santon,
   Girzikowitz and Bosenitz against the drawn and today's lines. Writes docs/audit-post8-evidence/geography/waterways.json.
   node tools/audit-post8/geography/waterways.js [ROOT]   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(process.argv[2]||path.join(__dirname,"..","..",".."));
const EV=path.join(__dirname,"..","..","..","docs","audit-post8-evidence","geography"), RAW=path.join(EV,"raw");
const GEOREF=require(path.join(ROOT,"geo.js")), L=require("./lib.js");
const W=fs.readFileSync(path.join(ROOT,"world.js"),"utf8"), acorn=require(path.join(ROOT,"node_modules","acorn"));
const AST=acorn.parse(W,{ecmaVersion:2020});
const arr=name=>{ for(const n of AST.body) if(n.type==="VariableDeclaration") for(const d of n.declarations) if(d.id.name===name) return Function('"use strict";return ('+W.slice(d.init.start,d.init.end)+');')(); throw new Error(name); };
const GB=arr("GOLDBACH_M"), LI=arr("LITAVA_M"), BR=arr("BROOKS_M");
const osm=f=>{ const J=JSON.parse(fs.readFileSync(path.join(RAW,f),"utf8")); const g=J[0].geojson; return (g.type==="LineString"?[g.coordinates]:g.coordinates).map(l=>l.map(c=>GEOREF.toMap(c[1],c[0]))); };
const inF=p=>p[0]>=0&&p[0]<=680&&p[1]>=0&&p[1]<=500;
const TODAY={ricka:osm("nominatim-water-ricka.json")[0], litava:osm("nominatim-water-litava.json")[0], rakovec:osm("nominatim-water-rakovec.json")[0],
  roketnice:osm("nominatim-water-roketnice.json")[0], tvarozensky:osm("nominatim-water-tvarozensky.json")[0], pracky:osm("nominatim-water-prace_potok.json")[0]};
const DRAWN={goldbach:GB, litava:LI, "brooks0 (from Blasowitz)":BR[0], "brooks1 (Pratzen brook)":BR[1], "brooks2 (south of the Pratzeberg)":BR[2], "brooks3 (west of Puntowitz-Kobelnitz)":BR[3], "brooks4 (Rakovec)":BR[4]};
function resample(Lp,step){ const out=[Lp[0]]; for(let i=1;i<Lp.length;i++){ const a=Lp[i-1], b=Lp[i], d=Math.hypot(b[0]-a[0],b[1]-a[1]), n=Math.max(1,Math.ceil(d/step)); for(let k=1;k<=n;k++) out.push([a[0]+(b[0]-a[0])*k/n, a[1]+(b[1]-a[1])*k/n]); } return out; }
const m=u=>Math.round(u*GEOREF.KM_PER_MAP*1000);
const near=(p,lines)=>{ let best=null; for(const [k,Lp] of Object.entries(lines)){ const r=L.polyDist(p,Lp); if(!best||r.d<best.d) best={k,d:r.d}; } return best; };
const out={tool:"tools/audit-post8/geography/waterways.js", note:"today's channels are regulated: a gap measures the drawn line against today's, not against 1805's", drawn:{}, today:{}, places:{}};
/* each drawn stream: distance to the nearest of today's streams, in reaches of 10 map units of y (or along the line) */
for(const [k,Lp] of Object.entries(DRAWN)){ const P=resample(Lp,0.5).filter(inF); const rows=P.map(p=>({p, n:near(p,TODAY)}));
  const reaches=[]; let cur=null; rows.forEach((r,i)=>{ const key=Math.floor(i/20); if(!cur||cur.key!==key){ cur={key, from:r.p.map(v=>+v.toFixed(0)), dmax:0, dsum:0, n:0, to:null, nearest:{}}; reaches.push(cur); }
    cur.to=r.p.map(v=>+v.toFixed(0)); cur.dmax=Math.max(cur.dmax,r.n.d); cur.dsum+=r.n.d; cur.n++; cur.nearest[r.n.k]=(cur.nearest[r.n.k]||0)+1; });
  out.drawn[k]={points:P.length, medianM:m(rows.map(r=>r.n.d).sort((a,b)=>a-b)[Math.floor(rows.length/2)]), maxM:m(Math.max(...rows.map(r=>r.n.d))),
    reaches:reaches.map(r=>({from:r.from, to:r.to, meanM:m(r.dsum/r.n), maxM:m(r.dmax), nearestToday:Object.keys(r.nearest).sort((a,b)=>r.nearest[b]-r.nearest[a])[0]}))}; }
/* each of today's streams inside the frame: distance to the nearest drawn stream */
for(const [k,Lp] of Object.entries(TODAY)){ const P=resample(Lp,0.5).filter(inF); if(!P.length){ out.today[k]={points:0}; continue; }
  const rows=P.map(p=>({p, n:near(p,DRAWN)})), far=rows.filter(r=>r.n.d*GEOREF.KM_PER_MAP>0.3);
  out.today[k]={points:P.length, lengthKmInFrame:+(P.length*0.5*GEOREF.KM_PER_MAP).toFixed(2), medianM:m(rows.map(r=>r.n.d).sort((a,b)=>a-b)[Math.floor(rows.length/2)]),
    over300mKm:+(far.length*0.5*GEOREF.KM_PER_MAP).toFixed(2), over300mSpans:(()=>{ const sp=[]; let c=null; rows.forEach(r=>{ const f=r.n.d*GEOREF.KM_PER_MAP>0.3; if(f){ if(!c){ c={from:r.p.map(v=>+v.toFixed(0)), n:0}; sp.push(c); } c.to=r.p.map(v=>+v.toFixed(0)); c.n++; c.max=Math.max(c.max||0,m(r.n.d)); } else c=null; }); return sp.filter(s=>s.n>=6).map(s=>({from:s.from,to:s.to,km:+(s.n*0.5*GEOREF.KM_PER_MAP).toFixed(2),maxM:s.max})); })()}; }
/* the places beside the upper Goldbach */
[["santon",GEOREF.GT.santon.map],["girzikowitz",GEOREF.GT.girzikowitz.map],["bosenitz",GEOREF.GT.bosenitz.map],["puntowitz",GEOREF.GT.puntowitz.map],["kobelnitz",GEOREF.GT.kobelnitz.map],["schlapanitz",GEOREF.GT.schlapanitz.map]].forEach(([k,p])=>{
  const side=(Lp)=>{ const r=L.polyDist(p,Lp), a=Lp[r.i], b=Lp[r.i+1], cr=(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]); return {m:m(r.d), side:cr>0?"west/right bank":"east/left bank"}; };
  out.places[k]={drawnGoldbach:side(GB), todayRoketnice:side(TODAY.roketnice), todayRicka:side(TODAY.ricka), todayTvarozensky:side(TODAY.tvarozensky)}; });
fs.writeFileSync(path.join(EV,"waterways.json"),JSON.stringify(out,null,1));
for(const [k,v] of Object.entries(out.drawn)){ console.log("drawn "+k+": median "+v.medianM+" m, max "+v.maxM+" m from today's nearest"); v.reaches.forEach(r=>console.log("    "+JSON.stringify(r.from)+"->"+JSON.stringify(r.to)+" mean "+r.meanM+" max "+r.maxM+" ("+r.nearestToday+")")); }
for(const [k,v] of Object.entries(out.today)) console.log("today "+k+": "+JSON.stringify(v));
for(const [k,v] of Object.entries(out.places)) console.log("place "+k+": "+JSON.stringify(v));
