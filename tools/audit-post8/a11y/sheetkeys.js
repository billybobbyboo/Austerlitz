#!/usr/bin/env node
/* Final audit after Stage 8, area a11y: keyboard scrolling of the two sheets, without the frame-timing doubt. mapfocus.js found PageDown,
   ArrowDown, Space and End doing nothing with focus on the sources sheet's text region, but some keys worked with focus elsewhere; on this
   starved machine a smooth-scroll animation may wait seconds for a frame. Here the browser runs with --disable-smooth-scrolling, so a key's
   scroll is applied at once by the key's default action; the control page (ctl-scroll.html, no app script) is run first in the same browser.
   Harness page, 1600 x 900; the sheet opened by a real click on "Accuracy and sources", focus moved by real Tab; each key a real press; the
   scroller's scrollTop read after each (polled up to 4 s).
   node tools/audit-post8/a11y/sheetkeys.js */
"use strict";
const path=require("path");
const { chromium } = require("playwright");
const L=require("./alib.js");
const TR=require("../../visual/three-route.js");
L.run("sheetkeys",async(b0,R,log)=>{
  await b0.close().catch(()=>{});   /* the shared launcher's browser is not used: this one needs the flag */
  const b=await chromium.launch({executablePath:process.env.AUSTERLITZ_CHROME||undefined,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist","--disable-smooth-scrolling"]});
  try{
    const keys=async(page,sel)=>{ const out=[]; for(const k of ["PageDown","ArrowDown","Space","End","Home"]){ const before=await page.evaluate(s=>document.querySelector(s).scrollTop,sel);
        await page.keyboard.press(k); let after=before; for(let i=0;i<16&&after===before;i++){ await new Promise(r=>setTimeout(r,250)); after=await page.evaluate(s=>document.querySelector(s).scrollTop,sel); }
        out.push({key:k,before,after,focus:await page.evaluate(()=>{ const e=document.activeElement; return e.tagName.toLowerCase()+(e.id?"#"+e.id:"")+(e.className&&typeof e.className==="string"?"."+e.className.split(" ")[0]:""); })}); } return out; };
    /* the control */
    const c=await b.newPage({viewport:{width:1280,height:720}});
    await c.goto("file://"+path.join(__dirname,"ctl-scroll.html"));
    await c.keyboard.press("Tab");
    R.step("control page (no app script), --disable-smooth-scrolling: Tab to the region, then keys",{res:await keys(c,".sheet")});
    await c.close();
    /* the app */
    const ctx=await b.newContext({viewport:{width:1600,height:900}});
    const p=await ctx.newPage();
    await TR.routeThree(p);
    await p.goto("file://"+path.resolve(path.join(L.ROOT,"austerlitz-command-map.html"))+"?harness=1",{waitUntil:"commit",timeout:180000});
    await TR.waitBoot(p,240000,250);
    await new Promise(r=>setTimeout(r,1500));
    await p.keyboard.press("Escape"); await new Promise(r=>setTimeout(r,1500));
    const sb=await p.evaluate(()=>{ const e=document.getElementById("srcbtn"); const r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; });
    await p.mouse.click(sb.x,sb.y); await new Promise(r=>setTimeout(r,2000));
    await p.keyboard.press("Tab"); await new Promise(r=>setTimeout(r,500));
    const geo=await p.evaluate(()=>{ const s=document.querySelector("#modal .sheet"); return {sh:s.scrollHeight,ch:s.clientHeight,oy:getComputedStyle(s).overflowY,focus:document.activeElement.id}; });
    R.step("app: the sources sheet by a real click, Tab (real) to its text region, then keys (real)",{geo,res:await keys(p,"#modal .sheet")});
    /* a click on the sheet's text (real), as a reader would, then keys */
    await p.evaluate(()=>{ document.querySelector("#modal .sheet").scrollTop=0; });
    await p.mouse.click(800,450); await new Promise(r=>setTimeout(r,800));
    R.step("app: a real click on the sheet's text, then keys (real)",{focus:await p.evaluate(()=>{ const e=document.activeElement; return e.tagName+"#"+e.id+"."+e.className; }),res:await keys(p,"#modal .sheet")});
    await p.keyboard.press("Escape"); await new Promise(r=>setTimeout(r,800));
    /* the ? overlay: "?" (real), Tab Tab to its list region (real), keys */
    await p.evaluate(()=>{ const e=document.activeElement; if(e&&e.blur) e.blur(); });
    await p.keyboard.press("?"); await new Promise(r=>setTimeout(r,1200));
    await p.keyboard.press("Tab"); await p.keyboard.press("Tab"); await new Promise(r=>setTimeout(r,500));
    R.step("app: the ? overlay, Tab Tab to its list region (real), then keys (real)",{focus:await p.evaluate(()=>document.activeElement.id),res:await keys(p,"#help .sheet")});
    await ctx.close();
  } finally { await b.close().catch(()=>{}); }
});
