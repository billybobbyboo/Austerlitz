#!/usr/bin/env node
/* The final audits' Stage 7, WP-14 (CL-ROB-12): what an idle page costs the main thread. One visitor's page (no ?harness: the real loop's
   timing), 1366 x 768, the first card closed by a real Escape, the page left until DEV.state reads "idle" for 2 s; then SECS seconds untouched:
   the animation-frame callbacks counted (requestAnimationFrame wrapped from then on), frames drawn (DEV.frames), timers fired, and CDP
   Performance's TaskDuration and ScriptDuration over the window, as a share of one core.
   node tools/final-stage7/idle.js [build.html] [--secs 60] [--json out.json]   Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), TR=require(path.join(ROOT,"tools","visual","three-route.js"));
const { chromium } = require("playwright");
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html")), SECS=+(opt("--secs")||60), OUT=opt("--json");
(async()=>{
  const b=await chromium.launch({executablePath:process.env.AUSTERLITZ_CHROME||undefined,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  const p=await b.newPage({viewport:{width:1366,height:768},deviceScaleFactor:1}), errs=[];
  p.on("pageerror",e=>errs.push(e.message));
  await TR.routeThree(p); await p.goto("file://"+html,{waitUntil:"commit",timeout:120000}); await TR.waitBoot(p,240000);
  await p.waitForTimeout(1000); await p.keyboard.press("Escape");
  const idle=await p.evaluate(async()=>{ const t0=performance.now(); let s=0;
    while(performance.now()-t0<180000){ await new Promise(z=>setTimeout(z,100)); if(DEV.state==="idle"){ if(!s) s=performance.now(); else if(performance.now()-s>=2000) return true; } else s=0; } return false; });
  const cdp=await p.context().newCDPSession(p); await cdp.send("Performance.enable");
  const met=async()=>{ const o={}; (await cdp.send("Performance.getMetrics")).metrics.forEach(m=>o[m.name]=m.value); return o; };
  await p.evaluate(()=>{ const W=window, raf=W.requestAnimationFrame, st=W.setTimeout, si=W.setInterval; W.__idle={raf:0,cb:0,to:0,iv:0,f0:DEV.frames,s0:DEV.skipped};
    W.requestAnimationFrame=function(f){ W.__idle.raf++; return raf.call(W,function(t){ W.__idle.cb++; return f(t); }); };
    W.setTimeout=function(f,d){ W.__idle.to++; return st.apply(W,arguments); }; W.setInterval=function(f,d){ W.__idle.iv++; return si.apply(W,arguments); }; });
  const m0=await met(), t0=Date.now();
  await new Promise(z=>setTimeout(z,SECS*1000));
  const m1=await met(), wall=(Date.now()-t0)/1000;
  const c=await p.evaluate(()=>Object.assign({},window.__idle,{frames:DEV.frames-window.__idle.f0,skipped:DEV.skipped-window.__idle.s0,state:DEV.state}));
  await b.close();
  const r={build:path.basename(html), secs:+wall.toFixed(1), idleReached:idle, rafCallbacks:c.cb, perSecond:+(c.cb/wall).toFixed(1), framesDrawn:c.frames, skipped:c.skipped,
    timeouts:c.to, intervals:c.iv, taskS:+(m1.TaskDuration-m0.TaskDuration).toFixed(3), scriptS:+(m1.ScriptDuration-m0.ScriptDuration).toFixed(3),
    taskShare:+((m1.TaskDuration-m0.TaskDuration)/wall).toFixed(4), state:c.state, errors:errs, browser:b.version?undefined:undefined};
  console.log(JSON.stringify(r));
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(r,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
