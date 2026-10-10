#!/usr/bin/env node
/* Stage 1 text-contrast check (docs/VISUAL_SPEC.md §6).
   node tools/visual/contrast.js <build.html> [--json out.json]     exit 1 if any visible text fails WCAG AA
   Drives the built page through the interface states where text appears (first run, Study, the formation,
   event, place and terrain dossiers, analysis, command, plans, layers, sources, tour, and the paper map with
   its dossier, tour and layers), reads every visible text element's computed colour, size and weight with the
   stack of translucent ancestor backgrounds and opacities, and composites it over two map backdrops taken from
   the Stage 0 screenshots: landscape #0C1116 and #A6AEB3, paper map #F1EDE1 and #D4D5C9. Text below 18 px (14 px
   bold) needs 4.5:1, larger text 3:1. CSS transitions are disabled so nothing is read mid-transition.
   Stage 2D: counters and all map text are DOM (the map layer, #maplayer), so they are read here like any page text. Map text
   sits on plates meant to meet AA over any ground: it is composited over black and white as well as the two backdrops
   (decision 38). Six states were added for what the contextual legend and the layer show only then: the terrain study,
   the going classes, a plan and the halt (legend-layers), true scale (legend-1x), the legend closed, and the hybrid view
   with a corps highlighted (dimmed counters; in Study, since Watch draws the view-mode control at 24% until it is hovered,
   a Stage 1 matter recorded in CHANGELOG.md); each state is drawn once before it is read (the layer lays out in a frame).
   Stage 2E: two paper-map states (the paper backdrops, as every state named staff-*): the overview as entered, and close
   on Sokolnitz.
   Stage 3B: Study as it opens (the Now tab, the legend closed), before the legend is opened for the states after it; and the
   Now tab in the paper theme.
   Stage 3C: Watch on the paper map and on the landscape (the presentation switch in the timeline, at full opacity).
   Stage 3E: the "?" overlay over the landscape and over the paper map.
   Stage 5E: "Whose eyes?": the dossier's reason, the eye-level vantage's caption, the paper map with a headquarters' reading.
   Stage 5G: the dossier with its day-track inset.
   Decision 141 (roadmap step 1, docs/FINAL_AUDIT.md T-0): the type is embedded (fonts.css), and no visible text may be drawn in any other
   face. Which fonts draw a text depends only on its computed font (the family list, weight, style, stretch, variant and synthesis), its
   text-transform, its language and its characters. So every text element read here, in every state, adds its characters to the set kept
   for its computed font; after the last state, each set is drawn once into a probe element set in that font, on the same page, and the
   Chrome DevTools Protocol is asked which platform fonts drew it (CSS.getPlatformFontsForNode, as tools/audit/font-probe.js asks). A
   font that is not one of the embedded faces ("Austerlitz Sans", "Austerlitz Serif", web fonts) is a failure, reported by character with
   the first element that showed it, unless the element is in FONT_ALLOW with its reason. (Asking the elements themselves, state by state,
   gave the same verdict and took 23 minutes instead of 9: each first question in a state forces the page to be drawn again.) This is the
   run-time proof behind css-test.js's coverage check and its SERIF_EXEMPT list.
   Roadmap step 1 (decision 131; docs/FINAL_AUDIT.md T-1, T-5): every console warning or error, failed console.assert, page error, crash
   and failed request on the page fails the check unless tools/visual/thresholds.js CONSOLE_ALLOW names it, with its reason, as in the harness;
   and every state says what it needs from the build and how to tell it was reached (STATES' third and fourth fields). Before step 1 seven
   typeof gates let a state the build could not reach be read as whatever the page showed, without a word: now a missing function or a state
   not reached fails (CONTRAST: FAILED). node tools/visual/contrast.js <build.html> --legacy (an archived build) keeps the gates and lists the
   states it skipped. The browser is launched as the harness launches it (ANGLE on SwiftShader; AUSTERLITZ_CHROME). */
