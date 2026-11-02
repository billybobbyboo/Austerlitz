#!/usr/bin/env node
/* Final audit after Stage 8, area visual-maps: two short clips of the map layer in motion, recorded frame by frame through the motion driver
   (tools/visual/motion.js inPage: the app's own loop at 30 frames a second on the driver's clock, the WebGL draw kept; the input reaches the
   canvas as a visitor's pointer events do; Play is the app's own togglePlay with Follow), every EVERY-th frame captured, encoded with
   tools/stage8/lib.js encode. node tools/audit-post8/visual-maps/clips.js <counters-pan|watch-play> [vp WxH]
   Writes docs/audit-post8-evidence/visual-maps/clips/<clip>.mp4 (+ .gif), a per-frame log <clip>.json (the clock, the layer's on/dropped/held
   counts and the drawn formation items each captured frame) and a contact sheet of every 6th captured frame. Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../lib.js");
const MO=require(path.join(A.ROOT,"tools","visual","motion.js"));
const AREA="visual-maps";
const CLIP=process.argv[2]||"counters-pan", VP=(process.argv[3]||"1600x900").split("x").map(Number);
const CLIPS={
  "counters-pan":{view:{t:570, presentation:"study", mode:"hybrid", cam:[-195,92,156,-33,4,-2]}, kind:"pan", n:60, amt:8, rest:30, every:6, fps:5,
    note:"Landscape with counters from the Field vantage at 09:30 (Study), a left-button drag of 8 px a frame for 60 frames (2 s at 30 fps), then 30 frames at rest; the layer logged every frame, every 6th frame captured (the clip at 5 fps = the visitor's speed)."},
  "watch-play":{view:{t:540, presentation:"watch", mode:"terrain", cam:[-195,92,156,-33,4,-2]}, kind:"play", from:540, amt:0.5, n:180, rest:12, every:12, fps:2.5,
    note:"Watch on the landscape from 09:00, Play at 1/2x with Follow on (the app's own togglePlay; freeCam off as the motion block's Play runs), 180 frames (6 s at 30 fps) then 12 at rest; the layer logged every frame, every 12th frame captured (the clip at 2.5 fps = the visitor's speed)."}
};
const SNAP=function(){ var on=0,dr=0,held=0,F=[]; for(var k in ML.items){ var it=ML.items[k]; if(it.eFrame!==ML.frame) continue;
    if(it.state==="on") on++; else if(it.state==="dropped") dr++; if(it.held) held++;
    if(/^[cfn]:/.test(k)&&it.state) F.push(k+"="+it.state+(it.held?"*":"")); }
  return {clock:clock, on:on, dropped:dr, held:held, playing:playing, items:F.sort()}; };
(async()=>{
  const C=CLIPS[CLIP]; if(!C) throw new Error("no clip "+CLIP);
  const out=path.join(A.EVID,AREA,"clips"); fs.mkdirSync(out,{recursive:true});
  const fdir=path.join(A.SCRATCH,AREA,"frames-"+CLIP); fs.rmSync(fdir,{recursive:true,force:true}); fs.mkdirSync(fdir,{recursive:true});
  const b=await A.launch(), t0=Date.now();
  const page=await A.open(b,VP);
  await page.keyboard.press("Escape");
  await page.evaluate(s=>window.__aus.apply(s),Object.assign({viewport:VP},C.view)); await A.settle(page);
  await page.evaluate(MO.inPage);
  console.log(CLIP,"page ready",((Date.now()-t0)/1000).toFixed(0),"s");
  let k=0, fr=0; const log=[], tiles=[];
  const snap=async()=>{ const s=await page.evaluate(SNAP); s.frame=fr; log.push(s); return s; };
  const shot=async()=>{ const f=path.join(fdir,"f"+String(k).padStart(5,"0")+".jpg"); await A.jpeg(page,f,80); const s=log[log.length-1]; s.captured=k; tiles.push({png:fs.readFileSync(f),cap:"#"+k+" (frame "+fr+") "+String(Math.floor(s.clock/60)).padStart(2,"0")+":"+String(Math.floor(s.clock%60)).padStart(2,"0")+" on "+s.on+" drop "+s.dropped+" held "+s.held}); k++; };
  await page.evaluate(a=>{ var D=window.__md; D.start({gl:true}); requestRender(2);
    if(a.kind==="play"){ stopPlay(); setClock(a.from,{instant:true,force:true,camera:false}); freeCam=false; curVantage=null; setSpeed(a.amt); requestRender(8); D.frame(8); togglePlay(); }
    else D.frame(8);
    var c=D.centre(); window.__rc={c:c,a:a}; if(a.kind==="pan") D.down(c[0],c[1],0); },C);
  await snap(); await shot();
  for(let i=1;i<=C.n+C.rest;i++){ fr=i;
    await page.evaluate(([i,n])=>{ var D=window.__md, R=window.__rc, a=R.a, c=R.c;
      if(i<=n&&a.kind==="pan") D.move(c[0]+a.amt*i,c[1],0);
      if(i===n+1){ if(a.kind==="pan") D.up(c[0]+a.amt*n,c[1],0); if(a.kind==="play") stopPlay(); }
      D.frame(); },[i,C.n]);
    await snap(); if(i%C.every===0) await shot();
    if(i%30===0) console.log(CLIP,"frame",i,"of",C.n+C.rest,((Date.now()-t0)/1000).toFixed(0),"s");
  }
  await page.evaluate(()=>window.__md.stop());
  const enc=A.encode(fdir,path.join(out,CLIP),C.fps,640);
  fs.writeFileSync(path.join(out,CLIP+".json"),JSON.stringify({clip:CLIP,viewport:VP,note:C.note,build:"md5 f10fe585c46aea576f436ed51ac46f83",page:"harness page (?harness=1), first-run card closed by Esc",view:C.view,
    driver:"tools/visual/motion.js inPage (30 fps driver clock, WebGL draw kept)",captured:k,frames:log,errors:A.errors(page)},null,1));
  for(let i=0;i<tiles.length;i+=12) await A.sheet(page,tiles.slice(i,i+12),3,640,Math.round(640*VP[1]/VP[0]),CLIP+" ("+VP.join("x")+") frames, sheet "+(i/12+1),path.join(out,CLIP+"-sheet-"+(i/12+1)+".jpg"));
  await b.close(); console.log(CLIP,"done",k,"frames",((Date.now()-t0)/1000).toFixed(0),"s",enc.mp4);
})().catch(e=>{ console.error("FAILED",e); process.exit(1); });
