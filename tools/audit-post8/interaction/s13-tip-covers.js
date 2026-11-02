#!/usr/bin/env node
/* Scenario 13 (second session): found by scenario 5's first run of path F, where a click on Play was refused because the timeline's tooltip
   (#tltip) stood over the Play button: the pointer, left on an event marker by an earlier drag, kept the marker's tip shown. Here, by real mouse
   movement at 1280 x 720 and 1600 x 900 on a visitor's page: a marker hovered, its tip's box against the timebar's controls, then the pointer
   moved straight up from the marker to Play in small steps and pressed there (a visitor reaching for Play): does Play toggle? And the control:
   the pointer taken to empty ground first. Frames by the frame driver (ilib.js); the tip is the page's own DOM (shown at once, hidden 150 ms
   after the pointer leaves unless it is over the tip, WCAG 1.4.13: app.js tipShow/tipHide/bindTimeTips). */
"use strict";
const {run,H,I}=require("./irun.js");
const TIPBOX=()=>{ const t=document.getElementById("tltip"); if(t.hidden) return {shown:false};
  const r=t.getBoundingClientRect(), box=[r.left,r.top,r.right,r.bottom].map(Math.round);
  const ctl=[...document.querySelectorAll(".timebar button, #play, #follow")].filter(b=>{ const q=b.getBoundingClientRect(); if(!(q.width>0&&q.height>0)) return false; for(let e=b;e;e=e.parentElement){ const cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden") return false; }
    return q.left<r.right-1&&r.left<q.right-1&&q.top<r.bottom-1&&r.top<q.bottom-1; });
  const covered=ctl.filter(b=>{ const q=b.getBoundingClientRect(), h=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2); return h===t||t.contains(h); }).map(b=>b.id||b.textContent.trim().slice(0,14));
  return {shown:true,text:t.textContent.slice(0,90),box,overlapping:[...new Set(ctl.map(b=>b.id||b.textContent.trim().slice(0,14)))],centreCovered:[...new Set(covered)]}; };
async function scenario(c,p,label,markerIdx){
  const m=await H.ev(p,i=>{ const e=document.querySelectorAll("#evmarks .ev-mark")[i]; const r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,label:e.getAttribute("aria-label")}; },markerIdx);
  const pl=await H.ev(p,()=>{ const r=document.getElementById("play").getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; });
  await c.step(p,label+": the pointer from the map onto the event marker '"+m.label.slice(0,40)+"' (real mouse, 6 steps)",async q=>{ await q.mouse.move(m.x,m.y-200); await q.mouse.move(m.x,m.y,{steps:6}); await q.waitForTimeout(100); return H.ev(q,TIPBOX); });
  const tip=c.last().ret;
  await c.step(p,label+": the pointer from the marker to the Play button's centre (12 steps), then pressed and released there",async q=>{ const before=await H.ev(q,()=>playing); await q.mouse.move(pl.x,pl.y,{steps:12}); await q.waitForTimeout(60); const at=await H.ev(q,([x,y])=>{ const h=document.elementFromPoint(x,y); return h?(h.id||h.className):null; },[pl.x,pl.y]);
    await q.mouse.down(); await q.mouse.up(); await H.frames(q,2); const after=await H.ev(q,()=>playing); return {before,at,after,tipAfter:await H.ev(q,TIPBOX)}; });
  const r=c.last().ret;
  c.check("play-under-tip-"+label,r.after!==r.before,"a press on Play reached from a hovered marker toggles Play",{marker:m.label,tipWhileHovering:tip,underPointerAtPlay:r.at,playingBefore:r.before,playingAfter:r.after,tipAfter:r.tipAfter});
  await c.step(p,label+": control: the pointer to empty ground first (300 ms), then to Play and pressed",async q=>{ if(await H.ev(q,()=>playing)) { await H.setPlay(q,false); } await q.mouse.move(pl.x,pl.y-300,{steps:4}); await q.waitForTimeout(300); const before=await H.ev(q,()=>playing); await q.mouse.move(pl.x,pl.y,{steps:4}); await q.mouse.down(); await q.mouse.up(); await H.frames(q,2); const after=await H.ev(q,()=>playing); await H.setPlay(q,false); return {before,after}; });
  c.check("play-control-"+label,c.last().ret.after!==c.last().ret.before,"the same press after the pointer has left the timeline toggles Play",c.last().ret);
  return {tip,r};
}
run("s13-tip-covers",{viewports:[[1280,720],[1600,900]],page:"visitor"},async c=>{
  for(const vp of [[1280,720],[1600,900]]){
    const p=await c.page("desk",vp,{});
    await c.step(p,"Esc closes the first-run card; 2 frames",async q=>{ await H.esc(q); await H.frames(q,2); });
    /* the markers whose tips could reach the Play button: those within 400 px of it horizontally */
    const near=await H.ev(p,()=>{ const pr=document.getElementById("play").getBoundingClientRect(); return [...document.querySelectorAll("#evmarks .ev-mark")].map((e,i)=>({i,x:Math.round(e.getBoundingClientRect().left),label:e.getAttribute("aria-label").slice(0,50)})).filter(o=>Math.abs(o.x-(pr.left+pr.width/2))<400); });
    c.out["near"+vp[0]]=near;
    c.out["case"+vp[0]]=await scenario(c,p,String(vp[0]),near.length>2?near[2].i:near[0].i);
    await p.context().close();
  }
});
