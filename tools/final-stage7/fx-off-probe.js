#!/usr/bin/env node
/* The final audits' Stage 7, WP-12 (CL-PERF-10): the 329 ms frame in the phone's first effects-off block (Stage 8's ?route=fx on the iPhone,
   block "fx B AB 1.1"), counted and unexplained. Here: a page at the phone's tier (402 x 714 with an iPhone's user agent: lowTier, density 1,
   no shadow), the fx route's view (the low Pratzen view at 4x, 09:50, Watch), the page settled; then the effects switched off, on, off, on
   (the visitor's F, setFXEnabled), each switch followed by FRAMES frames, each frame timed (renderFrame, the app's own) with the programs three
   has compiled (renderer.info.programs) before and after. A first switch that compiles programs the later switches reuse shows here as
   programs added and a long first frame. Software WebGL: the times are this machine's, not a phone's; the program counts are the build's.
   node tools/final-stage7/fx-off-probe.js [build.html] [--json out.json]   Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), TR=require(path.join(ROOT,"tools","visual","three-route.js"));
const { chromium } = require("playwright");
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html")), OUT=opt("--json"), FRAMES=12;
const UA="Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
(async()=>{
  const b=await chromium.launch({executablePath:process.env.AUSTERLITZ_CHROME||undefined,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  const ctx=await b.newContext({viewport:{width:402,height:714},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:UA}), p=await ctx.newPage(), errs=[];
  p.on("pageerror",e=>errs.push(e.message));
  await TR.routeThree(p); await p.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:120000}); await TR.waitBoot(p,240000);
  const r=await p.evaluate(async(N)=>{
    if(typeof closeFirst==="function") closeFirst(null);
    const P={map:[285,289], dir:[-1.0,0.13,0.18], r:70}, w=W(P.map[0],P.map[1]), ty=height(w[0],w[1]), d=new THREE.Vector3(P.dir[0],P.dir[1],P.dir[2]).normalize().multiplyScalar(P.r);
    AUSTERLITZ_DEBUG.applyCase({t:590,presentation:"watch",mode:"terrain",factor:4,cam:[w[0]+d.x,ty+d.y,w[1]+d.z,w[0],ty,w[1]]}); AUSTERLITZ_DEBUG.settle(30);
    const out={lowTier:lowTier, density:renderer.getPixelRatio(), fx0:FX.on, built0:!!FX.built, switches:[]};
    /* each frame on an animation frame of its own (as a visitor's), its total time and the map layer's share (DEV.tLayer: mlLayout, the DOM's
       pass, which runs on a wall-clock schedule) apart */
    const frames=async()=>{ const t=[], l=[]; for(let i=0;i<N;i++){ await new Promise(z=>requestAnimationFrame(z)); const a=performance.now(); renderFrame(); renderer.getContext().finish(); t.push(+(performance.now()-a).toFixed(1)); l.push(+(DEV.tLayer||0).toFixed(1)); } return {t:t,l:l}; };
    await frames();
    for(const on of [false,true,false,true]){ const p0=renderer.info.programs.length, a=performance.now(); setFXEnabled(on); const sw=+(performance.now()-a).toFixed(1);
      const f=await frames(); out.switches.push({to:on?"effects on":"effects off", switchMs:sw, programsBefore:p0, programsAfter:renderer.info.programs.length, frameMs:f.t, layerMs:f.l}); }
    return out; },FRAMES);
  await b.close();
  r.build=path.basename(html); r.errors=errs;
  r.switches.forEach(s=>console.log(s.to.padEnd(12)+" programs "+s.programsBefore+" -> "+s.programsAfter+"; the switch "+s.switchMs+" ms; frames "+s.frameMs.join(", ")+" ms"));
  console.log("lowTier "+r.lowTier+", density "+r.density+", effects on at the start "+r.fx0+", errors "+errs.length);
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(r,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
