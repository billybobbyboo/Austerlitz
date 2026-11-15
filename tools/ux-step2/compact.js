#!/usr/bin/env node
/* UI/UX roadmap step 2: the per-frame records tools/ux-step2/probe.js writes (<tag>-frames.json), rewritten compactly for the repository: the
   same values, arrays for objects, numbers to four places. node tools/ux-step2/compact.js <dir>   (rewrites every *-frames.json in it, once) */
"use strict";
const fs=require("fs"), path=require("path"), dir=path.resolve(process.argv[2]||".");
const r=x=>typeof x==="number"?+x.toFixed(4):x;
fs.readdirSync(dir).filter(f=>/-frames\.json$/.test(f)).forEach(f=>{ const p=path.join(dir,f), o=JSON.parse(fs.readFileSync(p,"utf8"));
  if(o.compsFields){ console.log("already compact: "+f); return; }
  const out={note:"per frame: f, clock, the formations' box (bbox, its share of the free map), the share of it under filled plates (fillCover), under any drawn label's box (labelCover), under plates with marks and badges (fillAllCover), labels drawn, by tier, on a fill; samples: the frames drawn, each text's tier and contrast (ring: against its casing or plate; box: its words' whole box; bare: the ground alone)",
    comps:o.comps.map(c=>[c.f,r(c.clock),c.bbox||null,r(c.bboxShare),r(c.fillCover),r(c.labelCover),r(c.fillAllCover),c.drawn,[c.byTier[0]||0,c.byTier[1]||0,c.byTier[2]||0,c.byTier[3]||0],c.fills,c.tier3Fills.length]),
    compsFields:["f","clock","bbox","bboxShare","fillCover","labelCover","fillAllCover","drawn","byTier[0,1,2,3]","fills","tier3Fills"],
    samples:o.samples.map(s=>({f:s.f,clock:r(s.clock),boxFallback:s.boxFallback,texts:s.texts.map(t=>[t.k,t.tier,t.opacity,t.ring,t.wide,t.box,t.bare])})), textFields:["key","tier","opacity","ring","wide","box","bare"]};
  fs.writeFileSync(p,JSON.stringify(out)); console.log("compacted "+f); });
