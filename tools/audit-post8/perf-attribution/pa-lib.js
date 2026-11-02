/* Final audit after Stage 8, area perf-attribution: where the main thread's script time goes, on two builds, on the same deterministic motions.
   Measurement code only: nothing here writes a source file or changes the application; every hook below lives and dies with its page.
   - openVisitor(browser,html,vp): a visitor's page (no ?harness=1: smoke and drift move, as on the device route, tools/step6/perf-run.html),
     its start-up timed by an init script (first animation frame after the boot guard's "ok", the boot overlay gone, long tasks), the first-run
     card closed by a real Escape key press.
   - setup(page,motion): the device route's own set-up (tools/step6/perf-route.js: applyCase, setFollow, settle, setSpeed), on the app's globals.
   - runMotion(page,o): the motion driver (tools/visual/motion.js inPage: the app's loop run one frame at a time on the driver's clock), the WebGL
     draw on; per frame the real time of the input handler (orbit: a right-button pointermove) and of window.loop() (the app's whole frame,
     including three.js's render submission), then gl.finish() OUTSIDE the timed span so that the next frame starts with SwiftShader's queue
     drained (software WebGL: otherwise a GL call blocks on the previous frames' raster work). Optional CDP Profiler profile (sampling interval
     o.sampleUs) over exactly those frames: the runner is the named function __paRun and the drain __paSync, so the aggregation can keep the frames
     and set the drain aside.
   - aggregate(profile,frames): self time by function and by subsystem, inclusive time of the per-frame steps, per frame. */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../lib.js");
const TR=require("../../visual/three-route.js");
const MD=require("../../visual/motion.js");

/* the device route's vantages (tools/step6/perf-route.js:29) */
const OV=[-27,272,41,-27,0,9], FIELD=[-195,92,156,-33,4,-2];
const MOTIONS={
  "play-half":   {kind:"play",  spec:{t:510, presentation:"watch", mode:"terrain", cam:FIELD}, speed:0.5, note:"Play at half speed under Follow from 08:30, Watch, the Field vantage (device route play-half)"},
  "overview-orbit":{kind:"orbit", spec:{t:570, presentation:"watch", mode:"terrain", cam:OV}, note:"the Overview vantage, 09:30, Watch, orbiting by a right-button drag (device route overview orbit)"},
  "ph8-orbit":   {kind:"orbit", spec:{t:880, presentation:"watch", mode:"terrain", cam:OV}, note:"phase 8, 14:40, the Overview, Watch, orbiting by a right-button drag (device route ph8-overview orbit)"}
};

/* recorded in the page before any of its scripts runs: when the boot guard's first frame came (AUS_BOOT.done), when the boot overlay went,
   and every long task (PerformanceObserver), all in the page's own performance.now() */
const INIT=function(){
  var R=window.__paBoot={firstFrame:null, bootGone:null, long:[], t:[]};
  try{ new PerformanceObserver(function(l){ l.getEntries().forEach(function(e){ R.long.push([Math.round(e.startTime),Math.round(e.duration)]); }); }).observe({type:"longtask",buffered:true}); }catch(e){}
  (function poll(){
    try{
      var now=performance.now();
      if(R.firstFrame===null&&window.AUS_BOOT&&window.AUS_BOOT.done) R.firstFrame=Math.round(now);
      if(R.bootGone===null&&document.readyState!=="loading"&&!document.getElementById("boot")&&typeof window.camera!=="undefined") R.bootGone=Math.round(now);
    }catch(e){}
    if(R.firstFrame===null||R.bootGone===null) requestAnimationFrame(poll);
  })();
};

