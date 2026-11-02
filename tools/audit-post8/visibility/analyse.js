#!/usr/bin/env node
/* Final audit after Stage 8, area "visibility": the tables and the summary from long-play.js's and realtime.js's records.
   node tools/audit-post8/visibility/analyse.js [--dir <runs dir>] [--out <evidence dir>]
   Writes <out>/tables.json (every run: per formation and per other item, the priority checks, the time strips; the benchmark comparison; the
   real-time comparison) and <out>/tables.md (readable). Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const V=require("./vis-lib.js");
const ROOT=path.resolve(__dirname,"..","..","..");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUTD=path.resolve(opt("--out")||path.join(ROOT,"docs","audit-post8-evidence","visibility")), DIR=path.resolve(opt("--dir")||path.join(OUTD,"runs"));
const ORDER=["bench-hybrid","bench-land","bench-paper","hybrid-0830","hybrid-0830-60","hybrid-1200","hybrid-4x-day","land-0900","land-4x-day","paper-0900","phone-0900","phone-land-0900","hybrid-fr-0900","hybrid-al-0900",
  "hybrid-fixed-0830","hybrid-watch-0830","land-watch-0900","hybrid-sel-0900","hybrid-hover-0900","hybrid-0900-1h","hybrid-0900-157","hybrid-0900-slow"];
/* the events and the formations each names (analysis.js EVENTS[].forms), read in node from the sources as the page loads them */
const EVENTS=(()=>{ const vm=require("vm"), ctx={console}; vm.createContext(ctx); ["data.js","analysis.js"].forEach(f=>vm.runInContext(fs.readFileSync(path.join(ROOT,f),"utf8"),ctx,{filename:f})); return vm.runInContext("EVENTS",ctx).map(e=>({id:e.id, t:e.t, n:e.n, forms:(e.forms||[]).slice()})); })();
const hhmm=t=>t==null?"-":String(Math.floor(t/60)).padStart(2,"0")+":"+String(Math.floor(t%60)).padStart(2,"0");
const pct=x=>x==null?"-":(100*x).toFixed(1)+"%";
const HID=new Set(["h","H","d","D"]);
function load(k){ const f=path.join(DIR,"raw-"+k+".json"); return fs.existsSync(f)?JSON.parse(fs.readFileSync(f,"utf8")):null; }
/* one char per bin of clock minutes over the play frames: '#' drawn in >= 90% of its frames in view, '+' >= 50%, '-' > 0, 'x' in view and never
   drawn, 't' only behind the ground, '.' never in view (off the screen, under a panel or out of the layer) */
