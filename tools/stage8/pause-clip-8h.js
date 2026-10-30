#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md section 20.4): the clip of a block at a pause, two builds (8G's as merged, 8H's), as
   tools/stage8/pause-8f.js made 8F's: each on a page opened as the harness opens it, the app's own loop run frame by frame on a clock of the
   driver's (tools/visual/motion.js, 30 frames a second, drawn), Play at 4x and Pause by real clicks. Vandamme's division from 08:40, the eye
   following it, Play at 4x until the division stands more than 0.3 rad from the heading it turns to (pose-8h.js's case), then paused for two
   seconds (each frame asked for): on 8G's build it turns on with the clock standing, on 8H's it is held. Every third frame of 30 a second, at
   10 frames a second, 8G's above and 8H's below (H.264).
   node tools/stage8/pause-clip-8h.js --before 8g.html --after 8h.html [--out dir]
   Writes <out>/clips/pause-8g-8h.mp4; measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const L=require("./lib.js"), MD=require("../visual/motion.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const BEFORE=path.resolve(opt("--before")), AFTER=path.resolve(opt("--after")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8h"));
const S={id:"vandamme", t:520, dir:[0.55,0.55,0.35], r:34};
const SETUP=function(s){
  closeFirst(null); if(playing) stopPlay(); dwellSet(false); setSpeed(0.5);
  setClock(s.t,{instant:true,force:true,camera:false});
  window.__aimS=s; window.__aimAt=function(){ var a=window.__aimS, p=posNow(a.id), w=W(p[0],p[1]), y=groundY(w[0],w[1]), d=new THREE.Vector3(a.dir[0],a.dir[1],a.dir[2]).normalize().multiplyScalar(a.r);
    tween=null; camArc=null; freeCam=true; curVantage=null; landCam.position.set(w[0]+d.x,y+d.y,w[1]+d.z); orbitTarget.set(w[0],y,w[1]); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true); };
  window.__aimAt(); AUSTERLITZ_DEBUG.settle(40,true); window.__aimAt(); AUSTERLITZ_DEBUG.settle(20,true);
  return {clock:fmtClock(clock)};
};
/* n frames of the app's own loop, each asked for; the division's distance from its heading after the last */
const FRAMES=function(a){ var D=window.__md;
  for(var i=0;i<a.n;i++){ if(a.aim) window.__aimAt(); requestRender(2); D.frame(1); }
  var r=units[a.id], want=headingAt(a.id,clock); if(want===null) want=enemyFacing(a.id); var d=want==null?0:want-(r.yaw||0); while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI;
  return {clock:+clock.toFixed(3), playing:playing, off:+Math.abs(d).toFixed(4), yaw:+(r.yaw||0).toFixed(4)}; };
async function click(page,sel){ await page.click(sel,{timeout:30000}); }
(async()=>{
  fs.mkdirSync(path.join(OUT,"clips"),{recursive:true});
  const browser=await L.launch(), tmp=fs.mkdtempSync(path.join(os.tmpdir(),"pause-8h-")), made=[], rec={};
  for(const [lab,html] of [["8G",BEFORE],["8H",AFTER]]){
    const dir=path.join(tmp,lab); fs.mkdirSync(dir,{recursive:true});
    process.env.AUSTERLITZ_HTML=html; const page=await L.open(browser,[960,540],{}); await page.evaluate(MD.inPage); await page.evaluate(SETUP,S);
    await page.evaluate(()=>{ window.__md.start({gl:true}); lastFrame=performance.now(); });
    let k=0; const shot=async()=>{ fs.writeFileSync(path.join(dir,String(k++).padStart(4,"0")+".png"),await L.png(page)); };
    await shot(); await click(page,'.spd-btn[data-s="4"]'); await click(page,"#play");
    let st=null, n=0; do{ st=await page.evaluate(FRAMES,{id:S.id,n:3,aim:true}); await shot(); n++; } while(st.off<=0.3&&n<100);
    await click(page,"#play");   /* Pause */
    const paused=[]; for(let i=0;i<20;i++){ paused.push(await page.evaluate(FRAMES,{id:S.id,n:3,aim:false})); await shot(); }
    await page.evaluate(()=>window.__md.stop()); await page.close();
    rec[lab]={file:path.basename(html), atPause:st, paused:paused.map(x=>x.off), turnedPaused:+Math.abs(paused[paused.length-1].yaw-st.yaw).toFixed(4)};
    console.log(lab+": paused at "+st.clock+" with the division "+st.off+" rad off its heading; over the paused frames it turned "+rec[lab].turnedPaused+" rad");
    const f=path.join(tmp,lab+".mp4"); cp.execFileSync("ffmpeg",["-y","-loglevel","error","-framerate","10","-i",path.join(dir,"%04d.png"),"-c:v","libx264","-pix_fmt","yuv420p","-crf","23","-vf","pad=ceil(iw/2)*2:ceil(ih/2)*2",f]); made.push(f); }
  const f=path.join(OUT,"clips","pause-8g-8h.mp4");
  cp.execFileSync("ffmpeg",["-y","-loglevel","error","-i",made[0],"-i",made[1],"-filter_complex","vstack=inputs=2","-c:v","libx264","-pix_fmt","yuv420p","-crf","23",f]);
  fs.writeFileSync(path.join(OUT,"clips","pause-8g-8h.json"),JSON.stringify({tool:"tools/stage8/pause-clip-8h.js", chromium:browser.version(), builds:rec},null,1));
  fs.rmSync(tmp,{recursive:true,force:true}); console.log("clip: "+path.relative(L.ROOT,f)+" (8G above, 8H below)");
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
