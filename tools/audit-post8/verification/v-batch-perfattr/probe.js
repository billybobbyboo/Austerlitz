/* Final audit after Stage 8, verifier v-batch-perfattr: one page of one build (a visitor's page, tools/audit-post8/perf-attribution/pa-lib.js
   openVisitor with its draw stub), the device route's play-half set-up (pa-lib setup), then per drawn frame (renderFrameNow):
   (1) every renderBufferDirect classified: instanced or not, the pass (the sun's shadow camera or not), and the program's ACTIVE attributes that
       three r128's setupVertexAttributes binds (bindBuffer + vertexAttribPointer each; instanceMatrix 4 pointers, 1 bind), among them aPart/aPh/aSl;
   (2) every material's customProgramCacheKey call (three r128 getParameters calls it once per getProgram, three.js:13219), by material type;
   conditions: A as built; B every light's layers also enabling layer 1 (LAYER_LABEL, app.js:3519), so that renderFX's label pass (app.js:3757-3760)
   sees the same lights as the world pass; A again. Observation only: B is a page-local counterfactual, nothing written to a source file.
   Usage: node probe.js <html> <out.json> [w h]  */
"use strict";
const fs=require("fs");
const P=require("../../perf-attribution/pa-lib.js");
const INSTALL=function(){
  var R=window.__vb={frames:[], cur:null, wrapped:[]};
  function newF(){ return {draws:0, inst:0, instShadow:0, instMain:0, kitInst:0, kitInstShadow:0, extraVAP:0, instVAP:0, instBind:0, gp:0, gpBy:{}}; }
  var rbd=renderer.renderBufferDirect;
  renderer.renderBufferDirect=function(cam,scn,geo,mat,obj,grp){
    var r=rbd.apply(this,arguments), F=R.cur; if(!F) return r;
    F.draws++;
    if(obj&&obj.isInstancedMesh){ var sh=(sun&&cam===sun.shadow.camera); F.inst++; if(sh) F.instShadow++; else F.instMain++;
      var pr=renderer.properties.get(mat).currentProgram, at=pr?pr.getAttributes():{}, kit=0;
      for(var nm in at){ if(!(at[nm]>=0)) continue;
        if(geo.attributes[nm]!==undefined){ F.instVAP++; F.instBind++; if(nm==="aPart"||nm==="aPh"||nm==="aSl"){ F.extraVAP++; kit=1; } }
        else if(nm==="instanceMatrix"){ F.instVAP+=4; F.instBind++; }
        else if(nm==="instanceColor"&&obj.instanceColor){ F.instVAP++; F.instBind++; } }
      if(kit){ F.kitInst++; if(sh) F.kitInstShadow++; } }
    return r; };
  R.wrapped.push(["rbd",rbd]);
  /* getParameters' customProgramCacheKey: the prototype's and every own one reachable from the scene (incl. custom depth materials) */
  function count(m){ var F=R.cur; if(!F) return; F.gp++; var k=m.type+(m.lights===false?"":"")+(m.userData&&m.userData.anim?"+anim":""); F.gpBy[k]=(F.gpBy[k]||0)+1; }
  var proto=THREE.Material.prototype, pk=proto.customProgramCacheKey;
  proto.customProgramCacheKey=function(){ count(this); return pk.call(this); };
  var seen=new Set(), own=0;
  function wrapM(m){ if(!m||seen.has(m)) return; seen.add(m); if(Object.prototype.hasOwnProperty.call(m,"customProgramCacheKey")){ var f=m.customProgramCacheKey; m.__vbK=f; m.customProgramCacheKey=function(){ count(this); return f.call(this); }; own++; } }
  scene.traverse(function(o){ [].concat(o.material||[]).forEach(wrapM); wrapM(o.customDepthMaterial); wrapM(o.customDistanceMaterial); });
  var rfn=window.renderFrameNow;
  window.renderFrameNow=function(){ R.cur={draws:0, inst:0, instShadow:0, instMain:0, kitInst:0, kitInstShadow:0, extraVAP:0, instVAP:0, instBind:0, gp:0, gpBy:{}}; try{ return rfn.apply(this,arguments); } finally{ R.frames.push(R.cur); R.cur=null; } };
  var lights=[]; scene.traverse(function(o){ if(o.isLight) lights.push(o.type+(o.castShadow?"(shadow)":"")+" layers="+o.layers.mask); });
  return {ownWrapped:own, materialsSeen:seen.size, lights:lights, fx:FX.on, renderFX:typeof renderFX, labelLayer:typeof LAYER_LABEL!=="undefined"?LAYER_LABEL:null};
};
const TAKE=function(){ var R=window.__vb, F=R.frames; R.frames=[]; return F; };
const LIGHTS=function(on){ var n=0; scene.traverse(function(o){ if(o.isLight){ if(on) o.layers.enable(LAYER_LABEL); else o.layers.set(LAYER_WORLD); n++; } }); return n; };
function med(a){ const s=a.slice().sort((x,y)=>x-y); return s.length?s[Math.floor(s.length/2)]:null; }
function summ(F){ const keys=["draws","inst","instShadow","instMain","kitInst","kitInstShadow","extraVAP","instVAP","instBind","gp"], o={frames:F.length};
  keys.forEach(k=>o[k]=med(F.map(f=>f[k]))); const by={}; F.forEach(f=>Object.entries(f.gpBy).forEach(([k,v])=>{ by[k]=(by[k]||0)+v; })); Object.keys(by).forEach(k=>by[k]=+(by[k]/Math.max(1,F.length)).toFixed(2)); o.gpByPerFrame=by; return o; }
