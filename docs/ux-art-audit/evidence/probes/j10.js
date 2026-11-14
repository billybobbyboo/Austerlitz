/* Rechecks of carried findings on the pinned build (desktop 1440x900, llvmpipe): CL-UX-03's residual, the press lost during Play, CL-MAP-02. */
"use strict";
const L=require("./lib.js");
const say=(k,v)=>console.log(k,typeof v==="string"?v:JSON.stringify(v));
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const {page,log}=await L.open(b,url,{w:1440,h:900});
  const step=async(name,f)=>{ try{ await f(); }catch(e){ say(name+" ERROR",String(e).slice(0,300)); } };
  await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(800);
  const c=()=>page.evaluate(()=>+clock.toFixed(1));
  // ---- CL-UX-03 residual: the playhead under the 04:15 marker, dragged 200 px in coarse and fine moves (real mouse)
  await step("ux03",async()=>{ for(const stepPx of [2,8,16,33]){ await page.evaluate(()=>setClock(255,{instant:true,force:true,camera:false})); await L.sleep(700);
      const ph=await page.evaluate(()=>{ const b=document.getElementById("playhead").getBoundingClientRect(), r=document.getElementById("timerail").getBoundingClientRect(); const x=b.x+b.width/2, y=r.y+r.height/2; const e=document.elementFromPoint(x,y); return {x:x,y:y,under:(e.className||e.id||"").toString().slice(0,30)}; });
      const t0=await c(); await page.mouse.move(ph.x,ph.y); await page.mouse.down(); for(let d=stepPx;d<=200;d+=stepPx){ await page.mouse.move(ph.x+d,ph.y); } await page.mouse.up(); await L.sleep(700);
      say("CL-UX-03 drag 200px in "+stepPx+"px moves from the playhead (element under press: "+ph.under+")",{before:t0,after:await c(),expected:+(255+200/1411*840).toFixed(0)}); await page.keyboard.press("Escape"); await L.sleep(300); } });
  // ---- the press lost during Play: a 100 ms press on a day-track anchor, 10 times
  await step("lost",async()=>{ await page.evaluate(()=>{ setClock(540,{instant:true,force:true}); select("f","sthilaire"); }); await L.sleep(1500); await page.locator("#drawer").getByRole("button",{name:/^Full dossier/}).click(); await L.sleep(1200);
    await page.evaluate(()=>document.querySelector("#drawer .daytrack").scrollIntoView({block:"center"})); await L.sleep(500);
    const anchor=()=>page.evaluate(()=>{ const a=[...document.querySelectorAll("#drawer .daytrack .dt-a")][1]; if(!a) return null; const r=a.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,label:a.getAttribute("aria-label")}; });
    // paused: 5 presses of 100 ms
    let ok=0; for(let i=0;i<5;i++){ await page.evaluate(()=>setClock(540,{instant:true,force:true,camera:false})); await L.sleep(500); const a=await anchor(); await page.mouse.move(a.x,a.y); await page.mouse.down(); await L.sleep(100); await page.mouse.up(); await L.sleep(500); if(Math.abs((await c())-555)<1) ok++; }
    say("day-track anchor (09:15), paused, 100 ms presses taken",ok+" of 5");
    for(const hold of [0,100,250]){ let ok2=0, n=8; for(let i=0;i<n;i++){ await page.evaluate(()=>{ setClock(540,{instant:true,force:true,camera:false}); if(!playing) document.getElementById("play").click(); }); await L.sleep(1300+i*130); const a=await anchor(); if(!a){ continue; } await page.mouse.move(a.x,a.y); await page.mouse.down(); if(hold) await L.sleep(hold); await page.mouse.up(); await L.sleep(700); const t=await c(), pl=await page.evaluate(()=>playing); if(!pl&&Math.abs(t-555)<1) ok2++; if(pl) await page.keyboard.press("Space"); }
      say("day-track anchor (09:15), PLAYING at ½×, "+hold+" ms presses taken",ok2+" of "+n+" (software frames here are ~1 s; the repaint cadence differs from a GPU's)"); }
    await page.locator("#drawer-close").click().catch(()=>{}); });
  // ---- CL-MAP-02: formations a live event names, drawn while it is live (Study and Landscape with counters), sampled while playing
  await step("map02",async()=>{ for(const md of ["terrain","hybrid"]){ await page.evaluate(m=>{ setMode(m); setClock(675,{instant:true,force:true}); select(null,null); },md); await L.sleep(3000);
      if((await page.locator("#follow").getAttribute("aria-pressed"))!=="true") await page.locator("#follow").click();
      await page.locator("#play").click(); const seen={}; let n=0;
      for(let i=0;i<22;i++){ await L.sleep(5000); const r=await page.evaluate(()=>{ const L2=liveEvents(clock).filter(o=>o.w>0.3); const names=[...document.querySelectorAll("#maplayer .ml-item")].filter(e=>+getComputedStyle(e).opacity>0.5&&e.getBoundingClientRect().width>0).map(e=>e.getAttribute("aria-label")||""); const out=[]; L2.forEach(o=>(o.e.forms||[]).forEach(id=>{ const f=FORMATIONS[id]; if(!f) return; const nm=nameOf(f); let drawn=names.some(a=>a.indexOf(nm)===0); if(!drawn&&f.parent){ const pn=nameOf(FORMATIONS[f.parent]); drawn=names.some(a=>a.indexOf(pn)===0)?"parent":false; } out.push([o.e.n.slice(0,34),nm,drawn]); })); return {t:+clock.toFixed(0),out:out}; });
        n++; r.out.forEach(o=>{ const k=o[0]+" > "+o[1]; seen[k]=seen[k]||{own:0,parent:0,none:0}; if(o[2]===true) seen[k].own++; else if(o[2]==="parent") seen[k].parent++; else seen[k].none++; }); if(r.t>=745) break; }
      await page.keyboard.press("Space"); say("CL-MAP-02 "+md+" 11:15 onward, "+n+" samples: event > formation {own name drawn, only its parent's, neither}",seen); }
    await page.evaluate(()=>setMode("terrain")); });
  say("console",log);
  await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
