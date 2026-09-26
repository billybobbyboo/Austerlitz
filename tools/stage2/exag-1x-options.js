#!/usr/bin/env node
/* Stage 2 Part A, section B (owner decision 19): what true scale (1x) could show. In-page PROBE on top of probe-exag.js.
   (a) 1x unchanged: figures, buildings and trees at their symbol scales on true-scale ground;
   (b) 1x with formations as footprints: the figure blocks hidden, each formation drawn as its modelled footprint
       (the pad the app already lays under a block: frontage and depth from the model, plus its 4.5-unit margin)
       tinted in the side colour; buildings, roofs, chimneys, spires, trees and scrub hidden (their ground-scale
       extents stay in the ground palette as village and wood cover).
   Also timed: the probe's exag() call (re-seating everything, shade and palettes), which bounds what a factor change costs.
   Views: Pratzen vantage, the harness's low Pratzen view, Zuran vantage, at 09:30 / 09:50 (as exag-renders.js).
   node tools/stage2/exag-1x-options.js <outdir> */
const fs=require("fs"), path=require("path"), P=require("./page.js"), PROBE=require("./probe-exag.js");
const out=path.resolve(process.argv[2]||path.join(__dirname,"out","exag")); fs.mkdirSync(out,{recursive:true});
const FOOT=`window.__foot=function(on){
  ["trees","conifers","scrub","houses","roofs","spires"].forEach(function(k){ if(world[k]) world[k].visible=!on; });
  scene.children.forEach(function(o){ var g=o.isInstancedMesh&&o.geometry.parameters; if(g&&g.width===0.22&&g.height===0.5) o.visible=!on; });   /* the chimneys */
  Object.keys(units).forEach(function(id){ var r=units[id]; if(!r.block) return;
    r.block.children.forEach(function(c){ c.visible=!on; });
    if(r.pad){ if(on){ r.pad.userData.c0=r.pad.userData.c0||r.pad.material.color.clone(); r.pad.material.color.copy(lin(hexNum(TOKENS.sym.side[sideOfNation(r.f.nation)].base))); r.pad.material.opacity=0.9; }
      else if(r.pad.userData.c0){ r.pad.material.color.copy(r.pad.userData.c0); r.pad.material.opacity=0.66; } } });
  renderFrame();
};`;
(async()=>{
  const b=await P.launch(), page=await P.open(b,[1600,900]); await page.evaluate(PROBE); await page.evaluate(FOOT);
  /* the probe's cost of changing the factor (re-seating every built object, recomputing shade and palettes) */
  const ms=[]; for(const f of [4,1]) ms.push(await page.evaluate(f=>{ const t=performance.now(); __stage2.exag(f); return +(performance.now()-t).toFixed(0); },f));
  console.log("exag() ms (4x, then 1x):",ms.join(", "));
  const low=P.CASES.find(c=>c.name==="pratzen-low"), tiles=[];
  for(const [name,v] of [["pratzen","plateau"],["pratzen-low",null],["zuran","zuran"]]){
    const spec=v?{t:570,presentation:"watch",mode:"terrain",cam:await page.evaluate(v=>__stage2.reframe(VANTAGE[v]),v)}:low;
    await P.applyCase(page,spec);
    await page.evaluate(()=>__foot(false)); let png=await page.screenshot({timeout:300000}); tiles.push({png,cap:name+" 1x (a) unchanged"});
    await page.evaluate(()=>__foot(true)); png=await page.screenshot({timeout:300000}); tiles.push({png,cap:name+" 1x (b) footprints"});
    fs.writeFileSync(path.join(out,name+"-1-footprints.png"),png);
    await page.evaluate(()=>__foot(false));
  }
  fs.writeFileSync(path.join(out,"sheet-1x-options.jpg"),await P.sheet(page,tiles,2,800,450,"True scale (1x): (a) symbols unchanged, (b) formations as footprints, buildings and trees as ground cover"));
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  await b.close(); console.log("done");
})().catch(e=>{ console.error(e); process.exit(2); });
