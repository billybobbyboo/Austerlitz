#!/usr/bin/env node
/* UI/UX roadmap step 5: the live block "ux5" (tools/visual/ux5.js: the paper plate entered by real clicks, down and back, the phone) on its own, on any
   build, judged by thresholds.js checkUx5. On the base build (66b4edc2...) its record is the reproduction: no neatline, counters beyond the free map
   at 1366 x 768 and 1280 x 720, none of the twelve villages named, no cartouche. Pages as the harness opens them (?harness=1, software WebGL, the
   measures injected, CSS transitions off); the phone is Chromium's emulation, not a physical device.
   node tools/ux-step5/block.js [build.html] [--json out.json] [--so] */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("../ux-step3/lib.js"), UX=require(path.join(L.ROOT,"tools","visual","ux5.js")), T=require(path.join(L.ROOT,"tools","visual","thresholds.js"));
const MEASURE=fs.readFileSync(path.join(L.ROOT,"tools","visual","measure.js"),"utf8");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; }, SO=argv.includes("--so");
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=opt("--json");
(async()=>{
  const b=await L.launch(), pages=[];
  async function open(vp,dev){ const p=await L.open(b,html,{vp:vp,phone:dev==="ios"}); await p.evaluate(()=>document.fonts.ready); await p.evaluate(MEASURE);
    await p.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"}); pages.push(p); return p; }
  async function settle(p){ await L.settle(p,30); }
  const t0=Date.now(), live=await UX.runBlock(open,settle,{selftestOnly:SO,log:s=>console.log(s)});
  const env={chromium:b.version(), playwright:require("playwright/package.json").version};
  const errs=[].concat(...pages.map(p=>p.__errs));
  await b.close();
  const info=L.buildInfo(html), f=T.checkUx5(live,SO);
  console.log("build "+info.md5+" (sha256 "+info.sha256+", "+info.bytes+" bytes), Chromium "+env.chromium+" (Playwright "+env.playwright+", software WebGL), "+Math.round((Date.now()-t0)/1000)+" s; page errors and console messages "+errs.length+(errs.length?": "+errs.slice(0,5).join(" | "):""));
  console.log(f.length?"FAILED ("+f.length+"):\n  "+f.join("\n  "):"ux5: every check passed");
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify({build:info,env,live,failures:f,errors:errs},null,1)); }
  process.exit(f.length||errs.length?1:0);
})().catch(e=>{ console.error(e); process.exit(2); });
