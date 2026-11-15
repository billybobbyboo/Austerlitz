/* UI/UX roadmap step 1 (docs/UX_ART_AUDIT.md sections 5 and 6, PR 1: UA-05, UA-06, UA-12, UA-13, UA-17): the map key and the timeline under
   real browser input. Shared by the harness's live block "ux1" (check:selftest and check:visual; judged in thresholds.js checkUx1) and the
   standalone probe tools/ux-step1/probe.js (any build, the base build included: its record is the reproduction). Every press here is the
   browser's own input (Playwright's mouse, keyboard and touchscreen, and CDP's touch events for a cancelled touch); page.evaluate only sets
   up a state (the clock, the card opened again) and reads the result. Emulated touch (Chromium's touch emulation, density 3 and an iPhone's
   user agent on the phone page) is not a physical device.
   - key (UA-05): at every viewport and by click, tap and keyboard, "Show the key" on the first card leaves a key row visible, topmost at its
     centre and inside the viewport, with the focus on an element that holds it, within 500 ms; then Esc: the focus on a shown control, never
     the page, and the "?" sheet (where it was opened) closed.
   - drag (UA-06, desktop): the playhead under the 04:15 marker, a 200 px drag in moves of 2, 8, 16 and 33 px ends at the time under the release
     and opens no event; a drag released outside the rail; a drag whose capture is lost; a touch drag cancelled (CDP touchCancel); after each,
     an ordinary click on a marker opens its event at its start.
   - lane (UA-06, touch): taps along the rail's lower 16 px seek to the time under the tap and open nothing, at 09:00 too and at every marker's
     x; a tap at each marker opens its event (or, where coincident markers stand stacked, the chooser naming it).
   - coincident (UA-17): every event that shares its start with another opened by pointer (mouse, and touch on the phone) and by keyboard, its
     marker at its exact time on the rail.
   - phases (UA-13): no two phase labels' drawn text overlapping, no act name drawn cut in the caption, at 1024, 1280 and 1440 px, each phase
     current and at every event start.
   - scroll (UA-12): the scrolling panels' scrollbar colours by theme (computed style), and the key's text clear of its scrollbar. */
"use strict";
const STEPS=[2,8,16,33], LANE_TOL=3;   /* minutes: a tap's seek against the time under it (2.25 min a px on a 374 px rail) */
const KEY_VIEWS=[[1600,900],[1366,768],[1080,800],[1079,800],[800,450],[721,800],[720,800],[1280,431],[1280,430],[390,844]];
/* check:selftest (its CI job's limit 60 minutes; the block's full run took it past the limit on this branch's first commit): the boundaries at
   1080 px wide and 430 px tall and the phone, the draw skipped throughout and the lane swept every 24 px; check:visual and the probe run all */
const KEY_VIEWS_SO=[[1080,800],[1079,800],[1280,431],[1280,430],[390,844]];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

