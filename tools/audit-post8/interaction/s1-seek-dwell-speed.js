#!/usr/bin/env node
/* Scenario 1 (seek while playing, dwell on and off, the dwell toggled during Play, speed changes during Play and during a dwell's ease and hold).
   A visitor's page at 1600 x 900 (no ?harness=1, CSS transitions kept). Real input for every control (page.mouse, page.keyboard); the app's
   frames run by the frame driver (ilib.js DRV: the app's own loop on a 30 fps clock, the WebGL draw skipped but for screenshots). Where a key
   needs a focused control, the focus is put there by script (a visitor would Tab to it) and said so. */
"use strict";
const {run,H,I}=require("./irun.js");
const MIN_PER_SEC=10;
run("s1-seek-dwell-speed",{viewport:[1600,900],page:"visitor"},async c=>{
  const p=await c.page("desk",[1600,900],{});
  const starts=await H.ev(p,()=>dwellStarts().slice()); c.out.dwellStarts=starts;
  const phaseT0=await H.ev(p,()=>PHASES.map(x=>x.t0)); c.out.phaseT0=phaseT0;
  await c.step(p,"Esc closes the first-run card",H.esc);
  await c.step(p,"click Play",q=>H.click(q,"#play"));
  let s=c.last().s; c.check("play-starts",s.playing&&s.playBtn.startsWith("Pause"),"Play pressed: playing, the button says Pause",{playing:s.playing,btn:s.playBtn});
  /* 1. a seek during a dwell's hold, by PageDown on the rail */
  await c.step(p,"frames until the first dwell's hold",q=>H.until(q,"DWELL.st&&DWELL.st.stage==='hold'",4000));
  s=c.last().s; const E1=s.clock; c.check("first-hold",s.dwellSt&&s.dwellSt.startsWith("hold")&&starts.indexOf(+E1.toFixed(3))>=0||starts.some(x=>Math.abs(x-E1)<1e-6),"the clock holds at an event start",{clock:E1,dwell:s.dwellSt});
  await c.step(p,"set up: focus the time rail (a visitor Tabs to it); PageDown (real key) during the hold",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"PageDown"); },{shot:"pagedown-in-hold"});
  s=c.last().s; const nextT0=phaseT0.find(t=>t>E1+1e-9);
  c.check("pagedown-in-hold",!s.playing&&Math.abs(s.clock-nextT0)<1e-6&&!s.dwellSt&&s.playBtn.startsWith("Play"),"PageDown in a hold: playback stops, the clock at the next phase's start, no dwell state",{clock:s.clock,expected:nextT0,playing:s.playing,dwell:s.dwellSt,btn:s.playBtn,toast:s.toast,livePhase:s.livePhase});
  /* 2. Play again from there: the next dwell is the next start ahead (never one behind) and the clock never runs back */
  await c.step(p,"click Play",q=>H.click(q,"#play"));
  const tr=await I.trace(p,420); c.out.traceAfterPageDown=tr.filter((x,i)=>i%6===0);
  let back=0; for(let i=1;i<tr.length;i++) if(tr[i][0]<tr[i-1][0]-1e-9) back++;
  const holdAt=tr.filter(x=>x[1]==="hold").map(x=>x[0]); const firstHold=holdAt.length?holdAt[0]:null; const expNext=starts.find(x=>x>nextT0+1e-9);
  c.check("replay-monotonic",back===0&&(firstHold===null||Math.abs(firstHold-expNext)<1e-6),"after the seek, Play runs forward and dwells at the first start ahead",{backSteps:back,firstHold,expectedNextStart:expNext,clockStart:tr[0][0],clockEnd:tr[tr.length-1][0]});
  await c.step(p,"after 14 s of play",null);
  /* 3. drag the rail while playing */
  await c.step(p,"drag the time rail to 10:00 while playing (real mouse)",q=>H.dragRail(q,c.last().s.clock,600,8));
  s=c.last().s; c.check("drag-while-playing",!s.playing&&Math.abs(s.clock-600)<6,"a drag on the rail stops playback and puts the clock under the pointer",{clock:s.clock,playing:s.playing});
  /* 4. Home and End during Play */
  await c.step(p,"click Play; 30 frames",async q=>{ await H.click(q,"#play"); await H.frames(q,30); });
  await c.step(p,"set up: focus the rail; Home (real key) during Play",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); });
  s=c.last().s; c.check("home-during-play",!s.playing&&s.clock===240&&s.curPhase===0,"Home during Play: stopped at 04:00, phase 0",{clock:s.clock,playing:s.playing,phase:s.curPhase});
  await c.step(p,"click Play; 30 frames; set up focus on the rail; End",async q=>{ await H.click(q,"#play"); await H.frames(q,30); await H.focus(q,"#timerail"); await H.key(q,"End"); });
  s=c.last().s; c.check("end-during-play",!s.playing&&s.clock===1080,"End during Play: stopped at 18:00",{clock:s.clock,playing:s.playing,phase:s.curPhase,caption:s.caption});
  await c.step(p,"click Play at 18:00 (End then Play)",q=>H.click(q,"#play"));
  s=c.last().s; c.check("end-then-play",s.playing&&s.clock===240,"Play at the day's end starts the day again at 04:00 (togglePlay's rule)",{clock:s.clock,playing:s.playing});
  await c.step(p,"30 frames",q=>H.frames(q,30));
  /* 5. an event marker's Enter while playing */
  await c.step(p,"set up: focus the event markers' group (its current marker); ArrowRight x3 (real keys); Enter during Play",async q=>{
    await H.ev(q,()=>{ const m=document.querySelector('#evmarks .ev-mark[tabindex="0"]')||document.querySelector("#evmarks .ev-mark"); m.focus(); });
    for(let i=0;i<3;i++) await H.key(q,"ArrowRight");
    const f=await H.ev(q,()=>{ const a=document.activeElement; return {label:a.getAttribute("aria-label"), playing:playing}; });
    await H.key(q,"Enter"); return f; });
  s=c.last().s; const ret=c.last().ret||{};
  c.check("evmark-enter-during-play",!s.playing&&s.selection&&s.selection.startsWith("e:")&&s.drawer.on,"Enter on an event marker during Play: stopped, the clock at its start, its dossier open",{marker:ret.label,playingBefore:ret.playing,clock:s.clock,playing:s.playing,selection:s.selection,drawer:s.drawer});
  /* 6. a day-track anchor while playing: a formation's full dossier from the event's "Formations concerned" */
  await c.step(p,"click the first 'Formations concerned' link in the event's dossier",q=>H.click(q,"#drawer-body ul.links li button"));
  await c.step(p,"30 frames (the centring glide)",q=>H.frames(q,30));
  await c.step(p,"click the card's full-dossier button",async q=>{ const sel=await H.ev(q,()=>{ const B=[...document.querySelectorAll("#drawer-body button")]; const b=B.find(x=>/full dossier/i.test(x.textContent)); if(!b) return null; b.dataset.iaFull="1"; return b.textContent; }); if(!sel) throw new Error("no full-dossier button"); await H.click(q,'#drawer-body button[data-ia-full="1"]'); return sel; });
  const nA=await H.ev(p,()=>document.querySelectorAll("#drawer-body .dt-a").length); c.note("day-track anchors in the full dossier: "+nA);
  if(nA>1){
    await c.step(p,"click Play; 30 frames",async q=>{ await H.click(q,"#play"); await H.frames(q,30); });
    await c.step(p,"scroll the day-track's second anchor into view (set up) and click it (real mouse) during Play",async q=>{
      const t=await H.ev(q,()=>{ const a=document.querySelectorAll("#drawer-body .dt-a")[1]; a.scrollIntoView({block:"center"}); a.dataset.iaA="1"; return +a.dataset.t; });
      await H.click(q,'#drawer-body .dt-a[data-ia-a="1"]',{force:true}); return t; });
    s=c.last().s; const tA=c.last().ret;
    c.check("daytrack-anchor-during-play",!s.playing&&Math.abs(s.clock-tA)<1e-6&&s.selection&&s.selection.startsWith("f:"),"a day-track anchor during Play: stopped, the clock at the anchor, the selection kept",{anchorT:tA,clock:s.clock,playing:s.playing,selection:s.selection});
  }
  await c.step(p,"Esc (clear the selection)",H.esc);
  /* 7. a theme during Play (the dwell's comment, app.js: "the tour and the themes stop the clock") */
  await c.step(p,"click the Analysis tab",q=>H.click(q,"#tab-analysis"));
  await c.step(p,"click Play; 30 frames",async q=>{ await H.click(q,"#play"); await H.frames(q,30); });
  const themeBefore=c.last().s.clock;
  await c.step(p,"click the third theme during Play",async q=>{ const t=await H.ev(q,()=>{ const b=document.querySelectorAll("#chapters .chap")[2]; return {id:b.dataset.c,clock:chapterClock(chapterById(b.dataset.c)),name:b.textContent}; }); await H.click(q,"#chapters .chap",{index:2}); return t; });
  const th=c.last().ret; s=c.last().s;
  c.check("theme-stops-play",!s.playing,"a theme stops the clock (app.js's dwell comment; the spine data task: a theme opens on its principal moment)",{theme:th,clockAfterClick:s.clock,playing:s.playing,chapter:s.chapter});
  await c.step(p,"90 frames after the theme (3 s)",q=>H.frames(q,90),{shot:"theme-during-play-3s"});
  s=c.last().s; c.check("theme-moment-held",Math.abs(s.clock-th.clock)<1e-6,"3 s after choosing a theme the clock is still at its moment",{themeClock:th.clock,clock:s.clock,playing:s.playing,chapter:s.chapter,camTween:s.tween,follow:s.followBtn});
  await c.step(p,"click Pause; Esc (theme cleared)",async q=>{ if(await H.ev(q,()=>playing)) await H.click(q,"#play"); await H.esc(q); });
  /* 8. the dwell off: Layers, the dwell's toggle, Esc */
  await c.step(p,"click Layers; click 'Pause briefly at events' (off); Esc",async q=>{ await H.click(q,"#layersbtn"); await H.click(q,"#dwell"); await H.esc(q); });
  s=c.last().s; c.check("dwell-off",s.dwellOn===false&&s.dwellBtn!=="true"&&!s.panels.layers,"the dwell off, its button not pressed, the panel closed",{dwellOn:s.dwellOn,layers:s.panels.layers});
  await c.step(p,"set up focus on the rail; Home; click Play",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); await H.click(q,"#play"); });
  const tr2=await I.trace(p,300); const holds2=tr2.filter(x=>x[1]!=="-").length; let back2=0; for(let i=1;i<tr2.length;i++) if(tr2[i][0]<tr2[i-1][0]-1e-9) back2++;
  const rate2=(tr2[tr2.length-1][0]-tr2[0][0])/((tr2.length-1)/30);
  c.check("dwell-off-play",holds2===0&&back2===0&&Math.abs(rate2-MIN_PER_SEC*0.5)<0.05,"with the dwell off, Play runs at ½× (5 clock min a second) through the starts without a stop",{framesInDwell:holds2,backSteps:back2,rate:+rate2.toFixed(3),from:tr2[0][0],to:tr2[tr2.length-1][0],startsCrossed:starts.filter(x=>x>tr2[0][0]&&x<tr2[tr2.length-1][0])});
  await c.step(p,"set up focus on the rail; PageDown during Play (dwell off)",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"PageDown"); });
  s=c.last().s; c.check("pagedown-dwell-off",!s.playing&&phaseT0.indexOf(s.clock)>=0,"PageDown during Play stops at a phase start (dwell off)",{clock:s.clock,playing:s.playing});
  /* 9. the dwell toggled ON during Play (S-2's case): the clock never goes back, and the next start ahead dwells */
  await c.step(p,"click Play; 60 frames; click Layers; click the dwell (on) while playing; Esc",async q=>{ await H.click(q,"#play"); await H.frames(q,60); await H.click(q,"#layersbtn"); await H.click(q,"#dwell"); await H.esc(q); });
  s=c.last().s; const tOn=s.clock;
  const tr3=await I.trace(p,600); let back3=0; for(let i=1;i<tr3.length;i++) if(tr3[i][0]<tr3[i-1][0]-1e-9) back3++;
  const h3=tr3.filter(x=>x[1]==="hold").map(x=>x[0]); const expH3=starts.find(x=>x>tOn+1e-9);
  c.check("dwell-on-during-play",s.playing&&back3===0&&h3.length>0&&Math.abs(h3[0]-expH3)<1e-6,"the dwell turned on while playing: the clock never goes back; the first start ahead dwells (S-2 fixed)",{clockAtToggle:tOn,backSteps:back3,firstHold:h3[0],expected:expH3});
  /* 9b. the dwell toggled OFF during a hold: the clock moves on at once at the speed */
  await c.step(p,"frames until a hold; click Layers; click the dwell (off) in the hold; Esc",async q=>{ await H.until(q,"DWELL.st&&DWELL.st.stage==='hold'",3000); const t=await H.ev(q,()=>clock); await H.click(q,"#layersbtn"); await H.click(q,"#dwell"); await H.esc(q); return t; });
  const tHold=c.last().ret; const tr4=await I.trace(p,30); let back4=0; for(let i=1;i<tr4.length;i++) if(tr4[i][0]<tr4[i-1][0]-1e-9) back4++;
  c.check("dwell-off-in-hold",back4===0&&tr4[tr4.length-1][0]>tHold+3&&tr4.every(x=>x[1]==="-"),"the dwell turned off in a hold: the clock leaves the start at once at ½×",{holdAt:tHold,after1s:tr4[tr4.length-1][0],states:[...new Set(tr4.map(x=>x[1]))]});
  await c.step(p,"click Layers; dwell on again; Esc",async q=>{ await H.click(q,"#layersbtn"); await H.click(q,"#dwell"); await H.esc(q); });
  /* 10. speed changes during a dwell's hold, ease in and ease out, and off the dwell */
  await c.step(p,"frames until a hold (at ½×)",q=>H.until(q,"DWELL.st&&DWELL.st.stage==='hold'",3000));
  await c.step(p,"10 frames into the hold; click 4× (real)",async q=>{ await H.frames(q,10); await H.click(q,'.spd-btn[data-s="4"]'); });
  const tr5=await I.trace(p,150); const holdN=tr5.findIndex(x=>x[1]!=="hold"); const outN=tr5.slice(holdN).findIndex(x=>x[1]!=="out");
  const tAfter=tr5.slice(holdN+outN); const rate5=tAfter.length>31?(tAfter[30][0]-tAfter[0][0]):null;
  c.check("speed-in-hold",holdN>=33&&holdN<=36&&rate5!==null&&Math.abs(rate5-40)<0.6,"4× pressed 10 frames into a hold: the hold keeps its 1.5 s (45 frames in all), the ease out and the run after it at 4× (40 clock min a second)",{holdFramesAfterPress:holdN,easeOutFrames:outN,rateAfter1s:rate5,speedPressed:(await H.st(p)).speedPressed});
  await c.step(p,"frames until an ease in (at 4×); 3 frames; click ½× (real)",async q=>{ await H.until(q,"DWELL.st&&DWELL.st.stage==='in'",3000); const a=await I.trace(q,3); await H.click(q,'.spd-btn[data-s="0.5"]'); return a; });
  const pre=c.last().ret; const tr6=await I.trace(p,40);
  const d0=pre[2][0]-pre[1][0], d1=tr6[0][0]-pre[2][0], d2=tr6[1][0]-tr6[0][0];
  c.check("speed-in-ease",d1<d0&&d1>0&&d2<=d1+1e-9&&tr6.some(x=>x[1]==="hold"),"½× pressed in an ease in at 4×: the clock's step drops at once by the ratio and eases on into the hold (8H)",{stepBefore:+d0.toFixed(4),stepAfter:+d1.toFixed(4),nextStep:+d2.toFixed(4),reachedHold:tr6.some(x=>x[1]==="hold")});
  await c.step(p,"frames until an ease out (at ½×); click 2× (real); 30 frames",async q=>{ await H.until(q,"DWELL.st&&DWELL.st.stage==='out'",3000); const a=await I.trace(q,2); await H.click(q,'.spd-btn[data-s="2"]'); const b=await I.trace(q,30); return {a,b}; });
  const r7=c.last().ret; let back7=0; const seq7=r7.a.concat(r7.b); for(let i=1;i<seq7.length;i++) if(seq7[i][0]<seq7[i-1][0]-1e-9) back7++;
  const endOut=r7.b.findIndex(x=>x[1]==="-"); const rate7=endOut>=0&&r7.b.length>endOut+10?(r7.b[endOut+10][0]-r7.b[endOut][0])*3:null;
  c.check("speed-in-ease-out",back7===0&&rate7!==null&&Math.abs(rate7-20)<0.6,"2× pressed in an ease out: no backward step; after it, 2× (20 clock min a second)",{backSteps:back7,rateAfter:rate7,easeEndsAfterFrames:endOut});
  /* the Play button's speed after all: ½× restored? (the visitor's last choice stands: 2×) */
  s=await H.st(p); c.check("speed-stands",s.speed===2&&s.speedPressed==="2","the last speed pressed stands",{speed:s.speed,pressed:s.speedPressed});
  await c.step(p,"click Pause",q=>H.click(q,"#play"),{shot:"end"});
  c.out.listeners=await I.counts(p);
});
