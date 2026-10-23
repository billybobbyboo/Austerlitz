#!/usr/bin/env node
/* Stage 8 Part A (docs/STAGE8_SPEC.md section 9): three findings carried from earlier reviews, checked on the build as it is, by real input where
   input is the question. Each check states what it measured; none changes the build.
   1. The headquarters view and the dossier's centring. Under a "Whose eyes?" reading (Napoleon's headquarters, 08:30), the dossier's "Centre the
      map here" and the order of battle's rows call focusOn(id), which centres on posOf (the formation's true position). Measured: for each enemy
      formation the reading does not know (drawnKnow "unknown") or knows only as reported, where the camera's target lands after the real click
      (the glide finished), against the true position and against the reading's own (readPos). Then at the eye level, a known formation's
      centring: whether the eye level is left, and whether the target lands at the free rectangle's centre with the dossier open.
   2. The source notes' visibility. A formation's dossier (Saint-Hilaire's) opened as a click on its name opens it, at 1600 x 900, 1366 x 768 and
      390 x 844 (a phone): which of its sourcing elements (the position's claim and grade line, the notes, the claim tags, "How this is
      sourced") are inside the visible part of the dossier without scrolling, and how far down the button is; and whether "Accuracy and
      sources" is on the screen.
   3. The timeline's tip and focus. By real keys, mouse and touch: Tab to an event marker (the tip shown, named), Enter (the dossier opens),
      Esc (the dossier closes, focus handed back to the marker: is a tip shown that no pointer asked for?); a mouse click on a phase, the pointer
      moved away (the tip after 400 ms); on a phone, a tap on an event marker (the tip after 1 s); where the tip stands against the focused
      element and the screen.
   The clicks are real mouse clicks at the element's centre without Playwright's wait for two equal animation frames ("stable"), which the
   page's software-rendered frames (several seconds each) can outlast.
   node tools/stage8/carried.js [--json file] [--only centring,sources,tips]   Measurement only. With --only, the parts not run are kept from
   the existing --json file. */
