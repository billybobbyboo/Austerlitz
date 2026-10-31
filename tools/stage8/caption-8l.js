#!/usr/bin/env node
/* Stage 8, the integration pass (question 267's caption line; docs/STAGE8_SPEC.md section 22): the timeline caption's two derived readings
   against the model, every ten minutes 04:00-17:00, in Watch at the Overview vantage (ph8-overview-watch's view), on each build given: the phase,
   whether the plateau reading applies (through PLATEAU_LAST's phase, an Allied strength on the heights), whether centreSeparation() finds a French
   formation across the line joining the Allied groups north and south of the Pratzeberg, the two groups' centroids (sideCentroid), what the
   caption shows, and every clock where the caption and the model disagree.
   node tools/stage8/caption-8l.js <build.html> [<build.html> ...] [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const L=require("./lib.js"), TR=require(path.join(L.ROOT,"tools","visual","three-route.js")), CASES=require(path.join(L.ROOT,"tools","visual","cases.js"));
const MEASURE=fs.readFileSync(path.join(L.ROOT,"tools","visual","measure.js"),"utf8");
const OUT=opt("--json"), builds=argv.filter((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json").map(a=>path.resolve(a));
const hm=t=>String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0");
(async()=>{
  const R={view:"ph8-overview-watch", builds:[]}, C=CASES.find(c=>c.name==="ph8-overview-watch");
  for(const html of builds){ const browser=await L.launch(), errs=[];
    const page=await browser.newPage({viewport:{width:C.viewport[0],height:C.viewport[1]},deviceScaleFactor:1});
    page.on("pageerror",e=>errs.push(e.message));
    await TR.routeThree(page); await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page);
    await page.evaluate(MEASURE); await page.evaluate(()=>closeFirst(null)); await page.evaluate(s=>window.__aus.apply(s),C);
    const rows=await page.evaluate(()=>{ var out=[]; for(var t=240;t<=1020;t+=10){ setClock(t,{instant:true,force:true,camera:false}); paintSituation();
        var onH=plateauStrength("al"), a=sideCentroid("al","south"), b=sideCentroid("al","north"), D=[].slice.call(document.querySelectorAll("#tb-cap .der"));
        out.push({t:t, phase:curPhase, plateau:curPhase<=PLATEAU_LAST&&onH>0, plateauAl:onH, separation:!!centreSeparation(),
          shown:D.map(function(e){ return e.classList.contains("cut")?"separation":"plateau"; }),
          north:b?b.map(function(v){ return +v.toFixed(1); }):null, south:a?a.map(function(v){ return +v.toFixed(1); }):null}); }
      return out; });
    const dis=rows.filter(r=>(r.plateau?1:0)+(r.separation?1:0)!==r.shown.length||(r.plateau&&!r.shown.includes("plateau"))||(r.separation&&!r.shown.includes("separation")));
    const sep=rows.filter(r=>r.separation).map(r=>r.t), last=sep.length?Math.max(...sep):null;
    R.builds.push({build:path.basename(html), md5:crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex"), chromium:browser.version(),
      rows:rows, disagree:dis.map(r=>r.t), separationLast:last, at1440:rows.find(r=>r.t===880), at1420:rows.find(r=>r.t===860), console:errs});
    console.log(path.basename(html)+": the centre separation last at "+(last===null?"-":hm(last))+"; at 14:40 "+JSON.stringify(rows.find(r=>r.t===880))+"; the caption disagrees with the model at "+dis.length+" of "+rows.length+" clocks");
    await browser.close(); }
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(R,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
