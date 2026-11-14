/* Journey 3 part 2 (formation dossier, day-track, sources and return, Whose eyes?, Plans), desktop 1440x900 DPR1, llvmpipe. Real input. */
"use strict";
const L=require("./lib.js"); const fs=require("fs"), path=require("path");
const J=[]; const say=(k,v)=>{ J.push([k,v]); console.log(k,JSON.stringify(v)); };
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const {page,log,ctx}=await L.open(b,url,{w:1440,h:900});
  const st=()=>page.evaluate(()=>{ const d=document.getElementById("drawer"), dr=d.getBoundingClientRect(), a=document.activeElement, m=document.getElementById("modal");
    return {hhmm:(Math.floor(clock/60)+"").padStart(2,"0")+":"+(Math.floor(clock%60)+"").padStart(2,"0"),clock:+clock.toFixed(2),playing:playing,
    drawer:{on:d.classList.contains("on"),head:(d.querySelector("h2,h3")||{}).innerText||"",scroll:Math.round((d.querySelector("#drawer-body")||d).scrollTop)},
    modal:m.classList.contains("on"),
    active:a&&((a.id?"#"+a.id:"")+"."+(a.className&&a.className.baseVal!==undefined?a.className.baseVal:(a.className||"")).toString().slice(0,40)+"<"+a.tagName+">"+(a.innerText||a.getAttribute("aria-label")||"").trim().slice(0,50)),
    activeVisible:(function(){ if(!a||a===document.body) return null; const r=a.getBoundingClientRect(); return r.width>0&&r.top>=0&&r.bottom<=innerHeight; })(),
    cam:[camera.position.x,camera.position.y,camera.position.z].map(v=>+v.toFixed(1))}; });
  const railX=async t=>{ const r=await page.evaluate(()=>{ const b=document.getElementById("timerail").getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height}; }); return {x:r.x+(t-240)/840*r.w,y:r.y+r.h/2}; };
  const step=async(name,f)=>{ try{ await f(); }catch(e){ say(name+" ERROR",String(e).slice(0,400)); } };
  const items=()=>page.evaluate(()=>[...document.querySelectorAll("#maplayer .ml-item")].filter(e=>{ const b=e.getBoundingClientRect(), s=getComputedStyle(e); return b.width>0&&+s.opacity>0.5&&s.visibility!=="hidden"; }).map(e=>{ const b=e.getBoundingClientRect(); return {x:b.x+b.width/2,y:b.y+b.height/2,t:(e.innerText||"").replace(/\s+/g," ").trim().slice(0,60)}; }));
  await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(1200);
  const p9=await railX(540); await page.mouse.click(p9.x,p9.y); await L.sleep(3500);
  await step("formation card",async()=>{
    const it=await items(); const f=it.find(i=>/^Saint-Hilaire( [ABC])?$/.test(i.t));
    await page.mouse.click(f.x,f.y); await L.sleep(3000); say("clicked '"+f.t+"'",await st()); await L.shot(page,"j3-05-formation-card");
    say("drawer text",await page.evaluate(()=>document.getElementById("drawer-body").innerText.slice(0,1800)));
    say("drawer buttons",await page.evaluate(()=>[...document.querySelectorAll("#drawer button, #drawer a, #drawer [tabindex]")].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.innerText||e.getAttribute("aria-label")||"").trim().slice(0,40)+"@"+Math.round(e.getBoundingClientRect().y))));
  });
  await step("full dossier",async()=>{
    const btn=page.locator("#drawer").getByRole("button",{name:/full dossier|Open the dossier|dossier/i}).first();
    say("full-dossier button",await btn.innerText().catch(e=>"none: "+e.message.slice(0,80)));
    await btn.click(); await L.sleep(2500); say("full dossier",await st()); await L.shot(page,"j3-06-full-dossier");
    const txt=await page.evaluate(()=>document.getElementById("drawer-body").innerText); say("dossier length chars",txt.length); say("dossier text head",txt.slice(0,1500));
    const dt=await page.evaluate(()=>{ const s=document.querySelector("#drawer .daytrack, #drawer svg.dt, #drawer [class*=dt]"); if(!s) return null; s.scrollIntoView({block:"center"}); const r=s.getBoundingClientRect(); return {cls:s.className.baseVal||s.className,x:r.x,y:r.y,w:r.width,h:r.height}; });
    say("day-track element",dt); await L.sleep(800); await L.shot(page,"j3-07-daytrack");
  });
  await step("day-track anchor paused",async()=>{
    const anchors=await page.evaluate(()=>[...document.querySelectorAll("#drawer [class*=dt] [tabindex], #drawer [class*=dt] button, #drawer svg [role=button]")].map(e=>{ const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,w:Math.round(r.width),h:Math.round(r.height),label:e.getAttribute("aria-label")||e.textContent.slice(0,40)}; }));
    say("anchors",anchors);
    if(!anchors.length) return;
    const a=anchors[Math.min(2,anchors.length-1)]; const before=await st();
    await page.mouse.click(a.x,a.y); await L.sleep(2500); say("anchor '"+a.label+"' clicked while paused",{before:before,after:await st()}); await L.shot(page,"j3-08-anchor-paused");
    // while playing
    await page.locator("#play").click(); await L.sleep(4000); const b1=await st();
    const anchors2=await page.evaluate(()=>[...document.querySelectorAll("#drawer [class*=dt] [tabindex], #drawer [class*=dt] button, #drawer svg [role=button]")].map(e=>{ const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,label:e.getAttribute("aria-label")||e.textContent.slice(0,40),inView:r.top>=0&&r.bottom<=innerHeight}; }));
    say("anchors while playing",{n:anchors2.length,inView:anchors2.filter(a=>a.inView).length,drawerScroll:b1.drawer.scroll});
    const a2=anchors2[0]; if(a2){ await page.mouse.click(a2.x,a2.y); await L.sleep(2500); say("anchor '"+a2.label+"' clicked while playing",{before:b1,after:await st()}); await L.sleep(4000); say("4 s later",await st()); await L.shot(page,"j3-09-anchor-playing"); }
    if(await page.evaluate(()=>playing)) await page.keyboard.press("Space");
  });
  await step("sources and back",async()=>{
    const before=await st();
    const sb=page.locator("#drawer").getByRole("button",{name:"How this is sourced"}).first(); await sb.scrollIntoViewIfNeeded(); const scrollBefore=(await st()).drawer.scroll;
    await sb.click(); await L.sleep(2000); say("sources opened",await st()); await L.shot(page,"j3-10-sources");
    say("sheet head",await page.evaluate(()=>document.getElementById("modal-body").innerText.slice(0,1200)));
    say("sheet metrics",await page.evaluate(()=>{ const m=document.getElementById("modal-body"), r=m.getBoundingClientRect(); return {w:Math.round(r.width),h:Math.round(r.height),scrollH:m.scrollHeight,chars:m.innerText.length}; }));
    await page.keyboard.press("Escape"); await L.sleep(1200); const after=await st(); say("after Esc from sources",{scrollBefore:scrollBefore,after:after}); await L.shot(page,"j3-11-after-sources");
  });
  await step("whose eyes",async()=>{
    await page.locator("#drawer-close").click().catch(()=>{}); await L.sleep(800);
    await page.locator("#eyesbtn").click(); await L.sleep(2500); say("eyes 1",{...(await st()),btn:await page.locator("#eyesbtn").innerText()}); await L.shot(page,"j3-12-eyes-napoleon");
    await page.locator("#eyesbtn").click(); await L.sleep(2500); say("eyes 2",{btn:await page.locator("#eyesbtn").innerText()}); await L.shot(page,"j3-13-eyes-allied");
    await page.locator("#tab-command").click(); await L.sleep(1500); await L.shot(page,"j3-14-command-tab"); say("command tab",await page.evaluate(()=>document.getElementById("command").innerText.slice(0,1500)));
    await page.locator("#eyesbtn").click(); await L.sleep(1500); say("eyes 3",{btn:await page.locator("#eyesbtn").innerText()});
  });
  await step("plans",async()=>{
    await page.locator("#tab-plans").click(); await L.sleep(3500); say("plans",await st()); await L.shot(page,"j3-15-plans");
    say("plans text",await page.evaluate(()=>document.getElementById("plans").innerText.slice(0,1500)));
    await page.locator("#tab-analysis").click(); await L.sleep(2500); await L.shot(page,"j3-16-analysis"); say("analysis text",await page.evaluate(()=>document.getElementById("analysis").innerText.slice(0,800)));
    await page.locator("#tab-oob").click(); await L.sleep(1500); await L.shot(page,"j3-17-oob");
  });
  fs.writeFileSync(path.join(L.ROOT,"j3b-log.json"),JSON.stringify(J,null,1));
  say("console",log);
  await ctx.close(); await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
