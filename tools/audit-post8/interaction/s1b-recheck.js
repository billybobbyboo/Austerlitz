#!/usr/bin/env node
/* Scenario 1b (second session): the parts of scenario 1 whose first run (s1-seek-dwell-speed.json) did not measure what it meant to, run again
   with the helpers fixed (ilib.js clickEl: scrolled into view, a settled box; irun.js dragRail: a press the rail itself takes). Its valid parts
   (the seeks by PageDown, Home, End and an event marker's Enter during Play, End then Play, the theme during Play, ½× in an ease in) are not
   repeated. Also measured here, because the first run's drag fell on it: what a press on the playhead hits when the clock stands at an event
   start. A visitor's page at 1600 x 900 (no ?harness=1, CSS transitions kept); real input; frames by the frame driver (ilib.js DRV). */
"use strict";
const {run,H,I}=require("./irun.js");
/* the rail's centre line, pixel by pixel: what a press there would hit (the rail, or something over it) */
const COVER=()=>{ const rail=document.getElementById("timerail"), r=rail.getBoundingClientRect(), y=r.top+r.height/2; let own=0, other=0; const by={};
  for(let x=Math.ceil(r.left)+1;x<Math.floor(r.right)-1;x++){ const h=document.elementFromPoint(x,y); if(h&&(h===rail||rail.contains(h))) own++; else { other++; const k=h?(h.className&&typeof h.className==="string"?h.tagName.toLowerCase()+"."+h.className.split(" ")[0]:h.tagName.toLowerCase()):"null"; by[k]=(by[k]||0)+1; } }
  return {railPx:own+other, coveredPx:other, coveredShare:+(other/(own+other)).toFixed(3), by, markers:document.querySelectorAll("#evmarks .ev-mark").length, width:Math.round(r.width)}; };
const AT_PLAYHEAD=()=>{ const rail=document.getElementById("timerail"), r=rail.getBoundingClientRect(), x=r.left+(clock-T_MIN)/(T_MAX-T_MIN)*r.width, y=r.top+r.height/2, h=document.elementFromPoint(x,y);
  return {x:Math.round(x),y:Math.round(y),hit:h?(h.id?"#"+h.id:h.tagName.toLowerCase()+"."+String(h.className).split(" ").join(".")):null,label:h&&h.getAttribute?h.getAttribute("aria-label"):null,railTakes:!!(h&&(h===rail||rail.contains(h)))}; };