/* in the page: the visible key rows (topmost at their centre, inside the viewport) and the focus */
function keyState(){
  const vw=innerWidth, vh=innerHeight, a=document.activeElement;
  const R=[].slice.call(document.querySelectorAll("#lg-rows .k, #help .hp-key .k")).filter(k=>{
    if(k.hidden||k.closest("[hidden]")) return false;
    if(k.checkVisibility&&!k.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})) return false;
    const r=k.getBoundingClientRect(); if(r.width<2||r.height<2) return false;
    const x=r.left+Math.min(r.width/2,40), y=r.top+r.height/2; if(x<0||y<0||x>vw-1||y>vh-1) return false;
    const h=document.elementFromPoint(x,y); return !!h&&(h===k||k.contains(h)); });
  const inKey=!!a&&a!==document.body&&R.some(k=>a.contains(k));
  const hp=document.getElementById("help");
  return {rows:R.length, where:R.length?(R[0].closest("#help")?"help":"legend"):null, focus:a?(a.id||a.className||a.tagName):null, focusHolds:inKey,
    help:!!hp&&!hp.hidden, card:typeof firstRunOpen!=="undefined"?firstRunOpen:null};
}
function focusShown(){
  const a=document.activeElement; if(!a||a===document.body||a===document.documentElement) return {focus:null,shown:false};
  const r=a.getBoundingClientRect(), cs=getComputedStyle(a);
  const shown=r.width>0&&r.height>0&&r.right>0&&r.bottom>0&&r.left<innerWidth&&r.top<innerHeight&&cs.visibility!=="hidden"&&(!a.checkVisibility||a.checkVisibility({checkVisibilityCSS:true}));
  return {focus:a.id||a.className||a.tagName, shown:shown, inCard:!!a.closest("#firstrun")};
}
async function reopenCard(page){
  await page.evaluate(()=>{ if(typeof setHelp==="function") setHelp(false); if(typeof closeSources==="function") closeSources();
    if(typeof stopPlay==="function") stopPlay(); if(typeof select==="function") select(null,null);
    ML.legendOpen=false; const fr=document.getElementById("firstrun"); fr.hidden=false; openFirstRun(); });
  await sleep(300);
}
async function keyCase(page,how,vp){
  await reopenCard(page);
  const ok=await page.evaluate(()=>{ const b=document.getElementById("fr-grades"); return !!b; });
  if(!ok) return {vp:vp.join("x"),how,error:"no Show the key"};
  if(how==="keyboard"){
    for(let i=0;i<8;i++){ const id=await page.evaluate(()=>document.activeElement&&document.activeElement.id); if(id==="fr-grades") break; await page.keyboard.press("Tab"); }
    const id=await page.evaluate(()=>document.activeElement&&document.activeElement.id);
    if(id!=="fr-grades") return {vp:vp.join("x"),how,error:"Tab did not reach Show the key (focus "+id+")"};
  }
  /* the latency in the page's own time, from the activation's first event (the press, or the key) to the first moment the key is shown and
     focused: checked right after the button's own handlers (a click listener on the window, bubbling) and every 20 ms after; so a round trip of
     the driver, which waits behind a software frame, is not counted, and a frame the page needs before it shows the key is */
  await page.evaluate(ks=>{ const keyState=new Function("return ("+ks+")")(); const K=window.__ux1k={t0:null,t:null,s:null,iv:0};
    const start=()=>{ if(K.t0===null) K.t0=performance.now(); };
    const check=()=>{ if(K.t0===null||K.t!==null) return; const s=keyState(); K.s=s; if(s.rows>0&&s.focusHolds) K.t=performance.now()-K.t0; };
    K.off=()=>{ window.removeEventListener("pointerdown",start,true); window.removeEventListener("keydown",start,true); window.removeEventListener("click",start,true);
      window.removeEventListener("click",check,false); clearInterval(K.iv); };
    window.addEventListener("pointerdown",start,true); window.addEventListener("keydown",start,true); window.addEventListener("click",start,true);
    window.addEventListener("click",check,false); K.iv=setInterval(check,20); },keyState.toString());
  if(how==="click") await page.click("#fr-grades",{timeout:60000});
  else if(how==="tap") await page.tap("#fr-grades",{timeout:60000});
  else await page.keyboard.press("Enter");
  let K=null; const w0=Date.now();
  while(Date.now()-w0<30000){ K=await page.evaluate(()=>{ const K=window.__ux1k; return {t:K.t, el:K.t0===null?null:performance.now()-K.t0}; });
    if(K.t!==null||(K.el!==null&&K.el>600)) break; await sleep(50); }
  const st=await page.evaluate(keyState); await page.evaluate(()=>{ window.__ux1k.off(); });
  const ms=K&&K.t!==null?Math.round(K.t):null;
  const shot=st;
  await page.keyboard.press("Escape"); await sleep(250);
  const esc=await page.evaluate(()=>{ const hp=document.getElementById("help"); return {help:!!hp&&!hp.hidden, card:firstRunOpen}; });
  const fz=await page.evaluate(focusShown);
  return {vp:vp.join("x"),how,ms,rows:shot.rows,where:shot.where,focus:shot.focus,focusHolds:shot.focusHolds,card:shot.card,
    afterEsc:Object.assign(esc,fz)};
}

