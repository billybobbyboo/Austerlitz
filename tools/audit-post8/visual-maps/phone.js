#!/usr/bin/env node
/* Final audit after Stage 8, area visual-maps: the phone layouts, by real taps (Playwright's page.tap on a touch context) and real touch drags
   (CDP Input.dispatchTouchEvent), on the harness's phone page (A.openPhone: density 3, touch, isMobile, an iPhone's user agent, ?harness=1).
   node tools/audit-post8/visual-maps/phone.js <390x844|844x390>
   Saves <shot>.jpg (CSS pixels: the screenshot at scale "css", text rendered at density 3 then scaled; from a PNG through ffmpeg) and <shot>.json (the steps, __aus.state, the layer, the caption, the panels'
   boxes) in docs/audit-post8-evidence/visual-maps/phone-<vp>/, and a contact sheet. Measurement only. */
"use strict";
const fs=require("fs"), path=require("path"), cp=require("child_process");
const A=require("../lib.js");
const AREA="visual-maps";
const vpArg=process.argv[2]||"390x844", VP=vpArg.split("x").map(Number);
const dir=path.join(A.EVID,AREA,"phone-"+vpArg); fs.mkdirSync(dir,{recursive:true});
const READ=function(){
  var o={};
  try{ mlLayout(); var s=ML.stats; o.layer={items:s.items,placed:s.placed,dropped:s.dropped,droppedIds:s.dropped_.slice(),underPanel:s.underPanel}; }catch(e){ o.layerErr=String(e); }
  try{ var D=[]; for(var k in ML.items){ var it=ML.items[k]; if(it.eFrame!==ML.frame||it.state!=="on") continue; var r=it.el.getBoundingClientRect(); D.push({id:k,text:(it.el.textContent||"").replace(/\s+/g," ").trim().slice(0,40),box:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]}); } o.drawn=D; }catch(e){}
  var cap=document.getElementById("tb-cap"); if(cap){ var cr=cap.getBoundingClientRect(); o.caption={title:cap.title,box:[Math.round(cr.left),Math.round(cr.top),Math.round(cr.width),Math.round(cr.height)],
    parts:[].map.call(cap.children,function(k){ var cs=getComputedStyle(k); return {cls:k.className,text:(k.textContent||"").trim(),shown:cs.display!=="none",cut:k.scrollWidth>k.clientWidth+1}; })}; }
  var P={}; ["#timebar",".timebar",".rail",".dispatch","#tools","#viewmode","#firstrun",".drawer","#layerpop","#selchip","#menubtn","#dgrip","#phlist","#tltip",".legend","#scalebar"].forEach(function(sel){ var e=document.querySelector(sel); if(!e) return;
    var cs=getComputedStyle(e), r=e.getBoundingClientRect(); P[sel]={shown:!(cs.display==="none"||cs.visibility==="hidden"||e.hidden||r.width===0),box:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]}; });
  o.panels=P; o.body=document.body.className; o.clock=clock; o.cam={pos:landCam.position.toArray().map(function(v){ return +v.toFixed(2); }),tgt:orbitTarget.toArray().map(function(v){ return +v.toFixed(2); })};
  if(mode==="staff"&&typeof MAPCAM!=="undefined"){ var q=MAPCAM.state(); o.map={x:+q.x.toFixed(2),z:+q.z.toFixed(2),wpp:+q.wpp.toFixed(4)}; }
  o.focus=document.activeElement?(document.activeElement.id||document.activeElement.className||document.activeElement.tagName):null;
  return o;
};
(async()=>{
  const b=await A.launch(), t0=Date.now();
  const page=await A.openPhone(b,VP,{});
  console.log("phone",vpArg,"open",((Date.now()-t0)/1000).toFixed(0),"s");
  const cdp=await page.context().newCDPSession(page);
  const settle=()=>A.settle(page);
  const tap=async sel=>{ if(!(await page.isVisible(sel))) return "SKIPPED (not visible): "+sel; await page.tap(sel,{timeout:180000}); await page.waitForTimeout(500); return "real tap "+sel; };
  const viaMenu=async sel=>{ const s=[]; if(!(await page.isVisible(sel))&&await page.isVisible("#menubtn")) s.push(await tap("#menubtn")); s.push(await tap(sel)); return s.join("; "); };
  const touchDrag=async(x0,y0,x1,y1,n)=>{ n=n||12; await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:x0,y:y0}]});
    for(let i=1;i<=n;i++){ await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x0+(x1-x0)*i/n,y:y0+(y1-y0)*i/n}]}); await page.waitForTimeout(30); }
    await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]}); await page.waitForTimeout(400); return "real touch drag (CDP) "+[x0,y0,x1,y1].join(",")+" in "+n+" moves"; };
  const tiles=[];
  async function shot(name,steps,note){
    await settle();
    const png=await page.screenshot({timeout:240000,scale:"css"}), f=path.join(A.SCRATCH,AREA,"phone-last-"+vpArg+".png"); fs.mkdirSync(path.dirname(f),{recursive:true}); fs.writeFileSync(f,png);
    cp.execFileSync("ffmpeg",["-y","-loglevel","error","-i",f,"-q:v","4",path.join(dir,name+".jpg")]);
    const st=await page.evaluate(()=>window.__aus.state({fresh:true}));
    const rd=await page.evaluate(READ);
    const tc=await page.evaluate(x=>window.__aus.textContrast(x),png.toString("base64")).catch(e=>({err:String(e)}));
    const rec={shot:name, viewport:VP, device:"density 3, touch, isMobile, iPhone UA (tools/audit-post8/lib.js openPhone)", page:"harness page (?harness=1)", build:"md5 f10fe585c46aea576f436ed51ac46f83",
      steps, note:note||"", state:st, read:rd, textContrast:tc&&{texts:tc.texts,min:tc.min,belowAA:tc.belowAA}};
    fs.writeFileSync(path.join(dir,name+".json"),JSON.stringify(rec,null,1));
    tiles.push({png:fs.readFileSync(path.join(dir,name+".jpg")),cap:name});
    console.log(vpArg,name,"clock",rd.clock,"dropped",rd.layer&&rd.layer.dropped,"AA min",tc&&tc.min,"t",((Date.now()-t0)/1000).toFixed(0));
    return rec;
  }
  const ST=[];
  await shot("first",["fresh page untouched (?harness=1)"],"the first screen with the first-run card");
  ST.push(await tap("#fr-close")); await page.evaluate(()=>{ setClock(570,{instant:true,force:true}); });
  await shot("explore",["real tap #fr-close (Explore on my own)","setClock(570,{instant,force}) as the harness's phone cases"],"09:30, the phase's view framed into the free area");
  /* one capture at the device's own density (3): the whole screen, for reading the text as a phone draws it */
  await A.jpeg(page,path.join(dir,"explore-device.jpg"),80);
  const g=await page.isVisible("#dgrip"); let s1=[];
  if(g){ s1.push(await tap("#dgrip")); await shot("dsheet",s1,"the dispatch sheet raised by its grip"); s1=[await tap("#dgrip")]; }
  if(await page.isVisible("#menubtn")){ s1=[await tap("#menubtn")]; await shot("menu",s1,"the Menu open"); }
  s1=[await viaMenu("#layersbtn")]; await shot("layers",s1,"the Layers panel (through the Menu where there is one)");
  s1=[await tap('.mode-btn[data-m="hybrid"]'), await tap("#layerclose")]; await shot("counters",s1,"Landscape with counters chosen in Layers, the panel closed");
  /* gestures: a finger's drag on the map, then on the timeline's rail */
  const before=await page.evaluate(()=>({clock:clock,tgt:orbitTarget.toArray()}));
  const gd=await touchDrag(VP[0]*0.5,VP[1]*0.35,VP[0]*0.5+120,VP[1]*0.35+40,12);
  const afterMap=await page.evaluate(()=>({clock:clock,tgt:orbitTarget.toArray()}));
  await shot("counters-dragged",[gd],"after a one-finger drag on the map: did the view pan, did the clock move? before "+JSON.stringify(before)+" after "+JSON.stringify(afterMap));
  const rail=await page.evaluate(()=>{ const r=document.getElementById("timerail").getBoundingClientRect(); return [r.left,r.top,r.width,r.height]; });
  const b2=await page.evaluate(()=>({clock:clock,tgt:orbitTarget.toArray()}));
  const gr=await touchDrag(rail[0]+rail[2]*0.4,rail[1]+rail[3]/2,rail[0]+rail[2]*0.6,rail[1]+rail[3]/2,12);
  const a2=await page.evaluate(()=>({clock:clock,tgt:orbitTarget.toArray()}));
  await shot("rail-dragged",[gr],"after a one-finger drag along the timeline's rail (box "+rail.map(Math.round).join(",")+"): before "+JSON.stringify(b2)+" after "+JSON.stringify(a2));
  await page.evaluate(()=>{ setClock(570,{instant:true,force:true}); });
  /* a tap on a phase in the timeline (a touch never shows the tip) */
  const ph=await page.evaluate(()=>{ const e=[].find.call(document.querySelectorAll(".tl-ph,.tlp,[data-tip]"),x=>x.getBoundingClientRect().width>20&&getComputedStyle(x).display!=="none"); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,cls:e.className,tip:e.dataset.tip}; });
  if(ph){ await page.touchscreen.tap(ph.x,ph.y); await page.waitForTimeout(600); const tipShown=await page.evaluate(()=>{ const t=document.getElementById("tltip"); return t&&!t.hidden; });
    await shot("phase-tapped",["real touchscreen tap at "+Math.round(ph.x)+","+Math.round(ph.y)+" on "+ph.cls+" ("+ph.tip+")"],"tip shown after the tap: "+tipShown); }
  s1=[await viaMenu("#layersbtn"), await tap('.mode-btn[data-m="staff"]')]; await settle(); s1.push(await tap("#layerclose"));
  await shot("paper",s1,"the paper map entered by its taps (decision 238)");
  s1=[await viaMenu("#layersbtn"), await tap('.mode-btn[data-m="terrain"]'), await tap("#layerclose"), await viaMenu('.vm-btn[data-vm="watch"]')];
  await shot("watch",s1,"Watch, through the Menu, on the landscape");
  s1=[await viaMenu('.vm-btn[data-vm="study"]')]; await page.evaluate(()=>{ select("f","sthilaire"); }); s1.push("select('f','sthilaire') as the harness's phone dossier case");
  await shot("dossier",s1,"Saint-Hilaire's dossier as a sheet");
  await page.evaluate(()=>{ select(null,null); });
  s1=[await viaMenu("#eyesbtn")]; await shot("eyes-fr",s1,"Whose eyes: one tap (everyone -> Napoleon's headquarters)");
  s1=[await viaMenu("#eyesbtn")]; await shot("eyes-al",s1,"Whose eyes: a second tap (-> the Allied headquarters)");
  await viaMenu("#eyesbtn");
  fs.writeFileSync(path.join(dir,"errors.json"),JSON.stringify(A.errors(page),null,1));
  const tw=VP[0]<VP[1]?260:520, th=Math.round(tw*VP[1]/VP[0]);
  await A.sheet(page,tiles,VP[0]<VP[1]?5:3,tw,th,"phone "+vpArg+" (density 3; harness page; real taps)",path.join(dir,"sheet.jpg"));
  await b.close(); console.log("phone done",((Date.now()-t0)/1000).toFixed(0),"s");
})().catch(e=>{ console.error("FAILED",e); process.exit(1); });
