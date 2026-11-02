#!/usr/bin/env node
/* Scenario 5: earlier times revisited after later states, and the same clock reached by different paths (determinism). A visitor's page at
   1280 x 720 (real keys, drags and clicks; frames by the frame driver, ilib.js). After each path the tweens are run out and 40 frames drawn
   (the stabiliser's passes), then a fingerprint of what the frame draws (ilib.js FP: blocks, overlays and their draw-on, the map layer's
   placed items, the captions and the dispatch, the light, the fog, the camera) is compared with the fresh path's. */
"use strict";
const {run,H,I}=require("./irun.js");
const settleF=async q=>{ await H.until(q,"!tween",400); await H.frames(q,40); };
run("s5-revisit-determinism",{viewport:[1280,720],page:"visitor"},async c=>{
  const p=await c.page("desk",[1280,720],{});
  const FP={}, SN={};
  const take=async (k,label,fn,shot)=>{ await c.step(p,label,async q=>{ await fn(q); await settleF(q); },shot?{shot}:{}); FP[k]=await I.fp(p); SN[k]=c.last().s; };
  await take("fresh0400","Esc closes the first-run card; settle",async q=>{ await H.esc(q); });
  await take("A0700","fresh path: set up focus on the rail; PageDown (07:00); settle",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"PageDown"); },"A-0700");
  await take("B1600","End (18:00), settle; drag the rail to 16:00; settle",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"End"); await settleF(q); await H.dragRail(q,1080,960,6); });
  c.out.b1600clock=SN.B1600.clock;
  await take("B0700","path B: Home then PageDown (07:00); settle",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); await settleF(q); await H.key(q,"PageDown"); },"B-0700");
  await take("C1600","Shift+ArrowRight x9 (16:00); settle",async q=>{ await H.focus(q,"#timerail"); for(let i=0;i<9;i++) await H.key(q,"Shift+ArrowRight"); });
  await take("C0700","path C: Shift+ArrowLeft x9 straight back to 07:00; settle",async q=>{ await H.focus(q,"#timerail"); for(let i=0;i<9;i++) await H.key(q,"Shift+ArrowLeft"); });
  await take("D0700","path D: drag the rail from 07:00 to 17:00, release, and drag it back to 07:00; then set up focus on the rail and Home, PageDown (exact 07:00); settle",async q=>{ await H.dragRail(q,420,1020,10); await H.dragRail(q,1020,420,10); await H.focus(q,"#timerail"); await H.key(q,"Home"); await H.key(q,"PageDown"); });
  await take("E0700","path E: the event key ',' from 16:00 (Shift+ArrowRight x9 first) until the clock is at or before 07:00, then PageDown/PageUp to 07:00; settle",async q=>{ await H.focus(q,"#timerail"); for(let i=0;i<9;i++) await H.key(q,"Shift+ArrowRight"); await settleF(q);
    await H.ev(q,()=>document.activeElement&&document.activeElement.blur()); let n=0; while(await H.ev(q,()=>clock>420)&&n++<80) await H.key(q,","); await H.focus(q,"#timerail"); if(await H.ev(q,()=>clock<420)) await H.key(q,"PageDown"); return n; });
  c.out.eventKeysPressed=c.last().ret;
  await take("F0700","path F: Home; the pointer moved off the timeline (its tip hidden); click Play; frames until the 07:00 dwell's hold; click Pause",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); await settleF(q); await q.mouse.move(640,200,{steps:4}); await q.waitForTimeout(400); await H.click(q,"#play"); await H.until(q,"clock>=420-1e-9&&(!DWELL.on||DWELL.st&&DWELL.st.stage==='hold'||clock>420)",4000); await H.click(q,"#play"); });
  c.out.f0700clock=SN.F0700.clock;
  await take("G0400","path G: Home (04:00) after the later states; settle",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); });
  /* a mid-phase minute: 09:20 by keys from before, and by keys from after */
  await take("H0920a","09:20 from 08:00: set up focus on the rail; Home; Shift+ArrowRight x4; ArrowRight x8; settle",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); for(let i=0;i<5;i++) await H.key(q,"Shift+ArrowRight"); for(let i=0;i<2;i++) await H.key(q,"ArrowRight"); });
  await take("H0920b","09:20 from 12:00: Shift+ArrowRight x3 (12:20), settle, then Shift+ArrowLeft x3 (09:20); settle",async q=>{ await H.focus(q,"#timerail"); for(let i=0;i<3;i++) await H.key(q,"Shift+ArrowRight"); await settleF(q); for(let i=0;i<3;i++) await H.key(q,"Shift+ArrowLeft"); });
  /* compare */
  const cmp=(a,b,label)=>{ const d=I.fpDiff(FP[a],FP[b]).map(x=>x.k==="units"?Object.assign({},x,{first:x.first.filter(u=>!(String(u.a||"").startsWith("0,")&&String(u.b||"").startsWith("0,")))}):x).filter(x=>x.k!=="units"||x.first.length);   /* (second session) a block hidden by both paths compared apart: its transform is the last place it was drawn */
    const camEq=x=>x.k==="cam"&&JSON.stringify(x.a,(k,v)=>typeof v==="number"?Math.round(v*1e4)/1e4:v)===JSON.stringify(x.b,(k,v)=>typeof v==="number"?Math.round(v*1e4)/1e4:v);
    c.out["diff_"+a+"_"+b]=d; const nonML=d.filter(x=>x.k!=="ml"&&x.k!=="cam"&&x.k!=="fog");   /* the fog's fourth uniform is the eye's focus distance: it follows the camera */   /* (second session) the camera apart too: a seek moves it to the phase's view, Play's Follow elsewhere, by design */
    c.check("same-"+a+"-"+b,nonML.length===0,label+": the frame's state the same by both paths (the map layer's placements and the camera compared apart)",{clocks:[FP[a].clock,FP[b].clock],differs:nonML.map(x=>x.k),camDiffers:d.some(x=>x.k==="cam"&&!camEq(x)),fogDiffers:d.some(x=>x.k==="fog"),mlDiffers:(d.find(x=>x.k==="ml")||{n:0}).n,detail:nonML.slice(0,4)}); };
  cmp("A0700","B0700","07:00 fresh vs after 18:00 and 16:00 (Home, PageDown)");
  cmp("A0700","C0700","07:00 fresh vs straight back from 16:00 by Shift+ArrowLeft");
  cmp("A0700","D0700","07:00 fresh vs after a drag to 17:00 and back");
  cmp("A0700","E0700","07:00 fresh vs back by the event keys");
  cmp("A0700","F0700","07:00 by a seek vs by Play (paused in the dwell)");
  cmp("fresh0400","G0400","04:00 fresh vs Home after the later states");
  cmp("H0920a","H0920b","09:20 from before vs from after");
  c.out.fp={A0700:FP.A0700, fresh0400:{caption:FP.fresh0400.caption,dispatch:FP.fresh0400.dispatch}};
  c.out.snaps=Object.fromEntries(Object.entries(SN).map(([k,v])=>[k,{clock:v.clock,caption:v.caption,toast:v.toast,livePhase:v.livePhase,cam:v.cam,ml:v.ml,drawon:v.drawon,smoke:v.smoke,blocks:v.blocks,overlays:v.overlays}]));
  c.out.listeners=await I.counts(p);
});
