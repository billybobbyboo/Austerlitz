#!/usr/bin/env node
/* The final audits' Stage 5, WP-08 (CL-MAP-06): the caption's rule on a build, as the harness's narrow block reads and judges it (the reads by real
   resizes to thresholds.js CAPTION.SIZES, measure.js captionParts at CAPTION.CLOCKS; judged by thresholds.js checkLive's caption lines alone). Its
   negative control is main's build at c1222e3 (the caption before WP-08): it must fail, WP-08's build pass.
   node tools/final-stage5/caption-judge.js <build.html> [--json out.json]
   Measurement only. */
"use strict";
const path=require("path"), fs=require("fs"), ROOT=path.resolve(__dirname,"..","..");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
process.env.AUSTERLITZ_HTML=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html"));
const L=require(path.join(ROOT,"tools","stage8","lib.js")), T=require(path.join(ROOT,"tools","visual","thresholds.js"));
const MEASURE=fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8");
(async()=>{ const b=await L.launch(), p=await L.open(b,[1366,768]); p.setDefaultTimeout(0);
  await p.evaluate(MEASURE); await p.evaluate(()=>{ AUSTERLITZ_DEBUG.settle(30); closeFirst(null); });
  const size=async(w,h)=>{ await p.setViewportSize({width:w,height:h}); await p.evaluate(()=>window.dispatchEvent(new Event("resize"))); await p.waitForTimeout(700); };
  const CAPS=[]; for(const [w,h] of T.CAPTION.SIZES){ await size(w,h); CAPS.push(...await p.evaluate(c=>window.__aus.captionParts(c),T.CAPTION.CLOCKS)); }
  await b.close();
  const f=T.checkLive({narrow:[{at:"caption",caps:CAPS}]},{}).filter(x=>/^the caption/.test(x));
  if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify({build:path.basename(process.env.AUSTERLITZ_HTML),reads:CAPS,failures:f},null,1));
  console.log(CAPS.length+" reads, "+f.length+" failing"); f.forEach(x=>console.log(" - "+x.slice(0,240))); process.exit(f.length?1:0); })().catch(e=>{ console.error(e); process.exit(2); });
