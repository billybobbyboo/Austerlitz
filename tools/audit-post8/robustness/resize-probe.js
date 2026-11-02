/* Final audit after Stage 8, area "robustness": the 3D view after particular window resizes (measurement only).
   node tools/audit-post8/robustness/resize-probe.js  ->  docs/audit-post8-evidence/robustness/resize-probe.json (+ resize-probe-*.jpg)
   visitor-growth-storm.json's storm block found, at 390 x 844 reached from 700 x 900 (before and after the storm alike), the drawing buffer
   700 x 900 and the camera's aspect 0.7778 while the window was 390 x 844 (0.4621): onResize (app.js:7104-7118) the only writer of both.
   Here, a visitor's page (no ?harness=1, CSS transitions kept, density 1, the first-run card closed by a real Escape), a listener of the
   probe's own on window "resize" (capture, added after boot: it records innerWidth x innerHeight at each event), then a sequence of
   setViewportSize calls (Playwright: the window resized), each followed by 1.5 s and the page settled: the resize events seen, the window, the
   renderer's drawing buffer, the canvas's CSS box, the camera's aspect, the phone layout flag; a JPEG of the window where the buffer and the
   window disagree. Sequences: 1600x900 -> 700x900 -> 390x844 (the storm's), 390x844 -> 844x390 -> 390x844 (a phone turned twice),
   1600x900 -> 390x844 (direct), 700x900 -> 400x844 -> 390x844. */
"use strict";
const path=require("path"), fs=require("fs");
const R=require("./rlib.js"), A=R.A;
const OUT=path.join(A.EVID,"robustness","resize-probe.json"), save=R.writer(OUT);
(async()=>{
  const res={what:"the renderer and camera after window resizes, a visitor's page",started:new Date().toISOString(),steps:[]};
  const b=await A.launch();
  try{
    const page=await A.open(b,[1600,900],{harness:false,transitions:true});
    await R.install(page);
    const settle=cap=>page.evaluate(c=>__rb.settle(500,c,true),cap||60000);
    await page.keyboard.press("Escape"); res.settleBoot=await settle(180000);
    await page.evaluate(()=>{ window.__rz=[]; window.addEventListener("resize",()=>window.__rz.push([innerWidth,innerHeight]),true); });
    const read=()=>page.evaluate(()=>{ const v=new THREE.Vector2(); renderer.getDrawingBufferSize(v); const c=renderer.domElement.getBoundingClientRect();
      const ev=window.__rz.splice(0);
      return {win:[innerWidth,innerHeight],buffer:[v.x,v.y],canvasCss:[Math.round(c.width),Math.round(c.height)],aspect:+landCam.aspect.toFixed(4),aspectWant:+(innerWidth/innerHeight).toFixed(4),phone:PHONE,resizeEvents:ev}; });
    const SEQ=[[1600,900],[700,900],[390,844],[844,390],[390,844],[1600,900],[390,844],[700,900],[400,844],[390,844]];
    for(let i=0;i<SEQ.length;i++){
      const [w,h]=SEQ[i]; await page.setViewportSize({width:w,height:h}); await R.sleep(1500); const st=await settle(60000);
      const r=await read(); r.step=i; r.to=w+"x"+h; r.settleMs=st; r.agree=r.buffer[0]===w&&r.buffer[1]===h&&Math.abs(r.aspect-r.aspectWant)<1e-3;
      if(!r.agree){ const f="resize-probe-"+i+"-"+w+"x"+h+".jpg"; await page.screenshot({path:path.join(A.EVID,"robustness",f),type:"jpeg",quality:60}); r.shot=f; }
      res.steps.push(r); save(res);
    }
    res.log=(page._log||[]).reduce((o,x)=>{ const k=x.type+": "+x.text.replace(/\d+/g,"#").slice(0,140); o[k]=(o[k]||0)+1; return o; },{});
  }catch(e){ res.error=String(e&&e.stack||e); process.exitCode=1; }
  finally{ await b.close(); res.finished=new Date().toISOString(); save(res); console.log("done",OUT); }
})();
