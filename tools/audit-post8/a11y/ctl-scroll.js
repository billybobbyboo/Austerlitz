#!/usr/bin/env node
/* Final audit after Stage 8, area a11y: a CONTROL for keyboard scrolling in this browser. A plain page with the sources sheet's structure
   (a fixed overlay, a .sheet scroller with max-height 82vh and overflow-y auto, a close button, a long tabindex=0 region inside, no script
   handling keys): Tab to the region, then PageDown, ArrowDown, Space, End by real keys; the scroller's scrollTop after each (polled 3 s).
   It separates the browser's own behaviour from the app's. node tools/audit-post8/a11y/ctl-scroll.js tools/audit-post8/a11y/ctl-scroll.html */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../lib.js");
(async()=>{
  const b=await A.launch(); const page=await b.newPage({viewport:{width:1280,height:720}});
  await page.goto("file://"+path.resolve(process.argv[2]));
  await page.keyboard.press("Tab"); await new Promise(r=>setTimeout(r,200));
  const out={focus:await page.evaluate(()=>document.activeElement.id),keys:[]};
  for(const k of ["PageDown","ArrowDown","Space","End"]){ const b0=await page.evaluate(()=>document.querySelector(".sheet").scrollTop); await page.keyboard.press(k);
    let a=b0; for(let i=0;i<10&&a===b0;i++){ await new Promise(r=>setTimeout(r,300)); a=await page.evaluate(()=>document.querySelector(".sheet").scrollTop); } out.keys.push({key:k,before:b0,after:a}); }
  await b.close();
  const f=path.join(A.EVID,"a11y","ctl-scroll.json"); fs.writeFileSync(f,JSON.stringify(out,null,1)); console.log(JSON.stringify(out));
})().catch(e=>{ console.error(e); process.exit(1); });
