#!/usr/bin/env node
/* v-repro-vis: the analysis of vis-probe.js's raw runs (and, for comparison, the visibility area's raw runs, frame by frame).
   node vis-analyse.js <raw-run.json> [--area <area raw-run.json>] [--json <out.json>]
   Shares: play frames only, drawn (#) over in view (# r x). Longest hidden: consecutive play frames in view and not drawn (r or x); a frame
   off the canvas, under a panel, behind the ground or out of the layer ends the stretch (the area's "hidden by the layout" is the same
   condition read from the layer's state). ms on the driver's clock (33.333 ms a frame); clock minutes the battle's. */
"use strict";
const fs=require("fs");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const R=JSON.parse(fs.readFileSync(argv[0],"utf8"));
const FMS=1000/30, fmt=t=>{ const h=Math.floor(t/60), m=t-60*h; return String(h).padStart(2,"0")+":"+m.toFixed(1).padStart(4,"0"); };
const play=R.frames.map((f,i)=>f.ph==="play"?i:-1).filter(i=>i>=0);
function stats(codes){
  let inV=0, dr=0, best={n:0}, cur=null;
  play.forEach(i=>{ const c=codes[i];
    if(c==="#"||c==="r"||c==="x"){ inV++; if(c==="#") dr++; }
    if(c==="r"||c==="x"){ if(!cur) cur={a:i,n:0}; cur.n++; cur.b=i; if(cur.n>best.n) best=Object.assign({},cur); } else cur=null; });
  return {inView:inV, drawn:dr, share:inV?+(100*dr/inV).toFixed(1):null, longestFrames:best.n, longestMs:Math.round(best.n*FMS),
    from:best.n?fmt(R.frames[best.a].t):null, to:best.n?fmt(R.frames[best.b].t):null, clockMin:best.n?+(R.frames[best.b].t-R.frames[best.a].t).toFixed(1):0};
}
const out={run:R.run, md5:R.md5, chromium:R.chromium, frames:R.frames.length, playFrames:play.length, clock:[fmt(R.frames[play[0]].t),fmt(R.frames[play[play.length-1]].t)],
  projDisagree:R.projDisagree, errors:R.errors, forms:{}, total:null, events:{}};
let TI=0, TD=0;
Object.keys(R.forms).forEach(id=>{ const s=stats(R.forms[id].codes); out.forms[id]=Object.assign({name:R.forms[id].name},s); TI+=s.inView; TD+=s.drawn;
  const cnt={}; play.forEach(i=>{ const c=R.forms[id].codes[i]; cnt[c]=(cnt[c]||0)+1; }); out.forms[id].codeCounts=cnt; });
out.total={inView:TI, drawn:TD, share:+(100*TD/TI).toFixed(1)};
/* the formations a live event names, over the play frames its label is drawn */
let EI=0, ED=0;
Object.keys(R.events).forEach(eid=>{ const e=R.events[eid], fr=play.filter(i=>e.codes[i]==="#"); if(!fr.length) return;
  const o={title:e.title, labelFrames:fr.length, labelClock:[fmt(R.frames[fr[0]].t),fmt(R.frames[fr[fr.length-1]].t)], forms:{}};
  e.forms.forEach(fid=>{ const f=R.forms[fid]; if(!f) { o.forms[fid]="not in the layer"; return; }
    let inV=0, dr=0, best=0, cur=0; fr.forEach(i=>{ const c=f.codes[i]; if(c==="#"||c==="r"||c==="x"){ inV++; if(c==="#"){ dr++; cur=0; } else { cur++; best=Math.max(best,cur); } } else cur=0; });
    EI+=inV; ED+=dr; o.forms[fid]={inView:inV, drawn:dr, share:inV?+(100*dr/inV).toFixed(1):null, longestHiddenS:+(best*FMS/1000).toFixed(1)}; });
  out.events[eid]=o; });
