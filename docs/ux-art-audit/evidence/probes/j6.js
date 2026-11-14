/* Laptop and narrow breakpoints: real clicks. usage: W=1280 H=720 TAG=l1280 node j6.js */
"use strict";
const L=require("./lib.js");
const W=+(process.env.W||1280), H=+(process.env.H||720), TAG=process.env.TAG||"l1280";
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const {page,log}=await L.open(b,url,{w:W,h:H});
  const settle=async(ms)=>{ await L.sleep(ms||1500); await page.waitForFunction(()=>!tween,null,{timeout:30000}).catch(()=>{}); await L.sleep(600); };
  const info=()=>page.evaluate(()=>{ const a=document.activeElement; const vis=e=>{ if(!e) return false; const r=e.getBoundingClientRect(), s=getComputedStyle(e); return r.width>0&&r.height>0&&s.visibility!=="hidden"&&s.display!=="none"&&!e.closest("[inert]"); };
    const box=id=>{ const e=document.getElementById(id); if(!vis(e)) return null; const r=e.getBoundingClientRect(); return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]; };
    let fr=null; try{ fr=MAPCAM.freeRect(); }catch(e){}
    // clipped text: elements whose scrollWidth exceeds clientWidth with ellipsis
    const clipped=[...document.querySelectorAll("button,span,div,b,h1,h2,h3,p")].filter(e=>vis(e)&&e.children.length===0&&e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).overflow!=="visible"&&(e.innerText||"").trim()).map(e=>(e.id?"#"+e.id+" ":"")+(e.className||"").toString().slice(0,18)+":"+(e.innerText||"").trim().slice(0,30)).slice(0,12);
    return {hhmm:(Math.floor(clock/60)+"").padStart(2,"0")+":"+(Math.floor(clock%60)+"").padStart(2,"0"),pres:presentation,mode:mode,low:lowTier,phone:typeof PHONE!=="undefined"&&!!PHONE,body:document.body.className,
      active:a&&((a.id?"#"+a.id:"")+"<"+a.tagName+">"+(a.innerText||"").trim().slice(0,24)),free:fr,freeShare:fr?+(((fr[2]-fr[0])*(fr[3]-fr[1]))/(innerWidth*innerHeight)).toFixed(3):null,
      rail:box("rail"),dispatch:box("dispatch"),timebar:(function(){ const e=document.querySelector(".timebar,#timebar,footer"); if(!e) return null; const r=e.getBoundingClientRect(); return [Math.round(r.y),Math.round(r.height)]; })(),legend:(function(){ const e=document.querySelector(".legend"); if(!vis(e)) return null; const r=e.getBoundingClientRect(); return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]; })(),
      items:[...document.querySelectorAll("#maplayer .ml-item")].filter(e=>+getComputedStyle(e).opacity>0.5).length,clipped:clipped,hscroll:document.documentElement.scrollWidth>innerWidth}; });
  const shot=async n=>{ await L.shot(page,"j6-"+TAG+"-"+n); console.log(n,JSON.stringify(await info())); };
  const step=async(name,f)=>{ try{ await f(); }catch(e){ console.log(name+" ERROR",String(e).slice(0,300)); } };
  const railX=async t=>{ const r=await page.evaluate(()=>{ const b=document.getElementById("timerail").getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height}; }); return {x:r.x+(t-240)/840*r.w,y:r.y+r.h-3}; };
  await shot("01-cold");
  await step("key",async()=>{ await page.getByText("Show the key",{exact:true}).click(); await L.sleep(1200); await shot("02-key"); });
  await step("explore",async()=>{ const fr=page.getByRole("button",{name:"Explore on my own"}); if(await fr.isVisible().catch(()=>false)) await fr.click(); await L.sleep(1000); await shot("03-explore-0400"); });
  await step("0900",async()=>{ await page.evaluate(()=>setClock(540,{instant:true,force:true})); await settle(3000); await shot("04-0900-study"); });
  await step("dossier",async()=>{ const p=await page.evaluate(()=>{ const e=[...document.querySelectorAll("#maplayer .ml-item")].find(e=>/^(Saint-Hilaire|Vandamme)\s*[ABC]?$/.test((e.innerText||"").replace(/\s+/g," ").trim())&&+getComputedStyle(e).opacity>0.5); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; });
    if(!p) return console.log("no label"); await page.mouse.click(p.x,p.y); await settle(2500); await shot("05-dossier"); await page.keyboard.press("Escape"); await L.sleep(800); console.log("after Esc",JSON.stringify((await info()).active)); });
  await step("layers",async()=>{ await page.locator("#layersbtn").click(); await L.sleep(1000); await shot("06-layers"); await page.keyboard.press("Escape"); await L.sleep(600); });
  await step("panels",async()=>{ const pb=page.locator("#panelsbtn"); if(await pb.isVisible().catch(()=>false)){ await pb.click(); await L.sleep(1200); await shot("06b-panels"); await pb.click(); await L.sleep(800); } });
  await step("watch",async()=>{ await page.getByRole("button",{name:"Watch",exact:true}).click(); await settle(2000); await shot("07-watch"); await page.getByRole("button",{name:"Study",exact:true}).click(); await settle(1200); });
  await step("paper",async()=>{ await page.locator("#layersbtn").click(); await L.sleep(600); await page.locator('.mode-btn[data-m="staff"]').click(); await L.sleep(600); await page.keyboard.press("Escape"); await settle(3000); await shot("08-paper"); });
  await step("help",async()=>{ await page.locator("#helpbtn").click(); await L.sleep(1000); await shot("09-help"); await page.keyboard.press("Escape"); });
  console.log("console",JSON.stringify(log));
  await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
