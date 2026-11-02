#!/usr/bin/env node
/* Final audit after Stage 8, area visual-landscape: where the villages' trees stand (world.js woodsPlan, "a village's trees and orchards, round
   it") against the meres' water class (world.js coverClass's pond ellipses, SATS and MENI). Re-runs the planner's own arithmetic in node from the
   source files (geo.js, world.js's VILLAGES, WOODS_RS.villages, W, the pond constants): read-only, nothing of the application changed.
   usage: node village-trees.js <repo-root> [out.json] */
"use strict";
const fs=require("fs"), vm=require("vm"), path=require("path");
const R=path.resolve(process.argv[2]||"."), OUT=process.argv[3];
const geo=fs.readFileSync(path.join(R,"geo.js"),"utf8"), world=fs.readFileSync(path.join(R,"world.js"),"utf8");
const ctx={console}; vm.createContext(ctx); vm.runInContext(geo,ctx);
const grab=re=>{ const m=world.match(re); if(!m) throw new Error("not found: "+re); return m[0]; };
vm.runInContext(grab(/function W\(mx,my\)\{[^\n]*\}/),ctx);
vm.runInContext(grab(/var VILLAGES=\[[\s\S]*?\n\];/),ctx);
vm.runInContext(grab(/var WOODS_RS=\{[\s\S]*?\};/),ctx);
const sats=world.match(/SATS=W\((\d+),(\d+)\), MENI=W\((\d+),(\d+)\)/); if(!sats) throw new Error("pond centres not found");
const SATS=ctx.W(+sats[1],+sats[2]), MENI=ctx.W(+sats[3],+sats[4]);
const ss=(a,b,x)=>{ const t=Math.max(0,Math.min(1,(x-a)/(b-a))); return t*t*(3-2*t); };
const pond=(x,z,c,rx,rz)=>1-ss(0.55,1.08,Math.sqrt(((x-c[0])/rx)**2+((z-c[1])/rz)**2));
/* the villages' trees, as woodsPlan draws them (its loop copied: the same seed, the same draws, in the same order) */
let seed=ctx.WOODS_RS.villages; const rnd=()=>{ seed=(seed*1664525+1013904223)%4294967296; return seed/4294967296; };
const trees=[];
ctx.VILLAGES.forEach(v=>{ if(v[3]<7) return; const cc=ctx.W(v[1],v[2]), Rr=2.6+v[3]*0.46;
  for(let i=0;i<Math.round(v[3]*1.1);i++){ const a=rnd()*Math.PI*2, r=Rr*(1.05+rnd()*0.45), x=cc[0]+Math.cos(a)*r, z=cc[1]+Math.sin(a)*r*0.75; rnd(); /* the scale's draw */
    const pS=pond(x,z,SATS,28,10.5), pM=pond(x,z,MENI,23,9);
    trees.push({village:v[0], x:+x.toFixed(3), z:+z.toFixed(3), pondS:+pS.toFixed(3), pondM:+pM.toFixed(3), water:(pS>0.5||pM>0.5)}); } });
const wet=trees.filter(t=>t.water);
const res={about:"villages' trees (woodsPlan) inside the meres' water class (coverClass: pond > 0.5)", total:trees.length, onWater:wet.length,
  byVillage:wet.reduce((o,t)=>(o[t.village]=(o[t.village]||0)+1,o),{}), wet};
console.log(JSON.stringify({total:res.total,onWater:res.onWater,byVillage:res.byVillage}));
wet.forEach(t=>console.log(" ",t.village,t.x,t.z,"pondS",t.pondS,"pondM",t.pondM));
if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
