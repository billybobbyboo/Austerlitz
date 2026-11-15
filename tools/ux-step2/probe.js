#!/usr/bin/env node
/* UI/UX roadmap step 2 (docs/UX_ART_AUDIT.md UA-01, UA-15): the acceptance measures of the Landscape's label tiers, on any build, so that the
   base build and the candidate are measured by one tool, one clock, one camera rule, one viewport, one presentation, one renderer and one
   sampling (tools/visual/ux2.js holds the measures).
   A run: a page at the size asked (a desktop's, or a phone's with its device: density 3, touch, an iPhone's user agent; Chromium's emulation,
   not a physical device), the card closed by a real press, the Landscape in the presentation asked, the clock set to the run's start (the
   phase's view, as a visitor's seek gives it), then Play at half speed with Follow on the motion driver's clock (tools/visual/motion.js: the
   app's own loop at 30 frames a second, whatever the machine's speed), to the run's end. Every frame: the layer's items (state, tier, surface,
   box) and the composition (the formations' box, the share of it under filled plates). Every --every-th frame, and each frame at a clock named
   by --at, is drawn by the app's own WebGL frame and read three times (as rendered, the ink transparent, the layer hidden) for each drawn
   text's contrast; --shots keeps those frames' pictures.
   node tools/ux-step2/probe.js <build.html> --out <dir> [--vp 1440x900] [--phone] [--pres study|watch] [--from 510] [--to 570] [--every 15]
     [--at 524.7,540] [--shots] [--reading fr|al] [--tag name] */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const ROOT=path.resolve(__dirname,"..",".."), TR=require(path.join(ROOT,"tools","visual","three-route.js")), MO=require(path.join(ROOT,"tools","visual","motion.js")), UX=require(path.join(ROOT,"tools","visual","ux2.js"));
