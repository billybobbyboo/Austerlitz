#!/usr/bin/env node
/* Stage 8, 8H location research: the landmarks' modern positions in the map's frame, computed from the raw responses alone (no network).
     node docs/stage8-evidence/8h/geo/compute-places.js            writes places.json beside this file
   Inputs: raw/ (fetch-places.js, with raw/manifest.json naming every URL), the repository's geo.js (GEOREF, the only scale authority) and
   world.js (the drawn places, read from its declarations, their line numbers reported), and, when present, derived/period-pixels.json
   (period-trace.py: what was measured on the 1825 indication sketch, in its own pixels; georeferenced here).
   For each landmark: the area centroid of its polygon (a building: the RÚIAN building; an area: the OSM polygon), every other source's
   point and its distance from that centroid (the spread), the map coordinates by GEOREF.toMap, the offset from the map's current place
   (GEOREF.kmBetween, GEOREF.bearingDeg, true bearing of the move), checked against an ellipsoidal (Vincenty) distance and azimuth computed
   independently of the frame, and the 8G note's numbers (places.md Table A) beside them. Research tool; not part of the build. */
"use strict";
const fs=require("fs"), path=require("path"), zlib=require("zlib");
const DIR=__dirname, RAW=path.join(DIR,"raw"), ROOT=path.resolve(DIR,"../../../..");
const G=require(path.join(ROOT,"geo.js")), K=require("./krovak.js");
const D2R=Math.PI/180, WGS={a:6378137, f:1/298.257223563};
const r1=v=>Math.round(v*10)/10, r2=v=>Math.round(v*100)/100, r6=v=>Math.round(v*1e6)/1e6, r0=Math.round;
/* ---------------- reading the raw files ---------------- */
function raw(rel){ let b=fs.readFileSync(path.join(RAW,rel)); if(rel.endsWith(".gz")) b=zlib.gunzipSync(b); return b.toString("utf8"); }
const J=rel=>JSON.parse(raw(rel));
const MAN=J("manifest.json"), urlOf=rel=>{ const e=MAN.entries.find(x=>x.file===rel); return e?e.url:null; };
function osmParse(xml){ const o={nodes:{},ways:{},rels:{}};
  for(const m of xml.matchAll(/<node id="(\d+)"[^>]*?lat="([-\d.]+)" lon="([-\d.]+)"(\/>|>([\s\S]*?)<\/node>)/g)){ const tags={};
    if(m[5]) for(const t of m[5].matchAll(/<tag k="([^"]*)" v="([^"]*)"/g)) tags[t[1]]=t[2]; o.nodes[m[1]]={ll:[+m[2],+m[3]],tags}; }
  for(const m of xml.matchAll(/<way id="(\d+)"[^>]*>([\s\S]*?)<\/way>/g)){ const tags={}; for(const t of m[2].matchAll(/<tag k="([^"]*)" v="([^"]*)"/g)) tags[t[1]]=t[2];
    o.ways[m[1]]={nd:[...m[2].matchAll(/<nd ref="(\d+)"/g)].map(x=>x[1]),tags}; }
  for(const m of xml.matchAll(/<relation id="(\d+)"[^>]*>([\s\S]*?)<\/relation>/g)){ const tags={}; for(const t of m[2].matchAll(/<tag k="([^"]*)" v="([^"]*)"/g)) tags[t[1]]=t[2];
    o.rels[m[1]]={members:[...m[2].matchAll(/<member type="(\w+)" ref="(\d+)" role="([^"]*)"/g)].map(x=>({type:x[1],ref:x[2],role:x[3]})),tags}; }
  return o; }
function osmMerge(list){ const o={nodes:{},ways:{},rels:{}}; for(const p of list){ Object.assign(o.nodes,p.nodes); Object.assign(o.ways,p.ways); Object.assign(o.rels,p.rels); } return o; }
const wayLL=(o,w)=>o.ways[w].nd.map(n=>o.nodes[n].ll);
/* a multipolygon's rings: member ways joined end to end by role */
function osmRings(o,type,id){
  if(type==="way") return [{role:"outer",ll:wayLL(o,id)}];
  const R=o.rels[id], out=[];
  for(const role of ["outer","inner"]){ let segs=R.members.filter(m=>m.type==="way"&&m.role===role).map(m=>o.ways[m.ref].nd.slice());
    while(segs.length){ let ring=segs.shift();
      while(ring[0]!==ring[ring.length-1]){ const end=ring[ring.length-1]; const i=segs.findIndex(s=>s[0]===end||s[s.length-1]===end); if(i<0) break;
        let s=segs.splice(i,1)[0]; if(s[0]!==end) s=s.reverse(); ring=ring.concat(s.slice(1)); }
      out.push({role, ll:ring.map(n=>o.nodes[n].ll)}); } }
  return out; }
/* ---------------- geometry ---------------- */
function radii(lat){ const e2=WGS.f*(2-WGS.f), s=Math.sin(lat*D2R), w=1-e2*s*s; return {M:WGS.a*(1-e2)/Math.pow(w,1.5), N:WGS.a/Math.sqrt(w)}; }
function enuFn(lat0,lon0){ const R=radii(lat0), kx=R.N*Math.cos(lat0*D2R)*D2R, ky=R.M*D2R;
  return {to:(lat,lon)=>[(lon-lon0)*kx,(lat-lat0)*ky], from:(x,y)=>[lat0+y/ky, lon0+x/kx]}; }
/* area centroid of rings (outer positive, inner removed) in a local metric frame; lat/lon in, lat/lon out */
function areaCentroid(rings){ const all=rings.flatMap(r=>r.ll), lat0=all.reduce((s,p)=>s+p[0],0)/all.length, lon0=all.reduce((s,p)=>s+p[1],0)/all.length, E=enuFn(lat0,lon0);
  let A=0,cx=0,cy=0; for(const r of rings){ const P=r.ll.map(p=>E.to(p[0],p[1])); let a=0,x=0,y=0;
    for(let i=0;i<P.length-1;i++){ const c=P[i][0]*P[i+1][1]-P[i+1][0]*P[i][1]; a+=c; x+=(P[i][0]+P[i+1][0])*c; y+=(P[i][1]+P[i+1][1])*c; }
    const sg=(r.role==="inner"?-1:1)*Math.sign(a||1); A+=sg*a/2; cx+=sg*x/6; cy+=sg*y/6; }
  const ll=E.from(cx/A,cy/A); return {lat:ll[0],lon:ll[1],area:A}; }
function bbox(pts){ return [Math.min(...pts.map(p=>p[0])),Math.min(...pts.map(p=>p[1])),Math.max(...pts.map(p=>p[0])),Math.max(...pts.map(p=>p[1]))]; }
/* Vincenty's inverse on WGS 84: metres and initial azimuth (degrees) - independent of the map's frame */
function vincenty(la1,lo1,la2,lo2){ const a=WGS.a,f=WGS.f,b=a*(1-f), L=(lo2-lo1)*D2R, U1=Math.atan((1-f)*Math.tan(la1*D2R)), U2=Math.atan((1-f)*Math.tan(la2*D2R));
  const sU1=Math.sin(U1),cU1=Math.cos(U1),sU2=Math.sin(U2),cU2=Math.cos(U2); let l=L,lp,it=0,sS,cS,sig,sA,c2A,c2Sm;
  do{ const sl=Math.sin(l),cl=Math.cos(l); sS=Math.sqrt((cU2*sl)**2+(cU1*sU2-sU1*cU2*cl)**2); if(sS===0) return {s:0,az:0};
    cS=sU1*sU2+cU1*cU2*cl; sig=Math.atan2(sS,cS); sA=cU1*cU2*sl/sS; c2A=1-sA*sA; c2Sm=c2A?cS-2*sU1*sU2/c2A:0;
    const C=f/16*c2A*(4+f*(4-3*c2A)); lp=l; l=L+(1-C)*f*sA*(sig+C*sS*(c2Sm+C*cS*(-1+2*c2Sm*c2Sm))); }while(Math.abs(l-lp)>1e-12&&++it<200);
  const u2=c2A*(a*a-b*b)/(b*b), A=1+u2/16384*(4096+u2*(-768+u2*(320-175*u2))), B=u2/1024*(256+u2*(-128+u2*(74-47*u2)));
  const dS=B*sS*(c2Sm+B/4*(cS*(-1+2*c2Sm*c2Sm)-B/6*c2Sm*(-3+4*sS*sS)*(-3+4*c2Sm*c2Sm)));
  const az=Math.atan2(cU2*Math.sin(l),cU1*sU2-sU1*cU2*Math.cos(l))/D2R; return {s:b*A*(sig-dS), az:(az+360)%360}; }
const mapOf=(lat,lon)=>G.toMap(lat,lon);
const offset=(from,to)=>({m:G.kmBetween(from,to)*1000, brg:G.bearingDeg(from,to)});
const angDiff=(a,b)=>Math.abs(((a-b)%360+540)%360-180);
/* distance from a point to a polyline (map units) and the nearest point */
function toPolyline(p,L){ let best={d:Infinity}; for(let i=0;i<L.length-1;i++){ const a=L[i],b=L[i+1],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy))),q=[a[0]+t*dx,a[1]+t*dy],d=Math.hypot(p[0]-q[0],p[1]-q[1]); if(d<best.d) best={d,q,i}; } return best; }
/* where a polyline crosses the line x=c (or y=c): the other coordinate of every crossing */
function crossings(L,axis,c){ const o=1-axis, out=[]; for(let i=0;i<L.length-1;i++){ const a=L[i],b=L[i+1]; if((a[axis]-c)*(b[axis]-c)<=0&&a[axis]!==b[axis]) out.push(a[o]+(c-a[axis])/(b[axis]-a[axis])*(b[o]-a[o])); } return out; }
function pointInPoly(p,P){ let c=false; for(let i=0,j=P.length-1;i<P.length;j=i++){ const a=P[i],b=P[j]; if(((a[1]>p[1])!==(b[1]>p[1]))&&(p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])) c=!c; } return c; }
/* ---------------- the map's drawn places, read from world.js and geo.js ---------------- */
const WORLD=fs.readFileSync(path.join(ROOT,"world.js"),"utf8").split("\n"), GEOJS=fs.readFileSync(path.join(ROOT,"geo.js"),"utf8").split("\n");
function findLine(lines,re){ const i=lines.findIndex(l=>re.test(l)); return i<0?null:i+1; }
function arrLit(lines,re){ const i=lines.findIndex(l=>re.test(l)); let s=lines.slice(i).join("\n"); s=s.slice(s.indexOf("=")+1); let d=0,e=0;
  for(;e<s.length;e++){ if(s[e]==="[") d++; else if(s[e]==="]"){ d--; if(!d){ e++; break; } } } return {line:i+1, value:Function('"use strict";return ('+s.slice(0,e).replace(/\/\*[\s\S]*?\*\//g,"")+")")()}; }
const GOLD=arrLit(WORLD,/^var GOLDBACH_M=/), ROADS=arrLit(WORLD,/^var ROADS=\[/), WOODS=arrLit(WORLD,/^var WOODS=\[/), VILL=arrLit(WORLD,/^var VILLAGES=\[/);
const HWY=ROADS.value.find(r=>r.cls==="highway"), HWY_LINE=findLine(WORLD,/n:"Brunn-Olmutz highway"/)+1;
const CASTLE_LINE=findLine(WORLD,/var B=BLD8G\.castle.*c=W\(226,355\)/), WOOD0_LINE=findLine(WORLD,/Sokolnitz pheasantry: legacy offset/), WOOD1_LINE=findLine(WORLD,/Austerlitz park: legacy offset/);
const vpt=name=>{ const v=VILL.value.find(q=>q[0]===name); return [v[1],v[2]]; };
const vref=name=>`world.js VILLAGES "${name}" (line ${VILL.line+WORLD.slice(VILL.line-1).findIndex(l=>l.includes('["'+name+'",'))})`;
const gtLine=id=>findLine(GEOJS,new RegExp("^\\s*"+id+":\\s"));
const GT=G.GT, gtref=id=>`geo.js GEOREF.GT.${id} (line ${gtLine(id)}: ${GT[id].lat}, ${GT[id].lon})`;
const NOW={
  castle:{p:[226,355], what:"the drawn castle's legacy place", from:`world.js castlePlan8g, c=W(226,355) (line ${CASTLE_LINE}); 8G moves the quadrangle the least step (at most 4 world units, v8Settle) off the drawn brook there, not computed here`},
  wood0:{p:WOODS.value[0].c, what:"the drawn 'Sokolnitz pheasantry' ellipse's centre", from:`world.js WOODS[0] (line ${WOOD0_LINE}): c [${WOODS.value[0].c}], rx ${WOODS.value[0].rx}, ry ${WOODS.value[0].ry} (map units), rot ${WOODS.value[0].rot}`},
  wood1:{p:WOODS.value[1].c, what:"the drawn 'Austerlitz park' ellipse's centre", from:`world.js WOODS[1] (line ${WOOD1_LINE}): c [${WOODS.value[1].c}], rx ${WOODS.value[1].rx}, ry ${WOODS.value[1].ry}`},
  posthouse:{p:GT.posthouse.map, what:"GEOREF.GT.posthouse", from:gtref("posthouse")+`; drawn at VILLAGES "Posoritz post house" [${vpt("Posoritz post house")}] and the highway's vertex [324,36] (world.js line ${HWY_LINE})`},
  chapel:{p:GT.chapel.map, what:"GEOREF.GT.chapel", from:gtref("chapel")},
  santon:{p:GT.santon.map, what:"GEOREF.GT.santon (no chapel drawn)", from:gtref("santon")}
};
const village=(name,what)=>({p:vpt(name), what:what||`the village point of ${name}`, from:vref(name)});
/* ---------------- the sources ---------------- */
const RU4326=J("ruian/buildings_4326.json"), RU5514=J("ruian/buildings_5514.json"), RUADDR=J("ruian/addresses_kovalovice_4326.json");
const ruBldg=kod=>RU4326.features.find(f=>f.attributes.kod===kod);
const TERRS=J("ruian/territories_4326.json.gz").features, TERR=name=>{ const f=TERRS.find(t=>t.attributes.nazev===name); return f.geometry.rings[0].map(p=>mapOf(p[1],p[0])); };
const NPU=[...J("npu/layer12_records_4326.json").features,...J("npu/layer5_records_4326.json").features,...J("npu/layer12_pozorice_4326.json").features];
const npuPt=kat=>{ const f=NPU.find(x=>x.attributes.KatCislo===kat&&x.geometry); return f?{lat:f.geometry.y,lon:f.geometry.x,name:f.attributes.nazev,url:f.attributes.urlExt,anotace:f.attributes.anotace}:null; };
function wdPts(q){ const d=J(`wikidata/${q}.json.gz`).entities, e=d[q]||Object.values(d)[0]; const c=(e.claims&&e.claims.P625)||[];
  return c.filter(x=>x.mainsnak&&x.mainsnak.datavalue).map(x=>({lat:x.mainsnak.datavalue.value.latitude, lon:x.mainsnak.datavalue.value.longitude, label:(e.labels.cs||e.labels.en||{}).value})); }
/* the cs.wikipedia list of the battlefield's monuments at revision 26159478 (as places.md): each row's name, place and {{Souřadnice}} */
const CSW=raw("cswiki/seznam_pamatek_slavkovskeho_bojiste_26159478.wikitext").split(/\n\|-/).map(r=>{ const naz=(r.match(/<!--název-->([^\n]*)/)||[])[1]||"", mis=(r.match(/<!--místo-->([^\n]*)/)||[])[1]||"",
  c=mis.match(/\{\{Souřadnice\|([\d.]+)\|([\d.]+)\}\}/); return {naz:naz.trim(), mis:mis.trim(), ll:c?[+c[1],+c[2]]:null}; }).filter(r=>r.ll);
/* the list's row for each landmark it has: [name pattern, place pattern, note] */
const CS_ROWS={sokolnice_castle:[/Sokolnice \(zámek\)/], sokolnice_granary:[/Zámecká sýpka/], sokolnice_pheasantry:[/^Bažantnice/,null,"the list's point is on the enclosure's east wall (the marked gun positions)"],
  prace_church:[/Povýšení svatého Kříže \(Prace\)/], telnice_church:[/Jana Křtitele \(Telnice\)/], st_anthony:[/Antonína Paduánského \(Újezd/],
  santon_chapel:[/Santon \(kopec\)/,null,"the list's row is the hill, as places.md used it"], posthouse:[/Stará Pošta \(Kovalovice\)\|Stará pošta\]\]/],
  blazovice_belfry:[/^Zvonice$/,/Blažovice/], holubice_gotthard:[/Gottharda \(Holubice\)/], krenovice_church:[/Vavřince \(Křenovice\)/], slavkov_chateau:[/Slavkov u Brna \(zámek\)/]};
const csRow=(naz,mis)=>CSW.find(r=>naz.test(r.naz)&&(!mis||mis.test(r.mis)));
const osmFull=el=>osmParse(raw(`osm/${el.replace("/","_")}_full.xml`));
function osmCentroid(el){ const [type,id]=el.split("/"), o=osmFull(el), rings=osmRings(o,type,id); const outer=rings.filter(r=>r.role==="outer");
  return {all:areaCentroid(rings), outer:areaCentroid(outer), rings, tags:type==="way"?o.ways[id].tags:o.rels[id].tags}; }
function ruCentroid(kod){ const f=ruBldg(kod); if(!f) return null; const rings=f.geometry.rings.map(r=>({role:"outer",ll:r.map(p=>[p[1],p[0]])}));
  /* ArcGIS rings: outer clockwise, holes anticlockwise; areaCentroid's sign rule takes them as they wind */
  const c=areaCentroidSigned(rings); return Object.assign(c,{attrs:f.attributes}); }
function areaCentroidSigned(rings){ const all=rings.flatMap(r=>r.ll), lat0=all.reduce((s,p)=>s+p[0],0)/all.length, lon0=all.reduce((s,p)=>s+p[1],0)/all.length, E=enuFn(lat0,lon0);
  let A=0,cx=0,cy=0; for(const r of rings){ const P=r.ll.map(p=>E.to(p[0],p[1])); for(let i=0;i<P.length-1;i++){ const c=P[i][0]*P[i+1][1]-P[i+1][0]*P[i][1]; A+=c/2; cx+=(P[i][0]+P[i+1][0])*c/6; cy+=(P[i][1]+P[i+1][1])*c/6; } }
  const ll=E.from(cx/A,cy/A); return {lat:ll[0],lon:ll[1],area:Math.abs(A),rings:rings.length}; }
/* ---------------- the landmarks (places.md Table A, its numbers kept as t8g) ---------------- */
const L=[
 {n:1,id:"sokolnice_castle",name:"Sokolnice castle (zámek Sokolnice, Zámecká 57)",prim:{ru:13158571},osm:"relation/1387462",npu:"1000120787_0001",wd:["Q12055280"],now:NOW.castle,t8g:[49.119172,16.726281,212.90,344.29,535,327,24]},
 {n:2,id:"sokolnice_granary",name:"Sokolnice granary (barokní sýpka)",prim:{ru:46430121},osm:"way/120172453",npu:"1000153004",wd:["Q38134887"],now:Object.assign({},NOW.castle,{what:"the drawn castle's legacy place (the granary is not drawn)"}),t8g:[49.118074,16.724342,209.79,349.32,543,307,5]},
 {n:3,id:"sokolnice_pheasantry",name:"Sokolnice pheasantry (zámecká bažantnice / obora): the woodland's outline",prim:{osm:"relation/7163945"},npu:"1000120787_0004",npuX:["1000120787_0005"],wd:["Q26779145","Q121069128"],now:NOW.wood0,t8g:[49.126828,16.729562,212.05,316.34,2298,358,430]},
 {n:4,id:"sokolnice_chapel",name:"Sokolnice village chapel (OSM 'Kaple Panny Marie')",prim:{ru:46068201},osm:"way/532421085",wd:["Q55792212"],now:village("Sokolnitz","the village point of Sokolnitz (a church stood there until 8G; since 8G none is drawn)"),t8g:[49.114041,16.721233,207.20,364.99,25,288,2]},
 {n:5,id:"prace_church",name:"Prace, church of the Exaltation of the Holy Cross",prim:{ru:46052721},osm:"way/103037763",npu:"1000134522",wd:["Q12030519"],now:village("Pratzen","the village point of Pratzen (its church drawn near it, churchPlan8g)"),t8g:[49.137777,16.764355,277.03,255.59,399,193,8]},
 {n:6,id:"telnice_church",name:"Telnice, church of St John the Baptist",prim:{ru:50266829},osm:"way/120173761",npu:"1000148882_0001",wd:["Q12030791"],now:village("Telnitz"),t8g:[49.102114,16.718287,213.28,407.05,50,71,9]},
 {n:7,id:"ujezd_church",name:"Újezd u Brna, church of SS Peter and Paul",prim:{ru:39874931},osm:"way/51730107",npu:"1000130835",wd:["Q12030989"],now:village("Augezd"),t8g:[49.104498,16.756527,294.86,372.66,71,270,10]},
 {n:8,id:"st_anthony",name:"Újezd u Brna, chapel of St Anthony of Padua",prim:{ru:39874940},osm:"way/568443552",npu:"1000141624",wd:["Q38234573"],now:NOW.chapel,t8g:[49.108975,16.756850,290.86,357.42,107,205,82]},
 {n:9,id:"santon_chapel",name:"Santon, chapel of Our Lady of the Snows",prim:{ru:46085165},osm:"way/43491345",npu:"1000151014",wd:["Q38150137"],now:NOW.santon,t8g:[49.188388,16.763744,222.39,86.18,20,43,6]},
 {n:10,id:"posthouse",name:"Stará pošta, Kovalovice č.p. 109 (the Posoritz post house)",prim:{ru:23571594},addr:23956321,osm:"way/93725054",wd:["Q141367424","Q12056169"],now:NOW.posthouse,t8g:[49.185190,16.826263,363.24,53.77,1367,132,24]},
 {n:11,id:"kovalovice_108",name:"Kovalovice č.p. 108, the inn opposite (rejected)",prim:{addr:23956313},now:NOW.posthouse,t8g:[49.184772,16.827377,366.13,54.40,1459,131,null]},
 {n:12,id:"pozorice_post",name:"Pozořice, former post office (rejected)",prim:{npu:"138729_1"},now:NOW.posthouse,t8g:[49.208735,16.792271,263.70,-1.78,2243,320,null]},
 {n:13,id:"rousinov_post",name:"Rousínov (Rausnitz), Stará pošta (rejected)",prim:{npu:"1000121971"},wd:["Q31149564"],now:NOW.posthouse,t8g:[49.203874,16.882809,467.91,-47.95,5270,77,5]},
 {n:14,id:"kobylnice_belfry",name:"Kobylnice, belfry-chapel (no church)",prim:{ru:39854523},osm:"way/281397740",npu:"1000135245",wd:["Q37423595"],now:village("Kobelnitz"),t8g:[49.139731,16.731668,203.09,271.59,181,358,13]},
 {n:15,id:"slapanice_church",name:"Šlapanice, church of the Assumption",prim:{ru:39847462},osm:"way/94121875",npu:"1000140666_0001",wd:["Q12030376"],now:village("Schlapanitz"),t8g:[49.169658,16.726577,160.38,174.68,111,329,10]},
 {n:16,id:"slapanice_chateau",name:"Šlapanice, château",prim:{ru:23691972},osm:"way/94173426",wd:["Q10407617"],now:village("Schlapanitz"),t8g:[49.168803,16.724884,157.56,178.72,180,270,9]},
 {n:17,id:"jirikovice_belfry",name:"Jiříkovice, belfry on the green (no church)",prim:{ru:43615511},osm:"way/99501891",npu:"1000124062",now:village("Girzikowitz"),t8g:[49.167943,16.758111,231.53,158.68,115,354,1]},
 {n:18,id:"jirikovice_manor",name:"Jiříkovice, manor farm on the green",prim:{npu:"1000119615"},now:village("Girzikowitz"),t8g:[49.166950,16.758706,233.89,161.59,31,83,15]},
 {n:19,id:"blazovice_church",name:"Blažovice, church of the Sacred Heart (1930-1934)",prim:{ru:50432346},osm:"way/185482479",wd:["Q12030293"],now:village("Blasowitz"),t8g:[49.163131,16.784877,295.46,156.35,296,201,8]},
 {n:20,id:"blazovice_belfry",name:"Blažovice, belfry-chapel on the green (1831-1832)",prim:{ru:39854426},osm:"way/408678509",now:village("Blasowitz"),t8g:[49.166808,16.786738,295.68,142.73,135,13,1]},
 {n:21,id:"blazovice_zamecek",name:"Blažovice, former manor house ('zámeček', č.p. 36)",prim:{ru:23713933},wd:["Q122924573"],now:village("Blasowitz"),t8g:[49.165562,16.786079,295.54,147.36,18,249,1]},
 {n:22,id:"holubice_church",name:"Holubice, church of St Wenceslas (1929)",prim:{ru:49964330},osm:"way/114382832",wd:["Q13593819"],now:village("Holubitz"),t8g:[49.174291,16.812916,345.37,99.55,374,170,6]},
 {n:23,id:"holubice_gotthard",name:"Holubice, chapel of St Gotthard (1769)",prim:{ru:45872252},osm:"way/449323976",npu:"1000133864",wd:["Q37281331"],now:village("Holubitz"),t8g:[49.177748,16.812190,340.13,88.45,18,31,4]},
 {n:24,id:"krenovice_church",name:"Křenovice, church of St Lawrence",prim:{ru:45858501},osm:"way/97186802",npu:"1000144472_0001",wd:["Q27971669"],now:village("Krzenowitz"),t8g:[49.140967,16.828778,415.34,200.43,140,193,4]},
 {n:25,id:"tvarozna_church",name:"Tvarožná, church of St Nicholas (1880-81)",prim:{ru:46054103},osm:"way/125399653",npu:"1000138297",wd:["Q12030943"],now:village("Bosenitz"),t8g:[49.190328,16.775753,246.76,71.39,348,120,8]},
 {n:26,id:"slavkov_church",name:"Slavkov u Brna, Church of the Resurrection",prim:{ru:39712834},osm:"way/97103420",npu:"1000138600",wd:["Q12030543"],now:village("Austerlitz"),t8g:[49.155509,16.876505,504.97,118.69,240,2,10]},
 {n:27,id:"slavkov_chateau",name:"Slavkov u Brna, château",prim:{ru:13846744},osm:"way/27326750",npu:"1000152934_0001",wd:["Q1418278"],now:village("Austerlitz","the town point of Austerlitz (the château not drawn until 8G; since 8G drawn by its church)"),t8g:[49.154794,16.874864,502.12,122.23,195,325,31]},
 {n:28,id:"slavkov_garden",name:"Slavkov u Brna, château garden (Zámecká zahrada)",prim:{osm:"way/27326751"},npu:"1000152934_0003",wd:["Q123734676","Q28915627"],now:NOW.wood1,t8g:[49.154577,16.870750,493.30,125.79,1990,311,69]}
];
/* ---------------- each landmark ---------------- */
const out={tool:"docs/stage8-evidence/8h/geo/compute-places.js", computed:new Date().toISOString(), conventions:"map = GEOREF.toMap(lat,lon) (x right, y down, "+r2(G.K)+" map units per km, frame turned "+r2(G.ROT_DEG)+
 " degrees from true north); world = [(mx-340)*0.5, (my-250)*0.5]; offset = GEOREF.kmBetween(now, modern) in metres, bearing = GEOREF.bearingDeg(now, modern), the true bearing of the move; 'vincenty' is the same offset computed on the WGS 84 ellipsoid from GEOREF.toGeo(now), independent of the frame; spread = the largest ellipsoidal distance of any other source's point from the primary",
 repo:{geo:"geo.js", world:"world.js", lines:{GOLDBACH_M:GOLD.line, ROADS:ROADS.line, highway:HWY_LINE, WOODS:WOODS.line, VILLAGES:VILL.line, castle:CASTLE_LINE}}, landmarks:[], checks:{}};
for(const l of L){
  const srcs=[]; let prim=null;
  if(l.prim.ru){ const c=ruCentroid(l.prim.ru); prim={src:"RÚIAN building "+l.prim.ru+" (area centroid)", lat:c.lat, lon:c.lon, area_m2:r0(c.area), attrs:c.attrs, url:urlOf("ruian/buildings_4326.json")}; }
  else if(l.prim.osm){ const c=osmCentroid(l.prim.osm); prim={src:"OSM "+l.prim.osm+(c.rings.length>1?" (area centroid of the outer ring less its "+(c.rings.length-1)+" inner rings, as places.md)":" (area centroid)"), lat:c.all.lat, lon:c.all.lon, area_m2:r0(c.all.area), outline_area_m2:r0(c.outer.area), url:urlOf(`osm/${l.prim.osm.replace("/","_")}_full.xml`)};
    if(c.rings.length>1) srcs.push({src:"OSM "+l.prim.osm+" (area centroid of the outer ring alone)", lat:c.outer.lat, lon:c.outer.lon, note:"the outline's own centroid"}); }
  else if(l.prim.addr){ const f=RUADDR.features.find(x=>x.attributes.kod===l.prim.addr); prim={src:"RÚIAN address point "+l.prim.addr+" ("+f.attributes.adresa+")", lat:f.geometry.y, lon:f.geometry.x, url:urlOf("ruian/addresses_kovalovice_4326.json")}; }
  else if(l.prim.npu){ const p=npuPt(l.prim.npu); prim={src:"NPÚ record "+l.prim.npu+" ("+p.name+")", lat:p.lat, lon:p.lon, url:p.url}; }
  if(l.addr){ const f=RUADDR.features.find(x=>x.attributes.kod===l.addr); srcs.push({src:"RÚIAN address point "+l.addr+" ("+f.attributes.adresa+")", lat:f.geometry.y, lon:f.geometry.x}); }
  if(l.osm&&!(l.prim.osm)){ const c=osmCentroid(l.osm); srcs.push({src:"OSM "+l.osm+" (area centroid)", lat:c.all.lat, lon:c.all.lon}); }
  if(l.npu){ const p=npuPt(l.npu); if(p) srcs.push({src:"NPÚ "+l.npu+" ("+p.name+")", lat:p.lat, lon:p.lon, url:p.url}); }
  for(const k of (l.npuX||[])){ const p=npuPt(k); if(p) srcs.push({src:"NPÚ "+k+" ("+p.name+")", lat:p.lat, lon:p.lon, url:p.url, note:"a part of the enclosure, not its centre"}); }
  for(const q of (l.wd||[])) for(const p of wdPts(q)) srcs.push({src:"Wikidata "+q+" P625 ("+p.label+")", lat:p.lat, lon:p.lon});
  if(CS_ROWS[l.id]){ const c=CS_ROWS[l.id], r=csRow(c[0],c[1]); if(!r) throw new Error("cs.wikipedia row not found for "+l.id);
    srcs.push({src:"cs.wikipedia list rev. 26159478 ("+r.naz.replace(/\[\[Soubor:[^\]]*\]\]/g,"").replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g,"$1").replace(/<[^>]*>|'''|&nbsp;/g," ").replace(/Soubor:\S*/g,"").replace(/\s+/g," ").trim()+")", lat:r.ll[0], lon:r.ll[1], note:c[2]}); }
  for(const s of srcs){ s.from_primary_m=r1(vincenty(prim.lat,prim.lon,s.lat,s.lon).s); s.lat=r6(s.lat); s.lon=r6(s.lon); }
  const m=mapOf(prim.lat,prim.lon), off=offset(l.now.p,m), ng=G.toGeo(l.now.p[0],l.now.p[1]), v=vincenty(ng[0],ng[1],prim.lat,prim.lon);
  const t=l.t8g, rec={n:l.n, id:l.id, name:l.name, primary:Object.assign({},prim,{lat:r6(prim.lat),lon:r6(prim.lon)}), map:[r2(m[0]),r2(m[1])], world:[r2((m[0]-340)*0.5),r2((m[1]-250)*0.5)],
    now:l.now, offset_m:r0(off.m), bearing:r0(off.brg), vincenty:{m:r1(v.s), az:r1(v.az)}, spread_m:srcs.length?r0(Math.max(...srcs.map(s=>s.from_primary_m))):null, sources:srcs,
    places_md:{lat:t[0],lon:t[1],map:[t[2],t[3]],offset_m:t[4],bearing:t[5],spread_m:t[6]},
    vs_places_md:{position_m:r1(vincenty(t[0],t[1],prim.lat,prim.lon).s), offset_dm:r0(off.m)-t[4], bearing_d:r0(off.brg)-t[5]}};
  out.landmarks.push(rec);
}
const LM=id=>out.landmarks.find(x=>x.id===id), llOf=id=>[LM(id).primary.lat,LM(id).primary.lon], mOf=id=>LM(id).map;
/* ---------------- the checks ---------------- */
const C=out.checks;
/* (a) the frame: GEOREF's round trip, the drawn village points against GEOREF.GT, independent village centres, and the frame's distances
   and bearings against the ellipsoid's */
{ const rt=Object.keys(GT).map(k=>{ const g=G.toGeo(GT[k].map[0],GT[k].map[1]); return vincenty(GT[k].lat,GT[k].lon,g[0],g[1]).s; });
  const vg=VILL.value.map(v=>{ const id=Object.keys(GT).find(k=>GT[k].n===v[0]); if(!id) return null; return {village:v[0], drawn:[v[1],v[2]], gt:[r2(GT[id].map[0]),r2(GT[id].map[1])], d_units:r2(Math.hypot(v[1]-GT[id].map[0],v[2]-GT[id].map[1]))}; }).filter(Boolean);
  const ZB=J("zabaged/defpoints_castobce_4326.json").features, CZ={Telnice:"telnitz",Sokolnice:"sokolnitz",Kobylnice:"kobelnitz","Ponětovice":"puntowitz","Jiříkovice":"girzikowitz","Tvarožná":"bosenitz","Blažovice":"blasowitz",Holubice:"holubitz",Prace:"pratzen","Křenovice":"krzenowitz","Žatčany":"satschan","Měnín":"menitz","Hostěrádky-Rešov":"hostieradek",Kovalovice:"kowalowitz"};
  const indep=ZB.filter(f=>CZ[f.attributes.nazev]).map(f=>{ const id=CZ[f.attributes.nazev], m=mapOf(f.geometry.y,f.geometry.x), vp=VILL.value.find(v=>v[0]===GT[id].n), drawn=vp?[vp[1],vp[2]]:GT[id].map;
    return {village:f.attributes.nazev, zabaged_defpoint:[r6(f.geometry.y),r6(f.geometry.x)], map:[r2(m[0]),r2(m[1])], drawn:drawn.map(r2), from_drawn_m:r0(G.kmBetween(drawn,m)*1000), from_gt_m:r0(vincenty(GT[id].lat,GT[id].lon,f.geometry.y,f.geometry.x).s)}; });
  const ids=Object.keys(GT).filter(k=>GT[k].kind==="v"&&!GT[k].offmap), pairs=[];
  for(let i=0;i<ids.length;i++) for(let j=i+1;j<ids.length;j++){ const a=GT[ids[i]],b=GT[ids[j]], v=vincenty(a.lat,a.lon,b.lat,b.lon), km=G.kmBetween(a.map,b.map)*1000, br=G.bearingDeg(a.map,b.map);
    pairs.push({ratio:km/v.s, dAz:angDiff(br,v.az), s:v.s}); }
  const offs=out.landmarks.map(x=>({id:x.id, dm:Math.abs(x.offset_m-x.vincenty.m), dAz:x.offset_m>30?angDiff(x.bearing,x.vincenty.az):null}));
  C.frame={roundtrip_max_m:+Math.max(...rt).toExponential(2), villages_vs_gt:{max_units:Math.max(...vg.map(x=>x.d_units)), rows:vg},
    independent_centres:{source:"ZABAGED 'Definiční bod části obce' (layer 3), "+urlOf("zabaged/defpoints_castobce_4326.json"), rows:indep},
    gt_pairs:{n:pairs.length, scale_ratio_min:+Math.min(...pairs.map(p=>p.ratio)).toFixed(5), scale_ratio_max:+Math.max(...pairs.map(p=>p.ratio)).toFixed(5), bearing_diff_max_deg:r2(Math.max(...pairs.map(p=>p.dAz)))},
    offsets_vs_vincenty:{max_m:r1(Math.max(...offs.map(o=>o.dm))), max_bearing_deg:r2(Math.max(...offs.filter(o=>o.dAz!=null).map(o=>o.dAz)))}};
}
/* (b) krovak.js against the RÚIAN service's own EPSG:5514 output for the same buildings (it serves the CENIA tiles below) */
{ const rows=RU4326.features.map(f=>{ const g=RU5514.features.find(x=>x.attributes.kod===f.attributes.kod), p4=f.geometry.rings[0][0], p5=g.geometry.rings[0][0], k=K.toJTSK(p4[1],p4[0]);
    return Math.hypot(k[0]-p5[0],k[1]-p5[1]); });
  C.krovak={what:"first vertex of each of the 22 buildings: krovak.js toJTSK(the service's EPSG:4326) against the service's EPSG:5514", max_m:r2(Math.max(...rows)), mean_m:r2(rows.reduce((s,x)=>s+x,0)/rows.length)}; }
/* (c) Sokolnice: the castle, the pheasantry, the stream */
const O_SOK=osmParse(raw("osm/map_sokolnice.xml.gz"));
{ const cas=LM("sokolnice_castle"), gr=LM("sokolnice_granary"), ph=LM("sokolnice_pheasantry"), vp=vpt("Sokolnitz");
  const rel=osmCentroid("relation/7163945"), outer=rel.rings.filter(r=>r.role==="outer")[0].ll, outerM=outer.map(p=>mapOf(p[0],p[1])), bb=bbox(outerM);
  /* the outline's extent along true north and east (metres), from the frame's own inverse */
  const en=outer.map(p=>{ const q=K.toJTSK(p[0],p[1]); return q; });
  const E0=enuFn(rel.outer.lat,rel.outer.lon), enu=outer.map(p=>E0.to(p[0],p[1]));
  /* the drawn ellipse, sampled; overlap with the outline */
  const W0=WOODS.value[0], ell=[]; for(let i=0;i<=360;i+=2){ const a=i*D2R, x=W0.rx*Math.cos(a), y=W0.ry*Math.sin(a); ell.push([W0.c[0]+x*Math.cos(W0.rot)-y*Math.sin(W0.rot), W0.c[1]+x*Math.sin(W0.rot)+y*Math.cos(W0.rot)]); }
  let inBoth=0, inEll=0; for(let x=190;x<=270;x+=0.25) for(let y=280;y<=420;y+=0.25){ const e=pointInPoly([x,y],ell); if(e){ inEll++; if(pointInPoly([x,y],outerM)) inBoth++; } }
  const ppu=1000/G.K;   /* metres per map unit */
  C.sokolnice={
    castle_from_village:{m:r0(offset(vp,cas.map).m), brg:r0(offset(vp,cas.map).brg), places_md:"672 m at 31 degrees"},
    drawn_castle_from_village:{m:r0(offset(vp,NOW.castle.p).m), brg:r0(offset(vp,NOW.castle.p).brg), places_md:"651 m at 78 degrees"},
    granary_from_village:{m:r0(offset(vp,gr.map).m), brg:r0(offset(vp,gr.map).brg), places_md:"499 m at 24 degrees"},
    granary_from_castle:{m:r0(offset(cas.map,gr.map).m), brg:r0(offset(cas.map,gr.map).brg), places_md:"187 m south-west"},
    castle_footprint:{area_m2:cas.primary.area_m2, ruian:cas.primary.attrs},
    pheasantry:{outer_area_km2:+(rel.outer.area/1e6).toFixed(3), net_woodland_km2:+(rel.all.area/1e6).toFixed(3), inner_rings:rel.rings.filter(r=>r.role==="inner").length, tags:rel.tags,
      extent_true_m:{north_south:r0(Math.max(...enu.map(p=>p[1]))-Math.min(...enu.map(p=>p[1]))), east_west:r0(Math.max(...enu.map(p=>p[0]))-Math.min(...enu.map(p=>p[0])))},
      map_bbox:bb.map(r1), drawn_ellipse_bbox:bbox(ell).map(r1), drawn_ellipse_km2:+(Math.PI*W0.rx*W0.ry*ppu*ppu/1e6).toFixed(2),
      overlap_with_drawn_ellipse_share:+(inBoth/inEll).toFixed(4),
      by_territory:(()=>{ const ts={Sokolnice:TERR("Sokolnice"), "Kobylnice u Brna":TERR("Kobylnice u Brna")}, cnt={Sokolnice:0,"Kobylnice u Brna":0,other:0}; let n=0;
        for(let x=bb[0];x<=bb[2];x+=0.2) for(let y=bb[1];y<=bb[3];y+=0.2){ if(!pointInPoly([x,y],outerM)) continue; n++; const t=Object.keys(ts).find(k=>pointInPoly([x,y],ts[k])); cnt[t||"other"]++; }
        return Object.fromEntries(Object.entries(cnt).map(([k,v])=>[k,+(v/n).toFixed(3)])); })(),
      centroid_net_woodland:{lat:r6(rel.all.lat),lon:r6(rel.all.lon), offset_from_drawn:(()=>{ const o=offset(NOW.wood0.p,mapOf(rel.all.lat,rel.all.lon)); return {m:r0(o.m),brg:r0(o.brg)}; })()},
      from_real_castle:{m:r0(offset(cas.map,ph.map).m), brg:r0(offset(cas.map,ph.map).brg), places_md:"884 m at 16 degrees"},
      drawn_from_drawn_castle:{m:r0(offset(NOW.castle.p,NOW.wood0.p).m), brg:r0(offset(NOW.castle.p,NOW.wood0.p).brg), places_md:"999 m at 179 degrees"},
      outline_map:outerM.map(p=>[r2(p[0]),r2(p[1])]), drawn_ellipse_map:ell.map(p=>[r2(p[0]),r2(p[1])])}};
  /* the stream: the OSM waterways named Říčka / Zlatý potok in the Sokolnice download, and ZABAGED's watercourse */
  const osmStreams=Object.entries(O_SOK.ways).filter(([id,w])=>w.tags.waterway&&/Říčka|Zlat/.test(w.tags.name||"")).map(([id,w])=>({id,tags:w.tags,m:w.nd.map(n=>O_SOK.nodes[n].ll).map(p=>mapOf(p[0],p[1]))}));
  const zb=J("zabaged/watercourses_sokolnice_4326.json").features.filter(f=>/Říčka/.test(f.attributes.jmeno||"")).map(f=>({id:f.attributes.OBJECTID, m:f.geometry.paths.flat().map(p=>mapOf(p[1],p[0]))}));
  const rows=[]; for(let y=330;y<=375;y+=5){ const xs=osmStreams.flatMap(s=>crossings(s.m,1,y)), xz=zb.flatMap(s=>crossings(s.m,1,y)), xd=crossings(GOLD.value,1,y);
    rows.push({map_y:y, osm_x:xs.map(r1).sort((a,b)=>a-b), zabaged_x:xz.map(r1).sort((a,b)=>a-b), drawn_x:xd.map(r1), gap_m_osm:xs.length&&xd.length?r0((Math.min(...xs)-xd[0])*ppu)+"-"+r0((Math.max(...xs)-xd[0])*ppu):null}); }
  const allStream=osmStreams.map(s=>s.m), near=p=>{ let b={d:Infinity}; for(const s of allStream){ const q=toPolyline(p,s); if(q.d<b.d) b=q; } return b; };
  const side=(p)=>{ const q=near(p); return q.d===Infinity?null:{m:r0(q.d*ppu), side:p[0]<q.q[0]?"west":"east"}; };
  const goldNear=p=>{ const q=toPolyline(p,GOLD.value); return {m:r0(q.d*ppu), side:p[0]<q.q[0]?"west":"east"}; };
  C.goldbach={drawn:{from:`world.js GOLDBACH_M (line ${GOLD.line})`, value:GOLD.value}, osm_ways:osmStreams.map(s=>({id:s.id, name:s.tags.name, waterway:s.tags.waterway})), zabaged_parts:zb.length,
    rows, note:"the x of every crossing of the map row y (several where the stream has more than one channel); gap = real minus drawn, along map x, in metres",
    real_stream_from:{castle:side(cas.map), granary:side(gr.map), village_point:side(vp), drawn_castle:side(NOW.castle.p)},
    drawn_goldbach_from:{castle_true_place:goldNear(cas.map), village_point:goldNear(vp), drawn_castle:goldNear(NOW.castle.p)},
    places_md:"real x 215-221 at y 340-365 against the drawn 204-205; castle 145 m and village point 206 m west of the real stream; the castle at its true place 255 m east of the drawn Goldbach"};
  out._streams={osm:osmStreams.map(s=>s.m.map(p=>[r2(p[0]),r2(p[1])])), zabaged:zb.map(s=>s.m.map(p=>[r2(p[0]),r2(p[1])]))};
}
/* (d) the highway: II/430 assembled from the walked ways (OSM) and ZABAGED's road 430, against the drawn line */
{ const files=fs.readdirSync(path.join(RAW,"osm/walk430")).filter(f=>f.startsWith("way_")), O=osmMerge(files.map(f=>osmParse(raw("osm/walk430/"+f))));
  const segs=Object.entries(O.ways).filter(([id,w])=>w.tags.highway).map(([id,w])=>({id,ref:w.tags.ref||null,m:w.nd.map(n=>O.nodes[n].ll).map(p=>mapOf(p[0],p[1]))}));
  const zb=J("zabaged/road430_4326.json").features.map(f=>f.geometry.paths.flat().map(p=>mapOf(p[1],p[0])));
  const ppu=1000/G.K, H=HWY.p, rows=[];
  for(const x of [146,175,202,222,240,260,280,300,324,340,363]){
    const ys=segs.flatMap(s=>crossings(s.m,0,x)), yz=zb.flatMap(s=>crossings(s,0,x)), yd=crossings(H,0,x);
    if(!ys.length) continue; const y=ys.reduce((s,v)=>s+v,0)/ys.length, perp=toPolyline([x,y],H).d*ppu;
    rows.push({map_x:x, real_y:r1(y), real_y_range:[r1(Math.min(...ys)),r1(Math.max(...ys))], zabaged_y:yz.length?r1(yz.reduce((s,v)=>s+v,0)/yz.length):null, drawn_y:r1(yd[0]),
      gap_along_y_m:r0((y-yd[0])*ppu), perpendicular_m:r0(perp)}); }
  const ph=LM("posthouse").map;
  C.highway={drawn:{from:`world.js ROADS[0] "Brunn-Olmutz highway" (line ${HWY_LINE})`, p:H}, osm_ways:segs.length, osm_ref430_ways:segs.filter(s=>s.ref==="430").length,
    rows, posthouse_to_drawn_highway_m:r0(toPolyline(ph,H).d*ppu), posthouse_to_real_road_m:r0(Math.min(...segs.map(s=>toPolyline(ph,s.m).d))*ppu),
    santon_chapel_side:(()=>{ const s=mOf("santon_chapel"), ys=segs.flatMap(q=>crossings(q.m,0,s[0])); return ys.length?(s[1]<Math.min(...ys)?"north of the road":"south of the road"):null; })(),
    places_md:"real y 104.4, 94.2, 75.7, 69.6, 54.7 at x 222, 240, 300, 324, 363; drawn 98.1, 79.5, 48.4, 36.0, 15.7; 465 m at x 240, 1,062 m at x 324, 1,232 m at x 363; west of the Santon 120-260 m; the post house 1,070 m off the drawn highway"};
  out._road={osm:segs.map(s=>s.m.map(p=>[r2(p[0]),r2(p[1])])), zabaged:zb.map(s=>s.map(p=>[r2(p[0]),r2(p[1])]))};
}
/* (e) Slavkov: the château from its church, the garden from the town point and from the drawn park */
{ const ch=LM("slavkov_church").map, ca=LM("slavkov_chateau").map, ga=LM("slavkov_garden"), tp=vpt("Austerlitz"), og=osmCentroid("way/27326751"), E=enuFn(og.outer.lat,og.outer.lon), P=og.rings[0].ll.map(p=>E.to(p[0],p[1]));
  /* the garden's long axis and length (principal axis of its outline's vertices) */
  const mx=P.reduce((s,p)=>s+p[0],0)/P.length, my=P.reduce((s,p)=>s+p[1],0)/P.length; let sxx=0,syy=0,sxy=0; P.forEach(p=>{ sxx+=(p[0]-mx)**2; syy+=(p[1]-my)**2; sxy+=(p[0]-mx)*(p[1]-my); });
  const th=0.5*Math.atan2(2*sxy,sxx-syy), u=[Math.cos(th),Math.sin(th)], pr=P.map(p=>p[0]*u[0]+p[1]*u[1]), pq=P.map(p=>-p[0]*u[1]+p[1]*u[0]);
  C.slavkov={chateau_from_church:{m:r0(offset(ch,ca).m), brg:r0(offset(ch,ca).brg), places_md:"143 m at 236 degrees"},
    garden_from_town_point:{m:r0(offset(tp,ga.map).m), brg:r0(offset(tp,ga.map).brg), places_md:"433 m at 288 degrees"},
    drawn_park_from_town_point:{m:r0(offset(tp,NOW.wood1.p).m), brg:r0(offset(tp,NOW.wood1.p).brg), places_md:"1,599 m at 137 degrees"},
    garden_from_chateau:{m:r0(offset(ca,ga.map).m), brg:r0(offset(ca,ga.map).brg)},
    garden:{area_ha:+(og.outer.area/1e4).toFixed(1), axis_true_deg:r0((90-th/D2R+360)%180), length_m:r0(Math.max(...pr)-Math.min(...pr)), width_m:r0(Math.max(...pq)-Math.min(...pq)), tags:og.tags, outline_map:og.rings[0].ll.map(p=>mapOf(p[0],p[1])).map(p=>[r2(p[0]),r2(p[1])]), places_md:"16.9 ha, about 800 x 220 m on an east-west axis"},
    drawn_park:{from:NOW.wood1.from, km2:+(Math.PI*WOODS.value[1].rx*WOODS.value[1].ry*(1000/G.K)**2/1e6).toFixed(2)}};
}
/* (f) the period maps: the 1825 indication sketch of Sokolnitz, georeferenced from what period-trace.py measured in its pixels */
const PP=path.join(DIR,"derived","period-pixels.json");
if(fs.existsSync(PP)){ const pp=JSON.parse(fs.readFileSync(PP,"utf8")); C.period1825=georef1825(pp); }
function georef1825(pp){
  /* the sketch's level-2 mosaic pixels (x right, y down) to a local true-north metric frame (east, north in metres about the castle's
     court) by a similarity. Fit A: fixed by the two control points (the castle's court and the granary, about 185 m apart). Fit B, a check
     on A: the scale and the turn 8G's reader fitted on piece A04E by matching the modern parcel lines to the sketch's (2.7215 px/m at
     level 4, the sheet within -0.25 degrees of true north; readings-cadastre.md 0.2), placed by the court alone. The pieces are taken to
     abut exactly (each a quarter sheet, 500 x 400 Klafter). */
  const c0=pp.control[0], E0=enuFn(c0.lat,c0.lon);
  const cps=pp.control.map(c=>{ const q=E0.to(c.lat,c.lon); return {name:c.name, px:c.px, E:q[0], N:q[1]}; });
  function fitLS(cs){ const n=cs.length, mx=cs.reduce((s,c)=>s+c.px[0],0)/n, my=cs.reduce((s,c)=>s+c.px[1],0)/n, mE=cs.reduce((s,c)=>s+c.E,0)/n, mN=cs.reduce((s,c)=>s+c.N,0)/n;
    /* E = mE + a*(x-mx) + b*(y-my);  N = mN + b*(x-mx) - a*(y-my)   (y down) */
    let sab=0,sbb=0,s2=0; for(const c of cs){ const dx=c.px[0]-mx, dy=c.px[1]-my, dE=c.E-mE, dN=c.N-mN; sab+=dx*dE-dy*dN; sbb+=dy*dE+dx*dN; s2+=dx*dx+dy*dy; }
    return {mx,my,mE,mN,a:sab/s2,b:sbb/s2}; }
  /* the sheet's up direction at azimuth t (degrees clockwise from true north): a = s cos t, b = -s sin t */
  function fitFixed(cs,pxPerM,t){ const n=cs.length, s=1/pxPerM; return {mx:cs.reduce((q,c)=>q+c.px[0],0)/n,my:cs.reduce((q,c)=>q+c.px[1],0)/n,mE:cs.reduce((q,c)=>q+c.E,0)/n,mN:cs.reduce((q,c)=>q+c.N,0)/n,a:s*Math.cos(t*D2R),b:-s*Math.sin(t*D2R)}; }
  const mk=F=>{ const toEN=p=>[F.mE+F.a*(p[0]-F.mx)+F.b*(p[1]-F.my), F.mN+F.b*(p[0]-F.mx)-F.a*(p[1]-F.my)];
    return {F, toEN, toLL:p=>{ const q=toEN(p); return E0.from(q[0],q[1]); }, toM:p=>{ const q=toEN(p), g=E0.from(q[0],q[1]); return mapOf(g[0],g[1]); },
      scale:1/Math.hypot(F.a,F.b), rot:Math.atan2(-F.b,F.a)/D2R}; };
  /* Fit C, used for the features: 8G's scale and turn, placed by both control points (their mean) */
  const A=mk(fitLS(cps)), B=mk(fitFixed([cps[0]],2.7215/4,0)), Cf=mk(fitFixed(cps,2.7215/4,0));
  const res={what:pp.what, source:pp.source, frame:pp.frame, control:cps.map(c=>({name:c.name, px:c.px, E:r2(c.E), N:r2(c.N)})),
    fitA:{what:"similarity fixed by the two control points", px_per_m:+A.scale.toFixed(4), sheet_up_azimuth_deg:r2(A.rot),
      nominal:"0.6866 px/m at level 2 if a piece's 651 px span exactly 500 Klafter (1 Kl = 1.8965 m); 8G's fit on A04E 0.6804 px/m, -0.25 degrees"},
    fitB:{what:"8G's scale for A04E (readings-cadastre.md 0.2) with the sheet's up at true north (8G: within 0.25 degrees), placed by the court", px_per_m:+B.scale.toFixed(4), sheet_up_azimuth_deg:r2(B.rot)},
    fitC:{what:"used for the features: 8G's scale and turn, placed by the mean of both control points", px_per_m:+Cf.scale.toFixed(4), sheet_up_azimuth_deg:r2(Cf.rot)},
    residuals:cps.map(c=>{ const qa=A.toEN(c.px), qb=B.toEN(c.px), qc=Cf.toEN(c.px); return {name:c.name, fitA_m:r2(Math.hypot(qa[0]-c.E,qa[1]-c.N)), fitB_m:r2(Math.hypot(qb[0]-c.E,qb[1]-c.N)), fitC_m:r2(Math.hypot(qc[0]-c.E,qc[1]-c.N)), fitC_dE:r1(qc[0]-c.E), fitC_dN:r1(qc[1]-c.N)}; }),
    checks:[], features:{}};
  for(const ck of (pp.checkpoints||[])){ const ga=A.toLL(ck.px), gb=B.toLL(ck.px), gc=Cf.toLL(ck.px); res.checks.push({name:ck.name, fitA_m:r1(vincenty(ga[0],ga[1],ck.lat,ck.lon).s), fitB_m:r1(vincenty(gb[0],gb[1],ck.lat,ck.lon).s), fitC_m:r1(vincenty(gc[0],gc[1],ck.lat,ck.lon).s)}); }
  const ppu=1000/G.K, streams=(out._streams.osm||[]), modOuter=C.sokolnice.pheasantry.outline_map, cas=LM("sokolnice_castle").map;
  for(const [k,f] of Object.entries(pp.features||{})){
    if(f.type==="polygon"){ const one=T=>{ const ll=f.px.map(T.toLL), m=f.px.map(T.toM), c=areaCentroid([{role:"outer",ll:ll.concat([ll[0]])}]), cm=mapOf(c.lat,c.lon); return {ll,m,c,cm}; };
      const a=one(Cf), b=one(A), Ec=enuFn(a.c.lat,a.c.lon), P=a.ll.map(p=>Ec.to(p[0],p[1]));
      /* overlap with today's outline (OSM relation 7163945's outer ring), by sampling the map plane every 0.25 units */
      let n1=0,n2=0,nb=0; const bb=bbox(a.m.concat(modOuter)); for(let x=bb[0];x<=bb[2];x+=0.25) for(let y=bb[1];y<=bb[3];y+=0.25){ const i1=pointInPoly([x,y],a.m), i2=pointInPoly([x,y],modOuter); if(i1) n1++; if(i2) n2++; if(i1&&i2) nb++; }
      const o=offset(NOW.wood0.p,a.cm), oc=offset(LM("sokolnice_pheasantry").map,a.cm), oca=offset(cas,a.cm);
      res.features[k]={type:"polygon", what:f.what, area_km2:+(a.c.area/1e6).toFixed(3), centroid:[r6(a.c.lat),r6(a.c.lon)], map:[r2(a.cm[0]),r2(a.cm[1])],
        fitA_centroid_shift_m:r1(vincenty(a.c.lat,a.c.lon,b.c.lat,b.c.lon).s), fitA_area_km2:+(b.c.area/1e6).toFixed(3), fitA_map:[r2(b.cm[0]),r2(b.cm[1])],
        from_drawn_wood:{m:r0(o.m),brg:r0(o.brg)}, from_modern_woodland_centroid:{m:r0(oc.m),brg:r0(oc.brg)}, from_castle:{m:r0(oca.m),brg:r0(oca.brg)},
        extent_true_m:{north_south:r0(Math.max(...P.map(p=>p[1]))-Math.min(...P.map(p=>p[1]))), east_west:r0(Math.max(...P.map(p=>p[0]))-Math.min(...P.map(p=>p[0])))},
        north_edge_lat:r6(Math.max(...a.ll.map(p=>p[0]))), south_edge_lat:r6(Math.min(...a.ll.map(p=>p[0]))),
        overlap:{share_of_1825_inside_todays_outline:+(nb/n1).toFixed(3), share_of_todays_outline_inside_1825:+(nb/n2).toFixed(3), share_of_1825_inside_drawn_ellipse:+(()=>{ const e=C.sokolnice.pheasantry.drawn_ellipse_map; let q=0; for(let x=bb[0];x<=bb[2];x+=0.25) for(let y=bb[1];y<=bb[3];y+=0.25) if(pointInPoly([x,y],a.m)&&pointInPoly([x,y],e)) q++; return q/n1; })().toFixed(3)},
        outline_map:a.m.map(p=>[r2(p[0]),r2(p[1])])}; }
    else if(f.type==="line"){ const m=f.px.map(Cf.toM), mb=f.px.map(A.toM);
      const dOsm=m.map(p=>Math.min(...streams.map(s=>toPolyline(p,s).d))*ppu), dGold=m.map(p=>toPolyline(p,GOLD.value).d*ppu);
      const sideGold=m.map(p=>{ const q=toPolyline(p,GOLD.value); return p[0]>q.q[0]?"east":"west"; }), q=toPolyline(cas,m);
      res.features[k]={type:"line", what:f.what, north_px:f.north_px, south_px:f.south_px, runs:f.runs, n:m.length, map_y_range:[r1(Math.min(...m.map(p=>p[1]))),r1(Math.max(...m.map(p=>p[1])))],
        to_modern_stream_m:{median:r0(dOsm.slice().sort((x,y)=>x-y)[dOsm.length>>1]), max:r0(Math.max(...dOsm)), min:r0(Math.min(...dOsm))},
        to_drawn_goldbach_m:{median:r0(dGold.slice().sort((x,y)=>x-y)[dGold.length>>1]), min:r0(Math.min(...dGold)), max:r0(Math.max(...dGold)), side:[...new Set(sideGold)].join("/")},
        fitA_shift_max_m:r1(Math.max(...m.map((p,i)=>Math.hypot(p[0]-mb[i][0],p[1]-mb[i][1])*ppu))),
        castle_from_line:{m:r0(q.d*ppu), castle_side:cas[0]<q.q[0]?"west":"east"}, line_map:m.map(p=>[r2(p[0]),r2(p[1])])}; }
    else if(f.type==="boundary"){ const m=f.px.map(Cf.toM), ma=f.px.map(A.toM), ring=TERR("Sokolnice");
      const d=m.map(p=>toPolyline(p,ring).d*ppu).sort((x,y)=>x-y), da=ma.map(p=>toPolyline(p,ring).d*ppu).sort((x,y)=>x-y);
      res.features[k]={type:"boundary", what:f.what, n:m.length, to_modern_territory_boundary_m:{median:r0(d[d.length>>1]), p90:r0(d[Math.floor(d.length*0.9)]), max:r0(d[d.length-1])},
        fitA_to_modern_boundary_m:{median:r0(da[da.length>>1]), max:r0(da[da.length-1])},
        modern:"RÚIAN cadastral territory Sokolnice (kód 752193), its outline as served ("+urlOf("ruian/territories_4326.json.gz")+")", line_map:m.map(p=>[r2(p[0]),r2(p[1])])}; }
    else if(f.type==="point"){ const g=Cf.toLL(f.px), mm=mapOf(g[0],g[1]); res.features[k]={type:"point", what:f.what, lat:r6(g[0]), lon:r6(g[1]), map:[r2(mm[0]),r2(mm[1])]}; } }
  /* the Kobelnitz sketch's boundary band, in the Sokolnitz frame by the shared sheet (period-trace.py), against today's boundary */
  if(pp.kobelnitz1825){ const kb=pp.kobelnitz1825, off=kb.offset_to_sokolnitz_frame, ring=TERR("Sokolnice");
    const m=kb.band_px.map(p=>Cf.toM([p[0]+off[0],p[1]+off[1]])), d=m.map(p=>toPolyline(p,ring).d*ppu).sort((x,y)=>x-y);
    res.kobelnitz1825={what:kb.what, viewer:kb.viewer, frame:kb.frame, n:d.length, band_to_modern_boundary_m:{median:r0(d[d.length>>1]), p75:r0(d[Math.floor(d.length*0.75)]), p90:r0(d[Math.floor(d.length*0.9)])}}; }
  /* the inverse of fit C (local metric to the Sokolnitz mosaic's pixels), for the figures: today's woodland, boundary, streams and the drawn
     features on the 1825 sheets */
  { const F=Cf.F, k2=F.a*F.a+F.b*F.b, toPx=(lat,lon)=>{ const q=E0.to(lat,lon), dE=q[0]-F.mE, dN=q[1]-F.mN; return [r1(F.mx+(F.a*dE+F.b*dN)/k2), r1(F.my+(F.b*dE-F.a*dN)/k2)]; };
    const fromMap=p=>{ const g=G.toGeo(p[0],p[1]); return toPx(g[0],g[1]); }, rel=osmCentroid("relation/7163945");
    res.figure_px={note:"the Sokolnitz level-2 mosaic's pixels (fit C's inverse); the Kobelnitz mosaic's pixel is this minus "+JSON.stringify(pp.kobelnitz1825?pp.kobelnitz1825.offset_to_sokolnitz_frame:null),
      woodland_today:rel.rings.filter(r=>r.role==="outer")[0].ll.map(p=>toPx(p[0],p[1])),
      territory_today:TERRS.find(t=>t.attributes.nazev==="Sokolnice").geometry.rings[0].map(p=>toPx(p[1],p[0])),
      riicka_today:(out._streams.osm||[]).map(sg=>sg.map(fromMap)), drawn_goldbach:GOLD.value.map(fromMap), drawn_wood:C.sokolnice.pheasantry.drawn_ellipse_map.map(fromMap),
      drawn_castle:fromMap(NOW.castle.p), castle_today:toPx(LM("sokolnice_castle").primary.lat,LM("sokolnice_castle").primary.lon), village_point:fromMap(vpt("Sokolnitz"))}; }
  /* a check far from the control points: the modern walls on the enclosure's east side (OSM barrier=wall in the Sokolnice download, east of
     the avenue) against the 1825 outline's boundary; 8G read the modern east walls as following the drawn east edge and road band within
     about 10-20 m */
  const fas=res.features.fasangarten_1825;
  if(fas){ const ring=fas.outline_map.concat([fas.outline_map[0]]), walls=Object.entries(O_SOK.ways).filter(([id,w])=>w.tags.barrier==="wall").map(([id,w])=>({id,m:w.nd.map(n=>O_SOK.nodes[n].ll).map(p=>mapOf(p[0],p[1]))}));
    const east=walls.filter(w=>w.m.every(p=>p[0]>212&&p[1]<340&&p[1]>296));
    const d=east.flatMap(w=>w.m.map(p=>toPolyline(p,ring).d*ppu)).sort((x,y)=>x-y);
    res.checks.push({name:"modern walls east of the avenue (OSM barrier=wall, "+east.map(w=>"way/"+w.id).join(", ")+") to the 1825 outline, fit C", vertices:d.length, median_m:d.length?r0(d[d.length>>1]):null, max_m:d.length?r0(d[d.length-1]):null}); }
  return res; }
/* ---------------- the EPSG:5514 geometry the period-map figures draw (period-figures.py) ---------------- */
{ const toJ=p=>{ const g=G.toGeo(p[0],p[1]); return K.toJTSK(g[0],g[1]).map(r2); };
  out.figures={note:"EPSG:5514 metres (E, N) of what the period-map figures overlay; drawn features from their map coordinates through GEOREF.toGeo",
    drawn_highway:HWY.p.map(toJ), drawn_goldbach:GOLD.value.map(toJ), drawn_wood0:C.sokolnice.pheasantry.drawn_ellipse_map.map(toJ),
    drawn_wood1:(()=>{ const W1=WOODS.value[1], e=[]; for(let i=0;i<=360;i+=4){ const a=i*D2R; e.push([W1.c[0]+W1.rx*Math.cos(a),W1.c[1]+W1.ry*Math.sin(a)]); } return e.map(toJ); })(),
    gt_posthouse:toJ(GT.posthouse.map), drawn_castle:toJ(NOW.castle.p),
    real_road:out._road.osm.map(s=>s.map(toJ)), real_stream:out._streams.osm.map(s=>s.map(toJ)),
    pheasantry:C.sokolnice.pheasantry.outline_map.map(toJ), garden:C.slavkov.garden.outline_map.map(toJ),
    landmarks:Object.fromEntries(out.landmarks.map(x=>[x.id,K.toJTSK(x.primary.lat,x.primary.lon).map(r2)])),
    period1825:C.period1825?Object.fromEntries(Object.entries(C.period1825.features).map(([k,f])=>[k,{type:f.type, en:(f.outline_map||f.line_map||[f.map]).map(toJ)}])):null};
}
delete out._road; delete out._streams;
fs.writeFileSync(path.join(DIR,"places.json"),JSON.stringify(out,null,1));
/* ---------------- a summary on the console ---------------- */
const pad=(s,n)=>String(s).padEnd(n);
console.log(pad("#",3),pad("landmark",44),pad("map x,y",16),pad("offset now->modern",20),pad("places.md",16),pad("spread",7),"vincenty");
for(const x of out.landmarks) console.log(pad(x.n,3),pad(x.name.slice(0,43),44),pad(x.map.join(", "),16),pad(x.offset_m+" m @ "+x.bearing+"°",20),pad(x.places_md.offset_m+" @ "+x.places_md.bearing+"°",16),pad(x.spread_m==null?"-":x.spread_m+" m",7),x.vincenty.m+" m @ "+x.vincenty.az+"°");
console.log(JSON.stringify({frame:{roundtrip:C.frame.roundtrip_max_m, vill:C.frame.villages_vs_gt.max_units, pairs:C.frame.gt_pairs, offs:C.frame.offsets_vs_vincenty}, krovak:C.krovak},null,0));
console.log("Sokolnice:",JSON.stringify({castle_from_village:C.sokolnice.castle_from_village, drawn_castle_from_village:C.sokolnice.drawn_castle_from_village, granary_from_village:C.sokolnice.granary_from_village, granary_from_castle:C.sokolnice.granary_from_castle}));
const P_=C.sokolnice.pheasantry; console.log("pheasantry:",JSON.stringify({outer:P_.outer_area_km2, net:P_.net_woodland_km2, extent:P_.extent_true_m, bbox:P_.map_bbox, ell:P_.drawn_ellipse_bbox, ellkm2:P_.drawn_ellipse_km2, overlap:P_.overlap_with_drawn_ellipse_share, net_centroid:P_.centroid_net_woodland, from_castle:P_.from_real_castle, drawn:P_.drawn_from_drawn_castle}));
console.log("goldbach rows:"); for(const r of C.goldbach.rows) console.log("  ",JSON.stringify(r)); console.log("  ",JSON.stringify(C.goldbach.real_stream_from), JSON.stringify(C.goldbach.drawn_goldbach_from));
console.log("highway rows:"); for(const r of C.highway.rows) console.log("  ",JSON.stringify(r)); console.log("  post house to drawn highway", C.highway.posthouse_to_drawn_highway_m, "m; to the real road", C.highway.posthouse_to_real_road_m, "m; Santon chapel", C.highway.santon_chapel_side);
console.log("Slavkov:",JSON.stringify(C.slavkov,(k,v)=>k==="outline_map"?undefined:v));
if(C.period1825) console.log("1825:",JSON.stringify(C.period1825,(k,v)=>(k==="outline_map"||k==="line_map"||k==="source"||k==="figure_px")?undefined:v));
