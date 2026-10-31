#!/usr/bin/env node
/* Stage 8, the integration pass (question 267; docs/STAGE8_SPEC.md section 22): the motion block's runs by real input against their twins.
   On a page of its own (opened as tools/stage8/motion-8h.js opens it: ?harness=1, software WebGL, the measures injected, CSS transitions off),
   for each motion real input can drive (tools/visual/motion.js REAL): what the pointer hovers as it arrives at the motion's start; the 16's run
   (driven, no pointer); its twin with the pointer (driven, the real pointer's buttonless arrival and departure, motion.js RUN's a.point); the run
   by real input, repeated on the same page (--repeat, default 3); each run's counts and formations' visibility, the buttonless pointer moves the
   canvas receives in each real run (the browser's own, after the arrival), and, item by item, where the twin with the pointer differs from the
   16's run (jumps and pops by item). Run it with Playwright 1.56's Chromium 141 headless shell, the browser CI runs (PLAYWRIGHT_BROWSERS_PATH, or
   AUSTERLITZ_CHROME naming it).
   node tools/stage8/twin-8l.js <build.html> [--repeat 3] [--only paper-zoom,...] [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const L=require("./lib.js"), TR=require(path.join(L.ROOT,"tools","visual","three-route.js")), MO=require(path.join(L.ROOT,"tools","visual","motion.js"));
const MEASURE=fs.readFileSync(path.join(L.ROOT,"tools","visual","measure.js"),"utf8");
const OUT=opt("--json"), REP=+(opt("--repeat")||3), ONLY=opt("--only")?opt("--only").split(","):null;
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(L.ROOT,"austerlitz-command-map.html"));
/* each item's jumps and pops by frame (motion.js measure's definitions) */
function perItem(F){ const ev={}, inView=s=>s&&s.st!=="offscreen"&&s.st!=="panel";
  for(let f=1;f<F.length;f++){ const A=F[f].items, P=F[f-1].items;
    new Set(Object.keys(A).concat(Object.keys(P))).forEach(k=>{ const a=P[k], b=A[k]; if(!a||!b||!inView(a)||!inView(b)) return;
      const aOn=a.st==="on", bOn=b.st==="on";
      if(aOn&&bOn){ if(Math.hypot((b.x-b.sx)-(a.x-a.sx),(b.y-b.sy)-(a.y-a.sy))>3) (ev[k]=ev[k]||{j:[],p:[]}).j.push(f); }
      else if(aOn!==bOn) (ev[k]=ev[k]||{j:[],p:[]}).p.push(f+(bOn?"+":"-")); }); }
  return ev; }
const sum=(M,r)=>({jumps:M.jumps, pops:M.pops, lod:M.lod, flicker:M.flicker, overlapFrames:M.overlapFrames, keepHidden:M.keepHidden,
  drawn:M.track.all.on, inView:M.track.all.on+M.track.all.terrain+M.track.all.placement, longestMs:M.track.all.longestMs, hover:r.hover===undefined?null:r.hover});
(async()=>{
  const browser=await L.launch(), errs=[], t0=Date.now();
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
  page.on("pageerror",e=>errs.push(e.message)); page.on("console",m=>{ if(m.type()==="warning"||m.type()==="error") errs.push(m.type()+": "+m.text().slice(0,200)); });
  await TR.routeThree(page); await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page);
  await page.evaluate(MEASURE); await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  const settle=async p=>{ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await p.waitForTimeout(450); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
  await settle(page); await page.evaluate(()=>closeFirst(null));
  const R={build:path.basename(html), md5:crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex"), chromium:browser.version(), repeat:REP, motions:{}};
  for(const id of MO.REAL){ if(ONLY&&!ONLY.includes(id)) continue;
    const m=MO.MOTIONS.find(x=>x[0]===id), [,view,kind,n,amt]=m, V=MO.VIEWS[view];
    const prep=async()=>{ await page.evaluate(()=>{ select(null,null); stopPlay(); }); await page.evaluate(s=>window.__aus.apply(s),V);
      await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90,true)); await page.evaluate(MO.inPage); };
    const A={kind,n,amt,gl:false,room:false,select:null,rest:30,pre:8,reading:null,touch:false};
    const run=a=>page.evaluate(new Function("a","return ("+MO.RUN.toString()+")(a);"),a);
    const X={view:V.name};
    await prep(); let r=await run(A); const F16=r.F; X.sixteen=sum(MO.measure(r.F,{restFrom:r.restFrom}),r);
    await prep(); r=await run(Object.assign({},A,{point:true})); const FP=r.F; X.point=sum(MO.measure(r.F,{restFrom:r.restFrom}),r);
    X.real=[];
    for(let i=0;i<REP;i++){ await prep();
      await page.evaluate(()=>{ window.__mv=[]; if(!window.__mvOn){ window.__mvOn=1; renderer.domElement.addEventListener("pointermove",function(e){ if(!e.buttons&&window.__mv) window.__mv.push([e.isTrusted,e.clientX,e.clientY]); },true); } });
      r=await MO.runReal(page,A); const s=sum(MO.measure(r.F,{restFrom:r.restFrom}),r); s.buttonlessMoves=await page.evaluate(()=>window.__mv.length); X.real.push(s); }
    /* the twin with the pointer against the 16's run, item by item */
    const e16=perItem(F16), eP=perItem(FP), d={};
    new Set(Object.keys(e16).concat(Object.keys(eP))).forEach(k=>{ const a=e16[k]||{j:[],p:[]}, b=eP[k]||{j:[],p:[]};
      if(a.j.length!==b.j.length||a.p.length!==b.p.length) d[k]={sixteen:{jumps:a.j.length,pops:a.p.length}, point:{jumps:b.j.length,pops:b.p.length}}; });
    /* frame for frame, what is drawn: each item's state, and a drawn item's box against its anchor (a dropped item's box is its last, which no
       measure reads) */
    const drawnOf=F=>JSON.stringify(F.map(f=>Object.keys(f.items).sort().map(k=>{ const q=f.items[k]; return k+":"+q.st+(q.st==="on"?"@"+q.x+","+q.y+","+q.w+","+q.h+","+q.sx+","+q.sy:""); })));
    X.pointVsSixteen=d; X.identical=drawnOf(F16)===drawnOf(FP);
    R.motions[id]=X;
    console.log(id.padEnd(13)+" the 16's run "+JSON.stringify(X.sixteen)+"\n              its twin with the pointer "+JSON.stringify(X.point)+(X.identical?" (every frame identical to the 16's)":"")+
      X.real.map((q,i)=>"\n              by real input ("+(i+1)+") "+JSON.stringify(q)).join("")+
      (Object.keys(d).length?"\n              items differing (the twin with the pointer against the 16's): "+Object.keys(d).length:""));
  }
  R.console=errs; R.secs=Math.round((Date.now()-t0)/1000);
  await browser.close();
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(R,null,1)); }
  console.log("console "+errs.length+" ("+R.secs+" s)");
})().catch(e=>{ console.error(e); process.exit(1); });
