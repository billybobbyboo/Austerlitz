#!/usr/bin/env node
/* Scenario 6: panels opened and closed while the map is dragged or zoomed, and Follow while the visitor drags during Play. A visitor's page at
   1600 x 900; real mouse (page.mouse: press, moves with the button held, release, wheel) and real keys; frames by the frame driver (ilib.js).
   The camera's state after each step tells whether a drag is still held by the app. */
"use strict";
const {run,H,I}=require("./irun.js");
run("s6-panels-while-dragging",{viewport:[1600,900],page:"visitor"},async c=>{
  const p=await c.page("desk",[1600,900],{});
  const cen=async q=>H.ev(q,()=>{ const fr=landFreeRect(); return [Math.round((fr[0]+fr[2])/2),Math.round((fr[1]+fr[3])/2)]; });
  const cam=async q=>H.ev(q,()=>JSON.stringify(window.__aus.state().cam));
  await c.step(p,"Esc closes the first-run card; 2 frames",async q=>{ await H.esc(q); await H.frames(q,2); });
  const [x,y]=await cen(p);
  /* 1. "?" opened mid-drag */
  await c.step(p,"press on the map; move 60 px (button held); key ?; move 60 px; Esc; move 60 px; release; 5 frames",async q=>{
    const r={}; await q.mouse.move(x,y); await q.mouse.down(); for(let i=1;i<=4;i++) await q.mouse.move(x+15*i,y); await H.frames(q,1); r.c1=await cam(q);
    await H.key(q,"?"); r.help=await H.ev(q,()=>helpOpen()); for(let i=1;i<=4;i++) await q.mouse.move(x+60+15*i,y); await H.frames(q,1); r.c2=await cam(q);
    await H.esc(q); r.helpAfterEsc=await H.ev(q,()=>helpOpen()); for(let i=1;i<=4;i++) await q.mouse.move(x+120+15*i,y); await H.frames(q,1); r.c3=await cam(q);
    await q.mouse.up(); await H.frames(q,5); r.c4=await cam(q);
    for(let i=1;i<=4;i++) await q.mouse.move(x+180-30*i,y+10*i); await H.frames(q,2); r.c5=await cam(q); return r; });
  let r=c.last().ret, s=c.last().s;
  c.check("help-mid-drag",r.help&&r.c2===r.c1&&!r.helpAfterEsc&&r.c5===r.c4,"? mid-drag: the map does not move under the overlay; after release a move with no button pans nothing (no drag left held)",{helpOpened:r.help,movedUnderOverlay:r.c2!==r.c1,movedAfterEscHeld:r.c3!==r.c2,movedAfterRelease:r.c5!==r.c4,focus:s.focus});
  /* 2. the sources sheet and the wheel */
  await c.step(p,"click 'Accuracy and sources'; wheel x3 over the sheet's body and x3 over its scrim; Esc",async q=>{ await H.click(q,"#srcbtn"); const c0=await cam(q);
    const b=await H.ev(q,()=>{ const m=document.querySelector("#modal .modal-card")||document.getElementById("modal-body"); const r=m.getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2,r.left]; });
    await q.mouse.move(b[0],b[1]); for(let i=0;i<3;i++) await q.mouse.wheel(0,200); const sc=await H.ev(q,()=>{ const m=document.getElementById("modal-body"); return m?m.scrollTop:null; });
    await q.mouse.move(Math.max(5,b[2]-40),b[1]); for(let i=0;i<3;i++) await q.mouse.wheel(0,-200); await H.frames(q,3); const c1=await cam(q); const open=await H.ev(q,()=>document.getElementById("modal").classList.contains("on"));
    await H.esc(q); return {moved:c0!==c1,scrolled:sc,openDuringWheel:open}; });
  r=c.last().ret; c.check("sheet-wheel",!r.moved&&r.openDuringWheel,"the wheel over the sources sheet and its scrim does not zoom the map behind",r);
  /* 3. the dossier open, drag the map, wheel over the dossier, Esc mid-drag */
  const pos=await H.ev(p,()=>{ const k=Object.keys(ML.items).find(k=>k.startsWith("n:")&&ML.items[k].on&&ML.items[k].rect&&ML.items[k].pick); if(!k) return null; const it=ML.items[k]; return {k,x:(it.rect[0]+it.rect[2])/2,y:(it.rect[1]+it.rect[3])/2}; });
  c.note("a formation's name to click: "+JSON.stringify(pos));
  if(pos){
    await c.step(p,"click a formation's name (its card opens); drag the map 80 px with the card open",async q=>{ await q.mouse.click(pos.x,pos.y); await H.frames(q,3); const c0=await cam(q); await q.mouse.move(x,y+40); await q.mouse.down(); for(let i=1;i<=4;i++) await q.mouse.move(x-20*i,y+40); await q.mouse.up(); await H.frames(q,3); return {sel:await H.ev(q,()=>selection&&selection.id),moved:c0!==await cam(q)}; });
    r=c.last().ret; s=c.last().s; c.check("drag-with-card",!!r.sel&&r.moved&&s.drawer.on,"a drag with the card open pans and keeps the card",{ret:r,drawer:s.drawer});
    await c.step(p,"wheel x3 over the card",async q=>{ const b=await H.ev(q,()=>{ const r=document.getElementById("drawer").getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2]; }); const c0=await cam(q); await q.mouse.move(b[0],b[1]); for(let i=0;i<3;i++) await q.mouse.wheel(0,200); await H.frames(q,3); return {moved:c0!==await cam(q)}; });
    r=c.last().ret; c.check("wheel-over-card",!r.moved,"the wheel over the card does not zoom the map",r);
    await c.step(p,"press on the map; move 60 px; Esc (button held); move 60 px; release; move without a button",async q=>{ const o={}; await q.mouse.move(x,y); await q.mouse.down(); for(let i=1;i<=3;i++) await q.mouse.move(x+20*i,y); await H.esc(q); o.selAfterEsc=await H.ev(q,()=>selection); o.c1=await cam(q); for(let i=1;i<=3;i++) await q.mouse.move(x+60+20*i,y); await H.frames(q,1); o.c2=await cam(q); await q.mouse.up(); o.c3=await cam(q); for(let i=1;i<=3;i++) await q.mouse.move(x+120-20*i,y-10*i); await H.frames(q,1); o.c4=await cam(q); return o; });
    r=c.last().ret; c.check("esc-mid-drag",r.selAfterEsc===null&&r.c2!==r.c1&&r.c4===r.c3,"Esc mid-drag clears the selection; the drag goes on until the release; nothing after",{selAfterEsc:r.selAfterEsc,pannedAfterEsc:r.c2!==r.c1,movedAfterRelease:r.c4!==r.c3});
  }
  /* 4. Layers open, then a drag on the map */
  await c.step(p,"click Layers; drag the map 80 px; 3 frames",async q=>{ await H.click(q,"#layersbtn"); const c0=await cam(q); await q.mouse.move(x,y); await q.mouse.down(); for(let i=1;i<=4;i++) await q.mouse.move(x,y+20*i); await q.mouse.up(); await H.frames(q,3); return {moved:c0!==await cam(q)}; });
  s=c.last().s; c.check("layers-drag",c.last().ret.moved,"a drag pans with the Layers panel open",{ret:c.last().ret,layersOpen:s.panels.layers});
  c.out.layersAfterDrag=s.panels.layers;
  await c.step(p,"Esc",H.esc);
  /* 5. the legend opened, then the wheel over it and over the map */
  await c.step(p,"click the Key's head (legend open); wheel over the legend; wheel over the map",async q=>{ await H.click(q,"#lg-toggle"); await H.frames(q,2); const c0=await cam(q); const b=await H.ev(q,()=>{ const r=document.querySelector(".legend").getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2]; });
    await q.mouse.move(b[0],b[1]); for(let i=0;i<3;i++) await q.mouse.wheel(0,200); await H.frames(q,2); const c1=await cam(q); await q.mouse.move(x,y); for(let i=0;i<3;i++) await q.mouse.wheel(0,-200); await H.frames(q,2); const c2=await cam(q); return {legend:await H.ev(q,()=>ML.legendOpen),overLegend:c1!==c0,overMap:c2!==c1}; });
  r=c.last().ret; c.check("legend-wheel",r.legend&&!r.overLegend&&r.overMap,"with the legend open, the wheel over it zooms nothing and over the map zooms",r);
  await c.step(p,"click the Key's head (legend closed)",q=>H.click(q,"#lg-toggle"));
  /* 6. Follow while the visitor drags during Play */
  await c.step(p,"click Follow (on); click Play; 60 frames",async q=>{ if(await H.ev(q,()=>freeCam)) await H.click(q,"#follow"); await H.click(q,"#play"); await H.frames(q,60); });
  s=c.last().s; const camBefore=s.cam; c.check("follow-on-playing",s.playing&&!s.freeCam,"playing with Follow on",{freeCam:s.freeCam,playing:s.playing});
  await c.step(p,"drag the map 100 px during Play; release; 90 frames",async q=>{ await q.mouse.move(x,y); await q.mouse.down(); const a=await cam(q); for(let i=1;i<=5;i++){ await q.mouse.move(x+20*i,y-8*i); await H.frames(q,1); } await q.mouse.up(); const b=await cam(q); await H.frames(q,90); const d=await cam(q); return {a,b,d}; });
  s=c.last().s; r=c.last().ret;
  c.check("drag-turns-follow-off",s.playing&&s.freeCam&&s.followBtn==="false"&&r.b===r.d,"a drag during Play turns Follow off; the eye stays where the visitor left it while the clock plays on",{freeCam:s.freeCam,follow:s.followBtn,playing:s.playing,camMovedAfterRelease:r.b!==r.d});
  await c.step(p,"click Follow during Play; 120 frames",async q=>{ await H.click(q,"#follow"); await H.frames(q,120); });
  s=c.last().s; c.check("follow-again",s.playing&&!s.freeCam&&!s.tween.cam,"Follow pressed again: on, the glide done, following",{freeCam:s.freeCam,tween:s.tween,cam:s.cam});
  await c.step(p,"wheel during Play; 30 frames; click Pause",async q=>{ await q.mouse.move(x,y); await q.mouse.wheel(0,-200); await H.frames(q,30); await H.click(q,"#play"); });
  s=c.last().s; c.check("wheel-follow-off",s.freeCam&&!s.playing,"the wheel turns Follow off",{freeCam:s.freeCam});
  c.out.listeners=await I.counts(p);
});
