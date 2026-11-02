#!/usr/bin/env node
/* Scenario 10: a phone (390 x 844, density 3, touch, an iPhone's user agent): the speed button during Play and during a dwell's hold, the phase
   list pressed during Play, the Menu and a presentation change during Play, a finger's drag during Play (Follow), the phase's message.
   Real taps (page.touchscreen) and touch drags (CDP Input.dispatchTouchEvent); frames by the frame driver (ilib.js). */
"use strict";
const {run,H,I}=require("./irun.js");
run("s10-phone",{viewport:[390,844],page:"phone"},async c=>{
  const p=await c.page("phone",[390,844],{});
  const cdp=await p.context().newCDPSession(p);
  const touchDrag=async (x,y,dx,dy,n)=>{ await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]}); for(let i=1;i<=n;i++){ await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+dx*i/n,y:y+dy*i/n}]}); await H.frames(p,1); } await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]}); };
  await c.step(p,"tap the card's 'Explore on my own'; 2 frames",async q=>{ await I.tapEl(q,"#fr-close"); await H.frames(q,2); });
  let s=c.last().s; c.check("phone-layout",s.phone&&s.phone.on,"the phone layout",s.phone);
  /* the speed button cycles; during Play */
  await c.step(p,"tap Play; 30 frames; tap the speed button 4 times with 30 frames between (½× 1× 2× 4× ½×)",async q=>{ await I.tapEl(q,"#play"); await H.frames(q,30); const r=[]; for(let i=0;i<4;i++){ await I.tapEl(q,"#speedbtn"); const t=await I.trace(q,30); r.push({label:await H.ev(q,()=>document.getElementById("speedbtn").textContent), aria:await H.ev(q,()=>document.getElementById("speedbtn").getAttribute("aria-label")), speed:await H.ev(q,()=>speed), d:+(t[29][0]-t[0][0]).toFixed(3), dwell:[...new Set(t.map(x=>x[1]))]}); } return r; });
  const sp=c.last().ret; c.out.speedCycle=sp;
  c.check("phone-speed-cycle",sp.map(x=>x.speed).join(",")==="1,2,4,0.5"&&sp.every(x=>x.label&&x.aria&&x.aria.indexOf(x.label)>=0),"the speed button steps ½× 1× 2× 4× and round again, its label and name the speed",sp.map(x=>({speed:x.speed,label:x.label,aria:x.aria})));
  /* the speed button in a dwell's hold */
  await c.step(p,"frames until a hold; tap the speed button (½× to 1×) in the hold",async q=>{ await H.until(q,"DWELL.st&&DWELL.st.stage==='hold'",4000); await H.frames(q,5); await I.tapEl(q,"#speedbtn"); return I.trace(q,90); });
  const tr=c.last().ret; const holdN=tr.findIndex(x=>x[1]!=="hold"); let back=0; for(let i=1;i<tr.length;i++) if(tr[i][0]<tr[i-1][0]-1e-9) back++;
  c.check("phone-speed-hold",back===0&&holdN>=38&&holdN<=41,"the speed tapped in a hold: the hold keeps its 1.5 s, no backward step",{holdFramesAfterTap:holdN,backSteps:back,speed:tr[tr.length-1][2]});
  /* the phase list during Play */
  await c.step(p,"tap the dispatch sheet's grip (open); tap the fifth phase in its list during Play",async q=>{ await I.tapEl(q,"#dgrip"); await H.frames(q,5); const t=await H.ev(q,()=>{ const b=document.querySelectorAll("#phlist .ph-item")[4]; b.scrollIntoView({block:"center"}); return PHASES[4].t0; }); await H.frames(q,2); await I.tapEl(q,"#phlist .ph-item",{index:4}); await H.frames(q,5); return t; },{shot:"phone-phase-list"});
  s=c.last().s; const t5=c.last().ret;
  c.check("phone-phase-tap",!s.playing&&s.clock===t5&&!s.phone.sheet,"a phase tapped during Play: stopped at its start, the sheet folded",{clock:s.clock,expected:t5,playing:s.playing,sheet:s.phone.sheet,toast:s.toast});
  /* the phase's message against the controls */
  const tb=await H.ev(p,()=>{ const t=document.getElementById("toast"); if(!t.classList.contains("on")) return {on:false}; const r=t.getBoundingClientRect(); const hits=[...document.querySelectorAll("button,[role=slider]")].filter(b=>{ const q=b.getBoundingClientRect(); if(!(q.width>0&&q.height>0)) return false; let v=true; for(let e=b;e;e=e.parentElement){ const cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||e.hidden) v=false; } return v&&q.left<r.right-1&&r.left<q.right-1&&q.top<r.bottom-1&&r.top<q.bottom-1; }).map(b=>b.id||b.className);
    return {on:true,box:[r.left,r.top,r.right,r.bottom].map(Math.round),over:hits}; });
  c.check("phone-toast-clear",!tb.on||tb.over.length===0,"the phase's message over no control",tb);
  /* the Menu, Watch, during Play; a finger's drag during Play */
  await c.step(p,"tap Play; 30 frames; tap the Menu; tap Watch in it; 30 frames",async q=>{ await I.tapEl(q,"#play"); await H.frames(q,30); await I.tapEl(q,"#menubtn"); await H.frames(q,3); await I.tapEl(q,'.vm-btn[data-vm="watch"]'); await H.frames(q,30); });
  s=c.last().s; c.check("phone-watch-play",s.playing&&s.presentation==="watch"&&!s.phone.menu,"Watch from the Menu during Play: playing, the Menu closed",{playing:s.playing,presentation:s.presentation,phone:s.phone,focus:s.focus,focusVisible:s.focusVisible});
  await c.step(p,"a finger's drag on the map during Play; 60 frames",async q=>{ const fr=await H.ev(q,()=>{ const r=landFreeRect(); return [(r[0]+r[2])/2,(r[1]+r[3])/2]; }); const a=JSON.stringify((await I.snap(q)).cam); await touchDrag(fr[0],fr[1],60,40,6); const b=JSON.stringify((await I.snap(q)).cam); await H.frames(q,60); const d=JSON.stringify((await I.snap(q)).cam); return {moved:a!==b,heldAfter:b===d}; });
  s=c.last().s; c.check("phone-drag-follow",s.playing&&s.freeCam&&c.last().ret.moved&&c.last().ret.heldAfter,"a finger's pan during Play turns Follow off; the eye stays where the finger left it",{ret:c.last().ret,freeCam:s.freeCam,playing:s.playing});
  await c.step(p,"tap Pause",q=>I.tapEl(q,"#play"));
  c.out.listeners=await I.counts(p);
});
