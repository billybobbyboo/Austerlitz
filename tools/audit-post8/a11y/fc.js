#!/usr/bin/env node
/* Final audit after Stage 8, area a11y: FORCED COLOURS (forced-colors: active, Chromium's emulation with its default palette: not Windows' own
   contrast themes), then REDUCED MOTION turned on live, then the phase text's "press D" hint with the single-key shortcuts off. Visitor's page,
   1600 x 900, real input. Forced colours: which pressed and selected states keep a mark that is not a colour (the colours are replaced), the
   focus ring, the colour key's swatches, crops of the groups. Reduced motion: a vantage pressed (real click) and the camera's place after
   150 ms and after 2.5 s; the panels' transitions. The hint: the switch off (the ? button, Space), the guided tour (real click), D pressed.
   node tools/audit-post8/a11y/fc.js */
"use strict";
const L=require("./alib.js");
L.run("fc",async(b,R,log)=>{
  const p=await L.openV(b,[1600,900],{forced:true});
  await L.wait(2500);
  R.step("forced colours: media",{forced:await L.P(p,()=>matchMedia("(forced-colors: active)").matches),fcaNone:await L.P(p,()=>[...document.querySelectorAll("*")].filter(e=>getComputedStyle(e).forcedColorAdjust==="none").length)});
  await R.shot(p,"01-first");
  R.step("first screen (the card), forced colours",{swatches:await L.P(p,()=>[...document.querySelectorAll("#fr-key .key-sw")].map(e=>{ const c=getComputedStyle(e); return {bg:c.backgroundColor,border:c.borderColor,fca:c.forcedColorAdjust}; })),
    primary:await L.P(p,()=>{ const a=getComputedStyle(document.getElementById("fr-tour")), z=getComputedStyle(document.getElementById("fr-close")); return {primary:[a.backgroundColor,a.color,a.borderColor,a.borderWidth,a.fontWeight],other:[z.backgroundColor,z.color,z.borderColor,z.borderWidth,z.fontWeight]}; })});
  await p.keyboard.press("Escape"); await L.wait(2000);
  await R.shot(p,"02-explore");
  /* pressed and selected states: the non-colour properties of the pressed against the unpressed in each group */
  const diff=await L.P(p,()=>{
    const K=["fontWeight","borderTopWidth","borderTopStyle","borderBottomWidth","borderBottomStyle","textDecorationLine","outlineStyle","outlineWidth","boxShadow","opacity","fontStyle","textTransform"];
    const C=["color","backgroundColor","borderTopColor","borderBottomColor"];
    const G=[[".vm-btn",'[aria-pressed="true"]'],[".van-btn",'[aria-pressed="true"]'],[".spd-btn",'[aria-pressed="true"]'],[".tab-btn",'[aria-selected="true"]'],[".cmd-btn",'[aria-pressed="true"]'],["#phases button",'[aria-current="true"]'],[".act-btn",'[aria-current="true"]']];
    return G.map(([s,on])=>{ const all=[...document.querySelectorAll(s)]; const a=all.find(e=>e.matches(on)), z=all.find(e=>!e.matches(on)); if(!a||!z) return {group:s,missing:true};
      const ca=getComputedStyle(a), cz=getComputedStyle(z), d={}, dc={};
      K.forEach(k=>{ if(ca[k]!==cz[k]) d[k]=[ca[k],cz[k]]; }); C.forEach(k=>{ if(ca[k]!==cz[k]) dc[k]=[ca[k],cz[k]]; });
      return {group:s,on:a.textContent.trim().slice(0,20),off:z.textContent.trim().slice(0,20),nonColourDiff:d,colourDiff:dc,markLeft:Object.keys(d).length>0||Object.keys(dc).length>0}; });
  });
  R.step("pressed and selected states under forced colours (computed)",{groups:diff});
  const crop=async(name,sel)=>{ const bx=await L.P(p,s=>{ const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect(); return {x:Math.max(0,r.left-6),y:Math.max(0,r.top-6),width:Math.min(innerWidth,r.width+12),height:Math.min(innerHeight-Math.max(0,r.top-6),r.height+12)}; },sel); if(bx&&bx.width>2&&bx.height>2) await R.clip(p,name,bx); };
  await crop("03-viewmode","#viewmode"); await crop("04-tools",".tools"); await crop("05-timebar",".timebar"); await crop("06-tabs",".tabs");
  /* the focus ring: Tab from Play's place (focus on Play after Esc) */
  await p.keyboard.press("Tab"); await L.wait(400);
  const f=await L.P(p,()=>__a11y.fi());
  R.step("Tab (real key): the focused control's ring under forced colours",{fi:f});
  if(f.box) await R.clip(p,"07-focus",{x:Math.max(0,f.box[0]-12),y:Math.max(0,f.box[1]-12),width:f.box[2]+24,height:f.box[3]+24});
  /* the legend opened (its swatches) and the layers panel */
  await L.click(p,"#lg-toggle"); await L.wait(800); await crop("08-legend",".legend");
  await L.click(p,"#layersbtn"); await L.wait(1200); await crop("09-layers","#layerpop");
  R.step("legend and layers opened (real clicks)",{legendSw:await L.P(p,()=>[...document.querySelectorAll(".legend .sw")].slice(0,4).map(e=>getComputedStyle(e).backgroundColor)),layerPressed:await L.P(p,()=>{ const a=document.querySelector('.layer-btn[aria-pressed="true"]'), z=document.querySelector('.layer-btn[aria-pressed="false"]'); if(!a||!z) return null; const ca=getComputedStyle(a), cz=getComputedStyle(z); return {on:[ca.backgroundColor,ca.color,ca.borderLeftColor,ca.borderLeftWidth,ca.fontWeight],off:[cz.backgroundColor,cz.color,cz.borderLeftColor,cz.borderLeftWidth,cz.fontWeight]}; })});
  await p.keyboard.press("Escape"); await L.wait(800);
  /* a formation's dossier under forced colours */
  const t=await L.formationTarget(p);
  if(t){ await p.mouse.click(t.x,t.y); await L.wait(2500); await R.shot(p,"10-dossier");
    /* the full dossier (real click on its button): its targets (WCAG 2.5.8) with the day-track's anchors */
    const mb=await L.center(p,"#drawer-body .more-btn"); if(mb&&mb.vis){ await p.mouse.click(mb.x,mb.y); await L.wait(2500); }
    R.step("a formation clicked (real mouse): "+t.name+"; its full dossier (real click)",{t,targets:await L.P(p,()=>{ const T=__a11y.targets(); return {n:T.n,failing:T.small.filter(x=>x.spacing!=="passes"&&!/ev-mark|button\.step/.test(x.el))}; }),
      dtAnchors:await L.P(p,()=>[...document.querySelectorAll(".dt-a")].slice(0,30).map(g=>{ const r=g.getBoundingClientRect(); return [Math.round(r.left),Math.round(r.top),+r.width.toFixed(1),+r.height.toFixed(1)]; })),
      headings:await L.P(p,()=>[...document.querySelectorAll("#drawer-body h2,#drawer-body h3,#drawer-body h4")].map(h=>h.tagName+" "+h.textContent.trim().slice(0,60)))});
    await R.shot(p,"10b-full-dossier");
    await p.keyboard.press("Escape"); await L.wait(1200); }
  /* reduced motion, turned on live */
  await p.emulateMedia({reducedMotion:"reduce",forcedColors:"none"}); await L.wait(1200);
  const rmState=await L.P(p,()=>({RM:typeof RM!=="undefined"?RM:null,drawerTr:getComputedStyle(document.getElementById("drawer")).transitionDuration,railTr:getComputedStyle(document.querySelector(".rail")).transitionDuration,anims:document.getAnimations().length}));
  const camAt=()=>L.P(p,()=>[+landCam.position.x.toFixed(1),+landCam.position.y.toFixed(1),+landCam.position.z.toFixed(1)]);
  const c0=await camAt();
  await L.click(p,'.van-btn[data-v="plateau"]'); await L.wait(150); const c1=await camAt(); await L.wait(2500); const c2=await camAt();
  R.step("reduced motion on (live); the Pratzen vantage pressed (real click): the camera at 150 ms and at 2.5 s",{rmState,c0,c150:c1,c2500:c2,cutAt150:Math.hypot(c1[0]-c2[0],c1[1]-c2[1],c1[2]-c2[2])<0.5});
  await R.shot(p,"11-rm-pratzen");
  await p.emulateMedia({reducedMotion:"no-preference"}); await L.wait(800);
  await L.click(p,'.van-btn[data-v="plan"]'); await L.wait(150); const d1=await camAt(); await L.wait(3000); const d2=await camAt();
  R.step("reduced motion off again; the Overview pressed: the camera at 150 ms and at 3 s (a glide for comparison)",{c150:d1,c3000:d2,gliding:Math.hypot(d1[0]-d2[0],d1[1]-d2[1],d1[2]-d2[2])>=0.5});
  /* the phase text's hint with the shortcuts off */
  await L.click(p,"#helpbtn"); await L.wait(1000);
  await L.P(p,()=>document.getElementById("help-keys").focus()); await p.keyboard.press("Space"); await L.wait(300);
  const sw=await L.P(p,()=>document.getElementById("help-keys").getAttribute("aria-pressed"));
  await p.keyboard.press("Escape"); await L.wait(800);
  await L.click(p,"#tourbtn"); await L.wait(3000);
  const hint0=await L.P(p,()=>({now:__a11y.text("#now",300),hide:hideDispatch,tour:tourStep}));
  await L.P(p,()=>{ const e=document.activeElement; if(e&&e.blur) e.blur(); });
  await p.keyboard.press("d"); await L.wait(800);
  const hint1=await L.P(p,()=>({now:__a11y.text("#now",300),hide:hideDispatch,tour:tourStep}));
  await R.shot(p,"12-tour-hint");
  R.step("shortcuts off (the ? button by real click, the switch by Space, Esc); the guided tour (real click); D (real key) with nothing focused",{switchPressed:sw,before:hint0,afterD:hint1});
  R.console=p._log.slice(0,30);
});
