/* Final audit after Stage 8, area perf-attribution: where the main thread's script time goes, on several builds, on the same deterministic motions.
   Measurement code only: nothing here writes a source file or changes the application; every hook below lives and dies with its page.
   - openVisitor(browser,html,vp,o): a visitor's page (no ?harness=1: smoke and drift move, as on the device route, tools/step6/perf-run.html),
     its start-up timed by an init script (the first animation frame after the boot guard's "ok", the boot overlay gone, long tasks, the main
     thread quiet), the first-run card closed by a real Escape key press; (o.stub, default on) from the animation frame after the first frame
     drawn (the start-up's first frame is drawn for real; INIT) the WebGL context's draw and clear calls replaced by no-ops FOR THE REST OF THE PAGE'S LIFE (own properties shadowing the prototype's methods; three r128 looks them up at each call),
     so that three.js's whole render path runs (traversal, culling, sorting, state, uniforms, buffer uploads, every pass) while SwiftShader
     rasterises nothing, and the start-up's raster backlog drained by one readPixels (timed). Without this a frame here takes 4-5 s of SwiftShader
     raster work and the GL calls block on it (flow control): the first two attempts' pilots, scratchpad pilot-now*.txt.
   - setup(page,key): the device route's own set-up (tools/step6/perf-route.js: apply(spec) = applyCase + settle(30); Play: setFollow, settle, setSpeed).
   - runMotion(browser,page,o): the motion driver (tools/visual/motion.js inPage: the app's loop run one frame at a time on the driver's clock,
     o.frameMs a frame, the WebGL draw on: renderer.render runs, only the native draw calls are the no-ops above). Per frame, in this order:
     the motion's input (orbit "drag": a right-button pointermove through the app's own handler, as a visitor's; orbit "route": the camera written
     as the device route's orbitStep writes it, perf-route.js:166-170, outside the timed span as there; "held": requestRender(2), as the route's
     held segment), then window.loop() timed (the app's whole frame: the device route's js), then OUTSIDE the timed span the style and layout
     flushed (__paFlush: the browser does this after each animation frame on a device, outside the route's js) and the GL command stream synced
     (__paSync: getError, a round trip). Each named step of the frame timed by a wrapper on its global (STEP_WRAP; renderer.render as "three.render").
     Optional CDP Profiler profile over exactly those frames (sampling o.sampleUs): the runner is the named function __paRun, the flush __paFlush
     and the sync __paSync, so the aggregation keeps the frames and sets the rest aside. The renderer's main thread's CPU time and its time
     waiting for a CPU (/proc schedstat: load-independent and contention measures) over the timed frames, and the GPU process's CPU (all threads).
   - aggregate(profile,frames): self time by function and by subsystem, inclusive time of the per-frame steps, per frame. */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../lib.js");
const TR=require("../../visual/three-route.js");
const MD=require("../../visual/motion.js");

/* the device route's vantages (tools/step6/perf-route.js:29) */
const OV=[-27,272,41,-27,0,9], FIELD=[-195,92,156,-33,4,-2];
const MOTIONS={
  "play-half":     {kind:"play",  spec:{t:510, presentation:"watch", mode:"terrain", cam:FIELD}, speed:0.5, note:"Play at half speed under Follow from 08:30, Watch, the Field vantage (device route play-half, perf-route.js:263-265)"},
  "overview-held": {kind:"held",  spec:{t:570, presentation:"watch", mode:"terrain", cam:OV}, note:"the Overview vantage, 09:30, Watch, held and drawn every frame (device route overview held, perf-route.js:243-244)"},
  "overview-route":{kind:"route", spec:{t:570, presentation:"watch", mode:"terrain", cam:OV}, note:"the Overview, 09:30, Watch, orbiting at 20 degrees a second by the route's own camera writes (device route overview orbit, perf-route.js:166-170): decision 268's segment"},
  "overview-drag": {kind:"drag",  spec:{t:570, presentation:"watch", mode:"terrain", cam:OV}, note:"the Overview, 09:30, Watch, orbiting at 20 degrees a second by a right-button drag through the app's handler (a visitor's orbit)"},
  "ph8-drag":      {kind:"drag",  spec:{t:880, presentation:"watch", mode:"terrain", cam:OV}, note:"phase 8, 14:40, the Overview, Watch, orbiting by a right-button drag (the task's motion; device route ph8-overview orbits by camera writes)"},
  "ph8-route":     {kind:"route", spec:{t:880, presentation:"watch", mode:"terrain", cam:OV}, note:"phase 8, 14:40, the Overview, Watch, orbiting by the route's camera writes (device route ph8-overview orbit)"}
};

