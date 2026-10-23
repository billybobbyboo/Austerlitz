#!/usr/bin/env node
/* Stage 8 Part A (docs/STAGE8_SPEC.md section 8): what a richer drawing would cost, counted, not guessed. Triangles per drawn thing in the
   build's kit (figKit, KIT_GEO, GEO, the settlements' and woods' instanced meshes) and in the prototypes' (tools/stage8/protos), and the
   whole build's triangles by kind in one view (pratzen-low, both passes) with each prototype in place, from renderer.info and the meshes
   themselves. Software WebGL: no frame time here is meaningful; the counts are the build's on any device.
   node tools/stage8/kit-census.js [--json file]   Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), VIEWS=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const JSONF=opt("--json");
const P={figures:require("./protos/figures.js"), buildings:require("./protos/buildings.js"), ground:require("./protos/ground.js")};
(async()=>{
  const browser=await L.launch(), page=await L.open(browser,[1600,900]);
  for(const k of Object.keys(P)) await L.inject(page,P[k].inPage);
  await L.applyCase(page,VIEWS["pratzen-low"]);
  const R=await page.evaluate(()=>{
    function tri(g){ return Math.round((g.index?g.index.count:g.attributes.position.count)/3); }
    var out={kit:{}, scene:{}, protos:{}};
    var K=figKit(); out.kit.manCoat=tri(K.infCoat); out.kit.manFixed=tri(K.infFixed); out.kit.riderCoat=tri(K.rider); out.kit.riderFixed=tri(K.riderFixed); out.kit.horse=tri(K.horse);
    out.kit.man=out.kit.manCoat+out.kit.manFixed; out.kit.mounted=out.kit.horse+out.kit.riderCoat+out.kit.riderFixed;
    out.kit.gun=tri(GEO.barrel)+2*tri(GEO.wheel)+tri(GEO.trail); out.kit.limbered=tri(GEO.limber)+4*tri(GEO.wheel)+tri(GEO.barrel)+4*out.kit.horse;
    out.kit.house=tri(houseMesh.geometry)+tri(roofMesh.geometry); out.kit.houses=houseMesh.count; out.kit.roofs=roofMesh.count;
    /* every instanced mesh in the scene by what it is (the census's own kinds, step 6), world pass only */
    var by={figures:0,standards:0,trees:0,scrub:0,buildings:0,ground:0,other:0}, figS=new Set(), stdS=new Set();
    Object.keys(units).forEach(function(id){ var u=units[id].block.userData; if(!u) return; if(u.body) u.body.traverse(function(o){ if(o.isMesh) figS.add(o); }); if(u.std) u.std.traverse(function(o){ if(o.isMesh) stdS.add(o); }); });
    scene.traverse(function(o){ if(!o.isMesh||!o.visible||(o.material&&o.material.visible===false)) return; var up=o; while(up){ if(!up.visible) return; up=up.parent; }
      var n=tri(o.geometry)*(o.isInstancedMesh?o.count:1), k="other";
      if(o===groundMesh) k="ground"; else if(o===houseMesh||o===roofMesh||o===chimneyMesh||o===spireMesh) k="buildings"; else if(o===scrubMesh) k="scrub";
      else if((treeMesh&&treeMesh.children.indexOf(o)>=0)||(coniferMesh&&coniferMesh.children.indexOf(o)>=0)) k="trees";
      else if(figS.has(o)) k="figures"; else if(stdS.has(o)) k="standards";
      by[k]+=n; });
    out.scene=by;
    renderer.info.autoReset=false; renderer.info.reset(); renderFrame(); out.frame={calls:renderer.info.render.calls, tris:renderer.info.render.triangles};
    return out; });
  /* the prototypes' own pieces, and the frame with each in place */
  for(const [id,label] of [["f-kit","figures"],["b-village","buildings"],["g-outline","ground"],["g-marker","ground"]]){
    const info=await page.evaluate(id=>window.__p8[id].install(),id); await L.settle(page);
    const f=await page.evaluate(()=>{ renderer.info.reset(); renderFrame(); return {calls:renderer.info.render.calls, tris:renderer.info.render.triangles}; });
    R.protos[id]=Object.assign({info},f,{dTris:f.tris-R.frame.tris, dCalls:f.calls-R.frame.calls});
    await page.evaluate(id=>window.__p8[id].uninstall(),id); await L.settle(page);
  }
  /* the prototype kit's pieces (built in the page by the figures module) */
  R.protoKit=await page.evaluate(()=>{ window.__p8["f-kit"].install(); var hb=units.heightguns.block.userData, b=units.sthilaire.block.userData, c=units.nansouty.block.userData, out={};
    function tri(g){ return Math.round((g.index?g.index.count:g.attributes.position.count)/3); }
    var m=b.dress[0].meshes; out.manCoat=tri(m[0].geometry); out.manFixed=tri(m[1].geometry); out.man=out.manCoat+out.manFixed;
    var r=c.dress[0].meshes; out.horse=tri(r[0].geometry); out.riderCoat=tri(r[1].geometry); out.riderFixed=tri(r[2].geometry); out.mounted=out.horse+out.riderCoat+out.riderFixed;
    var dep=hb.deployed.children; out.gun=tri(dep[0].geometry); var lim=hb.limbered.children; out.limberedGun=tri(lim[0].geometry); out.limber=tri(lim[1].geometry);
    window.__p8["f-kit"].uninstall(); return out; });
  await browser.close();
  console.log(JSON.stringify(R,null,1));
  if(JSONF){ fs.mkdirSync(path.dirname(JSONF),{recursive:true}); fs.writeFileSync(JSONF,JSON.stringify(R,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
