#!/usr/bin/env node
/* Stage 2E: measurements for the report (CHANGELOG.md, Stage 2E; docs/STAGE2_SPEC.md sections G, J and K).
   node tools/stage2/paper-2e.js [build] [--json out.json]
   1. section G.1's table for the 2E build's own paper map, in the probe's state (staff mode, Study, 09:30, entered as a visitor
      enters it): north on screen, px per true km at the Pratzeberg, Sokolnitz, the Santon and Satschan, the modelled ground
      on screen and inside the free rectangle (the probe's simple model: clear of the rail and the time bar) and the harness's
      unobstructed area;
   2. the time a switch into and out of the paper map takes (the ground redrawn flat, and back), at 1x, 4x and 10.33x, three
      times each, on the harness machine (headless Chromium, software WebGL);
   3. the head-obstacle question left open by 2D, on the paper map: in each paper view, the items dropped with the arrow heads,
      event glyphs and markers as obstacles (as built) and without them (a diagnostic only). */
const fs=require("fs"), path=require("path"), P=require("./page.js");
const argv=process.argv.slice(2), jo=argv.indexOf("--json");
const HTML=argv[0]&&!argv[0].startsWith("--")?path.resolve(argv[0]):null;
(async()=>{
  const b=await P.launch(), res={};
  let page=await P.open(b,[1600,900],HTML);
  await P.applyCase(page,{t:570,presentation:"study",mode:"staff",paper:"frame"});
  res.overview=await page.evaluate(()=>{
    const g=__aus.paperMap();
    function r(s){ var e=document.querySelector(s); if(!e) return null; var cs=getComputedStyle(e); if(cs.display==="none"||e.hidden) return null;
      if(e.classList.contains("rail")&&document.body.classList.contains("rail-hidden")) return null; var q=e.getBoundingClientRect(); return q.width>0?q:null; }
    var L=0,B=innerHeight, rail=r(".rail"), tb=r(".timebar"); if(rail) L=rail.right; if(tb) B=tb.top;
    var n=0, inS=0, v=new THREE.Vector3();
    for(var i=0;i<=36;i++) for(var j=0;j<=31;j++){ var x=-180+i*10, z=-155+j*10; v.set(x,0,z).project(camera); var sx=(v.x*0.5+0.5)*innerWidth, sy=(-v.y*0.5+0.5)*innerHeight; n++;
      if(sx>=L&&sx<=innerWidth&&sy>=0&&sy<=B) inS++; }
    return {camera:g.camera, northBearing:g.northBearing, pxPerKm:g.pxPerKm, spread:g.spread, scaleBar:g.scaleBar, frameOnScreen:g.frameOnScreen,
      frameInProbeFree:+(inS/n).toFixed(4), frameInUnobstructed:g.frameInFree, probeFree:[L,0,innerWidth,B].map(Math.round), freeRect:MAPCAM.freeRect(),
      pxPerKmMean:+(Object.values(g.pxPerKm).reduce((a,c)=>a+c,0)/4).toFixed(2)};
  });
  console.log("overview:",JSON.stringify(res.overview));
  res.switchMs=await page.evaluate(()=>{ const out={};
    DISPLAY.settings.forEach(f=>{ setMode("terrain"); setDisplayFactor(f); const into=[], back=[];
      for(let k=0;k<3;k++){ let t=performance.now(); setMode("staff"); into.push(+(performance.now()-t).toFixed(0)); t=performance.now(); setMode("terrain"); back.push(+(performance.now()-t).toFixed(0)); }
      out[fmtFactor(f)+"x"]={intoPaper:into, backToLandscape:back}; });
    setDisplayFactor(DISPLAY.defaultFactor); return out; });
  console.log("switch ms:",JSON.stringify(res.switchMs));
  await page.close();
  res.heads={};
  for(const name of ["staff-paper","paper-north-up","paper-close","paper-drawer","paper-laptop"]){
    const c=P.CASES.find(x=>x.name===name); page=await P.open(b,c.viewport,HTML); await P.applyCase(page,c);
    res.heads[name]=await page.evaluate(()=>{ mlLayout(); const a={dropped:ML.stats.dropped,ids:ML.stats.dropped_.slice(),heads:ovHeads.length};
      const keep=mlObstacles; mlObstacles=function(){ return []; }; mlLayout(); a.withoutSymbolObstacles=ML.stats.dropped; a.idsWithout=ML.stats.dropped_.slice();
      mlObstacles=keep; mlLayout(); return a; });
    console.log("heads",name.padEnd(15),JSON.stringify(res.heads[name]));
    await page.close();
  }
  if(jo>=0) fs.writeFileSync(argv[jo+1],JSON.stringify(res,null,1));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
