/* Composition while playing (desktop 1440x900, then phone 390x844) and phone rechecks. Clock set PROGRAMMATICALLY to the start; Play by real click/tap. */
"use strict";
const L=require("./lib.js"); const inject=require("./metrics.js"); const fs=require("fs"), path=require("path");
const say=(k,v)=>console.log(k,typeof v==="string"?v:JSON.stringify(v));
const OUT={};
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const step=async(name,f)=>{ try{ await f(); }catch(e){ say(name+" ERROR",String(e).slice(0,300)); } };
  const row=r=>({t:r.t,dist:r.dist,ev:r.events.map(e=>e.fx+","+e.fy+(e.inFree?"":"!OUT")).join(" "),on:r.formations.onField,inFree:r.formations.inFree,bbox:r.bboxShare,cy:r.bboxCy,labels:r.labels,cover:r.labelCover,coverAct:r.labelCoverInAction,capCut:r.capCut});
  if(!process.env.ONLY||process.env.ONLY==="desk") await step("desk",async()=>{ const {page}=await L.open(b,url,{w:1440,h:900}); await page.evaluate(inject); await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(800);
    for(const pres of ["study","watch"]){ await page.evaluate(p=>{ setPresentation(p); setClock(510,{instant:true,force:true}); },pres); await L.sleep(3500);
      const p0=await page.evaluate(()=>window.__audit.comp()); say("desk "+pres+" paused 08:30 (phase view)",row(p0)); OUT["desk-"+pres]=[p0];
      await page.locator("#play").click(); for(let i=0;i<18;i++){ await L.sleep(7000); const r=await page.evaluate(()=>window.__audit.comp()); OUT["desk-"+pres].push(r); say("desk "+pres+" play",row(r)); if(r.t>=562) break; }
      await page.keyboard.press("Space"); await L.sleep(800); await L.shot(page,"j9-F-desk-play-end-"+pres);
      await page.evaluate(()=>setClock(540,{instant:true,force:true})); await L.sleep(3500); const p1=await page.evaluate(()=>window.__audit.comp()); say("desk "+pres+" paused 09:00 (phase view)",row(p1)); OUT["desk-"+pres+"-0900"]=p1; }
    await page.context().close(); });
  if(!process.env.ONLY||process.env.ONLY==="phone") await step("phone",async()=>{ const {page}=await L.open(b,url,{w:390,h:844,phone:true,dpr:3}); await page.evaluate(inject);
    // G1: Show the key on a phone
    await page.getByText("Show the key",{exact:true}).tap(); await L.sleep(2500);
    say("G1 after 'Show the key' (phone)",await page.evaluate(()=>{ const L2=document.querySelector(".legend"), s=getComputedStyle(L2), r=L2.getBoundingClientRect(); return {legendDisplay:s.display,legendVis:s.visibility,legendBox:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)],help:!document.getElementById("help").hidden,active:document.activeElement.id,firstrun:document.getElementById("firstrun").hidden}; }));
    await L.shot(page,"j9-G1-phone-after-key");
    await page.tap("#helpbtn"); await L.sleep(1200); await L.shot(page,"j9-G1b-phone-help"); say("G1b help on phone",await page.evaluate(()=>({help:!document.getElementById("help").hidden,chars:document.getElementById("help").innerText.length,scrollH:(document.getElementById("help-body")||document.getElementById("help")).scrollHeight}))); await page.tap("#help-close"); await L.sleep(600);
    // G2: what a tap on the rail hits, px by px
    say("G2 rail hit-test (phone)",await page.evaluate(()=>{ const R=document.getElementById("timerail").getBoundingClientRect(); const ys=[R.top+4,R.top+R.height/2,R.bottom-4]; const res={}; ys.forEach((y,k)=>{ let mark=0,rail=0,other=0; for(let x=Math.ceil(R.left);x<R.right;x++){ const e=document.elementFromPoint(x,y); if(!e) other++; else if(e.closest(".ev-mark")) mark++; else if(e.closest("#timerail")||e.id==="playhead") rail++; else other++; } res[["top","mid","bottom"][k]]={marker:mark,rail:rail,other:other}; }); res.rail=[Math.round(R.left),Math.round(R.top),Math.round(R.width),Math.round(R.height)]; res.marks=[...document.querySelectorAll("#evmarks .ev-mark")].map(e=>{ const b=e.getBoundingClientRect(); return Math.round(b.width)+"x"+Math.round(b.height)+"@"+Math.round(b.top-R.top); }).slice(0,3); return res; }));
    // G3: composition while playing on the phone from 08:30, dispatch as it stands
    await page.evaluate(()=>setClock(510,{instant:true,force:true})); await L.sleep(3500); const p0=await page.evaluate(()=>window.__audit.comp()); say("phone paused 08:30",row(p0)); OUT.phone=[p0]; await L.shot(page,"j9-G3-phone-0830");
    await page.tap("#play"); for(let i=0;i<14;i++){ await L.sleep(6000); const r=await page.evaluate(()=>window.__audit.comp()); OUT.phone.push(r); say("phone play",row(r)); if(i===4||i===9) await L.shot(page,"j9-G3-phone-play-"+i); if(r.t>=562) break; }
    await page.tap("#play"); await L.sleep(600);
    // G4: with an event dossier open while playing
    await page.evaluate(()=>setClock(525,{instant:true,force:true})); await L.sleep(2500);
    const mk=await page.evaluate(()=>{ const e=[...document.querySelectorAll("#evmarks .ev-mark")].find(e=>/Saint-Hilaire and Vandamme/.test(e.getAttribute("aria-label")||"")); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; });
    await page.touchscreen.tap(mk.x,mk.y); await L.sleep(2500); const d0=await page.evaluate(()=>window.__audit.comp()); say("phone event dossier open 08:45",row(d0)); say("phone free with dossier",d0.free); await L.shot(page,"j9-G4-phone-event-dossier");
    await page.tap("#play"); await L.sleep(15000); const d1=await page.evaluate(()=>window.__audit.comp()); say("phone playing with dossier open",row(d1)); await L.shot(page,"j9-G4-phone-play-dossier"); await page.tap("#play");
    await page.context().close(); });
  fs.writeFileSync(path.join(L.ROOT,"j9f-"+(process.env.ONLY||"all")+".json"),JSON.stringify(OUT,null,1));
  await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
