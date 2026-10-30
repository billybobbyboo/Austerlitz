#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md section 20.10): the crowns' shimmer over the whole frame. tools/stage8/woods-8f.js counts the
   pixels that change under half a pixel's move inside a mask of the woods it draws with materials of its own, which do not run a vertex hook
   (the crowns closing near the eye grow their faces in the vertex shader: that mask is the crowns as 8F drew them, and would favour the hook).
   Here the frame as drawn, without post-processing, then with the eye moved half a pixel to its right (the target with it): the pixels whose grey
   changes by more than 24 of 255, over the whole frame; the woods being the only thing a prototype changes, the difference between two variants
   is theirs. Each prototype of tools/stage8/protos/woods8h.js put into the live page and undone; on 8H's build, where the crowns close near the
   eye as built, the comparison is with the hook's uniform at 0 (8F's crowns at every distance) and at 1 ("--uniform").
   --cost: instead, the frame's cost in each view on two builds (--builds a=<html>,b=<html>, interleaved, the same machine): each frame drawn whole
   (the render, then the GL finished: software WebGL, where the vertex and the fragment work are the CPU's), --frames frames (25) after 5
   unmeasured, median and 95th percentile, on --reps fresh pages of each build (2), alternating which build goes first.
   --toggle: on one build (AUSTERLITZ_HTML, else the repository's), in each view on one page, the hook's uniform at 1 and at 0 in alternate
   frames (--frames pairs, 60; the order within a pair alternating; 12 frames unmeasured first), each frame drawn whole: what the faces grown near
   the eye cost (the hook's vertex arithmetic runs in both states, so this is the work its grown faces add), free of a page's or a load's
   spread; the pairs' differences' median with each state's median and 95th percentile.
   node tools/stage8/near-8h.js [--views trees-eye,woods-pheasantry,close-sokolnitz] [--protos t-near,t-nearvol | --uniform | --cost --builds a=..,b=.. [--reps 2] [--frames 25] | --toggle [--frames 60]] [--json out.json]
   Measurement and prototype code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), PW=require("./protos/woods8h.js"), V=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const VIEWS=(opt("--views")||"trees-eye,woods-pheasantry,close-sokolnitz").split(","), UNI=argv.includes("--uniform"), PROTOS=UNI?["off","on"]:(opt("--protos")||"t-near,t-nearvol").split(","), OUT=opt("--json");
const SHIM=function(){ var W0=800,H0=450, rt=new THREE.WebGLRenderTarget(W0,H0), buf=new Uint8Array(W0*H0*4);
  function draw(){ renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene,camera); renderer.readRenderTargetPixels(rt,0,0,W0,H0,buf); renderer.setRenderTarget(null); var g=new Float32Array(W0*H0); for(var i=0;i<W0*H0;i++) g[i]=0.299*buf[i*4]+0.587*buf[i*4+1]+0.114*buf[i*4+2]; return g; }
  var keepP=landCam.position.clone(), keepT=orbitTarget.clone(); var g0=draw(), right=new THREE.Vector3().setFromMatrixColumn(landCam.matrixWorld,0).normalize();
  var d=landCam.position.distanceTo(orbitTarget), upx=2*d*Math.tan(landCam.fov*Math.PI/360)/H0;
  landCam.position.addScaledVector(right,0.5*upx); orbitTarget.addScaledVector(right,0.5*upx); landCam.lookAt(orbitTarget); landCam.updateMatrixWorld(true);
  var g1=draw(), ch=0; for(var i=0;i<W0*H0;i++) if(Math.abs(g1[i]-g0[i])>24) ch++;
  landCam.position.copy(keepP); orbitTarget.copy(keepT); landCam.lookAt(orbitTarget); landCam.updateMatrixWorld(true); rt.dispose(); return {changed:ch, of:W0*H0}; };
const COST=function(n){ var gl=renderer.getContext(), t=[]; for(var i=0;i<n+5;i++){ var a=performance.now(); renderFrame(); gl.finish(); if(i>=5) t.push(performance.now()-a); }
  t.sort(function(x,y){ return x-y; }); return {median:+t[Math.floor(t.length/2)].toFixed(1), p95:+t[Math.floor(0.95*(t.length-1))].toFixed(1), frames:t.length}; };
const TOGGLE=function(n){ var gl=renderer.getContext(), U=TREE8H.U.uTreeNear, on=[], off=[], d=[];
  function one(v){ U.value=v; var a=performance.now(); renderFrame(); gl.finish(); return performance.now()-a; }
  for(var w=0;w<12;w++) one(w%2);   /* the page's first frames after the case is applied take seconds each (programs and the shadow's first draw) */
  for(var i=0;i<n;i++){ var first=i%2?0:1, ta=one(first), tb=one(1-first), tOn=first?ta:tb, tOff=first?tb:ta; on.push(tOn); off.push(tOff); d.push(tOn-tOff); }
  U.value=1;
  function q(x,f){ x=x.slice().sort(function(p,r){ return p-r; }); return +x[Math.floor(f*(x.length-1))].toFixed(2); }
  var slow=on.concat(off).filter(function(t){ return t>1000; }).length;   /* frames over a second: a page still settling, or a busy machine (reported, not hidden) */
  return {pairs:n, on:{median:q(on,0.5), p95:q(on,0.95)}, off:{median:q(off,0.5), p95:q(off,0.95)}, diffMedian:q(d,0.5), diffP25:q(d,0.25), diffP75:q(d,0.75), slowFrames:slow}; };
if(argv.includes("--toggle")) (async()=>{ const html=path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html")), NF=+(opt("--frames")||60);
  const browser=await L.launch(), out={tool:"tools/stage8/near-8h.js --toggle", chromium:browser.version(), build:path.basename(html), md5:require("crypto").createHash("md5").update(fs.readFileSync(html)).digest("hex"), pairs:NF, views:{}};
  for(const vn of VIEWS){ process.env.AUSTERLITZ_HTML=html; const p=await L.open(browser,V[vn].viewport,{}); await L.applyCase(p,V[vn]);
    out.views[vn]=await p.evaluate(TOGGLE,NF); console.log(vn, JSON.stringify(out.views[vn])); await p.close(); }
  await browser.close(); if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out,null,1)); } })().catch(e=>{ console.error(e); process.exit(1); });
