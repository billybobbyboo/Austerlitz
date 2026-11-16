#!/usr/bin/env node
/* UI/UX roadmap step 3: the live block "ux3" (tools/visual/ux3.js, who moves the camera, by real input) on its own, on any build, judged by
   thresholds.js checkUx3. On the Step 2 build its record is the reproduction of the cross-phase camera move (UA-02's "a pause or scrub can put
   the live event off screen"): the judge's failures there are the behaviour step 3 changes. Pages as the harness opens them (?harness=1,
   software WebGL, CSS transitions off); the phone is Chromium's emulation, not a physical device.
   node tools/ux-step3/continuity.js [build.html] [--json out.json] */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), UX=require(path.join(L.ROOT,"tools","visual","ux3.js")), T=require(path.join(L.ROOT,"tools","visual","thresholds.js"));
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=opt("--json");
(async()=>{
  const b=await L.launch(), pages=[];
  async function open(vp,dev){ const p=await L.open(b,html,{vp:vp,phone:dev==="ios"}); await p.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"}); pages.push(p); return p; }
  async function settle(p){ await L.settle(p,30); }
  const t0=Date.now(), live=await UX.runBlock(open,settle,{log:s=>console.log(s)});
  const env={chromium:b.version(), playwright:require("playwright/package.json").version};
  const errs=[].concat(...pages.map(p=>p.__errs));
  await b.close();
  const info=L.buildInfo(html), f=T.checkUx3(live);
  console.log("build "+info.md5+" (sha256 "+info.sha256+", "+info.bytes+" bytes), Chromium "+env.chromium+" (Playwright "+env.playwright+", software WebGL), "+Math.round((Date.now()-t0)/1000)+" s; page errors and console messages "+errs.length+(errs.length?": "+errs.slice(0,5).join(" | "):""));
  console.log(f.length?"FAILED ("+f.length+"):\n  "+f.join("\n  "):"ux3: every check passed");
  if(OUT) fs.writeFileSync(OUT,JSON.stringify({build:info,env,live,failures:f,errors:errs},null,1));
  process.exit(f.length||errs.length?1:0);
})().catch(e=>{ console.error(e); process.exit(2); });
