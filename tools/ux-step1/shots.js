#!/usr/bin/env node
/* UI/UX roadmap step 1: compact before-and-after captures of the affected layouts (the evidence in docs/ux-step1/; not a check).
   node tools/ux-step1/shots.js <build.html> <outdir> <tag>   Each capture after real input where the state is one a press makes (the key, the
   chooser); the clock set by the page where it is only the moment shown. Touch is Chromium's emulation, not a device. */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(__dirname,"..",".."), TR=require(path.join(ROOT,"tools","visual","three-route.js"));
const { chromium } = require("playwright");
const [html,outDir,tag]=process.argv.slice(2);
const UA_IOS="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
(async()=>{
  fs.mkdirSync(outDir,{recursive:true});
  const b=await chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  async function open(vp,dev){ const ctx=await b.newContext(dev==="ios"?{viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:2,isMobile:true,hasTouch:true,userAgent:UA_IOS}:{viewport:{width:vp[0],height:vp[1]}});
    const p=await ctx.newPage(); await TR.routeThree(p); await p.goto("file://"+path.resolve(html)+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(p,240000);
    await p.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"}); await p.waitForTimeout(500); return p; }
  const settle=async p=>{ await p.evaluate(()=>window.AUSTERLITZ_DEBUG&&AUSTERLITZ_DEBUG.settle?AUSTERLITZ_DEBUG.settle(20):null); await p.waitForTimeout(400); };
  const tb=p=>p.evaluate(()=>{ const r=document.querySelector(".timebar").getBoundingClientRect(); return {x:0,y:Math.max(0,r.top-70),width:innerWidth,height:innerHeight-Math.max(0,r.top-70)}; });
  const shot=async(p,name,clip)=>{ await p.screenshot({path:path.join(outDir,tag+"-"+name+".png"),clip:clip||undefined,timeout:180000}); console.log(name); };
  /* UA-05: 800 x 450 and 390 x 844, after a real click or tap on "Show the key" */
  { const p=await open([800,450]); await settle(p); await p.click("#fr-grades"); await p.waitForTimeout(500); await settle(p); await shot(p,"key-800x450"); await p.context().close(); }
  { const p=await open([390,844],"ios"); await settle(p); await p.tap("#fr-grades"); await p.waitForTimeout(500); await settle(p); await shot(p,"key-390x844"); await p.context().close(); }
  /* UA-13 and UA-17: the timeline at 1280 x 720 at 09:00 (the Pratzen transition), and the coincident markers at 08:45 */
  { const p=await open([1280,720]); await p.evaluate(()=>{ closeFirst(null); setClock(540,{instant:true,force:true}); }); await settle(p);
    await shot(p,"timeline-1280-0900",await tb(p));
    await p.evaluate(()=>{ setClock(525,{instant:true,force:true}); }); await settle(p);
    const r=await p.evaluate(()=>{ const m=_evTicks.filter(o=>o.t===525).map(o=>o.el.getBoundingClientRect()); const x=m[0].left; return {x:Math.max(0,x-60),y:m[0].top-40,width:140,height:80}; });
    await shot(p,"coincident-1280-0845",r); await p.context().close(); }
  /* UA-06 and UA-17 on the phone: the marker row, then a real tap on the 08:45 set */
  { const p=await open([390,844],"ios"); await p.tap("#fr-close"); await p.evaluate(()=>{ setClock(540,{instant:true,force:true}); }); await settle(p);
    await shot(p,"timeline-390-0900",await tb(p));
    const m=await p.evaluate(()=>{ const o=_evTicks.filter(o=>o.t===525).pop().el.getBoundingClientRect(); return {x:o.left+o.width/2,y:o.top+o.height/2}; });
    await p.touchscreen.tap(m.x,m.y); await p.waitForTimeout(500); await settle(p);
    const tr=await tb(p); tr.y=Math.max(0,tr.y-160); tr.height=844-tr.y; await shot(p,"tap-0845-390",tr); await p.context().close(); }
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
