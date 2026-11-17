/* UI/UX roadmap step 4 (docs/UX_ART_AUDIT.md UA-03, UA-04): the first frame, by real input. Shared by the harness's live block "ux4"
   (check:selftest and check:visual; judged in thresholds.js checkUx4) and tools/ux-step4/block.js (any build: the base build's record is the
   reproduction). Every press is the browser's own input (Playwright's mouse, keyboard and touchscreen); page.evaluate only opens the card again
   and reads the result. Emulated touch (density 3, an iPhone's user agent) is not a physical device.
   - grades (UA-04): at every layout (the docked widths, the undocked, a short window, 430 px tall, a phone upright and held landscape), the card's
     key button ("Every symbol: the key") pressed: the key shown (the key panel, or the "?" sheet where the panel is not), and each of CONF_TEXT's
     three sentences on screen, inside the viewport and topmost at its middle; none of TIMING_TEXT's;
   - focus (decisions 117, 118): on a fresh page at 1600 x 900, 1366 x 768 and a phone's 390 x 844, the primary action focused at load, Tab, Tab, Tab
     and Shift+Tab kept inside the card in its order (the primary, the stay, the key's button), Esc and the stay button closing it where it stands
     (the clock and the eye unmoved) with the focus on Play;
   - first (UA-03): on those fresh pages, the card's box, the rail's and the unobstructed share (the harness's measure, tools/visual/measure.js,
     injected), whether the card scrolls, and the battle area's luminance at 04:00 (the canvas alone, every element over it hidden but the vignette,
     sampled on the drawn ground inside the app's actionExtent()). */
"use strict";
const fs=require("fs"), path=require("path");
const MEASURE=fs.readFileSync(path.join(__dirname,"measure.js"),"utf8");
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const GRADE_VIEWS=[[1600,900],[1366,768],[1280,720],[1080,800],[1024,768],[800,450],[1280,430]];
const GRADE_VIEWS_SO=[[1366,768],[1024,768],[1280,430]];
const PHONE_VIEWS=[[390,844],[844,390]];
const noDraw=page=>page.evaluate(()=>{ if(!window.__uxDraw){ window.__uxDraw=renderer.render; renderer.render=function(){}; } });
const draw=page=>page.evaluate(()=>{ if(window.__uxDraw){ renderer.render=window.__uxDraw; window.__uxDraw=null; } });

