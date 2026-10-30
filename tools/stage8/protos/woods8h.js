/* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md sections 18.10 item 4 and 20.10): the deciduous crowns shaded as one volume. 8F's open
   crowns (world.js treeKit, treeShell: each crown a perforated shell of its jittered icosahedron's faces, each kept face shrunk toward its own
   centre) are lit facet by facet (treeGeo's normals are each triangle's own): close to the eye a crown reads as separate facets, and under a
   half-pixel's move its facets flash (8F measured the shimmer at 1.93% of the woods' pixels against 8E's 1.39% in the pheasantry view; "shading
   the shells as one volume would calm both; not tried here"). An in-page prototype (nothing here is in the source): each habit rebuilt exactly as
   treeKit builds it (its limbs and shells by world.js's own treeLimbs and treeShell, 8F's values TREE8F, the habits' crowns as treeKit lists them,
   copied below), the shells' vertices given the normal of their crown's ellipsoid at that vertex (outward from the crown's centre, through its
   radii), the limbs and the trunk their own, and the material's flat shading turned off (with it on, three derives each fragment's normal from
   the screen-space slope of its triangle and the geometry's normals are not read: the facets' light, and their flicker under a sub-pixel move,
   come from that). The same triangles, instances, matrices, colours and shadows; only the normals and the material's flat shading change.
   Variants: "t-vol", the ellipsoid's normal; "t-vol50", half the ellipsoid's and half the facet's (a facet's tilt kept, softened). The scrub's
   two shells likewise. window.__p8[id].install() / uninstall(), as tools/stage8/protos/woods.js's (tools/stage8/woods-8f.js --module woods8h). */
