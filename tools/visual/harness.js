#!/usr/bin/env node
/* Stage 0 visual baseline harness.
   node tools/visual/harness.js <app.html> <outdir> [--test] [--compare <baselineDir>] [--only a,b]
   Loads the built page in headless Chromium with software WebGL (SwiftShader) so frames are
   reproducible on one machine, drives it into the fixed cases in cases.js, saves a PNG and a
   metrics record per case, and with --test enforces the Stage 0 guarantees (exit code 1 on failure).
   three.js is loaded from cdnjs as in production; if AUSTERLITZ_THREE (or ./three.min.js, or
   node_modules/three) is present the CDN request is answered locally, e.g. offline. */
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const { chromium } = require("playwright");
const argv=process.argv.slice(2), flag=f=>argv.includes(f), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const html=path.resolve(argv[0]||"austerlitz-command-map.html");
const out=path.resolve(argv[1]||path.join(__dirname,"out"));
const TEST=flag("--test"), CMP=opt("--compare"), ONLY=opt("--only");
const THREE_LOCAL=[process.env.AUSTERLITZ_THREE, path.join(__dirname,"three.min.js"),
  path.resolve("node_modules/three/build/three.min.js")].find(p=>p&&fs.existsSync(p));
const CASES=require("./cases.js").filter(c=>!ONLY||ONLY.split(",").includes(c.name));
const MEASURE=fs.readFileSync(path.join(__dirname,"measure.js"),"utf8");
const md5=f=>crypto.createHash("md5").update(fs.readFileSync(f)).digest("hex");

