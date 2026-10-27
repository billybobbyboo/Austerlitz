#!/usr/bin/env node
/* Stage 8, implementation PR 8D: the in-app self-test on one page opened as the harness opens its self-test page (--selftest-only: 1366 x 768,
   ?harness=1, three.js by its one route, the embedded faces loaded, the measures injected, CSS transitions off, settled), its result written as
   a report that tools/visual/check-report.js --write-manifest reads (the build's md5, the mode, the self-test). Written because a harness run
   stopped by a later live block writes no report, and the manifest is written from a passing self-test only (check-report.js refuses
   otherwise); it runs nothing but the self-test, so it judges nothing else.
   node tools/stage8/selftest-report.js [<build.html>] <outdir>
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js"), TR=require(path.join(L.ROOT,"tools","visual","three-route.js"));
const argv=process.argv.slice(2), html=path.resolve(argv.find(a=>a.endsWith(".html"))||path.join(L.ROOT,"austerlitz-command-map.html")), out=argv.find(a=>!a.endsWith(".html"));
if(!out){ console.error("usage: selftest-report.js [<build.html>] <outdir>"); process.exit(2); }
const MEASURE=fs.readFileSync(path.join(L.ROOT,"tools","visual","measure.js"),"utf8");
(async()=>{
  const browser=await L.launch(), errs=[], t0=Date.now();
  const page=await browser.newPage({viewport:{width:1366,height:768},deviceScaleFactor:1});
  page.on("console",m=>{ const t=m.type(); if(t==="warning"||t==="error"||t==="assert") errs.push(t+": "+m.text().slice(0,300)); });
  page.on("pageerror",e=>errs.push("pageerror: "+e.message));
  await TR.routeThree(page); await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page);
  await page.evaluate(()=>document.fonts?document.fonts.ready.then(()=>document.fonts.status):"no document.fonts");
  await page.evaluate(MEASURE);
  await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await page.waitForTimeout(450); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2));
  const st=await page.evaluate(()=>AUSTERLITZ_DEBUG.selfTest());
  const ver=browser.version(); await browser.close();
  const r={html:path.basename(html), md5:crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex"), when:new Date().toISOString(),
    mode:{test:true, legacy:false, selftestOnly:true, only:null, selfTestAlone:true}, env:{chromium:ver, platform:process.platform}, selfTest:st, console:errs, secs:Math.round((Date.now()-t0)/1000)};
  fs.mkdirSync(out,{recursive:true}); fs.writeFileSync(path.join(out,"report.json"),JSON.stringify(r,null,1));
  const f=st.checks.filter(c=>!c.ok);
  console.log("self-test: "+st.checks.length+" checks, "+f.length+" failed; console "+errs.length+" ("+r.secs+" s)");
  f.forEach(c=>console.log("FAIL "+c.name+"  "+c.detail)); errs.slice(0,5).forEach(e=>console.log("CONSOLE "+e));
})().catch(e=>{ console.error(e); process.exit(1); });