async function openVisitor(browser,html,vp,o){
  o=o||{};
  const page=await browser.newPage({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:1,reducedMotion:"no-preference"});
  let bcdp=null;
  if(o.profileBoot){ bcdp=await page.context().newCDPSession(page); await bcdp.send("Profiler.enable"); await bcdp.send("Profiler.setSamplingInterval",{interval:o.profileBoot}); await bcdp.send("Profiler.start"); }
  page._log=[];
  page.on("console",m=>{ const t=m.type(); if(t==="warning"||t==="error") page._log.push({type:t,text:m.text().slice(0,300)}); });
  page.on("pageerror",e=>page._log.push({type:"pageerror",text:String(e.message).slice(0,300)}));
  await TR.routeThree(page);
  await page.addInitScript(INIT);
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
      lastLongEnd:lastEnd, bootms:typeof BOOTMS!=="undefined"?JSON.parse(JSON.stringify(BOOTMS)):null}; });
  boot.nodeMs=nodeMs; boot.quiet=quiet;
  if(bcdp){ const {profile}=await bcdp.send("Profiler.stop"); await bcdp.send("Profiler.disable"); await bcdp.detach(); page._bootProfile=profile; }
  /* the first-run card closed by a real key press (Escape: "closes it where it stands", decision 118) */
  const cardOpen=await page.evaluate(()=>{ var f=document.getElementById("firstrun"); return !!(f&&!f.hidden&&getComputedStyle(f).display!=="none"); });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  boot.cardOpenAtStart=cardOpen;
  boot.cardClosedByEscape=await page.evaluate(()=>{ var f=document.getElementById("firstrun"); return !(f&&!f.hidden&&getComputedStyle(f).display!=="none"); });
  page._boot=boot;
  return page;
}

/* the route's set-up on the app's own globals (tools/step6/perf-route.js:110-113, 285) */
async function setup(page,key){
  const M=MOTIONS[key];
  return page.evaluate(M=>{
    var D=AUSTERLITZ_DEBUG;
    D.applyCase(JSON.parse(JSON.stringify(M.spec)),null); D.settle(30);
    if(M.kind==="play"){ setFollow(true); D.settle(30); setSpeed(M.speed); }
    return {clock:clock, mode:mode, presentation:typeof presentation!=="undefined"?presentation:null, follow:!freeCam, fx:FX.on, fxScale:FX.scale, lowTier:lowTier,
      shadow:renderer.shadowMap.enabled, factor:DISPLAY.factor, px:renderer.getPixelRatio(), playing:playing};
  },M);
}

/* the frames, in three evaluates: BEGIN (the driver started, the motion begun, the warm-up frames), TIMED (the frames measured, each timed in
   real time; the CPU counter and the profiler wrap exactly this evaluate), END (the motion ended, the driver stopped, the draw calls restored).
   Between them the page's event loop runs with the app's own loop held by the driver (as tools/visual/motion.js runReal does). */
const BEGIN=function(a){
  var rn=window.__paRealNow, D=window.__md, glc=renderer.getContext();
  /* a.stubDraws: the context's draw and clear calls replaced by no-ops for the run (own properties shadowing the prototype's methods; three r128
     looks them up at each call), so that three.js's whole render path runs (traversal, culling, sorting, state, uniforms, buffer uploads) while
     SwiftShader rasterises nothing: its raster work otherwise blocks the GL calls for seconds a frame (flow control) */
  var STUB=["drawElements","drawArrays","drawElementsInstanced","drawArraysInstanced","drawRangeElements","clear","blitFramebuffer"], saved={};
  if(a.stubDraws) STUB.forEach(function(k){ if(typeof glc[k]==="function"){ saved[k]=Object.prototype.hasOwnProperty.call(glc,k)?glc[k]:null; glc[k]=function(){}; } });
  var S=window.__paS={a:a, saved:saved, STUB:STUB, x:0, c:null, err:null};
  D.start({gl:true, frameMs:a.frameMs});
  var c=S.c=D.centre(); S.x=c[0];
  try{
    if(a.kind==="play"){ togglePlay(); }
    else if(a.kind==="orbit"){ D.down(c[0],c[1],2); }
    for(var i=0;i<a.warm;i++){ if(a.kind==="orbit"){ S.x+=a.pxPerFrame; D.move(S.x,c[1],2); } D.frame(); glc.finish(); }
  }catch(e){ S.err=String(e&&e.stack||e).slice(0,600); }
  return {err:S.err, clock:clock, playing:playing};
};
const TIMED=function __paRun(n){
  var rn=window.__paRealNow, D=window.__md, S=window.__paS, a=S.a, glc=renderer.getContext(), c=S.c;
  function __paSync(){ glc.finish(); }
  var res={t:[], info:[], cull:[], clock0:clock, clock1:null, err:null};
  try{
    for(var i=0;i<n;i++){
      var tIn=0;
      if(a.kind==="orbit"){ S.x+=a.pxPerFrame; var t0=rn(); D.move(S.x,c[1],2); tIn=rn()-t0; }
      var t1=rn(); D.frame(); var t2=rn();
      __paSync();
      var t3=rn();
      var ri=renderer.info.render; res.t.push([+tIn.toFixed(3),+(t2-t1).toFixed(3),+(t3-t2).toFixed(3)]); res.info.push([ri.calls,ri.triangles]);
      if(typeof CULL!=="undefined") res.cull.push([CULL.frame.tests,CULL.frame.culled,CULL.frame.refresh,CULL.frame.inst]);
    }
  }catch(e){ res.err=String(e&&e.stack||e).slice(0,600); }
  res.clock1=clock;
  return res;
};
const END=function(){
  var D=window.__md, S=window.__paS, a=S.a, glc=renderer.getContext();
  try{ if(a.kind==="orbit") D.up(S.x,S.c[1],2); if(a.kind==="play") stopPlay(); }catch(e){}
  S.STUB.forEach(function(k){ if(k in S.saved){ if(S.saved[k]) glc[k]=S.saved[k]; else delete glc[k]; } });
  D.stop(); window.__paS=null;
  return {clock:clock, playing:playing};
};

