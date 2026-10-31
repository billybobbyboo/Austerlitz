#!/usr/bin/env node
/* Stage 8, implementation PR 8D's prerequisite (decision 257 (b); docs/STAGE8_SPEC.md section 16.1): do the motion block's ceilings and its
   formations' visibility rule (thresholds.js MOTION, motionVis, checkLive) fail when the result is made worse?
   (1) A recorded report's motion block, judged as check:report judges it (checkLive), first as recorded (it passes), then with one thing made
       worse each time: a run's drawn formation-frames one fewer; its longest disappearance one frame longer; a run's denominator one smaller;
       fewer jumps bought by hiding (a run's jumps 5 fewer, so the 16's total under its ceiling, its drawn 40 fewer, hidden by the layout instead);
       the same with the hidden frames made absent (the denominator 40 smaller); a run by real input a frame worse than its twin; each total one
       over its ceiling. Each must fail, and with the rule's own words.
   (2) With --app: a copy of the build in which the stabiliser, while the view moves, hides a formation whose held place is taken instead of
       placing it close to its anchor (mlPlaceItem's near search removed from the hold): the motion block run on it in a page of its own
       (tools/visual/motion.js runBlock, the self-test's set) and judged; its jumps fall, and it must fail by its formations' visibility.
   node tools/stage8/vis-257.js <report.json> [--app <build.html>] [--json out.json]
   Measurement only: the copy is written to a temporary directory, nothing to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os");
const ROOT=path.resolve(__dirname,"..",".."), TH=require(path.join(ROOT,"tools","visual","thresholds.js"));
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const REP=argv.find((a,i)=>a.endsWith(".json")&&argv[i-1]!=="--json"), APP=opt("--app"), OUT=opt("--json");
if(!REP){ console.error("usage: vis-257.js <report.json> [--app <build.html>] [--json out.json]"); process.exit(2); }
const rep=JSON.parse(fs.readFileSync(REP,"utf8")), so=!!(rep.mode&&rep.mode.selftestOnly);
/* the motion block's own failures (checkLive judges every live block; only the motion block is given here) */
const judge=runs=>TH.checkLive({motion:{runs:runs}},{selftestOnly:so}).filter(x=>/^the map layer in motion/.test(x));
const clone=o=>JSON.parse(JSON.stringify(o));
const res={report:path.basename(REP), build:rep.build&&rep.build.file||null, cases:[]};
function tryCase(name,mut,want){
  const runs=clone(rep.live.motion.runs); mut(runs);
  const f=judge(runs), words=f.join(" "), ok=want?(f.length>0&&want.test(words)):!f.length;
  res.cases.push({name, fails:f.length, ok, words:words.slice(0,400)});
  console.log((ok?"ok   ":"WRONG")+" "+name+": "+(f.length?"fails: "+words.replace(/^the map layer in motion \(decision 240 \(a\)\): /,"").slice(0,260):"passes"));
}
const run=(runs,k)=>runs.find(r=>(r.key||"")===k);
tryCase("as recorded",()=>{},null);
tryCase("a run's drawn one fewer (land-orbit)",R=>{ const r=run(R,"land-orbit"); r.track.on--; r.track.placement++; },/land-orbit: formations drawn in 1954/);
tryCase("a run's longest disappearance one frame longer (hybrid-zoom)",R=>{ const r=run(R,"hybrid-zoom"); r.track.longestMs+=33; },/hybrid-zoom: a formation hidden by the layout for 1566 ms/);
tryCase("a run's denominator one smaller (paper-pan)",R=>{ const r=run(R,"paper-pan"); r.track.inView--; r.track.on--; },/paper-pan: formation-frames in view 1273/);
tryCase("fewer jumps bought by hiding (land-orbit: 5 fewer jumps, 40 formation-frames hidden by the layout)",R=>{ const r=run(R,"land-orbit"); r.jumps-=5; r.track.on-=40; r.track.placement+=40; },/land-orbit: formations drawn in 1915/);
tryCase("fewer jumps bought by making formations absent (land-orbit: 5 fewer jumps, 40 formation-frames out of the layer)",R=>{ const r=run(R,"land-orbit"); r.jumps-=5; r.track.on-=40; r.track.inView-=40; },/land-orbit: formation-frames in view 2326/);
tryCase("a run by real input a frame worse than its twin (hybrid-orbit+real: 40 fewer drawn)",R=>{ const r=run(R,"hybrid-orbit+real"); r.track.on-=40; },/hybrid-orbit\+real: formations drawn in 1449/);
tryCase("the jumps one over the ceiling",R=>{ run(R,"land-zoom").jumps++; },/jumps 246 over the 16 motions \(limit 245\)/);
tryCase("the pops one over the ceiling",R=>{ run(R,"land-zoom").pops++; },/pops 986 \(limit 985\)/);
tryCase("the level-of-detail switches one over the ceiling",R=>{ run(R,"land-zoom").lod++; },/level-of-detail switches 131 \(limit 130\)/);
tryCase("the flickers one over the ceiling",R=>{ run(R,"land-zoom").flicker++; },/flickers 11 \(limit 10\)/);
tryCase("a driven run's visibility not measured",R=>{ delete run(R,"low-pan").track; },/low-pan: its formations' visibility not measured/);
(async()=>{
  if(APP){
    const L=require("./lib.js"), MO=require(path.join(ROOT,"tools","visual","motion.js")), TR=require(path.join(ROOT,"tools","visual","three-route.js"));
    const src=fs.readFileSync(APP,"utf8"), from="if(mlHoldTry(it,VW,VH,panels,obst)||mlPlaceItem(it,VW,VH,panels,obst,true)){ it.room2=0; return true; }", to="if(mlHoldTry(it,VW,VH,panels,obst)){ it.room2=0; return true; }";
    if(src.split(from).length!==2) throw new Error("the hold's near search not found exactly once in "+APP);
    const dir=fs.mkdtempSync(path.join(os.tmpdir(),"vis-257-")), file=path.join(dir,"hide.html"); fs.writeFileSync(file,src.replace(from,()=>to));
    const browser=await L.launch(), page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1}), errs=[];
    page.on("pageerror",e=>errs.push(e.message));
    await TR.routeThree(page); await page.goto("file://"+file+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page);
    await page.evaluate(fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8")); await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
    const settle=async p=>{ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await p.waitForTimeout(450); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
    const M=await MO.runBlock(page,settle,{selftestOnly:so, log:s=>console.log("  "+s)}); await browser.close(); fs.rmSync(dir,{recursive:true,force:true});
    const base=M.runs.filter(r=>!r.real&&!r.point&&!r.select&&!r.reading&&!r.touch), S=k=>base.reduce((s,r)=>s+r[k],0), T={jumps:S("jumps"),pops:S("pops"),lod:S("lod"),flicker:S("flicker")};
    const f=judge(M.runs), vis=f.join(" ").match(/formations drawn in|hidden by the layout for|formation-frames in view/g)||[];
    res.app={mutation:"the hold hides a formation whose held place is taken (no near search while moving)", totals:T, fails:f, visibilityFailures:vis.length, console:errs,
      runs:M.runs.map(r=>({key:r.key, jumps:r.jumps, pops:r.pops, on:r.track.on, inView:r.track.inView, longestMs:r.track.longestMs}))};
    const ok=f.length>0&&vis.length>0&&T.jumps<TH.MOTION.JUMPS;
    console.log((ok?"ok   ":"WRONG")+" the app with formations hidden instead of placed close: the 16 "+JSON.stringify(T)+" (the build's 245 jumps), "+vis.length+" visibility failures: "+f.join(" ").slice(0,500));
    res.app.ok=ok;
  }
  const bad=res.cases.filter(c=>!c.ok).length+(res.app&&!res.app.ok?1:0);
  console.log(bad?bad+" WRONG":"every case as it should be");
  if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
  if(bad) process.exitCode=1;
})().catch(e=>{ console.error(e); process.exit(1); });