/* the rail and the markers, in the page */
function railGeo(){
  const r=document.getElementById("timerail").getBoundingClientRect();
  const M=_evTicks.map((o,i)=>{ const b=o.el.getBoundingClientRect(); return {i, id:o.e.id, t:o.t, x:b.left+b.width/2, y:b.top+b.height/2, box:[b.left,b.top,b.right,b.bottom]}; });
  return {rail:[r.left,r.top,r.right,r.bottom], tmin:T_MIN, tmax:T_MAX, markers:M};
}
const toClock=(g,x)=>g.tmin+Math.max(0,Math.min(1,(x-g.rail[0])/((g.rail[2]-g.rail[0])||1)))*(g.tmax-g.tmin);
const xOf=(g,t)=>g.rail[0]+(t-g.tmin)/(g.tmax-g.tmin)*(g.rail[2]-g.rail[0]);
const readSel=page=>page.evaluate(()=>({clock, sel:selection?selection.kind+":"+selection.id:null, drawer:typeof drawerShown==="function"?drawerShown():null,
  pick:(()=>{ const p=document.getElementById("evpick"); return !!p&&!p.hidden; })(), playing}));
/* each case from a clear timeline: no sheet, no chooser, no selection and, below the docked width, the rail hidden (at 430 px tall it stands over the
   timeline, the final audits' Stage 6) */
const reset=(page,t)=>page.evaluate(t=>{ stopPlay(); if(typeof setHelp==="function") setHelp(false); if(typeof setPanels==="function"&&!docked) setPanels(false); if(typeof evPickClose==="function") evPickClose(false); select(null,null); setClock(t,{instant:true,force:true}); if(typeof paintTimeline==="function") paintTimeline(); },t);

/* a point inside an element where it is the topmost (its own hit area), searched on a 1 px grid over its box and 6 px around */
function ownPoint([sel,i]){
  const e=document.querySelectorAll(sel)[i]; if(!e) return null; const b=e.getBoundingClientRect(); let n=0, best=null;
  for(let y=Math.floor(b.top-6);y<=b.bottom+6;y++) for(let x=Math.floor(b.left-6);x<=b.right+6;x++){ const h=document.elementFromPoint(x,y);
    if(h&&(h===e||e.contains(h))){ n++; const d=Math.hypot(x-(b.left+b.width/2),y-(b.top+b.height/2)); if(!best||d<best.d) best={x,y,d}; } }
  return best?{x:best.x,y:best.y,own:n}:{own:0};
}
async function chooseIn(page,id,tap){
  const c=await page.evaluate(id=>{ const p=document.getElementById("evpick"); if(!p||p.hidden) return null;
    const b=p.querySelector('[data-ev="'+id+'"]'); if(!b) return {none:true, labels:[].map.call(p.querySelectorAll("button"),x=>x.getAttribute("aria-label")||x.textContent)};
    const r=b.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,label:b.getAttribute("aria-label")||b.textContent,h:r.height,w:r.width}; },id);
  if(!c||c.none) return c;
  if(tap) await page.touchscreen.tap(c.x,c.y); else await page.mouse.click(c.x,c.y);
  await sleep(250); return c;
}