const fs=require("fs"), path=require("path");
const { chromium } = require("playwright");
const TH=require("./thresholds.js");
const argv=process.argv.slice(2), html=path.resolve(argv.filter((a,i)=>!a.startsWith("--")&&argv[i-1]!=="--json")[0]||"austerlitz-command-map.html");
const jsonOut=argv.indexOf("--json")>=0?argv[argv.indexOf("--json")+1]:null;
const LEGACY=argv.includes("--legacy");
const TR=require("./three-route.js"), THREE_LOCAL=TR.THREE_LOCAL;   /* roadmap step 3: one route for three.js (decision 133) */
TR.checkIntegrity(html);   /* the page's integrity hash against the routed copy: a mismatch stops here, not as a blocked script */

/* decision 141: the faces a visible text may be drawn in, and the elements that may use another, with the reason */
const EMBEDDED=new Set(["Austerlitz Sans","Austerlitz Serif"]);
const FONT_ALLOW=[["#devstats","the developer readout (aria-hidden, hidden unless the ` key or ?stats): a monospace stack is its purpose"]];
/* each element read adds its characters to window.__cxFonts, by its computed font (the font check, decision 141), with the first element that
   showed each character */
const COLLECT=`(function(state){
  function rgba(s){ var m=/rgba?\\(([^)]+)\\)/.exec(s); if(!m) return null; var p=m[1].split(",").map(parseFloat); return [p[0],p[1],p[2],p.length>3?p[3]:1]; }
  var FA=window.__cxFonts=window.__cxFonts||{};
  var out=[], all=document.querySelectorAll("body *");
  for(var i=0;i<all.length;i++){
    var e=all[i], own="";
    for(var k=0;k<e.childNodes.length;k++){ var n=e.childNodes[k]; if(n.nodeType===3) own+=n.textContent; }
    own=own.replace(/\\s+/g," ").trim(); if(!own) continue;
    var r=e.getBoundingClientRect(); if(r.width<1||r.height<1) continue;
    var cs=getComputedStyle(e); if(cs.visibility==="hidden"||cs.display==="none") continue;
    var hid=false, op=1, bgs=[];
    for(var a=e;a&&a!==document.documentElement;a=a.parentElement){
      var ac=getComputedStyle(a); if(ac.display==="none"||a.hidden){ hid=true; break; }
      op*=parseFloat(ac.opacity);
      var b=rgba(ac.backgroundColor); if(b&&b[3]>0) bgs.push(b.concat([a.id||(typeof a.className==="string"?a.className:"")||a.tagName]));
    }
    if(hid||op<0.02) continue;
    var sel=e.id?"#"+e.id:(e.tagName.toLowerCase()+(typeof e.className==="string"&&e.className?"."+e.className.trim().split(/\\s+/).join("."):""));
    var font={family:cs.fontFamily,weight:cs.fontWeight,style:cs.fontStyle,stretch:cs.fontStretch,variant:cs.fontVariant,synthesis:cs.fontSynthesis||"",
      transform:cs.textTransform,lang:(e.closest&&e.closest("[lang]")||document.documentElement).getAttribute("lang")||""};
    var fk=JSON.stringify(font), F=FA[fk]||(FA[fk]={font:font,chars:{}});
    for(var c of own) if(c!==" "&&!F.chars[c]) F.chars[c]=state+": "+sel+" \\""+own.slice(0,40)+"\\"";
    out.push({state:state, sel:sel, text:own.slice(0,40), color:rgba(cs.color), size:parseFloat(cs.fontSize), weight:cs.fontWeight, opacity:op, bgs:bgs,
      map:!!(e.closest&&e.closest("#maplayer"))});
  }
  return out;
})`;
/* [name, what the state does, what it needs from the build (global names; T-5), how to tell it was reached (evaluated on the page after the
   state is drawn; T-5)]. Under --legacy (an archived build) a state whose needs are missing is skipped and listed, its gates as before step 1 */
