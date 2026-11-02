#!/usr/bin/env node
/* Final audit after Stage 8, area visual-maps: the timeline's rail under a finger on the phone (and its hit map at desktop widths).
   node tools/audit-post8/visual-maps/rail-probe.js
   On the harness's phone page (A.openPhone: 390 x 844, density 3, touch, isMobile, an iPhone's user agent, ?harness=1):
   1. Explore on my own by a real tap; the clock set to 09:30 as the harness's phone cases set it.
   2. The rail's hit map: document.elementFromPoint at every CSS pixel along the rail's middle line (and 4 px above its foot): what a finger's
      contact point there reaches (the rail or its playhead, an event marker, anything else), as shares of the rail's width.
   3. Real touch drags (CDP Input.dispatchTouchEvent, 12 moves of 80 px in all): one starting where the hit map gives the rail, one starting
      where it gives an event marker; the clock, the selection and the open dossier before and after each. Then a short real tap on a marker.
   4. "Whose eyes?" reached as the phone layout offers it (decision 225: the Menu, the Panels, the Command tab), the Allied headquarters chosen
      by real taps, the rail closed, a capture of the map under that reading.
   5. The same hit map at 1280 x 720 and 1600 x 900 on the same page (the desktop layout from 1080 px; a pointer's hot spot, not a finger).
   Writes docs/audit-post8-evidence/visual-maps/phone-390x844/rail-probe.json and captures beside it. Measurement only. */
"use strict";
const fs=require("fs"), path=require("path"), cp=require("child_process");
const A=require("../lib.js");
const AREA="visual-maps";
const dir=path.join(A.EVID,AREA,"phone-390x844"); fs.mkdirSync(dir,{recursive:true});
const HITMAP=function(dy){
  var r=document.getElementById("timerail").getBoundingClientRect(), y=r.top+(dy==null?r.height/2:dy), n={rail:0,marker:0,other:0}, runs=[], cur=null, M={};
  for(var x=Math.ceil(r.left);x<Math.floor(r.right);x++){
    var e=document.elementFromPoint(x,y), k="other", id="";
    if(e){ var m=e.closest&&e.closest(".ev-mark"); if(m){ k="marker"; id=m.getAttribute("aria-label")||m.title||""; M[id]=1; }
      else if(e.closest&&e.closest("#timerail")) k="rail"; else id=(e.id||e.className||e.tagName); }
    n[k]++;
    if(!cur||cur.k!==k){ cur={k:k,x0:x,x1:x,id:id}; runs.push(cur); } else cur.x1=x;
  }
  var W=n.rail+n.marker+n.other;
  return {viewport:[innerWidth,innerHeight], rail:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)], y:Math.round(y),
    share:{rail:+(n.rail/W).toFixed(3),marker:+(n.marker/W).toFixed(3),other:+(n.other/W).toFixed(3)}, markersHit:Object.keys(M).length,
    markers:document.querySelectorAll("#evmarks .ev-mark").length,
    railRuns:runs.filter(function(q){ return q.k==="rail"; }).map(function(q){ return [q.x0,q.x1]; }),
    otherRuns:runs.filter(function(q){ return q.k==="other"; }).map(function(q){ return [q.x0,q.x1,q.id]; }).slice(0,12)};
};
const ST=function(){ var d=document.getElementById("drawer"); return {clock:clock, selection:selection?selection.kind+":"+selection.id:null,
  drawer:!!(d&&document.body.classList.contains("drawer-open")), drawerHead:d?((d.querySelector("h2,h3")||{}).textContent||"").slice(0,80):null}; };
