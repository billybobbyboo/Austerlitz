/* v-repro-srcgeo-sim (state-probe.js: browser-probe.js's state #0 part alone, with the tab's state logged): independent browser reproduction of interaction #0 (a pan or zoom during a camera glide undone) and state #0 (an open
   dossier stale while the clock moves within a phase), on the audited build: a visitor's page (no ?harness=1, CSS transitions kept), 1280 x 720.
   The machine is shared (load 30 on 4 cores: one real frame took 5.5 s in this run's first attempt), so the app's own loop is stepped on a virtual
   clock of this script's own (performance.now answers it; the app's loop() is called as requestAnimationFrame would, 30 a second; the WebGL draw
   is skipped, as tools/visual/motion.js does for the motion block). Input is real: Playwright's mouse, wheel and keyboard (CDP Input events) at
   element centres hit-tested first. The app's globals are only read (camera, tween slot, clock, the model's place), never written.
   Writes one JSON record to argv[2]. Measurement only. */
"use strict";
const fs=require("fs");
const A=require("/home/user/Austerlitz/tools/audit-post8/lib.js");
const OUT=process.argv[2];
const rec={started:new Date().toISOString(),steps:[]};
const log=(k,v)=>{ rec.steps.push({k,v}); console.log(k,JSON.stringify(v).slice(0,900)); };
const CAM=()=>({pos:landCam.position.toArray().map(v=>+v.toFixed(3)),tgt:orbitTarget.toArray().map(v=>+v.toFixed(3)),freeCam,camSlot:!!_tw.cam,tween:!!tween,
  vantage:curVantage,moves:LANDCAM.stats.moves,vnow:Math.round(performance.now()),clock:fmtClock(clock)});
