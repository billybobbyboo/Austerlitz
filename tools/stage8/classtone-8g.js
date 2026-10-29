#!/usr/bin/env node
/* Stage 8, implementation PR 8G's prerequisite 1 (docs/STAGE8_SPEC.md section 19.1): what the corrected atlas does to each cover class's tone as
   drawn. Two builds, the same views; in each frame the visible ground of each shader cell found by the ground's own class output (uDebug 1: the
   class, the crop), and the drawn frame's mean grey over it (the frame as the app draws it, everything in it): the class's tone as a visitor
   sees it, on each build, and their ratio.
   node tools/stage8/classtone-8g.js <before.html> <after.html> [--out file.json]
   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), V=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const [A,B]=argv.filter((a,i)=>!a.startsWith("--")&&argv[i-1]!=="--out"), OUT=opt("--out")||path.join(L.EVID8,"8g","classtone-pre1.json");
const VIEWS={ "overview-field":V["overview-field"], "pratzen-low":V["pratzen-low"], "goldbach-noon":V["goldbach-noon"],
  "kobelnitz-bank":{viewport:[1600,900], t:720, presentation:"map", mode:"terrain", aim:{map:[203,300], dir:[0.70,0.30,0.65], r:20}},
  "fields-low":{viewport:[1600,900], t:720, presentation:"map", mode:"terrain", aim:{map:[300,300], dir:[0.30,0.07,0.95], r:22}} };
const names=["stubble","meadow","marsh","water","wood","village","vineyard","track","plough","pasture","winter sowing"];
const M=function(){ var U=groundMesh.material.userData.U, gl=renderer.getContext(), w=gl.drawingBufferWidth, h=gl.drawingBufferHeight, tm=renderer.toneMapping, oe=renderer.outputEncoding;
  var rt=new THREE.WebGLRenderTarget(w,h), b=new Uint8Array(w*h*4);
  U.uDebug.value=1; renderer.toneMapping=THREE.NoToneMapping; renderer.outputEncoding=THREE.LinearEncoding;
  renderer.setRenderTarget(rt); renderer.render(scene,camera); renderer.readRenderTargetPixels(rt,0,0,w,h,b); renderer.setRenderTarget(null); rt.dispose();
  U.uDebug.value=0; renderer.toneMapping=tm; renderer.outputEncoding=oe; renderFrame();
  var f=new Uint8Array(w*h*4); gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,f);
  var s=new Float64Array(11), n=new Float64Array(11);
  for(var i=0;i<b.length;i+=4){ if(b[i+2]!==1||b[i]>7) continue; var c=b[i]===0?(b[i+1]===1?8:b[i+1]===2?9:b[i+1]===3?10:0):b[i]; s[c]+=0.2126*f[i]+0.7152*f[i+1]+0.0722*f[i+2]; n[c]++; }
  var o=[]; for(var k=0;k<11;k++) o.push(n[k]?{grey:+(s[k]/n[k]).toFixed(1), share:+(100*n[k]/(w*h)).toFixed(2)}:null); return o; };
(async()=>{ const browser=await L.launch(), res={chromium:browser.version(), before:path.basename(A), after:path.basename(B), views:{}};
  for(const [lab,html] of [["before",A],["after",B]]){ process.env.AUSTERLITZ_HTML=html; const page=await L.open(browser,[1600,900],{}); await page.waitForTimeout(3000);
    for(const [n,v] of Object.entries(VIEWS)){ await L.applyCase(page,Object.assign({},v,{viewport:[1600,900]})); (res.views[n]=res.views[n]||{})[lab]=await page.evaluate(M); }
    await page.close(); }
  for(const [n,r] of Object.entries(res.views)){ console.log("== "+n); r.ratio={};
    names.forEach((nm,k)=>{ const a=r.before[k], b=r.after[k]; if(!a&&!b) return; if(a&&b) r.ratio[nm]=+(b.grey/a.grey).toFixed(3);
      console.log("   "+nm.padEnd(14)+" before "+(a?a.grey+" ("+a.share+"%)":"-").padEnd(16)+" after "+(b?b.grey+" ("+b.share+"%)":"-").padEnd(16)+(a&&b?" ratio "+(b.grey/a.grey).toFixed(3):"")); }); }
  fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1));
  await browser.close(); })().catch(e=>{ console.error(e); process.exit(1); });
