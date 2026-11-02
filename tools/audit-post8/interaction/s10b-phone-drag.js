#!/usr/bin/env node
/* Scenario 10b (second session): scenario 10 found the camera moving on after a finger's pan during Play on a phone (Follow off, the finger
   lifted). Here the camera is traced frame by frame after a one-finger pan (CDP Input.dispatchTouchEvent: start, six moves, end, a frame of the
   app after each) on a phone page (390 x 844, density 3, touch, an iPhone's user agent): paused, then during Play, then during Play in Watch,
   with the clock, the phase, Follow, the tween slots and the view offset, to tell inertia, a tween, Follow or the view offset apart. Frames by
   the frame driver (ilib.js). */
"use strict";
const {run,H,I}=require("./irun.js");
const CAM=()=>{ const c=window.__aus.state().cam; return {pos:c.pos.map(v=>+v.toFixed(3)),tgt:c.tgt.map(v=>+v.toFixed(3)),clock:+clock.toFixed(2),phase:curPhase,freeCam,playing,tween:!!tween,twCam:!!_tw.cam,twScene:!!_tw.scene,vantage:curVantage,
  off:(typeof VIEWOFF!=="undefined"&&VIEWOFF)?JSON.stringify(VIEWOFF).slice(0,80):null}; };
run("s10b-phone-drag",{viewport:[390,844],page:"phone"},async c=>{
  const p=await c.page("phone",[390,844],{});
  const cdp=await p.context().newCDPSession(p);
  const pan=async (dx,dy)=>{ const fr=await H.ev(p,()=>{ const r=landFreeRect(); return [(r[0]+r[2])/2,(r[1]+r[3])/2]; }); const x=fr[0], y=fr[1];
    await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]}); for(let i=1;i<=6;i++){ await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+dx*i/6,y:y+dy*i/6}]}); await H.frames(p,1); }
    await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]}); };
  const trace=async n=>{ const r=[]; for(let i=0;i<n;i++){ await H.frames(p,1); if(i%5===0||i===n-1) r.push(Object.assign({f:i+1},await H.ev(p,CAM))); } return r; };
  await c.step(p,"tap 'Explore on my own'; 2 frames",async q=>{ await I.tapEl(q,"#fr-close"); await H.frames(q,2); });
  for(const [label,setup] of [["paused",async q=>{ await H.setPlay(q,false); }],["playing",async q=>{ await H.setPlay(q,true); await H.frames(q,30); }],["playing in Watch",async q=>{ await I.tapEl(q,"#menubtn"); await H.frames(q,3); await I.tapEl(q,'.vm-btn[data-vm="watch"]'); await H.frames(q,30); await H.setPlay(q,true); await H.frames(q,10); }]]){
    await c.step(p,label+": set up; the camera before",async q=>{ await setup(q); return H.ev(q,CAM); });
    const before=c.last().ret;
    await c.step(p,label+": a one-finger pan (60, 40 px); the camera at the lift and over 60 frames",async q=>{ await pan(60,40); const lift=await H.ev(q,CAM); return {lift,after:await trace(60)}; });
    const r=c.last().ret, last=r.after[r.after.length-1];
    const d=(a,b)=>Math.hypot(a.tgt[0]-b.tgt[0],a.tgt[2]-b.tgt[2]);
    c.out[label]={before,lift:r.lift,after:r.after};
    c.check("held-after-lift-"+label.replace(/ /g,"-"),d(r.lift,last)<1e-3,"after the finger lifts ("+label+"), the eye stays where it left it (Follow off)",{moved:+d(r.lift,last).toFixed(3),panned:+d(before,r.lift).toFixed(3),lift:r.lift,last});
    if(label==="paused") await c.step(p,"Play (by state) for the next case",q=>H.setPlay(q,true));
  }
  await c.step(p,"Pause (by state)",q=>H.setPlay(q,false));
});
