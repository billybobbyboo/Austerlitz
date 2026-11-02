/* Post-Stage-8 final audit, area "geography": one figure from the area's saved evidence (no fetch, no page).
   Left: the four relief profiles across the southern Pratzen plateau, the surveyed ground (Copernicus GLO-90) against the model, with the
   drawn valley fog's top (238.2 m). Right: the plan of the Goldbach's upper and middle reaches, the drawn bed (GOLDBACH_M) and brooks
   (BROOKS_M) against today's channels (OSM, through the saved Nominatim geometries), the villages, the banks that differ (extra.json), the
   southern plateau's box, and Krug and Bellowitz drawn against today's places. Map units, the map's own frame (true north drawn as an arrow).
   node tools/audit-post8/geography/figure.js [ROOT]   Writes docs/audit-post8-evidence/geography/fig-relief-banks.svg. */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(process.argv[2]||path.join(__dirname,"..","..",".."));
const EV=path.join(__dirname,"..","..","..","docs","audit-post8-evidence","geography"), RAW=path.join(EV,"raw");
const GR=require(path.join(ROOT,"geo.js")), X=JSON.parse(fs.readFileSync(path.join(EV,"extra.json"),"utf8")), P=JSON.parse(fs.readFileSync(path.join(EV,"places.json"),"utf8"));
const acorn=require(path.join(ROOT,"node_modules","acorn")), WS=fs.readFileSync(path.join(ROOT,"world.js"),"utf8"), AST=acorn.parse(WS,{ecmaVersion:2020});
const decl=n=>{ for(const s of AST.body) if(s.type==="VariableDeclaration") for(const d of s.declarations) if(d.id.name===n) return Function('"use strict";return ('+WS.slice(d.init.start,d.init.end)+');')(); };
const GB=decl("GOLDBACH_M"), BR=decl("BROOKS_M"), VIL=decl("VILLAGES");
const osm=f=>{ const J=JSON.parse(fs.readFileSync(path.join(RAW,f),"utf8")); const g=J[0].geojson; return (g.type==="LineString"?[g.coordinates]:g.coordinates).map(l=>l.map(c=>GR.toMap(c[1],c[0]))); };
const T={roketnice:osm("nominatim-water-roketnice.json"), ricka:osm("nominatim-water-ricka.json"), tvarozensky:osm("nominatim-water-tvarozensky.json")};
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
let s='<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="760" viewBox="0 0 1400 760" font-family="DejaVu Sans, Arial, sans-serif" font-size="12">'+
  '<rect width="1400" height="760" fill="#fff"/>';
/* left: profiles, 2 x 2 */
const prof=Object.entries(X.profiles);
prof.forEach(([k,v],n)=>{ const ox=40+(n%2)*330, oy=40+Math.floor(n/2)*350, w=280, h=260, y0=180, y1=340, L=v.lengthKm;
  const px=f=>ox+f*w, py=m=>oy+h-(m-y0)/(y1-y0)*h;
  s+='<rect x="'+ox+'" y="'+oy+'" width="'+w+'" height="'+h+'" fill="none" stroke="#999"/>';
  for(let m=200;m<=340;m+=20) s+='<line x1="'+ox+'" x2="'+(ox+w)+'" y1="'+py(m)+'" y2="'+py(m)+'" stroke="#eee"/><text x="'+(ox-4)+'" y="'+(py(m)+4)+'" text-anchor="end" font-size="10">'+m+'</text>';
  s+='<line x1="'+ox+'" x2="'+(ox+w)+'" y1="'+py(238.2)+'" y2="'+py(238.2)+'" stroke="#c80" stroke-dasharray="6 3"/><text x="'+(ox+w-2)+'" y="'+(py(238.2)-3)+'" text-anchor="end" font-size="10" fill="#a60">fog top 238.2 m</text>';
  const line=(key,col,dash)=>'<polyline fill="none" stroke="'+col+'" stroke-width="2"'+(dash?' stroke-dasharray="5 3"':'')+' points="'+v.rows.map((r,i)=>px(i/(v.rows.length-1)).toFixed(1)+","+py(r[key]).toFixed(1)).join(" ")+'"/>';
  s+=line("dem","#222",false)+line("model","#d22",true);
  s+='<text x="'+ox+'" y="'+(oy-8)+'" font-weight="bold">'+esc(k.replace("-"," to "))+' ('+L+' km)</text>';
  s+='<text x="'+ox+'" y="'+(oy+h+16)+'" font-size="11">model minus survey: mean '+v.meanModelMinusDem+' m, worst '+v.worst+' m</text>'; });
