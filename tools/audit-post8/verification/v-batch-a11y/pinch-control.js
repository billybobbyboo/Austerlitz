#!/usr/bin/env node
/* v-batch-a11y: a control for a11y #4. The same CDP two-finger pinch as tools/audit-post8/a11y/phone2.js step 4 (two points (160,360) and
   (230,430), ten touchMove steps spreading them 50 px, touchEnd), on a MINIMAL page that is not the app: a full-viewport canvas with
   touch-action:none (as style.css:8) under the app's viewport meta (shell.html:5). If the page still zooms, the emulation ignores
   touch-action for a CDP pinch and phone2.js's result says nothing about the app. Phone context as lib.js openPhone (390x844, density 3,
   isMobile, hasTouch, the iPhone UA). A third case keeps the main thread busy 600 ms a frame (as SwiftShader's heavy frames). Output: JSON on stdout. */
"use strict";
const A=require("../../lib.js");
const {chromium}=require("playwright");
const HTML=(ta,busy)=>`<!doctype html><script>var BUSY=${busy?'true':'false'};</script><meta charset=utf-8><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>html,body{margin:0;height:100%;overflow:hidden}canvas{display:block;width:100vw;height:100vh;touch-action:${ta}}</style>
<canvas id=c></canvas><script>window.EV={down:0,move:0,cancel:0,up:0,types:{}};const c=document.getElementById('c');
['pointerdown','pointermove','pointercancel','pointerup'].forEach(t=>c.addEventListener(t,e=>{EV[t.replace('pointer','')]++;EV.types[e.pointerType]=1;}));
if(location.hash==='#busy'||BUSY){ (function f(){ const t=performance.now(); while(performance.now()-t<600){} requestAnimationFrame(f); })(); }</script>`;
(async()=>{
  const b=await chromium.launch({executablePath:process.env.AUSTERLITZ_CHROME,headless:true});
  const out={env:"Chromium "+b.version()+" (AUSTERLITZ_CHROME), phone context as openPhone", cases:[]};
  for(const [ta,busy] of [["none",false],["auto",false],["none",true]]){
    const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:A.IOS_UA});
    const p=await ctx.newPage(); await p.setContent(HTML(ta,busy)); await p.waitForTimeout(300);
    const s=await ctx.newCDPSession(p);
    const pts=(d)=>[{x:160-d,y:360-d*0.5,id:0,radiusX:4,radiusY:4,force:1},{x:230+d,y:430+d*0.5,id:1,radiusX:4,radiusY:4,force:1}];  /* as phone2.js:18-20 */
    const vv0=await p.evaluate(()=>visualViewport.scale);
    await s.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:pts(0)});
    for(let i=1;i<=10;i++){ await s.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:pts(5*i)}); await p.waitForTimeout(60); }
    await s.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
    await p.waitForTimeout(500);
    out.cases.push({canvasTouchAction:ta, mainThreadBusy600msPerFrame:busy, vv:[vv0, await p.evaluate(()=>visualViewport.scale)], pointerEvents:await p.evaluate(()=>EV)});
    await ctx.close();
  }
  await b.close(); console.log(JSON.stringify(out));
})().catch(e=>{ console.error(e); process.exit(1); });