async function dragCases(page,log){
  const out={steps:[],outside:null,lost:null,after:[]};
  const clickMarker=async(label)=>{ await reset(page,240); const g=await page.evaluate(railGeo); const k=g.markers.findIndex(m=>m.t===540);
    const p=await page.evaluate(ownPoint,["#evmarks .ev-mark",k]); let r={label,error:"no point"};
    if(p&&p.x!==undefined){ await page.mouse.click(p.x,p.y); await sleep(250); const s=await readSel(page);
      if(s.pick){ await chooseIn(page,g.markers[k].id,false); Object.assign(s,await readSel(page)); }
      r={label,want:g.markers[k].id,t:540,clock:s.clock,sel:s.sel}; }
    out.after.push(r); };
  for(const step of STEPS){
    await reset(page,255); await sleep(150);
    const g=await page.evaluate(railGeo), x=xOf(g,255), y=(g.rail[1]+g.rail[3])/2;
    const hit=await page.evaluate(([x,y])=>{ const h=document.elementFromPoint(x,y); const m=h&&h.closest?h.closest(".ev-mark"):null; return m?"marker":(h?(h.id||h.className):null); },[x,y]);
    await page.mouse.move(x,y); await page.mouse.down();
    const n=Math.ceil(200/step); for(let i=1;i<=n;i++) await page.mouse.move(x+Math.min(200,step*i),y);
    await page.mouse.up(); await sleep(250);
    const s=await readSel(page), want=toClock(g,x+200);
    out.steps.push({step,moves:n,pressedOn:hit,before:255,want:+want.toFixed(2),clock:+s.clock.toFixed(2),sel:s.sel,pick:s.pick});
    await clickMarker("after a drag in moves of "+step+" px");
  }
  /* released outside the rail (above the timebar, over the map), then the mouse moved on with no button: no more scrubbing */
  { await reset(page,255); const g=await page.evaluate(railGeo), x=xOf(g,255), y=(g.rail[1]+g.rail[3])/2;
    await page.mouse.move(x,y); await page.mouse.down();
    for(let i=1;i<=6;i++) await page.mouse.move(x+25*i,y-40*i);
    await page.mouse.up(); await sleep(200); const s1=await readSel(page);
    await page.mouse.move(x+300,y,{steps:4}); await sleep(200); const s2=await readSel(page);
    out.outside={want:+toClock(g,x+150).toFixed(2),clock:+s1.clock.toFixed(2),sel:s1.sel,afterHover:+s2.clock.toFixed(2)};
    await clickMarker("after a release outside the rail"); }
  /* the capture lost mid-drag (released by the page: a browser takes it away when its element goes or another takes it), then moves: no scrubbing */
  { await reset(page,255); const g=await page.evaluate(railGeo), x=xOf(g,255), y=(g.rail[1]+g.rail[3])/2;
    await page.mouse.move(x,y); await page.mouse.down(); await page.mouse.move(x+20,y); await page.mouse.move(x+40,y);
    const c1=(await readSel(page)).clock;
    await page.evaluate(()=>{ const r=document.getElementById("timerail"), e=document.querySelectorAll("#evmarks .ev-mark");
      for(let id=0;id<20;id++){ try{ if(r.hasPointerCapture(id)) r.releasePointerCapture(id); }catch(x){} [].forEach.call(e,m=>{ try{ if(m.hasPointerCapture(id)) m.releasePointerCapture(id); }catch(x){} }); } });
    await page.mouse.move(x+250,y+60); await page.mouse.move(x+300,y+80); await sleep(150);
    const c2=(await readSel(page)).clock; await page.mouse.up(); await sleep(200); const s=await readSel(page);
    out.lost={atLoss:+c1.toFixed(2),afterMoves:+c2.toFixed(2),sel:s.sel};
    await clickMarker("after a lost capture"); }
  log&&log("  marker drags: "+out.steps.map(s=>s.step+" px "+s.clock+" (want "+s.want+")"+(s.sel?" OPENED "+s.sel:"")).join("; "));
  return out;
}

