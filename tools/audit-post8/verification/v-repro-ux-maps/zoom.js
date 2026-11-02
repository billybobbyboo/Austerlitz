#!/usr/bin/env node
/* Final audit after Stage 8, verification v-repro-ux-maps: an independent reproduction of a11y A11Y-01 (400% zoom, WCAG 1.4.10 reflow at 320 CSS px)
   on a VISITOR's desktop page (no ?harness=1, no touch, no phone user agent): a browser zoomed to 400% lays a 1600 x 900 screen out at 400 x 225
   CSS px at device scale 4, a 1280 x 1024 screen at 320 x 256 at 4 (WCAG's reflow width). Also the phone held landscape (844 x 390, density 3,
   touch, an iPhone's user agent) for the finding's side remark. Real input only (Esc, Tab, Enter, mouse clicks at a control's centre); reads only.
   node tools/audit-post8/verification/v-repro-ux-maps/zoom.js  -> docs/audit-post8-evidence/verification/v-repro-ux-maps/zoom.json + JPEGs */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../../lib.js");
const TR=require("../../../visual/three-route.js");
const OUT=path.join(A.EVID,"verification","v-repro-ux-maps"); fs.mkdirSync(OUT,{recursive:true});
const R={build:"austerlitz-command-map.html md5 f10fe585c46aea576f436ed51ac46f83",browser:"Chromium 141.0.7390.37 headless shell, SwiftShader",cases:{}};
const save=()=>fs.writeFileSync(path.join(OUT,"zoom.json"),JSON.stringify(R,null,1));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const CASES=[{name:"400x225@4",vp:[400,225],dsf:4},{name:"320x256@4",vp:[320,256],dsf:4},{name:"844x390-phone",vp:[844,390],phone:true}];
async function openV(b,c){
  const o=c.phone?{viewport:{width:c.vp[0],height:c.vp[1]},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:A.IOS_UA}:{viewport:{width:c.vp[0],height:c.vp[1]},deviceScaleFactor:c.dsf};
  const ctx=await b.newContext(o), page=await ctx.newPage(); page._log=[];
  page.on("console",m=>{ const t=m.type(); if(t==="warning"||t==="error") page._log.push(t+": "+m.text().slice(0,200)); }); page.on("pageerror",e=>page._log.push("pageerror: "+e.message));
  await TR.routeThree(page);
  await page.goto("file://"+path.join(A.ROOT,"austerlitz-command-map.html"),{waitUntil:"commit",timeout:180000});
  await TR.waitBoot(page,240000,250); return page;
}
/* what a visitor can reach: each control's box, whether it lies on the screen, and what a press at its centre reaches */
const REACH=()=>{ var S=["#play","#timerail","#helpbtn","#eyesbtn","#menubtn","#panelsbtn","#layersbtn","#tourbtn","#openingbtn","#srcbtn","#fr-tour","#fr-close","#lg-toggle",".vm-btn","#follow","#speedbtn"], o={};
  S.forEach(function(s){ var e=document.querySelector(s); if(!e){ o[s]="absent"; return; } var r=e.getBoundingClientRect(), cs=getComputedStyle(e), shown=cs.display!=="none"&&cs.visibility!=="hidden"&&r.width>0&&r.height>0;
    if(!shown){ o[s]="not shown"; return; }
    var full=r.left>=-0.5&&r.top>=-0.5&&r.right<=innerWidth+0.5&&r.bottom<=innerHeight+0.5, any=r.right>0&&r.bottom>0&&r.left<innerWidth&&r.top<innerHeight;
    var cx=Math.min(Math.max(r.left+r.width/2,0),innerWidth-1), cy=Math.min(Math.max(r.top+r.height/2,0),innerHeight-1), h=document.elementFromPoint(cx,cy);
    o[s]={box:[r.left,r.top,r.width,r.height].map(Math.round),onScreen:full?"whole":(any?"partly":"off"),centreHits:h?(h===e||e.contains(h)?"itself":(h.id?"#"+h.id:h.tagName.toLowerCase()+"."+String(h.className).split(" ")[0])):null}; });
  return o; };
