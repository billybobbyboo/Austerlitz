/* v-batch-srcgeo (audit after Stage 8, verification): geography #2 checked independently of the area's scripts.
   For today's Tvaroženský potok (the Bosenitz brook) and Říčka (the area's saved Nominatim geometries, raw/nominatim-water-*.json), the share of
   their length inside the map frame (x 0-680, y 0-500 map units, tools/map-frame.js) that lies over 300 m from every drawn stream (world.js GOLDBACH_M,
   LITAVA_M, BROOKS_M, parsed from its text), and the largest such distance; and the drawn upper Goldbach (y 109-176) against today's nearest
   channel of the four. Usage: node hydro.js <repo root>. Writes nothing; prints JSON. */
"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm");
const ROOT=path.resolve(process.argv[2]||".");
const ctx={};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT,"geo.js"),"utf8")+"\nthis.G=GEOREF;",ctx);
const G=ctx.G, U=1000*G.kmBetween([0,0],[1,0]);
const w=fs.readFileSync(path.join(ROOT,"world.js"),"utf8");
const GB=JSON.parse(/var GOLDBACH_M=(\[[\s\S]*?\]\]);/.exec(w)[1]);
const LI=JSON.parse(/var LITAVA_M *=(\[[\s\S]*?\]\]);/.exec(w)[1]);
const BR=JSON.parse("["+/var BROOKS_M=\[([\s\S]*?)\n\];/.exec(w)[1].replace(/\/\*[\s\S]*?\*\//g,"")+"]");
const DRAWN=[GB,LI].concat(BR);
const EV=path.join(ROOT,"docs/audit-post8-evidence/geography/raw");
function lines(n){ const d=JSON.parse(fs.readFileSync(path.join(EV,"nominatim-water-"+n+".json"),"utf8")); const r=Array.isArray(d)?d[0]:d; const g=r.geojson;
  return (g.type==="LineString"?[g.coordinates]:g.coordinates).map(l=>l.map(c=>G.toMap(c[1],c[0]))); }
function segD(p,a,b){ const dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy; let t=L?((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L:0; t=Math.max(0,Math.min(1,t)); return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy); }
function near(p,polys){ let b=1e9; polys.forEach(pl=>{ for(let i=0;i<pl.length-1;i++) b=Math.min(b,segD(p,pl[i],pl[i+1])); }); return b; }
function sample(polys,step){ const o=[]; polys.forEach(pl=>{ for(let i=0;i<pl.length-1;i++){ const a=pl[i],b=pl[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(L/step));
  for(let k=0;k<n;k++) o.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n,L/n]); } }); return o; }
const inFrame=p=>p[0]>=0&&p[0]<=680&&p[1]>=0&&p[1]<=500;   /* tools/map-frame.js: 680 x 500 */
const out={};
for(const n of ["tvarozensky","ricka","roketnice"]){
  const S=sample(lines(n),0.5).filter(inFrame); let len=0,over=0,max=0;
  S.forEach(p=>{ const d=near(p,DRAWN)*U; len+=p[2]; if(d>300) over+=p[2]; max=Math.max(max,d); });
  out[n]={kmInFrame:+(len*U/1000).toFixed(2),kmOver300m:+(over*U/1000).toFixed(2),maxM:Math.round(max)};
}
const today=["roketnice","ricka","tvarozensky"].map(lines).flat();
const up=sample([GB],0.5).filter(p=>p[1]>=109&&p[1]<=176).map(p=>near(p,today)*U);
out.drawnUpperGoldbach_y109_176={minM:Math.round(Math.min(...up)),maxM:Math.round(Math.max(...up))};
console.log(JSON.stringify(out,null,1));
