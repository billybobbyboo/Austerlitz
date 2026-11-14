#!/usr/bin/env node
/* The closing re-verification pass: the audit's s1 check "speed-in-ease" (½× pressed in an ease in at 4×: the clock's step drops at once by
   the ratio and eases on into the hold, 8H) passed at the audit and fails on this build, where it read 40 frames after the press. Measured here
   whether that is a defect or the window: the same press (the audit's own driver, tools/audit-post8/interaction/ilib.js: the app's loop at 30
   frames a second on a clock of its own; 4× and ½× by real clicks), k = 1, 3, 6, 10 and 15 frames into the ease in before the 04:15 start, then
   600 frames traced: the step before and after the press, its ratio, whether every later step is no larger than the one before until the
   hold, whether the hold is reached, and after how many frames (0: the clock already held at the start when ½× was pressed). Nothing is
   changed.
   node tools/closing/ease-speed.js [--json out.json]   (AUSTERLITZ_HTML for another build) */
"use strict";
const fs=require("fs");
const I=require("../audit-post8/interaction/ilib.js");
const argv=process.argv.slice(2), OUT=argv.includes("--json")?argv[argv.indexOf("--json")+1]:null;
(async()=>{
  const b=await I.A.launch(), out={cases:[]};
  for(const k of [1,3,6,10,15]){
    const p=await I.openV(b,[1280,720],{harness:true});
    await p.keyboard.press("Escape");
    await I.clickEl(p,'.spd-btn[data-s="4"]');
    await p.evaluate(()=>{ setClock(240,{instant:true,force:true}); });
    await I.clickEl(p,"#play");
    const found=await I.until(p,"DWELL.st&&DWELL.st.stage==='in'",3000);
    const pre=await I.trace(p,k+1);
    await I.clickEl(p,'.spd-btn[data-s="0.5"]');
    const tr=await I.trace(p,600);
    const d0=pre[k][0]-pre[k-1][0], d1=tr[0][0]-pre[k][0];
    const holdAt=tr.findIndex(x=>x[1]==="hold"); let grows=0, back=0;
    for(let i=1;i<(holdAt>=0?holdAt:tr.length);i++){ const a=tr[i][0]-tr[i-1][0], c=i>1?tr[i-1][0]-tr[i-2][0]:d1; if(a>c+1e-9) grows++; if(a<-1e-9) back++; }
    const c={framesIntoEase:k,untilFound:found,stepBefore:+d0.toFixed(4),stepAfter:+d1.toFixed(4),ratio:+(d0/d1).toFixed(3),
      speedAfter:tr[0][2],holdReachedAfterFrames:holdAt,stepsGrowingBeforeHold:grows,backSteps:back,clockAtHold:holdAt>=0?tr[holdAt][0]:null};
    out.cases.push(c);
    console.log("pressed "+k+" frames into the ease in: step "+c.stepBefore+" -> "+c.stepAfter+" (ratio "+c.ratio+"), the hold after "+holdAt+
      " frames (clock "+c.clockAtHold+"), steps growing before it "+grows+", backward "+back);
    await p.context().close();
  }
  await b.close(); out.md5=require("crypto").createHash("md5").update(fs.readFileSync(process.env.AUSTERLITZ_HTML||require("path").join(I.ROOT,"austerlitz-command-map.html"))).digest("hex");
  console.log("build md5 "+out.md5);
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
})().catch(e=>{ console.error(e); process.exit(2); });