else if(argv.includes("--cost")) (async()=>{ const B=(opt("--builds")||"").split(",").map(x=>{ const i=x.indexOf("="); return {tag:x.slice(0,i), file:path.resolve(x.slice(i+1))}; });
  const browser=await L.launch(), out={tool:"tools/stage8/near-8h.js --cost", chromium:browser.version(), builds:B.map(b=>({tag:b.tag, file:path.basename(b.file), md5:require("crypto").createHash("md5").update(fs.readFileSync(b.file)).digest("hex")})), views:{}};
  const REPS=+(opt("--reps")||2), NF=+(opt("--frames")||25); out.reps=REPS; out.frames=NF;
  for(const vn of VIEWS){ out.views[vn]={}; for(let rep=0;rep<REPS;rep++) for(const b of (rep%2?B.slice().reverse():B)){ process.env.AUSTERLITZ_HTML=b.file; const p=await L.open(browser,V[vn].viewport,{}); await L.applyCase(p,V[vn]);
      const c=await p.evaluate(COST,NF); (out.views[vn][b.tag]=out.views[vn][b.tag]||[]).push(c); await p.close(); }
    console.log(vn, JSON.stringify(out.views[vn])); }
  await browser.close(); if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out,null,1)); } })().catch(e=>{ console.error(e); process.exit(1); });
else (async()=>{ const browser=await L.launch(), out={tool:"tools/stage8/near-8h.js", chromium:browser.version(), build:path.basename(process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html"), views:{}};
  for(const vn of VIEWS){ const p=await L.open(browser,V[vn].viewport,{}); if(!UNI) await L.inject(p,PW.inPage); await L.applyCase(p,V[vn]); const R=out.views[vn]={};
    for(const id of (UNI?PROTOS:["base"].concat(PROTOS))){
      if(UNI) await p.evaluate(k=>{ TREE8H.U.uTreeNear.value=k==="on"?1:0; AUSTERLITZ_DEBUG.settle(2); },id);
      else if(id!=="base"){ await p.evaluate(k=>window.__p8[k].install(),id); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(3)); }
      R[id]=await p.evaluate(SHIM);
      if(!UNI&&id!=="base"){ await p.evaluate(k=>window.__p8[k].uninstall(),id); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); } }
    if(UNI) await p.evaluate(()=>{ TREE8H.U.uTreeNear.value=1; });
    console.log(vn, JSON.stringify(R)); await p.close(); }
  await browser.close(); if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out,null,1)); } })().catch(e=>{ console.error(e); process.exit(1); });
