#!/usr/bin/env node
/* Stage 2 Part A, section B (owner decision 19): what true scale (1x) could show. In-page PROBE on top of probe-exag.js.
   (a) 1x unchanged: figures, buildings and trees at their symbol scales on true-scale ground;
   (b) 1x with formations as footprints: the figure blocks hidden, each formation drawn as its modelled footprint
       (frontage W0 x sw and depth D0 x sd from the block's own layout, ground scale) in the side colour, laid on the
       drawn ground with the block's own tilt and yaw; buildings, roofs, chimneys, spires, trees and scrub hidden (their ground-scale
       extents stay in the ground palette as village and wood cover).
   Also timed: the probe's exag() call (re-seating everything, shade and palettes), which bounds what a factor change costs.
   Views: Pratzen vantage, the harness's low Pratzen view, Zuran vantage, at 09:30 / 09:50 (as exag-renders.js).
   node tools/stage2/exag-1x-options.js <outdir> */
const fs=require("fs"), path=require("path"), P=require("./page.js"), PROBE=require("./probe-exag.js");
const out=path.resolve(process.argv[2]||path.join(__dirname,"out","exag")); fs.mkdirSync(out,{recursive:true});
const FOOT=`window.__foot=function(on){
  ["trees","conifers","scrub","houses","roofs","spires"].forEach(function(k){ if(world[k]) world[k].visible=!on; });
  scene.children.forEach(function(o){ var g=o.isInstancedMesh&&o.geometry.parameters; if(g&&g.width===0.22&&g.height===0.5) o.visible=!on; });   /* the chimneys */
  if(window.__fp){ window.__fp.forEach(function(m){ scene.remove(m); }); window.__fp=null; }
  Object.keys(units).forEach(function(id){ var r=units[id]; if(!r.block) return;
    r.block.children.forEach(function(c){ c.visible=!on; });
    ["pad","smoke","dust"].forEach(function(k){ if(r[k]&&on) r[k].visible=false; }); });
  if(on){ window.__fp=[];
    Object.keys(units).forEach(function(id){ var r=units[id], u=r.block&&r.block.userData; if(!u||!r.block.visible||!posNow(id)) return;
      /* the modelled footprint: frontage W0 x sw, depth D0 x sd (ground scale), laid on the drawn ground */
      var m=new THREE.Mesh(PAD_GEO,new THREE.MeshBasicMaterial({color:lin(hexNum(TOKENS.sym.side[sideOfNation(r.f.nation)].base)),transparent:true,opacity:0.85,depthWrite:false}));
      m.scale.set(u.W0*u.sw,1,u.D0*u.sd); m.position.copy(r.block.position); m.position.y+=0.25; m.quaternion.copy(r.block.quaternion); m.renderOrder=4;
      scene.add(m); window.__fp.push(m); }); }
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
