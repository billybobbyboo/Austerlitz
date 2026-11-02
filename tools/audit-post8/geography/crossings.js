/* Post-Stage-8 final audit, area "geography": where the troops' legs cross the drawn water, and what stands there.
   On the live sources (no page): every leg of every tracked formation (app.js's own anchorList/legPath, through tools/mk-helpers.js's
   _clock.js) intersected with the drawn streams (world.js GOLDBACH_M, BROOKS_M, LITAVA_M: the lines the ground carves and the ribbons
   draw), each crossing classed by what is there: inside a village's drawn place (the cover raster's village value over the class's 0.55),
   at a drawn road or track's own crossing of that stream (within 1.5 map units, 47 m, along the stream: a bridge or ford the map implies),
   or neither (open); with the leg's arm, window and ice flag. Then every leg sampled every 0.25 world units on the drawn cover (drawnCover:
   the ground shader's own classes) for water and marsh; every anchor's drawn class, its distance from the nearest stream and its side of the
   Goldbach; and where the roads and tracks cross the streams. Writes docs/audit-post8-evidence/geography/crossings.json.
   node tools/audit-post8/geography/crossings.js ROOT   (ROOT with node_modules and _clock.js, i.e. after node tools/mk-helpers.js)
   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(process.argv[2]||path.join(__dirname,"..","..",".."));
const EV=path.join(__dirname,"..","..","..","docs","audit-post8-evidence","geography");
const L=require("./lib.js"), G=L.load(ROOT);
const KM=G.GEOREF.KM_PER_MAP, M=u=>Math.round(u*KM*1000);
const CLS=["field","meadow","marsh","water","wood","village","vineyard","track"];
const STREAMS=[{n:"Goldbach",p:G.GOLDBACH_M}].concat(G.BROOKS_M.map((p,i)=>({n:["brook from Blasowitz (BROOKS[0])","Pratzen brook (BROOKS[1])","brook south of the Pratzeberg (BROOKS[2])","brook west of Puntowitz-Kobelnitz (BROOKS[3])","Rakovec (BROOKS[4])"][i],p}))).concat([{n:"Litava",p:G.LITAVA_M}]);
const ROADS=G.ROADS.map(r=>({n:r.n, cls:r.cls, p:r.p}));
const villR=v=>2*(2.6+v[3]*0.46);   /* the village's radius in map units (buildCover: world units 2.6+n*0.46) */
const vAt=(mx,my)=>{ const w=G.W(mx,my); return G.covAt(G.covVill,w[0],w[1]); };
const nearestVillage=p=>{ let best=null; G.VILLAGES.forEach(v=>{ const d=Math.hypot(p[0]-v[1],p[1]-v[2]); if(!best||d<best.d) best={n:v[0],d,r:villR(v)}; }); return best; };
/* the roads' crossings of each stream: the implied bridges and fords */
const roadX=[]; STREAMS.forEach(s=>ROADS.forEach(r=>L.polyX(r.p,s.p).forEach(x=>{ const nv=nearestVillage(x.p);
  roadX.push({stream:s.n, road:r.n, cls:r.cls, at:x.p.map(v=>+v.toFixed(1)), village:nv.n, villageM:M(nv.d), inVillagePlace:vAt(x.p[0],x.p[1])>0.55}); })));
