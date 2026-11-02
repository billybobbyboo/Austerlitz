#!/usr/bin/env node
/* Final audit after Stage 8, area "visibility": the README's compact tables, printed as markdown from tables.json (analyse.js), so that no number
   in the README is copied by hand. node tools/audit-post8/visibility/readme-tables.js [--json <tables.json>] > <file.md>
   Also writes items.json beside tables.json: per run, per formation and per other item (events, places, objectives, overlays, the plateau's
   reading), the play-frame counts the brief asks for (frames in view, drawn, share, longest hidden by the layout in ms and clock minutes, its
   start, episodes, drawn at rest before and after, a fresh view's state). Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(__dirname,"..","..","..");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const JF=path.resolve(opt("--json")||path.join(ROOT,"docs","audit-post8-evidence","visibility","tables.json"));
const T=JSON.parse(fs.readFileSync(JF,"utf8"));
const hhmm=t=>t==null?"-":String(Math.floor(t/60)).padStart(2,"0")+":"+String(Math.floor(t%60)).padStart(2,"0");
const pct=x=>x==null?"-":(100*x).toFixed(1)+"%";
const R=T.runs, out=[];
const st=c=>c==="#"?"drawn":c==="h"||c==="H"?"held":c==="d"||c==="D"?"dropped":c==="t"?"behind ground":c==="o"?"off screen":c==="p"?"under panel":c==="."?"not in layer":c||"-";
/* items.json: the per-item record */
const items={build:T.build, md5:T.md5, chromium:T.chromium, note:"play frames only; ms on the driver's clock (frameMs per run); clock minutes the battle's; before = the first frame at rest after the seek, after = the last of 30 frames at rest after Play, fresh = a fresh view (mlReset) at the same clock and eye", runs:{}};
Object.values(R).forEach(r=>{
  items.runs[r.run]={view:r.view, viewport:r.viewport, presentation:r.presentation, mode:r.mode, reading:r.reading, follow:r.follow, select:r.select, speed:r.speed, frameMs:r.frameMs,
    clock:[r.clockFrom,r.clockTo], playFrames:r.playFrames,
    formations:r.formations.filter(f=>f.play.inView>0).map(f=>({id:f.id, name:f.name, ech:f.ech, arm:f.arm, nation:f.nation, inView:f.play.inView, drawn:f.play.drawn, share:f.play.share,
      longestHiddenMs:f.play.longestMs, longestHiddenClockMin:f.play.longestClockMin, longestFrom:hhmm(f.play.longestFrom), episodes:f.play.episodes, hiddenWithRoom:f.play.hiddenWithRoom,
      freshLayoutShare:f.play.staticShare, restBefore:st(f.before), restAfter:st(f.after), freshView:st(f.fresh)})),
    other:r.other.filter(o=>o.play.inView>0).map(o=>({key:o.key, cat:o.cat, name:o.name, inView:o.play.inView, drawn:o.play.drawn, share:o.play.share, longestHiddenMs:o.play.longestMs,
      longestHiddenClockMin:o.play.longestClockMin, episodes:o.play.episodes, freshLayoutShare:o.play.staticShare, restBefore:st(o.before), restAfter:st(o.after)})),
    events:r.evForms};
});
fs.writeFileSync(path.join(path.dirname(JF),"items.json"),JSON.stringify(items,null,1));
/* (A) the runs */
const MAIN=["bench-hybrid","bench-land","bench-paper","hybrid-0830","hybrid-0830-60","hybrid-1200","hybrid-4x-day","hybrid-fixed-0830","hybrid-watch-0830","hybrid-fr-0900","hybrid-al-0900","hybrid-sel-0900",
  "land-0900","land-4x-day","land-watch-0900","paper-0900","phone-0900","phone-land-0900","hybrid-0900-1h","hybrid-0900-157","hybrid-0900-slow"].filter(k=>R[k]);
out.push("### A. The runs (play frames)","","| run | presentation / mode, viewport | reading, Follow, speed | clock | formation-frames drawn / in view | a fresh layout's share | formations under 50% | longest hidden by the layout | named formations drawn during their live events | hidden at rest after Play (of them drawn by a fresh view) |","|---|---|---|---|---|---|---|---|---|---|");
MAIN.forEach(k=>{ const r=R[k], c=r.checks, F=r.formations.filter(f=>f.play.inView>=0.1*r.playFrames);
  const lo=F.filter(f=>f.play.share<0.5).sort((a,b)=>a.play.share-b.play.share).map(f=>f.id+" "+pct(f.play.share));
  const w=r.formations.slice().sort((a,b)=>b.play.longestFrames-a.play.longestFrames)[0];
  out.push("| "+k+" | "+r.presentation+" / "+r.mode+", "+r.viewport.join("x")+" | "+r.reading+(r.select?", selected "+r.select:"")+", "+(r.follow?"on":"off")+", "+r.speed+"x"+(Math.abs(r.frameMs-33.333)>0.01?" ("+r.frameMs+" ms frames)":"")+" | "+hhmm(r.clockFrom)+"-"+hhmm(r.clockTo)+
    " | "+r.playTotal.drawn+" / "+r.playTotal.inView+" ("+pct(r.playTotal.share)+") | "+pct(c.formations.staticShare)+" | "+(lo.join(", ")||"none")+" | "+(w&&w.play.longestMs?w.id+" "+w.play.longestMs.toLocaleString("en-GB")+" ms = "+w.play.longestClockMin+" min from "+hhmm(w.play.longestFrom):"0")+
    " | "+r.evTot.drawn+" / "+r.evTot.inView+" ("+pct(r.evTot.share)+") | "+r.restSum.hiddenAfter.length+(r.restSum.persistOnly.length?" ("+r.restSum.persistOnly.join(", ")+")":" (0)")+" |"); });