function strip(codes,F,range,bin){
  const out=[], t0=F[range[0]].t, t1=F[range[1]].t, nb=Math.max(1,Math.ceil((t1-t0)/bin+1e-9));
  const B=Array.from({length:nb},()=>({on:0,inv:0,occ:0}));
  for(let i=range[0];i<=range[1];i++){ const b=Math.min(nb-1,Math.floor((F[i].t-t0)/bin)), c=codes[i]; if(c==="#"){ B[b].on++; B[b].inv++; } else if(HID.has(c)) B[b].inv++; else if(c==="t") B[b].occ++; }
  B.forEach(x=>out.push(x.inv===0?(x.occ?"t":"."):x.on===0?"x":x.on/x.inv>=0.9?"#":x.on/x.inv>=0.5?"+":"-"));
  return out.join("");
}
function analyseRun(k,raw){
  const fm=raw.opts.frameMs, S=V.summarise({frames:raw.frames,items:raw.items,meta:raw.meta},fm), F=raw.frames;
  const p0=F.findIndex(f=>f.ph==="play"), p1=F.map(f=>f.ph).lastIndexOf("play");
  const fcodes={}; Object.keys(raw.items).forEach(key=>{ const x=raw.items[key]; if(x.fid&&!fcodes[x.fid]) fcodes[x.fid]=V.formationCodes(raw.items,x.fid,F.length); });
  S.formations.forEach(f=>{ f.strip5=strip(fcodes[f.id].codes,F,[p0,p1],raw.opts.speed>=4?15:5); delete f.codes; });
  /* the priority checks over the play frames */
  const keepHid=Object.values(raw.items).reduce((s,x)=>s+x.keepHid,0);
  const ev=S.other.filter(o=>o.cat==="event"), pl=S.other.filter(o=>o.cat==="place"), ob=S.other.filter(o=>o.cat==="objective"), ov=S.other.filter(o=>o.cat==="overlay");
  const grp=(L,f)=>{ const inV=L.reduce((s,o)=>s+f(o).inView,0), dr=L.reduce((s,o)=>s+f(o).drawn,0); return {n:L.length, inView:inV, drawn:dr, share:inV?+(dr/inV).toFixed(3):null,
    longestMs:L.reduce((m,o)=>Math.max(m,f(o).longestMs),0), longestClockMin:L.reduce((m,o)=>Math.max(m,f(o).longestClockMin),0), never:L.filter(o=>f(o).inView>0&&f(o).drawn===0).length,
    staticShare:(()=>{ const e=L.reduce((s,o)=>s+f(o).staticEligible,0), sOn=L.reduce((s,o)=>s+Math.round((f(o).staticShare||0)*f(o).staticEligible),0); return e?+(sOn/e).toFixed(3):null; })(),
    starvedVsStatic:L.reduce((s,o)=>s+f(o).starvedVsStatic,0), drawnWhereStaticNot:L.reduce((s,o)=>s+f(o).drawnWhereStaticNot,0)}; };
  const byEch={}; ["army","corps","div","bde"].forEach(e=>{ const L=S.formations.filter(f=>f.ech===e); if(L.length) byEch[e]=grp(L,f=>f.play); });
  const byArm={}; [...new Set(S.formations.map(f=>f.arm))].forEach(a=>{ byArm[a]=grp(S.formations.filter(f=>f.arm===a),f=>f.play); });
  const corpsArmy=S.formations.filter(f=>f.ech==="army"||f.ech==="corps");
  const checks={keepHiddenFrames:keepHid, events:grp(ev,o=>o.play), places:grp(pl,o=>o.play), objectives:grp(ob,o=>o.play), overlays:grp(ov,o=>o.play),
    formations:grp(S.formations,f=>f.play), corpsArmy:grp(corpsArmy,f=>f.play), corpsArmyNotAlways:corpsArmy.filter(f=>f.play.inView&&f.play.drawn<f.play.inView).map(f=>({id:f.id, share:f.play.share, longestMs:f.play.longestMs, longestClockMin:f.play.longestClockMin})),
    byEch, byArm};
  /* the starved: in view in at least 10% of the play frames, and drawn in under half of them or hidden by the layout for 5 s of playback or more at a stretch */
  const starved=S.formations.filter(f=>f.play.inView>=0.1*S.playFrames&&(f.play.share<0.5||f.play.longestMs>=5000)).sort((a,b)=>a.play.share-b.play.share)
    .map(f=>({id:f.id, name:f.name, ech:f.ech, arm:f.arm, nation:f.nation, base:f.base, share:f.play.share, inView:f.play.inView, longestMs:f.play.longestMs, longestClockMin:f.play.longestClockMin,
      longestFrom:hhmm(f.play.longestFrom), episodes:f.play.episodes, staticShare:f.play.staticShare, staticLongestMs:f.play.staticLongestMs, starvedVsStatic:f.play.starvedVsStatic, roomShare:f.play.hiddenLayout?+(f.play.hiddenWithRoom/f.play.hiddenLayout).toFixed(3):null, before:f.before, after:f.after, fresh:f.fresh, strip:f.strip5}));
  /* the formations a live event names (EVENTS[].forms), over the play frames its label is drawn (live events are never dropped: decision 39):
     per event and named formation, the frames in view, drawn, hidden by the layout, the longest hidden stretch inside the event's frames */
  const evForms=EVENTS.filter(e=>e.forms.length&&raw.items["e:"+e.id]).map(e=>{ const ec=raw.items["e:"+e.id].codes, idx=[]; for(let i=p0;i<=p1;i++) if(ec[i]==="#") idx.push(i);
    if(!idx.length) return null;
    const rows=e.forms.map(fid=>{ const fc=fcodes[fid]; if(!fc) return {id:fid, absentFromLayer:true};
      let inV=0, dr=0, hid=0, occ=0, off=0, abs=0, run=0, best=0, bestFrom=null, s0=null, prev=-2, sEl=0, sOn=0;
      idx.forEach(i=>{ const c=fc.codes[i]; if(i!==prev+1) run=0; prev=i; const sc=fc.stat[i]; if(sc==="#"||sc==="-"){ sEl++; if(sc==="#") sOn++; }
        if(c==="#"){ inV++; dr++; run=0; } else if(HID.has(c)){ inV++; hid++; if(!run) s0=i; run++; if(run>best){ best=run; bestFrom=F[s0].t; } } else { run=0; if(c==="t"){ inV++; occ++; } else if(c===".") abs++; else off++; } });
      return {id:fid, inView:inV, drawn:dr, hidden:hid, occluded:occ, offscreen:off, absent:abs, share:inV?+(dr/inV).toFixed(3):null, freshLayoutShare:sEl?+(sOn/sEl).toFixed(3):null, longestHiddenFrames:best, longestHiddenMs:Math.round(best*fm), longestFrom:bestFrom}; });
    return {id:e.id, n:e.n, t:e.t, liveFrames:idx.length, clockFrom:F[idx[0]].t, clockTo:F[idx[idx.length-1]].t, forms:rows}; }).filter(Boolean);
  const evTot=(()=>{ let v=0, d=0; evForms.forEach(e=>e.forms.forEach(r=>{ if(r.inView){ v+=r.inView; d+=r.drawn; } })); return {inView:v, drawn:d, share:v?+(d/v).toFixed(3):null}; })();
  const evWorst=[].concat(...evForms.map(e=>e.forms.filter(r=>r.inView>=10&&r.share<0.5).map(r=>({event:e.id, id:r.id, share:r.share, inView:r.inView, longestHiddenMs:r.longestHiddenMs, longestFrom:hhmm(r.longestFrom)})))).sort((a,b)=>a.share-b.share);
  /* the priority against the layout in motion, frame by frame: frames in which a formation is hidden that the fresh layout would draw while a place
     name (the lowest priority but the terrain-study names) is drawn that the fresh layout would not; co-occurrence only, not the same boxes */
  const tKeys=Object.keys(raw.items).filter(x=>x.startsWith("t:")), fKeys=Object.keys(fcodes);
  let invFrames=0, starvedFrames=0; for(let i=p0;i<=p1;i++){ const st=fKeys.some(fid=>{ const fc=fcodes[fid]; return HID.has(fc.codes[i])&&fc.stat[i]==="#"; }); if(!st) continue; starvedFrames++;
    if(tKeys.some(x=>raw.items[x].codes[i]==="#"&&raw.items[x].stat[i]==="-")) invFrames++; }
  const inversion={framesWithAStarvedFormation:starvedFrames, ofThemWithAnExtraPlace:invFrames, playFrames:p1-p0+1};
  /* of the formation-frames hidden by the layout, those in which the full search would have placed the formation in that frame's own room (tried
     against the frame's final boxes, panels and symbols, and undone): the stabiliser's delay, not crowding */
  const hidRoom=(()=>{ const h=S.formations.reduce((a,f)=>a+f.play.hiddenLayout,0), r=S.formations.reduce((a,f)=>a+f.play.hiddenWithRoom,0); return {hidden:h, withRoom:r, share:h?+(r/h).toFixed(3):null}; })();
  /* at rest: the formations hidden by the layout before Play (a seek's fresh layout), after it (the layout at rest after motion, "persist", at the
     last of the rest frames) and in a fresh view at the same clock and eye (mlReset, one frame); persistOnly: hidden at rest after Play but drawn
     by the fresh view (the kept places' cost), freshOnly: drawn at rest after Play but hidden by the fresh view */
  const hidAt=f=>x=>x&&"hHdD".includes(x);
  const restSum={hiddenBefore:S.formations.filter(f=>hidAt()(f.before)).map(f=>f.id), hiddenAfter:S.formations.filter(f=>hidAt()(f.after)).map(f=>f.id),
    hiddenFresh:S.formations.filter(f=>hidAt()(f.fresh)).map(f=>f.id)};
  restSum.persistOnly=restSum.hiddenAfter.filter(id=>{ const f=S.formations.find(x=>x.id===id); return f.fresh==="#"; });
  restSum.freshOnly=S.formations.filter(f=>f.after==="#"&&hidAt()(f.fresh)).map(f=>f.id);
  /* the 90-frame windows of this run's play, each judged as the benchmark judges its run */
  const W90=S.playFrames>=180?windows(raw,90):null;
  const windowsSum=W90?{n:W90.length, shareMin:Math.min(...W90.map(w=>w.share)), shareMedian:W90.map(w=>w.share).sort((a,b)=>a-b)[Math.floor(W90.length/2)], shareMax:Math.max(...W90.map(w=>w.share)),
    wholeWindowHidden:W90.filter(w=>w.longestMs>=Math.round(90*fm)-1).length, over3000:W90.filter(w=>w.longestMs>=3000).length}:null;
  /* the frames re-placement passes ran in, and the frames counted moving */
  return {run:k, view:raw.spec.name, viewport:raw.viewport, presentation:raw.presentation, mode:raw.mode, reading:raw.opts.reading||"none", follow:raw.opts.follow!==false, select:raw.opts.select||null,
    speed:raw.opts.speed, frameMs:+fm.toFixed(3), clockFrom:S.clockFrom, clockTo:S.clockTo, frames:S.frames, playFrames:S.playFrames, passes:S.passes, dwellFrames:S.dwellFrames, wallMs:raw.wallMs, quirk:raw.quirk,
    total:Object.assign({},S.total,{share:S.total.inView?+(S.total.drawn/S.total.inView).toFixed(3):null}),
    playTotal:(()=>{ const d=S.formations.reduce((s,f)=>s+f.play.drawn,0), v=S.formations.reduce((s,f)=>s+f.play.inView,0); return {drawn:d, inView:v, share:v?+(d/v).toFixed(3):null}; })(),
    checks, starved, evForms, evTot, evWorst, inversion, hidRoom, restSum, windows90:W90, windowsSum, formations:S.formations, other:S.other};
}
/* the benchmark against longer playback: the 90-frame windows of the long hybrid run from 08:30, each judged as the benchmark judges its run
   (drawn formation-frames of those in view; the longest disappearance inside the window, capped at the window) */
