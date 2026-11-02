/* Post-Stage-8 final audit, area "geography": fetch independent modern positions (and heights) for the field's places.
   Sources: cs.wikipedia (article coordinates and Wikidata ids), Wikidata (P625, P2044), OpenStreetMap Nominatim (place nodes, objects and
   waterway geometries), Open-Meteo's elevation API (Copernicus GLO-90 DEM). Every response is saved as served under
   docs/audit-post8-evidence/geography/raw/ and listed in raw/manifest.json with its URL, HTTP status, bytes, sha256 and time.
   node tools/audit-post8/geography/fetch-places.js [--only wiki,wd,nom,water,dem]   (Nominatim at most one request a second, a plain user agent) */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto"), cp=require("child_process");
const OUT=path.join(__dirname,"..","..","..","docs","audit-post8-evidence","geography","raw");
fs.mkdirSync(OUT,{recursive:true});
const UA="AusterlitzMapAudit/1.0 (historical map geography audit; non-commercial)";
const MAN=path.join(OUT,"manifest.json"), man=fs.existsSync(MAN)?JSON.parse(fs.readFileSync(MAN,"utf8")):{entries:[]};
const only=(()=>{ const i=process.argv.indexOf("--only"); return i>0?process.argv[i+1].split(","):null; })();
const want=k=>!only||only.includes(k);
function sleep(ms){ cp.execSync("sleep "+(ms/1000)); }
function get(url,file){
  const dest=path.join(OUT,file);
  let status="?", err=null;
  try{ status=cp.execFileSync("curl",["-sS","-m","60","-A",UA,"-o",dest,"-w","%{http_code}",url],{encoding:"utf8"}).trim(); }
  catch(e){ err=String(e.message).split("\n")[0]; }
  const ok=fs.existsSync(dest), buf=ok?fs.readFileSync(dest):Buffer.alloc(0);
  const ent={file, url, status, bytes:buf.length, sha256:crypto.createHash("sha256").update(buf).digest("hex"), time:new Date().toISOString(), error:err};
  man.entries=man.entries.filter(e=>e.file!==file); man.entries.push(ent); fs.writeFileSync(MAN,JSON.stringify(man,null,1));
  console.log(status, buf.length, file);
  return ok&&status==="200"?buf.toString("utf8"):null;
}
/* the places: key (geo.js GT id or an audit id), the cs.wikipedia title, a Nominatim query */
const PLACES=[
  ["telnitz","Telnice (okres Brno-venkov)","Telnice, okres Brno-venkov"],["sokolnitz","Sokolnice","Sokolnice"],
  ["kobelnitz","Kobylnice (okres Brno-venkov)","Kobylnice, okres Brno-venkov"],["puntowitz","Ponětovice","Ponětovice"],
  ["schlapanitz","Šlapanice","Šlapanice"],["girzikowitz","Jiříkovice","Jiříkovice"],["bosenitz","Tvarožná","Tvarožná"],
  ["blasowitz","Blažovice","Blažovice"],["holubitz","Holubice (okres Vyškov)","Holubice, okres Vyškov"],["pratzen","Prace","Prace, okres Brno-venkov"],
  ["krzenowitz","Křenovice (okres Vyškov)","Křenovice, okres Vyškov"],["austerlitz","Slavkov u Brna","Slavkov u Brna"],
  ["augezd","Újezd u Brna","Újezd u Brna"],["satschan","Žatčany","Žatčany"],["menitz","Měnín","Měnín"],
  ["hostieradek","Hostěrádky-Rešov","Hostěrádky-Rešov"],["turas","Tuřany (Brno)","Tuřany, Brno"],["raigern","Rajhrad","Rajhrad"],
  ["rausnitz","Rousínov","Rousínov"],["kowalowitz","Kovalovice (okres Brno-venkov)","Kovalovice, okres Brno-venkov"],
  ["krug","Kruh (Holubice)","Kruh, Holubice"],["bellowitz","Bedřichovice (Šlapanice)","Bedřichovice, Šlapanice"],
  ["pratzeberg","Pracký kopec","Pracký kopec"],["vinohrady","Staré vinohrady","Staré vinohrady"],["zuran","Žuráň","Žuráň"],["santon","Santon (kopec)","Santon, Tvarožná"],
  ["castle","Sokolnice (zámek)","zámek Sokolnice"],["chateau","Slavkov u Brna (zámek)","zámek Slavkov"],
  ["prace_church","Kostel Povýšení svatého Kříže (Prace)","kostel Povýšení svatého Kříže, Prace"],["posthouse","Stará Pošta (Kovalovice)","Stará pošta, Kovalovice"],
  ["mohyla","Mohyla míru","Mohyla míru, Prace"]
];
if(want("wiki")){
  const titles=PLACES.map(p=>p[1]);
  for(let i=0;i<titles.length;i+=45){
    const q=titles.slice(i,i+45).map(t=>encodeURIComponent(t)).join("|");
    get("https://cs.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=coordinates%7Cpageprops&ppprop=wikibase_item&colimit=max&titles="+q,"cswiki-coords-"+(i/45)+".json");
  }
}
if(want("wd")){
  const f=path.join(OUT,"cswiki-coords-0.json"); if(fs.existsSync(f)){
    const J=JSON.parse(fs.readFileSync(f,"utf8")), ids=Object.values(J.query.pages).map(p=>p.pageprops&&p.pageprops.wikibase_item).filter(Boolean);
    for(let i=0;i<ids.length;i+=40) get("https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims%7Clabels&languages=cs%7Cen&ids="+ids.slice(i,i+40).join("%7C"),"wikidata-"+(i/40)+".json");
  }
}
if(want("nom")){
  PLACES.forEach(p=>{ get("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=cz&addressdetails=1&q="+encodeURIComponent(p[2]),"nominatim-"+p[0]+".json"); sleep(1300); });
}
if(want("water")){
  const VB="viewbox=16.55,49.26,16.95,49.04&bounded=1";
  [["ricka","Říčka"],["zlaty","Zlatý potok"],["litava","Litava"],["rakovec","Rakovec"],["roketnice","Roketnice"],["tvarozensky","Tvaroženský potok"],["drevnovice","Dřevnovice"],["dunajovicky","Dunajovický potok"],["prace_potok","Pracký potok"],["holubicky","Holubický potok"],["slapanicky","Šlapanický potok"]]
    .forEach(w=>{ get("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=10&polygon_geojson=1&"+VB+"&q="+encodeURIComponent(w[1]),"nominatim-water-"+w[0]+".json"); sleep(1300); });
}
if(want("dem")){
  /* the GT points and a profile along the Goldbach's drawn bed are asked in dem.js, which writes its own request list (dem-request.json) */
  const f=path.join(OUT,"..","dem-request.json"); if(fs.existsSync(f)){
    const R=JSON.parse(fs.readFileSync(f,"utf8"));
    for(let i=0;i<R.length;i+=100){ const S=R.slice(i,i+100);
      get("https://api.open-meteo.com/v1/elevation?latitude="+S.map(r=>r.lat.toFixed(6)).join(",")+"&longitude="+S.map(r=>r.lon.toFixed(6)).join(","),"openmeteo-dem-"+(i/100)+".json"); sleep(400); }
  } else console.log("no dem-request.json yet (run dem.js --request first)");
}
