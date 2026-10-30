#!/usr/bin/env node
/* Stage 8, the follow-up 8I (the audit of 8H's build; docs/STAGE8_SPEC.md section 21): the phase's message (#toast, PHASES[3].flash at 08:45)
   shown first, then the layout changed under it, each change in both directions: Watch to Study and back at 1600 x 900 (the audit's first two
   steps), 1600 x 900 to 1024 x 768 and back in Study (its third), the Panels opened and closed at 1024 x 768, the paper map entered and left through
   the Layers panel at 1366 x 768, a phone turned (390 x 844 to 844 x 390 and back, the iPhone's density and touch) and its Menu opened and closed.
   The flows the harness's live block "toastLayout" runs (tools/visual/harness.js), here on fresh pages of any build, so that 8H's build shows the
   fault and 8I's its cure, and with the panels' transitions as a visitor has them ("--transitions on", the default here) or off as the harness's
   page has them ("off"). Each read: the message shown, its words, its box, its overlap with the presentation switch and with every other shown
   control (a button, a link, an input, a tab, a slider; the map layer's own items aside), and how many times it was placed again (TOAST.placed,
   8I's; absent on 8H's build). The message is held for these reads (its hiding timer cleared as it shows, as tools/stage8/toast-8h.js holds it);
   then, unheld, its lifetime through two changes: stamped in the page as it shows and hides, flash()'s timer read as it is set and as it hides.
   node tools/stage8/toast-8i.js [--html build] [--transitions on|off] [--out file.json] [--shots dir]   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), TR=require("../visual/three-route.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const HTML=path.resolve(opt("--html")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=opt("--out"), SHOTS=opt("--shots"), TRANS=(opt("--transitions")||"on")==="on";
const IOS={dpr:3, ua:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"};   /* harness.js PHONE_DEVICES */
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
const READ=()=>{ const t=document.getElementById("toast"), v=document.getElementById("viewmode"), a=t.getBoundingClientRect();
  const shown=e=>{ if(!e) return false; const q=e.getBoundingClientRect(); if(!(q.width>0&&q.height>0)) return false; for(let n=e;n&&n.nodeType===1;n=n.parentElement){ const s=getComputedStyle(n); if(s.display==="none"||s.visibility==="hidden"||+s.opacity===0) return false; } return true; };
  const ov=(p,q)=>Math.round(Math.max(0,Math.min(p.right,q.right)-Math.max(p.left,q.left))*Math.max(0,Math.min(p.bottom,q.bottom)-Math.max(p.top,q.top)));
  const vs=shown(v), others=[];
  document.querySelectorAll("button,a[href],input,select,[role=button],[role=tab],[role=slider]").forEach(e=>{ if(t.contains(e)||(v&&v.contains(e))||e.closest("#maplayer")||!shown(e)) return;
    const o=ov(a,e.getBoundingClientRect()); if(o>0) others.push({el:e.id?"#"+e.id:(e.className?e.tagName.toLowerCase()+"."+String(e.className).split(" ")[0]:e.tagName.toLowerCase()), text:(e.getAttribute("aria-label")||e.textContent||"").trim().slice(0,28), px:o}); });
  return {on:t.classList.contains("on"), text:t.textContent, want:PHASES[3].flash, clock:Math.round(clock), vw:innerWidth, vh:innerHeight, presentation:presentation, mode:mode,
    box:[Math.round(a.left),Math.round(a.top),Math.round(a.width),Math.round(a.height)], switchShown:vs, overlapSwitch:vs?ov(a,v.getBoundingClientRect()):0, others:others,
    placed:typeof TOAST!=="undefined"?TOAST.placed:null}; };
