/* The final audits' Stage 4, WP-04b (owner decision 289 (a)): the sight readings the place texts and the terrain lines state, on a world.js and
   the relief before it, through world.js's own computeViewshed and sampleVS (terrain-test.js's convention, a 3 m eye): the Goldbach's bed from the
   Pratzeberg every 0.5 units (which reaches are dead ground), the "Dead ground, Goldbach valley" line, the Zuran's view of the western escarpment,
   the chapel's view of the Augezd defile and of the meres (their cells inside the drawn outline), the chapel's sight line to the Satschan mere's
   centre (tools/audit-post8/geography/extra.js (c)'s rule).
     node tools/final-stage4-wp04b/sights.js [WORLD_JS_BEFORE] [--json OUT]
   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.join(__dirname,"..",".."), args=process.argv.slice(2), jo=args.indexOf("--json"), OUT=jo>=0?args[jo+1]:null;
const BEFORE=args.filter((a,i)=>a!=="--json"&&(jo<0||i!==jo+1))[0];
function load(worldFile){
  const sb={console, Math, Float32Array, Float64Array, Uint8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Array, Object, JSON, isFinite,
    parseFloat, parseInt, Number, String, Date, Map, Set, RegExp, Error, Symbol, performance:{now:()=>Date.now()}};
  sb.window={}; sb.THREE=require(path.join(ROOT,"node_modules","three")); vm.createContext(sb);
  const run=(f,src)=>vm.runInContext(src||fs.readFileSync(path.join(ROOT,f),"utf8"),sb,{filename:f});
  run("geo.js"); ["data.js","analysis.js","appearance.js","tokens.js"].forEach(f=>run(f)); run("world.js",fs.readFileSync(worldFile,"utf8"));
  vm.runInContext("buildCover(); buildGrid();",sb); return sb;
}
function along(L,step){ const o=[]; for(let i=0;i<L.length-1;i++){ const a=L[i], b=L[i+1], n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/step)); for(let s=0;s<n;s++) o.push([a[0]+(b[0]-a[0])*s/n, a[1]+(b[1]-a[1])*s/n]); } o.push(L[L.length-1]); return o; }
function measure(S){
  const G=S.GEOREF, o={};
  const seen=(from,pts)=>{ S.computeViewshed(from,3.0); return pts.map(p=>{ const w=S.W(p[0],p[1]); return !!S.sampleVS(w[0],w[1]); }); };
  /* the Goldbach's bed from the Pratzeberg: the dead reaches, by the bed's y (map units) */
  const gb=along(S.GOLDBACH_M,0.5), vg=seen(G.GT.pratzeberg.map,gb), runs=[]; let r=null;
  gb.forEach((p,i)=>{ if(!vg[i]){ if(!r) r={from:p, to:p, n:0}; r.to=p; r.n++; } else if(r){ runs.push(r); r=null; } }); if(r) runs.push(r);
  o.goldbachFromPratzeberg={samples:gb.length, visible:vg.filter(Boolean).length, deadReaches:runs.filter(q=>q.n>=6).map(q=>({from:q.from.map(v=>+v.toFixed(1)), to:q.to.map(v=>+v.toFixed(1)), km:+(q.n*0.5*G.KM_PER_MAP).toFixed(2)}))};
  const DL=S.TERRAIN_LINES.filter(t=>t.t==="dead");
  o.deadLines=DL.map(t=>{ const P=along(t.p,0.5), v=seen(G.GT.pratzeberg.map,P); return {n:t.n, samples:P.length, visibleFromPratzeberg:v.filter(Boolean).length}; });
  /* the Zuran's view of the western escarpment (TERRAIN_LINES "Western escarpment"), the ground 3 m above it as the target is the cell itself */
  const esc=S.TERRAIN_LINES.find(t=>t.n==="Western escarpment"), EP=along(esc.p,0.5), ve=seen(G.GT.zuran.map,EP);
  o.zuranEscarpment={samples:EP.length, visible:ve.filter(Boolean).length};
  /* the chapel (FEATURES chapel's point): the Augezd defile (TERRAIN_LINES) and the meres' cells (the drawn outlines: coverClass's pond test) */
  const ch=S.FEATURES.find(f=>f.id==="chapel").p, def=S.TERRAIN_LINES.find(t=>t.t==="defile"), DP=along(def.p,0.5), vd=seen(ch,DP);
  o.chapelDefile={from:ch, samples:DP.length, visible:vd.filter(Boolean).length};
  const mere=(c,rx,rz)=>{ const P=[]; for(let z=-rz;z<=rz;z+=0.5) for(let x=-rx;x<=rx;x+=0.5){ if((x/rx)**2+(z/rz)**2<0.55*0.55) P.push([c[0]+x,c[1]+z]); } return P; };
  const toMap=w=>[w[0]*G.MAP_PER_WORLD+G.WORLD_ORIGIN[0], w[1]*G.MAP_PER_WORLD+G.WORLD_ORIGIN[1]];
  S.computeViewshed(ch,3.0);
  o.chapelMeres=[["Satschan",S.SATS,28,10.5],["Menitz",S.MENI,23,9]].map(([n,c,rx,rz])=>{ const P=mere(c,rx,rz); let v=0; P.forEach(w=>{ if(S.sampleVS(w[0],w[1])) v++; }); return {n, cells:P.length, visible:v, centre:toMap(c).map(x=>+x.toFixed(1))}; });
  /* the sight line from the chapel's point (GT.chapel) to the Satschan mere's centre, as extra.js (c) draws it */
  const elev=(x,y)=>G.elevM(S.hAt(x,y)), los=(from,to)=>{ const n=200, D=G.kmBetween(from,to)*1000, h0=elev(from[0],from[1])+3, ht=elev(to[0],to[1]); let worst=-Infinity;
    for(let k=1;k<n;k++){ const f=k/n, h=elev(from[0]+(to[0]-from[0])*f, from[1]+(to[1]-from[1])*f), a=(h-h0)/(D*f); if(a>worst) worst=a; } return {visible:(ht-h0)/D>worst, marginM:+(((ht-h0)/D-worst)*D).toFixed(1)}; };
  o.chapelToSatschanCentre={fromGT:los(G.GT.chapel.map,[268,421]), fromFeature:los(ch,[268,421])};
  return o;
}
const out={after:measure(load(path.join(ROOT,"world.js")))}; if(BEFORE) out.before=measure(load(BEFORE));
console.log(JSON.stringify(out,null,1));
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
