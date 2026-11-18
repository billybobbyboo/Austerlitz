#!/usr/bin/env node
/* UI/UX roadmap step 5: the motion block's paper-map runs (tools/visual/motion.js runBlock, as check:visual runs them: the 16's paper-pan, paper-zoom,
   paper-glide and paper-play, paper-zoom's twin with the pointer and by real input, paper-zoom with Saint-Hilaire's division selected, paper-play
   under the Allied reading), on a page of its own as tools/stage8/motion-8h.js opens it (?harness=1, 1600 x 900, the measures injected, transitions
   off), optionally with a variant of the plate's prototype (tools/ux-step5/protos/plate.js) installed after the page started. runBlock is run from a
   copy of motion.js whose run list is filtered to the paper map's runs and whose long Play runs are skipped; every run's measures and visibility are
   motion.js's own. Each run's line against thresholds.js MOTION.VIS (decision 257 (b)).
   --eval "<js>": a statement run in the page after it started (the build's own switches, e.g. "PLATE.NAMES='framed'").
   node tools/ux-step5/motion-paper.js <build.html> [--variant name] [--eval js] [--json out.json]
   Measurement only. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), crypto=require("crypto");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), L=require(path.join(ROOT,"tools","stage8","lib.js")), TR=require(path.join(ROOT,"tools","visual","three-route.js"));
const TH=require(path.join(ROOT,"tools","visual","thresholds.js"));
const MO=(function(){ const f=path.join(ROOT,"tools","visual","motion.js"); let s=fs.readFileSync(f,"utf8");
  const rep=(a,b)=>{ if(s.split(a).length!==2) throw new Error("motion.js changed: "+a.slice(0,60)); s=s.replace(a,()=>b); };
  rep("for(const R of (o.onlyLong?[]:blockRuns(o.selftestOnly)))","for(const R of (o.onlyLong?[]:blockRuns(o.selftestOnly).filter(o.keep||(()=>true))))");
  rep("for(const [id,view,from,to,frames] of LONG)","for(const [id,view,from,to,frames] of (o.noLong?[]:LONG))");
  s=s.replace(/require\("(\.\/[^"]+)"\)/g,(m,q)=>"require("+JSON.stringify(path.join(path.dirname(f),q))+")");
  const tmp=path.join(fs.mkdtempSync(path.join(os.tmpdir(),"u5-motion-")),"motion.js"); fs.writeFileSync(tmp,s); return require(tmp); })();
const VARIANTS=require("./variants.js");
const OUT=opt("--json"), VAR=opt("--variant"), EV=opt("--eval"), html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json"&&argv[i-1]!=="--eval")||path.join(ROOT,"austerlitz-command-map.html"));
const MEASURE=fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8");
(async()=>{
  const browser=await L.launch(), errs=[], t0=Date.now();
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
  page.on("pageerror",e=>errs.push(e.message)); page.on("console",m=>{ if(m.type()==="warning"||m.type()==="error") errs.push(m.type()+": "+m.text().slice(0,200)); });
  await TR.routeThree(page); await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page);
  await page.evaluate(MEASURE); await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  if(VAR&&VARIANTS[VAR]){ await page.evaluate(fs.readFileSync(path.join(__dirname,"protos","plate.js"),"utf8")); await page.evaluate(o=>window.__u5.install(o),VARIANTS[VAR]); }
  if(EV) await page.evaluate(EV);
  const settle=async p=>{ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await p.waitForTimeout(450); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
  const R=await MO.runBlock(page,settle,{keep:r=>r.m[1]==="paper", noLong:true, log:s=>console.log(s)});
  R.build=path.basename(html); R.md5=crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex"); R.chromium=browser.version(); R.variant=VAR||null; R.eval=EV||null; R.console=errs; R.secs=Math.round((Date.now()-t0)/1000);
  await page.close(); await browser.close();
  const base=R.runs.filter(r=>!r.real&&!r.point&&!r.select&&!r.reading&&!r.touch);
  R.totals={jumps:base.reduce((s,r)=>s+r.jumps,0), pops:base.reduce((s,r)=>s+r.pops,0), lod:base.reduce((s,r)=>s+r.lod,0), flicker:base.reduce((s,r)=>s+(r.flicker||0),0)};
  R.runs.forEach(r=>{ const b=TH.MOTION.VIS[r.key]; r.vis=b; r.visFail=b?TH.motionVis?TH.motionVis(r,b):null:null; });
  console.log("paper runs ("+(VAR||"build")+"): the 16's four "+JSON.stringify(R.totals)+"; console "+errs.length+" ("+R.secs+" s)");
  R.runs.forEach(r=>console.log("  "+r.key.padEnd(20)+" jumps "+r.jumps+" pops "+r.pops+" flicker "+(r.flicker||0)+" drawn "+r.track.on+" of "+r.track.inView+", longest "+r.track.longestMs+" ms; baseline "+JSON.stringify(r.vis)+(r.visFail&&r.visFail.length?"  FAILS: "+r.visFail.join("; "):"")));
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(R,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
