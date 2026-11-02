#!/usr/bin/env node
/* Final audit after Stage 8, verification v-repro-ux-maps: an independent reproduction of visual-maps V-M1 (the timeline's rail under a finger)
   and the phone part of V-M2/V-M3 (the key, the compass), on a VISITOR's phone page: A.openPhone (390 x 844, density 3, touch, isMobile, an
   iPhone's user agent), no ?harness=1, CSS transitions kept; "Explore on my own" by a real tap.
   Set-up by script, said so: the clock to 09:30 (setClock, as the harness's phone cases set it) and, between the gestures, the clock put back
   and the selection cleared (select(null,null)). Gestures by real input: CDP Input.dispatchTouchEvent drags, Playwright's touchscreen.tap.
   The hit map: document.elementFromPoint at every CSS pixel along three lines of the rail (4 px below its top, its middle, 4 px above its foot).
   node tools/audit-post8/verification/v-repro-ux-maps/phone.js  -> docs/audit-post8-evidence/verification/v-repro-ux-maps/phone.json + JPEGs */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../../lib.js");
const OUT=path.join(A.EVID,"verification","v-repro-ux-maps"); fs.mkdirSync(OUT,{recursive:true});
const R={build:"austerlitz-command-map.html md5 f10fe585c46aea576f436ed51ac46f83",browser:"Chromium 141.0.7390.37 headless shell, SwiftShader",page:"visitor phone page 390x844 (A.openPhone, harness:false)",steps:[]};
const save=()=>fs.writeFileSync(path.join(OUT,"phone.json"),JSON.stringify(R,null,1));
const step=(what,o)=>{ R.steps.push(Object.assign({what},o)); console.log("STEP",what,JSON.stringify(o).slice(0,300)); save(); };
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const HIT=function(dy){   /* dy: px below the rail's top (null: its middle) */
  var r=document.getElementById("timerail").getBoundingClientRect(), y=r.top+(dy==null?r.height/2:dy), c={rail:0,marker:0,other:0}, hitIds={}, segs=[], cur=null;
  for(var x=Math.ceil(r.left);x<=Math.floor(r.right)-1;x++){
    var e=document.elementFromPoint(x+0.5,y), k="other", m=e&&e.closest?e.closest(".ev-mark"):null;
    if(m){ k="marker"; hitIds[m.getAttribute("aria-label")]=1; } else if(e&&e.closest&&e.closest("#timerail")) k="rail";
    c[k]++; if(!cur||cur.k!==k){ cur={k:k,a:x,b:x,el:k==="other"&&e?(e.id||String(e.className)||e.tagName):""}; segs.push(cur); } else cur.b=x;
  }
  var n=c.rail+c.marker+c.other;
  return {rail:[r.left,r.top,r.width,r.height].map(function(v){ return +v.toFixed(1); }),y:+y.toFixed(1),px:n,share:{rail:+(c.rail/n).toFixed(3),marker:+(c.marker/n).toFixed(3),other:+(c.other/n).toFixed(3)},
    markersHit:Object.keys(hitIds).length,markersTotal:document.querySelectorAll("#evmarks .ev-mark").length,
    railSegs:segs.filter(function(s){ return s.k==="rail"; }).map(function(s){ return [s.a,s.b]; }),otherSegs:segs.filter(function(s){ return s.k==="other"; }).map(function(s){ return [s.a,s.b,s.el]; })};
};
const ST=()=>({clock:+clock.toFixed(2),clockText:fmtClock(clock),selection:selection?selection.kind+":"+selection.id:null,drawerOpen:document.body.classList.contains("drawer-open"),
  drawerTitle:((document.querySelector("#drawer-body h2, #drawer-body h3")||{}).textContent||"").trim().slice(0,90)});
