#!/usr/bin/env node
/* Stage 8, 8H location research: fetch the raw inputs that compute-places.js reads (no computation here).
   Every response is saved under raw/ as served (gzipped where a text response is over 200 KB) and listed in raw/manifest.json with
   its exact URL, HTTP status, size, sha256 and the time it was fetched. Network goes through curl (the session's proxy).
     node docs/stage8-evidence/8h/geo/fetch-places.js [--only ruian,zabaged,npu,osm,walk,wikidata,cenia,mza,probe] [--force]
   Research tool; not part of the build. Sources: ČÚZK RÚIAN and ZABAGED (ags.cuzk.cz ArcGIS REST), OpenStreetMap API 0.6,
   Wikidata (Special:EntityData and the query service), NPÚ geoportal (Památkový katalog layers), CENIA's WMTS of the Second
   Military Survey (EPSG:5514 tiles), the Moravian Land Archive's indication sketches (www.mza.cz/indikacniskici). */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto"), zlib=require("zlib"), {execFileSync}=require("child_process");
const K=require("./krovak.js");
const DIR=__dirname, RAW=path.join(DIR,"raw"), MAN=path.join(RAW,"manifest.json");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=(opt("--only")||"ruian,zabaged,npu,osm,walk,wikidata,cenia,mza,probe").split(","), FORCE=argv.includes("--force");
const manifest=fs.existsSync(MAN)?JSON.parse(fs.readFileSync(MAN,"utf8")):{note:"every raw response fetched for docs/stage8-evidence/8h/geo, as served; gz = gzipped here", entries:[]};
function saveManifest(){ fs.writeFileSync(MAN,JSON.stringify(manifest,null,1)); }
function sleep(ms){ Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms); }
/* one GET through curl; the body saved at raw/<rel> (rel ending in .gz: gzipped here); returns {status, body(Buffer)} */
function get(url,rel,o){ o=o||{};
  const out=path.join(RAW,rel), done=manifest.entries.find(e=>e.file===rel&&e.status===200);
  if(done&&!FORCE&&fs.existsSync(out)){ let b=fs.readFileSync(out); if(rel.endsWith(".gz")) b=zlib.gunzipSync(b); return {status:200, body:b, cached:true}; }
  if(done&&!FORCE&&done.kept===false&&o.keep===false&&!argv.includes("--keep-all")) return {status:200, body:Buffer.alloc(0), cached:true};
  fs.mkdirSync(path.dirname(out),{recursive:true});
  const tmp=path.join(RAW,".part");
  let status=0, err=null;
  try{ const w=execFileSync("curl",["-sS","--max-time",String(o.timeout||180),"-o",tmp,"-w","%{http_code}",url],{encoding:"utf8"}); status=+w.trim(); }
  catch(e){ err=String(e.stderr||e.message).trim().slice(0,300); try{ status=+String(e.stdout||"").trim()||0; }catch(_){} }
  let body=fs.existsSync(tmp)?fs.readFileSync(tmp):Buffer.alloc(0); if(fs.existsSync(tmp)) fs.unlinkSync(tmp);
  const ent={url, file:rel, status, bytes:body.length, sha256:crypto.createHash("sha256").update(body).digest("hex"), fetched:new Date().toISOString()};
  if(err) ent.error=err;
  if(o.note) ent.note=o.note;
  if(o.keep===false&&!argv.includes("--keep-all")){ ent.kept=false; ent.note=(o.note?o.note+"; ":"")+"not kept in the repository (size); its URL, size and sha256 are recorded here; --keep-all writes it"; }
  else if(body.length) fs.writeFileSync(out, rel.endsWith(".gz")?zlib.gzipSync(body,{level:9}):body);
  if(status!==200){ manifest.failures=manifest.failures||[]; manifest.failures.push(Object.assign({},ent)); }
  manifest.entries=manifest.entries.filter(e=>e.file!==rel); manifest.entries.push(ent); saveManifest();
  console.log(status, body.length, rel, err?("ERR "+err):"");
  sleep(o.pause==null?600:o.pause);
  return {status, body};
}
const q=s=>encodeURIComponent(s);
/* ---------------- the landmarks' identifiers, from places.md Table A (2026-10-28) ---------------- */
const RUIAN_BLDG=[13158571,46430121,46068201,46052721,50266829,39874931,39874940,46085165,23571594,39854523,39847462,23691972,43615511,
  50432346,39854426,23713933,49964330,45872252,45858501,46054103,39712834,13846744];
