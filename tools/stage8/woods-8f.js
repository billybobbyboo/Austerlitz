#!/usr/bin/env node
/* Stage 8, implementation PR 8F (decision 247 (a); docs/STAGE8_SPEC.md sections 7.3, 8 and 18): the woods' prototypes measured before anything
   is built ("8F begins with a prototype measured against 2F's checks"). On a page opened as the harness opens it, in each view (views.js), the
   build's trees and each prototype of tools/stage8/protos/woods.js put into the live scene (the same camera, clock and state), and measured:
   - the triangles a tree (by habit) and the scrub's;
   - the frame's draw calls and triangles, every pass (renderer.info, as stills.js);
   - the troops seen through the woods: the troops' pixels drawn white over every other solid thing drawn black (each mesh's own geometry and
     side; a card's alpha test kept), with the woods and without them: the share the woods leave visible;
   - the shimmer: the view drawn without its post-processing, then with the eye moved half a pixel to its right (the target with it); the
     pixels of the woods (drawn white over black, depth-tested) whose grey changes by more than 24 of 255, as a share of the woods' pixels;
   - the fragments the woods rasterise (each drawn alone, additively, no depth test, its alpha test off: what a card shades before it
     discards), per pixel they cover, and in all;
   - 2F's checks: every tree and scrub of a wood inside the drawn wood class (woodPlacement's rule, here: drawnCover and coverClass at each
     instance), the counts by kind unchanged;
   - a still (JPEG) of the view, beside the build's;
   - on a low-tier page (800 x 600: lowTier, no shadow pass) the Overview's and the low Pratzen view's calls and triangles.
   node tools/stage8/woods-8f.js [--module woods8h] [--views a,b] [--protos t-open,t-airy,t-lace | ""] [--out dir] [--tag name]   (the build: AUSTERLITZ_HTML, else the
   repository's; --tag names the JSON and the stills' "base", so that two builds' runs sit side by side)
   Writes <out>/woods-8f[-tag].json and <out>/woods/<view>-<id or tag>.jpg; measurement and prototype code only. */
