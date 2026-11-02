#!/usr/bin/env node
/* Final audit after Stage 8, area a11y: the KEYBOARD, by real key presses on a visitor's page.
   node tools/audit-post8/a11y/kbd.js 1600x900
   1. focus at load and Tab inside the first-run card; Esc. 2. the whole Tab cycle from Play back to Play: every stop with its computed role and
   name (CDP), box, visibility, opacity, what covers it, its ring (computed), inert or aria-hidden ancestors; a clip of the first stop of each kind
   to see the ring. 3. operability from set starting points (focused by script, said so in each step): Layers, the guided tour, a map item and
   Esc, the Whose-eyes button, the legend's toggle, a presentation change with focus on a control it hides, Clean, the paper map. 4. the full
   accessibility tree (compacted) after the card: headings, landmarks, live regions, unnamed controls. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./alib.js");
const [W,H]=(process.argv[2]||"1600x900").split("x").map(Number);
const HARN=process.argv[3]==="harness";   /* the harness page (?harness=1: no drift, frames on demand): the same interface and Tab order, far fewer frames on a loaded machine */
const tag="kbd-"+(HARN?"h-":"")+W+"x"+H;
L.run(tag,async(b,R,log)=>{
  const p=await L.openV(b,[W,H],{harness:HARN});
  await L.wait(2500);
  const fiAx=async()=>({fi:await L.P(p,()=>__a11y.fi()), ax:await L.ax(p)});
  const st=()=>L.A.state(p);
  R.step("at load"+(HARN?" (harness page)":" (the card open)"),Object.assign(await fiAx(),{card:await L.P(p,()=>typeof firstRunOpen!=="undefined"&&firstRunOpen)}));
  const card=[];
  for(let i=0;i<6;i++){ await p.keyboard.press("Tab"); await L.wait(150); const f=await L.P(p,()=>__a11y.fi()); card.push(f.el); }
  R.step("Tab x6 inside the card",{stops:card});
  await p.keyboard.press("Escape"); await L.wait(1500);
  R.step("Esc: the card closed",Object.assign(await fiAx(),{state:await st()}));
  /* the full accessibility tree after the card */
  const tree=await L.axTree(p);
  fs.writeFileSync(path.join(L.EV,tag+"-axtree.json"),JSON.stringify(tree));
  const unnamed=tree.filter(n=>/^(button|link|tab|slider|checkbox|menuitem|switch|textbox|combobox)$/.test(n.role)&&!n.name);
  const imgs=tree.filter(n=>/^(img|image|graphics-symbol)$/.test(n.role));
  R.step("accessibility tree (compacted; saved)",{nodes:tree.length,roles:tree.reduce((a,n)=>{ a[n.role]=(a[n.role]||0)+1; return a; },{}),
    headings:tree.filter(n=>n.role==="heading").map(n=>"h"+(n.props.level||"?")+" "+n.name.slice(0,70)),
    landmarks:tree.filter(n=>/^(main|navigation|region|complementary|banner|contentinfo|form|search|dialog|alertdialog)$/.test(n.role)).map(n=>n.role+" '"+n.name.slice(0,60)+"'"+(n.props.modal?" modal":"")),
    live:tree.filter(n=>n.props.live).map(n=>n.role+" "+n.props.live+" '"+n.name.slice(0,60)+"'"),
    unnamed:unnamed.map(n=>n.role), imgsNoName:imgs.filter(n=>!n.name).length, imgs:imgs.slice(0,12).map(n=>n.name.slice(0,80)),
    dupIds:await L.P(p,()=>__a11y.ids())});
  /* the Tab cycle from Play */
  const stops=[], kinds={};
  const first=(await L.P(p,()=>__a11y.fi())).el;
  for(let i=0;i<400;i++){
    await p.keyboard.press("Tab"); await L.wait(120);
    const f=await L.P(p,()=>__a11y.fi()), a=f.body?null:await L.ax(p);
    const kind=f.body?"body":f.el.replace(/#[^.]+/,"").replace(/\..*/,"")+"."+(f.el.split(".")[1]||"");
    const s={i:i+1,el:f.el,role:a&&a.role,name:a&&a.name&&a.name.slice(0,90),box:f.box,vis:f.vis,opacity:f.opacity,onScreen:f.onScreen,fullOn:f.fullOn,
      fv:f.fv,ring:f.ring&&(f.ring.os+" "+f.ring.ow+" "+f.ring.oc+(f.ring.bs!=="none"?" +shadow":"")),covered:f.covered,inert:f.inert,ariaHidden:f.ariaHidden,inMap:f.inMap};
    stops.push(s);
    if(!HARN&&!f.body&&!kinds[kind]&&f.onScreen&&f.box&&Object.keys(kinds).length<16){   /* no clips on the harness run: each waits for a frame of the starved GPU process */ kinds[kind]=1;
      const bx={x:Math.max(0,f.box[0]-10),y:Math.max(0,f.box[1]-10),width:Math.min(W-Math.max(0,f.box[0]-10),f.box[2]+20),height:Math.min(H-Math.max(0,f.box[1]-10),f.box[3]+20)};
      if(bx.width>2&&bx.height>2) await R.clip(p,"ring-"+String(i+1).padStart(3,"0"),bx); }
    if(i>3&&f.el===first) break;
  }
  const bad=stops.filter(s=>!s.vis||!s.onScreen||s.opacity<0.5||(s.covered&&((s.covered.how==="hit"&&s.covered.tot&&s.covered.hit===0)||(s.covered.how==="panels"&&s.covered.frac>0.5)))||s.inert||s.ariaHidden||(!s.name&&s.el!=="body")||(s.ring&&/^none/.test(s.ring)&&!/\+shadow/.test(s.ring)));
  R.step("the Tab cycle from Play back to Play",{n:stops.length,returned:stops.length&&stops[stops.length-1].el===first,problems:bad.length,problemStops:bad,
    order:stops.map(s=>s.i+" "+s.el+" | "+s.role+" | "+(s.name||"").slice(0,50))});
  fs.writeFileSync(path.join(L.EV,tag+"-stops.json"),JSON.stringify(stops,null,1));
  /* operability from set starting points */
  const fromFocus=async(sel,name,keys,after)=>{
    const ok=await L.P(p,s=>{ const e=document.querySelector(s); if(!e) return false; e.focus(); return document.activeElement===e; },sel);
    const r={set:sel,ok,seq:[]};
    for(const k of keys){ await p.keyboard.press(k); await L.wait(k==="Enter"?1500:400); const f=await fiAx(); r.seq.push({key:k,el:f.fi.el,role:f.ax&&f.ax.role,name:f.ax&&f.ax.name&&f.ax.name.slice(0,80),vis:f.fi.vis,onScreen:f.fi.onScreen}); }
    if(after) r.after=await L.P(p,after);
    R.step(name+" (set-up: "+sel+" focused by script; then real keys "+keys.join(", ")+")",r);
    return r;
  };
  await fromFocus("#layersbtn","Layers: open, Tab, Esc",["Enter","Tab","Tab","Escape"],()=>({pop:!document.getElementById("layerpop").hidden,expanded:document.getElementById("layersbtn").getAttribute("aria-expanded")}));
  await fromFocus("#tourbtn","Guided tour: start, Tab, Esc",["Enter","Tab","Escape"],()=>({tour:tourStep,bar:!document.getElementById("tourbar").hidden}));
  /* a map item: the first visible ml-item that is a button */
  const mi=await L.P(p,()=>{ const e=[...document.querySelectorAll("#maplayer .ml-item[role=button]")].find(x=>__a11y.vis(x)&&parseFloat(getComputedStyle(x).opacity)>0.5); if(!e) return null; e.setAttribute("data-a11y-pick","1"); return e.getAttribute("aria-label"); });
  if(mi){ await fromFocus('[data-a11y-pick="1"]',"A map item: Enter, then Esc",["Enter","Escape"],()=>({sel:selection&&selection.kind+":"+selection.id,drawer:document.getElementById("drawer").classList.contains("on")}));
    R.step("the map item used",{label:mi}); }
  await fromFocus("#eyesbtn","Whose eyes? button: Enter x3",["Enter","Enter","Enter"],()=>({cv:commandView,label:document.getElementById("eyesbtn").getAttribute("aria-label"),text:document.getElementById("eyesbtn").textContent}));
  await fromFocus("#lg-toggle","The legend's toggle: Enter x2",["Enter","Enter"],()=>({expanded:document.getElementById("lg-toggle").getAttribute("aria-expanded"),cls:document.querySelector(".legend").className}));
  /* a presentation change by its key with focus on a control it hides: the rail's sources button, then 2 (Watch) */
  await fromFocus("#srcbtn","Watch by key 2 with focus in the rail",["2"],()=>({pres:presentation,active:__a11y.fi()}));
  await R.shot(p,"watch");
  const watchStops=[];
  for(let i=0;i<40;i++){ await p.keyboard.press("Tab"); await L.wait(120); const f=await L.P(p,()=>__a11y.fi()); watchStops.push(f.el+(f.vis&&f.onScreen?"":" [NOT SHOWN]")); if(i>2&&watchStops[i]===watchStops[0]) break; }
  R.step("Watch: the Tab cycle (first 40)",{stops:watchStops});
  await p.keyboard.press("3"); await L.wait(1500);
  await R.shot(p,"clean");
  const cleanStops=[];
  for(let i=0;i<30;i++){ await p.keyboard.press("Tab"); await L.wait(120); const f=await L.P(p,()=>__a11y.fi()); cleanStops.push(f.el+(f.vis&&f.onScreen?"":" [NOT SHOWN]")); }
  R.step("Clean (key 3): the Tab stops (first 30)",{pres:(await st()).presentation,stops:cleanStops,restore:await L.P(p,()=>__a11y.text("#restore"))});
  await p.keyboard.press("Escape"); await L.wait(1500);
  R.step("Esc from Clean",Object.assign(await fiAx(),{pres:(await st()).presentation}));
  /* the paper map by M; Tab to the map layer and read its name */
  await L.P(p,()=>{ const e=document.activeElement; if(e&&e.blur) e.blur(); });
  await p.keyboard.press("m"); await L.wait(2500);
  await L.P(p,()=>document.getElementById("maplayer").focus());
  R.step("paper map (key M); set-up: the map layer focused by script",await fiAx());
  const c0=await L.P(p,()=>MAPCAM&&MAPCAM.c?[MAPCAM.c[0],MAPCAM.c[1]]:null);
  await p.keyboard.press("ArrowRight"); await p.keyboard.press("+"); await L.wait(800);
  R.step("on the map layer: ArrowRight, + (real keys)",{before:c0,after:await L.P(p,()=>MAPCAM&&MAPCAM.c?[MAPCAM.c[0],MAPCAM.c[1]]:null),clock:await L.P(p,()=>clock),state:await st()});
  R.console=p._log.slice(0,40);
});