/* recorded in the page before any of its scripts runs: when the boot guard's first frame came (AUS_BOOT.done), when the boot overlay went,
   and every long task (PerformanceObserver), all in the page's own performance.now() */
const INIT=function(arg){
  var R=window.__paBoot={firstFrame:null, bootGone:null, long:[], t:[], stubAt:null, stub:null};
  try{ new PerformanceObserver(function(l){ l.getEntries().forEach(function(e){ R.long.push([Math.round(e.startTime),Math.round(e.duration)]); }); }).observe({type:"longtask",buffered:true}); }catch(e){}
  (function poll(){
    try{
      var now=performance.now();
      if(R.firstFrame===null&&window.AUS_BOOT&&window.AUS_BOOT.done){ R.firstFrame=Math.round(now);
        /* arg.stub: the draw calls made no-ops from the animation frame after the first frame drawn (the start-up's first frame drawn for real) */
        if(arg&&arg.stub&&typeof renderer!=="undefined"&&renderer){ R.stub=(0,eval)("("+arg.stubSrc+")")(true); R.stubAt=Math.round(performance.now()); } }
      if(R.bootGone===null&&document.readyState!=="loading"&&!document.getElementById("boot")&&typeof window.camera!=="undefined") R.bootGone=Math.round(now);
    }catch(e){}
    if(R.firstFrame===null||R.bootGone===null) requestAnimationFrame(poll);
  })();
};
/* the draw and clear calls made no-ops for the page's life (see the header); the instanced draws of WebGL1's extension too if the context is WebGL1 */
const STUB_ON=function(noDrain){
  var glc=renderer.getContext(), N=["drawElements","drawArrays","drawElementsInstanced","drawArraysInstanced","drawRangeElements","clear","blitFramebuffer"], done=[];
  N.forEach(function(k){ if(typeof glc[k]==="function"){ glc[k]=function(){}; done.push(k); } });
  if(!renderer.capabilities.isWebGL2){ var ext=glc.getExtension("ANGLE_instanced_arrays"); if(ext){ ["drawArraysInstancedANGLE","drawElementsInstancedANGLE"].forEach(function(k){ ext[k]=function(){}; done.push(k); }); } }
  if(noDrain===true) return {stubbed:done, webgl2:!!renderer.capabilities.isWebGL2};
  var b=new Uint8Array(4), t=performance.now(), fb=glc.getParameter(glc.FRAMEBUFFER_BINDING);
  if(fb===null) glc.readPixels(0,0,1,1,glc.RGBA,glc.UNSIGNED_BYTE,b); else glc.getError();
  return {stubbed:done, webgl2:!!renderer.capabilities.isWebGL2, drainMs:+(performance.now()-t).toFixed(1), drainBy:fb===null?"readPixels":"getError"};
};
const DRAIN=function(){ var glc=renderer.getContext(), b=new Uint8Array(4), t=performance.now(), fb=glc.getParameter(glc.FRAMEBUFFER_BINDING);
  if(fb===null) glc.readPixels(0,0,1,1,glc.RGBA,glc.UNSIGNED_BYTE,b); else glc.getError(); return +(performance.now()-t).toFixed(1); };

