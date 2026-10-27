#!/usr/bin/env node
/* Stage 8, implementation PR 8E (decision 242 (a); docs/STAGE8_SPEC.md section 17): does the troops' per-frame work allocate while only the eye
   moves? On a page opened as the harness opens it (?harness=1, 1600 x 900), at a still clock with formations marching (the gait drawn, paused:
   its full pose held) in the low Pratzen view, the eye is orbited about its target in N small steps, each step's blocks posed, seated, given
   their level of detail and their gait (updateVisibility, the app's own: the work a frame does before it draws), with Chrome's sampling heap
   profiler on (CDP HeapProfiler.startSampling, every 16 bytes on average); then the profile's allocations are attributed to the functions on
   their stacks. Reported: the bytes sampled under each of 8E's per-frame functions (kitLodFrame, kitLod, kitLodSet, gaitStep, gaitFastest,
   gaitLegOf, gaitDistOf, gaitRoll, clockRate, enemyFacing, faceClock, layoutFigs, and the slopes) and under updateVisibility in all, per step;
   the same on the 8D build for updateVisibility and enemyFacing. A sampled profile can miss a rare small allocation; it cannot invent one.
   --warm W: W steps of the same orbit before the profiler starts, so that what V8 allocates while it first runs and compiles the functions
   is not counted as a frame's (a run from the first step reports both together: the total of a one-time allocation stays the same however
   many steps follow it, a frame's grows with them).
   node tools/stage8/alloc-8e.js <8D build.html> <8E build.html> [--steps 300] [--warm 0] [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), STEPS=+(opt("--steps")||300), WARM=+(opt("--warm")||0), BUILDS=argv.filter((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json");
const FNS=["kitLodFrame","kitLod","kitLodSet","gaitStep","gaitFastest","gaitLegOf","gaitDistOf","gaitRoll","clockRate","enemyFacing","faceClock","layoutFigs","slopes"];
(async()=>{
  const browser=await L.launch(), res={steps:STEPS, warm:WARM, chromium:browser.version(), builds:{}};
  /* in the page: n steps of an orbit about the target, each step's blocks posed, seated, given their level of detail and their gait */
  const ORBIT=n=>{ var O=window.__orb, d=O.p.clone().sub(O.c), r=Math.hypot(d.x,d.z), a0=Math.atan2(d.z,d.x), t0=performance.now();
      for(var i=0;i<n;i++){ var a=a0+0.6*Math.sin(i/n*2*Math.PI); landCam.position.set(O.c.x+r*Math.cos(a),O.p.y,O.c.z+r*Math.sin(a)); landCam.lookAt(O.c); landCam.updateMatrixWorld(); updateVisibility(); }
      var rich=0; Object.keys(units).forEach(function(id){ var u=units[id].block&&units[id].block.userData; if(u&&u.lodRich) rich++; });
      return {ms:Math.round(performance.now()-t0), rich:rich, lodSwitches:typeof KLOD!=="undefined"?KLOD.n:null}; };
  for(const b of BUILDS){
    process.env.AUSTERLITZ_HTML=path.resolve(b);
    const md5=crypto.createHash("md5").update(fs.readFileSync(b)).digest("hex");
    const page=await L.open(browser,[1600,900],{}); await page.evaluate(()=>closeFirst(null));
    const st=await page.evaluate(()=>{ window.__aus.apply({t:545,presentation:"watch",mode:"terrain",aim:{map:[285,289],dir:[-1.0,0.13,0.18],r:70}}); AUSTERLITZ_DEBUG.settle(40);
      var a=0, r=0; Object.keys(units).forEach(function(id){ var u=units[id].block&&units[id].block.userData; if(u&&u.gait&&u.gait.amp>0) a++; if(u&&u.lodRich) r++; });
      window.__orb={c:orbitTarget.clone(), p:landCam.position.clone()}; return {clock:fmtClock(clock), animated:a, rich:r}; });
    const cdp=await page.context().newCDPSession(page);
    if(WARM>0) await page.evaluate(ORBIT,WARM);   /* the warm-up, unsampled */
    await cdp.send("HeapProfiler.enable"); await cdp.send("HeapProfiler.collectGarbage");
    await cdp.send("HeapProfiler.startSampling",{samplingInterval:16});
    const ran=await page.evaluate(ORBIT,STEPS);
    const prof=(await cdp.send("HeapProfiler.stopSampling")).profile;
    await page.close();
    /* each sample's stack: the bytes under each function (counted once per stack, however often it recurs) and in all */
    const by={}, total={all:0, uv:0}; FNS.forEach(f=>by[f]=0);
    const walk=(n,stack)=>{ const fn=n.callFrame.functionName||"(anonymous)", s2=stack.concat([fn]), self=n.selfSize||0;
      if(self){ total.all+=self; if(s2.includes("updateVisibility")) total.uv+=self; const seen=new Set(); s2.forEach(f=>{ if(by[f]!==undefined&&!seen.has(f)){ by[f]+=self; seen.add(f); } }); }
      (n.children||[]).forEach(c=>walk(c,s2)); };
    walk(prof.head,[]);
    const per=x=>+(x/STEPS).toFixed(1);
    const R={md5:md5, state:st, ran:ran, bytesPerStep:{updateVisibility:per(total.uv)}, fns:{}};
    FNS.forEach(f=>{ R.fns[f]=per(by[f]); });
    res.builds[md5]=R;
    console.log(md5.slice(0,8)+" "+JSON.stringify(st)+" "+(WARM?WARM+" steps unsampled, then ":"")+STEPS+" steps of the eye in "+ran.ms+" ms (level-of-detail switches so far "+ran.lodSwitches+"): updateVisibility "+per(total.uv)+" bytes a step; "+
      FNS.filter(f=>by[f]>0).map(f=>f+" "+per(by[f])).join(", ")+(FNS.some(f=>by[f]>0)?"":" none under 8E's functions"));
    if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(path.resolve(OUT),JSON.stringify(res,null,1)); }
  }
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
