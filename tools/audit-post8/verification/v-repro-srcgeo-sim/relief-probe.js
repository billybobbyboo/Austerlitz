/* v-repro-srcgeo-sim: independent probe of geography #0. Loads geo.js, data.js, analysis.js, appearance.js, tokens.js and world.js
   (read only, in a vm context, on three r128 from node_modules) and prints the relief model's metres (GEOREF.elevM(hAt(map))) with each
   point's WGS84 position, for a DEM query made separately. Writes only to the path given as argv[3].
   Usage: node relief-probe.js <ROOT> <out.json> */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=process.argv[2]||"/home/user/Austerlitz", OUT=process.argv[3];
const sb={console, Math, Float32Array, Float64Array, Uint8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Array, Object, JSON, isFinite,
  parseFloat, parseInt, Number, String, Date, Map, Set, RegExp, Error, Symbol, performance:{now:()=>Date.now()}};
sb.window={}; sb.THREE=require(path.join(ROOT,"node_modules","three"));
vm.createContext(sb);
for(const f of ["geo.js","data.js","analysis.js","appearance.js","tokens.js","world.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT,f),"utf8"),sb,{filename:f});
const G=vm.runInContext("GEOREF",sb), hAt=vm.runInContext("hAt",sb);
const pts=[];
function add(name,mx,my,extra){ const ll=G.toGeo(mx,my); pts.push(Object.assign({name,map:[+mx.toFixed(2),+my.toFixed(2)],lat:+ll[0].toFixed(6),lon:+ll[1].toFixed(6),model:+G.elevM(hAt(mx,my)).toFixed(1)},extra||{})); }
/* controls: the GT summits and villages with a sourced elevation */
for(const k of Object.keys(G.GT)){ const g=G.GT[k]; if(g.offmap) continue; add("GT."+k,g.map[0],g.map[1],{gtElev:g.elev||null}); }
/* the finding's southern box, map x 270-330, y 295-350: a 4 x 4 grid of cell centres (my own grid, not the area's 6 x 6) */
for(let i=0;i<4;i++) for(let j=0;j<4;j++) add("box",270+7.5+15*i,295+6.875+13.75*j);
/* the finding's two proposed anchors */
add("anchor?288,311",288,311); add("anchor?297,328",297,328);
/* Pratzeberg -> Augezd profile, 9 points */
const A=G.GT.pratzeberg.map, B=G.GT.augezd.map; for(let t=0;t<=8;t++) add("prof.pberg-augezd."+t,A[0]+(B[0]-A[0])*t/8,A[1]+(B[1]-A[1])*t/8);
/* Sokolnitz -> Hostieradek profile, 9 points */
const C=G.GT.sokolnitz.map, D=G.GT.hostieradek.map; for(let t=0;t<=8;t++) add("prof.sok-host."+t,C[0]+(D[0]-C[0])*t/8,C[1]+(D[1]-C[1])*t/8);
console.log("fog top m (knowledge model 238.2):", "n/a here");
fs.writeFileSync(OUT,JSON.stringify({G:{K:G.K, V:6.12, DATUM:243.1},pts},null,1));
console.log(pts.length,"points; e.g.", JSON.stringify(pts.slice(0,3)));