/* the renderer processes' main threads (CrRendererMain) of this browser, by CDP's SystemInfo and /proc; their CPU time from schedstat
   (nanoseconds on the CPU, nanoseconds waiting for a CPU): the main thread's own CPU, blind to time spent blocked (a GL call waiting for
   SwiftShader) or descheduled (other jobs on the machine) */
async function mainThreads(browser){
  const s=await browser.newBrowserCDPSession(); const info=await s.send("SystemInfo.getProcessInfo"); await s.detach();
  const out=[];
  info.processInfo.filter(p=>p.type==="renderer").forEach(p=>{ let tids=[]; try{ tids=fs.readdirSync("/proc/"+p.id+"/task"); }catch(e){ return; }
    tids.forEach(t=>{ try{ if(fs.readFileSync("/proc/"+p.id+"/task/"+t+"/comm","utf8").trim()==="CrRendererMain") out.push({pid:p.id, tid:+t}); }catch(e){} }); });
  return out;
}
function sched(th){ return th.map(x=>{ try{ const v=fs.readFileSync("/proc/"+x.pid+"/task/"+x.tid+"/schedstat","utf8").trim().split(/\s+/).map(Number); return {run:v[0], wait:v[1]}; }catch(e){ return {run:0, wait:0}; } }); }
function loadavg(){ try{ return fs.readFileSync("/proc/loadavg","utf8").split(" ").slice(0,3).map(Number); }catch(e){ return null; } }

async function runMotion(browser,page,o){
  await page.evaluate(()=>{ if(!window.__paRealNow) window.__paRealNow=performance.now.bind(performance); });
  await page.evaluate(MD.inPage);
  const th=await mainThreads(browser);
  const t0=Date.now(), la0=loadavg();
  const b=await page.evaluate(BEGIN,{kind:o.kind, warm:o.warm, frameMs:o.frameMs, pxPerFrame:o.pxPerFrame||0, stubDraws:!!o.stubDraws});
  let cdp=null;
  if(o.profile){ cdp=await page.context().newCDPSession(page); await cdp.send("Profiler.enable"); await cdp.send("Profiler.setSamplingInterval",{interval:o.sampleUs||200}); await cdp.send("Profiler.start"); }
  const s0=sched(th), t1=Date.now();
  const r=await page.evaluate(TIMED,o.n);
  const s1=sched(th), t2=Date.now();
  if(cdp){ const {profile}=await cdp.send("Profiler.stop"); await cdp.send("Profiler.disable"); await cdp.detach(); r.profile=profile; }
  const e=await page.evaluate(END);
  /* the page's main thread: the one whose CPU moved most over the timed frames */
  let k=0, best=-1; s0.forEach((x,i)=>{ const d=s1[i].run-x.run; if(d>best){ best=d; k=i; } });
  r.cpu={thread:th[k]||null, runMs:best/1e6, waitMs:th.length?(s1[k].wait-s0[k].wait)/1e6:null, wallMs:t2-t1, others:s0.map((x,i)=>+((s1[i].run-x.run)/1e6).toFixed(1))};
  r.begin=b; r.end=e; r.wallS=+((Date.now()-t0)/1000).toFixed(1); r.load=[la0,loadavg()];
  return r;
}

