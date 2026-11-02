#!/usr/bin/env node
/* Scenario 11 (second session): the browser hypotheses of the area "state" (docs/audit-post8-evidence/state/README.md, findings 2, 3, 4, 6, 7
   and 8) tested by real input in the pinned browser, where scenarios 1-10 do not already cover them, and one found here (the outgoing phase's
   arrows with the Movement layer off). Three pages: a visitor's at 1600 x 900; a touchscreen laptop's at 1280 x 720 (hasTouch, a desktop user
   agent); a retina laptop's opened in a small window (880 x 660, density 2) and enlarged. Frames by the frame driver (ilib.js DRV) unless said. */
"use strict";
const {run,H,I}=require("./irun.js");
const TXT=()=>document.getElementById("drawer-body").textContent.replace(/\s+/g," ").trim();
const OVOP=()=>({old:oldMats.length?+Math.max.apply(null,oldMats.map(m=>m.opacity)).toFixed(3):null, cur:overlayMats.length?+Math.max.apply(null,overlayMats.map(m=>m.opacity)).toFixed(3):null,
  oldN:oldMats.length, curN:overlayMats.length, oldVisible:!!(oldOv&&oldOv.visible), fadeOut:+ovFadeOut.toFixed(3), fadeIn:+ovFadeIn.toFixed(3), phase:curPhase, clock:+clock.toFixed(2), arrowsLayer:layerOn.arrows});