const RUIAN_ADDR=[23956321,23956313];   /* Kovalovice č.p. 109 and 108 */
const OSM_EL=["relation/1387462","way/120172453","relation/7163945","way/532421085","way/103037763","way/120173761","way/51730107",
  "way/568443552","way/43491345","way/93725054","way/281397740","way/94121875","way/94173426","way/99501891","way/185482479",
  "way/408678509","way/114382832","way/449323976","way/97186802","way/125399653","way/97103420","way/27326750","way/27326751",
  "way/488717833"];
const OSM_NODES=["node/4810832354","node/3384317516"];   /* the pheasantry gate, the castle chapel */
const WD=["Q12055280","Q38134887","Q55792212","Q12030519","Q12030791","Q12030989","Q38234573","Q38150137","Q141367424","Q12056169",
  "Q31149564","Q37423595","Q12030376","Q10407617","Q12030293","Q122924573","Q13593819","Q37281331","Q27971669","Q12030943","Q12030543",
  "Q1418278",
  /* found by the SPARQL 'around' queries below (29 October 2026): the pheasantry's marked trees and gun positions, the castle park,
     the Slavkov park and its avenues */
  "Q26779145","Q121069128","Q124498422","Q123734676","Q28915627"];
const NPU_KAT=["1000120787","1000153004","1000134522","1000148882","1000130835","1000141624","1000151014","1000138600","1000152934",
  "1000135245","1000140666","1000124062","1000119615","1000133864","1000144472","1000138297","1000121971"];