/* a touch drag from a marker cancelled (CDP's touchCancel: the browser's own cancellation), then an ordinary tap on a marker */
async function cancelCase(page){
  await reset(page,255); const g=await page.evaluate(railGeo), k=g.markers.findIndex(m=>m.t===255);
  const p=await page.evaluate(ownPoint,["#evmarks .ev-mark",k]); if(!p||p.x===undefined) return {error:"no point on the 04:15 marker", over:await page.evaluate(k=>{ const m=_evTicks[k].el, r=m.getBoundingClientRect(), h=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2); return {box:[r.left,r.top,r.width,r.height].map(Math.round), hit:h?(h.id||h.className||h.tagName):null, vp:[innerWidth,innerHeight]}; },k)};
  const cdp=await page.context().newCDPSession(page);
  const T=(type,x,y)=>cdp.send("Input.dispatchTouchEvent",{type,touchPoints:(type==="touchCancel"||type==="touchEnd")?[]:[{x,y,id:1}]});
  await T("touchStart",p.x,p.y); for(let i=1;i<=6;i++) await T("touchMove",p.x+8*i,p.y); const c1=(await readSel(page)).clock;
  await T("touchCancel"); await sleep(200); const s=await readSel(page);
  /* a later touch elsewhere: no leftover drag. Held still before it lifts, so that it ends no fling: a tap that stops a fling makes no click in
     Chromium (the platform's rule, not the app's), which on a slow runner left the tap below without its click */
  await T("touchStart",p.x+80,p.y); await T("touchMove",p.x+100,p.y); await T("touchMove",p.x+120,p.y); await sleep(300); await T("touchEnd"); await sleep(600);
  const s2=await readSel(page);
  await cdp.detach();
  /* then a tap on the 09:00 marker */
  await reset(page,240); const g2=await page.evaluate(railGeo), k2=g2.markers.findIndex(m=>m.t===540), p2=await page.evaluate(ownPoint,["#evmarks .ev-mark",k2]);
  let after=null; if(p2&&p2.x!==undefined){ const hit2=await page.evaluate(([x,y])=>{ const h=document.elementFromPoint(x,y); return h?(h.id||h.className||h.tagName):null; },[p2.x,p2.y]);
    await page.evaluate(()=>{ const L=window.__ux1ev=[]; ["pointerdown","pointerup","pointercancel","click","touchstart","touchend"].forEach(t=>window.addEventListener(t,e=>L.push(t+":"+((e.target&&(e.target.id||e.target.className))||"").toString().slice(0,12)),true)); });
    await page.touchscreen.tap(p2.x,p2.y);
    for(let w=0;w<10;w++){ await sleep(150); after=await readSel(page); if(after.sel||after.pick) break; }   /* the tap's click, however late the gesture delivers it (1.5 s) */
    after.hit=hit2; after.at=[p2.x,p2.y]; after.ev=await page.evaluate(()=>window.__ux1ev.join(" "));
    if(after.pick){ await chooseIn(page,g2.markers[k2].id,true); after=await readSel(page); } }
  return {draggedTo:+c1.toFixed(2),afterCancel:{clock:+s.clock.toFixed(2),sel:s.sel},laterTouch:{sel:s2.sel},tapAfter:after?{want:g2.markers[k2].id,sel:after.sel,clock:after.clock,hit:after.hit,at:after.at,ev:after.ev}:null};
}

async function laneCases(page,log,step){
  const out={taps:[],markers:[]};
  await reset(page,240); await sleep(200);
  const g=await page.evaluate(railGeo), bot=g.rail[3];
  const pts=[]; for(let x=g.rail[0]+3;x<g.rail[2]-2;x+=(step||12)) pts.push({x,dy:8,why:"sweep"});
  const x9=xOf(g,540); [2,8,15].forEach(dy=>pts.push({x:x9,dy,why:"09:00"}));
  g.markers.forEach(m=>pts.push({x:m.x,dy:8,why:"marker "+m.id}));
  for(const q of pts){
    const want=toClock(g,q.x), from=want<600?900:300;
    await reset(page,from);
    await page.touchscreen.tap(q.x,bot-q.dy); await sleep(120);
    const s=await readSel(page);
    out.taps.push({x:+q.x.toFixed(1),y:+(bot-q.dy).toFixed(1),why:q.why,want:+want.toFixed(2),clock:+s.clock.toFixed(2),sel:s.sel,drawer:s.drawer,pick:s.pick});
  }
  /* a deliberate tap on each marker (its own hit area, else the stack's top): its event, or the chooser naming it */
  for(const m of g.markers){
    await reset(page,240);
    const p=await page.evaluate(ownPoint,["#evmarks .ev-mark",m.i]);
    const at=p&&p.x!==undefined?p:{x:m.x,y:m.y,own:0};
    await page.touchscreen.tap(at.x,at.y); await sleep(250);
    let s=await readSel(page), via="direct";
    if(s.pick){ via="chooser"; const c=await chooseIn(page,m.id,true); s=await readSel(page); if(!c||c.none) via="chooser without it"; }
    out.markers.push({id:m.id,t:m.t,own:at.own,inLane:at.y>bot-16,via,sel:s.sel,clock:+s.clock.toFixed(2)});
  }
  const bad=out.taps.filter(t=>t.sel||t.pick||t.drawer||Math.abs(t.clock-t.want)>LANE_TOL).length;
  log&&log("  rail taps in the lower 16 px: "+out.taps.length+", wrong "+bad+"; marker taps: "+out.markers.filter(m=>m.sel==="e:"+m.id).length+" of "+out.markers.length+" opened their event");
  return out;
}

