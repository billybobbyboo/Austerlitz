/* UI/UX roadmap step 3 (docs/UX_ART_AUDIT.md UA-02; the owner's decision of 15 November 2026, which revisits decision 78 for Play): who moves the
   camera, by real input. Shared by tools/ux-step3/continuity.js (on any build: the Step 2 build's record is the reproduction of the cross-phase
   camera move) and the harness's live block "ux3" (check:selftest and check:visual), judged by thresholds.js checkUx3.
   Each case starts from a view reached without motion (the clock set and the eye put at that phase's authored view, presetFrame, Follow on),
   then a visitor's input (a real click, drag, key or tap: the browser's own events reaching the app's own handlers), then the app's own frames
   on the motion driver's clock (tools/visual/motion.js: 30 frames a second; the WebGL draw skipped, which nothing here reads), and the eye read
   as the frames leave it. In every frame of a case: the eye's clearance above the floor, and the projected movement (the ground under a 5 x 5
   grid of the free map, taken in the frame before and projected again: the "flow", in CSS px a second, and the orbit target's own).
   - Play and its stops: Play by a click, a pause by a click (the eye where the pause found it, frame after frame), Play again (Follow taking up
     the held view: the flow and the target's speed in every frame), the natural end of Play (the eye where the end found it);
   - seeks, each from one phase into another unless named "same": the rail dragged inside a phase and across a boundary; an event marker's click;
     the next-ten-minutes button; the window's arrow key; the rail's PageDown; a day-track anchor's click; on a phone's page a coincident set's
     chooser by taps. Each keeps the eye where it stood (the owner's decision); the clock, the selection and the event chosen are read too;
   - deliberate moves: a phase's button and an act's (by Enter: an act takes no pointer press, decision 166 (a)) glide to that phase's authored
     view; a vantage's button to its view; an event dossier's "Go to this moment" centres the event; Follow off by a drag on the map, then a
     cross-phase drag of the rail and Play leave the eye where the visitor put it;
   - the Landscape with counters (a cross-phase drag keeps the eye) and the paper map (a cross-phase drag and Play leave its plan where it is);
   - reduced motion (the preference emulated on the desktop's page): Play's eye moves only in a frame whose clock reached an event's start (the
     dwell's starts, decision 89's event clock), at once; a pause and a cross-phase drag keep it.
   Measurement only: the block sets nothing the app does not set but the case's starting view. */
