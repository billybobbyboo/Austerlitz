/* v-batch-rob: robustness #3 (R-4), three r128 alone (no app): does each lose/restore cycle add one dispose listener per geometry and
   texture in use, and keep heap after GC? 400 meshes (own geometry and material), 40 textures, 6 cycles.
   Uses node_modules/three/build/three.min.js (0.128.0). Writes docs/audit-post8-evidence/verification/v-batch-rob/ctx-leak.json. */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../../lib.js");
const ROOT=path.resolve(__dirname,"../../../..");
const OUT=path.join(ROOT,"docs/audit-post8-evidence/verification/v-batch-rob");
(async()=>{
  const three=fs.readFileSync(path.join(ROOT,"node_modules/three/build/three.min.js"),"utf8");
  const b=await A.launch();
  const page=await b.newPage({viewport:{width:320,height:240}});
  const cdp=await page.context().newCDPSession(page);
  await page.setContent("<!doctype html><canvas id=c width=320 height=240></canvas>");
  await page.addScriptTag({content:three});
  await page.evaluate(()=>{
    const cv=document.getElementById("c"); const r=new THREE.WebGLRenderer({canvas:cv});
    const sc=new THREE.Scene(), cam=new THREE.PerspectiveCamera(50,4/3,0.1,1000); cam.position.z=60;
    const tex=[]; for(let i=0;i<40;i++){ const d=new Uint8Array(16*16*4).fill(i*5); const t=new THREE.DataTexture(d,16,16); t.needsUpdate=true; tex.push(t); }
    for(let i=0;i<400;i++){ const m=new THREE.Mesh(new THREE.BoxGeometry(1,1,1,4,4,4),new THREE.MeshLambertMaterial({map:tex[i%40]})); m.position.set((i%20)-10,Math.floor(i/20)-10,0); sc.add(m); }
    sc.add(new THREE.AmbientLight(0xffffff,1));
    window.__t={r,sc,cam,tex,ext:r.getContext().getExtension("WEBGL_lose_context")};
    r.render(sc,cam);
    window.__count=()=>{ let gl=0,gmax=0,tl=0,tmax=0; __t.sc.traverse(o=>{ if(o.geometry){ const n=(o.geometry._listeners&&o.geometry._listeners.dispose||[]).length; gl+=n; gmax=Math.max(gmax,n);} });
      for(const t of __t.tex){ const n=(t._listeners&&t._listeners.dispose||[]).length; tl+=n; tmax=Math.max(tmax,n); } return {geoListeners:gl,geoMax:gmax,texListeners:tl,texMax:tmax}; };
  });
  async function snap(label){ await cdp.send("HeapProfiler.collectGarbage"); await cdp.send("HeapProfiler.collectGarbage"); const h=await cdp.send("Runtime.getHeapUsage"); const c=await page.evaluate(()=>__count()); return Object.assign({label,heapMB:+(h.usedSize/1e6).toFixed(3)},c); }
  const rows=[await snap("before any loss")];
  for(let k=1;k<=6;k++){
    await page.evaluate(()=>new Promise(res=>{ const cv=__t.r.domElement; cv.addEventListener("webglcontextlost",function f(){ cv.removeEventListener("webglcontextlost",f); res(); }); __t.ext.loseContext(); }));
    await page.evaluate(()=>new Promise(res=>{ const cv=__t.r.domElement; cv.addEventListener("webglcontextrestored",function f(){ cv.removeEventListener("webglcontextrestored",f); __t.r.render(__t.sc,__t.cam); res(); }); __t.ext.restoreContext(); }));
    rows.push(await snap("after restore "+k));
  }
  const res={what:"three r128 alone: dispose listeners and heap across lose/restore cycles",browser:b.version(),when:new Date().toISOString(),rows};
  fs.writeFileSync(path.join(OUT,"ctx-leak.json"),JSON.stringify(res,null,1));
  console.log(JSON.stringify(res,null,1));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