/* ---------------- ČÚZK RÚIAN ---------------- */
const RU="https://ags.cuzk.cz/arcgis/rest/services/RUIAN/MapServer";
if(ONLY.includes("ruian")){
  get(RU+"?f=json","ruian/MapServer.json");
  const fields="kod,cisladomovni,zastavenaplocha,identifikacniparcela,typstavebnihoobjektukod,zpusobvyuzitikod,dokonceni,castobce,zdroj";
  for(const sr of [4326,5514])
    get(`${RU}/3/query?where=${q("kod IN ("+RUIAN_BLDG.join(",")+")")}&outFields=${fields}&returnGeometry=true&outSR=${sr}&f=json`,`ruian/buildings_${sr}.json`);
  get(`${RU}/1/query?where=${q("kod IN ("+RUIAN_ADDR.join(",")+")")}&outFields=*&returnGeometry=true&outSR=4326&f=json`,"ruian/addresses_kovalovice_4326.json");
  /* the cadastral territories round the pheasantry and the post house (the 1825-1826 sketches are drawn by territory) */
  get(`${RU}/7/query?where=${q("nazev IN ('Sokolnice','Kobylnice u Brna','Telnice u Brna','Ponětovice','Kovalovice u Tvarožné','Holubice','Tvarožná','Kovalovice','Slavkov u Brna','Prace')")}&outFields=kod,nazev,obec&returnGeometry=true&outSR=4326&maxAllowableOffset=0.00001&f=json`,"ruian/territories_4326.json.gz");
  /* municipalities' and parts' definition points, for the frame check (independent village centres) */
  get(`${RU}/11?f=json`,"ruian/layer11_CastObce.json");
}
/* ---------------- ČÚZK ZABAGED (topographic database) ---------------- */
const ZB="https://ags.cuzk.cz/arcgis/rest/services/ZABAGED_POLOHOPIS/MapServer";
function env(x0,y0,x1,y1){ return `geometry=${q(JSON.stringify({xmin:x0,ymin:y0,xmax:x1,ymax:y1,spatialReference:{wkid:4326}}))}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects`; }
if(ONLY.includes("zabaged")){
  get(`${ZB}/93/query?where=1%3D1&${env(16.700,49.100,16.745,49.140)}&outFields=*&returnGeometry=true&outSR=4326&f=json`,"zabaged/watercourses_sokolnice_4326.json");
  get(`${ZB}/79/query?where=${q("silnice LIKE '%430%'")}&${env(16.650,49.160,16.900,49.215)}&outFields=*&returnGeometry=true&outSR=4326&f=json`,"zabaged/road430_4326.json");
  get(`${ZB}/102/query?where=1%3D1&${env(16.700,49.100,16.745,49.140)}&outFields=*&returnGeometry=true&outSR=4326&f=json`,"zabaged/castle_sokolnice_4326.json");
  get(`${ZB}/39/query?where=1%3D1&${env(16.715,49.112,16.740,49.135)}&outFields=*&returnGeometry=true&outSR=4326&f=json`,"zabaged/walls_sokolnice_4326.json");
  get(`${ZB}/102/query?where=1%3D1&${env(16.860,49.145,16.885,49.165)}&outFields=*&returnGeometry=true&outSR=4326&f=json`,"zabaged/castle_slavkov_4326.json");
  /* the parts' definition points (layer 3) for the frame check */
  get(`${ZB}/3/query?where=1%3D1&${env(16.66,49.07,16.90,49.22)}&outFields=*&returnGeometry=true&outSR=4326&f=json`,"zabaged/defpoints_castobce_4326.json");
}
/* ---------------- NPÚ heritage catalogue, through its geoportal ---------------- */
const NP="https://geoportal.npu.cz/arcgis/rest/services/Tematicke/CP_PaKaSintc/MapServer";
if(ONLY.includes("npu")){
  const w=NPU_KAT.map(k=>`KatCislo LIKE '${k}%'`).join(" OR ");
  for(const L of [5,12]) get(`${NP}/${L}/query?where=${q(w)}&outFields=*&returnGeometry=true&outSR=4326&f=json`,`npu/layer${L}_records_4326.json`);
  /* Pozořice: the 'former post' record named by places.md (138729_1), searched by place */
  for(const L of [5,6,12,13]) get(`${NP}/${L}/query?where=1%3D1&${env(16.788,49.206,16.797,49.212)}&outFields=*&returnGeometry=true&outSR=4326&f=json`,`npu/layer${L}_pozorice_4326.json`);
}
/* ---------------- OpenStreetMap API 0.6 ---------------- */
const OSM="https://api.openstreetmap.org/api/0.6";
if(ONLY.includes("osm")){
  for(const e of OSM_EL) get(`${OSM}/${e}/full`,`osm/${e.replace("/","_")}_full.xml`);
  for(const e of OSM_NODES) get(`${OSM}/${e}`,`osm/${e.replace("/","_")}.xml`);
  /* the Říčka (the Goldbach) and the castle's grounds at Sokolnice */
  get(`${OSM}/map?bbox=16.705,49.106,16.742,49.136`,"osm/map_sokolnice.xml.gz");
}
/* the old imperial road (II/430): walked way by way from the ways at the post house, through the nodes' ways (no Overpass) */
function parseOsm(xml){ xml=String(xml); const nodes={}, ways={};
  for(const m of xml.matchAll(/<node id="(\d+)"[^>]*?lat="([-\d.]+)" lon="([-\d.]+)"/g)) nodes[m[1]]=[+m[2],+m[3]];
  for(const m of xml.matchAll(/<way id="(\d+)"[^>]*>([\s\S]*?)<\/way>/g)){ const nd=[...m[2].matchAll(/<nd ref="(\d+)"/g)].map(x=>x[1]), tags={};
    for(const t of m[2].matchAll(/<tag k="([^"]*)" v="([^"]*)"/g)) tags[t[1]]=t[2]; ways[m[1]]={nd,tags}; }
  return {nodes,ways}; }
