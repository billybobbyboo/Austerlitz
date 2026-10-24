#!/usr/bin/env node
/* Stage 8, implementation PR 8A (decision 251; docs/STAGE8_SPEC.md section 13): what the carried fixes change, captured in two builds side by
   side, each state reached the same way in both (the app's own select, setCommandView and setClock; the sources sheet by its button):
   - reading-card, reading-full: under Napoleon's headquarters' reading at 08:30, the compact card and the full dossier of the first Allied
     formation on the field the reading does not know (drawnKnow "unknown", as both builds read it);
   - everyone-full: the same formation's full dossier with "Whose eyes?" at everyone;
   - claims: the sources sheet opened from an event's dossier whose claim is disputed (the counter-march, decision 251's sides and notes);
   - tip-hover, tip-click: the timeline's tip over a phase's button, then after the button is pressed (decision 251's dismissal).
   Each capture is the drawer, the sheet or the timeline's region as the page draws it (JPEG), in docs/stage8-evidence/8a/ unless --out.
   node tools/stage8/dossier-shots.js --a old.html --b new.html [--out dir]   AUSTERLITZ_CHROME the Chromium to run. Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const A=path.resolve(opt("--a")), B=path.resolve(opt("--b")), OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8a"));
async function rectOf(page,sel){ return page.evaluate(s=>{ const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect(); return r.width&&r.height?{x:Math.max(0,r.left),y:Math.max(0,r.top),width:Math.min(innerWidth,r.right)-Math.max(0,r.left),height:Math.min(innerHeight,r.bottom)-Math.max(0,r.top)}:null; },sel); }
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  const browser=await L.launch(), log={};
  for(const [key,html] of [["a",A],["b",B]]){
    process.env.AUSTERLITZ_HTML=html; const page=await L.open(browser,[1600,900]), R=log[key]={html:html};
    await page.evaluate(()=>{ closeFirst(null); stopPlay(); setPresentation("study"); setMode("terrain"); });
    /* the reading: Napoleon's headquarters at 08:30 */
    const id=await page.evaluate(()=>{ setCommandView("fr"); setClock(510,{instant:true,force:true,camera:false}); AUSTERLITZ_DEBUG.settle(2);
      return Object.keys(units).find(k=>sideOfNation(FORMATIONS[k].nation)==="al"&&posNow(k)&&drawnKnow(k)==="unknown")||null; });
    R.unknown=id;
    for(const [tag,full] of [["reading-card",false],["reading-full",true]]){
      await page.evaluate(([i,f])=>{ dossierExpanded=f; select("f",i); paintDrawer(); AUSTERLITZ_DEBUG.settle(1); },[id,full]); await L.settle(page);
      const r=await rectOf(page,"#drawer"); R[tag]=await page.evaluate(()=>document.getElementById("drawer-body").innerText.slice(0,1500));
      if(r) await L.jpeg(page,path.join(OUT,tag+"-"+key+".jpg"),88,r); }
    await page.evaluate(i=>{ setCommandView("none"); dossierExpanded=true; select("f",i); paintDrawer(); AUSTERLITZ_DEBUG.settle(1); },id); await L.settle(page);
    { const r=await rectOf(page,"#drawer"); if(r) await L.jpeg(page,path.join(OUT,"everyone-full-"+key+".jpg"),88,r); }
    /* the sources sheet from the counter-march's dossier */
    await page.evaluate(()=>{ dossierExpanded=false; select("e","counter-march"); paintDrawer(); AUSTERLITZ_DEBUG.settle(1);
      const b=[...document.querySelectorAll("#drawer-body button")].find(x=>/How this is sourced/.test(x.textContent)); if(b) b.click(); });
    await L.settle(page);
    R.claims=await page.evaluate(()=>{ const m=document.getElementById("modal"); return m&&m.classList.contains("on")?document.getElementById("modal-body").innerText.slice(0,2500):null; });
    { const r=await rectOf(page,"#modal .sheet")||await rectOf(page,"#modal"); if(r) await L.jpeg(page,path.join(OUT,"claims-"+key+".jpg"),88,r); }
    await page.keyboard.press("Escape"); await L.settle(page);
    await page.evaluate(()=>{ select(null,null); paintDrawer(); });
    /* the tip: a mouse over a phase's button, then a press on it */
    const ph=await page.evaluate(()=>{ const b=document.querySelector("#phases .step"); if(!b) return null; const r=b.getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2]; });
    if(ph){ await page.mouse.move(ph[0],ph[1]); await page.waitForTimeout(400);
      const tl=await rectOf(page,".timebar"), clip=tl?{x:0,y:Math.max(0,tl.y-60),width:1600,height:Math.min(900-Math.max(0,tl.y-60),tl.height+60)}:null;
      R.tipHover=await page.evaluate(()=>{ const t=document.getElementById("tltip"); return t&&!t.hidden?t.textContent:null; });
      if(clip) await L.jpeg(page,path.join(OUT,"tip-hover-"+key+".jpg"),88,clip);
      await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(400); await L.settle(page);
      R.tipClick=await page.evaluate(()=>{ const t=document.getElementById("tltip"); return t&&!t.hidden?t.textContent:null; });
      if(clip) await L.jpeg(page,path.join(OUT,"tip-click-"+key+".jpg"),88,clip); }
    R.errors=page._errors.slice();
    await page.close();
    console.log(key,JSON.stringify({unknown:R.unknown,tipHover:R.tipHover,tipClick:R.tipClick,errors:R.errors}));
  }
  fs.writeFileSync(path.join(OUT,"dossier-shots.json"),JSON.stringify(log,null,1));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
