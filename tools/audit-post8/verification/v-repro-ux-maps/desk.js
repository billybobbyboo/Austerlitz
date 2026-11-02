#!/usr/bin/env node
/* Final audit after Stage 8, verification v-repro-ux-maps: an independent reproduction of visual-maps V-M2, V-M3, V-M4 and V-M5 on the
   harness desktop page (?harness=1, render on demand; the first-run card closed by a real Esc; CSS transitions kept), the audited build.
   Real clicks for every control a visitor presses (the Eyes button, the Layers panel's mode buttons, the presentation switch, the vantages);
   set-up by script, said so: the clock (setClock, as the harness's cases set it), AUSTERLITZ_DEBUG.settle to end a glide, and the reading
   sweep (setCommandView) after the real-click case. Reads only: ML (the map layer), DRAWON (the drawn-on arrows), readHidden, drawnKnow,
   plateauText, computed styles.
   node tools/audit-post8/verification/v-repro-ux-maps/desk.js   -> docs/audit-post8-evidence/verification/v-repro-ux-maps/desk.json + JPEGs */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../../lib.js");
const OUT=path.join(A.EVID,"verification","v-repro-ux-maps"); fs.mkdirSync(OUT,{recursive:true});
const R={build:"austerlitz-command-map.html md5 f10fe585c46aea576f436ed51ac46f83",browser:"Chromium 141.0.7390.37 headless shell, SwiftShader",page:"harness page (?harness=1: render on demand, no drift; the first visitor-page run timed out on its first 1600x900 screenshot under a load average of 25), first-run card closed by a real Esc, deviceScaleFactor 1",steps:[]};
const save=()=>fs.writeFileSync(path.join(OUT,"desk.json"),JSON.stringify(R,null,1));
const step=(what,o)=>{ R.steps.push(Object.assign({what},o)); console.log("STEP",what,JSON.stringify(o).slice(0,400)); save(); };
const wait=ms=>new Promise(r=>setTimeout(r,ms));
/* the map layer as the pass places it now: the pass's own list (mlCollect), then one pass (mlLayout), each item's state */
const LAYER=()=>{ var L=mlCollect(); mlLayout(); var by={}, items=L.map(function(it){ by[it.cat]=by[it.cat]||{}; by[it.cat][it.state||"?"]=(by[it.cat][it.state||"?"]||0)+1;
  return {id:it.key,cat:it.cat,state:it.state,text:((it.el&&it.el.textContent)||"").replace(/\s+/g," ").trim().slice(0,70)}; });
  return {frame:ML.frame,n:L.length,byCat:by,places:items.filter(function(x){ return x.cat==="place"; }),items:items}; };
const LEG=()=>{ function cs(e){ return e?getComputedStyle(e):null; } var lg=document.querySelector(".legend"), ro=document.querySelector(".legend .rose"), tg=document.getElementById("lg-toggle");
  var lgs=cs(lg), ros=cs(ro), r=ro?ro.getBoundingClientRect():null, b=lg?lg.getBoundingClientRect():null;
  var roseShown=!!(lgs&&lgs.display!=="none"&&lgs.visibility!=="hidden"&&ros&&ros.display!=="none"&&r&&r.width>0&&r.height>0);
  /* any other element a visitor could read as a north indicator: an SVG/element whose text is exactly "N", or a title/aria-label naming north */
  var other=[].filter.call(document.querySelectorAll("body *"),function(e){ if(ro&&ro.contains(e)) return false; var t=(e.childElementCount===0?(e.textContent||"").trim():"");
    var lab=(e.getAttribute("aria-label")||"")+" "+(e.getAttribute("title")||""); var s=getComputedStyle(e); if(s.display==="none"||s.visibility==="hidden") return false; var q=e.getBoundingClientRect(); if(!(q.width>0&&q.height>0)) return false;
    return t==="N"||/\bnorth\b/i.test(lab); }).map(function(e){ return (e.id?"#"+e.id:e.tagName.toLowerCase()+"."+String(e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className).split(" ")[0])+" "+((e.getAttribute("aria-label")||e.getAttribute("title")||e.textContent||"").trim().slice(0,90)); });
  return {viewport:[innerWidth,innerHeight],body:document.body.className,legend:lgs?{display:lgs.display,visibility:lgs.visibility,box:b?[b.left,b.top,b.width,b.height].map(Math.round):null}:null,
    toggleShown:!!(tg&&tg.getBoundingClientRect().width>0&&lgs&&lgs.display!=="none"),rose:ros?{display:ros.display,box:r?[r.left,r.top,r.width,r.height].map(Math.round):null}:null,roseShown:roseShown,
    keyButtons:[].filter.call(document.querySelectorAll("button"),function(e){ return /\bkey\b|legend/i.test((e.textContent||"")+" "+(e.title||"")+" "+(e.getAttribute("aria-label")||""))&&e.getBoundingClientRect().width>0&&getComputedStyle(e).visibility!=="hidden"; }).map(function(e){ return (e.id||e.className)+": "+(e.textContent||"").trim().slice(0,40)+" | "+(e.title||"").slice(0,60); }),
    otherNorth:other}; };
