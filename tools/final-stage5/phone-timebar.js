#!/usr/bin/env node
/* The final audits' Stage 5, WP-08 (CL-MAP-04 on the narrowest phone): the phone timeline's rows on a build, at the five phone sizes of the harness's
   phone cases (360 x 800 Android; 390 x 844, 402 x 714, 430 x 932 and 844 x 390 iPhone; density 3, touch), after the first-run card is closed, at
   09:30: the timebar's height and each shown item of its top rows (left, top within the timebar, width). An optional third argument is CSS added to
   the page (a candidate fix tried before the stylesheet is changed).
   node tools/final-stage5/phone-timebar.js <repo-root> <build.html> ["css"]
   Measurement only; nothing is written to a source file. */
const path=require("path"), fs=require("fs"), ROOT=process.argv[2], html=path.resolve(process.argv[3]), extra=process.argv[4]||"";
const TR=require(path.join(ROOT,"tools","visual","three-route.js"));
const { chromium }=require("playwright");
const D={ios:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  android:"Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36"};
(async()=>{ const b=await chromium.launch({executablePath:process.env.AUSTERLITZ_CHROME, args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
  for(const [w,h,dv] of [[360,800,"android"],[390,844,"ios"],[402,714,"ios"],[430,932,"ios"],[844,390,"ios"]]){
    const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:D[dv]}); const p=await ctx.newPage();
    await TR.routeThree(p); await p.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(p,240000,250);
    if(extra) await p.addStyleTag({content:extra});
    const r=await p.evaluate(()=>{ AUSTERLITZ_DEBUG.settle(20); closeFirst(null); setClock(570,{instant:true,force:true,camera:false}); AUSTERLITZ_DEBUG.settle(10);
      const tb=document.querySelector("section.timebar"), row1=tb.querySelector(".tb-row")||tb; const R=tb.getBoundingClientRect();
      const top=tb.querySelector(".tb-top"); const row=[].filter.call(top.children,e=>{ const cs=getComputedStyle(e); return cs.display!=="none"&&e.getBoundingClientRect().width>0; })
        .map(e=>{ const r=e.getBoundingClientRect(); return (e.id||e.className.baseVal||e.className).toString().split(" ")[0]+"@"+Math.round(r.left)+","+Math.round(r.top-R.top)+" w"+Math.round(r.width); });
      return {h:Math.round(R.height), top:Math.round(R.top), items:row}; });
    console.log(w+"x"+h, "timebar", r.h, "px:", r.items.join("  ")); await ctx.close(); }
  await b.close(); })().catch(e=>{ console.error(e); process.exit(1); });
