#!/usr/bin/env node
/* Roadmap step 3 (decision 133 (a); docs/FINAL_AUDIT.md SW-1): what a visitor meets when the page cannot start, and when the browser takes
   the graphics context away. node tools/visual/boot-check.js <build.html>   (also run at the end of check:contrast, contrast.js)
   Each case on its own browser and page, without the harness's view (a visitor's page):
   - "no-three": the cdnjs request aborted (offline, blocked);
   - "sri": the request answered with a copy one byte longer, so its integrity hash does not match;
   - "no-webgl": Chromium launched with --disable-3d-apis --disable-gpu (three.js loads; no WebGL context);
   - "slow": three.js answered after 21 s: the status line says so at 20 s, and the page then starts as usual (no failure, nothing inert);
   - "context-loss": a normal start, then the context lost (WEBGL_lose_context) and restored.
   A failure case passes only if, within 15 s of the page's load: the alert dialog #boot-fail is shown with the reason for its kind and no
   other, focus is on Reload and stays there through Tab and Shift+Tab, every other child of the body is inert, the first-run card is
   hidden, a key behind the dialog does nothing, its text meets WCAG AA (4.5:1) against its own background, and the page's messages are
   exactly the ones listed for the case (EXPECT), each a named reason; anything else fails. */
"use strict";
const path=require("path");
const { chromium } = require("playwright");
const TR=require("./three-route.js");
const BASE_ARGS=["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"];
const GUARD=k=>new RegExp("^Austerlitz: start-up failed \\("+k+"\\): ");
/* the messages each case must produce, and nothing else: [type, RegExp, why, min, max] (min and max 1 unless given). CTX_DELETES: the most
   "does not belong to this context" warnings the context-loss case may give, from its runs on the step-3 build (each run prints its count;
   recorded in CHANGELOG.md) */
const CTX_DELETES=40;   /* measured 24 on the step-3 build (CHANGELOG.md) */
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
    "three r128 after a restored context: a geometry made before the loss and disposed after it keeps the old context's dispose listener, which deletes buffers and a vertex array of the lost context; the browser ignores them (avoiding it would mean rebuilding the renderer or leaking the geometry). Bound: CTX_DELETES",0,"CTX"]]
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
  const browser=await chromium.launch({args:launchArgs}), bad=[];
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
  if(want("slow")){ const browser=await chromium.launch({args:BASE_ARGS}), bad=[];
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
  if(want("context-loss")){ const browser=await chromium.launch({args:BASE_ARGS}), bad=[];
    try{ const {p,log}=await page(browser,"context-loss",pg=>TR.routeThree(pg));
      await p.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:60000});
      await TR.waitBoot(p,240000);
      const a=await p.evaluate(async()=>{ const ext=renderer.getContext().getExtension("WEBGL_lose_context"); if(!ext) return {noExt:true};
        ext.loseContext(); await new Promise(z=>setTimeout(z,400));
        const n=document.getElementById("glnotice"), r={lost:GL.lost,role:n.getAttribute("role"),text:n.textContent,button:!!n.querySelector("button"),vis:n.getBoundingClientRect().height>0};
        /* the notice's text and button against their own backgrounds, at AA */
        function rgb(c){ const m=/rgba?\(([^)]+)\)/.exec(c); const v=m[1].split(",").map(Number); return {r:v[0],g:v[1],b:v[2],a:v.length>3?v[3]:1}; }
        function lum(c){ return [c.r,c.g,c.b].map(v=>{ v/=255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); }).reduce((s,v,i)=>s+v*[0.2126,0.7152,0.0722][i],0); }
        function bgOf(e){ for(let x=e;x;x=x.parentElement){ const c=rgb(getComputedStyle(x).backgroundColor); if(c.a>0.99) return c; } return {r:0,g:0,b:0}; }
        r.low=[n.querySelector("span"),n.querySelector("button")].filter(e=>{ const L1=lum(rgb(getComputedStyle(e).color)), L2=lum(bgOf(e)); return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05)<4.5; }).map(e=>e.tagName);
        const f0=DEV.frames; ext.restoreContext(); await new Promise(z=>setTimeout(z,2300));
        r.after={lost:GL.lost,text:n.textContent,frames:DEV.frames-f0,fx:FX.on}; return r; });
      if(a.noExt) bad.push("no WEBGL_lose_context");
      else { if(!a.lost||a.role!=="alert"||!a.vis||!a.button||a.text.indexOf("The 3D view has stopped")!==0||a.low.length) bad.push("lost: "+JSON.stringify(a));
        if(a.after.lost||a.after.text||!(a.after.frames>0)) bad.push("restored: "+JSON.stringify(a.after)); }
      bad.push.apply(bad,judgeLog("context-loss",log));
      const nd=countOf(log,EXPECT["context-loss"][0][1]);
      R.push({name:"context-loss",ok:!bad.length,line:"context-loss: "+(bad.length?bad.join("; "):"the notice (an alert with Reload, at AA) while lost, cleared and frames drawn again by the app when restored")+"; "+nd+" “does not belong to this context” warnings (at most "+CTX_DELETES+")"});
    } finally { await browser.close(); } }
  return R;
}
module.exports={runBootCases,EXPECT};
if(require.main===module){
  const html=process.argv[2]||"austerlitz-command-map.html";
  runBootCases(html,process.argv[3]?process.argv[3].split(","):null).then(R=>{ R.forEach(r=>console.log((r.ok?"  ok ":"  FAIL ")+r.line)); const nb=R.filter(r=>!r.ok).length;
    console.log("boot cases: "+(R.length-nb)+" of "+R.length+" pass"); process.exit(nb?1:0); }).catch(e=>{ console.error(e); process.exit(1); });
}
