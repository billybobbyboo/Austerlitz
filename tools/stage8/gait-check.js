#!/usr/bin/env node
/* Stage 8 Part A (docs/STAGE8_SPEC.md section 4.3): the gait prototype's rule checked, not looked at. With "f-gait" installed (Saint-Hilaire's
   division, Nansouty's, the guns on the heights), for each formation:
   - scrubbing: the phase and amplitude at a clock reached from three different earlier clocks are identical (the pose is the clock's);
   - paused: with the clock standing (Play off), real time passing and frames drawn, the phase does not change;
   - halted: at a clock where the formation's leg is not in progress (marchRate's moving false) the amplitude is 0;
   - reduced motion: with RM set the amplitude is 0 at a clock where it was not;
   - fast play: the amplitude at the play speeds ½x, 1x, 2x and 4x (the fade above 3.2 cycles a second on screen);
   - and the cycles a second each speed stands for at the moving clock.
   node tools/stage8/gait-check.js [--json file]   Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), FIG=require("./protos/figures.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const JSONF=opt("--json");
(async()=>{
  const browser=await L.launch(), page=await L.open(browser,[1280,720]);
  await L.inject(page,FIG.inPage);
  await L.applyCase(page,{viewport:[1280,720], t:530, presentation:"watch", mode:"terrain", cam:[-195,92,156,-33,4,-2]});
  await page.evaluate(()=>{ window.loop=function(){}; window.__p8["f-gait"].install(); });
  const R=await page.evaluate(()=>{
    var F=window.__f8, out={};
    /* a formation's gait as its drawn movers carry it: the first material of its that is not the deployed battery's crew or team (hidden
       while the battery moves) */
    function read(id){ F.gaitUpdate(); var r=F.recs.filter(function(q){ return q.id===id&&!q.crew&&!q.deployed; })[0]; return r?{phase:+r.U.uPhase.value.toFixed(6), amp:+r.U.uAmp.value.toFixed(4)}:null; }
    function at(t){ setClock(t,{instant:true,force:true,camera:false}); updateVisibility(); }
    /* the moving clock of each formation: its first leg after 08:00 longer than 4 minutes, at its middle */
    ["sthilaire","nansouty","heightguns"].forEach(function(id){
      var A=anchorList(id), w=null; for(var i=1;i<A.length;i++){ var a=A[i-1], b=A[i]; if(!a.p||!b.p) continue; var ww=legWindow(a,b); if(ww[1]>480&&ww[1]-ww[0]>4){ w=ww; break; } }
      var O=out[id]={leg:w}; if(!w) return;
      var tm=(w[0]+w[1])/2, starts=[tm-30,tm+40,w[0]-60];
      F.rate=null; playing=false;
      O.scrub=starts.map(function(t0){ at(t0); at(tm); return read(id); });
      O.scrubSame=O.scrub.every(function(q){ return q.phase===O.scrub[0].phase&&q.amp===O.scrub[0].amp; });
      /* paused: real time passes, frames are drawn, the clock stands */
      var p0=read(id); var t1=performance.now(); while(performance.now()-t1<300){ updateVisibility(); } var p1=read(id); O.paused={before:p0, after:p1, same:p0.phase===p1.phase};
      /* halted: a clock with no leg in progress (before the leg, at least 20 minutes) */
      at(w[0]-20); var mr=marchRate(id,clock); O.halted={moving:!!(mr&&mr.moving), amp:read(id).amp};
      /* reduced motion */
      at(tm); var a0=read(id).amp; RM=true; var a1=read(id).amp; RM=false; O.reducedMotion={amp:a0, ampRM:a1};
      /* the play speeds */
      O.speeds={}; [0.5,1,2,4].forEach(function(s){ F.rate=MIN_PER_SEC*s/60; at(tm); var q=read(id); O.speeds[s+"x"]={amp:q.amp, cyclesPerSecond:F.hz[id]}; }); F.rate=null;
    });
    return out; });
  await browser.close();
  console.log(JSON.stringify(R,null,1));
  if(JSONF){ fs.mkdirSync(path.dirname(JSONF),{recursive:true}); fs.writeFileSync(JSONF,JSON.stringify(R,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
