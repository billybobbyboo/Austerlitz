/* Post-Stage-8 final audit, area "geography": the transform and the places checked against independent modern positions.
   Reads geo.js and world.js (no browser), the raw responses fetch-places.js saved (cs.wikipedia/Wikidata P625, Nominatim), and writes
   docs/audit-post8-evidence/geography/places.json: per place the ground truth (GEOREF.GT), what the map draws (VILLAGES, FEATURES,
   LANDMARK_SITES, GT.posthouse), each independent source's point and the offsets in metres (Vincenty on WGS 84) and degrees (true), and a
   similarity fit of the drawn village points to Wikidata's, against GEOREF's own scale and turn.
   node tools/audit-post8/geography/places.js [ROOT]   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(process.argv[2]||path.join(__dirname,"..","..",".."));
const EV=path.join(__dirname,"..","..","..","docs","audit-post8-evidence","geography"), RAW=path.join(EV,"raw");
const {vincenty}=require("./lib.js");
const GEOREF=require(path.join(ROOT,"geo.js"));
/* world.js's declarations read as data (acorn), not run: VILLAGES, LANDMARK_SITES */
const acorn=require(path.join(ROOT,"node_modules","acorn"));
const WSRC=fs.readFileSync(path.join(ROOT,"world.js"),"utf8"), DSRC=fs.readFileSync(path.join(ROOT,"data.js"),"utf8");
function declValue(src,name){ const ast=acorn.parse(src,{ecmaVersion:2020,locations:true});
  for(const n of ast.body) if(n.type==="VariableDeclaration") for(const d of n.declarations) if(d.id.name===name){
    return {value:Function('"use strict";return ('+src.slice(d.init.start,d.init.end)+');')(), line:d.loc.start.line}; } return null; }
const VILL=declValue(WSRC,"VILLAGES"), LS=declValue(WSRC,"LANDMARK_SITES");
global.window={}; const FEAT=declValue(DSRC,"FEATURES");
const V={}; VILL.value.forEach(v=>V[v[0]]=[v[1],v[2],v[3]]);
const F={}; FEAT.value.forEach(f=>F[f.id]=f);
const wd=JSON.parse(fs.readFileSync(path.join(RAW,"wikidata-0.json"),"utf8")).entities;
const cs=JSON.parse(fs.readFileSync(path.join(RAW,"cswiki-coords-0.json"),"utf8")).query.pages;
const WD={}; Object.values(cs).forEach(p=>{ if(!p.pageprops) return; const e=wd[p.pageprops.wikibase_item]; const c=e&&e.claims.P625&&e.claims.P625[0].mainsnak.datavalue.value;
  WD[p.title]={q:p.pageprops.wikibase_item, wd:c?[c.latitude,c.longitude]:null, cs:p.coordinates?[p.coordinates[0].lat,p.coordinates[0].lon]:null,
    elev:(e&&e.claims.P2044||[]).map(s=>+s.mainsnak.datavalue.value.amount)}; });
const nom=k=>{ const f=path.join(RAW,"nominatim-"+k+".json"); if(!fs.existsSync(f)) return null; const J=JSON.parse(fs.readFileSync(f,"utf8"));
  const r=J.find(x=>(x.type==="administrative"&&/Jihomoravsk/.test(x.display_name)&&!/^SO /.test(x.display_name))||x.type==="peak"||x.type==="village"||x.category==="building"||x.category==="amenity"||x.type==="viewpoint")||J[0];
  return r?{p:[+r.lat,+r.lon], kind:r.category+"/"+r.type, name:r.display_name.split(",").slice(0,2).join(",")}:null; };
