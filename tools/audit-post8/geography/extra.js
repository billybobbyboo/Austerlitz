/* Post-Stage-8 final audit, area "geography": the measures the first session left unanalysed or did not reach, from responses already saved.
   (a) the relief along four profiles across the southern plateau (raw/openmeteo-dem-profiles.json, Copernicus GLO-90 via Open-Meteo, saved by
       the first session) against the model (GEOREF.elevM(hAt)); (b) who stands on the southern plateau's box (plateau.json's x 270-330, y
       295-350) and when, every 10 minutes 04:00-17:00 (posAtClock, as the app moves them); (c) the sight line from the chapel of St Anthony
       (GT.chapel, and gqg@8) to the Satschan mere's centre on the model and on the surveyed ground (the 300 m core grid, bilinear); (d) the
       banks: Girzikowitz, Puntowitz, Kobelnitz and every anchor within 1 km of the drawn Goldbach north of 8J's corrected reach (y 150-309.8),
       on which side of the drawn bed and of today's (OSM: Roketnice above its mouth, Říčka below; regulated channels, not 1805's); (e) the
       drawn brooks BROOKS[0] and BROOKS[2] against every waterway in the OSM extracts the first session saved round them; (f) the highway
       east of the Santon's foot (ROADS[0], 8K) against OSM's road 430 (raw/osm-ways-highway430.json, extracted by osm-ways.py), with the
       Santon, Holubitz and the post house against both.
   node tools/audit-post8/geography/extra.js ROOT   (ROOT: an isolated copy with node_modules and _clock.js). Writes
   docs/audit-post8-evidence/geography/extra.json. Measurement code only: reads the tree, never writes it. */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(process.argv[2]||path.join(__dirname,"..","..",".."));
const EV=path.join(__dirname,"..","..","..","docs","audit-post8-evidence","geography"), RAW=path.join(EV,"raw");
const L=require("./lib.js"), G=L.load(ROOT), GR=G.GEOREF, KM=GR.KM_PER_MAP, M=u=>Math.round(u*KM*1000);
const elev=(x,y)=>GR.elevM(G.hAt(x,y));
const out={tool:"tools/audit-post8/geography/extra.js", root:ROOT};
/* (a) profiles */
{ const R=JSON.parse(fs.readFileSync(path.join(EV,"dem-profiles-request.json"),"utf8")), E=JSON.parse(fs.readFileSync(path.join(RAW,"openmeteo-dem-profiles.json"),"utf8")).elevation;
  if(R.length!==E.length) throw new Error("profiles "+E.length+" of "+R.length);
  const P={}; R.forEach((p,i)=>{ (P[p.set]=P[p.set]||[]).push({k:p.k, map:p.map.map(v=>+v.toFixed(1)), dem:E[i], model:+elev(p.map[0],p.map[1]).toFixed(1)}); });
  out.profiles={}; Object.keys(P).forEach(s=>{ const a=P[s], d=a.map(r=>r.model-r.dem);
    out.profiles[s]={from:a[0].map, to:a[a.length-1].map, lengthKm:+GR.kmBetween(a[0].map,a[a.length-1].map).toFixed(2), rows:a,
      meanModelMinusDem:+(d.reduce((x,y)=>x+y,0)/d.length).toFixed(1), worst:+d.reduce((x,y)=>Math.abs(y)>Math.abs(x)?y:x,0).toFixed(1),
      over238Dem:a.filter(r=>r.dem>238.2).length, over238Model:a.filter(r=>r.model>238.2).length, n:a.length}; }); }
/* (b) the southern plateau's box: who stands there and when */
{ const box=p=>p[0]>=270&&p[0]<=330&&p[1]>=295&&p[1]<=350, occ={};
  for(let t=240;t<=1020;t+=10) Object.keys(G.FORMATIONS).forEach(id=>{ const f=G.FORMATIONS[id]; if(!f.track) return; if(G.goneAt(id,t)||G.notYetAt(id,t)) return;
    const p=G.posAtClock(id,t); if(!p||!box(p)) return; const o=occ[id]=occ[id]||{id, name:f.name, nation:f.nation, arm:f.arm, clocks:[], model:[]}; o.clocks.push(t); o.model.push(elev(p[0],p[1])); });
  out.southernBox={box:"map x 270-330, y 295-350 (plateau.json's southernPlateau: model mean 228.1 m, surveyed 273.4 m)",
    formations:Object.values(occ).map(o=>({id:o.id, name:o.name, nation:o.nation, arm:o.arm, from:G.fmtClock(o.clocks[0]), to:G.fmtClock(o.clocks[o.clocks.length-1]), samples:o.clocks.length,
      modelM:[Math.round(Math.min(...o.model)),Math.round(Math.max(...o.model))]}))}; }