const STATES=[
  /* Stage 3B: Study as it opens (the dispatch in the rail's Now tab, the legend closed to its head); then the legend opened, so
     that every later state reads its rows as before 3B (decision 49 closed it by default). The dossier states below read it
     in the rail's column. */
  ["now-default", ()=>{ closeFirst&&closeFirst(); setPresentation("study"); setMode("terrain"); setClock(570,{force:true}); updateVisibility(); },
    ["closeFirst"], ()=>!firstRunOpen&&presentation==="study"&&mode==="terrain"&&clock===570&&tabNow==="now"&&!ML.legendOpen],
  ["study", ()=>{ if(typeof ML!=="undefined") ML.legendOpen=true; closeFirst&&closeFirst(); setPresentation("study"); setMode("terrain"); setClock(570,{force:true}); updateVisibility(); },
    ["ML","closeFirst"], ()=>ML.legendOpen===true&&presentation==="study"&&mode==="terrain"&&clock===570],
  ["formation", ()=>{ select("f","sthilaire"); paintDrawer(); }, [], ()=>!!selection&&selection.kind==="f"&&selection.id==="sthilaire"],
  ["formation-expanded", ()=>{ dossierExpanded=true; paintDrawer(); }, ["dossierExpanded"], ()=>dossierExpanded===true&&!!selection&&selection.id==="sthilaire"],
  ["event", ()=>{ select("e",EVENTS[3].id); paintDrawer(); }, [], ()=>!!selection&&selection.kind==="e"&&selection.id===EVENTS[3].id],
  ["feature", ()=>{ select("t","pratzen"); paintDrawer(); }, [], ()=>!!selection&&selection.kind==="t"&&selection.id==="pratzen"],
  ["terrain-line", ()=>{ select("a",TERRAIN_LINES[0].n); paintDrawer(); }, [], ()=>!!selection&&selection.kind==="a"&&String(selection.id)===String(TERRAIN_LINES[0].n)],
  ["tab-analysis", ()=>{ select(null,null); var b=document.querySelector('.tab-btn[data-t="analysis"]'); if(b) b.click(); setChapter(ANALYSIS[2].id); },
    ["setChapter","tabNow"], ()=>tabNow==="analysis"&&chapter===ANALYSIS[2].id],
  ["tab-command", ()=>{ setChapter(null); var b=document.querySelector('.tab-btn[data-t="command"]'); if(b) b.click(); setCommandView("al"); },
    ["setCommandView","tabNow"], ()=>tabNow==="command"&&commandView==="al"],
  ["plans", ()=>{ setCommandView("none"); var b=document.querySelector('.tab-btn[data-t="plans"]'); if(b) b.click(); setPlan("both"); updateVisibility(); },
    ["setPlan","tabNow"], ()=>tabNow==="plans"&&planSide==="both"&&commandView==="none"],
  ["layers", ()=>{ setPlan(planSide); var b=document.getElementById("layersbtn"); if(b) b.click(); }, [], ()=>planSide===null&&!document.getElementById("layerpop").hidden],
  ["sources", ()=>{ var x=document.getElementById("layerclose"); if(x) x.click(); openSources(); },
    ["openSources"], ()=>document.getElementById("layerpop").hidden&&document.getElementById("modal").classList.contains("on")&&!!document.getElementById("modal").dataset.sources],
  ["tour", ()=>{ var m=document.getElementById("modal-close"); if(m) m.click(); startTour(); tourGo(1); },
    ["startTour","tourGo"], ()=>tourStep===1&&!document.getElementById("modal").classList.contains("on")&&!document.getElementById("tourbar").hidden],
  ["staff", ()=>{ exitTour(); setMode("staff"); setPresentation("study"); select("f","sthilaire"); paintDrawer(); updateVisibility(); },
    ["exitTour"], ()=>tourStep===-1&&mode==="staff"&&presentation==="study"&&!!selection&&selection.id==="sthilaire"],
  ["staff-tour", ()=>{ select(null,null); startTour(); tourGo(1); }, ["startTour","tourGo"], ()=>tourStep===1&&mode==="staff"],
  ["staff-layers", ()=>{ exitTour(); var b=document.getElementById("layersbtn"); if(b) b.click(); },
    ["exitTour"], ()=>tourStep===-1&&mode==="staff"&&!document.getElementById("layerpop").hidden],
  /* Stage 2D */
  ["legend-layers", ()=>{ var x=document.getElementById("layerclose"); if(x) x.click(); setMode("terrain"); setPresentation("study"); select(null,null);
    setClock(460,{force:true}); setPlan("al"); document.getElementById("going").click(); document.querySelector('.layer-btn[data-l="analysis"]').click(); updateVisibility(); },
    ["setPlan","goingOn"], ()=>mode==="terrain"&&clock===460&&planSide==="al"&&goingOn===true&&layerOn.analysis===true&&document.getElementById("layerpop").hidden],
  ["legend-1x", ()=>{ setPlan(planSide); document.getElementById("going").click(); document.querySelector('.layer-btn[data-l="analysis"]').click();
    setDisplayFactor(1); setClock(300,{force:true}); updateVisibility(); },
    ["setDisplayFactor","goingOn"], ()=>planSide===null&&goingOn===false&&layerOn.analysis===false&&DISPLAY.factor===1&&clock===300],
  ["legend-closed", ()=>{ setDisplayFactor(DISPLAY.defaultFactor); setClock(570,{force:true}); document.getElementById("lg-toggle").click(); updateVisibility(); },
    ["setDisplayFactor","ML"], ()=>DISPLAY.factor===DISPLAY.defaultFactor&&clock===570&&ML.legendOpen===false],
  ["hybrid-dimmed", ()=>{ document.getElementById("lg-toggle").click(); setMode("hybrid"); setPresentation("study"); setClock(600,{force:true}); select("f","c_iv");
    AUSTERLITZ_DEBUG.placeCamera([-66,76,101,0,19,26]); updateVisibility(); },
    ["AUSTERLITZ_DEBUG"], ()=>mode==="hybrid"&&presentation==="study"&&clock===600&&!!selection&&selection.id==="c_iv"&&ML.legendOpen===true],
  /* Stage 2E: the true north-up paper map as entered (the whole field framed; the legend's paper rows, its hillshade line
     and its controls), and close on Sokolnitz (full counters, place names and movement labels on the flat sheet; in Study, as
     hybrid-dimmed above, since Watch draws the view-mode control at 24% until it is hovered) */
  ["staff-overview", ()=>{ select(null,null); setMode("staff"); setPresentation("study"); setClock(570,{force:true}); MAPCAM.frameField(true); updateVisibility(); },
    ["MAPCAM"], ()=>mode==="staff"&&presentation==="study"&&clock===570&&!selection&&MAPCAM.framed()],
  ["staff-close", ()=>{ setClock(500,{force:true}); AUSTERLITZ_DEBUG.placeCamera([-80,40,92,-65,0,56]); updateVisibility(); },
    ["AUSTERLITZ_DEBUG","MAPCAM"], ()=>mode==="staff"&&clock===500&&!MAPCAM.framed()],
  /* Stage 3B: the Now tab in the paper theme (the states above leave the Plans tab chosen, so it is opened here) */
  ["staff-now", ()=>{ select(null,null); if(typeof selectTab==="function") selectTab("now"); setClock(570,{force:true}); updateVisibility(); },
    ["selectTab"], ()=>mode==="staff"&&tabNow==="now"&&clock===570],
  /* Stage 3C: Watch, its presentation switch in the timeline's control row at full opacity (decision 60), with the caption's
     derived readings, on the paper map and on the landscape */
  ["staff-watch", ()=>{ setPresentation("watch"); setClock(570,{force:true}); updateVisibility(); }, [], ()=>mode==="staff"&&presentation==="watch"],
  ["watch", ()=>{ setMode("terrain"); setPresentation("watch"); setClock(570,{force:true}); updateVisibility(); }, [], ()=>mode==="terrain"&&presentation==="watch"],
  /* Stage 3E: the "?" overlay, every row of the key table, over the landscape and over the paper map */
  ["help", ()=>{ setPresentation("study"); if(typeof setHelp==="function") setHelp(true); },
    ["setHelp"], ()=>presentation==="study"&&mode==="terrain"&&!document.getElementById("help").hidden],
  ["staff-help", ()=>{ if(typeof setHelp==="function"){ setHelp(false); setMode("staff"); setHelp(true); } },
    ["setHelp"], ()=>mode==="staff"&&!document.getElementById("help").hidden],
  /* Stage 5E (docs/STAGE5_SPEC.md section D.6): "Whose eyes?": a formation's dossier with the reading's reason (the Allied headquarters,
     a French formation not known); the eye-level vantage's caption over the landscape (Napoleon's headquarters, 08:30); the paper map
     with the reading on, its reported-only counters marked (05:00). The control and its caption are in tab-command above */
  ["eyes-dossier", ()=>{ if(typeof setHelp==="function") setHelp(false); setMode("terrain"); setPresentation("study");
    if(typeof setCommandView!=="function"||typeof knowReason!=="function") return;
    setCommandView("al"); setClock(600,{force:true}); var id=Object.keys(units).filter(k=>knowledgeOf(k)==="unknown")[0];
    /* step 1 (T-5): expanded after the selection (select() collapses the dossier when the selection changes, app.js; before step 1 this state set
       it before selecting, and so read the dossier collapsed without saying so) */
    if(id){ select("f",id); dossierExpanded=true; paintDrawer(); } updateVisibility(); },
    ["setHelp","setCommandView","knowReason","knowledgeOf"],
    ()=>document.getElementById("help").hidden&&mode==="terrain"&&commandView==="al"&&clock===600&&dossierExpanded===true&&!!selection&&selection.kind==="f"&&knowledgeOf(selection.id)==="unknown"],
  ["eye-level", ()=>{ if(typeof eyeEnter!=="function") return; select(null,null); dossierExpanded=false; setCommandView("fr"); setClock(510,{force:true}); eyeEnter(); updateVisibility(); },
    ["eyeEnter","EYE"], ()=>EYE.on===true&&commandView==="fr"&&clock===510&&!selection],
  ["staff-eyes", ()=>{ if(typeof eyeLeave!=="function") return; eyeLeave(); setMode("staff"); setCommandView("fr"); setClock(300,{force:true}); MAPCAM.frameField(true); updateVisibility(); },
    ["eyeLeave","EYE","MAPCAM"], ()=>EYE.on===false&&mode==="staff"&&commandView==="fr"&&clock===300],
  /* Stage 5G (docs/STAGE5_SPEC.md section F.4): the full dossier with its day-track inset, docked (its scale bar's and north's text on the
     inset's paper ground, its key and note in the dossier's colours); the card below 1080 px shares the inset's colours, checked in the
     self-test */
  ["daytrack", ()=>{ if(typeof dayTrackEl!=="function") return; setCommandView("none"); setMode("terrain"); setPresentation("study"); setClock(590,{force:true});
    select("f","sthilaire"); dossierExpanded=true; paintDrawer(); var d=document.querySelector(".daytrack"); if(d) d.scrollIntoView(); updateVisibility(); },
    ["dayTrackEl"], ()=>commandView==="none"&&mode==="terrain"&&clock===590&&!!selection&&selection.id==="sthilaire"&&dossierExpanded===true&&!!document.querySelector(".daytrack")],
  /* Stage 7C (docs/STAGE7_SPEC.md section 6, 7C): the opening's bar at its second step (its heading, the stop's title and text, Back, Next and
     Skip, in the dark theme), and where the opening leaves the visitor (04:00, Study on the Now tab, the Overview) */
  /* Stage 7D: the bar while the clock plays between steps (paused, so that it holds still: its heading, the next stop's title, its words) */
  ["opening-playing", ()=>{ if(typeof openingStart!=="function") return; select(null,null); dossierExpanded=false; setMode("terrain"); setPresentation("study");
    openingStart(); openingGo(1); if(typeof OPENING!=="undefined"&&OPENING.play&&playing) togglePlay(); updateVisibility(); },
    ["openingStart","openingGo","OPENING","togglePlay"], ()=>OPENING.on===true&&!!OPENING.play&&OPENING.play.to===1&&!playing&&!document.getElementById("tourbar").hidden],
  ["opening", ()=>{ if(typeof openingStart!=="function") return; openingGo(1); if(typeof OPENING!=="undefined"&&OPENING.k!==1){ openingStart(); openingGo(1); openingGo(1); }
    updateVisibility(); },
    ["openingStart","openingGo","OPENING"], ()=>OPENING.on===true&&OPENING.k===1&&!OPENING.play&&!document.getElementById("tourbar").hidden],
  ["opening-end", ()=>{ if(typeof openingEnd!=="function") return; openingEnd("skip"); updateVisibility(); },
    ["openingEnd","OPENING"], ()=>OPENING.on===false&&clock===240&&presentation==="study"&&tourStep===-1&&document.getElementById("tourbar").hidden]
];
function hx(h){ h=h.replace("#",""); return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)); }
function lin(v){ v/=255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); }
function L(c){ return 0.2126*lin(c[0])+0.7152*lin(c[1])+0.0722*lin(c[2]); }
function over(t,a,b){ return [0,1,2].map(i=>t[i]*a+b[i]*(1-a)); }
function ratio(a,b){ const la=L(a), lb=L(b); return (Math.max(la,lb)+0.05)/(Math.min(la,lb)+0.05); }
const BACK={dark:[hx("#0C1116"),hx("#A6AEB3")], paper:[hx("#F1EDE1"),hx("#D4D5C9")]};

