/* Final audit after Stage 8, area "robustness": a visitor's page in prolonged use (measurement only).
   node tools/audit-post8/robustness/visitor.js [blocks]  ->  docs/audit-post8-evidence/robustness/visitor.json
   blocks (default all, in this order): idle, growth, day, storm
   One visitor's page (no ?harness=1: drift and smoke move; CSS transitions kept), 1366 x 768, density 1, the first-run card closed by a real Escape.
   idle   : 120 s at 04:00 (no smoke expected), then the next events by the real "." key until ambientNow() (smoke or dust shown), 60 s there:
            requestAnimationFrame callbacks, frames drawn (DEV.frames), timers fired by name, CPU (CDP TaskDuration, ScriptDuration), layouts.
   growth : the heap forced through GC and CDP Performance.getMetrics before and after each block: 20 presentation switches (real keys 2, 3, 1),
            12 relief switches (real clicks in the Layers panel: 1x, 10.33x, 4x), 10 paper map <-> landscape switches (real clicks on the ground
            buttons), 30 dossiers opened by a real click on a formation's map item and closed by a real Escape.
   day    : the whole day at 4x: real click on the 4x button, the clock put to 04:00 by real Shift+ArrowLeft (focus moved off the buttons by a real
            click on empty ground), Play by a real click, sampled every 5 s until the clock stops at the day's end (cap 50 min).
   storm  : layout signatures at 1600x900, 700x900, 390x844 and 844x390 (one resize each, settled), then 100 setViewportSize calls cycling those
            sizes at 0-120 ms intervals, then the signatures again at each size; differences, console errors, the heap. */
"use strict";
const path=require("path");
const R=require("./rlib.js"), A=R.A;
/* RB_OUT names another output file in the same folder (a later run of some blocks keeps the earlier file); RB_SKIP_PRES=1 skips the 20
   presentation switches (measured in visitor.json); RB_DAY_CAP_MIN bounds the day's real time (default 50 minutes) */
