/* UI/UX roadmap step 4 (docs/UX_ART_AUDIT.md UA-03, UA-04): the step's shared measures. Pages opened by the step-3 opener (tools/ux-step3/lib.js:
   three.js from the local copy checked against the page's integrity, ?harness=1), the harness's own in-page measures (tools/visual/measure.js:
   unobstructed(), the harness's panel list) and the first frame's measures of this step: the boxes of the card, the rail, the dispatch and the
   timeline; the battle area's luminance at a clock (the canvas alone, every interface element and the map layer hidden, sampled on the drawn
   ground inside the app's own actionExtent(), the day's battle the Overview frames); and the grade definitions on screen. Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const L3=require("../ux-step3/lib.js");
const MEASURE=fs.readFileSync(path.join(L3.ROOT,"tools","visual","measure.js"),"utf8");
const STILL="*,*::before,*::after{transition:none!important;animation:none!important}";
async function open(browser,html,o){ const p=await L3.open(browser,html,o); await p.evaluate(()=>document.fonts.ready); await p.evaluate(MEASURE);
  await p.addStyleTag({content:STILL}); await L3.settle(p,20); return p; }
/* the boxes and the unobstructed share (the harness's measure) */
function boxes(p){ return p.evaluate(()=>{ function b(q){ var e=document.querySelector(q); if(!e) return null; var cs=getComputedStyle(e); if(cs.display==="none"||e.hidden) return null;
    var r=e.getBoundingClientRect(); return r.width>0&&r.height>0?[Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]:null; }
  var fr=landFreeRect();
  return {vw:innerWidth, vh:innerHeight, unobstructed:window.__aus.unobstructed(), card:b("#firstrun"), rail:document.body.classList.contains("rail-hidden")?null:b(".rail"),
    dispatch:b(".dispatch"), timebar:b(".timebar"), tools:b(".tools"), legend:b(".legend"), freeMap:fr.map(Math.round), docked:document.body.classList.contains("docked"),
    tab:(document.querySelector('.tab-btn[aria-selected="true"]')||{dataset:{}}).dataset.t||null,
    derivedOnScreen:[].filter.call(document.querySelectorAll("small"),function(e){ var r=e.getBoundingClientRect(); if(!(/derived/.test(e.textContent)&&r.width>0&&r.bottom>0&&r.top<innerHeight&&!e.closest("#maplayer")&&shown(e))) return false;
      var h=document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2); return !!h&&(h===e||e.contains(h)); }).length,
    cardOverDispatch:(function(){ var a=document.querySelector("#firstrun"), d=document.querySelector(".dispatch"); if(!a||a.hidden||!d||getComputedStyle(d).display==="none") return 0;
      var r=a.getBoundingClientRect(), s=d.getBoundingClientRect(); return Math.round(Math.max(0,Math.min(r.right,s.right)-Math.max(r.left,s.left))*Math.max(0,Math.min(r.bottom,s.bottom)-Math.max(r.top,s.top))); })(),
    focus:(document.activeElement||{}).id||null}; }); }
/* the battle area's luminance: tools/visual/ux4.js battleLum (the live block's own measure), in the page */
const UX4=require(path.join(L3.ROOT,"tools","visual","ux4.js"));
function battleLum(p){ return p.evaluate(UX4.battleLum); }
/* the grade definitions on screen: for each of CONF_TEXT's three sentences, whether an element showing it is visible, on screen and not under
   another (the element at its middle is it or inside it) */
function gradesOnScreen(p){ return p.evaluate(()=>{ var out={};
  ["A","B","C"].forEach(function(g){ var want=CONF_TEXT[g], hit=null;
    document.querySelectorAll("body *").forEach(function(e){ if(hit||e.children.length>3) return; var t=(e.textContent||"").replace(/\s+/g," ");
      if(t.indexOf(want)<0) return; if(e.closest("#maplayer")) return;
      var r=e.getBoundingClientRect(); if(!(r.width>0&&r.height>0)||r.bottom<=0||r.top>=innerHeight||r.right<=0||r.left>=innerWidth) return;
      if(typeof shown==="function"&&!shown(e)) return;
      var cx=Math.min(innerWidth-1,Math.max(0,(r.left+r.right)/2)), cy=Math.min(innerHeight-1,Math.max(0,(Math.max(0,r.top)+Math.min(innerHeight,r.bottom))/2)), at=document.elementFromPoint(cx,cy);
      if(at&&(at===e||e.contains(at)||at.contains(e))) hit={tag:e.tagName.toLowerCase(),id:e.id||null,cls:e.className||null,box:[r.left,r.top,r.right,r.bottom].map(Math.round)}; });
    out[g]=hit; });
  return out; }); }
module.exports=Object.assign({},L3,{open, boxes, battleLum, gradesOnScreen, MEASURE});