const off=(a,b)=>{ if(!a||!b) return null; const v=vincenty(a[0],a[1],b[0],b[1]); return {m:+v.m.toFixed(1), az:+v.az.toFixed(0)}; };
const mapGeo=p=>GEOREF.toGeo(p[0],p[1]);
const ROWS=[
  /* key, kind, GT id, cs title, drawn map point and its declaration */
  ["telnitz","village","telnitz","Telnice (okres Brno-venkov)",V.Telnitz,"VILLAGES"],["sokolnitz","village","sokolnitz","Sokolnice",V.Sokolnitz,"VILLAGES"],
  ["kobelnitz","village","kobelnitz","Kobylnice (okres Brno-venkov)",V.Kobelnitz,"VILLAGES"],["puntowitz","village","puntowitz","Ponětovice",V.Puntowitz,"VILLAGES"],
  ["schlapanitz","village","schlapanitz","Šlapanice",V.Schlapanitz,"VILLAGES"],["girzikowitz","village","girzikowitz","Jiříkovice",V.Girzikowitz,"VILLAGES"],
  ["bosenitz","village","bosenitz","Tvarožná",V.Bosenitz,"VILLAGES"],["blasowitz","village","blasowitz","Blažovice",V.Blasowitz,"VILLAGES"],
  ["holubitz","village","holubitz","Holubice (okres Vyškov)",V.Holubitz,"VILLAGES"],["pratzen","village","pratzen","Prace",V.Pratzen,"VILLAGES"],
  ["krzenowitz","village","krzenowitz","Křenovice (okres Vyškov)",V.Krzenowitz,"VILLAGES"],["austerlitz","village","austerlitz","Slavkov u Brna",V.Austerlitz,"VILLAGES"],
  ["augezd","village","augezd","Újezd u Brna",V.Augezd,"VILLAGES"],["satschan","village","satschan","Žatčany",V.Satschan,"VILLAGES"],
  ["menitz","village","menitz","Měnín",V.Menitz,"VILLAGES"],["hostieradek","village","hostieradek","Hostěrádky-Rešov",V.Hostieradek,"VILLAGES"],
  ["turas","village","turas",null,V.Turas,"VILLAGES"],
  ["raigern","offmap","raigern","Rajhrad",null,null],["rausnitz","offmap","rausnitz","Rousínov",null,null],["kowalowitz","offmap","kowalowitz","Kovalovice",null,null],
  ["krug","village (no GT)",null,"Kruh (Holubice)",V.Krug,"VILLAGES"],["bellowitz","village (no GT)",null,"Bedřichovice (Šlapanice)",V.Bellowitz,"VILLAGES"],
  ["pratzeberg","summit","pratzeberg","Pracký kopec",F.pratzeberg&&F.pratzeberg.p,"FEATURES"],["vinohrady","summit","vinohrady","Staré vinohrady",F.vinohrady&&F.vinohrady.p,"FEATURES"],
  ["zuran","summit","zuran","Žuráň",F.zuran&&F.zuran.p,"FEATURES"],["santon","summit","santon",null,F.santon&&F.santon.p,"FEATURES"],
  ["castle","landmark",null,"Sokolnice (zámek)",LS.value.castle,"LANDMARK_SITES.castle"],
  ["prace_church","landmark",null,"Kostel Povýšení svatého Kříže (Prace)",LS.value.church.Pratzen,"LANDMARK_SITES.church.Pratzen"],
  ["posthouse","landmark","posthouse","Stará Pošta (Kovalovice)",V["Posoritz post house"],"VILLAGES (and GT.posthouse)"],
  ["chateau","landmark",null,"Slavkov u Brna (zámek)",null,"drawn by the planner (chateauPlan8g): see buildings.js"],
  ["mohyla","reference",null,"Mohyla míru",null,null]
];
const out={tool:"tools/audit-post8/geography/places.js", root:ROOT, geoMd5:require("crypto").createHash("md5").update(fs.readFileSync(path.join(ROOT,"geo.js"))).digest("hex"),
  lines:{VILLAGES:VILL.line, LANDMARK_SITES:LS.line, FEATURES:FEAT.line}, frame:{}, rows:[]};
/* the frame: round trip, scale, turn, north */
let rt=0; Object.values(GEOREF.GT).forEach(g=>{ const b=GEOREF.toGeo(g.map[0],g.map[1]); rt=Math.max(rt,vincenty(g.lat,g.lon,b[0],b[1]).m); });
out.frame={roundTripMaxM:rt, K_mapUnitsPerKm:GEOREF.K, KM_PER_MAP:GEOREF.KM_PER_MAP, M_PER_WORLD:GEOREF.M_PER_WORLD, ROT_DEG:GEOREF.ROT_DEG, NORTH:GEOREF.NORTH, EXAG:GEOREF.EXAG,
  V_M_PER_UNIT:GEOREF.V_M_PER_UNIT, DATUM_M:GEOREF.DATUM_M};
ROWS.forEach(([key,kind,gt,title,drawn,decl])=>{
  const g=gt?GEOREF.GT[gt]:null, W=title&&WD[title]?WD[title]:null, N=nom(key);
  const r={key, kind, gt:g?{lat:g.lat,lon:g.lon,map:g.map.map(v=>+v.toFixed(2)),approx:!!g.approx}:null, drawn:drawn?{map:[drawn[0],drawn[1]],decl}:null,
    wikidata:W&&W.wd?{q:W.q,p:W.wd,elev:W.elev}:null, cswiki:W&&W.cs?W.cs:null, nominatim:N};
  if(g){ r.gtToWikidata=off([g.lat,g.lon],W&&W.wd); r.gtToNominatim=off([g.lat,g.lon],N&&N.p); }
  if(drawn){ const dg=mapGeo(drawn); r.drawnGeo=dg.map(v=>+v.toFixed(6));
    if(g) r.drawnToGt={m:+(Math.hypot(drawn[0]-g.map[0],drawn[1]-g.map[1])*GEOREF.KM_PER_MAP*1000).toFixed(1)};
    r.drawnToWikidata=off(dg,W&&W.wd); r.drawnToNominatim=off(dg,N&&N.p);
    const ref=W&&W.wd?W.wd:(N&&N.p); if(ref){ const m=GEOREF.toMap(ref[0],ref[1]); r.modernMap=m.map(v=>+v.toFixed(2)); } }
  out.rows.push(r); });
