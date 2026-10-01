#!/usr/bin/env node
/* Stage 3D (docs/STAGE3_SPEC.md sections A.3 and H; the owner's answer in 3D): the drop limits of the landscape views whose
   framing the view offset changes, re-derived as Stage 2E derived the paper map's (tools/stage2/paper-limits.js): the limit is
   what the Stage 2C canvas pass hides (LABEL_STATS.hidden, owner decision 39) in the same view. The 2C build has no view
   offset, so each view is reproduced there with a PROBE: the case's clock, presentation, mode and selection (the 2C build's
   own applyCase), the eye and target the 3D build places for the case, and camera.setViewOffset with the offset the 3D build
   uses there (the orbit target at the centre of the free rectangle). Measured twice, as 2E did: with the 2C build's own panels
   ("native", the method Stage 2D used for every view), and with the 2C panels moved to the rectangles the 3D build's panels
   occupy in that view ("matched"); 2E took the matched count as the limit (the same items against the same obstacles).
   With --prev <build> (the build before 3D), the same view is also reproduced on that build and its own map layer's drops
   read (ML.stats.dropped): the method Stage 3B used for narrow-1024's limit. The owner chose this one for the two views
   (CHANGELOG.md, Stage 3D): the 2C counts (10 and 23) were far above what any layer drops there.
   node tools/stage3/offset-limits.js [3D build] [--prev build] [--json out.json] [--views a,b] */
const fs=require("fs"), path=require("path"), P=require("../stage2/page.js");
const argv=process.argv.slice(2), opt=k=>{ const i=argv.indexOf(k); return i>=0?argv[i+1]:null; };
const NEW=path.resolve(argv[0]&&!argv[0].startsWith("--")?argv[0]:path.join(P.ROOT,"austerlitz-command-map.html"));
const OLD=path.join(P.ROOT,"archive","stage2c-68ac7721.html");
const NAMES=(opt("--views")||"selected-formation,narrow-1024").split(",");
const SEL=[".rail",".dispatch",".legend",".timebar",".tools","#viewmode",".drawer","#selchip","#vsbadge","#firstrun","#tourbar"];
(async()=>{
  const b=await P.launch(), res={};
  for(const name of NAMES){
    const c=P.CASES.find(x=>x.name===name);
    let page=await P.open(b,c.viewport,NEW); await P.applyCase(page,c);
    const st=await page.evaluate(SEL=>{ const R={};
      SEL.forEach(q=>{ const e=document.querySelector(q); if(!e) return; const cs=getComputedStyle(e), r=e.getBoundingClientRect();
        R[q]=(cs.display==="none"||cs.visibility==="hidden"||e.hidden||r.width<1)?null:[r.left,r.top,r.width,r.height]; });
      return {eye:landCam.position.toArray(), target:orbitTarget.toArray(), off:[VOFF.x,VOFF.y], dropped:ML.stats.dropped, placed:ML.stats.placed,
        droppedIds:ML.stats.dropped_.map(k=>typeof k==="string"?k:k.key), panels:R}; },SEL);
    await page.close();
    const out={};
    for(const matched of [false,true]){
      page=await P.open(b,c.viewport,OLD); await P.applyCase(page,c);
      if(matched) await page.evaluate(R=>{ let css="";
        Object.keys(R).forEach(q=>{ css+=q+(R[q]?"{position:fixed!important;left:"+R[q][0]+"px!important;top:"+R[q][1]+"px!important;width:"+R[q][2]+"px!important;height:"+R[q][3]+
          "px!important;right:auto!important;bottom:auto!important;overflow:hidden!important;transform:none!important;max-height:none!important;box-sizing:border-box!important}":"{display:none!important}"); });
        const t=document.createElement("style"); t.textContent=css; document.head.appendChild(t); },st.panels);
      await page.evaluate(s=>{
        camera.position.fromArray(s.eye); orbitTarget.fromArray(s.target); camera.lookAt(orbitTarget);
        camera.setViewOffset(innerWidth,innerHeight,s.off[0],s.off[1],innerWidth,innerHeight); camera.updateProjectionMatrix();
        freeCam=true; tween=null; requestRender(3);
      },st);
      await P.settle(page);
      const old=await page.evaluate(()=>({hidden:LABEL_STATS.hidden, stats:Object.assign({},LABEL_STATS),
        target:(function(){ var v=orbitTarget.clone().project(camera); return [Math.round((v.x*0.5+0.5)*innerWidth),Math.round((-v.y*0.5+0.5)*innerHeight)]; })()}));
      if(process.env.SHOTS) fs.writeFileSync(path.join(process.env.SHOTS,name+"-2c-offset"+(matched?"-matched":"")+".png"),await page.screenshot());
      await page.close();
      out[matched?"matched":"native"]=old;
      console.log(name.padEnd(20),matched?"matched":"native ","3D: offset",st.off.map(x=>x.toFixed(1)).join(", "),"dropped",st.dropped,JSON.stringify(st.droppedIds),
        "| 2C probe: target at",JSON.stringify(old.target),"hidden",old.hidden,JSON.stringify(old.stats));
    }
    if(opt("--prev")){ page=await P.open(b,c.viewport,path.resolve(opt("--prev"))); await P.applyCase(page,c);
      await page.evaluate(s=>{ camera.position.fromArray(s.eye); orbitTarget.fromArray(s.target); camera.lookAt(orbitTarget);
        camera.setViewOffset(innerWidth,innerHeight,s.off[0],s.off[1],innerWidth,innerHeight); camera.updateProjectionMatrix(); freeCam=true; tween=null; requestRender(3); },st);
      await P.settle(page);
      out.prev=await page.evaluate(()=>({dropped:ML.stats.dropped, placed:ML.stats.placed, droppedIds:ML.stats.dropped_.map(k=>typeof k==="string"?k:k.key)}));
      await page.close();
      console.log(name.padEnd(20),"prev   ","the previous build's map layer in the same framing: dropped",out.prev.dropped,JSON.stringify(out.prev.droppedIds)); }
    res[name]={view3D:st, probe2C:{native:out.native,matched:out.matched}, limitNative:out.native.hidden, limitMatched:out.matched.hidden, prevBuild:out.prev||null};
  }
  if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify(res,null,1));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
