#!/usr/bin/env node
/* Stage 8, implementation PR 8D's prerequisite (decision 257 (b); docs/STAGE8_SPEC.md section 16.1): the harness's motion block on its own, on a
   page opened as the harness opens it (?harness=1, software WebGL, the measures injected, CSS transitions off), through the same code
   (tools/visual/motion.js runBlock): every run's jumps, pops, level-of-detail switches and flickers, its invariants, and the formations'
   visibility over it (the formation-frames in view, the drawn, the longest disappearance by the layout). --selftest the self-test page's set
   (two of the four by real input), else check:visual's (all four). Run twice to see the counts repeat; its JSON is the record thresholds.js's
   MOTION baselines are copied from (decision 257 (b): the totals at 8C's measure, and each run's visibility not below its own).
   node tools/stage8/motion-8d.js [<build.html>] [--selftest] [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js"), MO=require(path.join(L.ROOT,"tools","visual","motion.js")), TR=require(path.join(L.ROOT,"tools","visual","three-route.js"));
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), SO=argv.includes("--selftest"), html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(L.ROOT,"austerlitz-command-map.html"));
const MEASURE=fs.readFileSync(path.join(L.ROOT,"tools","visual","measure.js"),"utf8");
(async()=>{
  const browser=await L.launch(), errs=[], t0=Date.now();
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
  page.on("pageerror",e=>errs.push(e.message)); page.on("console",m=>{ if(m.type()==="warning"||m.type()==="error") errs.push(m.type()+": "+m.text().slice(0,200)); });
  await TR.routeThree(page); await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page);
  await page.evaluate(MEASURE); await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  const settle=async p=>{ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await p.waitForTimeout(450); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
  const R=await MO.runBlock(page,settle,{selftestOnly:SO, log:s=>console.log(s)}), ver=browser.version();
  await page.close(); await browser.close();
  const base=R.runs.filter(r=>!r.real&&!r.select&&!r.reading&&!r.touch), S=k=>base.reduce((s,r)=>s+r[k],0);
  R.totals={jumps:S("jumps"), pops:S("pops"), lod:S("lod"), flicker:S("flicker")};
  R.build=path.basename(html); R.md5=crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex"); R.chromium=ver;
  R.selftestOnly=SO; R.console=errs; R.secs=Math.round((Date.now()-t0)/1000);
  console.log("the 16: "+JSON.stringify(R.totals)+"; "+R.runs.length+" runs; console "+errs.length+" ("+R.secs+" s)");
  R.runs.forEach(r=>console.log("  "+r.key.padEnd(28)+" formations drawn "+r.track.on+" of "+r.track.inView+" ("+(r.track.inView?(100*r.track.on/r.track.inView).toFixed(1):"-")+"%), longest hidden "+r.track.longestMs+" ms, "+r.track.episodes+" disappearances"));
  if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(R,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
