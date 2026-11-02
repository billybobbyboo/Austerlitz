#!/usr/bin/env node
/* Scenario 2: the presentation (Study / Watch / Clean), the ground (Landscape / Paper map / Landscape with counters) and the relief changed
   while the clock plays, at 1280 x 720 on a visitor's page. Real keys and clicks; the frames by the frame driver (ilib.js). */
"use strict";
const {run,H,I}=require("./irun.js");
run("s2-modes-during-play",{viewport:[1280,720],page:"visitor"},async c=>{
  const p=await c.page("desk",[1280,720],{});
  await c.step(p,"Esc closes the first-run card",H.esc);
  await c.step(p,"click Play; 300 frames (10 s)",async q=>{ await H.click(q,"#play"); await H.frames(q,300); });
  let s=c.last().s, t=s.clock;
  /* Watch during Play */
  await c.step(p,"key 2 (Watch) during Play; 90 frames",async q=>{ await H.key(q,"2"); await H.frames(q,90); },{draw:"watch-playing"});
  s=c.last().s;
  c.check("watch-keeps-play",s.playing&&s.presentation==="watch"&&s.clock>t&&!s.freeCam,"Watch during Play: still playing, Follow still on, the clock moving",{playing:s.playing,clock:s.clock,from:t,follow:s.followBtn,freeCam:s.freeCam});
  c.check("watch-caption",s.capVisible&&/derived/.test(s.caption||""),"Watch shows the caption with its derived reading",{caption:s.caption,visible:s.capVisible});
  /* Clean during Play */
  await c.step(p,"key 3 (Clean) during Play; 60 frames",async q=>{ await H.key(q,"3"); await H.frames(q,60); });
  s=c.last().s; t=s.clock;
  c.check("clean-keeps-play",s.playing&&s.presentation==="map","Clean during Play: still playing (the timeline hidden)",{playing:s.playing,clock:s.clock,restore:s.panels.restore,focus:s.focus,focusVisible:s.focusVisible});
  await c.step(p,"Space in Clean (pause from the keyboard)",q=>H.key(q," "));
  s=c.last().s; c.check("clean-space",!s.playing,"Space pauses in Clean (focus on a hidden control would press it instead)",{playing:s.playing,focus:s.focus,focusVisible:s.focusVisible});
  await c.step(p,"Space again (play)",q=>H.key(q," "));
  await c.step(p,"key 1 (Study) during Play; 60 frames",async q=>{ await H.key(q,"1"); await H.frames(q,60); });
  s=c.last().s; c.check("study-back",s.playing&&s.presentation==="study"&&s.panels.railVisible,"Study again during Play: playing, the rail shown",{playing:s.playing,rail:s.panels.railVisible,dispatch:s.panels.dispatchVisible});
  /* the paper map during Play */
  await c.step(p,"key M (paper map) during Play; 90 frames",async q=>{ await H.key(q,"m"); await H.frames(q,90); },{shot:"paper-playing"});
  s=c.last().s; c.check("paper-keeps-play",s.playing&&s.mode==="staff"&&s.cam&&s.cam.map,"the paper map during Play: still playing, the plan camera",{playing:s.playing,mode:s.mode,cam:s.cam,ml:s.ml});
  await c.step(p,"key M (landscape with counters) during Play; 120 frames",async q=>{ await H.key(q,"m"); await H.frames(q,120); });
  s=c.last().s; c.check("hybrid-follow",s.playing&&s.mode==="hybrid"&&!s.freeCam,"Landscape with counters during Play: playing, Follow on",{playing:s.playing,mode:s.mode,freeCam:s.freeCam,tween:s.tween});
  await c.step(p,"key M (landscape) during Play; 120 frames",async q=>{ await H.key(q,"m"); await H.frames(q,120); });
  s=c.last().s; c.check("land-follow",s.playing&&s.mode==="terrain"&&!s.freeCam&&!s.tween.cam,"the landscape again: playing, Follow on and following (no camera tween left)",{playing:s.playing,mode:s.mode,freeCam:s.freeCam,tween:s.tween});
  /* the relief during Play: the buttons are disabled by design (EXAG_MEASURED_MS > EXAG_SLOW_MS) */
  await c.step(p,"click Layers; read the relief buttons; click 1× true (disabled while playing)",async q=>{ await H.click(q,"#layersbtn"); const r=await H.ev(q,()=>[...document.querySelectorAll(".exag-btn")].map(b=>({x:b.dataset.x,disabled:b.disabled,title:b.title,pressed:b.getAttribute("aria-pressed")})));
    await H.click(q,'.exag-btn[data-x="1"]',{force:true}); return r; });
  s=c.last().s; c.check("relief-disabled-in-play",s.factor===4&&c.last().ret.every(b=>b.disabled),"while playing the relief buttons are disabled with a reason, and a click changes nothing",{factor:s.factor,buttons:c.last().ret});
  await c.step(p,"Esc (Layers closed); click Pause; click Layers; click 1× true; Esc; 30 frames",async q=>{ await H.esc(q); await H.click(q,"#play"); await H.click(q,"#layersbtn"); await H.click(q,'.exag-btn[data-x="1"]'); await H.esc(q); await H.frames(q,30); });
  s=c.last().s; const fe1=await H.ev(p,()=>{ const e=AUSTERLITZ_DEBUG.figureError(); return {worst:e.worst,where:e.where,violations:CAM.violations}; });
  c.check("relief-1x",s.factor===1&&!s.playing&&fe1.violations===0,"paused: 1× applied, the camera never under the ground",{factor:s.factor,figureError:fe1});
  await c.step(p,"click Play at 1×; 120 frames (Follow at true scale)",async q=>{ await H.click(q,"#play"); await H.frames(q,120); },{shot:"1x-playing"});
  s=c.last().s; c.check("1x-follow",s.playing&&!s.freeCam&&!s.tween.cam,"at 1× Play follows",{playing:s.playing,freeCam:s.freeCam,tween:s.tween,cam:s.cam});
  /* the relief changed during a glide (S-7, fixed in 8H): Pause, a vantage, then the relief mid-glide, then Play: Follow takes up */
  await c.step(p,"click Pause; click the Zuran vantage; 10 frames (mid-glide); Layers; 10.33×; Esc",async q=>{ await H.click(q,"#play"); await H.click(q,'.van-btn[data-v="zuran"]'); await H.frames(q,10);
    const mid=await H.ev(q,()=>({tween:!!tween,cam:!!_tw.cam})); await H.click(q,"#layersbtn"); const xs=await H.ev(q,()=>DISPLAY.settings.slice()); const top=xs[xs.length-1]; await H.click(q,'.exag-btn[data-x="'+top+'"]'); await H.esc(q); return {mid,top}; });
  s=c.last().s; c.check("relief-mid-glide",!s.tween.any&&!s.tween.cam,"a relief change mid-glide stops the glide and both tween slots",{ret:c.last().ret,tween:s.tween,factor:s.factor,vantage:s.curVantage});
  await c.step(p,"click Play; 90 frames",async q=>{ await H.click(q,"#play"); await H.frames(q,90); });
  s=c.last().s; c.check("follow-after-relief",s.playing&&!s.freeCam&&!s.tween.cam,"Play after it: Follow takes up (S-7)",{playing:s.playing,freeCam:s.freeCam,tween:s.tween,cam:s.cam});
  /* rapid presentation switches during Play: 1 2 3 1 3 2 1 2 3 1 in a row, then state */
  await c.step(p,"keys 2 3 1 3 2 1 2 3 2 1 in a row during Play; 30 frames",async q=>{ for(const k of ["2","3","1","3","2","1","2","3","2","1"]) await H.key(q,k); await H.frames(q,30); },{shot:"after-rapid-switches"});
  s=c.last().s; c.check("rapid-switches",s.playing&&s.presentation==="study"&&s.panels.railVisible&&!s.panels.railInert&&s.focusVisible!==false,"after ten switches ending on Study: playing, the rail shown and not inert, focus on a visible control",{playing:s.playing,presentation:s.presentation,rail:s.panels,focus:s.focus,focusVisible:s.focusVisible,toast:s.toast});
  c.out.listeners=await I.counts(p);
});
