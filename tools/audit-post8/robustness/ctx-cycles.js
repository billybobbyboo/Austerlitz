/* Final audit after Stage 8, area "robustness": the graphics context lost and restored repeatedly (measurement only).
   node tools/audit-post8/robustness/ctx-cycles.js  ->  docs/audit-post8-evidence/robustness/ctx-cycles.json
   One harness page (?harness=1, 1366 x 768, density 1; deterministic: no drift), the first-run card closed by a real Escape. Then:
   a control clock step before any loss (setClock(PHASES[3].t0,{force:true}), the step boot-check.js's context-loss case takes after its restore);
   five cycles with the page idle and three while the clock plays (Play pressed by a real click on #play): WEBGL_lose_context.loseContext(),
   400 ms, the notice and the frames while lost, restoreContext(), the time to the first frame drawn, the page settled; after each, the heap
   forced through garbage collection and the counts (rlib.js snap). After the cycles a clock step (PHASES[5].t0) and a second (PHASES[2].t0), each
   counting three r128's "does not belong to this context" warnings (check:contrast holds one restore's step at CTX_DELETES 248). */
"use strict";
const path=require("path");
const R=require("./rlib.js"), A=R.A;
const OUT=path.join(A.EVID,"robustness","ctx-cycles.json"), save=R.writer(OUT);
const BELONG=/does not belong to this context/;
(async()=>{
  const res={what:"context lost and restored: 5 idle, 3 playing; harness page 1366x768",started:new Date().toISOString(),build:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",steps:[]};
  const b=await A.launch();
  try{
    const page=await A.open(b,[1366,768]);
    await R.install(page); const s=await R.cdp(page);
    const st0=await A.state(page);
    if(st0.firstRun){ await page.keyboard.press("Escape"); }
    res.firstRunClosed=!(await A.state(page)).firstRun;
    res.settleBoot=await page.evaluate(()=>__rb.settle(500,180000));
    const nBelong=()=>(page._log||[]).filter(x=>BELONG.test(x.text)).length;
    const nWarn=()=>(page._log||[]).length;
    res.steps.push(await R.snap(page,s,"boot")); save(res);
    /* the control: a clock step with the original context */
    const stepClock=async(ph,label)=>{ const w0=nBelong(), a0=nWarn();
      const r=await page.evaluate(async(ph)=>{ const f0=DEV.frames, t1=performance.now(); setClock(PHASES[ph].t0,{force:true}); await __rb.sleep(300);
        while(DEV.frames===f0&&performance.now()-t1<180000) await __rb.sleep(100);
        const first=Math.round(performance.now()-t1); const settled=await __rb.settle(500,180000); return {phase:ph,clock:clock,firstFrameMs:first,settledMs:settled,frames:DEV.frames-f0}; },ph);
      r.belongWarnings=nBelong()-w0; r.allWarnings=nWarn()-a0; const sn=await R.snap(page,s,label); sn.step=r; res.steps.push(sn); save(res); return r; };
    await stepClock(3,"control clock step (no loss yet)");
    const cycle=async(i,playingCycle)=>{
      const w0=nBelong(), a0=nWarn();
      const r=await page.evaluate(async(pl)=>{
        const ext=renderer.getContext().getExtension("WEBGL_lose_context"); if(!ext) return {noExt:true};
        const c0=clock, f0=DEV.frames, t0=performance.now();
        ext.loseContext(); await __rb.sleep(400);
        const n=document.getElementById("glnotice"), f1=DEV.frames; await __rb.sleep(600);
        const lost={lost:GL.lost,notice:(n&&n.textContent||"").slice(0,60),button:!!(n&&n.querySelector("button")),framesWhileLost:DEV.frames-f1,clockWhileLost:+(clock-c0).toFixed(3)};
        const f2=DEV.frames, c2=clock, t2=performance.now(); ext.restoreContext(); await __rb.sleep(300);
        while(DEV.frames===f2&&performance.now()-t2<180000) await __rb.sleep(100);
        const first=Math.round(performance.now()-t2);
        let after;
        if(pl){ const f3=DEV.frames, c3=clock; await __rb.sleep(4000); after={playing:playing,framesIn4s:DEV.frames-f3,clockAdvancedIn4s:+(clock-c3).toFixed(2)}; }
        else { const settled=await __rb.settle(500,180000); after={settledMs:settled}; }
        return {lost,firstFrameAfterRestoreMs:first,after,noticeAfter:(n&&n.textContent||""),lostAfter:GL.lost,clock:clock}; },playingCycle);
      r.belongWarnings=nBelong()-w0; r.allWarnings=nWarn()-a0;
      const sn=await R.snap(page,s,(playingCycle?"playing":"idle")+" cycle "+(i+1)); sn.cycle=r; res.steps.push(sn); save(res); return r; };
    for(let i=0;i<5;i++) await cycle(i,false);
    /* three while playing: Play by a real click (the clock first put back at the day's start if fewer than 300 clock minutes remain: set-up) */
    for(let i=0;i<3;i++){
      const st=await A.state(page);
      if(!st.playing){
        const near=await page.evaluate(()=>T_MAX-clock<300); if(near) await page.evaluate(()=>{ setClock(T_MIN,{force:true}); });
        const bb=await page.locator("#play").boundingBox(); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);
        await R.sleep(2500);
      }
      const st2=await A.state(page); res["playingBeforeCycle"+(i+6)]=st2.playing;
      await cycle(i,true);
    }
    if((await A.state(page)).playing){ const bb=await page.locator("#play").boundingBox(); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); }
    res.settleAfterPause=await page.evaluate(()=>__rb.settle(500,180000));
    res.steps.push(await R.snap(page,s,"paused after the cycles")); save(res);
    await stepClock(5,"clock step 1 after 8 restores");
    await stepClock(2,"clock step 2 after 8 restores");
    res.log=(page._log||[]).reduce((o,x)=>{ const k=x.type+": "+x.text.replace(/\d+/g,"#").slice(0,140); o[k]=(o[k]||0)+1; return o; },{});
    res.finished=new Date().toISOString(); save(res);
    console.log("done",OUT);
  }catch(e){ res.error=String(e&&e.stack||e); save(res); console.error(e); process.exitCode=1; }
  finally{ await b.close(); }
})();
