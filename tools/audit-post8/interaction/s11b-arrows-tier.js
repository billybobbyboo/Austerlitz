#!/usr/bin/env node
/* Scenario 11b (second session): two parts of scenario 11 whose first run did not measure what they meant to: (1) the Movement layer off, then a
   phase change by PageDown (scenario 11 pressed PageDown with the focus no longer on the time rail, so the phase never changed); (2) a desktop
   page opened in a small window on a density-2 screen and enlarged (scenario 11 read the state before the app's resize handler had run: its
   drawing buffer was still 880 x 660). A visitor's page; real clicks and keys; frames by the frame driver (ilib.js); the resize waited for the
   app's own handler (onResize sets the camera's aspect) with real frames. */
"use strict";
const {run,H,I}=require("./irun.js");
const OVOP=()=>({old:oldMats.length?+Math.max.apply(null,oldMats.map(m=>m.opacity)).toFixed(3):null, cur:overlayMats.length?+Math.max.apply(null,overlayMats.map(m=>m.opacity)).toFixed(3):null,
  oldN:oldMats.length, curN:overlayMats.length, oldVisible:!!(oldOv&&oldOv.visible), fadeOut:+ovFadeOut.toFixed(3), fadeIn:+ovFadeIn.toFixed(3), phase:curPhase, clock:+clock.toFixed(2), arrowsLayer:layerOn.arrows});
async function resizeTo(q,w,h){ await q.setViewportSize({width:w,height:h}); const t0=Date.now(); let ok=false;
  while(Date.now()-t0<20000){ await I.domSettle(q,100); ok=await q.evaluate(([w,h])=>innerWidth===w&&innerHeight===h&&Math.abs(landCam.aspect-w/h)<1e-6,[w,h]); if(ok) break; }
  await H.frames(q,10); await I.domSettle(q,300); return {handled:ok,ms:Date.now()-t0}; }
run("s11b-arrows-tier",{pages:["visitor 1280x720","retina laptop 880x660 -> 1600x900"]},async c=>{
  const p=await c.page("desk",[1280,720],{});
  await c.step(p,"Esc closes the first-run card; set up focus on the rail; PageDown (07:00); PageDown (08:00); frames until no tween",async q=>{ await H.esc(q); await H.focus(q,"#timerail"); await H.key(q,"PageDown"); await H.until(q,"!tween",400); await H.key(q,"PageDown"); await H.until(q,"!tween",400); await H.frames(q,5); return H.ev(q,OVOP); });
  await c.step(p,"click Layers; click 'Movement' (off); Esc; 5 frames",async q=>{ await H.click(q,"#layersbtn"); await H.click(q,'.layer-btn[data-l="arrows"]'); await H.esc(q); await H.frames(q,5); return H.ev(q,OVOP); },{draw:"arrows-off-0800"});
  const off0=c.last().ret;
  await c.step(p,"set up focus on the rail (a visitor Tabs back to it); PageDown (08:45) with the Movement layer off; 1 frame",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"PageDown"); await H.frames(q,1); return H.ev(q,OVOP); },{draw:"arrows-off-pagedown-0845"});
  const off1=c.last().ret; const tr=[]; for(let i=0;i<40;i++){ await H.frames(p,1); tr.push(await H.ev(p,OVOP)); }
  c.out.arrowsOff={before:off0,first:off1,trace:tr.filter((x,i)=>i%4===0)};
  c.check("arrows-off-stay-off",off1.phase===off0.phase+1&&off0.cur===0&&!(off1.old>0)&&tr.every(x=>!(x.old>0)),"with the Movement layer off, a phase change draws no arrow: the outgoing phase's included",{before:off0,first:off1,maxOld:Math.max.apply(null,tr.map(x=>x.old||0)),framesAbove0_1:tr.filter(x=>x.old>0.1).length});
  await c.step(p,"click Layers; 'Movement' on; Esc",async q=>{ await H.click(q,"#layersbtn"); await H.click(q,'.layer-btn[data-l="arrows"]'); await H.esc(q); });
  await p.context().close();
  const q3=await c.page("desk-small",[880,660],{dpr:2});
  const TIER=()=>({lowTier, pixelRatio:renderer.getPixelRatio(), castShadow:sun.castShadow, dpr:window.devicePixelRatio, vw:[innerWidth,innerHeight], drawBuffer:[renderer.domElement.width,renderer.domElement.height], aspect:+landCam.aspect.toFixed(4)});
  await c.step(q3,"Esc closes the first-run card",H.esc);
  const t0=await H.ev(q3,TIER);
  await c.step(q3,"resize the window to 1600 x 900 (the browser's resize event; the app's handler waited for)",async q=>{ const r=await resizeTo(q,1600,900); return {r,tier:await H.ev(q,TIER)}; });
  const t1=c.last().ret; c.out.tier={small:t0,enlarged:t1};
  c.check("tier-follows-window",t1.r.handled&&t1.tier.lowTier===false&&t1.tier.pixelRatio===2&&t1.tier.castShadow===true,"enlarged to 1600 x 900 on a density-2 screen: the full tier (pixel ratio 2, the sun's shadow), as a page opened at that size has",{small:t0,enlarged:t1});
  const q4=await c.page("desk-large",[1600,900],{dpr:2});
  await c.step(q4,"control: a page opened at 1600 x 900 on a density-2 screen; Esc",H.esc);
  c.out.tier.openedLarge=await H.ev(q4,TIER);
});
