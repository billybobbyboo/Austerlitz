#!/usr/bin/env node
/* Final audit after Stage 8, area visual-landscape: short frame sequences watched frame by frame for transitions, clipping, depth artefacts,
   level-of-detail and culling pops. Each sequence runs the app's OWN animation loop one frame at a time on a virtual clock (the harness's
   motion driver, tools/visual/motion.js inPage: performance.now answers the driver's time, advanced frameMs a frame; window.loop() run once a
   frame, so the glide's tween, Play's tickClock, the map layer's passes and the render are the app's), and captures each frame (JPEG).
   Measurement code only. Page: the harness's (?harness=1), the app's loop not held. Encoded to MP4 at the capture rate (lib.js encode).
   usage: node sequence.js <outdir> [--only name] [--vp WxH]
   Sequences (DESIGN: chosen to show transitions near troops and buildings):
   glide   : at 10:00, from the Field vantage (placed) a click's glide to the Pratzen vantage (flyTo, 1600 ms), 10 fps, 26 frames
   play    : Saint-Hilaire's division climbing the Pratzen, Play at 1/2x from 09:00 (dwell off so the clock runs), the eye fixed 34 units off, 10 fps, 40 frames
   dolly   : at 09:00, paused, the eye moving from 200 to 22 units toward Saint-Hilaire's division along one line (the level of detail switching), 10 fps, 30 frames
   orbit   : at 10:00, paused, the eye orbiting the Sokolnitz castle's site 24 units off (half a turn), 10 fps, 30 frames */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../lib.js"), MO=require("../../visual/motion.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=path.resolve(argv[0]), ONLY=opt("--only"), VP=(opt("--vp")||"960x540").split("x").map(Number);
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const SEQ={
  glide:{t:600, frames:26, frameMs:100, setup:"closeFirst(null); stopPlay(); setPresentation('watch'); setClock(600,{instant:true,force:true,camera:false}); AUSTERLITZ_DEBUG.placeCamera(VANTAGE.field.slice()); syncViewOffset(true); AUSTERLITZ_DEBUG.settle(30,true);",
    start:"flyTo(VANTAGE.plateau); return {tween:!!tween};", each:"" },
  play:{t:540, frames:40, frameMs:100, setup:"closeFirst(null); stopPlay(); setPresentation('watch'); if(typeof dwellSet==='function') dwellSet(false); setSpeed(0.5); setClock(540,{instant:true,force:true,camera:false}); var p=posAtClock('sthilaire',548), w=W(p[0],p[1]), y=groundY(w[0],w[1]), d=new THREE.Vector3(0.7,0.35,0.2).normalize().multiplyScalar(34); tween=null; camArc=null; freeCam=true; curVantage=null; landCam.position.set(w[0]+d.x,y+d.y,w[1]+d.z); orbitTarget.set(w[0],y,w[1]); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true); AUSTERLITZ_DEBUG.settle(30,true);",
    start:"togglePlay(); return {playing:playing, speed:speed, dwell:typeof DWELL!=='undefined'?DWELL.on:null};", each:"" },
  dolly:{t:540, frames:30, frameMs:100, setup:"closeFirst(null); stopPlay(); setPresentation('watch'); setClock(540,{instant:true,force:true,camera:false}); var p=posNow('sthilaire'), w=W(p[0],p[1]); window.__dl={x:w[0],z:w[1],y:groundY(w[0],w[1])}; tween=null; camArc=null; freeCam=true; curVantage=null; AUSTERLITZ_DEBUG.settle(30,true);",
    start:"return {};", each:"var k=window.__dk=(window.__dk===undefined?0:window.__dk+1), r=200*Math.pow(22/200,Math.min(1,k/27)), d=new THREE.Vector3(0.7,0.35,0.2).normalize().multiplyScalar(r), q=window.__dl; landCam.position.set(q.x+d.x,q.y+d.y,q.z+d.z); orbitTarget.set(q.x,q.y,q.z); landCam.lookAt(orbitTarget); clampCamera(); requestRender(2); var u=units.sthilaire.block.userData; return {r:+r.toFixed(1), rich:u.lodRich, px:u.lodPx?+u.lodPx.toFixed(1):null};" },
  orbit:{t:600, frames:30, frameMs:100, setup:"closeFirst(null); stopPlay(); setPresentation('watch'); setClock(600,{instant:true,force:true,camera:false}); var w=W(212.9,344.3); window.__ob={x:w[0],z:w[1],y:groundY(w[0],w[1])}; tween=null; camArc=null; freeCam=true; curVantage=null; AUSTERLITZ_DEBUG.settle(30,true);",
    start:"return {};", each:"var k=window.__ok=(window.__ok===undefined?0:window.__ok+1), a=-2.2+Math.PI*k/29, q=window.__ob, r=24, el=0.42; landCam.position.set(q.x+r*Math.cos(el)*Math.cos(a),q.y+r*Math.sin(el),q.z+r*Math.cos(el)*Math.sin(a)); orbitTarget.set(q.x,q.y,q.z); landCam.lookAt(orbitTarget); clampCamera(); requestRender(2); return {a:+a.toFixed(3)};" }
};
(async()=>{
  const b=await A.launch(); let page=null;
  for(const [name,s] of Object.entries(SEQ)){
    if(ONLY&&ONLY!==name) continue;
    const dir=path.join(OUT,name); fs.mkdirSync(dir,{recursive:true});
    if(fs.existsSync(path.join(OUT,name+".mp4"))){ log("exists",name); continue; }
    if(!page){ const t0=Date.now(); page=await A.open(b,VP); log("page",VP.join("x"),"booted",Date.now()-t0,"ms"); await page.evaluate(MO.inPage.toString().replace(/^function\s*\(\)\s*\{/,"(function(){")+")()"); }
    await page.evaluate(new Function(s.setup));
    await page.evaluate(ms=>window.__md.start({gl:true, frameMs:ms}),s.frameMs);
    const st0=await page.evaluate(new Function(s.start));
    const rec={name, vp:VP, frameMs:s.frameMs, fps:1000/s.frameMs, setup:s.setup, start:s.start, each:s.each, startResult:st0, frames:[]};
    for(let i=0;i<s.frames;i++){
      const t1=Date.now();
      const e=s.each?await page.evaluate(new Function(s.each)):null;
      await page.evaluate(()=>window.__md.frame(1));
      const st=await page.evaluate(()=>{ var L=landCam; return {clock:fmtClock(clock), t:+clock.toFixed(2), playing:playing, tween:!!tween, eye:L.position.toArray().map(function(v){ return +v.toFixed(2); }), target:orbitTarget.toArray().map(function(v){ return +v.toFixed(2); }), cull:CULL&&CULL.frame?{tested:CULL.frame.tested,culled:CULL.frame.culled}:null, calls:renderer.info.render.calls, tris:renderer.info.render.triangles}; });
      await A.jpeg(page,path.join(dir,"f"+String(i).padStart(5,"0")+".jpg"),80);
      rec.frames.push(Object.assign({i, each:e, ms:Date.now()-t1},st));
      log(name,i,st.clock,st.eye.join(","),JSON.stringify(e),(Date.now()-t1)+"ms");
    }
    await page.evaluate(()=>{ window.__md.stop(); stopPlay(); });
    fs.writeFileSync(path.join(OUT,name+".json"),JSON.stringify(rec,null,1));
    A.encode(dir,path.join(OUT,name),Math.round(1000/s.frameMs));
    log("encoded",name);
  }
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