run("s11-state-hypotheses",{pages:["visitor 1600x900","touch laptop 1280x720","retina laptop 880x660 -> 1600x900"]},async c=>{
  const p=await c.page("desk",[1600,900],{});
  await c.step(p,"Esc closes the first-run card; 2 frames",async q=>{ await H.esc(q); await H.frames(q,2); });
  /* the dwell's toggle as announced (s1b's dwell-off check lost the attribute to the snapshot's key list; read here directly) */
  await c.step(p,"click Layers; click 'Pause briefly at events' (off); read; click it again (on); read; Esc",async q=>{ await H.click(q,"#layersbtn"); await H.click(q,"#dwell"); const a=await H.ev(q,()=>({on:DWELL.on,pressed:document.getElementById("dwell").getAttribute("aria-pressed")})); await H.click(q,"#dwell"); const b=await H.ev(q,()=>({on:DWELL.on,pressed:document.getElementById("dwell").getAttribute("aria-pressed")})); await H.esc(q); return {a,b}; });
  c.check("dwell-toggle-pressed",c.last().ret.a.on===false&&c.last().ret.a.pressed==="false"&&c.last().ret.b.on===true&&c.last().ret.b.pressed==="true","the dwell's button announces its state (aria-pressed) as it toggles",c.last().ret);
  /* state finding 4: the first Play frame after the page has gone idle */
  await c.step(p,"frames until the app's loop is idle; 3 s of idle frames (the driver's clock)",async q=>{ const n=await H.until(q,"DEV.state==='idle'",900); await q.evaluate(()=>window.__drv.advance(3000)); await H.frames(q,5); return {framesToIdle:n,state:await H.ev(q,()=>DEV.state)}; });
  await c.step(p,"set up: nothing focused; Space (real key: the window's play row); 4 frames traced",async q=>{ await H.ev(q,()=>{ if(document.activeElement) document.activeElement.blur(); }); await H.key(q," "); return I.trace(q,4); });
  let t=c.last().ret, st=t.map((x,i)=>+(x[0]-(i?t[i-1][0]:240)).toFixed(4));
  c.check("idle-first-frame-space",Math.abs(st[0]-st[1])<0.02,"Space after idle: the first frame advances the clock as much as the next ones (one frame: 33.3 ms at the driver's 30 fps, 0.167 clock min at ½×)",{steps:st,trace:t},{note:"state finding 4: loop() keeps lastFrame from the last active frame, so the first dt is the 120 ms cap"});
  await c.step(p,"Space (pause); frames until idle; 3 s idle; set up focus on Play; Enter (real key); 4 frames traced",async q=>{ await H.key(q," "); await H.until(q,"DEV.state==='idle'",900); await q.evaluate(()=>window.__drv.advance(3000)); await H.frames(q,5); const c0=await H.ev(q,()=>clock); await H.focus(q,"#play"); await H.key(q,"Enter"); return {c0,t:await I.trace(q,4)}; });
  t=c.last().ret.t; st=t.map((x,i)=>+(x[0]-(i?t[i-1][0]:c.last().ret.c0)).toFixed(4));
  c.check("idle-first-frame-enter",Math.abs(st[0]-st[1])<0.02,"Enter on the focused Play button after idle: the first frame advances as the next ones",{steps:st});
  await c.step(p,"click 4× (wakes the loop); frames until idle; 3 s idle; Enter on the focused Play button: pause then play",async q=>{ await H.key(q,"Enter"); await H.click(q,'.spd-btn[data-s="4"]'); await H.until(q,"DEV.state==='idle'",900); await q.evaluate(()=>window.__drv.advance(3000)); await H.frames(q,5); const c0=await H.ev(q,()=>clock); await H.focus(q,"#play"); await H.key(q,"Enter"); return {c0,t:await I.trace(q,4)}; });
  t=c.last().ret.t; st=t.map((x,i)=>+(x[0]-(i?t[i-1][0]:c.last().ret.c0)).toFixed(4));
  c.check("idle-first-frame-4x",Math.abs(st[0]-st[1])<0.05,"the same at 4×",{steps:st,dwell:t.map(x=>x[1])});
  await c.step(p,"Enter (pause); click ½×",async q=>{ await H.key(q,"Enter"); await H.click(q,'.spd-btn[data-s="0.5"]'); });
  /* state finding 6: "next event" from a clock paused in a dwell's ease in */
  await c.step(p,"set up focus on the rail; Home; Play (by state); frames until the ease in before 04:15; 4 frames; click Pause",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); await H.setPlay(q,true); await H.until(q,"DWELL.st&&DWELL.st.stage==='in'",3000); await H.frames(q,4); await H.click(q,"#play"); return H.ev(q,()=>clock); });
  const tPause=c.last().ret;
  await c.step(p,"'.' (the next event, real key)",async q=>{ await H.key(q,"."); return H.ev(q,()=>({clock,sel:selection?selection.kind+":"+selection.id:null})); });
  const nx=c.last().ret;
  c.check("next-event-from-ease",Math.abs(nx.clock-255)<1e-6,"paused in the ease in before the 04:15 start, '.' (the next event) goes to 04:15, the event the clock was approaching",{pausedAt:tPause,after:nx},{note:"state finding 6: jumpEvent takes the first start more than 1.5 min ahead"});
  /* state finding 2: the open card goes stale while the clock moves within a phase (what the visitor reads) */
  await c.step(p,"Esc; set up focus on the rail; Home; Shift+ArrowRight x8 (12:00); click the Order of battle tab; click Napoleon's headquarters' row",async q=>{ await H.esc(q); await H.focus(q,"#timerail"); await H.key(q,"Home"); for(let i=0;i<8;i++) await H.key(q,"Shift+ArrowRight"); await H.click(q,"#tab-oob"); await H.click(q,'.oob-row[data-id="gqg"]'); await H.until(q,"!tween",400); return H.ev(q,()=>clock); });
  const card0=await H.ev(p,TXT);
  await c.step(p,"Play (by state); frames until 12:37; click Pause",async q=>{ await H.setPlay(q,true); await H.until(q,"clock>=757",3000); await H.click(q,"#play"); return H.ev(q,()=>({clock,phase:curPhase})); },{shot:"stale-card-1237"});
  const card1=await H.ev(p,TXT), fresh=await H.ev(p,()=>{ paintDrawer(); return document.getElementById("drawer-body").textContent.replace(/\s+/g," ").trim(); });
  const diffWords=(a,b)=>{ const A=a.split(" "), B=b.split(" "); let i=0; while(i<A.length&&A[i]===B[i]) i++; return {at:i,shown:A.slice(Math.max(0,i-6),i+14).join(" "),fresh:B.slice(Math.max(0,i-6),i+14).join(" ")}; };
  c.out.staleCard={at1200:card0.slice(0,500),at1237shown:card1.slice(0,500),at1237repainted:fresh.slice(0,500),firstDifference:card1===fresh?null:diffWords(card1,fresh)};
  c.check("card-current-at-1237",card1===fresh,"the open card at 12:37 (same phase) reads as the app paints it at 12:37",{same:card1===fresh,firstDifference:c.out.staleCard.firstDifference});
  await c.step(p,"Esc (card closed)",H.esc);
  /* state finding 3: a phase change that interrupts the overlays' fade (the arrows pop) */
  await c.step(p,"set up focus on the rail; Home; frames until no tween; PageDown (07:00); 15 frames (0.5 s), each recorded",async q=>{ await H.focus(q,"#timerail"); await H.key(q,"Home"); await H.until(q,"!tween",400); await H.frames(q,5); await H.key(q,"PageDown"); const r=[]; for(let i=0;i<15;i++){ await H.frames(q,1); r.push(await H.ev(q,OVOP)); } return r; },{draw:"pop-before-second-pagedown"});
  const a3=c.last().ret;
  await c.step(p,"PageDown again (08:00); 1 frame; draw",async q=>{ await H.key(q,"PageDown"); await H.frames(q,1); return H.ev(q,OVOP); },{draw:"pop-after-second-pagedown"});
  const b3=c.last().ret; const b3t=[]; for(let i=0;i<40;i++){ await H.frames(p,1); b3t.push(await H.ev(p,OVOP)); }
  c.out.pop={afterFirst:a3,afterSecond:[b3].concat(b3t)};
  c.check("no-pop",b3.old<=a3[a3.length-1].cur+0.05,"the 07:00 phase's arrows, at "+a3[a3.length-1].cur+" when 08:00 is stepped to, are not drawn brighter as they are left",{curBeforeSecond:a3[a3.length-1].cur,oldAfterSecond:b3.old,oldTrace:b3t.slice(0,36).filter((x,i)=>i%5===0).map(x=>x.old)});
  /* found here: the Movement layer off, then a phase change */
  await c.step(p,"frames until no tween; click Layers; click 'Movement' (off); Esc; 5 frames",async q=>{ await H.until(q,"!tween",400); await H.click(q,"#layersbtn"); await H.click(q,'.layer-btn[data-l="arrows"]'); await H.esc(q); await H.frames(q,5); return H.ev(q,OVOP); },{draw:"arrows-off-at-0800"});
  const off0=c.last().ret;
  await c.step(p,"PageDown (08:45) with the Movement layer off; 1 frame; draw",async q=>{ await H.key(q,"PageDown"); await H.frames(q,1); return H.ev(q,OVOP); },{draw:"arrows-off-pagedown"});
  const off1=c.last().ret; const offT=[]; for(let i=0;i<40;i++){ await H.frames(p,1); offT.push(await H.ev(p,OVOP)); }
  c.out.arrowsOff={before:off0,afterPageDown:off1,trace:offT.filter((x,i)=>i%4===0)};
  c.check("arrows-off-stay-off",off0.cur===0&&off1.old===0&&offT.every(x=>!x.old),"with the Movement layer off, a phase change draws no arrow: the outgoing phase's included",{before:off0,first:off1,maxOldOver40:Math.max.apply(null,offT.map(x=>x.old||0)),framesAbove0_1:offT.filter(x=>x.old>0.1).length});
  await c.step(p,"click Layers; 'Movement' on again; Esc",async q=>{ await H.click(q,"#layersbtn"); await H.click(q,'.layer-btn[data-l="arrows"]'); await H.esc(q); });
  /* state finding 7 (a): a right press on the rail */
  await c.step(p,"install a measuring listener for contextmenu (records defaultPrevented after the app's own handlers); right-click on the rail at 10:00 (real mouse)",async q=>{
    await H.ev(q,()=>{ window.__ctx=[]; window.addEventListener("contextmenu",function(e){ window.__ctx.push({target:e.target.id||e.target.className,prevented:e.defaultPrevented}); }); });
    const a=await H.railStart(q,600), c0=await H.ev(q,()=>clock); await q.mouse.click(a.x,a.y,{button:"right"}); return {c0,start:a,clock:await H.ev(q,()=>clock),ctx:await H.ev(q,()=>window.__ctx)}; });
  const rr=c.last().ret;
  c.check("rail-right-button",Math.abs(rr.clock-rr.c0)<1e-6,"a right press on the rail does not seek (a slider takes the primary button)",rr,{note:"state finding 7: pointerdown seeks with any button; the context menu is not prevented on the rail, so on a desktop where the menu opens at the press the release goes to the menu"});
  /* the card under a reading that does not know the formation (scenarios 3 and 12): what the visitor reads */
  await c.step(p,"Esc; set up focus on the rail; Home; PageDown; ArrowRight x3 (07:30); click the Order of battle tab; click Saint-Hilaire's row; click the Eyes button twice (the Allied headquarters)",async q=>{ await H.esc(q); await H.focus(q,"#timerail"); for(const k of ["Home","PageDown","ArrowRight","ArrowRight","ArrowRight"]) await H.key(q,k); await H.click(q,"#tab-oob"); await H.click(q,'.oob-row[data-id="sthilaire"]'); await H.click(q,"#eyesbtn"); await H.click(q,"#eyesbtn"); await H.frames(q,5); return H.ev(q,()=>({cv:commandView,hidden:readHidden("sthilaire"),card:document.getElementById("drawer-body").textContent.replace(/\s+/g," ").trim().slice(0,700)})); },{shot:"card-under-allied-reading-0730"});
  c.out.cardUnderReading=c.last().ret;
  await c.step(p,"click the Eyes button (everyone); Esc",async q=>{ await H.click(q,"#eyesbtn"); await H.esc(q); });
  c.out.listenersA=await I.counts(p);
  await p.context().close();
  /* state finding 7 (b): a touchscreen laptop: a touch on the rail cancelled, then the mouse over the rail */
  const q2=await c.page("touch",[1280,720],{touch:true});
  const cdp=await q2.context().newCDPSession(q2);
  await c.step(q2,"Esc closes the first-run card; 2 frames",async q=>{ await H.esc(q); await H.frames(q,2); });
  const tc=async (end)=>{ const a=await H.railStart(q2,360), b=await H.railX(q2,390); const c0=await H.ev(q2,()=>clock);
    await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:a.x,y:a.y}]}); await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:b.x,y:a.y}]});
    await cdp.send("Input.dispatchTouchEvent",{type:end,touchPoints:[]}); const c1=await H.ev(q2,()=>clock);
    const m0=await H.railX(q2,600), m1=await H.railX(q2,720); await q2.mouse.move(m0.x,a.y); await q2.mouse.move((m0.x+m1.x)/2,a.y); await q2.mouse.move(m1.x,a.y); const c2=await H.ev(q2,()=>clock);
    await q2.mouse.move(m1.x,a.y-200); return {c0,afterTouch:c1,afterHover:c2}; };
  await c.step(q2,"a touch on the rail at 06:00 moved to 06:30 and ended (touchEnd); then the mouse moved along the rail 10:00-12:00 with no button",()=>tc("touchEnd"));
  const te=c.last().ret;
  await c.step(q2,"a touch on the rail at 06:00 moved to 06:30 and cancelled (touchCancel: the system took the touch); then the mouse moved along the rail with no button",()=>tc("touchCancel"));
  const tcx=c.last().ret;
  c.out.touch={ended:te,cancelled:tcx};
  c.check("touch-cancel-no-hover-scrub",Math.abs(te.afterHover-te.afterTouch)<1e-6&&Math.abs(tcx.afterHover-tcx.afterTouch)<1e-6,"after a touch on the rail ends or is cancelled, a buttonless mouse over the rail does not move the clock",{ended:te,cancelled:tcx});
  await c.step(q2,"a mouse press on the rail, released (control): the hover after it",async q=>{ await H.dragRail(q,600,640,3); const a=await H.railX(q,800); const c0=await H.ev(q,()=>clock); await q.mouse.move(a.x,a.y); return {c0,after:await H.ev(q,()=>clock)}; });
  c.out.touch.mouseControl=c.last().ret;
  await q2.context().close();
  /* state finding 8: a desktop page opened in a small window, then enlarged */
  const q3=await c.page("desk-small",[880,660],{dpr:2});
  const TIER=()=>({lowTier, pixelRatio:renderer.getPixelRatio(), castShadow:sun.castShadow, dpr:window.devicePixelRatio, vw:[innerWidth,innerHeight], drawBuffer:[renderer.domElement.width,renderer.domElement.height]});
  await c.step(q3,"Esc closes the first-run card",H.esc);
  const t0=await H.ev(q3,TIER);
  await c.step(q3,"resize the window to 1600 x 900 (the browser's resize event); 10 frames",async q=>{ await q.setViewportSize({width:1600,height:900}); await H.frames(q,10); await q.waitForTimeout(500); return H.ev(q,TIER); });
  const t1=c.last().ret; c.out.tier={small:t0,enlarged:t1};
  c.check("tier-follows-window",t1.lowTier===false&&t1.pixelRatio===2&&t1.castShadow===true,"enlarged to 1600 x 900 on a density-2 screen: the full tier (pixel ratio 2, the sun's shadow), as a page opened at that size has",{small:t0,enlarged:t1});
  await q3.context().close();
});