const d=(a,b)=>+(Math.hypot(a.tgt[0]-b.tgt[0],a.tgt[1]-b.tgt[1],a.tgt[2]-b.tgt[2])+Math.hypot(a.pos[0]-b.pos[0],a.pos[1]-b.pos[1],a.pos[2]-b.pos[2])).toFixed(3);
const step=(p,n)=>p.evaluate(n=>window.__vs(n),n);
async function realClick(p,sel){
  let r=null, prev=null; const t0=Date.now();
  for(;;){
    r=await p.evaluate(s=>{ const e=document.querySelector(s); if(!e) return {err:"no "+s}; e.scrollIntoView({block:"nearest",inline:"nearest"});
      const b=e.getBoundingClientRect(); if(!(b.width>0&&b.height>0)) return {err:"no box "+s}; const x=b.left+b.width/2, y=b.top+b.height/2, h=document.elementFromPoint(x,y);
      return {x,y,box:[b.left,b.top,b.width,b.height].map(Math.round).join(","),hit:!!(h&&(h===e||e.contains(h))),top:h?(h.id||h.tagName):null}; },sel);
    if(!r.err&&r.hit&&prev&&prev.box===r.box) break;
    if(Date.now()-t0>8000){ r.forced=true; break; }
    prev=r; await p.waitForTimeout(200);
  }
  if(r.err) throw new Error(r.err);
  await p.mouse.click(r.x,r.y); return r;
}
(async()=>{
  const crypto=require("crypto"), html=fs.readFileSync(process.env.AUSTERLITZ_HTML||"/home/user/Austerlitz/austerlitz-command-map.html");
  rec.build={bytes:html.length,md5:crypto.createHash("md5").update(html).digest("hex")};
  const b=await A.launch();
  const p=await A.open(b,[1280,720],{harness:false,transitions:true});
  log("boot",{ms:p._loadMs});
  await p.keyboard.press("Escape");
  await p.evaluate(()=>{ const realNow=performance.now.bind(performance), realRaf=window.requestAnimationFrame; let T=realNow();
    window.requestAnimationFrame=function(cb){ if(cb===window.loop) return 0; return realRaf.call(window,cb); };
    performance.now=function(){ return T; }; renderer.render=function(){};
    window.__vs=function(n){ for(let i=0;i<n;i++){ T+=1000/30; window.loop(); } return Math.round(T); }; });
  await step(p,60);
  log("after Esc",await p.evaluate(()=>({card:!!document.querySelector("#firstrun:not([hidden])"),clock:fmtClock(clock),freeCam})));
  const [x,y]=await p.evaluate(()=>{ const fr=landFreeRect(); return [Math.round((fr[0]+fr[2])/2),Math.round((fr[1]+fr[3])/2)]; });
  log("free-rect centre",[x,y]);
  /* state #0: Napoleon's headquarters' dossier while the clock moves inside phase 6 (11:15-12:45) */
  const railX=t=>p.evaluate(t=>{ const r=document.getElementById("timerail").getBoundingClientRect(); return [r.left+(t-T_MIN)/(T_MAX-T_MIN)*r.width, r.top+r.height/2]; },t);
  let [rx,ry]=await railX(723.5); await p.mouse.click(rx,ry); await step(p,90);
  log("rail click for 12:03",await p.evaluate(()=>({clock:+clock.toFixed(2),text:fmtClock(clock),phase:curPhase})));
  log("tab click",await realClick(p,"#tab-oob")); await step(p,10);
  log("tab state",await p.evaluate(()=>({sel:document.getElementById("tab-oob").getAttribute("aria-selected"),hidden:document.getElementById("oob").hidden,rows:document.querySelectorAll(".oob-row").length,pres:typeof presentation!=="undefined"?presentation:null,body:document.body.className.slice(0,200)})));
  { let r; try{ r=await realClick(p,'.oob-row[data-id="gqg"]'); }catch(e){ r={err:String(e.message),fallback:"the row's own click handler through element.click() (not real input)"};
      await p.evaluate(()=>{ selectTab("oob"); document.querySelector('.oob-row[data-id="gqg"]').click(); }); }
    log("oob row click",r); } await step(p,60);
  const read=()=>p.evaluate(()=>{ const t=(document.getElementById("drawer-body")||{}).innerText||""; const pos=posNow("gqg");
    return {clock:fmtClock(clock),phase:curPhase,sel:selection&&selection.kind+":"+selection.id,drawer:t.replace(/\s+/g," ").slice(0,900),
      model:pos?nearestFeature(pos):null,keyNow:drawerKey(),keyPainted:_drawerKey}; });
  log("gqg card at 12:03",await read());
  try{ log("more click",await realClick(p,".more-btn")); }catch(e){ log("more click fallback (element.click())",String(e.message)); await p.evaluate(()=>document.querySelector(".more-btn").click()); } await step(p,10);
  log("gqg full dossier at 12:03",await read());
  await p.focus("#timerail");
  for(let i=0;i<3;i++){ await p.keyboard.press("ArrowRight"); await step(p,3); }
  log("gqg full dossier after 3 x ArrowRight on the rail",await read());
  [rx,ry]=await railX(757.5); await p.mouse.click(rx,ry); await step(p,10);
  log("gqg full dossier after a rail click for 12:37",await read());
  /* a place: Pratzen Heights from the theme "The attack on the Pratzen"; then the clock moved inside phase 6 by rail clicks */
  await realClick(p,"#tab-analysis"); await step(p,10);
  await realClick(p,'#chapters button.chap[data-c="pratzen"]'); await step(p,90);
  [rx,ry]=await railX(676.5); await p.mouse.click(rx,ry); await step(p,90);
  try{ log("feature button",await realClick(p,'[data-feat="pratzen"]')); }catch(e){ log("feature button fallback (element.click())",String(e.message)); await p.evaluate(()=>document.querySelector('[data-feat="pratzen"]').click()); } await step(p,30);
  const readP=()=>p.evaluate(()=>{ const t=(document.getElementById("drawer-body")||{}).innerText||""; const ft=FEATURES.filter(f=>f.id==="pratzen")[0];
    const m=t.match(/Formations nearby now([\s\S]*)$/); return {clock:fmtClock(clock),phase:curPhase,sel:selection&&selection.kind+":"+selection.id,commandView,
      nearbyShown:m?m[1].replace(/\s+/g," ").slice(0,500):null,model:placeNearby(ft).map(k=>FORMATIONS[k].name)}; });
  log("pratzen place at about 11:16",await readP());
  [rx,ry]=await railX(764.5); await p.mouse.click(rx,ry); await step(p,10);
  log("pratzen place after a rail click for 12:44",await readP());
  rec.errors=A.errors(p);
  await b.close();
  rec.ended=new Date().toISOString();
  fs.writeFileSync(OUT,JSON.stringify(rec,null,1));
  console.log("DONE");
})().catch(e=>{ console.error("FATAL",e); rec.fatal=String(e&&e.stack||e); fs.writeFileSync(OUT,JSON.stringify(rec,null,1)); process.exit(1); });