const TEXT=()=>{ function vis(e){ if(!e) return false; var c=getComputedStyle(e), r=e.getBoundingClientRect(); if(c.display==="none"||c.visibility==="hidden"||!(r.width>0&&r.height>0)) return false;
    for(var p=e;p;p=p.parentElement){ var q=getComputedStyle(p); if(q.display==="none"||q.visibility==="hidden") return false; } return true; }
  function onScr(e){ var r=e.getBoundingClientRect(); return r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth; }
  var dp=document.querySelector(".dispatch"), ttl=document.getElementById("d-title"), lede=document.getElementById("d-lede"), cap=document.getElementById("tb-cap"), lg=document.querySelector(".legend"), nb=document.getElementById("tab-now"), tb=document.querySelector(".timebar");
  var cr=cap?cap.getBoundingClientRect():null, tr=tb.getBoundingClientRect();
  return {clock:fmtClock(clock),phaseTitle:ttl?ttl.textContent.trim().slice(0,80):null,dispatchDisplay:getComputedStyle(dp).display,titleShown:vis(ttl)&&onScr(ttl),ledeShown:vis(lede)&&onScr(lede),
    nowTab:nb?{hidden:nb.hidden,display:getComputedStyle(nb).display}:null,docked:document.body.classList.contains("docked"),railHidden:document.body.classList.contains("rail-hidden"),
    caption:cap?{w:Math.round(cr.width),h:Math.round(cr.height),text:(cap.innerText||"").replace(/\s+/g," ").trim().slice(0,160),shown:vis(cap)}:null,legendDisplay:getComputedStyle(lg).display,
    timebar:{top:Math.round(tr.top),h:Math.round(tr.height),frac:+(tr.height/innerHeight).toFixed(2)},pageScroll:{docSH:document.documentElement.scrollHeight,docSW:document.documentElement.scrollWidth,ih:innerHeight,iw:innerWidth,
      htmlOverflow:getComputedStyle(document.documentElement).overflow,bodyOverflow:getComputedStyle(document.body).overflow}}; };
const CARD=()=>{ var e=document.getElementById("firstrun"); if(!e||e.hidden) return {shown:false}; var r=e.getBoundingClientRect(), h=e.querySelector("h2"), hr=h?h.getBoundingClientRect():null, cs=getComputedStyle(e);
  return {shown:true,box:[r.left,r.top,r.width,r.height].map(Math.round),scrollH:e.scrollHeight,clientH:e.clientHeight,overflowY:cs.overflowY,maxHeight:cs.maxHeight,heading:h?{text:h.textContent.trim().slice(0,60),top:Math.round(hr.top),bottom:Math.round(hr.bottom)}:null,
    firstPara:(function(){ var p=e.querySelector("p"); if(!p) return null; var q=p.getBoundingClientRect(); return {top:Math.round(q.top),bottom:Math.round(q.bottom)}; })()}; };
const RAIL=()=>{ var r=document.querySelector(".rail"), q=r.getBoundingClientRect(), sc=r.querySelector(".railscroll"), s=sc.getBoundingClientRect();
  return {railHidden:document.body.classList.contains("rail-hidden"),box:[q.left,q.top,q.width,q.height].map(Math.round),scroll:{top:Math.round(s.top),clientH:sc.clientHeight,scrollH:sc.scrollHeight,oy:getComputedStyle(sc).overflowY},
    activeTab:(document.querySelector('.tab-btn[aria-selected="true"]')||{}).id||null}; };
async function pressAt(page,sel){ const b=await page.evaluate(s=>{ const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width}; },sel);
  if(!b||!(b.w>0)) return {sel,pressed:false,why:"no box"};
  const x=Math.min(Math.max(b.x,0.5),(await page.evaluate(()=>innerWidth))-0.5), y=Math.min(Math.max(b.y,0.5),(await page.evaluate(()=>innerHeight))-0.5);
  await page.mouse.click(x,y); await wait(1800); return {sel,pressed:true,at:[Math.round(x),Math.round(y)]}; }