async function openVisitor(browser,html,vp,o){
  o=o||{};
  const page=await browser.newPage({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:1,reducedMotion:"no-preference"});
  let bcdp=null;
  if(o.profileBoot){ bcdp=await page.context().newCDPSession(page); await bcdp.send("Profiler.enable"); await bcdp.send("Profiler.setSamplingInterval",{interval:o.profileBoot}); await bcdp.send("Profiler.start"); }
  page._log=[];
  page.on("console",m=>{ const t=m.type(); if(t==="warning"||t==="error") page._log.push({type:t,text:m.text().slice(0,300)}); });
  page.on("pageerror",e=>page._log.push({type:"pageerror",text:String(e.message).slice(0,300)}));
  await TR.routeThree(page);
  await page.addInitScript(INIT,{stub:o.stub!==false&&o.stubBoot!==false, stubSrc:STUB_ON.toString()});
  const t0=Date.now();
  await page.goto("file://"+path.resolve(html),{waitUntil:"commit",timeout:180000});
  await TR.waitBoot(page,300000,250);
  const nodeMs=Date.now()-t0;
  await page.waitForFunction(()=>window.__paBoot&&window.__paBoot.firstFrame!==null&&window.__paBoot.bootGone!==null,null,{timeout:120000,polling:200});
  /* the main thread quiet: the last long task's end, read after 3 s without a new one (or 60 s) */
  const quiet=await page.evaluate(()=>new Promise(res=>{ var t0=performance.now(), last=-1, n=-1;
    (function chk(){ var L=window.__paBoot.long; if(L.length!==n){ n=L.length; last=performance.now(); }
      if(performance.now()-last>3000||performance.now()-t0>60000) res(true); else setTimeout(chk,250); })(); }));
  const boot=await page.evaluate(()=>{ var R=window.__paBoot, nav=performance.getEntriesByType("navigation")[0]||{}, L=R.long;
    var lastEnd=L.length?Math.max.apply(null,L.map(function(x){ return x[0]+x[1]; })):null;
    return {domReady:Math.round(nav.domContentLoadedEventEnd||0), loadEvent:Math.round(nav.loadEventEnd||0), firstFrame:R.firstFrame, bootGone:R.bootGone,
      longTasks:L.length, longMs:L.reduce(function(s,x){ return s+x[1]; },0), longest:L.length?Math.max.apply(null,L.map(function(x){ return x[1]; })):0,
      lastLongEnd:lastEnd, long:L.slice(0,40), bootms:typeof BOOTMS!=="undefined"?JSON.parse(JSON.stringify(BOOTMS)):null}; });
  boot.nodeMs=nodeMs; boot.quiet=quiet;
  if(bcdp){ const {profile}=await bcdp.send("Profiler.stop"); await bcdp.send("Profiler.disable"); await bcdp.detach(); page._bootProfile=profile; }
  /* the first-run card closed by a real key press (Escape: "closes it where it stands", decision 118) */
  const cardOpen=await page.evaluate(()=>{ var f=document.getElementById("firstrun"); return !!(f&&!f.hidden&&getComputedStyle(f).display!=="none"); });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  boot.cardOpenAtStart=cardOpen;
  boot.cardClosedByEscape=await page.evaluate(()=>{ var f=document.getElementById("firstrun"); return !(f&&!f.hidden&&getComputedStyle(f).display!=="none"); });
  if(o.stub!==false){ const pre=await page.evaluate(()=>({stub:window.__paBoot.stub, at:window.__paBoot.stubAt}));
    if(pre.stub){ boot.stub=Object.assign({at:pre.at},pre.stub); boot.stub.drainMs=await page.evaluate(DRAIN); }
    else boot.stub=await page.evaluate(STUB_ON);
    boot.stub.drain2=await page.evaluate(DRAIN); }
  page._boot=boot;
  return page;
}

/* the route's set-up on the app's own globals (tools/step6/perf-route.js:110-113, 263) */
async function setup(page,key){
  const M=MOTIONS[key];
  return page.evaluate(M=>{
    var D=AUSTERLITZ_DEBUG;
    if(typeof setSpeed==="function") setSpeed(0.5);
    D.applyCase(JSON.parse(JSON.stringify(M.spec)),null); D.settle(30);
    if(M.kind==="play"){ setFollow(true); D.settle(30); setSpeed(M.speed); }
    return {clock:clock, mode:mode, presentation:typeof presentation!=="undefined"?presentation:null, follow:!freeCam, fx:FX.on, fxScale:FX.scale, lowTier:typeof lowTier!=="undefined"?lowTier:null,
      shadow:renderer.shadowMap.enabled, factor:DISPLAY.factor, px:renderer.getPixelRatio(), playing:playing, vw:innerWidth, vh:innerHeight, cull:typeof CULL!=="undefined"?!!CULL.on:null};
  },M);
}

/* the frame's named steps, each timed by a wrapper on its global (only those the build has); renderer.render as "three.render" */
const STEP_WRAP=["syncFollow","openingWatch","frameState","paintDevStats","tickClock","followStep","dwellAdvance","setProg","updateVisibility","syncViewOffset",
  "renderFrame","applyLight","placeLights","applyAtmo","domeFollow","renderFrameNow","arrowCap","mlLayout","renderFX","renderStandard","gdepthPass","drawOnArrows",
  "kitLodFrame","skelUpdate","toastRelayout","placeToast"];