async function openPage(browser,vp){
  const page=await browser.newPage({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:1});
  const logs=[];
  page.on("console",m=>{ if(m.type()==="warning"||m.type()==="error") logs.push(m.type()+": "+m.text()); });
  page.on("pageerror",e=>logs.push("PAGEERROR: "+e.message));
  if(THREE_LOCAL) await page.route(/three(\.min)?\.js$/,r=>r.fulfill({path:THREE_LOCAL,contentType:"application/javascript"}));
  await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000});
  await page.waitForFunction(()=>!document.getElementById("boot")&&typeof window.camera!=="undefined",null,{timeout:240000,polling:500});
  await page.evaluate(MEASURE);
  /* Stage 2D: CSS transitions off, as check:contrast has them. In headless Chromium a transition does not advance while the
     page draws nothing (render on demand), so a view reached from Watch was measured with the dossier, tools and legend
     frozen at the start of their .32 s slide (selected-formation: the drawer off screen). Each state now stands where the
     panels come to rest. */
  await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  page._logs=logs;
  return page;
}
async function settle(page){
  const has=await page.evaluate(()=>!!(window.AUSTERLITZ_DEBUG&&AUSTERLITZ_DEBUG.settle));
  if(has){ await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90));
    /* anything the page does after a frame (the time bar's ResizeObserver): let it run, then lay out and draw once more */
    await page.waitForTimeout(450); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); }
  else await page.waitForTimeout(3200);
}
async function interact(page,it,vp){
  /* the same wheel and pointer handlers a visitor drives, fed as events in one go: with software
     rendering, real input paced by frames takes minutes; the handlers do not depend on pacing.
     setPointerCapture is stubbed for the synthetic pointer (it has no real pointer to capture). */
  await page.evaluate(([it,vp])=>{
    var el=renderer.domElement, cx=Math.round(vp[0]*0.62), cy=Math.round(vp[1]*0.45), spc=el.setPointerCapture;
    el.setPointerCapture=function(){};
    /* Stage 3D (owner decision 48): the wheel zooms toward the cursor, so the zoom is aimed at the orbit target's place on the
       screen (it then zooms about the target, as the wheel did before); a left-drag pans, so the orbit drags press the right
       button (on earlier builds any button orbited) */
    var land=typeof LANDCAM!=="undefined";
    function wheelAt(){ if(!land) return [cx,cy]; camera.updateMatrixWorld(true); var v=orbitTarget.clone().project(camera); return [Math.round((v.x*0.5+0.5)*vp[0]),Math.round((-v.y*0.5+0.5)*vp[1])]; }
    var wa=wheelAt();
    for(var i=0;i<(it.target==="deepest"?0:(it.wheel||0));i++) el.dispatchEvent(new WheelEvent("wheel",{deltaY:-120,clientX:wa[0],clientY:wa[1],bubbles:true,cancelable:true}));
    var o=function(x,y,b){ return {pointerId:1,isPrimary:true,pointerType:"mouse",clientX:x,clientY:y,buttons:b?2:0,button:2,bubbles:true,cancelable:true}; };
    function drag(dx,dy){
      var n=12;
      el.dispatchEvent(new PointerEvent("pointerdown",o(cx,cy,1)));
      for(var k=1;k<=n;k++) el.dispatchEvent(new PointerEvent("pointermove",o(cx+dx*k/n,cy+dy*k/n,1)));
      window.dispatchEvent(new PointerEvent("pointerup",o(cx+dx,cy+dy,0)));
    }
    if(it.target==="deepest"){
      /* centre, as the app does, on the place or formation from which the closest, lowest orbit reaches
         furthest into the ground: target on the ground, eye 86 units out along (-0.55,0.62,0.56) */
      var cands=[], bT=null, bD=-1e9;
      /* the drawn ground: the display height since Stage 2B, the model height on earlier builds */
      var height=(typeof displayHeight==="function")?displayHeight:window.height;
      FEATURES.forEach(function(ft){ var w=W(ft.p[0],ft.p[1]); cands.push([w[0],height(w[0],w[1]),w[1],"place "+ft.id]); });
      Object.keys(FORMATIONS).forEach(function(id){ var q=posNow(id); if(q){ var w=W(q[0],q[1]); cands.push([w[0],height(w[0],w[1]),w[1],"formation "+id]); } });
      cands.forEach(function(c){ for(var q2=0;q2<72;q2++){ var th=q2/72*Math.PI*2;
        var d=height(c[0]+24*Math.sin(th),c[2]+24*Math.cos(th))-(c[1]+24*Math.cos(Math.PI/2-0.03)); if(d>bD){ bD=d; bT=c; } } });
      orbitTarget.set(bT[0],bT[1],bT[2]);
      var dv=new THREE.Vector3(-0.55,0.62,0.56).normalize().multiplyScalar(86);
      camera.position.set(bT[0]+dv.x,bT[1]+dv.y,bT[2]+dv.z); camera.lookAt(orbitTarget);
      window.__target=bT[3];
    }
    if(land&&typeof syncViewOffset==="function") syncViewOffset(true);
    var wb=wheelAt();
    for(var w2=0;w2<(it.target==="deepest"?(it.wheel||0):0);w2++) el.dispatchEvent(new WheelEvent("wheel",{deltaY:-120,clientX:wb[0],clientY:wb[1],bubbles:true,cancelable:true}));
    if(it.dragX||it.dragY) drag(it.dragX||0,it.dragY||0);
    if(it.aim==="deepest"){
      /* at the closest zoom and lowest pitch, turn to the bearing where the drawn ground stands
         highest above the eye's orbit height: the move that took the eye into a hill */
      var tg=orbitTarget, phi=Math.PI/2-0.03, r=24, best=-1e9, bt=0;
      var height=(typeof displayHeight==="function")?displayHeight:window.height;   /* the drawn ground */
      for(var q=0;q<360;q++){ var th=q/360*Math.PI*2;
        var x=tg.x+r*Math.sin(phi)*Math.sin(th), z=tg.z+r*Math.sin(phi)*Math.cos(th), d=height(x,z)-(tg.y+r*Math.cos(phi));
        if(d>best){ best=d; bt=th; } }
      var now=new THREE.Spherical().setFromVector3(camera.position.clone().sub(tg)).theta, dth=bt-now;
      while(dth>Math.PI) dth-=2*Math.PI; while(dth<-Math.PI) dth+=2*Math.PI;
      drag(-dth/0.005,0);                          /* the handlers turn theta by -dx*0.005 */
      window.__intended={depthBelowGround:+best.toFixed(3), bearing:+bt.toFixed(3), target:window.__target||"the case camera's target"};
    }
    el.setPointerCapture=spc;
  },[it,vp]);
}
(async()=>{
  fs.mkdirSync(out,{recursive:true});
  const browser=await chromium.launch({executablePath:process.env.AUSTERLITZ_CHROME||undefined,
    args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  const rp=path.join(out,"report.json");
  let report={html:path.basename(html), md5:md5(html), when:new Date().toISOString(), cases:{}, failures:[]};
  if(fs.existsSync(rp)){ try{ const old=JSON.parse(fs.readFileSync(rp,"utf8")); if(old.md5===report.md5){ report.cases=old.cases||{}; if(old.selfTest) report.selfTest=old.selfTest; } }catch(e){} }
  const pages={}; let current=null, currentKey=null;
  /* fresh cases get their own page; the rest share one page per viewport. A page that is no longer
     needed is closed at once: the pre-Stage-0 build renders every frame, and a hidden page still
     competes for the CPU under software rendering. */
  const ordered=CASES.filter(c=>c.fresh&&c.viewport[0]===1600).concat(CASES.filter(c=>!c.fresh),CASES.filter(c=>c.fresh&&c.viewport[0]!==1600));
  for(const c of ordered){
    const key=c.viewport.join("x")+(c.fresh?":"+c.name:"");
    const reuse=(key===currentKey)||(currentKey&&currentKey.startsWith(c.viewport.join("x")+":")&&!c.fresh&&currentKey.split(":")[0]===c.viewport.join("x"));
    if(!reuse){ if(current&&current!==pages.keep) await current.close(); current=await openPage(browser,c.viewport); }
    currentKey=key; const page=current; pages.last=page;
    const t0=Date.now();
    if(!c.fresh){ await page.evaluate(s=>window.__aus.apply(s),c); await settle(page);
      if(c.interact){ await interact(page,c.interact,c.viewport); await settle(page); } }
    else await settle(page);
    const buf=await page.screenshot({timeout:180000});
    fs.writeFileSync(path.join(out,c.name+".png"),buf);
    const m=await page.evaluate(()=>window.__aus.metrics());
    /* Stage 5E: an eye-level case, the eye's height above the drawn ground and its place at the headquarters */
    if(c.eye) m.eyeLevel=await page.evaluate(()=>{ if(typeof EYE==="undefined") return {on:false,dy:null,want:null,atHQ:false};
      const L=landCam.position, p=posNow(EYES.HQ[commandView]), w=p?W(p[0],p[1]):[NaN,NaN];
      return {on:EYE.on,dy:+(L.y-groundY(L.x,L.z)).toFixed(6),want:+eyeHeight().toFixed(6),atHQ:Math.hypot(L.x-w[0],L.z-w[1])<1e-6}; });
    m.pixels=await page.evaluate(b=>window.__aus.pixels(b),buf.toString("base64"));
    /* Stage 2D: every map-layer text's contrast on the rendered frame (the section E method), and section H's unobstructed
       fraction at 1280 x 720 too (the same page resized, then restored) */
    m.textContrast=await page.evaluate(b=>window.__aus.textContrast?window.__aus.textContrast(b):null,buf.toString("base64"));
    /* Stage 5B (docs/STAGE5_SPEC.md section A.5): the position-confidence marks' share of the free rectangle, as rendered: the same
       view drawn once more without them (a build with the marks; not the first-run views, whose card is not a reading) */
    if(!c.fresh&&await page.evaluate(()=>typeof CONF!=="undefined"&&!!layerOn.confidence)){
      await page.evaluate(()=>{ layerOn.confidence=false; }); await settle(page);
      const off=await page.screenshot({timeout:180000});
      await page.evaluate(()=>{ layerOn.confidence=true; }); await settle(page);
      m.confShare=await page.evaluate(([a,b])=>window.__aus.confShare(a,b),[buf.toString("base64"),off.toString("base64")]);
    }
    /* Stage 5D (docs/STAGE5_SPEC.md section B.4): the evidence skeleton on, the whole day (its densest scope): the map layer's items and
       drops as without it (it is ground drawing, not a map-layer item), map text at AA as rendered; its share of the free rectangle recorded
       (a build with the skeleton; it is off by default, so every other measure here is taken without it) */
    if(!c.fresh&&!c.eye&&await page.evaluate(()=>typeof SKEL!=="undefined")){   /* not at the eye level: the skeleton is not drawn there (5E) */
      const lay=()=>page.evaluate(()=>{ mlLayout(); return {items:ML.stats.items,dropped:ML.stats.dropped,ids:ML.stats.dropped_.slice().sort().join(","),
        anchors:SKEL.marks.length,legs:SKEL.scope?SKEL.scope.legs.length:0}; });
      const s0=await lay();
      await page.evaluate(()=>{ layerOn.skeleton=true; SKEL.day=true; requestRender(3); }); await settle(page);
      const on=await page.screenshot({timeout:180000}), s1=await lay();
      const tc=await page.evaluate(b=>window.__aus.textContrast?window.__aus.textContrast(b):null,on.toString("base64"));
      await page.evaluate(()=>{ layerOn.skeleton=false; SKEL.day=false; requestRender(3); }); await settle(page);
      m.skeleton={anchors:s1.anchors,legs:s1.legs,items:[s0.items,s1.items],dropped:[s0.dropped,s1.dropped],sameDrops:s0.ids===s1.ids,
        belowAA:tc?tc.belowAA:[],minContrast:tc?tc.min:null,share:(await page.evaluate(([a,b])=>window.__aus.confShare(a,b),[on.toString("base64"),buf.toString("base64")])).share};
    }
    if(await page.evaluate(()=>!!window.__aus.unobstructed)){
      /* one drawn frame at each size is enough: the panels are DOM, and the legend decides in that frame whether it fits */
      /* headless Chromium delivers a resize event only with a rendered frame, which a page that draws on demand may not
         produce: the page is told of its new size before it draws (else the layer and the legend fit the old size, and the
         self-test, run later on this page, measured a 1280 x 720 canvas in a 1366 x 768 window) */
      const frame=async()=>{ await page.evaluate(()=>window.dispatchEvent(new Event("resize"))); await page.waitForTimeout(450);
        await page.evaluate(()=>{ if(window.AUSTERLITZ_DEBUG) AUSTERLITZ_DEBUG.settle(2); }); };
      const vp0=page.viewportSize(); await page.setViewportSize({width:1280,height:720}); await frame();
      m.unobstructed720=await page.evaluate(()=>window.__aus.unobstructed());
      /* Stage 3D: after the resize, the landscape's orbit target at the new free rectangle's centre */
      m.focus720=await page.evaluate(()=>window.__aus.focusOffset?window.__aus.focusOffset():null);
      /* Stage 3C: every phase's label whole when current, at 1280 x 720 (one Study view and one Watch view) */
      if(["overview-field","overview-plan"].includes(c.name)) m.phaseLabels720=await page.evaluate(()=>window.__aus.phaseLabels?window.__aus.phaseLabels():null);
      await page.setViewportSize(vp0); await frame();
    }
    m.ms=Date.now()-t0; m.note=c.note;
    if(c.interact) m.intended=await page.evaluate(()=>window.__intended||null);
    report.cases[c.name]=m;
    fs.writeFileSync(rp,JSON.stringify(report,null,1));
    console.log(c.name.padEnd(20)," cam clr",String(m.camera.clearance).padStart(8)," fig max",String(m.figures.maxErr).padStart(7),
      "("+m.figures.count+")"," std",m.standards.maxErr," overlaps",JSON.stringify(m.labels.pairs),
      " black",m.pixels.nearBlack,"solid",m.pixels.solidBlocks," lum",m.pixels.meanLum," smoke/dust edge",m.smokeEdgeAlpha,"/",m.dustEdgeAlpha,
      " mist",m.mist.visible?m.mist.maxAlphaAtCrossing:"-", m.selection?(" sel "+m.selection+" drawer "+m.drawerVisible+" chip "+m.chipVisible):"",
      m.layer?(" | layer placed "+m.layer.placed+" dropped "+m.layer.dropped+" leaders "+m.layer.leaders+" occluded "+m.layer.occluded+" "+m.layer.ms+" ms "+m.layer.nodes+" nodes"+
        " min "+m.layer.minPx+" px, contrast min "+(m.textContrast&&m.textContrast.min)+" | free "+m.unobstructed+" / "+m.unobstructed720):"");
  }
  if(!pages.last||pages.last.isClosed()) pages.last=current=await openPage(browser,[1600,900]);
  const first=pages.last;
  if(TEST&&first){
    const st=await first.evaluate(()=>window.AUSTERLITZ_DEBUG&&AUSTERLITZ_DEBUG.selfTest?AUSTERLITZ_DEBUG.selfTest():null);
    report.selfTest=st;
    if(!st) report.failures.push("build exposes no AUSTERLITZ_DEBUG.selfTest");
    else st.checks.forEach(ch=>{ console.log((ch.ok?"PASS ":"FAIL ")+ch.name+"  "+ch.detail); if(!ch.ok) report.failures.push(ch.name+": "+ch.detail); });
    /* Stage 3C (docs/STAGE3_SPEC.md section H): the slider by real key presses, from 10:00 (a build with the one timeline) */
    if(await first.evaluate(()=>!!document.getElementById("tb-vm"))){
      await first.evaluate(()=>{ setPresentation("study"); setClock(600,{instant:true,force:true,camera:false}); });
      await first.focus("#timerail"); const seq=[["ArrowRight",610],["Shift+ArrowRight",670],["ArrowLeft",660],["PageUp",630],["PageUp",570],["PageDown",630],["Home",240],["End",1080]], got=[];
      for(const [k,want] of seq){ await first.keyboard.press(k); const r=await first.evaluate(()=>({c:clock,v:document.getElementById("timerail").getAttribute("aria-valuenow")}));
        got.push(k+" "+r.c); if(Math.abs(r.c-want)>1e-6||r.v!==String(Math.round(r.c))) report.failures.push("the slider by real key presses: "+k+" gave "+r.c+" (want "+want+"), aria-valuenow "+r.v); }
      const vt=await first.evaluate(()=>{ const r=document.getElementById("timerail"); return {t:r.getAttribute("aria-valuetext"),want:tlText(clock)}; });
      if(vt.t!==vt.want) report.failures.push("the slider's aria-valuetext "+JSON.stringify(vt.t)+", want "+JSON.stringify(vt.want));
      /* an event marker by keyboard: focus the group, step to the third marker, Enter selects it and moves the clock to it (the marker's
         minute: since Stage 5C an event's start, decision 89; before it, an interval's midpoint) */
      await first.evaluate(()=>{ setClock(240,{instant:true,force:true,camera:false}); select(null,null); });
      await first.focus("#evmarks .ev-mark[tabindex='0']"); await first.keyboard.press("ArrowRight"); await first.keyboard.press("ArrowRight"); await first.keyboard.press("Enter");
      const ev=await first.evaluate(()=>{ const a=document.activeElement, o=_evTicks.find(x=>x.el===a);
        return {name:a&&a.getAttribute("aria-label"), mid:o&&(o.t!==undefined?o.t:o.mid), id:o&&o.e.id, clock:clock, sel:selection?selection.kind+":"+selection.id:null}; });
      got.push("event marker Enter: "+ev.name+" → clock "+ev.clock+", "+ev.sel);
      if(!ev.id||Math.abs(ev.clock-ev.mid)>1e-6||ev.sel!=="e:"+ev.id) report.failures.push("an event marker by real key presses: "+JSON.stringify(ev));
      report.sliderKeys=got; console.log("slider by real key presses: "+got.join(", ")); }
    /* Stage 4D (docs/STAGE4_SPEC.md section D.4; decisions 74, 75): Play by a real key press runs at half speed, its button
       pressed; and the Watch view of the low Pratzen case held in a dwell at the phase-3 event start 09:00 keeps every threshold
       of its view (the darkness limit, map text at AA as rendered, drops within its limit), its event lit and named */
    if(await first.evaluate(()=>typeof DWELL!=="undefined")){
      const pr=[], T=require("./thresholds.js");
      await first.evaluate(()=>{ setPresentation("study"); stopPlay(); setClock(730,{instant:true,force:true,camera:false}); if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); });
      await first.keyboard.press(" "); await first.waitForFunction(()=>clock>730,null,{timeout:20000}).catch(()=>{});   /* a frame or two (software WebGL) */
      const pl=await first.evaluate(()=>({playing:playing,speed:speed,clock:clock,pressed:[].filter.call(document.querySelectorAll(".spd-btn"),b=>b.getAttribute("aria-pressed")==="true").map(b=>b.dataset.s)}));
      await first.keyboard.press(" "); const pl2=await first.evaluate(()=>playing);
      pr.push("Space: playing "+pl.playing+" at "+pl.speed+"x (pressed "+pl.pressed.join(",")+"), clock 12:10 -> "+pl.clock.toFixed(2)+"; Space again: playing "+pl2);
      if(!pl.playing||pl.speed!==0.5||pl.pressed.join()!=="0.5"||!(pl.clock>730)||pl2) report.failures.push("Play by a real key press: "+pr[0]);
      const c=require("./cases.js").find(x=>x.name==="pratzen-low");
      await first.evaluate(s=>window.__aus.apply(s),Object.assign({},c,{t:538})); await settle(first);
      const dw=await first.evaluate(()=>{ DWELL.HOLD=1e9; playing=true; dwellReset(); DWELL.expect=clock; var n=0; while(!(DWELL.st&&DWELL.st.stage==="hold")&&n++<400) tickClock(50);
        return {E:DWELL.st&&DWELL.st.E,clock:clock,ev:(dwellEvents()||[]).map(e=>e.id)}; });
      await settle(first);
      const buf=await first.screenshot({timeout:180000}), b64=buf.toString("base64");
      const px=await first.evaluate(b=>window.__aus.pixels(b),b64), tc=await first.evaluate(b=>window.__aus.textContrast(b),b64);
      const st=await first.evaluate(()=>{ mlLayout(); var cap=document.querySelector("#tb-cap .ev.dwell"), lit=document.querySelectorAll("#evmarks .ev-mark.dw").length;
        var r={dropped:ML.stats.dropped,cap:cap?cap.textContent:null,lit:lit}; DWELL.HOLD=1.5; stopPlay(); return r; });
      pr.push("Watch held in the dwell at "+(dw.E!==null?Math.floor(dw.E/60)+":"+String(dw.E%60).padStart(2,"0"):"-")+" ("+dw.ev.join(", ")+"): solid "+(100*px.solidBlack).toFixed(3)+"%, below AA "+tc.belowAA.length+", drops "+st.dropped+" (limit "+T.DROP_LIMIT["pratzen-low"]+"), caption \""+st.cap+"\", "+st.lit+" marker lit");
      if(dw.E!==540||px.solidBlack>T.SOLID_BLACK||tc.belowAA.length||st.dropped>T.DROP_LIMIT["pratzen-low"]||!st.cap||st.lit<1) report.failures.push("the Watch view in a dwell: "+pr[1]);
      report.pacing=pr; console.log("pacing: "+pr.join("; ")); }
    /* Stage 3E (docs/STAGE3_SPEC.md section H): by real key presses, Space and Enter on a focused button press it and do not
       toggle play; a key with Ctrl does nothing; "?" opens the overlay, Tab stays in it, Esc closes it and focus returns */
    if(await first.evaluate(()=>typeof KEYS!=="undefined")){
      const kr=[], bad=[];
      await first.evaluate(()=>{ setPresentation("study"); stopPlay(); setSpeed(1); if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); });
      await first.focus('.spd-btn[data-s="2"]'); await first.keyboard.press(" ");
      let st=await first.evaluate(()=>({speed:speed,playing:playing})); kr.push("Space on 2x: speed "+st.speed+", playing "+st.playing); if(st.speed!==2||st.playing) bad.push("Space on a speed button: "+JSON.stringify(st));
      await first.focus('.spd-btn[data-s="4"]'); await first.keyboard.press("Enter");
      st=await first.evaluate(()=>({speed:speed,playing:playing})); kr.push("Enter on 4x: speed "+st.speed+", playing "+st.playing); if(st.speed!==4||st.playing) bad.push("Enter on a speed button: "+JSON.stringify(st));
      await first.evaluate(()=>{ setSpeed(1); setClock(600,{instant:true,force:true,camera:false}); });
      await first.focus("#play"); await first.keyboard.press("ArrowRight"); await first.keyboard.press("Shift+ArrowLeft");
      st=await first.evaluate(()=>({clock:clock,playing:playing})); kr.push("arrows on the focused Play button: clock "+st.clock); if(st.clock!==600) bad.push("the arrows on a focused button stepped the clock to "+st.clock);
      await first.evaluate(()=>{ document.activeElement.blur(); });
      const c0=await first.evaluate(()=>layerOn.contours); await first.keyboard.press("Control+c"); const c1=await first.evaluate(()=>layerOn.contours);
      kr.push("Ctrl+C: contours "+c0+" -> "+c1); if(c0!==c1) bad.push("Ctrl+C toggled the contours");
      await first.focus("#tourbtn"); await first.keyboard.press("?");
      const h1=await first.evaluate(()=>({open:!document.getElementById("help").hidden,focus:document.activeElement&&document.activeElement.id}));
      await first.keyboard.press("Tab"); const h2=await first.evaluate(()=>document.activeElement&&document.activeElement.id);
      await first.keyboard.press("Tab"); const h3=await first.evaluate(()=>document.activeElement&&document.activeElement.id);
      await first.keyboard.press("Escape"); const h4=await first.evaluate(()=>({open:!document.getElementById("help").hidden,focus:document.activeElement&&document.activeElement.id}));
      kr.push("? on the tour button: open "+h1.open+", focus "+h1.focus+"; Tab "+h2+", Tab "+h3+"; Esc: open "+h4.open+", focus "+h4.focus);
      if(!h1.open||h1.focus!=="help-close"||h2!=="help-body"||h3!=="help-close"||h4.open||h4.focus!=="tourbtn") bad.push("the overlay's focus: "+kr[kr.length-1]);
      await first.evaluate(()=>document.activeElement&&document.activeElement.blur());
      report.keys3E=kr; console.log("keys by real key presses: "+kr.join("; "));
      bad.forEach(b=>report.failures.push("keys by real key presses: "+b)); }
    /* Stage 4B (docs/STAGE4_SPEC.md section A.6): the light through the day, without the shadow toe. The Field vantage and the low
       Pratzen view at 4x every hour 08:00-16:00, and three more views at 1x and 10.33x (the low Pratzen view has its own cases):
       solid near-black within the Stage 0 limit in each (a build with the computed sun) */
    const T=require("./thresholds.js");
    if(await first.evaluate(()=>typeof SUN_DAY!=="undefined")){
      const sw=[];
      for(const [name,t,f] of T.LIGHT_SWEEP){
        const c=require("./cases.js").find(x=>x.name===name), spec=Object.assign({},c,t!==null?{t}:{},f!==null?{factor:f}:{});
        await first.evaluate(s=>window.__aus.apply(s),spec); await settle(first);
        const buf=await first.screenshot({timeout:180000}), px=await first.evaluate(b=>window.__aus.pixels(b),buf.toString("base64"));
        const tag=name+(t!==null?" at "+String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0"):"")+(f!==null?" at "+(f==="model"?"10.33":f)+"x":"");
        sw.push(tag+" "+(100*px.solidBlack).toFixed(3)+"%");
        if(px.solidBlack>T.SOLID_BLACK) report.failures.push("the day's light: "+tag+": solid near-black regions cover "+(100*px.solidBlack).toFixed(3)+"% of the map ("+px.solidBlocks+" blocks; limit 0.05%)"); }
      report.lightSweep=sw; console.log("the day's light (solid near-black): "+sw.join("; ")); }
    /* Stage 4C (docs/STAGE4_SPEC.md section C.6): the valley fog's hours, the Field vantage at 08:00 and the low Pratzen view at 08:30
       at 4x: within the darkness limit, every map text at AA as rendered, drops within the case's limit, the figures under the fog
       still drawn, and the fog at most its cap over the ground (a build with the atmosphere) */
    if(await first.evaluate(()=>typeof ATMO!=="undefined")){
      const fw=[];
      for(const [name,t] of T.FOG_VIEWS){
        const c=require("./cases.js").find(x=>x.name===name);
        await first.evaluate(s=>window.__aus.apply(s),Object.assign({},c,{t,factor:4})); await settle(first);
        const buf=await first.screenshot({timeout:180000}), b64=buf.toString("base64");
        const px=await first.evaluate(b=>window.__aus.pixels(b),b64), tc=await first.evaluate(b=>window.__aus.textContrast(b),b64);
        const st=await first.evaluate(()=>{ mlLayout(); applyAtmo(); var C=ATMO.u.uAtmoC.value, fr=landFreeRect(), worst=0, n=0;
          for(var j=0;j<=6;j++) for(var i=0;i<=8;i++){ var g=groundAt(fr[0]+(fr[2]-fr[0])*i/8,fr[1]+(fr[3]-fr[1])*j/6); if(!g) continue; n++;
            worst=Math.max(worst,atmoAt(landCam.position,new THREE.Vector3(g[0],groundY(g[0],g[1]),g[1]))[1]); }
          var under=0; Object.keys(units).forEach(function(id){ var r=units[id]; if(r.block&&r.block.visible){ var m=GEOREF.DATUM_M+r.block.position.y/DISPLAY.factor*GEOREF.M_PER_WORLD; if(m<C.x) under++; } });
          return {dropped:ML.stats.dropped,cap:C.w,worst:worst,samples:n,under:under}; });
        const tag=name+" at "+String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0");
        fw.push(tag+": solid "+(100*px.solidBlack).toFixed(3)+"%, below AA "+tc.belowAA.length+", drops "+st.dropped+", "+st.under+" formations drawn under the fog, fog at most "+st.worst.toFixed(3)+" (cap "+st.cap.toFixed(2)+")");
        if(px.solidBlack>T.SOLID_BLACK) report.failures.push("the valley fog: "+tag+": solid near-black "+(100*px.solidBlack).toFixed(3)+"%");
        if(tc.belowAA.length) report.failures.push("the valley fog: "+tag+": "+tc.belowAA.length+" map texts below AA: "+tc.belowAA.slice(0,3).join("; "));
        if(st.dropped>T.DROP_LIMIT[name]) report.failures.push("the valley fog: "+tag+": "+st.dropped+" items dropped, over "+T.DROP_LIMIT[name]);
        if(!(st.under>0)) report.failures.push("the valley fog: "+tag+": no formation drawn under the fog");
        if(!(st.worst<=st.cap+1e-9)||!(st.cap>0)) report.failures.push("the valley fog: "+tag+": the fog "+st.worst.toFixed(3)+" against its cap "+st.cap); }
      report.fogViews=fw; console.log("the valley fog: "+fw.join("; ")); }
    /* Stage 4E (docs/STAGE4_SPEC.md section F.2): in the low views the gap, if any, between the apron's far edge and the true
       horizon is drawn in the haze's colour (a pixel test along the horizon, in 32 columns of the free rectangle) */
    if(await first.evaluate(()=>typeof SMOKE!=="undefined")){
      const hv=[];
      for(const [name,fk] of T.HORIZON_VIEWS){
        const c=require("./cases.js").find(x=>x.name===name);
        await first.evaluate(s=>window.__aus.apply(s),Object.assign({},c,{factor:fk})); await settle(first);
        const cols=await first.evaluate(()=>{ landCam.updateMatrixWorld(true); var E=landCam.position, fr=landFreeRect(), W0=renderer.domElement.clientWidth||innerWidth, H0=viewH(), out=[], v=new THREE.Vector3();
          function sy(p){ v.copy(p).project(landCam); return v.z<1?[(v.x*0.5+0.5)*W0,(-v.y*0.5+0.5)*H0]:null; }
          for(var i=0;i<32;i++){ var sx=fr[0]+(i+0.5)/32*(fr[2]-fr[0]), r=new THREE.Vector3(sx/W0*2-1,0,0.5).unproject(landCam).sub(E); r.y=0; if(r.lengthSq()<1e-9) continue; r.normalize();
            var tx=r.x>0?(860-E.x)/r.x:(-860-E.x)/r.x, tz=r.z>0?(760-E.z)/r.z:(-760-E.z)/r.z, t=Math.min(tx,tz); if(!(t>0)) continue;
            var e=sy(new THREE.Vector3(E.x+r.x*t,-0.35,E.z+r.z*t)), h=sy(new THREE.Vector3(E.x+r.x*1800,E.y,E.z+r.z*1800)); if(!e||!h) continue;
            if(h[1]<fr[1]+10||e[1]>fr[3]) continue; out.push([Math.round(sx),Math.round(h[1]),Math.round(e[1])]); }
          return out; });
        await first.evaluate(()=>{ const m=document.getElementById("maplayer"); if(m) m.style.visibility="hidden"; });   /* the ground and the sky only: no map text */
        const buf=await first.screenshot({timeout:180000}), b64=buf.toString("base64");
        await first.evaluate(()=>{ const m=document.getElementById("maplayer"); if(m) m.style.visibility=""; });
        const r=await first.evaluate(([b,cols])=>new Promise(res=>{ const im=new Image(); im.onload=()=>{ const cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height;
          const x=cv.getContext("2d",{willReadFrequently:true}); x.drawImage(im,0,0); const d=x.getImageData(0,0,cv.width,cv.height).data;
          function mean(px,y0,y1){ let s=[0,0,0],n=0; for(let y=Math.max(0,y0);y<=Math.min(cv.height-1,y1);y++) for(let dx=-2;dx<=2;dx++){ const o=(y*cv.width+px+dx)*4; s[0]+=d[o]; s[1]+=d[o+1]; s[2]+=d[o+2]; n++; } return n?s.map(a=>a/n):null; }
          let worst=0, gaps=0; cols.forEach(([px,hy,ey])=>{ if(ey-hy<4) return; gaps++; const g=mean(px,hy+1,ey-2), k=mean(px,hy-8,hy-3); if(!g||!k) return;
            worst=Math.max(worst,Math.abs(g[0]-k[0]),Math.abs(g[1]-k[1]),Math.abs(g[2]-k[2])); });
          res({columns:cols.length,gaps:gaps,worst:+worst.toFixed(1)}); }; im.src="data:image/png;base64,"+b; }),[b64,cols]);
        const tag=name+" at "+(fk==="model"?"10.33":fk)+"x";
        hv.push(tag+": "+r.columns+" columns, "+r.gaps+" with a gap under the horizon, the gap within "+r.worst+" of the sky above it");
        if(r.gaps&&!(r.worst<=T.HORIZON_DE)) report.failures.push("the horizon: "+tag+": the gap under the horizon differs from the sky by "+r.worst+" (limit "+T.HORIZON_DE+")"); }
      report.horizon=hv; console.log("the horizon: "+hv.join("; ")); }
    for(const [name,m] of Object.entries(report.cases)) T.check(name,m).forEach(f=>{ console.log("FAIL "+name+": "+f); report.failures.push(name+": "+f); });
  }
  if(CMP){
    report.compare={};
    for(const c of CASES){
      const a=path.join(CMP,c.name+".png"), b=path.join(out,c.name+".png");
      if(!fs.existsSync(a)) continue;
      report.compare[c.name]=await first.evaluate(async([A,B])=>{
        const load=s=>new Promise(r=>{ const i=new Image(); i.onload=()=>r(i); i.src="data:image/png;base64,"+s; });
        const [ia,ib]=await Promise.all([load(A),load(B)]);
        if(ia.width!==ib.width||ia.height!==ib.height) return {sizeMismatch:true};
        const cv=document.createElement("canvas"); cv.width=ia.width; cv.height=ia.height; const x=cv.getContext("2d");
        x.drawImage(ia,0,0); const da=x.getImageData(0,0,cv.width,cv.height).data;
        x.drawImage(ib,0,0); const db=x.getImageData(0,0,cv.width,cv.height).data;
        let sum=0,big=0; for(let i=0;i<da.length;i+=4){ const d=(Math.abs(da[i]-db[i])+Math.abs(da[i+1]-db[i+1])+Math.abs(da[i+2]-db[i+2]))/3; sum+=d; if(d>16) big++; }
        const n=da.length/4; return {meanAbsDiff:+(sum/n).toFixed(2), changedPx:+(big/n).toFixed(4)};
      },[fs.readFileSync(a).toString("base64"),fs.readFileSync(b).toString("base64")]);
      console.log("compare",c.name.padEnd(20),JSON.stringify(report.compare[c.name]));
    }
  }
  if(first&&first._logs&&first._logs.length) report.consoleWarnings=first._logs.slice(0,20);
  fs.writeFileSync(path.join(out,"report.json"),JSON.stringify(report,null,1));
  if(report.consoleWarnings) console.log("console warnings/errors:",report.consoleWarnings.length,report.consoleWarnings.slice(0,6));
  await browser.close();
  if(TEST){ console.log(report.failures.length?("STAGE0 FAILURES: "+report.failures.length):"STAGE0: all checks passed"); process.exit(report.failures.length?1:0); }
})().catch(e=>{ console.error(e); process.exit(2); });
