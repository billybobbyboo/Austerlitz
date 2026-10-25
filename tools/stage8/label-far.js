#!/usr/bin/env node
/* Stage 8 Part A (docs/STAGE8_SPEC.md section 7.2): what the proposed hierarchy by distance would touch. In each view, the map layer laid out
   as the build lays it out (mlLayout), and each drawn item's anchor distance from the eye against the eye's distance to the orbit target
   (viewDist): the items beyond 1.5 times that distance are those the proposal would draw a step smaller; by kind, with leader lines.
   node tools/stage8/label-far.js [--views a,b] [--json file]
   Measurement only (no frame is compared; the layout is the build's own).
   Stage 8, implementation PR 8C: on a build with the far step (decision 240 (a)), also the drawn items it draws a step smaller (stepped, by
   kind); the build is AUSTERLITZ_HTML's, else the repository's. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), VIEWS=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=(opt("--views")||"overview-field,pratzen-low,inf-mid,close-sokolnitz,stream-low,horizon-east,ice-low,ph8-overview-watch").split(","), JSONF=opt("--json");
(async()=>{
  const browser=await L.launch(), page=await L.open(browser,[1600,900]);
  const res={build:require("crypto").createHash("md5").update(fs.readFileSync(path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html")))).digest("hex"), ratio:1.5, views:{}};
  for(const name of ONLY){
    const v=VIEWS[name]; await L.applyCase(page,v);
    if(v.focus) throw new Error("focus views are not supported here");
    const R=await page.evaluate(()=>{ mlLayout(); var vd=viewDist(), out={viewDist:+vd.toFixed(1), drawn:0, far:0, farByCat:{}, farLeaders:0, nearLeaders:0, ratios:[], stepped:0, steppedByCat:{}};
      for(var k in ML.items){ var it=ML.items[k]; if(it.eFrame!==ML.frame||it.state!=="on") continue; out.drawn++;
        if(it.farC){ out.stepped++; out.steppedByCat[it.cat]=(out.steppedByCat[it.cat]||0)+1; }   /* Stage 8, 8C: drawn at the far step */
        var d=camera.position.distanceTo(it.world), r=d/vd; out.ratios.push(+r.toFixed(2));
        if(r>1.5){ out.far++; out.farByCat[it.cat]=(out.farByCat[it.cat]||0)+1; if(it.lead) out.farLeaders++; } else if(it.lead) out.nearLeaders++; }
      out.ratios.sort(function(a,b){ return a-b; }); return out; });
    res.views[name]=R;
    console.log(name.padEnd(20),"viewDist",R.viewDist,"drawn",R.drawn,"beyond 1.5x",R.far,JSON.stringify(R.farByCat),"leaders far/near",R.farLeaders+"/"+R.nearLeaders,"| at the far step",R.stepped,JSON.stringify(R.steppedByCat));
    if(JSONF){ fs.mkdirSync(path.dirname(JSONF),{recursive:true}); fs.writeFileSync(JSONF,JSON.stringify(res,null,1)); }
  }
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