async function coincidentCases(page,tap,log){
  const out=[];
  await reset(page,240);
  const g=await page.evaluate(railGeo);
  const groups={}; g.markers.forEach(m=>{ (groups[m.t]=groups[m.t]||[]).push(m); });
  const G=Object.keys(groups).filter(t=>groups[t].length>1).map(t=>groups[t]);
  for(const grp of G) for(const m of grp){
    const rec={id:m.id,t:m.t,dx:+(m.x-xOf(g,m.t)).toFixed(2),group:grp.length};
    /* pointer */
    await reset(page,240);
    const p=await page.evaluate(ownPoint,["#evmarks .ev-mark",m.i]); rec.own=p?p.own:0;
    const at=p&&p.x!==undefined?p:{x:m.x,y:m.y};
    if(tap) await page.touchscreen.tap(at.x,at.y); else await page.mouse.click(at.x,at.y);
    await sleep(250); let s=await readSel(page); rec.pointerVia="direct";
    if(s.pick){ const c=await chooseIn(page,m.id,tap); rec.pointerVia=c&&!c.none?"chooser":"chooser without it"; rec.choice=c&&c.label; rec.choiceSize=c&&c.h?[Math.round(c.w),Math.round(c.h)]:null; s=await readSel(page); }
    rec.pointer={sel:s.sel,clock:+s.clock.toFixed(2)};
    /* keyboard: the events' group reached by Tab from the rail, then the arrow keys to this marker, Enter */
    await reset(page,240);
    await page.evaluate(()=>{ const B=document.querySelectorAll("#evmarks .ev-mark"); B.forEach((b,k)=>{ b.tabIndex=k===0?0:-1; }); document.getElementById("timerail").focus(); });
    await page.keyboard.press("Tab");
    let reached=false;
    for(let i=0;i<40;i++){ const k=await page.evaluate(()=>{ const B=[].slice.call(document.querySelectorAll("#evmarks .ev-mark")); return B.indexOf(document.activeElement); });
      if(k===m.i){ reached=true; break; } if(k<0) break; await page.keyboard.press("ArrowRight"); }
    if(reached){ const lab=await page.evaluate(()=>document.activeElement.getAttribute("aria-label")); await page.keyboard.press("Enter"); await sleep(250); s=await readSel(page);
      rec.keyboard={label:lab,sel:s.sel,clock:+s.clock.toFixed(2)}; }
    else rec.keyboard={error:"not reached by Tab and the arrow keys"};
    out.push(rec);
  }
  log&&log("  coincident markers ("+(tap?"touch":"mouse")+"): "+out.map(r=>r.id+" "+(r.pointer.sel==="e:"+r.id?"pointer "+r.pointerVia:"POINTER "+r.pointer.sel)+", "+(r.keyboard.sel==="e:"+r.id?"keys":"KEYS "+JSON.stringify(r.keyboard))).join("; "));
  return out;
}