/* similarity fit: Wikidata's village points (local km) to the drawn VILLAGES points, the 16 on-map GT villages but Turas */
const vil=out.rows.filter(r=>r.kind==="village"&&r.wikidata&&r.drawn&&r.gt);
const LAT0=49.14, LON0=16.76, KX=111.32*Math.cos(LAT0*Math.PI/180), KY=111.13;   /* geo.js's own tangent plane, for comparability */
const pts=vil.map(r=>({e:(r.wikidata.p[1]-LON0)*KX, n:(r.wikidata.p[0]-LAT0)*KY, x:r.drawn.map[0], y:r.drawn.map[1], key:r.key}));
/* map = [X0 + P e - Q n, Y0 - Q e - P n]: linear least squares in P, Q, X0, Y0 */
{ let S={}; const A=[], b=[]; pts.forEach(p=>{ A.push([p.e,-p.n,1,0]); b.push(p.x); A.push([-p.n,-p.e,0,1]); b.push(p.y); });
  const AtA=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]], Atb=[0,0,0,0];
  A.forEach((row,i)=>{ for(let a=0;a<4;a++){ Atb[a]+=row[a]*b[i]; for(let c=0;c<4;c++) AtA[a][c]+=row[a]*row[c]; } });
  /* Gauss-Jordan */
  const M=AtA.map((r,i)=>r.concat([Atb[i]])); for(let i=0;i<4;i++){ let p=i; for(let k=i+1;k<4;k++) if(Math.abs(M[k][i])>Math.abs(M[p][i])) p=k; [M[i],M[p]]=[M[p],M[i]];
    for(let k=0;k<4;k++) if(k!==i){ const f=M[k][i]/M[i][i]; for(let c=i;c<5;c++) M[k][c]-=f*M[i][c]; } }
  const [P,Q,X0,Y0]=M.map((r,i)=>r[4]/r[i]); const K=Math.hypot(P,Q), ROT=Math.atan2(Q,P)*180/Math.PI;
  const res=pts.map(p=>{ const x=X0+P*p.e-Q*p.n, y=Y0-Q*p.e-P*p.n; return {key:p.key, m:+(Math.hypot(x-p.x,y-p.y)/K*1000).toFixed(1)}; });
  out.fit={n:pts.length, K:+K.toFixed(4), ROT_DEG:+ROT.toFixed(3), X0:+X0.toFixed(3), Y0:+Y0.toFixed(3), scaleVsGEOREF:+(K/GEOREF.K).toFixed(5), rotVsGEOREF:+(ROT-GEOREF.ROT_DEG).toFixed(3),
    residualsM:res, rmsM:+Math.sqrt(res.reduce((s,r)=>s+r.m*r.m,0)/res.length).toFixed(1)}; }
/* the GT-vs-Wikidata shift: is it one vector (8H's 13.5 m at 35 degrees against ZABAGED)? */
{ const s=out.rows.filter(r=>r.kind==="village"&&r.gtToWikidata).map(r=>r.gtToWikidata);
  out.gtShift={n:s.length, m:s.map(x=>x.m), az:s.map(x=>x.az), mMin:Math.min(...s.map(x=>x.m)), mMax:Math.max(...s.map(x=>x.m))}; }
fs.writeFileSync(path.join(EV,"places.json"),JSON.stringify(out,null,1));
/* print */
const f=(o)=>o?(o.m.toFixed(0)+" m @"+o.az+"°").padEnd(14):"-".padEnd(14);
console.log("frame: round trip max "+rt.toExponential(1)+" m; K "+GEOREF.K.toFixed(3)+" units/km; rot "+GEOREF.ROT_DEG.toFixed(2)+"°; "+GEOREF.M_PER_WORLD.toFixed(2)+" m per world unit; EXAG "+GEOREF.EXAG.toFixed(3));
console.log("key".padEnd(13)+"kind".padEnd(17)+"GT->WD".padEnd(14)+"GT->Nom".padEnd(14)+"drawn->GT".padEnd(11)+"drawn->WD".padEnd(14)+"drawn->Nom");
out.rows.forEach(r=>console.log(r.key.padEnd(13)+r.kind.padEnd(17)+f(r.gtToWikidata)+f(r.gtToNominatim)+(r.drawnToGt?(r.drawnToGt.m.toFixed(0)+" m").padEnd(11):"-".padEnd(11))+f(r.drawnToWikidata)+f(r.drawnToNominatim)+(r.modernMap?" modern map "+r.modernMap.join(","):"")));
console.log("fit of drawn villages to Wikidata: n "+out.fit.n+", K "+out.fit.K+" ("+out.fit.scaleVsGEOREF+" of GEOREF's), rot "+out.fit.ROT_DEG+"° ("+out.fit.rotVsGEOREF+"°), rms "+out.fit.rmsM+" m; worst "+JSON.stringify(out.fit.residualsM.sort((a,b)=>b.m-a.m).slice(0,4)));
console.log("GT vs Wikidata shift: "+out.gtShift.mMin+"-"+out.gtShift.mMax+" m; azimuths "+[...new Set(out.gtShift.az)].join(","));
