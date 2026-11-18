/* UI/UX roadmap step 5 (docs/UX_ART_AUDIT.md UA-08, Direction B on the paper map): the paper plate, by real input. Shared by the harness's live block
   "ux5" (check:selftest and check:visual; judged in thresholds.js checkUx5) and tools/ux-step5/block.js (any build: the base build's record is the
   reproduction). Every press is the browser's own input (Playwright's mouse, keyboard and touchscreen); page.evaluate only reads. Emulated touch
   (density 3, an iPhone's user agent) is not a physical device.
   - entered: on a fresh page at 1600 x 900, 1366 x 768 and 1280 x 720 (check:selftest: 1366 x 768, then the window to 1280 x 720), the card closed by
     its stay button, the clock to 09:30 by the rail's PageDown (the paper cases' clock), the Layers button and the Paper map button pressed, Esc: the plate as drawn (plateRead below): north's bearing, one scale and
     the scale bar (the harness's paperMap()), the field's box inside the free rectangle it is framed in, the neatline's box round that rectangle,
     every counter's drawn box against the neatline's inner side (or, on a build without one, the free rectangle), the step's twelve villages drawn
     (a map-layer place on, or a base lettering's name shown, each by the share of its box nothing else covers), the cartouche's box and words, the
     unobstructed share (the harness's measure);
   - down and back: a real drag across the map (the plate stands down), then the Overview's button (the field framed again, the plate back);
   - phone: a phone's page at 390 x 844 by taps (the card closed, the clock to 09:30 by the rail's keys, the Menu, Layers, Paper map, the panel
     closed): the plate as drawn there. */
"use strict";
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
/* the twelve villages (tools/ux-step5/villages.js): the eleven the narrative (PHASES, EVENTS, TOUR, ANALYSIS) names as villages, then Girzikowitz, the
   next by the same rule over the formations' text; each by its FEATURES id where the map layer has a place for it, and its name as the page spells it */
const TWELVE=[["sokolnitz","Sokolnitz"],["telnitz","Telnitz"],["augezd","Augezd"],["blasowitz","Blasowitz"],["kobelnitz","Kobelnitz"],["puntowitz","Puntowitz"],
  ["austerlitz","Austerlitz"],["pratzenv","Pratzen village"],["krzenowitz","Krzenowitz"],[null,"Holubitz"],[null,"Krug"],["girzikowitz","Girzikowitz"]];
