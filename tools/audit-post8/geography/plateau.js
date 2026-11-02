/* Post-Stage-8 final audit, area "geography": the relief model over the battle's core against a 300 m grid of an independent surface model
   (Open-Meteo, Copernicus GLO-90), and what it moves: the drawn valley fog's top (the knowledge model's rule, hAt < -0.8, 238.2 m) and the
   formations the morning's fog rule judges. Reads dem-core-request.json and raw/openmeteo-core-*.json (fetched by the audit), the live
   sources through lib.js and _clock.js. Writes docs/audit-post8-evidence/geography/plateau.json.
   node tools/audit-post8/geography/plateau.js ROOT   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(process.argv[2]||path.join(__dirname,"..","..",".."));
const EV=path.join(__dirname,"..","..","..","docs","audit-post8-evidence","geography"), RAW=path.join(EV,"raw");
const L=require("./lib.js"), G=L.load(ROOT);
const req=JSON.parse(fs.readFileSync(path.join(EV,"dem-core-request.json"),"utf8")), E=[];
for(let i=0;;i++){ const f=path.join(RAW,"openmeteo-core-"+i+".json"); if(!fs.existsSync(f)) break; E.push(...JSON.parse(fs.readFileSync(f,"utf8")).elevation); }
if(E.length!==req.length) throw new Error("core DEM "+E.length+" of "+req.length);
const s=0.3*G.GEOREF.K, nx=Math.round((360-150)/s)+1;
const pts=req.map((p,i)=>({map:p.map, dem:E[i], model:G.GEOREF.elevM(G.hAt(p.map[0],p.map[1]))}));
/* bilinear DEM inside the core grid */
function dem(mx,my){ const fi=(mx-150)/s, fj=(my-60)/s, i=Math.floor(fi), j=Math.floor(fj); if(i<0||j<0||i>=nx-1||(j+1)*nx+i+1>=pts.length) return null;
  const u=fi-i, v=fj-j, a=pts[j*nx+i].dem, b=pts[j*nx+i+1].dem, c=pts[(j+1)*nx+i].dem, d=pts[(j+1)*nx+i+1].dem; return (a*(1-u)+b*u)*(1-v)+(c*(1-u)+d*u)*v; }
const TOP=G.GEOREF.elevM(-0.8);
const d=pts.map(p=>p.model-p.dem), rms=Math.sqrt(d.reduce((x,y)=>x+y*y,0)/d.length);
/* the cells the fog rule classes differently: under the drawn fog in the model (model < TOP) and above it on the surveyed ground (DEM > TOP + 10, a margin
   for the surface model's canopy and smoothing), and the reverse */
const underModelOnly=pts.filter(p=>p.model<TOP&&p.dem>TOP+10), underDemOnly=pts.filter(p=>p.model>=TOP&&p.dem<TOP-10);
const cellKm2=(s*G.GEOREF.KM_PER_MAP)**2;
/* the southern plateau: the box between the Pratzeberg, Augezd and Hostieradek */
const box=p=>p.map[0]>=270&&p.map[0]<=330&&p.map[1]>=295&&p.map[1]<=350, sp=pts.filter(box);
const out={tool:"tools/audit-post8/geography/plateau.js", fogTopM:+TOP.toFixed(1), core:{n:pts.length, rmsM:+rms.toFixed(1), meanM:+(d.reduce((x,y)=>x+y,0)/d.length).toFixed(1),
  absOver30:d.filter(x=>Math.abs(x)>30).length, absOver50:d.filter(x=>Math.abs(x)>50).length},
  southernPlateau:{box:"map x 270-330, y 295-350", n:sp.length, modelMean:+(sp.reduce((x,p)=>x+p.model,0)/sp.length).toFixed(1), demMean:+(sp.reduce((x,p)=>x+p.dem,0)/sp.length).toFixed(1),
    demOverTop:sp.filter(p=>p.dem>TOP).length, modelOverTop:sp.filter(p=>p.model>TOP).length},
  fogMisclass:{underInModelOnly:{cells:underModelOnly.length, km2:+(underModelOnly.length*cellKm2).toFixed(2)}, underOnSurveyOnly:{cells:underDemOnly.length, km2:+(underDemOnly.length*cellKm2).toFixed(2)}},
  worst:pts.map(p=>({map:p.map.map(v=>+v.toFixed(0)), model:+p.model.toFixed(0), dem:p.dem, d:+(p.model-p.dem).toFixed(0)})).sort((a,b)=>Math.abs(b.d)-Math.abs(a.d)).slice(0,20), fog:[]};
