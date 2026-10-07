const fs=require('fs');
require('./tools/fresh.js').regen('world','helpers');   /* roadmap step 1 (docs/FINAL_AUDIT.md T-9): the generated modules read below are regenerated from the live sources first, also when this suite runs on its own */
const M=require('./_world_mod.js');
global.W=M.W; global.height=M.height; global.hAt=M.hAt; global.smoothstep=M.smoothstep;
global.covAt=M.covAt; global.SATS=M.SATS; global.MENI=M.MENI; global.VILLAGES=M.VILLAGES;
M.buildCover(); M.buildGrid();
Object.defineProperty(global,'covWater',{get:()=>M.covWater});
Object.defineProperty(global,'covRoad',{get:()=>M.covRoad});
Object.defineProperty(global,'covMarsh',{get:()=>M.covMarsh});
eval(fs.readFileSync('data.js','utf8'));
eval(fs.readFileSync('analysis.js','utf8'));
global.leavesOf=function(id,out){out=out||[];const f=FORMATIONS[id];if(f.track)out.push(id);
  if(f.children)f.children.forEach(k=>leavesOf(k,out));return out;};
eval(fs.readFileSync('_clock.js','utf8'));

console.log("battle clock:",fmtClock(T_MIN),"to",fmtClock(T_MAX),
            "("+(T_MAX-T_MIN)+" minutes across "+PHASES.length+" phases)\n");

const probs=auditMovement();
const rate=probs.filter(p=>p.why==="rate"), terr=probs.filter(p=>p.why!=="rate");
console.log("=== MARCH RATE VIOLATIONS ("+rate.length+") ===");
rate.sort((a,b)=>b.kmh-a.kmh).forEach(p=>console.log(
  "  "+p.id.padEnd(13),p.leg.padEnd(7),p.km.toFixed(2)+" km /",String(Math.round(p.min)).padStart(4)+" min =",
  p.kmh.toFixed(1)+" km/h  (ceiling "+p.ceil+")"));
console.log("\n=== TERRAIN VIOLATIONS ("+terr.length+") ===");
terr.forEach(p=>console.log("  "+p.id.padEnd(13),p.leg.padEnd(7),p.why,
  "at ["+p.at.map(v=>Math.round(v)).join(",")+"]"));

/* continuity: sample the clock every 5 minutes and look for jumps */
console.log("\n=== CONTINUITY (max displacement in any 5-minute step) ===");
let worst=[];
Object.keys(FORMATIONS).forEach(id=>{
  if(!FORMATIONS[id].track) return;
  let mx=0, at=0, prev=null;
  for(let t=T_MIN;t<=T_MAX;t+=5){
    const p=goneAt(id,t)?null:posAtClock(id,t);
    if(p&&prev){ const d=Math.hypot(p[0]-prev[0],p[1]-prev[1]); if(d>mx){mx=d;at=t;} }
    prev=p;
  }
  worst.push({id,km:mx*KM_PER_MAP,at});
});
worst.sort((a,b)=>b.km-a.km).slice(0,6).forEach(w=>
  console.log("  "+w.id.padEnd(13),(w.km*1000).toFixed(0).padStart(4)+" m per 5 min at "+fmtClock(w.at),
              "= "+(w.km*12).toFixed(1)+" km/h"));

/* coverage */
let anchored=0, total=0;
Object.keys(FORMATIONS).forEach(id=>{ if(FORMATIONS[id].track){ total++; if(anchorList(id).length>1) anchored++; } });
console.log("\nformations with tracks:",total," moving:",anchored);
