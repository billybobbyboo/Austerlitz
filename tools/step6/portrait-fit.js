#!/usr/bin/env node
/* Roadmap step 6 item 3 Part B (docs/STEP6_SPEC.md section 4.4; decision 223): the design value PORTRAIT_FIT.t (app.js), measured. On a phone
   held upright the presets are moved back along their line of sight until the free rectangle spans the horizontal angle whose half's tangent
   is t (at most kMax times as far). Per t, at every phase's start (the phase's view, as setClock frames it after "Explore on my own"), the
   map layer's items placed and those wholly inside the free rectangle (tools/visual/phone-measure.js framing()), the items dropped, and the
   eye's factor; t=0 is no reframing (Part A's state). The phone's page as the harness opens a phone case (density 3, touch, a phone's agent).
   node tools/step6/portrait-fit.js [--only 390x844,...] [--t 0,0.45,0.6,0.75,0.9] [--json out.json] [--shots dir]
   Measurement only: PORTRAIT_FIT is set on the live page and nothing is written to a source file. Never run it beside check:visual. */
const fs=require("fs"), path=require("path");
const { chromium } = require("playwright");
const TR=require("../visual/three-route.js");
const ROOT=path.join(__dirname,"..","..");
const MEASURE=fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8"), PH=fs.readFileSync(path.join(ROOT,"tools","visual","phone-measure.js"),"utf8");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const IOS="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const AND="Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36";
const DEVICES=[{key:"390x844",vp:[390,844],ua:IOS},{key:"360x800",vp:[360,800],ua:AND},{key:"430x932",vp:[430,932],ua:IOS}]
  .filter(d=>!opt("--only")||opt("--only").split(",").includes(d.key));
const TS=(opt("--t")||"0,0.45,0.6,0.75,0.9").split(",").map(Number), OUT=opt("--json"), SHOTS=opt("--shots");
(async()=>{
  const browser=await chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  if(SHOTS) fs.mkdirSync(SHOTS,{recursive:true});
  const res={note:"per phone size and t: at each phase's start, the map layer's items placed, inside the free rectangle, dropped; the eye's factor (software WebGL; layout and counts only)",sizes:{}};
  for(const d of DEVICES){
    const ctx=await browser.newContext({viewport:{width:d.vp[0],height:d.vp[1]},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:d.ua}), page=await ctx.newPage();
    const errs=[]; page.on("pageerror",e=>errs.push(e.message));
    await TR.routeThree(page);
    await page.goto("file://"+path.join(ROOT,"austerlitz-command-map.html")+"?harness=1",{waitUntil:"commit",timeout:180000});
    await TR.waitBoot(page,240000,500);
    await page.evaluate(MEASURE); await page.evaluate(PH);
    await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
    await page.tap("#fr-close",{timeout:180000});
    const S=res.sizes[d.key]={};
    for(const t of TS){
      const rows=[];
      for(let ph=1;ph<=8;ph++){
        const r=await page.evaluate(([t,ph])=>{ PORTRAIT_FIT.t=t; setClock(PHASES[ph].t0+1,{instant:true,force:true}); AUSTERLITZ_DEBUG.settle(60); mlLayout();
          const F=window.__ph.framing(); return {ph:ph,k:+portraitK().toFixed(3),placed:F.placed,inFree:F.inFree,dropped:ML.stats.dropped}; },[t,ph]);
        await page.waitForTimeout(200);
        rows.push(r);
        if(SHOTS&&(ph===3||ph===5)) fs.writeFileSync(path.join(SHOTS,"fit-"+d.key+"-t"+t+"-ph"+ph+".png"),await page.screenshot({timeout:180000,scale:"css"}));
      }
      const sum=k=>rows.reduce((a,r)=>a+r[k],0);
      S[t]={rows:rows,inFree:sum("inFree"),placed:sum("placed"),dropped:sum("dropped"),minInFree:Math.min(...rows.map(r=>r.inFree)),k:rows[0].k};
      console.log(d.key,"t",String(t).padEnd(5),"factor",S[t].k,"| in the free area",S[t].inFree,"of",S[t].placed,"placed (min a phase",S[t].minInFree+"), dropped",S[t].dropped,
        "| by phase",rows.map(r=>r.inFree+"/"+r.placed).join(" "));
    }
    if(errs.length) console.log(d.key,"page errors:",errs.slice(0,3).join(" | "));
    await ctx.close();
  }
  await browser.close();
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
