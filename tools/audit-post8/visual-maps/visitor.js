#!/usr/bin/env node
/* Final audit after Stage 8, area visual-maps: the first screen a visitor meets (a visitor's page: no ?harness=1, CSS transitions kept, the drift
   and smoke moving), at a laptop size, with the first-run card open, then closed by a real click on "Explore on my own", then the clock stepped by
   real clicks on the timeline's next-event button; each time the caption's parts as laid out (shown, ellipsized, given way: fitCaption's .fit-off),
   its title (capTitle) and the Now tab's matching text. node tools/audit-post8/visual-maps/visitor.js [WxH]  Measurement only. */
"use strict";
const fs=require("fs"), path=require("path"), cp=require("child_process");
const A=require("../lib.js");
const AREA="visual-maps";
const VP=(process.argv[2]||"1280x720").split("x").map(Number), tag=VP.join("x");
const dir=path.join(A.EVID,AREA,"visitor-"+tag); fs.mkdirSync(dir,{recursive:true});
const CAP=function(){ var cap=document.getElementById("tb-cap"), r=cap.getBoundingClientRect();
  var parts=[].map.call(cap.children,function(k){ var cs=getComputedStyle(k), kr=k.getBoundingClientRect();
    return {cls:k.className,text:(k.textContent||"").trim(),shown:cs.display!=="none",ellipsized:k.scrollWidth>k.clientWidth+1,w:Math.round(kr.width),
      kids:[].map.call(k.children,function(q){ return {cls:q.className,text:(q.textContent||"").trim(),ellipsized:q.scrollWidth>q.clientWidth+1,w:Math.round(q.getBoundingClientRect().width)}; })}; });
  var row=cap.parentNode, sib=[].map.call(row.children,function(e){ var b=e.getBoundingClientRect(); return {id:e.id||e.className,w:Math.round(b.width),shown:getComputedStyle(e).display!=="none"}; });
  var now=document.getElementById("now"); return {clock:clock, box:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)], title:cap.title, parts:parts, row:sib,
    firstRun:firstRunOpen, nowTop:now?(now.innerText||"").slice(0,400):null, body:document.body.className}; };
(async()=>{
  const b=await A.launch(), t0=Date.now();
  const page=await A.open(b,VP,{harness:false,transitions:true});
  console.log("visitor",tag,"open",((Date.now()-t0)/1000).toFixed(0),"s");
  const out=[]; const tiles=[];
  async function shot(name,steps){ await page.waitForTimeout(1500); await A.frames(page,4);
    const f=path.join(dir,name+".jpg"); await A.jpeg(page,f,82).catch(async()=>A.jpeg(page,f,82));
    const c=await page.evaluate(CAP); const rec={shot:name,viewport:VP,page:"visitor page (no ?harness=1, transitions kept)",build:"md5 f10fe585c46aea576f436ed51ac46f83",steps,caption:c};
    fs.writeFileSync(path.join(dir,name+".json"),JSON.stringify(rec,null,1)); out.push(rec);
    /* the caption row cropped at 2x for reading */
    const cr=await page.evaluate(()=>{ const r=document.getElementById("tb-cap").parentNode.getBoundingClientRect(); return {x:Math.max(0,r.left),y:Math.max(0,r.top-4),width:Math.min(innerWidth,r.width),height:r.height+8}; });
    await A.jpeg(page,path.join(dir,name+"-caprow.jpg"),90,cr);
    tiles.push({png:fs.readFileSync(f),cap:name+" "+String(Math.floor(c.clock/60)).padStart(2,"0")+":"+String(c.clock%60).padStart(2,"0")});
    console.log(name,JSON.stringify(c.parts.map(p=>[p.cls,p.shown,p.ellipsized,p.text.slice(0,40)])),"title:",c.title); }
  await shot("first-screen",["fresh visitor page, untouched"]);
  await page.click("#fr-close",{timeout:60000});
  await shot("explore",["real click #fr-close (Explore on my own)"]);
  for(let i=0;i<3;i++){ await page.click("#nextEv",{timeout:60000}); await shot("next-event-"+(i+1),["real click #nextEv x"+(i+1)]); }
  await page.click(".vm-btn[data-vm=watch]",{timeout:60000}); await shot("watch-after-events",["real click Watch"]);
  await A.sheet(page,tiles,2,640,Math.round(640*VP[1]/VP[0]),"visitor "+tag+": first screen, explore, three event steps, Watch",path.join(dir,"sheet.jpg"));
  fs.writeFileSync(path.join(dir,"errors.json"),JSON.stringify(A.errors(page),null,1));
  await b.close(); console.log("visitor done",((Date.now()-t0)/1000).toFixed(0),"s");
})().catch(e=>{ console.error("FAILED",e); process.exit(1); });