async function click(page,sel,why){ const b=await page.evaluate(s=>{ const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect(); const st=getComputedStyle(e);
    return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height,vis:st.display!=="none"&&st.visibility!=="hidden"&&r.width>0}; },sel);
  if(!b||!b.vis) throw new Error("not clickable: "+sel+" "+JSON.stringify(b)+" ("+(why||"")+")");
  const hit=await page.evaluate(([x,y,s])=>{ const e=document.elementFromPoint(x,y), t=document.querySelector(s); return !!(e&&t&&(t===e||t.contains(e))); },[b.x,b.y,sel]);
  await page.mouse.click(b.x,b.y); await wait(900); return {sel,at:[Math.round(b.x),Math.round(b.y)],hitTestOk:hit}; }
async function settle(page){ await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(30)); await wait(1200); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); }
async function shot(page,name){ const f=path.join(OUT,name+".jpg"); try{ const buf=await page.screenshot({type:"jpeg",quality:78,timeout:150000}); fs.writeFileSync(f,buf); return path.relative(A.ROOT,f); }catch(e){ return "screenshot failed: "+String(e.message).split("\n")[0]; } }
async function setMode(page,m){ const s=[]; s.push(await click(page,"#layersbtn","open Layers")); s.push(await click(page,'.mode-btn[data-m="'+m+'"]',"mode "+m)); s.push(await click(page,"#layerclose","close Layers")); return s; }
(async()=>{
  const t0=Date.now(), b=await A.launch();
  let page;
  try{
    page=await A.open(b,[1600,900],{transitions:true});
    step("open 1600x900",{bootS:Math.round((Date.now()-t0)/1000),state:await A.state(page)});
    await page.waitForSelector("#firstrun:not([hidden])",{timeout:120000}).catch(()=>{});
    await page.keyboard.press("Escape"); await wait(1500);
    await page.evaluate(()=>setClock(570,{instant:true,force:true})); await settle(page);   /* set-up: 09:30 */
    step("Esc (real key); clock set to 09:30 by setClock (set-up)",{state:await A.state(page),leg:await page.evaluate(LEG)});

    /* ---- V-M4: Whose eyes? the Allied headquarters by two real clicks on the Eyes button, Landscape with counters by real clicks ---- */
    const c1=await click(page,"#eyesbtn","eyes 1"), c2=await click(page,"#eyesbtn","eyes 2");
    const modeClicks=await setMode(page,"hybrid");
    await settle(page);
    const v4=await page.evaluate(LAYER);
    const arrows=await page.evaluate(()=>{ return {commandView:commandView,phase:curPhase,clock:clock,layerArrows:layerOn.arrows,ovFadeIn:ovFadeIn,
      drawon:DRAWON.map(function(d){ var id=d.a.leg[0], p=posNow(id), w=p?W(p[0],p[1]):null, tip=d.tip;
        var gop=[]; d.ghost.layers.forEach(function(l){ [l.shaft,l.head].forEach(function(m){ if(m) gop.push(+(m.material.opacity).toFixed(3)); }); });
        return {label:d.a.label,id:id,readHidden:readHidden(id),drawnKnow:drawnKnow(id),drawnOnFraction:+d.s.toFixed(3),
          ghostShaftVisible:d.ghost.layers.map(function(l){ return l.shaft.visible; }),ghostOpacities:gop,
          tipToFormation:(tip&&w)?+Math.hypot(tip[0]-w[0],tip[1]-w[1]).toFixed(2):null}; }),
      plateauText:plateauText(),
      plateauKnownOnly:(function(){ var tot=0; Object.keys(units).forEach(function(id){ var f=FORMATIONS[id]; if(f.nation!=="fr") return; var own=ownStrengthAt(id,clock); if(!own) return; var p=posNow(id); if(p&&onPlateau(p)&&!readHidden(id)) tot+=own; }); return tot; })(),
      plateauFrAll:plateauStrength("fr")}; });
    const pick=ids=>v4.items.filter(x=>ids.indexOf(x.id)>=0);
    step("V-M4: Allied reading (2 real clicks on #eyesbtn), Landscape with counters (real clicks), Field vantage, 09:30",{clicks:[c1,c2].concat(modeClicks),
      state:await A.state(page),counters:pick(["c:suchet","c:caffarelli","c:lannes","c:bag","c:sthilaire","c:vandamme"]),
      arrowLabels:v4.items.filter(x=>x.cat==="overlay"),plateau:v4.items.filter(x=>x.cat==="plateau"),arrows});
    step("V-M4 capture",{shot:await shot(page,"eyes-al-counters-0930")});
    /* the reading sweep (set-up by setCommandView and setClock): every derived arrow whose formation the reading does not know, every 30 minutes */
    const sweep=await page.evaluate(()=>{ var out={}, keep=[clock,commandView];
      ["al","fr"].forEach(function(cv){ setCommandView(cv); var L=[];
        for(var t=270;t<=1080;t+=30){ setClock(t,{instant:true,force:true,camera:false});
          var leaks=DRAWON.filter(function(d){ return readHidden(d.a.leg[0]); }).map(function(d){ return d.a.label+" ["+d.a.leg[0]+", drawn on "+d.s.toFixed(2)+"]"; });
          var frAll=plateauStrength("fr"), alAll=plateauStrength("al"), frK=0, alK=0;
          Object.keys(units).forEach(function(id){ var f=FORMATIONS[id], own=ownStrengthAt(id,clock); if(!own) return; var p=posNow(id); if(!(p&&onPlateau(p))||readHidden(id)) return; if(f.nation==="fr") frK+=own; else alK+=own; });
          if(leaks.length||frAll!==frK||alAll!==alK) L.push({t:fmtClock(t),phase:curPhase,arrowsOfUnknown:leaks,plateau:{frAll:frAll,frKnown:frK,alAll:alAll,alKnown:alK,labelShown:curPhase<=PLATEAU_LAST}}); }
        out[cv]=L; });
      setCommandView(keep[1]); setClock(keep[0],{instant:true,force:true}); return out; });
    step("V-M4 sweep: arrows drawn for formations the reading hides, and the plateau figures all vs known, every 30 min 04:30-18:00 (set-up by script)",{sweep});
    /* back to everyone: one more real click (al -> everyone) */
    const c3=await click(page,"#eyesbtn","eyes 3 (back to everyone)");
    step("reading back to everyone",{click:c3,commandView:await page.evaluate(()=>commandView)});

    /* ---- V-M2 / V-M3 at 1600x900: Study, Watch, Clean (real clicks on the presentation switch; Clean left by the real key 1) ---- */
    await setMode(page,"terrain"); await settle(page);
    const legStudy=await page.evaluate(LEG);
    const cw=await click(page,'.vm-btn[data-vm="watch"]',"Watch"); await settle(page); const legWatch=await page.evaluate(LEG);
    const cc=await click(page,'#tb-vm .vm-btn[data-vm="map"], .vm-btn[data-vm="map"]',"Clean"); await settle(page); const legClean=await page.evaluate(LEG);
    await page.keyboard.press("1"); await wait(1200); await settle(page);
    step("V-M2/V-M3 1600x900: the key and the rose in Study, Watch, Clean",{study:legStudy,watch:Object.assign({click:cw},legWatch),clean:Object.assign({click:cc},legClean),afterKey1:await A.state(page).then(s=>s.presentation)});

    /* ---- V-M5: the paper map entered by real clicks at 1600x900, 1280x720, 1024x768 ---- */
    for(const vp of [[1600,900],[1280,720],[1024,768]]){
      if(vp[0]!==1600){ await page.setViewportSize({width:vp[0],height:vp[1]}); await wait(2500); await setMode(page,"terrain"); await settle(page); }
      const mc=await setMode(page,"staff"); await wait(2500); await settle(page);
      const L5=await page.evaluate(LAYER);
      step("V-M5: the paper map entered by real clicks at "+vp.join("x")+" (09:30, Study, everyone)",{clicks:mc,state:await A.state(page),
        n:L5.n,byCat:L5.byCat,places:L5.places});
      step("V-M5 capture "+vp.join("x"),{shot:await shot(page,"paper-entered-"+vp.join("x"))});
      if(vp[0]===1280){
        await setMode(page,"hybrid"); const ov=await click(page,'.van-btn[data-v="plan"]',"Overview"); await wait(2500); await settle(page);
        const L6=await page.evaluate(LAYER);
        step("V-M5: Landscape with counters at the Overview (real clicks) 1280x720",{click:ov,state:await A.state(page),n:L6.n,byCat:L6.byCat,places:L6.places});
        await setMode(page,"terrain"); await settle(page);
      }
    }
    /* ---- V-M2 / V-M3 at 1024x768 (Study, landscape) and at a common laptop viewport 1366x657 (Study, landscape) ---- */
    await setMode(page,"terrain"); await settle(page);
    step("V-M2/V-M3 1024x768 Study landscape",{leg:await page.evaluate(LEG)});
    await page.setViewportSize({width:1366,height:657}); await wait(2500); await settle(page);
    step("V-M3 1366x657 Study landscape (a 1366x768 laptop's browser viewport)",{leg:await page.evaluate(LEG)});
    await page.setViewportSize({width:1600,height:700}); await wait(2000); await settle(page);
    step("V-M3 1600x700 Study landscape",{leg:await page.evaluate(LEG)});
    await page.setViewportSize({width:1600,height:701}); await wait(2000); await settle(page);
    step("V-M3 1600x701 Study landscape",{leg:await page.evaluate(LEG)});
    R.errors=A.errors(page);
  }catch(e){ step("FAILED",{err:String(e.stack||e).slice(0,800)}); if(page) R.errors=A.errors(page); }
  finally{ R.seconds=Math.round((Date.now()-t0)/1000); save(); await b.close().catch(()=>{}); console.log("done",R.seconds,"s"); }
})();
