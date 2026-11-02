/* v-batch-srcgeo (audit after Stage 8, verification): geography #1 checked independently of the area's scripts.
   Loads geo.js (GEOREF.toMap, kmBetween) in a vm, reads the area's saved Nominatim geometries of today's Roketnice and Říčka
   (docs/audit-post8-evidence/geography/raw/nominatim-water-{roketnice,ricka}.json, MultiLineString), transforms them to map units,
   and, for four villages and two anchors, gives the nearest distance to the drawn GOLDBACH_M (world.js, parsed from its text)
   and to today's two channels, with the side read as the channel's x at the point's y (the reach runs about north-south).
   Usage: node banks.js <repo root>. Writes nothing; prints JSON. */
"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm");
const ROOT=path.resolve(process.argv[2]||".");
const ctx={};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT,"geo.js"),"utf8")+"\nthis.G=GEOREF;",ctx);
const G=ctx.G, U=1000/G.UNITS_PER_KM;   /* metres per map unit */
const wsrc=fs.readFileSync(path.join(ROOT,"world.js"),"utf8");
const GB=JSON.parse(/var GOLDBACH_M=(\[[\s\S]*?\]\]);/.exec(wsrc)[1]);
function lines(file){ const d=JSON.parse(fs.readFileSync(file,"utf8")); const r=Array.isArray(d)?d[0]:d; const g=r.geojson;
  const L=g.type==="LineString"?[g.coordinates]:g.coordinates; return L.map(l=>l.map(c=>G.toMap(c[1],c[0]))); }
const EV=path.join(ROOT,"docs/audit-post8-evidence/geography/raw");
const rok=lines(path.join(EV,"nominatim-water-roketnice.json")), ric=lines(path.join(EV,"nominatim-water-ricka.json"));
function segD(p,a,b){ const dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy; let t=L?((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L:0; t=Math.max(0,Math.min(1,t));
  const q=[a[0]+t*dx,a[1]+t*dy]; return {d:Math.hypot(p[0]-q[0],p[1]-q[1]),q}; }
function near(p,polys){ let best={d:1e9}; polys.forEach(pl=>{ for(let i=0;i<pl.length-1;i++){ const r=segD(p,pl[i],pl[i+1]); if(r.d<best.d) best=r; } }); return best; }
function xAtY(y,polys,p){ /* the channel's x where it crosses the point's y, nearest crossing to the point */
  let bx=null; polys.forEach(pl=>{ for(let i=0;i<pl.length-1;i++){ const a=pl[i],b=pl[i+1]; if((a[1]-y)*(b[1]-y)<=0&&a[1]!==b[1]){ const x=a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]); if(bx===null||Math.abs(x-p[0])<Math.abs(bx-p[0])) bx=x; } } }); return bx; }
const PTS={Girzikowitz:[233,162],Puntowitz:[213,222],Kobelnitz:[205,277],Sokolnitz:[208,365],"sthilaire@2":[206,231],"vandamme@2":[221,182]};
const out={metresPerUnit:+U.toFixed(3),rows:[]};
for(const [k,p] of Object.entries(PTS)){
  const dr=near(p,[GB]), rk=near(p,rok), rc=near(p,ric), today=rk.d<rc.d?{n:"Roketnice",r:rk,polys:rok}:{n:"Říčka",r:rc,polys:ric};
  const xd=xAtY(p[1],[GB],p), xt=xAtY(p[1],today.polys,p);
  out.rows.push({id:k,p,drawn:{m:Math.round(dr.d*U),bedX:xd&&+xd.toFixed(1),bedIs:xd>p[0]?"east":"west"},
    today:{channel:today.n,m:Math.round(today.r.d*U),bedX:xt&&+xt.toFixed(1),bedIs:xt>p[0]?"east":"west"}});
}
/* the Roketnice's southernmost point (its mouth) and the drawn bed's largest gap to today's channel (Roketnice then Říčka) over y 160-309.8 */
let mouth=null; rok.forEach(pl=>pl.forEach(q=>{ if(!mouth||q[1]>mouth[1]) mouth=q; })); out.roketniceMouth=mouth.map(v=>+v.toFixed(1));
let worst={m:0}; for(let y=160;y<=309.8;y+=1){ const x=xAtY(y,[GB],[0,0]); if(x==null) continue; const p=[x,y];
  const d=Math.min(near(p,rok).d, y>mouth[1]?near(p,ric).d:1e9, near(p,ric).d); const m=Math.round(d*U); if(m>worst.m) worst={m,at:[+x.toFixed(1),y]}; }
out.drawnBedWorstGapY160to309={...worst};
console.log(JSON.stringify(out,null,1));
