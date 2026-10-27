#!/usr/bin/env node
/* Stage 8, implementation PR 8D's prerequisite (the audit of 8C; docs/STAGE8_SPEC.md section 16.1): a map-layer item the stabiliser holds hidden
   (decision 240 (a)), given a priority the stabiliser never holds while the view moves, in a fresh browser, by real input: the keyboard's focus
   by a real Tab key (from the item before it in the layer's order), the selection by a real click on its formation's row in the order of
   battle. Each case: Landscape with counters at the Field vantage, 09:30, orbited by the right button through the app's own handlers on the
   motion driver's clock (tools/visual/motion.js, 30 or 60 frames a second, the WebGL draw skipped: the layer is DOM), until a formation's
   counter or name is held; the drag released (the input hold still runs, so the view still reads as moving); the priority given by real
   input; then frames, each read as a visitor sees the item: its state, its alpha, its inline and computed opacity.
   node tools/stage8/protect-8d.js <before.html> <after.html> [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), MO=require("../visual/motion.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), BUILDS=argv.filter((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json");
if(!BUILDS.length){ console.error("usage: protect-8d.js <build.html> [<build.html> ...] [--json out.json]"); process.exit(2); }
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");

async function oneCase(page,how,fps){
  await page.evaluate(()=>{ select(null,null); stopPlay(); if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); });
  await page.evaluate(s=>window.__aus.apply(s),MO.VIEWS.hybrid); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90,true));
  /* the rail on its order of battle (a real click), before the motion: the rows the selection case clicks */
  if(how==="selection"){ await page.click("#tab-oob"); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(4,true)); }
  await page.evaluate(MO.inPage);
  const found=await page.evaluate(fps=>{
    var D=window.__md; D.start({gl:false, frameMs:1000/fps}); D.frame(8); var c=D.centre(); D.down(c[0],c[1],2);
    function held(){ for(var k in ML.items){ var t=ML.items[k]; if(t.eFrame===ML.frame&&t.fid&&FORMATIONS[t.fid]&&!t.keep&&t.focusable&&t.held&&t.state!=="on"&&!(t.fa>0)&&t.el.style.display!=="none") return t; } return null; }
    for(var i=1;i<=90;i++){ D.move(c[0]+6*i,c[1],2); D.frame(); var t=held();
      if(t){ D.up(c[0]+6*i,c[1],2);
        /* the item before it in the layer's order (its children follow it: the keyboard's order), for a real Tab onto it */
        var kids=[].filter.call(ML.root.children,function(e){ return e.classList.contains("ml-item")&&e.getAttribute("tabindex")==="0"&&e.style.display!=="none"; });
        var ix=kids.indexOf(t.el); window.__pt={key:t.key, el:t.el};
        if(ix>0) window.__pt.prev=kids[ix-1];
        return {key:t.key, fid:t.fid, frame:i, state:t.state, fa:t.fa, prev:ix>0, moving:MLS.moving, fadeOn:MLS.fadeOn, t:D.now()}; } }
    D.up(c[0]+6*90,c[1],2); return null; },fps);
  if(!found){ await page.evaluate(()=>window.__md.stop()); return {how:how, fps:fps, found:null}; }
  let given=null;
  if(how==="focus"&&found.prev){ await page.evaluate(()=>window.__pt.prev.focus({preventScroll:true})); await page.keyboard.press("Tab");
    given=await page.evaluate(()=>({active:document.activeElement===window.__pt.el, activeKey:(function(){ for(var k in ML.items) if(ML.items[k].el===document.activeElement) return k; return null; })()})); }
  if(how==="selection"){ const sel='.oob-row[data-id="'+found.fid+'"]';
    if(await page.$(sel)){ await page.click(sel); given=await page.evaluate(id=>({selected:!!(selection&&selection.kind==="f"&&selection.id===id)}),found.fid); } }
  const frames=await page.evaluate(()=>{ var D=window.__md, P=window.__pt, out=[];
    for(var f=1;f<=8;f++){ D.frame(); var it=ML.items[P.key]; var cs=getComputedStyle(it.el);
      out.push({frame:f, state:it.state, held:!!it.held, fa:+(+it.fa).toFixed(3), inline:it.el.style.opacity, computed:+parseFloat(cs.opacity).toFixed(3), on:it.el.classList.contains("on"),
        keep:!!it.keep, focus:document.activeElement===it.el, moving:MLS.moving, fadeOn:MLS.fadeOn}); }
    D.stop(); if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); select(null,null); return out; });
  return {how:how, fps:fps, found:found, given:given, frames:frames};
}
(async()=>{
  const browser=await L.launch(), res={note:"a held map-layer item given the keyboard's focus (a real Tab) or the selection (a real click on its order-of-battle row) while the view moves: its state and opacity in the frames after",
    chromium:browser.version(), builds:{}};
  for(const b of BUILDS){
    process.env.AUSTERLITZ_HTML=path.resolve(b);
    const page=await L.open(browser,[1600,900]); await page.evaluate(()=>closeFirst(null));
    const R=[];
    for(const fps of [30,60]) for(const how of ["focus","selection"]){ const r=await oneCase(page,how,fps); R.push(r);
      const f1=r.frames&&r.frames[0];
      console.log(path.basename(b).padEnd(28),how.padEnd(10),fps+" fps",r.found?r.found.key:"(none held)","given "+JSON.stringify(r.given),
        f1?"frame 1: "+f1.state+", alpha "+f1.fa+"; computed opacity by frame: "+r.frames.map(x=>x.computed).join(" "):""); }
    res.builds[path.basename(b)]={md5:md5(b), cases:R, errors:page._errors};
    await page.close(); }
  await browser.close();
  if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