(async()=>{
  /* launched as the harness launches it (step 1): ANGLE on SwiftShader, AUSTERLITZ_CHROME if set (before step 1 --use-gl=swiftshader) */
  const browser=await chromium.launch({executablePath:process.env.AUSTERLITZ_CHROME||undefined,
    args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
  /* T-1: every message of the page, labelled by the state being read (as the harness records them) */
  const LOG=[]; let AT="load";
  const rec=(type,text)=>LOG.push({page:"1600x900 contrast",at:AT,type:type,text:String(text).slice(0,400)});
  page.on("console",m=>{ const t=m.type(); if(t==="warning"||t==="error"||t==="assert") rec(t,m.text()); });
  page.on("pageerror",e=>rec("pageerror",e.message+" | "+String(e.stack||"").split("\n")[1]));
  page.on("crash",()=>rec("crash","the page crashed"));
  page.on("requestfailed",q=>rec("requestfailed",q.url().slice(0,160)+" "+((q.failure()||{}).errorText||"")));
  await TR.routeThree(page);
  await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000});
  await TR.waitBoot(page);
  const fontsStatus=await page.evaluate(()=>document.fonts?document.fonts.ready.then(()=>document.fonts.status):"no document.fonts");
  await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  /* decision 141: which platform fonts draw each computed font's characters (the CDP, once, after the last state; see the header) */
  async function fontCheck(){
    const keys=await page.evaluate(()=>{ const F=window.__cxFonts||{}, K=Object.keys(F); document.querySelectorAll("[data-cxp]").forEach(e=>e.remove());
      K.forEach((k,i)=>{ const f=F[k].font, p=document.createElement("span"); p.setAttribute("data-cxp",String(i)); if(f.lang) p.lang=f.lang;
        p.style.cssText="position:fixed;left:0;top:0;opacity:0;pointer-events:none;white-space:pre";
        Object.assign(p.style,{fontFamily:f.family,fontWeight:f.weight,fontStyle:f.style,fontStretch:f.stretch,fontVariant:f.variant,textTransform:f.transform});
        if(f.synthesis) p.style.fontSynthesis=f.synthesis;
        p.textContent=Object.keys(F[k].chars).join(""); document.body.appendChild(p); });
      document.querySelectorAll("[data-cxp]").forEach(e=>e.getBoundingClientRect());   /* laid out before the CDP asks (a node not laid out reports no font) */
      return K.map(k=>({font:F[k].font,chars:F[k].chars})); });
    const frames=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    await frames();
    const cdp=await page.context().newCDPSession(page); await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
    const doc=await cdp.send("DOM.getDocument",{depth:0}), ask=async sel=>{ const q=await cdp.send("DOM.querySelectorAll",{nodeId:doc.root.nodeId,selector:sel}), out={};
      for(const id of q.nodeIds){ const at=(await cdp.send("DOM.getAttributes",{nodeId:id})).attributes; out[at[at.indexOf(sel.slice(1,-1))+1]]=(await cdp.send("CSS.getPlatformFontsForNode",{nodeId:id})).fonts; }
      return out; };
    const bad=f=>!f.isCustomFont||!EMBEDDED.has(f.familyName), got=await ask("[data-cxp]"), fails=[];
    let nChars=0; keys.forEach(k=>{ nChars+=Object.keys(k.chars).length; });
    for(let i=0;i<keys.length;i++){ const fonts=got[String(i)]||[];
      if(!Object.keys(keys[i].chars).length||(fonts.length&&!fonts.some(bad))) continue;
      /* a set drawn in another face: ask its characters one by one, to name each and the first element that showed it */
      const cs=Object.keys(keys[i].chars);
      await page.evaluate(([i,cs])=>{ const p=document.querySelector('[data-cxp="'+i+'"]'); cs.forEach((c,j)=>{ const q=p.cloneNode(false); q.removeAttribute("data-cxp");
        q.setAttribute("data-cxc",String(j)); q.textContent=c; document.body.appendChild(q); });
        document.querySelectorAll("[data-cxc]").forEach(e=>e.getBoundingClientRect()); },[i,cs]);
      await frames();
      const one=await ask("[data-cxc]");
      await page.evaluate(()=>document.querySelectorAll("[data-cxc]").forEach(e=>e.remove()));
      cs.forEach((c,j)=>{ const f=one[String(j)]||[], at=keys[i].chars[c]; if(f.length&&!f.some(bad)) return;
        if(FONT_ALLOW.some(a=>at.indexOf(": "+a[0]+" ")>0)) return;
        fails.push("U+"+c.codePointAt(0).toString(16).toUpperCase().padStart(4,"0")+" "+c+" in "+keys[i].font.family.split(",")[0]+" "+keys[i].font.weight+" "+keys[i].font.style+
          " drawn in "+(f.length?f.filter(bad).map(x=>x.familyName+(x.isCustomFont?"":" (a system font)")).join(", "):"no font")+"; first shown by "+at); }); }
    await cdp.send("CSS.disable"); await cdp.send("DOM.disable"); await cdp.detach();
    return {fails,fonts:keys.length,chars:nChars};
  }
  /* T-5: what a state needs, by global name (a function, a variable or an object) */
  const missing=names=>page.evaluate(ns=>ns.filter(n=>{ try{ return (0,eval)("typeof "+n)==="undefined"; }catch(e){ return true; } }),names);
  const stateFails=[], skipped=[];
  AT="first-run";
  const fr0=await page.evaluate(()=>typeof firstRunOpen!=="undefined"&&firstRunOpen===true&&!document.getElementById("firstrun").hidden);
  if(!fr0&&!LEGACY) stateFails.push("state first-run not reached: the first-run card is not open on a fresh page (T-5)");
  /* every state is drawn by AUSTERLITZ_DEBUG.settle before it is read (the map layer lays out in a frame) */
  if(!LEGACY&&(await missing(["AUSTERLITZ_DEBUG"])).length) stateFails.push("the build has no AUSTERLITZ_DEBUG: no state can be drawn before it is read (T-5)");
  const rows=[...await page.evaluate(COLLECT+'("first-run")')];
  for(const [name,fn,needs,reached] of STATES){ AT=name;
    const miss=await missing(needs);
    if(miss.length){ if(LEGACY){ skipped.push(name+" (the build has no "+miss.join(", ")+")"); continue; }
      stateFails.push("state "+name+": the build has no "+miss.join(", ")+" (T-5)"); continue; }
    await page.evaluate(fn);
    await page.evaluate(()=>{ if(window.AUSTERLITZ_DEBUG) AUSTERLITZ_DEBUG.settle(3); });   /* a drawn frame: the map layer lays out in it */
    await page.waitForTimeout(300);
    let ok=false; try{ ok=await page.evaluate(reached); }catch(e){ ok=false; }
    if(!ok){ const desc=String(reached).replace(/^\(\)=>/,"");
      if(LEGACY) skipped.push(name+" (not reached: "+desc+")"); else stateFails.push("state "+name+" not reached: "+desc+" is false (T-5)"); }
    rows.push(...await page.evaluate(COLLECT+"("+JSON.stringify(name)+")")); }
  AT="font check";
  const FC=await fontCheck(), fontFails=FC.fails;
  await browser.close();
  const pairs=new Map(); let small=0;
  rows.forEach(r=>{
    const paper=r.state.startsWith("staff"); let worst=99, wbg=null;
    BACK[paper?"paper":"dark"].concat(r.map?[[0,0,0],[255,255,255]]:[]).forEach(bd=>{
      let bg=bd; for(let i=r.bgs.length-1;i>=0;i--) bg=over(r.bgs[i].slice(0,3),r.bgs[i][3],bg);
      const fg=over(r.color.slice(0,3),r.color[3]*r.opacity,bg), c=ratio(fg,bg);
      if(c<worst){ worst=c; wbg=bg; }
    });
    if(r.size<10.5) small++;
    const need=(r.size>=18||(r.size>=14&&+r.weight>=600))?3:4.5;
    const key=[paper?"paper":"dark",r.color.join(","),r.opacity.toFixed(2),wbg.map(Math.round).join(","),r.size].join("|");
    const p=pairs.get(key); if(!p||worst<p.ratio) pairs.set(key,{ratio:worst,need:need,theme:paper?"paper":"dark",size:r.size,sel:r.sel,text:r.text,state:r.state});
  });
  const all=[...pairs.values()], fails=all.filter(p=>p.ratio<p.need).sort((a,b)=>a.ratio-b.ratio);
  console.log("text elements "+rows.length+", distinct text/background pairs "+all.length+", below AA "+fails.length+", text below 10.5 px "+small);
  fails.slice(0,40).forEach(p=>console.log("  ! "+p.ratio.toFixed(2)+" < "+p.need+"  "+p.theme+" "+p.size+"px "+p.sel+" ["+p.state+'] "'+p.text+'"'));
  console.log("font failures: "+fontFails.length+" ("+FC.chars+" characters in "+FC.fonts+" computed fonts, from the "+rows.length+" text elements read, asked which faces drew them; decision 141: only the embedded faces)");
  fontFails.slice(0,40).forEach(f=>console.log("  ! font: "+f));
  /* T-1: the page's messages against CONSOLE_ALLOW (each entry named, with its reason) */
  const CJ=TH.judgeConsole(LOG), con=CJ.bad;
  if(fontsStatus!=="loaded") stateFails.push("the fonts are "+fontsStatus+" after document.fonts.ready (decision 141)");
  console.log("states "+(STATES.length+1)+": "+(STATES.length+1-stateFails.filter(x=>/^state /.test(x)).length-skipped.length)+" reached"+(skipped.length?", "+skipped.length+" skipped (--legacy): "+skipped.join("; "):"")+
    "; console messages "+LOG.length+", failing "+con.length+(Object.keys(CJ.used).length?" (allowed by name in thresholds.js CONSOLE_ALLOW: "+Object.entries(CJ.used).map(([k,n])=>k+" "+n).join(", ")+")":""));
  stateFails.forEach(f=>console.log("  ! "+f));
  con.slice(0,40).forEach(e=>console.log("  ! "+TH.consoleLine(e)));
  if(jsonOut) fs.writeFileSync(jsonOut,JSON.stringify(all,null,1));
  const bad=fails.length||small||fontFails.length||stateFails.length||(!LEGACY&&con.length);
  console.log(bad?"CONTRAST: FAILED":(LEGACY?"CONTRAST (legacy run, "+skipped.length+" states skipped): every text read meets WCAG AA":"CONTRAST: all text meets WCAG AA, drawn in the embedded faces, in every state reached"));
  process.exitCode=bad?1:0;
})().catch(e=>{ console.error(e); process.exit(2); });
