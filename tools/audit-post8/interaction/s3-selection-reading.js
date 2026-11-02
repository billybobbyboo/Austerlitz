#!/usr/bin/env node
/* Scenario 3: a formation selected and the clock played with Follow across phase boundaries; the selection and its dossier when the formation
   leaves the field, and when a "Whose eyes?" reading stops knowing it; the eye level with a selection. A visitor's page at 1600 x 900; real
   clicks and keys; the frames by the frame driver (ilib.js). */
"use strict";
const {run,H,I}=require("./irun.js");
run("s3-selection-reading",{viewport:[1600,900],page:"visitor"},async c=>{
  const p=await c.page("desk",[1600,900],{});
  /* observation only: which leaf formations leave the field, and when (goneAt reads the data) */
  c.out.gone=await H.ev(p,()=>{ const o=[]; for(const id in FORMATIONS){ const f=FORMATIONS[id]; if(!f.track) continue; if(goneAt(id,T_MAX)&&!goneAt(id,T_MIN)){ let t=T_MIN; while(t<=T_MAX&&!goneAt(id,t)) t+=1; o.push({id,name:f.name,goneAt:t,parent:f.parent||null}); } } return o; });
  c.note("formations leaving the field: "+JSON.stringify(c.out.gone));
  await c.step(p,"Esc closes the first-run card; 2 frames",async q=>{ await H.esc(q); await H.frames(q,2); });
  /* select Saint-Hilaire by a real click on its name on the map (the Overview at 04:00) */
  const pos=await H.ev(p,()=>{ const it=ML.items["n:sthilaire"]||ML.items["c:sthilaire"]; if(!it||!it.on||!it.rect) return null; return {x:(it.rect[0]+it.rect[2])/2,y:(it.rect[1]+it.rect[3])/2,key:it.key}; });
  c.note("Saint-Hilaire's map item: "+JSON.stringify(pos));
  if(pos) await c.step(p,"click Saint-Hilaire's name on the map (real mouse)",q=>q.mouse.click(pos.x,pos.y));
  else await c.step(p,"click the Order of battle tab; click Saint-Hilaire's row (real mouse; the row also centres the map)",async q=>{ await H.click(q,"#tab-oob"); await H.ev(q,()=>document.querySelector('.oob-row[data-id="sthilaire"]').scrollIntoView({block:"center"})); await H.click(q,'.oob-row[data-id="sthilaire"]'); });
  let s=c.last().s;
  c.check("select",s.selection==="f:sthilaire"&&s.drawer.on,"Saint-Hilaire selected, its card open",{selection:s.selection,drawer:s.drawer,follow:s.followBtn});
  const card0=await H.ev(p,()=>document.getElementById("drawer-body").textContent.replace(/\s+/g," ").trim().slice(0,600));
  /* Play with Follow across the 07:00 and 08:00 boundaries */
  await c.step(p,"click Follow if off; click Play",async q=>{ if(await H.ev(q,()=>freeCam)) await H.click(q,"#follow"); await H.click(q,"#play"); });
  await c.step(p,"frames until phase 1 (07:00) + 60",async q=>{ await H.until(q,"curPhase>=1",3000); await H.frames(q,60); });
  s=c.last().s; const card1=await H.ev(p,()=>document.getElementById("drawer-body").textContent.replace(/\s+/g," ").trim().slice(0,600));
  c.check("across-boundary",s.playing&&s.selection==="f:sthilaire"&&s.drawer.on&&!s.freeCam,"across 07:00 under Play: the selection and its card kept, Follow on",{clock:s.clock,phase:s.curPhase,selection:s.selection,drawer:s.drawer,freeCam:s.freeCam,cardChanged:card0!==card1});
  c.out.cards={card0,card1};
  await c.step(p,"frames until phase 2 + 30",async q=>{ await H.until(q,"curPhase>=2",3000); await H.frames(q,30); },{shot:"selected-playing-ph2"});
  s=c.last().s; const hl=await H.ev(p,()=>{ let lit=0,dim=0; for(const id in units){ const r=units[id]; if(r.hl===undefined) continue; if(r.hl) lit++; else dim++; } return {lit,dim,chapter:!!chapter}; });
  c.check("across-boundary-2",s.selection==="f:sthilaire"&&s.drawer.on,"across the next boundary: kept",{clock:s.clock,phase:s.curPhase,selection:s.selection,highlight:hl});
  /* a "Whose eyes?" reading that does not know it: pause at 07:30 by the rail's keys, then the Allied headquarters' reading by the timeline's button */
  await c.step(p,"click Pause; set up focus on the rail; Home, PageDown, ArrowRight x3 (07:30)",async q=>{ await H.click(q,"#play"); await H.focus(q,"#timerail"); for(const k of ["Home","PageDown","ArrowRight","ArrowRight","ArrowRight"]) await H.key(q,k); });
  await c.step(p,"click the Eyes button twice (everyone, Napoleon's, the Allied headquarters)",async q=>{ await H.click(q,"#eyesbtn"); await H.click(q,"#eyesbtn"); await H.frames(q,2); });
  s=c.last().s; const k1=await H.ev(p,()=>({hidden:readHidden("sthilaire"), know:drawnKnow("sthilaire"), card:document.getElementById("drawer-body").textContent.replace(/\s+/g," ").trim().slice(0,700),
    items:["n:sthilaire","c:sthilaire"].map(k=>ML.items[k]?{k,on:ML.items[k].on,disp:ML.items[k].el.style.display}:null), block:units.sthilaire&&units.sthilaire.block?units.sthilaire.block.visible:null,
    ring:typeof selRing!=="undefined"&&selRing?selRing.visible:null}));
  c.out.reading0730=k1;
  c.check("reading-hides",s.commandView==="al"&&s.selection==="f:sthilaire"&&(!k1.hidden||/Not known to/.test(k1.card)),"under the Allied reading at 07:30: the selection kept; if the reading does not know Saint-Hilaire, the card says so and shows no place",{commandView:s.commandView,hidden:k1.hidden,know:k1.know,items:k1.items,block:k1.block,cardHead:k1.card.slice(0,300)});
  await c.step(p,"click the card's centring control if any (expected: nothing moves while unknown)",async q=>{ const has=await H.ev(q,()=>{ const b=[...document.querySelectorAll("#drawer-body button")].find(x=>/centre|center|show on map|zoom/i.test(x.textContent)); if(!b) return null; b.dataset.iaC="1"; return b.textContent; });
    const cam0=await H.ev(q,()=>JSON.stringify(window.__aus.state().cam)); if(has){ await H.click(q,'#drawer-body button[data-ia-c="1"]'); await H.frames(q,60); } const cam1=await H.ev(q,()=>JSON.stringify(window.__aus.state().cam)); return {button:has,moved:cam0!==cam1}; });
  c.check("no-centre-unknown",!(k1.hidden&&c.last().ret.moved),"the map does not centre on a formation the reading does not know",c.last().ret);
  /* Play under the reading until it knows Saint-Hilaire (or 10:00) */
  await c.step(p,"click Play; frames until the reading knows Saint-Hilaire or 10:00",async q=>{ await H.click(q,"#play"); return H.until(q,"!readHidden('sthilaire')||clock>=600",6000); });
  s=c.last().s; const k2=await H.ev(p,()=>({hidden:readHidden("sthilaire"), know:drawnKnow("sthilaire"), clock:clock, card:document.getElementById("drawer-body").textContent.replace(/\s+/g," ").trim().slice(0,400)}));
  c.out.readingKnown=k2;
  c.check("reading-follows-clock",s.selection==="f:sthilaire"&&(!k2.hidden?!/Not known to/.test(k2.card.slice(0,200)):true),"when the reading comes to know it, the card shows it again (the dossier follows the reading, decision 251)",{clock:k2.clock,hidden:k2.hidden,know:k2.know,card:k2.card.slice(0,250)});
  await c.step(p,"click Pause; click the Eyes button (everyone)",async q=>{ await H.click(q,"#play"); await H.click(q,"#eyesbtn"); });
  s=c.last().s; c.check("reading-off",s.commandView==="none"&&s.selection==="f:sthilaire","everyone's reading again; selection kept",{commandView:s.commandView,selection:s.selection});
  /* a formation that leaves the field: select it from the Order of battle tab before it goes, then play past */
  const g=(c.out.gone||[]).filter(x=>x.goneAt>300).sort((a,b)=>a.goneAt-b.goneAt)[0];
  if(g){
    await c.step(p,"Esc (selection cleared); click the Order of battle tab; click the row of "+g.name,async q=>{ await H.esc(q); await H.click(q,"#tab-oob"); const ok=await H.ev(q,id=>{ const r=document.querySelector('.oob-row[data-id="'+id+'"]'); if(!r) return false; r.scrollIntoView({block:"center"}); return true; },g.id);
      if(ok) await H.click(q,'.oob-row[data-id="'+g.id+'"]'); else { const par=g.parent; await H.ev(q,id=>{ const r=document.querySelector('.oob-row[data-id="'+id+'"]'); if(r) r.scrollIntoView({block:"center"}); },par); await H.click(q,'.oob-row[data-id="'+par+'"]'); } return ok; });
    await c.step(p,"set up focus on the rail; ArrowLeft/Right to 20 min before it goes (keys); click Play; frames to 20 min after",async q=>{
      await H.focus(q,"#timerail"); await H.key(q,"Home"); const target=g.goneAt-20; let t=240; while(t+60<=target){ await H.key(q,"Shift+ArrowRight"); t+=60; } while(t+10<=target){ await H.key(q,"ArrowRight"); t+=10; }
      const before=await H.ev(q,()=>({clock,sel:selection&&selection.id,card:document.getElementById("drawer-body").textContent.replace(/\s+/g," ").trim().slice(0,300)}));
      await H.click(q,"#play"); await H.until(q,"clock>="+(g.goneAt+20),6000); return before; },{shot:"gone-formation-selected"});
    s=c.last().s; const kg=await H.ev(p,id=>({gone:goneAt(id,clock), sel:selection&&selection.id, block:units[id]&&units[id].block?units[id].block.visible:null, card:document.getElementById("drawer-body").textContent.replace(/\s+/g," ").trim().slice(0,500)}),g.id);
    c.out.goneCase={formation:g,before:c.last().ret,after:kg};
    c.check("gone-selection",kg.block!==true,"a formation that has left the field is not drawn; its card (if kept) says it has left",{formation:g.id,clock:s.clock,selection:s.selection,after:kg});
  }
  /* the eye level with a selection */
  await c.step(p,"click Pause; click the Command tab; choose Napoleon's headquarters; click the eye level",async q=>{ if(await H.ev(q,()=>playing)) await H.click(q,"#play"); await H.click(q,"#tab-command"); await H.click(q,'.cmd-btn[data-cv="fr"]'); await H.click(q,"#eyego"); await H.frames(q,60); },{shot:"eye-level-selected"});
  s=c.last().s; c.check("eye-with-selection",s.eye===true,"the eye level entered with a selection",{eye:s.eye,selection:s.selection,eyecap:s.panels.eyecap,drawer:s.drawer});
  await c.step(p,"click Play; 120 frames at the eye level",async q=>{ await H.click(q,"#play"); await H.frames(q,120); });
  s=c.last().s; c.check("eye-play",s.eye===true&&s.playing,"Play at the eye level keeps the eye (Follow does not move it)",{eye:s.eye,playing:s.playing,freeCam:s.freeCam,cam:s.cam});
  await c.step(p,"Esc; Esc; Esc",async q=>{ await H.esc(q); await H.esc(q); await H.esc(q); await H.frames(q,60); });
  s=c.last().s; c.check("esc-after-eye",s.selection===null,"Esc clears the selection; the eye level and the reading as left",{eye:s.eye,commandView:s.commandView,selection:s.selection,playing:s.playing});
  c.out.listeners=await I.counts(p);
});