/* (c) the sight line from the chapel to the Satschan mere's centre, model against survey */
{ const req=JSON.parse(fs.readFileSync(path.join(EV,"dem-core-request.json"),"utf8")), E=[];
  for(let i=0;;i++){ const f=path.join(RAW,"openmeteo-core-"+i+".json"); if(!fs.existsSync(f)) break; E.push(...JSON.parse(fs.readFileSync(f,"utf8")).elevation); }
  const s=0.3*GR.K, nx=Math.round((360-150)/s)+1, ny=E.length/nx;
  /* bilinear; the last row and column clamped (the mere's centre, y 421, lies 0.2 units beyond the grid's last row, y 420.8) */
  const dem=(mx,my)=>{ const fi=(mx-150)/s, fj=(my-60)/s; if(fi<0||fj<0||fi>nx-1+0.05||fj>ny-1+0.05) return null; const i=Math.min(Math.floor(fi),nx-2), j=Math.min(Math.floor(fj),ny-2);
    const u=Math.min(1,fi-i), v=Math.min(1,fj-j); return (E[j*nx+i]*(1-u)+E[j*nx+i+1]*u)*(1-v)+(E[(j+1)*nx+i]*(1-u)+E[(j+1)*nx+i+1]*u)*v; };
  const SATS=[268,421];   /* world.js SATS = W(268,421): the mere's centre in map units */
  const los=(from,to,hf,eye)=>{ const n=200, D=GR.kmBetween(from,to)*1000, h0=hf(from[0],from[1])+eye, ht=hf(to[0],to[1]); let worst=-Infinity, at=null;
    const tAng=(ht-h0)/D; for(let k=1;k<n;k++){ const f=k/n, p=[from[0]+(to[0]-from[0])*f, from[1]+(to[1]-from[1])*f], h=hf(p[0],p[1]); if(h==null) return null; const a=(h-h0)/(D*f); if(a>worst){ worst=a; at={f:+f.toFixed(3), map:p.map(v=>+v.toFixed(1)), h:+h.toFixed(1)}; } }
    return {eyeM:+h0.toFixed(1), targetM:+ht.toFixed(1), distanceM:Math.round(D), visible:tAng>worst, marginM:+((tAng-worst)*D).toFixed(1), obstruction:at}; };
  const g8=G.anchorList("gqg").find(a=>a.ph===8);
  out.chapelSight={note:"eye 3 m above the ground at each end's own ground; the target the ground at the mere's centre (the model's pond bed under the drawn ice; today's drained bed); GLO-90 is a surface model sampled every 300 m (houses and trees smoothed)",
    gtChapel:{map:GR.GT.chapel.map.map(v=>+v.toFixed(2)), modelM:+elev(...GR.GT.chapel.map).toFixed(1), demM:+dem(...GR.GT.chapel.map).toFixed(1),
      model:los(GR.GT.chapel.map,SATS,elev,3), survey:los(GR.GT.chapel.map,SATS,dem,3)},
    gqg8:g8&&g8.p?{map:g8.p, modelM:+elev(g8.p[0],g8.p[1]).toFixed(1), demM:+dem(g8.p[0],g8.p[1]).toFixed(1), model:los(g8.p,SATS,elev,3), survey:los(g8.p,SATS,dem,3)}:null}; }
