#!/usr/bin/env node
/* UI/UX roadmap step 1: the live block "ux1" (tools/visual/ux1.js) on its own, on any build (the base build included: its record is the
   reproduction of UA-05, UA-06, UA-13 and UA-17), judged by thresholds.js checkUx1. Real browser input; Chromium's touch emulation stands in
   for a finger (not a physical device).   node tools/ux-step1/probe.js [build.html] [--json out.json] [--selftest-only] [--only key,drag,lane,coincident,phases] (a subset: judged as a whole, the parts not run fail) */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const ROOT=path.resolve(__dirname,"..",".."), TR=require(path.join(ROOT,"tools","visual","three-route.js")), UX=require(path.join(ROOT,"tools","visual","ux1.js"));
const T=require(path.join(ROOT,"tools","visual","thresholds.js"));
const { chromium } = require("playwright");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html")), OUT=opt("--json");
const UA_IOS="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
(async()=>{
  const b=await chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]}), errs=[];
  async function open(vp,dev){
    const ctx=await b.newContext(dev==="ios"?{viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:UA_IOS}
      :dev==="touch"?{viewport:{width:vp[0],height:vp[1]},hasTouch:true}:{viewport:{width:vp[0],height:vp[1]}});
    const p=await ctx.newPage(); p.on("pageerror",e=>errs.push(e.message)); p.on("console",m=>{ if(m.type()==="error"||m.type()==="warning") errs.push(m.type()+": "+m.text()); });
    await TR.routeThree(p); await p.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(p,240000);
    await p.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
    return p; }
  async function settle(p){ await p.evaluate(()=>window.AUSTERLITZ_DEBUG&&AUSTERLITZ_DEBUG.settle?AUSTERLITZ_DEBUG.settle(30):null); await p.waitForTimeout(300); }
  const t0=Date.now(), live=await UX.runBlock(open,settle,{log:s=>console.log(s),selftestOnly:argv.includes("--selftest-only"),only:opt("--only")});
  await b.close();
  const md5=crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex"), f=T.checkUx1?T.checkUx1(live):["thresholds.js has no checkUx1"];
  console.log("build "+md5+", "+Math.round((Date.now()-t0)/1000)+" s; page errors and console messages "+errs.length+(errs.length?": "+errs.slice(0,5).join(" | "):""));
  console.log(f.length?"FAILED ("+f.length+"):\n  "+f.join("\n  "):"ux1: every check passed");
  if(OUT) fs.writeFileSync(OUT,JSON.stringify({build:path.basename(html),md5,live,failures:f,errors:errs},null,1));
  process.exit(f.length||errs.length?1:0);
})().catch(e=>{ console.error(e); process.exit(2); });