/* the frames, in three evaluates: BEGIN (the driver started, the motion begun, the warm-up frames), TIMED (the frames measured, each timed in
   real time; the CPU counters and the profiler wrap exactly this evaluate), END (the motion ended, the wrappers removed, the driver stopped).
   Between them the page's event loop runs with the app's own loop held by the driver (as tools/visual/motion.js runReal does). */
const BEGIN=function(a){
  var rn=window.__paRealNow, D=window.__md, glc=renderer.getContext();
  var S=window.__paS={a:a, x:0, c:null, err:null, wrapped:{}, acc:{}, nc:{}, route:null, i:0};
  D.start({gl:true, frameMs:a.frameMs});
  /* the step wrappers, after the driver's own (it wraps mlLayout and mlCollect in start; END removes these before its stop) */
  a.steps.forEach(function(k){ var f=window[k]; if(typeof f!=="function") return; S.wrapped[k]=f; S.acc[k]=0; S.nc[k]=0;
    window[k]=function(){ var t=rn(); try{ return f.apply(this,arguments); } finally{ S.acc[k]+=rn()-t; S.nc[k]++; } }; });
  var rr=renderer.render; S.wrapped["three.render"]=rr; S.acc["three.render"]=0; S.nc["three.render"]=0;
  renderer.render=function(){ var t=rn(); try{ return rr.apply(this,arguments); } finally{ S.acc["three.render"]+=rn()-t; S.nc["three.render"]++; } };
  var c=S.c=D.centre(); S.x=c[0];
  /* the route's orbitStep (perf-route.js:166-170): 20 degrees a second about the target, written through the app's camera and clamp */
  if(a.kind==="route"){ var L=landCam, T=orbitTarget.clone(), off=L.position.clone().sub(T);
    S.route={L:L, T:T, r:Math.hypot(off.x,off.z), a0:Math.atan2(off.z,off.x), y:off.y}; }
  S.input=function(){
    if(a.kind==="drag"){ S.x+=a.pxPerFrame; D.move(S.x,c[1],2); }
    else if(a.kind==="route"){ var R=S.route, s=(S.i+1)*a.frameMs/1000, an=R.a0+s*Math.PI/9;
      R.L.position.set(R.T.x+R.r*Math.cos(an),R.T.y+R.y,R.T.z+R.r*Math.sin(an)); orbitTarget.copy(R.T); R.L.lookAt(R.T); clampCamera(); requestRender(2); }
    else if(a.kind==="held") requestRender(2);
    S.i++;
  };
  try{
    if(a.kind==="play"){ togglePlay(); }
    else if(a.kind==="drag"){ D.down(c[0],c[1],2); }
    for(var i=0;i<a.warm;i++){ S.input(); D.frame(); document.documentElement.offsetHeight; glc.getError(); }
  }catch(e){ S.err=String(e&&e.stack||e).slice(0,600); }
  var b=new Uint8Array(4), t=rn(); if(glc.getParameter(glc.FRAMEBUFFER_BINDING)===null) glc.readPixels(0,0,1,1,glc.RGBA,glc.UNSIGNED_BYTE,b); else glc.getError();
  return {err:S.err, clock:clock, playing:playing, drainMs:+(rn()-t).toFixed(1), wrapped:Object.keys(S.wrapped)};
};
const TIMED=function __paRun(n){
  var rn=window.__paRealNow, D=window.__md, S=window.__paS, glc=renderer.getContext();
  function __paFlush(){ return document.documentElement.offsetHeight; }
  function __paSync(){ return glc.getError(); }
  var keys=Object.keys(S.acc), steps={}; keys.forEach(function(k){ steps[k]=[]; S.acc[k]=0; S.nc[k]=0; });
  var M0=typeof MLS!=="undefined"?JSON.parse(JSON.stringify(MLS.stats)):null, ncalls={};
  var res={t:[], info:[], cull:[], ml:[], steps:steps, clock0:clock, clock1:null, err:null};
  try{
    for(var i=0;i<n;i++){
      var t0=rn(); S.input(); keys.forEach(function(k){ S.acc[k]=0; }); var t1=rn(); D.frame(); var t2=rn();
      __paFlush(); var t3=rn(); __paSync(); var t4=rn();
      var ri=renderer.info.render; res.t.push([+(t1-t0).toFixed(3),+(t2-t1).toFixed(3),+(t3-t2).toFixed(3),+(t4-t3).toFixed(3)]); res.info.push([ri.calls,ri.triangles]);
      keys.forEach(function(k){ steps[k].push(+S.acc[k].toFixed(3)); });
      if(typeof CULL!=="undefined"&&CULL.frame) res.cull.push([CULL.frame.tests,CULL.frame.culled,CULL.frame.refresh,CULL.frame.inst]);
      if(typeof ML!=="undefined"&&ML.stats) res.ml.push([ML.stats.placed||0,ML.stats.dropped||0,ML.stats.held||0,typeof MLS!=="undefined"?(MLS.moving?1:0)+(MLS.pass?2:0)+(MLS.fresh?4:0):-1]);
    }
  }catch(e){ res.err=String(e&&e.stack||e).slice(0,600); }
  keys.forEach(function(k){ ncalls[k]=S.nc[k]; });
  res.ncalls=ncalls;
  if(M0){ var M1=MLS.stats; res.mls={passes:M1.passes-M0.passes, moving:M1.moving-M0.moving, rest:M1.rest-M0.rest, fresh:M1.fresh-M0.fresh}; }
  res.clock1=clock;
  return res;
};
const END=function(){
  var D=window.__md, S=window.__paS, a=S.a;
  try{ if(a.kind==="drag") D.up(S.x,S.c[1],2); if(a.kind==="play"&&playing) stopPlay(); }catch(e){}
  Object.keys(S.wrapped).forEach(function(k){ if(k==="three.render") renderer.render=S.wrapped[k]; else window[k]=S.wrapped[k]; });
  D.stop(); window.__paS=null;
  if(typeof setSpeed==="function") setSpeed(0.5);
  return {clock:clock, playing:playing};
};

