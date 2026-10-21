#!/usr/bin/env node
/* Roadmap step 6 Part A (docs/STEP6_SPEC.md section 3.1): the triangle and draw-call census of one whole frame, by view, display factor, pass,
   what is drawn, distance from the camera and the figures' size on screen. Hardware-independent: what the build asks the GPU to draw, the same
   on any machine at the same viewport (the counts, not the time).
   Every draw call is recorded where three r128 issues it (renderer.renderBufferDirect, wrapped for one frame and restored): its pass (the
   shadow map: called without a scene; the world: the app's scene; post-processing: any other), its object, triangles (the geometry's index or
   position count within its draw range, times the instance count for an instanced mesh, as three's own info counts them) and instances. The sum
   is checked against renderer.info.render.triangles and .calls for the same frame.
   What is drawn: each object labelled by the root it hangs from (a formation's block: its body, the figures, men and horses by the figure kit's
   geometries, the guns and gear, and its standards; the ground; trees, scrub, houses, roofs, chimneys, spires; draped lines; water and ice;
   the overlays; the evidence layers; the sky; the rest by name). A figure mesh's distance is its block's from the eye, and its size on screen
   is a man's height (1.8 units of the kit, its first instance) projected at the block's place, in CSS px.
   node tools/step6/census.js [--json out.json] [--only name,name]
   Opened as the harness opens a page (tools/stage7/lib.js: ?harness=1, software WebGL, 1600 x 900 unless the case says otherwise).
   Measurement only; nothing is written to a source file. Never run it beside check:visual. */