"use strict";
const fs=require("fs"), path=require("path");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
/* --module: the prototypes' module in protos/ (8F's woods.js by default; 8H's woods8h.js, the crowns shaded as one volume) */
const L=require("./lib.js"), VIEWS=require("./views.js"), PW=require("./protos/"+(opt("--module")||"woods")+".js");
const ONLY=(opt("--views")||"woods-pheasantry,ice-sun,pratzen-low,close-sokolnitz,overview-field,ph8-overview-watch").split(",");
const PROTOS=(opt("--protos")===null?"t-open,t-airy,t-lace":opt("--protos")).split(",").filter(Boolean);   /* --protos "" : the build's own trees alone */
const OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8f")), TAG=opt("--tag");
const MEAS=function(){
  var W0=800, H0=450, rt=new THREE.WebGLRenderTarget(W0,H0), buf=new Uint8Array(W0*H0*4);
  var black=new THREE.MeshBasicMaterial({color:0x000000,side:THREE.DoubleSide}), white=new THREE.MeshBasicMaterial({color:0xFFFFFF,side:THREE.DoubleSide});
  var woods=[world.trees,world.conifers,world.scrub].filter(Boolean);
  function isWood(o){ for(var a=o;a;a=a.parent) if(woods.indexOf(a)>=0) return true; return false; }
  var troops=Object.keys(units).map(function(id){ return units[id].block; }).filter(Boolean);
  function isTroop(o){ for(var a=o;a;a=a.parent) if(troops.indexOf(a)>=0) return true; return false; }
  var solids=[groundMesh,world.apron,world.houses,world.roofs,world.spires,world.chimneys].filter(Boolean);
  function isSolid(o){ for(var a=o;a;a=a.parent) if(solids.indexOf(a)>=0) return true; return false; }
  /* each mesh drawn in a flat colour by a material of its own kind: its side, its map and alpha test where it has them */
  function paint(kind){ var swap=[], mats={};
    scene.traverse(function(o){ if(!(o.isMesh||o.isLine||o.isPoints||o.isSprite)) return; var c=null;
      if(kind.troops&&isTroop(o)) c=1; else if(kind.woods&&isWood(o)) c=kind.woodsWhite?1:0; else if(kind.solid&&isSolid(o)) c=0;
      var m0=o.material; if(c===null){ swap.push([o,m0,o.visible,undefined]); o.visible=false; return; }
      var key=c+"|"+(m0&&m0.alphaTest&&m0.map?m0.map.uuid+"|"+m0.alphaTest:"")+"|"+(m0&&m0.side);
      var m=mats[key]||(mats[key]=new THREE.MeshBasicMaterial({color:c?0xFFFFFF:0x000000, side:m0&&m0.side!==undefined?m0.side:THREE.FrontSide,
        map:m0&&m0.alphaTest&&m0.map?m0.map:null, alphaTest:m0&&m0.alphaTest&&m0.map?m0.alphaTest:0}));
      swap.push([o,m0,o.visible,o.instanceColor]); o.material=m; if(o.isInstancedMesh) o.instanceColor=null; });   /* the flat colour, not multiplied by the instances' */
    return function(){ swap.forEach(function(s){ s[0].material=s[1]; s[0].visible=s[2]; if(s[0].isInstancedMesh&&s[3]!==undefined) s[0].instanceColor=s[3]; }); Object.keys(mats).forEach(function(k){ mats[k].dispose(); }); }; }
  function draw(){ var bg=scene.background, fog=scene.fog, cc=renderer.getClearColor(new THREE.Color()), ca=renderer.getClearAlpha();
    scene.background=null; scene.fog=null; renderer.setClearColor(0,1); renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene,camera);
    renderer.readRenderTargetPixels(rt,0,0,W0,H0,buf); renderer.setRenderTarget(null); scene.background=bg; scene.fog=fog; renderer.setClearColor(cc,ca); return buf; }
  function count(b,th){ var n=0; for(var i=0;i<W0*H0;i++) if(b[i*4]>th) n++; return n; }
  var out={};
  /* the troops through the woods */
  var undo=paint({troops:true,woods:true,solid:true}); var withW=count(draw(),127); undo();
  undo=paint({troops:true,solid:true}); var noW=count(draw(),127); undo();
  out.troopsWith=withW; out.troopsWithout=noW; out.seen=noW?+(withW/noW).toFixed(4):null;
  /* the woods' mask, and the shimmer under half a pixel's move */
  undo=paint({woods:true,woodsWhite:true,solid:true,troops:false}); var mask=Uint8Array.from(draw()); undo(); var nMask=count(mask,127);
  var grey=function(b){ var g=new Float32Array(W0*H0); for(var i=0;i<W0*H0;i++) g[i]=0.299*b[i*4]+0.587*b[i*4+1]+0.114*b[i*4+2]; return g; };
  var keepP=landCam.position.clone(), keepT=orbitTarget.clone();
  var g0=grey(draw()), right=new THREE.Vector3().setFromMatrixColumn(landCam.matrixWorld,0).normalize();
  var d=landCam.position.distanceTo(orbitTarget), upx=2*d*Math.tan(landCam.fov*Math.PI/360)/H0;   /* world units a pixel spans at the target (this target's size) */
  landCam.position.addScaledVector(right,0.5*upx); orbitTarget.addScaledVector(right,0.5*upx); landCam.lookAt(orbitTarget); landCam.updateMatrixWorld(true);
  var g1=grey(draw()), ch=0; for(var i=0;i<W0*H0;i++) if(mask[i*4]>127&&Math.abs(g1[i]-g0[i])>24) ch++;
  landCam.position.copy(keepP); orbitTarget.copy(keepT); landCam.lookAt(orbitTarget); landCam.updateMatrixWorld(true);
  out.woodPx=nMask; out.shimmer=nMask?+(ch/nMask).toFixed(4):null; out.shimmerPx=ch;
  /* the fragments the woods rasterise: each drawn alone, additively (8 of 255 a fragment), no depth test, no alpha test */
  var addM={}, sw=[]; scene.traverse(function(o){ if(!(o.isMesh||o.isLine||o.isPoints||o.isSprite)) return; sw.push([o,o.material,o.visible,o.instanceColor]);
    if(!isWood(o)){ o.visible=false; return; } var k=String(o.material.side); o.material=addM[k]||(addM[k]=new THREE.MeshBasicMaterial({color:0x080808,blending:THREE.AdditiveBlending,
      transparent:true,depthTest:false,depthWrite:false,side:o.material.side})); if(o.isInstancedMesh) o.instanceColor=null; });
  var b=draw(), frag=0, cov=0; for(var j=0;j<W0*H0;j++){ var v=b[j*4]; if(v>0){ cov++; frag+=Math.round(v/8); } }
  sw.forEach(function(s){ s[0].material=s[1]; s[0].visible=s[2]; if(s[0].isInstancedMesh) s[0].instanceColor=s[3]; }); Object.keys(addM).forEach(function(k){ addM[k].dispose(); });
  out.fragments=frag; out.covered=cov; out.overdraw=cov?+(frag/cov).toFixed(2):null;
  rt.dispose(); black.dispose(); white.dispose(); requestRender(3);
  return out; };