/* the browser's processes (CDP SystemInfo): the renderers' main threads (a process's main thread has its pid as tid; headless_shell names it
   after the binary, not CrRendererMain) and the GPU process's threads; their CPU time from schedstat (nanoseconds on the CPU, nanoseconds
   runnable but waiting for a CPU): the main thread's own CPU, blind to time spent blocked (a GL call waiting for the GPU process) */
async function procs(browser){
  const s=await browser.newBrowserCDPSession(); const info=await s.send("SystemInfo.getProcessInfo"); await s.detach();
  const ren=[], gpu=[];
  info.processInfo.forEach(p=>{ if(p.type==="renderer") ren.push({pid:p.id, tid:p.id}); else if(p.type==="GPU"){ let tids=[]; try{ tids=fs.readdirSync("/proc/"+p.id+"/task"); }catch(e){} tids.forEach(t=>gpu.push({pid:p.id, tid:+t})); } });
  return {ren, gpu};
}
function sched(th){ return th.map(x=>{ try{ const v=fs.readFileSync("/proc/"+x.pid+"/task/"+x.tid+"/schedstat","utf8").trim().split(/\s+/).map(Number); return {run:v[0], wait:v[1]}; }catch(e){ return {run:0, wait:0}; } }); }
function loadavg(){ try{ return fs.readFileSync("/proc/loadavg","utf8").split(" ").slice(0,3).map(Number); }catch(e){ return null; } }

async function runMotion(browser,page,o){
  await page.evaluate(()=>{ if(!window.__paRealNow) window.__paRealNow=performance.now.bind(performance); });
  await page.evaluate(MD.inPage);
  const P=await procs(browser);
  const t0=Date.now(), la0=loadavg();
  const b=await page.evaluate(BEGIN,{kind:o.kind, warm:o.warm, frameMs:o.frameMs, pxPerFrame:o.pxPerFrame||0, steps:STEP_WRAP});
  let cdp=null;
  if(o.profile){ cdp=await page.context().newCDPSession(page); await cdp.send("Profiler.enable"); await cdp.send("Profiler.setSamplingInterval",{interval:o.sampleUs||200}); await cdp.send("Profiler.start"); }
  const s0=sched(P.ren), g0=sched(P.gpu), t1=Date.now();
  const r=await page.evaluate(TIMED,o.n);
  const s1=sched(P.ren), g1=sched(P.gpu), t2=Date.now();
  if(cdp){ const {profile}=await cdp.send("Profiler.stop"); await cdp.send("Profiler.disable"); await cdp.detach(); r.profile=profile; }
  const e=await page.evaluate(END);
  /* the page's main thread: the renderer whose main thread's CPU moved most over the timed frames */
  let k=0, best=-1; s0.forEach((x,i)=>{ const d=s1[i].run-x.run; if(d>best){ best=d; k=i; } });
  const gRun=g0.reduce((s,x,i)=>s+(g1[i].run-x.run),0)/1e6;
  r.cpu={thread:P.ren[k]||null, runMs:best/1e6, waitMs:P.ren.length?(s1[k].wait-s0[k].wait)/1e6:null, wallMs:t2-t1, gpuRunMs:+gRun.toFixed(1), gpuThreads:P.gpu.length};
  r.begin=b; r.end=e; r.wallS=+((Date.now()-t0)/1000).toFixed(1); r.load=[la0,loadavg()];
  return r;
}