if(ONLY.includes("walk")){
  const LON=[16.650,16.895], start=get(`${OSM}/map?bbox=16.818,49.180,16.834,49.190`,"osm/walk430/map_posthouse.xml.gz");
  const P=parseOsm(start.body), is430=t=>/(^|;)\s*(II\/)?430\s*($|;)/.test(t.ref||"")&&!!t.highway;
  const queue=Object.keys(P.ways).filter(id=>is430(P.ways[id].tags)), seen=new Set(queue), nodesDone=new Set();
  let calls=0;
  while(queue.length&&calls<400){ const id=queue.shift(); const r=get(`${OSM}/way/${id}/full`,`osm/walk430/way_${id}_full.xml`,{pause:400}); calls++;
    const W=parseOsm(r.body), w=W.ways[id]; if(!w) continue;
    for(const nid of [w.nd[0],w.nd[w.nd.length-1]]){ const ll=W.nodes[nid]; if(!ll||nodesDone.has(nid)) continue; nodesDone.add(nid);
      if(ll[1]<LON[0]||ll[1]>LON[1]) continue;
      const rr=get(`${OSM}/node/${nid}/ways`,`osm/walk430/node_${nid}_ways.xml`,{pause:400}); calls++;
      const N=parseOsm(rr.body); for(const wid of Object.keys(N.ways)) if(is430(N.ways[wid].tags)&&!seen.has(wid)){ seen.add(wid); queue.push(wid); } } }
  console.log("II/430 walk:", seen.size, "ways,", calls, "calls");
}
/* the walk above stops at 16.745 E, where the road splits into two one-way carriageways that carry no ref (node 6661379296);
   westward from there a way is followed if it carries ref 430, or is a secondary road without a ref joined end to end */
if(ONLY.includes("walkwest")){
  const ok=t=>!!t.highway&&(/(^|;)\s*(II\/)?430\s*($|;)/.test(t.ref||"")||(t.highway==="secondary"&&!t.ref));
  const nodeQ=["6661379296"], nodesDone=new Set(), seen=new Set(["772989583"]); let calls=0;
  while(nodeQ.length&&calls<120){ const nid=nodeQ.shift(); if(nodesDone.has(nid)) continue; nodesDone.add(nid);
    const rr=get(`${OSM}/node/${nid}/ways`,`osm/walk430/node_${nid}_ways.xml`,{pause:400}); calls++;
    const N=parseOsm(rr.body);
    for(const wid of Object.keys(N.ways)){ if(seen.has(wid)||!ok(N.ways[wid].tags)) continue; seen.add(wid);
      const r=get(`${OSM}/way/${wid}/full`,`osm/walk430/way_${wid}_full.xml`,{pause:400}); calls++;
      const W=parseOsm(r.body), w=W.ways[wid]; if(!w) continue;
      for(const e of [w.nd[0],w.nd[w.nd.length-1]]){ const ll=W.nodes[e]; if(ll&&ll[1]>=16.655&&ll[1]<=16.7455&&!nodesDone.has(e)) nodeQ.push(e); } } }
  console.log("II/430 west walk:", seen.size, "ways,", calls, "calls");
}
/* ---------------- Wikidata ---------------- */
if(ONLY.includes("wikidata")){
  for(const id of WD) get(`https://www.wikidata.org/wiki/Special:EntityData/${id}.json`,`wikidata/${id}.json.gz`,{pause:1000});
  const sparql=`SELECT ?item ?itemLabel ?kat ?coord WHERE { VALUES ?kat { ${NPU_KAT.map(k=>'"'+k+'"').join(" ")} } ?item wdt:P4075 ?kat . OPTIONAL { ?item wdt:P625 ?coord } SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". } }`;
  get(`https://query.wikidata.org/sparql?format=json&query=${q(sparql)}`,"wikidata/sparql_by_catalogue_number.json",{pause:1000});
  /* every item with a coordinate within 1.5 km of the Sokolnice castle and of the Slavkov château (the pheasantry, the garden, if they have items) */
  for(const [tag,pt] of [["sokolnice","16.7263 49.1192"],["slavkov","16.8749 49.1548"]]){
    const sp=`SELECT ?item ?itemLabel ?coord ?dist WHERE { SERVICE wikibase:around { ?item wdt:P625 ?coord . bd:serviceParam wikibase:center "Point(${pt})"^^geo:wktLiteral . bd:serviceParam wikibase:radius "1.5" . bd:serviceParam wikibase:distance ?dist . } SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". } } ORDER BY ?dist`;
    get(`https://query.wikidata.org/sparql?format=json&query=${q(sp)}`,`wikidata/sparql_around_${tag}.json`,{pause:1000}); }
}
/* the cs.wikipedia list of the battlefield's monuments, at the revision places.md names (26159478) */
if(ONLY.includes("cswiki")){ get("https://cs.wikipedia.org/w/index.php?oldid=26159478&action=raw","cswiki/seznam_pamatek_slavkovskeho_bojiste_26159478.wikitext",{pause:1000});
  /* the articles the identities rest on (modern texts, grade C): their current revisions, with revision id and time */
  for(const [t,f] of [["Stará Pošta (Kovalovice)","stara_posta_kovalovice"],["Sokolnice (zámek)","sokolnice_zamek"],["Kostel Povýšení svatého Kříže (Prace)","prace_kostel"],["Slavkov u Brna (zámek)","slavkov_zamek"],["Říčka (přítok Litavy)","ricka"]])
    get(`https://cs.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&format=json&titles=${q(t)}`,`cswiki/${f}.json`,{pause:8000}); }
