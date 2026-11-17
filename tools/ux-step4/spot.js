#!/usr/bin/env node
/* UI/UX roadmap step 4: the spot checks of docs/UX_ART_AUDIT.md section 8 on the first frame: forced colours (Chromium's emulation of
   forced-colors: active) and reduced motion (prefers-reduced-motion: reduce), at 1366 x 768 (docked) and 390 x 844 (a phone's page), each fresh.
   On each: the card shown, focus on its primary action at load, every row's text, its samples' boxes (drawn: a box on screen; under forced colours
   the swatches' own outline), the two actions and the key's button inside the card; Esc closing the card in place with focus on Play and the eye
   unmoved; the card opened again and the key opened by its button, CONF_TEXT's three lines on screen (tools/visual/ux4.js gradesOnScreen); where Esc
   then leaves focus recorded, not judged. A capture each.
   node tools/ux-step4/spot.js [build.html] [--json out.json] [--cap prefix] */
"use strict";
const fs=require("fs"), path=require("path"), L=require("./lib.js"), UX=require(path.join(L.ROOT,"tools","visual","ux4.js"));
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json"&&argv[i-1]!=="--cap")||path.join(L.ROOT,"austerlitz-command-map.html"));
const OUT=opt("--json"), CAP=opt("--cap");
const CASES=[["forced",[1366,768],false],["forced",[390,844],true],["reduce",[1366,768],false],["reduce",[390,844],true]];
(async()=>{ const b=await L.launch(), R={build:L.buildInfo(html), cases:[]}, fails=[];
  for(const [mode,vp,phone] of CASES){
    /* reduced motion set before the page loads, as a visitor with the preference has it (the app reads it at load; its change while the page is
       open is check:selftest's block rmLive, which forces a frame for the change's event: an idle page draws none, and the event waits for one);
       forced colours emulated on the loaded page */
    const p=await L.open(b,html,{vp,phone,reduced:mode==="reduce"});
    if(mode==="forced") await p.emulateMedia({forcedColors:"active"});
    const tw=Date.now(); await p.waitForFunction(()=>RM===!!RM_MQ.matches,null,{timeout:60000}).catch(()=>{}); await L.settle(p,20);
    const k=mode+" "+vp.join("x"), r={mode,vp:vp.join("x"),rmWaitMs:Date.now()-tw};
    r.card=await p.evaluate(()=>{ const c=document.querySelector("#firstrun"); if(!c||c.hidden) return null; const cr=c.getBoundingClientRect();
      const inC=e=>{ const q=e.getBoundingClientRect(); return q.width>0&&q.height>0&&q.left>=cr.left-1&&q.right<=cr.right+1&&q.top>=Math.max(0,cr.top)-1&&q.bottom<=Math.min(innerHeight,cr.bottom)+1; };
      const smp=[].map.call(c.querySelectorAll(".fr-smp"),s=>{ const q=s.getBoundingClientRect(), sw=[].map.call(s.querySelectorAll(".key-sw"),w=>{ const cs=getComputedStyle(w); return {bg:cs.backgroundColor,outline:cs.outlineStyle+" "+cs.outlineWidth}; });
        return {w:Math.round(q.width),h:Math.round(q.height),sw,letters:[].map.call(s.querySelectorAll("b"),x=>{ const cs=getComputedStyle(x); return x.textContent+":"+cs.color; }).join(" "),svgStroke:s.querySelector("svg path")?getComputedStyle(s.querySelector("svg path")).stroke:null}; });
      return {rows:c.querySelectorAll(".fr-row").length, rowsText:[].map.call(c.querySelectorAll(".fr-row p"),e=>e.textContent.trim().slice(0,40)),
        smp, buttons:["fr-tour","fr-close","fr-grades"].map(id=>{ const e=document.getElementById(id); return !!e&&inC(e); }), focus:(document.activeElement||{}).id||null,
        forced:matchMedia("(forced-colors: active)").matches, rm:matchMedia("(prefers-reduced-motion: reduce)").matches, RM:typeof RM!=="undefined"?RM:null}; });
    if(!r.card){ fails.push(k+": the card not shown"); R.cases.push(r); await p.context().close(); continue; }
    if(r.card.focus!=="fr-tour") fails.push(k+": focus at load "+r.card.focus);
    if(r.card.rows!==3) fails.push(k+": rows "+r.card.rows);
    if(r.card.buttons.some(x=>!x)) fails.push(k+": a button outside the card "+JSON.stringify(r.card.buttons));
    if(r.card.smp.some(s=>!(s.w>0&&s.h>0))) fails.push(k+": a sample not drawn");
    if(mode==="forced"&&r.card.smp[0].sw.some(w=>!/solid 1px/.test(w.outline))) fails.push(k+": a side swatch without its outline under forced colours");
    if(mode==="reduce"&&r.card.RM!==true) fails.push(k+": RM not set");
    if(CAP) await p.screenshot({path:CAP+"-"+mode+"-"+vp.join("x")+".png",timeout:300000});
    const pose0=await p.evaluate(()=>({p:landCam.position.toArray(),t:orbitTarget.toArray(),clock}));
    await p.keyboard.press("Escape"); await L.settle(p,6);
    r.after=await p.evaluate(p0=>{ const a=landCam.position.toArray(), t=orbitTarget.toArray();
      return {card:!document.querySelector("#firstrun").hidden, focus:(document.activeElement||{}).id||null,
        moved:Math.max(Math.hypot(a[0]-p0.p[0],a[1]-p0.p[1],a[2]-p0.p[2]),Math.hypot(t[0]-p0.t[0],t[1]-p0.t[1],t[2]-p0.t[2]))+Math.abs(clock-p0.clock)}; },pose0);
    if(r.after.card||r.after.focus!=="play"||r.after.moved>1e-6) fails.push(k+": Esc, the way out "+JSON.stringify(r.after));
    /* the card again (tools/visual/ux4.js reopenCard), then the key from it */
    await p.evaluate(()=>{ if(typeof setHelp==="function") setHelp(false); ML.legendOpen=false; const fr=document.getElementById("firstrun"); fr.hidden=false; openFirstRun(); }); await L.settle(p,6);
    if(phone) await p.tap("#fr-grades"); else await p.click("#fr-grades");
    await L.settle(p,10); r.grades=await p.evaluate(UX.gradesOnScreen);
    const miss=["A","B","C"].filter(g=>!(r.grades.on||r.grades)[g]); if(miss.length) fails.push(k+": "+miss.join(", ")+" not on screen with the key open");
    if(CAP) await p.screenshot({path:CAP+"-"+mode+"-"+vp.join("x")+"-key.png",timeout:300000});
    await p.keyboard.press("Escape"); await L.settle(p,6);
    /* recorded, not judged: where Esc leaves the key (step 1's UA-05 behaviour, unchanged here) */
    r.afterKey=await p.evaluate(()=>({card:!document.querySelector("#firstrun").hidden,help:!!document.getElementById("help")&&!document.getElementById("help").hidden,legend:!!ML.legendOpen,focus:(document.activeElement||{}).id||null}));
    console.log(k, JSON.stringify(r)); R.cases.push(r); await p.context().close(); }
  await b.close(); R.failures=fails; if(OUT) fs.writeFileSync(OUT,JSON.stringify(R,null,1)+"\n");
  console.log(fails.length?"FAILED ("+fails.length+"):\n  "+fails.join("\n  "):"spot: every check passed"); process.exit(fails.length?1:0);
})().catch(e=>{ console.error(e); process.exit(2); });