/* the morning's fog rule (knowledgeOf: mist > 0.5 and hAt < -0.8 -> "uncertain" when in sight) over every formation's position every 10 minutes while
   the mist exceeds 0.5 (phases 0-2): positions under the drawn fog on the model's ground whose surveyed ground stands over the top by 10 m or more */
const fogT=[]; G.PHASES.forEach(ph=>{ if(ph.mist>0.5) for(let t=ph.t0;t<ph.t1;t+=10) fogT.push(t); });
const hits={};
Object.keys(G.FORMATIONS).forEach(id=>{ const f=G.FORMATIONS[id]; if(!f.track) return;
  fogT.forEach(t=>{ if(G.goneAt(id,t)||G.notYetAt(id,t)) return; const p=G.posAtClock(id,t); if(!p) return; const m=G.GEOREF.elevM(G.hAt(p[0],p[1])), dm=dem(p[0],p[1]); if(dm==null) return;
    const k=id; if(m<TOP&&dm>TOP+10){ (hits[k]=hits[k]||{id, name:f.name, nation:f.nation, t:[], model:[], dem:[]}); hits[k].t.push(G.fmtClock(t)); hits[k].model.push(+m.toFixed(0)); hits[k].dem.push(+dm.toFixed(0)); } }); });
out.fog=Object.values(hits).map(h=>({id:h.id, name:h.name, nation:h.nation, clocks:h.t.length, from:h.t[0], to:h.t[h.t.length-1], modelM:[Math.min(...h.model),Math.max(...h.model)], demM:[Math.min(...h.dem),Math.max(...h.dem)]}));
/* the headquarters' eyes: their positions' heights, model against survey */
out.hq=["gqg","ahq"].map(id=>({id, anchors:G.anchorList(id).filter(a=>a.p).map(a=>({ph:a.ph, p:a.p, model:+G.GEOREF.elevM(G.hAt(a.p[0],a.p[1])).toFixed(0), dem:dem(a.p[0],a.p[1])==null?null:+dem(a.p[0],a.p[1]).toFixed(0)}))}));
/* the feature texts that state the plateau's extent */
out.texts={pratzenExtent:(G.FEATURES.find(f=>f.id==="pratzen")||{}).facts, pratzenSub:(G.FEATURES.find(f=>f.id==="pratzen")||{}).sub};
fs.writeFileSync(path.join(EV,"plateau.json"),JSON.stringify(out,null,1));
console.log(JSON.stringify({fogTopM:out.fogTopM, core:out.core, southernPlateau:out.southernPlateau, fogMisclass:out.fogMisclass},null,0));
console.log("worst:",JSON.stringify(out.worst.slice(0,10)));
console.log("formations under the model's fog whose surveyed ground stands 10 m or more above its top (04:00-08:40, every 10 min):");
out.fog.forEach(h=>console.log("  "+h.id.padEnd(12)+(h.nation||"").padEnd(4)+h.clocks+" clocks "+h.from+"-"+h.to+"  model "+h.modelM.join("-")+" m, survey "+h.demM.join("-")+" m"));
out.hq.forEach(h=>console.log(h.id+": "+h.anchors.map(a=>"@"+a.ph+" model "+a.model+" survey "+a.dem).join("; ")));
console.log("FEATURES pratzen:",JSON.stringify(out.texts));
