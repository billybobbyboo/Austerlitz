#!/usr/bin/env node
/* Stage 7C (docs/STAGE7_SPEC.md section 6, 7C, "What its report must show"): the opening as built, measured on fresh pages driven as a
   visitor drives them (real clicks and key presses). No source file is written.
   node tools/stage7/opening-7c-probe.js [--json f] [--sheet f] [--only steps,ways,rm,length] [--title t]
   steps   at 1600 x 900 and 1280 x 720: the card's primary action clicked, then Next, step by step, then Finish. Each step: its stop, clock,
           theme and camera; the glide that reached it sampled at 51 points (lowest clearance above the drawn ground, the floor's lifts); the
           bar's box and whether its text is whole (nothing scrolled); every string shown against TOUR and LABELS; one frame's measures as
           the harness takes them (unobstructed, drops against the case's limit if the harness has one, map text as rendered, darkness, the
           smoke's and the confidence marks' shares, draw calls, the world pass); the end state after Finish likewise
   ways    at 1600 x 900, from every step: Skip clicked, Esc pressed, and (from step 2) a drag on the map and the key M: where each leaves
           the clock, the presentation, the tab, the camera, Follow and focus
   rm      under reduced motion at 1600 x 900: each step's camera at its frame within 5 ms of the press, nothing playing; Skip to the end
   length  the four stops' words read at 160, 200 and 238 words a minute (design values for the measurement), with the glides
   Measurement only. */
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=(opt("--only")||"steps,ways,rm,length").split(",");
const OUT=opt("--json")||path.join(L.EVID7,"7c-opening-probe.json"), SHEET=opt("--sheet")||path.join(L.EVID7,"7c-opening-sheet.jpg");
const res=fs.existsSync(OUT)?JSON.parse(fs.readFileSync(OUT,"utf8")):{};
const save=()=>fs.writeFileSync(OUT,JSON.stringify(res,null,1));
const tiles=[];

/* in the page, before a press that starts a glide: record when the camera's tween is set, so that the glide can be sampled from its start */
const HOOK=()=>{ if(window.__hooked) return; window.__hooked=true; var st=setTween;
  setTween=function(slot,fn){ if(slot==="cam"&&fn) window.__tw0=performance.now(); return st(slot,fn); }; };
/* in the page, after the press: sample the glide (51 points over its 1.6 s), then the step's state */
const STEP=()=>{
  var c0=CAM.clamps, fn=_tw.cam, lo=1e9, n=0, t0=window.__tw0;
  if(fn&&t0){ for(var k=0;k<=50;k++){ fn(t0+k*1600/50); var p=landCam.position, c=p.y-camGround(p.x,p.z); if(c<lo) lo=c; n++; } }
  __fin();
  var bar=document.getElementById("tourbar"), b=bar.getBoundingClientRect(), x=document.getElementById("tour-x"), Lo=LABELS.opening;
  var s=OPENING.on?TOUR[tourStep]:null, k=OPENING.k, N=OPENING.stops.length;
  var shown=["tour-n","tour-t","tour-x","tour-prev","tour-next","tour-exit"].map(function(id){ return document.getElementById(id).textContent; });
  var want=s?[Lo.head.replace("%k",k+1).replace("%n",N),s.n,s.x,Lo.back,k===N-1?Lo.finish:Lo.next,Lo.skip]:null;
  var a=document.activeElement;
  return {on:OPENING.on,step:OPENING.on?k+1:null,stop:OPENING.on?tourStep+1:null,n:s?s.n:null,clock:fmtClock(clock),chapter:chapter,plan:planSide,
    presentation:presentation,tab:tabNow,follow:!freeCam,vantage:curVantage,focus:a&&a!==document.body?(a.id||a.tagName):"body",
    live:document.getElementById("live-phase").textContent,
    glide:{samples:n,lowest:n?+lo.toFixed(2):null,lifts:CAM.clamps-c0},
    camera:{pos:landCam.position.toArray().map(function(v){ return +v.toFixed(1); }),tgt:orbitTarget.toArray().map(function(v){ return +v.toFixed(1); }),
      dist:+landCam.position.distanceTo(orbitTarget).toFixed(1),atStop:s?(function(){ var v=presetFrame(stopCam(s)); return landCam.position.distanceTo(new THREE.Vector3(v[0],v[1],v[2]))<1e-3; })():null},
    bar:OPENING.on?{box:[Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height)],whole:bar.scrollHeight<=bar.clientHeight+1&&x.scrollHeight<=x.clientHeight+1,
      words:s.x.split(/\s+/).length}:null,
    strings:want?{tested:shown.every(function(v,i){ return v===want[i]; }),shown:shown.map(function(v){ return v.length>48?v.slice(0,48)+"…":v; })}:null};
};
const LIMIT=n=>L.TH.DROP_LIMIT[n]!==undefined?L.TH.DROP_LIMIT[n]:null;