(async()=>{
  const b=await A.launch();
  for(const c of CASES){
    const t0=Date.now(), C={steps:[]}; R.cases[c.name]=C; let page;
    const step=(what,o)=>{ C.steps.push(Object.assign({what},o)); console.log(c.name,"STEP",what,JSON.stringify(o).slice(0,300)); save(); };
    try{
      page=await openV(b,c); await page.waitForSelector("#firstrun:not([hidden])",{timeout:120000}).catch(()=>{}); await wait(2500);
      const f1=path.join(OUT,"zoom-"+c.name.replace("@","-at")+"-1-card.jpg"); await A.jpeg(page,f1,80);
      step("first screen: the card",{bootS:Math.round((Date.now()-t0)/1000),card:await page.evaluate(CARD),text:await page.evaluate(TEXT),reach:await page.evaluate(REACH),shot:path.relative(A.ROOT,f1)});
      /* can the card be scrolled by a visitor: the wheel over it, then the keys (Tab to its first control is where focus starts) */
      const cb=await page.evaluate(()=>{ var r=document.getElementById("firstrun").getBoundingClientRect(); return {x:r.left+r.width/2,y:Math.max(5,r.top+r.height/2)}; });
      if(!c.phone){ await page.mouse.move(cb.x,cb.y); await page.mouse.wheel(0,-300); await wait(800); }
      step("after a wheel up over the card (desktop) or nothing (phone)",{card:await page.evaluate(CARD)});
      if(c.phone) await page.tap("#fr-close",{timeout:180000}); else await page.keyboard.press("Escape");
      await wait(2000);
      const f2=path.join(OUT,"zoom-"+c.name.replace("@","-at")+"-2-explore.jpg"); await A.jpeg(page,f2,80);
      step((c.phone?"Explore on my own (real tap)":"Esc (real key)")+": the screen to explore",{text:await page.evaluate(TEXT),reach:await page.evaluate(REACH),shot:path.relative(A.ROOT,f2)});
      if(c.phone){ R.cases[c.name].errors=page._log.slice(0,20); continue; }
      /* the Panels by a real click at the button's centre */
      const p1=await pressAt(page,"#panelsbtn");
      step("a real click at the Panels button's centre",{press:p1,rail:await page.evaluate(RAIL),reach:await page.evaluate(()=>{ var e=document.getElementById("srcbtn"), r=e.getBoundingClientRect(), h=document.elementFromPoint(Math.min(Math.max(r.left+r.width/2,0),innerWidth-1),Math.min(Math.max(r.top+r.height/2,0),innerHeight-1));
        return {srcbtn:[r.left,r.top,r.width,r.height].map(Math.round),centreHits:h?(h===e||e.contains(h)?"itself":(h.id?"#"+h.id:h.tagName.toLowerCase()+"."+String(h.className).split(" ")[0])):null}; })});
      /* the keyboard route: Tab until the Panels button has the focus (at most 40 presses), then Enter */
      if(await page.evaluate(()=>document.body.classList.contains("rail-hidden"))){
        let n=0, got=false; for(;n<40;n++){ await page.keyboard.press("Tab"); await wait(120); if(await page.evaluate(()=>document.activeElement&&document.activeElement.id==="panelsbtn")){ got=true; break; } }
        if(got){ await page.keyboard.press("Enter"); await wait(1800); }
        step("the keyboard route: Tab to the Panels button ("+(n+1)+" presses, reached: "+got+"), Enter",{reached:got,rail:await page.evaluate(RAIL)});
      }
      const f3=path.join(OUT,"zoom-"+c.name.replace("@","-at")+"-3-panels.jpg"); await A.jpeg(page,f3,80);
      /* 'Accuracy and sources' by a real click at its centre, if the rail is open */
      const p2=await pressAt(page,"#srcbtn");
      step("a real click at 'Accuracy and sources''s centre",{press:p2,modalOpen:await page.evaluate(()=>document.getElementById("modal").classList.contains("on")),shot:path.relative(A.ROOT,f3)});
      R.cases[c.name].errors=page._log.slice(0,20);
    }catch(e){ step("FAILED",{err:String(e.stack||e).slice(0,600)}); }
    finally{ C.seconds=Math.round((Date.now()-t0)/1000); save(); if(page) await page.context().close().catch(()=>{}); }
  }
  await b.close(); console.log("zoom done");
})();
