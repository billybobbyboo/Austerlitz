/* Mock set 1: the dense 09:00 scene at the Follow-while-playing framing, desktop 1440x900 Study. PROGRAMMATIC state; prototypes injected (treat.js). */
"use strict";
const L=require("./lib.js"); const inject=require("./metrics.js"); const treat=require("./treat.js"); const path=require("path");
const MS=path.join(L.ROOT,"mock");
const say=(k,v)=>console.log(k,typeof v==="string"?v:JSON.stringify(v));
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const {page}=await L.open(b,url,{w:1440,h:900}); await page.evaluate(inject); await page.evaluate(treat);
  const shot=async n=>{ await L.sleep(900); await page.screenshot({path:path.join(MS,n+".png"),timeout:240000}); say("shot",n); };
  const settle=async(ms)=>{ await L.sleep(ms||1500); await page.waitForFunction(()=>!tween,null,{timeout:30000}).catch(()=>{}); await L.sleep(600); };
  await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(600);
  // the Follow-while-playing framing at 09:00, set from the app's own followGoal (what Play shows), held still
  await page.evaluate(()=>{ setClock(540,{instant:true,force:true}); }); await settle(2500);
  await page.evaluate(()=>{ var g=followGoal(); freeCam=true; tween=null; landCam.position.copy(g.T).addScaledVector(g.dir,238); orbitTarget.copy(g.T); landCam.lookAt(orbitTarget); if(typeof clampCamera==="function") clampCamera(); requestRender(6); }); await settle(2500);
  say("S2 current metrics",await page.evaluate(()=>window.__audit.comp()));
  await shot("S2-desk-0900-play-current");
  await page.evaluate(()=>window.__treat.A()); await shot("S2-desk-0900-play-A");
  await page.evaluate(()=>window.__treat.B({land:true,frame:false,title:["2 December 1805 · about nine o’clock","Soult storms the heights","Saint-Hilaire and Vandamme climb out of the fog onto the plateau"]})); await shot("S2-desk-0900-play-B");
  await page.evaluate(()=>window.__treat.B({land:true,filter:"brightness(1.72) contrast(.78) saturate(.5) sepia(.3)",title:["2 December 1805 · about nine o’clock","Soult storms the heights","Saint-Hilaire and Vandamme climb out of the fog onto the plateau"]})); await shot("S2-desk-0900-play-B2");
  await page.evaluate(()=>window.__treat.off());
  // the camera proposal: same clock, same target, the phase view's distance (150) and a slightly steeper look
  await page.evaluate(()=>{ var g=followGoal(); var d=g.dir.clone(); d.y+=0.10; d.normalize(); landCam.position.copy(g.T).addScaledVector(d,150); orbitTarget.copy(g.T); landCam.lookAt(orbitTarget); if(typeof clampCamera==="function") clampCamera(); requestRender(6); }); await settle(2500);
  say("S2 tighter framing metrics (labels as built)",await page.evaluate(()=>window.__audit.comp()));
  await shot("S2-desk-0900-tight-current-labels");
  await page.evaluate(()=>window.__treat.A()); await shot("S2-desk-0900-tight-A");
  await page.evaluate(()=>window.__treat.B({land:true,title:["2 December 1805 · about nine o’clock","Soult storms the heights","Saint-Hilaire and Vandamme climb out of the fog onto the plateau"]})); await shot("S2-desk-0900-tight-B");
  await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