const fs=require("fs"), path=require("path");
const L=require("../stage7/lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), ONLY=opt("--only")?opt("--only").split(","):null;
const CASES=require(path.join(L.ROOT,"tools","visual","cases.js")).filter(c=>!c.fresh&&!c.interact);
/* the four views drawn at every factor (tools/stage5/lib.js MULTI), at 1x and 10.33x as well (pratzen-low has its own cases) */
const MULTI=["overview-field","close-sokolnitz","ph8-overview-watch"];
const VIEWS=[];
CASES.forEach(c=>{ VIEWS.push(c); if(MULTI.includes(c.name)){ VIEWS.push(Object.assign({},c,{name:c.name+"-1x",factor:1})); VIEWS.push(Object.assign({},c,{name:c.name+"-10x",factor:"model"})); } });
/* in the page: one frame recorded */
const CENSUS=function(){
  window.__census=function(){
    var BANDS=[60,120,240,480,1e9], PX=[2,4,8,16,1e9], label=new Map(), blockOf=new Map(), V=THREE.Vector3;
    function tag(root,l,blk){ if(!root) return; root.traverse(function(o){ if(!label.has(o)){ label.set(o,l); if(blk) blockOf.set(o,blk); } }); }
    var geos=kitGeos();
    Object.keys(units).forEach(function(id){ var r=units[id], b=r.block, ud=b&&b.userData;
      if(ud){ if(ud.std) tag(ud.std,"standards",b);
        if(ud.body) ud.body.traverse(function(o){ if(!o.isMesh) return; label.set(o,geos.indexOf(o.geometry)>=0?"figures: men and horses":"figures: guns and gear"); blockOf.set(o,b); }); tag(b,"figures: block other",b); }
      tag(r.smoke,"smoke"); tag(r.pad,"formation pads"); tag(r.dust,"dust"); tag(r.trail,"trails"); tag(r.conf,"confidence marks"); tag(r.foot,"footprints (1x)"); });
    [["groundMesh","ground"],["treeMesh","trees"],["coniferMesh","trees"],["scrubMesh","scrub"],["houseMesh","houses"],["roofMesh","roofs"],["chimMesh","chimneys"],
     ["spireMesh","spires"],["domeMesh","sky"],["sunDisc","sky"],["contourGroup","contours"],["marshGroup","marsh"],["paperGroup","paper map"],["mistGroup","mist"],
     ["analysisGroup","analysis overlay"],["eventGroup","event glyphs"],["overlayRoot","overlays (arrows)"],["planGroup","plans"],["selRing","selection ring"]].forEach(function(p){
      var o; try{ o=eval(p[0]); }catch(e){ o=null; } if(o) tag(o,p[1]); });
    try{ (DRAPED||[]).forEach(function(m){ tag(m,"draped: "+((m.userData.drape&&m.userData.drape.kind)||"line")); }); }catch(e){}
    try{ (waterMeshes||[]).forEach(function(m){ tag(m,"water and ice"); }); (iceRims||[]).forEach(function(m){ tag(m,"water and ice"); }); }catch(e){}
    try{ if(SKEL.grp) tag(SKEL.grp,"evidence skeleton"); }catch(e){}
    try{ if(ROUTES.grp) tag(ROUTES.grp,"ordered routes"); }catch(e){}
    var cam=camera, H=window.innerHeight, rows=[], orig=renderer.renderBufferDirect, p0=new V(), p1=new V(), m4=new THREE.Matrix4(), mw=new THREE.Matrix4();
    function screenPx(o){   /* a man's 1.8 kit units, at the first instance, in CSS px */
      if(!o.isInstancedMesh||!o.count) return null;
      o.getMatrixAt(0,m4); mw.multiplyMatrices(o.matrixWorld,m4);
      p0.set(0,0,0).applyMatrix4(mw); p1.set(0,1.8,0).applyMatrix4(mw);
      var a=p0.clone().project(cam), b=p1.clone().project(cam); if(a.z>1||b.z>1) return null;
      return Math.abs(a.y-b.y)*H/2; }
    renderer.renderBufferDirect=function(c,sc,g,mat,obj,grp){
      var n=g.index?g.index.count:(g.attributes.position?g.attributes.position.count:0);
      var s=Math.max(0,g.drawRange.start), e=Math.min(n,g.drawRange.start+g.drawRange.count); if(grp){ s=Math.max(s,grp.start); e=Math.min(e,grp.start+grp.count); }
      var cnt=Math.max(0,e-s), inst=obj.isInstancedMesh?obj.count:1, tri=((obj.isMesh||obj.isSprite)&&!mat.wireframe)?Math.floor(cnt/3)*inst:0;
      var pass=sc===null?"shadow":(sc===scene?"world":"post");
      var blk=blockOf.get(obj), d=null; if(blk){ blk.getWorldPosition(p0); d=p0.distanceTo(cam.position); }
      rows.push({pass:pass, what:label.get(obj)||("other: "+(obj.name||obj.type)), tri:tri, inst:inst, d:d, px:pass==="world"&&blk?screenPx(obj):null,
        geo:g.uuid, mapped:!!mat.map, fig:!!blk});
      return orig.apply(this,arguments); };
    try{ renderFrame(); } finally{ renderer.renderBufferDirect=orig; }
    var info=renderer.info.render, out={calls:rows.length, tris:0, infoCalls:info.calls, infoTris:info.triangles, byPass:{}, byWhat:{}, figBands:{}, figPx:{}, figures:{}};
    function add(o,k,r){ var x=o[k]||(o[k]={calls:0,tris:0,inst:0}); x.calls++; x.tris+=r.tri; x.inst+=r.inst; }
    rows.forEach(function(r){ out.tris+=r.tri; add(out.byPass,r.pass,r); add(out.byWhat,r.pass+" | "+r.what,r);
      if(r.fig){ var b=BANDS.findIndex(function(x){ return r.d<x; }); add(out.figBands,r.pass+" | <"+(BANDS[b]>=1e9?"inf":BANDS[b]),r);
        if(r.pass==="world"&&r.px!=null){ var q=PX.findIndex(function(x){ return r.px<x; }); add(out.figPx,"<"+(PX[q]>=1e9?"inf":PX[q])+" px",r); } } });
    /* the figure draw calls by kind of geometry (what instancing across blocks would merge: one call per distinct geometry and texture) */
    var fw=rows.filter(function(r){ return r.fig; }), keys={}, keysW={};
    fw.forEach(function(r){ keys[r.pass+"|"+r.geo+"|"+r.mapped]=1; if(r.pass==="world") keysW[r.geo+"|"+r.mapped]=1; });
    out.figures={calls:fw.length, tris:fw.reduce(function(a,r){ return a+r.tri; },0), distinctGeoAllPasses:Object.keys(keys).length, distinctGeoWorld:Object.keys(keysW).length,
      blocksDrawn:new Set(fw.map(function(r){ return r.d; })).size};
    out.camera={pos:cam.position.toArray().map(function(v){ return +v.toFixed(1); }), fx:FX.on, factor:DISPLAY.factor, mode:mode, viewport:[window.innerWidth,H]};
    return out;
  };
};
(async()=>{
  const browser=await L.launch(), res={note:"one whole frame per view, software WebGL; the counts are the build's, independent of the GPU",views:{}};
  let page=null, vp=null;
  for(const c of VIEWS){
    if(ONLY&&!ONLY.includes(c.name)) continue;
    if(!page||vp!==c.viewport.join("x")){ if(page) await page.close(); page=await L.open(browser,c.viewport); vp=c.viewport.join("x"); await L.inject(page,CENSUS); }
    await L.applyCase(page,c);
    const m=await page.evaluate(()=>window.__census());
    res.views[c.name]=m;
    const fig=m.figures, sh=m.byPass.shadow||{tris:0,calls:0};
    console.log(c.name.padEnd(26),"calls",String(m.calls).padStart(5),"(info",m.infoCalls+")","tris",String(m.tris).padStart(9),"(info",m.infoTris+")",
      "figures",String(fig.tris).padStart(9),(m.tris?(100*fig.tris/m.tris).toFixed(1):"-")+"%","fig calls",fig.calls,"shadow tris",sh.tris,"calls",sh.calls);
  }
  if(page) await page.close();
  await browser.close();
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
