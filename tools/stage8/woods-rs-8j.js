#!/usr/bin/env node
/* Stage 8, the follow-up 8J: the woods' random sequence in woodsPlan as a tree's world.js draws it, read in node (no page): the seed at each wood's
   start and end with its centre and the trees it drew, the villages' trees' start and the sequence's end. Run on 8H's tree it gives world.js's
   WOODS_RS (the states a kept wood and the villages' trees start from again); run on a later tree it shows each kept wood starting and ending
   at 8H's states, so that its trees, the villages' trees and the buildings' plans are 8H's.
   node tools/stage8/woods-rs-8j.js [<tree, default this one>]   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), ROOT=path.resolve(process.argv[2]||path.join(__dirname,"..",".."));
global.GEOREF=require(path.join(ROOT,"geo.js")); global.THREE=require(path.join(__dirname,"..","..","node_modules","three"));
for(const f of ["data.js","analysis.js","tokens.js","world.js"]) (0,eval)(fs.readFileSync(path.join(ROOT,f),"utf8"));
buildCover(); buildCoverMl(); if(typeof buildGrid==="function") buildGrid();
let seed=77; const rnd=()=>{ seed=(seed*1664525+1013904223)%4294967296; return seed/4294967296; };
const RS=typeof WOODS_RS!=="undefined"?WOODS_RS:null, out={tree:ROOT, woods:[]};
WOODS.forEach(function(wd){ if(RS&&RS[wd.c[0]+","+wd.c[1]]!==undefined) seed=RS[wd.c[0]+","+wd.c[1]];
  const s0=seed, c=W(wd.c[0],wd.c[1]), pw=wd.poly?polyWorld(wd):null; let guard=0, got=0;
  for(let i=0;i<wd.n;i++){ const u=rnd()*2-1, v=rnd()*2-1; let x,z;
    if(pw){ x=(pw.box[0]+pw.box[2])/2+u*(pw.box[2]-pw.box[0])/2; z=(pw.box[1]+pw.box[3])/2+v*(pw.box[3]-pw.box[1])/2; } else { x=c[0]+u*wd.rx*0.5; z=c[1]+v*wd.ry*0.5; }
    if((pw?!inPolyW(x,z,pw):u*u+v*v>1)||drawnCover(x,z)!==4){ if(++guard<wd.n*20){ i--; } continue; }
    rnd(); rnd(); got++; }
  out.woods.push({c:wd.c, n:wd.n, start:s0, end:seed, got:got}); });
if(RS) seed=RS.villages; out.villages=seed;
VILLAGES.forEach(function(v){ if(v[3]<7) return; for(let i=0;i<Math.round(v[3]*1.1);i++){ rnd(); rnd(); rnd(); } });
out.end=seed;
console.log(JSON.stringify(out,null,1));