run("s1b-recheck",{viewport:[1600,900],page:"visitor"},async c=>{
  const p=await c.page("desk",[1600,900],{});
  await c.step(p,"Esc closes the first-run card; 2 frames",async q=>{ await H.esc(q); await H.frames(q,2); });
  /* A. the playhead at an event start */
  c.out.coverAt1600=await H.ev(p,COVER);
  c.out.playheadAt0400=await H.ev(p,AT_PLAYHEAD);
  c.note("the rail's centre line at 1600 px: "+JSON.stringify(c.out.coverAt1600)+"; at the playhead (04:00): "+JSON.stringify(c.out.playheadAt0400));
  await c.step(p,"click Play; frames until the first dwell's hold (04:15)",async q=>{ await H.click(q,"#play"); return H.until(q,"DWELL.st&&DWELL.st.stage==='hold'",4000); });
  const inHold=await H.ev(p,AT_PLAYHEAD); c.out.playheadInHold=inHold;
  await c.step(p,"in the hold: press the playhead's centre (real mouse), drag 200 px right with the button held, release",async q=>{
    const before=await H.ev(q,()=>({clock,playing})); await q.mouse.move(inHold.x,inHold.y); await q.mouse.down(); for(let i=1;i<=6;i++) await q.mouse.move(inHold.x+200*i/6,inHold.y); await q.mouse.up();
    const after=await H.ev(q,()=>({clock,playing,sel:selection?selection.kind+":"+selection.id:null,focus:document.activeElement?(document.activeElement.className||document.activeElement.id):null})); return {before,after}; });
  let s=c.last().s, r=c.last().ret;
  c.check("playhead-in-hold-drag",r.after.clock>r.before.clock+20,"a drag that starts on the playhead while the clock holds at an event start scrubs the clock (expected of a slider's thumb)",{atPlayhead:inHold,before:r.before,after:r.after},{note:"if not: the marker's enlarged hit area (style.css .ev-mark::after inset -6px; .ev-mark.dw scale 1.5) takes the press"});
  await c.step(p,"Pause (by state); frames until idle",async q=>{ await H.setPlay(q,false); await H.frames(q,5); });
  /* B. a drag on the rail while playing, from where the rail takes the press */
  await c.step(p,"Home (set up focus on the rail, real key); Play; 300 frames",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); await H.setPlay(q,true); await H.frames(q,300); });
  await c.step(p,"drag the time rail from the clock's minute to 10:00 while playing (real mouse, a press the rail takes)",async q=>H.dragRail(q,await H.ev(q,()=>clock),600,8));
  s=c.last().s; r=c.last().ret;
  c.check("drag-while-playing",!s.playing&&Math.abs(s.clock-600)<2,"a drag on the rail stops playback and puts the clock under the pointer",{clock:s.clock,playing:s.playing,start:r});
  /* C. a day-track anchor while playing */
  await c.step(p,"set up: focus the event markers' group; ArrowRight x3 (real keys); Enter",async q=>{ await H.ev(q,()=>{ const m=document.querySelector('#evmarks .ev-mark[tabindex="0"]')||document.querySelector("#evmarks .ev-mark"); m.focus(); }); for(let i=0;i<3;i++) await H.key(q,"ArrowRight"); await H.key(q,"Enter"); });
  await c.step(p,"click the first 'Formations concerned' link in the event's dossier; 30 frames",async q=>{ await H.click(q,"#drawer-body ul.links li button"); await H.frames(q,30); });
  await c.step(p,"click the card's 'Full dossier'",async q=>{ const sel=await H.ev(q,()=>{ const b=[...document.querySelectorAll("#drawer-body button")].find(x=>/full dossier/i.test(x.textContent)); if(!b) return null; b.dataset.iaFull="1"; return b.textContent; }); if(!sel) throw new Error("no full-dossier button"); await H.click(q,'#drawer-body button[data-ia-full="1"]'); return sel; });
  const nA=await H.ev(p,()=>document.querySelectorAll("#drawer-body .dt-a").length); c.note("day-track anchors in the full dossier: "+nA);
  if(nA>1){
    await c.step(p,"Play (by state); 30 frames; click the day-track's second anchor (real mouse) during Play",async q=>{ await H.setPlay(q,true); await H.frames(q,30);
      const t=await H.ev(q,()=>{ const a=document.querySelectorAll("#drawer-body .dt-a")[1]; a.dataset.iaA="1"; return +a.dataset.t; }); const pl=await H.ev(q,()=>playing);
      await H.click(q,'#drawer-body .dt-a[data-ia-a="1"]'); return {t,playingBefore:pl}; });
    s=c.last().s; const tA=c.last().ret||{};
    c.check("daytrack-anchor-during-play",tA.playingBefore&&!s.playing&&Math.abs(s.clock-tA.t)<1e-6&&s.selection&&s.selection.startsWith("f:"),"a day-track anchor during Play: stopped, the clock at the anchor, the selection kept",{anchor:tA,clock:s.clock,playing:s.playing,selection:s.selection,drawer:s.drawer});
  } else c.check("daytrack-anchor-during-play",false,"a full dossier with day-track anchors to press",{anchors:nA});
  await c.step(p,"Esc (selection cleared)",H.esc);
  /* D. the dwell off, on during Play, off during a hold (Layers' last row, scrolled into view as a visitor's wheel would) */
  await c.step(p,"click Layers; click 'Pause briefly at events' (off); Esc",async q=>{ await H.click(q,"#layersbtn"); const r=await H.click(q,"#dwell"); await H.esc(q); return r; });
  s=c.last().s; c.check("dwell-off",s.dwellOn===false&&s.dwellBtn==="false"&&!s.panels.layers,"the dwell off, its button not pressed, the panel closed",{dwellOn:s.dwellOn,btn:s.dwellBtn,layers:s.panels.layers,click:c.last().ret});
  await c.step(p,"set up focus on the rail; Home; Play (by state)",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); await H.setPlay(q,true); });
  const tr2=await I.trace(p,300); let back2=0; for(let i=1;i<tr2.length;i++) if(tr2[i][0]<tr2[i-1][0]-1e-9) back2++;
  const holds2=tr2.filter(x=>x[1]!=="-").length, rate2=(tr2[tr2.length-1][0]-tr2[0][0])/((tr2.length-1)/30);
  c.check("dwell-off-play",holds2===0&&back2===0&&Math.abs(rate2-5)<0.05,"with the dwell off, Play runs at ½× (5 clock min a second) through the starts without a stop",{framesInDwell:holds2,backSteps:back2,rate:+rate2.toFixed(3),from:tr2[0][0],to:tr2[tr2.length-1][0]});
  await c.step(p,"set up focus on the rail; PageDown during Play (dwell off)",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"PageDown"); });
  s=c.last().s; c.check("pagedown-dwell-off",!s.playing&&s.clock===420,"PageDown during Play stops at the next phase's start (dwell off)",{clock:s.clock,playing:s.playing});
  await c.step(p,"Play (by state); 60 frames; click Layers; click the dwell (on) while playing; Esc",async q=>{ await H.setPlay(q,true); await H.frames(q,60); await H.click(q,"#layersbtn"); await H.click(q,"#dwell"); await H.esc(q); return H.ev(q,()=>({clock,on:DWELL.on,next:DWELL.next})); });
  const on=c.last().ret; const tr3=await I.trace(p,600); let back3=0; for(let i=1;i<tr3.length;i++) if(tr3[i][0]<tr3[i-1][0]-1e-9) back3++;
  const h3=tr3.filter(x=>x[1]==="hold").map(x=>x[0]); const S=await H.ev(p,()=>dwellStarts().slice()); const expH3=S.find(x=>x>on.clock+1e-9);
  c.check("dwell-on-during-play",on.on&&back3===0&&h3.length>0&&Math.abs(h3[0]-expH3)<1e-6,"the dwell turned on while playing: the clock never goes back; the first start ahead dwells (S-2 fixed)",{atToggle:on,backSteps:back3,firstHold:h3[0],expected:expH3});
  await c.step(p,"frames until a hold; click Layers; click the dwell (off) in the hold; Esc",async q=>{ await H.until(q,"DWELL.st&&DWELL.st.stage==='hold'",3000); const t=await H.ev(q,()=>clock); await H.click(q,"#layersbtn"); await H.click(q,"#dwell"); await H.esc(q); return t; });
  const tHold=c.last().ret, tr4=await I.trace(p,30); let back4=0; for(let i=1;i<tr4.length;i++) if(tr4[i][0]<tr4[i-1][0]-1e-9) back4++;
  c.check("dwell-off-in-hold",back4===0&&tr4[tr4.length-1][0]>tHold+3&&tr4.every(x=>x[1]==="-"),"the dwell turned off in a hold: the clock leaves the start at once at ½×",{holdAt:tHold,after1s:tr4[tr4.length-1][0],states:[...new Set(tr4.map(x=>x[1]))]});
  await c.step(p,"click Layers; the dwell on again; Esc; Pause (by state)",async q=>{ await H.click(q,"#layersbtn"); await H.click(q,"#dwell"); await H.esc(q); await H.setPlay(q,false); });
  /* E. a change of speed in a hold, at a start with room after it (04:15: the next start 07:00) */
  await c.step(p,"set up focus on the rail; Home; click ½×; Play (by state); frames until the 04:15 hold begins",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); await H.click(q,'.spd-btn[data-s="0.5"]'); await H.setPlay(q,true); return H.until(q,"DWELL.st&&DWELL.st.stage==='hold'",4000); });
  await c.step(p,"10 frames into the hold; click 4× (real)",async q=>{ await H.frames(q,10); const st=await H.ev(q,()=>({clock,stage:DWELL.st&&DWELL.st.stage,tau:DWELL.st&&DWELL.st.tau})); await H.click(q,'.spd-btn[data-s="4"]'); return st; });
  const pre5=c.last().ret, tr5=await I.trace(p,150), holdN=tr5.findIndex(x=>x[1]!=="hold"), rest=tr5.slice(holdN), outN=rest.findIndex(x=>x[1]!=="out"), free=rest.slice(outN).filter(x=>x[1]==="-");
  let back5=0; for(let i=1;i<tr5.length;i++) if(tr5[i][0]<tr5[i-1][0]-1e-9) back5++;
  const rate5=free.length>31?(free[30][0]-free[0][0]):null;
  c.check("speed-in-hold",back5===0&&holdN>=33&&holdN<=36&&rate5!==null&&Math.abs(rate5-40)<0.6,"4× pressed 10 frames into a hold: the hold keeps its 1.5 s (45 frames in all), then the ease out and the run after it at 4× (40 clock min a second)",{atPress:pre5,holdFramesAfterPress:holdN,easeOutFrames:outN,rateOver30FreeFrames:rate5,backSteps:back5});
  /* F. a change of speed in an ease out (½× to 2×), at 04:15 again */
  await c.step(p,"Pause; set up focus on the rail; Home; click ½×; Play; frames until the 04:15 ease out; 2 frames; click 2× (real)",async q=>{ await H.setPlay(q,false); await H.focus(q,"#timerail"); await H.key(q,"Home"); await H.click(q,'.spd-btn[data-s="0.5"]'); await H.setPlay(q,true); await H.until(q,"DWELL.st&&DWELL.st.stage==='out'",4000); const a=await I.trace(q,2); await H.click(q,'.spd-btn[data-s="2"]'); return a; });
  const a6=c.last().ret, tr6=await I.trace(p,90), seq6=a6.concat(tr6); let back6=0; for(let i=1;i<seq6.length;i++) if(seq6[i][0]<seq6[i-1][0]-1e-9) back6++;
  const endOut=tr6.findIndex(x=>x[1]==="-"), free6=tr6.slice(endOut).filter(x=>x[1]==="-"), rate6=free6.length>31?(free6[30][0]-free6[0][0]):null;
  const stepBefore=a6[1][0]-a6[0][0], stepAfter=tr6[0][0]-a6[1][0];
  c.check("speed-in-ease-out",back6===0&&rate6!==null&&Math.abs(rate6-20)<0.6,"2× pressed in an ease out: no backward step; after it, 2× (20 clock min a second)",{backSteps:back6,stepBefore:+stepBefore.toFixed(4),stepAfter:+stepAfter.toFixed(4),easeEndsAfterFrames:endOut,rateOver30FreeFrames:rate6});
  await c.step(p,"Pause (by state)",q=>H.setPlay(q,false),{shot:"end"});
  c.out.listeners=await I.counts(p);
});
