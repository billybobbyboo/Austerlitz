#!/usr/bin/env node
/* Stage 8, implementation PR 8D (decisions 249 (a), 250 (b); docs/STAGE8_SPEC.md sections 8.3 and 16): culling's own cost on the CPU, measured
   rather than inferred from the triangles it saves. On a page opened as the harness opens it (?harness=1, software WebGL, 1600 x 900):
   - per frame, as the app draws it: the frustum tests, the meshes culled, the bounds refreshed and their instances, and the milliseconds spent in
     the tests and refreshes (CULL.frame), in four situations: the view still (frames drawn again with nothing changed), Play at 4x under Follow
     (the blocks move, so their bounds are refreshed), a pan (the eye moves, the blocks do not) and a change of display factor (every block
     re-seated, every bound refreshed once);
   - the JavaScript side of a whole frame (renderFrame: three's traversal, the culling tests, the draw calls' submission; not the GPU's work,
     which software WebGL does elsewhere), culled and not, in blocks of frames interleaved A B A B so that drift cannot pass for a difference;
   - the JavaScript heap (Chrome's own count, CDP Performance.getMetrics, after a forced collection) before and after 300 frames culled, and the
     same not culled: what the per-frame work allocates and keeps;
   - what the hooks add, once: the kit's geometries and their vertices (aPart's bytes: one float a vertex), the kit's depth materials, the
     programs three holds after a frame of each view (renderer.info.programs) and the hook's compiles (ANIM.built, ANIM.depth).
   Each figure is this machine's (a container's CPU); the device's own cost is for the device route (tools/step6/perf-route.js, ?route=cull).
   node tools/stage8/cost-8d.js [<build.html>] [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js"), TR=require(path.join(L.ROOT,"tools","visual","three-route.js"));
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(L.ROOT,"austerlitz-command-map.html"));
const MEASURE=fs.readFileSync(path.join(L.ROOT,"tools","visual","measure.js"),"utf8");
const VIEWS=["pratzen-low","close-sokolnitz","overview-field"];
(async()=>{
  const browser=await L.launch(), page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1}), errs=[];
  page.on("pageerror",e=>errs.push(e.message));
  await TR.routeThree(page); await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page);
  await page.evaluate(MEASURE); await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  await page.evaluate(()=>closeFirst(null));
  const cdp=await page.context().newCDPSession(page); await cdp.send("Performance.enable");
  const heap=async()=>{ await cdp.send("HeapProfiler.collectGarbage"); const m=(await cdp.send("Performance.getMetrics")).metrics; return m.find(x=>x.name==="JSHeapUsedSize").value; };
  const res={build:path.basename(html), md5:crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex"), chromium:browser.version(), views:{}};
  const stat=a=>{ const s=a.slice().sort((x,y)=>x-y), q=p=>s.length?s[Math.min(s.length-1,Math.floor(p*s.length))]:null; return {n:s.length, median:q(0.5), p95:q(0.95), max:s.length?s[s.length-1]:null, sum:s.reduce((x,y)=>x+y,0)}; };
  for(const v of VIEWS){
    const c=L.byName(v); await page.evaluate(s=>window.__aus.apply(s),c); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(60)); await page.waitForTimeout(300); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(4));
    /* the per-frame counts: a still view, a pan, Play at 4x, a factor change */
    const r=await page.evaluate(()=>{
      function frames(n,step){ var F=[]; for(var i=0;i<n;i++){ if(step) step(i); renderFrame(); var f=CULL.frame; F.push({tests:f.tests, culled:f.culled, refresh:f.refresh, inst:f.inst, ms:f.ms}); } return F; }
      var out={meshes:CULL.meshes.length};
      out.still=frames(30);
      var p0=landCam.position.clone(), t0=orbitTarget.clone(), right=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0);
      out.pan=frames(30,function(i){ landCam.position.copy(p0).addScaledVector(right,0.6*i); orbitTarget.copy(t0).addScaledVector(right,0.6*i); landCam.lookAt(orbitTarget); syncViewOffset(true); });
      landCam.position.copy(p0); orbitTarget.copy(t0); landCam.lookAt(orbitTarget); syncViewOffset(true);
      var k0=clock; setSpeed(4); stopPlay();
      out.play=frames(60,function(){ setClock(clock+0.5,{instant:true,force:true,camera:false}); });   /* 30 s of the clock a frame: Play at 4x, 15 frames a second's worth */
      setClock(k0,{instant:true,force:true,camera:false});
      var f0=DISPLAY.factor; out.factor=frames(1,function(){ setDisplayFactor(f0===4?"model":4); }); setDisplayFactor(f0); renderFrame();
      return out; });
    const sum=F=>({frames:F.length, tests:stat(F.map(x=>x.tests)).median, culled:stat(F.map(x=>x.culled)).median, refreshPerFrame:stat(F.map(x=>x.refresh)), instPerFrame:stat(F.map(x=>x.inst)).median, ms:stat(F.map(x=>x.ms))});
    const V={meshes:r.meshes, still:sum(r.still), pan:sum(r.pan), play:sum(r.play), factor:sum(r.factor)};
    /* the frame's JavaScript side, culled and not, interleaved in blocks of 10 frames, 8 blocks each */
    V.frameJs=await page.evaluate(()=>{ var A=[], B=[];
      function block(on,into){ CULL.on=on; CULL.meshes.forEach(function(m){ m.frustumCulled=on; }); renderFrame(); for(var i=0;i<10;i++){ var t=performance.now(); renderFrame(); into.push(performance.now()-t); } }
      for(var k=0;k<8;k++){ block(true,A); block(false,B); }
      CULL.on=true; CULL.meshes.forEach(function(m){ m.frustumCulled=true; });
      function st(a){ var s=a.slice().sort(function(x,y){ return x-y; }); return {n:s.length, median:+s[Math.floor(s.length/2)].toFixed(2), p95:+s[Math.floor(s.length*0.95)].toFixed(2)}; }
      return {culled:st(A), notCulled:st(B)}; });
    /* the heap: 300 frames culled, then 300 not, each after a forced collection */
    const h0=await heap(); await page.evaluate(()=>{ for(var i=0;i<300;i++) renderFrame(); }); const h1=await heap();
    await page.evaluate(()=>{ CULL.on=false; CULL.meshes.forEach(function(m){ m.frustumCulled=false; }); for(var i=0;i<300;i++) renderFrame(); CULL.on=true; CULL.meshes.forEach(function(m){ m.frustumCulled=true; }); });
    const h2=await heap();
    V.heap={before:h0, after300Culled:h1, after300NotCulled:h2, deltaCulled:h1-h0, deltaNotCulled:h2-h1};
    res.views[v]=V;
    console.log(v.padEnd(18)+" meshes "+V.meshes+"; still: "+V.still.tests+" tests, "+V.still.culled+" culled, refreshes "+V.still.refreshPerFrame.max+" max, "+V.still.ms.median.toFixed(3)+" ms median"+
      "; pan: "+V.pan.ms.median.toFixed(3)+" ms, refreshes "+V.pan.refreshPerFrame.max+"; play at 4x: refreshes "+V.play.refreshPerFrame.median+" median ("+V.play.instPerFrame+" instances), "+V.play.ms.median.toFixed(3)+" / "+V.play.ms.p95.toFixed(3)+" / "+V.play.ms.max.toFixed(3)+" ms (median / p95 / max)"+
      "; a factor change: "+V.factor.refreshPerFrame.max+" refreshes, "+V.factor.ms.max.toFixed(2)+" ms; the frame's JavaScript culled "+V.frameJs.culled.median+" ms, not "+V.frameJs.notCulled.median+" ms; heap +"+Math.round(V.heap.deltaCulled/1024)+" KB culled, +"+Math.round(V.heap.deltaNotCulled/1024)+" KB not, over 300 frames");
  }
  res.hooks=await page.evaluate(()=>{ var G=kitGeos(), v=0; G.forEach(function(g){ v+=g.attributes.position.count; });
    return {geometries:G.length, vertices:v, aPartBytes:v*4, kitMeshes:CULL.meshes.filter(function(m){ return !!m.userData.anim; }).length,
      depthMaterials:CULL.meshes.filter(function(m){ return !!m.customDepthMaterial; }).length, programs:renderer.info.programs.length, built:ANIM.built, depth:ANIM.depth,
      cullMeshes:CULL.meshes.length, totalRefresh:CULL.total.refresh, totalInst:CULL.total.inst, totalMs:+CULL.total.ms.toFixed(2)}; });
  console.log("hooks: "+JSON.stringify(res.hooks));
  res.console=errs; await browser.close();
  if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
