#!/usr/bin/env node
/* UI/UX roadmap step 3 (UA-02): a phone turned while the clock plays under Follow, and turned back. A phone's page (390 x 844, density 3, touch, an
   iPhone's user agent: Chromium's emulation), the card closed by a tap, the Landscape in Study, the clock at the run's start with the eye at that
   phase's authored view, Follow on, Play at half speed on the motion driver's clock (tools/visual/motion.js); after --hold frames the page is
   turned to 844 x 390 (held landscape: the desktop's layout and Follow's desktop profile), after --hold more turned back, then --hold more. Every
   frame: the layout (PHONE), Follow's profile, the eye (distance, elevation), the events above 0.3 inside the free map, the box's share and the
   ground's projected move (tools/ux-step3/framing.js's own measures; the frame after a turn, which the projection's change moves, not counted);
   three frames drawn and captured (the last before each turn and the last).
   The same on any build, so the Step 2 build and the candidate are compared by one tool.
   node tools/ux-step3/rotate.js <build.html> --out <dir> [--from 528] [--hold 150] [--tag name] */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), MO=require(path.join(L.ROOT,"tools","visual","motion.js")), UX=require(path.join(L.ROOT,"tools","visual","ux2.js"));
const argv=process.argv.slice(2), opt=(f,d)=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:d; };
const html=path.resolve(argv.find(a=>a.endsWith(".html"))), OUT=path.resolve(opt("--out","tools/ux-step3/out")), FROM=+opt("--from",528), HOLD=+opt("--hold",150), TAG=opt("--tag","rotate");
const inPage=require("./framing.js").inPage;   /* framing.js's in-page measures: one definition for both tools */
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  const b=await L.launch(), p=await L.open(b,html,{vp:[390,844],phone:true});
  await L.settle(p); await L.closeCard(p); await L.settle(p);
  await p.evaluate(MO.inPage); await p.evaluate(UX.inPage); await p.evaluate(inPage);
  const n0=await p.evaluate(()=>{ setMode("terrain"); setPresentation("study"); select(null,null); window.__md.start({gl:false}); return DEV.frames+DEV.skipped; });
  await p.waitForFunction(n=>DEV.frames+DEV.skipped>n,n0,{timeout:15000}).catch(()=>{});
  await p.evaluate(a=>{ var D=window.__md; mlReset("driver"); needFrames=0; stopPlay(); setClock(a,{instant:true,force:true,camera:false}); var n=0; while(tween&&n<8){ tween(performance.now()+1e7); n++; }
    var c=presetFrame(PHASES[phaseAt(a)].cam); landCam.position.set(c[0],c[1],c[2]); orbitTarget.set(c[3],c[4],c[5]); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true);
    freeCam=false; curVantage=null; setSpeed(0.5); requestRender(8); D.frame(8); window.__fr.reset(); togglePlay(); },FROM);
  const F=[], shots=[];
  const step=async(n,tag)=>{ for(let i=0;i<n;i++){ const s=await p.evaluate(()=>{ window.__md.frame(); var o=window.__fr.frame({dt:window.__md.frameMs/1000});
      o.phone=typeof PHONE!=="undefined"?PHONE:null; o.profile=typeof followProfile==="function"?(followProfile()?"phone":"desktop"):null; o.w=innerWidth; o.h=innerHeight; return o; }); s.stage=tag; F.push(s); } };
  const shot=async tag=>{ await p.evaluate(()=>{ if(typeof GDEPTH!=="undefined") GDEPTH.key=null; if(FX.on) renderFX(); else renderStandard(); });
    const f=path.join(OUT,TAG+"-"+tag+".png"); await p.screenshot({path:f,scale:"css"}); shots.push(path.basename(f)); };
  const turn=async(w,h)=>{ await p.setViewportSize({width:w,height:h}); await p.evaluate(()=>window.dispatchEvent(new Event("resize")));
    await p.waitForFunction(([w,h])=>innerWidth===w&&innerHeight===h&&Math.abs(landCam.aspect-w/h)<1e-9,[w,h],{timeout:60000,polling:50}); };
  await step(HOLD,"upright"); await shot("1-upright");
  await turn(844,390); await step(HOLD,"turned"); await shot("2-turned");
  await turn(390,844); await step(HOLD,"back"); await shot("3-back");
  await p.evaluate(()=>{ stopPlay(); window.__md.stop(); });
  const errs=p.__errs.slice(); await b.close();
  const by={}; F.forEach(s=>{ const B=by[s.stage]||(by[s.stage]={frames:0, evQ:0, evIn:0, box:[], d:[], el:[], flow:0, tflow:0, phone:new Set(), profile:new Set()}); B.frames++;
    s.ev.forEach(e=>{ B.evQ++; if(e.c==="free") B.evIn++; }); if(s.comp&&s.comp.bbox) B.box.push(s.comp.bboxShare); B.d.push(s.cam.d); B.el.push(s.cam.el);
    /* the frame after a turn moves every point by the projection's own change (the new width and height), not the eye's: not counted */
    const i=F.indexOf(s), vo=i>0&&s.cam.voff&&F[i-1].cam.voff&&(s.cam.voff[0]!==F[i-1].cam.voff[0]||s.cam.voff[1]!==F[i-1].cam.voff[1]);
    if(B.frames>1){ if(vo){ B.voff=(B.voff||0)+1; if(s.tflow!==undefined) B.tflowVoff=Math.max(B.tflowVoff||0,s.tflow); }   /* the view offset's own easing (a panel's change) moves every point */
      else { if(s.flow!==undefined) B.flow=Math.max(B.flow,s.flow); if(s.tflow!==undefined) B.tflow=Math.max(B.tflow,s.tflow); } } B.phone.add(String(s.phone)); B.profile.add(String(s.profile)); });
  const S={tag:TAG, build:L.buildInfo(html), from:FROM, hold:HOLD, shots, errors:errs, stages:{}};
  Object.keys(by).forEach(k=>{ const B=by[k]; S.stages[k]={frames:B.frames, clock:[F.find(s=>s.stage===k).clock, F.filter(s=>s.stage===k).pop().clock], phone:[...B.phone], profile:[...B.profile],
    eventFramesInside:B.evIn+" of "+B.evQ, eventShare:B.evQ?+(B.evIn/B.evQ).toFixed(3):null, boxMedian:L.q(B.box,0.5), dFirst:B.d[0], dLast:B.d[B.d.length-1], elLast:B.el[B.el.length-1], flowMax:B.flow, targetMax:B.tflow, voffFrames:B.voff||0, targetMaxVoff:B.tflowVoff||null}; });
  fs.writeFileSync(path.join(OUT,TAG+".json"),JSON.stringify(S,null,1));
  fs.writeFileSync(path.join(OUT,TAG+"-frames.json"),JSON.stringify(F.map(s=>({c:s.clock,st:s.stage,phone:s.phone,pr:s.profile,cam:s.cam,ev:s.ev.map(e=>[e.id,e.w,e.c]),fl:s.flow,tf:s.tflow,box:s.comp&&s.comp.bbox?s.comp.bboxShare:0}))));
  console.log(TAG+" on "+S.build.md5.slice(0,8)+": "+Object.keys(S.stages).map(k=>k+" "+JSON.stringify(S.stages[k])).join("; ")+"; errors "+errs.length);
})().catch(e=>{ console.error(e); process.exit(1); });
