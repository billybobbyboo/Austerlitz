#!/usr/bin/env node
/* Stage 7D (docs/STAGE7_SPEC.md section 6, 7D, "Report and tests"; owner decision 123): the clock played between the opening's steps, measured
   on fresh pages. No source file is written.
   node tools/stage7/opening-7d-probe.js [--json f] [--sheet f] [--only path,keys,rm] [--title t]
   path    at 1600 x 900 and 1280 x 720: the card's primary action and each Next clicked as a visitor clicks them; each played stretch then run by
           the app's own tickClock, followStep and openingPlayWatch in 50 ms steps (no wall clock: under software WebGL a stretch takes many
           minutes of real time): its length in seconds with the dwells counted, the lowest clearance above the drawn ground and the floor's
           lifts, the target's largest speed across the screen, the drops every ten clock minutes (Follow's limit 19), the bar's words (its own
           or the dwell's event names), the live messages and the phase announcements; one frame in the middle of each stretch, paused there
           by the Play/Pause button, as the harness measures a frame; each step's frame after the arrival glide, against 7C's
   keys    at 1600 x 900, by real clicks and key presses: Next plays; Space off a button pauses and resumes; the Play/Pause button pauses and
           resumes; Next while playing goes straight to the step; Back while playing returns; Esc while playing ends at the end state; the
           visitor's speed after each
   rm      under reduced motion: Next cuts to the step, nothing plays
   Measurement only. */
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=(opt("--only")||"path,keys,rm").split(",");
const OUT=opt("--json")||path.join(L.EVID7,"7d-opening-probe.json"), SHEET=opt("--sheet")||path.join(L.EVID7,"7d-opening-sheet.jpg");
const res=fs.existsSync(OUT)?JSON.parse(fs.readFileSync(OUT,"utf8")):{};
const save=()=>fs.writeFileSync(OUT,JSON.stringify(res,null,1));
const CLICK={timeout:180000};
const tiles=[];
const LIMIT=n=>L.TH.DROP_LIMIT[n]!==undefined?L.TH.DROP_LIMIT[n]:null;
const MID=[390,600,780];   /* a frame in the middle of each stretch: 06:30, 10:00, 13:00 */

/* in the page: run the stretch just started to `stop` (a clock) or to its arrival, in 50 ms steps, sampling as described above */
const RUN=(a)=>{
  var stop=a[0], R=a[1]||{secs:0,steps:0,dwells:0,lowest:1e9,lifts:0,spd:0,drops:0,dropAt:"",lastM:-1,words:{},msgs:[],said0:PHASE_SAID};
  var pT=new THREE.Vector3(), pW=1, c0=CAM.clamps, hold=false, g=0, Lo=LABELS.opening;
  while(OPENING.play&&g++<400000){
    if(stop!==null&&clock>=stop) break;
    pT.copy(orbitTarget); pW=worldPerPx(orbitTarget);
    tickClock(50); followStep(50); R.secs+=0.05; R.steps++;
    var h=!!(DWELL.st&&DWELL.st.stage==="hold"); if(h&&!hold) R.dwells++; hold=h;
    if(clock>=OPENING.play.target-1e-6){ openingPlayWatch(); break; }
    var p=landCam.position, c=p.y-camGround(p.x,p.z); if(c<R.lowest) R.lowest=c;
    R.spd=Math.max(R.spd,Math.hypot(orbitTarget.x-pT.x,orbitTarget.z-pT.z)/pW/0.05);
    var m=Math.floor(clock); if(m!==R.lastM&&m%10===0){ R.lastM=m; for(var i=0;i<12;i++){ settling=false; updateVisibility(); } mlLayout(); if(ML.stats.dropped>R.drops){ R.drops=ML.stats.dropped; R.dropAt=fmtClock(m); } }
    openingPlayWatch();
    var x=document.getElementById("tour-x").textContent; R.words[x]=(R.words[x]||0)+1;
  }
  R.lifts+=CAM.clamps-c0;
  return R;
};
const STATE=()=>{ var a=document.activeElement; return {on:OPENING.on,step:OPENING.k+1,play:!!OPENING.play,to:OPENING.play?OPENING.play.to+1:null,playing:playing,speed:speed,
  clock:fmtClock(clock),head:document.getElementById("tour-n").textContent,live:document.getElementById("live-phase").textContent,
  focus:a&&a!==document.body?(a.id||a.tagName):"body",vantage:curVantage,follow:!freeCam}; };

