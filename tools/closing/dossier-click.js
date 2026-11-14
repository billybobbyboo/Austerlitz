#!/usr/bin/env node
/* The closing re-verification pass: a side effect of WP-05's CL-SIM-01 fix, measured (nothing is changed). While the clock plays, the open
   dossier is rebuilt at most every DRAWER_PLAY_MS (250 ms) as the minute changes (app.js setClock's drawer branch, paintDrawer), and a rebuild
   replaces its buttons; a click whose press and release fall on either side of a rebuild lands on two different elements and the browser makes
   no click. Found by the audit's s1 scenario re-run here (its day-track anchor clicked during Play: Play went on). Measured: a formation's full
   dossier open, the real mouse pressing a day-track anchor for HOLD ms and releasing, N times paused and N times while the clock plays at 1/2x
   (the app's own loop, real time); each press counted as taken when Play stopped with the clock at the anchor (as 5G's anchor does).
   A page at 1600 x 900, the build by default.   node tools/closing/dossier-click.js [build.html] [--json out.json] [--n 12] [--hold 100] */
"use strict";
const fs=require("fs"), path=require("path");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), TR=require(path.join(ROOT,"tools","visual","three-route.js"));
const { chromium } = require("playwright");
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html")), OUT=opt("--json");
const N=+(opt("--n")||12), HOLD=+(opt("--hold")||100);
(async()=>{
  const b=await chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  const p=await (await b.newContext({viewport:{width:1600,height:900}})).newPage(), errs=[], out={N,HOLD,cases:{}};
  p.on("pageerror",e=>errs.push(e.message));
  await TR.routeThree(p); await p.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:120000}); await TR.waitBoot(p,240000);
  await p.evaluate(()=>{ if(typeof closeFirst==="function") closeFirst(null); stopPlay(); setSpeed(0.5); setClock(420,{instant:true,force:true}); select("f","rg_inf"); });
  await p.waitForTimeout(500);
  /* the full dossier: the card's "full dossier" button, as a visitor's click */
  const opened=await p.evaluate(()=>{ const B=[...document.querySelectorAll("#drawer-body button")]; const x=B.find(e=>/full dossier/i.test(e.textContent)); if(x){ x.click(); return true; } return false; });
  await p.waitForTimeout(800);
  out.fullDossier=opened; out.anchors=await p.evaluate(()=>document.querySelectorAll("#drawer-body .dt-a").length);
  for(const mode of ["paused","playing"]){
    const res=[];
    for(let i=0;i<N;i++){
      const at=await p.evaluate(m=>{ stopPlay(); setClock(420+(m==="playing"?0:0),{instant:true,force:true}); paintDrawer();
        const a=document.querySelectorAll("#drawer-body .dt-a")[1]; if(!a) return null; a.scrollIntoView({block:"center"}); const r=a.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,t:+a.dataset.t}; },mode);
      if(!at){ res.push({taken:false,why:"no anchor"}); continue; }
      if(mode==="playing"){ await p.evaluate(()=>{ setClock(300,{instant:true,force:true}); togglePlay(); }); await p.waitForTimeout(400+Math.floor(Math.random()*250)); }
      const re=await p.evaluate(()=>{ const a=document.querySelectorAll("#drawer-body .dt-a")[1]; if(!a) return null; const r=a.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; });
      const pt=re||at; await p.mouse.move(pt.x,pt.y); await p.mouse.down(); await p.waitForTimeout(HOLD); await p.mouse.up(); await p.waitForTimeout(250);
      const s=await p.evaluate(()=>({clock,playing}));
      res.push({taken:!s.playing&&Math.abs(s.clock-at.t)<1e-6,clock:s.clock,playing:s.playing,anchorT:at.t});
      await p.evaluate(()=>stopPlay());
    }
    out.cases[mode]={taken:res.filter(r=>r.taken).length,of:res.length,res};
    console.log(mode+": "+out.cases[mode].taken+" of "+res.length+" presses on a day-track anchor taken (press "+HOLD+" ms)");
  }
  out.frames=await p.evaluate(()=>typeof DEV!=="undefined"?{frames:DEV.frames}:null);
  await b.close(); out.md5=require("crypto").createHash("md5").update(fs.readFileSync(html)).digest("hex"); out.errors=errs;
  console.log("full dossier "+out.fullDossier+", anchors "+out.anchors+"; build md5 "+out.md5+"; page errors "+errs.length);
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
})().catch(e=>{ console.error(e); process.exit(2); });
