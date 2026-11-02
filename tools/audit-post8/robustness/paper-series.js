/* Final audit after Stage 8, area "robustness": the paper map and the landscape switched ten times, counted after every switch (measurement only).
   node tools/audit-post8/robustness/paper-series.js  ->  docs/audit-post8-evidence/robustness/paper-series.json
   visitor-growth-storm.json measured only before and after its ten switches (the heap +0.95 MB, CDP listeners 393 to 449, nodes 1726 to 2034,
   geometries 379 to 414, programs 35 to 42, the map layer's items 31 to 45): growth, or the state the first visit leaves? Here, a visitor's
   page (no ?harness=1, CSS transitions kept, 1366 x 768, density 1; the first-run card closed by a real Escape), the Layers panel opened by a
   real click on #layersbtn, then ten switches by real clicks on the ground buttons (.mode-btn data-m staff, then terrain, in turn), each
   button's box read until it stands still (set-up) and the page settled; after every switch the counts (rlib.js inpage: three's memory and
   programs, the dispose listeners, DOM elements, the map layer's items) and CDP Performance.getMetrics; after switches 2, 4, 6, 8 and 10 (each
   back on the landscape) also with the heap forced through two garbage collections first. Growth would show as rising values at 2, 4, ... 10. */
"use strict";
const stableBox=async(page,sel)=>{ /* the button brought into view by element.scrollIntoView (set-up) only if outside the viewport, then its box read until two reads 300 ms apart agree (the panel's transition over) */
  let prev=null; for(let k=0;k<40;k++){ const bb=await page.locator(sel).first().boundingBox(); if(bb&&(bb.y<0||bb.y+bb.height>page.viewportSize().height)) await page.locator(sel).first().evaluate(e=>e.scrollIntoView({block:"center"}));
    const b2=await page.locator(sel).first().boundingBox(); if(b2&&prev&&Math.abs(b2.x-prev.x)<0.5&&Math.abs(b2.y-prev.y)<0.5) return b2; prev=b2; await new Promise(r=>setTimeout(r,300)); } return prev; };
const path=require("path");
const R=require("./rlib.js"), A=R.A;
const OUT=path.join(A.EVID,"robustness","paper-series.json"), save=R.writer(OUT);
(async()=>{
  const res={what:"10 paper map / landscape switches by real clicks, counted after each",started:new Date().toISOString(),series:[]};
  const b=await A.launch();
  try{
    const page=await A.open(b,[1366,768],{harness:false,transitions:true});
    await R.install(page); const s=await R.cdp(page);
    const settle=cap=>page.evaluate(c=>__rb.settle(500,c,true),cap||90000);
    await page.keyboard.press("Escape"); res.settleBoot=await settle(180000);
    res.before=await R.snap(page,s,"before"); save(res);
    for(let i=0;i<10;i++){
      const m=i%2===0?"staff":"terrain";
      if(await page.evaluate(()=>document.getElementById("layerpop").hidden)){ const lb=await page.locator("#layersbtn").boundingBox(); await page.mouse.click(lb.x+lb.width/2,lb.y+lb.height/2); await R.sleep(600); }
      const bb=await stableBox(page,'.mode-btn[data-m="'+m+'"]');
      await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); const st=await settle(120000);
      const rec=(i%2===1)?await R.snap(page,s,"after switch "+(i+1)+" (landscape)"):await R.snap(page,s,"after switch "+(i+1)+" (paper map)",{gc:false});
      rec.settleMs=st; rec.mode=(await A.state(page)).mode; res.series.push(rec); save(res);
    }
    res.log=(page._log||[]).reduce((o,x)=>{ const k=x.type+": "+x.text.replace(/\d+/g,"#").slice(0,140); o[k]=(o[k]||0)+1; return o; },{});
  }catch(e){ res.error=String(e&&e.stack||e); process.exitCode=1; }
  finally{ await b.close(); res.finished=new Date().toISOString(); save(res); console.log("done",OUT); }
})();
