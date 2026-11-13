#!/usr/bin/env node
/* The final audits' Stage 7, WP-12 (CL-PERF-03, -05, -09): Stage 8's device reports read again, from their JSON lines as committed
   (docs/stage8-evidence/device/*.json, the owner's runs of 1 November 2026; nothing here is a new measurement). For every segment: its frames a
   second, the refresh the report measured (R), its long-frame share as the route defined it (intervals over max(1.5 R, 25 ms) among the
   delivered frames) and beside it the share of refreshes that brought no new frame, estimated from the frame rate, 1 - fps x R (the reports
   kept no raw intervals: route 4, WP-12, records them); and for each report the largest of its segments' medians of calls and triangles
   (the route recorded medians, not maxima). Grouped by report and kind (the As of the phone route and of the brackets).
   node tools/final-stage7/device-reread.js [--json out.json]   Reads only. */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(__dirname,"..",".."), DIR=path.join(ROOT,"docs","stage8-evidence","device");
const OUT=(i=>i>=0?process.argv[i+1]:null)(process.argv.indexOf("--json"));
const med=a=>{ if(!a.length) return null; const s=a.slice().sort((x,y)=>x-y); return s.length%2?s[(s.length-1)/2]:(s[s.length/2-1]+s[s.length/2])/2; };
const r1=x=>x==null?null:Math.round(x*10)/10, r2=x=>x==null?null:Math.round(x*100)/100;
const res={note:"Stage 8's device reports read again; missedPct is 1 - fps x R, an estimate from each segment's frame rate (no raw intervals were kept)", reports:{}};
for(const f of fs.readdirSync(DIR).filter(f=>f.endsWith(".json")).sort()){
  const j=JSON.parse(fs.readFileSync(path.join(DIR,f),"utf8")), R=j.refreshMs, segs=j.segments.filter(s=>s.kind!=="idle"&&s.fps);
  const rows=segs.map(s=>({id:s.id, kind:s.kind, cand:s.cand||null, fps:s.fps, p50:s.p50, longPct:s.longPct, missedPct:R?r1(100*Math.max(0,1-s.fps*R/1000)):null, calls:s.calls, tris:s.tris}));
  const groups={};
  rows.forEach(r=>{ const k=r.id+" | "+(r.cand?(/warm/.test(r.kind)?"warm-up":r.cand):r.kind); (groups[k]=groups[k]||[]).push(r); });
  const G={}; Object.keys(groups).forEach(k=>{ const g=groups[k];
    G[k]={n:g.length, fpsMedian:r2(med(g.map(x=>x.fps))), fpsRange:[Math.min(...g.map(x=>x.fps)),Math.max(...g.map(x=>x.fps))], longPctMedian:r2(med(g.map(x=>x.longPct))),
      longPctRange:[Math.min(...g.map(x=>x.longPct)),Math.max(...g.map(x=>x.longPct))], missedPctMedian:r1(med(g.map(x=>x.missedPct))), missedPctRange:[Math.min(...g.map(x=>x.missedPct)),Math.max(...g.map(x=>x.missedPct))]}; });
  const own=rows.filter(r=>!r.cand||r.cand==="A");
  res.reports[f]={version:j.version, refreshMs:R, longMs:j.longMs, segments:rows.length, largestMedianCalls:Math.max(...own.map(r=>r.calls||0)), largestMedianTris:Math.max(...own.map(r=>r.tris||0)),
    largestMedianTrisAt:(own.slice().sort((a,b)=>b.tris-a.tris)[0]||{}).id, groups:G};
  console.log("\n"+f+" ("+j.version+"; R "+R+" ms, long > "+j.longMs+" ms): the largest segment median "+res.reports[f].largestMedianCalls+" calls, "+res.reports[f].largestMedianTris+" triangles ("+res.reports[f].largestMedianTrisAt+")");
  Object.keys(G).forEach(k=>{ const g=G[k]; console.log("  "+k.padEnd(34)+" n "+String(g.n).padStart(2)+"  fps "+g.fpsMedian+" ("+g.fpsRange.join("-")+")  long% "+g.longPctMedian+" ("+g.longPctRange.join("-")+")  missed% "+g.missedPctMedian+" ("+g.missedPctRange.join("-")+")"); });
}
if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