/* UA-13: the phase row's drawn text boxes and the caption's act, in the page (no input: a layout) */
function phaseRow(){
  const R=[], clocks=[]; PHASES.forEach(p=>clocks.push(p.t0+1)); _evTicks.forEach(o=>clocks.push(o.t));
  function textBox(st){ const l=st.querySelector(".step-l")||st, cs=getComputedStyle(l); if(cs.display==="none"||cs.visibility==="hidden") return null;
    const rg=document.createRange(); rg.selectNodeContents(l); const t=rg.getBoundingClientRect(), c=l.getBoundingClientRect();
    const right=cs.overflow==="visible"||cs.overflowX==="visible"?t.right:Math.min(t.right,c.right);   /* a clipped label draws its visible part */
    return {left:Math.max(t.left,c.left),right,top:t.top,bottom:t.bottom}; }
  const out={overlaps:[],actCut:[],samples:0,width:innerWidth};
  clocks.forEach(t=>{ setClock(t,{instant:true,force:true,camera:false}); if(typeof finishTween==="function") finishTween(); out.samples++;
    const S=[].slice.call(document.querySelectorAll("#phases .step")), B=S.map(textBox);
    for(let i=0;i<S.length;i++) for(let j=i+1;j<S.length;j++){ const a=B[i], b=B[j]; if(!a||!b) continue;
      const ov=Math.min(a.right,b.right)-Math.max(a.left,b.left); if(ov>0.5&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top)) out.overlaps.push({t,a:PHASES[i].label,b:PHASES[j].label,px:+ov.toFixed(1)}); }
    const act=document.querySelector(".tb-cap .act");
    if(act){ const cs=getComputedStyle(act); if(cs.display!=="none"&&!act.classList.contains("fit-off")&&act.scrollWidth>act.clientWidth+1) out.actCut.push({t,text:act.textContent,w:act.clientWidth,need:act.scrollWidth}); } });
  return out;
}

/* UA-12: the scrolling panels' scrollbars, by computed style, in both themes, and the key's text clear of its scrollbar */
function scrollStyles(){
  const one=sel=>{ const e=document.querySelector(sel); if(!e) return {sel,missing:true}; const cs=getComputedStyle(e);
    return {sel,scheme:cs.colorScheme,color:cs.scrollbarColor,padEnd:parseFloat(cs.paddingInlineEnd||cs.paddingRight)||0}; };
  return ["#lg-rows","#modal .sheet","#help .sheet","#layerpop","#firstrun"].map(one);
}

/* the WebGL draw skipped while the timeline's input runs (as the harness's motion driver does, tools/visual/motion.js): the rail, the markers and the
   chooser read nothing the draw makes, and under software WebGL a frame takes about a second, which would pace every move of a drag. The app's own
   frame loop, its handlers and its layout run as ever; the key's cases keep the draw (until step 1 the key panel was laid out by a frame) */
