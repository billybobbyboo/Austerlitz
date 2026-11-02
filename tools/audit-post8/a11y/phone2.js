#!/usr/bin/env node
/* Final audit after Stage 8, area a11y: the phone's touch gestures again, in an order that keeps the page unzoomed until the last test
   (phone.js's pinch with a finger on the timeline zoomed the page 5x, which made its later touches land elsewhere). Visitor's page, 390 x 844,
   density 3, touch, isMobile, an iPhone's user agent (desktop Chromium: not a real mobile browser); touches by CDP Input.dispatchTouchEvent,
   taps by page.touchscreen. 1. one finger dragged on the map: does the camera pan (are CDP touches reaching the app at all)? 2. a tap on the
   time rail, 3. a finger dragged along it: does the clock move? 4. a pinch on the map alone: does the camera zoom? 5. a pinch with one finger on
   the timeline: does the page zoom? Then, unzoomed again (CDP Emulation.setPageScaleFactor 1, set-up), the Menu, a formation tapped and
   "How this is sourced", and held landscape (844 x 390) with the phase text's place.
   node tools/audit-post8/a11y/phone2.js */
"use strict";
const L=require("./alib.js");
L.run("phone2",async(b,R,log)=>{
  const p=await L.openV(b,[390,844],{phone:true});
  const cdp=p._cdp;
  await L.wait(2000);
  await L.tap(p,"#fr-close"); await L.wait(2500);
  const cam=()=>L.P(p,()=>({x:+landCam.position.x.toFixed(2),y:+landCam.position.y.toFixed(2),z:+landCam.position.z.toFixed(2),clock:clock,vv:window.visualViewport?+visualViewport.scale.toFixed(3):null}));
  const touch=(type,pts)=>cdp.send("Input.dispatchTouchEvent",{type,touchPoints:pts.map((q,i)=>({x:q[0],y:q[1],id:i,radiusX:4,radiusY:4,force:1}))});
  const drag=async(x,y,dx,dy,n)=>{ await touch("touchStart",[[x,y]]); for(let i=1;i<=n;i++){ await touch("touchMove",[[x+dx*i/n,y+dy*i/n]]); await L.wait(60); } await touch("touchEnd",[]); };
  const pinch=async(a,b2,s)=>{ await touch("touchStart",[a,b2]); for(let i=1;i<=10;i++){ const k=i/10*s; await touch("touchMove",[[a[0]-k,a[1]-k*0.5],[b2[0]+k,b2[1]+k*0.5]]); await L.wait(60); } await touch("touchEnd",[]); };
  const delta=(a,c)=>({cameraMoved:Math.hypot(c.x-a.x,c.y-a.y,c.z-a.z)>0.5,clockMoved:a.clock!==c.clock,vv:[a.vv,c.vv]});
  let a=await cam(); await drag(195,330,90,60,12); await L.wait(1500); let c=await cam();
  R.step("1. one finger dragged 108 px on the map (CDP touch)",Object.assign({before:a,after:c},delta(a,c)));
  const rail=await L.center(p,"#timerail");
  a=await cam(); await p.touchscreen.tap(rail.x+rail.w*0.3-rail.w/2,rail.y); await L.wait(1500); c=await cam();
  R.step("2. a tap on the time rail at 30% of its width (page.touchscreen)",Object.assign({rail,before:a,after:c,at:await L.P(p,([x,y])=>window.__a11y.desc(document.elementFromPoint(x,y)),[rail.x+rail.w*0.3-rail.w/2,rail.y])},delta(a,c)));
  a=await cam(); await drag(rail.x-rail.w*0.3,rail.y,rail.w*0.5,0,12); await L.wait(1500); c=await cam();
  R.step("3. a finger dragged along the time rail, 50% of its width (CDP touch)",Object.assign({before:a,after:c},delta(a,c)));
  a=await cam(); await pinch([160,360],[230,430],50); await L.wait(1500); c=await cam();
  R.step("4. a pinch out on the map alone (CDP touch)",Object.assign({before:a,after:c},delta(a,c)));
  const tb=await L.P(p,()=>{ const t=document.querySelector(".timebar").getBoundingClientRect(); return {top:t.top,h:t.height}; });
  a=await cam(); await pinch([150,tb.top+tb.h/2],[240,tb.top-110],50); await L.wait(1500); c=await cam();
  R.step("5. a pinch out with one finger starting on the timeline, one on the map (CDP touch)",Object.assign({tb,before:a,after:c,scroll:await L.P(p,()=>window.__a11y.scroll())},delta(a,c)));
  await R.shot(p,"05-after-timeline-pinch");
  await cdp.send("Emulation.setPageScaleFactor",{pageScaleFactor:1}).catch(()=>{}); await L.wait(1200);
  R.step("set-up: the page scale put back to 1 (CDP Emulation.setPageScaleFactor)",{vv:(await cam()).vv});
  /* the Menu */
  await L.tap(p,"#menubtn"); await L.wait(1500); await R.shot(p,"06-menu");
  R.step("the Menu (tap)",{state:(await L.A.state(p)).phone,items:await L.P(p,()=>[...document.querySelectorAll("#tools button")].filter(e=>__a11y.vis(e)).map(e=>{ const r=e.getBoundingClientRect(); return e.textContent.trim()+" "+Math.round(r.width)+"x"+Math.round(r.height); })),
    targets:await L.P(p,()=>{ const t=__a11y.targets(); return {n:t.n,failing:t.small.filter(x=>x.spacing!=="passes"&&!/ev-mark|button\.step/.test(x.el))}; }),cut:await L.P(p,()=>__a11y.cut())});
  await L.tap(p,"#menubtn"); await L.wait(1200);
  /* a formation tapped, its dossier, How this is sourced */
  const t=await L.formationTarget(p);
  if(t){ await p.touchscreen.tap(t.x,t.y); await L.wait(2500); await R.shot(p,"07-dossier");
    R.step("a formation tapped (map layer read to aim): "+t.name,{t,state:(await L.A.state(p)).phone,drawer:await L.P(p,()=>{ const d=document.getElementById("drawer"); const r=d.getBoundingClientRect(); return {on:d.classList.contains("on"),box:[r.left,r.top,r.width,r.height].map(Math.round),sh:d.scrollHeight,ch:d.clientHeight}; }),
      targets:await L.P(p,()=>{ const T=__a11y.targets(); return {n:T.n,failing:T.small.filter(x=>x.spacing!=="passes"&&!/ev-mark|button\.step/.test(x.el))}; }),small:await L.P(p,()=>__a11y.small()),cut:await L.P(p,()=>__a11y.cut())});
    const sb=await L.center(p,"#drawer-body .src-head button");
    if(sb&&sb.vis){ await p.touchscreen.tap(sb.x,sb.y); await L.wait(2000); await R.shot(p,"08-sources");
      R.step("'How this is sourced' (tap)",{fi:await L.P(p,()=>__a11y.fi()),sheet:await L.P(p,()=>{ const s=document.querySelector("#modal .sheet"); const r=s.getBoundingClientRect(); const c=document.getElementById("modal-close").getBoundingClientRect(); return {box:[r.left,r.top,r.width,r.height].map(Math.round),sh:s.scrollHeight,ch:s.clientHeight,close:[c.left,c.top,c.width,c.height].map(Math.round)}; })});
      /* a finger's swipe up on the sheet's text: does it scroll? */
      const s0=await L.P(p,()=>document.querySelector("#modal .sheet").scrollTop); await drag(195,600,0,-300,10); await L.wait(1500); const s1=await L.P(p,()=>document.querySelector("#modal .sheet").scrollTop);
      R.step("a finger's swipe up on the sheet's text (CDP touch)",{scrollTop:[s0,s1]});
      await L.tap(p,"#modal-close"); await L.wait(1200); }
    await p.keyboard.press("Escape").catch(()=>{}); await L.wait(800);
  }
  /* held landscape: where is the phase text */
  await p.setViewportSize({width:844,height:390}); await L.wait(3500); await R.shot(p,"09-landscape");
  R.step("held landscape (844 x 390): the phase text's place and the screen",{state:(await L.A.state(p)).phone,narr:await L.P(p,()=>__a11y.narr()),
    targets:await L.P(p,()=>{ const T=__a11y.targets(); return {n:T.n,failing:T.small.filter(x=>x.spacing!=="passes"&&!/ev-mark|button\.step/.test(x.el))}; }),cut:await L.P(p,()=>__a11y.cut()),panels:await L.P(p,()=>__a11y.panels()),
    reach:await L.P(p,()=>["#menubtn","#panelsbtn","#helpbtn","#eyesbtn","#speedbtn","#lg-toggle","#srcbtn","#dgrip"].map(s=>{ const e=document.querySelector(s); if(!e) return s+" absent"; const r=e.getBoundingClientRect(); return s+": "+(__a11y.vis(e)?"shown":"not shown")+" "+[r.left,r.top,r.width,r.height].map(Math.round).join(","); }))});
  const pb=await L.center(p,"#panelsbtn");
  if(pb&&pb.vis){ await p.touchscreen.tap(pb.x,pb.y); await L.wait(2000); await R.shot(p,"10-landscape-panels");
    R.step("held landscape: Panels (tap)",{state:(await L.A.state(p)).phone,narr:await L.P(p,()=>__a11y.narr()),rail:await L.P(p,()=>{ const r=document.querySelector(".rail"); const q=r.getBoundingClientRect(); const sc=r.querySelector(".railscroll"); return {box:[q.left,q.top,q.width,q.height].map(Math.round),scrollH:sc&&sc.scrollHeight,clientH:sc&&sc.clientHeight,tabs:[...document.querySelectorAll(".tab-btn")].filter(x=>!x.hidden).map(x=>x.textContent.trim())}; })}); }
  R.console=p._log.slice(0,30);
});
