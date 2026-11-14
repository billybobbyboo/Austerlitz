/* Journey 2 (follow the action), desktop 1440x900 DPR1, llvmpipe, video recorded. Real clicks, keys and drags only. */
"use strict";
const L=require("./lib.js"); const fs=require("fs"), path=require("path");
const OUT=path.join(L.ROOT,"video","j2"); fs.mkdirSync(OUT,{recursive:true});
const J=[]; const say=(k,v)=>{ J.push([k,v]); console.log(k,JSON.stringify(v)); };
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const {page,log,ctx}=await L.open(b,url,{w:1440,h:900,video:OUT});
  const st=()=>page.evaluate(()=>({hhmm:(Math.floor(clock/60)+"").padStart(2,"0")+":"+(Math.floor(clock%60)+"").padStart(2,"0"),clock:+clock.toFixed(2),playing:playing,speed:speed,follow:typeof FOLLOW!=="undefined"?FOLLOW.on:null,sel:typeof selected!=="undefined"?selected:null,
    drawer:document.getElementById("drawer").classList.contains("open")||!document.getElementById("drawer").hidden&&document.getElementById("drawer").getBoundingClientRect().width>0,
    cap:(document.getElementById("tb-cap").innerText||"").replace(/\s+/g," "),active:document.activeElement&&(document.activeElement.id||document.activeElement.className||document.activeElement.tagName),
    cam:[camera.position.x,camera.position.y,camera.position.z].map(v=>+v.toFixed(1)),labels:document.querySelectorAll("#maplayer .ml:not(.ml-hidden)").length}));
  const railX=async t=>{ const r=await page.evaluate(()=>{ const b=document.getElementById("timerail").getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height}; }); return {x:r.x+(t-240)/840*r.w,y:r.y+r.h/2}; };
  const step=async(name,f)=>{ try{ await f(); }catch(e){ say(name+" ERROR",String(e).slice(0,300)); } };
  await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(1200);
  await step("click rail 08:30",async()=>{ const p=await railX(510); await page.mouse.click(p.x,p.y); await L.sleep(2500); say("after rail click 08:30",await st()); await L.shot(page,"j2-01-0830"); });
  await step("play half",async()=>{
    await page.locator("#play").click(); say("play clicked",await st());
    for(let i=0;i<14;i++){ await L.sleep(9000); const s=await st(); say("play ½× t+"+((i+1)*9)+"s",s); if(i%2===1) await L.shot(page,"j2-02-play-"+String(i).padStart(2,"0")+"-"+s.hhmm.replace(":","")); if(s.clock>=556) break; }
    await page.keyboard.press("Space"); await L.sleep(1200); say("paused by Space",await st()); await L.shot(page,"j2-03-paused");
  });
  await step("scrub",async()=>{
    const a=await page.evaluate(()=>{ const b=document.getElementById("playhead").getBoundingClientRect(); return {x:b.x+b.width/2,y:b.y+b.height/2}; }); const to=await railX(600);
    await page.mouse.move(a.x,a.y); await page.mouse.down(); for(let i=1;i<=8;i++){ await page.mouse.move(a.x+(to.x-a.x)*i/8,a.y); await L.sleep(250); } say("scrub mid-drag",await st()); await page.mouse.up(); await L.sleep(1500);
    say("after scrub to 10:00",await st()); await L.shot(page,"j2-04-scrubbed-1000");
  });
  await step("speed 4x",async()=>{
    const p=await railX(525); await page.mouse.click(p.x,p.y); await L.sleep(1500);
    await page.locator('.spd-btn[data-s="4"]').click(); await page.locator("#play").click(); say("4× play from 08:45",await st());
    for(let i=0;i<6;i++){ await L.sleep(6000); const s=await st(); say("play 4× t+"+((i+1)*6)+"s",s); if(i%2===1) await L.shot(page,"j2-05-play4x-"+i+"-"+s.hhmm.replace(":","")); }
    await page.locator("#play").click(); await L.sleep(1000); say("paused by button",await st());
    await page.locator('.spd-btn[data-s="0.5"]').click();
  });
  await step("follow off",async()=>{
    const p=await railX(540); await page.mouse.click(p.x,p.y); await L.sleep(1500); const c0=(await st()).cam;
    await page.locator("#follow").click(); say("follow toggled",await st());
    await page.locator("#play").click(); await L.sleep(15000); await page.keyboard.press("Space"); const s=await st(); say("played 15 s without follow",{c0,s}); await L.shot(page,"j2-06-nofollow");
    await page.locator("#follow").click(); await L.sleep(2500); say("follow on again",await st()); await L.shot(page,"j2-07-follow-on-again");
  });
  await step("event marker click",async()=>{
    const ms=await page.evaluate(()=>[...document.querySelectorAll("#evmarks > *")].map(e=>{ const b=e.getBoundingClientRect(); return {x:b.x+b.width/2,y:b.y+b.height/2,w:b.width,h:b.height,tag:e.tagName,cls:e.className,label:e.getAttribute("aria-label")||e.title||"",t:e.dataset.t||e.dataset.at||""}; }));
    say("markers",ms.length+" "+JSON.stringify(ms.slice(0,6)));
    const m=ms.find(m=>/Saint-Hilaire|climb/i.test(m.label))||ms[5]; S.marker=m;
    await page.mouse.click(m.x,m.y); await L.sleep(2500); say("clicked marker "+m.label.slice(0,60),await st()); await L.shot(page,"j2-08-event-clicked");
  });
  var S={};
  await step("quick drag from a marker",async()=>{
    const ms=await page.evaluate(()=>[...document.querySelectorAll("#evmarks > *")].map(e=>{ const b=e.getBoundingClientRect(); return {x:b.x+b.width/2,y:b.y+b.height/2,label:e.getAttribute("aria-label")||""}; }));
    const m=ms[8]||ms[0]; const before=await st();
    await page.mouse.move(m.x,m.y); await page.mouse.down(); await page.mouse.move(m.x+60,m.y,{steps:2}); await page.mouse.move(m.x+160,m.y,{steps:2}); await page.mouse.up(); await L.sleep(1500);
    say("quick drag from marker "+m.label.slice(0,50),{before:before,after:await st()}); await L.shot(page,"j2-09-quick-drag");
    // and a slower drag
    const b2=await st(); await page.mouse.move(m.x,m.y); await page.mouse.down(); for(let i=1;i<=10;i++){ await page.mouse.move(m.x+i*16,m.y); await L.sleep(120); } await page.mouse.up(); await L.sleep(1200);
    say("slow drag from marker",{before:b2,after:await st()});
  });
  await step("select formation on map",async()=>{
    await page.keyboard.press("Escape"); await L.sleep(600);
    const items=await page.evaluate(()=>[...document.querySelectorAll("#maplayer .ml")].filter(e=>e.getBoundingClientRect().width>0&&getComputedStyle(e).visibility!=="hidden"&&getComputedStyle(e).opacity!=="0").map(e=>{ const b=e.getBoundingClientRect(); return {x:b.x+b.width/2,y:b.y+b.height/2,t:(e.innerText||"").replace(/\s+/g," ").slice(0,40),cls:e.className}; }));
    say("map items",items.length+" "+JSON.stringify(items.slice(0,40).map(i=>i.t)));
    const f=items.find(i=>/Saint-Hilaire|Vandamme|Miloradovich/.test(i.t)); if(!f) return say("no formation label found","");
    await page.mouse.click(f.x,f.y); await L.sleep(2500); say("clicked "+f.t,await st()); await L.shot(page,"j2-10-formation-selected");
  });
  say("console",log);
  await ctx.close(); await b.close(); server.close();
  fs.writeFileSync(path.join(L.ROOT,"j2-log.json"),JSON.stringify(J,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
