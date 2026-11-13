#!/usr/bin/env node
/* The final audits' Stage 7, WP-12 (CL-PERF-03, -05, -07): a device route report (version 4 or later) holds what it says. Every segment with frames:
   its raw intervals (iv) as many as its frames; its histogram (hist) summing to them; its missed-refresh share (missedPct) and its shares over 1.2
   and 1.5 refreshes recomputed from iv and the report's refresh within 0.1 points; its largest calls and triangles at least their medians; and the
   blocks' own settings (fx, cull, sunShadow) recorded; every played segment its clock covered, clockTo after clockFrom (at least as late with one frame). Exit 1 on a finding.
   node tools/final-stage7/route-check.js <report.json> | --unit (the arithmetic alone)   (perf-local.js's --json, or a report's AUS_PERF_JSON line saved as JSON) */
"use strict";
const fs=require("fs");
/* first, the route's own arithmetic on known intervals (refreshStats, exported by tools/step6/perf-route.js), against the answers worked out by
   hand: at a 16.7 ms refresh the intervals 16.7, 33.4, 16.6, 50.1, 25.0, 17.0 and 32.0 ms span 1, 2, 1, 3, 1, 1 and 2 refreshes (each its
   length over the refresh, rounded), so 4 of 11 refreshes brought no new frame (36.4%); 4 of the 7 are over 1.2 refreshes (20.04 ms: 57.1%) and 3
   over 1.5 (25.05 ms: 42.9%). A floor in place of the rounding gives 2 of 9 (22.2%) */
const vm=require("vm"), path=require("path"), bad=[];
{ const box={console:{log(){},error(){}}}; vm.createContext(box); vm.runInContext(fs.readFileSync(path.join(__dirname,"..","step6","perf-route.js"),"utf8"),box);
  const RS=box.AUS_PERF&&box.AUS_PERF.refreshStats;
  if(typeof RS!=="function") bad.push("the route exports no refreshStats");
  else { const o=RS([16.7,33.4,16.6,50.1,25.0,17.0,32.0],16.7), want={missedPct:36.4, over12R:57.1, over15R:42.9}, H={"16":2,"33":1,"50":1,"25":1,"17":1,"32":1};
    Object.keys(want).forEach(k=>{ if(o[k]!==want[k]) bad.push("refreshStats on known intervals: "+k+" "+o[k]+", want "+want[k]); });
    if(JSON.stringify(Object.keys(o.hist).sort().map(k=>[k,o.hist[k]]))!==JSON.stringify(Object.keys(H).sort().map(k=>[k,H[k]]))) bad.push("refreshStats' histogram "+JSON.stringify(o.hist));
    if(o.iv.join()!=="16.7,33.4,16.6,50.1,25,17,32") bad.push("refreshStats' intervals "+o.iv.join());
    const z=RS([10,20],null); if(z.missedPct!==undefined&&z.missedPct!==null) bad.push("refreshStats without a refresh gives a share"); } }
if(process.argv[2]==="--unit"){ if(bad.length){ bad.forEach(b=>console.log("FAIL "+b)); process.exit(1); } console.log("the route's refresh arithmetic on known intervals OK"); process.exit(0); }
const j=JSON.parse(fs.readFileSync(process.argv[2],"utf8")), r=j.report||j, R=r.refreshMs;
if(!/route (4|[5-9])|route [2-9]$/.test(r.version||"")) bad.push("version "+r.version+": not a WP-12 route");
if(!("refreshEndMs" in r)) bad.push("no refreshEndMs (the refresh measured again at the end)");
if(!("wakeLock" in r)) bad.push("no wakeLock");
let n=0, played=0;
(r.segments||[]).filter(s=>s.kind!=="idle"&&s.frames>0).forEach(s=>{ n++; const k=s.id+" "+s.kind, iv=s.iv||[];
  if(iv.length!==s.frames) bad.push(k+": "+iv.length+" intervals for "+s.frames+" frames");
  const h=Object.values(s.hist||{}).reduce((a,b)=>a+b,0); if(h!==s.frames) bad.push(k+": the histogram holds "+h+" of "+s.frames);
  if(R){ let miss=0, span=0, o12=0, o15=0; iv.forEach(d=>{ const q=Math.max(1,Math.round(d/R)); miss+=q-1; span+=q; if(d>1.2*R) o12++; if(d>1.5*R) o15++; });
    const want=[span?100*miss/span:null, 100*o12/iv.length, 100*o15/iv.length], got=[s.missedPct,s.over12R,s.over15R];
    ["missedPct","over12R","over15R"].forEach((f,i)=>{ if(want[i]==null) return; if(!(Math.abs(got[i]-want[i])<=0.11)) bad.push(k+": "+f+" "+got[i]+", its intervals give "+want[i].toFixed(1)); }); }
  if(s.drawn>0){ if(!(s.callsMax>=s.calls)) bad.push(k+": callsMax "+s.callsMax+" under the median "+s.calls); if(!(s.trisMax>=s.tris)) bad.push(k+": trisMax "+s.trisMax+" under the median "+s.tris); }
  ["fx","cull","sunShadow"].forEach(f=>{ if(!(f in s)) bad.push(k+": no "+f); });
 });
/* the played segments, with frames or without (on software WebGL a short played block can draw none in its window): the clock they covered recorded,
   never backwards, and forwards where the block has two frames or more */
(r.segments||[]).filter(s=>s.kind!=="idle"&&(s.kind==="played"||/^play/.test(s.id))).forEach(s=>{ const k=s.id+" "+s.kind; played++;
  if(s.frames>0&&!(s.clockFrom!=null&&s.clockTo!=null&&(s.frames>=2?s.clockTo>s.clockFrom:s.clockTo>=s.clockFrom))) bad.push(k+": the clock it covered "+s.clockFrom+" to "+s.clockTo+" over "+s.frames+" frames");
  if(s.kind==="played"&&!(s.clockFrom!=null&&s.clockTo!=null&&s.clockTo>s.clockFrom)) bad.push(k+": Play's block without its clock covered ("+s.clockFrom+" to "+s.clockTo+")"); });
if(!n) bad.push("no segment with frames");
if(!played) bad.push("no played segment");
if(bad.length){ bad.slice(0,12).forEach(b=>console.log("FAIL "+b)); console.log("route report: "+bad.length+" findings"); process.exit(1); }
console.log("route report ("+r.version+"): "+n+" segments with frames, "+played+" played; every segment's intervals, histogram, refresh shares, maxima and settings as recorded OK");
