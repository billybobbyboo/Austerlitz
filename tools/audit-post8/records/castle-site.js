/* Records audit: 21.9's remaining finding "the castle's site on the model's road class, a track passing it (8J)" read again in node on the
   live sources, with the geography area's loader (tools/audit-post8/geography/lib.js). Prints the drawn class (drawnCover) at
   LANDMARK_SITES.castle and in a ring around it, and the nearest road or track ribbon's distance. Measurement only.
   node tools/audit-post8/records/castle-site.js ROOT */
"use strict";
const path=require("path"), ROOT=path.resolve(process.argv[2]||path.join(__dirname,"..","..",".."));
const L=require("../geography/lib.js"), G=L.load(ROOT,{clock:false});
const CLS=["field","meadow","marsh","water","wood","village","vineyard","track"];
const s=G.LANDMARK_SITES.castle, w=G.W(s[0],s[1]), M=G.GEOREF.M_PER_WORLD;
const out={site:s, classAtSite:CLS[G.drawnCover(w[0],w[1])], ring:{}};
for(const rM of [25,50,75]){ const c={}; for(let a=0;a<16;a++){ const t=a/16*2*Math.PI, x=w[0]+Math.cos(t)*rM/M, z=w[1]+Math.sin(t)*rM/M; const k=CLS[G.drawnCover(x,z)]; c[k]=(c[k]||0)+1; } out.ring[rM+"m"]=c; }
let best=null; (G.ROADS||[]).forEach((r,ri)=>{ const pts=r.pts||r.p||r.path||r; if(!Array.isArray(pts)) return;
  pts.forEach(p=>{ if(!Array.isArray(p)) return; const d=Math.hypot(p[0]-s[0],p[1]-s[1])*M/G.GEOREF.MAP_PER_WORLD; if(!best||d<best.dM) best={road:ri,name:r.name||r.n||null,dM:Math.round(d)}; }); });
out.nearestRoadVertex=best;
console.log(JSON.stringify(out));
