/* Journey 5 (visual range), desktop 1440x900 DPR1, llvmpipe. PROGRAMMATIC state for clock, presentation and ground (the app's own setClock,
   setPresentation, setMode); real clicks for the vantages, a real wheel for zoom. */
"use strict";
const L=require("./lib.js"); const fs=require("fs"), path=require("path");
const W=+(process.env.W||1440), H=+(process.env.H||900), TAG=process.env.TAG||"d1440";
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const {page,log}=await L.open(b,url,{w:W,h:H});
  const settle=async(ms)=>{ await L.sleep(ms||1800); await page.waitForFunction(()=>!tween,null,{timeout:30000}).catch(()=>{}); await L.sleep(700); };
  const set=async o=>{ await page.evaluate(o=>{ if(o.mode) setMode(o.mode); if(o.pres) setPresentation(o.pres); if(o.t!==undefined) setClock(o.t,{instant:true,force:true,camera:o.cam!==false}); },o); await settle(o.wait); };
  const van=async n=>{ await page.getByRole("button",{name:n,exact:true}).click(); await settle(3200); };
  const shot=async n=>{ await L.shot(page,"j5-"+TAG+"-"+n); console.log("shot",n,await page.evaluate(()=>({t:clock,pres:presentation,mode:mode,items:document.querySelectorAll("#maplayer .ml-item").length,cam:[camera.position.x,camera.position.y,camera.position.z].map(v=>Math.round(v))}))); };
  const three=async n=>{ for(const p of ["study","watch","clean"]){ await set({pres:p,wait:900}); await shot(n+"-"+p); } await set({pres:"study",wait:600}); };
  const step=async(name,f)=>{ try{ await f(); }catch(e){ console.log(name+" ERROR",String(e).slice(0,300)); } };
  await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(1200);
  await step("A",async()=>{ await set({t:240}); await van("Overview"); await shot("A-0400-overview-study"); await set({pres:"watch"}); await shot("A-0400-overview-watch"); await set({pres:"clean"}); await shot("A-0400-overview-clean"); await set({pres:"study"}); });
  await step("K",async()=>{ await set({t:420,cam:false}); await shot("K-0700-overview-study"); });
  await step("B",async()=>{ await set({t:540,cam:false}); await three("B-0900-overview"); });
  await step("C",async()=>{ await van("Pratzen"); await three("C-0900-pratzen"); });
  await step("I",async()=>{ await van("Field"); await shot("I-0900-field-study"); await van("Zuran"); await shot("I-0900-zuran-study"); await van("Allied"); await shot("I-0900-allied-study"); });
  await step("D",async()=>{ await set({t:540,cam:true}); // the phase's own view
    await shot("D-0900-phaseview-study");
    const p=await page.evaluate(()=>{ const e=[...document.querySelectorAll("#maplayer .ml-item")].find(e=>/^Saint-Hilaire\s*[ABC]?$/.test((e.innerText||"").replace(/\s+/g," ").trim())&&+getComputedStyle(e).opacity>0.5); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+40}; });
    const q=p||{x:870,y:480}; await page.mouse.move(q.x,q.y); for(let i=0;i<5;i++){ await page.mouse.wheel(0,-240); await L.sleep(500); } await settle(1500); await shot("D-0900-close1-study");
    for(let i=0;i<4;i++){ await page.mouse.wheel(0,-240); await L.sleep(500); } await settle(1500); await shot("D-0900-close2-study"); await set({pres:"clean"}); await shot("D-0900-close2-clean"); await set({pres:"watch"}); await shot("D-0900-close2-watch"); await set({pres:"study"}); });
  await step("F",async()=>{ await set({t:885,cam:true,wait:3000}); await three("F-1445-phaseview"); await set({t:900,cam:false}); 
    const p=await page.evaluate(()=>{ const e=[...document.querySelectorAll("#maplayer .ml-item")].find(e=>/Satschan mere/.test(e.innerText||"")&&+getComputedStyle(e).opacity>0.5); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+10}; });
    const q=p||{x:900,y:500}; await page.mouse.move(q.x,q.y); for(let i=0;i<5;i++){ await page.mouse.wheel(0,-240); await L.sleep(500); } await settle(1500); await shot("F-1500-ponds-close-study"); await set({pres:"clean"}); await shot("F-1500-ponds-close-clean"); await set({pres:"study"}); });
  await step("J",async()=>{ await van("Overview"); await set({t:990,cam:false}); await shot("J-1630-overview-study"); await set({t:1080,cam:false}); await shot("J-1800-overview-study"); });
  await step("G",async()=>{ await set({t:540,cam:false}); await set({mode:"staff",wait:3500}); await three("G-0900-paper-entered");
    await page.mouse.move(W*0.58,H*0.45); for(let i=0;i<4;i++){ await page.mouse.wheel(0,-240); await L.sleep(500); } await settle(1500); await three("G-0900-paper-zoom1");
    for(let i=0;i<4;i++){ await page.mouse.wheel(0,-240); await L.sleep(500); } await settle(1500); await shot("G-0900-paper-zoom2-study");
    await set({t:240,cam:false}); await shot("G-0400-paper-zoom2-study"); await set({t:885,cam:false}); await shot("G-1445-paper-zoom2-study"); });
  await step("H",async()=>{ await set({mode:"hybrid",t:540,cam:false,wait:3500}); await van("Overview"); await shot("H-0900-counters-overview-study"); await van("Pratzen"); await shot("H-0900-counters-pratzen-study"); await set({mode:"terrain"}); });
  console.log("console",JSON.stringify(log));
  await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
