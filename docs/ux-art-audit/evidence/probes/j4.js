/* Journey 4 (phone), 390x844 DPR3, touch, iPhone UA (emulation in Chromium; llvmpipe). Real taps. */
"use strict";
const L=require("./lib.js"); const fs=require("fs"), path=require("path");
const J=[]; const say=(k,v)=>{ J.push([k,v]); console.log(k,JSON.stringify(v)); };
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  let {page,log,ctx}=await L.open(b,url,{w:390,h:844,phone:true,dpr:3});
  const ctrls=()=>page.evaluate(()=>{ const vis=e=>{ const r=e.getBoundingClientRect(), s=getComputedStyle(e); return r.width>0&&r.height>0&&s.visibility!=="hidden"&&s.display!=="none"&&!e.closest("[inert]")&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth; };
    return [...document.querySelectorAll("button,[role=button],a,[role=tab],[role=slider]")].filter(vis).map(e=>{ const r=e.getBoundingClientRect(); return (e.id?"#"+e.id+" ":"")+"'"+(e.innerText||e.getAttribute("aria-label")||"").trim().replace(/\s+/g," ").slice(0,28)+"' "+Math.round(r.x)+","+Math.round(r.y)+" "+Math.round(r.width)+"x"+Math.round(r.height); }); });
  const st=()=>page.evaluate(()=>{ const a=document.activeElement; return {hhmm:(Math.floor(clock/60)+"").padStart(2,"0")+":"+(Math.floor(clock%60)+"").padStart(2,"0"),playing:playing,mode:mode,pres:presentation,low:lowTier,PHONE:typeof PHONE!=="undefined"?!!PHONE:null,
    body:document.body.className,active:a&&((a.id?"#"+a.id:"")+"<"+a.tagName+">"+(a.innerText||a.getAttribute("aria-label")||"").trim().slice(0,30)),
    free:(function(){ try{ var f=MAPCAM.freeRect?MAPCAM.freeRect():null; return f; }catch(e){ return String(e).slice(0,60); } })()}; });
  const step=async(name,f)=>{ try{ await f(); }catch(e){ say(name+" ERROR",String(e).slice(0,400)); } };
  const tap=async sel=>{ await page.tap(sel,{timeout:60000}); await L.sleep(900); };
  await L.shot(page,"j4-01-cold"); say("cold",await st()); say("cold ctrls",await ctrls());
  await step("key from card",async()=>{ await page.getByText("Show the key",{exact:true}).tap(); await L.sleep(1200); await L.shot(page,"j4-02-key"); say("key",await st()); say("key ctrls",await ctrls()); });
  await page.context().close();
  ({page,log,ctx}=await L.open(b,url,{w:390,h:844,phone:true,dpr:3}));
  await step("explore",async()=>{ await page.getByRole("button",{name:"Explore on my own"}).tap(); await L.sleep(1500); await L.shot(page,"j4-03-explore"); say("explore",await st()); say("explore ctrls",await ctrls()); });
  await step("menu",async()=>{ await tap("#menubtn"); await L.shot(page,"j4-04-menu"); say("menu ctrls",await ctrls()); say("menu state",await st()); });
  await step("layers",async()=>{ await tap("#layersbtn"); await L.sleep(600); await L.shot(page,"j4-05-layers"); say("layers ctrls",(await ctrls()).slice(0,40)); say("layers state",await st()); });
  await step("counters",async()=>{ await page.locator('.mode-btn[data-m]').filter({hasText:"Landscape with counters"}).tap(); await L.sleep(2500); await L.shot(page,"j4-06-layers-after-counters"); say("after counters",await st());
    await tap("#layerclose"); await L.sleep(1500); await L.shot(page,"j4-07-counters"); say("closed layers",await st()); say("ctrls",await ctrls()); });
  await step("paper",async()=>{ await tap("#menubtn"); await tap("#layersbtn"); await page.locator('.mode-btn[data-m="staff"]').tap(); await L.sleep(2500); await tap("#layerclose"); await L.sleep(2000); await L.shot(page,"j4-08-paper-0400"); say("paper",await st()); });
  await step("rail to 09:00 on phone",async()=>{
    const r=await page.evaluate(()=>{ const b=document.getElementById("timerail").getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height}; }); say("rail box",r);
    await page.touchscreen.tap(r.x+(540-240)/840*r.w,r.y+r.h/2); await L.sleep(3000); say("tapped rail 09:00",await st()); await L.shot(page,"j4-09-paper-0900");
  });
  await step("back to landscape + play",async()=>{ await tap("#menubtn"); await tap("#layersbtn"); await page.locator('.mode-btn[data-m="terrain"]').tap(); await L.sleep(2000); await tap("#layerclose"); await L.sleep(2500); await L.shot(page,"j4-10-land-0900"); say("land 0900",await st());
    await tap("#play"); for(let i=0;i<4;i++){ await L.sleep(8000); const s=await st(); say("phone play "+i,s); await L.shot(page,"j4-11-play-"+i+"-"+s.hhmm.replace(":","")); }
    await tap("#play"); say("paused",await st()); });
  await step("speed button",async()=>{ say("speed before",await page.locator("#speedbtn").innerText()); await tap("#speedbtn"); say("speed after 1 tap",await page.locator("#speedbtn").innerText()); await tap("#speedbtn"); await tap("#speedbtn"); await tap("#speedbtn"); say("speed after 4 taps",await page.locator("#speedbtn").innerText()); });
  await step("dispatch sheet",async()=>{ await tap("#dgrip"); await L.sleep(800); await L.shot(page,"j4-12-dispatch-open"); say("dispatch open",await st()); say("ctrls",(await ctrls()).slice(0,30)); await tap("#dgrip"); await L.sleep(800); say("dispatch closed",await st()); });
  await step("formation tap",async()=>{
    const it=await page.evaluate(()=>[...document.querySelectorAll("#maplayer .ml-item")].filter(e=>{ const b=e.getBoundingClientRect(), s=getComputedStyle(e); return b.width>0&&+s.opacity>0.5; }).map(e=>{ const b=e.getBoundingClientRect(); return {x:b.x+b.width/2,y:b.y+b.height/2,w:Math.round(b.width),h:Math.round(b.height),t:(e.innerText||"").replace(/\s+/g," ").trim().slice(0,50)}; }));
    say("phone map items",it.map(i=>i.t+" "+i.w+"x"+i.h));
    const f=it.find(i=>/^(Saint-Hilaire|Vandamme|Kamensky|Legrand|Friant|Miloradovich's Russians)\s*[ABC]?$/.test(i.t))||it.find(i=>/ [ABC]$/.test(i.t));
    if(!f) return; await page.touchscreen.tap(f.x,f.y); await L.sleep(3000); await L.shot(page,"j4-13-dossier"); say("tapped "+f.t,await st()); say("ctrls",(await ctrls()).slice(0,30));
    const full=page.locator("#drawer").getByRole("button",{name:/^Full dossier/}); if(await full.count()){ await full.first().tap(); await L.sleep(2000); await L.shot(page,"j4-14-full-dossier"); say("full",await st()); }
    await tap("#drawer-close"); await L.sleep(2000); await L.shot(page,"j4-15-after-dossier"); say("closed dossier",await st());
  });
  await step("rotate",async()=>{ await page.setViewportSize({width:844,height:390}); await L.sleep(3500); await L.shot(page,"j4-16-landscape-844x390"); say("rotated",await st()); say("ctrls",await ctrls());
    await page.setViewportSize({width:390,height:844}); await L.sleep(3500); await L.shot(page,"j4-17-back-portrait"); say("back",await st()); });
  fs.writeFileSync(path.join(L.ROOT,"j4-log.json"),JSON.stringify(J,null,1));
  say("console",log);
  await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