/* ---------------- the Second (1836-1852) and Third (1:75,000, 1870s-1880s) Military Surveys: CENIA's WMTS, EPSG:5514 ----------------
   Probed on 29 October 2026: one whole sheet is missing from the Second Survey's mosaic: the field west of about 16.80 E (Sokolnitz,
   Pratzen, the Santon, Bosenitz) is transparent at every level (levels 8 and 9 there return an empty 139-byte PNG); its east sheet, which
   covers Holubitz, the post house, Kowalowitz and Austerlitz, has data at levels 6 to 9 (16, 8, 4 and 2 m a pixel). */
const TM={X0:-925000, Y0:-920000, px:512, sd:{6:57150, 7:28575, 8:14287.5, 9:7143.75}};
function tilesFor(level,lat0,lon0,lat1,lon1){ const res=TM.sd[level]*0.00028, size=TM.px*res, out=[];
  const c=[[lat0,lon0],[lat0,lon1],[lat1,lon0],[lat1,lon1]].map(p=>K.toJTSK(p[0],p[1]));
  const E0=Math.min(...c.map(p=>p[0])), E1=Math.max(...c.map(p=>p[0])), N0=Math.min(...c.map(p=>p[1])), N1=Math.max(...c.map(p=>p[1]));
  for(let row=Math.floor((TM.Y0-N1)/size); row<=Math.floor((TM.Y0-N0)/size); row++)
    for(let col=Math.floor((E0-TM.X0)/size); col<=Math.floor((E1-TM.X0)/size); col++) out.push([level,row,col]);
  return out; }
const CENIA={
  II_vojenske_mapovani:{
    field:[6,49.080,16.640,49.220,16.920],          /* the whole field, for the coverage */
    posthouse:[7,49.172,16.780,49.198,16.850],      /* the road from Holubitz's meridian past the post house */
    slavkov:[7,49.145,16.855,49.165,16.890],        /* the château, its garden, the church */
    sokolnice:[7,49.105,16.705,49.135,16.745],      /* inside the missing sheet: fetched to show it */
    probe8:[8,49.115,16.720,49.124,16.733],         /* the level-8 tiles at the castle (empty: inside the missing sheet) */
    posthouse9:[9,49.181,16.815,49.189,16.836],     /* the post house and the road, 2 m a pixel */
    slavkov9:[9,49.151,16.862,49.157,16.880]},      /* the château and its garden, 2 m a pixel */
  III_vojenske_mapovani:{
    sokolnice:[8,49.105,16.705,49.135,16.745],
    highway:[7,49.172,16.700,49.200,16.850],
    slavkov:[7,49.145,16.855,49.165,16.890]}};
