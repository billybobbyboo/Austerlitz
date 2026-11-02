#!/usr/bin/env node
/* Final audit after Stage 8, area visual-landscape: capture a list of shots of the rendered landscape.
   Measurement code only: nothing here writes a source file or changes the application; each shot's state is set through the
   harness's own entry point (window.__aus.apply -> AUSTERLITZ_DEBUG.applyCase: the clock, presentation, ground, display factor,
   selection, "Whose eyes?", and the camera placed by placeCamera, which re-frames a preset to the drawn ground and fits the Overview),
   then AUSTERLITZ_DEBUG.settle(90, noRender) + 450 ms + settle(2) (tools/stage2/page.js applyCase's sequence, its first frame not drawn: one
   software-WebGL frame a shot), then an optional `after` script
   (named per shot, recorded in its JSON), then a JPEG of the whole viewport.
   Page: the harness's (?harness=1: drift and smoke motion off, CSS transitions off), the app's loop held after boot, Chromium 141 headless shell, ANGLE/SwiftShader.
   usage: node capture.js <shots.json> <outdir> [--only id,id] [--force]
   shots.json: [{id, group, vp:[w,h], t, presentation, mode, factor, cam|aim|vantage, select, eyes, eye, after, note}]
   For each shot writes <outdir>/<id>.jpg and <outdir>/<id>.json (the spec, the state read back: clock, presentation, mode, factor,
   eye position and orbit target, layers, low tier, timings, page errors). Skips a shot whose JPEG exists unless --force. */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const SHOTS=JSON.parse(fs.readFileSync(argv[0],"utf8")), OUT=path.resolve(argv[1]);
const ONLY=opt("--only")?opt("--only").split(","):null, FORCE=argv.includes("--force");
fs.mkdirSync(OUT,{recursive:true});
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
/* in the page: read back what is drawn */
const READ=function(id){
  var st=window.__aus.state(), L=(typeof landCam!=="undefined"&&landCam)?landCam:camera;
  var out={clock:fmtClock(clock), t:clock, presentation:presentation, mode:mode, factor:+DISPLAY.factor.toFixed(4), lowTier:typeof lowTier!=="undefined"?lowTier:null,
    eye:L.position.toArray().map(function(v){ return +v.toFixed(3); }), target:orbitTarget.toArray().map(function(v){ return +v.toFixed(3); }),
    fov:camera.fov, selection:st.selection, commandView:st.commandView, eyeOn:st.eye, layers:Object.assign({},layerOn), cleanView:typeof cleanView!=="undefined"?cleanView:null,
    viewport:[innerWidth,innerHeight], fx:typeof FX!=="undefined"?!!FX.on:null};
  try{ var d=L.position.distanceTo(orbitTarget); out.dist=+d.toFixed(2); }catch(e){}
  try{ var su=SUN_DAY.at(clock); out.sunAlt=+su.alt.toFixed(2); out.sunGeo=+su.geo.toFixed(2); out.sunAz=su.az!==undefined?+su.az.toFixed(1):null; out.mist=+fogAmount(clock).toFixed(3); }catch(e){ out.sunErr=String(e.message); }
  return out;
};
(async()=>{
  const b=await A.launch(); let page=null, pvp=null, n=0;
  const t00=Date.now();
  for(const s of SHOTS){
    if(ONLY&&!ONLY.includes(s.id)) continue;
    const jf=path.join(OUT,s.id+".jpg"), sf=path.join(OUT,s.id+".json");
    if(!FORCE&&fs.existsSync(jf)&&fs.existsSync(sf)) { continue; }
    const vp=s.vp||[1600,900];
    if(!page||pvp.join("x")!==vp.join("x")){ if(page) await page.close(); const t0=Date.now(); page=await A.open(b,vp); pvp=vp; log("page",vp.join("x"),"booted in",Date.now()-t0,"ms");
      /* the app's own animation loop held (as tools/stage8/clips-8e.js holds it): nothing renders between settle() and the screenshot, so the
         screenshot composites the frame settle() drew instead of waiting for the app's next (software WebGL) frame */
      await page.evaluate(()=>{ if(!window.__held){ window.__held=true; window.loop=function(){ requestAnimationFrame(window.loop); }; } }); }
    const spec={t:s.t, presentation:s.presentation||"watch", mode:s.mode||"terrain"};
    if(s.factor!==undefined) spec.factor=s.factor;
    if(s.select) spec.select=s.select;
    if(s.eyes) spec.eyes=s.eyes;
    if(s.eye) spec.eye=true;
    if(s.plan) spec.plan=s.plan;
    if(s.vantage) spec.cam=await page.evaluate(k=>VANTAGE[k].slice(),s.vantage);
    else if(s.cam) spec.cam=s.cam; else if(s.aim) spec.aim=s.aim;
    const t1=Date.now();
    try{
      const tm={}; let tq=Date.now();
      await page.evaluate(sp=>window.__aus.apply(sp),spec); tm.apply=Date.now()-tq; tq=Date.now();
      await page.evaluate(n=>AUSTERLITZ_DEBUG.settle(n,true),s.settle||90); tm.settle=Date.now()-tq; await page.waitForTimeout(450); tq=Date.now();   /* settled without drawing; the one frame is drawn next */
      await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); tm.settle2=Date.now()-tq;
      let afterRes=null;
      if(s.after){ afterRes=await page.evaluate(new Function("return (function(){"+s.after+"})()")); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); }
      const st=await page.evaluate(READ,s.id);
      tq=Date.now(); await A.jpeg(page,jf,s.q||80); tm.shot=Date.now()-tq;
      const rec={id:s.id, group:s.group||null, note:s.note||"", spec:spec, after:s.after||null, afterResult:afterRes, readBack:st, ms:Date.now()-t1, timing:tm,
        page:"harness page (?harness=1), "+vp.join("x")+", deviceScaleFactor 1, Chromium "+b.version()+" headless shell, ANGLE/SwiftShader (software WebGL)",
        errors:A.errors(page).slice(-5)};
      fs.writeFileSync(sf,JSON.stringify(rec,null,1)); n++;
      log("shot",s.id,st.clock,st.factor+"x",st.presentation,"eye",st.eye.join(","),"tgt",st.target.join(","),(Date.now()-t1)+"ms",JSON.stringify(tm));
    }catch(e){ log("FAIL",s.id,String(e.message).slice(0,300)); try{ await page.close(); }catch(_){} page=null; }
  }
  log("done",n,"shots in",Math.round((Date.now()-t00)/1000),"s");
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
