/* The final audits' Stage 4, WP-04b (owner decision 293 (a)'s cause): the ground under the gait's cases on two trees' relief, the formations'
   places the first tree's (WP-04b moves none). (a) The self-test's worst poses' formations at their clocks (the gait check's "where"): the height
   and the slope at the formation's centre and the steepest within 2 world units. (b) The self-test's fresh states (09:05, 10:40, 13:50, every
   placed formation): each whose steepest ground within 0.25 km changed by 1 degree or more, or whose centre's height by 5 m or more. (c) Around
   the fresh cases' worst formations, the largest height change and the steepest ground within 0.25, 0.5 and 0.75 km.
     node tools/final-stage4-wp04b/gait-ground.js BASEROOT CANDROOT
   Each tree with node_modules, _world_mod.js and _clock.js (node tools/mk-world-mod.js; node tools/mk-helpers.js). Measurement code only. */
"use strict";
const path=require("path");
const [BASE,CAND]=process.argv.slice(2).map(a=>path.resolve(a));
process.env.ISO=BASE;
require(path.join(BASE,"tools","audit-post8","history","load.js")).load({state:true});
const L=require(path.join(BASE,"tools","audit-post8","geography","lib.js"));
const A=L.load(BASE,{clock:false}), B=L.load(CAND,{clock:false});
const hm=(G,x,z)=>G.GEOREF.elevM(G.height(x,z));
function slope(G,x,z){ const e=0.05, dx=(hm(G,x+e,z)-hm(G,x-e,z))/(2*e), dz=(hm(G,x,z+e)-hm(G,x,z-e))/(2*e); return Math.atan(Math.hypot(dx,dz)/G.GEOREF.M_PER_WORLD)*180/Math.PI; }
function steep(G,w,r,na,nk){ let mx=0; for(let a=0;a<na;a++) for(let k=0;k<=nk;k++){ const x=w[0]+r*k/nk*Math.cos(a*2*Math.PI/na), z=w[1]+r*k/nk*Math.sin(a*2*Math.PI/na); mx=Math.max(mx,slope(G,x,z)); } return mx; }
const at=s=>{ const [h,m]=s.split(":").map(Number); return h*60+m; }, U=A.GEOREF.UNITS_PER_KM;
console.log("(a) the worst poses' formations (centre: height, slope; the steepest within 2 units), "+BASE+" -> "+CAND);
[["c_gren","09:05"],["gqg","09:05"],["sthilaire","13:50"],["sthilaire","13:58"],["vandamme","13:52"],["gqg","13:57"],["drouet","08:46"],["rg_inf","10:54"]].forEach(([id,t])=>{
  clock=at(t); const p=posNow(id); if(!p){ console.log("  "+id+" "+t+": not placed"); return; } const w=A.W(p[0],p[1]);
  console.log(`  ${id} ${t} map [${p[0].toFixed(0)},${p[1].toFixed(0)}]: height ${hm(A,w[0],w[1]).toFixed(1)} -> ${hm(B,w[0],w[1]).toFixed(1)} m; slope ${slope(A,w[0],w[1]).toFixed(2)} -> ${slope(B,w[0],w[1]).toFixed(2)} deg; steepest within 2 units ${steep(A,w,2,16,3).toFixed(2)} -> ${steep(B,w,2,16,3).toFixed(2)} deg`); });
console.log("(b) the fresh states: the formations on ground changed");
const ids=Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].track);
[545,640,830].forEach(t=>{ clock=t; const rows=[]; let n=0;
  ids.forEach(id=>{ const p=posNow(id); if(!p) return; n++; const w=A.W(p[0],p[1]), a=steep(A,w,0.25*U,24,4), b=steep(B,w,0.25*U,24,4), dh=hm(B,w[0],w[1])-hm(A,w[0],w[1]);
    if(Math.abs(b-a)>=1||Math.abs(dh)>=5) rows.push(`${id} ${a.toFixed(1)}->${b.toFixed(1)} deg, ${dh>=0?"+":""}${dh.toFixed(0)} m`); });
  console.log("  "+fmtClock(t)+": "+n+" placed, "+rows.length+" on ground changed (the steepest within 0.25 km by 1 degree or more, or the centre by 5 m or more): "+rows.join("; ")); });
console.log("(c) around the fresh cases' worst formations");
[["c_gren","09:05"],["gqg","09:05"]].forEach(([id,t])=>{ clock=at(t); const p=posNow(id), w=A.W(p[0],p[1]);
  [0.25,0.5,0.75].forEach(rk=>{ const r=rk*U; let dh=0, sa=0, sb=0;
    for(let a=0;a<32;a++) for(let k=1;k<=6;k++){ const x=w[0]+r*k/6*Math.cos(a*Math.PI/16), z=w[1]+r*k/6*Math.sin(a*Math.PI/16); dh=Math.max(dh,Math.abs(hm(B,x,z)-hm(A,x,z))); sa=Math.max(sa,slope(A,x,z)); sb=Math.max(sb,slope(B,x,z)); }
    console.log(`  ${id} ${t} within ${rk} km: the largest height change ${dh.toFixed(1)} m; the steepest ${sa.toFixed(2)} -> ${sb.toFixed(2)} deg`); }); });
