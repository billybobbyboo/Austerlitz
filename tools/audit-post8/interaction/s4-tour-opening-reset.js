#!/usr/bin/env node
/* Scenario 4: the opening and the guided tour interrupted by every way (Esc, a press on the map, a key, a drag, the wheel), then begun again;
   and a reset after a complex sequence (the tour, a reading, the eye level, the Plans tab, the paper map) by the ways back (the Overview,
   Esc, the tools), compared with the state a fresh page shows. A visitor's page at 1600 x 900; real clicks, keys, drags and wheel; frames by
   the frame driver (ilib.js). */
"use strict";
const {run,H,I}=require("./irun.js");
const ENDKEYS=["opening","openingPlay","tourStep","playing","speed","presentation","mode","commandView","TOURCV","eye","plan","chapter","selection","factor"];
function pick(s){ const o={}; ENDKEYS.forEach(k=>o[k]=s[k]); o.tourbar=s.panels.tourbar; o.hideDispatch=s.panels.hideDispatch; o.dispatch=s.panels.dispatchVisible; o.tab=s.panels.tab; o.layers=s.panels.layers; return o; }
run("s4-tour-opening-reset",{viewport:[1600,900],page:"visitor"},async c=>{
  const p=await c.page("desk",[1600,900],{});
  const cen=async q=>H.ev(q,()=>{ const fr=landFreeRect(); return [Math.round((fr[0]+fr[2])/2),Math.round((fr[1]+fr[3])/2)]; });
  const begin=async q=>{ await H.click(q,"#openingbtn"); await H.frames(q,70); };
  await c.step(p,"Esc closes the first-run card; 2 frames",async q=>{ await H.esc(q); await H.frames(q,2); });
  const fresh=pick(c.last().s); c.out.fresh=fresh; c.out.freshListeners=await I.counts(p);
  /* the opening: begun, ended by Esc, begun again */
  await c.step(p,"click 'Begin the opening'; 70 frames",begin);
  let s=c.last().s, step1=pick(s); c.out.openingStep1=step1;
  c.check("opening-begins",s.opening&&s.openingK===0&&s.panels.tourbar,"the opening at its first step",step1);
  await c.step(p,"Esc (the opening skipped to the day's start)",async q=>{ await H.esc(q); await H.frames(q,70); });
  s=c.last().s; c.check("opening-esc",!s.opening&&s.tourStep===-1&&s.clock===240&&s.presentation==="study"&&s.speed===0.5&&s.focus==="#play"&&!s.panels.tourbar&&!s.panels.hideDispatch,"Esc: the end state (04:00, Study, ½×, Play focused, the bar hidden, the dispatch shown)",pick(s));
  await c.step(p,"click 'Begin the opening' again; 70 frames",begin);
  s=c.last().s; c.check("opening-again-1",s.opening&&s.openingK===0&&JSON.stringify(pick(s))===JSON.stringify(step1),"begun again: the same first step",{again:pick(s),first:step1});
  /* the stretch interrupted by a press on the map */
  await c.step(p,"click Next (the stretch plays at 4×); 60 frames",async q=>{ await H.click(q,"#tour-next"); await H.frames(q,60); });
  s=c.last().s; const st=s.openingPlay; c.check("stretch-plays",s.opening&&!!st&&s.playing&&s.speed===4,"Next plays the stretch at 4×",{openingPlay:st,playing:s.playing,speed:s.speed,clock:s.clock});
  await c.step(p,"press on the map (real mouse click at the free centre)",async q=>{ const [x,y]=await cen(q); await q.mouse.click(x,y); await H.frames(q,10); });
  s=c.last().s; c.check("stretch-pointer",!s.opening&&!s.playing&&s.speed===0.5&&!s.panels.tourbar&&!s.panels.hideDispatch&&s.tourStep===-1,"a press on the map ends the opening where it is: stopped, ½× back, the bar hidden, the dispatch back",pick(s));
  await c.step(p,"click 'Begin the opening' again; 70 frames",begin);
  s=c.last().s; c.check("opening-again-2",s.opening&&s.openingK===0&&s.clock===step1.clock,"begun again after the press: first step, its clock",{clock:s.clock,expected:step1.clock,k:s.openingK});
  /* the stretch interrupted by a key (2: Watch) */
  await c.step(p,"click Next; 40 frames; key 2",async q=>{ await H.click(q,"#tour-next"); await H.frames(q,40); await H.key(q,"2"); await H.frames(q,10); });
  s=c.last().s; c.check("stretch-key",!s.opening&&!s.playing&&s.speed===0.5&&s.presentation==="watch"&&s.focusVisible!==false,"a key ends it in place and does its own action (Watch); speed back; focus on a visible control",Object.assign(pick(s),{focus:s.focus,focusVisible:s.focusVisible}));
  await c.step(p,"key 1 (Study); click 'Begin the opening'; 70 frames",async q=>{ await H.key(q,"1"); await begin(q); });
  s=c.last().s; c.check("opening-again-3",s.opening&&s.openingK===0,"begun again from Study",{k:s.openingK,clock:s.clock});
  /* the step interrupted by a drag on the map (the camera taken) */
  await c.step(p,"click Next twice (straight to step 2); 70 frames; drag the map 120 px (real mouse)",async q=>{ await H.click(q,"#tour-next"); await H.click(q,"#tour-next"); await H.frames(q,70);
    const [x,y]=await cen(q); await q.mouse.move(x,y); await q.mouse.down(); for(let i=1;i<=6;i++) await q.mouse.move(x+20*i,y+5*i); await q.mouse.up(); await H.frames(q,5); });
  s=c.last().s; c.check("step-drag",!s.opening&&s.freeCam&&!s.panels.tourbar&&s.speed===0.5,"a drag ends the opening where it is (camera taken), Follow off",pick(s));
  await c.step(p,"click 'Begin the opening'; 70 frames; wheel over the map",async q=>{ await begin(q); const [x,y]=await cen(q); await q.mouse.move(x,y); await q.mouse.wheel(0,-240); await H.frames(q,5); });
  s=c.last().s; c.check("step-wheel",!s.opening&&s.freeCam,"the wheel ends it (camera taken)",pick(s));
  /* "?" over the opening, then Esc twice */
  await c.step(p,"click 'Begin the opening'; 70 frames; key ? ; Esc ; Esc",async q=>{ await begin(q); await H.key(q,"?"); const a=await H.ev(q,()=>({help:helpOpen(),opening:OPENING.on})); await H.esc(q); const b=await H.ev(q,()=>({help:helpOpen(),opening:OPENING.on})); await H.esc(q); await H.frames(q,70); return {a,b}; });
  s=c.last().s; const r=c.last().ret; c.check("help-over-opening",r.a.help&&r.a.opening&&!r.b.help&&r.b.opening&&!s.opening&&s.clock===240,"? opens over the opening; the first Esc closes the overlay only; the second skips to the start",{r,end:pick(s)});
  /* the opening run to its end by Next (Next twice per step goes straight there) */
  await c.step(p,"click 'Begin the opening'; Next x8 with 70 frames after each pair",async q=>{ await begin(q); for(let i=0;i<4;i++){ await H.click(q,"#tour-next"); if(await H.ev(q,()=>OPENING.on&&!!OPENING.play)) await H.click(q,"#tour-next"); await H.frames(q,70); } });
  s=c.last().s; c.check("opening-finish",!s.opening&&s.clock===240&&s.focus==="#play"&&s.speed===0.5,"Finish: the end state",pick(s));
  /* the guided tour: a press on the map, a key, a drag (the tour stays: only its own buttons, Esc and the tour button end it) */
  await c.step(p,"click 'Guided tour'; 70 frames",async q=>{ await H.click(q,"#tourbtn"); await H.frames(q,70); });
  s=c.last().s; const tour1=pick(s); c.out.tour1=tour1;
  c.check("tour-begins",s.tourStep===0&&s.panels.tourbar&&s.panels.hideDispatch,"the tour at stop 1, the dispatch hidden",tour1);
  await c.step(p,"press on the map; 10 frames",async q=>{ const [x,y]=await cen(q); await q.mouse.click(x,y); await H.frames(q,10); });
  s=c.last().s; c.out.tourAfterPress=pick(s);
  await c.step(p,"key 2 (Watch) during the tour; 10 frames",async q=>{ await H.key(q,"2"); await H.frames(q,10); },{shot:"tour-in-watch"});
  s=c.last().s; c.out.tourInWatch=Object.assign(pick(s),{caption:s.caption,capVisible:s.capVisible});
  await c.step(p,"click Next in the tour bar (in Watch); 70 frames",async q=>{ await H.click(q,"#tour-next"); await H.frames(q,70); });
  s=c.last().s; c.check("tour-next-in-watch",s.tourStep===1&&s.presentation==="watch","the tour steps on in Watch",pick(s));
  await c.step(p,"key 1; drag the map; 10 frames",async q=>{ await H.key(q,"1"); const [x,y]=await cen(q); await q.mouse.move(x,y); await q.mouse.down(); for(let i=1;i<=6;i++) await q.mouse.move(x-20*i,y); await q.mouse.up(); await H.frames(q,10); });
  s=c.last().s; c.out.tourAfterDrag=pick(s);
  await c.step(p,"click Play during the tour; 150 frames",async q=>{ await H.click(q,"#play"); await H.frames(q,150); },{draw:"tour-playing"});
  s=c.last().s; const bar=await H.ev(p,()=>({n:document.getElementById("tour-n").textContent,t:document.getElementById("tour-t").textContent,stopClock:fmtClock(stopClock(TOUR[tourStep]))}));
  c.out.tourPlaying={state:pick(s),bar,clockText:s.clockText,caption:s.caption};
  c.note("the tour bar while the clock plays away from its stop: "+JSON.stringify({bar,clock:s.clockText}));
  await c.step(p,"Esc (ends the tour)",async q=>{ await H.esc(q); await H.frames(q,10); });
  s=c.last().s; c.check("tour-esc",s.tourStep===-1&&!s.panels.tourbar&&!s.panels.hideDispatch&&s.TOURCV===null,"Esc ends the tour: the bar hidden, the dispatch back",pick(s));
  await c.step(p,"click Pause if playing; click 'Guided tour' again; 70 frames",async q=>{ if(await H.ev(q,()=>playing)) await H.click(q,"#play"); await H.click(q,"#tourbtn"); await H.frames(q,70); });
  s=c.last().s; c.check("tour-again",s.tourStep===0&&s.clock===tour1.clock&&s.panels.tourbar,"begun again: stop 1 at its clock",{clock:s.clock,expected:tour1.clock,tour:s.tourStep});
  /* the complex sequence: the tour (now at stop 1), a reading, the eye level, the Plans tab, the paper map */
  await c.step(p,"tour: Next; the Eyes button (Napoleon's); Command tab; eye level; 60 frames",async q=>{ await H.click(q,"#tour-next"); await H.frames(q,70); await H.click(q,"#eyesbtn"); await H.click(q,"#tab-command"); await H.click(q,"#eyego"); await H.frames(q,60); });
  s=c.last().s; c.out.complex1=pick(s);
  await c.step(p,"Plans tab; click 'both plans'; key M (paper map); 60 frames",async q=>{ await H.click(q,"#tab-plans"); const b=await H.ev(q,()=>[...document.querySelectorAll(".plan-btn")].map(x=>x.dataset.p)); const k=b.indexOf("both")>=0?"both":b[0]; await H.click(q,'.plan-btn[data-p="'+k+'"]'); await H.key(q,"m"); await H.frames(q,60); return b; },{shot:"complex-paper"});
  s=c.last().s; c.out.complex2=Object.assign(pick(s),{eye:s.eye,eyecap:s.panels.eyecap});
  c.check("paper-leaves-eye",!(s.mode==="staff"&&s.eye),"the paper map is not at the eye level",{mode:s.mode,eye:s.eye,eyecap:s.panels.eyecap});
  /* the ways back */
  await c.step(p,"click the Overview vantage; 70 frames",async q=>{ await H.click(q,'.van-btn[data-v="plan"]'); await H.frames(q,70); });
  c.out.back1=pick(c.last().s);
  await c.step(p,"Esc x4 (one at a time, 10 frames after each)",async q=>{ const r=[]; for(let i=0;i<4;i++){ await H.esc(q); await H.frames(q,10); r.push(await H.ev(q,()=>({tour:tourStep,sel:selection&&selection.id,chapter,plan:planSide,mode,cv:commandView,eye:EYE.on,pres:presentation,hide:hideDispatch}))); } return r; });
  s=c.last().s; c.out.back2={state:pick(s),escs:c.last().ret};
  await c.step(p,"key M twice (back to the landscape); click the Eyes button until everyone; click the plan button off",async q=>{ await H.key(q,"m"); await H.key(q,"m"); let n=0; while(await H.ev(q,()=>commandView!=="none")&&n++<3) await H.click(q,"#eyesbtn"); const pl=await H.ev(q,()=>planSide); if(pl){ await H.click(q,"#tab-plans"); await H.click(q,'.plan-btn[data-p="'+pl+'"]'); } await H.frames(q,70); });
  s=c.last().s; const fin=pick(s); c.out.final=fin;
  const diff=Object.keys(fresh).filter(k=>JSON.stringify(fresh[k])!==JSON.stringify(fin[k])&&k!=="tab");
  c.check("reset-matches-fresh",diff.length===0,"after the ways back, every reading of the state as on a fresh page (the clock aside)",{differs:diff.map(k=>({k,fresh:fresh[k],now:fin[k]}))});
  c.out.listeners=await I.counts(p);
});
