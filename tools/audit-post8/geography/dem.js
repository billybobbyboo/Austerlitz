/* Post-Stage-8 final audit, area "geography": the relief model against an independent terrain model.
   --request: writes docs/audit-post8-evidence/geography/dem-request.json, the points to ask Open-Meteo's elevation API for (Copernicus GLO-90, a
     90 m surface model): the GT points, a 600 m grid over the frame, the drawn Goldbach's bed every ~150 m, and today's Říčka and Roketnice
     (OpenStreetMap, from fetch-places.js's Nominatim responses) every ~150 m inside the frame. Then fetch-places.js --only dem fetches them.
   --analyse [ROOT]: reads the responses, evaluates the model at the same points (GEOREF.elevM(hAt) on the live world.js: the model's metres,
     the 1x drawing) and the drawn relief at 4x and 10.33x (displayHeight's factor: relief x factor), and writes dem.json.
   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const EV=path.join(__dirname,"..","..","..","docs","audit-post8-evidence","geography"), RAW=path.join(EV,"raw");
const mode=process.argv[2]||"--analyse", ROOT=path.resolve(process.argv[3]||path.join(__dirname,"..","..",".."));
const GEOREF=require(path.join(ROOT,"geo.js"));
function osmLine(f){ const J=JSON.parse(fs.readFileSync(path.join(RAW,f),"utf8")); const g=J[0].geojson; return (g.type==="LineString"?[g.coordinates]:g.coordinates)[0].map(c=>[c[1],c[0]]); }
function resampleMap(L,stepUnits){ const out=[L[0]]; let carry=0; for(let i=1;i<L.length;i++){ const a=L[i-1], b=L[i], d=Math.hypot(b[0]-a[0],b[1]-a[1]); let s=stepUnits-carry;
  while(s<=d){ out.push([a[0]+(b[0]-a[0])*s/d, a[1]+(b[1]-a[1])*s/d]); s+=stepUnits; } carry=d-(s-stepUnits); } return out; }
const inFrame=p=>p[0]>=0&&p[0]<=680&&p[1]>=0&&p[1]<=500;
if(mode==="--request"){
  const pts=[];
  Object.keys(GEOREF.GT).forEach(k=>{ const g=GEOREF.GT[k]; if(inFrame(g.map)) pts.push({set:"gt", id:k, lat:g.lat, lon:g.lon, map:g.map}); });
  const step=0.6*GEOREF.K;   /* 600 m in map units */
  for(let y=step/2;y<500;y+=step) for(let x=step/2;x<680;x+=step){ const g=GEOREF.toGeo(x,y); pts.push({set:"grid", lat:g[0], lon:g[1], map:[x,y]}); }
  const WSRC=fs.readFileSync(path.join(ROOT,"world.js"),"utf8"), m=WSRC.match(/var GOLDBACH_M=(\[[\s\S]*?\]\]);/), GB=JSON.parse(m[1]);
  resampleMap(GB,0.15*GEOREF.K).forEach((p,i)=>{ const g=GEOREF.toGeo(p[0],p[1]); pts.push({set:"goldbach", i, lat:g[0], lon:g[1], map:p}); });
  [["ricka","nominatim-water-ricka.json"],["roketnice","nominatim-water-roketnice.json"]].forEach(([id,f])=>{
    const L=osmLine(f).map(c=>GEOREF.toMap(c[0],c[1])).filter(inFrame); resampleMap(L,0.15*GEOREF.K).forEach((p,i)=>{ const g=GEOREF.toGeo(p[0],p[1]); pts.push({set:id, i, lat:g[0], lon:g[1], map:p}); }); });
  fs.writeFileSync(path.join(EV,"dem-request.json"),JSON.stringify(pts));
  console.log(pts.length+" points; by set:", JSON.stringify(pts.reduce((o,p)=>(o[p.set]=(o[p.set]||0)+1,o),{})));
} else {
  const L=require("./lib.js"), G=L.load(ROOT,{clock:false});
  const req=JSON.parse(fs.readFileSync(path.join(EV,"dem-request.json"),"utf8")), elev=[];
  for(let i=0;;i++){ const f=path.join(RAW,"openmeteo-dem-"+i+".json"); if(!fs.existsSync(f)) break; elev.push(...JSON.parse(fs.readFileSync(f,"utf8")).elevation); }
  if(elev.length!==req.length) throw new Error("responses "+elev.length+" against "+req.length+" points");
  const rows=req.map((p,i)=>{ const h=G.hAt(p.map[0],p.map[1]); return Object.assign({}, p, {dem:elev[i], model:+G.GEOREF.elevM(h).toFixed(1), h}); });
  const stats=a=>{ const s=a.slice().sort((x,y)=>x-y), n=s.length, mean=s.reduce((x,y)=>x+y,0)/n; return {n, mean:+mean.toFixed(1), rms:+Math.sqrt(s.reduce((x,y)=>x+y*y,0)/n).toFixed(1),
    p05:+s[Math.floor(0.05*(n-1))].toFixed(1), median:+s[Math.floor(0.5*(n-1))].toFixed(1), p95:+s[Math.floor(0.95*(n-1))].toFixed(1), min:+s[0].toFixed(1), max:+s[n-1].toFixed(1)}; };
  const out={tool:"tools/audit-post8/geography/dem.js", source:"Open-Meteo elevation API (Copernicus GLO-90 DSM, 90 m)", modelDatum:G.GEOREF.DATUM_M, vMperUnit:G.GEOREF.V_M_PER_UNIT, EXAG:G.GEOREF.EXAG};
  /* GT points: model, DEM, sourced elevation (geo.js elev / ELEV_SRC) */
  out.gt=rows.filter(r=>r.set==="gt").map(r=>({id:r.id, sourced:G.GEOREF.GT[r.id].elev||null, model:r.model, dem:r.dem, modelMinusDem:+(r.model-r.dem).toFixed(1)}));
  /* the grid: model minus DEM; by region */
  const grid=rows.filter(r=>r.set==="grid");
  out.grid={all:stats(grid.map(r=>r.model-r.dem)), absWorst:grid.map(r=>({map:r.map.map(v=>+v.toFixed(0)), model:r.model, dem:r.dem, d:+(r.model-r.dem).toFixed(1)})).sort((a,b)=>Math.abs(b.d)-Math.abs(a.d)).slice(0,15)};
  /* the battlefield core (Santon to Telnitz, Goldbach to the Pratzen crest's east foot): map x 150-360, y 60-430 */
  const core=grid.filter(r=>r.map[0]>=150&&r.map[0]<=360&&r.map[1]>=60&&r.map[1]<=430);
  out.grid.core=stats(core.map(r=>r.model-r.dem));
  /* correlation of the relief (anomalies about each set's mean) */
  const corr=(A,B)=>{ const n=A.length, ma=A.reduce((x,y)=>x+y,0)/n, mb=B.reduce((x,y)=>x+y,0)/n; let sab=0,sa=0,sb=0; for(let i=0;i<n;i++){ sab+=(A[i]-ma)*(B[i]-mb); sa+=(A[i]-ma)**2; sb+=(B[i]-mb)**2; } return +(sab/Math.sqrt(sa*sb)).toFixed(3); };
  out.grid.corrAll=corr(grid.map(r=>r.model),grid.map(r=>r.dem)); out.grid.corrCore=corr(core.map(r=>r.model),core.map(r=>r.dem));
  /* profiles: the drawn Goldbach's bed (model and DEM at the same points) and today's streams (model and DEM) */
  ["goldbach","ricka","roketnice"].forEach(set=>{ const P=rows.filter(r=>r.set===set); let rev=[], run=null;
    /* reverse gradients: the model's bed rising downstream by more than 1 m between samples ~150 m apart, merged into reaches */
    for(let i=1;i<P.length;i++){ const d=P[i].model-P[i-1].model; if(d>0){ if(!run) run={from:P[i-1].map.map(v=>+v.toFixed(0)), rise:0, n:0}; run.rise+=d; run.n++; run.to=P[i].map.map(v=>+v.toFixed(0)); } else if(run){ rev.push(run); run=null; } }
    if(run) rev.push(run);
    out[set]={n:P.length, profile:P.map(r=>({map:r.map.map(v=>+v.toFixed(1)), model:r.model, dem:r.dem})), modelMinusDem:stats(P.map(r=>r.model-r.dem)),
      modelRises:rev.filter(r=>r.rise>=1).map(r=>Object.assign(r,{rise:+r.rise.toFixed(1)})), demFirst:P[0]&&P[0].dem, demLast:P[P.length-1]&&P[P.length-1].dem}; });
  /* the drawn relief at the display factors: the Goldbach-to-Pratzeberg rise as the model has it, and as drawn (relief x factor, in the horizontal scale's metres) */
  const pb=G.GEOREF.GT.pratzeberg.map, sk=G.GEOREF.GT.sokolnitz.map, rise=G.GEOREF.elevM(G.hAt(pb[0],pb[1]))-G.GEOREF.elevM(G.hAt(sk[0],sk[1]));
  out.display={settings:G.DISPLAY.settings, defaultFactor:G.DISPLAY.defaultFactor, riseSokolnitzToPratzebergM:+rise.toFixed(1),
    drawnRiseM:G.DISPLAY.settings.map(f=>({factor:+f.toFixed(3), drawnM:+(rise*f).toFixed(0), displayYUnits:+((G.hAt(pb[0],pb[1])-G.hAt(sk[0],sk[1]))*f/G.GEOREF.EXAG).toFixed(3)}))};
  fs.writeFileSync(path.join(EV,"dem.json"),JSON.stringify(out,null,1));
  console.log("GT points (sourced | model | DEM):"); out.gt.forEach(r=>console.log("  "+r.id.padEnd(12)+String(r.sourced||"-").padStart(5)+" | "+r.model.toFixed(0).padStart(4)+" | "+r.dem.toFixed(0).padStart(4)+"   model-DEM "+r.modelMinusDem));
  console.log("grid model-DEM all:",JSON.stringify(out.grid.all),"corr",out.grid.corrAll); console.log("grid model-DEM core:",JSON.stringify(out.grid.core),"corr",out.grid.corrCore);
  console.log("worst grid:",JSON.stringify(out.grid.absWorst.slice(0,8)));
  ["goldbach","ricka","roketnice"].forEach(s=>console.log(s+": model-DEM",JSON.stringify(out[s].modelMinusDem),"; model rises >=1 m:",JSON.stringify(out[s].modelRises)));
  console.log("display:",JSON.stringify(out.display));
}
