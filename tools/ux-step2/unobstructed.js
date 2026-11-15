#!/usr/bin/env node
/* UI/UX roadmap step 2: the roadmap's unobstructed-map targets (docs/UX_ART_AUDIT.md section 6: the first run at least 0.70, Study at 800 x 450 at
   least 0.45), measured on any build by the harness's own measure (tools/visual/measure.js unobstructed(): the share of the viewport not under an
   interface panel, on a 4 px grid), so that a base build and a later one are read alike. Step 2 changes no panel: this records where the two
   targets stand, for the steps that own them (PR 4, the first frame; PR 6, the mid-width layout).
   Each size on a fresh page: the first screen untouched (the card open), then after "Explore on my own" by a real click in Study at 09:00, then Watch.
   node tools/ux-step2/unobstructed.js <build.html> [more builds] [--json out.json] */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const ROOT=path.resolve(__dirname,"..",".."), TR=require(path.join(ROOT,"tools","visual","three-route.js"));
const MEASURE=fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8");
const { chromium } = require("playwright");
const argv=process.argv.slice(2), OUT=argv.indexOf("--json")>=0?argv[argv.indexOf("--json")+1]:null, builds=argv.filter(a=>a.endsWith(".html"));
const SIZES=[[1600,900],[1366,768],[1280,720],[800,450]];
(async()=>{
  const b=await chromium.launch({executablePath:process.env.AUSTERLITZ_CHROME||undefined,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]}), R=[];
  for(const html of builds){ const md5=crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex");
    for(const vp of SIZES){ const p=await b.newPage({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:1});
      await TR.routeThree(p); await p.goto("file://"+path.resolve(html)+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(p,240000);
      await p.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
      await p.evaluate(MEASURE); const settle=async()=>{ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(30)); await p.waitForTimeout(300); };
      /* two measures: the harness's (the viewport not under a panel) and the audit's (the free rectangle the map is framed in, as a share of the
         viewport: docs/UX_ART_AUDIT.md UA-03 and UA-07 quote this one) */
      const read=()=>p.evaluate(()=>{ var f=typeof landFreeRect==="function"&&mode!=="staff"?landFreeRect():MAPCAM.freeRect(); return {u:window.__aus.unobstructed(), free:+(((f[2]-f[0])*(f[3]-f[1]))/(innerWidth*innerHeight)).toFixed(4)}; });
      await settle(); const first=await read();
      await p.click("#fr-close",{timeout:60000}); await p.evaluate(()=>{ setPresentation("study"); setMode("terrain"); setClock(540,{instant:true,force:true}); }); await settle();
      const study=await read();
      await p.evaluate(()=>setPresentation("watch")); await settle(); const watch=await read();
      R.push({build:path.basename(html), md5:md5, vp:vp.join("x"), firstRun:first, study:study, watch:watch});
      const pc=x=>(100*x.u).toFixed(1)+"% not under a panel, the free rectangle "+(100*x.free).toFixed(1)+"%";
      console.log(md5.slice(0,8)+" "+vp.join("x").padEnd(9)+" first run: "+pc(first)+"; Study at 09:00: "+pc(study)+"; Watch: "+pc(watch));
      await p.close(); } }
  await b.close(); if(OUT) fs.writeFileSync(OUT,JSON.stringify(R,null,1));
})().catch(e=>{ console.error(e); process.exit(2); });