/* in the page: each grade's sentence on screen (an element showing it, inside the viewport and topmost at its middle), and the timing grades' */
function gradesOnScreen(){
  const out={on:{}, timing:[]}, vw=innerWidth, vh=innerHeight;
  function seen(want){ let hit=null;
    document.querySelectorAll("body *").forEach(e=>{ if(hit||e.closest("#maplayer")) return;
      if([].some.call(e.childNodes,n=>n.nodeType===3&&n.textContent.indexOf(want)>=0)===false) return;
      if(e.checkVisibility&&!e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})) return;
      const r=e.getBoundingClientRect(); if(!(r.width>0&&r.height>0)) return;
      if(r.top<-0.5||r.left<-0.5||r.bottom>vh+0.5||r.right>vw+0.5) return;
      const h=document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2); if(h&&(h===e||e.contains(h))) hit=[r.left,r.top,r.right,r.bottom].map(Math.round); });
    return hit; }
  ["A","B","C"].forEach(g=>{ out.on[g]=seen(CONF_TEXT[g]); if(seen(TIMING_TEXT[g])) out.timing.push(g); });
  const hp=document.getElementById("help"), a=document.activeElement;
  out.where=hp&&!hp.hidden?"help":"legend"; out.focus=a?(a.id||a.className||a.tagName):null; out.card=firstRunOpen;
  return out;
}
async function reopenCard(page){
  await page.evaluate(()=>{ if(typeof setHelp==="function") setHelp(false); if(typeof stopPlay==="function") stopPlay(); if(typeof select==="function") select(null,null);
    ML.legendOpen=false; const fr=document.getElementById("firstrun"); fr.hidden=false; openFirstRun(); });
  await sleep(300);
}
async function gradeCase(page,vp,tap){
  await reopenCard(page);
  if(tap) await page.tap("#fr-grades",{timeout:60000}); else await page.click("#fr-grades",{timeout:60000});
  await sleep(400);
  const r=await page.evaluate(gradesOnScreen);
  await page.keyboard.press("Escape"); await sleep(250);
  return Object.assign({vp:vp.join("x"),how:tap?"tap":"click"},r);
}
/* the first frame on a fresh page: focus and the ways out by real keys and clicks, then the frame's measures */
function pose(){ return {p:landCam.position.toArray(), t:orbitTarget.toArray(), clock:clock}; }
function moved(a,b){ return Math.max(Math.hypot(a.p[0]-b.p[0],a.p[1]-b.p[1],a.p[2]-b.p[2]),Math.hypot(a.t[0]-b.t[0],a.t[1]-b.t[1],a.t[2]-b.t[2]))+Math.abs(a.clock-b.clock); }
async function firstCase(page,vp,phone,o){
  const R={vp:vp.join("x"), phone:!!phone};
  const aid=()=>page.evaluate(()=>{ const a=document.activeElement; return a&&a!==document.body?(a.id||a.tagName):"body"; });
  await page.evaluate(MEASURE);
  R.atLoad=await aid();
  R.boxes=await page.evaluate(()=>{ function b(q){ const e=document.querySelector(q); if(!e||e.hidden||getComputedStyle(e).display==="none") return null; const r=e.getBoundingClientRect(); return r.width>0&&r.height>0?[r.left,r.top,r.right,r.bottom].map(Math.round):null; }
    const fr=document.getElementById("firstrun");
    return {card:b("#firstrun"), rail:document.body.classList.contains("rail-hidden")?null:b(".rail"), timebar:b(".timebar"), docked:document.body.classList.contains("docked"),
      scrolls:fr.scrollHeight>fr.clientHeight+1, rowsScroll:(function(){ const k=document.getElementById("fr-key"); return k.scrollHeight>k.clientHeight+1; })(),
      buttonsInCard:["fr-tour","fr-close","fr-grades"].every(id=>{ const e=document.getElementById(id).getBoundingClientRect(), c=fr.getBoundingClientRect(); return e.top>=c.top-0.5&&e.bottom<=c.bottom+0.5&&e.bottom<=innerHeight; }),
      unobstructed:window.__aus.unobstructed()}; });
  if(o&&o.lum) R.lum=await o.lum(page);
  const p0=await page.evaluate(pose);
  const tab=[]; for(const sh of [false,false,false,true]){ await page.keyboard.press(sh?"Shift+Tab":"Tab"); tab.push(await aid()); }
  R.tab=tab;
  await page.evaluate(()=>{ const b=document.getElementById("fr-tour"); b.focus({preventScroll:true}); });
  await page.keyboard.press("Escape"); await sleep(250);
  R.esc={card:await page.evaluate(()=>firstRunOpen), focus:await aid(), moved:+(moved(p0,await page.evaluate(pose))).toFixed(6)};
  await reopenCard(page); const p1=await page.evaluate(pose);
  if(phone) await page.tap("#fr-close",{timeout:60000}); else await page.click("#fr-close",{timeout:60000});
  await sleep(250);
  R.stay={card:await page.evaluate(()=>firstRunOpen), focus:await aid(), moved:+(moved(p1,await page.evaluate(pose))).toFixed(6)};
  return R;
}
async function runBlock(open,settle,opts){
  opts=opts||{}; const log=opts.log||(()=>{}), SO=!!opts.selftestOnly, out={grades:[],first:[]};
  const lum=opts.lum||null;
  /* fresh pages: the first frame */
  for(const [vp,dev] of [[[1600,900],null],[[1366,768],null],[[390,844],"ios"]]){ if(SO&&vp[0]===1600) continue;
    const pg=await open(vp,dev);
    try{ await settle(pg); const r=await firstCase(pg,vp,!!dev,{lum:SO?null:lum}); out.first.push(r);
      log("  ux4 first "+r.vp+": focus "+r.atLoad+", Tab "+r.tab.join(">")+", Esc "+JSON.stringify(r.esc)+", stay "+JSON.stringify(r.stay)+", free "+r.boxes.unobstructed+(r.lum?", battle median "+r.lum.median:""));
    } finally { const cx=pg.context(); await pg.close(); await cx.close().catch(()=>{}); } }
  /* the grades with the key open: a mouse page through the desktop sizes, then a phone's */
  const pm=await open([1600,900],null);
  try{ await settle(pm); if(SO) await noDraw(pm);
    for(const vp of (SO?GRADE_VIEWS_SO:GRADE_VIEWS)){ await pm.setViewportSize({width:vp[0],height:vp[1]}); await sleep(500); await pm.evaluate(()=>AUSTERLITZ_DEBUG.settle(3));
      const r=await gradeCase(pm,vp,false); out.grades.push(r); log("  ux4 grades "+r.vp+" ("+r.where+"): "+["A","B","C"].map(g=>g+(r.on[g]?"":" NOT")).join(", ")+(r.timing.length?"; timing "+r.timing:"")); }
    if(SO) await draw(pm);
  } finally { const cx=pm.context(); await pm.close(); await cx.close().catch(()=>{}); }
  const pp=await open([390,844],"ios");
  try{ await settle(pp); if(SO) await noDraw(pp);
    for(const vp of PHONE_VIEWS){ await pp.setViewportSize({width:vp[0],height:vp[1]}); await sleep(500); await pp.evaluate(()=>AUSTERLITZ_DEBUG.settle(3));
      const r=await gradeCase(pp,vp,true); out.grades.push(r); log("  ux4 grades "+r.vp+" tap ("+r.where+"): "+["A","B","C"].map(g=>g+(r.on[g]?"":" NOT")).join(", ")+(r.timing.length?"; timing "+r.timing:"")); }
    if(SO) await draw(pp);
  } finally { const cx=pp.context(); await pp.close(); await cx.close().catch(()=>{}); }
  return out;
}
module.exports={runBlock, gradesOnScreen, firstCase, GRADE_VIEWS, PHONE_VIEWS};
