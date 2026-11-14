#!/usr/bin/env node
/* The closing re-verification pass: CL-UX-03 (WP-06) on the desktop, by the real mouse (measurement only; nothing is changed).
   The audit's s1b-recheck (and s1's rail drag) press the playhead where an event marker covers it at an event's start and drag 200 px right in
   6 (or 8) moves of 25-33 px; on this build the clock does not move. WP-06 hands a press on a marker to the rail once it has moved more than
   RAIL_SLOP (6 px), but the marker's host sees a mouse's moves only while the pointer is over it (a mouse has no implicit capture). So: the
   same press at 04:15 (an event start, the clock paused there; the marker covers the playhead), the same 200 px, in moves of 2, 8, 16 and 33 px.
   A page at 1600 x 900, the build by default.   node tools/closing/marker-drag.js [build.html] [--json out.json] */
"use strict";
const fs=require("fs"), path=require("path");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), TR=require(path.join(ROOT,"tools","visual","three-route.js"));
const { chromium } = require("playwright");
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html")), OUT=opt("--json");
(async()=>{
  const b=await chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  const p=await (await b.newContext({viewport:{width:1600,height:900}})).newPage(), errs=[], out={cases:[]};
  p.on("pageerror",e=>errs.push(e.message));
  await TR.routeThree(p); await p.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:120000}); await TR.waitBoot(p,240000);
  await p.evaluate(()=>{ if(typeof closeFirst==="function") closeFirst(null); });
  for(const step of [2,8,16,33]){
    const at=await p.evaluate(()=>{ stopPlay(); setClock(255,{instant:true,force:true}); paintTimeline&&paintTimeline();
      const rail=document.getElementById("timerail"), r=rail.getBoundingClientRect(), x=r.left+(255-T_MIN)/(T_MAX-T_MIN)*r.width, y=r.top+r.height/2;
      const h=document.elementFromPoint(x,y), mk=h&&h.closest?h.closest(".ev-mark"):null, mb=mk?mk.getBoundingClientRect():null;
      return {x,y,hit:h?(h.id||h.className):null,marker:!!mk,markerBox:mb?[Math.round(mb.left),Math.round(mb.right)]:null,clock}; });
    await p.mouse.move(at.x,at.y); await p.mouse.down();
    const n=Math.ceil(200/step); for(let i=1;i<=n;i++) await p.mouse.move(at.x+Math.min(200,step*i),at.y);
    await p.mouse.up(); await p.waitForTimeout(300);
    const after=await p.evaluate(()=>({clock,playing,sel:typeof selection!=="undefined"?selection:null}));
    const c={step,moves:n,pressedOn:at.hit,markerUnderPress:at.marker,markerBox:at.markerBox,before:at.clock,after:after.clock,scrubbed:after.clock>at.clock+20,eventOpened:!!after.sel};
    out.cases.push(c); console.log("moves of "+step+" px ("+n+"): pressed on "+(at.marker?"the marker "+JSON.stringify(at.markerBox):at.hit)+"; the clock "+at.clock+" -> "+after.clock.toFixed(1)+(c.scrubbed?" (scrubbed)":" (not scrubbed)")+(c.eventOpened?"; a selection: "+JSON.stringify(after.sel):""));
    await p.evaluate(()=>{ if(typeof select==="function") try{ select(null,null); }catch(e){} });
  }
  await b.close(); out.md5=require("crypto").createHash("md5").update(fs.readFileSync(html)).digest("hex"); out.errors=errs;
  console.log("build md5 "+out.md5+"; page errors "+errs.length);
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
})().catch(e=>{ console.error(e); process.exit(2); });