/* in the page: the plate as drawn (any build: the neatline, the cartouche and the base lettering read where the build has them) */
function plateRead(twelve){
  if(typeof mlLayout==="function") mlLayout();
  const VW=innerWidth, VH=innerHeight, out={vw:VW, vh:VH, mode:mode, clock:clock, phase:curPhase};
  function shownBox(id){ const e=document.getElementById(id); if(!e||e.hidden) return null; const cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden") return null;
    const r=e.getBoundingClientRect(); return r.width>0&&r.height>0?[r.left,r.top,r.right,r.bottom].map(v=>Math.round(v*10)/10):null; }
  if(mode!=="staff"||typeof MAPCAM==="undefined") return Object.assign(out,{paper:false});
  const N=MAPCAM.north, E=MAPCAM.east, F=MAPCAM.field; let a0=1e9,a1=-1e9,b0=1e9,b1=-1e9;
  F.forEach(q=>{ const a=q[0]*E.x+q[1]*E.z, b=q[0]*N.x+q[1]*N.z; a0=Math.min(a0,a); a1=Math.max(a1,a); b0=Math.min(b0,b); b1=Math.max(b1,b); });
  const fr=MAPCAM.freeRect([a1-a0,b1-b0]), C=F.map(q=>MAPCAM.toScreen(q[0],q[1]));
  const fb=[Math.min(...C.map(c=>c[0])),Math.min(...C.map(c=>c[1])),Math.max(...C.map(c=>c[0])),Math.max(...C.map(c=>c[1]))];
  out.edges=C.map((c,i)=>{ const d=C[(i+1)%4], a=Math.atan2(d[1]-c[1],d[0]-c[0])*180/Math.PI, m=((a%90)+90)%90; return +(m>45?m-90:m).toFixed(3); });
  out.freeRect=fr.slice(); out.fieldBox=fb.map(Math.round); out.fieldInFree=!(fb[0]<fr[0]-1||fb[1]<fr[1]-1||fb[2]>fr[2]+1||fb[3]>fr[3]+1);
  out.framed=typeof MAPCAM.framed==="function"?MAPCAM.framed():null;
  const P=window.__aus&&window.__aus.paperMap?window.__aus.paperMap():null;
  out.paperMap=P?{north:P.northBearing, spread:P.spread, scaleBar:P.scaleBar, pxPerKm:P.pxPerKm, frameInFree:P.frameInFree}:null;
  out.unobstructed=window.__aus&&window.__aus.unobstructed?window.__aus.unobstructed():null;
  out.neatline=shownBox("neatline"); out.cartouche=shownBox("cartouche");
  const ct=document.getElementById("cartouche");
  out.cartWords=out.cartouche&&ct?[].map.call(ct.children,e=>e.textContent):null;
  if(typeof plateWords==="function"){ const w=plateWords(); out.cartWant=VW>=720?[w.k,w.t,w.s]:[w.k,w.t]; }
  out.surround=typeof PLATE!=="undefined"&&PLATE.surr&&PLATE.surr.mesh?!!PLATE.surr.mesh.visible:null;
  /* the map layer's drawn items; each counter's box against the neatline's inner side (2 px line, 2 px gap, 1 px line: 5 px inside its box), else the free rectangle */
  const inner=out.neatline?[out.neatline[0]+5,out.neatline[1]+5,out.neatline[2]-5,out.neatline[3]-5]:fr;
  const on=[]; for(const k in ML.items){ const it=ML.items[k]; if(it.eFrame===ML.frame&&it.state==="on"&&it.rect) on.push({k:k,cat:it.cat,lead:!!it.lead,r:it.rect}); }
  const outside=x=>x.r[0]<inner[0]-0.5||x.r[1]<inner[1]-0.5||x.r[2]>inner[2]+0.5||x.r[3]>inner[3]+0.5;
  const cs=on.filter(x=>x.cat==="counter");
  /* each counter's leader: from its anchor on the ground to the nearest point of its box, px (0 where it stands at its anchor) */
  const lead=cs.map(x=>{ const it=ML.items[x.k]; if(!it.gp) return 0; const v=it.gp.clone().project(camera), gx=(v.x*0.5+0.5)*VW, gy=(-v.y*0.5+0.5)*VH;
    const nx=Math.max(x.r[0],Math.min(gx,x.r[2])), ny=Math.max(x.r[1],Math.min(gy,x.r[3])); return Math.round(Math.hypot(gx-nx,gy-ny)); }).sort((a,b)=>a-b);
  out.leadPx={median:lead.length?lead[Math.floor(lead.length/2)]:null, max:lead.length?lead[lead.length-1]:null, sum:lead.reduce((a,b)=>a+b,0)};
  out.counters=cs.length; out.countersOutside=cs.filter(outside).map(x=>x.k); out.itemsOutside=on.filter(outside).map(x=>x.k); out.countersLed=cs.filter(x=>x.lead).length;
  out.placed=ML.stats.placed; out.dropped=ML.stats.dropped; out.droppedIds=(ML.stats.dropped_||[]).slice();
  /* the twelve: the share of a name's box no drawn layer item (but itself), panel or the cartouche covers */
  const covers=on.map(x=>({k:x.k,r:x.r}));
  (typeof mlPanels==="function"?mlPanels():[]).forEach((r,i)=>covers.push({k:"panel"+i,r:r}));
  if(out.cartouche) covers.push({k:"cartouche",r:out.cartouche});
  function share(r,self){ let n=0, ok=0;
    for(let y=r[1]+1;y<r[3]-1;y+=2) for(let x=r[0]+1;x<r[2]-1;x+=2){ n++; if(x<0||y<0||x>=VW||y>=VH) continue; let c=false;
      for(let i=0;i<covers.length&&!c;i++){ const q=covers[i]; if(q.k===self) continue; const b=q.r; if(x>=b[0]&&x<b[2]&&y>=b[1]&&y<b[3]) c=true; } if(!c) ok++; }
    return n?+(ok/n).toFixed(3):0; }
  out.twelve=twelve.map(t=>{ const id=t[0], it=id?ML.items["t:"+id]:null, li=!!(it&&it.eFrame===ML.frame&&it.state==="on"&&it.rect);
    const bl=document.querySelector('#paperletters [data-v="'+t[1]+'"]');
    let bs=null; if(bl){ const s=getComputedStyle(bl); if(s.display!=="none"&&s.visibility!=="hidden"){ const r=bl.getBoundingClientRect(); if(r.width>0&&r.height>0) bs=share([r.left,r.top,r.right,r.bottom],null); } }
    const ls=li?share(it.rect,"t:"+id):null;
    return {id:id, name:t[1], layer:ls, base:bs, drawn:(ls!==null&&ls>=0.9)||(bs!==null&&bs>=0.9)}; });
  out.twelveDrawn=out.twelve.filter(t=>t.drawn).length;
  return out;
}
async function enterPaper(page,phone){
  if(phone){ for(const q of ["#menubtn","#layersbtn",'.mode-btn[data-m="staff"]',"#layerclose"]){ await page.tap(q,{timeout:120000}); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(4)); } }
  else { await page.click("#layersbtn",{timeout:120000}); await page.click('.mode-btn[data-m="staff"]',{timeout:120000}); await page.keyboard.press("Escape"); await page.mouse.move(2,2); }
  await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(20)); await sleep(150);
}
/* the clock to 09:30 (the paper cases' clock, harness.js) by the rail's own keys: PageDown to each phase's start until it reads 570 (step 3's seek: the eye kept) */
async function toClock(page,t){
  for(let i=0;i<10&&(await page.evaluate(()=>clock))<t;i++){ await page.focus("#timerail"); await page.keyboard.press("PageDown"); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); }
  await page.evaluate(()=>{ if(document.activeElement) document.activeElement.blur(); }); return page.evaluate(()=>clock);
}
async function closeCard(page,phone){
  if(await page.evaluate(()=>!!(typeof firstRunOpen!=="undefined"&&firstRunOpen))){ if(phone) await page.tap("#fr-close",{timeout:120000}); else { await page.click("#fr-close",{timeout:120000}); await page.mouse.move(2,2); } }
  await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(4));
}
/* down and back: a real drag across the free map, then the Overview's button */
async function downBack(page){
  const fr=await page.evaluate(()=>{ const r=MAPCAM.freeRect(); return [(r[0]+r[2])/2,(r[1]+r[3])/2]; });
  await page.mouse.move(fr[0],fr[1]); await page.mouse.down(); for(let i=1;i<=6;i++) await page.mouse.move(fr[0]+12*i,fr[1]+4*i); await page.mouse.up(); await page.mouse.move(2,2);
  await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(6));
  const down=await page.evaluate(plateRead,TWELVE);
  await page.click('.van-btn[data-v="plan"]',{timeout:120000}); await page.mouse.move(2,2);
  await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(60)); await sleep(1000); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(10));
  const back=await page.evaluate(plateRead,TWELVE);
  return {down:{neatline:down.neatline, cartouche:down.cartouche, framed:down.framed, itemsOutside:down.itemsOutside.length},
    back:{neatline:back.neatline, cartouche:back.cartouche, framed:back.framed, countersOutside:back.countersOutside, twelveDrawn:back.twelveDrawn}};
}
async function runBlock(open,settle,opts){
  opts=opts||{}; const log=opts.log||(()=>{}), SO=!!opts.selftestOnly, out={entered:[], downBack:null, phone:null};
  const line=r=>"north "+(r.paperMap&&r.paperMap.north)+", neatline "+JSON.stringify(r.neatline)+", counters "+r.counters+" ("+r.countersOutside.length+" outside), twelve "+r.twelveDrawn+", cartouche "+(r.cartouche?"yes":"no")+", free "+r.unobstructed;
  const desk=SO?[[1366,768]]:[[1600,900],[1366,768],[1280,720]];
  for(const vp of desk){ const pg=await open(vp,null);
    try{ await settle(pg); await closeCard(pg,false); await toClock(pg,570); await enterPaper(pg,false);
      const r=await pg.evaluate(plateRead,TWELVE); r.vpName=vp.join("x"); r.how="entered"; out.entered.push(r); log("  ux5 entered "+r.vpName+": "+line(r));
      if(SO){ await pg.setViewportSize({width:1280,height:720});
        /* the app's own resize handler frames the field again (it runs at a rendering step): read once the window and the framing are the new ones */
        await pg.waitForFunction(()=>{ AUSTERLITZ_DEBUG.settle(2); if(innerWidth!==1280||innerHeight!==720) return false; const f=MAPCAM.freeRect(MAPCAM.fieldExt()),
          C=MAPCAM.field.map(q=>MAPCAM.toScreen(q[0],q[1])); return Math.max(...C.map(c=>c[0]))<=f[2]+1&&Math.max(...C.map(c=>c[1]))<=f[3]+1; },null,{timeout:120000,polling:200});
        await pg.evaluate(()=>AUSTERLITZ_DEBUG.settle(20)); await sleep(150);
        const r2=await pg.evaluate(plateRead,TWELVE); r2.vpName="1280x720"; r2.how="resized"; out.entered.push(r2); log("  ux5 resized 1280x720: "+line(r2)); }
      if(vp[0]===1366){ out.downBack=await downBack(pg); log("  ux5 down and back: "+JSON.stringify(out.downBack)); }
    } finally { const cx=pg.context(); await pg.close(); await cx.close().catch(()=>{}); } }
  const pp=await open([390,844],"ios");
  try{ await settle(pp); await closeCard(pp,true); await toClock(pp,570); await enterPaper(pp,true);
    const r=await pp.evaluate(plateRead,TWELVE); r.vpName="390x844"; r.how="taps"; out.phone=r; log("  ux5 phone 390x844: "+line(r)+", surround "+r.surround);
  } finally { const cx=pp.context(); await pp.close(); await cx.close().catch(()=>{}); }
  return out;
}
module.exports={runBlock, plateRead, enterPaper, toClock, TWELVE};
