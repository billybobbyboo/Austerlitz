#!/usr/bin/env node
/* Roadmap step 6 Part A (docs/STEP6_SPEC.md section 3.2): the figure level-of-detail options, prototyped in the page by this probe only (the
   build is unchanged; every change is made to the live scene after the page has started and undone before the next option), and measured:
   draw calls and triangles of one whole frame, the world pass's time here (software WebGL: relative within this run only, not a GPU's), and
   the share of the free rectangle's pixels that change against the unmodified frame (tools/stage5/lib.js __s5.diff, threshold 8 of 255).
   "Far" is decided per formation block by a man's height on screen (1.8 kit units at its first instance, CSS px), so the rule is the same at
   every factor and viewport; P is that height.
   Options:
   - blocks(P): beyond P, the block's men, horses and guns replaced by one box per drawn unit (battalion, squadron, or rider), the unit's
     extent, a man's height (a rider's on horse), in the mean of the unit's coat instance colours; one instanced mesh for all of them;
     the standards kept as they are;
   - thin(P,k): beyond P, each figure mesh drawn with every k-th man (instances copied down, count divided), so each class keeps its share;
   - noshadow(P): beyond P, the block's meshes cast no shadow (the shadow map's pass skips them);
   - merge: every figure and standard mesh of every block merged into one instanced mesh per geometry, colour and texture (instancing across
     blocks), its instances in world space; nothing else changes, so the picture should not change (three r128 culls no instanced mesh either
     way);
   - blocks(P)+noshadow(P).
   node tools/step6/lod-probe.js [--json out.json] [--shots dir] [--only name,name]
   Measurement only; nothing is written to a source file. Never run it beside check:visual. */