"use strict";
const fs=require("fs"), path=require("path");
const { chromium } = require("playwright");
const L=require("./lib.js"), TR=require("../visual/three-route.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const JSONF=opt("--json"), ONLY=opt("--only")?opt("--only").split(","):null, want=k=>!ONLY||ONLY.includes(k);
async function fresh(browser,vp,dev){
  const o={viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:dev?3:1};
  if(dev){ o.isMobile=true; o.hasTouch=true; o.userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1"; }
  const ctx=await browser.newContext(o), page=await ctx.newPage(); await TR.routeThree(page);
  await page.goto("file://"+path.join(L.ROOT,"austerlitz-command-map.html")+"?harness=1",{waitUntil:"commit",timeout:180000});
  await TR.waitBoot(page,240000,250);
  await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  return {ctx,page};
}
(async()=>{
  const browser=await L.launch(), R=(ONLY&&JSONF&&fs.existsSync(JSONF))?JSON.parse(fs.readFileSync(JSONF,"utf8")):{};
  /* ---- 1. the headquarters view and the centring ---- */
  if(want("centring")){ const {ctx,page}=await fresh(browser,[1600,900]);
    await page.evaluate(()=>{ closeFirst&&closeFirst("explore"); setClock(510,{instant:true,force:true,camera:false}); setCommandView("fr"); AUSTERLITZ_DEBUG.settle(30); });
    const cand=await page.evaluate(()=>Object.keys(units).filter(id=>sideOfNation(FORMATIONS[id].nation)==="al"&&posNow(id)).map(id=>({id, know:drawnKnow(id), read:!!readPos(id)})));
    const pick=cand.filter(c=>c.know==="unknown").slice(0,4).concat(cand.filter(c=>c.know==="uncertain").slice(0,2));
    R.centring={reading:"fr", clock:"08:30", candidates:{unknown:cand.filter(c=>c.know==="unknown").length, uncertain:cand.filter(c=>c.know==="uncertain").length, total:cand.length}, cases:[]};
    for(const c of pick){
      await page.evaluate(id=>{ select("f",id); AUSTERLITZ_DEBUG.settle(5); },c.id);
      const full=page.getByRole("button",{name:/Full dossier/}); if(await full.count()) await full.first().click({force:true,timeout:60000});   /* the compact card's way to the full dossier */
      const btn=page.getByRole("button",{name:"Centre the map here"}); const n=await btn.count();
      if(!n){ R.centring.cases.push({id:c.id, know:c.know, button:false}); continue; }
      await btn.first().click({force:true,timeout:60000});
      const r=await page.evaluate(id=>{ var n=0; while(tween&&n<6){ tween(performance.now()+1e7); n++; } AUSTERLITZ_DEBUG.settle(3);
        var p=posNow(id), w=W(p[0],p[1]), rp=readPos(id), d=Math.hypot(orbitTarget.x-w[0],orbitTarget.z-w[1]);
        var drawn=units[id].block.visible, lbl=ML.items["n:"+id]&&ML.items["n:"+id].state==="on";
        return {targetToTrue:+d.toFixed(3), readPos:rp?[+rp[0].toFixed(1),+rp[1].toFixed(1)]:null, figuresDrawn:drawn, nameDrawn:!!lbl, know:drawnKnow(id),
          screen:(function(){ var v=new THREE.Vector3(w[0],groundY(w[0],w[1]),w[1]).project(camera); return [Math.round((v.x*0.5+0.5)*innerWidth),Math.round((-v.y*0.5+0.5)*innerHeight)]; })()}; },c.id);
      R.centring.cases.push(Object.assign({id:c.id, button:true},r));
    }
    /* the eye level: Napoleon's headquarters, a known French formation's centring */
    const eye=await page.evaluate(()=>{ select(null,null); eyeEnter(); AUSTERLITZ_DEBUG.settle(10); var id=Object.keys(units).filter(k=>sideOfNation(FORMATIONS[k].nation)==="fr"&&FORMATIONS[k].arm!=="hq"&&drawnKnow(k)!=="unknown"&&posNow(k))[0];
      select("f",id); AUSTERLITZ_DEBUG.settle(5); return {id:id, eyeOn:EYE.on}; });
    if(await page.getByRole("button",{name:/Full dossier/}).count()) await page.getByRole("button",{name:/Full dossier/}).first().click({force:true,timeout:60000});
    await page.getByRole("button",{name:"Centre the map here"}).first().click({force:true,timeout:60000});
    R.centring.eye=Object.assign(eye,await page.evaluate(id=>{ var n=0; while(tween&&n<6){ tween(performance.now()+1e7); n++; } AUSTERLITZ_DEBUG.settle(5);
      var fr=landFreeRect(), c=[(fr[0]+fr[2])/2,(fr[1]+fr[3])/2], v=orbitTarget.clone().project(camera), s=[(v.x*0.5+0.5)*innerWidth,(-v.y*0.5+0.5)*innerHeight];
      return {eyeAfter:EYE.on, commandView:commandView, targetFromFreeCentrePx:+Math.hypot(s[0]-c[0],s[1]-c[1]).toFixed(1), dossierOpen:drawerShown(), freeRect:fr.map(Math.round)}; },eye.id));
    await ctx.close(); }
  /* ---- 2. the source notes' visibility ---- */
  if(want("sources")) R.sources=[];
  if(want("sources")) for(const vp of [[1600,900,false],[1366,768,false],[390,844,true]]){
    const {ctx,page}=await fresh(browser,[vp[0],vp[1]],vp[2]);
    await page.evaluate(()=>{ closeFirst&&closeFirst("explore"); setClock(570,{instant:true,force:true,camera:false}); select("f","sthilaire"); AUSTERLITZ_DEBUG.settle(20); });
    await page.waitForTimeout(300);
    const measure=()=>page.evaluate(()=>{ var d=document.getElementById("drawer"), out={dossierShown:drawerShown()};
      if(!d) return out; var sc=document.getElementById("drawer-body")||d, vr=sc.getBoundingClientRect(), vis=function(e){ if(!e) return null; var r=e.getBoundingClientRect(); return {inView:r.bottom<=Math.min(vr.bottom,innerHeight)+1&&r.top>=Math.max(vr.top,0)-1&&r.height>0, top:Math.round(r.top), bottom:Math.round(r.bottom)}; };
      var btn=[].slice.call(d.querySelectorAll("button")).filter(function(b){ return /How this is sourced/.test(b.textContent); })[0];
      out.viewport=[innerWidth,innerHeight]; out.scrollBox=[Math.round(vr.top),Math.round(vr.bottom)]; out.scrollHeight=sc.scrollHeight; out.clientHeight=sc.clientHeight;
      out.compact=!!d.querySelector(".card-compact"); out.expand=[].slice.call(d.querySelectorAll("button")).map(function(b){ return b.textContent.trim(); }).filter(function(t){ return /more|full|expand|dossier/i.test(t); }).slice(0,3);
      out.sourced=vis(btn); out.claimTags=d.querySelectorAll(".claimtag,.ctag,[class*='claim']").length;
      out.notes=[].slice.call(d.querySelectorAll("p.note,p.conf")).map(vis);
      var acc=[].slice.call(document.querySelectorAll("button,a")).filter(function(b){ return /Accuracy and sources/.test(b.textContent); })[0];
      out.accuracy=acc?(function(){ var r=acc.getBoundingClientRect(), cs=getComputedStyle(acc); return {onScreen:r.width>0&&r.bottom<=innerHeight&&r.top>=0&&cs.visibility!=="hidden", top:Math.round(r.top)}; })():null;
      return out; });
    const card=await measure();
    if(await page.getByRole("button",{name:/Full dossier/}).count()){ await page.getByRole("button",{name:/Full dossier/}).first().click({force:true,timeout:60000}); await page.waitForTimeout(300); }
    const full=await measure();
    R.sources.push({vp:vp.slice(0,2).join("x"), card:card, full:full}); await ctx.close();
  }
  /* ---- 3. the timeline's tip and focus ---- */
  if(want("tips")){ const {ctx,page}=await fresh(browser,[1600,900]);
    await page.evaluate(()=>{ closeFirst&&closeFirst("explore"); setClock(570,{instant:true,force:true,camera:false}); AUSTERLITZ_DEBUG.settle(10); });
    const tipState=()=>page.evaluate(()=>{ var tp=document.getElementById("tltip"), a=document.activeElement; var r=tp&&!tp.hidden?tp.getBoundingClientRect():null, f=a&&a.getBoundingClientRect?a.getBoundingClientRect():null;
      return {tip:tp&&!tp.hidden?tp.textContent.slice(0,60):null, focus:a?(a.getAttribute("aria-label")||a.textContent||a.id||a.className).slice(0,60):null,
        overFocus:!!(r&&f&&r.left<f.right&&f.left<r.right&&r.top<f.bottom&&f.top<r.bottom), tipBox:r?[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]:null}; });
    const T={};
    /* keyboard: focus an event marker by Tab from the slider */
    await page.focus(".tb-rail [role=slider], [role=slider]");
    let found=false; for(let i=0;i<60&&!found;i++){ await page.keyboard.press("Tab"); found=await page.evaluate(()=>{ var a=document.activeElement; return !!(a&&a.dataset&&a.dataset.tip&&/ev|mark/i.test(a.className)); }); }
    T.tabToMarker=Object.assign({reached:found},await tipState());
    await page.keyboard.press("Enter"); await page.waitForTimeout(400); T.enter=Object.assign({dossier:await page.evaluate(()=>drawerShown())},await tipState());
    await page.keyboard.press("Escape"); await page.waitForTimeout(400);
    T.escape1=Object.assign({dossier:await page.evaluate(()=>drawerShown())},await tipState());
    if(T.escape1.dossier){ await page.keyboard.press("Escape"); await page.waitForTimeout(400); T.escape2=Object.assign({dossier:await page.evaluate(()=>drawerShown())},await tipState()); }
    /* mouse: a click on a phase, then the pointer onto the map */
    const ph=await page.evaluate(()=>{ var b=[].slice.call(document.querySelectorAll("[data-tip]")).filter(function(e){ return e.classList&&e.classList.contains("step")&&e.getBoundingClientRect().width>20; })[3]; if(!b) return null; var r=b.getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2,b.className]; });
    if(ph){ await page.mouse.move(ph[0],ph[1]); await page.waitForTimeout(150); T.hoverPhase=await tipState(); await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(150); T.clickPhase=await tipState();
      await page.mouse.move(800,300); await page.waitForTimeout(400); T.pointerAway=await tipState(); }
    R.tips={desktop:T}; await ctx.close(); }
  if(want("tips")){ const {ctx,page}=await fresh(browser,[390,844],true);
    await page.evaluate(()=>{ closeFirst&&closeFirst("explore"); setClock(570,{instant:true,force:true,camera:false}); AUSTERLITZ_DEBUG.settle(10); });
    const mk=await page.evaluate(()=>{ var b=[].slice.call(document.querySelectorAll("[data-tip]")).filter(function(e){ var r=e.getBoundingClientRect(); return r.width>0&&r.height>0&&/ev|mark/i.test(e.className); })[2]; if(!b) return null; var r=b.getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2]; });
    const st=()=>page.evaluate(()=>{ var tp=document.getElementById("tltip"); return {tip:tp&&!tp.hidden?tp.textContent.slice(0,60):null, drawer:drawerShown()}; });
    if(mk){ await page.touchscreen.tap(mk[0],mk[1]); await page.waitForTimeout(1000); R.tips.phoneTap=await st(); await page.waitForTimeout(2000); R.tips.phoneTap3s=await st(); }
    await ctx.close(); }
  await browser.close();
  console.log(JSON.stringify(R,null,1));
  if(JSONF){ fs.mkdirSync(path.dirname(JSONF),{recursive:true}); fs.writeFileSync(JSONF,JSON.stringify(R,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