/* (d) the banks north of 8J's corrected reach, against today's channels */
{ const osm=f=>{ const J=JSON.parse(fs.readFileSync(path.join(RAW,f),"utf8")); const g=J[0].geojson; return (g.type==="LineString"?[g.coordinates]:g.coordinates).map(l=>l.map(c=>GR.toMap(c[1],c[0]))); };
  const down=Lp=>Lp[0][1]>Lp[Lp.length-1][1]?Lp.slice().reverse():Lp;   /* oriented southward: these streams flow north to south in the frame */
  const rok=down(osm("nominatim-water-roketnice.json")[0]), ric=down(osm("nominatim-water-ricka.json")[0]), GB=G.GOLDBACH_M;
  const mouth=rok[rok.length-1], mi=L.polyDist(mouth,ric);
  /* today's Goldbach: the Roketnice to its mouth, then the Říčka below it */
  const today=rok.concat(ric.slice(mi.i+1));
  const side=(p,Lp)=>{ const r=L.polyDist(p,Lp), a=Lp[r.i], b=Lp[r.i+1], cr=(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]); return {m:M(r.d), bank:cr>0?"west":"east"}; };
  const rows=[];
  [["Girzikowitz",[233,162]],["Puntowitz",[213,222]],["Kobelnitz",[205,277]],["Sokolnitz",[208,365]]].forEach(([n,p])=>{ const d=side(p,GB), t=side(p,today); rows.push({kind:"village", id:n, p, drawn:d, today:t, swap:d.bank!==t.bank}); });
  Object.keys(G.FORMATIONS).forEach(id=>{ const f=G.FORMATIONS[id]; if(!f.track) return; G.anchorList(id).forEach(a=>{ if(!a.p) return; const p=a.p; if(p[1]<150||p[1]>309.8) return;
    const d=side(p,GB); if(d.m>1000) return; const t=side(p,today); const act=(f.track[a.ph]&&(f.track[a.ph].act||f.track[a.ph].a))||"";
    rows.push({kind:"anchor", id:id+"@"+a.ph, nation:f.nation, arm:f.arm, p, grade:a.g||a.grade||(f.track[a.ph]&&f.track[a.ph].g)||null, drawn:d, today:t, swap:d.bank!==t.bank, act:String(act).slice(0,140)}); }); });
  out.banks={note:"today's Goldbach = OSM's Roketnice (relation 13723335) to its mouth on the Říčka, then the Říčka (relation 7052180); regulated modern channels, not 1805's (at Sokolnitz 8J found the 1825 bed within about 10 m of today's)",
    roketniceMouthMap:mouth.map(v=>+v.toFixed(1)), rows, swaps:rows.filter(r=>r.swap).map(r=>r.id)}; }
/* (e) BROOKS[0] and BROOKS[2] against every waterway OSM has round them */
{ out.brooks={}; [["brooks0","osm-waterways-brooks0.json",G.BROOKS_M[0]],["brooks2","osm-waterways-brooks2.json",G.BROOKS_M[2]]].forEach(([k,f,B])=>{
    const W=JSON.parse(fs.readFileSync(path.join(RAW,f),"utf8")).map(w=>({id:w.id, name:w.name||"(unnamed)", type:w.type, p:w.pts.map(c=>GR.toMap(c[0],c[1]))}));
    const pts=[]; for(let i=0;i<B.length-1;i++) for(let s=0;s<=20;s++) pts.push([B[i][0]+(B[i+1][0]-B[i][0])*s/20, B[i][1]+(B[i+1][1]-B[i][1])*s/20]);
    const near=pts.map(p=>{ let best=null; W.forEach(w=>{ if(w.p.length<2) return; const r=L.polyDist(p,w.p); if(!best||r.d<best.d) best={d:r.d, w:w.name+" ("+w.type+", way "+w.id+")"}; }); return best; });
    const ds=near.map(n=>n.d).sort((a,b)=>a-b), names={}; near.forEach(n=>names[n.w]=(names[n.w]||0)+1);
    out.brooks[k]={drawn:B, osmWaterways:W.length, medianM:M(ds[Math.floor(ds.length/2)]), maxM:M(ds[ds.length-1]), within150m:+(near.filter(n=>M(n.d)<=150).length/near.length).toFixed(2), nearest:names}; }); }