(async()=>{
  const browser=await L.launch();
  if(ONLY.includes("steps")){
    res.steps=res.steps||{};
    for(const [vk,vp,cases] of [["1600x900",[1600,900],["opening-1","opening-2","opening-3","opening-4","opening-end"]],["1280x720",[1280,720],["opening-1-laptop",null,null,null,null]]]){
      const page=await L.open(browser,vp); await page.evaluate(HOOK);
      const out=[];
      await page.click("#fr-tour");
      for(let k=0;k<5;k++){
        if(k>0) await page.click("#tour-next");
        const st=await page.evaluate(STEP), f=await L.frame(page,LIMIT(cases[k]||""));
        out.push(Object.assign(st,{frame:L.strip(f)}));
        tiles.push({png:f.png,cap:vk+(st.on?" step "+st.step+" (tour stop "+st.stop+", "+st.clock+")":" after Finish ("+st.clock+")")+": free "+(100*f.unobstructed).toFixed(1)+"%, drops "+f.layer.dropped});
        console.log(vk,st.on?"step "+st.step:"end",st.clock,"free",f.unobstructed,"drops",f.layer.dropped,f.layer.droppedIds.join(","),"text",f.text.min,"belowAA",f.text.belowAA,"dark",f.dark.solidBlack,
          "smoke",f.smoke,"conf",f.conf,"calls",f.cost.calls,"world",f.cost.worldMs,"glide",JSON.stringify(st.glide),"bar",JSON.stringify(st.bar),"tested",st.strings&&st.strings.tested,"focus",st.focus,"stage0",f.stage0.join("; "));
      }
      res.steps[vk]=out; save(); await page.close();
    }
  }
  if(ONLY.includes("ways")){
    res.ways={};
    const page=await L.open(browser,[1600,900]); await page.evaluate(HOOK);
    await page.click("#fr-close");
    const go=async k=>{ await page.click("#openingbtn"); await page.evaluate(()=>__fin()); for(let i=0;i<k;i++){ await page.click("#tour-next"); await page.evaluate(()=>__fin()); } };
    const state=()=>page.evaluate(()=>{ __fin(); var a=document.activeElement; return {on:OPENING.on,stop:tourStep,clock:fmtClock(clock),presentation:presentation,mode:mode,tab:tabNow,follow:!freeCam,vantage:curVantage,
      chapter:chapter,dispatchHidden:hideDispatch,focus:a&&a!==document.body?(a.id||a.tagName):"body",live:document.getElementById("live-phase").textContent,
      camera:landCam.position.toArray().map(function(v){ return +v.toFixed(1); })}; });
    for(let k=0;k<4;k++){
      await go(k); await page.click("#tour-exit"); res.ways["Skip at step "+(k+1)]=await state();
      await go(k); await page.keyboard.press("Escape"); res.ways["Esc at step "+(k+1)]=await state();
      console.log("step",k+1,"Skip",JSON.stringify(res.ways["Skip at step "+(k+1)]),"Esc",JSON.stringify(res.ways["Esc at step "+(k+1)]));
    }
    await go(1); const before=await state();
    await page.mouse.move(800,300); await page.mouse.down(); await page.mouse.move(860,330,{steps:6}); await page.mouse.up();
    res.ways["a drag on the map at step 2"]=Object.assign(await state(),{before:{clock:before.clock,camera:before.camera}});
    await go(1); await page.keyboard.press("m"); res.ways["the key M at step 2"]=await state(); await page.keyboard.press("m"); await page.keyboard.press("m");
    console.log("drag",JSON.stringify(res.ways["a drag on the map at step 2"]),"M",JSON.stringify(res.ways["the key M at step 2"]));
    save(); await page.close();
  }
  if(ONLY.includes("rm")){
    const page=await L.open(browser,[1600,900],{rm:true});
    const R={rm:await page.evaluate(()=>RM),steps:[]};
    await page.click("#fr-tour");
    for(let k=0;k<4;k++){
      if(k>0) await page.click("#tour-next");
      R.steps.push(await page.evaluate(()=>{ var t=performance.now(); if(tween) tween(t+5); var s=TOUR[tourStep], v=presetFrame(stopCam(s));
        var at=landCam.position.distanceTo(new THREE.Vector3(v[0],v[1],v[2]))<1e-3; __fin(); return {step:OPENING.k+1,clock:fmtClock(clock),atFrameWithin5ms:at,playing:playing}; }));
    }
    await page.click("#tour-exit");
    R.end=await page.evaluate(()=>{ var t=performance.now(); if(tween) tween(t+5); var v=presetFrame(VANTAGE.plan);
      var at=landCam.position.distanceTo(new THREE.Vector3(v[0],v[1],v[2]))<1e-3; __fin(); var a=document.activeElement;
      return {on:OPENING.on,clock:fmtClock(clock),overviewWithin5ms:at,focus:a&&a!==document.body?a.id:"body",playing:playing}; });
    res.rm=R; console.log("reduced motion",JSON.stringify(R)); save(); await page.close();
  }
  if(ONLY.includes("length")){
    const page=await L.open(browser,[1600,900]);
    res.length=await page.evaluate(()=>{ var w=OPENING.stops.map(function(i){ return (TOUR[i].n+" "+TOUR[i].x).split(/\s+/).length; }), x=OPENING.stops.map(function(i){ return TOUR[i].x.split(/\s+/).length; });
      var W=x.reduce(function(a,b){ return a+b; },0), glides=(OPENING.stops.length+1)*1.6, out={stops:OPENING.stops.map(function(i){ return i+1; }),textWords:x,withTitles:w,words:W,glides:+glides.toFixed(1)};
      [160,200,238].forEach(function(r){ out["at"+r]={reading:+(W/r*60).toFixed(1),total:+(W/r*60+glides).toFixed(1)}; }); return out; });
    console.log("length",JSON.stringify(res.length)); save(); await page.close();
  }
  if(tiles.length){ const pg=await L.open(browser,[1600,900]);
    fs.writeFileSync(SHEET,await L.sheet(pg,tiles,3,480,270,opt("--title")||"Stage 7C: the opening as built (fresh pages, real clicks)",true)); await pg.close(); }
  await browser.close();
})();
