/* Writes tools/relief-dem.json: the elevation values the relief's tolerance lines (tools/relief-tolerance.js, terrain-test.js) are held against,
   extracted from the responses committed with the final audit and with WP-04b (Copernicus GLO-90 through Open-Meteo's elevation API), each
   source file named with its sha256, so that the test reads a small file and fetches nothing. Run again only if those responses change:
     node tools/relief-dem.js            (from the repository root)
   The limits are the audit's validation line (docs/FINAL_AUDIT_POST_STAGE8.md CL-GEO-01: the southern box's mean within 10 m, each profile's worst
   within 20 m, Slapanice within 10 m) with the chapel knoll held as Slapanice is, and WP-04b's summit line (no ground within 1 km of the
   Pratzeberg more than 2 m above its summit: an earlier candidate drew a false summit of 341.5 m 190 m south of it). The anchors are
   tools/relief-fit.js's A{}. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const ROOT=path.join(__dirname,".."), G=require(path.join(ROOT,"geo.js"));
const EV=path.join(ROOT,"docs","audit-post8-evidence","geography"), RAW=path.join(EV,"raw");
const used=[], rd=f=>{ const b=fs.readFileSync(f); used.push({file:path.relative(ROOT,f), sha256:crypto.createHash("sha256").update(b).digest("hex")}); return JSON.parse(b.toString("utf8")); };
const r1=v=>+v.toFixed(2);
/* the 300 m core grid (dem-core-request.json, raw/openmeteo-core-*.json) */
const core=rd(path.join(EV,"dem-core-request.json")), CE=[];
for(let i=0;;i++){ const f=path.join(RAW,"openmeteo-core-"+i+".json"); if(!fs.existsSync(f)) break; CE.push(...rd(f).elevation); }
if(CE.length!==core.length) throw new Error("core grid: "+CE.length+" heights for "+core.length+" points");
const BOX=[270,330,295,350];
const box=core.map((p,i)=>[r1(p.map[0]),r1(p.map[1]),CE[i]]).filter(p=>p[0]>=BOX[0]&&p[0]<=BOX[1]&&p[1]>=BOX[2]&&p[1]<=BOX[3]);
/* the four profiles (dem-profiles-request.json, raw/openmeteo-dem-profiles.json) */
const pr=rd(path.join(EV,"dem-profiles-request.json")), PE=rd(path.join(RAW,"openmeteo-dem-profiles.json")).elevation;
if(PE.length!==pr.length) throw new Error("profiles: "+PE.length+" heights for "+pr.length+" points");
const profiles={}; pr.forEach((p,i)=>{ (profiles[p.set]=profiles[p.set]||[]).push([r1(p.map[0]),r1(p.map[1]),PE[i]]); });
/* Slapanice: the GT point in the audit's DEM request (dem-request.json, raw/openmeteo-dem-*.json) */
const dq=rd(path.join(EV,"dem-request.json")), DE=[];
for(let i=0;;i++){ const f=path.join(RAW,"openmeteo-dem-"+i+".json"); if(!fs.existsSync(f)) break; DE.push(...rd(f).elevation); }
if(DE.length!==dq.length) throw new Error("dem: "+DE.length+" heights for "+dq.length+" points");
const si=dq.findIndex(p=>p.set==="gt"&&p.id==="schlapanitz"); if(si<0) throw new Error("no GT.schlapanitz in dem-request.json");
/* the chapel: OSM's point (raw/nominatim-kaple-ujezd.json), GLO-90 by inverse distance of the four nearest points of the 100 m chapel grid
   (raw/openmeteo-dem-chapelgrid.json; its points the URL's lists), as tools/audit-post8/geography/extra.js (g) reads it */
const N=rd(path.join(RAW,"nominatim-kaple-ujezd.json")).find(r=>r.category==="amenity"&&/Anton/.test(r.name));
const Q=rd(path.join(RAW,"openmeteo-dem-chapelgrid.json")).elevation, U=fs.readFileSync(path.join(RAW,"openmeteo-dem-chapelgrid.url.txt"),"utf8");
used.push({file:path.relative(ROOT,path.join(RAW,"openmeteo-dem-chapelgrid.url.txt")), sha256:crypto.createHash("sha256").update(U).digest("hex")});
const la=U.match(/latitude=([^&]+)/)[1].split(",").map(Number), lo=U.match(/longitude=([^&\s]+)/)[1].split(",").map(Number);
const vin=require(path.join(ROOT,"tools","audit-post8","geography","lib.js")).vincenty;
const cd=la.map((a,i)=>({i, m:vin(+N.lat,+N.lon,a,lo[i]).m})).sort((a,b)=>a.m-b.m).slice(0,4);
let sw=0, s=0; cd.forEach(q=>{ const w=1/(q.m*q.m); sw+=w; s+=w*Q[q.i]; });
const chapelMap=G.toMap(+N.lat,+N.lon);
const A={pratzeberg:[324,5],vinohrady:[294,6],santon:[296,6],zuran:[290,6],bosenitz:[257,8],kobelnitz:[211,5],sokolnitz:[207,5],pratzen:[245,12],vinocol:[273,10],
  augezd:[195,8],krzenowitz:[210,8],austerlitz:[218,18]};   /* tools/relief-fit.js's A{} */
const out={note:"Written by tools/relief-dem.js; read by tools/relief-tolerance.js (terrain-test.js). GLO-90 is a 90 m surface model (houses and trees in it); the values are today's ground, not 1805's.",
  source:"Copernicus GLO-90 through the Open-Meteo elevation API (fetched by the final audit, docs/audit-post8-evidence/geography/)",
  limits:{boxMeanM:10, profileWorstM:20, pointM:10, summitKm:1, summitM:2},
  southernBox:{box:BOX, pts:box},
  profiles,
  slapanice:{map:dq[si].map.map(r1), dem:DE[si]},
  chapel:{name:N.name, osm:[+N.lat,+N.lon], map:chapelMap.map(r1), dem:+(s/sw).toFixed(1), nearest:cd.map(q=>({m:Math.round(q.m), dem:Q[q.i]}))},
  anchors:A,
  files:used};
fs.writeFileSync(path.join(__dirname,"relief-dem.json"),JSON.stringify(out,null,0).replace(/\],\[/g,"],\n["));
console.log("tools/relief-dem.json: box "+box.length+" cells, profiles "+Object.keys(profiles).map(k=>k+" "+profiles[k].length).join(", ")+", Slapanice "+DE[si]+" m, chapel "+(s/sw).toFixed(1)+" m; "+used.length+" files");
