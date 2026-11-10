#!/usr/bin/env node
/* The final audits' Stage 6, WP-09 (CL-UX-18): the narrow live block's 800 x 450 step alone (tools/visual/harness.js, "800x450 panels"), on a
   page opened at 1366 x 768 and resized as the block resizes it, judged by the block's rule (thresholds.js checkLive: the tools and the dispatch card
   both shown with the Panels open, not overlapping). The negative control: run on a build without app.js syncToolsEdge, it must fail.
   node tools/final-stage6/ux18.js [build.html]. Measurement only. */
"use strict";
const path=require("path");
const html=process.argv[2]; if(html) process.env.AUSTERLITZ_HTML=path.resolve(html);
const L=require(path.join(__dirname,"..","stage8","lib.js"));
(async()=>{
  const b=await L.launch(), p=await L.open(b,[1366,768]);
  await p.evaluate(()=>{ closeFirst(null); setPresentation("study"); select(null,null); showEverything(); });
  await p.setViewportSize({width:800,height:450}); await p.evaluate(()=>window.dispatchEvent(new Event("resize"))); await p.waitForTimeout(700);
  const n8=await p.evaluate(()=>{ setPanels(true); select(null,null);
    const t=document.getElementById("tools"), d=document.querySelector(".dispatch"), a=t.getBoundingClientRect(), b=d.getBoundingClientRect();
    const ts=getComputedStyle(t).display!=="none"&&a.width>0, ds=getComputedStyle(d).display!=="none"&&b.width>0;
    return {docked:docked, rail:!document.body.classList.contains("rail-hidden"), tools:ts, card:ds, toolsBottom:+a.bottom.toFixed(1), cardTop:+b.top.toFixed(1),
      over:ts&&ds&&Math.min(a.right,b.right)>Math.max(a.left,b.left)&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top)}; });
  const fail=!n8||n8.docked||!n8.rail||!n8.tools||!n8.card||n8.over;
  console.log((fail?"FAIL ":"OK ")+JSON.stringify(n8));
  await b.close(); process.exit(fail?1:0);
})().catch(e=>{ console.error(e); process.exit(2); });
