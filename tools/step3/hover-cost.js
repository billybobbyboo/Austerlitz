#!/usr/bin/env node
/* Roadmap step 3 (handed on by step 1): the cost of the hover on every pointer move. bindCanvas's pointermove runs mlHoverAt, which runs
   pickFormation (and the map layer's hit tests) once per move. This measures it in the harness's page (software WebGL, ?harness=1), in five
   cases of cases.js, with the evidence skeleton off and on: 400 points on a grid over the free part of the screen, each move timed three
   times (median, p95 and max in ms), and the share of points over a formation, an item of the map layer or open ground. The decision
   rule, set before measuring (owner question): a fix only if a move's p95 exceeds 2 ms (the self-test's budget for a pan move). Not bundled;
   never run beside check:visual.  node tools/step3/hover-cost.js [build.html] [--json out.json] */
"use strict";
const fs=require("fs"), path=require("path");
const { chromium } = require("playwright");
const TR=require("../visual/three-route.js");
const ROOT=path.join(__dirname,"..","..");
const argv=process.argv.slice(2), html=path.resolve(argv.find(a=>!a.startsWith("--")&&!/\.json$/.test(a))||path.join(ROOT,"austerlitz-command-map.html"));
const jo=argv.indexOf("--json")>=0?argv[argv.indexOf("--json")+1]:null;
const CASES=require("../visual/cases.js"), NAMES=["overview-field","close-sokolnitz","hybrid-dimmed","paper-north-up","pratzen-low-10x"];
(async()=>{
  const browser=await chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
  await TR.routeThree(page);
  await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000});
  await TR.waitBoot(page);
  await page.evaluate(fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8"));
  const out=[];
  for(const name of NAMES){ const c=CASES.find(x=>x.name===name); if(!c) continue;
    await page.evaluate(s=>window.__aus.apply(s),c); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(20));
    for(const skel of [false,true]){
      const r=await page.evaluate(sk=>{
        if(!!layerOn.skeleton!==sk){ layerOn.skeleton=sk; SKEL.day=sk; updateVisibility(); }
        renderFrame();
        const fr=mode==="staff"?MAPCAM.freeRect():landFreeRect(), T=[], kinds={formation:0,item:0,ground:0};
        for(let i=0;i<20;i++) for(let j=0;j<20;j++){ const x=fr[0]+(fr[2]-fr[0])*(i+0.5)/20, y=fr[1]+(fr[3]-fr[1])*(j+0.5)/20, ts=[];
          for(let k=0;k<3;k++){ const t0=performance.now(); mlHoverAt(x,y); ts.push(performance.now()-t0); }
          T.push(ts.sort((a,b)=>a-b)[1]);
          const h=ML.hover; if(h) kinds.formation++; else if(typeof mlHit==="function"&&mlHit(x,y)) kinds.item++; else kinds.ground++; }
        mlHoverAt(-100,-100);
        T.sort((a,b)=>a-b); const q=p=>T[Math.min(T.length-1,Math.floor(p*T.length))];
        return {n:T.length,median:+q(0.5).toFixed(3),p95:+q(0.95).toFixed(3),max:+T[T.length-1].toFixed(3),kinds};
      },skel);
      out.push(Object.assign({case:name,skeleton:skel},r));
      console.log(name.padEnd(18)," skeleton "+(skel?"on ":"off")+"  median "+r.median+" ms  p95 "+r.p95+" ms  max "+r.max+" ms  ("+r.n+" points: "+r.kinds.formation+" over a formation, "+r.kinds.item+" over an item, "+r.kinds.ground+" ground)"); } }
  await browser.close();
  const worst=Math.max.apply(null,out.map(o=>o.p95));
  console.log("worst p95 "+worst.toFixed(3)+" ms against the rule's 2 ms: "+(worst>2?"a fix is called for":"no fix called for"));
  if(jo) fs.writeFileSync(jo,JSON.stringify(out,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
