#!/usr/bin/env node
/* Final audit after Stage 8, area a11y: the map layer's keyboard stops, focused by REAL Tab presses, read once immediately (as kbd.js read
   them, 120 ms after the key) and again after the app has drawn frames (rAF x3, then a further 1.5 s). kbd.js found five place names focused
   at opacity 0 at the layer's origin 120 ms after their Tab on a loaded machine (software WebGL: frames take seconds); this separates "never
   drawn" (A-2 returned) from "drawn at the next frame". Harness page, 1600 x 900, 04:00, the Overview after the card's Esc.
   node tools/audit-post8/a11y/mapfocus.js */
"use strict";
const L=require("./alib.js");
L.run("mapfocus",async(b,R,log)=>{
  const p=await L.openV(b,[1600,900],{harness:true});
  await L.wait(1500);
  await p.keyboard.press("Escape"); await L.wait(1500);
  const read=()=>L.P(p,()=>{ const e=document.activeElement; if(!e||!e.closest||!e.closest("#maplayer")||e.id==="maplayer") return null;
    const r=e.getBoundingClientRect(), cs=getComputedStyle(e); return {name:(e.getAttribute("aria-label")||"").slice(0,50),box:[r.left,r.top,r.width,r.height].map(Math.round),opacity:+cs.opacity,display:cs.display,forced:e.classList.contains("ml-forced"),cover:__a11y.covered(e)}; });
  const frames=n=>L.P(p,k=>new Promise(r=>{ let i=0; (function f(){ if(++i>=k) r(i); else requestAnimationFrame(f); })(); }),n);
  const rows=[];
  for(let i=0;i<40;i++){
    await p.keyboard.press("Tab");
    await L.wait(120);
    const a=await read();
    const inLayer=await L.P(p,()=>!!(document.activeElement&&document.activeElement.closest&&document.activeElement.closest("#maplayer")));
    if(!inLayer&&rows.length) break;
    if(!a) continue;
    await frames(3); await L.wait(1500);
    const c=await read();
    rows.push({at120ms:a,afterFrames:c});
  }
  const never=rows.filter(r=>r.afterFrames&&(r.afterFrames.opacity<0.5||(r.afterFrames.box[0]===0&&r.afterFrames.box[1]===0)));
  R.step("map layer stops: at 120 ms and after frames",{n:rows.length,invisibleAt120:rows.filter(r=>r.at120ms.opacity<0.5).length,invisibleAfterFrames:never.length,rows});
  await R.shot(p,"last-map-stop");
  /* the Layers panel by keyboard: focus its button (set-up by script), Enter (real key), then Tab x7 (real keys): where is the open panel in the order */
  await L.P(p,()=>document.getElementById("layersbtn").focus());
  await p.keyboard.press("Enter"); await L.wait(800);
  const open=await L.P(p,()=>({hidden:document.getElementById("layerpop").hidden,expanded:document.getElementById("layersbtn").getAttribute("aria-expanded"),focus:__a11y.fi().el}));
  const seq=[]; for(let i=0;i<7;i++){ await p.keyboard.press("Tab"); await L.wait(150); seq.push(await L.P(p,()=>{ const f=__a11y.fi(); return f.el+" '"+(f.text||"").slice(0,30)+"'"+(document.activeElement&&document.activeElement.closest("#layerpop")?" [IN THE PANEL]":""); })); }
  await R.shot(p,"layers-open");
  R.step("Layers by keyboard: Enter on its button (focused by script), then Tab x7",{open,seq});
  await p.keyboard.press("Escape"); await L.wait(600);
  /* the ring of a ".t" button (transition: all .18s): focus the tour button by script, Tab (real) to Layers, read the ring at 120 ms and at 1.2 s */
  await L.P(p,()=>document.getElementById("tourbtn").focus()); await p.keyboard.press("Tab");
  await L.wait(120); const r1=await L.P(p,()=>{ const c=getComputedStyle(document.activeElement); return document.activeElement.id+" "+c.outlineStyle+" "+c.outlineWidth+" "+c.outlineColor+" transition "+c.transitionProperty+" "+c.transitionDuration; });
  await L.wait(1100); const r2=await L.P(p,()=>{ const c=getComputedStyle(document.activeElement); return document.activeElement.id+" "+c.outlineStyle+" "+c.outlineWidth+" "+c.outlineColor; });
  const fb=await L.P(p,()=>{ const r=document.activeElement.getBoundingClientRect(); return {x:Math.max(0,r.left-8),y:Math.max(0,r.top-8),width:r.width+16,height:r.height+16}; });
  await R.clip(p,"ring-layersbtn",fb);
  R.step("a .t button's ring after a real Tab: at 120 ms and at 1.2 s",{at120:r1,at1200:r2});
  /* the legend's toggle twice by Enter, frames drawn between */
  await L.P(p,()=>document.getElementById("lg-toggle").focus());
  const lg=[]; for(let i=0;i<2;i++){ await p.keyboard.press("Enter"); await frames(3); await L.wait(1200); lg.push(await L.P(p,()=>({expanded:document.getElementById("lg-toggle").getAttribute("aria-expanded"),name:document.getElementById("lg-toggle").innerText.replace(/\s+/g," ").trim(),cls:document.querySelector(".legend").className,open:ML.legendOpen}))); }
  R.step("the legend's toggle (focused by script): Enter, frames, Enter, frames (real keys)",{lg});
  /* keyboard scrolling of the two sheets: the sources sheet by a real click on its button, Tab to its text (real), PageDown, then End, each
     polled for 6 s; the "?" overlay likewise (real "?" key) */
  const sheetScroll=async(name)=>{ const out=[]; for(const k of ["PageDown","ArrowDown","Space","End"]){ const before=await L.P(p,n=>{ const s=document.querySelector(n); return s.scrollTop; },name);
      await p.keyboard.press(k); let after=before; for(let i=0;i<20&&after===before;i++){ await L.wait(300); after=await L.P(p,n=>document.querySelector(n).scrollTop,name); }
      out.push({key:k,before,after,focus:(await L.P(p,()=>__a11y.fi())).el}); } return out; };
  await L.P(p,()=>{ select(null,null); }); await L.wait(500);
  const sb=await L.center(p,"#srcbtn"); await p.mouse.click(sb.x,sb.y); await L.wait(1500);
  await p.keyboard.press("Tab"); await L.wait(400);
  const geo=await L.P(p,()=>{ const s=document.querySelector("#modal .sheet"); return {sheetSH:s.scrollHeight,sheetCH:s.clientHeight,oy:getComputedStyle(s).overflowY,focus:__a11y.fi().el}; });
  const srcRes=await sheetScroll("#modal .sheet");
  /* the same with the focus on the scrolling sheet itself (as a click on its text gives it: tabindex -1), set by script */
  await L.P(p,()=>{ const s=document.querySelector("#modal .sheet"); s.scrollTop=0; s.focus(); });
  const srcRes2=await sheetScroll("#modal .sheet");
  /* a wheel over the text, for comparison (real mouse) */
  await L.P(p,()=>{ document.querySelector("#modal .sheet").scrollTop=0; });
  await p.mouse.move(800,450); await p.mouse.wheel(0,600); await L.wait(1200);
  const wheel=await L.P(p,()=>document.querySelector("#modal .sheet").scrollTop);
  R.step("sources sheet: keyboard scrolling (real keys; focus on its text region by Tab, then on the sheet itself by script); a wheel for comparison",{geo,regionFocused:srcRes,sheetFocused:srcRes2,wheelScrollTop:wheel});
  await p.keyboard.press("Escape"); await L.wait(800);
  await L.P(p,()=>{ const e=document.activeElement; if(e&&e.blur) e.blur(); });
  await p.keyboard.press("?"); await L.wait(1200);
  await p.keyboard.press("Tab"); await p.keyboard.press("Tab"); await L.wait(400);
  const hgeo=await L.P(p,()=>{ const s=document.querySelector("#help .sheet"); return {sheetSH:s.scrollHeight,sheetCH:s.clientHeight,oy:getComputedStyle(s).overflowY,focus:__a11y.fi().el}; });
  const helpRes=await sheetScroll("#help .sheet");
  R.step("the ? overlay: keyboard scrolling with focus on its list region (two real Tabs)",{geo:hgeo,res:helpRes});
  await p.keyboard.press("Escape"); await L.wait(800);
  /* a formation's map item by Tab and Enter: where focus goes */
  const lab=await L.P(p,()=>{ const e=[...document.querySelectorAll("#maplayer .ml-item[role=button]")].find(x=>/position grade/.test(x.getAttribute("aria-label")||"")&&parseFloat(getComputedStyle(x).opacity)>0.5); if(!e) return null; e.focus(); return e.getAttribute("aria-label"); });
  if(lab){ await p.keyboard.press("Enter"); await L.wait(1500);
    R.step("a formation's map item (focused by script), Enter (real key): the dossier and the focus",{item:lab,fi:await L.P(p,()=>__a11y.fi()),sel:await L.P(p,()=>selection&&selection.kind+":"+selection.id),drawer:await L.P(p,()=>document.getElementById("drawer").classList.contains("on"))}); }
});
