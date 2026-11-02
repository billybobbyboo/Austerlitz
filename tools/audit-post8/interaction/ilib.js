/* Final audit after Stage 8, area "interaction": shared helpers for the interaction probes (measurement code only; nothing here
   changes the application, its data, its tests or its build).
   - INSTR: an init script run before the page's own scripts: it wraps EventTarget.prototype.addEventListener/removeEventListener,
     setTimeout/clearTimeout, setInterval/clearInterval, requestAnimationFrame/cancelAnimationFrame and the ResizeObserver constructor,
     and keeps window.__IA: live listener records (a target, a type, a function, a capture flag), pending timeouts, live intervals,
     pending animation frames and observers. __IA.count() gives the live listeners on window, document, media queries and connected
     elements (a listener on an element removed from the document dies with it and is not counted), by target kind and type.
   - openV(browser,vp,o): a visitor's page (no ?harness=1 unless o.harness, CSS transitions kept unless o.noTransitions) with INSTR;
     openP(browser,vp,o): a phone page (density 3, touch, isMobile, an iPhone's user agent; as tools/audit-post8/lib.js openPhone).
   - SNAP (in the page, window.__ia.snap()): the state a visitor sees and the state behind it, after each step.
   - FP (window.__ia.fp()): a fingerprint of what the frame draws at the clock (blocks, overlays and their draw-on, the map layer's
     placed items, captions and dispatch text, light, fog), compared between two paths to the same clock (fpDiff).
   Browser: tools/audit-post8/lib.js (the pinned Chromium 141, ANGLE on SwiftShader: software WebGL; no time here is a device's). */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../lib.js");
const TR=require("../../visual/three-route.js");
const ROOT=A.ROOT||path.join(__dirname,"..","..","..");
const EV=path.join(ROOT,"docs","audit-post8-evidence","interaction");
fs.mkdirSync(EV,{recursive:true});
const MEASURE=fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8");