/* ---- the profile's aggregation ---- */
const GL_NATIVE=/^(drawElements|drawArrays|drawElementsInstanced|drawArraysInstanced|uniform[1-4][fi]v?|uniform[1-4]u?i?v?|uniformMatrix[234]fv|bindBuffer|bufferData|bufferSubData|bindTexture|activeTexture|useProgram|enable|disable|blendFunc|blendFuncSeparate|blendEquation|blendEquationSeparate|depthFunc|depthMask|colorMask|clear|clearColor|clearDepth|clearStencil|viewport|scissor|bindFramebuffer|framebufferTexture2D|vertexAttribPointer|vertexAttribIPointer|enableVertexAttribArray|disableVertexAttribArray|vertexAttribDivisor|bindVertexArray|createVertexArray|deleteVertexArray|cullFace|frontFace|polygonOffset|stencilFunc|stencilOp|stencilMask|texImage2D|texSubImage2D|texParameteri|pixelStorei|generateMipmap|getUniformLocation|getAttribLocation|getProgramParameter|getShaderParameter|getError|getParameter|getExtension|lineWidth|drawBuffers|invalidateFramebuffer|readPixels|finish|flush|getContextAttributes|isContextLost|vertexAttrib[1-4]fv?|bindRenderbuffer|renderbufferStorage|blitFramebuffer|readBuffer|texStorage2D|copyTexSubImage2D|compileShader|linkProgram|shaderSource|attachShader|createProgram|createShader|deleteShader|getProgramInfoLog|getShaderInfoLog|getActiveUniform|getActiveAttrib|bindAttribLocation|createBuffer|createTexture|createFramebuffer|checkFramebufferStatus|depthRange|clearBufferfv|clearBufferiv)$/;
const SPECIAL={"(garbage collector)":"GC","(program)":"(program)","(idle)":"(idle)","(root)":"(root)"};
/* the subsystems, by function name (the first rule that matches, walking the stack from the sample's top frame down to the first app frame) */
const SUBSYS=[
  ["map layer (ml*)", /^(ml[A-Z_]|mlt|ML\b|labelText|placeLabels?|mlHover|mlFar|mlBand|mlStab|mlHold|mlCands|mlCollect|mlLayout|mlPlace|mlPanels|mlObstacles)/],
  ["panels and free rectangle (freeRect, landPanels, panelRects)", /^(freeRect|landPanels|landFreeRect|freeCentre|panelRect|panelsNow|vp)$/],
  ["gait/anim (gait*, anim*, faceClock, poseBlock)", /^(gait|anim|aPart|faceClock|enemyFacing|poseBlock|clockRate)/],
  ["culling (cull*)", /^cull/],
  ["kit level of detail (kitLod*)", /^kitLod/],
  ["figures' layout (layoutFigs, placeStandards, showBattalions, seat)", /^(layoutFigs|placeStandards|showBattalions|seat|kitAllocate|stdCount|settleBlock|layBlock|blockPose)/],
  ["outlines (outline*)", /^(outline|makeOutline)/],
  ["confidence (conf*, groundPatch)", /^(conf|groundPatch)/],
  ["smoke and dust (smoke*, dust*)", /^(smoke|dust|puff)/],
  ["atmosphere (atmo*, applyAtmo, fog*, domeFollow)", /^(atmo|applyAtmo|fog|domeFollow|ATMO)/],
  ["light (applyLight, placeLights, lightAt, shadow*)", /^(applyLight|placeLights|lightAt|mixRow|lightRow|shadowReceivers|groundMinY|sunWorldDir|drawnAltitude|SHADOW)/],
  ["arrows (arrow*, capPts, ribbon*, drawOn*)", /^(arrow|capPts|capFactors|capRows|capAt|capQuant|ribbon|drawOn|BORDER|border|headInside)/],
  ["skeleton/routes (skel*, route*)", /^(skel|route)/],
  ["eyes/knowledge (know*, eyes*, readHidden, drawnKnow)", /^(know|eyes|readHidden|readUnknown|drawnKnow|stateKnown|knowledgeOf)/],
  ["toast and tips (toast*, placeToast, tipSync)", /^(toast|placeToast|tipSync)/],
  ["clock/Follow/camera (tickClock, followStep, syncFollow, syncViewOffset, tween, orbit, clamp*)", /^(tickClock|followStep|syncFollow|syncViewOffset|_runTween|tween|dwell|orbit|orbitPlace|clampCamera|camFloor|presetFrame|fitOverview|setProg|openingWatch|openingPlayWatch|paintDevStats|frameState|ambientNow|setClock)/],
  ["ground queries (groundY*, height*, displayHeight)", /^(groundY|groundYFast|height|hAt|displayHeight|localHeight|regionalH|groundHeights)/],
  ["formation model (stateAt, posNow, legPath, ...)", /^(stateAt|posNow|posAtT|legPath|statusAt|confAt|posAt|trackAt|unitState|leafOf|aggReading|formationAt|activeAt|routeAxis)/],
  ["updateVisibility (other, inline)", /^updateVisibility$/],
  ["render path (renderFrame*, renderFX, renderStandard, gdepth*, pass)", /^(renderFrame|renderFrameNow|renderFX|renderStandard|gdepthPass|sizeFX|devMark|pass)$/],
  ["timeline/DOM UI (tl*, caption*, fitCaption, syncDock, syncInert)", /^(tl[A-Z]|fitCaption|capTitle|caption|syncDock|updateCaption|paintSpeedBtn|syncInert|evClock|evTimeText)/]
];
function classify(nodeById,parent,sample){
  /* returns [category, topName] */
  const n=nodeById.get(sample), cf=n.callFrame, name=cf.functionName||"(anonymous)";
  if(SPECIAL[name]) return [SPECIAL[name],name];
  if(!cf.url&&GL_NATIVE.test(name)) return ["WebGL calls (native)",name];
  if(/three/.test(cf.url)) return ["three.js (JS)",name];
  if(!cf.url) return ["native/builtin (other)",name];
  /* app code: walk down to the first frame with a subsystem name */
  let id=sample;
  while(id!=null){ const m=nodeById.get(id), nm=m.callFrame.functionName||"";
    if(/three/.test(m.callFrame.url)) break;
    for(const [cat,re] of SUBSYS) if(re.test(nm)) return [cat,name];
    id=parent.get(id); }
  return ["app (other)",name];
}
function aggregate(profile,nFrames,o){
  o=o||{};
  const nodeById=new Map(), parent=new Map();
  profile.nodes.forEach(n=>{ nodeById.set(n.id,n); (n.children||[]).forEach(c=>parent.set(c,n.id)); });
  const S=profile.samples, D=profile.timeDeltas, N=S.length;
  const med=(()=>{ const a=D.slice(1).filter(x=>x>0).sort((a,b)=>a-b); return a.length?a[a.length>>1]:200; })();
  const dur=i=>i+1<N?Math.max(0,D[i+1]):med;   /* a sample's time: the gap to the next */
  const caches={run:new Map(), sync:new Map(), flush:new Map()};
  const stackHas=(id,fname,cache)=>{ if(cache.has(id)) return cache.get(id); let k=id, r=false; while(k!=null){ if(nodeById.get(k).callFrame.functionName===fname){ r=true; break; } k=parent.get(k); } cache.set(id,r); return r; };
  const selfFn={}, cat={}, incl={}, total={run:0, sync:0, flush:0, outside:0, samples:0};
  /* the subsystem's caller: within three.js samples, the app function that called into three (so that three's time can be told by caller) */
  const threeBy={};
  /* the callers of a few hot functions: the first three distinct named functions below the sample's top frame */
  const WATCH=o.watch||["freeRect","viewport","getProgramCacheKey","renderBufferDirect","activeTexture","uniformMatrix4fv","vertexAttribPointer","bufferSubData"], callers={};
  const STEPS=o.steps||[];
  for(let i=0;i<N;i++){
    const s=S[i], d=dur(i)/1000;   /* ms */
    if(o.root!==null){ if(!stackHas(s,o.root||"__paRun",caches.run)){ total.outside+=d; continue; }
      if(stackHas(s,"__paSync",caches.sync)){ total.sync+=d; continue; }
      if(stackHas(s,"__paFlush",caches.flush)){ total.flush+=d; continue; } }
    else if(nodeById.get(s).callFrame.functionName==="(idle)"){ total.outside+=d; continue; }
    total.run+=d; total.samples++;
    const n=nodeById.get(s), cf=n.callFrame, key=(cf.functionName||"(anonymous)")+" "+(cf.url?(/three/.test(cf.url)?"three":"app"):"native")+":"+(cf.lineNumber+1);
    selfFn[key]=(selfFn[key]||0)+d;
    const [c]=classify(nodeById,parent,s); cat[c]=(cat[c]||0)+d;
    if(c==="three.js (JS)"||c==="WebGL calls (native)"){ let k=s, caller=null; while(k!=null){ const m=nodeById.get(k); if(m.callFrame.url&&!/three/.test(m.callFrame.url)){ caller=m.callFrame.functionName||"(anonymous)"; break; } k=parent.get(k); }
      threeBy[caller||"(none)"]=(threeBy[caller||"(none)"]||0)+d; }
    if(WATCH.indexOf(cf.functionName)>=0){ const ch=[]; let k=parent.get(s); while(k!=null&&ch.length<3){ const nm=nodeById.get(k).callFrame.functionName; if(nm&&nm!==cf.functionName&&ch.indexOf(nm)<0) ch.push(nm); k=parent.get(k); }
      const cm=callers[cf.functionName]=callers[cf.functionName]||{}; const ck=ch.join(" < "); cm[ck]=(cm[ck]||0)+d; }
    /* inclusive: each named step once per sample */
    const seen=new Set(); let k=s;
    while(k!=null){ const nm=nodeById.get(k).callFrame.functionName; if(nm&&STEPS.indexOf(nm)>=0&&!seen.has(nm)){ seen.add(nm); incl[nm]=(incl[nm]||0)+d; } k=parent.get(k); }
  }
  const per=x=>+(x/nFrames).toFixed(4);
  const top=Object.entries(selfFn).sort((a,b)=>b[1]-a[1]).slice(0,o.top||60).map(([k,v])=>({fn:k, msPerFrame:per(v)}));
  const cats=Object.entries(cat).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({cat:k, msPerFrame:per(v), share:+(v/total.run).toFixed(4)}));
  const inc={}; STEPS.forEach(s=>inc[s]=per(incl[s]||0));
  const tb=Object.entries(threeBy).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([k,v])=>({caller:k, msPerFrame:per(v)}));
  const cal={}; Object.keys(callers).forEach(f=>{ cal[f]=Object.entries(callers[f]).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>({via:k, msPerFrame:per(v)})); });
  return {frames:nFrames, sampleUsMedian:med, runMsPerFrame:per(total.run), syncMsPerFrame:per(total.sync), flushMsPerFrame:per(total.flush), samplesInRun:total.samples, top, cats, incl:inc, threeBy:tb, callers:cal};
}
const STEPS=["loop","syncFollow","openingWatch","paintDevStats","frameState","_runTween","tickClock","followStep","dwellAdvance","openingPlayWatch","setProg","updateVisibility","syncViewOffset",
  "renderFrame","applyLight","placeLights","applyAtmo","domeFollow","renderFrameNow","arrowCap","mlLayout","mlCollect","mlStabBegin","renderFX","renderStandard","gdepthPass","render",
  "gaitStep","poseBlock","kitLodFrame","kitLod","kitLodSet","layoutFigs","placeStandards","outlinePlace","confPlace","smokePlace","cullTest","cullRefresh","cullStale","drawOnArrows","skelUpdate",
  "routeScope","knowAtClock","faceClock","groundYFast","groundY","stateAt","posNow","landPanels","freeRect","mlPanels","toastRelayout","placeToast","projectObject","renderObjects","renderObject",
  "renderBufferDirect","setProgram","updateMatrixWorld","intersectsObject","onPointerMove","dispatchEvent"];
function stats(a){ const s=a.slice().sort((x,y)=>x-y), n=s.length; if(!n) return {n:0}; const q=p=>s[Math.min(n-1,Math.floor(p*(n-1)+0.5))];
  return {n, mean:+(s.reduce((x,y)=>x+y,0)/n).toFixed(3), p10:+q(0.1).toFixed(3), p50:+q(0.5).toFixed(3), p90:+q(0.9).toFixed(3), p95:+q(0.95).toFixed(3), max:+s[n-1].toFixed(3)}; }
module.exports={A, MD, MOTIONS, OV, FIELD, openVisitor, setup, runMotion, aggregate, STEPS, STEP_WRAP, stats, classify, SUBSYS, procs, sched, loadavg};