/* ---- the profile's aggregation ---- */
const GL_NATIVE=/^(drawElements|drawArrays|drawElementsInstanced|drawArraysInstanced|uniform[1-4][fi]v?|uniformMatrix[234]fv|bindBuffer|bufferData|bufferSubData|bindTexture|activeTexture|useProgram|enable|disable|blendFunc|blendFuncSeparate|blendEquation|blendEquationSeparate|depthFunc|depthMask|colorMask|clear|clearColor|clearDepth|clearStencil|viewport|scissor|bindFramebuffer|framebufferTexture2D|vertexAttribPointer|vertexAttribIPointer|enableVertexAttribArray|disableVertexAttribArray|vertexAttribDivisor|bindVertexArray|createVertexArray|deleteVertexArray|cullFace|frontFace|polygonOffset|stencilFunc|stencilOp|stencilMask|texImage2D|texSubImage2D|texParameteri|pixelStorei|generateMipmap|getUniformLocation|getAttribLocation|getProgramParameter|getShaderParameter|getError|getParameter|getExtension|lineWidth|drawBuffers|invalidateFramebuffer|readPixels|finish|flush|getContextAttributes|isContextLost|vertexAttrib[1-4]fv?|bindRenderbuffer|renderbufferStorage|blitFramebuffer|readBuffer|texStorage2D|copyTexSubImage2D)$/;
const SPECIAL={"(garbage collector)":"GC","(program)":"(program)","(idle)":"(idle)","(root)":"(root)"};
/* the subsystems, by function name (the first rule that matches, walking the stack from the sample's top frame down to the first app frame) */
const SUBSYS=[
  ["map layer (ml*)", /^(ml[A-Z_]|mlt|ML\b|labelText|placeLabels?|mlHover|mlFar|mlBand|mlStab|mlHold|mlCands|mlCollect|mlLayout|mlPlace|mlPanels|mlObstacles)/],
  ["gait/anim (gait*, anim*, faceClock, poseBlock)", /^(gait|anim|aPart|faceClock|enemyFacing|poseBlock|clockRate)/],
  ["culling (cull*)", /^cull/],
  ["kit level of detail (kitLod*)", /^kitLod/],
  ["figures' layout (layoutFigs, placeStandards, showBattalions)", /^(layoutFigs|placeStandards|showBattalions|seat|kitAllocate|stdCount)/],
  ["outlines (outline*)", /^(outline|makeOutline)/],
  ["confidence (conf*, groundPatch)", /^(conf|groundPatch)/],
  ["smoke and dust (smoke*, dust*)", /^(smoke|dust|puff)/],
  ["atmosphere (atmo*, applyAtmo, fog*, domeFollow)", /^(atmo|applyAtmo|fog|domeFollow|ATMO)/],
  ["light (applyLight, placeLights, lightAt, shadow*)", /^(applyLight|placeLights|lightAt|mixRow|lightRow|shadowReceivers|groundMinY|sunWorldDir|drawnAltitude|SHADOW)/],
  ["arrows (arrow*, capPts, ribbon*, drawOn*)", /^(arrow|capPts|capFactors|capRows|ribbon|drawOn|BORDER|border|headInside)/],
  ["skeleton/routes (skel*, route*)", /^(skel|route)/],
  ["eyes/knowledge (know*, eyes*, readHidden, drawnKnow)", /^(know|eyes|readHidden|readUnknown|drawnKnow|stateKnown|knowledgeOf)/],
  ["clock/Follow/camera (tickClock, followStep, syncFollow, syncViewOffset, tween, orbit, clamp*)", /^(tickClock|followStep|syncFollow|syncViewOffset|_runTween|tween|dwell|orbit|orbitPlace|clampCamera|camFloor|freeCentre|landFreeRect|presetFrame|fitOverview|setProg|openingWatch|openingPlayWatch|paintDevStats|frameState|ambientNow)/],
  ["ground queries (groundY*, height*, displayHeight)", /^(groundY|groundYFast|height|hAt|displayHeight|localHeight|regionalH|groundHeights)/],
  ["formation model (stateAt, posNow, legPath, ...)", /^(stateAt|posNow|legPath|statusAt|confAt|posAt|trackAt|unitState|leafOf|aggReading|formationAt|activeAt|routeAxis)/],
  ["updateVisibility (other, inline)", /^updateVisibility$/],
  ["render path (renderFrame*, renderFX, renderStandard, gdepth*, composer)", /^(renderFrame|renderFrameNow|renderFX|renderStandard|gdepthPass|sizeFX|devMark)/],
  ["timeline/DOM UI (tl*, caption*, setProg, fitCaption)", /^(tl[A-Z]|fitCaption|capTitle|caption|syncDock|updateCaption|paintSpeedBtn|syncInert|toast)/]
];
function classify(nodeById,parent,sample){
  /* returns [category, topName] */
  const n=nodeById.get(sample), cf=n.callFrame, name=cf.functionName||"(anonymous)";
  if(SPECIAL[name]) return [SPECIAL[name],name];
  if(!cf.url&&GL_NATIVE.test(name)) return ["WebGL calls (native; SwiftShader-distorted)",name];
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
  const inRun=new Map(), inSync=new Map();
  const stackHas=(id,fname,cache)=>{ if(cache.has(id)) return cache.get(id); let k=id, r=false; while(k!=null){ if(nodeById.get(k).callFrame.functionName===fname){ r=true; break; } k=parent.get(k); } cache.set(id,r); return r; };
  const selfFn={}, cat={}, incl={}, total={run:0, sync:0, outside:0, samples:0};
  const STEPS=o.steps||[];
  for(let i=0;i<N;i++){
    const s=S[i], d=dur(i)/1000;   /* ms */
    if(o.root!==null){ if(!stackHas(s,o.root||"__paRun",inRun)){ total.outside+=d; continue; }
      if(stackHas(s,"__paSync",inSync)){ total.sync+=d; continue; } }
    else if(nodeById.get(s).callFrame.functionName==="(idle)"){ total.outside+=d; continue; }
    total.run+=d; total.samples++;
    const n=nodeById.get(s), cf=n.callFrame, key=(cf.functionName||"(anonymous)")+" "+(cf.url?(/three/.test(cf.url)?"three":"app"):"native")+":"+(cf.lineNumber+1);
    selfFn[key]=(selfFn[key]||0)+d;
    const [c]=classify(nodeById,parent,s); cat[c]=(cat[c]||0)+d;
    /* inclusive: each named step once per sample */
    const seen=new Set(); let k=s;
    while(k!=null){ const nm=nodeById.get(k).callFrame.functionName; if(nm&&STEPS.indexOf(nm)>=0&&!seen.has(nm)){ seen.add(nm); incl[nm]=(incl[nm]||0)+d; } k=parent.get(k); }
  }
  const per=x=>+(x/nFrames).toFixed(4);
  const top=Object.entries(selfFn).sort((a,b)=>b[1]-a[1]).slice(0,o.top||60).map(([k,v])=>({fn:k, msPerFrame:per(v)}));
  const cats=Object.entries(cat).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({cat:k, msPerFrame:per(v)}));
  const inc={}; STEPS.forEach(s=>inc[s]=per(incl[s]||0));
  return {frames:nFrames, sampleUsMedian:med, runMsPerFrame:per(total.run), syncMsPerFrame:per(total.sync), samplesInRun:total.samples, top, cats, incl:inc};
}
const STEPS=["loop","syncFollow","openingWatch","paintDevStats","frameState","_runTween","tickClock","followStep","dwellAdvance","openingPlayWatch","setProg","updateVisibility","syncViewOffset",
  "renderFrame","applyLight","placeLights","applyAtmo","domeFollow","renderFrameNow","arrowCap","mlLayout","mlCollect","renderFX","renderStandard","render",
  "gaitStep","poseBlock","kitLodFrame","kitLod","kitLodSet","layoutFigs","placeStandards","outlinePlace","confPlace","smokePlace","cullTest","cullRefresh","cullStale","drawOnArrows","skelUpdate",
  "routeScope","knowAtClock","faceClock","groundYFast","groundY","stateAt","posNow","projectObject","renderObjects","renderObject","renderBufferDirect","setProgram","WebGLShadowMap.render","updateMatrixWorld",
  "intersectsObject","F.intersectsObject","onPointerMove","dispatchEvent","EffectComposer.render"];
function stats(a){ const s=a.slice().sort((x,y)=>x-y), n=s.length, q=p=>s[Math.min(n-1,Math.floor(p*(n-1)+0.5))];
  return {n, mean:+(s.reduce((x,y)=>x+y,0)/n).toFixed(3), p10:+q(0.1).toFixed(3), p50:+q(0.5).toFixed(3), p90:+q(0.9).toFixed(3), p95:+q(0.95).toFixed(3), max:+s[n-1].toFixed(3)}; }
module.exports={A, MD, MOTIONS, OV, FIELD, openVisitor, setup, runMotion, aggregate, STEPS, stats, classify, SUBSYS, mainThreads, sched, loadavg};
