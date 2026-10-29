#!/usr/bin/env node
/* Stage 8, implementation PR 8G's verification (docs/STAGE8_SPEC.md section 19.1): a frame drawn twice with the clock standing, as the self-test's
   8E gait check draws it (the low Pratzen view 140 units out, each clock reached from three others and settled, then two frames 4 settled steps
   apart): the pixels that differ and every object of the scene whose world matrix changed between the two frames, by how much; the camera
   compared too. On each build named (before and after the exact settling), on a fresh page as the harness opens it.
   node tools/stage8/rest-8g.js <a.html> [<b.html> ...] [--json out.json]
   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; }, OUT=opt("--json");
const HTML=argv.filter((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json").map(f=>path.resolve(f));
const MEAS=function(){
  var gl=renderer.getContext(), out=[];
  function finishTween(){ var n=0; if(tween) mlReset("tween ended at once"); while(tween&&n<4){ tween(performance.now()+1e7); n++; } }
  function settle(n,noRender){ finishTween(); syncViewOffset(true); var fk=FK; FK=7.2; for(var i=0;i<(n||60);i++){ settling=false; updateVisibility(); } FK=fk; if(!noRender) renderFrame(); return settling; }
  function settleAll(){ for(var i=0;i<40;i++) if(!settle(30,true)) return true; return false; }
  function grab(){ renderFrame(); var w=gl.drawingBufferWidth, h=gl.drawingBufferHeight, b=new Uint8Array(w*h*4); gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b); return b; }
  function placeCam(c){ mlReset("placed"); tween=null; camArc=null; freeCam=true; curVantage=null; c=presetFrame(c); landCam.position.set(c[0],c[1],c[2]); orbitTarget.set(c[3],c[4],c[5]); landCam.lookAt(orbitTarget); clampCamera(); }
  function aim(mp,dir,r){ var w=W(mp[0],mp[1]), y=displayHeight(w[0],w[1]), d=new THREE.Vector3(dir[0],dir[1],dir[2]).normalize().multiplyScalar(r); placeCam([w[0]+d.x,y+d.y,w[1]+d.z,w[0],y,w[1]]); syncViewOffset(true); }
  function snap(){ var o=[]; scene.traverse(function(q){ var k=q.type, p=q.parent, d=0; while(p&&d<6){ if(p.userData&&p.userData.body){ k+=" of a formation's block"; break; } p=p.parent; d++; } if(q.userData&&q.userData.body) k="a formation's block";
    o.push({o:q, k:k, mw:Array.prototype.slice.call(q.matrixWorld.elements)}); }); o.cam=Array.prototype.slice.call(camera.matrixWorld.elements).concat(Array.prototype.slice.call(camera.projectionMatrix.elements)); return o; }
  closeFirst(null); setMode("terrain"); setPresentation("watch");
  aim([285,289],[-1.0,0.13,0.18],140);
  [545,640,830,905].forEach(function(t){
    [t-37,t-180,T_MIN,t+60].forEach(function(t0){ setClock(t0,{instant:true,force:true,camera:false}); settle(6,true); setClock(t,{instant:true,force:true,camera:false}); settleAll(); });
    settle(30,true); var A1=grab(), S1=snap(); settle(4,true); var A2=grab(), S2=snap(), px=0;
    for(var i=0;i<A1.length;i+=4) if(A1[i]!==A2[i]||A1[i+1]!==A2[i+1]||A1[i+2]!==A2[i+2]) px++;
    var by={}, n=0; if(S1.length===S2.length) S1.forEach(function(a,j){ var b=S2[j], dm=0; for(var e=0;e<16;e++) dm=Math.max(dm,Math.abs(a.mw[e]-b.mw[e])); if(dm>0){ n++; by[a.k]=Math.max(by[a.k]||0,dm); } });
    var cam=0; for(var c=0;c<S1.cam.length;c++) cam=Math.max(cam,Math.abs(S1.cam[c]-S2.cam[c]));
    out.push({clock:fmtClock(t), pixels:px, objectsMoved:n, largestBy:by, camera:cam}); });
  return out; };
(async()=>{ const browser=await L.launch(), res={chromium:browser.version(), builds:[]};
  for(const html of HTML){ process.env.AUSTERLITZ_HTML=html; const page=await L.open(browser,[1366,768],{}); await page.waitForTimeout(5000);
    const r=await page.evaluate(MEAS); await page.close();
    res.builds.push({file:path.basename(html), md5:crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex"), clocks:r});
    console.log(path.basename(html)+": "+r.map(c=>c.clock+" "+c.pixels+" px, "+c.objectsMoved+" objects moved"+(c.objectsMoved?" (largest "+Object.entries(c.largestBy).map(([k,v])=>k+" "+v.toExponential(1)).join(", ")+")":"")+", camera "+c.camera).join("; ")); }
  await browser.close();
  if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); } })().catch(e=>{ console.error(e); process.exit(1); });