const INSTR=`(function(){
  if(window.__IA) return;
  var IA=window.__IA={recs:[], timeouts:new Map(), intervals:new Map(), rafs:new Map(), observers:[], seq:0, addCalls:0, removeCalls:0,
    tSet:0, tFired:0, tCleared:0, rSet:0, rFired:0, rCancel:0};
  var ET=EventTarget.prototype, add0=ET.addEventListener, rem0=ET.removeEventListener;
  function capOf(o){ return typeof o==="boolean"?o:!!(o&&o.capture); }
  function kindOf(t){ if(t===window) return "window"; if(t===document) return "document";
    if(typeof MediaQueryList!=="undefined"&&t instanceof MediaQueryList) return "mql:"+t.media;
    if(t&&t.nodeType===1) return (t.id?"#"+t.id:t.tagName.toLowerCase()+(t.className&&typeof t.className==="string"?"."+t.className.split(" ")[0]:""));
    return t&&t.constructor?t.constructor.name:"?"; }
  ET.addEventListener=function(type,fn,o){
    IA.addCalls++;
    if(fn){ var c=capOf(o), once=!!(o&&typeof o==="object"&&o.once), dup=false;
      for(var i=IA.recs.length-1;i>=0;i--){ var r=IA.recs[i]; if(r.live&&r.t===this&&r.type===type&&r.fn===fn&&r.cap===c){ dup=true; break; } }
      if(!dup) IA.recs.push({t:this,type:type,fn:fn,cap:c,once:once,live:true,id:++IA.seq,at:(new Error().stack||"").split("\\n").slice(2,4).join(" | ").replace(/file:\\/\\/[^)]*\\//g,"")}); }
    return add0.apply(this,arguments); };
  ET.removeEventListener=function(type,fn,o){
    IA.removeCalls++;
    var c=capOf(o);
    for(var i=IA.recs.length-1;i>=0;i--){ var r=IA.recs[i]; if(r.live&&r.t===this&&r.type===type&&r.fn===fn&&r.cap===c){ r.live=false; break; } }
    return rem0.apply(this,arguments); };
  var st0=window.setTimeout, ct0=window.clearTimeout, si0=window.setInterval, ci0=window.clearInterval, ra0=window.requestAnimationFrame, ca0=window.cancelAnimationFrame;
  window.setTimeout=function(fn,ms){ var a=[].slice.call(arguments,2), id; IA.tSet++;
    var where=(new Error().stack||"").split("\\n").slice(2,3).join("").replace(/file:\\/\\/[^)]*\\//g,"").trim();
    id=st0.call(window,function(){ IA.timeouts.delete(id); IA.tFired++; if(typeof fn==="function") return fn.apply(this,a); },ms);
    IA.timeouts.set(id,{ms:ms,at:where,t:performance.now()}); return id; };
  window.clearTimeout=function(id){ if(IA.timeouts.has(id)){ IA.timeouts.delete(id); IA.tCleared++; } return ct0.call(window,id); };
  window.setInterval=function(fn,ms){ var a=[].slice.call(arguments,2), id=si0.call(window,function(){ if(typeof fn==="function") return fn.apply(this,a); },ms);
    IA.intervals.set(id,{ms:ms,at:(new Error().stack||"").split("\\n").slice(2,3).join("").trim()}); return id; };
  window.clearInterval=function(id){ IA.intervals.delete(id); return ci0.call(window,id); };
  window.requestAnimationFrame=function(fn){ var id; IA.rSet++;
    var where=(new Error().stack||"").split("\\n").slice(2,3).join("").replace(/file:\\/\\/[^)]*\\//g,"").trim();
    id=ra0.call(window,function(ts){ IA.rafs.delete(id); IA.rFired++; return fn(ts); }); IA.rafs.set(id,where); return id; };
  window.cancelAnimationFrame=function(id){ if(IA.rafs.has(id)){ IA.rafs.delete(id); IA.rCancel++; } return ca0.call(window,id); };
  if(window.ResizeObserver){ var RO=window.ResizeObserver; window.ResizeObserver=function(cb){ var o=new RO(cb); IA.observers.push({kind:"ResizeObserver",at:(new Error().stack||"").split("\\n").slice(2,3).join("").trim()}); return o; }; window.ResizeObserver.prototype=RO.prototype; }
  IA.count=function(){
    var by={}, n=0, dead=0, detached=0;
    IA.recs.forEach(function(r){ if(!r.live){ dead++; return; }
      var t=r.t, conn=(t===window||t===document||!(t&&t.nodeType)||t.isConnected);
      if(!conn){ detached++; return; }
      n++; var k=kindOf(t)+" "+r.type+(r.cap?" (capture)":""); by[k]=(by[k]||0)+1; });
    var tm={}; IA.timeouts.forEach(function(v){ var k=v.at+" "+v.ms; tm[k]=(tm[k]||0)+1; });
    var rf={}; IA.rafs.forEach(function(v){ rf[v]=(rf[v]||0)+1; });
    return {live:n, removed:dead, onDetached:detached, total:IA.recs.length, addCalls:IA.addCalls, removeCalls:IA.removeCalls,
      byTarget:by, timeouts:IA.timeouts.size, timeoutsBy:tm, intervals:IA.intervals.size, rafs:IA.rafs.size, rafsBy:rf, observers:IA.observers.length,
      tSet:IA.tSet, tFired:IA.tFired, tCleared:IA.tCleared, rSet:IA.rSet, rFired:IA.rFired, rCancel:IA.rCancel}; };
})();`;

