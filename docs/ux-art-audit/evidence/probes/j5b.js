/* Journey 5, second set: Clean, the ponds, landmarks close, paper map deep zoom. PROGRAMMATIC clock/presentation/ground; real clicks and wheel. */
"use strict";
const L=require("./lib.js");
const W=1440,H=900,TAG="d1440";
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const {page,log}=await L.open(b,url,{w:W,h:H});
  const settle=async(ms)=>{ await L.sleep(ms||1800); await page.waitForFunction(()=>!tween,null,{timeout:30000}).catch(()=>{}); await L.sleep(700); };
  const set=async o=>{ await page.evaluate(o=>{ if(o.mode) setMode(o.mode); if(o.pres) setPresentation(o.pres); if(o.t!==undefined) setClock(o.t,{instant:true,force:true,camera:o.cam!==false}); },o); await settle(o.wait); };
  const van=async n=>{ await page.getByRole("button",{name:n,exact:true}).click(); await settle(3200); };
  const info=()=>page.evaluate(()=>({t:clock,pres:presentation,mode:mode,follow:document.getElementById("follow").getAttribute("aria-pressed"),items:[...document.querySelectorAll("#maplayer .ml-item")].filter(e=>+getComputedStyle(e).opacity>0.5).length,cam:[camera.position.x,camera.position.y,camera.position.z].map(v=>Math.round(v))}));
  const shot=async n=>{ await L.shot(page,"j5-"+TAG+"-"+n); console.log("shot",n,JSON.stringify(await info())); };
  const step=async(name,f)=>{ try{ await f(); }catch(e){ console.log(name+" ERROR",String(e).slice(0,300)); } };
  const label=re=>page.evaluate(re=>{ const e=[...document.querySelectorAll("#maplayer .ml-item")].find(e=>new RegExp(re).test((e.innerText||"").replace(/\s+/g," ").trim())&&+getComputedStyle(e).opacity>0.5); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; },re);
  const zoom=async(x,y,n)=>{ await page.mouse.move(x,y); for(let i=0;i<n;i++){ await page.mouse.wheel(0,-240); await L.sleep(450); } await settle(1500); };
  await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(1200);
  await step("clean",async()=>{ await set({t:540}); await van("Overview"); await set({pres:"map"}); await shot("B-0900-overview-clean"); await van2(); });
  async function van2(){ await set({pres:"study"}); await van("Pratzen"); await set({pres:"map"}); await shot("C-0900-pratzen-clean"); await set({pres:"study"}); }
  await step("ponds",async()=>{ if((await info()).follow!=="true") await page.locator("#follow").click(); await set({t:885,cam:true,wait:3500}); await shot("F-1445-follow-study"); await set({pres:"watch"}); await shot("F-1445-follow-watch"); await set({pres:"map"}); await shot("F-1445-follow-clean"); await set({pres:"study"});
    await set({t:900,cam:true,wait:3000}); const p=await label("^Satschan mere$")||{x:900,y:560}; await zoom(p.x,p.y+25,5); await shot("F-1500-mere-close-study"); await set({pres:"watch"}); await shot("F-1500-mere-close-watch"); await set({pres:"study"}); await zoom(p.x,p.y+25,4); await shot("F-1500-mere-closer-study"); });
  await step("landmarks",async()=>{ await page.locator("#follow").click().catch(()=>{}); await set({t:600,cam:true,wait:3000}); await van("Field");
    let p=await label("^Sokolnitz$"); console.log("sokolnitz",p); if(p){ await zoom(p.x,p.y+14,9); await shot("E-1000-sokolnitz-close-study"); await set({pres:"map"}); await shot("E-1000-sokolnitz-close-clean"); await set({pres:"study"}); await zoom(W*0.6,H*0.5,4); await shot("E-1000-sokolnitz-closer-study"); }
    await van("Field"); p=await label("^The Santon$"); console.log("santon",p); if(p){ await zoom(p.x,p.y+14,10); await shot("E-1000-santon-close-study"); }
    await van("Field"); p=await label("^Austerlitz$"); console.log("austerlitz",p); if(p){ await zoom(p.x,p.y+14,10); await shot("E-1000-austerlitz-close-study"); } });
  await step("paper deep",async()=>{ await set({t:540,cam:false}); await set({mode:"staff",wait:3500}); await zoom(W*0.58,H*0.45,14); await shot("G-0900-paper-zoom3-study"); await zoom(W*0.58,H*0.45,6); await shot("G-0900-paper-zoom4-study");
    const it=await page.evaluate(()=>[...document.querySelectorAll("#maplayer .ml-item")].filter(e=>+getComputedStyle(e).opacity>0.5).map(e=>(e.innerText||"").replace(/\s+/g," ").trim().slice(0,40))); console.log("paper deep items",JSON.stringify(it)); });
  console.log("console",JSON.stringify(log));
  await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