"use strict";
const inPage=function(){
  if(window.__u3) return true;
  var U={}, v=new THREE.Vector3(), prev=null;
  function free(){ return mode==="staff"?MAPCAM.freeRect():landFreeRect(); }
  function proj(p){ v.set(p[0],p[1],p[2]).project(camera); return {x:(v.x+1)/2*innerWidth, y:(1-v.y)/2*innerHeight, z:v.z}; }
  U.pose=function(){ var c=landCam.position, t=orbitTarget, m=mode==="staff"?MAPCAM.state():null;
    return {mode:mode, p:[c.x,c.y,c.z], t:[t.x,t.y,t.z], map:m?[m.x,m.z,m.wpp]:null, fc:!!freeCam, clock:clock, playing:!!playing, ph:curPhase, sel:selection?selection.kind+":"+selection.id:null,
      tw:!!(_tw&&_tw.cam), vantage:typeof curVantage==="undefined"?null:curVantage}; };
  U.authored=function(ph){ return presetFrame(PHASES[ph].cam); };
  U.vantage=function(k){ return presetFrame(VANTAGE[k]); };
  function endTw(){ var n=0; while(tween&&n<8){ tween(performance.now()+1e7); n++; } }
  /* the case's start: the clock at t, the eye at that phase's authored view, Follow on, nothing selected, the clock stopped */
  U.place=function(t,o){ o=o||{}; if(playing) stopPlay(); select(null,null); if(document.activeElement&&document.activeElement.blur) document.activeElement.blur();
    if(o.mode&&mode!==o.mode) setMode(o.mode);
    setClock(t,{instant:true,force:true,camera:false}); endTw();
    if(mode!=="staff"){ var c=presetFrame(PHASES[phaseAt(t)].cam); landCam.position.set(c[0],c[1],c[2]); orbitTarget.set(c[3],c[4],c[5]); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true); }
    else MAPCAM.frameField(true);
    freeCam=false; curVantage=null; setSpeed(0.5); if(typeof mlReset==="function") mlReset("ux3"); prev=null; return U.pose(); };
  /* n of the app's frames on the driver's clock, each measured */
  U.frames=function(n,o){ o=o||{}; var D=window.__md, R={n:0, flowMax:0, tMax:0, below:0, moved:0, movedAtStart:0, movedElse:[], ph0:curPhase, clock0:clock}, dt=D.frameMs/1000;
    var S=typeof dwellStarts==="function"?dwellStarts():[], ji=function(){ var j=-1; for(var i=0;i<S.length;i++) if(S[i]<=clock+1e-9) j=i; return j; };
    for(var k=0;k<n;k++){ var a=U.pose(), j0=ji();
      D.frame(); camera.updateMatrixWorld(); R.n++;
      var b=U.pose(), j1=ji(), mv=U.delta(a,b)>1e-6;
      if(mv){ R.moved++; if(j1!==j0) R.movedAtStart++; else if(R.movedElse.length<6) R.movedElse.push(+clock.toFixed(2)); }
      if(mode!=="staff"){ var q=landCam.position; if(q.y<camFloor(q.x,q.z)-1e-6) R.below++;
        if(prev){ for(var i=0;i<prev.pts.length;i++){ var s=proj(prev.pts[i]); if(!(s.z<1&&s.z>-1)) continue; var m=Math.hypot(s.x-prev.scr[i].x,s.y-prev.scr[i].y)/dt; if(m>R.flowMax) R.flowMax=m; }
          var st=proj(prev.tg); R.tMax=Math.max(R.tMax,Math.hypot(st.x-prev.tscr.x,st.y-prev.tscr.y)/dt); }
        var fr=free(), P=[]; for(var gi=0;gi<5;gi++) for(var gj=0;gj<5;gj++){ var g=groundAt(fr[0]+(fr[2]-fr[0])*(gi+0.5)/5,fr[1]+(fr[3]-fr[1])*(gj+0.5)/5); if(g) P.push([g[0],groundY(g[0],g[1]),g[1]]); }
        var tg=[orbitTarget.x,orbitTarget.y,orbitTarget.z]; prev={pts:P, scr:P.map(function(p){ var s=proj(p); return {x:s.x,y:s.y}; }), tg:tg, tscr:(function(){ var s=proj(tg); return {x:s.x,y:s.y}; })()}; }
      if(o.untilStop&&!playing) break; }
    R.flowMax=+R.flowMax.toFixed(1); R.tMax=+R.tMax.toFixed(1); R.pose=U.pose(); return R; };
  U.reset=function(){ prev=null; };
  U.delta=function(a,b){ if(a.map||b.map){ if(!a.map||!b.map) return 1e9; return Math.abs(a.map[0]-b.map[0])+Math.abs(a.map[1]-b.map[1])+1000*Math.abs(a.map[2]-b.map[2]); }
    return Math.max(Math.hypot(a.p[0]-b.p[0],a.p[1]-b.p[1],a.p[2]-b.p[2]),Math.hypot(a.t[0]-b.t[0],a.t[1]-b.t[1],a.t[2]-b.t[2])); };
  U.toPreset=function(a,c){ return Math.max(Math.hypot(a.p[0]-c[0],a.p[1]-c[1],a.p[2]-c[2]),Math.hypot(a.t[0]-c[3],a.t[1]-c[4],a.t[2]-c[5])); };
  /* a point of the rail at clock t where the rail itself takes the press (no marker or bar over it) */
  U.railAt=function(t){ var r=document.getElementById("timerail").getBoundingClientRect(), x=r.left+(t-T_MIN)/(T_MAX-T_MIN)*r.width, rail=document.getElementById("timerail");
    for(var y=r.top+r.height/2, k=0;k<9;k++){ var yy=y+((k%2)?1:-1)*Math.ceil(k/2)*2, e=document.elementFromPoint(x,yy); if(e&&(e===rail||rail.contains(e))) return {x:x,y:yy}; }
    return {x:x,y:r.top+r.height/2,blocked:true}; };
  U.marker=function(id){ for(var i=0;i<_evTicks.length;i++){ var o=_evTicks[i]; if(o.e.id===id){ var r=o.el.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,t:o.t,w:r.width}; } } return null; };
  U.el=function(sel){ var e=document.querySelector(sel); if(!e) return null; var r=e.getBoundingClientRect(); if(!(r.width>0&&r.height>0)) return null; return {x:r.left+r.width/2,y:r.top+r.height/2}; };
  U.evPlace=function(id){ var e=EVENTS.filter(function(x){ return x.id===id; })[0], w=W(e.p[0],e.p[1]); return [w[0],w[1],evClock(e)]; };
  window.__u3=U; return true;
};

