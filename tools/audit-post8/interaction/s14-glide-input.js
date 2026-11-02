#!/usr/bin/env node
/* Scenario 14 (second session): found by scenario 10 (the phone: a finger's pan just after a phase was chosen, the camera moving on after the
   finger lifted; scenario 10b: no movement when no glide runs). Hypothesis from app.js: a pan, a zoom or an orbit sets freeCam (LANDCAM.free,
   bindCanvas) but does not stop a camera glide running in the tween's camera slot (glide, startPhaseTransition: applyArc every frame), so the
   glide carries the camera on to its preset after the visitor's own move. Tested by real input on a visitor's page at 1280 x 720: a vantage's
   glide (flyTo, 1.5 s), a phase's glide (PageDown on the rail, 2.6 s) and a dossier's centring (an order of battle row), each interrupted 10
   frames in by a real drag, the wheel or the map's arrow keys; then 90 frames. Frames by the frame driver (ilib.js: the app's clock at 30 fps). */
"use strict";
const {run,H,I}=require("./irun.js");
const CAM=()=>{ const c=window.__aus.state().cam; return {pos:c.pos.map(v=>+v.toFixed(2)),tgt:c.tgt.map(v=>+v.toFixed(2)),freeCam,twCam:!!_tw.cam,vantage:curVantage}; };
const dist=(a,b)=>Math.hypot(a.tgt[0]-b.tgt[0],a.tgt[2]-b.tgt[2])+Math.hypot(a.pos[0]-b.pos[0],a.pos[1]-b.pos[1],a.pos[2]-b.pos[2]);
run("s14-glide-input",{viewport:[1280,720],page:"visitor"},async c=>{
  const p=await c.page("desk",[1280,720],{});
  const cen=async q=>H.ev(q,()=>{ const fr=landFreeRect(); return [Math.round((fr[0]+fr[2])/2),Math.round((fr[1]+fr[3])/2)]; });
  await c.step(p,"Esc closes the first-run card; 2 frames",async q=>{ await H.esc(q); await H.frames(q,2); });
  const [x,y]=await cen(p);
  const drag=async q=>{ await q.mouse.move(x,y); await q.mouse.down(); for(let i=1;i<=6;i++){ await q.mouse.move(x+25*i,y+8*i); await H.frames(q,1); } await q.mouse.up(); };
  const wheel=async q=>{ await q.mouse.move(x,y); for(let i=0;i<3;i++){ await q.mouse.wheel(0,-240); await H.frames(q,1); } };
  const keys=async q=>{ await H.ev(q,()=>{ const m=document.getElementById("maplayer")||renderer.domElement; const t=[...document.querySelectorAll("[tabindex]")].find(e=>/map/i.test(e.getAttribute("aria-label")||"")&&e.closest("#stage,#maplayer"))||m; t.focus(); return document.activeElement.id||document.activeElement.tagName; }); for(let i=0;i<5;i++){ await q.keyboard.press("ArrowLeft"); await H.frames(q,1); } };
  const cases=[
    ["vantage glide + drag", q=>H.click(q,'.van-btn[data-v="zuran"]'), drag],
    ["vantage glide + wheel", q=>H.click(q,'.van-btn[data-v="plateau"]'), wheel],
    ["phase glide (PageDown) + drag", async q=>{ await H.focus(q,"#timerail"); await H.key(q,"PageDown"); }, drag],
    ["dossier centring + drag", async q=>{ await H.click(q,"#tab-oob"); await H.click(q,'.oob-row[data-id="legrand"]'); }, drag],
    ["vantage glide + map arrow keys", q=>H.click(q,'.van-btn[data-v="allied"]'), keys]
  ];
  c.out.cases=[];
  for(const [label,start,input] of cases){
    await c.step(p,label+": frames until no tween; start the glide (real click or key); 10 frames",async q=>{ await H.esc(q); await H.until(q,"!tween",400); await H.frames(q,3); await start(q); await H.frames(q,10); return H.ev(q,CAM); });
    const mid=c.last().ret;
    await c.step(p,label+": the visitor's input mid-glide (real), then the camera at its end",async q=>{ await input(q); return H.ev(q,CAM); });
    const atRelease=c.last().ret;
    const after=[]; for(let i=0;i<9;i++){ await H.frames(p,10); after.push(await H.ev(p,CAM)); }
    const end=after[after.length-1], moved=dist(atRelease,end);
    c.out.cases.push({label,mid,atRelease,after:after.filter((x,i)=>i%2===0),end,movedAfterInput:+moved.toFixed(3)});
    c.check("held-"+label.replace(/[^a-z]+/gi,"-"),mid.twCam&&moved<0.05,"a "+label.split(" + ")[1]+" during a glide takes the camera: once the input ends the eye stays where the visitor left it (Follow off)",{glideRunningAtInput:mid.twCam,movedAfterInput:+moved.toFixed(3),atRelease,end,freeCamAtEnd:end.freeCam,glideSlotAtRelease:atRelease.twCam});
  }
});
