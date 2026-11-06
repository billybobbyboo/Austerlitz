/* The final audits' Stage 4, WP-04b (CL-GEO-01): the relief's tolerance lines (tools/relief-tolerance.js) and the residuals beside them, on a
   tree's world.js or on another world.js read against this tree's other sources (the relief before the refit, for the before/after table):
     node tools/final-stage4-wp04b/relief-measure.js [WORLD_JS] [--json OUT]
   Also: the 300 m core grid's rms and cells beyond 50 m (the audit's plateau.js measure), and each RELIEF_DEM term's footprint (the DEM
   targets inside it, their mean residual). Measurement code only: reads the tree, never writes it (but OUT). */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.join(__dirname,"..",".."), args=process.argv.slice(2);
const jo=args.indexOf("--json"), OUT=jo>=0?args[jo+1]:null, WJ=args.filter((a,i)=>a!=="--json"&&(jo<0||i!==jo+1))[0]||path.join(ROOT,"world.js");
function load(worldFile){
  const sb={console, Math, Float32Array, Float64Array, Uint8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Array, Object, JSON, isFinite,
    parseFloat, parseInt, Number, String, Date, Map, Set, RegExp, Error, Symbol, performance:{now:()=>Date.now()}};
  sb.window={}; sb.THREE=require(path.join(ROOT,"node_modules","three")); vm.createContext(sb);
  const run=(f,src)=>vm.runInContext(src||fs.readFileSync(path.join(ROOT,f),"utf8"),sb,{filename:f});
  run("geo.js"); ["data.js","analysis.js","appearance.js","tokens.js"].forEach(f=>run(f)); run("world.js",fs.readFileSync(worldFile,"utf8"));
  vm.runInContext("buildCover(); buildGrid();",sb);
  return sb;
}
const S=load(WJ), G=S.GEOREF, elevAt=(x,y)=>G.elevM(S.hAt(x,y));
const D=JSON.parse(fs.readFileSync(path.join(ROOT,"tools","relief-dem.json"),"utf8"));
const R=require(path.join(ROOT,"tools","relief-tolerance.js")).check(elevAt,D,G);
const out={world:path.relative(ROOT,WJ)||WJ, tolerance:R.rows, ok:R.ok};
/* the core grid, as tools/audit-post8/geography/plateau.js measures it */
{ const EV=path.join(ROOT,"docs","audit-post8-evidence","geography"), req=JSON.parse(fs.readFileSync(path.join(EV,"dem-core-request.json"),"utf8")), E=[];
  for(let i=0;;i++){ const f=path.join(EV,"raw","openmeteo-core-"+i+".json"); if(!fs.existsSync(f)) break; E.push(...JSON.parse(fs.readFileSync(f,"utf8")).elevation); }
  const d=req.map((p,i)=>elevAt(p.map[0],p.map[1])-E[i]);
  out.core={n:d.length, rmsM:+Math.sqrt(d.reduce((a,b)=>a+b*b,0)/d.length).toFixed(1), meanM:+(d.reduce((a,b)=>a+b,0)/d.length).toFixed(1), over30:d.filter(x=>Math.abs(x)>30).length, over50:d.filter(x=>Math.abs(x)>50).length};
  /* the fog's top (238.2 m) on the southern box's cells: above it on the model and on GLO-90 */
  const TOP=G.elevM(-0.8), B=D.southernBox.pts;
  out.southernBoxOverFogTop={model:B.filter(p=>elevAt(p[0],p[1])>TOP).length, dem:B.filter(p=>p[2]>TOP).length, n:B.length, topM:+TOP.toFixed(1)};
  if(S.RELIEF_DEM) out.terms=S.RELIEF_DEM.map(t=>{ const inside=req.map((p,i)=>({p, e:E[i]})).filter(q=>{ const w=S.W(q.p.map[0],q.p.map[1]), dx=w[0]-t.c[0], dz=w[1]-t.c[1],
      u=(dx*t.co+dz*t.si)/t.rx, v=(-dx*t.si+dz*t.co)/t.rz; return u*u+v*v<1; });
    const dd=inside.map(q=>elevAt(q.p.map[0],q.p.map[1])-q.e);
    return {n:t.n, h:t.h, coreCellsInside:inside.length, meanResidualM:dd.length?+(dd.reduce((a,b)=>a+b,0)/dd.length).toFixed(1):null}; }); }
/* the Goldbach's sourced drop at the GT points, Kobylnice 211 -> Sokolnice 207 m */
out.kobelnitzToSokolnitzDropM=+(elevAt(...G.GT.kobelnitz.map)-elevAt(...G.GT.sokolnitz.map)).toFixed(1);
console.log("world: "+out.world+"   tolerance lines "+(R.ok?"all within":"NOT all within ("+R.rows.filter(r=>!r.ok).length+" outside)"));
R.rows.forEach(r=>console.log("  "+(r.ok?"ok   ":"OUT  ")+r.text));
console.log("  core grid ("+out.core.n+" cells): rms "+out.core.rmsM+" m, mean "+out.core.meanM+" m, beyond 30 m "+out.core.over30+", beyond 50 m "+out.core.over50);
console.log("  southern box over the fog top "+out.southernBoxOverFogTop.topM+" m: model "+out.southernBoxOverFogTop.model+", GLO-90 "+out.southernBoxOverFogTop.dem+" of "+out.southernBoxOverFogTop.n);
console.log("  Kobylnice -> Sokolnice at the GT points: "+out.kobelnitzToSokolnitzDropM+" m (sourced 4 m)");
(out.terms||[]).forEach(t=>console.log("  term "+t.n+" (h "+t.h+"): "+t.coreCellsInside+" core cells inside, mean residual "+t.meanResidualM+" m"));
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
