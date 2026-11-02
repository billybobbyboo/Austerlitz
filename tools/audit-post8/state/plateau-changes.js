/* audit-post8 (state): every change of the plateau holding (plateauStrength('al')) over the day at 1/8 minute, with the thousand paintSituation's
   caption key rounds it to (app.js paintSituation: Math.round(onH/1000)), to see whether a change can leave the exact figure shown stale.
   Usage: node plateau-changes.js <iso-root>   (read-only; the generated helper modules must be current) */
const fs=require('fs'); const ISO=process.argv[2]; process.chdir(ISO);
const M=require(ISO+'/_world_mod.js');
global.W=M.W; global.height=M.height; global.hAt=M.hAt; global.smoothstep=M.smoothstep;
global.covAt=M.covAt; global.SATS=M.SATS; global.MENI=M.MENI; global.VILLAGES=M.VILLAGES; M.buildCover(); M.buildGrid();
Object.defineProperty(global,'covWater',{get:()=>M.covWater}); Object.defineProperty(global,'covRoad',{get:()=>M.covRoad}); Object.defineProperty(global,'covMarsh',{get:()=>M.covMarsh});
eval(fs.readFileSync('data.js','utf8')); eval(fs.readFileSync('analysis.js','utf8')); eval(fs.readFileSync('_clock.js','utf8'));
global.units={}; Object.keys(FORMATIONS).forEach(id=>{ if(FORMATIONS[id].track) units[id]={}; });
eval(fs.readFileSync('_state.js','utf8')); eval(fs.readFileSync('_derived.js','utf8')); eval(fs.readFileSync('_events.js','utf8'));
let prev=null; for(let t=T_MIN;t<=T_MAX;t+=1/8){ clock=t; const a=plateauStrength('al'); if(prev!==null&&a!==prev) console.log(fmtClock(t),t.toFixed(3),'phase',phaseAt(t),prev,'->',a,'round(k)',Math.round(prev/1000),'->',Math.round(a/1000)); prev=a; }
