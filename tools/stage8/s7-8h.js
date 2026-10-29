#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md section 20.4): the audit's S-7, its three timing seams, measured on any build.
   (1) A speed change inside a dwell's ease: the clock played by Play's own advance (tickClock, 60 steps a second of the probe's clock), from 3
       clock minutes before an event's start at 4x; the speed set to 1/2x a third of the way into the ease in (and, in a second run, a third of
       the way into the ease out, and in a third during the hold); each run's clock rate just before and after the change (clock minutes a
       second), the real time and clock minutes until the ease ends, against what the new speed's own ease would take; a rate that jumps by the
       speeds' ratio is consistent (as a change of speed off the ease), one that keeps the old speed's ease is not.
   (2) The relief changed during a vantage's glide: flyTo a vantage, one step of its glide, the display factor changed (redrawGround), then
       Play: is Follow active (followActive), and does the eye follow over the next second of play (its target moved)?
   (3) The knowledge rule against the drawn fog: every minute 08:00-10:00, both headquarters' readings (knowledgeOf, the phase's mist) and the
       same rule taken on the drawn fog's eased amount (fogAmount > 0.5); each formation whose reading would differ, by minute.
   node tools/stage8/s7-8h.js [--html build] [--out file.json]
   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const HTML=path.resolve(opt("--html")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=opt("--out");
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
(async()=>{
  process.env.AUSTERLITZ_HTML=HTML;
  const browser=await L.launch(), page=await L.open(browser,[1600,900]);
  const out={tool:"tools/stage8/s7-8h.js", build:path.relative(L.ROOT,HTML), md5:md5(HTML), browser:browser.version()};
  /* (1) the dwell */
  out.dwell=await page.evaluate(()=>{
    var runs=[];
    ["in","hold","out"].forEach(function(at){
      stopPlay(); dwellSet(true); setSpeed(4);
      var S=dwellStarts(), E=null; for(var i=0;i<S.length;i++) if(S[i]>600){ E=S[i]; break; }
      setClock(E-3,{instant:true}); playing=true; dwellReset();
      var dt=1000/60, t=0, prev=clock, rate=[], sw=null, endT=null, endC=null, stage0=null, guard=0;
      while(guard++<6000){
        var st=DWELL.st, stage=st?st.stage:null, frac=st?st.tau/(stage==="hold"?DWELL.HOLD:st.te):0;
        if(!sw&&st&&stage===at&&frac>=1/3){ sw={t:t, clock:clock, stage:stage, frac:+frac.toFixed(3), d:st.d, before:+((clock-prev)/(dt/1000)).toFixed(3)}; setSpeed(0.5); stage0=stage; }
        prev=clock; tickClock(dt); t+=dt;
        if(sw&&sw.after==null) sw.after=+((clock-prev)/(dt/1000)).toFixed(3);
        if(sw&&!DWELL.st&&endT==null){ endT=t; endC=clock; break; }
      }
      var v1=MIN_PER_SEC*0.5;
      runs.push({changedIn:at, E:E, sw:sw, toEndMs:sw&&endT!=null?Math.round(endT-sw.t):null, toEndMin:sw&&endC!=null?+(endC-sw.clock).toFixed(3):null,
        rateAtEnd:+((clock-prev)/(dt/1000)).toFixed(3), newSpeedRate:v1, ratio:sw&&sw.before?+(sw.after/sw.before).toFixed(3):null});
      stopPlay();
    });
    return runs; });
  /* (2) the relief during a glide */
  out.relief=await page.evaluate(()=>{
    stopPlay(); setDisplayFactor(DISPLAY.defaultFactor); setClock(520,{instant:true}); __fin();
    flyTo(VANTAGE.zuran); if(tween) tween(performance.now()+300);
    var midGlide=!!_tw.cam, f0=DISPLAY.factor, p0=landCam.position.clone(); setDisplayFactor(f0===4?10.33:4);
    var afterRelief={tween:!!tween, twCam:!!_tw.cam, freeCam:freeCam, camMovedXZ:+Math.hypot(landCam.position.x-p0.x,landCam.position.z-p0.z).toFixed(4)};
    togglePlay(); var fa=followActive(), t0=orbitTarget.clone(), moved=0;
    for(var i=0;i<60;i++){ tickClock(1000/60); followStep(1000/60); }
    moved=orbitTarget.distanceTo(t0);
    stopPlay(); setDisplayFactor(f0); __fin();
    return {midGlide:midGlide, afterRelief:afterRelief, followActive:fa, targetMoved:+moved.toFixed(3)}; });
  /* (3) the knowledge rule against the drawn fog */
  out.know=await page.evaluate(()=>{
    var res={minutes:0, differ:[], byView:{}}, keep=commandView;
    ["fr","al"].forEach(function(v){ setCommandView(v); var n=0;
      for(var t=480;t<=600;t++){ setClock(t,{instant:true}); knowAtClock(); res.minutes++;
        var amt=fogAmount(t), ph=PHASES[curPhase];
        Object.keys(FORMATIONS).forEach(function(id){ var f=FORMATIONS[id]; if(!f.track) return; var side=f.nation==="fr"?"fr":"al"; if(side===v) return;
          var ov=KNOW_OVERRIDE[v]&&KNOW_OVERRIDE[v][id]; if(ov) return;
          var r=knowledgeOf(id); if(r!=="seen"&&r!=="uncertain") return;
          var p=posNow(id); if(!p) return;
          var alt=(amt>0.5&&hAt(p[0],p[1])<-0.8)?"uncertain":"seen";
          if(alt!==r){ n++; res.differ.push({view:v, t:fmtClock(t), id:id, rule:r, drawnFog:alt, mist:ph.mist, amount:+amt.toFixed(3)}); } }); }
      res.byView[v]=n; });
    setCommandView(keep); return res; });
  await browser.close();
  const s=JSON.stringify(out,null,1);
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,s); }
  console.log(s.length>12000?s.slice(0,12000)+"\n...":s);
})().catch(e=>{ console.error(e); process.exit(1); });
