#!/usr/bin/env node
/* Final audit after Stage 8, verification v-batch-visual. Two bounded diagnostics on one harness page (1600 x 900; measurement only):
   A. visual-maps #11 (V-M12): the area's counters-pan10 clip made again (tools/audit-post8/visual-maps/clips.js: Landscape with counters,
      Study, 09:30, the Field vantage's camera; a left-button drag of 6 px a frame for 45 frames, 15 frames at rest, through the motion driver
      tools/visual/motion.js), logging each frame what the clip did not: the true eye-target distance (viewDist()), the banded distance the
      switches read (MLS.bandD), the orbit target, and the corps counters drawn. Decides whether the pan carried the distance across 250.
   B. visual-landscape #4: the stream ribbons' grazing term (world.js streamHook, STREAM.sky 2.0) toggled: the area's v-low-1630 view (spec in
      docs/audit-post8-evidence/visual-landscape/shots/v-low-1630.json) drawn as built, then with the stream materials recompiled at STREAM.sky 0
      (their program cache key changed so that three compiles the hook again), then put back; the near-white pixels (every channel >= 245) counted
      in the area's region box (1000,350)-(1300,480) of each frame. Decides whether the term causes the white.
   usage: node pan-and-stream.js <out-dir> */
"use strict";
const fs=require("fs"), path=require("path"), A=require("../../lib.js"), MO=require("../../../visual/motion.js");
const OUT=process.argv[2]; fs.mkdirSync(OUT,{recursive:true});
(async()=>{
  const b=await A.launch(), t0=Date.now(), VP=[1600,900];
  const page=await A.open(b,VP);
  await page.keyboard.press("Escape");
  const res={build:"md5 f10fe585c46aea576f436ed51ac46f83", viewport:VP};
  /* ---- A ---- */
  await page.evaluate(s=>window.__aus.apply(s),{viewport:VP,t:570,presentation:"study",mode:"hybrid",cam:[-195,92,156,-33,4,-2]}); await A.settle(page);
  await page.evaluate(MO.inPage);
  const SNAP=()=>{ var corps=[],div=0; for(var k in ML.items){ var it=ML.items[k]; if(it.eFrame!==ML.frame||it.state!=="on"||!/^c:/.test(k)) continue;
      var id=k.slice(2), f=FORMATIONS[id]; if(f&&(f.ech==="corps"||f.ech==="army")) corps.push(id); else div++; }
    return {viewDist:+viewDist().toFixed(2), bandD:MLS.bandD===null?null:+MLS.bandD.toFixed(2), target:[+orbitTarget.x.toFixed(2),+orbitTarget.y.toFixed(2),+orbitTarget.z.toFixed(2)],
      eye:[+camera.position.x.toFixed(2),+camera.position.y.toFixed(2),+camera.position.z.toFixed(2)], corpsOn:corps.length, nonCorpsCountersOn:div, corps:corps.sort().join(",")}; };
  const log=[];
  await page.evaluate(()=>{ var D=window.__md; D.start({gl:true}); requestRender(2); D.frame(8); var c=D.centre(); window.__rc=c; D.down(c[0],c[1],0); });
  log.push(Object.assign({frame:0},await page.evaluate(SNAP)));
  for(let i=1;i<=60;i++){
    await page.evaluate(i=>{ var D=window.__md, c=window.__rc; if(i<=45) D.move(c[0]+6*i,c[1],0); if(i===46) D.up(c[0]+270,c[1],0); D.frame(); },i);
    log.push(Object.assign({frame:i},await page.evaluate(SNAP)));
  }
  await page.evaluate(()=>window.__md.stop());
  res.pan={what:"counters-pan10 re-made with distances logged", frames:log,
    first:log[0], lastMoving:log[45], atRest:log[60], swapFrame:(log.find(r=>r.corpsOn>0)||{}).frame??null,
    maxViewDist:Math.max(...log.map(r=>r.viewDist)), minViewDist:Math.min(...log.map(r=>r.viewDist))};
  console.log("A", JSON.stringify({first:log[0],lastMoving:log[45],atRest:log[60],swap:res.pan.swapFrame}), ((Date.now()-t0)/1000).toFixed(0),"s");
  /* ---- B ---- */
  await page.evaluate(()=>{ if(!window.__held){ window.__held=true; window.loop=function(){ requestAnimationFrame(window.loop); }; } });
  const shotCount=async(name)=>{ const f=path.join(OUT,name+".png"); await page.screenshot({path:f,clip:{x:1000,y:350,width:300,height:130}});
    const n=await page.evaluate(async b64=>{ const im=new Image(); im.src="data:image/png;base64,"+b64; await im.decode(); const c=document.createElement("canvas"); c.width=im.width; c.height=im.height;
      const x=c.getContext("2d"); x.drawImage(im,0,0); const d=x.getImageData(0,0,c.width,c.height).data; let w=0,mx=0; for(let i=0;i<d.length;i+=4){ const m=Math.min(d[i],d[i+1],d[i+2]); if(m>=245) w++; mx=Math.max(mx,d[i],d[i+1],d[i+2]); } return {ge245:w,max:mx,px:c.width*c.height}; },
      fs.readFileSync(f).toString("base64"));
    return n; };
  const spec={viewport:VP,t:990,presentation:"watch",mode:"terrain",aim:{map:[285,289],dir:[-1,0.13,0.18],r:70}};
  await page.evaluate(sp=>window.__aus.apply(sp),spec); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90,true)); await page.waitForTimeout(450); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2));
  const asBuilt=await shotCount("stream-asbuilt");
  const nm=await page.evaluate(()=>{ var n=0; scene.traverse(function(o){ var ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[]; ms.forEach(function(m){
      if(m&&m.customProgramCacheKey&&m.customProgramCacheKey()==="stream8f"){ m.customProgramCacheKey=function(){ return "stream8f-sky"+STREAM.sky; }; m.needsUpdate=true; n++; } }); }); STREAM.sky=0; return n; });
  await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2));
  const sky0=await shotCount("stream-sky0");
  await page.evaluate(()=>{ STREAM.sky=2.0; scene.traverse(function(o){ var ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[]; ms.forEach(function(m){ if(m&&m.customProgramCacheKey&&/^stream8f-sky/.test(m.customProgramCacheKey())) m.needsUpdate=true; }); }); });
  await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2));
  const back=await shotCount("stream-back");
  res.stream={spec, region:[1000,350,300,130], streamMaterialsRecompiled:nm, asBuilt, sky0, restored:back};
  console.log("B", JSON.stringify(res.stream));
  res.errors=A.errors(page);
  fs.writeFileSync(path.join(OUT,"pan-and-stream.json"),JSON.stringify(res,null,1));
  await b.close(); console.log("done",((Date.now()-t0)/1000).toFixed(0),"s");
})().catch(e=>{ console.error("FAILED",e); process.exit(1); });
