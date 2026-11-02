#!/usr/bin/env node
/* Scenario 7: the window resized while panels are open (the dossier, the sources sheet, the "?" overlay, the Layers panel, the phase's message),
   1600 -> 1024 -> 700 -> 390 wide at 900 high and back; and a phone turned (390 x 844 <-> 844 x 390) with its Menu, its dispatch sheet and a
   dossier open. Real input; the resize by page.setViewportSize (the browser's own resize event). Frames by the frame driver (ilib.js). */
"use strict";
const {run,H,I}=require("./irun.js");
const BOXES=()=>{ const sel={rail:".rail",dispatch:".dispatch",drawer:"#drawer",modal:"#modal .modal-card",help:"#help .help-card",layerpop:"#layerpop",tools:"#tools",timebar:".timebar",toast:"#toast",tourbar:"#tourbar",menu:"#menubtn",legend:".legend",selchip:"#selchip"};
  const o={}; for(const k in sel){ const e=document.querySelector(sel[k]); if(!e){ o[k]=null; continue; } let vis=true; for(let p=e;p;p=p.parentElement){ const c=getComputedStyle(p); if(c.display==="none"||c.visibility==="hidden"||p.hidden||+c.opacity===0) vis=false; }
    if(k==="rail"&&document.body.classList.contains("rail-hidden")) vis=false; if(k==="drawer"&&!e.classList.contains("on")) vis=false; if(k==="toast"&&!e.classList.contains("on")) vis=false;
    const r=e.getBoundingClientRect(); o[k]=vis&&r.width>0&&r.height>0?[Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]:null; }
  const out=[]; const W=innerWidth, H=innerHeight; for(const k in o){ const b=o[k]; if(b&&(b[0]<-1||b[1]<-1||b[2]>W+1||b[3]>H+1)) out.push(k); }
  return {boxes:o, offscreen:out, vw:[W,H]}; };
