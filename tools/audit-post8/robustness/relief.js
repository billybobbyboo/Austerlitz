/* Final audit after Stage 8, area "robustness": 12 relief switches on a visitor's page, the heap and the counts before and after (measurement only).
   node tools/audit-post8/robustness/relief.js  ->  docs/audit-post8-evidence/robustness/relief.json
   visitor.js's growth block clicked the relief buttons at their boxes' centres at once after opening the Layers panel (its box read while
   the panel's transition ran), and the factor never changed (visitor-growth-storm.json reliefSeen: 4 every time): a fault of that script, not of the app. Here, the same visitor's page (no
   ?harness=1, CSS transitions kept, 1366 x 768, density 1; the first-run card closed by a real Escape), then twelve switches 1x, 10.33x, 4x in
   turn: the Layers panel opened by a real click on #layersbtn when closed, the button's box read until it stands still (the panel's
   transition over; scrolled into view by element.scrollIntoView only if outside the viewport: set-up, not input), the point under its centre checked to be that button (elementFromPoint), a real mouse click
   there, the page settled; the factor read after each. The heap forced through two garbage collections and CDP Performance.getMetrics with the
   page's own counts (rlib.js snap) before, after the first full round (3 switches) and after all twelve. */
"use strict";
const stableBox=async(page,sel)=>{ /* the button brought into view by element.scrollIntoView (set-up) only if outside the viewport, then its box read until two reads 300 ms apart agree (the panel's transition over) */
  let prev=null; for(let k=0;k<40;k++){ const bb=await page.locator(sel).first().boundingBox(); if(bb&&(bb.y<0||bb.y+bb.height>page.viewportSize().height)) await page.locator(sel).first().evaluate(e=>e.scrollIntoView({block:"center"}));
    const b2=await page.locator(sel).first().boundingBox(); if(b2&&prev&&Math.abs(b2.x-prev.x)<0.5&&Math.abs(b2.y-prev.y)<0.5) return b2; prev=b2; await new Promise(r=>setTimeout(r,300)); } return prev; };
const path=require("path");
const R=require("./rlib.js"), A=R.A;
const OUT=path.join(A.EVID,"robustness","relief.json"), save=R.writer(OUT);
(async()=>{
  const res={what:"12 relief switches by real clicks, a visitor's page",started:new Date().toISOString(),switches:[]};
  const b=await A.launch();
  try{
    const page=await A.open(b,[1366,768],{harness:false,transitions:true});
    await R.install(page); const s=await R.cdp(page);
    const settle=cap=>page.evaluate(c=>__rb.settle(500,c,true),cap||90000);
    res.firstRunAtLoad=(await A.state(page)).firstRun; await page.keyboard.press("Escape"); res.firstRunAfterEsc=(await A.state(page)).firstRun;
    res.settleBoot=await settle(180000);
    res.before=await R.snap(page,s,"before the relief switches"); save(res);
    const settings=await page.evaluate(()=>DISPLAY.settings.slice()); res.settings=settings;
    const seq=[1,settings[settings.length-1],4];
    for(let i=0;i<12;i++){
      const x=seq[i%3], rec={i,want:x};
      if(await page.evaluate(()=>document.getElementById("layerpop").hidden)){ const lb=await page.locator("#layersbtn").boundingBox(); await page.mouse.click(lb.x+lb.width/2,lb.y+lb.height/2); await R.sleep(600); }
      const loc=page.locator('.exag-btn[data-x="'+x+'"]'); const bb=await stableBox(page,'.exag-btn[data-x="'+x+'"]'); rec.box=bb?[Math.round(bb.x),Math.round(bb.y),Math.round(bb.width),Math.round(bb.height)]:null;
      rec.hit=bb?await page.evaluate(([cx,cy,x])=>{ const e=document.elementFromPoint(cx,cy); return !!(e&&e.closest&&e.closest('.exag-btn[data-x="'+x+'"]')); },[bb.x+bb.width/2,bb.y+bb.height/2,x]):false;
      rec.disabled=await loc.evaluate(e=>e.disabled);
      const t0=Date.now(); if(bb) await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);
      rec.settleMs=await settle(120000); rec.wallMs=Date.now()-t0;
      rec.factor=(await A.state(page)).factor; rec.pressed=await loc.getAttribute("aria-pressed"); res.switches.push(rec); save(res);
      if(i===2){ res.afterRound1=await R.snap(page,s,"after the first round of three"); save(res); }
    }
    if(!(await page.evaluate(()=>document.getElementById("layerpop").hidden))){ await page.keyboard.press("Escape"); await settle(30000); }
    res.after=await R.snap(page,s,"after 12 relief switches");
    res.ok=res.switches.filter(r=>Math.abs(r.factor-r.want)<1e-9).length;
    res.log=(page._log||[]).reduce((o,x)=>{ const k=x.type+": "+x.text.replace(/\d+/g,"#").slice(0,140); o[k]=(o[k]||0)+1; return o; },{});
  }catch(e){ res.error=String(e&&e.stack||e); process.exitCode=1; }
  finally{ await b.close(); res.finished=new Date().toISOString(); save(res); console.log("done",OUT); }
})();