out.eventsTotal={inView:EI, drawn:ED, share:EI?+(100*ED/EI).toFixed(1):null};
/* frame-by-frame against the area's raw run (its codes: # drawn, h/H held, d/D dropped, t behind the ground, o off screen, p under a panel, . not in the layer) */
const AR=opt("--area");
if(AR){ const Q=JSON.parse(fs.readFileSync(AR,"utf8")); const map=c=>c==="#"?"#":(c==="h"||c==="H"||c==="d"||c==="D")?"x":c;
  const n=Math.min(play.length+1, Q.frames.filter(f=>f.ph==="pre"||f.ph==="play").length);
  let cells=0, same=0, sameDrawn=0, clockSame=0; const diff={};
  for(let i=0;i<n;i++){ if(Math.abs(Q.frames[i].t-R.frames[i].t)<1e-6) clockSame++; }
  Object.keys(R.forms).forEach(id=>{ const q=Q.items["c:"+id]||Q.items["n:"+id]; if(!q) return; const mine=R.forms[id].codes;
    /* the area's formation record merges c: and n: (the counter where collected, else the name) */
    const qc=Q.items["c:"+id], qn=Q.items["n:"+id];
    for(let i=0;i<n;i++){ let a=qc?qc.codes[i]:".";
      if(a==="."&&qn) a=qn.codes[i];
      const A2=map(a), M=mine[i]==="r"?"x":mine[i]; cells++; if(A2===M) same++; else { const k=A2+">"+M; diff[k]=(diff[k]||0)+1; }
      if((A2==="#")===(M==="#")) sameDrawn++; } });
  /* and the layer's own state as this run recorded it (A codes) against the area's, cell by cell: the same layout path or not */
  let acells=0, asame=0; const adiff={}, mapA=c=>c==="H"?"h":c==="D"?"d":c;
  Object.keys(R.forms).forEach(id=>{ const qc=Q.items["c:"+id], qn=Q.items["n:"+id]; if(!qc&&!qn) return; const ap=R.forms[id].app;
    for(let i=0;i<n;i++){ let a=qc?qc.codes[i]:"."; if(a==="."&&qn) a=qn.codes[i]; a=mapA(a); const m=ap[i]; acells++; if(a===m) asame++; else { const k=a+">"+m; adiff[k]=(adiff[k]||0)+1; } } });
  out.vsArea={file:AR, framesCompared:n, clockIdentical:clockSame, domCells:cells, domIdentical:same, domDrawnAgree:sameDrawn, domDifferences:diff,
    stateCells:acells, stateIdentical:asame, stateDifferences:adiff}; }
const J=opt("--json"); if(J) fs.writeFileSync(J,JSON.stringify(out,null,1));
console.log(R.run, "frames", out.frames, "play", out.playFrames, out.clock.join("-"), "total", out.total.share+"% of", out.total.inView, "projection disagreements", (R.projDisagree||[]).join("/"), "errors", (R.errors||[]).length);
const ids=Object.keys(out.forms).sort((a,b)=>out.forms[a].share-out.forms[b].share);
ids.slice(0,12).forEach(id=>{ const f=out.forms[id]; console.log("  "+id.padEnd(12)+String(f.share).padStart(5)+"%  in view "+String(f.inView).padStart(5)+"  longest "+String(f.longestMs).padStart(6)+" ms = "+f.clockMin+" min ("+f.from+"-"+f.to+")  "+JSON.stringify(f.codeCounts)); });
console.log("  events' named formations:", out.eventsTotal.share+"% of", out.eventsTotal.inView);
Object.keys(out.events).forEach(eid=>{ const e=out.events[eid]; console.log("   "+eid.padEnd(18)+e.labelFrames+" frames "+e.labelClock.join("-")+"  "+Object.keys(e.forms).map(f=>f+" "+(typeof e.forms[f]==="string"?e.forms[f]:e.forms[f].share+"% (max "+e.forms[f].longestHiddenS+" s)")).join("; ")); });
if(out.vsArea) console.log("  vs area:", JSON.stringify(out.vsArea));