/* along-stream distance between two points on one stream: approximated by straight distance when both lie on it (the streams are short-segmented) */
const out={tool:"tools/audit-post8/geography/crossings.js", root:ROOT, roadCrossings:roadX, legCrossings:[], legWet:[], anchors:[], summary:{}};
const fmt=t=>G.fmtClock(t);
Object.keys(G.FORMATIONS).forEach(id=>{ const f=G.FORMATIONS[id]; if(!f.track) return; const A=G.anchorList(id);
  for(let i=0;i<A.length-1;i++){ const a=A[i], b=A[i+1]; if(a.p===null||b.p===null) continue; const pp=G.legPath(a,b), w=G.legWindow(a,b);
    if(pp.len<0.01) continue;
    /* stream crossings */
    STREAMS.forEach(s=>L.polyX(pp.pts,s.p).forEach(x=>{ const nv=nearestVillage(x.p), inV=vAt(x.p[0],x.p[1])>0.55;
      let rb=null; roadX.filter(r=>r.stream===s.n).forEach(r=>{ const d=Math.hypot(r.at[0]-x.p[0],r.at[1]-x.p[1]); if(!rb||d<rb.d) rb={road:r.road,d}; });
      const atRoad=!!(rb&&rb.d<=1.5);
      out.legCrossings.push({id, name:f.name, arm:f.arm, leg:a.ph+"->"+b.ph, window:[fmt(w[0]),fmt(w[1])], ice:!!b.ice, stream:s.n, at:x.p.map(v=>+v.toFixed(1)),
        village:nv.n, villageM:M(nv.d), inVillagePlace:inV, nearestRoadCrossing:rb?{road:rb.road, m:M(rb.d)}:null, atRoadCrossing:atRoad,
        kind:inV?"in a village's place":atRoad?"at a road's crossing":"open"}); }));
    /* the drawn cover along the leg */
    const wl=pp.len/G.GEOREF.MAP_PER_WORLD, n=Math.max(2,Math.ceil(wl/0.25)), cnt={}; let wetRun=0, wetMax=0, wetAt=null;
    for(let k=0;k<=n;k++){ const q=G.pointOnPath(pp,k/n), ww=G.W(q[0],q[1]), c=G.drawnCover(ww[0],ww[1]); cnt[c]=(cnt[c]||0)+1;
      if(c===2||c===3){ wetRun++; if(wetRun>wetMax){ wetMax=wetRun; wetAt=q; } } else wetRun=0; }
    const share=k=>+(((cnt[k]||0)/(n+1))).toFixed(3);
    if((cnt[2]||0)+(cnt[3]||0)>0) out.legWet.push({id, arm:f.arm, leg:a.ph+"->"+b.ph, window:[fmt(w[0]),fmt(w[1])], ice:!!b.ice, km:+(pp.len*KM).toFixed(2), marsh:share(2), water:share(3),
      longestWetM:Math.round(wetMax*0.25*G.GEOREF.M_PER_WORLD), longestWetAt:wetAt&&wetAt.map(v=>+v.toFixed(1)), nearVillage:wetAt?nearestVillage(wetAt).n:null}); }
  /* the anchors */
  A.forEach(a=>{ if(!a.p) return; const ww=G.W(a.p[0],a.p[1]); let ns=null; STREAMS.forEach(s=>{ const r=L.polyDist(a.p,s.p); if(!ns||r.d<ns.d) ns={n:s.n,d:r.d}; });
    /* side of the Goldbach: the sign of the cross product with the segment nearest, for points within its y range */
    const g=L.polyDist(a.p,G.GOLDBACH_M), s0=G.GOLDBACH_M[g.i], s1=G.GOLDBACH_M[g.i+1], cr=(s1[0]-s0[0])*(a.p[1]-s0[1])-(s1[1]-s0[1])*(a.p[0]-s0[0]);
    const inRange=a.p[1]>=G.GOLDBACH_M[0][1]&&a.p[1]<=410&&g.d<40;
    out.anchors.push({id, ph:a.ph, side:G.FORMATIONS[id].nation==="fr"?"fr":"al", arm:G.FORMATIONS[id].arm, p:a.p, cover:CLS[G.drawnCover(ww[0],ww[1])], nearestStream:ns.n, streamM:M(ns.d),
      goldbachSide:inRange?(cr>0?"west":"east"):null, goldbachM:M(g.d)}); }); });
/* summary */
const LC=out.legCrossings, byKind=k=>LC.filter(x=>x.kind===k).length;
out.summary={legCrossings:LC.length, inVillage:byKind("in a village's place"), atRoad:byKind("at a road's crossing"), open:byKind("open"),
  openNotInfantry:LC.filter(x=>x.kind==="open"&&!/^(inf|guard)$/.test(x.arm)).length, legsOnWetCover:out.legWet.length,
  anchorsOnWater:out.anchors.filter(a=>a.cover==="water").length, anchorsOnMarsh:out.anchors.filter(a=>a.cover==="marsh").length, auditMovement:G.auditMovement().length};
fs.writeFileSync(path.join(EV,"crossings.json"),JSON.stringify(out,null,1));
console.log("road and track crossings of the drawn streams ("+roadX.length+"):"); roadX.forEach(r=>console.log("  "+r.stream.padEnd(40)+r.road.padEnd(32)+JSON.stringify(r.at)+" "+r.village+" "+r.villageM+" m"+(r.inVillagePlace?" (in its place)":"")));
console.log("\nleg crossings of the drawn streams: "+JSON.stringify(out.summary));
LC.forEach(x=>console.log("  "+x.kind.padEnd(22)+x.id.padEnd(14)+x.arm.padEnd(6)+x.leg.padEnd(6)+x.window.join("-").padEnd(12)+x.stream.padEnd(42)+JSON.stringify(x.at).padEnd(14)+x.village+" "+x.villageM+" m"+(x.nearestRoadCrossing?" | road crossing "+x.nearestRoadCrossing.m+" m ("+x.nearestRoadCrossing.road+")":"")+(x.ice?" ICE":"")));
console.log("\nlegs over drawn marsh or water ("+out.legWet.length+"):"); out.legWet.sort((a,b)=>b.longestWetM-a.longestWetM).forEach(x=>console.log("  "+x.id.padEnd(14)+x.arm.padEnd(6)+x.leg.padEnd(6)+x.window.join("-").padEnd(12)+"marsh "+x.marsh+" water "+x.water+" longest wet run "+x.longestWetM+" m at "+JSON.stringify(x.longestWetAt)+" near "+x.nearVillage+(x.ice?" ICE":"")));
console.log("\nanchors on drawn water or marsh:"); out.anchors.filter(a=>a.cover==="water"||a.cover==="marsh").forEach(a=>console.log("  "+(a.id+"@"+a.ph).padEnd(18)+a.arm.padEnd(6)+a.cover.padEnd(7)+JSON.stringify(a.p)+" "+a.nearestStream+" "+a.streamM+" m"));