/* in the page: what a visitor sees and the state behind it */
const SNAP=function(){
  if(window.__ia) return true;
  function q(id){ return document.getElementById(id); }
  function vis(e){ if(!e||!e.isConnected||e===document.body) return false;
    for(var p=e;p;p=p.parentElement){ var c=getComputedStyle(p); if(c.display==="none"||c.visibility==="hidden"||p.hidden||+c.opacity===0) return false; }
    var r=e.getBoundingClientRect(); return r.width>0&&r.height>0&&r.right>0&&r.bottom>0&&r.left<innerWidth&&r.top<innerHeight; }
  function box(e){ if(!e) return null; var r=e.getBoundingClientRect(); return [Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]; }
  function g(f,d){ try{ var v=f(); return v===undefined?d:v; }catch(e){ return d; } }
  function txt(e){ return e?(e.textContent||"").replace(/\s+/g," ").trim():null; }
  function focusName(a){ if(!a||a===document.body) return "body"; return a.id?"#"+a.id:(a.tagName.toLowerCase()+"."+String(a.className||"").split(" ")[0]+(a.textContent?"["+a.textContent.trim().slice(0,24)+"]":"")); }
  var S={};
  S.snap=function(){
    var s=window.__aus.state(), t=q("toast"), a=document.activeElement, cap=q("tb-cap"), dr=q("drawer"), db=q("drawer-body");
    var ovN=g(function(){ var n=0; curOv.traverse(function(o){ if(o.isMesh||o.isLine||o.isSprite) n++; }); return n; },null);
    var smoke=g(function(){ var n=0; for(var id in units){ var r=units[id]; if(r.smoke&&r.smoke.visible) n++; } return n; },null);
    var blocks=g(function(){ var n=0; for(var id in units){ var r=units[id]; if(r.block&&r.block.visible) n++; } return n; },null);
    return Object.assign(s,{
      clockText:txt(q("clockread")), speed:g(function(){ return speed; },null), speedBtn:txt(q("speedbtn")),
      speedPressed:g(function(){ var b=document.querySelector('.spd-btn[aria-pressed="true"]'); return b?b.dataset.s:null; },null),
      dwellOn:g(function(){ return DWELL.on; },null), dwellSt:g(function(){ return DWELL.st?DWELL.st.stage+"@"+DWELL.st.E:null; },null), dwellNext:g(function(){ return DWELL.next; },null),
      dwellBtn:g(function(){ return q("dwell").getAttribute("aria-pressed"); },null),
      curPhase:g(function(){ return curPhase; },null), chapter:g(function(){ return chapter?(chapter.id||String(chapter)):null; },null),
      tourStep:g(function(){ return tourStep; },null), openingK:g(function(){ return OPENING.k; },null),
      openingPlay:g(function(){ return OPENING.play?{to:OPENING.play.to,target:OPENING.play.target,speed0:OPENING.play.speed0}:null; },null),
      TOURCV:g(function(){ return TOURCV; },null), curVantage:g(function(){ return curVantage; },null),
      playBtn:txt(q("play"))+"/"+g(function(){ return q("play").getAttribute("aria-pressed"); },""), followBtn:g(function(){ return q("follow").getAttribute("aria-pressed"); },null),
      caption:cap?(cap.title||txt(cap)):null, capVisible:vis(cap),
      toast:{text:txt(t), on:!!(t&&t.classList.contains("on")), op:t?+(+getComputedStyle(t).opacity).toFixed(2):null, box:box(t), timer:g(function(){ return !!flash._t; },null)},
      livePhase:txt(q("live-phase")),
      selchip:vis(q("selchip"))?txt(q("selchip")):null,
      drawer:{on:!!(dr&&dr.classList.contains("on")), visible:vis(dr), head:txt(db&&db.querySelector("h2,h3,.dh,.cc-name")), len:db?db.innerHTML.length:0, inert:!!(dr&&dr.inert)},
      panels:{railHidden:document.body.classList.contains("rail-hidden"), railVisible:vis(q("rail")), railInert:!!(q("rail")&&q("rail").inert), dispatchVisible:vis(document.querySelector(".dispatch")),
        legendOpen:g(function(){ return ML.legendOpen; },null), layers:!q("layerpop").hidden, help:g(function(){ return helpOpen(); },null),
        modal:!!q("modal").classList.contains("on"), tourbar:!q("tourbar").hidden, firstrun:g(function(){ return firstRunOpen; },null),
        menu:g(function(){ return menuOpen(); },null), dsheet:g(function(){ return dsheetOpen(); },null), hideDispatch:g(function(){ return hideDispatch; },null),
        docked:g(function(){ return docked; },null), tab:g(function(){ return tabNow; },null), eyecap:vis(q("eyecap")), vsbadge:vis(q("vsbadge")), restore:vis(q("restore"))},
      focus:focusName(a), focusVisible:(a&&a!==document.body)?vis(a):null,
      inertKids:[].filter.call(document.body.children,function(k){ return k.inert; }).map(function(k){ return k.id||k.className; }),
      ml:g(function(){ return {items:ML.stats.items, placed:ML.stats.placed, dropped:ML.stats.dropped}; },null),
      overlays:ovN, drawon:g(function(){ return DRAWON.map(function(d){ return +(+d.s).toFixed(3); }); },null), smoke:smoke, blocks:blocks,
      tween:g(function(){ return {any:!!tween, cam:!!_tw.cam, scene:!!_tw.scene}; },null), devState:g(function(){ return DEV.state; },null),
      phaseTitle:txt(q("d-title"))
    });
  };
  /* a fingerprint of what the frame draws at the clock (for two paths to the same clock) */
  S.fp=function(){
    function r2(v){ return Math.round(v*100)/100; }
    var U={};
    g(function(){ for(var id in units){ var r=units[id], b=r.block; if(!b) continue;
      U[id]=[b.visible?1:0, r2(b.position.x), r2(b.position.y), r2(b.position.z), r2(b.rotation.y), r2(b.scale.x), r.smoke&&r.smoke.visible?1:0, r.dust&&r.dust.visible?1:0].join(","); } });
    var M={};
    g(function(){ for(var k in ML.items){ var it=ML.items[k]; if(!it.on||!it.el||it.el.style.display==="none") continue;
      M[k]=[(it.el.textContent||"").replace(/\s+/g," ").trim().slice(0,60), it.rect?it.rect.map(Math.round).join(" "):"-", (+it.op).toFixed(2)].join("|"); } });
    var O=[];
    g(function(){ curOv.traverse(function(o){ if(!(o.isMesh||o.isLine||o.isSprite)) return; var m=o.material||{}; O.push([o.type,o.visible?1:0,(m.opacity!==undefined?(+m.opacity).toFixed(3):"-"),o.geometry&&o.geometry.attributes&&o.geometry.attributes.position?o.geometry.attributes.position.count:0].join(":")); }); });
    var L=g(function(){ return LIGHT_NOW?JSON.stringify(LIGHT_NOW,function(k,v){ return typeof v==="number"?Math.round(v*1000)/1000:v; }).slice(0,400):null; },null);
    return {clock:g(function(){ return clock; },null), phase:g(function(){ return curPhase; },null), units:U, ml:M, overlays:O,
      drawon:g(function(){ return DRAWON.map(function(d){ return +(+d.s).toFixed(4); }); },[]),
      ovFade:g(function(){ return [+ovFadeIn.toFixed(3),+ovFadeOut.toFixed(3)]; },null),
      caption:g(function(){ return q("tb-cap").title; },null), situation:txt(q("situation")),
      dispatch:[txt(q("d-clock")),txt(q("d-title")),txt(q("d-lede")),txt(q("d-events")),txt(q("d-changes"))].join(" / "),
      clockText:txt(q("clockread")), light:L, cam:window.__aus.state().cam,
      fog:g(function(){ var o={}; for(var k in ATMO.u){ var v=ATMO.u[k].value; o[k]=typeof v==="number"?Math.round(v*1e4)/1e4:(v&&v.toArray?v.toArray().map(function(x){ return Math.round(x*1e4)/1e4; }).join(","):String(v)); } return o; },null),
      know:g(function(){ return commandView; },null), sel:g(function(){ return selection?selection.kind+":"+selection.id:null; },null),
      drawerLen:g(function(){ return q("drawer-body").innerHTML.length; },0)};
  };
  window.__ia=S; return true;
};