/* (f) the highway east of the Santon's foot against OSM's road 430 */
{ const J=JSON.parse(fs.readFileSync(path.join(RAW,"osm-ways-highway430.json"),"utf8")), W=J.ways.map(w=>w.pts.map(c=>GR.toMap(c[0],c[1])));
  const near=p=>{ let best=Infinity; W.forEach(w=>{ if(w.length>1) best=Math.min(best,L.polyDist(p,w).d); }); return best; };
  const R0=G.ROADS[0].p, i0=R0.findIndex(q=>q[0]===224&&q[1]===103.8), east=R0.slice(i0);
  const samp=[]; for(let i=0;i<east.length-1;i++){ const n=Math.max(1,Math.ceil(Math.hypot(east[i+1][0]-east[i][0],east[i+1][1]-east[i][1])/1)); for(let s=0;s<n;s++) samp.push([east[i][0]+(east[i+1][0]-east[i][0])*s/n, east[i][1]+(east[i+1][1]-east[i][1])*s/n]); }
  /* inside the OSM extract's box only (16.762-16.832 E, 49.180-49.196 N) */
  const inBox=p=>{ const g=GR.toGeo(p[0],p[1]); return g[1]>=16.762&&g[1]<=16.832&&g[0]>=49.180&&g[0]<=49.196; };
  const S=samp.filter(inBox).map(p=>({p:p.map(v=>+v.toFixed(1)), m:M(near(p))})), d=S.map(r=>r.m).sort((a,b)=>a-b);
  const santon=GR.GT.santon.map, hol=GR.GT.holubitz.map, post=GR.GT.posthouse.map;
  out.highway={osmWays:W.length, samples:S.length, medianM:d[Math.floor(d.length/2)], p95M:d[Math.floor(0.95*(d.length-1))], maxM:d[d.length-1], worst:S.slice().sort((a,b)=>b.m-a.m).slice(0,5),
    santonToDrawnM:M(L.polyDist(santon,R0).d), santonToOsmM:M(near(santon)), holubitzToDrawnM:M(L.polyDist(hol,R0).d), holubitzToOsmM:M(near(hol)),
    postToDrawnM:M(L.polyDist(post,R0).d), postToOsmM:M(near(post))}; }
/* (g) the chapel of St Anthony: OSM's place of worship (raw/nominatim-kaple-ujezd.json) against GT.chapel (approx), the model and the surveyed
   ground there (the first session's 100 m chapel grid, raw/openmeteo-dem-chapelgrid.json, bilinear) */
{ const N=JSON.parse(fs.readFileSync(path.join(RAW,"nominatim-kaple-ujezd.json"),"utf8")).find(r=>r.category==="amenity"&&/Anton/.test(r.name));
  const Q=JSON.parse(fs.readFileSync(path.join(RAW,"openmeteo-dem-chapelgrid.json"),"utf8")).elevation, U=fs.readFileSync(path.join(RAW,"openmeteo-dem-chapelgrid.url.txt"),"utf8");
  /* the grid's points as requested (the URL's latitude and longitude lists, 9 x 9 about GT.chapel, about 100 m apart), paired with the response */
  const la=U.match(/latitude=([^&]+)/)[1].split(",").map(Number), lo=U.match(/longitude=([^&\s]+)/)[1].split(",").map(Number);
  if(la.length!==Q.length||lo.length!==Q.length) throw new Error("chapel grid "+Q.length+" heights, "+la.length+" points");
  const c0=GR.GT.chapel.map, gx=(mx,my)=>{ const g=GR.toGeo(mx,my), d=la.map((a,i)=>({i, m:L.vincenty(g[0],g[1],a,lo[i]).m})).sort((a,b)=>a.m-b.m).slice(0,4);
    if(d[0].m>150) return null; if(d[0].m<1) return Q[d[0].i]; let sw=0, s=0; d.forEach(q=>{ const w=1/(q.m*q.m); sw+=w; s+=w*Q[q.i]; }); return s/sw; };   /* inverse-distance, the 4 nearest */
  const osmP=[+N.lat,+N.lon], om=GR.toMap(osmP[0],osmP[1]), v=L.vincenty(GR.GT.chapel.lat,GR.GT.chapel.lon,osmP[0],osmP[1]);
  out.chapel={osm:{name:N.name, lat:osmP[0], lon:osmP[1], map:om.map(x=>+x.toFixed(2))}, gtToOsm:{m:+v.m.toFixed(0), az:+v.az.toFixed(0)},
    atOsm:{modelM:+elev(om[0],om[1]).toFixed(1), demM:+gx(om[0],om[1]).toFixed(1)}, atGt:{modelM:+elev(c0[0],c0[1]).toFixed(1), demM:+gx(c0[0],c0[1]).toFixed(1)},
    gridMaxDem:Math.max(...Q), villageAugezd:{modelM:+elev(...GR.GT.augezd.map).toFixed(1), sourcedM:GR.GT.augezd.elev}}; }