/* ---- in node ---- */
async function runBlock(open,settle,o){
  o=o||{}; const MO=require("./motion.js"), log=o.log||function(){}, L={cases:{}, phone:{}, reduced:{}}, so=!!o.selftestOnly;
  const ev=(p,f,a)=>p.evaluate(f,a);
  const start=async p=>{ await p.evaluate(MO.inPage); await p.evaluate(inPage);
    const n0=await p.evaluate(()=>{ window.__md.start({gl:false}); return DEV.frames+DEV.skipped; });
    await p.waitForFunction(n=>DEV.frames+DEV.skipped>n,n0,{timeout:15000}).catch(()=>{}); };
  const stop=p=>p.evaluate(()=>{ if(playing) stopPlay(); window.__md.stop(); });
  const F=(p,n,x)=>ev(p,([n,x])=>window.__u3.frames(n,x),[n,x||{}]);
  const place=(p,t,x)=>ev(p,([t,x])=>window.__u3.place(t,x),[t,x||{}]);
  const pose=p=>ev(p,()=>window.__u3.pose());
  const drag=async(p,t0,t1,touch)=>{ const a=await ev(p,t=>window.__u3.railAt(t),t0), b=await ev(p,t=>window.__u3.railAt(t),t1);
    /* one move from the press to the drag's end: a drag of several moves lost the rail's pointer capture after its first move in some runs
       (the browser's lostpointercapture with no release by the app; seen on the Step 2 build too, on the Landscape with counters and under
       reduced motion, not investigated here: docs/ux-step3-evidence/README.md), which would leave the case short of the phase it must cross */
    await p.mouse.move(a.x,a.y); await p.mouse.down(); await p.mouse.move(b.x,a.y); await p.mouse.up(); await p.mouse.move(2,2); return {a:a,b:b}; };
  const rec=(k,r)=>{ L.cases[k]=r; log("ux3 "+k+": "+JSON.stringify(r)); };
  /* a seek case: from t0 (its phase's view), the input, then 100 frames (a phase's glide is 2.6 s, 78 frames) */
  const seek=async(p,k,t0,act,x)=>{ const a=await place(p,t0,x); const info=await act(); await ev(p,()=>window.__u3.reset()); const R=await F(p,100);
    const b=R.pose; rec(k,{from:+a.clock.toFixed(2), to:+b.clock.toFixed(2), ph0:a.ph, ph1:b.ph, moved:+(await ev(p,([a,b])=>window.__u3.delta(a,b),[a,b])).toFixed(4),
      toPhaseView:+(await ev(p,([b,ph])=>window.__u3.toPreset(b,window.__u3.authored(ph)),[b,b.ph])).toFixed(4), sel:b.sel, fc:b.fc, playing:b.playing, flowMax:R.flowMax, below:R.below, info:info||null}); };

  /* ---- the desktop's page: 1440 x 900, Study, the Landscape ---- */
  const p=await open([1440,900]); await settle(p);
  try{
    await p.evaluate(()=>closeFirst(null)); await p.mouse.move(2,2); await start(p);
    /* Play and its stops */
    await place(p,510);
    await p.click("#play"); await p.mouse.move(2,2);
    const play1=await F(p,180);
    const atPause=await pose(p); await p.click("#play"); await p.mouse.move(2,2); const paused=await pose(p);
    const hold=await F(p,120);
    rec("pause",{playing:atPause.playing, stopped:!paused.playing, clickMoved:+(await ev(p,([a,b])=>window.__u3.delta(a,b),[atPause,paused])).toFixed(4),
      heldMoved:+(await ev(p,([a,b])=>window.__u3.delta(a,b),[paused,hold.pose])).toFixed(4), playFlowMax:play1.flowMax, playTargetMax:play1.tMax, below:play1.below+hold.below, clock:+paused.clock.toFixed(2)});
    await ev(p,()=>window.__u3.reset());
    await p.click("#play"); await p.mouse.move(2,2);
    const res=await F(p,150); const r1=await pose(p);
    rec("resume",{playing:r1.playing, flowMax:res.flowMax, targetMax:res.tMax, below:res.below, from:+paused.clock.toFixed(2), to:+r1.clock.toFixed(2)});
    await p.click("#play"); await p.mouse.move(2,2);
    /* the natural end */
    await place(p,1075);
    await p.click("#play"); await p.mouse.move(2,2);
    const toEnd=await F(p,600,{untilStop:true}); const ended=await pose(p); const after=await F(p,90);
    rec("end",{stopped:!ended.playing, clock:+ended.clock.toFixed(2), heldMoved:+(await ev(p,([a,b])=>window.__u3.delta(a,b),[ended,after.pose])).toFixed(4), flowMax:toEnd.flowMax, below:toEnd.below+after.below});
    /* the seeks */
    await seek(p,"scrub-same",575,()=>drag(p,575,620));
    await seek(p,"scrub-cross",600,()=>drag(p,600,650));
    await seek(p,"marker",600,async()=>{ const m=await ev(p,id=>window.__u3.marker(id),"kursk"); await p.mouse.click(m.x,m.y); await p.mouse.move(2,2); return {event:"kursk", t:m.t}; });
    await seek(p,"step",625,async()=>{ await p.click("#next"); await p.mouse.move(2,2); });
    await seek(p,"key",625,async()=>{ await p.evaluate(()=>{ if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); }); await p.keyboard.press("ArrowRight"); });
    await seek(p,"rail-key",600,async()=>{ await p.focus("#timerail"); await p.keyboard.press("PageDown"); await p.evaluate(()=>document.activeElement.blur()); });
    await seek(p,"anchor",600,async()=>{
      const tt=await p.evaluate(()=>{ select("f","sthilaire"); dossierExpanded=true; paintDrawer(); var A=[].slice.call(document.querySelectorAll(".daytrack .dt-a")), ph=curPhase;
        var a=A.filter(function(x){ var t=+x.dataset.t; return phaseAt(t)!==ph&&t>clock; })[0]; if(!a) return null; a.id="ux3-anchor"; a.scrollIntoView({block:"center"}); return +a.dataset.t; });
      if(tt===null) return {none:true};
      await p.click("#ux3-anchor"); await p.mouse.move(2,2); return {t:tt}; });
    /* the deliberate moves */
    { const a=await place(p,600); await p.click("#phases .step:nth-child(7)"); await p.mouse.move(2,2); await ev(p,()=>window.__u3.reset()); const R=await F(p,100);
      rec("phase-button",{from:a.ph, to:R.pose.ph, toPhaseView:+(await ev(p,ph=>window.__u3.toPreset(window.__u3.pose(),window.__u3.authored(ph)),R.pose.ph)).toFixed(4), clock:R.pose.clock, fc:R.pose.fc, below:R.below}); }
    { const a=await place(p,600);
      const ok=await p.evaluate(()=>{ var b=[].slice.call(document.querySelectorAll(".act-btn")).filter(function(x){ return x.getAttribute("aria-current")!=="true"; })[0]; if(!b) return null; b.id="ux3-act"; b.tabIndex=0; return b.dataset.a; });
      await p.focus("#ux3-act"); await p.keyboard.press("Enter"); await ev(p,()=>window.__u3.reset()); const R=await F(p,100);
      rec("act-button",{act:ok, from:a.ph, to:R.pose.ph, toPhaseView:+(await ev(p,ph=>window.__u3.toPreset(window.__u3.pose(),window.__u3.authored(ph)),R.pose.ph)).toFixed(4), clock:R.pose.clock, below:R.below}); }
    { await place(p,600); const vb=await ev(p,()=>window.__u3.el('.van-btn[data-v="plateau"]'));
      if(vb){ await p.mouse.click(vb.x,vb.y); await p.mouse.move(2,2); const R=await F(p,100);
        rec("vantage",{toView:+(await ev(p,()=>window.__u3.toPreset(window.__u3.pose(),window.__u3.vantage("plateau")))).toFixed(4), vantage:R.pose.vantage, below:R.below}); }
      else rec("vantage",{shown:false}); }
    { await place(p,600); await p.evaluate(()=>{ select("e","kursk"); });
      const gb=await p.evaluate(()=>{ var b=[].slice.call(document.querySelectorAll("#drawer button, .drawer button")).filter(function(x){ return x.textContent.trim()==="Go to this moment"&&x.getBoundingClientRect().width>0; })[0]; if(!b) return null; b.id="ux3-go"; b.scrollIntoView({block:"center"}); return true; });
      if(gb){ await p.click("#ux3-go"); await p.mouse.move(2,2); const R=await F(p,100), e=await ev(p,()=>window.__u3.evPlace("kursk"));
        rec("centre",{clock:R.pose.clock, eventClock:e[2], targetToEvent:+Math.hypot(R.pose.t[0]-e[0],R.pose.t[2]-e[1]).toFixed(3), fc:R.pose.fc}); }
      else rec("centre",{shown:false}); await p.evaluate(()=>select(null,null)); }
    { /* Follow off by a drag on the map, then a cross-phase drag of the rail, then Play */
      await place(p,600); const fr=await ev(p,()=>{ var f=landFreeRect(); return [(f[0]+f[2])/2,(f[1]+f[3])/2]; });
      await p.mouse.move(fr[0],fr[1]); await p.mouse.down(); await p.mouse.move(fr[0]+60,fr[1]+20,{steps:4}); await p.mouse.up(); await p.mouse.move(2,2); await F(p,20);
      const a=await pose(p); await drag(p,600,650); const R=await F(p,100);
      await p.click("#play"); await p.mouse.move(2,2); const R2=await F(p,90); await p.click("#play"); await p.mouse.move(2,2);
      rec("follow-off",{fc:a.fc, scrubMoved:+(await ev(p,([a,b])=>window.__u3.delta(a,b),[a,R.pose])).toFixed(4), playMoved:+(await ev(p,([a,b])=>window.__u3.delta(a,b),[R.pose,R2.pose])).toFixed(4), clock:+R2.pose.clock.toFixed(2)}); }
    /* the Landscape with counters and the paper map */
    await seek(p,"hybrid-scrub",600,()=>drag(p,600,650),{mode:"hybrid"});
    { const a=await place(p,600,{mode:"staff"}); await drag(p,600,650); const R=await F(p,100);
      await p.click("#play"); await p.mouse.move(2,2); const R2=await F(p,90); await p.click("#play"); await p.mouse.move(2,2);
      rec("paper",{mode:R.pose.mode, scrubMoved:+(await ev(p,([a,b])=>window.__u3.delta(a,b),[a,R.pose])).toFixed(4), playMoved:+(await ev(p,([a,b])=>window.__u3.delta(a,b),[R.pose,R2.pose])).toFixed(4)}); }
    await p.evaluate(()=>setMode("terrain"));
    /* reduced motion, on the same page */
    if(!so||true){
      await stop(p); await p.emulateMedia({reducedMotion:"reduce"}); await p.waitForFunction(()=>RM===true,null,{timeout:10000}).catch(()=>{}); await start(p);
      const a=await place(p,510); await p.click("#play"); await p.mouse.move(2,2); const R=await F(p,240); const b=await pose(p); await p.click("#play"); await p.mouse.move(2,2);
      const h=await F(p,60);
      L.reduced.play={rm:await p.evaluate(()=>RM), frames:R.n, moved:R.moved, movedAtStart:R.movedAtStart, movedElse:R.movedElse, from:+a.clock.toFixed(2), to:+b.clock.toFixed(2), below:R.below, heldMoved:+(await ev(p,([a,b])=>window.__u3.delta(a,b),[b,h.pose])).toFixed(4)};
      log("ux3 reduced motion, Play: "+JSON.stringify(L.reduced.play));
      const c=await place(p,600); await drag(p,600,650); const R3=await F(p,100);
      L.reduced.scrub={moved:+(await ev(p,([a,b])=>window.__u3.delta(a,b),[c,R3.pose])).toFixed(4), ph0:c.ph, ph1:R3.pose.ph};
      log("ux3 reduced motion, a cross-phase drag: "+JSON.stringify(L.reduced.scrub));
      await stop(p); await p.emulateMedia({reducedMotion:"no-preference"}); }
    else await stop(p);
  } finally { await p.context().close(); }

  /* ---- a phone's page: the coincident set's chooser by taps ---- */
  const q=await open([390,844],"ios"); await settle(q);
  try{
    await q.tap("#fr-close",{timeout:60000}); await start(q);
    const a=await place(q,600);
    const m=await ev(q,id=>window.__u3.marker(id),"pratzeberg");
    await q.touchscreen.tap(m.x,m.y);
    const pk=await q.evaluate(()=>{ var P=document.getElementById("evpick"); if(!P||P.hidden) return null; var B=[].slice.call(P.querySelectorAll("button")); return B.map(function(b){ return b.dataset.ev; }); });
    let chose=null;
    if(pk&&pk.length){ chose=pk.indexOf("pratzeberg")>=0?"pratzeberg":pk[0]; const c=await ev(q,id=>window.__u3.el('#evpick [data-ev="'+id+'"]'),chose); await q.touchscreen.tap(c.x,c.y); }
    await ev(q,()=>window.__u3.reset()); const R=await F(q,100); const b=R.pose;
    L.phone.chooser={opened:!!pk, set:pk, chose:chose, from:+a.clock.toFixed(2), to:+b.clock.toFixed(2), ph0:a.ph, ph1:b.ph, sel:b.sel, moved:+(await ev(q,([a,b])=>window.__u3.delta(a,b),[a,b])).toFixed(4),
      toPhaseView:+(await ev(q,b=>window.__u3.toPreset(b,window.__u3.authored(b.ph)),b)).toFixed(4), below:R.below};
    log("ux3 a phone, the chooser: "+JSON.stringify(L.phone.chooser));
    await stop(q);
  } finally { await q.context().close(); }
  return L;
}
module.exports={inPage, runBlock};