/* in the page: a frame driver (after tools/visual/motion.js inPage): the app's own animation loop stopped and run one frame at a time on a
   clock of its own (performance.now answers the driver's time, advanced a frame's length at each step), the WebGL draw skipped unless asked
   (draw(): one real frame of what the app shows, the clock frozen), so that under this machine's software WebGL a played stretch costs
   milliseconds a frame. Every rule that reads the clock (Play, the dwell, Follow, the tweens and glides, the input hold) runs as it would at
   30 frames a second. Nothing of the app is changed: its loop() is called as requestAnimationFrame would call it. */
const DRV=function(){
  if(window.__drv) return true;
  var realNow=performance.now.bind(performance), realRaf=window.requestAnimationFrame, realRender=renderer.render, T=0, on=false, broken=false, gl=false;
  var D={frameMs:1000/30, frames:0};
  D.start=function(o){ o=o||{}; if(on) return D; on=true; D.frameMs=o.frameMs||1000/30; T=realNow()+(o.gap||0);
    window.requestAnimationFrame=function(cb){ if(cb===window.loop){ broken=true; return 0; } return realRaf.call(window,cb); };
    performance.now=function(){ return T; };
    renderer.render=function(){ if(gl) return realRender.apply(renderer,arguments); };
    return D; };
  D.frame=function(n){ for(var i=0;i<(n||1);i++){ T+=D.frameMs; D.frames++; window.loop(); } return D.frames; };
  /* frames until a condition (a string evaluated in the page) holds, at most n */
  D.until=function(cond,n){ var f=new Function("return ("+cond+");"); for(var i=0;i<(n||1);i++){ if(f()) return i; T+=D.frameMs; D.frames++; window.loop(); } return f()?n:-1; };
  /* n frames, each followed by [clock, the dwell's stage, speed, playing] */
  D.trace=function(n){ var r=[]; for(var i=0;i<(n||1);i++){ T+=D.frameMs; D.frames++; window.loop(); r.push([+clock.toFixed(4), DWELL.st?DWELL.st.stage:"-", speed, playing?1:0]); } return r; };
  D.draw=function(){ gl=true; try{ renderFrame(); } finally{ gl=false; } return true; };
  /* one real frame drawn inside an animation frame, then one more animation frame, so that the compositor has taken the canvas before a
     screenshot (with the app's loop stopped nothing else asks the browser for a frame) */
  D.drawFrame=function(){ return new Promise(function(res){ realRaf.call(window,function(){ gl=true; try{ renderFrame(); } finally{ gl=false; }
    realRaf.call(window,function(){ realRaf.call(window,function(){ res(true); }); }); }); }); };
  D.now=function(){ return T; };
  D.advance=function(ms){ T+=ms; return T; };
  D.on=function(){ return on; };
  D.stop=function(){ if(!on) return; on=false; performance.now=realNow; window.requestAnimationFrame=realRaf; renderer.render=realRender; requestRender(3); if(broken) realRaf.call(window,window.loop); broken=false; };
  window.__drv=D; return true;
};
function inject(page,fn){ return page.evaluate("("+fn.toString()+")()"); }