const fs=require("fs"), path=require("path");
const L=require("../stage7/lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), SHOTS=opt("--shots"), ONLY=opt("--only")?opt("--only").split(","):null;
const CASES=require(path.join(L.ROOT,"tools","visual","cases.js"));
const byName=n=>CASES.find(c=>c.name===n);
const VIEWS=["overview-field","overview-plan","pratzen-low","pratzen-low-10x","ph8-overview-watch","close-sokolnitz","selected-formation"].map(byName);
const OPTIONS=[{id:"blocks",P:4},{id:"blocks",P:8},{id:"thin",P:4,k:4},{id:"thin",P:8,k:4},{id:"noshadow",P:4},{id:"noshadow",P:8},
  {id:"merge"},{id:"blocks+noshadow",P:4},{id:"blocks+noshadow",P:8}];
const LOD=function(){
  var V=THREE.Vector3, m4=new THREE.Matrix4(), mw=new THREE.Matrix4(), p0=new V(), p1=new V(), undo=[];
  function meshes(b){ var ud=b.userData, out=[]; if(!ud) return out; [ud.body,ud.std].forEach(function(g){ if(g) g.traverse(function(o){ if(o.isMesh) out.push(o); }); }); return out; }
  function up(o){ while(o){ if(!o.visible) return false; o=o.parent; } return true; }
  function manPx(b){   /* a man's height on screen at the block, CSS px; null where the block draws no figure */
    var ud=b.userData, m=null; if(!ud||!ud.figs||!ud.figs.length) return null; m=ud.figs[0].mesh; if(!m.count) return null;
    b.updateMatrixWorld(true); m.getMatrixAt(0,m4); mw.multiplyMatrices(m.matrixWorld,m4);
    p0.set(0,0,0).applyMatrix4(mw); p1.set(0,1.8,0).applyMatrix4(mw);
    var a=p0.clone().project(camera), c=p1.clone().project(camera); if(a.z>1) return 0;
    return Math.abs(a.y-c.y)*window.innerHeight/2; }
  function drawnBlocks(){ var L=[]; Object.keys(units).forEach(function(id){ var b=units[id].block; if(b&&up(b)) L.push(b); }); return L; }
  function far(P){ return drawnBlocks().filter(function(b){ var px=manPx(b); return px!=null&&px<P; }); }
  function hide(m){ undo.push(function(){ m.material.visible=true; }); m.material.visible=false; }
  function add(o){ scene.add(o); undo.push(function(){ scene.remove(o); o.geometry.dispose(); o.material.dispose(); }); }
  var BOX=null;
  function blocks(P){
    var F=far(P), list=[];
    if(!BOX){ BOX=new THREE.BoxGeometry(1,1,1); BOX.translate(0,0.5,0); }
    F.forEach(function(b){ var ud=b.userData; b.updateMatrixWorld(true);
      (ud.dress||[]).forEach(function(r){ var coat=r.meshes[r.mounted?1:0], n=Math.min(coat.count,r.figures); if(!n||!up(coat)) return;
        var U=r.units.length?r.units:[0], per=Math.max(1,Math.round(r.figures/U.length)), C=coat.instanceColor&&coat.instanceColor.array;
        for(var k=0;k<U.length;k++){ var a=k*per, z=Math.min(n,(k+1)*per); if(a>=z) break;
          var lo=new V(1e9,1e9,1e9), hi=new V(-1e9,-1e9,-1e9), col=[0,0,0], h=0;
          for(var i=a;i<z;i++){ coat.getMatrixAt(i,m4); mw.multiplyMatrices(coat.matrixWorld,m4); p0.set(0,0,0).applyMatrix4(mw); lo.min(p0); hi.max(p0);
            if(i===a){ p1.set(0,r.mounted?2.3:1.8,0).applyMatrix4(mw); h=p1.distanceTo(p0); }
            if(C){ col[0]+=C[i*3]; col[1]+=C[i*3+1]; col[2]+=C[i*3+2]; } else { col[0]++; col[1]++; col[2]++; } }
          var c=z-a, pad=h*0.25; list.push({x:(lo.x+hi.x)/2, y:lo.y, z:(lo.z+hi.z)/2, sx:hi.x-lo.x+pad, sz:hi.z-lo.z+pad, h:h, c:[col[0]/c,col[1]/c,col[2]/c]}); } });
      meshes(b).forEach(function(m){ if(m.parent!==ud.std&&!(ud.std&&isIn(m,ud.std))) hide(m); }); });
    if(list.length){ var M=new THREE.InstancedMesh(BOX,matte({color:0xFFFFFF,flatShading:true}),list.length), d=new THREE.Object3D(), c=new THREE.Color();
      M.castShadow=true; M.frustumCulled=false;
      list.forEach(function(q,i){ d.position.set(q.x,q.y,q.z); d.scale.set(Math.max(q.sx,0.2),q.h,Math.max(q.sz,0.2)); d.rotation.set(0,0,0); d.updateMatrix(); M.setMatrixAt(i,d.matrix);
        c.setRGB(q.c[0],q.c[1],q.c[2]); M.setColorAt(i,c); });
      M.instanceMatrix.needsUpdate=true; if(M.instanceColor) M.instanceColor.needsUpdate=true; add(M); }
    return {far:F.length, boxes:list.length};
  }
  function isIn(o,g){ while(o){ if(o===g) return true; o=o.parent; } return false; }
  function thin(P,k){
    var F=far(P), n=0;
    F.forEach(function(b){ (b.userData.figs||[]).forEach(function(fg){ var m=fg.mesh; if(!m.count) return;
      var A=m.instanceMatrix.array, a0=A.slice(), C=m.instanceColor?m.instanceColor.array:null, c0=C?C.slice():null, cnt=m.count, j=0;
      for(var i=0;i<cnt;i+=k,j++){ for(var q=0;q<16;q++) A[j*16+q]=a0[i*16+q]; if(C) for(q=0;q<3;q++) C[j*3+q]=c0[i*3+q]; }
      m.count=j; m.instanceMatrix.needsUpdate=true; if(C) m.instanceColor.needsUpdate=true; n++;
      undo.push(function(){ A.set(a0); if(C) C.set(c0); m.count=cnt; m.instanceMatrix.needsUpdate=true; if(C) m.instanceColor.needsUpdate=true; }); }); });
    return {far:F.length, meshes:n};
  }
  function noshadow(P){
    var F=far(P); F.forEach(function(b){ meshes(b).forEach(function(m){ if(m.castShadow){ m.castShadow=false; undo.push(function(){ m.castShadow=true; }); } }); });
    return {far:F.length};
  }
  function merge(){
    var G={}, n=0;
    drawnBlocks().forEach(function(b){ b.updateMatrixWorld(true); meshes(b).forEach(function(m){ if(!m.isInstancedMesh||!m.count||!up(m)||!m.material.visible) return;
      var mt=m.material, key=m.geometry.uuid+"|"+mt.color.getHexString()+"|"+(mt.map?mt.map.uuid:"")+"|"+mt.side+"|"+mt.vertexColors+"|"+m.castShadow;
      var g=G[key]||(G[key]={geo:m.geometry, mat:mt, mats:[], cols:[], shadow:m.castShadow}), C=m.instanceColor&&m.instanceColor.array;
      for(var i=0;i<m.count;i++){ m.getMatrixAt(i,m4); g.mats.push(new THREE.Matrix4().multiplyMatrices(m.matrixWorld,m4)); g.cols.push(C?[C[i*3],C[i*3+1],C[i*3+2]]:[1,1,1]); }
      hide(m); n++; }); });
    var made=0, c=new THREE.Color();
    Object.keys(G).forEach(function(k){ var g=G[k], M=new THREE.InstancedMesh(g.geo,g.mat.clone(),g.mats.length);
      M.castShadow=g.shadow; M.frustumCulled=false; M.material.visible=true;
      g.mats.forEach(function(x,i){ M.setMatrixAt(i,x); c.setRGB(g.cols[i][0],g.cols[i][1],g.cols[i][2]); M.setColorAt(i,c); });
      M.instanceMatrix.needsUpdate=true; if(M.instanceColor) M.instanceColor.needsUpdate=true;
      scene.add(M); made++; undo.push(function(){ scene.remove(M); M.material.dispose(); }); });
    return {meshes:n, merged:made};
  }
  /* the census of the frame: calls and triangles of every pass (renderer.info, reset by the app at each frame's start) */
  function cost(){ renderFrame(); var r=renderer.info.render; return {calls:r.calls, tris:r.triangles}; }
  /* culling: three r128's InstancedMesh sets frustumCulled false (its constructor), so every block's meshes are drawn whatever the view; here,
     the figure meshes none of whose men is inside the view (each instance's figure sphere against the camera's frustum), and their triangles:
     what culling a block by its own bounds would skip */
  function culling(){
    var fr=new THREE.Frustum(), pm=new THREE.Matrix4(), s=new THREE.Sphere(), out={meshes:0, culledFlag:0, offView:0, offTris:0, onTris:0};
    camera.updateMatrixWorld(true); pm.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse); fr.setFromProjectionMatrix(pm);
    drawnBlocks().forEach(function(b){ b.updateMatrixWorld(true); meshes(b).forEach(function(m){ if(!m.isInstancedMesh||!m.count||!up(m)||!m.material.visible) return; out.meshes++;
      if(m.frustumCulled) out.culledFlag++;
      if(!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
      var g=m.geometry, tri=Math.floor((g.index?g.index.count:g.attributes.position.count)/3)*m.count, any=false;
      for(var i=0;i<m.count&&!any;i++){ m.getMatrixAt(i,m4); mw.multiplyMatrices(m.matrixWorld,m4); s.copy(g.boundingSphere).applyMatrix4(mw); if(fr.intersectsSphere(s)) any=true; }
      if(any) out.onTris+=tri; else { out.offView++; out.offTris+=tri; } }); });
    return out;
  }
  window.__lod={blocks:blocks, thin:thin, noshadow:noshadow, merge:merge, cost:cost, culling:culling, far:function(P){ return far(P).length; },
    pxHist:function(){ var H={}; drawnBlocks().forEach(function(b){ var px=manPx(b); if(px==null) return; var k=px<2?"<2":px<4?"2-4":px<8?"4-8":px<16?"8-16":">=16"; H[k]=(H[k]||0)+1; }); return H; },
    reset:function(){ while(undo.length) undo.pop()(); requestRender(3); }};
};
(async()=>{
  const browser=await L.launch(), page=await L.open(browser,[1600,900]);
  await L.inject(page,LOD);
  if(SHOTS) fs.mkdirSync(SHOTS,{recursive:true});
  const res={note:"software WebGL; calls and triangles are the build's; worldMs is relative within this run only",views:{}};
  for(const c of VIEWS){
    if(ONLY&&!ONLY.includes(c.name)) continue;
    await L.applyCase(page,c);
    const base=await page.evaluate(()=>{ const k=__lod.cost(); return Object.assign(k,{worldMs:window.__s5.frame(5), px:__lod.pxHist(), culling:__lod.culling()}); });
    const b64=await L.shot(page);
    if(SHOTS) fs.writeFileSync(path.join(SHOTS,c.name+"-base.png"),Buffer.from(b64,"base64"));
    const V={base, options:{}};
    console.log(c.name.padEnd(22),"base calls",base.calls,"tris",base.tris,"world",base.worldMs,"ms; man px blocks",JSON.stringify(base.px),"figure meshes",base.culling.meshes,"frustumCulled",base.culling.culledFlag,"wholly out of view",base.culling.offView,"their tris (world pass)",base.culling.offTris);
    for(const o of OPTIONS){
      const key=o.id+(o.P?"@"+o.P+"px":"")+(o.k?"/"+o.k:"");
      const info=await page.evaluate(o=>{ let i={}; o.id.split("+").forEach(id=>{ Object.assign(i,{[id]:id==="thin"?__lod.thin(o.P,o.k):id==="merge"?__lod.merge():__lod[id](o.P)}); }); return i; },o);
      await page.evaluate(()=>requestRender(3));
      const k=await page.evaluate(()=>Object.assign(__lod.cost(),{worldMs:window.__s5.frame(5)}));
      const s=await L.shot(page), d=await page.evaluate(([a,b])=>window.__s5.diff(a,b),[b64,s]);
      if(SHOTS&&/^(pratzen-low|overview-field|ph8-overview-watch)$/.test(c.name)) fs.writeFileSync(path.join(SHOTS,c.name+"-"+key.replace(/[@\/+]/g,"_")+".png"),Buffer.from(s,"base64"));
      await page.evaluate(()=>__lod.reset());
      const back=await page.evaluate(()=>__lod.cost());
      V.options[key]=Object.assign({info},k,{changed:d.changed, restored:back.tris===base.tris&&back.calls===base.calls});
      console.log("   ",key.padEnd(24),"calls",String(k.calls).padStart(5),"tris",String(k.tris).padStart(9),"("+(100*(k.tris-base.tris)/base.tris).toFixed(1)+"%)","world",k.worldMs,"ms changed",d.changed,JSON.stringify(info),back.tris===base.tris?"":"NOT RESTORED");
    }
    res.views[c.name]=V;
  }
  await browser.close();
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