/* (B) per formation across the main long runs */
const LONG=["hybrid-0830","hybrid-1200","hybrid-4x-day","land-0900","land-4x-day","paper-0900","phone-0900","phone-land-0900"].filter(k=>R[k]);
const ids=[...new Set([].concat(...LONG.map(k=>R[k].formations.filter(f=>f.play.inView>0).map(f=>f.id))))];
const worst=id=>Math.min(...LONG.map(k=>{ const f=R[k].formations.find(x=>x.id===id); return f&&f.play.inView>=0.1*R[k].playFrames?f.play.share:1; }));
out.push("","### B. Each formation in the long runs: share drawn while in view / longest hidden by the layout (ms on the driver's clock = clock minutes)","",
  "| formation | "+LONG.join(" | ")+" |","|---|"+LONG.map(()=>"---").join("|")+"|");
ids.sort((a,b)=>worst(a)-worst(b)).forEach(id=>{ const nm=(R[LONG[0]].formations.find(f=>f.id===id)||R[LONG.find(k=>R[k].formations.find(f=>f.id===id))].formations.find(f=>f.id===id)).name;
  out.push("| "+id+" ("+nm+") | "+LONG.map(k=>{ const f=R[k].formations.find(x=>x.id===id); return f&&f.play.inView?pct(f.play.share)+" / "+f.play.longestMs.toLocaleString("en-GB")+" = "+f.play.longestClockMin:"-"; }).join(" | ")+" |"); });
/* (C) the formations live events name, while the event is drawn */
out.push("","### C. Formations named by a live event, while the event's label is drawn (share drawn while in view; the longest hidden stretch inside the event's frames)","",
  "| event (EVENTS[].forms) | hybrid-0830 | hybrid-1200 | hybrid-4x-day | land-0900 | land-4x-day |","|---|---|---|---|---|---|");
const EVK=["hybrid-0830","hybrid-1200","hybrid-4x-day","land-0900","land-4x-day"];
const evIds=[...new Set([].concat(...EVK.map(k=>R[k]?R[k].evForms.map(e=>e.id):[])))];
evIds.forEach(id=>{ const cells=EVK.map(k=>{ const e=R[k]&&R[k].evForms.find(x=>x.id===id); if(!e) return "-";
    return e.forms.filter(f=>f.inView).map(f=>f.id+" "+pct(f.share)+(f.longestHiddenMs>=1000?" (max "+(f.longestHiddenMs/1000).toFixed(1)+" s)":"")).join("; ")||"-"; });
  if(cells.some(c=>c!=="-")) out.push("| "+id+" | "+cells.join(" | ")+" |"); });
/* (D) the benchmark against longer playback */
out.push("","### D. The 90-frame benchmark against the long runs' own 90-frame windows (each window judged as the benchmark judges its run)","",
  "| run | windows | share drawn: min / median / max | windows with a formation hidden for the whole window |","|---|---|---|---|");
Object.values(R).filter(r=>r.windowsSum).forEach(r=>{ const w=r.windowsSum; out.push("| "+r.run+" | "+w.n+" | "+pct(w.shareMin)+" / "+pct(w.shareMedian)+" / "+pct(w.shareMax)+" | "+w.wholeWindowHidden+" |"); });
["bench-hybrid","bench-land","bench-paper"].forEach(k=>{ const r=R[k]; if(r) out.push("| "+k+" (the benchmark itself, 121 frames: 1 at rest, 90 playing, 30 at rest) | 1 | "+pct(r.playTotal.share)+" (play), "+pct(r.total.share)+" (all 121) | longest "+r.total.longestMs.toLocaleString("en-GB")+" ms |"); });
/* (E) real time against the driver */
out.push("","### E. Real time against the driver (Landscape with counters, 1/2x, Follow on; each comparison over the clock range both records cover)","","| comparison | clock | real: frames, interval p10/median/p90, passes | driver: frames, passes | formation-frames drawn: real | driver | longest hidden (frames) real / driver | frames paired by clock / identical in every formation |","|---|---|---|---|---|---|---|---|");
Object.keys(T.realtime||{}).forEach(k=>{ const C=T.realtime[k]; out.push("| "+k+" ("+C.against+") | "+hhmm(C.clockRange[0])+"-"+hhmm(C.clockRange[1])+" | "+C.realFrames+", "+(C.realIntervalMs&&C.realIntervalMs.median?C.realIntervalMs.p10+"/"+C.realIntervalMs.median+"/"+C.realIntervalMs.p90+" ms":"-")+", "+C.realPasses+" | "+C.driverFrames+", "+C.driverPasses+" | "+C.real.drawn+"/"+C.real.inView+" ("+pct(C.real.share)+") | "+C.driver.drawn+"/"+C.driver.inView+" ("+pct(C.driver.share)+") | "+C.real.longestFrames+" / "+C.driver.longestFrames+" | "+C.pairedFrames+" / "+C.pairedIdentical+" |"); });
/* (F) the other items */
out.push("","### F. Events, the army and corps counters, objectives and places (play frames)","","| run | protected items hidden (frames) | events | army + corps counters | objectives (fresh layout) | places (fresh layout) |","|---|---|---|---|---|---|");
MAIN.forEach(k=>{ const c=R[k].checks, e=x=>x&&x.inView?x.drawn+"/"+x.inView+" ("+pct(x.share)+")":"-";
  out.push("| "+k+" | "+c.keepHiddenFrames+" | "+e(c.events)+" | "+e(c.corpsArmy)+" | "+pct(c.objectives.share)+" ("+pct(c.objectives.staticShare)+") | "+pct(c.places.share)+" ("+pct(c.places.staticShare)+") |"); });
process.stdout.write(out.join("\n")+"\n");
