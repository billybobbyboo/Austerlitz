/* Journeys 2b and 3 (events, dossiers, day-track, sources, Whose eyes?, Plans), desktop 1440x900 DPR1, llvmpipe. Real clicks, keys, drags. */
"use strict";
const L=require("./lib.js"); const fs=require("fs"), path=require("path");
const J=[]; const say=(k,v)=>{ J.push([k,v]); console.log(k,JSON.stringify(v)); };
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const {page,log,ctx}=await L.open(b,url,{w:1440,h:900});
  const st=()=>page.evaluate(()=>{ const d=document.getElementById("drawer"), dr=d.getBoundingClientRect(), a=document.activeElement, m=document.getElementById("modal");
    return {hhmm:(Math.floor(clock/60)+"").padStart(2,"0")+":"+(Math.floor(clock%60)+"").padStart(2,"0"),clock:+clock.toFixed(2),playing:playing,
    sel:typeof selected!=="undefined"&&selected?JSON.stringify(selected).slice(0,80):null,
    drawer:{cls:d.className,x:Math.round(dr.x),w:Math.round(dr.width),h:Math.round(dr.height),head:(d.querySelector("h2,h3")||{}).innerText||""},
    modal:m&&m.classList.contains("on")||(m&&getComputedStyle(m).display!=="none"&&m.getBoundingClientRect().width>0),
    active:a&&((a.id?"#"+a.id:"")+"."+(a.className||"").toString().slice(0,40)+"<"+a.tagName+">"+(a.innerText||"").trim().slice(0,40)),
    cam:[camera.position.x,camera.position.y,camera.position.z].map(v=>+v.toFixed(1))}; });
  const railX=async t=>{ const r=await page.evaluate(()=>{ const b=document.getElementById("timerail").getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height}; }); return {x:r.x+(t-240)/840*r.w,y:r.y+r.h/2}; };
  const step=async(name,f)=>{ try{ await f(); }catch(e){ say(name+" ERROR",String(e).slice(0,400)); } };
  const items=()=>page.evaluate(()=>[...document.querySelectorAll("#maplayer .ml-item")].filter(e=>{ const b=e.getBoundingClientRect(), s=getComputedStyle(e); return b.width>0&&+s.opacity>0.5&&s.visibility!=="hidden"; }).map(e=>{ const b=e.getBoundingClientRect(); return {x:b.x+b.width/2,y:b.y+b.height/2,w:b.width,h:b.height,t:(e.innerText||"").replace(/\s+/g," ").slice(0,60),cls:e.className,role:e.getAttribute("role"),tab:e.tabIndex}; }));
  const marks=()=>page.evaluate(()=>[...document.querySelectorAll("#evmarks .ev-mark")].map(e=>{ const b=e.getBoundingClientRect(); return {x:b.x+b.width/2,y:b.y+b.height/2,w:b.width,h:b.height,label:e.getAttribute("aria-label")||e.title||"",cls:e.className}; }));
  await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(1200);
  const p9=await railX(540); await page.mouse.click(p9.x,p9.y); await L.sleep(3000);
  const ms=await marks(); say("event markers",{n:ms.length,sizes:[...new Set(ms.map(m=>Math.round(m.w)+"x"+Math.round(m.h)))],first:ms.slice(0,4)});
  await step("event marker click",async()=>{
    const m=ms.find(m=>/Saint-Hilaire and Vandamme/i.test(m.label))||ms[6];
    await page.mouse.move(m.x,m.y); await L.sleep(900); await L.shot(page,"j3-01-marker-hover",{clip:{x:300,y:700,width:1140,height:200}});
    say("tooltip",await page.evaluate(()=>{ const t=document.getElementById("tltip"); return t?{text:t.innerText,vis:getComputedStyle(t).visibility+"/"+getComputedStyle(t).opacity+"/"+t.hidden}:null; }));
    await page.mouse.click(m.x,m.y); await L.sleep(3000); say("clicked marker "+m.label.slice(0,70),await st()); await L.shot(page,"j3-02-event-open");
    say("drawer text",await page.evaluate(()=>document.getElementById("drawer-body").innerText.slice(0,1500)));
  });
  await step("quick drag from a marker",async()=>{
    const m=ms.find(m=>/Kutuzov orders/i.test(m.label))||ms[8]; const before=await st();
    await page.mouse.move(m.x,m.y); await page.mouse.down(); await page.mouse.move(m.x+40,m.y); await page.mouse.move(m.x+120,m.y); await page.mouse.up(); await L.sleep(1500);
    const expected=await page.evaluate(x=>{ const b=document.getElementById("timerail").getBoundingClientRect(); return 240+(x-b.x)/b.width*840; },m.x+120);
    say("quick drag from marker '"+m.label.slice(0,50)+"' +120px",{before:{clock:before.clock,drawer:before.drawer.head},after:await st(),railTimeUnderRelease:+expected.toFixed(1)}); await L.shot(page,"j3-03-quick-drag");
    const m2=ms.find(m=>/Thi.bault/i.test(m.label))||ms[5]; const b2=await st();
    await page.mouse.move(m2.x,m2.y); await page.mouse.down(); for(let i=1;i<=10;i++){ await page.mouse.move(m2.x+i*12,m2.y); await L.sleep(100); } const mid=await st(); await page.mouse.up(); await L.sleep(1200);
    say("slow drag from marker '"+m2.label.slice(0,50)+"' +120px",{before:b2.clock,mid:mid.clock,after:(await st()).clock});
    // a plain press and release with 3 px of jitter
    const m3=ms.find(m=>/Kamensky/i.test(m.label))||ms[9]; const b3=await st();
    await page.mouse.move(m3.x,m3.y); await page.mouse.down(); await page.mouse.move(m3.x+3,m3.y+1); await page.mouse.up(); await L.sleep(1500);
    say("press with 3px jitter on '"+m3.label.slice(0,50)+"'",{before:b3.clock,after:await st()});
  });
  await step("formation select on the map",async()=>{
    await page.keyboard.press("Escape"); await L.sleep(500);
    const p=await railX(540); await page.mouse.click(p.x,p.y); await L.sleep(3000);
    const it=await items(); say("map items at 09:00",{n:it.length,names:it.map(i=>i.t)});
    const f=it.find(i=>/^ ?Saint-Hilaire/.test(i.t))||it.find(i=>/Vandamme/.test(i.t));
    await page.mouse.move(f.x,f.y); await L.sleep(1000); await L.shot(page,"j3-04-label-hover");
    await page.mouse.click(f.x,f.y); await L.sleep(3000); say("clicked label "+f.t,await st()); await L.shot(page,"j3-05-formation-card");
    say("drawer text",await page.evaluate(()=>document.getElementById("drawer-body").innerText.slice(0,2500)));
    say("drawer buttons",await page.evaluate(()=>[...document.querySelectorAll("#drawer button, #drawer a, #drawer [tabindex]")].filter(e=>e.getBoundingClientRect().width>0).map(e=>({t:(e.innerText||e.getAttribute("aria-label")||"").trim().slice(0,50),id:e.id,cls:(e.className||"").toString().slice(0,30),y:Math.round(e.getBoundingClientRect().y),h:Math.round(e.getBoundingClientRect().height)}))));
  });
  fs.writeFileSync(path.join(L.ROOT,"j3-log.json"),JSON.stringify(J,null,1));
  say("console",log);
  await ctx.close(); await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
