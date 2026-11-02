#!/usr/bin/env node
/* Final audit after Stage 8, area a11y: a PHONE (390 x 844, density 3, touch, isMobile, an iPhone's user agent; desktop Chromium emulating
   it: not a real mobile browser) on a visitor's page, by real taps (page.touchscreen) and touch drags and a pinch (CDP Input.dispatchTouchEvent).
   The first screen; the opening begun and skipped; the screen to explore (targets, small text, cut text); the dispatch sheet's grip (tap,
   then a drag); a horizontal drag on the time rail; a vertical drag that starts on the timeline; a pinch with a finger on the timeline; the
   Menu; a formation tapped (its dossier) and "How this is sourced"; then held landscape (844 x 390): the same measures, the Menu, a dossier.
   node tools/audit-post8/a11y/phone.js */
"use strict";
const L=require("./alib.js");
L.run("phone",async(b,R,log)=>{
  const p=await L.openV(b,[390,844],{phone:true});
  const cdp=p._cdp;
  await L.wait(2500);
  const st=()=>L.A.state(p);
  const cam=()=>L.P(p,()=>({x:+landCam.position.x.toFixed(2),y:+landCam.position.y.toFixed(2),z:+landCam.position.z.toFixed(2),tx:+orbitTarget.x.toFixed(2),tz:+orbitTarget.z.toFixed(2),clock:clock,mode:mode,vv:window.visualViewport?+visualViewport.scale.toFixed(3):null,sy:scrollY,sx:scrollX}));
  const meas=async()=>({narr:await L.P(p,()=>__a11y.narr()),scroll:await L.P(p,()=>__a11y.scroll()),cut:await L.P(p,()=>__a11y.cut()),small:await L.P(p,()=>__a11y.small()),
    targets:await L.P(p,()=>{ const t=__a11y.targets(); return {n:t.n,fail:t.fail,failing:t.small.filter(x=>x.spacing!=="passes"),undersizedPassing:t.small.filter(x=>x.spacing==="passes").length}; }),panels:await L.P(p,()=>__a11y.panels())});
  const touch=async(type,pts)=>cdp.send("Input.dispatchTouchEvent",{type,touchPoints:pts.map((q,i)=>({x:q[0],y:q[1],id:i,radiusX:4,radiusY:4,force:1}))});
  const drag=async(x,y,dx,dy,n)=>{ await touch("touchStart",[[x,y]]); for(let i=1;i<=n;i++){ await touch("touchMove",[[x+dx*i/n,y+dy*i/n]]); await L.wait(40); } await touch("touchEnd",[]); };
  await R.shot(p,"01-first");
  R.step("first screen (the card)",Object.assign({boot:p._bootMs,state:await st(),card:await L.P(p,()=>__a11y.text("#firstrun")),fi:await L.P(p,()=>__a11y.fi())},await meas()));
  await L.tap(p,"#fr-tour"); await L.wait(3500);
  await R.shot(p,"02-opening-1");
  R.step("tap 'Begin (two min)': the opening, step 1",{bar:await L.P(p,()=>__a11y.text("#tourbar",900)),fi:await L.P(p,()=>__a11y.fi()),cut:await L.P(p,()=>__a11y.cut()),tourbar:await L.P(p,()=>{ const e=document.getElementById("tourbar"); const r=e.getBoundingClientRect(); const x=document.getElementById("tour-x"); return {box:[r.left,r.top,r.width,r.height].map(Math.round),xSH:x.scrollHeight,xCH:x.clientHeight,xOY:getComputedStyle(x).overflowY}; })});
  await L.tap(p,"#tour-exit"); await L.wait(3000);
  await R.shot(p,"03-explore");
  R.step("tap Skip: the screen to explore",Object.assign({state:await st(),dsheetHead:await L.P(p,()=>__a11y.text(".dispatch",600)),caption:await L.P(p,()=>__a11y.text("#tb-cap"))},await meas()));
  /* the dispatch sheet's grip: tap open, tap closed; then a drag up on it */
  await L.tap(p,"#dgrip"); await L.wait(1500);
  await R.shot(p,"04-sheet-open");
  R.step("tap the dispatch sheet's grip",{sheet:(await st()).phone,grip:await L.P(p,()=>{ const g=document.getElementById("dgrip"); const r=g.getBoundingClientRect(); return {expanded:g.getAttribute("aria-expanded"),label:g.getAttribute("aria-label"),box:[r.left,r.top,r.width,r.height].map(Math.round)}; }),cut:await L.P(p,()=>__a11y.cut()),
    phlist:await L.P(p,()=>[...document.querySelectorAll("#phlist button")].slice(0,12).map(b=>{ const r=b.getBoundingClientRect(); return b.textContent.trim().slice(0,40)+" "+Math.round(r.width)+"x"+Math.round(r.height); }))});
  await L.tap(p,"#dgrip"); await L.wait(1200);
  const g=await L.center(p,"#dgrip");
  const c0=await cam();
  await drag(g.x,g.y,0,-300,10); await L.wait(1500);
  R.step("drag up 300 px from the grip (CDP touch)",{before:c0,after:await cam(),sheet:(await st()).phone});
  if((await st()).phone.sheet){ await L.tap(p,"#dgrip"); await L.wait(1000); }
  /* a horizontal drag on the time rail */
  const rail=await L.center(p,"#timerail");
  let c1=await cam();
  await drag(rail.x-100,rail.y,200,0,12); await L.wait(1500);
  let c2=await cam();
  R.step("horizontal drag 200 px on the time rail (CDP touch)",{rail,before:c1,after:c2,clockMoved:c1.clock!==c2.clock,cameraMoved:Math.hypot(c2.x-c1.x,c2.z-c1.z)>0.5});
  /* a vertical drag that starts on the timeline's control row (not the rail) */
  const tb=await L.P(p,()=>{ const t=document.querySelector(".timebar").getBoundingClientRect(); const cap=document.getElementById("tb-cap").getBoundingClientRect(); return {top:t.top,h:t.height,cap:[cap.left,cap.top,cap.width,cap.height]}; });
  c1=await cam();
  await drag(195,tb.top+8,0,-250,12); await L.wait(1500);
  c2=await cam();
  R.step("vertical drag up 250 px starting on the timeline's top edge (CDP touch)",{tb,before:c1,after:c2,cameraMoved:Math.hypot(c2.x-c1.x,c2.z-c1.z)>0.5,clockMoved:c1.clock!==c2.clock});
  await R.shot(p,"05-after-drags");
  /* a pinch: one finger on the timeline, one on the map */
  c1=await cam();
  const y0=tb.top+tb.h/2;
  await touch("touchStart",[[150,y0],[240,y0-120]]);
  for(let i=1;i<=10;i++){ await touch("touchMove",[[150-6*i,y0+0],[240+6*i,y0-120-12*i]]); await L.wait(40); }
  await touch("touchEnd",[]); await L.wait(1500);
  c2=await cam();
  R.step("pinch out: one finger on the timeline, one on the map (CDP touch)",{before:c1,after:c2,cameraMoved:Math.hypot(c2.x-c1.x,c2.y-c1.y,c2.z-c1.z)>0.5,clockMoved:c1.clock!==c2.clock,scroll:await L.P(p,()=>__a11y.scroll())});
  /* a pinch on the map alone, for comparison */
  c1=await cam();
  await touch("touchStart",[[150,380],[240,460]]);
  for(let i=1;i<=10;i++){ await touch("touchMove",[[150-6*i,380-6*i],[240+6*i,460+6*i]]); await L.wait(40); }
  await touch("touchEnd",[]); await L.wait(1500);
  c2=await cam();
  R.step("pinch out on the map alone (CDP touch)",{before:c1,after:c2,cameraMoved:Math.hypot(c2.x-c1.x,c2.y-c1.y,c2.z-c1.z)>0.5,scroll:await L.P(p,()=>__a11y.scroll())});
  await R.shot(p,"06-after-pinch");
  /* the Menu */
  await L.tap(p,"#menubtn"); await L.wait(1500);
  await R.shot(p,"07-menu");
  R.step("tap Menu",Object.assign({state:(await st()).phone,menu:await L.P(p,()=>[...document.querySelectorAll("#tools button")].filter(e=>__a11y.vis(e)).map(e=>{ const r=e.getBoundingClientRect(); return e.textContent.trim()+" "+Math.round(r.width)+"x"+Math.round(r.height); })),menubtn:await L.P(p,()=>document.getElementById("menubtn").getAttribute("aria-expanded"))},await meas()));
  await L.tap(p,"#menubtn"); await L.wait(1200);
  /* a formation tapped; its dossier; How this is sourced */
  const t=await L.formationTarget(p);
  if(t){ await p.touchscreen.tap(t.x,t.y); await L.wait(2500);
    await R.shot(p,"08-dossier");
    R.step("tap a formation (map layer read to aim): "+t.name,Object.assign({t,state:await st(),drawer:await L.P(p,()=>{ const d=document.getElementById("drawer"); const r=d.getBoundingClientRect(); return {on:d.classList.contains("on"),box:[r.left,r.top,r.width,r.height].map(Math.round),sh:d.scrollHeight,ch:d.clientHeight,oy:getComputedStyle(d).overflowY}; }),selchip:await L.P(p,()=>__a11y.text("#selchip"))},await meas()));
    const sb=await L.center(p,"#drawer-body .src-head button");
    if(sb&&sb.vis){ await p.touchscreen.tap(sb.x,sb.y); await L.wait(2000);
      await R.shot(p,"09-sources");
      R.step("tap 'How this is sourced'",{fi:await L.P(p,()=>__a11y.fi()),sheet:await L.P(p,()=>{ const s=document.querySelector("#modal .sheet"), bd=document.getElementById("modal-body"); const r=s.getBoundingClientRect(); const c=document.getElementById("modal-close").getBoundingClientRect(); return {box:[r.left,r.top,r.width,r.height].map(Math.round),bodySH:bd.scrollHeight,bodyCH:bd.clientHeight,close:[c.left,c.top,c.width,c.height].map(Math.round)}; }),small:await L.P(p,()=>__a11y.small())});
      await L.tap(p,"#modal-close"); await L.wait(1200);
      R.step("tap the sheet's close",{fi:await L.P(p,()=>__a11y.fi())}); }
  }
  /* held landscape */
  await p.setViewportSize({width:844,height:390}); await L.wait(3500);
  await R.shot(p,"10-landscape");
  R.step("turned to landscape (844 x 390)",Object.assign({state:await st()},await meas()));
  const mb=await L.center(p,"#menubtn");
  if(mb&&mb.vis){ await p.touchscreen.tap(mb.x,mb.y); await L.wait(1500); await R.shot(p,"11-landscape-menu"); R.step("landscape: tap Menu",Object.assign({state:(await st()).phone},await meas())); await p.touchscreen.tap(mb.x,mb.y); await L.wait(1000); }
  else { const pb=await L.center(p,"#panelsbtn"); if(pb&&pb.vis){ await p.touchscreen.tap(pb.x,pb.y); await L.wait(1800); await R.shot(p,"11-landscape-panels"); R.step("landscape: tap Panels",Object.assign({state:(await st()).phone},await meas())); await p.touchscreen.tap(pb.x,pb.y); await L.wait(1000); } }
  const t2=await L.formationTarget(p);
  if(t2){ await p.touchscreen.tap(t2.x,t2.y); await L.wait(2500); await R.shot(p,"12-landscape-dossier");
    R.step("landscape: tap a formation: "+t2.name,Object.assign({state:await st(),drawer:await L.P(p,()=>{ const d=document.getElementById("drawer"); const r=d.getBoundingClientRect(); return {on:d.classList.contains("on"),box:[r.left,r.top,r.width,r.height].map(Math.round),sh:d.scrollHeight,ch:d.clientHeight,oy:getComputedStyle(d).overflowY}; })},await meas())); }
  R.console=p._log.slice(0,30);
});