const { chromium } = require("playwright");
const argv=process.argv.slice(2), opt=(f,d)=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:d; }, has=f=>argv.includes(f);
const html=path.resolve(argv.find(a=>a.endsWith(".html"))||path.join(ROOT,"austerlitz-command-map.html")), OUT=path.resolve(opt("--out","tools/ux-step2/out"));
const VP=opt("--vp",has("--phone")?"390x844":"1440x900").split("x").map(Number), PHONE=has("--phone"), PRES=opt("--pres","study"), FROM=+opt("--from",510), TO=+opt("--to",570), EVERY=+opt("--every",15);
const AT=(opt("--at","")||"").split(",").filter(Boolean).map(Number), SHOTS=has("--shots"), READING=opt("--reading",null), MODE=opt("--mode","terrain");
const TAG=opt("--tag",(PHONE?"phone":"desk")+"-"+PRES+(READING?"-"+READING:"")+(MODE!=="terrain"?"-"+MODE:"")+"-"+FROM+"-"+TO);
const UA_IOS="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const q=(a,p)=>{ if(!a.length) return null; const s=a.slice().sort((x,y)=>x-y); return s[Math.min(s.length-1,Math.floor(s.length*p))]; };
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  const b=await chromium.launch({executablePath:process.env.AUSTERLITZ_CHROME||undefined,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]}), errs=[];
  const ctx=await b.newContext(PHONE?{viewport:{width:VP[0],height:VP[1]},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:UA_IOS}:{viewport:{width:VP[0],height:VP[1]},deviceScaleFactor:1});
  const p=await ctx.newPage(); p.on("pageerror",e=>errs.push("pageerror: "+e.message)); p.on("console",m=>{ if(m.type()==="error"||m.type()==="warning") errs.push(m.type()+": "+m.text()); });
  await TR.routeThree(p); await p.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(p,240000);
  const settle=async()=>{ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(30)); await p.waitForTimeout(200); };
  await settle();
  if(PHONE) await p.tap("#fr-close",{timeout:60000}); else { await p.click("#fr-close",{timeout:60000});
    /* the pointer off the map (tools/visual/motion.js does the same): left where the card's button was, it stands over the map, and whether the
       browser then reports a hover on the counter or name under it depends on the run. Found on the paper map, where two runs of one build
       gave two layouts (a hovered formation is protected); with the pointer parked every run of a build is the same */
    await p.mouse.move(2,2); }
  await p.evaluate(a=>{ setMode(a.mode); setPresentation(a.pres); select(null,null); setClock(a.from,{instant:true,force:true}); },{mode:MODE,pres:PRES,from:FROM}); await settle();
  await p.evaluate(UX.inPage);
  if(opt("--css",null)) await p.addStyleTag({content:fs.readFileSync(opt("--css"),"utf8")});   /* a prototype's rules over the build (the casings compared) */
  const env=await p.evaluate(()=>{ var gl=renderer.getContext(), e=gl.getExtension("WEBGL_debug_renderer_info"); return {renderer:e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):null, dpr:window.devicePixelRatio, ua:navigator.userAgent,
    phoneLayout:typeof PHONE!=="undefined"?PHONE:null, w:innerWidth, h:innerHeight, tiers:typeof MLT!=="undefined"}; });
  const samples=[], comps=[], atLeft=AT.slice().sort((x,y)=>x-y); let redrawn=0;
  /* the share of a capture's canvas that is exactly black (a drawn Landscape has next to none; a canvas not on screen is all black but
     for the labels over it) */
  const blackShare=buf=>p.evaluate(async s=>{ const im=new Image(); im.src="data:image/png;base64,"+s; await im.decode();
    const c=document.createElement("canvas"); c.width=im.width; c.height=im.height; const g=c.getContext("2d"); g.drawImage(im,0,0);
    const r=renderer.domElement.getBoundingClientRect(), k=im.width/innerWidth, d=g.getImageData(Math.round(r.left*k),Math.round(r.top*k),Math.max(1,Math.round(r.width*k)),Math.max(1,Math.round(r.height*k))).data;
    let z=0, n=0; for(let i=0;i<d.length;i+=16){ n++; if(d[i]+d[i+1]+d[i+2]===0) z++; } return z/n; },buf.toString("base64"));
  const t0=Date.now();
  const R=await UX.playRun(p,MO,{from:FROM,to:TO,reading:READING,comp:true,
    sample:(f,clk)=>{ if(atLeft.length&&clk>=atLeft[0]-0.26){ atLeft.shift(); return true; } return EVERY>0&&f%EVERY===0; },
    onSample:async(f,s)=>{
      const T=await p.evaluate(()=>window.__ux2.texts());
      /* a frame drawn outside the page's own animation frame is not always on screen when the capture is taken: the first drawn frame of a
         run came back with a black canvas in about half the runs (the drawing buffer held the picture, read back in the same task; the
         capture did not), which reads every text against black. A capture whose canvas is black is not used: the same state is drawn
         again (no clock, no layout) and captured again; counted (redrawn), and a frame still black after three tries ends the run */
      let A=await p.screenshot({timeout:180000,scale:"css"}), tries=0;
      while(await blackShare(A)>0.25){ if(++tries>3) throw new Error("frame "+f+": the canvas is black in the capture after "+(tries-1)+" redraws");
        await p.evaluate(()=>{ renderer.render=window.__ux2rr; if(typeof GDEPTH!=="undefined") GDEPTH.key=null; if(FX.on) renderFX(); else renderStandard(); renderer.render=function(){}; });
        A=await p.screenshot({timeout:180000,scale:"css"}); redrawn++; }
      await p.evaluate(()=>window.__ux2.inkOff(true)); const B=await p.screenshot({timeout:180000,scale:"css"});
      await p.evaluate(()=>{ window.__ux2.inkOff(false); window.__ux2.layerOff(true); }); const C=await p.screenshot({timeout:180000,scale:"css"});
      await p.evaluate(()=>window.__ux2.layerOff(false));
      const tc=await p.evaluate(([a,b2,c,T])=>window.__ux2.contrast(a,b2,c,T),[A.toString("base64"),B.toString("base64"),C.toString("base64"),T]);
      const cmp=await p.evaluate(()=>window.__ux2.comp());
      /* the variant not built: were every tier 3 label whose words' box reads under 4.5:1 (the ground between and round its words counted, as
         for a plated label) given the far plate, the share of the formations' box under filled plates */
      const need=tc.filter(t=>t.tier===3&&t.opacity>=0.999&&t.box!==null&&t.box<4.5).map(t=>t.k);
      const alt=await p.evaluate(k=>window.__ux2.comp(k),need);
      samples.push({f:f, clock:s.clock, texts:tc, comp:cmp, boxFallback:{labels:need.length, fillCover:alt.fillCover}});
      if(SHOTS){ const nm=TAG+"-f"+String(f).padStart(4,"0")+"-"+(m=>String(Math.floor(m/60)).padStart(2,"0")+String(m%60).padStart(2,"0"))(Math.round(s.clock)); fs.writeFileSync(path.join(OUT,nm+".png"),A); fs.writeFileSync(path.join(OUT,nm+"-nolabels.png"),C); }
    }});
  /* every frame's composition and computed fills came with its snap (playRun's o.comp) */
  const F=R.F, events=await p.evaluate(()=>EVENTS.map(e=>({id:e.id, n:e.n, forms:e.forms||[]})));
  F.forEach(S=>{ const c=S.comp||{}; delete S.comp; c.f=S.f; c.clock=S.clock;
    c.drawn=Object.keys(S.items).filter(k=>S.items[k].st==="on").length;
    c.byTier={1:0,2:0,3:0,0:0}; c.fills=0; c.tier3Fills=[]; c.grown=Object.keys(S.items).filter(k=>S.items[k].st==="on"&&S.items[k].tier===1&&S.items[k].grown).length;
    Object.keys(S.items).forEach(k=>{ const it=S.items[k]; if(it.st!=="on") return; const t=it.tier===null?0:it.tier; c.byTier[t]=(c.byTier[t]||0)+1; if(it.fill){ c.fills++; if(t===3) c.tier3Fills.push(k+(it.foc||it.forced?" (focus)":"")); } });
    comps.push(c); });
  await b.close();
  /* ---- the measures ---- */
  const md5=crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex");
  const cov=comps.filter(c=>c.bbox), worst=cov.slice().sort((x,y)=>y.fillCover-x.fillCover).slice(0,5).map(c=>({f:c.f, clock:+c.clock.toFixed(1), fillCover:c.fillCover, filled:c.filled, labels:c.labels, bboxShare:c.bboxShare, tier3Filled:c.tier3Filled}));
  const texts=[].concat.apply([],samples.map(s=>s.texts.map(t=>Object.assign({f:s.f, clock:+s.clock.toFixed(1)},t))));
  const full=texts.filter(t=>t.opacity>=0.999&&t.ring!==null), t3=full.filter(t=>t.tier===3||(t.tier===null&&false)), cased=full.filter(t=>t.cased&&!t.fill), plated=full.filter(t=>t.fill);
  const sum=(A,k)=>({n:A.length, min:A.length?Math.min.apply(null,A.map(t=>t[k])):null, p10:q(A.map(t=>t[k]),0.10), median:q(A.map(t=>t[k]),0.5), below:A.filter(t=>t[k]<4.5).length});
  const EV=UX.evShare(F,events);
  const ms=R.ms.slice(), drawnMax=Math.max.apply(null,comps.map(c=>c.drawn)), over12=comps.filter(c=>c.drawn>12).length;
  const out={build:path.basename(html), md5, tag:TAG, env, vp:VP, phone:PHONE, presentation:PRES, mode:MODE, reading:READING, from:FROM, to:TO, frames:F.length, secs:Math.round((Date.now()-t0)/1000),
    clockEnd:F.length?F[F.length-1].clock:null,
    coverage:{frames:cov.length, max:cov.length?Math.max.apply(null,cov.map(c=>c.fillCover)):null, median:q(cov.map(c=>c.fillCover),0.5), over12:cov.filter(c=>c.fillCover>0.12).length, worst,
      labelCoverMax:cov.length?Math.max.apply(null,cov.map(c=>c.labelCover)):null, labelCoverMedian:q(cov.map(c=>c.labelCover),0.5), fillAllMax:cov.length?Math.max.apply(null,cov.map(c=>c.fillAllCover)):null,
      bboxShareMedian:q(cov.map(c=>c.bboxShare),0.5), tier3FillFrames:comps.filter(c=>c.tier3Fills.length).length, tier3FillsMax:Math.max.apply(null,comps.map(c=>c.tier3Fills.length))},
    drawn:{max:drawnMax, median:q(comps.map(c=>c.drawn),0.5), over12:over12, byTierMax:{1:Math.max.apply(null,comps.map(c=>c.byTier[1]||0)),2:Math.max.apply(null,comps.map(c=>c.byTier[2]||0)),3:Math.max.apply(null,comps.map(c=>c.byTier[3]||0)),0:Math.max.apply(null,comps.map(c=>c.byTier[0]||0))},
      fillsMax:Math.max.apply(null,comps.map(c=>c.fills)), fillsMedian:q(comps.map(c=>c.fills),0.5),
      tier1Frames:comps.reduce((n,c)=>n+(c.byTier[1]||0),0), tier1Grown:comps.reduce((n,c)=>n+(c.grown||0),0)},
    contrast:{samples:samples.length, redrawn:redrawn, texts:texts.length, fading:texts.length-full.length,
      tier3:{ring:sum(t3,"ring"), wide:sum(t3,"wide"), box:sum(t3,"box"), bare:sum(t3.filter(t=>t.bare!==null),"bare")},
      cased:{ring:sum(cased,"ring"), box:sum(cased,"box")}, plated:{ring:sum(plated,"ring"), box:sum(plated,"box")}, all:{ring:sum(full,"ring"), box:sum(full,"box"), bare:sum(full.filter(t=>t.bare!==null),"bare")},
      belowRing:full.filter(t=>t.ring<4.5).map(t=>({f:t.f, clock:t.clock, k:t.k, tier:t.tier, text:t.text, ring:t.ring, box:t.box, bare:t.bare})).slice(0,40)},
    boxFallback:{samples:samples.length, labelsMax:samples.length?Math.max.apply(null,samples.map(s=>s.boxFallback.labels)):null, labelsMedian:q(samples.map(s=>s.boxFallback.labels),0.5),
      coverMax:samples.length?Math.max.apply(null,samples.map(s=>s.boxFallback.fillCover||0)):null, coverMedian:q(samples.map(s=>s.boxFallback.fillCover||0),0.5), over12:samples.filter(s=>s.boxFallback.fillCover>0.12).length},
    events:EV, layerMs:{passes:ms.length, median:q(ms,0.5)===null?null:+q(ms,0.5).toFixed(2), p95:q(ms,0.95)===null?null:+q(ms,0.95).toFixed(2), max:ms.length?+Math.max.apply(null,ms).toFixed(2):null, over8:ms.filter(x=>x>8).length},
    errors:errs};
  fs.writeFileSync(path.join(OUT,TAG+".json"),JSON.stringify(out,null,1));
  fs.writeFileSync(path.join(OUT,TAG+"-frames.json"),JSON.stringify({comps:comps.map(c=>({f:c.f,clock:c.clock,bbox:c.bbox,bboxShare:c.bboxShare,fillCover:c.fillCover,labelCover:c.labelCover,fillAllCover:c.fillAllCover,drawn:c.drawn,byTier:c.byTier,fills:c.fills,tier3Fills:c.tier3Fills})),samples:samples}));
  const pc=x=>x===null?"n/a":(100*x).toFixed(1)+"%";
  console.log(TAG+" on "+md5.slice(0,8)+" ("+out.env.renderer+"; "+VP.join("x")+(PHONE?" phone, density 3":"")+"): "+F.length+" frames to "+(out.clockEnd||0).toFixed(1)+", "+out.secs+" s");
  console.log("  filled plates over the formations' box: max "+pc(out.coverage.max)+", median "+pc(out.coverage.median)+", frames over 12%: "+out.coverage.over12+" of "+cov.length+"; every label's box: max "+pc(out.coverage.labelCoverMax)+"; tier 3 fills: "+out.coverage.tier3FillsMax+" at most, in "+out.coverage.tier3FillFrames+" frames");
  console.log("  drawn labels: max "+out.drawn.max+", median "+out.drawn.median+", frames over 12: "+over12+"; filled: max "+out.drawn.fillsMax+", median "+out.drawn.fillsMedian+"; by tier at most "+JSON.stringify(out.drawn.byTierMax)+"; a live event's plate at t-live in "+out.drawn.tier1Grown+" of its "+out.drawn.tier1Frames+" frames");
  console.log("  contrast over "+samples.length+" drawn frames ("+redrawn+" drawn again: the capture's canvas black), "+full.length+" texts at full opacity ("+out.contrast.fading+" fading aside): tier 3 ring "+JSON.stringify(out.contrast.tier3.ring)+", box "+JSON.stringify(out.contrast.tier3.box)+", bare "+JSON.stringify(out.contrast.tier3.bare));
  if(out.boxFallback.labelsMax) console.log("    the variant not built (the far plate under every tier 3 label whose words' box reads under 4.5:1): "+out.boxFallback.labelsMedian+" labels a sampled frame (median; "+out.boxFallback.labelsMax+" at most), filled plates then over "+pc(out.boxFallback.coverMedian)+" of the formations' box (median; "+pc(out.boxFallback.coverMax)+" at most), over 12% in "+out.boxFallback.over12+" of "+samples.length+" sampled frames");
  console.log("    every text: ring "+JSON.stringify(out.contrast.all.ring)+", box "+JSON.stringify(out.contrast.all.box)+", bare "+JSON.stringify(out.contrast.all.bare));
  console.log("  the formations a live event names: drawn "+EV.drawn+" of "+EV.inView+" in view ("+pc(EV.share)+") over "+EV.frames+" frames of Play; not drawn: "+JSON.stringify(EV.miss)+"; outside the measure: "+JSON.stringify(EV.out));
  Object.keys(EV.by).forEach(id=>{ const B=EV.by[id]; console.log("    "+id.padEnd(18)+" label drawn "+B.frames+" frames; its formations drawn "+B.drawn+" of "+B.inView+(Object.keys(B.miss).length?"; misses "+JSON.stringify(B.miss):"")+(Object.keys(B.out).length?"; outside "+JSON.stringify(B.out):"")); });
  console.log("  the label pass: median "+out.layerMs.median+" ms, 95th "+out.layerMs.p95+", max "+out.layerMs.max+" over "+ms.length+" passes, over 8 ms: "+out.layerMs.over8+"; page errors "+errs.length+(errs.length?": "+errs.slice(0,3).join(" | "):""));
})().catch(e=>{ console.error(e); process.exit(2); });