/* (h) the château's garden: GARDENS[0].poly against OSM's way 27326751 (Zámecká zahrada), and the château, real and drawn, against it */
{ const J=JSON.parse(fs.readFileSync(path.join(RAW,"osm-ways-garden27326751.json"),"utf8")), O=J.ways[0].pts.map(c=>GR.toMap(c[0],c[1])), D=G.GARDENS[0].poly;
  const area=P=>{ let s=0; for(let i=0,j=P.length-1;i<P.length;j=i++) s+=(P[j][0]*P[i][1]-P[i][0]*P[j][1]); return Math.abs(s/2)*KM*KM*100; };   /* hectares */
  const closed=P=>P.concat([P[0]]), hd=(A,B)=>Math.max(...A.map(p=>L.polyDist(p,closed(B)).d));
  const inP=(p,P)=>{ let c=false; for(let i=0,j=P.length-1;i<P.length;j=i++){ const a=P[i], b=P[j]; if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0]) c=!c; } return c; };
  const real=GR.toMap(49.154722,16.874556), drawn=[494.41,123.26];   /* Wikidata Q1418278; the drawn main range's centre (buildings.json) */
  out.garden={osmAreaHa:+area(O).toFixed(2), drawnAreaHa:+area(D).toFixed(2), hausdorffM:M(Math.max(hd(D,O),hd(O,D))), drawnVertices:D.length, osmVertices:O.length,
    realChateauInGarden:inP(real,O), realChateauToGardenEdgeM:M(L.polyDist(real,closed(O)).d), drawnChateauInGarden:inP(drawn,O), drawnChateauToGardenEdgeM:M(L.polyDist(drawn,closed(O)).d),
    gardenXRange:[Math.min(...O.map(p=>p[0])),Math.max(...O.map(p=>p[0]))].map(x=>+x.toFixed(1)), realChateauMap:real.map(x=>+x.toFixed(2)), drawnChateauMap:drawn}; }
fs.writeFileSync(path.join(EV,"extra.json"),JSON.stringify(out,null,1));
console.log("chapel:",JSON.stringify(out.chapel)); console.log("garden:",JSON.stringify(out.garden));
/* print */
Object.entries(out.profiles).forEach(([k,v])=>console.log("profile "+k+" ("+v.lengthKm+" km): model-DEM mean "+v.meanModelMinusDem+" m, worst "+v.worst+" m; over the fog top 238.2 m: DEM "+v.over238Dem+"/"+v.n+", model "+v.over238Model+"/"+v.n+"\n   DEM   "+v.rows.map(r=>Math.round(r.dem)).join(" ")+"\n   model "+v.rows.map(r=>Math.round(r.model)).join(" ")));
console.log("southern box:"); out.southernBox.formations.forEach(f=>console.log("  "+f.id.padEnd(12)+(f.nation||"").padEnd(4)+(f.arm||"").padEnd(6)+f.from+"-"+f.to+" ("+f.samples+" samples) model "+f.modelM.join("-")+" m"));
console.log("chapel sight:",JSON.stringify(out.chapelSight.gtChapel)); console.log("gqg@8 sight:",JSON.stringify(out.chapelSight.gqg8));
console.log("banks: roketnice mouth",out.banks.roketniceMouthMap,"swaps",out.banks.swaps.length,JSON.stringify(out.banks.swaps));
out.banks.rows.forEach(r=>console.log("  "+r.kind.padEnd(8)+r.id.padEnd(16)+JSON.stringify(r.p).padEnd(14)+" drawn "+r.drawn.bank+" "+r.drawn.m+" m | today "+r.today.bank+" "+r.today.m+" m"+(r.swap?"  SWAP":"")+(r.act?"  "+r.act.slice(0,70):"")));
Object.entries(out.brooks).forEach(([k,v])=>console.log(k+": median "+v.medianM+" m, max "+v.maxM+" m from OSM's nearest waterway, within 150 m "+v.within150m+"; nearest "+JSON.stringify(v.nearest)));
console.log("highway:",JSON.stringify(out.highway));
