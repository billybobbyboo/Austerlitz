#!/usr/bin/env node
/* Final audit (docs/FINAL_AUDIT.md, dimensions 4 and 5): states that combine, driven by real clicks and key presses on fresh pages.
   node tools/audit/state-probe.js [--json out.json] [--only a,b]
   Each scenario opens a fresh page at 1600 x 900 as the harness does (tools/stage7/lib.js), performs its steps (real clicks and keys;
   the clock is advanced by the app's own tickClock in 100 ms steps where a scenario plays it, as the self-test does under software
   WebGL) and records, after each step, one snapshot of the state that can be left inconsistent: the card, the opening and its played
   stretch, the tour, the clock and its speed, the "?" overlay, the sources sheet, the layers panel, the selection and chapter, the
   presentation and ground, the eye level, Follow, focus (and whether the focused element is visible), and page errors.
   The scenarios are the audit's; what each expects is written beside it and compared in the output (ok / NOT AS EXPECTED).
   Measurement only; nothing is written to a source file. Never run it beside `npm run check:visual`. */
const fs=require("fs"), path=require("path");
const L=require("../stage7/lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), ONLY=opt("--only");
const SNAP=()=>{
  function vis(e){ if(!e||!e.isConnected||e===document.body) return false; for(var p=e;p;p=p.parentElement){ var c=getComputedStyle(p); if(c.display==="none"||c.visibility==="hidden"||p.hidden) return false; }
    var r=e.getBoundingClientRect(); return r.width>0&&r.height>0; }
  var a=document.activeElement, md=document.getElementById("modal"), lp=document.getElementById("layerpop"), tb=document.getElementById("tourbar");
  return {card:firstRunOpen, cardClass:document.body.classList.contains("firstrun-on"), opening:OPENING.on, step:OPENING.on?OPENING.k:null, stretch:!!OPENING.play,
    tour:tourStep, tourbar:!tb.hidden, playing:playing, speed:speed, clock:+clock.toFixed(2), help:helpOpen(), sources:md.classList.contains("on"),
    layers:!lp.hidden, selection:selection?selection.kind+":"+selection.id:null, chapter:chapter?chapter.id||String(chapter):null, plan:planSide||null,
    presentation:presentation, mode:mode, eye:typeof EYE!=="undefined"?EYE.on:null, follow:!freeCam, tab:typeof tabNow!=="undefined"?tabNow:null,
    hideDispatch:hideDispatch,
    focus:a&&a!==document.body?(a.id?"#"+a.id:a.tagName.toLowerCase()+"."+String(a.className).split(" ")[0]):"body", focusVisible:a===document.body?null:vis(a),
    focusInView:a===document.body?null:(function(){ var r=a.getBoundingClientRect(); return r.right>0&&r.bottom>0&&r.left<innerWidth&&r.top<innerHeight; })(),
    dwellOn:DWELL.on, railHidden:document.body.classList.contains("rail-hidden"), docked:docked,
    railBox:(function(){ var e=document.querySelector(".rail"), r=e.getBoundingClientRect(); return [Math.round(r.left),Math.round(r.right)]; })(),
    dispatchBox:(function(){ var e=document.querySelector(".dispatch"); if(!e||!vis(e)) return null; var r=e.getBoundingClientRect(); return [Math.round(r.left),Math.round(r.right)]; })(),
    curVantage:typeof curVantage!=="undefined"?curVantage:null, fx:FX.on, textures:renderer.info.memory.textures, geometries:renderer.info.memory.geometries,
    focusInModal:!!(md.classList.contains("on")&&a&&md.contains(a))};
};
const tick=(page,n)=>page.evaluate(n=>{ for(let i=0;i<n;i++) tickClock(100); },n);
/* each scenario: steps [label, async fn(page)], and expect(snapshots) -> [ok, what was expected] */
const S=[
  {id:"sources-esc-tour", what:"The sources sheet opened during the guided tour, then Esc",
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],["click Guided tour",p=>p.click("#tourbtn",{timeout:180000})],
          ["click Sources",p=>p.click("#srcbtn",{timeout:180000})],["Esc",p=>p.keyboard.press("Escape")]],
   expect:s=>{ const z=s[s.length-1]; return [!z.sources&&z.tour>=0,"Esc closes the sheet first and leaves the tour where it stands"]; }},
  {id:"sources-esc-selection", what:"A formation selected, the sources sheet opened, then Esc",
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],["select Saint-Hilaire (the app's select)",p=>p.evaluate(()=>{ select("f","sthilaire"); })],
          ["click Sources",p=>p.click("#srcbtn",{timeout:180000})],["Esc",p=>p.keyboard.press("Escape")]],
   expect:s=>{ const z=s[s.length-1]; return [!z.sources&&z.selection==="f:sthilaire","Esc closes the sheet and keeps the selection"]; }},
  {id:"sources-focus", what:"The sources sheet (aria-modal) by click: where focus goes, Tab, then the close button",
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],["click Sources",p=>p.click("#srcbtn",{timeout:180000})],
          ["Tab",p=>p.keyboard.press("Tab")],["Tab",p=>p.keyboard.press("Tab")],["click its close",p=>p.click("#modal-close",{timeout:180000})]],
   expect:s=>[s[1].focusInModal&&s[2].focusInModal&&s[3].focusInModal&&s[4].focus==="#srcbtn","focus moves into the modal sheet, stays there, and returns to Sources on closing (as the ? overlay does)"]},
  {id:"sources-space", what:"Space while the sources sheet is open (focus not on a button)",
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],["click Sources",p=>p.click("#srcbtn",{timeout:180000})],
          ["blur",p=>p.evaluate(()=>document.activeElement&&document.activeElement.blur())],["Space",p=>p.keyboard.press(" ")]],
   expect:s=>{ const z=s[s.length-1]; return [!z.playing,"a modal sheet: Space does not play the clock behind it"]; }},
  {id:"opening-help", what:"The opening's stretch playing, \"?\", Esc, Esc",
   steps:[["click Begin",p=>p.click("#fr-tour",{timeout:180000})],["click Next (plays)",p=>p.click("#tour-next",{timeout:180000})],
          ["tick 2 s",p=>tick(p,20)],["?",p=>p.keyboard.press("?")],["tick 2 s",p=>tick(p,20)],["Esc",p=>p.keyboard.press("Escape")],["Esc",p=>p.keyboard.press("Escape")]],
   expect:s=>{ const a=s[4], z=s[s.length-1]; return [a.help&&!z.opening&&!z.playing&&z.speed===0.5&&z.clock===240&&z.focus==="#play","? over the playing opening, Esc closes it, Esc ends the opening at 04:00, ½×, focus on Play"]; }},
  {id:"opening-m", what:"The opening's stretch playing, then the key M (the ground)",
   steps:[["click Begin",p=>p.click("#fr-tour",{timeout:180000})],["click Next (plays)",p=>p.click("#tour-next",{timeout:180000})],
          ["tick 2 s",p=>tick(p,20)],["M",p=>p.keyboard.press("m")],["tick 1 s",p=>tick(p,10)]],
   expect:s=>{ const z=s[s.length-1]; return [!z.opening&&!z.stretch&&!z.playing&&z.speed===0.5&&z.mode==="staff"&&z.focusVisible!==false,"ended in place: clock stopped, ½× back, the paper map, focus on a visible element"]; }},
  {id:"opening-clean", what:"The opening at step 2, then the key 3 (Clean), then Esc",
   steps:[["click Begin",p=>p.click("#fr-tour",{timeout:180000})],["Next",p=>p.click("#tour-next",{timeout:180000})],["Next (straight there)",p=>p.click("#tour-next",{timeout:180000})],
          ["3",p=>p.keyboard.press("3")],["Esc",p=>p.keyboard.press("Escape")]],
   expect:s=>{ const z=s[s.length-1]; return [!z.opening&&z.presentation==="study"&&!z.tourbar,"3 ends the opening in place in Clean; Esc then shows everything"]; }},
  {id:"opening-eye", what:"The eye level at Napoleon's headquarters, then Begin the opening from the tools",
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],["Whose eyes: the French (setCommandView)",p=>p.evaluate(()=>setCommandView("fr"))],
          ["eye level (eyeEnter)",p=>p.evaluate(()=>eyeEnter())],["click Begin the opening",p=>p.click("#openingbtn",{timeout:180000})],["finish the glide",p=>p.evaluate(()=>window.__fin())]],
   expect:s=>{ const z=s[s.length-1]; return [z.opening&&z.eye===false,"the opening leaves the eye level (its stop's camera is above the floor)"]; }},
  {id:"layers-esc", what:"The layers panel by click, then Esc: focus returned",
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],["click Layers",p=>p.click("#layersbtn",{timeout:180000})],["Esc",p=>p.keyboard.press("Escape")]],
   expect:s=>{ const z=s[s.length-1]; return [!z.layers&&z.focus==="#layersbtn","Esc closes the panel and returns focus to its button"]; }},
  {id:"day-end", what:"Play from 17:58 to the day's end, then Play again",
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],["clock 17:58 (setClock)",p=>p.evaluate(()=>setClock(1078,{instant:true,force:true}))],
          ["click Play",p=>p.click("#play",{timeout:180000})],["tick 30 s",p=>tick(p,300)],["click Play",p=>p.click("#play",{timeout:180000})]],
   expect:s=>[!s[3].playing&&s[3].clock===1080&&s[4].playing&&s[4].clock<=241,"stops at 18:00; Play again starts the day from 04:00"]},
  {id:"resize-opening", what:"The opening playing at 1600 x 900, the window narrowed to 1024 x 768 (undocked), then Skip",
   steps:[["click Begin",p=>p.click("#fr-tour",{timeout:180000})],["click Next (plays)",p=>p.click("#tour-next",{timeout:180000})],
          ["resize 1024 x 768",async p=>{ await p.setViewportSize({width:1024,height:768}); await p.evaluate(()=>window.dispatchEvent(new Event("resize"))); }],
          ["tick 1 s",p=>tick(p,10)],["click Skip",p=>p.click("#tour-exit",{timeout:180000})]],
   expect:s=>{ const z=s[s.length-1]; return [!z.opening&&!z.playing&&z.speed===0.5&&z.clock===240&&z.focus==="#play","Skip after the resize: the end state"]; }},
  {id:"tour-opening", what:"The guided tour at stop 3, then Begin the opening from the tools",
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],["click Guided tour",p=>p.click("#tourbtn",{timeout:180000})],["Next",p=>p.click("#tour-next",{timeout:180000})],
          ["Next",p=>p.click("#tour-next",{timeout:180000})],["click Begin the opening",p=>p.click("#openingbtn",{timeout:180000})],["click Skip",p=>p.click("#tour-exit",{timeout:180000})]],
   expect:s=>{ const z=s[s.length-1]; return [s[4].opening&&s[4].step===0&&!z.opening&&z.tour===-1&&!z.tourbar,"the opening replaces the tour; Skip leaves neither"]; }},
  {id:"watch-card", what:"The key 2 (Watch) with the card open, then Esc",
   steps:[["2",p=>p.keyboard.press("2")],["Esc",p=>p.keyboard.press("Escape")]],
   expect:s=>[!s[0].card&&s[0].presentation==="watch"&&s[1].presentation==="study","2 closes the card and switches to Watch; Esc back to Study"]},
  {id:"dwell-toggle", what:"Play from 05:30; the dwell turned off in the Layers panel, 10 s of play, then on again",
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],["clock 05:30 (setClock)",p=>p.evaluate(()=>setClock(330,{instant:true,force:true}))],
          ["click Play",p=>p.click("#play",{timeout:180000})],["click Layers",p=>p.click("#layersbtn",{timeout:180000})],
          ["click Pause briefly at events (off)",p=>p.click("#dwell",{timeout:180000})],["tick 10 s",p=>tick(p,100)],
          ["click Pause briefly at events (on)",p=>p.click("#dwell",{timeout:180000})],["tick 0.1 s",p=>tick(p,1)]],
   expect:s=>{ const a=s[5], z=s[s.length-1]; return [z.clock>=a.clock,"the clock never goes back when the dwell is turned on again (it was "+a.clock+")"]; }},
  {id:"narrow-resize", what:"Study at 1280 x 800, the card closed, the window narrowed to 1000 x 800; then 2 and Esc",
   vp:[1280,800],
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],
          ["resize 1000 x 800",async p=>{ await p.setViewportSize({width:1000,height:800}); await p.evaluate(()=>{ window.dispatchEvent(new Event("resize")); AUSTERLITZ_DEBUG.settle(3); }); }],
          ["2",p=>p.keyboard.press("2")],["Esc",p=>p.keyboard.press("Escape")]],
   expect:s=>{ const ov=x=>x.dispatchBox&&!x.railHidden&&x.railBox[1]>0&&x.dispatchBox[0]<x.railBox[1]; return [!ov(s[1])&&!ov(s[3]),"below 1080 px the rail never stands over the dispatch card (after the resize, and after 2 then Esc)"]; }},
  {id:"drawer-focus", what:"A formation's dossier: a real click on its close button, then Tab",
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],["select Saint-Hilaire (the app's select)",p=>p.evaluate(()=>{ select("f","sthilaire"); })],
          ["click the dossier's close",p=>p.click("#drawer-close",{timeout:180000})],["Tab",p=>p.keyboard.press("Tab")],["Tab",p=>p.keyboard.press("Tab")]],
   expect:s=>[s.slice(2).every(x=>x.focus==="body"||(x.focusVisible&&x.focusInView)),"after the dossier closes, focus is never on an off-screen control"]},
  {id:"eye-phase", what:"The eye level at Napoleon's headquarters, then a real click on a phase on the timeline",
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],["Whose eyes: the French (setCommandView)",p=>p.evaluate(()=>setCommandView("fr"))],
          ["eye level (eyeEnter)",p=>p.evaluate(()=>eyeEnter())],["click the fifth phase",p=>p.click("#phases .step >> nth=4",{timeout:180000})],["finish the glide",p=>p.evaluate(()=>window.__fin())]],
   expect:s=>{ const z=s[s.length-1]; return [!(z.eye&&z.follow),"a phase's camera leaves the eye level (not the eye pinned with Follow on)"]; }},
  {id:"help-click-esc", what:"The \"?\" overlay, a click on its heading (not focusable), then Esc",
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],["?",p=>p.keyboard.press("?")],["click its heading",p=>p.click("#help-t",{timeout:180000})],["Esc",p=>p.keyboard.press("Escape")]],
   expect:s=>{ const z=s[s.length-1]; return [!z.help,"Esc closes the overlay wherever the click left focus"]; }},
  {id:"fx-toggle", what:"Visual effects off and on (F, F), four times: the GPU textures counted",
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],["draw",p=>p.evaluate(()=>{ renderFrame(); })]].concat(
          [1,2,3,4].map(i=>["F, F, draw ("+i+")",async p=>{ await p.keyboard.press("f"); await p.keyboard.press("f"); await p.evaluate(()=>{ renderFrame(); }); }])),
   expect:s=>[s[s.length-1].textures<=s[1].textures,"textures after four off-on toggles not above the count before ("+s[1].textures+")"]},
  {id:"wheel-card", what:"The mouse wheel over the map while the first-run card is open",
   steps:[["wheel at the map's centre",async p=>{ await p.mouse.move(900,250); await p.mouse.wheel(0,-240); }]],
   expect:s=>[!s[0].card,"anything done outside the card closes it (the wheel too)"]},
  {id:"layers-watch", what:"The Layers panel opened in Study, then the key 2 (Watch)",
   steps:[["Esc closes the card",p=>p.keyboard.press("Escape")],["click Layers",p=>p.click("#layersbtn",{timeout:180000})],["2",p=>p.keyboard.press("2")]],
   expect:s=>{ const z=s[s.length-1]; return [!z.layers,"the panel closes with its opener hidden in Watch"]; }},
  {id:"rm-live", what:"prefers-reduced-motion switched on after load (emulated), then Begin and Next",
   steps:[["emulate reduce",p=>p.emulateMedia({reducedMotion:"reduce"})],["click Begin",p=>p.click("#fr-tour",{timeout:180000})],["click Next",p=>p.click("#tour-next",{timeout:180000})]],
   expect:s=>{ const z=s[s.length-1]; return [!z.stretch,"a preference changed after load is honoured (Next cuts, no stretch)"]; }}
];
(async()=>{
  const browser=await L.launch(), res={scenarios:[]};
  for(const sc of S.filter(x=>!ONLY||ONLY.split(",").includes(x.id))){
    const page=await L.open(browser,sc.vp||[1600,900]);
    const snaps=[], steps=[];
    for(const [label,fn] of sc.steps){ let err=null; try{ await fn(page); }catch(e){ err=e.message.split("\n")[0]; } await page.waitForTimeout(150);
      const s=await page.evaluate(SNAP); s.step=label; if(err) s.error=err; snaps.push(s); steps.push(label); }
    const [ok,want]=sc.expect(snaps);
    const r={id:sc.id,what:sc.what,expected:want,ok:!!ok,snapshots:snaps,pageErrors:page._errors.slice()};
    res.scenarios.push(r);
    console.log((ok?"ok                ":"NOT AS EXPECTED   ")+sc.id.padEnd(24)+" "+sc.what);
    if(!ok) console.log("   expected: "+want+"\n   last: "+JSON.stringify(snaps[snaps.length-1]));
    if(r.pageErrors.length) console.log("   page errors: "+r.pageErrors.join(" | "));
    await page.close();
  }
  await browser.close();
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