const OUT=path.join(A.EVID,"robustness",process.env.RB_OUT||"visitor.json"), save=R.writer(OUT);
const DAY_CAP_MS=(+process.env.RB_DAY_CAP_MIN||50)*60000;
const want=(process.argv[2]||"idle,growth,day,storm").split(",");
(async()=>{
  const res={what:"visitor's page, prolonged use",started:new Date().toISOString(),blocks:{}};
  const b=await A.launch();
  let page,s;
  const settle=(cap)=>page.evaluate(c=>__rb.settle(500,c,true),cap||60000);
  const st=()=>A.state(page);
  const click=async(sel)=>{ const bb=await page.locator(sel).first().boundingBox(); if(!bb) return false; await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); return true; };
  const errs=()=>(page._log||[]).filter(x=>x.type!=="warning").length;
  try{
    page=await A.open(b,[1366,768],{harness:false,transitions:true});
    await R.install(page); s=await R.cdp(page);
    res.firstRunAtLoad=(await st()).firstRun;
    await page.keyboard.press("Escape");
    res.firstRunAfterEsc=(await st()).firstRun;
    res.settleBoot=await settle(180000);
    res.boot=await R.snap(page,s,"boot (card closed)"); save(res);

    if(want.includes("idle")){ const B=res.blocks.idle={};
      try{
        const window_=async(ms,label)=>{ await R.gc(s); const m0=await R.metrics(s), p0=await page.evaluate(()=>({c:JSON.parse(JSON.stringify(__rb.C)),f:DEV.frames,k:DEV.skipped,amb:ambientNow(),clock:clock,state:frameState(performance.now())}));
          await R.sleep(ms);
          const m1=await R.metrics(s), p1=await page.evaluate(()=>({c:JSON.parse(JSON.stringify(__rb.C)),f:DEV.frames,k:DEV.skipped,amb:ambientNow(),clock:clock,state:frameState(performance.now())}));
          const d={}; ["TaskDuration","ScriptDuration","LayoutCount","RecalcStyleCount","LayoutDuration","RecalcStyleDuration"].forEach(k=>d[k]=+(m1[k]-m0[k]).toFixed(3));
          const by=(a,b2)=>{ const o={}; Object.keys(b2).forEach(k=>{ const v=b2[k]-(a[k]||0); if(v) o[k]=v; }); return o; };
          return {label,seconds:ms/1000,clock:p0.clock,ambientAtStart:p0.amb,ambientAtEnd:p1.amb,stateAtStart:p0.state,stateAtEnd:p1.state,
            framesDrawn:p1.f-p0.f,framesSkipped:p1.k-p0.k,rafCallbacks:p1.c.rafCb-p0.c.rafCb,timeoutsFired:p1.c.toCb-p0.c.toCb,intervalsFired:p1.c.ivCb-p0.c.ivCb,
            timeoutsBy:by(p0.c.toBy,p1.c.toBy),intervalsBy:by(p0.c.ivBy,p1.c.ivBy),cdpDelta:d,heapAfter:m1.JSHeapUsedSize}; };
        B.at0400=await window_(120000,"idle at 04:00");
        save(res);
        let n=0; while(n<20&&!(await page.evaluate(()=>ambientNow()))){ await page.keyboard.press("."); n++; await R.sleep(800); }
        B.dotPresses=n; B.settleSmoke=await settle(90000);
        B.atSmoke=await window_(60000,"idle at a moment with smoke shown");
        B.errors=errs();
      }catch(e){ B.error=String(e&&e.stack||e); }
      save(res); }

    if(want.includes("growth")){ const G=res.blocks.growth={};
      try{
        G.before=await R.snap(page,s,"before growth");
        /* 20 presentation switches by real keys */
        const keys=[]; for(let i=0;i<20;i++) keys.push(["2","3","1"][i%3]);
        if(!process.env.RB_SKIP_PRES){
        G.presKeys=keys.join(""); const seen=[];
        for(const k of keys){ await page.keyboard.press(k); await settle(30000); seen.push((await st()).presentation); }
        G.presSeen=seen.join(","); if((await st()).presentation!=="study"){ await page.keyboard.press("1"); await settle(30000); }
        G.afterPresentations=await R.snap(page,s,"after 20 presentation switches"); save(res);
        } else G.presentations="skipped (RB_SKIP_PRES): measured in visitor.json";
        /* 12 relief switches by real clicks in the Layers panel */
        const settings=await page.evaluate(()=>DISPLAY.settings.slice());
        const order=[]; const seq=[1,settings[settings.length-1],4].filter(x=>settings.includes(x)); for(let i=0;i<12;i++) order.push(seq[i%seq.length]);
        const fseen=[];
        for(const x of order){
          if(await page.evaluate(()=>document.getElementById("layerpop").hidden)) await click("#layersbtn");
          await click('.exag-btn[data-x="'+x+'"]'); await settle(90000); fseen.push((await st()).factor);
        }
        G.reliefOrder=order.join(","); G.reliefSeen=fseen.join(",");
        G.afterRelief=await R.snap(page,s,"after 12 relief switches"); save(res);
        /* 10 paper map <-> landscape switches by real clicks on the ground buttons */
        const mseen=[];
        for(let i=0;i<10;i++){ const m=i%2===0?"staff":"terrain";
          if(await page.evaluate(()=>document.getElementById("layerpop").hidden)) await click("#layersbtn");
          await click('.mode-btn[data-m="'+m+'"]'); await settle(90000); mseen.push((await st()).mode); }
        G.modeSeen=mseen.join(",");
        if(!(await page.evaluate(()=>document.getElementById("layerpop").hidden))) await page.keyboard.press("Escape");
        await settle(30000);
        G.afterPaper=await R.snap(page,s,"after 10 paper map/landscape switches"); save(res);
        /* 30 dossiers: a real click on a formation's map item, a real Escape */
        const dos=[]; let ok=0;
        for(let i=0;i<30;i++){
          const cand=await page.evaluate(()=>Object.values(ML.items).filter(it=>it.pick&&it.pick.kind==="f"&&it.el.style.display!=="none"&&it.state!=="occluded"&&it.eFrame===ML.frame)
            .map(it=>{ const r=it.el.getBoundingClientRect(); return {id:it.pick.id,x:r.x+r.width/2,y:r.y+r.height/2,w:r.width,h:r.height}; })
            .filter(c=>c.w>4&&c.h>4&&c.x>40&&c.y>40&&c.x<innerWidth-420&&c.y<innerHeight-140));
          if(!cand.length){ dos.push({i,none:true}); await settle(10000); continue; }
          const c=cand[i%cand.length];
          await page.mouse.move(c.x,c.y); await R.sleep(150); await page.mouse.click(c.x,c.y); await settle(20000);
          const s1=await st(); const open=await page.evaluate(()=>{ const d=document.getElementById("drawer"); return document.body.classList.contains("drawer-open")||!!(d&&!d.hidden&&d.getBoundingClientRect().width>0); });
          await page.keyboard.press("Escape"); await settle(20000);
          const s2=await st();
          const good=s1.selection==="f:"+c.id&&!s2.selection; if(good) ok++;
          dos.push({i,id:c.id,selected:s1.selection,drawer:open,afterEsc:s2.selection});
        }
        G.dossiers={ok,of:30,list:dos};
        G.afterDossiers=await R.snap(page,s,"after 30 dossiers opened and closed"); G.errors=errs();
      }catch(e){ G.error=String(e&&e.stack||e); }
      save(res); }

    if(want.includes("day")){ const D=res.blocks.day={};
      try{
        D.before=await R.snap(page,s,"before the day at 4x");
        await click('.spd-btn[data-s="4"]'); D.speed=await page.evaluate(()=>speed);
        /* focus off the buttons: a real click on empty ground (a selection, if any, closed by Escape) */
        await page.mouse.click(160,300); await settle(10000); if((await st()).selection){ await page.keyboard.press("Escape"); await settle(10000); }
        D.focusAfterClick=await page.evaluate(()=>document.activeElement&&(document.activeElement.id||document.activeElement.tagName));
        let n=0; while(n<24&&(await page.evaluate(()=>clock>T_MIN+1e-6))){ await page.keyboard.press("Shift+ArrowLeft"); n++; await R.sleep(300); }
        D.shiftLeftPresses=n; D.clockAtStart=await page.evaluate(()=>clock);
        if(D.clockAtStart>await page.evaluate(()=>T_MIN)+1e-6){ await page.evaluate(()=>setClock(T_MIN,{force:true})); D.clockSetByGlobal=true; }
        await settle(60000);
        const t0=Date.now(); await click("#play"); D.playingAfterClick=(await st()).playing;
        const samples=[]; let lastHeap=Date.now();
        while(Date.now()-t0<DAY_CAP_MS){
          await R.sleep(5000);
          const p=await page.evaluate(()=>({clock:+clock.toFixed(2),playing:playing,frames:DEV.frames,dom:document.getElementsByTagName("*").length,geo:renderer.info.memory.geometries,tex:renderer.info.memory.textures,prog:renderer.info.programs.length}));
          if(Date.now()-lastHeap>60000){ p.cdp=await R.metrics(s); lastHeap=Date.now(); }
          p.s=Math.round((Date.now()-t0)/1000); samples.push(p);
          if(!p.playing) break;
        }
        D.capMinutes=DAY_CAP_MS/60000; D.realSeconds=Math.round((Date.now()-t0)/1000); D.samples=samples; D.end=samples.length?samples[samples.length-1]:null;
        D.endedAtTMax=await page.evaluate(()=>Math.abs(clock-T_MAX)<1e-6&&!playing);
        if((await st()).playing){ D.clockAtCap=await page.evaluate(()=>clock); await click("#play"); D.pausedAtCapByClick=!(await st()).playing; }
        await settle(60000);
        D.after=await R.snap(page,s,"after the day at 4x"); D.errors=errs();
      }catch(e){ D.error=String(e&&e.stack||e); }
      save(res); }

    if(want.includes("storm")){ const S=res.blocks.storm={};
      try{
        const SIZES=[[1600,900],[700,900],[390,844],[844,390]];
        const sig=()=>page.evaluate(()=>{
          const rect=sel=>{ const e=document.querySelector(sel); if(!e) return null; const cs=getComputedStyle(e); const r=e.getBoundingClientRect();
            return (cs.display==="none"||cs.visibility==="hidden"||e.hidden)?"hidden":[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)].join(","); };
          const sels=[".timebar",".rail",".dispatch","#maplayer","canvas",".legend","#viewmode","#play","#speedbtn",".speeds","#tb-cap","#layersbtn","#menubtn","#drawer","#phlist","#toast"];
          const o={}; sels.forEach(k=>o[k]=rect(k));
          const v=new THREE.Vector2(); renderer.getDrawingBufferSize(v);
          return {vp:[innerWidth,innerHeight],body:[...document.body.classList].sort().join(" "),rects:o,buffer:[v.x,v.y],pxRatio:renderer.getPixelRatio(),
            aspect:+landCam.aspect.toFixed(5),aspectWant:+(innerWidth/innerHeight).toFixed(5),phone:PHONE,
            fx:FX.on&&FX.rtScene?[FX.rtScene.width,FX.rtScene.height]:null, mlShown:Object.values(ML.items).filter(it=>it.el.style.display!=="none").length}; });
        const at=async(w,h)=>{ await page.setViewportSize({width:w,height:h}); await R.sleep(1500); await settle(60000); return sig(); };
        S.before=[]; for(const [w,h] of SIZES) S.before.push(await at(w,h));
        S.snapBefore=await R.snap(page,s,"before the storm"); const e0=errs(), w0=(page._log||[]).length;
        const gaps=[0,16,50,120]; const t0=Date.now();
        for(let i=0;i<100;i++){ const [w,h]=SIZES[i%4]; await page.setViewportSize({width:w,height:h}); await R.sleep(gaps[(i*7)%4]); }
        S.stormSeconds=+((Date.now()-t0)/1000).toFixed(1);
        await R.sleep(1500); S.settleAfterStorm=await settle(120000);
        S.atStormEnd=await sig();
        S.after=[]; for(const [w,h] of SIZES) S.after.push(await at(w,h));
        const diffs=[]; S.before.forEach((a,i)=>{ const c=S.after[i];
          const cmp=(x,y,k)=>{ if(JSON.stringify(x)!==JSON.stringify(y)) diffs.push({size:a.vp.join("x"),key:k,before:x,after:y}); };
          cmp(a.body,c.body,"body"); cmp(a.buffer,c.buffer,"buffer"); cmp(a.aspect,c.aspect,"aspect"); cmp(a.phone,c.phone,"phone"); cmp(a.fx,c.fx,"fx");
          Object.keys(a.rects).forEach(k=>cmp(a.rects[k],c.rects[k],k));
          if(Math.abs(c.aspect-c.aspectWant)>1e-4) diffs.push({size:c.vp.join("x"),key:"aspect vs viewport",before:c.aspectWant,after:c.aspect}); });
        S.diffs=diffs; S.errorsDuring=errs()-e0; S.logDuring=(page._log||[]).slice(w0).map(x=>x.type+": "+x.text.slice(0,160)).slice(0,30);
        S.snapAfter=await R.snap(page,s,"after the storm and the four sizes");
      }catch(e){ S.error=String(e&&e.stack||e); }
      save(res); }
    res.log=(page._log||[]).reduce((o,x)=>{ const k=x.type+": "+x.text.replace(/\d+/g,"#").slice(0,140); o[k]=(o[k]||0)+1; return o; },{});
    res.finished=new Date().toISOString(); save(res); console.log("done",OUT);
  }catch(e){ res.error=String(e&&e.stack||e); save(res); console.error(e); process.exitCode=1; }
  finally{ await b.close(); }
})();