const noDraw=page=>page.evaluate(()=>{ if(!window.__uxDraw){ window.__uxDraw=renderer.render; renderer.render=function(){}; } });
const draw=page=>page.evaluate(()=>{ if(window.__uxDraw){ renderer.render=window.__uxDraw; window.__uxDraw=null; } });
async function runBlock(open,settle,opts){
  opts=opts||{}; const log=opts.log||(()=>{}), out={key:[],drag:null,cancel:null,lane:null,laneHeld:null,coincident:{},phases:[],scroll:{}};
  const SO=!!opts.selftestOnly, views=SO?KEY_VIEWS_SO:KEY_VIEWS, on=k=>!opts.only||opts.only.split(",").includes(k);   /* only: a probe's subset (never the harness's) */
  const sweep=SO?24:12, settle0=settle;
  if(SO) settle=async pg=>{ await pg.evaluate(()=>AUSTERLITZ_DEBUG.settle(3)); await sleep(300); };   /* nothing drawn: the layout's own passes */
  /* a mouse and its keyboard */
  const pm=await open([1600,900],null);
  try{
    await settle0(pm); if(SO) await noDraw(pm);
    if(on("key")) for(const vp of views){ await pm.setViewportSize({width:vp[0],height:vp[1]}); await sleep(500); await settle(pm);
      for(const how of ["click","keyboard"]){ const r=await keyCase(pm,how,vp); out.key.push(r);
        log("  key "+r.vp+" "+how+": "+(r.error||((r.ms!==null?"shown and focused in "+r.ms+" ms ("+r.where+")":"NOT shown and focused: rows "+r.rows+", focus "+r.focus)+"; after Esc focus "+r.afterEsc.focus+(r.afterEsc.shown?"":" NOT SHOWN")))); } }
    await pm.setViewportSize({width:1600,height:900}); await sleep(500); await settle(pm);
    await pm.evaluate(()=>{ if(firstRunOpen) closeFirst(null); setPresentation("study"); }); await noDraw(pm);
    if(on("drag")) out.drag=await dragCases(pm,log);
    if(on("coincident")) out.coincident.mouse=await coincidentCases(pm,false,log);
    if(on("phases")) for(const w of [[1024,768],[1280,720],[1440,900]]){ await pm.setViewportSize({width:w[0],height:w[1]}); await sleep(500); await settle(pm);
      const r=await pm.evaluate(phaseRow); out.phases.push(r); log("  phase row at "+w[0]+" px: "+r.overlaps.length+" overlapping label pairs, "+r.actCut.length+" act names cut, over "+r.samples+" clocks"); }
    await pm.evaluate(()=>{ setMode("terrain"); }); out.scroll.dark=await pm.evaluate(scrollStyles);
    await pm.evaluate(()=>{ setMode("staff"); }); out.scroll.paper=await pm.evaluate(scrollStyles);
    await pm.evaluate(()=>{ setMode("terrain"); });
    await pm.emulateMedia({forcedColors:"active"}); out.scroll.forced=await pm.evaluate(scrollStyles); await pm.emulateMedia({forcedColors:"none"});
    if(!SO) await draw(pm);
  } finally { const cx=pm.context(); await pm.close(); await cx.close().catch(()=>{}); }
  /* touch at desktop sizes (a coarse pointer: the desktop timeline with its markers clear of the scrub lane) */
  const pt=await open(SO?[1080,800]:[1600,900],"touch");
  try{
    await settle0(pt); if(SO) await noDraw(pt);
    if(on("key")) for(const vp of views.filter(v=>v[0]>=720)){ await pt.setViewportSize({width:vp[0],height:vp[1]}); await sleep(500); await settle(pt);
      const r=await keyCase(pt,"tap",vp); out.key.push(r);
      log("  key "+r.vp+" tap: "+(r.error||((r.ms!==null?"shown and focused in "+r.ms+" ms ("+r.where+")":"NOT shown and focused: rows "+r.rows+", focus "+r.focus)+"; after Esc focus "+r.afterEsc.focus+(r.afterEsc.shown?"":" NOT SHOWN")))); }
    await pt.setViewportSize({width:844,height:390}); await sleep(500); await settle(pt);
    await pt.evaluate(()=>{ if(firstRunOpen) closeFirst(null); }); await noDraw(pt);
    if(on("lane")) out.laneHeld=await laneCases(pt,log,sweep);
    if(on("drag")){ out.cancel=await cancelCase(pt); log("  a touch drag cancelled: "+JSON.stringify(out.cancel)); }
  } finally { const cx=pt.context(); await pt.close(); await cx.close().catch(()=>{}); }
  /* the phone: an iPhone's size, density and user agent, touch */
  const pp=await open([390,844],"ios");
  try{
    await settle0(pp); if(SO) await noDraw(pp);
    if(on("key")) for(const how of (SO?["tap"]:["tap","keyboard"])){ const r=await keyCase(pp,how,[390,844]); r.device="ios"; out.key.push(r);
      log("  key 390x844 (phone) "+how+": "+(r.error||((r.ms!==null?"shown and focused in "+r.ms+" ms ("+r.where+")":"NOT shown and focused: rows "+r.rows+", focus "+r.focus)+"; after Esc focus "+r.afterEsc.focus+(r.afterEsc.shown?"":" NOT SHOWN")))); }
    await pp.evaluate(()=>{ if(firstRunOpen) closeFirst(null); }); await noDraw(pp);
    if(on("lane")) out.lane=await laneCases(pp,log,sweep);
    if(on("coincident")) out.coincident.touch=await coincidentCases(pp,true,log);
  } finally { const cx=pp.context(); await pp.close(); await cx.close().catch(()=>{}); }
  return out;
}
module.exports={runBlock,keyState,STEPS,LANE_TOL,KEY_VIEWS,KEY_VIEWS_SO};
