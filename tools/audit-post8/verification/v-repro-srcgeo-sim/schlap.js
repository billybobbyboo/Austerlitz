/* v-repro-srcgeo-sim: the Slapanice bump (world.js:289) evaluated at GT.schlapanitz, read only: node schlap.js */
const fs=require("fs"),path=require("path"),vm=require("vm"),ROOT="/home/user/Austerlitz";
const sb={console,Math,Float32Array,Float64Array,Uint8Array,Uint16Array,Int16Array,Uint32Array,Int32Array,Array,Object,JSON,isFinite,parseFloat,parseInt,Number,String,Date,Map,Set,RegExp,Error,Symbol,performance:{now:()=>Date.now()}};
sb.window={}; sb.THREE=require(path.join(ROOT,"node_modules","three")); vm.createContext(sb);
for(const f of ["geo.js","data.js","analysis.js","appearance.js","tokens.js","world.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT,f),"utf8"),sb,{filename:f});
console.log(vm.runInContext("var g=GEOREF.GT.schlapanitz.map, w=W(g[0],g[1]); JSON.stringify({bumpUnits:bump(w[0],w[1],SCHLAP,15,9,3.0,0.36), metresAfterX1_2:+(bump(w[0],w[1],SCHLAP,15,9,3.0,0.36)*1.2*GEOREF.V_M_PER_UNIT||bump(w[0],w[1],SCHLAP,15,9,3.0,0.36)*1.2*6.12).toFixed(1), model:+GEOREF.elevM(hAt(g[0],g[1])).toFixed(1)})",sb));