(async()=>{
  const html=process.argv[2], outF=process.argv[3], vp=[+(process.argv[4]||2560),+(process.argv[5]||1305)];
  const b=await P.A.launch(); const t0=Date.now();
  const page=await P.openVisitor(b,html,vp,{stub:true});
  const out={html, vp, boot:{firstFrame:page._boot.firstFrame,bootGone:page._boot.bootGone,stub:page._boot.stub}, openS:(Date.now()-t0)/1000, runs:[]};
  out.setup=await P.setup(page,"play-half");
  out.install=await page.evaluate(INSTALL);
  const run=async(label,lightsOn,n)=>{
    if(lightsOn!==null) out["lights_"+label]=await page.evaluate(LIGHTS,lightsOn);
    await page.evaluate(TAKE);
    const r=await P.runMotion(b,page,{kind:"play",n,warm:6,frameMs:1000/144,count:true});
    const F=(await page.evaluate(TAKE)).slice(-n);
    const st=r.steps||{};
    out.runs.push({label, err:r.err||r.begin.err||null, clock:[r.clock0,r.clock1], per:summ(F),
      gl:{vertexAttribPointer:r.counts?+(r.counts.gl.vertexAttribPointer/n).toFixed(1):null, bindBuffer:r.counts?+(r.counts.gl.bindBuffer/n).toFixed(1):null,
          useProgram:r.counts?+((r.counts.gl.useProgram||0)/n).toFixed(1):null, total:r.counts?+(r.counts.glTotal/n).toFixed(1):null,
          uniform:r.counts?+(Object.keys(r.counts.gl).filter(k=>/^uniform/.test(k)).reduce((s,k)=>s+r.counts.gl[k],0)/n).toFixed(1):null},
      ms:{loop:med(r.t.map(x=>x[1])), threeRender:st["three.render"]?med(st["three.render"]):null, renderFX:st.renderFX?med(st.renderFX):null},
      cpuMsPerFrame:+(r.cpu.runMs/n).toFixed(3), load:r.load});
    console.log(label, JSON.stringify(out.runs[out.runs.length-1]));
  };
  await run("A1",null,24);
  await run("B1",true,24);
  await run("A2",false,24);
  await run("B2",true,24);
  await page.evaluate(LIGHTS,false);
  out.log=page._log.slice(0,10);
  fs.writeFileSync(outF,JSON.stringify(out,null,1));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