s+='<text x="40" y="742" font-size="11"><tspan fill="#222">solid: surveyed ground (Copernicus GLO-90, 90 m surface model)</tspan>   <tspan fill="#d22">dashed: the map\'s relief model (GEOREF.elevM(hAt))</tspan></text>';
/* right: plan, map units x 150-320, y 40-400 */
const ox=720, oy=30, sc=1.85, mx0=150, my0=40, Q=p=>[(ox+(p[0]-mx0)*sc).toFixed(1),(oy+(p[1]-my0)*sc).toFixed(1)];
const clip=p=>p[0]>=mx0-5&&p[0]<=mx0+360/sc*1.0+60&&p[1]>=my0-5&&p[1]<=my0+390;
const pl=(pts,col,w,dash)=>'<polyline fill="none" stroke="'+col+'" stroke-width="'+w+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+' points="'+pts.filter(clip).map(p=>Q(p).join(",")).join(" ")+'"/>';
s+='<rect x="'+ox+'" y="'+oy+'" width="'+(170*sc)+'" height="'+(370*sc)+'" fill="#fafafa" stroke="#999"/>';
s+='<g clip-path="none">';
Object.values(T).forEach(ls=>ls.forEach(l=>{ s+=pl(l,"#8a8a8a",2.2,null); }));
BR.forEach(b=>{ s+=pl(b,"#6cf",2,"4 3"); });
s+=pl(GB,"#05f",2.4,null);
const box=[[270,295],[330,295],[330,350],[270,350],[270,295]]; s+=pl(box,"#c80",1.5,"3 3");
s+='<text x="'+Q([272,293])[0]+'" y="'+Q([272,293])[1]+'" font-size="10" fill="#a60">southern plateau box (model 45 m low)</text>';
const swaps=new Set(X.banks.swaps);
VIL.forEach(v=>{ const p=[v[1],v[2]]; if(!clip(p)) return; const c=Q(p), sw=swaps.has(v[0]); s+='<circle cx="'+c[0]+'" cy="'+c[1]+'" r="4" fill="'+(sw?"#e00":"#333")+'"/><text x="'+(+c[0]+6)+'" y="'+(+c[1]+4)+'" font-size="11" fill="'+(sw?"#e00":"#333")+'">'+esc(v[0])+(sw?" (bank differs)":"")+'</text>'; });
[["krug","Kruh today"],["bellowitz","Bedřichovice today"]].forEach(([k,lab])=>{ const r=P.rows.find(q=>q.key===k); if(!r||!r.modernMap) return; const a=Q(r.drawn.map), b=Q(r.modernMap);
  s+='<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="#a0a" stroke-dasharray="2 2"/><circle cx="'+b[0]+'" cy="'+b[1]+'" r="3.5" fill="none" stroke="#a0a"/><text x="'+(+b[0]+5)+'" y="'+(+b[1]-4)+'" font-size="10" fill="#a0a">'+esc(lab)+' ('+(r.drawnToWikidata?Math.round(r.drawnToWikidata.m):"?")+' m)</text>'; });
const g8=X.chapelSight.gtChapel.map, c8=Q(g8); s+='<circle cx="'+c8[0]+'" cy="'+c8[1]+'" r="3.5" fill="#c80"/><text x="'+(+c8[0]+5)+'" y="'+(+c8[1]+12)+'" font-size="10" fill="#a60">St Anthony (model 200 m, survey 242 m)</text>';
s+='</g>';
/* north arrow: true north in map units */
const na=[ox+170*sc-30, oy+40], nv=GR.NORTH; s+='<line x1="'+na[0]+'" y1="'+na[1]+'" x2="'+(na[0]+nv[0]*28).toFixed(1)+'" y2="'+(na[1]+nv[1]*28).toFixed(1)+'" stroke="#000" stroke-width="2"/><text x="'+(na[0]+nv[0]*34-4).toFixed(1)+'" y="'+(na[1]+nv[1]*34).toFixed(1)+'" font-size="11">N</text>';
s+='<text x="'+ox+'" y="'+(oy+370*sc+18)+'" font-size="11"><tspan fill="#05f">blue: drawn Goldbach</tspan>  <tspan fill="#39c">dashed: drawn brooks</tspan>  <tspan fill="#777">grey: today\'s Tvaroženský potok, Roketnice, Říčka (OSM)</tspan></text>';
s+='<text x="'+ox+'" y="'+(oy+370*sc+34)+'" font-size="11">map units (1 unit = '+(GR.KM_PER_MAP*1000).toFixed(1)+' m), the map\'s frame ('+GR.ROT_DEG.toFixed(1)+'° off true north)</text>';
s+='</svg>';
fs.writeFileSync(path.join(EV,"fig-relief-banks.svg"),s); console.log("wrote fig-relief-banks.svg", s.length, "bytes");
