#!/usr/bin/env node
/* Stage 8, implementation PR 8F's prerequisite 1 (the audit of 8E: after the gait has faded out at 4x, Pause fixes the clock but gaitStep eases
   the amplitude back toward the paused clock's rule, full, so the figures step back into their stride with the clock standing). The
   reproduction and its regression evidence, on two builds (8E's as merged, and the fix), each on a page opened as the harness opens it:
   - the series: the app's own loop run frame by frame on a clock of the driver's (tools/visual/motion.js: 30 frames a second), Play, the speed
     and Pause pressed by real clicks (Playwright's mouse, the app's own handlers), for an infantry division, a cavalry corps and a limbered battery
     marching, three ways into the pause (from half speed, in the fade, faded out at 4x): every kit mesh's gait uniforms of the formation at the
     last frame played and each of 30 paused frames (each frame asked for, so that the gait is stepped in it), then resumed at 4x for 5 frames;
     and, on each build, a seek while paused (the next-ten-minutes button by a real click);
   - the clip: Saint-Hilaire's division from 08:52, the eye following it, half speed for 1 s, 4x for 0.6 s (the gait fading out), then paused
     1.5 s (frames asked for): 8E's build above, the fix below (H.264, 10 frames a second; every third frame of 30 a second).
   node tools/stage8/pause-8f.js --before 8e.html --after fix.html [--out dir] [--no-clip | --clip-only]
   Writes <out>/pause.json and <out>/clips/pause-8e-8f.mp4; measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const L=require("./lib.js"), MD=require("../visual/motion.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const BEFORE=path.resolve(opt("--before")), AFTER=path.resolve(opt("--after")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8f"));
const SUBJ=[{id:"sthilaire", kind:"infantry", t:532, dir:[0.7,0.35,0.2], r:34}, {id:"guard_cav", kind:"cavalry", t:636, dir:[0.95,0.22,0.22], r:34}, {id:"heightguns", kind:"limbered artillery", t:830, dir:[0.95,0.22,0.22], r:26}];
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
/* in the page: set the state through the app's own functions, the eye aimed at the formation, the driver started (no draw) */
const SETUP=function(s){
  closeFirst(null); if(playing) stopPlay(); dwellSet(false); setSpeed(0.5);
  setClock(s.t,{instant:true,force:true,camera:false});
  window.__aimS=s; window.__aimAt=function(){ var a=window.__aimS, p=posNow(a.id), w=W(p[0],p[1]), y=groundY(w[0],w[1]), d=new THREE.Vector3(a.dir[0],a.dir[1],a.dir[2]).normalize().multiplyScalar(a.r);
    tween=null; camArc=null; freeCam=true; curVantage=null; landCam.position.set(w[0]+d.x,y+d.y,w[1]+d.z); orbitTarget.set(w[0],y,w[1]); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true); };
  window.__aimAt(); AUSTERLITZ_DEBUG.settle(40,true); window.__aimAt(); AUSTERLITZ_DEBUG.settle(20,true);
  return {clock:fmtClock(clock)};
};
/* in the page: n frames of the app's own loop, each asked for; the formation's gait read after each */
const FRAMES=function(a){
  var D=window.__md, out=[];
  for(var i=0;i<a.n;i++){ if(a.aim) window.__aimAt(); requestRender(2); D.frame(1);
    var G=units[a.id].block.userData.gait, U=G&&G.meshes[0]?G.meshes[0].userData.anim:null;
    out.push({clock:+clock.toFixed(3), playing:playing, amp:G?+G.amp.toFixed(6):null, uni:U?[U.uAnimAmp.value,U.uAnimPhase.value,U.uAnimTrot.value,U.uAnimRollG.value,U.uAnimRollL.value]:null}); }
  return out;
};
async function openPage(browser,html){ process.env.AUSTERLITZ_HTML=html; const p=await L.open(browser,[1280,720],{}); await p.evaluate(MD.inPage); return p; }
async function click(page,sel){ await page.click(sel,{timeout:30000}); }
(async()=>{
  fs.mkdirSync(path.join(OUT,"clips"),{recursive:true});
  const browser=await L.launch(), res={chromium:browser.version(), builds:{}, note:"Every value read from the app's own state after its own loop's frame; Play, the speed and Pause by real clicks."};
  if(!argv.includes("--clip-only")) for(const [lab,html] of [["8E",BEFORE],["8F",AFTER]]){
    const B=res.builds[lab]={file:path.basename(html), md5:md5(html), subjects:{}};
    for(const S of SUBJ){
      const R=B.subjects[S.kind]={id:S.id, ways:{}};
      for(const way of ["half speed","in the fade","faded out"]){
        const page=await openPage(browser,html); await page.evaluate(SETUP,S);
        await page.evaluate(()=>{ window.__md.start({gl:false}); lastFrame=performance.now(); });
        await click(page,'.spd-btn[data-s="0.5"]'); await click(page,"#play");
        await page.evaluate(FRAMES,{id:S.id,n:12,aim:true});
        if(way!=="half speed"){ await click(page,'.spd-btn[data-s="4"]'); const f1=await page.evaluate(FRAMES,{id:S.id,n:1,aim:true});
          if(way==="faded out"){ let a=f1[0].amp, k=0; while(a>0&&k<60){ a=(await page.evaluate(FRAMES,{id:S.id,n:1,aim:true}))[0].amp; k++; } } }
        const last=(await page.evaluate(FRAMES,{id:S.id,n:1,aim:true}))[0];
        await click(page,"#play");   /* Pause */
        const paused=await page.evaluate(FRAMES,{id:S.id,n:30,aim:false});
        await click(page,"#play"); await click(page,'.spd-btn[data-s="4"]');
        const resumed=await page.evaluate(FRAMES,{id:S.id,n:5,aim:false});
        await click(page,"#play");
        let seek=null;
        if(way==="faded out"){ const before=(await page.evaluate(FRAMES,{id:S.id,n:1,aim:false}))[0]; await click(page,"#next"); const after=await page.evaluate(FRAMES,{id:S.id,n:3,aim:false});
          seek={before:before, after:after.map(x=>({clock:x.clock, amp:x.amp}))}; }
        await page.evaluate(()=>window.__md.stop()); await page.close();
        const moved=paused.filter(x=>JSON.stringify(x.uni)!==JSON.stringify(last.uni)).length;
        R.ways[way]={clock:last.clock, ampLastPlayed:last.amp, ampPaused:paused.map(x=>x.amp).filter((v,i)=>i<5||i%5===4), pausedFramesMoved:moved, ampPausedLast:paused[paused.length-1].amp,
          resumed:resumed.map(x=>({clock:x.clock, amp:x.amp})), seek:seek};
        console.log(lab+" "+S.kind+" "+way+": "+last.amp+" at the pause, paused frames "+R.ways[way].ampPaused.join(" ")+" ("+moved+" of 30 moved); resumed "+resumed.map(x=>x.amp).join(" ")+(seek?"; sought: "+seek.after.map(x=>x.amp).join(" "):""));
      } } }
  if(!argv.includes("--clip-only")) fs.writeFileSync(path.join(OUT,"pause.json"),JSON.stringify(res,null,1));
  if(!argv.includes("--no-clip")){
    /* the clip, both builds */
    const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"pause-8f-")), made=[], S={id:"sthilaire", t:532, dir:[0.7,0.35,0.2], r:26};
    for(const [lab,html] of [["8E",BEFORE],["8F",AFTER]]){
      const dir=path.join(tmp,lab); fs.mkdirSync(dir,{recursive:true});
      const page=await openPage(browser,html); await page.setViewportSize({width:960,height:540}); await page.evaluate(SETUP,S);
      await page.evaluate(()=>{ window.__md.start({gl:true}); lastFrame=performance.now(); });
      let k=0; const shot=async()=>{ fs.writeFileSync(path.join(dir,String(k++).padStart(4,"0")+".png"),await L.png(page)); };   /* the long timeout of the probes' captures (software WebGL) */
      await shot(); await click(page,'.spd-btn[data-s="0.5"]'); await click(page,"#play");
      for(let i=0;i<10;i++){ await page.evaluate(FRAMES,{id:S.id,n:3,aim:true}); await shot(); }
      await click(page,'.spd-btn[data-s="4"]');
      for(let i=0;i<6;i++){ await page.evaluate(FRAMES,{id:S.id,n:3,aim:true}); await shot(); }
      await click(page,"#play");
      for(let i=0;i<15;i++){ await page.evaluate(FRAMES,{id:S.id,n:3,aim:false}); await shot(); }
      await page.evaluate(()=>window.__md.stop()); await page.close();
      const f=path.join(tmp,lab+".mp4"); cp.execFileSync("ffmpeg",["-y","-loglevel","error","-framerate","10","-i",path.join(dir,"%04d.png"),"-c:v","libx264","-pix_fmt","yuv420p","-crf","23","-vf","pad=ceil(iw/2)*2:ceil(ih/2)*2",f]); made.push(f); }
    const f=path.join(OUT,"clips","pause-8e-8f.mp4");
    cp.execFileSync("ffmpeg",["-y","-loglevel","error","-i",made[0],"-i",made[1],"-filter_complex","vstack=inputs=2","-c:v","libx264","-pix_fmt","yuv420p","-crf","23",f]);
    fs.rmSync(tmp,{recursive:true,force:true}); console.log("clip: "+path.relative(L.ROOT,f)+" (8E above, the fix below)");
  }
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
