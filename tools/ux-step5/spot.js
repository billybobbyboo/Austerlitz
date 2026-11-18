#!/usr/bin/env node
/* UI/UX roadmap step 5: the spot checks of docs/UX_ART_AUDIT.md section 8 on the paper plate, and the landscape unchanged.
   - forced colours (Chromium's emulation of forced-colors: active) at 1366 x 768: the paper map entered by real clicks; the neatline's and the cartouche's
     borders drawn (a computed border colour that is not transparent), the cartouche's words on the system's colours, the base lettering on Canvas;
   - reduced motion (prefers-reduced-motion: reduce, set before load) at 1366 x 768: the plate as entered at once, a real drag standing it down, the
     Overview's button bringing it back with no glide (the plate there in the next frame);
   - the landscape unchanged: the Field vantage at 09:00 in Study and in Watch at 1600 x 900, the canvas alone (every element over it hidden) and the
     whole page, on the base build and on this one, pixel for pixel;
   - the surround's own geometry (the apron's, its triangles) read from the page.
   node tools/ux-step5/spot.js <base.html> <build.html> [--json out.json] [--cap dir] */
"use strict";
const fs=require("fs"), path=require("path"), U=require("./lib.js"), UX5=require(path.join(U.ROOT,"tools","visual","ux5.js"));
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const htmls=argv.filter((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json"&&argv[i-1]!=="--cap").map(a=>path.resolve(a)), OUT=opt("--json"), CAP=opt("--cap");
const [BASE,NEW]=htmls;
const HIDE="body>*:not(#stage):not(script){visibility:hidden!important} #maplayer,#paperletters{visibility:hidden!important}";
async function enter(p){ await p.click("#fr-close",{timeout:120000}); await p.mouse.move(2,2); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(4));
  await UX5.toClock(p,570); await UX5.enterPaper(p,false); }
async function shot(p,f){ const b=await p.screenshot({timeout:300000}); if(CAP&&f){ fs.mkdirSync(CAP,{recursive:true}); fs.writeFileSync(path.join(CAP,f),b); } return b; }
(async()=>{ const b=await U.launch(), R={base:U.buildInfo(BASE), build:U.buildInfo(NEW), chromium:b.version()}, fails=[];
  /* forced colours */
  { const p=await U.open(b,NEW,{vp:[1366,768]}); await p.emulateMedia({forcedColors:"active"}); await U.settle(p,10); await enter(p);
    R.forced=await p.evaluate(()=>{ const cs=id=>{ const e=document.getElementById(id); if(!e||e.hidden) return null; const s=getComputedStyle(e); return {border:s.borderTopColor, borderW:s.borderTopWidth, bg:s.backgroundColor, color:s.color, display:s.display}; };
      const nl=cs("neatline"), ct=cs("cartouche"), aft=getComputedStyle(document.getElementById("neatline"),"::after").borderTopColor;
      const names=[].filter.call(document.querySelectorAll(".pl-name"),e=>!e.hidden&&e.style.visibility!=="hidden").map(e=>{ const s=getComputedStyle(e); return {n:e.dataset.v, bg:s.backgroundColor, color:s.color, shadow:s.textShadow}; });
      return {forced:matchMedia("(forced-colors: active)").matches, neatline:nl, neatInner:aft, cartouche:ct, names}; });
    const F=R.forced, tr=c=>!c||/rgba\(0, 0, 0, 0\)|transparent/.test(c);
    if(!F.forced) fails.push("forced colours not emulated");
    if(!F.neatline||tr(F.neatline.border)||tr(F.neatInner)) fails.push("forced colours: the neatline's lines not drawn");
    if(!F.cartouche||tr(F.cartouche.border)) fails.push("forced colours: the cartouche's border not drawn");
    if(!F.names.length||F.names.some(n=>tr(n.bg))) fails.push("forced colours: a village's name not on Canvas");
    await shot(p,"forced-1366x768.png"); await p.context().close(); }
  /* reduced motion */
  { const p=await U.open(b,NEW,{vp:[1366,768],reduced:true}); await p.waitForFunction(()=>RM===!!RM_MQ.matches,null,{timeout:60000}).catch(()=>{}); await U.settle(p,10); await enter(p);
    const r0=await p.evaluate(UX5.plateRead,UX5.TWELVE), rm=await p.evaluate(()=>RM);
    const fr=await p.evaluate(()=>{ const r=MAPCAM.freeRect(); return [(r[0]+r[2])/2,(r[1]+r[3])/2]; });
    await p.mouse.move(fr[0],fr[1]); await p.mouse.down(); for(let i=1;i<=5;i++) await p.mouse.move(fr[0]+14*i,fr[1]); await p.mouse.up(); await p.mouse.move(2,2);
    await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(3)); const r1=await p.evaluate(UX5.plateRead,UX5.TWELVE);
    await p.click('.van-btn[data-v="plan"]',{timeout:120000}); await p.mouse.move(2,2); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(1)); const r2=await p.evaluate(UX5.plateRead,UX5.TWELVE);
    R.reduced={RM:rm, entered:{neatline:r0.neatline, cartouche:!!r0.cartouche, twelve:r0.twelveDrawn, outside:r0.countersOutside.length}, afterDrag:{neatline:r1.neatline, framed:r1.framed}, afterOverview1Frame:{neatline:r2.neatline, framed:r2.framed, twelve:r2.twelveDrawn}};
    if(!rm) fails.push("reduced motion not read by the app");
    if(!r0.neatline||!r0.cartouche||r0.countersOutside.length) fails.push("reduced motion: the plate not as entered");
    if(r1.neatline||r1.framed) fails.push("reduced motion: the plate stands after a drag");
    if(!r2.neatline||!r2.framed) fails.push("reduced motion: the Overview's button did not bring the plate back in one frame");
    await shot(p,"reduced-1366x768.png"); await p.context().close(); }
  /* the landscape unchanged: the base build and this one, the same states */
  R.landscape=[];
  for(const pres of ["study","watch"]){ const bufs=[];
    for(const h of [BASE,NEW]){ const p=await U.open(b,h,{vp:[1600,900]}); await p.evaluate(()=>closeFirst(null)); await U.settle(p,6);
      await p.evaluate(s=>window.__aus.apply(s),{viewport:[1600,900],t:540,presentation:pres,mode:"terrain",cam:[-195,92,156,-33,4,-2]}); await U.settle(p,30);
      const whole=(await p.screenshot({timeout:300000})).toString("base64");
      await p.addStyleTag({content:HIDE}); await U.settle(p,2); const canvas=(await p.screenshot({timeout:300000})).toString("base64");
      const st=await p.evaluate(()=>({apronTris:world.apron.geometry.attributes.position.count/3, surround:typeof PLATE!=="undefined"&&PLATE.surr.mesh?PLATE.surr.mesh.visible:null, neat:!!document.querySelector("#neatline:not([hidden])"), names:document.querySelectorAll(".pl-name:not([hidden])").length}));
      bufs.push({whole,canvas,st}); await p.context().close(); }
    const p=await U.open(b,NEW,{vp:[400,300]});
    const d=await p.evaluate(async([A,B])=>{ async function px(s){ const im=new Image(); await new Promise(r=>{ im.onload=r; im.src="data:image/png;base64,"+s; }); const c=document.createElement("canvas"); c.width=im.width; c.height=im.height; const x=c.getContext("2d",{willReadFrequently:true}); x.drawImage(im,0,0); return x.getImageData(0,0,c.width,c.height).data; }
      async function n(a,b){ const P=await px(a), Q=await px(b); let k=0; for(let i=0;i<P.length;i+=4) if(P[i]!==Q[i]||P[i+1]!==Q[i+1]||P[i+2]!==Q[i+2]) k++; return {differing:k, pixels:P.length/4}; }
      return {whole:await n(A.whole,B.whole), canvas:await n(A.canvas,B.canvas)}; },[bufs[0],bufs[1]]);
    await p.context().close();
    R.landscape.push({presentation:pres, whole:d.whole, canvas:d.canvas, base:bufs[0].st, build:bufs[1].st});
    if(d.canvas.differing) fails.push("the landscape's canvas differs in "+pres+": "+d.canvas.differing+" pixels");
    if(d.whole.differing) fails.push("the landscape's page differs in "+pres+": "+d.whole.differing+" pixels"); }
  R.surroundTriangles=R.landscape.length?R.landscape[0].build.apronTris:null;
  await b.close();
  R.failures=fails;
  console.log(JSON.stringify({forced:R.forced&&{neatline:R.forced.neatline,cartouche:R.forced.cartouche,names:R.forced.names.length}, reduced:R.reduced, landscape:R.landscape.map(x=>({pres:x.presentation, canvas:x.canvas, whole:x.whole})), surroundTriangles:R.surroundTriangles},null,1));
  console.log(fails.length?"FAILED ("+fails.length+"):\n  "+fails.join("\n  "):"spot: every check passed");
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(R,null,1)); }
  process.exit(fails.length?1:0);
})().catch(e=>{ console.error(e); process.exit(2); });
