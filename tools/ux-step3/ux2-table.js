#!/usr/bin/env node
/* UI/UX roadmap step 3: Step 2's acceptance measures (tools/ux-step2/probe.js) on the Step 2 build and on step 3's, one row a run (Markdown):
   the filled plates over the formations' box against 12%, the labels drawn (Watch against 12), the formations a live event names drawn of those
   in view and why the others were outside the measure (distance, the screen's edge, a panel, the reading), tier 3's contrast, the label pass.
   node tools/ux-step3/ux2-table.js <dir of step 2 runs> <dir of step 3 runs> */
"use strict";
const fs=require("fs"), path=require("path");
const [A,B]=process.argv.slice(2), rd=(d,p)=>fs.readdirSync(d).filter(f=>f.startsWith(p)&&f.endsWith(".json")&&!f.endsWith("-frames.json")).map(f=>[f.slice(p.length,-5),JSON.parse(fs.readFileSync(path.join(d,f),"utf8"))]);
const S2=Object.fromEntries(rd(A,"step2-")), S3=Object.fromEntries(rd(B,"step3-"));
const pc=x=>x===null||x===undefined?"-":(100*x).toFixed(1)+"%";
console.log("| run | build | filled plates over the box: max / median / frames over 12% | box's share of the free map (median) | labels drawn: max / median / frames over 12 | event-named formations drawn of in view | outside the measure: distance / off screen / panel / reading / corps | tier 3 vs casing: min / below 4.5 | label pass: median / 95th (ms) |");
console.log("|---|---|---|---|---|---|---|---|---|");
Object.keys(S3).sort().forEach(k=>{ [["Step 2",S2[k]],["Step 3",S3[k]]].forEach(([n,s])=>{ if(!s) return; const c=s.coverage, d=s.drawn, e=s.events, t=s.contrast.tier3.ring, o=e.out||{};
  console.log("| "+k+" | "+n+" | "+pc(c.max)+" / "+pc(c.median)+" / "+c.over12+" of "+c.frames+" | "+pc(c.bboxShareMedian)+" | "+d.max+" / "+d.median+" / "+d.over12+" | "+e.drawn+" of "+e.inView+" ("+pc(e.share)+") | "+
    (o.lod||0)+" / "+(o.offscreen||0)+" / "+(o.panel||0)+" / "+(o.reading||0)+" / "+(o.aggregate||0)+" | "+(t.n?t.min+" / "+t.below:"none drawn")+" | "+s.layerMs.median+" / "+s.layerMs.p95+" |"); }); });
