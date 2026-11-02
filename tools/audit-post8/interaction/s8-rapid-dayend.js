#!/usr/bin/env node
/* Scenario 8: rapid repeated input (a double-click on Play, 20 PageDowns in a row against the same 20 with frames between, repeated speed
   changes during Play), Play to the end of the day and Play again, and the same sequence run twice from the same start giving the same state.
   A visitor's page at 1280 x 720; real input; frames by the frame driver (ilib.js). */
"use strict";
const {run,H,I}=require("./irun.js");
run("s8-rapid-dayend",{viewport:[1280,720],page:"visitor"},async c=>{
  const p=await c.page("desk",[1280,720],{});
  await c.step(p,"Esc closes the first-run card; 2 frames",async q=>{ await H.esc(q); await H.frames(q,2); });
  /* a double-click on Play */
  await c.step(p,"double-click Play (real dblclick); 30 frames",async q=>{ await I.clickEl(q,"#play",{dbl:true}); await H.frames(q,30); });
  let s=c.last().s; c.check("dblclick-play",s.playing===(s.playBtn.startsWith("Pause"))&&s.playBtn.endsWith(s.playing?"true":"false"),"after a double-click the Play button says what the clock does (two presses: paused again)",{playing:s.playing,btn:s.playBtn,clock:s.clock});
  /* 20 PageDowns in a row, and the same 20 with frames between */
  await c.step(p,"set up focus on the rail; Home; 20 PageDowns in a row; settle",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); await H.until(q,"!tween",400); for(let i=0;i<20;i++) await H.key(q,"PageDown"); await H.until(q,"!tween",400); await H.frames(q,40); });
  const fa=await I.fp(p); s=c.last().s; const fastState={clock:s.clock,phase:s.curPhase,toast:s.toast,livePhase:s.livePhase,caption:s.caption};
  await c.step(p,"Home; 20 PageDowns with 15 frames between each; settle",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); await H.until(q,"!tween",400); for(let i=0;i<20;i++){ await H.key(q,"PageDown"); await H.frames(q,15); } await H.until(q,"!tween",400); await H.frames(q,40); });
  const fb=await I.fp(p); s=c.last().s; const slowState={clock:s.clock,phase:s.curPhase,toast:s.toast,livePhase:s.livePhase,caption:s.caption};
  const d=I.fpDiff(fa,fb).filter(x=>x.k!=="ml");
  c.check("pagedown-fast-slow",fastState.clock===1080&&slowState.clock===1080&&d.length===0,"20 PageDowns end at 18:00 whether pressed in a row or slowly, with the same frame state",{fast:fastState,slow:slowState,differs:d.map(x=>x.k),detail:d.slice(0,3)});
  /* repeated speed changes during Play */
  await c.step(p,"Home; click Play; click ½× 1× 2× 4× five times in a row; 30 frames",async q=>{ await H.key(q,"Home"); await H.click(q,"#play"); for(let r=0;r<5;r++) for(const v of ["0.5","1","2","4"]) await H.click(q,'.spd-btn[data-s="'+v+'"]'); const t=await I.trace(q,30); return t; });
  s=c.last().s; const t=c.last().ret; const rate=(t[29][0]-t[0][0])/(29/30);
  c.check("speed-rapid",s.speed===4&&s.speedPressed==="4"&&s.playing&&(t.some(x=>x[1]!=="-")||Math.abs(rate-40)<0.6),"after twenty speed presses the last (4×) stands, pressed, and the clock runs at it",{speed:s.speed,pressed:s.speedPressed,rate:+rate.toFixed(2),dwell:[...new Set(t.map(x=>x[1]))]});
  /* Play to the end of the day at 4× */
  await c.step(p,"frames until the clock stops (the day's end at 4×)",q=>H.until(q,"!playing",12000),{shot:"day-end"});
  s=c.last().s; c.check("day-end",!s.playing&&s.clock===1080&&s.playBtn.startsWith("Play"),"Play runs to 18:00 and stops there, the button says Play",{clock:s.clock,playing:s.playing,btn:s.playBtn,caption:s.caption,toast:s.toast,focus:s.focus});
  await c.step(p,"click Play again at 18:00; 30 frames",async q=>{ await H.click(q,"#play"); await H.frames(q,30); });
  s=c.last().s; c.check("play-after-end",s.playing&&s.clock>=240&&s.clock<260,"Play at the day's end starts from 04:00 again",{clock:s.clock,playing:s.playing});
  await c.step(p,"Home during Play",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); });
  s=c.last().s; c.check("home-play",!s.playing&&s.clock===240,"Home during Play: stopped at 04:00",{clock:s.clock,playing:s.playing});
  /* the same sequence twice from the same start */
  const SEQ=async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); await H.click(q,'.spd-btn[data-s="0.5"]'); await H.until(q,"!tween",400); await H.click(q,"#play"); await H.frames(q,100); await H.key(q,"2"); await H.frames(q,20); await H.key(q,"3"); await H.frames(q,20); await H.key(q,"1"); await H.focus(q,"#timerail"); for(let i=0;i<3;i++) await H.key(q,"PageDown"); await H.click(q,"#play"); await H.frames(q,50); await H.click(q,'.spd-btn[data-s="4"]'); await H.frames(q,50); await H.click(q,"#play"); await H.until(q,"!tween",400); await H.frames(q,40); };
  await c.step(p,"the sequence (Home, ½×, Play, 100 frames, 2, 3, 1, PageDown x3, Play, 50 frames, 4×, 50 frames, Pause; settle)",SEQ);
  const s1=c.last().s, f1=await I.fp(p);
  await c.step(p,"the same sequence again",SEQ);
  const s2=c.last().s, f2=await I.fp(p);
  const dd=I.fpDiff(f1,f2).filter(x=>x.k!=="ml"), keys=["clock","playing","speed","presentation","mode","selection","curPhase","freeCam","caption","focus"];
  const sd=keys.filter(k=>JSON.stringify(s1[k])!==JSON.stringify(s2[k]));
  c.check("same-twice",dd.length===0&&sd.length===0,"the same sequence twice gives the same state and frame",{stateDiffers:sd.map(k=>({k,a:s1[k],b:s2[k]})),frameDiffers:dd.map(x=>x.k),detail:dd.slice(0,3),mlDiffers:(I.fpDiff(f1,f2).find(x=>x.k==="ml")||{n:0}).n});
  c.out.listeners=await I.counts(p);
});