"use strict";
const inPage=function(){
  if(window.__t8h) return true;
  window.__p8=window.__p8||{};
  var HAB=[{T:1.1, cr:[[1,[0,2.0,0],[1.25,1.05,1.25]],[2,[0.55,2.35,0.2],[0.75,0.7,0.75]],[3,[-0.5,2.25,-0.3],[0.7,0.62,0.7]]]},
           {T:1.5, cr:[[2,[0,2.4,0],[0.95,1.1,0.95]],[3,[0.1,3.4,0.1],[0.7,0.85,0.7]]]},
           {T:0.8, cr:[[3,[0,1.6,0],[1.55,0.85,1.45]],[1,[0.8,1.7,0],[0.7,0.55,0.7]],[2,[-0.75,1.65,0.3],[0.65,0.5,0.65]]]},
           {T:1.2, cr:[[2,[0,2.4,0],[0.62,1.5,0.62]],[3,[0,3.5,0],[0.45,0.8,0.45]]]}];   /* world.js treeKit's HAB, copied */
  function rebuild(build,blend){ var P=[], shells=[]; build(P,shells); var g=treeGeo(P), N=g.attributes.normal.array;
    shells.forEach(function(S){ for(var i=S.a;i<S.b;i+=3){ var x=(P[i]-S.c[0])/(S.s[0]*S.s[0]), y=(P[i+1]-S.c[1])/(S.s[1]*S.s[1]), z=(P[i+2]-S.c[2])/(S.s[2]*S.s[2]), L=Math.hypot(x,y,z)||1;
      var nx=x/L*blend+N[i]*(1-blend), ny=y/L*blend+N[i+1]*(1-blend), nz=z/L*blend+N[i+2]*(1-blend), M=Math.hypot(nx,ny,nz)||1; N[i]=nx/M; N[i+1]=ny/M; N[i+2]=nz/M; } });
    g.attributes.normal.needsUpdate=true; return g; }
  function shell(P,shells,seed,c,s,keep,shrink){ var a=P.length; treeShell(P,seed,c,s,keep,shrink); shells.push({a:a,b:P.length,c:c,s:s}); }
  function kit(blend){ return {
    broad:HAB.map(function(h,vi){ return rebuild(function(P,shells){ treeLimbs(P,h,vi); h.cr.forEach(function(C){ shell(P,shells,C[0],C[1],C[2],TREE8F.keep,TREE8F.shrink); }); },blend); }),
    scrub:rebuild(function(P,shells){ treePrism(P,[0,0,0],[0.05,0.55,0],0.05,0.02,3); treePrism(P,[0.1,0,0.05],[0.55,0.45,0.2],0.04,0.016,3);
      shell(P,shells,1,[0,0.5,0],[1,0.6,0.9],TREE8F.scrubKeep,TREE8F.scrubShrink); shell(P,shells,1,[0.6,0.4,0.2],[0.6,0.45,0.55],TREE8F.scrubKeep,TREE8F.scrubShrink); },blend) }; }
  var undo=[];
  function swap(m,g){ undo.push([m,m.geometry,m.material.flatShading]); m.geometry=g; m.material.flatShading=false; m.material.needsUpdate=true; }
  function install(blend){ uninstall(); var K=treeKit(), N=kit(blend);
    world.trees.children.forEach(function(im){ var vi=K.broad.indexOf(im.geometry); if(vi>=0) swap(im,N.broad[vi]); });
    if(world.scrub&&world.scrub.geometry===K.scrub) swap(world.scrub,N.scrub);
    requestRender(3); return undo.length; }
  function uninstall(){ undo.forEach(function(u){ var g=u[0].geometry; u[0].geometry=u[1]; u[0].material.flatShading=u[2];
      if(u.length>3){ u[0].material.onBeforeCompile=u[3]; u[0].material.customProgramCacheKey=u[4]; } u[0].material.needsUpdate=true; if(g!==u[1]) g.dispose(); }); undo=[]; requestRender(3); return true; }
  window.__p8["t-vol"]={install:function(){ return install(1); }, uninstall:uninstall};
  window.__p8["t-vol50"]={install:function(){ return install(0.5); }, uninstall:uninstall};
  /* "t-near", "t-nearvol": near the eye, each kept face of a crown grows back toward its full size (8F shrinks it to TREE8F.shrink about its
     own centre, which close up reads as separate floating shards): in the vertex shader, by the eye's distance to the face's centre, the face at
     full size within NEAR units, as built beyond FAR, eased between; the same triangles, instances and draw calls (one attribute more a vertex:
     the face's centre, the limbs' and the trunk's own place). "t-nearvol" with t-vol's volume normals and smooth shading too. The shadows are
     the built crowns' (the depth material untouched): a prototype's simplification */
  var NEAR=5, FAR=16;
  function centres(g,shells,nLimb){ var P=g.attributes.position.array, C=new Float32Array(P.length); C.set(P);
    shells.forEach(function(S){ for(var i=S.a;i<S.b;i+=9){ for(var k=0;k<3;k++){ var c=(P[i+k]+P[i+3+k]+P[i+6+k])/3; C[i+k]=c; C[i+3+k]=c; C[i+6+k]=c; } } });
    g.setAttribute("aFC",new THREE.Float32BufferAttribute(C,3)); return g; }
  function rebuildNear(build,blend){ var P=[], shells=[]; build(P,shells); var g=blend>0?null:treeGeo(P);
    if(!g){ g=treeGeo(P); var N=g.attributes.normal.array; shells.forEach(function(S){ for(var i=S.a;i<S.b;i+=3){ var x=(P[i]-S.c[0])/(S.s[0]*S.s[0]), y=(P[i+1]-S.c[1])/(S.s[1]*S.s[1]), z=(P[i+2]-S.c[2])/(S.s[2]*S.s[2]), L=Math.hypot(x,y,z)||1; N[i]=x/L; N[i+1]=y/L; N[i+2]=z/L; } }); }
    return centres(g,shells); }
  function kitNear(blend,shrink){ return {
    broad:HAB.map(function(h,vi){ return rebuildNear(function(P,shells){ treeLimbs(P,h,vi); h.cr.forEach(function(C){ shell(P,shells,C[0],C[1],C[2],TREE8F.keep,TREE8F.shrink); }); },blend); }),
    scrub:rebuildNear(function(P,shells){ treePrism(P,[0,0,0],[0.05,0.55,0],0.05,0.02,3); treePrism(P,[0.1,0,0.05],[0.55,0.45,0.2],0.04,0.016,3);
      shell(P,shells,1,[0,0.5,0],[1,0.6,0.9],TREE8F.scrubKeep,TREE8F.scrubShrink); shell(P,shells,1,[0.6,0.4,0.2],[0.6,0.45,0.55],TREE8F.scrubKeep,TREE8F.scrubShrink); },blend) }; }
  function nearHook(inv){ return function(sh){ atmoUniforms(sh);
    sh.vertexShader=sh.vertexShader.replace("#include <common>","#include <common>\nattribute vec3 aFC;")
      .replace("#include <begin_vertex>","#include <begin_vertex>\n#ifdef USE_INSTANCING\nvec4 tnW=modelMatrix*instanceMatrix*vec4(aFC,1.0);\n#else\nvec4 tnW=modelMatrix*vec4(aFC,1.0);\n#endif\n"+
        "float tnG=clamp(("+FAR.toFixed(1)+"-distance(tnW.xyz,cameraPosition))/"+(FAR-NEAR).toFixed(1)+",0.0,1.0); tnG=tnG*tnG*(3.0-2.0*tnG);\n"+
        "transformed=aFC+(transformed-aFC)*mix(1.0,"+inv.toFixed(6)+",tnG);"); }; }
  function swapNear(m,g,inv,smooth){ undo.push([m,m.geometry,m.material.flatShading,m.material.onBeforeCompile,m.material.customProgramCacheKey]);
    m.geometry=g; if(smooth) m.material.flatShading=false; m.material.onBeforeCompile=nearHook(inv); m.material.customProgramCacheKey=function(){ return "t-near-"+inv+"-"+(smooth?1:0); }; m.material.needsUpdate=true; }
  function installNear(smooth){ uninstall(); var K=treeKit(), N=kitNear(smooth?1:0);
    world.trees.children.forEach(function(im){ var vi=K.broad.indexOf(im.geometry); if(vi>=0) swapNear(im,N.broad[vi],1/TREE8F.shrink,smooth); });
    if(world.scrub&&world.scrub.geometry===K.scrub) swapNear(world.scrub,N.scrub,1/TREE8F.scrubShrink,smooth);
    requestRender(3); return undo.length; }
  window.__p8["t-near"]={install:function(){ return installNear(false); }, uninstall:uninstall};
  window.__p8["t-nearvol"]={install:function(){ return installNear(true); }, uninstall:uninstall};
  /* the tool's triangle count a tree (as protos/woods.js's __t8.tris) */
  window.__t8h=true;
  if(!window.__t8) window.__t8={tris:function(){ var K=treeKit(); return {broad:world.trees.children.map(function(im){ return im.geometry.attributes.position.count/3; }), scrub:world.scrub?world.scrub.geometry.attributes.position.count/3:0}; }};
  return true;
};
module.exports={inPage};