function track(page){
  page._log=[];
  page.on("console",m=>{ const t=m.type(); if(t==="warning"||t==="error"||t==="assert") page._log.push({type:t,text:m.text().slice(0,400),at:Date.now()}); });
  page.on("pageerror",e=>page._log.push({type:"pageerror",text:String(e.message).slice(0,400),at:Date.now()}));
  page.on("crash",()=>page._log.push({type:"crash",text:"page crashed",at:Date.now()}));
  return page;
}
const htmlPath=()=>path.resolve(process.env.AUSTERLITZ_HTML||path.join(ROOT,"austerlitz-command-map.html"));
async function finishOpen(page,o){
  await TR.routeThree(page);
  const t0=Date.now();
  await page.goto("file://"+htmlPath()+(o.harness?"?harness=1":""),{waitUntil:"commit",timeout:180000});
  await TR.waitBoot(page,300000,250);
  page._loadMs=Date.now()-t0;
  await page.evaluate(MEASURE);
  if(o.noTransitions) await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  await inject(page,SNAP);
  await inject(page,DRV);
  if(o.drive!==false) await page.evaluate(()=>window.__drv.start());
  return page;
}
async function openV(browser,vp,o){
  o=o||{};
  const ctx=await browser.newContext({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:1,reducedMotion:o.rm?"reduce":"no-preference"});
  const page=track(await ctx.newPage());
  if(o.instr!==false) await page.addInitScript(INSTR);
  return finishOpen(page,o);
}
async function openP(browser,vp,o){
  o=o||{};
  const ctx=await browser.newContext({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:A.IOS_UA,reducedMotion:o.rm?"reduce":"no-preference"});
  const page=track(await ctx.newPage());
  if(o.instr!==false) await page.addInitScript(INSTR);
  return finishOpen(page,o);
}
const snap=page=>page.evaluate(()=>window.__ia.snap());
const fp=page=>page.evaluate(()=>window.__ia.fp());
const counts=page=>page.evaluate(()=>window.__IA?window.__IA.count():null);
async function shot(page,name,q){ const f=path.join(EV,name.endsWith(".jpg")?name:name+".jpg"); await A.jpeg(page,f,q||72); return path.relative(ROOT,f); }
/* real time: let the app's own loop run for ms milliseconds of wall clock */
const wait=(page,ms)=>page.waitForTimeout(ms);
/* wait until the app's loop is idle (nothing left to draw) or until ms */
async function idle(page,ms){ const t0=Date.now(); while(Date.now()-t0<(ms||60000)){ const s=await page.evaluate(()=>DEV.state); if(s==="idle") return Date.now()-t0; await page.waitForTimeout(300); } return -1; }
/* frames drawn by the app's loop (count) */
const loopN=page=>page.evaluate(()=>loop._n||0);
async function frames(page,n,maxMs){ const a=await loopN(page), t0=Date.now(); while(Date.now()-t0<(maxMs||120000)){ if((await loopN(page))-a>=n) return Date.now()-t0; await page.waitForTimeout(100); } return -1; }
/* differences between two fingerprints */
function fpDiff(a,b){
  const d=[];
  ["clock","phase","caption","situation","dispatch","clockText","light","know","sel","drawerLen"].forEach(k=>{ if(JSON.stringify(a[k])!==JSON.stringify(b[k])) d.push({k:k,a:a[k],b:b[k]}); });
  if(JSON.stringify(a.drawon)!==JSON.stringify(b.drawon)) d.push({k:"drawon",a:a.drawon,b:b.drawon});
  if(JSON.stringify(a.ovFade)!==JSON.stringify(b.ovFade)) d.push({k:"ovFade",a:a.ovFade,b:b.ovFade});
  if(JSON.stringify(a.overlays)!==JSON.stringify(b.overlays)) d.push({k:"overlays",a:a.overlays.length,b:b.overlays.length,diff:a.overlays.filter((x,i)=>x!==b.overlays[i]).slice(0,8)});
  if(JSON.stringify(a.fog)!==JSON.stringify(b.fog)) d.push({k:"fog",a:a.fog,b:b.fog});
  if(JSON.stringify(a.cam)!==JSON.stringify(b.cam)) d.push({k:"cam",a:a.cam,b:b.cam});
  const U=new Set([...Object.keys(a.units),...Object.keys(b.units)]), ud=[];
  U.forEach(k=>{ if(a.units[k]!==b.units[k]) ud.push({id:k,a:a.units[k],b:b.units[k]}); });
  if(ud.length) d.push({k:"units",n:ud.length,first:ud.slice(0,12)});
  const M=new Set([...Object.keys(a.ml),...Object.keys(b.ml)]), md=[];
  M.forEach(k=>{ if(a.ml[k]!==b.ml[k]) md.push({key:k,a:a.ml[k]||null,b:b.ml[k]||null}); });
  if(md.length) d.push({k:"ml",n:md.length,first:md.slice(0,12)});
  return d;
}
/* the driver from node */
const F=(page,n)=>page.evaluate(k=>window.__drv.frame(k),n||1);
async function play(page,frames,chunk){ chunk=chunk||150; let done=0; while(done<frames){ const k=Math.min(chunk,frames-done); await F(page,k); done+=k; } return done; }
const trace=(page,n)=>page.evaluate(k=>window.__drv.trace(k),n||1);
const until=(page,cond,n)=>page.evaluate(([c,k])=>window.__drv.until(c,k),[cond,n||300]);
async function drawShot(page,name,q){ await page.evaluate(()=>window.__drv.drawFrame()); return shot(page,name,q); }
/* a real click (page.mouse: a press and a release from the browser's input pipeline) at an element's centre, after checking that the
   element is what a pointer there would hit (Playwright's own actionability waits for animation frames, which this machine's software
   compositor starves under load) */
