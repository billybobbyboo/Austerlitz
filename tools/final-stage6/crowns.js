#!/usr/bin/env node
/* The final audits' Stage 6, WP-10 (CL-VIS-08; owner decision 308): the deciduous crowns near the eye, with the twigs (TREE6.U.uTwig 1) and as 8H drew them
   (0), in the audit's close views (tools/audit-post8/visual-landscape/shots.js: slope-10x-0900-r8, slope-4x-0900-r10, sok-castle-1500-close), each the
   same state drawn both ways: the PNGs written to <outdir>, and the frame's time (renderFrame, the median of 9 after 2 warm-ups; software WebGL, so a
   relative measure only), its draw calls and triangles.
   node tools/final-stage6/crowns.js <outdir> [build.html]. Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require(path.join(__dirname,"..","stage8","lib.js"));
const out=process.argv[2], html=process.argv[3]; if(html) process.env.AUSTERLITZ_HTML=path.resolve(html);
const VIEWS=[{id:"slope-10x-0900-r8",t:540,f:"model",aim:{map:"sthilaire",dir:[0.3,0.12,-0.95],r:8}},{id:"slope-4x-0900-r10",t:540,aim:{map:"sthilaire",dir:[0.3,0.15,-0.95],r:10}},
  {id:"sok-castle-1500-close",t:900,aim:{map:[212.9,344.3],dir:[-0.55,0.42,0.72],r:14}}];
(async()=>{
  fs.mkdirSync(out,{recursive:true});
  const b=await L.launch(), p=await L.open(b,[1600,900]), res=[];
  await p.addStyleTag({content:"#maplayer{visibility:hidden!important}"});
  for(const v of VIEWS){
    await p.evaluate(v=>window.__aus.apply({t:v.t,aim:v.aim,presentation:"watch",mode:"terrain",factor:v.f}),v);
    const r={id:v.id};
    for(const tw of [0,1]){
      await p.evaluate(tw=>{ TREE6.U.uTwig.value=tw; requestRender(3); },tw);
      await L.settle(p);
      await p.screenshot({path:path.join(out,v.id+"--twig"+tw+".png"),timeout:300000});
      r["twig"+tw]=await p.evaluate(()=>{ renderer.info.autoReset=false; for(var i=0;i<2;i++) renderFrame(); var T=[];
        for(var j=0;j<9;j++){ var t0=performance.now(); renderFrame(); renderer.getContext().finish(); T.push(performance.now()-t0); }
        renderer.info.reset(); renderFrame(); T.sort(function(a,b){ return a-b; });
        return {ms:+T[4].toFixed(1), calls:renderer.info.render.calls, tris:renderer.info.render.triangles}; });
    }
    res.push(r); console.log(JSON.stringify(r));
  }
  await p.evaluate(()=>{ TREE6.U.uTwig.value=1; });
  fs.writeFileSync(path.join(out,"crowns.json"),JSON.stringify(res,null,1));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
