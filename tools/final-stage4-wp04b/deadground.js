/* The final audits' Stage 4, WP-04b: what the refit does to the texts that read the Pratzeberg's sight and the plateau's extent (tour stop 5,
   the "Dead ground, Goldbach valley" line, the concealed French centre's acts, the Pratzen place's "Extent"), on a world.js and the relief before
   it, through world.js's own computeViewshed and sampleVS (terrain-test.js's convention: a 3 m eye at the GT point).
     node tools/final-stage4-wp04b/deadground.js [WORLD_JS_BEFORE] [--json OUT]
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
function measure(S){
  const G=S.GEOREF, P=k=>G.GT[k].map, o={};
  const vs=(mp)=>{ S.computeViewshed(mp,3.0); let v=0; for(let i=0;i<S.vsMask.length;i++) v+=S.vsMask[i]; return +(100*v/S.vsMask.length).toFixed(1); };
  o.shares={}; ["pratzeberg","vinohrady","santon","zuran","puntowitz","sokolnitz","augezd"].forEach(k=>o.shares[k]=vs(P(k)));
  const seenFrom=(from,pts)=>{ S.computeViewshed(from,3.0); return pts.map(p=>{ const w=S.W(p[0],p[1]); return !!S.sampleVS(w[0],w[1]); }); };
  /* from the Pratzeberg: the villages terrain-test names, the dead-ground line's samples every 0.1 of each leg, the concealed centre's anchors */
  const DL=S.TERRAIN_LINES.find(t=>t.t==="dead").p, samp=[]; for(let i=0;i<DL.length-1;i++) for(let s=0;s<=10;s++) if(s<10||i===DL.length-2) samp.push([DL[i][0]+(DL[i+1][0]-DL[i][0])*s/10, DL[i][1]+(DL[i+1][1]-DL[i][1])*s/10]);
  const fromPB=seenFrom(P("pratzeberg"),[P("sokolnitz"),P("telnitz"),P("kobelnitz"),P("puntowitz"),P("girzikowitz")].concat(samp));
  o.fromPratzeberg={sokolnitz:fromPB[0], telnitz:fromPB[1], kobelnitz:fromPB[2], puntowitz:fromPB[3], girzikowitz:fromPB[4]};
  o.deadLine={samples:samp.length, visibleFromPratzeberg:fromPB.slice(5).filter(Boolean).length, visibleAt:samp.filter((p,i)=>fromPB[5+i]).map(p=>p.map(v=>+v.toFixed(1)))};
  const anc=[["sthilaire",0],["sthilaire",2],["vandamme",0],["vandamme",2]].map(([id,ph])=>{ const a=S.FORMATIONS[id].track[ph]; return {id:id+"@"+ph, p:a.p, act:(a.act||"").slice(0,90)}; });
  const fpb=seenFrom(P("pratzeberg"),anc.map(a=>a.p)), fvi=seenFrom(P("vinohrady"),anc.map(a=>a.p));
  o.concealed=anc.map((a,i)=>Object.assign(a,{fromPratzeberg:fpb[i], fromVinohrady:fvi[i]}));
  o.fromPuntowitz=(()=>{ const r=seenFrom(P("puntowitz"),[P("pratzeberg"),P("vinohrady")]); return {pratzeberg:r[0], vinohrady:r[1]}; })();
  /* the plateau's extent: the ground above the fog's top (238.2 m) and above 260 m along the north-south line through the Pratzeberg, map x 285,
     from Blasowitz's latitude (y 146) to the Litava's (the drawn Litava's crossing of x 285 or y 400), every 0.1 km */
  const TOP=G.elevM(-0.8), xs=285, run=[]; for(let y=140;y<=400;y+=0.1/G.KM_PER_MAP){ const e=G.elevM(S.hAt(xs,y)); run.push({y:+y.toFixed(1), e:+e.toFixed(0)}); }
  const span=th=>{ const pb=G.GT.pratzeberg.map[1]; let s=null; run.forEach(r=>{ if(r.e>th){ if(s===null||Math.abs(r.y-pb)<1e9) s=s||{from:r.y}; s.to=r.y; } }); return s; };
  o.extent={line:"map x 285, y 140-400 (Blasowitz's latitude to the Litava's south of Augezd), every 0.1 km", fogTopM:+TOP.toFixed(1),
    southOfPratzebergAbove238Km:(()=>{ const pb=G.GT.pratzeberg.map[1]; let y=pb; for(const r of run) if(r.y>=pb){ if(r.e<=TOP) break; y=r.y; } return +((y-pb)*G.KM_PER_MAP).toFixed(2); })(),
    southOfPratzebergAbove260Km:(()=>{ const pb=G.GT.pratzeberg.map[1]; let y=pb; for(const r of run) if(r.y>=pb){ if(r.e<=260) break; y=r.y; } return +((y-pb)*G.KM_PER_MAP).toFixed(2); })(),
    profileEvery500m:run.filter((r,i)=>i%5===0).map(r=>r.y+":"+r.e).join(" ")};
  S.clearViewshed&&(S.vsMask=null);
  return o;
}
const out={after:measure(load(path.join(ROOT,"world.js")))};
if(BEFORE) out.before=measure(load(BEFORE));
const show=(k,o)=>{ console.log("== "+k);
  console.log("  shares (3 m eye): "+JSON.stringify(o.shares));
  console.log("  from the Pratzeberg: "+JSON.stringify(o.fromPratzeberg)+"; the dead-ground line: "+o.deadLine.visibleFromPratzeberg+" of "+o.deadLine.samples+" samples visible "+JSON.stringify(o.deadLine.visibleAt));
  console.log("  from Puntowitz: "+JSON.stringify(o.fromPuntowitz));
  o.concealed.forEach(a=>console.log("  "+a.id.padEnd(12)+JSON.stringify(a.p).padEnd(12)+" from the Pratzeberg "+(a.fromPratzeberg?"VISIBLE":"hidden")+", from Stare Vinohrady "+(a.fromVinohrady?"VISIBLE":"hidden")+"   ("+a.act+")"));
  console.log("  extent: south of the Pratzeberg above the fog top "+o.extent.southOfPratzebergAbove238Km+" km, above 260 m "+o.extent.southOfPratzebergAbove260Km+" km");
  console.log("  profile x 285 (y:m every 0.5 km): "+o.extent.profileEvery500m); };
if(out.before) show("before",out.before); show("after",out.after);
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
