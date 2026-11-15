#!/usr/bin/env node
/* UI/UX roadmap step 2: check:visual's block "tiers" alone (tools/visual/ux2.js tierViews over thresholds.js TIER_VIEWS: the 13 views of the low
   views, the fog, the light, a tier 3 name selected and focused, Napoleon's reading, a phone held landscape, the Landscape with counters), judged by
   thresholds.js checkTiers, on a page as the harness's (1366 x 768, the measures injected). node tools/ux-step2/tiers.js [build.html] [--json out.json] */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const ROOT=path.resolve(__dirname,"..",".."), TR=require(path.join(ROOT,"tools","visual","three-route.js")), UX=require(path.join(ROOT,"tools","visual","ux2.js"));
const T=require(path.join(ROOT,"tools","visual","thresholds.js")), MEASURE=fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8");
const { chromium } = require("playwright");
const argv=process.argv.slice(2), OUT=argv.indexOf("--json")>=0?argv[argv.indexOf("--json")+1]:null;
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html"));
(async()=>{
  const b=await chromium.launch({executablePath:process.env.AUSTERLITZ_CHROME||undefined,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]}), errs=[];
  const p=await b.newPage({viewport:{width:1366,height:768},deviceScaleFactor:1}); p.on("pageerror",e=>errs.push(e.message)); p.on("console",m=>{ if(m.type()==="error"||m.type()==="warning") errs.push(m.type()+": "+m.text()); });
  await TR.routeThree(p); await p.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(p,240000);
  await p.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"}); await p.evaluate(MEASURE);
  const settle=async q=>{ await q.evaluate(()=>AUSTERLITZ_DEBUG.settle(30)); await q.waitForTimeout(300); };
  await settle(p);
  const t0=Date.now(), R=await UX.tierViews(p,settle,T.TIER_VIEWS); await b.close();
  R.lines.forEach(l=>console.log(l));
  const f=T.checkTiers(R.views), md5=crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex");
  console.log("build "+md5+", "+Math.round((Date.now()-t0)/1000)+" s; page errors and console messages "+errs.length+(errs.length?": "+errs.slice(0,5).join(" | "):""));
  console.log(f.length?"FAILED ("+f.length+"):\n  "+f.slice(0,40).join("\n  "):"the label tiers: every check passed in the "+R.views.length+" views");
  if(OUT) fs.writeFileSync(OUT,JSON.stringify({build:path.basename(html),md5,views:R.views,failures:f,errors:errs}));
  process.exit(f.length||errs.length?1:0);
})().catch(e=>{ console.error(e); process.exit(2); });
