#!/usr/bin/env node
/* The final audits' Stage 6, WP-10 (CL-VIS-05): why the streams saturate to white in grazing and low-sun views. The audit's four views
   (tools/audit-post8/visual-landscape/shots.js: v-low-1630, inf-east-0900, ice-mid-1500, sok-castle-1500-close), each drawn as built and with one
   thing changed at a time: the streams hidden (what is theirs), the stream material's grazing sky term off (STREAM.sky 0, the program compiled again under a key of its own: the material's key is constant), its environment off
   (envMapIntensity 0), a rougher surface (roughness 0.6), the post-processing off (no bloom). The map layer is hidden for the captures. The PNGs are
   written to <outdir>; the pixels at 250 or more in every channel are counted by tools/final-stage6/whites.py.
   node tools/final-stage6/streams.js <outdir> [build.html]. Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require(path.join(__dirname,"..","stage8","lib.js"));
const out=process.argv[2], html=process.argv[3]; if(html) process.env.AUSTERLITZ_HTML=path.resolve(html);
const VIEWS=[{id:"v-low-1630",t:990,aim:{map:[285,289],dir:[-1.0,0.13,0.18],r:70}},{id:"inf-east-0900",t:540,aim:{map:"sthilaire",dir:[0.7,0.35,0.2],r:26}},
  {id:"ice-mid-1500",t:900,aim:{map:[262,444],dir:[0.45,0.50,-0.74],r:58}},{id:"sok-castle-1500-close",t:900,aim:{map:[212.9,344.3],dir:[-0.55,0.42,0.72],r:14}}];
const VAR=(process.env.STREAM_VARIANTS?JSON.parse(process.env.STREAM_VARIANTS):[["built",""],["no-streams","streams"],["sky0","sky"],["env0","env"],["rough06","rough"],["nofx","fx"]]);
(async()=>{
  fs.mkdirSync(out,{recursive:true});
  const b=await L.launch(), p=await L.open(b,[1600,900]);
  await p.addStyleTag({content:"#maplayer{visibility:hidden!important}"});
  for(const v of VIEWS){
    await p.evaluate(v=>window.__aus.apply({t:v.t,aim:v.aim,presentation:"watch",mode:"terrain"}),v);
    for(const [name,what] of VAR){
      await p.evaluate(w=>{ var S=world.water.filter(function(m){ return m.userData.drape&&m.userData.drape.kind==="stream"; }), mat=WATER_MATS.land.stream;
        window.__keep=window.__keep||{sky:STREAM.sky, env:mat.envMapIntensity, rough:mat.roughness};
        STREAM.sky=window.__keep.sky; mat.envMapIntensity=window.__keep.env; mat.roughness=window.__keep.rough; S.forEach(function(m){ m.visible=true; }); setFXEnabled(true);
        if(w==="streams") S.forEach(function(m){ m.visible=false; });
        if(w==="sky"){ STREAM.sky=0; mat.customProgramCacheKey=function(){ return "stream8f-sky0"; }; } else mat.customProgramCacheKey=function(){ return "stream8f"; }; if(w==="env") mat.envMapIntensity=0; if(w==="rough") mat.roughness=0.6; if(/^rough:/.test(w)) mat.roughness=+w.slice(6); if(w==="fx") setFXEnabled(false);
        mat.needsUpdate=true; requestRender(3); },what);
      await L.settle(p);
      await p.screenshot({path:path.join(out,v.id+"--"+name+".png"),timeout:300000});
    }
    await p.evaluate(()=>{ var mat=WATER_MATS.land.stream; STREAM.sky=window.__keep.sky; mat.envMapIntensity=window.__keep.env; mat.roughness=window.__keep.rough; mat.needsUpdate=true; setFXEnabled(true);
      world.water.forEach(function(m){ m.visible=true; }); });
    console.log(v.id,"captured");
  }
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