/* 2F's rule at each instance, and the counts by kind */
const PLACE=function(){ var m=new THREE.Matrix4(), p=new THREE.Vector3(), R={wood:0,edge:0,village:0,stream:0,out:0,notModel:0,instances:0,broad:{},conifer:0,scrub:{}};
  world.trees.children.forEach(function(im){ if(im.material.map) return; (im.userData.kinds||[]).forEach(function(k){ R.broad[k]=(R.broad[k]||0)+1; }); });
  world.conifers.children.forEach(function(im){ R.conifer+=(im.userData.kinds||[]).length; }); (world.scrub.userData.kinds||[]).forEach(function(k){ R.scrub[k]=(R.scrub[k]||0)+1; });
  world.trees.children.concat(world.conifers.children,[world.scrub]).forEach(function(im){ var K=im.userData.kinds||[]; if(!K.length) return;
    for(var i=0;i<im.count;i++){ var k=K[i]; if(!k) continue; R[k]++; R.instances++; if(k!=="wood"&&k!=="edge") continue; im.getMatrixAt(i,m); p.setFromMatrixPosition(m);
      if(drawnCover(p.x,p.z)!==4) R.out++; if(coverClass(p.x,p.z,localHeight(p.x,p.z))!==4) R.notModel++; } });
  return R; };
const COST=function(){ renderer.info.autoReset=false; renderer.info.reset(); renderFrame(); return {calls:renderer.info.render.calls, tris:renderer.info.render.triangles}; };
(async()=>{
  fs.mkdirSync(path.join(OUT,"woods"),{recursive:true});
  const browser=await L.launch(), res={chromium:browser.version(), build:require("crypto").createHash("md5").update(fs.readFileSync(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html"))).digest("hex"), views:{}, lowTier:{}};
  let page=null;
  const save=()=>fs.writeFileSync(path.join(OUT,"woods-8f"+(TAG?"-"+TAG:"")+".json"),JSON.stringify(res,null,1));
  for(const name of ONLY){ const v=VIEWS[name]; if(!v) throw new Error("no view "+name);
    if(!page){ page=await L.open(browser,v.viewport); await L.inject(page,PW.inPage); }
    await L.applyCase(page,v);
    const R=res.views[name]={};
    for(const id of ["base"].concat(PROTOS)){
      if(id!=="base"){ await page.evaluate(k=>window.__p8[k].install(),id); await L.settle(page); }
      const tris=await page.evaluate(()=>window.__t8.tris()), cost=await page.evaluate(COST), m=await page.evaluate(MEAS), place=name===ONLY[0]?await page.evaluate(PLACE):undefined;
      await L.jpeg(page,path.join(OUT,"woods",name+"-"+(id==="base"&&TAG?TAG:id)+".jpg"),86);
      R[id]=Object.assign({tris, cost, place},m);
      console.log(name.padEnd(20)+id.padEnd(8)+" tree tris "+JSON.stringify(tris)+"; calls "+cost.calls+", tris "+cost.tris+"; troops seen "+m.seen+" ("+m.troopsWith+"/"+m.troopsWithout+"); shimmer "+m.shimmer+" of "+m.woodPx+" px; overdraw "+m.overdraw+" ("+m.fragments+" fragments)"+(place?"; placement "+JSON.stringify(place):""));
      if(id!=="base"){ await page.evaluate(k=>window.__p8[k].uninstall(),id); await L.settle(page); }
      save(); } }
  if(page) await page.close();
  /* a low tier: no shadow pass */
  const lp=await L.open(browser,[800,600]); await L.inject(lp,PW.inPage);
  for(const name of ["overview-field","pratzen-low"]){ const v=Object.assign({},VIEWS[name],{viewport:[800,600]}); await L.applyCase(lp,v);
    const R=res.lowTier[name]={lowTier:await lp.evaluate(()=>lowTier)};
    for(const id of ["base"].concat(PROTOS)){ if(id!=="base"){ await lp.evaluate(k=>window.__p8[k].install(),id); await L.settle(lp); }
      R[id]=await lp.evaluate(COST); console.log("lowTier "+name.padEnd(16)+id.padEnd(8)+JSON.stringify(R[id]));
      if(id!=="base"){ await lp.evaluate(k=>window.__p8[k].uninstall(),id); await L.settle(lp); } } }
  await lp.close(); save(); await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
