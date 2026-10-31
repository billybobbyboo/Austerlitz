#!/usr/bin/env node
/* Stage 8, the integration pass (question 267, the owner's choice of the bounded presentation repair; docs/STAGE8_SPEC.md section 22): the
   alternatives measured on the exact benchmark decision 257 (b) pins. Each variant is the build with replacements in its script (each must
   apply exactly once), written to a temporary copy; the motion block (tools/visual/motion.js runBlock: check:selftest's runs, or check:visual's
   with --full) runs on it on a page of its own as tools/stage8/motion-8h.js runs it, and thresholds.js's own judge (checkLive) decides it: the
   16's ceilings, every driven run's visibility baseline, each run by real input against its twin with the pointer, the invariants.
   The variants (none is adopted; each is a measured alternative, the code a sketch of the rule):
   - "none": the build as it is.
   - "kept-first-moving": while the view moves, the items drawn in the last pass keep (or move beside) their places first, in priority order,
     and the held ones are looked for after them, in the room left (persist's order at rest, applied in motion; decision 240 (a) keeps
     priority order in motion, section 3.4).
   - "protected-keeps-place": a never-dropped item (decision 39: the selection, the hovered, the highlighted family, live events) drawn in the
     last pass keeps its place while it is free, outside a fresh view, before the full search (a label hovered where it stands stays there).
   - "both": the two together.
   node tools/stage8/variants-8l.js <build.html> [--full] [--only name,...] [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), crypto=require("crypto");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const L=require("./lib.js"), TR=require(path.join(L.ROOT,"tools","visual","three-route.js")), MO=require(path.join(L.ROOT,"tools","visual","motion.js"));
const TH=require(path.join(L.ROOT,"tools","visual","thresholds.js"));
const MEASURE=fs.readFileSync(path.join(L.ROOT,"tools","visual","measure.js"),"utf8");
const OUT=opt("--json"), FULL=argv.includes("--full"), ONLY=opt("--only")?opt("--only").split(","):null;
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(L.ROOT,"austerlitz-command-map.html"));
const REST='for(var j=nk;j<order.length;j++){ var jt=order[j]; jt.held=false; if(!placeRest(jt,s)) jt.state="dropped"; }';
const KEEP='for(var ik=0;ik<nk;ik++){ var kt=order[ik]; kt.held=false; if(!(mlPlaceItem(kt,VW,VH,panels,obst)||mlWrapPlace(kt,VW,VH,panels,obst))) kt.state="dropped"; }';
const KEPT=[REST,'if(s==="hold"){ var back=[]; for(var j=nk;j<order.length;j++){ var jt=order[j]; jt.held=false; if(jt.el!==foc&&jt.wasOn&&jt.mem){ if(!placeRest(jt,s)) jt.state="dropped"; } else back.push(jt); }\n'+
  '      back.forEach(function(jt){ if(!placeRest(jt,s)) jt.state="dropped"; }); return; }\n    '+REST];
const PROT=[KEEP,'for(var ik=0;ik<nk;ik++){ var kt=order[ik]; kt.held=false; if(!((!MLS.fresh&&kt.el!==foc&&kt.wasOn&&kt.mem&&mlHoldTry(kt,VW,VH,panels,obst))||mlPlaceItem(kt,VW,VH,panels,obst)||mlWrapPlace(kt,VW,VH,panels,obst))) kt.state="dropped"; }'];
const VARIANTS=[{name:"none",rep:[]},{name:"kept-first-moving",rep:[KEPT]},{name:"protected-keeps-place",rep:[PROT]},{name:"both",rep:[KEPT,PROT]}];
(async()=>{
  const src=fs.readFileSync(html,"utf8"), R={build:path.basename(html), md5:crypto.createHash("md5").update(src).digest("hex"), full:FULL, variants:[]};
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"variants-8l-"));
  for(const V of VARIANTS){ if(ONLY&&!ONLY.includes(V.name)) continue;
    let s=src; for(const [a,b] of V.rep){ const n=s.split(a).length-1; if(n!==1) throw new Error(V.name+": a replacement found "+n+" times: "+a.slice(0,70)); s=s.replace(a,()=>b); }
    const file=path.join(dir,V.name+".html"); fs.writeFileSync(file,s);
    const browser=await L.launch(), errs=[], t0=Date.now();
    const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
    page.on("pageerror",e=>errs.push(e.message)); page.on("console",m=>{ if(m.type()==="warning"||m.type()==="error") errs.push(m.type()+": "+m.text().slice(0,200)); });
    await TR.routeThree(page); await page.goto("file://"+file+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page);
    await page.evaluate(MEASURE); await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
    const settle=async p=>{ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await p.waitForTimeout(450); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
    const B=await MO.runBlock(page,settle,{selftestOnly:!FULL, log:()=>{}}); R.chromium=browser.version(); await browser.close();
    const runs=B.runs, s16=runs.filter(r=>!r.real&&!r.point&&!r.select&&!r.reading&&!r.touch), S=k=>s16.reduce((a,r)=>a+r[k],0);
    const judged=TH.checkLive({motion:B},{selftestOnly:!FULL,legacy:true}).filter(x=>/map layer in motion/.test(x));
    const lines=judged.length?judged[0].replace(/^the map layer in motion \(decision 240 \(a\)\): /,"").replace(/ \{"jumps".*$/,"").split("; "):[];
    const drivenVis=runs.filter(r=>!r.real&&TH.MOTION.VIS[r.key]);
    const res={name:V.name, totals:{jumps:S("jumps"),pops:S("pops"),flicker:S("flicker"),lod:S("lod")}, failures:lines,
      visibilityRunsBelow:lines.filter(x=>/fewer drawn|hidden by the layout for/.test(x)).length,
      drawn:drivenVis.reduce((a,r)=>a+r.track.on,0), drawnBaselines:drivenVis.reduce((a,r)=>a+TH.MOTION.VIS[r.key][0],0),
      longestPlay:Object.fromEntries(runs.filter(r=>r.kind==="play").map(r=>[r.key,r.track.longestMs])),
      runs:runs.map(r=>({key:r.key,jumps:r.jumps,pops:r.pops,flicker:r.flicker,lod:r.lod,hover:r.hover,track:{on:r.track.on,inView:r.track.inView,longestMs:r.track.longestMs}})),
      console:errs, secs:Math.round((Date.now()-t0)/1000)};
    R.variants.push(res);
    console.log("["+V.name+"] the 16 "+JSON.stringify(res.totals)+"; formations drawn "+res.drawn+" (the baselines' "+res.drawnBaselines+"); "+lines.length+" failing lines"+(lines.length?": "+lines.join("; "):"")+"; console "+errs.length+" ("+res.secs+" s)"); }
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(R,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