function windows(raw,w){
  const F=raw.frames, p0=F.findIndex(f=>f.ph==="play"), p1=F.map(f=>f.ph).lastIndexOf("play"), fids=[...new Set(Object.values(raw.items).filter(x=>x.fid).map(x=>x.fid))];
  const C=fids.map(fid=>V.formationCodes(raw.items,fid,F.length).codes), out=[];
  for(let s=p0;s+w-1<=p1;s+=w){ let on=0, inv=0, longest=0, who=null; C.forEach((c,i)=>{ const st=V.itemStats(c,"",F,raw.opts.frameMs,[s,s+w-1]); on+=st.drawn; inv+=st.inView; if(st.longestFrames>longest){ longest=st.longestFrames; who=fids[i]; } });
    out.push({from:F[s].t, to:F[s+w-1].t, share:inv?+(on/inv).toFixed(3):null, longestMs:Math.round(longest*raw.opts.frameMs), who}); }
  return out;
}
/* two records of the same formations compared: per formation the share drawn and the longest disappearance over the play frames in a clock range */
function compareRT(rt,dr,clockRange){
  /* the clock range both records cover while playing (the real-time run with the draw reached only 09:17 on this loaded machine) */
  { const pr=rt.frames.filter(f=>f.play), pd=dr.frames.filter(f=>f.ph==="play");
    if(pr.length&&pd.length) clockRange=[Math.max(clockRange[0],pr[0].t,pd[0].t),Math.min(clockRange[1],pr[pr.length-1].t,pd[pd.length-1].t)]; }
  const sel=(F,ph)=>F.map((f,i)=>i).filter(i=>(ph?F[i].play:F[i].ph==="play")&&F[i].t>=clockRange[0]-1e-6&&F[i].t<=clockRange[1]+1e-6);
  const Ir=sel(rt.frames,true), Id=sel(dr.frames,false);
  const st=(codes,idx,fm,F)=>{ let on=0, inv=0, run=0, best=0, bestMin=0, s0=null, eps=0; idx.forEach(i=>{ const c=codes[i]; if(c==="#"||c==="t"){ if(c==="#") on++; inv++; run=0; } else if(HID.has(c)){ inv++; if(!run){ eps++; s0=i; } run++; if(run>best){ best=run; bestMin=F[i].t-F[Math.max(0,s0-1)].t; } } else run=0; });
    return {inView:inv, drawn:on, share:inv?+(on/inv).toFixed(3):null, longestFrames:best, longestClockMin:+bestMin.toFixed(2), episodes:eps}; };
  const fids=[...new Set(Object.values(dr.items).filter(x=>x.fid).map(x=>x.fid))];
  const rows=fids.map(fid=>{ const kr=rt.items["c:"+fid]?"c:"+fid:"n:"+fid, kd=dr.items["c:"+fid]?"c:"+fid:"n:"+fid;
    const a=rt.items[kr]?st(rt.items[kr].codes,Ir,null,rt.frames):null, b=dr.items[kd]?st(dr.items[kd].codes,Id,null,dr.frames):null; return {id:fid, real:a, driver:b}; });
  /* frame for frame where the clocks coincide (to 0.01 min) */
  /* the k-th frame at a clock value paired with the other record's k-th at it (a dwell holds the clock at its event's minute for many frames;
     pairing each with the last of them, as the first version did, made 39 false differences at 09:15) */
  let pairs=0, same=0, diffF=0; const dIdx=new Map(), occ=new Map(), occR=new Map();
  Id.forEach(i=>{ const t=dr.frames[i].t.toFixed(2), n=occ.get(t)||0; occ.set(t,n+1); dIdx.set(t+"#"+n,i); });
  Ir.forEach(i=>{ const t=rt.frames[i].t.toFixed(2), n=occR.get(t)||0; occR.set(t,n+1); const j=dIdx.get(t+"#"+n); if(j===undefined) return; pairs++; let all=true;
    fids.forEach(fid=>{ const kr=rt.items["c:"+fid]?"c:"+fid:"n:"+fid, kd=dr.items["c:"+fid]?"c:"+fid:"n:"+fid; const a=rt.items[kr]?rt.items[kr].codes[i]:".", b=dr.items[kd]?dr.items[kd].codes[j]:".";
      const n=x=>HID.has(x)?"x":x; if(n(a)!==n(b)){ all=false; diffF++; } }); if(all) same++; });
  const tot=L=>{ const v=L.reduce((s,r)=>s+(r?r.inView:0),0), d=L.reduce((s,r)=>s+(r?r.drawn:0),0); return {inView:v, drawn:d, share:v?+(d/v).toFixed(3):null, longestFrames:Math.max(0,...L.map(r=>r?r.longestFrames:0))}; };
  const rtF=Ir.map(i=>rt.frames[i]), dts=rtF.slice(1).map((f,i)=>f.rt-rtF[i].rt).sort((a,b)=>a-b);
  return {clockRange, realFrames:Ir.length, driverFrames:Id.length, realPasses:Ir.filter(i=>rt.frames[i].pass).length, driverPasses:Id.filter(i=>dr.frames[i].pass).length,
    realIntervalMs:dts.length?{p10:Math.round(dts[Math.floor(dts.length*0.1)]), median:Math.round(dts[Math.floor(dts.length/2)]), p90:Math.round(dts[Math.floor(dts.length*0.9)])}:null,
    pairedFrames:pairs, pairedIdentical:same, pairedCodeDifferences:diffF, real:tot(rows.map(r=>r.real)), driver:tot(rows.map(r=>r.driver)), rows};
}
(function main(){
  const runs={}, md=[];
  ORDER.forEach(k=>{ const raw=load(k); if(raw) runs[k]=analyseRun(k,raw); });
  const R={generated:new Date().toISOString(), build:null, md5:null, runs:{}, benchmark:null, realtime:{}};
  Object.keys(runs).forEach(k=>{ R.runs[k]=runs[k]; });
  const any=load(Object.keys(runs)[0]); if(any){ R.build=any.build; R.md5=any.md5; R.chromium=any.chromium; }
  /* the benchmark against longer playback */
  const bh=runs["bench-hybrid"], lh=load("hybrid-0830");
  if(bh&&lh){ const W=windows(lh,90); R.benchmark={bench:{share:bh.playTotal.share, shareAll:bh.total.share, longestMs:bh.total.longestMs, longestPlayMs:Math.max(...bh.formations.map(f=>f.play.longestMs)), starved:bh.starved.map(s=>s.id)},
    windows90:W, windowsOver3000:W.filter(w=>w.longestMs>=3000).length, windowsN:W.length, windowShareMin:Math.min(...W.map(w=>w.share)), windowShareMax:Math.max(...W.map(w=>w.share)),
    long:{share:runs["hybrid-0830"].playTotal.share, longestMs:runs["hybrid-0830"].total.longestMs}}; }
  /* real time against the driver */
  const rt=fs.existsSync(path.join(DIR,"realtime.json"))?JSON.parse(fs.readFileSync(path.join(DIR,"realtime.json"),"utf8")):null;
  const rtn=fs.existsSync(path.join(DIR,"realtime-nogl.json"))?JSON.parse(fs.readFileSync(path.join(DIR,"realtime-nogl.json"),"utf8")):null;
  const ds=load("hybrid-0900-slow"), d1=load("hybrid-0900-1h");
  if(rt&&ds) R.realtime.gl=Object.assign({against:"hybrid-0900-slow (driver, frames 1,000 ms apart)"},compareRT(rt,ds,[540,600]));
  if(rtn&&d1) R.realtime.nogl=Object.assign({against:"hybrid-0900-1h (driver, 30 frames a second)"},compareRT(rtn,d1,[540,600]));
  if(rt&&d1) R.realtime.glVs30=Object.assign({against:"hybrid-0900-1h (driver, 30 frames a second)"},compareRT(rt,d1,[540,600]));
  const d157=load("hybrid-0900-157");
  if(rtn&&d157) R.realtime.noglMatched=Object.assign({against:"hybrid-0900-157 (driver, frames 157 ms apart: the no-draw real-time run's median)"},compareRT(rtn,d157,[540,600]));
  if(ds&&d1) R.realtime.driverSlowVs30=Object.assign({against:"hybrid-0900-1h (driver, 30 frames a second); 'real' here is the driver at 1,000 ms frames"},compareRT(Object.assign({},ds,{frames:ds.frames.map(f=>Object.assign({},f,{play:f.ph==="play",rt:0}))}),d1,[540,600]));
  /* ---- the readable tables ---- */
  md.push("# Visibility over long playback: the tables","","Made by `tools/audit-post8/visibility/analyse.js` from `runs/` (`long-play.js`, `realtime.js`). Build "+R.build+" (md5 "+R.md5+"), Chromium "+(R.chromium||"-")+".",
    "Codes per frame: drawn, hidden by the layout (held or dropped; with or without room for the full search), behind the ground, off the screen or under a panel, not in the layer. Times in ms are the driver's clock (30 frames a second unless said); clock minutes are the battle's.","");
  md.push("## Runs","","| run | view | presentation, mode | reading | Follow | speed | clock | play frames | passes | dwell frames | formation-frames drawn / in view (play) | longest hidden by the layout | keep hidden | quirk |","|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
  Object.values(runs).forEach(r=>{ md.push("| "+r.run+" | "+r.view+" "+r.viewport.join("x")+" | "+r.presentation+", "+r.mode+" | "+r.reading+(r.select?", selected "+r.select:"")+" | "+(r.follow?"on":"off")+" | "+r.speed+"x"+(r.frameMs!==33.333?" ("+r.frameMs+" ms frames)":"")+" | "+hhmm(r.clockFrom)+"-"+hhmm(r.clockTo)+" | "+r.playFrames+" | "+r.passes+" | "+r.dwellFrames+" | "+
    r.playTotal.drawn+" / "+r.playTotal.inView+" ("+pct(r.playTotal.share)+") | "+r.total.longestMs+" ms | "+r.checks.keepHiddenFrames+" | "+r.quirk+" |"); });
  md.push("","## Priority checks (play frames)","","| run | protected items hidden (frames) | events drawn / in view | army and corps counters drawn / in view | not always drawn | places | objectives | by echelon (army, corps, div, bde) |","|---|---|---|---|---|---|---|---|");
  Object.values(runs).forEach(r=>{ const c=r.checks, e=x=>x?x.drawn+"/"+x.inView+" ("+pct(x.share)+")":"-";
    md.push("| "+r.run+" | "+c.keepHiddenFrames+" | "+e(c.events)+" | "+e(c.corpsArmy)+" | "+(c.corpsArmyNotAlways.map(x=>x.id+" "+pct(x.share)+", "+x.longestClockMin+" min").join("; ")||"none")+" | "+e(c.places)+" | "+e(c.objectives)+" | "+["army","corps","div","bde"].map(k=>c.byEch[k]?pct(c.byEch[k].share):"-").join(", ")+" |"); });
  md.push("","## Priority against the static layout (play frames)","","A fresh view's layout (`build`) in the same frame, against what the layout in motion drew: 'starved' frames the fresh layout would draw an item the moving layout hides; 'extra' frames the moving layout draws an item the fresh layout would not (a kept place).","",
    "| run | formations: share in motion, fresh | starved, extra | places: share, fresh | starved, extra | objectives: share, fresh | extra | events |","|---|---|---|---|---|---|---|---|");
  Object.values(runs).forEach(r=>{ const c=r.checks; md.push("| "+r.run+" | "+pct(c.formations.share)+", "+pct(c.formations.staticShare)+" | "+c.formations.starvedVsStatic+", "+c.formations.drawnWhereStaticNot+" | "+pct(c.places.share)+", "+pct(c.places.staticShare)+" | "+c.places.starvedVsStatic+", "+c.places.drawnWhereStaticNot+" | "+pct(c.objectives.share)+", "+pct(c.objectives.staticShare)+" | "+c.objectives.drawnWhereStaticNot+" | "+pct(c.events.share)+" |"); });
  Object.values(runs).forEach(r=>{
    md.push("","## "+r.run+": every formation (play frames, "+hhmm(r.clockFrom)+"-"+hhmm(r.clockTo)+")","","Strip: one character per "+(r.speed>=4?15:5)+" clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.","",
      "| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |","|---|---|---|---|---|---|---|---|---|---|---|---|");
    r.formations.slice().sort((a,b)=>(a.play.share==null?2:a.play.share)-(b.play.share==null?2:b.play.share)).forEach(f=>{ const p=f.play;
      md.push("| "+f.id+" ("+(f.name||"")+") | "+f.ech+" "+f.arm+" "+f.nation+" | "+(f.base==null?"-":f.base.toFixed(3))+" | "+p.inView+" | "+p.drawn+" | "+pct(p.share)+" | "+pct(p.staticShare)+", "+p.staticLongestMs+" | "+p.longestMs+"; "+p.longestClockMin+"; "+hhmm(p.longestFrom)+" | "+p.episodes+" | "+(p.hiddenLayout?pct(p.hiddenWithRoom/p.hiddenLayout):"-")+" | "+f.before+" "+f.after+" "+(f.fresh||"")+" | `"+f.strip5+"` |"); });
    const oth=r.other.filter(o=>o.play.inView>0&&o.play.share<1).sort((a,b)=>a.play.share-b.play.share);
    md.push("","Other items not always drawn while in view ("+oth.length+" of "+r.other.filter(o=>o.play.inView>0).length+" in view): "+(oth.slice(0,25).map(o=>"`"+o.key+"` "+o.cat+" "+pct(o.play.share)+" (longest "+o.play.longestClockMin+" min)").join("; ")||"none")+(oth.length>25?"; ...":""));
  });
  /* across the runs: each formation's share drawn while in view and its longest disappearance by the layout (clock minutes; ms) */
  const longRuns=Object.keys(runs).filter(k=>!/^bench-|-slow$|-1h$/.test(k));
  const allF=[...new Set([].concat(...longRuns.map(k=>runs[k].formations.map(f=>f.id))))];
  R.across={runs:longRuns, rows:allF.map(id=>{ const o={id}; longRuns.forEach(k=>{ const f=runs[k].formations.find(x=>x.id===id); o[k]=f&&f.play.inView?{inView:f.play.inView, drawn:f.play.drawn, share:f.play.share, longestMs:f.play.longestMs, longestClockMin:f.play.longestClockMin, longestFrom:f.play.longestFrom, episodes:f.play.episodes,
    staticShare:f.play.staticShare, before:f.before, after:f.after, fresh:f.fresh}:null; }); return o; })};
  const worstOf=row=>Math.min(...longRuns.map(k=>row[k]&&row[k].inView>=50?row[k].share:1));
  md.push("","## Across the runs: each formation (play frames; share drawn while in view / longest hidden by the layout in clock minutes)","","| formation | "+longRuns.join(" | ")+" |","|---|"+longRuns.map(()=>"---").join("|")+"|");
  R.across.rows.slice().sort((a,b)=>worstOf(a)-worstOf(b)).forEach(row=>md.push("| "+row.id+" | "+longRuns.map(k=>row[k]?pct(row[k].share)+" / "+row[k].longestClockMin+" ("+row[k].longestMs+" ms)":"-").join(" | ")+" |"));
  if(R.benchmark){ const B=R.benchmark; md.push("","## The 90-frame benchmark against longer playback","","The benchmark's hybrid Play (09:00, 90 frames at 1/2x): formation-frames drawn "+pct(B.bench.share)+", longest hidden "+B.bench.longestMs+" ms (its starved: "+B.bench.starved.join(", ")+"). The long run from 08:30 cut into "+B.windowsN+" windows of 90 play frames: share drawn "+pct(B.windowShareMin)+" to "+pct(B.windowShareMax)+"; "+B.windowsOver3000+" windows with a formation hidden for the whole window (3,000 ms); over the whole run "+pct(B.long.share)+", longest "+B.long.longestMs+" ms.","",
    "| window (clock) | share drawn | longest hidden in the window | who |","|---|---|---|---|"); B.windows90.forEach(w=>md.push("| "+hhmm(w.from)+"-"+hhmm(w.to)+" | "+pct(w.share)+" | "+w.longestMs+" ms | "+(w.who||"-")+" |")); }
  Object.keys(R.realtime).forEach(k=>{ const C=R.realtime[k]; md.push("","## Real time ("+k+") against "+C.against+", clock "+hhmm(C.clockRange[0])+"-"+hhmm(C.clockRange[1]),"",
    "Real frames "+C.realFrames+" (interval p10/median/p90 "+(C.realIntervalMs?C.realIntervalMs.p10+"/"+C.realIntervalMs.median+"/"+C.realIntervalMs.p90+" ms":"-")+", passes "+C.realPasses+"), driver frames "+C.driverFrames+" (passes "+C.driverPasses+"). Formation-frames drawn: real "+C.real.drawn+"/"+C.real.inView+" ("+pct(C.real.share)+"), driver "+C.driver.drawn+"/"+C.driver.inView+" ("+pct(C.driver.share)+"); frames paired by clock "+C.pairedFrames+", identical in every formation "+C.pairedIdentical+" ("+C.pairedCodeDifferences+" formation-frame differences).","",
    "| formation | real: share, longest (frames; clock min), episodes | driver: share, longest, episodes |","|---|---|---|");
    C.rows.filter(r=>r.real||r.driver).sort((a,b)=>((a.driver&&a.driver.share)||0)-((b.driver&&b.driver.share)||0)).forEach(r=>{ const s=x=>x?pct(x.share)+", "+x.longestFrames+"; "+x.longestClockMin+", "+x.episodes:"-"; md.push("| "+r.id+" | "+s(r.real)+" | "+s(r.driver)+" |"); }); });
  fs.writeFileSync(path.join(OUTD,"tables.json"),JSON.stringify(R,null,1));
  fs.writeFileSync(path.join(OUTD,"tables.md"),md.join("\n")+"\n");
  console.log("wrote "+path.join(OUTD,"tables.json")+" and tables.md; runs: "+Object.keys(runs).join(", ")+"; realtime: "+Object.keys(R.realtime).join(", "));
})();
