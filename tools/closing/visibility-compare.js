#!/usr/bin/env node
/* The closing re-verification pass: the audit's visibility runs (tools/audit-post8/visibility/long-play.js, analyse.js) made again on this build
   (docs/closing-evidence/visibility/), compared run by run with the audit's own tables (docs/audit-post8-evidence/visibility/tables.json) for the
   findings they reproduce: CL-MAP-01 (the longest hidden by the layout, the formations under half drawn), CL-MAP-02 (the formations a live event
   names, their share while its label is drawn), CL-MAP-07 (the phone), CL-MAP-14 (at rest after Play: hidden after against a fresh view),
   CL-MAP-17 (the Landscape's names: share hidden and episodes) and CL-TEST-02 (the 90-frame benchmark's window against the long runs).
   Reads only.   node tools/closing/visibility-compare.js [--json out.json] */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(__dirname,"..","..");
const A=require(path.join(ROOT,"docs","audit-post8-evidence","visibility","tables.json")), N=require(path.join(ROOT,"docs","closing-evidence","visibility","tables.json"));
const OUT=process.argv.includes("--json")?process.argv[process.argv.indexOf("--json")+1]:null;
const pct=x=>x==null?"-":(100*x).toFixed(1)+"%";
const sum=r=>{ if(!r) return null; const F=r.formations.filter(f=>f.play&&f.play.inView>0);
  const longest=F.reduce((m,f)=>{ const c=f.play.longestClockMin||0; return c>m.c?{c,id:f.id}:m; },{c:0,id:null});
  const under=F.filter(f=>f.play.inView>=60&&f.play.share<0.5).map(f=>f.id+" "+pct(f.play.share));
  const never=F.filter(f=>f.play.inView>=60&&f.play.drawn===0).map(f=>f.id);
  const rs=r.restSum||{}, extra=(rs.hiddenAfter||[]).filter(x=>!(rs.hiddenFresh||[]).includes(x));
  return {share:r.playTotal.share, longestMs:r.total.longestMs, longestClockMin:longest.c, longestWho:longest.id, under50:under, never60:never,
    evShare:r.evTot?r.evTot.share:null, evWorst:(r.evWorst||[]).slice(0,4).map(e=>e.event+" "+e.id+" "+pct(e.share)),
    restHiddenAfter:rs.hiddenAfter||[], restHiddenFresh:rs.hiddenFresh||[], restHiddenNotFresh:extra,
    episodes:r.total.episodes, windowsSum:r.windowsSum||null}; };
const out={audit:{md5:A.md5}, now:{md5:N.md5}, runs:{}};
Object.keys(N.runs).forEach(k=>{ const a=sum(A.runs[k]), n=sum(N.runs[k]); out.runs[k]={audit:a,now:n};
  console.log("== "+k);
  console.log("  drawn while in view  "+pct(a&&a.share)+" -> "+pct(n.share)+";  longest hidden by the layout "+(a?a.longestMs:"-")+" ms / "+(a?a.longestClockMin+" min ("+a.longestWho+")":"-")+
    " -> "+n.longestMs+" ms / "+n.longestClockMin+" min ("+n.longestWho+")");
  console.log("  formations under half drawn (in view 60 frames or more): "+(a?a.under50.length:"-")+" -> "+n.under50.length+(n.under50.length?": "+n.under50.join(", "):""));
  if(a&&a.never60.length||n.never60.length) console.log("  never drawn: "+(a?a.never60.join(", ")||"none":"-")+" -> "+(n.never60.join(", ")||"none"));
  console.log("  the event-named while their event is live "+pct(a&&a.evShare)+" -> "+pct(n.evShare)+";  worst now: "+n.evWorst.join("; "));
  console.log("  at rest after Play, hidden but drawn by a fresh view: "+(a?a.restHiddenNotFresh.join(", ")||"none":"-")+" -> "+(n.restHiddenNotFresh.join(", ")||"none"));
  console.log("  episodes hidden "+(a?a.episodes:"-")+" -> "+n.episodes+(n.windowsSum?";  90-frame windows: share min "+pct(n.windowsSum.shareMin)+", over 3,000 ms "+n.windowsSum.over3000+" of "+n.windowsSum.n+" (audit "+(a&&a.windowsSum?a.windowsSum.over3000+" of "+a.windowsSum.n:"-")+")":"")); });
out.benchmark={audit:A.benchmark, now:N.benchmark};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
