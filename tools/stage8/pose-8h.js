#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md section 20.4): a block's own pose at a pause, a seek and a resume (8F's finding, section
   18.10 item 2: a block still wheeling when the clock stops keeps turning at its arm's rate, WHEEL), on any build, each page opened as the
   harness opens it and driven through the app's own loop on a clock of the driver's (tools/visual/motion.js, 30 frames a second, the WebGL draw
   skipped: every value read is the app's state), Play, the speed and Pause by real clicks:
   - Play at 4x from 08:40 until a shown block stands more than 0.3 rad from the heading it turns to (its turn, the formation model's ease), then
     Pause: over 60 paused frames, each asked for, every shown block's pose (its heading, its shape, its standards' dip, its quaternion), and the
     frames in which any of it moved; then the frames the loop draws unasked until render on demand goes idle (a block easing keeps it active;
     so does the phase change's own fade, a tween of real time);
   - a seek while paused (the next-ten-minutes button, a real click): each shown block's pose one frame after it, against the same clock reached
     by another path (twenty-three minutes earlier first, then to it): the largest difference;
   - Resume (Play at 4x, a real click): the turning block's distance from its heading over five frames (it turns on from where it was held).
   node tools/stage8/pose-8h.js --builds 8g=<html>,8h=<html> [--out file.json]
   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), MD=require("../visual/motion.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const BUILDS=(opt("--builds")||("now="+path.join(L.ROOT,"austerlitz-command-map.html"))).split(",").map(s=>{ const i=s.indexOf("="); return {tag:s.slice(0,i), file:path.resolve(s.slice(i+1))}; });
const OUT=opt("--out");
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
/* in the page: every shown block's pose */
const POSES=function(){ var o={}; Object.keys(units).forEach(function(id){ var r=units[id], b=r.block, u=b.userData; if(!b.visible||!u||!u.body) return;
  var want=headingAt(id,clock); if(want===null) want=enemyFacing(id);
  var d=want==null?0:want-(r.yaw||0); while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI;
  o[id]=[r.yaw||0,u.sw,u.sd,u.tilt||0,b.quaternion.x,b.quaternion.y,b.quaternion.z,b.quaternion.w,Math.abs(d)]; }); return o; };
const FR=function(n){ var D=window.__md; for(var i=0;i<n;i++){ requestRender(2); D.frame(1); } return {clock:clock, playing:playing, state:frameState(performance.now()+1)}; };
function maxDiff(a,b,k){ let m=0, at=null; Object.keys(a).forEach(id=>{ if(!b[id]) return; for(let i=0;i<(k||8);i++){ const d=Math.abs(a[id][i]-b[id][i]); if(d>m){ m=d; at=id; } } }); return {max:m, id:at}; }
(async()=>{
  const browser=await L.launch(), out={tool:"tools/stage8/pose-8h.js", browser:browser.version(), builds:{}};
  for(const B of BUILDS){
    process.env.AUSTERLITZ_HTML=B.file;
    const page=await L.open(browser,[1280,720]); await page.evaluate(MD.inPage);
    await page.evaluate(()=>{ closeFirst(null); if(playing) stopPlay(); dwellSet(false); setClock(520,{instant:true,force:true}); AUSTERLITZ_DEBUG.settle(40,true);
      window.__md.start({gl:false}); lastFrame=performance.now(); });
    await page.click('.spd-btn[data-s="4"]'); await page.click("#play");
    /* play until a shown block turns more than 0.3 rad from its heading */
    let turn=null, k=0;
    while(!turn&&k<900){ await page.evaluate(FR,1); k++;
      const P=await page.evaluate(POSES); for(const id of Object.keys(P)) if(P[id][8]>0.3){ turn={id:id, d:+P[id][8].toFixed(4), frame:k}; break; } }
    const R={file:path.relative(L.ROOT,B.file), md5:md5(B.file), turn:turn};
    if(turn){
      const last=await page.evaluate(POSES), cl=await page.evaluate(()=>clock);
      await page.click("#play");   /* Pause */
      const P0=await page.evaluate(POSES); let moved=0, maxMove=0, turned=0, st=null;
      for(let i=0;i<60;i++){ st=await page.evaluate(FR,1); const P=await page.evaluate(POSES), m=maxDiff(P0,P); if(m.max>1e-12) moved++; maxMove=Math.max(maxMove,m.max);
        if(P[turn.id]&&P0[turn.id]) turned=Math.max(turned,Math.abs(P[turn.id][0]-P0[turn.id][0])); }
      /* render on demand, unasked: three frames with none requested by the probe, then the loop's own state (a block still easing keeps it active) */
      const idle=await page.evaluate(()=>{ var D=window.__md, n=0; while(n<600&&frameState(performance.now()+1)!=="idle"){ D.frame(1); n++; } return {state:frameState(performance.now()+1), settling:settling, framesToIdle:n}; });
      R.pause={clock:+cl.toFixed(3), pausedFramesMoved:moved, of:60, largestMove:+maxMove.toFixed(6), turningBlockTurned:+turned.toFixed(6), stateAfter:idle.state, settlingAfter:idle.settling, unaskedFramesToIdle:idle.framesToIdle,
        firstPausedAgainstLastPlayed:maxDiff(last,P0).max};
      /* a seek while paused, against the same clock reached by another path */
      await page.click("#next"); await page.evaluate(FR,1); const S1=await page.evaluate(POSES), c1=await page.evaluate(()=>clock);
      await page.evaluate(c=>{ setClock(c-23,{instant:true}); },c1); await page.evaluate(FR,3); await page.evaluate(c=>{ setClock(c,{instant:true}); },c1); await page.evaluate(FR,1);
      const S2=await page.evaluate(POSES), sd=maxDiff(S1,S2);
      let off=0; Object.keys(S1).forEach(id=>{ off=Math.max(off,S1[id][8]); });
      R.seek={clock:+c1.toFixed(3), twoPathsLargestDifference:+sd.max.toFixed(8), at:sd.id, largestOffHeading:+off.toFixed(6)};
      /* back to the turning moment, paused there by Play's own advance, then resumed */
      await page.evaluate(c=>{ setClock(c-3,{instant:true}); },cl); await page.evaluate(FR,2);
      await page.click("#play"); let k2=0, T=null; while(k2<120){ await page.evaluate(FR,1); k2++; const P=await page.evaluate(POSES); if(P[turn.id]&&P[turn.id][8]>0.05){ T=P[turn.id][8]; break; } }
      await page.click("#play");   /* Pause, mid-turn */
      const h=(await page.evaluate(POSES))[turn.id]; await page.evaluate(FR,5); const h5=(await page.evaluate(POSES))[turn.id];
      await page.click("#play"); const res=[]; for(let i=0;i<5;i++){ await page.evaluate(FR,1); const P=await page.evaluate(POSES); res.push(P[turn.id]?+P[turn.id][8].toFixed(5):null); }
      await page.click("#play");
      R.resume={offAtPause:h?+h[8].toFixed(5):null, offAfter5PausedFrames:h5?+h5[8].toFixed(5):null, offResumed:res};
    }
    await page.evaluate(()=>window.__md.stop());
    R.pageErrors=page._errors.slice(); out.builds[B.tag]=R; await page.close();
    console.log(B.tag+": "+JSON.stringify(R));
  }
  await browser.close();
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