(async()=>{
  const t0=Date.now(), b=await A.launch();
  let page;
  try{
    page=await A.openPhone(b,[390,844],{harness:false,transitions:true});
    step("open phone 390x844",{bootS:Math.round((Date.now()-t0)/1000)});
    await page.waitForSelector("#fr-close",{state:"visible",timeout:120000});
    await page.tap("#fr-close",{timeout:180000}); await wait(1500);
    await page.evaluate(()=>{ setClock(570,{instant:true,force:true}); AUSTERLITZ_DEBUG.settle(20); });
    await wait(800);
    const st0=await A.state(page);
    const hm={top4:await page.evaluate(HIT,4),middle:await page.evaluate(HIT,null),foot4:await page.evaluate(HIT,20)};
    step("V-M1 hit map after Explore (real tap) and the clock set to 09:30 (set-up)",{phone:st0.phone,clock:st0.clock,hitmap:hm});
    const cdp=await page.context().newCDPSession(page);
    const drag=async(x0,y,dx,n)=>{ await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:x0,y:y}]});
      for(let i=1;i<=n;i++){ await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x0+dx*i/n,y:y}]}); await wait(40); }
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]}); await wait(700); };
    const reset=()=>page.evaluate(()=>{ select(null,null); setClock(570,{instant:true,force:true}); AUSTERLITZ_DEBUG.settle(4); });
    const M=hm.middle, yMid=M.y;
    /* a start on the rail: the middle of the widest rail segment of the middle line */
    const seg=M.railSegs.slice().sort((p,q)=>(q[1]-q[0])-(p[1]-p[0]))[0];
    const xr=Math.round((seg[0]+seg[1])/2)+0.5;
    let s0=await page.evaluate(ST); await drag(xr,yMid,60,10); let s1=await page.evaluate(ST);
    step("V-M1 real touch drag 60 px right from the rail (widest rail segment "+seg.join("-")+") at y "+yMid,{x0:xr,before:s0,after:s1});
    await reset();
    /* a start on a marker: the first point of the middle line, from 30% of the rail's width, that hits a marker */
    const mk=await page.evaluate(y=>{ var r=document.getElementById("timerail").getBoundingClientRect(); for(var x=Math.ceil(r.left+r.width*0.3);x<r.right-70;x++){ var e=document.elementFromPoint(x+0.5,y), m=e&&e.closest?e.closest(".ev-mark"):null; if(m) return {x:x+0.5,label:m.getAttribute("aria-label")}; } return null; },yMid);
    s0=await page.evaluate(ST); await drag(mk.x,yMid,60,10); s1=await page.evaluate(ST);
    step("V-M1 real touch drag 60 px right starting on a marker's hit area ("+String(mk.label).slice(0,70)+") at x "+mk.x+", y "+yMid,{before:s0,after:s1});
    await reset();
    /* the same x, 4 px above the rail's foot */
    s0=await page.evaluate(ST); await drag(mk.x,hm.foot4.y,60,10); s1=await page.evaluate(ST);
    step("V-M1 real touch drag 60 px right from the same x, 4 px above the rail's foot (y "+hm.foot4.y+")",{before:s0,after:s1});
    await reset();
    s0=await page.evaluate(ST); await page.touchscreen.tap(mk.x,yMid); await wait(1200); s1=await page.evaluate(ST);
    const tapShot=path.join(OUT,"phone-rail-tap-marker.jpg"); await A.jpeg(page,tapShot,78);
    step("V-M1 real tap (touchscreen.tap) on the same marker point",{before:s0,after:s1,shot:path.relative(A.ROOT,tapShot)});
    await reset();
    /* a second marker point, at 60% of the width, as a check that the first was not special */
    const mk2=await page.evaluate(y=>{ var r=document.getElementById("timerail").getBoundingClientRect(); for(var x=Math.ceil(r.left+r.width*0.6);x<r.right-70;x++){ var e=document.elementFromPoint(x+0.5,y), m=e&&e.closest?e.closest(".ev-mark"):null; if(m) return {x:x+0.5,label:m.getAttribute("aria-label")}; } return null; },yMid);
    if(mk2){ s0=await page.evaluate(ST); await drag(mk2.x,yMid,-60,10); s1=await page.evaluate(ST);
      step("V-M1 real touch drag 60 px LEFT starting on another marker's hit area ("+String(mk2.label).slice(0,70)+") at x "+mk2.x,{before:s0,after:s1}); await reset(); }

    /* ---- V-M2 / V-M3 on the phone ---- */
    const LEGP=()=>{ var lg=document.querySelector(".legend"), ro=document.querySelector(".legend .rose"), s=getComputedStyle(lg), rs=getComputedStyle(ro), r=ro.getBoundingClientRect();
      return {legendDisplay:s.display,roseDisplay:rs.display,roseBox:[r.left,r.top,r.width,r.height].map(Math.round),roseShown:s.display!=="none"&&rs.display!=="none"&&r.width>0}; };
    const VIS=sel=>page.evaluate(s=>[].filter.call(document.querySelectorAll(s),function(e){ var q=e.getBoundingClientRect(), c=getComputedStyle(e); return q.width>0&&q.height>0&&c.visibility!=="hidden"&&c.display!=="none"; }).map(function(e){ return (e.id?"#"+e.id+" ":"")+(e.textContent||"").replace(/\s+/g," ").trim().slice(0,60); }),sel);
    const legE=await page.evaluate(LEGP);
    await page.tap("#menubtn",{timeout:180000}); await wait(1200);
    const menu=await VIS("#tools button");
    await page.tap("#menubtn",{timeout:180000}); await wait(900);
    await page.tap("#menubtn",{timeout:180000}); await wait(900);
    await page.tap("#layersbtn",{timeout:180000}); await wait(1500);
    const layers=await page.evaluate(()=>{ var p=document.getElementById("layerpop"); return (p.innerText||"").replace(/[ \t]+/g," ").split("\n").map(function(s){ return s.trim(); }).filter(Boolean); });
    await page.tap('.mode-btn[data-m="staff"]',{timeout:180000}); await wait(1500);
    await page.tap("#layerclose",{timeout:180000}); await wait(2500);
    await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(20)); await wait(800);
    const paperShot=path.join(OUT,"phone-paper.jpg"); await A.jpeg(page,paperShot,78);
    const legP=await page.evaluate(LEGP), stP=await A.state(page);
    step("V-M2/V-M3 phone: the key and the rose after Explore; the Menu's buttons; the Layers panel's text; the paper map entered by real taps",
      {explore:legE,menuButtons:menu,layersText:layers,paper:{mode:stP.mode,leg:legP,shot:path.relative(A.ROOT,paperShot)}});
    /* the sources sheet by the phone's route (Menu, Panels, Accuracy and sources): what it explains of the encodings */
    await page.tap("#menubtn",{timeout:180000}); await wait(1200);
    await page.tap("#panelsbtn",{timeout:180000}); await wait(1500);
    await page.tap("#srcbtn",{timeout:180000}); await wait(2000);
    const src=await page.evaluate(()=>{ var b=document.getElementById("modal-body"), t=(b.innerText||""); var K=["Confidence grades","grade's letter","soft frontage","diffuse zone","evidence skeleton","dashed","How the arrows are drawn","interpretive","reported","status","echelon","XXX","glyph","viewshed","blue"];
      var hits={}; K.forEach(function(k){ var i=t.indexOf(k); hits[k]=i<0?null:t.slice(Math.max(0,i-60),i+120).replace(/\s+/g," "); });
      return {open:document.getElementById("modal").classList.contains("on"),chars:t.length,h3:[].map.call(b.querySelectorAll("h3"),function(h){ return h.textContent.trim(); }),hits:hits}; });
    step("V-M2: the sources sheet reached by real taps (Menu, Panels, Accuracy and sources): which encodings it explains",{src});
    R.errors=A.errors(page);
  }catch(e){ step("FAILED",{err:String(e.stack||e).slice(0,800)}); if(page) R.errors=A.errors(page); }
  finally{ R.seconds=Math.round((Date.now()-t0)/1000); save(); await b.close().catch(()=>{}); console.log("done",R.seconds,"s"); }
})();
