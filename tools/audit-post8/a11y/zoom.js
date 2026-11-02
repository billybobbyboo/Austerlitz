#!/usr/bin/env node
/* Final audit after Stage 8, area a11y: ZOOM AND REFLOW (WCAG 1.4.4, 1.4.10) on a visitor's page, desktop (no touch, no phone user agent).
   A browser zoomed to 200% on a 1600 x 900 screen lays the page out at 800 x 450 CSS px at device scale 2; at 400%, 400 x 225 at 4; WCAG's
   reflow width, 320 CSS px (here 320 x 256 at 4: a 1280 x 1024 screen at 400%). Each: the first screen, the card's reach, Esc, the screen
   then (what is cut, what lies beyond the viewport, overlapping panels, scrolling), the "?" overlay, the sources sheet, a dossier.
   Also 1280 x 720 at 1 (a laptop, unzoomed: the first screen and the same steps). node tools/audit-post8/a11y/zoom.js [1280x720@1,800x450@2,400x225@4,320x256@4] */
"use strict";
const L=require("./alib.js");
const CASES=(process.argv[2]||"1280x720@1,800x450@2,400x225@4,320x256@4").split(",").map(s=>{ const m=/^(\d+)x(\d+)@(\d+)$/.exec(s); return {w:+m[1],h:+m[2],dsf:+m[3],name:s.replace("@","-at")}; });
L.run("zoom",async(b,R,log)=>{
  for(const c of CASES){
    let p;
    try{
      p=await L.openV(b,[c.w,c.h],{dsf:c.dsf});
      await L.wait(2500);
      const meas=async()=>({scroll:await L.P(p,()=>__a11y.scroll()),cut:await L.P(p,()=>__a11y.cut()),panels:await L.P(p,()=>__a11y.panels()),
        targets:await L.P(p,()=>{ const t=__a11y.targets(); return {n:t.n,fail:t.fail,small:t.small.filter(x=>x.spacing!=="passes").slice(0,30)}; }),
        narr:await L.P(p,()=>__a11y.narr()), small:await L.P(p,()=>__a11y.small()), caption:await L.P(p,()=>{ const c=document.getElementById("tb-cap"); return c?{text:c.innerText.replace(/\s+/g," ").trim(),title:c.title,sw:c.scrollWidth,cw:c.clientWidth}:null; })});
      const reach=()=>L.P(p,()=>["#play","#timerail","#helpbtn","#menubtn","#panelsbtn","#layersbtn","#tourbtn","#openingbtn","#srcbtn","#eyesbtn","#follow","#speedbtn",".vm-btn","#lg-toggle","#dgrip","#fr-tour","#fr-close","#restore"].map(s=>{ const e=document.querySelector(s); if(!e) return s+": absent"; const r=e.getBoundingClientRect(); const v=__a11y.vis(e); const on=r.right>0&&r.bottom>0&&r.left<innerWidth&&r.top<innerHeight; const full=r.left>=-0.5&&r.top>=-0.5&&r.right<=innerWidth+0.5&&r.bottom<=innerHeight+0.5; const cv=v&&on?__a11y.covered(e):null; return s+": "+(v?(full?"on screen":(on?"PARTLY off screen":"OFF screen")):"not shown")+(cv&&cv.how==="hit"&&cv.tot&&cv.hit<cv.tot?" (covered at "+(cv.tot-cv.hit)+"/"+cv.tot+" points by "+cv.by.join(",")+")":"")+" "+[r.left,r.top,r.width,r.height].map(Math.round).join(","); }));
      await R.shot(p,c.name+"-1-first");
      R.step(c.name+": first screen (the card)",Object.assign({boot:p._bootMs,phone:(await L.A.state(p)).phone,card:await L.P(p,()=>{ const e=document.getElementById("firstrun"); const r=e.getBoundingClientRect(); return {box:[r.left,r.top,r.width,r.height].map(Math.round),sh:e.scrollHeight,ch:e.clientHeight,overflowY:getComputedStyle(e).overflowY}; }),reach:await reach()},await meas()));
      await p.keyboard.press("Escape"); await L.wait(2000);
      await R.shot(p,c.name+"-2-explore");
      R.step(c.name+": Esc (real key), the screen to explore",Object.assign({fi:await L.P(p,()=>__a11y.fi()),reach:await reach(),timebar:await L.P(p,()=>{ const t=document.querySelector(".timebar").getBoundingClientRect(); return {top:Math.round(t.top),h:Math.round(t.height),frac:+(t.height/innerHeight).toFixed(2)}; }),
        unobstructed:await L.P(p,()=>{ try{ return window.__aus.unobstructed?window.__aus.unobstructed():null; }catch(e){ return String(e.message); } })},await meas()));
      /* the "?" overlay by real key */
      await p.keyboard.press("?"); await L.wait(1500);
      await R.shot(p,c.name+"-3-help");
      R.step(c.name+": '?' (real key): the overlay",{fi:await L.P(p,()=>__a11y.fi()),sheet:await L.P(p,()=>{ const s=document.querySelector("#help .sheet"), bd=document.getElementById("help-body"); const r=s.getBoundingClientRect(), q=bd.getBoundingClientRect();
        return {box:[r.left,r.top,r.width,r.height].map(Math.round),body:[q.left,q.top,q.width,q.height].map(Math.round),bodySH:bd.scrollHeight,bodyCH:bd.clientHeight,overflowY:getComputedStyle(bd).overflowY,sheetSH:s.scrollHeight,sheetCH:s.clientHeight,sheetOY:getComputedStyle(s).overflowY}; }),
        cut:await L.P(p,()=>__a11y.cut())});
      await p.keyboard.press("Escape"); await L.wait(800);
      /* the sources sheet: through the Panels (below 1080) or the Menu then the Panels (phone), by real clicks */
      const ph=(await L.A.state(p)).phone;
      try{
        if(ph&&ph.on){ await L.click(p,"#menubtn"); await L.wait(1200); }
        const pb=await L.center(p,"#panelsbtn");
        if(pb&&pb.vis){ await p.mouse.click(pb.x,pb.y); await L.wait(1800); }
        await R.shot(p,c.name+"-4-panels");
        const sb=await L.center(p,"#srcbtn");
        R.step(c.name+": the Panels opened by real clicks"+(ph&&ph.on?" (Menu, then Panels)":""),{srcbtn:sb,fi:await L.P(p,()=>__a11y.fi()),reach:await reach(),cut:await L.P(p,()=>__a11y.cut()),panels:await L.P(p,()=>__a11y.panels()),
          rail:await L.P(p,()=>{ const r=document.querySelector(".rail"); const q=r.getBoundingClientRect(); const sc=r.querySelector(".railscroll"); return {box:[q.left,q.top,q.width,q.height].map(Math.round),scrollH:sc&&sc.scrollHeight,clientH:sc&&sc.clientHeight,oy:sc&&getComputedStyle(sc).overflowY}; })});
        if(sb&&sb.vis){ await p.mouse.click(sb.x,sb.y); await L.wait(1800);
          await R.shot(p,c.name+"-5-sources");
          R.step(c.name+": 'Accuracy and sources' (real click)",{fi:await L.P(p,()=>__a11y.fi()),sheet:await L.P(p,()=>{ const s=document.querySelector("#modal .sheet"), bd=document.getElementById("modal-body"); const r=s.getBoundingClientRect();
            return {box:[r.left,r.top,r.width,r.height].map(Math.round),bodySH:bd.scrollHeight,bodyCH:bd.clientHeight,bodyOY:getComputedStyle(bd).overflowY,closeBox:(()=>{ const q=document.getElementById("modal-close").getBoundingClientRect(); return [q.left,q.top,q.width,q.height].map(Math.round); })()}; }),cut:await L.P(p,()=>__a11y.cut())});
          await p.keyboard.press("Tab"); await L.wait(300);
          const sc0=await L.P(p,()=>({sheet:document.querySelector("#modal .sheet").scrollTop,body:document.getElementById("modal-body").scrollTop,focus:__a11y.fi().el}));
          await p.keyboard.press("PageDown"); await L.wait(600); await p.keyboard.press("ArrowDown"); await L.wait(400);
          const sc1=await L.P(p,()=>({sheet:document.querySelector("#modal .sheet").scrollTop,body:document.getElementById("modal-body").scrollTop,focus:__a11y.fi().el}));
          R.step(c.name+": in the sheet, Tab then PageDown and ArrowDown (real keys): what scrolls",{before:sc0,after:sc1});
          await p.keyboard.press("Escape"); await L.wait(800); }
      }catch(e){ R.step(c.name+": panels/sources failed",{err:e.message}); }
      /* a formation by a real click on the map, then its dossier */
      await p.keyboard.press("Escape"); await L.wait(800);
      const t=await L.formationTarget(p);
      if(t){ await p.mouse.click(t.x,t.y); await L.wait(2500);
        await R.shot(p,c.name+"-6-dossier");
        R.step(c.name+": a formation clicked (real mouse; map layer read to aim): "+t.name,{t,fi:await L.P(p,()=>__a11y.fi()),state:await L.A.state(p),drawer:await L.P(p,()=>{ const d=document.getElementById("drawer"); const r=d.getBoundingClientRect(); const bd=document.getElementById("drawer-body");
          return {on:d.classList.contains("on"),box:[r.left,r.top,r.width,r.height].map(Math.round),sh:d.scrollHeight,ch:d.clientHeight,oy:getComputedStyle(d).overflowY,bodySH:bd.scrollHeight,bodyCH:bd.clientHeight,bodyOY:getComputedStyle(bd).overflowY}; }),
          selchip:await L.P(p,()=>__a11y.text("#selchip")),cut:await L.P(p,()=>__a11y.cut()),panels:await L.P(p,()=>__a11y.panels()),reach:await reach()}); }
      else R.step(c.name+": no formation placed to click",{});
      R.console=(R.console||[]).concat(p._log.slice(0,20).map(x=>c.name+" "+x.type+" "+x.text));
    }catch(e){ R.step(c.name+": FAILED",{err:String(e.stack||e).slice(0,600)}); }
    finally{ if(p) await p.context().close().catch(()=>{}); }
  }
});
