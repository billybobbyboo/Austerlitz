#!/usr/bin/env node
/* Roadmap step 3 (decision 133 (a); docs/FINAL_AUDIT.md SW-1): what a visitor meets when the page cannot start, and when the browser takes
   the graphics context away. node tools/visual/boot-check.js <build.html>   (also run at the end of check:contrast, contrast.js)
   Each case on its own browser and page, without the harness's view (a visitor's page):
   - "no-three": the cdnjs request aborted (offline, blocked);
   - "sri": the request answered with a copy one byte longer, so its integrity hash does not match;
   - "no-webgl": Chromium launched with --disable-3d-apis --disable-gpu (three.js loads; no WebGL context);
   - "slow": three.js answered after 21 s: the status line says so at 20 s, and the page then starts as usual (no failure, nothing inert);
   - "context-loss": a normal start, then the context lost (WEBGL_lose_context) and restored with the page idle (no warning yet), then a step
     of the clock (decision 212 (b)) that disposes geometries made before the loss: at least one warning, at most CTX_DELETES.
   A failure case passes only if, within 15 s of the page's load: the alert dialog #boot-fail is shown with the reason for its kind and no
   other, focus is on Reload and stays there through Tab and Shift+Tab, every other child of the body is inert, the first-run card is
   hidden, a key behind the dialog does nothing, its text meets WCAG AA (4.5:1) against its own background, and the page's messages are
   exactly the ones listed for the case (EXPECT), each a named reason; anything else fails. */
"use strict";
const path=require("path");
const { chromium } = require("playwright");
const TR=require("./three-route.js");
const BASE_ARGS=["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"];
/* AUSTERLITZ_CHROME, if set, names the Chromium to run, as the harness and contrast.js take it (Stage 8, implementation PR 8C: a container whose
   Playwright finds no browser of its own pinned build ran these cases only on CI) */
const launch=o=>chromium.launch(Object.assign({executablePath:process.env.AUSTERLITZ_CHROME||undefined},o));
const GUARD=k=>new RegExp("^Austerlitz: start-up failed \\("+k+"\\): ");
/* the messages each case must produce, and nothing else: [type, RegExp, why, min, max] (min and max 1 unless given). CTX_DELETES: the most
   "does not belong to this context" warnings the context-loss case may give, as measured on the runs below (each run prints its count;
   recorded in CHANGELOG.md) */
const CTX_DELETES=248;   /* owner decision 212 (b), 20 October 2026: the count measured with the clock step after the restore, 248 on each of
   three runs of the step-5 build (deterministic); 40 until then (measured 24 on the step-3 build, CHANGELOG.md) */
