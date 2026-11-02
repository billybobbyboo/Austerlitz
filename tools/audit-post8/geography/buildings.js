/* Post-Stage-8 final audit, area "geography": the buildings the planner draws, measured in node on the live sources (no page): per village
   every building's centre on the drawn village class (drawnCover 5, the ground shader's classes) and in the village's place (the paper map's
   rule), with the classes under those that are not, as tools/stage8/buildings-8h.js counts them in a page (8H: 308 of 372 on the class);
   the Sokolnitz castle against its site, the Pratzen church against its site, and the Austerlitz château against its own place (Wikidata
   Q1418278, P625) and its church. Writes docs/audit-post8-evidence/geography/buildings.json.
   node tools/audit-post8/geography/buildings.js ROOT   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.resolve(process.argv[2]||path.join(__dirname,"..","..",".."));
const EV=path.join(__dirname,"..","..","..","docs","audit-post8-evidence","geography");
const L=require("./lib.js"), G=L.load(ROOT,{clock:false});
vm.runInContext("var __WP=woodsPlan(); var __T=__WP.broad.concat(__WP.conif); var __B=planBuildings8g(__T);",G);
const B=G.__B, CLS=["field","meadow","marsh","water","wood","village","vineyard","track"], lv=G.PAPER_SYM?G.PAPER_SYM.village.level:null;
const V={}; G.VILLAGES.forEach(v=>V[v[0]]={n:v[3], all:0, onClass:0, inPlace:0, under:{}});
B.forEach(b=>{ const q=V[b.village]; if(!q||!b.R||b.landmark&&!(b.church||b.part==="chapel"||b.part==="church")) return; if(b.part==="fence"||b.part==="churchyard wall") return;
  q.all++; const R=b.R, c=G.drawnCover(R.x,R.z); if(c===5) q.onClass++; else q.under[CLS[c]]=(q.under[CLS[c]]||0)+1;
  if(lv!=null&&G.covAt(G.covVill,R.x,R.z)>lv&&R.pts.every(p=>G.covAt(G.covVill,p[0],p[1])>=G.VILL8G.margin)) q.inPlace++; });
const tot={all:0,onClass:0,inPlace:0}; Object.values(V).forEach(q=>{ tot.all+=q.all; tot.onClass+=q.onClass; tot.inPlace+=q.inPlace; });
const toMap=w=>[w[0]*G.GEOREF.MAP_PER_WORLD+G.GEOREF.WORLD_ORIGIN[0], w[1]*G.GEOREF.MAP_PER_WORLD+G.GEOREF.WORLD_ORIGIN[1]];
const mOf=(a,b)=>Math.round(Math.hypot(a[0]-b[0],a[1]-b[1])*G.GEOREF.M_PER_WORLD);
const out={tool:"tools/audit-post8/geography/buildings.js", records:B.length, totals:tot, villages:V};
/* the castle: its parts' centre against LANDMARK_SITES.castle */
const cas=B.filter(b=>b.village==="Sokolnitz"&&b.landmark&&b.R&&!b.church&&b.part&&/castle|range|court|wing|tower/i.test(b.part));
if(cas.length){ const cx=cas.reduce((s,b)=>s+b.R.x,0)/cas.length, cz=cas.reduce((s,b)=>s+b.R.z,0)/cas.length, site=G.W(G.LANDMARK_SITES.castle[0],G.LANDMARK_SITES.castle[1]);
  out.castle={parts:cas.map(b=>b.part), centreMap:toMap([cx,cz]).map(v=>+v.toFixed(2)), toSiteM:mOf([cx,cz],site), scale:cas[0].scale}; }
/* churches: Pratzen's against its site */
const nave=(vn)=>B.filter(b=>b.village===vn&&(b.church||b.part==="church"||b.part==="church nave"||b.part==="chapel")&&b.R);
const pc=nave("Pratzen")[0]; if(pc){ const site=G.W(G.LANDMARK_SITES.church.Pratzen[0],G.LANDMARK_SITES.church.Pratzen[1]); out.pratzenChurch={map:toMap([pc.R.x,pc.R.z]).map(v=>+v.toFixed(2)), toSiteM:mOf([pc.R.x,pc.R.z],site)}; }
/* the château: against Wikidata's point and its church's */
const chat=B.filter(b=>b.part==="chateau main range")[0], an=B.filter(b=>b.part==="church nave"&&b.village==="Austerlitz")[0];
const wdChat=[49.154722,16.874556], wdChurch=[49.155509,16.876505];   /* Wikidata Q1418278 (raw/wikidata-0.json); the church: RÚIAN building 39712834 as 8H's Table A row 26 gives it */
if(chat){ const real=G.GEOREF.toMap(wdChat[0],wdChat[1]), rw=G.W(real[0],real[1]), cm=toMap([chat.R.x,chat.R.z]);
  out.chateau={drawnMap:cm.map(v=>+v.toFixed(2)), realMap:real.map(v=>+v.toFixed(2)), drawnToRealM:mOf([chat.R.x,chat.R.z],rw), bearingFromRealDeg:+G.GEOREF.bearingDeg(real,cm).toFixed(0)};
  if(an){ const realCh=G.GEOREF.toMap(wdChurch[0],wdChurch[1]), am=toMap([an.R.x,an.R.z]); out.chateau.churchDrawnMap=am.map(v=>+v.toFixed(2)); out.chateau.churchToRealM=mOf([an.R.x,an.R.z],G.W(realCh[0],realCh[1]));
    out.chateau.drawnChurchToChateauM=mOf([an.R.x,an.R.z],[chat.R.x,chat.R.z]); out.chateau.realChurchToChateauM=Math.round(L.vincenty(wdChurch[0],wdChurch[1],wdChat[0],wdChat[1]).m); } }
fs.writeFileSync(path.join(EV,"buildings.json"),JSON.stringify(out,null,1));
console.log("records "+B.length+"; buildings "+tot.all+", on the drawn village class "+tot.onClass+", in the village's place "+tot.inPlace);
Object.keys(V).forEach(k=>{ const q=V[k]; if(!q.all) return; console.log("  "+k.padEnd(20)+String(q.onClass).padStart(3)+" / "+String(q.all).padEnd(4)+(100*q.onClass/q.all).toFixed(0).padStart(4)+"%  in place "+q.inPlace+"  under: "+JSON.stringify(q.under)); });
console.log("castle:",JSON.stringify(out.castle)); console.log("Pratzen church:",JSON.stringify(out.pratzenChurch)); console.log("chateau:",JSON.stringify(out.chateau));
