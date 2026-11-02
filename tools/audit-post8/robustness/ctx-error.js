/* Final audit after Stage 8, area "robustness": the page error seen when the graphics context is lost while the clock plays (measurement only).
   node tools/audit-post8/robustness/ctx-error.js  ->  docs/audit-post8-evidence/robustness/ctx-error.json
   ctx-cycles.js saw two uncaught "Cannot read properties of null (reading 'trim')" page errors, only in the cycles run while playing. Here: one
   harness page (1366 x 768), the first-run card closed by a real Escape, Play by a real click on #play, then three cycles of
   loseContext(), 1 s, restoreContext(), frames awaited; every page error kept with its stack, and the frames, the clock and the notice after each.
   A fourth cycle with the clock paused (the page idle) as the control. */
"use strict";
const path=require("path");
const R=require("./rlib.js"), A=R.A;
const OUT=path.join(A.EVID,"robustness","ctx-error.json"), save=R.writer(OUT);
(async()=>{
  const res={what:"page errors on a context loss while playing",started:new Date().toISOString(),cycles:[],errors:[]};
  const b=await A.launch();
  try{
    const page=await A.open(b,[1366,768]);
    page.on("pageerror",e=>res.errors.push({at:new Date().toISOString(),message:String(e.message),stack:String(e.stack||"").split("\n").slice(0,8).join("\n")}));
    await R.install(page);
    if((await A.state(page)).firstRun) await page.keyboard.press("Escape");
    await page.evaluate(()=>__rb.settle(500,180000));
    const playBtn=async()=>{ const bb=await page.locator("#play").boundingBox(); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); };
    const cycle=async(label,pl)=>{
      const e0=res.errors.length;
      if(pl&&!(await A.state(page)).playing){ await playBtn(); await R.sleep(3000); }
      const r=await page.evaluate(async()=>{ const ext=renderer.getContext().getExtension("WEBGL_lose_context");
        const f0=DEV.frames, c0=clock; ext.loseContext(); await __rb.sleep(1000);
        const during={lostFlag:GL.lost,isContextLost:renderer.getContext().isContextLost(),framesAfterLossCall:DEV.frames-f0,clockAdvanced:+(clock-c0).toFixed(3)};
        const f1=DEV.frames; ext.restoreContext(); const t=performance.now(); while(DEV.frames===f1&&performance.now()-t<180000) await __rb.sleep(100);
        const first=Math.round(performance.now()-t); const f2=DEV.frames, c2=clock; await __rb.sleep(5000);
        return {during,firstFrameAfterRestoreMs:first,framesIn5s:DEV.frames-f2,clockIn5s:+(clock-c2).toFixed(3),playing:playing,notice:document.getElementById("glnotice").textContent,lost:GL.lost}; });
      r.label=label; r.newPageErrors=res.errors.length-e0; res.cycles.push(r); save(res); };
    for(let i=0;i<3;i++) await cycle("playing "+(i+1),true);
    if((await A.state(page)).playing) await playBtn();
    await page.evaluate(()=>__rb.settle(500,180000));
    await cycle("paused (control)",false);
    res.finished=new Date().toISOString(); save(res); console.log("done",OUT);
  }catch(e){ res.error=String(e&&e.stack||e); save(res); console.error(e); process.exitCode=1; }
  finally{ await b.close(); }
})();