if(ONLY.includes("cenia")){
  for(const svc of Object.keys(CENIA)){ const B=`https://gis.cenia.cz/mapcache/${svc}/wmts`;
    get(`${B}?SERVICE=WMTS&REQUEST=GetCapabilities`,`cenia/${svc}_capabilities.xml`);
    const all=new Map(); for(const k of Object.keys(CENIA[svc])) for(const t of tilesFor(...CENIA[svc][k])) all.set(t.join("/"),t);
    for(const [key,t] of all) get(`${B}/1.0.0/${svc}/default/jtsk:epsg:5514/${t[0]}/${t[1]}/${t[2]}.jpgpng`,`cenia/${svc}/${t[0]}_${t[1]}_${t[2]}.img`,
      {pause:250, keep:t[0]===6?false:undefined, note:t[0]===6?"a level-6 tile of the coverage figure (fig/ii_survey_coverage.jpg)":undefined}); }
  get("https://gis.cenia.cz/mapcache/II_vojenske_mapovani/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=II_vojenske_mapovani&STYLES=&SRS=EPSG:5514&BBOX=-591021,-1170484,-589972,-1169590&WIDTH=524&HEIGHT=447&FORMAT=image/png",
    "cenia/II_wms_getmap_castle_2m.xml",{note:"the WMS at 2 m a pixel at the castle: a service exception, no tiles in its cache"});
}
/* ---------------- the stable cadastre's indication sketches (1825-1826), Moravian Land Archive ---------------- */
const MZA="https://www.mza.cz/indikacniskici/data/obrazky";
/* level 2 ("little"): 3 x 3 tiles a piece (readings-cadastre.md section 0.1); pieces as 8G's reader identified them */
const MZA_PIECES={MOR246318250:["A03D","A03E","A04D","A04E","A05D","A05E"],   /* Sokolnitz 1825: pheasantry A03E, castle A04E, village A05D */
  MOR108718260:["A06B","A06C"],                                                   /* Kowalowitz 1826: the Posoritzer Post */
  MOR243418260:[],
  MOR102418250:[],                                                                /* Kobelnitz 1825: the pieces south-west of the village, chosen from its mosaic */
  MOR273018260:["A07B","A07C","A07D","A07E","A08B","A08C","A08D","A08E","A09B","A09C","A09D","A09E"]};   /* Bosenitz 1826: the highway (an avenue) across the south of the territory, rows 07-09 (found on the previews) */                                                               /* Austerlitz 1826: pieces chosen from its mosaic below */
if(ONLY.includes("mza")){
  for(const id of Object.keys(MZA_PIECES)){ get(`${MZA}/${id}/Img/map.jpg`,`mza/${id}/map.jpg`);
    for(const S of (opt("--pieces-"+id)||"").split(",").filter(Boolean).concat(MZA_PIECES[id]))
      for(const a of "ABC") for(const n of [1,2,3]) get(`${MZA}/${id}/Img/little/${S}-${a}${n}.jpg`,`mza/${id}/little/${S}-${a}${n}.jpg`,{pause:200}); }
}
/* level 4 ("Normal", full resolution): a tile's name from its column lx (0-11) and row ly (0-11) in its piece (readings-cadastre.md 0.1) */
function mzaL4(S,lx,ly){ const L="ABC"; return `${S}-${L[Math.floor(lx/4)]}${Math.floor(ly/4)+1}-${"AB"[Math.floor(lx/2)%2]}${Math.floor(ly/2)%2+1}-${"AB"[lx%2]}${ly%2+1}`; }
const MZA_L4={MOR246318250:[["A04E",0,3,3,7]]};   /* Sokolnitz: the castle and the granary (the control points), lx 0-3, ly 3-7 */
if(ONLY.includes("mza4")){
  for(const id of Object.keys(MZA_L4)) for(const [S,x0,y0,x1,y1] of MZA_L4[id])
    for(let ly=y0;ly<=y1;ly++) for(let lx=x0;lx<=x1;lx++){ const n=mzaL4(S,lx,ly); get(`${MZA}/${id}/Img/Normal/${n}.jpg`,`mza/${id}/Normal/${n}.jpg`,{pause:200}); }
}
/* level 3 ("Small", half resolution): 6 x 6 tiles a piece; tile (X,Y) is <S>-<ABC[X/2]><Y/2+1>-<AB[X%2]><Y%2+1> */
const MZA_L3={MOR246318250:["A03E","A04E","A05E"],   /* Sokolnitz: the streams through the pheasantry, by the castle and through the park */
  MOR102418250:["A05C","A06C"]};                     /* Kobelnitz: the land north of the Sokolnitz boundary, where today's woodland runs on */
