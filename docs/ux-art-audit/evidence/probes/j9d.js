/* Desktop rechecks and composition measures. Real input unless marked PROGRAMMATIC. */
"use strict";
const L=require("./lib.js"); const inject=require("./metrics.js");
const say=(k,v)=>console.log(k,typeof v==="string"?v:JSON.stringify(v));
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const step=async(name,f)=>{ try{ await f(); }catch(e){ say(name+" ERROR",String(e).slice(0,300)); } };
  const railX=async(page,t)=>{ const r=await page.evaluate(()=>{ const b=document.getElementById("timerail").getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height}; }); return {x:r.x+(t-240)/840*r.w,y:r.y+r.h-3}; };
  // ---- A: key at 1280x720
  await step("A",async()=>{ const {page}=await L.open(b,url,{w:1280,h:720}); await page.getByText("Show the key",{exact:true}).click(); await L.sleep(1200);
    say("A key clip",await page.evaluate(()=>{ const R=document.getElementById("lg-rows"), rb=R.getBoundingClientRect(), s=getComputedStyle(R); const inner=rb.left+R.clientLeft+R.clientWidth; let clipped=0, rows=0, worst=0;
      const tw=document.createTreeWalker(R,NodeFilter.SHOW_TEXT); let n; while((n=tw.nextNode())){ if(!n.nodeValue.trim()) continue; const r=document.createRange(); r.selectNodeContents(n); for(const q of r.getClientRects()){ if(q.width===0||q.bottom<rb.top||q.top>rb.bottom) continue; rows++; if(q.right>inner+0.5){ clipped++; worst=Math.max(worst,q.right-inner); } } }
      return {rowsBox:[Math.round(rb.width),Math.round(rb.height)],client:R.clientWidth,offset:R.offsetWidth,scrollbarPx:R.offsetWidth-R.clientWidth,scrollH:R.scrollHeight,lineRectsVisible:rows,lineRectsPastClientEdge:clipped,worstPx:+worst.toFixed(1),maxW:s.maxWidth,textAlign:s.textAlign}; }));
    await page.context().close(); });
  const {page,log}=await L.open(b,url,{w:1440,h:900}); await page.evaluate(inject);
  await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(1000);
  // ---- B: focus on a place the layer has not drawn (PROGRAMMATIC focus(), as Tab reaches it)
  await step("B",async()=>{ const r=await page.evaluate(async()=>{ const its=[].slice.call(document.querySelectorAll("#maplayer .ml-item")); const hid=its.filter(e=>+getComputedStyle(e).opacity<0.5); const e=hid.find(e=>/Telnitz|Zuran|Goldbach/.test(e.getAttribute("aria-label")||""))||hid[0]; if(!e) return "no hidden item"; e.focus(); const a=e.getBoundingClientRect(); await new Promise(r=>setTimeout(r,1500)); const z=e.getBoundingClientRect(), s=getComputedStyle(e); return {label:e.getAttribute("aria-label"),at0:[Math.round(a.x),Math.round(a.y)],after1500:[Math.round(z.x),Math.round(z.y)],opacity:s.opacity,cls:e.className,isActive:document.activeElement===e}; }); say("B focus on undrawn item",r); await L.shot(page,"j9-B-focus-undrawn"); });
  // ---- C: drags from a marker
  await step("C",async()=>{ const p9=await railX(page,540); await page.mouse.click(p9.x,p9.y); await L.sleep(2500);
    const ms=await page.evaluate(()=>[...document.querySelectorAll("#evmarks .ev-mark")].map(e=>{ const b=e.getBoundingClientRect(); return {x:b.x+b.width/2,y:b.y+b.height/2,label:e.getAttribute("aria-label")||""}; }));
    const m=ms.find(m=>/Kamensky/.test(m.label)); const c=()=>page.evaluate(()=>({clock:+clock.toFixed(1),drawer:document.getElementById("drawer").classList.contains("on")?(document.querySelector("#drawer h2")||{}).innerText:null,playing:playing,active:(document.activeElement.getAttribute("aria-label")||document.activeElement.id||"").slice(0,30)}));
    const b0=await c(); await page.mouse.move(m.x,m.y); await page.mouse.down(); await page.mouse.move(m.x+90,m.y); await page.mouse.up(); await L.sleep(1200); say("C1 fastest drag +90px from 'Kamensky 09:45' (585)",{before:b0,after:await c()});
    const b1=await c(); await page.mouse.move(m.x,m.y); await page.mouse.down(); await page.mouse.move(m.x+5,m.y); await page.mouse.up(); await L.sleep(1200); say("C2 5px slip",{before:b1,after:await c()});
    const b2=await c(); await page.mouse.move(m.x,m.y); await page.mouse.down(); await page.mouse.move(m.x+9,m.y); await page.mouse.up(); await L.sleep(1200); say("C3 9px slip",{before:b2,after:await c()});
    await page.keyboard.press("Escape"); await L.sleep(400); await page.locator("#play").click(); await L.sleep(2500); const b3=await c(); await page.mouse.move(m.x,m.y); await page.mouse.down(); await page.mouse.move(m.x+60,m.y,{steps:3}); await page.mouse.up(); await L.sleep(1500); say("C4 drag from marker while playing",{before:b3,after:await c()}); if(await page.evaluate(()=>playing)) await page.keyboard.press("Space");
    const b4=await c(); await page.mouse.move(m.x,m.y); await page.mouse.down(); await page.mouse.move(m.x+70,m.y-200,{steps:3}); await page.mouse.up(); await L.sleep(1200); say("C5 drag from marker released over the map",{before:b4,after:await c()}); });
  // ---- D: sources from the dossier's foot, and back
  await step("D",async()=>{ await page.keyboard.press("Escape"); await page.evaluate(()=>{ select("f","sthilaire"); }); await L.sleep(1500); await page.locator("#drawer").getByRole("button",{name:/^Full dossier/}).click(); await L.sleep(1500);
    const sb=page.locator("#drawer").getByRole("button",{name:"How this is sourced"}).last(); await sb.scrollIntoViewIfNeeded(); await L.sleep(400); const s0=await page.evaluate(()=>document.getElementById("drawer-body").scrollTop);
    await sb.click(); await L.sleep(1500); await page.keyboard.press("Escape"); await L.sleep(1200);
    say("D sources from the foot",await page.evaluate(s0=>({scrollBefore:Math.round(s0),scrollAfter:Math.round(document.getElementById("drawer-body").scrollTop),active:(document.activeElement.innerText||"").slice(0,30),activeInView:(function(){ const r=document.activeElement.getBoundingClientRect(); return r.top>=0&&r.bottom<=innerHeight; })()}),s0));
    say("D dossier metrics",await page.evaluate(()=>{ const d=document.getElementById("drawer-body"); const dt=d.querySelector(".daytrack"); return {scrollH:d.scrollHeight,clientH:d.clientHeight,screens:+(d.scrollHeight/d.clientHeight).toFixed(1),daytrackTop:dt?Math.round(dt.getBoundingClientRect().top-d.getBoundingClientRect().top+d.scrollTop):null,width:d.clientWidth}; }));
    await page.locator("#drawer-close").click(); await L.sleep(600); });
  // ---- E: plans, a theme, the tour
  await step("E",async()=>{ await page.locator("#tab-plans").click(); await L.sleep(600); await page.locator('.plan-btn[data-p="both"]').click(); await L.sleep(4500); await L.shot(page,"j9-E-plans-both"); say("E plans",await page.evaluate(()=>({clock:clock,text:document.getElementById("plans").innerText.replace(/\s+/g," ").slice(0,500)})));
    await page.locator("#tab-analysis").click(); await L.sleep(600); await page.getByText("The attack on the Pratzen",{exact:true}).click(); await L.sleep(4500); await L.shot(page,"j9-E-theme-pratzen"); say("E theme",await page.evaluate(()=>({clock:clock,text:document.getElementById("chaptext").innerText.replace(/\s+/g," ").slice(0,400)})));
    await page.locator("#tab-now").click(); await page.locator("#tourbtn").click(); await L.sleep(4500); await L.shot(page,"j9-E-tour-1"); say("E tour",await page.evaluate(()=>({n:document.getElementById("tour-n").innerText,t:document.getElementById("tour-t").innerText,x:document.getElementById("tour-x").innerText.slice(0,300)}))); await page.keyboard.press("Escape"); await L.sleep(1500); });
  // ---- F: composition while playing at half speed with Follow, Study then Watch (clock set PROGRAMMATICALLY to 08:30 first)
  await step("F",async()=>{ for(const pres of ["study","watch"]){ await page.evaluate(p=>{ setPresentation(p); setClock(510,{instant:true,force:true}); },pres); await L.sleep(3500);
      say("F "+pres+" paused phase view 08:30",await page.evaluate(()=>window.__audit.comp()));
      if((await page.locator("#follow").getAttribute("aria-pressed"))!=="true") await page.locator("#follow").click();
      await page.locator("#play").click(); const rows=[]; for(let i=0;i<16;i++){ await L.sleep(7000); const r=await page.evaluate(()=>window.__audit.comp()); rows.push(r); if(r.t>=560) break; }
      await page.keyboard.press("Space"); rows.forEach(r=>say("F "+pres+" play",{t:r.t,dist:r.dist,ev:r.events.map(e=>e.fx+","+e.fy+(e.inFree?"":"!OUT")).join(" "),onField:r.formations.onField,inFree:r.formations.inFree,bboxShare:r.bboxShare,bboxCy:r.bboxCy,labels:r.labels,cover:r.labelCover,coverInAction:r.labelCoverInAction,capCut:r.capCut}));
      await L.shot(page,"j9-F-play-end-"+pres); }
    await page.evaluate(()=>setPresentation("study")); });
  say("console",log);
  await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