(async()=>{
  const browser=await L.launch(), out={tool:"tools/stage8/toast-8i.js", build:path.relative(L.ROOT,HTML)||HTML, md5:md5(HTML), browser:browser.version(), transitions:TRANS, cases:[], life:null};
  const fresh=async(w,h,phone)=>{ const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:phone?IOS.dpr:1,hasTouch:!!phone,isMobile:false,userAgent:phone?IOS.ua:undefined});
    const page=await ctx.newPage(); page._errors=[]; page.on("pageerror",e=>page._errors.push(e.message));
    await TR.routeThree(page); await page.goto("file://"+HTML+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page,240000,250);
    if(!TRANS) await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
    return {ctx,page}; };
  /* as the harness's size(): the viewport set and its resize event dispatched (this headless browser fires none of its own on setViewportSize; a
     visitor's browser does on every change of the window) */
  const size=async(page,w,h)=>{ await page.setViewportSize({width:w,height:h}); await page.evaluate(()=>window.dispatchEvent(new Event("resize"))); await page.waitForTimeout(800); };
  const begin=async(page,pres)=>{ await page.evaluate(p=>{ closeFirst(null); if(playing) stopPlay(); select(null,null); if(typeof setMenu==="function") setMenu(false);
      setMode("terrain"); setPresentation(p); AUSTERLITZ_DEBUG.settle(4,true);
      if(!window.__flash0){ const f0=flash; window.__flash0=f0; flash=function(m){ f0(m); clearTimeout(flash._t); }; }
      setClock(520,{instant:true,force:true,camera:false}); clearTimeout(flash._t); document.getElementById("toast").classList.remove("on"); document.getElementById("timerail").focus(); },pres);
    await page.waitForTimeout(300); await page.keyboard.press("PageDown"); await page.waitForTimeout(250); return page.evaluate(READ); };
  const shot=async(page,name)=>{ if(!SHOTS) return; fs.mkdirSync(SHOTS,{recursive:true}); const vp=page.viewportSize(); await page.screenshot({path:path.join(SHOTS,name.replace(/[^a-z0-9]+/gi,"-")+".jpg"),type:"jpeg",quality:84,timeout:180000,clip:{x:0,y:0,width:vp.width,height:Math.min(vp.height,Math.round(vp.height*0.55))}}); };
  const CASES=[
    ["watch-study 1600x900",1600,900,false,"watch",[["to Study",p=>p.click('.vm-btn[data-vm="study"]')],["to Watch",p=>p.click('.vm-btn[data-vm="watch"]')]]],
    ["study-watch 1600x900",1600,900,false,"study",[["to Watch",p=>p.click('.vm-btn[data-vm="watch"]')],["to Study",p=>p.click('.vm-btn[data-vm="study"]')]]],
    ["resize 1600x900-1024x768 study",1600,900,false,"study",[["to 1024x768",p=>size(p,1024,768)],["to 1600x900",p=>size(p,1600,900)]]],
    ["resize 1024x768-1600x900 study",1024,768,false,"study",[["to 1600x900",p=>size(p,1600,900)],["to 1024x768",p=>size(p,1024,768)]]],
    ["panels 1024x768 study",1024,768,false,"study",[["Panels open",p=>p.click("#panelsbtn")],["Panels closed",p=>p.click("#panelsbtn")]]],
    ["paper map 1366x768 study",1366,768,false,"study",[["to the paper map",async p=>{ await p.click("#layersbtn",{timeout:120000}); await p.click('.mode-btn[data-m="staff"]',{timeout:120000}); await p.keyboard.press("Escape"); }],
      ["to the landscape",async p=>{ await p.click("#layersbtn",{timeout:120000}); await p.click('.mode-btn[data-m="terrain"]',{timeout:120000}); await p.keyboard.press("Escape"); }]]],
    ["phone turned 390x844",390,844,true,"study",[["to 844x390",p=>size(p,844,390)],["to 390x844",p=>size(p,390,844)]]],
    ["phone menu 390x844",390,844,true,"study",[["Menu open",p=>p.click("#menubtn")],["Menu closed",p=>p.keyboard.press("Escape")]]]];
  for(const [name,w,h,phone,pres,steps] of CASES){
    const {ctx,page}=await fresh(w,h,phone), c={name:name, reads:[]};
    c.reads.push(Object.assign({step:"shown"},await begin(page,pres))); await shot(page,name+" 0 shown");
    let k=1; for(const [label,act] of steps){ await act(page); await page.waitForTimeout(900); c.reads.push(Object.assign({step:label},await page.evaluate(READ))); await shot(page,name+" "+(k++)+" "+label); }
    c.pageErrors=page._errors.slice(); out.cases.push(c);
    console.log(name.padEnd(32), c.reads.map(r=>r.step+": "+(r.on?"shown":"NOT SHOWN")+" ["+r.box.join(",")+"]"+(r.overlapSwitch||r.others.length?" OVER switch "+r.overlapSwitch+" px "+JSON.stringify(r.others.map(o=>o.el+" "+o.px)):" clear")+(r.placed!==null?" placed "+r.placed:"")).join(" | "));
    await ctx.close();
  }
  /* the lifetime, unheld: nothing held. setTimeout observed as it passes (each call made as asked; the one of flash()'s 3.4 s noted with its time),
     the message brought by a real PageDown at 1600 x 900 in Watch, and as soon as it shows two changes of the layout under it, each while it shows
     (Study, then the window to 1366 x 768): the timer set once, never again and never cleared by a change, the message hidden no earlier than 3.4 s
     after it was set; each change while it showed placing it again */
  { const {ctx,page}=await fresh(1600,900,false);
    await page.evaluate(()=>{ closeFirst(null); if(playing) stopPlay(); select(null,null); setMode("terrain"); setPresentation("watch"); AUSTERLITZ_DEBUG.settle(4,true);
      setClock(520,{instant:true,force:true,camera:false}); clearTimeout(flash._t); const t=document.getElementById("toast"); t.classList.remove("on");
      const Lf=window.__toastLife={sched:[], cleared:0, off:null, timerAtOff:null, changes:[]}, st0=window.setTimeout, ct0=window.clearTimeout;
      window.__st0=st0; window.__ct0=ct0;
      window.setTimeout=function(f,d){ const id=st0.apply(window,arguments); if(d===3400) Lf.sched.push({id:id, t:performance.now()}); return id; };
      window.clearTimeout=function(id){ if(Lf.sched.some(q=>q.id===id)&&Lf.off===null&&t.classList.contains("on")) Lf.cleared++; return ct0.apply(window,arguments); };
      window.__toastMO=new MutationObserver(()=>{ if(!t.classList.contains("on")&&Lf.sched.length&&Lf.off===null){ Lf.off=performance.now(); Lf.timerAtOff=flash._t; } });
      window.__toastMO.observe(t,{attributes:true,attributeFilter:["class"]}); document.getElementById("timerail").focus(); });
    await page.waitForTimeout(300); await page.keyboard.press("PageDown");
    const life={reads:[]};
    const change=async(label,act)=>{ const before=await page.evaluate(()=>({on:document.getElementById("toast").classList.contains("on"), placed:typeof TOAST!=="undefined"?TOAST.placed:null}));
      await act(); await page.waitForTimeout(250); const r=await page.evaluate(READ); life.reads.push(Object.assign({step:label, onAtChange:before.on, placedBefore:before.placed},r)); };
    const t0=Date.now(); while(Date.now()-t0<60000&&await page.evaluate(()=>!document.getElementById("toast").classList.contains("on"))) await page.waitForTimeout(50);
    await change("to Study",()=>page.evaluate(()=>setPresentation("study")));
    await change("to 1366x768",async()=>{ await page.setViewportSize({width:1366,height:768}); await page.evaluate(()=>window.dispatchEvent(new Event("resize"))); });
    const t1=Date.now(); while(Date.now()-t1<60000&&await page.evaluate(()=>window.__toastLife.off===null)) await page.waitForTimeout(100);
    Object.assign(life,await page.evaluate(()=>{ const Lf=window.__toastLife; window.__toastMO.disconnect(); window.setTimeout=window.__st0; window.clearTimeout=window.__ct0;
      const s0=Lf.sched[0]||null;
      return {set:Lf.sched.length, cleared:Lf.cleared, off:Lf.off!==null, lifeMs:(s0&&Lf.off!==null)?Math.round(Lf.off-s0.t):null, timerKept:!!s0&&Lf.timerAtOff===s0.id, expected:3400}; }));
    life.placedOnChanges=life.reads.filter(r=>r.onAtChange&&r.placedBefore!==null).map(r=>r.placed-r.placedBefore);
    life.pageErrors=page._errors.slice(); out.life=life;
    console.log("lifetime, unheld: flash's timer set "+life.set+" time(s), cleared "+life.cleared+" while shown, hidden "+life.lifeMs+" ms after it was set (3400), the same timer "+life.timerKept+"; "+
      life.reads.map(r=>r.step+(r.onAtChange?" while shown":" after it hid")+": "+(r.on?(r.overlapSwitch||r.others.length?"OVER "+r.overlapSwitch+" "+JSON.stringify(r.others.map(o=>o.el+" "+o.px)):"clear"):"hidden")+(r.placed!==null&&r.placedBefore!==null?" (placed again "+(r.placed-r.placedBefore)+")":"")).join(", "));
    await ctx.close(); }
  await browser.close();
  const bad=out.cases.reduce((n,c)=>n+c.reads.filter(r=>!r.on||r.overlapSwitch>0||r.others.length).length,0);
  out.summary={reads:out.cases.reduce((n,c)=>n+c.reads.length,0), over:bad}; console.log("reads "+out.summary.reads+", shown and over a control or hidden: "+bad);
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