const ov=(a,b)=>a&&b&&a[0]<b[2]-1&&b[0]<a[2]-1&&a[1]<b[3]-1&&b[1]<a[3]-1;
function overlaps(B,pairs){ return pairs.filter(([a,b])=>ov(B[a],B[b])).map(x=>x.join("/")); }
run("s7-resize-rotate",{viewports:[[1600,900],[1024,900],[700,900],[390,900],"phone 390x844<->844x390"],page:"visitor"},async c=>{
  const p=await c.page("desk",[1600,900],{});
  await c.step(p,"Esc closes the first-run card; 2 frames",async q=>{ await H.esc(q); await H.frames(q,2); });
  /* the dossier open (a formation's name clicked), then the phase's message (PageDown on the rail), then resize */
  const pos=await H.ev(p,()=>{ const k=Object.keys(ML.items).find(k=>k.startsWith("n:")&&ML.items[k].on&&ML.items[k].rect&&ML.items[k].pick); if(!k) return null; const it=ML.items[k]; return {k,x:(it.rect[0]+it.rect[2])/2,y:(it.rect[1]+it.rect[3])/2}; });
  if(pos) await c.step(p,"click a formation's name (its card opens)",q=>q.mouse.click(pos.x,pos.y));
  const W=[1600,1024,700,390,1024,1600];
  const pairs=[["drawer","timebar"],["drawer","dispatch"],["rail","dispatch"],["drawer","tools"],["toast","tools"],["toast","timebar"],["toast","drawer"],["layerpop","drawer"],["selchip","drawer"],["legend","drawer"]];
  for(const w of W){
    await c.step(p,"set up focus on the rail; PageDown (the phase's message); resize to "+w+" x 900; 10 frames",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"PageDown"); await q.setViewportSize({width:w,height:900}); await H.frames(q,10); await q.waitForTimeout(400); return q.evaluate(BOXES); },{shot:(w===1024||w===390)?"dossier-"+w+"-a":undefined});
    const s=c.last().s, B=c.last().ret, ol=overlaps(B.boxes,pairs);
    c.check("dossier-at-"+w,B.offscreen.length===0&&ol.length===0&&s.drawer.on&&s.focusVisible!==false,"at "+w+" px: the card open, nothing off screen, no panel over another, focus visible",{offscreen:B.offscreen,overlaps:ol,drawer:s.drawer,focus:s.focus,focusVisible:s.focusVisible,phone:s.phone,toast:s.toast,boxes:B.boxes});
  }
  /* the sources sheet open across the widths */
  await c.step(p,"click 'Accuracy and sources' (the card's 'How this is sourced' or the rail's)",async q=>{ const has=await H.ev(q,()=>{ const b=[...document.querySelectorAll("#drawer-body button")].find(x=>/sourced/i.test(x.textContent)); if(b){ b.dataset.iaS="1"; return true; } return false; }); if(has) await H.click(q,'#drawer-body button[data-ia-s="1"]'); else await H.click(q,"#srcbtn"); });
  for(const w of [1024,700,390,1600]){
    await c.step(p,"resize to "+w+" x 900 with the sources sheet open; 5 frames",async q=>{ await q.setViewportSize({width:w,height:900}); await H.frames(q,5); await q.waitForTimeout(300); return q.evaluate(BOXES); },{shot:w===390?"sources-390":undefined});
    const s=c.last().s, B=c.last().ret;
    c.check("sources-at-"+w,s.panels.modal&&!B.offscreen.includes("modal")&&s.focusVisible!==false,"at "+w+" px: the sheet open and inside the window, focus inside it and visible",{modal:s.panels.modal,box:B.boxes.modal,offscreen:B.offscreen,focus:s.focus,focusVisible:s.focusVisible,inert:s.inertKids.length});
  }
  await c.step(p,"Esc (sheet closed); key ? (overlay open)",async q=>{ await H.esc(q); await H.key(q,"?"); });
  for(const w of [700,390,1600]){
    await c.step(p,"resize to "+w+" x 900 with the ? overlay open",async q=>{ await q.setViewportSize({width:w,height:900}); await H.frames(q,5); await q.waitForTimeout(300); return q.evaluate(BOXES); });
    const s=c.last().s, B=c.last().ret;
    c.check("help-at-"+w,s.panels.help&&!B.offscreen.includes("help")&&s.focusVisible!==false,"at "+w+" px: the overlay inside the window, focus inside",{help:s.panels.help,box:B.boxes.help,focus:s.focus,focusVisible:s.focusVisible});
  }
  await c.step(p,"Esc (overlay closed); Esc (card closed); click Layers",async q=>{ await H.esc(q); await H.esc(q); await H.click(q,"#layersbtn"); });
  for(const w of [1024,700,390,1600]){
    await c.step(p,"resize to "+w+" x 900 with the Layers panel open",async q=>{ await q.setViewportSize({width:w,height:900}); await H.frames(q,5); await q.waitForTimeout(300); return q.evaluate(BOXES); },{shot:w===700?"layers-700":undefined});
    const s=c.last().s, B=c.last().ret;
    c.check("layers-at-"+w,(s.panels.layers?!B.offscreen.includes("layerpop"):true)&&s.focusVisible!==false,"at "+w+" px: the Layers panel inside the window if still open; focus visible",{layers:s.panels.layers,box:B.boxes.layerpop,offscreen:B.offscreen,focus:s.focus,focusVisible:s.focusVisible,phone:s.phone});
  }
  await c.step(p,"Esc",H.esc);
  /* a phone turned with its panels open */
  const f=await c.page("phone",[390,844],{});
  await c.step(f,"phone: tap the card's 'Explore on my own'",async q=>{ await I.tapEl(q,"#fr-close"); await H.frames(q,2); });
  await c.step(f,"tap the Menu",q=>I.tapEl(q,"#menubtn"));
  let s=c.last().s; c.check("phone-menu",s.phone&&s.phone.menu,"the Menu open",s.phone);
  await c.step(f,"turn the phone (844 x 390)",async q=>{ await q.setViewportSize({width:844,height:390}); await H.frames(q,5); await q.waitForTimeout(400); return q.evaluate(BOXES); },{shot:"phone-turned-menu"});
  s=c.last().s; let B=c.last().ret; c.check("phone-turn-menu",!s.phone.on&&!s.phone.menu&&B.offscreen.length===0&&s.focusVisible!==false,"turned: the landscape layout, the Menu closed, nothing off screen, focus visible",{phone:s.phone,offscreen:B.offscreen,focus:s.focus,focusVisible:s.focusVisible});
  await c.step(f,"turn back (390 x 844)",async q=>{ await q.setViewportSize({width:390,height:844}); await H.frames(q,5); await q.waitForTimeout(400); return q.evaluate(BOXES); });
  s=c.last().s; B=c.last().ret; c.check("phone-turn-back",s.phone.on&&B.offscreen.length===0,"turned back: the phone layout",{phone:s.phone,offscreen:B.offscreen,focus:s.focus});
  await c.step(f,"tap the dispatch sheet's grip (open)",q=>I.tapEl(q,"#dgrip"));
  await c.step(f,"turn (844 x 390) and back (390 x 844) with the dispatch sheet open",async q=>{ await q.setViewportSize({width:844,height:390}); await H.frames(q,5); await q.waitForTimeout(300); const a=await q.evaluate(BOXES); const sa=await I.snap(q); await q.setViewportSize({width:390,height:844}); await H.frames(q,5); await q.waitForTimeout(300); return {a,sa:{phone:sa.phone,focus:sa.focus,focusVisible:sa.focusVisible},b:await q.evaluate(BOXES)}; });
  s=c.last().s; r=c.last().ret; c.check("phone-sheet-turn",r.a.offscreen.length===0&&r.b.offscreen.length===0,"the dispatch sheet across a turn: nothing off screen",{landscape:r.sa,back:s.phone,offA:r.a.offscreen,offB:r.b.offscreen});
  /* a dossier on the phone, then a turn */
  const fpos=await H.ev(f,()=>{ const k=Object.keys(ML.items).find(k=>(k.startsWith("n:")||k.startsWith("c:"))&&ML.items[k].on&&ML.items[k].rect&&ML.items[k].pick); if(!k) return null; const it=ML.items[k]; return {k,x:(it.rect[0]+it.rect[2])/2,y:(it.rect[1]+it.rect[3])/2}; });
  if(fpos){
    await c.step(f,"tap a formation on the map (its sheet opens)",async q=>{ if(await H.ev(q,()=>dsheetOpen())) await I.tapEl(q,"#dgrip"); await q.touchscreen.tap(fpos.x,fpos.y); await H.frames(q,3); });
    await c.step(f,"turn (844 x 390) with the dossier open; then back",async q=>{ await q.setViewportSize({width:844,height:390}); await H.frames(q,5); await q.waitForTimeout(300); const a=await q.evaluate(BOXES); const sa=await I.snap(q); await q.setViewportSize({width:390,height:844}); await H.frames(q,5); await q.waitForTimeout(300); return {a,sa:{drawer:sa.drawer,focus:sa.focus,focusVisible:sa.focusVisible,sel:sa.selection},b:await q.evaluate(BOXES)}; },{shot:"phone-dossier-back"});
    s=c.last().s; r=c.last().ret; c.check("phone-dossier-turn",r.sa.drawer.on&&s.drawer.on&&r.a.offscreen.length===0&&r.b.offscreen.length===0,"the dossier across a turn: kept, inside the window",{landscape:r.sa,back:{drawer:s.drawer,sel:s.selection},offA:r.a.offscreen,offB:r.b.offscreen});
  }
  c.out.listeners=await I.counts(f);
});
var r;