(async()=>{
  const b=await A.launch(), t0=Date.now(), out={build:"austerlitz-command-map.html md5 f10fe585c46aea576f436ed51ac46f83", device:"density 3, touch, isMobile, iPhone UA (A.openPhone), 390x844, harness page",
    browser:"Chromium 141.0.7390.37 headless shell, SwiftShader", steps:[]};
  const page=await A.openPhone(b,[390,844],{});
  console.log("phone open",((Date.now()-t0)/1000).toFixed(0),"s");
  const cdp=await page.context().newCDPSession(page);
  const touchDrag=async(x0,y0,x1,y1,n)=>{ n=n||12; await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:x0,y:y0}]});
    for(let i=1;i<=n;i++){ await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x0+(x1-x0)*i/n,y:y0+(y1-y0)*i/n}]}); await page.waitForTimeout(30); }
    await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]}); await page.waitForTimeout(500); };
  const shot=async name=>{ await A.settle(page); const png=await page.screenshot({timeout:240000,scale:"css"}), f=path.join(A.SCRATCH,AREA,"rail-last.png"); fs.mkdirSync(path.dirname(f),{recursive:true}); fs.writeFileSync(f,png);
    cp.execFileSync("ffmpeg",["-y","-loglevel","error","-i",f,"-q:v","4",path.join(dir,name+".jpg")]); return name+".jpg"; };
  await page.tap("#fr-close",{timeout:180000}); await page.waitForTimeout(500);
  await page.evaluate(()=>{ setClock(570,{instant:true,force:true}); });
  await A.settle(page);
  out.hitmap390=await page.evaluate(HITMAP,null);
  out.hitmap390foot=await page.evaluate(HITMAP,20);
  console.log("hit map 390",JSON.stringify(out.hitmap390.share),"foot",JSON.stringify(out.hitmap390foot.share));
  const H=out.hitmap390, yMid=H.y;
  /* a start on the rail itself: the middle of the widest run the hit map gives the rail, else none */
  const rr=H.railRuns.slice().sort((p,q)=>(q[1]-q[0])-(p[1]-p[0]))[0];
  if(rr){ const x=Math.round((rr[0]+rr[1])/2), s0=await page.evaluate(ST); await touchDrag(x,yMid,Math.min(x+80,H.rail[0]+H.rail[2]-2),yMid,12); const s1=await page.evaluate(ST);
    out.steps.push({what:"real touch drag starting on the rail (the widest run the hit map gives the rail, "+rr.join("-")+" px) at y "+yMid+", 80 px to the right",x0:x,before:s0,after:s1}); }
  await page.evaluate(()=>{ setClock(570,{instant:true,force:true}); select(null,null); }); await A.settle(page);
  /* a start on an event marker: the first marker whose hit area covers the middle line, away from the rail's ends */
  const mk=await page.evaluate(y=>{ var r=document.getElementById("timerail").getBoundingClientRect();
    for(var x=Math.ceil(r.left+r.width*0.3);x<r.right-90;x++){ var e=document.elementFromPoint(x,y), m=e&&e.closest&&e.closest(".ev-mark"); if(m) return {x:x,label:m.getAttribute("aria-label")||""}; } return null; },yMid);
  if(mk){ const s0=await page.evaluate(ST); await touchDrag(mk.x,yMid,mk.x+80,yMid,12); const s1=await page.evaluate(ST);
    out.steps.push({what:"real touch drag starting on an event marker's hit area ("+mk.label.slice(0,80)+") at x "+mk.x+", y "+yMid+", 80 px to the right",x0:mk.x,before:s0,after:s1});
    out.steps.push({what:"capture after it",file:await shot("rail-drag-from-marker")});
    await page.evaluate(()=>{ setClock(570,{instant:true,force:true}); select(null,null); }); await A.settle(page);
    const s2=await page.evaluate(ST); await page.touchscreen.tap(mk.x,yMid); await page.waitForTimeout(700); const s3=await page.evaluate(ST);
    out.steps.push({what:"real touchscreen tap on the same point",before:s2,after:s3});
    out.steps.push({what:"capture after the tap",file:await shot("rail-tap-marker")}); }
  console.log(JSON.stringify(out.steps.map(s=>[s.what.slice(0,60),s.before&&s.before.clock,s.after&&s.after.clock,s.after&&s.after.selection])));
  /* "Whose eyes?" on the phone: the Menu, the Panels, the Command tab, the Allied headquarters; then the rail closed */
  await page.evaluate(()=>{ setClock(570,{instant:true,force:true}); select(null,null); }); await A.settle(page);
  const tapIf=async sel=>{ if(!(await page.isVisible(sel))) return "SKIPPED (not visible): "+sel; await page.tap(sel,{timeout:180000}); await page.waitForTimeout(500); return "real tap "+sel; };
  const eyes=[];
  if(await page.isVisible("#menubtn")) eyes.push(await tapIf("#menubtn"));
  eyes.push(await tapIf("#panelsbtn")); eyes.push(await tapIf("#tab-command")); eyes.push(await tapIf('.cmd-btn[data-cv="al"]'));
  out.steps.push({what:"Whose eyes, Allied headquarters, by the phone's own route",taps:eyes,state:await page.evaluate(()=>window.__aus.state({fresh:true}).commandView),file:await shot("eyes-al-route-rail")});
  eyes.push(await tapIf("#railclose"));
  const lay=await page.evaluate(()=>{ try{ mlLayout(); }catch(e){} var D=[]; for(var k in ML.items){ var it=ML.items[k]; if(it.eFrame!==ML.frame||it.state!=="on") continue; D.push(k+": "+(it.el.textContent||"").replace(/\s+/g," ").trim().slice(0,40)); } return D; });
  out.steps.push({what:"the rail closed (real tap #railclose): the map under the Allied reading",taps:eyes.slice(-1),drawn:lay,file:await shot("eyes-al-route")});
  /* the hit map at desktop widths, same page (the layout from 1080 px; a pointer, not a finger) */
  await page.evaluate(()=>{ setCommandView("none"); });
  for(const vp of [[1280,720],[1600,900]]){ await page.setViewportSize({width:vp[0],height:vp[1]}); await page.waitForTimeout(1200); await A.settle(page);
    out["hitmap"+vp[0]]=await page.evaluate(HITMAP,null); out["hitmap"+vp[0]+"foot"]=await page.evaluate(HITMAP,20);
    console.log("hit map",vp.join("x"),JSON.stringify(out["hitmap"+vp[0]].share),"foot",JSON.stringify(out["hitmap"+vp[0]+"foot"].share)); }
  out.errors=A.errors(page); out.seconds=Math.round((Date.now()-t0)/1000);
  fs.writeFileSync(path.join(dir,"rail-probe.json"),JSON.stringify(out,null,1));
  await b.close(); console.log("rail probe done",out.seconds,"s");
})().catch(e=>{ console.error("FAILED",e); process.exit(1); });
