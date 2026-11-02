/* Final audit after Stage 8 (docs/FINAL_AUDIT_POST_STAGE8.md): shared helpers for the audit's browser diagnostics.
   Measurement code only; nothing here is written to a source file and nothing changes the application.
   The page is opened through the existing probe libraries (tools/stage7/lib.js, tools/stage8/lib.js), so its numbers are the harness's.
   Browser: AUSTERLITZ_CHROME if set, else the pinned Chromium 141.0.7390.37 headless shell this audit installed in its scratchpad
   (CI's browser: Playwright 1.56's pin), with ANGLE on SwiftShader (software WebGL: no timing here is a device's).

   open(browser,[w,h],o)  o: {harness:false} a visitor's page (no ?harness=1: the drift and the smoke move; the first-run card shows),
                              {rm:true} prefers-reduced-motion, {transitions:true} keep CSS transitions (a visitor's page does)
   openPhone(browser,[w,h],o) a phone context (density 3, touch, isMobile, an iPhone's user agent), then the same as open
   state(page)            window.__aus.state(): clock, presentation, mode, factor, selection, readings, eye, tour, opening, card, playing, camera...
   frames(page,n)         let the app's own requestAnimationFrame loop run n frames (real time)
   errors(page)           console warnings/errors and page errors seen so far
*/
"use strict";
const fs=require("fs"), path=require("path");
const SCRATCH="/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad";
if(!process.env.AUSTERLITZ_CHROME){ const p=path.join(SCRATCH,"pw141","x","chrome-linux","headless_shell"); if(fs.existsSync(p)) process.env.AUSTERLITZ_CHROME=p; }
const L8=require("../stage8/lib.js");
const TR=require("../visual/three-route.js");
const ROOT=L8.ROOT, EVID=path.join(ROOT,"docs","audit-post8-evidence");
const MEASURE=fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8");
const IOS_UA="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
function track(page){
  page._log=[];
  page.on("console",m=>{ const t=m.type(); if(t==="warning"||t==="error"||t==="assert") page._log.push({type:t,text:m.text().slice(0,400)}); });
  page.on("pageerror",e=>page._log.push({type:"pageerror",text:String(e.message).slice(0,400)}));
  page.on("crash",()=>page._log.push({type:"crash",text:"page crashed"}));
  return page;
}
async function open(browser,vp,o){ o=o||{}; const page=await L8.open(browser,vp,o); return track(page); }
/* a phone page: the harness's phone device (tools/visual/harness.js PHONE_DEVICES.ios) */
async function openPhone(browser,vp,o){
  o=o||{};
  const ctx=await browser.newContext({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:IOS_UA,reducedMotion:o.rm?"reduce":"no-preference"});
  const page=track(await ctx.newPage());
  await TR.routeThree(page);
  await page.goto("file://"+path.resolve(process.env.AUSTERLITZ_HTML||path.join(ROOT,"austerlitz-command-map.html"))+(o.harness===false?"":"?harness=1"),{waitUntil:"commit",timeout:180000});
  await TR.waitBoot(page,240000,250);
  await page.evaluate(MEASURE);
  if(!o.transitions) await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  return page;
}
const state=page=>page.evaluate(()=>window.__aus.state());
const frames=(page,n)=>page.evaluate(k=>new Promise(r=>{ let i=0; (function f(){ if(++i>=k) r(i); else requestAnimationFrame(f); })(); }),n||2);
const errors=page=>page._log||[];
function out(area,name){ const d=path.join(EVID,area); fs.mkdirSync(d,{recursive:true}); return path.join(d,name); }
function save(area,name,obj){ const f=out(area,name); fs.writeFileSync(f,typeof obj==="string"?obj:JSON.stringify(obj,null,1)); return f; }
module.exports=Object.assign({},L8,{SCRATCH,EVID,open,openPhone,state,frames,errors,out,save,IOS_UA});
