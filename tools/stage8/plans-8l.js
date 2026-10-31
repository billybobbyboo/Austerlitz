#!/usr/bin/env node
/* Stage 8, the integration pass (question 267's Plans line; docs/STAGE8_SPEC.md section 22): plans-overview (the Plans overlay, both plans, at
   the Overview vantage, Study, 09:30; tools/visual/cases.js) laid out on the builds given and on the last of them with the earlier one's PLANS
   (analysis.js: the two columns on the highway and the Allied staging, as before decision 260 (a)) put back in its script: every map item in
   placement order with its state, the candidate it took (-1 a ring or row place) and how far its anchor moved; the items dropped; for the
   Littawa's name (t:litava, a place name: drawn only beside its own 10 px marker) its marker and its eight places and what covers each; and on
   the last build the Littawa's name given the keyboard's focus (A-2: a focused item is always drawn), then let go.
   node tools/stage8/plans-8l.js <before.html> <after.html> [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), crypto=require("crypto");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const L=require("./lib.js"), TR=require(path.join(L.ROOT,"tools","visual","three-route.js")), CASES=require(path.join(L.ROOT,"tools","visual","cases.js"));
const MEASURE=fs.readFileSync(path.join(L.ROOT,"tools","visual","measure.js"),"utf8");
const OUT=opt("--json"), builds=argv.filter((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json").map(a=>path.resolve(a));
if(builds.length!==2){ console.error("two builds: <before.html> <after.html>"); process.exit(2); }
/* PLANS as 8J's build has them (analysis.js before decision 260 (a)), against 8K's */
const PLANS_8J=[['{n:"Bagration on the highway", c:[352,64], rx:70, ry:30}','{n:"Bagration on the highway", c:[377,95], rx:70, ry:30}'],
  ['forms:["bag"], obj:[266,85],','forms:["bag"], obj:[253,73],'], ['route:[[351,60],[309,74],[288,79],[266,85]]},','route:[[315,41],[292,52],[273,62],[253,73]]},'],
  ['forms:["suchet", "caffarelli", "santon"], obj:[321,70],','forms:["suchet", "caffarelli", "santon"], obj:[304,46],'],
  ['route:[[231,98],[260,86],[291,78],[321,70]]},','route:[[225,97],[247,75],[276,61],[304,46]]},']];