if(ONLY.includes("mza3")){
  for(const id of Object.keys(MZA_L3)) for(const S of MZA_L3[id]) for(let Y=0;Y<6;Y++) for(let X=0;X<6;X++){
    const n=`${S}-${"ABC"[Math.floor(X/2)]}${Math.floor(Y/2)+1}-${"AB"[X%2]}${Y%2+1}`; get(`${MZA}/${id}/Img/Small/${n}.jpg`,`mza/${id}/Small/${n}.jpg`,{pause:150}); }
}
/* level 1 ("Preview", 1/12 scale, one 217 x 174 image a piece): Bosenitz's southern pieces, to find the highway on them */
const MZA_L1={MOR273018260:["A07B","A07C","A07D","A07E","A08B","A08C","A08D","A08E","A09B","A09C","A09D","A09E","A10B"],
  MOR243418260:["A11A","A11B","A11C","A11D","A12A","A12B","A12C","A12D"]};   /* Austerlitz 1826: the town's enlargement (8G: A11B-A12B) */
if(ONLY.includes("mza1")) for(const id of Object.keys(MZA_L1)) for(const S of MZA_L1[id]) get(`${MZA}/${id}/Img/Preview/${S}.jpg`,`mza/${id}/Preview/${S}.jpg`,{pause:150});
/* ---------------- what was tried and refused (kept as evidence of access) ---------------- */
if(ONLY.includes("probe")){
  get("https://mapire.eu/en/","probe/mapire_en.html",{note:"Second and First Military Survey viewer (Arcanum)"});
  get("https://overpass-api.de/api/status","probe/overpass_status.txt");
  get("https://ags.cuzk.cz/arcgis4/rest/services/Archiv/archiv_spojene_cisarske_otisky/MapServer?f=json","probe/cuzk_cisarske_otisky_spojene.json",{note:"the joined imperial obligatory imprints (1824-1843) of the ČÚZK archive"});
  get("https://pamatkovykatalog.cz/","probe/pamatkovykatalog.html");
  get("https://gis.cenia.cz/mapcache/I_vojenske_mapovani/wmts?SERVICE=WMTS&REQUEST=GetCapabilities","probe/cenia_I_vojenske_mapovani.html",{note:"a First Survey cache under the Second's naming: none"});
  get("https://geoportal.gov.cz/arcgis/services/CENIA/cenia_rt_II_vojenske_mapovani/MapServer/WMSServer?service=WMS&request=GetCapabilities","probe/geoportal_gov_cz_II_wms.html",{note:"the national geoportal's older WMS of the Second Survey"});
  get("https://oldmaps.geolab.cz/map_root.pl?lang=en&map_root=2vm","probe/oldmaps_geolab_map_root.txt",{note:"UJEP's old-maps viewer (the Second Survey's georeferencing came from it)"});
  get("https://ags.cuzk.cz/archiv/","probe/cuzk_archiv_app.html",{note:"the ČÚZK archive viewer (its imprints' service asks it for a token)"});
}
saveManifest();
