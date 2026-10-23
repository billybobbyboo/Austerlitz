#!/usr/bin/env node
/* Stage 8 Part A (docs/STAGE8_SPEC.md section 4.3): every leg of every tracked formation as the clock moves it (the model's own anchorList,
   legWindow and legPath, from the generated _clock.js the suites read), with its duration and its modelled speed. A gait shows marching only
   where a formation marches: a leg spread over hours at a crawl (no departure time, the move interpolated across the whole interval) is not a
   march, and the gait's rule has to say what it draws there. No page; measurement only.
   node tools/stage8/legs.js [--json file] */
"use strict";
const fs=require("fs"), path=require("path");
process.chdir(path.join(__dirname,"..",".."));
require("../fresh.js").regen("world","helpers");
const M=require(path.join(process.cwd(),"_world_mod.js"));
global.W=M.W; global.height=M.height; global.hAt=M.hAt; global.smoothstep=M.smoothstep;
global.covAt=M.covAt; global.SATS=M.SATS; global.MENI=M.MENI; global.VILLAGES=M.VILLAGES;
M.buildCover(); M.buildGrid();
Object.defineProperty(global,"covWater",{get:()=>M.covWater}); Object.defineProperty(global,"covRoad",{get:()=>M.covRoad}); Object.defineProperty(global,"covMarsh",{get:()=>M.covMarsh});
(0,eval)(fs.readFileSync("geo.js","utf8")+"\n;"+fs.readFileSync("data.js","utf8")+"\n;"+fs.readFileSync("_clock.js","utf8")+"\n;global.__L={FORMATIONS,PHASES,anchorList,legWindow,legPath,KM_PER_MAP,fmtClock};");
const {FORMATIONS,anchorList,legWindow,legPath,KM_PER_MAP,fmtClock}=global.__L;
const argv=process.argv.slice(2), JSONF=argv.includes("--json")?argv[argv.indexOf("--json")+1]:null;
const legs=[];
Object.keys(FORMATIONS).forEach(id=>{ const f=FORMATIONS[id]; if(!f.track) return; const A=anchorList(id);
  for(let i=1;i<A.length;i++){ const a=A[i-1], b=A[i]; if(!a.p||!b.p) continue; const w=legWindow(a,b), len=legPath(a,b).len, km=len*KM_PER_MAP, min=w[1]-w[0];
    if(km<0.05) continue; legs.push({id, arm:f.arm, from:fmtClock(w[0]), to:fmtClock(w[1]), minutes:+min.toFixed(1), km:+km.toFixed(2), kmh:+(km/(min/60)).toFixed(2), timed:!!b.tm}); } });
const slow=legs.filter(l=>l.kmh<1.0), long=legs.filter(l=>l.minutes>=120&&l.kmh<1.0);
const out={legs:legs.length, under1kmh:slow.length, under1kmhOver2h:long.length, slow:slow.sort((x,y)=>x.kmh-y.kmh)};
console.log("legs",out.legs,"under 1 km/h",out.under1kmh,"of which 2 h or more",out.under1kmhOver2h);
slow.slice(0,40).forEach(l=>console.log(l.id.padEnd(12),l.arm.padEnd(6),l.from,"-",l.to,String(l.minutes).padStart(6),"min",String(l.km).padStart(5),"km",String(l.kmh).padStart(5),"km/h",l.timed?"timed":""));
if(JSONF) fs.writeFileSync(JSONF,JSON.stringify(out,null,1));
