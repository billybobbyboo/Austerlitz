#!/usr/bin/env node
/* Stage 8 Part A (docs/STAGE8_SPEC.md section 1): what each view's picture is made of. For each class of what is drawn, the share of the free
   rectangle (outside every panel) whose pixels change by more than 8 of 255 when that class alone is hidden (tools/stage5/lib.js __s5.diff,
   as Stage 5's and step 6's probes compare frames), and the contrast of those pixels against what lies under them (the WCAG luminance ratio,
   median). A class's share is what it covers on screen as drawn, overlaps with other classes included. Classes: the movement arrows and their
   heads (layerOn.arrows), the ground marks (the confidence marks and decision 107's side footprint: CONF.none), the event glyphs and the plateau outline (eventGroup), the standards (each block's std group), the map layer's text and counters
   (#maplayer), the figures (each block's body). Also each arrow's width on screen at its middle (px), from its drawn
   ribbon's width and the view's scale there. Every class is shown again after its frame.
   node tools/stage8/density.js [--views a,b] [--json file] [--merge] (the JSON written after each view; --merge keeps an earlier run's views of
   the same build)
   Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), VIEWS=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=(opt("--views")||"overview-field,pratzen-low,inf-mid,close-sokolnitz,stream-low").split(","), JSONF=opt("--json");
const CLASSES={
  arrows:   ["layerOn.arrows=false;","layerOn.arrows=true;"],
  marks:    ["CONF.none=true;","CONF.none=false;"],
  events:   ["eventGroup.userData._v8=1; window.__evHide=true; eventGroup.traverse(function(o){ if(o.material) { o.material.userData._vis=o.material.visible; o.material.visible=false; } });",
             "eventGroup.traverse(function(o){ if(o.material) o.material.visible=o.material.userData._vis!==false; }); window.__evHide=false;"],
  standards:["Object.keys(units).forEach(function(k){ var u=units[k].block.userData; if(u&&u.std) u.std.visible=false; });","Object.keys(units).forEach(function(k){ var u=units[k].block.userData; if(u&&u.std) u.std.visible=true; });"],
  maptext:  ["document.getElementById('maplayer').style.visibility='hidden';","document.getElementById('maplayer').style.visibility='';"],
  figures:  ["Object.keys(units).forEach(function(k){ var u=units[k].block.userData; if(u&&u.body) u.body.visible=false; });","Object.keys(units).forEach(function(k){ var u=units[k].block.userData; if(u&&u.body) u.body.visible=true; });"]
};
(async()=>{
  const browser=await L.launch(), page=await L.open(browser,[1600,900]), res={build:require("crypto").createHash("md5").update(fs.readFileSync(path.join(L.ROOT,"austerlitz-command-map.html"))).digest("hex"), views:{}};
  if(JSONF&&argv.includes("--merge")&&fs.existsSync(JSONF)){ const old=JSON.parse(fs.readFileSync(JSONF,"utf8")); if(old.build===res.build) Object.assign(res.views,old.views); }
  const save=()=>{ if(JSONF){ fs.mkdirSync(path.dirname(JSONF),{recursive:true}); fs.writeFileSync(JSONF,JSON.stringify(res,null,1)); } };
  for(const name of ONLY){
    const v=VIEWS[name]; await L.applyCase(page,v);
    if(v.focus) throw new Error("focus views are not supported here");
    const base=await L.shot(page), R=res.views[name]={};
    for(const k of Object.keys(CLASSES)){
      await page.evaluate(c=>{ eval(c); requestRender(3); },CLASSES[k][0]); await L.settle(page);
      const s=await L.shot(page), d=await page.evaluate(([a,b])=>window.__s5.diff(a,b),[base,s]);
      await page.evaluate(c=>{ eval(c); requestRender(3); },CLASSES[k][1]); await L.settle(page);
      R[k]={share:d.changed, contrastMedian:d.contrastMedian, share3to1:d.share3to1};
    }
    /* the arrows' widths on screen: each live arrow's shaft at its curve's middle, its drawn width (the casing's) over the view's scale there */
    R.arrowsPx=await page.evaluate(()=>{ var out=[], O=OVERLAYS[curPhase]||{}; (O.arrows||[]).forEach(function(a){ var pts=arrowPts(a); if(!pts||pts.length<2||a.kind==="halt") return;
        var w=a.kind==="attack"?[2.0,2.6]:a.kind==="counter"?[1.8,2.3]:[1.3,1.6], m=pts[Math.floor(pts.length/2)], q=W(m[0],m[1]), P=new THREE.Vector3(q[0],groundY(q[0],q[1])+2.4,q[1]);
        var c=P.clone().project(camera); if(Math.abs(c.x)>1||Math.abs(c.y)>1||c.z>1) return; out.push(+(1.34*(w[0]+w[1])/2/worldPerPx(P)).toFixed(1)); }); return out.sort(function(a,b){ return a-b; }); });
    /* the map layer's census in this view: drawn items by kind, those with a leader, those whose anchor is more than 150 units from the eye, and
       those whose box lies in the upper quarter of the free rectangle (in a low view, the band toward the horizon) */
    R.labels=await page.evaluate(()=>{ mlLayout(); var fr=mode==="staff"?MAPCAM.freeRect():landFreeRect(), out={drawn:0,byCat:{},leaders:0,far150:0,upperQuarter:0,dropped:ML.stats.dropped,occluded:ML.stats.occluded,ms:+ML.stats.ms.toFixed(2)};
      for(var k in ML.items){ var it=ML.items[k]; if(it.eFrame!==ML.frame||it.state!=="on") continue; out.drawn++; out.byCat[it.cat]=(out.byCat[it.cat]||0)+1; if(it.lead) out.leaders++;
        if(camera.isPerspectiveCamera&&camera.position.distanceTo(it.world)>150) out.far150++; if(it.rect[3]<fr[1]+(fr[3]-fr[1])*0.25) out.upperQuarter++; }
      return out; });
    console.log(name.padEnd(20),Object.keys(CLASSES).map(k=>k+" "+(100*R[k].share).toFixed(1)+"%").join("  "),"arrows px",JSON.stringify(R.arrowsPx),"labels",JSON.stringify(R.labels));
    save();
  }
  await browser.close();
  save();
})().catch(e=>{ console.error(e); process.exit(1); });
