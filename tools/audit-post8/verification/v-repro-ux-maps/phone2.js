#!/usr/bin/env node
/* Final audit after Stage 8, verification v-repro-ux-maps: V-M1's remedy remark ("scrubbing works ... from the rail's bottom 4 px"), checked
   at a point verified to reach the rail. Same page as phone.js (A.openPhone 390 x 844, visitor page, "Explore on my own" by a real tap, the
   clock set to 09:30 by setClock: set-up). What document.elementFromPoint gives at phone.js's foot point (121.5, 840), then a real CDP touch
   drag (60 px right) from a point 4 px above the foot that reaches the rail directly below a marker's hit area on the middle line.
   node tools/audit-post8/verification/v-repro-ux-maps/phone2.js -> docs/audit-post8-evidence/verification/v-repro-ux-maps/phone2.json */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../../lib.js");
const OUT=path.join(A.EVID,"verification","v-repro-ux-maps");
const R={build:"austerlitz-command-map.html md5 f10fe585c46aea576f436ed51ac46f83",steps:[]};
const save=()=>fs.writeFileSync(path.join(OUT,"phone2.json"),JSON.stringify(R,null,1));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const ST=()=>({clock:+clock.toFixed(2),clockText:fmtClock(clock),selection:selection?selection.kind+":"+selection.id:null,drawerOpen:document.body.classList.contains("drawer-open")});
(async()=>{
  const t0=Date.now(), b=await A.launch(); let page;
  try{
    page=await A.openPhone(b,[390,844],{harness:false,transitions:true});
    await page.waitForSelector("#fr-close",{state:"visible",timeout:120000}); await page.tap("#fr-close",{timeout:180000}); await wait(1500);
    await page.evaluate(()=>{ setClock(570,{instant:true,force:true}); AUSTERLITZ_DEBUG.settle(20); }); await wait(800);
    const probe=await page.evaluate(()=>{ var r=document.getElementById("timerail").getBoundingClientRect(), mid=r.top+r.height/2, foot=r.top+r.height-4;
      function what(x,y){ var e=document.elementFromPoint(x,y), m=e&&e.closest?e.closest(".ev-mark"):null; return m?"marker: "+String(m.getAttribute("aria-label")).slice(0,60):(e&&e.closest&&e.closest("#timerail")?"rail":(e?(e.id||e.className||e.tagName):null)); }
      var at=what(121.5,foot), pick=null;
      for(var x=Math.ceil(r.left+r.width*0.3);x<r.right-70;x++){ var a=what(x+0.5,mid), c=what(x+0.5,foot); if(/^marker/.test(a)&&c==="rail"){ pick={x:x+0.5,middle:a,foot:c}; break; } }
      return {rail:[r.left,r.top,r.width,r.height],mid:mid,foot:foot,atPhoneJsFootPoint:at,pick:pick}; });
    R.steps.push({what:"elementFromPoint at phone.js's foot point and a point whose foot reaches the rail under a marker's middle-line hit area",probe}); save();
    if(probe.pick){ const cdp=await page.context().newCDPSession(page);
      const s0=await page.evaluate(ST);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:probe.pick.x,y:probe.foot}]});
      for(let i=1;i<=10;i++){ await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:probe.pick.x+6*i,y:probe.foot}]}); await wait(40); }
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]}); await wait(700);
      const s1=await page.evaluate(ST);
      R.steps.push({what:"real touch drag 60 px right from ("+probe.pick.x+", "+probe.foot+"), 4 px above the rail's foot",before:s0,after:s1}); }
    R.errors=A.errors(page);
  }catch(e){ R.steps.push({what:"FAILED",err:String(e.stack||e).slice(0,600)}); }
  finally{ R.seconds=Math.round((Date.now()-t0)/1000); save(); await b.close().catch(()=>{}); console.log("phone2 done",R.seconds); }
})();
