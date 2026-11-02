/* v-batch-rob: robustness #1 (R-2), three r128 alone (no app): does a program compiled after WEBGL_lose_context.loseContext() and before
   the webglcontextlost event throw "reading 'trim'"? And does a requestAnimationFrame callback run before that event?
   Uses node_modules/three/build/three.min.js (0.128.0). Writes docs/audit-post8-evidence/verification/v-batch-rob/ctx-race.json. */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../../lib.js");
const ROOT=path.resolve(__dirname,"../../../..");
const OUT=path.join(ROOT,"docs/audit-post8-evidence/verification/v-batch-rob");
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  const three=fs.readFileSync(path.join(ROOT,"node_modules/three/build/three.min.js"),"utf8");
  const b=await A.launch();
  const page=await b.newPage({viewport:{width:320,height:240}});
  const errs=[]; page.on("pageerror",e=>errs.push(String(e.message)));
  await page.setContent("<!doctype html><canvas id=c width=320 height=240></canvas>");
  await page.addScriptTag({content:three});
  const res=await page.evaluate(async()=>{
    const out={rev:THREE.REVISION,trials:[]};
    for(let t=0;t<3;t++){
      const cv=document.createElement("canvas"); cv.width=320; cv.height=240; document.body.appendChild(cv);
      const r=new THREE.WebGLRenderer({canvas:cv}); const gl=r.getContext();
      const sc=new THREE.Scene(), cam=new THREE.PerspectiveCamera(50,4/3,0.1,100); cam.position.z=5;
      sc.add(new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial({color:0xff0000}))); r.render(sc,cam);
      let evFired=false; cv.addEventListener("webglcontextlost",()=>{ evFired=true; });
      const rec={checkShaderErrors:r.debug.checkShaderErrors};
      gl.getExtension("WEBGL_lose_context").loseContext();
      rec.lostSync=gl.isContextLost(); rec.eventFiredSync=evFired;
      rec.infoLogOnLost=String(gl.getProgramInfoLog(gl.createProgram()));
      /* the next animation frame: has the event fired yet? then a frame that needs a new program */
      await new Promise(res=>requestAnimationFrame(()=>{
        rec.eventFiredBeforeRaf=evFired;
        sc.add(new THREE.Mesh(new THREE.SphereGeometry(),new THREE.MeshLambertMaterial({color:0x00ff00})));
        sc.add(new THREE.AmbientLight(0xffffff,0.5));
        try{ r.render(sc,cam); rec.render="ok"; }catch(e){ rec.render="threw: "+e.message; }
        res();
      }));
      await new Promise(res=>setTimeout(res,50)); rec.eventFiredLater=evFired;
      out.trials.push(rec);
    }
    return out;
  });
  res.pageErrors=errs; res.browser=b.version(); res.when=new Date().toISOString();
  fs.writeFileSync(path.join(OUT,"ctx-race.json"),JSON.stringify(res,null,1));
  console.log(JSON.stringify(res,null,1));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