async function clickEl(page,sel,o){
  o=o||{};
  const r=await page.evaluate(([s,i])=>{ const L=typeof s==="string"?document.querySelectorAll(s):null; const e=L?L[i||0]:null; if(!e) return {err:"no element "+s};
    const b=e.getBoundingClientRect(); if(!(b.width>0&&b.height>0)) return {err:"not laid out "+s};
    const x=b.left+b.width/2, y=b.top+b.height/2, h=document.elementFromPoint(x,y);
    return {x:x,y:y,hit:!!(h&&(h===e||e.contains(h))),top:h?(h.id?"#"+h.id:h.tagName+"."+String(h.className).split(" ")[0]):null}; },[sel,o.index||0]);
  if(r.err) throw new Error("clickEl: "+r.err);
  if(!r.hit&&!o.force) throw new Error("clickEl: "+sel+" is covered by "+r.top);
  if(o.tap) await page.touchscreen.tap(r.x,r.y); else if(o.dbl) await page.mouse.dblclick(r.x,r.y); else await page.mouse.click(r.x,r.y);
  return r;
}
const tapEl=(page,sel,o)=>clickEl(page,sel,Object.assign({},o||{},{tap:true}));
async function focusEl(page,sel){ return page.evaluate(s=>{ const e=document.querySelector(s); if(e) e.focus(); return document.activeElement===e; },sel); }
function log(...a){ console.log(new Date().toISOString().slice(11,19),...a); }
module.exports={tapEl,trace,clickEl,focusEl,A,ROOT,EV,INSTR,SNAP,DRV,F,play,until,drawShot,openV,openP,snap,fp,fpDiff,counts,shot,wait,idle,frames,loopN,inject,log,MEASURE};
