/* Reduced motion, forced colours, 320 px reflow. Real clicks/taps; the clock set by the app's own setClock where noted (PROGRAMMATIC). */
"use strict";
const L=require("./lib.js");
const say=(k,v)=>console.log(k,typeof v==="string"?v:JSON.stringify(v));
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const step=async(name,f)=>{ try{ await f(); }catch(e){ say(name+" ERROR",String(e).slice(0,300)); } };
  // ---- reduced motion, 1280x720
  await step("rm",async()=>{
    const {page}=await L.open(b,url,{w:1280,h:720,reducedMotion:"reduce"});
    say("rm flags",await page.evaluate(()=>({RM:RM,mq:matchMedia("(prefers-reduced-motion: reduce)").matches})));
    await page.getByRole("button",{name:/Begin/}).click(); await L.sleep(1500); await L.shot(page,"j8-rm-01-opening1");
    const t0=Date.now(); await page.locator("#tour-next").click(); await L.sleep(1200); say("rm next: after 1.2 s",await page.evaluate(()=>({clock:clock,playing:playing,tween:!!tween,play:!!OPENING.play,head:document.getElementById("tour-n").innerText+" | "+document.getElementById("tour-t").innerText}))); await L.shot(page,"j8-rm-02-opening2");
    await page.keyboard.press("Escape"); await L.sleep(800);
    await page.evaluate(()=>setClock(525,{instant:true,force:true})); await L.sleep(1500);
    const c0=await page.evaluate(()=>[camera.position.x,camera.position.y,camera.position.z].map(v=>+v.toFixed(1)));
    await page.locator("#play").click(); await L.sleep(8000); const s=await page.evaluate(()=>({clock:+clock.toFixed(1),playing:playing,gaitAmp:(typeof GAIT!=="undefined"&&GAIT.amp!==undefined)?GAIT.amp:null,cam:[camera.position.x,camera.position.y,camera.position.z].map(v=>+v.toFixed(1)),smoke:Object.keys(units).filter(id=>units[id].smoke&&units[id].smoke.visible).length}));
    say("rm play 8 s",{c0,s}); await L.shot(page,"j8-rm-03-play"); await page.keyboard.press("Space");
    // a vantage click: cut or glide?
    await page.getByRole("button",{name:"Pratzen",exact:true}).click(); await L.sleep(300); say("rm vantage after 300 ms",await page.evaluate(()=>({tween:!!tween,cam:[camera.position.x,camera.position.y,camera.position.z].map(v=>+v.toFixed(1))})));
    await page.context().close(); });
  // ---- forced colours, 1280x720
  await step("fc",async()=>{
    const {page}=await L.open(b,url,{w:1280,h:720,forcedColors:"active"});
    say("fc mq",await page.evaluate(()=>matchMedia("(forced-colors: active)").matches));
    await L.shot(page,"j8-fc-01-cold");
    await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(800);
    await page.evaluate(()=>setClock(540,{instant:true,force:true})); await L.sleep(3000); await L.shot(page,"j8-fc-02-0900");
    const p=await page.evaluate(()=>{ const e=[...document.querySelectorAll("#maplayer .ml-item")].find(e=>/^(Saint-Hilaire|Vandamme)\s*[ABC]?$/.test((e.innerText||"").replace(/\s+/g," ").trim())&&+getComputedStyle(e).opacity>0.5); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; });
    if(p){ await page.mouse.click(p.x,p.y); await L.sleep(2500); await L.shot(page,"j8-fc-03-dossier"); await page.keyboard.press("Escape"); }
    await page.keyboard.press("m"); await L.sleep(3500); await L.shot(page,"j8-fc-04-paper");
    await page.locator("#lg-toggle").click(); await L.sleep(800); await L.shot(page,"j8-fc-05-key");
    await page.context().close(); });
  // ---- 320 x 256 at density 4 (a desktop at 400%: fine pointer, no touch)
  await step("z320",async()=>{
    const {page}=await L.open(b,url,{w:320,h:256,dpr:4});
    const info=()=>page.evaluate(()=>({phone:!!PHONE,body:document.body.className,hscroll:document.documentElement.scrollWidth>innerWidth,vscroll:document.documentElement.scrollHeight>innerHeight,active:document.activeElement&&(document.activeElement.id||document.activeElement.tagName),
      vis:[...document.querySelectorAll("button")].filter(e=>{ const r=e.getBoundingClientRect(), s=getComputedStyle(e); return r.width>0&&s.visibility!=="hidden"&&!e.closest("[inert]")&&r.bottom>0&&r.top<innerHeight; }).map(e=>(e.id||(e.innerText||"").trim().slice(0,12))+":"+Math.round(e.getBoundingClientRect().width)+"x"+Math.round(e.getBoundingClientRect().height)).slice(0,30)}));
    await L.shot(page,"j8-z320-01-cold"); say("z320 cold",await info());
    await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(1000); await L.shot(page,"j8-z320-02-explore"); say("z320 explore",await info());
    const pb=page.locator("#phasebtn"); if(await pb.isVisible().catch(()=>false)){ await pb.click(); await L.sleep(800); await L.shot(page,"j8-z320-03-phase"); say("z320 phase text",await info()); await pb.click().catch(()=>{}); await page.keyboard.press("Escape"); await L.sleep(500); }
    await page.locator("#menubtn").click(); await L.sleep(800); await L.shot(page,"j8-z320-04-menu"); say("z320 menu",await info());
    await page.locator("#play").click({force:true}).catch(e=>say("play click",String(e).slice(0,100))); await L.sleep(6000); await L.shot(page,"j8-z320-05-play"); say("z320 play",await page.evaluate(()=>({clock:clock,playing:playing})));
    await page.context().close(); });
  await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
