/* Keyboard-only journey, 1280x720 DPR1, llvmpipe. Keys only after load (no mouse). */
"use strict";
const L=require("./lib.js");
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const {page,log}=await L.open(b,url,{w:1280,h:720});
  const act=()=>page.evaluate(()=>{ const a=document.activeElement; if(!a||a===document.body) return "BODY"; const r=a.getBoundingClientRect(), s=getComputedStyle(a);
    const ring=(s.outlineStyle!=="none"&&parseFloat(s.outlineWidth)>0)?s.outlineWidth+" "+s.outlineColor:(s.boxShadow!=="none"?"shadow":"NONE");
    return (a.id?"#"+a.id:"")+"<"+a.tagName.toLowerCase()+(a.getAttribute("role")?"/"+a.getAttribute("role"):"")+">'"+(a.getAttribute("aria-label")||a.innerText||"").trim().replace(/\s+/g," ").slice(0,34)+"' @"+Math.round(r.x)+","+Math.round(r.y)+" "+Math.round(r.width)+"x"+Math.round(r.height)+" ring:"+ring+(r.bottom<0||r.top>innerHeight||r.width===0?" OFFSCREEN":""); });
  const st=()=>page.evaluate(()=>({hhmm:(Math.floor(clock/60)+"").padStart(2,"0")+":"+(Math.floor(clock%60)+"").padStart(2,"0"),playing:playing,pres:presentation,drawer:document.getElementById("drawer").classList.contains("on"),help:!document.getElementById("help").hidden,modal:document.getElementById("modal").classList.contains("on")}));
  const key=async(k,n)=>{ for(let i=0;i<(n||1);i++){ await page.keyboard.press(k); await L.sleep(140); } };
  const say=(k,v)=>console.log(k,typeof v==="string"?v:JSON.stringify(v));
  say("load focus",await act());
  const card=[]; for(let i=0;i<4;i++){ await key("Tab"); card.push(await act()); } say("card Tab x4",card);
  await key("Shift+Tab",1); say("shift-tab",await act());
  // to Explore on my own and Enter
  for(let i=0;i<4;i++){ if(/Explore/.test(await act())) break; await key("Tab"); }
  await key("Enter"); await L.sleep(800); say("after Enter on Explore",await act()); say("state",await st());
  // tab order from Play: 60 stops
  const order=[]; for(let i=0;i<70;i++){ await key("Tab"); order.push(await act()); }
  console.log("TAB ORDER from Play:\n"+order.map((o,i)=>(i+1)+" "+o).join("\n"));
  await L.shot(page,"j7-01-after-70-tabs");
  // go to the slider by Shift+Tab until timerail
  let guard=0; while(!/#timerail/.test(await act())&&guard++<120) await key("Shift+Tab");
  say("on slider after shift-tabs",{n:guard,a:await act()});
  await key("ArrowRight",3); say("3x ArrowRight",await st()); await key("Shift+ArrowRight"); say("Shift+ArrowRight",await st()); await key("PageDown"); say("PageDown",await st()); await key("End"); say("End",await st()); await key("Home"); say("Home",await st());
  await page.evaluate(()=>{}); await key("PageDown",3); await L.sleep(2500); say("PageDown x3",await st()); await L.shot(page,"j7-02-slider-focus");
  // Space off a button plays?
  await key("Space"); await L.sleep(3000); say("Space on slider",await st()); await key("Space"); await L.sleep(500); say("Space again",await st());
  // to a map item
  guard=0; while(!/ml-|maplayer|<div\/button>|<div>/.test(await act())&&guard++<80) await key("Tab");
  say("first map item after tabs",{n:guard,a:await act()}); await L.shot(page,"j7-03-map-item-focus");
  const mapItems=[]; for(let i=0;i<12;i++){ mapItems.push(await act()); await key("Tab"); } console.log("MAP ITEMS:\n"+mapItems.join("\n"));
  // find a formation and press Enter
  guard=0; while(!/(Saint-Hilaire|Vandamme|Kollowrat|Miloradovich|Legrand|Friant|Headquarters)/.test(await act())&&guard++<60) await key("Tab");
  const opener=await act(); say("opener",opener); await key("Enter"); await L.sleep(2500); say("after Enter on map item",{a:await act(),s:await st()}); await L.shot(page,"j7-04-dossier-by-key");
  const inD=[]; for(let i=0;i<6;i++){ await key("Tab"); inD.push(await act()); } console.log("IN DOSSIER:\n"+inD.join("\n"));
  await key("Escape"); await L.sleep(1200); say("after Esc from dossier",{a:await act(),s:await st()});
  // help
  await key("?"); await L.sleep(1000); say("after ?",{a:await act(),s:await st()}); await L.shot(page,"j7-05-help");
  say("help text",await page.evaluate(()=>document.getElementById("help").innerText.replace(/\n+/g," | ").slice(0,3000)));
  await key("Escape"); await L.sleep(800); say("after Esc from help",await act());
  // single-key shortcuts
  await key("w"); await L.sleep(1200); say("after w",await st()); await key("s"); await L.sleep(800); say("after s",await st());
  await key("m"); await L.sleep(2500); say("after m",await page.evaluate(()=>mode)); await key("m"); await L.sleep(2000);
  await key("f"); await L.sleep(500); say("after f follow",await page.evaluate(()=>document.getElementById("follow").getAttribute("aria-pressed")));
  await key("."); await L.sleep(1500); say("after . (next event?)",await st()); await key(","); await L.sleep(1500); say("after ,",await st());
  // key panel metrics (scrollbar clipping)
  say("key metrics",await page.evaluate(()=>{ const t=document.getElementById("lg-toggle"); if(t&&t.getAttribute("aria-expanded")!=="true") t.click(); const e=document.getElementById("lg-rows")||document.querySelector(".legend"); const L2=document.querySelector(".legend"); const s=getComputedStyle(L2); const kids=[...L2.querySelectorAll("*")].filter(k=>k.getBoundingClientRect().right>L2.getBoundingClientRect().left+L2.clientLeft+L2.clientWidth+0.5).length;
    return {legend:{cw:L2.clientWidth,ow:L2.offsetWidth,sh:L2.scrollHeight,ch:L2.clientHeight,ovY:s.overflowY,scheme:s.colorScheme},rows:e?{cw:e.clientWidth,sw:e.scrollWidth,ovY:getComputedStyle(e).overflowY}:null,kidsBeyondClient:kids,root:getComputedStyle(document.documentElement).colorScheme}; }));
  console.log("console",JSON.stringify(log));
  await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
