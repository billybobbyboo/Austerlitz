/* v-batch-srcgeo (audit after Stage 8, verification): geography #3 and #7 re-measured in node (no page) through the geography area's loader
   (tools/audit-post8/geography/lib.js, the real sources of ROOT), printing only, writing nothing: the Pratzen church the planner draws against
   LANDMARK_SITES.church.Pratzen; the building centres on the drawn village class (drawnCover 5) at Sokolnitz, Telnitz, Kobelnitz, Puntowitz and
   Satschan; and coverClass's order and the MARSH ellipses' normalised distance at those villages' points.
   node church.js ROOT   (ROOT: an isolated copy whose sources are md5-identical to the audited build's) */
"use strict";
const path=require("path"), vm=require("vm");
const ROOT=path.resolve(process.argv[2]);
const L=require(path.join(__dirname,"..","..","geography","lib.js")), G=L.load(ROOT,{clock:false});
vm.runInContext("var __WP=woodsPlan(); var __T=__WP.broad.concat(__WP.conif); var __B=planBuildings8g(__T);",G);
const B=G.__B, R=G.GEOREF, mpw=R.M_PER_WORLD;
const toMap=w=>[w[0]*R.MAP_PER_WORLD+R.WORLD_ORIGIN[0], w[1]*R.MAP_PER_WORLD+R.WORLD_ORIGIN[1]];
const out={buildings:B.length};
const pc=B.filter(b=>b.village==="Pratzen"&&(b.church||b.part==="church"||b.part==="church nave")&&b.R)[0];
const site=G.W(G.LANDMARK_SITES.church.Pratzen[0],G.LANDMARK_SITES.church.Pratzen[1]);
out.pratzenChurch={part:pc.part,map:toMap([pc.R.x,pc.R.z]).map(v=>+v.toFixed(2)),toSiteM:Math.round(Math.hypot(pc.R.x-site[0],pc.R.z-site[1])*mpw),
  toSiteWorldUnits:+Math.hypot(pc.R.x-site[0],pc.R.z-site[1]).toFixed(2),selfTestToleranceWorldUnits:5.0};
const V={};
B.forEach(b=>{ if(!b.R||!["Sokolnitz","Telnitz","Kobelnitz","Puntowitz","Satschan"].includes(b.village)) return;
  if(b.landmark&&!(b.church||b.part==="chapel"||b.part==="church")) return; if(b.part==="fence"||b.part==="churchyard wall") return;
  const q=V[b.village]||(V[b.village]={all:0,village:0,marsh:0,water:0,other:0}); q.all++;
  const c=G.drawnCover(b.R.x,b.R.z); if(c===5) q.village++; else if(c===2) q.marsh++; else if(c===3) q.water++; else q.other++; });
out.buildingsOnClass=V;
const ell=(p,m)=>Math.hypot((p[0]-m.c[0])/m.rx,(p[1]-m.c[1])/m.ry);
out.villageCentreInMarsh={};
G.VILLAGES.filter(v=>["Sokolnitz","Telnitz","Kobelnitz"].includes(v[0])).forEach(v=>{ out.villageCentreInMarsh[v[0]]=G.MARSH.map((m,i)=>[i,+ell([v[1],v[2]],m).toFixed(3)]).filter(r=>r[1]<1.05); });
console.log(JSON.stringify(out,null,1));