const EXPECT={
  "no-three":[["requestfailed",/three\.min\.js /,"the request is aborted by the case"],
    ["error",/^Failed to load resource: net::ERR_FAILED$/,"Chromium's note of the aborted request"],
    ["error",GUARD("three"),"the guard's one console line"],
    ["pageerror",/^THREE is not defined/,"the bundle's first use of THREE; the guard has already reported the failure"]],
  "sri":[["error",/^Failed to find a valid digest in the 'integrity' attribute for resource 'https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js'/,"Chromium refuses the script whose hash does not match"],
    ["error",GUARD("three"),"the guard's one console line"],
    ["pageerror",/^THREE is not defined/,"the bundle's first use of THREE; the guard has already reported the failure"]],
  "no-webgl":[["error",/^THREE\.WebGLRenderer: Error creating WebGL context\./,"three.js's own message"],
    ["error",GUARD("webgl"),"the guard's one console line"],
    ["pageerror",/^Error creating WebGL context\./,"init's error, rethrown by boot() after the guard reported it"]],
  "error":[["error",GUARD("error"),"the guard's one console line"],
    ["pageerror",/^injected start-up fault$/,"the case's fault, rethrown by boot() after the guard reported it"]],
  "slow":[],
  "context-loss":[["warning",/^WebGL: INVALID_OPERATION: delete(VertexArray)?: object does not belong to this context$/,
    "three r128 after a restored context: a geometry made before the loss and disposed after it keeps the old context's dispose listener, which deletes buffers and a vertex array of the lost context; the browser ignores them (avoiding it would mean rebuilding the renderer or leaking the geometry). Bound: CTX_DELETES",0,"CTX"]],
  /* Stage 8, implementation PR 8C (the audit of 8B, finding A): the same warning, should the case's view dispose anything after the restore
     (none was seen: the view is held still) */
  "context-depth":[["warning",/^WebGL: INVALID_OPERATION: delete(VertexArray)?: object does not belong to this context$/,
    "as in context-loss (three r128's dispose listener of the lost context); bound CTX_DELETES",0,"CTX"]]
};
async function page(browser,label,route){
  const p=await browser.newPage({viewport:{width:1366,height:768},deviceScaleFactor:1});
  const log=[]; const rec=(t,x)=>log.push({type:t,text:String(x).slice(0,300)});
  p.on("console",m=>{ const t=m.type(); if(t==="warning"||t==="error"||t==="assert") rec(t,m.text()); });
  p.on("pageerror",e=>rec("pageerror",e.message)); p.on("crash",()=>rec("crash","the page crashed"));
  p.on("requestfailed",q=>rec("requestfailed",q.url().slice(0,160)+" "+((q.failure()||{}).errorText||"")));
  await route(p);
  return {p,log};
}
function judgeLog(name,log){
  const want=EXPECT[name], bad=[], used=want.map(()=>0);
  log.forEach(e=>{ const i=want.findIndex(w=>w[0]===e.type&&w[1].test(e.text)); if(i<0) bad.push("unexpected "+e.type+": "+e.text); else used[i]++; });
  want.forEach((w,i)=>{ const lo=w[3]===undefined?1:w[3], hi=w[4]===undefined?1:(w[4]==="CTX"?CTX_DELETES:w[4]);
    if(used[i]<lo||used[i]>hi) bad.push("expected "+(lo===hi?lo:lo+"-"+hi)+" "+w[0]+" "+w[1]+" ("+w[2]+"), got "+used[i]); });
  return bad;
}
function countOf(log,re){ return log.filter(e=>re.test(e.text)).length; }
/* in the page: the dialog's state, focus, inertness and the contrast of its text */
function failState(kind){
  function rgb(c){ const m=/rgba?\(([^)]+)\)/.exec(c); if(!m) return null; const v=m[1].split(",").map(Number); return {r:v[0],g:v[1],b:v[2],a:v.length>3?v[3]:1}; }
  function lum(c){ return [c.r,c.g,c.b].map(v=>{ v/=255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); }).reduce((s,v,i)=>s+v*[0.2126,0.7152,0.0722][i],0); }
  function bgOf(e){ for(let x=e;x;x=x.parentElement){ const c=rgb(getComputedStyle(x).backgroundColor); if(c&&c.a>0.99) return c; } return {r:0,g:0,b:0,a:1}; }
  const f=document.getElementById("boot-fail"), out={shown:!!f&&!f.hidden&&f.getBoundingClientRect().height>0};
  out.reasons=[].filter.call(document.querySelectorAll("#boot-why [data-boot]"),e=>!e.hidden).map(e=>e.getAttribute("data-boot"));
  out.focus=document.activeElement&&document.activeElement.id; out.focusVisible=!!document.activeElement&&document.activeElement.matches(":focus-visible");
  out.notInert=[].filter.call(document.body.children,e=>e.id!=="boot"&&e.tagName!=="SCRIPT"&&!e.inert&&getComputedStyle(e).display!=="none").map(e=>e.id||e.className||e.tagName);
  out.firstRunHidden=!!document.getElementById("firstrun").hidden;
  out.lowContrast=[].filter.call(f.querySelectorAll("h2,p:not([hidden]),button"),e=>{ const t=rgb(getComputedStyle(e).color), b=bgOf(e);
    const L1=lum(t), L2=lum(b); return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05)<4.5; }).map(e=>e.tagName+" "+e.textContent.slice(0,30));
  out.failed=window.AUS_BOOT&&window.AUS_BOOT.failed&&window.AUS_BOOT.failed.kind;
  out.title=document.title;
  return out;
}
async function failCase(name,kind,launchArgs,route,html,init){
  const browser=await launch({args:launchArgs}), bad=[];
  try{
    const {p,log}=await page(browser,name,route);
    if(init) await p.addInitScript(init);
    await p.goto("file://"+html,{waitUntil:"commit",timeout:60000});
    await p.waitForFunction(()=>window.AUS_BOOT&&window.AUS_BOOT.failed,null,{timeout:15000,polling:200}).catch(()=>bad.push("no failure reported within 15 s"));
    await p.waitForTimeout(300);
    let s=await p.evaluate(failState,kind);
    if(!s.shown) bad.push("the dialog is not shown");
    if(s.failed!==kind) bad.push("the kind is "+s.failed+", not "+kind);
    if(s.reasons.join()!==kind) bad.push("the reasons shown are ["+s.reasons.join()+"]");
    if(s.focus!=="boot-reload") bad.push("focus on "+s.focus+", not Reload");
    if(!s.focusVisible) bad.push("Reload has focus without its visible ring");
    if(s.notInert.length) bad.push("not inert: "+s.notInert.join(", "));
    if(!s.firstRunHidden) bad.push("the first-run card is not hidden");
    if(s.lowContrast.length) bad.push("below AA: "+s.lowContrast.join("; "));
    if(!/^The map cannot start · /.test(s.title)) bad.push("the title is "+JSON.stringify(s.title));
    await p.keyboard.press("Tab"); const t1=await p.evaluate(()=>document.activeElement&&document.activeElement.id);
    await p.keyboard.press("Shift+Tab"); const t2=await p.evaluate(()=>document.activeElement&&document.activeElement.id);
    if(t1!=="boot-reload"||t2!=="boot-reload") bad.push("Tab and Shift+Tab went to "+t1+", "+t2);
    /* a press on the backdrop takes the focus to the page: Shift+Tab from there still lands on Reload */
    await p.mouse.click(4,4); await p.keyboard.press("Shift+Tab"); const t3=await p.evaluate(()=>document.activeElement&&document.activeElement.id);
    if(t3!=="boot-reload") bad.push("after a press on the backdrop, Shift+Tab went to "+t3);
    const appState=()=>p.evaluate(()=>[typeof presentation!=="undefined"?presentation:"-",typeof mode!=="undefined"?mode:"-",document.getElementById("help").hidden,typeof clock!=="undefined"?clock:"-"].join("|"));
    const app0=await appState();
    for(const k of ["2","m","?","ArrowRight","Escape"]) await p.keyboard.press(k);
    s=await p.evaluate(failState,kind); if(!s.shown||s.focus!=="boot-reload") bad.push("a key behind the dialog changed it");
    const app1=await appState(); if(app1!==app0) bad.push("keys behind the dialog reached the app: "+app0+" -> "+app1);
    bad.push.apply(bad,judgeLog(name,log));
    return {name,ok:!bad.length,line:name+": "+(bad.length?bad.join("; "):"the dialog with its reason, focus on Reload (Tab kept), the rest inert, AA, the messages expected")};
  } finally { await browser.close(); }
}
async function runBootCases(html,only){
  html=path.resolve(html);
  const R=[], local=TR.THREE_LOCAL, fs=require("fs"), want=n=>!only||only.indexOf(n)>=0;
  if(!local) return [{name:"boot cases",ok:false,line:"boot cases: no local three.js (node_modules/three) to serve; not run"}];
  if(want("no-three")) R.push(await failCase("no-three","three",BASE_ARGS,p=>p.route(TR.THREE_RE,r=>r.abort()),html));
  if(want("sri")) R.push(await failCase("sri","three",BASE_ARGS,p=>p.route(TR.THREE_RE,r=>r.fulfill({body:Buffer.concat([fs.readFileSync(local),Buffer.from("\n")]),contentType:"application/javascript",headers:{"access-control-allow-origin":"*"}})),html));
  /* an error while starting once the interface is built (the first-run card open, the app's key handlers bound): loop()'s first request
     for a frame throws */
  if(want("error")) R.push(await failCase("error","error",BASE_ARGS,p=>TR.routeThree(p),html,
    "(function(){ var raf=window.requestAnimationFrame, done=false; window.requestAnimationFrame=function(f){ if(!done&&f&&f.name==='loop'){ done=true; throw new Error('injected start-up fault'); } return raf.call(window,f); }; })();"));
  if(want("no-webgl")) R.push(await failCase("no-webgl","webgl",["--disable-3d-apis","--disable-gpu"],p=>TR.routeThree(p),html));
  /* the slow start: three.js held 21 s; the status line at 20 s, then a normal start with focus on the first card's primary action */
  if(want("slow")){ const browser=await launch({args:BASE_ARGS}), bad=[];
    try{ const {p,log}=await page(browser,"slow",pg=>pg.route(TR.THREE_RE,async r=>{ await new Promise(z=>setTimeout(z,21000)); await r.fulfill({path:local,contentType:"application/javascript",headers:{"access-control-allow-origin":"*"}}); }));
      await p.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:60000});
      await p.waitForFunction(()=>{ const s=document.getElementById("boot-status"); return !!s&&!!s.textContent; },null,{timeout:23000,polling:100}).catch(()=>{});
      const st=await p.evaluate(()=>{ const s=document.getElementById("boot-status"); return {text:s?s.textContent:null,role:s&&s.getAttribute("role"),
        inert:[].filter.call(document.body.children,e=>e.inert).map(e=>e.id||e.tagName),failed:!!(window.AUS_BOOT&&window.AUS_BOOT.failed)}; });
      if(st.text!=="Still loading the 3D view…"||st.role!=="status") bad.push("by 23 s the status line is "+JSON.stringify(st.text));
      if(st.inert.length||st.failed) bad.push("with the status line: inert "+st.inert.join(",")+", failed "+st.failed);
      await TR.waitBoot(p,120000);
      /* inert after a normal start: only the closed dossier (syncInert's one reason at this docked width, 1366 px in Study: the rail is
         shown, never rail-hidden, so never inert; the C7-C14 review) */
      const af=await p.evaluate(()=>({done:window.AUS_BOOT.done,docked:docked,railHidden:document.body.classList.contains("rail-hidden"),
        inert:[].filter.call(document.body.children,e=>e.inert&&!(e.id==="drawer"&&!drawerShown())).map(e=>e.id||e.className||e.tagName),
        focus:document.activeElement&&document.activeElement.id}));
      if(!af.done||!af.docked||af.railHidden||af.inert.length||af.focus!=="fr-tour") bad.push("after the start: done "+af.done+", docked "+af.docked+", rail hidden "+af.railHidden+", inert ["+af.inert.join()+"], focus on "+af.focus);
      bad.push.apply(bad,judgeLog("slow",log));
      R.push({name:"slow",ok:!bad.length,line:"slow: "+(bad.length?bad.join("; "):"the status line at 20 s, then a normal start (docked, the rail shown, nothing inert but the closed dossier, focus on the first card's primary action)")});
    } finally { await browser.close(); } }
  /* the context taken away and given back on a normal page */
  if(want("context-loss")){ const browser=await launch({args:BASE_ARGS}), bad=[];
    try{ const {p,log}=await page(browser,"context-loss",pg=>TR.routeThree(pg));
      await p.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:60000});
      await TR.waitBoot(p,240000);
      /* roadmap step 5: the page idle (DEV.state "idle", the render loop drawing nothing, for 0.5 s; within 120 s) before the loss and
         after the restore, so that the same geometries stand drawn before the loss and are replaced after the restore on every run. Until
         step 5 the loss came as soon as the page had started, while its start-up frames were still settling (under software WebGL about
         40 s of them, each rebuilding the confidence patches, confPlace), and the count was read 2.3 s after the restore: three r128's
         warnings then varied with how far the settling had gone (20-44 seen, 52 with the loss at once; it failed CI once on PR #55, 44 over
         CTX_DELETES). Idle before the loss, nothing drawn before it is disposed after the restore: 0 warnings on three runs of the step-5
         build. Owner decision 212 (b): then, the page restored and idle with no such warning yet (held at 0), a step of the clock (a
         visitor's) disposes the pre-loss geometries on purpose, the path three r128 warns on: 248 warnings on each of three runs, CTX_DELETES
         the bound (docs/step5-evidence/questions.md) */
      const a=await p.evaluate(async()=>{ const ext=renderer.getContext().getExtension("WEBGL_lose_context"); if(!ext) return {noExt:true};
        const settle=async()=>{ const t0=performance.now(); let s=0;
          while(performance.now()-t0<120000){ await new Promise(z=>setTimeout(z,100)); if(DEV.state==="idle"){ if(!s) s=performance.now(); else if(performance.now()-s>=500) return true; } else s=0; }
          return false; };
        const settled0=await settle();
        ext.loseContext(); await new Promise(z=>setTimeout(z,400));
        const n=document.getElementById("glnotice"), r={lost:GL.lost,role:n.getAttribute("role"),text:n.textContent,button:!!n.querySelector("button"),vis:n.getBoundingClientRect().height>0};
        /* the notice's text and button against their own backgrounds, at AA */
        function rgb(c){ const m=/rgba?\(([^)]+)\)/.exec(c); const v=m[1].split(",").map(Number); return {r:v[0],g:v[1],b:v[2],a:v.length>3?v[3]:1}; }
        function lum(c){ return [c.r,c.g,c.b].map(v=>{ v/=255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); }).reduce((s,v,i)=>s+v*[0.2126,0.7152,0.0722][i],0); }
        function bgOf(e){ for(let x=e;x;x=x.parentElement){ const c=rgb(getComputedStyle(x).backgroundColor); if(c.a>0.99) return c; } return {r:0,g:0,b:0}; }
        r.low=[n.querySelector("span"),n.querySelector("button")].filter(e=>{ const L1=lum(rgb(getComputedStyle(e).color)), L2=lum(bgOf(e)); return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05)<4.5; }).map(e=>e.tagName);
        const f0=DEV.frames; ext.restoreContext(); await new Promise(z=>setTimeout(z,300)); const settled1=await settle();
        r.after={lost:GL.lost,text:n.textContent,frames:DEV.frames-f0,fx:FX.on}; r.settled=[settled0,settled1]; return r; });
      /* decision 212 (b): no warning yet, idle; then the clock to phase 3's start and the page idle again, frames drawn after it */
      const nIdle=countOf(log,EXPECT["context-loss"][0][1]); let st=null;
      if(!a.noExt){ st=await p.evaluate(async()=>{ const settle=async()=>{ const t0=performance.now(); let s=0;
          while(performance.now()-t0<120000){ await new Promise(z=>setTimeout(z,100)); if(DEV.state==="idle"){ if(!s) s=performance.now(); else if(performance.now()-s>=500) return true; } else s=0; }
          return false; };
        /* Stage 8, implementation PR 8C: the step's first frame is waited for before the page is read as idle (DEV.state is set by a frame, so
           until one is drawn it still says the "idle" of before the step). A step that changes the environment map recompiles the programs
           that read it, and under software WebGL that first frame comes 2-4 s after the step, as it does before any loss; on 8B's build, whose
           restored environment map was empty (the audit of 8B, finding A), it came within a second, and a settle begun 0.3 s after the step
           found the page drawing before its 0.5 s of idle ran out. The judgement below is unchanged */
        const f0=DEV.frames; setClock(PHASES[3].t0,{force:true}); await new Promise(z=>setTimeout(z,300));
        const t1=performance.now(); while(DEV.frames===f0&&performance.now()-t1<120000) await new Promise(z=>setTimeout(z,100));
        const ok=await settle();
        return {settled:ok,frames:DEV.frames-f0,clock:clock,lost:GL.lost,firstMs:Math.round(performance.now()-t1)}; }); }
      if(a.noExt) bad.push("no WEBGL_lose_context");
      else { if(!a.lost||a.role!=="alert"||!a.vis||!a.button||a.text.indexOf("The 3D view has stopped")!==0||a.low.length) bad.push("lost: "+JSON.stringify(a));
        if(a.after.lost||a.after.text||!(a.after.frames>0)) bad.push("restored: "+JSON.stringify(a.after));
        if(!a.settled[0]||!a.settled[1]) bad.push("the page was not idle within 120 s "+(a.settled[0]?"after the restore":"before the loss"));
        if(nIdle!==0) bad.push(nIdle+" \u201cdoes not belong to this context\u201d warnings before the clock step (the page idle: want 0)");
        if(!st||!st.settled||st.lost||!(st.frames>0)) bad.push("the clock step after the restore: "+JSON.stringify(st)); }
      bad.push.apply(bad,judgeLog("context-loss",log));
      const nd=countOf(log,EXPECT["context-loss"][0][1]);
      /* the review of decision 212 (b): the clock step must run the path it was added for (at least one warning after it), not only stay
         under the bound */
      if(st&&!(nd-nIdle>0)) bad.push("no \u201cdoes not belong to this context\u201d warning after the clock step (the dispose-after-restore path not run)");
      R.push({name:"context-loss",ok:!bad.length,line:"context-loss: "+(bad.length?bad.join("; "):"the notice (an alert with Reload, at AA) while lost, cleared and frames drawn again by the app when restored, idle with no warning, then a clock step drawn")+"; "+nd+" “does not belong to this context” warnings (at most "+CTX_DELETES+")"});
    } finally { await browser.close(); } }
  /* Stage 8, implementation PR 8C (the audit of 8B, finding A): the frame after a restore, the eye and the window unchanged, is the frame before
     the loss. Until 8C the ground's depth for the overlays (GDEPTH) was drawn again only when its key changed, so with the eye still the overlays
     were tested against the restored context's empty target until the camera moved; and the environment map (refreshEnvironment) was made again
     only when the sky's colours moved, so the scene was lit without it. The view: 10.33x at 11:30, low south of Telnitz, where the drawn ground
     hides part of the overlays (the frame against the same frame with the ground's test off: at least OCCL_MIN pixels, so the case holds the
     occlusion, not only the overlays' presence). Held: the eye's matrix and the drawing buffer unchanged; the app's own frames after the restore
     drew the ground's depth again (GDEPTH.n); a grid of its depth texels equal to theirs before the loss; and the app's frame (renderFrame, read
     back at once) within FRAME_TOL pixels of the frame before the loss, the figures hidden in both reads: after a restore three r128 compiles its
     programs again in a new order, so coplanar parts of the figures can trade places in the opaque sort (speckle on the men, about 1,600 pixels
     here; reported, not judged). Measured on the 8B build: the depth pass not drawn again, its texels zero, 238,879 pixels changed; with the
     ground's depth key cleared but not the environment's, 237,923; with both, 20 */
  if(want("context-depth")){ const browser=await launch({args:BASE_ARGS}), bad=[], OCCL_MIN=1000, FRAME_TOL=100;
    try{ const {p,log}=await page(browser,"context-depth",pg=>TR.routeThree(pg));
      await p.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:60000});
      await TR.waitBoot(p,240000);
      const a=await p.evaluate(async([OCCL_MIN])=>{ const ext=renderer.getContext().getExtension("WEBGL_lose_context"); if(!ext) return {noExt:true};
        const idle=async()=>{ const t0=performance.now(); let s=0;
          while(performance.now()-t0<120000){ await new Promise(z=>setTimeout(z,100)); if(DEV.state==="idle"){ if(!s) s=performance.now(); else if(performance.now()-s>=500) return true; } else s=0; }
          return false; };
        closeFirst("explore");
        const w=W(180,400), ty=displayHeight(w[0],w[1]), d=new THREE.Vector3(0.2,0.12,1.0).normalize().multiplyScalar(90);
        AUSTERLITZ_DEBUG.applyCase({t:690,presentation:"watch",mode:"terrain",factor:10.33,cam:[w[0]+d.x,ty+d.y,w[1]+d.z,w[0],ty,w[1]]}); AUSTERLITZ_DEBUG.settle(4);
        requestRender(3); const idle0=await idle();
        const gl=renderer.getContext(), VW=gl.drawingBufferWidth, VH=gl.drawingBufferHeight;
        const grab=figures=>{ const hid=[]; if(!figures) for(const id in units){ const b=units[id].block; if(b&&b.visible){ b.visible=false; hid.push(b); } }
          renderFrame(); hid.forEach(b=>{ b.visible=true; }); const px=new Uint8Array(VW*VH*4); gl.readPixels(0,0,VW,VH,gl.RGBA,gl.UNSIGNED_BYTE,px); return px; };
        const diff=(x,y)=>{ let n=0; for(let i=0;i<x.length;i+=4) if(Math.abs(x[i]-y[i])>3||Math.abs(x[i+1]-y[i+1])>3||Math.abs(x[i+2]-y[i+2])>3) n++; return n; };
        const texels=()=>{ const o=[], b=new Uint8Array(4), rt=GDEPTH.rt; if(!rt) return o;
          for(let j=1;j<8;j++) for(let i=1;i<8;i++){ renderer.readRenderTargetPixels(rt,Math.floor(rt.width*i/8),Math.floor(rt.height*j/8),1,1,b); o.push(b.join(",")); } return o; };
        const cam0=landCam.matrixWorld.elements.join(","), size0=VW+"x"+VH, A=grab(false), Af=grab(true), T0=texels();
        const gp=window.gdepthPass; window.gdepthPass=function(){ GDEPTH.u.uGroundOn.value=0; return false; }; const C=grab(false); window.gdepthPass=gp; grab(false);
        const occl=diff(A,C), n0=GDEPTH.n;
        ext.loseContext(); await new Promise(z=>setTimeout(z,400)); ext.restoreContext(); await new Promise(z=>setTimeout(z,300));
        const idle1=await idle(), n1=GDEPTH.n, cam1=landCam.matrixWorld.elements.join(","), size1=gl.drawingBufferWidth+"x"+gl.drawingBufferHeight;
        const T1=texels(), B=grab(false), Bf=grab(true);
        return {idle:[idle0,idle1], lost:GL.lost, camSame:cam0===cam1, sizeSame:size0===size1, occl:occl, occlMin:OCCL_MIN, passes:[n0,n1],
          texels:T0.length, texelsSame:T0.length>0&&T0.join("|")===T1.join("|"), texelZero:T1.filter(s=>s==="0,0,0,0").length,
          frame:diff(A,B), frameFigures:diff(Af,Bf)}; },[OCCL_MIN]);
      if(a.noExt) bad.push("no WEBGL_lose_context");
      else {
        if(!a.idle[0]||!a.idle[1]) bad.push("the page was not idle within 120 s "+(a.idle[0]?"after the restore":"before the loss"));
        if(a.lost) bad.push("the context still lost");
        if(!a.camSame||!a.sizeSame) bad.push("the eye or the drawing buffer moved across the loss (the case needs both still)");
        if(!(a.occl>=OCCL_MIN)) bad.push("the view's ground hides "+a.occl+" pixels of the overlays (want at least "+OCCL_MIN+": choose a view that holds the occlusion)");
        if(!(a.passes[1]>a.passes[0])) bad.push("the ground's depth was not drawn again after the restore (passes "+a.passes.join(" -> ")+"): the overlays tested against an empty target");
        if(!a.texelsSame) bad.push("the ground's depth after the restore is not the depth before the loss ("+a.texelZero+" of "+a.texels+" texels zero)");
        if(!(a.frame<=FRAME_TOL)) bad.push("the frame after the restore differs from the frame before the loss in "+a.frame+" pixels (at most "+FRAME_TOL+", the figures hidden)"); }
      bad.push.apply(bad,judgeLog("context-depth",log));
      R.push({name:"context-depth",ok:!bad.length,line:"context-depth: "+(bad.length?bad.join("; "):"the eye still across a loss and a restore: the ground's depth drawn again ("+a.passes.join(" -> ")+" passes), its "+a.texels+" texels as before, the frame within "+a.frame+" pixels of the frame before the loss (the figures hidden; with them "+a.frameFigures+"), the view's ground hiding "+a.occl+" pixels of the overlays")});
    } finally { await browser.close(); } }
  return R;
}
module.exports={runBootCases,EXPECT};
if(require.main===module){
  const html=process.argv[2]||"austerlitz-command-map.html";
  runBootCases(html,process.argv[3]?process.argv[3].split(","):null).then(R=>{ R.forEach(r=>console.log((r.ok?"  ok ":"  FAIL ")+r.line)); const nb=R.filter(r=>!r.ok).length;
    console.log("boot cases: "+(R.length-nb)+" of "+R.length+" pass"); process.exit(nb?1:0); }).catch(e=>{ console.error(e); process.exit(1); });
}
