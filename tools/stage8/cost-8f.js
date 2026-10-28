#!/usr/bin/env node
/* Stage 8, implementation PR 8F (decisions 246 (a), 247 (a); docs/STAGE8_SPEC.md sections 8 and 18): what 8F's drawing costs a frame, on two
   builds (8E's and 8F's), each view on a page opened as the harness opens it (tools/stage8/views.js, the same state on both): the frame's draw
   calls and triangles (every pass, renderer.info) and its time as the app draws it (renderFrameNow, finished by reading a pixel back), the
   median of 15 after 3 frames to warm; on a build with the near detail (GDETAIL) also with it off, so that the detail's own share shows; and
   whether the page is a low tier (no shadow, no detail). The shimmer: the scene drawn (no post-processing, 800 x 450), then with the eye and
   its target moved half a pixel to the right; the share of the frame's pixels whose grey changes by more than 24 of 255 (with the near detail
   on and off on 8F's build: what the detail adds where the ground is seen at a shallow angle). Software WebGL: where the work went, not a
   device's frame time.
   node tools/stage8/cost-8f.js --before 8e.html --after 8f.html [--only a,b] [--json out.json]
   Measurement code only: nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js"), V=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const BEFORE=path.resolve(opt("--before")), AFTER=path.resolve(opt("--after")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=opt("--json"), ONLY=opt("--only")?opt("--only").split(","):null;
const Wv=(o,x)=>Object.assign(JSON.parse(JSON.stringify(o)),x);
const VIEWS={"pratzen-low":V["pratzen-low"], "pratzen-low-10x":V["pratzen-low-10x"], "eye-zuran":V["eye-zuran"], "ice-mid":V["ice-mid"], "woods-pheasantry":V["woods-pheasantry"],
  "close-sokolnitz":V["close-sokolnitz"], "overview-field":V["overview-field"], "ph8-overview-watch":V["ph8-overview-watch"],
  "fields-low":{viewport:[1600,900], t:720, presentation:"watch", mode:"terrain", aim:{map:[300,300], dir:[0.30,0.07,0.95], r:22}},
  "phone-pratzen-low":Wv(V["pratzen-low"],{viewport:[390,844]}), "phone-woods":{viewport:[390,844], t:500, presentation:"study", mode:"terrain", aim:{map:[236,385], dir:[-0.55,0.36,0.75], r:52}}};
const MEAS=function(){
  var gl=renderer.getContext(), px=new Uint8Array(4), U=groundMesh.material.userData.U, det=U&&U.uDetail;
  function frame(){ var t=performance.now(); renderFrameNow(); gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px); return performance.now()-t; }
  function med(a){ a=a.slice().sort(function(x,y){ return x-y; }); return a[a.length>>1]; }
  function run(){ for(var i=0;i<3;i++) frame(); var ts=[]; for(var j=0;j<15;j++) ts.push(frame()); var inf=renderer.info.render; return {ms:+med(ts).toFixed(2), calls:inf.calls, tris:inf.triangles}; }
  function shimmer(){ var W0=800, H0=450, rt=new THREE.WebGLRenderTarget(W0,H0), A=new Uint8Array(W0*H0*4), Bb=new Uint8Array(W0*H0*4);
    var p0=landCam.position.clone(), t0=orbitTarget.clone(), wpp=2*Math.tan(camera.fov*Math.PI/360)*p0.distanceTo(t0)/H0, r=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0).normalize().multiplyScalar(wpp/2);
    function grab(o){ renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene,camera); renderer.readRenderTargetPixels(rt,0,0,W0,H0,o); renderer.setRenderTarget(null); }
    grab(A); landCam.position.add(r); orbitTarget.add(r); landCam.lookAt(orbitTarget); camera.updateMatrixWorld(); grab(Bb);
    landCam.position.copy(p0); orbitTarget.copy(t0); landCam.lookAt(orbitTarget); camera.updateMatrixWorld(); rt.dispose();
    var n=0; for(var i=0;i<A.length;i+=4){ var a=0.2126*A[i]+0.7152*A[i+1]+0.0722*A[i+2], b=0.2126*Bb[i]+0.7152*Bb[i+1]+0.0722*Bb[i+2]; if(Math.abs(a-b)>24) n++; }
    return +(n/(W0*H0)).toFixed(4); }
  var out={lowTier:lowTier, detail:det?det.value.x:null, on:run()};
  if(camera===landCam) out.on.shimmer=shimmer();
  if(det&&det.value.x>0){ var k=det.value.x; det.value.x=0; out.off=run(); if(camera===landCam) out.off.shimmer=shimmer(); det.value.x=k; }
  return out; };
(async()=>{
  const browser=await L.launch(), res={chromium:browser.version(), builds:{}, views:{}};
  for(const [lab,html] of [["before",BEFORE],["after",AFTER]]) res.builds[lab]={file:path.basename(html), md5:crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex")};
  for(const [name,v] of Object.entries(VIEWS)){ if(ONLY&&!ONLY.includes(name)) continue; res.views[name]={};
    for(const [lab,html] of [["before",BEFORE],["after",AFTER]]){
      process.env.AUSTERLITZ_HTML=html; const page=await L.open(browser,v.viewport,{}); await L.applyCase(page,v);
      const r=await page.evaluate(MEAS); await page.close(); res.views[name][lab]=r;
      console.log(name.padEnd(20)+lab.padEnd(7)+(r.lowTier?"low tier ":"")+"calls "+r.on.calls+", triangles "+r.on.tris+", "+r.on.ms+" ms, shimmer "+r.on.shimmer+(r.off?" (the near detail off: "+r.off.ms+" ms, shimmer "+r.off.shimmer+")":"")); }
    if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); } }
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