(async()=>{
  const browser=await L.launch();
  if(ONLY.includes("path")){
    res.path=res.path||{};
    for(const [vk,vp,names] of [["1600x900",[1600,900],["opening-1","opening-2","opening-3","opening-4"]],["1280x720",[1280,720],["opening-1-laptop",null,null,null]]]){
      const page=await L.open(browser,vp); const out={stretches:[],holds:[]};
      await page.click("#fr-tour",CLICK);
      for(let k=1;k<4;k++){
        await page.click("#tour-next",CLICK);
        const start=await page.evaluate(STATE);
        /* run to the middle, pause there (the Play/Pause button's own toggle), measure, resume, run to the arrival */
        let R=await page.evaluate(RUN,[MID[k-1],null]);
        await page.evaluate(()=>{ if(playing) togglePlay(); });
        const f=await L.frame(page,19);
        tiles.push({png:f.png,cap:vk+" playing to step "+(k+1)+", paused at "+(await page.evaluate(()=>fmtClock(clock)))+": free "+(100*f.unobstructed).toFixed(1)+"%, drops "+f.layer.dropped});
        const mid=Object.assign(await page.evaluate(STATE),{frame:L.strip(f)});
        await page.evaluate(()=>{ if(!playing) togglePlay(); });
        R=await page.evaluate(RUN,[null,R]);
        const glide=await page.evaluate(()=>{ var fn=_tw.cam, t0=performance.now(), lo=1e9, n=0, c0=CAM.clamps;
          if(fn) for(var j=0;j<=50;j++){ fn(t0+j*1600/50); var q=landCam.position, c=q.y-camGround(q.x,q.z); if(c<lo) lo=c; n++; }
          __fin(); return {samples:n,lowest:n?+lo.toFixed(2):null,lifts:CAM.clamps-c0}; });
        const arrived=await page.evaluate(STATE);
        R.lowest=+R.lowest.toFixed(2); R.spd=+R.spd.toFixed(1); R.secs=+R.secs.toFixed(1); R.phaseSaid=await page.evaluate(s=>PHASE_SAID-s,R.said0); delete R.said0; delete R.lastM;
        out.stretches.push({to:k+1,start,mid,run:R,arrivalGlide:glide,arrived});
        const h=await L.frame(page,LIMIT(names[k]||""));
        out.holds.push({step:k+1,clock:arrived.clock,frame:L.strip(h)});
        console.log(vk,"stretch to step",k+1,"secs",R.secs,"dwells",R.dwells,"lowest",R.lowest,"lifts",R.lifts,"spd",R.spd,"drops",R.drops,R.dropAt,"phase said",R.phaseSaid,
          "mid free",f.unobstructed,"drops",f.layer.dropped,"text",f.text.min,"smoke",f.smoke,"conf",f.conf,"calls",f.cost.calls,"stage0",f.stage0.join("; "),
          "| glide",JSON.stringify(glide),"| hold free",h.unobstructed,"drops",h.layer.dropped,"| arrived",JSON.stringify(arrived));
      }
      res.path[vk]=out; save(); await page.close();
    }
  }
  if(ONLY.includes("keys")){
    const page=await L.open(browser,[1600,900]); const K={};
    const st=()=>page.evaluate(STATE);
    await page.click("#fr-tour",CLICK);
    await page.click("#tour-next",CLICK); K.next=await st();
    await page.waitForFunction(()=>clock>250,null,{timeout:600000,polling:250});
    await page.click("#tour-x",CLICK); await page.keyboard.press("Space"); const c0=await page.evaluate(()=>clock); await page.waitForTimeout(2000);
    K.spacePause=Object.assign(await st(),{still:await page.evaluate(c=>clock===c,c0)});
    await page.keyboard.press("Space"); await page.waitForTimeout(1000); K.spaceResume=await st();
    await page.click("#play",CLICK); const c1=await page.evaluate(()=>clock); await page.waitForTimeout(2000);
    K.buttonPause=Object.assign(await st(),{still:await page.evaluate(c=>clock===c,c1)});
    await page.click("#play",CLICK); K.buttonResume=await st();
    await page.click("#tour-next",CLICK); await page.evaluate(()=>__fin()); K.nextWhilePlaying=await st();
    await page.click("#tour-next",CLICK); await page.waitForTimeout(1000); await page.click("#tour-prev",CLICK); await page.evaluate(()=>__fin()); K.backWhilePlaying=await st();
    await page.click("#tour-next",CLICK); await page.waitForTimeout(1000); await page.keyboard.press("Escape"); await page.evaluate(()=>__fin()); K.escWhilePlaying=await st();
    res.keys=K; console.log("keys",JSON.stringify(K)); save(); await page.close();
  }
  if(ONLY.includes("rm")){
    const page=await L.open(browser,[1600,900],{rm:true}); const R={rm:await page.evaluate(()=>RM),steps:[]};
    await page.click("#fr-tour",CLICK);
    for(let k=1;k<4;k++){ await page.click("#tour-next",CLICK); R.steps.push(await page.evaluate(()=>{ var t=performance.now(); if(tween) tween(t+5); var s=TOUR[tourStep], v=presetFrame(stopCam(s));
      var at=landCam.position.distanceTo(new THREE.Vector3(v[0],v[1],v[2]))<1e-3; __fin(); return {step:OPENING.k+1,clock:fmtClock(clock),played:!!OPENING.play,playing:playing,atFrameWithin5ms:at}; })); }
    res.rm=R; console.log("reduced motion",JSON.stringify(R)); save(); await page.close();
  }
  if(tiles.length){ const pg=await L.open(browser,[1600,900]);
    fs.writeFileSync(SHEET,await L.sheet(pg,tiles,3,480,270,opt("--title")||"Stage 7D: the clock played between the opening's steps, paused mid-stretch",true)); await pg.close(); }
  await browser.close();
})();
