#!/usr/bin/env node
/* The closing re-verification pass: dossier-click.js again, on the audit's driver instead of the app's real-time loop, so that the share of
   presses lost does not depend on this machine's software renderer (in real time here a frame of the 1600 x 900 page with a full dossier
   open takes hundreds of ms, and every press was lost). The driver (tools/audit-post8/interaction/ilib.js) runs the app's own loop on a clock
   of its own at 60 frames a second. A formation's full dossier is opened (Saint-Hilaire's at 07:00), Play pressed at ½× (or 4x), and the real
   mouse pressed on the day-track's second anchor, held for HOLD ms of the driver's frames, and released. Each press starts at another phase
   of the dossier's 250 ms repaint (0 to 15 frames after a settled start), N of them. A press is taken when the clock then stands at the anchor
   with Play stopped, as the anchor's click handler does (stopPlay, setClock). For each press it also records whether the dossier was repainted
   between the press and the release (the anchor under the pointer is another element). Nothing is changed.
   node tools/closing/dossier-click-driven.js [--json out.json] [--hold 100] [--speed 0.5]   (AUSTERLITZ_HTML for another build) */
"use strict";
const fs=require("fs"), path=require("path");
const I=require("../audit-post8/interaction/ilib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), HOLD=+(opt("--hold")||100), SPEED=opt("--speed")||"0.5", FMS=1000/60;
(async()=>{
  const b=await I.A.launch(), p=await I.openV(b,[1600,900],{harness:true}), out={hold:HOLD,speed:+SPEED,frameMs:FMS,res:[]};
  await p.evaluate(fm=>{ window.__drv.stop(); window.__drv.start({frameMs:fm}); },FMS);
  await p.keyboard.press("Escape");
  await I.clickEl(p,'.spd-btn[data-s="'+SPEED+'"]');
  await p.evaluate(()=>{ stopPlay(); setClock(420,{instant:true,force:true}); select("f","sthilaire"); });
  await I.F(p,20);
  const opened=await p.evaluate(()=>{ const B=[...document.querySelectorAll("#drawer-body button")]; const x=B.find(e=>/full dossier/i.test(e.textContent)); if(x){ x.click(); return true; } return false; });
  await I.F(p,40); await I.domSettle(p,300);
  out.fullDossier=opened; out.anchors=await p.evaluate(()=>document.querySelectorAll("#drawer-body .dt-a").length);
  const nHold=Math.max(1,Math.round(HOLD/FMS));
  for(let k=0;k<16;k++){
    await p.evaluate(()=>{ stopPlay(); setClock(420,{instant:true,force:true}); paintDrawer(); });
    await I.F(p,4);
    await I.clickEl(p,"#play");
    await I.F(p,20+k);
    const at=await p.evaluate(()=>{ const a=document.querySelectorAll("#drawer-body .dt-a")[1]; if(!a) return null; a.scrollIntoView({block:"center"}); a.dataset.ccMark="1";
      const r=a.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,t:+a.dataset.t,clock}; });
    if(!at){ out.res.push({k,taken:false,why:"no anchor"}); continue; }
    await p.mouse.move(at.x,at.y); await p.mouse.down();
    await I.F(p,nHold);
    const same=await p.evaluate(([x,y])=>{ const e=document.elementFromPoint(x,y), g=e&&e.closest?e.closest(".dt-a"):null; return !!(g&&g.dataset.ccMark==="1"); },[at.x,at.y]);
    await p.mouse.up(); await I.F(p,2);
    const s=await p.evaluate(()=>({clock,playing}));
    out.res.push({k,pressedAt:+at.clock.toFixed(3),anchorT:at.t,repaintedDuringPress:!same,taken:!s.playing&&Math.abs(s.clock-at.t)<1e-6,clock:+s.clock.toFixed(3),playing:s.playing});
    await p.evaluate(()=>stopPlay());
  }
  const taken=out.res.filter(r=>r.taken).length, rep=out.res.filter(r=>r.repaintedDuringPress).length, repLost=out.res.filter(r=>r.repaintedDuringPress&&!r.taken).length;
  out.summary={presses:out.res.length,taken,repaintedDuringPress:rep,lostWhenRepainted:repLost,lostOtherwise:out.res.filter(r=>!r.repaintedDuringPress&&!r.taken).length};
  console.log("Play at "+SPEED+"x, presses of "+HOLD+" ms ("+nHold+" frames at 60 a second), 16 phases of the repaint: "+taken+" of "+out.res.length+" taken; the dossier repainted during "+rep+
    " presses, "+repLost+" of them lost; lost otherwise "+out.summary.lostOtherwise+"; full dossier "+opened+", anchors "+out.anchors);
  await b.close(); out.md5=require("crypto").createHash("md5").update(fs.readFileSync(process.env.AUSTERLITZ_HTML||path.join(I.ROOT,"austerlitz-command-map.html"))).digest("hex");
  console.log("build md5 "+out.md5);
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
})().catch(e=>{ console.error(e); process.exit(2); });