(async()=>{
  const C=CASES.find(c=>c.name==="plans-overview"), R={case:C.name, layouts:[]};
  let s=fs.readFileSync(builds[1],"utf8"); PLANS_8J.forEach(([a,b])=>{ const n=s.split(a).length-1; if(n!==1) throw new Error("PLANS replacement found "+n+" times: "+a); s=s.replace(a,()=>b); });
  const cf=path.join(fs.mkdtempSync(path.join(os.tmpdir(),"plans-8l-")),path.basename(builds[1],".html")+"-plans8j.html"); fs.writeFileSync(cf,s);
  const list=[[builds[0],path.basename(builds[0])],[builds[1],path.basename(builds[1])],[cf,path.basename(builds[1])+" with "+path.basename(builds[0])+"'s PLANS"]];
  for(let li=0;li<list.length;li++){ const [html,label]=list[li], browser=await L.launch(), errs=[];
    const page=await browser.newPage({viewport:{width:C.viewport[0],height:C.viewport[1]},deviceScaleFactor:1}); page.on("pageerror",e=>errs.push(e.message));
    await TR.routeThree(page); await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page);
    await page.evaluate(MEASURE); await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
    await page.evaluate(()=>{ AUSTERLITZ_DEBUG.settle(90); closeFirst(null); }); await page.evaluate(c=>window.__aus.apply(c),C);
    await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await page.waitForTimeout(500); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(4));
    const X=await page.evaluate(()=>{ mlLayout(); var VW=renderer.domElement.clientWidth, VH=renderer.domElement.clientHeight, panels=mlPanels(), obst=mlObstacles(VW,VH), o=[];
      for(var k in ML.items){ var it=ML.items[k]; if(it.eFrame!==ML.frame) continue; var ci=-1;
        if(it.state==="on"&&it.rect){ var C=mlCands(it); for(var i=0;i<C.length;i++) if(Math.abs(C[i][0]-it.rect[0])<0.01&&Math.abs(C[i][1]-it.rect[1])<0.01) ci=i; }
        o.push({key:k, pri:+(+it.pri).toFixed(3), keep:!!it.keep, mode:it.mode, focusable:!!it.focusable, state:it.state, cand:ci, anchor:[+it.sx.toFixed(1),+it.sy.toFixed(1)], rect:it.state==="on"&&it.rect?it.rect.map(Math.round):null}); }
      o.sort(function(a,b){ return (a.keep!==b.keep)?(a.keep?-1:1):(a.pri-b.pri); });
      var L=ML.items["t:litava"], lit=null;
      if(L&&L.eFrame===ML.frame){ var cov=function(x0,y0,w,h){ var why=[]; if(x0<ML_PAD||y0<ML_PAD||x0+w>VW-ML_PAD||y0+h>VH-ML_PAD) why.push("the screen's edge");
          panels.forEach(function(q,j){ if(mlHits(x0,y0,x0+w,y0+h,[q])) why.push("panel "+j); }); obst.forEach(function(q,j){ if(mlHits(x0,y0,x0+w,y0+h,[q])) why.push("a symbol (obstacle "+j+")"); });
          for(var q in ML.items){ var t=ML.items[q]; if(q==="t:litava"||t.eFrame!==ML.frame||t.state!=="on") continue; if(t.rect&&mlHits(x0,y0,x0+w,y0+h,[t.rect])) why.push(q); if(t.mrect&&mlHits(x0,y0,x0+w,y0+h,[t.mrect])) why.push(q+"'s marker"); }
          return why; };
        lit={state:L.state, anchor:[+L.sx.toFixed(1),+L.sy.toFixed(1)], marker:cov(L.sx-5,L.sy-5,10,10), places:mlCands(L).map(function(c){ return {box:[Math.round(c[0]),Math.round(c[1]),Math.round(c[0]+L.w),Math.round(c[1]+L.h)], covered:cov(c[0],c[1],L.w,L.h)}; })}; }
      return {dropped:ML.stats.dropped_.slice().sort(), items:o, litava:lit}; });
    if(li===1){ X.focus=await page.evaluate(()=>{ var it=ML.items["t:litava"]; if(!it) return null; it.el.focus({preventScroll:true}); mlLayout();
        var r={focused:document.activeElement===it.el, state:it.state, forced:!!it.forced, rect:it.rect?it.rect.map(Math.round):null, clear:it.clear};
        it.el.blur(); mlLayout(); r.after=it.state; return r; }); }
    R.layouts.push(Object.assign({label:label, md5:crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex"), console:errs},X));
    console.log(label+": "+X.dropped.length+" dropped "+JSON.stringify(X.dropped)+(X.litava?"; t:litava "+X.litava.state+", its marker covered by "+JSON.stringify(X.litava.marker):"")+(X.focus?"; focused: "+JSON.stringify(X.focus):""));
    await browser.close(); }
  /* what moved between the first two layouts, in placement order */
  const [A,B]=R.layouts, mA=Object.fromEntries(A.items.map(x=>[x.key,x]));
  R.changed=B.items.filter(b=>{ const a=mA[b.key]; return !a||a.state!==b.state||a.cand!==b.cand||JSON.stringify(a.rect)!==JSON.stringify(b.rect); })
    .map(b=>{ const a=mA[b.key]; return {key:b.key, pri:b.pri, before:a?{state:a.state,cand:a.cand,rect:a.rect}:null, after:{state:b.state,cand:b.cand,rect:b.rect}, anchorMovedPx:a?+Math.hypot(a.anchor[0]-b.anchor[0],a.anchor[1]-b.anchor[1]).toFixed(1):null}; });
  R.changed.filter(c=>c.anchorMovedPx>10||c.before&&c.before.state!==c.after.state).forEach(c=>console.log("  "+c.key.padEnd(36)+" anchor moved "+c.anchorMovedPx+" px, "+JSON.stringify(c.before)+" -> "+JSON.stringify(c.after)));
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(R,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
